import React, { useState } from 'react';
import { 
  JobRecord, 
  JobStatus, 
  UserProfile, 
  WorkflowTimelineStep, 
  InstallationWorkflowData, 
  NonWarrantyWorkflowData, 
  WarrantyRepairWorkflowData, 
  WorkshopJobWorkflowData, 
  CalibrationWorkflowData 
} from '../types';
import { MOCK_USERS } from '../data/mockData';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Truck, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  Settings, 
  Layers, 
  Plus, 
  Info, 
  ExternalLink,
  ChevronDown,
  User
} from 'lucide-react';

interface JobWorkflowModalProps {
  job: JobRecord;
  activeUser: UserProfile;
  onClose: () => void;
  onUpdateJob: (updatedJob: JobRecord) => void;
}

export default function JobWorkflowModal({ job, activeUser, onClose, onUpdateJob }: JobWorkflowModalProps) {
  const [remarks, setRemarks] = useState('');
  
  // State transition variables depending on context
  const [selectedEngineerId, setSelectedEngineerId] = useState(job.assignedEngineerId || '');
  
  // Contact details update (compulsory at assignment/execution)
  const [endUserName, setEndUserName] = useState(
    job.installationData?.endUserName || 
    job.workshopJobData?.contactName || 
    job.nonWarrantyData?.inspectionReport ? 'Dr. Priyantha Silva' : ''
  );
  const [endUserContact, setEndUserContact] = useState(
    job.installationData?.endUserContact || 
    job.workshopJobData?.contactNumber || 
    job.nonWarrantyData?.inspectionReport ? '+94771234567' : ''
  );
  const [endUserLocation, setEndUserLocation] = useState(
    job.installationData?.endUserLocation || 
    job.nonWarrantyData?.inspectionReport ? 'Block B, 2nd Floor' : ''
  );
  const [genRemarks, setGenRemarks] = useState(
    job.installationData?.remarks || 
    job.workshopJobData?.remarks || ''
  );

  // Installation specific details
  const [warrantyCardNumber, setWarrantyCardNumber] = useState(job.installationData?.warrantyCardNumber || '');
  const [jobSheetNumber, setJobSheetNumber] = useState(job.installationData?.jobSheetNumber || '');
  const [nextServiceInterval, setNextServiceInterval] = useState<'6 Months' | '1 Year' | 'No Services'>(
    job.installationData?.nextServiceInterval || '6 Months'
  );

  // Service Reports
  const [serviceReportNumber, setServiceReportNumber] = useState(job.warrantyServiceData?.serviceReportNumber || '');

  // Non-Warranty and Repair Pricing & POs
  const [inspectionReportText, setInspectionReportText] = useState(
    job.nonWarrantyData?.inspectionReport || 
    job.warrantyRepairData?.inspectionReport || ''
  );
  const [pricingServiceRepair, setPricingServiceRepair] = useState<number>(
    job.nonWarrantyData?.pricingServiceRepair || 0
  );
  const [pricingCalibration, setPricingCalibration] = useState<number>(
    job.nonWarrantyData?.pricingCalibration || 0
  );
  const [poNumber, setPoNumber] = useState(job.nonWarrantyData?.poNumber || '');
  const [memoNumber, setMemoNumber] = useState(job.nonWarrantyData?.memoNumber || '');
  const [partsStatus, setPartsStatus] = useState<'Local Available' | 'Parts Ordered' | 'Parts Received' | 'N/A'>(
    job.nonWarrantyData?.partsStatus || job.warrantyRepairData?.partsStatus || 'Local Available'
  );

  // Invoicing Details
  const [invoiceNumber, setInvoiceNumber] = useState(
    job.nonWarrantyData?.invoiceNumber || job.calibrationData?.invoiceNumber || ''
  );
  const [invoiceAmountService, setInvoiceAmountService] = useState<number>(
    job.nonWarrantyData?.invoiceAmountService || 0
  );
  const [invoiceAmountCalibration, setInvoiceAmountCalibration] = useState<number>(
    job.nonWarrantyData?.invoiceAmountCalibration || 0
  );

  // Warranty repairs child delegation
  const [childJobIdInput, setChildJobIdInput] = useState('');

  // Workshop details
  const [takenOutside, setTakenOutside] = useState(job.workshopJobData?.takenOutsideWorkshop || false);
  const [outsideDetails, setOutsideDetails] = useState(job.workshopJobData?.outsideDetails || '');
  const [deliveryPersonName, setDeliveryPersonName] = useState(job.workshopJobData?.deliveryPersonName || '');

  // Calibration Certificate
  const [certificateNumber, setCertificateNumber] = useState(job.calibrationData?.certificateNumber || '');

  // Parts Receiving Details State
  const [recPoNumber, setRecPoNumber] = useState(job.partsReceiving?.poNumber || job.nonWarrantyData?.poNumber || '');
  const [recSupplier, setRecSupplier] = useState(job.partsReceiving?.supplier || '');
  const [recPartNumber, setRecPartNumber] = useState(job.partsReceiving?.partNumber || '');
  const [recPartDescription, setRecPartDescription] = useState(job.partsReceiving?.partDescription || '');
  const [recQuantityOrdered, setRecQuantityOrdered] = useState<number>(job.partsReceiving?.quantityOrdered || 1);
  const [recQuantityReceived, setRecQuantityReceived] = useState<number>(job.partsReceiving?.quantityReceived || 1);
  const [recDeliveryDate, setRecDeliveryDate] = useState(job.partsReceiving?.deliveryDate || new Date().toISOString().split('T')[0]);
  const [recSupplierInvoiceNumber, setRecSupplierInvoiceNumber] = useState(job.partsReceiving?.supplierInvoiceNumber || '');
  const [recCourier, setRecCourier] = useState(job.partsReceiving?.courier || '');
  const [recTrackingNumber, setRecTrackingNumber] = useState(job.partsReceiving?.trackingNumber || '');
  const [recReceiver, setRecReceiver] = useState(job.partsReceiving?.receiver || activeUser.name);
  const [recRemarks, setRecRemarks] = useState(job.partsReceiving?.remarks || '');
  const [recCondition, setRecCondition] = useState<'Good' | 'Damaged' | 'Partial Delivery'>(job.partsReceiving?.condition || 'Good');

  // Sub-tabs for parts pending actions
  const [partsTab, setPartsTab] = useState<'receive' | 'assign' | 'status'>('receive');
  const [manualTargetStatus, setManualTargetStatus] = useState<JobStatus>(job.status);

  // Workshop specific workflow states
  const [isAbandoning, setIsAbandoning] = useState(false);
  const [abandonReason, setAbandonReason] = useState('');
  const [partsToImportRequired, setPartsToImportRequired] = useState(job.workshopJobData?.partsToImportRequired || false);
  const [partsToImportDetails, setPartsToImportDetails] = useState(job.workshopJobData?.partsToImportDetails || '');
  const [newRepairStep, setNewRepairStep] = useState('');
  const [repairSteps, setRepairSteps] = useState<string[]>(job.workshopJobData?.repairSteps || []);
  const [repairEngineerId, setRepairEngineerId] = useState(job.workshopJobData?.repairAssignedEngineerId || '');
  const [testResult, setTestResult] = useState(job.workshopJobData?.testResult || 'PASSED: Fully calibrated and compliant with ISO requirements.');
  const [testHours, setTestHours] = useState<number>(job.workshopJobData?.testHours || 2);

  const currentStatus = (job.jobType === 'Workshop Job' && (job.status === 'In Progress' || job.status === 'Assigned'))
    ? 'Inspection Assigned'
    : (job.jobType === 'Workshop Job' && job.status === 'Pending Assignment')
      ? 'Job Received'
      : job.status;

  // Form Submissions
  const applyTransition = (nextStatus: JobStatus, customRemarks?: string) => {
    const now = new Date().toISOString();
    const updatedJob = { ...job };
    
    let targetStatus = nextStatus;
    if (nextStatus === 'Parts Ordered') {
      targetStatus = 'Awaiting Parts';
    }
    
    updatedJob.status = targetStatus;
    updatedJob.updatedAt = now;

    const auditRemarks = customRemarks || remarks || `Transitioned status to ${nextStatus}.`;
    
    // Push into workflow timeline
    const newStep: WorkflowTimelineStep = {
      status: nextStatus,
      updatedBy: `${activeUser.name} (${activeUser.role})`,
      updatedAt: now,
      remarks: auditRemarks
    };
    
    if (nextStatus === 'Parts Ordered') {
      const awaitingStep: WorkflowTimelineStep = {
        status: 'Awaiting Parts',
        updatedBy: 'System Automation',
        updatedAt: now,
        remarks: 'System automatically updated status to Awaiting Parts.'
      };
      updatedJob.timeline = [awaitingStep, newStep, ...job.timeline];
    } else {
      updatedJob.timeline = [newStep, ...job.timeline];
    }

    // Context-dependent mutations
    if (job.jobType === 'Workshop Job') {
      if (!updatedJob.workshopJobData) {
        updatedJob.workshopJobData = {
          acceptanceDate: now.split('T')[0],
          itemSerialNumber: job.serialNumber,
          institute: job.customerName,
          departmentSection: 'General Lab',
          contactName: endUserName || 'N/A',
          contactNumber: endUserContact || 'N/A',
          warrantyStatus: 'Warranty',
          partsReceivedWithItem: 'None',
          takenByDeliveryPerson: 'None',
          takenOutsideWorkshop: false
        };
      }

      if (nextStatus === 'Inspection Assigned') {
        const selectedEng = MOCK_USERS.find(u => u.id === selectedEngineerId);
        if (selectedEng) {
          updatedJob.assignedEngineerId = selectedEng.id;
          updatedJob.assignedEngineerName = selectedEng.name;
        }
      }

      if (nextStatus === 'Inspected') {
        updatedJob.workshopJobData.remarks = remarks || 'Inspection completed successfully.';
      }

      if (nextStatus === 'Quotation Raised') {
        updatedJob.workshopJobData.partsToImportRequired = partsToImportRequired;
        updatedJob.workshopJobData.partsToImportDetails = partsToImportRequired ? partsToImportDetails : undefined;
      }

      if (nextStatus === 'PO Received') {
        if (partsToImportRequired) {
          updatedJob.status = 'Awaiting Parts';
          newStep.status = 'Awaiting Parts';
          newStep.remarks = `PO Received (${poNumber || 'N/A'}). Awaiting overseas parts import: ${partsToImportDetails || 'None'}.`;
        } else {
          updatedJob.status = 'Repair In Progress';
          newStep.status = 'Repair In Progress';
          newStep.remarks = `PO Received (${poNumber || 'N/A'}). No imported parts needed. Repair initialized immediately.`;
        }
      }

      if (nextStatus === 'Repair In Progress') {
        const selectedRepEng = MOCK_USERS.find(u => u.id === repairEngineerId);
        if (selectedRepEng) {
          updatedJob.workshopJobData.repairAssignedEngineerId = selectedRepEng.id;
          updatedJob.workshopJobData.repairAssignedEngineerName = selectedRepEng.name;
          updatedJob.assignedEngineerId = selectedRepEng.id;
          updatedJob.assignedEngineerName = selectedRepEng.name;
        }
        updatedJob.workshopJobData.repairSteps = repairSteps;
      }

      if (nextStatus === 'Tested') {
        updatedJob.workshopJobData.testResult = testResult;
        updatedJob.workshopJobData.testHours = Number(testHours);
      }

      if (nextStatus === 'Job Abandoned') {
        updatedJob.workshopJobData.abandonedReason = abandonReason;
      }
    }

    if (nextStatus === 'Assigned') {
      const selectedEng = MOCK_USERS.find(u => u.id === selectedEngineerId);
      if (selectedEng) {
        updatedJob.assignedEngineerId = selectedEng.id;
        updatedJob.assignedEngineerName = selectedEng.name;
      }

      // Update customer end-user contact data (Strict Business Requirement)
      if (updatedJob.installationData) {
        updatedJob.installationData.endUserName = endUserName;
        updatedJob.installationData.endUserContact = endUserContact;
        updatedJob.installationData.endUserLocation = endUserLocation;
        updatedJob.installationData.remarks = genRemarks;
      }
    }

    if (nextStatus === 'Inspection Done') {
      if (updatedJob.nonWarrantyData) {
        updatedJob.nonWarrantyData.inspectionDone = true;
        updatedJob.nonWarrantyData.inspectionReport = inspectionReportText;
        updatedJob.nonWarrantyData.partsStatus = partsStatus;
      }
      if (updatedJob.warrantyRepairData) {
        updatedJob.warrantyRepairData.inspectionDone = true;
        updatedJob.warrantyRepairData.inspectionReport = inspectionReportText;
        updatedJob.warrantyRepairData.partsStatus = partsStatus;
      }
    }

    if (nextStatus === 'Inspection Validated') {
      if (updatedJob.nonWarrantyData) {
        updatedJob.nonWarrantyData.inspectionValidated = true;
      }
      if (updatedJob.warrantyRepairData) {
        updatedJob.warrantyRepairData.inspectionValidated = true;
      }
    }

    if (nextStatus === 'Pricing Done') {
      if (updatedJob.nonWarrantyData) {
        updatedJob.nonWarrantyData.pricingDone = true;
        updatedJob.nonWarrantyData.pricingServiceRepair = pricingServiceRepair;
        updatedJob.nonWarrantyData.pricingCalibration = pricingCalibration;
        updatedJob.nonWarrantyData.quotationPrice = pricingServiceRepair;
        updatedJob.nonWarrantyData.calibrationServicePrice = pricingCalibration;
      }
    }

    if (nextStatus === 'Quoted') {
      if (updatedJob.nonWarrantyData) {
        // Doc officer enters final values
        updatedJob.nonWarrantyData.quotationPrice = pricingServiceRepair;
        updatedJob.nonWarrantyData.calibrationServicePrice = pricingCalibration;
      }
    }

    if (nextStatus === 'PO Received') {
      if (updatedJob.nonWarrantyData) {
        updatedJob.nonWarrantyData.poReceived = true;
        updatedJob.nonWarrantyData.poNumber = poNumber;
        updatedJob.nonWarrantyData.memoNumber = memoNumber;
      }
    }

    if (nextStatus === 'Parts Ordered') {
      if (updatedJob.nonWarrantyData) {
        updatedJob.nonWarrantyData.partsStatus = 'Parts Ordered';
        updatedJob.nonWarrantyData.partsOrderedDate = now.split('T')[0];
      }
      if (updatedJob.warrantyRepairData) {
        updatedJob.warrantyRepairData.partsStatus = 'Parts Ordered';
        updatedJob.warrantyRepairData.partsOrderedDate = now.split('T')[0];
      }
    }

    if (nextStatus === 'Parts Received') {
      if (updatedJob.nonWarrantyData) {
        updatedJob.nonWarrantyData.partsStatus = 'Parts Received';
        updatedJob.nonWarrantyData.partsReceivedDate = now.split('T')[0];
      }
      if (updatedJob.warrantyRepairData) {
        updatedJob.warrantyRepairData.partsStatus = 'Parts Received';
        updatedJob.warrantyRepairData.partsReceivedDate = now.split('T')[0];
      }
    }

    if (nextStatus === 'Repair Completed') {
      if (updatedJob.nonWarrantyData) {
        updatedJob.nonWarrantyData.repairCompletedDate = now.split('T')[0];
      }
      if (updatedJob.warrantyRepairData) {
        updatedJob.warrantyRepairData.repairCompletedDate = now.split('T')[0];
      }
    }

    if (nextStatus === 'Completed') {
      if (updatedJob.installationData) {
        updatedJob.installationData.installationDate = now.split('T')[0];
        updatedJob.installationData.warrantyCardNumber = warrantyCardNumber;
        updatedJob.installationData.jobSheetNumber = jobSheetNumber;
        updatedJob.installationData.nextServiceInterval = nextServiceInterval;
      }
      if (updatedJob.warrantyServiceData) {
        updatedJob.warrantyServiceData.serviceDate = now.split('T')[0];
        updatedJob.warrantyServiceData.serviceReportNumber = serviceReportNumber;
        updatedJob.warrantyServiceData.isOverdue = false;
        updatedJob.warrantyServiceData.alertActive = false;
      }
      if (updatedJob.calibrationData) {
        updatedJob.calibrationData.calibrationDate = now.split('T')[0];
        updatedJob.calibrationData.certificateNumber = certificateNumber;
      }
    }

    if (nextStatus === 'Invoiced') {
      if (updatedJob.nonWarrantyData) {
        updatedJob.nonWarrantyData.invoiceRaised = true;
        updatedJob.nonWarrantyData.invoiceNumber = invoiceNumber;
        updatedJob.nonWarrantyData.invoiceAmountService = invoiceAmountService;
        updatedJob.nonWarrantyData.invoiceAmountCalibration = invoiceAmountCalibration;
      }
    }

    if (nextStatus === 'Ready For Delivery' || nextStatus === 'Closed') {
      if (updatedJob.workshopJobData) {
        updatedJob.workshopJobData.takenOutsideWorkshop = takenOutside;
        updatedJob.workshopJobData.outsideDetails = takenOutside ? outsideDetails : undefined;
        updatedJob.workshopJobData.deliveryPersonName = deliveryPersonName;
        updatedJob.workshopJobData.deliveryDate = now.split('T')[0];
        updatedJob.workshopJobData.deliveryReportNumber = `DIS-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    onUpdateJob(updatedJob);
    setRemarks('');
  };

  const handleAddRepairStep = () => {
    if (!newRepairStep.trim()) return;
    const updatedSteps = [...repairSteps, newRepairStep.trim()];
    setRepairSteps(updatedSteps);
    setNewRepairStep('');
    
    // Auto-persist step list
    const updatedJob = { ...job };
    if (!updatedJob.workshopJobData) {
      updatedJob.workshopJobData = {
        acceptanceDate: new Date().toISOString().split('T')[0],
        itemSerialNumber: job.serialNumber,
        institute: job.customerName,
        departmentSection: 'General Lab',
        contactName: 'N/A',
        contactNumber: 'N/A',
        warrantyStatus: 'Warranty',
        partsReceivedWithItem: 'None',
        takenByDeliveryPerson: 'None',
        takenOutsideWorkshop: false
      };
    }
    updatedJob.workshopJobData!.repairSteps = updatedSteps;
    onUpdateJob(updatedJob);
  };

  const handleRepairEngineerChange = (engId: string) => {
    setRepairEngineerId(engId);
    const selectedEng = MOCK_USERS.find(u => u.id === engId);
    
    // Auto-persist repair engineer
    const updatedJob = { ...job };
    if (!updatedJob.workshopJobData) {
      updatedJob.workshopJobData = {
        acceptanceDate: new Date().toISOString().split('T')[0],
        itemSerialNumber: job.serialNumber,
        institute: job.customerName,
        departmentSection: 'General Lab',
        contactName: 'N/A',
        contactNumber: 'N/A',
        warrantyStatus: 'Warranty',
        partsReceivedWithItem: 'None',
        takenByDeliveryPerson: 'None',
        takenOutsideWorkshop: false
      };
    }
    updatedJob.workshopJobData!.repairAssignedEngineerId = engId;
    updatedJob.workshopJobData!.repairAssignedEngineerName = selectedEng ? selectedEng.name : '';
    if (selectedEng) {
      updatedJob.assignedEngineerId = selectedEng.id;
      updatedJob.assignedEngineerName = selectedEng.name;
    }
    onUpdateJob(updatedJob);
  };

  const handleReceivePartsSubmit = () => {
    const now = new Date().toISOString();
    const updatedJob = { ...job };
    
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

    const partsReceivedStep: WorkflowTimelineStep = {
      status: 'Parts Received',
      updatedBy: `${activeUser.name} (${activeUser.role})`,
      updatedAt: now,
      remarks: `Parts physically received from ${recSupplier}. PO: ${recPoNumber}, Part: ${recPartNumber}, Qty: ${recQuantityReceived}/${recQuantityOrdered}, Condition: ${recCondition}. Courier: ${recCourier}, Tracking: ${recTrackingNumber}. Invoice: ${recSupplierInvoiceNumber}. Receiver: ${recReceiver}. Remarks: ${recRemarks}`
    };

    let nextStatus: JobStatus = 'Awaiting Parts';
    let secondaryStep: WorkflowTimelineStep | null = null;

    if (recCondition === 'Good' && Number(recQuantityReceived) === Number(recQuantityOrdered)) {
      nextStatus = 'Ready for Repair';
      secondaryStep = {
        status: 'Ready for Repair',
        updatedBy: 'System Automation',
        updatedAt: now,
        remarks: `Parts complete & verified. Job status set to Ready for Repair. Notification dispatched to Assigned Engineer (${job.assignedEngineerName || 'None'}).`
      };
    } else if (recCondition === 'Partial Delivery') {
      nextStatus = 'Awaiting Parts';
      secondaryStep = {
        status: 'Awaiting Parts',
        updatedBy: 'System Automation',
        updatedAt: now,
        remarks: `Partial delivery received (${recQuantityReceived}/${recQuantityOrdered}). Waiting remaining quantity.`
      };
    } else if (recCondition === 'Damaged') {
      nextStatus = 'Awaiting Replacement';
      secondaryStep = {
        status: 'Awaiting Replacement',
        updatedBy: 'System Automation',
        updatedAt: now,
        remarks: 'Damaged parts received. Status updated to Awaiting Replacement. Action required to notify supplier.'
      };
    }

    updatedJob.status = nextStatus;
    
    if (secondaryStep) {
      updatedJob.timeline = [secondaryStep, partsReceivedStep, ...job.timeline];
    } else {
      updatedJob.timeline = [partsReceivedStep, ...job.timeline];
    }

    onUpdateJob(updatedJob);
  };

  const getStepClass = (stepStatus: JobStatus) => {
    return currentStatus === stepStatus 
      ? 'border-blue-600 bg-blue-50 text-blue-700 font-extrabold'
      : job.timeline.some(t => t.status === stepStatus)
        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold'
        : 'border-slate-200 bg-slate-50 text-slate-400';
  };

  return (
    <div id="job_workflow_modal_backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div id="job_workflow_modal_body" className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 transition-all flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-blue-600 text-white px-2 py-0.5 rounded-md font-extrabold">
                {job.id}
              </span>
              <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                {job.jobType}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">{job.customerName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Asset: <b className="text-slate-700">{job.brand} {job.model}</b> (S/N: {job.serialNumber})</p>
          </div>
          <button 
            id="close_modal_btn"
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Core Content */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Timeline & Context Info Column (Left 1/3) */}
          <div className="md:col-span-1 border-r border-slate-100 pr-4 space-y-5">
            <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" /> State Progress Timeline
            </h3>

            {/* Micro progress steps */}
            <div className="space-y-2">
              {(
                job.jobType === 'Workshop Job'
                  ? (currentStatus === 'Job Abandoned'
                      ? ['Job Received', 'Inspection Assigned', 'Inspected', 'Quotation Raised', 'Waiting for PO', 'Awaiting Parts', 'Repair In Progress', 'Repair Completed', 'Tested', 'Completed', 'Job Abandoned']
                      : ['Job Received', 'Inspection Assigned', 'Inspected', 'Quotation Raised', 'Waiting for PO', 'Awaiting Parts', 'Repair In Progress', 'Repair Completed', 'Tested', 'Completed'])
                  : job.jobType === 'Non-Warranty Service' || job.jobType === 'Warranty Repair'
                    ? ['Pending Assignment', 'Assigned', 'Inspection Done', 'Quoted', 'PO Received', 'Awaiting Parts', 'Ready for Repair', 'Repair In Progress', 'QA', 'Ready For Delivery', 'Delivered', 'Closed']
                    : ['Pending Assignment', 'Assigned', 'Traveling', 'On Site', 'In Progress', 'Completed', 'Closed']
              ).map((st) => (
                <div 
                  key={st} 
                  className={`border rounded-lg px-3 py-1.5 text-xs flex items-center justify-between ${getStepClass(st as JobStatus)}`}
                >
                  <span>{st}</span>
                  {currentStatus === st && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                  )}
                  {job.timeline.some(t => t.status === st) && currentStatus !== st && (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
              ))}
            </div>

            {/* Historical Audit Steps */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="font-bold text-xs uppercase text-slate-400">Activity Logs</h4>
              <div className="space-y-3 max-h-[220px] overflow-y-auto text-[11px] font-medium text-slate-500">
                {job.timeline.map((step, idx) => (
                  <div key={idx} className="border-l-2 border-blue-500 pl-2.5 space-y-0.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="font-bold text-slate-700">{step.updatedBy.split(' ')[0]}</span>
                      <span>{new Date(step.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-slate-500 italic block">Status: <b className="text-blue-600">{step.status}</b></span>
                    <p className="text-slate-600 mt-1 bg-slate-50 p-1.5 rounded">{step.remarks}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Form Workspace Column (Right 2/3) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Context Alert warning */}
            {job.jobType === 'Warranty Service' && job.warrantyServiceData?.alertActive && (
              <div className="p-3 bg-red-50 text-red-800 border border-red-150 rounded-xl text-xs flex gap-2 items-start animate-pulse">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <div>
                  <span className="font-bold">Active Warranty Expiration Warning:</span> This instrument is within 1 month of its scheduled 6-month PM cycle or final warranty expiration date. Complete service SLA and hand over to Documentation officer.
                </div>
              </div>
            )}

            {/* Current State Details Banner */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Current Status</span>
                <span className="text-sm font-extrabold text-blue-700">{currentStatus}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Priority Duty</span>
                <span className="font-bold text-red-600">{job.priority}</span>
              </div>
            </div>

            {/* Dynamic Action Forms Block */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-2">
                Execute Workflow Handshakes
              </h3>

              {/* === WORKSHOP JOB WORKFLOW BLOCK === */}
              {job.jobType === 'Workshop Job' && (
                <div id="workshop_custom_workflow" className="space-y-6">
                  {/* Abandon Job Action (Floating alert/button at the top) */}
                  {currentStatus !== 'Completed' && currentStatus !== 'Closed' && currentStatus !== 'Job Abandoned' && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-700">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span className="font-bold text-xs uppercase tracking-wide">Danger Zone</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAbandoning(!isAbandoning)}
                          className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-red-200"
                        >
                          {isAbandoning ? 'Cancel' : 'Abandon This Job'}
                        </button>
                      </div>

                      {isAbandoning && (
                        <div className="space-y-3 pt-2 border-t border-slate-200">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 block">Reason for Abandonment *</label>
                            <textarea
                              value={abandonReason}
                              onChange={(e) => setAbandonReason(e.target.value)}
                              placeholder="Please specify why this repair is being ended/abandoned (e.g. Beyond economical repair, parts unavailable globally...)"
                              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
                              rows={3}
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!abandonReason.trim()) {
                                alert('Please provide a reason for abandoning the job.');
                                return;
                              }
                              applyTransition('Job Abandoned', `Job ended as Abandoned. Reason: ${abandonReason}`);
                              setIsAbandoning(false);
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all shadow cursor-pointer"
                          >
                            Confirm Job Abandoned & Halt Repair
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 1. STATE: Job Received */}
                  {currentStatus === 'Job Received' && (
                    <div className="space-y-4 bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50">
                      <div className="flex items-center gap-2 text-blue-800">
                        <CheckCircle className="w-5 h-5 text-blue-600 animate-pulse" />
                        <h4 className="font-bold text-base">Item Received & Logged</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        The instrument has been physically received at the workshop registry. The next step is to assign a qualified engineer/technician to carry out a comprehensive hardware and electronic circuit board inspection.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 block">Assign Inspection Engineer *</label>
                          <select
                            value={selectedEngineerId}
                            onChange={(e) => setSelectedEngineerId(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white font-semibold focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select Personnel...</option>
                            {MOCK_USERS.filter(u => u.role !== 'Documentation Officer').map(user => (
                              <option key={user.id} value={user.id}>
                                {user.name} ({user.role})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 block">Oversight Remarks</label>
                          <input
                            type="text"
                            placeholder="Initial check of physical integrity..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedEngineerId) {
                            alert('Please select an engineer for assignment.');
                            return;
                          }
                          const engName = MOCK_USERS.find(u => u.id === selectedEngineerId)?.name;
                          applyTransition('Inspection Assigned', `Assigned to ${engName} for technical inspection. Remarks: ${remarks || 'None'}`);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded-lg text-xs transition-all shadow cursor-pointer"
                      >
                        Assign & Move to Inspection Assigned
                      </button>
                    </div>
                  )}

                  {/* 2. STATE: Inspection Assigned */}
                  {currentStatus === 'Inspection Assigned' && (
                    <div className="space-y-4 bg-amber-50/30 p-5 rounded-2xl border border-amber-100/50">
                      <div className="flex items-center gap-2 text-amber-800">
                        <Clock className="w-5 h-5 text-amber-600 animate-spin" style={{ animationDuration: '3s' }} />
                        <h4 className="font-bold text-base">Under Inspection</h4>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <p>Assigned Personnel: <b className="text-slate-800">{job.assignedEngineerName}</b></p>
                        <p className="leading-relaxed">The physical instrument is currently on the workbench. The assigned technician must test, troubleshoot, diagnose fault states, and log a detailed inspection report.</p>
                      </div>

                      <div className="space-y-1 pt-2">
                        <label className="text-xs font-bold text-slate-600 block">Detailed Inspection & Fault Report *</label>
                        <textarea
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Provide detailed observations (e.g., motherboard IC-12 shorted, vacuum pump pressure low...)"
                          className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                          rows={4}
                          required
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!remarks.trim()) {
                            alert('Please log a detailed inspection and fault report.');
                            return;
                          }
                          applyTransition('Inspected', `Inspection completed by ${job.assignedEngineerName}. Report: ${remarks}`);
                        }}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold p-2.5 rounded-lg text-xs transition-all shadow cursor-pointer"
                      >
                        Submit Report & Mark as Inspected
                      </button>
                    </div>
                  )}

                  {/* 3. STATE: Inspected */}
                  {currentStatus === 'Inspected' && (
                    <div className="space-y-4 bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100/50">
                      <div className="flex items-center gap-2 text-indigo-800">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-bold text-base">Inspection Completed - Raise Quotation</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        The report has been completed. Prepare the pricing quotation for service, calibration, and potential replacement parts.
                      </p>

                      <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                        <span className="font-bold text-slate-400 uppercase text-[9px] block">Diagnosis Report</span>
                        <p className="text-slate-700 font-semibold italic">"{job.workshopJobData?.remarks || 'No remarks provided'}"</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 pt-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 block">Quotation Value (LKR) *</label>
                          <input
                            type="number"
                            value={pricingServiceRepair}
                            onChange={(e) => setPricingServiceRepair(Number(e.target.value))}
                            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-indigo-500"
                            placeholder="e.g. 45000"
                          />
                        </div>

                        <div className="space-y-2 pt-1">
                          <label className="flex items-center gap-2 text-xs font-extrabold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={partsToImportRequired}
                              onChange={(e) => setPartsToImportRequired(e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Are replacement parts required to be imported from overseas?</span>
                          </label>
                        </div>

                        {partsToImportRequired && (
                          <div className="space-y-1 animate-fadeIn">
                            <label className="text-xs font-bold text-slate-600 block">Overseas Parts to Import (Do not mention country) *</label>
                            <textarea
                              value={partsToImportDetails}
                              onChange={(e) => setPartsToImportDetails(e.target.value)}
                              placeholder="Describe the parts to be imported from overseas (e.g. High precision vacuum seal ring, 50W heating element, logic processor IC...)"
                              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-indigo-500"
                              rows={3}
                              required
                            />
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (pricingServiceRepair <= 0) {
                            alert('Please enter a valid quotation amount.');
                            return;
                          }
                          if (partsToImportRequired && !partsToImportDetails.trim()) {
                            alert('Please specify the parts that need to be imported.');
                            return;
                          }
                          applyTransition('Quotation Raised', `Quotation raised for LKR ${pricingServiceRepair}. Overseas parts required: ${partsToImportRequired ? 'Yes' : 'No'}.`);
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-lg text-xs transition-all shadow cursor-pointer"
                      >
                        Raise & Send Quotation to Customer
                      </button>
                    </div>
                  )}

                  {/* 4. STATE: Quotation Raised */}
                  {currentStatus === 'Quotation Raised' && (
                    <div className="space-y-4 bg-teal-50/30 p-5 rounded-2xl border border-teal-100/50">
                      <div className="flex items-center gap-2 text-teal-800">
                        <DollarSign className="w-5 h-5 text-teal-600" />
                        <h4 className="font-bold text-base">Quotation Raised & Sent</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        The quotation has been generated and dispatched to the customer. Awaiting customer confirmation to transition to the PO collection status.
                      </p>

                      <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold">Quotation Amount:</span>
                          <span className="font-extrabold text-slate-900">LKR {job.workshopJobData?.remarks ? pricingServiceRepair : (job.workshopJobData?.pricingServiceRepair || pricingServiceRepair)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold">Overseas Parts Imported:</span>
                          <span className="font-extrabold text-slate-900">{partsToImportRequired ? 'Yes (Required)' : 'No'}</span>
                        </div>
                        {partsToImportRequired && (
                          <div className="pt-1.5 border-t border-slate-100">
                            <span className="text-slate-400 block font-bold mb-1">Parts Details:</span>
                            <p className="bg-slate-50 p-2 rounded text-slate-700 font-medium italic">"{partsToImportDetails || job.workshopJobData?.partsToImportDetails}"</p>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          applyTransition('Waiting for PO', 'Quotation officially sent. Client reviewing. Awaiting Purchase Order (PO) dispatch.');
                        }}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold p-2.5 rounded-lg text-xs transition-all shadow cursor-pointer"
                      >
                        Mark as Awaiting PO
                      </button>
                    </div>
                  )}

                  {/* 5. STATE: Waiting for PO */}
                  {currentStatus === 'Waiting for PO' && (
                    <div className="space-y-4 bg-sky-50/30 p-5 rounded-2xl border border-sky-100/50">
                      <div className="flex items-center gap-2 text-sky-800">
                        <Clock className="w-5 h-5 text-sky-600 animate-pulse" />
                        <h4 className="font-bold text-base">Awaiting Purchase Order (PO)</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        The quotation has been sent. We are waiting for the customer to issue a Purchase Order (PO) to authorize and finance the repair job.
                      </p>

                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 block">Purchase Order (PO) Number *</label>
                          <input
                            type="text"
                            value={poNumber}
                            onChange={(e) => setPoNumber(e.target.value)}
                            placeholder="e.g. PO-8891-COL"
                            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-sky-500 font-semibold"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 block">Approval / Intake Remarks</label>
                          <input
                            type="text"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="e.g. PO received via email, approved by procurement officer."
                            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-sky-500"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!poNumber.trim()) {
                            alert('Please enter a valid PO number.');
                            return;
                          }
                          applyTransition('PO Received', `PO Number ${poNumber} collected successfully. Remarks: ${remarks || 'None'}`);
                        }}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold p-2.5 rounded-lg text-xs transition-all shadow cursor-pointer"
                      >
                        Confirm PO Received
                      </button>
                    </div>
                  )}

                  {/* 6. STATE: Awaiting Parts */}
                  {currentStatus === 'Awaiting Parts' && (
                    <div className="space-y-4 bg-orange-50/30 p-5 rounded-2xl border border-orange-100/50">
                      <div className="flex items-center gap-2 text-orange-800">
                        <Truck className="w-5 h-5 text-orange-600 animate-bounce" />
                        <h4 className="font-bold text-base">Awaiting Overseas Parts Import</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        The Purchase Order was verified. However, physical repair is on hold waiting for overseas parts import.
                      </p>

                      <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                        <span className="text-slate-400 font-bold block uppercase text-[9px]">Overseas Parts Details</span>
                        <p className="text-slate-700 font-semibold italic">"{job.workshopJobData?.partsToImportDetails || partsToImportDetails || 'Special spare parts requested.'}"</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          applyTransition('Repair In Progress', 'Overseas replacement parts successfully received at workshop bench. Proceeding to repair.');
                        }}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold p-2.5 rounded-lg text-xs transition-all shadow cursor-pointer"
                      >
                        Confirm Parts Received & Initiate Repair
                      </button>
                    </div>
                  )}

                  {/* 7. STATE: Repair In Progress */}
                  {currentStatus === 'Repair In Progress' && (
                    <div className="space-y-5 bg-violet-50/30 p-5 rounded-2xl border border-violet-100/50">
                      <div className="flex items-center gap-2 text-violet-800">
                        <Settings className="w-5 h-5 text-violet-600 animate-spin" style={{ animationDuration: '4s' }} />
                        <h4 className="font-bold text-base">Repair Underway (Step-by-Step)</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        The active repair process is in progress. Assign or switch the repair engineer step-by-step and document progressive repair tasks.
                      </p>

                      {/* Step-by-Step Repair Engineer assignment */}
                      <div className="space-y-1.5 p-3.5 bg-white border border-slate-100 rounded-xl">
                        <label className="text-xs font-extrabold text-slate-700 block">Assign Repair Engineer</label>
                        <select
                          value={repairEngineerId || job.assignedEngineerId || ''}
                          onChange={(e) => handleRepairEngineerChange(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white font-semibold focus:ring-1 focus:ring-violet-500"
                        >
                          <option value="">Select Repair Staff...</option>
                          {MOCK_USERS.filter(u => u.role !== 'Documentation Officer').map(user => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.role})
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-slate-400 mt-0.5">Note: You can reassign separate engineers for specific repair steps if needed.</p>
                      </div>

                      {/* Steps Log */}
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-700 block">Documented Repair Steps</label>
                        
                        {repairSteps.length === 0 ? (
                          <div className="text-center py-4 bg-slate-50 rounded-lg border border-slate-150 text-[11px] text-slate-400 italic">
                            No step logs created yet. Add the first repair task below.
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                            {repairSteps.map((step, sIdx) => (
                              <div key={sIdx} className="flex gap-2 items-start text-xs bg-white p-2 rounded-lg border border-slate-100 shadow-xs">
                                <span className="bg-violet-100 text-violet-800 rounded px-1.5 py-0.5 text-[9px] font-bold">Step {sIdx+1}</span>
                                <p className="text-slate-700 font-medium flex-1">{step}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-1.5 pt-1">
                          <input
                            type="text"
                            placeholder="Add next log (e.g., Soldered central IC resistor...)"
                            value={newRepairStep}
                            onChange={(e) => setNewRepairStep(e.target.value)}
                            className="flex-1 border border-slate-200 rounded-lg px-2.5 py-2 text-xs bg-white focus:ring-1 focus:ring-violet-500"
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRepairStep(); } }}
                          />
                          <button
                            type="button"
                            onClick={handleAddRepairStep}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow cursor-pointer"
                          >
                            Add Log
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (repairSteps.length === 0) {
                            alert('Please record at least one repair step log before completing.');
                            return;
                          }
                          applyTransition('Repair Completed', 'Completed all physical repair steps successfully.');
                        }}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold p-2.5 rounded-lg text-xs transition-all shadow cursor-pointer"
                      >
                        Complete Physical Repair (Move to Repair Completed)
                      </button>
                    </div>
                  )}

                  {/* 8. STATE: Repair Completed */}
                  {currentStatus === 'Repair Completed' && (
                    <div className="space-y-4 bg-pink-50/30 p-5 rounded-2xl border border-pink-100/50">
                      <div className="flex items-center gap-2 text-pink-800">
                        <ShieldCheck className="w-5 h-5 text-pink-600 animate-pulse" />
                        <h4 className="font-bold text-base">Repair Complete - Quality Testing</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Physical repair successfully finished. Now, update the testing calibration result and log total test validation running hours.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 block">Logged Testing Hours *</label>
                          <input
                            type="number"
                            step="0.1"
                            value={testHours}
                            onChange={(e) => setTestHours(Number(e.target.value))}
                            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-pink-500 font-semibold"
                            placeholder="e.g. 3.5"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 block">Quality test compliance status *</label>
                          <select
                            value={testResult}
                            onChange={(e) => setTestResult(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white font-semibold focus:ring-1 focus:ring-pink-500"
                            required
                          >
                            <option value="PASSED: Fully calibrated and compliant with ISO requirements.">Passed (Fully compliant)</option>
                            <option value="PASSED WITH RE-ADJUSTMENT: Had standard deviation drift, corrected manually.">Passed after adjustments</option>
                            <option value="PARTIAL COMPLIANCE: Functional, but some margin channels show small drift.">Partial Compliance</option>
                            <option value="FAILED TESTING: Calibration standard failed. Repair re-evaluation needed.">Failed quality check</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (testHours <= 0) {
                            alert('Please enter a valid amount of test hours.');
                            return;
                          }
                          applyTransition('Tested', `Testing complete. Results: ${testResult} (Logged test duration: ${testHours} hours).`);
                        }}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold p-2.5 rounded-lg text-xs transition-all shadow cursor-pointer"
                      >
                        Submit Quality Test Results
                      </button>
                    </div>
                  )}

                  {/* 9. STATE: Tested */}
                  {currentStatus === 'Tested' && (
                    <div className="space-y-4 bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100/50">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <CheckCircle className="w-5 h-5 text-emerald-600 animate-pulse" />
                        <h4 className="font-bold text-base">Testing Confirmed - Confirm Completion</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Calibration and quality checks have been processed. Confirm complete to certify that the instrument is fully ready.
                      </p>

                      <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold">Total Quality Run Hours:</span>
                          <span className="font-extrabold text-slate-950">{job.workshopJobData?.testHours || testHours} Hours</span>
                        </div>
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-slate-400 block font-bold mb-1">Testing Compliance Report:</span>
                          <p className="font-semibold text-emerald-700">"{job.workshopJobData?.testResult || testResult}"</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          applyTransition('Completed', 'Instrument confirmed complete. Ready for handoff and delivery.');
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg text-xs transition-all shadow cursor-pointer"
                      >
                        Confirm Instrument Completed
                      </button>
                    </div>
                  )}

                  {/* 10. STATE: Completed */}
                  {currentStatus === 'Completed' && (
                    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-bold text-base">Process Complete & Validated</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        This workshop repair has completed successfully, verified under strict ISO testing and PO receipts. Ready to close this compliance ticket.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          applyTransition('Closed', 'Job ticket closed and officially archived.');
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold p-2.5 rounded-lg text-xs transition-all shadow cursor-pointer"
                      >
                        Archive & Close Job Ticket
                      </button>
                    </div>
                  )}

                  {/* 11. STATE: Closed */}
                  {currentStatus === 'Closed' && (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl bg-slate-50/50">
                      <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                      <h4 className="font-bold text-sm text-slate-800">Workshop Ticket Archived</h4>
                      <p className="text-xs text-slate-400 mt-1">This job is marked as Closed. All processes are verified and saved successfully.</p>
                    </div>
                  )}

                  {/* 12. STATE: Job Abandoned */}
                  {currentStatus === 'Job Abandoned' && (
                    <div className="p-6 text-center border-2 border-dashed border-red-200 bg-red-50/30 rounded-2xl">
                      <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2 animate-bounce" />
                      <h4 className="font-bold text-sm text-red-800">Job Ended (Abandoned)</h4>
                      <div className="text-xs text-slate-600 mt-2 space-y-1">
                        <p className="font-bold">Abandonment Reason:</p>
                        <p className="bg-white p-3 rounded-xl border border-red-100 italic text-slate-700 font-semibold">
                          "{job.workshopJobData?.abandonedReason || abandonReason || 'No details specified.'}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {job.jobType !== 'Workshop Job' && (
                <>
                  {/* 1. STATE: PENDING ASSIGNMENT FORM (Visible to Workshop Managers / Supervisors) */}
                  {job.status === 'Pending Assignment' && (
                <div id="assign_form" className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Assign Engineer / Technician Work Force
                  </h4>

                  {/* Mandate End User contact details update */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                      Verify/Update Customer End-User Data (Compulsory for SLA Assignment)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">End User Name *</label>
                        <input
                          type="text"
                          value={endUserName}
                          onChange={(e) => setEndUserName(e.target.value)}
                          className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white"
                          placeholder="Dr. Priyantha"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Contact Number *</label>
                        <input
                          type="text"
                          value={endUserContact}
                          onChange={(e) => setEndUserContact(e.target.value)}
                          className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white"
                          placeholder="+9477XXXXXXX"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Location / Room *</label>
                        <input
                          type="text"
                          value={endUserLocation}
                          onChange={(e) => setEndUserLocation(e.target.value)}
                          className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white"
                          placeholder="Main Lab Block B"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Select Personnel Tag Force *</label>
                      <select
                        id="select_engineer_assign"
                        value={selectedEngineerId}
                        onChange={(e) => setSelectedEngineerId(e.target.value)}
                        className="w-full border border-slate-200 rounded p-2 text-xs bg-white font-semibold"
                      >
                        <option value="">Select Staff...</option>
                        {MOCK_USERS.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.role} - {user.territory?.split(' ')[0]})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Oversight Remarks</label>
                      <input
                        type="text"
                        placeholder="Dispatched via western terminal guidelines..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    id="submit_assign_btn"
                    onClick={() => {
                      if (!selectedEngineerId || !endUserName || !endUserContact) {
                        alert('Please fill compulsory End User data and select an engineer for assignment.');
                        return;
                      }
                      applyTransition('Assigned', `Assigned task to ${MOCK_USERS.find(u => u.id === selectedEngineerId)?.name}. Customer Contact: ${endUserName} (${endUserContact}).`);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                  >
                    Commit Dispatch & Handoff Assigned
                  </button>
                </div>
              )}

              {/* 2. STATE: ASSIGNED (Staff accepting & departure) */}
              {job.status === 'Assigned' && (
                <div id="travel_forms" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase">Field Engineer Actions</h4>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block font-mono">Log Departure Travel Notes</label>
                    <input
                      type="text"
                      placeholder="Leaving head office with Sysmex tools..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => applyTransition('Traveling', remarks || 'Engineer departed with equipment.')}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold p-2.5 rounded-lg text-xs flex justify-center items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Truck className="w-4 h-4" /> Transit: Start Traveling
                    </button>
                  </div>
                </div>
              )}

              {/* 3. STATE: TRAVELING */}
              {job.status === 'Traveling' && (
                <div id="arrive_forms" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase">On Site Arrival Handshake</h4>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Arrival Remarks</label>
                    <input
                      type="text"
                      placeholder="Arrived on site. Gained laboratory clearance..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => applyTransition('On Site', remarks || 'Engineer logged on site check-in.')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                  >
                    Set Status: Check-in On Site
                  </button>
                </div>
              )}

              {/* 4. STATE: ON SITE or IN PROGRESS (Execution of Work, Report Handover) */}
              {(job.status === 'On Site' || job.status === 'In Progress') && (
                <div id="execution_forms" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700">Submit Service Report / Inspection Report</h4>
                  
                  {/* Form fields change depending on workflow type */}
                  {job.jobType === 'Installation' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Warranty Card Number *</label>
                        <input
                          type="text"
                          value={warrantyCardNumber}
                          onChange={(e) => setWarrantyCardNumber(e.target.value)}
                          className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                          placeholder="WC-XXXXX"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Job Sheet / Report Number *</label>
                        <input
                          type="text"
                          value={jobSheetNumber}
                          onChange={(e) => setJobSheetNumber(e.target.value)}
                          className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                          placeholder="JS-XXXXX"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">Next Service Interval *</label>
                        <select
                          value={nextServiceInterval}
                          onChange={(e) => setNextServiceInterval(e.target.value as '6 Months' | '1 Year' | 'No Services')}
                          className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white"
                        >
                          <option value="6 Months">6 Months Interval</option>
                          <option value="1 Year">1 Year Interval</option>
                          <option value="No Services">No Services Scheduled</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {job.jobType === 'Warranty Service' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Service Report Number *</label>
                      <input
                        type="text"
                        value={serviceReportNumber}
                        onChange={(e) => setServiceReportNumber(e.target.value)}
                        className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                        placeholder="SR-WARR-XXXX"
                        required
                      />
                    </div>
                  )}

                  {(job.jobType === 'Non-Warranty Service' || job.jobType === 'Warranty Repair') && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">Physical Inspection Report Findings *</label>
                        <textarea
                          value={inspectionReportText}
                          onChange={(e) => setInspectionReportText(e.target.value)}
                          className="w-full border border-slate-200 rounded p-2 text-xs bg-white h-20"
                          placeholder="Detail findings, faulty components, blockages, reagent pressure status..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 block">Local Parts Status *</label>
                          <select
                            value={partsStatus}
                            onChange={(e) => setPartsStatus(e.target.value as any)}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white"
                          >
                            <option value="Local Available">Locally Available in Stock (SLA 5 Days)</option>
                            <option value="Parts Ordered">Parts Awaiting Order (International procurement)</option>
                            <option value="Parts Received">Parts Received from Germany/Japan</option>
                            <option value="N/A">Not Applicable (Clean & Flush only)</option>
                          </select>
                        </div>

                        {job.jobType === 'Warranty Repair' && (
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 block">Delegated Child Jobs (Optional)</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Sub job ID..."
                                value={childJobIdInput}
                                onChange={(e) => setChildJobIdInput(e.target.value)}
                                className="w-full border border-slate-200 rounded p-1 text-xs bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (childJobIdInput) {
                                    alert(`Delegated helper subtask ${childJobIdInput} to Trainee Engineer.`);
                                    setChildJobIdInput('');
                                  }
                                }}
                                className="bg-slate-100 border text-[10px] px-2 rounded hover:bg-slate-200"
                              >
                                Delegate
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {job.jobType === 'Calibration' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">SLAB Certificate Serial Number *</label>
                      <input
                        type="text"
                        value={certificateNumber}
                        onChange={(e) => setCertificateNumber(e.target.value)}
                        className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                        placeholder="CERT-17025-XXXX"
                        required
                      />
                    </div>
                  )}

                  {(job.jobType as string) === 'Workshop Job' && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chk_taken_outside"
                          checked={takenOutside}
                          onChange={(e) => setTakenOutside(e.target.checked)}
                          className="rounded border-slate-300"
                        />
                        <label htmlFor="chk_taken_outside" className="text-xs font-bold text-slate-700">
                          Log: Item taken OUTSIDE the workshop premise (External Calibration / CNC machining)
                        </label>
                      </div>

                      {takenOutside && (
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 block">External Movement Record Details *</label>
                          <input
                            type="text"
                            value={outsideDetails}
                            onChange={(e) => setOutsideDetails(e.target.value)}
                            className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                            placeholder="CNC lathe machining in local toolroom, return expected in 2 days"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 block">Delivery Dispatch Person Name *</label>
                        <input
                          type="text"
                          value={deliveryPersonName}
                          onChange={(e) => setDeliveryPersonName(e.target.value)}
                          className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                          placeholder="Sarath Perera (Avon Dispatch)"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-slate-600 block">Performance Execution Notes *</label>
                    <input
                      type="text"
                      placeholder="Detail checklist values, pressure meters, software flashes completed..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    {/* Choose appropriate completion transition */}
                    {job.jobType === 'Installation' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!warrantyCardNumber || !jobSheetNumber) {
                            alert('Please fill out warranty card number and job sheet number.');
                            return;
                          }
                          applyTransition('Completed', `Installation completed successfully. Warranty Card handed over: ${warrantyCardNumber}. Next PM interval: ${nextServiceInterval}. Remarks: ${remarks}`);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                      >
                        Handover Installation Report & Warranty Card
                      </button>
                    )}

                    {job.jobType === 'Warranty Service' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!serviceReportNumber) {
                            alert('Please fill out Service Report Number.');
                            return;
                          }
                          applyTransition('Completed', `Warranty Service PM completed. Report Number: ${serviceReportNumber}. Remarks: ${remarks}`);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                      >
                        Complete PM Service & Sign Report
                      </button>
                    )}

                    {(job.jobType === 'Non-Warranty Service' || job.jobType === 'Warranty Repair') && (
                      <div className="flex gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => {
                            if (!inspectionReportText) {
                              alert('Please fill out Inspection Report Text.');
                              return;
                            }
                            applyTransition('Inspection Done', `Inspection report uploaded by engineer. Parts Status: ${partsStatus}. Remarks: ${remarks}`);
                          }}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                        >
                          Submit Inspection Report & Wait Validation
                        </button>
                      </div>
                    )}

                    {job.jobType === 'Calibration' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!certificateNumber) {
                            alert('Please fill out Certificate Number.');
                            return;
                          }
                          applyTransition('Completed', `Calibration complete. SLAB Calibration certificate ${certificateNumber} issued. Remarks: ${remarks}`);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                      >
                        Issue Calibration Certificate
                      </button>
                    )}

                    {(job.jobType as string) === 'Workshop Job' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!deliveryPersonName) {
                            alert('Please fill delivery dispatch details.');
                            return;
                          }
                          applyTransition('Ready For Delivery', `Workshop repair cycle finished. Dispatched via delivery person: ${deliveryPersonName}. Remarks: ${remarks}`);
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                      >
                        Approve Workshop QA & Set Ready For Delivery
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 5. STATE: INSPECTION DONE (Supervisor validation step) */}
              {job.status === 'Inspection Done' && (
                <div id="validation_forms" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Supervisor Inspection Validation
                  </h4>
                  <p className="text-xs text-slate-500">Review inspection report: <i>"{job.nonWarrantyData?.inspectionReport || job.warrantyRepairData?.inspectionReport}"</i></p>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Supervisor Review Remarks</label>
                    <input
                      type="text"
                      placeholder="Inspection is verified. Scope matches standard repair blocks..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => applyTransition('Inspection Validated', remarks || 'Supervisor validated physical inspection report.')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow"
                  >
                    Validate & Release to Pricing Desk
                  </button>
                </div>
              )}

              {/* 6. STATE: INSPECTION VALIDATED (Pricing Desk) */}
              {job.status === 'Inspection Validated' && (
                <div id="pricing_forms" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-blue-600" /> Area Engineer Pricing Desk
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Service & Repair Valuation (LKR) *</label>
                      <input
                        type="number"
                        value={pricingServiceRepair}
                        onChange={(e) => setPricingServiceRepair(parseFloat(e.target.value) || 0)}
                        className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                        placeholder="e.g. 15000"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Calibration Service Price (LKR separate) *</label>
                      <input
                        type="number"
                        value={pricingCalibration}
                        onChange={(e) => setPricingCalibration(parseFloat(e.target.value) || 0)}
                        className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                        placeholder="e.g. 8500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Valuation Remarks</label>
                    <input
                      type="text"
                      placeholder="Pricing calibrated with default Sysmex service tables..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!pricingServiceRepair) {
                        alert('Please set service/repair pricing.');
                        return;
                      }
                      applyTransition('Pricing Done', `Pricing formulated by Area Engineer. Service: LKR ${pricingServiceRepair}, Calibration: LKR ${pricingCalibration}. Remarks: ${remarks}`);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow"
                  >
                    Approve Pricing & Submit to Doc Officer
                  </button>
                </div>
              )}

              {/* 7. STATE: PRICING DONE (Documentation officer prepares Quotation) */}
              {job.status === 'Pricing Done' && (
                <div id="quotation_forms" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" /> Prepare & Dispatch Customer Quotation
                  </h4>
                  <div className="text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg border">
                    Valuation details from pricing desk:
                    <div className="grid grid-cols-2 mt-1.5 font-mono">
                      <span>Service & Repair: LKR {job.nonWarrantyData?.pricingServiceRepair}</span>
                      <span>Calibration Price: LKR {job.nonWarrantyData?.pricingCalibration}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Quotation Remarks</label>
                    <input
                      type="text"
                      placeholder="Quotation dispatched via sales terminal, PDF reference #QUO-2026-921"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => applyTransition('Quoted', remarks || 'Customer quotation dispatched by Documentation Officer.')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow"
                  >
                    Submit Quotation to Customer Terminal
                  </button>
                </div>
              )}

              {/* 8. STATE: QUOTED (Awaiting approval, receiving PO & Memo number) */}
              {job.status === 'Quoted' && (
                <div id="po_forms" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" /> Log PO (Purchase Order) & Head Office Memo
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Customer PO / Service Order Number *</label>
                      <input
                        type="text"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                        placeholder="PO-NWH-92911"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Head Office Authorization Memo Number *</label>
                      <input
                        type="text"
                        value={memoNumber}
                        onChange={(e) => setMemoNumber(e.target.value)}
                        className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                        placeholder="MEMO-2026-0429"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">General Remarks</label>
                    <input
                      type="text"
                      placeholder="PO matching quoted value verified. Approved for execution..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!poNumber || !memoNumber) {
                        alert('Please enter both the Purchase Order (PO) number and the Head Office Memo number.');
                        return;
                      }
                      applyTransition('PO Received', `PO Verified & Logged. PO #: ${poNumber}, Memo #: ${memoNumber}. Remarks: ${remarks}`);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow"
                  >
                    Commit PO Received & Release for Repair Execution
                  </button>
                </div>
              )}

              {/* 9. STATE: PO RECEIVED (Proceed to Repair) */}
              {job.status === 'PO Received' && (
                <div id="repair_execution" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700">Repair execution under authorized PO</h4>
                  <p className="text-xs text-slate-500">Memo Number: <b className="text-slate-700">{job.nonWarrantyData?.memoNumber}</b> is logged. Proceed with physical component fitment.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Procurement Parts Logistics *</label>
                      <select
                        value={partsStatus}
                        onChange={(e) => setPartsStatus(e.target.value as any)}
                        className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white font-semibold"
                      >
                        <option value="Local Available">Locally Available in Stock (SLA 5 Days)</option>
                        <option value="Parts Ordered">Parts Awaiting Order (International procurement)</option>
                        <option value="Parts Received">Parts Received from Germany/Japan</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Execution Remarks</label>
                      <input
                        type="text"
                        placeholder="Fitting pinch valve PV-929..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => applyTransition('Parts Ordered', remarks || 'Initiated international parts dispatch.')}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold p-2 rounded text-xs cursor-pointer shadow"
                    >
                      Log Parts Ordered
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTransition('Parts Received', remarks || 'Logged parts physically received at warehouse.')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded text-xs cursor-pointer shadow"
                    >
                      Log Parts Received
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTransition('Repair Completed', remarks || 'Repair completed and validated on-site.')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2 rounded text-xs cursor-pointer shadow"
                    >
                      Complete Physical Repair
                    </button>
                  </div>
                </div>
              )}

              {/* Parts Receiving Workflow Stage (Parts Ordered, Awaiting Parts & Awaiting Replacement) */}
              {(job.status === 'Parts Ordered' || job.status === 'Awaiting Parts' || job.status === 'Awaiting Replacement') && (
                <div className="space-y-4">
                  {/* Tab Selector Buttons */}
                  <div className="flex gap-2 border-b border-slate-200 pb-1">
                    <button
                      type="button"
                      onClick={() => setPartsTab('receive')}
                      className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all border-b-2 ${
                        partsTab === 'receive'
                          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5 inline mr-1.5" />
                      Update Parts Received
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartsTab('assign')}
                      className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all border-b-2 ${
                        partsTab === 'assign'
                          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 inline mr-1.5" />
                      Assign Job
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartsTab('status')}
                      className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all border-b-2 ${
                        partsTab === 'status'
                          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5 inline mr-1.5" />
                      Manual State Override
                    </button>
                  </div>

                  {/* Active Tab Contents */}
                  {partsTab === 'receive' && (
                    <div id="parts_receiving_form" className="bg-slate-50 p-5 rounded-2xl space-y-4 border border-slate-200">
                      <div className="flex items-center gap-2 border-b border-slate-150 pb-2">
                        <Truck className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="text-sm font-black text-slate-800">Parts Receiving & Inspection Handshake</h4>
                          <p className="text-[10px] text-slate-500">Record arriving parts to auto-transition the job according to our quality control guidelines.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Purchase Order # *</label>
                          <input
                            type="text"
                            value={recPoNumber}
                            onChange={(e) => setRecPoNumber(e.target.value)}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white font-semibold text-slate-800"
                            placeholder="e.g. PO-NWH-92911"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Supplier *</label>
                          <input
                            type="text"
                            value={recSupplier}
                            onChange={(e) => setRecSupplier(e.target.value)}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                            placeholder="e.g. Roche Germany"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Receiver *</label>
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
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Part Number *</label>
                          <input
                            type="text"
                            value={recPartNumber}
                            onChange={(e) => setRecPartNumber(e.target.value)}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white font-semibold text-slate-800"
                            placeholder="e.g. PV-929-VALVE"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Part Description *</label>
                          <input
                            type="text"
                            value={recPartDescription}
                            onChange={(e) => setRecPartDescription(e.target.value)}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                            placeholder="e.g. Solenoid Pinch Valve"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Quantity Ordered *</label>
                          <input
                            type="number"
                            min="1"
                            value={recQuantityOrdered}
                            onChange={(e) => setRecQuantityOrdered(Number(e.target.value))}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white font-bold text-slate-800"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Quantity Received *</label>
                          <input
                            type="number"
                            min="0"
                            value={recQuantityReceived}
                            onChange={(e) => setRecQuantityReceived(Number(e.target.value))}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white font-bold text-slate-800"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Delivery Date *</label>
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
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Courier Partner</label>
                          <input
                            type="text"
                            value={recCourier}
                            onChange={(e) => setRecCourier(e.target.value)}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                            placeholder="e.g. DHL, FedEx"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Courier Tracking #</label>
                          <input
                            type="text"
                            value={recTrackingNumber}
                            onChange={(e) => setRecTrackingNumber(e.target.value)}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                            placeholder="e.g. TRK-91829"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Supplier Invoice #</label>
                          <input
                            type="text"
                            value={recSupplierInvoiceNumber}
                            onChange={(e) => setRecSupplierInvoiceNumber(e.target.value)}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                            placeholder="e.g. INV-GER-2918"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Receiving Remarks / Notes *</label>
                          <input
                            type="text"
                            value={recRemarks}
                            onChange={(e) => setRecRemarks(e.target.value)}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-slate-800"
                            placeholder="Verify seal integrity, batch serials, etc..."
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Part Condition *</label>
                          <select
                            value={recCondition}
                            onChange={(e) => setRecCondition(e.target.value as any)}
                            className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white font-bold text-slate-800"
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
                          <span><b>Partial Delivery System Action:</b> The job status will remain as <b>Awaiting Parts</b>. The UI will prominently display the warning "Waiting Remaining Quantity".</span>
                        </div>
                      )}

                      {recCondition === 'Damaged' && (
                        <div className="p-2.5 bg-red-50 text-red-900 rounded-xl text-[11px] border border-red-100 flex items-start gap-1.5 font-semibold">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <span><b>Damaged Condition System Action:</b> The job status will automatically update to <b>Awaiting Replacement</b>. This will log an alert on the Dashboard and notify the supervisor.</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (!recPoNumber || !recSupplier || !recPartNumber || !recPartDescription || !recRemarks) {
                            alert('Please fill out all required fields marked with *');
                            return;
                          }
                          handleReceivePartsSubmit();
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl text-xs cursor-pointer shadow transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Save Parts Receipt & Execute Quality Assessment
                      </button>
                    </div>
                  )}

                  {partsTab === 'assign' && (
                    <div id="parts_assign_form" className="bg-slate-50 p-5 rounded-2xl space-y-4 border border-slate-200">
                      <div className="flex items-center gap-2 border-b border-slate-150 pb-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="text-sm font-black text-slate-800">Assign Job / Dispatch Personnel</h4>
                          <p className="text-[10px] text-slate-500">Assign or reassign an engineer to execute this repair once parts are ready.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Assigned Engineer</label>
                          <select
                            value={selectedEngineerId}
                            onChange={(e) => setSelectedEngineerId(e.target.value)}
                            className="w-full border border-slate-200 rounded p-2 text-xs bg-white text-slate-800 font-semibold"
                          >
                            <option value="">Select Staff...</option>
                            {MOCK_USERS.map(user => (
                              <option key={user.id} value={user.id}>
                                {user.name} ({user.role} - {user.territory?.split(' ')[0]})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Assignment Remarks / Directives</label>
                          <input
                            type="text"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full border border-slate-200 rounded p-2 text-xs bg-white text-slate-800"
                            placeholder="e.g. Please prioritize once parts arrive..."
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedEngineerId) {
                              alert('Please select an engineer.');
                              return;
                            }
                            const selectedEng = MOCK_USERS.find(u => u.id === selectedEngineerId);
                            if (!selectedEng) return;

                            const now = new Date().toISOString();
                            const updatedJob = { ...job };
                            updatedJob.assignedEngineerId = selectedEng.id;
                            updatedJob.assignedEngineerName = selectedEng.name;
                            updatedJob.updatedAt = now;

                            const newStep = {
                              status: job.status,
                              updatedBy: `${activeUser.name} (${activeUser.role})`,
                              updatedAt: now,
                              remarks: remarks || `Assigned job to engineer: ${selectedEng.name} while parts are pending.`
                            };
                            updatedJob.timeline = [newStep, ...job.timeline];

                            onUpdateJob(updatedJob);
                            alert(`Successfully assigned ${selectedEng.name} to this job.`);
                            setRemarks('');
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl text-xs cursor-pointer shadow transition-all flex items-center justify-center gap-1.5"
                        >
                          <User className="w-4 h-4" /> Assign Job & Commit
                        </button>
                      </div>
                    </div>
                  )}

                  {partsTab === 'status' && (
                    <div id="parts_status_override_form" className="bg-slate-50 p-5 rounded-2xl space-y-4 border border-slate-200">
                      <div className="flex items-center gap-2 border-b border-slate-150 pb-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="text-sm font-black text-slate-800">Manual Job State Override</h4>
                          <p className="text-[10px] text-slate-500">Manually update the status of this job, overriding the default parts flow.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Target Job Status *</label>
                          <select
                            value={manualTargetStatus}
                            onChange={(e) => setManualTargetStatus(e.target.value as any)}
                            className="w-full border border-slate-200 rounded p-2 text-xs bg-white text-slate-800 font-semibold"
                          >
                            <option value="Awaiting Parts">Awaiting Parts</option>
                            <option value="Awaiting Replacement">Awaiting Replacement</option>
                            <option value="Parts Received">Parts Received</option>
                            <option value="Ready for Repair">Ready for Repair</option>
                            <option value="Repair In Progress">Repair In Progress</option>
                            <option value="QA">QA</option>
                            <option value="Ready For Delivery">Ready For Delivery</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">Override Reason / Audit Remarks *</label>
                          <input
                            type="text"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full border border-slate-200 rounded p-2 text-xs bg-white text-slate-800"
                            placeholder="Must provide audit reasons under quality control guidelines..."
                            required
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!remarks) {
                              alert('Please provide override reason / audit remarks.');
                              return;
                            }
                            const now = new Date().toISOString();
                            const updatedJob = { ...job };
                            updatedJob.status = manualTargetStatus;
                            updatedJob.updatedAt = now;

                            const newStep = {
                              status: manualTargetStatus,
                              updatedBy: `${activeUser.name} (${activeUser.role})`,
                              updatedAt: now,
                              remarks: remarks
                            };
                            updatedJob.timeline = [newStep, ...job.timeline];

                            if (manualTargetStatus === 'Parts Received' || manualTargetStatus === 'Ready for Repair') {
                              if (updatedJob.nonWarrantyData) {
                                updatedJob.nonWarrantyData.partsStatus = 'Parts Received';
                              }
                              if (updatedJob.warrantyRepairData) {
                                updatedJob.warrantyRepairData.partsStatus = 'Parts Received';
                              }
                            }

                            onUpdateJob(updatedJob);
                            alert(`Successfully updated job status to ${manualTargetStatus}.`);
                            setRemarks('');
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl text-xs cursor-pointer shadow transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" /> Update Job State & Commit Override
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ready for Repair Stage */}
              {job.status === 'Ready for Repair' && (
                <div id="ready_for_repair_form" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Equipment is Ready for Repair
                  </h4>
                  <p className="text-xs text-slate-500">Parts have been successfully received and passed initial inspection. Proceed to start physical repair work.</p>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Repair Remarks</label>
                    <input
                      type="text"
                      placeholder="Preparing workspace for physical fitment..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => applyTransition('Repair In Progress', remarks || 'Initiated physical repair of equipment.')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                  >
                    Set to Repair In Progress
                  </button>
                </div>
              )}

              {/* Repair In Progress Stage */}
              {job.status === 'Repair In Progress' && (
                <div id="repair_in_progress_form" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-amber-500" /> Repair In Progress
                  </h4>
                  <p className="text-xs text-slate-500">Physical fitment of parts and recalibration is currently active. Once finished, submit for internal QA check.</p>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">QA Notes / Testing Remarks *</label>
                    <input
                      type="text"
                      placeholder="Pinch valve fitted, leak test successful. Calibration tests running..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!remarks) {
                        alert('Please fill out testing remarks before submitting to QA.');
                        return;
                      }
                      applyTransition('QA', remarks);
                    }}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                  >
                    Submit for QA Testing
                  </button>
                </div>
              )}

              {/* QA Stage */}
              {job.status === 'QA' && (
                <div id="qa_form" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Internal Quality Assurance (QA) Check
                  </h4>
                  <p className="text-xs text-slate-500">Perform quality verification on chemical baselines and mechanical components. Once verified, set to Ready for Delivery.</p>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">QA Validation Certificate Remarks *</label>
                    <input
                      type="text"
                      placeholder="Baseline calibration certified within ±0.01% deviation. Approved."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!remarks) {
                        alert('Please enter QA approval notes.');
                        return;
                      }
                      applyTransition('Ready For Delivery', `QA Approved: ${remarks}`);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                  >
                    Approve QA & Set Ready For Delivery
                  </button>
                </div>
              )}

              {/* 10. STATE: REPAIR COMPLETED or PARTS RECEIVED (Release to Complete/Invoice) */}
              {(job.status === 'Repair Completed' || job.status === 'Parts Received') && (
                <div id="completion_or_deliver" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700">Complete Repair Session & Sign-off</h4>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Report Summary Notes *</label>
                    <input
                      type="text"
                      placeholder="Completed chemical baseline calibration checks..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => applyTransition('Completed', remarks || 'Repair successfully calibrated and handed over to end user.')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                  >
                    Transition to Completed status
                  </button>
                </div>
              )}

              {/* 11. STATE: COMPLETED (Awaiting invoicing) */}
              {job.status === 'Completed' && (
                <div id="invoice_desk" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" /> Raise Billing & Invoicing (Documentation Officer)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600">Enterprise Invoice Number *</label>
                      <input
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white"
                        placeholder="INV-2026-948"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600">Service Fee Billed (LKR) *</label>
                      <input
                        type="number"
                        value={invoiceAmountService}
                        onChange={(e) => setInvoiceAmountService(parseFloat(e.target.value) || 0)}
                        className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white"
                        placeholder="e.g. 15000"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600">Calibration Fee Billed (LKR separate) *</label>
                      <input
                        type="number"
                        value={invoiceAmountCalibration}
                        onChange={(e) => setInvoiceAmountCalibration(parseFloat(e.target.value) || 0)}
                        className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white"
                        placeholder="e.g. 8500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">General Invoicing Notes</label>
                    <input
                      type="text"
                      placeholder="Invoice dispatched to customer accounts wing..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!invoiceNumber) {
                        alert('Please fill out the invoice number.');
                        return;
                      }
                      applyTransition('Invoiced', `Raised invoice #: ${invoiceNumber}. Service billing amount: LKR ${invoiceAmountService}, Calibration billing amount: LKR ${invoiceAmountCalibration}. Remarks: ${remarks}`);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow"
                  >
                    Commit Invoice Generation & Log Amounts
                  </button>
                </div>
              )}

              {/* Ready For Delivery Stage for Parts-Enhanced Workflows */}
              {job.status === 'Ready For Delivery' && ((job.jobType as string) === 'Non-Warranty Service' || (job.jobType as string) === 'Warranty Repair' || (job.jobType as string) === 'Workshop Job') && (
                <div id="ready_for_delivery_parts" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Equipment Ready for Delivery
                  </h4>
                  <p className="text-xs text-slate-500">QA checks have been completed and baseline performance is certified. Confirm dispatch and physical delivery to client.</p>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Delivery Person / Courier Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. DHL, FedEx, or Representative name"
                      value={deliveryPersonName}
                      onChange={(e) => setDeliveryPersonName(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Delivery Notes / Remarks</label>
                    <input
                      type="text"
                      placeholder="Physically handed over calibrated instrument to head nurse..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!deliveryPersonName) {
                        alert('Please specify the delivery person or courier.');
                        return;
                      }
                      applyTransition('Delivered', remarks || `Equipment dispatched via courier/person: ${deliveryPersonName}.`);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow-md"
                  >
                    Confirm Delivery Dispatch (Set to Delivered)
                  </button>
                </div>
              )}

              {/* 12. STATE: DELIVERED, READY FOR DELIVERY (Standard), or INVOICED (Ready to Close) */}
              {(job.status === 'Delivered' || job.status === 'Invoiced' || 
                (job.status === 'Ready For Delivery' && !((job.jobType as string) === 'Non-Warranty Service' || (job.jobType as string) === 'Warranty Repair' || (job.jobType as string) === 'Workshop Job')) || 
                (job.status === 'Completed' && job.jobType === 'Warranty Service')) && (
                <div id="close_desk" className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700">Archival & Close Ticket</h4>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">Archival Remarks</label>
                    <input
                      type="text"
                      placeholder="Customer signature verified. Service sheet closed..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-slate-200 rounded p-2 text-xs bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => applyTransition('Closed', remarks || 'Session officially archived and closed.')}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer shadow"
                  >
                    Approve Final Handshake & Close Ticket
                  </button>
                </div>
              )}

                  {/* 13. CLOSED STATE */}
                  {job.status === 'Closed' && (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                      <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                      <h4 className="font-bold text-sm text-slate-800">Job Ticket Officially Closed</h4>
                      <p className="text-xs text-slate-400 mt-1">This operational ticket is finalized and archived for quality compliance audits.</p>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
