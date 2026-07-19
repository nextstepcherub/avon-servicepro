import React, { useState, useMemo } from 'react';
import { 
  InstallationRequest, 
  InstallationRequestStatus 
} from '../../types';
import { SPRINT_5_1_INSTALLATION_REQUESTS_SQL } from '../../data/sprint51InstallationRequestDbLayer';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Database, 
  FileText, 
  Building2, 
  Wrench, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Copy, 
  Check, 
  X, 
  DollarSign, 
  UserCheck,
  Tag,
  Hash
} from 'lucide-react';

interface InstallationRequestMasterProps {
  requests: InstallationRequest[];
  onAddRequest: (req: InstallationRequest) => void;
  onUpdateRequest: (req: InstallationRequest) => void;
  onDeleteRequest: (id: string) => void;
}

const BRANDS_LIST = ['SHIMADZU', 'THERMO SCIENTIFIC', 'AGILENT', 'EPPENDORF', 'AVON SPEC'] as const;
const STATUSES_LIST: InstallationRequestStatus[] = ['Pending Assignment', 'Assigned', 'Scheduled', 'Installed', 'Closed'];

export default function InstallationRequestMaster({
  requests,
  onAddRequest,
  onUpdateRequest,
  onDeleteRequest
}: InstallationRequestMasterProps) {

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form Data state holding all Sprint 5.1 requested fields
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    invoiceValue: '',
    customerName: '',
    departmentName: '',
    endUserName: '',
    instrumentName: '',
    brand: 'SHIMADZU' as string,
    model: '',
    serialNumber: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    warrantyPeriod: '12',
    warrantyUnit: 'Months' as 'Months' | 'Years' | 'Days',
    remarks: '',
    status: 'Pending Assignment' as InstallationRequestStatus
  });

  // Validation errors state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reset Form
  const resetForm = () => {
    setFormData({
      invoiceNumber: '',
      invoiceValue: '',
      customerName: '',
      departmentName: '',
      endUserName: '',
      instrumentName: '',
      brand: 'SHIMADZU',
      model: '',
      serialNumber: '',
      deliveryDate: new Date().toISOString().split('T')[0],
      warrantyPeriod: '12',
      warrantyUnit: 'Months',
      remarks: '',
      status: 'Pending Assignment'
    });
    setFormErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  // Open Edit
  const handleOpenEdit = (req: InstallationRequest) => {
    setFormData({
      invoiceNumber: req.invoiceNumber,
      invoiceValue: req.invoiceValue.toString(),
      customerName: req.customerName,
      departmentName: req.departmentName,
      endUserName: req.endUserName,
      instrumentName: req.instrumentName,
      brand: req.brand,
      model: req.model,
      serialNumber: req.serialNumber,
      deliveryDate: req.deliveryDate,
      warrantyPeriod: req.warrantyPeriod.toString(),
      warrantyUnit: req.warrantyUnit,
      remarks: req.remarks || '',
      status: req.status
    });
    setFormErrors({});
    setEditingId(req.id);
    setShowForm(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.invoiceNumber.trim()) {
      errors.invoiceNumber = 'Invoice Number is required';
    }
    if (!formData.customerName.trim()) {
      errors.customerName = 'Customer organization is required';
    }
    if (!formData.departmentName.trim()) {
      errors.departmentName = 'Department name is required';
    }
    if (!formData.endUserName.trim()) {
      errors.endUserName = 'Clinical End User / Contact Person is required';
    }
    if (!formData.instrumentName.trim()) {
      errors.instrumentName = 'Instrument general name is required';
    }
    if (!formData.model.trim()) {
      errors.model = 'Model specification is required';
    }
    if (!formData.serialNumber.trim()) {
      errors.serialNumber = 'Unique Serial Number is required';
    } else {
      // Check duplicate serial number if adding new
      const isDuplicate = requests.some(
        r => r.serialNumber.toLowerCase() === formData.serialNumber.trim().toLowerCase() && r.id !== editingId
      );
      if (isDuplicate) {
        errors.serialNumber = 'Serial Number already exists in registry';
      }
    }

    const numericValue = parseFloat(formData.invoiceValue);
    if (isNaN(numericValue) || numericValue < 0) {
      errors.invoiceValue = 'Enter a valid positive invoice amount';
    }

    const numericWarranty = parseInt(formData.warrantyPeriod, 10);
    if (isNaN(numericWarranty) || numericWarranty < 0) {
      errors.warrantyPeriod = 'Enter a valid warranty duration';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const now = new Date().toISOString();
    const payload: InstallationRequest = {
      id: editingId || `ireq-${Date.now()}`,
      invoiceNumber: formData.invoiceNumber.trim(),
      invoiceValue: parseFloat(formData.invoiceValue) || 0,
      customerName: formData.customerName.trim(),
      departmentName: formData.departmentName.trim(),
      endUserName: formData.endUserName.trim(),
      instrumentName: formData.instrumentName.trim(),
      brand: formData.brand,
      model: formData.model.trim(),
      serialNumber: formData.serialNumber.trim(),
      deliveryDate: formData.deliveryDate,
      warrantyPeriod: parseInt(formData.warrantyPeriod, 10) || 12,
      warrantyUnit: formData.warrantyUnit,
      remarks: formData.remarks.trim() || undefined,
      status: formData.status,
      createdAt: editingId ? (requests.find(r => r.id === editingId)?.createdAt || now) : now,
      updatedAt: now
    };

    if (editingId) {
      onUpdateRequest(payload);
    } else {
      onAddRequest(payload);
    }

    resetForm();
  };

  // Copy SQL Handler
  const handleCopySql = () => {
    navigator.clipboard.writeText(SPRINT_5_1_INSTALLATION_REQUESTS_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Filtered List
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchSearch = 
        req.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.instrumentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'ALL' || req.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  // KPI Metrics
  const stats = useMemo(() => {
    const total = requests.length;
    const pendingAssignment = requests.filter(r => r.status === 'Pending Assignment').length;
    const inProgress = requests.filter(r => r.status === 'Assigned' || r.status === 'Scheduled').length;
    const completed = requests.filter(r => r.status === 'Installed' || r.status === 'Closed').length;
    const totalValue = requests.reduce((acc, r) => acc + (r.invoiceValue || 0), 0);

    return { total, pendingAssignment, inProgress, completed, totalValue };
  }, [requests]);

  // Format Currency
  const formatLkr = (val: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title & Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-indigo-900/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
              Sprint 5.1 Output
            </span>
            <span className="text-xs font-mono text-indigo-300/80">Supabase Postgres Table: installation_requests</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1">Installation Request Master</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Master repository for customer laboratory equipment deliveries awaiting pre-installation checks, site alignment, and engineer assignment.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowSqlModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Supabase SQL DDL</span>
          </button>

          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2 bg-[#0054A6] hover:bg-[#004385] text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Request Order</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Total Master Orders</span>
            <span className="text-xl font-black text-slate-900">{stats.total}</span>
          </div>
        </div>

        <div id="kpi-master-pending-assignment" className="bg-amber-50/70 p-4.5 rounded-xl border border-amber-200 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-sm animate-pulse">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-amber-700 tracking-wider block">Pending Assignment</span>
            <span className="text-xl font-black text-amber-900">{stats.pendingAssignment}</span>
            <span className="text-[9px] text-amber-700 font-semibold block leading-none mt-0.5">Awaiting Ops Dispatch</span>
          </div>
        </div>

        <div className="bg-indigo-50/60 p-4.5 rounded-xl border border-indigo-150 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-sm">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 tracking-wider block">Active Pipeline</span>
            <span className="text-xl font-black text-indigo-950">{stats.inProgress}</span>
            <span className="text-[9px] text-indigo-600 font-semibold block leading-none mt-0.5">Assigned & Scheduled</span>
          </div>
        </div>

        <div className="bg-emerald-50/60 p-4.5 rounded-xl border border-emerald-150 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 tracking-wider block">Completed Sign-offs</span>
            <span className="text-xl font-black text-emerald-950">{stats.completed}</span>
            <span className="text-[9px] text-emerald-600 font-semibold block leading-none mt-0.5">Installed & Closed</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3.5 sm:col-span-2 lg:col-span-1">
          <div className="p-3 bg-cyan-50 text-cyan-700 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block truncate">Total Invoice Pipeline</span>
            <span className="text-base font-black font-mono text-slate-800 truncate block mt-0.5">{formatLkr(stats.totalValue)}</span>
          </div>
        </div>
      </div>

      {/* Form Panel (Sliding / Collapsible Drawer Box) */}
      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-[#0054A6] shadow-xl overflow-hidden animate-fade-in">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-black tracking-wide">
                {editingId ? 'Edit Installation Request Master' : 'Create New Installation Request Master'}
              </h3>
            </div>
            <button
              onClick={resetForm}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
            
            {/* Inline Validation Banner if errors exist */}
            {Object.keys(formErrors).length > 0 && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Form Validation Failed</span>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px]">
                    {Object.values(formErrors).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Section 1: Commercial Identifiers */}
            <div>
              <h4 className="text-xs font-bold font-mono text-indigo-900 uppercase tracking-wider pb-2 border-b border-slate-100 mb-3 flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-indigo-600" />
                <span>1. Invoice & Commercial Information</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tax Invoice Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INV-2026-9012"
                    value={formData.invoiceNumber}
                    onChange={e => setFormData(p => ({ ...p, invoiceNumber: e.target.value }))}
                    className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.invoiceNumber ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.invoiceNumber && <span className="text-[10px] text-rose-500 mt-0.5 block font-medium">{formErrors.invoiceNumber}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Invoice Value (LKR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 4500000"
                    value={formData.invoiceValue}
                    onChange={e => setFormData(p => ({ ...p, invoiceValue: e.target.value }))}
                    className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.invoiceValue ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.invoiceValue && <span className="text-[10px] text-rose-500 mt-0.5 block font-medium">{formErrors.invoiceValue}</span>}
                </div>
              </div>
            </div>

            {/* Section 2: Stakeholders */}
            <div>
              <h4 className="text-xs font-bold font-mono text-indigo-900 uppercase tracking-wider pb-2 border-b border-slate-100 mb-3 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>2. Customer & End User Hierarchy</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Organization <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Asiri Surgical Hospital"
                    value={formData.customerName}
                    onChange={e => setFormData(p => ({ ...p, customerName: e.target.value }))}
                    className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.customerName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.customerName && <span className="text-[10px] text-rose-500 mt-0.5 block font-medium">{formErrors.customerName}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Laboratory Department <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Molecular Diagnostics"
                    value={formData.departmentName}
                    onChange={e => setFormData(p => ({ ...p, departmentName: e.target.value }))}
                    className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.departmentName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.departmentName && <span className="text-[10px] text-rose-500 mt-0.5 block font-medium">{formErrors.departmentName}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Clinical End User / Contact <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Chandika Perera"
                    value={formData.endUserName}
                    onChange={e => setFormData(p => ({ ...p, endUserName: e.target.value }))}
                    className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.endUserName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.endUserName && <span className="text-[10px] text-rose-500 mt-0.5 block font-medium">{formErrors.endUserName}</span>}
                </div>
              </div>
            </div>

            {/* Section 3: Equipment */}
            <div>
              <h4 className="text-xs font-bold font-mono text-indigo-900 uppercase tracking-wider pb-2 border-b border-slate-100 mb-3 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span>3. Equipment Specifications</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Instrument General Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Thermal Cycler"
                    value={formData.instrumentName}
                    onChange={e => setFormData(p => ({ ...p, instrumentName: e.target.value }))}
                    className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.instrumentName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.instrumentName && <span className="text-[10px] text-rose-500 mt-0.5 block font-medium">{formErrors.instrumentName}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand
                  </label>
                  <select
                    value={formData.brand}
                    onChange={e => setFormData(p => ({ ...p, brand: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-indigo-900"
                  >
                    {BRANDS_LIST.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Model <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. QuantStudio 5"
                    value={formData.model}
                    onChange={e => setFormData(p => ({ ...p, model: e.target.value }))}
                    className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.model ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.model && <span className="text-[10px] text-rose-500 mt-0.5 block font-medium">{formErrors.model}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Serial Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SN-8841029"
                    value={formData.serialNumber}
                    onChange={e => setFormData(p => ({ ...p, serialNumber: e.target.value }))}
                    className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono ${
                      formErrors.serialNumber ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.serialNumber && <span className="text-[10px] text-rose-500 mt-0.5 block font-medium">{formErrors.serialNumber}</span>}
                </div>
              </div>
            </div>

            {/* Section 4: Delivery & Warranty */}
            <div>
              <h4 className="text-xs font-bold font-mono text-indigo-900 uppercase tracking-wider pb-2 border-b border-slate-100 mb-3 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>4. Delivery Date & Warranty Coverage</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={e => setFormData(p => ({ ...p, deliveryDate: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Warranty Period (Numeric)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 12"
                    value={formData.warrantyPeriod}
                    onChange={e => setFormData(p => ({ ...p, warrantyPeriod: e.target.value }))}
                    className={`w-full text-xs p-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.warrantyPeriod ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.warrantyPeriod && <span className="text-[10px] text-rose-500 mt-0.5 block font-medium">{formErrors.warrantyPeriod}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Warranty Unit
                  </label>
                  <select
                    value={formData.warrantyUnit}
                    onChange={e => setFormData(p => ({ ...p, warrantyUnit: e.target.value as any }))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  >
                    <option value="Months">Months</option>
                    <option value="Years">Years</option>
                    <option value="Days">Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Order Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(p => ({ ...p, status: e.target.value as InstallationRequestStatus }))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-black text-[#0054A6]"
                  >
                    {STATUSES_LIST.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 5: Remarks */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Remarks & Pre-Installation Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Site inspection requirements, gas cylinder delivery, or evening shift constraints..."
                value={formData.remarks}
                onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-black text-white bg-[#0054A6] hover:bg-[#004385] rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? 'Save Changes' : 'Register Installation Master'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Table Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Toolbar Header Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice #, client, equipment, or SN..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] font-bold text-slate-600">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs font-extrabold text-indigo-900 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses ({requests.length})</option>
                {STATUSES_LIST.map(st => (
                  <option key={st} value={st}>{st} ({requests.filter(r => r.status === st).length})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 text-slate-600 text-[10px] font-mono uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 font-bold">Invoice / Commercial</th>
                <th className="py-3 px-4 font-bold">Customer Hierarchy</th>
                <th className="py-3 px-4 font-bold">Instrument Specification</th>
                <th className="py-3 px-4 font-bold">Delivery</th>
                <th className="py-3 px-4 font-bold">Warranty</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-xs font-sans">
              {filteredRequests.length > 0 ? (
                filteredRequests.map(req => {
                  
                  // Status badge coloring
                  const getStatusBadge = (st: InstallationRequestStatus) => {
                    switch (st) {
                      case 'Pending Assignment':
                        return <span className="bg-amber-100 text-amber-800 border border-amber-300/80 px-2.5 py-0.5 rounded-full font-black text-[10px] animate-pulse">Pending Assignment</span>;
                      case 'Assigned':
                        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Assigned</span>;
                      case 'Scheduled':
                        return <span className="bg-cyan-100 text-cyan-800 border border-cyan-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Scheduled</span>;
                      case 'Installed':
                        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Installed</span>;
                      case 'Closed':
                        return <span className="bg-slate-200 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">Closed</span>;
                    }
                  };

                  return (
                    <tr key={req.id} className="hover:bg-indigo-50/30 transition-colors group">
                      
                      {/* Invoice */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-mono font-bold text-indigo-900 block">{req.invoiceNumber}</span>
                        <span className="text-[11px] font-mono text-slate-500 block mt-0.5">{formatLkr(req.invoiceValue)}</span>
                      </td>

                      {/* Stakeholders */}
                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <span className="font-extrabold text-slate-900 block truncate">{req.customerName}</span>
                        <span className="text-[11px] text-slate-600 font-semibold block truncate mt-0.5">📂 {req.departmentName}</span>
                        <span className="text-[10px] text-slate-400 block truncate mt-0.5">👤 {req.endUserName}</span>
                      </td>

                      {/* Instrument */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="bg-blue-50 text-[#0054A6] border border-blue-200 px-1.5 py-0.2 rounded text-[9px] font-mono font-black">
                            {req.brand}
                          </span>
                        </div>
                        <span className="font-bold text-slate-800 block">{req.instrumentName}</span>
                        <span className="text-[11px] text-slate-600 block mt-0.5">Model: <strong className="text-slate-900 font-mono">{req.model}</strong></span>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">SN: {req.serialNumber}</span>
                      </td>

                      {/* Delivery */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="font-mono text-slate-700 font-semibold">{req.deliveryDate}</span>
                      </td>

                      {/* Warranty */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-lg text-[11px] font-bold font-mono inline-block">
                          {req.warrantyPeriod} {req.warrantyUnit}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        {getStatusBadge(req.status)}
                        {req.remarks && (
                          <div className="mt-1.5 max-w-[160px]">
                            <p className="text-[10px] text-slate-500 bg-slate-100 p-1 rounded leading-tight line-clamp-2" title={req.remarks}>
                              💬 {req.remarks}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(req)}
                            className="p-1.5 hover:bg-indigo-100 text-slate-500 hover:text-indigo-700 rounded-lg transition-colors cursor-pointer"
                            title="Edit Master Record"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete installation request ${req.invoiceNumber} (${req.serialNumber})?`)) {
                                onDeleteRequest(req.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete Master Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-600">No Installation Request Master Records Found</p>
                    <p className="text-xs mt-0.5">Try clearing filters or click 'New Request Order' above.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supabase SQL Console Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-black text-white">Sprint 5.1 – Supabase PostgreSQL Table DDL</h3>
                  <p className="text-[11px] font-mono text-slate-400">Target Table: public.installation_requests</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 border border-slate-600 cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                </button>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-950/50">
              <pre className="text-xs font-mono text-cyan-300 bg-slate-900 p-5 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed select-all">
                {SPRINT_5_1_INSTALLATION_REQUESTS_SQL}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
