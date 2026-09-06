import React, { useState, useMemo } from 'react';
import { X, Search, Tag, TrendingUp, Check } from 'lucide-react';

export interface TagStat {
  tag: string;
  clickCount: number;
  bookmarkCount: number;
}

interface TagSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagStats: TagStat[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const TagSelectionModal: React.FC<TagSelectionModalProps> = ({
  isOpen,
  onClose,
  tagStats,
  selectedTag,
  onSelectTag,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStats = useMemo(() => {
    if (!searchQuery.trim()) return tagStats;
    const q = searchQuery.toLowerCase().trim();
    return tagStats.filter((s) => s.tag.toLowerCase().includes(q));
  }, [tagStats, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-pop-fade">
      <div className="w-full max-w-lg bg-[#181A1C] rounded-[24px] p-6 shadow-2xl relative text-[#FAFCFE] flex flex-col max-h-[85vh] border border-white/10">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242529] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9.5 h-9.5 rounded-2xl bg-[#242529] flex items-center justify-center text-[#D3FF69] shadow-sm">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-caption font-bold text-lg text-[#FAFCFE]">All Library Tags</h2>
              <p className="text-xs text-[#8A8F98]">Sorted by click frequency and total saved links</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#242529] hover:bg-[#373B3E] text-[#8A8F98] hover:text-[#FAFCFE] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Search Field */}
        <div className="pt-4 pb-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8A8F98] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tags..."
              className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-full pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/30 transition-all border border-white/5"
            />
          </div>
        </div>

        {/* Tag List Container with Scrollbar */}
        <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-2 custom-scrollbar min-h-[200px]">
          {filteredStats.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#8A8F98]">
              No tags match your search query "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredStats.map((stat) => {
                const isSelected = selectedTag === stat.tag;
                return (
                  <button
                    key={stat.tag}
                    onClick={() => {
                      onSelectTag(isSelected ? null : stat.tag);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl flex items-center justify-between text-left transition-all border ${
                      isSelected
                        ? 'bg-[#D3FF69] text-[#000203] border-[#D3FF69] font-bold shadow-md'
                        : 'bg-[#242529]/80 hover:bg-[#242529] text-[#FAFCFE] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="text-xs font-caption font-semibold truncate">
                        #{stat.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#000203]/15 text-[#000203]'
                            : 'bg-[#141618] text-[#D3FF69]'
                        }`}
                      >
                        <TrendingUp className="w-2.5 h-2.5" />
                        {stat.clickCount}
                      </span>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#242529] flex items-center justify-between text-xs shrink-0">
          <span className="text-[#8A8F98] font-mono">
            {tagStats.length} total tags available
          </span>

          {selectedTag && (
            <button
              onClick={() => {
                onSelectTag(null);
                onClose();
              }}
              className="text-xs font-caption font-bold text-rose-400 hover:underline"
            >
              Clear Tag Filter
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
