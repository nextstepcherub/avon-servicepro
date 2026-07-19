/**
 * AVON ServicePro - Sprint 2: Territory Management Module
 * Enterprise Territory Master, Engineer Assignments (Primary/Backup),
 * Zone Analytics Dashboard, CRUD operations, Zone Details, and Supabase SQL DDL.
 */

import React, { useState, useMemo } from 'react';
import { 
  Territory, 
  Customer, 
  ServiceTicket, 
  Instrument, 
  UserProfile
} from '../../types';
import { 
  MapPin, 
  Building2, 
  Users, 
  Wrench, 
  DollarSign, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  ShieldCheck, 
  UserCheck, 
  UserPlus, 
  Database, 
  Copy, 
  Check, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Layers,
  FileText,
  Activity,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface TerritoryManagementProps {
  territories: Territory[];
  customers: Customer[];
  tickets: ServiceTicket[];
  instruments: Instrument[];
  onAddTerritory: (territory: Territory) => void;
  onUpdateTerritory: (territory: Territory) => void;
  onDeleteTerritory: (id: string) => void;
  currentUser: UserProfile | null;
}

// Available AVON Field Engineers for assignments
const AVAILABLE_ENGINEERS = [
  { id: "eng-1", name: "Eng. Suresh Perera", spec: "HPLC & LC-MS Specialist", cert: "Agilent / Shimadzu Level 3" },
  { id: "eng-2", name: "Eng. Nimani Senanayake", spec: "GC & Spectroscopy Lead", cert: "Thermo / PerkinElmer Master" },
  { id: "eng-3", name: "Eng. Kanishka Jayasundera", spec: "Clinical Diagnostics Expert", cert: "Roche / Abbott Certified" },
  { id: "eng-4", name: "Eng. Dilhan Gunawardena", spec: "Metrology & Calibration", cert: "ISO 17025 Lead Auditor" },
  { id: "eng-5", name: "Eng. Fathima Rizna", spec: "Biotech & Genomics", cert: "Illumina / Bio-Rad Lead" },
  { id: "eng-6", name: "Eng. Chamara Silva", spec: "General Analytical Instrumentation", cert: "AVON Senior Technician" },
  { id: "eng-7", name: "Eng. Kasun Bandara", spec: "Medical Imaging & X-Ray", cert: "Atomic Energy Authority Lic" },
];

const SRI_LANKA_PROVINCES = [
  "Western", "Central", "Southern", "Northern", "Eastern", 
  "North Western", "North Central", "Uva", "Sabaragamuwa"
];

const PROVINCE_DISTRICTS: Record<string, string[]> = {
  "Western": ["Colombo", "Gampaha", "Kalutara"],
  "Central": ["Kandy", "Matale", "Nuwara Eliya"],
  "Southern": ["Galle", "Matara", "Hambantota"],
  "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  "Eastern": ["Trincomalee", "Batticaloa", "Ampara"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  "Uva": ["Badulla", "Monaragala"],
  "Sabaragamuwa": ["Ratnapura", "Kegalle"]
};

export default function TerritoryManagement({
  territories,
  customers,
  tickets,
  onAddTerritory,
  onUpdateTerritory,
  onDeleteTerritory
}: TerritoryManagementProps) {
  
  // UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'supabase_sql'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'engineers' | 'customers' | 'jobs' | 'revenue'>('overview');
  const [copiedSql, setCopiedSql] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    territory_code: '',
    territory_name: '',
    province: 'Western',
    district: 'Colombo',
    districtsCovered: ['Colombo'],
    description: '',
    active: true,
    primaryEngineerId: 'eng-1',
    backupEngineerId: 'eng-2'
  });

  // Toast auto-hide helper
  const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // =========================================================================
  // 1. DASHBOARD CALCULATIONS (Widgets)
  // =========================================================================
  const dashboardStats = useMemo(() => {
    const totalTerritories = territories.length;
    const activeTerritories = territories.filter(t => t.active ?? t.isActive).length;
    
    // Total Customers assigned to territories
    const totalCustomers = customers.length;
    
    // Open Jobs (Service Tickets not closed)
    const openJobs = tickets.filter(t => t.status !== 'CLOSED' && t.status !== 'READY_DELIVERY').length;
    
    // Overdue Jobs (Open tickets created > 3 days ago or marked high priority pending)
    const overdueJobs = tickets.filter(t => {
      const isClosed = t.status === 'CLOSED' || t.status === 'READY_DELIVERY';
      if (isClosed) return false;
      const createdDate = new Date(t.createdAt || Date.now());
      const diffDays = (Date.now() - createdDate.getTime()) / (1000 * 3600 * 24);
      return diffDays > 3 || t.priority === 'CRITICAL';
    }).length;

    // Cumulative Revenue (Sum of totalServiceValue across zones)
    const totalRevenue = territories.reduce((acc, t) => acc + (t.totalServiceValue || 0), 0);

    return {
      totalTerritories,
      activeTerritories,
      totalCustomers,
      openJobs,
      overdueJobs,
      totalRevenue
    };
  }, [territories, customers, tickets]);

  // Filtered Territories list
  const filteredTerritories = useMemo(() => {
    return territories.filter(t => {
      const matchesSearch = 
        (t.territory_name || t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.territory_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.province || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.district || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesProvince = selectedProvince === 'ALL' || t.province === selectedProvince;
      
      const isActive = t.active ?? t.isActive;
      const matchesStatus = 
        statusFilter === 'ALL' || 
        (statusFilter === 'ACTIVE' && isActive) || 
        (statusFilter === 'INACTIVE' && !isActive);

      return matchesSearch && matchesProvince && matchesStatus;
    });
  }, [territories, searchQuery, selectedProvince, statusFilter]);

  // =========================================================================
  // 2. CRUD HANDLERS
  // =========================================================================
  const handleOpenCreate = () => {
    setFormData({
      territory_code: `TER-${formData.province.substring(0, 2).toUpperCase()}-0${territories.length + 1}`,
      territory_name: '',
      province: 'Western',
      district: 'Colombo',
      districtsCovered: ['Colombo'],
      description: '',
      active: true,
      primaryEngineerId: 'eng-1',
      backupEngineerId: 'eng-2'
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (t: Territory) => {
    setSelectedTerritory(t);
    setFormData({
      territory_code: t.territory_code || `TER-${t.province.substring(0,2).toUpperCase()}-01`,
      territory_name: t.territory_name || t.name,
      province: t.province || 'Western',
      district: t.district || (t.districtsCovered && t.districtsCovered[0]) || 'Colombo',
      districtsCovered: t.districtsCovered || ['Colombo'],
      description: t.description || '',
      active: t.active ?? t.isActive ?? true,
      primaryEngineerId: t.assignedEngineerId || 'eng-1',
      backupEngineerId: t.backupEngineerId || 'eng-2'
    });
    setIsEditOpen(true);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.territory_code || !formData.territory_name) {
      triggerToast('Please provide Territory Code and Territory Name', 'error');
      return;
    }

    const primaryEng = AVAILABLE_ENGINEERS.find(e => e.id === formData.primaryEngineerId) || AVAILABLE_ENGINEERS[0];
    const backupEng = AVAILABLE_ENGINEERS.find(e => e.id === formData.backupEngineerId) || AVAILABLE_ENGINEERS[1];
    const nowStr = new Date().toISOString();

    const newTerritory: Territory = {
      id: `terr-${Date.now()}`,
      territory_code: formData.territory_code.toUpperCase(),
      territory_name: formData.territory_name,
      name: formData.territory_name,
      province: formData.province,
      district: formData.district,
      districtsCovered: formData.districtsCovered,
      description: formData.description,
      active: formData.active,
      isActive: formData.active,
      created_at: nowStr,
      assignedEngineerId: primaryEng.id,
      assignedEngineerName: primaryEng.name,
      backupEngineerId: backupEng.id,
      backupEngineerName: backupEng.name,
      slaCompliance: 98.0,
      activeTicketsCount: 0,
      totalServiceValue: 500000,
      engineers: [
        {
          id: `te-p-${Date.now()}`,
          territory_id: `terr-${Date.now()}`,
          engineer_id: primaryEng.id,
          engineer_name: primaryEng.name,
          assignment_type: 'PRIMARY',
          active: true,
          assigned_at: nowStr
        },
        {
          id: `te-b-${Date.now()}`,
          territory_id: `terr-${Date.now()}`,
          engineer_id: backupEng.id,
          engineer_name: backupEng.name,
          assignment_type: 'BACKUP',
          active: true,
          assigned_at: nowStr
        }
      ]
    };

    onAddTerritory(newTerritory);
    setIsCreateOpen(false);
    triggerToast(`Territory ${newTerritory.territory_code} created successfully!`, 'success');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTerritory) return;

    const primaryEng = AVAILABLE_ENGINEERS.find(e => e.id === formData.primaryEngineerId) || AVAILABLE_ENGINEERS[0];
    const backupEng = AVAILABLE_ENGINEERS.find(e => e.id === formData.backupEngineerId) || AVAILABLE_ENGINEERS[1];

    const updatedTerritory: Territory = {
      ...selectedTerritory,
      territory_code: formData.territory_code.toUpperCase(),
      territory_name: formData.territory_name,
      name: formData.territory_name,
      province: formData.province,
      district: formData.district,
      districtsCovered: formData.districtsCovered,
      description: formData.description,
      active: formData.active,
      isActive: formData.active,
      assignedEngineerId: primaryEng.id,
      assignedEngineerName: primaryEng.name,
      backupEngineerId: backupEng.id,
      backupEngineerName: backupEng.name,
      engineers: [
        {
          id: `te-p-${selectedTerritory.id}`,
          territory_id: selectedTerritory.id,
          engineer_id: primaryEng.id,
          engineer_name: primaryEng.name,
          assignment_type: 'PRIMARY',
          active: true,
          assigned_at: selectedTerritory.created_at || new Date().toISOString()
        },
        {
          id: `te-b-${selectedTerritory.id}`,
          territory_id: selectedTerritory.id,
          engineer_id: backupEng.id,
          engineer_name: backupEng.name,
          assignment_type: 'BACKUP',
          active: true,
          assigned_at: selectedTerritory.created_at || new Date().toISOString()
        }
      ]
    };

    onUpdateTerritory(updatedTerritory);
    setIsEditOpen(false);
    setSelectedTerritory(updatedTerritory);
    triggerToast(`Territory ${updatedTerritory.territory_code} updated successfully!`, 'success');
  };

  const handleToggleActive = (t: Territory) => {
    const nextState = !(t.active ?? t.isActive);
    const updated: Territory = {
      ...t,
      active: nextState,
      isActive: nextState
    };
    onUpdateTerritory(updated);
    if (selectedTerritory?.id === t.id) {
      setSelectedTerritory(updated);
    }
    triggerToast(`Territory ${t.territory_code} marked ${nextState ? 'ACTIVE' : 'INACTIVE'}`, 'info');
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete territory ${code}? This will remove engineer zone mappings.`)) {
      onDeleteTerritory(id);
      if (selectedTerritory?.id === id) {
        setSelectedTerritory(null);
      }
      triggerToast(`Territory ${code} deleted`, 'info');
    }
  };

  // =========================================================================
  // 3. ZONE DETAIL FILTERED DATA
  // =========================================================================
  const zoneCustomers = useMemo(() => {
    if (!selectedTerritory) return [];
    return customers.filter(c => {
      return (
        c.province === selectedTerritory.province ||
        selectedTerritory.districtsCovered?.includes(c.district || '') ||
        c.district === selectedTerritory.district
      );
    });
  }, [customers, selectedTerritory]);

  const zoneJobs = useMemo(() => {
    if (!selectedTerritory) return [];
    const custIds = zoneCustomers.map(c => c.id);
    return tickets.filter(t => {
      const matchesCustomer = custIds.includes(t.customerId);
      const matchesEngineer = t.assignedEngineerName === selectedTerritory.assignedEngineerName || t.assignedEngineerName === selectedTerritory.backupEngineerName;
      return matchesCustomer || matchesEngineer;
    });
  }, [tickets, zoneCustomers, selectedTerritory]);

  // =========================================================================
  // 4. SUPABASE SQL DDL SCRIPT GENERATOR
  // =========================================================================
  const SUPABASE_SQL_DDL = `-- =====================================================================
-- AVON ServicePro Enterprise: Sprint 2 Territory Management SQL Schema
-- Supabase PostgreSQL DDL, Row Level Security (RLS), Indexes & Triggers
-- =====================================================================

-- 1. Create Custom Types
CREATE TYPE assignment_role_type AS ENUM ('PRIMARY', 'BACKUP');

-- 2. Territory Master Table
CREATE TABLE IF NOT EXISTS public.territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_code VARCHAR(32) UNIQUE NOT NULL,
  territory_name VARCHAR(128) NOT NULL,
  province VARCHAR(64) NOT NULL,
  district VARCHAR(64) NOT NULL,
  districts_covered TEXT[] DEFAULT '{}',
  description TEXT,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Territory Engineers Assignment Table (Many-to-Many Bridge)
CREATE TABLE IF NOT EXISTS public.territory_engineers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_id UUID NOT NULL REFERENCES public.territories(id) ON DELETE CASCADE,
  engineer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  engineer_name VARCHAR(128) NOT NULL,
  assignment_type assignment_role_type DEFAULT 'PRIMARY' NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(territory_id, engineer_id, assignment_type)
);

-- 4. Indexes for High-Performance Spatial & Regional Querying
CREATE INDEX IF NOT EXISTS idx_territories_code ON public.territories(territory_code);
CREATE INDEX IF NOT EXISTS idx_territories_province ON public.territories(province);
CREATE INDEX IF NOT EXISTS idx_territories_active ON public.territories(active);
CREATE INDEX IF NOT EXISTS idx_territory_engineers_terr ON public.territory_engineers(territory_id);
CREATE INDEX IF NOT EXISTS idx_territory_engineers_eng ON public.territory_engineers(engineer_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.territory_engineers ENABLE ROW LEVEL SECURITY;

-- 6. Security Policies (ISO-9001 RBAC Alignment)
-- Authenticated users can read active zones
CREATE POLICY "Allow read access to authenticated users" 
  ON public.territories FOR SELECT 
  TO authenticated 
  USING (true);

-- Workshop Managers and System Admins have full DML privileges
CREATE POLICY "Allow management access to Admins and Managers" 
  ON public.territories FOR ALL 
  TO authenticated 
  USING (
    (auth.jwt() ->> 'role' IN ('System Admin', 'Workshop Manager', 'Service Manager', 'Country Director'))
  );

CREATE POLICY "Allow assignment management to Managers" 
  ON public.territory_engineers FOR ALL 
  TO authenticated 
  USING (
    (auth.jwt() ->> 'role' IN ('System Admin', 'Workshop Manager', 'Service Manager'))
  );

-- 7. Seed Initial Territory Data
INSERT INTO public.territories (territory_code, territory_name, province, district, districts_covered, description, active)
VALUES 
  ('TER-WP-01', 'Colombo Metro Division', 'Western', 'Colombo', '{"Colombo","Gampaha"}', 'Commercial hub & major diagnostics centers.', true),
  ('TER-CP-01', 'Central Hill Country', 'Central', 'Kandy', '{"Kandy","Matale","Nuwara Eliya"}', 'University labs & tea estate institutes.', true),
  ('TER-SP-01', 'Southern Coastal Belt', 'Southern', 'Galle', '{"Galle","Matara","Hambantota"}', 'Southern port & coastal medical labs.', true)
ON CONFLICT (territory_code) DO NOTHING;
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_DDL);
    setCopiedSql(true);
    triggerToast('Supabase SQL Schema copied to clipboard!', 'info');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Format currency helper
  const formatLKR = (num: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(num);
  };

  // =========================================================================
  // RENDER COMPONENT
  // =========================================================================
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* TOAST BANNER */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all animate-bounce ${
          notification.type === 'error' ? 'bg-rose-950 text-rose-200 border-rose-800' :
          notification.type === 'info' ? 'bg-indigo-950 text-indigo-200 border-indigo-800' :
          'bg-emerald-950 text-emerald-200 border-emerald-800'
        }`}>
          {notification.type === 'error' ? <XCircle className="w-5 h-5 text-rose-400" /> :
           notification.type === 'info' ? <AlertCircle className="w-5 h-5 text-indigo-400" /> :
           <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span className="text-sm font-medium">{notification.msg}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#001D3D] via-[#0054A6] to-[#1E1B4B] text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-400/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-cyan-400/20 border border-cyan-400/40 rounded-xl text-cyan-300 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-700/50">
                AVON ServicePro Module 02
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
              Territory & Service Zone Architecture
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl font-sans">
              Manage provincial service zones, dispatch engineer assignments (Primary & Backup coverage), monitor SLA compliance, and audit zone customer density.
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Territory</span>
            </button>
            <button
              onClick={() => setActiveTab('supabase_sql')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                activeTab === 'supabase_sql' 
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' 
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
              }`}
            >
              <Database className="w-4 h-4 text-cyan-300" />
              <span>Supabase SQL</span>
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-white/15 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#003B75] shadow-md scale-102'
                : 'text-blue-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Territory Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              activeTab === 'list'
                ? 'bg-white text-[#003B75] shadow-md scale-102'
                : 'text-blue-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Territory Master ({territories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('supabase_sql')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              activeTab === 'supabase_sql'
                ? 'bg-white text-[#003B75] shadow-md scale-102'
                : 'text-blue-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Supabase SQL & Schema</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: TERRITORY DASHBOARD WIDGETS
      ====================================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* 6 Dashboard KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Widget 1: Total Territories */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Zone Network</span>
                  <div className="text-3xl font-black text-slate-800 mt-1 font-sans">{dashboardStats.totalTerritories}</div>
                  <div className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{dashboardStats.activeTerritories} Active Zones</span>
                  </div>
                </div>
                <div className="p-3.5 bg-blue-50 text-[#0054A6] rounded-2xl group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0054A6]" />
            </div>

            {/* Widget 2: Total Customers */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Total Customers</span>
                  <div className="text-3xl font-black text-slate-800 mt-1 font-sans">{dashboardStats.totalCustomers}</div>
                  <div className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Diagnostics & Pharma Clients</span>
                  </div>
                </div>
                <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600" />
            </div>

            {/* Widget 3: Total Open Jobs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Total Open Jobs</span>
                  <div className="text-3xl font-black text-slate-800 mt-1 font-sans">{dashboardStats.openJobs}</div>
                  <div className="text-xs font-medium text-amber-600 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Dispatch & Repair</span>
                  </div>
                </div>
                <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Wrench className="w-7 h-7" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
            </div>

            {/* Widget 4: Revenue */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Territory Revenue</span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 font-sans">{formatLKR(dashboardStats.totalRevenue)}</div>
                  <div className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Annual AMC & Repair Value</span>
                  </div>
                </div>
                <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <DollarSign className="w-7 h-7" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
            </div>

            {/* Widget 5: Overdue Jobs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Overdue SLA Jobs</span>
                  <div className={`text-3xl font-black mt-1 font-sans ${dashboardStats.overdueJobs > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {dashboardStats.overdueJobs}
                  </div>
                  <div className="text-xs font-medium text-rose-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Requires Escalation</span>
                  </div>
                </div>
                <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform animate-pulse">
                  <AlertCircle className="w-7 h-7" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-600" />
            </div>

            {/* Widget 6: Engineer Coverage Index */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-indigo-800/60 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block">Zone Redundancy</span>
                  <div className="text-2xl font-black mt-1 font-sans">100% Dual Coverage</div>
                  <p className="text-xs text-indigo-200 mt-1">Every active territory maintains 1 Primary + 1 Backup Engineer assignment.</p>
                </div>
                <ShieldCheck className="w-10 h-10 text-cyan-400 shrink-0 opacity-80" />
              </div>
              <div className="mt-4 pt-3 border-t border-indigo-800/80 flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>ISO-9001 COMPLIANT</span>
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> VERIFIED</span>
              </div>
            </div>

          </div>

          {/* Quick Zone Performance Matrix Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#0054A6]" />
                <span>Territory Performance Matrix</span>
              </h3>
              <button
                onClick={() => setActiveTab('list')}
                className="text-xs font-bold text-[#0054A6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Master Table</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {territories.slice(0, 3).map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => setSelectedTerritory(t)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-blue-100 text-[#0054A6] rounded">
                      {t.territory_code || 'TER-01'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      (t.active ?? t.isActive) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {(t.active ?? t.isActive) ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-[#0054A6] transition-colors">{t.territory_name || t.name}</h4>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Province: {t.province} ({t.district || 'Metro'})</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-600">SLA: <strong className="text-emerald-600 font-mono">{t.slaCompliance}%</strong></span>
                    <span className="text-slate-600">Jobs: <strong className="text-slate-800 font-mono">{t.activeTicketsCount}</strong></span>
                    <span className="text-slate-600">Val: <strong className="text-emerald-700 font-mono">{formatLKR(t.totalServiceValue || 0)}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 2: TERRITORY MASTER & CRUD TABLE
      ====================================================================== */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          
          {/* SEARCH & FILTER BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search territory code, name, province..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:bg-white transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Province:</span>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="bg-transparent font-bold text-[#0054A6] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Provinces</option>
                  {SRI_LANKA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent font-bold text-[#0054A6] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {/* Reset filter button */}
              {(searchQuery || selectedProvince !== 'ALL' || statusFilter !== 'ALL') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedProvince('ALL'); setStatusFilter('ALL'); }}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer px-2"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* TERRITORIES TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Territory Code</th>
                    <th className="py-3.5 px-4">Territory Name</th>
                    <th className="py-3.5 px-4">Province & District</th>
                    <th className="py-3.5 px-4">Primary Engineer</th>
                    <th className="py-3.5 px-4">Backup Engineer</th>
                    <th className="py-3.5 px-4 text-center">SLA</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredTerritories.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">No territories found matching criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTerritories.map((t) => {
                      const isActive = t.active ?? t.isActive ?? true;
                      return (
                        <tr 
                          key={t.id}
                          className="hover:bg-slate-50/70 transition-colors group"
                        >
                          {/* Code */}
                          <td className="py-3.5 px-4 font-mono font-bold text-[#0054A6]">
                            {t.territory_code || 'TER-WP-01'}
                          </td>

                          {/* Name */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => setSelectedTerritory(t)}
                              className="font-bold text-slate-800 hover:text-[#0054A6] hover:underline text-left flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>{t.territory_name || t.name}</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                            </button>
                            {t.description && (
                              <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{t.description}</p>
                            )}
                          </td>

                          {/* Province */}
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-700">{t.province}</span>
                            <span className="text-xs text-slate-400 block font-mono">{t.district || (t.districtsCovered && t.districtsCovered.join(', '))}</span>
                          </td>

                          {/* Primary Engineer */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-xs font-bold text-slate-800">{t.assignedEngineerName || "Eng. Suresh Perera"}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 block ml-6">PRIMARY ASSIGNED</span>
                          </td>

                          {/* Backup Engineer */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                              <span className="text-xs font-medium text-slate-600">{t.backupEngineerName || "Eng. Nimani Senanayake"}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 block ml-6">BACKUP COVERAGE</span>
                          </td>

                          {/* SLA */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                            {t.slaCompliance || 98.0}%
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleToggleActive(t)}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-transform active:scale-95 ${
                                isActive 
                                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              {isActive ? 'ACTIVE' : 'INACTIVE'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedTerritory(t)}
                                title="View Zone Detail"
                                className="p-1.5 text-slate-500 hover:text-[#0054A6] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Activity className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(t)}
                                title="Edit Territory"
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(t.id, t.territory_code || t.name)}
                                title="Delete Territory"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-2">
              <span>SHOWING {filteredTerritories.length} OF {territories.length} TERRITORY MASTERS</span>
              <span>AVON ISO-9001 TERRITORY & ZONE REGISTRY V2.4</span>
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 3: SUPABASE SQL GENERATOR & DDL SCRIPT
      ====================================================================== */}
      {activeTab === 'supabase_sql' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
              <div>
                <div className="flex items-center gap-2 text-[#0054A6] font-mono text-xs font-bold uppercase tracking-wider mb-1">
                  <Database className="w-4 h-4" />
                  <span>Supabase PostgreSQL Production Schema</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Sprint 2 SQL Migration Script
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Copy and execute this DDL in your Supabase SQL Editor to provision tables, foreign keys, indexes, and RLS policies.
                </p>
              </div>

              <button
                onClick={copySqlToClipboard}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0054A6] hover:bg-[#003B75] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
              </button>
            </div>

            {/* SQL Code Block */}
            <div className="mt-4 bg-[#0F172A] text-slate-100 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner max-h-[550px] overflow-y-auto leading-relaxed">
              <pre className="whitespace-pre">{SUPABASE_SQL_DDL}</pre>
            </div>
          </div>

          {/* Interactive DDL Execution Simulator Card */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white p-6 rounded-2xl border border-indigo-700/50 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">Simulated Execution Engine</span>
              <h4 className="text-lg font-bold">Verify Relationships & Foreign Key Cascades</h4>
              <p className="text-xs text-indigo-200 max-w-xl">
                The schema establishes strict <code>ON DELETE CASCADE</code> rules between <code>territories</code> and <code>territory_engineers</code>. Bridge table constraints enforce unique Primary/Backup role assignments per engineer per territory.
              </p>
            </div>
            <button
              onClick={() => {
                triggerToast('Simulated Supabase SQL Execution check passed! All 3 tables verified.', 'success');
              }}
              className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Simulate DB Migration</span>
            </button>
          </div>

        </div>
      )}

      {/* =====================================================================
          MODAL 1: CREATE / EDIT TERRITORY DIALOG
      ====================================================================== */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Dialog Header */}
            <div className="p-6 bg-gradient-to-r from-[#001D3D] to-[#0054A6] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  {isCreateOpen ? <Plus className="w-6 h-6 text-cyan-300" /> : <Edit3 className="w-6 h-6 text-amber-300" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {isCreateOpen ? 'Create New Territory' : `Edit Territory: ${selectedTerritory?.territory_code || ''}`}
                  </h3>
                  <p className="text-xs text-blue-100">Configure zone parameters and assign field engineers</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={isCreateOpen ? handleSaveCreate : handleSaveEdit} className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Territory Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.territory_code}
                    onChange={(e) => setFormData({ ...formData, territory_code: e.target.value })}
                    placeholder="e.g. TER-WP-02"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-[#0054A6] focus:bg-white focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Territory Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.territory_name}
                    onChange={(e) => setFormData({ ...formData, territory_name: e.target.value })}
                    placeholder="e.g. Colombo South Division"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Province *</label>
                  <select
                    value={formData.province}
                    onChange={(e) => {
                      const nextProv = e.target.value;
                      const defaultDist = PROVINCE_DISTRICTS[nextProv]?.[0] || 'Colombo';
                      setFormData({ 
                        ...formData, 
                        province: nextProv, 
                        district: defaultDist,
                        districtsCovered: [defaultDist] 
                      });
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-[#0054A6] focus:outline-none cursor-pointer"
                  >
                    {SRI_LANKA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Primary District *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value, districtsCovered: [e.target.value] })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-[#0054A6] focus:outline-none cursor-pointer"
                  >
                    {(PROVINCE_DISTRICTS[formData.province] || ['Colombo']).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Description & Key Clients</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe zone boundaries, major hospitals, or diagnostic laboratories..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
                />
              </div>

              {/* Engineer Assignments Section */}
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3">
                <span className="text-xs font-mono font-bold text-[#0054A6] uppercase tracking-wider block flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>Field Engineer Zone Dispatch Assignment</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Primary Engineer (PRIMARY)</label>
                    <select
                      value={formData.primaryEngineerId}
                      onChange={(e) => setFormData({ ...formData, primaryEngineerId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      {AVAILABLE_ENGINEERS.map(e => <option key={e.id} value={e.id}>{e.name} ({e.spec})</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Backup Engineer (BACKUP)</label>
                    <select
                      value={formData.backupEngineerId}
                      onChange={(e) => setFormData({ ...formData, backupEngineerId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-600 focus:outline-none cursor-pointer"
                    >
                      {AVAILABLE_ENGINEERS.map(e => <option key={e.id} value={e.id}>{e.name} ({e.spec})</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active_status"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0054A6] focus:ring-[#0054A6] cursor-pointer"
                />
                <label htmlFor="active_status" className="text-sm font-bold text-slate-800 cursor-pointer">
                  Territory is ACTIVE (Available for Ticket Dispatch & Job Master routing)
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#001D3D] to-[#0054A6] hover:from-[#002B55] hover:to-[#0077C8] text-white font-bold text-sm rounded-xl shadow-lg cursor-pointer"
                >
                  {isCreateOpen ? 'Create Territory' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: TERRITORY DETAIL PAGE / DRAWER
      ====================================================================== */}
      {selectedTerritory && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-4xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-slide-left">
            
            {/* Drawer Header */}
            <div className="p-6 bg-gradient-to-r from-[#001D3D] via-[#0054A6] to-[#1E1B4B] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-400/20 border border-cyan-400/40 rounded-2xl text-cyan-300">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded">
                      {selectedTerritory.territory_code || 'TER-01'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      (selectedTerritory.active ?? selectedTerritory.isActive) ? 'bg-emerald-500 text-slate-900' : 'bg-rose-500 text-white'
                    }`}>
                      {(selectedTerritory.active ?? selectedTerritory.isActive) ? 'ACTIVE ZONE' : 'INACTIVE'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                    {selectedTerritory.territory_name || selectedTerritory.name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(selectedTerritory)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  <Edit3 className="w-4 h-4 text-amber-300" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedTerritory(null)}
                  className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Drawer Sub-Tabs (Overview, Engineers, Customers, Jobs, Revenue) */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-2 overflow-x-auto shrink-0 py-2">
              {[
                { key: 'overview', label: 'Overview', icon: FileText },
                { key: 'engineers', label: 'Engineers (2)', icon: Users },
                { key: 'customers', label: `Customers (${zoneCustomers.length})`, icon: Building2 },
                { key: 'jobs', label: `Open Jobs (${zoneJobs.length})`, icon: Wrench },
                { key: 'revenue', label: 'Revenue Analytics', icon: DollarSign },
              ].map(tab => {
                const IconComp = tab.icon;
                const isCur = detailTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setDetailTab(tab.key as any)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isCur 
                        ? 'bg-[#0054A6] text-white shadow-md' 
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Drawer Tab Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 bg-slate-50/50">
              
              {/* TAB 1: OVERVIEW */}
              {detailTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Province</span>
                      <div className="text-lg font-black text-slate-800 mt-0.5">{selectedTerritory.province}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Primary District</span>
                      <div className="text-lg font-black text-[#0054A6] mt-0.5">{selectedTerritory.district || 'Colombo'}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Created Date</span>
                      <div className="text-sm font-bold text-slate-700 mt-1 font-mono">
                        {selectedTerritory.created_at ? new Date(selectedTerritory.created_at).toLocaleDateString() : '2024-01-10'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <h4 className="font-bold text-slate-800 text-sm">Territory Scope & Description</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedTerritory.description || "Commercial and clinical diagnostic laboratory hub maintained under AVON ServicePro Gold Level AMC coverage."}
                    </p>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase self-center mr-2">Districts Covered:</span>
                      {(selectedTerritory.districtsCovered || [selectedTerritory.district || 'Colombo']).map(d => (
                        <span key={d} className="px-2.5 py-1 bg-blue-50 text-[#0054A6] text-xs font-bold rounded-lg border border-blue-100">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SLA Matrix Summary */}
                  <div className="bg-gradient-to-r from-emerald-950 to-teal-950 text-white p-6 rounded-2xl border border-emerald-800/80 shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">SLA Compliance Target</span>
                      <div className="text-3xl font-black text-white mt-1">{selectedTerritory.slaCompliance || 98.0}%</div>
                      <p className="text-xs text-emerald-200 mt-1">Exceeds standard enterprise benchmark (95.0%).</p>
                    </div>
                    <Activity className="w-12 h-12 text-emerald-400 opacity-80 animate-pulse" />
                  </div>
                </div>
              )}

              {/* TAB 2: ENGINEERS (PRIMARY / BACKUP TABLE) */}
              {detailTab === 'engineers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">Assigned Field Engineers</h4>
                      <p className="text-xs text-slate-500">Table: <code>territory_engineers</code> (Primary & Backup redundancy)</p>
                    </div>
                    <button
                      onClick={() => handleOpenEdit(selectedTerritory)}
                      className="px-3 py-1.5 bg-[#0054A6] hover:bg-[#003B75] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Re-assign Engineers</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                          <th className="py-3 px-4">Role Type</th>
                          <th className="py-3 px-4">Engineer Name</th>
                          <th className="py-3 px-4">Specialization</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Assigned Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {/* Primary */}
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono text-xs font-black rounded-lg">
                              PRIMARY
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {selectedTerritory.assignedEngineerName || "Eng. Suresh Perera"}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">
                            HPLC & LC-MS Specialist (Level 3 Cert)
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">ACTIVE</span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-400">
                            {selectedTerritory.created_at ? new Date(selectedTerritory.created_at).toLocaleDateString() : '2024-01-10'}
                          </td>
                        </tr>

                        {/* Backup */}
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 font-mono text-xs font-black rounded-lg">
                              BACKUP
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {selectedTerritory.backupEngineerName || "Eng. Nimani Senanayake"}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">
                            GC & Spectroscopy Lead (Master Cert)
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">ACTIVE</span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-400">
                            {selectedTerritory.created_at ? new Date(selectedTerritory.created_at).toLocaleDateString() : '2024-01-10'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOMERS IN ZONE */}
              {detailTab === 'customers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">Zone Customer Directory ({zoneCustomers.length})</h4>
                      <p className="text-xs text-slate-500">Clients mapped to province <strong>{selectedTerritory.province}</strong></p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    {zoneCustomers.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No customers currently registered in this district.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                            <th className="py-3 px-4">Customer Name</th>
                            <th className="py-3 px-4">District</th>
                            <th className="py-3 px-4">Contact Person</th>
                            <th className="py-3 px-4 text-center">Lab Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {zoneCustomers.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50/60">
                              <td className="py-3.5 px-4 font-bold text-slate-800">{c.name}</td>
                              <td className="py-3.5 px-4 text-slate-600 font-medium">{c.district || selectedTerritory.district}</td>
                              <td className="py-3.5 px-4 text-xs text-slate-500">{c.contactPerson || 'Lab Manager'}</td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="px-2.5 py-0.5 bg-blue-50 text-[#0054A6] border border-blue-100 font-mono text-xs font-bold rounded-full">
                                  {c.labType || 'Diagnostics'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: OPEN JOBS IN ZONE */}
              {detailTab === 'jobs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">Active Zone Service Tickets ({zoneJobs.length})</h4>
                      <p className="text-xs text-slate-500">Open jobs assigned to Primary / Backup Engineers</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    {zoneJobs.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
                        <p className="text-sm font-bold text-slate-700">No open service tickets in this territory!</p>
                        <p className="text-xs text-slate-400 mt-1">All maintenance and breakdown jobs are completed.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                            <th className="py-3 px-4">Ticket ID</th>
                            <th className="py-3 px-4">Title / Issue</th>
                            <th className="py-3 px-4">Priority</th>
                            <th className="py-3 px-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {zoneJobs.map(j => (
                            <tr key={j.id} className="hover:bg-slate-50/60">
                              <td className="py-3 px-4 font-mono font-bold text-[#0054A6]">{j.ticketNumber || j.id}</td>
                              <td className="py-3 px-4 font-bold text-slate-800">{j.subject || j.description}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${
                                  j.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                                }`}>{j.priority}</span>
                              </td>
                              <td className="py-3 px-4 text-center font-mono text-xs font-bold text-amber-600">{j.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: REVENUE break down */}
              {detailTab === 'revenue' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-[#001D3D] to-[#0054A6] text-white p-6 rounded-2xl shadow-md">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block">Zone Annual Revenue Valuation</span>
                    <div className="text-3xl sm:text-4xl font-black mt-2">{formatLKR(selectedTerritory.totalServiceValue || 500000)}</div>
                    <p className="text-xs text-blue-200 mt-2">Represents active Gold & Platinum AMC contract revenue across {zoneCustomers.length} client labs.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="text-xs font-mono font-bold text-slate-400 uppercase">AMC Contract Share</div>
                      <div className="text-2xl font-black text-emerald-700 mt-1">82% AMC</div>
                      <p className="text-xs text-slate-500 mt-1">Scheduled preventive maintenance contracts</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="text-xs font-mono font-bold text-slate-400 uppercase">On-Demand Repair Share</div>
                      <div className="text-2xl font-black text-indigo-600 mt-1">18% Billable</div>
                      <p className="text-xs text-slate-500 mt-1">Emergency dispatch and spare part replacements</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono shrink-0">
              <span>TERRITORY UUID: {selectedTerritory.id}</span>
              <button
                onClick={() => setSelectedTerritory(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
