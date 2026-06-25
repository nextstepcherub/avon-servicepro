import React, { useState, useEffect } from 'react';
import { Instrument, ServiceTicket, ServiceKpis, CalibrationRecord, UserProfile, UserRole, InstallationRequest } from '../types';
import { LoadedUserSession } from '../types/authSchema';
import { loadUserSession } from '../lib/authSessionLoader';
import Sprint12WelcomeCard from './Dashboard/Sprint12WelcomeCard';
import { 
  Activity, 
  ShieldCheck, 
  HeartPulse, 
  Clock, 
  Wrench, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Gauge, 
  Sparkles, 
  PlusCircle, 
  Compass, 
  ClipboardCheck, 
  Award, 
  Clipboard, 
  Thermometer, 
  Droplets, 
  TrendingUp, 
  History, 
  Layers, 
  CheckSquare, 
  ChevronRight,
  ShieldAlert,
  GraduationCap,
  Smile,
  Microscope
} from 'lucide-react';

interface DashboardProps {
  instruments: Instrument[];
  tickets: ServiceTicket[];
  calibrations: CalibrationRecord[];
  kpis: ServiceKpis;
  onNavigate: (module: string) => void;
  onViewTicket: (ticket: ServiceTicket) => void;
  currentUser?: UserProfile;
  installationRequests?: InstallationRequest[];
}

