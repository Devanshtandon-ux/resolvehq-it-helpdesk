import React, { useState } from 'react';
import { Ticket, TicketPriority, TicketStatus } from '../../types';
import { LANDING_DEMO_TICKETS } from '../../services/sampleData';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  LayoutList,
  LayoutGrid,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InteractiveMiniDemo: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>(LANDING_DEMO_TICKETS);
  const [priorityFilter, setPriorityFilter] = useState<'all' | TicketPriority>('all');
  const [viewMode, setViewMode] = useState<'list' | 'dashboard'>('list');
  const [selectedTicketId, setSelectedTicketId] = useState<string>(LANDING_DEMO_TICKETS[0]?.id || '');

  // Status transition handler
  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  const filteredTickets = tickets.filter((t) => {
    if (priorityFilter === 'all') return true;
    return t.priority === priorityFilter;
  });

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0] || null;

  // Derived metrics for mini dashboard view
  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;
  const urgentCount = tickets.filter((t) => t.priority === 'urgent').length;

  return (
    <section id="interactive-demo" className="py-20 md:py-28 border-t border-slate-200/70 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Demo Label */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Interactive Sandbox (Sample Demo Data)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Test drive the queue in real-time.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl">
              Interact with live simulated tickets. Change statuses, filter by priority tiers, or toggle between queue and metric view.
            </p>
          </div>

          {/* Controls: List vs Dashboard & Launch */}
          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Ticket List</span>
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'dashboard'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Dashboard View</span>
              </button>
            </div>

            <button
              onClick={() => navigate('/app')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <span>Full App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Priority Filter Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Priority:
            </span>
            {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((p) => {
              const isSelected = priorityFilter === p;
              return (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono text-slate-500">
            Showing <strong className="text-slate-900 dark:text-white">{filteredTickets.length}</strong> simulated tickets
          </span>
        </div>

        {/* Content Area */}
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Ticket Table */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="px-4 py-3">ID & Title</th>
                      <th className="px-3 py-3">Priority</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-4 py-3">Assignee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {filteredTickets.map((t) => {
                      const isSelected = t.id === selectedTicketId;
                      return (
                        <tr
                          key={t.id}
                          onClick={() => setSelectedTicketId(t.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-indigo-50/50 dark:bg-indigo-950/30'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <td className="px-4 py-3.5">
                            <span className="font-mono text-[11px] text-slate-400 block mb-0.5">
                              {t.ticketNumber}
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                              {t.title}
                            </span>
                          </td>
                          <td className="px-3 py-3.5">
                            <PriorityBadge priority={t.priority} size="sm" />
                          </td>
                          <td className="px-3 py-3.5">
                            <StatusBadge status={t.status} size="sm" />
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200">
                                {t.assigneeName ? t.assigneeName.split(' ').map((n) => n[0]).join('') : 'U'}
                              </div>
                              <span className="text-slate-600 dark:text-slate-300 text-xs">
                                {t.assigneeName || 'Unassigned'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Interactive Detail Panel */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-left flex flex-col justify-between">
              {selectedTicket ? (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedTicket.ticketNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={selectedTicket.priority} size="sm" />
                      <StatusBadge status={selectedTicket.status} size="sm" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-2">
                    {selectedTicket.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {selectedTicket.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 text-xs mb-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Reported By</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {selectedTicket.creatorName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Target SLA</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                        {selectedTicket.slaDueHours}h window
                      </span>
                    </div>
                  </div>

                  {/* Live Status Control */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Change Status (Demo Action):
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['open', 'in_progress', 'resolved'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(selectedTicket.id, st)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border capitalize transition-all cursor-pointer ${
                            selectedTicket.status === st
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  Select a ticket from the queue to view and test transitions.
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Interactive sandbox update</span>
                <button
                  onClick={() => navigate('/app')}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Manage in Full App →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard Mini View */
          <div className="mt-6 space-y-6 text-left">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-xs text-slate-500 font-medium">Open Tickets</span>
                <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
                  {openCount}
                </p>
                <span className="text-[11px] text-slate-400">Awaiting assignment</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-xs text-slate-500 font-medium">In Progress</span>
                <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
                  {inProgressCount}
                </p>
                <span className="text-[11px] text-slate-400">Active investigation</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-xs text-slate-500 font-medium">Resolved</span>
                <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                  {resolvedCount}
                </p>
                <span className="text-[11px] text-slate-400">Verified complete</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-xs text-slate-500 font-medium">Urgent Triage</span>
                <p className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 mt-1 tabular-nums">
                  {urgentCount}
                </p>
                <span className="text-[11px] text-slate-400">Top queue priority</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Simulated Queue Health</h4>
              <p className="text-xs text-slate-500 mb-4">
                SLA health is computed continuously. Real-time updates reflect instantaneous ticket resolution.
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div style={{ width: `${(resolvedCount / tickets.length) * 100}%` }} className="bg-emerald-500" />
                <div style={{ width: `${(inProgressCount / tickets.length) * 100}%` }} className="bg-amber-500" />
                <div style={{ width: `${(openCount / tickets.length) * 100}%` }} className="bg-blue-500" />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Resolved
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> In Progress
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Open
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
