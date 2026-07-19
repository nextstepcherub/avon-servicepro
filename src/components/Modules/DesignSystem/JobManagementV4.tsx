import React, { useState } from 'react';
import { V4JobCard, V4_MOCK_JOBS, V4_KANBAN_COLUMNS } from '../../../data/designSystemV4Data';
import EnterpriseMasterTable from './EnterpriseMasterTable';
import {
  Kanban,
  TableProperties,
  CalendarDays,
  GanttChart,
  Plus,
  ArrowRight,
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  Building2,
  Wrench,
  ChevronRight
} from 'lucide-react';

export default function JobManagementV4() {
  const [activeSubView, setActiveSubView] = useState<'KANBAN' | 'TABLE' | 'CALENDAR' | 'TIMELINE'>('KANBAN');
  const [jobs, setJobs] = useState<V4JobCard[]>(V4_MOCK_JOBS);
  const [selectedJobModal, setSelectedJobModal] = useState<V4JobCard | null>(null);

  // Kanban stage shift handler
  const moveJobStage = (jobId: string, direction: 'NEXT' | 'PREV') => {
    setJobs(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      const stages = V4_KANBAN_COLUMNS.map(c => c.id);
      const currIdx = stages.indexOf(job.stage);
      const nextIdx = direction === 'NEXT' ? Math.min(currIdx + 1, stages.length - 1) : Math.max(currIdx - 1, 0);
      return { ...job, stage: stages[nextIdx] };
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in text-left select-none">
      
      {/* Viewport Switcher Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#0054A6]" />
            <span>360° Service & Calibration Job Management</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Enterprise multi-modal dispatch engine (Kanban, Data Grid, Dispatch Calendar, Gantt Timeline)
          </p>
        </div>

        {/* Sub-view switcher tabs */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveSubView('KANBAN')}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubView === 'KANBAN' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setActiveSubView('TABLE')}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubView === 'TABLE' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <TableProperties className="w-4 h-4" />
            <span>Master Table</span>
          </button>

          <button
            onClick={() => setActiveSubView('CALENDAR')}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubView === 'CALENDAR' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => setActiveSubView('TIMELINE')}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubView === 'TIMELINE' ? 'bg-[#0054A6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GanttChart className="w-4 h-4" />
            <span>Timeline</span>
          </button>
        </div>
      </div>

      {/* 1. KANBAN BOARD VIEW */}
      {activeSubView === 'KANBAN' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1600px] items-start">
            {V4_KANBAN_COLUMNS.map(col => {
              const colJobs = jobs.filter(j => j.stage === col.id);
              return (
                <div key={col.id} className="w-[300px] bg-slate-100/90 rounded-2xl border border-slate-200/80 flex flex-col max-h-[750px] shadow-xs shrink-0">
                  
                  {/* Column Header */}
                  <div className={`p-3.5 rounded-t-2xl border-b flex items-center justify-between font-bold text-xs ${col.color}`}>
                    <span className="text-slate-800 tracking-tight">{col.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${col.badge}`}>
                      {colJobs.length}
                    </span>
                  </div>

                  {/* Column Scroll Content */}
                  <div className="p-3 overflow-y-auto space-y-3 flex-1 min-h-[450px]">
                    {colJobs.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[11px] text-slate-400 font-mono">
                        No active jobs
                      </div>
                    ) : (
                      colJobs.map(job => (
                        <div 
                          key={job.id}
                          onClick={() => setSelectedJobModal(job)}
                          className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs hover:border-[#0054A6] transition-all cursor-pointer space-y-2.5 relative group"
                        >
                          {/* Top Priority Tag & Ticket */}
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-black text-[#0054A6]">
                              {job.ticketNumber}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                              job.priority === 'EMERGENCY' ? 'bg-red-600 text-white animate-pulse' :
                              job.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                              job.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {job.priority}
                            </span>
                          </div>

                          {/* Customer & Dept */}
                          <div className="text-xs font-bold text-slate-900 leading-tight">
                            {job.customerName}
                            <div className="text-[10px] text-slate-500 font-normal truncate mt-0.5">
                              🏥 {job.department}
                            </div>
                          </div>

                          {/* Instrument Info Pill */}
                          <div className="bg-slate-50 border border-slate-200/80 px-2 py-1 rounded-lg text-[11px] font-mono font-bold text-slate-700 flex items-center justify-between">
                            <span className="truncate max-w-[140px]">{job.instrumentModel}</span>
                            <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded">
                              {job.brand}
                            </span>
                          </div>

                          {/* Issue description snippet */}
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug">
                            {job.issue}
                          </p>

                          {/* Engineer & SLA remaining */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 truncate max-w-[110px]" title={job.assignedEngineer}>
                              👤 {job.assignedEngineer.split(' ')[0]}
                            </span>
                            <span className={`font-mono font-bold px-1.5 py-0.2 rounded ${
                              job.slaRemainingHours < 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {job.slaRemainingHours < 0 ? `${Math.abs(job.slaRemainingHours)}h OVER` : `${job.slaRemainingHours}h left`}
                            </span>
                          </div>

                          {/* Quick Stage Shifter Hover Bar */}
                          <div className="pt-2 flex items-center justify-between gap-1 opacity-90">
                            <button
                              disabled={col.id === 'PENDING'}
                              onClick={e => { e.stopPropagation(); moveJobStage(job.id, 'PREV'); }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded text-[10px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                              title="Shift backward"
                            >
                              <ArrowLeft className="w-3 h-3" /> Prev
                            </button>

                            <button
                              disabled={col.id === 'CLOSED'}
                              onClick={e => { e.stopPropagation(); moveJobStage(job.id, 'NEXT'); }}
                              className="px-2 py-1 bg-[#0054A6] hover:bg-blue-700 disabled:opacity-30 rounded text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer"
                              title="Advance to next stage"
                            >
                              Next <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>

                        </div>
                      ))
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TABLE VIEW */}
      {activeSubView === 'TABLE' && (
        <EnterpriseMasterTable onSelectJob={j => setSelectedJobModal(j)} />
      )}

      {/* 3. CALENDAR VIEW */}
      {activeSubView === 'CALENDAR' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Dispatch Schedule – June 2026</h3>
              <p className="text-xs text-slate-500">Service and calibration engineer field appointment grid</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Emergency</span>
              <span className="flex items-center gap-1 ml-3"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> In Progress</span>
              <span className="flex items-center gap-1 ml-3"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Assigned</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-slate-500 pb-2">
            <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
          </div>

          <div className="grid grid-cols-7 gap-2 min-h-[420px]">
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
              const dateStr = `2026-06-${day < 10 ? '0'+day : day}`;
              const dayJobs = jobs.filter(j => j.createdDate.startsWith(dateStr) || j.dueDate.startsWith(dateStr));
              return (
                <div key={day} className="border border-slate-200 rounded-xl p-2 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all text-left flex flex-col justify-between overflow-hidden">
                  <span className={`text-xs font-mono font-bold ${day === 23 ? 'bg-[#0054A6] text-white px-2 py-0.5 rounded-full self-start' : 'text-slate-600'}`}>
                    {day}
                  </span>
                  <div className="space-y-1 mt-2 flex-1 overflow-y-auto max-h-[80px]">
                    {dayJobs.map(j => (
                      <div 
                        key={j.id} 
                        onClick={() => setSelectedJobModal(j)}
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded truncate cursor-pointer text-white ${
                          j.priority === 'EMERGENCY' ? 'bg-red-600' : j.stage === 'IN_PROGRESS' ? 'bg-amber-600' : 'bg-[#0054A6]'
                        }`}
                        title={`${j.ticketNumber}: ${j.customerName}`}
                      >
                        {j.ticketNumber}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TIMELINE (GANTT) VIEW */}
      {activeSubView === 'TIMELINE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="border-b pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">Engineer Workload & Bench Gantt Timeline</h3>
              <p className="text-xs text-slate-500">Horizontal execution roadmap across AVON field staff</p>
            </div>
            <span className="text-xs bg-blue-50 text-[#0054A6] font-mono font-bold px-3 py-1 rounded-xl border border-blue-200">
              ⚡ Live SLA Sync Active
            </span>
          </div>

          <div className="space-y-4">
            {['Cherub Weeratunge (Snr Eng)', 'K. S. Perera (Workshop Eng)', 'D. M. Karunaratne (Cal Eng)', 'S. T. Fernando (Service Eng)'].map(eng => {
              const engJobs = jobs.filter(j => j.assignedEngineer === eng);
              return (
                <div key={eng} className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{eng}</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{engJobs.length} Assigned</span>
                  </div>

                  {/* Gantt Bar Track */}
                  <div className="h-10 bg-slate-200/70 rounded-xl relative overflow-hidden flex items-center px-2 gap-2">
                    {engJobs.length === 0 ? (
                      <span className="text-[11px] text-slate-400 font-mono italic">Bench available / No active dispatch</span>
                    ) : (
                      engJobs.map((j, idx) => (
                        <div
                          key={j.id}
                          onClick={() => setSelectedJobModal(j)}
                          className={`h-7 px-3 rounded-lg text-white font-mono text-[10px] font-bold flex items-center justify-between shadow-xs cursor-pointer truncate transition-transform hover:scale-102 ${
                            j.priority === 'EMERGENCY' ? 'bg-red-600 w-64' : j.stage === 'WAITING_PARTS' ? 'bg-rose-500 w-48' : 'bg-[#0054A6] w-56'
                          }`}
                        >
                          <span>{j.ticketNumber} ({j.brand})</span>
                          <span className="opacity-80 text-[9px]">SLA: {j.slaRemainingHours}h</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* JOB DETAIL INSPECTION MODAL */}
      {selectedJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 text-left relative overflow-hidden">
            <div className="h-2 bg-[#0054A6] absolute top-0 left-0 right-0"></div>
            
            <div className="flex items-start justify-between pt-1">
              <div>
                <span className="text-xs font-mono font-black text-[#0054A6] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {selectedJobModal.ticketNumber}
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-2">{selectedJobModal.customerName}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedJobModal.department}</p>
              </div>

              <button
                onClick={() => setSelectedJobModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-mono uppercase block text-[10px]">Instrument</span>
                <strong className="text-slate-800 text-sm">{selectedJobModal.instrumentModel}</strong>
                <div className="text-[11px] font-mono text-slate-500">SN: {selectedJobModal.serialNumber}</div>
              </div>

              <div>
                <span className="text-slate-400 font-mono uppercase block text-[10px]">SLA & Priority</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded">{selectedJobModal.priority}</span>
                  <span className="font-mono font-bold text-slate-700">{selectedJobModal.slaRemainingHours}h remaining</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Reported Technical Scope:</span>
              <p className="text-xs text-slate-700 font-medium bg-slate-100/80 p-3 rounded-xl border mt-1 leading-relaxed">
                {selectedJobModal.issue}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Assigned Specialist:</span>
                <strong className="text-slate-800">{selectedJobModal.assignedEngineer}</strong>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { moveJobStage(selectedJobModal.id, 'NEXT'); setSelectedJobModal(null); }}
                  className="px-4 py-2 bg-[#0054A6] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer text-xs"
                >
                  Advance Stage
                </button>
                <button
                  onClick={() => setSelectedJobModal(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl cursor-pointer text-xs"
                >
                  Close View
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
