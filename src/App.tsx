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
import { RemindersPanel } from './components/RemindersPanel';
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
import type { PortalUser } from './components/AdminCenterView';
import { 
  Plus, 
  AlertTriangle, 
  Activity, 
  FileCheck
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
    { id: 'USR-101', name: 'System Administrator', email: 'admin@optum.com', role: 'ADMIN', lastActive: 'Active Now' },
    { id: 'USR-102', name: 'Jordan Lee', email: 'coordinator@optum.com', role: 'READ_WRITE', lastActive: 'Active Now' },
    { id: 'USR-103', name: 'Visitor User', email: 'visitor@optum.com', role: 'READ_ONLY', lastActive: 'Active Now' }
  ]);
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null);

  // Seeding the mock data on component load
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
  const isReadOnly = currentUser?.role === 'READ_ONLY';

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
    triggerToast(`Logged in as ${name}.`, 'success');
  };

  const handleRegister = (email: string, name: string) => {
    const newUser: PortalUser = {
      id: `USR-${Math.floor(Math.random() * 900) + 100}`,
      name,
      email,
      role: 'READ_WRITE',
      lastActive: 'Registered'
    };
    setPortalUsers(prev => [...prev, newUser]);
    triggerToast('Account registered! You can now sign in.', 'success');
  };

  const handleLogOut = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    setActiveCardFilter(null);
    triggerToast('Logged out of care coordination portal.', 'info');
  };

  // Admin access modifications
  const handleUpdateRole = (id: string, newRole: PortalUser['role']) => {
    setPortalUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const updated = { ...u, role: newRole };
      // Sync currentUser if they updated their own role
      if (currentUser && currentUser.id === id) {
        setCurrentUser(updated);
      }
      return updated;
    }));
    triggerToast('User privilege updated successfully.', 'success');
  };

  const handleRemoveUser = (id: string) => {
    setPortalUsers(prev => prev.filter(u => u.id !== id));
    triggerToast('User access credentials revoked.', 'info');
  };

  const handleInviteUser = (email: string, name: string, role: PortalUser['role']) => {
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
    const memberId = `MBR-${Math.floor(Math.random() * 900000) + 100000}`;
    const newMember: Member = {
      ...memberData,
      memberId
    };
    setMembers(prev => [...prev, newMember]);
    triggerToast(`Registered synthetic member ${memberData.firstName} ${memberData.lastName}.`, 'success');
  };

  // Action: Create Referral
  const handleCreateReferral = (newRef: Omit<Referral, 'referralId' | 'createdDate' | 'lastUpdated' | 'auditHistory'>) => {
    if (isReadOnly) {
      triggerToast('Action Denied: Read-only access locks are active.', 'error');
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
          details: `Referral created for member ${member.firstName} ${member.lastName}. Initial notes: ${newRef.notes}`
        }
      ]
    };

    setReferrals(prev => [createdReferral, ...prev]);

    // Recalculate coordinator workload counts
    setCoordinators(prev => prev.map(c => 
      c.coordinatorId === newRef.assignedTo 
        ? { ...c, activeCases: c.activeCases + 1 }
        : c
    ));

    triggerToast(`Referral ${referralId} successfully created.`, 'success');
  };

  // Action: Update Referral Status
  const handleUpdateStatus = (id: string, newStatus: Referral['status'], operator: string) => {
    if (isReadOnly) {
      triggerToast('Action Denied: Read-only access locks are active.', 'error');
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

    triggerToast(`Referral ${id} status updated to ${newStatus.replace('_', ' ')}.`, 'info');
  };

  // Action: Snooze / Extend Due Date
  const handleSnoozeDueDate = (id: string, newDate: string, reason: string, notes: string, operator: string) => {
    if (isReadOnly) {
      triggerToast('Action Denied: Read-only access locks are active.', 'error');
      return;
    }
    setReferrals(prev => prev.map(ref => {
      if (ref.referralId !== id) return ref;

      const auditEntry = {
        timestamp: new Date().toISOString(),
        action: 'SNOOZED',
        performedBy: operator,
        details: `Due date extended from ${ref.dueDate} to ${newDate}. Reason: ${reason}. justification: ${notes}`
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

    triggerToast(`Due date for ${id} extended to ${newDate}.`, 'info');
  };

  // Action: Reassign Coordinator
  const handleReassign = (id: string, coordinatorId: string, operator: string) => {
    if (isReadOnly) {
      triggerToast('Action Denied: Read-only access locks are active.', 'error');
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
        details: `Reassigned coordinator from ${ref.assignedTo} to ${coordinatorId} (${newCoordName}).`
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

    // Adjust coordinator active cases metrics
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

  // Handle open create modal pre-filled with member
  const handleOpenCreateModalWithMember = (memberId: string) => {
    setPreSelectedMemberId(memberId);
    setIsCreateModalOpen(true);
  };

  // Calculate filtered caseload listings for dashboard grid
  const getFilteredReferrals = () => {
    if (activeCardFilter === 'overdue') {
      return referrals.filter(isOverdue);
    }
    if (activeCardFilter === 'active') {
      return referrals.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
    }
    if (activeCardFilter === 'urgent') {
      return referrals.filter(r => r.priority === 'URGENT' && r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
    }
    if (activeCardFilter === 'closed') {
      return referrals.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED');
    }
    return referrals;
  };

  // Filters for workload tab (Jordan Lee CC-101 workload)
  const getWorkloadReferrals = () => {
    const cases = referrals.filter(r => r.assignedTo === 'CC-101');
    if (activeCardFilter === 'overdue') {
      return cases.filter(isOverdue);
    }
    if (activeCardFilter === 'active') {
      return cases.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
    }
    if (activeCardFilter === 'urgent') {
      return cases.filter(r => r.priority === 'URGENT' && r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
    }
    if (activeCardFilter === 'closed') {
      return cases.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED');
    }
    return cases;
  };

  // Calculated KPI stats
  const activeReferralsCount = referrals.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED').length;
  const overdueReferralsCount = referrals.filter(isOverdue).length;
  const urgentCount = referrals.filter(r => r.priority === 'URGENT' && r.status !== 'COMPLETED' && r.status !== 'CANCELLED').length;
  const completedTodayCount = referrals.filter(r => r.status === 'COMPLETED').length;

  // If not logged in, render authentication wall
  if (!currentUser) {
    return (
      <>
        <LoginView onLogin={handleLogin} onRegister={handleRegister} />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  const userWithAvatar = currentUser ? {
    ...currentUser,
    avatar: currentUser.email === 'coordinator@optum.com' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
      : (currentUser.role === 'ADMIN'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100')
  } : { name: '', avatar: '', role: '' };

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-slate-900 flex flex-row overflow-hidden font-sans">
        
        {/* Sidebar Left Component */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentUser={userWithAvatar}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogOut={handleLogOut}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-h-0 h-full p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Top Header Bar */}
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
                  {activeTab === 'dashboard' && "Care Coordination Command"}
                  {activeTab === 'workload' && "My Assigned Cases"}
                  {activeTab === 'members' && "360 Member Profiles"}
                  {activeTab === 'overdue' && "Overdue Risk Center"}
                  {activeTab === 'admin' && "Git Privilege Authority"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <span>Active workspace date: <strong className="text-slate-700 dark:text-slate-350">August 10, 2026</strong></span>
                  <span>•</span>
                  <span className="capitalize px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded">
                    Privilege: {currentUser.role.replace('_', ' ').toLowerCase()}
                  </span>
                </p>
              </div>

              {/* Header Right Action Area */}
              <div className="flex items-center gap-3">
                {isReadOnly ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold rounded-xl border border-slate-200/50 dark:border-slate-700/60 select-none">
                    🔒 Read-only Account
                  </div>
                ) : (
                  <button
                    onClick={() => { setPreSelectedMemberId(''); setIsCreateModalOpen(true); }}
                    className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-slate-950 hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4.5 h-4.5" /> Add Referral
                  </button>
                )}
              </div>
            </header>

            {/* Render Dashboard Statistics Widgets (Only on Dashboard and Workload tabs) */}
            {['dashboard', 'workload'].includes(activeTab) && (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatsCard
                  title="Overdue Referrals"
                  value={activeTab === 'workload' ? referrals.filter(r => r.assignedTo === 'CC-101' && isOverdue(r)).length : overdueReferralsCount}
                  subtitle={activeTab === 'workload' ? "My cases past target SLA" : "Global overdue items"}
                  trend={`${activeTab === 'workload' ? 'Risk cases' : 'Needs attention'}`}
                  trendDirection="down"
                  color="red"
                  icon={AlertTriangle}
                  onClick={() => setActiveCardFilter(prev => prev === 'overdue' ? null : 'overdue')}
                  isActive={activeCardFilter === 'overdue'}
                />
                <StatsCard
                  title="Active Interventions"
                  value={activeTab === 'workload' ? referrals.filter(r => r.assignedTo === 'CC-101' && r.status !== 'COMPLETED' && r.status !== 'CANCELLED').length : activeReferralsCount}
                  subtitle={activeTab === 'workload' ? "Cases currently in my caseload" : "Caseload tracking open"}
                  trend="+4 this wk"
                  trendDirection="up"
                  color="purple"
                  icon={Activity}
                  onClick={() => setActiveCardFilter(prev => prev === 'active' ? null : 'active')}
                  isActive={activeCardFilter === 'active'}
                />
                <StatsCard
                  title="Urgent Priority"
                  value={activeTab === 'workload' ? referrals.filter(r => r.assignedTo === 'CC-101' && r.priority === 'URGENT' && r.status !== 'COMPLETED' && r.status !== 'CANCELLED').length : urgentCount}
                  subtitle="Requiring immediate action"
                  trend="High Alert"
                  trendDirection="neutral"
                  color="peach"
                  icon={AlertTriangle}
                  onClick={() => setActiveCardFilter(prev => prev === 'urgent' ? null : 'urgent')}
                  isActive={activeCardFilter === 'urgent'}
                />
                <StatsCard
                  title="Closed Cases"
                  value={activeTab === 'workload' ? referrals.filter(r => r.assignedTo === 'CC-101' && r.status === 'COMPLETED').length : completedTodayCount}
                  subtitle={activeTab === 'workload' ? "Total cases resolved by me" : "System total resolved cases"}
                  trend="Resolved"
                  trendDirection="up"
                  color="green"
                  icon={FileCheck}
                  onClick={() => setActiveCardFilter(prev => prev === 'closed' ? null : 'closed')}
                  isActive={activeCardFilter === 'closed'}
                />
              </section>
            )}

            {/* Tab Views Switching */}
            <div className="space-y-6">
              {activeTab === 'dashboard' && (
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Referrals Table Left Grid */}
                  <div className="flex-1 min-w-0">
                    {activeCardFilter && (
                      <div className="p-3 mb-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                        <span className="capitalize">
                          Filtered by Stats Card: <strong>{activeCardFilter.replace('_', ' ')}</strong> ({getFilteredReferrals().length} results)
                        </span>
                        <button 
                          onClick={() => setActiveCardFilter(null)}
                          className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 rounded-lg font-bold transition-all cursor-pointer active:scale-95"
                        >
                          Clear Filter
                        </button>
                      </div>
                    )}
                    <ReferralsTable 
                      referrals={getFilteredReferrals()} 
                      coordinators={coordinators}
                      onSelectReferral={setSelectedReferral}
                    />
                  </div>
                  
                  {/* Right Reminders Panel */}
                  <div className="shrink-0">
                    <RemindersPanel 
                      referrals={referrals} 
                      onSelectReferral={setSelectedReferral} 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'workload' && (
                <div className="animate-slide-in">
                  <div className="bg-slate-50/50 dark:bg-slate-900/40 p-4.5 mb-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm shrink-0">
                      CC
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">CASES ASSIGNED TO JORDAN LEE</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Filter automatically applied for CC-101. Workload balancing status: Active.</p>
                    </div>
                  </div>

                  {activeCardFilter && (
                    <div className="p-3 mb-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                      <span className="capitalize">
                        Filtered workload by: <strong>{activeCardFilter.replace('_', ' ')}</strong> ({getWorkloadReferrals().length} results)
                      </span>
                      <button 
                        onClick={() => setActiveCardFilter(null)}
                        className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 rounded-lg font-bold transition-all cursor-pointer active:scale-95"
                      >
                        Clear Filter
                      </button>
                    </div>
                  )}

                  <ReferralsTable 
                    referrals={getWorkloadReferrals()} 
                    coordinators={coordinators}
                    onSelectReferral={setSelectedReferral}
                  />
                </div>
              )}

              {activeTab === 'members' && (
                <MembersHubView 
                  members={members} 
                  referrals={referrals} 
                  onSelectReferral={setSelectedReferral}
                  onOpenCreateModalWithMember={handleOpenCreateModalWithMember}
                  onAddMemberClick={() => setIsCreateMemberModalOpen(true)}
                  userRole={currentUser.role}
                />
              )}

              {activeTab === 'overdue' && (
                <OverdueDashboardView 
                  referrals={referrals} 
                  coordinators={coordinators} 
                  onSelectReferral={setSelectedReferral}
                />
              )}

              {activeTab === 'admin' && currentUser.role === 'ADMIN' && (
                <AdminCenterView 
                  users={portalUsers}
                  onUpdateRole={handleUpdateRole}
                  onRemoveUser={handleRemoveUser}
                  onInviteUser={handleInviteUser}
                />
              )}
            </div>
          </div>

          {/* Footer Branding details */}
          <footer className="mt-12 pt-6 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400">
            <p>© 2026 Optum-style Enterprise Ecosystem. All rights reserved.</p>
            <p className="font-semibold text-emerald-500">✅ Clean Audit Trails & Synthetic Non-PHI System Active</p>
          </footer>
        </main>

      {/* Modals & Dialogs Components */}
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

      {/* detail modal */}
      <ReferralDetailModal 
        isOpen={!!selectedReferral} 
        onClose={() => setSelectedReferral(null)}
        referral={selectedReferral}
        coordinators={coordinators}
        members={members}
        onUpdateStatus={handleUpdateStatus}
        onSnoozeDueDate={handleSnoozeDueDate}
        onReassign={handleReassign}
      />

      {/* Custom Toast popup system overlay */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
