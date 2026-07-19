import React, { useState } from 'react';
import {
  V4_COLOR_SYSTEM,
  V4_TYPOGRAPHY_SYSTEM,
  V4_SHADCN_MAPPING,
  V4_NEXTJS_STRUCTURE
} from '../../data/designSystemV4Data';
import RoleDashboardsV4 from './DesignSystem/RoleDashboardsV4';
import JobManagementV4 from './DesignSystem/JobManagementV4';
import EnterprisePagesV4 from './DesignSystem/EnterprisePagesV4';
import {
  Layers,
  LayoutDashboard,
  Wrench,
  Palette,
  FileCode,
  FolderTree,
  Building2,
  ShieldCheck,
  Cpu,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Copy,
  ChevronRight
} from 'lucide-react';

export default function EnterpriseDesignSystemV4() {
  const [activeMainTab, setActiveMainTab] = useState<'DASHBOARDS' | 'JOBS' | 'PAGES' | 'ARCHITECTURE'>('DASHBOARDS');
  const [copiedSpec, setCopiedSpec] = useState(false);

  const copyArchitectureSpec = () => {
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-16 animate-fade-in text-left select-none">
      
      {/* Flagship SaaS Corporate Hero Header */}
      <div className="bg-gradient-to-r from-[#003B75] via-[#0054A6] to-[#0077C8] text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-blue-400/30">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Cpu className="w-96 h-96" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-mono font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>AVON PHARMO CHEM SERVICE CENTRE – V4 ARCHITECTURE</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyArchitectureSpec}
                className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-mono font-bold rounded-xl border border-white/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSpec ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSpec ? 'Copied V4 Blueprint' : 'Export V4 Specs'}</span>
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              AVON ServicePro V4 Enterprise UI/UX Design System
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-3xl font-medium mt-2 leading-relaxed">
              Production-Ready Enterprise SaaS UX Architecture for Biomedical Engineering, Laboratory Instrument Calibration (ISO 17025 SLAB), and Technical Service Management.
            </p>
          </div>

          {/* Platform Tech Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
            <span className="bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700 text-cyan-300">⚡ Next.js 15 App Router</span>
            <span className="bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700 text-amber-300">🛡️ TypeScript</span>
            <span className="bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700 text-emerald-300">🎨 Tailwind CSS</span>
            <span className="bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700 text-purple-300">⚛️ Shadcn UI</span>
            <span className="bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700 text-teal-300">🗄️ Supabase RLS Auth</span>
          </div>
        </div>
      </div>

      {/* Main Flagship Section Switcher Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-wrap items-center gap-2 sticky top-4 z-40">
        <button
          onClick={() => setActiveMainTab('DASHBOARDS')}
          className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMainTab === 'DASHBOARDS'
              ? 'bg-[#0054A6] text-white shadow-md ring-2 ring-blue-300'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>1. Executive Dashboards (5 Roles)</span>
        </button>

        <button
          onClick={() => setActiveMainTab('JOBS')}
          className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMainTab === 'JOBS'
              ? 'bg-[#0054A6] text-white shadow-md ring-2 ring-blue-300'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>2. Job Management UI (Kanban/Grid)</span>
        </button>

        <button
          onClick={() => setActiveMainTab('PAGES')}
          className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMainTab === 'PAGES'
              ? 'bg-[#0054A6] text-white shadow-md ring-2 ring-blue-300'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Page Hierarchy & Modules</span>
        </button>

        <button
          onClick={() => setActiveMainTab('ARCHITECTURE')}
          className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMainTab === 'ARCHITECTURE'
              ? 'bg-[#0054A6] text-white shadow-md ring-2 ring-blue-300'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>4. Design System Architecture (Colors/Shadcn)</span>
        </button>
      </div>

      {/* VIEWPORT 1: EXECUTIVE ROLE DASHBOARDS */}
      {activeMainTab === 'DASHBOARDS' && <RoleDashboardsV4 />}

      {/* VIEWPORT 2: JOB MANAGEMENT UI (KANBAN / MASTER TABLE) */}
      {activeMainTab === 'JOBS' && <JobManagementV4 />}

      {/* VIEWPORT 3: ENTERPRISE PAGE HIERARCHY & MODULES */}
      {activeMainTab === 'PAGES' && <EnterprisePagesV4 />}

      {/* VIEWPORT 4: DESIGN SYSTEM ARCHITECTURE & TOKENS */}
      {activeMainTab === 'ARCHITECTURE' && (
        <div className="space-y-10 animate-fade-in">
          
          {/* Section A: Corporate Color Palette System */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="border-b pb-4">
              <span className="text-[10px] font-mono font-black uppercase text-[#0054A6]">AVON Brand Mandate</span>
              <h3 className="text-xl font-black text-slate-800 mt-1">Corporate Color System Tokens</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {V4_COLOR_SYSTEM.map(c => (
                <div key={c.name} className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow">
                  <div className={`h-20 p-3 flex flex-col justify-end font-mono text-xs font-bold ${c.tailwindClass}`}>
                    <span>{c.name}</span>
                    <span className="opacity-90 text-[11px]">{c.hex}</span>
                  </div>
                  <div className="p-3 bg-slate-50 text-[11px] text-slate-600 font-medium">
                    {c.usage}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Typography System */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="border-b pb-4">
              <span className="text-[10px] font-mono font-black uppercase text-[#0054A6]">Typography Hierarchy</span>
              <h3 className="text-xl font-black text-slate-800 mt-1">Enterprise Typography Tokens</h3>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100 text-[11px] font-mono text-slate-500 uppercase">
                    <th className="p-3">Level Token</th>
                    <th className="p-3">Font Family</th>
                    <th className="p-3">Tailwind Classes</th>
                    <th className="p-3">Live Render Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs font-medium">
                  {V4_TYPOGRAPHY_SYSTEM.map(t => (
                    <tr key={t.level} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 font-mono">{t.level}</td>
                      <td className="p-3 text-slate-600">{t.fontFamily}</td>
                      <td className="p-3 font-mono text-blue-600 text-[11px]">{t.sizeWeight}</td>
                      <td className="p-3"><span className={t.sizeWeight}>{t.example}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section C: Shadcn UI Component Mapping */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="border-b pb-4">
              <span className="text-[10px] font-mono font-black uppercase text-[#0054A6]">Atomic Component Matrix</span>
              <h3 className="text-xl font-black text-slate-800 mt-1">Shadcn UI Enterprise Component Mapping</h3>
            </div>

            <div className="border rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#003B75] text-white text-xs font-mono uppercase">
                    <th className="p-3.5">Enterprise Feature</th>
                    <th className="p-3.5">Shadcn UI Atomic Mapping</th>
                    <th className="p-3.5">Tailwind Enterprise Customization</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs font-medium">
                  {V4_SHADCN_MAPPING.map(m => (
                    <tr key={m.enterpriseFeature} className="hover:bg-blue-50/50">
                      <td className="p-3.5 font-bold text-slate-900">{m.enterpriseFeature}</td>
                      <td className="p-3.5 font-mono text-[#0054A6] font-bold">{m.shadcnComponent}</td>
                      <td className="p-3.5 text-slate-600">{m.tailwindCustomization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section D: Next.js 15 Folder Structure Architecture */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="border-b pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-[#0054A6]">Production Architecture Tree</span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Next.js 15 App Router & Supabase Folder Structure</h3>
              </div>
              <FolderTree className="w-6 h-6 text-slate-400" />
            </div>

            <div className="space-y-2 font-mono text-xs">
              {V4_NEXTJS_STRUCTURE.map(nf => (
                <div key={nf.path} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border flex items-start justify-between gap-4 transition-colors">
                  <div className="flex items-center gap-2 font-bold text-[#0054A6]">
                    <span>{nf.type === 'dir' ? '📁' : '📄'}</span>
                    <span>{nf.path}</span>
                  </div>
                  <span className="text-slate-600 font-sans font-medium text-[11px] text-right max-w-lg">{nf.description}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
