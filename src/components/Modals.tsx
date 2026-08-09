import React, { useState } from 'react';
import type { 
  Referral, 
  Member, 
  CareCoordinator 
} from '../data/mockData';
import { referralTypesList } from '../data/mockData';
import { CustomSelect } from './CustomSelect';
import { 
  X, 
  ShieldAlert, 
  Info,
  CheckCircle
} from 'lucide-react';

interface CreateReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  coordinators: CareCoordinator[];
  preSelectedMemberId?: string;
  onSubmit: (newReferral: Omit<Referral, 'referralId' | 'createdDate' | 'lastUpdated' | 'auditHistory'>) => void;
}

export const CreateReferralModal: React.FC<CreateReferralModalProps> = ({
  isOpen,
  onClose,
  members,
  coordinators,
  preSelectedMemberId = '',
  onSubmit
}) => {
  const [memberId, setMemberId] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setMemberId(preSelectedMemberId);
    }
  }, [isOpen, preSelectedMemberId]);
  const [referralType, setReferralType] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const memberOptions = members.map(m => ({
    value: m.memberId,
    label: `${m.firstName} ${m.lastName} (${m.memberId})`
  }));

  const typeOptions = referralTypesList.map(type => ({
    value: type,
    label: type.replace(/([A-Z])/g, ' $1').trim()
  }));

  const priorityOptions = [
    { value: 'LOW', label: 'Low', color: 'bg-slate-300' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-400' },
    { value: 'HIGH', label: 'High', color: 'bg-amber-400' },
    { value: 'URGENT', label: 'Urgent', color: 'bg-rose-500' }
  ];

  const coordinatorOptions = coordinators.map(c => ({
    value: c.coordinatorId,
    label: c.name,
    avatar: c.avatar
  }));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !referralType || !assignedTo || !dueDate) {
      setError('Please fill in all required fields.');
      return;
    }

    if (notes.length > 500) {
      setError('Notes cannot exceed 500 characters.');
      return;
    }

    setError('');
    onSubmit({
      memberId,
      memberName: '', // App.tsx will match member details
      memberDob: '',
      referralType,
      priority,
      status: 'CREATED',
      assignedTo,
      dueDate,
      notes
    });

    // Reset Form
    setMemberId('');
    setReferralType('');
    setPriority('MEDIUM');
    setAssignedTo('');
    setDueDate('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Create New Care Referral</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}


          {/* Select Member */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Patient / Member <span className="text-rose-500">*</span>
            </label>
            <CustomSelect
              options={memberOptions}
              value={memberId}
              onChange={setMemberId}
              placeholder="Select a synthetic member"
            />
          </div>

          {/* Grid for Referral Type and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Referral Type <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                options={typeOptions}
                value={referralType}
                onChange={setReferralType}
                placeholder="Select Type"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Priority Level <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                options={priorityOptions}
                value={priority}
                onChange={(val) => setPriority(val as any)}
              />
            </div>
          </div>

          {/* Grid for Assignee and Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Assign Care Coordinator <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                options={coordinatorOptions}
                value={assignedTo}
                onChange={setAssignedTo}
                placeholder="Select Coordinator"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Target Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Coordination Notes & Context
            </label>
            <textarea
              placeholder="Provide intake reasons, specific specialist requests or transportation coordinates..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-24 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
            />
            <p className="text-[10px] text-right text-slate-400">
              {notes.length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
            >
              Create Referral
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ReferralDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: Referral | null;
  coordinators: CareCoordinator[];
  members: Member[];
  onUpdateStatus: (id: string, newStatus: Referral['status'], operator: string) => void;
  onSnoozeDueDate: (id: string, newDate: string, reason: string, notes: string, operator: string) => void;
  onReassign: (id: string, coordinatorId: string, operator: string) => void;
}

export const ReferralDetailModal: React.FC<ReferralDetailModalProps> = ({
  isOpen,
  onClose,
  referral,
  coordinators,
  members,
  onUpdateStatus,
  onSnoozeDueDate,
  onReassign
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'actions' | 'logs'>('overview');
  
  // Snooze form states
  const [snoozeDate, setSnoozeDate] = useState('');
  const [snoozeReason, setSnoozeReason] = useState('PROVIDER_DELAY');
  const [snoozeNotes, setSnoozeNotes] = useState('');
  const [snoozeError, setSnoozeError] = useState('');

  // Reassignment state
  const [reassignId, setReassignId] = useState('');
  const [reassignSuccess, setReassignSuccess] = useState(false);

  const reassignOptions = coordinators.map(c => ({
    value: c.coordinatorId,
    label: c.name,
    avatar: c.avatar
  }));

  const snoozeReasonOptions = [
    { value: 'PROVIDER_DELAY', label: 'Provider Delay' },
    { value: 'MEMBER_UNREACHABLE', label: 'Member Unreachable' },
    { value: 'INSURANCE_AUTH', label: 'Insurance Auth' },
    { value: 'OTHER', label: 'Other Reason' }
  ];

  if (!isOpen || !referral) return null;

  // Find Member details
  const memberObj = members.find(m => m.memberId === referral.memberId);

  // Status flow validation
  const getAvailableStatusOptions = () => {
    switch (referral.status) {
      case 'CREATED':
        return [
          { label: 'Start Intervention (In Progress)', value: 'IN_PROGRESS', style: 'bg-indigo-600 text-white hover:bg-indigo-700' },
          { label: 'Cancel Referral', value: 'CANCELLED', style: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' }
        ];
      case 'IN_PROGRESS':
        return [
          { label: 'Resolve & Close (Completed)', value: 'COMPLETED', style: 'bg-emerald-600 text-white hover:bg-emerald-700' }
        ];
      default:
        return []; // COMPLETED & CANCELLED are terminal states
    }
  };

  const handleStatusChange = (newStatus: Referral['status']) => {
    onUpdateStatus(referral.referralId, newStatus, 'CC-User');
  };

  const handleSnooze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snoozeDate) {
      setSnoozeError('New due date is required.');
      return;
    }

    const today = new Date('2026-08-10');
    const selected = new Date(snoozeDate);
    if (selected <= today) {
      setSnoozeError('New due date must be in the future.');
      return;
    }

    setSnoozeError('');
    onSnoozeDueDate(
      referral.referralId,
      snoozeDate,
      snoozeReason,
      snoozeNotes,
      'CC-User'
    );
    setSnoozeDate('');
    setSnoozeNotes('');
    setActiveSubTab('overview');
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignId) return;

    onReassign(referral.referralId, reassignId, 'CC-User');
    setReassignSuccess(true);
    setTimeout(() => {
      setReassignSuccess(false);
      setActiveSubTab('overview');
    }, 1500);
  };

  const getCoordinatorName = (id: string) => {
    return coordinators.find(c => c.coordinatorId === id)?.name || id;
  };

  // Helper overdue check
  const overdueState = (() => {
    const today = new Date('2026-08-10');
    const due = new Date(referral.dueDate);
    return today > due && referral.status !== 'COMPLETED' && referral.status !== 'CANCELLED';
  })();

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Referral Details
              </h3>
              <span className="text-xs text-slate-400 font-mono">({referral.referralId})</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Member Journey Path: {referral.memberName}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          {(['overview', 'actions', 'logs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all capitalize
                ${activeSubTab === tab
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
              {tab === 'logs' ? 'Audit Timeline' : tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Member Card */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4.5 border border-slate-100 dark:border-slate-800/80">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                  Member Demographics
                </h4>
                {memberObj ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Full Name</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {memberObj.firstName} {memberObj.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Date of Birth</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {memberObj.dateOfBirth}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Contact Phone</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {memberObj.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Member ID</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {memberObj.memberId}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Loading Member Metadata...</p>
                )}
              </div>

              {/* Referral Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Type of Resource</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {referral.referralType.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Current Status</p>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {referral.status}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Priority urgency</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {referral.priority}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Target due date</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-sm font-semibold ${overdueState ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
                      {referral.dueDate}
                    </span>
                    {overdueState && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded font-bold uppercase animate-pulse">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Date created</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {referral.createdDate}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Care coordinator</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {getCoordinatorName(referral.assignedTo)}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-[10px] text-slate-400 uppercase mb-1">Coordination Log</p>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {referral.notes || 'No custom notes provided for this referral intervention.'}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'actions' && (
            <div className="space-y-6">
              {/* Lifecycle transitions */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Update Lifecycle Status
                </h4>
                {getAvailableStatusOptions().length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {getAvailableStatusOptions().map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleStatusChange(opt.value as any)}
                        className={`px-4.5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer ${opt.style}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-slate-400" />
                    Referral is in terminal state ({referral.status}). No status updates allowed.
                  </p>
                )}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-5" />

              {/* Reassignment */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                  Reassign Coordinator
                </h4>
                {reassignSuccess && (
                  <div className="p-3 mb-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Coordinator reassigned successfully!</span>
                  </div>
                )}
                 <form onSubmit={handleReassignSubmit} className="flex items-center gap-2.5 max-w-md w-full">
                  <CustomSelect
                    options={reassignOptions}
                    value={reassignId}
                    onChange={setReassignId}
                    placeholder="Select Coordinator..."
                    className="flex-1"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 shrink-0"
                  >
                    Assign
                  </button>
                </form>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-5" />

              {/* Snooze Due Date */}
              {referral.status !== 'COMPLETED' && referral.status !== 'CANCELLED' ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                    Snooze / Extend Due Date
                  </h4>
                  {snoozeError && (
                    <p className="text-rose-500 text-xs font-semibold mb-2">{snoozeError}</p>
                  )}
                  <form onSubmit={handleSnooze} className="space-y-3.5 max-w-md">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">New Due Date</label>
                        <input
                          type="date"
                          value={snoozeDate}
                          onChange={(e) => setSnoozeDate(e.target.value)}
                          className="w-full px-3 py-2.5 mt-1 bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Extension Reason</label>
                        <CustomSelect
                          options={snoozeReasonOptions}
                          value={snoozeReason}
                          onChange={setSnoozeReason}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Extension justification notes</label>
                      <textarea
                        placeholder="State why this extension is required..."
                        value={snoozeNotes}
                        onChange={(e) => setSnoozeNotes(e.target.value)}
                        className="w-full h-16 px-3 py-2 mt-1 bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none resize-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
                    >
                      Process SLA Extension
                    </button>
                  </form>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Cannot adjust SLA timeframe for completed or cancelled cases.</p>
              )}
            </div>
          )}

          {activeSubTab === 'logs' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Operational Audit History
              </h4>
              <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4.5 space-y-4.5 ml-2.5">
                {referral.auditHistory && referral.auditHistory.length > 0 ? (
                  referral.auditHistory.map((log, index) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[24.5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {log.action}
                          </span>
                          <span className="text-xs text-slate-400">
                            by {log.performedBy}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {log.details}
                        </p>
                        <span className="text-[9px] text-slate-400 block mt-1.5">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No activity logs recorded.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    email: string;
  }) => void;
}

export const CreateMemberModal: React.FC<CreateMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !dateOfBirth || !gender || !phone || !email) {
      setError('Please fill in all required fields.');
      return;
    }

    onSubmit({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      email
    });

    setFirstName('');
    setLastName('');
    setDateOfBirth('');
    setGender('');
    setPhone('');
    setEmail('');
    onClose();
  };

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Non-binary', label: 'Non-binary' },
    { value: 'Other', label: 'Other / Prefer not to say' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-60 animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add Synthetic Patient Member</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">First Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Taylor"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Last Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Morgan"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Date of Birth <span className="text-rose-500">*</span></label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gender <span className="text-rose-500">*</span></label>
              <CustomSelect
                options={genderOptions}
                value={gender}
                onChange={setGender}
                placeholder="Select Gender"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Phone Contact <span className="text-rose-500">*</span></label>
            <input
              type="text"
              required
              placeholder="(555) 012-3456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address <span className="text-rose-500">*</span></label>
            <input
              type="email"
              required
              placeholder="taylor.morgan@synthetic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-sm font-bold rounded-xl transition-all cursor-pointer active:scale-95"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
