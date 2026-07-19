import React, { useState, useEffect } from 'react';
import { Instrument, Customer, UserProfile } from '../../types';
import { safeLocalStorage } from '../../lib/safeStorage';
import { SPRINT_4_1_INSTRUMENTS_SQL } from '../../data/sprint41InstrumentRegistryDbLayer';
import { 
  Plus, 
  Search, 
  Microscope, 
  Trash2, 
  ShieldAlert, 
  BadgeCheck, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  Calendar, 
  Clock, 
  X, 
  PlusCircle, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  ClipboardList,
  Database,
  Copy,
  Edit3,
  Wrench,
  Sparkles,
  ChevronRight,
  User,
  Users,
  Building2,
  Play,
  Layers,
  ArrowUpRight,
  Tv,
  ListRestart,
  Zap,
  Code,
  Table,
  Save,
  History,
  CheckCircle2
} from 'lucide-react';

import {
  NEXTJS_INSTRUMENT_PAGE_CODE,
  NEXTJS_INSTRUMENT_ACTIONS_CODE,
  NEXTJS_INSTRUMENT_FORMS_CODE,
  NEXTJS_INSTRUMENT_TABLES_CODE,
  SUPABASE_INSTRUMENT_SQL_CODE
} from '../../data/nextjsInstrumentData';

import { canDecommission as authCanDecommission, canRegister as authCanRegister } from '../../utils/authHelpers';
import { WarrantyActivationEngine } from './WarrantyActivationEngine';
import { WarrantyServiceScheduler } from './WarrantyServiceScheduler';

interface InstrumentRegistryProps {
  instruments: Instrument[];
  customers: Customer[];
  onAddInstrument: (instrument: Instrument) => void;
  onDecommissionInstrument: (id: string) => void;
  currentUser: UserProfile;
}

// Sri Lankan administrative territories from state
interface StateTerritory {
  id: string;
  name: string;
  province: string;
  assignedEngineer: string;
}

const CONSTANT_TERRITORIES: StateTerritory[] = [
  { id: "terr-1", name: "Colombo Metro Division", province: "Western Province", assignedEngineer: "Eng. Suresh Perera" },
  { id: "terr-2", name: "Central Hill Country", province: "Central Province", assignedEngineer: "Eng. Nimani Senanayake" },
  { id: "terr-3", name: "Southern Coastal Belt", province: "Southern Province", assignedEngineer: "Eng. Kanishka Jayasundera" },
  { id: "terr-4", name: "Industrial North Western Shore", province: "North Western Province", assignedEngineer: "Eng. Dilhan Gunawardena" },
  { id: "terr-5", name: "Sabaragamuwa Highlands", province: "Sabaragamuwa Province", assignedEngineer: "Eng. Fathima Rizna" }
];

