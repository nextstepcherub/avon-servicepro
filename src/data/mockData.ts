import {
  UserProfile,
  JobRecord,
  KpiDefinition,
  AuditLogRecord,
  CustomerProfile,
  InstrumentAsset,
  UserRole,
  JobStatus,
  Supplier,
  InventoryItem,
  StockMovement,
  PurchaseOrder,
  Grn
} from '../types';
import { INITIAL_INVENTORY, INITIAL_STOCK_MOVEMENTS } from './inventoryData';

// Predefined Users covering all required roles and tags
export const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr_sys_admin',
    name: 'System Admin',
    email: 'administrator@avon.lk',
    role: 'System Admin',
    tags: [],
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    territory: 'Colombo Headquarters',
    password: 'Superstar'
  },
  {
    id: 'usr_admin',
    name: 'Admin',
    email: 'admin@avon.lk',
    role: 'Admin',
    tags: [],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
    territory: 'Colombo Head Office',
    password: 'Cherub'
  }
];

// Predefined Initial Assets (Instrument Registry)
export const INITIAL_ASSETS: InstrumentAsset[] = [
  {
    id: 'ast_001',
    assetNumber: 'AV-BIO-2026-042',
    serialNumber: 'SN-94827104',
    brand: 'Sysmex',
    model: 'XN-1000',
    description: 'Automated Hematology Analyzer',
    invoiceNumber: 'INV-2026-1029',
    invoiceValue: 8500000,
    warrantyPeriodMonths: 24,
    installationDate: '2026-03-10',
    customerName: 'Asiri Surgical Hospital',
    department: 'Hematology Lab',
    endUserName: 'Dr. Priyantha Silva',
    endUserContact: '+94771234567',
    endUserLocation: 'Block B, 2nd Floor',
    warrantyCardNumber: 'WC-94811',
    nextServiceInterval: '6 Months',
    nextServiceDate: '2026-09-10',
    amcStatus: 'None',
    calibrationDue: '2027-03-10',
    serviceHistoryCount: 1,
    repairHistoryCount: 0,
    totalRevenueGenerated: 120000
  },
  {
    id: 'ast_002',
    assetNumber: 'AV-CHEM-2025-099',
    serialNumber: 'SN-CH-50219',
    brand: 'Shimadzu',
    model: 'GC-2030',
    description: 'Gas Chromatograph system with FID detector',
    invoiceNumber: 'INV-2025-8841',
    invoiceValue: 12000000,
    warrantyPeriodMonths: 12,
    installationDate: '2025-07-15',
    customerName: 'Industrial Technology Institute (ITI)',
    department: 'Chemical Analysis Lab',
    endUserName: 'Mrs. Sanduni Fernando',
    endUserContact: '+94718877221',
    endUserLocation: 'Main Lab Wing A',
    warrantyCardNumber: 'WC-80122',
    nextServiceInterval: '1 Year',
    nextServiceDate: '2026-07-15',
    amcStatus: 'Active',
    calibrationDue: '2026-07-15',
    serviceHistoryCount: 2,
    repairHistoryCount: 1,
    totalRevenueGenerated: 450000
  },
  {
    id: 'ast_003',
    assetNumber: 'AV-CLIN-2026-105',
    serialNumber: 'SN-E602911',
    brand: 'Roche',
    model: 'Cobas e411',
    description: 'Immunology Analyzer',
    invoiceNumber: 'INV-2026-3021',
    invoiceValue: 9800000,
    warrantyPeriodMonths: 36,
    installationDate: '2026-01-20',
    customerName: 'Nawaloka Hospitals PLC',
    department: 'Clinical Pathology',
    endUserName: 'Prof. Lalith Mendis',
    endUserContact: '+94762233445',
    endUserLocation: 'Main Lab Complex, Colombo 2',
    warrantyCardNumber: 'WC-30291',
    nextServiceInterval: '6 Months',
    nextServiceDate: '2026-07-20',
    amcStatus: 'None',
    calibrationDue: '2027-01-20',
    serviceHistoryCount: 0,
    repairHistoryCount: 0,
    totalRevenueGenerated: 0
  }
];

// Predefined Initial Customers
export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust_001',
    name: 'Asiri Surgical Hospital',
    departments: ['Hematology Lab', 'Biochemistry', 'OPD Clinic', 'ICU'],
    endUsers: [
      { name: 'Dr. Priyantha Silva', contact: '+94771234567', location: 'Block B, 2nd Floor' },
      { name: 'Nurse In-charge Kamala', contact: '+94711122334', location: 'ICU Unit 1' }
    ],
    installedEquipmentCount: 8,
    totalRevenue: 24500000,
    activeContracts: 2,
    feedbackNpsAverage: 9.2,
    contracts: [
      {
        id: 'con_001',
        contractNumber: 'AMC/ASIRI/2026/01',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        pmInterval: '6 Months',
        status: 'Active',
        price: 150000
      },
      {
        id: 'con_002',
        contractNumber: 'AMC/ASIRI/2026/02',
        startDate: '2026-04-01',
        endDate: '2027-03-31',
        pmInterval: '3 Months',
        status: 'Active',
        price: 240000
      }
    ]
  },
  {
    id: 'cust_002',
    name: 'Industrial Technology Institute (ITI)',
    departments: ['Chemical Analysis Lab', 'Calibration Div', 'Food Tech'],
    endUsers: [
      { name: 'Mrs. Sanduni Fernando', contact: '+94718877221', location: 'Main Lab Wing A' }
    ],
    installedEquipmentCount: 4,
    totalRevenue: 18900000,
    activeContracts: 1,
    feedbackNpsAverage: 8.8,
    contracts: [
      {
        id: 'con_003',
        contractNumber: 'AMC/ITI/2025/11',
        startDate: '2025-07-01',
        endDate: '2026-06-30',
        pmInterval: '1 Year',
        status: 'Active',
        price: 320000
      }
    ]
  },
  {
    id: 'cust_003',
    name: 'Nawaloka Hospitals PLC',
    departments: ['Clinical Pathology', 'Microbiology', 'Radiology'],
    endUsers: [
      { name: 'Prof. Lalith Mendis', contact: '+94762233445', location: 'Main Lab Complex, Colombo 2' }
    ],
    installedEquipmentCount: 6,
    totalRevenue: 15400000,
    activeContracts: 0,
    feedbackNpsAverage: 8.5,
    contracts: []
  }
];

