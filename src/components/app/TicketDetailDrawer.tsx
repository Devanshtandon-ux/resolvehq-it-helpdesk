import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  User,
  CheckCircle,
  MessageSquare,
  Activity,
  Send,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Wrench,
} from 'lucide-react';
import { Ticket, TicketComment, ActivityItem, TicketStatus, User as UserType } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

interface TicketDetailDrawerProps {
  ticketId: string | null;
  onClose: () => void;
  onTicketUpdated: () => void;
}

export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({
  ticketId,
  onClose,
  onTicketUpdated,
}) => {
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [agents, setAgents] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // AI Diagnostic State
  const [aiDiagnostic, setAiDiagnostic] = useState<{
    summary: string;
    probableCause: string;
    steps: string[];
    recommendedReply: string;
    estimatedMinutes: number;
  } | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [showAiSection, setShowAiSection] = useState(true);

  const handleRunAIDiagnostic = async () => {
    if (!ticket) return;
    setIsDiagnosing(true);
    try {
      const res = await api.aiDiagnoseTicket({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
      });
      setAiDiagnostic(res.diagnostic);
      setShowAiSection(true);
    } catch (err) {
      console.error('Failed to run AI diagnosis:', err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleInsertAIReply = () => {
    if (aiDiagnostic?.recommendedReply) {
      setNewComment(aiDiagnostic.recommendedReply);
    }
  };

  const loadTicketData = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getTicket(id);
      setTicket(data.ticket);
      setComments(data.comments);
      setActivities(data.activities);

      const agentUsers = await api.getUsers('agent');
      const adminUsers = await api.getUsers('admin');
      setAgents([...agentUsers, ...adminUsers]);
    } catch (err) {
      console.error('Failed to load ticket detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      loadTicketData(ticketId);
    }
  }, [ticketId]);

  if (!ticketId) return null;

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket) return;
    try {
      const res = await api.updateTicketStatus(ticket.id, newStatus);
      setTicket(res.ticket);
      if (newStatus === 'resolved') {
        try {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
      await loadTicketData(ticket.id);
      onTicketUpdated();
    } catch (err: any) {
      alert(err.message || 'Could not update status');
    }
  };

  const handleAssignChange = async (assigneeId: string) => {
    if (!ticket) return;
    try {
      const res = await api.assignTicket(ticket.id, assigneeId || null);
      setTicket(res.ticket);
      await loadTicketData(ticket.id);
      onTicketUpdated();
    } catch (err: any) {
      alert(err.message || 'Could not update assignee');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await api.addComment(ticket.id, newComment, isInternal);
      setNewComment('');
      setIsInternal(false);
      await loadTicketData(ticket.id);
      onTicketUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between text-left animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
              {ticket?.ticketNumber}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {ticket?.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading || !ticket ? (
            <div className="py-20 text-center text-xs text-slate-400">Loading incident context...</div>
          ) : (
            <>
              {/* Title & Badges */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  {ticket.isOverdue && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-md border border-red-200">
                      <AlertTriangle className="w-3 h-3" />
                      <span>SLA BREACHED</span>
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {ticket.title}
                </h2>
              </div>

              {/* SLA & Reporter Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Reporter</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    {ticket.creatorName}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">{ticket.creatorEmail}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">SLA Target</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">
                    {ticket.slaDueHours}h window
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(ticket.slaDeadline).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Status Control</span>
                  {/* Status Dropdown */}
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    disabled={user?.role === 'employee' && ticket.status === 'resolved'}
                    className="mt-0.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 w-full"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting">Waiting</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Assignee</span>
                  {user?.role === 'employee' ? (
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                      {ticket.assigneeName || 'Unassigned'}
                    </span>
                  ) : (
                    <select
                      value={ticket.assigneeId || ''}
                      onChange={(e) => handleAssignChange(e.target.value)}
                      className="mt-0.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 w-full"
                    >
                      <option value="">Unassigned</option>
                      {agents.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.name} ({ag.role})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Incident Description
                </h4>
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {ticket.description}
                </div>
              </div>

              {/* AI Incident Diagnostic & Root Cause Engine */}
              <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 via-purple-50/30 to-white dark:from-indigo-950/30 dark:via-purple-950/10 dark:to-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        Incident Diagnostic Intelligence
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded font-normal">
                          Gemini 3.8
                        </span>
                      </h4>
                    </div>
                  </div>

                  {!aiDiagnostic && (
                    <button
                      onClick={handleRunAIDiagnostic}
                      disabled={isDiagnosing}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
                      <span>{isDiagnosing ? 'Analyzing...' : 'Run AI Diagnostic'}</span>
                    </button>
                  )}

                  {aiDiagnostic && (
                    <button
                      onClick={() => setShowAiSection(!showAiSection)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    >
                      {showAiSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {isDiagnosing && (
                  <div className="py-4 text-center text-xs text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    Performing technical triage and root-cause analysis...
                  </div>
                )}

                {aiDiagnostic && showAiSection && (
                  <div className="space-y-3 text-xs pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                        Probable Root Cause
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        {aiDiagnostic.probableCause}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Recommended Resolution Steps
                      </span>
                      <ul className="space-y-1 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        {aiDiagnostic.steps.map((st, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                            <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="flex-1 leading-snug">{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Suggested User Response
                        </span>
                        <button
                          onClick={handleInsertAIReply}
                          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Wrench className="w-3 h-3" />
                          <span>Insert into comment box</span>
                        </button>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 italic leading-relaxed">
                        "{aiDiagnostic.recommendedReply}"
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Audit Timeline */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Audit Trail</span>
                </h4>
                <div className="space-y-2 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 text-xs">
                  {activities.map((a) => (
                    <div key={a.id} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{a.userName}:</span>{' '}
                        <span className="text-slate-600 dark:text-slate-300">{a.action}</span>
                        {a.details && (
                          <p className="text-[11px] text-slate-400 mt-0.5 italic">{a.details}</p>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                        {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discussion Comments Thread */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Discussion & Diagnostic Notes ({comments.length})</span>
                </h4>

                <div className="space-y-3 mb-4">
                  {comments.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-xl">
                      No comments yet. Start the conversation below.
                    </div>
                  ) : (
                    comments.map((cmt) => (
                      <div
                        key={cmt.id}
                        className={`p-3.5 rounded-xl border text-xs text-left ${
                          cmt.isInternal
                            ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40'
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">{cmt.authorName}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-mono">
                              {cmt.authorRole}
                            </span>
                            {cmt.isInternal && (
                              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                                Internal Staff Note
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {new Date(cmt.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {cmt.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Box */}
                <form onSubmit={handleAddComment} className="space-y-2">
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add an update, diagnostic note, or question..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between">
                    {user?.role !== 'employee' ? (
                      <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isInternal}
                          onChange={(e) => setIsInternal(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Staff Internal Note (Hidden from employee)</span>
                      </label>
                    ) : (
                      <div />
                    )}

                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingComment ? 'Sending...' : 'Post Comment'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
