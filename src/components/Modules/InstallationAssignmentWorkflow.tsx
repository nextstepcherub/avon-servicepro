import React, { useState, useMemo } from 'react';
import { 
  InstallationRequest, 
  InstallationRequestStatus, 
  InstallationAssignment, 
  InstallationAssignmentAuditLog, 
  InstallationPriority,
  UserProfile,
  UserRole
} from '../../types';
import { 
  SUPABASE_SPRINT52_ASSIGNMENT_SQL, 
  AVAILABLE_ENGINEERS, 
  AVAILABLE_TECHNICIANS, 
  WORKFLOW_STATUS_PIPELINE,
  calculateSlaDueDate
} from '../../data/sprint52InstallationAssignmentDbLayer';
import { 
  Users, 
  Wrench, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  UserCheck, 
  FileText, 
  Database, 
  Copy, 
  Check, 
  X, 
  Plus, 
  History, 
  MapPin, 
  AlertCircle, 
  Filter, 
  Search, 
  ChevronRight, 
  Lock, 
  Settings, 
  Sliders, 
  UserCog,
  Briefcase,
  PlayCircle
} from 'lucide-react';

interface InstallationAssignmentWorkflowProps {
  requests: InstallationRequest[];
  assignments: InstallationAssignment[];
  auditLogs: InstallationAssignmentAuditLog[];
  onAssign: (assignment: InstallationAssignment, updatedReq: InstallationRequest, log: InstallationAssignmentAuditLog) => void;
  onAdvanceStatus: (requestId: string, newStatus: InstallationRequestStatus, log: InstallationAssignmentAuditLog) => void;
  currentUser: UserProfile;
}

