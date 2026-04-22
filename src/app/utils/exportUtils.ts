import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { TableData } from '../hooks/useReportData';

// ── Shared helpers ────────────────────────────────────────────────────────────

export function prettyCol(col: string) {
  return col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/** Columns we never export (internal DB keys) */
function displayColumns(columns: string[]) {
  return columns.filter(c => c !== 'model_id' && c !== 'comp_id');
}

/** Escape a CSV cell value */
function csvCell(val: unknown): string {
  const s = val == null ? '' : String(val);
  // Wrap in quotes if it contains comma, quote, or newline
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

/** Trigger a file download in the browser */
function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function safeFilename(name: string) {
  return name.replace(/[^a-z0-9_\-]/gi, '_');
}

// ── NASA brand colours ────────────────────────────────────────────────────────
const NASA_BLUE      = [11,  61, 145] as [number, number, number]; // #0B3D91
const NASA_BLUE_LIGHT= [26,  86, 176] as [number, number, number]; // #1a56b0

// ── Single sub-category: CSV ──────────────────────────────────────────────────

export function exportTableAsCSV(tableData: TableData) {
  const cols = displayColumns(tableData.columns);
  const header = cols.map(prettyCol).join(',');
  const rows   = tableData.rows.map(row =>
    cols.map(c => csvCell(row[c])).join(',')
  );
  const csv = [header, ...rows].join('\n');
  download(csv, `${safeFilename(tableData.tableName)}.csv`, 'text/csv;charset=utf-8;');
}

// ── Single sub-category: PDF ──────────────────────────────────────────────────

export function exportTableAsPDF(tableData: TableData, subtitle = '') {
  const cols = displayColumns(tableData.columns);
  const doc  = new jsPDF({ orientation: 'landscape' });

  // Title
  doc.setFontSize(16);
  doc.setTextColor(...NASA_BLUE);
  doc.text(prettyCol(tableData.tableName), 14, 18);

  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, 14, 26);
  }

  // Watermark / branding
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('NASA Small Spacecraft State-of-the-Art Report', 14, doc.internal.pageSize.getHeight() - 8);

  autoTable(doc, {
    startY: subtitle ? 32 : 24,
    head: [cols.map(prettyCol)],
    body: tableData.rows.map(row => cols.map(c => (row[c] != null ? String(row[c]) : '—'))),
    headStyles: {
      fillColor: NASA_BLUE,
      textColor: 255,
      fontSize: 7,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 7 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { overflow: 'linebreak', cellPadding: 2 },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${safeFilename(tableData.tableName)}.pdf`);
}

// ── Combined multi-chapter export type ───────────────────────────────────────

export interface ChapterExportGroup {
  chapterName: string;
  data: TableData[];
}

// ── Combined: Excel (.xlsx) — one workbook, one sheet per chapter ─────────────

export function exportCombinedAsXLSX(groups: ChapterExportGroup[], filename = 'NASA_SOAR_Export') {
  const workbook = XLSX.utils.book_new();

  for (const { chapterName, data } of groups) {
    const nonEmpty = data.filter(td => td.rows.length > 0);
    if (nonEmpty.length === 0) continue;

    // Build all rows for this sheet: each sub-category gets a title row + header + data
    const sheetRows: unknown[][] = [];

    for (const tableData of nonEmpty) {
      const cols = displayColumns(tableData.columns);

      // Sub-category title row (bold-able via cell styling, plain text here)
      sheetRows.push([prettyCol(tableData.tableName)]);

      // Column header row
      sheetRows.push(cols.map(prettyCol));

      // Data rows
      for (const row of tableData.rows) {
        sheetRows.push(cols.map(c => (row[c] != null ? row[c] : '')));
      }

      // Blank row as spacer between sub-categories
      sheetRows.push([]);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(sheetRows);

    // Sheet name max 31 chars, strip invalid Excel chars
    const sheetName = chapterName.replace(/[:\\/?*[\]]/g, '').slice(0, 31);

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  // Write and trigger download
  const wbOut = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob  = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement('a');
  a.href      = url;
  a.download  = `${safeFilename(filename)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Combined: PDF — all chapters in one file ──────────────────────────────────

export function exportCombinedAsPDF(groups: ChapterExportGroup[], filename = 'NASA_SOAR_Export') {
  const doc   = new jsPDF({ orientation: 'landscape' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // ── Cover page ───────────────────────────────────────────────────────────
  doc.setFillColor(...NASA_BLUE);
  doc.rect(0, 0, pageW, pageH, 'F');

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('NASA Small Spacecraft', pageW / 2, pageH / 2 - 18, { align: 'center' });
  doc.text('State-of-the-Art Report', pageW / 2, pageH / 2 - 4, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(180, 210, 255);
  const chapterList = groups.map(g => g.chapterName).join('  ·  ');
  const splitList   = doc.splitTextToSize(chapterList, pageW - 40);
  doc.text(splitList, pageW / 2, pageH / 2 + 14, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(120, 160, 220);
  doc.text(`Generated ${new Date().toLocaleDateString()}`, pageW / 2, pageH - 14, { align: 'center' });

  // ── Chapter sections ─────────────────────────────────────────────────────
  for (const { chapterName, data } of groups) {
    const nonEmpty = data.filter(td => td.rows.length > 0);
    if (nonEmpty.length === 0) continue;

    // Chapter divider page
    doc.addPage();
    doc.setFillColor(...NASA_BLUE);
    doc.rect(0, 0, pageW, 40, 'F');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(chapterName, pageW / 2, 24, { align: 'center' });

    let currentY = 50;

    nonEmpty.forEach((tableData) => {
      const cols = displayColumns(tableData.columns);

      if (currentY > pageH - 30) {
        doc.addPage();
        currentY = 14;
      }

      // Sub-category heading
      doc.setFontSize(10);
      doc.setTextColor(...NASA_BLUE_LIGHT);
      doc.text(prettyCol(tableData.tableName), 14, currentY);
      doc.setDrawColor(...NASA_BLUE);
      doc.setLineWidth(0.3);
      doc.line(14, currentY + 2, pageW - 14, currentY + 2);
      currentY += 7;

      autoTable(doc, {
        startY: currentY,
        head: [cols.map(prettyCol)],
        body: tableData.rows.map(row => cols.map(c => (row[c] != null ? String(row[c]) : '—'))),
        headStyles: { fillColor: NASA_BLUE, textColor: 255, fontSize: 6.5, fontStyle: 'bold' },
        bodyStyles: { fontSize: 6.5 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        styles: { overflow: 'linebreak', cellPadding: 1.5 },
        margin: { left: 14, right: 14 },
        didDrawPage: () => {
          doc.setFontSize(7);
          doc.setTextColor(180, 180, 180);
          doc.text(
            `NASA SOAR — ${chapterName}  |  Page ${doc.getNumberOfPages()}`,
            pageW / 2, pageH - 6, { align: 'center' }
          );
        },
      });

      // @ts-expect-error jspdf-autotable attaches lastAutoTable to doc
      currentY = (doc.lastAutoTable?.finalY ?? currentY) + 10;
    });
  }

  doc.save(`${safeFilename(filename)}.pdf`);
}

// ── Entire chapter: CSV ───────────────────────────────────────────────────────

export function exportChapterAsCSV(ssName: string, allData: TableData[]) {
  const sections: string[] = [];

  for (const tableData of allData) {
    if (tableData.rows.length === 0) continue;
    const cols   = displayColumns(tableData.columns);
    const header = cols.map(prettyCol).join(',');
    const rows   = tableData.rows.map(row => cols.map(c => csvCell(row[c])).join(','));
    sections.push(
      `# ${prettyCol(tableData.tableName)}`,
      header,
      ...rows,
      '' // blank line between sections
    );
  }

  download(sections.join('\n'), `${safeFilename(ssName)}.csv`, 'text/csv;charset=utf-8;');
}

// ── Entire chapter: PDF ───────────────────────────────────────────────────────

export function exportChapterAsPDF(ssName: string, allData: TableData[]) {
  const doc = new jsPDF({ orientation: 'landscape' });
  const pageW  = doc.internal.pageSize.getWidth();
  const pageH  = doc.internal.pageSize.getHeight();

  // Cover title
  doc.setFillColor(...NASA_BLUE);
  doc.rect(0, 0, pageW, 30, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('NASA Small Spacecraft State-of-the-Art Report', pageW / 2, 13, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(180, 210, 255);
  doc.text(ssName, pageW / 2, 23, { align: 'center' });

  let currentY = 38;

  const nonEmpty = allData.filter(td => td.rows.length > 0);

  nonEmpty.forEach((tableData, idx) => {
    const cols = displayColumns(tableData.columns);

    // Section heading
    if (currentY > pageH - 30) {
      doc.addPage();
      currentY = 14;
    }

    doc.setFontSize(11);
    doc.setTextColor(...NASA_BLUE_LIGHT);
    doc.text(prettyCol(tableData.tableName), 14, currentY);
    doc.setDrawColor(...NASA_BLUE);
    doc.setLineWidth(0.3);
    doc.line(14, currentY + 2, pageW - 14, currentY + 2);
    currentY += 6;

    autoTable(doc, {
      startY: currentY,
      head: [cols.map(prettyCol)],
      body: tableData.rows.map(row => cols.map(c => (row[c] != null ? String(row[c]) : '—'))),
      headStyles: {
        fillColor: NASA_BLUE,
        textColor: 255,
        fontSize: 6.5,
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 6.5 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      styles: { overflow: 'linebreak', cellPadding: 1.5 },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        // Footer on every page
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 180);
        doc.text(
          `NASA SOAR — ${ssName}  |  Page ${doc.getNumberOfPages()}`,
          pageW / 2,
          pageH - 6,
          { align: 'center' }
        );
      },
    });

    // @ts-expect-error jspdf-autotable attaches lastAutoTable to doc
    currentY = (doc.lastAutoTable?.finalY ?? currentY) + (idx < nonEmpty.length - 1 ? 10 : 0);
  });

  doc.save(`${safeFilename(ssName)}_full_chapter.pdf`);
}
