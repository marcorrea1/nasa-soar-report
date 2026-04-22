import { useState, useMemo } from 'react';
import {
  X, ChevronDown, ChevronRight,
  FileText, FileSpreadsheet, Loader2,
  CheckSquare, Square, MinusSquare, Download
} from 'lucide-react';
import type { Subsystem } from '../hooks/useReportData';
import { fetchComptypeData } from '../hooks/useReportData';
import {
  exportCombinedAsXLSX,
  exportCombinedAsPDF,
  exportTableAsCSV,
  exportTableAsPDF,
  type ChapterExportGroup,
} from '../utils/exportUtils';
import type { TableData } from '../hooks/useReportData';

interface ExportBuilderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  subsystems: Subsystem[];
}

export function ExportBuilderPanel({ isOpen, onClose, subsystems }: ExportBuilderPanelProps) {
  // Selected comp_ids (individual sub-categories)
  const [selectedCompIds, setSelectedCompIds] = useState<Set<number>>(new Set());
  const [expandedSsIds, setExpandedSsIds] = useState<Set<number>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | null>(null);

  // ── Selection helpers ─────────────────────────────────────────────────────

  function toggleSubsystem(ss: Subsystem) {
    const ids = ss.comptypes.filter(ct => ct.hasData).map(ct => ct.comp_id);
    const allSelected = ids.every(id => selectedCompIds.has(id));
    setSelectedCompIds(prev => {
      const next = new Set(prev);
      if (allSelected) ids.forEach(id => next.delete(id));
      else ids.forEach(id => next.add(id));
      return next;
    });
  }

  function toggleComptype(compId: number) {
    setSelectedCompIds(prev => {
      const next = new Set(prev);
      next.has(compId) ? next.delete(compId) : next.add(compId);
      return next;
    });
  }

  function toggleExpand(ssId: number) {
    setExpandedSsIds(prev => {
      const next = new Set(prev);
      next.has(ssId) ? next.delete(ssId) : next.add(ssId);
      return next;
    });
  }

  function selectAll() {
    const all = subsystems.flatMap(ss => ss.comptypes.filter(ct => ct.hasData).map(ct => ct.comp_id));
    setSelectedCompIds(new Set(all));
  }

  function clearAll() {
    setSelectedCompIds(new Set());
  }

  // ── Derived counts ────────────────────────────────────────────────────────

  const totalSelected = selectedCompIds.size;

  const ssStatus = useMemo(() => {
    const map: Record<number, 'all' | 'some' | 'none'> = {};
    for (const ss of subsystems) {
      const ids = ss.comptypes.filter(ct => ct.hasData).map(ct => ct.comp_id);
      const count = ids.filter(id => selectedCompIds.has(id)).length;
      map[ss.ss_id] = count === 0 ? 'none' : count === ids.length ? 'all' : 'some';
    }
    return map;
  }, [subsystems, selectedCompIds]);

  // ── Export ─────────────────────────────────────────────────────────────────

  async function handleExport(format: 'excel' | 'pdf') {
    if (totalSelected === 0) return;
    setExporting(true);
    setExportFormat(format);

    try {
      // Build groups: one per chapter that has selected items
      const exportGroups: ChapterExportGroup[] = [];

      for (const ss of subsystems) {
        const selectedInChapter = ss.comptypes
          .filter(ct => ct.hasData && selectedCompIds.has(ct.comp_id))
          .map(ct => ct.comp_id);

        if (selectedInChapter.length === 0) continue;

        // Fetch all selected sub-categories for this chapter in parallel
        const data: TableData[] = await Promise.all(
          selectedInChapter.map(id => fetchComptypeData(id))
        );

        const allComps = ss.comptypes.filter(ct => ct.hasData);
        const isWholeChapter = selectedInChapter.length === allComps.length;
        const label = isWholeChapter
          ? ss.ss_name
          : `${ss.ss_name} (${selectedInChapter.length} sub-categories)`;

        exportGroups.push({ chapterName: label, data });
      }

      if (format === 'excel') {
        // Excel — one .xlsx file with one sheet per chapter
        const filename = exportGroups.length === 1
          ? exportGroups[0].chapterName
          : `NASA_SOAR_${exportGroups.length}_Chapters`;
        exportCombinedAsXLSX(exportGroups, filename);
      } else {
        // PDF — one combined file for all chapters
        const filename = exportGroups.length === 1
          ? exportGroups[0].chapterName
          : `NASA_SOAR_${exportGroups.length}_Chapters`;
        exportCombinedAsPDF(exportGroups, filename);
      }

    } finally {
      setExporting(false);
      setExportFormat(null);
    }
  }

  // ── Checkbox icon ─────────────────────────────────────────────────────────

  function CheckIcon({ status }: { status: 'all' | 'some' | 'none' }) {
    if (status === 'all')  return <CheckSquare className="size-4 text-[#0B3D91] flex-shrink-0" />;
    if (status === 'some') return <MinusSquare  className="size-4 text-blue-400 flex-shrink-0" />;
    return <Square className="size-4 text-gray-400 flex-shrink-0" />;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B3D91] to-[#1a56b0] px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <Download className="size-5" />
              Export Builder
            </h2>
            <p className="text-blue-200 text-xs mt-0.5">
              Select chapters or sub-categories to export
            </p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Selection summary + bulk actions */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
          <span className="text-sm text-gray-700">
            {totalSelected === 0
              ? 'Nothing selected'
              : `${totalSelected} sub-categor${totalSelected === 1 ? 'y' : 'ies'} selected`}
          </span>
          <div className="flex gap-3">
            <button onClick={selectAll} className="text-xs text-[#0B3D91] hover:underline font-medium">
              Select All
            </button>
            <button onClick={clearAll} className="text-xs text-gray-400 hover:underline">
              Clear
            </button>
          </div>
        </div>

        {/* Chapter list */}
        <div className="flex-1 overflow-y-auto">
          {subsystems.map((ss, idx) => {
            const status   = ssStatus[ss.ss_id] ?? 'none';
            const expanded = expandedSsIds.has(ss.ss_id);
            const available = ss.comptypes.filter(ct => ct.hasData);

            return (
              <div key={ss.ss_id} className="border-b border-gray-100">
                {/* Chapter row */}
                <div className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleSubsystem(ss)}
                    className="flex-shrink-0"
                    title={status === 'all' ? 'Deselect chapter' : 'Select whole chapter'}
                  >
                    <CheckIcon status={status} />
                  </button>

                  {/* Chapter name + count */}
                  <button
                    onClick={() => toggleSubsystem(ss)}
                    className="flex-1 text-left"
                  >
                    <span className="text-xs font-bold text-[#0B3D91] mr-2">Ch.{idx + 1}</span>
                    <span className="text-sm font-medium text-gray-800">{ss.ss_name}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {status === 'none' ? '' : status === 'all'
                        ? `(all ${available.length})`
                        : `(${available.filter(ct => selectedCompIds.has(ct.comp_id)).length}/${available.length})`}
                    </span>
                  </button>

                  {/* Expand toggle */}
                  {available.length > 0 && (
                    <button
                      onClick={() => toggleExpand(ss.ss_id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Expand sub-categories"
                    >
                      {expanded
                        ? <ChevronDown className="size-4" />
                        : <ChevronRight className="size-4" />}
                    </button>
                  )}
                </div>

                {/* Sub-category list */}
                {expanded && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    {available.map(ct => {
                      const checked = selectedCompIds.has(ct.comp_id);
                      return (
                        <label
                          key={ct.comp_id}
                          className="flex items-center gap-3 px-8 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleComptype(ct.comp_id)}
                            className="size-3.5 accent-[#0B3D91] rounded flex-shrink-0"
                          />
                          <span className="text-xs text-gray-600">{ct.comptype_name}</span>
                          <span className="ml-auto text-xs font-mono text-gray-300">{ct.comptype_code}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer — export buttons */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-4 space-y-2">
          {totalSelected === 0 && (
            <p className="text-xs text-gray-400 text-center mb-2">
              Select at least one item above to export
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleExport('excel')}
              disabled={totalSelected === 0 || exporting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-green-500 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {exporting && exportFormat === 'excel'
                ? <Loader2 className="size-4 animate-spin" />
                : <FileSpreadsheet className="size-4" />}
              Export Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={totalSelected === 0 || exporting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B3D91] text-white rounded-lg hover:bg-[#0a3380] transition-colors text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {exporting && exportFormat === 'pdf'
                ? <Loader2 className="size-4 animate-spin" />
                : <FileText className="size-4" />}
              Export PDF
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Excel: one file with one tab per chapter
          </p>
        </div>
      </div>
    </div>
  );
}
