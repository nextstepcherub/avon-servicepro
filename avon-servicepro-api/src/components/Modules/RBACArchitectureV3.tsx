import React, { useState, useMemo } from 'react';
import {
  V3_ROLES_LIST,
  V3_CHERUB_PROFILE,
  V3_MODULES,
  getRolePermissions,
  V3_JOB_RESPONSIBILITIES,
  V3_DASHBOARDS_SPEC,
  V3_SIDEBAR_MENU,
  V3_APPROVAL_MATRIX,
  V3_KPI_VISIBILITY_MATRIX,
  V3_NOTIFICATION_MATRIX
} from '../../data/rbacSchemaV3';
import {
  ShieldCheck,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  Compass,
  FileSpreadsheet,
  Award,
  Bell,
  Cpu,
  Scale,
  Briefcase,
  Eye,
  Check,
  UserCheck,
  Workflow,
  Activity,
  Layers,
  Building2,
  Microscope,
  Wrench,
  FileText,
  AlertTriangle,
  Zap,
  Tag,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';

export default function RBACArchitectureV3() {
  const [activeTab, setActiveTab] = useState<'PERMISSIONS' | 'RESPONSIBILITY' | 'DASHBOARDS' | 'NAVIGATION' | 'APPROVAL_KPI' | 'NOTIFICATIONS'>('PERMISSIONS');
  
  // Tab 1 state
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState<string>('Workshop Manager');
  const [permSearch, setPermSearch] = useState('');

  // Tab 3 state
  const [selectedDashboardRole, setSelectedDashboardRole] = useState<string>('Workshop Manager');

  // Tab 4 state
  const [simulatedSidebarRole, setSimulatedSidebarRole] = useState<string>('Senior Biomedical Engineer');

  const activePermsMatrix = useMemo(() => {
    const matrix = getRolePermissions(selectedRoleForPerms);
    if (!permSearch.trim()) return matrix;
    const q = permSearch.toLowerCase();
    return matrix.filter(m => m.module.toLowerCase().includes(q));
  }, [selectedRoleForPerms, permSearch]);

  const currentDashboardSpec = useMemo(() => {
    return V3_DASHBOARDS_SPEC[selectedDashboardRole] || V3_DASHBOARDS_SPEC['Workshop Manager'];
  }, [selectedDashboardRole]);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-[#003B75] via-[#0054A6] to-[#0D1B2A] text-white p-6 rounded-2xl shadow-xl border border-blue-400/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-4">
          <ShieldCheck className="w-80 h-80 text-cyan-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse text-emerald-400" /> AVON ServicePro V3 Enterprise
              </span>
              <span className="bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                16 Roles | 3 Engineer Tags
              </span>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                Supabase RLS Security
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Role Permissions, Dashboards & Navigation Architecture
            </h1>
            <p className="text-xs text-blue-100 max-w-3xl leading-relaxed">
              Designed for AVON PHARMO CHEM (PVT) LTD Service Centre. Implements strict Role Based Access Control (RBAC), tag-based multi-role responsibility matrices, role-specific wireframe dashboards, categorized navigation, atomic approval stages, and KPI visibility matrices.
            </p>
          </div>

          {/* Example Profile Showcase Badge */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/40 shadow-inner shrink-0 max-w-xs text-left">
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
              👤 Active Persona Demonstration
            </span>
            <div className="text-sm font-bold text-white mt-1">{V3_CHERUB_PROFILE.name}</div>
            <div className="text-xs text-amber-300 font-semibold">{V3_CHERUB_PROFILE.role}</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {V3_CHERUB_PROFILE.tags.map(tag => (
                <span key={tag} className="bg-blue-950 text-blue-200 border border-blue-700/60 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 text-cyan-400" /> {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Master Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-blue-400/20 relative z-10">
          {[
            { id: 'PERMISSIONS', label: '1. Role Permission Matrix', icon: ShieldCheck, color: 'bg-blue-500' },
            { id: 'RESPONSIBILITY', label: '2. Job Responsibility Matrix', icon: Briefcase, color: 'bg-indigo-500' },
            { id: 'DASHBOARDS', label: '3. Role Dashboard Wireframes', icon: LayoutDashboard, color: 'bg-cyan-500' },
            { id: 'NAVIGATION', label: '4. Left Sidebar Structure', icon: Compass, color: 'bg-emerald-500' },
            { id: 'APPROVAL_KPI', label: '5 & 6. Approval & KPI Matrix', icon: Award, color: 'bg-purple-500' },
            { id: 'NOTIFICATIONS', label: '7. Notification Routing Matrix', icon: Bell, color: 'bg-amber-500' }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSel ? `${tab.color} text-slate-950 font-black shadow-md` : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================================================== */}
      {/* TAB 1: PERMISSION MATRIX (16 ROLES x 18 MODULES x 9 ACTIONS) */}
      {/* ============================================================================================== */}
      {activeTab === 'PERMISSIONS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b">
            <div>
              <span className="text-[10px] bg-blue-50 text-[#0054A6] font-mono font-bold px-2 py-0.5 rounded border border-blue-200 uppercase">
                PART 1 REQUIREMENT
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                AVON Enterprise RBAC Permission Matrix (9 Actions x 18 Modules)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any of the 16 AVON operational roles below to inspect their deterministic Supabase RLS clearance across all 18 enterprise modules.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter modules..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
                  value={permSearch}
                  onChange={e => setPermSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Role Picker Pills */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase block">
              👥 Select Target Role Profile ({V3_ROLES_LIST.length} Roles Defined):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {V3_ROLES_LIST.map(role => {
                const isSel = selectedRoleForPerms === role.roleName;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleForPerms(role.roleName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSel 
                        ? 'bg-[#0054A6] text-white shadow-sm ring-2 ring-blue-300' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span>{role.roleName}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isSel ? 'bg-blue-900 text-cyan-300' : 'bg-slate-200 text-slate-600'}`}>
                      L{role.level}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permission Matrix Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#0D1B2A] text-white text-xs font-mono font-bold uppercase tracking-wider divide-x divide-slate-800">
                  <th className="p-3.5 pl-4 w-56 bg-[#003B75] text-cyan-300">Module Name</th>
                  {(['View', 'Create', 'Edit', 'Delete', 'Assign', 'Approve', 'Reject', 'Close', 'Export'] as const).map(act => (
                    <th key={act} className="p-3 text-center w-24">{act}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-medium">
                {activePermsMatrix.map((item, idx) => (
                  <tr key={item.module} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}>
                    <td className="p-3 pl-4 font-bold font-sans text-slate-800 flex items-center justify-between">
                      <span>{item.module}</span>
                      <span className="text-[10px] font-mono text-slate-400">public.{item.module.toLowerCase().replace(/\s+/g, '_')}</span>
                    </td>
                    {(['View', 'Create', 'Edit', 'Delete', 'Assign', 'Approve', 'Reject', 'Close', 'Export'] as const).map(act => {
                      const allowed = item.actions[act];
                      return (
                        <td key={act} className="p-3 text-center">
                          {allowed ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-2xs">
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-300">
                              <XCircle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>🛡️ Active RLS Enforcement: <strong>{selectedRoleForPerms}</strong> clearance verified against Supabase JWT Claims.</span>
            <span className="font-mono text-blue-700 font-bold">100% Normalized Architecture</span>
          </div>
        </div>
      )}

      {/* ============================================================================================== */}
      {/* TAB 2: JOB RESPONSIBILITY MATRIX */}
      {/* ============================================================================================== */}
      {activeTab === 'RESPONSIBILITY' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded border border-indigo-200 uppercase">
              PART 2 REQUIREMENT
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              AVON Service Centre Job Responsibility Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Defines operational accountability hierarchies across 5 core job classifications. Guarantees clear separation of duties between field execution, commercial quotation drafting, and final managerial sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {V3_JOB_RESPONSIBILITIES.map(job => (
              <div key={job.jobType} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#0054A6] transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-base font-black text-[#0054A6]">{job.jobType}</h3>
                    <span className="font-mono text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                      {job.codePrefix}-####
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                    {job.description}
                  </p>

                  <div className="space-y-2.5 pt-2 font-sans text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-slate-500 font-medium">🎯 Responsible Lead:</span>
                      <span className="font-bold text-emerald-800 font-mono">{job.responsible}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-blue-50/80 rounded-xl border border-blue-200">
                      <span className="text-slate-500 font-medium">🤝 Supporting Staff:</span>
                      <span className="font-bold text-blue-900 font-mono text-right text-[11px]">{job.supporting}</span>
                    </div>

                    {job.quotation && (
                      <div className="flex items-center justify-between p-2.5 bg-purple-50 rounded-xl border border-purple-200">
                        <span className="text-slate-500 font-medium">📄 Quotation Officer:</span>
                        <span className="font-bold text-purple-900 font-mono">{job.quotation}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-300 shadow-2xs">
                      <span className="text-slate-500 font-medium">✅ Final Approver:</span>
                      <span className="font-extrabold text-amber-900 font-mono">{job.approval}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Linked to master: public.jobs</span>
                  <span className="text-emerald-600 font-bold">● RLS Enforced</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================================================== */}
      {/* TAB 3: ROLE DASHBOARD WIREFRAMES PREVIEWER */}
      {/* ============================================================================================== */}
      {activeTab === 'DASHBOARDS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b">
            <div>
              <span className="text-[10px] bg-cyan-50 text-cyan-800 font-mono font-bold px-2 py-0.5 rounded border border-cyan-200 uppercase">
                PART 3 REQUIREMENT
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                AVON Role-Based Dashboard Wireframes Architecture
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every role experiences a customized viewport tailored strictly to their operational domain. Select a persona below to preview their wireframe widget layout.
              </p>
            </div>
          </div>

          {/* Role Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(V3_DASHBOARDS_SPEC).map(rKey => {
              const spec = V3_DASHBOARDS_SPEC[rKey];
              const isSel = selectedDashboardRole === rKey;
              return (
                <button
                  key={rKey}
                  onClick={() => setSelectedDashboardRole(rKey)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isSel 
                      ? 'bg-[#0054A6] text-white shadow-md border-b-4 border-blue-950 scale-[1.02]' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 ${isSel ? 'text-cyan-300' : 'text-slate-500'}`} />
                  <span>{rKey}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isSel ? 'bg-blue-900 text-cyan-200' : 'bg-slate-200 text-slate-600'}`}>
                    {spec.widgets.length} Widgets
                  </span>
                </button>
              );
            })}
          </div>

          {/* Wireframe Showcase Viewport */}
          <div className="bg-[#0D1B2A] p-6 rounded-2xl border border-slate-800 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-800 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0054A6] text-cyan-300 rounded-xl">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-sans">{currentDashboardSpec.roleName} Viewport</h3>
                  <p className="text-xs text-cyan-300 font-mono mt-0.5">{currentDashboardSpec.tagline}</p>
                </div>
              </div>

              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
                🟢 Live Data Grid Connected
              </div>
            </div>

            {/* Widget Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentDashboardSpec.widgets.map(w => (
                <div key={w.id} className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-md hover:border-cyan-500/50 transition-all flex flex-col justify-between h-32 relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${w.colorClass}`} />
                  
                  <div className="pl-2 flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-300 font-sans group-hover:text-white transition-colors">
                      {w.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {w.id.toUpperCase()}
                    </span>
                  </div>

                  <div className="pl-2 my-auto">
                    <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                      {w.metric}
                    </div>
                  </div>

                  <div className="pl-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="truncate max-w-[170px]">{w.subText}</span>
                    <span className="text-cyan-400 text-[10px]">● Realtime</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================================== */}
      {/* TAB 4: NAVIGATION STRUCTURE & MENU PERMISSIONS BY ROLE */}
      {/* ============================================================================================== */}
      {activeTab === 'NAVIGATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded border border-emerald-200 uppercase">
                PART 4 REQUIREMENT
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                Left Sidebar Navigation Tree & Visibility Engine
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Simulate role-based menu filtering. Select a staff title below to observe dynamic sidebar item suppression.
              </p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-bold font-mono text-slate-700 uppercase block">
                👤 Simulate Staff Role Profile:
              </label>
              <select
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
                value={simulatedSidebarRole}
                onChange={e => setSimulatedSidebarRole(e.target.value)}
              >
                {V3_ROLES_LIST.map(r => (
                  <option key={r.id} value={r.roleName}>{r.roleName} (L{r.level})</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-[#0054A6]">
                <Check className="w-4 h-4" /> Categorized Navigation Guaranteed
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                The left sidebar has been upgraded from a flat list to 8 expandable operational divisions: Dashboard, Operations (6 jobs), Customers (3 items), Assets (3 items), Commercial (3 items), Performance (3 items), Administration (6 items), and Reports.
              </p>
            </div>
          </div>

          {/* Menu Tree Preview */}
          <div className="lg:col-span-7 bg-[#003B75] p-6 rounded-2xl border border-blue-900 shadow-xl text-white space-y-4 max-h-[700px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-blue-400/30 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-300" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-200">
                  V3 Sidebar Tree Viewport ({simulatedSidebarRole})
                </span>
              </div>
              <span className="text-[10px] font-mono bg-blue-950 px-2 py-1 rounded text-cyan-400 border border-blue-700">
                RLS Menu Guard Active
              </span>
            </div>

            <div className="space-y-3">
              {V3_SIDEBAR_MENU.map(cat => {
                // filter items visible to simulatedRole
                const visibleItems = cat.items.filter(item => {
                  if (item.rolesAllowed.includes('ALL')) return true;
                  return item.rolesAllowed.includes(simulatedSidebarRole) || simulatedSidebarRole === 'Workshop Manager';
                });

                if (visibleItems.length === 0) return null;

                return (
                  <div key={cat.category} className="bg-[#0054A6] rounded-xl border border-blue-400/30 p-3.5 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-black uppercase font-mono tracking-widest text-cyan-300 px-1">
                      <span>📂 {cat.category}</span>
                      <span className="text-[10px] text-blue-200">{visibleItems.length} Items</span>
                    </div>

                    <div className="space-y-1 pl-2 border-l border-cyan-400/30">
                      {visibleItems.map(item => (
                        <div key={item.id} className="p-2 rounded-lg bg-[#003B75]/80 hover:bg-[#0077C8] flex items-center justify-between text-xs font-bold transition-all">
                          <span className="flex items-center gap-2 text-white">
                            <ArrowRight className="w-3 h-3 text-cyan-300" />
                            {item.label}
                          </span>
                          <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40">
                            Allowed
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================================================== */}
      {/* TAB 5 & 6: APPROVAL WORKFLOW MATRIX & KPI VISIBILITY */}
      {/* ============================================================================================== */}
      {activeTab === 'APPROVAL_KPI' && (
        <div className="space-y-6">
          
          {/* Approval Matrix Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] bg-purple-50 text-purple-800 font-mono font-bold px-2 py-0.5 rounded border border-purple-200 uppercase">
                PART 5 REQUIREMENT
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                AVON ServicePro Atomic Approval Workflow Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-tier sign-off protocol enforcing strict compliance validations prior to shifting job statuses or issuing tax invoices.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#0D1B2A] text-white text-xs font-mono uppercase tracking-wider divide-x divide-slate-800">
                    <th className="p-3 pl-4">Workflow Stage</th>
                    <th className="p-3">Initiator Role</th>
                    <th className="p-3">Verifier Role</th>
                    <th className="p-3 bg-amber-950 text-amber-300">Final Approver</th>
                    <th className="p-3">SLA Target</th>
                    <th className="p-3 w-72">Validation Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs font-medium">
                  {V3_APPROVAL_MATRIX.map((app, aIdx) => (
                    <tr key={app.workflowStage} className={aIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-3 pl-4 font-black text-[#0054A6]">{app.workflowStage}</td>
                      <td className="p-3 font-mono text-slate-700">{app.initiatorRole}</td>
                      <td className="p-3 font-mono text-indigo-700 font-semibold">{app.verifierRole}</td>
                      <td className="p-3 font-mono font-bold bg-amber-50 text-amber-900">{app.approverRole}</td>
                      <td className="p-3 font-mono font-bold text-emerald-700">{app.slaTarget}</td>
                      <td className="p-3 text-slate-600 font-sans text-[11px] leading-relaxed">{app.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* KPI Visibility Matrix Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] bg-cyan-50 text-cyan-800 font-mono font-bold px-2 py-0.5 rounded border border-cyan-200 uppercase">
                PART 6 REQUIREMENT
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                AVON KPI Visibility Matrix & RLS Privacy Guard
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enforces strict payroll and scoring confidentiality. Technicians can view strictly their own achievement, while managers inspect regional and departmental matrices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {V3_KPI_VISIBILITY_MATRIX.map(kpi => (
                <div key={kpi.roleCategory} className="bg-slate-50 rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-black text-sm text-slate-900">{kpi.roleCategory}</h3>
                      <Award className="w-4 h-4 text-[#0054A6]" />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{kpi.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {kpi.exampleRoles.map(er => (
                        <span key={er} className="bg-white border text-[10px] font-mono px-1.5 py-0.2 rounded text-slate-700 font-semibold">
                          {er}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Own KPI:</span>
                      <span className={kpi.canSeeOwnKPI ? 'text-emerald-700 font-bold' : 'text-red-600'}>{kpi.canSeeOwnKPI ? '✅ ALLOWED' : '❌ DENIED'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Department KPI:</span>
                      <span className={kpi.canSeeDeptKPI ? 'text-emerald-700 font-bold' : 'text-slate-400'}>{kpi.canSeeDeptKPI ? '✅ ALLOWED' : '❌ DENIED'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Territory / Bench:</span>
                      <span className={kpi.canSeeTerritoryKPI ? 'text-emerald-700 font-bold' : 'text-slate-400'}>{kpi.canSeeTerritoryKPI ? '✅ ALLOWED' : '❌ DENIED'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">All Staff Salaries:</span>
                      <span className={kpi.canSeeAllStaffKPI ? 'text-purple-700 font-bold bg-purple-50 px-1 rounded' : 'text-slate-400'}>{kpi.canSeeAllStaffKPI ? '🔓 UNRESTRICTED' : '🔒 RESTRICTED'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================================================== */}
      {/* TAB 7: NOTIFICATION ROUTING MATRIX */}
      {/* ============================================================================================== */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <span className="text-[10px] bg-amber-50 text-amber-800 font-mono font-bold px-2 py-0.5 rounded border border-amber-200 uppercase">
              PART 7 REQUIREMENT
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              AVON Event-Driven Notification Routing Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Determines automated dispatch targets for SLA warnings, warranty due alerts, customer CSAT submissions, and warehouse parts arrivals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {V3_NOTIFICATION_MATRIX.map(notif => (
              <div key={notif.eventName} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-amber-500 transition-all">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                      <Bell className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">{notif.eventName}</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-900 text-amber-300 px-2 py-1 rounded font-bold">
                    {notif.channel}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                  ⚡ Trigger: <strong>{notif.triggerCondition}</strong>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="text-slate-500 font-medium">📬 Primary Recipient(s):</span>
                    <span className="font-extrabold font-mono text-[#0054A6]">{notif.primaryRecipients.join(', ')}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-150/60 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium">📋 Secondary CC List:</span>
                    <span className="font-semibold font-mono text-slate-800 text-[11px]">{notif.secondaryCC.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-[#0D1B2A] text-white rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-cyan-300">Production Ready Supabase Realtime Architecture</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                All 7 notification events tie into Postgres <code className="text-amber-400 font-mono">pg_notify()</code> listening channels. Web browser clients receive instant web socket push payloads with zero polling overhead.
              </p>
            </div>
            <span className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold font-mono text-xs rounded-lg shrink-0">
              ● WebSockets Active
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