// Predefined Initial Suppliers
export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_001',
    name: 'Sysmex Asia Pacific Pte Ltd',
    code: 'SUP-001',
    categories: ['Laboratory Reagents', 'Medical Equipment', 'Consumables'],
    status: 'Active',
    address: '9 Tampines Grande, #06-00, Singapore 528735',
    country: 'Singapore',
    website: 'https://www.sysmex-ap.com',
    rating: 5,
    contacts: [
      {
        id: 'sup_con_001',
        name: 'Kenji Tanaka',
        role: 'Regional Service Manager',
        email: 'tanaka.k@sysmex.com.sg',
        phone: '+6562213456',
        isDefault: true
      },
      {
        id: 'sup_con_002',
        name: 'Sarah Lim',
        role: 'Biomedical Support Engineer',
        email: 'lim.s@sysmex.com.sg',
        phone: '+6562213459',
        isDefault: false
      }
    ]
  },
  {
    id: 'sup_002',
    name: 'Shimadzu (Asia Pacific) Pte Ltd',
    code: 'SUP-002',
    categories: ['Calibration Instruments', 'Spare Parts'],
    status: 'Active',
    address: '79 Science Park Drive, #04-01/08, Singapore 118264',
    country: 'Singapore',
    website: 'https://www.shimadzu.com.sg',
    rating: 4,
    contacts: [
      {
        id: 'sup_con_003',
        name: 'Dr. Raymond Goh',
        role: 'Director of Analytical Division',
        email: 'goh.r@shimadzu.com.sg',
        phone: '+6567789978',
        isDefault: true
      }
    ]
  },
  {
    id: 'sup_003',
    name: 'Roche Diagnostics International AG',
    code: 'SUP-003',
    categories: ['Laboratory Reagents', 'Consumables'],
    status: 'Under Review',
    address: 'Forrenstrasse 2, 6343 Rotkreuz, Switzerland',
    country: 'Switzerland',
    website: 'https://diagnostics.roche.com',
    rating: 4,
    contacts: [
      {
        id: 'sup_con_004',
        name: 'Hans Meier',
        role: 'Global Supply Lead',
        email: 'hans.meier@roche.ch',
        phone: '+41417921111',
        isDefault: true
      }
    ]
  },
  {
    id: 'sup_004',
    name: 'Siemens Healthcare GmbH',
    code: 'SUP-004',
    categories: ['Imaging Systems', 'Spare Parts'],
    status: 'Active',
    address: 'Henkestrasse 127, 91052 Erlangen, Germany',
    country: 'Germany',
    website: 'https://www.siemens-healthineers.com',
    rating: 5,
    contacts: [
      {
        id: 'sup_con_005',
        name: 'Dr. Marcus Braun',
        role: 'Head of Support EMEA',
        email: 'marcus.braun@siemens-healthineers.com',
        phone: '+499131840',
        isDefault: true
      }
    ]
  },
  {
    id: 'sup_005',
    name: 'Apex Biotech Diagnostics India',
    code: 'SUP-005',
    categories: ['Consumables', 'Laboratory Reagents'],
    status: 'Inactive',
    address: 'Phase-II, Okhla Industrial Area, New Delhi, India',
    country: 'India',
    website: 'https://www.apexbiotech.in',
    rating: 2,
    contacts: [
      {
        id: 'sup_con_006',
        name: 'Rajesh Sharma',
        role: 'Sales Director',
        email: 'rajesh@apexbiotech.in',
        phone: '+91114251234',
        isDefault: true
      }
    ]
  }
];

