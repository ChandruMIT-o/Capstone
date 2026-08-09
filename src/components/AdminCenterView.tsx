import React, { useState } from 'react';
import { UserCheck, Trash2, Mail, Plus, ShieldAlert, KeyRound } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'READ_WRITE' | 'READ_ONLY';
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
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'READ_WRITE' | 'READ_ONLY'>('READ_ONLY');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [error, setError] = useState('');

  const roleOptions = [
    { value: 'ADMIN', label: 'Admin (Full)', color: 'bg-rose-500' },
    { value: 'READ_WRITE', label: 'Read-Write', color: 'bg-indigo-500' },
    { value: 'READ_ONLY', label: 'Read-Only', color: 'bg-sky-500' }
  ];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inviteEmail || !inviteName) {
      setError('Please fill in all fields.');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === inviteEmail.toLowerCase())) {
      setError('A user with this email already exists.');
      return;
    }

    onInviteUser(inviteEmail, inviteName, inviteRole);
    setInviteEmail('');
    setInviteName('');
    setInviteRole('READ_ONLY');
    setIsInviteModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-slide-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-emerald-500" />
            Git-Style Permissions & Access Manager
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Authorize care coordinators, change system permissions, and revoke operational access keys.
          </p>
        </div>

        <button
          onClick={() => { setError(''); setIsInviteModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Provision Access
        </button>
      </div>

      {/* User Table Grid */}
      <div className="overflow-x-auto w-full -mx-6 px-6">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-wider">
              <th className="pb-3.5 pl-4">Portal Member</th>
              <th className="pb-3.5">Email Address</th>
              <th className="pb-3.5">System Privilege Level</th>
              <th className="pb-3.5">Last Portal Activity</th>
              <th className="pb-3.5 text-right pr-4">Revoke Keys</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850/30">
            {users.map((user) => {
              return (
                <tr 
                  key={user.id} 
                  className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors text-slate-700 dark:text-slate-300 text-sm"
                >
                  <td className="py-4 pl-4 font-semibold text-slate-900 dark:text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p>{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="w-44">
                      <CustomSelect
                        options={roleOptions}
                        value={user.role}
                        onChange={(val) => onUpdateRole(user.id, val as any)}
                        placeholder="Select role..."
                      />
                    </div>
                  </td>
                  <td className="py-4 text-slate-500 dark:text-slate-400 text-xs">
                    {user.lastActive}
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button
                      onClick={() => onRemoveUser(user.id)}
                      disabled={user.email === 'admin@optum.com'}
                      className={`p-2 rounded-xl transition-all duration-200
                        ${user.email === 'admin@optum.com' 
                          ? 'text-slate-300 dark:text-slate-800 cursor-not-allowed' 
                          : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer active:scale-95'
                        }`}
                      title="Revoke and delete user access keys"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-60 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-in">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                Provision Access Keys
              </h3>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Staff Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Taylor Morgan"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Workplace Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="taylor.morgan@optum.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Assign System Role
                </label>
                <CustomSelect
                  options={roleOptions}
                  value={inviteRole}
                  onChange={(val) => setInviteRole(val as any)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-sm font-bold rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  Authorize Keys
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
