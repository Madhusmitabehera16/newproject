import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertTriangle, Clock, ArrowRight, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import MonitorCard from '../components/MonitorCard';
import { getMonitors, deleteMonitor } from '../services/api';

/**
 * Dashboard Overview Page
 * Displays high-level stats and recent monitors from the real backend API.
 */
export default function Dashboard() {
  const [monitors, setMonitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const data = await getMonitors();
        if (isMounted) {
          setMonitors(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isMounted) {
          setMonitors([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name || 'this monitor'}"?`)) {
      return;
    }

    try {
      await deleteMonitor(id);
      setMonitors((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert('Failed to delete monitor. Please try again.');
    }
  };

  const totalMonitors = monitors.length;
  const recentMonitors = monitors.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Overview
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitor your APIs, track uptime, and investigate performance.
          </p>
        </div>

        <Link
          to="/monitor/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Monitor</span>
        </Link>
      </div>

      {/* 4 Required Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Monitors"
          value={isLoading ? '...' : totalMonitors}
          icon={Activity}
          description="Configured HTTP endpoints"
          badgeColor="text-indigo-400"
        />
        <StatCard
          title="Monitors Up"
          value="--"
          icon={CheckCircle2}
          description="Monitoring engine pending"
          badgeColor="text-emerald-400"
        />
        <StatCard
          title="Monitors Down"
          value="--"
          icon={AlertTriangle}
          description="Monitoring engine pending"
          badgeColor="text-rose-400"
        />
        <StatCard
          title="Average Latency"
          value="--"
          icon={Clock}
          description="Awaiting probe workers"
          badgeColor="text-amber-400"
        />
      </div>

      {/* Recent Monitors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            Recent Monitors
          </h2>
          {totalMonitors > 0 && (
            <Link
              to="/monitors"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>View all ({totalMonitors})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-slate-800/80 bg-[#111827]">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mb-2" />
            <p className="text-xs text-slate-400">Loading recent monitors...</p>
          </div>
        ) : totalMonitors === 0 ? (
          <div className="rounded-xl border border-slate-800/80 bg-[#111827] p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  No monitors configured yet
                </h3>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Add your first HTTP endpoint to track uptime and response latency when the monitoring engine starts.
                </p>
              </div>
              <Link
                to="/monitor/new"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors shadow-xs"
              >
                <span>+ Create Monitor</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMonitors.map((m) => (
              <MonitorCard
                key={m.id}
                id={m.id}
                name={m.name}
                url={m.url}
                method={m.method}
                interval={m.interval}
                timeout={m.timeout}
                is_active={m.is_active}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
