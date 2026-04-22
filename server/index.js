const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Railway (production) or local Postgres (development)
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: 'localhost',
        port: 5432,
        database: 'Sub-System_DB',
        user: process.env.DB_USER || require('os').userInfo().username,
      }
);

// Build a map of comp_id → table_name at startup
let compIdToTable = {};

async function buildCompIdMapping() {
  const client = await pool.connect();
  try {
    // Get all tables that have a comp_id column
    const tablesRes = await client.query(`
      SELECT table_name
      FROM information_schema.columns
      WHERE column_name = 'comp_id'
        AND table_schema = 'public'
        AND table_name != 'comptype'
      ORDER BY table_name
    `);

    for (const row of tablesRes.rows) {
      const tableName = row.table_name;
      try {
        const res = await client.query(
          `SELECT DISTINCT comp_id FROM "${tableName}" WHERE comp_id IS NOT NULL`
        );
        for (const r of res.rows) {
          compIdToTable[r.comp_id] = tableName;
        }
      } catch (e) {
        // skip tables that fail
      }
    }
    console.log(`Mapped ${Object.keys(compIdToTable).length} component types to tables`);
  } finally {
    client.release();
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/subsystems
// Returns all subsystems (chapters) with their component types (subsections)
app.get('/api/subsystems', async (req, res) => {
  try {
    const subsystems = await pool.query(
      'SELECT ss_id, ss_name, ss_code FROM subsystem ORDER BY ss_id'
    );
    const comptypes = await pool.query(
      'SELECT comp_id, ss_id, comptype_name, comptype_code FROM comptype ORDER BY comp_id'
    );

    const result = subsystems.rows.map(ss => ({
      ...ss,
      comptypes: comptypes.rows
        .filter(ct => ct.ss_id === ss.ss_id)
        .map(ct => ({
          ...ct,
          hasData: !!compIdToTable[ct.comp_id],
        })),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/comptypes/:compId/data
// Returns all rows from the table for a given component type
app.get('/api/comptypes/:compId/data', async (req, res) => {
  const compId = parseInt(req.params.compId);
  const tableName = compIdToTable[compId];

  if (!tableName) {
    return res.status(404).json({ error: 'No data table found for this component type' });
  }

  try {
    const result = await pool.query(`SELECT * FROM "${tableName}" ORDER BY 1`);
    res.json({
      tableName,
      columns: result.fields.map(f => f.name),
      rows: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/search?q=term
// Searches organization + model columns across all product tables
app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);

  const searchTerm = `%${q.toLowerCase()}%`;
  const results = [];

  // Tables that have both organization and model-like text columns
  const searchableTables = Object.values(compIdToTable);
  const uniqueTables = [...new Set(searchableTables)];

  const client = await pool.connect();
  try {
    // Get text columns for each table
    const colsRes = await client.query(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND data_type IN ('text', 'character varying')
        AND table_name = ANY($1)
      ORDER BY table_name, ordinal_position
    `, [uniqueTables]);

    // Group columns by table
    const tableColumns = {};
    for (const row of colsRes.rows) {
      if (!tableColumns[row.table_name]) tableColumns[row.table_name] = [];
      tableColumns[row.table_name].push(row.column_name);
    }

    // Search each table
    for (const [tableName, cols] of Object.entries(tableColumns)) {
      if (cols.length === 0) continue;

      const conditions = cols.map(col => `LOWER("${col}") LIKE $1`).join(' OR ');
      try {
        const rows = await client.query(
          `SELECT * FROM "${tableName}" WHERE ${conditions} LIMIT 20`,
          [searchTerm]
        );

        // Find the comp_id for this table
        const compId = Object.keys(compIdToTable).find(
          id => compIdToTable[id] === tableName
        );

        for (const row of rows.rows) {
          results.push({
            tableName,
            compId: compId ? parseInt(compId) : null,
            row,
          });
        }
      } catch (e) {
        // skip
      }
    }
  } finally {
    client.release();
  }

  res.json(results);
});

// PATCH /api/comptypes/:compId/rows/:modelId
// Admin: update a single cell in the DB
app.patch('/api/comptypes/:compId/rows/:modelId', async (req, res) => {
  try {
    const compId = parseInt(req.params.compId);
    const modelId = parseInt(req.params.modelId);
    const { field, value } = req.body;

    if (!field) return res.status(400).json({ error: 'Missing field name' });
    if (isNaN(compId)) return res.status(400).json({ error: 'Invalid compId' });
    if (isNaN(modelId)) return res.status(400).json({ error: 'Invalid modelId' });

    const tableName = compIdToTable[compId];
    if (!tableName) return res.status(404).json({ error: `Unknown compId: ${compId}` });

    // Validate field exists in this table (prevents SQL injection)
    const colCheck = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
      [tableName, field]
    );
    if (colCheck.rows.length === 0) {
      return res.status(400).json({ error: `Column "${field}" not found in table "${tableName}"` });
    }

    // Cast value to the correct type so Postgres doesn't reject it
    const dataType = colCheck.rows[0].data_type;
    let castValue = value === '' || value === null ? null : value;
    if (castValue !== null && (dataType.includes('int') || dataType.includes('numeric') || dataType.includes('float') || dataType.includes('double') || dataType.includes('real'))) {
      castValue = Number(castValue);
      if (isNaN(castValue)) return res.status(400).json({ error: `"${value}" is not a valid number for column "${field}"` });
    }

    const result = await pool.query(
      `UPDATE "${tableName}" SET "${field}" = $1 WHERE model_id = $2 RETURNING *`,
      [castValue, modelId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: `No row found with model_id = ${modelId}` });

    console.log(`Admin update: ${tableName}.${field} = ${castValue} (model_id=${modelId})`);
    res.json({ success: true, row: result.rows[0] });
  } catch (err) {
    console.error('Admin PATCH error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = 3001;

buildCompIdMapping().then(() => {
  app.listen(PORT, () => {
    console.log(`NASA Report API running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to build comp_id mapping:', err.message);
  process.exit(1);
});
