import React, { useState } from 'react';
import type { Bookmark, CommandMacro } from '../types';
import { INITIAL_MACROS } from '../utils/storage';
import { Play, Command } from 'lucide-react';

interface CommandsAppProps {
  bookmarks: Bookmark[];
  onUpdateBookmarks: (newBookmarks: Bookmark[]) => void;
  onSetToast: (msg: string) => void;
}

export const CommandsApp: React.FC<CommandsAppProps> = ({
  bookmarks,
  onUpdateBookmarks,
  onSetToast,
}) => {
  const [logs, setLogs] = useState<string[]>([
    'Quantum Desk Terminal initialized.',
    'System status: 0 errors, 100% operational.',
    'Type or select a macro command below to execute system utilities.',
  ]);
  const [commandInput, setCommandInput] = useState('');

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${msg}`, ...prev]);
  };

  const executeMacro = (macro: CommandMacro) => {
    addLog(`Executing macro: ${macro.name}...`);

    switch (macro.action) {
      case 'export_json': {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `quantum_desk_export_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        addLog(`Successfully exported ${bookmarks.length} bookmarks to JSON file.`);
        onSetToast(`Exported ${bookmarks.length} bookmarks to JSON`);
        break;
      }

      case 'purge_duplicates': {
        const seenUrls = new Set<string>();
        const unique = bookmarks.filter((b) => {
          const norm = b.url.replace(/\/$/, '').toLowerCase();
          if (seenUrls.has(norm)) return false;
          seenUrls.add(norm);
          return true;
        });

        const removedCount = bookmarks.length - unique.length;
        if (removedCount > 0) {
          onUpdateBookmarks(unique);
          addLog(`Purged ${removedCount} duplicate link entry.`);
          onSetToast(`Purged ${removedCount} duplicate links`);
        } else {
          addLog('Zero duplicate URLs detected in preserved collection.');
          onSetToast('Zero duplicate links found');
        }
        break;
      }

      case 'reindex_graph': {
        addLog('Re-indexing force-directed graph node vectors and connection edges...');
        setTimeout(() => {
          addLog('Linkage Graph re-indexing complete. Spatial topology refreshed.');
          onSetToast('Linkage Graph re-indexed');
        }, 400);
        break;
      }

      case 'complete_all_queue': {
        const updated = bookmarks.map((b) => ({ ...b, status: 'completed' as const }));
        onUpdateBookmarks(updated);
        addLog(`Batch updated ${bookmarks.length} queue items to Completed status.`);
        onSetToast('All queue items marked completed');
        break;
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-[#181A1C] rounded-[24px] p-7 flex items-center justify-between gap-6 flex-wrap shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#242529] flex items-center justify-center p-2 shadow-lg">
            <img src="/logos/commands.png" alt="Commands Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-caption font-bold text-2xl text-[#FAFCFE]">COMMANDS TERMINAL</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#9A99FE]/20 text-[#9A99FE] font-mono text-[10px] font-bold">
                PURPLE ENGINE
              </span>
            </div>
            <p className="text-xs text-[#8A8F98]">
              Developer workflow macro runner, JSON export/import, and knowledge graph automation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Macro Command Cards Grid */}
        <div className="md:col-span-7 space-y-4">
          <h2 className="font-caption font-bold text-sm uppercase tracking-wider text-[#9A99FE] flex items-center gap-2">
            <Command className="w-4 h-4" /> Registered Workflow Macros
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {INITIAL_MACROS.map((macro) => (
              <div
                key={macro.id}
                onClick={() => executeMacro(macro)}
                className="bg-[#181A1C] hover:bg-[#242529] rounded-2xl p-5 shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#9A99FE] uppercase font-bold bg-[#9A99FE]/15 px-2.5 py-0.5 rounded-full">
                      {macro.category}
                    </span>
                    {macro.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#242529] text-[#8A8F98] rounded-md">
                        {macro.shortcut}
                      </kbd>
                    )}
                  </div>

                  <h3 className="font-caption font-bold text-sm text-[#FAFCFE] group-hover:text-[#9A99FE] transition-colors">
                    {macro.name}
                  </h3>

                  <p className="text-xs text-[#8A8F98] mt-1 line-clamp-2">
                    {macro.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#8A8F98]">Run Macro</span>
                  <button className="w-7 h-7 rounded-full bg-[#9A99FE] text-[#000203] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-[#000203] stroke-none" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Console Log Terminal Window */}
        <div className="md:col-span-5 flex flex-col">
          <div className="bg-[#181A1C] rounded-[24px] flex-1 flex flex-col overflow-hidden shadow-2xl">
            
            {/* Console Header */}
            <div className="px-5 py-4 bg-[#242529] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="font-mono text-xs text-[#FAFCFE] font-bold ml-2">qd-terminal-console</span>
              </div>
              <button
                onClick={() => setLogs(['Console cleared.'])}
                className="text-[10px] font-mono text-[#8A8F98] hover:text-[#FAFCFE]"
              >
                Clear
              </button>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 p-5 font-mono text-xs bg-[#000203] overflow-y-auto space-y-1.5 min-h-[300px]">
              {logs.map((line, i) => (
                <div key={i} className="text-[#9A99FE] leading-relaxed flex items-start gap-2">
                  <span className="text-[#8A8F98] select-none">&gt;</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>

            {/* Command Prompt Input */}
            <div className="p-4 bg-[#242529] flex items-center gap-2">
              <span className="text-[#9A99FE] font-mono font-bold text-xs">$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && commandInput.trim()) {
                    addLog(`Manual command: ${commandInput}`);
                    setCommandInput('');
                  }
                }}
                placeholder="Type command or macro..."
                className="w-full bg-transparent font-mono text-xs text-[#FAFCFE] placeholder:text-[#8A8F98] focus:outline-none"
              />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
