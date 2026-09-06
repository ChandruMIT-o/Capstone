import type { Bookmark, CommandMacro } from '../types';

const STORAGE_KEY = 'quantum_desk_bookmarks_v1';

export const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-1',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    title: 'tailwindlabs/tailwindcss',
    domain: 'github.com',
    description: 'A utility-first CSS framework for rapid UI development.',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
    readingTimeMinutes: 7,
    tags: ['Dev', 'Code', 'OpenSource'],
    status: 'reading',
    starred: true,
    createdAt: '2026-08-30T10:00:00.000Z',
    notes: 'Key focus: v3 vs v4 upgrade guide, performance benchmarks for container queries.',
    collection: 'Frontend',
    useCount: 14,
  },
  {
    id: 'bm-2',
    url: 'https://figma.com/file/design-tokens-v2',
    title: 'Figma Design Canvas - Quantum Tokens',
    domain: 'figma.com',
    description: 'Interactive UI/UX canvas, design tokens, and vector wireframes.',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=figma.com&sz=128',
    readingTimeMinutes: 5,
    tags: ['Design', 'Canvas'],
    status: 'unread',
    starred: true,
    createdAt: '2026-08-31T14:30:00.000Z',
    notes: 'Review dark mode background tokens (#000203, #181A1C, #242529).',
    collection: 'Design Systems',
    useCount: 8,
  },
  {
    id: 'bm-3',
    url: 'https://youtube.com/watch?v=quantum_computing_2026',
    title: 'YouTube Video Content: Quantum State Mechanics',
    domain: 'youtube.com',
    description: 'High velocity video stream & media recording on quantum computing and qubit stability.',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128',
    readingTimeMinutes: 12,
    tags: ['Video', 'Media'],
    status: 'completed',
    starred: false,
    createdAt: '2026-09-01T09:15:00.000Z',
    notes: 'Excellent breakdown of error mitigation techniques in NISQ hardware.',
    collection: 'Media',
    useCount: 22,
  },
  {
    id: 'bm-4',
    url: 'https://x.com/reactjs/status/192837465',
    title: 'X / Twitter Post: React 19 Server Components',
    domain: 'x.com',
    description: 'Social post broadcast and ecosystem discussion regarding async transitions.',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=x.com&sz=128',
    readingTimeMinutes: 2,
    tags: ['Social', 'Signal'],
    status: 'unread',
    starred: false,
    createdAt: '2026-09-02T08:00:00.000Z',
    collection: 'Frontend',
    useCount: 3,
  },
  {
    id: 'bm-5',
    url: 'https://docs.vite.dev/guide/performance',
    title: 'docs.vite.dev Documentation: Performance Optimization',
    domain: 'docs.vite.dev',
    description: 'API reference docs, technical manuals, and architecture specs for Vite build pipeline.',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=docs.vite.dev&sz=128',
    readingTimeMinutes: 8,
    tags: ['Docs', 'Reference', 'Dev'],
    status: 'reading',
    starred: true,
    createdAt: '2026-09-02T11:45:00.000Z',
    notes: 'Check chunk split rules and pre-bundling dependencies.',
    collection: 'Frontend',
    useCount: 17,
  },
];

export const INITIAL_MACROS: CommandMacro[] = [
  {
    id: 'mac-1',
    name: 'Export Bookmarks JSON',
    description: 'Downloads a complete clean JSON snapshot of all saved links and notes.',
    shortcut: '⌘E',
    category: 'Data',
    action: 'export_json',
  },
  {
    id: 'mac-2',
    name: 'Purge Duplicate URLs',
    description: 'Scans collection for duplicate normalized links and consolidates tags.',
    shortcut: '⌘D',
    category: 'System',
    action: 'purge_duplicates',
  },
  {
    id: 'mac-3',
    name: 'Re-index Linkage Graph',
    description: 'Recomputes force-directed node positions and edge associations.',
    shortcut: '⌘R',
    category: 'Graph',
    action: 'reindex_graph',
  },
  {
    id: 'mac-4',
    name: 'Mark All Queue as Completed',
    description: 'Batch updates reading queue state from reading -> completed.',
    shortcut: '⌘Shift+C',
    category: 'Queue',
    action: 'complete_all_queue',
  },
];

export function getStoredBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return INITIAL_BOOKMARKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_BOOKMARKS;
  } catch {
    return INITIAL_BOOKMARKS;
  }
}

export async function fetchBookmarksFromJSON(): Promise<Bookmark[]> {
  try {
    const res = await fetch('/api/bookmarks');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Unable to fetch from /api/bookmarks JSON endpoint, using fallback:', err);
  }
  return getStoredBookmarks();
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  // 1. Synchronous localStorage backup
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (err) {
    console.error('Failed to save bookmarks to localStorage', err);
  }

  // 2. Asynchronous write directly to data/bookmarks.json file database on disk
  fetch('/api/bookmarks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookmarks, null, 2),
  }).catch((err) => {
    console.warn('Server JSON storage sync skipped or unavailable:', err);
  });
}

// User UI Preferences Persistence
const PREFS_STORAGE_KEY = 'quantum_desk_preferences_v1';

export interface UserPreferences {
  layoutMode: 'grid' | 'list' | 'domainRows';
  sortMode: 'az' | 'za' | 'opens' | 'newest';
  activeFilter: 'all' | 'starred';
  selectedTag: string | null;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  layoutMode: 'grid',
  sortMode: 'az',
  activeFilter: 'all',
  selectedTag: null,
};

export function getStoredPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export async function fetchPreferencesFromJSON(): Promise<UserPreferences> {
  try {
    const res = await fetch('/api/preferences');
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        const merged = { ...DEFAULT_PREFERENCES, ...data };
        localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (err) {
    console.warn('Unable to fetch from /api/preferences JSON endpoint, using fallback:', err);
  }
  return getStoredPreferences();
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save preferences to localStorage', err);
  }

  fetch('/api/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prefs, null, 2),
  }).catch((err) => {
    console.warn('Server JSON preference sync skipped or unavailable:', err);
  });
}
