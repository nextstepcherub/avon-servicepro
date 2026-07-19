export type UserRole =
  | 'System Admin'
  | 'Admin'
  | 'Workshop Manager'
  | 'Documentation Officer'
  | 'Senior Biomedical Engineer'
  | 'Biomedical Engineer'
  | 'Senior Service Engineer'
  | 'Service Engineer'
  | 'Calibration Engineer'
  | 'Senior Workshop Engineer'
  | 'Workshop Engineer'
  | 'Technician'
  | 'Trainee Technician'
  | 'Trainee Engineer'
  | 'Intern Technician'
  | string;

export type EngineerTag = 
  | 'Area Engineer' 
  | 'Workshop Engineer' 
  | 'Calibration Engineer' 
  | 'Service Manager' 
  | 'Workshop Manager' 
  | 'Documentation' 
  | 'Technician'
  | 'Trainee'
  | 'Intern Trainee'
  | string;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tags?: EngineerTag[];
  avatarUrl?: string;
  territory?: string;
  kpis?: KpiDefinition[];
  password?: string;
  department?: string;
  avatar?: string;
  disabled?: boolean;
}

export type JobType =
  | 'Installation'
  | 'Warranty Service'
  | 'Non-Warranty Service'
  | 'Warranty Repair'
  | 'Workshop Job'
  | 'Calibration';

export type JobStatus =
  | 'Pending Assignment'
  | 'Assigned'
  | 'Traveling'
  | 'On Site'
  | 'In Progress'
  | 'Inspection Done'
  | 'Inspection Validated'
  | 'Pricing Done'
  | 'Quoted'
  | 'PO Received'
  | 'Parts Ordered'
  | 'Awaiting Parts'
  | 'Parts Received'
  | 'Ready for Repair'
  | 'Repair In Progress'
  | 'Repair Completed'
  | 'QA'
  | 'Ready For Delivery'
  | 'Delivered'
  | 'Completed'
  | 'Invoiced'
  | 'Closed'
  | 'Awaiting Replacement'
  | 'Job Received'
  | 'Inspection Assigned'
  | 'Inspected'
  | 'Quotation Raised'
  | 'Waiting for PO'
  | 'Tested'
  | 'Job Abandoned';

export interface WorkflowTimelineStep {
  status: JobStatus;
  updatedBy: string;
  updatedAt: string;
  remarks?: string;
}

export interface InstrumentAsset {
  id: string;
  assetNumber: string;
  serialNumber: string;
  brand: string;
  model: string;
  description: string;
  invoiceNumber?: string;
  invoiceValue?: number;
  warrantyPeriodMonths: number;
  installationDate?: string;
  customerName: string;
  department: string;
  endUserName?: string;
  endUserContact?: string;
  endUserLocation?: string;
  warrantyCardNumber?: string;
  nextServiceInterval?: '3 Months' | '6 Months' | '1 Year' | 'No Services';
  nextServiceDate?: string;
  lastPmDate?: string;
  nextPmDate?: string;
  amcStatus?: 'Active' | 'Inactive' | 'None';
  calibrationDue?: string;
  serviceHistoryCount: number;
  repairHistoryCount: number;
  totalRevenueGenerated: number;
}

// Sub-Details per Workflow
export interface InstallationWorkflowData {
  invoiceNumber: string;
  invoiceValue: number;
  model: string;
  itemDescription: string;
  brand: string;
  customerName: string;
  warrantyPeriodYears: number;
  warrantyPeriodMonths: number;
  
  // End user updates (compulsory at assignment/execution)
  endUserName?: string;
  endUserContact?: string;
  endUserLocation?: string;
  remarks?: string;
  
  dueDate: string; // 15 days after creation
  installationDate?: string;
  warrantyCardNumber?: string;
  jobSheetNumber?: string;
  nextServiceInterval?: '6 Months' | '1 Year' | 'No Services';
}

export interface WarrantyServiceWorkflowData {
  dueDate: string;
  serviceReportNumber?: string;
  serviceDate?: string;
  isOverdue: boolean;
  alertActive: boolean; // Pre-alert 1 month before to 1 month after due date
}

export interface NonWarrantyWorkflowData {
  departmentSection: string;
  issueDescription: string;
  inspectionReport?: string;
  inspectionDone: boolean;
  inspectionValidated: boolean;
  
