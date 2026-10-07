import React from 'react';
import { Send, Users2, LineChart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    step: '01',
    title: 'Submit a Request',
    subtitle: 'Zero friction intake',
    description:
      'Employees specify the affected asset, service category, and urgency with guided templates. Automated priority tagging is calculated on submission.',
    icon: <Send className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
  },
  {
    step: '02',
    title: 'Resolve Collaboratively',
    subtitle: 'Unified triage & chat',
    description:
      'Specialists claim incidents, update status flags, post internal diagnostic notes, and communicate directly with ticket submitters.',
    icon: <Users2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
  },
  {
    step: '03',
    title: 'Monitor Operational Results',
    subtitle: 'Real-time telemetry',
    description:
      'Audit logs, SLA compliance percentages, and team resolution velocities feed directly into executive dashboards with no manual reporting required.',
    icon: <LineChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
  },
];

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 border-t border-slate-200/70 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Seamless Workflow
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for how modern IT teams actually work.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Three intuitive phases designed to eliminate ticket backlog and keep stakeholders completely aligned.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, idx) => (
            <div
              key={item.step}
              className="p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 bg-white/70 dark:bg-slate-900/60 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-300 dark:text-slate-700">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{item.title}</h3>
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-3">{item.subtitle}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => navigate('/app')}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
                >
                  <span>Experience Step {item.step}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
