import React from 'react';
import type { AppView } from '../types';
import { 
  Command, 
  Plus, 
  Search, 
  Sparkles, 
  BookmarkCheck, 
  Terminal,
  Grid
} from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenCapture: () => void;
  onFocusSearch: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  omnibarInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onOpenCapture,
  searchQuery,
  onSearchChange,
  omnibarInputRef,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full qd-glass px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        {/* Left: Brand Identity & View Switcher */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onSelectView('home')}
            className="flex items-center gap-3 group text-left focus:outline-none rounded-xl p-1 -ml-1 transition-all"
          >
            <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-qd-linker via-qd-linkage to-qd-commands p-[1px] shadow-lg shadow-qd-linker/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-qd-surface rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-qd-linker" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-caption font-bold text-base tracking-tight text-qd-text group-hover:text-qd-linker transition-colors">
                  QUANTUM DESK
                </span>
                <span className="text-[10px] font-caption uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#242529] text-qd-ice font-bold">
                  SUITE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Digital Preservation & Knowledge Graph
              </p>
            </div>
          </button>

          {/* Navigation Apps Switcher Pills */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#242529] p-1.5 rounded-full">
            <button
              onClick={() => onSelectView('home')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-caption font-semibold transition-all ${
                currentView === 'home'
                  ? 'bg-[#181A1C] text-[#FAFCFE] shadow'
                  : 'text-[#8A8F98] hover:text-[#FAFCFE]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Launcher</span>
            </button>

            <button
              onClick={() => onSelectView('linker')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-caption font-semibold transition-all ${
                currentView === 'linker'
                  ? 'bg-[#D3FF69]/15 text-[#D3FF69] shadow-sm'
                  : 'text-[#8A8F98] hover:text-[#FAFCFE]'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Linker</span>
            </button>

            {/* Non-Clickable Commands Tab */}
            <div
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-caption font-semibold text-[#8A8F98]/50 bg-[#181A1C]/50 cursor-not-allowed select-none"
              title="Commands Engine (Coming Soon)"
            >
              <Terminal className="w-3.5 h-3.5 opacity-50" />
              <span>Commands</span>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#9A99FE]/10 text-[#9A99FE]/60">
                SOON
              </span>
            </div>
          </nav>
        </div>

        {/* Center: Omnibar Search Field */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-qd-muted pointer-events-none" />
            <input
              ref={omnibarInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search bookmarks, tags, collections or press '/'..."
              className="w-full bg-[#242529] text-qd-text placeholder:text-qd-muted rounded-full pl-9 pr-12 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-qd-sky/30 transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-qd-muted bg-[#181A1C] rounded-md">
                /
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCapture}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-qd-linker via-qd-lime to-qd-linkage text-qd-bg font-caption font-bold text-xs rounded-full shadow-lg shadow-qd-linker/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Quick Capture</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-black/20 text-black rounded-full">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>
        </div>

      </div>
    </header>
  );
};
