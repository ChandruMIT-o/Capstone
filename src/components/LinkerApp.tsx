import React, { useState, useMemo, useEffect } from 'react';
import type { Bookmark } from '../types';
import type { UserPreferences } from '../utils/storage';
import {
  QrCode,
  Star,
  Copy,
  ExternalLink,
  Check,
  Tag,
  Trash2,
  Inbox,
  Filter,
  Plus,
  Search,
  Grid,
  LayoutGrid,
  List,
  Eye,
  TrendingUp,
  MoreVertical,
  Edit3,
  Rows,
  ArrowUpDown
} from 'lucide-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { FaviconWithFallback } from './FaviconWithFallback';
import { TagSelectionModal, type TagStat } from './TagSelectionModal';

interface LinkerAppProps {
  bookmarks: Bookmark[];
  selectedIndex: number;
  onSelectIndex: (idx: number) => void;
  onToggleStar: (id: string) => void;
  onIncrementUseCount?: (id: string) => void;
  onDeleteBookmark: (id: string) => void;
  onEditBookmark: (b: Bookmark) => void;
  onOpenQR: (b: Bookmark) => void;
  onCopyUrl: (url: string, id?: string) => void;
  onOpenCapture: () => void;
  onReturnHome: () => void;
  toastMessage: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  omnibarInputRef?: React.RefObject<HTMLInputElement | null>;
  preferences?: UserPreferences;
  onUpdatePreferences?: (prefs: Partial<UserPreferences>) => void;
}

