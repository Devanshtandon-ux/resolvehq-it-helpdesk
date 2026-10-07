import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setPreset } = useTheme();

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Resolve<span className="text-indigo-600 dark:text-indigo-400">HQ</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enterprise-grade IT help desk & ticket operations for fast-moving engineering and infrastructure teams.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>SOC2 Type II & GDPR Compliant Architecture</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="#overview" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Features & SLA Engine
                </a>
              </li>
              <li>
                <a href="#interactive-demo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Interactive Simulator
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate('/app')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1"
                >
                  <span>Live App Console</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Role Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/login?role=employee')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Employee Request Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login?role=agent')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Support Specialist Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login?role=admin')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Operations Admin Console
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Theme Presets
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(['lavender', 'cloud', 'ivory', 'mint', 'rose'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setPreset(preset)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors capitalize ${
                    theme.preset === preset
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Current: <span className="font-semibold capitalize text-slate-600 dark:text-slate-300">{theme.preset}</span>
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} ResolveHQ Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Security Invariants Verified</span>
            <span aria-hidden="true">·</span>
            <span>REST API v1.2</span>
            <span aria-hidden="true">·</span>
            <button onClick={() => navigate('/app')} className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Enter Workspace →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
