import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Terminal, Code } from 'lucide-react';

interface ShellHooksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShellHooksModal: React.FC<ShellHooksModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'zsh' | 'bash' | 'powershell'>('zsh');
  const [copied, setCopied] = useState(false);

  const SNIPPETS = {
    zsh: `# Add to ~/.zshrc for automatic command capturing or export
alias qd-save='history -10 | pbcopy'
qd-log() {
  echo "$1" >> ~/.quantum_desk_commands.log
  echo "Saved command to Quantum Desk local log."
}`,
    bash: `# Add to ~/.bashrc for automatic command logging
alias qd-save='history 10'
qd-log() {
  echo "$1" >> ~/.quantum_desk_commands.log
  echo "Logged command for Quantum Desk."
}`,
    powershell: `# Add to your PowerShell $PROFILE
function qd-log {
    param([string]$cmd)
    Add-Content -Path "$HOME\\.quantum_desk_commands.log" -Value $cmd
    Write-Host "Logged command to Quantum Desk" -ForegroundColor Green
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SNIPPETS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                    Terminal Shell Hook Configuration
                  </h3>
                  <p className="text-xs text-[#8A8F98]">
                    Copy integration helpers for Mac terminal, VS Code CLI, or Windows PowerShell
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

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Shell Flavor Selector */}
              <div className="flex items-center gap-2 bg-[#242529] p-1 rounded-xl border border-white/5">
                {[
                  { id: 'zsh', label: 'macOS Zsh (~/.zshrc)' },
                  { id: 'bash', label: 'Linux Bash (~/.bashrc)' },
                  { id: 'powershell', label: 'Windows PowerShell ($PROFILE)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                      activeTab === t.id
                        ? 'bg-[#9A99FE] text-[#000203] shadow-md'
                        : 'text-[#8A8F98] hover:text-[#FAFCFE]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Snippet Code Container */}
              <div className="relative bg-[#000203] p-4 rounded-xl border border-white/10 font-mono text-xs text-[#D3FF69]">
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[#242529] hover:bg-[#373B3E] text-xs font-caption font-bold text-[#9A99FE] flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#D3FF69]" />
                      <span className="text-[#D3FF69]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Hook</span>
                    </>
                  )}
                </button>

                <pre className="overflow-x-auto whitespace-pre-wrap pt-2 leading-relaxed">
                  {SNIPPETS[activeTab]}
                </pre>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-[#242529]/60 border border-white/5 space-y-2 text-xs font-sans text-[#8A8F98]">
                <span className="font-caption font-bold text-[#FAFCFE] flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-[#9A99FE]" /> How it works:
                </span>
                <p>
                  Paste this snippet into your shell config file. You can then run <code className="text-[#D3FF69] bg-[#000203] px-1.5 py-0.5 rounded font-mono">qd-log "your command"</code> in any VS Code terminal or standalone console, and use the <strong>Import Terminal History</strong> tool to sync commands into your vault!
                </p>
              </div>

              {/* Footer */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#9A99FE] text-[#000203] font-caption font-bold text-xs shadow-lg hover:bg-[#b0afff] transition-all"
                >
                  Done
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
