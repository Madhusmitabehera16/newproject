import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMonitor, deleteMonitor } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  ExternalLink,
  Clock,
  Timer,
  Calendar,
  Zap,
  Activity,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function MonitorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [monitor, setMonitor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchMonitor() {
      try {
        const data = await getMonitor(id);
        if (isMounted) {
          setMonitor(data);
        }
      } catch (err) {
        if (isMounted) {
          if (err.response && err.response.status === 404) {
            setError('Monitor not found.');
          } else {
            setError('Failed to fetch monitor details.');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMonitor();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this monitor?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMonitor(id);
      navigate('/monitors');
    } catch {
      alert('Failed to delete monitor. Please try again.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
        <p className="text-slate-400 text-sm">Loading monitor details...</p>
      </div>
    );
  }

  if (error || !monitor) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-5 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error || 'Monitor could not be loaded.'}</span>
        </div>
        <Link
          to="/monitors"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Monitors</span>
        </Link>
      </div>
    );
  }

  const createdDate = monitor.created_at ? new Date(monitor.created_at).toLocaleString() : '--';
  const updatedDate = monitor.updated_at ? new Date(monitor.updated_at).toLocaleString() : '--';

  return (
    <div className="max-w-4xl space-y-8">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/monitors"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors"
            title="Back to Monitors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700/80">
                {monitor.method}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {monitor.name}
              </h1>
            </div>
            <a
              href={monitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-mono mt-1 transition-colors"
            >
              <span>{monitor.url}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`/monitor/${monitor.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-sm font-medium border border-rose-500/20 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {/* Status & Operational Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status Card */}
        <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Current Status</span>
            <Activity className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-3">
            <StatusBadge status="NOT_MONITORED" />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Monitoring engine not yet active. Real probing begins in milestone 3.
          </p>
        </div>

        {/* Latency Card */}
        <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Response Latency</span>
            <Zap className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-slate-300">--</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Latency tracking pending background worker setup.
          </p>
        </div>

        {/* Uptime Card */}
        <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Uptime (24h)</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-slate-300">--</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Uptime SLA statistics will be recorded automatically.
          </p>
        </div>
      </div>

      {/* Monitor Configuration Details */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-white border-b border-slate-800/80 pb-3">
          Configuration & Timestamps
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Interval</span>
            </div>
            <span className="font-mono text-slate-200 font-medium">{monitor.interval} seconds</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Timer className="w-4 h-4 text-slate-500" />
              <span>Timeout</span>
            </div>
            <span className="font-mono text-slate-200 font-medium">{monitor.timeout} seconds</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="w-4 h-4 text-slate-500" />
              <span>Polling State</span>
            </div>
            <StatusBadge status={monitor.is_active ? 'ACTIVE' : 'INACTIVE'} />
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Created</span>
            </div>
            <span className="font-mono text-xs text-slate-300">{createdDate}</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between sm:col-span-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Last Updated</span>
            </div>
            <span className="font-mono text-xs text-slate-300">{updatedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
