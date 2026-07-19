/**
 * Initial business data for AVON ServicePro application
 * Realistic chemical and medical instrumentation records
 */

import { Customer, Instrument, ServiceTicket, CalibrationRecord, CSATRecord, AppNotification, ServiceKpis, Installation, Territory } from '../types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Lanka Hospitals PLC",
    labType: "Hospital Diagnostics",
    email: "lab.admin@lankahospitals.com",
    phone: "+94 11 543 0000",
    address: "No. 578, Elvitigala Mawatha, Colombo 05, Sri Lanka",
    contactPerson: "Dr. Rohitha Wijesekera (Lab Director)",
    created_at: "2024-01-15T08:30:00Z"
  },
  {
    id: "cust-2",
    name: "State Pharmaceuticals Manufacturing Corp (SPMC)",
    labType: "Pharmaceutical Factory",
    email: "qc.manager@spmc.lk",
    phone: "+94 11 250 8263",
    address: "No. 11, Sir John Kotelawala Mawatha, Ratmalana, Sri Lanka",
    contactPerson: "Mrs. Priyanthi Perera (QC Head)",
    created_at: "2024-02-10T09:15:00Z"
  },
  {
    id: "cust-3",
    name: "Medical Research Institute (MRI) Colombo",
    labType: "Research Institute",
    email: "virology.dept@mri.gov.lk",
    phone: "+94 11 269 3532",
    address: "Baseline Road, Colombo 08, Sri Lanka",
    contactPerson: "Prof. Ananda Gunasekera (Senior Virologist)",
    created_at: "2023-11-05T10:00:00Z"
  },
  {
    id: "cust-4",
    name: "Hemas Hospitals Laboratory",
    labType: "Clinical Laboratory",
    email: "pathology@hemashospitals.com",
    phone: "+94 11 788 8888",
    address: "No. 389, Negombo Road, Wattala, Sri Lanka",
    contactPerson: "Dr. Sajani Fernando (Chief Pathologist)",
    created_at: "2024-03-20T11:45:00Z"
  }
];

export const INITIAL_INSTRUMENTS: Instrument[] = [
  {
    id: "inst-1",
    serialNumber: "LC2030-SL2401",
    name: "Prominence-i LC-2030 Integrated HPLC",
    model: "LC-2030 Plus",
    brand: "SHIMADZU",
    department: "Quality Control Department",
    customerId: "cust-2",
    customerName: "State Pharmaceuticals Manufacturing Corp (SPMC)",
    installationDate: "2024-02-18",
    installationStatus: "COMPLETED",
    warrantyStart: "2024-02-18",
    warrantyExpiry: "2025-02-18",
    amcType: "NONE",
    status: "OPERATIONAL",
    calibrationDue: "2026-08-15"
  },
  {
    id: "inst-2",
    serialNumber: "GC1310-TH9981",
    name: "Trace 1310 Gas Chromatograph System",
    model: "Trace 1310 (FID/TCD)",
    brand: "THERMO SCIENTIFIC",
    department: "Biochemistry Unit",
    customerId: "cust-1",
    customerName: "Lanka Hospitals PLC",
    installationDate: "2024-01-20",
    installationStatus: "COMPLETED",
    warrantyStart: "2024-01-20",
    warrantyExpiry: "2025-01-20",
    amcType: "NONE",
    status: "FAULTY",
    calibrationDue: "2026-06-10"
  },
  {
    id: "inst-3",
    serialNumber: "CARY60-AG8822",
    name: "Cary 60 UV-Vis Spectrophotometer",
    model: "Agilent Cary 60",
    brand: "AGILENT",
    department: "Pathology Department",
    customerId: "cust-4",
    customerName: "Hemas Hospitals Laboratory",
    installationDate: "2023-04-12",
    installationStatus: "COMPLETED",
    warrantyStart: "2023-04-12",
    warrantyExpiry: "2024-04-12",
    amcType: "CAMC",
    status: "OPERATIONAL",
    calibrationDue: "2027-06-16"
  },
  {
    id: "inst-4",
    serialNumber: "PCR-NEXUS-EP0921",
    name: "Mastercycler Nexus Gradient Thermocycler",
    model: "Nexus Gradient",
    brand: "EPPENDORF",
    department: "Virology Laboratory",
    customerId: "cust-3",
    customerName: "Medical Research Institute (MRI) Colombo",
    installationDate: "2023-11-15",
    installationStatus: "COMPLETED",
    warrantyStart: "2023-11-15",
    warrantyExpiry: "2024-11-15",
    amcType: "AMC",
    status: "WORKSHOP",
    calibrationDue: "2026-04-05"
  },
  {
    id: "inst-5",
    serialNumber: "HPLC-QP2020-SH035",
    name: "Nexera LC-MS/MS System",
    model: "LCMS-8045",
    brand: "SHIMADZU",
    department: "Toxicology Division",
    customerId: "cust-3",
    customerName: "Medical Research Institute (MRI) Colombo",
    installationDate: "2024-05-10",
    installationStatus: "COMPLETED",
    warrantyStart: "2024-05-10",
    warrantyExpiry: "2025-05-10",
    amcType: "NONE",
    status: "OPERATIONAL",
    calibrationDue: "2027-05-10"
  },
  {
    id: "inst-6",
    serialNumber: "EPREP-094",
    name: "Eppendorf Research Plus Multichannel Pipette Rig",
    model: "Research Plus 12-ch",
    brand: "EPPENDORF",
    department: "Pharma Formulations Dev",
    customerId: "cust-2",
    customerName: "State Pharmaceuticals Manufacturing Corp (SPMC)",
    installationDate: "2026-06-15",
    installationStatus: "PENDING_SIGNOFF",
    warrantyStart: "2026-06-15",
    warrantyExpiry: "2027-06-15",
    amcType: "NONE",
    status: "CALIBRATING"
  }
];

