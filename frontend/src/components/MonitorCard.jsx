import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { ExternalLink, Clock, Timer, Edit3, Trash2, ChevronRight } from 'lucide-react';

/**
 * MonitorCard component
 * Displays details for an individual API monitor record backed by real API data.
 */
export default function MonitorCard({
  id,
  name,
  url,
  method = 'GET',
  interval = 60,
  timeout = 30,
  is_active = true,
  onDelete,
}) {
  return (
    <div className="bg-[#111827] border border-slate-800/80 hover:border-slate-700/80 transition-all rounded-xl p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Info, URL, Badges */}
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700/80">
              {method}
            </span>
            <Link
              to={`/monitor/${id}`}
              className="font-semibold text-white text-base tracking-tight hover:text-emerald-400 transition-colors truncate"
            >
              {name}
            </Link>
            <StatusBadge status="NOT_MONITORED" />
            <StatusBadge status={is_active ? 'ACTIVE' : 'INACTIVE'} />
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-mono transition-colors truncate max-w-md"
              title={url}
            >
              <span className="truncate">{url}</span>
              <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Center: Metrics/Specs */}
        <div className="flex items-center gap-6 text-xs text-slate-400 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium">Interval</span>
              <span className="font-mono font-medium text-slate-200">{interval}s</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium">Timeout</span>
              <span className="font-mono font-medium text-slate-200">{timeout}s</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80 self-end lg:self-center">
          <Link
            to={`/monitor/${id}`}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="View Details"
            aria-label={`View details for ${name}`}
          >
            <ChevronRight className="w-4 h-4" />
          </Link>

          <Link
            to={`/monitor/${id}/edit`}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
            title="Edit Monitor"
            aria-label={`Edit ${name}`}
          >
            <Edit3 className="w-4 h-4" />
          </Link>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(id, name)}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
              title="Delete Monitor"
              aria-label={`Delete ${name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
