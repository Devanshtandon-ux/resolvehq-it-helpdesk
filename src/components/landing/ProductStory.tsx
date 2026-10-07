import React, { useState } from 'react';
import { Inbox, UserCheck, Timer, CheckCheck, ArrowRight } from 'lucide-react';

interface StepItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  detailSnippet: {
    label: string;
    value: string;
    subtext: string;
  };
}

const STEPS: StepItem[] = [
  {
    number: '01',
    title: 'Capture every request',
    subtitle: 'Omnichannel ingestion',
    description:
      'Employees submit issues via self-service portal, internal chat, or email. Custom intake forms auto-classify department, hardware tags, and urgency without manual triage.',
    icon: <Inbox className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    detailSnippet: {
      label: 'Intake Velocity',
      value: '< 15 seconds',
      subtext: 'Average submission to ticket creation',
    },
  },
  {
    number: '02',
    title: 'Assign it to the right person',
    subtitle: 'Smart routing & workload balancing',
    description:
      'Route network anomalies to infrastructure specialists and identity issues to access managers automatically. Ensure zero tickets languish in unassigned limbo.',
    icon: <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    detailSnippet: {
      label: 'Assignment Latency',
      value: 'Instant',
      subtext: 'Rule-based and workload-aware routing',
    },
  },
  {
    number: '03',
    title: 'Track progress and deadlines',
    subtitle: 'Configurable SLA enforcement',
    description:
      'Real-time SLA timers warn team leads before deadlines breach. Color-coded urgency indicators keep critical infrastructure incidents at the top of the queue.',
    icon: <Timer className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    detailSnippet: {
      label: 'SLA Adherence',
      value: '99.4%',
      subtext: 'Automated warnings prior to target breach',
    },
  },
  {
    number: '04',
    title: 'Resolve issues with full visibility',
    subtitle: 'Audit trail & closed-loop verification',
    description:
      'Keep full timestamped history of status shifts, diagnostic notes, and user confirmations. Once resolved, metrics automatically feed operational dashboards.',
    icon: <CheckCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    detailSnippet: {
      label: 'Audit Integrity',
      value: '100% Immutable',
      subtext: 'Every status transition and comment tracked',
    },
  },
];

export const ProductStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="workflow" className="py-20 md:py-28 border-t border-slate-200/70 dark:border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            The Incident Lifecycle
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How modern IT teams eliminate chaos in four steps.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            From the moment an employee notices an anomaly to post-incident verification, ResolveHQ enforces clarity at every step.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={step.number}
                onMouseEnter={() => setActiveStep(idx)}
                onClick={() => setActiveStep(idx)}
                className={`relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                  isActive
                    ? 'border-indigo-500/80 bg-white dark:bg-slate-900 shadow-xl shadow-indigo-500/5 -translate-y-1'
                    : 'border-slate-200/80 dark:border-slate-800/90 bg-white/60 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xl font-bold text-slate-400 dark:text-slate-600">
                      {step.number}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">{step.icon}</div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-3">{step.subtitle}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{step.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-500">{step.detailSnippet.label}</span>
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      {step.detailSnippet.value}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{step.detailSnippet.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
