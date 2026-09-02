import { useState, useEffect, useRef } from 'react';
import type { AppView, Bookmark, ReadingStatus } from './types';
import { getStoredBookmarks, saveBookmarks, fetchBookmarksFromJSON } from './utils/storage';
import { QuantumDeskHome } from './components/QuantumDeskHome';
import { LinkerApp } from './components/LinkerApp';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { QRHandoffModal } from './components/QRHandoffModal';
import { ReaderModeModal } from './components/ReaderModeModal';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => getStoredBookmarks());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [qrBookmark, setQrBookmark] = useState<Bookmark | null>(null);
  const [readerBookmark, setReaderBookmark] = useState<Bookmark | null>(null);

  const omnibarInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial bookmarks from JSON file database on mount
  useEffect(() => {
    fetchBookmarksFromJSON().then((data) => {
      if (data && data.length > 0) {
        setBookmarks(data);
      }
    });
  }, []);

  // Persist bookmarks whenever changed (syncs to data/bookmarks.json and localStorage)
  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Keyboard Shortcuts Listener Engine
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

      // Escape: Dismiss active modal overlay
      if (e.key === 'Escape') {
        if (isCaptureOpen || qrBookmark || readerBookmark) {
          setIsCaptureOpen(false);
          setQrBookmark(null);
          setReaderBookmark(null);
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
          showToast(`Opened: ${selected.domain}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookmarks, selectedIndex, searchQuery, currentView, isCaptureOpen, qrBookmark, readerBookmark]);

  // Bookmark Mutation Handlers
  const handleAddBookmark = (newBm: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const created: Bookmark = {
      ...newBm,
      id: `bm-${Date.now()}`,
      createdAt: new Date().toISOString(),
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

  const handleCycleStatus = (id: string) => {
    const nextStatus: Record<ReadingStatus, ReadingStatus> = {
      unread: 'reading',
      reading: 'completed',
      completed: 'unread',
    };

    setBookmarks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const next = nextStatus[b.status];
          showToast(`Status updated: ${next.toUpperCase()}`);
          return { ...b, status: next };
        }
        return b;
      })
    );
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    showToast('Link removed');
  };

  const handleUpdateStatus = (id: string, newStatus: ReadingStatus) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleSaveNotes = (id: string, notes: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, notes } : b))
    );
    showToast('Notes saved');
  };

  const handleUpdateTags = (id: string, tags: string[]) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, tags } : b))
    );
    showToast('Tags updated');
  };

  return (
    <div className="min-h-screen bg-[#000203] text-[#FAFCFE] font-sans flex flex-col antialiased selection:bg-[#D3FF69] selection:text-[#000203]">
      
      {/* App Workspace Navigation Router */}
      <div className="flex-1">
        {currentView === 'home' && (
          <QuantumDeskHome
            onSelectView={setCurrentView}
            bookmarks={bookmarks}
          />
        )}

        {currentView === 'linker' && (
          <LinkerApp
            bookmarks={bookmarks}
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
            onToggleStar={handleToggleStar}
            onCycleStatus={handleCycleStatus}
            onDeleteBookmark={handleDeleteBookmark}
            onOpenReader={(b) => setReaderBookmark(b)}
            onOpenQR={(b) => setQrBookmark(b)}
            onCopyUrl={(url) => {
              navigator.clipboard.writeText(url);
              showToast('Clean URL copied');
            }}
            onOpenCapture={() => setIsCaptureOpen(true)}
            onReturnHome={() => setCurrentView('home')}
            toastMessage={toastMessage}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            omnibarInputRef={omnibarInputRef}
          />
        )}
      </div>

      {/* Global Modals */}
      <QuickCaptureModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onAddBookmark={handleAddBookmark}
      />

      <QRHandoffModal
        bookmark={qrBookmark}
        onClose={() => setQrBookmark(null)}
      />

      <ReaderModeModal
        bookmark={readerBookmark}
        onClose={() => setReaderBookmark(null)}
        onUpdateStatus={handleUpdateStatus}
        onSaveNotes={handleSaveNotes}
        onUpdateTags={handleUpdateTags}
      />

    </div>
  );
}

export default App;
