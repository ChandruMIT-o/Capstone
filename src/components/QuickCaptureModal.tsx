import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Bookmark } from '../types';
import { guessMetadataFromUrl } from '../utils/heuristics';
import { X, Link2, Sparkles, Folder, Check } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';
import { FaviconWithFallback } from './FaviconWithFallback';
import { TagInputField } from './TagInputField';

const collectionOptions = [
  { value: 'General', label: 'General' },
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Design Systems', label: 'Design Systems' },
  { value: 'Media', label: 'Media' },
  { value: 'Research', label: 'Research' },
];

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBookmark: (b: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  allExistingTags?: string[];
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onAddBookmark,
  allExistingTags = [],
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [collection, setCollection] = useState('General');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [removedTags, setRemovedTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const meta = guessMetadataFromUrl(urlInput);

  // Combine inferred tags with user added tags, filtering out any removed tags
  const combinedTags = Array.from(
    new Set([...meta.tags, ...customTags].filter((t) => !removedTags.includes(t)))
  );

  useEffect(() => {
    if (isOpen) {
      setUrlInput('');
      setCustomTitle('');
      setCustomNotes('');
      setCollection('General');
      setCustomTags([]);
      setRemovedTags([]);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleRemoveTag = (tagToRemove: string) => {
    setCustomTags((prev) => prev.filter((t) => t !== tagToRemove));
    setRemovedTags((prev) => [...prev, tagToRemove]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const finalTitle = customTitle.trim() || meta.title || meta.domain || urlInput;

    onAddBookmark({
      url: meta.normalizedUrl || urlInput.trim(),
      title: finalTitle,
      domain: meta.domain || 'web',
      description: meta.description,
      faviconUrl: meta.faviconUrl,
      readingTimeMinutes: meta.readingTimeMinutes,
      tags: combinedTags,
      status: 'unread',
      starred: false,
      notes: customNotes.trim() || undefined,
      collection: collection,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="w-full max-w-xl bg-[#181A1C] rounded-[24px] p-7 shadow-2xl relative text-[#FAFCFE] border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="w-9.5 h-9.5 rounded-2xl bg-[#242529] flex items-center justify-center text-[#D3FF69] shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-caption font-bold text-lg text-[#FAFCFE]">Quick Capture</h2>
                  <p className="text-xs text-[#8A8F98]">Heuristic metadata sniffer & bookmark preservation</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#242529] text-[#8A8F98] hover:text-[#FAFCFE] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Capture Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-caption font-semibold text-[#8A8F98] mb-1.5">
                  URL / Web Address
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8A8F98]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste URL (e.g., github.com/user/repo, youtube.com, figma.com)..."
                    className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-full pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/30 transition-all"
                  />
                </div>
              </div>

              {/* Heuristic Sniffer Live Preview */}
              <AnimatePresence>
                {urlInput.trim() && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-[#242529] rounded-2xl space-y-3 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaviconWithFallback
                          domain={meta.domain}
                          faviconUrl={meta.faviconUrl}
                          title={meta.title}
                          size="sm"
                        />
                        <span className="font-caption font-bold text-xs text-[#97C8EC]">
                          {meta.domain || 'Detected Domain'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder={meta.title || 'Inferred Title...'}
                        className="w-full bg-[#181A1C] text-sm text-[#FAFCFE] font-semibold rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/30"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Custom Tags Section */}
              <div className="space-y-1.5">
                <label className="block text-xs font-caption font-semibold text-[#8A8F98]">
                  Tags (Inferred & Custom)
                </label>
                <TagInputField
                  tags={combinedTags}
                  onAddTag={(newTag) => {
                    setCustomTags((prev) => [...prev, newTag]);
                    setRemovedTags((prev) => prev.filter((t) => t !== newTag));
                  }}
                  onRemoveTag={(tagToRemove) => handleRemoveTag(tagToRemove)}
                  allExistingTags={allExistingTags}
                  placeholder="Type tag & press Enter..."
                />
              </div>

              {/* Collection & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-caption font-semibold text-[#8A8F98] mb-1.5">
                    Collection
                  </label>
                  <CustomDropdown
                    options={collectionOptions}
                    value={collection}
                    onChange={(val) => setCollection(val)}
                    icon={<Folder className="w-4 h-4" />}
                  />
                </div>

                <div>
                  <label className="block text-xs font-caption font-semibold text-[#8A8F98] mb-1.5">
                    Personal Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="Key takeaways or summary..."
                    className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-full px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/30"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-between mt-2">
                <span className="text-xs text-[#8A8F98] font-mono">
                  Press <kbd className="px-1.5 py-0.5 bg-[#242529] rounded-md text-[#FAFCFE] font-bold">Enter</kbd> to save
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D3FF69] text-[#000203] font-caption font-bold text-sm shadow-md disabled:opacity-40"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Preserve Link</span>
                </motion.button>
              </div>
            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
