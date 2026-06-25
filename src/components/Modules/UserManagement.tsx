import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types';
import { ROLE_MATRIX } from '../../data/dbSchema';
import { 
  AVONEmployeeV4, 
  AVONRoleV4, 
  AVONTagV4, 
  AVON_ROLES_LIST, 
  AVON_TAGS_LIST, 
  MOCK_INITIAL_EMPLOYEES, 
  SUPABASE_SQL_DDL_CODE, 
  NEXTJS_SERVER_ACTIONS_CODE, 
  NEXTJS_REACT_COMPONENTS_CODE 
} from '../../data/nextjsSupabaseAuthData';
import { 
  isManager, 
  isDocumentationOfficer, 
  isFullEngineer, 
  isSupportTech, 
  canCalibrate, 
  canRegister, 
  canDecommission 
} from '../../utils/authHelpers';
import { 
  ShieldAlert, 
  Users, 
  Check, 
  X, 
  Award, 
  KeyRound, 
  UserPlus, 
  Code, 
  ShieldCheck, 
  RefreshCw, 
  Terminal,
  Copy,
  CheckCircle2,
  Lock,
  LockKeyhole,
  Eye,
  CheckSquare,
  Bookmark,
  Database,
  FileText,
  ChevronRight,
  HelpCircle,
  Activity,
  UserCheck,
  Zap,
  Tag,
  Building2,
  LockOpen,
  Wrench,
  Plus,
  Trash2,
  Edit,
  Search,
  LogOut,
  LogIn,
  Key,
  Sparkles,
  Sliders
} from 'lucide-react';

interface UserManagementProps {
  currentUser: UserProfile;
  onRoleChange: (role: UserRole) => void;
}

