/**
 * AVON ServicePro V4 Enterprise UI/UX Design System Specification & Data
 * Company: AVON PHARMO CHEM (PVT) LTD SERVICE CENTRE
 * Platform: Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Supabase
 */

export interface V4ColorToken {
  name: string;
  hex: string;
  tailwindClass: string;
  usage: string;
}

export const V4_COLOR_SYSTEM: V4ColorToken[] = [
  { name: 'Primary', hex: '#0054A6', tailwindClass: 'bg-[#0054A6] text-white', usage: 'Top navbar, primary buttons, active states, brand headers' },
  { name: 'Secondary', hex: '#0077C8', tailwindClass: 'bg-[#0077C8] text-white', usage: 'Sidebar highlights, secondary actions, chart accents' },
  { name: 'Accent', hex: '#00AEEF', tailwindClass: 'bg-[#00AEEF] text-slate-900', usage: 'Badges, interactive hover borders, active indicator pills' },
  { name: 'Success', hex: '#22C55E', tailwindClass: 'bg-emerald-500 text-white', usage: 'Operational SLA met, completed sign-offs, positive CSAT' },
  { name: 'Warning', hex: '#F59E0B', tailwindClass: 'bg-amber-500 text-white', usage: 'Warranty expiry <= 30 days, pending quotations, waiting parts' },
  { name: 'Danger', hex: '#DC2626', tailwindClass: 'bg-red-600 text-white', usage: 'SLA breached, faulty instruments, emergency ICU breakdown' },
  { name: 'Background', hex: '#F5F8FC', tailwindClass: 'bg-[#F5F8FC]', usage: 'Application global workspace canvas backdrop' },
  { name: 'Card Surface', hex: '#FFFFFF', tailwindClass: 'bg-white border border-slate-200', usage: 'Widget containers, data tables, modal popups' },
  { name: 'Primary Text', hex: '#1E293B', tailwindClass: 'text-slate-800', usage: 'Headings, data table rows, primary labels' },
  { name: 'Secondary Text', hex: '#64748B', tailwindClass: 'text-slate-500', usage: 'Subtitles, metadata tags, disabled placeholders' }
];

export interface V4TypographyToken {
  level: string;
  fontFamily: string;
  sizeWeight: string;
  example: string;
}

export const V4_TYPOGRAPHY_SYSTEM: V4TypographyToken[] = [
  { level: 'Display Hero (H1)', fontFamily: 'Inter / Space Grotesk', sizeWeight: 'text-2xl md:text-3xl font-black tracking-tight', example: 'AVON ServicePro Operations Hub' },
  { level: 'Section Title (H2)', fontFamily: 'Inter Sans', sizeWeight: 'text-lg md:text-xl font-extrabold', example: 'Instrument Registry & Warranty Fleet' },
  { level: 'Card Header (H3)', fontFamily: 'Inter Sans', sizeWeight: 'text-sm font-bold text-slate-800', example: 'Total Active Field Assignments' },
  { level: 'Body Regular', fontFamily: 'Inter Sans', sizeWeight: 'text-xs font-medium text-slate-700', example: 'Scheduled preventive maintenance protocol under factory warranty.' },
  { level: 'Data & Codes (Mono)', fontFamily: 'JetBrains Mono', sizeWeight: 'text-[11px] font-mono font-bold text-[#0054A6]', example: 'SRV-2026-0894 | SHIMADZU-LC-2030C' },
  { level: 'Micro Labels', fontFamily: 'Inter / Mono', sizeWeight: 'text-[10px] uppercase tracking-wider font-semibold', example: 'SLA TARGET: 4 HOURS' }
];

export interface V4ShadcnMap {
  enterpriseFeature: string;
  shadcnComponent: string;
  tailwindCustomization: string;
}

export const V4_SHADCN_MAPPING: V4ShadcnMap[] = [
  { enterpriseFeature: 'Data Grid Master Table', shadcnComponent: '<Table> + <Pagination> + <DropdownMenu>', tailwindCustomization: 'Rounded-xl border-slate-200 divide-y header bg-[#003B75] text-white' },
  { enterpriseFeature: 'SLA Status Badges', shadcnComponent: '<Badge variant="outline">', tailwindCustomization: 'font-mono text-[10px] px-2.5 py-0.5 rounded-full border-2' },
  { enterpriseFeature: 'Quick Create Modal (+ New Job)', shadcnComponent: '<Dialog> + <DialogContent>', tailwindCustomization: 'max-w-2xl bg-white shadow-2xl rounded-2xl border-blue-500/20' },
  { enterpriseFeature: 'Dashboard KPI Widgets', shadcnComponent: '<Card> + <CardHeader> + <CardContent>', tailwindCustomization: 'bg-white hover:border-[#0054A6] transition-all shadow-xs' },
  { enterpriseFeature: 'Collapsible Left Sidebar', shadcnComponent: '<Sheet> (Mobile) + <Collapsible> (Desktop)', tailwindCustomization: 'bg-[#0054A6] text-white border-r border-[#0077C8]/30' },
  { enterpriseFeature: 'Job Stage Shifter (Kanban)', shadcnComponent: '<Tabs> + <ScrollArea> + <Card>', tailwindCustomization: 'bg-slate-100/80 p-3 rounded-xl border border-slate-200/80 min-h-[500px]' },
  { enterpriseFeature: 'Filter & Search Bar', shadcnComponent: '<Input> + <Select> + <Button>', tailwindCustomization: 'focus:ring-2 focus:ring-[#0054A6] text-xs font-medium bg-white' }
];

