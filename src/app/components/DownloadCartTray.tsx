import { useState } from 'react';
import { ShoppingCart, ChevronUp, ChevronDown, X, Download } from 'lucide-react';

interface CartItem {
  id: string;
  chapterNumber: number;
  title: string;
}

interface DownloadCartTrayProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onDownloadCombined: () => void;
}

export function DownloadCartTray({
  items,
  onRemoveItem,
  onClearAll,
  onDownloadCombined
}: DownloadCartTrayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-white border border-gray-300 rounded-lg shadow-xl max-w-md">
      {/* Header - Always Visible */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-[#0B3D91]" />
            <h3 className="text-base font-semibold text-gray-900">Download Cart</h3>
            <span className="bg-[#0B3D91] text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={isExpanded ? 'Collapse cart' : 'Expand cart'}
          >
            {isExpanded ? <ChevronDown className="size-5" /> : <ChevronUp className="size-5" />}
          </button>
        </div>

        {/* Primary CTA - Always Visible */}
        <button
          onClick={onDownloadCombined}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0B3D91] text-white rounded-md hover:bg-[#0a3380] transition-colors text-sm font-medium"
        >
          <Download className="size-4" />
          Download Combined PDF
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Items List */}
          <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 p-2 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Chapter {item.chapterNumber}
                  </p>
                  <p className="text-sm text-gray-900 line-clamp-2">
                    {item.title}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Remove item"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Clear All Button */}
          <button
            onClick={onClearAll}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
