import React, { useState } from 'react';
import { CalibrationRecord, Instrument, UserProfile, JobRecord, JobStatus } from '../../types';
import { 
  FileText, ClipboardCopy, Medal, CheckCircle, Flame, ShieldAlert, Thermometer, 
  Droplets, Award, Printer, BadgeCheck, Clock, ShieldCheck, Link2, Search, Calendar,
  Wrench, Activity, AlertTriangle, Play, CheckCircle2, RefreshCw, UserCheck
} from 'lucide-react';
import { canCalibrate as isCalibrationAuthorized } from '../../utils/authHelpers';

interface CalibrationManagementProps {
  calibrations: CalibrationRecord[];
  instruments: Instrument[];
  onAddCalibration: (cal: CalibrationRecord) => void;
  currentUser: UserProfile;
  jobs: JobRecord[];
  onAddJob: (job: JobRecord) => void;
  onUpdateJob: (job: JobRecord) => void;
  onUpdateInstruments: (instruments: Instrument[]) => void;
}

// Certified NIST-Traceable Laboratory Standards (Metrology Standards Index)
const INITIAL_MASTER_STANDARDS = [
  {
    id: 'std-1',
    name: 'Fluke 725 Multifunction Process Calibrator',
    model: 'Fluke 725-II',
    serialNumber: 'FLK-725-882103',
    accuracy: '±0.01% of Span',
    certNo: 'NIST-FLK-2026-092',
    lastVerified: '2026-01-10',
    authority: 'NIST / SLAB Accredited',
    category: 'Electrical & Signal Simulators'
  },
  {
    id: 'std-2',
    name: 'Class E2 Analytical Weight Set (1g - 500g)',
    model: 'Mettler Toledo E2-99',
    serialNumber: 'WGT-E2-9921',
    accuracy: '±0.005 mg',
    certNo: 'NIST-WGT-2025-4421',
    lastVerified: '2025-11-15',
    authority: 'NIST / SLAB Accredited',
    category: 'Mass & Gravitational Standards'
  },
  {
    id: 'std-3',
    name: 'Reference RTD Temperature Standard (-50°C to 450°C)',
    model: 'Hart Scientific 5615',
    serialNumber: 'RTD-TEMP-4011',
    accuracy: '±0.02°C at 0°C',
    certNo: 'NIST-TEMP-2026-3392',
    lastVerified: '2026-02-01',
    authority: 'NIST / Physikalisch-Technische Bundesanstalt (PTB)',
    category: 'Thermal Metrology Standards'
  },
  {
    id: 'std-4',
    name: 'Agilent NIST-Traceable Caffeine Standard Kit',
    model: 'Agilent 5063-6523',
    serialNumber: 'AG-CAF-2026-01',
    accuracy: '±0.05% Wavelength accuracy',
    certNo: 'NIST-CAF-2026-551',
    lastVerified: '2026-05-18',
    authority: 'NIST Standard Reference Material',
    category: 'Chemical & Spectrophotometry'
  },
  {
    id: 'std-5',
    name: 'Certified Sound Level Calibrator Class 1',
    model: 'Quest QC-10',
    serialNumber: 'SND-CAL-110',
    accuracy: '±0.2 dB',
    certNo: 'NIST-SND-2026-118',
    lastVerified: '2026-03-22',
    authority: 'NIST / SLAB Accredited',
    category: 'Acoustic & Vibration Standards'
  }
];

