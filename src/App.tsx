import { useState, useEffect } from 'react';
import type {
  Referral,
  Member,
  CareCoordinator
} from './data/mockData';
import {
  generateMockReferrals,
  initialMembers,
  initialCoordinators
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { StatsCard } from './components/StatsCard';
import { ReferralsTable } from './components/ReferralsTable';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import {
  CreateReferralModal,
  ReferralDetailModal,
  CreateMemberModal
} from './components/Modals';
import { OverdueDashboardView } from './components/OverdueDashboardView';
import { MembersHubView } from './components/MembersHubView';
import { LoginView } from './components/LoginView';
import { AdminCenterView } from './components/AdminCenterView';
import { CoordinatorProfileHeader } from './components/CoordinatorProfileHeader';
import type { PortalUser } from './components/AdminCenterView';
import {
  Plus,
  Bell,
  Mail,
  Search,
  Download,
  AlertCircle
} from 'lucide-react';

function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(false);

  // Core database states
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [coordinators, setCoordinators] = useState<CareCoordinator[]>(initialCoordinators);

  // Active view state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal open states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateMemberModalOpen, setIsCreateMemberModalOpen] = useState(false);
  const [preSelectedMemberId, setPreSelectedMemberId] = useState<string>('');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  // Toast list state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Interactive Stats Card filter selection ('overdue' | 'active' | 'urgent' | 'closed' | null)
  const [activeCardFilter, setActiveCardFilter] = useState<string | null>(null);

  // Auth User Sessions
  const [portalUsers, setPortalUsers] = useState<PortalUser[]>([
    { id: 'USR-101', name: 'System Administrator', email: 'admin@optum.com', role: 'ADMINISTRATOR', lastActive: 'Active Now' },
    { id: 'USR-102', name: 'Jordan Lee', email: 'coordinator@optum.com', role: 'COORDINATOR', lastActive: 'Active Now' },
    { id: 'USR-103', name: 'Visitor User', email: 'visitor@optum.com', role: 'AUDITOR', lastActive: 'Active Now' }
  ]);
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null);

  // Seeding mock data on component load
  useEffect(() => {
    setReferrals(generateMockReferrals());
  }, []);

  // Sync theme class on HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toast helper
  const triggerToast = (text: string, type: ToastMessage['type'] = 'success') => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      text,
      type
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper for overdue checks
  const isOverdue = (ref: Referral) => {
    const today = new Date('2026-08-10');
    const due = new Date(ref.dueDate);
    return today > due && ref.status !== 'COMPLETED' && ref.status !== 'CANCELLED';
  };

  // Session check helpers
  const isReadOnly = currentUser?.role === 'AUDITOR';
  const isCoordinator = currentUser?.role === 'COORDINATOR';
  const isAdministrator = currentUser?.role === 'ADMINISTRATOR';
  const currentCoordinatorId = isCoordinator ? 'CC-101' : undefined;

  const handleLogin = (email: string, role: PortalUser['role'], name: string) => {
    const existing = portalUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const updatedUser = { ...existing, lastActive: 'Active Now' };
      setPortalUsers(prev => prev.map(u => u.id === existing.id ? updatedUser : u));
      setCurrentUser(updatedUser);
    } else {
      const newUser: PortalUser = {
        id: `USR-${Math.floor(Math.random() * 900) + 100}`,
        name,
        email,
        role,
        lastActive: 'Active Now'
      };
      setPortalUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
    triggerToast(`Welcome back, ${name}.`, 'success');
  };

  const handleRegister = (email: string, name: string) => {
    const newUser: PortalUser = {
      id: `USR-${Math.floor(Math.random() * 900) + 100}`,
      name,
      email,
      role: 'COORDINATOR',
      lastActive: 'Registered'
    };
    setPortalUsers(prev => [...prev, newUser]);
    triggerToast('Account registered! You can now sign in.', 'success');
  };

  const handleLogOut = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    setActiveCardFilter(null);
    triggerToast('Logged out of clinical suite.', 'info');
  };

  const handleUpdateRole = (id: string, newRole: PortalUser['role']) => {
    if (!isAdministrator) {
      triggerToast('Only Administrators can update user roles.', 'error');
      return;
    }
    setPortalUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const updated = { ...u, role: newRole };
      if (currentUser && currentUser.id === id) {
        setCurrentUser(updated);
      }
      return updated;
    }));
    triggerToast('User privilege updated successfully.', 'success');
  };

  const handleRemoveUser = (id: string) => {
    if (!isAdministrator) {
      triggerToast('Only Administrators can remove users.', 'error');
      return;
    }
    setPortalUsers(prev => prev.filter(u => u.id !== id));
    triggerToast('User access credentials revoked.', 'info');
  };

  const handleInviteUser = (email: string, name: string, role: PortalUser['role']) => {
    if (!isAdministrator) {
      triggerToast('Only Administrators can invite users.', 'error');
      return;
    }
    const newUser: PortalUser = {
      id: `USR-${Math.floor(Math.random() * 900) + 100}`,
      name,
      email,
      role,
      lastActive: 'Invited'
    };
    setPortalUsers(prev => [...prev, newUser]);
    triggerToast(`Access credentials provisioned for ${name}.`, 'success');
  };

  // Patient Intake
  const handleCreateMember = (memberData: Omit<Member, 'memberId'>) => {
    if (isReadOnly) {
      triggerToast('Action Denied: Read-only access locks are active.', 'error');
      return;
    }
    if (!isAdministrator) {
      triggerToast('Only Administrators can register new members.', 'error');
      return;
    }
    const memberId = `MBR-${Math.floor(Math.random() * 900000) + 100000}`;
    const newMember: Member = {
      ...memberData,
      memberId
    };
    setMembers(prev => [...prev, newMember]);
    triggerToast(`Registered synthetic member ${memberData.firstName} ${memberData.lastName}.`, 'success');
  };

  // Create Referral
  const handleCreateReferral = (newRef: Omit<Referral, 'referralId' | 'createdDate' | 'lastUpdated' | 'auditHistory'>) => {
    if (isReadOnly) {
      triggerToast('Action Denied: Read-only access locks are active.', 'error');
      return;
    }

    if (isCoordinator && newRef.assignedTo !== 'CC-101') {
      triggerToast('Coordinators can only create referrals assigned to themselves.', 'error');
      return;
    }

    const member = members.find(m => m.memberId === newRef.memberId);
    if (!member) return;

    const idNum = Math.floor(Math.random() * 900000) + 100000;
    const referralId = `REF-${idNum}`;
    const todayStr = '2026-08-10';

    const createdReferral: Referral = {
      ...newRef,
      referralId,
      memberName: `${member.firstName} ${member.lastName}`,
      memberDob: member.dateOfBirth,
      createdDate: todayStr,
      lastUpdated: todayStr,
      auditHistory: [
        {
          timestamp: new Date().toISOString(),
          action: 'CREATED',
          performedBy: currentUser?.name || 'System',
          details: `Referral created for member ${member.firstName} ${member.lastName}. Priority: ${newRef.priority}.`
        }
      ]
    };

    setReferrals(prev => [createdReferral, ...prev]);

    setCoordinators(prev => prev.map(c =>
      c.coordinatorId === newRef.assignedTo
        ? { ...c, activeCases: c.activeCases + 1 }
        : c
    ));

    triggerToast(`Referral ${referralId} successfully created.`, 'success');
  };

  // Update Status
  const handleUpdateStatus = (id: string, newStatus: Referral['status'], operator: string) => {
    if (isReadOnly) {
      triggerToast('Action Denied: Read-only access locks are active.', 'error');
      return;
    }

    const referral = referrals.find(r => r.referralId === id);
    if (!referral) return;

    if (isCoordinator && referral.assignedTo !== 'CC-101') {
      triggerToast('Coordinators can only modify referrals assigned to them.', 'error');
      return;
    }

    setReferrals(prev => prev.map(ref => {
      if (ref.referralId !== id) return ref;

      const auditEntry = {
        timestamp: new Date().toISOString(),
        action: 'STATUS_UPDATE',
        performedBy: operator,
        details: `Status transitioned from ${ref.status} to ${newStatus}.`
      };

      const updated = {
        ...ref,
        status: newStatus,
        lastUpdated: '2026-08-10',
        auditHistory: [...ref.auditHistory, auditEntry]
      };

      if (selectedReferral?.referralId === id) {
        setSelectedReferral(updated);
      }

      return updated;
    }));

    triggerToast(`Referral ${id} marked as ${newStatus.replace('_', ' ')}.`, 'info');
  };

  // Snooze Due Date
  const handleSnoozeDueDate = (id: string, newDate: string, reason: string, _notes: string, operator: string) => {
    if (isReadOnly) {
      triggerToast('Action Denied: Read-only access locks are active.', 'error');
      return;
    }

    const referral = referrals.find(r => r.referralId === id);
    if (!referral) return;

    if (isCoordinator && referral.assignedTo !== 'CC-101') {
      triggerToast('Coordinators can only modify referrals assigned to them.', 'error');
      return;
    }

    setReferrals(prev => prev.map(ref => {
      if (ref.referralId !== id) return ref;

      const auditEntry = {
        timestamp: new Date().toISOString(),
        action: 'SNOOZED',
        performedBy: operator,
        details: `Due date extended to ${newDate}. Reason: ${reason}.`
      };

      const updated = {
        ...ref,
        dueDate: newDate,
        lastUpdated: '2026-08-10',
        auditHistory: [...ref.auditHistory, auditEntry]
      };

      if (selectedReferral?.referralId === id) {
        setSelectedReferral(updated);
      }

      return updated;
    }));

    triggerToast(`Due date extended to ${newDate}.`, 'info');
  };

  // Reassign
  const handleReassign = (id: string, coordinatorId: string, operator: string) => {
    if (isReadOnly) {
      triggerToast('Action Denied: Read-only access locks are active.', 'error');
      return;
    }

    if (!isAdministrator) {
      triggerToast('Only Administrators can reassign referrals.', 'error');
      return;
    }

    const prevCoordId = referrals.find(r => r.referralId === id)?.assignedTo || '';
    const newCoordName = coordinators.find(c => c.coordinatorId === coordinatorId)?.name || coordinatorId;

    setReferrals(prev => prev.map(ref => {
      if (ref.referralId !== id) return ref;

      const auditEntry = {
        timestamp: new Date().toISOString(),
        action: 'ASSIGNED',
        performedBy: operator,
        details: `Reassigned from ${ref.assignedTo} to ${coordinatorId} (${newCoordName}).`
      };

      const updated = {
        ...ref,
        assignedTo: coordinatorId,
        lastUpdated: '2026-08-10',
        auditHistory: [...ref.auditHistory, auditEntry]
      };

      if (selectedReferral?.referralId === id) {
        setSelectedReferral(updated);
      }

      return updated;
    }));

    setCoordinators(prev => prev.map(c => {
      if (c.coordinatorId === prevCoordId) {
        return { ...c, activeCases: Math.max(c.activeCases - 1, 0) };
      }
      if (c.coordinatorId === coordinatorId) {
        return { ...c, activeCases: c.activeCases + 1 };
      }
      return c;
    }));

    triggerToast(`Referral reassigned to ${newCoordName}.`, 'success');
  };

  const handleOpenCreateModalWithMember = (memberId: string) => {
    setPreSelectedMemberId(memberId);
    setIsCreateModalOpen(true);
  };

  // Card filter queries
  const getFilteredReferrals = () => {
    if (activeCardFilter === 'overdue') return referrals.filter(isOverdue);
    if (activeCardFilter === 'active') return referrals.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
    if (activeCardFilter === 'urgent') return referrals.filter(r => r.priority === 'URGENT' && r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
    if (activeCardFilter === 'closed') return referrals.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED');
    return referrals;
  };

  const getWorkloadReferrals = () => {
    const cases = referrals.filter(r => r.assignedTo === 'CC-101');
    if (activeCardFilter === 'overdue') return cases.filter(isOverdue);
    if (activeCardFilter === 'active') return cases.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
    if (activeCardFilter === 'urgent') return cases.filter(r => r.priority === 'URGENT' && r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
    if (activeCardFilter === 'closed') return cases.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED');
    return cases;
  };

  // KPIs
  const activeReferralsCount = referrals.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED').length;
  const overdueReferralsCount = referrals.filter(isOverdue).length;
  const completedTodayCount = referrals.filter(r => r.status === 'COMPLETED').length;

  if (!currentUser) {
    return (
      <>
        <LoginView onLogin={handleLogin} onRegister={handleRegister} />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  const userWithAvatar = {
    ...currentUser,
    avatar: currentUser.email === 'coordinator@optum.com'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
      : (currentUser.role === 'ADMINISTRATOR'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100')
  };

  const activeCoordinator = coordinators.find(c => c.coordinatorId === 'CC-101') || coordinators[0];

  return (
    <div className="h-screen w-screen bg-[#F4F6FA] dark:bg-[#0B0F19] flex flex-row overflow-hidden font-sans">
      {/* Clean Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={userWithAvatar}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogOut={handleLogOut}
      />

      {/* Main Content Viewport */}
      <main className="flex h-full min-w-0 flex-1 flex-col justify-between overflow-y-auto px-5 sm:px-7 py-5">
        <div>
          {/* Reference Style Top Bar: Search Pill + Notification Icons + User Profile Pill */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-3.5 mb-4">
            {/* Global Search Pill */}
            <div className="relative w-full sm:w-84">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything across portal..."
                className="w-full pl-11 pr-4 py-2.5 bg-white/95 dark:bg-[#101726]/95 backdrop-blur-md text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] font-medium rounded-full border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
              />
            </div>

            {/* Top Right: Message, Bell, and Profile Pill */}
            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <button
                title="Messages"
                className="w-10 h-10 rounded-full bg-white/95 dark:bg-[#101726]/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-xs transition-colors cursor-pointer active:scale-95"
              >
                <Mail className="w-4.5 h-4.5" />
              </button>

              <button
                title="Notifications"
                className="relative w-10 h-10 rounded-full bg-white/95 dark:bg-[#101726]/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-xs transition-colors cursor-pointer active:scale-95"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#101726]"></span>
              </button>

              <div className="flex items-center gap-2.5 py-1 px-1.5 pr-3 rounded-full bg-white/95 dark:bg-[#101726]/95 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <img
                  src={userWithAvatar.avatar}
                  alt={userWithAvatar.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                    {userWithAvatar.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">{userWithAvatar.email}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'workload' && isCoordinator && 'My Workflow'}
                {activeTab === 'members' && isAdministrator && '360 Member Profiles'}
                {activeTab === 'overdue' && isAdministrator && 'Overdue Risk Center'}
                {activeTab === 'admin' && isAdministrator && 'Access Control Center'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeTab === 'dashboard' && 'Plan, prioritize, and accomplish your referral tasks with ease.'}
                {activeTab === 'workload' && 'Manage your active personal caseload and patient SLA milestones.'}
                {activeTab === 'members' && 'Comprehensive 360 view of patient demographics and clinical history.'}
                {activeTab === 'overdue' && 'Real-time SLA exposure analytics and emergency resolution tray.'}
                {activeTab === 'admin' && 'Configure user privileges and clinical role permissions.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              {(isAdministrator || isCoordinator) && (
                <button
                  onClick={() => { setPreSelectedMemberId(''); setIsCreateModalOpen(true); }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs sm:text-[13px] font-bold rounded-full transition-all shadow-md shadow-slate-900/10 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Referral
                </button>
              )}

              <button
                onClick={() => triggerToast('Referral summary data exported.', 'info')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 dark:bg-[#101726]/95 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-[13px] font-bold rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Data
              </button>
            </div>
          </div>

          {/* My Workflow Coordinator Profile Header */}
          {activeTab === 'workload' && isCoordinator && (
            <CoordinatorProfileHeader
              coordinator={activeCoordinator}
              referrals={referrals}
              activeCardFilter={activeCardFilter}
              onFilterChange={setActiveCardFilter}
            />
          )}

          {/* 4 KPI Stat Cards (Dashboard & Workload) */}
          {['dashboard', 'workload'].includes(activeTab) && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
              <StatsCard
                title="Total Referrals"
                value={activeTab === 'workload' ? referrals.filter(r => r.assignedTo === 'CC-101').length : referrals.length}
                subtitle="Increased from last month"
                color="blue"
                onClick={() => setActiveCardFilter(prev => prev === 'active' ? null : 'active')}
                isActive={activeCardFilter === 'active'}
              />
              <StatsCard
                title="Ended / Resolved"
                value={activeTab === 'workload' ? referrals.filter(r => r.assignedTo === 'CC-101' && r.status === 'COMPLETED').length : completedTodayCount}
                subtitle="Increased from last month"
                color="green"
                onClick={() => setActiveCardFilter(prev => prev === 'closed' ? null : 'closed')}
                isActive={activeCardFilter === 'closed'}
              />
              <StatsCard
                title="Active In-Progress"
                value={activeTab === 'workload' ? referrals.filter(r => r.assignedTo === 'CC-101' && r.status === 'IN_PROGRESS').length : activeReferralsCount}
                subtitle="Decreased from last month"
                color="purple"
                onClick={() => setActiveCardFilter(prev => prev === 'urgent' ? null : 'urgent')}
                isActive={activeCardFilter === 'urgent'}
              />
              <StatsCard
                title="Pending / At Risk"
                value={activeTab === 'workload' ? referrals.filter(r => r.assignedTo === 'CC-101' && isOverdue(r)).length : overdueReferralsCount}
                subtitle="Needs SLA attention"
                color="red"
                onClick={() => setActiveCardFilter(prev => prev === 'overdue' ? null : 'overdue')}
                isActive={activeCardFilter === 'overdue'}
              />
            </section>
          )}

          {/* Tab Views */}
          <div>
            {activeTab === 'dashboard' && (
              <ReferralsTable
                referrals={getFilteredReferrals()}
                coordinators={coordinators}
                onSelectReferral={setSelectedReferral}
                currentCoordinatorId={currentCoordinatorId}
                userRole={currentUser.role}
              />
            )}

            {activeTab === 'workload' && (
              isCoordinator ? (
                <ReferralsTable
                  referrals={getWorkloadReferrals()}
                  coordinators={coordinators}
                  onSelectReferral={setSelectedReferral}
                  currentCoordinatorId="CC-101"
                  userRole="COORDINATOR"
                />
              ) : (
                <div className="ref-card p-8 text-center rounded-2xl">
                  <AlertCircle className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">Workflow Access Restricted</h3>
                  <p className="text-xs text-slate-400 mt-1">My Workflow is exclusive to Care Coordinators.</p>
                </div>
              )
            )}

            {activeTab === 'members' && isAdministrator && (
              <MembersHubView
                members={members}
                referrals={referrals}
                onSelectReferral={setSelectedReferral}
                onOpenCreateModalWithMember={handleOpenCreateModalWithMember}
                onAddMemberClick={() => setIsCreateMemberModalOpen(true)}
                userRole={currentUser.role}
              />
            )}

            {activeTab === 'overdue' && isAdministrator && (
              <OverdueDashboardView
                referrals={referrals}
                coordinators={coordinators}
                onSelectReferral={setSelectedReferral}
              />
            )}

            {activeTab === 'admin' && isAdministrator && (
              <AdminCenterView
                users={portalUsers}
                onUpdateRole={handleUpdateRole}
                onRemoveUser={handleRemoveUser}
                onInviteUser={handleInviteUser}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pt-4 border-t border-[#EEF2F6] dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400">
          <p>© 2026 OptumCare Clinical Suite. All rights reserved.</p>
          <p className="font-semibold text-slate-500">Live SLA Engine Active • Synthetic Non-PHI Sandbox</p>
        </footer>
      </main>

      {/* Modals & Dialogs */}
      <CreateReferralModal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setPreSelectedMemberId(''); }}
        members={members}
        coordinators={coordinators}
        preSelectedMemberId={preSelectedMemberId}
        onSubmit={handleCreateReferral}
      />

      <CreateMemberModal
        isOpen={isCreateMemberModalOpen}
        onClose={() => setIsCreateMemberModalOpen(false)}
        onSubmit={handleCreateMember}
      />

      <ReferralDetailModal
        isOpen={!!selectedReferral}
        onClose={() => setSelectedReferral(null)}
        referral={selectedReferral}
        coordinators={coordinators}
        members={members}
        onUpdateStatus={handleUpdateStatus}
        onSnoozeDueDate={handleSnoozeDueDate}
        onReassign={handleReassign}
        currentCoordinatorId={currentCoordinatorId}
        userRole={currentUser.role}
      />

      {/* Toast Notification System */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
