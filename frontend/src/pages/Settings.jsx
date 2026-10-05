import React from 'react';
import { Sliders, Palette, Server, ShieldCheck, ExternalLink } from 'lucide-react';

/**
 * Settings Page
 * Displays read-only configuration parameters for General, Appearance, and System sections.
 */
export default function Settings() {
  const apiServerUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
  const frontendUrl = window.location.origin || 'http://localhost:5173';

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage system configurations, environment endpoints, and visual preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: General */}
        <section className="bg-[#111827] border border-slate-800/80 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
            <div className="p-2 rounded-lg bg-slate-800 text-indigo-400">
              <Sliders className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">General</h2>
              <p className="text-xs text-slate-400">Application parameters and defaults</p>
            </div>
          </div>

          <div className="mt-5 space-y-4 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-800/50 gap-2">
              <div>
                <span className="font-medium text-slate-200">Application Name</span>
                <p className="text-xs text-slate-400">Distributed API Uptime & Latency Monitor</p>
              </div>
              <span className="font-mono text-xs text-slate-300 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 self-start sm:self-auto">
                api-monitor
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-800/50 gap-2">
              <div>
                <span className="font-medium text-slate-200">Default Heartbeat Interval</span>
                <p className="text-xs text-slate-400">Default ping cadence for active monitors</p>
              </div>
              <span className="font-mono text-xs text-slate-300 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 self-start sm:self-auto">
                60 seconds
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Appearance */}
        <section className="bg-[#111827] border border-slate-800/80 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
            <div className="p-2 rounded-lg bg-slate-800 text-purple-400">
              <Palette className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Appearance</h2>
              <p className="text-xs text-slate-400">Interface styling and themes</p>
            </div>
          </div>

          <div className="mt-5 space-y-4 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-800/50 gap-2">
              <div>
                <span className="font-medium text-slate-200">Theme</span>
                <p className="text-xs text-slate-400">Standard dark monitoring color palette</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Dark
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: System */}
        <section className="bg-[#111827] border border-slate-800/80 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
            <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
              <Server className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">System</h2>
              <p className="text-xs text-slate-400">Endpoints and infrastructure connectivity</p>
            </div>
          </div>

          <div className="mt-5 space-y-4 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-800/50 gap-2">
              <div>
                <span className="font-medium text-slate-200">API Server</span>
                <p className="text-xs text-slate-400">Backend Django REST API service endpoint</p>
              </div>
              <a
                href={apiServerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/20 self-start sm:self-auto transition-colors"
              >
                <span>{apiServerUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-800/50 gap-2">
              <div>
                <span className="font-medium text-slate-200">Frontend</span>
                <p className="text-xs text-slate-400">Client dashboard host endpoint</p>
              </div>
              <a
                href={frontendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 self-start sm:self-auto transition-colors"
              >
                <span>{frontendUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-2">
              <div>
                <span className="font-medium text-slate-200">Database Engine</span>
                <p className="text-xs text-slate-400">Configured persistence layer</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 font-mono px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                PostgreSQL-Ready
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
