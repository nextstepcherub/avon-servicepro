import React, { useState } from 'react';
import { JobRecord, JobType, JobStatus, UserProfile, UserRole, WorkflowTimelineStep } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertCircle, 
  Wrench, 
  Layers, 
  FileText, 
  Compass,
  Briefcase,
  AlertTriangle,
  Flame,
  User,
  Calendar,
  Truck,
  CheckCircle,
  X,
  Info,
  LayoutGrid,
  List,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  Clock,
  History
} from 'lucide-react';

const STATUS_RANK: Record<JobStatus, number> = {
  'Pending Assignment': 1,
  'Job Received': 1,
  'Inspection Assigned': 2,
  'Assigned': 2,
  'Inspection Done': 3,
  'Inspected': 3,
  'Inspection Validated': 3.5,
  'Pricing Done': 3.8,
  'Quoted': 4,
  'Quotation Raised': 4,
  'Waiting for PO': 5,
  'PO Received': 5,
  'Parts Ordered': 6,
  'Awaiting Parts': 6,
  'Parts Received': 6.5,
  'Awaiting Replacement': 6.8,
  'Ready for Repair': 7,
  'Traveling': 7,
  'On Site': 7,
  'In Progress': 7,
  'Repair In Progress': 7,
  'Repair Completed': 8,
  'Completed': 8,
  'QA': 9,
  'Tested': 9,
  'Ready For Delivery': 10,
  'Delivered': 11,
  'Invoiced': 11,
  'Closed': 11.5,
  'Job Abandoned': 11.5
};

interface StageDefinition {
  num: number;
  label: string;
  subLabel: string;
  icon: React.ComponentType<any>;
  isApplicable: (job: JobRecord) => boolean;
  isActive: (status: JobStatus) => boolean;
  targetRank: number;
  getStepData: (steps: WorkflowTimelineStep[]) => WorkflowTimelineStep | undefined;
}

const STAGES_CONFIG: StageDefinition[] = [
  {
    num: 1,
    label: 'Logged',
    subLabel: 'Job Registration',
    icon: Clock,
    isApplicable: () => true,
    isActive: (status) => status === 'Pending Assignment' || status === 'Job Received',
    targetRank: 1,
    getStepData: (steps) => steps[0]
  },
  {
    num: 2,
    label: 'Assigned for Inspection',
    subLabel: 'Inspection Assignment',
    icon: User,
    isApplicable: (job) => {
      return job.jobType === 'Warranty Repair' || job.jobType === 'Workshop Job' || job.jobType === 'Non-Warranty Service';
    },
    isActive: (status) => status === 'Inspection Assigned' || status === 'Assigned',
    targetRank: 2,
    getStepData: (steps) => steps.find(s => s.status === 'Inspection Assigned' || s.status === 'Assigned')
  },
  {
    num: 3,
    label: 'Inspection Done',
    subLabel: 'Assessment Complete',
    icon: Wrench,
    isApplicable: (job) => {
      return job.jobType === 'Warranty Repair' || job.jobType === 'Workshop Job' || job.jobType === 'Non-Warranty Service';
    },
    isActive: (status) => status === 'Inspection Done' || status === 'Inspected',
    targetRank: 3,
    getStepData: (steps) => steps.find(s => s.status === 'Inspection Done' || s.status === 'Inspected' || s.status === 'Inspection Validated')
  },
  {
    num: 4,
    label: 'Quotation Sent',
    subLabel: 'For Paid Jobs',
    icon: FileText,
    isApplicable: (job) => {
      return job.jobType === 'Non-Warranty Service' || job.jobType === 'Calibration' || (job.jobType === 'Workshop Job' && job.workshopJobData?.warrantyStatus === 'Non-Warranty');
    },
    isActive: (status) => status === 'Quoted' || status === 'Quotation Raised',
    targetRank: 4,
    getStepData: (steps) => steps.find(s => s.status === 'Quoted' || s.status === 'Quotation Raised')
  },
  {
    num: 5,
    label: 'PO Received',
    subLabel: 'Approval & PO',
    icon: Layers,
    isApplicable: (job) => {
      return job.jobType === 'Non-Warranty Service' || job.jobType === 'Calibration' || (job.jobType === 'Workshop Job' && job.workshopJobData?.warrantyStatus === 'Non-Warranty');
    },
    isActive: (status) => status === 'PO Received' || status === 'Waiting for PO',
    targetRank: 5,
    getStepData: (steps) => steps.find(s => s.status === 'PO Received' || s.status === 'Waiting for PO')
  },
  {
    num: 6,
    label: 'Waiting for Parts',
    subLabel: 'Import Ordered',
    icon: Truck,
    isApplicable: (job) => {
      const partsStatus = job.nonWarrantyData?.partsStatus || job.warrantyRepairData?.partsStatus || 'N/A';
      return job.workshopJobData?.partsToImportRequired === true || partsStatus === 'Parts Ordered';
    },
    isActive: (status) => status === 'Parts Ordered' || status === 'Awaiting Parts',
    targetRank: 6,
    getStepData: (steps) => steps.find(s => s.status === 'Parts Ordered' || s.status === 'Awaiting Parts' || s.status === 'Parts Received')
  },
  {
    num: 7,
    label: 'Assigned To Complete',
    subLabel: 'Work Started',
    icon: Briefcase,
    isApplicable: () => true,
    isActive: (status) => ['Ready for Repair', 'Repair In Progress', 'In Progress', 'Traveling', 'On Site'].includes(status),
    targetRank: 7,
    getStepData: (steps) => steps.find(s => ['Ready for Repair', 'Repair In Progress', 'In Progress', 'Traveling', 'On Site'].includes(s.status))
  },
  {
    num: 8,
    label: 'Complete',
    subLabel: 'Job Executed',
    icon: CheckCircle,
    isApplicable: () => true,
    isActive: (status) => status === 'Completed' || status === 'Repair Completed',
    targetRank: 8,
    getStepData: (steps) => steps.find(s => s.status === 'Completed' || s.status === 'Repair Completed')
  },
  {
    num: 9,
    label: 'QA/QC Done',
    subLabel: 'Job Testing',
    icon: Info,
    isApplicable: (job) => {
      return job.jobType === 'Warranty Repair' || job.jobType === 'Non-Warranty Service' || job.jobType === 'Workshop Job' || job.jobType === 'Warranty Service';
    },
    isActive: (status) => status === 'QA' || status === 'Tested',
    targetRank: 9,
    getStepData: (steps) => steps.find(s => s.status === 'QA' || s.status === 'Tested')
  },
  {
    num: 10,
    label: 'Waiting for Delivery',
    subLabel: 'Workshop Jobs Only',
    icon: Truck,
    isApplicable: (job) => job.jobType === 'Workshop Job',
    isActive: (status) => status === 'Ready For Delivery',
    targetRank: 10,
    getStepData: (steps) => steps.find(s => s.status === 'Ready For Delivery')
  },
  {
    num: 11,
    label: 'Complete and Close',
    subLabel: 'Closed & Invoiced',
    icon: CheckCircle,
    isApplicable: () => true,
    isActive: (status) => status === 'Closed' || status === 'Delivered' || status === 'Invoiced',
    targetRank: 11,
    getStepData: (steps) => steps.find(s => s.status === 'Closed' || s.status === 'Delivered' || s.status === 'Invoiced')
  }
];

