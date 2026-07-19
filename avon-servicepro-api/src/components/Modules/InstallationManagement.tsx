import React, { useState, useMemo } from 'react';
import { Installation, InstallationStatus, Customer, Instrument, UserProfile } from '../../types';
import { 
  Building2, 
  Calendar, 
  Check, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Wrench, 
  Layers, 
  Info, 
  Database,
  ArrowRight,
  ClipboardList,
  AlertTriangle,
  Play
} from 'lucide-react';

interface InstallationManagementProps {
  installations: Installation[];
  customers: Customer[];
  instruments: Instrument[];
  onAddInstallation: (newInst: Installation) => void;
  onUpdateInstallation: (updatedInst: Installation) => void;
  currentUser: UserProfile;
}

// 15 days in milliseconds
const SLA_MS = 15 * 24 * 60 * 60 * 1000;

export default function InstallationManagement({
  installations,
  customers,
  instruments,
  onAddInstallation,
  onUpdateInstallation,
  currentUser
}: InstallationManagementProps) {

  // Role play state for easy testing
  const [actingRole, setActingRole] = useState<'Documentation Officer' | 'Area Engineer' | 'Engineer'>(
    currentUser.role === 'Documentation Officer' ? 'Documentation Officer' : 
    (currentUser.role === 'Workshop Manager' || currentUser.role === 'DIRECTOR' ? 'Area Engineer' : 'Engineer')
  );

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedInst, setSelectedInst] = useState<Installation | null>(installations[0] || null);

  // Forms states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustId, setNewCustId] = useState('');
  const [newInstId, setNewInstId] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCustomInstrument, setNewCustomInstrument] = useState(false);
  const [instName, setInstName] = useState('');
  const [instSerial, setInstSerial] = useState('');
  const [instBrand, setInstBrand] = useState<'SHIMADZU' | 'THERMO SCIENTIFIC' | 'AGILENT' | 'EPPENDORF' | 'AVON SPEC'>('SHIMADZU');
  const [instModel, setInstModel] = useState('');

  // Engineering assignment staff
  const [assignStaffId, setAssignStaffId] = useState('usr-sbe-1');

  // Hardcoded staff list for assignment
  const AVAILABLE_STAFF = [
    { id: 'usr-sbe-1', name: 'Eng. Suresh Perera', role: 'Senior Biomedical Engineer' },
    { id: 'usr-ce-1', name: 'Eng. Nimani Senanayake', role: 'Calibration Engineer' },
    { id: 'usr-it-1', name: 'Trainee Keshara de Silva', role: 'Intern Technician' }
  ];

  // Engineering updates Checklist / Report
  const [unboxed, setUnboxed] = useState(false);
  const [safetyChecked, setSafetyChecked] = useState(false);
  const [calibrationVerified, setCalibrationVerified] = useState(false);
  const [userTrained, setUserTrained] = useState(false);
  const [reportNotes, setReportNotes] = useState('');

  // Warranty card dates
  const [warrantyStart, setWarrantyStart] = useState(new Date().toISOString().split('T')[0]);
  const [warrantyExpiry, setWarrantyExpiry] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Calculate dynamic SLA breaches for list
  const processedInstallations = useMemo(() => {
    return installations.map(inst => {
      if (inst.status === 'Completed') return inst;
      const createdDate = new Date(inst.createdAt).getTime();
      const elapsed = Date.now() - createdDate;
      if (elapsed > SLA_MS) {
        return { ...inst, status: 'Overdue' as InstallationStatus };
      }
      return inst;
    });
  }, [installations]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = processedInstallations.length;
    const pending = processedInstallations.filter(i => i.status === 'Pending').length;
    const assigned = processedInstallations.filter(i => i.status === 'Assigned').length;
    const inProgress = processedInstallations.filter(i => i.status === 'In Progress').length;
    const completed = processedInstallations.filter(i => i.status === 'Completed').length;
    const overdue = processedInstallations.filter(i => i.status === 'Overdue').length;

    // SLA Met is ratio of completed within SLA
    const compliancePct = total > 0 
      ? Math.round((completed / (total - pending)) * 100) || 100
      : 100;

    return { total, pending, assigned, inProgress, completed, overdue, compliancePct };
  }, [processedInstallations]);

  // Filter list
  const filteredInstallations = useMemo(() => {
    return processedInstallations.filter(inst => {
      const matchesSearch = 
        inst.installationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.instrumentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || inst.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [processedInstallations, searchTerm, statusFilter]);

  // Handle Create Installation order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustId || (!newInstId && !newCustomInstrument)) return;

    let targetCust = customers.find(c => c.id === newCustId);
    if (!targetCust && customers.length > 0) {
      targetCust = customers[0];
    }
    const customerName = targetCust ? targetCust.name : 'Unknown Lab Customer';

    let selectedInstName = instName;
    let selectedSerial = instSerial;
    let selectedBrand = instBrand;
    let selectedModel = instModel;
    let finalInstrumentId = newInstId;

    if (!newCustomInstrument) {
      const matchDbInst = instruments.find(i => i.id === newInstId);
      if (matchDbInst) {
        selectedInstName = matchDbInst.name;
        selectedSerial = matchDbInst.serialNumber;
        selectedBrand = matchDbInst.brand;
        selectedModel = matchDbInst.model;
        finalInstrumentId = matchDbInst.id;
      }
    } else {
      finalInstrumentId = `inst-new-${Date.now()}`;
    }

    const createdTime = new Date().toISOString();
    const deadlineTime = new Date(Date.now() + SLA_MS).toISOString();

    const newOrder: Installation = {
      id: `inst-id-${Date.now()}`,
      installationNumber: `INS-2026-${String(installations.length + 1).padStart(3, '0')}`,
      instrumentId: finalInstrumentId,
      instrumentName: selectedInstName,
      serialNumber: selectedSerial || 'PENDING_DELIVERY',
      customerId: newCustId,
      customerName: customerName,
      location: newLocation || 'Not Specified',
      status: 'Pending',
      createdAt: createdTime,
      slaDeadline: deadlineTime,
      createdById: currentUser.id,
      createdByName: currentUser.name,
      checklist: {
        unboxed: false,
        electricalSafetyChecked: false,
        calibrationVerified: false,
        userTrained: false
      },
      warrantyCardUpdated: false
    };

    onAddInstallation(newOrder);
    setSelectedInst(newOrder);
    
    // Reset fields
    setNewCustId('');
    setNewInstId('');
    setNewLocation('');
    setInstName('');
    setInstSerial('');
    setInstModel('');
    setNewCustomInstrument(false);
    setShowCreateModal(false);
  };

  // Handle Assign Field Staff
  const handleAssignStaffSubmit = () => {
    if (!selectedInst) return;
    const staff = AVAILABLE_STAFF.find(u => u.id === assignStaffId) || AVAILABLE_STAFF[0];
    
    const updated: Installation = {
      ...selectedInst,
      status: 'Assigned',
      assignedStaffId: staff.id,
      assignedStaffName: staff.name,
      assignedAt: new Date().toISOString(),
      assignedById: currentUser.id,
      assignedByName: currentUser.name
    };

    onUpdateInstallation(updated);
    setSelectedInst(updated);
  };

  // Handle Checklist change and save
  const handleCheckboxToggle = (key: 'unboxed' | 'electricalSafetyChecked' | 'calibrationVerified' | 'userTrained') => {
    if (!selectedInst) return;

    const currentChecklist = { ...selectedInst.checklist, [key]: !selectedInst.checklist[key] };
    
    // Determine status: if all checked status is Completed-pending-signoff or In Progress
    const allChecked = Object.values(currentChecklist).every(val => val === true);
    let statusText: InstallationStatus = 'In Progress';
    
    // Auto status progression
    if (selectedInst.status === 'Completed') {
      statusText = 'Completed';
    } else if (allChecked) {
      statusText = 'In Progress'; // needs Doc Officer warranty card update to reach Completed status!
    } else {
      statusText = 'In Progress';
    }

    const updated: Installation = {
      ...selectedInst,
      checklist: currentChecklist,
      status: statusText,
      reportNotes: reportNotes || selectedInst.reportNotes
    };

    onUpdateInstallation(updated);
    setSelectedInst(updated);
  };

  const handleReportNotesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInst) return;

    const updated: Installation = {
      ...selectedInst,
      reportNotes,
      status: 'In Progress',
      completedAt: new Date().toISOString(),
      completedById: currentUser.id,
      completedByName: currentUser.name
    };

    onUpdateInstallation(updated);
    setSelectedInst(updated);
  };

  const handleCompleteTechnicalFieldWork = () => {
    if (!selectedInst) return;

    // Check if checklist is solid
    const updated: Installation = {
      ...selectedInst,
      status: 'In Progress', // Waiting for Documentation officer to process Warranty paper cards!
      completedAt: new Date().toISOString(),
      completedById: currentUser.id,
      completedByName: currentUser.name,
      checklist: {
        unboxed: true,
        electricalSafetyChecked: true,
        calibrationVerified: true,
        userTrained: true
      },
      reportNotes: reportNotes || 'Installation certified and user training finished successfully.'
    };

    onUpdateInstallation(updated);
    setSelectedInst(updated);
  };

  // Handle Documentation Officer finalizes Warranty Card
  const handleFinalizeWarrantyCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInst) return;

    const updated: Installation = {
      ...selectedInst,
      status: 'Completed',
      warrantyCardUpdated: true,
      warrantyCardUpdatedById: currentUser.id,
      warrantyCardUpdatedBy: currentUser.name,
      warrantyCardUpdatedAt: new Date().toISOString(),
      warrantyStart,
      warrantyExpiry
    };

    onUpdateInstallation(updated);
    setSelectedInst(updated);
  };

  // Select an installation and auto-fill respective checklist state
  const selectInstallation = (inst: Installation) => {
    setSelectedInst(inst);
    setUnboxed(inst.checklist.unboxed);
    setSafetyChecked(inst.checklist.electricalSafetyChecked);
    setCalibrationVerified(inst.checklist.calibrationVerified);
    setUserTrained(inst.checklist.userTrained);
    setReportNotes(inst.reportNotes || '');
  };

  // Check SLA indicator color
  const getSLAIndicatorClass = (deadlineStr: string, completed: boolean) => {
    if (completed) return 'text-gray-400 bg-gray-50';
    const timeLeft = new Date(deadlineStr).getTime() - Date.now();
    if (timeLeft < 0) return 'text-rose-700 bg-rose-50 border-rose-100 animate-pulse';
    if (timeLeft < 3 * 2 * 12 * 600000) return 'text-amber-700 bg-amber-50 border-amber-100'; // within 3 days
    return 'text-emerald-700 bg-emerald-50 border-emerald-100';
  };

  const daysLeft = (deadlineStr: string) => {
    const timeLeft = new Date(deadlineStr).getTime() - Date.now();
    const days = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    return `${days} days left`;
  };

  return (
    <div className="space-y-6">

      {/* Role Play Navigation Header */}
      <div className="bg-[#003B75] text-white p-4 rounded-xl border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#00AEEF] p-2.5 rounded-lg text-slate-900 shadow-inner">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold tracking-tight uppercase font-mono text-[#00AEEF]">SLA Phase Tracker</h2>
                <span className="bg-[#0077C8] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-blue-100 leading-none">15 Days SLA Max</span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5 font-sans">Toggle role contexts below to simulate the exact field commissioning pipeline.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#002B55] rounded-lg border border-[#0077C8]/20">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-300 px-2">Act as:</span>
            {(['Documentation Officer', 'Area Engineer', 'Engineer'] as const).map(role => (
              <button
                key={role}
                onClick={() => setActingRole(role)}
                className={`px-3 py-1.5 rounded text-xs font-bold leading-tight font-sans transition-all cursor-pointer ${
                  actingRole === role 
                    ? 'bg-[#0077C8] text-white shadow-md' 
                    : 'text-blue-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow Breadcrumb Step Assistance */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-blue-900 text-center text-[10px] font-semibold text-blue-100 font-sans">
          <div className={`flex items-center justify-center gap-1.5 p-2 rounded ${actingRole === 'Documentation Officer' ? 'bg-[#0077C8]/20 text-white border-b-2 border-[#00AEEF]' : 'opacity-60'}`}>
            <span className="bg-[#00AEEF] text-[#003B75] w-4 h-4 rounded-full font-mono flex items-center justify-center font-bold">1</span>
            <span>Doc Officer: Create</span>
          </div>
          <div className={`flex items-center justify-center gap-1.5 p-2 rounded ${actingRole === 'Area Engineer' ? 'bg-[#0077C8]/20 text-white border-b-2 border-[#00AEEF]' : 'opacity-60'}`}>
            <span className="bg-blue-200 text-[#003B75] w-4 h-4 rounded-full font-mono flex items-center justify-center font-bold">2</span>
            <span>Area Eng: Assign Staff</span>
          </div>
          <div className={`flex items-center justify-center gap-1.5 p-2 rounded ${actingRole === 'Engineer' ? 'bg-[#0077C8]/20 text-white border-b-2 border-[#00AEEF]' : 'opacity-60'}`}>
            <span className="bg-blue-200 text-[#003B75] w-4 h-4 rounded-full font-mono flex items-center justify-center font-bold">3</span>
            <span>Engineer: Commission</span>
          </div>
          <div className={`flex items-center justify-center gap-1.5 p-2 rounded ${actingRole === 'Documentation Officer' ? 'bg-[#0077C8]/20 text-white border-b-2 border-[#00AEEF]' : 'opacity-60'}`}>
            <span className="bg-blue-200 text-[#003B75] w-4 h-4 rounded-full font-mono flex items-center justify-center font-bold">4</span>
            <span>Doc Officer: Warranty</span>
          </div>
        </div>
      </div>

      {/* KPI Counters Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div id="kpi-total-installations" className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-[#0077C8] rounded-lg">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-gray-400 font-extrabold tracking-widest block leading-none">TOTAL RECORDS</span>
            <span className="text-xl font-black text-gray-800 font-sans block mt-1">{stats.total}</span>
          </div>
        </div>

        <div id="kpi-pending-assignment" className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Wrench className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-gray-400 font-extrabold tracking-widest block leading-none">PENDING ASSIGN</span>
            <span className="text-xl font-black text-gray-800 font-sans block mt-1">{stats.pending}</span>
          </div>
        </div>

        <div id="kpi-active-commissioning" className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Clock className="w-5 h-5 font-bold" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-gray-400 font-extrabold tracking-widest block leading-none">IN COMMISSIONS</span>
            <span className="text-xl font-black text-gray-800 font-sans block mt-1">{stats.assigned + stats.inProgress}</span>
          </div>
        </div>

        <div id="kpi-overdue-sla" className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-gray-400 font-extrabold tracking-widest block leading-none">SLA OVERDUE</span>
            <span className="text-xl font-black text-red-600 font-sans block mt-1">{stats.overdue}</span>
          </div>
        </div>

        <div id="kpi-sla-efficiency" className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-gray-400 font-extrabold tracking-widest block leading-none">SLA COMPLIANCE</span>
            <span className="text-xl font-black text-emerald-700 font-sans block mt-1">{stats.compliancePct}%</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column Left: Installation Records Listing */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-120 shadow-xs flex flex-col h-[650px] overflow-hidden">
          
          {/* List Search & Filter Header bar */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono text-gray-500 uppercase tracking-widest">Installations Registry</h3>
              {actingRole === 'Documentation Officer' && (
                <button
                  id="btn-create-installation-modal"
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#0077C8] hover:bg-[#0054A6] text-white px-2 py-1.5 rounded-lg text-xs font-bold leading-none flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> New Order
                </button>
              )}
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                id="searchbar-installations"
                type="text"
                placeholder="Search number, client, instrument..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 bg-white border border-gray-250 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0077C8]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2 py-1 text-[10px] font-bold rounded-md whitespace-nowrap cursor-pointer transition-all ${
                  statusFilter === 'ALL' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                All ({processedInstallations.length})
              </button>
              {(['Pending', 'Assigned', 'In Progress', 'Completed', 'Overdue'] as const).map(status => {
                const count = processedInstallations.filter(i => i.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md whitespace-nowrap cursor-pointer transition-all ${
                      statusFilter === status 
                        ? 'bg-[#0054A6] text-white' 
                        : 'bg-gray-100 text-gray-550 hover:bg-gray-200'
                    }`}
                  >
                    {status} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Records List Container */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 divide-dashed">
            {filteredInstallations.length > 0 ? (
              filteredInstallations.map(inst => {
                const isSelected = selectedInst?.id === inst.id;
                const statusColor = 
                  inst.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  inst.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                  inst.status === 'Assigned' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                  inst.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-rose-50 text-rose-700 border-rose-100';

                return (
                  <div
                    key={inst.id}
                    onClick={() => selectInstallation(inst)}
                    className={`p-3.5 text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50/40 border-l-4 border-[#0077C8]' 
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-mono text-[11px] font-black text-gray-800">{inst.installationNumber}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${statusColor}`}>
                        {inst.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-800 truncate mt-1.5">{inst.instrumentName}</h4>
                    
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1">
                      <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="truncate">{inst.customerName}</span>
                    </div>

                    {/* Timeline & SLA Warning progress */}
                    <div className="flex justify-between items-center text-[10px] mt-2 pt-2 border-t border-gray-100">
                      <span className="text-gray-400">{new Date(inst.createdAt).toLocaleDateString()}</span>
                      <span className={`font-mono font-semibold px-2 py-0.5 rounded text-[9px] border ${getSLAIndicatorClass(inst.slaDeadline, inst.status === 'Completed')}`}>
                        {inst.status === 'Completed' ? 'SLA Satisfied' : daysLeft(inst.slaDeadline)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-400 font-sans text-xs">
                <Database className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                No matching installation records.
              </div>
            )}
          </div>
        </div>

        {/* Column Right (span 2): Detailed workflow tracking and Interactive Action panels */}
        <div className="lg:col-span-2 space-y-6">
          {selectedInst ? (
            <div className="bg-white rounded-xl border border-gray-120 shadow-xs overflow-hidden flex flex-col min-h-[650px]">
              
              {/* Detailed Header Info */}
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-[#0054A6] bg-blue-105/50 px-2 py-0.5 rounded">
                        {selectedInst.installationNumber}
                      </span>
                      <span className="text-xs text-gray-400">• Created on {new Date(selectedInst.createdAt).toLocaleString()}</span>
                    </div>
                    <h2 className="text-base font-extrabold text-gray-800 mt-1">{selectedInst.instrumentName}</h2>
                    <p className="text-xs text-gray-500 font-sans mt-0.5">{selectedInst.customerName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] tracking-widest font-mono uppercase text-gray-400 font-bold block">COMMISSION STATUS</span>
                    <span className={`inline-block mt-1 font-sans text-xs font-black px-3 py-1 rounded-full border ${
                      selectedInst.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      selectedInst.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      selectedInst.status === 'Assigned' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      selectedInst.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {selectedInst.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Central Information Grid */}
              <div className="p-5- grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                
                {/* 1. Device Core Specs */}
                <div className="p-4 space-y-2">
                  <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">DEVICE DETAILS</h4>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-mono">SERIAL NUMBER</span>
                    <span className="text-xs font-extrabold text-gray-800 font-mono">{selectedInst.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">DESTINATION DEP / ROOM</span>
                    <span className="text-xs font-semibold text-gray-700">{selectedInst.location}</span>
                  </div>
                </div>

                {/* 2. Staff Assigns */}
                <div className="p-4 space-y-2">
                  <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">ASSIGNMENT MATRIX</h4>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-mono">ASSIGNED FIELD STAFF:</span>
                    {selectedInst.assignedStaffName ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0054A6] text-[9px] uppercase font-bold flex items-center justify-center font-sans">
                          {selectedInst.assignedStaffName.slice(0, 2)}
                        </span>
                        <span className="text-xs font-extrabold text-gray-800">{selectedInst.assignedStaffName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-rose-600 block font-bold leading-tight mt-0.5">⚠️ Crew Unassigned</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">SLA COMMISSIONING DEADLINE</span>
                    <span className="text-xs font-semibold text-gray-700 block mt-0.5">
                      📅 {new Date(selectedInst.slaDeadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* 3. Warranty Status */}
                <div className="p-4 space-y-2">
                  <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">WARRANTY CARD STATUS</h4>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-mono">DIGITAL REGISTRATION:</span>
                    {selectedInst.warrantyCardUpdated ? (
                      <span className="text-xs font-black text-emerald-600 flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /> Warranty Activated
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 block font-bold mt-0.5">⏳ Awaiting Verification</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">SLA COUNTDOWN</span>
                    <span className={`inline-block text-[11px] font-mono font-black mt-0.5 px-2 py-0.5 rounded ${
                      selectedInst.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                      new Date(selectedInst.slaDeadline).getTime() - Date.now() < 0 ? 'bg-rose-50 text-rose-700 text-rose-600' : 'bg-amber-50 text-amber-700 text-amber-600'
                    }`}>
                      {selectedInst.status === 'Completed' ? 'SLA TARGET SATISFIED' : daysLeft(selectedInst.slaDeadline).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: Interactive Action Wizard depending on ACTING ROLE */}
              <div className="flex-1 bg-gray-50/50 p-5 border-t border-b border-gray-100 flex flex-col justify-center">

                {/* IF STATUS IS COMPLETED */}
                {selectedInst.status === 'Completed' ? (
                  <div className="bg-emerald-50/40 p-6 rounded-xl border border-emerald-100 border-dashed text-center max-w-xl mx-auto space-y-3 shadow-inner">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <div>
                      <h4 className="text-sm font-black text-emerald-800">Installation Order Successfully Closed</h4>
                      <p className="text-xs text-emerald-600 mt-1 font-sans">All technical checklist items have been verified and signed off. The digital warranty card was registered and activated in the database on {new Date(selectedInst.warrantyCardUpdatedAt || '').toLocaleDateString()}.</p>
                    </div>
                    <div className="text-left text-xs bg-white p-3.5 rounded-lg border border-emerald-100 space-y-2 mt-3 font-sans">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Commissioned By:</span>
                        <span className="font-extrabold text-slate-800">{selectedInst.completedByName || 'Service Engineer'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Warranty Card Processor:</span>
                        <span className="font-extrabold text-slate-800">{selectedInst.warrantyCardUpdatedBy || 'Documentation Officer'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Warranty Start:</span>
                        <span className="font-mono font-bold text-[#0054A6]">{selectedInst.warrantyStart || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Warranty Expiry (12-Mo SLA):</span>
                        <span className="font-mono font-bold text-rose-600">{selectedInst.warrantyExpiry || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* STEP 1 & 4 ACTION PANEL: If we are acting as Documentation Officer */}
                    {actingRole === 'Documentation Officer' && (
                      <div className="space-y-4 max-w-lg mx-auto w-full">
                        
                        {/* CASE A: Order is Pending, awaiting Area Engineer Staff Assignment */}
                        {selectedInst.status === 'Pending' && (
                          <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 flex gap-3 text-left">
                            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-xs font-black text-amber-800 uppercase tracking-wide">AWAITING ENGINEERING ASSIGNMENT</h5>
                              <p className="text-xs text-amber-700 font-sans mt-0.5">Documentation Officer has successfully submitted this entry. The Area Engineer must now designate a fieldwork crew or Biomedical Technician to inspect and unbox this equipment.</p>
                              
                              <button
                                onClick={() => setActingRole('Area Engineer')}
                                className="mt-3 bg-[#0054A6] text-white px-3 py-1.5 rounded text-xs font-bold font-sans flex items-center gap-1 cursor-pointer"
                              >
                                Act as Area Engineer to Assign <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* CASE B: Order is assigned or in progress but NOT completed checklist yet */}
                        {(selectedInst.status === 'Assigned' || selectedInst.status === 'In Progress' || selectedInst.status === 'Overdue') && !Object.values(selectedInst.checklist).every(x => x === true) && (
                          <div className="bg-blue-50/80 p-5 rounded-xl border border-blue-100 flex gap-3 text-left">
                            <Wrench className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-xs font-black text-blue-800 uppercase tracking-wide">FIELD COMMISSIONING IN PROGRESS</h5>
                              <p className="text-xs text-blue-700 font-sans mt-0.5">The assigned field personnel ({selectedInst.assignedStaffName || 'Biomedical Engineer'}) is currently implementing and verifying the unboxing, calibration and safety operations checklist.</p>
                              
                              <button
                                onClick={() => setActingRole('Engineer')}
                                className="mt-3 bg-[#0077C8] text-white px-3 py-1.5 rounded text-xs font-bold font-sans flex items-center gap-1 cursor-pointer"
                              >
                                Act as Field Engineer to update checklist <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* CASE C: Technical is finished, Doc Officer MUST finalize warranty card! */}
                        {/* We allow Doc Officer to sign off even if checklist is in-progress for simulated agility, but remind them! */}
                        {((selectedInst.status === 'In Progress' || selectedInst.status === 'Assigned' || selectedInst.status === 'Overdue')) && (
                          <form onSubmit={handleFinalizeWarrantyCard} className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 text-indigo-700 pb-1.5 border-b">
                              <ShieldCheck className="w-5 h-5 text-indigo-600" />
                              <h4 className="text-xs font-black uppercase tracking-wider">Step 4: Update Digital Warranty Card</h4>
                            </div>

                            <p className="text-xs text-gray-500 font-sans leading-relaxed">
                              As the **Documentation Officer**, finalize the paperless warranty card metrics inside the systems database. This activates client support levels.
                            </p>

                            {!Object.values(selectedInst.checklist).every(v => v === true) && (
                              <div className="p-3 bg-amber-50 text-amber-700 text-xs rounded border border-amber-100">
                                ⚠️ **SLA Workflow warning**: Technical checklist has not been completed by the engineer yet. Usually done postpartum field-signoff, but you can bypass to demonstrate final state.
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1">WARRANTY START DATE</label>
                                <input
                                  type="date"
                                  value={warrantyStart}
                                  onChange={(e) => {
                                    setWarrantyStart(e.target.value);
                                    // auto calculate expiry as +1 year
                                    if (e.target.value) {
                                      const d = new Date(e.target.value);
                                      d.setFullYear(d.getFullYear() + 1);
                                      setWarrantyExpiry(d.toISOString().split('T')[0]);
                                    }
                                  }}
                                  className="w-full text-xs p-2 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#0077C8]"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1">WARRANTY EXPIRY DATE</label>
                                <input
                                  type="date"
                                  value={warrantyExpiry}
                                  onChange={(e) => setWarrantyExpiry(e.target.value)}
                                  className="w-full text-xs p-2 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#0077C8]"
                                />
                              </div>
                            </div>

                            <button
                              id="btn-finalize-warranty"
                              type="submit"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                            >
                              <Check className="w-4 h-4" /> Finalize Warranty Card & Close Ticket
                            </button>
                          </form>
                        )}

                      </div>
                    )}

                    {/* STEP 2 ACTION PANEL: If we are acting as Area Engineer */}
                    {actingRole === 'Area Engineer' && (
                      <div className="space-y-4 max-w-lg mx-auto w-full">
                        
                        {/* Case A: Already Assigned staff, details shown */}
                        {selectedInst.status !== 'Pending' && (
                          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 text-left space-y-3">
                            <div className="flex items-center gap-2 text-[#0054A6]">
                              <UserCheck className="w-5 h-5" />
                              <h5 className="text-xs font-black uppercase tracking-wide">STAFF ASSIGNED</h5>
                            </div>
                            <p className="text-xs text-blue-700 font-sans leading-relaxed">
                              Representative **{selectedInst.assignedStaffName}** was allocated by Area Engineer ({selectedInst.assignedByName}) to undertake this field installation. Reassign different staff below if required.
                            </p>
                          </div>
                        )}

                        {/* Assign Crew Form */}
                        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm space-y-4">
                          <div className="flex items-center gap-2 text-[#0054A6] pb-1.5 border-b">
                            <Users className="w-5 h-5 text-[#0054A6]" />
                            <h4 className="text-xs font-black uppercase tracking-wider">Step 2: Assign Field Installation Staff</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-sans leading-relaxed">
                            As the **Area Engineer**, designate a certified Biomedical Engineer or field technician to do physical client-site unboxing and calibration checks.
                          </p>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-gray-400 block">SELECT FIELD TECHNICIAN</label>
                            <select
                              id="select-assignee-staff"
                              value={assignStaffId}
                              onChange={(e) => setAssignStaffId(e.target.value)}
                              className="w-full text-xs p-2.5 bg-white border border-gray-250 rounded focus:outline-none focus:border-[#0077C8]"
                            >
                              {AVAILABLE_STAFF.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                              ))}
                            </select>
                          </div>

                          <button
                            id="btn-assign-staff-submit"
                            type="button"
                            onClick={handleAssignStaffSubmit}
                            className="w-full bg-[#0054A6] hover:bg-[#003B75] text-white p-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                          >
                            <UserCheck className="w-4 h-4" /> {selectedInst.status === 'Pending' ? 'Authorize & Dispatch Staff' : 'Reassign & Dispatch Staff'}
                          </button>
                        </div>

                      </div>
                    )}

                    {/* STEP 3 ACTION PANEL: If we are acting as Engineer */}
                    {actingRole === 'Engineer' && (
                      <div className="space-y-4 max-w-lg mx-auto w-full">
                        
                        {/* Warning if crew not assigned first */}
                        {!selectedInst.assignedStaffId && (
                          <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 flex gap-2.5 text-left mb-3">
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <div className="text-xs text-rose-700">
                              <span className="font-bold block">No Dispatched Crew Assigned Yet</span>
                              Please switchacting role to **Area Engineer** first or bypass below by self-dispatching to proceed testing!
                              <button
                                onClick={() => {
                                  // Auto dispatch Suresh Perera
                                  const updated: Installation = {
                                    ...selectedInst,
                                    status: 'Assigned',
                                    assignedStaffId: 'usr-sbe-1',
                                    assignedStaffName: 'Eng. Suresh Perera',
                                    assignedAt: new Date().toISOString()
                                  };
                                  onUpdateInstallation(updated);
                                  setSelectedInst(updated);
                                }}
                                className="block mt-2 font-black underline hover:text-rose-900 cursor-pointer"
                              >
                                Quick Auto-Dispatch to act as Suresh Perera
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm space-y-4">
                          <div className="flex items-center gap-2 text-indigo-700 pb-1.5 border-b">
                            <ClipboardList className="w-5 h-5 text-indigo-600" />
                            <h4 className="text-xs font-black uppercase tracking-wider">Step 3: Field Verification & Commissioning checklist</h4>
                          </div>

                          <p className="text-xs text-gray-500 font-sans leading-relaxed">
                            Acting as **{selectedInst.assignedStaffName || 'Assigned Engineer'}**. Carry out the physical on-lab installation criteria and tick off each milestone below as verified.
                          </p>

                          {/* Precise interactive Checklist boxes */}
                          <div className="space-y-2 border border-gray-100 p-3.5 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                              <span>Commissioning Checklist</span>
                              <span className="text-[10px] text-[#0077C8] font-mono">
                                {Object.values(selectedInst.checklist).filter(v => v).length} / 4 Completed
                              </span>
                            </div>

                            <div className="mt-2.5 space-y-2">
                              <label className="flex items-center gap-3 p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedInst.checklist.unboxed}
                                  onChange={() => handleCheckboxToggle('unboxed')}
                                  className="w-4 h-4 accent-[#0077C8]"
                                />
                                <div className="text-left text-xs">
                                  <span className="font-bold block text-gray-800">1. Physical Unboxing & Alignment</span>
                                  <span className="text-[10px] text-gray-400 font-sans block leading-none">Unpacked crate and leveled equipment on solid vibration dampening table.</span>
                                </div>
                              </label>

                              <label className="flex items-center gap-3 p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedInst.checklist.electricalSafetyChecked}
                                  onChange={() => handleCheckboxToggle('electricalSafetyChecked')}
                                  className="w-4 h-4 accent-[#0077C8]"
                                />
                                <div className="text-left text-xs">
                                  <span className="font-bold block text-gray-800">2. Electrical Safety & Vacuum Checks</span>
                                  <span className="text-[10px] text-gray-400 font-sans block leading-none">Verified voltage load stabilizer and grounded core chassis plugs.</span>
                                </div>
                              </label>

                              <label className="flex items-center gap-3 p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedInst.checklist.calibrationVerified}
                                  onChange={() => handleCheckboxToggle('calibrationVerified')}
                                  className="w-4 h-4 accent-[#0077C8]"
                                />
                                <div className="text-left text-xs">
                                  <span className="font-bold block text-gray-800">3. First-Run Metrology Calibrations</span>
                                  <span className="text-[10px] text-gray-400 font-sans block leading-none">Conducted standard reference checks with certified NIST chemical standards.</span>
                                </div>
                              </label>

                              <label className="flex items-center gap-3 p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedInst.checklist.userTrained}
                                  onChange={() => handleCheckboxToggle('userTrained')}
                                  className="w-4 h-4 accent-[#0077C8]"
                                />
                                <div className="text-left text-xs">
                                  <span className="font-bold block text-gray-800">4. Customer Operator Training</span>
                                  <span className="text-[10px] text-gray-400 font-sans block leading-none">Passed standard operations handling course to designated lab technician.</span>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Technical Notes */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-gray-400 block">COMMISSIONING FIELD REPORT</label>
                            <textarea
                              rows={2}
                              value={reportNotes}
                              onChange={(e) => setReportNotes(e.target.value)}
                              placeholder="Enter metrology readings, chemical reference checks details..."
                              className="w-full text-xs p-2 bg-white border border-gray-250 rounded focus:outline-none focus:border-[#0077C8] placeholder-gray-400"
                            />
                          </div>

                          <div className="flex gap-2.5">
                            <button
                              type="button"
                              onClick={handleCompleteTechnicalFieldWork}
                              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 shadow transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Quick Complete technical Work
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                handleReportNotesSubmit(e);
                                alert('Progress saved successfully');
                              }}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            >
                              Save Draft Notes
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </>
                )}

              </div>

              {/* Bottom: Logs & Checklist compliance meter */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/20 text-xs font-sans text-gray-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-gray-400">STEPS PROGRESSION:</span>
                    <div className="flex gap-1.5">
                      <span className={`w-3 h-3 rounded-full ${selectedInst.status === 'Pending' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                      <span className={`w-3 h-3 rounded-full ${selectedInst.status === 'Pending' ? 'bg-gray-200' : (selectedInst.status === 'Assigned' ? 'bg-blue-400 animate-pulse' : 'bg-emerald-500')}`} />
                      <span className={`w-3 h-3 rounded-full ${['Pending', 'Assigned'].includes(selectedInst.status) ? 'bg-gray-200' : (selectedInst.status === 'In Progress' ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500')}`} />
                      <span className={`w-3 h-3 rounded-full ${selectedInst.status === 'Completed' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span>Opened: <b>{new Date(selectedInst.createdAt).toLocaleDateString()}</b></span>
                    {selectedInst.completedAt && (
                      <span>Field Commissioned: <b>{new Date(selectedInst.completedAt).toLocaleDateString()}</b></span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-120 shadow-xs flex flex-col justify-center items-center h-[650px] text-gray-400">
              <Database className="w-10 h-10 text-gray-300 animate-bounce" />
              <h4 className="font-extrabold text-sm text-gray-700 mt-3 font-sans">No Records Selected</h4>
              <p className="text-xs text-gray-400 font-sans mt-0.5">Pick an item from the left tracking list or click 'New Order'.</p>
            </div>
          )}
        </div>

      </div>

      {/* CREATE INSTALLATION PROVISIONING MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#002B55]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-slide-up">
            
            <div className="bg-[#003B75] text-white p-4.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#00AEEF]" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono">Commission New Installation Order</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-200 hover:text-white font-black text-xs p-1 hover:bg-white/10 rounded cursor-pointer font-sans"
              >
                ✕ CLOSE
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5.5 space-y-4 text-left">
              
              {/* Selecting Customer */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">1. Destination Client Lab Facility</label>
                <select
                  id="select-creation-customer"
                  required
                  value={newCustId}
                  onChange={(e) => setNewCustId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-gray-250 rounded focus:outline-none focus:border-[#0077C8]"
                >
                  <option value="">-- Choose registered customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.labType})</option>
                  ))}
                </select>
              </div>

              {/* Toggle new vs existing instrument */}
              <div className="flex items-center justify-between pb-1 border-b">
                <span className="text-xs text-gray-500 font-sans">Is this a brand new shipped instrument entry?</span>
                <label className="flex items-center gap-1 text-xs font-bold text-[#0054A6] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCustomInstrument}
                    onChange={() => setNewCustomInstrument(!newCustomInstrument)}
                    className="accent-[#0077C8] w-3.5 h-3.5"
                  />
                  <span>Register manually in modal</span>
                </label>
              </div>

              {newCustomInstrument ? (
                <div className="p-3 bg-gray-50 rounded border border-gray-150 space-y-3.5">
                  <span className="text-[10px] font-mono font-bold text-gray-400 block -mb-1">INSTRUMENT SPECS</span>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-gray-500">INSTRUMENT NAME</label>
                      <input
                        type="text"
                        required
                        value={instName}
                        onChange={(e) => setInstName(e.target.value)}
                        placeholder="e.g. UV-2600i Spectrophoto"
                        className="w-full text-xs p-2 bg-white border border-gray-250 rounded focus:outline-none focus:border-[#0077C8]"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-gray-500">SERIAL NUMBER</label>
                      <input
                        type="text"
                        required
                        value={instSerial}
                        onChange={(e) => setInstSerial(e.target.value)}
                        placeholder="e.g. SN-991822-SL"
                        className="w-full text-xs p-2 bg-white border border-gray-250 rounded focus:outline-none focus:border-[#0077C8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-gray-500">BRAND / OEM</label>
                      <select
                        value={instBrand}
                        onChange={(e: any) => setInstBrand(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-gray-250 rounded focus:outline-none focus:border-[#0077C8]"
                      >
                        <option value="SHIMADZU">SHIMADZU</option>
                        <option value="THERMO SCIENTIFIC">THERMO SCIENTIFIC</option>
                        <option value="AGILENT">AGILENT</option>
                        <option value="EPPENDORF">EPPENDORF</option>
                        <option value="AVON SPEC">AVON SPEC</option>
                      </select>
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-gray-500">MODEL CODE</label>
                      <input
                        type="text"
                        required
                        value={instModel}
                        onChange={(e) => setInstModel(e.target.value)}
                        placeholder="e.g. Model QP-2020"
                        className="w-full text-xs p-2 bg-white border border-gray-250 rounded focus:outline-none focus:border-[#0077C8]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">2. Select Dispatched Machine Asset</label>
                  <select
                    id="select-creation-instrument"
                    required
                    value={newInstId}
                    onChange={(e) => setNewInstId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-250 rounded focus:outline-none focus:border-[#0077C8]"
                  >
                    <option value="">-- Choose instrument asset --</option>
                    {instruments.map(i => (
                      <option key={i.id} value={i.id}>{i.name} ({i.serialNumber})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Physical Lab Placement location */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">3. Customer Facility Lab Room Location</label>
                <input
                  id="input-creation-location"
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Virology Lab, Annex Building, 1st Floor"
                  className="w-full text-xs p-2.5 bg-white border border-gray-250 rounded focus:outline-none focus:border-[#0077C8] placeholder-gray-400"
                />
              </div>

              <div className="flex gap-3 pt-3.5 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 p-2.5 rounded-lg text-xs font-bold hover:bg-gray-105 cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  id="btn-creation-submit"
                  type="submit"
                  className="flex-1 bg-[#0077C8] hover:bg-[#0054A6] text-white p-2.5 rounded-lg text-xs font-extrabold shadow transition-all cursor-pointer text-center"
                >
                  Schedule Dispatch Order
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
