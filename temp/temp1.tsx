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
        <div className="space-y-4 animate-in fade-in duration-300">
            {/* Top 4 KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Total Overdue Cases */}
                <div className="group relative bg-white/95 dark:bg-dark-bg-secondary/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-rose-300 dark:hover:border-rose-900/60 rounded-2xl p-5 flex flex-col justify-between h-[158px] shadow-xs hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between pr-12">
                        <span className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                            Total Overdue Cases
                        </span>
                    </div>
                    <CornerIconIsland icon={CalendarClock} accentColor={colors.chartRed} />
                    <div className="flex items-end justify-between mt-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight font-sans">
                            {totalCount}
                        </span>
                        <div className="w-28 h-12 shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                                <path
                                    d="M 0 25 Q 25 10, 50 20 T 100 8 L 100 30 L 0 30 Z"
                                    fill={withOpacity(colors.chartRed, 0.16)}
                                />
                                <path
                                    d="M 0 25 Q 25 10, 50 20 T 100 8"
                                    fill="none"
                                    stroke={colors.chartRed}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] sm:text-xs text-slate-400 font-medium">
                        <span>Critical SLA Breaches</span>
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/70 px-3 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-900/60 shadow-xs">
                            Immediate Action
                        </span>
                    </div>
                </div>

                {/* Urgent Priority Overdue */}
                <div className="group relative bg-white/95 dark:bg-dark-bg-secondary/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-300 dark:hover:border-amber-900/60 rounded-2xl p-5 flex flex-col justify-between h-[158px] shadow-xs hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between pr-12">
                        <span className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                            Urgent Priority Overdue
                        </span>
                    </div>
                    <CornerIconIsland icon={AlarmClock} accentColor={colors.chartAmber} />
                    <div className="flex items-end justify-between mt-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight font-sans">
                            {urgentOverdue.length}
                        </span>
                        <div className="w-28 h-12 shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                                <path
                                    d="M 0 28 Q 25 18, 50 8 T 100 12 L 100 30 L 0 30 Z"
                                    fill={withOpacity(colors.chartAmber, 0.16)}
                                />
                                <path
                                    d="M 0 28 Q 25 18, 50 8 T 100 12"
                                    fill="none"
                                    stroke={colors.chartAmber}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] sm:text-xs text-slate-400 font-medium">
                        <span>24h Turnaround Window</span>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-3 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-900/60 shadow-xs">
                            High Priority
                        </span>
                    </div>
                </div>

                {/* Avg Resolution Lag */}
                <div className="group relative bg-white/95 dark:bg-dark-bg-secondary/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between h-[158px] shadow-xs hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between pr-12">
                        <span className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                            Average Overdue Lag
                        </span>
                    </div>
                    <CornerIconIsland icon={Hourglass} accentColor={colors.chartPurple} />
                    <div className="flex items-end justify-between mt-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
                            4.2d
                        </span>
                        <div className="w-28 h-12 shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                                <path
                                    d="M 0 20 Q 30 25, 60 10 T 100 15 L 100 30 L 0 30 Z"
                                    fill={withOpacity(colors.chartPurple, 0.16)}
                                />
                                <path
                                    d="M 0 20 Q 30 25, 60 10 T 100 15"
                                    fill="none"
                                    stroke={colors.chartPurple}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] sm:text-xs text-slate-400 font-medium">
                        <span>Target is &lt; 24h</span>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-0.5 rounded-full shadow-xs">
                            SLA Goal
                        </span>
                    </div>
                </div>

                {/* Staff Risk Exposure */}
                <div className="group relative bg-white/95 dark:bg-dark-bg-secondary/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-optum-orange/50 dark:hover:border-optum-orange/50 rounded-2xl p-5 flex flex-col justify-between h-[158px] shadow-xs hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between pr-12">
                        <span className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                            Staff Risk Exposure
                        </span>
                    </div>
                    <CornerIconIsland icon={BarChart3} accentColor={colors.chartGreen} />
                    <div className="flex items-end justify-between mt-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-optum-orange dark:text-optum-orange tracking-tight font-sans">
                            {coordinatorBreakdown.filter((c) => c.riskScore > 30).length}{' '}
                            <span className="text-xl font-bold text-slate-400">staff</span>
                        </span>
                        <div className="w-28 h-12 shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                                <path
                                    d="M 0 22 Q 25 15, 50 18 T 100 5 L 100 30 L 0 30 Z"
                                    fill={withOpacity(colors.chartGreen, 0.16)}
                                />
                                <path
                                    d="M 0 22 Q 25 15, 50 18 T 100 5"
                                    fill="none"
                                    stroke={colors.chartGreen}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] sm:text-xs text-slate-400 font-medium">
                        <span>High Caseload Pressure</span>
                        <span className="text-[10px] font-bold text-optum-orange bg-optum-dawn/40 dark:bg-optum-orange/20 px-3 py-0.5 rounded-full border border-optum-dawn dark:border-optum-orange/40 shadow-xs">
                            Staff Alert
                        </span>
                    </div>
                </div>
            </div>

            {/* Middle Section: Visual Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Plot 1: Overdue Duration Pillar Chart with Capsule Track & Diagonal Hatches */}
                <div className="bg-white/95 dark:bg-dark-bg-secondary/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 lg:col-span-2 flex flex-col justify-between shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Overdue Duration Analytics
                                </h3>
                                <span className="px-3 py-0.5 bg-optum-dawn/40 dark:bg-optum-orange/20 text-optum-orange text-[10px] font-extrabold rounded-full border border-optum-dawn dark:border-optum-orange/40">
                                    Weekly SLA
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Distribution of overdue cases by latency severity</p>
                        </div>

                        {/* Pill Legends */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                                <span
                                    className="w-3 h-3 rounded-xs border border-slate-400/60 dark:border-slate-600"
                                    style={{
                                        backgroundImage: `repeating-linear-gradient(45deg, ${withOpacity(colors.lightFill, 0.45)} 0, ${withOpacity(colors.lightFill, 0.45)} 2px, transparent 0, transparent 6px)`,
                                    }}
                                />
                                Historical
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-optum-orange px-3.5 py-1.5 rounded-full bg-optum-dawn/40 dark:bg-optum-orange/20 border border-optum-dawn dark:border-optum-orange/40 shadow-xs">
                                <span className="w-2.5 h-2.5 rounded-full bg-optum-orange animate-pulse" />
                                Today (Current SLA)
                            </span>
                        </div>
                    </div>

                    {/* Pillar Chart with Track Capsules & Diagonal Hatches */}
                    <div className="relative py-4 px-2 my-1">
                        <div className="absolute inset-x-4 top-4 bottom-10 flex flex-col justify-between pointer-events-none opacity-40">
                            <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full flex items-center justify-between text-[9px] font-mono text-slate-400">
                                <span>10 cases</span>
                            </div>
                            <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full flex items-center justify-between text-[9px] font-mono text-slate-400">
                                <span>5 cases</span>
                            </div>
                            <div className="border-b border-slate-300 dark:border-slate-700 w-full flex items-center justify-between text-[9px] font-mono text-slate-400">
                                <span>0 cases</span>
                            </div>
                        </div>

                        <div className="relative max-w-xl mx-auto flex items-end justify-between gap-3 sm:gap-6 h-52 pt-4 pb-2 z-10">
                            {[
                                { day: 'Mon', height: '45%', count: 4, isToday: false },
                                { day: 'Tue', height: '65%', count: 6, isToday: false },
                                { day: 'Wed', height: '92%', count: 9, isToday: true },
                                { day: 'Thu', height: '55%', count: 5, isToday: false },
                                { day: 'Fri', height: '75%', count: 7, isToday: false },
                                { day: 'Sat', height: '35%', count: 3, isToday: false },
                                { day: 'Sun', height: '22%', count: 2, isToday: false },
                            ].map((bar, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center gap-2 group cursor-pointer h-full justify-end flex-1 max-w-[56px]"
                                >
                                    <div
                                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-all duration-200 ${bar.isToday
                                                ? 'bg-optum-orange text-white shadow-xs scale-105'
                                                : 'opacity-0 group-hover:opacity-100 bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-200 shadow-xs translate-y-1 group-hover:translate-y-0'
                                            }`}
                                    >
                                        {bar.count}
                                    </div>

                                    {/* Outer Pillar Capsule Track */}
                                    <div className="relative w-full h-[148px] rounded-full bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 p-1 flex flex-col justify-end">
                                        {bar.isToday ? (
                                            <div
                                                className="w-full rounded-full bg-optum-orange ring-2 ring-optum-dawn/50 transition-all duration-300 group-hover:scale-105 relative flex items-center justify-center shadow-xs"
                                                style={{ height: bar.height }}
                                            >
                                                <div className="w-2 h-2 rounded-full bg-white/90 shadow-xs animate-ping absolute top-2" />
                                            </div>
                                        ) : (
                                            <div
                                                className="w-full rounded-full border border-slate-300/80 dark:border-slate-700/80 transition-all duration-300 group-hover:scale-105 group-hover:border-optum-orange dark:group-hover:border-optum-orange"
                                                style={{
                                                    height: bar.height,
                                                    backgroundColor: withOpacity(colors.lightFill, 0.6),
                                                    backgroundImage: `repeating-linear-gradient(45deg, ${withOpacity(colors.lightFill, 0.35)} 0, ${withOpacity(colors.lightFill, 0.35)} 2.5px, transparent 0, transparent 7.5px)`,
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span
                                            className={`text-xs font-bold transition-colors ${bar.isToday
                                                    ? 'text-optum-orange font-extrabold'
                                                    : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                                                }`}
                                        >
                                            {bar.day}
                                        </span>
                                        {bar.isToday && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-optum-orange mt-0.5" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 font-medium">
                        <span>
                            Peak latency day:{' '}
                            <strong className="text-slate-800 dark:text-slate-200">Wednesday (9 Overdue Cases)</strong>
                        </span>
                        <span className="text-optum-orange font-bold inline-flex items-center gap-1">
                            Live SLA Engine <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>

                {/* Plot 2: Circular Risk Severity & Segmented Meter */}
                <div className="bg-white/95 dark:bg-dark-bg-secondary/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    SLA Risk Severity
                                </h3>
                                <span className="flex h-2.5 w-2.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Categorized priority exposure matrix</p>
                        </div>
                        <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 shadow-xs">
                            Live Matrix
                        </span>
                    </div>

                    {/* Central Donut Hub */}
                    <div className="flex flex-col items-center justify-center my-2 relative">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-xs">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="none"
                                    stroke={colors.lightFill}
                                    strokeWidth="10"
                                    className="dark:stroke-slate-800/80"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="none"
                                    stroke={colors.chartRed}
                                    strokeWidth="10"
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
                                    strokeWidth="10"
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
                                    strokeWidth="10"
                                    strokeDasharray="238"
                                    strokeDashoffset="215"
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                />
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-0.5 shadow-xs">
                                    <Target className="w-4 h-4 text-status-danger" />
                                </div>
                                <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight font-sans">
                                    {totalCount}
                                </span>
                                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Total Cases</span>
                            </div>
                        </div>

                        {/* Segmented Risk Meter */}
                        <div className="w-full mt-2 mb-3">
                            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden p-0.5 gap-0.5 shadow-inner">
                                <div
                                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                                    style={{ width: `${urgentPct}%` }}
                                    title="Urgent Risk Share"
                                />
                                <div
                                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                                    style={{ width: `${highPct}%` }}
                                    title="High Priority Share"
                                />
                                <div
                                    className="h-full bg-optum-orange rounded-full transition-all duration-300"
                                    style={{ width: `${standardPct}%` }}
                                    title="Standard Share"
                                />
                            </div>
                        </div>

                        {/* 3 Pill Severity Cards */}
                        <div className="w-full grid grid-cols-3 gap-2.5 text-center">
                            <div className="p-3 bg-rose-50/80 dark:bg-rose-950/40 rounded-2xl border border-rose-200/60 dark:border-rose-900/50 flex flex-col items-center justify-between hover:scale-[1.02] transition-transform shadow-xs">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center mb-1 shadow-xs shadow-rose-500/20">
                                    <Megaphone className="w-4 h-4 text-status-danger" />
                                </div>
                                <p className="text-[10px] font-extrabold uppercase text-rose-600 dark:text-rose-400">Urgent</p>
                                <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{urgentOverdue.length}</p>
                                <span className="text-[9px] font-bold text-rose-600/80 dark:text-rose-400/80">24h SLA</span>
                            </div>

                            <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200/60 dark:border-amber-900/50 flex flex-col items-center justify-between hover:scale-[1.02] transition-transform shadow-xs">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center mb-1 shadow-xs shadow-amber-500/20">
                                    <Bell className="w-4 h-4 text-status-warning" />
                                </div>
                                <p className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">High</p>
                                <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{highOverdue.length}</p>
                                <span className="text-[9px] font-bold text-amber-600/80 dark:text-amber-400/80">48h SLA</span>
                            </div>

                            <div className="p-3 bg-optum-dawn/40 dark:bg-optum-orange/20 rounded-2xl border border-optum-dawn/60 dark:border-optum-orange/40 flex flex-col items-center justify-between hover:scale-[1.02] transition-transform shadow-xs">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center mb-1 shadow-xs">
                                    <ShieldCheck className="w-4 h-4 text-status-info" />
                                </div>
                                <p className="text-[10px] font-extrabold uppercase text-optum-orange dark:text-optum-orange">Standard</p>
                                <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{standardOverdueCount}</p>
                                <span className="text-[9px] font-bold text-optum-orange/80 dark:text-optum-orange/80">Normal</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                            <span className="w-4 h-4 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-status-info" />
                            </span>
                            Triage Ratio
                        </span>
                        <span className="text-optum-orange dark:text-optum-orange font-bold">Auto-Categorized</span>
                    </div>
                </div>
            </div>

            {/* Staff Exposure Radar & Interactive Queue */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Staff Workload Pressure Gauges */}
                <div className="bg-white/95 dark:bg-dark-bg-secondary/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Coordinator Exposure
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">Filter queue by coordinator</p>
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-400 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                            Risk Ratio
                        </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[380px] pr-2">
                        {coordinatorBreakdown.map((coord) => (
                            <div
                                key={coord.coordinatorId}
                                onClick={() =>
                                    setSelectedCoordFilter(selectedCoordFilter === coord.coordinatorId ? null : coord.coordinatorId)
                                }
                                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${selectedCoordFilter === coord.coordinatorId
                                        ? 'bg-optum-dawn/40 dark:bg-optum-orange/20 border-optum-orange ring-2 ring-optum-dawn/20'
                                        : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 hover:border-optum-dawn dark:hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2.5">
                                        <CoordinatorAvatar
                                            name={coord.name}
                                            size="sm"
                                            className="border-optum-dawn/70 dark:border-optum-orange/60"
                                        />
                                        <div>
                                            <p className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                                {coord.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{coord.activeCount} active cases</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full ${coord.riskScore > 35
                                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                                                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                                            }`}
                                    >
                                        {coord.overdueCount} overdue
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${coord.riskScore > 35 ? 'bg-rose-500' : 'bg-optum-orange'
                                            }`}
                                        style={{ width: `${Math.min(coord.riskScore, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedCoordFilter && (
                        <button
                            onClick={() => setSelectedCoordFilter(null)}
                            className="mt-3.5 w-full py-2.5 px-4 text-center text-xs font-extrabold text-optum-orange bg-optum-dawn/40 dark:bg-optum-orange/20 rounded-full hover:bg-optum-dawn/60 dark:hover:bg-optum-orange/30 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                        >
                            <X className="w-3.5 h-3.5" /> Clear Coordinator Filter
                        </button>
                    )}
                </div>

                {/* Priority Overdue Queue Table */}
                <div className="bg-white/95 dark:bg-dark-bg-secondary/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 lg:col-span-2 flex flex-col shadow-xs max-h-[480px]">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Active Overdue Resolution Queue
                                </h3>
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Click any case to inspect, reassign or snooze SLA</p>
                        </div>
                        <span className="text-xs font-extrabold px-3.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 shadow-xs">
                            {displayedOverdue.length} cases
                        </span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80 overflow-y-auto flex-1 pr-2">
                        {displayedOverdue.length > 0 ? (
                            displayedOverdue.map((ref) => {
                                const daysOver = getDaysOverdue(ref.dueDate);
                                return (
                                    <div
                                        key={ref.referralId}
                                        onClick={() => onSelectReferral(ref)}
                                        className="py-3 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/60 px-3.5 rounded-2xl transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                                {ref.memberName
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-optum-orange transition-colors">
                                                        {ref.memberName}
                                                    </p>
                                                    <span className="text-[10px] font-mono text-slate-400 font-bold">({ref.referralId})</span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    {ref.referralType.replace(/([A-Z])/g, ' $1').trim()} •{' '}
                                                    <strong className="text-slate-700 dark:text-slate-300">
                                                        {getCoordinatorName(ref.assignedTo)}
                                                    </strong>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right flex items-center gap-3">
                                            <div>
                                                <span className="text-xs sm:text-[13px] font-extrabold text-rose-600 dark:text-rose-400 block">
                                                    {daysOver}d Overdue
                                                </span>
                                                <span className="text-[10px] text-slate-400">Due: {ref.dueDate}</span>
                                            </div>
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs">
                                                <Wrench className="w-4 h-4 text-status-info" />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-12 text-center text-xs text-slate-400">
                                <span className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                                    <PartyPopper className="w-4 h-4 text-status-success" />
                                </span>
                                No overdue referrals matching the selected criteria.
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs text-slate-500 font-medium">
                        <span>Critical escalation SLA active</span>
                        <span className="text-xs font-bold text-optum-orange dark:text-optum-orange">Auto-Refreshes Daily</span>
                    </div>
                </div>
            </div>
        </div>
    );
};