import React, { useState, useEffect } from 'react';
import { 
  InstallationReportData, 
  InstallationReportChecklistItem, 
  ChecklistItemStatus 
} from '../../types';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Building2, 
  User, 
  Phone, 
  Wrench, 
  Tag, 
  Hash, 
  FileCheck, 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  MessageSquare, 
  Save, 
  RefreshCw, 
  Check, 
  AlertCircle,
  Sparkles,
  Layers
} from 'lucide-react';

const DEFAULT_CHECKLIST_ITEMS: { id: string; label: string }[] = [
  { id: 'chk-1', label: 'Equipment unpacked and physical inspection completed' },
  { id: 'chk-2', label: 'Standard accessories and consumables verified against packing list' },
  { id: 'chk-3', label: 'Power supply voltage, grounding, and UPS connection checked' },
  { id: 'chk-4', label: 'Instrument assembled and mechanical alignments secured' },
  { id: 'chk-5', label: 'Power-on diagnostic self-test and initial boot verified' },
  { id: 'chk-6', label: 'Functional baseline test and optics/sensor verification passed' },
  { id: 'chk-7', label: 'Factory calibration certificates verified and reference controls run' },
  { id: 'chk-8', label: 'Operating software, firmware update, and license keys installed' },
  { id: 'chk-9', label: 'Network integration, LIS/HIS connectivity, and IP static routing configured' },
  { id: 'chk-10', label: 'On-site operator safety, maintenance, and routine workflow training completed' },
  { id: 'chk-11', label: 'Standard operating manual and quick reference guides handed over' },
  { id: 'chk-12', label: 'Warranty registration card signed and submitted to AVON ServicePro' }
];

interface InstallationReportProps {
  initialData?: Partial<InstallationReportData>;
  onSubmit?: (reportData: InstallationReportData) => void;
  onCancel?: () => void;
}

