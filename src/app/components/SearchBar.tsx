import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchSuggestions } from '../data/reportData';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  size?: 'large' | 'normal';
  initialValue?: string;
}

export function SearchBar({ 
  onSearch, 
  placeholder = 'Search chapters, technologies, TRL levels, solar cells, CubeSats, propulsion…',
  autoFocus = false,
  size = 'large',
  initialValue = ''
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ type: string; text: string }>>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 1) {
      const results = searchSuggestions(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setQuery(suggestionText);
    onSearch(suggestionText);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex].text);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="font-semibold text-[#0B3D91]">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'chapter':
        return '📑';
      case 'section':
        return '📄';
      case 'term':
        return '🔍';
      default:
        return '📌';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className={`relative flex items-center ${size === 'large' ? 'h-14' : 'h-11'}`}>
          <Search className={`absolute left-4 text-gray-400 ${size === 'large' ? 'size-5' : 'size-4'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`w-full ${size === 'large' ? 'pl-12 pr-4 text-base' : 'pl-10 pr-4 text-sm'} h-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent shadow-sm hover:shadow-md transition-shadow`}
          />
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.text)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
              <div className="flex-1">
                <div className="text-sm text-gray-700">
                  {highlightMatch(suggestion.text, query)}
                </div>
                <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
