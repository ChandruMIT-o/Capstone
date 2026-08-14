import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  color: 'purple' | 'peach' | 'green' | 'blue' | 'red';
  icon?: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  color,
  onClick,
  isActive = false
}) => {
  const chartConfigs = {
    red: {
      path: "M 0 25 C 20 28, 40 18, 60 15 C 80 12, 100 24, 120 18 C 130 15, 140 8, 150 14 L 150 35 L 0 35 Z",
      line: "M 0 25 C 20 28, 40 18, 60 15 C 80 12, 100 24, 120 18 C 130 15, 140 8, 150 14",
      stroke: "#F43F5E",
      fill: "url(#redGradient)",
      gradientId: "redGradient",
      startColor: "#F43F5E",
      activeRing: "ring-2 ring-rose-500/80 border-rose-500"
    },
    purple: {
      path: "M 0 28 C 25 15, 50 26, 75 12 C 100 10, 125 22, 150 6 L 150 35 L 0 35 Z",
      line: "M 0 28 C 25 15, 50 26, 75 12 C 100 10, 125 22, 150 6",
      stroke: "#6366F1",
      fill: "url(#blueGradient)",
      gradientId: "blueGradient",
      startColor: "#6366F1",
      activeRing: "ring-2 ring-indigo-500/80 border-indigo-500"
    },
    peach: {
      path: "M 0 30 C 30 12, 60 28, 90 8 C 120 18, 135 10, 150 4 L 150 35 L 0 35 Z",
      line: "M 0 30 C 30 12, 60 28, 90 8 C 120 18, 135 10, 150 4",
      stroke: "#F59E0B",
      fill: "url(#amberGradient)",
      gradientId: "amberGradient",
      startColor: "#F59E0B",
      activeRing: "ring-2 ring-amber-500/80 border-amber-500"
    },
    green: {
      path: "M 0 26 C 25 22, 50 16, 75 18 C 100 10, 125 14, 150 4 L 150 35 L 0 35 Z",
      line: "M 0 26 C 25 22, 50 16, 75 18 C 100 10, 125 14, 150 4",
      stroke: "#10B981",
      fill: "url(#greenGradient)",
      gradientId: "greenGradient",
      startColor: "#10B981",
      activeRing: "ring-2 ring-emerald-500/80 border-emerald-500"
    },
    blue: {
      path: "M 0 24 C 30 14, 60 22, 90 12 C 120 16, 135 8, 150 6 L 150 35 L 0 35 Z",
      line: "M 0 24 C 30 14, 60 22, 90 12 C 120 16, 135 8, 150 6",
      stroke: "#0284C7",
      fill: "url(#skyGradient)",
      gradientId: "skyGradient",
      startColor: "#0284C7",
      activeRing: "ring-2 ring-sky-500/80 border-sky-500"
    }
  };

  const chart = chartConfigs[color] || chartConfigs.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white/95 dark:bg-[#101726]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[158px] transition-all duration-300 select-none relative overflow-hidden group shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]
        ${isActive ? chart.activeRing : 'hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:translate-y-[-2px]'}
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
      `}
    >
      {/* Subtle background glow effect on hover */}
      <div
        className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: chart.startColor }}
      />

      {/* Top Header: Title & Rounded-Full Arrow Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300">
          {title}
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-100/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 transition-all shadow-xs">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Middle Row: Big Number on Left, Smooth Wave Chart on Right */}
      <div className="flex items-end justify-between mt-1">
        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
          {value}
        </span>

        {/* Mini Smooth Wave Sparkline */}
        <div className="w-28 h-12 shrink-0">
          <svg viewBox="0 0 150 35" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={chart.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chart.startColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={chart.startColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={chart.path} fill={chart.fill} />
            <path d={chart.line} fill="none" stroke={chart.stroke} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Bottom Subtitle / Rounded-Full Filter Pill */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">
        <span className="truncate">{subtitle}</span>
        {isActive && (
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 px-3 py-0.5 rounded-full shadow-xs">
            Active Filter
          </span>
        )}
      </div>
    </div>
  );
};