// Predefined Default KPI Definitions with weight and scoring mechanisms
export const INITIAL_KPIS: KpiDefinition[] = [
  // Workshop/Area Engineers
  {
    id: 'kpi_eng_1',
    name: 'Service Meeting Participation',
    roleType: 'Engineer',
    description: 'Participation in Service Meetings & HOD Meetings. Conduct all meeting count: 24 per year.',
    weight: 15,
    targetValue: '24 Meetings/Year',
    currentValue: '12 / 12 (YTD)',
    score: 100
  },
  {
    id: 'kpi_eng_2',
    name: 'Installation Timeline SLA',
    roleType: 'Engineer',
    description: 'Completion of Instrument Installation within 15 days of warehouse delivery.',
    weight: 25,
    targetValue: '100% within 15 Days',
    currentValue: '93% Met',
    score: 93
  },
  {
    id: 'kpi_eng_3',
    name: 'Warranty PM Service Completeness',
    roleType: 'Engineer',
    description: '100% completion of scheduled warranty preventive maintenance within assign time.',
    weight: 25,
    targetValue: '100% Completed',
    currentValue: '100% (24/24)',
    score: 100
  },
  {
    id: 'kpi_eng_4',
    name: 'Financial Target Achievement',
    roleType: 'Engineer',
    description: 'Area non-warranty service agreements and repairs financial target achievement within FY.',
    weight: 20,
    targetValue: 'LKR 8.5M',
    currentValue: 'LKR 4.2M (49%)',
    score: 85
  },
  {
    id: 'kpi_eng_5',
    name: 'Customer Satisfaction Score',
    roleType: 'Engineer',
    description: 'Achieve high average customer satisfaction scores over 85% via QR Likert scale and NPS.',
    weight: 15,
    targetValue: '> 85%',
    currentValue: '91.4% Rating',
    score: 91
  },

  // Technicians
  {
    id: 'kpi_tech_1',
    name: 'Workshop Job Completion Rate',
    roleType: 'Technician',
    description: 'Maintain high workshop job completion rates.',
    weight: 25,
    targetValue: '> 95%',
    currentValue: '97.2%',
    score: 97
  },
  {
    id: 'kpi_tech_2',
    name: 'Customer Feedback Score',
    roleType: 'Technician',
    description: 'Maintain excellent customer feedback from field visits and onsite installations.',
    weight: 25,
    targetValue: '> 90%',
    currentValue: '93.5%',
    score: 93
  },
  {
    id: 'kpi_tech_3',
    name: 'Onsite Visit Completion SLA',
    roleType: 'Technician',
    description: 'Adherence to complete assigned onsite visits on schedule.',
    weight: 20,
    targetValue: '100%',
    currentValue: '98%',
    score: 98
  },
  {
    id: 'kpi_tech_4',
    name: 'Tool and Device Integrity',
    roleType: 'Technician',
    description: 'Adherence to safety guidelines & proper tools inventory handling. (Reduces 5 marks per missing tool).',
    weight: 15,
    targetValue: '0 Missing Items',
    currentValue: '0 Missing',
    score: 100,
    errorsCount: 0
  },
  {
    id: 'kpi_tech_5',
    name: 'Marketing & R&D Support',
    roleType: 'Technician',
    description: 'Support R&D and marketing demonstration setups and attend specialized product trainings.',
    weight: 15,
    targetValue: '100% Attendance',
    currentValue: '5/5 Sessions',
    score: 100
  },

  // Coordinating Officers
  {
    id: 'kpi_coord_1',
    name: 'Quotation Preparation Accuracy',
    roleType: 'Coordinating Officer',
    description: '100% accuracy of quotation preparation. Deducts 10 marks per error.',
    weight: 25,
    targetValue: '0 Errors',
    currentValue: '1 Error Reported',
    score: 90,
    errorsCount: 1
  },
  {
    id: 'kpi_coord_2',
    name: 'Documentation Accuracy Rate',
    roleType: 'Coordinating Officer',
    description: '100% of documentation accuracy across installations and warranty schedules. Deduct 10 marks per error.',
    weight: 25,
    targetValue: '0 Errors',
    currentValue: '0 Errors',
    score: 100,
    errorsCount: 0
  },
  {
    id: 'kpi_coord_3',
    name: 'Delivery & Receiving Accuracy',
    roleType: 'Coordinating Officer',
    description: 'Accuracy of tracking deliveries and items received. Deduct 10 marks per mistake.',
    weight: 20,
    targetValue: '0 Mistakes',
    currentValue: '0 Mistakes',
    score: 100,
    errorsCount: 0
  },
  {
    id: 'kpi_coord_4',
    name: 'HOD Meeting Actions Follow Up',
    roleType: 'Coordinating Officer',
    description: 'Follow up on meeting action points within deadlines.',
    weight: 15,
    targetValue: '100% Follow Up',
    currentValue: '15/15 Actioned',
    score: 100
  },
  {
    id: 'kpi_coord_5',
    name: 'Petty Cash Handling Accuracy',
    roleType: 'Coordinating Officer',
    description: 'Accuracy of petty cash and IOU validation. Deduct 20 marks per error.',
    weight: 15,
    targetValue: '0 Errors',
    currentValue: '0 Errors',
    score: 100,
    errorsCount: 0
  },

  // Workshop Engineers
  {
    id: 'kpi_workeng_1',
    name: 'Inspection Report Timeline',
    roleType: 'Workshop Engineer',
    description: 'Provide comprehensive inspection reports to customer/management within 7 working days of receipt.',
    weight: 30,
    targetValue: '100% within 7 Days',
    currentValue: '100% (18/18)',
    score: 100
  },
  {
    id: 'kpi_workeng_2',
    name: 'Repair Cycle Time',
    roleType: 'Workshop Engineer',
    description: 'Complete the repair after customer PO confirmation (if parts available) within 7 working days.',
    weight: 30,
    targetValue: '100% within 7 Days',
    currentValue: '94.4%',
    score: 94
  },
  {
    id: 'kpi_workeng_3',
    name: 'Final Delivery Inspection Quality',
    roleType: 'Workshop Engineer',
    description: 'Accuracy of QA inspection before item dispatch. Penalized based on customer complaints upon delivery.',
    weight: 20,
    targetValue: '0 Complains',
    currentValue: '1 Complain',
    score: 80,
    errorsCount: 1
  },
  {
    id: 'kpi_workeng_4',
    name: 'Inventory Security & Audits',
    roleType: 'Workshop Engineer',
    description: 'Accurate inventory management of workshop tools and customer assets. Deducts 25 marks per incident.',
    weight: 20,
    targetValue: '0 Incidents',
    currentValue: '0 Incidents',
    score: 100,
    errorsCount: 0
  },

  // Calibration Engineers
  {
    id: 'kpi_caleng_1',
    name: 'Calibration Target Completion',
    roleType: 'Calibration Engineer',
    description: 'Achieve annual and monthly calibration targets to maintain SLAB SLA standards.',
    weight: 35,
    targetValue: '250 Calibrations/Year',
    currentValue: '142 Completed',
    score: 91
  },
  {
    id: 'kpi_caleng_2',
    name: 'Pre-order Inspection Accuracy',
    roleType: 'Calibration Engineer',
    description: '100% accuracy of pre-order/pre-calibration device inspects. Deduct 10 marks per issue.',
    weight: 25,
    targetValue: '0 Issues',
    currentValue: '0 Issues',
    score: 100,
    errorsCount: 0
  },
  {
    id: 'kpi_caleng_3',
    name: 'Laboratory Calibration Compliance',
    roleType: 'Calibration Engineer',
    description: 'Follow up and maintain quality calibration compliance guidelines & prepare for SLAB audit schedules.',
    weight: 25,
    targetValue: '100% Auditable',
    currentValue: 'Perfect Compliance',
    score: 100
  },
  {
    id: 'kpi_caleng_4',
    name: 'Internal Staff Quality Training',
    roleType: 'Calibration Engineer',
    description: 'Conduct industry standards and calibration methodology training to service staff.',
    weight: 15,
    targetValue: '4 Sessions/Year',
    currentValue: '2 Conducted',
    score: 100
  }
];

