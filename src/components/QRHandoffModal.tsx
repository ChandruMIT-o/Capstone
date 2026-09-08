import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Bookmark } from '../types';
import { X, Smartphone, Copy, Check, ExternalLink } from 'lucide-react';

interface QRHandoffModalProps {
  bookmark: Bookmark | null;
  onClose: () => void;
}

export const QRHandoffModal: React.FC<QRHandoffModalProps> = ({ bookmark, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!bookmark) return;
    navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageUrl = bookmark
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(bookmark.url)}&color=ffffff&bgcolor=242529&margin=1`
    : '';

  return (
    <AnimatePresence>
      {bookmark && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20, rotateX: 10 }}
            transition={{ type: 'spring', stiffness: 450, damping: 26 }}
            className="w-full max-w-sm bg-[#181A1C] rounded-[24px] p-7 shadow-2xl text-center relative text-[#FAFCFE] border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#242529] text-[#8A8F98] hover:text-[#FAFCFE] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>

            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-2xl bg-[#242529] flex items-center justify-center text-[#53FFA9] mx-auto mb-3 shadow-sm"
            >
              <Smartphone className="w-6 h-6" />
            </motion.div>

            <h3 className="font-caption font-bold text-lg text-[#FAFCFE]">Mobile Handoff</h3>
            <p className="text-xs text-[#8A8F98] mt-1 mb-5">
              Scan with your phone camera to read this bookmark on mobile instantly.
            </p>

            {/* QR Display Frame */}
            <motion.div
              whileHover={{ scale: 1.04, rotate: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="p-4 bg-[#242529] rounded-2xl inline-block shadow-inner mb-4 border border-white/5"
            >
              <img
                src={qrImageUrl}
                alt="Mobile QR Code"
                className="w-48 h-48 rounded-xl object-contain mx-auto"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </motion.div>

            {/* Link metadata badge */}
            <div className="p-4 bg-[#242529] rounded-2xl mb-5 text-left border border-white/5">
              <p className="font-caption font-bold text-xs text-[#FAFCFE] truncate">{bookmark.title}</p>
              <p className="text-xs font-mono text-[#97C8EC] truncate mt-0.5">{bookmark.domain}</p>
            </div>

            {/* Copy & External Open buttons */}
            <div className="flex items-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[#242529] text-[#FAFCFE] text-xs font-caption font-semibold transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#53FFA9]" /> : <Copy className="w-3.5 h-3.5 text-[#97C8EC]" />}
                <span>{copied ? 'Copied Link!' : 'Copy Clean URL'}</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10.5 h-10.5 rounded-full bg-[#D3FF69] text-[#000203] flex items-center justify-center font-bold text-xs shadow-sm shrink-0"
              >
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              </motion.a>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
