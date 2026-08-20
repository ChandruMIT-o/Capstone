import React, { useState } from 'react';
import { 
  Layers, 
  GitMerge, 
  Camera, 
  Check,
  Copy,
  LayoutGrid
} from 'lucide-react';

interface ArchitectureHeaderProps {
  currentTab: 'application' | 'user-flow';
  onTabChange: (tab: 'application' | 'user-flow') => void;
  screenshotMode: boolean;
  onToggleScreenshotMode: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
}

export const ArchitectureHeader: React.FC<ArchitectureHeaderProps> = ({
  currentTab,
  onTabChange,
  screenshotMode,
  onToggleScreenshotMode,
  zoomLevel,
  onZoomChange,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}#/${currentTab}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If in screenshot mode, render nothing (no overlay button) - Esc key exits
  if (screenshotMode) {
    return null;
  }

  return (
    <header className="w-full bg-white border-b border-slate-200 px-5 py-2.5 flex items-center justify-between shadow-xs select-none">
      {/* Left: Project Branding & Meta */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-xs font-bold text-sm tracking-tight">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              Care Coordination Referral Hub
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              UHG Optum Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            System Design Specification & Closed-Loop Workflow
          </p>
        </div>
      </div>

      {/* Center: Two Main Architecture Navigation Tabs (URLs) */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
        <button
          id="tab-application-architecture"
          onClick={() => onTabChange('application')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
            currentTab === 'application'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span>1. Application Architecture</span>
          <span className="text-xs font-mono text-slate-400 font-normal">/application</span>
        </button>

        <button
          id="tab-user-flow-architecture"
          onClick={() => onTabChange('user-flow')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
            currentTab === 'user-flow'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitMerge className="w-4 h-4 text-blue-600" />
          <span>2. User Flow Architecture</span>
          <span className="text-xs font-mono text-slate-400 font-normal">/user-flow</span>
        </button>
      </div>

      {/* Right: Controls & Screenshot Tools */}
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="hidden xl:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
          <button
            onClick={() => onZoomChange(Math.max(0.75, Number((zoomLevel - 0.05).toFixed(2))))}
            className="px-2 py-0.5 text-slate-700 hover:bg-white rounded font-bold"
            title="Zoom Out"
          >
            -
          </button>
          <span className="px-2 text-xs font-mono font-semibold text-slate-600">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(1.2, Number((zoomLevel + 0.05).toFixed(2))))}
            className="px-2 py-0.5 text-slate-700 hover:bg-white rounded font-bold"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => onZoomChange(1)}
            className="px-2 py-0.5 text-xs text-slate-500 hover:text-slate-900 border-l border-slate-200 font-medium"
            title="Reset Zoom"
          >
            Reset
          </button>
        </div>

        {/* Copy Direct URL */}
        <button
          onClick={handleCopyUrl}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition"
          title="Copy Direct Link to this Diagram"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Share Link</span>
            </>
          )}
        </button>

        {/* Screenshot Clean Mode */}
        <button
          onClick={onToggleScreenshotMode}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition shadow-2xs"
          title="Screenshot Mode (Press ESC anytime to exit)"
        >
          <Camera className="w-4 h-4 text-blue-700" />
          <span>Screenshot Mode</span>
          <kbd className="px-1 py-0.2 text-[10px] font-mono bg-white border border-blue-200 rounded text-blue-700 font-normal">ESC</kbd>
        </button>
      </div>
    </header>
  );
};
