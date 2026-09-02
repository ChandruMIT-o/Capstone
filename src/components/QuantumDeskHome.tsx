import React from 'react';
import type { AppView, Bookmark } from '../types';
import { ArrowUpRight, Sparkles, Layers, Clock, Star, BookmarkCheck, Terminal } from 'lucide-react';

interface QuantumDeskHomeProps {
  onSelectView: (view: AppView) => void;
  bookmarks: Bookmark[];
}

export const QuantumDeskHome: React.FC<QuantumDeskHomeProps> = ({
  onSelectView,
  bookmarks,
}) => {
  const totalCount = bookmarks.length;
  const inQueueCount = bookmarks.filter((b) => b.status === 'unread' || b.status === 'reading').length;
  const starredCount = bookmarks.filter((b) => b.starred).length;

  return (
    <div className="relative min-h-screen w-full bg-[#000203] text-[#FAFCFE] overflow-y-auto flex flex-col justify-between p-6 md:p-12 select-none">
      
      {/* Background wallpaper matching bg_home.png */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/bg/bg_home.png"
          alt="Quantum Desk Wallpaper"
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000203] via-[#000203]/40 to-transparent" />
      </div>

      {/* Main Brand Header */}
      <div className="relative z-10 max-w-5xl mx-auto w-full pt-4 text-center flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#181A1C] flex items-center justify-center text-[#D3FF69] shadow-2xl">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="font-caption font-bold text-4xl md:text-5xl text-[#FAFCFE] tracking-tight uppercase">
            QUANTUM DESK
          </h1>
        </div>
        <p className="text-slate-300 font-sans font-medium text-sm md:text-base max-w-xl text-center leading-relaxed backdrop-blur-md bg-[#181A1C]/80 px-6 py-2.5 rounded-full shadow-lg">
          Executive digital preservation suite & link management studio.
        </p>
      </div>

      {/* Main Suite Launcher Grid */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Hero Feature Card: Linker Studio */}
          <div 
            onClick={() => onSelectView('linker')}
            role="button"
            tabIndex={0}
            className="md:col-span-8 group relative bg-[#181A1C] hover:bg-[#242529] rounded-[28px] p-8 shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
          >
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="space-y-3.5 max-w-md">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D3FF69]/15 text-[#D3FF69] font-mono text-xs font-bold uppercase tracking-wider">
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  Primary Application
                </div>

                <h2 className="font-caption font-bold text-3xl text-[#FAFCFE] tracking-tight group-hover:text-[#D3FF69] transition-colors">
                  LINKER STUDIO
                </h2>

                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  Preserve developer links, research articles, and documentation. Features distraction-free Reader View, Vim navigation, QR mobile handoffs, and progressive disclosure cards.
                </p>

                {/* Feature Chips */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-[#242529] text-slate-300">
                    ⚡ Vim Keys (J / K / C / S)
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-[#242529] text-slate-300">
                    🎛️ Grid & List Layouts
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-[#242529] text-slate-300">
                    📖 Distraction-Free Reader
                  </span>
                </div>
              </div>

              {/* Logo Badge */}
              <div className="w-24 h-24 bg-[#000203]/70 rounded-2xl flex items-center justify-center p-4 shrink-0 shadow-inner">
                <img 
                  src="/logos/linker.png" 
                  alt="Linker Logo" 
                  className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            
            <div className="mt-6 pt-4 flex items-center justify-between gap-4">
              <div className="text-xs font-mono text-[#8A8F98]">
                <span>Status: </span>
                <strong className="text-[#53FFA9]">100% Operational</strong>
              </div>

              <div className="flex items-center gap-3 px-6 py-3 bg-[#D3FF69] text-[#000203] font-caption font-bold text-sm rounded-full shadow-lg group-hover:scale-105 transition-transform">
                <span>Launch Linker Studio</span>
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Secondary Disabled Card: Commands App (Coming Soon) */}
          <div 
            className="md:col-span-4 relative bg-[#181A1C]/50 rounded-[28px] p-8 shadow-xl flex flex-col justify-between opacity-60 cursor-not-allowed select-none"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#9A99FE]/10 text-[#9A99FE]">
                  COMING SOON
                </span>
                <Terminal className="w-5 h-5 text-[#9A99FE]/60" />
              </div>

              <div className="w-16 h-16 bg-[#000203]/40 rounded-2xl flex items-center justify-center p-3 mb-4">
                <img 
                  src="/logos/commands.png" 
                  alt="Commands Logo" 
                  className="w-full h-full object-contain opacity-50 grayscale"
                />
              </div>

              <h3 className="font-caption font-bold text-xl text-[#FAFCFE]/80 mb-2">
                COMMANDS ENGINE
              </h3>

              <p className="text-xs text-[#8A8F98] font-sans leading-relaxed">
                Developer macro runner, automated bulk exports, and CLI task orchestration terminal.
              </p>
            </div>
            
            <div className="mt-6 pt-4 flex items-center justify-between text-xs font-mono text-[#8A8F98]/70">
              <span>Under Development</span>
              <span className="px-3 py-1 rounded-full bg-[#242529]/50 text-[10px]">
                v2.0 Pipeline
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Metrics Bar */}
      <div className="relative z-10 max-w-5xl mx-auto w-full pb-4">
        <div className="bg-[#181A1C] rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center shadow-xl">
          
          <div className="p-3 bg-[#242529]/40 rounded-xl">
            <div className="flex items-center justify-center gap-2 text-[#D3FF69] mb-1">
              <Layers className="w-5 h-5" />
              <span className="font-caption font-bold text-2xl">{totalCount}</span>
            </div>
            <span className="text-xs font-caption text-[#8A8F98] font-bold uppercase tracking-wider">Links Preserved</span>
          </div>

          <div className="p-3 bg-[#242529]/40 rounded-xl">
            <div className="flex items-center justify-center gap-2 text-[#97C8EC] mb-1">
              <Clock className="w-5 h-5" />
              <span className="font-caption font-bold text-2xl">{inQueueCount}</span>
            </div>
            <span className="text-xs font-caption text-[#8A8F98] font-bold uppercase tracking-wider">In Reading Queue</span>
          </div>

          <div className="p-3 bg-[#242529]/40 rounded-xl">
            <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
              <Star className="w-5 h-5 fill-amber-400" />
              <span className="font-caption font-bold text-2xl">{starredCount}</span>
            </div>
            <span className="text-xs font-caption text-[#8A8F98] font-bold uppercase tracking-wider">Starred Links</span>
          </div>

        </div>
      </div>

    </div>
  );
};
