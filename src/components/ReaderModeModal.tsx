import React, { useState } from 'react';
import type { Bookmark, ReadingStatus } from '../types';
import { X, Glasses, Clock, ExternalLink, Tag, Save, Check, RefreshCw, Plus } from 'lucide-react';

interface ReaderModeModalProps {
  bookmark: Bookmark | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: ReadingStatus) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onUpdateTags?: (id: string, tags: string[]) => void;
}

export const ReaderModeModal: React.FC<ReaderModeModalProps> = ({
  bookmark,
  onClose,
  onUpdateStatus,
  onSaveNotes,
  onUpdateTags,
}) => {
  const [notesInput, setNotesInput] = useState(bookmark?.notes || '');
  const [tagInput, setTagInput] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  React.useEffect(() => {
    setNotesInput(bookmark?.notes || '');
  }, [bookmark]);

  if (!bookmark) return null;

  const handleAddTag = () => {
    const cleaned = tagInput.trim().replace(/^#/, '');
    if (cleaned && !bookmark.tags.includes(cleaned) && onUpdateTags) {
      onUpdateTags(bookmark.id, [...bookmark.tags, cleaned]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (onUpdateTags) {
      onUpdateTags(
        bookmark.id,
        bookmark.tags.filter((t) => t !== tagToRemove)
      );
    }
  };

  const cycleStatus = () => {
    const nextStatus: Record<ReadingStatus, ReadingStatus> = {
      unread: 'reading',
      reading: 'completed',
      completed: 'unread',
    };
    onUpdateStatus(bookmark.id, nextStatus[bookmark.status]);
  };

  const handleSaveNotes = () => {
    onSaveNotes(bookmark.id, notesInput);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const getStatusBadge = (status: ReadingStatus) => {
    switch (status) {
      case 'unread':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-caption font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Unread
          </span>
        );
      case 'reading':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D3FF69]/15 text-[#D3FF69] text-xs font-caption font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#D3FF69]" />
            Currently Reading
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#53FFA9]/15 text-[#53FFA9] text-xs font-caption font-semibold">
            <Check className="w-3.5 h-3.5" />
            Completed
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-pop-fade">
      <div className="w-full max-w-3xl h-[85vh] bg-[#181A1C] rounded-[24px] shadow-2xl flex flex-col relative overflow-hidden text-[#FAFCFE]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-7 py-5 bg-[#181A1C]">
          <div className="flex items-center gap-3">
            <div className="w-9.5 h-9.5 rounded-2xl bg-[#242529] flex items-center justify-center text-[#D3FF69] shadow-sm">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-caption uppercase tracking-wider text-[#8A8F98] font-bold">
                Distraction-Free Reader View
              </span>
              <h2 className="font-caption font-bold text-sm text-[#FAFCFE] truncate max-w-md">
                {bookmark.domain}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={cycleStatus}
              title="Click to cycle status: unread -> reading -> completed"
              className="hover:scale-105 transition-transform"
            >
              {getStatusBadge(bookmark.status)}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#242529] hover:bg-[#373B3E] text-[#8A8F98] hover:text-[#FAFCFE] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reader Body Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          
          {/* Article Title & Metadata */}
          <div className="space-y-4 pb-4">
            <div className="flex items-center gap-3 flex-wrap text-xs text-[#8A8F98] font-mono">
              <div className="flex items-center gap-1.5 bg-[#242529] px-3.5 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{bookmark.readingTimeMinutes} minute read</span>
              </div>
              <div className="bg-[#242529] px-3.5 py-1.5 rounded-full">
                Saved {new Date(bookmark.createdAt).toLocaleDateString()}
              </div>
              {bookmark.collection && (
                <div className="bg-[#97C8EC]/15 text-[#97C8EC] px-3.5 py-1.5 rounded-full font-caption font-bold">
                  {bookmark.collection}
                </div>
              )}
            </div>

            <h1 className="font-caption font-bold text-2xl md:text-3xl text-[#FAFCFE] leading-tight">
              {bookmark.title}
            </h1>

            <p className="text-base text-slate-300 font-sans leading-relaxed">
              {bookmark.description}
            </p>

            {/* Interactive Tags Editor */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <Tag className="w-3.5 h-3.5 text-[#D3FF69] shrink-0" />
              {bookmark.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#242529] text-[#FAFCFE] font-caption text-xs font-semibold"
                >
                  #{tag}
                  {onUpdateTags && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-400 text-xs ml-0.5 font-bold transition-colors"
                      title={`Remove #${tag}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}

              {onUpdateTags && (
                <div className="flex items-center gap-1 bg-[#242529] px-3 py-1 rounded-full text-xs">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag..."
                    className="bg-transparent text-xs text-[#FAFCFE] placeholder:text-[#8A8F98] focus:outline-none w-20"
                  />
                  {tagInput.trim() && (
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="text-[#D3FF69] font-bold hover:scale-110 transition-transform"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reader Preservation View */}
          <div className="space-y-4 text-slate-200 text-base leading-relaxed font-sans">
            <div className="p-4 bg-[#242529] rounded-2xl text-xs font-mono text-[#8A8F98] space-y-1">
              <div className="text-[#97C8EC] font-bold font-caption">Preserved Canonical Source</div>
              <div className="truncate text-slate-300">{bookmark.url}</div>
            </div>

            <p>
              Linker's digital preservation engine captures clean, structured representations of developer documentation, research papers, and technical threads.
            </p>
            <p>
              This distraction-free canvas isolates key content, strips tracking parameters, and allows inline note taking with instant persistence.
            </p>
          </div>

          {/* Markdown Notes Editor */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-caption font-bold text-xs text-[#97C8EC] uppercase tracking-wider flex items-center gap-2">
                <span>Personal Reader Notes</span>
                {savedToast && (
                  <span className="text-xs text-[#53FFA9] normal-case flex items-center gap-1 font-mono">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
              </label>
              
              <button
                onClick={handleSaveNotes}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#242529] hover:bg-[#373B3E] text-[#FAFCFE] font-caption font-bold text-xs rounded-full transition-all"
              >
                <Save className="w-3.5 h-3.5 text-[#97C8EC]" />
                <span>Save Notes</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Write your research notes, code snippets, or takeaways here..."
              className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-2xl p-4 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/30 transition-all"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-7 py-4 bg-[#181A1C] flex items-center justify-between">
          <button
            onClick={cycleStatus}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#242529] text-xs font-caption font-bold text-slate-300 hover:text-[#FAFCFE] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#97C8EC]" />
            <span>Cycle Queue Status</span>
          </button>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 bg-[#D3FF69] text-[#000203] font-caption font-bold text-xs rounded-full hover:brightness-110 transition-all shadow-sm"
          >
            <span>Open Original Webpage</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>
        </div>

      </div>
    </div>
  );
};
