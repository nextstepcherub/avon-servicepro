import React, { useState, useEffect } from 'react';
import { Customer, UserProfile, UserRole } from '../../types';
import { canRegister, isManager } from '../../utils/authHelpers';
import { safeLocalStorage } from '../../lib/safeStorage';
import { 
  Building2, 
  UserCheck, 
  PhoneCall, 
  Mail, 
  MapPin, 
  CheckCircle, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Map, 
  Filter, 
  Database, 
  Clock, 
  Save, 
  X, 
  User, 
  Users, 
  FileSpreadsheet, 
  ShieldAlert, 
  RefreshCw,
  Copy,
  CheckCircle2,
  SlidersHorizontal,
  Workflow,
  Info,
  ChevronRight,
  BookOpen,
  Zap,
  Code,
  Sparkles,
  Layers,
  Table,
  Activity,
  FileText
} from 'lucide-react';
import CustomerDashboardView from './CustomerDashboardView';
import CustomerProfileView from './CustomerProfileView';
import {
  NEXTJS_CUSTOMER_PAGE_CODE,
  NEXTJS_CUSTOMER_ACTIONS_CODE,
  NEXTJS_CUSTOMER_FORMS_CODE,
  NEXTJS_CUSTOMER_TABLES_CODE,
  SUPABASE_CUSTOMER_SQL_CODE
} from '../../data/nextjsCustomerData';

// Specialized interfaces
interface CustomerDepartment {
  id: string;
  customerId: string;
  name: string; // Department Name
  contactPerson: string; // Contact Person
  contactNumber: string; // Contact Number
}

interface EndUserRecord {
  id: string;
  customerId: string;
  departmentId?: string;
  name: string; // Name
  mobile: string; // Mobile
  location: string; // Location
  remarks: string; // Remarks
  isActive: boolean;
}

interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  actionType: 'CREATE_CUST' | 'UPDATE_CUST' | 'DELETE_CUST' | 'CREATE_DEPT' | 'UPDATE_DEPT' | 'DELETE_DEPT' | 'CREATE_USER' | 'UPDATE_USER' | 'DELETE_USER';
  details: string;
}

interface CustomerManagementProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  currentUser: UserProfile;
}

// Default Sri Lankan administrative values
const LANKA_PROVINCES = [
  'Western Province', 
  'Central Province', 
  'Southern Province', 
  'North Western Province', 
  'Sabaragamuwa Province', 
  'Eastern Province', 
  'Northern Province'
];

const LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 
  'Galle', 'Matara', 'Hambantota', 'Kurunegala', 'Puttalam', 
  'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Moneragala',
  'Ratnapura', 'Kegalle', 'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu',
  'Batticaloa', 'Ampara', 'Trincomalee'
];

const TERRITORY_NODES = [
  'Territory Alpha (Central Hub)',
  'Territory Beta (South Coast)',
  'Territory Gamma (Industrial Zone)',
  'Territory Delta (Highlands)',
  'Territory Epsilon (North & East)'
];

