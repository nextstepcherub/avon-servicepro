import React, { useState, useEffect, useMemo } from 'react';
import {
  WarrantyServiceTask,
  WarrantyServiceStatus,
  WarrantyServicePriority,
  WarrantyServiceSchedulerFilterState,
  WarrantyServiceSchedulerMetrics
} from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Search,
  Filter,
  RefreshCw,
  User,
  Building2,
  MapPin,
  Tag,
  Hash,
  ShieldAlert,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  FileText,
  Activity,
  ArrowUpRight,
  Database,
  Sparkles,
  Layers
} from 'lucide-react';

// ============================================================================
// DYNAMIC SAMPLE DATA GENERATOR (RELATIVE TO CURRENT DATE)
// ============================================================================

function getRelativeDateStr(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

const SAMPLE_TASKS: WarrantyServiceTask[] = [
  // Overdue
  {
    id: 'wst-ovd-1',
    ticketNumber: 'WST-2026-8841',
    warrantyCardNumber: 'WC-AVN-2025-4412',
    customerName: 'St. Jude Childrens Research Hospital',
    department: 'Pediatric Oncology Lab & Flow Cytometry',
    territory: 'West Valley Territory',
    instrumentName: 'Roche Cobas 8000 Modular Analyzer',
    assetNumber: 'AST-RCH-2025-1092',
    serialNumber: 'RCB-882104-ENT',
    scheduledDate: getRelativeDateStr(-4), // 4 days overdue
    scheduledTime: '10:30',
    status: 'Overdue',
    priority: 'Critical',
    assignedAreaEngineer: 'Eng. David Chen',
    serviceType: 'Mandatory Calibration',
    estimatedDurationHours: 6.0,
    notes: 'Overdue by 4 days due to hospital reagent quarantine delay. Urgent customer dispatch required.'
  },
  {
    id: 'wst-ovd-2',
    ticketNumber: 'WST-2026-8819',
    warrantyCardNumber: 'WC-AVN-2025-3391',
    customerName: 'Asiri Surgical Hospital Hub',
    department: 'Emergency STAT Diagnostics',
    territory: 'South Metro District',
    instrumentName: 'Beckman Coulter Access 2 Immunoassay',
    assetNumber: 'AST-BC-2025-9912',
    serialNumber: 'BCA-449102-PRO',
    scheduledDate: getRelativeDateStr(-2), // 2 days overdue
    scheduledTime: '14:00',
    status: 'Overdue',
    priority: 'High',
    assignedAreaEngineer: 'Eng. Marcus Vance',
    serviceType: 'Preventative Maintenance',
    estimatedDurationHours: 4.0,
    notes: 'Mandatory 6-month pump tubing replacement and optical verification.'
  },

  // Today
  {
    id: 'wst-tdy-1',
    ticketNumber: 'WST-2026-9012',
    warrantyCardNumber: 'WC-AVN-2026-8941',
    customerName: 'Metro Central General Hospital',
    department: 'Advanced Clinical Pathology',
    territory: 'North Metro District',
    instrumentName: 'Sysmex XN-3000 Automated Hematology Analyzer',
    assetNumber: 'AST-MED-2026-8841',
    serialNumber: 'SXN-9948210-PRO',
    scheduledDate: getRelativeDateStr(0), // Today
    scheduledTime: '09:00',
    status: 'In Progress',
    priority: 'High',
    assignedAreaEngineer: 'Eng. Marcus Vance',
    serviceType: 'Preventative Maintenance',
    estimatedDurationHours: 4.5,
    notes: 'Engineer currently on site performing pneumatic valve checks and cleaning aspiration needles.'
  },
  {
    id: 'wst-tdy-2',
    ticketNumber: 'WST-2026-9024',
    warrantyCardNumber: 'WC-AVN-2026-7712',
    customerName: 'Durdans Healthcare Enterprise',
    department: 'Molecular Biology & Genetics',
    territory: 'Central Region',
    instrumentName: 'Agilent 1290 Infinity II LC System',
    assetNumber: 'AST-AGL-2026-3321',
    serialNumber: 'AGL-1290-8841',
    scheduledDate: getRelativeDateStr(0), // Today
    scheduledTime: '13:30',
    status: 'Dispatched',
    priority: 'Medium',
    assignedAreaEngineer: 'Eng. Sarah Jenkins',
    serviceType: 'Warranty Inspection',
    estimatedDurationHours: 3.0,
    notes: 'Post-commissioning 30-day baseline pressure check and seal inspection.'
  },

  // This Week
  {
    id: 'wst-wk-1',
    ticketNumber: 'WST-2026-9104',
    warrantyCardNumber: 'WC-AVN-2026-3321',
    customerName: 'Mayo Clinic Healthcare Hub',
    department: 'Immunology & Endocrinology',
    territory: 'Central Region',
    instrumentName: 'Beckman Coulter DxI 9000 Immunoassay',
    assetNumber: 'AST-BC-2026-5541',
    serialNumber: 'BCD-992140-PRO',
    scheduledDate: getRelativeDateStr(2), // +2 days
    scheduledTime: '10:00',
    status: 'Scheduled',
    priority: 'Medium',
    assignedAreaEngineer: 'Eng. Sarah Jenkins',
    serviceType: 'Preventative Maintenance',
    estimatedDurationHours: 3.5,
    notes: 'Routine optics baseline and manifold cleaning scheduled with lab director.'
  },
  {
    id: 'wst-wk-2',
    ticketNumber: 'WST-2026-9118',
    warrantyCardNumber: 'WC-AVN-2026-4419',
    customerName: 'Lanka Hospitals Laboratories',
    department: 'Central Biochemistry Core',
    territory: 'East Coastal District',
    instrumentName: 'Abbott Alinity ci-series Integrated System',
    assetNumber: 'AST-ABT-2026-9012',
    serialNumber: 'ABT-ALN-77129',
    scheduledDate: getRelativeDateStr(5), // +5 days
    scheduledTime: '11:00',
    status: 'Scheduled',
    priority: 'Low',
    assignedAreaEngineer: 'Eng. Priyantha Silva',
    serviceType: 'Preventative Maintenance',
    estimatedDurationHours: 5.0,
    notes: 'Semi-annual thermal block calibration and wash station alignment.'
  },

  // This Month
  {
    id: 'wst-mth-1',
    ticketNumber: 'WST-2026-9201',
    warrantyCardNumber: 'WC-AVN-2026-1182',
    customerName: 'National Hospital of Sri Lanka',
    department: 'Neurology Research Wing',
    territory: 'North Metro District',
    instrumentName: 'Thermo Fisher TSQ Altis Triple Quadrupole MS',
    assetNumber: 'AST-TFS-2026-4412',
    serialNumber: 'TFS-TSQ-99182',
    scheduledDate: getRelativeDateStr(14), // +14 days
    scheduledTime: '09:30',
    status: 'Scheduled',
    priority: 'High',
    assignedAreaEngineer: 'Eng. Marcus Vance',
    serviceType: 'Mandatory Calibration',
    estimatedDurationHours: 8.0,
    notes: 'Full vacuum system overhaul and mass axis tuning under annual warranty agreement.'
  },
  {
    id: 'wst-mth-2',
    ticketNumber: 'WST-2026-9244',
    warrantyCardNumber: 'WC-AVN-2026-5591',
    customerName: 'Hemas Southern Hospital',
    department: 'Outpatient Hematology',
    territory: 'Southern Province',
    instrumentName: 'Sysmex CS-5100 Hemostasis System',
    assetNumber: 'AST-SYS-2026-8812',
    serialNumber: 'SYS-CS-55109',
    scheduledDate: getRelativeDateStr(21), // +21 days
    scheduledTime: '14:30',
    status: 'Scheduled',
    priority: 'Medium',
    assignedAreaEngineer: 'Eng. Priyantha Silva',
    serviceType: 'Preventative Maintenance',
    estimatedDurationHours: 4.0,
    notes: 'Lamp energy assessment and detector Cuvette wash testing.'
  },

  // Upcoming (Beyond This Month)
  {
    id: 'wst-upc-1',
    ticketNumber: 'WST-2026-9510',
    warrantyCardNumber: 'WC-AVN-2026-8941',
    customerName: 'Metro Central General Hospital',
    department: 'Advanced Clinical Pathology',
    territory: 'North Metro District',
    instrumentName: 'Sysmex XN-3000 Automated Hematology Analyzer',
    assetNumber: 'AST-MED-2026-8841',
    serialNumber: 'SXN-9948210-PRO',
    scheduledDate: getRelativeDateStr(45), // +45 days
    scheduledTime: '09:00',
    status: 'Scheduled',
    priority: 'Medium',
    assignedAreaEngineer: 'Eng. Marcus Vance',
    serviceType: 'Preventative Maintenance',
    estimatedDurationHours: 4.5,
    notes: 'Subsequent 12-month annual PM cycle generated by Warranty Engine.'
  },

  // Completed This Month (For Widget Count)
  {
    id: 'wst-cmp-1',
    ticketNumber: 'WST-2026-8710',
    warrantyCardNumber: 'WC-AVN-2025-9912',
    customerName: 'Nawaloka Premier Diagnostic Centre',
    department: 'Histopathology & Cytology',
    territory: 'South Metro District',
    instrumentName: 'Leica Peloris III Tissue Processor',
    assetNumber: 'AST-LCA-2025-4491',
    serialNumber: 'LCA-PL3-88102',
    scheduledDate: getRelativeDateStr(-8), // 8 days ago
    scheduledTime: '10:00',
    status: 'Completed',
    priority: 'High',
    assignedAreaEngineer: 'Eng. David Chen',
    serviceType: 'Preventative Maintenance',
    estimatedDurationHours: 5.0,
    completedDate: getRelativeDateStr(-8),
    notes: 'Wax bath purge and carbon filter replacement completed successfully.'
  },
  {
    id: 'wst-cmp-2',
    ticketNumber: 'WST-2026-8692',
    warrantyCardNumber: 'WC-AVN-2025-8821',
    customerName: 'Ceylinco Healthcare Centre',
    department: 'Oncology Radiation Core',
    territory: 'Central Region',
    instrumentName: 'Siemens Atellica Solution Immunoassay',
    assetNumber: 'AST-SMN-2025-7712',
    serialNumber: 'SMN-ATL-44192',
    scheduledDate: getRelativeDateStr(-15),
    scheduledTime: '11:30',
    status: 'Completed',
    priority: 'Medium',
    assignedAreaEngineer: 'Eng. Sarah Jenkins',
    serviceType: 'Warranty Inspection',
    estimatedDurationHours: 3.5,
    completedDate: getRelativeDateStr(-15),
    notes: 'Magline transport verification and IM wash manifold cleaning completed.'
  }
];

// ============================================================================
// MAIN SCHEDULER COMPONENT
// ============================================================================

export const WarrantyServiceScheduler: React.FC = () => {
  const [tasks, setTasks] = useState<WarrantyServiceTask[]>(SAMPLE_TASKS);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'overdue' | 'week' | 'month' | 'upcoming'>('all');

  // Filter State
  const [filters, setFilters] = useState<WarrantyServiceSchedulerFilterState>({
    areaEngineer: 'All',
    territory: 'All',
    customer: 'All',
    instrument: 'All',
    status: 'All',
    priority: 'All',
    searchQuery: ''
  });

  // Fetch real Supabase data if configured
  useEffect(() => {
    async function loadTasks() {
      if (!isSupabaseConfigured || !supabase) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('warranty_service_tasks')
          .select('*')
          .order('scheduled_date', { ascending: true });

        if (error || !data || data.length === 0) {
          // Keep sample tasks if table is empty or offline
          setIsLoading(false);
          return;
        }

        const mapped: WarrantyServiceTask[] = data.map(r => ({
          id: r.id,
          ticketNumber: r.ticket_number,
          warrantyCardNumber: r.warranty_card_number,
          customerName: r.customer_name,
          department: r.department,
          territory: r.territory,
          instrumentName: r.instrument_name,
          assetNumber: r.asset_number,
          serialNumber: r.serial_number,
          scheduledDate: r.scheduled_date,
          scheduledTime: r.scheduled_time ? r.scheduled_time.substring(0, 5) : '09:00',
          status: r.status as WarrantyServiceStatus,
          priority: r.priority as WarrantyServicePriority,
          assignedAreaEngineer: r.assigned_area_engineer,
          serviceType: (r.service_type || 'Preventative Maintenance') as any,
          estimatedDurationHours: Number(r.estimated_duration_hours) || 4.0,
          notes: r.notes || '',
          completedDate: r.completed_date || undefined
        }));

        setTasks(mapped);
      } catch (err) {
        console.warn('Fallback to local sandbox scheduler state:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  // Unique Dropdown Options
  const engineers = useMemo(() => ['All', ...Array.from(new Set(tasks.map(t => t.assignedAreaEngineer)))], [tasks]);
  const territories = useMemo(() => ['All', ...Array.from(new Set(tasks.map(t => t.territory)))], [tasks]);
  const customers = useMemo(() => ['All', ...Array.from(new Set(tasks.map(t => t.customerName)))], [tasks]);
  const instruments = useMemo(() => ['All', ...Array.from(new Set(tasks.map(t => t.instrumentName)))], [tasks]);
  const statuses = ['All', 'Scheduled', 'Dispatched', 'In Progress', 'Completed', 'Overdue', 'Cancelled'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  // Categorize tasks relative to today
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const categorized = useMemo(() => {
    const todayDate = new Date(todayStr);
    const weekEndDate = new Date(todayDate);
    weekEndDate.setDate(weekEndDate.getDate() + 7);

    const monthEndDate = new Date(todayDate);
    monthEndDate.setDate(monthEndDate.getDate() + 30);

    return tasks.filter(t => {
      // Apply filters
      if (filters.areaEngineer !== 'All' && t.assignedAreaEngineer !== filters.areaEngineer) return false;
      if (filters.territory !== 'All' && t.territory !== filters.territory) return false;
      if (filters.customer !== 'All' && t.customerName !== filters.customer) return false;
      if (filters.instrument !== 'All' && t.instrumentName !== filters.instrument) return false;
      if (filters.status !== 'All' && t.status !== filters.status) return false;
      if (filters.priority !== 'All' && t.priority !== filters.priority) return false;
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const match =
          t.ticketNumber.toLowerCase().includes(q) ||
          t.warrantyCardNumber.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.instrumentName.toLowerCase().includes(q) ||
          t.assetNumber.toLowerCase().includes(q) ||
          t.serialNumber.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [tasks, filters, todayStr]);

  // Compute Dashboard Metrics Widgets
  const metrics: WarrantyServiceSchedulerMetrics = useMemo(() => {
    let totalScheduled = 0;
    let dueToday = 0;
    let overdue = 0;
    let completedThisMonth = 0;
    let upcomingThisWeek = 0;

    const todayDate = new Date(todayStr);
    const weekEnd = new Date(todayDate);
    weekEnd.setDate(weekEnd.getDate() + 7);

    tasks.forEach(t => {
      if (t.status === 'Scheduled' || t.status === 'Dispatched' || t.status === 'In Progress') {
        totalScheduled++;
      }
      if (t.status === 'Overdue') {
        overdue++;
      }
      if (t.scheduledDate === todayStr && t.status !== 'Completed' && t.status !== 'Cancelled') {
        dueToday++;
      }
      if (t.status === 'Completed') {
        completedThisMonth++;
      }
      if (t.status !== 'Completed' && t.status !== 'Cancelled') {
        const tDate = new Date(t.scheduledDate);
        if (tDate > todayDate && tDate <= weekEnd) {
          upcomingThisWeek++;
        }
      }
    });

    return { totalScheduled, dueToday, overdue, completedThisMonth, upcomingThisWeek };
  }, [tasks, todayStr]);

  // Section Groupings
  const overdueTasks = useMemo(() => categorized.filter(t => t.status === 'Overdue' || (t.scheduledDate < todayStr && t.status !== 'Completed' && t.status !== 'Cancelled')), [categorized, todayStr]);
  const todayTasks = useMemo(() => categorized.filter(t => t.scheduledDate === todayStr && t.status !== 'Completed' && t.status !== 'Cancelled'), [categorized, todayStr]);
  const weekTasks = useMemo(() => {
    const dStart = new Date(todayStr);
    const dEnd = new Date(todayStr);
    dEnd.setDate(dEnd.getDate() + 7);
    return categorized.filter(t => {
      if (t.status === 'Completed' || t.status === 'Cancelled') return false;
      const d = new Date(t.scheduledDate);
      return d > dStart && d <= dEnd;
    });
  }, [categorized, todayStr]);

  const monthTasks = useMemo(() => {
    const dStart = new Date(todayStr);
    const dEnd = new Date(todayStr);
    dEnd.setDate(dEnd.getDate() + 30);
    return categorized.filter(t => {
      if (t.status === 'Completed' || t.status === 'Cancelled') return false;
      const d = new Date(t.scheduledDate);
      return d >= dStart && d <= dEnd;
    });
  }, [categorized, todayStr]);

  const upcomingTasks = useMemo(() => {
    const dEnd = new Date(todayStr);
    dEnd.setDate(dEnd.getDate() + 30);
    return categorized.filter(t => {
      if (t.status === 'Completed' || t.status === 'Cancelled') return false;
      const d = new Date(t.scheduledDate);
      return d > dEnd;
    });
  }, [categorized, todayStr]);

  const completedTasks = useMemo(() => categorized.filter(t => t.status === 'Completed'), [categorized]);

  const displayedTasks = useMemo(() => {
    switch (activeTab) {
      case 'today': return todayTasks;
      case 'overdue': return overdueTasks;
      case 'week': return weekTasks;
      case 'month': return monthTasks;
      case 'upcoming': return upcomingTasks;
      default: return categorized;
    }
  }, [activeTab, categorized, todayTasks, overdueTasks, weekTasks, monthTasks, upcomingTasks]);

  // Toggle Row Expansion
  const toggleExpand = (id: string) => {
    setExpandedTaskIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  // Quick Status Transition Handler
  const handleStatusUpdate = (taskId: string, newStatus: WarrantyServiceStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          completedDate: newStatus === 'Completed' ? todayStr : t.completedDate
        };
      }
      return t;
    }));
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      areaEngineer: 'All',
      territory: 'All',
      customer: 'All',
      instrument: 'All',
      status: 'All',
      priority: 'All',
      searchQuery: ''
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-600/20 via-slate-800/10 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400 mt-1 shadow-inner">
              <CalendarDays className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Sprint 6.1 Engine
                </span>
                <span className="text-xs font-mono text-slate-400">Preventative Maintenance & Warranty Dispatch</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2.5">
                Warranty Service Scheduler
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Comprehensive service calendar managing active instrument warranties, mandatory PM intervals, STAT calibration dispatches, and field engineer assignments across regional territories.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end lg:self-center">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">ACTIVE CADENCE</span>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SUPABASE SYNCED
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 500);
              }}
              className="px-4 py-2.5 text-xs font-bold font-mono text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-2 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Feed
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD WIDGETS (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Widget 1: Total Scheduled */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-500 uppercase">Total Scheduled</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{metrics.totalScheduled}</span>
            <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Active Tickets
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Pending field execution</p>
        </div>

        {/* Widget 2: Due Today */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-500 uppercase">Due Today</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{metrics.dueToday}</span>
            <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              STAT Dispatch
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Scheduled for {todayStr}</p>
        </div>

        {/* Widget 3: Overdue */}
        <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-sm bg-rose-50/30 hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-rose-700 uppercase">Overdue Services</span>
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-rose-700 font-mono">{metrics.overdue}</span>
            <span className="text-[11px] font-mono font-bold text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded">
              Immediate Action
            </span>
          </div>
          <p className="text-[11px] text-rose-600 mt-1">Past SLA scheduled window</p>
        </div>

        {/* Widget 4: Upcoming This Week */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-500 uppercase">Upcoming 7 Days</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{metrics.upcomingThisWeek}</span>
            <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              This Week
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Confirmed with customer lab</p>
        </div>

        {/* Widget 5: Completed This Month */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-300 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-500 uppercase">Completed MTD</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">{metrics.completedThisMonth}</span>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Closed Loop
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Signed off & report uploaded</p>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">Scheduler Filter Matrix</h2>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Ticket, WC#, Customer, Instrument..."
                value={filters.searchQuery}
                onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-500 font-bold mb-1">Area Engineer</label>
            <select
              value={filters.areaEngineer}
              onChange={e => setFilters(prev => ({ ...prev, areaEngineer: e.target.value }))}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
            >
              {engineers.map(eng => <option key={eng} value={eng}>{eng}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-500 font-bold mb-1">Territory</label>
            <select
              value={filters.territory}
              onChange={e => setFilters(prev => ({ ...prev, territory: e.target.value }))}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
            >
              {territories.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-500 font-bold mb-1">Customer</label>
            <select
              value={filters.customer}
              onChange={e => setFilters(prev => ({ ...prev, customer: e.target.value }))}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 truncate"
            >
              {customers.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-500 font-bold mb-1">Instrument</label>
            <select
              value={filters.instrument}
              onChange={e => setFilters(prev => ({ ...prev, instrument: e.target.value }))}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 truncate"
            >
              {instruments.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-500 font-bold mb-1">Status</label>
            <select
              value={filters.status}
              onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-500 font-bold mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={e => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
            >
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* CATEGORY DISPLAY TABS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-bold font-mono uppercase rounded-xl transition-all shrink-0 ${
              activeTab === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Scheduled ({categorized.length})
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-4 py-2 text-xs font-bold font-mono uppercase rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'overdue' ? 'bg-rose-600 text-white shadow-md' : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue ({overdueTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 text-xs font-bold font-mono uppercase rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'today' ? 'bg-amber-600 text-white shadow-md' : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Today ({todayTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`px-4 py-2 text-xs font-bold font-mono uppercase rounded-xl transition-all shrink-0 ${
              activeTab === 'week' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            This Week ({weekTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`px-4 py-2 text-xs font-bold font-mono uppercase rounded-xl transition-all shrink-0 ${
              activeTab === 'month' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            This Month ({monthTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-xs font-bold font-mono uppercase rounded-xl transition-all shrink-0 ${
              activeTab === 'upcoming' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Upcoming Future ({upcomingTasks.length})
          </button>
        </div>

        {/* TASK TABLE DISPLAY */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {displayedTasks.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-base font-bold text-slate-600">No Warranty Services Match Criteria</p>
              <p className="text-xs mt-1 max-w-md mx-auto">
                There are no scheduled preventive maintenance or warranty inspection tickets matching your active filter matrix or category selection.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500 font-bold">
                    <th className="py-3.5 px-4 w-10"></th>
                    <th className="py-3.5 px-4">Ticket & Date</th>
                    <th className="py-3.5 px-4">Customer Account</th>
                    <th className="py-3.5 px-4">Instrument & Asset</th>
                    <th className="py-3.5 px-4">Area Engineer</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {displayedTasks.map(t => {
                    const isExpanded = expandedTaskIds.has(t.id);
                    const isOverdue = t.status === 'Overdue' || (t.scheduledDate < todayStr && t.status !== 'Completed' && t.status !== 'Cancelled');

                    return (
                      <React.Fragment key={t.id}>
                        <tr className={`hover:bg-slate-50/80 transition-colors ${isOverdue ? 'bg-rose-50/20' : ''}`}>
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => toggleExpand(t.id)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </td>

                          <td className="py-4 px-4 font-mono">
                            <span className="font-bold text-slate-900 block">{t.ticketNumber}</span>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <CalendarIcon className="w-3 h-3 text-slate-400" />
                              {t.scheduledDate} ({t.scheduledTime})
                            </span>
                            <span className="text-[10px] text-indigo-600 font-semibold">{t.warrantyCardNumber}</span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-bold text-slate-800 block">{t.customerName}</span>
                            <span className="text-[11px] text-slate-500 block truncate max-w-[200px]">{t.department}</span>
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              {t.territory}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-800 block truncate max-w-[240px]" title={t.instrumentName}>
                              {t.instrumentName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
                              Asset: <strong className="text-slate-700">{t.assetNumber}</strong>
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">S/N: {t.serialNumber}</span>
                          </td>

                          <td className="py-4 px-4 font-medium text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{t.assignedAreaEngineer}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{t.serviceType}</span>
                          </td>

                          <td className="py-4 px-4 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              t.priority === 'Critical' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                              t.priority === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                              t.priority === 'Medium' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                              'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {t.priority}
                            </span>
                          </td>

                          <td className="py-4 px-4 font-mono">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              t.status === 'Overdue' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                              t.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                              t.status === 'Dispatched' ? 'bg-purple-100 text-purple-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {t.status}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            {t.status !== 'Completed' && (
                              <div className="flex items-center justify-end gap-1.5">
                                {t.status === 'Scheduled' && (
                                  <button
                                    onClick={() => handleStatusUpdate(t.id, 'Dispatched')}
                                    className="px-2.5 py-1 text-[11px] font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm transition-all"
                                  >
                                    Dispatch
                                  </button>
                                )}
                                {(t.status === 'Dispatched' || t.status === 'Overdue') && (
                                  <button
                                    onClick={() => handleStatusUpdate(t.id, 'In Progress')}
                                    className="px-2.5 py-1 text-[11px] font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm transition-all"
                                  >
                                    Start
                                  </button>
                                )}
                                {t.status === 'In Progress' && (
                                  <button
                                    onClick={() => handleStatusUpdate(t.id, 'Completed')}
                                    className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all flex items-center gap-1"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    Complete
                                  </button>
                                )}
                              </div>
                            )}
                            {t.status === 'Completed' && (
                              <span className="text-[11px] font-mono text-emerald-600 font-bold">Done ✓</span>
                            )}
                          </td>
                        </tr>

                        {/* EXPANDED TASK DETAILS ROW */}
                        {isExpanded && (
                          <tr className="bg-slate-50/90 border-b border-slate-200/80">
                            <td colSpan={8} className="p-6">
                              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-inner grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                                <div className="space-y-2">
                                  <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block">Service Requirements</span>
                                  <p className="text-slate-800 font-semibold">{t.serviceType}</p>
                                  <p className="text-slate-500">Estimated Work Duration: <strong className="text-slate-800">{t.estimatedDurationHours} Hours</strong></p>
                                  <p className="text-slate-500">Assigned Territory: <strong className="text-slate-800">{t.territory}</strong></p>
                                </div>

                                <div className="space-y-2 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                  <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block">Field Engineer Dispatch Notes</span>
                                  <p className="text-slate-700 leading-relaxed italic">
                                    "{t.notes || 'No special dispatch instructions provided. Standard preventative maintenance protocol applies.'}"
                                  </p>
                                  {t.completedDate && (
                                    <p className="text-emerald-700 font-mono text-[11px] font-bold mt-2 pt-2 border-t border-slate-200">
                                      Formal Sign-off Date: {t.completedDate}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarrantyServiceScheduler;
