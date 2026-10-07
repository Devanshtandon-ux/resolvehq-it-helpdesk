import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { TicketPriority, TicketCategory } from '../../types';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
  initialPrefill?: { title?: string; description?: string };
}

const PRIORITY_OPTIONS: { id: TicketPriority; label: string; slaHours: number; desc: string }[] = [
  { id: 'urgent', label: 'Urgent', slaHours: 4, desc: 'Production down / severe outage' },
  { id: 'high', label: 'High', slaHours: 8, desc: 'Critical feature impaired' },
  { id: 'medium', label: 'Medium', slaHours: 24, desc: 'Standard business workflow request' },
  { id: 'low', label: 'Low', slaHours: 48, desc: 'Minor inquiry or cosmetic tweak' },
];

const CATEGORIES: { id: TicketCategory; label: string }[] = [
  { id: 'hardware', label: 'Hardware Provisioning' },
  { id: 'software', label: 'Software & Licensing' },
  { id: 'network', label: 'Network & Connectivity' },
  { id: 'access', label: 'Access Control & SSO' },
  { id: 'security', label: 'Security & Vulnerability' },
  { id: 'other', label: 'General IT Inquiry' },
];

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
  initialPrefill,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [category, setCategory] = useState<TicketCategory>('software');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  useEffect(() => {
    if (initialPrefill?.title) setTitle(initialPrefill.title);
    if (initialPrefill?.description) setDescription(initialPrefill.description);
  }, [initialPrefill]);

  if (!isOpen) return null;

  const handleAiEnhance = async () => {
    const raw = (description || title).trim();
    if (!raw) {
      setError('Please type a few words into the title or description to analyze.');
      return;
    }

    setIsEnhancing(true);
    setAiReasoning(null);
    setError(null);

    try {
      const res = await api.aiEnhanceTicket(raw);
      if (res.enhanced) {
        if (!title.trim() || title.length < 25) {
          setTitle(res.enhanced.title);
        }
        setDescription(res.enhanced.description);
        setCategory(res.enhanced.category);
        setPriority(res.enhanced.priority);
        setAiReasoning(res.enhanced.reasoning);
      }
    } catch (err: any) {
      console.warn('AI Enhance error:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide both an incident title and clear description.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.createTicket({
        title,
        description,
        priority,
        category,
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }

      onTicketCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPriorityConfig =
    PRIORITY_OPTIONS.find((p) => p.id === priority) || PRIORITY_OPTIONS[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden text-left animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Support Ticket</h3>
              <p className="text-xs text-slate-500">Capture an incident into the IT operations queue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {aiReasoning && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span><strong>AI Triage:</strong> {aiReasoning}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Incident Summary / Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. WireGuard VPN handshake timeout on macOS"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Infrastructure Domain Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Severity & Priority
              </label>
              <div className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                <Clock className="w-3 h-3" />
                <span>Target SLA: {selectedPriorityConfig.slaHours} hours</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITY_OPTIONS.map((p) => {
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs capitalize block">{p.label}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">{p.slaHours}h SLA</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Detailed Description & Diagnostic Steps *
              </label>
              <button
                type="button"
                onClick={handleAiEnhance}
                disabled={isEnhancing}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 cursor-pointer transition-colors"
                title="Automatically refine wording and suggest category and priority"
              >
                <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isEnhancing ? 'animate-spin' : ''}`} />
                <span>{isEnhancing ? 'Analyzing...' : 'AI Enhance & Categorize'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe symptoms, error codes, steps to reproduce, or click 'AI Enhance' to polish..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Registering...' : 'Submit Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