  // Pricing & Quotation
  pricingServiceRepair?: number;
  pricingCalibration?: number;
  pricingDone?: boolean;
  quotationPrice?: number; // total service & repair price
  calibrationServicePrice?: number; // separate calibration
  
  // PO & Approval
  poReceived?: boolean;
  poNumber?: string;
  memoNumber?: string; // Get memo number from head office
  
  // Parts and Execution
  partsStatus: 'Local Available' | 'Parts Ordered' | 'Parts Received' | 'N/A';
  partsOrderedDate?: string;
  partsReceivedDate?: string;
  repairCompletedDate?: string;
  
  // Invoicing
  invoiceRaised: boolean;
  invoiceNumber?: string;
  invoiceAmountService?: number;
  invoiceAmountCalibration?: number;
}

export interface WarrantyRepairWorkflowData {
  departmentSection: string;
  issueDescription: string;
  inspectionReport?: string;
  inspectionDone: boolean;
  inspectionValidated: boolean;
  
  // Multi-job delegation
  isChildJob?: boolean;
  parentJobId?: string;
  subJobIds?: string[];
  
  // Parts & Execution
  partsStatus: 'Local Available' | 'Parts Ordered' | 'Parts Received' | 'N/A';
  partsOrderedDate?: string;
  partsReceivedDate?: string;
  repairCompletedDate?: string;
}

export interface WorkshopJobWorkflowData {
  // Acceptance Report details
  acceptanceDate: string;
  itemSerialNumber: string;
  institute: string;
  departmentSection: string;
  contactName: string;
  contactNumber: string;
  warrantyStatus: 'Warranty' | 'Non-Warranty';
  partsReceivedWithItem: string;
  takenByDeliveryPerson: string;
  remarks?: string;
  
  // External Movement Tracking
  takenOutsideWorkshop: boolean;
  outsideDetails?: string;
  outsideReturnDate?: string;
  
  // Delivery details
  deliveryPersonName?: string;
  deliveryDate?: string;
  deliveryReportNumber?: string;

  // New Workshop specific tracking
  partsToImportRequired?: boolean;
  partsToImportDetails?: string;
  repairSteps?: string[];
  repairAssignedEngineerId?: string;
  repairAssignedEngineerName?: string;
  testResult?: string;
  testHours?: number;
  abandonedReason?: string;
  pricingServiceRepair?: number;
  pricingCalibration?: number;
  poNumber?: string;
}

export interface CalibrationWorkflowData {
  requestDate: string;
  certificateNumber?: string;
  calibrationDate?: string;
  invoiceNumber?: string;
  invoiceAmount?: number;
}

export interface CustomerSatisfactionData {
  rating: number; // 1-5 Likert Scale
  nps: number; // 1-10 NPS Scale
  comments?: string;
  submittedAt: string;
  qrCodeTriggered: boolean;
}

export interface PartsReceivingData {
  poNumber: string;
  supplier: string;
  partNumber: string;
  partDescription: string;
  quantityOrdered: number;
  quantityReceived: number;
  deliveryDate: string;
  supplierInvoiceNumber: string;
  courier: string;
  trackingNumber: string;
  receiver: string;
  remarks: string;
  condition: 'Good' | 'Damaged' | 'Partial Delivery';
}

export interface JobRecord {
  id: string;
  jobType: JobType;
  status: JobStatus;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  customerName: string;
  brand: string;
  model: string;
  serialNumber: string;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  createdById: string;
  createdByRole: UserRole;
  createdAt: string;
  updatedAt: string;
  
  timeline: WorkflowTimelineStep[];
  feedback?: CustomerSatisfactionData;
  partsReceiving?: PartsReceivingData;
  
  // Embedded Workflow states
  installationData?: InstallationWorkflowData;
  warrantyServiceData?: WarrantyServiceWorkflowData;
  nonWarrantyData?: NonWarrantyWorkflowData;
  warrantyRepairData?: WarrantyRepairWorkflowData;
  workshopJobData?: WorkshopJobWorkflowData;
  calibrationData?: CalibrationWorkflowData;
}

