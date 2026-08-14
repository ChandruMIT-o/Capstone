import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, role: 'ADMINISTRATOR' | 'COORDINATOR' | 'AUDITOR', name: string) => void;
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

    if (email === 'admin@optum.com') {
      if (password === 'admin123') {
        onLogin(email, 'ADMINISTRATOR', 'System Administrator');
      } else {
        setError('Incorrect administrator password');
      }
    } else if (email === 'coordinator@optum.com') {
      if (password === 'coordinator123') {
        onLogin(email, 'COORDINATOR', 'Jordan Lee');
      } else {
        setError('Incorrect coordinator password');
      }
    } else if (email === 'visitor@optum.com') {
      if (password === 'visitor123') {
        onLogin(email, 'AUDITOR', 'Visitor User');
      } else {
        setError('Incorrect visitor password');
      }
    } else {
      if (password.length >= 6) {
        onLogin(email, 'COORDINATOR', email.split('@')[0]);
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

    if (emailVal === 'admin@optum.com') {
      onLogin(emailVal, 'ADMINISTRATOR', 'System Administrator');
    } else if (emailVal === 'coordinator@optum.com') {
      onLogin(emailVal, 'COORDINATOR', 'Jordan Lee');
    } else if (emailVal === 'visitor@optum.com') {
      onLogin(emailVal, 'AUDITOR', 'Visitor User');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#F4F6FA] dark:bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[45%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#131B2E] rounded-2xl border border-[#EEF2F6] dark:border-slate-800 shadow-xl p-6 sm:p-8 relative z-10 animate-pop-in">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Optum<span className="text-indigo-600 dark:text-indigo-400">Care</span> Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Care Coordination &amp; Referral SLA Management
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-full mb-6 border border-slate-200/60 dark:border-slate-700 shadow-inner">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2.5 text-xs sm:text-[13px] font-extrabold rounded-full transition-all cursor-pointer ${activeTab === 'login'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-2.5 text-xs sm:text-[13px] font-extrabold rounded-full transition-all cursor-pointer ${activeTab === 'register'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3.5 mb-4 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 text-xs font-bold rounded-2xl border border-rose-200 dark:border-rose-800 animate-pop-in">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3.5 mb-4 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 text-xs font-bold rounded-2xl border border-emerald-200 dark:border-emerald-800 animate-pop-in">
            {success}
          </div>
        )}

        {/* Forms */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  placeholder="name@optum.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-slate-50/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs sm:text-[13px] font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer mt-2"
            >
              Sign In to Portal
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">Full Name</label>
              <input
                type="text"
                value={name}
                placeholder="Dr. Alex Vance"
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4.5 py-3 bg-slate-50/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">Email</label>
              <input
                type="email"
                value={email}
                placeholder="alex.vance@optum.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4.5 py-3 bg-slate-50/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">Password</label>
                <input
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50/90 dark:bg-slate-800 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 shadow-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="••••••••"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50/90 dark:bg-slate-800 text-xs sm:text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 shadow-xs"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs sm:text-[13px] font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer mt-2"
            >
              Create Account
            </button>
          </form>
        )}

        {/* Quick Demo Sign In Pills */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
            One-Click Demo Accounts
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@optum.com', 'admin123')}
              className="py-2.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 rounded-full border border-slate-200/60 dark:border-slate-700 text-center transition-all text-xs font-bold cursor-pointer shadow-xs active:scale-95"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('coordinator@optum.com', 'coordinator123')}
              className="py-2.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 rounded-full border border-slate-200/60 dark:border-slate-700 text-center transition-all text-xs font-bold cursor-pointer shadow-xs active:scale-95"
            >
              Coordinator
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('visitor@optum.com', 'visitor123')}
              className="py-2.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 rounded-full border border-slate-200/60 dark:border-slate-700 text-center transition-all text-xs font-bold cursor-pointer shadow-xs active:scale-95"
            >
              Auditor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
