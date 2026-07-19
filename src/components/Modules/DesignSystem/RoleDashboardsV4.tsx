import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Building2,
  Wrench,
  Microscope,
  ShieldCheck,
  FileSpreadsheet,
  MapPin,
  Calendar,
  Compass,
  Zap,
  BarChart3,
  DollarSign,
  ThumbsUp,
  Package,
  Truck
} from 'lucide-react';

export default function RoleDashboardsV4() {
  const [activeRole, setActiveRole] = useState<'MGR' | 'AREA' | 'TECH' | 'WORKSHOP' | 'CAL'>('MGR');

  return (
    <div className="space-y-6 animate-fade-in text-left select-none">
      
      {/* Role Switcher Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-black uppercase text-[#0054A6] tracking-wider block">
            Executive Persona Switcher
          </span>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">
            Enterprise Role-Specific Dashboard Viewport
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-full md:w-auto">
          {[
            { id: 'MGR', label: 'Workshop Manager', icon: LayoutDashboard },
            { id: 'AREA', label: 'Area Engineer', icon: MapPin },
            { id: 'TECH', label: 'Technician', icon: Wrench },
            { id: 'WORKSHOP', label: 'Workshop Eng', icon: Package },
            { id: 'CAL', label: 'Calibration Eng', icon: ShieldCheck }
          ].map(r => {
            const Icon = r.icon;
            const isSel = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id as any)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-none justify-center ${
                  isSel ? 'bg-[#0054A6] text-white shadow-xs ring-2 ring-blue-300' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. WORKSHOP MANAGER DASHBOARD */}
      {activeRole === 'MGR' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top 10 Widget Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Open Jobs</div>
              <div className="text-2xl font-black text-[#0054A6] mt-1">142</div>
              <span className="text-[10px] text-emerald-600 font-bold">▲ 12% vs last month</span>
              <Wrench className="w-8 h-8 text-blue-100 absolute right-2 bottom-2 -z-0" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Monthly Revenue</div>
              <div className="text-2xl font-black text-slate-800 mt-1">LKR 14.8M</div>
              <span className="text-[10px] text-emerald-600 font-bold">▲ 104% of quota</span>
              <DollarSign className="w-8 h-8 text-emerald-100 absolute right-2 bottom-2 -z-0" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Department KPI</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">94.8%</div>
              <span className="text-[10px] text-slate-500 font-medium">Target: 90.0% SLA</span>
              <Award className="w-8 h-8 text-emerald-100 absolute right-2 bottom-2 -z-0" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Customer CSAT</div>
              <div className="text-2xl font-black text-purple-600 mt-1">4.9 / 5.0</div>
              <span className="text-[10px] text-purple-600 font-bold">★ +88 NPS Score</span>
              <ThumbsUp className="w-8 h-8 text-purple-100 absolute right-2 bottom-2 -z-0" />
            </div>

            <div className="bg-red-50 p-4 rounded-2xl border border-red-200 shadow-xs relative overflow-hidden">
              <div className="text-[10px] font-mono font-bold uppercase text-red-800">Emergency Jobs</div>
              <div className="text-2xl font-black text-red-600 mt-1 animate-pulse">7 Active</div>
              <span className="text-[10px] text-red-700 font-bold">🚨 Immediate dispatch</span>
              <AlertTriangle className="w-8 h-8 text-red-200 absolute right-2 bottom-2 -z-0" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Warranty Alerts</div>
              <div className="text-xl font-black text-amber-600 mt-1">18 Expiring</div>
              <span className="text-[10px] text-slate-500">&lt;= 30 Days remaining</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Workshop Queue</div>
              <div className="text-xl font-black text-blue-600 mt-1">24 Instruments</div>
              <span className="text-[10px] text-slate-500">Bench turnaround</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Calibration Queue</div>
              <div className="text-xl font-black text-teal-600 mt-1">19 Weights/Meters</div>
              <span className="text-[10px] text-slate-500">ISO 17025 SLAB</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Pending Approvals</div>
              <div className="text-xl font-black text-amber-600 mt-1">12 Quotations</div>
              <span className="text-[10px] text-slate-500">Awaiting PO signoff</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Overdue Jobs</div>
              <div className="text-xl font-black text-red-600 mt-1">4 Breached</div>
              <span className="text-[10px] text-slate-500">SLA penalty warning</span>
            </div>
          </div>

          {/* Simulated Analytical Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Monthly Revenue & Quota Attainment (2026)</h3>
                <span className="text-xs font-mono text-[#0054A6] font-bold bg-blue-50 px-2 py-1 rounded">LKR Millions</span>
              </div>
              <div className="h-48 flex items-end justify-between gap-3 pt-4 border-b border-slate-200 font-mono text-[10px] text-slate-500">
                {[
                  { m: 'Jan', val: 65, rev: '10.2M' },
                  { m: 'Feb', val: 75, rev: '11.8M' },
                  { m: 'Mar', val: 88, rev: '13.5M' },
                  { m: 'Apr', val: 70, rev: '11.0M' },
                  { m: 'May', val: 92, rev: '14.1M' },
                  { m: 'Jun', val: 98, rev: '14.8M' }
                ].map(bar => (
                  <div key={bar.m} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[#0054A6] absolute -top-5">{bar.rev}</span>
                    <div className="w-full bg-[#0054A6] rounded-t-lg transition-all group-hover:bg-[#00AEEF]" style={{ height: `${bar.val}%` }}></div>
                    <span>{bar.m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Job Completion & SLA Achievement Trend</h3>
                <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">94.8% SLA Avg</span>
              </div>
              <div className="h-48 flex items-center justify-center border border-slate-100 rounded-xl bg-slate-50/50 p-4">
                <div className="w-full space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1"><span>Preventive Maintenance SLA</span><span className="text-emerald-600 font-mono">98.2%</span></div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="w-[98%] bg-emerald-500 h-full"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1"><span>Breakdown Emergency Response (4h)</span><span className="text-blue-600 font-mono">92.4%</span></div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="w-[92%] bg-[#0054A6] h-full"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1"><span>IQ/OQ Commissioning Timeline</span><span className="text-purple-600 font-mono">95.0%</span></div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="w-[95%] bg-purple-600 h-full"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. AREA ENGINEER DASHBOARD (WITH SIMULATED MAP) */}
      {activeRole === 'AREA' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="bg-white p-4 rounded-2xl border shadow-xs"><div className="text-[10px] font-mono text-slate-400">My Jobs</div><div className="text-xl font-black text-[#0054A6]">8 Active</div></div>
            <div className="bg-white p-4 rounded-2xl border shadow-xs"><div className="text-[10px] font-mono text-slate-400">Pending Assign</div><div className="text-xl font-black text-blue-600">3 Tickets</div></div>
            <div className="bg-white p-4 rounded-2xl border shadow-xs"><div className="text-[10px] font-mono text-slate-400">Warranty Due</div><div className="text-xl font-black text-amber-600">5 Visits</div></div>
            <div className="bg-white p-4 rounded-2xl border shadow-xs"><div className="text-[10px] font-mono text-slate-400">My Revenue</div><div className="text-xl font-black text-emerald-600">1.85M</div></div>
            <div className="bg-white p-4 rounded-2xl border shadow-xs"><div className="text-[10px] font-mono text-slate-400">KPI Score</div><div className="text-xl font-black text-purple-600">96.4%</div></div>
            <div className="bg-white p-4 rounded-2xl border shadow-xs"><div className="text-[10px] font-mono text-slate-400">CSAT Score</div><div className="text-xl font-black text-slate-800">4.95 ★</div></div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-200 shadow-xs"><div className="text-[10px] font-mono text-red-800 font-bold">Emergency</div><div className="text-xl font-black text-red-600 animate-pulse">2 ICU Site</div></div>
          </div>

          {/* Interactive Simulated GPS Territory Map */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#0054A6]" />
                <h3 className="text-base font-bold text-slate-800">Live GPS Territory Map Viewport (Colombo & Western Province)</h3>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-mono font-bold px-3 py-1 rounded-full">
                🛰️ GPS Tracking Online
              </span>
            </div>

            <div className="h-96 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center p-6 border-4 border-slate-800 shadow-inner">
              {/* Simulated Map Grid Canvas */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00AEEF_1px,transparent_1px)] [background-size:24px_24px]"></div>
              
              {/* Simulated GPS Pins */}
              <div className="absolute top-1/4 left-1/3 bg-red-600 text-white font-mono text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 animate-bounce cursor-pointer border-2 border-white">
                <span>🚨 Asiri Surgical (LC-40DX3)</span>
              </div>

              <div className="absolute top-1/2 left-1/2 bg-[#0054A6] text-white font-mono text-[10px] font-bold px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 cursor-pointer border border-blue-300">
                <span>🏥 Lanka Hospitals (KingFisher)</span>
              </div>

              <div className="absolute bottom-1/3 right-1/4 bg-amber-500 text-slate-900 font-mono text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 cursor-pointer border border-white">
                <span>⚡ Hemas Thalawathugoda</span>
              </div>

              <div className="absolute bottom-8 left-8 bg-slate-800/90 text-slate-200 p-3 rounded-xl border border-slate-700 font-mono text-xs max-w-xs z-10 space-y-1">
                <div className="text-cyan-400 font-bold">📍 Current Telemetry Position:</div>
                <div>AVON Service Central – Colombo 02</div>
                <div className="text-[10px] text-slate-400">Next Stop: Asiri Surgical (Est ETA: 14 mins)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TECHNICIAN DASHBOARD */}
      {activeRole === 'TECH' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Today's Jobs</div><div className="text-2xl font-black text-[#0054A6]">4 Site Visits</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Pending Bench</div><div className="text-2xl font-black text-amber-600">2 Repairs</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Completed</div><div className="text-2xl font-black text-emerald-600">18 This Wk</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">CSAT Rating</div><div className="text-2xl font-black text-purple-600">4.9 ★</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">KPI Score</div><div className="text-2xl font-black text-blue-600">92.0%</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Parts Ready</div><div className="text-2xl font-black text-teal-600">6 Kits</div></div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0054A6]" />
              <span>Upcoming Field & Bench Schedule (Today)</span>
            </h3>

            <div className="relative border-l-2 border-blue-200 ml-3 space-y-6 pl-6 pt-2 pb-2">
              <div className="relative">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute -left-[31px] top-1"></span>
                <span className="text-xs font-mono font-bold text-slate-400">08:30 AM - 11:30 AM (COMPLETED)</span>
                <h4 className="text-sm font-black text-slate-800 mt-0.5">Durdans Hospital – Agilent 6470B LC/TQ</h4>
                <p className="text-xs text-slate-600">Completed roughing pump oil replacement & vacuum check sign-off.</p>
              </div>

              <div className="relative">
                <span className="w-3.5 h-3.5 rounded-full bg-[#0054A6] animate-ping absolute -left-[31px] top-1"></span>
                <span className="text-xs font-mono font-bold text-[#0054A6]">01:00 PM - 03:30 PM (IN PROGRESS)</span>
                <h4 className="text-sm font-black text-slate-800 mt-0.5">Asiri Surgical – Nexera LC-40DX3 HPLC</h4>
                <p className="text-xs text-slate-600">Autosampler needle alignment protocol under emergency ticket.</p>
              </div>

              <div className="relative opacity-60">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white absolute -left-[31px] top-1"></span>
                <span className="text-xs font-mono font-bold text-slate-400">04:00 PM - 05:30 PM (SCHEDULED)</span>
                <h4 className="text-sm font-black text-slate-800 mt-0.5">AVON Calibration Bench – Shimadzu Balance</h4>
                <p className="text-xs text-slate-600">Internal sensor verification before delivery gate pass.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. WORKSHOP ENGINEER DASHBOARD */}
      {activeRole === 'WORKSHOP' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Workshop Queue</div><div className="text-2xl font-black text-[#0054A6]">24 Units</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Waiting Parts</div><div className="text-2xl font-black text-rose-600">8 Units</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Ready For Delivery</div><div className="text-2xl font-black text-emerald-600">11 Gate Pass</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Delayed Repairs</div><div className="text-2xl font-black text-red-600">3 Overdue</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Workshop KPI</div><div className="text-2xl font-black text-purple-600">95.2%</div></div>
          </div>

          <div className="bg-white rounded-2xl border p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Workshop Bench Stage Breakdown</h3>
            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200"><strong>Intake & Diagnosing</strong><div className="text-xl text-blue-700 mt-1">7 Instruments</div></div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200"><strong>Soldering & Overhaul</strong><div className="text-xl text-amber-800 mt-1">9 Instruments</div></div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200"><strong>Optical QA Testing</strong><div className="text-xl text-emerald-800 mt-1">8 Instruments</div></div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CALIBRATION ENGINEER DASHBOARD */}
      {activeRole === 'CAL' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Cal Jobs</div><div className="text-xl font-black text-[#0054A6]">19 Meters</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Cal Revenue</div><div className="text-xl font-black text-emerald-600">2.4M LKR</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Cal Due &lt;= 14d</div><div className="text-xl font-black text-amber-600">14 Certificates</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">Accreditation</div><div className="text-xl font-black text-purple-600">SLAB 17025</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">ISO Compliance</div><div className="text-xl font-black text-teal-600">99.4%</div></div>
            <div className="bg-white p-4 rounded-2xl border"><div className="text-[10px] font-mono text-slate-400">KPI Score</div><div className="text-xl font-black text-blue-600">98.0%</div></div>
          </div>

          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-bold">SLAB Accreditation Audit Countdown</span>
              <ShieldCheck className="w-6 h-6 text-cyan-300" />
            </div>
            <h3 className="text-xl font-extrabold">ISO/IEC 17025 Reference Laboratory Metrology Compliance</h3>
            <p className="text-xs text-blue-200 max-w-2xl">
              All primary calibration standard test weights (Class E2/F1) and digital temperature probes are audited and traceable to national standards under Sri Lanka Accreditation Board (SLAB) charter.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
