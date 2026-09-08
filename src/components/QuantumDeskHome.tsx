import React from 'react';
import { motion } from 'framer-motion';
import type { AppView, Bookmark } from '../types';
import { ArrowUpRight, BookmarkCheck, Terminal, Zap, SlidersHorizontal, BarChart3 } from 'lucide-react';
import { FbmNoise } from './background/FbmNoise';

interface QuantumDeskHomeProps {
  onSelectView: (view: AppView) => void;
  bookmarks: Bookmark[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export const QuantumDeskHome: React.FC<QuantumDeskHomeProps> = ({
  onSelectView,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen w-full bg-[#000203] text-[#FAFCFE] overflow-y-auto flex flex-col justify-between p-6 md:p-12 select-none"
    >

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
      <motion.header variants={itemVariants} className="relative z-10 max-w-5xl mx-auto w-full pt-6 text-center flex flex-col items-center">
        <div className="flex items-center gap-3 mb-3">
          <motion.h1
            initial={{ letterSpacing: '0.06em', opacity: 0, y: -12 }}
            animate={{ letterSpacing: '0.12em', opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-caption font-extrabold text-3xl md:text-5xl text-[#FAFCFE] tracking-tight uppercase bg-gradient-to-r from-white via-[#FAFCFE] to-[#D3FF69] bg-clip-text text-transparent"
          >
            QUANTUM DESK
          </motion.h1>
        </div>
      </motion.header>

      {/* Main Suite Launcher Grid */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">

          {/* Hero Feature Card: Linker Studio */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.008, boxShadow: '0 20px 40px -15px rgba(211, 255, 105, 0.12)' }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            onClick={() => onSelectView('linker')}
            role="button"
            tabIndex={0}
            className="md:col-span-8 group relative macos-card p-8 md:p-9 shadow-2xl cursor-pointer flex flex-col justify-between border border-white/10 hover:border-[#D3FF69]/40 transition-colors"
          >
            <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-6">
              <div className="space-y-4 max-w-md">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D3FF69]/15 border border-[#D3FF69]/30 text-[#D3FF69] font-mono text-xs font-bold uppercase tracking-wider"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  Application Active
                </motion.div>

                <h2 className="font-caption font-bold text-3xl md:text-4xl text-[#FAFCFE] tracking-tight group-hover:text-[#D3FF69] transition-colors">
                  LINKER STUDIO
                </h2>

                {/* Feature Chips with crisp SVG icons */}
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  <motion.span
                    whileHover={{ scale: 1.03, y: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="text-[11px] font-mono font-semibold px-3 py-1.5 rounded-full bg-[#141618] border border-white/10 text-slate-200 flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#D3FF69]" /> Vim Keys (J / K / C / S)
                  </motion.span>
                  <motion.span
                    whileHover={{ scale: 1.03, y: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="text-[11px] font-mono font-semibold px-3 py-1.5 rounded-full bg-[#141618] border border-white/10 text-slate-200 flex items-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#97C8EC]" /> Grid & Domain Rows
                  </motion.span>
                  <motion.span
                    whileHover={{ scale: 1.03, y: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="text-[11px] font-mono font-semibold px-3 py-1.5 rounded-full bg-[#141618] border border-white/10 text-[#D3FF69] flex items-center gap-1.5"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-[#D3FF69]" /> Usage Analytics
                  </motion.span>
                </div>
              </div>

              {/* Logo Badge with Subtle Hover */}
              <motion.div
                whileHover={{ rotate: 3, scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="w-50 h-50 md:w-40 md:h-40 rounded-3xl flex items-center justify-center p-5 shrink-0"
              >
                <img
                  src="/logos/linker.png"
                  alt="Linker Studio Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(211,255,105,0.2)]"
                />
              </motion.div>
            </div>

            <div className="mt-8 pt-6 flex items-center justify-between gap-4 border-t border-white/10">
              <div className="text-xs font-mono text-[#8A8F98]">
                <span>Status: </span>
                <strong className="text-[#53FFA9]">Operational v2.0</strong>
              </div>

              <motion.div
                whileHover={{ scale: 1.03, backgroundColor: '#e2ff88' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="flex items-center gap-3 px-6 py-3 bg-[#D3FF69] text-[#000203] font-caption font-bold text-sm rounded-full shadow-xl"
              >
                <span>Launch Linker Studio</span>
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </motion.div>
            </div>
          </motion.div>

          {/* Active Commands App Feature Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 40px -15px rgba(154, 153, 254, 0.2)' }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            onClick={() => onSelectView('commands')}
            role="button"
            tabIndex={0}
            className="md:col-span-4 group relative macos-card p-8 shadow-2xl cursor-pointer flex flex-col justify-between border border-white/10 hover:border-[#9A99FE]/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#9A99FE]/15 border border-[#9A99FE]/30 text-[#9A99FE]">
                  APPLICATION ACTIVE v2.0
                </span>
                <Terminal className="w-5 h-5 text-[#9A99FE]" />
              </div>

              <div className="w-20 h-20 bg-[#000203]/50 border border-white/10 rounded-2xl flex items-center justify-center p-4 mb-5 group-hover:border-[#9A99FE]/30 transition-colors">
                <img
                  src="/logos/commands.png"
                  alt="Commands Engine Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(154,153,254,0.2)]"
                />
              </div>

              <h3 className="font-caption font-bold text-xl text-[#FAFCFE] group-hover:text-[#9A99FE] transition-colors mb-2">
                COMMANDS ENGINE
              </h3>

              <p className="text-xs text-[#8A8F98] font-sans leading-relaxed">
                Terminal command vault, dynamic variable runner, target directory direct execution, & shell history importer.
              </p>
            </div>

            <div className="mt-8 pt-4 flex items-center justify-between border-t border-white/10">
              <span className="text-xs font-mono text-[#53FFA9]">Operational</span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#9A99FE] text-[#000203] font-caption font-bold text-xs rounded-full shadow-lg"
              >
                <span>Launch Vault</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Sleek Minimal Footer */}
      <motion.footer variants={itemVariants} className="relative z-10 max-w-5xl mx-auto w-full text-center pb-4 text-xs font-mono text-[#8A8F98]/60">
        Quantum Desk Studio &copy; {new Date().getFullYear()} — Executive Digital Preservation
      </motion.footer>

    </motion.div>
  );
};
