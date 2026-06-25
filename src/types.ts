/**
 * AVON ServicePro - Enterprise Service Management Types
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 
  | 'Area Engineer'
  | 'Workshop Manager'
  | 'Documentation Officer'
  | 'Senior Biomedical Engineer'
  | 'Biomedical Engineer'
  | 'Junior Biomedical Engineer'
  | 'Senior Service Engineer'
  | 'Service Engineer'
  | 'Junior Service Engineer'
  | 'Senior Workshop Engineer'
  | 'Workshop Engineer'
  | 'Junior Workshop Engineer'
  | 'Calibration Engineer'
  | 'Technician'
  | 'Trainee Technician'
  | 'Trainee Engineer'
  | 'Intern Technician'
  | 'MANAGER'
  | 'ENGINEER'
  | 'CUSTOMER'
  | 'DIRECTOR';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  phone?: string;
  tags?: string[];
}

export interface Customer {
  id: string;
  customerCode?: string;
  name: string;
  labType: 'Clinical Laboratory' | 'Pharmaceutical Factory' | 'Research Institute' | 'Hospital Diagnostics' | string;
  customerType?: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  contactPerson: string;
  province?: string;
  district?: string;
  territory?: string;
  territoryId?: string;
  active?: boolean;
  created_at: string;
}

export interface Instrument {
  id: string;
  serialNumber: string;
  name: string; // instrument_name e.g., HPLC-2030, Gas Chromatograph
  model: string;
  brand: 'SHIMADZU' | 'THERMO SCIENTIFIC' | 'AGILENT' | 'EPPENDORF' | 'AVON SPEC' | string;
  department: string;
  customerId: string;
  customerName: string;
  installationDate: string;
  installationStatus: 'COMPLETED' | 'PENDING_SIGNOFF' | 'SCHEDULED' | string;
  warrantyStart: string;
  warrantyExpiry: string;
  amcType: 'NONE' | 'AMC' | 'CAMC' | string;
  status: 'OPERATIONAL' | 'FAULTY' | 'WORKSHOP' | 'CALIBRATING' | 'DOWN' | 'PENDING_INSTALLATION' | 'DECOMMISSIONED' | string;
  assetNo?: string; // asset_no
  invoiceNumber?: string; // invoice_number
  invoiceDate?: string; // invoice_date
  invoiceValue?: number; // invoice_value
  description?: string;
  warrantyPeriod?: number; // in months
  serviceInterval?: number; // service_interval in months
  serviceContract?: string; // service_contract e.g. AMC, CAMC, WARRANTY, NONE
  calibrationRequired?: boolean; // calibration_required
  remarks?: string; // remarks
  departmentId?: string; // department_id
  endUserId?: string; // end_user_id
  territoryId?: string; // territory_id
  areaEngineerId?: string; // area_engineer_id
  productCategory?: string; // Life Science, Clinical Diagnostics, General Laboratory, Microscopy, Cold Storage, Calibration Equipment
  productLine?: string; // PCR, qPCR, Centrifuge, Autoclave, Microscope, Spectrophotometer, HPLC, Balance, Deep Freezer, Incubator, Laminar Flow, Other
  deliveryDate?: string; // delivery_date
  endUser?: string;
  assignedTerritory?: string;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
}

export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  type: 'WARRANTY_SERVICE' | 'NON_WARRANTY_SERVICE' | 'WARRANTY_REPAIR' | 'CALIBRATION';
  instrumentId: string;
  instrumentName: string;
  serialNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'RECEIVED' | 'DIAGNOSING' | 'PENDING_PARTS' | 'REPAIRING' | 'CALIBRATING' | 'QUALITY_CHECK' | 'READY_DELIVERY' | 'CLOSED';
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  createdAt: string;
  resolvedAt?: string;
  downTimeHours?: number;
  workshopBench?: string; // Workshop location
  estimatedCost?: number;
  billingApproved?: boolean;
}

export interface CalibrationRecord {
  id: string;
  certificateNo: string;
  instrumentId: string;
  instrumentName: string;
  serialNumber: string;
  calibrationDate: string;
  dueDate: string;
  standardEquipment: string; // e.g., NIST Traceable Weights, Class A Flasks
  temperature: number; // in Celsius
  humidity: number; // in %
  reportedError: number; // in %
  allowableError: number; // in %
  status: 'PASSED' | 'FAILED';
  calibratedBy: string;
  approvedBy: string;
}

export interface CSATRecord {
  id: string;
  ticketId: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  serviceRating: number; // 1-5 stars
  supportRating: number; // 1-5 stars
  npsScore: number; // 0-10 Likelihood to recommend
  feedbackText: string;
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'CALIBRATION_EXPIRY' | 'TICKET_STATUS' | 'AMC_RENEWAL' | 'SYSTEM';
  severity: 'INFO' | 'WARNING' | 'ALERT';
  timestamp: string;
  read: boolean;
}

export interface ServiceKpis {
  mttrHours: number; // Mean Time to Repair
  mtbfDays: number; // Mean Time Between Failures
  slaCompliance: number; // % SLA satisfied
  engineerUtilization: number; // % utilization
  firstTimeFixRate: number; // %
}

export type InstallationStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Overdue';

export interface InstallationChecklist {
  unboxed: boolean;
  electricalSafetyChecked: boolean;
  calibrationVerified: boolean;
  userTrained: boolean;
}

export interface Installation {
  id: string;
  installationNumber: string;
  instrumentId: string;
  instrumentName: string;
  serialNumber: string;
  customerId: string;
  customerName: string;
  location: string;
  status: InstallationStatus;
  createdAt: string; // ISO string when created
  slaDeadline: string; // ISO string when SLA is due (createdAt + 15 days)
  
  // Workflow fields
  createdById?: string;
  createdByName?: string;
  
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedAt?: string;
  assignedById?: string;
  assignedByName?: string;
  
  completedAt?: string;
  completedById?: string;
  completedByName?: string;
  reportNotes?: string;
  checklist: InstallationChecklist;
  
  warrantyCardUpdated: boolean;
  warrantyCardUpdatedBy?: string;
  warrantyCardUpdatedById?: string;
  warrantyCardUpdatedAt?: string;
  warrantyStart?: string;
  warrantyExpiry?: string;
}

export interface TerritoryEngineerAssignment {
  id: string;
  territory_id: string;
  engineer_id: string;
  engineer_name: string;
  assignment_type: 'PRIMARY' | 'BACKUP';
  active: boolean;
  assigned_at: string;
}

export interface Territory {
  id: string;
  territory_code: string;
  territory_name: string;
  name: string; // alias for backward compatibility
  province: string;
  district: string; // primary district or joined string
  districtsCovered: string[];
  description: string;
  active: boolean;
  isActive: boolean;
  created_at: string;
  assignedEngineerId: string;
  assignedEngineerName: string;
  backupEngineerId: string;
  backupEngineerName: string;
  slaCompliance: number; // percentage, e.g. 95.5
  activeTicketsCount: number;
  totalServiceValue: number; // cumulative LKR value
  engineers?: TerritoryEngineerAssignment[];
}

// =================================================================
// AVON ServicePro V2 Enterprise Database Architecture Interfaces
// =================================================================

export type V2JobType = 
  | 'INSTALLATION'
  | 'WARRANTY_SERVICE'
  | 'NON_WARRANTY_SERVICE'
  | 'WARRANTY_REPAIR'
  | 'WORKSHOP_JOB'
  | 'CALIBRATION_JOB';

export interface V2JobMaster {
  id: string;
  jobNo: string;
  jobType: V2JobType;
  jobCategory: string;
  customerId: string;
  customerName?: string;
  departmentId: string;
  departmentName?: string;
  instrumentId: string;
  instrumentName?: string;
  serialNumber?: string;
  territoryId: string;
  territoryName?: string;
  areaEngineerId: string;
  areaEngineerName?: string;
  workshopEngineerId?: string;
  workshopEngineerName?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  statusId: string;
  statusName?: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  slaStatus: 'COMPLIANT' | 'WARNING' | 'BREACHED';
  remarks?: string;
}

export interface V2JobAssignment {
  id: string;
  jobId: string;
  assignedTo: string;
  assignedToName?: string;
  assignedBy: string;
  assignedByName?: string;
  assignedDate: string;
  acceptedDate?: string;
  completedDate?: string;
  roleOnJob: 'Area Engineer' | 'Workshop Engineer' | 'Calibration Engineer' | 'Technician' | 'Trainee' | 'Intern';
  active: boolean;
}

export interface V2TerritoryEngineer {
  territoryId: string;
  territoryName: string;
  primaryEngineer: string;
  primaryEngineerName: string;
  backupEngineer: string;
  backupEngineerName: string;
  startDate: string;
  endDate?: string;
  active: boolean;
}

export interface V2WorkflowStatus {
  id: string;
  moduleName: 'INSTALLATION' | 'SERVICE' | 'WORKSHOP' | 'CALIBRATION';
  statusName: string;
  statusColor: string;
  sortOrder: number;
  active: boolean;
}

export interface V2WorkflowTransition {
  id: string;
  moduleName: string;
  fromStatus: string;
  toStatus: string;
  roleAllowed: string[];
}

export interface V2SLARule {
  moduleName: string;
  jobType: V2JobType;
  targetDays: number;
  workingDaysOnly: boolean;
  warningDays: number;
  active: boolean;
}

export interface V2SLATracking {
  jobId: string;
  startDate: string;
  dueDate: string;
  warningDate: string;
  completedDate?: string;
  slaResult: 'ON_TRACK' | 'SLA_MET' | 'WARNING_ISSUED' | 'BREACHED';
}

export interface V2DocumentationUpdate {
  id: string;
  jobId: string;
  documentType: 'Installation Report' | 'Service Report' | 'Inspection Report' | 'Quotation' | 'PO' | 'Memo' | 'Invoice' | 'Calibration Certificate' | 'Workshop Delivery Note';
  documentNumber: string;
  documentDate: string;
  updatedBy: string;
  updatedByName?: string;
  updatedDate: string;
  remarks?: string;
}

export interface V2PartsOrder {
  id: string;
  jobId: string;
  supplier: string;
  partNumber: string;
  partDescription: string;
  quantity: number;
  orderDate: string;
  expectedDate: string;
  receivedDate?: string;
  status: 'Requested' | 'Ordered' | 'Partially Received' | 'Received' | 'Cancelled';
}

export interface V2CustomerFeedback {
  id: string;
  jobId: string;
  jobNo?: string;
  customerId: string;
  customerName?: string;
  endUserId?: string;
  endUserName?: string;
  engineerRating: number; // 1 to 5
  communicationRating: number; // 1 to 5
  technicalSkillRating: number; // 1 to 5
  responseTimeRating: number; // 1 to 5
  overallRating: number; // 1 to 5
  comments?: string;
  submittedDate: string;
}

export interface V2WorkshopReceipt {
  id: string;
  receiptNo: string;
  itemName: string;
  itemModel: string;
  serialNumber: string;
  customerName: string;
  departmentName: string;
  contactPerson: string;
  contactNumber: string;
  warrantyStatus: 'In Warranty' | 'Out Of Warranty' | 'Service Contract';
  receivedParts: string[]; // list of accessories/parts brought in
  deliveryPersonName: string;
  deliveryPersonNic: string;
  receiveDate: string;
  itemCondition: string;
  photos: string[]; // simulated photo URLs or names
  remarks?: string;
}

export type InstallationRequestStatus = 
  | 'Pending Request'
  | 'Pending Assignment'
  | 'Assigned'
  | 'Scheduled'
  | 'Job Accepted'
  | 'Travelling'
  | 'On Site'
  | 'Installation In Progress'
  | 'Installation Completed'
  | 'Installed'
  | 'Report Pending'
  | 'Report Submitted'
  | 'Documentation Review'
  | 'Closed';

export type InstallationPriority = 'Normal' | 'Urgent' | 'Critical';

export interface InstallationAssignment {
  id: string;
  requestId: string;
  assignedEngineer: string;
  assignedTechnicians: string[];
  assignedBy: string;
  assignmentDate: string;
  targetInstallationDate: string;
  priority: InstallationPriority;
  slaDaysSetting: number;
  slaDueDate: string;
  installationTerritory: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstallationAssignmentAuditLog {
  id: string;
  requestId: string;
  assignmentId?: string;
  action: string;
  fromStatus?: InstallationRequestStatus;
  toStatus: InstallationRequestStatus;
  performedBy: string;
  performedByRole: string;
  timestamp: string;
  notes?: string;
}

export interface InstallationRequest {
  id: string;
  invoiceNumber: string;
  invoiceValue: number;
  customerName: string;
  departmentName: string;
  endUserName: string;
  instrumentName: string;
  brand: string;
  model: string;
  serialNumber: string;
  deliveryDate: string; // YYYY-MM-DD
  warrantyPeriod: number;
  warrantyUnit: 'Months' | 'Years' | 'Days';
  remarks?: string;
  status: InstallationRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export type ChecklistItemStatus = 'PASS' | 'FAIL' | 'NOT APPLICABLE';

export interface InstallationReportChecklistItem {
  id: string;
  label: string;
  status: ChecklistItemStatus;
  remarks?: string;
}

export interface InstallationReportData {
  id?: string;
  installationNumber: string;
  jobSheetNumber: string;
  installationDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  customerName: string;
  department: string;
  endUser: string;
  contactNumber: string;
  instrumentName: string;
  brand: string;
  model: string;
  serialNumber: string;
  assetNumber: string;
  invoiceNumber: string;
  assignedEngineer?: string;
  assignedTechnicians?: string[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
  }[];
  checklist: InstallationReportChecklistItem[];
  engineerNotes: {
    workPerformed: string;
    problemsFound: string;
    correctiveActions: string;
    recommendations: string;
    remarks: string;
  };
}

export type ServiceIntervalOption = '6 Months' | '12 Months' | 'No PM';

export interface DocumentationReviewData {
  id?: string;
  installationNumber: string;
  installationDate: string;
  jobSheetNumber: string;
  warrantyCardNumber: string;
  warrantyStartDate: string;
  serviceInterval: ServiceIntervalOption;
  remarks?: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Returned to Engineer';
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface DocumentationReviewAuditLog {
  id: string;
  installationNumber: string;
  action: 'Approve' | 'Reject' | 'Return to Engineer' | 'Update Details';
  performedBy: string;
  performedByRole: string;
  timestamp: string;
  remarks?: string;
}

// Sprint 5.5: Warranty Activation & Preventive Maintenance Engine Types
export interface WarrantyRecord {
  id: string;
  installationNumber: string;
  warrantyCardNumber: string;
  jobSheetNumber: string;
  customerName: string;
  department: string;
  instrumentName: string;
  serialNumber: string;
  assetNumber: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyPeriodMonths: number;
  serviceInterval: ServiceIntervalOption;
  status: 'Active' | 'Expired' | 'Suspended';
  activatedBy: string;
  activatedAt: string;
}

export interface PreventiveMaintenanceSchedule {
  id: string;
  pmNumber: string;
  warrantyCardNumber: string;
  installationNumber: string;
  customerName: string;
  instrumentName: string;
  assetNumber: string;
  serviceInterval: ServiceIntervalOption;
  scheduledDate: string;
  status: 'Scheduled' | 'Dispatched' | 'Completed' | 'Overdue' | 'Cancelled';
  assignedAreaEngineer: string;
  createdAt: string;
}

export interface WarrantyNotification {
  id: string;
  recipientRole: 'Area Engineer' | 'Documentation Officer' | 'Customer';
  recipientName: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'success' | 'info' | 'warning';
}

export interface WarrantyAuditLog {
  id: string;
  referenceNumber: string; // Warranty Card No or PM No
  action: 'Warranty Activated' | 'PM Created' | 'Warranty Service Scheduled' | 'Instrument Status Updated';
  performedBy: string;
  performedByRole: string;
  timestamp: string;
  details: string;
}

export interface WarrantyActivationExecutionPayload {
  installationNumber: string;
  jobSheetNumber: string;
  customerName: string;
  department: string;
  instrumentName: string;
  brand: string;
  model: string;
  serialNumber: string;
  assetNumber: string;
  warrantyCardNumber: string;
  warrantyStartDate: string;
  warrantyPeriodMonths?: number; // default 12
  serviceInterval: ServiceIntervalOption;
  assignedAreaEngineer: string;
  approverName: string;
  approverRole: string;
}

export interface WarrantyActivationEngineResult {
  updatedInstrumentStatus: 'Installed';
  warrantyRecord: WarrantyRecord;
  pmSchedules: PreventiveMaintenanceSchedule[];
  notifications: WarrantyNotification[];
  auditLogs: WarrantyAuditLog[];
}

// Sprint 6.1: Warranty Service Scheduler Types
export type WarrantyServiceStatus = 'Scheduled' | 'Dispatched' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';
export type WarrantyServicePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type WarrantyServiceCategory = 'Overdue' | 'Today' | 'This Week' | 'This Month' | 'Upcoming';

export interface WarrantyServiceTask {
  id: string;
  ticketNumber: string;
  warrantyCardNumber: string;
  customerName: string;
  department: string;
  territory: string;
  instrumentName: string;
  assetNumber: string;
  serialNumber: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: WarrantyServiceStatus;
  priority: WarrantyServicePriority;
  assignedAreaEngineer: string;
  serviceType: 'Preventative Maintenance' | 'Warranty Inspection' | 'Mandatory Calibration';
  estimatedDurationHours: number;
  notes?: string;
  completedDate?: string;
}

export interface WarrantyServiceSchedulerFilterState {
  areaEngineer: string;
  territory: string;
  customer: string;
  instrument: string;
  status: string;
  priority: string;
  searchQuery: string;
}

export interface WarrantyServiceSchedulerMetrics {
  totalScheduled: number;
  dueToday: number;
  overdue: number;
  completedThisMonth: number;
  upcomingThisWeek: number;
}

