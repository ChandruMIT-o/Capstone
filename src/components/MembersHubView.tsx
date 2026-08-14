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
  userRole?: 'ADMINISTRATOR' | 'COORDINATOR' | 'AUDITOR';
}

export const MembersHubView: React.FC<MembersHubViewProps> = ({
  members,
  referrals,
  onSelectReferral,
  onOpenCreateModalWithMember,
  onAddMemberClick,
  userRole = 'COORDINATOR'
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
    LOW: 'text-optum-warm-gray/70 bg-optum-gray-100',
    MEDIUM: 'text-status-info bg-status-info-bg',
    HIGH: 'text-status-warning bg-status-warning-bg font-semibold',
    URGENT: 'text-status-danger bg-status-danger-bg font-bold'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
      {/* Sidebar: Members List */}
      <div className="bg-optum-white border border-optum-gray-200 p-5 rounded-3xl shadow-xs flex flex-col h-[70vh] lg:h-[75vh]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-optum-warm-gray">Synthetic Members</h2>
            <p className="text-sm text-optum-gray-500/80 mt-0.5">Select a member to view their 360 care journey</p>
          </div>
          <button
            onClick={userRole === 'AUDITOR' ? undefined : onAddMemberClick}
            disabled={userRole === 'AUDITOR'}
            className={`p-1.5 rounded-xl transition-all flex items-center justify-center shrink-0
              ${userRole === 'AUDITOR'
                ? 'bg-optum-gray-100 text-optum-gray-500/60 dark:text-optum-gray-500/80 cursor-not-allowed'
                : 'bg-optum-orange hover:bg-optum-blue-dark text-optum-white cursor-pointer active:scale-90 shadow-sm'
              }`}
            title={userRole === 'AUDITOR' ? 'Intake locked (Read-Only Account)' : 'Add New Member'}
          >
            <Plus className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-optum-gray-500/60" />
          <input
            type="text"
            placeholder="Search member name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-optum-gray-50 text-optum-warm-gray text-sm rounded-xl border border-optum-gray-200 dark:border-optum-gray-700 focus:outline-none"
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
                    ? 'bg-optum-gray-100 dark:bg-optum-gray-700 text-optum-warm-gray border border-optum-gray-200/50 dark:border-optum-gray-700'
                    : 'hover:bg-optum-gray-100 text-optum-gray-500'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold uppercase shrink-0
                    ${isSelected
                      ? 'bg-optum-warm-gray text-optum-white'
                      : 'bg-optum-gray-100 dark:bg-optum-gray-700 text-optum-gray-500/80'
                    }`}
                  >
                    {m.firstName[0]}{m.lastName[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold truncate max-w-[120px]">
                      {m.firstName} {m.lastName}
                    </h4>
                    <p className="text-xs text-optum-gray-500/60 mt-0.5">{m.memberId}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-optum-gray-500/60 transition-transform group-hover:translate-x-0.5 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Panel: 360 View */}
      <div className="lg:col-span-2 bg-optum-white border border-optum-gray-200 p-6 rounded-3xl shadow-xs overflow-y-auto h-[70vh] lg:h-[75vh]">
        {selectedMember ? (
          <div className="space-y-6">
            {/* Header / Demographics Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-optum-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-optum-blue-pale text-optum-warm-gray flex items-center justify-center text-lg font-bold">
                  {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-optum-warm-gray">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-optum-gray-500/60 text-sm mt-1.5">
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
                onClick={userRole === 'AUDITOR' ? undefined : () => onOpenCreateModalWithMember(selectedMember.memberId)}
                disabled={userRole === 'AUDITOR'}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm shrink-0
                  ${userRole === 'AUDITOR'
                    ? 'bg-optum-gray-100 text-optum-gray-500/40 cursor-not-allowed'
                    : 'bg-optum-orange hover:bg-optum-blue-dark text-optum-white cursor-pointer active:scale-95'
                  }`}
                title={userRole === 'AUDITOR' ? 'Access Locked' : 'Add Referral'}
              >
                <Plus className="w-4 h-4" /> Add Referral
              </button>
            </div>

            {/* Demographics details row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2.5 p-3 bg-optum-gray-50/40 rounded-2xl border border-optum-gray-200/50">
                <Phone className="w-4 h-4 text-optum-gray-500/60" />
                <div>
                  <p className="text-xs font-bold text-optum-gray-500/60 uppercase tracking-wider">Phone Contact</p>
                  <p className="font-semibold text-optum-warm-gray mt-0.5">{selectedMember.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-optum-gray-50/40 rounded-2xl border border-optum-gray-200/50">
                <Mail className="w-4 h-4 text-optum-gray-500/60" />
                <div>
                  <p className="text-xs font-bold text-optum-gray-500/60 uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold text-optum-warm-gray mt-0.5">{selectedMember.email}</p>
                </div>
              </div>
            </div>

            {/* Care Journey Timeline */}
            <div>
              <h4 className="text-xs font-bold text-optum-gray-500/60 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Compass className="w-4.5 h-4.5 text-optum-gray-500/60" />
                Care Journey Referral History ({memberReferrals.length})
              </h4>

              {memberReferrals.length > 0 ? (
                <div className="relative border-l border-optum-gray-200 pl-5 ml-3 space-y-6">
                  {memberReferrals.map((ref) => {
                    const isCompleted = ref.status === 'COMPLETED';
                    const isCancelled = ref.status === 'CANCELLED';

                    return (
                      <div key={ref.referralId} className="relative">
                        {/* Timeline Circle Node */}
                        <span className={`absolute -left-[27.5px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-optum-white
                          ${isCompleted
                            ? 'bg-status-success'
                            : isCancelled
                              ? 'bg-optum-warm-gray/30'
                              : 'bg-optum-orange animate-pulse'
                          }`}
                        />

                        <div className="p-4 bg-optum-gray-50 hover:bg-optum-gray-100 rounded-2xl border border-optum-gray-200/80 transition-all">
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-sm font-bold text-optum-warm-gray">
                                  {ref.referralType.replace(/([A-Z])/g, ' $1').trim()}
                                </h5>
                                <span className="text-xs text-optum-gray-500/60 font-mono">({ref.referralId})</span>
                                <span className={`text-xs px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${priorityStyles[ref.priority]}`}>
                                  {ref.priority}
                                </span>
                              </div>
                              <p className="text-xs text-optum-gray-500/60 mt-1">
                                Created {ref.createdDate} • Assigned to coordinator {ref.assignedTo}
                              </p>
                            </div>

                            <button
                              onClick={() => onSelectReferral(ref)}
                              className="p-1.5 hover:bg-optum-gray-100 rounded-lg text-optum-gray-500/60 hover:text-optum-gray-700 transition-all shrink-0"
                              title="Details"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-sm text-optum-gray-700 dark:text-optum-gray-200 mt-2.5 line-clamp-2 font-medium">
                            {ref.notes}
                          </p>

                          <div className="mt-3 flex items-center justify-between border-t border-optum-gray-200/60 pt-2 text-sm">
                            <span className="text-optum-gray-500/60">Due: {ref.dueDate}</span>
                            <span className={`font-semibold uppercase ${isCompleted
                                ? 'text-status-success'
                                : isCancelled
                                  ? 'text-optum-gray-500/60'
                                  : 'text-optum-orange'
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
                <div className="text-center py-10 border border-dashed border-optum-gray-200 rounded-3xl text-optum-gray-500/60">
                  <p className="text-xs">No care referrals logged for this member yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-optum-gray-500/60 text-sm">
            <p>Select a synthetic member profile from the directory</p>
          </div>
        )}
      </div>
    </div>
  );
};
