import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Sliders, 
  GitBranch, 
  Database, 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  AlertCircle, 
  Check, 
  Lock, 
  X, 
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  category: string;
  updatedAt: string;
}

interface Configuration {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isEncrypted: boolean;
  updatedAt: string;
}

interface VersionEntry {
  id: string;
  appVersion: string;
  apiVersion: string;
  releaseDate: string;
  status: 'ACTIVE' | 'DEPRECATED' | 'DEVELOPMENT';
  changelog?: string;
  createdAt: string;
}

interface LookupItem {
  id: string;
  type: string;
  code: string;
  value: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

interface ConfigManagerProps {
  activeUser: UserProfile;
  onLogAudit: (action: string, previousValue?: string, newValue?: string, remarks?: string) => void;
}

export default function ConfigManager({ activeUser, onLogAudit }: ConfigManagerProps) {
  const isAdmin = activeUser.role === 'Admin' || activeUser.role === 'System Admin' || activeUser.role === 'Workshop Engineer';

  // State Tabs
  const [activeSubTab, setActiveSubTab] = useState<'settings' | 'configurations' | 'versions' | 'lookups'>('settings');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- 1. System Settings State & Loading ---
  const [settings, setSettings] = useState<SystemSetting[]>(() => {
    const saved = localStorage.getItem('avon_system_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'ss1', key: 'system_name', value: 'AVON ServicePro Enterprise', category: 'General', updatedAt: new Date().toISOString() },
      { id: 'ss2', key: 'contact_email', value: 'support@avon.lk', category: 'General', updatedAt: new Date().toISOString() },
      { id: 'ss3', key: 'maintenance_mode', value: 'false', category: 'Maintenance', updatedAt: new Date().toISOString() },
      { id: 'ss4', key: 'timezone', value: 'Asia/Colombo', category: 'General', updatedAt: new Date().toISOString() },
      { id: 'ss5', key: 'global_grace_period_days', value: '14', category: 'Service', updatedAt: new Date().toISOString() }
    ];
  });

  // --- 2. Configurations State ---
  const [configs, setConfigs] = useState<Configuration[]>(() => {
    const saved = localStorage.getItem('avon_configurations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'cfg1', key: 'smtp_host', value: 'mail.avon.lk', type: 'string', description: 'Outgoing SMTP server host name', isEncrypted: false, updatedAt: new Date().toISOString() },
      { id: 'cfg2', key: 'smtp_port', value: '587', type: 'number', description: 'SMTP SSL/TLS Port', isEncrypted: false, updatedAt: new Date().toISOString() },
      { id: 'cfg3', key: 'api_timeout_ms', value: '30000', type: 'number', description: 'Maximum HTTP API request timeout in milliseconds', isEncrypted: false, updatedAt: new Date().toISOString() },
      { id: 'cfg4', key: 'log_level', value: 'info', type: 'string', description: 'Server logs verbosity details level', isEncrypted: false, updatedAt: new Date().toISOString() }
    ];
  });

  // --- 3. Version Control State ---
  const [versions, setVersions] = useState<VersionEntry[]>(() => {
    const saved = localStorage.getItem('avon_versions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'v1', appVersion: '1.0.0', apiVersion: 'v1', releaseDate: '2026-06-01', status: 'ACTIVE', changelog: 'Initial stable enterprise release of AVON ServicePro with basic workflows.', createdAt: new Date().toISOString() },
      { id: 'v2', appVersion: '1.1.0', apiVersion: 'v1', releaseDate: '2026-07-15', status: 'ACTIVE', changelog: 'Added Organization Hierarchy Module, Department Structure management, and dynamic validation checks.', createdAt: new Date().toISOString() }
    ];
  });

  // --- 4. Lookup Data State ---
  const [lookups, setLookups] = useState<LookupItem[]>(() => {
    const saved = localStorage.getItem('avon_lookups');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'l1', type: 'job_type', code: 'INSTALLATION', value: 'Installation', isActive: true, sortOrder: 1, createdAt: new Date().toISOString() },
      { id: 'l2', type: 'job_type', code: 'PREVENTIVE_MAINTENANCE', value: 'Preventive Maintenance', isActive: true, sortOrder: 2, createdAt: new Date().toISOString() },
      { id: 'l3', type: 'job_type', code: 'CORRECTIVE_REPAIR', value: 'Corrective Repair', isActive: true, sortOrder: 3, createdAt: new Date().toISOString() },
      { id: 'l4', type: 'job_type', code: 'CALIBRATION', value: 'Calibration', isActive: true, sortOrder: 4, createdAt: new Date().toISOString() },
      
      { id: 'l5', type: 'priority', code: 'LOW', value: 'Low', isActive: true, sortOrder: 1, createdAt: new Date().toISOString() },
      { id: 'l6', type: 'priority', code: 'MEDIUM', value: 'Medium', isActive: true, sortOrder: 2, createdAt: new Date().toISOString() },
      { id: 'l7', type: 'priority', code: 'HIGH', value: 'High', isActive: true, sortOrder: 3, createdAt: new Date().toISOString() },
      { id: 'l8', type: 'priority', code: 'EMERGENCY', value: 'Emergency / Critical', isActive: true, sortOrder: 4, createdAt: new Date().toISOString() },
      
      { id: 'l9', type: 'repair_status', code: 'PENDING', value: 'Pending Assignment', isActive: true, sortOrder: 1, createdAt: new Date().toISOString() },
      { id: 'l10', type: 'repair_status', code: 'ASSIGNED', value: 'Assigned / In-Progress', isActive: true, sortOrder: 2, createdAt: new Date().toISOString() },
      { id: 'l11', type: 'repair_status', code: 'WORKSHOP_REPAIR', value: 'Transferred to Workshop', isActive: true, sortOrder: 3, createdAt: new Date().toISOString() },
      { id: 'l12', type: 'repair_status', code: 'COMPLETED', value: 'Completed', isActive: true, sortOrder: 4, createdAt: new Date().toISOString() },
      { id: 'l13', type: 'repair_status', code: 'CLOSED', value: 'Closed', isActive: true, sortOrder: 5, createdAt: new Date().toISOString() }
    ];
  });

  // Save changes helper
  useEffect(() => {
    localStorage.setItem('avon_system_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('avon_configurations', JSON.stringify(configs));
  }, [configs]);

  useEffect(() => {
    localStorage.setItem('avon_versions', JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    localStorage.setItem('avon_lookups', JSON.stringify(lookups));
  }, [lookups]);

  const triggerToast = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  // --- ACTIONS: System Settings ---
  const handleUpdateSetting = (key: string, value: string) => {
    if (!isAdmin) return;
    const previous = settings.find(s => s.key === key);
    const updated = settings.map(s => {
      if (s.key === key) {
        return { ...s, value, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    setSettings(updated);
    triggerToast(`Setting '${key}' updated successfully.`, 'success');
    onLogAudit('UPDATE_SYSTEM_SETTING', previous?.value, value, `Modified global setting '${key}' values.`);
  };

  // --- ACTIONS: Configurations ---
  const handleUpdateConfig = (key: string, value: string) => {
    if (!isAdmin) return;
    const previous = configs.find(c => c.key === key);
    
    // Type validation
    if (previous?.type === 'number' && isNaN(Number(value))) {
      triggerToast(`Validation failed: Config '${key}' requires a numeric value.`, 'error');
      return;
    }
    if (previous?.type === 'boolean' && value !== 'true' && value !== 'false') {
      triggerToast(`Validation failed: Config '${key}' must be 'true' or 'false'.`, 'error');
      return;
    }

    const updated = configs.map(c => {
      if (c.key === key) {
        return { ...c, value, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    setConfigs(updated);
    triggerToast(`Configuration '${key}' saved successfully.`, 'success');
    onLogAudit('UPDATE_CONFIG', previous?.value, value, `Modified server configuration key '${key}'.`);
  };

  // --- ACTIONS: Version Control ---
  const [newVersion, setNewVersion] = useState({ appVersion: '', apiVersion: '', releaseDate: '', status: 'ACTIVE' as any, changelog: '' });
  const [showVersionModal, setShowVersionModal] = useState(false);

  const handleCreateVersion = () => {
    if (!isAdmin) return;
    if (!newVersion.appVersion || !newVersion.apiVersion || !newVersion.releaseDate) {
      triggerToast('All version control fields must be filled.', 'error');
      return;
    }

    const entry: VersionEntry = {
      id: `ver_${Date.now()}`,
      appVersion: newVersion.appVersion,
      apiVersion: newVersion.apiVersion,
      releaseDate: newVersion.releaseDate,
      status: newVersion.status,
      changelog: newVersion.changelog,
      createdAt: new Date().toISOString()
    };

    setVersions([entry, ...versions]);
    setShowVersionModal(false);
    setNewVersion({ appVersion: '', apiVersion: '', releaseDate: '', status: 'ACTIVE', changelog: '' });
    triggerToast(`Version control changelog ${entry.appVersion} added successfully!`, 'success');
    onLogAudit('CREATE_VERSION_CONTROL', undefined, entry.appVersion, `Added enterprise release info for application v${entry.appVersion}.`);
  };

  const handleDeleteVersion = (id: string) => {
    if (!isAdmin) return;
    const target = versions.find(v => v.id === id);
    if (!target) return;
    
    if (confirm(`Are you sure you want to delete version changelog for v${target.appVersion}?`)) {
      setVersions(versions.filter(v => v.id !== id));
      triggerToast(`Changelog for v${target.appVersion} deleted.`, 'success');
      onLogAudit('DELETE_VERSION_CONTROL', target.appVersion, undefined, `Deleted release changelog version ${target.appVersion}`);
    }
  };

  // --- ACTIONS: Lookup Data ---
  const [selectedLookupType, setSelectedLookupType] = useState<string>('job_type');
  const [newLookup, setNewLookup] = useState({ code: '', value: '', sortOrder: 1 });
  const [showLookupModal, setShowLookupModal] = useState(false);

  const lookupTypes: string[] = Array.from(new Set(lookups.map(l => l.type)));

  const handleCreateLookup = () => {
    if (!isAdmin) return;
    if (!newLookup.code || !newLookup.value) {
      triggerToast('Code and display value are required.', 'error');
      return;
    }

    const trimmedCode = newLookup.code.trim().toUpperCase();
    const isDuplicate = lookups.some(l => l.type === selectedLookupType && l.code === trimmedCode);
    if (isDuplicate) {
      triggerToast(`Duplicate check failed: Code '${trimmedCode}' already exists under '${selectedLookupType}'.`, 'error');
      return;
    }

    const item: LookupItem = {
      id: `lup_${Date.now()}`,
      type: selectedLookupType,
      code: trimmedCode,
      value: newLookup.value,
      isActive: true,
      sortOrder: newLookup.sortOrder || 1,
      createdAt: new Date().toISOString()
    };

    setLookups([...lookups, item]);
    setShowLookupModal(false);
    setNewLookup({ code: '', value: '', sortOrder: 1 });
    triggerToast(`New option '${item.value}' added under '${item.type}' group.`, 'success');
    onLogAudit('CREATE_LOOKUP_DATA', undefined, `${item.type}:${item.code}`, `Added lookup dropdown options: ${item.value}`);
  };

  const handleToggleLookupActive = (id: string) => {
    if (!isAdmin) return;
    const target = lookups.find(l => l.id === id);
    if (!target) return;

    const updated = lookups.map(l => {
      if (l.id === id) {
        return { ...l, isActive: !l.isActive };
      }
      return l;
    });
    setLookups(updated);
    triggerToast(`Status of option '${target.value}' changed.`, 'success');
    onLogAudit('TOGGLE_LOOKUP_STATUS', target.isActive ? 'Active' : 'Inactive', !target.isActive ? 'Active' : 'Inactive', `Toggled lookup code ${target.code} state.`);
  };

  const handleDeleteLookup = (id: string) => {
    if (!isAdmin) return;
    const target = lookups.find(l => l.id === id);
    if (!target) return;

    if (confirm(`Are you sure you want to delete lookup option '${target.value}'?`)) {
      setLookups(lookups.filter(l => l.id !== id));
      triggerToast(`Lookup option '${target.value}' has been removed.`, 'success');
      onLogAudit('DELETE_LOOKUP_DATA', `${target.type}:${target.code}`, undefined, `Removed lookup option: ${target.value}`);
    }
  };


  return (
    <div id="config_manager_panel" className="space-y-6">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Application Configuration</h1>
          <p className="text-sm text-slate-500">Configure global parameters, server environments, release versions, and lookup categories</p>
        </div>

        {/* Security / Admin Mode Indicator */}
        <div className="flex items-center gap-2 self-start bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          {isAdmin ? (
            <>
              <Sliders className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">Enterprise Administration Authorized</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-600">Configuration View-Only Lock</span>
            </>
          )}
        </div>
      </div>

      {/* Toast Notification Messages */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Internal Sub Navigation bar */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto scrollbar-none pb-0.5">
        {[
          { id: 'settings', label: 'System Settings', icon: Settings },
          { id: 'configurations', label: 'Server Configuration', icon: Sliders },
          { id: 'versions', label: 'Version Control', icon: GitBranch },
          { id: 'lookups', label: 'Lookup Data options', icon: Database }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. SYSTEM SETTINGS */}
      {activeSubTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider font-mono">System Parameters</h2>
              <p className="text-xs text-slate-400 mt-1">Configure global application variables used in UI displays and general workflows.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {settings.map(setting => (
                <div key={setting.id} className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="text-left">
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {setting.key}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 font-semibold">Category: {setting.category}</span>
                  </div>

                  <div className="col-span-2 flex items-center gap-3">
                    {setting.key === 'maintenance_mode' ? (
                      <select
                        disabled={!isAdmin}
                        value={setting.value}
                        onChange={e => handleUpdateSetting(setting.key, e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500/20 w-full md:max-w-xs"
                      >
                        <option value="false">Inactive (System Online)</option>
                        <option value="true">Active (Maintenance Overlay Active)</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        disabled={!isAdmin}
                        defaultValue={setting.value}
                        onBlur={e => {
                          if (e.target.value !== setting.value) {
                            handleUpdateSetting(setting.key, e.target.value);
                          }
                        }}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 text-slate-800 focus:ring-2 focus:ring-blue-500/20 font-medium"
                      />
                    )}
                    {!isAdmin && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. CONFIGURATIONS */}
      {activeSubTab === 'configurations' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider font-mono">Server Settings</h2>
              <p className="text-xs text-slate-400 mt-1">Manage SMTP parameters, security limits, API keys, and internal logger settings.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-100 font-mono">
                    <th className="p-3">Config Variable</th>
                    <th className="p-3">Value Type</th>
                    <th className="p-3">Current Value</th>
                    <th className="p-3">Variable Description</th>
                    <th className="p-3">Last Modified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {configs.map(cfg => (
                    <tr key={cfg.id} className="hover:bg-slate-50/20">
                      <td className="p-3 font-mono font-bold text-slate-600 whitespace-nowrap">{cfg.key}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                          {cfg.type}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            disabled={!isAdmin}
                            defaultValue={cfg.value}
                            onBlur={e => {
                              if (e.target.value !== cfg.value) {
                                handleUpdateConfig(cfg.key, e.target.value);
                              }
                            }}
                            className="border border-slate-200 rounded px-2 py-1 text-xs bg-slate-50 font-medium focus:ring-1 focus:ring-blue-500 w-44"
                          />
                          {!isAdmin && <Lock className="w-3.5 h-3.5 text-slate-300" />}
                        </div>
                      </td>
                      <td className="p-3 text-slate-500 min-w-[200px]">{cfg.description}</td>
                      <td className="p-3 text-[10px] font-mono text-slate-400 whitespace-nowrap">
                        {new Date(cfg.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. VERSION CONTROL */}
      {activeSubTab === 'versions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider font-mono">Release Changelog History</h2>
            {isAdmin && (
              <button
                onClick={() => setShowVersionModal(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Release Log
              </button>
            )}
          </div>

          <div className="space-y-4">
            {versions.map(ver => (
              <div key={ver.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group hover:border-blue-100 transition-all">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-base font-black text-slate-800 font-mono">App v{ver.appVersion}</span>
                  <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded font-mono">API {ver.apiVersion}</span>
                  <span className="text-xs text-slate-400 font-mono font-medium">{ver.releaseDate}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                    {ver.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 font-medium leading-relaxed">{ver.changelog}</p>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteVersion(ver.id)}
                    className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Delete release entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ADD VERSION MODAL */}
          {showVersionModal && (
            <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-150 w-full max-w-md p-6 space-y-4 animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-extrabold text-sm text-slate-800">Add Release Version Entry</h3>
                  <button onClick={() => setShowVersionModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Application Version</label>
                    <input
                      type="text"
                      placeholder="e.g. 1.2.0"
                      value={newVersion.appVersion}
                      onChange={e => setNewVersion({ ...newVersion, appVersion: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">API Version Target</label>
                    <input
                      type="text"
                      placeholder="e.g. v1"
                      value={newVersion.apiVersion}
                      onChange={e => setNewVersion({ ...newVersion, apiVersion: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Release Date</label>
                    <input
                      type="date"
                      value={newVersion.releaseDate}
                      onChange={e => setNewVersion({ ...newVersion, releaseDate: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Deployment Status</label>
                    <select
                      value={newVersion.status}
                      onChange={e => setNewVersion({ ...newVersion, status: e.target.value as any })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="ACTIVE">Active / Production</option>
                      <option value="DEVELOPMENT">Development Sandbox</option>
                      <option value="DEPRECATED">Deprecated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Patch Notes / Changelog</label>
                    <textarea
                      rows={3}
                      placeholder="List details of features introduced, fixes resolved..."
                      value={newVersion.changelog}
                      onChange={e => setNewVersion({ ...newVersion, changelog: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    onClick={() => setShowVersionModal(false)}
                    className="border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateVersion}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 4. LOOKUP DATA */}
      {activeSubTab === 'lookups' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left sidebar select */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Lookup Categories</span>
              <div className="space-y-1">
                {lookupTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedLookupType(type)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                      selectedLookupType === type
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {(type as string).replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Right details panel */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 capitalize font-mono">
                    {selectedLookupType.replace('_', ' ')} list
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">These items populate selectable selectors on work order creations and filters.</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setShowLookupModal(true)}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-4.5 h-4.5" /> Add Code
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-100 font-mono">
                      <th className="p-3">System Code</th>
                      <th className="p-3">Display Label</th>
                      <th className="p-3">Sort Order</th>
                      <th className="p-3">Availability Status</th>
                      {isAdmin && <th className="p-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {lookups
                      .filter(l => l.type === selectedLookupType)
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/25">
                          <td className="p-3 font-mono font-bold text-slate-600 whitespace-nowrap">{item.code}</td>
                          <td className="p-3 font-semibold text-slate-800">{item.value}</td>
                          <td className="p-3 font-mono text-slate-500 font-bold">{item.sortOrder}</td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.isActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          {isAdmin && (
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleToggleLookupActive(item.id)}
                                  className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                                  title="Toggle active status"
                                >
                                  {item.isActive ? (
                                    <ToggleRight className="w-5 h-5 text-blue-600" />
                                  ) : (
                                    <ToggleLeft className="w-5 h-5 text-slate-300" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteLookup(item.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                  title="Delete lookup option"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* ADD LOOKUP MODAL */}
          {showLookupModal && (
            <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-150 w-full max-w-sm p-6 space-y-4 animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-extrabold text-sm text-slate-800">Add Lookup Option</h3>
                  <button onClick={() => setShowLookupModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Code (Uppercase, No Spaces)</label>
                    <input
                      type="text"
                      placeholder="e.g. CONTRACT_WARRANTY"
                      value={newLookup.code}
                      onChange={e => setNewLookup({ ...newLookup, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Display Value</label>
                    <input
                      type="text"
                      placeholder="e.g. Under Contract / Warranty"
                      value={newLookup.value}
                      onChange={e => setNewLookup({ ...newLookup, value: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sort Order Weight</label>
                    <input
                      type="number"
                      placeholder="1"
                      value={newLookup.sortOrder}
                      onChange={e => setNewLookup({ ...newLookup, sortOrder: parseInt(e.target.value) || 1 })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    onClick={() => setShowLookupModal(false)}
                    className="border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateLookup}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Save Option
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