// Rich Seed Data for Job Records demonstrating all specific workflows
export const INITIAL_JOBS: JobRecord[] = [
  // 1. Installation Job - New entry by Doc Officer, needs assignment
  {
    id: 'job_inst_101',
    jobType: 'Installation',
    status: 'Pending Assignment',
    priority: 'Routine',
    customerName: 'Asiri Surgical Hospital',
    brand: 'Sysmex',
    model: 'XN-1000',
    serialNumber: 'SN-94827104',
    createdById: 'usr_doc',
    createdByRole: 'Documentation Officer',
    createdAt: '2026-06-25T08:30:00-07:00',
    updatedAt: '2026-06-25T08:30:00-07:00',
    timeline: [
      {
        status: 'Pending Assignment',
        updatedBy: 'Nuwani Upeksha (Doc Officer)',
        updatedAt: '2026-06-25T08:30:00-07:00',
        remarks: 'New installation request fed into system. Invoice: INV-2026-1029, value LKR 8.5M.'
      }
    ],
    installationData: {
      invoiceNumber: 'INV-2026-1029',
      invoiceValue: 8500000,
      model: 'XN-1000',
      itemDescription: 'Automated Hematology Analyzer with starter reagent kit',
      brand: 'Sysmex',
      customerName: 'Asiri Surgical Hospital',
      warrantyPeriodYears: 2,
      warrantyPeriodMonths: 24,
      dueDate: '2026-07-10T08:30:00-07:00' // 15 days from creation
    }
  },
  
  // 2. Installation Job - Assigned and in progress
  {
    id: 'job_inst_102',
    jobType: 'Installation',
    status: 'On Site',
    priority: 'Routine',
    customerName: 'Industrial Technology Institute (ITI)',
    brand: 'Shimadzu',
    model: 'GC-2030',
    serialNumber: 'SN-CH-50219',
    assignedEngineerId: 'usr_bio',
    assignedEngineerName: 'Sachin Gayashan',
    createdById: 'usr_doc',
    createdByRole: 'Documentation Officer',
    createdAt: '2026-06-20T10:00:00-07:00',
    updatedAt: '2026-06-28T14:20:00-07:00',
    timeline: [
      {
        status: 'Pending Assignment',
        updatedBy: 'Nuwani Upeksha (Doc Officer)',
        updatedAt: '2026-06-20T10:00:00-07:00',
        remarks: 'Installation details uploaded.'
      },
      {
        status: 'Assigned',
        updatedBy: 'Ravindra Kumaranayake (Service Manager)',
        updatedAt: '2026-06-22T09:00:00-07:00',
        remarks: 'Assigned to Sachin Gayashan. Customer end-user data verified.'
      },
      {
        status: 'Traveling',
        updatedBy: 'Sachin Gayashan (Biomedical Engineer)',
        updatedAt: '2026-06-28T08:00:00-07:00',
        remarks: 'Departed with toolkits.'
      },
      {
        status: 'On Site',
        updatedBy: 'Sachin Gayashan (Biomedical Engineer)',
        updatedAt: '2026-06-28T14:20:00-07:00',
        remarks: 'Arrived at ITI Main Lab. Bench setup completed, gas supply validation in progress.'
      }
    ],
    installationData: {
      invoiceNumber: 'INV-2026-8841',
      invoiceValue: 12000000,
      model: 'GC-2030',
      itemDescription: 'High performance Gas Chromatograph system',
      brand: 'Shimadzu',
      customerName: 'Industrial Technology Institute (ITI)',
      warrantyPeriodYears: 1,
      warrantyPeriodMonths: 12,
      endUserName: 'Mrs. Sanduni Fernando',
      endUserContact: '+94718877221',
      endUserLocation: 'Main Lab Wing A',
      remarks: 'Gas cylinder delivery delayed by customer, now sorted.',
      dueDate: '2026-07-05T10:00:00-07:00'
    }
  },

  // 3. Warranty PM Service Job - Alarm triggered (due date is inside alert range: 1 month before to 1 month after)
  {
    id: 'job_warr_201',
    jobType: 'Warranty Service',
    status: 'Pending Assignment',
    priority: 'Routine',
    customerName: 'Nawaloka Hospitals PLC',
    brand: 'Roche',
    model: 'Cobas e411',
    serialNumber: 'SN-E602911',
    createdById: 'usr_doc',
    createdByRole: 'Documentation Officer',
    createdAt: '2026-06-15T09:00:00-07:00',
    updatedAt: '2026-07-01T09:00:00-07:00',
    timeline: [
      {
        status: 'Pending Assignment',
        updatedBy: 'System Scheduler',
        updatedAt: '2026-06-15T09:00:00-07:00',
        remarks: 'Automatic 6-month Warranty Service PM Alert. Target date is 2026-07-20.'
      }
    ],
    warrantyServiceData: {
      dueDate: '2026-07-20T00:00:00-07:00', // Inside alert range (Current date 2026-07-02 is within 1 month)
      isOverdue: false,
      alertActive: true
    }
  },

  // 4. Non-Warranty Service - Repair request requiring Inspection and Quotation
  {
    id: 'job_non_warr_301',
    jobType: 'Non-Warranty Service',
    status: 'Inspection Done',
    priority: 'Urgent',
    customerName: 'Asiri Surgical Hospital',
    brand: 'Sysmex',
    model: 'XN-1000',
    serialNumber: 'SN-94827104',
    assignedEngineerId: 'usr_sr_bio',
    assignedEngineerName: 'Dinesh Rodrigo',
    createdById: 'usr_manager',
    createdByRole: 'Service Manager',
    createdAt: '2026-06-26T11:00:00-07:00',
    updatedAt: '2026-06-29T15:30:00-07:00',
    timeline: [
      {
        status: 'Pending Assignment',
        updatedBy: 'Ravindra Kumaranayake (Service Manager)',
        updatedAt: '2026-06-26T11:00:00-07:00',
        remarks: 'Customer reported fluidic blockage error code E-203.'
      },
      {
        status: 'Assigned',
        updatedBy: 'Ravindra Kumaranayake (Service Manager)',
        updatedAt: '2026-06-27T09:00:00-07:00',
        remarks: 'Assigned to Dinesh Rodrigo for physical inspection.'
      },
      {
        status: 'On Site',
        updatedBy: 'Dinesh Rodrigo (Senior Biomedical Engineer)',
        updatedAt: '2026-06-29T10:00:00-07:00',
        remarks: 'Physically inspected the system.'
      },
      {
        status: 'Inspection Done',
        updatedBy: 'Dinesh Rodrigo (Senior Biomedical Engineer)',
        updatedAt: '2026-06-29T15:30:00-07:00',
        remarks: 'Blockage confirmed in the sampling valve assembly. Requires replacement of the pinch valve (Part #PV-929) and system flush.'
      }
    ],
    nonWarrantyData: {
      departmentSection: 'Hematology Lab',
      issueDescription: 'Fluidic path error block E-203. Heavy reagent salt build-up.',
      inspectionDone: true,
      inspectionValidated: false, // Needs Workshop Manager validation to move to pricing
      inspectionReport: 'Physical assessment confirms pinch valve failure. Debris lodged in fluid path.',
      partsStatus: 'Local Available',
      invoiceRaised: false
    }
  },

  // 5. Warranty Repair - Emergency request, parts ordered
  {
    id: 'job_warr_rep_401',
    jobType: 'Warranty Repair',
    status: 'Parts Ordered',
    priority: 'Emergency',
    customerName: 'Nawaloka Hospitals PLC',
    brand: 'Roche',
    model: 'Cobas e411',
    serialNumber: 'SN-E602911',
    assignedEngineerId: 'usr_workshop_eng',
    assignedEngineerName: 'Roshan Silva',
    createdById: 'usr_manager',
    createdByRole: 'Service Manager',
    createdAt: '2026-06-22T08:00:00-07:00',
    updatedAt: '2026-06-25T16:00:00-07:00',
    timeline: [
      {
        status: 'Pending Assignment',
        updatedBy: 'Ravindra Kumaranayake (Service Manager)',
        updatedAt: '2026-06-22T08:00:00-07:00',
        remarks: 'Photomultiplier tube failure reported. System down.'
      },
      {
        status: 'Assigned',
        updatedBy: 'Ravindra Kumaranayake (Service Manager)',
        updatedAt: '2026-06-22T10:00:00-07:00',
        remarks: 'Roshan Silva assigned.'
      },
      {
        status: 'Inspection Done',
        updatedBy: 'Roshan Silva (Workshop Engineer)',
        updatedAt: '2026-06-23T14:00:00-07:00',
        remarks: 'PMT voltage supply unstable. PMT component requires replacement. Part is not locally in stock.'
      },
      {
        status: 'Inspection Validated',
        updatedBy: 'Ravindra Kumaranayake (Service Manager)',
        updatedAt: '2026-06-24T09:00:00-07:00',
        remarks: 'Inspection report validated. Emergency order of Roche PMT module approved.'
      },
      {
        status: 'Parts Ordered',
        updatedBy: 'Roshan Silva (Workshop Engineer)',
        updatedAt: '2026-06-25T16:00:00-07:00',
        remarks: 'PMT Module (Part #PMT-RO-E411) ordered from Roche Germany. Courier tracking: DHL-827104922.'
      }
    ],
    warrantyRepairData: {
      departmentSection: 'Clinical Pathology',
      issueDescription: 'Blank calibration fails constantly. Error PMT high voltage unstable.',
      inspectionDone: true,
      inspectionValidated: true,
      inspectionReport: 'Unstable dark current in PMT detector. Needs direct replacement of PMT card.',
      partsStatus: 'Parts Ordered',
      partsOrderedDate: '2026-06-25'
    }
  },

  // 6. Workshop Job - Item received at workshop, with receiving report
  {
    id: 'job_work_501',
    jobType: 'Workshop Job',
    status: 'Inspection Assigned',
    priority: 'Routine',
    customerName: 'Industrial Technology Institute (ITI)',
    brand: 'Shimadzu',
    model: 'GC-2030',
    serialNumber: 'SN-CH-50219',
    assignedEngineerId: 'usr_workshop_eng',
    assignedEngineerName: 'Roshan Silva',
    createdById: 'usr_doc',
    createdByRole: 'Documentation Officer',
    createdAt: '2026-06-28T11:00:00-07:00',
    updatedAt: '2026-06-29T09:30:00-07:00',
    timeline: [
      {
        status: 'Job Received',
        updatedBy: 'Nuwani Upeksha (Doc Officer)',
        updatedAt: '2026-06-28T11:00:00-07:00',
        remarks: 'Item received physically at the workshop reception. Generated Acceptance Report.'
      },
      {
        status: 'Inspection Assigned',
        updatedBy: 'Roshan Silva (Workshop Engineer)',
        updatedAt: '2026-06-29T09:30:00-07:00',
        remarks: 'Assigned to Roshan Silva for electronic circuit inspection.'
      }
    ],
    workshopJobData: {
      acceptanceDate: '2026-06-28',
      itemSerialNumber: 'SN-CH-50219',
      institute: 'Industrial Technology Institute (ITI)',
      departmentSection: 'Chemical Analysis Lab',
      contactName: 'Mrs. Sanduni Fernando',
      contactNumber: '+94718877221',
      warrantyStatus: 'Warranty',
      partsReceivedWithItem: 'Power cord, capillary column, injection syringe box',
      takenByDeliveryPerson: 'Mr. Sarath Perera (Avon Dispatch)',
      remarks: 'Device power turns on but instantly restarts within 10 seconds.',
      takenOutsideWorkshop: false
    }
  },

  // 7. Calibration Job - calibration pending certificate
  {
    id: 'job_cal_601',
    jobType: 'Calibration',
    status: 'Assigned',
    priority: 'Routine',
    customerName: 'Asiri Surgical Hospital',
    brand: 'Sysmex',
    model: 'XN-1000',
    serialNumber: 'SN-94827104',
    assignedEngineerId: 'usr_calib_eng',
    assignedEngineerName: 'Cherub Weeratunge',
    createdById: 'usr_doc',
    createdByRole: 'Documentation Officer',
    createdAt: '2026-06-27T10:00:00-07:00',
    updatedAt: '2026-06-28T11:00:00-07:00',
    timeline: [
      {
        status: 'Pending Assignment',
        updatedBy: 'Nuwani Upeksha (Doc Officer)',
        updatedAt: '2026-06-27T10:00:00-07:00',
        remarks: 'Annual calibration requested.'
      },
      {
        status: 'Assigned',
        updatedBy: 'Ravindra Kumaranayake (Service Manager)',
        updatedAt: '2026-06-28T11:00:00-07:00',
        remarks: 'Assigned to Cherub Weeratunge under standard laboratory calibration procedure.'
      }
    ],
    calibrationData: {
      requestDate: '2026-06-27'
    }
  }
];

