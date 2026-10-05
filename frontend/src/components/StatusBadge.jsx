import React from 'react';

/**
 * StatusBadge component
 * Displays status indicator with visual color badge and text description.
 * Supports NOT_MONITORED, ACTIVE, INACTIVE, UP, DOWN, PAUSED states.
 */
export default function StatusBadge({ status = 'NOT_MONITORED' }) {
  const normalizedStatus = (status || '').toUpperCase().replace(/\s+/g, '_');

  const config = {
    NOT_MONITORED: {
      label: 'Not monitored yet',
      badgeBg: 'bg-slate-500/10',
      badgeText: 'text-slate-300',
      badgeBorder: 'border-slate-500/20',
      dotColor: 'bg-slate-400',
      pulse: false,
    },
    ACTIVE: {
      label: 'Active',
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-400',
      badgeBorder: 'border-emerald-500/20',
      dotColor: 'bg-emerald-400',
      pulse: true,
    },
    INACTIVE: {
      label: 'Inactive',
      badgeBg: 'bg-slate-700/30',
      badgeText: 'text-slate-400',
      badgeBorder: 'border-slate-700/50',
      dotColor: 'bg-slate-500',
      pulse: false,
    },
    UP: {
      label: 'Operational',
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-400',
      badgeBorder: 'border-emerald-500/20',
      dotColor: 'bg-emerald-400',
      pulse: true,
    },
    DOWN: {
      label: 'Down',
      badgeBg: 'bg-rose-500/10',
      badgeText: 'text-rose-400',
      badgeBorder: 'border-rose-500/20',
      dotColor: 'bg-rose-400',
      pulse: false,
    },
    PAUSED: {
      label: 'Paused',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/20',
      dotColor: 'bg-amber-400',
      pulse: false,
    },
  };

  const current = config[normalizedStatus] || {
    label: status || 'Unknown',
    badgeBg: 'bg-slate-500/10',
    badgeText: 'text-slate-400',
    badgeBorder: 'border-slate-500/20',
    dotColor: 'bg-slate-400',
    pulse: false,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.badgeBg} ${current.badgeText} ${current.badgeBorder}`}
      role="status"
      aria-label={`Status: ${current.label}`}
    >
      <span className="relative flex h-2 w-2">
        {current.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${current.dotColor} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dotColor}`} />
      </span>
      <span>{current.label}</span>
    </span>
  );
}