export const INITIAL_TICKETS: ServiceTicket[] = [
  {
    id: "tkt-1",
    ticketNumber: "AVN-RPR-2026-001",
    type: "WARRANTY_REPAIR",
    instrumentId: "inst-2",
    instrumentName: "Trace 1310 Gas Chromatograph System",
    serialNumber: "GC1310-TH9981",
    customerId: "cust-1",
    customerName: "Lanka Hospitals PLC",
    subject: "Baseline drift & FID jet ignition failure",
    description: "During pharmaceutical standard assay testing, fire-up failed on the Flame Ionization Detector (FID). Heavy noise and positive drift have been logged over the past 48 hours. Require jet nozzle cleaning/reconditioning or electronics check.",
    priority: "CRITICAL",
    status: "DIAGNOSING",
    assignedEngineerId: "eng-1",
    assignedEngineerName: "Eng. Suresh Perera",
    createdAt: "2026-06-21T06:00:00Z",
    workshopBench: "Bench C - Gas Chromatography",
    estimatedCost: 145000,
    billingApproved: false
  },
  {
    id: "tkt-2",
    ticketNumber: "AVN-WNT-2026-004",
    type: "WARRANTY_SERVICE",
    instrumentId: "inst-1",
    instrumentName: "Prominence-i LC-2030 Integrated HPLC",
    serialNumber: "LC2030-SL2401",
    customerId: "cust-2",
    customerName: "State Pharmaceuticals Manufacturing Corp (SPMC)",
    subject: "Scheduled Quarterly Preventive Maintenance (PM)",
    description: "Standard PM validation. Replace rotor seal, plunger seal, needle seal, check lamp intensity stats, purge valve check, and system peak pressure stabilization testing.",
    priority: "MEDIUM",
    status: "READY_DELIVERY",
    assignedEngineerId: "eng-2",
    assignedEngineerName: "Eng. Nimani Senanayake",
    createdAt: "2026-06-20T03:00:00Z",
    resolvedAt: "2026-06-22T14:30:00Z",
    downTimeHours: 18.5,
    workshopBench: "Mobile Field Kit 4",
    estimatedCost: 0, // covered under warranty
    billingApproved: true
  },
  {
    id: "tkt-3",
    ticketNumber: "AVN-AMC-2026-007",
    type: "NON_WARRANTY_SERVICE",
    instrumentId: "inst-4",
    instrumentName: "Mastercycler Nexus Gradient Thermocycler",
    serialNumber: "PCR-NEXUS-EP0921",
    customerId: "cust-3",
    customerName: "Medical Research Institute (MRI) Colombo",
    subject: "Thermal block temperature calibration error",
    description: "Lid heater gets hot but the PCR thermal well demonstrates block uniform heating fault code ERR-404 during cycling. Transferred to AVON Workshop for deep block cleaning and calibration verification.",
    priority: "HIGH",
    status: "PENDING_PARTS",
    assignedEngineerId: "eng-1",
    assignedEngineerName: "Eng. Suresh Perera",
    createdAt: "2026-06-18T10:00:00Z",
    workshopBench: "Bench A - Thermal Block Calibration",
    estimatedCost: 85000,
    billingApproved: true
  },
  {
    id: "tkt-4",
    ticketNumber: "AVN-CAL-2026-012",
    type: "CALIBRATION",
    instrumentId: "inst-3",
    instrumentName: "Cary 60 UV-Vis Spectrophotometer",
    serialNumber: "CARY60-AG8822",
    customerId: "cust-4",
    customerName: "Hemas Hospitals Laboratory",
    subject: "Annual Metrology Recalibration Service",
    description: "Verify wavelength accuracy, photometric repeatability and noise thresholds using certified filter sets. Output metrological report certificate conforming to ISO-17025 standards.",
    priority: "MEDIUM",
    status: "CLOSED",
    assignedEngineerId: "eng-2",
    assignedEngineerName: "Eng. Nimani Senanayake",
    createdAt: "2026-06-15T04:00:00Z",
    resolvedAt: "2026-06-16T11:00:00Z",
    downTimeHours: 7,
    workshopBench: "Bench B - Spectrophotometry Standards",
    estimatedCost: 35000,
    billingApproved: true
  }
];

