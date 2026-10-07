import React from 'react';
import { TicketPriority } from '../../types';
import { AlertCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TicketPriority;
  size?: 'sm' | 'md';
}

const PRIORITY_CONFIG: Record<
  TicketPriority,
  { label: string; textClass: string; bgClass: string; icon: React.ReactNode }
> = {
  urgent: {
    label: 'Urgent',
    textClass: 'text-red-700 dark:text-red-400',
    bgClass: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50',
    icon: <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />,
  },
  high: {
    label: 'High',
    textClass: 'text-orange-700 dark:text-orange-400',
    bgClass: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/50',
    icon: <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400" />,
  },
  medium: {
    label: 'Medium',
    textClass: 'text-amber-700 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50',
    icon: <ArrowUp className="w-3 h-3 text-amber-600 dark:text-amber-400" />,
  },
  low: {
    label: 'Low',
    textClass: 'text-slate-600 dark:text-slate-400',
    bgClass: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    icon: <ArrowDown className="w-3 h-3 text-slate-500" />,
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md border ${config.bgClass} ${config.textClass} ${padding} whitespace-nowrap`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
