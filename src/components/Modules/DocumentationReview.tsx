import React, { useState } from 'react';
import { 
  InstallationReportData, 
  DocumentationReviewData, 
  DocumentationReviewAuditLog, 
  ServiceIntervalOption 
} from '../../types';
import { 
  FileCheck, 
  Building2, 
  User, 
  Phone, 
  Wrench, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Paperclip, 
  ShieldCheck, 
  History, 
  Save, 
  Check, 
  X, 
  RotateCcw, 
  FileText, 
  Hash, 
  Layers, 
  ExternalLink,
  Sparkles,
  UserCheck
} from 'lucide-react';

// Mock comprehensive report data representing Sprint 5.3 submitted report
const MOCK_SUBMITTED_REPORT: InstallationReportData = {
  installationNumber: 'INST-2026-0492',
  jobSheetNumber: 'JS-88219',
  installationDate: '2026-06-24',
  startTime: '09:00',
  endTime: '13:30',
  duration: '4 hrs 30 mins',
  customerName: 'Metro Central General Hospital',
  department: 'Advanced Clinical Pathology & Hematology',
  endUser: 'Dr. Elena Rostova (Lead Pathologist)',
  contactNumber: '+1 (555) 389-2041 ext. 402',
  instrumentName: 'Sysmex XN-3000 Automated Hematology Analyzer',
  brand: 'Sysmex Oncology & Diagnostics',
  model: 'XN-3000 Dual Module',
  serialNumber: 'SXN-9948210-PRO',
  assetNumber: 'AST-MED-2026-8841',
  invoiceNumber: 'INV-AVN-992014',
  assignedEngineer: 'Eng. Marcus Vance (Senior Field Service Engineer)',
  assignedTechnicians: ['Tech. Liam O\'Connor', 'Tech. Sarah Jenkins'],
  attachments: [
    { id: 'att-1', name: 'INST-2026-0492_Signed_Report.pdf', type: 'PDF Document', size: '2.4 MB', uploadedAt: '14:12' },
    { id: 'att-2', name: 'Site_Installation_Chassis_Front.jpg', type: 'Site Photo', size: '4.1 MB', uploadedAt: '13:45' },
    { id: 'att-3', name: 'Customer_Acceptance_Signoff_MCGH.pdf', type: 'Acceptance Form', size: '1.1 MB', uploadedAt: '14:05' }
  ],
  checklist: [
    { id: 'c1', label: 'Equipment unpacked and physical inspection completed', status: 'PASS', remarks: 'Chassis pristine' },
    { id: 'c2', label: 'Standard accessories and consumables verified against packing list', status: 'PASS', remarks: 'All reagents present' },
    { id: 'c3', label: 'Power supply voltage, grounding, and UPS connection checked', status: 'PASS', remarks: '120V isolated line' },
    { id: 'c4', label: 'Instrument assembled and mechanical alignments secured', status: 'PASS' },
    { id: 'c5', label: 'Power-on diagnostic self-test and initial boot verified', status: 'PASS' },
    { id: 'c6', label: 'Functional baseline test and optics/sensor verification passed', status: 'PASS', remarks: 'Laser scatter 0.1% CV' },
    { id: 'c7', label: 'Factory calibration certificates verified and reference controls run', status: 'PASS' },
    { id: 'c8', label: 'Operating software, firmware update, and license keys installed', status: 'PASS', remarks: 'v4.8.2 Enterprise' },
    { id: 'c9', label: 'Network integration, LIS/HIS connectivity, and IP static routing configured', status: 'PASS', remarks: 'Cerner LIS HL7 bi-directional OK' },
    { id: 'c10', label: 'On-site operator safety, maintenance, and routine workflow training completed', status: 'PASS' }
  ],
  engineerNotes: {
    workPerformed: 'Fully commissioned dual analyzer module. Grounding verified at <0.5 ohms. Reagent fluidics primed and calibrated.',
    problemsFound: 'None observed during final commissioning.',
    correctiveActions: 'Standard commissioning adjustments completed.',
    recommendations: 'Perform routine 6-month pneumatic filter check.',
    remarks: 'Customer accepted installation. Equipment operational.'
  }
};

interface DocumentationReviewProps {
  initialReport?: InstallationReportData;
  onStatusChange?: (newStatus: string, reviewData: DocumentationReviewData) => void;
}