export interface KpiDefinition {
  id: string;
  name: string;
  roleType: 'Engineer' | 'Technician' | 'Coordinating Officer' | 'Workshop Engineer' | 'Calibration Engineer';
  description: string;
  weight: number; // Percentage
  targetValue: string;
  currentValue: string;
  score: number; // Out of 100
  errorsCount?: number; // For penalty calculations
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  previousValue?: string;
  newValue?: string;
  remarks?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AmcContract {
  id: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  pmInterval: '3 Months' | '6 Months' | '1 Year';
  status: 'Active' | 'Expired' | 'Pending';
  price: number;
  slaTier?: 'Platinum' | 'Gold' | 'Silver' | 'None';
  amcType?: 'Comprehensive' | 'Labor Only' | 'Spare Parts Included' | 'Standard';
  coveredAssetIds?: string[]; // IDs of covered InstrumentAssets
  escalationRate?: number; // renewal escalation percentage
  uptimeGuarantee?: number; // e.g., 95, 98, 99
  responseTimeHours?: number; // response time SLA e.g., 4, 12, 24
  lastRenewedDate?: string;
  notes?: string;
}

export interface CustomerContact {
  id?: string;
  name: string;
  contact: string;
  location: string;
  email?: string;
  role?: string;
  isDefault?: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  departments: string[];
  endUsers: CustomerContact[];
  installedEquipmentCount: number;
  totalRevenue: number;
  activeContracts: number;
  feedbackNpsAverage: number;
  contracts?: AmcContract[];
  province?: string;
  district?: string;
  liaisonName?: string;
  liaisonContact?: string;
}

export interface SupplierContact {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone: string;
  isDefault?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  categories: string[];
  status: 'Active' | 'Under Review' | 'Inactive' | 'Blocked';
  address: string;
  country: string;
  website?: string;
  rating?: number;
  contacts: SupplierContact[];
}

// ==========================================
// MIGRATED SPRINT TYPES FOR SYSTEM HEALTH
// ==========================================

export interface Customer {
  id: string;
  name: string;
  labType?: string;
  email: string;
  phone: string;
  address: string;
  contactPerson?: string;
  created_at?: string;
  province?: string;
  territory?: string;
  city?: string;
  district?: string;
  active?: boolean;
  customerType?: string;
  customerCode?: string;
  liaisonName?: string;
  liaisonContact?: string;
}

export interface Instrument {
  id: string;
  serialNumber: string;
  name: string;
  model: string;
  brand: string;
  department: string;
  customerId: string;
  customerName: string;
  installationDate?: string;
  installationStatus?: string;
  warrantyStart?: string;
  warrantyExpiry?: string;
  amcType?: string;
  status?: string;
  assignedTerritory?: string;
  calibrationRequired?: boolean;
  serviceContract?: string;
  invoiceValue?: number;
  invoiceNumber?: string;
  endUser?: string;
  assignedEngineerName?: string;
  assignedEngineerId?: string;
  warrantyPeriod?: number;
  serviceInterval?: string | number;
  description?: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
    size: string;
    url?: string;
  }>;
  calibrationDue?: string;
}

export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  type: string;
  instrumentId: string;
  instrumentName: string;
  serialNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  status: string;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  createdAt: string;
  resolvedAt?: string;
  downTimeHours?: number;
  workshopBench?: string;
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
  standardEquipment: string;
  temperature: number;
  humidity: number;
  reportedError: number;
  allowableError: number;
  status: 'PASSED' | 'FAILED' | string;
  calibratedBy: string;
  approvedBy: string;
}

export interface CSATRecord {
  id: string;
  ticketId: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  serviceRating: number;
  supportRating: number;
  npsScore: number;
  feedbackText: string;
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  severity: 'ALERT' | 'WARNING' | 'INFO' | string;
  timestamp: string;
  read: boolean;
}

export interface ServiceKpis {
  mttrHours: number;
  mtbfDays: number;
  slaCompliance: number;
  engineerUtilization: number;
  firstTimeFixRate: number;
}

export type InstallationStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Overdue' | string;

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
  createdAt: string;
  slaDeadline: string;
  createdById: string;
  createdByName: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedAt?: string;
  assignedById?: string;
  assignedByName?: string;
  completedAt?: string;
  completedById?: string;
  completedByName?: string;
  reportNotes?: string;
  checklist: {
    unboxed: boolean;
    electricalSafetyChecked: boolean;
    calibrationVerified: boolean;
    userTrained: boolean;
  };
  warrantyCardUpdated: boolean;
  warrantyCardUpdatedBy?: string;
  warrantyCardUpdatedById?: string;
  warrantyCardUpdatedAt?: string;
  warrantyStart?: string;
  warrantyExpiry?: string;
  brand?: string;
  model?: string;
  warrantyCardNumber?: string;
  warrantyPeriodMonths?: number;
  warrantyPeriodYears?: number;
}

