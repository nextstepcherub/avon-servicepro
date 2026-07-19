import React, { useState } from 'react';
import {
  WarrantyRecord,
  PreventiveMaintenanceSchedule,
  WarrantyNotification,
  WarrantyAuditLog,
  WarrantyActivationExecutionPayload,
  WarrantyActivationEngineResult,
  ServiceIntervalOption
} from '../../types';
import {
  ShieldCheck,
  Calendar,
  Clock,
  Wrench,
  CheckCircle2,
  Bell,
  History,
  Play,
  Layers,
  Building2,
  User,
  Tag,
  Hash,
  RefreshCw,
  Cpu,
  Sparkles,
  ArrowRight,
  Database,
  Check,
  AlertCircle
} from 'lucide-react';

// ==========================================
// PURE UTILITY FUNCTIONS & WORKFLOW ENGINE
// ==========================================

/**
 * Calculates the exact warranty end date by adding months to the start date string (YYYY-MM-DD)
 */
export function calculateWarrantyEndDate(startDateStr: string, periodMonths: number): string {
  const [year, month, day] = startDateStr.split('-').map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return new Date().toISOString().split('T')[0];
  }
  const date = new Date(year, month - 1 + periodMonths, day);
  return date.toISOString().split('T')[0];
}

/**
 * Generates Preventive Maintenance schedules based on the service interval rule
 */
