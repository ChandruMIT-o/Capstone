import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Users,
  ShieldAlert,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: { name: string; avatar: string; role: string; email?: string };
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onLogOut?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: 'default' | 'live' | 'alert';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  darkMode,
  setDarkMode,
  onLogOut
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Navigation Items
  const primaryMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Live', badgeType: 'live' }
  ];

  if (currentUser.role === 'COORDINATOR') {
    primaryMenuItems.push({ id: 'workload', label: 'My Workflow', icon: Layers, badge: 'Cases' });
  }

  if (currentUser.role === 'ADMINISTRATOR') {
    primaryMenuItems.push({ id: 'members', label: 'Members 360', icon: Users, badge: '360°' });
    primaryMenuItems.push({ id: 'overdue', label: 'Risk Center', icon: ShieldAlert, badge: 'Risk', badgeType: 'alert' });
  }

  const generalMenuItems: MenuItem[] = [];
  if (currentUser.role === 'ADMINISTRATOR') {
    generalMenuItems.push({ id: 'admin', label: 'Access Control', icon: Settings });
  }

  const primaryActiveIndex = primaryMenuItems.findIndex((item) => item.id === activeTab);
  const generalActiveIndex = generalMenuItems.findIndex((item) => item.id === activeTab);

  return (
    <aside className="h-full py-3.5 pl-3.5 sm:py-4 sm:pl-4 flex shrink-0 select-none z-30">
      <div
        className={`h-full bg-white/95 dark:bg-[#101726]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-[2.25rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] flex flex-col justify-between p-3.5 transition-all duration-300 relative ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all cursor-pointer z-40"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Top Section: Brand & Nav Links */}
        <div className="flex flex-col space-y-5 overflow-y-auto no-scrollbar">
          {/* Minimal Brand Pill Header */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2.5 cursor-pointer group ${
              isCollapsed ? 'justify-center py-1' : 'px-2 py-1'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Activity className="w-4.5 h-4.5" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Optum<span className="text-indigo-600 dark:text-indigo-400">Care</span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Clinical Suite</p>
              </div>
            )}
          </div>

          {/* Navigation Pill List */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 py-1">
                Menu
              </p>
            )}

            <ul className="space-y-1.5 relative">
              {/* Morphing Active Selection Overlay */}
              {primaryActiveIndex !== -1 && (
                <div
                  className={`absolute rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-md shadow-indigo-500/25 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isCollapsed ? 'left-1/2 -translate-x-1/2 w-10 h-10' : 'left-0 right-0 h-10'
                  }`}
                  style={{
                    top: `${primaryActiveIndex * 46}px`
                  }}
                />
              )}

              {primaryMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id} className="relative h-10">
                    <button
                      onClick={() => setActiveTab(item.id)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`w-full h-10 flex items-center rounded-full text-xs font-medium transition-colors duration-200 group relative z-10 cursor-pointer ${
                        isCollapsed
                          ? 'justify-center w-10 mx-auto p-0'
                          : 'gap-3 px-3.5'
                      } ${
                        isActive
                          ? 'text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                        }`}
                      />

                      {!isCollapsed && (
                        <>
                          <span className="truncate flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider transition-colors duration-200 ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : item.badgeType === 'live'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : item.badgeType === 'alert'
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>

                    {/* Minimal Tooltip for Collapsed View */}
                    {isCollapsed && hoveredItem === item.id && (
                      <div className="fixed left-20 z-50 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium rounded-full shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap animate-pop-in">
                        {item.label}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* General Section */}
          {generalMenuItems.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              {!isCollapsed && (
                <p className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 py-1">
                  General
                </p>
              )}

              <ul className="space-y-1.5 relative">
                {/* Morphing Active Selection Overlay */}
                {generalActiveIndex !== -1 && (
                  <div
                    className={`absolute rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-md shadow-indigo-500/25 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isCollapsed ? 'left-1/2 -translate-x-1/2 w-10 h-10' : 'left-0 right-0 h-10'
                    }`}
                    style={{
                      top: `${generalActiveIndex * 46}px`
                    }}
                  />
                )}

                {generalMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id} className="relative h-10">
                      <button
                        onClick={() => setActiveTab(item.id)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`w-full h-10 flex items-center rounded-full text-xs font-medium transition-colors duration-200 group relative z-10 cursor-pointer ${
                          isCollapsed
                            ? 'justify-center w-10 mx-auto p-0'
                            : 'gap-3 px-3.5'
                        } ${
                          isActive
                            ? 'text-white font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 transition-transform group-hover:scale-110 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                          }`}
                        />

                        {!isCollapsed && (
                          <span className="truncate flex-1 text-left">{item.label}</span>
                        )}
                      </button>

                      {isCollapsed && hoveredItem === item.id && (
                        <div className="fixed left-20 z-50 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium rounded-full shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap animate-pop-in">
                          {item.label}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Section: Theme Switcher & Minimal User Pill */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {/* Morphing Theme Toggle */}
          {isCollapsed ? (
            /* Collapsed Mode: Vertical Pill (Dark Top, Light Bottom) */
            <div className="relative mx-auto w-10 p-1 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800/80 flex flex-col items-center gap-1 shadow-inner">
              {/* Morphing Selection Pill */}
              <div
                className={`absolute left-1 w-8 h-8 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  darkMode
                    ? 'top-1 bg-[#1E293B] shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500/30'
                    : 'top-10 bg-white shadow-md shadow-amber-500/10 ring-1 ring-slate-200'
                }`}
              />

              {/* Dark Mode Button (Top) */}
              <button
                onClick={() => setDarkMode(true)}
                title="Dark Mode"
                onMouseEnter={() => setHoveredItem('theme-dark')}
                onMouseLeave={() => setHoveredItem(null)}
                className="w-8 h-8 rounded-full relative z-10 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
              >
                <Moon
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    darkMode
                      ? 'text-indigo-400 scale-110 drop-shadow-[0_0_6px_rgba(129,140,248,0.5)]'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                />
              </button>

              {/* Light Mode Button (Bottom) */}
              <button
                onClick={() => setDarkMode(false)}
                title="Light Mode"
                onMouseEnter={() => setHoveredItem('theme-light')}
                onMouseLeave={() => setHoveredItem(null)}
                className="w-8 h-8 rounded-full relative z-10 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
              >
                <Sun
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    !darkMode
                      ? 'text-amber-500 scale-110 rotate-45 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                />
              </button>

              {/* Collapsed Tooltip */}
              {hoveredItem === 'theme-dark' && (
                <div className="fixed left-20 bottom-16 z-50 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium rounded-full shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap animate-pop-in">
                  Dark Mode
                </div>
              )}
              {hoveredItem === 'theme-light' && (
                <div className="fixed left-20 bottom-8 z-50 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium rounded-full shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap animate-pop-in">
                  Light Mode
                </div>
              )}
            </div>
          ) : (
            /* Expanded Mode: Horizontal Segmented Pill */
            <div className="relative p-1 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800/80 flex items-center shadow-inner">
              {/* Morphing Selection Pill */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  !darkMode
                    ? 'left-1 bg-white shadow-md shadow-slate-300/40 dark:shadow-none ring-1 ring-slate-200/80'
                    : 'left-[calc(50%+2px)] bg-[#1E293B] shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500/30'
                }`}
              />

              {/* Light Mode Button */}
              <button
                onClick={() => setDarkMode(false)}
                title="Light Mode"
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-[11px] font-semibold relative z-10 transition-colors duration-200 cursor-pointer select-none"
              >
                <Sun
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    !darkMode
                      ? 'text-amber-500 scale-110 rotate-45 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]'
                      : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                  }`}
                />
                <span
                  className={`transition-colors duration-200 ${
                    !darkMode
                      ? 'text-slate-900 font-bold'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Light
                </span>
              </button>

              {/* Dark Mode Button */}
              <button
                onClick={() => setDarkMode(true)}
                title="Dark Mode"
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-[11px] font-semibold relative z-10 transition-colors duration-200 cursor-pointer select-none"
              >
                <Moon
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    darkMode
                      ? 'text-indigo-400 scale-110 drop-shadow-[0_0_6px_rgba(129,140,248,0.4)]'
                      : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                  }`}
                />
                <span
                  className={`transition-colors duration-200 ${
                    darkMode
                      ? 'text-white font-bold'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Dark
                </span>
              </button>
            </div>
          )}

          {/* Minimal User Profile Capsule Pill */}
          <div
            className={`p-1.5 rounded-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between pl-2 pr-1.5'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white dark:ring-[#101726]"></span>
              </div>

              {!isCollapsed && (
                <div className="min-w-0 pr-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium truncate capitalize">
                    {currentUser.role.toLowerCase()}
                  </p>
                </div>
              )}
            </div>

            {/* Logout Icon Button */}
            {onLogOut && !isCollapsed && (
              <button
                onClick={onLogOut}
                title="Log Out"
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-95 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