export default function CustomerManagement({ customers, onAddCustomer, currentUser }: CustomerManagementProps) {
  // --- Persistent Local State Initializer ---
  
  // 1. Customers state
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(() => {
    const saved = safeLocalStorage.getItem('avon_local_customers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing saved customers', e);
      }
    }
    // Seed default values filled with proper codes, province, district, territory
    return customers.map((c, idx) => ({
      ...c,
      customerCode: c.customerCode || `CUST-AV-${101 + idx}`,
      province: c.province || 'Western Province',
      district: c.district || (idx === 1 ? 'Kalutara' : idx === 3 ? 'Gampaha' : 'Colombo'),
      territory: c.territory || (idx === 1 ? 'Territory Gamma (Industrial Zone)' : 'Territory Alpha (Central Hub)')
    }));
  });

  // 2. Departments state
  const [departments, setDepartments] = useState<CustomerDepartment[]>(() => {
    const saved = safeLocalStorage.getItem('avon_departments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "dept-1",
        customerId: "cust-1", // Lanka Hospitals
        name: "Pathology Diagnostic Lab",
        contactPerson: "Dr. Rohitha Wijesekera",
        contactNumber: "+94 11 543 1111"
      },
      {
        id: "dept-2",
        customerId: "cust-1",
        name: "Analytical Microbiology Dept",
        contactPerson: "Samantha Fernando",
        contactNumber: "+94 11 543 2222"
      },
      {
        id: "dept-3",
        customerId: "cust-2", // SPMC
        name: "Quality Control chromatography Wing",
        contactPerson: "Mrs. Priyanthi Perera",
        contactNumber: "+94 11 250 8264"
      },
      {
        id: "dept-4",
        customerId: "cust-3", // MRI
        name: "Virology Research wing",
        contactPerson: "Prof. Ananda Gunasekera",
        contactNumber: "+94 11 269 3532"
      }
    ];
  });

  // 3. End Users state
  const [endUsers, setEndUsers] = useState<EndUserRecord[]>(() => {
    const saved = safeLocalStorage.getItem('avon_end_users_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "eu-1",
        customerId: "cust-1",
        departmentId: "dept-1",
        name: "Dr. Keshara Wijewardene",
        mobile: "+94 77 341 9081",
        location: "Level 3, Lanka Hospitals, Colombo 05",
        remarks: "Senior Clinical Biochemist. Primary contact for UV-Vis and HPLC calibration runs.",
        isActive: true
      },
      {
        id: "eu-2",
        customerId: "cust-1",
        departmentId: "dept-2",
        name: "Samantha Fernando",
        mobile: "+94 71 892 4531",
        location: "Microbiology Wing, Colombo 05",
        remarks: "Chief Medical Technologist. Oversees maintenance logs for centrifuges.",
        isActive: true
      },
      {
        id: "eu-3",
        customerId: "cust-2",
        departmentId: "dept-3",
        name: "Tharindu Gunaratne",
        mobile: "+94 75 233 4455",
        location: "QC Lab, Ratmalana Factory Complex",
        remarks: "Specialist Chromatography Operator. Requests AMC schedules.",
        isActive: true
      },
      {
        id: "eu-4",
        customerId: "cust-3",
        departmentId: "dept-4",
        name: "Fathima Yasmin",
        mobile: "+94 77 622 1345",
        location: "MRI Virology Compound, Colombo 08",
        remarks: "Assistant Research Director. Handles blood analyzers calibrations.",
        isActive: true
      }
    ];
  });

  // 4. Audit Trail state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = safeLocalStorage.getItem('avon_customer_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "log-1",
        timestamp: "2026-06-23T08:15:00Z",
        actorName: currentUser.name,
        actorRole: currentUser.role,
        actionType: "CREATE_CUST",
        details: "Initialized system default AVON ServicePro customer master ledger."
      }
    ];
  });

  // Save states to LocalStorage on modifications
  useEffect(() => {
    safeLocalStorage.setItem('avon_local_customers', JSON.stringify(localCustomers));
  }, [localCustomers]);

  useEffect(() => {
    safeLocalStorage.setItem('avon_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    safeLocalStorage.setItem('avon_end_users_v2', JSON.stringify(endUsers));
  }, [endUsers]);

  useEffect(() => {
    safeLocalStorage.setItem('avon_customer_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);


  // Helper to log actions
  const logAction = (actionType: AuditLog['actionType'], details: string) => {
    const freshLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionType,
      details
    };
    setAuditLogs(prev => [freshLog, ...prev]);
  };

  // State Management for UI Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'master' | 'departments' | 'endusers' | 'profile' | 'audit' | 'supabase' | 'nextjs'>('dashboard');
  const [selectedCustForProfile, setSelectedCustForProfile] = useState<Customer | null>(null);
  const [nextjsSubTab, setNextjsSubTab] = useState<'pages' | 'actions' | 'forms' | 'tables' | 'sql'>('pages');
  const [custToastMsg, setCustToastMsg] = useState<string | null>(null);

  const showCustToast = (msg: string) => {
    setCustToastMsg(msg);
    setTimeout(() => setCustToastMsg(null), 4000);
  };

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState('ALL');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('ALL');
  const [selectedTerritoryFilter, setSelectedTerritoryFilter] = useState('ALL');
  
  // Custom alerts triggers
  const [alertSuccess, setAlertSuccess] = useState('');
  const [alertError, setAlertError] = useState('');

  // Form Controls
  // A. Customer Master Form
  const [showCustForm, setShowCustForm] = useState(false);
  const [editingCustId, setEditingCustId] = useState<string | null>(null);
  const [custForm, setCustForm] = useState({
    customerCode: '',
    name: '',
    address: '',
    province: 'Western Province',
    district: 'Colombo',
    territory: 'Territory Alpha (Central Hub)',
    contactPerson: '',
    phone: '',
    email: '',
    labType: 'Clinical Laboratory' as Customer['labType']
  });

  // B. Customer Department Form
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [deptForm, setDeptForm] = useState({
    customerId: '',
    name: '',
    contactPerson: '',
    contactNumber: ''
  });

  // C. End User Form
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({
    customerId: '',
    departmentId: '',
    name: '',
    mobile: '',
    location: '',
    remarks: '',
    isActive: true
  });

  const [sqlCopied, setSqlCopied] = useState(false);

  // Trigger Alerts
  const triggerSuccessAlert = (msg: string) => {
    setAlertSuccess(msg);
    setTimeout(() => setAlertSuccess(''), 4000);
  };

  const triggerErrorAlert = (msg: string) => {
    setAlertError(msg);
    setTimeout(() => setAlertError(''), 4000);
  };

  // Permission logic - allow manager or officers to modify
  const isAuthorized = canRegister(currentUser.role) || isManager(currentUser.role);

  // ==========================================
  // CUSTOMER CRUD OPERATIONS
  // ==========================================

  const handleEditCust = (c: Customer) => {
    setEditingCustId(c.id);
    setCustForm({
      customerCode: c.customerCode || `CUST-AV-${Math.floor(100 + Math.random() * 900)}`,
      name: c.name,
      address: c.address,
      province: c.province || 'Western Province',
      district: c.district || 'Colombo',
      territory: c.territory || 'Territory Alpha (Central Hub)',
      contactPerson: c.contactPerson,
      phone: c.phone,
      email: c.email,
      labType: c.labType
    });
    setShowCustForm(true);
  };

  const handleCreateNewCustBtn = () => {
    setEditingCustId(null);
    setCustForm({
      customerCode: `CUST-AV-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      address: '',
      province: 'Western Province',
      district: 'Colombo',
      territory: 'Territory Alpha (Central Hub)',
      contactPerson: '',
      phone: '',
      email: '',
      labType: 'Clinical Laboratory'
    });
    setShowCustForm(true);
  };

  const handleCustFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      triggerErrorAlert("Forbidden: Your authentication clearance does not support database modifications.");
      return;
    }

    if (
      !custForm.customerCode || 
      !custForm.name || 
      !custForm.address || 
      !custForm.email || 
      !custForm.phone || 
      !custForm.province || 
      !custForm.district || 
      !custForm.contactPerson
    ) {
      triggerErrorAlert("Invalid Data: Please ensure all required fields (including Province, District, Liaison Contact Person, and Telephone Hotline) are accurately filled.");
      return;
    }

    if (editingCustId) {
      // Update
      const oldCust = localCustomers.find(cu => cu.id === editingCustId);
      setLocalCustomers(prev => prev.map(c => c.id === editingCustId ? {
        ...c,
        customerCode: custForm.customerCode,
        name: custForm.name,
        address: custForm.address,
        province: custForm.province,
        district: custForm.district,
        territory: custForm.territory,
        contactPerson: custForm.contactPerson,
        phone: custForm.phone,
        email: custForm.email,
        labType: custForm.labType,
        liaisonName: custForm.contactPerson,
        liaisonContact: custForm.phone
      } : c));

      logAction('UPDATE_CUST', `Updated Customer Master for "${custForm.name}" [Code: ${custForm.customerCode}]`);
      triggerSuccessAlert(`Successfully updated customer account profile: ${custForm.name}`);
    } else {
      // Create
      const newId = `cust-${Date.now()}`;
      const newCust: Customer = {
        id: newId,
        customerCode: custForm.customerCode,
        name: custForm.name,
        address: custForm.address,
        province: custForm.province,
        district: custForm.district,
        territory: custForm.territory,
        contactPerson: custForm.contactPerson,
        phone: custForm.phone,
        email: custForm.email,
        labType: custForm.labType,
        liaisonName: custForm.contactPerson,
        liaisonContact: custForm.phone,
        created_at: new Date().toISOString()
      };

      setLocalCustomers(prev => [newCust, ...prev]);
      onAddCustomer(newCust); // Sync with application context

      logAction('CREATE_CUST', `Registered New Customer Master entry: "${newCust.name}" [Code: ${newCust.customerCode}]`);
      triggerSuccessAlert(`Successfully generated record for: ${newCust.name}`);
    }

    setShowCustForm(false);
  };

  const handleDeleteCust = (custId: string, name: string) => {
    if (!isAuthorized) {
      triggerErrorAlert("Access Denied: Only Workshop Managers or Documentation Officers can delete core records.");
      return;
    }

    if (window.confirm(`Are you absolutely sure you want to soft delete the Customer "${name}"? This operation purges related active registers.`)) {
      setLocalCustomers(prev => prev.filter(c => c.id !== custId));
      setDepartments(prev => prev.filter(d => d.customerId !== custId));
      setEndUsers(prev => prev.filter(u => u.customerId !== custId));

      logAction('DELETE_CUST', `Soft Deleted Customer Master index along with departments & end-users for: "${name}"`);
      triggerSuccessAlert(`Purged Customer account files for: ${name}`);
    }
  };

  // ==========================================
  // DEPARTMENT CRUD OPERATIONS
  // ==========================================

  const handleEditDept = (dept: CustomerDepartment) => {
    setEditingDeptId(dept.id);
    setDeptForm({
      customerId: dept.customerId,
      name: dept.name,
      contactPerson: dept.contactPerson,
      contactNumber: dept.contactNumber
    });
    setShowDeptForm(true);
  };

  const handleCreateNewDeptBtn = () => {
    setEditingDeptId(null);
    setDeptForm({
      customerId: localCustomers[0]?.id || '',
      name: '',
      contactPerson: '',
      contactNumber: ''
    });
    setShowDeptForm(true);
  };

  const handleDeptFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      triggerErrorAlert("Forbidden: Your authentication level does not support modifications.");
      return;
    }

    if (!deptForm.customerId || !deptForm.name || !deptForm.contactPerson) {
      triggerErrorAlert("Error: All fields are required for hospital laboratories sub-departments.");
      return;
    }

    if (editingDeptId) {
      setDepartments(prev => prev.map(d => d.id === editingDeptId ? {
        ...d,
        customerId: deptForm.customerId,
        name: deptForm.name,
        contactPerson: deptForm.contactPerson,
        contactNumber: deptForm.contactNumber
      } : d));

      const parentCust = localCustomers.find(c => c.id === deptForm.customerId)?.name || 'Direct Customer';
      logAction('UPDATE_DEPT', `Updated Department "${deptForm.name}" under ${parentCust}`);
      triggerSuccessAlert(`Modified Department details: ${deptForm.name}`);
    } else {
      const newDeptId = `dept-${Date.now()}`;
      const newDept: CustomerDepartment = {
        id: newDeptId,
        customerId: deptForm.customerId,
        name: deptForm.name,
        contactPerson: deptForm.contactPerson,
        contactNumber: deptForm.contactNumber
      };

      setDepartments(prev => [...prev, newDept]);

      const parentCust = localCustomers.find(c => c.id === deptForm.customerId)?.name || 'Direct Customer';
      logAction('CREATE_DEPT', `Created Department "${newDept.name}" under ${parentCust}`);
      triggerSuccessAlert(`Added Department: ${newDept.name}`);
    }

    setShowDeptForm(false);
  };

  const handleDeleteDept = (deptId: string, name: string) => {
    if (!isAuthorized) {
      triggerErrorAlert("Access Denied: Inadequate privileges.");
      return;
    }
    if (window.confirm(`Delete the department "${name}" and unbind active technicians?`)) {
      setDepartments(prev => prev.filter(d => d.id !== deptId));
      setEndUsers(prev => prev.map(u => u.departmentId === deptId ? { ...u, departmentId: undefined } : u));
      
      logAction('DELETE_DEPT', `Purged department file for: ${name}`);
      triggerSuccessAlert(`Deleted Department: ${name}`);
    }
  };


  // ==========================================
  // END USER (OPERATOR) CRUD OPERATIONS
  // ==========================================

  const handleEditUser = (user: EndUserRecord) => {
    setEditingUserId(user.id);
    setUserForm({
      customerId: user.customerId,
      departmentId: user.departmentId || '',
      name: user.name,
      mobile: user.mobile,
      location: user.location,
      remarks: user.remarks,
      isActive: user.isActive
    });
    setShowUserForm(true);
  };

  const handleCreateNewUserBtn = () => {
    setEditingUserId(null);
    setUserForm({
      customerId: localCustomers[0]?.id || '',
      departmentId: '',
      name: '',
      mobile: '',
      location: '',
      remarks: '',
      isActive: true
    });
    setShowUserForm(true);
  };

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      triggerErrorAlert("Forbidden: Inadequate authorization level.");
      return;
    }

    if (!userForm.customerId || !userForm.name || !userForm.mobile) {
      triggerErrorAlert("Error: Name and mobile telephone coordinates are required.");
      return;
    }

    if (editingUserId) {
      setEndUsers(prev => prev.map(u => u.id === editingUserId ? {
        ...u,
        customerId: userForm.customerId,
        departmentId: userForm.departmentId || undefined,
        name: userForm.name,
        mobile: userForm.mobile,
        location: userForm.location,
        remarks: userForm.remarks,
        isActive: userForm.isActive
      } : u));

      logAction('UPDATE_USER', `Updated clinical operator profile for ${userForm.name}`);
      triggerSuccessAlert(`Updated End-User account profile: ${userForm.name}`);
    } else {
      const newUserId = `eu-${Date.now()}`;
      const newUser: EndUserRecord = {
        id: newUserId,
        customerId: userForm.customerId,
        departmentId: userForm.departmentId || undefined,
        name: userForm.name,
        mobile: userForm.mobile,
        location: userForm.location,
        remarks: userForm.remarks,
        isActive: userForm.isActive
      };

      setEndUsers(prev => [newUser, ...prev]);

      logAction('CREATE_USER', `Enrolled lab chemist operator clearance: ${newUser.name}`);
      triggerSuccessAlert(`Registered Chemist: ${newUser.name}`);
    }

    setShowUserForm(false);
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (!isAuthorized) {
      triggerErrorAlert("Access Denied: Permission error.");
      return;
    }
    if (window.confirm(`Revoke AVON Metrology entry authorization credentials for: ${name}?`)) {
      setEndUsers(prev => prev.filter(u => u.id !== userId));
      logAction('DELETE_USER', `Purged Operator credentials for: ${name}`);
      triggerSuccessAlert(`Purged user profile: ${name}`);
    }
  };


  // ==========================================
  // SEARCH & FILTER LOGIC
  // ==========================================

  const filteredCustomers = localCustomers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.customerCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProvince = selectedProvinceFilter === 'ALL' || c.province === selectedProvinceFilter;
    const matchesDistrict = selectedDistrictFilter === 'ALL' || c.district === selectedDistrictFilter;
    const matchesTerritory = selectedTerritoryFilter === 'ALL' || c.territory === selectedTerritoryFilter;

    return matchesSearch && matchesProvince && matchesDistrict && matchesTerritory;
  });

  const filteredDepartments = departments.filter(d => {
    const parent = localCustomers.find(c => c.id === d.customerId);
    const parentName = parent ? parent.name : '';
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProvince = selectedProvinceFilter === 'ALL' || (parent && parent.province === selectedProvinceFilter);
    return matchesSearch && matchesProvince;
  });

  const filteredEndUsers = endUsers.filter(u => {
    const parent = localCustomers.find(c => c.id === u.customerId);
    const parentName = parent ? parent.name : '';
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.mobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProvince = selectedProvinceFilter === 'ALL' || (parent && parent.province === selectedProvinceFilter);
    return matchesSearch && matchesProvince;
  });


  // ==========================================
  // REAL SUPABASE SQL DATABASE EXPORT Snip generator
  // ==========================================
  const generateSupabaseSql = () => {
    return `-- =========================================================================
-- AVON ServicePro: Supabase Postgres Production-Ready Database Schema DDL
-- Enterprise Module: Customer Management, Departments, and End-Users
-- Standardized on: UUID Keys, ISO 9001 Timestamps, Soft Delete & Audit Ledger
-- =========================================================================

-- Enable required enterprise extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create CUSTOMER MASTER TABLE
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    territory VARCHAR(150) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    lab_type VARCHAR(100) DEFAULT 'Clinical Laboratory'::character varying,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft Delete support
);

-- 2. Create CUSTOMER DEPARTMENTS TABLE
CREATE TABLE public.customer_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create END USERS (OPERATORS) TABLE
CREATE TABLE public.end_users_directory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    department_id UUID REFERENCES public.customer_departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(100) NOT NULL,
    location TEXT,
    remarks TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 4. Create AUDIT TRAIL LOGGING SYSTEM TABLE
CREATE TABLE public.compliance_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    actor_name VARCHAR(150) NOT NULL,
    actor_role VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE
    details TEXT NOT NULL,
    ip_address VARCHAR(45)
);

-- ==========================================
-- PERFORMANCE TUNING INDEXES (PROD-READY)
-- ==========================================
CREATE INDEX idx_customers_code ON public.customers(customer_code);
CREATE INDEX idx_customers_region ON public.customers(province, district, territory);
CREATE INDEX idx_customer_departments_parent ON public.customer_departments(customer_id);
CREATE INDEX idx_end_users_customer ON public.end_users_directory(customer_id);
CREATE INDEX idx_end_users_dept ON public.end_users_directory(department_id);
CREATE INDEX idx_audit_timestamp ON public.compliance_audit_logs(timestamp DESC);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.end_users_directory ENABLE ROW LEVEL SECURITY;

-- 1. Read Policies for Authenticated Clinical Personnel
CREATE POLICY "Select active customers" 
ON public.customers 
FOR SELECT 
TO authenticated 
USING (deleted_at IS NULL AND is_active = TRUE);

CREATE POLICY "Select active departments" 
ON public.customer_departments 
FOR SELECT 
TO authenticated 
USING (deleted_at IS NULL);

CREATE POLICY "Select active operators" 
ON public.end_users_directory 
FOR SELECT 
TO authenticated 
USING (deleted_at IS NULL AND is_active = TRUE);

-- 2. Modify Policies restricted to Authorized Officers & Managers (Role based lookup)
CREATE POLICY "Modify authorization check for Managers" 
ON public.customers
FOR ALL 
TO authenticated
USING (
  current_setting('request.jwt.claims', true)::jsonb->>'role' IN ('Workshop Manager', 'Documentation Officer', 'Senior Biomedical Engineer')
);

-- ==========================================
-- AUTOMATION TRIGGER WORKFLOWS (ISO UPDATED_AT)
-- ==========================================
CREATE OR REPLACE FUNCTION update_iso_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_modtime 
BEFORE UPDATE ON public.customers 
FOR EACH ROW EXECUTE PROCEDURE update_iso_updated_at_column();

CREATE TRIGGER trg_departments_modtime 
BEFORE UPDATE ON public.customer_departments 
FOR EACH ROW EXECUTE PROCEDURE update_iso_updated_at_column();

CREATE TRIGGER trg_end_users_modtime 
BEFORE UPDATE ON public.end_users_directory 
FOR EACH ROW EXECUTE PROCEDURE update_iso_updated_at_column();

-- ==========================================
-- REAL SEED DUMP FOR LOCAL FACILITY NODES
-- ==========================================
${localCustomers.map(c => `INSERT INTO public.customers (id, customer_code, name, address, province, district, territory, contact_person, telephone, email)
VALUES ('${c.id}', '${c.customerCode}', '${c.name.replace(/'/g, "''")}', '${c.address.replace(/'/g, "''")}', '${c.province}', '${c.district}', '${c.territory}', '${c.contactPerson.replace(/'/g, "''")}', '${c.phone}', '${c.email}') ON CONFLICT (id) DO NOTHING;`).join('\n')}
`;
  };

  const handleCopySqlRaw = () => {
    const rawSql = generateSupabaseSql();
    navigator.clipboard.writeText(rawSql).then(() => {
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Header Block with Brand Colors */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-tr from-blue-700 to-indigo-600 text-white rounded-xl shadow-md shrink-0">
            <Building2 className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] bg-blue-50 text-[#0054A6] border border-blue-200 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-widest uppercase">
              AVON PHARMO CHEM SERVICE CENTRE
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">
              AVON ServicePro Customer Master Control Center
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Production ISO 9001/17025 database registry covering facility codes, departments list, authorized laboratory chemist operators, and territory routing.
            </p>
          </div>
        </div>

        {/* Dynamic Action Buttons based on privileges */}
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'master' && (
            <button
              onClick={handleCreateNewCustBtn}
              className="px-4 py-2 bg-[#0054A6] text-white text-xs font-bold font-sans hover:bg-blue-800 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Register Customer
            </button>
          )}
          {activeTab === 'departments' && (
            <button
              onClick={handleCreateNewDeptBtn}
              className="px-4 py-2 bg-indigo-650 text-white text-xs font-bold font-sans hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Lab Department
            </button>
          )}
          {activeTab === 'endusers' && (
            <button
              onClick={handleCreateNewUserBtn}
              className="px-4 py-2 bg-pink-650 text-white text-xs font-bold font-sans hover:bg-pink-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Enroll Operator
            </button>
          )}
          
          <span className="text-xs text-slate-400 font-mono bg-slate-100 p-2 py-1.5 rounded-md border text-center select-none">
            👤 Active: <strong className="text-slate-800 font-bold">{currentUser.role}</strong>
          </span>
        </div>
      </div>

      {/* Dynamic Tabs Navigation Bar */}
      <div className="bg-slate-100 p-1 rounded-xl flex flex-wrap gap-1 border border-slate-200 shadow-sm">
        <button
          onClick={() => { setActiveTab('dashboard'); setSearchQuery(''); }}
          className={`flex-1 min-w-[120px] px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-700 hover:bg-white/80 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" /> Executive Dashboard
        </button>
        <button
          onClick={() => { setActiveTab('master'); setSearchQuery(''); }}
          className={`flex-1 min-w-[120px] px-3 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'master' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" /> Customer Master ({localCustomers.length})
        </button>
        <button
          onClick={() => { setActiveTab('departments'); setSearchQuery(''); }}
          className={`flex-1 min-w-[120px] px-3 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'departments' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Departments ({departments.length})
        </button>
        <button
          onClick={() => { setActiveTab('endusers'); setSearchQuery(''); }}
          className={`flex-1 min-w-[120px] px-3 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'endusers' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" /> End Users ({endUsers.length})
        </button>
        {selectedCustForProfile && (
          <button
            onClick={() => { setActiveTab('profile'); setSearchQuery(''); }}
            className={`flex-1 min-w-[130px] px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'profile' ? 'bg-[#0054A6] text-white shadow-md' : 'text-blue-700 bg-blue-50/80 hover:bg-white/80'
            }`}
          >
            <FileText className="w-4 h-4 text-[#0054A6]" /> Profile Dossier
          </button>
        )}
        <button
          onClick={() => { setActiveTab('audit'); setSearchQuery(''); }}
          className={`flex-1 min-w-[120px] px-3 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'audit' ? 'bg-[#0054A6] text-white shadow-md' : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" /> System Audit Trail ({auditLogs.length})
        </button>
        <button
          onClick={() => { setActiveTab('supabase'); setSearchQuery(''); }}
          className={`flex-1 min-w-[120px] px-3 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'supabase' ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-600 hover:bg-white/80 hover:text-indigo-950'
          }`}
        >
          <Database className="w-4 h-4" /> Supabase Schema Console
        </button>
        <button
          onClick={() => { setActiveTab('nextjs'); setSearchQuery(''); }}
          className={`flex-1 min-w-[130px] px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'nextjs' ? 'bg-[#0054A6] text-white shadow-md' : 'text-amber-600 hover:bg-white/80 hover:text-amber-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> Next.js 15 Hub
        </button>
      </div>

      {/* Action Status Alerts */}
      {alertSuccess && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-3 animate-fade-in-down">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{alertSuccess}</span>
        </div>
      )}
      {alertError && (
        <div className="p-3.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-3 animate-fade-in-down">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>{alertError}</span>
        </div>
      )}

      {/* ========================================================
          CRITICAL FORMS SECTION
          ======================================================== */}

      {/* A. Customer Master Form */}
      {showCustForm && (
        <div className="bg-amber-50/40 p-6 rounded-xl border border-amber-200/60 shadow-inner space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-amber-200/60 pb-2">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0054A6]" />
              {editingCustId ? "EDIT CUSTOMER MASTER RECORDS" : "PROVISION NEW Enterprise Customer PROFILE"}
            </h3>
            <button onClick={() => setShowCustForm(false)} className="p-1 hover:bg-amber-100 text-amber-700 rounded-lg cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCustFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Customer Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. CUST-LH-101"
                  value={custForm.customerCode}
                  onChange={e => setCustForm(p => ({ ...p, customerCode: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Customer Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans"
                  placeholder="e.g. Lanka Hospitals PLC"
                  value={custForm.name}
                  onChange={e => setCustForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Physical & Shipping Address <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. No 578, Elvitigala Mawatha, Colombo 05"
                  value={custForm.address}
                  onChange={e => setCustForm(p => ({ ...p, address: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Province <span className="text-red-500">*</span></label>
                <select
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={custForm.province}
                  onChange={e => setCustForm(p => ({ ...p, province: e.target.value }))}
                >
                  {LANKA_PROVINCES.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">District <span className="text-red-500">*</span></label>
                <select
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={custForm.district}
                  onChange={e => setCustForm(p => ({ ...p, district: e.target.value }))}
                >
                  {LANKA_DISTRICTS.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Liaison Contact Person <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Dr. Rohitha Wijesekera"
                  value={custForm.contactPerson}
                  onChange={e => setCustForm(p => ({ ...p, contactPerson: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Liaison Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. admin@lanka.com"
                  value={custForm.email}
                  onChange={e => setCustForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Telephone Hotline <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                  placeholder="e.g. +94 11 543 0000"
                  value={custForm.phone}
                  onChange={e => setCustForm(p => ({ ...p, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Lab Specialization Class</label>
                <select
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={custForm.labType}
                  onChange={e => setCustForm(p => ({ ...p, labType: e.target.value as any }))}
                >
                  <option value="Clinical Laboratory">Clinical Laboratory</option>
                  <option value="Pharmaceutical Factory">Pharmaceutical Factory</option>
                  <option value="Research Institute">Research Institute</option>
                  <option value="Hospital Diagnostics">Hospital Diagnostics</option>
                </select>
              </div>

            </div>

            {/* Right Form column: Territory Mapping */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 font-sans tracking-tight uppercase flex items-center gap-1">
                <Map className="w-4 h-4 text-emerald-600" />
                Territory Assignment
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                Map this customer profile to a designated administrative service territory. This triggers smart notifications for regional managers.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">Service Territory Node</label>
                <select
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={custForm.territory}
                  onChange={e => setCustForm(p => ({ ...p, territory: e.target.value }))}
                >
                  {TERRITORY_NODES.map(node => <option key={node} value={node}>{node}</option>)}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustForm(false)}
                  className="px-3 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer transition-all"
                >
                  Verify & Persist
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* B. Customer Department Form */}
      {showDeptForm && (
        <div className="bg-indigo-50/40 p-6 rounded-xl border border-indigo-200/60 shadow-inner space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-indigo-200/60 pb-2">
            <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-700" />
              {editingDeptId ? "EDIT LAB DEPARTMENT RECORD" : "PROVISION NEW LAB DEPARTMENT"}
            </h3>
            <button onClick={() => setShowDeptForm(false)} className="p-1 hover:bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleDeptFormSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Affiliated Customer Facility <span className="text-red-500">*</span></label>
              <select
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={deptForm.customerId}
                onChange={e => setDeptForm(p => ({ ...p, customerId: e.target.value }))}
              >
                {localCustomers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.customerCode})</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Department Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans"
                placeholder="e.g. Chromatography QA Wing"
                value={deptForm.name}
                onChange={e => setDeptForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Contact Person Representative<span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Mrs Priyanthi Perera"
                value={deptForm.contactPerson}
                onChange={e => setDeptForm(p => ({ ...p, contactPerson: e.target.value }))}
              />
            </div>

            <div className="relative space-y-1">
              <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Contact Hotline Number/Ext</label>
              <input
                type="text"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                placeholder="e.g. +94 11 250 8264"
                value={deptForm.contactNumber}
                onChange={e => setDeptForm(p => ({ ...p, contactNumber: e.target.value }))}
              />
            </div>

            <div className="lg:col-span-4 flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeptForm(false)}
                className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-all"
              >
                Save Department Link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* C. End User Form */}
      {showUserForm && (
        <div className="bg-pink-50/40 p-6 rounded-xl border border-pink-200/60 shadow-inner space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-pink-200/60 pb-2">
            <h3 className="text-sm font-bold text-pink-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-700" />
              {editingUserId ? "EDIT ACTIVE CHEMISTRY OPERATOR Profile" : "REGISTER LICENSED END-USER OPERATOR"}
            </h3>
            <button onClick={() => setShowUserForm(false)} className="p-1 hover:bg-pink-100 text-pink-700 rounded-lg cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleUserFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Customer Lab Compound <span className="text-red-500">*</span></label>
              <select
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={userForm.customerId}
                onChange={e => setUserForm(p => ({ ...p, customerId: e.target.value, departmentId: '' }))}
              >
                {localCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Affiliated Department (Optional)</label>
              <select
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={userForm.departmentId}
                onChange={e => setUserForm(p => ({ ...p, departmentId: e.target.value }))}
              >
                <option value="">No Department association</option>
                {departments
                  .filter(d => d.customerId === userForm.customerId)
                  .map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Operator Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Dr. Keshara Wijewardene"
                value={userForm.name}
                onChange={e => setUserForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Mobile/Hotline Phone <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                placeholder="e.g. +94 77 341 9081"
                value={userForm.mobile}
                onChange={e => setUserForm(p => ({ ...p, mobile: e.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Operators Specific Location inside Site <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Level 3, Biopharma Lab Room 3A"
                value={userForm.location}
                onChange={e => setUserForm(p => ({ ...p, location: e.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Status</label>
              <select
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={userForm.isActive ? "true" : "false"}
                onChange={e => setUserForm(p => ({ ...p, isActive: e.target.value === 'true' }))}
              >
                <option value="true">Active Operator</option>
                <option value="false">Inactive / Suspended</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-[11px] font-bold font-mono text-slate-500 uppercase block">Remarks / Notes</label>
              <textarea
                rows={2}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Add special notes on physical location or access instructions..."
                value={userForm.remarks}
                onChange={e => setUserForm(p => ({ ...p, remarks: e.target.value }))}
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUserForm(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-pink-650 hover:bg-pink-700 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-all"
              >
                Enroll Authorized Operator
              </button>
            </div>
          </form>
        </div>
      )}


      {/* ========================================================
          GLOBAL SEARCH / FILTER PANEL (Dynamic)
          ======================================================== */}
      {(activeTab === 'master' || activeTab === 'departments' || activeTab === 'endusers') && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Dynamic Search */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
              placeholder={
                activeTab === 'master' ? "Search by Code, Name, Email, Address, liaison..." : 
                activeTab === 'departments' ? "Search department, contact person, client name..." :
                "Search operator name, mobile line, specific location..."
              }
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Regional Provinces, Districts, Territories Multi-Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-extrabold font-mono text-slate-400 uppercase">GEO FILTERS:</span>
            </div>

            <select
              className="bg-white border text-[11px] font-sans p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedProvinceFilter}
              onChange={e => setSelectedProvinceFilter(e.target.value)}
            >
              <option value="ALL">All Provinces</option>
              {LANKA_PROVINCES.map(prov => <option key={prov} value={prov}>{prov}</option>)}
            </select>

            {activeTab === 'master' && (
              <>
                <select
                  className="bg-white border text-[11px] font-sans p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={selectedDistrictFilter}
                  onChange={e => setSelectedDistrictFilter(e.target.value)}
                >
                  <option value="ALL">All Districts</option>
                  {LANKA_DISTRICTS.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                </select>

                <select
                  className="bg-white border text-[11px] font-sans p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={selectedTerritoryFilter}
                  onChange={e => setSelectedTerritoryFilter(e.target.value)}
                >
                  <option value="ALL">All Territories</option>
                  {TERRITORY_NODES.map(node => <option key={node} value={node}>{node}</option>)}
                </select>
              </>
            )}

            {(searchQuery || selectedProvinceFilter !== 'ALL' || selectedDistrictFilter !== 'ALL' || selectedTerritoryFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedProvinceFilter('ALL');
                  setSelectedDistrictFilter('ALL');
                  setSelectedTerritoryFilter('ALL');
                }}
                className="text-[10px] font-bold text-red-600 hover:underline uppercase font-mono cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}


      {/* ========================================================
          RENDER TAB: CUSTOMER MASTER LEDGER
          ======================================================== */}
      {activeTab === 'master' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCustomers.map(cust => {
            const linkedDepts = departments.filter(d => d.customerId === cust.id);
            const linkedOps = endUsers.filter(u => u.customerId === cust.id);

            return (
              <div 
                key={cust.id} 
                className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border">
                          {cust.customerCode || 'NO-CODE'}
                        </span>
                        <span className="text-[10px] font-bold bg-blue-50 text-[#0054A6] px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
                          {cust.labType}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight pt-1">
                        {cust.name}
                      </h3>
                    </div>

                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full uppercase font-mono">
                      ACTIVE LEDGER
                    </span>
                  </div>

                  {/* Customer Core Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                    
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Contact Liaison</span>
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <UserCheck className="w-3.5 h-3.5 text-[#0054A6] shrink-0" />
                        <span className="font-semibold">{cust.contactPerson}</span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Telephone Hotline</span>
                      <div className="flex items-center gap-1.5 text-slate-800 font-mono">
                        <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{cust.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Email Address</span>
                      <div className="flex items-center gap-1.5 text-slate-800 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{cust.email}</span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Postal DistrictNode</span>
                      <div className="flex items-center gap-1.5 text-slate-800 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{cust.district} ({cust.province})</span>
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">Territory Route Node</span>
                      <div className="flex items-center gap-1.5 pt-0.5 text-[#0054A6] font-semibold text-[11px]">
                        <Map className="w-4 h-4 text-indigo-600" />
                        <span>{cust.territory || 'Unassigned Regional Routing'}</span>
                      </div>
                    </div>

                    <div className="sm:col-span-2 text-slate-500 leading-normal flex items-start gap-1 pb-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>Address: {cust.address}</span>
                    </div>

                  </div>

                  {/* Connected Stats widgets */}
                  <div className="flex items-center gap-4 bg-slate-50/55 p-3 rounded-xl border border-dashed border-slate-200">
                    <div className="flex-1 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <div className="text-[11px]">
                        <strong className="text-slate-800">{linkedDepts.length}</strong> {linkedDepts.length === 1 ? 'Sub-dept' : 'Sub-depts'}
                      </div>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200" />
                    <div className="flex-1 flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-600" />
                      <div className="text-[11px]">
                        <strong className="text-slate-800">{linkedOps.length}</strong> {linkedOps.length === 1 ? 'Operator' : 'Operators'}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Card Actions Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">
                    Enrolled: {new Date(cust.created_at).toLocaleDateString()}
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5 justify-end">
                    <button
                      onClick={() => { setSelectedCustForProfile(cust); setActiveTab('profile'); }}
                      className="px-2.5 py-1 bg-blue-50 border border-blue-200 hover:bg-[#0054A6] hover:text-white text-[#0054A6] font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <FileText className="w-3 h-3" /> Profile Dossier
                    </button>
                    <button
                      onClick={() => handleEditCust(cust)}
                      className="px-2.5 py-1 bg-slate-50 border hover:bg-slate-100 text-slate-700 font-semibold rounded-md flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-[#0054A6]" /> Edit Master
                    </button>
                    <button
                      onClick={() => handleDeleteCust(cust.id, cust.name)}
                      className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-md font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Soft Delete
                    </button>
                  </div>
                </div>

              </div>
            );
          })}

          {filteredCustomers.length === 0 && (
            <div className="bg-white p-12 rounded-xl border border-dashed border-slate-350 col-span-2 text-center text-slate-400">
              <Building2 className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="font-bold text-slate-800 text-sm uppercase mt-3">No Active Customer Ledger Nodes Found</h3>
              <p className="text-slate-500 font-sans text-xs max-w-md mx-auto mt-1">
                We couldn't locate any registered facilities matching "{searchQuery}". Modify search text or create a new listing.
              </p>
            </div>
          )}
        </div>
      )}


      {/* ========================================================
          RENDER TAB: CUSTOMER DEPARTMENTS
          ======================================================== */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
            <h4 className="text-xs font-extrabold font-mono text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-700" />
              Enterprise Laboratory Departments Compendium
            </h4>
            <span className="text-[11px] font-mono text-slate-400">{filteredDepartments.length} Departments Managed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-100/50 text-[10px] font-bold font-mono text-slate-500 uppercase">
                  <th className="p-4">Customer Facility</th>
                  <th className="p-4">Department Name</th>
                  <th className="p-4">Primary Representative</th>
                  <th className="p-4">Hotline Number</th>
                  <th className="p-4 text-right">Actions Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs text-slate-700">
                {filteredDepartments.map(dept => {
                  const parentComp = localCustomers.find(cu => cu.id === dept.customerId);
                  return (
                    <tr key={dept.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-[#0054A6] max-w-[200px] truncate">
                        {parentComp ? parentComp.name : 'Unknown customer'}
                      </td>
                      <td className="p-4 font-semibold text-slate-900">{dept.name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dept.contactPerson}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono">{dept.contactNumber || 'No direct ext'}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditDept(dept)}
                            className="p-1 text-[#0054A6] hover:bg-slate-100 rounded-md cursor-pointer duration-100"
                            title="Edit department variables"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDept(dept.id, dept.name)}
                            className="p-1 text-rose-600 hover:bg-slate-150 rounded-md cursor-pointer duration-100"
                            title="Purge department relationship"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredDepartments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-xs uppercase text-slate-500">No Laboratory Sub-departments Registered</p>
                      <p className="text-[11px] text-slate-400">Map an in-facility building-block, QA lab, or specialized pathology unit to start scheduling equipment repairs.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ========================================================
          RENDER TAB: END USERS (LAB CHEMISTS OPERATORS)
          ======================================================== */}
      {activeTab === 'endusers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEndUsers.map(user => {
            const parent = localCustomers.find(c => c.id === user.customerId);
            const parentDept = departments.find(d => d.id === user.departmentId);

            return (
              <div 
                key={user.id} 
                className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-pink-100 text-pink-700 font-extrabold rounded-full flex items-center justify-center text-xs">
                        {user.name.split(' ').pop()?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight block">{user.name}</h4>
                        <span className="text-[10px] font-mono font-medium text-slate-400 block pt-0.5">AVON Operator Badge #{user.id.toUpperCase().split('-')[1] || 'S'}</span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${
                      user.isActive ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}>
                      {user.isActive ? 'ACTIVE' : 'SUSPENDED'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-2">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-extrabold text-slate-400 font-mono uppercase tracking-wider block">Affiliated Facility</span>
                      <span className="font-bold text-[#0054A6] block">{parent ? parent.name : 'Unknown laboratory'}</span>
                    </div>

                    {parentDept && (
                      <div className="space-y-0.5 border-t pt-1.5 border-slate-200/60">
                        <span className="text-[9px] font-extrabold text-slate-400 font-mono uppercase tracking-wider block">Lab Department block</span>
                        <span className="font-semibold text-slate-700 block">{parentDept.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-650">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px] font-bold text-slate-700">{user.mobile}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{user.location}</span>
                    </div>
                  </div>

                  {user.remarks && (
                    <div className="p-2.5 bg-amber-50/50 text-[10px] text-amber-900 border border-amber-150/50 rounded-lg italic font-sans leading-normal">
                      <strong>Remarks:</strong> {user.remarks}
                    </div>
                  )}

                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-[11px]">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border text-slate-700 font-semibold rounded flex items-center gap-1 cursor-pointer duration-100"
                  >
                    <Edit3 className="w-3 h-3 text-[#0054A6]" /> Edit Status
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id, user.name)}
                    className="p-1 px-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 rounded cursor-pointer duration-100"
                    title="Revoke access authorizations"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredEndUsers.length === 0 && (
            <div className="bg-white p-12 rounded-xl border border-dashed border-slate-350 col-span-3 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="font-bold text-slate-800 text-sm uppercase mt-3">No Laboratory Chemists Enrolled</h3>
              <p className="text-slate-500 font-sans text-xs max-w-sm mx-auto mt-1">
                Enrolling chemist personnel is required to dispatch trace-calibrated certificates.
              </p>
            </div>
          )}
        </div>
      )}


      {/* ========================================================
          RENDER TAB: SYSTEM AUDIT TRAIL LEDGER
          ======================================================== */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
            <h4 className="text-xs font-extrabold font-mono text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              ISO Core Compliance Database mutation records (Trail log)
            </h4>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">SECURE TRAIL ACTIVE</span>
          </div>

          <div className="p-4 space-y-4">
            <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {auditLogs.map((log, index) => (
                <div key={log.id} className="relative space-y-1 text-xs">
                  {/* Timeline Indicator dot */}
                  <span className={`absolute -left-[20px] top-1.5 w-3.5 h-3.5 rounded-full border border-white shrink-0 ${
                    log.actionType.startsWith('CREATE') ? 'bg-emerald-500' :
                    log.actionType.startsWith('UPDATE') ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between text-slate-400 gap-1">
                    <div className="font-mono text-[10px]">
                      ⏱️ {new Date(log.timestamp).toLocaleString()} UTC
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="bg-slate-100 text-slate-600 font-mono py-0.5 px-2 rounded font-bold">{log.actorName}</span>
                      <span className="text-slate-500">[{log.actorRole}]</span>
                    </div>
                  </div>

                  <p className="text-slate-800 font-semibold leading-relaxed font-sans mt-1">
                    <strong className="font-semibold text-slate-900 border-r pr-2 mr-2 border-slate-350">{log.actionType}</strong>
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ========================================================
          RENDER TAB: SUPABASE POSTGRESQL ARCHITECT CONSOLE
          ======================================================== */}
      {activeTab === 'supabase' && (
        <div className="space-y-5 animate-fade-in">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-slate-300 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-indigo-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-tight">Supabase DDL Meta-Engine</h3>
                  <p className="text-[11px] text-slate-400">PostgreSQL v15 Production-Grade customer database structures.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySqlRaw}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold p-2 px-3 rounded-lg flex items-center gap-1.5 focus:outline-none transition-all cursor-pointer"
                >
                  {sqlCopied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> SCHEMA COPIED!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> COPY RAW SCRIPT
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/20 border border-indigo-500/15 rounded text-xs leading-relaxed text-indigo-300 flex items-start gap-2.5">
              <Workflow className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-bounce" />
              <span>
                <strong>Metadata Auto-Sync Active:</strong> This SQL script compiles your active schema parameters (Customer Codes, hospital sub-departments, operator directories) into optimized PostgreSQL tables, complete with UUIDs, indexes, RLS, and security policies. Run this script directly inside your Supabase project's SQL Editor.
              </span>
            </div>

            {/* Code Block Screen */}
            <div className="relative">
              <pre className="text-[11px] font-mono leading-relaxed bg-[#0c101b] p-4 rounded-xl overflow-x-auto max-h-[460px] scrollbar-thin text-slate-300 border border-slate-800">
                <code>{generateSupabaseSql()}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          RENDER TAB: NEXT.JS 15 CUSTOMER MANAGEMENT HUB
          ======================================================== */}
      {activeTab === 'nextjs' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Toast Message */}
          {custToastMsg && (
            <div className="bg-[#003B75] text-white p-3.5 rounded-xl shadow-lg flex items-center justify-between border border-blue-400/30 animate-fade-in-down">
              <div className="flex items-center gap-2.5 text-xs font-bold font-sans">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                <span>{custToastMsg}</span>
              </div>
              <button onClick={() => setCustToastMsg(null)} className="text-blue-200 hover:text-white font-bold text-xs p-1">✕</button>
            </div>
          )}

          {/* Banner */}
          <div className="bg-gradient-to-r from-[#003B75] via-[#0054A6] to-[#0077C8] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wider uppercase">Next.js 15 App Router</span>
                  <span className="bg-emerald-500/30 border border-emerald-400/40 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">Supabase RLS</span>
                  <span className="bg-amber-400/30 border border-amber-300/40 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-amber-200">Server Actions</span>
                </div>
                <h2 className="text-2xl font-black font-sans tracking-tight">Enterprise Customer Management Hub</h2>
                <p className="text-blue-100 text-xs mt-1 max-w-2xl leading-relaxed">
                  Full-stack Next.js 15 architecture implementing Customer Master, Department Master, End User Master, SLA agreements, and Territory routing with React Hook Form + Zod.
                </p>
              </div>

              {/* Simulation Buttons */}
              <div className="flex flex-wrap gap-2 shrink-0">
                <button 
                  onClick={() => showCustToast("🔄 Simulated saveCustomerAction(formData) - Row inserted into Supabase & revalidatePath('/customers') triggered.")}
                  className="bg-white text-[#003B75] hover:bg-blue-50 px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-[#0054A6]" /> Simulate Save Org
                </button>
                <button 
                  onClick={() => showCustToast("📍 Simulated assignTerritoryAction(custId, terrId) - Updated territory FK & revalidated layout cache.")}
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-300" /> Assign Territory
                </button>
              </div>
            </div>
          </div>

          {/* Sub Navigation Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setNextjsSubTab('pages')}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  nextjsSubTab === 'pages' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-300" /> Next.js Pages (`page.tsx`)
              </button>
              <button
                onClick={() => setNextjsSubTab('actions')}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  nextjsSubTab === 'actions' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-amber-400" /> Server Actions (`actions.ts`)
              </button>
              <button
                onClick={() => setNextjsSubTab('forms')}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  nextjsSubTab === 'forms' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Shadcn UI Forms (+ Zod)
              </button>
              <button
                onClick={() => setNextjsSubTab('tables')}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  nextjsSubTab === 'tables' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Table className="w-3.5 h-3.5 text-purple-400" /> Data Tables & Filters
              </button>
              <button
                onClick={() => setNextjsSubTab('sql')}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  nextjsSubTab === 'sql' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-rose-400" /> Supabase SQL & RLS
              </button>
            </div>
          </div>

          {/* Code Showcases */}
          {nextjsSubTab === 'pages' && (
            <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" /> `src/app/(dashboard)/customers/page.tsx`
                  </h3>
                  <p className="text-[11px] text-slate-400">Next.js 15 App Router Server Component with query string searchParams and Supabase SSR data fetching.</p>
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(NEXTJS_CUSTOMER_PAGE_CODE); showCustToast("📋 Copied Next.js Customer Page code!"); }}
                  className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[520px] scrollbar-thin p-2">
                <code>{NEXTJS_CUSTOMER_PAGE_CODE}</code>
              </pre>
            </div>
          )}

          {nextjsSubTab === 'actions' && (
            <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-amber-400" /> `src/actions/customers.ts` (`'use server'`)
                  </h3>
                  <p className="text-[11px] text-slate-400">Server Actions for Customer Master, Department Master, End User Master, and Territory assignment.</p>
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(NEXTJS_CUSTOMER_ACTIONS_CODE); showCustToast("📋 Copied Server Actions code!"); }}
                  className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[520px] scrollbar-thin p-2">
                <code>{NEXTJS_CUSTOMER_ACTIONS_CODE}</code>
              </pre>
            </div>
          )}

          {nextjsSubTab === 'forms' && (
            <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" /> `src/components/customers/CustomerForm.tsx`
                  </h3>
                  <p className="text-[11px] text-slate-400">Client Component using React Hook Form + Zod schema validation + useTransition.</p>
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(NEXTJS_CUSTOMER_FORMS_CODE); showCustToast("📋 Copied Shadcn UI Form code!"); }}
                  className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[520px] scrollbar-thin p-2">
                <code>{NEXTJS_CUSTOMER_FORMS_CODE}</code>
              </pre>
            </div>
          )}

          {nextjsSubTab === 'tables' && (
            <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Table className="w-4 h-4 text-purple-400" /> `src/components/customers/CustomerTableClient.tsx`
                  </h3>
                  <p className="text-[11px] text-slate-400">Interactive data table with real-time text search, Province filtering, SLA badges, and action links.</p>
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(NEXTJS_CUSTOMER_TABLES_CODE); showCustToast("📋 Copied Client Table code!"); }}
                  className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[520px] scrollbar-thin p-2">
                <code>{NEXTJS_CUSTOMER_TABLES_CODE}</code>
              </pre>
            </div>
          )}

          {nextjsSubTab === 'sql' && (
            <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-rose-400" /> Supabase PostgreSQL DDL & RLS Policies
                  </h3>
                  <p className="text-[11px] text-slate-400">Schema for `customers`, `customer_departments`, `end_users`, indexes, and RLS security rules.</p>
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(SUPABASE_CUSTOMER_SQL_CODE); showCustToast("📋 Copied Supabase Customer SQL!"); }}
                  className="bg-[#0054A6] hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[520px] scrollbar-thin p-2">
                <code>{SUPABASE_CUSTOMER_SQL_CODE}</code>
              </pre>
            </div>
          )}

        </div>
      )}

      {/* ========================================================
          RENDER TAB: EXECUTIVE DASHBOARD
          ======================================================== */}
      {activeTab === 'dashboard' && (
        <CustomerDashboardView
          customers={localCustomers}
          onNewCustomer={() => { setActiveTab('master'); handleCreateNewCustBtn(); }}
          onSelectCustomer={(cust) => {
            setSelectedCustForProfile(cust);
            setActiveTab('profile');
          }}
          departmentCount={departments.length}
          endUserCount={endUsers.length}
        />
      )}

      {/* ========================================================
          RENDER TAB: CUSTOMER PROFILE DOSSIER
          ======================================================== */}
      {activeTab === 'profile' && (
        <CustomerProfileView
          customer={selectedCustForProfile || localCustomers[0]}
          onBack={() => setActiveTab('master')}
          departments={departments.filter(d => d.customerId === (selectedCustForProfile || localCustomers[0])?.id)}
          endUsers={endUsers.filter(u => u.customerId === (selectedCustForProfile || localCustomers[0])?.id)}
          onAddDepartment={(newDept) => {
            setDepartments(prev => [...prev, newDept]);
            logAction('CREATE_DEPT', `Added Dept ${newDept.name} via Profile`);
          }}
          onAddEndUser={(newUser) => {
            setEndUsers(prev => [newUser, ...prev]);
            logAction('CREATE_USER', `Enrolled User ${newUser.name} via Profile`);
          }}
          currentUser={currentUser}
        />
      )}

    </div>
  );
}
