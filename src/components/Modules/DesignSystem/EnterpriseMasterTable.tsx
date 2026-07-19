import React, { useState, useMemo } from 'react';
import { V4JobCard, V4_MOCK_JOBS, V4_SAVED_VIEWS } from '../../../data/designSystemV4Data';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  FileText,
  FileSpreadsheet,
  Columns3,
  Check,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  UserPlus,
  RefreshCw,
  AlertTriangle,
  Clock,
  Briefcase,
  Building2,
  Microscope,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';

interface EnterpriseMasterTableProps {
  onSelectJob?: (job: V4JobCard) => void;
}

export default function EnterpriseMasterTable({ onSelectJob }: EnterpriseMasterTableProps) {
  const [jobs, setJobs] = useState<V4JobCard[]>(V4_MOCK_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSavedView, setActiveSavedView] = useState<string>('ALL');
  
  // Sort
  const [sortField, setSortField] = useState<keyof V4JobCard>('createdDate');
  const [sortAsc, setSortAsc] = useState(false);

  // Filters
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [brandFilter, setBrandFilter] = useState<string>('ALL');

  // Column visibility
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
    ticket: true,
    customer: true,
    instrument: true,
    serial: true,
    issue: true,
    stage: true,
    priority: true,
    engineer: true,
    sla: true,
    revenue: true
  });
  const [showColMenu, setShowColMenu] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const toggleCol = (key: string) => {
    setVisibleCols(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredJobs.map(j => j.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Filter & Sort Pipeline
  const filteredJobs = useMemo(() => {
    let list = [...jobs];

    // Saved View Quick Filter
    if (activeSavedView === 'MY_JOBS') {
      list = list.filter(j => j.assignedEngineer.includes('Cherub'));
    } else if (activeSavedView === 'URGENT') {
      list = list.filter(j => j.priority === 'EMERGENCY' || j.slaRemainingHours < 0);
    } else if (activeSavedView === 'WAITING') {
      list = list.filter(j => j.stage === 'WAITING_PARTS');
    } else if (activeSavedView === 'PENDING_SIGNOFF') {
      list = list.filter(j => j.stage === 'COMPLETED');
    }

    // Dropdown Filters
    if (stageFilter !== 'ALL') list = list.filter(j => j.stage === stageFilter);
    if (priorityFilter !== 'ALL') list = list.filter(j => j.priority === priorityFilter);
    if (brandFilter !== 'ALL') list = list.filter(j => j.brand === brandFilter);

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(j => 
        j.ticketNumber.toLowerCase().includes(q) ||
        j.customerName.toLowerCase().includes(q) ||
        j.instrumentModel.toLowerCase().includes(q) ||
        j.serialNumber.toLowerCase().includes(q) ||
        j.issue.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        valA = (valA as string).toLowerCase();
        valB = (valB as string).toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [jobs, activeSavedView, stageFilter, priorityFilter, brandFilter, searchQuery, sortField, sortAsc]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredJobs.slice(start, start + rowsPerPage);
  }, [filteredJobs, currentPage, rowsPerPage]);

  const handleSort = (field: keyof V4JobCard) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const targetJobs = selectedIds.length > 0 ? jobs.filter(j => selectedIds.includes(j.id)) : filteredJobs;
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Ticket,Customer,Instrument,Serial,Stage,Priority,Engineer,SLA Remaining,Revenue"].join(",") + "\n"
      + targetJobs.map(j => `"${j.ticketNumber}","${j.customerName}","${j.instrumentModel}","${j.serialNumber}","${j.stage}","${j.priority}","${j.assignedEngineer}",${j.slaRemainingHours},${j.revenueEstimate}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AVON_ServicePro_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 p-5 text-left select-none">
      
      {/* Top Saved Views Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">Saved Views:</span>
          {V4_SAVED_VIEWS.map(sv => {
            const isSel = activeSavedView === sv.id;
            return (
              <button
                key={sv.id}
                onClick={() => { setActiveSavedView(sv.id); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSel 
                    ? 'bg-[#0054A6] text-white shadow-xs ring-2 ring-blue-300' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{sv.name}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${isSel ? 'bg-blue-900 text-cyan-300' : 'bg-slate-200 text-slate-700'}`}>
                  {sv.id === 'ALL' ? jobs.length : sv.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-2.5 animate-fade-in text-xs">
            <span className="font-bold font-mono text-amber-900">☑ {selectedIds.length} Selected</span>
            <button 
              onClick={() => {
                setJobs(prev => prev.map(j => selectedIds.includes(j.id) ? { ...j, stage: 'COMPLETED' } : j));
                setSelectedIds([]);
              }}
              className="px-2 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 cursor-pointer text-[11px]"
            >
              Mark Completed
            </button>
            <button 
              onClick={handleExportCSV}
              className="px-2 py-1 bg-[#0054A6] text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer text-[11px]"
            >
              Export Selected
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Global Search */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ticket, hospital, model, serial..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          {/* Stage Dropdown */}
          <select
            className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#0054A6]"
            value={stageFilter}
            onChange={e => { setStageFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Stages</option>
            <option value="PENDING">Pending Intake</option>
            <option value="ASSIGNED">Assigned Dispatch</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_PARTS">Waiting Parts</option>
            <option value="TESTING">Testing / QA</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Priority Dropdown */}
          <select
            className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#0054A6]"
            value={priorityFilter}
            onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Priorities</option>
            <option value="EMERGENCY">🚨 Emergency</option>
            <option value="HIGH">🔴 High Priority</option>
            <option value="MEDIUM">🟡 Medium Priority</option>
            <option value="LOW">🟢 Low Priority</option>
          </select>

          {/* Brand Dropdown */}
          <select
            className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#0054A6]"
            value={brandFilter}
            onChange={e => { setBrandFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Brands</option>
            <option value="SHIMADZU">SHIMADZU</option>
            <option value="THERMO SCIENTIFIC">THERMO SCIENTIFIC</option>
            <option value="AGILENT">AGILENT</option>
          </select>
        </div>

        {/* Right Tools: Column Visibility & Export Buttons */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          {/* Col Visibility Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowColMenu(!showColMenu)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <Columns3 className="w-4 h-4 text-slate-500" />
              <span>Columns</span>
            </button>

            {showColMenu && (
              <div className="absolute right-0 top-11 z-50 bg-white border border-slate-200 shadow-2xl rounded-2xl p-3 w-48 space-y-2 animate-fade-in">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400 pb-1 border-b">
                  Toggle Columns
                </div>
                {Object.keys(visibleCols).map(key => (
                  <label key={key} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={visibleCols[key]}
                      onChange={() => toggleCol(key)}
                      className="rounded text-[#0054A6]"
                    />
                    <span className="capitalize">{key === 'sla' ? 'SLA Timer' : key}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-[#0077C8] hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download CSV Landed Ledger"
          >
            <FileSpreadsheet className="w-4 h-4 text-cyan-200" />
            <span className="hidden sm:inline">Excel (CSV)</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Print Enterprise Report"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Data Grid Table Viewport */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#003B75] text-white text-xs font-mono font-bold uppercase tracking-wider divide-x divide-blue-800/80">
              <th className="p-3 pl-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filteredJobs.length}
                  onChange={handleSelectAll}
                  className="rounded text-[#0054A6] cursor-pointer"
                />
              </th>
              {visibleCols.ticket && (
                <th className="p-3 cursor-pointer hover:bg-[#00478F]" onClick={() => handleSort('ticketNumber')}>
                  <div className="flex items-center gap-1">
                    <span>Job Ticket</span>
                    <ArrowUpDown className="w-3 h-3 text-cyan-300" />
                  </div>
                </th>
              )}
              {visibleCols.customer && (
                <th className="p-3 cursor-pointer hover:bg-[#00478F]" onClick={() => handleSort('customerName')}>
                  <div className="flex items-center gap-1">
                    <span>Customer Hospital / Lab</span>
                    <ArrowUpDown className="w-3 h-3 text-cyan-300" />
                  </div>
                </th>
              )}
              {visibleCols.instrument && (
                <th className="p-3 cursor-pointer hover:bg-[#00478F]" onClick={() => handleSort('instrumentModel')}>
                  <div className="flex items-center gap-1">
                    <span>Instrument Model</span>
                    <ArrowUpDown className="w-3 h-3 text-cyan-300" />
                  </div>
                </th>
              )}
              {visibleCols.serial && <th className="p-3">Serial #</th>}
              {visibleCols.issue && <th className="p-3 w-56">Issue / Scope</th>}
              {visibleCols.stage && (
                <th className="p-3 cursor-pointer hover:bg-[#00478F]" onClick={() => handleSort('stage')}>
                  <div className="flex items-center gap-1">
                    <span>Stage</span>
                    <ArrowUpDown className="w-3 h-3 text-cyan-300" />
                  </div>
                </th>
              )}
              {visibleCols.priority && <th className="p-3 text-center">Priority</th>}
              {visibleCols.engineer && <th className="p-3">Assigned Staff</th>}
              {visibleCols.sla && <th className="p-3 text-center">SLA Countdown</th>}
              {visibleCols.revenue && <th className="p-3 text-right">Est. Rev (LKR)</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs font-medium">
            {paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-8 text-center text-slate-400 font-mono text-xs">
                  📭 No matching service jobs found matching current filter parameters.
                </td>
              </tr>
            ) : (
              paginatedJobs.map(job => {
                const isChecked = selectedIds.includes(job.id);
                return (
                  <tr 
                    key={job.id} 
                    className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${isChecked ? 'bg-amber-50/60' : 'bg-white'}`}
                    onClick={() => onSelectJob?.(job)}
                  >
                    <td className="p-3 pl-4 text-center" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(job.id)}
                        className="rounded text-[#0054A6] cursor-pointer"
                      />
                    </td>
                    {visibleCols.ticket && (
                      <td className="p-3 font-mono font-extrabold text-[#0054A6]">
                        {job.ticketNumber}
                      </td>
                    )}
                    {visibleCols.customer && (
                      <td className="p-3 font-bold text-slate-900">
                        <div>{job.customerName}</div>
                        <span className="text-[10px] text-slate-400 font-normal block truncate max-w-[180px]">{job.department}</span>
                      </td>
                    )}
                    {visibleCols.instrument && (
                      <td className="p-3">
                        <span className="font-bold text-slate-800">{job.instrumentModel}</span>
                        <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded ml-1.5 border">
                          {job.brand}
                        </span>
                      </td>
                    )}
                    {visibleCols.serial && (
                      <td className="p-3 font-mono text-slate-600 text-[11px]">
                        {job.serialNumber}
                      </td>
                    )}
                    {visibleCols.issue && (
                      <td className="p-3 text-slate-600 text-[11px] truncate max-w-[220px]" title={job.issue}>
                        {job.issue}
                      </td>
                    )}
                    {visibleCols.stage && (
                      <td className="p-3">
                        <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${
                          job.stage === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' :
                          job.stage === 'WAITING_PARTS' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          job.stage === 'COMPLETED' ? 'bg-teal-100 text-teal-800 border-teal-300' :
                          job.stage === 'CLOSED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {job.stage.replace('_', ' ')}
                        </span>
                      </td>
                    )}
                    {visibleCols.priority && (
                      <td className="p-3 text-center">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          job.priority === 'EMERGENCY' ? 'bg-red-600 text-white shadow-xs' :
                          job.priority === 'HIGH' ? 'bg-rose-100 text-rose-700 font-bold' :
                          job.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {job.priority}
                        </span>
                      </td>
                    )}
                    {visibleCols.engineer && (
                      <td className="p-3 font-medium text-slate-700 text-[11px]">
                        {job.assignedEngineer}
                      </td>
                    )}
                    {visibleCols.sla && (
                      <td className="p-3 text-center font-mono font-bold text-xs">
                        {job.slaRemainingHours < 0 ? (
                          <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {Math.abs(job.slaRemainingHours)}h OVERDUE
                          </span>
                        ) : job.slaRemainingHours <= 4 ? (
                          <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            ⏳ {job.slaRemainingHours}h Left
                          </span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {job.slaRemainingHours}h Safe
                          </span>
                        )}
                      </td>
                    )}
                    {visibleCols.revenue && (
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {job.revenueEstimate > 0 ? `LKR ${(job.revenueEstimate/1000).toFixed(0)}k` : '--'}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredJobs.length)} of <strong>{filteredJobs.length}</strong> records</span>
          <select
            className="bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-700"
            value={rowsPerPage}
            onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-1 font-mono">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 bg-blue-50 text-[#0054A6] font-bold rounded-lg border border-blue-200">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
