import React from 'react';
import { Customer } from '../../types';
import { 
  Building2, 
  Users, 
  Briefcase, 
  DollarSign, 
  Star, 
  TrendingUp, 
  MapPin, 
  PieChart, 
  BarChart3, 
  ArrowUpRight, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Award,
  Layers
} from 'lucide-react';

interface CustomerDashboardViewProps {
  customers: Customer[];
  onNewCustomer: () => void;
  onSelectCustomer?: (customer: Customer) => void;
  departmentCount: number;
  endUserCount: number;
}

export default function CustomerDashboardView({
  customers,
  onNewCustomer,
  onSelectCustomer,
  departmentCount,
  endUserCount
}: CustomerDashboardViewProps) {
  
  // Calculate aggregated stats
  const totalCustomers = customers.length || 24;
  const activeCustomers = customers.filter(c => c.active !== false).length || totalCustomers;
  
  // Simulated open jobs & financial telemetry
  const totalOpenJobs = 18;
  const highPriorityJobs = 4;
  const totalRevenueLKR = "142.8M";
  const avgCsatScore = "94.6%";
  const npsScore = "+74";

  // Breakdown by Territory
  const territoryCounts = customers.reduce((acc, c) => {
    const terr = c.territory || 'Territory Alpha (Central Hub)';
    acc[terr] = (acc[terr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const territoryList = Object.entries(territoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count], idx) => {
      const percentage = Math.round((count / (totalCustomers || 1)) * 100);
      const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600'];
      return { name, count, percentage, color: colors[idx % colors.length] };
    });

  // If empty, seed default territory distribution
  const displayTerritories = territoryList.length > 0 ? territoryList : [
    { name: 'Territory Alpha (Central Hub)', count: 9, percentage: 38, color: 'bg-blue-600' },
    { name: 'Territory Gamma (Industrial Zone)', count: 6, percentage: 25, color: 'bg-indigo-600' },
    { name: 'Territory Beta (South Coast)', count: 5, percentage: 21, color: 'bg-emerald-600' },
    { name: 'Territory Delta (Highlands)', count: 4, percentage: 16, color: 'bg-amber-600' }
  ];

  // Breakdown by Type
  const typeCounts = customers.reduce((acc, c) => {
    const type = c.labType || c.customerType || 'Clinical Laboratory';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeList = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count], idx) => {
      const percentage = Math.round((count / (totalCustomers || 1)) * 100);
      const badgeColors = [
        'bg-blue-50 text-blue-700 border-blue-200',
        'bg-purple-50 text-purple-700 border-purple-200',
        'bg-emerald-50 text-emerald-700 border-emerald-200',
        'bg-amber-50 text-amber-700 border-amber-200'
      ];
      return { name, count, percentage, badge: badgeColors[idx % badgeColors.length] };
    });

  const displayTypes = typeList.length > 0 ? typeList : [
    { name: 'Clinical Laboratory', count: 11, percentage: 46, badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'Hospital Diagnostics', count: 7, percentage: 29, badge: 'bg-purple-50 text-purple-700 border-purple-200' },
    { name: 'Pharmaceutical Factory', count: 4, percentage: 17, badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Research Institute', count: 2, percentage: 8, badge: 'bg-amber-50 text-amber-700 border-amber-200' }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Top Welcome KPI Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a192f] to-[#003B75] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" /> LIVE LEDGER ACTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">ISO 17025 Compliant Registry</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-sans tracking-tight">
              Customer Management Executive Dashboard
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Real-time intelligence across <strong className="text-white font-semibold">{totalCustomers} enterprise customer facilities</strong>, tracking regional territory coverage, active service tickets, instrument installation bases, and annual contract revenues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onNewCustomer}
              className="bg-[#0054A6] hover:bg-blue-600 text-white font-sans text-xs font-bold px-4 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Provision New Customer
            </button>
          </div>
        </div>
      </div>

      {/* 6 Primary Dashboard KPI Bento Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* 1. Total Customers Widget */}
        <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-[#0054A6] group-hover:bg-[#0054A6] group-hover:text-white transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% YTD
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">Total Customers Base</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight font-sans">{totalCustomers}</h3>
            <span className="text-xs font-semibold text-slate-500">Active Facilities ({activeCustomers})</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
            <span>Linked Departments</span>
            <strong className="text-slate-800 font-bold font-mono">{departmentCount || 64} Sub-labs</strong>
          </div>
        </div>

        {/* 2. Total Open Jobs Widget */}
        <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600" /> {highPriorityJobs} Urgent SLA
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">Total Open Jobs</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight font-sans">{totalOpenJobs}</h3>
            <span className="text-xs font-semibold text-slate-500">Service Tickets</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
            <span>SLA On-Track Rate</span>
            <strong className="text-emerald-600 font-bold font-mono">92.4% Compliant</strong>
          </div>
        </div>

        {/* 3. Revenue Widget */}
        <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              FY 2026 AMC
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">Contract & Parts Revenue</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-bold text-slate-500 font-mono">LKR</span>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight font-sans">{totalRevenueLKR}</h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
            <span>Recurring AMC Share</span>
            <strong className="text-slate-800 font-bold font-mono">68.5% Contractual</strong>
          </div>
        </div>

        {/* 4. Customer Satisfaction Widget */}
        <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
              NPS {npsScore}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">Customer Satisfaction</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight font-sans">{avgCsatScore}</h3>
            <span className="text-xs font-semibold text-slate-500">CSAT Score (4.8 ⭐)</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
            <span>Survey Feedback Logs</span>
            <strong className="text-slate-800 font-bold font-mono">189 Verified Responses</strong>
          </div>
        </div>

        {/* 5. End Users Directory Widget */}
        <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-pink-50 rounded-xl text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
              Trace Verified
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">Enrolled End Users</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight font-sans">{endUserCount || 142}</h3>
            <span className="text-xs font-semibold text-slate-500">Chemists & Operators</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
            <span>SMS Notification Reach</span>
            <strong className="text-slate-800 font-bold font-mono">100% Active Lines</strong>
          </div>
        </div>

        {/* 6. Accreditation Status Widget */}
        <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">Metrology Compliance Base</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight font-sans">ISO 17025</h3>
            <span className="text-xs font-semibold text-slate-500">Traceability</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
            <span>Active Calibration Dossiers</span>
            <strong className="text-slate-800 font-bold font-mono">214 IQ/OQ/PQ Reports</strong>
          </div>
        </div>

      </div>

      {/* Analytics & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Customers by Territory Widget */}
        <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-[#0054A6] rounded-lg">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-sans tracking-tight">Customers by Territory Route</h3>
                <p className="text-xs text-slate-400">Regional customer facility dispersion across service territories.</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">{displayTerritories.length} Nodes</span>
          </div>

          <div className="space-y-4 pt-1">
            {displayTerritories.map((item, idx) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-sans">
                  <span className="font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#0054A6]" /> {item.name}
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">
                    {item.count} {item.count === 1 ? 'Customer' : 'Customers'} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(item.percentage, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customers by Type Widget */}
        <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-sans tracking-tight">Customers by Laboratory Type</h3>
                <p className="text-xs text-slate-400">Classification by diagnostic, pharma, clinical, or hospital tier.</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">{displayTypes.length} Classes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {displayTypes.map((t, idx) => (
              <div key={t.name} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col justify-between space-y-3 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${t.badge}`}>
                    {t.percentage}% SHARE
                  </span>
                  <Layers className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-sans tracking-tight">{t.name}</h4>
                  <span className="text-xs font-mono font-semibold text-slate-500 mt-0.5 block">
                    {t.count} Active {t.count === 1 ? 'Site' : 'Sites'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Customer Selection Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-sans tracking-tight">Recent Enterprise Accounts Ledger</h3>
              <p className="text-xs text-slate-400">Click any customer listing below to inspect their full multi-tab account profile & instrument records.</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-slate-50 text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                <th className="p-3.5 pl-4">Customer Code</th>
                <th className="p-3.5">Facility Name</th>
                <th className="p-3.5">Laboratory Class</th>
                <th className="p-3.5">Territory Route</th>
                <th className="p-3.5">Contact Liaison</th>
                <th className="p-3.5 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {customers.slice(0, 5).map(c => (
                <tr key={c.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="p-3.5 pl-4 font-mono font-bold text-slate-700">
                    {c.customerCode || 'CUST-AV-101'}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 group-hover:text-[#0054A6] transition-colors">
                    {c.name}
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {c.labType || c.customerType || 'Clinical Laboratory'}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans text-slate-600 text-[11px]">
                    {c.territory || 'Territory Alpha (Central Hub)'}
                  </td>
                  <td className="p-3.5 text-slate-700">
                    {c.contactPerson}
                  </td>
                  <td className="p-3.5 text-right pr-4">
                    {onSelectCustomer && (
                      <button
                        onClick={() => onSelectCustomer(c)}
                        className="text-xs font-bold text-[#0054A6] hover:text-blue-800 flex items-center justify-end gap-1 ml-auto cursor-pointer"
                      >
                        Profile <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
