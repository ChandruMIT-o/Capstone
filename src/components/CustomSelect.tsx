import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  avatar?: string;
  color?: string; // status dot styling class
  badge?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const hasWidthClass = className.split(' ').some(cls => cls.startsWith('w-'));
  const widthStyle = hasWidthClass ? '' : 'w-full';

  return (
    <div
      ref={containerRef}
      className={`relative text-left font-sans select-none ${widthStyle} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer shadow-xs ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {selectedOption?.avatar && (
            <img
              src={selectedOption.avatar}
              alt=""
              className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-slate-300 dark:ring-slate-600"
            />
          )}
          {selectedOption?.color && (
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedOption.color}`} />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute z-[70] w-full min-w-[180px] mt-1.5 bg-white/98 dark:bg-[#111827]/98 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl max-h-64 overflow-y-auto animate-pop-in p-1.5">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-[13px] font-medium rounded-full cursor-pointer transition-colors duration-150 ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {opt.avatar && (
                    <img
                      src={opt.avatar}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                  )}
                  {opt.color && (
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${opt.color}`} />
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
