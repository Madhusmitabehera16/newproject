import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings, Radio, X } from 'lucide-react';

/**
 * Sidebar component
 * Renders main navigation with responsive mobile overlay / collapse behavior.
 */
export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    {
      to: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/monitors',
      label: 'Monitors',
      icon: Activity,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d131f] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">
                API Monitor
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
                Uptime & Latency
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="rounded-lg bg-slate-900/60 border border-slate-800/80 p-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Environment</span>
              <span className="font-mono text-emerald-400 font-medium">Dev</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Distributed Engine v0.1.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
