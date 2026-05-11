import nasaLogo from '../../assets/fed5debd253418cf91075867ff11a12bc904dc7a.png';
import { useState } from 'react';

// Module-level counter — survives component remounts / navigation
let _adminClicks = 0;
let _adminTimer: ReturnType<typeof setTimeout> | null = null;

export function triggerAdminClick(isAdmin: boolean, openLogin: () => void) {
  if (isAdmin) return;
  _adminClicks += 1;
  if (_adminTimer) clearTimeout(_adminTimer);
  if (_adminClicks >= 5) {
    _adminClicks = 0;
    openLogin();
  } else {
    _adminTimer = setTimeout(() => { _adminClicks = 0; }, 2000);
  }
}
import { useNavigate } from 'react-router';
import { SearchBar } from './SearchBar';
import { Download, ShieldCheck, LogOut } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { AdminLoginModal } from './AdminLoginModal';

interface TopNavProps {
  onSearch: (query: string) => void;
  searchQuery?: string;
  onOpenExport?: () => void;
}

export function TopNav({ onSearch, searchQuery, onOpenExport }: TopNavProps) {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAdmin();
  const [loginOpen, setLoginOpen] = useState(false);

  function handleLogoClick() {
    navigate('/');
    triggerAdminClick(isAdmin, () => setLoginOpen(true));
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          {/* NASA Logo — click 5× quickly to open admin login */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <img src={nasaLogo} alt="NASA" className="size-8 object-contain" />
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-900">NASA</div>
              <div className="text-xs text-gray-500">Reports</div>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <SearchBar
              onSearch={onSearch}
              size="normal"
              initialValue={searchQuery}
            />
          </div>

          {/* Download button */}
          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#0B3D91] text-white rounded-lg hover:bg-[#0a3380] transition-colors text-sm font-semibold flex-shrink-0"
            >
              <Download className="size-4" />
              Download
            </button>
          )}

          {/* Admin badge + exit — only visible when already logged in as admin */}
          {isAdmin && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-lg">
                <ShieldCheck className="size-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">Admin Mode</span>
              </div>
              <button
                onClick={logout}
                title="Exit admin mode"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-300 rounded-lg transition-colors"
              >
                <LogOut className="size-3.5" />
                Exit
              </button>
            </div>
          )}

        </div>
      </div>

      <AdminLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
