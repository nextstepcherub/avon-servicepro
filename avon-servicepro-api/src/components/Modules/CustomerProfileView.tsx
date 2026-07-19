import React, { useState } from 'react';
import { Customer, UserProfile } from '../../types';
import { 
  Building2, 
  ArrowLeft, 
  MapPin, 
  PhoneCall, 
  Mail, 
  UserCheck, 
  BookOpen, 
  Users, 
  Cpu, 
  Briefcase, 
  DollarSign, 
  Star, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Download, 
  UploadCloud, 
  X, 
  Calendar, 
  Clock, 
  Award, 
  Activity,
  Layers,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface CustomerDepartment {
  id: string;
  customerId: string;
  name: string;
  contactPerson: string;
  contactNumber: string;
  email?: string;
  departmentCode?: string;
}

interface EndUserRecord {
  id: string;
  customerId: string;
  departmentId?: string;
  name: string;
  designation?: string;
  mobile: string;
  email?: string;
  location: string;
  remarks: string;
  isActive: boolean;
}

interface CustomerProfileViewProps {
  customer: Customer;
  onBack: () => void;
  departments: CustomerDepartment[];
  endUsers: EndUserRecord[];
  onAddDepartment: (dept: CustomerDepartment) => void;
  onAddEndUser: (user: EndUserRecord) => void;
  currentUser: UserProfile;
}

export default function CustomerProfileView({
  customer,
  onBack,
  departments,
  endUsers,
  onAddDepartment,
  onAddEndUser,
  currentUser
}: CustomerProfileViewProps) {
  
  const [profileTab, setProfileTab] = useState<'overview' | 'departments' | 'endusers' | 'instruments' | 'jobs' | 'revenue' | 'csat' | 'documents'>('overview');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Forms states
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptContact, setNewDeptContact] = useState('');
  const [newDeptPhone, setNewDeptPhone] = useState('');
  const [newDeptEmail, setNewDeptEmail] = useState('');

  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserDesig, setNewUserDesig] = useState('');
  const [newUserMobile, setNewUserMobile] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserDeptId, setNewUserDeptId] = useState('');

  // Handle Add Dept
  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptContact) return;
    const fresh: CustomerDepartment = {
      id: `dept-${Date.now()}`,
      customerId: customer.id,
      departmentCode: newDeptCode || `DEPT-${Math.floor(10 + Math.random() * 90)}`,
      name: newDeptName,
      contactPerson: newDeptContact,
      contactNumber: newDeptPhone || '+94 11 543 0000',
      email: newDeptEmail || customer.email
    };
    onAddDepartment(fresh);
    setShowDeptModal(false);
    showToast(`Added Department: ${newDeptName}`);
    setNewDeptName(''); setNewDeptCode(''); setNewDeptContact(''); setNewDeptPhone(''); setNewDeptEmail('');
  };

  // Handle Add End User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserMobile) return;
    const fresh: EndUserRecord = {
      id: `eu-${Date.now()}`,
      customerId: customer.id,
      departmentId: newUserDeptId || undefined,
      name: newUserName,
      designation: newUserDesig || 'Clinical Chemist',
      mobile: newUserMobile,
      email: newUserEmail || customer.email,
      location: customer.address,
      remarks: 'Enrolled via Customer Profile dossier.',
      isActive: true
    };
    onAddEndUser(fresh);
    setShowUserModal(false);
    showToast(`Enrolled Operator: ${newUserName}`);
    setNewUserName(''); setNewUserDesig(''); setNewUserMobile(''); setNewUserEmail(''); setNewUserDeptId('');
  };

  // Simulated static data for instruments, tickets, invoices, feedback
  const siteInstruments = [
    { id: 'inst-101', serial: 'SN-SHI-89201', name: 'Prominence-i LC-2030C 3D Plus', model: 'HPLC System', brand: 'SHIMADZU', dept: 'Pathology Diagnostic Lab', status: 'In Warranty', calStatus: 'Calibrated Traceable' },
    { id: 'inst-102', serial: 'SN-THR-40291', name: 'Vanquish Core LC System', model: 'UHPLC Core', brand: 'THERMO SCIENTIFIC', dept: 'Analytical Microbiology', status: 'Service Contract', calStatus: 'Calibrated Traceable' },
    { id: 'inst-103', serial: 'SN-AGI-11204', name: '1260 Infinity II LC', model: 'Chromatograph', brand: 'AGILENT', dept: 'Quality Control Wing', status: 'In Warranty', calStatus: 'Due Next Month' },
    { id: 'inst-104', serial: 'SN-SHI-55902', name: 'UV-1900i Spectrophotometer', model: 'UV-Vis Dual Beam', brand: 'SHIMADZU', dept: 'Pathology Diagnostic Lab', status: 'Out Of Warranty', calStatus: 'Calibrated Traceable' }
  ];

  const siteJobs = [
    { id: 'SR-2026-089', type: 'Breakdown Repair', title: 'High pressure fluctuation & check valve leakage', status: 'In Progress', priority: 'High', engineer: 'Eng. Tharindu K.', date: '2026-06-23' },
    { id: 'PM-2026-104', type: 'Preventive Maintenance', title: 'Comprehensive AMC Bi-Annual Service Run', status: 'Scheduled', priority: 'Medium', engineer: 'Eng. Keshara D.', date: '2026-06-28' },
    { id: 'CAL-2026-042', type: 'Trace Calibration', title: 'ISO 17025 Optical Wavelength Verification', status: 'Completed', priority: 'Low', engineer: 'Eng. Samantha P.', date: '2026-05-14' }
  ];

  const siteInvoices = [
    { no: 'INV-2026-892', date: '2026-06-15', desc: 'Spare Parts: Shimadzu Plunger Seal & Deuterium Lamp', amount: 'LKR 425,000', status: 'Paid' },
    { no: 'INV-2026-441', date: '2026-04-10', desc: 'Annual Comprehensive AMC Service Contract Renewal', amount: 'LKR 1,850,000', status: 'Paid' },
    { no: 'INV-2026-109', date: '2026-02-05', desc: 'Emergency Callout & Chromatography IQ/OQ Dossier', amount: 'LKR 280,000', status: 'Paid' }
  ];

  const siteFeedback = [
    { id: 'FB-901', job: 'CAL-2026-042', rEngine: 5, rComm: 5, rSkill: 5, rTime: 5, comments: 'Eng. Samantha arrived promptly. Certificates dispatched with zero delays.', date: '2026-05-15' },
    { id: 'FB-882', job: 'SR-2026-012', rEngine: 4, rComm: 5, rSkill: 5, rTime: 4, comments: 'Good technical troubleshooting on the autosampler needle jam.', date: '2026-03-22' }
  ];

  const siteDocs = [
    { name: 'Comprehensive AMC Master Agreement 2026.pdf', type: 'Service Contract', size: '2.8 MB', date: '2026-01-10' },
    { name: 'ISO 17025 Laboratory Accreditation Certificate.pdf', type: 'Compliance Dossier', size: '4.2 MB', date: '2026-03-01' },
    { name: 'Shimadzu HPLC Installation Qualification (IQ/OQ).zip', type: 'Validation Dossier', size: '18.5 MB', date: '2025-11-20' },
    { name: 'Standard Emergency Callout Protocol SOP-402.pdf', type: 'SOP Guidelines', size: '1.1 MB', date: '2026-02-14' }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003B75] text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-400/30 animate-fade-in-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Top Navigation Back Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Customers Directory
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>Profile ID:</span>
          <strong className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{customer.id}</strong>
        </div>
      </div>

      {/* Comprehensive Customer Master Detail Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none" />
        
        <div className="flex items-start gap-5">
          <div className="p-4 bg-gradient-to-tr from-[#003B75] to-[#0054A6] text-white rounded-2xl shadow-md shrink-0">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-black bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-250">
                {customer.customerCode || 'CUST-AV-101'}
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-[#0054A6] border border-blue-200 px-2.5 py-0.5 rounded uppercase tracking-wide">
                {customer.labType || customer.customerType || 'Clinical Laboratory'}
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                ● ACTIVE ACCOUNT
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
              {customer.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-sans pt-1">
              <span className="flex items-center gap-1 text-slate-700 font-semibold">
                <UserCheck className="w-3.5 h-3.5 text-[#0054A6]" /> {customer.contactPerson}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <PhoneCall className="w-3.5 h-3.5 text-slate-400" /> {customer.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {customer.email}
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <MapPin className="w-3.5 h-3.5" /> {customer.district || 'Colombo'} ({customer.province || 'Western Province'})
              </span>
            </div>
          </div>
        </div>

        {/* Territory Route Display */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 lg:text-right shrink-0 min-w-[240px]">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Service Territory Node</span>
          <div className="text-xs font-black text-[#0054A6] mt-0.5 flex items-center lg:justify-end gap-1.5">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>{customer.territory || 'Territory Alpha (Central Hub)'}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">SLA Response: 4 Hrs Emergency</span>
        </div>
      </div>

      {/* 8 Profile Tabs Navigation Bar */}
      <div className="bg-slate-100 p-1.5 rounded-xl flex flex-wrap gap-1 border border-slate-200 shadow-xs">
        <button
          onClick={() => setProfileTab('overview')}
          className={`flex-1 min-w-[110px] px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            profileTab === 'overview' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <Activity className="w-4 h-4" /> Overview
        </button>
        <button
          onClick={() => setProfileTab('departments')}
          className={`flex-1 min-w-[120px] px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            profileTab === 'departments' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Departments ({departments.length})
        </button>
        <button
          onClick={() => setProfileTab('endusers')}
          className={`flex-1 min-w-[110px] px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            profileTab === 'endusers' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <Users className="w-4 h-4" /> End Users ({endUsers.length})
        </button>
        <button
          onClick={() => setProfileTab('instruments')}
          className={`flex-1 min-w-[140px] px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            profileTab === 'instruments' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <Cpu className="w-4 h-4" /> Installed Instruments (4)
        </button>
        <button
          onClick={() => setProfileTab('jobs')}
          className={`flex-1 min-w-[110px] px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            profileTab === 'jobs' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Open Jobs (3)
        </button>
        <button
          onClick={() => setProfileTab('revenue')}
          className={`flex-1 min-w-[100px] px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            profileTab === 'revenue' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Revenue
        </button>
        <button
          onClick={() => setProfileTab('csat')}
          className={`flex-1 min-w-[110px] px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            profileTab === 'csat' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <Star className="w-4 h-4" /> Satisfaction
        </button>
        <button
          onClick={() => setProfileTab('documents')}
          className={`flex-1 min-w-[110px] px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            profileTab === 'documents' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <FileText className="w-4 h-4" /> Documents (4)
        </button>
      </div>

      {/* ========================================================
          TAB 1: OVERVIEW
          ======================================================== */}
      {profileTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 font-sans tracking-tight uppercase flex items-center gap-2 border-b pb-3">
                <Building2 className="w-4 h-4 text-[#0054A6]" /> Facility Master Coordinates
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Physical Address</span>
                  <p className="font-bold text-slate-800 mt-1 leading-normal">{customer.address}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Administrative Region</span>
                  <p className="font-bold text-slate-800 mt-1">City/District: {customer.city || customer.district || 'Colombo'}</p>
                  <p className="text-slate-500 mt-0.5">Province: {customer.province || 'Western Province'}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Liaison Contact Person</span>
                  <p className="font-bold text-[#0054A6] mt-1">{customer.contactPerson}</p>
                  <p className="text-slate-500 font-mono mt-0.5">{customer.phone}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Official Dispatch Email</span>
                  <p className="font-bold text-slate-800 mt-1 truncate">{customer.email}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">● Verified Dispatch Channel</p>
                </div>
              </div>
            </div>

            {/* Account Notes */}
            <div className="bg-blue-50/40 rounded-2xl border border-blue-150 p-6 space-y-3">
              <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Layers className="w-4 h-4 text-[#0054A6]" /> Service SLA Agreement Dossier
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                This account is covered under the **AVON Comprehensive Gold AMC Master Protocol**. All chromatography breakdown callouts require on-site engineer attendance within 4 working hours. Spare parts replacements carry a standard 12-month ISO manufacturer warranty.
              </p>
            </div>
          </div>

          {/* Right Column: Key Metrology KPIs */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg space-y-4 border border-slate-800">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">Account Telemetry Summary</h4>
              
              <div className="space-y-3 divide-y divide-slate-800 text-xs">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Total Billed YTD</span>
                  <strong className="font-mono text-base font-bold text-white">LKR 2.55M</strong>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Installed HPLC / UV Base</span>
                  <strong className="font-mono text-emerald-400 font-bold">4 Instruments</strong>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Active Lab Departments</span>
                  <strong className="font-bold text-blue-300">{departments.length} Departments</strong>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Enrolled Chemists</span>
                  <strong className="font-bold text-pink-300">{endUsers.length} Operators</strong>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">CSAT Score Index</span>
                  <strong className="font-mono text-amber-300 font-bold">96.4% Excellent</strong>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB 2: DEPARTMENTS
          ======================================================== */}
      {profileTab === 'departments' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Laboratory Departments under {customer.name}</h3>
              <p className="text-xs text-slate-400">Separate diagnostic wings, chemistry labs, or microbiology research rooms.</p>
            </div>
            <button
              onClick={() => setShowDeptModal(true)}
              className="px-3.5 py-2 bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          </div>

          {showDeptModal && (
            <form onSubmit={handleCreateDept} className="bg-indigo-50/60 p-6 rounded-2xl border border-indigo-200 space-y-4 animate-fade-in-down">
              <div className="flex justify-between items-center border-b border-indigo-200 pb-2">
                <h4 className="text-xs font-extrabold text-indigo-900 uppercase font-mono">Register New Department Master</h4>
                <button type="button" onClick={() => setShowDeptModal(false)} className="text-indigo-700 font-bold">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">Department Code</label>
                  <input
                    type="text"
                    className="w-full bg-white border rounded p-2 text-xs font-mono"
                    placeholder="e.g. DEPT-QA-01"
                    value={newDeptCode}
                    onChange={e => setNewDeptCode(e.target.value)}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">Department Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border rounded p-2 text-xs"
                    placeholder="e.g. Chromatography QA Wing"
                    value={newDeptName}
                    onChange={e => setNewDeptName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">Contact Person *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border rounded p-2 text-xs"
                    placeholder="e.g. Mrs. Priyanthi Perera"
                    value={newDeptContact}
                    onChange={e => setNewDeptContact(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">Contact Number</label>
                  <input
                    type="text"
                    className="w-full bg-white border rounded p-2 text-xs font-mono"
                    placeholder="+94 11 250 0000"
                    value={newDeptPhone}
                    onChange={e => setNewDeptPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">Department Email</label>
                  <input
                    type="email"
                    className="w-full bg-white border rounded p-2 text-xs"
                    placeholder="dept@lab.com"
                    value={newDeptEmail}
                    onChange={e => setNewDeptEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowDeptModal(false)} className="px-3 py-1.5 border rounded text-xs bg-white">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-650 text-white font-bold text-xs rounded hover:bg-indigo-700 cursor-pointer">Save Department</button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-xl border overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b text-[10px] font-mono text-slate-400 uppercase">
                <tr>
                  <th className="p-3.5 pl-4">Department Code</th>
                  <th className="p-3.5">Department Name</th>
                  <th className="p-3.5">Contact Representative</th>
                  <th className="p-3.5">Direct Hotline</th>
                  <th className="p-3.5">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3.5 pl-4 font-mono font-bold text-indigo-700">{d.departmentCode || 'DEPT-101'}</td>
                    <td className="p-3.5 font-bold text-slate-900">{d.name}</td>
                    <td className="p-3.5 text-slate-700">{d.contactPerson}</td>
                    <td className="p-3.5 font-mono">{d.contactNumber}</td>
                    <td className="p-3.5 text-slate-500">{d.email || customer.email}</td>
                  </tr>
                ))}
                {departments.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">No departments mapped. Click Add Department above.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: END USERS
          ======================================================== */}
      {profileTab === 'endusers' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Enrolled Chemists & Operators</h3>
              <p className="text-xs text-slate-400">Authorized personnel permitted to sign calibration certificates.</p>
            </div>
            <button
              onClick={() => setShowUserModal(true)}
              className="px-3.5 py-2 bg-pink-650 hover:bg-pink-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Enroll End User
            </button>
          </div>

          {showUserModal && (
            <form onSubmit={handleCreateUser} className="bg-pink-50/60 p-6 rounded-2xl border border-pink-200 space-y-4 animate-fade-in-down">
              <div className="flex justify-between items-center border-b border-pink-200 pb-2">
                <h4 className="text-xs font-extrabold text-pink-900 uppercase font-mono">Enroll New End User Master</h4>
                <button type="button" onClick={() => setShowUserModal(false)} className="text-pink-700 font-bold">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border rounded p-2 text-xs"
                    placeholder="e.g. Dr. Keshara Wijewardene"
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">Designation</label>
                  <input
                    type="text"
                    className="w-full bg-white border rounded p-2 text-xs"
                    placeholder="Senior Biochemist"
                    value={newUserDesig}
                    onChange={e => setNewUserDesig(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border rounded p-2 text-xs font-mono"
                    placeholder="+94 77 000 0000"
                    value={newUserMobile}
                    onChange={e => setNewUserMobile(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">Email</label>
                  <input
                    type="email"
                    className="w-full bg-white border rounded p-2 text-xs"
                    placeholder="user@lab.com"
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">Affiliated Lab Department</label>
                  <select
                    className="w-full bg-white border rounded p-2 text-xs"
                    value={newUserDeptId}
                    onChange={e => setNewUserDeptId(e.target.value)}
                  >
                    <option value="">General Facility Operator</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-3 py-1.5 border rounded text-xs bg-white">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-pink-650 text-white font-bold text-xs rounded hover:bg-pink-700 cursor-pointer">Enroll Operator</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {endUsers.map(u => {
              const uDept = departments.find(d => d.id === u.departmentId);
              return (
                <div key={u.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{u.name}</h4>
                      <span className="text-[9px] bg-pink-50 text-pink-700 font-mono font-bold px-2 py-0.5 rounded border border-pink-200">{u.designation || 'Chemist'}</span>
                    </div>
                    <p className="text-xs font-mono text-slate-500">📱 {u.mobile}</p>
                    <p className="text-xs text-slate-400 truncate">✉️ {u.email || customer.email}</p>
                    {uDept && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mt-1">🏷️ {uDept.name}</span>}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Active</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: INSTALLED INSTRUMENTS
          ======================================================== */}
      {profileTab === 'instruments' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white rounded-xl border overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b font-bold text-xs text-slate-700 font-sans flex justify-between">
              <span>Installed Instrumentation Base at {customer.name}</span>
              <span className="font-mono text-emerald-600 font-bold">4 Analytical Units</span>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/60 border-b text-[10px] font-mono text-slate-500 uppercase">
                <tr>
                  <th className="p-3.5 pl-4">Serial Number</th>
                  <th className="p-3.5">Instrument Model</th>
                  <th className="p-3.5">Brand</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Warranty Status</th>
                  <th className="p-3.5 text-right pr-4">Calibration Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siteInstruments.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50">
                    <td className="p-3.5 pl-4 font-mono font-bold text-slate-800">{i.serial}</td>
                    <td className="p-3.5 font-bold text-slate-900">{i.name} ({i.model})</td>
                    <td className="p-3.5 font-bold text-[#0054A6]">{i.brand}</td>
                    <td className="p-3.5 text-slate-600">{i.dept}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 border">{i.status}</span>
                    </td>
                    <td className="p-3.5 text-right pr-4 font-mono font-bold">
                      <span className={i.calStatus.includes('Due') ? 'text-amber-600' : 'text-emerald-600'}>
                        {i.calStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: OPEN JOBS
          ======================================================== */}
      {profileTab === 'jobs' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 gap-3">
            {siteJobs.map(j => (
              <div key={j.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded border">{j.id}</span>
                    <span className="text-[10px] font-bold bg-blue-50 text-[#0054A6] px-2 py-0.5 rounded uppercase">{j.type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      j.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>Priority: {j.priority}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 pt-1">{j.title}</h4>
                  <p className="text-xs text-slate-500 font-sans">Assigned Engineer: <strong className="text-slate-700">{j.engineer}</strong> | Logged: {j.date}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100/60 px-3 py-1.5 rounded-xl">{j.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 6: REVENUE
          ======================================================== */}
      {profileTab === 'revenue' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border shadow-xs">
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Total YTD Billed</span>
              <h3 className="text-2xl font-black text-slate-900 font-sans mt-1">LKR 2,555,000</h3>
              <span className="text-[10px] text-emerald-600 font-semibold">● All Invoices Cleared</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-xs">
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Active Service AMC</span>
              <h3 className="text-base font-black text-[#0054A6] font-sans mt-2">Comprehensive Gold Protocol</h3>
              <span className="text-[10px] text-slate-400 font-mono">Expires: Dec 31, 2026</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-xs">
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Average Ticket Bill</span>
              <h3 className="text-2xl font-black text-slate-900 font-sans mt-1">LKR 380,000</h3>
              <span className="text-[10px] text-slate-400">Spare parts share 42%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b font-bold text-xs text-slate-700">Billing & Invoices Ledger</div>
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/50 border-b text-[10px] font-mono text-slate-500 uppercase">
                <tr>
                  <th className="p-3.5 pl-4">Invoice No</th>
                  <th className="p-3.5">Date Billed</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Amount Billed</th>
                  <th className="p-3.5 text-right pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siteInvoices.map(inv => (
                  <tr key={inv.no} className="hover:bg-slate-50">
                    <td className="p-3.5 pl-4 font-mono font-bold text-slate-800">{inv.no}</td>
                    <td className="p-3.5 font-mono text-slate-500">{inv.date}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{inv.desc}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">{inv.amount}</td>
                    <td className="p-3.5 text-right pr-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 7: CUSTOMER SATISFACTION (CSAT)
          ======================================================== */}
      {profileTab === 'csat' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-purple-200 uppercase tracking-widest">Aggregate Rating Score</span>
              <h2 className="text-3xl font-black font-sans">4.8 / 5.0 ⭐ Excellent</h2>
              <p className="text-xs text-purple-200">Based on post-job electronic signature sign-off surveys.</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-amber-300 font-mono">+74</span>
              <span className="block text-[10px] text-purple-200 uppercase font-mono">Net Promoter Score</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase font-mono">Verified Feedback Submissions</h4>
            {siteFeedback.map(f => (
              <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b pb-2 text-xs font-mono">
                  <span className="font-bold text-[#0054A6]">Feedback #{f.id} (Job: {f.job})</span>
                  <span className="text-slate-400">{f.date}</span>
                </div>
                <p className="text-xs font-sans text-slate-800 italic leading-relaxed">"{f.comments}"</p>
                <div className="flex flex-wrap gap-3 text-[11px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-lg border">
                  <span>Engineer: ⭐ {f.rEngine}/5</span>
                  <span>Comm: ⭐ {f.rComm}/5</span>
                  <span>Technical: ⭐ {f.rSkill}/5</span>
                  <span>Response: ⭐ {f.rTime}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 8: DOCUMENTS
          ======================================================== */}
      {profileTab === 'documents' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Compliance & Contract Repository</h3>
              <p className="text-xs text-slate-400">Download active gold SLA agreements and IQ/OQ validation dossiers.</p>
            </div>
            <button
              onClick={() => showToast("📂 Simulation: Upload Compliance Dossier dialog opened.")}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-blue-400" /> Upload Document
            </button>
          </div>

          <div className="bg-white rounded-xl border overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b text-[10px] font-mono text-slate-400 uppercase">
                <tr>
                  <th className="p-3.5 pl-4">Document Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">File Size</th>
                  <th className="p-3.5">Uploaded Date</th>
                  <th className="p-3.5 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siteDocs.map(doc => (
                  <tr key={doc.name} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 pl-4 font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0054A6]" /> {doc.name}
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded">{doc.type}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">{doc.size}</td>
                    <td className="p-3.5 font-mono text-slate-500">{doc.date}</td>
                    <td className="p-3.5 text-right pr-4">
                      <button
                        onClick={() => showToast(`📥 Downloading ${doc.name}...`)}
                        className="px-2.5 py-1 bg-blue-50 text-[#0054A6] hover:bg-[#0054A6] hover:text-white rounded font-bold text-xs transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
