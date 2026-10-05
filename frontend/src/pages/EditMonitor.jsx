import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMonitor, updateMonitor } from '../services/api';
import { ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export default function EditMonitor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'GET',
    interval: 60,
    timeout: 30,
    is_active: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchMonitorDetails() {
      try {
        const data = await getMonitor(id);
        if (isMounted) {
          setFormData({
            name: data.name || '',
            url: data.url || '',
            method: data.method || 'GET',
            interval: data.interval || 60,
            timeout: data.timeout || 30,
            is_active: data.is_active ?? true,
          });
        }
      } catch (err) {
        if (isMounted) {
          if (err.response && err.response.status === 404) {
            setGeneralError('Monitor not found or has been removed.');
          } else {
            setGeneralError('Failed to load monitor details from backend.');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMonitorDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'interval' || name === 'timeout' ? (value === '' ? '' : parseInt(value, 10)) : value),
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: ['Monitor name is required.'] }));
      return;
    }
    if (!formData.url.trim()) {
      setErrors((prev) => ({ ...prev, url: ['URL is required.'] }));
      return;
    }
    if (formData.interval < 10) {
      setErrors((prev) => ({ ...prev, interval: ['Check interval must be at least 10 seconds.'] }));
      return;
    }
    if (formData.timeout < 1) {
      setErrors((prev) => ({ ...prev, timeout: ['Timeout must be at least 1 second.'] }));
      return;
    }
    if (formData.timeout >= formData.interval) {
      setErrors((prev) => ({ ...prev, timeout: ['Timeout must be less than interval.'] }));
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMonitor(id, {
        ...formData,
        interval: Number(formData.interval),
        timeout: Number(formData.timeout),
      });
      navigate('/monitors');
    } catch (err) {
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && !Array.isArray(err.response.data)) {
          setErrors(err.response.data);
        } else {
          setGeneralError('Invalid monitor configuration.');
        }
      } else {
        setGeneralError('Failed to communicate with backend API.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
        <p className="text-slate-400 text-sm">Loading monitor configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/monitors"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors"
          title="Back to Monitors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Edit Monitor
          </h1>
          <p className="text-sm text-slate-400">
            Update endpoint parameters, HTTP method, check cadence, or activation status.
          </p>
        </div>
      </div>

      {generalError && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-[#111827] border border-slate-800/80 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-1.5">
            Monitor Name <span className="text-rose-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-sm transition-all ${
              errors.name ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-emerald-500/80'
            }`}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{Array.isArray(errors.name) ? errors.name.join(' ') : errors.name}</span>
            </p>
          )}
        </div>

        {/* URL Field */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-slate-200 mb-1.5">
            URL <span className="text-rose-400">*</span>
          </label>
          <input
            id="url"
            name="url"
            type="url"
            value={formData.url}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all ${
              errors.url ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-emerald-500/80'
            }`}
          />
          {errors.url && (
            <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{Array.isArray(errors.url) ? errors.url.join(' ') : errors.url}</span>
            </p>
          )}
        </div>

        {/* Method & Interval & Timeout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Method */}
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-slate-200 mb-1.5">
              HTTP Method
            </label>
            <select
              id="method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 text-sm font-mono transition-all"
            >
              {HTTP_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            {errors.method && (
              <p className="mt-1.5 text-xs text-rose-400">{Array.isArray(errors.method) ? errors.method.join(' ') : errors.method}</p>
            )}
          </div>

          {/* Interval */}
          <div>
            <label htmlFor="interval" className="block text-sm font-medium text-slate-200 mb-1.5">
              Check Interval (s)
            </label>
            <input
              id="interval"
              name="interval"
              type="number"
              min="10"
              value={formData.interval}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all ${
                errors.interval ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-emerald-500/80'
              }`}
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Min: 10s</span>
            {errors.interval && (
              <p className="mt-1.5 text-xs text-rose-400">{Array.isArray(errors.interval) ? errors.interval.join(' ') : errors.interval}</p>
            )}
          </div>

          {/* Timeout */}
          <div>
            <label htmlFor="timeout" className="block text-sm font-medium text-slate-200 mb-1.5">
              Timeout (s)
            </label>
            <input
              id="timeout"
              name="timeout"
              type="number"
              min="1"
              value={formData.timeout}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all ${
                errors.timeout ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-emerald-500/80'
              }`}
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Min: 1s</span>
            {errors.timeout && (
              <p className="mt-1.5 text-xs text-rose-400">{Array.isArray(errors.timeout) ? errors.timeout.join(' ') : errors.timeout}</p>
            )}
          </div>
        </div>

        {/* Active Toggle */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
          <div>
            <span className="text-sm font-medium text-slate-200 block">Active Status</span>
            <span className="text-xs text-slate-400 block">Enable or disable future monitor scheduling</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              disabled={isSubmitting}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800/80">
          <Link
            to="/monitors"
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating monitor...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
