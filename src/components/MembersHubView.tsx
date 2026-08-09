import React, { useState } from 'react';
import type { Member, Referral } from '../data/mockData';
import { 
  Search, 
  Mail, 
  Phone, 
  ExternalLink,
  ChevronRight,
  Plus,
  Compass
} from 'lucide-react';

interface MembersHubViewProps {
  members: Member[];
  referrals: Referral[];
  onSelectReferral: (referral: Referral) => void;
  onOpenCreateModalWithMember: (memberId: string) => void;
  onAddMemberClick?: () => void;
  userRole?: 'ADMIN' | 'READ_WRITE' | 'READ_ONLY';
}

export const MembersHubView: React.FC<MembersHubViewProps> = ({
  members,
  referrals,
  onSelectReferral,
  onOpenCreateModalWithMember,
  onAddMemberClick,
  userRole = 'READ_WRITE'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(members[0]?.memberId || null);

  const filteredMembers = members.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMember = members.find(m => m.memberId === selectedMemberId);
  const memberReferrals = referrals.filter(r => r.memberId === selectedMemberId);

  // Helper to calculate age
  const getAge = (dob: string) => {
    const birthday = new Date(dob);
    const today = new Date('2026-08-10');
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  // Helper styles for priority tags
  const priorityStyles = {
    LOW: 'text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300',
    MEDIUM: 'text-blue-700 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400',
    HIGH: 'text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400',
    URGENT: 'text-rose-700 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
      {/* Sidebar: Members List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-xs flex flex-col h-[70vh] lg:h-[75vh]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Synthetic Members</h2>
            <p className="text-sm text-slate-500 mt-0.5">Select a member to view their 360 care journey</p>
          </div>
          <button
            onClick={userRole === 'READ_ONLY' ? undefined : onAddMemberClick}
            disabled={userRole === 'READ_ONLY'}
            className={`p-1.5 rounded-xl transition-all flex items-center justify-center shrink-0
              ${userRole === 'READ_ONLY'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 cursor-pointer active:scale-90 shadow-sm'
              }`}
            title={userRole === 'READ_ONLY' ? 'Intake locked (Read-Only Account)' : 'Add New Member'}
          >
            <Plus className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search member name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredMembers.map((m) => {
            const isSelected = m.memberId === selectedMemberId;
            return (
              <div
                key={m.memberId}
                onClick={() => setSelectedMemberId(m.memberId)}
                className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 flex items-center justify-between group
                  ${isSelected
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold uppercase shrink-0
                    ${isSelected 
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {m.firstName[0]}{m.lastName[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold truncate max-w-[120px]">
                      {m.firstName} {m.lastName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{m.memberId}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform group-hover:translate-x-0.5 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Panel: 360 View */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xs overflow-y-auto h-[70vh] lg:h-[75vh]">
        {selectedMember ? (
          <div className="space-y-6">
            {/* Header / Demographics Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">
                  {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-400 text-sm mt-1.5">
                    <span>ID: {selectedMember.memberId}</span>
                    <span>•</span>
                    <span>{selectedMember.gender}</span>
                    <span>•</span>
                    <span>{getAge(selectedMember.dateOfBirth)} years old (DOB: {selectedMember.dateOfBirth})</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={userRole === 'READ_ONLY' ? undefined : () => onOpenCreateModalWithMember(selectedMember.memberId)}
                disabled={userRole === 'READ_ONLY'}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm shrink-0
                  ${userRole === 'READ_ONLY'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-650 cursor-not-allowed'
                    : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white cursor-pointer active:scale-95'
                  }`}
                title={userRole === 'READ_ONLY' ? 'Access Locked' : 'Add Referral'}
              >
                <Plus className="w-4 h-4" /> Add Referral
              </button>
            </div>

            {/* Demographics details row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Phone Contact</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedMember.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedMember.email}</p>
                </div>
              </div>
            </div>

            {/* Care Journey Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Compass className="w-4.5 h-4.5 text-slate-400" />
                Care Journey Referral History ({memberReferrals.length})
              </h4>

              {memberReferrals.length > 0 ? (
                <div className="relative border-l border-slate-100 dark:border-slate-800 pl-5 ml-3 space-y-6">
                  {memberReferrals.map((ref) => {
                    const isCompleted = ref.status === 'COMPLETED';
                    const isCancelled = ref.status === 'CANCELLED';
                    
                    return (
                      <div key={ref.referralId} className="relative">
                        {/* Timeline Circle Node */}
                        <span className={`absolute -left-[27.5px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900
                          ${isCompleted 
                            ? 'bg-emerald-500' 
                            : isCancelled 
                              ? 'bg-slate-400' 
                              : 'bg-blue-500 animate-pulse'
                          }`}
                        />

                        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/55 rounded-2xl border border-slate-100 dark:border-slate-800/80 transition-all">
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                  {ref.referralType.replace(/([A-Z])/g, ' $1').trim()}
                                </h5>
                                <span className="text-xs text-slate-400 font-mono">({ref.referralId})</span>
                                <span className={`text-xs px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${priorityStyles[ref.priority]}`}>
                                  {ref.priority}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">
                                Created {ref.createdDate} • Assigned to coordinator {ref.assignedTo}
                              </p>
                            </div>

                            <button
                              onClick={() => onSelectReferral(ref)}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-all shrink-0"
                              title="Details"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-sm text-slate-600 dark:text-slate-350 mt-2.5 line-clamp-2 font-medium">
                            {ref.notes}
                          </p>

                          <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-2 text-sm">
                            <span className="text-slate-400">Due: {ref.dueDate}</span>
                            <span className={`font-semibold uppercase ${
                              isCompleted 
                                ? 'text-emerald-600 dark:text-emerald-400' 
                                : isCancelled 
                                  ? 'text-slate-400' 
                                  : 'text-blue-600 dark:text-blue-400'
                            }`}>
                              Status: {ref.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                  <p className="text-xs">No care referrals logged for this member yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-sm">
            <p>Select a synthetic member profile from the directory</p>
          </div>
        )}
      </div>
    </div>
  );
};
