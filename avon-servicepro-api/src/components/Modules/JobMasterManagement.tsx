import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Columns,
  Calendar,
  Clock,
  Table,
  Zap,
  Code,
  Layers,
  Database,
  Building2,
  Wrench,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Save,
  Bell,
  History,
  Copy,
  Sparkles,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';

import {
  NEXTJS_JOB_PAGE_CODE,
  NEXTJS_JOB_ACTIONS_CODE,
  NEXTJS_JOB_FORMS_CODE,
  NEXTJS_JOB_VIEWS_CODE,
  SUPABASE_JOB_SQL_CODE
} from '../../data/nextjsJobData';

import { UserProfile, Instrument } from '../../types';

interface JobRecord {
  id: string;
  jobNumber: string;
  jobType: 'INSTALLATION' | 'WARRANTY_SERVICE' | 'NON_WARRANTY_SERVICE' | 'WARRANTY_REPAIR' | 'WORKSHOP_JOB' | 'CALIBRATION_JOB';
  title: string;
  customerName: string;
  department: string;
  instrumentName: string;
  serialNumber: string;
  assignedEngineer: string;
  territory: string;
  priority: 'CRITICAL_P1' | 'HIGH_P2' | 'MEDIUM_P3' | 'LOW_P4';
  status: 'PENDING' | 'SCHEDULED' | 'IN_PROGRESS' | 'PENDING_PARTS' | 'QA_CHECK' | 'COMPLETED' | 'CLOSED';
  scheduledDate: string;
  slaTargetHours: number;
  slaElapsedHours: number;
  activityLogs: { action: string; actor: string; details: string; time: string }[];
}

const INITIAL_JOBS: JobRecord[] = [
  {
    id: 'job-101',
    jobNumber: 'JOB-2026-8841',
    jobType: 'INSTALLATION',
    title: 'Installation & IQ/OQ Protocol Signoff for Prominence HPLC',
    customerName: 'Asiri Surgical Hospital',
    department: 'Biochemistry R&D',
    instrumentName: 'Shimadzu LC-20AD Prominence',
    serialNumber: 'SN-SH-884019',
    assignedEngineer: 'Eng. Suresh Perera',
    territory: 'Colombo Metro',
    priority: 'HIGH_P2',
    status: 'IN_PROGRESS',
    scheduledDate: '2026-06-24',
    slaTargetHours: 16,
    slaElapsedHours: 6.5,
    activityLogs: [
      { action: 'CREATED', actor: 'dispatcher@avonservice.com', details: 'Dispatched INSTALLATION order #JOB-2026-8841', time: 'Yesterday 09:30 AM' },
      { action: 'ASSIGNED', actor: 'Suresh Perera', details: 'Assigned to Colombo Metro Field Engineer team', time: 'Yesterday 10:15 AM' },
      { action: 'STATUS_CHANGE', actor: 'Suresh Perera', details: 'Gowned and entered laboratory. Commenced unboxing.', time: 'Today 08:00 AM' }
    ]
  },
  {
    id: 'job-102',
    jobNumber: 'JOB-2026-8842',
    jobType: 'WARRANTY_SERVICE',
    title: 'Bi-Annual Preventive Maintenance & Lamp Intensity Check',
    customerName: 'Durdans Hospital',
    department: 'Hematology Lab',
    instrumentName: 'Sysmex XN-1000 Hematology Analyzer',
    serialNumber: 'SN-SY-110942',
    assignedEngineer: 'Eng. Kasun Silva',
    territory: 'Colombo South',
    priority: 'MEDIUM_P3',
    status: 'SCHEDULED',
    scheduledDate: '2026-06-25',
    slaTargetHours: 8,
    slaElapsedHours: 2.0,
    activityLogs: [
      { action: 'CREATED', actor: 'system-pm@avonservice.com', details: 'Automated 6-month PM dispatch trigger', time: 'June 22, 08:00 AM' }
    ]
  },
  {
    id: 'job-103',
    jobNumber: 'JOB-2026-8843',
    jobType: 'WARRANTY_REPAIR',
    title: 'Emergency P1 Breakdown: Pressure Spike in Pump A',
    customerName: 'Nawaloka Hospital',
    department: 'Emergency STAT Lab',
    instrumentName: 'Thermo Fisher KingFisher Flex',
    serialNumber: 'SN-TF-990421',
    assignedEngineer: 'Eng. Suresh Perera',
    territory: 'Colombo Metro',
    priority: 'CRITICAL_P1',
    status: 'PENDING_PARTS',
    scheduledDate: '2026-06-23',
    slaTargetHours: 4,
    slaElapsedHours: 5.5,
    activityLogs: [
      { action: 'CREATED', actor: 'dr.keshara@nawaloka.com', details: 'STAT alert: KingFisher halt error E-409', time: 'Yesterday 02:00 PM' },
      { action: 'SLA_BREACH', actor: 'SLA Watchdog', details: 'P1 4h SLA target exceeded due to imported manifold valve delay', time: 'Yesterday 06:00 PM' }
    ]
  },
  {
    id: 'job-104',
    jobNumber: 'JOB-2026-8844',
    jobType: 'WORKSHOP_JOB',
    title: 'Bench Overhaul: Mainboard Replacement & Ultrasonic Bath Cleaning',
    customerName: 'Lanka Hospitals',
    department: 'Central Workshop',
    instrumentName: 'Beckman Coulter DXI 800',
    serialNumber: 'SN-BC-449012',
    assignedEngineer: 'Bench Tech Nuwan de Silva',
    territory: 'Central Workshop',
    priority: 'MEDIUM_P3',
    status: 'QA_CHECK',
    scheduledDate: '2026-06-20',
    slaTargetHours: 48,
    slaElapsedHours: 42.0,
    activityLogs: [
      { action: 'CREATED', actor: 'workshop-mgr@avonservice.com', details: 'Received asset at Colombo workshop bay 4', time: 'June 20, 10:00 AM' }
    ]
  },
  {
    id: 'job-105',
    jobNumber: 'JOB-2026-8845',
    jobType: 'CALIBRATION_JOB',
    title: 'Annual ISO 17025 Optical Metrology Drift Verification',
    customerName: 'Bureau Veritas Sri Lanka',
    department: 'Analytical Chemistry',
    instrumentName: 'Agilent 7890B Gas Chromatograph',
    serialNumber: 'SN-AG-550192',
    assignedEngineer: 'Metrologist Tharindu Fernando',
    territory: 'Western Province',
    priority: 'HIGH_P2',
    status: 'COMPLETED',
    scheduledDate: '2026-06-21',
    slaTargetHours: 12,
    slaElapsedHours: 10.5,
    activityLogs: [
      { action: 'CREATED', actor: 'qa@bureauveritas.com', details: 'ISO calibration renewal booking', time: 'June 18, 11:00 AM' },
      { action: 'STATUS_CHANGE', actor: 'Tharindu Fernando', details: 'Drift 0.015% PASS. Issued Certificate #CAL-AV-8894', time: 'June 21, 04:30 PM' }
    ]
  },
  {
    id: 'job-106',
    jobNumber: 'JOB-2026-8846',
    jobType: 'NON_WARRANTY_SERVICE',
    title: 'Chargeable On-Call Service: Centrifuge Rotor Imbalance',
    customerName: 'Hemas Hospital Thalawathugoda',
    department: 'Microbiology Lab',
    instrumentName: 'Eppendorf 5430R Centrifuge',
    serialNumber: 'SN-EP-330192',
    assignedEngineer: 'Eng. Kasun Silva',
    territory: 'Colombo East',
    priority: 'LOW_P4',
    status: 'PENDING',
    scheduledDate: '2026-06-26',
    slaTargetHours: 24,
    slaElapsedHours: 3.0,
    activityLogs: [
      { action: 'CREATED', actor: 'billing@avonservice.com', details: 'Quotation #QUO-9941 approved by customer.', time: 'Today 10:00 AM' }
    ]
  }
];