// Seed Audit Logs
export const INITIAL_AUDITS: AuditLogRecord[] = [
  {
    id: 'aud_1',
    timestamp: '2026-06-25T08:30:00-07:00',
    userId: 'usr_doc',
    userName: 'Nuwani Upeksha',
    userRole: 'Documentation Officer',
    action: 'CREATE_JOB',
    newValue: 'job_inst_101',
    remarks: 'Registered new installation for Sysmex Hematology Analyzer XN-1000 at Asiri Hospital.'
  },
  {
    id: 'aud_2',
    timestamp: '2026-06-27T09:00:00-07:00',
    userId: 'usr_manager',
    userName: 'Ravindra Kumaranayake',
    userRole: 'Service Manager',
    action: 'ASSIGN_JOB',
    previousValue: 'Pending Assignment',
    newValue: 'Assigned (Sachin Gayashan)',
    remarks: 'Assigned GC-2030 installation to Sachin Gayashan.'
  }
];

// Seed Purchase Orders
export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po_001',
    poNumber: 'PO-2026-00001',
    supplierId: 'sup_001',
    supplierName: 'Sysmex Asia Pacific Pte Ltd',
    supplierCode: 'SUP-001',
    status: 'Received',
    subTotal: 165000,
    taxAmount: 13200,
    shippingCost: 5000,
    totalCost: 183200,
    createdById: 'usr_doc',
    createdByName: 'Nuwani Upeksha',
    createdByRole: 'Documentation Officer',
    createdAt: '2026-06-25T10:00:00Z',
    updatedAt: '2026-07-01T15:30:00Z',
    approvedById: 'usr_manager',
    approvedByName: 'Ravindra Kumaranayake',
    approvedAt: '2026-06-26T11:00:00Z',
    remarks: 'Urgent hematology spare parts procurement.',
    shippingTerms: 'CIF Colombo Port',
    expectedDeliveryDate: '2026-07-01',
    items: [
      {
        id: 'poi_001',
        itemId: 'inv_sys_001',
        partCode: 'AV-PRT-SYS-001',
        partName: 'Aspiration Probe (Sysmex XN Series)',
        quantity: 2,
        unitPrice: 45000,
        totalPrice: 90000
      },
      {
        id: 'poi_002',
        itemId: 'inv_sys_002',
        partCode: 'AV-PRT-SYS-002',
        partName: 'Sysmex Cellclean CL (50mL)',
        quantity: 5,
        unitPrice: 15000,
        totalPrice: 75000
      }
    ]
  },
  {
    id: 'po_002',
    poNumber: 'PO-2026-00002',
    supplierId: 'sup_001',
    supplierName: 'Sysmex Asia Pacific Pte Ltd',
    supplierCode: 'SUP-001',
    status: 'Pending Approval',
    subTotal: 195000,
    taxAmount: 15600,
    shippingCost: 8000,
    totalCost: 218600,
    createdById: 'usr_workshop_eng',
    createdByName: 'Roshan Silva',
    createdByRole: 'Workshop Engineer',
    createdAt: '2026-07-10T14:20:00Z',
    updatedAt: '2026-07-10T14:20:00Z',
    remarks: 'Vacuum pump and optical block replacements.',
    shippingTerms: 'FOB Tokyo',
    expectedDeliveryDate: '2026-08-15',
    items: [
      {
        id: 'poi_003',
        itemId: 'inv_rch_002',
        partCode: 'AV-PRT-RCH-002',
        partName: 'Syringe Pipette Unit (cobas e411)',
        quantity: 1,
        unitPrice: 195000,
        totalPrice: 195000
      }
    ]
  },
  {
    id: 'po_003',
    poNumber: 'PO-2026-00003',
    supplierId: 'sup_001',
    supplierName: 'Sysmex Asia Pacific Pte Ltd',
    supplierCode: 'SUP-001',
    status: 'Draft',
    subTotal: 125000,
    taxAmount: 10000,
    shippingCost: 5000,
    totalCost: 140000,
    createdById: 'usr_doc',
    createdByName: 'Nuwani Upeksha',
    createdByRole: 'Documentation Officer',
    createdAt: '2026-07-14T09:15:00Z',
    updatedAt: '2026-07-14T09:15:00Z',
    remarks: 'Regular consumable reagent probe restocking.',
    shippingTerms: 'DDP Colombo',
    expectedDeliveryDate: '2026-09-01',
    items: [
      {
        id: 'poi_004',
        itemId: 'inv_sys_003',
        partCode: 'AV-PRT-SYS-003',
        partName: 'Sampling Valve Unit V4',
        quantity: 1,
        unitPrice: 125000,
        totalPrice: 125000
      }
    ]
  }
];

