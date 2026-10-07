import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket as TicketIcon,
  BarChart2,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCheck,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onOpenCreateTicket: () => void;
  onOpenAiCopilot?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  onOpenCreateTicket,
  onOpenAiCopilot,
}) => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/app', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { label: 'Ticket Queue', path: '/app/tickets', icon: <TicketIcon className="w-4 h-4 shrink-0" /> },
    {
      label: 'Analytics',
      path: '/app/analytics',
      icon: <BarChart2 className="w-4 h-4 shrink-0" />,
      adminOnly: true,
    },
    { label: 'Settings', path: '/app/settings', icon: <Settings className="w-4 h-4 shrink-0" /> },
  ];

  const handleRoleChange = async (role: UserRole) => {
    await switchRole(role);
  };

  return (
    <aside
      className={`h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 z-30 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <NavLink to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {!collapsed && (
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                Resolve<span className="text-indigo-600 dark:text-indigo-400">HQ</span>
              </span>
            )}
          </NavLink>

          <button
            onClick={onToggle}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Action: New Ticket & AI Copilot */}
        <div className="p-3 space-y-1.5">
          <button
            onClick={onOpenCreateTicket}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/25 transition-all cursor-pointer ${
              collapsed ? 'p-2' : ''
            }`}
            title="Create New Ticket"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            {!collapsed && <span>New Ticket</span>}
          </button>

          {onOpenAiCopilot && (
            <button
              onClick={onOpenAiCopilot}
              className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 font-semibold text-xs transition-all cursor-pointer ${
                collapsed ? 'p-2' : ''
              }`}
              title="Ask AI IT Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {!collapsed && <span>AI IT Copilot</span>}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role === 'employee') return null;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  } ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Role Switcher & User Profile */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {/* Recruiter / Evaluator Role Fast Switcher */}
        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-indigo-600" /> Active Role
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold uppercase">
                {user?.role || 'Guest'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {(['employee', 'agent', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`py-1 text-[10px] font-semibold rounded capitalize transition-all ${
                    user?.role === r
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold uppercase"
              title={`Role: ${user?.role}`}
            >
              {user?.role ? user.role[0] : 'U'}
            </span>
          </div>
        )}

        {/* User Badge */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name ? user.name.split(' ').map((n) => n[0]).join('') : 'U'}
            </div>
            {!collapsed && (
              <div className="text-left overflow-hidden">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user?.department || 'Operations'}</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
