import { X } from 'lucide-react';
import type { Technology } from '../data/reportData';

interface TechnologyDetailModalProps {
  tech: Technology;
  isOpen: boolean;
  onClose: () => void;
}

function TRLBadge({ trl }: { trl: number }) {
  const color =
    trl <= 3
      ? 'bg-red-100 text-red-700 border-red-200'
      : trl <= 6
      ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
      : 'bg-green-100 text-green-700 border-green-200';

  const label =
    trl <= 3 ? 'Research' : trl <= 6 ? 'Development' : 'Flight Ready';

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full border ${color}`}>
      TRL {trl} — {label}
    </span>
  );
}

export function TechnologyDetailModal({ tech, isOpen, onClose }: TechnologyDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0B3D91] to-[#1a56b0] px-6 py-5 rounded-t-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
                Chapter {tech.chapterNumber}
              </p>
              <h2 className="text-xl font-bold text-white leading-snug">{tech.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            {tech.trl > 0 && <TRLBadge trl={tech.trl} />}
            {tech.manufacturer && <span className="text-blue-100 text-sm">{tech.manufacturer}</span>}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Summary */}
          {tech.summary && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Summary</h3>
              <p className="text-gray-800 text-sm leading-relaxed">{tech.summary}</p>
            </section>
          )}

          {/* Key Specs */}
          {Object.keys(tech.specs).length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Key Specifications</h3>
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(tech.specs).map(([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2.5 font-medium text-gray-600 w-1/2 border-b border-gray-100">{key}</td>
                        <td className="px-4 py-2.5 text-gray-900 border-b border-gray-100">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Recent Developments */}
          {tech.recentDevelopments && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Recent Developments</h3>
              <p className="text-gray-800 text-sm leading-relaxed">{tech.recentDevelopments}</p>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0B3D91] text-white text-sm font-medium rounded-lg hover:bg-[#0a3380] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
