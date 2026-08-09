import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  avatar?: string;
  color?: string; // status dot colors, e.g., 'bg-emerald-400'
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
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.avatar && (
            <img 
              src={selectedOption.avatar} 
              alt="" 
              className="w-5.5 h-5.5 rounded-full object-cover shrink-0" 
            />
          )}
          {selectedOption?.color && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${selectedOption.color}`} />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute z-60 w-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fade-in py-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-150
                  ${isSelected
                    ? 'bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.avatar && (
                    <img 
                      src={opt.avatar} 
                      alt="" 
                      className="w-5.5 h-5.5 rounded-full object-cover shrink-0" 
                    />
                  )}
                  {opt.color && (
                    <span className={`w-2 h-2 rounded-full shrink-0 ${opt.color}`} />
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
