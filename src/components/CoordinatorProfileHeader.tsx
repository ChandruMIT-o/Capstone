import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2,
  Layers
} from 'lucide-react';
import type { Referral, CareCoordinator } from '../data/mockData';

interface CoordinatorProfileHeaderProps {
  coordinator: CareCoordinator;
  referrals: Referral[];
  activeCardFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export const CoordinatorProfileHeader: React.FC<CoordinatorProfileHeaderProps> = ({
  coordinator,
  referrals,
  activeCardFilter,
  onFilterChange
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Derive metrics for this coordinator
  const myCases = referrals.filter(r => r.assignedTo === coordinator.coordinatorId);
  const activeCases = myCases.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
  const today = new Date('2026-08-10');
  const overdueCases = activeCases.filter(r => new Date(r.dueDate) < today);
  const urgentCases = activeCases.filter(r => r.priority === 'URGENT');
  const completedCases = myCases.filter(r => r.status === 'COMPLETED');
  
  const slaComplianceRate = myCases.length > 0
    ? Math.round(((myCases.length - overdueCases.length) / myCases.length) * 100)
    : 100;

  return (
    <div className="ref-card p-5 mb-4 transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-white via-indigo-50/20 to-blue-50/30 dark:from-[#131B2E] dark:via-[#162036] dark:to-[#131B2E] shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] rounded-2xl">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        {/* Left: Avatar & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={coordinator.avatar}
              alt={coordinator.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-md"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center shadow-xs">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {coordinator.name}
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs">
                Active Coordinator
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>ID: <strong className="text-slate-700 dark:text-slate-200">{coordinator.coordinatorId}</strong></span>
              <span>•</span>
              <span>{coordinator.email}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick KPI Badges & Expand Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Active Cases Pill */}
          <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200/80 dark:border-slate-700 text-center shadow-xs">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Caseload</p>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">{activeCases.length}</p>
          </div>

          {/* SLA Rate Pill */}
          <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200/80 dark:border-slate-700 text-center shadow-xs">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">SLA Rate</p>
            <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{slaComplianceRate}%</p>
          </div>

          {/* Overdue Pill */}
          <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200/80 dark:border-slate-700 text-center shadow-xs">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">At Risk</p>
            <p className={`text-sm font-extrabold ${overdueCases.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {overdueCases.length}
            </p>
          </div>

          {/* Expand / Collapse Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1E1E24] hover:bg-black text-white text-xs sm:text-[13px] font-bold rounded-full transition-all shadow-md cursor-pointer active:scale-95 ml-1"
          >
            <span>{isExpanded ? 'Collapse Portfolio' : 'Expand Portfolio'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Portfolio Section */}
      {isExpanded && (
        <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3.5 animate-fade-in">
          {/* Caseload Breakdown */}
          <div className="p-4 bg-white/90 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs">
            <p className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-500" /> Caseload Urgency Distribution
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Urgent SLA</span>
                <strong className="text-rose-600 dark:text-rose-400 font-bold">{urgentCases.length} cases</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High Priority</span>
                <strong className="font-bold">{activeCases.filter(r => r.priority === 'HIGH').length} cases</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Routine / Medium</span>
                <strong className="font-bold">{activeCases.filter(r => r.priority === 'MEDIUM' || r.priority === 'LOW').length} cases</strong>
              </div>
            </div>
          </div>

          {/* Resolution Velocity */}
          <div className="p-4 bg-white/90 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs">
            <p className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Resolution Velocity
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Completed Referrals</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{completedCases.length} resolved</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>In-Progress Care</span>
                <strong className="font-bold">{myCases.filter(r => r.status === 'IN_PROGRESS').length} active</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Intake Pending</span>
                <strong className="font-bold">{myCases.filter(r => r.status === 'CREATED').length} unassigned</strong>
              </div>
            </div>
          </div>

          {/* Quick Filter Shortcuts */}
          <div className="p-4 bg-white/90 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/80 flex flex-col justify-between shadow-xs">
            <p className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-500" /> Quick Caseload Filter
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFilterChange(activeCardFilter === 'overdue' ? null : 'overdue')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeCardFilter === 'overdue' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100'}`}
              >
                Overdue ({overdueCases.length})
              </button>
              <button
                onClick={() => onFilterChange(activeCardFilter === 'urgent' ? null : 'urgent')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeCardFilter === 'urgent' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100'}`}
              >
                Urgent ({urgentCases.length})
              </button>
              <button
                onClick={() => onFilterChange(null)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeCardFilter === null ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
              >
                Show All ({myCases.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
