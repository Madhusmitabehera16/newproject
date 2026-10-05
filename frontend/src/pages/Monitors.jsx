import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMonitors, deleteMonitor } from '../services/api';
import MonitorCard from '../components/MonitorCard';
import { Plus, ShieldAlert, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export default function Monitors() {
  const [monitors, setMonitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeletingId, setIsDeletingId] = useState(null);

  const fetchMonitors = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsLoading(true);
    }
    setError('');
    try {
      const data = await getMonitors();
      setMonitors(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to fetch monitors from backend API. Please check your server connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initialLoad() {
      try {
        const data = await getMonitors();
        if (isMounted) {
          setMonitors(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isMounted) {
          setError('Failed to fetch monitors from backend API. Please check your server connection.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initialLoad();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name || 'this monitor'}"?`)) {
      return;
    }

    setIsDeletingId(id);
    try {
      await deleteMonitor(id);
      setMonitors((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert('Failed to delete monitor. Please try again.');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Monitors
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track the health and performance of your endpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchMonitors(true)}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh monitors"
            aria-label="Refresh monitors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
          <Link
            to="/monitor/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Monitor</span>
          </Link>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchMonitors}
            className="text-xs font-semibold text-rose-200 underline hover:text-white shrink-0 ml-3"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl border border-slate-800/80 bg-[#111827]/40 min-h-[300px]">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
          <p className="text-slate-400 text-sm">Loading monitors...</p>
        </div>
      ) : monitors.length === 0 ? (
        /* Empty-State Card */
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-[#111827]/40 min-h-[360px]">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
            <ShieldAlert className="w-7 h-7 text-slate-400" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-white tracking-tight">
            No monitors yet
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-md">
            Create your first API monitor to start tracking uptime and latency.
          </p>
          <Link
            to="/monitor/new"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Monitor</span>
          </Link>
        </div>
      ) : (
        /* Monitors List */
        <div className="space-y-3">
          {monitors.map((m) => (
            <div key={m.id} className={isDeletingId === m.id ? 'opacity-40 pointer-events-none' : ''}>
              <MonitorCard
                id={m.id}
                name={m.name}
                url={m.url}
                method={m.method}
                interval={m.interval}
                timeout={m.timeout}
                is_active={m.is_active}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