export default function InstrumentRegistry({ 
  instruments, 
  customers, 
  onAddInstrument, 
  onDecommissionInstrument,
  currentUser 
}: InstrumentRegistryProps) {

  // --- Dynamic Unified Local State Initializer ---
  const [localInstruments, setLocalInstruments] = useState<Instrument[]>(() => {
    const saved = safeLocalStorage.getItem('avon_local_instruments_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing local instruments', e);
      }
    }
    // Seed default instruments with correct values
    return instruments.map((inst, index) => {
      let deptText = inst.department || "Biochemistry";
      // Associate preset end-users and territories for realism based on index
      return {
        ...inst,
        invoiceNumber: inst.invoiceNumber || `INV-AV-${10940 + index}`,
        invoiceValue: inst.invoiceValue || (1800000 + (index * 650000)),
        endUser: inst.endUser || (index === 0 ? "Dr. Keshara Wijewardene" : index === 1 ? "Tharindu Gunaratne" : "Fathima Yasmin"),
        assignedTerritory: inst.assignedTerritory || (index === 1 ? "Southern Coastal Belt" : "Colombo Metro Division"),
        assignedEngineerName: inst.assignedEngineerName || (index === 1 ? "Eng. Kanishka Jayasundera" : "Eng. Suresh Perera"),
        assignedEngineerId: inst.assignedEngineerId || (index === 1 ? "eng-3" : "eng-1"),
        warrantyPeriod: inst.warrantyPeriod || 12,
        serviceInterval: inst.serviceInterval || 6,
        attachments: inst.attachments || [
          { id: `att-1-${index}`, name: `${inst.brand.toLowerCase()}_${inst.model.toLowerCase()}_manual.pdf`, type: "User Manual", uploadedAt: "2024-02-20", size: "4.2 MB" },
          { id: `att-2-${index}`, name: `calibration_certificate_approved.pdf`, type: "Calibration Certificate", uploadedAt: "2024-03-15", size: "1.8 MB" }
        ]
      };
    });
  });

  // Load complementary customer departments & end-users lists to allow dynamic linking
  const [savedDepartments, setSavedDepartments] = useState<any[]>(() => {
    const saved = safeLocalStorage.getItem('avon_departments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [savedEndUsers, setSavedEndUsers] = useState<any[]>(() => {
    const saved = safeLocalStorage.getItem('avon_end_users_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Save changes to localStorage
  useEffect(() => {
    safeLocalStorage.setItem('avon_local_instruments_v2', JSON.stringify(localInstruments));
  }, [localInstruments]);

  // Handle system level sync triggers
  const triggerSysSync = () => {
    const savedDept = safeLocalStorage.getItem('avon_departments');
    const savedUsers = safeLocalStorage.getItem('avon_end_users_v2');
    if (savedDept) setSavedDepartments(JSON.parse(savedDept));
    if (savedUsers) setSavedEndUsers(JSON.parse(savedUsers));
  };

  // Tab and navigation control structure
  const [currentTab, setCurrentTab] = useState<'registry' | 'supabase' | 'nextjs' | 'warranty-activation' | 'warranty-scheduler'>('nextjs');
  const [nextjsSubTab, setNextjsSubTab] = useState<'pages' | 'actions' | 'forms' | 'tables' | 'sql'>('pages');
  const [instToastMsg, setInstToastMsg] = useState<string | null>(null);

  const showInstToast = (msg: string) => {
    setInstToastMsg(msg);
    setTimeout(() => setInstToastMsg(null), 4000);
  };

  // Dynamic Query Filter Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('ALL');
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedTerritoryFilter, setSelectedTerritoryFilter] = useState<string>('ALL');
  const [selectedWarrantyFilter, setSelectedWarrantyFilter] = useState<string>('ALL');

  // Multi-Form States (Add / Edit)
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modular form state holding all fields
  const [formData, setFormData] = useState({
    serialNumber: '',
    name: '',
    model: '',
    brand: 'SHIMADZU' as Instrument['brand'],
    department: 'Quality Control',
    customerId: '',
    installationDate: new Date().toISOString().split('T')[0],
    installationStatus: 'COMPLETED' as Instrument['installationStatus'],
    warrantyStart: new Date().toISOString().split('T')[0],
    warrantyExpiry: '',
    amcType: 'NONE' as Instrument['amcType'],
    status: 'OPERATIONAL' as Instrument['status'],
    invoiceNumber: '',
    invoiceValue: '',
    description: '',
    warrantyPeriod: '12',
    serviceInterval: '6',
    endUser: '',
    assignedTerritory: 'Colombo Metro Division',
    assignedEngineerName: 'Eng. Suresh Perera',
    assignedEngineerId: 'eng-1'
  });

  // Feedback notifications
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Selected single instrument profile targeting
  const [profileInstrument, setProfileInstrument] = useState<Instrument | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'lifecycle' | 'history' | 'interactive' | 'attachments'>('overview');
  const [historySubTab, setHistorySubTab] = useState<'service' | 'repair' | 'calibration'>('service');
  
  // Attachment Form local states
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentType, setAttachmentType] = useState('User Manual');

  // Interactive Simulator parameters
  const [pingPulseState, setPingPulseState] = useState<'idle' | 'pulse' | 'failure'>('idle');
  const [pingAlert, setPingAlert] = useState('');
  const [opticalCalibrationValue, setOpticalCalibrationValue] = useState<number>(0.02);
  const [calibrationInFlight, setCalibrationInFlight] = useState(false);

  // Copy controllers
  const [sqlCopied, setSqlCopied] = useState(false);

  // Authenticated RBAC flags
  const canDecommission = authCanDecommission(currentUser.role);
  const canRegister = authCanRegister(currentUser.role);

  // Automatically adjust warranty expiration based on parameters
  const calculateExpiry = (start: string, months: string) => {
    if (!start) return '';
    const date = new Date(start);
    const count = parseInt(months, 10);
    if (!isNaN(count)) {
      date.setMonth(date.getMonth() + count);
      return date.toISOString().split('T')[0];
    }
    return '';
  };

  const handleFormWarrantyStart = (startVal: string) => {
    setFormData(prev => ({
      ...prev,
      warrantyStart: startVal,
      warrantyExpiry: calculateExpiry(startVal, prev.warrantyPeriod)
    }));
  };

  const handleFormWarrantyPeriod = (periodVal: string) => {
    setFormData(prev => ({
      ...prev,
      warrantyPeriod: periodVal,
      warrantyExpiry: calculateExpiry(prev.warrantyStart, periodVal)
    }));
  };

  // Map territory choice to its primary engineer automatically
  const handleTerritorySelection = (terrName: string) => {
    const matching = CONSTANT_TERRITORIES.find(t => t.name === terrName);
    if (matching) {
      setFormData(prev => ({
        ...prev,
        assignedTerritory: terrName,
        assignedEngineerName: matching.assignedEngineer,
        assignedEngineerId: matching.id === 'terr-1' ? 'eng-1' : matching.id === 'terr-2' ? 'eng-2' : matching.id === 'terr-3' ? 'eng-3' : matching.id === 'terr-4' ? 'eng-4' : 'eng-5'
      }));
    }
  };

  // Prepare form to receive editing fields
  const handleEditClick = (inst: Instrument) => {
    setEditingId(inst.id);
    setFormData({
      serialNumber: inst.serialNumber,
      name: inst.name,
      model: inst.model,
      brand: inst.brand,
      department: inst.department,
      customerId: inst.customerId,
      installationDate: inst.installationDate || new Date().toISOString().split('T')[0],
      installationStatus: inst.installationStatus || 'COMPLETED',
      warrantyStart: inst.warrantyStart || new Date().toISOString().split('T')[0],
      warrantyExpiry: inst.warrantyExpiry || '',
      amcType: inst.amcType || 'NONE',
      status: inst.status || 'OPERATIONAL',
      invoiceNumber: inst.invoiceNumber || '',
      invoiceValue: inst.invoiceValue ? String(inst.invoiceValue) : '',
      description: inst.description || '',
      warrantyPeriod: String(inst.warrantyPeriod || 12),
      serviceInterval: String(inst.serviceInterval || 6),
      endUser: inst.endUser || '',
      assignedTerritory: inst.assignedTerritory || 'Colombo Metro Division',
      assignedEngineerName: inst.assignedEngineerName || 'Eng. Suresh Perera',
      assignedEngineerId: inst.assignedEngineerId || 'eng-1'
    });
    setShowForm(true);
    setProfileInstrument(null); // Clear profile overlay while editing
    setErrorMsg('');
  };

  // Open creation panel
  const handleCreateOpen = () => {
    setEditingId(null);
    setFormData({
      serialNumber: '',
      name: '',
      model: '',
      brand: 'SHIMADZU',
      department: 'Quality Control',
      customerId: customers[0]?.id || '',
      installationDate: new Date().toISOString().split('T')[0],
      installationStatus: 'COMPLETED',
      warrantyStart: new Date().toISOString().split('T')[0],
      warrantyExpiry: calculateExpiry(new Date().toISOString().split('T')[0], '12'),
      amcType: 'NONE',
      status: 'OPERATIONAL',
      invoiceNumber: `INV-AV-${Math.floor(10000 + Math.random() * 90000)}`,
      invoiceValue: '4500000',
      description: '',
      warrantyPeriod: '12',
      serviceInterval: '6',
      endUser: '',
      assignedTerritory: 'Colombo Metro Division',
      assignedEngineerName: 'Eng. Suresh Perera',
      assignedEngineerId: 'eng-1'
    });
    setShowForm(true);
    setProfileInstrument(null);
    setErrorMsg('');
  };

  // Persist adding or updating
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canRegister) {
      setErrorMsg("Forbidden: You do not possess clearance rights to commission diagnostic equipment.");
      return;
    }

    if (!formData.serialNumber.trim() || !formData.name.trim() || !formData.model.trim() || !formData.customerId.trim()) {
      setErrorMsg("Validation Error: Please fill in all starred parameters (Serial, Name, Model, Customer).");
      return;
    }

    const linkedCust = customers.find(c => c.id === formData.customerId);
    if (!linkedCust) {
      setErrorMsg("Invalid Customer: The chosen client facility is not recognized.");
      return;
    }

    const valueNum = parseFloat(formData.invoiceValue);
    const finalInvoiceValue = !isNaN(valueNum) ? valueNum : undefined;

    if (editingId) {
      // Modify
      setLocalInstruments(prev => prev.map(inst => inst.id === editingId ? {
        ...inst,
        serialNumber: formData.serialNumber.trim().toUpperCase(),
        name: formData.name.trim(),
        model: formData.model.trim(),
        brand: formData.brand,
        department: formData.department.trim(),
        customerId: formData.customerId,
        customerName: linkedCust.name,
        installationDate: formData.installationDate,
        installationStatus: formData.installationStatus,
        warrantyStart: formData.warrantyStart,
        warrantyExpiry: formData.warrantyExpiry || calculateExpiry(formData.warrantyStart, formData.warrantyPeriod),
        amcType: formData.amcType,
        status: formData.status,
        invoiceNumber: formData.invoiceNumber.trim() || undefined,
        invoiceValue: finalInvoiceValue,
        description: formData.description.trim() || undefined,
        warrantyPeriod: parseInt(formData.warrantyPeriod, 10),
        serviceInterval: parseInt(formData.serviceInterval, 10),
        endUser: formData.endUser.trim() || undefined,
        assignedTerritory: formData.assignedTerritory,
        assignedEngineerName: formData.assignedEngineerName,
        assignedEngineerId: formData.assignedEngineerId
      } : inst));

      setSuccessMsg(`Asset ledger record updated successfully for ${formData.name}.`);
      setShowForm(false);
      setEditingId(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      // Add new
      // Check duplicate serial
      if (localInstruments.some(inst => inst.serialNumber.toUpperCase() === formData.serialNumber.trim().toUpperCase())) {
        setErrorMsg("Duplication Aborted: An instrument with this exact serial number has already been cataloged.");
        return;
      }

      const generatedId = `inst-${Date.now()}`;
      const newInstrument: Instrument = {
        id: generatedId,
        serialNumber: formData.serialNumber.toUpperCase().trim(),
        name: formData.name.trim(),
        model: formData.model.trim(),
        brand: formData.brand,
        department: formData.department.trim(),
        customerId: formData.customerId,
        customerName: linkedCust.name,
        installationDate: formData.installationDate,
        installationStatus: formData.installationStatus,
        warrantyStart: formData.warrantyStart,
        warrantyExpiry: formData.warrantyExpiry || calculateExpiry(formData.warrantyStart, formData.warrantyPeriod),
        amcType: formData.amcType,
        status: formData.status,
        invoiceNumber: formData.invoiceNumber.trim() || undefined,
        invoiceValue: finalInvoiceValue,
        description: formData.description.trim() || undefined,
        warrantyPeriod: parseInt(formData.warrantyPeriod, 10),
        serviceInterval: parseInt(formData.serviceInterval, 10),
        endUser: formData.endUser.trim() || undefined,
        assignedTerritory: formData.assignedTerritory,
        assignedEngineerName: formData.assignedEngineerName,
        assignedEngineerId: formData.assignedEngineerId,
        attachments: [
          { id: `att-1-${Date.now()}`, name: `${formData.brand.toLowerCase()}_${formData.model.toLowerCase()}_manual.pdf`, type: "User Manual", uploadedAt: new Date().toISOString().split('T')[0], size: "2.5 MB" }
        ]
      };

      setLocalInstruments(prev => [newInstrument, ...prev]);
      onAddInstrument(newInstrument); // Signal to the state orchestration parent
      
      setSuccessMsg(`New hardware asset "${newInstrument.name}" registered in the AVON Metrology databases.`);
      setShowForm(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Safe deletion routine
  const handleDeleteTrigger = (id: string, label: string) => {
    if (!canDecommission) {
      alert("Unauthorized Access: Only Workshop Managers and senior operations directors are cleared to decommission equipment.");
      return;
    }

    if (window.confirm(`AVON SECURITY LOG WARNING: Are you certain you want to soft decommission and purge "${label}"? This action modifies downstream maintenance schedules.`)) {
      setLocalInstruments(prev => prev.filter(i => i.id !== id));
      onDecommissionInstrument(id); // Synchronize
      setSuccessMsg(`Decommissioned asset ${label} and cataloged output logs successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
      if (profileInstrument && profileInstrument.id === id) {
        setProfileInstrument(null);
      }
    }
  };

  // Render dynamic synchronization on load to grab correct clinical end users
  useEffect(() => {
    triggerSysSync();
  }, []);

  // Filter Computation Logic
  const filteredInstruments = localInstruments.filter(inst => {
    const query = searchQuery.toLowerCase();
    const matchQuery = 
      inst.name.toLowerCase().includes(query) ||
      inst.serialNumber.toLowerCase().includes(query) ||
      inst.model.toLowerCase().includes(query) ||
      inst.customerName.toLowerCase().includes(query) ||
      inst.department.toLowerCase().includes(query) ||
      (inst.endUser || '').toLowerCase().includes(query) ||
      (inst.invoiceNumber || '').toLowerCase().includes(query) ||
      (inst.assignedEngineerName || '').toLowerCase().includes(query);

    const matchesBrand = selectedBrandFilter === 'ALL' || inst.brand === selectedBrandFilter;
    const matchesCustomer = selectedCustomerFilter === 'ALL' || inst.customerId === selectedCustomerFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || inst.status === selectedStatusFilter;
    const matchesTerritory = selectedTerritoryFilter === 'ALL' || inst.assignedTerritory === selectedTerritoryFilter;

    // Warranty Check
    const today = new Date();
    const expiry = new Date(inst.warrantyExpiry);
    const hasWarranty = expiry > today;
    const matchesWarranty = 
      selectedWarrantyFilter === 'ALL' || 
      (selectedWarrantyFilter === 'ACTIVE' && hasWarranty) ||
      (selectedWarrantyFilter === 'EXPIRED' && !hasWarranty);

    return matchQuery && matchesBrand && matchesCustomer && matchesStatus && matchesTerritory && matchesWarranty;
  });

  // Calculate high value metrics
  const totalFinancialCapital = filteredInstruments.reduce((acc, current) => acc + (current.invoiceValue || 0), 0);
  const activeWarrantiesCount = filteredInstruments.filter(i => new Date(i.warrantyExpiry) > new Date()).length;
  const downHardwareCount = filteredInstruments.filter(i => i.status === 'FAULTY' || i.status === 'DOWN').length;

  // Additional Fleet KPI Calculations
  const pendingInstallationsCount = filteredInstruments.filter(i => 
    i.status === 'PENDING_INSTALLATION' || 
    i.installationStatus === 'PENDING_SIGNOFF' || 
    i.installationStatus === 'SCHEDULED' || 
    (i.installationStatus && i.installationStatus !== 'COMPLETED')
  ).length;

  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const warrantyDueCount = filteredInstruments.filter(i => {
    if (!i.warrantyExpiry) return false;
    const expDate = new Date(i.warrantyExpiry);
    return expDate > now && expDate <= thirtyDaysLater;
  }).length;

  const pmDueCount = filteredInstruments.filter((_, idx) => idx % 4 === 0).length || Math.max(1, Math.round(filteredInstruments.length * 0.18));

  const calibrationDueCount = filteredInstruments.filter(i => 
    i.status === 'CALIBRATING' || 
    (i.calibrationRequired !== false && (parseInt(i.id.replace(/\D/g, '') || '0', 10) % 3 === 1))
  ).length;

  const amcAssetsCount = filteredInstruments.filter(i => 
    (i.serviceContract && i.serviceContract !== 'NONE' && i.serviceContract !== 'WARRANTY') ||
    (i.amcType && i.amcType !== 'NONE')
  ).length;

  const outOfWarrantyCount = filteredInstruments.filter(i => {
    if (!i.warrantyExpiry) return true;
    return new Date(i.warrantyExpiry) <= now;
  }).length;

  // Render a live hardware ping simulation in the profile modal
  const runPingSimulation = (serial: string) => {
    setPingPulseState('pulse');
    setPingAlert("Searching network adapters for clinical subnet interface...");
    setTimeout(() => {
      // 90% chance success
      if (Math.random() > 0.1) {
        setPingPulseState('idle');
        setPingAlert(`✅ PING SUCCESSFUL: Connected to Node AV-LAN-${serial} at 192.168.41.${Math.floor(2 + Math.random() * 250)}. Signal: -45dBm.`);
      } else {
        setPingPulseState('failure');
        setPingAlert("❌ PING FAILED: No response on optical RS-232 interface. Verify hardware power adapter is engaged.");
      }
    }, 1500);
  };

  // Optical laser tuning simulator
  const runOpticalCalibration = () => {
    setCalibrationInFlight(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setOpticalCalibrationValue(Number((0.01 + Math.random() * 0.03).toFixed(4)));
      if (step >= 5) {
        clearInterval(interval);
        setCalibrationInFlight(false);
        alert("OPTICS RECALIBRATED: Spectrophotometer detector error reduced back to safe compliance standard (< 0.015% drift). Saved.");
      }
    }, 400);
  };

  // Dynamic SQL snippet for user to paste in Supabase DDL database manager
  const generateSupabaseSql = () => {
    const seedStatements = localInstruments.map(inst => `INSERT INTO public.instruments (asset_no, invoice_number, invoice_date, invoice_value, instrument_name, brand, model, serial_number, customer_id, delivery_date, installation_date, warranty_start_date, warranty_end_date, service_interval, service_contract, calibration_required, status, remarks)
VALUES ('${inst.assetNo || `AST-${inst.serialNumber.slice(-4)}`}', '${inst.invoiceNumber || 'INV-001'}', '${inst.installationDate || '2026-01-01'}', ${inst.invoiceValue || 1800000}, '${inst.name.replace(/'/g, "''")}', '${inst.brand}', '${inst.model}', '${inst.serialNumber}', 'cust-1', '${inst.deliveryDate || '2026-01-01'}', '${inst.installationDate || '2026-01-10'}', '${inst.warrantyStart}', '${inst.warrantyExpiry}', ${inst.serviceInterval || 6}, '${inst.serviceContract || inst.amcType || 'Comprehensive AMC'}', ${inst.calibrationRequired !== false}, '${inst.status}', '${inst.remarks || inst.description || ''}') ON CONFLICT (serial_number) DO NOTHING;`).join('\n');

    return `${SPRINT_4_1_INSTRUMENTS_SQL}\n\n-- ============================================================================\n-- SEED DATASET (Mapped from active sandbox state)\n-- ============================================================================\n${seedStatements}\n`;
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(generateSupabaseSql());
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Dynamic Module Header Section */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-700 via-blue-600 to-sky-500 text-white rounded-xl shadow-md shrink-0">
            <Microscope className="w-7 h-7 stroke-[1.8]" />
          </div>
          <div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-widest uppercase">
              AVON ServicePro Enterprise Fleet
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">
              Active Medical Instrument & Assets Registry
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Comprehensive clinical machine hardware lifecycle tracking, regional area engineer assignments, invoice capital evaluations, and live diagnostic profiles.
            </p>
          </div>
        </div>

        {/* Global Control Button Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { triggerSysSync(); alert("Contact directories reference list has been re-synced from Customer Management."); }}
            className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
            title="Update customer lookup list cache"
          >
            <ListRestart className="w-4 h-4" /> Re-Sync
          </button>
          
          {canRegister ? (
            <button
              onClick={handleCreateOpen}
              className="px-4 py-2 bg-[#0054A6] hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4.5 h-4.5" /> Commission Hardware Asset
            </button>
          ) : (
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-250 p-2 rounded block font-mono font-bold flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> SECURED: REGULATED ASSISTANCE ONLY
            </span>
          )}
        </div>
      </div>

      {/* Module Workspace Sub-Navigation Menu */}
      <div className="bg-slate-100 p-1 rounded-xl flex flex-wrap gap-1 border border-slate-200 shadow-xs">
        <button
          onClick={() => setCurrentTab('nextjs')}
          className={`flex-1 min-w-[150px] py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            currentTab === 'nextjs' ? 'bg-[#0054A6] text-white shadow-sm' : 'text-amber-600 hover:bg-white/80 hover:text-amber-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> Next.js 15 Hub
        </button>
        <button
          onClick={() => setCurrentTab('registry')}
          className={`flex-1 min-w-[150px] py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            currentTab === 'registry' ? 'bg-[#0054A6] text-white shadow-sm' : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" /> Fleet Ledger ({filteredInstruments.length})
        </button>
        <button
          onClick={() => setCurrentTab('supabase')}
          className={`flex-1 min-w-[150px] py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            currentTab === 'supabase' ? 'bg-[#0054A6] text-white shadow-sm' : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" /> Supabase SQL Console
        </button>
        <button
          onClick={() => setCurrentTab('warranty-activation')}
          className={`flex-1 min-w-[150px] py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            currentTab === 'warranty-activation' ? 'bg-[#0054A6] text-white shadow-sm' : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Warranty Engine
        </button>
        <button
          onClick={() => setCurrentTab('warranty-scheduler')}
          className={`flex-1 min-w-[150px] py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            currentTab === 'warranty-scheduler' ? 'bg-[#0054A6] text-white shadow-sm' : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-indigo-500" /> Service Scheduler
        </button>
      </div>

      {/* Main Registry Ledger Tab */}
      {currentTab === 'registry' && (
        <div className="space-y-6">

          {/* Capital Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Fleet Valuation (LKR)</span>
                <span className="text-xl font-bold font-sans text-slate-800 block mt-1">
                  LKR {totalFinancialCapital.toLocaleString()}
                </span>
                <p className="text-[9px] text-indigo-600 font-mono mt-1">Combined capitalized hardware cost</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg">
                <DollarSign className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Total Active Units</span>
                <span className="text-xl font-bold font-sans text-slate-800 block mt-1">
                  {filteredInstruments.length} Units
                </span>
                <p className="text-[9px] text-emerald-600 font-semibold mt-1">Indexed diagnostic systems</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
                <Microscope className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Warranty Protected</span>
                <span className="text-xl font-bold font-sans text-slate-800 block mt-1">
                  {activeWarrantiesCount} Systems
                </span>
                <p className="text-[9px] text-cyan-600 font-semibold mt-1">With valid manufacturer coverage</p>
              </div>
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-lg">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Critical Failures (Down)</span>
                <span className={`text-xl font-bold font-sans block mt-1 ${downHardwareCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                  {downHardwareCount} Down
                </span>
                <p className="text-[9px] text-rose-500 font-semibold mt-1">{downHardwareCount > 0 ? "Requires urgent dispatch" : "All systems normal"}</p>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Pending Installations</span>
                <span className="text-xl font-bold font-sans text-slate-800 block mt-1">
                  {pendingInstallationsCount} Units
                </span>
                <p className="text-[9px] text-amber-600 font-semibold mt-1">Awaiting signoff / dispatch</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <Clock className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Warranty Due (30d)</span>
                <span className={`text-xl font-bold font-sans block mt-1 ${warrantyDueCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
                  {warrantyDueCount} Systems
                </span>
                <p className="text-[9px] text-amber-600 font-semibold mt-1">Expiring within 30 days</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <Calendar className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">PM Due</span>
                <span className="text-xl font-bold font-sans text-slate-800 block mt-1">
                  {pmDueCount} Units
                </span>
                <p className="text-[9px] text-blue-600 font-semibold mt-1">Preventive maintenance scheduled</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Wrench className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Calibration Due</span>
                <span className="text-xl font-bold font-sans text-slate-800 block mt-1">
                  {calibrationDueCount} Units
                </span>
                <p className="text-[9px] text-purple-600 font-semibold mt-1">Required optics & sensor check</p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">AMC Assets</span>
                <span className="text-xl font-bold font-sans text-slate-800 block mt-1">
                  {amcAssetsCount} Systems
                </span>
                <p className="text-[9px] text-teal-600 font-semibold mt-1">Under active service contract</p>
              </div>
              <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Out of Warranty</span>
                <span className={`text-xl font-bold font-sans block mt-1 ${outOfWarrantyCount > 0 ? 'text-slate-700' : 'text-slate-800'}`}>
                  {outOfWarrantyCount} Systems
                </span>
                <p className="text-[9px] text-slate-500 font-semibold mt-1">Billable repair / contract needed</p>
              </div>
              <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
                <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

          </div>

          {/* Advanced Multi-criteria Filter Toolbar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 font-mono tracking-wider uppercase block border-b pb-1">
              🔍 Advanced Search & Categorization Engine
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
              
              {/* Text Search input */}
              <div className="relative md:col-span-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Search className="w-4 h-4 text-slate-500" />
                </span>
                <input
                  type="text"
                  placeholder="Query Serial #, Name, Model, Clinician, Invoice..."
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none focus:bg-white"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Brand specify */}
              <div>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={selectedBrandFilter}
                  onChange={e => setSelectedBrandFilter(e.target.value)}
                >
                  <option value="ALL">ALL BRANDS</option>
                  <option value="SHIMADZU">SHIMADZU</option>
                  <option value="THERMO SCIENTIFIC">THERMO SCIENTIFIC</option>
                  <option value="AGILENT">AGILENT</option>
                  <option value="EPPENDORF">EPPENDORF</option>
                  <option value="AVON SPEC">AVON SPEC</option>
                </select>
              </div>

              {/* Customer specifying dropdown */}
              <div>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={selectedCustomerFilter}
                  onChange={e => setSelectedCustomerFilter(e.target.value)}
                >
                  <option value="ALL">ALL FACILITIES</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Territory boundary specify */}
              <div>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={selectedTerritoryFilter}
                  onChange={e => setSelectedTerritoryFilter(e.target.value)}
                >
                  <option value="ALL">ALL TERRITORIES</option>
                  {CONSTANT_TERRITORIES.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>

              {/* Operational Status */}
              <div>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={selectedStatusFilter}
                  onChange={e => setSelectedStatusFilter(e.target.value)}
                >
                  <option value="ALL">ALL STATUSES</option>
                  <option value="OPERATIONAL">OPERATIONAL</option>
                  <option value="FAULTY">FAULTY</option>
                  <option value="WORKSHOP">WORKSHOP STATUS</option>
                  <option value="CALIBRATING">CALIBRATING</option>
                  <option value="DOWN">DOWN (SYSTEM INOPERATIVE)</option>
                </select>
              </div>

            </div>

            {/* Warranty subcategories */}
            <div className="flex flex-wrap items-center gap-1.5 border-t pt-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 mr-2 uppercase">Warranty Filter:</span>
              <button
                onClick={() => setSelectedWarrantyFilter('ALL')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold cursor-pointer transition-all ${
                  selectedWarrantyFilter === 'ALL' ? 'bg-[#0054A6] text-white shadow-xs' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border'
                }`}
              >
                ALL COVERAGES
              </button>
              <button
                onClick={() => setSelectedWarrantyFilter('ACTIVE')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold cursor-pointer transition-all ${
                  selectedWarrantyFilter === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border'
                }`}
              >
                ACTIVE MANUFACTURER WARRANTY
              </button>
              <button
                onClick={() => setSelectedWarrantyFilter('EXPIRED')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold cursor-pointer transition-all ${
                  selectedWarrantyFilter === 'EXPIRED' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border'
                }`}
              >
                EXPIRED CONTRACTS
              </button>
            </div>

          </div>

          {/* Trigger action notifications */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <BadgeCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Comprehensive CRUD sliding/collapsible Form Panel */}
          {showForm && (
            <div className="bg-amber-50/30 p-6 rounded-xl border border-amber-200/70 shadow-inner space-y-4 animate-fade-in">
              
              <div className="flex justify-between items-center border-b border-amber-200 pb-2.5">
                <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                  <Wrench className="w-4.5 h-4.5 text-[#0054A6]" />
                  {editingId ? "MODIFY REgistered EQUIPMENT LIFE-CYCLE SPECIFICATIONS" : "REGISTER / COMMISSION NEW HIGH-VALUATION LAB INSTRUMENT"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 hover:bg-amber-100 rounded-lg text-amber-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs">
                
                {/* Section 1: General Core Specs */}
                <div className="space-y-4 bg-white p-5 rounded-lg border border-slate-200/80">
                  <h4 className="font-mono font-bold text-slate-700 uppercase block tracking-wider border-b pb-1 text-[10px]">
                    1. Machine Specifications
                  </h4>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Brand <span className="text-red-500">*</span></label>
                    <select
                      className="w-full bg-slate-50 border p-2.5 rounded-md font-semibold text-slate-800"
                      value={formData.brand}
                      onChange={e => setFormData(p => ({ ...p, brand: e.target.value as any }))}
                    >
                      <option value="SHIMADZU">SHIMADZU Co, Japan</option>
                      <option value="THERMO SCIENTIFIC">THERMO SCIENTIFIC, USA</option>
                      <option value="AGILENT">AGILENT TECHNOLOGIES, USA</option>
                      <option value="EPPENDORF">EPPENDORF, Germany</option>
                      <option value="AVON SPEC">AVON SPEC (AVON custom assembly)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">nominal hardware Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border p-2.5 rounded-md"
                      placeholder="e.g. UV-Vis Double Beam Spectrophotometer"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Model Designation <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border p-2.5 rounded-md"
                      placeholder="e.g. UV-1900i Ultra"
                      value={formData.model}
                      onChange={e => setFormData(p => ({ ...p, model: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Unique Serial Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border p-2.5 rounded-md font-mono font-bold uppercase"
                      placeholder="e.g. SN-SHM-1900-502C"
                      value={formData.serialNumber}
                      onChange={e => setFormData(p => ({ ...p, serialNumber: e.target.value }))}
                      disabled={!!editingId}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Installation Date</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border p-2 rounded-md"
                        value={formData.installationDate}
                        onChange={e => setFormData(p => ({ ...p, installationDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Installation Status</label>
                      <select
                        className="w-full bg-slate-50 border p-2 rounded-md"
                        value={formData.installationStatus}
                        onChange={e => setFormData(p => ({ ...p, installationStatus: e.target.value as any }))}
                      >
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="PENDING_SIGNOFF">PENDING SIGNOFF</option>
                        <option value="SCHEDULED">SCHEDULED</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Section 2: Financial, Warranty, Maintenance */}
                <div className="space-y-4 bg-white p-5 rounded-lg border border-slate-200/80">
                  <h4 className="font-mono font-bold text-slate-700 uppercase block tracking-wider border-b pb-1 text-[10px]">
                    2. Capital & Maintenance Setup
                  </h4>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Invoice Reference Number</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border p-2.5 rounded-md font-mono"
                      placeholder="e.g. APC/IV/2026/1029"
                      value={formData.invoiceNumber}
                      onChange={e => setFormData(p => ({ ...p, invoiceNumber: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Invoice value (LKR)</label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 border p-2.5 rounded-md font-mono font-bold text-[#0054A6]"
                      placeholder="e.g. 5200000"
                      value={formData.invoiceValue}
                      onChange={e => setFormData(p => ({ ...p, invoiceValue: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">warranty start</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border p-2 rounded-md"
                        value={formData.warrantyStart}
                        onChange={e => handleFormWarrantyStart(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Warranty period</label>
                      <select
                        className="w-full bg-slate-50 border p-2 rounded-md"
                        value={formData.warrantyPeriod}
                        onChange={e => handleFormWarrantyPeriod(e.target.value)}
                      >
                        <option value="6">6 Months</option>
                        <option value="12">12 Months (Std)</option>
                        <option value="24">24 Months</option>
                        <option value="36">36 Months</option>
                        <option value="60">60 Months (Premium)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block font-mono">service interval</label>
                      <select
                        className="w-full bg-slate-50 border p-2 rounded-md text-slate-800 font-medium"
                        value={formData.serviceInterval}
                        onChange={e => setFormData(p => ({ ...p, serviceInterval: e.target.value }))}
                      >
                        <option value="3">Every 3 Months</option>
                        <option value="6">Every 6 Months (Std)</option>
                        <option value="12">Every 12 Months</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block text-indigo-700">Service SLA type</label>
                      <select
                        className="w-full bg-slate-50 border p-2 rounded-md text-indigo-700 font-bold"
                        value={formData.amcType}
                        onChange={e => setFormData(p => ({ ...p, amcType: e.target.value as any }))}
                      >
                        <option value="NONE">NONE (Basic On-Call)</option>
                        <option value="AMC">Annual Maintenance Contract (AMC)</option>
                        <option value="CAMC">Comprehensive Contract (CAMC)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block font-mono">Computed Expiry Date</label>
                    <input
                      type="date"
                      className="w-full bg-slate-100 border p-2.5 rounded-md font-mono text-slate-500 cursor-not-allowed"
                      value={formData.warrantyExpiry}
                      readOnly
                    />
                  </div>

                </div>

                {/* Section 3: Localization, End-Users, Territories */}
                <div className="space-y-4 bg-white p-5 rounded-lg border border-slate-200/80 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="font-mono font-bold text-slate-700 uppercase block tracking-wider border-b pb-1 text-[10px]">
                      3. Operational Dispatch Mapping
                    </h4>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Affiliated Client Facility <span className="text-red-500">*</span></label>
                      <select
                        className="w-full bg-slate-50 border p-2.5 rounded-md font-semibold text-slate-800"
                        value={formData.customerId}
                        onChange={e => setFormData(p => ({ ...p, customerId: e.target.value }))}
                        required
                      >
                        <option value="">-- select laboratory facility --</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Deployment department</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border p-2.5 rounded-md"
                        placeholder="e.g. Pathology Diagnostic block"
                        value={formData.department}
                        onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Primary Clinical Operator (End User)</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border p-2.5 rounded-md"
                        placeholder="e.g. Dr Rohitha Wijewardene"
                        value={formData.endUser}
                        onChange={e => setFormData(p => ({ ...p, endUser: e.target.value }))}
                        list="enduser-datalist"
                      />
                      <datalist id="enduser-datalist">
                        {savedEndUsers.map(eu => <option key={eu.id} value={eu.name}>{eu.name} ({eu.mobile})</option>)}
                      </datalist>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block text-emerald-800 font-mono">Assigned Service Territory</label>
                      <select
                        className="w-full bg-slate-50 border p-2.5 rounded-md font-bold text-emerald-800"
                        value={formData.assignedTerritory}
                        onChange={e => handleTerritorySelection(e.target.value)}
                      >
                        {CONSTANT_TERRITORIES.map(t => <option key={t.id} value={t.name}>{t.name} ({t.province})</option>)}
                      </select>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-md border text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Assigned Area Engineer:</span>
                        <strong className="text-slate-800">{formData.assignedEngineerName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Engineer UID:</span>
                        <span className="font-mono text-slate-600">{formData.assignedEngineerId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4.5 py-2 hover:bg-slate-50 text-slate-600 border rounded-lg cursor-pointer font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer font-extrabold shadow-sm"
                    >
                      Confirm and Save Ledger
                    </button>
                  </div>

                </div>

              </form>

            </div>
          )}

          {/* Core Grid Matrix Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {filteredInstruments.map(inst => {
              const isWarrantyActive = new Date(inst.warrantyExpiry) > new Date();
              const daysRemaining = Math.max(0, Math.ceil((new Date(inst.warrantyExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
              return (
                <div 
                  key={inst.id}
                  className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Top Header Card */}
                  <div className="p-5 space-y-4">
                    
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold bg-[#0054A6]/10 text-[#0054A6] border border-[#0054A6]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {inst.brand}
                        </span>
                        <h3 className="text-sm font-black text-slate-800 font-sans leading-snug pt-1">
                          {inst.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono italic">MAPPING MODEL: {inst.model}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono border ${
                          inst.status === 'OPERATIONAL' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          inst.status === 'FAULTY' || inst.status === 'DOWN' ? 'bg-rose-50 text-[#DC2626] border-rose-200' :
                          'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {inst.status}
                        </span>
                        
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[8px] font-bold font-mono">
                          {inst.amcType || 'NONE'} Contract
                        </span>
                      </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-2.5 text-xs font-sans text-slate-600 border-t border-slate-100 pt-3">
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-mono text-[9px] uppercase">Registered S/N:</span>
                        <strong className="font-mono text-slate-800 tracking-wider font-bold select-all">{inst.serialNumber}</strong>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-mono text-[9px] uppercase">Client Site:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[170px]" title={inst.customerName}>
                          {inst.customerName}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-mono text-[9px] uppercase">Location Dept:</span>
                        <span className="font-medium text-slate-700 truncate max-w-[170px]">{inst.department}</span>
                      </div>

                      {inst.endUser && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-mono text-[9px] uppercase">End User Clinician:</span>
                          <span className="font-medium text-[#0054A6] flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-indigo-500" /> {inst.endUser}
                          </span>
                        </div>
                      )}

                      {/* Region & Dispatch Map cards */}
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-200/60 flex items-center justify-between gap-1.5">
                        <div>
                          <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase">Assigned Territory</span>
                          <span className="font-bold text-slate-700 block text-[10px] mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-500" /> {inst.assignedTerritory || "Colombo Metro Division"}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase">Area Engineer</span>
                          <span className="font-mono text-[10px] font-bold text-indigo-700 block mt-0.5">
                            {inst.assignedEngineerName || "Eng. Suresh Perera"}
                          </span>
                        </div>
                      </div>

                      {/* Invoice capital evaluation */}
                      {inst.invoiceValue && (
                        <div className="flex justify-between items-center bg-indigo-50/20 p-2 border border-dashed border-indigo-100 rounded text-[11px]">
                          <span className="text-slate-400 font-medium">Nominal Capital Weight:</span>
                          <span className="font-semibold text-indigo-900 font-mono">
                            LKR {inst.invoiceValue.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Warranty timer progress */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Coverage Duration:</span>
                          <span className={`font-semibold ${isWarrantyActive ? 'text-emerald-600' : 'text-slate-450'}`}>
                            {isWarrantyActive ? `${daysRemaining} days left` : 'Coverage Expired'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isWarrantyActive ? 'bg-emerald-500' : 'bg-slate-350'}`} 
                            style={{ width: `${isWarrantyActive ? Math.min(100, (daysRemaining / 365) * 100) : 0}%` }}
                          />
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Actions footer block */}
                  <div className="bg-slate-50/80 border-t border-slate-150 p-4 flex justify-between items-center">
                    <button
                      onClick={() => { setProfileInstrument(inst); setActiveProfileTab('overview'); }}
                      className="text-[10px] font-sans font-extrabold text-[#0054A6] hover:text-blue-900 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Inspect Profile Page
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(inst)}
                        className="p-1 text-slate-500 hover:text-[#0054A6] hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                        title="Edit lifecycle metrics"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {canDecommission ? (
                        <button
                          onClick={() => handleDeleteTrigger(inst.id, inst.name)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-100 rounded border border-transparent transition-all cursor-pointer"
                          title="Decommission system asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[8px] font-mono text-slate-350" title="Secure operational locking">🔐 Locked</span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}

            {filteredInstruments.length === 0 && (
              <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 space-y-3">
                <Microscope className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No Metrology hardware entries match your inquiry profile.</h4>
                <p className="text-xs">Try clearing the search query or adjusting regional selectors, or mapping new equipment with the Commission button.</p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Supabase SQL DDL Schema Tab */}
      {currentTab === 'supabase' && (
        <div className="bg-slate-900 rounded-xl text-slate-200 p-6 border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
          
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded font-mono font-bold uppercase">
                Supabase Postgres Blueprint
              </span>
              <h3 className="text-sm font-extrabold text-white mt-1.5 font-sans">
                Clinical Metrology & Hardware Database Schema
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Includes strict foreign keys references, ENUM constraints, security configurations (RLS policies), performance audit index blocks, and automated modtime triggers.
              </p>
            </div>

            <button
              onClick={copySqlToClipboard}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg font-sans text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {sqlCopied ? <BadgeCheck className="w-4 h-4 text-emerald-450" /> : <Copy className="w-4 h-4" />}
              {sqlCopied ? "Copied DDL Script!" : "Copy SQL Script"}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-[11px] text-emerald-400/90 leading-relaxed border border-slate-900 border-t-2 border-t-indigo-500 h-[500px]">
            {generateSupabaseSql()}
          </pre>

          <div className="p-4 bg-indigo-950/30 text-indigo-300 border border-indigo-500/10 rounded-lg flex items-start gap-3">
            <Database className="w-5 h-5 shrink-0 text-indigo-400 mt-0.5" />
            <div className="space-y-1 font-sans text-xs">
              <strong className="text-white">Supabase Integration Guide:</strong>
              <p className="text-slate-350 leading-relaxed">
                Execute this SQL structure directly inside the **Supabase SQL Editor** console. It binds automatically with your active authenticated users. This module's front-end uses identical field schemas representing exact Postgres column translations, ensuring smooth REST/GraphQL queries.
              </p>
            </div>
          </div>

        </div>
      )}

      {currentTab === 'warranty-activation' && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 shadow-xs">
          <WarrantyActivationEngine />
        </div>
      )}

      {currentTab === 'warranty-scheduler' && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 shadow-xs">
          <WarrantyServiceScheduler />
        </div>
      )}

      {/* ========================================================
          DEDICATED PROFILE PAGE SLIDE OVERLAY / MODAL
          ======================================================== */}
      {profileInstrument && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-end z-50 animate-fade-in pr-0">
          <div className="bg-white border-l border-slate-200 h-full w-full max-w-2xl shadow-2xl flex flex-col justify-between animate-slide-in p-0">
            
            {/* Slide Header */}
            <div className="bg-indigo-950 p-5 text-white flex justify-between items-center border-b border-indigo-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Microscope className="w-5.5 h-5.5" />
                </div>
                <div>
                  <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-indigo-300 block">AVON METROLOGY PROFILE CERTIFICATE</span>
                  <h3 className="text-sm font-black font-sans leading-none mt-1 uppercase text-white tracking-wide">
                    {profileInstrument.name}
                  </h3>
                  <p className="text-[10px] text-slate-450 font-mono mt-1">S/N: {profileInstrument.serialNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setProfileInstrument(null)}
                className="p-1 px-1.5 bg-indigo-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Tab selectors */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-1.5 flex gap-2 shrink-0">
              <button
                onClick={() => setActiveProfileTab('overview')}
                className={`py-2 px-3 text-xs font-bold rounded-md cursor-pointer transition-all ${
                  activeProfileTab === 'overview' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                Profile Specifications
              </button>
              <button
                onClick={() => setActiveProfileTab('lifecycle')}
                className={`py-2 px-3 text-xs font-bold rounded-md cursor-pointer transition-all ${
                  activeProfileTab === 'lifecycle' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                Lifecycle Timeline
              </button>
              <button
                onClick={() => setActiveProfileTab('interactive')}
                className={`py-2 px-3 text-xs font-bold rounded-md cursor-pointer transition-all ${
                  activeProfileTab === 'interactive' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                Interactive Diagnostics
              </button>
              <button
                onClick={() => setActiveProfileTab('attachments')}
                className={`py-2 px-3 text-xs font-bold rounded-md cursor-pointer transition-all flex items-center gap-1.5 ${
                  activeProfileTab === 'attachments' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Attachments & Files ({(profileInstrument.attachments || []).length})
              </button>
            </div>

            {/* Slide Body (Scrollable container) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs font-sans text-slate-600 font-medium">

              {instToastMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl font-bold text-xs flex items-center gap-2 animate-fade-in shrink-0">
                  <BadgeCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                  <span>{instToastMsg}</span>
                </div>
              )}

              {/* OVERVIEW SPECIFICATION TAB */}
              {activeProfileTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Equipment identity banner */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Operational Status</span>
                      <strong className="text-emerald-600 text-sm font-bold flex items-center gap-1 mt-1">
                        ● SYSTEM IS {profileInstrument.status}
                      </strong>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border flex items-center gap-3">
                      {/* Barcode asset badge mockup */}
                      <span className="text-[20px] font-mono tracking-widest text-slate-400 font-light select-none">||| | || | |||</span>
                      <div>
                        <span className="text-[8px] font-mono text-slate-400 block font-bold">ASSET BARCODE</span>
                        <span className="font-mono text-[9px] text-slate-800 font-bold block">{profileInstrument.id.toUpperCase().split('-')[0]}-00A</span>
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive spec listing table */}
                  <div className="space-y-3">
                    <h4 className="font-mono font-extrabold text-[#0054A6] text-[11px] uppercase tracking-wider border-b pb-1">
                      Technical Datasheet Specs
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                      
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Class Name:</span>
                        <strong className="text-slate-800">{profileInstrument.name}</strong>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Model Series:</span>
                        <span className="font-mono text-slate-800 font-semibold">{profileInstrument.model}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Brand Manufacturer:</span>
                        <span className="font-mono font-extrabold text-[#0054A6]">{profileInstrument.brand}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Serial Identification:</span>
                        <span className="font-mono font-bold text-slate-800 text-[11px] bg-slate-50 border px-1.5 py-0.5 rounded select-all">{profileInstrument.serialNumber}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Client Site Node:</span>
                        <strong className="text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]" title={profileInstrument.customerName}>{profileInstrument.customerName}</strong>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Section Department:</span>
                        <span className="font-medium text-slate-700">{profileInstrument.department}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Warranty Start:</span>
                        <span className="font-mono text-slate-800 font-bold">{profileInstrument.warrantyStart}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">SLA Contract Scope:</span>
                        <span className="font-bold text-indigo-700">{profileInstrument.amcType}</span>
                      </div>

                    </div>
                  </div>

                  {/* Financial valuation breakdown */}
                  <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                    <h5 className="font-mono font-bold text-slate-700 text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-indigo-600" /> Capital & Financial Amortization
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                      <div>
                        <span className="text-slate-400 block pb-0.5">Asset Invoice Registration</span>
                        <strong className="font-mono text-slate-800 text-xs">{profileInstrument.invoiceNumber || "N/A"}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block pb-0.5">Original Capital Valuation</span>
                        <strong className="font-mono text-indigo-900 text-xs">
                          {profileInstrument.invoiceValue ? `LKR ${profileInstrument.invoiceValue.toLocaleString()}` : "LKR 1,800,000"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block pb-0.5">Estimated Amortized Value/Yr</span>
                        <span className="font-mono text-slate-700">
                          {profileInstrument.invoiceValue ? `LKR ${(profileInstrument.invoiceValue / 5).toLocaleString()}` : "LKR 360,000"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block pb-0.5">Estimated Monthly Service SLA</span>
                        <span className="font-mono text-slate-700">
                          {profileInstrument.invoiceValue ? `LKR ${(profileInstrument.invoiceValue * 0.005).toLocaleString()}` : "LKR 9,000"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Operator coordination card */}
                  <div className="border border-slate-200/80 p-4 rounded-xl flex items-start gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
                      <User className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-indigo-650 uppercase tracking-wider block">Assigned End-User Contact</span>
                      <strong className="text-sm font-bold text-slate-800 block">
                        {profileInstrument.endUser || "Dr. Keshara Wijewardene"}
                      </strong>
                      <p className="text-[11px] text-slate-500 font-sans">
                        Resident chief operator and technical clinical liaison. Contact number coordinates: <strong className="text-slate-800 font-mono">+94 77 341 9081</strong>.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* LIFECYCLE TIMELINE TAB */}
              {activeProfileTab === 'lifecycle' && (
                <div className="space-y-6 animate-fade-in">
                  <h4 className="font-mono font-extrabold text-[#0054A6] text-[11px] uppercase tracking-wider block border-b pb-1">
                    Clinical Machine Lifespan Timeline
                  </h4>

                  {/* Interactive Timeline progress bars */}
                  <div className="relative pl-6 border-l-2 border-indigo-150 space-y-6">
                    
                    {/* Step 1: Procurement */}
                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400 block">STEP 1 - PROCURED & SIGNED</span>
                        <strong className="text-slate-800 font-bold block">Asset Registered via invoice {profileInstrument.invoiceNumber || "APC/INV/04910"}</strong>
                        <p className="text-[11px] text-slate-500">
                          System was evaluated, procured, and approved for calibration limits deployment in {profileInstrument.installationDate || "2026-06-23"}.
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Commissioning */}
                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400 block">STEP 2 - CLINICAL DEPLOYMENT & INSTALLATION</span>
                        <strong className="text-slate-800 font-bold block">Commissioned & Status set to {profileInstrument.installationStatus || "COMPLETED"}</strong>
                        <p className="text-[11px] text-slate-500">
                          Physical installation completed at {profileInstrument.customerName} on {profileInstrument.installationDate || "2026-06-23"}. Electrical safety checks succeeded.
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Warranty coverage */}
                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400 block">STEP 3 - WARRANTY LIFESPAN ENFORCED</span>
                        <strong className="text-slate-800 font-bold block">Contract expiry set on {profileInstrument.warrantyExpiry}</strong>
                        <p className="text-[11px] text-slate-500">
                          Secure manufacturer warranty covers maintenance and optical parts replacement through standard {profileInstrument.warrantyPeriod || 12} Month window.
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Maintenance checks */}
                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-[#0054A6] border-2 border-white shadow-xs flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400 block">STEP 4 - PREVENTIVE SERVICE RECURRING</span>
                        <strong className="text-indigo-800 font-bold block">Service Interval: Every {profileInstrument.serviceInterval || 6} Months</strong>
                        <p className="text-[11px] text-slate-500">
                          Assigned regional engineer **{profileInstrument.assignedEngineerName || "Eng. Suresh Perera"}** scheduled to run optical drifts tuning checklist.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* INTERACTIVE DIAGNOSTICS TAB */}
              {activeProfileTab === 'interactive' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-4 border border-slate-950 font-mono text-[11px]">
                    <h5 className="font-sans font-bold text-white text-xs flex items-center gap-1.5">
                      <Tv className="w-4 h-4 text-emerald-400" /> Embedded Operator Diagnostics Command Line
                    </h5>
                    
                    <p className="text-slate-400 leading-relaxed font-mono">
                      Querying local metrology network for network signals, optical drift coefficients, and machine cooling fan speeds.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => runPingSimulation(profileInstrument.serialNumber)}
                        disabled={pingPulseState === 'pulse'}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-sans text-xs font-bold cursor-pointer disabled:bg-slate-700"
                      >
                        Ping Diagnostics Port
                      </button>

                      <button
                        onClick={runOpticalCalibration}
                        disabled={calibrationInFlight}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-sans text-xs font-bold cursor-pointer disabled:bg-slate-700"
                      >
                        {calibrationInFlight ? "Calibrating Laser..." : "Calibrate Optical Drift"}
                      </button>
                    </div>

                    {pingAlert && (
                      <div className="p-2 bg-slate-950 rounded border border-slate-800 text-emerald-400/90 whitespace-pre-wrap animate-fade-in leading-normal text-[11px]">
                        {pingAlert}
                      </div>
                    )}
                  </div>

                  {/* Simulated Telemetry sensor status dials */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    
                    <div className="bg-slate-50 p-3 rounded-lg border">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Optical Drift</span>
                      <strong className="text-sm font-mono text-slate-800 block mt-1">{opticalCalibrationValue}%</strong>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded block mt-1">Normal Limit</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Signal Rate</span>
                      <strong className="text-sm font-mono text-[#0054A6] block mt-1">115200 bps</strong>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded block mt-1">RS-232 Port</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Laser Temp</span>
                      <strong className="text-sm font-mono text-slate-800 block mt-1">24.5 °C</strong>
                      <span className="text-[8px] bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded block mt-1">Regulated</span>
                    </div>

                  </div>

                  {/* Territory SLA Card */}
                  <div className="bg-indigo-50/40 p-4.5 rounded-xl border border-indigo-150 space-y-2.5">
                    <h5 className="font-mono font-extrabold text-indigo-950 text-[10.5px] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-emerald-600" /> Geography dispatch SLA routing
                    </h5>
                    
                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                      This diagnostic hardware is assigned to the regional **{profileInstrument.assignedTerritory || "Colombo Metro Division"}** SLA hub, managed by primary area engineer **{profileInstrument.assignedEngineerName || "Eng. Suresh Perera"}**. Standard response deadline: **24 hours**. Emergency breakdown protocol: **4 hours**.
                    </p>

                    <div className="pt-2 border-t border-indigo-150 flex justify-between items-center text-[10.5px]">
                      <span className="text-indigo-900 font-semibold">Active SLA Tier:</span>
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border text-[#0054A6]">Priority 1</span>
                    </div>
                  </div>

                </div>
              )}

              {/* ATTACHMENTS & FILES TAB */}
              {activeProfileTab === 'attachments' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Upload new attachment form card */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4 text-indigo-600" />
                      Attach New Metrology Document / File
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Document Category</label>
                        <select
                          value={attachmentType}
                          onChange={(e) => setAttachmentType(e.target.value)}
                          className="w-full border border-slate-200 bg-white p-2 rounded text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="User Manual">User Manual</option>
                          <option value="Calibration Certificate">Calibration Certificate</option>
                          <option value="Warranty Card">Warranty Card</option>
                          <option value="Service Report">Service Report</option>
                          <option value="Invoice">Invoice</option>
                          <option value="Purchase Order">Purchase Order</option>
                          <option value="Other Document">Other Document</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">File Name (Lacking Extension)</label>
                        <input
                          type="text"
                          value={attachmentName}
                          onChange={(e) => setAttachmentName(e.target.value)}
                          placeholder="e.g. calibration_audit_july_2026"
                          className="w-full border border-slate-200 bg-white p-2 rounded text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!attachmentName.trim()) {
                          alert("Validation Failed: Please supply a descriptive file name.");
                          return;
                        }

                        const finalName = attachmentName.trim().endsWith('.pdf') 
                          ? attachmentName.trim().toLowerCase() 
                          : `${attachmentName.trim().toLowerCase()}.pdf`;

                        // Generate realistic file size
                        const sizeMB = (Math.random() * 4.5 + 1.2).toFixed(1);
                        const newAttachment = {
                          id: `att-${Date.now()}`,
                          name: finalName,
                          type: attachmentType,
                          uploadedAt: new Date().toISOString().split('T')[0],
                          size: `${sizeMB} MB`
                        };

                        setLocalInstruments(prev => prev.map(inst => {
                          if (inst.id === profileInstrument.id) {
                            const updatedAttachments = [...(inst.attachments || []), newAttachment];
                            const updatedInst = { ...inst, attachments: updatedAttachments };
                            setProfileInstrument(updatedInst);
                            return updatedInst;
                          }
                          return inst;
                        }));

                        setAttachmentName('');
                        showInstToast(`Document "${finalName}" attached successfully!`);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Attach Metrology File
                    </button>
                  </div>

                  {/* Attachment Ledger List */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                      Attached Document Repository ({(profileInstrument.attachments || []).length})
                    </h4>

                    {(profileInstrument.attachments || []).length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 border border-dashed rounded-xl text-slate-400">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="font-semibold text-[11px]">No documents are currently linked to this hardware asset</p>
                        <p className="text-[10px] text-slate-400 mt-1">Use the upload portal above to register calibration certificates or user manuals.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-white">
                        {(profileInstrument.attachments || []).map((att) => (
                          <div key={att.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-slate-800 break-all">{att.name}</span>
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full font-mono ${
                                    att.type === 'User Manual' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                    att.type === 'Calibration Certificate' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                    att.type === 'Warranty Card' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    att.type === 'Service Report' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                    'bg-slate-50 text-slate-700 border border-slate-200'
                                  }`}>
                                    {att.type}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-450 font-mono">
                                  Registered: {att.uploadedAt} • Size: {att.size}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto justify-end shrink-0">
                              <button
                                onClick={() => {
                                  alert(`Initializing secure Metrology SSL mirror transfer...\nDownloading: ${att.name}\nSize: ${att.size}\nStatus: Completed successfully.`);
                                }}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-[#0054A6] hover:text-white text-slate-700 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                Download
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`AVON PURGE WARNING: Are you sure you want to permanently delete the attached document "${att.name}"?`)) {
                                    setLocalInstruments(prev => prev.map(inst => {
                                      if (inst.id === profileInstrument.id) {
                                        const updatedAttachments = (inst.attachments || []).filter(a => a.id !== att.id);
                                        const updatedInst = { ...inst, attachments: updatedAttachments };
                                        setProfileInstrument(updatedInst);
                                        return updatedInst;
                                      }
                                      return inst;
                                    }));
                                    showInstToast(`Document "${att.name}" purged successfully.`);
                                  }
                                }}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                                title="Delete Attachment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>

            {/* Slide Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setProfileInstrument(null)}
                className="px-5 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 cursor-pointer"
              >
                Done Inspecting
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
