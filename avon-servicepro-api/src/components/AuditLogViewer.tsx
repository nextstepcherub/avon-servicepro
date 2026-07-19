import React, { useState, useEffect } from 'react';
import { AuditLogRecord } from '../types';
import { Search, History, Filter, ClipboardList, Shield, Globe, Laptop, Database, HardDrive, RefreshCw } from 'lucide-react';

interface AuditLogViewerProps {
  audits: AuditLogRecord[];
}

function parseUserAgent(ua?: string) {
  if (!ua) return 'System / Direct';
  if (ua.includes('Postman')) return 'Postman API Client';
  if (ua.includes('Firefox')) return 'Firefox Browser';
  if (ua.includes('Chrome')) return 'Chrome Browser';
  if (ua.includes('Safari')) return 'Safari Browser';
  if (ua.includes('Edge')) return 'Edge Browser';
  if (ua.includes('curl')) return 'Curl CLI';
  return ua.substring(0, 25) + (ua.length > 25 ? '...' : '');
}

export default function AuditLogViewer({ audits }: AuditLogViewerProps) {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('All');
  const [liveAudits, setLiveAudits] = useState<AuditLogRecord[] | null>(null);
  const [apiMode, setApiMode] = useState<'local' | 'live'>('local');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLiveAudits = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem('avon_session_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch('/api/audits', { headers }).catch(() => null);
      if (response && response.ok) {
        const json = await response.json();
        if (json.data && Array.isArray(json.data.audits)) {
          setLiveAudits(json.data.audits);
          setApiMode('live');
        } else {
          setApiMode('local');
        }
      } else if (response && response.status === 403) {
        setErrorMsg('Only Admins or System Admins are permitted to query live database audit traces.');
        setApiMode('local');
      } else {
        setApiMode('local');
      }
    } catch (err) {
      console.error('Failed to fetch live audit logs:', err);
      setApiMode('local');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAudits();
  }, []);

  const activeAudits = apiMode === 'live' && liveAudits ? liveAudits : audits;

  const filteredAudits = activeAudits.filter(a => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      a.userName.toLowerCase().includes(searchLower) ||
      a.userRole.toLowerCase().includes(searchLower) ||
      a.action.toLowerCase().includes(searchLower) ||
      (a.remarks && a.remarks.toLowerCase().includes(searchLower)) ||
      (a.ipAddress && a.ipAddress.toLowerCase().includes(searchLower)) ||
      (a.userAgent && a.userAgent.toLowerCase().includes(searchLower));

    const matchesAction = filterAction === 'All' || a.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const uniqueActions = Array.from(new Set(activeAudits.map(a => a.action)));

  return (
    <div id="audit_log_viewer_panel" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Security Audit Trail</h1>
            <Shield className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-sm text-slate-500">Immutable transaction ledger recording user roles, actions, previous and new values</p>
        </div>

        {/* API mode state indicator */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {apiMode === 'live' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Database className="w-3.5 h-3.5 animate-pulse" />
              Database Stream (Live)
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
              <HardDrive className="w-3.5 h-3.5" />
              Local Sandbox (Prop)
            </div>
          )}

          <button
            onClick={fetchLiveAudits}
            disabled={loading}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Refresh Audit Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-xl">
          💡 <strong>Audit Trail Mode:</strong> {errorMsg}
        </div>
      )}

      {/* Control bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search operator, role, action, remarks, IP address, user-agent..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="All">All Operations</option>
            {uniqueActions.map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table view */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-100 font-mono">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Enterprise Role</th>
                <th className="p-4">Operation Action</th>
                <th className="p-4">Trace Source</th>
                <th className="p-4">Delta Logs (Change History)</th>
                <th className="p-4">System Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-700">
              {filteredAudits.map(audit => (
                <tr key={audit.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-500 whitespace-nowrap">
                    {new Date(audit.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">
                    {audit.userName}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                      {audit.userRole}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-mono font-black text-blue-700">
                      {audit.action}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap space-y-1">
                    {audit.ipAddress ? (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                          {audit.ipAddress}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No IP</span>
                    )}
                    {audit.userAgent ? (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500" title={audit.userAgent}>
                        <Laptop className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[120px]">{parseUserAgent(audit.userAgent)}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[10px]">Direct call</span>
                    )}
                  </td>
                  <td className="p-4">
                    {audit.previousValue || audit.newValue ? (
                      <div className="space-y-1 max-w-[240px]">
                        {audit.previousValue && (
                          <div className="text-[10px] text-red-500 font-medium bg-red-50 p-1 rounded border border-red-100 overflow-x-auto max-w-full whitespace-pre-wrap font-mono">
                            <strong>Prev:</strong> {audit.previousValue}
                          </div>
                        )}
                        {audit.newValue && (
                          <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 p-1 rounded border border-emerald-100 overflow-x-auto max-w-full whitespace-pre-wrap font-mono">
                            <strong>New:</strong> {audit.newValue}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No delta</span>
                    )}
                  </td>
                  <td className="p-4 font-medium text-slate-600 max-w-[300px] whitespace-pre-wrap">
                    {audit.remarks}
                  </td>
                </tr>
              ))}

              {filteredAudits.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    <ClipboardList className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No transactions fit your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
