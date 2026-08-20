import { useState, useEffect } from 'react';
import { ArchitectureHeader } from './architecture/ArchitectureHeader';
import { ApplicationArchitectureView } from './architecture/ApplicationArchitectureView';
import { UserFlowArchitectureView } from './architecture/UserFlowArchitectureView';

type TabType = 'application' | 'user-flow';

export default function App2() {
  // Determine initial tab from pathname or hash
  const getInitialTab = (): TabType => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path.includes('user-flow') || hash.includes('user-flow')) {
      return 'user-flow';
    }
    return 'application';
  };

  const [currentTab, setCurrentTab] = useState<TabType>(getInitialTab);
  const [screenshotMode, setScreenshotMode] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Sync route changes with URL (both pushState and hash for maximum compatibility)
  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    const newPath = `/${tab}`;
    const newHash = `#/${tab}`;
    
    // Update hash for static and dev routing
    window.location.hash = tab;

    try {
      window.history.pushState({ tab }, '', newPath);
    } catch {
      // Fallback for strict browser origins
      window.location.hash = newHash;
    }
  };

  // Listen to browser forward/back buttons & hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('user-flow') || hash.includes('user-flow')) {
        setCurrentTab('user-flow');
      } else {
        setCurrentTab('application');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Keyboard shortcut: Escape toggles / exits screenshot mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setScreenshotMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-100 text-slate-800 overflow-hidden font-sans select-none">
      {/* Top Architecture Header Navigation Bar (Hidden in Screenshot Mode without any overlay) */}
      <ArchitectureHeader
        currentTab={currentTab}
        onTabChange={handleTabChange}
        screenshotMode={screenshotMode}
        onToggleScreenshotMode={() => setScreenshotMode(prev => !prev)}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
      />

      {/* Main Diagram Canvas Area (Fits precisely within desktop view with zero empty space) */}
      <main className="flex-1 w-full h-full p-2 flex items-stretch justify-stretch overflow-hidden">
        <div 
          className="w-full h-full flex flex-col justify-between transition-transform duration-200 origin-top"
          style={{ transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined }}
        >
          {currentTab === 'application' ? (
            <ApplicationArchitectureView />
          ) : (
            <UserFlowArchitectureView />
          )}
        </div>
      </main>
    </div>
  );
}
