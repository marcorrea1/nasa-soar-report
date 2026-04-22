import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { TOCSidebar } from './TOCSidebar';
import { TopNav } from './TopNav';
import { RequestUpdateModal } from './RequestUpdateModal';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { DownloadCartTray } from './DownloadCartTray';
import { DownloadProgressModal } from './DownloadProgressModal';
import { TechnologyDetailModal } from './TechnologyDetailModal';
import { useSubsystems, useComptypeData, useSearch } from '../hooks/useReportData';
import { Filter, ShoppingCart, Loader2, Table2, FileText, FileSpreadsheet, Pin, PinOff, Pencil, Check, X } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { ExportBuilderPanel } from './ExportBuilderPanel';
import {
  exportTableAsCSV,
  exportTableAsPDF,
  exportChapterAsCSV,
  exportChapterAsPDF,
} from '../utils/exportUtils';
import { fetchComptypeData } from '../hooks/useReportData';

// Pretty-print a snake_case column name
function prettyCol(col: string) {
  return col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Raw DB data table — sticky columns + admin inline editing
function DataTable(props: { columns: string[]; rows: Record<string, unknown>[]; compId: number | null }) {
  const { columns, rows: initialRows, compId } = props;
  const { isAdmin } = useAdmin();
  const displayCols = columns.filter(c => c !== 'model_id' && c !== 'comp_id');

  // Local copy of rows so edits reflect immediately without a refetch.
  // Only reset when the table itself changes (different compId / columns),
  // NOT on every parent render (which would wipe local edits).
  const [rows, setRows] = useState(initialRows);
  const tableKey = columns.join(',');
  const prevTableKey = useRef(tableKey);
  useEffect(() => {
    if (prevTableKey.current !== tableKey) {
      prevTableKey.current = tableKey;
      setRows(initialRows);
    }
  });

  // Editing state: which cell is active
  const [editingCell, setEditingCell] = useState<{ rowIdx: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [savingCell, setSavingCell] = useState<{ rowIdx: number; col: string } | null>(null);
  const [savedCells, setSavedCells] = useState<Set<string>>(new Set()); // "rowIdx:col"
  const [errorCells, setErrorCells] = useState<Map<string, string>>(new Map());
  const [lastError, setLastError] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus input when a cell enters edit mode
  useEffect(() => {
    if (editingCell) editInputRef.current?.focus();
  }, [editingCell]);

  function startEdit(rowIdx: number, col: string) {
    if (!isAdmin || !compId) return;
    setEditingCell({ rowIdx, col });
    setEditValue(rows[rowIdx][col] != null ? String(rows[rowIdx][col]) : '');
  }

  function cancelEdit() {
    setEditingCell(null);
    setEditValue('');
  }

  const saveEdit = useCallback(async () => {
    if (!editingCell || !compId) return;
    const { rowIdx, col } = editingCell;
    const modelId = rows[rowIdx]['model_id'];
    if (modelId == null) return;

    const cellKey = `${rowIdx}:${col}`;
    setSavingCell({ rowIdx, col });
    setEditingCell(null);

    try {
      const res = await fetch(`http://localhost:3001/api/comptypes/${compId}/rows/${modelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: col, value: editValue }),
      });
      if (!res.ok) {
        let msg = `Server error (${res.status})`;
        try {
          const errJson = await res.json();
          msg = errJson.error || msg;
        } catch {
          // response was HTML, not JSON — probably a missing route
          msg = `Server returned ${res.status} — make sure the backend is running with the latest code`;
        }
        throw new Error(msg);
      }
      // Optimistically update local row
      setRows(prev => prev.map((r, i) => i === rowIdx ? { ...r, [col]: editValue === '' ? null : editValue } : r));
      setSavedCells(prev => { const n = new Set(prev); n.add(cellKey); return n; });
      setTimeout(() => setSavedCells(prev => { const n = new Set(prev); n.delete(cellKey); return n; }), 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setErrorCells(prev => new Map(prev).set(cellKey, msg));
      setLastError(msg);
      setTimeout(() => setErrorCells(prev => { const n = new Map(prev); n.delete(cellKey); return n; }), 4000);
      setTimeout(() => setLastError(null), 6000);
    } finally {
      setSavingCell(null);
    }
  }, [editingCell, editValue, compId, rows]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  }

  // Locked column indices, stored by original position in displayCols
  const [lockedSet, setLockedSet] = useState<Set<number>>(new Set());

  // Measure rendered widths of locked columns for stacking offsets
  const [lockedWidths, setLockedWidths] = useState<number[]>([]);
  const lockedThRefs = useRef<(HTMLTableCellElement | null)[]>([]);

  // Reset when sub-category changes
  useEffect(() => { setLockedSet(new Set()); }, [columns.join(',')]);

  // Locked columns sorted by original order, then unlocked columns in original order
  const lockedIndices  = [...lockedSet].sort((a, b) => a - b);
  const unlockedIndices = displayCols.map((_, i) => i).filter(i => !lockedSet.has(i));
  // Final render order: locked first (left), then unlocked
  const orderedIndices = [...lockedIndices, ...unlockedIndices];

  // Measure locked column widths only when the locked set changes
  useEffect(() => {
    const widths = lockedThRefs.current.slice(0, lockedIndices.length).map(el => el?.offsetWidth ?? 0);
    setLockedWidths(prev =>
      prev.length === widths.length && prev.every((w, i) => w === widths[i]) ? prev : widths
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedSet]);

  // Cumulative left offset for each locked column slot (0, w0, w0+w1, ...)
  function stickyLeft(lockedSlot: number) {
    let left = 0;
    for (let s = 0; s < lockedSlot; s++) left += lockedWidths[s] ?? 0;
    return left;
  }

  function toggleLock(originalIndex: number) {
    setLockedSet(prev => {
      const next = new Set(prev);
      next.has(originalIndex) ? next.delete(originalIndex) : next.add(originalIndex);
      return next;
    });
  }

  const lockedCount = lockedSet.size;
  const lockedNames = lockedIndices.map(i => prettyCol(displayCols[i]));

  if (rows.length === 0) return <p className="text-sm text-gray-500 italic">No data available.</p>;
  return (
    <div className="space-y-2">
      {/* Save error banner — shown outside the scroll area so it's always visible */}
      {lastError && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <span className="flex items-center gap-2">
            <X className="size-4 flex-shrink-0 text-red-500" />
            <strong>Save failed:</strong> {lastError}
          </span>
          <button onClick={() => setLastError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0">
            <X className="size-4" />
          </button>
        </div>
      )}
    <div className="rounded-lg border border-gray-200">
      {lockedCount > 0 && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50 border-b border-blue-100 text-xs text-blue-700 rounded-t-lg">
          <span className="flex items-center gap-1.5">
            <Pin className="size-3 flex-shrink-0" />
            <strong>{lockedCount} column{lockedCount > 1 ? 's' : ''} locked:</strong>
            <span className="text-blue-600">{lockedNames.join(', ')}</span>
          </span>
          <button
            onClick={() => setLockedSet(new Set())}
            className="ml-4 flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors"
          >
            <PinOff className="size-3" /> Unlock all
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#0B3D91] text-white">
            {orderedIndices.map((origIdx, renderPos) => {
              const col = displayCols[origIdx];
              const isLocked = lockedSet.has(origIdx);
              const lockedSlot = lockedIndices.indexOf(origIdx); // -1 if not locked
              const isLastLocked = isLocked && lockedSlot === lockedCount - 1;
              return (
                <th
                  key={col}
                  ref={isLocked ? (el => { lockedThRefs.current[lockedSlot] = el; }) : undefined}
                  className={
                    'px-4 py-2.5 text-left font-medium whitespace-nowrap text-xs group relative' +
                    (isLocked
                      ? ' sticky z-20 bg-[#0B3D91]' + (isLastLocked ? ' shadow-[2px_0_8px_rgba(0,0,0,0.3)]' : '')
                      : '')
                  }
                  style={isLocked ? { left: stickyLeft(lockedSlot) } : undefined}
                >
                  <span className="flex items-center gap-1.5">
                    {prettyCol(col)}
                    <button
                      onClick={() => toggleLock(origIdx)}
                      title={isLocked ? 'Unlock column' : 'Lock this column'}
                      className={
                        'transition-all rounded ' +
                        (isLocked
                          ? 'opacity-100 text-yellow-300 hover:text-yellow-100'
                          : 'opacity-0 group-hover:opacity-100 text-white/50 hover:text-white')
                      }
                    >
                      {isLocked ? <PinOff className="size-3" /> : <Pin className="size-3" />}
                    </button>
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const rowBg = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            return (
              <tr key={i} className={rowBg}>
                {orderedIndices.map((origIdx) => {
                  const col = displayCols[origIdx];
                  const isLocked = lockedSet.has(origIdx);
                  const lockedSlot = lockedIndices.indexOf(origIdx);
                  const isLastLocked = isLocked && lockedSlot === lockedCount - 1;
                  const cellKey = `${i}:${col}`;
                  const isEditing = editingCell?.rowIdx === i && editingCell?.col === col;
                  const isSaving = savingCell?.rowIdx === i && savingCell?.col === col;
                  const isSaved = savedCells.has(cellKey);
                  const hasError = errorCells.has(cellKey);

                  return (
                    <td
                      key={col}
                      onClick={() => !isEditing && startEdit(i, col)}
                      className={[
                        'border-b border-gray-100 whitespace-nowrap transition-colors',
                        isLocked
                          ? `sticky z-10 font-medium ${rowBg}` + (isLastLocked ? ' shadow-[2px_0_8px_rgba(0,0,0,0.12)]' : '')
                          : '',
                        isAdmin && compId ? 'cursor-pointer hover:bg-blue-50 group/cell' : 'px-4 py-2 text-gray-800',
                        isSaved ? '!bg-green-50' : '',
                        hasError ? '!bg-red-50' : '',
                        isSaving ? 'opacity-60' : '',
                      ].join(' ')}
                      style={isLocked ? { left: stickyLeft(lockedSlot) } : undefined}
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-1 px-1 py-0.5">
                          <input
                            ref={editInputRef}
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={saveEdit}
                            className="min-w-[80px] w-full px-2 py-1 text-sm border border-blue-400 rounded outline-none ring-2 ring-blue-200 bg-white text-gray-900"
                          />
                          <button onMouseDown={e => { e.preventDefault(); saveEdit(); }} className="text-green-600 hover:text-green-700 flex-shrink-0">
                            <Check className="size-3.5" />
                          </button>
                          <button onMouseDown={e => { e.preventDefault(); cancelEdit(); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="px-4 py-2 flex items-center gap-1.5 min-w-[60px]">
                          {isSaving ? (
                            <span className="size-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
                          ) : isSaved ? (
                            <Check className="size-3 text-green-500 flex-shrink-0" />
                          ) : hasError ? (
                            <span title={errorCells.get(cellKey)} className="size-3 text-red-500 flex-shrink-0">!</span>
                          ) : null}
                          <span className={`text-gray-800 ${isSaved ? 'text-green-700' : ''} ${hasError ? 'text-red-700' : ''}`}>
                            {row[col] != null ? String(row[col]) : '—'}
                          </span>
                          {isAdmin && compId && !isSaving && !isEditing && (
                            <Pencil className="size-3 text-blue-300 opacity-0 group-hover/cell:opacity-100 transition-opacity flex-shrink-0 ml-auto" />
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
    </div>
  );
}

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ── URL is the single source of truth ──────────────────────────────────────
  const urlQuery  = searchParams.get('q')    || '';
  const urlSsId   = searchParams.get('ss')   ? parseInt(searchParams.get('ss')!)   : null;
  const urlCompId = searchParams.get('comp') ? parseInt(searchParams.get('comp')!) : null;

  // ── Real data from API ─────────────────────────────────────────────────────
  const { subsystems } = useSubsystems();
  const { data: tableData, loading: tableLoading } = useComptypeData(urlCompId);
  const { results: searchResults, loading: searchLoading } = useSearch(urlQuery);

  // ── Local UI state only (not navigation) ───────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<{ title: string; ssId: number } | null>(null);
  const [detailRow, setDetailRow] = useState<{ row: Record<string, unknown>; comptype: string } | null>(null);
  const [exportPanelOpen, setExportPanelOpen] = useState(false);
  const [downloadCart, setDownloadCart] = useState<Array<{ id: string; chapterNumber: number; title: string }>>([]);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [exportingChapter, setExportingChapter] = useState(false);

  async function handleExportChapter(format: 'csv' | 'pdf') {
    if (!activeSubsystem) return;
    setExportingChapter(true);
    try {
      const comptypes = activeSubsystem.comptypes.filter(ct => ct.hasData);
      const allData = await Promise.all(comptypes.map(ct => fetchComptypeData(ct.comp_id)));
      if (format === 'csv') exportChapterAsCSV(activeSubsystem.ss_name, allData);
      else exportChapterAsPDF(activeSubsystem.ss_name, allData);
    } finally {
      setExportingChapter(false);
    }
  }

  // ── Derived data ───────────────────────────────────────────────────────────
  const activeSubsystem = useMemo(
    () => subsystems.find(s => s.ss_id === urlSsId) ?? null,
    [subsystems, urlSsId]
  );

  const activeComptype = useMemo(() => {
    if (!urlCompId) return null;
    for (const ss of subsystems) {
      const ct = ss.comptypes.find(c => c.comp_id === urlCompId);
      if (ct) return ct;
    }
    return null;
  }, [subsystems, urlCompId]);

  // Sub-category options for the cascading filter (based on selected chapter)
  const subcategoryOptions = useMemo(() => {
    if (!urlSsId) return [];
    return (activeSubsystem?.comptypes ?? [])
      .filter(ct => ct.hasData)
      .map(ct => ({ value: String(ct.comp_id), label: ct.comptype_name }));
  }, [urlSsId, activeSubsystem]);

  // ── Navigation helpers (all changes go through the URL) ────────────────────
  const handleSearch = (q: string) => navigate(`/search?q=${encodeURIComponent(q)}`);

  const handleSubsystemClick = (ssId: number) => navigate(`/search?ss=${ssId}`);

  const handleComptypeClick = (_ssId: number, compId: number) =>
    navigate(`/search?ss=${_ssId}&comp=${compId}`);

  const handleChapterFilterChange = (values: string[]) => {
    if (values.length === 0) navigate('/search');
    else navigate(`/search?ss=${values[values.length - 1]}`);
  };

  const handleSubcategoryFilterChange = (values: string[]) => {
    if (values.length === 0) navigate(`/search?ss=${urlSsId}`);
    else navigate(`/search?ss=${urlSsId}&comp=${values[values.length - 1]}`);
  };

  // ── Cart helpers ───────────────────────────────────────────────────────────
  const toggleCart = (id: string, chapterNumber: number, title: string) =>
    setDownloadCart(prev =>
      prev.some(i => i.id === id) ? prev.filter(i => i.id !== id) : [...prev, { id, chapterNumber, title }]
    );

  // ── What to show ───────────────────────────────────────────────────────────
  const showSearch             = !!urlQuery;
  const showTable              = !showSearch && !!urlCompId;
  const showSubcategories      = !showSearch && !showTable && !!urlSsId;
  const showBrowse             = !showSearch && !showTable && !urlSsId;

  return (
    <div className="h-screen flex flex-col">
      <TopNav onSearch={handleSearch} searchQuery={urlQuery} onOpenExport={() => setExportPanelOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* TOC Sidebar */}
        <TOCSidebar
          activeSubsystemId={urlSsId ?? undefined}
          activeComptypeId={urlCompId ?? undefined}
          onSubsystemClick={handleSubsystemClick}
          onComptypeClick={handleComptypeClick}
        />

        {/* Main area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-6xl mx-auto p-8">

            {/* ── Filters ─────────────────────────────────────────────────── */}
            {!showSearch && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="size-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filters</span>
                  </div>
                  {downloadCart.length > 0 && (
                    <button
                      onClick={() => setDownloadModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#0B3D91] font-medium"
                    >
                      <ShoppingCart className="size-4" />
                      Combine {downloadCart.length} items
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Chapter filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Filter by Chapter</label>
                    <MultiSelectDropdown
                      options={subsystems.map(ss => ({ value: String(ss.ss_id), label: ss.ss_name }))}
                      selectedValues={urlSsId ? [String(urlSsId)] : []}
                      onChange={handleChapterFilterChange}
                      placeholder="All Chapters"
                    />
                  </div>

                  {/* Sub-category filter — only when a chapter is selected */}
                  {urlSsId && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Filter by Sub-Category
                        <span className="ml-1 text-gray-400 font-normal">({activeSubsystem?.ss_name})</span>
                      </label>
                      <MultiSelectDropdown
                        options={subcategoryOptions}
                        selectedValues={urlCompId ? [String(urlCompId)] : []}
                        onChange={handleSubcategoryFilterChange}
                        placeholder="All Sub-Categories"
                      />
                    </div>
                  )}
                </div>

                {/* Active filter pills */}
                {(urlSsId || urlCompId) && (
                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-gray-500">Active:</span>
                    {activeSubsystem && (
                      <span className="text-xs bg-blue-100 text-[#0B3D91] px-2 py-0.5 rounded-full font-medium">
                        {activeSubsystem.ss_name}
                      </span>
                    )}
                    {activeComptype && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                        {activeComptype.comptype_name}
                      </span>
                    )}
                    <button
                      onClick={() => navigate('/search')}
                      className="text-xs text-gray-400 hover:text-gray-600 underline ml-1"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Search results ───────────────────────────────────────────── */}
            {showSearch && (
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                  Search Results for &ldquo;{urlQuery}&rdquo;
                </h1>
                {searchLoading ? (
                  <div className="flex items-center gap-2 text-gray-500 py-8">
                    <Loader2 className="size-5 animate-spin" />
                    <span>Searching database...</span>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">No results found for &ldquo;{urlQuery}&rdquo;</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">{searchResults.length} results found</p>
                    {searchResults.map((result, i) => {
                      const row = result.row as Record<string, unknown>;
                      const name  = row['organization'] || row['model'] || row['product'] || 'Entry';
                      const model = row['model'] || row['product'] || '';
                      return (
                        <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-medium">
                                {result.tableName.replace(/_/g, ' ')}
                              </span>
                              <h3 className="text-base font-semibold text-gray-900 mt-2">
                                {String(name)}{model && name !== model ? ` — ${String(model)}` : ''}
                              </h3>
                            </div>
                            <button
                              onClick={() => setDetailRow({ row, comptype: result.tableName })}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B3D91] text-white text-xs font-medium rounded-md hover:bg-[#0a3380]"
                            >
                              <Table2 className="size-3.5" />
                              View Details
                            </button>
                          </div>
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(row)
                              .filter(([k]) => k !== 'model_id' && k !== 'comp_id')
                              .slice(0, 6)
                              .map(([k, v]) => (
                                <div key={k} className="text-xs">
                                  <span className="text-gray-400">{prettyCol(k)}: </span>
                                  <span className="text-gray-700">{v != null ? String(v) : '—'}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Chapter selected → show its sub-categories ──────────────── */}
            {showSubcategories && activeSubsystem && (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <button onClick={() => navigate('/search')} className="hover:text-[#0B3D91]">
                    All Chapters
                  </button>
                  <span>/</span>
                  <span className="text-gray-700 font-medium">{activeSubsystem.ss_name}</span>
                </div>

                <div className="flex items-start justify-between mb-1 gap-4 flex-wrap">
                  <h1 className="text-2xl font-semibold text-gray-900">{activeSubsystem.ss_name}</h1>
                  {/* Chapter-level export buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleExportChapter('csv')}
                      disabled={exportingChapter}
                      className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {exportingChapter
                        ? <Loader2 className="size-4 animate-spin" />
                        : <FileSpreadsheet className="size-4 text-green-600" />}
                      Export Chapter CSV
                    </button>
                    <button
                      onClick={() => handleExportChapter('pdf')}
                      disabled={exportingChapter}
                      className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {exportingChapter
                        ? <Loader2 className="size-4 animate-spin" />
                        : <FileText className="size-4 text-red-500" />}
                      Export Chapter PDF
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  {activeSubsystem.comptypes.filter(ct => ct.hasData).length} sub-categories — click one to view its data
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSubsystem.comptypes
                    .filter(ct => ct.hasData)
                    .map(ct => (
                      <button
                        key={ct.comp_id}
                        onClick={() => handleComptypeClick(activeSubsystem.ss_id, ct.comp_id)}
                        className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:shadow-md hover:border-[#0B3D91] transition-all group"
                      >
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded mb-3 inline-block">
                          {ct.comptype_code}
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#0B3D91] leading-snug">
                          {ct.comptype_name}
                        </h3>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* ── Sub-category selected → show data table ─────────────────── */}
            {showTable && (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <button onClick={() => navigate('/search')} className="hover:text-[#0B3D91]">
                    All Chapters
                  </button>
                  <span>/</span>
                  <button
                    onClick={() => navigate(`/search?ss=${urlSsId}`)}
                    className="hover:text-[#0B3D91]"
                  >
                    {activeSubsystem?.ss_name}
                  </button>
                  <span>/</span>
                  <span className="text-gray-700 font-medium">{activeComptype?.comptype_name}</span>
                </div>

                <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                  <h1 className="text-2xl font-semibold text-gray-900">{activeComptype?.comptype_name}</h1>
                  {/* Sub-category export buttons — only when data is loaded */}
                  {tableData && !tableLoading && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => exportTableAsCSV(tableData)}
                        className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        <FileSpreadsheet className="size-4 text-green-600" />
                        Export CSV
                      </button>
                      <button
                        onClick={() => exportTableAsPDF(tableData, activeSubsystem?.ss_name)}
                        className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        <FileText className="size-4 text-red-500" />
                        Export PDF
                      </button>
                    </div>
                  )}
                </div>

                {tableLoading ? (
                  <div className="flex items-center gap-2 text-gray-500 py-8">
                    <Loader2 className="size-5 animate-spin" />
                    <span>Loading data...</span>
                  </div>
                ) : tableData ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-3">{tableData.rows.length} records</p>
                    <DataTable columns={tableData.columns} rows={tableData.rows} compId={urlCompId} />
                  </div>
                ) : (
                  <p className="text-gray-500">No data available.</p>
                )}
              </div>
            )}

            {/* ── Landing / browse all chapters ───────────────────────────── */}
            {showBrowse && (
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Browse All Chapters</h1>
                <p className="text-gray-500 text-sm mb-6">
                  Select a chapter to explore its sub-categories and data.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subsystems.map((ss, i) => (
                    <button
                      key={ss.ss_id}
                      onClick={() => handleSubsystemClick(ss.ss_id)}
                      className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:shadow-md hover:border-[#0B3D91] transition-all group"
                    >
                      <span className="text-xs font-bold text-white bg-[#0B3D91] px-2 py-0.5 rounded mb-3 inline-block">
                        Chapter {i + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#0B3D91] mb-1">
                        {ss.ss_name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {ss.comptypes.filter(ct => ct.hasData).length} sub-categories
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedSection && (
        <RequestUpdateModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          sectionTitle={selectedSection.title}
          chapterNumber={selectedSection.ssId}
        />
      )}

      {detailRow && (
        <TechnologyDetailModal
          tech={{
            id: 'detail', chapterId: '', chapterNumber: 0, subsectionId: '',
            title: String(detailRow.row['organization'] || detailRow.row['model'] || 'Entry'),
            category: detailRow.comptype, trl: 0,
            manufacturer: String(detailRow.row['organization'] || ''),
            summary: '',
            specs: Object.fromEntries(
              Object.entries(detailRow.row)
                .filter(([k]) => k !== 'model_id' && k !== 'comp_id')
                .map(([k, v]) => [prettyCol(k), v != null ? String(v) : '—'])
            ),
            recentDevelopments: '',
          }}
          isOpen={true}
          onClose={() => setDetailRow(null)}
        />
      )}

      {/* Export Builder Panel */}
      <ExportBuilderPanel
        isOpen={exportPanelOpen}
        onClose={() => setExportPanelOpen(false)}
        subsystems={subsystems}
      />

      <DownloadCartTray
        items={downloadCart}
        onRemoveItem={id => setDownloadCart(prev => prev.filter(i => i.id !== id))}
        onClearAll={() => setDownloadCart([])}
        onDownloadCombined={() => setDownloadModalOpen(true)}
      />
      <DownloadProgressModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        itemCount={downloadCart.length}
        onDownloadIndividually={() => setDownloadModalOpen(false)}
      />
    </div>
  );
}
