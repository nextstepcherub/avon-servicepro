import React, { useState } from 'react';
import {
  Wrench,
  FileSpreadsheet,
  Building2,
  Microscope,
  Award,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  Upload,
  Clock,
  User,
  ShieldCheck,
  FileText,
  DollarSign,
  ThumbsUp,
  WifiOff,
  Wifi,
  Download,
  Share2,
  Eye,
  Sliders,
  AlertCircle
} from 'lucide-react';

export default function EnterprisePagesV4() {
  const [activeModulePage, setActiveModulePage] = useState<
    'INSTALLATION' | 'SERVICE_REQ' | 'WORKSHOP' | 'CUST_PROFILE' | 'INST_PROFILE' | 'KPI_MOD' | 'FEEDBACK_MOD' | 'MOBILE_PWA'
  >('INSTALLATION');

  // Customer Profile Tab state
  const [custTab, setCustTab] = useState('overview');
  // Instrument Profile Tab state
  const [instTab, setInstTab] = useState('overview');

  // Mobile viewport test state
  const [deviceViewport, setDeviceViewport] = useState<'MOBILE' | 'TABLET' | 'DESKTOP'>('DESKTOP');
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in text-left select-none">
      
      {/* Module Page Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-black uppercase text-[#0054A6] tracking-wider">
              Complete Page Hierarchy Showcase
            </span>
            <h2 className="text-lg font-black text-slate-800">
              AVON Enterprise SaaS Viewport Modules
            </h2>
          </div>
          <span className="text-xs bg-blue-50 text-[#0054A6] font-mono font-bold px-3 py-1 rounded-xl border border-blue-200 hidden md:inline">
            Next.js 15 App Router Architecture
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {[
            { id: 'INSTALLATION', label: '1. Installation Page', icon: Wrench },
            { id: 'SERVICE_REQ', label: '2. Service Request', icon: FileText },
            { id: 'WORKSHOP', label: '3. Workshop Intake', icon: Sliders },
            { id: 'CUST_PROFILE', label: '4. Customer 360° Profile', icon: Building2 },
            { id: 'INST_PROFILE', label: '5. Instrument Digital Twin', icon: Microscope },
            { id: 'KPI_MOD', label: '6. KPI Engine', icon: Award },
            { id: 'FEEDBACK_MOD', label: '7. CSAT Feedback', icon: MessageSquare },
            { id: 'MOBILE_PWA', label: '8. Mobile & PWA Offline', icon: Smartphone }
          ].map(p => {
            const Icon = p.icon;
            const isSel = activeModulePage === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveModulePage(p.id as any)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-none justify-center ${
                  isSel ? 'bg-[#0054A6] text-white shadow-xs ring-2 ring-blue-300' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. INSTALLATION PAGE */}
      {activeModulePage === 'INSTALLATION' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="border-b pb-4 flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                STATUS: IQ/OQ IN PROGRESS
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1.5">Shimadzu Nexera LC-40DX3 Commissioning Protocol</h3>
              <p className="text-xs text-slate-500">Installation Ticket: INS-2026-0412 | SLA Target: 24 Hours</p>
            </div>
            <div className="flex gap-2 self-start sm:self-center">
              <button className="px-3 py-1.5 bg-[#0054A6] text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer">
                ✍️ Complete Signoff
              </button>
              <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer border">
                🖨️ Print IQ/OQ PDF
              </button>
            </div>
          </div>

          {/* Required 8 Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">1. Job Details</span>
              <strong className="block text-slate-800">PO Ref: SPC/LAB/2026/89</strong>
              <div className="text-slate-600">Dispatched: June 22, 2026</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">2. Customer Information</span>
              <strong className="block text-slate-800">State Pharmaceuticals Corp</strong>
              <div className="text-slate-600">QA Bio-Lab | Dr. H. Silva</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">3. Instrument Information</span>
              <strong className="block text-slate-800">Shimadzu HPLC LC-40DX3</strong>
              <div className="text-slate-600 font-mono text-[11px]">SN: L204058921</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">4. Assigned Staff & SLA</span>
              <strong className="block text-[#0054A6]">Cherub Weeratunge (Lead Eng)</strong>
              <div className="text-emerald-700 font-mono font-bold">⏱️ SLA Remaining: 18 hrs Safe</div>
            </div>
          </div>

          {/* 5. Installation Checklist */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800">5. Factory Commissioning Checklist (IQ/OQ/PQ)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Installation Qualification (IQ) Verified</span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-900 font-bold">
                <Clock className="w-4 h-4 text-[#0054A6] shrink-0 animate-spin" />
                <span>Operational Qualification (OQ) Testing</span>
              </div>
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-500 font-medium opacity-70">
                <span className="w-4 h-4 rounded-full border-2 border-slate-400 shrink-0"></span>
                <span>Performance Qualification (PQ) Pending</span>
              </div>
            </div>
          </div>

          {/* 6. Document Uploads & Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">6. Upload Service Sign-off Documents (PDF/JPG)</div>
              <p className="text-[10px] text-slate-400 font-mono">Drag and drop customer signed commissioning slip</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border space-y-3">
              <span className="text-xs font-bold text-slate-800 block">7 & 8. Installation History Timeline</span>
              <div className="space-y-2 text-xs font-mono text-slate-600">
                <div className="flex justify-between border-b pb-1"><span>📦 Unpacked on Site</span><span className="text-slate-400">June 22 10:00</span></div>
                <div className="flex justify-between border-b pb-1"><span>⚡ Electrical & Gas Line connected</span><span className="text-slate-400">June 22 14:30</span></div>
                <div className="flex justify-between text-[#0054A6] font-bold"><span>💻 LabSolutions CS Software Licensed</span><span>June 23 09:15</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SERVICE REQUEST PAGE */}
      {activeModulePage === 'SERVICE_REQ' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="border-b pb-4">
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              STAGE: QUOTATION PENDING CUSTOMER PO
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-1.5">360° Service Request Workflow Engine</h3>
            <p className="text-xs text-slate-500">Ticket: SRV-2026-0901 | Asiri Surgical Hospital (Central Chemistry Lab)</p>
          </div>

          {/* 8 Required Lifecycle Steps Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-[11px] font-mono font-bold">
            <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl border border-emerald-300">1. Issue Summary ☑</div>
            <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl border border-emerald-300">2. Inspection ☑</div>
            <div className="bg-[#0054A6] text-white p-2.5 rounded-xl shadow-md ring-2 ring-blue-300">3. Quotation ⏳</div>
            <div className="bg-slate-100 text-slate-400 p-2.5 rounded-xl border">4. Customer PO</div>
            <div className="bg-slate-100 text-slate-400 p-2.5 rounded-xl border">5. Repair Exec</div>
            <div className="bg-slate-100 text-slate-400 p-2.5 rounded-xl border">6. Tax Invoice</div>
            <div className="bg-slate-100 text-slate-400 p-2.5 rounded-xl border">7. Feedback</div>
            <div className="bg-slate-100 text-slate-400 p-2.5 rounded-xl border">8. Timeline</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            <div className="lg:col-span-2 bg-slate-50 p-5 rounded-2xl border space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Quotation Cost Sheet & Part Replacement Breakdown</h4>
              <table className="w-full text-left border-collapse bg-white rounded-xl overflow-hidden border">
                <thead className="bg-slate-100 text-[11px] font-mono text-slate-500">
                  <tr><th className="p-2.5">Part Description</th><th className="p-2.5">Part #</th><th className="p-2.5 text-right">Qty</th><th className="p-2.5 text-right">Amount (LKR)</th></tr>
                </thead>
                <tbody className="divide-y font-mono">
                  <tr><td className="p-2.5 font-sans font-medium">Autosampler Needle Assembly</td><td className="p-2.5 text-blue-600">S228-56001-91</td><td className="p-2.5 text-right">1</td><td className="p-2.5 text-right font-bold">185,000.00</td></tr>
                  <tr><td className="p-2.5 font-sans font-medium">High Pressure Rotor Seal</td><td className="p-2.5 text-blue-600">S228-56004-00</td><td className="p-2.5 text-right">1</td><td className="p-2.5 text-right font-bold">140,000.00</td></tr>
                  <tr><td className="p-2.5 font-sans font-medium">Senior Engineer Specialized Labor</td><td className="p-2.5 text-slate-400">SRV-LABOR</td><td className="p-2.5 text-right">8h</td><td className="p-2.5 text-right font-bold">125,000.00</td></tr>
                </tbody>
              </table>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t">
                <span>Total Quoted Amount (Subject to VAT 18%):</span>
                <span className="text-[#0054A6] font-mono text-base">LKR 450,000.00</span>
              </div>
            </div>

            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200 space-y-3">
              <strong className="text-slate-800 block">Action Workflow:</strong>
              <p className="text-slate-600 leading-relaxed">
                Quotation # QUO-2026-088 transmitted to hospital procurement. Awaiting formal Purchase Order (PO) sign-off before warehouse spare part dispatch.
              </p>
              <button className="w-full py-2.5 bg-[#0054A6] text-white font-bold rounded-xl shadow-xs hover:bg-blue-700 cursor-pointer text-xs">
                📎 Attach Received Customer PO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. WORKSHOP PAGE */}
      {activeModulePage === 'WORKSHOP' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="border-b pb-4">
            <h3 className="text-xl font-black text-slate-800">Workshop Bench Turnaround Lifecycle</h3>
            <p className="text-xs text-slate-500">Managing equipment brought into AVON Central Repair Workshop</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
            {[
              { s: '1. Received Items', c: 4, col: 'bg-slate-100 text-slate-800' },
              { s: '2. Diagnosing', c: 7, col: 'bg-blue-100 text-blue-900 font-bold ring-2 ring-blue-300' },
              { s: '3. Repairing / Solder', c: 9, col: 'bg-amber-100 text-amber-900' },
              { s: '4. QA Testing', c: 8, col: 'bg-purple-100 text-purple-900' },
              { s: '5. Ready For Delivery', c: 11, col: 'bg-teal-100 text-teal-900' },
              { s: '6. Delivered Gatepass', c: 142, col: 'bg-emerald-100 text-emerald-900' }
            ].map(w => (
              <div key={w.s} className={`p-4 rounded-2xl border text-center space-y-1 ${w.col}`}>
                <div className="text-[10px] uppercase opacity-80">{w.s}</div>
                <div className="text-2xl font-black">{w.c}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CUSTOMER PROFILE PAGE */}
      {activeModulePage === 'CUST_PROFILE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0054A6] text-white flex items-center justify-center font-black text-xl shadow-md">
                AS
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Asiri Surgical Hospital PLC</h3>
                <p className="text-xs text-slate-500">Customer Org ID: CUST-COL-001 | Tier 1 Healthcare Partner</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-mono text-xs font-bold self-center">
                ● Active Annual Contract
              </span>
            </div>
          </div>

          {/* 8 Required Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2 text-xs font-bold font-mono">
            {[
              { id: 'overview', label: '1. Overview' },
              { id: 'depts', label: '2. Departments (4)' },
              { id: 'users', label: '3. End Users (12)' },
              { id: 'instruments', label: '4. Installed Fleet (14)' },
              { id: 'history', label: '5. Service History (89)' },
              { id: 'rev', label: '6. Revenue Ledger' },
              { id: 'csat', label: '7. CSAT (4.9★)' },
              { id: 'docs', label: '8. Documents / SLAs' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setCustTab(t.id)}
                className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                  custTab === t.id ? 'bg-[#0054A6] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {custTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border space-y-2">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Primary Laboratory Departments</span>
                <ul className="space-y-1 font-bold text-slate-700">
                  <li>🧪 Central Clinical Chemistry Div</li>
                  <li>🩸 Pathology & Hematology Div</li>
                  <li>🧬 Molecular Diagnostics Reference Lab</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border space-y-2">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Key Commercial Metrics</span>
                <div className="text-xl font-black text-slate-800">LKR 42.5M Lifetime</div>
                <div className="text-emerald-600 font-mono">Current YTD: LKR 14.2M</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border space-y-2">
                <span className="font-mono text-slate-400 uppercase text-[10px]">Customer Relationship SLA</span>
                <div className="text-base font-bold text-[#0054A6]">Priority 4-Hour Response</div>
                <p className="text-slate-500 text-[11px]">Assigned Area Engineer: Cherub Weeratunge</p>
              </div>
            </div>
          )}

          {custTab !== 'overview' && (
            <div className="p-8 bg-slate-50 rounded-2xl border text-center font-mono text-xs text-slate-500">
              📂 Viewing {custTab.toUpperCase()} tab records for Asiri Surgical Hospital...
            </div>
          )}
        </div>
      )}

      {/* 5. INSTRUMENT PROFILE PAGE */}
      {activeModulePage === 'INST_PROFILE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <Microscope className="w-10 h-10 text-[#0054A6] bg-blue-50 p-2 rounded-2xl border border-blue-200" />
              <div>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded mr-2">
                  SHIMADZU
                </span>
                <span className="font-mono text-xs font-black text-slate-500">SN: L204058921</span>
                <h3 className="text-xl font-black text-slate-800 mt-1">Nexera LC-40DX3 Ultra High Performance Liquid Chromatograph</h3>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-mono text-xs font-bold self-start sm:self-center">
              🛡️ Factory Warranty Active (Expires: Nov 2026)
            </span>
          </div>

          {/* 8 Required Instrument Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2 text-xs font-bold font-mono">
            {[
              { id: 'overview', label: '1. Overview' },
              { id: 'installation', label: '2. Installation' },
              { id: 'warranty', label: '3. Warranty' },
              { id: 'service', label: '4. Service History (14)' },
              { id: 'repair', label: '5. Repair History (2)' },
              { id: 'cal', label: '6. Calibration Logs' },
              { id: 'docs', label: '7. Manuals / Schematics' },
              { id: 'timeline', label: '8. Digital Twin Timeline' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setInstTab(t.id)}
                className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                  instTab === t.id ? 'bg-[#0054A6] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {instTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border"><span className="text-slate-400 font-mono block text-[10px]">Installed Location</span><strong className="text-slate-800">Asiri Surgical Hospital</strong><div>Clinical Chemistry Bench #4</div></div>
              <div className="bg-slate-50 p-4 rounded-xl border"><span className="text-slate-400 font-mono block text-[10px]">Commissioned Date</span><strong className="text-slate-800 font-mono">2023-11-14</strong><div>IQ/OQ Cert # SHIM-IQ-881</div></div>
              <div className="bg-slate-50 p-4 rounded-xl border"><span className="text-slate-400 font-mono block text-[10px]">Firmware / Software</span><strong className="text-slate-800 font-mono">v5.82 Build 4091</strong><div>LabSolutions CS Workstation</div></div>
              <div className="bg-slate-50 p-4 rounded-xl border"><span className="text-slate-400 font-mono block text-[10px]">PM Frequency</span><strong className="text-slate-800">Every 6 Months</strong><div className="text-emerald-600 font-bold">Next PM: August 2026</div></div>
            </div>
          )}

          {instTab !== 'overview' && (
            <div className="p-8 bg-slate-50 rounded-2xl border text-center font-mono text-xs text-slate-500">
              🔬 Displaying Shimadzu LC-40DX3 telemetry records under {instTab.toUpperCase()} tab...
            </div>
          )}
        </div>
      )}

      {/* 6. KPI MODULE UI */}
      {activeModulePage === 'KPI_MOD' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="border-b pb-4">
            <h3 className="text-xl font-black text-slate-800">AVON Enterprise Performance & KPI Engine</h3>
            <p className="text-xs text-slate-500">Real-time analytical leaderboards and SLA quota scoring</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-gradient-to-br from-blue-900 to-[#0054A6] text-white p-5 rounded-2xl shadow-md space-y-3">
              <span className="font-mono text-cyan-300 text-[10px] uppercase font-bold">Role KPI Dashboard</span>
              <h4 className="text-lg font-black">Senior Biomedical Engineer</h4>
              <div className="text-3xl font-black text-emerald-300">96.4% Score</div>
              <p className="text-blue-100 text-[11px]">Ranked #1 out of 18 field service engineers in SLA turnaround speed.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border space-y-3">
              <span className="font-mono text-slate-400 text-[10px] uppercase font-bold">Department KPI Dashboard</span>
              <h4 className="text-base font-black text-slate-800">Biomedical & Metrology Div</h4>
              <div className="text-2xl font-black text-[#0054A6]">94.8% SLA Attainment</div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2"><div className="w-[94.8%] bg-[#0054A6] h-full"></div></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border space-y-3">
              <span className="font-mono text-slate-400 text-[10px] uppercase font-bold">Territory KPI Dashboard</span>
              <h4 className="text-base font-black text-slate-800">Western Province Sector</h4>
              <div className="text-2xl font-black text-purple-600">LKR 14.8M Revenue</div>
              <p className="text-slate-500 text-[11px]">Monthly service contract renewal quota achieved.</p>
            </div>
          </div>
        </div>
      )}

      {/* 7. CUSTOMER FEEDBACK MODULE */}
      {activeModulePage === 'FEEDBACK_MOD' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="border-b pb-4">
            <h3 className="text-xl font-black text-slate-800">Customer Satisfaction (CSAT) & NPS Voice of Customer</h3>
            <p className="text-xs text-slate-500">Automated post-service survey responses from hospital directors</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 text-center"><span className="text-purple-800 block">Average Rating</span><strong className="text-2xl text-purple-900 font-sans font-black">4.92 / 5.0 ★</strong></div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center"><span className="text-emerald-800 block">Survey Completion %</span><strong className="text-2xl text-emerald-900 font-sans font-black">84.5%</strong></div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center"><span className="text-blue-800 block">Net Promoter Score</span><strong className="text-2xl text-blue-900 font-sans font-black">+88 Excellent</strong></div>
            <div className="bg-slate-100 p-4 rounded-xl border text-center"><span className="text-slate-600 block">Total Reviews</span><strong className="text-2xl text-slate-900 font-sans font-black">312 YTD</strong></div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800">Engineer Ratings Leaderboard</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border"><span>🥇 <strong>Cherub Weeratunge</strong> (Senior Eng)</span><span className="font-mono font-bold text-amber-600">4.98 ★ (142 reviews)</span></div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border"><span>🥈 <strong>K. S. Perera</strong> (Workshop Eng)</span><span className="font-mono font-bold text-amber-600">4.91 ★ (98 reviews)</span></div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MOBILE & PWA OFFLINE DESIGN */}
      {activeModulePage === 'MOBILE_PWA' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-800">Progressive Web App (PWA) & Offline Mobile Strategy</h3>
              <p className="text-xs text-slate-500">Field engineer mobile service execution in zero-signal hospital basements</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOfflineMode(!isOfflineMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer border ${
                  isOfflineMode ? 'bg-red-600 text-white border-red-700 animate-pulse' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {isOfflineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                <span>{isOfflineMode ? 'SIMULATED OFFLINE MODE' : 'ONLINE CLOUD SYNC'}</span>
              </button>
            </div>
          </div>

          {/* Viewport Width Toggler */}
          <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl border w-fit mx-auto text-xs font-bold">
            <button
              onClick={() => setDeviceViewport('MOBILE')}
              className={`px-4 py-1.5 rounded-lg cursor-pointer transition-all ${deviceViewport === 'MOBILE' ? 'bg-[#0054A6] text-white' : 'text-slate-600'}`}
            >
              📱 Mobile (375px)
            </button>
            <button
              onClick={() => setDeviceViewport('TABLET')}
              className={`px-4 py-1.5 rounded-lg cursor-pointer transition-all ${deviceViewport === 'TABLET' ? 'bg-[#0054A6] text-white' : 'text-slate-600'}`}
            >
              💊 Tablet (768px)
            </button>
            <button
              onClick={() => setDeviceViewport('DESKTOP')}
              className={`px-4 py-1.5 rounded-lg cursor-pointer transition-all ${deviceViewport === 'DESKTOP' ? 'bg-[#0054A6] text-white' : 'text-slate-600'}`}
            >
              🖥️ Desktop Full
            </button>
          </div>

          {/* Simulated Device Frame Container */}
          <div className="flex justify-center pt-2">
            <div 
              className={`transition-all bg-slate-900 rounded-3xl p-3 border-4 border-slate-800 shadow-2xl overflow-hidden ${
                deviceViewport === 'MOBILE' ? 'w-[375px]' : deviceViewport === 'TABLET' ? 'w-[768px]' : 'w-full'
              }`}
            >
              {/* Device Notch / Top Bar */}
              <div className="h-6 bg-slate-900 text-white font-mono text-[10px] flex items-center justify-between px-4 pb-1">
                <span>9:41</span>
                <span className="w-16 h-3 bg-slate-800 rounded-full"></span>
                <span>📶 🔋 100%</span>
              </div>

              {/* Mobile App Canvas */}
              <div className="bg-[#F5F8FC] rounded-2xl p-4 text-slate-800 space-y-4 max-h-[600px] overflow-y-auto">
                {isOfflineMode && (
                  <div className="bg-red-600 text-white text-[10px] font-mono font-bold p-2 rounded-lg text-center shadow-md flex items-center justify-center gap-1.5">
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>ZERO SIGNAL: Saving service signoff to local IndexedDB queue</span>
                  </div>
                )}

                <div className="bg-[#0054A6] text-white p-4 rounded-2xl shadow-sm space-y-1">
                  <div className="text-[10px] font-mono opacity-80">AVON MOBILE FIELD DISPATCH</div>
                  <h4 className="text-base font-black">Asiri Surgical Hospital</h4>
                  <p className="text-xs text-blue-100 font-mono">Nexera LC-40DX3 | SRV-2026-0901</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-800 border-b pb-2">📋 Service Execution Touch Checklist</div>
                  <label className="flex items-center gap-2.5 text-xs p-2 bg-slate-50 rounded-xl font-medium cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0054A6] rounded" />
                    <span>Inspect Autosampler Needle Block</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs p-2 bg-slate-50 rounded-xl font-medium cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0054A6] rounded" />
                    <span>Replace Rotor Seal # S228-56004</span>
                  </label>
                </div>

                <button className="w-full py-3 bg-emerald-600 text-white font-black rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer">
                  ✍️ Touch Customer Digital Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
