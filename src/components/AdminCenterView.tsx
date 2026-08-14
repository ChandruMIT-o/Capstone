import React, { useState } from 'react';
import {
  Shield,
  UserPlus,
  Trash2,
  UserCheck,
  KeyRound
} from 'lucide-react';
import { CustomSelect } from './CustomSelect';

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMINISTRATOR' | 'COORDINATOR' | 'AUDITOR';
  lastActive: string;
}

interface AdminCenterViewProps {
  users: PortalUser[];
  onUpdateRole: (id: string, newRole: PortalUser['role']) => void;
  onRemoveUser: (id: string) => void;
  onInviteUser: (email: string, name: string, role: PortalUser['role']) => void;
}

export const AdminCenterView: React.FC<AdminCenterViewProps> = ({
  users,
  onUpdateRole,
  onRemoveUser,
  onInviteUser
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<PortalUser['role']>('COORDINATOR');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const roleOptions = [
    { value: 'COORDINATOR', label: 'Care Coordinator', color: 'bg-indigo-500' },
    { value: 'ADMINISTRATOR', label: 'System Administrator', color: 'bg-rose-500' },
    { value: 'AUDITOR', label: 'Auditor (Read-Only)', color: 'bg-slate-400' }
  ];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;
    onInviteUser(inviteEmail, inviteName, inviteRole);
    setInviteEmail('');
    setInviteName('');
    setIsInviteOpen(false);
  };

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Top Security & Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="ref-card p-5 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Total System Users</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{users.length} Active</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="ref-card p-5 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Care Coordinators</p>
            <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {users.filter(u => u.role === 'COORDINATOR').length} Staff
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="ref-card p-5 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Security Governance</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">RBAC Enforced</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Users Table Card */}
      <div className="ref-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-4 pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Portal Access Directory</h3>
            <p className="text-xs text-slate-400 mt-0.5">Configure clinical coordinator credentials and access levels</p>
          </div>

          <button
            onClick={() => setIsInviteOpen(!isInviteOpen)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E1E24] hover:bg-black text-white text-xs sm:text-[13px] font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-center"
          >
            <UserPlus className="w-4 h-4" /> Provision New User
          </button>
        </div>

        {/* Invite User Accordion/Form */}
        {isInviteOpen && (
          <form onSubmit={handleInviteSubmit} className="p-5 mb-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3.5 animate-fade-in shadow-inner">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">Provision Access Credentials</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 px-1">User Full Name</label>
                <input
                  type="text"
                  placeholder="Taylor Smith"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 px-1">Email Address</label>
                <input
                  type="email"
                  placeholder="taylor@optum.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1 px-1">Privilege Role</label>
                <CustomSelect
                  options={roleOptions}
                  value={inviteRole}
                  onChange={(val) => setInviteRole(val as any)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-[13px] font-bold rounded-full shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                Save Credentials
              </button>
            </div>
          </form>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto w-full rounded-2xl border border-slate-200/70 dark:border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/90 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role Privilege</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shadow-xs ring-1 ring-slate-200 dark:ring-slate-700">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-[13px]">{user.name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="w-52">
                      <CustomSelect
                        options={roleOptions}
                        value={user.role}
                        onChange={(newRole) => onUpdateRole(user.id, newRole as any)}
                      />
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-medium text-xs">
                    {user.lastActive}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {user.role !== 'ADMINISTRATOR' && (
                      <button
                        onClick={() => onRemoveUser(user.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all ml-auto cursor-pointer"
                        title="Revoke User Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
