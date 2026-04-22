import { useState } from 'react';
import { Lock, X, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    // small delay for UX
    setTimeout(() => {
      const ok = login(password);
      setLoading(false);
      if (ok) {
        setPassword('');
        onClose();
      } else {
        setError('Incorrect password. Please try again.');
      }
    }, 300);
  }

  function handleClose() {
    setPassword('');
    setError('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B3D91] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Lock className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">Admin Access</h2>
              <p className="text-blue-200 text-xs">Enter your admin password</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter admin password"
                autoFocus
                className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-sm outline-none transition-colors ${
                  error
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-gray-300 focus:border-[#0B3D91] focus:ring-1 focus:ring-[#0B3D91]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!password || loading}
            className="w-full py-2.5 bg-[#0B3D91] text-white rounded-lg font-medium text-sm hover:bg-[#0a3380] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShieldCheck className="size-4" />
            )}
            {loading ? 'Verifying…' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
