import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, ArrowRight, UserCheck, Lock } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get('role') as UserRole | null;

  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleFastLogin = async (role: UserRole) => {
    setLoadingRole(role);
    try {
      await login(undefined, role);
      navigate('/app');
    } catch (e) {
      console.error('Login error:', e);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-8 text-left space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Resolve<span className="text-indigo-600 dark:text-indigo-400">HQ</span>
            </h1>
            <p className="text-xs text-slate-400">Production Help Desk Authentication</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to Workspace
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Select a verified role persona to test permissions and RBAC enforcement.
          </p>
        </div>

        {/* 1-Click Role Persona Login Cards */}
        <div className="space-y-3">
          {/* Admin */}
          <button
            onClick={() => handleFastLogin('admin')}
            disabled={Boolean(loadingRole)}
            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
              preselectedRole === 'admin'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Marcus Sterling</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500">VP of IT Operations · Full queue & permissions</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Agent */}
          <button
            onClick={() => handleFastLogin('agent')}
            disabled={Boolean(loadingRole)}
            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
              preselectedRole === 'agent'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Sarah Chen</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold uppercase">
                  Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Senior Support Specialist · Triage & resolution</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Employee */}
          <button
            onClick={() => handleFastLogin('employee')}
            disabled={Boolean(loadingRole)}
            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
              preselectedRole === 'employee'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Elena Rostova</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                  Employee
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Lead Product Designer · Submit & track requests</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Encrypted Session Cookie Auth</span>
          <button onClick={() => navigate('/')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            ← Back to Landing
          </button>
        </div>
      </div>
    </div>
  );
};
