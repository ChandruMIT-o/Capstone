import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export interface DomainTheme {
  name: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBorder: string;
  topGradient: string;
  titleHover: string;
  glowShadow: string;
  accentHex: string;
}

const SPECIFIC_DOMAIN_THEMES: Record<string, DomainTheme> = {
  'github.com': {
    name: 'GitHub',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
    cardBorder: 'border-emerald-500/25 hover:border-emerald-400/60',
    topGradient: 'from-emerald-400 via-teal-300 via-emerald-500 to-emerald-400',
    titleHover: 'group-hover:text-emerald-300 group-hover:decoration-emerald-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.18)]',
    accentHex: '#10b981',
  },
  'youtube.com': {
    name: 'YouTube',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/30',
    cardBorder: 'border-rose-500/25 hover:border-rose-400/60',
    topGradient: 'from-rose-400 via-red-300 via-rose-500 to-rose-400',
    titleHover: 'group-hover:text-rose-300 group-hover:decoration-rose-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(244,63,94,0.18)]',
    accentHex: '#f43f5e',
  },
  'figma.com': {
    name: 'Figma',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/30',
    cardBorder: 'border-purple-500/25 hover:border-purple-400/60',
    topGradient: 'from-purple-400 via-fuchsia-300 via-purple-500 to-purple-400',
    titleHover: 'group-hover:text-purple-300 group-hover:decoration-purple-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(168,85,247,0.18)]',
    accentHex: '#a855f7',
  },
  'twitter.com': {
    name: 'Twitter',
    badgeBg: 'bg-sky-500/15',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/30',
    cardBorder: 'border-sky-500/25 hover:border-sky-400/60',
    topGradient: 'from-sky-400 via-cyan-300 via-sky-500 to-sky-400',
    titleHover: 'group-hover:text-sky-300 group-hover:decoration-sky-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(14,165,233,0.18)]',
    accentHex: '#0ea5e9',
  },
  'x.com': {
    name: 'X',
    badgeBg: 'bg-sky-500/15',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/30',
    cardBorder: 'border-sky-500/25 hover:border-sky-400/60',
    topGradient: 'from-sky-400 via-cyan-300 via-sky-500 to-sky-400',
    titleHover: 'group-hover:text-sky-300 group-hover:decoration-sky-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(14,165,233,0.18)]',
    accentHex: '#0ea5e9',
  },
  'notion.so': {
    name: 'Notion',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
    cardBorder: 'border-amber-500/25 hover:border-amber-400/60',
    topGradient: 'from-amber-400 via-yellow-300 via-amber-500 to-amber-400',
    titleHover: 'group-hover:text-amber-300 group-hover:decoration-amber-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(245,158,11,0.18)]',
    accentHex: '#f59e0b',
  },
  'medium.com': {
    name: 'Medium',
    badgeBg: 'bg-teal-500/15',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/30',
    cardBorder: 'border-teal-500/25 hover:border-teal-400/60',
    topGradient: 'from-teal-400 via-emerald-300 via-teal-500 to-teal-400',
    titleHover: 'group-hover:text-teal-300 group-hover:decoration-teal-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(20,184,166,0.18)]',
    accentHex: '#14b8a6',
  },
  'reddit.com': {
    name: 'Reddit',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-500/30',
    cardBorder: 'border-orange-500/25 hover:border-orange-400/60',
    topGradient: 'from-orange-400 via-amber-300 via-orange-500 to-orange-400',
    titleHover: 'group-hover:text-orange-300 group-hover:decoration-orange-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(249,115,22,0.18)]',
    accentHex: '#f97316',
  },
  'stackoverflow.com': {
    name: 'Stack Overflow',
    badgeBg: 'bg-amber-600/15',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-600/30',
    cardBorder: 'border-amber-600/25 hover:border-amber-500/60',
    topGradient: 'from-amber-500 via-orange-300 via-amber-600 to-amber-500',
    titleHover: 'group-hover:text-amber-400 group-hover:decoration-amber-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(217,119,6,0.18)]',
    accentHex: '#d97706',
  },
  'vercel.com': {
    name: 'Vercel',
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-500/30',
    cardBorder: 'border-indigo-500/25 hover:border-indigo-400/60',
    topGradient: 'from-indigo-400 via-violet-300 via-indigo-500 to-indigo-400',
    titleHover: 'group-hover:text-indigo-300 group-hover:decoration-indigo-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(99,102,241,0.18)]',
    accentHex: '#6366f1',
  },
};