export interface TerritoryEngineer {
  id: string;
  territory_id: string;
  engineer_id: string;
  engineer_name: string;
  assignment_type: string;
  active: boolean;
  assigned_at: string;
}

export interface Territory {
  id: string;
  territory_code: string;
  territory_name: string;
  name: string;
  province: string;
  district: string;
  districtsCovered: string[];
  description: string;
  active: boolean;
  isActive: boolean;
  created_at: string;
  assignedEngineerId: string;
  assignedEngineerName: string;
  backupEngineerId: string;
  backupEngineerName: string;
  slaCompliance: number;
  activeTicketsCount: number;
  totalServiceValue: number;
  engineers: TerritoryEngineer[];
}

export type ChecklistItemStatus = 'PASS' | 'FAIL' | 'N/A' | 'NOT APPLICABLE' | string;

export interface InstallationReportChecklistItem {
  id: string;
  label: string;
  status: ChecklistItemStatus;
  remarks?: string;
}

export interface InstallationReportData {
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
  checklist: InstallationReportChecklistItem[];
  engineerNotes: {
    workPerformed: string;
    problemsFound: string;
    correctiveActions: string;
    recommendations: string;
    remarks: string;
  };
  assignedEngineer?: string;
  assignedTechnicians?: string[];
  attachments?: any[];
}

export type InstallationRequestStatus =
  | 'Pending Request'
  | 'Pending Assignment'
  | 'Assigned'
  | 'Scheduled'
  | 'Travelling'
  | 'On Site'
  | 'Installation Completed'
  | 'Report Pending'
  | 'Documentation Review'
  | 'Closed'
  | 'Installed';

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
  deliveryDate: string;
  warrantyPeriod: number;
  warrantyUnit: 'Months' | 'Years' | 'Days';
  remarks: string | null;
  status: InstallationRequestStatus;
  createdAt: string;
  updatedAt: string;
}

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
  createdAt?: string;
  updatedAt?: string;
}

export interface InstallationAssignmentAuditLog {
  id: string;
  requestId: string;
  assignmentId?: string;
  action: string;
  fromStatus?: string;
  toStatus: string;
  performedBy: string;
  performedByRole: string;
  notes?: string;
  timestamp: string;
}

export type ServiceIntervalOption = '6 Months' | '1 Year' | 'No PM' | string;

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
  status: 'Scheduled' | 'Completed' | 'Pending' | string;
  assignedAreaEngineer: string;
  createdAt: string;
}

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
  status: 'Active' | 'Expired' | string;
  activatedBy: string;
  activatedAt: string;
}

export interface WarrantyNotification {
  id: string;
  recipientRole: string;
  recipientName: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'info' | 'success' | 'warning' | 'error' | string;
}

export interface WarrantyAuditLog {
  id: string;
  referenceNumber: string;
  action: string;
  performedBy: string;
  performedByRole: string;
  timestamp: string;
  details: string;
}

export interface WarrantyActivationExecutionPayload {
  installationNumber: string;
  warrantyCardNumber: string;
  jobSheetNumber: string;
  customerName: string;
  department: string;
  instrumentName: string;
  serialNumber: string;
  assetNumber: string;
  warrantyStartDate: string;
  warrantyPeriodMonths: number;
  serviceInterval: ServiceIntervalOption;
  assignedAreaEngineer: string;
  approverName: string;
  approverRole: string;
  brand?: string;
  model?: string;
}

export interface WarrantyActivationEngineResult {
  updatedInstrumentStatus: 'Installed' | string;
  warrantyRecord: WarrantyRecord;
  pmSchedules: PreventiveMaintenanceSchedule[];
  notifications: WarrantyNotification[];
  auditLogs: WarrantyAuditLog[];
}

export type WarrantyServiceStatus = 'Scheduled' | 'Dispatched' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled' | string;
export type WarrantyServicePriority = 'Critical' | 'High' | 'Medium' | 'Low' | string;

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
  scheduledDate: string;
  scheduledTime: string;
  status: WarrantyServiceStatus;
  priority: WarrantyServicePriority;
  assignedAreaEngineer: string;
  serviceType: 'Preventative Maintenance' | 'Warranty Inspection' | 'Mandatory Calibration' | string;
  estimatedDurationHours: number;
  notes: string;
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

