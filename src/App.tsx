import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppView, Bookmark } from './types';
import { 
  getStoredBookmarks, 
  saveBookmarks, 
  fetchBookmarksFromJSON,
  getStoredPreferences,
  fetchPreferencesFromJSON,
  savePreferences,
  type UserPreferences 
} from './utils/storage';
import { QuantumDeskHome } from './components/QuantumDeskHome';
import { LinkerApp } from './components/LinkerApp';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { QRHandoffModal } from './components/QRHandoffModal';
import { EditLinkModal } from './components/EditLinkModal';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => getStoredBookmarks());
  const [isLoaded, setIsLoaded] = useState(false);

  const [preferences, setPreferences] = useState<UserPreferences>(() => getStoredPreferences());
  const [isPrefsLoaded, setIsPrefsLoaded] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [qrBookmark, setQrBookmark] = useState<Bookmark | null>(null);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const omnibarInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial bookmarks from JSON file database on mount
  useEffect(() => {
    fetchBookmarksFromJSON().then((data) => {
      setBookmarks(data);
      setIsLoaded(true);
    });

    fetchPreferencesFromJSON().then((prefs) => {
      setPreferences(prefs);
      setIsPrefsLoaded(true);
    });
  }, []);

  // Persist bookmarks whenever changed, strictly guarding against uninitialized overwrites
  useEffect(() => {
    if (isLoaded) {
      saveBookmarks(bookmarks);
    }
  }, [bookmarks, isLoaded]);

  // Persist UI preferences whenever changed
  useEffect(() => {
    if (isPrefsLoaded) {
      savePreferences(preferences);
    }
  }, [preferences, isPrefsLoaded]);

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleIncrementUseCount = (id: string) => {
    setBookmarks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const updatedCount = (b.useCount || 0) + 1;
          return { ...b, useCount: updatedCount };
        }
        return b;
      })
    );
  };

  // Keyboard Shortcuts Listener Engine
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

      // Escape: Dismiss active modal overlay
      if (e.key === 'Escape') {
        if (isCaptureOpen || qrBookmark || editingBookmark) {
          setIsCaptureOpen(false);
          setQrBookmark(null);
          setEditingBookmark(null);
          return;
        }
      }

      // Quick Capture: ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCaptureOpen(true);
        return;
      }

      // Omnibar Focus: '/' slash key when in Linker
      if (e.key === '/' && !isInput && currentView === 'linker') {
        e.preventDefault();
        omnibarInputRef.current?.focus();
        return;
      }

      if (isInput || currentView !== 'linker') return;

      const activeBookmarks = bookmarks.filter((b) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            b.title.toLowerCase().includes(q) ||
            b.url.toLowerCase().includes(q) ||
            b.domain.toLowerCase().includes(q) ||
            b.tags.some((t) => t.toLowerCase().includes(q))
          );
        }
        return true;
      });

      if (activeBookmarks.length === 0) return;

      // J or Down Arrow: Cycle down
      if (e.key.toLowerCase() === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % activeBookmarks.length);
      }

      // K or Up Arrow: Cycle up
      if (e.key.toLowerCase() === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + activeBookmarks.length) % activeBookmarks.length);
      }

      // C: Copy currently selected link clean URL
      if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const selected = activeBookmarks[selectedIndex];
        if (selected) {
          navigator.clipboard.writeText(selected.url);
          handleIncrementUseCount(selected.id);
          showToast(`Copied URL: ${selected.domain}`);
        }
      }

      // S: Toggle Starred status
      if (e.key.toLowerCase() === 's' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const selected = activeBookmarks[selectedIndex];
        if (selected) {
          handleToggleStar(selected.id);
        }
      }

      // Enter: Open focused link in clean tab
      if (e.key === 'Enter') {
        e.preventDefault();
        const selected = activeBookmarks[selectedIndex];
        if (selected) {
          window.open(selected.url, '_blank', 'noopener,noreferrer');
          handleIncrementUseCount(selected.id);
          showToast(`Opened: ${selected.domain}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookmarks, selectedIndex, searchQuery, currentView, isCaptureOpen, qrBookmark, editingBookmark]);

  // Bookmark Mutation Handlers
  const handleAddBookmark = (newBm: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const created: Bookmark = {
      ...newBm,
      id: `bm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      useCount: 0,
    };
    setBookmarks((prev) => [created, ...prev]);
    showToast(`Preserved link: ${created.title}`);
  };

  const handleToggleStar = (id: string) => {
    setBookmarks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const updated = !b.starred;
          showToast(updated ? 'Starred link' : 'Unstarred link');
          return { ...b, starred: updated };
        }
        return b;
      })
    );
  };

  const handleUpdateBookmark = (updated: Bookmark) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
    showToast('Link details updated');
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    showToast('Link removed');
  };

  return (
    <div className="min-h-screen bg-[#000203] text-[#FAFCFE] font-sans flex flex-col antialiased selection:bg-[#D3FF69] selection:text-[#000203]">
      
      {/* App Workspace Navigation Router */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <QuantumDeskHome
                onSelectView={setCurrentView}
                bookmarks={bookmarks}
              />
            </motion.div>
          )}

          {currentView === 'linker' && (
            <motion.div
              key="linker"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <LinkerApp
                bookmarks={bookmarks}
                selectedIndex={selectedIndex}
                onSelectIndex={setSelectedIndex}
                onToggleStar={handleToggleStar}
                onIncrementUseCount={handleIncrementUseCount}
                onDeleteBookmark={handleDeleteBookmark}
                onEditBookmark={(b) => setEditingBookmark(b)}
                onOpenQR={(b) => setQrBookmark(b)}
                onCopyUrl={(url, id) => {
                  navigator.clipboard.writeText(url);
                  if (id) handleIncrementUseCount(id);
                  showToast('Clean URL copied');
                }}
                onOpenCapture={() => setIsCaptureOpen(true)}
                onReturnHome={() => setCurrentView('home')}
                toastMessage={toastMessage}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                omnibarInputRef={omnibarInputRef}
                preferences={preferences}
                onUpdatePreferences={handleUpdatePreferences}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Modals */}
      {(() => {
        const allExistingTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags)));
        return (
          <>
            <QuickCaptureModal
              isOpen={isCaptureOpen}
              onClose={() => setIsCaptureOpen(false)}
              onAddBookmark={handleAddBookmark}
              allExistingTags={allExistingTags}
            />

            <QRHandoffModal
              bookmark={qrBookmark}
              onClose={() => setQrBookmark(null)}
            />

            <EditLinkModal
              isOpen={!!editingBookmark}
              bookmark={editingBookmark}
              onClose={() => setEditingBookmark(null)}
              onSaveBookmark={handleUpdateBookmark}
              allExistingTags={allExistingTags}
            />
          </>
        );
      })()}

    </div>
  );
}

export default App;