export default function UserManagement({ currentUser, onRoleChange }: UserManagementProps) {
  const [activeTab, setActiveTab] = useState<'matrix' | 'lifecycle' | 'dashboards' | 'supabase' | 'nextjs'>('nextjs');
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<UserRole>(currentUser.role);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [simulatedLogs, setSimulatedLogs] = useState<Array<{ id: string; time: string; type: 'success' | 'danger' | 'info'; text: string }>>([
    { id: '1', time: '03:45:12', type: 'info', text: 'AVON ServicePro RBAC Engine initialized successfully.' },
    { id: '2', time: '03:45:15', type: 'success', text: `Session verified: Active desktop logged in as Fathima Farhana (${currentUser.role})` }
  ]);

  // Next.js 15 Auth & User Directory states
  const [employeesState, setEmployeesState] = useState<AVONEmployeeV4[]>(MOCK_INITIAL_EMPLOYEES);
  const [nextjsSubTab, setNextjsSubTab] = useState<'crud' | 'actions' | 'components' | 'sql'>('crud');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [tagFilter, setTagFilter] = useState<string>('All');
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('+94 77 ');
  const [newEmpDept, setNewEmpDept] = useState('Field Technical Service');
  const [newEmpRole, setNewEmpRole] = useState<AVONRoleV4>('Biomedical Engineer');
  const [newEmpTags, setNewEmpTags] = useState<AVONTagV4[]>(['Area Engineer']);
  const [authBannerMsg, setAuthBannerMsg] = useState<string | null>(null);

  const showAuthToast = (msg: string) => {
    setAuthBannerMsg(msg);
    setTimeout(() => setAuthBannerMsg(null), 4500);
  };

  const handleAddNewEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpEmail || !newEmpName) return;
    const tempPass = "AVON_" + Math.random().toString(36).slice(-6) + "!";
    const newEmp: AVONEmployeeV4 = {
      id: "usr-" + Math.random().toString(36).slice(2, 8),
      email: newEmpEmail,
      full_name: newEmpName,
      role: newEmpRole,
      engineer_tags: newEmpTags,
      phone_number: newEmpPhone,
      department: newEmpDept,
      is_active: true,
      created_at: new Date().toISOString()
    };
    setEmployeesState([newEmp, ...employeesState]);
    setIsNewEmployeeModalOpen(false);
    setNewEmpEmail('');
    setNewEmpName('');
    showAuthToast(`✅ Created employee ${newEmpName} in Supabase Auth! Temp Password: ${tempPass}`);
  };

  const handleToggleActiveStatus = (id: string, name: string, curr: boolean) => {
    setEmployeesState(prev => prev.map(emp => emp.id === id ? { ...emp, is_active: !curr } : emp));
    showAuthToast(`ℹ️ User ${name} status updated to ${!curr ? 'ACTIVE' : 'INACTIVE'} (Server Action revalidated).`);
  };

  const handleAssignRole = (id: string, role: AVONRoleV4) => {
    setEmployeesState(prev => prev.map(emp => emp.id === id ? { ...emp, role } : emp));
    showAuthToast(`🔄 Assigned role "${role}" via updateUserRoleAction().`);
  };

  const handleToggleTag = (id: string, tag: AVONTagV4) => {
    setEmployeesState(prev => prev.map(emp => {
      if (emp.id !== id) return emp;
      const tags = emp.engineer_tags.includes(tag)
        ? emp.engineer_tags.filter(t => t !== tag)
        : [...emp.engineer_tags, tag];
      return { ...emp, engineer_tags: tags };
    }));
  };

  const handleDeleteEmployee = (id: string, name: string) => {
    setEmployeesState(prev => prev.filter(emp => emp.id !== id));
    showAuthToast(`🗑️ Deleted user ${name} from Supabase auth.users & user_profiles cascade.`);
  };

  const filteredEmployees = employeesState.filter(emp => {
    const matchesSearch = emp.full_name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          emp.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          emp.department.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || emp.role === roleFilter;
    const matchesTag = tagFilter === 'All' || emp.engineer_tags.includes(tagFilter as AVONTagV4);
    return matchesSearch && matchesRole && matchesTag;
  });

  // Pre-configured staff representative profiles representing different tiers
  const preConfiguredStaff: UserProfile[] = [
    { 
      id: "usr-wm-1", 
      name: "M. N. Jayawardene", 
      email: "manager@avon.lk", 
      role: "Workshop Manager", 
      department: "Service Centre Administration", 
      avatar: "MJ" 
    },
    { 
      id: "usr-do-1", 
      name: "Fathima Farhana", 
      email: "farhana.f@avon.lk", 
      role: "Documentation Officer", 
      department: "Compliance & QA Office", 
      avatar: "FF" 
    },
    { 
      id: "usr-sbe-1", 
      name: "Eng. Suresh Perera", 
      email: "suresh@avon.lk", 
      role: "Senior Biomedical Engineer", 
      department: "Advanced Chromatography Unit", 
      avatar: "SP" 
    },
    { 
      id: "usr-ce-1", 
      name: "Eng. Nimani Senanayake", 
      email: "nimani@avon.lk", 
      role: "Calibration Engineer", 
      department: "Physical Metrology Labs", 
      avatar: "NS" 
    },
    { 
      id: "usr-it-1", 
      name: "Trainee Keshara de Silva", 
      email: "keshara@avon.lk", 
      role: "Intern Technician", 
      department: "Workshop Training Division", 
      avatar: "KD" 
    }
  ];

  // List of all 16 precise roles requested
  const AVAILABLE_ROLES: UserRole[] = [
    'Workshop Manager',
    'Documentation Officer',
    'Senior Biomedical Engineer',
    'Biomedical Engineer',
    'Junior Biomedical Engineer',
    'Senior Service Engineer',
    'Service Engineer',
    'Junior Service Engineer',
    'Senior Workshop Engineer',
    'Workshop Engineer',
    'Junior Workshop Engineer',
    'Calibration Engineer',
    'Technician',
    'Trainee Technician',
    'Trainee Engineer',
    'Intern Technician'
  ];

  // Map each of the 16 roles to their specific engineering tags and groups
  const getRoleMetaData = (role: UserRole) => {
    switch (role) {
      case 'Workshop Manager':
        return {
          tier: 'Management',
          tag: 'Area Engineer / Admin',
          desc: 'Holds complete operational control over the service center, authorizes quotes, and assigns technical personnel.',
          canCreate: true,
          canAssign: true,
          canApprove: true,
          canClose: true,
          dashboard: 'Workshop Administration Control'
        };
      case 'Documentation Officer':
        return {
          tier: 'Management',
          tag: 'Administrative Compliance',
          desc: 'Creates pending equipment installation orders, verify calibration paperwork, compiles CRM data, and updates warranty records.',
          canCreate: true,
          canAssign: false,
          canApprove: false,
          canClose: true, // Specifically closes jobs by final warranty signoff
          dashboard: 'Compliance & Asset Register Platform'
        };
      case 'Senior Biomedical Engineer':
      case 'Biomedical Engineer':
        return {
          tier: 'Engineering',
          tag: 'Area Engineer',
          desc: 'Undertakes field inspections, complex multi-detection setups, and advanced client calibrations.',
          canCreate: false,
          canAssign: false,
          canApprove: false,
          canClose: false, // can only complete tasks technically
          dashboard: 'Area Assignment Workbench'
        };
      case 'Junior Biomedical Engineer':
        return {
          tier: 'Technical Assistance',
          tag: 'Area Engineer',
          desc: 'Aids senior field staff in physical equipment assembly, site surveys, and scheduled service logs.',
          canCreate: false,
          canAssign: false,
          canApprove: false,
          canClose: false,
          dashboard: 'Junior Support Workbench'
        };
      case 'Senior Service Engineer':
      case 'Service Engineer':
        return {
          tier: 'Engineering',
          tag: 'Area Engineer',
          desc: 'Services heavy chemical and mechanical apparatus on client locations, logs mechanical test compliance.',
          canCreate: false,
          canAssign: false,
          canApprove: false,
          canClose: false,
          dashboard: 'Area Assignment Workbench'
        };
      case 'Junior Service Engineer':
        return {
          tier: 'Technical Assistance',
          tag: 'Area Engineer',
          desc: 'Assists with basic machinery overhaul logs under the oversight of area engineering supervisors.',
          canCreate: false,
          canAssign: false,
          canApprove: false,
          canClose: false,
          dashboard: 'Junior Support Workbench'
        };
      case 'Senior Workshop Engineer':
      case 'Workshop Engineer':
        return {
          tier: 'Engineering',
          tag: 'Workshop Engineer',
          desc: 'Executes bench diagnoses, electronic circuit overhauls, and deep component replacements inside AVON centre.',
          canCreate: false,
          canAssign: false,
          canApprove: false,
          canClose: false,
          dashboard: 'Workshop Bench Workbench'
        };
      case 'Junior Workshop Engineer':
        return {
          tier: 'Technical Assistance',
          tag: 'Workshop Engineer',
          desc: 'Undertakes initial bench teardowns, board level visual checks, and parts cataloging under supervision.',
          canCreate: false,
          canAssign: false,
          canApprove: false,
          canClose: false,
          dashboard: 'Junior Support Workbench'
        };
      case 'Calibration Engineer':
        return {
          tier: 'Engineering',
          tag: 'Calibration Engineer',
          desc: 'Accredited specialist. Conducts certified metrology alignments, verifies standards, and prints secure ISO certificates.',
          canCreate: false,
          canAssign: false,
          canApprove: false,
          canClose: false,
          dashboard: 'Calibration Metrology Workbench'
        };
      case 'Technician':
        return {
          tier: 'Technical Support',
          tag: 'Workshop Engineer',
          desc: 'Assembles sub-assemblies, cleans gas chromatography lines, and performs baseline electrical leakage checks.',
          canCreate: false,
          canAssign: false,
          canApprove: false,
          canClose: false,
          dashboard: 'Workshop Bench Workbench'
        };
      case 'Trainee Technician':
      case 'Intern Technician':
        return {
          tier: 'Technical Assistance',
          tag: 'Workshop Engineer',
          desc: 'Undergoes structured training. Aids workshop crew by loading standards, organizing toolkits, and drafting work receipts.',
          canCreate: false,
          canAssign: false,
          canApprove: false,
          canClose: false,
          dashboard: 'Supervised Learning Workbench'
        };
      case 'Trainee Engineer':
        return {
          tier: 'Technical Assistance',
          tag: 'Calibration Engineer',
          desc: 'Undergoes calibration workflow onboarding. Records raw thermal readings under senior supervision.',
          canCreate: false,
          canAssign: false,
          canApprove: false,
          canClose: false,
          dashboard: 'Supervised Learning Workbench'
        };
      default:
        return {
          tier: 'Special Roles',
          tag: 'Unassigned',
          desc: 'Platform administrative access or guest client access.',
          canCreate: false,
          canAssign: false,
          canApprove: false,
          canClose: false,
          dashboard: 'Restricted Hub View'
        };
    }
  };

  // Helper check for custom role hierarchy to feed the matrix grid
  const mapsPrivilege = (role: UserRole, operation: string) => {
    const meta = getRoleMetaData(role);
    if (operation === 'CREATE') return meta.canCreate;
    if (operation === 'ASSIGN') return meta.canAssign;
    if (operation === 'APPROVE') return meta.canApprove;
    if (operation === 'CLOSE') return meta.canClose;
    if (operation === 'EXECUTE') {
      return ['Engineering', 'Technical Support', 'Technical Assistance'].includes(meta.tier);
    }
    if (operation === 'METROLOGY') {
      return role === 'Calibration Engineer' || role === 'Senior Biomedical Engineer' || role === 'Workshop Manager';
    }
    return false;
  };

  // Trigger test action simulated workflow logger
  const triggerSimulatedAction = (action: 'CREATE' | 'ASSIGN' | 'APPROVE' | 'CLOSE') => {
    const timeString = new Date().toLocaleTimeString();
    const meta = getRoleMetaData(currentUser.role);
    const idStr = String(simulatedLogs.length + 1);

    if (action === 'CREATE') {
      if (meta.canCreate) {
        setSimulatedLogs(prev => [
          { 
            id: idStr, 
            time: timeString, 
            type: 'success', 
            text: `[ACCESS GRANTED] ${currentUser.name} (${currentUser.role}) successfully created dynamic job order INS-2026-681.` 
          },
          ...prev
        ]);
      } else {
        setSimulatedLogs(prev => [
          { 
            id: idStr, 
            time: timeString, 
            type: 'danger', 
            text: `[ACCESS DENIED] ${currentUser.name} (${currentUser.role}) attempted to create job. Action restricted to [Management (Workshop Manager, Documentation Officer)].` 
          },
          ...prev
        ]);
      }
    } else if (action === 'ASSIGN') {
      if (meta.canAssign) {
        setSimulatedLogs(prev => [
          { 
            id: idStr, 
            time: timeString, 
            type: 'success', 
            text: `[ACCESS GRANTED] ${currentUser.name} (${currentUser.role}) authorized and assigned Eng. Nimani to active metrology commission ticket.` 
          },
          ...prev
        ]);
      } else {
        setSimulatedLogs(prev => [
          { 
            id: idStr, 
            time: timeString, 
            type: 'danger', 
            text: `[ACCESS DENIED] ${currentUser.name} (${currentUser.role}) attempted to dispatch personnel. Assignment authority is restricted to [Workshop Manager].` 
          },
          ...prev
        ]);
      }
    } else if (action === 'APPROVE') {
      if (meta.canApprove) {
        setSimulatedLogs(prev => [
          { 
            id: idStr, 
            time: timeString, 
            type: 'success', 
            text: `[ACCESS GRANTED] ${currentUser.name} (${currentUser.role}) certified calibration budgets & NPS evaluation thresholds.` 
          },
          ...prev
        ]);
      } else {
        setSimulatedLogs(prev => [
          { 
            id: idStr, 
            time: timeString, 
            type: 'danger', 
            text: `[ACCESS DENIED] ${currentUser.name} (${currentUser.role}) unauthorized budget clearance. Approval restricted directly to [Workshop Manager].` 
          },
          ...prev
        ]);
      }
    } else if (action === 'CLOSE') {
      if (meta.canClose) {
        setSimulatedLogs(prev => [
          { 
            id: idStr, 
            time: timeString, 
            type: 'success', 
            text: `[ACCESS GRANTED] ${currentUser.name} (${currentUser.role}) updated client digital warranty card start dates and closed ticket successfully.` 
          },
          ...prev
        ]);
      } else {
        setSimulatedLogs(prev => [
          { 
            id: idStr, 
            time: timeString, 
            type: 'danger', 
            text: `[ACCESS DENIED] ${currentUser.name} (${currentUser.role}) failed to update warranty registry. Lifecycle termination requires [Documentation Officer] or [Workshop Manager].` 
          },
          ...prev
        ]);
      }
    }
  };

  const getRoleSQLSchema = () => {
    return `-- ====================================================================
-- AVON ServicePro: ISO-9001 Compliant Supabase Role Tables & Claims Model
-- Clean PostgreSQL Setup for AVON PHARMO CHEM (PVT) LTD SERVICE CENTRE
-- ====================================================================

-- 1. Create Custom Roles ENUM representing all 16 requested positions
CREATE TYPE public.staff_role AS ENUM (
  'Workshop Manager',
  'Documentation Officer',
  'Senior Biomedical Engineer',
  'Biomedical Engineer',
  'Junior Biomedical Engineer',
  'Senior Service Engineer',
  'Service Engineer',
  'Junior Service Engineer',
  'Senior Workshop Engineer',
  'Workshop Engineer',
  'Junior Workshop Engineer',
  'Calibration Engineer',
  'Technician',
  'Trainee Technician',
  'Trainee Engineer',
  'Intern Technician'
);

-- 2. Create Staff Engineering Tag / Classification Groupings
CREATE TYPE public.engineering_tag AS ENUM (
  'Area Engineer',
  'Workshop Engineer',
  'Calibration Engineer',
  'Administrative'
);

-- 3. Define Roles & Permissions Lookup Matrix Table
CREATE TABLE public.role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_name public.staff_role NOT NULL,
  can_create_jobs BOOLEAN DEFAULT false NOT NULL,
  can_assign_jobs BOOLEAN DEFAULT false NOT NULL,
  can_approve_jobs BOOLEAN DEFAULT false NOT NULL,
  can_close_jobs BOOLEAN DEFAULT false NOT NULL,
  can_execute_checklists BOOLEAN DEFAULT false NOT NULL,
  can_certify_metrology BOOLEAN DEFAULT false NOT NULL,
  restricted_dashboard_name TEXT NOT NULL,
  tag_group public.engineering_tag NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

-- Index lookup speeds
CREATE UNIQUE INDEX idx_role_permissions_role ON public.role_permissions(role_name);

-- 4. Create profiles table integrated with auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  fullname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role public.staff_role NOT NULL DEFAULT 'Biomedical Engineer',
  is_active BOOLEAN DEFAULT true NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

-- 5. Seed standard lookup mapping for the 16 exact roles
INSERT INTO public.role_permissions 
(role_name, can_create_jobs, can_assign_jobs, can_approve_jobs, can_close_jobs, can_execute_checklists, can_certify_metrology, restricted_dashboard_name, tag_group) VALUES
('Workshop Manager', true, true, true, true, true, true, 'Workshop Administration Control', 'Area Engineer'),
('Documentation Officer', true, false, false, true, false, false, 'Compliance & Asset Register Platform', 'Administrative'),
('Senior Biomedical Engineer', false, false, false, false, true, true, 'Area Assignment Workbench', 'Area Engineer'),
('Biomedical Engineer', false, false, false, false, true, false, 'Area Assignment Workbench', 'Area Engineer'),
('Junior Biomedical Engineer', false, false, false, false, true, false, 'Junior Support Workbench', 'Area Engineer'),
('Senior Service Engineer', false, false, false, false, true, true, 'Area Assignment Workbench', 'Area Engineer'),
('Service Engineer', false, false, false, false, true, false, 'Area Assignment Workbench', 'Area Engineer'),
('Junior Service Engineer', false, false, false, false, true, false, 'Junior Support Workbench', 'Area Engineer'),
('Senior Workshop Engineer', false, false, false, false, true, true, 'Workshop Bench Workbench', 'Workshop Engineer'),
('Workshop Engineer', false, false, false, false, true, false, 'Workshop Bench Workbench', 'Workshop Engineer'),
('Junior Workshop Engineer', false, false, false, false, true, false, 'Junior Support Workbench', 'Workshop Engineer'),
('Calibration Engineer', false, false, false, false, true, true, 'Calibration Metrology Workbench', 'Calibration Engineer'),
('Technician', false, false, false, false, true, false, 'Workshop Bench Workbench', 'Workshop Engineer'),
('Trainee Technician', false, false, false, false, true, false, 'Supervised Learning Workbench', 'Workshop Engineer'),
('Trainee Engineer', false, false, false, false, true, false, 'Supervised Learning Workbench', 'Calibration Engineer'),
('Intern Technician', false, false, false, false, true, false, 'Supervised Learning Workbench', 'Workshop Engineer');
`;
  };

  const getRLSSchema = () => {
    return `-- ====================================================================
-- ROW LEVEL SECURITY (RLS) FOR AVON SERVICEPRO
-- Enforces ISO-9001 compliance, SLA protection, and strict job assignment privacy
-- ====================================================================

-- Enable RLS on profiles, jobs, and installations
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- 1. Profiles policy (Viewable by all staff, writable only by owner)
CREATE POLICY "Public profiles are viewable by all authenticated staff"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to update own contact profile information"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 2. Service Tickets (Jobs) security structure
-- Requirement: Managers create/assign, Officers create/close, Engineers execute
ALTER TABLE public.service_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated staff can view service tickets"
ON public.service_tickets FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Management can insert new service tickets"
ON public.service_tickets FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.role_permissions rp ON p.role = rp.role_name
    WHERE p.id = auth.uid() 
    AND (rp.can_create_jobs = true OR p.role = 'Workshop Manager')
  )
);

CREATE POLICY "Only Workshop Managers can dispatch engineers"
ON public.service_tickets FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Workshop Manager'
  )
)
WITH CHECK (true);

CREATE POLICY "Assigned Engineers can update checklist metrics inside their dispatched work"
ON public.service_tickets FOR UPDATE
TO authenticated
USING (assigned_engineer_id = auth.uid() OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'Workshop Manager'))
WITH CHECK (true);

-- 3. Installations RLS structure
CREATE POLICY "Only Documentation Officers & Managers can activate and initialize installations"
ON public.installations FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('Documentation Officer', 'Workshop Manager')
  )
);

CREATE POLICY "Assigned technicians can update installation unboxing checklists"
ON public.installations FOR UPDATE
TO authenticated
USING (
  assigned_staff_id = auth.uid() 
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Workshop Manager', 'Documentation Officer'))
);
`;
  };

  const handleCopySQL = (type: 'sql' | 'rls') => {
    const textToCopy = type === 'sql' ? getRoleSQLSchema() : getRLSSchema();
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          if (type === 'sql') {
            setCopiedSQL(true);
            setTimeout(() => setCopiedSQL(false), 2500);
          } else {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2500);
          }
        })
        .catch(() => {
          alert("SQL Snapped! Copy the raw lines from the code panel.");
        });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title block detailing company audit specs */}
      <div className="bg-[#002B55] text-white p-5 rounded-xl border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-[#00AEEF] p-3 rounded-lg shadow-inner">
              <LockKeyhole className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-sm font-black text-[#00AEEF] uppercase font-mono tracking-widest leading-none">Identity & Access</h1>
                <span className="bg-blue-950 font-mono text-[9px] font-bold text-white px-2 py-0.5 rounded border border-blue-800">ISO-9001 COMPLIANT</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight font-sans mt-1">AVON ServicePro Security Matrix</h2>
              <p className="text-xs text-blue-200 mt-1 font-sans">
                Corporate security control console for **AVON PHARMO CHEM (PVT) LTD SERVICE CENTRE** 16 specialized roles.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-blue-300 font-mono tracking-wider block">CURRENT SYSTEM ORG</span>
            <span className="text-xs font-black text-white block mt-0.5 uppercase">Colombo Central Service HQ</span>
          </div>
        </div>
      </div>

      {/* Main Switcher Matrix Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-150 pb-1">
        <button
          onClick={() => setActiveTab('nextjs')}
          className={`px-4 py-2 text-xs font-bold font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'nextjs' 
              ? 'border-[#0054A6] text-[#0054A6]' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" /> Next.js 15 & Supabase Auth Hub
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 text-xs font-bold font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'matrix' 
              ? 'border-[#0054A6] text-[#0054A6]' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          <Users className="w-4 h-4" /> Role Permission Matrix
        </button>
        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`px-4 py-2 text-xs font-bold font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'lifecycle' 
              ? 'border-[#0054A6] text-[#0054A6]' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Job Lifecycle Rules
        </button>
        <button
          onClick={() => setActiveTab('dashboards')}
          className={`px-4 py-2 text-xs font-bold font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'dashboards' 
              ? 'border-[#0054A6] text-[#0054A6]' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          <Eye className="w-4 h-4" /> Dashboard Clearances
        </button>
        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-4 py-2 text-xs font-bold font-sans flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'supabase' 
              ? 'border-[#0054A6] text-[#0054A6]' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          <Database className="w-4 h-4" /> Supabase SQL / RLS
        </button>
      </div>

      {/* Tab Content 1: Permission Matrix */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* List of 16 roles with engineering tags */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-gray-150 shadow-xs p-4 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase font-mono tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
              <Tag className="w-4 h-4 text-gray-400" /> Operational Rosters
            </h3>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {AVAILABLE_ROLES.map(role => {
                const meta = getRoleMetaData(role);
                const isSelected = selectedRoleForDetail === role;
                const activeLabel = currentUser.role === role;

                let tagBg = 'bg-blue-50 text-blue-700';
                if (meta.tag === 'Workshop Engineer') tagBg = 'bg-amber-50 text-amber-700';
                if (meta.tag === 'Calibration Engineer') tagBg = 'bg-indigo-50 text-indigo-700';
                if (meta.tag === 'Administrative') tagBg = 'bg-purple-50 text-purple-700';

                return (
                  <div
                    key={role}
                    onClick={() => setSelectedRoleForDetail(role)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-blue-50/50 border-[#0054A6] ring-1 ring-blue-100' 
                        : 'border-gray-100 hover:bg-gray-50/70'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-xs font-extrabold text-slate-800 leading-snug">{role}</span>
                      {activeLabel && (
                        <span className="text-[8px] bg-emerald-500 text-white font-black font-mono px-1.5 py-0.5 rounded leading-none">ON DESK</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${tagBg}`}>
                        {meta.tag}
                      </span>
                      <span className="text-[10px] text-gray-400 font-sans">• {meta.tier}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matrix detailed drilldown view */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Detailed view of selected role */}
            <div className="bg-gradient-to-r from-slate-550/10 to-[#0054A6]/5 border border-[#0054A6]/10 p-5 rounded-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-mono tracking-widest uppercase text-[#0054A6] font-black">EXPERT LICENSE MAPPING</span>
                  <h3 className="text-base font-black text-slate-900 mt-1">{selectedRoleForDetail}</h3>
                  <p className="text-xs text-slate-650 font-sans leading-relaxed mt-1.5">
                    {getRoleMetaData(selectedRoleForDetail).desc}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-mono block">CLEARANCE TIER</span>
                  <span className="p-1 px-2.5 bg-slate-100 border border-slate-200 text-gray-700 text-xs font-black block mt-1.5 rounded uppercase">
                    {getRoleMetaData(selectedRoleForDetail).tier}
                  </span>
                </div>
              </div>

              {/* Functional permissions list */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-200/50">
                <div className="p-2.5 bg-white border rounded-lg text-left">
                  <span className="text-[9px] text-gray-400 font-mono block">1. CREATE JOBS</span>
                  <span className={`text-[11px] font-bold block mt-1 ${getRoleMetaData(selectedRoleForDetail).canCreate ? 'text-emerald-605' : 'text-rose-500'}`}>
                    {getRoleMetaData(selectedRoleForDetail).canCreate ? '✓ Yes, Authorized' : '✕ No, Denied'}
                  </span>
                </div>
                <div className="p-2.5 bg-white border rounded-lg text-left">
                  <span className="text-[9px] text-gray-400 font-mono block">2. DISPATCH CREW</span>
                  <span className={`text-[11px] font-bold block mt-1 ${getRoleMetaData(selectedRoleForDetail).canAssign ? 'text-emerald-605' : 'text-rose-500'}`}>
                    {getRoleMetaData(selectedRoleForDetail).canAssign ? '✓ Yes, Authorized' : '✕ No, Denied'}
                  </span>
                </div>
                <div className="p-2.5 bg-white border rounded-lg text-left">
                  <span className="text-[9px] text-gray-400 font-mono block">3. BUDGET REVIEWS</span>
                  <span className={`text-[11px] font-bold block mt-1 ${getRoleMetaData(selectedRoleForDetail).canApprove ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {getRoleMetaData(selectedRoleForDetail).canApprove ? '✓ Yes, Authorized' : '✕ No, Denied'}
                  </span>
                </div>
                <div className="p-2.5 bg-white border rounded-lg text-left">
                  <span className="text-[9px] text-gray-400 font-mono block">4. WARRANTY CLOSURE</span>
                  <span className={`text-[11px] font-bold block mt-1 ${getRoleMetaData(selectedRoleForDetail).canClose ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {getRoleMetaData(selectedRoleForDetail).canClose ? '✓ Yes, Authorized' : '✕ No, Denied'}
                  </span>
                </div>
              </div>
            </div>

            {/* Matrix Dense Grid Chart */}
            <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
              <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                <h4 className="text-xs font-extrabold font-mono text-gray-550 uppercase">Complete Role-to-Action Permission Mapping</h4>
                <span className="text-[10px] text-slate-400 font-mono">16 Positions x 6 Modules</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 font-mono text-[9px] text-gray-500 border-b">
                    <tr>
                      <th className="p-3">AVON Roles</th>
                      <th className="p-2.5 text-center font-bold">Create Jobs</th>
                      <th className="p-2.5 text-center font-bold">Assign Staff</th>
                      <th className="p-2.5 text-center font-bold">Complete Checklist</th>
                      <th className="p-2.5 text-center font-bold">Approve Finance</th>
                      <th className="p-2.5 text-center font-bold">Close Jobs</th>
                      <th className="p-2.5 text-center font-bold">Certify Metrology</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {AVAILABLE_ROLES.map(role => {
                      const meta = getRoleMetaData(role);
                      return (
                        <tr key={role} className={`hover:bg-slate-50/50 ${selectedRoleForDetail === role ? 'bg-blue-50/15' : ''}`}>
                          <td className="p-2.5">
                            <span className="font-extrabold text-slate-800 block text-left leading-tight">{role}</span>
                            <span className="text-[9px] text-gray-400 font-sans block mt-0.5">{meta.tag}</span>
                          </td>
                          <td className="p-2.5 text-center">
                            {mapsPrivilege(role, 'CREATE') ? (
                              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-sm font-mono text-[10px] font-bold">CREATOR</span>
                            ) : (
                              <X className="w-3.5 h-3.5 mx-auto text-gray-300" />
                            )}
                          </td>
                          <td className="p-2.5 text-center">
                            {mapsPrivilege(role, 'ASSIGN') ? (
                              <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-sm font-mono text-[10px] font-bold">MANAGER</span>
                            ) : (
                              <X className="w-3.5 h-3.5 mx-auto text-gray-300" />
                            )}
                          </td>
                          <td className="p-2.5 text-center">
                            {mapsPrivilege(role, 'EXECUTE') ? (
                              <Check className="w-4 h-4 mx-auto text-emerald-500 stroke-[3]" />
                            ) : (
                              <X className="w-3.5 h-3.5 mx-auto text-gray-300" />
                            )}
                          </td>
                          <td className="p-2.5 text-center">
                            {mapsPrivilege(role, 'APPROVE') ? (
                              <span className="bg-[#EAF5FC] text-blue-700 px-1.5 py-0.5 rounded-sm font-mono text-[10px] font-bold">APPROVER</span>
                            ) : (
                              <X className="w-3.5 h-3.5 mx-auto text-gray-300" />
                            )}
                          </td>
                          <td className="p-2.5 text-center">
                            {mapsPrivilege(role, 'CLOSE') ? (
                              <span className="bg-[#EAF3EC] text-emerald-850 px-1.5 py-0.5 rounded-sm font-mono text-[10px] font-bold">TERMINAL</span>
                            ) : (
                              <X className="w-3.5 h-3.5 mx-auto text-gray-300" />
                            )}
                          </td>
                          <td className="p-2.5 text-center">
                            {mapsPrivilege(role, 'METROLOGY') ? (
                              <Check className="w-4 h-4 mx-auto text-[#0054A6] stroke-[3]" />
                            ) : (
                              <X className="w-3.5 h-3.5 mx-auto text-gray-300" />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab Content 2: Job Lifecycle Control & Interactive Tester */}
      {activeTab === 'lifecycle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Informative definitions for the 4 stages */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="bg-white rounded-xl border border-gray-150 p-5 space-y-4 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Bookmark className="w-4.5 h-4.5 text-[#0054A6]" /> AVON Service Ticket Lifecycle Boundaries
              </h3>

              <div className="space-y-4 divide-y divide-gray-100">
                <div className="flex gap-3 text-left pt-2 pb-1.5">
                  <div className="w-7 h-7 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center font-bold font-mono text-xs shrink-0 mt-0.5">1</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-850">JOB CREATION</h4>
                    <p className="text-[11px] text-gray-500 mt-1 font-sans">
                      Always initiated strictly by **Documentation Officer** or **Workshop Manager** based on customer incoming service calls or unboxed device shipments.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 text-left pt-3.5 pb-1.5">
                  <div className="w-7 h-7 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center font-bold font-mono text-xs shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-850">STAFF DISPATCH & ASSIGNMENT</h4>
                    <p className="text-[11px] text-gray-500 mt-1 font-sans">
                      Strictly restricted to **Workshop Managers** acting as Area Engineers. Personnel are assigned based on tags (**Area Engineer**, **Workshop Engineer**, **Calibration Engineer**) to align technical competency levels.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 text-left pt-3.5 pb-1.5">
                  <div className="w-7 h-7 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center font-bold font-mono text-xs shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-850">TECHNICAL SIGN-OFF & APPROVAL</h4>
                    <p className="text-[11px] text-gray-500 mt-1 font-sans">
                      Undergone by **Biomedical / Service Engineers** filling full commission checklists. Cost overrides and regulatory parameters must be audited and approved by the **Workshop Manager**.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 text-left pt-3.5 pt-2">
                  <div className="w-7 h-7 bg-emerald-50 text-emerald-750 rounded-full flex items-center justify-center font-bold font-mono text-xs shrink-0 mt-0.5">4</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-850">WARRANTY ACTIVATION & CLOSURE</h4>
                    <p className="text-[11px] text-gray-500 mt-1 font-sans">
                      Final closure is managed by the **Documentation Officer** who keys the active dates into the paperless registry, releasing the client warranty card.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Persona Quick Desktop Shift Swapper */}
            <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold font-mono text-[#00AEEF] uppercase tracking-widest flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#00AEEF]" /> Swift Desk Swapper Console
              </h3>
              <p className="text-[11px] text-slate-350 font-sans mt-1">
                Select from standard AVON employee credentials to verify actual system access behaviors:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {preConfiguredStaff.map(u => {
                  const isActive = currentUser.role === u.role;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        onRoleChange(u.role);
                        currentUser.id = u.id;
                        currentUser.name = u.name;
                        currentUser.email = u.email;
                        currentUser.department = u.department || 'Service Area';
                        currentUser.avatar = u.avatar;
                        
                        // Log login action
                        const timeString = new Date().toLocaleTimeString();
                        setSimulatedLogs(prev => [
                          { 
                            id: String(prev.length + 1), 
                            time: timeString, 
                            type: 'info', 
                            text: `[SESSION LOG] ${u.name} checked in on desk as '${u.role}' [TAG: ${getRoleMetaData(u.role).tag}]` 
                          },
                          ...prev
                        ]);
                      }}
                      className={`text-left p-2.5 rounded-lg border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-[#0077C8] border-[#00AEEF] text-white font-bold' 
                          : 'bg-black/15 border-slate-800 text-slate-300 hover:bg-black/30'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        isActive ? 'bg-white text-[#0054A6]' : 'bg-slate-700 text-slate-200'
                      }`}>
                        {u.avatar}
                      </span>
                      <div className="truncate">
                        <div className="font-extrabold truncate text-[11px]">{u.name}</div>
                        <div className="text-[9px] opacity-80 leading-none">{u.role}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Tester Interactive Panel */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            
            <div className="bg-white rounded-xl border border-gray-150 p-5 space-y-4 shadow-xs flex-1">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 pb-2 border-b">
                <ShieldAlert className="w-4.5 h-4.5 text-[#0054A6]" /> Simulated Operational Execution
              </h3>
              
              <div className="p-3 bg-[#F2F7FC]/80 text-gray-700 text-xs rounded-lg border border-blue-50 text-left space-y-2">
                <span className="text-[9px] font-mono text-[#0054A6] uppercase font-bold tracking-widest block">SESSION STATE:</span>
                <div className="flex justify-between items-center bg-white p-2 rounded border">
                  <div>
                    <span className="font-extrabold text-slate-850 block">{currentUser.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{currentUser.role}</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border">
                    {getRoleMetaData(currentUser.role).tag.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Simulation Operation Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => triggerSimulatedAction('CREATE')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 active:bg-blue-50 hover:border-slate-300 border rounded-lg text-left transition-all cursor-pointer space-y-1.5"
                >
                  <span className="bg-blue-100 text-blue-700 font-extrabold text-[9px] px-2 py-0.5 rounded leading-none uppercase">STAGE 1</span>
                  <span className="font-bold text-xs text-slate-850 block">Create Job</span>
                  <p className="text-[9px] text-gray-400 font-sans leading-none">Initialize pending service cards</p>
                </button>

                <button
                  onClick={() => triggerSimulatedAction('ASSIGN')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 active:bg-blue-50 hover:border-slate-300 border rounded-lg text-left transition-all cursor-pointer space-y-1.5"
                >
                  <span className="bg-amber-100 text-amber-700 font-extrabold text-[9px] px-2 py-0.5 rounded leading-none uppercase">STAGE 2</span>
                  <span className="font-bold text-xs text-slate-850 block">Dispatch Crew</span>
                  <p className="text-[9px] text-gray-400 font-sans leading-none">Allocate technician and due date</p>
                </button>

                <button
                  onClick={() => triggerSimulatedAction('APPROVE')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 active:bg-blue-50 hover:border-slate-300 border rounded-lg text-left transition-all cursor-pointer space-y-1.5"
                >
                  <span className="bg-indigo-100 text-indigo-700 font-extrabold text-[9px] px-2 py-0.5 rounded leading-none uppercase">STAGE 3</span>
                  <span className="font-bold text-xs text-slate-850 block">Approve Costs</span>
                  <p className="text-[9px] text-gray-400 font-sans leading-none">Approve budgets & checklist items</p>
                </button>

                <button
                  onClick={() => triggerSimulatedAction('CLOSE')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 active:bg-blue-50 hover:border-slate-300 border rounded-lg text-left transition-all cursor-pointer space-y-1.5"
                >
                  <span className="bg-emerald-100 text-emerald-700 font-extrabold text-[9px] px-2 py-0.5 rounded leading-none uppercase">STAGE 4</span>
                  <span className="font-bold text-xs text-slate-850 block">Close Warranty</span>
                  <p className="text-[9px] text-gray-400 font-sans leading-none">Register digital warranty start/expiry</p>
                </button>
              </div>
            </div>

            {/* Realtime Action Logs Panel */}
            <div className="bg-[#111622] rounded-xl border border-slate-800 p-4 h-[240px] flex flex-col justify-between">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-800 shrink-0">
                <span className="flex items-center gap-1.5 text-xs text-[#00AEEF] font-mono">
                  <Terminal className="w-4 h-4" /> Live Operational RBAC Logs
                </span>
                <span className="text-[9px] text-emerald-400 font-mono uppercase bg-emerald-900/30 px-1.5 py-0.5 rounded border border-emerald-500 animate-pulse">
                  SYSTEM READY
                </span>
              </div>

              <div id="simulated-rbac-logs" className="flex-1 overflow-y-auto space-y-2 mt-3 font-mono text-[10.5px] text-gray-300 scrollbar-thin max-h-[140px]">
                {simulatedLogs.map(log => {
                  let badgeColor = 'text-[#00AEEF]';
                  if (log.type === 'success') badgeColor = 'text-emerald-400';
                  if (log.type === 'danger') badgeColor = 'text-rose-400 font-extrabold';
                  return (
                    <div key={log.id} className="text-left leading-relaxed">
                      <span className="text-gray-550 mr-1.5 select-none text-[9.5px]">{log.time}</span>
                      <span className={badgeColor}>{log.text}</span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setSimulatedLogs([
                  { id: String(Date.now()), time: new Date().toLocaleTimeString(), type: 'info', text: 'Clear log request triggered. Access lists refreshed.' }
                ])}
                className="text-[9px] text-slate-400 hover:text-white font-mono mt-2 self-start uppercase underline cursor-pointer"
              >
                Clear Console Logs
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tab Content 3: Dashboard Visibility Clearances */}
      {activeTab === 'dashboards' && (
        <div className="bg-white rounded-xl border border-gray-150 p-5 space-y-6 animate-fadeIn">
          
          <div className="text-left space-y-1">
            <h3 className="text-sm font-extrabold text-[#0054A6]">Role-Tier Dashboard Visibility Index</h3>
            <p className="text-xs text-gray-500 font-sans">
              Depending on technical seniority, different staff are presented with customized work queues, metrics, and administration scopes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Management level dashboard */}
            <div className="p-4 border border-blue-100 bg-[#F2F7FC]/50 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-[#0054A6]">
                <Award className="w-5 h-5" />
                <h4 className="text-xs font-black uppercase tracking-wider">Management Console</h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-650 font-sans list-none pl-0">
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Interactive Calibration SLA compliance ratios.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Complete audit logs & CSAT reports indexes.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Operational revenue metrics, quote editing.</span>
                </li>
              </ul>
              <div className="pt-2">
                <span className="text-[10px] text-blue-500 font-mono tracking-wider uppercase block">VISIBLE TIER:</span>
                <span className="inline-block mt-1 bg-[#0054A6] text-white text-[9px] font-black px-2 py-0.5 rounded">
                  Workshop Manager, Documentation Officer
                </span>
              </div>
            </div>

            {/* 2. Engineering workbench */}
            <div className="p-4 border border-indigo-100 bg-indigo-50/20 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-indigo-700">
                <Wrench className="w-5 h-5" />
                <h4 className="text-xs font-black uppercase tracking-wider">Engineering Workbench</h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-650 font-sans list-none pl-0">
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Personalized dispatch work queues on local tab.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Interactive unboxing & calibration checklists.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Standards registry verify tools (NIST standard references).</span>
                </li>
              </ul>
              <div className="pt-2">
                <span className="text-[10px] text-indigo-500 font-mono tracking-wider uppercase block">VISIBLE TIER:</span>
                <span className="inline-block mt-1 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded leading-none uppercase">
                  Senior, Mid-level Biomedical/Service/Calibration Engineers
                </span>
              </div>
            </div>

            {/* 3. Assistance list view */}
            <div className="p-4 border border-amber-100 bg-amber-50/15 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-700">
                <Users className="w-5 h-5" />
                <h4 className="text-xs font-black uppercase tracking-wider">Junior & Assistance Board</h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-650 font-sans list-none pl-0">
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Supervised checklist checkoff triggers.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Service logs draft tools (requires Manager closeout).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Workshop catalog lookup, part request receipts.</span>
                </li>
              </ul>
              <div className="pt-2">
                <span className="text-[10px] text-amber-500 font-mono tracking-wider uppercase block">VISIBLE TIER:</span>
                <span className="inline-block mt-1 bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded leading-none uppercase">
                  Junior Engineers, Technicians, Trainees & Interns
                </span>
              </div>
            </div>

          </div>

          {/* Prompt regarding role context demo limits */}
          <div className="p-3 bg-slate-50 border border-gray-100 rounded-lg flex items-center gap-3 text-left">
            <HelpCircle className="w-5 h-5 text-gray-450 shrink-0" />
            <span className="text-xs text-gray-500 font-sans">
              Tip: Swap your current corporate role at the top of the **SLA Phase Tracker** panel inside the **Installation Management** module or on the Swapper card on Tab 2 to preview how other areas dynamically respond to permissions.
            </span>
          </div>

        </div>
      )}

      {/* Tab Content 4: Supabase Tables and RLS Generation */}
      {activeTab === 'supabase' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn text-left">
          
          {/* SQL tables creation script */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-mono font-bold text-gray-400 block tracking-widest leading-none uppercase">SUPABASE SCHEMAS</h4>
                <h3 className="text-sm font-extrabold text-slate-800 mt-1">1. PostgreSQL Roles Lookup Tables</h3>
              </div>
              <button 
                id="btn-copy-tables-sql"
                onClick={() => handleCopySQL('sql')}
                className="bg-[#0054A6] hover:bg-blue-800 text-white text-[10px] font-mono font-bold px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-all"
              >
                {copiedSQL ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy SQL
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#121824] rounded-xl border border-slate-800 p-4 shadow-inner relative">
              <pre className="text-[10.5px] font-mono text-[#D1D5DB] overflow-x-auto leading-relaxed max-h-[380px] scrollbar-thin">
                <code>{getRoleSQLSchema()}</code>
              </pre>
            </div>
          </div>

          {/* Row Level Security constraints */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-mono font-bold text-gray-400 block tracking-widest leading-none uppercase">ROW LEVEL SECURITY</h4>
                <h3 className="text-sm font-extrabold text-slate-800 mt-1">2. ISO Compliant Data Protection</h3>
              </div>
              <button 
                id="btn-copy-rls-sql"
                onClick={() => handleCopySQL('rls')}
                className="bg-[#0054A6] hover:bg-blue-800 text-white text-[10px] font-mono font-bold px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-all"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy SQL
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#121824] rounded-xl border border-slate-800 p-4 shadow-inner relative">
              <pre className="text-[10.5px] font-mono text-[#D1D5DB] overflow-x-auto leading-relaxed max-h-[380px] scrollbar-thin">
                <code>{getRLSSchema()}</code>
              </pre>
            </div>
          </div>

        </div>
      )}

      {/* Tab Content 5: Next.js 15 App Router & Supabase Auth Hub */}
      {activeTab === 'nextjs' && (
        <div className="space-y-6 animate-fadeIn text-left">
          
          {/* Top Banner Alert / Toast */}
          {authBannerMsg && (
            <div className="bg-[#003B75] text-white p-3.5 rounded-xl shadow-lg flex items-center justify-between border border-blue-400/30 animate-slideDown">
              <div className="flex items-center gap-2.5 text-xs font-bold font-sans">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                <span>{authBannerMsg}</span>
              </div>
              <button onClick={() => setAuthBannerMsg(null)} className="text-blue-200 hover:text-white font-bold text-xs p-1">✕</button>
            </div>
          )}

          {/* Feature Showcase Header Bar */}
          <div className="bg-gradient-to-r from-[#003B75] via-[#0054A6] to-[#0077C8] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wider uppercase">Next.js 15 App Router</span>
                  <span className="bg-emerald-500/30 border border-emerald-400/40 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">Supabase Auth SSR</span>
                  <span className="bg-amber-400/30 border border-amber-300/40 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-amber-200">Shadcn UI</span>
                </div>
                <h2 className="text-2xl font-black font-sans tracking-tight">Authentication & User Management Engine</h2>
                <p className="text-blue-100 text-xs mt-1 max-w-2xl">
                  Production-ready architecture fulfilling all 16 AVON operational roles and engineer tags (Area, Workshop, Calibration) with Supabase Row Level Security.
                </p>
              </div>

              {/* Simulation Auth Actions */}
              <div className="flex flex-wrap gap-2 shrink-0">
                <button 
                  onClick={() => showAuthToast("🔐 Simulated Supabase signInWithPassword() - Cookie session established & revalidatePath layout triggered.")}
                  className="bg-white text-[#003B75] hover:bg-blue-50 px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#0054A6]" /> Simulate Login
                </button>
                <button 
                  onClick={() => showAuthToast("🚪 Simulated Supabase signOut() - Server Action executed, auth cookies cleared & redirect('/login').")}
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
                <button 
                  onClick={() => showAuthToast("📩 Simulated resetPasswordForEmail() - Magic reset link dispatched via Supabase SMTP.")}
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-amber-300" /> Forgot Pwd
                </button>
              </div>
            </div>
          </div>

          {/* Sub Navigation Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-xs">
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setNextjsSubTab('crud')}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  nextjsSubTab === 'crud' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Live User Directory CRUD ({employeesState.length})
              </button>
              <button
                onClick={() => setNextjsSubTab('actions')}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  nextjsSubTab === 'actions' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-amber-400" /> Server Actions (`auth.ts`)
              </button>
              <button
                onClick={() => setNextjsSubTab('components')}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  nextjsSubTab === 'components' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400" /> Shadcn UI Components
              </button>
              <button
                onClick={() => setNextjsSubTab('sql')}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  nextjsSubTab === 'sql' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" /> Supabase SQL & RLS
              </button>
            </div>

            {nextjsSubTab === 'crud' && (
              <button
                onClick={() => setIsNewEmployeeModalOpen(true)}
                className="bg-[#0054A6] hover:bg-[#003B75] text-white px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" /> + Add New Employee
              </button>
            )}
          </div>

          {/* Sub-Tab 1: Interactive Employee CRUD Directory */}
          {nextjsSubTab === 'crud' && (
            <div className="space-y-4">
              
              {/* Search & Filter Controls */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search name, email, or department..."
                    value={userSearchQuery}
                    onChange={e => setUserSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 pl-9 pr-3 py-1.5 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#0054A6] focus:bg-white"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <span className="text-xs text-gray-500 font-medium">Role:</span>
                  <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="bg-gray-50 text-gray-700 border border-gray-200 p-1 px-2.5 rounded-lg text-xs font-semibold cursor-pointer max-w-[180px] truncate"
                  >
                    <option value="All">All 16 Roles</option>
                    {AVON_ROLES_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>

                  <span className="text-xs text-gray-500 font-medium ml-2">Tag:</span>
                  <select
                    value={tagFilter}
                    onChange={e => setTagFilter(e.target.value)}
                    className="bg-gray-50 text-gray-700 border border-gray-200 p-1 px-2.5 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="All">All Tags</option>
                    {AVON_TAGS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Employee Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-gray-200 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        <th className="py-3 px-4">Employee</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Assigned Role (16 AVON Tiers)</th>
                        <th className="py-3 px-4">Engineer Tags (Area, Wshop, Cal)</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-xs">
                      {filteredEmployees.map(emp => (
                        <tr key={emp.id} className={`hover:bg-slate-50/80 transition-colors ${!emp.is_active ? 'bg-gray-50/60 opacity-75' : ''}`}>
                          
                          {/* Employee Identity */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {emp.avatar_url ? (
                                <img src={emp.avatar_url} alt={emp.full_name} className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-[#003B75] text-white flex items-center justify-center font-black text-xs shrink-0">
                                  {emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                              )}
                              <div>
                                <div className="font-extrabold text-slate-900">{emp.full_name}</div>
                                <div className="text-[11px] text-gray-500 font-mono">{emp.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Department */}
                          <td className="py-3 px-4 text-gray-600 font-medium">
                            {emp.department}
                          </td>

                          {/* Role Dropdown Assignment */}
                          <td className="py-3 px-4">
                            <select
                              value={emp.role}
                              onChange={e => handleAssignRole(emp.id, e.target.value as AVONRoleV4)}
                              className="bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-[11px] py-1 px-2 rounded-lg border border-slate-250 focus:outline-none focus:ring-1 focus:ring-[#0054A6] cursor-pointer max-w-[210px] truncate"
                            >
                              {AVON_ROLES_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </td>

                          {/* Engineer Tag Toggle Pills */}
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {AVON_TAGS_LIST.map(tag => {
                                const hasTag = emp.engineer_tags.includes(tag);
                                return (
                                  <button
                                    key={tag}
                                    onClick={() => handleToggleTag(emp.id, tag)}
                                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                                      hasTag 
                                        ? tag === 'Area Engineer' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                          tag === 'Workshop Engineer' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                          'bg-purple-100 text-purple-800 border-purple-300'
                                        : 'bg-gray-100 text-gray-400 border-gray-200 hover:text-gray-600'
                                    }`}
                                  >
                                    {hasTag ? '✓ ' : '+ '}{tag}
                                  </button>
                                );
                              })}
                            </div>
                          </td>

                          {/* Active Status Switch */}
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleActiveStatus(emp.id, emp.full_name, emp.is_active)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                                emp.is_active ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {emp.is_active ? '● ACTIVE' : '○ INACTIVE'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteEmployee(emp.id, emp.full_name)}
                              className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete user profile"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>

                        </tr>
                      ))}
                      {filteredEmployees.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-gray-400">
                            No employees match the search filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Sub-Tab 2: Server Actions Code */}
          {nextjsSubTab === 'actions' && (
            <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-amber-400" /> Next.js 15 Server Actions (`'use server'`)
                  </h3>
                  <p className="text-[11px] text-slate-400">Contains `loginAction`, `logoutAction`, `forgotPasswordAction`, and `createUserAction` with `@supabase/ssr`.</p>
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(NEXTJS_SERVER_ACTIONS_CODE); showAuthToast("📋 Copied Next.js 15 Server Actions code!"); }}
                  className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[500px] scrollbar-thin p-2">
                <code>{NEXTJS_SERVER_ACTIONS_CODE}</code>
              </pre>
            </div>
          )}

          {/* Sub-Tab 3: React Components */}
          {nextjsSubTab === 'components' && (
            <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" /> Dashboard Layout & Shadcn UI Components
                  </h3>
                  <p className="text-[11px] text-slate-400">Server Component layout with session validation and client-side table rendering.</p>
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(NEXTJS_REACT_COMPONENTS_CODE); showAuthToast("📋 Copied Shadcn UI React Components code!"); }}
                  className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[500px] scrollbar-thin p-2">
                <code>{NEXTJS_REACT_COMPONENTS_CODE}</code>
              </pre>
            </div>
          )}

          {/* Sub-Tab 4: Supabase SQL & RLS */}
          {nextjsSubTab === 'sql' && (
            <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" /> Supabase PostgreSQL DDL & RLS Security Rules
                  </h3>
                  <p className="text-[11px] text-slate-400">Enums for all 16 AVON roles, `user_profiles` schema, auth register trigger, and policies.</p>
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(SUPABASE_SQL_DDL_CODE); showAuthToast("📋 Copied Supabase SQL & RLS DDL code!"); }}
                  className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[500px] scrollbar-thin p-2">
                <code>{SUPABASE_SQL_DDL_CODE}</code>
              </pre>
            </div>
          )}

          {/* Create Employee Modal */}
          {isNewEmployeeModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-scaleUp">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#0054A6]" /> Provision New Employee
                  </h3>
                  <button onClick={() => setIsNewEmployeeModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                </div>

                <form onSubmit={handleAddNewEmployeeSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                    <input 
                      type="text" required placeholder="e.g. Eng. Chamika Perera"
                      value={newEmpName} onChange={e => setNewEmpName(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-lg font-sans focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Email Address (Supabase Auth Login ID) *</label>
                    <input 
                      type="email" required placeholder="chamika@avonservicepro.com"
                      value={newEmpEmail} onChange={e => setNewEmpEmail(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-lg font-sans focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Department</label>
                      <input 
                        type="text" placeholder="Field Technical Service"
                        value={newEmpDept} onChange={e => setNewEmpDept(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-lg font-sans focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Phone Number</label>
                      <input 
                        type="text" placeholder="+94 77 ..."
                        value={newEmpPhone} onChange={e => setNewEmpPhone(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-lg font-sans focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">AVON Operational Role (16 Tiers) *</label>
                    <select
                      value={newEmpRole} onChange={e => setNewEmpRole(e.target.value as AVONRoleV4)}
                      className="w-full border border-gray-300 p-2 rounded-lg font-bold text-slate-800 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#0054A6]"
                    >
                      {AVON_ROLES_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1.5">Engineer Tags Assignment</label>
                    <div className="flex flex-wrap gap-2">
                      {AVON_TAGS_LIST.map(tag => {
                        const checked = newEmpTags.includes(tag);
                        return (
                          <label key={tag} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-bold transition-all ${checked ? 'bg-blue-50 border-[#0054A6] text-[#0054A6]' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                            <input 
                              type="checkbox" checked={checked}
                              onChange={() => {
                                setNewEmpTags(prev => checked ? prev.filter(t => t !== tag) : [...prev, tag]);
                              }}
                              className="rounded text-[#0054A6] focus:ring-0"
                            />
                            {tag}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800">
                    💡 Supabase Auth will auto-generate a temporary password, insert into `auth.users`, and fire trigger `handle_new_user()` to populate `user_profiles`.
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                    <button type="button" onClick={() => setIsNewEmployeeModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-bold cursor-pointer">Cancel</button>
                    <button type="submit" className="bg-[#0054A6] hover:bg-[#003B75] text-white px-5 py-2 rounded-xl font-extrabold shadow-md cursor-pointer">Create Profile</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
