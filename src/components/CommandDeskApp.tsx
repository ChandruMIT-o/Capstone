import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CommandItem } from '../types';
import {
  Terminal,
  Search,
  Plus,
  Star,
  Copy,
  Play,
  Grid,
  List,
  Tag,
  Folder,
  ArrowUpDown,
  Check,
  MoreVertical,
  Edit3,
  Trash2,
  Import,
  Code,
  TrendingUp,
  Cpu,
  Sparkles,
  Filter,
  X
} from 'lucide-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { CreateCommandModal } from './CreateCommandModal';
import { TerminalHistoryImporterModal } from './TerminalHistoryImporterModal';
import { ShellHooksModal } from './ShellHooksModal';

import { copyToClipboard } from '../utils/commandStorage';

interface CommandDeskAppProps {
  commands: CommandItem[];
  onAddCommand: (cmdData: Partial<CommandItem>) => void;
  onUpdateCommand: (cmd: CommandItem) => void;
  onDeleteCommand: (id: string) => void;
  onToggleStar: (id: string) => void;
  onIncrementUseCount: (id: string) => void;
  onReturnHome: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

export const CommandDeskApp: React.FC<CommandDeskAppProps> = ({
  commands,
  onAddCommand,
  onUpdateCommand,
  onDeleteCommand,
  onToggleStar,
  onIncrementUseCount,
  onReturnHome,
  toastMessage,
  showToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [sortMode, setSortMode] = useState<'az' | 'za' | 'opens' | 'newest'>('opens');

  // Interactive Variable State per Command: Map<commandId, Record<varName, value>>
  const [varValues, setVarValues] = useState<Record<string, Record<string, string>>>({});

  // Target CWD Overrides per Command: Map<commandId, customCwd>
  const [customCwds, setCustomCwds] = useState<Record<string, string>>({});

  // Track copied button feedback per command
  const [copiedCmdId, setCopiedCmdId] = useState<string | null>(null);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCommand, setEditingCommand] = useState<CommandItem | null>(null);
  const [deletingCommand, setDeletingCommand] = useState<CommandItem | null>(null);
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [isHooksOpen, setIsHooksOpen] = useState(false);

  // Simulated Terminal Drawer Execution State
  const [simulatedExecution, setSimulatedExecution] = useState<{
    commandTitle: string;
    fullCommand: string;
    cwd?: string;
    logs: string[];
  } | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const categoriesList: { name: string; id: string; color: string }[] = [
    { name: 'All Commands', id: 'all', color: '#9A99FE' },
    { name: 'Git', id: 'Git', color: '#10b981' },
    { name: 'Docker', id: 'Docker', color: '#0ea5e9' },
    { name: 'Node / npm', id: 'Node/npm', color: '#84cc16' },
    { name: 'System', id: 'System', color: '#f43f5e' },
    { name: 'Database', id: 'Database', color: '#f59e0b' },
    { name: 'Kubernetes', id: 'Kubernetes', color: '#8b5cf6' },
    { name: 'Custom', id: 'Custom', color: '#d946ef' },
  ];

  // Tag Statistics
  const tagStats = useMemo(() => {
    const map = new Map<string, number>();
    commands.forEach((c) => {
      c.tags.forEach((t) => {
        map.set(t, (map.get(t) || 0) + 1);
      });
    });
    return Array.from(map.entries()).map(([tag, count]) => ({ tag, count }));
  }, [commands]);

  // Filtered & Sorted Commands
  const filteredCommands = useMemo(() => {
    return commands.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          c.title.toLowerCase().includes(q) ||
          c.command.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)) ||
          c.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (activeCategory === 'starred' && !c.starred) return false;
      if (activeCategory !== 'all' && activeCategory !== 'starred' && c.category !== activeCategory) {
        return false;
      }

      if (selectedTag && !c.tags.includes(selectedTag)) return false;

      return true;
    });
  }, [commands, searchQuery, activeCategory, selectedTag]);

  const sortedCommands = useMemo(() => {
    const list = [...filteredCommands];
    return list.sort((a, b) => {
      if (sortMode === 'az') return a.title.localeCompare(b.title);
      if (sortMode === 'za') return b.title.localeCompare(a.title);
      if (sortMode === 'opens') return (b.useCount || 0) - (a.useCount || 0);
      if (sortMode === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [filteredCommands, sortMode]);

  // Helper to generate processed command string with filled variables & CWD prefix
  const getProcessedCommand = (item: CommandItem) => {
    let result = item.command;
    const currentVars = varValues[item.id] || {};

    if (item.variables && item.variables.length > 0) {
      item.variables.forEach((v) => {
        const val = currentVars[v] !== undefined && currentVars[v] !== '' ? currentVars[v] : `{{${v}}}`;
        result = result.split(`{{${v}}}`).join(val);
      });
    }

    const effectiveCwd = customCwds[item.id] !== undefined ? customCwds[item.id] : item.defaultCwd;
    if (effectiveCwd && effectiveCwd.trim()) {
      result = `cd "${effectiveCwd.trim()}" && ${result}`;
    }

    return result;
  };

  const handleVariableChange = (commandId: string, varName: string, value: string) => {
    setVarValues((prev) => ({
      ...prev,
      [commandId]: {
        ...(prev[commandId] || {}),
        [varName]: value,
      },
    }));
  };

  const handleCopyCommand = async (item: CommandItem) => {
    const finalCmd = getProcessedCommand(item);
    await copyToClipboard(finalCmd);
    onIncrementUseCount(item.id);
    setCopiedCmdId(item.id);
    setTimeout(() => setCopiedCmdId(null), 2000);
    showToast(`Copied command: ${item.title}`);
  };

  const handleSimulateRun = (item: CommandItem) => {
    const finalCmd = getProcessedCommand(item);
    onIncrementUseCount(item.id);

    const effectiveCwd = customCwds[item.id] !== undefined ? customCwds[item.id] : item.defaultCwd;

    const mockLogs = [
      `Initializing shell sub-process (${item.shellType})...`,
      effectiveCwd ? `Changed directory to: ${effectiveCwd}` : `Executing in current directory`,
      `$ ${finalCmd}`,
      `[stdout] Running process tasks...`,
      `[stdout] Operation completed successfully with exit code 0.`,
    ];

    setSimulatedExecution({
      commandTitle: item.title,
      fullCommand: finalCmd,
      cwd: effectiveCwd,
      logs: mockLogs,
    });
  };

  return (
    <div className="flex h-screen w-full bg-[#000203] text-[#FAFCFE] overflow-hidden select-none font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-[#9A99FE] text-[#000203] font-caption font-bold text-sm rounded-full shadow-2xl flex items-center gap-2.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Sidebar */}
      <aside className="w-72 lg:w-80 bg-[#141618] border-r border-white/5 flex flex-col justify-between p-6 shrink-0">
        
        <div className="space-y-6">
          
          {/* Header Brand */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: -12, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-10 h-10 rounded-2xl bg-[#9A99FE]/15 border border-[#9A99FE]/30 flex items-center justify-center text-[#9A99FE] shrink-0"
              >
                <Terminal className="w-5 h-5" />
              </motion.div>
              <div>
                <h1 className="font-caption font-bold text-lg text-[#FAFCFE] tracking-tight">
                  Commands Engine
                </h1>
                <p className="text-xs text-[#8A8F98] font-medium">Terminal Vault v2.0</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#373B3E' }}
              whileTap={{ scale: 0.9 }}
              onClick={onReturnHome}
              title="Return to App Suite Launcher"
              className="p-2 rounded-xl bg-[#242529] text-slate-300 hover:text-[#9A99FE] transition-colors"
            >
              <Grid className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Omnibar Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8A8F98] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commands or tags..."
              className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-full pl-10 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9A99FE]/40 transition-all border border-white/5"
            />
          </div>

          {/* Categories Navigation */}
          <div className="space-y-1.5 pt-1">
            <span className="px-2 font-caption font-bold text-xs uppercase tracking-wider text-[#8A8F98]">
              Vault Categories
            </span>

            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat.id && !selectedTag;
              const count =
                cat.id === 'all'
                  ? commands.length
                  : commands.filter((c) => c.category === cat.id).length;

              return (
                <motion.button
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSelectedTag(null);
                  }}
                  className={`relative w-full flex items-center justify-between px-4 py-2 rounded-full text-xs font-caption font-semibold transition-colors ${
                    isActive ? 'text-[#FAFCFE]' : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCmdCategoryPill"
                      className="absolute inset-0 bg-[#242529] rounded-full border border-white/10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.name}</span>
                  </div>
                  <span className="relative z-10 font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#000203] text-[#9A99FE]">
                    {count}
                  </span>
                </motion.button>
              );
            })}

            {/* Starred View Button */}
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveCategory('starred');
                setSelectedTag(null);
              }}
              className={`relative w-full flex items-center justify-between px-4 py-2 rounded-full text-xs font-caption font-semibold transition-colors ${
                activeCategory === 'starred' ? 'text-amber-300' : 'text-[#8A8F98] hover:text-[#FAFCFE]'
              }`}
            >
              {activeCategory === 'starred' && (
                <motion.div
                  layoutId="activeCmdCategoryPill"
                  className="absolute inset-0 bg-amber-500/10 border border-amber-500/20 rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                <span>Starred Commands</span>
              </div>
              <span className="relative z-10 font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#000203] text-amber-300">
                {commands.filter((c) => c.starred).length}
              </span>
            </motion.button>
          </div>

          {/* Tags Cloud */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between px-2">
              <span className="font-caption font-bold text-xs uppercase tracking-wider text-[#8A8F98] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#9A99FE]" /> Tags
              </span>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-xs text-[#9A99FE] hover:underline font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap px-1">
              {tagStats.slice(0, 8).map((s) => (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  key={s.tag}
                  onClick={() => setSelectedTag(selectedTag === s.tag ? null : s.tag)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-caption font-semibold transition-colors ${
                    selectedTag === s.tag
                      ? 'bg-[#9A99FE] text-[#000203] font-bold shadow-sm'
                      : 'bg-[#242529] text-slate-300 hover:bg-[#373B3E] border border-white/5'
                  }`}
                >
                  #{s.tag}
                </motion.button>
              ))}
            </div>
          </div>

        </div>

        {/* Quick Shell Integration Button */}
        <div className="p-4 bg-[#242529]/70 backdrop-blur-md rounded-2xl border border-white/5 space-y-2">
          <span className="font-caption font-bold text-xs text-[#FAFCFE] flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#9A99FE]" /> Terminal Integration
          </span>
          <p className="text-[11px] text-[#8A8F98] leading-tight">
            Connect VS Code terminal or Mac shell history to stream & save commands automatically.
          </p>
          <button
            onClick={() => setIsHooksOpen(true)}
            className="w-full mt-1 py-1.5 rounded-xl bg-[#9A99FE]/15 hover:bg-[#9A99FE]/25 text-[#9A99FE] border border-[#9A99FE]/30 font-caption font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5" /> View Shell Hooks
          </button>
        </div>

      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#000203]">
        
        {/* Header Bar */}
        <header className="px-8 py-4 flex items-center justify-between shrink-0 bg-[#141618] border-b border-white/5">
          <div className="flex items-center gap-3">
            <h2 className="font-caption font-bold text-xl text-[#FAFCFE] tracking-tight">
              {selectedTag ? `Tag: #${selectedTag}` : `${activeCategory.toUpperCase()} VAULT`}
            </h2>
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-[#242529] text-[#9A99FE] border border-white/5">
              {filteredCommands.length} commands ready
            </span>
          </div>

          {/* Top Actions: Importer, Hooks, New Command */}
          <div className="flex items-center gap-3">
            
            {/* Importer Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsImporterOpen(true)}
              title="Import terminal history text logs"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#242529] hover:bg-[#373B3E] text-[#9A99FE] border border-[#9A99FE]/30 font-caption font-bold text-xs rounded-full transition-colors"
            >
              <Import className="w-3.5 h-3.5" />
              <span>Import History</span>
            </motion.button>

            {/* Layout Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#242529] p-1 rounded-full border border-white/10 relative">
              {[
                { id: 'grid', label: 'Grid View', icon: Grid },
                { id: 'list', label: 'List View', icon: List },
              ].map((item) => {
                const isActive = layoutMode === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setLayoutMode(item.id as any)}
                    title={item.label}
                    className={`relative p-2 rounded-full transition-colors z-10 ${
                      isActive ? 'text-[#9A99FE]' : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCmdLayoutPill"
                        className="absolute inset-0 bg-[#141618] rounded-full border border-white/10 shadow-sm"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10"><IconComponent className="w-4 h-4" /></span>
                  </button>
                );
              })}
            </div>

            {/* New Command Button */}
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: '#b0afff' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setEditingCommand(null);
                setIsCreateOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#9A99FE] text-[#000203] font-caption font-bold text-xs rounded-full shadow-lg transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Preserve Command</span>
            </motion.button>

          </div>
        </header>

        {/* Toolbar Sorting Control */}
        <div className="px-8 py-2.5 bg-[#181A1C]/90 border-b border-white/5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-[#8A8F98] font-caption font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#9A99FE]" />
            <span>Sort Items ({filteredCommands.length} total)</span>
          </div>

          <div className="flex items-center gap-1 bg-[#242529] p-1 rounded-full border border-white/10 font-caption font-semibold relative">
            {[
              { id: 'opens', label: 'Most Used' },
              { id: 'az', label: 'A → Z' },
              { id: 'za', label: 'Z → A' },
              { id: 'newest', label: 'Newest Saved' },
            ].map((option) => {
              const isActive = sortMode === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSortMode(option.id as any)}
                  className={`relative px-3 py-1 rounded-full text-xs transition-colors z-10 ${
                    isActive ? 'text-[#000203] font-bold' : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCmdSortPill"
                      className="absolute inset-0 bg-[#9A99FE] rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Commands List Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {filteredCommands.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="macos-card p-16 text-center space-y-4 max-w-lg mx-auto my-12"
              >
                <Filter className="w-12 h-12 text-[#8A8F98] mx-auto" />
                <h3 className="font-caption font-bold text-lg text-[#FAFCFE]">No commands preserved</h3>
                <p className="text-sm text-[#8A8F98] leading-relaxed">
                  No items match the active category query. Click Preserve Command to store a new shell macro or import history logs.
                </p>
              </motion.div>
            ) : layoutMode === 'grid' ? (
              /* Grid Layout */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto"
              >
                <AnimatePresence mode="popLayout">
                  {sortedCommands.map((item) => {
                    const useCount = item.useCount || 0;
                    const isMenuOpen = openMenuId === item.id;
                    const processedCmd = getProcessedCommand(item);

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
                        key={item.id}
                        className="macos-card p-5.5 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 border border-[#9A99FE]/25 hover:border-[#9A99FE]/60 hover:shadow-[0_8px_30px_rgba(154,153,254,0.18)]"
                      >
                        {/* Top Animated Accent Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9A99FE] via-[#D3FF69] to-[#9A99FE] animated-accent-gradient" />

                        <div className="space-y-3 pt-1">
                          {/* Top Badges: Category & Shell Flavor */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-[11px] font-bold px-3 py-1 rounded-full truncate bg-[#9A99FE]/15 text-[#9A99FE] border border-[#9A99FE]/30">
                                {item.category}
                              </span>
                              <span className="font-mono text-[10px] font-semibold text-slate-300 bg-[#141618] px-2 py-0.5 rounded-md border border-white/5">
                                {item.shellType}
                              </span>
                            </div>

                            {/* Usage Badge */}
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D3FF69]/10 text-[#D3FF69] font-mono text-[11px] font-semibold shrink-0">
                              <TrendingUp className="w-3 h-3 text-[#D3FF69]" />
                              <span>{useCount} runs</span>
                            </div>
                          </div>

                          {/* Command Title */}
                          <h3 className="font-caption font-bold text-xl text-[#FAFCFE] tracking-tight leading-snug group-hover:text-[#9A99FE] transition-colors">
                            {item.title}
                          </h3>

                          {/* Description */}
                          {item.description && (
                            <p className="text-xs text-[#8A8F98] line-clamp-2 leading-relaxed font-sans">
                              {item.description}
                            </p>
                          )}

                          {/* Code Syntax Display Box */}
                          <div className="p-3 bg-[#000203] rounded-xl border border-white/10 font-mono text-xs text-[#D3FF69] break-all select-text">
                            {processedCmd}
                          </div>

                          {/* Interactive Variable Filling Inputs */}
                          {item.variables && item.variables.length > 0 && (
                            <div className="p-3 bg-[#181A1C] rounded-xl border border-white/5 space-y-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9A99FE] flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Variable Parameters:
                              </span>
                              <div className="grid grid-cols-1 gap-2">
                                {item.variables.map((v) => (
                                  <div key={v} className="flex items-center gap-2">
                                    <span className="text-[11px] font-mono text-[#8A8F98] w-24 truncate">
                                      {v}:
                                    </span>
                                    <input
                                      type="text"
                                      value={varValues[item.id]?.[v] || ''}
                                      onChange={(e) => handleVariableChange(item.id, v, e.target.value)}
                                      placeholder={`Enter ${v}...`}
                                      className="flex-1 bg-[#000203] text-[#FAFCFE] font-mono text-xs rounded-lg px-2.5 py-1 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#9A99FE]"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Target Directory CWD Bar */}
                          <div className="flex items-center gap-2 pt-1">
                            <Folder className="w-3.5 h-3.5 text-[#9A99FE] shrink-0" />
                            <input
                              type="text"
                              value={customCwds[item.id] !== undefined ? customCwds[item.id] : item.defaultCwd || ''}
                              onChange={(e) => setCustomCwds({ ...customCwds, [item.id]: e.target.value })}
                              placeholder="Set execution CWD (optional)..."
                              className="w-full bg-[#181A1C] text-[#8A8F98] focus:text-[#FAFCFE] font-mono text-[11px] rounded-lg px-2.5 py-1 border border-white/5 focus:outline-none focus:ring-1 focus:ring-[#9A99FE]"
                            />
                          </div>

                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 mt-4 flex items-center justify-between border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                          
                          {/* Star Toggle */}
                          <button
                            onClick={() => onToggleStar(item.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              item.starred
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-[#141618] hover:bg-[#242529] text-[#8A8F98] hover:text-amber-400 border border-white/5'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${item.starred ? 'fill-amber-400' : ''}`} />
                          </button>

                          {/* Action Buttons: Copy, Run, Menu */}
                          <div className="flex items-center gap-2 relative three-dot-menu-container">
                            
                            {/* Copy Command */}
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => handleCopyCommand(item)}
                              title="Copy Command String"
                              className={`px-3 py-1.5 rounded-full font-caption font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors ${
                                copiedCmdId === item.id
                                  ? 'bg-[#53FFA9] text-[#000203]'
                                  : 'bg-[#9A99FE] hover:bg-[#b0afff] text-[#000203]'
                              }`}
                            >
                              {copiedCmdId === item.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Copy</span>
                                </>
                              )}
                            </motion.button>

                            {/* Run Simulator */}
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => handleSimulateRun(item)}
                              title="Simulate Execution Output"
                              className="px-3 py-1.5 rounded-full bg-[#D3FF69] hover:bg-[#e2ff88] text-[#000203] font-caption font-bold text-xs shadow-sm flex items-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-[#000203]" />
                              <span>Run</span>
                            </motion.button>

                            {/* 3-Dot Options */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(isMenuOpen ? null : item.id);
                              }}
                              className="w-8 h-8 rounded-full bg-[#141618] hover:bg-[#242529] text-[#8A8F98] hover:text-[#FAFCFE] flex items-center justify-center border border-white/5 transition-colors"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {isMenuOpen && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 6 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                  className="absolute right-0 bottom-10 z-30 w-44 bg-[#181A1C] border border-white/10 rounded-2xl shadow-2xl py-1.5 text-xs text-[#FAFCFE]"
                                >
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setEditingCommand(item);
                                      setIsCreateOpen(true);
                                    }}
                                    className="w-full px-3.5 py-2 hover:bg-[#242529] flex items-center gap-2 text-left"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-[#9A99FE]" /> Edit Command
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setDeletingCommand(item);
                                    }}
                                    className="w-full px-3.5 py-2 hover:bg-rose-500/20 text-rose-400 flex items-center gap-2 text-left"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete Command
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
                  {sortedCommands.map((item) => {
                    const processedCmd = getProcessedCommand(item);

                    return (
                      <motion.div
                        layout="position"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          layout: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.15 },
                        }}
                        key={item.id}
                        className="macos-card p-4 flex items-center justify-between group border border-[#9A99FE]/25 hover:border-[#9A99FE]/50"
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                          <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#9A99FE]/15 text-[#9A99FE] border border-[#9A99FE]/30 shrink-0">
                            {item.category}
                          </span>

                          <div className="min-w-0">
                            <h3 className="font-caption font-bold text-base text-[#FAFCFE] truncate group-hover:text-[#9A99FE] transition-colors">
                              {item.title}
                            </h3>
                            <code className="font-mono text-xs text-[#D3FF69] truncate block mt-0.5">
                              {processedCmd}
                            </code>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleCopyCommand(item)}
                            className={`px-3 py-1.5 rounded-full font-caption font-bold text-xs flex items-center gap-1 transition-colors ${
                              copiedCmdId === item.id
                                ? 'bg-[#53FFA9] text-[#000203]'
                                : 'bg-[#9A99FE] text-[#000203]'
                            }`}
                          >
                            {copiedCmdId === item.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleSimulateRun(item)}
                            className="px-3 py-1.5 rounded-full bg-[#D3FF69] text-[#000203] font-caption font-bold text-xs flex items-center gap-1"
                          >
                            <Play className="w-3.5 h-3.5 fill-[#000203]" /> Run
                          </button>
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

      {/* Simulated Terminal Execution Drawer Overlay */}
      <AnimatePresence>
        {simulatedExecution && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-[#000203] border border-[#D3FF69]/40 rounded-3xl shadow-2xl overflow-hidden text-[#FAFCFE] font-mono"
            >
              {/* Terminal Window Header */}
              <div className="px-5 py-3 bg-[#141618] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-[#8A8F98] ml-2 font-caption font-bold">
                    Terminal Output Simulation — {simulatedExecution.commandTitle}
                  </span>
                </div>

                <button
                  onClick={() => setSimulatedExecution(null)}
                  className="p-1 rounded-full hover:bg-[#242529] text-[#8A8F98] hover:text-[#FAFCFE]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Console Logs Body */}
              <div className="p-6 space-y-2 text-xs text-[#D3FF69] leading-relaxed">
                {simulatedExecution.logs.map((log, idx) => (
                  <p key={idx} className={log.startsWith('$') ? 'font-bold text-[#FAFCFE]' : ''}>
                    {log}
                  </p>
                ))}
              </div>

              <div className="px-6 py-3 bg-[#141618] border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[#8A8F98]">Process completed locally</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(simulatedExecution.fullCommand);
                    showToast('Command copied to clipboard');
                    setSimulatedExecution(null);
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#D3FF69] text-[#000203] font-caption font-bold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Command
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <CreateCommandModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingCommand(null);
        }}
        onSaveCommand={(data) => {
          if (editingCommand) {
            onUpdateCommand({ ...editingCommand, ...data } as CommandItem);
          } else {
            onAddCommand(data);
          }
        }}
        commandToEdit={editingCommand}
        allExistingTags={Array.from(new Set(commands.flatMap((c) => c.tags)))}
      />

      <TerminalHistoryImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImportCommands={(importedList) => {
          importedList.forEach((cmd) => onAddCommand(cmd));
          showToast(`Imported ${importedList.length} commands to vault`);
        }}
      />

      <ShellHooksModal
        isOpen={isHooksOpen}
        onClose={() => setIsHooksOpen(false)}
      />

      {/* Delete Confirmation Modal for Commands */}
      <DeleteConfirmationModal
        isOpen={!!deletingCommand}
        bookmark={
          deletingCommand
            ? {
                id: deletingCommand.id,
                title: deletingCommand.title,
                url: deletingCommand.command,
                domain: deletingCommand.category,
                description: deletingCommand.description || '',
                faviconUrl: '',
                tags: deletingCommand.tags,
                starred: deletingCommand.starred,
                createdAt: deletingCommand.createdAt,
              }
            : null
        }
        onConfirm={() => {
          if (deletingCommand) {
            onDeleteCommand(deletingCommand.id);
            setDeletingCommand(null);
          }
        }}
        onCancel={() => setDeletingCommand(null)}
      />

    </div>
  );
};
