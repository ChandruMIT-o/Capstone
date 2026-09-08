import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CommandItem, CommandCategory, ShellType } from '../types';
import { extractCommandVariables } from '../utils/commandStorage';
import { X, Plus, Terminal, Tag, Folder, Sparkles, Check } from 'lucide-react';

interface CreateCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCommand: (commandData: Partial<CommandItem>) => void;
  commandToEdit?: CommandItem | null;
  allExistingTags: string[];
}

const CATEGORIES: CommandCategory[] = ['Git', 'Docker', 'Node/npm', 'System', 'Database', 'Kubernetes', 'Custom'];
const SHELL_TYPES: ShellType[] = ['zsh', 'bash', 'powershell', 'cmd'];

export const CreateCommandModal: React.FC<CreateCommandModalProps> = ({
  isOpen,
  onClose,
  onSaveCommand,
  commandToEdit,
  allExistingTags,
}) => {
  const [title, setTitle] = useState('');
  const [command, setCommand] = useState('');
  const [category, setCategory] = useState<CommandCategory>('Git');
  const [shellType, setShellType] = useState<ShellType>('zsh');
  const [defaultCwd, setDefaultCwd] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    if (commandToEdit) {
      setTitle(commandToEdit.title);
      setCommand(commandToEdit.command);
      setCategory(commandToEdit.category);
      setShellType(commandToEdit.shellType);
      setDefaultCwd(commandToEdit.defaultCwd || '');
      setDescription(commandToEdit.description || '');
      setTags(commandToEdit.tags || []);
      setStarred(commandToEdit.starred || false);
    } else {
      setTitle('');
      setCommand('');
      setCategory('Git');
      setShellType('zsh');
      setDefaultCwd('');
      setDescription('');
      setTags([]);
      setStarred(false);
    }
  }, [commandToEdit, isOpen]);

  const detectedVars = extractCommandVariables(command);

  const handleAddTag = (t: string) => {
    const clean = t.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !command.trim()) return;

    onSaveCommand({
      ...(commandToEdit ? { id: commandToEdit.id } : {}),
      title: title.trim(),
      command: command.trim(),
      category,
      shellType,
      defaultCwd: defaultCwd.trim() || undefined,
      description: description.trim() || undefined,
      variables: detectedVars,
      tags,
      starred,
    });

    onClose();
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
            className="w-full max-w-2xl bg-[#141618] border border-[#9A99FE]/30 rounded-3xl shadow-2xl overflow-hidden text-[#FAFCFE]"
          >
            {/* Header Bar */}
            <div className="px-6 py-4 bg-[#181A1C] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#9A99FE]/15 text-[#9A99FE] border border-[#9A99FE]/30">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-caption font-bold text-lg text-[#FAFCFE]">
                    {commandToEdit ? 'Edit Preserved Command' : 'Preserve New Shell Command'}
                  </h3>
                  <p className="text-xs text-[#8A8F98]">
                    Configure syntax, variable placeholders, and target directory
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

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* Command Title */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#8A8F98] mb-1.5">
                  Command Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Create Feature Branch & Checkout"
                  className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98]/60 rounded-xl px-4 py-2.5 text-sm font-medium border border-white/5 focus:outline-none focus:ring-2 focus:ring-[#9A99FE]/50 transition-all"
                />
              </div>

              {/* Command Syntax & Detected Variables */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#8A8F98]">
                    Terminal Command Syntax <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#9A99FE]">
                    Use {'{{var_name}}'} for variables
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="e.g. git checkout -b {{branch_name}} or npm run dev -- --port {{port}}"
                  className="w-full bg-[#000203] text-[#D3FF69] font-mono text-xs rounded-xl p-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#9A99FE]/50 transition-all"
                />

                {/* Detected Variables Pill Bar */}
                {detectedVars.length > 0 && (
                  <div className="mt-2 p-2.5 rounded-xl bg-[#9A99FE]/10 border border-[#9A99FE]/20 flex items-center gap-2 flex-wrap">
                    <Sparkles className="w-4 h-4 text-[#9A99FE] shrink-0" />
                    <span className="text-xs font-caption text-[#9A99FE] font-bold">Detected Variables:</span>
                    {detectedVars.map((v) => (
                      <span
                        key={v}
                        className="px-2.5 py-0.5 rounded-md bg-[#000203] font-mono text-xs text-[#D3FF69] border border-[#D3FF69]/30"
                      >
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Category & Shell Type Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#8A8F98] mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CommandCategory)}
                    className="w-full bg-[#242529] text-[#FAFCFE] rounded-xl px-4 py-2.5 text-sm font-medium border border-white/5 focus:outline-none focus:ring-2 focus:ring-[#9A99FE]/50"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#8A8F98] mb-1.5">
                    Shell Flavor
                  </label>
                  <div className="flex items-center gap-1 bg-[#242529] p-1 rounded-xl border border-white/5">
                    {SHELL_TYPES.map((sh) => (
                      <button
                        type="button"
                        key={sh}
                        onClick={() => setShellType(sh)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${
                          shellType === sh
                            ? 'bg-[#9A99FE] text-[#000203]'
                            : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                        }`}
                      >
                        {sh}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Default Working Directory (Target CWD) */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#8A8F98] mb-1.5 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-[#9A99FE]" /> Target Working Directory (Optional)
                </label>
                <input
                  type="text"
                  value={defaultCwd}
                  onChange={(e) => setDefaultCwd(e.target.value)}
                  placeholder="e.g. d:/DEV/Personal/Capstone or ~/projects/api"
                  className="w-full bg-[#242529] text-[#FAFCFE] font-mono text-xs placeholder:text-[#8A8F98]/50 rounded-xl px-4 py-2.5 border border-white/5 focus:outline-none focus:ring-2 focus:ring-[#9A99FE]/50 transition-all"
                />
              </div>

              {/* Description / Notes */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#8A8F98] mb-1.5">
                  Description / Documentation Notes
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Run when launching backend container dependencies"
                  className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98]/50 rounded-xl px-4 py-2.5 text-sm font-medium border border-white/5 focus:outline-none focus:ring-2 focus:ring-[#9A99FE]/50 transition-all"
                />
              </div>

              {/* Tags Cloud */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#8A8F98] mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#9A99FE]" /> Tags
                </label>

                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-[#9A99FE]/15 text-[#9A99FE] font-mono text-xs font-bold border border-[#9A99FE]/30 flex items-center gap-1.5"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(tagInput);
                      }
                    }}
                    placeholder="Add tag and press Enter..."
                    className="flex-1 bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98]/50 rounded-xl px-4 py-2 text-xs font-medium border border-white/5 focus:outline-none focus:ring-2 focus:ring-[#9A99FE]/50"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className="px-4 py-2 rounded-xl bg-[#242529] hover:bg-[#373B3E] text-[#9A99FE] font-caption font-bold text-xs border border-white/5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Tag suggestions */}
                {allExistingTags.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-[#8A8F98]">Suggestions:</span>
                    {allExistingTags.slice(0, 6).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => handleAddTag(t)}
                        className="text-[10px] font-mono text-[#8A8F98] hover:text-[#FAFCFE] hover:underline"
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Footer Buttons */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-caption text-[#8A8F98] hover:text-[#FAFCFE]">
                  <input
                    type="checkbox"
                    checked={starred}
                    onChange={(e) => setStarred(e.target.checked)}
                    className="rounded accent-[#9A99FE]"
                  />
                  <span>Mark as Starred Command</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full text-xs font-caption font-bold text-[#8A8F98] hover:text-[#FAFCFE] hover:bg-[#242529] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#9A99FE] hover:bg-[#b0afff] text-[#000203] font-caption font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{commandToEdit ? 'Save Changes' : 'Preserve Command'}</span>
                  </button>
                </div>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
