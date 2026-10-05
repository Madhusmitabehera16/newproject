import React from 'react';

/**
 * StatCard component
 * Renders a metric card on the dashboard with title, value, icon, and optional subtext.
 */
export default function StatCard({ title, value, icon: Icon, description, badgeColor = 'text-slate-400' }) {
  return (
    <div className="bg-[#111827] border border-slate-800/80 hover:border-slate-700/80 transition-colors rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg bg-slate-800/50 ${badgeColor}`}>
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-white">
          {value}
        </span>
      </div>
      {description && (
        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
