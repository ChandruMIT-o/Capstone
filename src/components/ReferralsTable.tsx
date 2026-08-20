import React, { useState } from 'react';
import type { Referral, CareCoordinator } from '../data/mockData';
import { CustomSelect } from './CustomSelect';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  User,
  AlertCircle,
  Filter,
  RotateCcw,
  Lock
} from 'lucide-react';

interface ReferralsTableProps {
  referrals: Referral[];
  coordinators: CareCoordinator[];
  onSelectReferral: (referral: Referral) => void;
  currentCoordinatorId?: string;
  userRole?: string;
}

export const ReferralsTable: React.FC<ReferralsTableProps> = ({
  referrals,
  coordinators,
  onSelectReferral,
  currentCoordinatorId,
  userRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [coordinatorFilter, setCoordinatorFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [timelineFilter, setTimelineFilter] = useState('ALL'); // ALL, TODAY, NEXT_7, NEXT_30, OVERDUE, CUSTOM
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [sortField, setSortField] = useState<keyof Referral>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const systemDateStr = '2026-08-10';
  const systemDate = new Date(systemDateStr);

  // Helper for overdue
  const isOverdue = (referral: Referral) => {
    const due = new Date(referral.dueDate);
    return systemDate > due && referral.status !== 'COMPLETED' && referral.status !== 'CANCELLED';
  };

  // Helper for formatted DOB and Age calculation
  const formatDobWithAge = (dobString: string): { formatted: string; age: string } => {
    if (!dobString) return { formatted: '—', age: '—' };
    const parts = dobString.split('-');
    if (parts.length !== 3) return { formatted: dobString, age: '—' };
    
    const birthDate = new Date(dobString);
    let age = systemDate.getFullYear() - birthDate.getFullYear();
    const m = systemDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && systemDate.getDate() < birthDate.getDate())) {
      age--;
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[birthDate.getMonth()] || parts[1];
    const day = parseInt(parts[2], 10);
    const year = parts[0];

    return {
      formatted: `${month} ${day}, ${year}`,
      age: `${age}y`
    };
  };

  // Filter options
  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'CREATED', label: 'Created', color: 'bg-sky-500' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-indigo-600' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-emerald-500' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-slate-400' }
  ];

  const priorityOptions = [
    { value: 'ALL', label: 'All Priorities' },
    { value: 'LOW', label: 'Low Priority', color: 'bg-slate-300' },
    { value: 'MEDIUM', label: 'Medium Priority', color: 'bg-sky-500' },
    { value: 'HIGH', label: 'High Priority', color: 'bg-amber-500' },
    { value: 'URGENT', label: 'Urgent Priority (24h SLA)', color: 'bg-rose-500' }
  ];

  const timelineOptions = [
    { value: 'ALL', label: 'All Due Dates' },
    { value: 'TODAY', label: 'Due Today (Aug 10)', color: 'bg-amber-500' },
    { value: 'NEXT_7', label: 'Next 7 Days', color: 'bg-blue-500' },
    { value: 'NEXT_30', label: 'Next 30 Days', color: 'bg-indigo-500' },
    { value: 'OVERDUE', label: 'Overdue Only', color: 'bg-rose-500' },
    { value: 'CUSTOM', label: 'Custom Date Range...', color: 'bg-purple-500' }
  ];

  const typeOptions = [
    { value: 'ALL', label: 'All Types' },
    { value: 'SpecialistVisit', label: 'Specialist Visit' },
    { value: 'BehavioralHealth', label: 'Behavioral Health' },
    { value: 'HomeHealth', label: 'Home Health' },
    { value: 'LabWork', label: 'Lab Work' },
    { value: 'PhysicalTherapy', label: 'Physical Therapy' },
    { value: 'SocialServices', label: 'Social Services' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'NutritionSupport', label: 'Nutrition Support' }
  ];

  const coordinatorOptions = [
    { value: 'ALL', label: 'All Coordinators' },
    ...coordinators.map(c => ({
      value: c.coordinatorId,
      label: c.name,
      avatar: c.avatar
    }))
  ];

  // Filtering Logic
  const filteredReferrals = referrals.filter((ref) => {
    const matchesSearch =
      ref.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.referralId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.referralType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ref.notes && ref.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || ref.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || ref.priority === priorityFilter;
    const matchesType = typeFilter === 'ALL' || ref.referralType === typeFilter;
    const matchesCoordinator = coordinatorFilter === 'ALL' || ref.assignedTo === coordinatorFilter;

    let matchesTimeline = true;
    const dueDate = new Date(ref.dueDate);

    if (timelineFilter === 'TODAY') {
      matchesTimeline = ref.dueDate === systemDateStr;
    } else if (timelineFilter === 'NEXT_7') {
      const next7 = new Date(systemDate);
      next7.setDate(next7.getDate() + 7);
      matchesTimeline = dueDate >= systemDate && dueDate <= next7;
    } else if (timelineFilter === 'NEXT_30') {
      const next30 = new Date(systemDate);
      next30.setDate(next30.getDate() + 30);
      matchesTimeline = dueDate >= systemDate && dueDate <= next30;
    } else if (timelineFilter === 'OVERDUE') {
      matchesTimeline = isOverdue(ref);
    } else if (timelineFilter === 'CUSTOM') {
      if (customStartDate && customEndDate) {
        matchesTimeline = ref.dueDate >= customStartDate && ref.dueDate <= customEndDate;
      } else if (customStartDate) {
        matchesTimeline = ref.dueDate >= customStartDate;
      } else if (customEndDate) {
        matchesTimeline = ref.dueDate <= customEndDate;
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesCoordinator && matchesTimeline;
  });

  // Sorting
  const sortedReferrals = [...filteredReferrals].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedReferrals.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReferrals = sortedReferrals.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof Referral) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getCoordinator = (id: string) => {
    return coordinators.find(c => c.coordinatorId === id);
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-amber-200 dark:bg-amber-900/60 text-slate-900 dark:text-slate-100 font-semibold px-0.5 rounded-full">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setTypeFilter('ALL');
    setCoordinatorFilter('ALL');
    setTimelineFilter('ALL');
    setCustomStartDate('');
    setCustomEndDate('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    typeFilter !== 'ALL' ||
    coordinatorFilter !== 'ALL' ||
    timelineFilter !== 'ALL';

  // Badge styles
  const priorityBadges = {
    LOW: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    MEDIUM: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    HIGH: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-bold',
    URGENT: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-extrabold shadow-xs'
  };

  const statusBadges = {
    CREATED: { bg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800', dot: 'bg-sky-500' },
    IN_PROGRESS: { bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', dot: 'bg-indigo-600' },
    COMPLETED: { bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
    CANCELLED: { bg: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700', dot: 'bg-slate-400' }
  };

  return (
    <div className="bg-white/95 dark:bg-[#101726]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] animate-slide-in">
      {/* Top Header & Rounded Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 mb-4 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Referral Directory
            </h2>
            <span className="px-3.5 py-1 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold rounded-full border border-indigo-200 dark:border-indigo-800/70 shadow-xs">
              {filteredReferrals.length} Cases
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time clinical intake coordination and SLA compliance tracking
          </p>
        </div>

        {/* Global Search Pill */}
        <div className="relative w-full md:w-84">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, ID, notes..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-10 py-2.5 bg-slate-50/90 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 text-xs sm:text-[13px] font-medium rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick-Filter Presets Pill Bar */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <button
          onClick={() => { resetFilters(); }}
          className={`px-4.5 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
            !hasActiveFilters
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md shadow-slate-900/10'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Cases
        </button>

        <button
          onClick={() => { setTimelineFilter('TODAY'); setCurrentPage(1); }}
          className={`px-4.5 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
            timelineFilter === 'TODAY'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Due Today
        </button>

        <button
          onClick={() => { setPriorityFilter('URGENT'); setCurrentPage(1); }}
          className={`px-4.5 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
            priorityFilter === 'URGENT'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Urgent 24h
        </button>

        <button
          onClick={() => { setTimelineFilter('OVERDUE'); setCurrentPage(1); }}
          className={`px-4.5 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
            timelineFilter === 'OVERDUE'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Overdue SLA
        </button>

        <button
          onClick={() => { setStatusFilter('IN_PROGRESS'); setCurrentPage(1); }}
          className={`px-4.5 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
            statusFilter === 'IN_PROGRESS'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          In Progress
        </button>

        <button
          onClick={() => { setStatusFilter('COMPLETED'); setCurrentPage(1); }}
          className={`px-4.5 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
            statusFilter === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Completed
        </button>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors ml-auto cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* Semantic Filter Capsules Bar */}
      <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 mb-4">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">
          <Filter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Advanced Criteria</span>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
              Status
            </label>
            <CustomSelect
              options={statusOptions}
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
              Priority
            </label>
            <CustomSelect
              options={priorityOptions}
              value={priorityFilter}
              onChange={(val) => { setPriorityFilter(val); setCurrentPage(1); }}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
              Type
            </label>
            <CustomSelect
              options={typeOptions}
              value={typeFilter}
              onChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
              Due Date SLA
            </label>
            <CustomSelect
              options={timelineOptions}
              value={timelineFilter}
              onChange={(val) => { setTimelineFilter(val); setCurrentPage(1); }}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
              Coordinator
            </label>
            <CustomSelect
              options={coordinatorOptions}
              value={coordinatorFilter}
              onChange={(val) => { setCoordinatorFilter(val); setCurrentPage(1); }}
            />
          </div>
        </div>

        {/* Custom Date Range Sub-Bar */}
        {timelineFilter === 'CUSTOM' && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center gap-3 animate-fade-in">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Custom SLA Range:</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => { setCustomStartDate(e.target.value); setCurrentPage(1); }}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => { setCustomEndDate(e.target.value); setCurrentPage(1); }}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto w-full rounded-2xl border border-slate-200/70 dark:border-slate-800/80">
        <table className="w-full min-w-[850px] table-fixed border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/90 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold tracking-wider uppercase">
              <th className="py-3 px-4 w-[11%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('referralId')}>
                <div className="flex items-center gap-1">
                  Case ID <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[24%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('memberName')}>
                <div className="flex items-center gap-1">
                  Patient Demographics <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[15%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('referralType')}>
                <div className="flex items-center gap-1">
                  Service Type <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[12%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('priority')}>
                <div className="flex items-center gap-1">
                  Priority <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[12%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">
                  Status <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[13%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('dueDate')}>
                <div className="flex items-center gap-1">
                  Target SLA <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 w-[13%]">Coordinator</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
            {paginatedReferrals.length > 0 ? (
              paginatedReferrals.map((ref) => {
                const overdue = isOverdue(ref);
                const currentStatus = statusBadges[ref.status];
                const coord = getCoordinator(ref.assignedTo);
                const dobInfo = formatDobWithAge(ref.memberDob);
                const isOwnCase = !currentCoordinatorId || ref.assignedTo === currentCoordinatorId;

                return (
                  <tr
                    key={ref.referralId}
                    onClick={() => onSelectReferral(ref)}
                    className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors duration-150 cursor-pointer text-slate-800 dark:text-slate-200"
                  >
                    {/* Case ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {highlightMatch(ref.referralId, searchTerm)}
                    </td>

                    {/* Patient Name + DOB + Age */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                          {ref.memberName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {highlightMatch(ref.memberName, searchTerm)}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>DOB: <strong className="font-semibold text-slate-700 dark:text-slate-300">{dobInfo.formatted}</strong></span>
                            <span className="px-2 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-full text-[10px]">
                              {dobInfo.age}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Service Type */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {highlightMatch(ref.referralType.replace(/([A-Z])/g, ' $1').trim(), searchTerm)}
                    </td>

                    {/* Priority Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider border font-bold ${priorityBadges[ref.priority]}`}>
                        {ref.priority}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${currentStatus.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
                        {ref.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Target SLA / Due Date */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className={`font-semibold ${overdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                          {ref.dueDate}
                        </span>
                        {overdue && (
                          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3 animate-bounce" /> Past SLA
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Assigned Coordinator + Edit Lock */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          {coord ? (
                            <img
                              src={coord.avatar}
                              alt={coord.name}
                              className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-300 dark:ring-slate-700"
                            />
                          ) : (
                            <User className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                            {coord?.name || ref.assignedTo}
                          </span>
                        </div>

                        {userRole === 'COORDINATOR' && !isOwnCase && (
                          <span title="Read-only: Assigned to other coordinator" className="p-1 text-slate-400 dark:text-slate-500">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  No referrals match the current search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar with Page Size Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-3.5 border-t border-slate-100 dark:border-slate-800/80 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
        {/* Left: Entries Counter & Page Size Selector */}
        <div className="flex items-center gap-3.5">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200 font-bold">{sortedReferrals.length > 0 ? startIndex + 1 : 0}</strong> to{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-bold">{Math.min(startIndex + itemsPerPage, sortedReferrals.length)}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-bold">{sortedReferrals.length}</strong> entries
          </span>

          <div className="flex items-center gap-2 pl-3.5 border-l border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer text-xs"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Right: Page Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all
              ${currentPage === 1
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-95 shadow-xs cursor-pointer'
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            if (totalPages > 6 && Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
              if (pageNum === 2 || pageNum === totalPages - 1) {
                return <span key={pageNum} className="px-1.5 text-slate-400 font-bold">...</span>;
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm font-bold rounded-full transition-all flex items-center justify-center cursor-pointer
                  ${currentPage === pageNum
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all
              ${currentPage === totalPages
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-95 shadow-xs cursor-pointer'
              }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
