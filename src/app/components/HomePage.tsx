import image_fed5debd253418cf91075867ff11a12bc904dc7a from '../../assets/fed5debd253418cf91075867ff11a12bc904dc7a.png'
import { useState, useEffect } from 'react';
import { triggerAdminClick } from './TopNav';
import { useAdmin } from '../contexts/AdminContext';
import { AdminLoginModal } from './AdminLoginModal';
import { useNavigate, useLocation } from 'react-router';
import { SearchBar } from './SearchBar';
import { TOCSidebar } from './TOCSidebar';
import { Menu, X } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const [loginOpen, setLoginOpen] = useState(false);

  // Hidden URL trigger: visiting /?admin opens the login modal automatically
  useEffect(() => {
    if (!isAdmin && location.search.includes('admin')) {
      setLoginOpen(true);
      // Clean the URL so the param doesn't stay visible after login
      navigate('/', { replace: true });
    }
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleBrowseByChapter = () => {
    navigate('/search');
  };

  const handleChapterClick = (chapterId: string) => {
    // Navigate to search page with selected chapter
    navigate(`/search?chapter=${chapterId}`);
  };

  const handleSectionClick = (chapterId: string, sectionId: string) => {
    // Navigate to search page with selected section
    navigate(`/search?chapter=${chapterId}&section=${sectionId}`);
  };

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      {/* TOC Sidebar - Slides in from left */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <TOCSidebar
          isCollapsed={false}
          onChapterClick={handleChapterClick}
          onSectionClick={handleSectionClick}
        />
      </div>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Hamburger Icon */}
      <div className="w-16 bg-gradient-to-b from-[#0B3D91] to-[#082d6b] border-r border-[#0B3D91]/30 flex items-start justify-center pt-8 flex-shrink-0 z-20">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isSidebarOpen 
              ? 'text-white bg-white/20 shadow-lg shadow-blue-900/50' 
              : 'text-blue-200 hover:text-white hover:bg-white/10'
          }`}
          title={isSidebarOpen ? 'Close Table of Contents' : 'Open Table of Contents'}
        >
          {isSidebarOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </div>

      {/* Main Content - Shifts when sidebar opens */}
      <div
        className={`flex-1 flex flex-col items-center justify-center px-8 transition-all duration-300 ${
          isSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        {/* NASA Logo and Branding — click 5× quickly for admin login */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <img
              src={image_fed5debd253418cf91075867ff11a12bc904dc7a}
              alt="NASA Meatball Logo"
              className="h-32 w-32 object-contain cursor-pointer select-none"
              onClick={() => triggerAdminClick(isAdmin, () => setLoginOpen(true))}
            />
          </div>
          <AdminLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">NASA Technical Reports</h1>
          <p className="text-xl font-medium text-gray-700 mb-2">AMES Research Center</p>
          <p className="text-sm text-gray-500">February 2025 • 400+ Pages</p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-8">
          <SearchBar 
            onSearch={handleSearch}
            size="large"
            autoFocus={true}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              const input = document.querySelector('input');
              if (input && input.value) {
                handleSearch(input.value);
              }
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Search Report
          </button>
          <button
            onClick={handleBrowseByChapter}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Browse by Chapter
          </button>
        </div>

        {/* Quick Access */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-4">Popular searches:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['CubeSat', 'Solar Arrays', 'Ion Propulsion', 'TRL Assessment', 'Thermal Control'].map(term => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-4 py-2 bg-blue-50 text-[#0B3D91] rounded-full text-sm hover:bg-blue-100 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center">
          <p className="text-xs text-gray-400">NASA Internal Use Only • Confidential</p>
        </div>
      </div>
    </div>
  );
}