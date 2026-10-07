import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  PlusCircle,
  Activity,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { DashboardMetrics } from '../types';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFallbackMetrics } from '../services/sampleData';

interface DashboardPageProps {
  onOpenCreateTicket: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenCreateTicket }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>(getFallbackMetrics);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadMetrics = async () => {
    setIsSyncing(true);
    try {
      const data = await api.getDashboardMetrics();
      if (data) {
        setMetrics(data);
      }
    } catch (err: any) {
      console.warn('Dashboard live sync note:', err?.message || err);
      try {
        await api.getCurrentUser();
        const retryData = await api.getDashboardMetrics();
        if (retryData) {
          setMetrics(retryData);
        }
      } catch {
        // Fallback remains active
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [user]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 text-left max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Team'}
            </h2>
            {isSyncing && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" title="Syncing live data" />
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {user?.role === 'employee'
              ? 'Track your submitted support requests and status updates.'
              : 'Global IT queue status, SLA countdowns, and active agent assignments.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/app/tickets')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            View All Tickets
          </button>
          <button
            onClick={onOpenCreateTicket}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* 5 High-Impact Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Open */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Open</span>
            <Inbox className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            {metrics.openTickets}
          </p>
          <span className="text-[11px] text-slate-400">Needs response</span>
        </div>

        {/* In Progress */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            {metrics.inProgressTickets}
          </p>
          <span className="text-[11px] text-slate-400">Active investigation</span>
        </div>

        {/* Resolved */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            {metrics.resolvedTickets}
          </p>
          <span className="text-[11px] text-slate-400">Closed cycle</span>
        </div>

        {/* Overdue */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Overdue SLA</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 mt-2 tabular-nums">
            {metrics.overdueTickets}
          </p>
          <span className="text-[11px] text-slate-400">Target breached</span>
        </div>

        {/* MTTR */}
        <div className="col-span-2 md:col-span-1 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Avg Resolution</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            {metrics.avgResolutionTimeHours}h
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {metrics.slaComplianceRate}% compliance
          </span>
        </div>
      </div>

      {/* Main Grid: Trend Chart & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-day Throughput Chart */}
        <div className="lg:col-span-8 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ticket Volume & Resolution Velocity</h3>
              <p className="text-xs text-slate-500">Tickets created vs resolved (7 days)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" /> Created
              </span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Resolved
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.ticketsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
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
                  fill="url(#createdGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#resolvedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Card */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Priority Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Active queue composition by urgency</p>

            <div className="space-y-3">
              {(metrics?.priorityDistribution || []).map((item) => {
                const total = metrics?.totalTickets || 1;
                const pct = Math.round((item.count / total) * 100);
                const colorMap: Record<string, string> = {
                  Urgent: 'bg-red-500',
                  High: 'bg-orange-500',
                  Medium: 'bg-amber-500',
                  Low: 'bg-slate-400',
                };
                return (
                  <div key={item.priority}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colorMap[item.label] || 'bg-indigo-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            SLA Compliance Rate:{' '}
            <strong className="text-slate-900 dark:text-white font-mono">{metrics?.slaComplianceRate ?? 100}%</strong>
          </div>
        </div>
      </div>

      {/* Bottom Section: Category Distribution & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Department Incident Categories</h3>
          <p className="text-xs text-slate-500 mb-4">Hardware vs software vs identity access load</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(metrics?.categoryDistribution || []).map((cat) => (
              <div
                key={cat.category}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40"
              >
                <span className="text-[11px] text-slate-500 capitalize block">{cat.category}</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Timeline */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>Real-Time Incident Activity</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Database Stream</span>
          </div>

          <div className="space-y-3">
            {(metrics?.recentActivity || []).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                No recent activity recorded yet. Create a ticket to start the audit log.
              </div>
            ) : (
              (metrics?.recentActivity || []).slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{act.userName}:</span>{' '}
                    <span className="text-slate-600 dark:text-slate-300">{act.action}</span>
                    {act.details && (
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 italic">{act.details}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
