import React, { useState } from 'react';
import type { Referral, CareCoordinator } from '../types';
import { colors, withOpacity } from '../constants/colors';
import {
    Activity,
    AlarmClock,
    ArrowUpRight,
    BarChart3,
    Bell,
    CalendarClock,
    Hourglass,
    Megaphone,
    PartyPopper,
    ShieldCheck,
    Target,
    Wrench,
    X,
} from 'lucide-react';
import { CoordinatorAvatar } from '../shared/components/CoordinatorAvatar';
import { CornerIconIsland } from '../shared/components/CornerIconIsland';

interface OverdueDashboardViewProps {
    referrals: Referral[];
    coordinators: CareCoordinator[];
    today: Date;
    onSelectReferral: (referral: Referral) => void;
}

export const OverdueDashboardView: React.FC<OverdueDashboardViewProps> = ({
    referrals,
    coordinators,
    today,
    onSelectReferral,
}) => {
    const [selectedCoordFilter, setSelectedCoordFilter] = useState<string | null>(null);

    const isOverdue = (r: Referral) => {
        const due = new Date(r.dueDate);
        return today > due && r.status !== 'COMPLETED' && r.status !== 'CANCELLED';
    };

    const overdueReferrals = referrals.filter(isOverdue);

    // Calculate days overdue
    const getDaysOverdue = (dateStr: string) => {
        const due = new Date(dateStr);
        const diffTime = Math.abs(today.getTime() - due.getTime());
        return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };

    // Overdue by priority
    const urgentOverdue = overdueReferrals.filter((r) => r.priority === 'URGENT');
    const highOverdue = overdueReferrals.filter((r) => r.priority === 'HIGH');
    const mediumOverdue = overdueReferrals.filter((r) => r.priority === 'MEDIUM');
    const lowOverdue = overdueReferrals.filter((r) => r.priority === 'LOW');
    const standardOverdueCount = mediumOverdue.length + lowOverdue.length;

    // Overdue breakdown by coordinator
    const coordinatorBreakdown = coordinators
        .map((coord) => {
            const active = referrals.filter(
                (r) => r.assignedTo === coord.coordinatorId && r.status !== 'COMPLETED' && r.status !== 'CANCELLED'
            );
            const overdue = active.filter(isOverdue);
            const riskScore = active.length > 0 ? Math.round((overdue.length / active.length) * 100) : 0;
            return {
                ...coord,
                activeCount: active.length,
                overdueCount: overdue.length,
                riskScore,
            };
        })
        .sort((a, b) => b.overdueCount - a.overdueCount);

    // Filtered queue for table
    const displayedOverdue = overdueReferrals.filter((r) => {
        const matchesCoord = !selectedCoordFilter || r.assignedTo === selectedCoordFilter;
        return matchesCoord;
    });

    const getCoordinatorName = (id: string) => {
        return coordinators.find((c) => c.coordinatorId === id)?.name || id;
    };

    const totalCount = overdueReferrals.length;
    const urgentPct = totalCount > 0 ? (urgentOverdue.length / totalCount) * 100 : 0;
    const highPct = totalCount > 0 ? (highOverdue.length / totalCount) * 100 : 0;
    const standardPct = totalCount > 0 ? (standardOverdueCount / totalCount) * 100 : 0;

    return (
        <div className="space-y-5 transition-all duration-300 ease-out">
            {/* Top 4 KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Overdue Cases */}
                <div className="group relative bg-white dark:bg-dark-bg-secondary/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[160px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-rose-300 dark:hover:border-rose-900/60 transition-all duration-300">
                    <div className="flex items-start justify-between pr-10">
                        <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-300 tracking-tight">
                            Total Overdue Cases
                        </span>
                    </div>
                    <CornerIconIsland icon={CalendarClock} accentColor={colors.chartRed} />
                    <div className="flex items-end justify-between mt-2">
                        <span className="text-4xl font-black text-rose-600 dark:text-rose-400 tracking-tight font-sans">
                            {totalCount}
                        </span>
                        <div className="w-28 h-10 shrink-0 opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                                <path
                                    d="M 0 25 Q 25 10, 50 20 T 100 8 L 100 30 L 0 30 Z"
                                    fill={withOpacity(colors.chartRed, 0.12)}
                                />
                                <path
                                    d="M 0 25 Q 25 10, 50 20 T 100 8"
                                    fill="none"
                                    stroke={colors.chartRed}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
                        <span>Critical SLA Breaches</span>
                        <span className="font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/40">
                            Immediate Action
                        </span>
                    </div>
                </div>

                {/* Urgent Priority Overdue */}
                <div className="group relative bg-white dark:bg-dark-bg-secondary/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[160px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-amber-300 dark:hover:border-amber-900/60 transition-all duration-300">
                    <div className="flex items-start justify-between pr-10">
                        <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-300 tracking-tight">
                            Urgent Priority Overdue
                        </span>
                    </div>
                    <CornerIconIsland icon={AlarmClock} accentColor={colors.chartAmber} />
                    <div className="flex items-end justify-between mt-2">
                        <span className="text-4xl font-black text-amber-600 dark:text-amber-400 tracking-tight font-sans">
                            {urgentOverdue.length}
                        </span>
                        <div className="w-28 h-10 shrink-0 opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                                <path
                                    d="M 0 28 Q 25 18, 50 8 T 100 12 L 100 30 L 0 30 Z"
                                    fill={withOpacity(colors.chartAmber, 0.12)}
                                />
                                <path
                                    d="M 0 28 Q 25 18, 50 8 T 100 12"
                                    fill="none"
                                    stroke={colors.chartAmber}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
                        <span>24h Turnaround Window</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/40">
                            High Priority
                        </span>
                    </div>
                </div>

                {/* Avg Resolution Lag */}
                <div className="group relative bg-white dark:bg-dark-bg-secondary/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[160px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-start justify-between pr-10">
                        <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-300 tracking-tight">
                            Average Overdue Lag
                        </span>
                    </div>
                    <CornerIconIsland icon={Hourglass} accentColor={colors.chartPurple} />
                    <div className="flex items-end justify-between mt-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                            4.2d
                        </span>
                        <div className="w-28 h-10 shrink-0 opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                                <path
                                    d="M 0 20 Q 30 25, 60 10 T 100 15 L 100 30 L 0 30 Z"
                                    fill={withOpacity(colors.chartPurple, 0.12)}
                                />
                                <path
                                    d="M 0 20 Q 30 25, 60 10 T 100 15"
                                    fill="none"
                                    stroke={colors.chartPurple}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
                        <span>Target &lt; 24h</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
                            SLA Goal
                        </span>
                    </div>
                </div>

                {/* Staff Risk Exposure */}
                <div className="group relative bg-white dark:bg-dark-bg-secondary/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[160px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-optum-orange/40 transition-all duration-300">
                    <div className="flex items-start justify-between pr-10">
                        <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-300 tracking-tight">
                            Staff Risk Exposure
                        </span>
                    </div>
                    <CornerIconIsland icon={BarChart3} accentColor={colors.chartGreen} />
                    <div className="flex items-end justify-between mt-2">
                        <span className="text-4xl font-black text-optum-orange dark:text-optum-orange tracking-tight font-sans">
                            {coordinatorBreakdown.filter((c) => c.riskScore > 30).length} <span className="text-lg font-bold text-slate-400">staff</span>
                        </span>
                        <div className="w-28 h-10 shrink-0 opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                                <path
                                    d="M 0 22 Q 25 15, 50 18 T 100 5 L 100 30 L 0 30 Z"
                                    fill={withOpacity(colors.chartGreen, 0.12)}
                                />
                                <path
                                    d="M 0 22 Q 25 15, 50 18 T 100 5"
                                    fill="none"
                                    stroke={colors.chartGreen}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
                        <span>High Caseload Pressure</span>
                        <span className="font-semibold text-optum-orange dark:text-optum-orange bg-optum-dawn/30 dark:bg-optum-orange/15 px-2.5 py-0.5 rounded-full border border-optum-dawn/60 dark:border-optum-orange/30">
                            Staff Alert
                        </span>
                    </div>
                </div>
            </div>

            {/* Middle Section: Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Plot 1: Overdue Duration Analytics Bar Chart */}
                <div className="bg-white dark:bg-dark-bg-secondary/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 lg:col-span-2 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                    Overdue Duration Analytics
                                </h3>
                                <span className="px-2.5 py-0.5 bg-optum-dawn/30 dark:bg-optum-orange/15 text-optum-orange text-[10px] font-bold rounded-full border border-optum-dawn/60 dark:border-optum-orange/30">
                                    Weekly SLA
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Distribution of overdue cases by latency severity</p>
                        </div>

                        {/* Pill Legends */}
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                Historical
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-optum-orange px-3 py-1 rounded-full bg-optum-dawn/30 dark:bg-optum-orange/15 border border-optum-dawn/60 dark:border-optum-orange/30">
                                <span className="w-2 h-2 rounded-full bg-optum-orange animate-pulse" />
                                Today
                            </span>
                        </div>
                    </div>

                    {/* Bar Chart Container */}
                    <div className="relative pt-2 pb-2">
                        <div className="absolute inset-x-0 top-3 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
                            <div className="border-b border-dashed border-slate-200 dark:border-slate-700/80 w-full flex items-center justify-end text-[10px] font-mono text-slate-400">10 cases</div>
                            <div className="border-b border-dashed border-slate-200 dark:border-slate-700/80 w-full flex items-center justify-end text-[10px] font-mono text-slate-400">5 cases</div>
                            <div className="border-b border-slate-200 dark:border-slate-700/80 w-full flex items-center justify-end text-[10px] font-mono text-slate-400">0</div>
                        </div>

                        <div className="relative max-w-lg mx-auto flex items-end justify-between gap-3 sm:gap-6 h-48 z-10 px-2">
                            {[
                                { day: 'Mon', height: '40%', count: 4, isToday: false },
                                { day: 'Tue', height: '60%', count: 6, isToday: false },
                                { day: 'Wed', height: '90%', count: 9, isToday: true },
                                { day: 'Thu', height: '50%', count: 5, isToday: false },
                                { day: 'Fri', height: '70%', count: 7, isToday: false },
                                { day: 'Sat', height: '30%', count: 3, isToday: false },
                                { day: 'Sun', height: '20%', count: 2, isToday: false },
                            ].map((bar, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer h-full justify-end flex-1 max-w-[48px]">
                                    <div
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all duration-200 ${bar.isToday
                                                ? 'bg-optum-orange text-white shadow-xs'
                                                : 'opacity-0 group-hover:opacity-100 bg-slate-900 dark:bg-slate-700 text-white shadow-xs -translate-y-0.5 group-hover:translate-y-0'
                                            }`}
                                    >
                                        {bar.count}
                                    </div>

                                    <div className="relative w-full h-[130px] rounded-xl bg-slate-100/80 dark:bg-slate-800/40 p-1 flex flex-col justify-end overflow-hidden">
                                        {bar.isToday ? (
                                            <div
                                                className="w-full rounded-lg bg-optum-orange shadow-xs transition-all duration-500 group-hover:opacity-90 relative"
                                                style={{ height: bar.height }}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-xs animate-ping absolute top-2 left-1/2 -translate-x-1/2" />
                                            </div>
                                        ) : (
                                            <div
                                                className="w-full rounded-lg bg-slate-300/80 dark:bg-slate-700 transition-all duration-300 group-hover:bg-slate-400 dark:group-hover:bg-slate-600"
                                                style={{ height: bar.height }}
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span
                                            className={`text-xs font-semibold transition-colors duration-200 ${bar.isToday
                                                    ? 'text-optum-orange font-bold'
                                                    : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                                                }`}
                                        >
                                            {bar.day}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 font-medium">
                        <span>
                            Peak latency day: <strong className="text-slate-800 dark:text-slate-200">Wednesday (9 Overdue Cases)</strong>
                        </span>
                        <span className="text-optum-orange font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer">
                            Live SLA Engine <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>

                {/* Plot 2: Circular Risk Severity */}
                <div className="bg-white dark:bg-dark-bg-secondary/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                    SLA Risk Severity
                                </h3>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Categorized priority exposure matrix</p>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
                            Live
                        </span>
                    </div>

                    {/* Donut Graphic */}
                    <div className="flex flex-col items-center justify-center my-3 relative">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-slate-100 dark:text-slate-800"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="none"
                                    stroke={colors.chartRed}
                                    strokeWidth="8"
                                    strokeDasharray="238"
                                    strokeDashoffset="145"
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="none"
                                    stroke={colors.chartAmber}
                                    strokeWidth="8"
                                    strokeDasharray="238"
                                    strokeDashoffset="195"
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="none"
                                    stroke={colors.chartPurple}
                                    strokeWidth="8"
                                    strokeDasharray="238"
                                    strokeDashoffset="218"
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                />
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                                <Target className="w-4 h-4 text-rose-500 mb-0.5" />
                                <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight font-sans">
                                    {totalCount}
                                </span>
                                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total</span>
                            </div>
                        </div>

                        {/* Proportional Segmented Meter */}
                        <div className="w-full mt-3 mb-2">
                            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden gap-0.5">
                                <div
                                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                                    style={{ width: `${urgentPct}%` }}
                                />
                                <div
                                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                    style={{ width: `${highPct}%` }}
                                />
                                <div
                                    className="h-full bg-optum-orange rounded-full transition-all duration-500"
                                    style={{ width: `${standardPct}%` }}
                                />
                            </div>
                        </div>

                        {/* 3 Pill Cards */}
                        <div className="w-full grid grid-cols-3 gap-2 text-center mt-2">
                            <div className="p-2.5 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-100/80 dark:border-rose-900/30 flex flex-col items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors">
                                <Megaphone className="w-3.5 h-3.5 text-rose-500 mb-1" />
                                <p className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400">Urgent</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{urgentOverdue.length}</p>
                                <span className="text-[9px] text-slate-400">24h SLA</span>
                            </div>

                            <div className="p-2.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-100/80 dark:border-amber-900/30 flex flex-col items-center justify-between hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors">
                                <Bell className="w-3.5 h-3.5 text-amber-500 mb-1" />
                                <p className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">High</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{highOverdue.length}</p>
                                <span className="text-[9px] text-slate-400">48h SLA</span>
                            </div>

                            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors">
                                <ShieldCheck className="w-3.5 h-3.5 text-slate-500 mb-1" />
                                <p className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">Standard</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{standardOverdueCount}</p>
                                <span className="text-[9px] text-slate-400">Normal</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-slate-400" />
                            Triage Ratio
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 font-semibold">Auto-Categorized</span>
                    </div>
                </div>
            </div>

            {/* Staff Exposure Radar & Queue Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Coordinator Workload Filters */}
                <div className="bg-white dark:bg-dark-bg-secondary/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                    Coordinator Exposure
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Filter queue by coordinator</p>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                                Risk Ratio
                            </span>
                        </div>

                        <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
                            {coordinatorBreakdown.map((coord) => {
                                const isSelected = selectedCoordFilter === coord.coordinatorId;
                                return (
                                    <div
                                        key={coord.coordinatorId}
                                        onClick={() => setSelectedCoordFilter(isSelected ? null : coord.coordinatorId)}
                                        className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${isSelected
                                                ? 'bg-optum-dawn/20 dark:bg-optum-orange/15 border-optum-orange ring-1 ring-optum-orange/50 shadow-xs'
                                                : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2.5">
                                                <CoordinatorAvatar name={coord.name} size="sm" />
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                                                        {coord.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{coord.activeCount} active cases</p>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${coord.riskScore > 35
                                                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-900/40'
                                                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/40'
                                                    }`}
                                            >
                                                {coord.overdueCount} overdue
                                            </span>
                                        </div>

                                        <div className="w-full bg-slate-200/70 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${coord.riskScore > 35 ? 'bg-rose-500' : 'bg-optum-orange'
                                                    }`}
                                                style={{ width: `${Math.min(coord.riskScore, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {selectedCoordFilter && (
                        <button
                            onClick={() => setSelectedCoordFilter(null)}
                            className="mt-3 w-full py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-optum-orange bg-optum-dawn/30 dark:bg-optum-orange/15 rounded-xl hover:bg-optum-dawn/50 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" /> Clear Coordinator Filter
                        </button>
                    )}
                </div>

                {/* Priority Overdue Queue Table */}
                <div className="bg-white dark:bg-dark-bg-secondary/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 lg:col-span-2 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] min-h-[440px]">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                        Active Overdue Resolution Queue
                                    </h3>
                                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">Click any case to inspect or take action</p>
                            </div>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
                                {displayedOverdue.length} cases
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-y-auto max-h-[340px] pr-1">
                            {displayedOverdue.length > 0 ? (
                                displayedOverdue.map((ref) => {
                                    const daysOver = getDaysOverdue(ref.dueDate);
                                    return (
                                        <div
                                            key={ref.referralId}
                                            onClick={() => onSelectReferral(ref)}
                                            className="py-3 px-2 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/40 rounded-xl transition-all duration-150 cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-rose-100/80 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center shrink-0">
                                                    {ref.memberName
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-optum-orange transition-colors">
                                                            {ref.memberName}
                                                        </p>
                                                        <span className="text-[10px] font-mono text-slate-400">({ref.referralId})</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                                        {ref.referralType.replace(/([A-Z])/g, ' $1').trim()} •{' '}
                                                        <strong className="text-slate-700 dark:text-slate-300 font-medium">
                                                            {getCoordinatorName(ref.assignedTo)}
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right flex items-center gap-3">
                                                <div>
                                                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                                                        {daysOver}d Overdue
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">Due: {ref.dueDate}</span>
                                                </div>
                                                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
                                                    <Wrench className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-16 text-center text-xs text-slate-400">
                                    <PartyPopper className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                                    No overdue referrals matching the selected criteria.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
                        <span>Critical escalation SLA active</span>
                        <span className="font-semibold text-optum-orange">Auto-Refreshes Daily</span>
                    </div>
                </div>
            </div>
        </div>
    );
};