export const INITIAL_CALIBRATIONS: CalibrationRecord[] = [
  {
    id: "cal-1",
    certificateNo: "APCS-CAL-2026-88091",
    instrumentId: "inst-3",
    instrumentName: "Cary 60 UV-Vis Spectrophotometer",
    serialNumber: "CARY60-AG8822",
    calibrationDate: "2026-06-16",
    dueDate: "2027-06-16",
    standardEquipment: "Certified Holmium Oxide Filter (SRM 2034) & Neutral Density Fliters",
    temperature: 21.4,
    humidity: 52.0,
    reportedError: 0.12,
    allowableError: 0.50,
    status: "PASSED",
    calibratedBy: "Eng. Nimani Senanayake",
    approvedBy: "M. N. Jayawardene (AVON Service Manager)"
  },
  {
    id: "cal-2",
    certificateNo: "APCS-CAL-2025-77642",
    instrumentId: "inst-1",
    instrumentName: "Prominence-i LC-2030 Integrated HPLC",
    serialNumber: "LC2030-SL2401",
    calibrationDate: "2025-02-20",
    dueDate: "2026-02-20",
    standardEquipment: "Ultra-pure Caffeine standard standards validation kit",
    temperature: 22.0,
    humidity: 48.5,
    reportedError: 0.08,
    allowableError: 0.20,
    status: "PASSED",
    calibratedBy: "Eng. Suresh Perera",
    approvedBy: "M. N. Jayawardene (AVON Service Manager)"
  }
];

export const INITIAL_CSAT: CSATRecord[] = [
  {
    id: "csat-1",
    ticketId: "tkt-4",
    ticketNumber: "AVN-CAL-2026-012",
    customerId: "cust-4",
    customerName: "Hemas Hospitals Laboratory",
    serviceRating: 5,
    supportRating: 5,
    npsScore: 10,
    feedbackText: "Superb speed. Calibration report with certificate came in very professionally typed. Our ISO audit team accepted it on the spot without single inquiry. Thank you AVON team!",
    date: "2026-06-17"
  },
  {
    id: "csat-2",
    ticketId: "tkt-2",
    ticketNumber: "AVN-WNT-2026-004",
    customerId: "cust-2",
    customerName: "State Pharmaceuticals Manufacturing Corp (SPMC)",
    serviceRating: 4,
    supportRating: 4,
    npsScore: 9,
    feedbackText: "Quarterly preventative maintenance done very well. Minimal impact on QC batch testing schedule.",
    date: "2026-06-22"
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Mandatory Recalibration Overdue",
    message: "Chromatograph GC1310-TH9981 calibration has run past its scheduled threshold. Recalibrate immediately and re-verify standards.",
    type: "CALIBRATION_EXPIRY",
    severity: "ALERT",
    timestamp: "2026-06-22T08:00:00Z",
    read: false
  },
  {
    id: "notif-2",
    title: "Pending Parts Booking",
    message: "Thermocycler AVN-AMC-2026-007 is awaiting booking of replacement high-power Peltier block module from Eppendorf Hamburg.",
    type: "TICKET_STATUS",
    severity: "WARNING",
    timestamp: "2026-06-21T11:30:00Z",
    read: false
  },
  {
    id: "notif-3",
    title: "SLA Agreement Imminent Expiration",
    message: "Lanka Hospitals main laboratory support SLA contract for GC is expiring within 30 days. AMC renewal proposal draft generated.",
    type: "AMC_RENEWAL",
    severity: "INFO",
    timestamp: "2026-06-20T14:15:00Z",
    read: true
  }
];

