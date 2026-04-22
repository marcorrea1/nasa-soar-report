import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface RequestUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  chapterNumber: number;
}

export function RequestUpdateModal({ isOpen, onClose, sectionTitle, chapterNumber }: RequestUpdateModalProps) {
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    alert('Change request submitted successfully!');
    onClose();
    setDescription('');
    setFileName('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Request Data Update</h2>
            <p className="text-sm text-gray-500 mt-1">Submit a change request for technical review</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Reference
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-[#0B3D91]">Chapter {chapterNumber}</span>
                {' • '}
                {sectionTitle}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description of Requested Change *
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe the technical update, correction, or addition you're requesting..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Please be specific and include technical justification for the change
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0B3D91] transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="size-8 text-gray-400 mx-auto mb-2" />
                {fileName ? (
                  <p className="text-sm text-gray-700 font-medium">{fileName}</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="size-5 text-[#0B3D91]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#0B3D91]">Secure Submission</p>
                <p className="text-xs text-gray-600 mt-1">
                  This request will be reviewed by the technical team and may require approval from the principal investigator.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0B3D91] text-white rounded-lg hover:bg-[#0a3380] transition-colors font-medium"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
