import { Eye, Edit, MessageSquare, Download, Plus, Check } from 'lucide-react';

interface SectionCardProps {
  chapterNumber: number;
  sectionTitle: string;
  description: string;
  trl?: number;
  manufacturer?: string;
  onViewData: () => void;
  onEditData: () => void;
  onRequestChange: () => void;
  onDownloadPDF?: () => void;
  onAddToCart?: () => void;
  isInCart?: boolean;
}

function TRLBadge({ trl }: { trl: number }) {
  const color =
    trl <= 3
      ? 'bg-red-100 text-red-700 border-red-200'
      : trl <= 6
      ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
      : 'bg-green-100 text-green-700 border-green-200';

  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${color}`}>
      TRL {trl}
    </span>
  );
}

export function SectionCard({
  chapterNumber,
  sectionTitle,
  description,
  trl,
  manufacturer,
  onViewData,
  onEditData,
  onRequestChange,
  onDownloadPDF,
  onAddToCart,
  isInCart
}: SectionCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Chapter {chapterNumber}
            </span>
            {trl !== undefined && <TRLBadge trl={trl} />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{sectionTitle}</h3>
          {manufacturer && (
            <p className="text-xs text-gray-500 mb-2 font-medium">{manufacturer}</p>
          )}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={onViewData}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B3D91] text-white rounded-md hover:bg-[#0a3380] transition-colors text-sm font-medium"
        >
          <Eye className="size-4" />
          View Data
        </button>
        <button
          onClick={onEditData}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <Edit className="size-4" />
          Edit Data
        </button>
        <button
          onClick={onRequestChange}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <MessageSquare className="size-4" />
          Request Change
        </button>
        {onDownloadPDF && (
          <button
            onClick={onDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Download className="size-4" />
            Download PDF
          </button>
        )}
        {onAddToCart && (
          <button
            onClick={onAddToCart}
            className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors text-sm font-medium ${
              isInCart
                ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isInCart ? <Check className="size-4" /> : <Plus className="size-4" />}
            {isInCart ? 'Combined' : 'Combine PDF'}
          </button>
        )}
      </div>
    </div>
  );
}