export const DocumentationReview: React.FC<DocumentationReviewProps> = ({
  initialReport = MOCK_SUBMITTED_REPORT,
  onStatusChange
}) => {
  const [report] = useState<InstallationReportData>(initialReport);
  const [activeSection, setActiveSection] = useState<'summary' | 'review' | 'audit'>('summary');

  // Documentation Officer Editable Form State
  const [reviewData, setReviewData] = useState<DocumentationReviewData>({
    installationNumber: report.installationNumber,
    installationDate: report.installationDate,
    jobSheetNumber: report.jobSheetNumber,
    warrantyCardNumber: `WC-AVN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    warrantyStartDate: new Date().toISOString().split('T')[0],
    serviceInterval: '6 Months',
    remarks: '',
    status: 'Pending Review'
  });

  // Audit Log Feed
  const [auditLogs, setAuditLogs] = useState<DocumentationReviewAuditLog[]>([
    {
      id: 'aud-1',
      installationNumber: report.installationNumber,
      action: 'Update Details',
      performedBy: 'Eng. Marcus Vance',
      performedByRole: 'Field Service Engineer',
      timestamp: '2026-06-24 14:15',
      remarks: 'Submitted digital installation report and checklist for documentation compliance review.'
    }
  ]);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const triggerAuditLog = (action: DocumentationReviewAuditLog['action'], remarks: string) => {
    const newLog: DocumentationReviewAuditLog = {
      id: `aud-${Date.now()}`,
      installationNumber: report.installationNumber,
      action,
      performedBy: 'Samantha Cole',
      performedByRole: 'Senior Documentation Officer',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      remarks
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleFieldUpdate = (field: keyof DocumentationReviewData, value: string) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    triggerAuditLog('Update Details', `Updated review master records: Job Sheet ${reviewData.jobSheetNumber}, Warranty Card ${reviewData.warrantyCardNumber}, Interval ${reviewData.serviceInterval}.`);
    setNotification({ message: 'Review draft and warranty details updated. Audit entry generated.', type: 'success' });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAction = (actionType: 'Approved' | 'Rejected' | 'Returned to Engineer') => {
    const logActionMap: Record<string, DocumentationReviewAuditLog['action']> = {
      'Approved': 'Approve',
      'Rejected': 'Reject',
      'Returned to Engineer': 'Return to Engineer'
    };

    const actionRemarks = reviewData.remarks 
      ? `Decision: ${actionType.toUpperCase()}. Officer Remarks: "${reviewData.remarks}"`
      : `Installation Report documentation formally ${actionType.toLowerCase()}.`;

    setReviewData(prev => ({ ...prev, status: actionType, reviewedBy: 'Samantha Cole', reviewedAt: new Date().toISOString() }));
    triggerAuditLog(logActionMap[actionType], actionRemarks);

    const notificationMap = {
      'Approved': { message: 'Documentation formally APPROVED. Master status locked. Warranty ready.', type: 'success' as const },
      'Rejected': { message: 'Documentation REJECTED. Flagged in QA compliance queue.', type: 'error' as const },
      'Returned to Engineer': { message: 'Returned to Engineer. Job workflow reopened for field corrections.', type: 'warning' as const }
    };

    setNotification(notificationMap[actionType]);
    if (onStatusChange) {
      onStatusChange(actionType, { ...reviewData, status: actionType });
    }
  };

  const passCount = report.checklist.filter(c => c.status === 'PASS').length;
  const failCount = report.checklist.filter(c => c.status === 'FAIL').length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-blue-500/20 border border-blue-500/30 rounded-2xl text-blue-400 mt-1 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                  Sprint 5.4 Module
                </span>
                <span className="text-xs font-mono text-slate-400">AVON Enterprise QA Compliance</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2.5">
                Documentation Review & Approval
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Verify field service execution reports, validate commissioning checklist results, configure warranty parameters, and authorize final release.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-end lg:self-center bg-slate-800/80 p-2 rounded-xl border border-slate-700/80">
            <div className="px-3 py-1 text-right border-r border-slate-700 hidden sm:block">
              <span className="text-xs text-slate-400 block font-mono">CURRENT STATUS</span>
              <span className={`text-sm font-bold font-mono tracking-wider ${
                reviewData.status === 'Approved' ? 'text-emerald-400' :
                reviewData.status === 'Rejected' ? 'text-rose-400' :
                reviewData.status === 'Returned to Engineer' ? 'text-amber-400' : 'text-blue-400'
              }`}>
                ● {reviewData.status.toUpperCase()}
              </span>
            </div>
            <button 
              onClick={() => setActiveSection('summary')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSection === 'summary' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              Report Summary
            </button>
            <button 
              onClick={() => setActiveSection('review')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSection === 'review' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              Officer Approval & Warranty
            </button>
            <button 
              onClick={() => setActiveSection('audit')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSection === 'audit' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              Audit Trail ({auditLogs.length})
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 text-xs font-mono">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">INSTALLATION NO:</span>
            <span className="text-sm font-bold text-white tracking-wide">{report.installationNumber}</span>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">INSTRUMENT ASSET:</span>
            <span className="text-sm font-bold text-amber-400 truncate block">{report.assetNumber}</span>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">CHECKLIST PROTOCOL:</span>
            <span className="text-sm font-bold text-emerald-400">{passCount} PASS</span>
            {failCount > 0 && <span className="text-rose-400 ml-1">({failCount} FAIL)</span>}
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">ASSIGNED ENGINEER:</span>
            <span className="text-sm font-bold text-blue-300 truncate block">{report.assignedEngineer || 'Marcus Vance'}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Status Notifications */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 duration-300 border ${
          notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
          notification.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
          'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
              notification.type === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <p className="text-sm font-semibold">{notification.message}</p>
          </div>
          <span className="text-xs font-mono uppercase opacity-75">Audit Log Recorded</span>
        </div>
      )}

      {/* SECTION 1: INSTALLATION REPORT SUMMARY */}
      {(activeSection === 'summary') && (
        <div className="space-y-6">
          {/* Customer & Instrument Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-800">Customer Information</h2>
                </div>
                <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                  SITE_COMMISSIONED
                </span>
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-slate-400 uppercase font-mono">Customer Name</dt>
                  <dd className="font-bold text-slate-800 mt-0.5">{report.customerName}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs font-semibold text-slate-400 uppercase font-mono">Department</dt>
                    <dd className="font-medium text-slate-700 mt-0.5">{report.department}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-400 uppercase font-mono">End User Contact</dt>
                    <dd className="font-medium text-slate-700 mt-0.5">{report.endUser}</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-400 uppercase font-mono">Phone Extension</dt>
                  <dd className="font-mono text-slate-600 mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {report.contactNumber}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-600" />
                  <h2 className="text-base font-bold text-slate-800">Instrument Information</h2>
                </div>
                <span className="text-xs font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-semibold">
                  ASSET_VERIFIED
                </span>
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-slate-400 uppercase font-mono">Instrument & Brand</dt>
                  <dd className="font-bold text-slate-800 mt-0.5">{report.instrumentName}</dd>
                  <dd className="text-xs text-slate-500">{report.brand} ({report.model})</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs font-semibold text-slate-400 uppercase font-mono">Serial Number</dt>
                    <dd className="font-mono font-bold text-slate-800 mt-0.5 bg-slate-100 px-2 py-1 rounded inline-block">
                      {report.serialNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-400 uppercase font-mono">Invoice Ref</dt>
                    <dd className="font-mono font-medium text-slate-700 mt-0.5">{report.invoiceNumber}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          {/* Engineer Information & Execution Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-800">Engineer Information & Job Execution</h2>
              </div>
              <span className="text-xs font-mono text-slate-500">FIELD_TEAM</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase font-mono block mb-1">Lead Engineer</span>
                <p className="font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  {report.assignedEngineer || 'Marcus Vance'}
                </p>
                <span className="text-xs text-slate-500 mt-1 block">Senior Field Service Specialist</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase font-mono block mb-1">Assigned Technicians</span>
                <p className="font-medium text-slate-700">
                  {report.assignedTechnicians ? report.assignedTechnicians.join(', ') : 'Liam O\'Connor, Sarah Jenkins'}
                </p>
                <span className="text-xs text-slate-500 mt-1 block">Optics & Electrical Support</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase font-mono block mb-1">Execution Duration</span>
                <p className="font-mono font-bold text-blue-600 text-base">
                  {report.duration} ({report.startTime} - {report.endTime})
                </p>
                <span className="text-xs text-slate-500 mt-1 block">Date: {report.installationDate}</span>
              </div>
            </div>
          </div>

          {/* Checklist Results Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-800">Commissioning Checklist Results ({report.checklist.length} items)</h2>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded font-bold">
                {passCount} PASSED PROTOCOL
              </span>
            </div>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {report.checklist.map((chk, idx) => (
                <div key={chk.id} className="p-4 px-6 flex items-center justify-between gap-4 text-sm hover:bg-slate-50/60">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded mt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">{chk.label}</p>
                      {chk.remarks && <p className="text-xs text-slate-500 mt-0.5 font-mono">Remarks: {chk.remarks}</p>}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold shrink-0 ${
                    chk.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                    chk.status === 'FAIL' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {chk.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <Paperclip className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-800">Uploaded Attachments & Documents</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(report.attachments || []).map(att => (
                <div key={att.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-100/80 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0 font-mono text-xs font-bold">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate" title={att.name}>{att.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{att.type} • {att.size}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-blue-600 p-1 shrink-0" title="View Document">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: OFFICER APPROVAL & WARRANTY UPDATE */}
      {(activeSection === 'review') && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="text-lg font-bold text-slate-800">Documentation Officer Verification & Warranty Parameters</h2>
                <p className="text-xs text-slate-500">Update master commissioning details and define preventative maintenance intervals.</p>
              </div>
            </div>
            <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2.5 py-1 rounded font-bold">
              QA OFFICER FORM
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Installation Date (Verified)
                </label>
                <input
                  type="date"
                  value={reviewData.installationDate}
                  onChange={e => handleFieldUpdate('installationDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Job Sheet Number
                </label>
                <input
                  type="text"
                  value={reviewData.jobSheetNumber}
                  onChange={e => handleFieldUpdate('jobSheetNumber', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Warranty Card Number
                </label>
                <input
                  type="text"
                  value={reviewData.warrantyCardNumber}
                  onChange={e => handleFieldUpdate('warrantyCardNumber', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Warranty Start Date
                </label>
                <input
                  type="date"
                  value={reviewData.warrantyStartDate}
                  onChange={e => handleFieldUpdate('warrantyStartDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Service Interval (Preventative Maintenance Schedule)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['6 Months', '12 Months', 'No PM'] as ServiceIntervalOption[]).map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleFieldUpdate('serviceInterval', option)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                        reviewData.serviceInterval === option
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {option === '6 Months' && <Clock className="w-3.5 h-3.5 text-blue-300" />}
                      {option === '12 Months' && <Calendar className="w-3.5 h-3.5 text-indigo-300" />}
                      {option === 'No PM' && <X className="w-3.5 h-3.5 text-slate-400" />}
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Documentation Officer Remarks / Decision Notes
              </label>
              <textarea
                rows={3}
                value={reviewData.remarks}
                onChange={e => handleFieldUpdate('remarks', e.target.value)}
                placeholder="Enter compliance validation notes, warranty exceptions, or specific correction notes for engineer..."
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Save Draft Action */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-slate-500" />
                Save Details & Update Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: AUDIT TRAIL */}
      {(activeSection === 'audit') && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-800">Immutable Audit Trail ({auditLogs.length} entries)</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">SUPABASE_RLS_LOGS</span>
          </div>
          <div className="divide-y divide-slate-100 p-6 space-y-4">
            {auditLogs.map(log => (
              <div key={log.id} className="flex items-start gap-4 pb-4">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-xl font-mono text-xs font-bold mt-1 shrink-0">
                  {log.action}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800">{log.performedBy} <span className="text-xs font-normal text-slate-400 font-mono">({log.performedByRole})</span></p>
                    <span className="text-xs font-mono text-slate-400">{log.timestamp}</span>
                  </div>
                  {log.remarks && <p className="text-sm text-slate-600 mt-1">{log.remarks}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FINAL ACTION FOOTER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold block mb-1">
            Documentation Approval Gate
          </span>
          <h3 className="text-lg font-bold text-white">Formally Authorize Installation Report</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Choose an immutable review decision. Every selection generates an audit entry and updates the job master lifecycle state.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleAction('Returned to Engineer')}
            className="px-5 py-3 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all flex items-center gap-2 transform active:scale-95"
            title="Return report to engineer for corrections"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            Return to Engineer
          </button>

          <button
            type="button"
            onClick={() => handleAction('Rejected')}
            className="px-5 py-3 text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all flex items-center gap-2 transform active:scale-95"
            title="Reject installation report"
          >
            <X className="w-4 h-4 text-rose-400" />
            Reject Report
          </button>

          <button
            type="button"
            onClick={() => handleAction('Approved')}
            className="px-6 py-3 text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Check className="w-5 h-5" />
            Approve & Release
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationReview;
