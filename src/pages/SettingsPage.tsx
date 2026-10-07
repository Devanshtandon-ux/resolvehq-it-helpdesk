import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  User,
  Palette,
  Bell,
  Moon,
  Sun,
  Shield,
  RotateCcw,
  Check,
  LogOut,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const PRESETS = [
  { id: 'lavender', name: 'Soft Lavender', bg: '#F7F5FF', accent: '#7C3AED' },
  { id: 'cloud', name: 'Pure Cloud', bg: '#F8FAFC', accent: '#2563EB' },
  { id: 'ivory', name: 'Warm Ivory', bg: '#FFF9F0', accent: '#EA580C' },
  { id: 'mint', name: 'Mint Fresh', bg: '#F0FBF6', accent: '#059669' },
  { id: 'rose', name: 'Rose Quartz', bg: '#FFF4F6', accent: '#E11D48' },
] as const;

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setPreset, setCustomColor, toggleDarkMode, resetTheme } = useTheme();
  const navigate = useNavigate();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slaBreachAlerts, setSlaBreachAlerts] = useState(true);
  const [ticketAssignedAlerts, setTicketAssignedAlerts] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Workspace Settings & Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your account profile, UI themes, and notification channels.
        </p>
      </div>

      {savedMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* 1. Profile Section */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <User className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">User Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Full Name</label>
            <input
              type="text"
              readOnly
              value={user?.name || ''}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Corporate Email</label>
            <input
              type="email"
              readOnly
              value={user?.email || ''}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Assigned Role</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-indigo-600 dark:text-indigo-400 capitalize">
              <Shield className="w-4 h-4" />
              <span>{user?.role}</span>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Department</label>
            <input
              type="text"
              readOnly
              value={user?.department || 'Operations'}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* 2. Theme & Appearance Section */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Appearance & Theme Engine</h3>
          </div>
          <button
            onClick={resetTheme}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>

        {/* Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-3">
            Theme Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESETS.map((p) => {
              const isSelected = theme.preset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full border border-black/10 flex items-center justify-center shrink-0"
                      style={{ backgroundColor: p.bg }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accent }} />
                    </div>
                    <span>{p.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color Picker & Dark Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Custom Canvas Tint
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.bgHex}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-transparent"
              />
              <span className="text-xs font-mono uppercase text-slate-600 dark:text-slate-300">
                {theme.bgHex}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Display Mode
            </label>
            <button
              onClick={toggleDarkMode}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition-colors"
            >
              {theme.isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span>Switch to Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Notification Preferences */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notification Dispatch Rules</h3>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">SLA Imminent Warning</p>
              <p className="text-slate-400 text-[11px]">Send alert 60 minutes prior to target SLA breach</p>
            </div>
            <input
              type="checkbox"
              checked={slaBreachAlerts}
              onChange={(e) => setSlaBreachAlerts(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Ticket Assignment Notification</p>
              <p className="text-slate-400 text-[11px]">Notify immediately when an incident is assigned to you</p>
            </div>
            <input
              type="checkbox"
              checked={ticketAssignedAlerts}
              onChange={(e) => setTicketAssignedAlerts(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Daily Operational Digest</p>
              <p className="text-slate-400 text-[11px]">Morning summary of open vs resolved team tickets</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              Save Dispatch Preferences
            </button>
          </div>
        </form>
      </div>

      {/* 4. Live Demo State Control */}
      <div className="p-6 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/20 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-950/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Clean Slate Live Demo Reset</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
            Wipe all tickets, comments, and activities back to 0. Perfect for demonstrating practical live ticket creation from scratch in front of an audience or client.
          </p>
        </div>
        <button
          onClick={async () => {
            if (window.confirm('Reset queue to 0 tickets for a clean live demonstration?')) {
              await api.clearAllTickets();
              alert('Queue reset! You can now create your first ticket live.');
              navigate('/app/tickets');
            }
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-400 hover:text-red-600 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset to Clean Slate (0 Tickets)</span>
        </button>
      </div>

      {/* 5. Session & Sign Out */}
      <div className="p-6 rounded-2xl border border-red-200/60 dark:border-red-950/60 bg-red-50/20 dark:bg-red-950/10 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-red-900 dark:text-red-300">Sign Out of Workspace</h4>
          <p className="text-xs text-red-700/80 dark:text-red-400">
            Terminate the current authenticated session cookie.
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