// Seed Goods Received Notes (GRN)
export const INITIAL_GRNS: Grn[] = [
  {
    id: 'grn_001',
    grnNumber: 'GRN-2026-00001',
    poId: 'po_001',
    poNumber: 'PO-2026-00001',
    supplierId: 'sup_001',
    supplierName: 'Sysmex Asia Pacific Pte Ltd',
    deliveryNoteNumber: 'DN-94827',
    invoiceNumber: 'INV-2026-1029',
    receivedById: 'usr_doc',
    receivedByName: 'Nuwani Upeksha',
    receivedByRole: 'Documentation Officer',
    receivedAt: '2026-07-01T15:30:00Z',
    status: 'Verified',
    inspectionPassed: true,
    remarks: 'Goods received in perfect condition. Packaging intact. Passed initial physical and quantitative inspection.',
    items: [
      {
        id: 'grni_001',
        itemId: 'inv_sys_001',
        partCode: 'AV-PRT-SYS-001',
        partName: 'Aspiration Probe (Sysmex XN Series)',
        orderedQty: 2,
        receivedQty: 2,
        acceptedQty: 2,
        rejectedQty: 0,
        remarks: 'Passed physical dimension inspection.'
      },
      {
        id: 'grni_002',
        itemId: 'inv_sys_002',
        partCode: 'AV-PRT-SYS-002',
        partName: 'Sysmex Cellclean CL (50mL)',
        orderedQty: 5,
        receivedQty: 5,
        acceptedQty: 5,
        rejectedQty: 0,
        remarks: 'Lot and expiry verified (Exp: 2028-06).'
      }
    ]
  }
];

