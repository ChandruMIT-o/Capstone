import React, { useState } from 'react';
import { Shield, Mail, Lock, User, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, role: 'ADMIN' | 'READ_WRITE' | 'READ_ONLY', name: string) => void;
  onRegister: (email: string, name: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegister }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Verification for demo accounts
    if (email === 'admin@optum.com') {
      if (password === 'admin123') {
        onLogin(email, 'ADMIN', 'System Administrator');
      } else {
        setError('Incorrect administrator password');
      }
    } else if (email === 'coordinator@optum.com') {
      if (password === 'coordinator123') {
        onLogin(email, 'READ_WRITE', 'Jordan Lee');
      } else {
        setError('Incorrect coordinator password');
      }
    } else if (email === 'visitor@optum.com') {
      if (password === 'visitor123') {
        onLogin(email, 'READ_ONLY', 'Visitor User');
      } else {
        setError('Incorrect visitor password');
      }
    } else {
      // Simulate login for any custom registered user
      if (password.length >= 6) {
        onLogin(email, 'READ_WRITE', email.split('@')[0]);
      } else {
        setError('Password must be at least 6 characters long');
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    onRegister(email, name);
    setSuccess('Registration successful! You can now log in.');
    setEmail(email);
    setPassword(password);
    setTimeout(() => {
      setActiveTab('login');
      setSuccess('');
    }, 1500);
  };

  const handleQuickLogin = (emailVal: string, passVal: string) => {
    setEmail(emailVal);
    setPassword(passVal);
    setError('');

    // Trigger immediate login
    if (emailVal === 'admin@optum.com') {
      onLogin(emailVal, 'ADMIN', 'System Administrator');
    } else if (emailVal === 'coordinator@optum.com') {
      onLogin(emailVal, 'READ_WRITE', 'Jordan Lee');
    } else if (emailVal === 'visitor@optum.com') {
      onLogin(emailVal, 'READ_ONLY', 'Visitor User');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glowing decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-slate-950/65 backdrop-blur-md rounded-3xl border border-slate-800/80 shadow-2xl p-8 relative z-10 animate-fade-in">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-white text-slate-950 rounded-2xl flex items-center justify-center shadow-lg mb-3">
            <Shield className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Optum CarePortal</h2>
          <p className="text-xs text-slate-400 mt-1 text-center">
            Secured caseload management & care coordination tracking
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl mb-6 border border-slate-800/40">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'register'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form error/success messages */}
        {error && (
          <div className="p-3 mb-4 bg-rose-950/30 text-rose-400 text-xs font-semibold rounded-xl border border-rose-900/30 flex items-center gap-2">
            <Shield className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 mb-4 bg-emerald-950/30 text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-900/30 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Sign In Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Workplace Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@optum.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 text-white text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-900/50 text-white text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 mt-6 cursor-pointer active:scale-98"
            >
              Access System <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 text-white text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Workplace Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@optum.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 text-white text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-900/50 text-white text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-900/50 text-white text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 mt-6 cursor-pointer active:scale-98"
            >
              Register Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Demo Accounts Panel */}
        <div className="mt-8 border-t border-slate-800/80 pt-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-4">
            Authorized Demonstration Accounts
          </p>
          <div className="space-y-2.5">
            <button
              onClick={() => handleQuickLogin('admin@optum.com', 'admin123')}
              className="w-full p-3 bg-slate-900/40 hover:bg-slate-900 text-left border border-slate-800 rounded-2xl transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  System Administrator
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Role: ADMIN • Can manage user roles</div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700/30">
                admin123
              </span>
            </button>

            <button
              onClick={() => handleQuickLogin('coordinator@optum.com', 'coordinator123')}
              className="w-full p-3 bg-slate-900/40 hover:bg-slate-900 text-left border border-slate-800 rounded-2xl transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Care Coordinator (Jordan Lee)
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Role: READ-WRITE • Standard dashboard caseload</div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700/30">
                coordinator123
              </span>
            </button>

            <button
              onClick={() => handleQuickLogin('visitor@optum.com', 'visitor123')}
              className="w-full p-3 bg-slate-900/40 hover:bg-slate-900 text-left border border-slate-800 rounded-2xl transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  Auditor Account (Read-Only)
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Role: READ-ONLY • View-only portal directories</div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700/30">
                visitor123
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