export interface V4NextFolder {
  path: string;
  description: string;
  type: 'dir' | 'file';
}

export const V4_NEXTJS_STRUCTURE: V4NextFolder[] = [
  { path: 'src/app/(auth)/login/page.tsx', description: 'Supabase SSR Auth login screen with AVON corporate branding', type: 'file' },
  { path: 'src/app/(dashboard)/layout.tsx', description: 'Enterprise shell containing TopNavbar, CollapsibleSidebar, and Breadcrumbs', type: 'file' },
  { path: 'src/app/(dashboard)/page.tsx', description: 'Executive role-based routing dashboard (Workshop Manager, Area Eng, Tech)', type: 'file' },
  { path: 'src/app/(dashboard)/operations/jobs/page.tsx', description: 'Master Kanban, Table, Calendar, and Gantt Timeline viewports', type: 'file' },
  { path: 'src/app/(dashboard)/operations/installations/[id]/page.tsx', description: '360° Installation Job detail page with IQ/OQ checklist & SLA tracker', type: 'file' },
  { path: 'src/app/(dashboard)/customers/[orgId]/page.tsx', description: 'Customer organization 360° profile with tabbed departments & fleet history', type: 'file' },
  { path: 'src/app/(dashboard)/assets/instruments/[serial]/page.tsx', description: 'Shimadzu instrument digital twin lifecycle profile & calibration audit logs', type: 'file' },
  { path: 'src/components/ui/*', description: 'Shadcn UI atomic components (button, card, dialog, table, tabs, sheet)', type: 'dir' },
  { path: 'src/lib/supabase/client.ts', description: 'Browser Supabase client with RLS token bearer injection', type: 'file' }
];

export interface V4JobCard {
  id: string;
  ticketNumber: string;
  customerName: string;
  department: string;
  instrumentModel: string;
  brand: string;
  serialNumber: string;
  issue: string;
  stage: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'TESTING' | 'COMPLETED' | 'CLOSED';
  priority: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedEngineer: string;
  createdDate: string;
  dueDate: string;
  slaRemainingHours: number;
  revenueEstimate: number;
}

