import React, { useState, useEffect } from 'react';
import { 
  InstrumentAsset, 
  JobRecord, 
  CustomerProfile, 
  UserProfile, 
  JobStatus, 
  InventoryItem, 
  AuditLogRecord 
} from '../types';
import { MOCK_USERS } from '../data/mockData';
import { 
  Calendar, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Search, 
  Wrench, 
  Clock, 
  Sparkles, 
  User, 
  ShieldAlert, 
  TrendingUp, 
  FileText,
  BadgeAlert,
  FolderSync,
  Trash2,
  Edit3,
  ClipboardList,
  CheckSquare,
  Square,
  Activity,
  FileCheck,
  Truck,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
  X,
  Gauge,
  Cpu,
  Package,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PmSchedulerProps {
  activeUser: UserProfile;
  assets: InstrumentAsset[];
  customers: CustomerProfile[];
  jobs: JobRecord[];
  inventory?: InventoryItem[];
  onUpdateAsset: (updatedAsset: InstrumentAsset) => void;
  onAddJob: (job: JobRecord) => void;
  onUpdateJob?: (job: JobRecord) => void;
  onUpdateInventory?: (updatedInv: InventoryItem[]) => void;
}

// PM Plan interface
interface PmPlan {
  id: string;
  name: string;
  description: string;
  interval: '3 Months' | '6 Months' | '1 Year';
  equipmentBrand: string;
  equipmentModel: string;
  checklist: string[];
  spareParts: { partId: string; partName: string; quantity: number }[];
}

// PM Schedule interface
interface PmSchedule {
  id: string;
  assetId: string;
  assetNumber: string;
  assetName: string; // Brand + Model
  customerName: string;
  planId: string;
  planName: string;
  interval: string;
  lastPmDate?: string;
  nextPmDueDate: string;
  assignedEngineerId: string;
  assignedEngineerName: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
}

const DEFAULT_PLANS: PmPlan[] = [
  {
    id: 'plan-hplc-01',
    name: 'HPLC Quarterly Calibration & PM Plan',
    description: 'Standard 3-month mechanical fluidic and detector wavelength calibration check.',
    interval: '3 Months',
    equipmentBrand: 'AGILENT',
    equipmentModel: '1260 Infinity II',
    checklist: [
      'Inspect all fluidic connections and capillary tubing for leaks',
      'Replace rotor seal and plunger seals',
      'Check lamp intensity and verify UV-Vis detector wavelength accuracy',
      'Purge pump heads and perform pressure-holding diagnostics',
      'Run caffeine standard verification injection'
    ],
    spareParts: [
      { partId: 'part-01', partName: 'Plunger Seal Kit', quantity: 2 },
      { partId: 'part-02', partName: 'Rotor Seal (PEEK)', quantity: 1 }
    ]
  },
  {
    id: 'plan-sys-02',
    name: 'Sysmex Blood Analyzer Semi-Annual PM Plan',
    description: '6-month comprehensive fluidic line cleaning, laser calibration, and blank validation.',
    interval: '6 Months',
    equipmentBrand: 'SYSMEX',
    equipmentModel: 'XN-1000 Hematology Analyzer',
    checklist: [
      'Clean aspiration needle and rinse cup assembly',
      'Replace waste chamber tubing and check vacuum lines',
      'Calibrate optical laser sensor and high-voltage PMT gain offsets',
      'Perform background count check with blank diluent',
      'Validate cell distribution precision with Sysmex Control Blood'
    ],
    spareParts: [
      { partId: 'part-03', partName: 'Aspiration Needle Assembly', quantity: 1 },
      { partId: 'part-04', partName: 'Silicon Waste Tubing (1m)', quantity: 1 }
    ]
  },
  {
    id: 'plan-cobas-03',
    name: 'Roche Chem-Analyzer Annual Overhaul Plan',
    description: 'Yearly overhaul covering syringe plunger assembly and PMT board diagnostic alignment.',
    interval: '1 Year',
    equipmentBrand: 'ROCHE',
    equipmentModel: 'Cobas e411',
    checklist: [
      'Replace main syringe plunger and aspiration tubing harness',
      'Inspect incubational bath temperature stabilization metrics',
      'Replace photomultiplier tube (PMT) reference card',
      'Perform optical gain calibration and alignment checks',
      'Run 5-point NIST calibration standard run and sign off'
    ],
    spareParts: [
      { partId: 'part-05', partName: 'Roche PMT Module Card', quantity: 1 },
      { partId: 'part-06', partName: 'Syringe Plunger Assembly', quantity: 1 }
    ]
  }
];

// Helper to determine typical engineers
const getRelevantEngineerForCustomer = (customerName: string) => {
  if (customerName.includes('Asiri') || customerName.includes('Hospital')) {
    return MOCK_USERS.find(u => u.id === 'usr_bio') || MOCK_USERS[0];
  }
  if (customerName.includes('Industrial') || customerName.includes('SPMC') || customerName.includes('State')) {
    return MOCK_USERS.find(u => u.id === 'usr_sr_bio') || MOCK_USERS[0];
  }
  return MOCK_USERS.find(u => u.id === 'usr_tech') || MOCK_USERS[0];
};

// Helper to check if a PM is due soon or overdue
const isPmDueSoon = (nextPmDateStr?: string) => {
  if (!nextPmDateStr) return false;
  const nextPmDate = new Date(nextPmDateStr);
  const now = new Date();
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(now.getMonth() + 1);
  return nextPmDate <= oneMonthFromNow;
};

// Helper to add months to date
const calculateNextDueDate = (baseDateStr: string, interval: string): string => {
  const date = new Date(baseDateStr);
  let monthsToAdd = 6;
  if (interval === '3 Months') monthsToAdd = 3;
  if (interval === '6 Months') monthsToAdd = 6;
  if (interval === '1 Year') monthsToAdd = 12;
  
  date.setMonth(date.getMonth() + monthsToAdd);
  return date.toISOString().split('T')[0];
};

export default function PmScheduler({ 
  activeUser, 
  assets, 
  customers, 
  jobs, 
  inventory = [],
  onUpdateAsset, 
  onAddJob,
  onUpdateJob,
  onUpdateInventory
}: PmSchedulerProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Alert' | 'Warranty' | 'AMC'>('All');
  const [activeTab, setActiveTab] = useState<'status' | 'plans' | 'schedules' | 'completion'>('status');

  // PM Plans State
  const [plans, setPlans] = useState<PmPlan[]>(() => {
    const saved = localStorage.getItem('avon_pm_plans');
    return saved ? JSON.parse(saved) : DEFAULT_PLANS;
  });

  // PM Schedules State
  const [schedules, setSchedules] = useState<PmSchedule[]>(() => {
    const saved = localStorage.getItem('avon_pm_schedules');
    if (saved) return JSON.parse(saved);
    
    // Auto-generate some schedules to start with
    const initial: PmSchedule[] = [];
    assets.slice(0, 5).forEach((asset, idx) => {
      const plan = DEFAULT_PLANS[idx % DEFAULT_PLANS.length];
      const eng = getRelevantEngineerForCustomer(asset.customerName);
      const nextDate = asset.nextPmDate || asset.nextServiceDate || new Date().toISOString().split('T')[0];
      initial.push({
        id: `sch_${asset.id.substring(4)}_${idx}`,
        assetId: asset.id,
        assetNumber: asset.assetNumber,
        assetName: `${asset.brand} ${asset.model}`,
        customerName: asset.customerName,
        planId: plan.id,
        planName: plan.name,
        interval: plan.interval,
        lastPmDate: asset.lastPmDate,
        nextPmDueDate: nextDate,
        assignedEngineerId: eng.id,
        assignedEngineerName: eng.name,
        status: isPmDueSoon(nextDate) ? 'Overdue' : 'Scheduled'
      });
    });
    return initial;
  });

  // Keep schedules synchronized with assets' nextPmDate / lastPmDate
  useEffect(() => {
    const updatedSchedules = schedules.map(sched => {
      const matchedAsset = assets.find(a => a.id === sched.assetId);
      if (matchedAsset) {
        const nextDate = matchedAsset.nextPmDate || matchedAsset.nextServiceDate || sched.nextPmDueDate;
        return {
          ...sched,
          lastPmDate: matchedAsset.lastPmDate || sched.lastPmDate,
          nextPmDueDate: nextDate,
          status: (isPmDueSoon(nextDate) ? 'Overdue' : 'Scheduled') as any
        };
      }
      return sched;
    });
    
    let changed = false;
    for (let i = 0; i < updatedSchedules.length; i++) {
      if (updatedSchedules[i].nextPmDueDate !== schedules[i].nextPmDueDate || 
          updatedSchedules[i].lastPmDate !== schedules[i].lastPmDate ||
          updatedSchedules[i].status !== schedules[i].status) {
        changed = true;
        break;
      }
    }
    
    if (changed) {
      setSchedules(updatedSchedules);
      localStorage.setItem('avon_pm_schedules', JSON.stringify(updatedSchedules));
    }
  }, [assets]);

  // Save changes helper
  const savePlans = (updatedPlans: PmPlan[]) => {
    setPlans(updatedPlans);
    localStorage.setItem('avon_pm_plans', JSON.stringify(updatedPlans));
  };

  const saveSchedules = (updatedSchedules: PmSchedule[]) => {
    setSchedules(updatedSchedules);
    localStorage.setItem('avon_pm_schedules', JSON.stringify(updatedSchedules));
  };

  // Form states for PM Plan Creator
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanDesc, setNewPlanDesc] = useState('');
  const [newPlanInterval, setNewPlanInterval] = useState<'3 Months' | '6 Months' | '1 Year'>('6 Months');
  const [newPlanBrand, setNewPlanBrand] = useState('');
  const [newPlanModel, setNewPlanModel] = useState('');
  const [newChecklistStep, setNewChecklistStep] = useState('');
  const [newPlanChecklist, setNewPlanChecklist] = useState<string[]>([]);
  const [selectedSparePartId, setSelectedSparePartId] = useState('');
  const [selectedSparePartQty, setSelectedSparePartQty] = useState(1);
  const [newPlanSpareParts, setNewPlanSpareParts] = useState<{ partId: string; partName: string; quantity: number }[]>([]);

  // Form states for Mapping/Scheduling Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [scheduledStartDate, setScheduledStartDate] = useState('');
  const [selectedEngineerId, setSelectedEngineerId] = useState('');

  // Active Completion Worksheet state
  const [activeJobForWorksheet, setActiveJobForWorksheet] = useState<any | null>(null);
  const [worksheetChecklist, setWorksheetChecklist] = useState<{ task: string; done: boolean }[]>([]);
  const [groundResistance, setGroundResistance] = useState('0.12');
  const [fluidicPressure, setFluidicPressure] = useState('2.4');
  const [opticalGain, setOpticalGain] = useState('45.2');
  const [systemPressureHold, setSystemPressureHold] = useState('Pass');
  const [selectedPartsToConsume, setSelectedPartsToConsume] = useState<{ [partId: string]: boolean }>({});
  const [completionReportNumber, setCompletionReportNumber] = useState('');
  const [completionRemarks, setCompletionRemarks] = useState('');
  const [customerSignoff, setCustomerSignoff] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [certifiedJob, setCertifiedJob] = useState<any | null>(null);

  // States for editing an asset's PM configuration
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editInterval, setEditInterval] = useState<'3 Months' | '6 Months' | '1 Year' | 'No Services'>('6 Months');
  const [editLastPmDate, setEditLastPmDate] = useState('');
  const [editNextPmDate, setEditNextPmDate] = useState('');

  // Calculate high-level stats
  const totalAssets = assets.length;
  
  const underWarrantyCount = assets.filter(asset => {
    if (!asset.installationDate) return false;
    const installDate = new Date(asset.installationDate);
    const expiryDate = new Date(installDate);
    expiryDate.setMonth(installDate.getMonth() + asset.warrantyPeriodMonths);
    return expiryDate > new Date();
  }).length;

  const underAmcCount = assets.filter(asset => {
    const cust = customers.find(c => c.name === asset.customerName);
    return (cust?.contracts && cust.contracts.length > 0) || asset.amcStatus === 'Active';
  }).length;

  const activePmAlerts = assets.filter(asset => {
    const nextDate = asset.nextPmDate || asset.nextServiceDate;
    return isPmDueSoon(nextDate);
  });

  // PM Jobs in Progress list
  const activePmJobs = jobs.filter(j => 
    (j.jobType === 'Warranty Service' || j.jobType === 'Non-Warranty Service') && 
    j.status !== 'Closed' && 
    j.status !== 'Completed'
  );

  // Manual configuration updates
  const handleStartEdit = (asset: InstrumentAsset) => {
    setEditingAssetId(asset.id);
    setEditInterval(asset.nextServiceInterval || '6 Months');
    setEditLastPmDate(asset.lastPmDate || '');
    setEditNextPmDate(asset.nextPmDate || asset.nextServiceDate || '');
  };

  const handleSaveEdit = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const updatedAsset: InstrumentAsset = {
      ...asset,
      nextServiceInterval: editInterval,
      lastPmDate: editLastPmDate || undefined,
      nextPmDate: editNextPmDate || undefined,
      nextServiceDate: editNextPmDate || undefined,
    };

    onUpdateAsset(updatedAsset);
    setEditingAssetId(null);
  };

  const handleRecalculateNextPm = (asset: InstrumentAsset) => {
    if (!asset.installationDate) return;
    const installDate = new Date(asset.installationDate);
    const nextDate = new Date(installDate);
    
    let monthsToAdd = 6;
    if (asset.nextServiceInterval === '3 Months') monthsToAdd = 3;
    if (asset.nextServiceInterval === '1 Year') monthsToAdd = 12;

    nextDate.setMonth(installDate.getMonth() + monthsToAdd);
    const calculatedDateStr = nextDate.toISOString().split('T')[0];

    const updatedAsset: InstrumentAsset = {
      ...asset,
      nextPmDate: calculatedDateStr,
      nextServiceDate: calculatedDateStr
    };

    onUpdateAsset(updatedAsset);
  };

  // Generate / Dispatch PM Job
  const handleAutoGeneratePmTask = (asset: InstrumentAsset, matchingPlan?: PmPlan) => {
    const nextDateStr = asset.nextPmDate || asset.nextServiceDate || new Date().toISOString().split('T')[0];
    const engineer = getRelevantEngineerForCustomer(asset.customerName);
    const jobType = asset.amcStatus === 'Active' ? 'Non-Warranty Service' : 'Warranty Service';
    const pmId = `pm_${asset.id.substring(4)}_${Date.now().toString().substring(10)}`;

    const plan = matchingPlan || plans.find(p => p.equipmentBrand.toUpperCase() === asset.brand.toUpperCase()) || DEFAULT_PLANS[0];

    const newJob: any = {
      id: pmId,
      jobType: jobType,
      status: 'Pending Assignment' as JobStatus,
      priority: 'Routine',
      customerName: asset.customerName,
      brand: asset.brand,
      model: asset.model,
      serialNumber: asset.serialNumber,
      createdById: activeUser.id,
      createdByRole: activeUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedEngineerId: engineer.id,
      assignedEngineerName: engineer.name,
      timeline: [
        {
          status: 'Pending Assignment' as JobStatus,
          updatedBy: 'Automated PM Scheduler Engine',
          updatedAt: new Date().toISOString(),
          remarks: `Automated PM dispatched based on contract PM Plan "${plan.name}" (${plan.interval}). Default Area Engineer ${engineer.name} assigned.`
        }
      ],
      warrantyServiceData: jobType === 'Warranty Service' ? {
        dueDate: new Date(nextDateStr).toISOString(),
        isOverdue: new Date(nextDateStr) < new Date(),
        alertActive: true
      } : undefined,
      nonWarrantyData: jobType === 'Non-Warranty Service' ? {
        departmentSection: asset.department,
        issueDescription: `Scheduled routine preventive maintenance calibration for ${asset.brand} ${asset.model} under active PM/AMC plan.`,
        inspectionDone: false,
        inspectionValidated: false,
        partsStatus: 'N/A',
        invoiceRaised: false
      } : undefined,
      // Custom embedded PM worksheet data
      pmData: {
        planId: plan.id,
        planName: plan.name,
        checklist: plan.checklist.map(task => ({ task, done: false })),
        measurements: [
          { name: 'Electrical Ground (Ohm)', value: '' },
          { name: 'Fluidic Pressure (bar)', value: '' },
          { name: 'Optical Calibration Gain (dB)', value: '' }
        ],
        partsUsed: plan.spareParts.map(p => ({ partId: p.partId, name: p.partName, quantity: p.quantity, consumed: false }))
      }
    };

    // Auto update schedule status to In Progress
    const updatedSchedules = schedules.map(s => {
      if (s.assetId === asset.id) {
        return { ...s, status: 'In Progress' as const };
      }
      return s;
    });
    saveSchedules(updatedSchedules);

    onAddJob(newJob as JobRecord);
    
    // Jump sub-tab to active PM logs
    setActiveTab('completion');
  };

  // Add a new custom PM Plan Template
  const handleAddChecklistStep = () => {
    if (!newChecklistStep.trim()) return;
    setNewPlanChecklist([...newPlanChecklist, newChecklistStep.trim()]);
    setNewChecklistStep('');
  };

  const handleAddSparePart = () => {
    if (!selectedSparePartId) return;
    const item = inventory.find(i => i.id === selectedSparePartId);
    if (!item) return;

    // Check if already exists in local list
    if (newPlanSpareParts.some(p => p.partId === item.id)) {
      alert('Spare part already added to plan template.');
      return;
    }

    setNewPlanSpareParts([...newPlanSpareParts, {
      partId: item.id,
      partName: item.partName,
      quantity: selectedSparePartQty
    }]);
    setSelectedSparePartId('');
    setSelectedSparePartQty(1);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName || !newPlanBrand || !newPlanModel) {
      alert('Please fill out all required PM Plan fields.');
      return;
    }

    const newPlan: PmPlan = {
      id: `plan-${Date.now()}`,
      name: newPlanName,
      description: newPlanDesc,
      interval: newPlanInterval,
      equipmentBrand: newPlanBrand,
      equipmentModel: newPlanModel,
      checklist: newPlanChecklist.length > 0 ? newPlanChecklist : ['General safety check', 'Clean fluidics and components', 'Verify system calibration metrics'],
      spareParts: newPlanSpareParts
    };

    savePlans([newPlan, ...plans]);
    setShowCreatePlanModal(false);

    // Reset fields
    setNewPlanName('');
    setNewPlanDesc('');
    setNewPlanBrand('');
    setNewPlanModel('');
    setNewPlanChecklist([]);
    setNewPlanSpareParts([]);
  };

  // Map/Schedule Asset to PM Plan
  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !selectedPlanId || !scheduledStartDate || !selectedEngineerId) {
      alert('Please select all schedule details.');
      return;
    }

    const asset = assets.find(a => a.id === selectedAssetId);
    const plan = plans.find(p => p.id === selectedPlanId);
    const eng = MOCK_USERS.find(u => u.id === selectedEngineerId);

    if (!asset || !plan || !eng) return;

    // Create a new schedule track
    const newSchedule: PmSchedule = {
      id: `sch_${asset.id.substring(4)}_${Date.now()}`,
      assetId: asset.id,
      assetNumber: asset.assetNumber,
      assetName: `${asset.brand} ${asset.model}`,
      customerName: asset.customerName,
      planId: plan.id,
      planName: plan.name,
      interval: plan.interval,
      lastPmDate: asset.lastPmDate,
      nextPmDueDate: scheduledStartDate,
      assignedEngineerId: eng.id,
      assignedEngineerName: eng.name,
      status: isPmDueSoon(scheduledStartDate) ? 'Overdue' : 'Scheduled'
    };

    saveSchedules([newSchedule, ...schedules]);

    // Update asset configuration to link to plan interval
    const updatedAsset: InstrumentAsset = {
      ...asset,
      nextServiceInterval: plan.interval,
      nextPmDate: scheduledStartDate,
      nextServiceDate: scheduledStartDate
    };
    onUpdateAsset(updatedAsset);

    setShowScheduleModal(false);
    setSelectedAssetId('');
    setSelectedPlanId('');
    setScheduledStartDate('');
    setSelectedEngineerId('');
  };

  // Open PM completion worksheet
  const handleOpenWorksheet = (job: any) => {
    setActiveJobForWorksheet(job);
    
    // Load existing worksheet data or initialize
    const pmData = job.pmData || {
      checklist: [
        { task: 'Inspect physical fluidic connections', done: false },
        { task: 'Clean and inspect optical sensor gain', done: false },
        { task: 'Verify system baseline voltages', done: false },
        { task: 'Perform control blood standards calibration check', done: false },
        { task: 'Sanitize fluidic tubing and check waste valves', done: false }
      ],
      partsUsed: []
    };

    setWorksheetChecklist(pmData.checklist);
    
    // Initialize standard measurements
    setGroundResistance('0.14');
    setFluidicPressure('2.2');
    setOpticalGain('44.8');
    setSystemPressureHold('Pass');
    
    // Selected parts checkbox dictionary
    const initialParts: { [partId: string]: boolean } = {};
    if (pmData.partsUsed) {
      pmData.partsUsed.forEach((p: any) => {
        initialParts[p.partId] = true;
      });
    }
    setSelectedPartsToConsume(initialParts);

    // Initial sign-off values
    setCompletionReportNumber(`PM-REP-${Date.now().toString().substring(7)}`);
    setCompletionRemarks('Quarterly PM checklist completed. Optical alignment calibrated, system pressure holdings verified within strict compliance.');
    setCustomerSignoff('Dr. Priyantha Gamage');
  };

  const handleToggleCheckstep = (idx: number) => {
    const updated = [...worksheetChecklist];
    updated[idx].done = !updated[idx].done;
    setWorksheetChecklist(updated);
  };

  // Process job completion, recurrence, and inventory deduct
  const handleCompletePMWorksheet = () => {
    if (!completionReportNumber) {
      alert('Please enter a valid Service Report Number.');
      return;
    }

    if (!activeJobForWorksheet) return;

    const job = activeJobForWorksheet;
    const matchedAsset = assets.find(a => a.serialNumber === job.serialNumber);
    if (!matchedAsset) return;

    // 1. Calculate next PM date (Recurrence)
    const interval = matchedAsset.nextServiceInterval || '6 Months';
    const todayStr = new Date().toISOString().split('T')[0];
    const nextPmDueDate = calculateNextDueDate(todayStr, interval);

    // 2. Consume selected spare parts from Warehouse Inventory
    let updatedInventory = [...inventory];
    const partsUsedLog: any[] = [];

    const pmDataParts = job.pmData?.partsUsed || [];
    pmDataParts.forEach((part: any) => {
      if (selectedPartsToConsume[part.partId]) {
        // Find in inventory list and decrement quantity
        updatedInventory = updatedInventory.map(item => {
          if (item.id === part.partId) {
            const finalQty = Math.max(0, item.onHandQty - part.quantity);
            partsUsedLog.push({
              partId: item.id,
              partName: item.partName,
              quantity: part.quantity,
              warehouseLocation: item.warehouseLocation
            });
            return {
              ...item,
              onHandQty: finalQty,
              availableQty: Math.max(0, finalQty - item.allocatedQty)
            };
          }
          return item;
        });
      }
    });

    if (onUpdateInventory && partsUsedLog.length > 0) {
      onUpdateInventory(updatedInventory);
    }

    // 3. Update the Service Job Status to Completed and Close it
    const completedJob: any = {
      ...job,
      status: 'Completed' as JobStatus,
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Completed' as JobStatus,
          updatedBy: activeUser.name,
          updatedAt: new Date().toISOString(),
          remarks: `PM Service executed under Report ${completionReportNumber}. Sign-off by: ${customerSignoff}. Ground resistance: ${groundResistance} Ohm. System hold: ${systemPressureHold}.`
        },
        ...job.timeline
      ],
      warrantyServiceData: job.warrantyServiceData ? {
        ...job.warrantyServiceData,
        serviceDate: todayStr,
        serviceReportNumber: completionReportNumber,
        isOverdue: false,
        alertActive: false
      } : undefined,
      nonWarrantyData: job.nonWarrantyData ? {
        ...job.nonWarrantyData,
        inspectionDone: true,
        inspectionValidated: true,
        partsStatus: partsUsedLog.length > 0 ? 'Deducted' : 'N/A',
        invoiceRaised: true
      } : undefined,
      // Save worksheet audit details inside job for ledger history
      pmData: {
        ...job.pmData,
        checklist: worksheetChecklist,
        measurements: [
          { name: 'Electrical Ground (Ohm)', value: groundResistance },
          { name: 'Fluidic Pressure (bar)', value: fluidicPressure },
          { name: 'Optical Calibration Gain (dB)', value: opticalGain },
          { name: 'System Pressure Hold', value: systemPressureHold }
        ],
        partsUsed: partsUsedLog,
        remarks: completionRemarks,
        signedOffBy: customerSignoff,
        reportNumber: completionReportNumber,
        completionDate: todayStr
      }
    };

    if (onUpdateJob) {
      onUpdateJob(completedJob as JobRecord);
      
      // Auto-transition to Closed to finalize asset history tracking
      const closedJob = {
        ...completedJob,
        status: 'Closed' as JobStatus,
        timeline: [
          {
            status: 'Closed' as JobStatus,
            updatedBy: 'SLA Engine',
            updatedAt: new Date().toISOString(),
            remarks: 'PM service workflow closed and archived into clinical asset history log.'
          },
          ...completedJob.timeline
        ]
      };
      onUpdateJob(closedJob as JobRecord);
    }

    // 4. Update the Asset dates (Recurrence Track)
    const updatedAsset: InstrumentAsset = {
      ...matchedAsset,
      lastPmDate: todayStr,
      nextPmDate: nextPmDueDate,
      nextServiceDate: nextPmDueDate,
      serviceHistoryCount: matchedAsset.serviceHistoryCount + 1
    };
    onUpdateAsset(updatedAsset);

    // 5. Create the next scheduled entry automatically (Recurrence Loop!)
    const updatedSchedules = schedules.map(s => {
      if (s.assetId === matchedAsset.id) {
        return {
          ...s,
          lastPmDate: todayStr,
          nextPmDueDate: nextPmDueDate,
          status: 'Scheduled' as const // reset status to Scheduled for next interval
        };
      }
      return s;
    });
    saveSchedules(updatedSchedules);

    // Show Printable Compliance Certificate
    setCertifiedJob(completedJob);
    setShowCertificate(true);
    setActiveJobForWorksheet(null);
  };

  // Filter Assets matching query
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.brand.toLowerCase().includes(search.toLowerCase()) ||
      asset.model.toLowerCase().includes(search.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      asset.customerName.toLowerCase().includes(search.toLowerCase());

    const isUnderWarranty = () => {
      if (!asset.installationDate) return false;
      const installDate = new Date(asset.installationDate);
      const expiryDate = new Date(installDate);
      expiryDate.setMonth(installDate.getMonth() + asset.warrantyPeriodMonths);
      return expiryDate > new Date();
    };

    const isUnderAmc = () => {
      const cust = customers.find(c => c.name === asset.customerName);
      return (cust?.contracts && cust.contracts.length > 0) || asset.amcStatus === 'Active';
    };

    if (filterStatus === 'Alert') {
      return matchesSearch && isPmDueSoon(asset.nextPmDate || asset.nextServiceDate);
    }
    if (filterStatus === 'Warranty') {
      return matchesSearch && isUnderWarranty();
    }
    if (filterStatus === 'AMC') {
      return matchesSearch && isUnderAmc();
    }
    return matchesSearch;
  });

  return (
    <div id="pm_scheduler_root" className="space-y-6">
      {/* Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-7 h-7 text-blue-600" /> Preventive Maintenance (PM) Lifecycle Hub
          </h1>
          <p className="text-xs text-slate-500">Automated scheduling templates, contract compliance, recurrence engines, and validation reports</p>
        </div>
        
        {/* Sub Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'status' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Fleet PM Status
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'plans' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> PM Plan Templates
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schedules' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <FolderSync className="w-3.5 h-3.5" /> Scheduling & Recurrence
          </button>
          <button
            onClick={() => setActiveTab('completion')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activeTab === 'completion' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" /> Dispatch & Completion
            {activePmJobs.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce">
                {activePmJobs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Fleet Assets</span>
            <span className="text-xl font-extrabold text-slate-800 block">{totalAssets} Units</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">In Warranty / AMC</span>
            <span className="text-xl font-extrabold text-emerald-600 block">{underWarrantyCount + underAmcCount} Active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">PM Plans Configured</span>
            <span className="text-xl font-extrabold text-indigo-600 block">{plans.length} Templates</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-100 bg-red-50/10 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-red-500 uppercase block">PM Alerts Due</span>
            <span className="text-xl font-extrabold text-red-600 block flex items-center gap-1">
              {activePmAlerts.length} Units
            </span>
          </div>
        </div>
      </div>

      {/* Relevant Alerts Broadcast Module */}
      {activePmAlerts.length > 0 && activeTab === 'status' && (
        <div id="pm_active_alerts_broadcast" className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border-l-4 border-blue-600 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2 text-blue-400">
              <BadgeAlert className="w-4 h-4 text-blue-400" /> Active Service alerts & PM Due warnings
            </h3>
            <span className="text-[9px] font-mono bg-blue-550 text-blue-200 px-2 py-0.5 rounded uppercase">
              Action Required
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            The following laboratory systems require scheduled PM execution. Documentation officers must verify AMC/Warranty parameters, and territory Area Engineers are flagged to dispatch.
          </p>

          <div className="space-y-1.5 mt-2 max-h-40 overflow-y-auto pr-1">
            {activePmAlerts.map(asset => {
              const eng = getRelevantEngineerForCustomer(asset.customerName);
              const nextDate = asset.nextPmDate || asset.nextServiceDate || '';
              return (
                <div key={asset.id} className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-blue-400 bg-blue-900/30 px-1 py-0.5 rounded border border-blue-500/20 mr-1.5">
                      {asset.assetNumber}
                    </span>
                    <span className="font-bold text-slate-200">{asset.brand} {asset.model}</span>
                    <div className="text-slate-400 text-[10px] mt-0.5">
                      Customer: <span className="text-slate-300 font-medium">{asset.customerName}</span> | Next due: <span className="text-red-450 font-bold">{new Date(nextDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                      <User className="w-3 h-3 text-blue-400" />
                      <span>{eng.name}</span>
                    </div>

                    <button
                      onClick={() => handleAutoGeneratePmTask(asset)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-[11px] shadow-sm"
                    >
                      <Plus className="w-3 h-3" /> Dispatch PM Work Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 1: Status (Main existing grid) */}
      {activeTab === 'status' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Controls bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-3 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assets, customers, brands..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-[11px] text-slate-400 font-medium">Filter:</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {(['All', 'Alert', 'Warranty', 'AMC'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterStatus(tab)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      filterStatus === tab ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'All' ? 'All Assets' : tab === 'Alert' ? 'Alerts' : tab === 'Warranty' ? 'In Warranty' : 'AMC Cover'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table representation */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-5">Asset & Customer</th>
                  <th className="py-3 px-4">Installation & Warranty</th>
                  <th className="py-3 px-4">Customer Contract</th>
                  <th className="py-3 px-4">PM Configuration</th>
                  <th className="py-3 px-4 text-right">Service Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAssets.map(asset => {
                  const isEditing = editingAssetId === asset.id;
                  const cust = customers.find(c => c.name === asset.customerName);
                  const isUnderWarranty = () => {
                    if (!asset.installationDate) return false;
                    const installDate = new Date(asset.installationDate);
                    const expiryDate = new Date(installDate);
                    expiryDate.setMonth(installDate.getMonth() + asset.warrantyPeriodMonths);
                    return expiryDate > new Date();
                  };
                  const hasAmc = (cust?.contracts && cust.contracts.length > 0) || asset.amcStatus === 'Active';
                  const nextPm = asset.nextPmDate || asset.nextServiceDate;
                  const alertActive = isPmDueSoon(nextPm);

                  return (
                    <tr key={asset.id} className={`hover:bg-slate-50/30 transition-all ${alertActive ? 'bg-red-50/5' : ''}`}>
                      {/* 1. Asset & Customer */}
                      <td className="py-3 px-5">
                        <div className="flex items-start gap-2.5">
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${alertActive ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                            <Wrench className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[9px] font-bold text-slate-400">{asset.assetNumber}</span>
                              {alertActive && (
                                <span className="bg-red-100 text-red-700 font-extrabold text-[8px] px-1 py-0.2 rounded uppercase animate-pulse">
                                  PM Due
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-slate-800 text-xs mt-0.5">{asset.brand} {asset.model}</h4>
                            <span className="text-slate-500 text-[10px] block">{asset.customerName} ({asset.department})</span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Installation & Warranty */}
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-slate-700 text-[11px]">
                            Inst: <span className="font-semibold">{asset.installationDate ? new Date(asset.installationDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${isUnderWarranty() ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            <span>Warranty: <b>{asset.warrantyPeriodMonths} M</b> ({isUnderWarranty() ? 'Active' : 'Expired'})</span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Customer Contract */}
                      <td className="py-3 px-4">
                        {hasAmc ? (
                          <div className="space-y-0.5">
                            <span className="bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[9px] px-2 py-0.5 rounded-full inline-block">
                              AMC Covered
                            </span>
                            {cust?.contracts && cust.contracts[0] && (
                              <div className="text-[9px] text-slate-500 font-medium">
                                Expires: {new Date(cust.contracts[0].endDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : isUnderWarranty() ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[9px] px-2 py-0.5 rounded-full inline-block">
                            Warranty Coverage
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[9px] px-2 py-0.5 rounded-full inline-block">
                              No Active Contract
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 4. PM Configuration */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="space-y-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200 max-w-[170px]">
                            <div>
                              <label className="text-[8px] font-bold text-slate-500 uppercase block">Interval</label>
                              <select
                                value={editInterval}
                                onChange={e => setEditInterval(e.target.value as any)}
                                className="w-full border text-[10px] p-0.5 rounded bg-white font-medium focus:outline-none"
                              >
                                <option value="3 Months">3 Months</option>
                                <option value="6 Months">6 Months</option>
                                <option value="1 Year">1 Year</option>
                                <option value="No Services">No Services</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[8px] font-bold text-slate-500 uppercase block">Last PM</label>
                              <input
                                type="date"
                                value={editLastPmDate}
                                onChange={e => setEditLastPmDate(e.target.value)}
                                className="w-full border text-[10px] p-0.5 rounded bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] font-bold text-slate-500 uppercase block">Next PM</label>
                              <input
                                type="date"
                                value={editNextPmDate}
                                onChange={e => setEditNextPmDate(e.target.value)}
                                className="w-full border text-[10px] p-0.5 rounded bg-white"
                              />
                            </div>
                            <div className="flex gap-1 justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingAssetId(null)}
                                className="bg-slate-200 px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(asset.id)}
                                className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="text-slate-700 text-[11px]">
                              Cycle: <span className="font-bold text-blue-700">{asset.nextServiceInterval || '6 Months'}</span>
                            </div>
                            <div className="text-slate-500 text-[10px]">
                              Last: <span className="font-medium text-slate-700">{asset.lastPmDate ? new Date(asset.lastPmDate).toLocaleDateString() : 'Never'}</span>
                            </div>
                            <div className="text-slate-500 text-[10px] flex items-center gap-1">
                              <Clock className={`w-3 h-3 ${alertActive ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                              Next: <span className={`font-mono font-bold ${alertActive ? 'text-red-600' : 'text-slate-700'}`}>{nextPm ? new Date(nextPm).toLocaleDateString() : 'Not Set'}</span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* 5. Service Operations */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isEditing && (
                            <>
                              <button
                                onClick={() => handleStartEdit(asset)}
                                className="text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-[10px]"
                                title="Configure custom service interval & overrides"
                              >
                                <Settings className="w-3 h-3" /> Interval
                              </button>

                              <button
                                onClick={() => handleRecalculateNextPm(asset)}
                                className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 font-semibold px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-[10px]"
                                title="Sync next PM date based on cycle"
                              >
                                <FolderSync className="w-3 h-3" /> Sync
                              </button>

                              <button
                                onClick={() => handleAutoGeneratePmTask(asset)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer text-[10px]"
                                title="Instantly generate a PM job work order"
                              >
                                <Sparkles className="w-3 h-3" /> Auto-Gen PM
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PM Plan Templates */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Preventive Maintenance Standard Protocols (PM Plans)</h2>
              <p className="text-[11px] text-slate-400">Predefined template checklists and required spare parts libraries mapped to instrument models</p>
            </div>
            <button
              onClick={() => setShowCreatePlanModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Define New PM Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div key={plan.id} className="bg-white rounded-xl border border-slate-100 shadow-xs p-4 flex flex-col justify-between hover:border-blue-150 transition-all relative group">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase">
                      {plan.interval} Cycle
                    </span>
                    <button 
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this template plan?')) {
                          savePlans(plans.filter(p => p.id !== plan.id));
                        }
                      }}
                      className="text-slate-300 hover:text-red-500 transition-all p-1 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <h3 className="font-extrabold text-slate-800 text-sm mt-2">{plan.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{plan.description}</p>

                  <div className="mt-3.5 pt-3.5 border-t border-slate-50 space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Standard Checklist Protocol</span>
                      <ul className="space-y-1 mt-1 text-[10px] text-slate-600 font-medium">
                        {plan.checklist.map((step, idx) => (
                          <li key={idx} className="flex gap-1.5 items-start">
                            <span className="text-blue-500 font-extrabold">{idx + 1}.</span>
                            <span className="line-clamp-1">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.spareParts && plan.spareParts.length > 0 && (
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Required Spare Parts Template</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {plan.spareParts.map((part, idx) => (
                            <span key={idx} className="bg-slate-50 text-slate-600 text-[9px] px-1.5 py-0.5 rounded border border-slate-200/60 font-medium flex items-center gap-1">
                              <Package className="w-2.5 h-2.5 text-slate-400" /> {part.partName} <b className="text-slate-800">x{part.quantity}</b>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-slate-400" /> Compatibility: <b>{plan.equipmentBrand} {plan.equipmentModel}</b>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PM Schedules & Recurrence Track */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Asset PM Schedules & Recurrence Cadence</h2>
              <p className="text-[11px] text-slate-400">Active recurring timelines mapping specific instruments to PM plan templates and engineers</p>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Map Asset to PM Plan
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-5">Instrument Asset</th>
                    <th className="py-3 px-4">Customer Facility</th>
                    <th className="py-3 px-4">Assigned PM Plan Template</th>
                    <th className="py-3 px-4">Cycle & Dates (Recurrence Track)</th>
                    <th className="py-3 px-4">Default Field Specialist</th>
                    <th className="py-3 px-4">SLA Status</th>
                    <th className="py-3 px-4 text-right">Job Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {schedules.map(sched => {
                    const isDue = isPmDueSoon(sched.nextPmDueDate);
                    const matchedAsset = assets.find(a => a.id === sched.assetId);
                    
                    return (
                      <tr key={sched.id} className="hover:bg-slate-55/40 transition-all">
                        <td className="py-3 px-5 font-bold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[9px] bg-slate-100 text-slate-505 px-1 rounded">{sched.assetNumber}</span>
                            <span>{sched.assetName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{sched.customerName}</td>
                        <td className="py-3 px-4">
                          <div className="text-slate-700 font-semibold flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-blue-500" /> {sched.planName}
                          </div>
                        </td>
                        <td className="py-3 px-4 space-y-0.5">
                          <div>
                            Recurrence: <span className="font-bold text-indigo-650 bg-indigo-50/60 px-1.5 py-0.2 rounded border border-indigo-100/50">{sched.interval}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Last: {sched.lastPmDate ? new Date(sched.lastPmDate).toLocaleDateString() : 'Never'}
                          </div>
                          <div className="text-[10px] font-bold text-slate-650 flex items-center gap-0.5">
                            <Clock className="w-3 h-3 text-slate-400" /> Due: <span className={isDue ? 'text-red-600' : 'text-slate-800'}>{new Date(sched.nextPmDueDate).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 font-semibold text-slate-750">
                            <User className="w-3 h-3 text-blue-500" /> {sched.assignedEngineerName}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {sched.status === 'In Progress' ? (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[9px] px-2 py-0.5 rounded-full inline-block animate-pulse">
                              Active in Field Work
                            </span>
                          ) : isDue ? (
                            <span className="bg-red-100 text-red-800 border border-red-200 font-bold text-[9px] px-2 py-0.5 rounded-full inline-block">
                              SLA Due Warning
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[9px] px-2 py-0.5 rounded-full inline-block">
                              SLA Compliant
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {sched.status !== 'In Progress' ? (
                              <button
                                onClick={() => {
                                  if (matchedAsset) {
                                    const matchingPlan = plans.find(p => p.id === sched.planId);
                                    handleAutoGeneratePmTask(matchedAsset, matchingPlan);
                                  } else {
                                    alert('Linked asset not found.');
                                  }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Sparkles className="w-3 h-3" /> Dispatch Run
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400">Pending Return</span>
                            )}
                            
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to clear this schedule mapping?')) {
                                  saveSchedules(schedules.filter(s => s.id !== sched.id));
                                }
                              }}
                              className="text-slate-350 hover:text-red-500 transition-all p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {schedules.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                        No active PM schedules mapped. Use "Map Asset to PM Plan" above to configure.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Dispatch & Completion */}
      {activeTab === 'completion' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800">Active PM Service Field Dispatches</h2>
            <p className="text-[11px] text-slate-400">Interactive medical laboratory validation checklists and calibration forms for active field technicians</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {activePmJobs.map(job => {
              const matchedAsset = assets.find(a => a.serialNumber === job.serialNumber);
              const pmData = (job as any).pmData || {};
              const checklistSteps = pmData.checklist || [];
              const stepsCompleted = checklistSteps.filter((s: any) => s.done).length;
              const stepsTotal = checklistSteps.length;
              const percentDone = stepsTotal > 0 ? Math.round((stepsCompleted / stepsTotal) * 100) : 0;

              return (
                <div key={job.id} className="bg-white rounded-xl border border-slate-100 shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-150 transition-all">
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                        {job.id}
                      </span>
                      <span className="font-bold text-slate-800 text-xs">{job.brand} {job.model} (S/N: {job.serialNumber})</span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                        job.priority === 'Urgent' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-50 text-slate-650'
                      }`}>
                        {job.priority} Priority
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium space-y-0.5">
                      <div>Customer Lab: <b className="text-slate-700">{job.customerName}</b></div>
                      <div className="flex items-center gap-1 text-[10px]">
                        <User className="w-3 h-3 text-slate-400" /> Specialist: <b>{job.assignedEngineerName}</b> | Status: <span className="text-blue-600 font-bold">{job.status}</span>
                      </div>
                    </div>

                    {/* Progress slider bar */}
                    {stepsTotal > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-medium">Checklist Protocol Completion Rate</span>
                          <span className="font-bold text-blue-600">{stepsCompleted} of {stepsTotal} steps ({percentDone}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div 
                            className="bg-blue-650 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${percentDone}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 justify-end">
                    <button
                      onClick={() => handleOpenWorksheet(job)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                    >
                      <ClipboardList className="w-4 h-4" /> Open PM Worksheet & Sign-off
                    </button>
                  </div>
                </div>
              );
            })}

            {activePmJobs.length === 0 && (
              <div className="bg-slate-50 text-center py-10 rounded-xl border border-dashed border-slate-200">
                <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-slate-500 font-extrabold text-sm">No Active PM Dispatches Found</h3>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-0.5">There are no active field jobs for Preventive Maintenance. Go to the "Fleet PM Status" or "Scheduling" tab to dispatch a service work order.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Create PM Plan Template */}
      <AnimatePresence>
        {showCreatePlanModal && (
          <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <Settings className="w-5 h-5 text-blue-400" /> Define Custom PM Plan Template
                </h3>
                <button onClick={() => setShowCreatePlanModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="font-bold text-slate-650 block mb-1">Plan Template Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sysmex XN series 6-Month Comprehensive PM"
                      required
                      value={newPlanName}
                      onChange={e => setNewPlanName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="font-bold text-slate-650 block mb-1">Equipment Brand *</label>
                    <input
                      type="text"
                      placeholder="e.g. SYSMEX"
                      required
                      value={newPlanBrand}
                      onChange={e => setNewPlanBrand(e.target.value.toUpperCase())}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-650 block mb-1">Equipment Model *</label>
                    <input
                      type="text"
                      placeholder="e.g. XN-1000"
                      required
                      value={newPlanModel}
                      onChange={e => setNewPlanModel(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="font-bold text-slate-650 block mb-1">Service Interval Cadence *</label>
                    <select
                      value={newPlanInterval}
                      onChange={e => setNewPlanInterval(e.target.value as any)}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none bg-white font-medium"
                    >
                      <option value="3 Months">3 Months (Quarterly)</option>
                      <option value="6 Months">6 Months (Semi-Annual)</option>
                      <option value="1 Year">1 Year (Annual)</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="font-bold text-slate-650 block mb-1">Plan Scope & Description</label>
                    <textarea
                      rows={2}
                      placeholder="Provide scope guidelines for the technician..."
                      value={newPlanDesc}
                      onChange={e => setNewPlanDesc(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none"
                    />
                  </div>

                  {/* Checklist steps builder */}
                  <div className="col-span-2 border-t border-slate-100 pt-3 space-y-2">
                    <label className="font-bold text-slate-700 block">Checklist Items Protocol</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add checklist step..."
                        value={newChecklistStep}
                        onChange={e => setNewChecklistStep(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddChecklistStep}
                        className="bg-indigo-55 text-indigo-700 font-bold px-3 py-2 rounded-lg border border-indigo-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-150 max-h-28 overflow-y-auto space-y-1">
                      {newPlanChecklist.map((step, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-100">
                          <span>{idx + 1}. {step}</span>
                          <button 
                            type="button" 
                            onClick={() => setNewPlanChecklist(newPlanChecklist.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {newPlanChecklist.length === 0 && (
                        <span className="text-[10px] text-slate-400 block text-center py-1">No custom checklist steps added. Default template checks will apply.</span>
                      )}
                    </div>
                  </div>

                  {/* Spare parts templates builder */}
                  <div className="col-span-2 border-t border-slate-100 pt-3 space-y-2">
                    <label className="font-bold text-slate-700 block">Required Spare Parts Template</label>
                    <div className="flex gap-2 items-center">
                      <select
                        value={selectedSparePartId}
                        onChange={e => setSelectedSparePartId(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none bg-white font-medium"
                      >
                        <option value="">-- Select Part from Warehouse --</option>
                        {inventory.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.partName} ({item.partCode}) - Available: {item.onHandQty}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        value={selectedSparePartQty}
                        onChange={e => setSelectedSparePartQty(parseInt(e.target.value) || 1)}
                        className="w-14 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none text-center"
                      />
                      <button
                        type="button"
                        onClick={handleAddSparePart}
                        className="bg-indigo-55 text-indigo-700 font-bold px-3 py-2 rounded-lg border border-indigo-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-150 max-h-24 overflow-y-auto space-y-1">
                      {newPlanSpareParts.map((part, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-100">
                          <span>{part.partName} (Qty: {part.quantity})</span>
                          <button 
                            type="button" 
                            onClick={() => setNewPlanSpareParts(newPlanSpareParts.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {newPlanSpareParts.length === 0 && (
                        <span className="text-[10px] text-slate-400 block text-center py-1">No parts assigned to template. PM is non-consuming.</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreatePlanModal(false)}
                    className="bg-slate-200 px-3.5 py-2 rounded-lg font-bold hover:bg-slate-300 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Create Plan Template
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Map Asset to PM Plan (Scheduling Modal) */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <FolderSync className="w-5 h-5 text-blue-400" /> Map Asset to PM Plan
                </h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSchedule} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-650 block mb-1">Select Instrument Asset *</label>
                  <select
                    value={selectedAssetId}
                    onChange={e => setSelectedAssetId(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none bg-white font-medium"
                  >
                    <option value="">-- Select Instrument --</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.assetNumber} - {asset.brand} {asset.model} (S/N: {asset.serialNumber}) at {asset.customerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-650 block mb-1">Select PM Plan Template *</label>
                  <select
                    value={selectedPlanId}
                    onChange={e => setSelectedPlanId(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none bg-white font-medium"
                  >
                    <option value="">-- Select Template --</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} ({plan.interval}) - Compatible: {plan.equipmentBrand}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-650 block mb-1">Scheduled Date *</label>
                    <input
                      type="date"
                      required
                      value={scheduledStartDate}
                      onChange={e => setScheduledStartDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-650 block mb-1">Area Service Engineer *</label>
                    <select
                      value={selectedEngineerId}
                      onChange={e => setSelectedEngineerId(e.target.value)}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none bg-white font-medium"
                    >
                      <option value="">-- Select Specialist --</option>
                      {MOCK_USERS.filter(u => u.role === 'ENGINEER' || u.role === 'ADMIN').map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="bg-slate-200 px-3.5 py-2 rounded-lg font-bold hover:bg-slate-300 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Establish Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: PM Worksheet Completion Panel */}
      <AnimatePresence>
        {activeJobForWorksheet && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-5xl w-full overflow-hidden max-h-[92vh] flex flex-col"
            >
              <div className="bg-slate-950 text-white p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-blue-400">
                    <Gauge className="w-5 h-5 text-blue-400" /> Laboratory Metrology & PM Calibration Worksheet
                  </h3>
                  <p className="text-[10px] text-slate-400">Asset: {activeJobForWorksheet.brand} {activeJobForWorksheet.model} | S/N: {activeJobForWorksheet.serialNumber} | Customer: {activeJobForWorksheet.customerName}</p>
                </div>
                <button onClick={() => setActiveJobForWorksheet(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 text-xs">
                
                {/* COLUMN 1: Standard Checklist Protocol */}
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1 border-b pb-2">
                    <CheckSquare className="w-4 h-4 text-blue-600" /> 1. Standard Task Protocol
                  </h4>
                  <p className="text-[10px] text-slate-400">Check off each preventive task after thorough biological cabinet alignment and validation.</p>

                  <div className="space-y-2 mt-2">
                    {worksheetChecklist.map((step, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleToggleCheckstep(idx)}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer flex gap-2.5 items-start ${
                          step.done ? 'bg-emerald-50/50 border-emerald-200 text-slate-850' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-350'
                        }`}
                      >
                        <div className="mt-0.5">
                          {step.done ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                        </div>
                        <span className="font-medium">{step.task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 2: Calibration Measurements */}
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1 border-b pb-2">
                    <Activity className="w-4 h-4 text-blue-600" /> 2. Metrology Measurements
                  </h4>
                  <p className="text-[10px] text-slate-400">Log actual diagnostic readings measured from test equipment after calibration gain cycles.</p>

                  <div className="space-y-3 mt-3">
                    <div>
                      <label className="font-bold text-slate-650 block mb-1">Electrical Ground Resistance (Ohm) *</label>
                      <input
                        type="text"
                        value={groundResistance}
                        onChange={e => setGroundResistance(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 font-mono text-xs focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-400">Compliance standard: &lt; 0.20 Ohm</span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-650 block mb-1">Vacuum Fluidic Operating Pressure (bar) *</label>
                      <input
                        type="text"
                        value={fluidicPressure}
                        onChange={e => setFluidicPressure(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 font-mono text-xs focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-400">Compliance standard: 2.0 - 2.5 bar</span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-650 block mb-1">Photomultiplier PMT Optical Gain (dB) *</label>
                      <input
                        type="text"
                        value={opticalGain}
                        onChange={e => setOpticalGain(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 font-mono text-xs focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-400">Compliance standard: 40 - 50 dB</span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-650 block mb-1">System Pressure Hold Diagnostics *</label>
                      <select
                        value={systemPressureHold}
                        onChange={e => setSystemPressureHold(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 bg-white font-medium focus:outline-none"
                      >
                        <option value="Pass">Pass (Negligible Decay &lt;0.01 bar/min)</option>
                        <option value="Fail">Fail (Pressure Loss Detected)</option>
                        <option value="N/A">N/A (Non-fluidic Device)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: Spare Parts consumed & Sign-off */}
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1 border-b pb-2">
                    <Package className="w-4 h-4 text-blue-600" /> 3. Consumables & Approvals
                  </h4>
                  <p className="text-[10px] text-slate-400">Confirm replacement spares consumed, and document formal client hand-over details.</p>

                  {/* Consumed Spare Parts list with checkboxes */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-650 block">Deduct Assigned Spare Parts</span>
                    {activeJobForWorksheet.pmData?.partsUsed && activeJobForWorksheet.pmData.partsUsed.length > 0 ? (
                      <div className="space-y-1">
                        {activeJobForWorksheet.pmData.partsUsed.map((p: any) => {
                          const isChecked = !!selectedPartsToConsume[p.partId];
                          return (
                            <div 
                              key={p.partId}
                              onClick={() => setSelectedPartsToConsume({ ...selectedPartsToConsume, [p.partId]: !isChecked })}
                              className="bg-white p-2 rounded border border-slate-200 flex items-center justify-between cursor-pointer text-[11px]"
                            >
                              <span className="font-medium text-slate-700">{p.name} (Qty: {p.quantity})</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[9px] text-slate-400 font-mono">Deduct Warehouse</span>
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No parts allocated to this template. Non-consuming PM.</span>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="font-bold text-slate-650 block mb-1">Service Report Number *</label>
                      <input
                        type="text"
                        placeholder="e.g. PM-REP-88291"
                        value={completionReportNumber}
                        onChange={e => setCompletionReportNumber(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 font-mono text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-650 block mb-1">Customer Sign-off Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Priyantha Gamage"
                        value={customerSignoff}
                        onChange={e => setCustomerSignoff(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-650 block mb-1">Calibration Technical Remarks</label>
                      <textarea
                        rows={2}
                        value={completionRemarks}
                        onChange={e => setCompletionRemarks(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 flex gap-2 justify-end border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setActiveJobForWorksheet(null)}
                  className="bg-slate-850 text-slate-300 px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCompletePMWorksheet}
                  className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FileCheck className="w-4 h-4" /> Approve & Seal PM Service Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Printable Metrology Certificate View */}
      <AnimatePresence>
        {showCertificate && certifiedJob && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-250 shadow-2xl max-w-xl w-full p-6 text-xs space-y-5"
            >
              {/* Header Certificate ribbon */}
              <div className="text-center space-y-1.5 relative border-b pb-4">
                <Award className="w-12 h-12 text-blue-600 mx-auto" />
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight uppercase">Preventive Maintenance Validation Certificate</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avon ServicePro - Clinical Metrology Division</p>
                <div className="absolute top-0 right-0 font-mono text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold uppercase">
                  Compliance SEALED
                </div>
              </div>

              {/* Certificate Details */}
              <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Instrument Details</span>
                  <div className="font-extrabold text-slate-800 text-xs mt-0.5">{certifiedJob.brand} {certifiedJob.model}</div>
                  <div className="text-slate-500 font-mono text-[10px] mt-0.5">S/N: {certifiedJob.serialNumber}</div>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Customer Site</span>
                  <div className="font-extrabold text-slate-800 text-[11px] mt-0.5">{certifiedJob.customerName}</div>
                  <div className="text-slate-500 font-medium text-[10px] mt-0.5">Department: Laboratory Facility</div>
                </div>

                <div className="border-t pt-2.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Calibration Date</span>
                  <div className="font-semibold text-slate-700 mt-0.5">{new Date().toLocaleDateString()}</div>
                </div>

                <div className="border-t pt-2.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Next Cycle Due (Recurrence)</span>
                  <div className="font-bold text-blue-700 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {(() => {
                      const matched = assets.find(a => a.serialNumber === certifiedJob.serialNumber);
                      return matched?.nextPmDate ? new Date(matched.nextPmDate).toLocaleDateString() : 'N/A';
                    })()}
                  </div>
                </div>

                <div className="col-span-2 border-t pt-2.5 space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Certified Calibration readings</span>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                    <div className="bg-white p-1.5 rounded border text-center">
                      <span className="text-[9px] text-slate-400 block font-sans">Ground Resistance</span>
                      <b className="text-slate-800">{certifiedJob.pmData?.measurements?.[0]?.value || '0.14'} Ohm</b>
                    </div>
                    <div className="bg-white p-1.5 rounded border text-center">
                      <span className="text-[9px] text-slate-400 block font-sans">Fluidic Pressure</span>
                      <b className="text-slate-800">{certifiedJob.pmData?.measurements?.[1]?.value || '2.2'} bar</b>
                    </div>
                    <div className="bg-white p-1.5 rounded border text-center">
                      <span className="text-[9px] text-slate-400 block font-sans">Optical PMT Gain</span>
                      <b className="text-slate-800">{certifiedJob.pmData?.measurements?.[2]?.value || '44.8'} dB</b>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="text-[11px] text-slate-600 italic border-l-2 border-slate-300 pl-3">
                "Verified and calibrated standard checklist steps. Consumed required spares, verified safe ground voltage offsets, and certified metrology compliant for continuation of diagnostic operations."
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-center pt-3.5 border-t">
                <div>
                  <div className="font-bold text-slate-800">{certifiedJob.assignedEngineerName || 'Eng. Ruchika Rodrigo'}</div>
                  <div className="text-[10px] text-slate-450 font-medium">Lead Calibration Specialist</div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-800">{customerSignoff || 'Dr. Priyantha Gamage'}</div>
                  <div className="text-[10px] text-slate-450 font-medium">Customer Operations Manager</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <FileText className="w-4 h-4" /> Print Metrology Seal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
