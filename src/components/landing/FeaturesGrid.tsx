import React from 'react';
import {
  Layers,
  ShieldCheck,
  Clock,
  History,
  BarChart3,
  Bell,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    title: 'Centralized Ticket Management',
    description:
      'Consolidate hardware, network, software, and access tickets in a unified queue with deep filtering, instant full-text search, and multi-field sorting.',
    kicker: 'Queue Architecture',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    title: 'Role-Based Team Workflows',
    description:
      'Strict separation of concerns between Employees, Support Agents, and IT Operations Admins enforced at database API boundaries.',
    kicker: 'Security & RBAC',
  },
  {
    icon: <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    title: 'Priority & SLA Deadline Tracking',
    description:
      'Automated SLA calculation based on incident severity. Visual alerts and countdown timers signal approaching target breaches before impact.',
    kicker: 'SLA Engine',
  },
  {
    icon: <History className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    title: 'Activity History & Audit Trail',
    description:
      'Every status transition, agent assignment, diagnostic note, and priority change is permanently recorded in an immutable event timeline.',
    kicker: 'Compliance Ready',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    title: 'Support Operations Analytics',
    description:
      'Real-time aggregation of mean-time-to-resolve (MTTR), resolution throughput, priority distribution, and SLA compliance percentages.',
    kicker: 'Operational Intelligence',
  },
  {
    icon: <Bell className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
    title: 'In-App Notifications',
    description:
      'Immediate alert dispatch when tickets are assigned, comments are posted, or an incident reaches urgent escalation thresholds.',
    kicker: 'Instant Signals',
  },
];

export const FeaturesGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-20 md:py-28 border-t border-slate-200/70 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Engineered For Reliability
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything your help desk needs to resolve issues faster.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Built from first principles for fast-growing technology companies who cannot afford communication drop-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 bg-white/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all text-left flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {feat.kicker}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => navigate('/app')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Experience feature</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