export const V4_MOCK_JOBS: V4JobCard[] = [
  {
    id: 'job-1',
    ticketNumber: 'SRV-2026-0901',
    customerName: 'Asiri Surgical Hospital',
    department: 'Central Clinical Chemistry Lab',
    instrumentModel: 'Nexera LC-40DX3 HPLC',
    brand: 'SHIMADZU',
    serialNumber: 'L204058921',
    issue: 'Autosampler needle block error & pressure fluctuation',
    stage: 'IN_PROGRESS',
    priority: 'EMERGENCY',
    assignedEngineer: 'Cherub Weeratunge (Snr Eng)',
    createdDate: '2026-06-23 08:30',
    dueDate: '2026-06-23 16:30',
    slaRemainingHours: 2.5,
    revenueEstimate: 450000
  },
  {
    id: 'job-2',
    ticketNumber: 'INS-2026-0412',
    customerName: 'State Pharmaceuticals Corporation (SPC)',
    department: 'Quality Assurance Bio-Lab',
    instrumentModel: 'UV-1900i Spectrophotometer',
    brand: 'SHIMADZU',
    serialNumber: 'U190044812',
    issue: 'New system IQ/OQ commissioning & software calibration',
    stage: 'ASSIGNED',
    priority: 'HIGH',
    assignedEngineer: 'Cherub Weeratunge (Snr Eng)',
    createdDate: '2026-06-22 10:00',
    dueDate: '2026-06-25 17:00',
    slaRemainingHours: 18,
    revenueEstimate: 850000
  },
  {
    id: 'job-3',
    ticketNumber: 'WSJ-2026-0188',
    customerName: 'Hemas Hospital Thalawathugoda',
    department: 'Hematology & Pathology Div',
    instrumentModel: 'GCMS-QP2020 NX',
    brand: 'SHIMADZU',
    serialNumber: 'G202099310',
    issue: 'Ion source filament burnout & quadrupole cleaning',
    stage: 'WAITING_PARTS',
    priority: 'HIGH',
    assignedEngineer: 'K. S. Perera (Workshop Eng)',
    createdDate: '2026-06-20 14:15',
    dueDate: '2026-06-24 12:00',
    slaRemainingHours: -4, // Overdue
    revenueEstimate: 620000
  },
  {
    id: 'job-4',
    ticketNumber: 'CAL-2026-0309',
    customerName: 'Bureau of Industrial Standards (SLSI)',
    department: 'Metrology Reference Division',
    instrumentModel: 'AUW220D Analytical Balance',
    brand: 'SHIMADZU',
    serialNumber: 'B220411299',
    issue: 'ISO 17025 annual weight recalibration & certificate seal',
    stage: 'TESTING',
    priority: 'MEDIUM',
    assignedEngineer: 'D. M. Karunaratne (Cal Eng)',
    createdDate: '2026-06-21 09:00',
    dueDate: '2026-06-24 17:00',
    slaRemainingHours: 12,
    revenueEstimate: 185000
  },
  {
    id: 'job-5',
    ticketNumber: 'WSV-2026-0811',
    customerName: 'University of Colombo',
    department: 'Faculty of Medicine Biochemistry',
    instrumentModel: 'Prominence-i LC-2030C',
    brand: 'SHIMADZU',
    serialNumber: 'L203011409',
    issue: '6-Month factory warranty scheduled preventive maintenance',
    stage: 'PENDING',
    priority: 'LOW',
    assignedEngineer: 'Unassigned',
    createdDate: '2026-06-23 11:00',
    dueDate: '2026-06-28 17:00',
    slaRemainingHours: 48,
    revenueEstimate: 0
  },
  {
    id: 'job-6',
    ticketNumber: 'SRV-2026-0899',
    customerName: 'Lanka Hospitals Diagnostics',
    department: 'Molecular Biology Lab',
    instrumentModel: 'KingFisher Flex Extraction',
    brand: 'THERMO SCIENTIFIC',
    serialNumber: 'T77410023',
    issue: 'Magnetic head drive belt slip & sensor calibration',
    stage: 'COMPLETED',
    priority: 'HIGH',
    assignedEngineer: 'S. T. Fernando (Service Eng)',
    createdDate: '2026-06-21 08:00',
    dueDate: '2026-06-22 17:00',
    slaRemainingHours: 8,
    revenueEstimate: 340000
  },
  {
    id: 'job-7',
    ticketNumber: 'SRV-2026-0880',
    customerName: 'Durdans Hospital Colombo',
    department: 'Immunology & Endocrinology',
    instrumentModel: 'Agilent 6470B LC/TQ',
    brand: 'AGILENT',
    serialNumber: 'A647088912',
    issue: 'Roughing pump oil change & vacuum leak repair',
    stage: 'CLOSED',
    priority: 'MEDIUM',
    assignedEngineer: 'Cherub Weeratunge (Snr Eng)',
    createdDate: '2026-06-18 10:00',
    dueDate: '2026-06-20 17:00',
    slaRemainingHours: 15,
    revenueEstimate: 510000
  }
];

export const V4_KANBAN_COLUMNS = [
  { id: 'PENDING', label: '1. Pending Intake', color: 'border-slate-400 bg-slate-50', badge: 'bg-slate-200 text-slate-800' },
  { id: 'ASSIGNED', label: '2. Assigned Dispatch', color: 'border-blue-400 bg-blue-50/50', badge: 'bg-blue-100 text-blue-800' },
  { id: 'IN_PROGRESS', label: '3. In Progress (Site/Bench)', color: 'border-amber-400 bg-amber-50/50', badge: 'bg-amber-100 text-amber-800' },
  { id: 'WAITING_PARTS', label: '4. Waiting Warehouse Parts', color: 'border-rose-400 bg-rose-50/50', badge: 'bg-rose-100 text-rose-800' },
  { id: 'TESTING', label: '5. Testing / QA Signoff', color: 'border-purple-400 bg-purple-50/50', badge: 'bg-purple-100 text-purple-800' },
  { id: 'COMPLETED', label: '6. Completed (Unbilled)', color: 'border-teal-400 bg-teal-50/50', badge: 'bg-teal-100 text-teal-800' },
  { id: 'CLOSED', label: '7. Closed & Archived', color: 'border-emerald-500 bg-emerald-50/60', badge: 'bg-emerald-100 text-emerald-800' }
] as const;

export interface V4SavedView {
  id: string;
  name: string;
  count: number;
  filterDesc: string;
}

export const V4_SAVED_VIEWS: V4SavedView[] = [
  { id: 'ALL', name: 'All Enterprise Jobs', count: 142, filterDesc: 'Showing all active and historical service records' },
  { id: 'MY_JOBS', name: 'My Assigned Queue', count: 8, filterDesc: 'Assigned to Cherub Weeratunge' },
  { id: 'URGENT', name: 'Emergency & SLA Breached', count: 7, filterDesc: 'Priority = EMERGENCY or SLA Remaining < 0 hrs' },
  { id: 'WAITING', name: 'Waiting Warehouse Parts', count: 14, filterDesc: 'Stage = WAITING_PARTS (Requires procurement follow-up)' },
  { id: 'PENDING_SIGNOFF', name: 'Pending Manager Signoff', count: 12, filterDesc: 'Stage = COMPLETED (Ready for invoice generation)' }
];
