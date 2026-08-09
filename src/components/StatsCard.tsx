import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  color: 'purple' | 'peach' | 'green' | 'blue' | 'red';
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendDirection,
  color,
  icon: Icon,
  onClick,
  isActive = false
}) => {
  // Pastel styles based on colors
  const colorMap = {
    purple: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/20',
      border: 'border-indigo-100 dark:border-indigo-900/30',
      activeRing: 'ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/5 border-transparent',
      text: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
      tag: 'text-indigo-800 bg-indigo-100/60 dark:text-indigo-300 dark:bg-indigo-900/30'
    },
    peach: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-100 dark:border-amber-900/30',
      activeRing: 'ring-2 ring-amber-500 shadow-lg shadow-amber-500/10 dark:shadow-amber-500/5 border-transparent',
      text: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      tag: 'text-amber-800 bg-amber-100/60 dark:text-amber-300 dark:bg-amber-900/30'
    },
    green: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-100 dark:border-emerald-900/30',
      activeRing: 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-500/5 border-transparent',
      text: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      tag: 'text-emerald-800 bg-emerald-100/60 dark:text-emerald-300 dark:bg-emerald-900/30'
    },
    blue: {
      bg: 'bg-sky-50 dark:bg-sky-950/20',
      border: 'border-sky-100 dark:border-sky-900/30',
      activeRing: 'ring-2 ring-sky-500 shadow-lg shadow-sky-500/10 dark:shadow-sky-500/5 border-transparent',
      text: 'text-sky-600 dark:text-sky-400',
      iconBg: 'bg-sky-100 dark:bg-sky-900/40',
      tag: 'text-sky-800 bg-sky-100/60 dark:text-sky-300 dark:bg-sky-900/30'
    },
    red: {
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-100 dark:border-rose-900/30',
      activeRing: 'ring-2 ring-rose-500 shadow-lg shadow-rose-500/10 dark:shadow-rose-500/5 border-transparent',
      text: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-100/80 dark:bg-rose-900/40',
      tag: 'text-rose-800 bg-rose-100/60 dark:text-rose-300 dark:bg-rose-900/30'
    }
  };

  const currentStyles = colorMap[color];

  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-2xl border ${currentStyles.bg} ${isActive ? currentStyles.activeRing : currentStyles.border} flex flex-col justify-between h-40 transition-all duration-300 select-none
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md active:scale-95' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`}>
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${currentStyles.iconBg}`}>
          <Icon className={`w-5 h-5 ${currentStyles.text}`} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold font-sans tracking-tight text-slate-900 dark:text-slate-100">
          {value}
        </span>
        {trend && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5 ${
            trendDirection === 'up' 
              ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/30' 
              : trendDirection === 'down'
                ? 'text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-950/30'
                : 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800/40'
          }`}>
            {trendDirection === 'up' && '↗'}
            {trendDirection === 'down' && '↘'}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span>{subtitle}</span>
        <span className="font-semibold text-slate-400">Live updates</span>
      </div>
    </div>
  );
};
