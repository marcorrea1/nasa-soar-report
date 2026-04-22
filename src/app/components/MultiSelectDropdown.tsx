import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function MultiSelectDropdown({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select...',
  label
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || '';
    }
    return `${selectedValues.length} chapters selected`;
  };

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label className="block text-xs font-medium text-gray-600 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent bg-white flex items-center justify-between"
      >
        <span className={selectedValues.length === 0 ? 'text-gray-400' : 'text-gray-900'}>
          {getDisplayText()}
        </span>
        <ChevronDown className={`size-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {selectedValues.length > 0 && (
            <div className="p-2 border-b border-gray-200">
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-[#0B3D91] hover:text-[#0a3380] font-medium flex items-center gap-1"
              >
                <X className="size-3" />
                Clear All
              </button>
            </div>
          )}
          
          <div className="p-1">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOption(option.value)}
                    className="size-4 text-[#0B3D91] border-gray-300 rounded focus:ring-[#0B3D91]"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
