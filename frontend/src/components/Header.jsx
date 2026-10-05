import React from 'react';
import { Menu, Activity, RefreshCw } from 'lucide-react';

/**
 * Header component
 * Displays application branding, mobile menu toggle, and real backend connectivity status indicator.
 */
export default function Header({
  backendStatus = 'checking',
  isChecking = false,
  onRefreshHealth,
  onToggleSidebar,
}) {
  const isConnected = backendStatus === 'connected';

  return (
    <header className="h-16 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden focus:outline-none focus:ring-2 focus:ring-slate-700"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            API Monitor
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Real Backend Status Indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : backendStatus === 'checking'
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
          role="status"
          aria-live="polite"
          aria-label={
            isConnected
              ? 'Backend connected'
              : backendStatus === 'checking'
              ? 'Checking backend connection'
              : 'Backend disconnected'
          }
        >
          <span className="relative flex h-2 w-2">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isConnected
                  ? 'bg-emerald-400'
                  : backendStatus === 'checking'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
            />
          </span>
          <span className="hidden sm:inline">
            {isConnected
              ? 'Backend connected'
              : backendStatus === 'checking'
              ? 'Checking backend...'
              : 'Backend disconnected'}
          </span>
          <span className="sm:hidden">
            {isConnected
              ? 'Connected'
              : backendStatus === 'checking'
              ? 'Checking'
              : 'Disconnected'}
          </span>
        </div>

        {onRefreshHealth && (
          <button
            type="button"
            onClick={onRefreshHealth}
            disabled={isChecking}
            title="Recheck backend health"
            aria-label="Recheck backend health"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        )}
      </div>
    </header>
  );
}
