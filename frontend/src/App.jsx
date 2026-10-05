import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Monitors from './pages/Monitors';
import AddMonitor from './pages/AddMonitor';
import EditMonitor from './pages/EditMonitor';
import MonitorDetails from './pages/MonitorDetails';
import Settings from './pages/Settings';
import { checkHealth } from './services/api';
import { AlertCircle } from 'lucide-react';

/**
 * AppLayout Component
 * Houses the Sidebar, Header, dynamic backend connectivity state, and router views.
 */
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'connected' | 'disconnected'
  const [isChecking, setIsChecking] = useState(false);

  const performHealthCheck = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsChecking(true);
    }
    try {
      const data = await checkHealth();
      if (data && data.status === 'ok') {
        setBackendStatus('connected');
      } else {
        setBackendStatus('disconnected');
      }
    } catch {
      setBackendStatus('disconnected');
    } finally {
      if (isManual) {
        setIsChecking(false);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initialCheck() {
      try {
        const data = await checkHealth();
        if (isMounted) {
          setBackendStatus(data?.status === 'ok' ? 'connected' : 'disconnected');
        }
      } catch {
        if (isMounted) {
          setBackendStatus('disconnected');
        }
      }
    }

    initialCheck();

    const interval = setInterval(() => {
      performHealthCheck(false);
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [performHealthCheck]);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          backendStatus={backendStatus}
          isChecking={isChecking}
          onRefreshHealth={() => performHealthCheck(true)}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Backend Disconnected Notice (Non-blocking) */}
        {backendStatus === 'disconnected' && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 px-4 py-2.5 text-xs text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>
                Backend disconnected: Unable to connect to Django API at{' '}
                <code className="bg-rose-950/40 px-1 py-0.5 rounded text-rose-200 font-mono">
                  {import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}
                </code>
                . Please verify your Django server is running.
              </span>
            </div>
            <button
              type="button"
              onClick={() => performHealthCheck(true)}
              disabled={isChecking}
              className="text-xs font-semibold text-rose-200 underline hover:text-white shrink-0 ml-3"
            >
              Retry
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monitors" element={<Monitors />} />
            <Route path="/monitor/new" element={<AddMonitor />} />
            <Route path="/monitor/:id" element={<MonitorDetails />} />
            <Route path="/monitor/:id/edit" element={<EditMonitor />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
