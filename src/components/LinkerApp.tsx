import React, { useState } from 'react';
import type { Bookmark, ReadingStatus } from '../types';
import { 
  Glasses, 
  QrCode, 
  Star, 
  Copy, 
  ExternalLink, 
  Check, 
  Clock, 
  Tag, 
  Trash2, 
  Sparkles,
  BookmarkCheck,
  CheckCircle2,
  BookOpen,
  Inbox,
  Filter,
  Plus,
  Search,
  Grid,
  LayoutGrid,
  List
} from 'lucide-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface LinkerAppProps {
  bookmarks: Bookmark[];
  selectedIndex: number;
  onSelectIndex: (idx: number) => void;
  onToggleStar: (id: string) => void;
  onCycleStatus: (id: string) => void;
  onDeleteBookmark: (id: string) => void;
  onOpenReader: (b: Bookmark) => void;
  onOpenQR: (b: Bookmark) => void;
  onCopyUrl: (url: string) => void;
  onOpenCapture: () => void;
  onReturnHome: () => void;
  toastMessage: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  omnibarInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const LinkerApp: React.FC<LinkerAppProps> = ({
  bookmarks,
  selectedIndex,
  onSelectIndex,
  onToggleStar,
  onCycleStatus,
  onDeleteBookmark,
  onOpenReader,
  onOpenQR,
  onCopyUrl,
  onOpenCapture,
  onReturnHome,
  toastMessage,
  searchQuery,
  onSearchChange,
  omnibarInputRef,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'starred' | 'unread' | 'reading' | 'completed'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null);

  const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags)));

  const filteredBookmarks = bookmarks.filter((b) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesText =
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.domain.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesText) return false;
    }

    if (activeFilter === 'starred' && !b.starred) return false;
    if (activeFilter === 'unread' && b.status !== 'unread') return false;
    if (activeFilter === 'reading' && b.status !== 'reading') return false;
    if (activeFilter === 'completed' && b.status !== 'completed') return false;

    if (selectedTag && !b.tags.includes(selectedTag)) return false;

    return true;
  });

  const getStatusBadge = (status: ReadingStatus) => {
    switch (status) {
      case 'unread':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-caption font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Unread
          </span>
        );
      case 'reading':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D3FF69]/15 text-[#D3FF69] text-xs font-caption font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#D3FF69]" />
            Reading
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#53FFA9]/15 text-[#53FFA9] text-xs font-caption font-semibold">
            <Check className="w-3.5 h-3.5" />
            Completed
          </span>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#000203] text-[#FAFCFE] overflow-hidden select-none font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-[#D3FF69] text-[#000203] font-caption font-bold text-sm rounded-full shadow-2xl flex items-center gap-2.5 animate-pop-fade">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modern Studio Left Sidebar */}
      <aside className="w-72 lg:w-80 bg-[#181A1C] flex flex-col justify-between p-6 shrink-0">
        
        <div className="space-y-6">
          
          {/* Header Brand + Launcher Return Button */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9.5 h-9.5 rounded-xl bg-[#242529] flex items-center justify-center text-[#D3FF69] shadow-sm">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-caption font-bold text-lg text-[#FAFCFE] tracking-tight">
                  Linker
                </h1>
                <p className="text-xs text-[#8A8F98] font-medium">Digital Preservation</p>
              </div>
            </div>

            <button
              onClick={onReturnHome}
              title="Return to App Suite Launcher"
              className="p-2 rounded-xl bg-[#242529] hover:bg-[#373B3E] text-slate-300 hover:text-[#D3FF69] transition-colors"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {/* Integrated Omnibar Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8A8F98] pointer-events-none" />
            <input
              ref={omnibarInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search or press '/'..."
              className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-full pl-10 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/30 transition-all"
            />
            <div className="absolute right-3 top-2.5 flex items-center pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[11px] font-mono text-[#8A8F98] bg-[#181A1C] rounded-md">
                /
              </kbd>
            </div>
          </div>

          {/* Quick Capture Button */}
          <button
            onClick={onOpenCapture}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#D3FF69] hover:brightness-110 text-[#000203] font-caption font-bold text-sm rounded-full shadow-lg transition-all active:scale-[0.98]"
          >
            <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>Quick Capture Link</span>
            <kbd className="ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-black/20 text-[#000203] rounded-full">
              ⌘K
            </kbd>
          </button>

          {/* Reading Queue Category List */}
          <div className="space-y-1.5 pt-1">
            <span className="px-2 font-caption font-bold text-xs uppercase tracking-wider text-[#8A8F98]">
              Preservation Pipeline
            </span>

            <button
              onClick={() => { setActiveFilter('all'); setSelectedTag(null); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-caption font-semibold transition-all ${
                activeFilter === 'all' && !selectedTag
                  ? 'bg-[#242529] text-[#FAFCFE] shadow-sm'
                  : 'text-[#8A8F98] hover:bg-[#242529]/50 hover:text-[#FAFCFE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-[#8A8F98]" />
                <span>All Saved Links</span>
              </div>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#000203] text-[#97C8EC]">
                {bookmarks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('starred')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-caption font-semibold transition-all ${
                activeFilter === 'starred'
                  ? 'bg-amber-500/10 text-amber-300 shadow-sm'
                  : 'text-[#8A8F98] hover:bg-[#242529]/50 hover:text-[#FAFCFE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                <span>Starred</span>
              </div>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#000203] text-amber-300">
                {bookmarks.filter((b) => b.starred).length}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('unread')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-caption font-semibold transition-all ${
                activeFilter === 'unread'
                  ? 'bg-amber-500/10 text-amber-300 shadow-sm'
                  : 'text-[#8A8F98] hover:bg-[#242529]/50 hover:text-[#FAFCFE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Unread Queue</span>
              </div>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                {bookmarks.filter((b) => b.status === 'unread').length}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('reading')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-caption font-semibold transition-all ${
                activeFilter === 'reading'
                  ? 'bg-[#D3FF69]/10 text-[#D3FF69] shadow-sm'
                  : 'text-[#8A8F98] hover:bg-[#242529]/50 hover:text-[#FAFCFE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#D3FF69]" />
                <span>Currently Reading</span>
              </div>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#000203] text-[#D3FF69]">
                {bookmarks.filter((b) => b.status === 'reading').length}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('completed')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-caption font-semibold transition-all ${
                activeFilter === 'completed'
                  ? 'bg-[#53FFA9]/10 text-[#53FFA9] shadow-sm'
                  : 'text-[#8A8F98] hover:bg-[#242529]/50 hover:text-[#FAFCFE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#53FFA9]" />
                <span>Completed</span>
              </div>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#000203] text-[#53FFA9]">
                {bookmarks.filter((b) => b.status === 'completed').length}
              </span>
            </button>
          </div>

          {/* Tags Cloud */}
          <div className="space-y-2.5 pt-4">
            <div className="flex items-center justify-between px-2">
              <span className="font-caption font-bold text-xs uppercase tracking-wider text-[#8A8F98] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#D3FF69]" /> Tags
              </span>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-xs text-[#D3FF69] hover:underline font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap px-1">
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                  className={`px-3 py-1 rounded-full text-xs font-caption font-semibold transition-all ${
                    selectedTag === t
                      ? 'bg-[#D3FF69] text-[#000203] shadow-sm'
                      : 'bg-[#242529] text-slate-300 hover:bg-[#373B3E]'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Vim Shortcut Legend */}
        <div className="p-4 bg-[#242529] rounded-2xl space-y-2 text-xs">
          <span className="font-caption font-bold text-[11px] uppercase tracking-wider text-[#8A8F98] block mb-1">
            Vim Navigation Keys
          </span>
          <div className="grid grid-cols-2 gap-2 font-mono text-[#8A8F98]">
            <div><kbd className="px-1.5 py-0.5 bg-[#000203] rounded-md text-[#FAFCFE] font-bold">J / K</kbd> Move</div>
            <div><kbd className="px-1.5 py-0.5 bg-[#000203] rounded-md text-[#FAFCFE] font-bold">C</kbd> Copy</div>
            <div><kbd className="px-1.5 py-0.5 bg-[#000203] rounded-md text-[#FAFCFE] font-bold">S</kbd> Star</div>
            <div><kbd className="px-1.5 py-0.5 bg-[#000203] rounded-md text-[#FAFCFE] font-bold">Enter</kbd> Open</div>
          </div>
        </div>

      </aside>

      {/* Main Spacious Content Canvas */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#000203]">
        
        {/* Main Section Header */}
        <header className="px-8 py-5 flex items-center justify-between shrink-0 bg-[#181A1C]">
          <div className="flex items-center gap-3">
            <h2 className="font-caption font-bold text-xl text-[#FAFCFE] tracking-tight">
              {selectedTag ? `Tag: #${selectedTag}` : `${activeFilter.toUpperCase()} BOOKMARKS`}
            </h2>
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-[#242529] text-[#97C8EC]">
              {filteredBookmarks.length} links preserved
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Grid / List Layout Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-[#242529] p-1.5 rounded-full">
              <button
                onClick={() => setLayoutMode('grid')}
                title="Grid View (Progressive Cards)"
                className={`p-1.5 rounded-full transition-all ${
                  layoutMode === 'grid'
                    ? 'bg-[#181A1C] text-[#D3FF69] shadow-sm'
                    : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                title="Compact List View"
                className={`p-1.5 rounded-full transition-all ${
                  layoutMode === 'list'
                    ? 'bg-[#181A1C] text-[#D3FF69] shadow-sm'
                    : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#8A8F98]">
              <span>
                Focused: <strong className="text-[#D3FF69]">#{selectedIndex + 1}</strong>
              </span>
            </div>
          </div>
        </header>

        {/* Link Feed (Grid or List Layout) */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {filteredBookmarks.length === 0 ? (
            <div className="qd-card-bg p-16 text-center space-y-4 max-w-lg mx-auto my-12">
              <Filter className="w-12 h-12 text-[#8A8F98] mx-auto" />
              <h3 className="font-caption font-bold text-lg text-[#FAFCFE]">No preserved links</h3>
              <p className="text-sm text-[#8A8F98] leading-relaxed">
                No items match the active category or filter query. Click Quick Capture (⌘K) to preserve a new link.
              </p>
            </div>
          ) : layoutMode === 'grid' ? (
            /* Spacious Responsive Grid Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
              {filteredBookmarks.map((bookmark, idx) => {
                const isSelected = idx === selectedIndex;

                return (
                  <div
                    key={bookmark.id}
                    onClick={() => {
                      onSelectIndex(idx);
                      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
                    }}
                    className={`qd-card-bg min-h-[200px] p-6 flex flex-col justify-between transition-all cursor-pointer group relative overflow-hidden ${
                      isSelected ? 'qd-card-selected' : ''
                    }`}
                  >
                    {/* Top Header: Favicon, Domain Pill & Status */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-[#181A1C] flex items-center justify-center shrink-0 shadow-sm">
                            {bookmark.faviconUrl ? (
                              <img
                                src={bookmark.faviconUrl}
                                alt=""
                                className="w-4 h-4 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <Sparkles className="w-4 h-4 text-[#D3FF69]" />
                            )}
                          </div>

                          <span className="font-mono text-[11px] font-semibold text-[#97C8EC] bg-[#181A1C] px-2.5 py-0.5 rounded-full truncate">
                            {bookmark.domain}
                          </span>
                        </div>

                        <button 
                          onClick={(e) => { e.stopPropagation(); onCycleStatus(bookmark.id); }}
                          title="Click to cycle status"
                          className="shrink-0"
                        >
                          {getStatusBadge(bookmark.status)}
                        </button>
                      </div>

                      {/* Clean Minimal Title with Hover Underline */}
                      <h3 className="font-caption font-bold text-base text-[#FAFCFE] leading-snug line-clamp-2 group-hover:underline group-hover:decoration-[#D3FF69] group-hover:text-[#D3FF69] transition-colors">
                        {bookmark.title}
                      </h3>

                      {/* Minimalist Tags Preview (Top 2 tags) */}
                      {bookmark.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {bookmark.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-full bg-[#181A1C] text-[#8A8F98] text-[10px] font-caption font-semibold"
                            >
                              #{tag}
                            </span>
                          ))}
                          {bookmark.tags.length > 2 && (
                            <span className="text-[10px] font-mono text-[#8A8F98]">
                              +{bookmark.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Row & Action Toolbar */}
                    <div className="pt-3 mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8A8F98]">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>~{bookmark.readingTimeMinutes}m read</span>
                      </div>

                      {/* Action Toolbar */}
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenReader(bookmark)}
                          title="Distraction-Free Reader View"
                          className="w-8 h-8 rounded-full bg-[#181A1C] hover:bg-[#373B3E] text-slate-300 hover:text-[#FAFCFE] flex items-center justify-center transition-colors"
                        >
                          <Glasses className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenQR(bookmark)}
                          title="Mobile QR Handoff"
                          className="w-8 h-8 rounded-full bg-[#181A1C] hover:bg-[#373B3E] text-slate-300 hover:text-[#53FFA9] flex items-center justify-center transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onCopyUrl(bookmark.url)}
                          title="Copy Clean URL (C)"
                          className="w-8 h-8 rounded-full bg-[#181A1C] hover:bg-[#373B3E] text-slate-300 hover:text-[#FAFCFE] flex items-center justify-center transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onToggleStar(bookmark.id)}
                          title="Toggle Starred (S)"
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            bookmark.starred
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-[#181A1C] hover:bg-[#373B3E] text-[#8A8F98] hover:text-amber-400'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${bookmark.starred ? 'fill-amber-400' : ''}`} />
                        </button>

                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open Link in Browser (Enter)"
                          className="w-8 h-8 rounded-full bg-[#D3FF69] text-[#000203] font-bold flex items-center justify-center hover:brightness-110 transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                        </a>

                        <button
                          onClick={() => setDeletingBookmark(bookmark)}
                          title="Delete Bookmark"
                          className="w-8 h-8 rounded-full bg-[#181A1C] hover:bg-rose-500/20 text-[#8A8F98] hover:text-rose-400 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* Sleek List View */
            <div className="space-y-3 max-w-5xl mx-auto">
              {filteredBookmarks.map((bookmark, idx) => {
                const isSelected = idx === selectedIndex;

                return (
                  <div
                    key={bookmark.id}
                    onClick={() => {
                      onSelectIndex(idx);
                      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
                    }}
                    className={`bg-[#242529] hover:bg-[#2A2C31] rounded-2xl px-6 py-4 flex items-center justify-between transition-all group cursor-pointer ${
                      isSelected ? 'qd-card-selected' : ''
                    }`}
                  >
                    {/* Left Info: Favicon, Domain, Title & Meta */}
                    <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                      <div className="w-8 h-8 rounded-xl bg-[#181A1C] flex items-center justify-center shrink-0 shadow-sm">
                        {bookmark.faviconUrl ? (
                          <img
                            src={bookmark.faviconUrl}
                            alt=""
                            className="w-4 h-4 object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Sparkles className="w-4 h-4 text-[#D3FF69]" />
                        )}
                      </div>

                      <span className="font-mono text-[11px] font-semibold text-[#97C8EC] bg-[#181A1C] px-2.5 py-0.5 rounded-full shrink-0">
                        {bookmark.domain}
                      </span>

                      <h3 className="font-caption font-bold text-sm text-[#FAFCFE] truncate group-hover:underline group-hover:decoration-[#D3FF69] group-hover:text-[#D3FF69] transition-colors">
                        {bookmark.title}
                      </h3>

                      <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-[#8A8F98] bg-[#181A1C] px-2.5 py-0.5 rounded-full shrink-0">
                        <Clock className="w-3 h-3 text-amber-400" />
                        ~{bookmark.readingTimeMinutes}m
                      </span>

                      <button 
                        onClick={(e) => { e.stopPropagation(); onCycleStatus(bookmark.id); }}
                        title="Click to cycle status"
                        className="hidden lg:block shrink-0"
                      >
                        {getStatusBadge(bookmark.status)}
                      </button>
                    </div>

                    {/* Right Toolbar */}
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenReader(bookmark)}
                        title="Reader View"
                        className="w-8 h-8 rounded-full bg-[#181A1C] hover:bg-[#373B3E] text-slate-300 hover:text-[#FAFCFE] flex items-center justify-center transition-colors"
                      >
                        <Glasses className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenQR(bookmark)}
                        title="Mobile QR Handoff"
                        className="w-8 h-8 rounded-full bg-[#181A1C] hover:bg-[#373B3E] text-slate-300 hover:text-[#53FFA9] flex items-center justify-center transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onCopyUrl(bookmark.url)}
                        title="Copy Clean URL (C)"
                        className="w-8 h-8 rounded-full bg-[#181A1C] hover:bg-[#373B3E] text-slate-300 hover:text-[#FAFCFE] flex items-center justify-center transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onToggleStar(bookmark.id)}
                        title="Toggle Starred (S)"
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          bookmark.starred
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-[#181A1C] hover:bg-[#373B3E] text-[#8A8F98] hover:text-amber-400'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${bookmark.starred ? 'fill-amber-400' : ''}`} />
                      </button>

                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open Link in Browser (Enter)"
                        className="w-8 h-8 rounded-full bg-[#D3FF69] text-[#000203] font-bold flex items-center justify-center hover:brightness-110 transition-colors shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      </a>

                      <button
                        onClick={() => setDeletingBookmark(bookmark)}
                        title="Delete Bookmark"
                        className="w-8 h-8 rounded-full bg-[#181A1C] hover:bg-rose-500/20 text-[#8A8F98] hover:text-rose-400 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingBookmark}
        bookmark={deletingBookmark}
        onConfirm={() => {
          if (deletingBookmark) {
            onDeleteBookmark(deletingBookmark.id);
            setDeletingBookmark(null);
          }
        }}
        onCancel={() => setDeletingBookmark(null)}
      />

    </div>
  );
};
