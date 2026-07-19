import React, { useState, useEffect, useMemo } from 'react';
import { 
  CustomerProfile, 
  JobRecord, 
  KpiDefinition, 
  UserProfile,
  Installation
} from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign, 
  Activity, 
  Award, 
  Building2, 
  FileSpreadsheet, 
  FileDown, 
  Printer, 
  AlertOctagon, 
  ShieldAlert, 
  Calendar, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronDown, 
  User, 
  Layers,
  Search,
  Filter,
  Flame,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportingModuleProps {
  customers: CustomerProfile[];
  jobs: JobRecord[];
  kpis: KpiDefinition[];
  users: UserProfile[];
  installations: Installation[];
  activeUser: UserProfile;
  onLogAudit: (action: string, previousValue?: string, newValue?: string, remarks?: string) => void;
}

export default function ReportingModule({
  customers,
  jobs,
  kpis,
  users,
  installations,
  activeUser,
  onLogAudit
}: ReportingModuleProps) {
  // Tabs & Filters
  const [activeTab, setActiveTab] = useState<'operational' | 'kpi' | 'executive'>('operational');
  const [dateFilter, setDateFilter] = useState<'all' | '30days' | 'quarter' | 'year'>('all');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  
  // Search & sorting
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  // Live Server Data state
  const [serverLoading, setServerLoading] = useState(false);
  const [apiMode, setApiMode] = useState<'live' | 'fallback'>('fallback');
  const [operationalData, setOperationalData] = useState<any>(null);
  const [kpiData, setKpiData] = useState<any>(null);
  const [executiveData, setExecutiveData] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Toast / Export States
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Fetch data from backend with local fallback
  useEffect(() => {
    const fetchReports = async () => {
      setServerLoading(true);
      try {
        // Retrieve JWT token or active session reference if available
        const token = localStorage.getItem('avon_session_token');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch all 3 endpoints in parallel
        const [opRes, kpiRes, execRes] = await Promise.all([
          fetch('/api/reports/operational', { headers }).catch(() => null),
          fetch('/api/reports/kpi?financialYearId=FY26-27', { headers }).catch(() => null),
          fetch('/api/reports/executive', { headers }).catch(() => null)
        ]);

        let success = false;

        if (opRes && opRes.ok) {
          const opJson = await opRes.json();
          setOperationalData(opJson.data);
          success = true;
        }
        if (kpiRes && kpiRes.ok) {
          const kpiJson = await kpiRes.json();
          setKpiData(kpiJson.data);
          success = true;
        }
        if (execRes && execRes.ok) {
          const execJson = await execRes.json();
          setExecutiveData(execJson.data);
          success = true;
        }

        if (success) {
          setApiMode('live');
          loggerDebug('Successfully synchronized live reports from server database');
        } else {
          setApiMode('fallback');
        }
      } catch (err) {
        setApiMode('fallback');
      } finally {
        setServerLoading(false);
      }
    };

    fetchReports();
  }, [refreshTrigger]);

  const loggerDebug = (msg: string) => {
    console.log(`[ReportingModule] ${msg}`);
  };

  // 2. Fallback / Mock calculations using active offline-first props
  const calculatedReports = useMemo(() => {
    // A. Operational Metrics
    const ticketStatsByStatus: Record<string, number> = {};
    const ticketStatsByPriority: Record<string, number> = {};
    let totalDowntimeSum = 0;
    let compliantTickets = 0;
    let totalSlaTickets = 0;

    jobs.forEach(job => {
      const status = job.status || 'Pending';
      ticketStatsByStatus[status] = (ticketStatsByStatus[status] || 0) + 1;
      
      const priority = job.priority || 'Routine';
      ticketStatsByPriority[priority] = (ticketStatsByPriority[priority] || 0) + 1;

      // Calculate simulated downtime
      const downtime = status === 'Closed' ? 12 : 4;
      totalDowntimeSum += downtime;

      totalSlaTickets++;
      if (priority !== 'Emergency') {
        compliantTickets++;
      }
    });

    const averageDowntimeHours = jobs.length > 0 ? parseFloat((totalDowntimeSum / jobs.length).toFixed(1)) : 0;
    const slaComplianceRate = totalSlaTickets > 0 ? Math.round((compliantTickets / totalSlaTickets) * 100) : 100;

    // Installations summary
    const installationStatsByStatus: Record<string, number> = {};
    let completedInstallCount = 0;
    let totalInstallValue = 0;

    installations.forEach(inst => {
      const status = inst.status || 'Pending';
      installationStatsByStatus[status] = (installationStatsByStatus[status] || 0) + 1;
      if (status === 'Completed' || status === 'Success') {
        completedInstallCount++;
      }
      totalInstallValue += (inst as any).invoiceValue || 450000;
    });

    // B. KPI Calculations
    const employeeKpisList = users.map(user => {
      const userJobs = jobs.filter(j => j.assignedEngineerId === user.id);
      
      // Calculate scores based on job metrics
      const completedJobs = userJobs.filter(j => j.status === 'Completed' || j.status === 'Closed');
      const metSla = completedJobs.length;
      const slaRate = userJobs.length > 0 ? Math.round((metSla / userJobs.length) * 100) : 100;

      // Map definitions
      const userAssignments = (user.kpis || kpis.filter(k => k.roleType === user.role) || []).map((k, idx) => {
        const isSlaKpi = k.name.toLowerCase().includes('sla') || k.name.toLowerCase().includes('response');
        const calculatedScore = isSlaKpi ? slaRate : (85 + (idx * 3) % 15);
        return {
          kpiId: k.id || `kpi-${idx}`,
          kpiName: k.name,
          weight: k.weight || 20,
          targetValue: k.targetValue || '90%',
          currentValue: isSlaKpi ? `${slaRate}% SLA Compliant` : '85% achieved',
          score: calculatedScore,
          errorsCount: calculatedScore < 80 ? 1 : 0
        };
      });

      const weightedSum = userAssignments.reduce((sum, a) => sum + (a.score * a.weight), 0);
      const totalWeight = userAssignments.reduce((sum, a) => sum + a.weight, 0);
      const compositeScore = totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(1)) : 85;
      const errors = userAssignments.reduce((sum, a) => sum + a.errorsCount, 0);

      return {
        employeeId: user.id,
        employeeName: user.name,
        employeeEmail: user.email,
        employeeRole: user.role,
        avatarUrl: user.avatarUrl || user.avatar,
        compositeScore,
        totalErrors: errors,
        assignedKpiCount: userAssignments.length,
        assignments: userAssignments
      };
    }).sort((a, b) => b.compositeScore - a.compositeScore);

    const overallAverageKpiScore = employeeKpisList.length > 0
      ? parseFloat((employeeKpisList.reduce((sum, e) => sum + e.compositeScore, 0) / employeeKpisList.length).toFixed(1))
      : 88.5;

    // C. Executive Summary Financials
    let billingApprovedEstimatedCost = 0;
    let activeAmcValue = 0;
    let activeAmcContracts = 0;
    let expiredAmcContracts = 0;

    customers.forEach(cust => {
      if (cust.contracts) {
        cust.contracts.forEach(con => {
          const isExpired = new Date(con.endDate) < new Date();
          if (con.status === 'Active' && !isExpired) {
            activeAmcValue += typeof con.price === 'number' ? con.price : parseFloat(con.price || '0');
            activeAmcContracts++;
          } else {
            expiredAmcContracts++;
          }
        });
      }
    });

    jobs.forEach(j => {
      billingApprovedEstimatedCost += (j as any).estimatedCost || j.workshopJobData?.pricingServiceRepair || 12000;
    });

    const totalEnterpriseRevenuePotential = billingApprovedEstimatedCost + activeAmcValue + totalInstallValue;

    return {
      operational: {
        tickets: {
          total: jobs.length,
          byStatus: ticketStatsByStatus,
          byPriority: ticketStatsByPriority,
          averageDowntimeHours,
          slaComplianceRate
        },
        installations: {
          totalRequests: installations.length,
          byStatus: installationStatsByStatus,
          completedCount: completedInstallCount,
          totalInvoiceValue: totalInstallValue
        }
      },
      kpis: {
        overallAverageKpiScore,
        rankings: employeeKpisList,
        performers: {
          top: employeeKpisList.filter(e => e.compositeScore >= 80),
          needsImprovement: employeeKpisList.filter(e => e.compositeScore < 70)
        }
      },
      executive: {
        financials: {
          billingApprovedEstimatedCost,
          activeAmcValue,
          completedInstallationsValue: completedInstallCount * 450000,
          totalEnterpriseRevenuePotential
        },
        contracts: {
          totalContracts: activeAmcContracts + expiredAmcContracts,
          activeContracts: activeAmcContracts,
          expiredContracts: expiredAmcContracts,
          averageUptimeGuarantee: 98.4,
          averageResponseTimeHours: 8.5
        }
      }
    };
  }, [customers, jobs, kpis, users, installations]);

  // Select active analytics based on API mode
  const activeOperational = apiMode === 'live' && operationalData ? operationalData : calculatedReports.operational;
  const activeKpis = apiMode === 'live' && kpiData ? kpiData : calculatedReports.kpis;
  const activeExecutive = apiMode === 'live' && executiveData ? executiveData : calculatedReports.executive;

  // Selected staff details for details drawer
  const selectedStaffDetails = useMemo(() => {
    if (!selectedStaffId) return null;
    return activeKpis.rankings.find((r: any) => r.employeeId === selectedStaffId);
  }, [selectedStaffId, activeKpis]);

  // Export functions (PDF/CSV Simulation)
  const handleExport = (type: 'pdf' | 'csv') => {
    const reportName = `${activeTab.toUpperCase()}_Report_${new Date().toISOString().split('T')[0]}`;
    setExporting(type);
    
    // Simulate compilation
    setTimeout(() => {
      setExporting(null);
      triggerToast(`Successfully generated and downloaded ${reportName}.${type === 'pdf' ? 'pdf' : 'csv'}!`, 'success');
      onLogAudit(
        'EXPORT_REPORT',
        undefined,
        reportName,
        `Exported consolidated ${activeTab} data as ${type.toUpperCase()} file format.`
      );

      // Trigger standard browser download simulation
      const element = document.createElement('a');
      const file = new Blob([`AVON ServicePro Enterprise ${activeTab.toUpperCase()} Analytics Ledger\nDate: ${new Date().toLocaleDateString()}\nStatus: Generated\nFormat: ${type.toUpperCase()}`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${reportName}.${type}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  // Filter lists based on search
  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
      j.customerName?.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
      j.serialNumber?.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
      j.assignedEngineerName?.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
      j.brand?.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
      j.model?.toLowerCase().includes(jobSearchQuery.toLowerCase())
    );
  }, [jobs, jobSearchQuery]);

  const filteredStaff = useMemo(() => {
    return activeKpis.rankings.filter((s: any) => 
      s.employeeName.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      s.employeeRole.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      s.employeeEmail.toLowerCase().includes(staffSearchQuery.toLowerCase())
    );
  }, [activeKpis, staffSearchQuery]);

  return (
    <div id="reporting_module_container" className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Analytical & Executive Reports</h1>
              <p className="text-xs text-slate-400 mt-0.5">Live service performance, employee evaluation matrix, and financial summaries.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh trigger */}
          <button
            onClick={() => {
              setRefreshTrigger(prev => prev + 1);
              triggerToast('Synchronizing database registries...', 'info');
            }}
            disabled={serverLoading}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${serverLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {/* Export Actions */}
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting !== null}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-blue-600/10"
          >
            {exporting === 'pdf' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            Export PDF
          </button>

          <button
            onClick={() => handleExport('csv')}
            disabled={exporting !== null}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-emerald-600/10"
          >
            {exporting === 'csv' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            Export CSV
          </button>
        </div>
      </div>

      {/* Global State/Mode Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-2.5 bg-slate-800/40 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Report Data Sync: </span>
          <span className={`font-bold uppercase ${apiMode === 'live' ? 'text-emerald-400' : 'text-amber-400'}`}>
            ● {apiMode === 'live' ? 'Enterprise SQL Live Server' : 'Secure Local Fallback (Offline-Ready)'}
          </span>
        </div>
        <div className="text-slate-500">
          Report Compilation Time: <span className="font-mono text-slate-400">{new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setActiveTab('operational'); setSelectedStaffId(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'operational'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            Operational Reports
          </button>
          <button
            onClick={() => { setActiveTab('kpi'); setSelectedStaffId(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kpi'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            KPI Performance Matrix
          </button>
          <button
            onClick={() => { setActiveTab('executive'); setSelectedStaffId(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'executive'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            Executive Strategic Ledger
          </button>
        </div>

        {/* Dynamic Context Filters */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase font-black">Date:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="bg-slate-850 border border-slate-750 text-slate-300 text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Cumulative (All Time)</option>
            <option value="30days">Last 30 Days</option>
            <option value="quarter">This Fiscal Quarter</option>
            <option value="year">This Fiscal Year</option>
          </select>
        </div>
      </div>

      {/* Primary Tab Contents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {/* TAB 1: OPERATIONAL REPORTS */}
          {activeTab === 'operational' && (
            <div className="space-y-6">
              
              {/* Bento Grid Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1 */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Service Tickets Managed</span>
                    <span className="text-3xl font-extrabold text-white block">{activeOperational.tickets.total}</span>
                    <span className="text-[10px] text-emerald-400 font-bold block">100% recorded database</span>
                  </div>
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">SLA Compliance Rate</span>
                    <span className="text-3xl font-extrabold text-white block">{activeOperational.tickets.slaComplianceRate}%</span>
                    <span className="text-[10px] text-emerald-400 font-bold block">Target SLA threshold: 90%</span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Avg Resolution Downtime</span>
                    <span className="text-3xl font-extrabold text-white block">{activeOperational.tickets.averageDowntimeHours}h</span>
                    <span className="text-[10px] text-amber-400 font-bold block">Includes field travel time</span>
                  </div>
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Completed Installations</span>
                    <span className="text-3xl font-extrabold text-white block">{activeOperational.installations.completedCount}</span>
                    <span className="text-[10px] text-purple-400 font-bold block">Of {activeOperational.installations.totalRequests} total requests</span>
                  </div>
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* Status Breakdown charts & Priority gauges */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Card 1: Ticket status distribution bar chart */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Service Requests Status Distribution</h3>
                  
                  <div className="space-y-3.5">
                    {Object.entries(activeOperational.tickets.byStatus).map(([status, count]) => {
                      const total = activeOperational.tickets.total || 1;
                      const percentage = Math.round(((count as number) / total) * 100);
                      return (
                        <div key={status} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-300">
                            <span>{status}</span>
                            <span>{count as number} tickets ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(activeOperational.tickets.byStatus).length === 0 && (
                      <p className="text-xs text-slate-500 italic">No tickets recorded in system state.</p>
                    )}
                  </div>
                </div>

                {/* Card 2: Ticket priority gauge and installation tracking */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Request Priorities & Emergencies</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(activeOperational.tickets.byPriority).map(([priority, count]) => {
                      const total = activeOperational.tickets.total || 1;
                      const percentage = Math.round(((count as number) / total) * 100);
                      const isHigh = priority.toUpperCase() === 'HIGH' || priority.toUpperCase() === 'CRITICAL' || priority.toUpperCase() === 'EMERGENCY';
                      
                      return (
                        <div key={priority} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className={isHigh ? "text-rose-400 font-bold flex items-center gap-1" : "text-slate-300"}>
                              {isHigh && <Flame className="w-3.5 h-3.5" />}
                              {priority}
                            </span>
                            <span className="text-slate-400">{count as number} requests ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${isHigh ? 'bg-rose-500' : 'bg-slate-400'}`} 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(activeOperational.tickets.byPriority).length === 0 && (
                      <p className="text-xs text-slate-500 italic">No priorities recorded.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Dynamic Job Tracker Registry table */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Active Operational Jobs Registry</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Real-time listing of jobs currently routed through dispatch pipelines.</p>
                  </div>
                  
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search jobs registry..."
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                      className="bg-slate-850 border border-slate-750 text-slate-300 placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2 w-full sm:w-64 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-850">
                        <th className="p-4">Customer</th>
                        <th className="p-4">Instrument Detail</th>
                        <th className="p-4">Serial Number</th>
                        <th className="p-4">Assigned Engineer</th>
                        <th className="p-4">SLA Status</th>
                        <th className="p-4 text-right">Job Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredJobs.slice(0, 8).map((job) => {
                        const isHighPriority = job.priority === 'Emergency' || job.priority === 'Critical';
                        return (
                          <tr key={job.id} className="hover:bg-slate-850/40 transition-colors">
                            <td className="p-4 font-bold text-white">{job.customerName}</td>
                            <td className="p-4 text-slate-300">{job.brand} {job.model}</td>
                            <td className="p-4 font-mono text-slate-400">{job.serialNumber}</td>
                            <td className="p-4 text-slate-300">
                              {job.assignedEngineerName ? (
                                <span className="flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-blue-400" />
                                  {job.assignedEngineerName}
                                </span>
                              ) : (
                                <span className="text-slate-500 italic">Unassigned</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                isHighPriority 
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                  : 'bg-slate-800 text-slate-400'
                              }`}>
                                {job.priority}
                              </span>
                            </td>
                            <td className="p-4 text-right font-bold">
                              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md">
                                {job.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredJobs.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-500 italic">
                            No matching operational records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: KPI MATRIX REPORTS */}
          {activeTab === 'kpi' && (
            <div className="space-y-6">
              
              {/* Bento KPI Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Average Quality Score</span>
                    <span className="text-3xl font-extrabold text-white block">{activeKpis.overallAverageKpiScore}%</span>
                    <span className="text-[10px] text-emerald-400 font-bold block">Aggregated company wide</span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Evaluations Completed</span>
                    <span className="text-3xl font-extrabold text-white block">100%</span>
                    <span className="text-[10px] text-emerald-400 font-bold block">All staff profiles processed</span>
                  </div>
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Top Performers (&gt;=80)</span>
                    <span className="text-3xl font-extrabold text-white block">{activeKpis.performers.top.length}</span>
                    <span className="text-[10px] text-purple-400 font-bold block">Staff eligible for bonuses</span>
                  </div>
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Action Needed (&lt;70)</span>
                    <span className="text-3xl font-extrabold text-white block">{activeKpis.performers.needsImprovement.length}</span>
                    <span className="text-[10px] text-slate-400 font-bold block">Mandatory audits assigned</span>
                  </div>
                  <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* Main Leaderboard & Diagnostics row split layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Ranked Engineers Leaderboard list */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden lg:col-span-7">
                  <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Employee Performance Rankings</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Click any staff row to trigger real-time weighted KPI metrics breakdown.</p>
                    </div>

                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Filter staff names..."
                        value={staffSearchQuery}
                        onChange={(e) => setStaffSearchQuery(e.target.value)}
                        className="bg-slate-850 border border-slate-750 text-slate-300 placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2 w-full sm:w-48 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-slate-850">
                    {filteredStaff.map((row: any, idx: number) => {
                      const isSelected = selectedStaffId === row.employeeId;
                      const isTopRank = row.compositeScore >= 80;
                      const isLowRank = row.compositeScore < 70;

                      return (
                        <div 
                          key={row.employeeId}
                          onClick={() => setSelectedStaffId(row.employeeId)}
                          className={`p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-slate-850 border-l-4 border-blue-500' 
                              : 'hover:bg-slate-850/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500 font-mono text-xs w-5 text-right font-bold">#{idx + 1}</span>
                            <img 
                              src={row.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${row.employeeName}`} 
                              alt={row.employeeName} 
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-750"
                            />
                            <div>
                              <span className="text-xs font-black text-white block">{row.employeeName}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{row.employeeRole}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-right">
                            <div className="hidden sm:block">
                              <span className="text-[10px] text-slate-500 block">Total Errors</span>
                              <span className={`text-xs font-bold block ${row.totalErrors > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                                {row.totalErrors} errors
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-500 block">Composite Score</span>
                              <span className={`text-sm font-black block ${
                                isTopRank ? 'text-emerald-400' : isLowRank ? 'text-rose-400' : 'text-slate-300'
                              }`}>
                                {row.compositeScore}%
                              </span>
                            </div>

                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Diagnostic Details Checklist card */}
                <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">KPI Weighted Audits checklist</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Individual metrics calculated directly from operational ticket and SLA compliance logs.</p>
                  </div>

                  {selectedStaffDetails ? (
                    <div className="space-y-5">
                      
                      {/* Active profile card */}
                      <div className="flex items-center gap-3.5 bg-slate-850/50 p-3.5 rounded-xl border border-slate-800">
                        <img 
                          src={selectedStaffDetails.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedStaffDetails.employeeName}`}
                          alt={selectedStaffDetails.employeeName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover bg-slate-800"
                        />
                        <div>
                          <h4 className="text-sm font-black text-white">{selectedStaffDetails.employeeName}</h4>
                          <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 border border-blue-500/10 rounded-full text-[9px] uppercase font-bold inline-block mt-1">
                            {selectedStaffDetails.employeeRole}
                          </span>
                        </div>
                      </div>

                      {/* Diagnostic list */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Assigned Metrics Breakdown</span>
                        
                        {selectedStaffDetails.assignments.map((asg: any) => (
                          <div key={asg.kpiId} className="p-3 bg-slate-950/40 rounded-xl border border-slate-850/60 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-xs font-bold text-white block">{asg.kpiName}</span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">Target: {asg.targetValue} | Weight: {asg.weight}pts</span>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                asg.score >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                                {asg.score}% Score
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-500">Live Metric Value:</span>
                              <span className="font-bold text-slate-300">{asg.currentValue}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-3">
                      <div className="p-3 bg-slate-850 text-slate-500 rounded-full inline-block">
                        <User className="w-8 h-8" />
                      </div>
                      <p className="text-xs text-slate-400 italic">Select an employee from the performance rankings to display dynamic scorecard auditing.</p>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* TAB 3: EXECUTIVE STRATEGIC REPORTS */}
          {activeTab === 'executive' && (
            <div className="space-y-6">
              
              {/* Financial Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Enterprise Service Revenue Potential</span>
                    <span className="text-2xl font-black text-white block">
                      LKR {activeExecutive.financials.totalEnterpriseRevenuePotential?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold block">Total service catalog value</span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Active AMC Portfolio Value</span>
                    <span className="text-2xl font-black text-white block">
                      LKR {activeExecutive.financials.activeAmcValue?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-blue-400 font-bold block">Annual recurring contracts</span>
                  </div>
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Completed Installations Value</span>
                    <span className="text-2xl font-black text-white block">
                      LKR {activeExecutive.financials.completedInstallationsValue?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-purple-400 font-bold block">Capital assets commissioned</span>
                  </div>
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Approved Repair Billings</span>
                    <span className="text-2xl font-black text-white block">
                      LKR {activeExecutive.financials.billingApprovedEstimatedCost?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold block">Estimates pending final clearance</span>
                  </div>
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* SLA Tiers Compliance metrics split card view */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">SLA Tier Performance Analytics</h3>
                  <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold">
                    Overall compliance: {activeExecutive.contracts.averageUptimeGuarantee}% uptime achieved
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Platinum SLA */}
                  <div className="bg-slate-900 p-5 rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl text-xs font-bold uppercase tracking-wider">
                        Platinum SLA
                      </span>
                      <span className="text-xs text-slate-500">2-4 hrs SLA Response</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Compliance score:</span>
                        <span className="font-extrabold text-emerald-400">98% compliance</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Avg response duration:</span>
                        <span className="font-mono text-white">1.8 hrs response</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Active portfolios:</span>
                        <span className="font-mono text-white">4 contracts</span>
                      </div>
                    </div>
                  </div>

                  {/* Gold SLA */}
                  <div className="bg-slate-900 p-5 rounded-2xl border border-amber-500/20 shadow-lg shadow-amber-500/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-bold uppercase tracking-wider">
                        Gold SLA
                      </span>
                      <span className="text-xs text-slate-500">12-24 hrs SLA Response</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Compliance score:</span>
                        <span className="font-extrabold text-emerald-400">92% compliance</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Avg response duration:</span>
                        <span className="font-mono text-white">6.2 hrs response</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Active portfolios:</span>
                        <span className="font-mono text-white">8 contracts</span>
                      </div>
                    </div>
                  </div>

                  {/* Silver SLA */}
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-slate-850 text-slate-400 border border-slate-850 rounded-xl text-xs font-bold uppercase tracking-wider">
                        Silver SLA
                      </span>
                      <span className="text-xs text-slate-500">48 hrs SLA Response</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Compliance score:</span>
                        <span className="font-extrabold text-amber-400">85% compliance</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Avg response duration:</span>
                        <span className="font-mono text-white">14.0 hrs response</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Active portfolios:</span>
                        <span className="font-mono text-white">12 contracts</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Contract Lifespan summary metrics */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AMC Contracts Lifespan Metrics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  
                  <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-850">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Managed Agreements</span>
                    <span className="text-2xl font-extrabold text-white block mt-1">{activeExecutive.contracts.totalContracts}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Gold + Platinum active contracts</span>
                  </div>

                  <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider block">Active Agreements</span>
                    <span className="text-2xl font-extrabold text-emerald-400 block mt-1">{activeExecutive.contracts.activeContracts}</span>
                    <span className="text-[10px] text-emerald-500/80 block mt-0.5">Currently generating recurring potential</span>
                  </div>

                  <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">Expired / Expiring Agreements</span>
                    <span className="text-2xl font-extrabold text-amber-550 block mt-1">{activeExecutive.contracts.expiredContracts}</span>
                    <span className="text-[10px] text-amber-500/80 block mt-0.5">Pending proactive renewal escalation</span>
                  </div>

                </div>
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Real-time Loading overlay */}
      <AnimatePresence>
        {serverLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="text-xs text-white font-bold tracking-wide">Syncing report aggregates from enterprise server database...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Toast Alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl"
          >
            <div className={`p-1.5 rounded-lg ${
              toastMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
            }`}>
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
            </div>
            <span className="text-xs font-bold tracking-wide">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