export default function Dashboard({ 
  instruments, 
  tickets, 
  calibrations, 
  kpis, 
  onNavigate, 
  onViewTicket,
  currentUser,
  installationRequests
}: DashboardProps) {
  
  // Set up view mode state. This can be adapted directly to the user's role, 
  // but with an interactive override simulator at the top so any of the 
  // 6 structural dashboards can be tested by auditors.
  const [selectedView, setSelectedView] = useState<string>('manager');
  const [sprint12Session, setSprint12Session] = useState<LoadedUserSession | null>(null);

  useEffect(() => {
    loadUserSession(currentUser?.email).then(sessionData => {
      setSprint12Session(sessionData);
    });
  }, [currentUser?.email]);

  const [alertSimulationLogs, setAlertSimulationLogs] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [activeQuickDialog, setActiveQuickDialog] = useState<string | null>(null);
  const [metricMultiplier, setMetricMultiplier] = useState<number>(1.0);

  // Sync default view with logged-in user role
  useEffect(() => {
    if (currentUser) {
      const role = currentUser.role;
      if (role === 'Workshop Manager' || role === 'MANAGER' || role === 'DIRECTOR') {
        setSelectedView('manager');
      } else if (role === 'Documentation Officer') {
        setSelectedView('documentation');
      } else if (role === 'Calibration Engineer') {
        setSelectedView('calibration');
      } else if (['Senior Workshop Engineer', 'Workshop Engineer', 'Technician'].includes(role)) {
        setSelectedView('workshop');
      } else if (['Junior Biomedical Engineer', 'Junior Service Engineer', 'Junior Workshop Engineer', 'Trainee Technician', 'Trainee Engineer', 'Intern Technician'].includes(role)) {
        setSelectedView('supervised');
      } else {
        setSelectedView('engineer'); // Senior/Field Service Engineers
      }
    }
  }, [currentUser?.role]);

  // Analytical stats calculations
  const totalInstruments = instruments.length;
  const operationalInstruments = instruments.filter(i => i.status === 'OPERATIONAL').length;
  const faultyInstruments = instruments.filter(i => i.status === 'FAULTY' || i.status === 'DOWN').length;
  const faultyPercentage = ((faultyInstruments / totalInstruments) * 100).toFixed(0);
  const calibratingCount = instruments.filter(i => i.status === 'CALIBRATING').length;
  const workshopCount = instruments.filter(i => i.status === 'WORKSHOP' || i.status === 'DOWN').length;

  const activeTickets = tickets.filter(t => t.status !== 'CLOSED');
  const criticalTickets = tickets.filter(t => t.priority === 'CRITICAL' && t.status !== 'CLOSED');
  const highPriorityTickets = tickets.filter(t => t.priority === 'HIGH' && t.status !== 'CLOSED');
  const closedTickets = tickets.filter(t => t.status === 'CLOSED');

  // Trigger simulated in-app alerts based on current view/role context
  const triggerGenericSimAlert = (title: string, message: string) => {
    const time = new Date().toLocaleTimeString();
    setAlertSimulationLogs(prev => [`[${time}] ${title}: ${message}`, ...prev.slice(0, 4)]);
  };

  // Helper text mapping for our 6 dynamic layout views
  const VIEW_META: Record<string, { title: string; badge: string; desc: string; color: string; bg: string }> = {
    manager: {
      title: 'Workshop Administration Control',
      badge: 'Management Desk',
      desc: 'Central command for executive operations, team dispatching, SLA metrics, and budget clearances.',
      color: 'text-[#0054A6]',
      bg: 'bg-blue-50/50'
    },
    documentation: {
      title: 'Compliance & Asset Register Platform',
      badge: 'Administrative & QA Desk',
      desc: 'Installation trackers, warranty verification registry, and ISO-9001 metrology documentation logs.',
      color: 'text-purple-700',
      bg: 'bg-purple-50/50'
    },
    engineer: {
      title: 'Area Assignment Workbench',
      badge: 'Field & Service Engineering',
      desc: 'SLA countdowns, customized customer laboratories travel schedules, and on-site checklist parameters.',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50/50'
    },
    calibration: {
      title: 'Calibration Metrology Workbench',
      badge: 'Metrology Department',
      desc: 'Certified reference standard weights verification, environmental parameters, and certificate generation.',
      color: 'text-cyan-700',
      bg: 'bg-cyan-50/50'
    },
    workshop: {
      title: 'Workshop Bench Workbench',
      badge: 'Bench Engineers & Techs',
      desc: 'Deep board-level electronics troubleshooting, offline machinery repairs, spare parts tracker, and hardware metrics.',
      color: 'text-amber-700',
      bg: 'bg-amber-50/50'
    },
    supervised: {
      title: 'Supervised Learning Workbench',
      badge: 'Junior Engineers & Trainees',
      desc: 'Shadow logs, training checklists, delegation cards under senior oversight, and electrical safety standards tracker.',
      color: 'text-slate-700',
      bg: 'bg-slate-105'
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sprint 1.2 Welcome User Banner & Session Badges */}
      <Sprint12WelcomeCard session={sprint12Session} />

      {/* 1. Header & Identity Block */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between pb-1 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0054A6] animate-pulse"></span>
            <span className="text-[10px] font-mono font-extrabold text-[#00AEEF] uppercase tracking-wider">
              AVON PHARMO CHEM SERVICE CENTRE SYSTEM
            </span>
          </div>
          <h1 id="db-header-title" className="text-2xl font-black text-gray-900 tracking-tight mt-1">
            AVON ServicePro Intelligence Hub
          </h1>
          <p className="text-sm text-gray-500 font-sans max-w-2xl mt-0.5">
            Real-time metrology, AMC/CAMC tracking, and warranty automation platform conforming to ISO-9001:2015 strict guidelines.
          </p>
        </div>

        {/* Compact statistics tracker in header */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 border border-gray-150 rounded-lg shadow-2xs font-mono text-xs">
          <div className="text-left pr-3 border-r border-gray-100">
            <span className="text-gray-400 text-[10px] block">ACTIVE FLEET:</span>
            <span className="font-bold text-gray-800">{operationalInstruments} / {totalInstruments} OP</span>
          </div>
          <div className="text-left pr-3 border-r border-gray-100">
            <span className="text-gray-400 text-[10px] block">TICKET LOAD:</span>
            <span className="font-bold text-red-600">{activeTickets.length} ACTIVE</span>
          </div>
          <div className="text-left">
            <span className="text-gray-400 text-[10px] block">CALIBRATIONS:</span>
            <span className="font-bold text-cyan-600">{calibrations.length} SECURED</span>
          </div>
        </div>
      </div>

      {/* ENTERPRISE EXECUTIVE DASHBOARD CARDS (Jira / ServiceNow / Salesforce platform style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 sm:gap-5">
        {/* 1. Open Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-[#0054A6] transition-all relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0054A6]" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold font-mono uppercase tracking-wider text-slate-500">Open Jobs</span>
            <div className="p-2.5 rounded-xl bg-[#0054A6]/10 text-[#0054A6] group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black font-mono text-slate-900 tracking-tight">
              {tickets.filter(t => t.status !== 'CLOSED').length || activeTickets.length || 14}
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-1.5 flex items-center gap-1.5">
              <span className="text-[#0054A6] font-bold bg-[#0054A6]/10 px-1.5 py-0.5 rounded">Active Queue</span>
              <span className="text-slate-400">• SLA Monitored</span>
            </p>
          </div>
        </div>

        {/* 2. Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-[#22C55E] transition-all relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#22C55E]" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold font-mono uppercase tracking-wider text-slate-500">Revenue</span>
            <div className="p-2.5 rounded-xl bg-[#22C55E]/10 text-[#22C55E] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black font-mono text-slate-900 tracking-tight">
              LKR {((tickets.reduce((acc, t) => acc + (t.estimatedCost || 145000), 0) || 4850000) / 1000000).toFixed(2)}M
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-1.5 flex items-center gap-1.5">
              <span className="text-[#22C55E] font-bold bg-[#22C55E]/10 px-1.5 py-0.5 rounded">↑ 14.2%</span>
              <span className="text-slate-400">vs prior period</span>
            </p>
          </div>
        </div>

        {/* 3. Customer Satisfaction */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-[#00AEEF] transition-all relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#00AEEF]" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold font-mono uppercase tracking-wider text-slate-500">Customer Satisfaction</span>
            <div className="p-2.5 rounded-xl bg-[#00AEEF]/10 text-[#00AEEF] group-hover:scale-110 transition-transform">
              <Smile className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black font-mono text-[#0077C8] tracking-tight">
              {kpis.slaCompliance || 98.4}%
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-1.5 flex items-center gap-1.5">
              <span className="text-[#0077C8] font-bold bg-[#00AEEF]/15 px-1.5 py-0.5 rounded">★ 4.9 / 5.0</span>
              <span className="text-slate-400">CSAT Benchmark</span>
            </p>
          </div>
        </div>

        {/* 4. Pending Approvals */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-[#F59E0B] transition-all relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F59E0B]" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold font-mono uppercase tracking-wider text-slate-500">Pending Approvals</span>
            <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black font-mono text-slate-900 tracking-tight">
              {tickets.filter(t => t.status === 'RECEIVED' || t.status === 'PENDING_PARTS' || t.priority === 'CRITICAL').length || 4}
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-1.5 flex items-center gap-1.5">
              <span className="text-[#F59E0B] font-bold bg-[#F59E0B]/10 px-1.5 py-0.5 rounded">Action Due</span>
              <span className="text-slate-400">Sign-offs req.</span>
            </p>
          </div>
        </div>

        {/* 5. Warranty Due */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-[#DC2626] transition-all relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#DC2626]" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold font-mono uppercase tracking-wider text-slate-500">Warranty Due</span>
            <div className="p-2.5 rounded-xl bg-[#DC2626]/10 text-[#DC2626] group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black font-mono text-slate-900 tracking-tight">
              {instruments.filter(i => i.installationStatus === 'COMPLETED').length || 12}
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-1.5 flex items-center gap-1.5">
              <span className="text-[#DC2626] font-bold bg-[#DC2626]/10 px-1.5 py-0.5 rounded">Expiring &lt;30d</span>
              <span className="text-slate-400">AMC Renewal</span>
            </p>
          </div>
        </div>

        {/* 6. Calibration Due */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-[#0054A6] transition-all relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0054A6]" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold font-mono uppercase tracking-wider text-slate-500">Calibration Due</span>
            <div className="p-2.5 rounded-xl bg-[#0054A6]/10 text-[#0054A6] group-hover:scale-110 transition-transform">
              <Microscope className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black font-mono text-slate-900 tracking-tight">
              {calibrations.filter(c => c.status !== 'PASSED').length || calibrations.length || 8}
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-1.5 flex items-center gap-1.5">
              <span className="text-[#0054A6] font-bold bg-[#0054A6]/10 px-1.5 py-0.5 rounded">ISO 17025</span>
              <span className="text-slate-400">Metrology Due</span>
            </p>
          </div>
        </div>

        {/* 7. Sprint 5.1 Pending Installation Requests */}
        <div 
          onClick={() => onNavigate('installation_requests')}
          className="bg-amber-50/60 rounded-2xl border border-amber-300/80 p-5 shadow-sm hover:shadow-md hover:border-amber-500 transition-all relative overflow-hidden flex flex-col justify-between group cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold font-mono uppercase tracking-wider text-amber-800">Pending Install</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black font-mono text-amber-950 tracking-tight">
              {installationRequests ? installationRequests.filter(r => r.status === 'Pending Assignment' || r.status === 'Assigned' || r.status === 'Scheduled').length : 4}
            </h3>
            <p className="text-[11px] text-amber-700 font-sans mt-1.5 flex items-center gap-1">
              <span className="font-bold bg-amber-200/60 text-amber-900 px-1.5 py-0.5 rounded text-[9px] font-mono">Sprint 5.1</span>
              <span className="text-amber-800/80 text-[10px] truncate">Pending Signoff</span>
            </p>
          </div>
        </div>

        {/* 8. Sprint 5.2 Installation Assignment & SLA Engine */}
        <div 
          onClick={() => onNavigate('installation_assignment')}
          className="bg-indigo-950 rounded-2xl border border-indigo-700 p-5 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all relative overflow-hidden flex flex-col justify-between group cursor-pointer text-white"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold font-mono uppercase tracking-wider text-cyan-300">Dispatch Crew</span>
            <div className="p-2.5 rounded-xl bg-cyan-400/10 text-cyan-300 group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black font-mono text-white tracking-tight">
              {installationRequests ? installationRequests.length : 4}
            </h3>
            <p className="text-[11px] text-indigo-200 font-sans mt-1.5 flex items-center gap-1">
              <span className="font-bold bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 px-1.5 py-0.5 rounded text-[9px] font-mono">Sprint 5.2</span>
              <span className="text-indigo-300/80 text-[10px] truncate">SLA Tracker</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Role & Clearances Simulator Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-white p-5 rounded-2xl border border-indigo-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
              <span className="font-mono text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 uppercase leading-none">
                ISO-9001 RBAC Clearances Simulator
              </span>
            </div>
            <p className="text-xs text-indigo-200 font-sans">
              Dynamic visibility is configured for 16 specialized roles. Toggle workspaces below to preview customized dashboards:
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <div className="bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs border border-indigo-500/30 text-left shadow-inner">
              <span className="text-cyan-400/80 text-[9px] block uppercase font-mono tracking-wider">YOUR CURRENT AUTH:</span>
              <span className="text-white font-bold mt-0.5 block">{currentUser?.name || "M. N. Jayawardene"} <span className="text-indigo-300 font-normal">({currentUser?.role || "Workshop Manager"})</span></span>
            </div>
          </div>
        </div>

        {/* View Selection Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5 pt-4 border-t border-indigo-500/20 relative z-10">
          {Object.entries(VIEW_META).map(([key, meta]) => {
            const isActive = selectedView === key;
            return (
              <button
                key={key}
                id={`btn-view-${key}`}
                onClick={() => {
                  setSelectedView(key);
                  triggerGenericSimAlert('Workspace Switched', `Switched view mode to ${meta.badge} (${meta.title})`);
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#00AEEF] to-[#4F46E5] border-cyan-300 text-white font-bold shadow-lg shadow-indigo-500/25 scale-102 ring-2 ring-cyan-400/30' 
                    : 'bg-indigo-950/40 border-indigo-800/60 text-indigo-200 hover:bg-white/10 hover:border-indigo-400/50 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider block opacity-90">{meta.badge}</div>
                <div className="text-xs block mt-1 truncate">{key === 'manager' ? '🛠️ Workshop Admin' : 
                                               key === 'documentation' ? '📋 Asset Register' :
                                               key === 'engineer' ? '🌍 Area Assignment' :
                                               key === 'calibration' ? '🔬 Calibration Tech' :
                                               key === 'workshop' ? '🔧 Workshop Bench' : '🎓 Supervised Staff'}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Workspace Layout description */}
      <div className="bg-slate-50 border border-gray-200/60 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg border shadow-3xs text-gray-500 mt-0.5 font-bold">
            {selectedView === 'manager' && '🛠️'}
            {selectedView === 'documentation' && '📋'}
            {selectedView === 'engineer' && '🌍'}
            {selectedView === 'calibration' && '🔬'}
            {selectedView === 'workshop' && '🔧'}
            {selectedView === 'supervised' && '🎓'}
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 leading-none">
              Active Security Clearance: <span className={`${VIEW_META[selectedView].color}`}>{VIEW_META[selectedView].title}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-sans">{VIEW_META[selectedView].desc}</p>
          </div>
        </div>

        {/* Dynamic Warning Alert Ticker inside the dashboard layout */}
        <div className="bg-white px-3 py-2 rounded-lg border border-gray-150 text-left text-xs max-w-md w-full shrink-0 shadow-3xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="truncate text-[11px] font-mono text-gray-600">
            <span className="font-extrabold text-gray-800">COMPLIANCE WATCH:</span> {
              selectedView === 'manager' ? 'SLA Alert: GC1310-TH9981 requires immediate assignment.' :
              selectedView === 'documentation' ? 'Audit Warning: 2 warranty cards require immediate dates registration.' :
              selectedView === 'engineer' ? 'SLA Target Alert: Lanka Hospitals site visit due within 24 hours.' :
              selectedView === 'calibration' ? 'Recall Pending: Eppendorf multi-pipette certificate due next week.' :
              selectedView === 'workshop' ? 'Board Backlog: Nexera GC bench spare circuit-board pending warehouse clearance.' :
              'Trainee Log: Double-track verification is required for high-voltage checks.'
            }
          </div>
        </div>
      </div>

      {/* 4. Dynamic KPI Bento Grid - Tailored to selected view/role */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedView === 'manager' && (
          <>
            {/* KPI 1: MTTR */}
            <div id="kpi-manager-mttr" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Mean Time To Repair (MTTR)</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">{(kpis.mttrHours * metricMultiplier).toFixed(1)} hrs</h3>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 max-w-max mt-2">
                  <span>↓ 1.2 hrs</span>
                  <span className="text-gray-400 font-normal">vs last month</span>
                </span>
              </div>
              <div className="p-2 bg-blue-50 text-[#0054A6] rounded-lg shadow-4xs">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 2: SLA Target Compliance */}
            <div id="kpi-manager-sla" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">SLA Target Compliance</p>
                <h3 className="text-2xl font-black font-mono text-[#0054A6]">{kpis.slaCompliance}%</h3>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 max-w-max mt-2">
                  <span>↑ 0.8%</span>
                  <span className="text-gray-400 font-normal">Target: 95.0% Min</span>
                </span>
              </div>
              <div className="p-2 bg-emerald-50 text-[#22C55E] rounded-lg shadow-4xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 3: MTBF */}
            <div id="kpi-manager-mtbf" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Mean Time Between Failures</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">{kpis.mtbfDays} Days</h3>
                <span className="text-[10px] text-amber-605 font-bold bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 max-w-max mt-2">
                  <span>↓ 4 Days</span>
                  <span className="text-gray-400 font-normal">Voltage instability</span>
                </span>
              </div>
              <div className="p-2 bg-amber-50 text-amber-500 rounded-lg shadow-4xs">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 4: Staff Utilization */}
            <div id="kpi-manager-utilization" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Engineer Utilization Rate</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">{kpis.engineerUtilization}%</h3>
                <span className="text-[10px] text-[#00AEEF] font-bold bg-sky-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 max-w-max mt-2">
                  <span>Optimal peak</span>
                  <span className="text-gray-400 font-normal">ISO compliant</span>
                </span>
              </div>
              <div className="p-2 bg-sky-50 text-[#00AEEF] rounded-lg shadow-4xs">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </>
        )}

        {selectedView === 'documentation' && (
          <>
            {/* KPI 1: Total Assets */}
            <div id="kpi-doc-assets" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Registered Lab Assets</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">{totalInstruments} Units</h3>
                <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-1.5 py-0.5 rounded flex items-center mt-2 w-max">
                  <span>Shimadzu/Thermo priority</span>
                </span>
              </div>
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg shadow-4xs">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 2: Installations Backlog */}
            <div id="kpi-doc-installations" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Pending Installation Sign-off</p>
                <h3 className="text-2xl font-black font-mono text-purple-750">
                  {instruments.filter(i => i.installationStatus !== 'COMPLETED').length} Units
                </h3>
                <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded flex items-center mt-2 w-max animate-pulse">
                  <span>Action: Verify Boxings</span>
                </span>
              </div>
              <div className="p-2 bg-purple-100 text-purple-650 rounded-lg shadow-4xs">
                <ClipboardCheck className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 3: Warranty Cards active */}
            <div id="kpi-doc-warranties" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Active Warranties</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">
                  {instruments.filter(i => i.amcType !== 'NONE' || new Date(i.warrantyExpiry) > new Date()).length} Units
                </h3>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center mt-2 w-max">
                  <span>Clean coverage</span>
                </span>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shadow-4xs">
                <Award className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 4: Compliance Certificates logged */}
            <div id="kpi-doc-calibration-records" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Logged Metrology Records</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">{calibrations.length} Certs</h3>
                <span className="text-[10px] text-[#00AEEF] font-bold bg-sky-50 px-1.5 py-0.5 rounded flex items-center mt-2 w-max">
                  <span>ISO Audit Verified</span>
                </span>
              </div>
              <div className="p-2 bg-sky-50 text-blue-600 rounded-lg shadow-4xs">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </>
        )}

        {selectedView === 'engineer' && (
          <>
            {/* KPI 1: Assigned Lab accounts */}
            <div id="kpi-eng-labs" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">My Target Customer Labs</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">4 Core Centers</h3>
                <p className="text-[10px] text-gray-400 leading-none mt-2 font-mono">Lanka Hospitals, MRI, SPMC</p>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shadow-4xs">
                <MapPin className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 2: Appointed active work tickets */}
            <div id="kpi-eng-tickets" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Assigned active tickets</p>
                <h3 className="text-2xl font-black font-mono text-emerald-700">
                  {tickets.filter(t => t.assignedEngineerName?.includes('Suresh') && t.status !== 'CLOSED').length || 2} Tickets
                </h3>
                <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2">
                  1 Critical Field Visit
                </span>
              </div>
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shadow-4xs">
                <Clipboard className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 3: SLA deadline alarm */}
            <div id="kpi-eng-sla-deadline" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">SLA Deadline Risk</p>
                <h3 className="text-2xl font-black font-mono text-red-650">24 hr Limit</h3>
                <span className="text-[10px] text-amber-705 bg-amber-50 px-1.5 py-0.5 rounded font-sans inline-block mt-2">
                  Due: HPLC chromatograph
                </span>
              </div>
              <div className="p-2 bg-red-50 text-red-600 rounded-lg shadow-4xs animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 4: Territory Performance */}
            <div id="kpi-eng-territory" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Territory SLA Rank</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">98.2% Done</h3>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2">
                  Province 1 Division
                </span>
              </div>
              <div className="p-2 bg-sky-50 text-sky-600 rounded-lg shadow-4xs">
                <Compass className="w-5 h-5" />
              </div>
            </div>
          </>
        )}

        {selectedView === 'calibration' && (
          <>
            {/* KPI 1: Passed Certificates Rate */}
            <div id="kpi-cal-passed" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Calibration Pass Ratio</p>
                <h3 className="text-2xl font-black font-mono text-emerald-800">
                  {((calibrations.filter(c => c.status === 'PASSED').length / calibrations.length) * 100).toFixed(1)}% Passed
                </h3>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2">
                  {calibrations.filter(c => c.status === 'PASSED').length} of {calibrations.length} records Passed
                </span>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shadow-4xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 2: Max recorded error tolerance drift */}
            <div id="kpi-cal-drift" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Mean reported margin error</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">
                  {(calibrations.reduce((acc, current) => acc + current.reportedError, 0) / calibrations.length).toFixed(3)}% Drift
                </h3>
                <span className="text-[10px] text-[#0054A6] bg-blue-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2">
                  Limit Allowable: 0.50%
                </span>
              </div>
              <div className="p-2 bg-blue-50 text-[#0054A6] rounded-lg shadow-4xs">
                <Gauge className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 3: Standard verification reference trace */}
            <div id="kpi-cal-standards" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Standard Verified Trace</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">NIST Standard</h3>
                <span className="text-[10px] text-violet-600 bg-violet-55/10 px-1.5 py-0.5 rounded font-bold inline-block mt-2">
                  Class A weights, thermal probes
                </span>
              </div>
              <div className="p-2 bg-violet-50 text-violet-600 rounded-lg shadow-4xs">
                <Award className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 4: Environmental indicators */}
            <div id="kpi-cal-environment" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Environmental Sensors (HQ)</p>
                <h3 className="text-2xl font-black font-mono text-[#00AEEF]">22.4°C | 52%</h3>
                <div className="flex gap-2.5 mt-2 text-[10px] text-emerald-650 font-bold bg-emerald-50/70 px-1.5 py-0.5 rounded w-max">
                  <span className="flex items-center gap-0.5"><Thermometer className="w-3 h-3 text-emerald-600" /> STABLE</span>
                  <span className="flex items-center gap-0.5"><Droplets className="w-3 h-3 text-emerald-600" /> STABLE</span>
                </div>
              </div>
              <div className="p-2 bg-sky-50 text-cyan-500 rounded-lg shadow-4xs">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </>
        )}

        {selectedView === 'workshop' && (
          <>
            {/* KPI 1: Active bench repair orders */}
            <div id="kpi-workshop-repairs" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Active Workshop Bench Repairs</p>
                <h3 className="text-2xl font-black font-mono text-amber-700">
                  {tickets.filter(t => t.status === 'REPAIRING' || t.status === 'DIAGNOSING').length || 3} Units
                </h3>
                <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2 font-mono">
                  Bench 2 & 4 Allocated
                </span>
              </div>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shadow-4xs">
                <Wrench className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 2: Mean diagnostic turnaround */}
            <div id="kpi-workshop-turnaround" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Mean Diagnostic Turnaround</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">4.2 hrs</h3>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2">
                  Target: &lt; 5.0 hrs
                </span>
              </div>
              <div className="p-2 bg-blue-50 text-blue-550 rounded-lg shadow-4xs">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 3: Parts catalog status */}
            <div id="kpi-workshop-parts" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Spare Parts Backlog</p>
                <h3 className="text-2xl font-black font-mono text-orange-600">
                  {tickets.filter(t => t.status === 'PENDING_PARTS').length} Lines
                </h3>
                <span className="text-[10px] text-orange-605 bg-orange-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2">
                  1 laser module transit LK
                </span>
              </div>
              <div className="p-2 bg-orange-50 text-orange-500 rounded-lg shadow-4xs">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 4: Electrical Safety Leakage passes */}
            <div id="kpi-workshop-safety" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Electrical Leakage Checks</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">100% Passed</h3>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2">
                  ISO-61010 Compliant
                </span>
              </div>
              <div className="p-2 bg-emerald-50 text-[#22C55E] rounded-lg shadow-4xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </>
        )}

        {selectedView === 'supervised' && (
          <>
            {/* KPI 1: Training Hours Completed */}
            <div id="kpi-supervised-hours" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">My Training Onboarding</p>
                <h3 className="text-2xl font-black font-mono text-gray-850">128 / 150 hrs</h3>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2">
                  85% syllabus completed
                </span>
              </div>
              <div className="p-2 bg-indigo-50 text-indigo-650 rounded-lg shadow-4xs">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 2: Checklist entries filled */}
            <div id="kpi-supervised-checklists" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Supervised Checksheets Filled</p>
                <h3 className="text-2xl font-black font-mono text-gray-800">14 Forms</h3>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2 font-mono">
                  Reviewed by Lead Engineer
                </span>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shadow-4xs">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 3: Double check delegation pending */}
            <div id="kpi-supervised-delegations" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Awaiting Senior Counter-Sign</p>
                <h3 className="text-2xl font-black font-mono text-amber-600">3 Tickets</h3>
                <span className="text-[10px] text-amber-705 bg-amber-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2">
                  Requires shadow review
                </span>
              </div>
              <div className="p-2 bg-amber-50 text-amber-500 rounded-lg shadow-4xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            {/* KPI 4: Safety protocols conformity */}
            <div id="kpi-supervised-conformity" className="bg-white p-5 rounded-xl border border-gray-150 shadow-3xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Safety Conformity Score</p>
                <h3 className="text-2xl font-black font-mono text-[#0054A6]">100% Score</h3>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block mt-2">
                  No electrical incidents
                </span>
              </div>
              <div className="p-2 bg-sky-50 text-[#0054A6] rounded-lg shadow-4xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 5. Dynamic Interactive Charts & Visual Data Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Chart Box - 8 Columns */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-150 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1">
              <div>
                <h3 id="chart-section-title" className="text-sm font-extrabold text-gray-800">
                  {selectedView === 'manager' && '📈 Divisional Support Ticket Volume Progression'}
                  {selectedView === 'documentation' && '📊 Asset Brand Allocation & Inventory Distribution'}
                  {selectedView === 'engineer' && '🗺️ Regional Territory SLA Target Compliance Ratings'}
                  {selectedView === 'calibration' && '🔬 Metrology Drift Error Tolerance Distribution'}
                  {selectedView === 'workshop' && '🛠️ Heavy machinery failures classification breakdown'}
                  {selectedView === 'supervised' && '🎓 Internal Skill Competency Milestones matrix'}
                </h3>
                <p className="text-xs text-gray-400 font-sans mt-0.5">
                  {selectedView === 'manager' && 'Monthly volume of registered repairs across all 4 hospital labs.'}
                  {selectedView === 'documentation' && 'Visual breakdown of current fleet assets in the Colombo Hub register.'}
                  {selectedView === 'engineer' && 'Current SLA success rates monitored by regional province zones.'}
                  {selectedView === 'calibration' && 'Recorded sensor error deviations relative to allowable guidelines (0.50%).'}
                  {selectedView === 'workshop' && 'Failure categories identified inside offline benches diagnostics.'}
                  {selectedView === 'supervised' && 'Personal competency training progression metrics certified by supervisors.'}
                </p>
              </div>
              
              <span className="text-[10px] font-mono text-[#0054A6] bg-blue-50 border border-blue-150 rounded px-2 py-0.5 tracking-wide shrink-0">
                {selectedView === 'manager' ? 'PAST 6 MONTHS' : 
                 selectedView === 'documentation' ? 'BRAND RECOGNITION' :
                 selectedView === 'engineer' ? 'REGIONAL SLA' :
                 selectedView === 'calibration' ? 'ACCURACY MARGIN' :
                 selectedView === 'workshop' ? 'FAULT MODES' : 'ACADEMIC MATRIX'}
              </span>
            </div>
          </div>

          {/* Render Customized Creative Interactive Charts using pure CSS and responsive SVG grids */}
          <div className="mt-6 flex-1 flex flex-col justify-center min-h-[180px]">
            {selectedView === 'manager' && (
              <div className="relative w-full flex flex-col justify-end">
                {/* SVG Area Chart */}
                <svg viewBox="0 0 500 130" className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0054A6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0054A6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="65" x2="500" y2="65" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="0" y1="130" x2="500" y2="130" stroke="#E2E8F0" />
                  {/* Area */}
                  <polygon points="0,130 100,90 200,98 300,50 400,68 500,30 500,130" fill="url(#area-grad)" />
                  {/* Line */}
                  <polyline points="0,130 100,90 200,98 300,50 400,68 500,30" fill="none" stroke="#0054A6" strokeWidth="2.5" />
                  {/* Dots with numeric tags */}
                  <circle cx="100" cy="90" r="4.5" fill="#FFFFFF" stroke="#00AEEF" strokeWidth="2" />
                  <circle cx="200" cy="98" r="4.5" fill="#FFFFFF" stroke="#00AEEF" strokeWidth="2" />
                  <circle cx="300" cy="50" r="4.5" fill="#FFFFFF" stroke="#00AEEF" strokeWidth="2" />
                  <circle cx="400" cy="68" r="4.5" fill="#FFFFFF" stroke="#00AEEF" strokeWidth="2" />
                  <circle cx="500" cy="30" r="4.5" fill="#FFFFFF" stroke="#00AEEF" strokeWidth="2" />
                  
                  <text x="100" y="75" textAnchor="middle" className="text-[10px] font-mono font-bold fill-gray-700">15</text>
                  <text x="200" y="85" textAnchor="middle" className="text-[10px] font-mono font-bold fill-gray-700">18</text>
                  <text x="300" y="35" textAnchor="middle" className="text-[10px] font-mono font-bold fill-gray-700">30</text>
                  <text x="400" y="55" textAnchor="middle" className="text-[10px] font-mono font-bold fill-gray-700">25</text>
                  <text x="500" y="15" textAnchor="middle" className="text-[10px] font-mono font-bold fill-[#0054A6]">{activeTickets.length + 8}</text>
                </svg>

                {/* X labels */}
                <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-2.5 pt-1 border-t border-gray-50 uppercase">
                  <span className="w-full text-center">JAN</span>
                  <span className="w-full text-center">FEB</span>
                  <span className="w-full text-center">MAR</span>
                  <span className="w-full text-center">APR</span>
                  <span className="w-full text-center">MAY</span>
                  <span className="w-full text-center">JUN (ACTIVE)</span>
                </div>
              </div>
            )}

            {selectedView === 'documentation' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {/* Visual bar allocations representing brand inventory */}
                <div className="p-3 bg-slate-50 border border-gray-150 rounded-lg text-left space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-mono font-extrabold text-[#0054A6]">SHIMADZU</span>
                    <span className="text-xs font-bold font-mono text-gray-800">45%</span>
                  </div>
                  <div className="w-full bg-gray-250 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0054A6] h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                  <span className="text-[9px] text-gray-400 font-mono block">3 chromatographs, 1 LC-MS</span>
                </div>

                <div className="p-3 bg-slate-50 border border-gray-150 rounded-lg text-left space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-mono font-extrabold text-emerald-700">THERMO</span>
                    <span className="text-xs font-bold font-mono text-gray-800">25%</span>
                  </div>
                  <div className="w-full bg-gray-250 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-650 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                  <span className="text-[9px] text-gray-400 font-mono block">1 Gas Chromatograph FID</span>
                </div>

                <div className="p-3 bg-slate-50 border border-gray-150 rounded-lg text-left space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-mono font-extrabold text-amber-750">AGILENT</span>
                    <span className="text-xs font-bold font-mono text-gray-800">20%</span>
                  </div>
                  <div className="w-full bg-gray-250 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-605 h-full rounded-full" style={{ width: '20%' }} />
                  </div>
                  <span className="text-[9px] text-gray-400 font-mono block">1 UV-Vis Cary spectrophotometer</span>
                </div>

                <div className="p-3 bg-slate-50 border border-gray-150 rounded-lg text-left space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-mono font-extrabold text-indigo-705">EPPENDORF</span>
                    <span className="text-xs font-bold font-mono text-gray-800">10%</span>
                  </div>
                  <div className="w-full bg-gray-250 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '10%' }} />
                  </div>
                  <span className="text-[9px] text-gray-400 font-mono block">1 PCR Nexus thermocycler</span>
                </div>
              </div>
            )}

            {selectedView === 'engineer' && (
              <div className="space-y-4 w-full">
                {/* Horizontal list representation of territory SLA results */}
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1 text-left">
                      <span className="font-bold text-gray-700">Western Province Zone (Colombo Central District)</span>
                      <span className="text-[#0054A6] font-bold">99.1% Compliance</span>
                    </div>
                    <div className="w-full bg-gray-250 h-3 rounded-full overflow-hidden">
                      <div className="bg-[#0054A6] h-full" style={{ width: '99.1%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1 text-left">
                      <span className="font-bold text-gray-700">Central Province Zone (Kandy Hub)</span>
                      <span className="text-[#00AEEF] font-bold">96.5% Compliance</span>
                    </div>
                    <div className="w-full bg-gray-250 h-3 rounded-full overflow-hidden">
                      <div className="bg-[#00AEEF] h-full" style={{ width: '96.5%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1 text-left">
                      <span className="font-bold text-gray-700">Southern Province Zone (Galle District)</span>
                      <span className="text-emerald-700 font-bold">92.0% Compliance</span>
                    </div>
                    <div className="w-full bg-gray-250 h-3 rounded-full overflow-hidden">
                      <div className="bg-[#22C55E] h-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedView === 'calibration' && (
              <div className="space-y-4 w-full text-left">
                {/* Scatter plot representation of Calibration Cert errors using pure SVG */}
                <div className="p-3 bg-slate-50 border rounded-xl relative">
                  <span className="text-[10px] font-mono text-gray-400 absolute top-2 right-2">DRIFT DISTRIBUTION VS SPEC LIMIT</span>
                  <svg viewBox="0 0 500 110" className="w-full h-auto overflow-visible">
                    {/* Spec limit line at 0.50% reported error */}
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="495" y="32" textAnchor="end" className="text-[9px] font-mono font-extrabold fill-red-650">0.50% ALLOWED CRITICAL CEILING</text>
                    
                    {/* Ambient axis lines */}
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#CBD5E1" />
                    
                    {/* Scatter dots representing calibrations */}
                    {/* Cert 1 */}
                    <circle cx="50" cy="85" r="5" fill="#22C55E" opacity="0.8" />
                    <text x="50" y="75" textAnchor="middle" className="text-[8px] font-mono fill-gray-500">LC2030 (0.12%)</text>
                    
                    {/* Cert 2 */}
                    <circle cx="150" cy="60" r="5" fill="#22C55E" opacity="0.8" />
                    <text x="150" y="50" textAnchor="middle" className="text-[8px] font-mono fill-gray-500">GC1310 (0.31%)</text>

                    {/* Cert 3 */}
                    <circle cx="300" cy="90" r="5" fill="#22C55E" opacity="0.8" />
                    <text x="300" y="80" textAnchor="middle" className="text-[8px] font-mono fill-gray-500">Agilent UV (0.08%)</text>

                    {/* Cert 4 */}
                    <circle cx="420" cy="35" r="5.5" fill="#EF4444" opacity="0.9" />
                    <text x="420" y="25" textAnchor="middle" className="text-[8px] font-mono fill-red-650 font-bold">DRIFT ALERT (0.55%)</text>
                  </svg>
                </div>
              </div>
            )}

            {selectedView === 'workshop' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {/* failure categorization */}
                <div className="p-3 bg-red-50/50 border border-red-150 rounded-lg text-left">
                  <span className="text-[9px] font-mono text-red-700 font-extrabold uppercase">1. Electronic Boards</span>
                  <h4 className="text-2xl font-black font-mono text-red-8D0 mt-1">45%</h4>
                  <p className="text-[10px] text-gray-505 font-sans">Capacitor blowouts & fuses replacements</p>
                </div>

                <div className="p-3 bg-blue-50/50 border border-blue-150 rounded-lg text-left">
                  <span className="text-[9px] font-mono text-[#0054A6] font-extrabold uppercase">2. Fluidics / Lines</span>
                  <h4 className="text-2xl font-black font-mono text-gray-800 mt-1">30%</h4>
                  <p className="text-[10px] text-gray-505 font-sans">Liquid chromatography column leaks & pump seals</p>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-150 rounded-lg text-left">
                  <span className="text-[9px] font-mono text-amber-700 font-extrabold uppercase">3. Optical Cells</span>
                  <h4 className="text-2xl font-black font-mono text-gray-800 mt-1">15%</h4>
                  <p className="text-[10px] text-gray-505 font-sans">Deuterium lamp recalibration & optics alignment</p>
                </div>

                <div className="p-3 bg-slate-50 border border-gray-150 rounded-lg text-left">
                  <span className="text-[9px] font-mono text-slate-700 font-extrabold uppercase">4. Mechanics / Gears</span>
                  <h4 className="text-2xl font-black font-mono text-gray-800 mt-1">10%</h4>
                  <p className="text-[10px] text-gray-505 font-sans">Vibration pads replacement & rotor alignment</p>
                </div>
              </div>
            )}

            {selectedView === 'supervised' && (
              <div className="space-y-3.5 w-full text-left">
                {/* progression bars for trainees */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>HPLC Liquid Chromatography Unboxing Checklist SOP</span>
                    <span className="font-bold text-gray-700">95% Completed</span>
                  </div>
                  <div className="w-full bg-gray-105 h-2 rounded">
                    <div className="bg-indigo-650 h-full rounded" style={{ width: '95%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>NIST Weights & Balances Physical Calibration Traceability</span>
                    <span className="font-bold text-gray-700">70% Completed</span>
                  </div>
                  <div className="w-full bg-gray-105 h-2 rounded">
                    <div className="bg-[#00AEEF] h-full rounded" style={{ width: '70%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>High Voltage Cabinet Insulation & Iso-leakage Drills</span>
                    <span className="font-bold text-gray-700">50% Completed</span>
                  </div>
                  <div className="w-full bg-gray-105 h-2 rounded">
                    <div className="bg-purple-605 h-full rounded" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Environmental alerts verification code line in bottom of chart block */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-gray-400 gap-2">
            <span className="font-mono uppercase tracking-widest text-[10px]">
              ISO STATUS VERIFIED: <span className="text-[#22C55E] font-bold">● ONLINE SECTOR CONNECTED</span>
            </span>
            <span className="font-sans italic">
              Powered by AVON PHARMO CHEM Laboratory Intelligence Core 2.0
            </span>
          </div>
        </div>

        {/* Tailored Alerts & Actions Control Box - 4 Columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Action Box: Direct Operations Trigger */}
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs text-left space-y-4 flex-1">
            <div>
              <h3 className="text-xs font-black text-[#0054A6] uppercase font-mono tracking-widest">
                Operations Workbench
              </h3>
              <h4 className="text-base font-extrabold text-gray-800 tracking-tight mt-0.5">
                Quick Action Core
              </h4>
            </div>

            {/* Render dynamic division actions based on the current sector */}
            <div className="space-y-2.5">
              {selectedView === 'manager' && (
                <>
                  <button 
                    onClick={() => {
                      setActiveQuickDialog('dispatch');
                      triggerGenericSimAlert('Dispatch Dialog', 'Manager opened Dispatch panel for scheduling.');
                    }}
                    className="w-full p-3 bg-[#F5F8FC] hover:bg-blue-100 border border-blue-150 text-left rounded-lg text-xs font-bold text-[#0054A6] flex items-center justify-between cursor-pointer"
                  >
                    <span>👥 Dispatch Lead Field Engineer</span>
                    <ChevronRight className="w-4 h-4 text-[#0054A6] shrink-0" />
                  </button>

                  <button 
                    onClick={() => {
                      setActiveQuickDialog('billing');
                      triggerGenericSimAlert('Budget Clearance', 'Manager opened billing approval sheet.');
                    }}
                    className="w-full p-3 bg-[#F5F8FC] hover:bg-blue-100 border border-blue-150 text-left rounded-lg text-xs font-bold text-[#0054A6] flex items-center justify-between cursor-pointer"
                  >
                    <span>💵 Approve Estimated Budgets</span>
                    <ChevronRight className="w-4 h-4 text-[#0054A6] shrink-0" />
                  </button>

                  <button 
                    onClick={() => {
                      setMetricMultiplier(prev => prev === 1.0 ? 1.15 : 1.0);
                      triggerGenericSimAlert('KPI Simulated Drift', 'Toggled peak SLA calculation adjustments.');
                    }}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 border text-left rounded-lg text-xs font-bold text-gray-750 flex items-center justify-between cursor-pointer"
                  >
                    <span>⚡ Sim Peak SLA Load Shift</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </>
              )}

              {selectedView === 'documentation' && (
                <>
                  <button 
                    onClick={() => onNavigate('instruments')}
                    className="w-full p-3 bg-purple-50/50 hover:bg-purple-50 border border-purple-150 text-left rounded-lg text-xs font-bold text-purple-750 flex items-center justify-between cursor-pointer"
                  >
                    <span>🔬 Register HPLC/GC Asset</span>
                    <ChevronRight className="w-4 h-4 text-purple-700 shrink-0" />
                  </button>

                  <button 
                    onClick={() => onNavigate('installation')}
                    className="w-full p-3 bg-purple-50/50 hover:bg-purple-50 border border-purple-150 text-left rounded-lg text-xs font-bold text-purple-750 flex items-center justify-between cursor-pointer"
                  >
                    <span>📋 Commission Field Installation</span>
                    <ChevronRight className="w-4 h-4 text-purple-700 shrink-0" />
                  </button>

                  <button 
                    onClick={() => onNavigate('calibration')}
                    className="w-full p-3 bg-purple-50/50 hover:bg-purple-50 border border-purple-150 text-left rounded-lg text-xs font-bold text-purple-750 flex items-center justify-between cursor-pointer"
                  >
                    <span>Validate Metrology Certification</span>
                    <ChevronRight className="w-4 h-4 text-purple-705 shrink-0" />
                  </button>
                </>
              )}

              {selectedView === 'engineer' && (
                <>
                  <button 
                    onClick={() => onNavigate('installation')}
                    className="w-full p-3 bg-emerald-58/10 hover:bg-emerald-50 border border-emerald-150 text-left rounded-lg text-xs font-bold text-emerald-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>📋 Open Unboxing Checksheets</span>
                    <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0" />
                  </button>

                  <button 
                    onClick={() => onNavigate('service')}
                    className="w-full p-3 bg-emerald-58/10 hover:bg-emerald-50 border border-emerald-150 text-left rounded-lg text-xs font-bold text-emerald-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>🔧 Diagnose Dispatched Faults</span>
                    <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0" />
                  </button>

                  <button 
                    onClick={() => {
                      triggerGenericSimAlert('SLA Request', 'Requested temporary SLA extension due to shipping delayed parts.');
                    }}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 border text-left rounded-lg text-xs font-bold text-gray-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>⚠️ Request SLA Buffer Extension</span>
                    <ChevronRight className="w-4 h-4 shrink-0 font-sans text-gray-500" />
                  </button>
                </>
              )}

              {selectedView === 'calibration' && (
                <>
                  <button 
                    onClick={() => onNavigate('calibration')}
                    className="w-full p-3 bg-sky-50/60 hover:bg-sky-50 border border-[#00AEEF]/20 text-left rounded-lg text-xs font-bold text-cyan-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>📜 Issue ISO Calibration Report</span>
                    <ChevronRight className="w-4 h-4 text-cyan-600 shrink-0" />
                  </button>

                  <button 
                    onClick={() => {
                      triggerGenericSimAlert('NIST Verified', 'Reference weights verified against standard calibrator.');
                    }}
                    className="w-full p-3 bg-sky-50/60 hover:bg-sky-50 border border-[#00AEEF]/20 text-left rounded-lg text-xs font-bold text-cyan-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>⚖️ Self-Log Traceable Standards</span>
                    <ChevronRight className="w-4 h-4 text-cyan-600 shrink-0" />
                  </button>

                  <button 
                    onClick={() => {
                      triggerGenericSimAlert('Sensors Checked', 'Stable climate readings cached successfully: 22.4°C | 52%');
                    }}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 border text-left rounded-lg text-xs font-bold text-gray-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>🌡️ Read Room Humid / Temp Sensors</span>
                    <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
                  </button>
                </>
              )}

              {selectedView === 'workshop' && (
                <>
                  <button 
                    onClick={() => {
                      setActiveQuickDialog('schematics');
                      triggerGenericSimAlert('Wiring Manual', 'Loaded Shimadzu pump layout diagram.');
                    }}
                    className="w-full p-3 bg-amber-50/30 hover:bg-amber-50 border border-amber-150 text-left rounded-lg text-xs font-bold text-amber-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>📂 Load Pump Fluidics Schematics</span>
                    <ChevronRight className="w-4 h-4 text-amber-700 shrink-0" />
                  </button>

                  <button 
                    onClick={() => {
                      triggerGenericSimAlert('Parts Pool', 'Queried central store for laser modules.');
                    }}
                    className="w-full p-3 bg-amber-50/30 hover:bg-amber-50 border border-amber-150 text-left rounded-lg text-xs font-bold text-amber-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>📦 Query Local Warehouse Spare Parts</span>
                    <ChevronRight className="w-4 h-4 text-amber-700 shrink-0" />
                  </button>

                  <button 
                    onClick={() => {
                      triggerGenericSimAlert('IsoCheck', 'No electrical leakage detected. Impedance limits acceptable.');
                    }}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 border text-left rounded-lg text-xs font-bold text-gray-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>⚡ Run Impedance & Leakage Self-Check</span>
                    <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
                  </button>
                </>
              )}

              {selectedView === 'supervised' && (
                <>
                  <button 
                    onClick={() => {
                      triggerGenericSimAlert('Delegated', 'Checklist submitted to Senior Biomedical Engineer Suresh.');
                    }}
                    className="w-full p-3 bg-slate-100 hover:bg-slate-200 border text-left rounded-lg text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>🙋 Request Senior Sign Review</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button 
                    onClick={() => {
                      setActiveQuickDialog('manual');
                      triggerGenericSimAlert('Manual Opened', 'Opened ISO safety directives.');
                    }}
                    className="w-full p-3 bg-slate-100 hover:bg-slate-200 border text-left rounded-lg text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>📕 Read ISO Standard Safety Manual</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button 
                    onClick={() => {
                      triggerGenericSimAlert('Log hours', 'Logged 2 training hours in Metrology.');
                    }}
                    className="w-full p-3 bg-slate-100 hover:bg-slate-200 border text-left rounded-lg text-xs font-bold text-gray-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>⏱️ Self-Log Training Logbook Hours</span>
                    <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Interactive alert simulation log list */}
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs text-left space-y-3.5">
            <h3 className="text-xs font-black text-rose-700 uppercase font-mono tracking-widest block leading-none">
              In-Desk Activity Ticker
            </h3>
            
            <div className="space-y-2 max-h-[145px] overflow-y-auto pr-1">
              {alertSimulationLogs.map((log, idx) => (
                <div key={idx} className="p-2 bg-rose-50/40 rounded border border-rose-100 font-mono text-[10px] text-gray-600 leading-normal">
                  {log}
                </div>
              ))}

              {alertSimulationLogs.length === 0 && (
                <div className="p-6 text-center text-gray-400 font-mono text-[10px]">
                  Activities will log here upon simulator events triggers.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 6. Active Modals Dialogs Simulation Drawer */}
      {activeQuickDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-150 p-6 max-w-md w-full shadow-2xl text-left space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-[#0054A6] uppercase font-bold tracking-widest block">OPERATORS TOOLBOX</span>
                <h3 className="text-base font-black text-gray-900 mt-1">
                  {activeQuickDialog === 'dispatch' && 'Schedule Engineer Dispatch'}
                  {activeQuickDialog === 'billing' && 'Estimate Budget Clearances'}
                  {activeQuickDialog === 'schematics' && 'Chromatography Pump Schematics'}
                  {activeQuickDialog === 'manual' && 'ISO-9001 Safety Manual SOP'}
                </h3>
              </div>
              <button 
                onClick={() => setActiveQuickDialog(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded bg-gray-50 border focus:outline-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-gray-600 leading-relaxed font-sans mt-2">
              {activeQuickDialog === 'dispatch' && (
                <div className="space-y-3">
                  <p>Choose an available Biomedical / Metrology specialist to allocate for pending ticket orders:</p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        triggerGenericSimAlert('Dispatched Successfully', 'Eng. Suresh assigned to GC-1310 repair ticket.');
                        setActiveQuickDialog(null);
                      }}
                      className="w-full p-2.5 bg-slate-50 border rounded text-left hover:bg-blue-50 font-semibold text-gray-800"
                    >
                      Eng. Suresh Perera (Senior Biomedical Engineer - Area tag)
                    </button>
                    <button 
                      onClick={() => {
                        triggerGenericSimAlert('Dispatched Successfully', 'Eng. Nimani assigned to HPLC Metrology calibration.');
                        setActiveQuickDialog(null);
                      }}
                      className="w-full p-2.5 bg-slate-50 border rounded text-left hover:bg-blue-50 font-semibold text-gray-800"
                    >
                      Eng. Nimani Senanayake (Calibration Engineer)
                    </button>
                  </div>
                </div>
              )}

              {activeQuickDialog === 'billing' && (
                <div className="space-y-3">
                  <p>Audit and authorize estimated spare parts budget for MRI PCR Nexus thermocycler:</p>
                  <div className="p-3 bg-[#F2F7FC] rounded border text-slate-800 font-mono space-y-1">
                    <div>Parts Quote: LKR 145,200.00</div>
                    <div>Import Freight: LKR 48,000.00</div>
                    <div className="font-bold border-t pt-1 mt-1 text-[#0054A6]">Total Budget: LKR 193,200.00</div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        triggerGenericSimAlert('Budget Cleared', 'Approved LKR 193,200 estimate expenditure.');
                        setActiveQuickDialog(null);
                      }}
                      className="flex-1 p-2 bg-[#0054A6] text-white font-bold rounded"
                    >
                      Authorize Budget
                    </button>
                    <button 
                      onClick={() => setActiveQuickDialog(null)}
                      className="flex-1 p-2 bg-slate-100 border text-gray-700 font-semibold rounded"
                    >
                      Cancel review
                    </button>
                  </div>
                </div>
              )}

              {activeQuickDialog === 'schematics' && (
                <div className="space-y-3 font-mono text-[11px]">
                  <p>Circuit fluid pathways guidelines diagram representation (Shimadzu models):</p>
                  <div className="p-3 bg-slate-900 text-emerald-400 rounded-lg space-y-2 leading-tight">
                    <div>[MOBILE RESIDENCE] PHASE A INLET -&gt; [RESERVOIR DEGASSER]</div>
                    <div>[DEGASSED FLOW] -&gt; [HIGH-PRESSURE DUAL PLUNGER PUMPS]</div>
                    <div>[GRADIENT MIXER] -&gt; [INJECTOR COIL 20uL] -&gt; [COLUMN HEAD]</div>
                    <div>[PRESSURE LIMIT STABLE: 45.3 MPa SYSTEM MAXIMUM]</div>
                  </div>
                  <p className="text-[10px] text-gray-400">Align column joints carefully. Use 10-32 PEEK fittings.</p>
                </div>
              )}

              {activeQuickDialog === 'manual' && (
                <div className="space-y-2">
                  <p className="font-bold">SOP-HW-054 SAFETY CABINET FIRST PROTOCOL:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Disconnect master mains switch breaker before chassis release.</li>
                    <li>Always attach grounding resistance probe loop onto the main metal plate.</li>
                    <li>Verify peak resistance rating is under 0.1 Ohms prior to powering optics lamp.</li>
                    <li>Wear anti-UV safety goggles during deuterium lamp initial start verification checks.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Context-Filtered Service Orders Worklist-Table */}
      <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-black text-gray-800">
              {selectedView === 'manager' && '📜 Active Division Tickets & Orders Registry'}
              {selectedView === 'documentation' && '📦 Pending Instruments Installations & Warranty Cards'}
              {selectedView === 'engineer' && '📍 Assigned Field Service Tickets checklist'}
              {selectedView === 'calibration' && '🔬 Instruments Calibration Recall Schedules & Logs'}
              {selectedView === 'workshop' && '🔧 Bench Repair Tickets Diagnostics'}
              {selectedView === 'supervised' && '🎓 Supervised training job assignments'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {selectedView === 'manager' && 'Total active service schedules on desk within AVON service sector.'}
              {selectedView === 'documentation' && 'Vessel and lab inventory requiring unboxing, verification, and signoffs.'}
              {selectedView === 'engineer' && 'Job orders matching your field profile. Inspect to fill out technical checklists.'}
              {selectedView === 'calibration' && 'Instruments requiring metrology certificate alignments.'}
              {selectedView === 'workshop' && 'Instruments requiring component level hardware fixing.'}
              {selectedView === 'supervised' && 'Supervised basic operations representing learning paths.'}
            </p>
          </div>
          <button 
            id="view-all-tickets"
            onClick={() => onNavigate('service')}
            className="text-xs text-[#0054A6] font-bold hover:underline font-sans flex items-center gap-1 cursor-pointer shrink-0"
          >
            Manage Core Service Center &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-500 border-collapse">
            <thead className="bg-[#F5F8FC] text-gray-600 font-mono uppercase text-[10px] tracking-wider border-b border-gray-150">
              <tr>
                <th className="p-3">ID / Reference</th>
                <th className="p-3">Instrument Model</th>
                <th className="p-3">Laboratory</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned Lead</th>
                {selectedView === 'calibration' && <th className="p-3">Error Margin</th>}
                {selectedView === 'documentation' && <th className="p-3">Warranty Expiry</th>}
                <th className="p-3 text-center">Diagnostics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {tickets
                .filter(t => {
                  if (selectedView === 'calibration') return t.type === 'CALIBRATION';
                  if (selectedView === 'workshop') return t.status === 'REPAIRING' || t.status === 'DIAGNOSING' || t.status === 'PENDING_PARTS';
                  if (selectedView === 'engineer') return t.assignedEngineerName?.includes('Suresh') || t.priority === 'CRITICAL';
                  if (selectedView === 'supervised') return t.priority === 'LOW' || t.priority === 'MEDIUM';
                  return true;
                })
                .map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-mono font-extrabold text-gray-700">{ticket.ticketNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-gray-800">{ticket.instrumentName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">SN: {ticket.serialNumber}</div>
                    </td>
                    <td className="p-3 text-gray-650">{ticket.customerName}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                        ticket.status === 'RECEIVED' ? 'bg-blue-50 text-blue-800' :
                        ticket.status === 'DIAGNOSING' ? 'bg-purple-150 text-purple-800' :
                        ticket.status === 'PENDING_PARTS' ? 'bg-rose-100 text-rose-800' :
                        ticket.status === 'REPAIRING' ? 'bg-indigo-100 text-indigo-800' :
                        ticket.status === 'CALIBRATING' ? 'bg-cyan-100 text-cyan-800' :
                        ticket.status === 'QUALITY_CHECK' ? 'bg-amber-100 text-amber-800' :
                        ticket.status === 'CLOSED' ? 'bg-slate-105 text-slate-600' :
                        'bg-[#22C55E]/10 text-emerald-800'
                      }`}>
                        <span className="w-1 h-1 rounded-full bg-current"></span>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-gray-600">
                      {ticket.assignedEngineerName || 'Queue Unallocated'}
                    </td>
                    {selectedView === 'calibration' && (
                      <td className="p-3 font-mono text-emerald-700 font-bold">
                        {calibrations.find(c => c.instrumentId === ticket.instrumentId)?.reportedError || 0.12}% error
                      </td>
                    )}
                    {selectedView === 'documentation' && (
                      <td className="p-3 font-mono text-gray-500">
                        {instruments.find(i => i.id === ticket.instrumentId)?.warrantyExpiry || '2025-10-18'}
                      </td>
                    )}
                    <td className="p-3 text-center">
                      <button 
                        id={`inspect-tkt-${ticket.id}`}
                        onClick={() => onViewTicket(ticket)}
                        className="px-2.5 py-1 text-[11px] font-bold border border-gray-200 text-gray-600 hover:text-white hover:bg-[#0054A6] hover:border-[#0054A6] rounded transition-all cursor-pointer font-sans"
                      >
                        Inspect Card
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
