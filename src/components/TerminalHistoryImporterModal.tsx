import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CommandItem, CommandCategory } from '../types';
import { extractCommandVariables } from '../utils/commandStorage';
import { X, Import, Check, Terminal, FileText, Trash2 } from 'lucide-react';

interface TerminalHistoryImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCommands: (newCommands: Omit<CommandItem, 'id' | 'createdAt' | 'useCount'>[]) => void;
}

export const TerminalHistoryImporterModal: React.FC<TerminalHistoryImporterModalProps> = ({
  isOpen,
  onClose,
  onImportCommands,
}) => {
  const [rawText, setRawText] = useState('');
  const [parsedCommands, setParsedCommands] = useState<{
    title: string;
    command: string;
    category: CommandCategory;
    selected: boolean;
  }[]>([]);

  const handleParseText = () => {
    if (!rawText.trim()) return;

    const lines = rawText.split('\n');
    const extracted: { title: string; command: string; category: CommandCategory; selected: boolean }[] = [];

    lines.forEach((line) => {
      let clean = line.trim();
      if (!clean) return;

      // Clean zsh history formats: : 1672531199:0;command
      if (clean.startsWith(':')) {
        const parts = clean.split(';');
        if (parts.length > 1) {
          clean = parts.slice(1).join(';').trim();
        }
      }

      // Clean bash history numbers or PS prompts (e.g., "  123  git status" or "$ git checkout")
      clean = clean.replace(/^\d+\s+/, '').replace(/^[\$%>#]\s+/, '').trim();

      // Skip trivial or ultra-short commands (e.g. "cd", "ls", "clear", "exit")
      if (clean.length < 3 || ['ls', 'cd', 'clear', 'exit', 'pwd', 'history'].includes(clean.toLowerCase())) {
        return;
      }

      // Auto detect category based on keyword
      let category: CommandCategory = 'Custom';
      const lower = clean.toLowerCase();
      if (lower.startsWith('git ')) category = 'Git';
      else if (lower.startsWith('docker') || lower.includes('docker-compose')) category = 'Docker';
      else if (lower.startsWith('npm ') || lower.startsWith('npx ') || lower.startsWith('yarn ') || lower.startsWith('pnpm ')) category = 'Node/npm';
      else if (lower.startsWith('kubectl ') || lower.includes('k8s')) category = 'Kubernetes';
      else if (lower.includes('postgres') || lower.includes('mysql') || lower.includes('mongo') || lower.includes('redis')) category = 'Database';
      else if (lower.startsWith('sudo ') || lower.startsWith('systemctl ') || lower.startsWith('kill') || lower.startsWith('chmod')) category = 'System';

      // Auto generate a descriptive title from command
      const title = clean.length > 45 ? `${clean.slice(0, 42)}...` : clean;

      // Avoid duplicates in parsed list
      if (!extracted.some((item) => item.command === clean)) {
        extracted.push({
          title,
          command: clean,
          category,
          selected: true,
        });
      }
    });

    setParsedCommands(extracted);
  };

  const handleToggleSelectAll = () => {
    const allSelected = parsedCommands.every((c) => c.selected);
    setParsedCommands(parsedCommands.map((c) => ({ ...c, selected: !allSelected })));
  };

  const handleToggleItem = (index: number) => {
    setParsedCommands(
      parsedCommands.map((c, i) => (i === index ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleRemoveItem = (index: number) => {
    setParsedCommands(parsedCommands.filter((_, i) => i !== index));
  };

  const handleConfirmImport = () => {
    const selected = parsedCommands.filter((c) => c.selected);
    if (selected.length === 0) return;

    const toImport: Omit<CommandItem, 'id' | 'createdAt' | 'useCount'>[] = selected.map((item) => ({
      title: item.title,
      command: item.command,
      category: item.category,
      shellType: 'zsh',
      variables: extractCommandVariables(item.command),
      tags: ['Imported', item.category],
      starred: false,
    }));

    onImportCommands(toImport);
    onClose();
    setRawText('');
    setParsedCommands([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="w-full max-w-3xl bg-[#141618] border border-[#9A99FE]/30 rounded-3xl shadow-2xl overflow-hidden text-[#FAFCFE]"
          >
            {/* Header Bar */}
            <div className="px-6 py-4 bg-[#181A1C] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#9A99FE]/15 text-[#9A99FE] border border-[#9A99FE]/30">
                  <Import className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-caption font-bold text-lg text-[#FAFCFE]">
                    Import Terminal History Logs
                  </h3>
                  <p className="text-xs text-[#8A8F98]">
                    Paste lines from VS Code terminal, Mac Zsh history (~/.zsh_history), or Bash logs
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#242529] text-[#8A8F98] hover:text-[#FAFCFE] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Section */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {parsedCommands.length === 0 ? (
                /* Step 1: Raw Text Input Box */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#8A8F98]">
                      Paste Raw Terminal History Text
                    </label>
                    <span className="text-[11px] font-mono text-[#9A99FE] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Supports zsh, bash & PowerShell history
                    </span>
                  </div>

                  <textarea
                    rows={8}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder={`e.g. paste terminal logs like:\n$ git checkout -b feat/commands-app\n$ npm run dev -- --host\n$ docker compose up -d\n$ npx kill-port 3000`}
                    className="w-full bg-[#000203] text-[#FAFCFE] font-mono text-xs rounded-xl p-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#9A99FE]/50 transition-all"
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={!rawText.trim()}
                      onClick={handleParseText}
                      className="px-6 py-2.5 rounded-full bg-[#9A99FE] hover:bg-[#b0afff] disabled:opacity-50 text-[#000203] font-caption font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                    >
                      <Terminal className="w-4 h-4" />
                      <span>Parse & Extract Commands</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Parsed Item Review & Selection List */
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="text-xs font-mono font-bold text-[#9A99FE] hover:underline"
                      >
                        {parsedCommands.every((c) => c.selected) ? 'Deselect All' : 'Select All'}
                      </button>
                      <span className="text-xs font-mono text-[#8A8F98]">
                        ({parsedCommands.filter((c) => c.selected).length} of {parsedCommands.length} selected)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setParsedCommands([])}
                      className="text-xs font-caption text-[#8A8F98] hover:text-[#FAFCFE] underline"
                    >
                      Re-paste Text
                    </button>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {parsedCommands.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleToggleItem(index)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          item.selected
                            ? 'bg-[#9A99FE]/10 border-[#9A99FE]/40'
                            : 'bg-[#242529]/60 border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleToggleItem(index)}
                            className="rounded accent-[#9A99FE] shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-mono text-xs font-bold text-[#D3FF69] block truncate">
                              {item.command}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#000203] text-[#9A99FE] border border-[#9A99FE]/20">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(index);
                          }}
                          className="p-1.5 rounded-full hover:bg-rose-500/20 text-[#8A8F98] hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-[#8A8F98]">
                      Ready to import {parsedCommands.filter((c) => c.selected).length} commands
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-full text-xs font-caption font-bold text-[#8A8F98] hover:text-[#FAFCFE]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={parsedCommands.filter((c) => c.selected).length === 0}
                        onClick={handleConfirmImport}
                        className="px-6 py-2.5 rounded-full bg-[#9A99FE] hover:bg-[#b0afff] disabled:opacity-50 text-[#000203] font-caption font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Import Selected Commands</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
