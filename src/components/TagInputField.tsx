import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Tag, Plus, Check } from 'lucide-react';

interface TagInputFieldProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  allExistingTags?: string[];
  placeholder?: string;
}

export const TagInputField: React.FC<TagInputFieldProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  allExistingTags = [],
  placeholder = 'Add tag & press Enter...',
}) => {
  const [tagInput, setTagInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const trimmed = tagInput.trim().replace(/^#/, '').toLowerCase();
    if (!trimmed) return [];
    return allExistingTags
      .filter((t) => !tags.includes(t) && t.toLowerCase().includes(trimmed))
      .slice(0, 6);
  }, [tagInput, allExistingTags, tags]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [suggestions]);

  // Click outside listener to dismiss suggestions popover
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleCommitTag = (tagToCommit?: string) => {
    const target = tagToCommit || tagInput;
    const cleaned = target.trim().replace(/^#/, '');
    if (cleaned && !tags.includes(cleaned)) {
      onAddTag(cleaned);
    }
    setTagInput('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isOpen && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (suggestions[highlightedIndex]) {
          handleCommitTag(suggestions[highlightedIndex]);
        } else {
          handleCommitTag();
        }
        return;
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
    }

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleCommitTag();
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <div className="flex items-center gap-2 flex-wrap bg-[#242529] p-3 rounded-2xl min-h-[46px] border border-white/5 focus-within:border-[#97C8EC]/40 transition-colors">
        <Tag className="w-3.5 h-3.5 text-[#D3FF69] shrink-0" />
        
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3FF69]/15 text-[#D3FF69] text-xs font-caption font-semibold"
          >
            #{t}
            <button
              type="button"
              onClick={() => onRemoveTag(t)}
              className="hover:text-rose-400 font-bold transition-colors ml-0.5"
              title={`Remove #${t}`}
            >
              ×
            </button>
          </span>
        ))}

        <div className="flex items-center gap-1.5 flex-1 min-w-[150px] relative">
          <input
            ref={inputRef}
            type="text"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (tagInput.trim()) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent text-xs text-[#FAFCFE] placeholder:text-[#8A8F98] focus:outline-none"
          />

          {tagInput.trim() && (
            <button
              type="button"
              onClick={() => handleCommitTag()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D3FF69] text-[#000203] text-[11px] font-caption font-bold shrink-0 hover:brightness-110 transition-all"
            >
              <Plus className="w-3 h-3 stroke-[3]" /> Add
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Suggestions Popover */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-[#181A1C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 text-xs animate-pop-fade">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#8A8F98] border-b border-white/5">
            Existing Tag Suggestions
          </div>
          {suggestions.map((suggestion, index) => {
            const isHighlighted = index === highlightedIndex;
            return (
              <div
                key={suggestion}
                onClick={() => handleCommitTag(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-3.5 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                  isHighlighted ? 'bg-[#242529] text-[#D3FF69] font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#97C8EC]" />
                  <span>#{suggestion}</span>
                </div>
                {isHighlighted && <Check className="w-3.5 h-3.5 text-[#D3FF69]" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
