import React from 'react';
import { UserProfile, JobRecord, KpiDefinition, InstrumentAsset } from '../types';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Award, 
  Zap, 
  Layers, 
  TrendingUp, 
  Compass, 
  FileText, 
  HelpCircle,
  Wrench,
  Activity,
  Truck
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  activeUser: UserProfile;
  jobs: JobRecord[];
  kpis: KpiDefinition[];
  onSelectJob: (job: JobRecord) => void;
  onNavigateToTab: (tab: string) => void;
  assets?: InstrumentAsset[];
}

export default function Dashboard({ activeUser, jobs, kpis, onSelectJob, onNavigateToTab, assets }: DashboardProps) {
  // Calculate active PM alerts (within 1 month)
  const activePmAlerts = (assets || []).filter(asset => {
    const nextDateStr = asset.nextPmDate || asset.nextServiceDate;
    if (!nextDateStr) return false;
    const nextPmDate = new Date(nextDateStr);
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);
    return nextPmDate <= oneMonthFromNow;
  });

  // Calculate average supplier lead time for parts received
  const jobsWithLeadTime = jobs.filter(j => j.partsReceiving?.deliveryDate && j.timeline.some(t => t.status === 'Parts Ordered'));
  let avgLeadTimeText = "5.4 Days"; // standard default fallback
  if (jobsWithLeadTime.length > 0) {
    let totalDays = 0;
    jobsWithLeadTime.forEach(j => {
      const orderedStep = j.timeline.find(t => t.status === 'Parts Ordered');
      if (orderedStep && j.partsReceiving?.deliveryDate) {
        const orderDate = new Date(orderedStep.updatedAt);
        const deliveryDate = new Date(j.partsReceiving.deliveryDate);
        const diffTime = Math.abs(deliveryDate.getTime() - orderDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        totalDays += diffDays;
      }
    });
    const avg = (totalDays / jobsWithLeadTime.length).toFixed(1);
    avgLeadTimeText = `${avg} Days`;
  }
  // Filter jobs based on role responsibilities
  const isManager = activeUser.role === 'Workshop Manager' || activeUser.role === 'Service Manager';
  const isDocOfficer = activeUser.role === 'Documentation Officer';
  
  // Pending jobs to assign (only visible to Manager, Area Engineers, Workshop Engineers)
  const pendingToAssign = jobs.filter(j => j.status === 'Pending Assignment');
  
  // Emergency / Urgent Breakdown jobs
  const emergencyJobs = jobs.filter(j => j.priority === 'Emergency' && j.status !== 'Closed');

  // Personal assigned queue
  const myAssignedJobs = jobs.filter(j => 
    j.assignedEngineerId === activeUser.id && 
    j.status !== 'Closed' && 
    j.status !== 'Completed'
  );

  // Completed jobs count for achievement
  const myCompletedJobs = jobs.filter(j => 
    j.assignedEngineerId === activeUser.id && 
    (j.status === 'Completed' || j.status === 'Invoiced' || j.status === 'Closed')
  );

  // Active warranty alerts (within 1 month of due date)
  const activeWarrantyAlerts = jobs.filter(j => 
    j.jobType === 'Warranty Service' && 
    j.warrantyServiceData?.alertActive === true &&
    j.status !== 'Closed' &&
    j.status !== 'Completed'
  );

  // Active user's KPIs
  const myKpis = activeUser.kpis && activeUser.kpis.length > 0
    ? activeUser.kpis
    : kpis.filter(k => {
        if (activeUser.role.includes('Manager') || activeUser.role.includes('Senior') || activeUser.role.includes('Biomedical') || activeUser.role.includes('Service')) {
          return k.roleType === 'Engineer';
        } else if (activeUser.role.includes('Technician') || activeUser.role.includes('Intern')) {
          return k.roleType === 'Technician';
        } else if (activeUser.role === 'Documentation Officer') {
          return k.roleType === 'Coordinating Officer';
        } else if (activeUser.role.includes('Workshop Engineer')) {
          return k.roleType === 'Workshop Engineer';
        } else if (activeUser.role.includes('Calibration')) {
          return k.roleType === 'Calibration Engineer';
        }
        return k.roleType === 'Engineer';
      });

  // Calculate composite KPI achievement score
  const activeKpis = myKpis.filter(k => k.weight > 0);
  const totalActiveWeight = activeKpis.reduce((acc, k) => acc + k.weight, 0);
  const compositeKpiScore = totalActiveWeight > 0
    ? Math.round(activeKpis.reduce((acc, kpi) => acc + (kpi.score * kpi.weight), 0) / totalActiveWeight)
    : 0;

  // Outstanding Documentation updates (Pending warranty card updates or acceptance uploads)
  const docActionRequiredJobs = jobs.filter(j => {
    if (j.jobType === 'Installation' && j.status === 'Completed' && !j.installationData?.warrantyCardNumber) {
      return true; // Documentation officer needs to feed warranty card / service interval
    }
    if (j.jobType === 'Workshop Job' && j.status === 'Pending Assignment' && !j.workshopJobData?.acceptanceDate) {
      return true; // Awaiting acceptance review
    }
    return false;
  });

  // Color mappings
  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return 'bg-red-500/10 text-red-600 border-red-200 animate-pulse';
      case 'Urgent': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
  };

  return (
    <div id="dashboard_container" className="space-y-6">
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <img 
            src={activeUser.avatarUrl} 
            alt={activeUser.name} 
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full border-4 border-blue-50 object-cover" 
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Welcome back, {activeUser.name}
              <span className="text-xs font-mono font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                {activeUser.role}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Territory Duty: <span className="font-semibold text-slate-700">{activeUser.territory || 'National Headquarters'}</span>
            </p>
          </div>
        </div>

        {/* Aggregate KPI Scorecard Gauge */}
        <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
          <div className="relative flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="24" className="stroke-slate-200" strokeWidth="4" fill="transparent" />
              <circle cx="28" cy="28" r="24" className="stroke-blue-600 transition-all duration-500" strokeWidth="4" fill="transparent"
                strokeDasharray={150}
                strokeDashoffset={150 - (150 * compositeKpiScore) / 100}
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-800">{compositeKpiScore}%</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">KPI Rating</div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" /> 
              {compositeKpiScore >= 90 ? 'Outstanding Class' : compositeKpiScore >= 80 ? 'Service Standard' : 'Requires Review'}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Broadcast Channel */}
      {emergencyJobs.length > 0 && (
        <div id="emergency_broadcast" className="bg-[#EE4B2B] text-white p-5 rounded-2xl shadow-md border-l-8 border-red-500 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 text-white/5 pointer-events-none">
            <Zap className="w-64 h-64" />
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/10 rounded-xl mt-1">
              <Zap className="w-6 h-6 text-red-100 animate-bounce" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg tracking-tight">Active Emergency Breakdowns ({emergencyJobs.length})</h3>
              <p className="text-sm text-red-100">Urgent hospital bio-systems down. SLA triggers active. Requires immediate response.</p>
              
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {emergencyJobs.map(job => (
                  <div key={job.id} onClick={() => onSelectJob(job)} className="bg-white/10 hover:bg-white/15 transition-all p-3 rounded-xl border border-white/15 cursor-pointer flex justify-between items-center">
                    <div>
                      <span className="text-xs font-mono font-bold bg-red-700/50 px-2 py-0.5 rounded border border-red-500/30 text-white mr-2">
                        {job.id}
                      </span>
                      <span className="font-semibold text-sm text-white">{job.customerName}</span>
                      <p className="text-xs text-red-200 mt-0.5 truncate max-w-xs">{job.brand} {job.model} - {job.warrantyRepairData?.issueDescription || 'Power Loop Restart Failure'}</p>
                    </div>
                    <span className="text-xs font-mono bg-white text-red-700 font-bold px-2.5 py-1 rounded-lg shadow">
                      Dispatch
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Operational Metrics Row */}
      <div id="metric_grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Assigned Workload</span>
            <span className="text-3xl font-extrabold text-slate-800 block mt-1">{myAssignedJobs.length}</span>
            <span className="text-xs text-slate-500 block mt-1">Active field operations</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        {isManager && (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Needs Assignment</span>
              <span className="text-3xl font-extrabold text-slate-800 block mt-1">{pendingToAssign.length}</span>
              <span className="text-xs text-amber-600 font-semibold block mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> High priority queue
              </span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-650 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        )}

        {isDocOfficer && (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Docs Pending Update</span>
              <span className="text-3xl font-extrabold text-slate-800 block mt-1">{docActionRequiredJobs.length}</span>
              <span className="text-xs text-emerald-600 font-semibold block mt-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> High priority data sync
              </span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        )}

        {!isManager && !isDocOfficer && (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">My Completed Jobs</span>
              <span className="text-3xl font-extrabold text-slate-800 block mt-1">{myCompletedJobs.length}</span>
              <span className="text-xs text-blue-600 font-semibold block mt-1">LKR contribution logged</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-650 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        )}

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigateToTab('pm-scheduler')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Warranty & PM Alerts</span>
            <span className="text-3xl font-extrabold text-slate-800 block mt-1">{activeWarrantyAlerts.length + activePmAlerts.length}</span>
            <span className="text-xs text-slate-500 block mt-1">
              {activePmAlerts.length} PMs due within 30 days
            </span>
          </div>
          <div className={`p-3 rounded-xl ${(activeWarrantyAlerts.length + activePmAlerts.length) > 0 ? 'bg-red-50 text-red-650 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">NPS Score Rating</span>
            <span className="text-3xl font-extrabold text-slate-800 block mt-1">91.4%</span>
            <span className="text-xs text-emerald-600 font-medium block mt-1">Target exceeds 85%</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sprint 7.1 - Parts Procurement & Logistics KPI Panel */}
      <div id="parts_procurement_kpis" className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" /> Parts Receiving & Logistics Hub
          </h3>
          <span className="text-[10px] font-mono font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
            Quality & Safety Standard
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* 1. Awaiting Parts */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Parts</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-800">{jobs.filter(j => j.status === 'Awaiting Parts').length}</span>
              <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Procuring</span>
            </div>
          </div>

          {/* 2. Parts Received Today */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Received Today</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-700">
                {jobs.filter(j => 
                  j.status === 'Parts Received' || 
                  j.timeline.some(t => t.status === 'Parts Received' && t.updatedAt.startsWith(new Date().toISOString().split('T')[0]))
                ).length}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Today</span>
            </div>
          </div>

          {/* 3. Awaiting Replacement */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Replacement</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-red-600">{jobs.filter(j => j.status === 'Awaiting Replacement').length}</span>
              <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">Damaged</span>
            </div>
          </div>

          {/* 4. Ready For Repair */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ready For Repair</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-blue-700">{jobs.filter(j => j.status === 'Ready for Repair').length}</span>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">QA Clear</span>
            </div>
          </div>

          {/* 5. Average Supplier Lead Time */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs col-span-2 md:col-span-1 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Lead Time</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-indigo-700">{avgLeadTimeText}</span>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">International</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Workspace queues on left, personal target KPI monitors on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Priority Workspaces */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Personal Job queue */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">My Active On-Site & Repair Queue</h2>
              </div>
              <button 
                onClick={() => onNavigateToTab('jobs')} 
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Manage All Jobs →
              </button>
            </div>

            {myAssignedJobs.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No active dispatches on your schedule</p>
                <p className="text-xs text-slate-400 mt-0.5">Contact the Workshop Manager or browse pending assignments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myAssignedJobs.map(job => (
                  <div 
                    key={job.id} 
                    id={`active_queue_item_${job.id}`}
                    onClick={() => onSelectJob(job)}
                    className="p-4 bg-slate-50 hover:bg-blue-50/40 border border-slate-100 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded">
                          {job.id}
                        </span>
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {job.jobType}
                        </span>
                        <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${priorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mt-2">{job.customerName}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Device: <span className="font-semibold text-slate-700">{job.brand} {job.model}</span> (S/N: {job.serialNumber})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                        Status: <span className="text-blue-600">{job.status}</span>
                      </span>
                      <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow hover:bg-blue-700">
                        Update Workflow
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending assignments for supervisors / action updates for Doc Officer */}
          {isManager && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-500" />
                  Supervisor Console: Jobs Awaiting Assignment ({pendingToAssign.length})
                </h2>
              </div>

              {pendingToAssign.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">All inbound job requests assigned successfully</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pendingToAssign.slice(0, 4).map(job => (
                    <div 
                      key={job.id} 
                      onClick={() => onSelectJob(job)}
                      className="p-3 bg-amber-50/20 hover:bg-amber-50/50 border border-amber-100 rounded-xl cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          {job.id}
                        </span>
                        <span className="text-xs text-slate-500">{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mt-2 truncate">{job.customerName}</h4>
                      <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
                        <span>{job.jobType}</span>
                        <span className="font-semibold text-blue-700">Assign Member →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isDocOfficer && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Documentation Sync Queue ({docActionRequiredJobs.length})
                </h2>
              </div>

              {docActionRequiredJobs.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">All data points are fully indexed and up-to-date</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {docActionRequiredJobs.slice(0, 4).map(job => (
                    <div 
                      key={job.id} 
                      onClick={() => onSelectJob(job)}
                      className="p-3 bg-emerald-50/10 hover:bg-emerald-50/30 border border-emerald-100 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          {job.id}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm mt-1">{job.customerName}</h4>
                        <p className="text-xs text-slate-500">
                          {job.jobType === 'Installation' 
                            ? 'Update Warranty Card Number, Job Sheet # & next PM interval' 
                            : 'Upload Workshop Acceptance Report'
                          }
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-lg">
                        Fill Data →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Scorecard & Personal Weighted KPIs */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Duty KPIs</h2>
              <button 
                onClick={() => onNavigateToTab('kpis')} 
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Manage Sheets →
              </button>
            </div>

            <div className="space-y-4">
              {myKpis.map(kpi => {
                const isMeasured = kpi.weight > 0;
                return (
                  <div key={kpi.id} className={`space-y-1.5 ${isMeasured ? '' : 'opacity-60 bg-slate-50 p-2 rounded-xl border border-dashed border-slate-200'}`}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 truncate max-w-[180px]">{kpi.name}</span>
                      <span className="text-slate-400 font-mono font-bold">
                        {isMeasured ? `Wt: ${kpi.weight}%` : 'Not Measured'}
                      </span>
                    </div>
                    
                    {isMeasured ? (
                      <>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              kpi.score >= 90 ? 'bg-emerald-500' : kpi.score >= 75 ? 'bg-blue-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${kpi.score}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                          <span>Val: {kpi.currentValue}</span>
                          <span className={`font-bold ${
                            kpi.score >= 90 ? 'text-emerald-600' : kpi.score >= 75 ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            Score: {kpi.score}/100
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-[10px] text-slate-400 italic">This KPI metric is currently disabled for this staff member.</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 p-3 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-800 flex gap-1.5 items-start">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              <div>
                <span className="font-bold">Automatic Penalties:</span> Coordinating Officer marks are penalized 10-20 points per data/cash error. Technicians lose 5 marks per missing tool item.
              </div>
            </div>
          </div>

          {/* Quick SLA Health Gauge */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm border border-slate-800">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Department SLA Performance</h3>
            <div className="flex items-center gap-4 mt-3">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <div className="text-2xl font-black">94.8% <span className="text-xs text-emerald-400 font-medium">+1.2%</span></div>
                <p className="text-xs text-slate-400 mt-1">Average installation SLA: 11.2 days (Limit is 15 days)</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
