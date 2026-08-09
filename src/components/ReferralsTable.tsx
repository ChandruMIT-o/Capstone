import React, { useState } from 'react';
import type { Referral, CareCoordinator } from '../data/mockData';
import { CustomSelect } from './CustomSelect';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  User,
  AlertCircle
} from 'lucide-react';

interface ReferralsTableProps {
  referrals: Referral[];
  coordinators: CareCoordinator[];
  onSelectReferral: (referral: Referral) => void;
}

export const ReferralsTable: React.FC<ReferralsTableProps> = ({
  referrals,
  coordinators,
  onSelectReferral
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [coordinatorFilter, setCoordinatorFilter] = useState('ALL');
  const [overdueFilter, setOverdueFilter] = useState('ALL'); // ALL, OVERDUE, ACTIVE
  const [sortField, setSortField] = useState<keyof Referral>('createdDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Options lists for CustomSelect dropdowns
  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'CREATED', label: 'Created', color: 'bg-blue-400' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-indigo-400' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-emerald-400' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-slate-400' }
  ];

  const priorityOptions = [
    { value: 'ALL', label: 'All Priorities' },
    { value: 'LOW', label: 'Low', color: 'bg-slate-300' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-400' },
    { value: 'HIGH', label: 'High', color: 'bg-amber-400' },
    { value: 'URGENT', label: 'Urgent', color: 'bg-rose-500' }
  ];

  const coordinatorOptions = [
    { value: 'ALL', label: 'All Coordinators' },
    ...coordinators.map(c => ({
      value: c.coordinatorId,
      label: c.name,
      avatar: c.avatar
    }))
  ];

  const overdueOptions = [
    { value: 'ALL', label: 'All Due Statuses' },
    { value: 'OVERDUE', label: 'Overdue Only', color: 'bg-rose-500' },
    { value: 'ACTIVE', label: 'On Track Only', color: 'bg-emerald-500' }
  ];

  // Derive overdue logic
  const isOverdue = (referral: Referral) => {
    const today = new Date('2026-08-10'); // system date
    const due = new Date(referral.dueDate);
    return today > due && referral.status !== 'COMPLETED' && referral.status !== 'CANCELLED';
  };

  // Filter logic
  const filteredReferrals = referrals.filter((ref) => {
    const matchesSearch =
      ref.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.referralId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.referralType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ref.notes && ref.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || ref.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || ref.priority === priorityFilter;
    const matchesCoordinator = coordinatorFilter === 'ALL' || ref.assignedTo === coordinatorFilter;

    const overdueState = isOverdue(ref);
    const matchesOverdue =
      overdueFilter === 'ALL' ||
      (overdueFilter === 'OVERDUE' && overdueState) ||
      (overdueFilter === 'ACTIVE' && !overdueState);

    return matchesSearch && matchesStatus && matchesPriority && matchesCoordinator && matchesOverdue;
  });

  // Sort logic
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

  // Pagination logic
  const totalPages = Math.ceil(sortedReferrals.length / itemsPerPage);
  const paginatedReferrals = sortedReferrals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof Referral) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const getCoordinatorName = (id: string) => {
    return coordinators.find(c => c.coordinatorId === id)?.name || id;
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase()
            ? <mark key={i} className="bg-yellow-100 dark:bg-yellow-950/80 text-yellow-800 dark:text-yellow-200 px-0.5 rounded">{part}</mark>
            : part
        )}
      </span>
    );
  };

  // Helper styles for priority tags
  const priorityStyles = {
    LOW: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    MEDIUM: 'bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300',
    HIGH: 'bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300',
    URGENT: 'bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300'
  };

  // Helper styles for status dots
  const statusStyles = {
    CREATED: { dot: 'bg-blue-400', bg: 'bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' },
    IN_PROGRESS: { dot: 'bg-indigo-400', bg: 'bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' },
    COMPLETED: { dot: 'bg-emerald-400', bg: 'bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' },
    CANCELLED: { dot: 'bg-slate-400', bg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-slide-in">
      {/* Header section with Filter controls */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Referrals Directory</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Displaying {filteredReferrals.length} referrals of {referrals.length} total
            </p>
          </div>

          {/* Search bar aligned right */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search member, ID, type..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-xl border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Dedicated row for the filters, forcing side-by-side flex layout */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 shrink-0">
            Filters:
          </span>

          <div className="flex flex-wrap gap-2.5 items-center">
            {/* Status Filter */}
            <CustomSelect
              options={statusOptions}
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
              className="w-38"
            />

            {/* Priority Filter */}
            <CustomSelect
              options={priorityOptions}
              value={priorityFilter}
              onChange={(val) => { setPriorityFilter(val); setCurrentPage(1); }}
              className="w-36"
            />

            {/* Coordinator Filter */}
            <CustomSelect
              options={coordinatorOptions}
              value={coordinatorFilter}
              onChange={(val) => { setCoordinatorFilter(val); setCurrentPage(1); }}
              className="w-46"
            />

            {/* Overdue filter */}
            <CustomSelect
              options={overdueOptions}
              value={overdueFilter}
              onChange={(val) => { setOverdueFilter(val); setCurrentPage(1); }}
              className="w-42"
            />
          </div>
        </div>
      </div>

      {/* Main Table grid */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[800px] table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-wider">
              <th className="pb-3.5 px-4.5 w-[11%] cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors" onClick={() => handleSort('referralId')}>
                <div className="flex items-center gap-1">
                  Referral ID <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="pb-3.5 px-4.5 w-[23%] cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors" onClick={() => handleSort('memberName')}>
                <div className="flex items-center gap-1">
                  Member Name <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="pb-3.5 px-4.5 w-[15%] cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors" onClick={() => handleSort('referralType')}>
                <div className="flex items-center gap-1">
                  Referral Type <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="pb-3.5 px-4.5 w-[11%] cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors" onClick={() => handleSort('priority')}>
                <div className="flex items-center gap-1">
                  Priority <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="pb-3.5 px-4.5 w-[12%] cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">
                  Status <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="pb-3.5 px-4.5 w-[12%] cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors" onClick={() => handleSort('dueDate')}>
                <div className="flex items-center gap-1">
                  Due Date <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="pb-3.5 px-4.5 w-[10%]">Assigned To</th>
              <th className="pb-3.5 px-4.5 w-[6%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {paginatedReferrals.length > 0 ? (
              paginatedReferrals.map((ref) => {
                const overdue = isOverdue(ref);
                const currentStatus = statusStyles[ref.status];

                return (
                  <tr
                    key={ref.referralId}
                    className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-all duration-200 cursor-pointer text-slate-700 dark:text-slate-300 text-sm"
                    onClick={() => onSelectReferral(ref)}
                  >
                    <td className="py-4.5 px-4.5 font-medium text-slate-900 dark:text-slate-200 font-sans tracking-tight">
                      {highlightMatch(ref.referralId, searchTerm)}
                    </td>
                    <td className="py-4.5 px-4.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase shrink-0">
                          {ref.memberName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{highlightMatch(ref.memberName, searchTerm)}</p>
                          <p className="text-xs text-slate-400">DOB: {ref.memberDob}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-4.5 text-slate-500 dark:text-slate-400">
                      {highlightMatch(ref.referralType, searchTerm)}
                    </td>
                    <td className="py-4.5 px-4.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${priorityStyles[ref.priority]}`}>
                        {ref.priority}
                      </span>
                    </td>
                    <td className="py-4.5 px-4.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${currentStatus.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
                        {ref.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4.5 px-4.5">
                      <div className="flex flex-col">
                        <span className={`font-medium ${overdue ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''}`}>
                          {ref.dueDate}
                        </span>
                        {overdue && (
                          <span className="text-xs text-rose-500 font-bold uppercase tracking-wider flex items-center gap-0.5 mt-0.5 animate-pulse">
                            <AlertCircle className="w-2.5 h-2.5" /> OVERDUE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4.5 px-4.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{getCoordinatorName(ref.assignedTo)}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-4.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectReferral(ref)}
                        className="p-2 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl transition-all duration-200"
                        title="View Details & Manage"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No referrals match the current search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5 mt-4">
          <span className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/80 transition-all text-slate-500
                ${currentPage === 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95'
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7.5 h-7.5 text-xs font-semibold rounded-lg transition-all
                    ${currentPage === pageNum
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/80 transition-all text-slate-500
                ${currentPage === totalPages
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95'
                }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
