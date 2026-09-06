import React from 'react';
import type { AppView, Bookmark } from '../types';
import { ArrowUpRight, BookmarkCheck, Terminal, Zap, SlidersHorizontal, BarChart3 } from 'lucide-react';
import { FbmNoise } from './background/FbmNoise';

interface QuantumDeskHomeProps {
  onSelectView: (view: AppView) => void;
  bookmarks: Bookmark[];
}

export const QuantumDeskHome: React.FC<QuantumDeskHomeProps> = ({
  onSelectView,
}) => {
  return (
    <div className="relative min-h-screen w-full bg-[#000203] text-[#FAFCFE] overflow-y-auto flex flex-col justify-between p-6 md:p-12 select-none">

      {/* Dynamic FBM Vector Shader Background Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <FbmNoise
          complex={false}
          paused={false}
          scale={5}
          speed={0.1}
          mouseInfluence={0}
          brightness={1}
          seed={43798}
          colorR={1}
          colorG={0}
          colorB={1}
          className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
        />
      </div>

      {/* Main Brand Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full pt-6 text-center flex flex-col items-center">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="font-caption font-extrabold text-3xl md:text-5xl text-[#FAFCFE] tracking-tight uppercase">
            QUANTUM DESK
          </h1>
        </div>
      </header>

      {/* Main Suite Launcher Grid */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">

          {/* Hero Feature Card: Linker Studio */}
          <div
            onClick={() => onSelectView('linker')}
            role="button"
            tabIndex={0}
            className="md:col-span-8 group relative macos-card p-8 md:p-9 shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.1"
          >
            <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-6">
              <div className="space-y-4 max-w-md">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D3FF69]/15 border border-[#D3FF69]/30 text-[#D3FF69] font-mono text-xs font-bold uppercase tracking-wider">
                  <BookmarkCheck className="w-4 h-4" />
                  Application Active
                </div>

                <h2 className="font-caption font-bold text-3xl md:text-4xl text-[#FAFCFE] tracking-tight group-hover:text-[#D3FF69] transition-colors">
                  LINKER STUDIO
                </h2>

                {/* Feature Chips with crisp SVG icons */}
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  <span className="text-[11px] font-mono font-semibold px-3 py-1.5 rounded-full bg-[#141618] border border-white/10 text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#D3FF69]" /> Vim Keys (J / K / C / S)
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-3 py-1.5 rounded-full bg-[#141618] border border-white/10 text-slate-200 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#97C8EC]" /> Grid & Domain Rows
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-3 py-1.5 rounded-full bg-[#141618] border border-white/10 text-[#D3FF69] flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-[#D3FF69]" /> Usage Analytics
                  </span>
                </div>
              </div>

              {/* Enlarged Prominent Logo Badge */}
              <div className="w-50 h-50 md:w-40 md:h-40 rounded-3xl flex items-center justify-center p-5 shrink-0 transition-all duration-300">
                <img
                  src="/logos/linker.png"
                  alt="Linker Studio Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-transform duration-300"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 flex items-center justify-between gap-4 border-t border-white/10">
              <div className="text-xs font-mono text-[#8A8F98]">
                <span>Status: </span>
                <strong className="text-[#53FFA9]">Operational v2.0</strong>
              </div>

              <div className="flex items-center gap-3 px-6 py-3 bg-[#D3FF69] text-[#000203] font-caption font-bold text-sm rounded-full shadow-xl group-hover:scale-105 transition-all">
                <span>Launch Linker Studio</span>
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Secondary Disabled Card: Commands App (Coming Soon) */}
          <div
            className="md:col-span-4 relative macos-card p-8 shadow-xl flex flex-col justify-between opacity-60 cursor-not-allowed select-none border border-white/5"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#9A99FE]/10 border border-[#9A99FE]/20 text-[#9A99FE]">
                  COMING SOON
                </span>
                <Terminal className="w-5 h-5 text-[#9A99FE]/60" />
              </div>

              <div className="w-20 h-20 bg-[#000203]/50 border border-white/5 rounded-2xl flex items-center justify-center p-4 mb-5">
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

            <div className="mt-8 pt-4 flex items-center justify-between text-xs font-mono text-[#8A8F98]/70 border-t border-white/5">
              <span>Under Development</span>
              <span className="px-3 py-1 rounded-full bg-[#242529]/50 text-[10px]">
                v2.0 Pipeline
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* Sleek Minimal Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full text-center pb-4 text-xs font-mono text-[#8A8F98]/60">
        Quantum Desk Studio &copy; {new Date().getFullYear()} — Executive Digital Preservation
      </footer>

    </div>
  );
};
