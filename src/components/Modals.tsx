import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  Lock,
  Clock,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  UserCheck,
  RefreshCw,
  CalendarClock,
  XCircle,
  History
} from 'lucide-react';

/* =========================================================
   1. CREATE REFERRAL MODAL (With Urgent Confirmation Sub-Dialog)
   ========================================================= */
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
  const [referralType, setReferralType] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [showUrgentConfirmation, setShowUrgentConfirmation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMemberId(preSelectedMemberId);
      setError('');
      setShowUrgentConfirmation(false);
    }
  }, [isOpen, preSelectedMemberId]);

  const memberOptions = members.map(m => ({
    value: m.memberId,
    label: `${m.firstName} ${m.lastName} (${m.memberId})`
  }));

  const typeOptions = referralTypesList.map(type => ({
    value: type,
    label: type.replace(/([A-Z])/g, ' $1').trim()
  }));

  const priorityOptions = [
    { value: 'LOW', label: 'Low Priority', color: 'bg-slate-300' },
    { value: 'MEDIUM', label: 'Medium Priority', color: 'bg-sky-500' },
    { value: 'HIGH', label: 'High Priority', color: 'bg-amber-500' },
    { value: 'URGENT', label: 'Urgent Priority (24h SLA)', color: 'bg-rose-500' }
  ];

  const coordinatorOptions = coordinators.map(c => ({
    value: c.coordinatorId,
    label: c.name,
    avatar: c.avatar
  }));

  if (!isOpen) return null;

  const executeSubmission = () => {
    onSubmit({
      memberId,
      memberName: '',
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
    setShowUrgentConfirmation(false);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
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

    // If priority is URGENT, prompt the confirmation sub-dialog
    if (priority === 'URGENT') {
      setShowUrgentConfirmation(true);
    } else {
      executeSubmission();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white/95 dark:bg-[#101726]/95 backdrop-blur-xl rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200/80 dark:border-slate-800/80 animate-pop-in overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Create Care Referral</h3>
            <p className="text-xs text-slate-400 mt-0.5">Initiate clinical coordinator intake pathway</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Urgent Priority Confirmation Sub-Dialog Overlay */}
        {showUrgentConfirmation && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#101726]/95 backdrop-blur-md z-20 p-6 flex flex-col justify-between animate-fade-in">
            <div className="text-center pt-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3 shadow-md shadow-rose-500/10">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">Confirm Urgent Priority Referral</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Flagging a referral as <strong className="text-rose-600 dark:text-rose-400">URGENT</strong> triggers immediate high-priority SLA tracking (24h turnaround target) and alerts clinical coordination leads.
              </p>
            </div>

            <div className="p-4 bg-rose-50/80 dark:bg-rose-950/30 rounded-2xl border border-rose-200/60 dark:border-rose-900/50 text-left text-xs space-y-1.5 my-4">
              <p className="text-slate-700 dark:text-slate-300"><strong>Patient:</strong> {members.find(m => m.memberId === memberId)?.firstName} {members.find(m => m.memberId === memberId)?.lastName}</p>
              <p className="text-slate-700 dark:text-slate-300"><strong>Service:</strong> {referralType.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-slate-700 dark:text-slate-300"><strong>Target SLA:</strong> {dueDate}</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowUrgentConfirmation(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={executeSubmission}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-full shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
              >
                Confirm Urgent Creation
              </button>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-2xl border border-rose-200 dark:border-rose-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Select Member */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
              Patient / Member <span className="text-rose-500">*</span>
            </label>
            <CustomSelect
              options={memberOptions}
              value={memberId}
              onChange={setMemberId}
              placeholder="Select synthetic member"
            />
          </div>

          {/* Referral Type and Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
                Service Type <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                options={typeOptions}
                value={referralType}
                onChange={setReferralType}
                placeholder="Select Type"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
                Priority Level <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                options={priorityOptions}
                value={priority}
                onChange={(val) => setPriority(val as any)}
              />
            </div>
          </div>

          {/* Coordinator & Target SLA Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
                Assigned Coordinator <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                options={coordinatorOptions}
                value={assignedTo}
                onChange={setAssignedTo}
                placeholder="Select Coordinator"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
                Target Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                required
              />
            </div>
          </div>

          {/* Intake Notes */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
              Coordination Notes & Clinical Context
            </label>
            <textarea
              placeholder="Clinical reason, specialist requirements, transportation coordinates..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-22 px-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-xs rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-xs"
            />
            <p className="text-[10px] text-right text-slate-400 px-1">{notes.length}/500 chars</p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs sm:text-[13px] font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Create Referral
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/* =========================================================
   2. REFERRAL DETAIL & ACTION MODAL (With Confirmation Sub-Dialogs)
   ========================================================= */
interface ReferralDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: Referral | null;
  coordinators: CareCoordinator[];
  members: Member[];
  onUpdateStatus: (id: string, newStatus: Referral['status'], operator: string) => void;
  onSnoozeDueDate: (id: string, newDate: string, reason: string, notes: string, operator: string) => void;
  onReassign: (id: string, coordinatorId: string, operator: string) => void;
  currentCoordinatorId?: string;
  userRole?: string;
}

export const ReferralDetailModal: React.FC<ReferralDetailModalProps> = ({
  isOpen,
  onClose,
  referral,
  coordinators,
  members,
  onUpdateStatus,
  onSnoozeDueDate,
  onReassign,
  currentCoordinatorId,
  userRole
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'actions' | 'logs'>('overview');

  // Confirmation Sub-dialog state
  const [pendingAction, setPendingAction] = useState<{
    type: 'STATUS' | 'REASSIGN' | 'SNOOZE';
    statusVal?: Referral['status'];
    reassignCoordId?: string;
    snoozeDateVal?: string;
    snoozeReasonVal?: string;
    snoozeNotesVal?: string;
  } | null>(null);

  // Snooze form states
  const [snoozeDate, setSnoozeDate] = useState('');
  const [snoozeReason, setSnoozeReason] = useState('PROVIDER_DELAY');
  const [snoozeNotes] = useState('');

  // Reassignment state
  const [reassignId, setReassignId] = useState('');

  if (!isOpen || !referral) return null;

  const isOwnCase = !currentCoordinatorId || referral.assignedTo === currentCoordinatorId;
  const isReadOnlyMode = userRole === 'AUDITOR' || (userRole === 'COORDINATOR' && !isOwnCase);

  const memberObj = members.find(m => m.memberId === referral.memberId);
  const currentCoord = coordinators.find(c => c.coordinatorId === referral.assignedTo);

  const reassignOptions = coordinators.map(c => ({
    value: c.coordinatorId,
    label: c.name,
    avatar: c.avatar
  }));

  const snoozeReasonOptions = [
    { value: 'PROVIDER_DELAY', label: 'Provider Availability Delay' },
    { value: 'MEMBER_UNREACHABLE', label: 'Member Outreach Lag' },
    { value: 'INSURANCE_AUTH', label: 'Prior Authorization Pending' },
    { value: 'CLINICAL_HOLD', label: 'Clinical Intake Rescheduled' }
  ];

  // Execute confirmed action
  const handleConfirmAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'STATUS' && pendingAction.statusVal) {
      onUpdateStatus(referral.referralId, pendingAction.statusVal, 'CC-User');
    } else if (pendingAction.type === 'REASSIGN' && pendingAction.reassignCoordId) {
      onReassign(referral.referralId, pendingAction.reassignCoordId, 'CC-User');
      setReassignId('');
    } else if (pendingAction.type === 'SNOOZE' && pendingAction.snoozeDateVal) {
      onSnoozeDueDate(
        referral.referralId,
        pendingAction.snoozeDateVal,
        pendingAction.snoozeReasonVal || '',
        pendingAction.snoozeNotesVal || '',
        'CC-User'
      );
      setSnoozeDate('');
    }

    setPendingAction(null);
    setActiveSubTab('overview');
  };

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

  const currentStatus = statusBadges[referral.status];

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white/95 dark:bg-[#101726]/95 backdrop-blur-xl rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 animate-pop-in overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Referral Details</h3>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/70 px-3 py-0.5 rounded-full shadow-xs">
                {referral.referralId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Patient: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{referral.memberName}</strong></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Read Only Restriction Banner */}
        {isReadOnlyMode && (
          <div className="bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200/60 dark:border-amber-900/60 px-6 py-2.5 flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
            <Lock className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Read-Only Mode: This case is assigned to {currentCoord?.name || referral.assignedTo}. Modification actions are locked.</span>
          </div>
        )}

        {/* Confirmation Sub-Dialog Overlay */}
        {pendingAction && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#101726]/95 backdrop-blur-md z-30 p-6 flex flex-col justify-between animate-fade-in">
            <div className="text-center pt-6">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-500/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {pendingAction.type === 'STATUS' && 'Confirm Case Status Update'}
                {pendingAction.type === 'REASSIGN' && 'Confirm Coordinator Reassignment'}
                {pendingAction.type === 'SNOOZE' && 'Confirm SLA Due Date Extension'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                {pendingAction.type === 'STATUS' && `Are you sure you want to transition this referral to ${pendingAction.statusVal}?`}
                {pendingAction.type === 'REASSIGN' && `Reassign this referral from ${currentCoord?.name} to ${coordinators.find(c => c.coordinatorId === pendingAction.reassignCoordId)?.name}?`}
                {pendingAction.type === 'SNOOZE' && `Extend target SLA date to ${pendingAction.snoozeDateVal}?`}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="px-4.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-6 py-2.5 text-xs sm:text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
              >
                Confirm Action
              </button>
            </div>
          </div>
        )}

        {/* Sub-Tabs Pill Bar */}
        <div className="p-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2 px-6">
          {(['overview', 'actions', 'logs'] as const).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4.5 py-2 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                {tab === 'logs' ? 'Audit History' : tab === 'actions' ? 'Action Center' : 'Clinical Overview'}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {activeSubTab === 'overview' && (
            <div className="space-y-4">
              {/* Member Demographics Box */}
              <div className="p-4.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Patient Demographics</span>
                </div>
                {memberObj ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Name</p>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5 text-xs sm:text-[13px]">{memberObj.firstName} {memberObj.lastName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Date of Birth</p>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">{memberObj.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Phone</p>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">{memberObj.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Patient ID</p>
                      <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{memberObj.memberId}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Loading demographics...</p>
                )}
              </div>

              {/* Referral Details Grid */}
              <div className="p-4.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Referral Attributes</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Service Type</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5 text-xs sm:text-[13px]">{referral.referralType.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold border mt-0.5 ${currentStatus.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
                      {referral.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Priority</p>
                    <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] uppercase font-bold border mt-0.5 ${priorityBadges[referral.priority]}`}>
                      {referral.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Target SLA Due</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{referral.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Coordinator</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {currentCoord?.avatar && (
                        <img src={currentCoord.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                      )}
                      <p className="font-bold text-slate-900 dark:text-white">{currentCoord?.name || referral.assignedTo}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Created On</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{referral.createdDate}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-4.5 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Clinical Notes & Context</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{referral.notes || 'No notes provided.'}</p>
              </div>
            </div>
          )}

          {activeSubTab === 'actions' && (
            <div className="space-y-4">
              {isReadOnlyMode ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <Lock className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  Action modifications are restricted for this referral.
                </div>
              ) : (
                <>
                  {/* Status Progression */}
                  <div className="p-4.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mb-3">Advance Workflow Status</h4>
                    <div className="flex gap-2.5 flex-wrap">
                      {referral.status === 'CREATED' && (
                        <button
                          onClick={() => setPendingAction({ type: 'STATUS', statusVal: 'IN_PROGRESS' })}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-[13px] font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          Start Intervention (In Progress)
                        </button>
                      )}
                      {referral.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => setPendingAction({ type: 'STATUS', statusVal: 'COMPLETED' })}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-[13px] font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          Resolve & Close Referral (Completed)
                        </button>
                      )}
                      {referral.status !== 'COMPLETED' && referral.status !== 'CANCELLED' && (
                        <button
                          onClick={() => setPendingAction({ type: 'STATUS', statusVal: 'CANCELLED' })}
                          className="px-5 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer shadow-xs"
                        >
                          Cancel Referral
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reassign Coordinator */}
                  <div className="p-4.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">Reassign Care Coordinator</h4>
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1">
                        <CustomSelect
                          options={reassignOptions}
                          value={reassignId}
                          onChange={setReassignId}
                          placeholder="Select New Coordinator"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={!reassignId || reassignId === referral.assignedTo}
                        onClick={() => setPendingAction({ type: 'REASSIGN', reassignCoordId: reassignId })}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-40 text-white text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer shrink-0 shadow-xs"
                      >
                        Reassign
                      </button>
                    </div>
                  </div>

                  {/* Snooze / Extend Due Date */}
                  <div className="p-4.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">Snooze / Extend Target SLA</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 px-1">New SLA Due Date</label>
                        <input
                          type="date"
                          value={snoozeDate}
                          onChange={(e) => setSnoozeDate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 px-1">Extension Reason</label>
                        <CustomSelect
                          options={snoozeReasonOptions}
                          value={snoozeReason}
                          onChange={setSnoozeReason}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={!snoozeDate}
                      onClick={() => {
                        if (!snoozeDate) return;
                        setPendingAction({
                          type: 'SNOOZE',
                          snoozeDateVal: snoozeDate,
                          snoozeReasonVal: snoozeReason,
                          snoozeNotesVal: snoozeNotes
                        });
                      }}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-40 text-white text-xs sm:text-[13px] font-bold rounded-full transition-all cursor-pointer shadow-xs"
                    >
                      Extend SLA Due Date
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeSubTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1 mb-1">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Chronological Audit Trail
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {referral.auditHistory?.length || 0} Milestones Logged
                </span>
              </div>

              {referral.auditHistory && referral.auditHistory.length > 0 ? (
                <div className="relative pl-7 py-2 before:absolute before:left-[13px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-indigo-500 before:via-blue-400 before:to-slate-300 dark:before:to-slate-700 space-y-4">
                  {referral.auditHistory.map((log, idx) => {
                    const isLatest = idx === referral.auditHistory.length - 1;

                    // Timeline node icon and colors based on action
                    let NodeIcon = Clock;
                    let nodeColor = 'bg-slate-600 text-white ring-4 ring-slate-100 dark:ring-slate-800';
                    let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

                    if (log.action === 'CREATED') {
                      NodeIcon = Sparkles;
                      nodeColor = 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950/60 shadow-sm shadow-emerald-500/20';
                      badgeColor = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
                    } else if (log.action === 'ASSIGNED') {
                      NodeIcon = UserCheck;
                      nodeColor = 'bg-sky-500 text-white ring-4 ring-sky-100 dark:ring-sky-950/60 shadow-sm shadow-sky-500/20';
                      badgeColor = 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800';
                    } else if (log.action === 'STATUS_UPDATE') {
                      NodeIcon = RefreshCw;
                      nodeColor = 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/60 shadow-sm shadow-indigo-500/20';
                      badgeColor = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
                    } else if (log.action === 'SNOOZED') {
                      NodeIcon = CalendarClock;
                      nodeColor = 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950/60 shadow-sm shadow-amber-500/20';
                      badgeColor = 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
                    } else if (log.action === 'CANCELLED') {
                      NodeIcon = XCircle;
                      nodeColor = 'bg-rose-500 text-white ring-4 ring-rose-100 dark:ring-rose-950/60 shadow-sm shadow-rose-500/20';
                      badgeColor = 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800';
                    }

                    return (
                      <div key={idx} className="relative group">
                        {/* Timeline Node Pin */}
                        <div className={`absolute -left-7 top-3 w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 z-10 ${nodeColor}`}>
                          <NodeIcon className="w-3.5 h-3.5" />
                        </div>

                        {/* Milestone Card */}
                        <div className="p-4 bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 shadow-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                                {log.action.replace('_', ' ')}
                              </span>
                              {isLatest && (
                                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-xs animate-pulse">
                                  Latest
                                </span>
                              )}
                            </div>

                            <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-white/90 dark:bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/80">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {log.timestamp.replace('T', ' ').replace('Z', '')}
                            </span>
                          </div>

                          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed mt-1">
                            {log.details}
                          </p>

                          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <span>Logged By:</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 font-semibold">
                                {log.performedBy}
                              </span>
                            </span>
                            <span className="text-slate-400 font-mono text-[9px]">ID: #{idx + 1}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Clock className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No Milestones Recorded</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Audit events will automatically appear here as actions occur.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* =========================================================
   3. CREATE MEMBER MODAL (Clean Demographics Intake)
   ========================================================= */
interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: Omit<Member, 'memberId'>) => void;
}

export const CreateMemberModal: React.FC<CreateMemberModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Female');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !dateOfBirth || !phone || !email) {
      setError('Please fill in all member fields.');
      return;
    }
    setError('');
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
    setPhone('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white/95 dark:bg-[#101726]/95 backdrop-blur-xl rounded-2xl w-full max-w-md shadow-2xl border border-slate-200/80 dark:border-slate-800/80 animate-pop-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Register Synthetic Member</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-xs text-rose-500 font-bold px-1">{error}</p>}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 px-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 px-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 px-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 px-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 px-1">Phone</label>
            <input
              type="text"
              value={phone}
              placeholder="(555) 000-0000"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              required
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 px-1">Email</label>
            <input
              type="email"
              value={email}
              placeholder="patient@synthetic.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs sm:text-[13px] font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Register Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
