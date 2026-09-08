import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Bookmark } from '../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  bookmark: Bookmark | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  bookmark,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && bookmark && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="w-full max-w-md bg-[#181A1C] rounded-[24px] shadow-2xl p-7 relative overflow-hidden text-[#FAFCFE] space-y-6 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#242529] text-[#8A8F98] hover:text-[#FAFCFE] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Icon & Title */}
            <div className="flex items-center gap-4 pt-1">
              <motion.div
                initial={{ scale: 0.5, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/10"
              >
                <AlertTriangle className="w-6 h-6" />
              </motion.div>
              <div>
                <h3 className="font-caption font-bold text-lg text-[#FAFCFE] leading-tight">
                  Delete Preserved Link?
                </h3>
                <p className="text-xs font-mono text-[#8A8F98] mt-0.5">
                  {bookmark.domain}
                </p>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="p-4 bg-[#242529] rounded-2xl text-xs font-sans text-slate-300 leading-relaxed border border-white/5">
              Are you sure you want to delete <span className="font-bold text-[#FAFCFE]">"{bookmark.title}"</span>? This action will permanently remove it from your preservation queue.
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="px-5 py-2.5 rounded-full bg-[#242529] text-[#8A8F98] hover:text-[#FAFCFE] text-xs font-caption font-bold transition-all"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-caption font-bold shadow-lg shadow-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </motion.button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