interface JobsRegistryProps {
  activeUser: UserProfile;
  jobs: JobRecord[];
  onSelectJob: (job: JobRecord) => void;
  onAddJob: (job: JobRecord) => void;
  onUpdateJob: (updatedJob: JobRecord) => void;
  users?: UserProfile[];
}

export default function JobsRegistry({ activeUser, jobs, onSelectJob, onAddJob, onUpdateJob, users }: JobsRegistryProps) {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Assignment Modal states
  const [assigningJob, setAssigningJob] = useState<JobRecord | null>(null);
  const [assigningEngineerId, setAssigningEngineerId] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');

  // Parts Receiving Modal states
  const [receivingJob, setReceivingJob] = useState<JobRecord | null>(null);
  
  // Dialog field states (resets when receivingJob changes)
  const [recPoNumber, setRecPoNumber] = useState('');
  const [recSupplier, setRecSupplier] = useState('');
  const [recPartNumber, setRecPartNumber] = useState('');
  const [recPartDescription, setRecPartDescription] = useState('');
  const [recQuantityOrdered, setRecQuantityOrdered] = useState<number>(1);
  const [recQuantityReceived, setRecQuantityReceived] = useState<number>(1);
  const [recDeliveryDate, setRecDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [recSupplierInvoiceNumber, setRecSupplierInvoiceNumber] = useState('');
  const [recCourier, setRecCourier] = useState('');
  const [recTrackingNumber, setRecTrackingNumber] = useState('');
  const [recReceiver, setRecReceiver] = useState(activeUser.name);
  const [recRemarks, setRecRemarks] = useState('');
  const [recCondition, setRecCondition] = useState<'Good' | 'Damaged' | 'Partial Delivery'>('Good');

  React.useEffect(() => {
    if (receivingJob) {
      setRecPoNumber(receivingJob.partsReceiving?.poNumber || receivingJob.nonWarrantyData?.poNumber || '');
      setRecSupplier(receivingJob.partsReceiving?.supplier || '');
      setRecPartNumber(receivingJob.partsReceiving?.partNumber || '');
      setRecPartDescription(receivingJob.partsReceiving?.partDescription || '');
      setRecQuantityOrdered(receivingJob.partsReceiving?.quantityOrdered || 1);
      setRecQuantityReceived(receivingJob.partsReceiving?.quantityReceived || 1);
      setRecDeliveryDate(receivingJob.partsReceiving?.deliveryDate || new Date().toISOString().split('T')[0]);
      setRecSupplierInvoiceNumber(receivingJob.partsReceiving?.supplierInvoiceNumber || '');
      setRecCourier(receivingJob.partsReceiving?.courier || '');
      setRecTrackingNumber(receivingJob.partsReceiving?.trackingNumber || '');
      setRecReceiver(receivingJob.partsReceiving?.receiver || activeUser.name);
      setRecRemarks(receivingJob.partsReceiving?.remarks || '');
      setRecCondition(receivingJob.partsReceiving?.condition || 'Good');
    }
  }, [receivingJob, activeUser.name]);

  const handleDialogAssignJobSubmit = () => {
    if (!assigningJob || !assigningEngineerId) return;
    const now = new Date().toISOString();
    const updatedJob = { ...assigningJob };
    const selectedEng = (users || MOCK_USERS).find(u => u.id === assigningEngineerId);
    if (!selectedEng) return;

    updatedJob.assignedEngineerId = selectedEng.id;
    updatedJob.assignedEngineerName = selectedEng.name;
    updatedJob.updatedAt = now;

    // Transition status if it was Pending Assignment
    let targetStatus = updatedJob.status;
    if (updatedJob.status === 'Pending Assignment') {
      targetStatus = 'Assigned';
    }
    updatedJob.status = targetStatus;

    const assignStep = {
      status: targetStatus,
      updatedBy: `${activeUser.name} (${activeUser.role})`,
      updatedAt: now,
      remarks: assignRemarks || `Assigned job to ${selectedEng.name} (${selectedEng.role}).`
    };

    updatedJob.timeline = [assignStep, ...assigningJob.timeline];

    onUpdateJob(updatedJob);
    setAssigningJob(null);
    setAssigningEngineerId('');
    setAssignRemarks('');
  };

  const handleDialogReceivePartsSubmit = () => {
    if (!receivingJob) return;
    const now = new Date().toISOString();
    const updatedJob = { ...receivingJob };
    
    const receivingData = {
      poNumber: recPoNumber,
      supplier: recSupplier,
      partNumber: recPartNumber,
      partDescription: recPartDescription,
      quantityOrdered: Number(recQuantityOrdered),
      quantityReceived: Number(recQuantityReceived),
      deliveryDate: recDeliveryDate,
      supplierInvoiceNumber: recSupplierInvoiceNumber,
      courier: recCourier,
      trackingNumber: recTrackingNumber,
      receiver: recReceiver,
      remarks: recRemarks,
      condition: recCondition
    };
    
    updatedJob.partsReceiving = receivingData;
    updatedJob.updatedAt = now;
    
    if (updatedJob.nonWarrantyData) {
      updatedJob.nonWarrantyData.partsStatus = 'Parts Received';
      updatedJob.nonWarrantyData.partsReceivedDate = recDeliveryDate;
    }
    if (updatedJob.warrantyRepairData) {
      updatedJob.warrantyRepairData.partsStatus = 'Parts Received';
      updatedJob.warrantyRepairData.partsReceivedDate = recDeliveryDate;
    }

    const partsReceivedStep = {
      status: 'Parts Received' as JobStatus,
      updatedBy: `${activeUser.name} (${activeUser.role})`,
      updatedAt: now,
      remarks: `Parts physically received from ${recSupplier}. PO: ${recPoNumber}, Part: ${recPartNumber}, Qty: ${recQuantityReceived}/${recQuantityOrdered}, Condition: ${recCondition}. Courier: ${recCourier}, Tracking: ${recTrackingNumber}. Invoice: ${recSupplierInvoiceNumber}. Receiver: ${recReceiver}. Remarks: ${recRemarks}`
    };

    let nextStatus: JobStatus = 'Awaiting Parts';
    let secondaryStep = null;

    if (recCondition === 'Good' && Number(recQuantityReceived) === Number(recQuantityOrdered)) {
      nextStatus = 'Ready for Repair';
      secondaryStep = {
        status: 'Ready for Repair' as JobStatus,
        updatedBy: 'System Automation',
        updatedAt: now,
        remarks: `Parts complete & verified. Job status set to Ready for Repair. Notification dispatched to Assigned Engineer (${receivingJob.assignedEngineerName || 'None'}).`
      };
    } else if (recCondition === 'Partial Delivery') {
      nextStatus = 'Awaiting Parts';
      secondaryStep = {
        status: 'Awaiting Parts' as JobStatus,
        updatedBy: 'System Automation',
        updatedAt: now,
        remarks: `Partial delivery received (${recQuantityReceived}/${recQuantityOrdered}). Waiting remaining quantity.`
      };
    } else if (recCondition === 'Damaged') {
      nextStatus = 'Awaiting Replacement';
      secondaryStep = {
        status: 'Awaiting Replacement' as JobStatus,
        updatedBy: 'System Automation',
        updatedAt: now,
        remarks: 'Damaged parts received. Status updated to Awaiting Replacement. Action required to notify supplier.'
      };
    }

    updatedJob.status = nextStatus;
    
    if (secondaryStep) {
      updatedJob.timeline = [secondaryStep, partsReceivedStep, ...receivingJob.timeline];
    } else {
      updatedJob.timeline = [partsReceivedStep, ...receivingJob.timeline];
    }

    onUpdateJob(updatedJob);
    setReceivingJob(null);
  };
  
  // Create Job States
  const [newJobType, setNewJobType] = useState<JobType>('Installation');
  const [customerName, setCustomerName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'Emergency'>('Routine');
  
  // Specific Workflow Form States
  // Installation details
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceValue, setInvoiceValue] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [warrantyYears, setWarrantyYears] = useState('2');
  const [warrantyMonths, setWarrantyMonths] = useState('24');
  const [endUserName, setEndUserName] = useState('');
  const [endUserContact, setEndUserContact] = useState('');
  const [endUserLocation, setEndUserLocation] = useState('');
  const [remarks, setRemarks] = useState('');

  // Repairs & Services (Warranty / Non-Warranty)
  const [departmentSection, setDepartmentSection] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  // Workshop Job details
  const [acceptanceDate, setAcceptanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [warrantyStatus, setWarrantyStatus] = useState<'Warranty' | 'Non-Warranty'>('Warranty');
  const [partsReceivedWithItem, setPartsReceivedWithItem] = useState('');
  const [takenByDeliveryPerson, setTakenByDeliveryPerson] = useState('');

  // Calibration request date
  const [calibrationRequestDate, setCalibrationRequestDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle Create Job Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !brand || !model) {
      alert('Please fill out the customer name, brand and model.');
      return;
    }

    const newJobId = `job_${newJobType.toLowerCase().replace(' ', '_').substring(0, 4)}_${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const createdJob: JobRecord = {
      id: newJobId,
      jobType: newJobType,
      status: 'Pending Assignment',
      priority,
      customerName,
      brand,
      model,
      serialNumber: serialNumber || 'N/A',
      createdById: activeUser.id,
      createdByRole: activeUser.role,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          status: 'Pending Assignment',
          updatedBy: `${activeUser.name} (${activeUser.role})`,
          updatedAt: now,
          remarks: 'Job request fed into enterprise system.'
        }
      ]
    };

    // Embed specific workflow sub-structures based on rules
    if (newJobType === 'Installation') {
      const parsedVal = parseFloat(invoiceValue) || 0;
      const parsedMonths = parseInt(warrantyMonths) || (parseInt(warrantyYears) * 12) || 24;
      
      createdJob.installationData = {
        invoiceNumber,
        invoiceValue: parsedVal,
        model,
        itemDescription,
        brand,
        customerName,
        warrantyPeriodYears: parseInt(warrantyYears) || 2,
        warrantyPeriodMonths: parsedMonths,
        endUserName: endUserName || undefined,
        endUserContact: endUserContact || undefined,
        endUserLocation: endUserLocation || undefined,
        remarks: remarks || undefined,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // SLA is 15 days
      };
    } else if (newJobType === 'Warranty Service') {
      createdJob.warrantyServiceData = {
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isOverdue: false,
        alertActive: true
      };
    } else if (newJobType === 'Non-Warranty Service') {
      createdJob.nonWarrantyData = {
        departmentSection,
        issueDescription,
        inspectionDone: false,
        inspectionValidated: false,
        partsStatus: 'N/A',
        invoiceRaised: false
      };
    } else if (newJobType === 'Warranty Repair') {
      createdJob.warrantyRepairData = {
        departmentSection,
        issueDescription,
        inspectionDone: false,
        inspectionValidated: false,
        partsStatus: 'N/A'
      };
    } else if (newJobType === 'Workshop Job') {
      createdJob.status = 'Job Received';
      createdJob.timeline = [
        {
          status: 'Job Received',
          updatedBy: `${activeUser.name} (${activeUser.role})`,
          updatedAt: now,
          remarks: 'Item physically received at the workshop. Acceptance report generated.'
        }
      ];
      createdJob.workshopJobData = {
        acceptanceDate,
        itemSerialNumber: serialNumber,
        institute: customerName,
        departmentSection,
        contactName: endUserName || 'N/A',
        contactNumber: endUserContact || 'N/A',
        warrantyStatus,
        partsReceivedWithItem,
        takenByDeliveryPerson,
        remarks: remarks || undefined,
        takenOutsideWorkshop: false
      };
    } else if (newJobType === 'Calibration') {
      createdJob.calibrationData = {
        requestDate: calibrationRequestDate
      };
    }

    onAddJob(createdJob);
    
    // Clear and hide form
    setCustomerName('');
    setBrand('');
    setModel('');
    setSerialNumber('');
    setInvoiceNumber('');
    setInvoiceValue('');
    setItemDescription('');
    setEndUserName('');
    setEndUserContact('');
    setEndUserLocation('');
    setRemarks('');
    setDepartmentSection('');
    setIssueDescription('');
    setPartsReceivedWithItem('');
    setTakenByDeliveryPerson('');
    setShowAddForm(false);
  };

  // Filter List logic
  const filteredJobs = jobs.filter(job => {
    const matchesType = filterType === 'All' || job.jobType === filterType;
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
    const matchesSearch = 
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.assignedEngineerName && job.assignedEngineerName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesStatus && matchesSearch;
  });

  // Sort list logic
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'updatedAt') {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else if (sortBy === 'id') {
      comparison = a.id.localeCompare(b.id);
    } else if (sortBy === 'customerName') {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortBy === 'priority') {
      const priorityWeight = { 'Emergency': 3, 'Urgent': 2, 'Routine': 1 };
      const weightA = priorityWeight[a.priority] || 0;
      const weightB = priorityWeight[b.priority] || 0;
      comparison = weightA - weightB;
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Compile all timeline events across the filtered/sorted jobs list
  const allTimelineEvents = React.useMemo(() => {
    const events: Array<{
      id: string;
      jobId: string;
      customerName: string;
      jobType: JobType;
      priority: 'Routine' | 'Urgent' | 'Emergency';
      model: string;
      brand: string;
      assignedEngineerName?: string;
      status: JobStatus;
      updatedBy: string;
      updatedAt: string;
      remarks?: string;
      originalJob: JobRecord;
    }> = [];

    sortedJobs.forEach(job => {
      if (job.timeline && Array.isArray(job.timeline)) {
        job.timeline.forEach((step, idx) => {
          events.push({
            id: `${job.id}-milestone-${idx}-${step.updatedAt}`,
            jobId: job.id,
            customerName: job.customerName,
            jobType: job.jobType,
            priority: job.priority,
            model: job.model,
            brand: job.brand,
            assignedEngineerName: job.assignedEngineerName,
            status: step.status,
            updatedBy: step.updatedBy,
            updatedAt: step.updatedAt,
            remarks: step.remarks,
            originalJob: job
          });
        });
      }
    });

    // Sort chronologically descending (most recent first)
    return events.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [sortedJobs]);

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'Emergency': return 'bg-red-100 text-red-800 border-red-200 font-bold';
      case 'Urgent': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status: JobStatus) => {
    if (status === 'Closed' || status === 'Completed' || status === 'Invoiced') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'Pending Assignment') return 'bg-slate-100 text-slate-700 border-slate-300 animate-pulse';
    if (status === 'Parts Ordered') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const getStatusMarkerColor = (status: JobStatus) => {
    if (status === 'Closed' || status === 'Completed' || status === 'Invoiced' || status === 'Delivered') {
      return 'bg-emerald-500 border-emerald-200 text-white';
    }
    if (status === 'Pending Assignment') {
      return 'bg-amber-500 border-amber-200 text-white';
    }
    if (status === 'Parts Ordered' || status === 'Awaiting Parts' || status === 'Parts Received' || status === 'Awaiting Replacement') {
      return 'bg-purple-500 border-purple-200 text-white';
    }
    return 'bg-blue-500 border-blue-200 text-white';
  };

  return (
    <div id="jobs_registry_container" className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Service & Job Master Registry</h1>
          <p className="text-sm text-slate-500">Track real-time workflow statuses, parts availability, and assignments</p>
        </div>
        
        {/* Only allow members with appropriate roles to create certain jobs */}
        <button
          id="btn_open_add_job"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/10 transition-all flex items-center gap-2 self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-5 h-5" /> {showAddForm ? 'Close Intake Form' : 'Register New Job'}
        </button>
      </div>

      {/* Slide-out/Collapsible Creation Panel */}
      {showAddForm && (
        <div id="add_job_form_card" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Layers className="text-blue-600 w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-800">Job Intake Registration Form</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Primary configuration */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Workflow Type</label>
                <select
                  id="select_new_job_type"
                  value={newJobType}
                  onChange={(e) => setNewJobType(e.target.value as JobType)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 font-medium"
                >
                  <option value="Installation">Installation Request</option>
                  <option value="Warranty Service">Warranty Alert PM Service</option>
                  <option value="Non-Warranty Service">Non-Warranty Service / Repair</option>
                  <option value="Warranty Repair">Warranty Repair Ticket</option>
                  <option value="Workshop Job">Workshop Acceptance Job</option>
                  <option value="Calibration">Calibration Request</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Priority Rating</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'Routine' | 'Urgent' | 'Emergency')}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 font-medium"
                >
                  <option value="Routine">Routine SLA</option>
                  <option value="Urgent">Urgent Intervention</option>
                  <option value="Emergency">Emergency Hospital Shutdown</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Instrument Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Sysmex, Roche, Shimadzu"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Instrument</label>
                <input
                  type="text"
                  placeholder="e.g. XN-1000, Cobas e411, GC-2030"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                  required
                />
              </div>
            </div>

            {/* Custom fields based on user workflow rules */}
            
            {/* 1. INSTALLATION WORKFLOW FORM */}
            {newJobType === 'Installation' && (
              <div id="installation_fields_section" className="bg-blue-50/20 p-4 rounded-xl border border-blue-50 space-y-4">
                <h4 className="text-sm font-bold text-blue-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Required Documentation Officer Fields (Compulsory)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Customer (Institution) Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Asiri Surgical Hospital"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Invoice Number *</label>
                    <input
                      type="text"
                      placeholder="INV-2026-XXXX"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Value of Instrument (LKR) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 8500000"
                      value={invoiceValue}
                      onChange={(e) => setInvoiceValue(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Warranty (Years / Months) *</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Yrs"
                        value={warrantyYears}
                        onChange={(e) => {
                          setWarrantyYears(e.target.value);
                          setWarrantyMonths((parseInt(e.target.value) * 12 || 0).toString());
                        }}
                        className="w-1/2 border border-slate-200 rounded-lg p-2 text-sm bg-white"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Mths"
                        value={warrantyMonths}
                        onChange={(e) => setWarrantyMonths(e.target.value)}
                        className="w-1/2 border border-slate-200 rounded-lg p-2 text-sm bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Item Description / Accessories *</label>
                  <textarea
                    placeholder="Enter detailed description of components, reagents starter kit, computer benchmarks, UPS and specifications..."
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white h-20"
                    required
                  />
                </div>

                <div className="border-t border-slate-150 pt-3">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Customer End-User Details (Optional during request, filled by Area Eng at Assignment)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">End User Contact Name</label>
                      <input
                        type="text"
                        placeholder="Dr. Priyantha Silva"
                        value={endUserName}
                        onChange={(e) => setEndUserName(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">End User Contact Number</label>
                      <input
                        type="text"
                        placeholder="+9477XXXXXXX"
                        value={endUserContact}
                        onChange={(e) => setEndUserContact(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">End User Location / Floor</label>
                      <input
                        type="text"
                        placeholder="Block B, 2nd Floor"
                        value={endUserLocation}
                        onChange={(e) => setEndUserLocation(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">General Remarks</label>
                      <input
                        type="text"
                        placeholder="Requires gas manifolds check"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. REPAIRS & BREAKDOWNS FORM (Warranty / Non-Warranty) */}
            {(newJobType === 'Non-Warranty Service' || newJobType === 'Warranty Repair' || newJobType === 'Warranty Service') && (
              <div id="repair_fields_section" className="bg-amber-50/10 p-4 rounded-xl border border-amber-100 space-y-4">
                <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" /> Issue Ticket & Department Location Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Customer Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Nawaloka Hospitals"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Department / Lab Section *</label>
                    <input
                      type="text"
                      placeholder="e.g. Clinical Pathology, Biochemistry"
                      value={departmentSection}
                      onChange={(e) => setDepartmentSection(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Instrument Serial Number</label>
                    <input
                      type="text"
                      placeholder="S/N: "
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">End User Contact Name</label>
                    <input
                      type="text"
                      placeholder="Nurse Kamala"
                      value={endUserName}
                      onChange={(e) => setEndUserName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">End User Contact Number</label>
                    <input
                      type="text"
                      placeholder="+9471XXXXXXX"
                      value={endUserContact}
                      onChange={(e) => setEndUserContact(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Simple Description of the Job / Issue Breakdown *</label>
                  <textarea
                    placeholder="Provide a description of the symptoms, error codes displayed, or maintenance cycle requirements..."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm h-20"
                    required
                  />
                </div>
              </div>
            )}

            {/* 3. WORKSHOP RECEIVING JOB FORM */}
            {newJobType === 'Workshop Job' && (
              <div id="workshop_fields_section" className="bg-purple-50/20 p-4 rounded-xl border border-purple-50 space-y-4">
                <h4 className="text-sm font-bold text-purple-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Workshop Intake & Acceptance Report Details (Compulsory)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Institute (Customer) Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. ITI Lab"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Department or Section *</label>
                    <input
                      type="text"
                      placeholder="Chemical Div"
                      value={departmentSection}
                      onChange={(e) => setDepartmentSection(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Serial Number *</label>
                    <input
                      type="text"
                      placeholder="S/N: Shimadzu-XX"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Warranty Status *</label>
                    <select
                      value={warrantyStatus}
                      onChange={(e) => setWarrantyStatus(e.target.value as 'Warranty' | 'Non-Warranty')}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white font-medium"
                    >
                      <option value="Warranty">Under Warranty</option>
                      <option value="Non-Warranty">Non-Warranty (Chargeable)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Intake Contact Person</label>
                    <input
                      type="text"
                      placeholder="Mrs. Sanduni"
                      value={endUserName}
                      onChange={(e) => setEndUserName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Intake Contact Number</label>
                    <input
                      type="text"
                      placeholder="+9471XXXXXXX"
                      value={endUserContact}
                      onChange={(e) => setEndUserContact(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-bold text-slate-600">Parts Received with the Item *</label>
                    <input
                      type="text"
                      placeholder="e.g. Power cords, calibration vials, connectors, hard case"
                      value={partsReceivedWithItem}
                      onChange={(e) => setPartsReceivedWithItem(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Taken by Delivery Person (Name) *</label>
                    <input
                      type="text"
                      placeholder="Sarath Perera (Avon Dispatch)"
                      value={takenByDeliveryPerson}
                      onChange={(e) => setTakenByDeliveryPerson(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Physically Received Date *</label>
                    <input
                      type="date"
                      value={acceptanceDate}
                      onChange={(e) => setAcceptanceDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Visual Defects / Remarks</label>
                    <input
                      type="text"
                      placeholder="Scratch on front bezel"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. CALIBRATION REQ FORM */}
            {newJobType === 'Calibration' && (
              <div id="calibration_fields_section" className="bg-indigo-50/20 p-4 rounded-xl border border-indigo-50 space-y-4">
                <h4 className="text-sm font-bold text-indigo-800 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" /> Calibration Standard Request Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Customer Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Asiri Surgical"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Asset Serial Number *</label>
                    <input
                      type="text"
                      placeholder="S/N: "
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Target Request Date *</label>
                    <input
                      type="date"
                      value={calibrationRequestDate}
                      onChange={(e) => setCalibrationRequestDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Calibration Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. 5-point calibration, ITI specs"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn_submit_job"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm shadow cursor-pointer"
              >
                Verify & Dispatch Job
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Filter and search controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Job ID, customer, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm bg-white"
          />
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-700"
          >
            <option value="All">All Job Types</option>
            <option value="Installation">Installations</option>
            <option value="Warranty Service">Warranty PM Services</option>
            <option value="Non-Warranty Service">Non-Warranty Services</option>
            <option value="Warranty Repair">Warranty Repairs</option>
            <option value="Workshop Job">Workshop Jobs</option>
            <option value="Calibration">Calibrations</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-700"
          >
            <option value="All">All Work Statuses</option>
            <option value="Pending Assignment">Pending Assignment</option>
            <option value="Assigned">Assigned</option>
            <option value="Traveling">Traveling</option>
            <option value="On Site">On Site</option>
            <option value="In Progress">In Progress</option>
            <option value="Inspection Done">Inspection Done</option>
            <option value="Inspection Validated">Inspection Validated</option>
            <option value="Parts Ordered">Parts Ordered</option>
            <option value="Parts Received">Parts Received</option>
            <option value="Repair Completed">Repair Completed</option>
            <option value="Ready For Delivery">Ready For Delivery</option>
            <option value="Completed">Completed</option>
            <option value="Invoiced">Invoiced</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* View & Sort Control Bar */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Left side: status details */}
        <div className="flex items-center gap-2 text-slate-600">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Active Rows: <b className="text-slate-900">{sortedJobs.length}</b> / {jobs.length} jobs matching</span>
        </div>

        {/* Right side: Sorting & View switching */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="createdAt">Date Created</option>
              <option value="updatedAt">Last Updated</option>
              <option value="priority">Priority Severity</option>
              <option value="customerName">Customer Name</option>
              <option value="id">Job ID</option>
              <option value="status">Work Status</option>
            </select>
          </div>

          {/* Sort direction toggle button */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 p-1.5 rounded-lg flex items-center justify-center gap-1 font-semibold cursor-pointer shadow-sm min-w-[75px]"
            title={sortOrder === 'asc' ? 'Sorting Ascending' : 'Sorting Descending'}
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 text-blue-600" /> : <SortDesc className="w-4 h-4 text-blue-600" />}
            <span className="uppercase text-[10px] font-bold text-slate-700">{sortOrder}</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-300 mx-1 hidden sm:block" />

          {/* View mode toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="font-bold text-[10px]">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="font-bold text-[10px]">List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'timeline' 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Milestone Timeline View"
            >
              <Clock className="w-4 h-4" />
              <span className="font-bold text-[10px]">Timeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List of Jobs */}
      {sortedJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-base font-bold text-slate-700">No records found matching criteria</p>
          <p className="text-xs text-slate-400 mt-1">Refine your filters, search term, or create a new job ticket above.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedJobs.map(job => (
            <div
              key={job.id}
              id={`job_card_${job.id}`}
              onClick={() => onSelectJob(job)}
              className="bg-white rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all p-5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Highlight bar for priority */}
              {job.priority === 'Emergency' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
              )}
              {job.priority === 'Urgent' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
              )}

              <div>
                {/* Upper card info */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold font-mono text-slate-400">
                    ID: {job.id}
                  </span>
                  <div className="flex gap-1.5 items-center">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${getPriorityBadge(job.priority)}`}>
                      {job.priority}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-blue-700 transition-colors">
                  {job.customerName}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                    {job.jobType}
                  </span>
                  <span className="text-xs text-slate-500">
                    S/N: <b className="text-slate-700">{job.serialNumber}</b>
                  </span>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div>
                    Brand/Model: <span className="font-semibold text-slate-700">{job.brand} {job.model}</span>
                  </div>
                  <div>
                    Assigned To: <span className="font-semibold text-slate-700">{job.assignedEngineerName || 'Unassigned'}</span>
                  </div>
                  
                  {/* Dynamic mini-metric indicators */}
                  {job.jobType === 'Installation' && job.installationData?.invoiceValue && (
                    <div className="text-[11px] text-emerald-600 font-bold">
                      Valuation: LKR {(job.installationData.invoiceValue / 1000000).toFixed(1)}M
                    </div>
                  )}
                  {job.jobType === 'Warranty Service' && job.warrantyServiceData?.dueDate && (
                    <div className="text-[11px] text-red-500 font-bold flex items-center gap-1">
                      Target Due: {new Date(job.warrantyServiceData.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  {job.jobType === 'Non-Warranty Service' && job.nonWarrantyData?.partsStatus && (
                    <div className="text-[11px] text-slate-500">
                      Parts Status: <span className="font-bold text-slate-700">{job.nonWarrantyData.partsStatus}</span>
                    </div>
                  )}

                  {/* Receive Parts & Assign Job Action Buttons on Card */}
                  {(job.status === 'Parts Ordered' || job.status === 'Awaiting Parts' || job.status === 'Awaiting Replacement') && (
                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id={`receive_parts_btn_${job.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setReceivingJob(job);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-2.5 rounded-lg text-[10px] transition-all flex items-center justify-center gap-1 shadow cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" /> Update Parts Received
                      </button>
                      <button
                        type="button"
                        id={`assign_job_card_btn_${job.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssigningJob(job);
                          setAssigningEngineerId(job.assignedEngineerId || '');
                        }}
                        className="bg-slate-600 hover:bg-slate-700 text-white font-extrabold py-2 px-2.5 rounded-lg text-[10px] transition-all flex items-center justify-center gap-1 shadow cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" /> Assign Job
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>View Timeline & Update</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Job ID</th>
                  <th className="py-3 px-4">Customer & Brand/Model</th>
                  <th className="py-3 px-4">Job Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Engineer</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {sortedJobs.map(job => (
                  <tr 
                    key={job.id} 
                    onClick={() => onSelectJob(job)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-slate-400">
                      <div className="flex flex-col">
                        <span>{job.id}</span>
                        <span className={`w-max text-[8px] mt-1 uppercase px-1.5 py-0.5 rounded font-mono font-extrabold border ${getPriorityBadge(job.priority)}`}>
                          {job.priority}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors text-sm">
                        {job.customerName}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {job.brand} {job.model} • S/N: <span className="font-semibold text-slate-700">{job.serialNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                        {job.jobType}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">
                      {job.assignedEngineerName || (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Action Buttons for card status */}
                        {(job.status === 'Parts Ordered' || job.status === 'Awaiting Parts' || job.status === 'Awaiting Replacement') && (
                          <>
                            <button
                              type="button"
                              onClick={() => setReceivingJob(job)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all shadow-sm"
                              title="Update Parts Received"
                            >
                              <Truck className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAssigningJob(job);
                                setAssigningEngineerId(job.assignedEngineerId || '');
                              }}
                              className="bg-slate-600 hover:bg-slate-700 text-white p-2 rounded-lg transition-all shadow-sm"
                              title="Assign Job"
                            >
                              <User className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectJob(job)}
                          className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-slate-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Horizontal Swimlane Job Milestone Timeline View */
        <div className="space-y-6">
          {/* Legend and Intro Header */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-500" />
                <h2 className="text-base font-extrabold text-slate-800">Job Milestone Progression Matrix</h2>
              </div>
              <p className="text-xs text-slate-500">Horizontal workflow timeline tracking active service jobs in real-time across 11 standard phases.</p>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3.5 text-[11px] font-semibold text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
              <span className="text-slate-400">Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300 inline-block"></span>
                <span>Finished (Done Logo)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 border border-blue-300 ring-2 ring-blue-200 animate-pulse inline-block"></span>
                <span>On Progress (Relevant Logo)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-50 border border-rose-200 inline-block"></span>
                <span className="text-rose-500/90">Waiting or Not Started (Pending Logo)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-slate-50 border border-slate-200 opacity-50 line-through inline-block text-[8px] text-center leading-none">N/A</span>
                <span>Not Applicable</span>
              </div>
            </div>
          </div>

          {sortedJobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">No jobs match your active filters</p>
              <p className="text-xs text-slate-400 mt-1">Adjust your search query or select another work status.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[2100px]">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      {/* Left sticky header */}
                      <th className="py-4 px-5 w-[280px] sticky left-0 bg-slate-50 z-10 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                        Job Details
                      </th>
                      {STAGES_CONFIG.map((stg) => (
                        <th key={stg.num} className="py-4 px-4 text-center w-[160px]">
                          Stage {stg.num}: {stg.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {sortedJobs.map((job) => {
                      const timelineSteps = job.timeline || [];

                      // pre-compute states for all stages to help with lines
                      const states = STAGES_CONFIG.map((stg) => {
                        const isApp = stg.isApplicable(job);
                        if (!isApp) return 'na' as const;
                        if (stg.isActive(job.status)) return 'active' as const;
                        
                        const currentRank = STATUS_RANK[job.status] || 0;
                        const targetRank = stg.targetRank;
                        const hasStepData = timelineSteps.some(
                          (step) =>
                            step.status === job.status ||
                            (stg.num === 1 && step.status === 'Pending Assignment') ||
                            (stg.num === 2 && (step.status === 'Inspection Assigned' || step.status === 'Assigned')) ||
                            (stg.num === 3 && (step.status === 'Inspection Done' || step.status === 'Inspected' || step.status === 'Inspection Validated')) ||
                            (stg.num === 4 && (step.status === 'Quoted' || step.status === 'Quotation Raised')) ||
                            (stg.num === 5 && (step.status === 'PO Received' || step.status === 'Waiting for PO')) ||
                            (stg.num === 6 && (step.status === 'Parts Ordered' || step.status === 'Awaiting Parts')) ||
                            (stg.num === 7 && ['Ready for Repair', 'Repair In Progress', 'In Progress', 'Traveling', 'On Site'].includes(step.status)) ||
                            (stg.num === 8 && (step.status === 'Completed' || step.status === 'Repair Completed')) ||
                            (stg.num === 9 && (step.status === 'QA' || step.status === 'Tested')) ||
                            (stg.num === 10 && step.status === 'Ready For Delivery') ||
                            (stg.num === 11 && (step.status === 'Closed' || step.status === 'Delivered' || step.status === 'Invoiced'))
                        );

                        if (hasStepData || currentRank > targetRank) {
                          return 'completed' as const;
                        }
                        return 'pending' as const;
                      });

                      return (
                        <tr key={job.id} className="hover:bg-slate-50/40 transition-colors group">
                          {/* Column 1 Sticky details */}
                          <td className="py-4 px-5 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.01)]">
                            <div 
                              onClick={() => onSelectJob(job)}
                              className="space-y-2 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-extrabold text-blue-600 hover:underline">
                                  {job.id}
                                </span>
                                <span className="text-[10px] text-slate-300 font-semibold">|</span>
                                <span className="text-xs font-extrabold text-slate-800 truncate max-w-[150px] inline-block">
                                  {job.customerName}
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-500 space-y-0.5">
                                <div>
                                  Instrument: <span className="font-semibold text-slate-700">{job.brand} {job.model}</span>
                                </div>
                                {job.serialNumber && (
                                  <div>
                                    S/N: <span className="font-mono text-slate-600 font-semibold">{job.serialNumber}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                                  {job.jobType}
                                </span>
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${getPriorityBadge(job.priority)}`}>
                                  {job.priority}
                                </span>
                              </div>
                            </div>
                          </td>

                          {STAGES_CONFIG.map((stg, idx) => {
                            const state = states[idx];
                            const stepData = stg.getStepData(timelineSteps);
                            const IconComponent = stg.icon;

                            let bgClass = '';
                            let ringClass = '';
                            let textClass = '';

                            if (state === 'completed') {
                              bgClass = 'bg-emerald-500 text-white border-emerald-400';
                              textClass = 'text-slate-800';
                            } else if (state === 'active') {
                              bgClass = 'bg-blue-500 text-white border-blue-400';
                              ringClass = 'ring-4 ring-blue-100 animate-pulse';
                              textClass = 'text-blue-700 font-bold';
                            } else if (state === 'na') {
                              bgClass = 'bg-slate-100 text-slate-300 border-slate-200 opacity-50 line-through';
                              textClass = 'text-slate-400 italic';
                            } else {
                              // pending
                              bgClass = 'bg-rose-50 text-rose-400 border-rose-200';
                              textClass = 'text-rose-500/80';
                            }

                            // Left connector (idx > 0)
                            const leftConnectorColor = (() => {
                              if (idx === 0) return null;
                              const prevState = states[idx - 1];
                              const currState = state;
                              if (prevState === 'completed' && currState === 'completed') return 'bg-emerald-500';
                              if (currState === 'completed' || prevState === 'completed') return 'bg-emerald-500';
                              if (currState === 'active') return 'bg-blue-500';
                              if (prevState === 'active') return 'bg-blue-300';
                              if (currState === 'na' || prevState === 'na') return 'bg-slate-100';
                              return 'bg-slate-200 border-dashed border-t-2 border-slate-300';
                            })();

                            // Right connector (idx < 10)
                            const rightConnectorColor = (() => {
                              if (idx === 10) return null;
                              const currState = state;
                              const nextState = states[idx + 1];
                              if (currState === 'completed' && nextState === 'completed') return 'bg-emerald-500';
                              if (currState === 'completed' || nextState === 'completed') return 'bg-emerald-500';
                              if (currState === 'active') return 'bg-blue-500';
                              if (nextState === 'active') return 'bg-blue-300';
                              if (currState === 'na' || nextState === 'na') return 'bg-slate-100';
                              return 'bg-slate-200 border-dashed border-t-2 border-slate-300';
                            })();

                            // Format timestamp cleanly
                            let displayDate = '';
                            let displayBy = '';
                            if (stepData?.updatedAt) {
                              const dateObj = new Date(stepData.updatedAt);
                              displayDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + 
                                           dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
                            }
                            if (stepData?.updatedBy) {
                              const parts = stepData.updatedBy.split(' ');
                              if (parts.length > 1) {
                                displayBy = `${parts[0]} ${parts[1][0]}.`;
                              } else {
                                displayBy = parts[0];
                              }
                              displayBy = displayBy.replace(/\s*\(.*\)/, '');
                            }

                            return (
                              <td key={stg.num} className="py-6 px-2 text-center relative w-[160px]">
                                {/* Connector line left */}
                                {leftConnectorColor && (
                                  <div className={`absolute top-[32px] left-0 right-1/2 h-0.5 -translate-y-1/2 z-0 ${leftConnectorColor}`} />
                                )}
                                {/* Connector line right */}
                                {rightConnectorColor && (
                                  <div className={`absolute top-[32px] left-1/2 right-0 h-0.5 -translate-y-1/2 z-0 ${rightConnectorColor}`} />
                                )}

                                <div className="flex flex-col items-center text-center px-1 py-1 relative z-10 select-none">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-transform ${bgClass} ${ringClass}`}>
                                    {state === 'completed' ? (
                                      <CheckCircle className="w-4.5 h-4.5" />
                                    ) : state === 'active' ? (
                                      <IconComponent className="w-4 h-4" />
                                    ) : state === 'na' ? (
                                      <IconComponent className="w-4 h-4" />
                                    ) : (
                                      <Clock className="w-4 h-4" />
                                    )}
                                  </div>
                                  
                                  <div className="mt-2 space-y-0.5">
                                    <span className={`text-[10px] uppercase tracking-wider block font-black leading-tight ${textClass}`}>
                                      {stg.label}
                                      {state === 'na' && (
                                        <span className="text-[8px] font-normal text-slate-400 bg-slate-100 px-1 py-0.5 rounded ml-1 font-mono uppercase">N/A</span>
                                      )}
                                    </span>
                                    <span className="text-[9px] text-slate-400 block leading-tight font-medium">
                                      {stg.subLabel}
                                    </span>
                                    
                                    {state !== 'pending' && state !== 'na' && displayDate && (
                                      <span className="text-[10px] font-mono font-medium text-slate-400 block leading-tight pt-1">
                                        {displayDate}
                                      </span>
                                    )}
                                    
                                    {state !== 'pending' && state !== 'na' && displayBy && (
                                      <span className="text-[9px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded block max-w-[120px] truncate mx-auto leading-none mt-1">
                                        by {displayBy}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Parts Receiving Overlay Dialog */}
      {receivingJob && (
        <div id="parts_receiving_overlay_dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 transition-all flex flex-col">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-black text-slate-900">Parts Receiving - {receivingJob.id}</h3>
                  <p className="text-xs text-slate-400">PO: {recPoNumber || 'None'} | Customer: <b className="text-slate-600">{receivingJob.customerName}</b></p>
                </div>
              </div>
              <button 
                onClick={() => setReceivingJob(null)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Purchase Order # *</label>
                  <input
                    type="text"
                    value={recPoNumber}
                    onChange={(e) => setRecPoNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800 font-semibold"
                    placeholder="e.g. PO-9182"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Supplier *</label>
                  <input
                    type="text"
                    value={recSupplier}
                    onChange={(e) => setRecSupplier(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                    placeholder="e.g. Roche Diagnostics"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Receiver *</label>
                  <input
                    type="text"
                    value={recReceiver}
                    onChange={(e) => setRecReceiver(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                    placeholder="Receiver Name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Part Number *</label>
                  <input
                    type="text"
                    value={recPartNumber}
                    onChange={(e) => setRecPartNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800 font-semibold"
                    placeholder="e.g. PV-929-VALVE"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Part Description *</label>
                  <input
                    type="text"
                    value={recPartDescription}
                    onChange={(e) => setRecPartDescription(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                    placeholder="e.g. Solenoid Valve Assembly"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Quantity Ordered *</label>
                  <input
                    type="number"
                    min="1"
                    value={recQuantityOrdered}
                    onChange={(e) => setRecQuantityOrdered(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800 font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Quantity Received *</label>
                  <input
                    type="number"
                    min="0"
                    value={recQuantityReceived}
                    onChange={(e) => setRecQuantityReceived(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800 font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Delivery Date *</label>
                  <input
                    type="date"
                    value={recDeliveryDate}
                    onChange={(e) => setRecDeliveryDate(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Courier</label>
                  <input
                    type="text"
                    value={recCourier}
                    onChange={(e) => setRecCourier(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                    placeholder="DHL, FedEx..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Tracking Number</label>
                  <input
                    type="text"
                    value={recTrackingNumber}
                    onChange={(e) => setRecTrackingNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                    placeholder="TRK-1928"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Supplier Invoice #</label>
                  <input
                    type="text"
                    value={recSupplierInvoiceNumber}
                    onChange={(e) => setRecSupplierInvoiceNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                    placeholder="INV-928"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Remarks *</label>
                  <input
                    type="text"
                    value={recRemarks}
                    onChange={(e) => setRecRemarks(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                    placeholder="Inspection results, batch number..."
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Condition *</label>
                  <select
                    value={recCondition}
                    onChange={(e) => setRecCondition(e.target.value as any)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="Good">Good (Perfect Match)</option>
                    <option value="Partial Delivery">Partial Delivery</option>
                    <option value="Damaged">Damaged / Defective</option>
                  </select>
                </div>
              </div>

              {recCondition === 'Partial Delivery' && (
                <div className="p-2.5 bg-amber-50 text-amber-900 rounded-xl text-[11px] border border-amber-100 flex items-start gap-1.5 font-semibold">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><b>Partial Delivery Action:</b> The job status will remain as <b>Awaiting Parts</b>. The list UI will display "Waiting Remaining Quantity" next to it.</span>
                </div>
              )}

              {recCondition === 'Damaged' && (
                <div className="p-2.5 bg-red-50 text-red-900 rounded-xl text-[11px] border border-red-100 flex items-start gap-1.5 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><b>Damaged Action:</b> The job status will automatically set to <b>Awaiting Replacement</b>. A dashboard notification will trigger.</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReceivingJob(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!recPoNumber || !recSupplier || !recPartNumber || !recPartDescription || !recRemarks || !recReceiver) {
                      alert('Please fill out all fields marked with *');
                      return;
                    }
                    handleDialogReceivePartsSubmit();
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Save Parts Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Engineer Overlay Dialog */}
      {assigningJob && (
        <div id="assign_job_overlay_dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 transition-all flex flex-col">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">Assign Job - {assigningJob.id}</h3>
                  <p className="text-xs text-slate-400">Customer: <b className="text-slate-600">{assigningJob.customerName}</b></p>
                </div>
              </div>
              <button 
                onClick={() => setAssigningJob(null)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Select Engineer / Technician *</label>
                <select
                  value={assigningEngineerId}
                  onChange={(e) => setAssigningEngineerId(e.target.value)}
                  className="w-full border border-slate-200 rounded p-2 text-xs bg-white text-slate-800 font-semibold"
                  required
                >
                  <option value="">Select Staff...</option>
                  {(users || MOCK_USERS).map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role} - {user.territory?.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Assignment Remarks</label>
                <input
                  type="text"
                  value={assignRemarks}
                  onChange={(e) => setAssignRemarks(e.target.value)}
                  className="w-full border border-slate-200 rounded p-2 text-xs bg-white text-slate-800"
                  placeholder="Additional instructions for the engineer..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssigningJob(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDialogAssignJobSubmit}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