export default function CalibrationManagement({
  calibrations,
  instruments,
  onAddCalibration,
  currentUser,
  jobs,
  onAddJob,
  onUpdateJob,
  onUpdateInstruments
}: CalibrationManagementProps) {

  // Current sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'worklist' | 'certificates' | 'duedates' | 'traceability'>('worklist');

  // Interactive search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCert, setSelectedCert] = useState<CalibrationRecord | null>(calibrations[0] || null);

  // Dynamic deviation calculator form states
  const [showBenchForm, setShowBenchForm] = useState(false);
  const [activeJobForCal, setActiveJobForCal] = useState<JobRecord | null>(null);

  // Form Inputs
  const [selectedStandardId, setSelectedStandardId] = useState(INITIAL_MASTER_STANDARDS[0].id);
  const [temp, setTemp] = useState<number>(22.4);
  const [humidity, setHumidity] = useState<number>(45.0);
  const [reportedError, setReportedError] = useState<number>(0.05);
  const [allowableError, setAllowableError] = useState<number>(0.20);
  const [customRemarks, setCustomRemarks] = useState('');
  const [recalInterval, setRecalInterval] = useState<number>(12); // months
  const [successMsg, setSuccessMsg] = useState('');

  // Proactive schedule modal/inline form states
  const [selectedInstForSchedule, setSelectedInstForSchedule] = useState<Instrument | null>(null);
  const [schedulePriority, setSchedulePriority] = useState<'Routine' | 'Urgent' | 'Emergency'>('Routine');
  const [selectedEngineerId, setSelectedEngineerId] = useState('usr_calib_eng');

  // Filter for Traceability standard selected to view logs
  const [selectedTraceabilityStandardId, setSelectedTraceabilityStandardId] = useState<string | null>(null);

  // Auth helper
  const canCalibrate = isCalibrationAuthorized(currentUser.role);

  // Date utilities
  const getDaysDiff = (dueDateStr?: string) => {
    if (!dueDateStr) return 999;
    const due = new Date(dueDateStr);
    const now = new Date();
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getComplianceStatus = (dueDateStr?: string) => {
    if (!dueDateStr) return { label: 'Unknown', color: 'text-gray-500 bg-gray-50 border-gray-100' };
    const diff = getDaysDiff(dueDateStr);
    if (diff < 0) return { label: 'Overdue', color: 'text-rose-700 bg-rose-50 border-rose-150 font-bold' };
    if (diff <= 30) return { label: 'Due Soon', color: 'text-amber-700 bg-amber-50 border-amber-150 font-bold' };
    return { label: 'Compliant', color: 'text-emerald-700 bg-emerald-50 border-emerald-150' };
  };

  // Perform calibration (from Job)
  const handleOpenCalBench = (job: JobRecord) => {
    setActiveJobForCal(job);
    // Find suitable default standard equipment based on instrument name
    const lowerName = job.brand.toLowerCase() + ' ' + job.model.toLowerCase();
    let matchedStd = INITIAL_MASTER_STANDARDS[0].id;
    if (lowerName.includes('spectro') || lowerName.includes('cary') || lowerName.includes('uv')) {
      matchedStd = 'std-4'; // Caffeine kit
    } else if (lowerName.includes('balance') || lowerName.includes('scale') || lowerName.includes('weight')) {
      matchedStd = 'std-2'; // Weights
    } else if (lowerName.includes('temp') || lowerName.includes('incubator') || lowerName.includes('oven')) {
      matchedStd = 'std-3'; // RTD Thermal
    } else if (lowerName.includes('acoustic') || lowerName.includes('audiometer') || lowerName.includes('noise')) {
      matchedStd = 'std-5'; // Acoustic
    }
    setSelectedStandardId(matchedStd);
    setTemp(22.0);
    setHumidity(48.0);
    setReportedError(0.04);
    setAllowableError(0.15);
    setCustomRemarks('');
    setRecalInterval(12);
    setShowBenchForm(true);
  };

  // Issue metrological certificate
  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJobForCal) return;

    const standardObj = INITIAL_MASTER_STANDARDS.find(s => s.id === selectedStandardId) || INITIAL_MASTER_STANDARDS[0];
    const certNo = `APCS-CAL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const passStatus = reportedError <= allowableError ? 'PASSED' : 'FAILED';

    const calibrationDateStr = new Date().toISOString().split('T')[0];
    const dueDateObj = new Date();
    dueDateObj.setMonth(dueDateObj.getMonth() + recalInterval);
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    const newCert: CalibrationRecord = {
      id: `cal-${Date.now()}`,
      certificateNo: certNo,
      instrumentId: activeJobForCal.id, // linked to service job or instrument asset ID
      instrumentName: `${activeJobForCal.brand} ${activeJobForCal.model}`,
      serialNumber: activeJobForCal.serialNumber || 'SN-UNKNOWN',
      calibrationDate: calibrationDateStr,
      dueDate: dueDateStr,
      standardEquipment: `${standardObj.name} (S/N: ${standardObj.serialNumber}, NIST Traceable Cert: ${standardObj.certNo})`,
      temperature: temp,
      humidity,
      reportedError,
      allowableError,
      status: passStatus,
      calibratedBy: currentUser.name,
      approvedBy: "M. N. Jayawardene (AVON Metrology Manager)"
    };

    // 1. Save Calibration Certificate state
    onAddCalibration(newCert);

    // 2. Update service/calibration job progress to Completed and Close
    const updatedJob: JobRecord = {
      ...activeJobForCal,
      status: 'Completed' as JobStatus,
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Completed' as JobStatus,
          updatedBy: currentUser.name,
          updatedAt: new Date().toISOString(),
          remarks: `Metrology Calibration Executed. Certificate No: ${certNo} issued under NIST standard ${standardObj.model}. Pass status: ${passStatus}. Max error: ${reportedError}%.`
        },
        ...(activeJobForCal.timeline || [])
      ],
      calibrationData: {
        requestDate: activeJobForCal.calibrationData?.requestDate || new Date().toISOString().split('T')[0],
        certificateNumber: certNo,
        calibrationDate: calibrationDateStr,
        invoiceNumber: `INV-CAL-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceAmount: 25000
      }
    };

    onUpdateJob(updatedJob);

    // 3. Update Calibration Due Date on the Instrument Registry
    const matchedInstrument = instruments.find(i => i.serialNumber === activeJobForCal.serialNumber);
    if (matchedInstrument) {
      const updatedInstruments = instruments.map(inst => {
        if (inst.id === matchedInstrument.id) {
          return {
            ...inst,
            calibrationDue: dueDateStr,
            status: passStatus === 'PASSED' ? 'Active' : 'Calibration Failed'
          };
        }
        return inst;
      });
      onUpdateInstruments(updatedInstruments);
    }

    setSelectedCert(newCert);
    setShowBenchForm(false);
    setActiveJobForCal(null);
    setSuccessMsg(`ISO-17025 Metrology Certificate ${certNo} Issued Successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
    setActiveSubTab('certificates');
  };

  // Schedule a new calibration job
  const handleScheduleCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstForSchedule) return;

    const pmId = `job-cal-${Date.now()}`;
    const newCalJob: JobRecord = {
      id: pmId,
      jobType: 'Calibration',
      status: 'Pending Assignment' as JobStatus,
      priority: schedulePriority,
      customerName: selectedInstForSchedule.customerName,
      brand: selectedInstForSchedule.brand,
      model: selectedInstForSchedule.model,
      serialNumber: selectedInstForSchedule.serialNumber,
      assignedEngineerId: selectedEngineerId,
      assignedEngineerName: selectedEngineerId === 'usr_calib_eng' ? 'Cherub Weeratunge' : 'Eng. Nimani Senanayake',
      createdById: currentUser.id,
      createdByRole: currentUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Pending Assignment' as JobStatus,
          updatedBy: currentUser.name,
          updatedAt: new Date().toISOString(),
          remarks: `Proactive Recalibration ticket issued for ${selectedInstForSchedule.brand} ${selectedInstForSchedule.model} (S/N: ${selectedInstForSchedule.serialNumber}) due on ${selectedInstForSchedule.calibrationDue}.`
        }
      ],
      calibrationData: {
        requestDate: new Date().toISOString().split('T')[0]
      }
    };

    onAddJob(newCalJob);
    setSelectedInstForSchedule(null);
    setSuccessMsg(`Recalibration job scheduled for ${newCalJob.brand} ${newCalJob.model}!`);
    setTimeout(() => setSuccessMsg(''), 4500);
    setActiveSubTab('worklist');
  };

  // Active calibration jobs
  const calJobs = jobs.filter(j => j.jobType === 'Calibration');
  const activeCalJobs = calJobs.filter(j => j.status !== 'Completed' && j.status !== 'Closed' && j.status !== 'Job Abandoned');
  const completedCalJobs = calJobs.filter(j => j.status === 'Completed' || j.status === 'Closed');

  // Filtering calibrations/certs
  const filteredCerts = calibrations.filter(cal => {
    const matchesSearch = cal.instrumentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cal.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cal.certificateNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // KPI calculations
  const totalCertsCount = calibrations.length;
  const passedCertsCount = calibrations.filter(c => c.status === 'PASSED').length;
  const calibrationPassRate = totalCertsCount > 0 ? Math.round((passedCertsCount / totalCertsCount) * 100) : 100;
  
  // Due dates counts
  const overdueInstruments = instruments.filter(i => i.calibrationDue && getDaysDiff(i.calibrationDue) < 0);
  const dueSoonInstruments = instruments.filter(i => {
    const d = getDaysDiff(i.calibrationDue);
    return i.calibrationDue && d >= 0 && d <= 30;
  });

  return (
    <div className="space-y-6">

      {/* Corporate ISO Metrological Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#0054A6]/35 border border-[#0054A6]/50 rounded-2xl text-blue-400 shadow-inner">
            <Medal className="w-8 h-8 text-[#0054A6]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-orange-500 font-mono">AVON METROLOGY DEPT</span>
              <span className="text-[9px] px-2 py-0.5 bg-[#0054A6]/20 border border-[#0054A6]/30 text-[#0054A6] rounded font-mono font-extrabold uppercase">ISO/IEC 17025</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white mt-1">Metrological Standards & Calibration Registry</h2>
            <p className="text-xs text-slate-400 mt-0.5">Accredited equipment calibration workflows, NIST traceabilities, and dynamic tolerance verification.</p>
          </div>
        </div>

        {/* Mini stats badges */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-slate-850 border border-slate-800 p-3 px-4 rounded-xl text-center min-w-[110px]">
            <span className="text-[9px] font-bold font-mono text-slate-500 uppercase block">ISO PASS RATE</span>
            <span className="text-lg font-black text-emerald-400 font-sans">{calibrationPassRate}%</span>
          </div>
          <div className="bg-slate-850 border border-slate-800 p-3 px-4 rounded-xl text-center min-w-[110px]">
            <span className="text-[9px] font-bold font-mono text-slate-500 uppercase block">OVERDUE RECAL</span>
            <span className={`text-lg font-black font-sans ${overdueInstruments.length > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
              {overdueInstruments.length}
            </span>
          </div>
          <div className="bg-slate-850 border border-slate-800 p-3 px-4 rounded-xl text-center min-w-[110px]">
            <span className="text-[9px] font-bold font-mono text-slate-500 uppercase block">ACTIVE JOB LIST</span>
            <span className="text-lg font-black text-blue-400 font-sans">{activeCalJobs.length}</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-xl text-xs font-sans flex items-center gap-3 animate-slide-in">
          <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Main Tab Bar Controls */}
      <div className="bg-white border border-slate-100 rounded-xl p-1.5 shadow-sm flex flex-wrap gap-1.5">
        <button
          onClick={() => { setActiveSubTab('worklist'); setShowBenchForm(false); }}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
            activeSubTab === 'worklist'
              ? 'bg-[#0054A6] text-white shadow-md shadow-blue-600/10'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Calibration Worklist ({activeCalJobs.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('certificates'); setShowBenchForm(false); }}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
            activeSubTab === 'certificates'
              ? 'bg-[#0054A6] text-white shadow-md shadow-blue-600/10'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Metrology Certificates ({calibrations.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('duedates'); setShowBenchForm(false); }}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
            activeSubTab === 'duedates'
              ? 'bg-[#0054A6] text-white shadow-md shadow-blue-600/10'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          Proactive Due Dates
          {(overdueInstruments.length > 0 || dueSoonInstruments.length > 0) && (
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          )}
        </button>
        <button
          onClick={() => { setActiveSubTab('traceability'); setShowBenchForm(false); }}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
            activeSubTab === 'traceability'
              ? 'bg-[#0054A6] text-white shadow-md shadow-blue-600/10'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Link2 className="w-4 h-4" />
          NIST Traceability Master
        </button>
      </div>

      {/* --- FORM MODAL: DYNAMIC CALIBRATION METROLOGY DEVIATION BENCH --- */}
      {showBenchForm && activeJobForCal && (
        <div className="bg-white rounded-2xl border border-[#0054A6]/25 p-6 shadow-xl animate-slide-in space-y-6">
          <div className="border-b pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#0054A6]">
              <Activity className="w-5 h-5 text-[#0054A6]" />
              <h3 className="text-sm font-black font-sans uppercase tracking-wider">
                Metrological Bench - ISO/IEC 17025 Deviation Calculator
              </h3>
            </div>
            <button
              onClick={() => { setShowBenchForm(false); setActiveJobForCal(null); }}
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
            >
              Cancel Bench
            </button>
          </div>

          <form onSubmit={handleIssueCertificate} className="space-y-6">
            {/* Target Instrument Profile */}
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase block">TARGET EQUIPMENT:</span>
                <span className="font-extrabold text-slate-800 block mt-0.5">{activeJobForCal.brand} {activeJobForCal.model}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase block">SERIAL NUMBER:</span>
                <span className="font-mono font-bold text-slate-700 block mt-0.5">{activeJobForCal.serialNumber}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase block">CUSTOMER IDENTITY:</span>
                <span className="font-semibold text-slate-700 block mt-0.5">{activeJobForCal.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase block">SCHEDULING TICKET:</span>
                <span className="font-mono text-blue-700 font-bold block mt-0.5">{activeJobForCal.id}</span>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-wider block">
                  1. SELECT CERTIFIED MASTER STANDARD CALIBRATOR (TRACEABILITY)
                </label>
                <select
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-sans focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                  value={selectedStandardId}
                  onChange={(e) => setSelectedStandardId(e.target.value)}
                >
                  {INITIAL_MASTER_STANDARDS.map(std => (
                    <option key={std.id} value={std.id}>
                      {std.name} (S/N: {std.serialNumber} | Accuracy: {std.accuracy})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-orange-500" /> 2. AMBIENT LABORATORY TEMP (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" /> 3. AMBIENT HUMIDITY LEVEL (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black font-mono text-rose-600 uppercase tracking-wider block">
                  4. OBSERVED INSTRUMENT MEASUREMENT ERROR (%)
                </label>
                <input
                  type="number"
                  step="0.001"
                  required
                  className="w-full bg-white border border-rose-200 rounded-xl p-2.5 text-xs font-mono text-rose-700 font-bold focus:ring-1 focus:ring-rose-600 focus:outline-none"
                  value={reportedError}
                  onChange={(e) => setReportedError(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black font-mono text-[#0054A6] uppercase tracking-wider block">
                  5. MAX ALLOWABLE CRITICAL DEVIATION TOLERANCE (%)
                </label>
                <input
                  type="number"
                  step="0.001"
                  required
                  className="w-full bg-white border border-blue-200 rounded-xl p-2.5 text-xs font-mono text-blue-700 font-bold focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                  value={allowableError}
                  onChange={(e) => setAllowableError(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-wider block">
                  6. RECALIBRATION CYCLE (MONTHS)
                </label>
                <select
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-sans focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                  value={recalInterval}
                  onChange={(e) => setRecalInterval(Number(e.target.value))}
                >
                  <option value="3">3 Months Cycle (High Risk/Continuous Use)</option>
                  <option value="6">6 Months Cycle (Standard Medical Laboratory)</option>
                  <option value="12">12 Months Cycle (Routine Metrological Standard)</option>
                  <option value="24">24 Months Cycle (High Stability Research Equipment)</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-wider block">
                  7. COMPLIANCE ASSESSMENT REMARKS / CALIBRATION JOURNAL
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deviation remains well within normal standard deviation curves. Transducers adjusted."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-sans focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                  value={customRemarks}
                  onChange={(e) => setCustomRemarks(e.target.value)}
                />
              </div>

              {/* Dynamic metrological decision indicator */}
              <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                <div>
                  <span className="text-[10px] font-bold font-mono text-slate-400 block uppercase">DYNAMIC COMPLIANCE ASSESSMENT:</span>
                  {reportedError <= allowableError ? (
                    <div className="flex items-center gap-1.5 justify-center mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block" />
                      <span className="text-xs text-emerald-700 font-extrabold uppercase font-mono">PASSED ISO TOLERANCE</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 justify-center mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse block" />
                      <span className="text-xs text-rose-700 font-extrabold uppercase font-mono">FAILED TOLERANCE / NON-COMPLIANT</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Form actions */}
            <div className="border-t pt-4 flex justify-between items-center bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <span className="text-[11px] text-slate-400 italic">This will generate a formal traceable certificate of verification.</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowBenchForm(false); setActiveJobForCal(null); }}
                  className="px-4 py-2 text-xs font-bold border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0054A6] hover:bg-blue-800 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Issue ISO Certificate & Close Job
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* --- SUB-TAB 1: CALIBRATION WORKLIST (TICKET MANAGER) --- */}
      {activeSubTab === 'worklist' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Active Metrology Workload</h3>
                <p className="text-xs text-slate-500 mt-0.5">Assigned clinical calibration service tickets waiting for metrology diagnostics.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">Filter Status:</span>
                <select
                  className="bg-slate-50 border border-slate-200 text-xs rounded-lg p-1.5 focus:outline-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Active Tickets</option>
                  <option value="Pending Assignment">Pending Assignment</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Traveling">In Transit / Traveling</option>
                  <option value="In Progress">Bench Diagnostic / In Progress</option>
                </select>
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-mono text-[10px] uppercase font-bold">
                    <th className="p-3.5 pl-4">Job ID & Priority</th>
                    <th className="p-3.5">Instrument Identity</th>
                    <th className="p-3.5">Customer / Institution</th>
                    <th className="p-3.5">Allocated Engineer</th>
                    <th className="p-3.5">Workflow Stage</th>
                    <th className="p-3.5 text-right pr-4">Diagnostic Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {calJobs
                    .filter(job => statusFilter === 'All' ? (job.status !== 'Completed' && job.status !== 'Closed') : (job.status === statusFilter))
                    .map(job => {
                      const isPending = job.status === 'Pending Assignment';
                      return (
                        <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3.5 pl-4">
                            <div className="space-y-0.5">
                              <span className="font-mono text-[10px] text-slate-400 block font-bold">{job.id}</span>
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono border ${
                                job.priority === 'Emergency' ? 'bg-rose-50 text-rose-700 border-rose-150' :
                                job.priority === 'Urgent' ? 'bg-amber-50 text-amber-700 border-amber-150' : 'bg-slate-50 text-slate-600 border-slate-150'
                              }`}>
                                {job.priority}
                              </span>
                            </div>
                          </td>
                          <td className="p-3.5 font-sans font-bold text-slate-800">
                            <div className="space-y-0.5">
                              <span>{job.brand} {job.model}</span>
                              <span className="font-mono text-[10px] text-slate-400 block font-normal">S/N: {job.serialNumber}</span>
                            </div>
                          </td>
                          <td className="p-3.5 text-slate-600">
                            <span>{job.customerName}</span>
                          </td>
                          <td className="p-3.5 text-slate-600">
                            {isPending ? (
                              <span className="text-slate-400 italic">No technician assigned</span>
                            ) : (
                              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>{job.assignedEngineerName}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-block p-1 px-2.5 rounded-full text-[10px] font-bold font-mono border ${
                              job.status === 'Pending Assignment' ? 'bg-slate-50 text-slate-500 border-slate-150' :
                              job.status === 'Assigned' ? 'bg-blue-50 text-blue-700 border-blue-150' :
                              job.status === 'Traveling' ? 'bg-purple-50 text-purple-700 border-purple-150' :
                              job.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-150' : 'bg-emerald-55/10 text-emerald-800 border-emerald-350'
                            }`}>
                              ● {job.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right pr-4">
                            {canCalibrate && job.status !== 'Pending Assignment' ? (
                              <button
                                onClick={() => handleOpenCalBench(job)}
                                className="px-3 py-1.5 text-[10px] font-bold text-white bg-[#0054A6] hover:bg-blue-800 rounded-md shadow-xs cursor-pointer inline-flex items-center gap-1 transition-all"
                              >
                                <Play className="w-3 h-3" /> Perform Calibration
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Pending Assignment</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  {calJobs.filter(job => statusFilter === 'All' ? (job.status !== 'Completed' && job.status !== 'Closed') : (job.status === statusFilter)).length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        No active calibration workload records found matching the status filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historical Calibration Log */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Completed Calibration Tickets Archive</h3>
              <p className="text-xs text-slate-500 mt-0.5">Archive of calibration jobs successfully certified.</p>
            </div>
            
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-mono text-[10px] uppercase font-bold">
                    <th className="p-3 pl-4">Job ID</th>
                    <th className="p-3">Instrument Details</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Certificate Number</th>
                    <th className="p-3">Calibration Date</th>
                    <th className="p-3 text-right pr-4">Archived Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650">
                  {completedCalJobs.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 pl-4 font-mono font-bold text-slate-400">{job.id}</td>
                      <td className="p-3 font-bold text-slate-800">{job.brand} {job.model}</td>
                      <td className="p-3">{job.customerName}</td>
                      <td className="p-3 font-mono font-bold text-blue-700">{job.calibrationData?.certificateNumber || 'N/A'}</td>
                      <td className="p-3 font-mono">{job.calibrationData?.calibrationDate || 'N/A'}</td>
                      <td className="p-3 text-right pr-4">
                        {job.calibrationData?.certificateNumber ? (
                          <button
                            onClick={() => {
                              const found = calibrations.find(c => c.certificateNo === job.calibrationData?.certificateNumber);
                              if (found) {
                                setSelectedCert(found);
                                setActiveSubTab('certificates');
                              }
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 rounded cursor-pointer transition-all inline-flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" /> View Document
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Not generated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {completedCalJobs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        No closed or completed calibration ticket logs archived yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 2: METROLOGICAL CERTIFICATES DRAWER & REPORT VIEWER --- */}
      {activeSubTab === 'certificates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
          
          {/* Certificate Drawer List */}
          <div className="lg:col-span-1 bg-white p-4 border border-slate-100 rounded-xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Certificates Library</h3>
              <p className="text-[11px] text-slate-400">Search and browse ISO metrological certificates.</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 pl-9 text-xs focus:outline-none focus:ring-1 focus:ring-[#0054A6]"
                placeholder="Search by S/N, Brand, Cert..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredCerts.map(cal => {
                const isActive = selectedCert?.id === cal.id;
                return (
                  <button
                    key={cal.id}
                    onClick={() => setSelectedCert(cal)}
                    className={`w-full text-left p-3.5 border rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      isActive ? 'bg-[#F5F8FC] border-[#0054A6] shadow-sm' : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 font-extrabold block">{cal.certificateNo}</span>
                      <h4 className="text-xs font-extrabold text-slate-800 leading-tight line-clamp-1">{cal.instrumentName}</h4>
                      <div className="flex gap-2 items-center text-[10px] text-slate-500 font-mono">
                        <span>S/N: {cal.serialNumber}</span>
                        <span>•</span>
                        <span>{cal.calibrationDate}</span>
                      </div>
                    </div>
                    
                    <span className={`text-[9px] font-extrabold uppercase font-mono px-2 py-0.5 rounded border shrink-0 ${
                      cal.status === 'PASSED' ? 'bg-emerald-50 text-emerald-800 border-emerald-150' : 'bg-rose-50 text-rose-700 border-rose-150'
                    }`}>
                      {cal.status}
                    </span>
                  </button>
                );
              })}
              {filteredCerts.length === 0 && (
                <div className="p-8 text-center text-slate-400 italic text-xs">
                  No metrological certificates found.
                </div>
              )}
            </div>
          </div>

          {/* Certificate formal print preview panel */}
          <div className="lg:col-span-2">
            {selectedCert ? (
              <div className="bg-[#FAFBFD] rounded-2xl border-2 border-dashed border-slate-200 p-8 shadow-sm flex flex-col justify-between print-area relative overflow-hidden">
                
                {/* Visual watermarks/seals background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] pointer-events-none select-none">
                  <Medal className="w-96 h-96 text-slate-800" />
                </div>

                {/* Report Corporate Header */}
                <div className="border-b-2 border-slate-200 pb-5 text-center flex flex-col items-center">
                  <div className="p-3 bg-blue-100/60 text-[#0054A6] rounded-2xl mb-2 border border-blue-200">
                    <Medal className="w-7 h-7 text-[#0054A6]" />
                  </div>
                  <h4 className="text-sm font-black text-[#0054A6] uppercase font-mono tracking-[0.15em]">AVON PHARMO CHEM (PVT) LTD</h4>
                  <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase mt-0.5">Accredited Calibration Laboratory & Metrology Directorate</p>
                  <div className="text-[9px] text-slate-400 font-sans italic mt-1">Conforming to ISO/IEC 17025 Metrology Accreditation Standards</div>
                </div>

                {/* Certificate Core Metadata fields */}
                <div className="grid grid-cols-2 gap-6 py-6 text-xs text-slate-600 font-sans border-b border-slate-100">
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[#0054A6] font-extrabold font-mono uppercase block text-[8px] tracking-wider">CERTIFICATE IDENTITY:</span>
                      <span className="font-mono text-slate-800 font-black text-sm">{selectedCert.certificateNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase block text-[8px]">CERTIFIED INSTRUMENT:</span>
                      <span className="font-extrabold text-slate-800">{selectedCert.instrumentName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase block text-[8px]">SERIAL TRACK IDENTITY:</span>
                      <span className="font-mono font-bold text-slate-700">{selectedCert.serialNumber}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-right">
                    <div>
                      <span className="text-slate-400 font-semibold uppercase block text-[8px]">VERIFICATION STAMP DATE:</span>
                      <span className="font-mono font-semibold text-slate-700">{selectedCert.calibrationDate}</span>
                    </div>
                    <div>
                      <span className="text-rose-500 font-mono font-extrabold uppercase block text-[8px] tracking-wider">RECALIBRATION DUE DATE:</span>
                      <span className="font-mono font-black text-rose-650 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded inline-block mt-0.5">{selectedCert.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase block text-[8px]">REFERENCE TRACEABILITY STANDARDS:</span>
                      <span className="text-[9px] text-slate-700 block italic leading-tight max-w-[280px] ml-auto mt-0.5">
                        {selectedCert.standardEquipment}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Environmental telemetry parameters Table */}
                <div className="grid grid-cols-4 gap-2 text-center py-4 bg-[#F5F8FC]/50 border border-[#F5F8FC] rounded-xl mt-4">
                  <div className="border-r border-slate-200">
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">AMBIENT TEMP</span>
                    <span className="font-mono font-extrabold text-slate-800 text-xs mt-0.5 block">{selectedCert.temperature} °C</span>
                  </div>
                  <div className="border-r border-slate-200">
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">AMBIENT HUMIDITY</span>
                    <span className="font-mono font-extrabold text-slate-800 text-xs mt-0.5 block">{selectedCert.humidity} %</span>
                  </div>
                  <div className="border-r border-slate-200">
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">MEASURED ERROR</span>
                    <span className="font-mono font-extrabold text-rose-650 text-xs mt-0.5 block">{selectedCert.reportedError} %</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase block font-sans">MAX TOLERANCE</span>
                    <span className="font-mono font-extrabold text-blue-700 text-xs mt-0.5 block">{selectedCert.allowableError} %</span>
                  </div>
                </div>

                {/* Verified Metrological stamp / seal */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-6 mt-4 gap-4 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 px-3.5 rounded-full font-mono text-[10px] font-black border flex items-center gap-1.5 ${
                      selectedCert.status === 'PASSED' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : 'bg-rose-50 text-rose-700 border-rose-300'
                    }`}>
                      <span className={`w-2 h-2 rounded-full block ${selectedCert.status === 'PASSED' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      VERDICT: {selectedCert.status}
                    </div>
                    <span className="text-slate-200">|</span>
                    <span className="text-[9px] font-extrabold text-[#0054A6] uppercase tracking-wide flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> NIST METROLOGY APPROVED
                    </span>
                  </div>

                  <div className="text-right space-y-1.5 text-[10px] font-sans">
                    <div>
                      <span className="text-slate-400 font-semibold uppercase block text-[8px]">CALIBRATION ENGINEER:</span>
                      <span className="font-extrabold text-slate-700 block">{selectedCert.calibratedBy}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase block text-[8px]">METROLOGICAL ENDORSER:</span>
                      <span className="font-bold text-slate-600 block">{selectedCert.approvedBy}</span>
                    </div>
                  </div>
                </div>

                {/* Stamp Print Action Button */}
                <div className="mt-6 text-center border-t border-slate-100 pt-4">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-all inline-flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print Metrology Report
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-400 h-[380px] flex items-center justify-center">
                <p className="font-sans text-xs">Select a Metrology Certificate from the drawer list to display ISO print preview layout.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- SUB-TAB 3: PROACTIVE DUE DATES & SCHEDULING CALENDAR --- */}
      {activeSubTab === 'duedates' && (
        <div className="space-y-6 animate-slide-in">
          
          {/* Calendar Compliance Alert summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold font-mono text-rose-500 uppercase">OVERDUE RECALIBRATION</span>
                <h4 className="text-xl font-black text-rose-700 mt-1">{overdueInstruments.length} Devices</h4>
              </div>
              <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0" />
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold font-mono text-amber-500 uppercase">DUE IN NEXT 30 DAYS</span>
                <h4 className="text-xl font-black text-amber-700 mt-1">{dueSoonInstruments.length} Devices</h4>
              </div>
              <Clock className="w-8 h-8 text-amber-600 shrink-0" />
            </div>

            <div className="bg-emerald-55/10 border border-emerald-150 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold font-mono text-emerald-600 uppercase">CALIBRATION ACCREDITED</span>
                <h4 className="text-xl font-black text-emerald-700 mt-1">
                  {instruments.filter(i => i.calibrationDue && getDaysDiff(i.calibrationDue) > 30).length} Compliant
                </h4>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
            </div>
          </div>

          {/* Instrument Compliance Table */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest font-sans">Accredited Compliance Due Dates Directory</h3>
              <p className="text-xs text-slate-500 mt-0.5">Next calibration targets for all clinical medical assets.</p>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-mono text-[10px] uppercase font-bold">
                    <th className="p-3.5 pl-4">Equipment Details</th>
                    <th className="p-3.5">Client & Dept</th>
                    <th className="p-3.5">Last Recal Date</th>
                    <th className="p-3.5">Next Due Date</th>
                    <th className="p-3.5">Remaining Days</th>
                    <th className="p-3.5">Compliance Level</th>
                    <th className="p-3.5 text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650">
                  {instruments
                    .filter(inst => inst.calibrationRequired !== false)
                    .map(inst => {
                      const compliance = getComplianceStatus(inst.calibrationDue);
                      const diff = getDaysDiff(inst.calibrationDue);
                      const hasJobScheduled = calJobs.some(j => j.serialNumber === inst.serialNumber && j.status !== 'Completed' && j.status !== 'Closed');

                      return (
                        <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3.5 pl-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800 block">{inst.brand} {inst.model}</span>
                              <span className="font-mono text-[10px] text-slate-400 block">S/N: {inst.serialNumber}</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="space-y-0.5">
                              <span className="font-semibold text-slate-700 block">{inst.customerName}</span>
                              <span className="text-[10px] text-slate-400 block">{inst.department}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono">{inst.installationDate || 'N/A'}</td>
                          <td className="p-3.5 font-mono font-bold text-slate-700">{inst.calibrationDue || 'N/A'}</td>
                          <td className="p-3.5 font-mono font-bold">
                            {diff === 999 ? (
                              <span className="text-slate-400">Not Tracked</span>
                            ) : diff < 0 ? (
                              <span className="text-rose-600">{Math.abs(diff)} Days Overdue</span>
                            ) : (
                              <span className="text-slate-700">{diff} Days Left</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] border uppercase ${compliance.color}`}>
                              {compliance.label}
                            </span>
                          </td>
                          <td className="p-3.5 text-right pr-4">
                            {hasJobScheduled ? (
                              <span className="text-[10px] text-blue-600 font-bold uppercase font-mono flex items-center justify-end gap-1">
                                <Activity className="w-3.5 h-3.5 animate-spin" /> Ticket Active
                              </span>
                            ) : (
                              <button
                                onClick={() => setSelectedInstForSchedule(inst)}
                                className="px-2.5 py-1.5 text-[10px] font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer transition-all inline-flex items-center gap-1"
                              >
                                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Schedule Cal
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dialog popup: Schedule Proactive Calibration */}
          {selectedInstForSchedule && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h4 className="text-sm font-black font-sans uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4.5 h-4.5 text-[#0054A6]" /> Schedule Calibration Job
                  </h4>
                  <button
                    onClick={() => setSelectedInstForSchedule(null)}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
                  >
                    Discard
                  </button>
                </div>

                <form onSubmit={handleScheduleCalibration} className="space-y-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">DEVICE PROFILE:</span>
                    <span className="font-extrabold text-slate-800 block">
                      {selectedInstForSchedule.brand} {selectedInstForSchedule.model}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">S/N: {selectedInstForSchedule.serialNumber}</span>
                    <span className="text-[10px] text-slate-500 block">Location: {selectedInstForSchedule.customerName}</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">TICKET PRIORITY LEVEL</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                      value={schedulePriority}
                      onChange={(e: any) => setSchedulePriority(e.target.value)}
                    >
                      <option value="Routine">Routine Cal (Planned Cycle)</option>
                      <option value="Urgent">Urgent Recal (Customer Request)</option>
                      <option value="Emergency">Emergency Diagnostic (Audit Warning/Failure)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">ALLOCATE CALIBRATION ENGINEER</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                      value={selectedEngineerId}
                      onChange={(e) => setSelectedEngineerId(e.target.value)}
                    >
                      <option value="usr_calib_eng">Cherub Weeratunge (Calibration Engineer)</option>
                      <option value="eng-2">Eng. Nimani Senanayake (Spectrophotometry Expert)</option>
                    </select>
                  </div>

                  <div className="border-t pt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedInstForSchedule(null)}
                      className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-650 font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0054A6] hover:bg-blue-800 text-white rounded-lg font-bold shadow-md cursor-pointer"
                    >
                      Dispatch Ticket
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* --- SUB-TAB 4: METROLOGICAL TRACEABILITY INDEX (ISO AUDITOR VIEW) --- */}
      {activeSubTab === 'traceability' && (
        <div className="space-y-6 animate-slide-in">
          
          {/* Section description header */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-2">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1 text-[#0054A6]">
              <Link2 className="w-5 h-5 text-[#0054A6]" /> Laboratory Standard Reference Equipment Traceability Index
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              In conformity with <strong>ISO/IEC 17025 clause 6.5 (Metrological Traceability)</strong>, this panel showcases our 
              unbroken chain of reference master standards. These are regularly cross-calibrated with global/national metrology 
              bodies (NIST, PTB, SLAB) and are used directly to establish verifications on target biomedical/clinical hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Standards list */}
            <div className="lg:col-span-1 bg-white p-4 border border-slate-100 rounded-xl space-y-3">
              <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider pb-2 border-b">
                Certified Master Standards List
              </h4>
              <div className="space-y-2">
                {INITIAL_MASTER_STANDARDS.map(std => {
                  const isSelected = selectedTraceabilityStandardId === std.id;
                  return (
                    <button
                      key={std.id}
                      onClick={() => setSelectedTraceabilityStandardId(isSelected ? null : std.id)}
                      className={`w-full text-left p-3.5 border rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                        isSelected ? 'bg-blue-50/50 border-[#0054A6] shadow-xs' : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold font-mono text-[#0054A6] uppercase block">{std.category}</span>
                        <h5 className="text-xs font-extrabold text-slate-800 leading-snug">{std.name}</h5>
                        <div className="text-[10px] text-slate-400 font-mono">
                          S/N: {std.serialNumber} • Accuracy: {std.accuracy}
                        </div>
                      </div>
                      <Link2 className={`w-4 h-4 shrink-0 transition-all ${isSelected ? 'text-[#0054A6]' : 'text-slate-200'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Traceability validation list */}
            <div className="lg:col-span-2 bg-white p-5 border border-slate-100 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                    Unbroken Traceability Chain Verification
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selectedTraceabilityStandardId 
                      ? 'Displaying calibrations certified using the selected master standard.' 
                      : 'Select any master calibrator from the list to display associated calibration histories.'}
                  </p>
                </div>
                {selectedTraceabilityStandardId && (
                  <button
                    onClick={() => setSelectedTraceabilityStandardId(null)}
                    className="text-[10px] font-bold font-mono text-red-650 hover:underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Master Standard Detailed Card */}
              {selectedTraceabilityStandardId ? (() => {
                const std = INITIAL_MASTER_STANDARDS.find(s => s.id === selectedTraceabilityStandardId)!;
                // Filter calibrations that used this standard (either in text or standard fields)
                const associatedCerts = calibrations.filter(c => c.standardEquipment.includes(std.serialNumber) || c.standardEquipment.toLowerCase().includes(std.name.toLowerCase()));

                return (
                  <div className="space-y-4">
                    {/* Standard Detailed specifications */}
                    <div className="bg-[#FAFBFD] border border-slate-150 p-4 rounded-xl grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <span className="text-[9px] font-bold font-mono text-slate-400 uppercase">MASTER CALIBRATOR NAME:</span>
                        <h5 className="font-extrabold text-slate-800">{std.name}</h5>
                        <span className="text-[10px] text-slate-400 block font-mono">Model: {std.model}</span>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold font-mono text-slate-400 uppercase">CALIBRATOR ACCURACY / UNCERTAINTY:</span>
                        <span className="font-mono font-extrabold text-slate-800 block">{std.accuracy}</span>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold font-mono text-slate-400 uppercase">NIST ACCREDITATION NO:</span>
                        <span className="font-mono font-extrabold text-blue-700 block">{std.certNo}</span>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold font-mono text-slate-400 uppercase">LAST CALIBRATION BY AUTHORITY:</span>
                        <span className="font-mono font-bold text-slate-700 block">{std.lastVerified}</span>
                      </div>
                    </div>

                    {/* Associated verified devices list */}
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-bold font-mono text-slate-400 uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Traceable Devices Calibrated By This Standard ({associatedCerts.length})
                      </h5>
                      <div className="overflow-x-auto border border-slate-100 rounded-xl">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 font-mono text-[9px] uppercase font-bold">
                              <th className="p-2.5 pl-3">Certificate No</th>
                              <th className="p-2.5">Calibrated Device</th>
                              <th className="p-2.5">S/N Tracking</th>
                              <th className="p-2.5">Date Verified</th>
                              <th className="p-2.5">Reported Error</th>
                              <th className="p-2.5 text-right pr-3">Verification Details</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {associatedCerts.map(cert => (
                              <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-2.5 pl-3 font-mono font-extrabold text-blue-800">{cert.certificateNo}</td>
                                <td className="p-2.5 font-bold text-slate-800">{cert.instrumentName}</td>
                                <td className="p-2.5 font-mono text-slate-400">{cert.serialNumber}</td>
                                <td className="p-2.5 font-mono">{cert.calibrationDate}</td>
                                <td className="p-2.5 font-mono font-bold text-rose-650">{cert.reportedError} %</td>
                                <td className="p-2.5 text-right pr-3">
                                  <button
                                    onClick={() => { setSelectedCert(cert); setActiveSubTab('certificates'); }}
                                    className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-650 rounded text-[10px] hover:bg-slate-100 cursor-pointer"
                                  >
                                    Inspect Certificate
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {associatedCerts.length === 0 && (
                              <tr>
                                <td colSpan={6} className="p-6 text-center text-slate-400 italic">
                                  No calibration certificates in the current active database are linked to this standard standard yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center text-slate-400">
                  <p className="text-xs">Please select a Master Metrology Calibrator standard from the sidebar list to audit its traceability chain and compliance statistics.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
