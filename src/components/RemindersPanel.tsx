import React from 'react';
import type { Referral } from '../data/mockData';
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  HelpCircle,
  TrendingUp,
  MapPin,
  Stethoscope,
  Activity,
  HeartHandshake
} from 'lucide-react';

interface RemindersPanelProps {
  referrals: Referral[];
  onSelectReferral: (referral: Referral) => void;
}

export const RemindersPanel: React.FC<RemindersPanelProps> = ({
  referrals,
  onSelectReferral
}) => {
  // Let's filter some critical, actionable alerts
  // Overdue and Urgent/High priority items in CREATED or IN_PROGRESS state
  const isOverdue = (referral: Referral) => {
    const today = new Date('2026-08-10');
    const due = new Date(referral.dueDate);
    return today > due && referral.status !== 'COMPLETED' && referral.status !== 'CANCELLED';
  };

  const activeReferrals = referrals.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
  
  // Group alerts into "Today" (extremely pressing: overdue or URGENT/HIGH due within 2 days)
  // and "Yesterday / Earlier" (standard pending followups)
  const todayAlerts = activeReferrals.filter(r => {
    const overdue = isOverdue(r);
    const isUrgent = r.priority === 'URGENT' || r.priority === 'HIGH';
    return overdue || isUrgent;
  }).slice(0, 4);

  const standardAlerts = activeReferrals.filter(r => {
    const overdue = isOverdue(r);
    const isUrgent = r.priority === 'URGENT' || r.priority === 'HIGH';
    return !overdue && !isUrgent;
  }).slice(0, 3);

  // Helper to map referral types to custom icons and colors
  const typeDecorations: Record<string, { icon: any; color: string }> = {
    SpecialistVisit: { icon: Stethoscope, color: 'bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400' },
    BehavioralHealth: { icon: Activity, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' },
    HomeHealth: { icon: Clock, color: 'bg-sky-100 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400' },
    LabWork: { icon: TrendingUp, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' },
    PhysicalTherapy: { icon: Clock, color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' },
    SocialServices: { icon: HeartHandshake, color: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' },
    Transportation: { icon: MapPin, color: 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' },
    NutritionSupport: { icon: HelpCircle, color: 'bg-teal-100 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400' },
  };

  const getDecoration = (type: string) => {
    return typeDecorations[type] || { icon: HelpCircle, color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' };
  };

  return (
    <div className="w-full lg:w-80 bg-slate-50/40 dark:bg-slate-900/40 p-6 flex flex-col justify-between shrink-0 border-l border-slate-200/60 dark:border-slate-800/60 animate-slide-left">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Reminders</h2>
          <button className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl transition-all duration-200">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Today */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Today
          </h3>
          <div className="space-y-3">
            {todayAlerts.map((ref) => {
              const deco = getDecoration(ref.referralType);
              const Icon = deco.icon;
              const overdue = isOverdue(ref);
              
              return (
                <div 
                  key={ref.referralId}
                  onClick={() => onSelectReferral(ref)}
                  className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800/60 cursor-pointer hover:scale-[1.01] hover:shadow-sm active:scale-98 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deco.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                        {ref.memberName}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
                        {ref.referralType.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      overdue
                        ? 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20 animate-pulse'
                        : 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20'
                    }`}>
                      {overdue ? 'Overdue' : ref.priority}
                    </span>
                    <p className="text-[9px] text-slate-400 mt-1">Due {ref.dueDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Earlier Pending Tasks */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Earlier
          </h3>
          <div className="space-y-3">
            {standardAlerts.map((ref) => {
              const deco = getDecoration(ref.referralType);
              const Icon = deco.icon;
              
              return (
                <div 
                  key={ref.referralId}
                  onClick={() => onSelectReferral(ref)}
                  className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 opacity-85 hover:opacity-100 cursor-pointer hover:scale-[1.01] transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                        {ref.memberName}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {ref.referralType.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800">
                      On Track
                    </span>
                    <p className="text-[9px] text-slate-400 mt-1">Due {ref.dueDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SLA Metric Indicator Card */}
      <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 flex items-center gap-3.5">
        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
            SLA Met Target
          </h4>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-0.5">
            94% of referrals closed on time this month
          </p>
        </div>
      </div>
    </div>
  );
};