export interface DocumentationReviewData {
  installationNumber: string;
  installationDate: string;
  jobSheetNumber: string;
  warrantyCardNumber: string;
  warrantyStartDate: string;
  serviceInterval: '6 Months' | '1 Year' | 'No PM' | string;
  remarks: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Returned to Engineer' | string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface DocumentationReviewAuditLog {
  id: string;
  installationNumber: string;
  action: 'Update Details' | 'Approve' | 'Reject' | 'Return to Engineer' | string;
  performedBy: string;
  performedByRole: string;
  timestamp: string;
  remarks: string;
}

// ==========================================
// INVENTORY, STOCK & MOVEMENT MODULE TYPES
// ==========================================

export type InventoryCategory = 'Consumables' | 'Electronics' | 'Mechanical' | 'Optical' | 'Calibrator' | 'Reagent' | 'Tools' | string;

export interface InventoryItem {
  id: string;
  partCode: string; // Unique, e.g., AV-PRT-2026-001
  partName: string;
  category: InventoryCategory;
  brand: string;
  description: string;
  compatibleModels: string[]; // compatible instrument models
  supplierId?: string; // Linked to supplier
  supplierName?: string;
  unitPrice: number; // LKR value
  reorderLevel: number; // min threshold before alerting
  warehouseLocation: string; // e.g. "Aisle 3, Shelf B, Bin 12"
  onHandQty: number; // Active stock
  allocatedQty: number; // Stock reserved for active jobs
  availableQty: number; // onHandQty - allocatedQty
  inTransitQty: number; // Ordered from supplier, pending receipt
}

export type StockMovementType = 'ADJUSTMENT' | 'PURCHASE' | 'ALLOCATION' | 'CONSUMPTION' | 'RETURN';

export interface StockMovement {
  id: string;
  itemId: string;
  partCode: string;
  partName: string;
  type: StockMovementType;
  quantity: number; // Quantity changed
  direction: 'IN' | 'OUT'; // IN increases stock, OUT decreases stock
  referenceDoc: string; // e.g. "INS-2026-0001", "PO-2026-0819", "INV-2026-3021"
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  remarks: string;
}

// ==========================================
// PURCHASING & WORKFLOW MODULE TYPES
// ==========================================

export type PurchaseOrderStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Ordered' | 'Partially Received' | 'Received' | 'Cancelled';

export interface PurchaseOrderItem {
  id: string;
  itemId: string; // Linked InventoryItem ID
  partCode: string;
  partName: string;
  quantity: number;
  receivedQty?: number; // Accumulated quantity received so far
  unitPrice: number; // LKR
  totalPrice: number; // quantity * unitPrice
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // PO-YYYY-XXXXX
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  items: PurchaseOrderItem[];
  status: PurchaseOrderStatus;
  subTotal: number;
  taxAmount: number;
  shippingCost: number;
  totalCost: number;
  createdById: string;
  createdByName: string;
  createdByRole: string;
  createdAt: string;
  updatedAt: string;
  approvalRemarks?: string;
  approvedById?: string;
  approvedByName?: string;
  approvedAt?: string;
  remarks?: string;
  shippingTerms?: string; // e.g. "CIF Colombo", "FOB", etc.
  expectedDeliveryDate?: string;
}

// ==========================================
// GOODS RECEIVING & GRN MODULE TYPES
// ==========================================

export interface GrnItem {
  id: string;
  itemId: string; // Linked InventoryItem ID
  partCode: string;
  partName: string;
  orderedQty: number;
  receivedQty: number; // Received in this note
  acceptedQty: number; // Cleared inspection
  rejectedQty: number; // Damaged or failed QA
  remarks?: string;
}

export type GrnStatus = 'Draft' | 'Submitted' | 'Verified' | 'Cancelled';

export interface Grn {
  id: string;
  grnNumber: string; // GRN-YYYY-XXXXX
  poId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  deliveryNoteNumber?: string;
  invoiceNumber?: string;
  receivedById: string;
  receivedByName: string;
  receivedByRole: string;
  receivedAt: string;
  items: GrnItem[];
  remarks?: string;
  status: GrnStatus;
  inspectionPassed: boolean;
}




