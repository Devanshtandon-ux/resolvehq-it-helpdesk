import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  PlusCircle,
  AlertTriangle,
  Clock,
  MessageSquare,
  CheckCircle,
  Ticket as TicketIcon,
} from 'lucide-react';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { TicketDetailDrawer } from '../components/app/TicketDetailDrawer';
import { useAuth } from '../contexts/AuthContext';

interface TicketsPageProps {
  onOpenCreateTicket: () => void;
  globalSearchQuery?: string;
}

export const TicketsPage: React.FC<TicketsPageProps> = ({
  onOpenCreateTicket,
  globalSearchQuery = '',
}) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery);
  const [sortBy, setSortBy] = useState<string>('recent');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await api.getTickets({
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        search: searchQuery,
        sort: sortBy,
      });
      setTickets(data.tickets);
    } catch (err: any) {
      console.warn('Failed to fetch tickets, retrying with session refresh:', err?.message || err);
      try {
        await api.getCurrentUser();
        const retryData = await api.getTickets({
          status: statusFilter,
          priority: priorityFilter,
          category: categoryFilter,
          search: searchQuery,
          sort: sortBy,
        });
        setTickets(retryData.tickets);
      } catch {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, categoryFilter, searchQuery, sortBy, user]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 text-left max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Incident Queue & Ticket Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {user?.role === 'employee'
              ? 'Showing tickets reported by your account.'
              : 'Enterprise triage, agent routing, and SLA tracking.'}
          </p>
        </div>

        <button
          onClick={onOpenCreateTicket}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Ticket</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, ticket #, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting">Waiting</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="recent">Sort: Most Recent</option>
              <option value="priority">Sort: Highest Priority</option>
              <option value="sla">Sort: SLA Deadline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading tickets from database...</div>
        ) : tickets.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto px-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
              <TicketIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Clean Incident Queue</h4>
              <p className="text-xs text-slate-500 mt-1">
                No tickets in this view. Click below to create a ticket live for your demonstration!
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onOpenCreateTicket}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create Demo Ticket</span>
              </button>
              {(statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/40 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Ticket ID & Subject</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Priority</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">SLA Status</th>
                  <th className="px-3 py-3 text-right">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {tickets.map((t) => {
                  const deadlineDate = new Date(t.slaDeadline);
                  const isResolved = t.status === 'resolved' || t.status === 'closed';

                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Subject */}
                      <td className="px-5 py-3.5 max-w-xs sm:max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            {t.ticketNumber}
                          </span>
                          <span className="text-[11px] text-slate-400">by {t.creatorName}</span>
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white truncate mt-0.5">
                          {t.title}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <StatusBadge status={t.status} size="sm" />
                      </td>

                      {/* Priority */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <PriorityBadge priority={t.priority} size="sm" />
                      </td>

                      {/* Category */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 capitalize font-medium">
                          {t.category}
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {t.assigneeName ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                              {t.assigneeName.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <span className="text-slate-800 dark:text-slate-200 text-xs">{t.assigneeName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Unassigned</span>
                        )}
                      </td>

                      {/* SLA */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isResolved ? (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Met SLA
                          </span>
                        ) : t.isOverdue ? (
                          <span className="flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" /> Breached
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </td>

                      {/* Comments count */}
                      <td className="px-3 py-3.5 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                          <MessageSquare className="w-3 h-3" />
                          {t.commentsCount || 0}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      <TicketDetailDrawer
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onTicketUpdated={fetchTickets}
      />
    </div>
  );
};
