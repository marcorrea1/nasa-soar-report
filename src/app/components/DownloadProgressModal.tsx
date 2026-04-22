import { useEffect, useState } from 'react';
import { X, Download, FileText } from 'lucide-react';

interface DownloadProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
  onDownloadIndividually: () => void;
}

export function DownloadProgressModal({
  isOpen,
  onClose,
  itemCount,
  onDownloadIndividually
}: DownloadProgressModalProps) {
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(true);
      // Simulate processing time
      const timer = setTimeout(() => {
        setIsProcessing(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isProcessing ? 'bg-blue-100' : 'bg-green-100'}`}>
              <FileText className={`size-5 ${isProcessing ? 'text-[#0B3D91]' : 'text-green-600'}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isProcessing ? 'Preparing Combined PDF' : 'Download Ready'}
              </h2>
              <p className="text-sm text-gray-600">
                {isProcessing ? `Combining ${itemCount} chapters into one file...` : 'Your combined PDF is ready'}
              </p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {isProcessing ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-[#0B3D91] rounded-full animate-pulse" style={{ width: '70%' }} />
                </div>
              </div>

              {/* Alternative Action */}
              <button
                onClick={onDownloadIndividually}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Download Individually Instead
              </button>
            </>
          ) : (
            <>
              {/* Download Ready */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="size-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-900">
                    NASA_Technical_Reports_Selected_Chapters.pdf
                  </p>
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  {itemCount} chapters combined • Estimated 15.2 MB
                </p>
              </div>

              {/* Download Button */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    alert('Combined PDF download initiated!');
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0B3D91] text-white rounded-md hover:bg-[#0a3380] transition-colors text-sm font-medium"
                >
                  <Download className="size-4" />
                  Download Combined PDF
                </button>

                <button
                  onClick={onDownloadIndividually}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Download Individually Instead
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