export function generatePMSchedules(
  warrantyCardNo: string,
  installationNo: string,
  customerName: string,
  instrumentName: string,
  assetNo: string,
  startDateStr: string,
  interval: ServiceIntervalOption,
  assignedEngineer: string,
  warrantyPeriodMonths: number = 12
): PreventiveMaintenanceSchedule[] {
  if (interval === 'No PM') {
    return [];
  }

  const intervalMonths = interval === '6 Months' ? 6 : 12;
  const numSchedules = Math.floor(warrantyPeriodMonths / intervalMonths);
  const schedules: PreventiveMaintenanceSchedule[] = [];

  for (let i = 1; i <= numSchedules; i++) {
    const scheduledDate = calculateWarrantyEndDate(startDateStr, intervalMonths * i);
    schedules.push({
      id: `pm-sch-${Date.now()}-${i}`,
      pmNumber: `PM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      warrantyCardNumber: warrantyCardNo,
      installationNumber: installationNo,
      customerName,
      instrumentName,
      assetNumber: assetNo,
      serviceInterval: interval,
      scheduledDate,
      status: 'Scheduled',
      assignedAreaEngineer: assignedEngineer,
      createdAt: new Date().toISOString()
    });
  }

  return schedules;
}

/**
 * Core Automated Workflow Engine: Executes all 6 required automated steps upon QA Approval
 */
export function executeWarrantyActivation(
  payload: WarrantyActivationExecutionPayload
): WarrantyActivationEngineResult {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const periodMonths = payload.warrantyPeriodMonths || 12;
  const endDate = calculateWarrantyEndDate(payload.warrantyStartDate, periodMonths);

  // STEP 1 & 2: Update status to Installed & Create Warranty Record
  const warrantyRecord: WarrantyRecord = {
    id: `wrec-${Date.now()}`,
    installationNumber: payload.installationNumber,
    warrantyCardNumber: payload.warrantyCardNumber,
    jobSheetNumber: payload.jobSheetNumber,
    customerName: payload.customerName,
    department: payload.department,
    instrumentName: payload.instrumentName,
    serialNumber: payload.serialNumber,
    assetNumber: payload.assetNumber,
    warrantyStartDate: payload.warrantyStartDate,
    warrantyEndDate: endDate,
    warrantyPeriodMonths: periodMonths,
    serviceInterval: payload.serviceInterval,
    status: 'Active',
    activatedBy: payload.approverName,
    activatedAt: timestamp
  };

  // STEP 3 & 4: Generate Preventive Maintenance & Scheduled Service Entries
  const pmSchedules = generatePMSchedules(
    payload.warrantyCardNumber,
    payload.installationNumber,
    payload.customerName,
    payload.instrumentName,
    payload.assetNumber,
    payload.warrantyStartDate,
    payload.serviceInterval,
    payload.assignedAreaEngineer,
    periodMonths
  );

  // STEP 5: Create Notifications for Area Engineer & Documentation Officer
  const nextServiceDate = pmSchedules.length > 0 ? pmSchedules[0].scheduledDate : 'N/A (No PM Configured)';
  const notifications: WarrantyNotification[] = [
    {
      id: `notif-eng-${Date.now()}`,
      recipientRole: 'Area Engineer',
      recipientName: payload.assignedAreaEngineer,
      title: 'New Warranty Service Scheduled',
      message: `Instrument ${payload.assetNumber} (${payload.instrumentName}) commissioned at ${payload.customerName}. Status: Installed. Next PM Date: ${nextServiceDate}.`,
      timestamp,
      read: false,
      severity: 'info'
    },
    {
      id: `notif-doc-${Date.now()}`,
      recipientRole: 'Documentation Officer',
      recipientName: payload.approverName,
      title: 'Warranty Activation Completed',
      message: `Warranty Card ${payload.warrantyCardNumber} formally activated. Instrument status updated to Installed. ${pmSchedules.length} PM service cycle(s) provisioned.`,
      timestamp,
      read: false,
      severity: 'success'
    }
  ];

  // STEP 6: Create Immutable Audit Logs
  const auditLogs: WarrantyAuditLog[] = [
    {
      id: `waud-1-${Date.now()}`,
      referenceNumber: payload.warrantyCardNumber,
      action: 'Instrument Status Updated',
      performedBy: 'Automated Lifecycle Daemon',
      performedByRole: 'System Engine',
      timestamp,
      details: `Instrument asset ${payload.assetNumber} advanced from Commissioning to INSTALLED.`
    },
    {
      id: `waud-2-${Date.now()}`,
      referenceNumber: payload.warrantyCardNumber,
      action: 'Warranty Activated',
      performedBy: payload.approverName,
      performedByRole: payload.approverRole,
      timestamp,
      details: `Active Warranty generated (${payload.warrantyStartDate} to ${endDate}). Period: ${periodMonths} Months.`
    }
  ];

  if (pmSchedules.length > 0) {
    auditLogs.push({
      id: `waud-3-${Date.now()}`,
      referenceNumber: payload.warrantyCardNumber,
      action: 'PM Created',
      performedBy: 'PM Scheduler Daemon',
      performedByRole: 'Workflow Engine',
      timestamp,
      details: `Generated ${pmSchedules.length} Preventive Maintenance schedule(s) based on ${payload.serviceInterval} cadence.`
    });
    auditLogs.push({
      id: `waud-4-${Date.now()}`,
      referenceNumber: pmSchedules[0].pmNumber,
      action: 'Warranty Service Scheduled',
      performedBy: 'Dispatch Coordinator Engine',
      performedByRole: 'Workflow Engine',
      timestamp,
      details: `Assigned initial PM service ticket to ${payload.assignedAreaEngineer}. Target Date: ${pmSchedules[0].scheduledDate}.`
    });
  }

  return {
    updatedInstrumentStatus: 'Installed',
    warrantyRecord,
    pmSchedules,
    notifications,
    auditLogs
  };
}

// ==========================================
// REACT UI SIMULATION & MONITORING COMPONENT
// ==========================================

const SAMPLE_PAYLOAD: WarrantyActivationExecutionPayload = {
  installationNumber: 'INST-2026-0492',
  jobSheetNumber: 'JS-88219',
  customerName: 'Metro Central General Hospital',
  department: 'Advanced Clinical Pathology & Hematology',
  instrumentName: 'Sysmex XN-3000 Automated Hematology Analyzer',
  brand: 'Sysmex',
  model: 'XN-3000 Dual Module',
  serialNumber: 'SXN-9948210-PRO',
  assetNumber: 'AST-MED-2026-8841',
  warrantyCardNumber: 'WC-AVN-2026-8941',
  warrantyStartDate: new Date().toISOString().split('T')[0],
  warrantyPeriodMonths: 12,
  serviceInterval: '6 Months',
  assignedAreaEngineer: 'Eng. Marcus Vance (Area Specialist)',
  approverName: 'Samantha Cole',
  approverRole: 'Senior Documentation Officer'
};

export const WarrantyActivationEngine: React.FC = () => {
  const [inputConfig, setInputConfig] = useState<WarrantyActivationExecutionPayload>(SAMPLE_PAYLOAD);
  const [engineResult, setEngineResult] = useState<WarrantyActivationEngineResult | null>(() => executeWarrantyActivation(SAMPLE_PAYLOAD));
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'pm' | 'notif' | 'audit'>('overview');

  const handleRunEngine = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = executeWarrantyActivation(inputConfig);
      setEngineResult(res);
      setIsRunning(false);
    }, 600);
  };

  const handleConfigChange = <K extends keyof WarrantyActivationExecutionPayload>(field: K, val: WarrantyActivationExecutionPayload[K]) => {
    setInputConfig(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-600/20 via-slate-800/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400 mt-1 shadow-inner">
              <Cpu className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Sprint 5.5 Engine
                </span>
                <span className="text-xs font-mono text-slate-400">Automated Lifecycle Daemon</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2.5">
                Warranty Activation & PM Engine
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Event-driven backend engine triggered upon Documentation Approval. Automatically transitions asset registry status to INSTALLED, calculates warranty dates, and provisions PM schedules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end lg:self-center">
            <button
              type="button"
              onClick={() => {
                const refreshedNo = `WC-AVN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
                setInputConfig(prev => ({ ...prev, warrantyCardNumber: refreshedNo }));
              }}
              className="px-3.5 py-2.5 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New WC Ref
            </button>
            <button
              onClick={handleRunEngine}
              disabled={isRunning}
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Executing Rules...' : 'Simulate Approval Trigger'}
            </button>
          </div>
        </div>

        {/* Workflow Summary Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-8 pt-6 border-t border-slate-800 text-[11px] font-mono">
          <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">STEP 1:</span>
            <span className="text-emerald-400 font-bold">Status → Installed</span>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">STEP 2:</span>
            <span className="text-blue-300 font-bold">Calc Warranty End</span>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">STEP 3:</span>
            <span className="text-indigo-300 font-bold">Generate PM Rules</span>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">STEP 4:</span>
            <span className="text-amber-300 font-bold">Schedule Tickets</span>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">STEP 5:</span>
            <span className="text-purple-300 font-bold">Dispatch Alerts</span>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">STEP 6:</span>
            <span className="text-slate-200 font-bold">Audit RLS Record</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: SIMULATED INPUT GATE (TRIGGER) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-fit">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-800">Input Gate Trigger</h2>
            </div>
            <span className="text-[10px] font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">
              OFFICER_GATE
            </span>
          </div>

          <div className="p-6 space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Warranty Card No</label>
              <input
                type="text"
                value={inputConfig.warrantyCardNumber}
                onChange={e => handleConfigChange('warrantyCardNumber', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-indigo-700 bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Start Date</label>
                <input
                  type="date"
                  value={inputConfig.warrantyStartDate}
                  onChange={e => handleConfigChange('warrantyStartDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Period (Months)</label>
                <select
                  value={inputConfig.warrantyPeriodMonths}
                  onChange={e => handleConfigChange('warrantyPeriodMonths', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white"
                >
                  <option value={12}>12 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">PM Cadence Rule</label>
              <div className="grid grid-cols-3 gap-2">
                {(['6 Months', '12 Months', 'No PM'] as ServiceIntervalOption[]).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleConfigChange('serviceInterval', opt)}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                      inputConfig.serviceInterval === opt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Assigned Area Engineer</label>
              <input
                type="text"
                value={inputConfig.assignedAreaEngineer}
                onChange={e => handleConfigChange('assignedAreaEngineer', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 mt-4">
              <span className="font-bold block mb-0.5">Automated Rule Engine:</span>
              When Documentation Officer authorizes release, this engine intercepts the transaction to provision database state.
            </div>
          </div>
        </div>

        {/* RIGHT 2 COLUMNS: ENGINE OUTPUT MONITOR */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'overview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Warranty Master
            </button>
            <button
              onClick={() => setActiveTab('pm')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'pm' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-4 h-4" />
              PM Tickets ({engineResult?.pmSchedules.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('notif')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'notif' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications ({engineResult?.notifications.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'audit' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              RLS Audit Feed ({engineResult?.auditLogs.length || 0})
            </button>
          </div>

          {engineResult && activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status Change Card */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-600 rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-800 uppercase block">Step 1: Registry Status Updated</span>
                    <h3 className="text-base font-extrabold text-slate-800">Instrument Status Advanced to: <span className="text-emerald-700">INSTALLED</span></h3>
                    <p className="text-xs text-slate-600 mt-0.5">Asset {engineResult.warrantyRecord.assetNumber} unlocked for warranty operations.</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-emerald-600 text-white px-3 py-1 rounded-full font-bold">
                  ACTIVE
                </span>
              </div>

              {/* Warranty Master Certificate */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <span className="text-xs font-mono text-indigo-600 uppercase font-bold">Step 2: Warranty Calculation</span>
                    <h3 className="text-lg font-bold text-slate-800">Digital Warranty Certificate</h3>
                  </div>
                  <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-800 px-3 py-1 rounded border border-indigo-200">
                    {engineResult.warrantyRecord.warrantyCardNumber}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-400 font-mono block">CUSTOMER ACCOUNT</span>
                      <p className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {engineResult.warrantyRecord.customerName}
                      </p>
                      <p className="text-xs text-slate-500">{engineResult.warrantyRecord.department}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-mono block">EQUIPMENT MODEL</span>
                      <p className="font-bold text-slate-800 mt-0.5">{engineResult.warrantyRecord.instrumentName}</p>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">S/N: {engineResult.warrantyRecord.serialNumber}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs">
                      <span className="text-slate-500 font-mono">WARRANTY WINDOW</span>
                      <span className="font-bold text-indigo-600">{engineResult.warrantyRecord.warrantyPeriodMonths} Months</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">START DATE</span>
                        <span className="text-sm font-bold text-slate-800 font-mono">{engineResult.warrantyRecord.warrantyStartDate}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-mono block">END DATE (CALCULATED)</span>
                        <span className="text-sm font-bold text-indigo-600 font-mono">{engineResult.warrantyRecord.warrantyEndDate}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex justify-between">
                      <span>PM Cadence: <strong className="text-slate-800">{engineResult.warrantyRecord.serviceInterval}</strong></span>
                      <span>Activated by: <strong className="text-slate-800">{engineResult.warrantyRecord.activatedBy}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {engineResult && activeTab === 'pm' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-indigo-600 uppercase font-bold">Steps 3 & 4: PM Generation & Scheduling</span>
                  <h3 className="text-base font-bold text-slate-800">Generated Preventive Maintenance Service Tickets</h3>
                </div>
                <span className="text-xs font-mono bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded font-bold">
                  {engineResult.pmSchedules.length} TICKETS CREATED
                </span>
              </div>

              {engineResult.pmSchedules.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-semibold">No Preventive Maintenance Schedules Created</p>
                  <p className="text-xs mt-1">Rule evaluated: Service Interval set to "No PM". Only core warranty record was generated.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {engineResult.pmSchedules.map((pm, idx) => (
                    <div key={pm.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl font-mono text-xs font-bold mt-0.5">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800 text-sm">{pm.pmNumber}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold font-mono">
                              {pm.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Scheduled Service Date: <strong className="text-slate-900 font-mono">{pm.scheduledDate}</strong>
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            Assigned Area Engineer: <span className="text-slate-700 font-medium">{pm.assignedAreaEngineer}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200/80 self-end sm:self-center">
                        <span className="text-[10px] text-slate-400 font-mono block">ASSET REF</span>
                        <span className="text-xs font-mono font-bold text-slate-700">{pm.assetNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {engineResult && activeTab === 'notif' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-purple-600 uppercase font-bold">Step 5: Event Notification Dispatcher</span>
                  <h3 className="text-base font-bold text-slate-800">Dispatched System Notifications</h3>
                </div>
                <span className="text-xs font-mono bg-purple-100 text-purple-800 px-2.5 py-1 rounded font-bold">
                  {engineResult.notifications.length} ALERTS SENT
                </span>
              </div>
              <div className="divide-y divide-slate-100 p-6 space-y-4">
                {engineResult.notifications.map(n => (
                  <div key={n.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                    <div className={`p-2 rounded-lg mt-0.5 ${
                      n.severity === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          To: {n.recipientRole} ({n.recipientName})
                        </span>
                        <span className="text-xs font-mono text-slate-400">{n.timestamp}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mt-2">{n.title}</h4>
                      <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {engineResult && activeTab === 'audit' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-600 uppercase font-bold">Step 6: Compliance Audit Generator</span>
                  <h3 className="text-base font-bold text-slate-800">Supabase RLS Audit Trail Entries</h3>
                </div>
                <span className="text-xs font-mono text-slate-500 font-bold">IMMUTABLE LOG</span>
              </div>
              <div className="divide-y divide-slate-100 p-6 space-y-4">
                {engineResult.auditLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-4 pb-4">
                    <div className="p-2 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] font-bold mt-0.5 shrink-0">
                      {log.action}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-800">
                          {log.performedBy} <span className="text-xs font-mono text-slate-400">({log.performedByRole})</span>
                        </p>
                        <span className="text-xs font-mono text-slate-400">{log.timestamp}</span>
                      </div>
                      <p className="text-xs font-mono text-indigo-600 mt-1">Ref: {log.referenceNumber}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarrantyActivationEngine;
