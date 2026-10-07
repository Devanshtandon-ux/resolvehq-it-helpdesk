import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'open' | 'in_progress' | 'resolved'>('in_progress');

  return (
    <section id="overview" className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Ambient background glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>A smarter workspace for IT teams.</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] text-balance">
              IT Support, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-300 bg-clip-text text-transparent">
                Without the Chaos.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Bring every support request, team assignment, and resolution into one beautifully organized workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/app')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 transition-all"
              >
                <span>Start Managing Tickets</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#interactive-demo"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all"
              >
                <span>Explore the Platform</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Quiet trust points */}
            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  99.4%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">SLA Target Met</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  &lt; 2.4h
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Avg Resolution</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  3 Roles
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Granular RBAC</p>
              </div>
            </div>
          </div>

          {/* Right Column: Layered 3D Product Mockup */}
          <div className="lg:col-span-6 relative perspective-1000">
            {/* Main Floating Window */}
            <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden transition-transform duration-500 hover:rotate-1 hover:-translate-y-1">
              {/* Window Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/90 bg-slate-50/80 dark:bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 ml-2">resolvehq.internal/console</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Live Workspace</span>
                </div>
              </div>

              {/* Window Content */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Mini Top Filter */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button
                      onClick={() => setActiveTab('in_progress')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        activeTab === 'in_progress'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      In Progress (3)
                    </button>
                    <button
                      onClick={() => setActiveTab('open')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        activeTab === 'open'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Open (2)
                    </button>
                    <button
                      onClick={() => setActiveTab('resolved')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        activeTab === 'resolved'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Resolved (14)
                    </button>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Priority Queued</span>
                </div>

                {/* Layered Ticket Cards */}
                <div className="space-y-2.5">
                  {/* Card 1: Urgent Replication Lag */}
                  <div className="p-3.5 rounded-xl border border-red-200/80 dark:border-red-950/60 bg-red-50/30 dark:bg-red-950/20 hover:border-red-300 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">RHQ-1082</span>
                          <span aria-hidden="true">·</span>
                          <span>Network & DB</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                          PostgreSQL replica lag exceeding 450s in us-east-1
                        </h4>
                      </div>
                      <PriorityBadge priority="urgent" size="sm" />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-red-100/60 dark:border-red-950/50">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                          AR
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px]">Alex Rivera</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>SLA: 1h 45m left</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Medium Hardware */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-200 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">RHQ-1080</span>
                          <span aria-hidden="true">·</span>
                          <span>Hardware Provisioning</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                          Provision developer laptop & Okta SSO credentials
                        </h4>
                      </div>
                      <PriorityBadge priority="medium" size="sm" />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                          SC
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px]">Sarah Chen</span>
                      </div>
                      <StatusBadge status="in_progress" size="sm" />
                    </div>
                  </div>

                  {/* Card 3: Resolved Access */}
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 opacity-80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          RHQ-1079: SCIM Directory billing seats sync verified
                        </span>
                      </div>
                      <StatusBadge status="resolved" size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Floating Analytics Card (Layered Depth) */}
            <div className="hidden sm:block absolute -bottom-6 -left-6 z-20 w-64 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">SLA Performance</span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">+18.2%</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">99.4%</span>
                <span className="text-[11px] text-slate-500">within deadline</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[99.4%]" />
              </div>
            </div>

            {/* Floating Live Notification Pill */}
            <div className="hidden sm:flex absolute -top-4 -right-4 z-20 items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">New Request Captured</p>
                <p className="text-[10px] text-slate-500">Assigned to Sarah Chen</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
