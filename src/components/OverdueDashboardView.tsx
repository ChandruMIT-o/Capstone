import React from 'react';
import type { Referral, CareCoordinator } from '../data/mockData';
import { 
  AlertOctagon, 
  Clock, 
  TrendingDown, 
  AlertTriangle, 
  UserCheck
} from 'lucide-react';

interface OverdueDashboardViewProps {
  referrals: Referral[];
  coordinators: CareCoordinator[];
  onSelectReferral: (referral: Referral) => void;
}

export const OverdueDashboardView: React.FC<OverdueDashboardViewProps> = ({
  referrals,
  coordinators,
  onSelectReferral
}) => {
  const getCoordinatorName = (id: string) => {
    return coordinators.find(c => c.coordinatorId === id)?.name || id;
  };
  const today = new Date('2026-08-10');

  const isOverdue = (r: Referral) => {
    const due = new Date(r.dueDate);
    return today > due && r.status !== 'COMPLETED' && r.status !== 'CANCELLED';
  };

  const overdueReferrals = referrals.filter(isOverdue);
  
  // Calculate oldest overdue
  const oldestOverdue = overdueReferrals.reduce((oldest: Referral | null, current) => {
    if (!oldest) return current;
    return new Date(current.dueDate) < new Date(oldest.dueDate) ? current : oldest;
  }, null);

  // Overdue breakdown by coordinator
  const coordinatorBreakdown = coordinators.map(coord => {
    const active = referrals.filter(r => r.assignedTo === coord.coordinatorId && r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
    const overdue = active.filter(isOverdue);
    return {
      ...coord,
      activeCount: active.length,
      overdueCount: overdue.length,
      ratio: active.length > 0 ? (overdue.length / active.length) * 100 : 0
    };
  }).sort((a, b) => b.overdueCount - a.overdueCount);

  // Overdue breakdown by type
  const typeBreakdown = referrals.reduce((acc: Record<string, number>, r) => {
    if (isOverdue(r)) {
      acc[r.referralType] = (acc[r.referralType] || 0) + 1;
    }
    return acc;
  }, {});

  // Calculate days overdue helper
  const getDaysOverdue = (dateStr: string) => {
    const due = new Date(dateStr);
    const diffTime = Math.abs(today.getTime() - due.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Overdue */}
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-3xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              Total Overdue Cases
            </span>
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {overdueReferrals.length}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
              Active cases past target completion date
            </span>
          </div>
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 pulse-ring-red">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        {/* Oldest Overdue */}
        {oldestOverdue ? (
          <div 
            onClick={() => onSelectReferral(oldestOverdue)}
            className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-99 transition-all"
          >
            <div className="space-y-1 max-w-[70%]">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Oldest Overdue Case
              </span>
              <span className="text-base font-bold text-slate-950 dark:text-slate-100 truncate block">
                {oldestOverdue.memberName}
              </span>
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block">
                {getDaysOverdue(oldestOverdue.dueDate)} Days Overdue
              </span>
            </div>
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Oldest Overdue Case</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 block">No overdue referrals!</span>
            </div>
          </div>
        )}

        {/* High Urgency Overdue */}
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-3xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
              Urgent Overdue
            </span>
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {overdueReferrals.filter(r => r.priority === 'URGENT' || r.priority === 'HIGH').length}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
              High / Urgent priority overdue cases
            </span>
          </div>
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Breakdown & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Overdue breakdown per Coordinator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-slate-400" />
            Overdue Cases by Care Coordinator
          </h3>
          <div className="space-y-4">
            {coordinatorBreakdown.map((coord) => (
              <div key={coord.coordinatorId} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <img 
                      src={coord.avatar} 
                      alt={coord.name} 
                      className="w-7 h-7 rounded-lg object-cover" 
                    />
                    <span className="text-slate-800 dark:text-slate-200">{coord.name}</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400">
                    <strong className="text-rose-500 font-semibold">{coord.overdueCount}</strong> / {coord.activeCount} active
                  </span>
                </div>
                {/* Visual Progress bar */}
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(coord.ratio, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Breakdown by Type */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-slate-400" />
            Overdue Breakdown by Referral Category
          </h3>
          
          {Object.keys(typeBreakdown).length > 0 ? (
            <div className="space-y-3.5">
              {Object.entries(typeBreakdown).map(([type, count]) => {
                const totalTypeCount = referrals.filter(r => r.referralType === type).length;
                const ratio = Math.round((count / overdueReferrals.length) * 100);
                
                return (
                  <div key={type} className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-2.5 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {type.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Total {totalTypeCount} in system
                      </p>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <span className="text-sm font-bold text-rose-500">
                          {count} Overdue
                        </span>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {ratio}% of total overdue
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">No overdue categories detected!</p>
          )}
        </div>
      </div>

      {/* List of current overdue referrals */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3.5">
          Active Overdue Queue
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {overdueReferrals.length > 0 ? (
            overdueReferrals.map(ref => (
              <div 
                key={ref.referralId}
                onClick={() => onSelectReferral(ref)}
                className="py-3 flex justify-between items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{ref.memberName}</span>
                    <span className="text-xs text-slate-400 font-mono">({ref.referralId})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {ref.referralType.replace(/([A-Z])/g, ' $1').trim()} • Assigned to {getCoordinatorName(ref.assignedTo)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {getDaysOverdue(ref.dueDate)} days overdue
                  </span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Due: {ref.dueDate}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">All active cases are currently on track!</p>
          )}
        </div>
      </div>
    </div>
  );
};
