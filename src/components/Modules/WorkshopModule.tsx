import React, { useState } from 'react';
import { JobRecord, UserProfile, AuditLogRecord, WorkflowTimelineStep, WorkshopJobWorkflowData } from '../../types';
import { MOCK_USERS } from '../../data/mockData';
import { 
  Wrench, 
  ClipboardCheck, 
  Activity, 
  CheckCircle, 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  PlusCircle, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface WorkshopModuleProps {
  activeUser: UserProfile;
  jobs: JobRecord[];
  onAddJob: (job: JobRecord) => void;
  onUpdateJob: (job: JobRecord) => void;
  customers: { name: string }[];
  users: UserProfile[];
  onLogAudit: (action: string, newValue: string, remarks: string) => void;
}

export default function WorkshopModule({
  activeUser,
  jobs,
  onAddJob,
  onUpdateJob,
  customers,
  users,
  onLogAudit
}: WorkshopModuleProps) {
  // Filter for only Workshop Jobs
  const workshopJobs = jobs.filter(j => j.jobType === 'Workshop Job');

  // Selected Job State
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    return workshopJobs.length > 0 ? workshopJobs[0].id : null;
  });

  const selectedJob = workshopJobs.find(j => j.id === selectedJobId) || null;

  // Active Sub-tab inside Workshop Operations Workspace
  const [activeSubTab, setActiveSubTab] = useState<'intake' | 'diagnosis' | 'repair' | 'qa' | 'release'>('intake');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Toggle Add New Intake Form Modal
  const [showNewIntakeModal, setShowNewIntakeModal] = useState(false);

  // New Intake Form States
  const [newCustomer, setNewCustomer] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newPriority, setNewPriority] = useState<'Routine' | 'Urgent' | 'Emergency'>('Routine');
  const [newContactName, setNewContactName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');
  const [newWarrantyStatus, setNewWarrantyStatus] = useState<'Warranty' | 'Non-Warranty'>('Non-Warranty');
  const [newPartsReceived, setNewPartsReceived] = useState('Main Unit, Power Cable');
  const [newDeliveryPerson, setNewDeliveryPerson] = useState('');
  const [newRemarks, setNewRemarks] = useState('');

  // Diagnostic Form States (for current selected job)
  const [diagSymptoms, setDiagSymptoms] = useState('');
  const [diagOutsideTrack, setDiagOutsideTrack] = useState(false);
  const [diagOutsideDetails, setDiagOutsideDetails] = useState('');
  const [diagOutsideReturn, setDiagOutsideReturn] = useState('');
  // Custom diagnostic measurements
  const [measName, setMeasName] = useState('');
  const [measValue, setMeasValue] = useState('');
  const [measurementsList, setMeasurementsList] = useState<{name: string, value: string}[]>([
    { name: 'Input Voltage', value: '230V AC' },
    { name: 'Laser Beam Power', value: '12.4 mW' },
    { name: 'Chamber Vacuum pressure', value: '0.04 mbar' }
  ]);

  // Repair Form States
  const [newRepairStep, setNewRepairStep] = useState('');
  const [partsImportRequired, setPartsImportRequired] = useState(false);
  const [partsImportDetails, setPartsImportDetails] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  // QA Form States
  const [qaResult, setQaResult] = useState<'Pass' | 'Fail' | 'Retest'>('Pass');
  const [qaHours, setQaHours] = useState(2);
  const [qaNotes, setQaNotes] = useState('');

  // Release Form States
  const [relDeliveryPerson, setRelDeliveryPerson] = useState('');
  const [relDispatchReport, setRelDispatchReport] = useState('');
  const [relDate, setRelDate] = useState(new Date().toISOString().split('T')[0]);

  // Determine stage eligibility classes
  const getStageStatus = (job: JobRecord, stage: 'intake' | 'diagnosis' | 'repair' | 'qa' | 'release') => {
    const status = job.status;
    if (stage === 'intake') return 'completed';
    
    if (stage === 'diagnosis') {
      if (status === 'Pending Assignment' || status === 'Job Received' || status === 'Assigned') return 'pending';
      return 'completed';
    }
    if (stage === 'repair') {
      if (status === 'Pending Assignment' || status === 'Job Received' || status === 'Assigned' || status === 'Inspection Assigned' || status === 'Inspection Done' || status === 'Inspected') return 'locked';
      if (status === 'Repair In Progress' || status === 'In Progress' || status === 'Ready for Repair') return 'pending';
      return 'completed';
    }
    if (stage === 'qa') {
      if (status === 'Completed' || status === 'QA' || status === 'Tested' || status === 'Ready For Delivery' || status === 'Delivered' || status === 'Invoiced' || status === 'Closed') {
        if (status === 'QA' || status === 'Tested') return 'pending';
        return 'completed';
      }
      return 'locked';
    }
    if (stage === 'release') {
      if (status === 'Ready For Delivery' || status === 'Delivered' || status === 'Invoiced' || status === 'Closed') {
        if (status === 'Ready For Delivery') return 'pending';
        return 'completed';
      }
      return 'locked';
    }
    return 'locked';
  };

  // Handle creating new intake job
  const handleCreateIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newBrand || !newModel || !newSerial) {
      alert('Please fill in Customer, Brand, Model and Serial Number');
      return;
    }

    const nowStr = new Date().toISOString();
    const jobId = `job-ws-${Date.now()}`;

    const intakeData: WorkshopJobWorkflowData = {
      acceptanceDate: nowStr,
      itemSerialNumber: newSerial,
      institute: newCustomer,
      departmentSection: 'Workshop Repair Division',
      contactName: newContactName || 'On-site Staff',
      contactNumber: newContactNumber || 'N/A',
      warrantyStatus: newWarrantyStatus,
      partsReceivedWithItem: newPartsReceived,
      takenByDeliveryPerson: newDeliveryPerson || 'HQ Courier Services',
      remarks: newRemarks,
      takenOutsideWorkshop: false,
      repairSteps: []
    };

    const newJob: JobRecord = {
      id: jobId,
      jobType: 'Workshop Job',
      status: 'Pending Assignment',
      priority: newPriority,
      customerName: newCustomer,
      brand: newBrand,
      model: newModel,
      serialNumber: newSerial,
      createdById: activeUser.id,
      createdByRole: activeUser.role,
      createdAt: nowStr,
      updatedAt: nowStr,
      timeline: [
        {
          status: 'Pending Assignment',
          updatedBy: activeUser.name,
          updatedAt: nowStr,
          remarks: `Workshop Intake Checked-in successfully. Serial Number: ${newSerial}. Warrant status: ${newWarrantyStatus}.`
        }
      ],
      workshopJobData: intakeData
    };

    onAddJob(newJob);
    onLogAudit('WORKSHOP_INTAKE', jobId, `Checked-in workshop job for ${newCustomer} - Serial ${newSerial}`);
    setSelectedJobId(jobId);
    setShowNewIntakeModal(false);

    // Reset Form
    setNewCustomer('');
    setNewBrand('');
    setNewModel('');
    setNewSerial('');
    setNewPriority('Routine');
    setNewContactName('');
    setNewContactNumber('');
    setNewPartsReceived('Main Unit, Power Cable');
    setNewDeliveryPerson('');
    setNewRemarks('');
  };

  // Perform Assignment to Engineer
  const handleAssignEngineer = (engId: string) => {
    if (!selectedJob) return;
    const selectedEng = users.find(u => u.id === engId);
    if (!selectedEng) return;

    const nowStr = new Date().toISOString();
    const updatedTimeline: WorkflowTimelineStep = {
      status: 'Assigned',
      updatedBy: activeUser.name,
      updatedAt: nowStr,
      remarks: `Assigned workshop job to engineer ${selectedEng.name}. Remarks: Initial repair bench diagnostics assigned.`
    };

    const updatedJob: JobRecord = {
      ...selectedJob,
      status: 'Assigned',
      assignedEngineerId: selectedEng.id,
      assignedEngineerName: selectedEng.name,
      updatedAt: nowStr,
      timeline: [updatedTimeline, ...selectedJob.timeline],
      workshopJobData: {
        ...(selectedJob.workshopJobData || {}),
        repairAssignedEngineerId: selectedEng.id,
        repairAssignedEngineerName: selectedEng.name
      } as WorkshopJobWorkflowData
    };

    onUpdateJob(updatedJob);
    onLogAudit('WORKSHOP_ASSIGN', selectedJob.id, `Assigned job ${selectedJob.id} to engineer ${selectedEng.name}`);
  };

  // Log Diagnostic Bench report
  const handleSaveDiagnosis = () => {
    if (!selectedJob) return;
    const nowStr = new Date().toISOString();

    const currentData = selectedJob.workshopJobData || {
      acceptanceDate: nowStr,
      itemSerialNumber: selectedJob.serialNumber,
      institute: selectedJob.customerName,
      departmentSection: 'HQ Workshop',
      contactName: 'N/A',
      contactNumber: 'N/A',
      warrantyStatus: 'Non-Warranty',
      partsReceivedWithItem: 'Main unit',
      takenByDeliveryPerson: 'Courier',
      takenOutsideWorkshop: false
    };

    const updatedData: WorkshopJobWorkflowData = {
      ...currentData,
      takenOutsideWorkshop: diagOutsideTrack,
      outsideDetails: diagOutsideDetails || undefined,
      outsideReturnDate: diagOutsideReturn || undefined,
      remarks: diagSymptoms || currentData.remarks
    };

    const updatedTimeline: WorkflowTimelineStep = {
      status: 'Inspection Done',
      updatedBy: activeUser.name,
      updatedAt: nowStr,
      remarks: `Diagnostic analysis complete on HQ Bench. Symptoms identified: ${diagSymptoms || 'N/A'}. Outside dispatch: ${diagOutsideTrack ? 'Yes' : 'No'}.`
    };

    const updatedJob: JobRecord = {
      ...selectedJob,
      status: 'Inspection Done',
      updatedAt: nowStr,
      timeline: [updatedTimeline, ...selectedJob.timeline],
      workshopJobData: updatedData
    };

    onUpdateJob(updatedJob);
    onLogAudit('WORKSHOP_DIAGNOSIS', selectedJob.id, `Logged fault diagnostics for serial ${selectedJob.serialNumber}`);
    setDiagSymptoms('');
    setDiagOutsideTrack(false);
    setDiagOutsideDetails('');
    setDiagOutsideReturn('');
  };

  // Add custom measurement
  const handleAddMeasurement = () => {
    if (!measName || !measValue) return;
    setMeasurementsList([...measurementsList, { name: measName, value: measValue }]);
    setMeasName('');
    setMeasValue('');
  };

  // Delete measurement
  const handleDeleteMeasurement = (index: number) => {
    setMeasurementsList(measurementsList.filter((_, i) => i !== index));
  };

  // Log dynamic Repair stage
  const handleSaveRepair = () => {
    if (!selectedJob) return;
    const nowStr = new Date().toISOString();

    const currentData = selectedJob.workshopJobData || {
      acceptanceDate: nowStr,
      itemSerialNumber: selectedJob.serialNumber,
      institute: selectedJob.customerName,
      departmentSection: 'HQ Workshop',
      contactName: 'N/A',
      contactNumber: 'N/A',
      warrantyStatus: 'Non-Warranty',
      partsReceivedWithItem: 'Main unit',
      takenByDeliveryPerson: 'Courier',
      takenOutsideWorkshop: false
    };

    const existingSteps = currentData.repairSteps || [];
    const updatedSteps = newRepairStep ? [...existingSteps, newRepairStep] : existingSteps;

    const updatedData: WorkshopJobWorkflowData = {
      ...currentData,
      repairSteps: updatedSteps,
      partsToImportRequired: partsImportRequired,
      partsToImportDetails: partsImportDetails || undefined
    };

    const nextStatus = partsImportRequired ? 'Awaiting Parts' : 'Repair Completed';

    const updatedTimeline: WorkflowTimelineStep = {
      status: nextStatus,
      updatedBy: activeUser.name,
      updatedAt: nowStr,
      remarks: `Repair activities logged. Action logged: ${newRepairStep || 'State progression update'}. Import parts required: ${partsImportRequired ? 'Yes' : 'No'}.`
    };

    const updatedJob: JobRecord = {
      ...selectedJob,
      status: nextStatus,
      updatedAt: nowStr,
      timeline: [updatedTimeline, ...selectedJob.timeline],
      workshopJobData: updatedData
    };

    onUpdateJob(updatedJob);
    onLogAudit('WORKSHOP_REPAIR', selectedJob.id, `Logged repair step: ${newRepairStep || 'Completed'}. Status: ${nextStatus}`);
    setNewRepairStep('');
  };

  // QA Check
  const handleSaveQA = () => {
    if (!selectedJob) return;
    const nowStr = new Date().toISOString();

    const currentData = selectedJob.workshopJobData || {
      acceptanceDate: nowStr,
      itemSerialNumber: selectedJob.serialNumber,
      institute: selectedJob.customerName,
      departmentSection: 'HQ Workshop',
      contactName: 'N/A',
      contactNumber: 'N/A',
      warrantyStatus: 'Non-Warranty',
      partsReceivedWithItem: 'Main unit',
      takenByDeliveryPerson: 'Courier',
      takenOutsideWorkshop: false
    };

    const updatedData: WorkshopJobWorkflowData = {
      ...currentData,
      testResult: qaResult,
      testHours: qaHours
    };

    const nextStatus = qaResult === 'Pass' ? 'Ready For Delivery' : 'Repair In Progress';

    const updatedTimeline: WorkflowTimelineStep = {
      status: nextStatus,
      updatedBy: activeUser.name,
      updatedAt: nowStr,
      remarks: `QA Verification Check completed by senior testing division. Result: ${qaResult}. Testing burn-in time: ${qaHours} Hours. Notes: ${qaNotes || 'N/A'}`
    };

    const updatedJob: JobRecord = {
      ...selectedJob,
      status: nextStatus,
      updatedAt: nowStr,
      timeline: [updatedTimeline, ...selectedJob.timeline],
      workshopJobData: updatedData
    };

    onUpdateJob(updatedJob);
    onLogAudit('WORKSHOP_QA', selectedJob.id, `Completed QA validation with outcome ${qaResult}`);
    setQaNotes('');
  };

  // Release/Dispatch Job
  const handleSaveRelease = () => {
    if (!selectedJob) return;
    const nowStr = new Date().toISOString();

    const currentData = selectedJob.workshopJobData || {
      acceptanceDate: nowStr,
      itemSerialNumber: selectedJob.serialNumber,
      institute: selectedJob.customerName,
      departmentSection: 'HQ Workshop',
      contactName: 'N/A',
      contactNumber: 'N/A',
      warrantyStatus: 'Non-Warranty',
      partsReceivedWithItem: 'Main unit',
      takenByDeliveryPerson: 'Courier',
      takenOutsideWorkshop: false
    };

    const updatedData: WorkshopJobWorkflowData = {
      ...currentData,
      deliveryPersonName: relDeliveryPerson || 'Authorized Handover Courier',
      deliveryDate: relDate,
      deliveryReportNumber: relDispatchReport || `AVN-DISP-${Date.now().toString().substring(6)}`
    };

    const updatedTimeline: WorkflowTimelineStep = {
      status: 'Closed',
      updatedBy: activeUser.name,
      updatedAt: nowStr,
      remarks: `Workshop job successfully released & dispatched. Handover person: ${relDeliveryPerson || 'Client representative'}. Delivery note: ${relDispatchReport || 'N/A'}. Ticket officially archived.`
    };

    const updatedJob: JobRecord = {
      ...selectedJob,
      status: 'Closed',
      updatedAt: nowStr,
      timeline: [updatedTimeline, ...selectedJob.timeline],
      workshopJobData: updatedData
    };

    onUpdateJob(updatedJob);
    onLogAudit('WORKSHOP_RELEASE', selectedJob.id, `Workshop item dispatched back to laboratory. Delivery Doc: ${relDispatchReport}`);
    setRelDeliveryPerson('');
    setRelDispatchReport('');
  };

  // Search and Filter Logic
  const filteredWorkshopJobs = workshopJobs.filter(job => {
    const matchesSearch = 
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || job.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner section */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg">
              <Wrench className="w-5 h-5 text-blue-400" />
            </span>
            <h1 className="text-xl font-bold font-sans tracking-tight">Workshop Operations & Bench Management</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time track micro-soldering, fault diagnostics, instrument intake, QA testing, and secure release procedures inside the AVON Central Service Center.
          </p>
        </div>
        <button
          onClick={() => setShowNewIntakeModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/15 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Workshop Intake
        </button>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Workshop Intake', count: workshopJobs.length, color: 'bg-slate-50 border-slate-100 text-slate-700' },
          { label: 'Pending Diagnoses', count: workshopJobs.filter(j => j.status === 'Pending Assignment' || j.status === 'Assigned').length, color: 'bg-amber-50/50 border-amber-100 text-amber-700' },
          { label: 'Under Repair', count: workshopJobs.filter(j => j.status === 'Ready for Repair' || j.status === 'Repair In Progress' || j.status === 'Awaiting Parts').length, color: 'bg-blue-50/50 border-blue-100 text-blue-700' },
          { label: 'QA Burn-in Testing', count: workshopJobs.filter(j => j.status === 'Tested' || j.status === 'QA').length, color: 'bg-emerald-50/50 border-emerald-100 text-emerald-700' },
          { label: 'Ready for Release', count: workshopJobs.filter(j => j.status === 'Ready For Delivery').length, color: 'bg-purple-50/50 border-purple-100 text-purple-700' },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl border ${stat.color} flex flex-col justify-between`}>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{stat.label}</span>
            <span className="text-2xl font-extrabold mt-2 tracking-tight">{stat.count}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column - Filter & Jobs Registry Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Workshop Job Registry</h3>
            
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search serial, brand, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 font-medium"
              />
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none text-slate-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Assignment">Pending Assignment</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Inspection Done">Inspection Done</option>
                  <option value="Awaiting Parts">Awaiting Parts</option>
                  <option value="Repair Completed">Repair Completed</option>
                  <option value="Ready For Delivery">Ready for Delivery</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none text-slate-700"
                >
                  <option value="All">All Priorities</option>
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            {/* Jobs Stack List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-100">
              {filteredWorkshopJobs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  No matching workshop records found
                </div>
              ) : (
                filteredWorkshopJobs.map(job => {
                  const isSelected = selectedJobId === job.id;
                  const priorityColor = 
                    job.priority === 'Emergency' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                    job.priority === 'Urgent' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                    'bg-slate-100 text-slate-600 border-slate-200';
                  
                  const statusColors: Record<string, string> = {
                    'Pending Assignment': 'bg-slate-100 text-slate-600',
                    'Assigned': 'bg-blue-50 text-blue-600 border-blue-100',
                    'Inspection Done': 'bg-amber-50 text-amber-600 border-amber-100',
                    'Awaiting Parts': 'bg-red-50 text-red-600 border-red-100',
                    'Repair Completed': 'bg-indigo-50 text-indigo-600 border-indigo-100',
                    'Ready For Delivery': 'bg-purple-50 text-purple-600 border-purple-100',
                    'Closed': 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  };

                  return (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJobId(job.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col justify-between text-xs space-y-2 cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-50/40 border-blue-500 shadow-sm' 
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-semibold text-slate-400">#{job.id.substring(job.id.length - 8)}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wide uppercase border ${priorityColor}`}>
                          {job.priority}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-800 line-clamp-1">{job.customerName}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {job.brand} {job.model} • <span className="font-mono text-[10px]">{job.serialNumber}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                        <span className="text-[10px] text-slate-400 font-medium">
                          Eng: {job.assignedEngineerName || 'Unassigned'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-[6px] text-[9px] font-bold border ${statusColors[job.status] || 'bg-slate-100 text-slate-600'}`}>
                          {job.status}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Active Job Workspace (8 cols) */}
        <div className="lg:col-span-8">
          {selectedJob ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden space-y-6 p-6">
              
              {/* Active Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded text-slate-600">
                      Workshop ID: #{selectedJob.id.substring(selectedJob.id.length - 8)}
                    </span>
                    <span className="text-[10px] font-bold bg-blue-50 border border-blue-100 text-blue-600 px-2 py-0.5 rounded">
                      Intake Date: {new Date(selectedJob.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-800">
                    {selectedJob.customerName}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Equipment: <strong className="text-slate-700">{selectedJob.brand} {selectedJob.model}</strong> | S/N: <strong className="font-mono text-slate-700">{selectedJob.serialNumber}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400 font-semibold">Assigned Specialist:</span>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-xs">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-bold text-slate-700">{selectedJob.assignedEngineerName || 'Unassigned'}</span>
                  </div>
                </div>
              </div>

              {/* Progress Stepper bar (5 steps) */}
              <div className="py-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4">Workshop Lifecycle Progression</h4>
                <div className="grid grid-cols-5 gap-1 md:gap-3">
                  {[
                    { key: 'intake', label: '1. Intake', icon: ClipboardCheck },
                    { key: 'diagnosis', label: '2. Diagnosis', icon: Activity },
                    { key: 'repair', label: '3. Repair', icon: Wrench },
                    { key: 'qa', label: '4. Quality Assurance', icon: ShieldCheck },
                    { key: 'release', label: '5. Release', icon: Truck },
                  ].map((step, i) => {
                    const status = getStageStatus(selectedJob, step.key as any);
                    const isCurrent = activeSubTab === step.key;
                    
                    let bgClass = 'bg-slate-100 text-slate-400 border-slate-200';
                    if (status === 'completed') bgClass = 'bg-emerald-500 text-white border-emerald-600';
                    else if (status === 'pending') bgClass = 'bg-blue-600 text-white border-blue-700';
                    else if (isCurrent) bgClass = 'bg-blue-50 border-blue-200 text-blue-600';

                    return (
                      <button
                        key={step.key}
                        onClick={() => setActiveSubTab(step.key as any)}
                        className={`flex flex-col items-center text-center p-2 rounded-xl border text-[10px] font-semibold transition-all cursor-pointer ${
                          isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        } ${bgClass}`}
                      >
                        <step.icon className="w-4 h-4 mb-1" />
                        <span className="hidden md:inline">{step.label}</span>
                        <span className="md:hidden">{i + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Operations Workspace */}
              <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4">
                
                {/* 1. INTAKE OPERATION PANEL */}
                {activeSubTab === 'intake' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider">Intake Intake Checklist & Receiving Data</h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Checked In</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Institute / Client</span>
                        <p className="font-bold text-slate-800">{selectedJob.customerName}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Item Serial Number</span>
                        <p className="font-mono font-bold text-slate-800">{selectedJob.serialNumber}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Department Section</span>
                        <p className="font-bold text-slate-800">{selectedJob.workshopJobData?.departmentSection || 'Biomedical / Diagnostics'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Contact Person</span>
                        <p className="font-bold text-slate-800">
                          {selectedJob.workshopJobData?.contactName || 'Staff Liaison'} ({selectedJob.workshopJobData?.contactNumber || 'N/A'})
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Warranty Status</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          selectedJob.workshopJobData?.warrantyStatus === 'Warranty' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {selectedJob.workshopJobData?.warrantyStatus || 'Non-Warranty'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Parts Checked-In With Item</span>
                        <p className="italic text-slate-600 bg-slate-100/50 p-2 rounded border border-slate-200">
                          {selectedJob.workshopJobData?.partsReceivedWithItem || 'Main item block only'}
                        </p>
                      </div>
                    </div>

                    {/* Unassigned Engineer Warning */}
                    {!selectedJob.assignedEngineerId && (
                      <div className="p-3 bg-amber-50 text-amber-800 border border-amber-100 rounded-xl text-xs space-y-2 mt-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Assign Workshop Engineer to proceed</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          This workshop ticket has checked-in. In order to begin diagnostics bench activities, assign an engineer below.
                        </p>
                        
                        <div className="pt-1 flex gap-2 items-center">
                          <select
                            id="ws-engineer-select"
                            className="bg-white border border-slate-200 rounded p-1 text-[11px] font-semibold text-slate-700 focus:outline-none"
                            onChange={(e) => handleAssignEngineer(e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Select Specialist...</option>
                            {users.map(u => (
                              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. DIAGNOSIS OPERATION PANEL */}
                {activeSubTab === 'diagnosis' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider">Engineering Diagnostic Bench</h3>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Bench Testing</span>
                    </div>

                    {/* If diagnosed, show logged diagnostics */}
                    {selectedJob.workshopJobData?.remarks && (
                      <div className="bg-slate-100/50 p-3 rounded-xl border border-slate-200 text-xs">
                        <h4 className="font-bold text-slate-700 mb-1">Diagnosed Symptoms & Findings:</h4>
                        <p className="text-slate-600 italic">"{selectedJob.workshopJobData.remarks}"</p>
                      </div>
                    )}

                    {/* Technical Parameter Measurements */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Logged Calibration/Diagnostic Bench measurements</span>
                      
                      <div className="bg-white rounded-xl border border-slate-100 p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {measurementsList.map((m, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                              <span className="font-medium text-slate-500">{m.name}:</span>
                              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                <span>{m.value}</span>
                                <button onClick={() => handleDeleteMeasurement(idx)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add parameter input */}
                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                          <input
                            type="text"
                            placeholder="e.g. Pump Pressure"
                            value={measName}
                            onChange={(e) => setMeasName(e.target.value)}
                            className="text-[11px] bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none flex-1 font-medium"
                          />
                          <input
                            type="text"
                            placeholder="e.g. 0.05 bar"
                            value={measValue}
                            onChange={(e) => setMeasValue(e.target.value)}
                            className="text-[11px] bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none w-28 font-bold"
                          />
                          <button
                            onClick={handleAddMeasurement}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <PlusCircle className="w-3.5 h-3.5" /> Add Log
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* External dispatch tracker */}
                    <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="outsideDispatch"
                          checked={diagOutsideTrack}
                          onChange={(e) => setDiagOutsideTrack(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="outsideDispatch" className="font-bold text-slate-700">Dispatch Item Outside main HQ workshop</label>
                      </div>

                      {diagOutsideTrack && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          <div>
                            <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Dispatch Details (Vendor/Territory)</label>
                            <input
                              type="text"
                              value={diagOutsideDetails}
                              onChange={(e) => setDiagOutsideDetails(e.target.value)}
                              placeholder="e.g. Sent to Colombo calibration laboratory"
                              className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Expected Return Date</label>
                            <input
                              type="date"
                              value={diagOutsideReturn}
                              onChange={(e) => setDiagOutsideReturn(e.target.value)}
                              className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Record findings form */}
                    <div className="space-y-1 text-xs">
                      <label className="text-[10px] uppercase font-black text-slate-400 block">Record Fault Diagnostics Findings</label>
                      <textarea
                        rows={2}
                        value={diagSymptoms}
                        onChange={(e) => setDiagSymptoms(e.target.value)}
                        placeholder="Log detailed engineering bench findings, damaged IC blocks, or component drift values..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveDiagnosis}
                        disabled={!diagSymptoms}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ClipboardCheck className="w-4 h-4" /> Save Diagnostics & Bench Findings
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. REPAIR OPERATION PANEL */}
                {activeSubTab === 'repair' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider">Repair & Spare Parts Integration</h3>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Repair In Progress</span>
                    </div>

                    {/* Existing logged steps */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Logged Repair Steps</span>
                      
                      {(!selectedJob.workshopJobData?.repairSteps || selectedJob.workshopJobData.repairSteps.length === 0) ? (
                        <p className="text-[11px] text-slate-400 italic">No specific repair steps logged yet. Use terminal below to log bench actions.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {selectedJob.workshopJobData.repairSteps.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 text-xs text-slate-700 font-medium shadow-2xs">
                              <span className="w-5 h-5 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center rounded-full shrink-0">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Spare parts requisition */}
                    <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="partsImport"
                          checked={partsImportRequired}
                          onChange={(e) => setPartsImportRequired(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="partsImport" className="font-bold text-slate-700">Spare Parts Import Required (Delays bench completion)</label>
                      </div>

                      {partsImportRequired && (
                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Requisition Details & Part Codes</label>
                          <textarea
                            rows={2}
                            value={partsImportDetails}
                            onChange={(e) => setPartsImportDetails(e.target.value)}
                            placeholder="e.g. Requisition for laser replacement lens block (Part #AV-LENS-9892)"
                            className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded"
                          />
                        </div>
                      )}
                    </div>

                    {/* Log action terminal */}
                    <div className="space-y-1 text-xs">
                      <label className="text-[10px] uppercase font-black text-slate-400 block">Log Repair Action Step</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newRepairStep}
                          onChange={(e) => setNewRepairStep(e.target.value)}
                          placeholder="e.g. Resoldered optical amplifier diode, replaced damaged IC gate..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleSaveRepair}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/10"
                        >
                          Log & Update
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. QA TESTING PANEL */}
                {activeSubTab === 'qa' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider">Quality Assurance Burn-in & Testing</h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">QA Testing</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">QA Verdict</label>
                        <div className="flex gap-2 pt-1">
                          {['Pass', 'Fail', 'Retest'].map((res) => (
                            <button
                              key={res}
                              onClick={() => setQaResult(res as any)}
                              className={`px-4 py-1.5 rounded-lg border font-bold text-xs tracking-wide transition-all cursor-pointer ${
                                qaResult === res
                                  ? res === 'Pass' ? 'bg-emerald-500 text-white border-emerald-600' :
                                    res === 'Fail' ? 'bg-rose-500 text-white border-rose-600' :
                                    'bg-amber-500 text-white border-amber-600'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {res}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Total Burn-in/Test Hours</label>
                        <input
                          type="number"
                          value={qaHours}
                          onChange={(e) => setQaHours(Number(e.target.value))}
                          className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Quality Inspector Notes</label>
                      <textarea
                        rows={2}
                        value={qaNotes}
                        onChange={(e) => setQaNotes(e.target.value)}
                        placeholder="Log any testing parameters observed, stability metrics, noise levels, or alignment tolerances..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 font-medium focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveQA}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" /> Finalize QA Verification
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. RELEASE GATE PANEL */}
                {activeSubTab === 'release' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider">Release Gate & Client Handover Dispatch</h3>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Release Gate</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Delivery Handover Courier</label>
                        <input
                          type="text"
                          value={relDeliveryPerson}
                          onChange={(e) => setRelDeliveryPerson(e.target.value)}
                          placeholder="e.g. Roshan Bandara (AVON Driver)"
                          className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Dispatch Report/Note Number</label>
                        <input
                          type="text"
                          value={relDispatchReport}
                          onChange={(e) => setRelDispatchReport(e.target.value)}
                          placeholder="e.g. AVN-WS-DISP-0021"
                          className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Actual Delivery Date</label>
                        <input
                          type="date"
                          value={relDate}
                          onChange={(e) => setRelDate(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs space-y-1 text-slate-700">
                      <p className="font-bold">Dispatch Handshake Note:</p>
                      <p className="text-[11px] text-slate-500">
                        Dispatched items are marked as <strong>Closed</strong> in the master ledger. Ensure physical dispatch delivery documentation is validated by storekeepers.
                      </p>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveRelease}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-emerald-600/10 flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" /> Dispatch Item & Complete Workshop Ticket
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Dynamic Job Timeline Log Card */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">Job Activity & Handshake Logs</h3>
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 max-h-[220px] overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-100">
                  {selectedJob.timeline.map((step, index) => (
                    <div key={index} className="flex gap-3 text-xs">
                      <div className="flex flex-col items-center">
                        <span className="w-6 h-6 bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center rounded-lg font-bold shrink-0">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                        </span>
                        {index < selectedJob.timeline.length - 1 && (
                          <div className="w-0.5 bg-slate-200 flex-1 min-h-[16px] my-1" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">{step.status}</span>
                          <span className="text-[10px] text-slate-400">{new Date(step.updatedAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] font-medium">Updated by: {step.updatedBy}</p>
                        {step.remarks && (
                          <p className="text-slate-600 bg-white px-2.5 py-1.5 border border-slate-100 rounded-lg text-[11px] font-medium mt-1 leading-relaxed">
                            {step.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm space-y-4">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center rounded-full mx-auto">
                <Wrench className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-700">No Workshop Job Selected</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click on an active workshop ledger item in the sidebar, or file a brand new intake receiving report to get started.
                </p>
              </div>
              <button
                onClick={() => setShowNewIntakeModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/10"
              >
                <Plus className="w-4 h-4" /> Start Intake receiving
              </button>
            </div>
          )}
        </div>

      </div>

      {/* NEW INTAKE FORM MODAL */}
      {showNewIntakeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-800">Workshop Intake Receiving Ticket</h3>
              </div>
              <button
                onClick={() => setShowNewIntakeModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateIntake} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Customer Name / Institute</label>
                  <select
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    required
                  >
                    <option value="">Select Laboratory...</option>
                    {customers.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                    <option value="General Hospital Colombo">General Hospital Colombo</option>
                    <option value="Asiri Surgical Labs">Asiri Surgical Labs</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Brand</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. SHIMADZU, SYSMEX"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Model</label>
                  <input
                    type="text"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="e.g. LC-2030, XP-100"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Serial Number</label>
                  <input
                    type="text"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    placeholder="e.g. SN-9810A2"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Contact Person Name</label>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Dr. Samantha"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Contact Phone</label>
                  <input
                    type="text"
                    value={newContactNumber}
                    onChange={(e) => setNewContactNumber(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Warranty Status</label>
                  <select
                    value={newWarrantyStatus}
                    onChange={(e) => setNewWarrantyStatus(e.target.value as any)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Non-Warranty">Non-Warranty (Paid Service)</option>
                    <option value="Warranty">Warranty (Under Cover)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Handover Delivery Person</label>
                  <input
                    type="text"
                    value={newDeliveryPerson}
                    onChange={(e) => setNewDeliveryPerson(e.target.value)}
                    placeholder="Lab Tech / Courier Name"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Accessories/Parts Received With Item</label>
                <input
                  type="text"
                  value={newPartsReceived}
                  onChange={(e) => setNewPartsReceived(e.target.value)}
                  placeholder="Main block, calibration kit, pump tube, AC adaptor..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Intake Remarks / Customer Fault report</label>
                <textarea
                  rows={2}
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  placeholder="Reported symptoms: laser intensity is dropping periodically. Demands general diagnostic test..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowNewIntakeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-600/10"
                >
                  Confirm Intake & Log Ticket
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
