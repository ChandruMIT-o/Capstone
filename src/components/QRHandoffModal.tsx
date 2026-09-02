import React from 'react';
import type { Bookmark } from '../types';
import { X, Smartphone, Copy, Check, ExternalLink } from 'lucide-react';

interface QRHandoffModalProps {
  bookmark: Bookmark | null;
  onClose: () => void;
}

export const QRHandoffModal: React.FC<QRHandoffModalProps> = ({ bookmark, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!bookmark) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(bookmark.url)}&color=ffffff&bgcolor=242529&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-pop-fade">
      <div className="w-full max-w-sm bg-[#181A1C] rounded-[24px] p-7 shadow-2xl text-center relative text-[#FAFCFE]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#242529] hover:bg-[#373B3E] text-[#8A8F98] hover:text-[#FAFCFE] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#242529] flex items-center justify-center text-[#53FFA9] mx-auto mb-3 shadow-sm">
          <Smartphone className="w-6 h-6" />
        </div>

        <h3 className="font-caption font-bold text-lg text-[#FAFCFE]">Mobile Handoff</h3>
        <p className="text-xs text-[#8A8F98] mt-1 mb-5">
          Scan with your phone camera to read this bookmark on mobile instantly.
        </p>

        {/* QR Display Frame */}
        <div className="p-4 bg-[#242529] rounded-2xl inline-block shadow-inner mb-4">
          <img
            src={qrImageUrl}
            alt="Mobile QR Code"
            className="w-48 h-48 rounded-xl object-contain mx-auto"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Link metadata badge */}
        <div className="p-4 bg-[#242529] rounded-2xl mb-5 text-left">
          <p className="font-caption font-bold text-xs text-[#FAFCFE] truncate">{bookmark.title}</p>
          <p className="text-xs font-mono text-[#97C8EC] truncate mt-0.5">{bookmark.domain}</p>
        </div>

        {/* Copy & External Open buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[#242529] hover:bg-[#373B3E] text-[#FAFCFE] text-xs font-caption font-semibold transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#53FFA9]" /> : <Copy className="w-3.5 h-3.5 text-[#97C8EC]" />}
            <span>{copied ? 'Copied Link!' : 'Copy Clean URL'}</span>
          </button>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10.5 h-10.5 rounded-full bg-[#D3FF69] text-[#000203] flex items-center justify-center font-bold text-xs hover:brightness-110 transition-all shadow-sm shrink-0"
          >
            <ExternalLink className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>

      </div>
    </div>
  );
};