export const SYSTEM_KPIS: ServiceKpis = {
  mttrHours: 12.4, // Mean Time to Repair
  mtbfDays: 142,   // Mean Time Between Failures
  slaCompliance: 96.2, // SLA targets met
  engineerUtilization: 88.5, // utilization rate
  firstTimeFixRate: 92.0 // first session success
};

export const INITIAL_INSTALLATIONS: Installation[] = [
  {
    id: "inst-fit-1",
    installationNumber: "INS-2026-001",
    instrumentId: "inst-2",
    instrumentName: "Trace 1310 Gas Chromatograph System",
    serialNumber: "GC1310-TH9981",
    customerId: "cust-1",
    customerName: "Lanka Hospitals PLC",
    location: "Main Laboratory, 3rd Floor",
    status: "Pending",
    createdAt: "2026-06-22T09:00:00Z",
    slaDeadline: "2026-07-07T09:00:00Z",
    createdById: "usr-do-1",
    createdByName: "Fathima Farhana",
    checklist: {
      unboxed: false,
      electricalSafetyChecked: false,
      calibrationVerified: false,
      userTrained: false
    },
    warrantyCardUpdated: false
  },
  {
    id: "inst-fit-2",
    installationNumber: "INS-2026-002",
    instrumentId: "inst-3",
    instrumentName: "Cary 60 UV-Vis Spectrophotometer",
    serialNumber: "CARY60-AG8822",
    customerId: "cust-4",
    customerName: "Hemas Hospitals Laboratory",
    location: "Biochemistry Annex, Ground Floor",
    status: "Assigned",
    createdAt: "2026-06-21T10:30:00Z",
    slaDeadline: "2026-07-06T10:30:00Z",
    createdById: "usr-do-1",
    createdByName: "Fathima Farhana",
    assignedStaffId: "usr-sbe-1",
    assignedStaffName: "Eng. Suresh Perera",
    assignedAt: "2026-06-22T14:45:00Z",
    assignedById: "usr-wm-1",
    assignedByName: "M. N. Jayawardene",
    checklist: {
      unboxed: true,
      electricalSafetyChecked: false,
      calibrationVerified: false,
      userTrained: false
    },
    warrantyCardUpdated: false
  },
  {
    id: "inst-fit-3",
    installationNumber: "INS-2026-003",
    instrumentId: "inst-4",
    instrumentName: "Mastercycler Nexus Gradient Thermocycler",
    serialNumber: "PCR-NEXUS-EP0921",
    customerId: "cust-3",
    customerName: "Medical Research Institute (MRI) Colombo",
    location: "Virology Wing, Lab Unit B",
    status: "In Progress",
    createdAt: "2026-06-18T08:15:00Z",
    slaDeadline: "2026-07-03T08:15:00Z",
    createdById: "usr-do-1",
    createdByName: "Fathima Farhana",
    assignedStaffId: "usr-ce-1",
    assignedStaffName: "Eng. Nimani Senanayake",
    assignedAt: "2026-06-19T09:30:00Z",
    assignedById: "usr-wm-1",
    assignedByName: "M. N. Jayawardene",
    checklist: {
      unboxed: true,
      electricalSafetyChecked: true,
      calibrationVerified: false,
      userTrained: false
    },
    warrantyCardUpdated: false
  },
  {
    id: "inst-fit-4",
    installationNumber: "INS-2026-004",
    instrumentId: "inst-1",
    instrumentName: "Prominence-i LC-2030 Integrated HPLC",
    serialNumber: "LC2030-SL2401",
    customerId: "cust-2",
    customerName: "State Pharmaceuticals Manufacturing Corp (SPMC)",
    location: "Quality Assurance Division",
    status: "Completed",
    createdAt: "2026-06-08T11:00:00Z",
    slaDeadline: "2026-06-23T11:00:00Z",
    createdById: "usr-do-1",
    createdByName: "Fathima Farhana",
    assignedStaffId: "usr-sbe-1",
    assignedStaffName: "Eng. Suresh Perera",
    assignedAt: "2026-06-09T10:00:00Z",
    assignedById: "usr-wm-1",
    assignedByName: "M. N. Jayawardene",
    completedAt: "2026-06-12T16:30:00Z",
    completedById: "usr-sbe-1",
    completedByName: "Eng. Suresh Perera",
    reportNotes: "All unboxing, leveling and basic calibration checks passed. Completed hands-on training with 4 QC operators. Instrument is ready for routine pharmaceutical assays.",
    checklist: {
      unboxed: true,
      electricalSafetyChecked: true,
      calibrationVerified: true,
      userTrained: true
    },
    warrantyCardUpdated: true,
    warrantyCardUpdatedBy: "Fathima Farhana",
    warrantyCardUpdatedById: "usr-do-1",
    warrantyCardUpdatedAt: "2026-06-13T10:15:00Z",
    warrantyStart: "2026-06-12",
    warrantyExpiry: "2027-06-12"
  },
  {
    id: "inst-fit-5",
    installationNumber: "INS-2026-005",
    instrumentId: "inst-5",
    instrumentName: "Nexera LC-MS/MS System",
    serialNumber: "HPLC-QP2020-SH035",
    customerId: "cust-3",
    customerName: "Medical Research Institute (MRI) Colombo",
    location: "Toxicology Screening Lab",
    status: "Overdue",
    createdAt: "2026-06-01T09:30:00Z",
    slaDeadline: "2026-06-16T09:30:00Z", // Past SLA
    createdById: "usr-do-1",
    createdByName: "Fathima Farhana",
    checklist: {
      unboxed: false,
      electricalSafetyChecked: false,
      calibrationVerified: false,
      userTrained: false
    },
    warrantyCardUpdated: false
  }
];

