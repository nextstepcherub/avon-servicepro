/**
 * AVON ServicePro V3 Enterprise RBAC, Dashboard & Navigation Architecture
 * Company: AVON PHARMO CHEM (PVT) LTD SERVICE CENTRE
 * Technology: Supabase PostgreSQL, Next.js 15, TypeScript, Tailwind CSS, Vercel
 * Designed by Senior Enterprise Solution Architect
 */

export interface V3RoleMetadata {
  id: string;
  roleName: string;
  category: 'MANAGEMENT' | 'COMMERCIAL' | 'FIELD_BIOMEDICAL' | 'FIELD_SERVICE' | 'BENCH_WORKSHOP' | 'METROLOGY' | 'SUPPORT_STAFF';
  level: number; // 1 = Executive/Manager, 2 = Senior Eng, 3 = Eng, 4 = Junior/Tech, 5 = Trainee/Intern
  badgeColor: string;
  description: string;
}

export const V3_ROLES_LIST: V3RoleMetadata[] = [
  { id: 'role-wm', roleName: 'Workshop Manager', category: 'MANAGEMENT', level: 1, badgeColor: 'bg-amber-100 text-amber-800 border-amber-300', description: 'Overall operations head, billing approver, regional dispatcher' },
  { id: 'role-do', roleName: 'Documentation Officer', category: 'COMMERCIAL', level: 2, badgeColor: 'bg-purple-100 text-purple-800 border-purple-300', description: 'Quotation drafting, PO archiving, invoice compliance verification' },
  { id: 'role-sbe', roleName: 'Senior Biomedical Engineer', category: 'FIELD_BIOMEDICAL', level: 2, badgeColor: 'bg-blue-100 text-blue-800 border-blue-300', description: 'IQ/OQ/PQ clinical site sign-off, regulatory commissioning lead' },
  { id: 'role-be', roleName: 'Biomedical Engineer', category: 'FIELD_BIOMEDICAL', level: 3, badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300', description: 'Standard medical instrument commissioning and routine servicing' },
  { id: 'role-jbe', roleName: 'Junior Biomedical Engineer', category: 'FIELD_BIOMEDICAL', level: 4, badgeColor: 'bg-sky-100 text-sky-800 border-sky-300', description: 'Assisted clinical maintenance and site inspection reporting' },
  { id: 'role-sse', roleName: 'Senior Service Engineer', category: 'FIELD_SERVICE', level: 2, badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300', description: 'Complex field troubleshooting, major AMC contract supervisor' },
  { id: 'role-se', roleName: 'Service Engineer', category: 'FIELD_SERVICE', level: 3, badgeColor: 'bg-blue-100 text-blue-800 border-blue-300', description: 'Preventive maintenance and breakdown service execution' },
  { id: 'role-jse', roleName: 'Junior Service Engineer', category: 'FIELD_SERVICE', level: 4, badgeColor: 'bg-slate-100 text-slate-800 border-slate-300', description: 'Routine warranty inspection and minor field repairs' },
  { id: 'role-swe', roleName: 'Senior Workshop Engineer', category: 'BENCH_WORKSHOP', level: 2, badgeColor: 'bg-orange-100 text-orange-800 border-orange-300', description: 'Deep PCB/hardware diagnostics, workshop repair queue master' },
  { id: 'role-we', roleName: 'Workshop Engineer', category: 'BENCH_WORKSHOP', level: 3, badgeColor: 'bg-amber-100 text-amber-800 border-amber-300', description: 'Offline bench diagnosis, spare parts replacement and bench testing' },
  { id: 'role-jwe', roleName: 'Junior Workshop Engineer', category: 'BENCH_WORKSHOP', level: 4, badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300', description: 'Preliminary unboxed item intake diagnosis and bench cleaning' },
  { id: 'role-ce', roleName: 'Calibration Engineer', category: 'METROLOGY', level: 2, badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300', description: 'ISO 17025 traceable recalibration and certificate sign-off' },
  { id: 'role-tech', roleName: 'Technician', category: 'SUPPORT_STAFF', level: 4, badgeColor: 'bg-teal-100 text-teal-800 border-teal-300', description: 'On-site mechanical assistance, cabling, hardware unboxing' },
  { id: 'role-tt', roleName: 'Trainee Technician', category: 'SUPPORT_STAFF', level: 5, badgeColor: 'bg-stone-100 text-stone-800 border-stone-300', description: 'Supervised workshop cleaning, packaging, tool preparation' },
  { id: 'role-te', roleName: 'Trainee Engineer', category: 'SUPPORT_STAFF', level: 5, badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-300', description: 'Apprentice field observation and documentation logging' },
  { id: 'role-it', roleName: 'Intern Technician', category: 'SUPPORT_STAFF', level: 5, badgeColor: 'bg-gray-100 text-gray-800 border-gray-300', description: 'University attachment bench training and inventory counting' }
];

export const V3_ENGINEER_TAGS = ['Area Engineer', 'Workshop Engineer', 'Calibration Engineer'] as const;
export type V3EngineerTag = typeof V3_ENGINEER_TAGS[number];

export interface V3ExampleUser {
  name: string;
  role: string;
  tags: V3EngineerTag[];
  department: string;
  email: string;
}

export const V3_CHERUB_PROFILE: V3ExampleUser = {
  name: 'Cherub Weeratunge',
  role: 'Senior Biomedical Engineer',
  tags: ['Area Engineer', 'Calibration Engineer'],
  department: 'Biomedical Engineering & Metrology Div',
  email: 'cherub.w@avonpharmochem.com'
};

export const V3_MODULES = [
  'Customers', 'Departments', 'End Users', 'Instruments', 
  'Installations', 'Warranty Services', 'Non Warranty Services', 'Warranty Repairs', 
  'Workshop Jobs', 'Calibration Jobs', 'Quotations', 'Purchase Orders', 
  'Invoices', 'Customer Satisfaction', 'KPIs', 'Reports', 
  'Users', 'System Settings'
] as const;

export type V3Module = typeof V3_MODULES[number];
export type V3PermissionAction = 'View' | 'Create' | 'Edit' | 'Delete' | 'Assign' | 'Approve' | 'Reject' | 'Close' | 'Export';

export interface V3ModulePermissions {
  module: V3Module;
  actions: Record<V3PermissionAction, boolean>;
}

/**
 * Helper to generate deterministic realistic V3 permission matrix per role
 */
export function getRolePermissions(roleName: string): V3ModulePermissions[] {
  const isMgr = roleName === 'Workshop Manager';
  const isDoc = roleName === 'Documentation Officer';
  const isSnrEng = ['Senior Biomedical Engineer', 'Senior Service Engineer', 'Senior Workshop Engineer', 'Calibration Engineer'].includes(roleName);
  const isStdEng = ['Biomedical Engineer', 'Service Engineer', 'Workshop Engineer'].includes(roleName);
  const isJnrEng = ['Junior Biomedical Engineer', 'Junior Service Engineer', 'Junior Workshop Engineer'].includes(roleName);
  const isTech = ['Technician', 'Trainee Technician', 'Trainee Engineer', 'Intern Technician'].includes(roleName);

  return V3_MODULES.map(mod => {
    const isCommercialMod = ['Quotations', 'Purchase Orders', 'Invoices'].includes(mod);
    const isJobMod = ['Installations', 'Warranty Services', 'Non Warranty Services', 'Warranty Repairs', 'Workshop Jobs', 'Calibration Jobs'].includes(mod);
    const isAdminMod = ['Users', 'System Settings'].includes(mod);
    const isAssetMod = ['Customers', 'Departments', 'End Users', 'Instruments'].includes(mod);

    let view = true;
    let create = false;
    let edit = false;
    let del = false;
    let assign = false;
    let approve = false;
    let reject = false;
    let close = false;
    let exportAct = false;

    if (isMgr) {
      create = true; edit = true; del = true; assign = true; approve = true; reject = true; close = true; exportAct = true;
    } else if (isDoc) {
      if (isCommercialMod || isAssetMod) {
        create = true; edit = true; exportAct = true; approve = isCommercialMod; reject = isCommercialMod;
      }
      if (isJobMod) { view = true; edit = true; exportAct = true; }
      if (mod === 'Reports') { create = true; exportAct = true; }
      if (isAdminMod) view = false;
    } else if (isSnrEng) {
      if (isJobMod) { create = true; edit = true; assign = true; close = true; exportAct = true; approve = mod === 'Installations' || mod === 'Calibration Jobs'; reject = true; }
      if (isAssetMod) { create = true; edit = true; exportAct = true; }
      if (isCommercialMod) { view = true; create = mod === 'Quotations'; edit = mod === 'Quotations'; }
      if (mod === 'KPIs' || mod === 'Reports' || mod === 'Customer Satisfaction') { view = true; exportAct = true; }
      if (isAdminMod) view = false;
    } else if (isStdEng) {
      if (isJobMod) { create = true; edit = true; close = true; }
      if (isAssetMod) { create = true; edit = true; }
      if (isCommercialMod) view = true;
      if (isAdminMod) view = false;
    } else if (isJnrEng || isTech) {
      if (isJobMod) { view = true; edit = true; }
      if (isAssetMod) view = true;
      if (isCommercialMod || isAdminMod) view = false;
    }

    return {
      module: mod,
      actions: { View: view, Create: create, Edit: edit, Delete: del, Assign: assign, Approve: approve, Reject: reject, Close: close, Export: exportAct }
    };
  });
}

// PART 2: JOB RESPONSIBILITY MATRIX
export interface V3JobResponsibility {
  jobType: string;
  codePrefix: string;
  responsible: string;
  supporting?: string;
  quotation?: string;
  approval: string;
  description: string;
}

export const V3_JOB_RESPONSIBILITIES: V3JobResponsibility[] = [
  {
    jobType: 'Installation',
    codePrefix: 'INS-2026',
    responsible: 'Area Engineer',
    supporting: 'Technician, Biomedical Engineer',
    approval: 'Workshop Manager',
    description: 'Site qualification, unboxing, power stabilization, IQ/OQ testing, clinician orientation'
  },
  {
    jobType: 'Warranty Service',
    codePrefix: 'WSV-2026',
    responsible: 'Area Engineer',
    supporting: 'Technician',
    approval: 'Workshop Manager',
    description: 'Scheduled preventive maintenance protocol under active factory warranty period'
  },
  {
    jobType: 'Non Warranty Service',
    codePrefix: 'SRV-2026',
    responsible: 'Area Engineer',
    supporting: 'Service Engineer',
    quotation: 'Documentation Officer',
    approval: 'Workshop Manager',
    description: 'Billable routine inspection, part diagnosis, customer quotation generation, AMC execution'
  },
  {
    jobType: 'Workshop Job',
    codePrefix: 'WSJ-2026',
    responsible: 'Workshop Engineer',
    supporting: 'Technician',
    approval: 'Workshop Manager',
    description: 'Offline bench hardware dismantling, PCB micro-soldering, optical component alignment'
  },
  {
    jobType: 'Calibration Job',
    codePrefix: 'CAL-2026',
    responsible: 'Calibration Engineer',
    approval: 'Workshop Manager',
    description: 'ISO 17025 metrology verification against certified standard weights/wavelengths'
  }
];

// PART 3: DASHBOARD ARCHITECTURE WIDGETS
export interface V3DashboardWidget {
  id: string;
  title: string;
  metric?: string;
  subText?: string;
  iconName: string;
  colorClass: string;
}

export interface V3RoleDashboardSpec {
  roleName: string;
  tagline: string;
  widgets: V3DashboardWidget[];
}

export const V3_DASHBOARDS_SPEC: Record<string, V3RoleDashboardSpec> = {
  'Workshop Manager': {
    roleName: 'Workshop Manager',
    tagline: 'Regional Operations & Dispatch Control Tower',
    widgets: [
      { id: 'wm-1', title: 'Total Open Jobs', metric: '142 Active', subText: '+12% from last week', iconName: 'Briefcase', colorClass: 'from-blue-600 to-indigo-700' },
      { id: 'wm-2', title: 'Installation Status', metric: '18 Pending', subText: '4 Overdue SLAs', iconName: 'ClipboardCheck', colorClass: 'from-amber-500 to-orange-600' },
      { id: 'wm-3', title: 'Warranty Service Status', metric: '34 On Track', subText: '100% SLA compliant', iconName: 'ShieldCheck', colorClass: 'from-emerald-500 to-teal-600' },
      { id: 'wm-4', title: 'Repair Status', metric: '28 In Progress', subText: '6 Waiting Warehouse Parts', iconName: 'Wrench', colorClass: 'from-rose-500 to-red-600' },
      { id: 'wm-5', title: 'Workshop Status', metric: '15 Bench Jobs', subText: 'Avg turnaround: 3.2 days', iconName: 'Cpu', colorClass: 'from-purple-600 to-indigo-600' },
      { id: 'wm-6', title: 'Calibration Status', metric: '21 ISO Due', subText: 'Traceability verified', iconName: 'Scale', colorClass: 'from-cyan-500 to-blue-600' },
      { id: 'wm-7', title: 'Monthly Revenue', metric: 'LKR 14.8M', subText: '94% of billing target', iconName: 'DollarSign', colorClass: 'from-emerald-600 to-emerald-800' },
      { id: 'wm-8', title: 'Department KPI', metric: '92.4% Avg', subText: 'Fleet uptime: 98.1%', iconName: 'Activity', colorClass: 'from-blue-500 to-blue-700' },
      { id: 'wm-9', title: 'Customer Satisfaction', metric: '4.85 / 5.0', subText: 'NPS Score: +74 Excellent', iconName: 'HeartHandshake', colorClass: 'from-pink-500 to-rose-600' },
      { id: 'wm-10', title: 'Overdue Jobs', metric: '7 Breached', subText: 'Requires manager intervention', iconName: 'AlertTriangle', colorClass: 'from-red-600 to-rose-700' },
      { id: 'wm-11', title: 'Pending Approvals', metric: '12 Quotes/POs', subText: 'Quotation sign-off queue', iconName: 'CheckCircle2', colorClass: 'from-amber-600 to-amber-800' },
      { id: 'wm-12', title: 'Emergency Jobs', metric: '3 Critical ICU', subText: 'Asiri Hospital Ventilators', iconName: 'Zap', colorClass: 'from-red-500 to-amber-600' }
    ]
  },
  'Documentation Officer': {
    roleName: 'Documentation Officer',
    tagline: 'Commercial Quotation & Archiving Ledger',
    widgets: [
      { id: 'do-1', title: 'Pending Installation Updates', metric: '9 Site Reports', subText: 'Awaiting customer sign-off scan', iconName: 'FileText', colorClass: 'from-purple-600 to-indigo-600' },
      { id: 'do-2', title: 'Pending Service Updates', metric: '14 Inspection Logs', subText: 'Ready for quote estimation', iconName: 'ClipboardCheck', colorClass: 'from-blue-500 to-cyan-600' },
      { id: 'do-3', title: 'Pending Quotations', metric: '11 Draft Quotes', subText: 'Avg approval speed: 4.5 hrs', iconName: 'FileSpreadsheet', colorClass: 'from-amber-500 to-orange-600' },
      { id: 'do-4', title: 'Pending PO Updates', metric: '8 Customer POs', subText: 'Awaiting invoice dispatch', iconName: 'Bookmark', colorClass: 'from-emerald-500 to-teal-600' },
      { id: 'do-5', title: 'Pending Invoice Updates', metric: '16 Tax Invoices', subText: 'LKR 4.2M unbilled cleared jobs', iconName: 'DollarSign', colorClass: 'from-emerald-600 to-emerald-800' },
      { id: 'do-6', title: 'Pending Workshop Deliveries', metric: '6 Delivery Notes', subText: 'Gate pass verification queue', iconName: 'Truck', colorClass: 'from-cyan-600 to-blue-700' },
      { id: 'do-7', title: 'Documentation KPI', metric: '96.5% SLA', subText: 'Zero missing report audits', iconName: 'Award', colorClass: 'from-indigo-600 to-purple-800' }
    ]
  },
  'Area Engineer': {
    roleName: 'Area Engineer',
    tagline: 'Field Mobile Service & Installation Hub',
    widgets: [
      { id: 'ae-1', title: 'Assigned Field Jobs', metric: '8 Active Site', subText: 'Western Province Sector A', iconName: 'Briefcase', colorClass: 'from-blue-600 to-blue-800' },
      { id: 'ae-2', title: 'Pending Assignments', metric: '3 New Dispatch', subText: 'Requires acceptance acknowledgment', iconName: 'Bell', colorClass: 'from-amber-500 to-amber-700' },
      { id: 'ae-3', title: 'Warranty Alerts', metric: '5 Expiry Alerts', subText: 'Convert to AMC contract leads', iconName: 'ShieldAlert', colorClass: 'from-purple-500 to-indigo-600' },
      { id: 'ae-4', title: 'Open Quotations', metric: '4 Parts Quotes', subText: 'Awaiting customer approval', iconName: 'FileText', colorClass: 'from-cyan-500 to-teal-600' },
      { id: 'ae-5', title: 'Generated Revenue', metric: 'LKR 2.4M', subText: 'Personal billing contribution', iconName: 'DollarSign', colorClass: 'from-emerald-600 to-teal-800' },
      { id: 'ae-6', title: 'Customer Satisfaction', metric: '4.92 / 5.0', subText: 'Based on 28 QR survey scans', iconName: 'HeartHandshake', colorClass: 'from-pink-500 to-rose-600' },
      { id: 'ae-7', title: 'Personal KPI Score', metric: '94.8% A+', subText: 'First time fix rate: 91%', iconName: 'Activity', colorClass: 'from-indigo-600 to-blue-700' },
      { id: 'ae-8', title: 'Emergency Breakdown', metric: '1 Urgent Site', subText: 'Nawaloka Hematology Analyzer', iconName: 'Zap', colorClass: 'from-red-600 to-rose-700' }
    ]
  },
  'Workshop Engineer': {
    roleName: 'Workshop Engineer',
    tagline: 'Offline Bench Diagnostics & PCB Micro-Workbench',
    widgets: [
      { id: 'we-1', title: 'Workshop Queue', metric: '7 Bench Units', subText: 'Nexera HPLC & GC systems', iconName: 'Cpu', colorClass: 'from-purple-600 to-indigo-700' },
      { id: 'we-2', title: 'Waiting Parts', metric: '4 Units Paused', subText: 'Spare detector lamp on order', iconName: 'Clock', colorClass: 'from-amber-500 to-orange-600' },
      { id: 'we-3', title: 'Ready For Delivery', metric: '3 Units Tested', subText: 'Awaiting courier collection', iconName: 'CheckCircle2', colorClass: 'from-emerald-500 to-teal-600' },
      { id: 'we-4', title: 'Delayed Repairs', metric: '1 Unit (>10 Days)', subText: 'Requires motherboard import', iconName: 'AlertTriangle', colorClass: 'from-rose-600 to-red-700' },
      { id: 'we-5', title: 'Bench KPI Score', metric: '91.2% Tier 1', subText: 'Component repair success: 88%', iconName: 'Activity', colorClass: 'from-blue-600 to-cyan-700' }
    ]
  },
  'Calibration Engineer': {
    roleName: 'Calibration Engineer',
    tagline: 'ISO 17025 Metrology Accreditation Center',
    widgets: [
      { id: 'ce-1', title: 'Calibration Jobs', metric: '12 Traceable', subText: 'Spectrophotometers & Balances', iconName: 'Scale', colorClass: 'from-emerald-600 to-teal-700' },
      { id: 'ce-2', title: 'Calibration Revenue', metric: 'LKR 3.1M', subText: 'High margin ISO certificates', iconName: 'DollarSign', colorClass: 'from-blue-600 to-indigo-700' },
      { id: 'ce-3', title: 'Calibration Due', metric: '8 Client Labs', subText: 'Annual compliance renewals', iconName: 'Calendar', colorClass: 'from-amber-500 to-orange-600' },
      { id: 'ce-4', title: 'Accreditation Timeline', metric: '140 Days Left', subText: 'SLAB ISO 17025 external audit', iconName: 'ShieldCheck', colorClass: 'from-purple-600 to-indigo-800' },
      { id: 'ce-5', title: 'ISO Compliance Rate', metric: '100% Valid', subText: 'Zero master weight drift error', iconName: 'CheckCircle2', colorClass: 'from-cyan-600 to-blue-800' },
      { id: 'ce-6', title: 'Metrology KPI Score', metric: '98.4% Rank #1', subText: 'Cert issuance avg: 24 hrs', iconName: 'Award', colorClass: 'from-emerald-500 to-emerald-800' }
    ]
  },
  'Technician': {
    roleName: 'Technician',
    tagline: 'Field Support & Bench Maintenance Workbench',
    widgets: [
      { id: 'tc-1', title: "Today's Tasks", metric: '4 Site Visits', subText: 'Assisting Eng. Cherub Weeratunge', iconName: 'Calendar', colorClass: 'from-teal-600 to-emerald-700' },
      { id: 'tc-2', title: 'Assigned Support Jobs', metric: '6 PM Services', subText: 'Filter cleaning & gas testing', iconName: 'Wrench', colorClass: 'from-blue-500 to-indigo-600' },
      { id: 'tc-3', title: 'Pending Unboxings', metric: '2 Shipments', subText: 'Workshop intake inspection', iconName: 'Package', colorClass: 'from-amber-500 to-amber-700' },
      { id: 'tc-4', title: 'Overdue Tasks', metric: '0 Clean Sheet', subText: 'All daily duties fulfilled', iconName: 'CheckCircle2', colorClass: 'from-emerald-500 to-teal-600' },
      { id: 'tc-5', title: 'Customer Feedback', metric: '4.80 / 5.0', subText: 'Polite assistance rating', iconName: 'HeartHandshake', colorClass: 'from-pink-500 to-rose-600' },
      { id: 'tc-6', title: 'Technician KPI Score', metric: '89.5% On Target', subText: 'Attendance & safety: 100%', iconName: 'Activity', colorClass: 'from-cyan-600 to-blue-700' }
    ]
  }
};

// PART 4: LEFT SIDEBAR NAVIGATION HIERARCHY
export interface V3NavItem {
  id: string;
  label: string;
  targetTab: string;
  rolesAllowed: string[]; // ['ALL'] or specific role list
}

export interface V3NavCategory {
  category: string;
  iconName: string;
  items: V3NavItem[];
}

export const V3_SIDEBAR_MENU: V3NavCategory[] = [
  {
    category: 'Dashboard',
    iconName: 'LayoutDashboard',
    items: [
      { id: 'nav-dash', label: 'Executive Dashboard', targetTab: 'dashboard', rolesAllowed: ['ALL'] }
    ]
  },
  {
    category: 'Operations',
    iconName: 'Wrench',
    items: [
      { id: 'nav-ops-ins', label: 'Installations', targetTab: 'installation', rolesAllowed: ['ALL'] },
      { id: 'nav-ops-wsv', label: 'Warranty Services', targetTab: 'service', rolesAllowed: ['ALL'] },
      { id: 'nav-ops-srv', label: 'Non Warranty Services', targetTab: 'service', rolesAllowed: ['ALL'] },
      { id: 'nav-ops-wrp', label: 'Warranty Repairs', targetTab: 'service', rolesAllowed: ['ALL'] },
      { id: 'nav-ops-wsj', label: 'Workshop Jobs', targetTab: 'service', rolesAllowed: ['ALL'] },
      { id: 'nav-ops-cal', label: 'Calibration Jobs', targetTab: 'calibration', rolesAllowed: ['ALL'] }
    ]
  },
  {
    category: 'Customers',
    iconName: 'Building2',
    items: [
      { id: 'nav-cust-1', label: 'Customer Organizations', targetTab: 'customers', rolesAllowed: ['ALL'] },
      { id: 'nav-cust-2', label: 'Laboratory Departments', targetTab: 'customers', rolesAllowed: ['ALL'] },
      { id: 'nav-cust-3', label: 'Clinical End Users', targetTab: 'customers', rolesAllowed: ['ALL'] }
    ]
  },
  {
    category: 'Assets',
    iconName: 'Microscope',
    items: [
      { id: 'nav-ast-1', label: 'Instrument Registry', targetTab: 'instruments', rolesAllowed: ['ALL'] },
      { id: 'nav-ast-2', label: 'Shimadzu Brand Fleet', targetTab: 'instruments', rolesAllowed: ['ALL'] },
      { id: 'nav-ast-3', label: 'Model Specifications', targetTab: 'instruments', rolesAllowed: ['ALL'] }
    ]
  },
  {
    category: 'Commercial',
    iconName: 'FileSpreadsheet',
    items: [
      { id: 'nav-com-1', label: 'Service Quotations', targetTab: 'service', rolesAllowed: ['Workshop Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'Senior Service Engineer', 'Senior Workshop Engineer'] },
      { id: 'nav-com-2', label: 'Purchase Orders (PO)', targetTab: 'service', rolesAllowed: ['Workshop Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'Senior Service Engineer', 'Senior Workshop Engineer'] },
      { id: 'nav-com-3', label: 'Tax Invoices', targetTab: 'service', rolesAllowed: ['Workshop Manager', 'Documentation Officer'] }
    ]
  },
  {
    category: 'Performance',
    iconName: 'Award',
    items: [
      { id: 'nav-perf-1', label: 'KPI Dashboard', targetTab: 'dashboard', rolesAllowed: ['ALL'] },
      { id: 'nav-perf-2', label: 'Monthly KPI Results', targetTab: 'v3_architecture', rolesAllowed: ['ALL'] },
      { id: 'nav-perf-3', label: 'Customer Satisfaction (CSAT)', targetTab: 'feedback', rolesAllowed: ['ALL'] }
    ]
  },
  {
    category: 'Administration',
    iconName: 'ShieldCheck',
    items: [
      { id: 'nav-adm-1', label: 'User Role Matrix (RBAC)', targetTab: 'users', rolesAllowed: ['Workshop Manager', 'Senior Biomedical Engineer', 'Senior Service Engineer', 'Senior Workshop Engineer', 'Calibration Engineer', 'Documentation Officer'] },
      { id: 'nav-adm-2', label: 'Territory Management', targetTab: 'territory', rolesAllowed: ['Workshop Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'Senior Service Engineer'] },
      { id: 'nav-adm-3', label: 'Workflow Status Engine', targetTab: 'v3_architecture', rolesAllowed: ['Workshop Manager', 'Senior Biomedical Engineer', 'Senior Service Engineer'] },
      { id: 'nav-adm-4', label: 'SLA Rule Engine', targetTab: 'v3_architecture', rolesAllowed: ['Workshop Manager', 'Senior Biomedical Engineer', 'Senior Service Engineer'] },
      { id: 'nav-adm-5', label: 'Notification Rule Engine', targetTab: 'v3_architecture', rolesAllowed: ['Workshop Manager', 'Documentation Officer'] },
      { id: 'nav-adm-6', label: 'V3 Enterprise Architecture Hub', targetTab: 'v3_architecture', rolesAllowed: ['ALL'] }
    ]
  },
  {
    category: 'Reports',
    iconName: 'FileText',
    items: [
      { id: 'nav-rep-1', label: 'Regulatory & Service Reports', targetTab: 'v3_architecture', rolesAllowed: ['ALL'] }
    ]
  }
];

// PART 5: APPROVAL WORKFLOW MATRIX
export interface V3ApprovalRule {
  workflowStage: string;
  initiatorRole: string;
  verifierRole: string;
  approverRole: string;
  slaTarget: string;
  description: string;
}

export const V3_APPROVAL_MATRIX: V3ApprovalRule[] = [
  { workflowStage: 'Inspection Validation', initiatorRole: 'Junior Service Eng / Tech', verifierRole: 'Service Engineer', approverRole: 'Area Engineer (Senior Eng)', slaTarget: '24 Hours', description: 'Field engineer audits technical breakdown findings before spare part quote request' },
  { workflowStage: 'Quotation Approval', initiatorRole: 'Documentation Officer', verifierRole: 'Senior Service Engineer', approverRole: 'Workshop Manager', slaTarget: '4 Hours', description: 'Commercial cost sheet verification against manufacturer spare part import landed cost' },
  { workflowStage: 'PO Verification', initiatorRole: 'Customer Procurement', verifierRole: 'Documentation Officer', approverRole: 'Documentation Officer', slaTarget: '2 Hours', description: 'Verify customer purchase order matches official quotation terms and item numbers' },
  { workflowStage: 'Invoice Verification', initiatorRole: 'Documentation Officer', verifierRole: 'Finance Audit', approverRole: 'Documentation Officer / Manager', slaTarget: '12 Hours', description: 'Tax invoice sign-off prior to dispatching final billing to customer finance division' },
  { workflowStage: 'Calibration Certificate', initiatorRole: 'Calibration Engineer', verifierRole: 'Senior Biomedical Engineer', approverRole: 'Calibration Engineer', slaTarget: '24 Hours', description: 'ISO 17025 traceable optical/mass measurement accuracy audit and seal stamping' },
  { workflowStage: 'Final Job Closure', initiatorRole: 'Area / Workshop Engineer', verifierRole: 'Documentation Officer', approverRole: 'Workshop Manager', slaTarget: '12 Hours', description: 'Confirm zero open spare part requisitions, signed service report, and customer CSAT QR scan' }
];

// PART 6: KPI VISIBILITY MATRIX
export interface V3KPIVisibility {
  roleCategory: string;
  exampleRoles: string[];
  canSeeOwnKPI: boolean;
  canSeeDeptKPI: boolean;
  canSeeTerritoryKPI: boolean;
  canSeeAllStaffKPI: boolean;
  description: string;
}

export const V3_KPI_VISIBILITY_MATRIX: V3KPIVisibility[] = [
  { roleCategory: 'Technicians & Trainees', exampleRoles: ['Technician', 'Trainee Technician', 'Trainee Engineer', 'Intern Technician'], canSeeOwnKPI: true, canSeeDeptKPI: false, canSeeTerritoryKPI: false, canSeeAllStaffKPI: false, description: 'Strictly isolated to individual task completion speed, attendance, and safety scores' },
  { roleCategory: 'Field & Bench Engineers', exampleRoles: ['Biomedical Eng', 'Service Eng', 'Workshop Eng', 'Junior Engs'], canSeeOwnKPI: true, canSeeDeptKPI: false, canSeeTerritoryKPI: true, canSeeAllStaffKPI: false, description: 'Sees personal score plus regional territory / workshop queue aggregate averages' },
  { roleCategory: 'Senior Engineers & Metrology', exampleRoles: ['Senior Biomedical Eng', 'Senior Service Eng', 'Senior Workshop Eng', 'Calibration Eng'], canSeeOwnKPI: true, canSeeDeptKPI: true, canSeeTerritoryKPI: true, canSeeAllStaffKPI: false, description: 'Sees departmental divisional performance matrices to mentor junior staff' },
  { roleCategory: 'Documentation Officer', exampleRoles: ['Documentation Officer'], canSeeOwnKPI: true, canSeeDeptKPI: true, canSeeTerritoryKPI: false, canSeeAllStaffKPI: false, description: 'Sees commercial quotation speed and PO archiving compliance metrics across organization' },
  { roleCategory: 'Workshop Manager & Directors', exampleRoles: ['Workshop Manager', 'Managing Director'], canSeeOwnKPI: true, canSeeDeptKPI: true, canSeeTerritoryKPI: true, canSeeAllStaffKPI: true, description: 'Unrestricted full visibility across all individual personnel, territories, and revenue targets' }
];

// PART 7: NOTIFICATION ROUTING MATRIX
export interface V3NotificationRoute {
  eventName: string;
  triggerCondition: string;
  primaryRecipients: string[];
  secondaryCC: string[];
  channel: string;
}

export const V3_NOTIFICATION_MATRIX: V3NotificationRoute[] = [
  { eventName: 'Installation Due', triggerCondition: '3 days prior to clinical site delivery date', primaryRecipients: ['Area Engineer'], secondaryCC: ['Assigned Technician', 'Workshop Manager'], channel: 'In-App + Mobile Push' },
  { eventName: 'Warranty Service Due', triggerCondition: '14 days prior to 6-month PM schedule', primaryRecipients: ['Area Engineer'], secondaryCC: ['Documentation Officer'], channel: 'In-App Alert' },
  { eventName: 'Repair Overdue (>5 Days)', triggerCondition: 'SLA target breached without job completion', primaryRecipients: ['Workshop Engineer', 'Area Engineer'], secondaryCC: ['Workshop Manager'], channel: 'Urgent Red Banner + Email' },
  { eventName: 'Calibration Due', triggerCondition: '30 days prior to ISO certificate expiry', primaryRecipients: ['Calibration Engineer'], secondaryCC: ['Documentation Officer', 'Customer Lab Head'], channel: 'Automated Email + In-App' },
  { eventName: 'Customer Complaint / Low CSAT', triggerCondition: 'Likert rating submitted < 3.0 stars', primaryRecipients: ['Workshop Manager'], secondaryCC: ['Area Engineer', 'Senior Service Eng'], channel: 'Immediate Priority Push + SMS' },
  { eventName: 'PO Received', triggerCondition: 'Customer uploads purchase order confirmation', primaryRecipients: ['Documentation Officer'], secondaryCC: ['Area Engineer', 'Service Engineer'], channel: 'In-App Commercial Queue' },
  { eventName: 'Warehouse Parts Received', triggerCondition: 'Procurement marks spare part as Landed', primaryRecipients: ['Workshop Engineer'], secondaryCC: ['Area Engineer'], channel: 'Bench Workbench Alert' }
];
