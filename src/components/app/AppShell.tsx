import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { CreateTicketModal } from './CreateTicketModal';
import { AICopilotDrawer } from './AICopilotDrawer';
import { ThemeCustomizer } from '../common/ThemeCustomizer';
import { Sparkles } from 'lucide-react';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [ticketPrefill, setTicketPrefill] = useState<{ title?: string; description?: string } | undefined>(undefined);

  // Compute title & breadcrumbs based on pathname
  let pageTitle = 'Dashboard Overview';
  let breadcrumbs = ['Workspace', 'Dashboard'];

  if (location.pathname.startsWith('/app/tickets')) {
    pageTitle = 'Incident Management Queue';
    breadcrumbs = ['Workspace', 'Tickets'];
  } else if (location.pathname.startsWith('/app/analytics')) {
    pageTitle = 'Operational Telemetry & SLA';
    breadcrumbs = ['Workspace', 'Analytics'];
  } else if (location.pathname.startsWith('/app/settings')) {
    pageTitle = 'Workspace Preferences';
    breadcrumbs = ['Workspace', 'Settings'];
  }

  return (
    <div className="min-h-screen flex bg-transparent text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onOpenCreateTicket={() => {
            setTicketPrefill(undefined);
            setCreateTicketOpen(true);
          }}
          onOpenAiCopilot={() => setAiCopilotOpen(true)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/50 backdrop-blur-xs">
          <div className="w-64 bg-white dark:bg-slate-900 h-full shadow-2xl">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileSidebarOpen(false)}
              onOpenCreateTicket={() => {
                setMobileSidebarOpen(false);
                setTicketPrefill(undefined);
                setCreateTicketOpen(true);
              }}
              onOpenAiCopilot={() => {
                setMobileSidebarOpen(false);
                setAiCopilotOpen(true);
              }}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader
          title={pageTitle}
          breadcrumbs={breadcrumbs}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet
            context={{
              onOpenCreateTicket: (prefill?: { title?: string; description?: string }) => {
                setTicketPrefill(prefill);
                setCreateTicketOpen(true);
              },
            }}
          />
        </main>
      </div>

      {/* Floating AI Copilot Trigger */}
      <button
        onClick={() => setAiCopilotOpen(true)}
        className="fixed bottom-20 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all text-xs font-semibold cursor-pointer border border-white/20"
        title="Ask ResolveHQ IT Copilot"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>IT Copilot</span>
        <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono font-normal">
          AI
        </span>
      </button>

      {/* Interactive IT Copilot Drawer */}
      <AICopilotDrawer
        isOpen={aiCopilotOpen}
        onClose={() => setAiCopilotOpen(false)}
        onOpenCreateTicket={(prefill) => {
          setTicketPrefill(prefill);
          setCreateTicketOpen(true);
        }}
      />

      {/* Global Create Ticket Modal */}
      <CreateTicketModal
        isOpen={createTicketOpen}
        initialPrefill={ticketPrefill}
        onClose={() => {
          setCreateTicketOpen(false);
          setTicketPrefill(undefined);
        }}
        onTicketCreated={() => {
          window.dispatchEvent(new CustomEvent('ticket-created'));
        }}
      />

      {/* Global Theme Customizer floating toggle */}
      <ThemeCustomizer />
    </div>
  );
};