export const InstallationReport: React.FC<InstallationReportProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  // Form State
  const [formData, setFormData] = useState<InstallationReportData>(() => {
    const initialChecklist: InstallationReportChecklistItem[] = DEFAULT_CHECKLIST_ITEMS.map(item => ({
      id: item.id,
      label: item.label,
      status: 'PASS',
      remarks: ''
    }));

    return {
      installationNumber: initialData?.installationNumber || 'INST-2026-0492',
      jobSheetNumber: initialData?.jobSheetNumber || 'JS-88219',
      installationDate: initialData?.installationDate || new Date().toISOString().split('T')[0],
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '13:30',
      duration: initialData?.duration || '4 hrs 30 mins',
      customerName: initialData?.customerName || 'Metro Central General Hospital',
      department: initialData?.department || 'Advanced Clinical Pathology & Hematology',
      endUser: initialData?.endUser || 'Dr. Elena Rostova (Lead Pathologist)',
      contactNumber: initialData?.contactNumber || '+1 (555) 389-2041 ext. 402',
      instrumentName: initialData?.instrumentName || 'Sysmex XN-3000 Automated Hematology Analyzer',
      brand: initialData?.brand || 'Sysmex Oncology & Diagnostics',
      model: initialData?.model || 'XN-3000 Dual Module',
      serialNumber: initialData?.serialNumber || 'SXN-9948210-PRO',
      assetNumber: initialData?.assetNumber || 'AST-MED-2026-8841',
      invoiceNumber: initialData?.invoiceNumber || 'INV-AVN-992014',
      checklist: initialData?.checklist || initialChecklist,
      engineerNotes: initialData?.engineerNotes || {
        workPerformed: 'Unpacked main analyzer chassis and pneumatic sampler unit. Connected hospital grade UPS power lines and verified 120V stable ground. Assembled dual aspiration needles and performed tubing prime cycles. Executed diagnostic calibration suite using high, low, and normal reference blood controls. All QC metrics within 0.5% CV target tolerance. Configured bi-directional HL7 interface with hospital Cerner LIS.',
        problemsFound: 'Minor crimp observed in secondary waste disposal hose during unpacking. Replaced immediately with factory approved spare hose kit.',
        correctiveActions: 'Replaced waste drain hose (P/N: SYS-HS-102). Re-ran leak check protocol for 30 continuous minutes; zero leaks detected.',
        recommendations: 'Recommend scheduling preventative maintenance calibration filter check every 6 months due to high throughput department volume (>800 samples/day).',
        remarks: 'Instrument fully commissioned and released for clinical diagnostic use. Department head signed customer acceptance certificate.'
      }
    };
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'details' | 'checklist' | 'notes'>('all');

  // Auto-calculate duration when start or end time changes
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const [startH, startM] = formData.startTime.split(':').map(Number);
      const [endH, endM] = formData.endTime.split(':').map(Number);
      
      if (!isNaN(startH) && !isNaN(startM) && !isNaN(endH) && !isNaN(endM)) {
        let totalStartMins = startH * 60 + startM;
        let totalEndMins = endH * 60 + endM;
        if (totalEndMins < totalStartMins) {
          totalEndMins += 24 * 60; // handle past midnight
        }
        const diffMins = totalEndMins - totalStartMins;
        const hrs = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        
        let durStr = '';
        if (hrs > 0) durStr += `${hrs} hr${hrs > 1 ? 's' : ''} `;
        if (mins > 0) durStr += `${mins} min${mins > 1 ? 's' : ''}`;
        if (!durStr) durStr = '0 mins';

        setFormData(prev => ({ ...prev, duration: durStr.trim() }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  const handleFieldChange = (field: keyof InstallationReportData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNoteChange = (noteField: keyof InstallationReportData['engineerNotes'], value: string) => {
    setFormData(prev => ({
      ...prev,
      engineerNotes: {
        ...prev.engineerNotes,
        [noteField]: value
      }
    }));
  };

  const handleChecklistStatusChange = (id: string, status: ChecklistItemStatus) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item => item.id === id ? { ...item, status } : item)
    }));
  };

  const handleChecklistRemarkChange = (id: string, remarks: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item => item.id === id ? { ...item, remarks } : item)
    }));
  };

  const setAllChecklist = (status: ChecklistItemStatus) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item => ({ ...item, status }))
    }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (onSubmit) {
      onSubmit(formData);
    }
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  const passCount = formData.checklist.filter(c => c.status === 'PASS').length;
  const failCount = formData.checklist.filter(c => c.status === 'FAIL').length;
  const naCount = formData.checklist.filter(c => c.status === 'NOT APPLICABLE').length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-blue-600/10 via-slate-800/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 mt-1">
              <FileCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Sprint 5.3 Module
                </span>
                <span className="text-xs font-mono text-slate-400">AVON ServicePro Enterprise</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-1 flex items-center gap-2">
                Digital Installation Report
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Complete commission validation, configurable equipment checklist, and engineering sign-off.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            {onCancel && (
              <button 
                type="button" 
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                Back to Execution
              </button>
            )}
            <button 
              type="button" 
              onClick={() => setFormData(prev => ({ ...prev, installationNumber: `INST-2026-${Math.floor(1000 + Math.random() * 9000)}` }))}
              className="px-3 py-2 text-xs font-mono text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Generate sample job ID"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh ID
            </button>
            <button 
              onClick={handleSubmitForm}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              Submit Report
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80 text-xs font-mono">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">JOB SHEET NO:</span>
            <span className="text-sm font-semibold text-white tracking-wide">{formData.jobSheetNumber}</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">DATE / DURATION:</span>
            <span className="text-sm font-semibold text-blue-400">{formData.installationDate} ({formData.duration})</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">CHECKLIST HEALTH:</span>
            <span className="text-sm font-semibold text-emerald-400">{passCount} PASS</span>
            <span className="text-slate-500 mx-1">/</span>
            <span className="text-rose-400">{failCount} FAIL</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">ASSET TAG:</span>
            <span className="text-sm font-semibold text-amber-400">{formData.assetNumber}</span>
          </div>
        </div>
      </div>

      {/* Submission Alert */}
      {isSubmitted && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-300 flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-200">Installation Report Successfully Submitted</p>
              <p className="text-xs text-emerald-400/80">Audit log generated. Status advanced to Report Submitted. Digital warranty trigger primed.</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-500/20 px-2.5 py-1 rounded text-emerald-300 border border-emerald-500/30">
            HTTP 201 CREATED
          </span>
        </div>
      )}

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'all' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Full Report View
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'details' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Job, Customer & Instrument
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'checklist' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Installation Checklist ({DEFAULT_CHECKLIST_ITEMS.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'notes' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Engineer Notes & Sign-Off
        </button>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-8">
        {/* SECTION 1: JOB DETAILS */}
        {(activeTab === 'all' || activeTab === 'details') && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">1. Job Details</h2>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                SECTION_JOB_MASTER
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Installation Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.installationNumber}
                  onChange={e => handleFieldChange('installationNumber', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Job Sheet Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.jobSheetNumber}
                  onChange={e => handleFieldChange('jobSheetNumber', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Installation Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.installationDate}
                  onChange={e => handleFieldChange('installationDate', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={e => handleFieldChange('startTime', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  End Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={e => handleFieldChange('endTime', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  Duration (Auto-calculated)
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.duration}
                  className="w-full px-3.5 py-2 bg-blue-50/60 border border-blue-200 rounded-lg text-sm font-mono font-bold text-blue-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: CUSTOMER DETAILS */}
        {(activeTab === 'all' || activeTab === 'details') && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">2. Customer</h2>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                SECTION_CUSTOMER_ACCOUNT
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={e => handleFieldChange('customerName', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={e => handleFieldChange('department', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  End User
                </label>
                <input
                  type="text"
                  required
                  value={formData.endUser}
                  onChange={e => handleFieldChange('endUser', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Contact Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactNumber}
                  onChange={e => handleFieldChange('contactNumber', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: INSTRUMENT DETAILS */}
        {(activeTab === 'all' || activeTab === 'details') && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-800">3. Instrument</h2>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                SECTION_INSTRUMENT_REGISTRY
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-slate-400" />
                  Instrument Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.instrumentName}
                  onChange={e => handleFieldChange('instrumentName', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Brand
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={e => handleFieldChange('brand', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Model
                </label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={e => handleFieldChange('model', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Serial Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.serialNumber}
                  onChange={e => handleFieldChange('serialNumber', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Asset Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.assetNumber}
                  onChange={e => handleFieldChange('assetNumber', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Invoice Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.invoiceNumber}
                  onChange={e => handleFieldChange('invoiceNumber', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: INSTALLATION CHECKLIST */}
        {(activeTab === 'all' || activeTab === 'checklist') && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-bold text-slate-800">4. Installation Checklist</h2>
                  <p className="text-xs text-slate-500">Configurable commissioning verification protocol.</p>
                </div>
              </div>

              {/* Bulk action buttons */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs text-slate-500 font-medium mr-1">Mark All:</span>
                <button
                  type="button"
                  onClick={() => setAllChecklist('PASS')}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PASS
                </button>
                <button
                  type="button"
                  onClick={() => setAllChecklist('FAIL')}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-100 text-rose-800 hover:bg-rose-200 transition-colors flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  FAIL
                </button>
                <button
                  type="button"
                  onClick={() => setAllChecklist('NOT APPLICABLE')}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1"
                >
                  <MinusCircle className="w-3.5 h-3.5" />
                  N/A
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {formData.checklist.map((item, index) => (
                <div key={item.id} className="p-4 sm:px-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded mt-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.label}</p>
                      <input
                        type="text"
                        placeholder="Optional remarks or test measurement value..."
                        value={item.remarks || ''}
                        onChange={e => handleChecklistRemarkChange(item.id, e.target.value)}
                        className="mt-2 w-full max-w-lg px-2.5 py-1 text-xs border border-slate-200 rounded bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* Status Selector */}
                  <div className="flex items-center gap-1.5 self-end md:self-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleChecklistStatusChange(item.id, 'PASS')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                        item.status === 'PASS'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PASS
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChecklistStatusChange(item.id, 'FAIL')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                        item.status === 'FAIL'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      FAIL
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChecklistStatusChange(item.id, 'NOT APPLICABLE')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                        item.status === 'NOT APPLICABLE'
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <MinusCircle className="w-3.5 h-3.5" />
                      NOT APPLICABLE
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>TOTAL ITEMS PROTOCOL: {formData.checklist.length}</span>
              <span className="flex items-center gap-4">
                <span className="text-emerald-600 font-bold">{passCount} PASSED</span>
                <span className="text-rose-600 font-bold">{failCount} FAILED</span>
                <span className="text-slate-600 font-bold">{naCount} N/A</span>
              </span>
            </div>
          </div>
        )}

        {/* SECTION 5: ENGINEER NOTES */}
        {(activeTab === 'all' || activeTab === 'notes') && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">5. Engineer Notes</h2>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                SECTION_FIELD_REMARKS
              </span>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Work Performed</span>
                  <span className="text-slate-400 font-normal normal-case font-mono">Commissioning summary</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.engineerNotes.workPerformed}
                  onChange={e => handleNoteChange('workPerformed', e.target.value)}
                  placeholder="Describe physical assembly, electrical checks, reagent plumbing, calibration routines..."
                  className="w-full p-3.5 bg-slate-50/50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    Problems Found
                  </label>
                  <textarea
                    rows={3}
                    value={formData.engineerNotes.problemsFound}
                    onChange={e => handleNoteChange('problemsFound', e.target.value)}
                    placeholder="Document factory defects, missing packing items, site environment issues..."
                    className="w-full p-3.5 bg-rose-50/20 border border-rose-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Corrective Actions
                  </label>
                  <textarea
                    rows={3}
                    value={formData.engineerNotes.correctiveActions}
                    onChange={e => handleNoteChange('correctiveActions', e.target.value)}
                    placeholder="Detail parts replaced, site adjustments, re-test validation outcomes..."
                    className="w-full p-3.5 bg-emerald-50/20 border border-emerald-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Recommendations for Customer / Service
                  </label>
                  <textarea
                    rows={3}
                    value={formData.engineerNotes.recommendations}
                    onChange={e => handleNoteChange('recommendations', e.target.value)}
                    placeholder="Preventative maintenance advice, environmental considerations, reagent storage..."
                    className="w-full p-3.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Final Sign-Off Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={formData.engineerNotes.remarks}
                    onChange={e => handleNoteChange('remarks', e.target.value)}
                    placeholder="General release remarks, warranty start notes, user acceptance status..."
                    className="w-full p-3.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <p className="text-sm font-semibold text-white">Ready to Finalize Installation Report?</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Submitting will lock the commissioning report and advance the job master status to <span className="text-blue-400 font-mono">Report Submitted</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              Submit Digital Report
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InstallationReport;
