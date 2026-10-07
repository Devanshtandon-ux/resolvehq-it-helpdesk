import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { DEMO_CHART_TREND, LANDING_SHOWCASE_ACTIVITIES } from '../../services/sampleData';
import { ArrowUpRight, CheckCircle2, AlertCircle, Clock, ShieldCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardShowcase: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="showcase" className="py-20 md:py-28 border-t border-slate-200/70 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Operations Center
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed for executive clarity & agent execution.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Eliminate blind spots with real-time operational metrics, resolution velocity trends, and live activity streams.
            <span className="block text-xs text-slate-400 mt-1">
              * Showcasing sample preview telemetry based on simulated 7-day workload.
            </span>
          </p>
        </div>

        {/* Dashboard Shell Preview */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden text-left">
          {/* Top Bar of Preview */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Workspace Analytics</span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-500">Global IT Support Queue</span>
            </div>
            <button
              onClick={() => navigate('/app')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <span>Open in Production Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/30">
                <span className="text-xs text-slate-500">Active Incidents</span>
                <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">28</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>-12% vs last week</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/30">
                <span className="text-xs text-slate-500">Avg Resolution Speed</span>
                <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">1.8 hrs</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Top decile velocity</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/30">
                <span className="text-xs text-slate-500">SLA Adherence</span>
                <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">99.4%</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>Target: 98.0%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/30">
                <span className="text-xs text-slate-500">First-Contact Resolution</span>
                <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">84.2%</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>+4.1% MoM</span>
                </div>
              </div>
            </div>

            {/* Middle Grid: Recharts Trend + Live Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Trend Chart */}
              <div className="lg:col-span-8 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Throughput & Resolution Velocity</h4>
                    <p className="text-xs text-slate-500">Created vs resolved volume over the past 7 days</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" /> Created
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Resolved
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DEMO_CHART_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderRadius: '8px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="created"
                        stroke="#6366F1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCreated)"
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorResolved)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="lg:col-span-4 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      <span>Live Audit Stream</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">Continuous</span>
                  </div>

                  <div className="space-y-4">
                    {LANDING_SHOWCASE_ACTIVITIES.map((act) => (
                      <div key={act.id} className="flex gap-3 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {act.userName}{' '}
                            <span className="font-normal text-slate-500 dark:text-slate-400">
                              {act.action.toLowerCase()}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {act.details}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{act.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/app')}
                  className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-left block"
                >
                  View full security log in console →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