// Helper functions for state modification with localStorage backup
export const getStoredData = () => {
  if (typeof window === 'undefined') return null;
  
  const jobs = localStorage.getItem('avon_jobs');
  const assets = localStorage.getItem('avon_assets');
  const audits = localStorage.getItem('avon_audits');
  const kpis = localStorage.getItem('avon_kpis');
  const customers = localStorage.getItem('avon_customers');
  const suppliers = localStorage.getItem('avon_suppliers');
  const activeUser = localStorage.getItem('avon_active_user');
  const users = localStorage.getItem('avon_users');
  const inventory = localStorage.getItem('avon_inventory');
  const stockMovements = localStorage.getItem('avon_stock_movements');
  const purchaseOrders = localStorage.getItem('avon_purchase_orders');
  const grns = localStorage.getItem('avon_grns');

  return {
    jobs: jobs ? JSON.parse(jobs) : null,
    assets: assets ? JSON.parse(assets) : null,
    audits: audits ? JSON.parse(audits) : null,
    kpis: kpis ? JSON.parse(kpis) : null,
    customers: customers ? JSON.parse(customers) : null,
    suppliers: suppliers ? JSON.parse(suppliers) : null,
    activeUser: activeUser ? JSON.parse(activeUser) : null,
    users: users ? JSON.parse(users) : null,
    inventory: inventory ? JSON.parse(inventory) : null,
    stockMovements: stockMovements ? JSON.parse(stockMovements) : null,
    purchaseOrders: purchaseOrders ? JSON.parse(purchaseOrders) : null,
    grns: grns ? JSON.parse(grns) : null,
  };
};

