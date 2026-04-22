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

// Build a map of comp_id → { tableName, schema, qualifiedName } at startup
let compIdToTable = {};

async function buildCompIdMapping() {
  const client = await pool.connect();
  try {
    // Find all tables with comp_id across all non-system schemas
    const tablesRes = await client.query(`
      SELECT DISTINCT table_schema, table_name
      FROM information_schema.columns
      WHERE column_name = 'comp_id'
        AND table_schema NOT IN ('information_schema', 'pg_catalog')
        AND table_name != 'comptype'
      ORDER BY table_name
    `);

    const schemas = [...new Set(tablesRes.rows.map(r => r.table_schema))];
    console.log('Schemas found:', schemas);

    for (const row of tablesRes.rows) {
      const { table_schema, table_name } = row;
      const qualifiedName = `"${table_schema}"."${table_name}"`;
      try {
        const res = await client.query(
          `SELECT DISTINCT comp_id FROM ${qualifiedName} WHERE comp_id IS NOT NULL`
        );
        for (const r of res.rows) {
          compIdToTable[r.comp_id] = { tableName: table_name, schema: table_schema, qualifiedName };
        }
      } catch (e) {
        console.log(`Skipping ${qualifiedName}:`, e.message);
      }
    }
    console.log(`Mapped ${Object.keys(compIdToTable).length} component types to tables`);
  } finally {
    client.release();
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/subsystems
app.get('/api/subsystems', async (req, res) => {
  try {
    // Try public schema first, then fall back to any schema with subsystem table
    let subsystems, comptypes;
    try {
      subsystems = await pool.query('SELECT ss_id, ss_name, ss_code FROM subsystem ORDER BY ss_id');
      comptypes = await pool.query('SELECT comp_id, ss_id, comptype_name, comptype_code FROM comptype ORDER BY comp_id');
    } catch (e) {
      // Try with schema prefix
      const schemaRes = await pool.query(`
        SELECT DISTINCT table_schema FROM information_schema.tables
        WHERE table_name = 'subsystem' AND table_schema NOT IN ('information_schema', 'pg_catalog')
      `);
      const schema = schemaRes.rows[0]?.table_schema || 'public';
      subsystems = await pool.query(`SELECT ss_id, ss_name, ss_code FROM "${schema}".subsystem ORDER BY ss_id`);
      comptypes = await pool.query(`SELECT comp_id, ss_id, comptype_name, comptype_code FROM "${schema}".comptype ORDER BY comp_id`);
    }

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
app.get('/api/comptypes/:compId/data', async (req, res) => {
  const compId = parseInt(req.params.compId);
  const entry = compIdToTable[compId];

  if (!entry) {
    return res.status(404).json({ error: 'No data table found for this component type' });
  }

  try {
    const result = await pool.query(`SELECT * FROM ${entry.qualifiedName} ORDER BY 1`);
    res.json({
      tableName: entry.tableName,
      columns: result.fields.map(f => f.name),
      rows: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/search?q=term
app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);

  const searchTerm = `%${q.toLowerCase()}%`;
  const results = [];

  const uniqueEntries = Object.entries(compIdToTable).reduce((acc, [compId, entry]) => {
    if (!acc.find(e => e.qualifiedName === entry.qualifiedName)) {
      acc.push({ compId: parseInt(compId), ...entry });
    }
    return acc;
  }, []);

  const client = await pool.connect();
  try {
    for (const entry of uniqueEntries) {
      // Get text columns for this table
      const colsRes = await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = $1
          AND table_name = $2
          AND data_type IN ('text', 'character varying')
        ORDER BY ordinal_position
      `, [entry.schema, entry.tableName]);

      const cols = colsRes.rows.map(r => r.column_name);
      if (cols.length === 0) continue;

      const conditions = cols.map(col => `LOWER("${col}") LIKE $1`).join(' OR ');
      try {
        const rows = await client.query(
          `SELECT * FROM ${entry.qualifiedName} WHERE ${conditions} LIMIT 20`,
          [searchTerm]
        );
        for (const row of rows.rows) {
          results.push({ tableName: entry.tableName, compId: entry.compId, row });
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
app.patch('/api/comptypes/:compId/rows/:modelId', async (req, res) => {
  try {
    const compId = parseInt(req.params.compId);
    const modelId = parseInt(req.params.modelId);
    const { field, value } = req.body;

    if (!field) return res.status(400).json({ error: 'Missing field name' });
    if (isNaN(compId)) return res.status(400).json({ error: 'Invalid compId' });
    if (isNaN(modelId)) return res.status(400).json({ error: 'Invalid modelId' });

    const entry = compIdToTable[compId];
    if (!entry) return res.status(404).json({ error: `Unknown compId: ${compId}` });

    // Validate field exists in this table (prevents SQL injection)
    const colCheck = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2 AND column_name = $3`,
      [entry.schema, entry.tableName, field]
    );
    if (colCheck.rows.length === 0) {
      return res.status(400).json({ error: `Column "${field}" not found in table "${entry.tableName}"` });
    }

    const dataType = colCheck.rows[0].data_type;
    let castValue = value === '' || value === null ? null : value;
    if (castValue !== null && (dataType.includes('int') || dataType.includes('numeric') || dataType.includes('float') || dataType.includes('double') || dataType.includes('real'))) {
      castValue = Number(castValue);
      if (isNaN(castValue)) return res.status(400).json({ error: `"${value}" is not a valid number for column "${field}"` });
    }

    const result = await pool.query(
      `UPDATE ${entry.qualifiedName} SET "${field}" = $1 WHERE model_id = $2 RETURNING *`,
      [castValue, modelId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: `No row found with model_id = ${modelId}` });

    console.log(`Admin update: ${entry.qualifiedName}.${field} = ${castValue} (model_id=${modelId})`);
    res.json({ success: true, row: result.rows[0] });
  } catch (err) {
    console.error('Admin PATCH error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

buildCompIdMapping().then(() => {
  app.listen(PORT, () => {
    console.log(`NASA Report API running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to build comp_id mapping:', err.message);
  console.error('DATABASE_URL set?', !!process.env.DATABASE_URL);
  process.exit(1);
});