export const LinkerApp: React.FC<LinkerAppProps> = ({
  bookmarks,
  selectedIndex,
  onSelectIndex,
  onToggleStar,
  onIncrementUseCount,
  onDeleteBookmark,
  onEditBookmark,
  onOpenQR,
  onCopyUrl,
  onOpenCapture,
  onReturnHome,
  toastMessage,
  searchQuery,
  onSearchChange,
  omnibarInputRef,
  preferences,
  onUpdatePreferences,
}) => {
  const activeFilter = preferences?.activeFilter ?? 'all';
  const selectedTag = preferences?.selectedTag ?? null;
  const layoutMode = preferences?.layoutMode ?? 'grid';
  const sortMode = preferences?.sortMode ?? 'az';

  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const setFilter = (filter: 'all' | 'starred') => {
    if (onUpdatePreferences) onUpdatePreferences({ activeFilter: filter });
  };

  const setTag = (tag: string | null) => {
    if (onUpdatePreferences) onUpdatePreferences({ selectedTag: tag });
  };

  const setLayout = (mode: 'grid' | 'list' | 'domainRows') => {
    if (onUpdatePreferences) onUpdatePreferences({ layoutMode: mode });
  };

  const setSort = (mode: 'az' | 'za' | 'opens' | 'newest') => {
    if (onUpdatePreferences) onUpdatePreferences({ sortMode: mode });
  };

  // Instant Click-Outside dismissal listener for 3-dot dropdown menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.three-dot-menu-container')) {
        setOpenMenuId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Compute tag statistics: sorted by total click count (frequency), then total saved links
  const tagStats: TagStat[] = useMemo(() => {
    const map = new Map<string, { clickCount: number; bookmarkCount: number }>();

    bookmarks.forEach((b) => {
      const opens = b.useCount || 0;
      b.tags.forEach((t) => {
        const current = map.get(t) || { clickCount: 0, bookmarkCount: 0 };
        map.set(t, {
          clickCount: current.clickCount + opens,
          bookmarkCount: current.bookmarkCount + 1,
        });
      });
    });

    const list: TagStat[] = Array.from(map.entries()).map(([tag, stat]) => ({
      tag,
      clickCount: stat.clickCount,
      bookmarkCount: stat.bookmarkCount,
    }));

    return list.sort((a, b) => {
      if (b.clickCount !== a.clickCount) return b.clickCount - a.clickCount;
      if (b.bookmarkCount !== a.bookmarkCount) return b.bookmarkCount - a.bookmarkCount;
      return a.tag.localeCompare(b.tag);
    });
  }, [bookmarks]);

  // Sidebar tag limit: display top 6 tags sorted by clicks, keeping selected tag visible
  const SIDEBAR_TAG_LIMIT = 6;

  const sidebarTags = useMemo(() => {
    const top = tagStats.slice(0, SIDEBAR_TAG_LIMIT).map((s) => s.tag);
    if (selectedTag && !top.includes(selectedTag)) {
      return [...top, selectedTag];
    }
    return top;
  }, [tagStats, selectedTag]);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
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
      if (selectedTag && !b.tags.includes(selectedTag)) return false;

      return true;
    });
  }, [bookmarks, searchQuery, activeFilter, selectedTag]);

  // Universal sorted bookmarks for Grid and List views
  const sortedBookmarks = useMemo(() => {
    const list = [...filteredBookmarks];
    return list.sort((a, b) => {
      if (sortMode === 'az') return a.title.localeCompare(b.title) || a.domain.localeCompare(b.domain);
      if (sortMode === 'za') return b.title.localeCompare(a.title) || b.domain.localeCompare(a.domain);
      if (sortMode === 'opens') return (b.useCount || 0) - (a.useCount || 0);
      if (sortMode === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [filteredBookmarks, sortMode]);

  // Group bookmarks by domain for the Smart Domain Row View
  const domainGroups = useMemo(() => {
    const groupsMap = new Map<string, Bookmark[]>();
    filteredBookmarks.forEach((b) => {
      const list = groupsMap.get(b.domain) || [];
      list.push(b);
      groupsMap.set(b.domain, list);
    });

    const entries = Array.from(groupsMap.entries()).map(([domain, items]) => {
      const totalOpens = items.reduce((acc, b) => acc + (b.useCount || 0), 0);
      const sortedItems = [...items].sort((a, b) => {
        if (sortMode === 'az') return a.title.localeCompare(b.title);
        if (sortMode === 'za') return b.title.localeCompare(a.title);
        if (sortMode === 'opens') return (b.useCount || 0) - (a.useCount || 0);
        if (sortMode === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });

      return { domain, bookmarks: sortedItems, totalOpens, count: items.length };
    });

    return entries.sort((a, b) => {
      if (sortMode === 'az') return a.domain.localeCompare(b.domain);
      if (sortMode === 'za') return b.domain.localeCompare(a.domain);
      if (sortMode === 'opens') return b.totalOpens - a.totalOpens;
      if (sortMode === 'newest') {
        const newestA = Math.max(...a.bookmarks.map(item => new Date(item.createdAt).getTime()));
        const newestB = Math.max(...b.bookmarks.map(item => new Date(item.createdAt).getTime()));
        return newestB - newestA;
      }
      return 0;
    });
  }, [filteredBookmarks, sortMode]);

  const handleOpenLink = (bookmark: Bookmark) => {
    if (onIncrementUseCount) {
      onIncrementUseCount(bookmark.id);
    }
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
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
      <aside className="w-72 lg:w-80 bg-[#141618] border-r border-white/5 flex flex-col justify-between p-6 shrink-0">

        <div className="space-y-6">

          {/* Header Brand + Launcher Return Button */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center shrink-0">
                <img src="/logos/linker.png" alt="Linker Logo" className="w-full h-full object-contain" />
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
              className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-full pl-10 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/30 transition-all border border-white/5"
            />
            <div className="absolute right-3 top-2.5 flex items-center pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[11px] font-mono text-[#8A8F98] bg-[#181A1C] rounded-md">
                /
              </kbd>
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-1.5 pt-1">
            <span className="px-2 font-caption font-bold text-xs uppercase tracking-wider text-[#8A8F98]">
              Library Views
            </span>

            <button
              onClick={() => { setFilter('all'); setTag(null); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-caption font-semibold transition-all ${activeFilter === 'all' && !selectedTag
                ? 'bg-[#242529] text-[#FAFCFE] shadow-sm border border-white/10'
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
              onClick={() => setFilter('starred')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-caption font-semibold transition-all ${activeFilter === 'starred'
                ? 'bg-amber-500/10 text-amber-300 shadow-sm border border-amber-500/20'
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
          </div>

          {/* Tags Cloud */}
          <div className="space-y-2.5 pt-4">
            <div className="flex items-center justify-between px-2">
              <span className="font-caption font-bold text-xs uppercase tracking-wider text-[#8A8F98] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#D3FF69]" /> Tags
              </span>
              {selectedTag && (
                <button
                  onClick={() => setTag(null)}
                  className="text-xs text-[#D3FF69] hover:underline font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap px-1">
              {sidebarTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(selectedTag === t ? null : t)}
                  className={`px-3 py-1 rounded-full text-xs font-caption font-semibold transition-all ${selectedTag === t
                    ? 'bg-[#D3FF69] text-[#000203] shadow-sm'
                    : 'bg-[#242529] text-slate-300 hover:bg-[#373B3E] border border-white/5'
                    }`}
                >
                  #{t}
                </button>
              ))}

              {tagStats.length > SIDEBAR_TAG_LIMIT && (
                <button
                  onClick={() => setIsTagModalOpen(true)}
                  className="px-3 py-1 rounded-full text-xs font-caption font-bold bg-[#141618] hover:bg-[#242529] text-[#97C8EC] border border-[#97C8EC]/30 flex items-center gap-1 transition-all"
                  title="View all tags in dialog"
                >
                  + More ({tagStats.length - SIDEBAR_TAG_LIMIT})
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Vim Shortcut Legend */}
        <div className="p-4 bg-[#242529]/70 backdrop-blur-md rounded-2xl border border-white/5 space-y-2 text-xs">
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

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#000203]">

        {/* Main Section Header with macOS Bar & Quick Capture Top-Right */}
        <header className="px-8 py-4 flex items-center justify-between shrink-0 bg-[#141618] border-b border-white/5">
          <div className="flex items-center gap-3">

            <h2 className="font-caption font-bold text-xl text-[#FAFCFE] tracking-tight">
              {selectedTag ? `Tag: #${selectedTag}` : `${activeFilter.toUpperCase()} BOOKMARKS`}
            </h2>
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-[#242529] text-[#97C8EC] border border-white/5">
              {filteredBookmarks.length} links preserved
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Layout Mode Switcher (Grid, List, Domain Rows) */}
            <div className="flex items-center gap-1 bg-[#242529] p-1 rounded-full border border-white/10">
              <button
                onClick={() => setLayout('grid')}
                title="Grid View (macOS Cards)"
                className={`p-2 rounded-full transition-all ${layoutMode === 'grid'
                  ? 'bg-[#141618] text-[#D3FF69] shadow-sm border border-white/10'
                  : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setLayout('list')}
                title="Compact List View"
                className={`p-2 rounded-full transition-all ${layoutMode === 'list'
                  ? 'bg-[#141618] text-[#D3FF69] shadow-sm border border-white/10'
                  : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                  }`}
              >
                <List className="w-4 h-4" />
              </button>

              <button
                onClick={() => setLayout('domainRows')}
                title="Domain-Grouped Rows View"
                className={`p-2 rounded-full transition-all ${layoutMode === 'domainRows'
                  ? 'bg-[#141618] text-[#D3FF69] shadow-sm border border-white/10'
                  : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                  }`}
              >
                <Rows className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Capture Button relocated to Header Top-Right */}
            <button
              onClick={onOpenCapture}
              className="flex items-center gap-2 px-4 py-2 bg-[#D3FF69] hover:brightness-110 text-[#000203] font-caption font-bold text-xs rounded-full shadow-lg transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Quick Capture</span>
              <kbd className="ml-0.5 px-1.5 py-0.5 text-[9px] font-mono bg-black/20 text-[#000203] rounded-full">
                ⌘K
              </kbd>
            </button>
          </div>
        </header>

        {/* Universal Sorting Control Toolbar for ALL views */}
        <div className="px-8 py-2.5 bg-[#181A1C]/90 border-b border-white/5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-[#8A8F98] font-caption font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#97C8EC]" />
            <span>Sort Items ({filteredBookmarks.length} total)</span>
          </div>

          <div className="flex items-center gap-1 bg-[#242529] p-1 rounded-full border border-white/10 font-caption font-semibold">
            <button
              onClick={() => setSort('az')}
              className={`px-3 py-1 rounded-full text-xs transition-all ${sortMode === 'az'
                ? 'bg-[#D3FF69] text-[#000203] font-bold shadow-sm'
                : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                }`}
            >
              A → Z
            </button>
            <button
              onClick={() => setSort('za')}
              className={`px-3 py-1 rounded-full text-xs transition-all ${sortMode === 'za'
                ? 'bg-[#D3FF69] text-[#000203] font-bold shadow-sm'
                : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                }`}
            >
              Z → A
            </button>
            <button
              onClick={() => setSort('opens')}
              className={`px-3 py-1 rounded-full text-xs transition-all ${sortMode === 'opens'
                ? 'bg-[#D3FF69] text-[#000203] font-bold shadow-sm'
                : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                }`}
            >
              Most Opens
            </button>
            <button
              onClick={() => setSort('newest')}
              className={`px-3 py-1 rounded-full text-xs transition-all ${sortMode === 'newest'
                ? 'bg-[#D3FF69] text-[#000203] font-bold shadow-sm'
                : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                }`}
            >
              Newest Saved
            </button>
          </div>
        </div>

        {/* Link Feed (Grid, List, or Transparent Space-Efficient Domain Rows Layout) */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {filteredBookmarks.length === 0 ? (
            <div className="macos-card p-16 text-center space-y-4 max-w-lg mx-auto my-12">
              <Filter className="w-12 h-12 text-[#8A8F98] mx-auto" />
              <h3 className="font-caption font-bold text-lg text-[#FAFCFE]">No preserved links</h3>
              <p className="text-sm text-[#8A8F98] leading-relaxed">
                No items match the active category or filter query. Click Quick Capture (⌘K) to preserve a new link.
              </p>
            </div>
          ) : layoutMode === 'domainRows' ? (
            /* Space-Efficient Transparent Domain Rows View (Zero Container Waste) */
            <div className="space-y-6 max-w-7xl mx-auto">
              {domainGroups.map((group) => {
                return (
                  <div key={group.domain} className="space-y-3">
                    {/* Compact Lightweight Header Line */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <FaviconWithFallback
                          domain={group.domain}
                          faviconUrl={group.bookmarks[0]?.faviconUrl}
                          title={group.domain}
                          size="sm"
                        />
                        <span className="font-caption font-bold text-sm text-[#FAFCFE] tracking-tight">
                          {group.domain}
                        </span>
                        <span className="text-[11px] font-mono text-[#8A8F98]">
                          ({group.count} {group.count === 1 ? 'link' : 'links'})
                        </span>
                      </div>

                      <span className="font-mono text-xs text-[#D3FF69] flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-[#D3FF69]" />
                        {group.totalOpens} opens
                      </span>
                    </div>

                    {/* Sub-links Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.bookmarks.map((bookmark) => {
                        const useCount = bookmark.useCount || 0;
                        const isMenuOpen = openMenuId === bookmark.id;

                        return (
                          <div
                            key={bookmark.id}
                            onClick={() => handleOpenLink(bookmark)}
                            className="macos-card p-4 flex flex-col justify-between cursor-pointer group relative"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-[10px] font-semibold text-[#97C8EC] bg-[#141618]/80 px-2 py-0.5 rounded-full truncate border border-white/5">
                                  {bookmark.url.replace(/^https?:\/\//i, '').split('/')[1] || 'root'}
                                </span>
                                <span className="font-mono text-[10px] text-[#D3FF69]">
                                  {useCount} opens
                                </span>
                              </div>

                              <h4 className="font-caption font-bold text-sm text-[#FAFCFE] line-clamp-2 group-hover:text-[#D3FF69] transition-colors">
                                {bookmark.title}
                              </h4>
                            </div>

                            {/* Item Action Toolbar */}
                            <div className="pt-3 mt-3 flex items-center justify-between border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => onToggleStar(bookmark.id)}
                                className={`p-1.5 rounded-full transition-colors ${bookmark.starred ? 'text-amber-400' : 'text-[#8A8F98] hover:text-amber-400'
                                  }`}
                              >
                                <Star className={`w-3.5 h-3.5 ${bookmark.starred ? 'fill-amber-400' : ''}`} />
                              </button>

                              <div className="flex items-center gap-1.5 relative three-dot-menu-container">
                                <button
                                  onClick={() => handleOpenLink(bookmark)}
                                  className="p-1.5 rounded-full bg-[#D3FF69] text-[#000203] hover:brightness-110 transition-all shadow-sm"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(isMenuOpen ? null : bookmark.id);
                                  }}
                                  className="p-1.5 rounded-full bg-[#141618] text-slate-300 hover:text-white border border-white/5 transition-colors"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </button>

                                {/* Dropdown Menu Overlay */}
                                {isMenuOpen && (
                                  <div className="absolute right-0 bottom-8 z-30 w-44 bg-[#181A1C] border border-white/10 rounded-xl shadow-2xl py-1 text-xs text-[#FAFCFE]">
                                    <button
                                      onClick={() => { setOpenMenuId(null); onEditBookmark(bookmark); }}
                                      className="w-full px-3 py-1.5 hover:bg-[#242529] flex items-center gap-2 text-left"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 text-[#97C8EC]" /> Edit Link
                                    </button>
                                    <button
                                      onClick={() => { setOpenMenuId(null); onCopyUrl(bookmark.url, bookmark.id); }}
                                      className="w-full px-3 py-1.5 hover:bg-[#242529] flex items-center gap-2 text-left"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-amber-300" /> Copy URL
                                    </button>
                                    <button
                                      onClick={() => { setOpenMenuId(null); onOpenQR(bookmark); }}
                                      className="w-full px-3 py-1.5 hover:bg-[#242529] flex items-center gap-2 text-left text-[#53FFA9]"
                                    >
                                      <QrCode className="w-3.5 h-3.5" /> QR Handoff
                                    </button>
                                    <div className="my-1 border-t border-white/5" />
                                    <button
                                      onClick={() => { setOpenMenuId(null); setDeletingBookmark(bookmark); }}
                                      className="w-full px-3 py-1.5 hover:bg-rose-500/20 text-rose-400 flex items-center gap-2 text-left"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : layoutMode === 'grid' ? (
            /* Grid Layout (macOS Styled Cards) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
              {sortedBookmarks.map((bookmark, idx) => {
                const isSelected = idx === selectedIndex;
                const useCount = bookmark.useCount || 0;
                const isMenuOpen = openMenuId === bookmark.id;

                return (
                  <div
                    key={bookmark.id}
                    onClick={() => {
                      onSelectIndex(idx);
                      handleOpenLink(bookmark);
                    }}
                    className={`macos-card min-h-[185px] p-5.5 flex flex-col justify-between cursor-pointer group relative ${isSelected ? 'macos-card-selected' : ''
                      }`}
                  >
                    {/* Top Header: Favicon & Domain */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FaviconWithFallback
                            domain={bookmark.domain}
                            faviconUrl={bookmark.faviconUrl}
                            title={bookmark.title}
                          />

                          <span className="font-mono text-[11px] font-semibold text-[#97C8EC] bg-[#141618]/80 px-3 py-1 rounded-full truncate border border-white/5">
                            {bookmark.domain}
                          </span>
                        </div>

                        {/* Usage Counter Badge */}
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D3FF69]/10 text-[#D3FF69] font-mono text-[11px] font-semibold shrink-0" title={`Used ${useCount} times`}>
                          <TrendingUp className="w-3 h-3 text-[#D3FF69]" />
                          <span>{useCount} opens</span>
                        </div>
                      </div>

                      {/* Title with Hover Underline */}
                      <h3 className="font-caption text-[17px] text-[#FAFCFE] leading-snug line-clamp-2 group-hover:underline group-hover:decoration-[#D3FF69] group-hover:text-[#D3FF69] transition-colors">
                        {bookmark.title}
                      </h3>

                      {/* Tags Preview */}
                      {bookmark.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {bookmark.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full bg-[#141618]/90 text-[#8A8F98] text-[10px] font-caption font-semibold"
                            >
                              #{tag}
                            </span>
                          ))}
                          {bookmark.tags.length > 3 && (
                            <span className="text-[10px] font-mono text-[#8A8F98]">
                              +{bookmark.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Clean Footer Action Bar */}
                    <div className="pt-3 mt-3 flex items-center justify-between border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onToggleStar(bookmark.id)}
                          title="Toggle Starred (S)"
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${bookmark.starred
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-[#141618] hover:bg-[#242529] text-[#8A8F98] hover:text-amber-400 border border-white/5'
                            }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${bookmark.starred ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>

                      {/* Right Quick Action & Three-Dot Menu */}
                      <div className="flex items-center gap-2 relative three-dot-menu-container">
                        <button
                          onClick={() => handleOpenLink(bookmark)}
                          title="Open Link in Browser (Enter)"
                          className="w-8 h-8 rounded-full bg-[#D3FF69] text-[#000203] font-bold flex items-center justify-center hover:brightness-110 transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>

                        {/* Three-Dot Menu Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : bookmark.id);
                          }}
                          title="More options"
                          className={`w-8 h-8 rounded-full bg-[#141618] hover:bg-[#242529] flex items-center justify-center transition-colors border border-white/5 ${isMenuOpen ? 'text-[#D3FF69] bg-[#242529] border-[#D3FF69]/30' : 'text-slate-300 hover:text-[#FAFCFE]'
                            }`}
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Dropdown Menu Overlay */}
                        {isMenuOpen && (
                          <div className="absolute right-0 bottom-10 z-30 w-48 bg-[#181A1C] border border-white/10 rounded-2xl shadow-2xl py-1.5 text-xs text-[#FAFCFE] font-caption animate-pop-fade">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onEditBookmark(bookmark);
                              }}
                              className="w-full px-3.5 py-2 hover:bg-[#242529] flex items-center gap-2.5 text-left text-slate-200 hover:text-[#FAFCFE]"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#97C8EC]" /> Edit Link Details
                            </button>

                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onCopyUrl(bookmark.url, bookmark.id);
                              }}
                              className="w-full px-3.5 py-2 hover:bg-[#242529] flex items-center gap-2.5 text-left text-slate-200 hover:text-[#FAFCFE]"
                            >
                              <Copy className="w-3.5 h-3.5 text-amber-300" /> Copy Clean URL
                            </button>

                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onOpenQR(bookmark);
                              }}
                              className="w-full px-3.5 py-2 hover:bg-[#242529] flex items-center gap-2.5 text-left text-slate-200 hover:text-[#53FFA9]"
                            >
                              <QrCode className="w-3.5 h-3.5 text-[#53FFA9]" /> Mobile QR Handoff
                            </button>

                            <div className="my-1 border-t border-white/5" />

                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setDeletingBookmark(bookmark);
                              }}
                              className="w-full px-3.5 py-2 hover:bg-rose-500/20 text-rose-400 flex items-center gap-2.5 text-left"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Link
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3 max-w-5xl mx-auto">
              {sortedBookmarks.map((bookmark, idx) => {
                const isSelected = idx === selectedIndex;
                const useCount = bookmark.useCount || 0;
                const isMenuOpen = openMenuId === bookmark.id;

                return (
                  <div
                    key={bookmark.id}
                    onClick={() => {
                      onSelectIndex(idx);
                      handleOpenLink(bookmark);
                    }}
                    className={`macos-card px-6 py-4 flex items-center justify-between group cursor-pointer ${isSelected ? 'macos-card-selected' : ''
                      }`}
                  >
                    {/* Left Info: Favicon, Domain, Title & Usage */}
                    <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                      <FaviconWithFallback
                        domain={bookmark.domain}
                        faviconUrl={bookmark.faviconUrl}
                        title={bookmark.title}
                      />

                      <span className="font-mono text-[11px] font-semibold text-[#97C8EC] bg-[#141618] px-2.5 py-0.5 rounded-full shrink-0 border border-white/5">
                        {bookmark.domain}
                      </span>

                      <h3 className="font-caption font-bold text-sm text-[#FAFCFE] truncate group-hover:underline group-hover:decoration-[#D3FF69] group-hover:text-[#D3FF69] transition-colors">
                        {bookmark.title}
                      </h3>

                      <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-[#D3FF69] bg-[#141618] px-2.5 py-0.5 rounded-full shrink-0 border border-white/5">
                        <Eye className="w-3 h-3 text-[#D3FF69]" />
                        {useCount} opens
                      </span>
                    </div>

                    {/* Right Action Bar & Three-Dot Menu */}
                    <div className="flex items-center gap-2 shrink-0 relative three-dot-menu-container" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleStar(bookmark.id)}
                        title="Toggle Starred (S)"
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${bookmark.starred
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-[#141618] hover:bg-[#242529] text-[#8A8F98] hover:text-amber-400 border border-white/5'
                          }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${bookmark.starred ? 'fill-amber-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleOpenLink(bookmark)}
                        title="Open Link in Browser (Enter)"
                        className="w-8 h-8 rounded-full bg-[#D3FF69] text-[#000203] font-bold flex items-center justify-center hover:brightness-110 transition-colors shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      {/* Three-Dot Menu Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(isMenuOpen ? null : bookmark.id);
                        }}
                        title="More options"
                        className={`w-8 h-8 rounded-full bg-[#141618] hover:bg-[#242529] flex items-center justify-center transition-colors border border-white/5 ${isMenuOpen ? 'text-[#D3FF69] bg-[#242529] border-[#D3FF69]/30' : 'text-slate-300 hover:text-[#FAFCFE]'
                          }`}
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu Overlay */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-10 z-30 w-48 bg-[#181A1C] border border-white/10 rounded-2xl shadow-2xl py-1.5 text-xs text-[#FAFCFE] font-caption animate-pop-fade">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              onEditBookmark(bookmark);
                            }}
                            className="w-full px-3.5 py-2 hover:bg-[#242529] flex items-center gap-2.5 text-left text-slate-200 hover:text-[#FAFCFE]"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#97C8EC]" /> Edit Link Details
                          </button>

                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              onCopyUrl(bookmark.url, bookmark.id);
                            }}
                            className="w-full px-3.5 py-2 hover:bg-[#242529] flex items-center gap-2.5 text-left text-slate-200 hover:text-[#FAFCFE]"
                          >
                            <Copy className="w-3.5 h-3.5 text-amber-300" /> Copy Clean URL
                          </button>

                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              onOpenQR(bookmark);
                            }}
                            className="w-full px-3.5 py-2 hover:bg-[#242529] flex items-center gap-2.5 text-left text-slate-200 hover:text-[#53FFA9]"
                          >
                            <QrCode className="w-3.5 h-3.5 text-[#53FFA9]" /> Mobile QR Handoff
                          </button>

                          <div className="my-1 border-t border-white/5" />

                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              setDeletingBookmark(bookmark);
                            }}
                            className="w-full px-3.5 py-2 hover:bg-rose-500/20 text-rose-400 flex items-center gap-2.5 text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Link
                          </button>
                        </div>
                      )}
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

      {/* All Tags Selection Dialog */}
      <TagSelectionModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        tagStats={tagStats}
        selectedTag={selectedTag}
        onSelectTag={(tag) => setTag(tag)}
      />

    </div>
  );
};