export default function InstallationAssignmentWorkflow({
  requests,
  assignments,
  auditLogs,
  onAssign,
  onAdvanceStatus,
  currentUser
}: InstallationAssignmentWorkflowProps) {

  // Simulated Role State for testing Sprint 5.2 RBAC rules in AI Studio
  const [simulatedRole, setSimulatedRole] = useState<string>(currentUser.role || 'Workshop Manager');

  // Configurable System SLA Setting (Default 15 Days)
  const [slaDaysSetting, setSlaDaysSetting] = useState<number>(15);
  const [showSlaConfigModal, setShowSlaConfigModal] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Dialog & Drawer States
  const [selectedReqForAssign, setSelectedReqForAssign] = useState<InstallationRequest | null>(null);
  const [selectedReqForTimeline, setSelectedReqForTimeline] = useState<InstallationRequest | null>(null);
  const [selectedReqForAdvance, setSelectedReqForAdvance] = useState<InstallationRequest | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Assignment Dialog Form Data
  const [assignForm, setAssignForm] = useState({
    assignedEngineer: AVAILABLE_ENGINEERS[0],
    assignedTechnicians: [AVAILABLE_TECHNICIANS[0]],
    priority: 'Normal' as InstallationPriority,
    targetInstallationDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    installationTerritory: 'Western Metro Territory',
    remarks: ''
  });

  // Advance Status Form Data
  const [advanceNotes, setAdvanceNotes] = useState('');
  const [targetNextStatus, setTargetNextStatus] = useState<InstallationRequestStatus>('Assigned');

  // RBAC Permission Check
  const canAssignEngineers = useMemo(() => {
    return simulatedRole === 'Area Engineer' || simulatedRole === 'Workshop Manager' || simulatedRole === 'SUPER_ADMIN' || simulatedRole === 'DIRECTOR';
  }, [simulatedRole]);

  // Map assignments by requestId for O(1) lookup
  const assignmentMap = useMemo(() => {
    const map = new Map<string, InstallationAssignment>();
    assignments.forEach(a => map.set(a.requestId, a));
    return map;
  }, [assignments]);

  // Calculate SLA countdowns & overdue indicators
  const enrichedRequests = useMemo(() => {
    const now = new Date().getTime();
    return requests.map(req => {
      const asgn = assignmentMap.get(req.id);
      const deliveryStr = req.deliveryDate || new Date().toISOString().split('T')[0];
      const dueDateStr = asgn ? asgn.slaDueDate : calculateSlaDueDate(deliveryStr, slaDaysSetting);
      const dueDate = new Date(dueDateStr).getTime();
      const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      const isOverdue = diffDays < 0 && req.status !== 'Closed' && req.status !== 'Installed';

      return {
        ...req,
        assignment: asgn,
        calculatedSlaDueDate: dueDateStr,
        slaDiffDays: diffDays,
        isOverdue
      };
    });
  }, [requests, assignmentMap, slaDaysSetting]);

  // Filtered List
  const filteredList = useMemo(() => {
    return enrichedRequests.filter(item => {
      const matchSearch = searchTerm === '' || 
        item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instrumentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || (item.assignment?.priority || 'Normal') === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [enrichedRequests, searchTerm, statusFilter, priorityFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const pendingAssign = enrichedRequests.filter(r => r.status === 'Pending Assignment' || r.status === 'Pending Request').length;
    const assignedOrSched = enrichedRequests.filter(r => r.status === 'Assigned' || r.status === 'Scheduled').length;
    const inProgress = enrichedRequests.filter(r => r.status === 'Travelling' || r.status === 'On Site' || r.status === 'Installation Completed' || r.status === 'Report Pending').length;
    const overdueCount = enrichedRequests.filter(r => r.isOverdue).length;
    return { pendingAssign, assignedOrSched, inProgress, overdueCount };
  }, [enrichedRequests]);

  // Open Assignment Dialog
  const handleOpenAssign = (req: InstallationRequest) => {
    const existing = assignmentMap.get(req.id);
    if (existing) {
      setAssignForm({
        assignedEngineer: existing.assignedEngineer,
        assignedTechnicians: existing.assignedTechnicians,
        priority: existing.priority,
        targetInstallationDate: existing.targetInstallationDate,
        installationTerritory: existing.installationTerritory,
        remarks: existing.remarks || ''
      });
    } else {
      setAssignForm({
        assignedEngineer: AVAILABLE_ENGINEERS[0],
        assignedTechnicians: [AVAILABLE_TECHNICIANS[0]],
        priority: 'Normal',
        targetInstallationDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        installationTerritory: 'Colombo Central BioMed',
        remarks: ''
      });
    }
    setSelectedReqForAssign(req);
  };

  // Toggle Technician checkbox
  const toggleTechnician = (tech: string) => {
    setAssignForm(prev => {
      const exists = prev.assignedTechnicians.includes(tech);
      if (exists) {
        return { ...prev, assignedTechnicians: prev.assignedTechnicians.filter(t => t !== tech) };
      } else {
        return { ...prev, assignedTechnicians: [...prev.assignedTechnicians, tech] };
      }
    });
  };

  // Submit Assignment
  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForAssign) return;

    if (assignForm.assignedTechnicians.length === 0) {
      alert("Please assign at least one technician.");
      return;
    }

    const dueDate = calculateSlaDueDate(selectedReqForAssign.deliveryDate, slaDaysSetting);
    const existing = assignmentMap.get(selectedReqForAssign.id);

    const newAssignment: InstallationAssignment = {
      id: existing ? existing.id : `asgn-${Date.now().toString().slice(-6)}`,
      requestId: selectedReqForAssign.id,
      assignedEngineer: assignForm.assignedEngineer,
      assignedTechnicians: assignForm.assignedTechnicians,
      assignedBy: `${simulatedRole} (${currentUser.name || 'System User'})`,
      assignmentDate: new Date().toISOString(),
      targetInstallationDate: assignForm.targetInstallationDate,
      priority: assignForm.priority,
      slaDaysSetting,
      slaDueDate: dueDate,
      installationTerritory: assignForm.installationTerritory,
      remarks: assignForm.remarks,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const nextStatus: InstallationRequestStatus = selectedReqForAssign.status === 'Pending Request' || selectedReqForAssign.status === 'Pending Assignment' 
      ? 'Assigned' 
      : selectedReqForAssign.status;

    const updatedReq: InstallationRequest = {
      ...selectedReqForAssign,
      status: nextStatus
    };

    const auditLog: InstallationAssignmentAuditLog = {
      id: `aud-${Date.now().toString().slice(-6)}`,
      requestId: selectedReqForAssign.id,
      assignmentId: newAssignment.id,
      action: existing ? 'Engineer Assignment Updated' : 'Engineer Assigned to Installation',
      fromStatus: selectedReqForAssign.status,
      toStatus: nextStatus,
      performedBy: currentUser.name || 'Alex Vance',
      performedByRole: simulatedRole,
      timestamp: new Date().toISOString(),
      notes: `Lead Engineer: ${assignForm.assignedEngineer}. Priority set to ${assignForm.priority}. Target: ${assignForm.targetInstallationDate}.`
    };

    onAssign(newAssignment, updatedReq, auditLog);
    setSelectedReqForAssign(null);
  };

  // Open Advance Status Dialog
  const handleOpenAdvance = (req: InstallationRequest) => {
    const idx = WORKFLOW_STATUS_PIPELINE.indexOf(req.status);
    const nextIdx = idx < WORKFLOW_STATUS_PIPELINE.length - 1 ? idx + 1 : idx;
    setTargetNextStatus(WORKFLOW_STATUS_PIPELINE[nextIdx]);
    setAdvanceNotes('');
    setSelectedReqForAdvance(req);
  };

  // Submit Advance Status
  const handleSaveAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForAdvance) return;

    const auditLog: InstallationAssignmentAuditLog = {
      id: `aud-${Date.now().toString().slice(-6)}`,
      requestId: selectedReqForAdvance.id,
      assignmentId: assignmentMap.get(selectedReqForAdvance.id)?.id,
      action: 'Workflow Status Advanced',
      fromStatus: selectedReqForAdvance.status,
      toStatus: targetNextStatus,
      performedBy: currentUser.name || 'Marcus Thorne',
      performedByRole: simulatedRole,
      timestamp: new Date().toISOString(),
      notes: advanceNotes || `Status advanced to ${targetNextStatus}`
    };

    onAdvanceStatus(selectedReqForAdvance.id, targetNextStatus, auditLog);
    setSelectedReqForAdvance(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-3 h-3" /> Sprint 5.2 Engine
              </span>
              <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                Supabase RLS & Assignment Pipeline
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
              Installation Assignment & Workflow Tracker
            </h1>
            <p className="text-xs text-indigo-200/80 max-w-2xl mt-1 font-sans">
              Assign field engineers, track multi-technician crews, calculate SLA countdown windows from delivery dates, and monitor real-time lifecycle milestones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Role Simulator Dropdown */}
            <div className="bg-slate-800/80 border border-slate-700 p-1.5 rounded-2xl flex items-center gap-2 px-3 shadow-inner">
              <UserCog className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-slate-400 uppercase">Simulate Role (RBAC Check):</span>
                <select 
                  value={simulatedRole} 
                  onChange={e => setSimulatedRole(e.target.value)}
                  className="bg-transparent text-xs font-black text-amber-300 focus:outline-none cursor-pointer"
                >
                  <option value="Workshop Manager" className="bg-slate-900 text-white">Workshop Manager (Can Assign)</option>
                  <option value="Area Engineer" className="bg-slate-900 text-white">Area Engineer (Can Assign)</option>
                  <option value="Documentation Officer" className="bg-slate-900 text-white">Documentation Officer (Restricted)</option>
                  <option value="Technician" className="bg-slate-900 text-white">Technician (Restricted)</option>
                  <option value="SUPER_ADMIN" className="bg-slate-900 text-white">SUPER_ADMIN (Override)</option>
                </select>
              </div>
            </div>

            {/* SLA Config Setting Button */}
            <button
              onClick={() => setShowSlaConfigModal(true)}
              className="px-4 py-2.5 bg-indigo-600/60 hover:bg-indigo-600 text-indigo-100 rounded-2xl text-xs font-bold border border-indigo-400/40 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Settings className="w-4 h-4 text-indigo-300" />
              <span>SLA Due Setting: <strong className="text-white underline font-mono">{slaDaysSetting} Days</strong></span>
            </button>

            {/* Supabase SQL Button */}
            <button
              onClick={() => { setCopiedSql(false); setShowSqlModal(true); }}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl text-xs font-black font-mono transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105"
            >
              <Database className="w-4 h-4" />
              <span>Supabase SQL</span>
            </button>
          </div>
        </div>
      </div>

      {/* RBAC Enforcement Alert Box */}
      {!canAssignEngineers && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm">
          <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-950 font-mono uppercase tracking-wide">
              🔒 Business Rule Active: Engineer Assignment Access Restricted
            </h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed font-sans">
              According to AVON Quality SOPs, <strong className="underline">only Area Engineers and Workshop Managers</strong> may assign or dispatch installation crews. Your current simulated role (<strong className="font-mono bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-900">{simulatedRole}</strong>) has read-only status for engineer allocation. Use the dropdown in the header above to switch roles and test assignment flows.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 font-mono uppercase">Pending Assignment</span>
            <h3 className="text-2xl font-black font-mono text-amber-600 mt-1">{metrics.pendingAssign}</h3>
            <span className="text-[10px] text-slate-400">Requires engineer allocation</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 font-mono uppercase">Assigned / Scheduled</span>
            <h3 className="text-2xl font-black font-mono text-indigo-600 mt-1">{metrics.assignedOrSched}</h3>
            <span className="text-[10px] text-slate-400">Crew dispatched & dates confirmed</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 font-mono uppercase">Field In Progress</span>
            <h3 className="text-2xl font-black font-mono text-cyan-600 mt-1">{metrics.inProgress}</h3>
            <span className="text-[10px] text-slate-400">Travelling, On Site, Report Prep</span>
          </div>
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 font-mono uppercase">Overdue SLA Alert</span>
            <h3 className={`text-2xl font-black font-mono mt-1 ${metrics.overdueCount > 0 ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`}>
              {metrics.overdueCount}
            </h3>
            <span className="text-[10px] text-slate-400">Exceeded SLA window</span>
          </div>
          <div className={`p-3 rounded-2xl ${metrics.overdueCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Interactive Workflow Pipeline Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-black font-mono text-slate-500 uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Pipeline:
          </span>
          
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'ALL' ? 'bg-[#0054A6] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({requests.length})
          </button>

          {WORKFLOW_STATUS_PIPELINE.map(st => {
            const count = requests.filter(r => r.status === st).length;
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-indigo-900 text-white shadow-md scale-105' 
                    : count > 0 ? 'bg-indigo-50/80 text-indigo-900 hover:bg-indigo-100 border border-indigo-200/60' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <span>{st}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Priority Filter Toolbar */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice #, hospital/client, instrument, SN..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0054A6]/20 shadow-2xs font-sans"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-600">Priority Filter:</span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="text-xs font-extrabold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">🚨 Critical Only</option>
            <option value="Urgent">⚡ Urgent Only</option>
            <option value="Normal">🟢 Normal Only</option>
          </select>
        </div>
      </div>

      {/* Main Master Card Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredList.length > 0 ? (
          filteredList.map(item => {
            const priority = item.assignment?.priority || 'Normal';
            const priorityColor = priority === 'Critical' 
              ? 'bg-rose-100 text-rose-800 border-rose-300' 
              : priority === 'Urgent' 
              ? 'bg-amber-100 text-amber-800 border-amber-300' 
              : 'bg-slate-100 text-slate-700 border-slate-300';

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
                {/* Left accent strip by status */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${item.isOverdue ? 'bg-rose-500 animate-pulse' : 'bg-[#0054A6]'}`} />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pl-2">
                  
                  {/* Left Column: Commercial & Instrument */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-sm text-indigo-950 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                        {item.invoiceNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black font-mono border uppercase ${priorityColor}`}>
                        Priority: {priority}
                      </span>
                      <span className="bg-blue-50 text-[#0054A6] border border-blue-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        {item.brand}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      {item.instrumentName} <span className="text-slate-500 font-mono text-xs font-normal">({item.model} • SN: {item.serialNumber})</span>
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-sans pt-1">
                      <span className="flex items-center gap-1 font-bold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {item.customerName} ({item.departmentName})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Delivery: <strong className="font-mono">{item.deliveryDate}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: SLA Countdown Indicator */}
                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl min-w-[220px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> SLA Due Date:
                      </span>
                      <span className="font-mono font-extrabold text-xs text-slate-900">
                        {item.calculatedSlaDueDate}
                      </span>
                    </div>

                    {item.isOverdue ? (
                      <div className="bg-rose-500 text-white px-2.5 py-1 rounded-xl text-[11px] font-black font-mono flex items-center justify-center gap-1.5 shadow-xs">
                        <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                        <span>OVERDUE BY {Math.abs(item.slaDiffDays)} DAYS</span>
                      </div>
                    ) : item.status === 'Closed' ? (
                      <div className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-xl text-[11px] font-bold font-mono text-center">
                        ✓ SLA COMPLETED
                      </div>
                    ) : (
                      <div className={`px-2.5 py-1 rounded-xl text-[11px] font-black font-mono text-center ${
                        item.slaDiffDays <= 3 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        ⏳ {item.slaDiffDays} Days Remaining
                      </div>
                    )}
                    <span className="text-[9px] text-slate-400 block text-center mt-1 font-mono">
                      Calculated from delivery ({slaDaysSetting}d rule)
                    </span>
                  </div>

                  {/* Right Column: Assignment Details & Workflow Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center justify-end gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    
                    {/* Engineer info badge */}
                    <div className="text-left sm:text-right min-w-[180px]">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Assigned Lead:</span>
                      {item.assignment ? (
                        <>
                          <span className="text-xs font-black text-indigo-950 block truncate max-w-[200px]" title={item.assignment.assignedEngineer}>
                            👨‍🔧 {item.assignment.assignedEngineer.split('(')[0]}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">
                            + {item.assignment.assignedTechnicians.length} Technician(s)
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                          Unassigned
                        </span>
                      )}
                    </div>

                    {/* Status Pill */}
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-mono text-slate-400 uppercase mb-0.5">Current Stage:</span>
                      <span className="bg-[#0054A6] text-white px-3 py-1 rounded-xl font-black text-xs font-mono shadow-xs whitespace-nowrap">
                        {item.status}
                      </span>
                    </div>

                    {/* Action Menu */}
                    <div className="flex items-center gap-2 shrink-0">
                      
                      {/* Assign Button */}
                      <button
                        onClick={() => handleOpenAssign(item)}
                        disabled={!canAssignEngineers}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                          !canAssignEngineers
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                            : item.assignment ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200' : 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                        }`}
                        title={!canAssignEngineers ? "Requires Area Engineer or Workshop Manager role" : "Assign Engineer"}
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{item.assignment ? 'Reassign' : 'Assign'}</span>
                      </button>

                      {/* Advance Status Button */}
                      <button
                        onClick={() => handleOpenAdvance(item)}
                        disabled={item.status === 'Closed'}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        title="Advance Status"
                      >
                        <span>Advance</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Audit Log Drawer Button */}
                      <button
                        onClick={() => setSelectedReqForTimeline(item)}
                        className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                        title="View Status Timeline & Audit Log"
                      >
                        <History className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-700">No Installation Assignments Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting 'ALL' in the pipeline filter above or search another serial number.</p>
          </div>
        )}
      </div>

      {/* ==============================================================================
          DIALOG 1 : ASSIGNMENT DIALOG (Sprint 5.2 Assignment Modal)
          ============================================================================== */}
      {selectedReqForAssign && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#0054A6] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <UserCheck className="w-6 h-6 text-cyan-200" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">Engineer & Crew Assignment Workflow</h3>
                  <p className="text-xs text-blue-200 font-mono">Invoice: {selectedReqForAssign.invoiceNumber} • SN: {selectedReqForAssign.serialNumber}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReqForAssign(null)} className="p-1.5 hover:bg-white/10 rounded-xl text-blue-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveAssignment} className="p-6 overflow-y-auto space-y-5 flex-1 font-sans">
              
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Instrument:</span>
                  <strong className="text-slate-900 font-bold">{selectedReqForAssign.instrumentName} ({selectedReqForAssign.model})</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Customer:</span>
                  <strong className="text-indigo-900 font-bold">{selectedReqForAssign.customerName}</strong>
                </div>
              </div>

              {/* Row 1: Engineer & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned Lead Engineer <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={assignForm.assignedEngineer}
                    onChange={e => setAssignForm(p => ({ ...p, assignedEngineer: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-bold text-indigo-950 focus:ring-2 focus:ring-[#0054A6]/20 focus:outline-none"
                  >
                    {AVAILABLE_ENGINEERS.map(eng => (
                      <option key={eng} value={eng}>{eng}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={assignForm.priority}
                    onChange={e => setAssignForm(p => ({ ...p, priority: e.target.value as any }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-black focus:ring-2 focus:ring-[#0054A6]/20 focus:outline-none text-[#0054A6]"
                  >
                    <option value="Normal">🟢 Normal</option>
                    <option value="Urgent">⚡ Urgent</option>
                    <option value="Critical">🚨 Critical</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Assigned Technicians (Multi Checkbox) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Assigned Technician(s) <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] font-mono text-indigo-600 font-normal">({assignForm.assignedTechnicians.length} selected)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 max-h-40 overflow-y-auto">
                  {AVAILABLE_TECHNICIANS.map(tech => {
                    const isChecked = assignForm.assignedTechnicians.includes(tech);
                    return (
                      <label key={tech} className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${isChecked ? 'bg-indigo-100/80 text-indigo-950 font-bold border border-indigo-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => toggleTechnician(tech)}
                          className="rounded text-[#0054A6] focus:ring-[#0054A6]"
                        />
                        <span className="truncate">{tech}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Dates & Territory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Installation Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={assignForm.targetInstallationDate}
                    onChange={e => setAssignForm(p => ({ ...p, targetInstallationDate: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-[#0054A6]/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Installation Territory
                  </label>
                  <input
                    type="text"
                    value={assignForm.installationTerritory}
                    onChange={e => setAssignForm(p => ({ ...p, installationTerritory: e.target.value }))}
                    placeholder="e.g. Western Metro District"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#0054A6]/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Assigned By & SLA Preview Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono uppercase">Assigned By (RBAC Rule):</span>
                  <strong className="text-slate-900 font-bold block mt-0.5">{simulatedRole} ({currentUser.name || 'System Staff'})</strong>
                  <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Authorized SOP Approver
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] font-mono uppercase">Calculated SLA Due Window:</span>
                  <strong className="text-indigo-950 font-mono font-black text-sm block mt-0.5">
                    {calculateSlaDueDate(selectedReqForAssign.deliveryDate, slaDaysSetting)}
                  </strong>
                  <span className="text-[10px] text-indigo-700 font-mono mt-0.5 block">
                    Base: {selectedReqForAssign.deliveryDate} + {slaDaysSetting} days setting
                  </span>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assignment Remarks & Special Tools Required
                </label>
                <textarea
                  rows={2}
                  value={assignForm.remarks}
                  onChange={e => setAssignForm(p => ({ ...p, remarks: e.target.value }))}
                  placeholder="e.g. Bring digital oscilloscope and UV calibration kit..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#0054A6]/20 focus:outline-none"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedReqForAssign(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0054A6] hover:bg-[#004385] text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Assignment & Dispatch</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==============================================================================
          DIALOG 2 : ADVANCE WORKFLOW STATUS POPUP
          ============================================================================== */}
      {selectedReqForAdvance && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-5 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <PlayCircle className="w-5 h-5 text-emerald-200" />
                <h3 className="text-sm font-black">Advance Workflow Milestone</h3>
              </div>
              <button onClick={() => setSelectedReqForAdvance(null)} className="p-1 hover:bg-white/10 rounded-lg text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdvance} className="p-6 space-y-4 font-sans">
              <div className="text-xs space-y-1">
                <span className="text-slate-500 block">Current Status: <strong className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono">{selectedReqForAdvance.status}</strong></span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Next Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={targetNextStatus}
                  onChange={e => setTargetNextStatus(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-emerald-400 bg-emerald-50/40 font-black text-emerald-950 focus:outline-none"
                >
                  {WORKFLOW_STATUS_PIPELINE.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Milestone Progress Notes / Findings
                </label>
                <textarea
                  rows={3}
                  value={advanceNotes}
                  onChange={e => setAdvanceNotes(e.target.value)}
                  placeholder="e.g. Arrived on site, verified power supply voltage..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-150">
                <button type="button" onClick={() => setSelectedReqForAdvance(null)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Update Stage</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================================
          DRAWER : STATUS TIMELINE & AUDIT LOG
          ============================================================================== */}
      {selectedReqForTimeline && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200">
            
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-black font-mono">Status Timeline & Audit Log</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Invoice: {selectedReqForTimeline.invoiceNumber} • SN: {selectedReqForTimeline.serialNumber}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReqForTimeline(null)} className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6 font-sans">
              
              {/* Assignment Summary Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <h4 className="text-xs font-black font-mono text-indigo-950 uppercase">Current Assignment Allocation</h4>
                {selectedReqForTimeline.assignment ? (
                  <div className="text-xs space-y-1 text-slate-700">
                    <p>👨‍🔧 Lead Engineer: <strong className="text-slate-900">{selectedReqForTimeline.assignment.assignedEngineer}</strong></p>
                    <p>🛠️ Technicians: <strong className="text-slate-900">{selectedReqForTimeline.assignment.assignedTechnicians.join(', ')}</strong></p>
                    <p>📅 Assigned On: <strong className="font-mono">{new Date(selectedReqForTimeline.assignment.assignmentDate).toLocaleString()}</strong> by {selectedReqForTimeline.assignment.assignedBy}</p>
                    <p>🎯 Target Date: <strong className="font-mono text-[#0054A6]">{selectedReqForTimeline.assignment.targetInstallationDate}</strong></p>
                  </div>
                ) : (
                  <p className="text-xs text-amber-700 font-medium">⚠️ No active assignment record. Click 'Assign' in the data grid.</p>
                )}
              </div>

              {/* Status Timeline Feed */}
              <div>
                <h4 className="text-xs font-black font-mono text-slate-500 uppercase tracking-wider mb-4">Chronological Lifecycle Events</h4>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {auditLogs.filter(l => l.requestId === selectedReqForTimeline.id).length > 0 ? (
                    auditLogs.filter(l => l.requestId === selectedReqForTimeline.id).reverse().map((log, idx) => (
                      <div key={log.id} className="relative">
                        <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${idx === 0 ? 'border-[#0054A6] text-[#0054A6]' : 'border-slate-300 text-slate-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#0054A6]' : 'bg-slate-300'}`} />
                        </div>

                        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900 font-mono">{log.action}</span>
                            <span className="text-[10px] font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px]">
                            {log.fromStatus && (
                              <>
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{log.fromStatus}</span>
                                <ChevronRight className="w-3 h-3 text-slate-400" />
                              </>
                            )}
                            <span className="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded font-mono font-bold">{log.toStatus}</span>
                          </div>

                          <p className="text-xs text-slate-600 pt-1 leading-relaxed">{log.notes}</p>

                          <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-100 mt-2">
                            <span>Performed by: <strong className="text-slate-700">{log.performedBy}</strong></span>
                            <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">{log.performedByRole}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic pl-2">No audit log entries found for this record yet.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==============================================================================
          MODAL : SYSTEM SLA CONFIG SETTING
          ============================================================================== */}
      {showSlaConfigModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 bg-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-indigo-300" />
                <h3 className="text-sm font-black font-mono">System SLA Config</h3>
              </div>
              <button onClick={() => setShowSlaConfigModal(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 font-sans">
              <p className="text-xs text-slate-600 leading-relaxed">
                Configure the baseline SLA calculation window. The system automatically computes the SLA Due Date by adding this integer to the equipment <strong className="underline">Delivery Date</strong>.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Default SLA Window (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={slaDaysSetting}
                  onChange={e => setSlaDaysSetting(parseInt(e.target.value) || 15)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 font-mono font-black text-[#0054A6] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-150">
                <button onClick={() => setShowSlaConfigModal(false)} className="px-5 py-2.5 bg-[#0054A6] hover:bg-[#004385] text-white rounded-xl text-xs font-black shadow-md cursor-pointer">
                  Save Setting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================================
          MODAL : SUPABASE SQL SCHEMA GENERATOR
          ============================================================================== */}
      {showSqlModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-black text-white font-mono">Sprint 5.2 – Supabase PostgreSQL DDL & RLS Policies</h3>
                  <p className="text-[11px] font-mono text-slate-400">Target Tables: installation_assignments, installation_assignment_audit_logs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SPRINT52_ASSIGNMENT_SQL);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 border border-slate-600 cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy DDL Script'}</span>
                </button>
                <button onClick={() => setShowSqlModal(false)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-950/60">
              <pre className="text-xs font-mono text-cyan-300 bg-slate-900 p-5 rounded-2xl border border-slate-800 overflow-x-auto leading-relaxed select-all">
                {SUPABASE_SPRINT52_ASSIGNMENT_SQL}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
