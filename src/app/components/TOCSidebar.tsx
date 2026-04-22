import { useState } from 'react';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useSubsystems } from '../hooks/useReportData';

interface TOCSidebarProps {
  activeSubsystemId?: number;
  activeComptypeId?: number;
  // Legacy string-based props kept for backward compat with HomePage
  activeChapterId?: string;
  activeSectionId?: string;
  isCollapsed?: boolean;
  onSubsystemClick?: (ssId: number) => void;
  onComptypeClick?: (ssId: number, compId: number) => void;
  // Legacy handlers
  onChapterClick?: (chapterId: string) => void;
  onSectionClick?: (chapterId: string, sectionId: string) => void;
}

export function TOCSidebar({
  activeSubsystemId,
  activeComptypeId,
  onSubsystemClick,
  onComptypeClick,
  isCollapsed,
}: TOCSidebarProps) {
  const { subsystems, loading } = useSubsystems();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(
    new Set(activeSubsystemId ? [activeSubsystemId] : [])
  );

  const toggleSubsystem = (ssId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(ssId) ? next.delete(ssId) : next.add(ssId);
      return next;
    });
  };

  if (isCollapsed) return null;

  return (
    <div className="w-80 bg-gradient-to-b from-[#0B3D91] to-[#082d6b] border-r-4 border-[#2B6CFF] h-full overflow-y-auto flex-shrink-0 shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xs tracking-widest text-blue-200 mb-1 uppercase font-semibold">STATE-OF-THE-ART</h2>
        <h3 className="text-base font-semibold text-white">Table of Contents</h3>
      </div>

      <nav className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-blue-200 gap-2">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          subsystems.map((ss, index) => {
            const isExpanded = expandedIds.has(ss.ss_id);
            const isActive = activeSubsystemId === ss.ss_id;

            return (
              <div key={ss.ss_id} className="mb-2">
                <div
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer relative ${
                    isActive
                      ? 'bg-white/15 text-white shadow-lg shadow-blue-900/50'
                      : 'hover:bg-white/10 text-blue-50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-[#2B6CFF] rounded-r-full shadow-lg shadow-[#2B6CFF]/50" />
                  )}

                  <button
                    onClick={() => onSubsystemClick?.(ss.ss_id)}
                    className="flex items-center gap-3 flex-1 text-left pl-3"
                  >
                    <span className={`text-xs font-bold ${isActive ? 'text-[#2B6CFF]' : 'text-blue-300'}`}>
                      {index + 1}
                    </span>
                    <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                      {ss.ss_name}
                    </span>
                  </button>

                  <button
                    onClick={(e) => toggleSubsystem(ss.ss_id, e)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {isExpanded
                      ? <ChevronDown className="size-4" />
                      : <ChevronRight className="size-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {ss.comptypes
                      .filter(ct => ct.hasData)
                      .map(ct => {
                        const isCTActive = activeComptypeId === ct.comp_id;
                        return (
                          <button
                            key={ct.comp_id}
                            onClick={() => onComptypeClick?.(ss.ss_id, ct.comp_id)}
                            className={`w-full text-left p-2 px-3 rounded-md text-sm transition-all duration-200 relative ${
                              isCTActive
                                ? 'bg-[#2B6CFF] text-white font-semibold shadow-md shadow-blue-900/30'
                                : 'text-blue-100 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {ct.comptype_name}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>
    </div>
  );
}
