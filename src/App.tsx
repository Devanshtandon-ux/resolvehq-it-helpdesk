import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AppShell } from './components/app/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { TicketsPage } from './pages/TicketsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ThemeCustomizer } from './components/common/ThemeCustomizer';

// Helper wrappers to consume outlet context
const DashboardRoute = () => {
  const { onOpenCreateTicket } = useOutletContext<{ onOpenCreateTicket: () => void }>();
  return <DashboardPage onOpenCreateTicket={onOpenCreateTicket} />;
};

const TicketsRoute = () => {
  const { onOpenCreateTicket } = useOutletContext<{ onOpenCreateTicket: () => void }>();
  return <TicketsPage onOpenCreateTicket={onOpenCreateTicket} />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Marketing Landing */}
            <Route
              path="/"
              element={
                <>
                  <LandingPage />
                  <ThemeCustomizer />
                </>
              }
            />

            {/* Authentication */}
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Workspace */}
            <Route path="/app" element={<AppShell />}>
              <Route index element={<DashboardRoute />} />
              <Route path="tickets" element={<TicketsRoute />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