const FALLBACK_THEMES: DomainTheme[] = [
  {
    name: 'Cyan',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/30',
    cardBorder: 'border-cyan-500/25 hover:border-cyan-400/60',
    topGradient: 'from-cyan-400 via-sky-300 via-cyan-500 to-cyan-400',
    titleHover: 'group-hover:text-cyan-300 group-hover:decoration-cyan-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(6,182,212,0.18)]',
    accentHex: '#06b6d4',
  },
  {
    name: 'Emerald',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
    cardBorder: 'border-emerald-500/25 hover:border-emerald-400/60',
    topGradient: 'from-emerald-400 via-teal-300 via-emerald-500 to-emerald-400',
    titleHover: 'group-hover:text-emerald-300 group-hover:decoration-emerald-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.18)]',
    accentHex: '#10b981',
  },
  {
    name: 'Violet',
    badgeBg: 'bg-violet-500/15',
    badgeText: 'text-violet-300',
    badgeBorder: 'border-violet-500/30',
    cardBorder: 'border-violet-500/25 hover:border-violet-400/60',
    topGradient: 'from-violet-400 via-purple-300 via-violet-500 to-violet-400',
    titleHover: 'group-hover:text-violet-300 group-hover:decoration-violet-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(139,92,246,0.18)]',
    accentHex: '#8b5cf6',
  },
  {
    name: 'Fuchsia',
    badgeBg: 'bg-fuchsia-500/15',
    badgeText: 'text-fuchsia-300',
    badgeBorder: 'border-fuchsia-500/30',
    cardBorder: 'border-fuchsia-500/25 hover:border-fuchsia-400/60',
    topGradient: 'from-fuchsia-400 via-pink-300 via-fuchsia-500 to-fuchsia-400',
    titleHover: 'group-hover:text-fuchsia-300 group-hover:decoration-fuchsia-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(217,70,239,0.18)]',
    accentHex: '#d946ef',
  },
  {
    name: 'Lime',
    badgeBg: 'bg-lime-500/15',
    badgeText: 'text-lime-300',
    badgeBorder: 'border-lime-500/30',
    cardBorder: 'border-lime-500/25 hover:border-lime-400/60',
    topGradient: 'from-lime-400 via-yellow-300 via-lime-500 to-lime-400',
    titleHover: 'group-hover:text-lime-300 group-hover:decoration-lime-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(132,204,22,0.18)]',
    accentHex: '#84cc16',
  },
  {
    name: 'Rose',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/30',
    cardBorder: 'border-rose-500/25 hover:border-rose-400/60',
    topGradient: 'from-rose-400 via-red-300 via-rose-500 to-rose-400',
    titleHover: 'group-hover:text-rose-300 group-hover:decoration-rose-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(244,63,94,0.18)]',
    accentHex: '#f43f5e',
  },
  {
    name: 'Blue',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/30',
    cardBorder: 'border-blue-500/25 hover:border-blue-400/60',
    topGradient: 'from-blue-400 via-indigo-300 via-blue-500 to-blue-400',
    titleHover: 'group-hover:text-blue-300 group-hover:decoration-blue-400',
    glowShadow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
    accentHex: '#3b82f6',
  },
];