export const initializeStorage = () => {
  // One-time purge of existing mock/seed data to support "Remove the data in the system"
  if (localStorage.getItem('avon_data_v4_purged') !== 'true') {
    const keysToPurge = [
      'avon_jobs', 'avon_assets', 'avon_audits', 'avon_kpis', 'avon_customers', 
      'avon_suppliers', 'avon_inventory', 'avon_stock_movements', 'avon_purchase_orders', 
      'avon_grns', 'avon_installation_requests', 'avon_installation_assignments', 
      'avon_installation_assignment_audit_logs', 'avon_local_installations_v2', 
      'avon_local_instruments_v2', 'avon_local_calibrations_v2'
    ];
    keysToPurge.forEach(k => localStorage.removeItem(k));
    localStorage.setItem('avon_data_v4_purged', 'true');
  }

  const data = getStoredData();
  if (!data.jobs) localStorage.setItem('avon_jobs', JSON.stringify([]));
  if (!data.assets) localStorage.setItem('avon_assets', JSON.stringify([]));
  if (!data.audits) localStorage.setItem('avon_audits', JSON.stringify([]));
  if (!data.kpis) localStorage.setItem('avon_kpis', JSON.stringify([]));
  if (!data.customers) localStorage.setItem('avon_customers', JSON.stringify([]));
  if (!data.suppliers) localStorage.setItem('avon_suppliers', JSON.stringify([]));
  
  // Always synchronize avon_users and avon_active_user to match requested settings
  const existingUsersStr = localStorage.getItem('avon_users');
  let needsUserReset = false;
  if (existingUsersStr) {
    try {
      const existingUsers = JSON.parse(existingUsersStr);
      if (existingUsers.length !== 2) {
        needsUserReset = true;
      } else {
        const sysAdmin = existingUsers.find((u: any) => u.id === 'usr_sys_admin');
        const admin = existingUsers.find((u: any) => u.id === 'usr_admin');
        if (!sysAdmin || sysAdmin.name !== 'System Admin' || sysAdmin.email !== 'administrator@avon.lk' || sysAdmin.password !== 'Superstar') {
          needsUserReset = true;
        }
        if (!admin || admin.name !== 'Admin' || admin.email !== 'admin@avon.lk' || admin.password !== 'Cherub') {
          needsUserReset = true;
        }
      }
    } catch (e) {
      needsUserReset = true;
    }
  } else {
    needsUserReset = true;
  }

  if (needsUserReset) {
    localStorage.setItem('avon_users', JSON.stringify(MOCK_USERS));
    localStorage.setItem('avon_active_user', JSON.stringify(MOCK_USERS[0]));
  } else {
    const activeUserStr = localStorage.getItem('avon_active_user');
    if (activeUserStr) {
      try {
        const activeUser = JSON.parse(activeUserStr);
        const matched = MOCK_USERS.find(u => u.id === activeUser.id);
        if (matched) {
          localStorage.setItem('avon_active_user', JSON.stringify(matched));
        } else {
          localStorage.setItem('avon_active_user', JSON.stringify(MOCK_USERS[0]));
        }
      } catch (e) {
        localStorage.setItem('avon_active_user', JSON.stringify(MOCK_USERS[0]));
      }
    } else {
      localStorage.setItem('avon_active_user', JSON.stringify(MOCK_USERS[0]));
    }
  }
  if (!localStorage.getItem('avon_inventory')) localStorage.setItem('avon_inventory', JSON.stringify([]));
  if (!localStorage.getItem('avon_stock_movements')) localStorage.setItem('avon_stock_movements', JSON.stringify([]));
  if (!data.purchaseOrders) localStorage.setItem('avon_purchase_orders', JSON.stringify([]));
  if (!data.grns) localStorage.setItem('avon_grns', JSON.stringify([]));
};

export const resetStorage = () => {
  localStorage.setItem('avon_jobs', JSON.stringify([]));
  localStorage.setItem('avon_assets', JSON.stringify([]));
  localStorage.setItem('avon_audits', JSON.stringify([]));
  localStorage.setItem('avon_kpis', JSON.stringify([]));
  localStorage.setItem('avon_customers', JSON.stringify([]));
  localStorage.setItem('avon_suppliers', JSON.stringify([]));
  localStorage.setItem('avon_users', JSON.stringify(MOCK_USERS));
  localStorage.setItem('avon_active_user', JSON.stringify(MOCK_USERS[0]));
  localStorage.setItem('avon_inventory', JSON.stringify([]));
  localStorage.setItem('avon_stock_movements', JSON.stringify([]));
  localStorage.setItem('avon_purchase_orders', JSON.stringify([]));
  localStorage.setItem('avon_grns', JSON.stringify([]));
  window.location.reload();
};

export const logAudit = (
  user: UserProfile,
  action: string,
  remarks: string,
  prev?: string,
  next?: string
) => {
  const auditsStr = localStorage.getItem('avon_audits') || '[]';
  const audits: AuditLogRecord[] = JSON.parse(auditsStr);
  const newLog: AuditLogRecord = {
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action,
    previousValue: prev,
    newValue: next,
    remarks
  };
  audits.unshift(newLog);
  localStorage.setItem('avon_audits', JSON.stringify(audits));
};
