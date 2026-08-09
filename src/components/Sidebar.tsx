import React from 'react';
import { 
  Home, 
  Layers, 
  Users, 
  AlertTriangle, 
  Settings, 
  LogOut,
  Heart,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: { name: string; avatar: string; role: string };
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onLogOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser,
  darkMode,
  setDarkMode,
  onLogOut
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'workload', label: 'My Workload', icon: Layers },
    { id: 'members', label: 'Members Hub', icon: Users },
    { id: 'overdue', label: 'Overdue Board', icon: AlertTriangle },
  ];

  if (currentUser.role === 'ADMIN') {
    menuItems.push({ id: 'admin', label: 'Admin Center', icon: Settings });
  }

  return (
    <div className="w-18 md:w-20 bg-slate-950 text-slate-400 flex flex-col items-center justify-between py-6 shadow-xl shrink-0">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 bg-white text-slate-900 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
          <Heart className="w-7 h-7 text-emerald-500 fill-emerald-500" />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-4 mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group
                  ${isActive 
                    ? 'bg-slate-800 text-white shadow-inner scale-105 border border-slate-700/50' 
                    : 'hover:bg-slate-900/60 hover:text-slate-200'
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-emerald-400' : ''}`} />
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-400 rounded-l-full" />
                )}
                
                {/* Tooltip */}
                <div className="absolute left-16 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-md">
                  {item.label}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Settings */}
      <div className="flex flex-col items-center gap-5 w-full px-2">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Light/Dark Theme"
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-900 text-slate-400 hover:text-white transition-all duration-200 active:scale-90"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-400 fill-amber-400/25" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <button
          title="App Settings"
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-900 text-slate-400 hover:text-white transition-colors duration-200"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-[1px] w-8 bg-slate-800" />

        <div className="relative group">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800 group-hover:ring-emerald-500/50 transition-all duration-300 cursor-pointer"
          />
          <div className="absolute left-14 bottom-1 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-md">
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 capitalize">{currentUser.role}</p>
          </div>
        </div>

        <button
          onClick={onLogOut}
          title="Log Out"
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-950/40 text-slate-500 hover:text-red-400 transition-colors duration-200 mt-2 cursor-pointer active:scale-90"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