export function getDomainTheme(domain: string): DomainTheme {
  const cleanDomain = domain.toLowerCase().trim().replace(/^www\./, '');
  if (SPECIFIC_DOMAIN_THEMES[cleanDomain]) {
    return SPECIFIC_DOMAIN_THEMES[cleanDomain];
  }
  let hash = 0;
  for (let i = 0; i < cleanDomain.length; i++) {
    hash = (hash << 5) - hash + cleanDomain.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % FALLBACK_THEMES.length;
  return FALLBACK_THEMES[index];
}

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

      {/* Toast Notification with Spring Motion */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-[#D3FF69] text-[#000203] font-caption font-bold text-sm rounded-full shadow-2xl flex items-center gap-2.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Studio Left Sidebar */}
      <aside className="w-72 lg:w-80 bg-[#141618] border-r border-white/5 flex flex-col justify-between p-6 shrink-0">

        <div className="space-y-6">

          {/* Header Brand + Launcher Return Button */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-11 h-11 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <img src="/logos/linker.png" alt="Linker Logo" className="w-full h-full object-contain" />
              </motion.div>
              <div>
                <h1 className="font-caption font-bold text-lg text-[#FAFCFE] tracking-tight">
                  Linker
                </h1>
                <p className="text-xs text-[#8A8F98] font-medium">Digital Preservation</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#373B3E' }}
              whileTap={{ scale: 0.9 }}
              onClick={onReturnHome}
              title="Return to App Suite Launcher"
              className="p-2 rounded-xl bg-[#242529] text-slate-300 hover:text-[#D3FF69] transition-colors"
            >
              <Grid className="w-4 h-4" />
            </motion.button>
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
              className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-full pl-10 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/40 transition-all border border-white/5"
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

            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setFilter('all'); setTag(null); }}
              className={`relative w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-caption font-semibold transition-colors ${activeFilter === 'all' && !selectedTag
                ? 'text-[#FAFCFE]'
                : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                }`}
            >
              {activeFilter === 'all' && !selectedTag && (
                <motion.div
                  layoutId="activeLibraryFilterPill"
                  className="absolute inset-0 bg-[#242529] rounded-full border border-white/10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-[#8A8F98]" />
                <span>All Saved Links</span>
              </div>
              <span className="relative z-10 font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#000203] text-[#97C8EC]">
                {bookmarks.length}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter('starred')}
              className={`relative w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-caption font-semibold transition-colors ${activeFilter === 'starred'
                ? 'text-amber-300'
                : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                }`}
            >
              {activeFilter === 'starred' && (
                <motion.div
                  layoutId="activeLibraryFilterPill"
                  className="absolute inset-0 bg-amber-500/10 border border-amber-500/20 rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                <span>Starred</span>
              </div>
              <span className="relative z-10 font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#000203] text-amber-300">
                {bookmarks.filter((b) => b.starred).length}
              </span>
            </motion.button>
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
                <motion.button
                  layout
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  key={t}
                  onClick={() => setTag(selectedTag === t ? null : t)}
                  className={`px-3 py-1 rounded-full text-xs font-caption font-semibold transition-colors ${selectedTag === t
                    ? 'bg-[#D3FF69] text-[#000203] shadow-sm font-bold'
                    : 'bg-[#242529] text-slate-300 hover:bg-[#373B3E] border border-white/5'
                    }`}
                >
                  #{t}
                </motion.button>
              ))}

              {tagStats.length > SIDEBAR_TAG_LIMIT && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsTagModalOpen(true)}
                  className="px-3 py-1 rounded-full text-xs font-caption font-bold bg-[#141618] hover:bg-[#242529] text-[#97C8EC] border border-[#97C8EC]/30 flex items-center gap-1 transition-all"
                  title="View all tags in dialog"
                >
                  + More ({tagStats.length - SIDEBAR_TAG_LIMIT})
                </motion.button>
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
            {/* Animated Layout Mode Switcher Group (Grid, List, Domain Rows) */}
            <div className="flex items-center gap-1 bg-[#242529] p-1 rounded-full border border-white/10 relative">
              {[
                { id: 'grid', label: 'Grid View', icon: LayoutGrid },
                { id: 'list', label: 'Compact List View', icon: List },
                { id: 'domainRows', label: 'Domain Rows View', icon: Rows },
              ].map((item) => {
                const isActive = layoutMode === item.id;
                const IconComponent = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLayout(item.id as any)}
                    title={item.label}
                    className={`relative p-2 rounded-full transition-colors z-10 ${
                      isActive ? 'text-[#D3FF69]' : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeLayoutPill"
                        className="absolute inset-0 bg-[#141618] rounded-full border border-white/10 shadow-sm"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10"><IconComponent className="w-4 h-4" /></span>
                  </motion.button>
                );
              })}
            </div>

            {/* Quick Capture Button relocated to Header Top-Right */}
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: '#e2ff88' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={onOpenCapture}
              className="flex items-center gap-2 px-4 py-2 bg-[#D3FF69] text-[#000203] font-caption font-bold text-xs rounded-full shadow-lg transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Quick Capture</span>
              <kbd className="ml-0.5 px-1.5 py-0.5 text-[9px] font-mono bg-black/20 text-[#000203] rounded-full">
                ⌘K
              </kbd>
            </motion.button>
          </div>
        </header>

        {/* Universal Animated Sorting Control Toolbar */}
        <div className="px-8 py-2.5 bg-[#181A1C]/90 border-b border-white/5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-[#8A8F98] font-caption font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#97C8EC]" />
            <span>Sort Items ({filteredBookmarks.length} total)</span>
          </div>

          <div className="flex items-center gap-1 bg-[#242529] p-1 rounded-full border border-white/10 font-caption font-semibold relative">
            {[
              { id: 'az', label: 'A → Z' },
              { id: 'za', label: 'Z → A' },
              { id: 'opens', label: 'Most Opens' },
              { id: 'newest', label: 'Newest Saved' },
            ].map((option) => {
              const isActive = sortMode === option.id;
              return (
                <motion.button
                  key={option.id}
                  onClick={() => setSort(option.id as any)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative px-3 py-1 rounded-full text-xs transition-colors z-10 ${
                    isActive ? 'text-[#000203] font-bold' : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSortPill"
                      className="absolute inset-0 bg-[#D3FF69] rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{option.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Link Feed (Grid, List, or Transparent Space-Efficient Domain Rows Layout) */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {filteredBookmarks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="macos-card p-16 text-center space-y-4 max-w-lg mx-auto my-12"
              >
                <Filter className="w-12 h-12 text-[#8A8F98] mx-auto" />
                <h3 className="font-caption font-bold text-lg text-[#FAFCFE]">No preserved links</h3>
                <p className="text-sm text-[#8A8F98] leading-relaxed">
                  No items match the active category or filter query. Click Quick Capture (⌘K) to preserve a new link.
                </p>
              </motion.div>
            ) : layoutMode === 'domainRows' ? (
              /* Space-Efficient Transparent Domain Rows View (Zero Container Waste) */
              <motion.div
                key="domainRows"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 max-w-7xl mx-auto"
              >
                {domainGroups.map((group) => {
                  const domainTheme = getDomainTheme(group.domain);
                  return (
                    <motion.div layout key={group.domain} className="space-y-3">
                      {/* Compact Lightweight Header Line with Domain Theme Badge */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <FaviconWithFallback
                            domain={group.domain}
                            faviconUrl={group.bookmarks[0]?.faviconUrl}
                            title={group.domain}
                            size="sm"
                          />
                          <span className="font-caption font-bold text-base text-[#FAFCFE] tracking-tight">
                            {group.domain}
                          </span>
                          <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${domainTheme.badgeBg} ${domainTheme.badgeText} ${domainTheme.badgeBorder}`}>
                            {group.count} {group.count === 1 ? 'link' : 'links'}
                          </span>
                        </div>

                        <span className="font-mono text-xs text-[#D3FF69] flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-[#D3FF69]" />
                          {group.totalOpens} opens
                        </span>
                      </div>

                      {/* Sub-links Grid Container */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <AnimatePresence mode="popLayout">
                          {group.bookmarks.map((bookmark) => {
                            const useCount = bookmark.useCount || 0;
                            const isMenuOpen = openMenuId === bookmark.id;

                            return (
                              <motion.div
                                layout="position"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                whileHover={{ y: -3, scale: 1.008 }}
                                transition={{
                                  layout: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                                  opacity: { duration: 0.15 },
                                }}
                                key={bookmark.id}
                                onClick={() => handleOpenLink(bookmark)}
                                className={`macos-card p-4 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all duration-300 border ${domainTheme.cardBorder} ${domainTheme.glowShadow}`}
                              >
                                {/* Top Category Accent Line with Slow Continuous Motion */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${domainTheme.topGradient} animated-accent-gradient`} />
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full truncate border ${domainTheme.badgeBg} ${domainTheme.badgeText} ${domainTheme.badgeBorder}`}>
                                      {bookmark.url.replace(/^https?:\/\//i, '').split('/')[1] || 'root'}
                                    </span>
                                    <span className="font-mono text-[10px] text-[#D3FF69]">
                                      {useCount} opens
                                    </span>
                                  </div>

                                  <h4 className={`font-caption font-bold text-base text-[#FAFCFE] line-clamp-2 transition-colors ${domainTheme.titleHover}`}>
                                    {bookmark.title}
                                  </h4>
                                </div>

                                {/* Item Action Toolbar */}
                                <div className="pt-3 mt-3 flex items-center justify-between border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onToggleStar(bookmark.id)}
                                    className={`p-1.5 rounded-full transition-colors ${bookmark.starred ? 'text-amber-400' : 'text-[#8A8F98] hover:text-amber-400'
                                      }`}
                                  >
                                    <Star className={`w-3.5 h-3.5 ${bookmark.starred ? 'fill-amber-400' : ''}`} />
                                  </motion.button>

                                  <div className="flex items-center gap-1.5 relative three-dot-menu-container">
                                    <motion.button
                                      whileHover={{ scale: 1.08 }}
                                      whileTap={{ scale: 0.92 }}
                                      onClick={() => handleOpenLink(bookmark)}
                                      className="p-1.5 rounded-full bg-[#D3FF69] text-[#000203] shadow-sm"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                                    </motion.button>

                                    <motion.button
                                      whileHover={{ scale: 1.08 }}
                                      whileTap={{ scale: 0.92 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(isMenuOpen ? null : bookmark.id);
                                      }}
                                      className="p-1.5 rounded-full bg-[#141618] text-slate-300 hover:text-white border border-white/5 transition-colors"
                                    >
                                      <MoreVertical className="w-3.5 h-3.5" />
                                    </motion.button>

                                    {/* Dropdown Menu Overlay */}
                                    <AnimatePresence>
                                      {isMenuOpen && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95, y: 6 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                          className="absolute right-0 bottom-8 z-30 w-44 bg-[#181A1C] border border-white/10 rounded-xl shadow-2xl py-1 text-xs text-[#FAFCFE]"
                                        >
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
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>

                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : layoutMode === 'grid' ? (
              /* Grid Layout (macOS Styled Cards with Domain Category Visual Variations & Motion) */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto"
              >
                <AnimatePresence mode="popLayout">
                  {sortedBookmarks.map((bookmark, idx) => {
                    const isSelected = idx === selectedIndex;
                    const useCount = bookmark.useCount || 0;
                    const isMenuOpen = openMenuId === bookmark.id;
                    const theme = getDomainTheme(bookmark.domain);

                    return (
                      <motion.div
                        layout="position"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{
                          layout: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.15 },
                          scale: { duration: 0.15 },
                        }}
                        key={bookmark.id}
                        onClick={() => {
                          onSelectIndex(idx);
                          handleOpenLink(bookmark);
                        }}
                        className={`macos-card min-h-[200px] p-5.5 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all duration-300 ${theme.cardBorder} ${theme.glowShadow} ${
                          isSelected ? 'macos-card-selected ring-2 ring-[#D3FF69]' : ''
                        }`}
                      >
                        {/* Top Category Accent Line with Slow Continuous Motion */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.topGradient} animated-accent-gradient`} />

                        {/* Top Header: Favicon & Domain */}
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FaviconWithFallback
                                domain={bookmark.domain}
                                faviconUrl={bookmark.faviconUrl}
                                title={bookmark.title}
                              />

                              <span className={`font-mono text-[11px] font-bold px-3 py-1 rounded-full truncate border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                                {bookmark.domain}
                              </span>
                            </div>

                            {/* Usage Counter Badge */}
                            <motion.div
                              whileHover={{ scale: 1.04 }}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D3FF69]/10 text-[#D3FF69] font-mono text-[11px] font-semibold shrink-0" title={`Used ${useCount} times`}
                            >
                              <TrendingUp className="w-3 h-3 text-[#D3FF69]" />
                              <span>{useCount} opens</span>
                            </motion.div>
                          </div>

                          {/* Larger Prominent Title (text-xl font-bold) with Domain Hover Accent */}
                          <h3 className={`font-caption font-bold text-xl text-[#FAFCFE] tracking-tight leading-snug line-clamp-2 transition-colors ${theme.titleHover}`}>
                            {bookmark.title}
                          </h3>

                          {/* Tags Preview */}
                          {bookmark.tags.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {bookmark.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-3 py-1 rounded-full bg-[#141618]/90 text-[#8A8F98] text-[10px] font-caption font-semibold border border-white/5"
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
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onToggleStar(bookmark.id)}
                              title="Toggle Starred (S)"
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${bookmark.starred
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-[#141618] hover:bg-[#242529] text-[#8A8F98] hover:text-amber-400 border border-white/5'
                                }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${bookmark.starred ? 'fill-amber-400' : ''}`} />
                            </motion.button>
                          </div>

                          {/* Right Quick Action & Three-Dot Menu */}
                          <div className="flex items-center gap-2 relative three-dot-menu-container">
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => handleOpenLink(bookmark)}
                              title="Open Link in Browser (Enter)"
                              className="w-8 h-8 rounded-full bg-[#D3FF69] text-[#000203] font-bold flex items-center justify-center shadow-sm"
                            >
                              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                            </motion.button>

                            {/* Three-Dot Menu Button */}
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(isMenuOpen ? null : bookmark.id);
                              }}
                              title="More options"
                              className={`w-8 h-8 rounded-full bg-[#141618] hover:bg-[#242529] flex items-center justify-center transition-colors border border-white/5 ${isMenuOpen ? 'text-[#D3FF69] bg-[#242529] border-[#D3FF69]/30' : 'text-slate-300 hover:text-[#FAFCFE]'
                                }`}
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </motion.button>

                            {/* Dropdown Menu Overlay */}
                            <AnimatePresence>
                              {isMenuOpen && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 6 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                  className="absolute right-0 bottom-10 z-30 w-48 bg-[#181A1C] border border-white/10 rounded-2xl shadow-2xl py-1.5 text-xs text-[#FAFCFE] font-caption"
                                >
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
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* List View */
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 max-w-5xl mx-auto"
              >
                <AnimatePresence mode="popLayout">
                  {sortedBookmarks.map((bookmark, idx) => {
                    const isSelected = idx === selectedIndex;
                    const useCount = bookmark.useCount || 0;
                    const isMenuOpen = openMenuId === bookmark.id;
                    const theme = getDomainTheme(bookmark.domain);

                    return (
                      <motion.div
                        layout="position"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ x: 2, scale: 1.003 }}
                        transition={{
                          layout: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.15 },
                        }}
                        key={bookmark.id}
                        onClick={() => {
                          onSelectIndex(idx);
                          handleOpenLink(bookmark);
                        }}
                        className={`macos-card px-6 py-4 flex items-center justify-between group cursor-pointer transition-all duration-300 ${theme.cardBorder} ${theme.glowShadow} ${isSelected ? 'macos-card-selected ring-2 ring-[#D3FF69]/50' : ''
                          }`}
                      >
                        {/* Left Info: Favicon, Domain, Title & Usage */}
                        <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                          <FaviconWithFallback
                            domain={bookmark.domain}
                            faviconUrl={bookmark.faviconUrl}
                            title={bookmark.title}
                          />

                          <span className={`font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                            {bookmark.domain}
                          </span>

                          <h3 className={`font-caption font-bold text-base text-[#FAFCFE] truncate transition-colors ${theme.titleHover}`}>
                            {bookmark.title}
                          </h3>

                          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-[#D3FF69] bg-[#141618] px-2.5 py-0.5 rounded-full shrink-0 border border-white/5">
                            <Eye className="w-3 h-3 text-[#D3FF69]" />
                            {useCount} opens
                          </span>
                        </div>

                        {/* Right Action Bar & Three-Dot Menu */}
                        <div className="flex items-center gap-2 shrink-0 relative three-dot-menu-container" onClick={(e) => e.stopPropagation()}>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => onToggleStar(bookmark.id)}
                            title="Toggle Starred (S)"
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${bookmark.starred
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-[#141618] hover:bg-[#242529] text-[#8A8F98] hover:text-amber-400 border border-white/5'
                              }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${bookmark.starred ? 'fill-amber-400' : ''}`} />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenLink(bookmark)}
                            title="Open Link in Browser (Enter)"
                            className="w-8 h-8 rounded-full bg-[#D3FF69] text-[#000203] font-bold flex items-center justify-center shadow-sm"
                          >
                            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                          </motion.button>

                          {/* Three-Dot Menu Button */}
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(isMenuOpen ? null : bookmark.id);
                            }}
                            title="More options"
                            className={`w-8 h-8 rounded-full bg-[#141618] hover:bg-[#242529] flex items-center justify-center transition-colors border border-white/5 ${isMenuOpen ? 'text-[#D3FF69] bg-[#242529] border-[#D3FF69]/30' : 'text-slate-300 hover:text-[#FAFCFE]'
                              }`}
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </motion.button>

                          {/* Dropdown Menu Overlay */}
                          <AnimatePresence>
                            {isMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85, y: 10 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                                className="absolute right-0 top-10 z-30 w-48 bg-[#181A1C] border border-white/10 rounded-2xl shadow-2xl py-1.5 text-xs text-[#FAFCFE] font-caption"
                              >
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
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
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