export const INITIAL_TERRITORIES: Territory[] = [
  {
    id: "terr-1",
    territory_code: "TER-WP-01",
    territory_name: "Colombo Metro Division",
    name: "Colombo Metro Division",
    province: "Western",
    district: "Colombo",
    districtsCovered: ["Colombo", "Gampaha", "Kalutara"],
    description: "Primary commercial hub covering high-density hospital diagnostics and pharma manufacturing labs in Colombo & Gampaha.",
    active: true,
    isActive: true,
    created_at: "2024-01-10T08:00:00Z",
    assignedEngineerId: "eng-1",
    assignedEngineerName: "Eng. Suresh Perera",
    backupEngineerId: "eng-2",
    backupEngineerName: "Eng. Nimani Senanayake",
    slaCompliance: 98.4,
    activeTicketsCount: 3,
    totalServiceValue: 2450000,
    engineers: [
      {
        id: "te-1",
        territory_id: "terr-1",
        engineer_id: "eng-1",
        engineer_name: "Eng. Suresh Perera",
        assignment_type: "PRIMARY",
        active: true,
        assigned_at: "2024-01-10T08:30:00Z"
      },
      {
        id: "te-2",
        territory_id: "terr-1",
        engineer_id: "eng-2",
        engineer_name: "Eng. Nimani Senanayake",
        assignment_type: "BACKUP",
        active: true,
        assigned_at: "2024-01-10T08:30:00Z"
      }
    ]
  },
  {
    id: "terr-2",
    territory_code: "TER-CP-01",
    territory_name: "Central Hill Country",
    name: "Central Hill Country",
    province: "Central",
    district: "Kandy",
    districtsCovered: ["Kandy", "Matale", "Nuwara Eliya"],
    description: "Regional university labs, tea estate research institutes, and clinical diagnostic centers across central highlands.",
    active: true,
    isActive: true,
    created_at: "2024-01-12T09:00:00Z",
    assignedEngineerId: "eng-2",
    assignedEngineerName: "Eng. Nimani Senanayake",
    backupEngineerId: "eng-3",
    backupEngineerName: "Eng. Kanishka Jayasundera",
    slaCompliance: 95.0,
    activeTicketsCount: 1,
    totalServiceValue: 890000,
    engineers: [
      {
        id: "te-3",
        territory_id: "terr-2",
        engineer_id: "eng-2",
        engineer_name: "Eng. Nimani Senanayake",
        assignment_type: "PRIMARY",
        active: true,
        assigned_at: "2024-01-12T09:15:00Z"
      },
      {
        id: "te-4",
        territory_id: "terr-2",
        engineer_id: "eng-3",
        engineer_name: "Eng. Kanishka Jayasundera",
        assignment_type: "BACKUP",
        active: true,
        assigned_at: "2024-01-12T09:15:00Z"
      }
    ]
  },
  {
    id: "terr-3",
    territory_code: "TER-SP-01",
    territory_name: "Southern Coastal Belt",
    name: "Southern Coastal Belt",
    province: "Southern",
    district: "Galle",
    districtsCovered: ["Galle", "Matara", "Hambantota"],
    description: "Coastal healthcare facilities, marine biochemistry units, and southern port authority testing labs.",
    active: true,
    isActive: true,
    created_at: "2024-01-15T10:00:00Z",
    assignedEngineerId: "eng-3",
    assignedEngineerName: "Eng. Kanishka Jayasundera",
    backupEngineerId: "eng-1",
    backupEngineerName: "Eng. Suresh Perera",
    slaCompliance: 91.2,
    activeTicketsCount: 0,
    totalServiceValue: 1200000,
    engineers: [
      {
        id: "te-5",
        territory_id: "terr-3",
        engineer_id: "eng-3",
        engineer_name: "Eng. Kanishka Jayasundera",
        assignment_type: "PRIMARY",
        active: true,
        assigned_at: "2024-01-15T10:30:00Z"
      },
      {
        id: "te-6",
        territory_id: "terr-3",
        engineer_id: "eng-1",
        engineer_name: "Eng. Suresh Perera",
        assignment_type: "BACKUP",
        active: true,
        assigned_at: "2024-01-15T10:30:00Z"
      }
    ]
  },
  {
    id: "terr-4",
    territory_code: "TER-NP-01",
    territory_name: "Northern Dry Zone",
    name: "Northern Dry Zone",
    province: "Northern",
    district: "Jaffna",
    districtsCovered: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    description: "Extended northern provincial hospitals, agriculture research stations, and food safety inspection facilities.",
    active: true,
    isActive: true,
    created_at: "2024-01-20T11:00:00Z",
    assignedEngineerId: "eng-4",
    assignedEngineerName: "Eng. Dilhan Gunawardena",
    backupEngineerId: "eng-3",
    backupEngineerName: "Eng. Kanishka Jayasundera",
    slaCompliance: 88.6,
    activeTicketsCount: 1,
    totalServiceValue: 450000,
    engineers: [
      {
        id: "te-7",
        territory_id: "terr-4",
        engineer_id: "eng-4",
        engineer_name: "Eng. Dilhan Gunawardena",
        assignment_type: "PRIMARY",
        active: true,
        assigned_at: "2024-01-20T11:15:00Z"
      },
      {
        id: "te-8",
        territory_id: "terr-4",
        engineer_id: "eng-3",
        engineer_name: "Eng. Kanishka Jayasundera",
        assignment_type: "BACKUP",
        active: true,
        assigned_at: "2024-01-20T11:15:00Z"
      }
    ]
  },
  {
    id: "terr-5",
    territory_code: "TER-EP-01",
    territory_name: "East Coast Frontier",
    name: "East Coast Frontier",
    province: "Eastern",
    district: "Trincomalee",
    districtsCovered: ["Trincomalee", "Batticaloa", "Ampara"],
    description: "Eastern provincial healthcare network and aquaculture testing laboratories.",
    active: false,
    isActive: false,
    created_at: "2024-02-01T12:00:00Z",
    assignedEngineerId: "eng-5",
    assignedEngineerName: "Eng. Fathima Rizna",
    backupEngineerId: "eng-4",
    backupEngineerName: "Eng. Dilhan Gunawardena",
    slaCompliance: 92.0,
    activeTicketsCount: 0,
    totalServiceValue: 150000,
    engineers: [
      {
        id: "te-9",
        territory_id: "terr-5",
        engineer_id: "eng-5",
        engineer_name: "Eng. Fathima Rizna",
        assignment_type: "PRIMARY",
        active: false,
        assigned_at: "2024-02-01T12:30:00Z"
      },
      {
        id: "te-10",
        territory_id: "terr-5",
        engineer_id: "eng-4",
        engineer_name: "Eng. Dilhan Gunawardena",
        assignment_type: "BACKUP",
        active: false,
        assigned_at: "2024-02-01T12:30:00Z"
      }
    ]
  }
];