const WORKFLOW_COLUMNS = [
  { id: 'PENDING', label: 'Queue / Pending', color: 'bg-slate-100 border-slate-300 text-slate-700' },
  { id: 'SCHEDULED', label: 'Scheduled Dispatch', color: 'bg-blue-50 border-blue-300 text-blue-800' },
  { id: 'IN_PROGRESS', label: 'Active Field/Bench', color: 'bg-amber-50 border-amber-300 text-amber-800' },
  { id: 'PENDING_PARTS', label: 'Awaiting Parts', color: 'bg-purple-50 border-purple-300 text-purple-800' },
  { id: 'QA_CHECK', label: 'QA / Metrology Signoff', color: 'bg-indigo-50 border-indigo-300 text-indigo-800' },
  { id: 'COMPLETED', label: 'Completed & Signed', color: 'bg-emerald-50 border-emerald-300 text-emerald-800' }
] as const;

export default function JobMasterManagement({ currentUser }: { currentUser: UserProfile }) {
  // Main Hub Navigation Tabs
  const [activeTab, setActiveTab] = useState<'fleet' | 'nextjs' | 'supabase'>('fleet');
  const [fleetSubView, setFleetSubView] = useState<'kanban' | 'calendar' | 'timeline' | 'table'>('kanban');
  const [nextjsSubTab, setNextjsSubTab] = useState<'pages' | 'actions' | 'forms' | 'views' | 'sql'>('pages');

  // Interactive Data Ledger
  const [jobs, setJobs] = useState<JobRecord[]>(INITIAL_JOBS);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobRecord | null>(null);

  // Toast & Notifications Simulator
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4500);
  };

  // Dispatch / Creation Modal
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    jobType: 'INSTALLATION' as any,
    title: '',
    customerName: 'Asiri Surgical Hospital',
    department: 'Biochemistry Lab',
    instrumentName: 'Shimadzu Prominence HPLC',
    serialNumber: 'SN-SH-' + Math.floor(100000 + Math.random()*900000),
    assignedEngineer: 'Eng. Suresh Perera',
    territory: 'Colombo Metro',
    priority: 'HIGH_P2' as any,
    slaTargetHours: 16
  });

  // Reassignment Modal
  const [reassignModalJob, setReassignModalJob] = useState<JobRecord | null>(null);
  const [newAssignee, setNewAssignee] = useState('Eng. Kasun Silva');
  const [reassignReason, setReassignReason] = useState('Territory workload re-balancing');

  // Filter logic
  const filteredJobs = jobs.filter(j => {
    const matchType = typeFilter === 'ALL' || j.jobType === typeFilter;
    const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        j.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        j.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  // Kanban status move handler
  const moveJobStatus = (id: string, newStatus: any) => {
    setJobs(prev => prev.map(j => {
      if (j.id === id) {
        const updated = { ...j, status: newStatus };
        updated.activityLogs = [
          { action: 'STATUS_CHANGE', actor: currentUser.name || 'Engineer', details: `Workflow status moved to ${newStatus}`, time: 'Just now' },
          ...j.activityLogs
        ];
        return updated;
      }
      return j;
    }));
    showToast(`🔄 Transitioned job status to ${newStatus} & simulated Next.js Server Action updateJobStatusAction().`);
  };

  // Dispatch Submit
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobForm.title) return showToast("⚠️ Please enter a job title/subject!");
    
    const created: JobRecord = {
      id: 'job-' + Date.now(),
      jobNumber: 'JOB-2026-' + Math.floor(1000 + Math.random()*9000),
      jobType: newJobForm.jobType,
      title: newJobForm.title,
      customerName: newJobForm.customerName,
      department: newJobForm.department,
      instrumentName: newJobForm.instrumentName,
      serialNumber: newJobForm.serialNumber,
      assignedEngineer: newJobForm.assignedEngineer,
      territory: newJobForm.territory,
      priority: newJobForm.priority,
      status: 'SCHEDULED',
      scheduledDate: new Date().toISOString().split('T')[0],
      slaTargetHours: Number(newJobForm.slaTargetHours) || 8,
      slaElapsedHours: 0,
      activityLogs: [
        { action: 'CREATED', actor: currentUser.email || 'dispatcher@avon.com', details: `Dispatched new ${newJobForm.jobType} order.`, time: 'Just now' }
      ]
    };

    setJobs([created, ...jobs]);
    setShowDispatchModal(false);
    showToast(`✅ Dispatched ${created.jobNumber}! Row inserted into Supabase & notification dispatched to ${created.assignedEngineer}.`);
  };

  // Reassign Submit
  const handleConfirmReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignModalJob) return;
    const oldEng = reassignModalJob.assignedEngineer;
    
    setJobs(prev => prev.map(j => {
      if (j.id === reassignModalJob.id) {
        return {
          ...j,
          assignedEngineer: newAssignee,
          activityLogs: [
            { action: 'REASSIGNED', actor: currentUser.name || 'Dispatcher', details: `Transferred from ${oldEng} to ${newAssignee}. Reason: ${reassignReason}`, time: 'Just now' },
            ...j.activityLogs
          ]
        };
      }
      return j;
    }));

    showToast(`📍 Reassigned ${reassignModalJob.jobNumber} to ${newAssignee}. Email notification & SMS dispatched.`);
    setReassignModalJob(null);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left max-w-7xl mx-auto p-4 md:p-6">
      
      {/* Toast Popup Notification */}
      {toastMsg && (
        <div className="bg-[#003B75] text-white p-4 rounded-xl shadow-2xl flex items-center justify-between border border-blue-400/30 animate-fade-in-down sticky top-4 z-50">
          <div className="flex items-center gap-3 text-xs font-bold font-sans">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-spin" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-blue-200 hover:text-white font-black text-sm px-2">✕</button>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#003B75] via-[#0054A6] to-[#0077C8] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-black tracking-wider uppercase">
                Module 04
              </span>
              <span className="bg-amber-400/30 border border-amber-300/40 px-3 py-1 rounded-full text-[11px] font-mono font-bold text-amber-200">
                ⚡ Next.js 15 App Router
              </span>
              <span className="bg-emerald-500/30 border border-emerald-400/40 px-3 py-1 rounded-full text-[11px] font-mono font-bold">
                Supabase RLS & SLA Engine
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-sans tracking-tight">Enterprise Job Master Command Hub</h1>
            <p className="text-blue-100 text-sm mt-2 max-w-3xl leading-relaxed">
              Unified field & bench service orchestrator covering Installation, Warranty Service, Repairs, Workshop Overhauls, and Calibration dispatches with SLA timers, Kanban workflows, and immutable audit trails.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => setShowDispatchModal(true)}
              className="bg-white text-[#003B75] hover:bg-blue-50 px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0054A6]" /> Dispatch New Job Order
            </button>
          </div>
        </div>
      </div>

      {/* Module Hub Navigation Bar */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap gap-1.5 border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex-1 min-w-[180px] py-3 px-4 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeTab === 'fleet' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <Briefcase className="w-4 h-4" /> 🚀 Interactive Job Fleet & Views ({filteredJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('nextjs')}
          className={`flex-1 min-w-[180px] py-3 px-4 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeTab === 'nextjs' ? 'bg-[#0054A6] text-white shadow-md' : 'text-amber-600 hover:bg-white/80 hover:text-amber-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> ⚡ Next.js 15 Hub (Code & Actions)
        </button>
        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex-1 min-w-[180px] py-3 px-4 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeTab === 'supabase' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <Database className="w-4 h-4" /> 🗄️ Supabase PostgreSQL Console
        </button>
      </div>

      {/* =========================================================================
          TAB 1: INTERACTIVE JOB FLEET ORCHESTRATOR
          ========================================================================= */}
      {activeTab === 'fleet' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Sub-Views Switcher & Filter Toolbar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col xl:flex-row justify-between items-center gap-4">
            
            {/* View Modes */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full xl:w-auto">
              <button
                onClick={() => setFleetSubView('kanban')}
                className={`flex-1 xl:flex-initial px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer ${
                  fleetSubView === 'kanban' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <Columns className="w-4 h-4" /> Kanban Board
              </button>
              <button
                onClick={() => setFleetSubView('calendar')}
                className={`flex-1 xl:flex-initial px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer ${
                  fleetSubView === 'calendar' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <Calendar className="w-4 h-4" /> Calendar View
              </button>
              <button
                onClick={() => setFleetSubView('timeline')}
                className={`flex-1 xl:flex-initial px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer ${
                  fleetSubView === 'timeline' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <Clock className="w-4 h-4" /> Timeline View
              </button>
              <button
                onClick={() => setFleetSubView('table')}
                className={`flex-1 xl:flex-initial px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer ${
                  fleetSubView === 'table' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <Table className="w-4 h-4" /> Data Ledger
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400 uppercase">Type:</span>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="border border-slate-300 py-2 px-3 rounded-xl text-xs font-extrabold bg-slate-50 text-[#0054A6] focus:ring-2 focus:ring-[#0054A6]"
                >
                  <option value="ALL">All Job Types</option>
                  <option value="INSTALLATION">INSTALLATION</option>
                  <option value="WARRANTY_SERVICE">WARRANTY_SERVICE</option>
                  <option value="NON_WARRANTY_SERVICE">NON_WARRANTY_SERVICE</option>
                  <option value="WARRANTY_REPAIR">WARRANTY_REPAIR</option>
                  <option value="WORKSHOP_JOB">WORKSHOP_JOB</option>
                  <option value="CALIBRATION_JOB">CALIBRATION_JOB</option>
                </select>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search job #, title, org, SN..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full border border-slate-300 pl-10 pr-4 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0054A6]"
                >
                </input>
              </div>
            </div>

          </div>

          {/* SUB-VIEW 1: KANBAN BOARD */}
          {fleetSubView === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
              {WORKFLOW_COLUMNS.map(col => {
                const colJobs = filteredJobs.filter(j => j.status === col.id);
                return (
                  <div key={col.id} className="bg-slate-100/70 rounded-3xl border border-slate-200 p-3 min-w-[260px] shadow-xs flex flex-col max-h-[720px]">
                    <div className={`p-3 rounded-2xl border font-black text-xs flex justify-between items-center mb-3 shrink-0 ${col.color}`}>
                      <span>{col.label}</span>
                      <span className="bg-white px-2.5 py-0.5 rounded-full text-[11px] shadow-2xs font-mono">{colJobs.length}</span>
                    </div>

                    <div className="space-y-3 overflow-y-auto scrollbar-thin pr-1 flex-1">
                      {colJobs.map(job => {
                        const isSlaBreached = job.slaElapsedHours > job.slaTargetHours;
                        return (
                          <div
                            key={job.id}
                            onClick={() => setSelectedJobForDetails(job)}
                            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all text-xs space-y-2.5 cursor-pointer relative group"
                          >
                            <div className="flex justify-between items-start gap-1">
                              <span className="font-mono font-black text-sm text-[#0054A6] group-hover:underline">{job.jobNumber}</span>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                job.priority === 'CRITICAL_P1' ? 'bg-rose-500 text-white animate-pulse' :
                                job.priority === 'HIGH_P2' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {job.priority.split('_')[1]}
                              </span>
                            </div>

                            <div className="font-extrabold text-slate-800 leading-snug line-clamp-2">{job.title}</div>

                            <div className="bg-slate-50 p-2 rounded-xl text-[11px] font-medium text-slate-600 space-y-0.5">
                              <div className="font-bold text-slate-800 truncate">🏢 {job.customerName}</div>
                              <div className="text-slate-500 truncate">🔬 {job.instrumentName} ({job.serialNumber})</div>
                            </div>

                            {/* SLA Tracking Bar */}
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-[10px] font-black">
                                <span className={isSlaBreached ? "text-rose-600 flex items-center gap-1" : "text-slate-500"}>
                                  {isSlaBreached ? "🚨 SLA BREACHED" : "⏱️ SLA Countdown"}
                                </span>
                                <span className="font-mono">{job.slaElapsedHours}h / {job.slaTargetHours}h</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isSlaBreached ? 'bg-rose-500' :
                                    job.slaElapsedHours / job.slaTargetHours > 0.75 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min(100, (job.slaElapsedHours / job.slaTargetHours) * 100)}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t text-[11px] text-slate-500">
                              <span className="font-bold truncate max-w-[120px]">👷 {job.assignedEngineer.split(' ')[0]} {job.assignedEngineer.split(' ')[1]}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); setReassignModalJob(job); }}
                                className="text-[#0054A6] hover:bg-blue-50 px-2 py-1 rounded-lg font-bold text-[10px]"
                              >
                                Reassign
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SUB-VIEW 2: CALENDAR VIEW */}
          {fleetSubView === 'calendar' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-[#0054A6]" /> June 2026 Operational Dispatch Calendar View
                </h3>
                <span className="text-xs font-bold text-slate-400">Month Grid / SLA Milestones</span>
              </div>

              <div className="grid grid-cols-7 gap-3 text-center">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="font-black text-xs text-slate-500 py-2.5 uppercase bg-slate-100 rounded-xl tracking-wider">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }).map((_, idx) => {
                  const dayNum = (idx % 30) + 1;
                  const dateStr = `2026-06-${dayNum < 10 ? '0'+dayNum : dayNum}`;
                  const dayJobs = filteredJobs.filter(j => j.scheduledDate === dateStr || (idx % 8 === 2 && j.status === 'SCHEDULED'));

                  return (
                    <div key={idx} className="border border-slate-200/80 p-3 rounded-2xl min-h-[120px] text-left bg-slate-50/40 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-extrabold text-slate-500">{dayNum}</span>
                        {dayJobs.length > 0 && <span className="w-2 h-2 rounded-full bg-[#0054A6]" />}
                      </div>

                      <div className="mt-2 space-y-1 flex-1 overflow-y-auto max-h-[80px] scrollbar-none">
                        {dayJobs.map(job => (
                          <div
                            key={job.id}
                            onClick={() => setSelectedJobForDetails(job)}
                            className="p-1.5 rounded-lg bg-[#0054A6]/10 text-[#0054A6] text-[10px] font-bold truncate cursor-pointer hover:bg-[#0054A6] hover:text-white transition-all"
                          >
                            {job.jobNumber}: {job.jobType.replace('_', ' ').slice(0, 10)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: TIMELINE VIEW */}
          {fleetSubView === 'timeline' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-[#0054A6]" /> Chronological Execution & SLA Timeline
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Gantt-style horizontal progress visualizing elapsed hours against contracted SLA response windows.</p>
                </div>
              </div>

              <div className="space-y-4">
                {filteredJobs.map(job => {
                  const pct = Math.min(100, (job.slaElapsedHours / job.slaTargetHours) * 100);
                  const isBreached = job.slaElapsedHours > job.slaTargetHours;

                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJobForDetails(job)}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all space-y-3 cursor-pointer"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-base text-[#0054A6] bg-blue-100/60 px-3 py-1 rounded-xl">{job.jobNumber}</span>
                          <span className="font-extrabold text-sm text-slate-800">{job.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-bold text-slate-600">👷 {job.assignedEngineer}</span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Gantt Track */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-black">
                          <span className="text-slate-500">🏢 {job.customerName} ({job.territory})</span>
                          <span className={isBreached ? "text-rose-600 font-mono" : "text-slate-600 font-mono"}>
                            SLA Milestone: {job.slaElapsedHours}h elapsed of {job.slaTargetHours}h target ({pct.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-5 rounded-xl relative overflow-hidden flex items-center p-0.5">
                          <div
                            className={`h-full rounded-lg transition-all flex items-center justify-end pr-2 text-[10px] font-black text-white ${
                              isBreached ? 'bg-rose-500' : job.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-[#0054A6]'
                            }`}
                            style={{ width: `${Math.max(12, pct)}%` }}
                          >
                            {pct >= 25 && <span>{job.status}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-VIEW 4: DATA LEDGER TABLE */}
          {fleetSubView === 'table' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
              <div className="p-6 border-b bg-slate-50/80 flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-800">📋 Enterprise Job Master Register Register</h3>
                <span className="text-xs font-bold text-slate-500">Showing {filteredJobs.length} active dispatches</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-[11px] font-black uppercase tracking-wider border-b">
                      <th className="py-4 px-6">Job Number & Type</th>
                      <th className="py-4 px-4">Subject & Customer Org</th>
                      <th className="py-4 px-4">Target Asset SN</th>
                      <th className="py-4 px-4">Assigned Technician</th>
                      <th className="py-4 px-4 text-center">Workflow Status</th>
                      <th className="py-4 px-6 text-right">SLA Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredJobs.map(job => (
                      <tr
                        key={job.id}
                        onClick={() => setSelectedJobForDetails(job)}
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <span className="font-mono font-black text-[#0054A6] text-sm block">{job.jobNumber}</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">{job.jobType}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-slate-900 text-sm max-w-md">{job.title}</div>
                          <div className="text-slate-500 text-[11px] mt-0.5">🏢 {job.customerName} ({job.department})</div>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-slate-700">
                          {job.serialNumber}
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-800">
                          👷 {job.assignedEngineer}
                          <span className="block text-[10px] text-slate-400 font-normal">📍 {job.territory}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                            job.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-blue-100 text-blue-800'
                          }`}>
                            ● {job.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-black text-amber-700">
                          {job.slaTargetHours} hrs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 2: NEXT.JS 15 HUB SHOWCASE
          ========================================================================= */}
      {activeTab === 'nextjs' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setNextjsSubTab('pages')} className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${nextjsSubTab === 'pages' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Layers className="w-4 h-4 text-blue-300" /> Next.js Pages (`page.tsx`)
              </button>
              <button onClick={() => setNextjsSubTab('actions')} className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${nextjsSubTab === 'actions' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Code className="w-4 h-4 text-amber-400" /> Server Actions (`actions.ts`)
              </button>
              <button onClick={() => setNextjsSubTab('forms')} className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${nextjsSubTab === 'forms' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Wrench className="w-4 h-4 text-emerald-400" /> Shadcn Dispatch Forms
              </button>
              <button onClick={() => setNextjsSubTab('views')} className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${nextjsSubTab === 'views' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Columns className="w-4 h-4 text-purple-400" /> Multi-View Kanban & Timeline
              </button>
              <button onClick={() => setNextjsSubTab('sql')} className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${nextjsSubTab === 'sql' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Database className="w-4 h-4 text-rose-400" /> Supabase SQL & RLS
              </button>
            </div>
          </div>

          {nextjsSubTab === 'pages' && (
            <div className="bg-[#121824] rounded-3xl border border-slate-800 p-6 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" /> `src/app/(dashboard)/jobs/page.tsx`
                  </h3>
                  <p className="text-xs text-slate-400">Next.js 15 App Router Server Component fetching dispatches and SLA metrics via Supabase SSR.</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(NEXTJS_JOB_PAGE_CODE); showToast("📋 Copied Next.js Job Page code!"); }} className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto max-h-[540px] scrollbar-thin p-2">
                <code>{NEXTJS_JOB_PAGE_CODE}</code>
              </pre>
            </div>
          )}

          {nextjsSubTab === 'actions' && (
            <div className="bg-[#121824] rounded-3xl border border-slate-800 p-6 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-amber-400" /> `src/actions/jobs.ts` (`'use server'`)
                  </h3>
                  <p className="text-xs text-slate-400">Production Server Actions for job creation, engineer assignment, status moves, and notification triggers.</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(NEXTJS_JOB_ACTIONS_CODE); showToast("📋 Copied Server Actions!"); }} className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto max-h-[540px] scrollbar-thin p-2">
                <code>{NEXTJS_JOB_ACTIONS_CODE}</code>
              </pre>
            </div>
          )}

          {nextjsSubTab === 'forms' && (
            <div className="bg-[#121824] rounded-3xl border border-slate-800 p-6 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-400" /> `src/components/jobs/JobProvisioningForm.tsx`
                  </h3>
                  <p className="text-xs text-slate-400">Client Component with React Hook Form + Zod validation + useTransition for optimistic dispatches.</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(NEXTJS_JOB_FORMS_CODE); showToast("📋 Copied Form Code!"); }} className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto max-h-[540px] scrollbar-thin p-2">
                <code>{NEXTJS_JOB_FORMS_CODE}</code>
              </pre>
            </div>
          )}

          {nextjsSubTab === 'views' && (
            <div className="bg-[#121824] rounded-3xl border border-slate-800 p-6 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Columns className="w-4 h-4 text-purple-400" /> `src/components/jobs/JobMasterViewsClient.tsx`
                  </h3>
                  <p className="text-xs text-slate-400">Multi-View Client Component rendering Kanban workflows, calendar grids, Gantt tracks, and data ledgers.</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(NEXTJS_JOB_VIEWS_CODE); showToast("📋 Copied Views Code!"); }} className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto max-h-[540px] scrollbar-thin p-2">
                <code>{NEXTJS_JOB_VIEWS_CODE}</code>
              </pre>
            </div>
          )}

          {nextjsSubTab === 'sql' && (
            <div className="bg-[#121824] rounded-3xl border border-slate-800 p-6 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-rose-400" /> Supabase PostgreSQL Schema & RLS Security Policies
                  </h3>
                  <p className="text-xs text-slate-400">DDL for `jobs`, `job_assignments`, `job_activity_logs`, `job_notifications`, enums, and RLS rules.</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(SUPABASE_JOB_SQL_CODE); showToast("📋 Copied Job SQL!"); }} className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto max-h-[540px] scrollbar-thin p-2">
                <code>{SUPABASE_JOB_SQL_CODE}</code>
              </pre>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 3: SUPABASE SQL CONSOLE
          ========================================================================= */}
      {activeTab === 'supabase' && (
        <div className="bg-[#121824] rounded-3xl border border-slate-800 p-8 text-white space-y-6 shadow-2xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-5">
            <div>
              <h2 className="text-xl font-black flex items-center gap-3">
                <Database className="w-6 h-6 text-rose-400" /> Supabase PostgreSQL DDL & RLS Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">Execute this migration in your Supabase SQL Editor to bootstrap the Job Master tables & security rules.</p>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(SUPABASE_JOB_SQL_CODE); showToast("✅ Copied SQL to clipboard!"); }}
              className="bg-[#0054A6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4" /> Copy SQL Script
            </button>
          </div>

          <pre className="text-xs font-mono text-emerald-400 bg-black/60 p-6 rounded-2xl overflow-x-auto max-h-[600px] scrollbar-thin border border-slate-800">
            <code>{SUPABASE_JOB_SQL_CODE}</code>
          </pre>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: JOB DETAILS & ACTIVITY LOG SIDEBAR / MODAL
          ========================================================================= */}
      {selectedJobForDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between p-8 overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <span className="bg-[#0054A6]/10 text-[#0054A6] font-mono font-black px-3 py-1 rounded-lg text-xs">
                    {selectedJobForDetails.jobNumber}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedJobForDetails.title}</h2>
                  <span className="text-xs font-bold text-slate-500 block mt-1">Classification: {selectedJobForDetails.jobType}</span>
                </div>
                <button onClick={() => setSelectedJobForDetails(null)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold">✕</button>
              </div>

              {/* Status Move Action Bar */}
              <div className="bg-blue-50/60 border border-blue-200 p-5 rounded-2xl space-y-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">🔄 Quick Workflow Status Move:</span>
                <div className="flex flex-wrap gap-2">
                  {(['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'PENDING_PARTS', 'QA_CHECK', 'COMPLETED'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => { moveJobStatus(selectedJobForDetails.id, st); setSelectedJobForDetails({ ...selectedJobForDetails, status: st }); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        selectedJobForDetails.status === st ? 'bg-[#0054A6] text-white shadow' : 'bg-white border text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assignment & Asset Card */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-5 rounded-2xl border">
                <div>
                  <span className="text-slate-400 font-bold block">🏢 Customer Org</span>
                  <span className="font-extrabold text-slate-800 text-sm">{selectedJobForDetails.customerName}</span>
                  <span className="text-slate-500 block">{selectedJobForDetails.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">🔬 Target Instrument SN</span>
                  <span className="font-extrabold text-slate-800 text-sm">{selectedJobForDetails.instrumentName}</span>
                  <span className="font-mono text-[#0054A6] block">{selectedJobForDetails.serialNumber}</span>
                </div>
                <div className="pt-3 border-t col-span-2 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 font-bold block">👷 Assigned Technician</span>
                    <span className="font-extrabold text-slate-800 text-sm">{selectedJobForDetails.assignedEngineer}</span>
                    <span className="text-slate-500">📍 {selectedJobForDetails.territory}</span>
                  </div>
                  <button
                    onClick={() => { setReassignModalJob(selectedJobForDetails); setSelectedJobForDetails(null); }}
                    className="bg-white border border-[#0054A6] text-[#0054A6] hover:bg-blue-50 px-3.5 py-2 rounded-xl font-black shadow-2xs"
                  >
                    Transfer / Reassign
                  </button>
                </div>
              </div>

              {/* Activity Log Audit Trail */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#0054A6]" /> Immutable Activity Log & Notifications
                </h3>

                <div className="space-y-3 pl-2 border-l-2 border-blue-200">
                  {selectedJobForDetails.activityLogs.map((log, lIdx) => (
                    <div key={lIdx} className="relative pl-5 text-xs space-y-1">
                      <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-[#0054A6] border-2 border-white" />
                      <div className="flex justify-between items-center">
                        <span className="font-black text-slate-800 uppercase tracking-wider text-[11px] bg-slate-100 px-2 py-0.5 rounded">{log.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                      </div>
                      <p className="text-slate-600 font-medium">{log.details}</p>
                      <span className="text-[10px] text-slate-400 block">By: {log.actor}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t mt-8">
              <button onClick={() => setSelectedJobForDetails(null)} className="w-full bg-[#0054A6] text-white py-3 rounded-2xl font-black text-xs shadow-lg hover:bg-blue-800">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: DISPATCH NEW JOB MODAL
          ========================================================================= */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#0054A6]/10 text-[#0054A6] rounded-2xl">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Dispatch Enterprise Job Master Order</h3>
                  <p className="text-xs text-slate-500">Orchestrate field/bench SLA timers and automated technician routing.</p>
                </div>
              </div>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg p-2">✕</button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Job Type *</label>
                  <select
                    value={newJobForm.jobType}
                    onChange={e => setNewJobForm({ ...newJobForm, jobType: e.target.value })}
                    className="w-full border p-2.5 rounded-xl font-bold text-[#0054A6]"
                  >
                    <option value="INSTALLATION">INSTALLATION</option>
                    <option value="WARRANTY_SERVICE">WARRANTY_SERVICE</option>
                    <option value="NON_WARRANTY_SERVICE">NON_WARRANTY_SERVICE</option>
                    <option value="WARRANTY_REPAIR">WARRANTY_REPAIR</option>
                    <option value="WORKSHOP_JOB">WORKSHOP_JOB</option>
                    <option value="CALIBRATION_JOB">CALIBRATION_JOB</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SLA Priority *</label>
                  <select
                    value={newJobForm.priority}
                    onChange={e => setNewJobForm({ ...newJobForm, priority: e.target.value })}
                    className="w-full border p-2.5 rounded-xl font-bold text-rose-700"
                  >
                    <option value="CRITICAL_P1">CRITICAL P1 (2h response)</option>
                    <option value="HIGH_P2">HIGH P2 (4h response)</option>
                    <option value="MEDIUM_P3">MEDIUM P3 (8h response)</option>
                    <option value="LOW_P4">LOW P4 (24h response)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Title / Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STAT Breakdown: Optical Sensor Alignment Check"
                  value={newJobForm.title}
                  onChange={e => setNewJobForm({ ...newJobForm, title: e.target.value })}
                  className="w-full border p-2.5 rounded-xl font-bold text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Organization *</label>
                  <input type="text" value={newJobForm.customerName} onChange={e => setNewJobForm({ ...newJobForm, customerName: e.target.value })} className="w-full border p-2 rounded-xl font-bold" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department *</label>
                  <input type="text" value={newJobForm.department} onChange={e => setNewJobForm({ ...newJobForm, department: e.target.value })} className="w-full border p-2 rounded-xl font-bold" />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Target Instrument SN *</label>
                  <input type="text" value={newJobForm.instrumentName} onChange={e => setNewJobForm({ ...newJobForm, instrumentName: e.target.value })} className="w-full border p-2 rounded-xl font-bold text-[#0054A6]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Engineer *</label>
                  <select value={newJobForm.assignedEngineer} onChange={e => setNewJobForm({ ...newJobForm, assignedEngineer: e.target.value })} className="w-full border p-2.5 rounded-xl font-bold">
                    <option value="Eng. Suresh Perera">Eng. Suresh Perera</option>
                    <option value="Eng. Kasun Silva">Eng. Kasun Silva</option>
                    <option value="Bench Tech Nuwan">Bench Tech Nuwan</option>
                    <option value="Metrologist Tharindu">Metrologist Tharindu</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Territory *</label>
                  <input type="text" value={newJobForm.territory} onChange={e => setNewJobForm({ ...newJobForm, territory: e.target.value })} className="w-full border p-2.5 rounded-xl font-bold" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target SLA (Hrs) *</label>
                  <input type="number" value={newJobForm.slaTargetHours} onChange={e => setNewJobForm({ ...newJobForm, slaTargetHours: Number(e.target.value) })} className="w-full border p-2.5 rounded-xl font-mono font-bold text-emerald-700" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowDispatchModal(false)} className="px-5 py-2.5 rounded-xl border font-bold text-slate-600">Cancel</button>
                <button type="submit" className="bg-[#0054A6] text-white px-7 py-2.5 rounded-xl font-black shadow-md hover:bg-blue-800 cursor-pointer flex items-center gap-2">
                  <Save className="w-4 h-4" /> Dispatch Order & Notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: REASSIGNMENT MODAL
          ========================================================================= */}
      {reassignModalJob && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                📍 Transfer / Reassign {reassignModalJob.jobNumber}
              </h3>
              <button onClick={() => setReassignModalJob(null)} className="text-slate-400 hover:text-slate-700 font-bold text-base">✕</button>
            </div>

            <form onSubmit={handleConfirmReassign} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border space-y-1">
                <span className="font-bold text-slate-500 block">Current Technician:</span>
                <span className="font-black text-slate-900 text-sm">{reassignModalJob.assignedEngineer}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Assigned Engineer / Technician *</label>
                <select value={newAssignee} onChange={e => setNewAssignee(e.target.value)} className="w-full border p-2.5 rounded-xl font-extrabold text-[#0054A6]">
                  <option value="Eng. Suresh Perera">Eng. Suresh Perera (Senior Bio Engineer)</option>
                  <option value="Eng. Kasun Silva">Eng. Kasun Silva (Field Service Engineer)</option>
                  <option value="Bench Tech Nuwan de Silva">Bench Tech Nuwan de Silva (Workshop Overhaul)</option>
                  <option value="Metrologist Tharindu Fernando">Metrologist Tharindu Fernando (ISO Calibration)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reassignment Justification (SLA Audit Trail) *</label>
                <textarea rows={3} value={reassignReason} onChange={e => setReassignReason(e.target.value)} required placeholder="e.g. Field engineer on emergency STAT repair in Kandy..." className="w-full border p-2.5 rounded-xl font-medium" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setReassignModalJob(null)} className="px-5 py-2.5 rounded-xl border font-bold text-slate-600">Cancel</button>
                <button type="submit" className="bg-[#0054A6] text-white px-6 py-2.5 rounded-xl font-black shadow-md hover:bg-blue-800 cursor-pointer">
                  Confirm Reassignment & Notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
