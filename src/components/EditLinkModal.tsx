import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Bookmark } from '../types';
import { X, Link2, Folder, Check, Edit3 } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';
import { TagInputField } from './TagInputField';

const collectionOptions = [
  { value: 'General', label: 'General' },
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Design Systems', label: 'Design Systems' },
  { value: 'Media', label: 'Media' },
  { value: 'Research', label: 'Research' },
];

interface EditLinkModalProps {
  isOpen: boolean;
  bookmark: Bookmark | null;
  onClose: () => void;
  onSaveBookmark: (updated: Bookmark) => void;
  allExistingTags?: string[];
}

export const EditLinkModal: React.FC<EditLinkModalProps> = ({
  isOpen,
  bookmark,
  onClose,
  onSaveBookmark,
  allExistingTags = [],
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [collection, setCollection] = useState('General');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  useEffect(() => {
    if (bookmark && isOpen) {
      setTitle(bookmark.title || '');
      setUrl(bookmark.url || '');
      setDescription(bookmark.description || '');
      setCollection(bookmark.collection || 'General');
      setTags(bookmark.tags ? [...bookmark.tags] : []);
      setNotes(bookmark.notes || '');
    }
  }, [bookmark, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookmark || !title.trim() || !url.trim()) return;

    let updatedDomain = bookmark.domain;
    try {
      let normalized = url.trim();
      if (!/^https?:\/\//i.test(normalized)) {
        normalized = 'https://' + normalized;
      }
      const parsed = new URL(normalized);
      updatedDomain = parsed.hostname.replace(/^www\./i, '');
    } catch {
      // keep existing domain if URL parse fails
    }

    const updated: Bookmark = {
      ...bookmark,
      title: title.trim(),
      url: url.trim(),
      domain: updatedDomain,
      description: description.trim(),
      collection: collection,
      tags: tags,
      notes: notes.trim() || undefined,
    };

    onSaveBookmark(updated);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && bookmark && (
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
            <div className="flex items-center justify-between pb-2 border-b border-[#242529]">
              <div className="flex items-center gap-3">
                <div className="w-9.5 h-9.5 rounded-2xl bg-[#242529] flex items-center justify-center text-[#D3FF69] shadow-sm">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-caption font-bold text-lg text-[#FAFCFE]">Edit Preserved Link</h2>
                  <p className="text-xs text-[#8A8F98]">Update title, destination URL, tags, and notes</p>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-caption font-semibold text-[#8A8F98] mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Bookmark Title..."
                  className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-full px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-caption font-semibold text-[#8A8F98] mb-1.5">
                  URL / Link Destination
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 absolute left-3.5 top-3 text-[#8A8F98]" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-full pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-caption font-semibold text-[#8A8F98] mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description or context..."
                  className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/30"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="block text-xs font-caption font-semibold text-[#8A8F98]">
                  Tags
                </label>
                <TagInputField
                  tags={tags}
                  onAddTag={(newTag) => setTags((prev) => [...prev, newTag])}
                  onRemoveTag={(tagToRemove) => setTags((prev) => prev.filter((t) => t !== tagToRemove))}
                  allExistingTags={allExistingTags}
                  placeholder="Add tag & press Enter..."
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
                    Personal Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes or summary..."
                    className="w-full bg-[#242529] text-[#FAFCFE] placeholder:text-[#8A8F98] rounded-full px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#97C8EC]/30"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#242529]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-caption font-semibold text-[#8A8F98] hover:text-[#FAFCFE] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!title.trim() || !url.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D3FF69] text-[#000203] font-caption font-bold text-sm shadow-md disabled:opacity-40"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Changes</span>
                </motion.button>
              </div>
            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
