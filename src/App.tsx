import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  JobRecord, 
  KpiDefinition, 
  AuditLogRecord, 
  CustomerProfile, 
  InstrumentAsset,
  Supplier,
  InventoryItem,
  StockMovement,
  PurchaseOrder,
  Grn,
  Instrument,
  InstallationRequest,
  InstallationAssignment,
  InstallationAssignmentAuditLog,
  Installation,
  InstallationRequestStatus,
  InstallationStatus,
  CalibrationRecord
} from './types';
import { 
  initializeStorage, 
  getStoredData, 
  logAudit, 
  resetStorage,
  MOCK_USERS,
  INITIAL_PURCHASE_ORDERS
} from './data/mockData';
import { INITIAL_INSTRUMENTS, INITIAL_CALIBRATIONS } from './data/initialState';
import { INITIAL_INSTALLATION_REQUESTS } from './data/sprint51InstallationRequestDbLayer';
import { INITIAL_INSTALLATION_ASSIGNMENTS, INITIAL_ASSIGNMENT_AUDIT_LOGS } from './data/sprint52InstallationAssignmentDbLayer';
import { INITIAL_INSTALLATIONS } from './data/initialState';

// Component Imports
import Dashboard from './components/Dashboard';
import JobsRegistry from './components/JobsRegistry';
import JobWorkflowModal from './components/JobWorkflowModal';
import InstrumentRegistry from './components/Modules/InstrumentRegistry';
import CalibrationManagement from './components/Modules/CalibrationManagement';
import CustomerDirectory from './components/CustomerDirectory';
import SupplierDirectory from './components/SupplierDirectory';
import InventoryManagement from './components/Modules/InventoryManagement';
import PurchasingManagement from './components/Modules/PurchasingManagement';
import KpiEngine from './components/KpiEngine';
import FeedbackSimulator from './components/FeedbackSimulator';
import AuditLogViewer from './components/AuditLogViewer';
import PmScheduler from './components/PmScheduler';
import OrgManager from './components/OrgManager';
import ConfigManager from './components/ConfigManager';
import LoginPanel from './components/LoginPanel';
import InstallationRequestMaster from './components/Modules/InstallationRequestMaster';
import InstallationAssignmentWorkflow from './components/Modules/InstallationAssignmentWorkflow';
import InstallationManagement from './components/Modules/InstallationManagement';
import WorkshopModule from './components/Modules/WorkshopModule';
import AmcManagement from './components/Modules/AmcManagement';
import ReportingModule from './components/Modules/ReportingModule';
import NotificationQueueModule from './components/Modules/NotificationQueueModule';
import DocumentStorageModule from './components/Modules/DocumentStorageModule';
import UserManagement from './components/Modules/UserManagement';

// Icons
import { 
  Compass, 
  Wrench, 
  Layers, 
  Building2, 
  Award, 
  Smile, 
  History, 
  Bell, 
  Zap,
  Menu,
  ChevronDown,
  X,
  AlertTriangle,
  Calendar,
  Settings,
  LogOut,
  Truck,
  Package,
  ClipboardList,
  UserCheck,
  ShieldCheck,
  Medal,
  FileText,
  BarChart3,
  FolderOpen,
  Users
} from 'lucide-react';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  
  // App States backed by LocalStorage
  const [activeUser, setActiveUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('avon_active_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_USERS[0];
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const rememberMe = localStorage.getItem('avon_remember_me') === 'true';
    const savedActive = localStorage.getItem('avon_active_user');
    return rememberMe && !!savedActive;
  });
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [kpis, setKpis] = useState<KpiDefinition[]>([]);
  const [assets, setAssets] = useState<InstrumentAsset[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>(() => {
    const saved = localStorage.getItem('avon_local_instruments_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>(() => {
    const saved = localStorage.getItem('avon_local_calibrations_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [installationRequests, setInstallationRequests] = useState<InstallationRequest[]>(() => {
    const saved = localStorage.getItem('avon_installation_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [installationAssignments, setInstallationAssignments] = useState<InstallationAssignment[]>(() => {
    const saved = localStorage.getItem('avon_installation_assignments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [installationAssignmentAuditLogs, setInstallationAssignmentAuditLogs] = useState<InstallationAssignmentAuditLog[]>(() => {
    const saved = localStorage.getItem('avon_installation_assignment_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [installations, setInstallations] = useState<Installation[]>(() => {
    const saved = localStorage.getItem('avon_local_installations_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [audits, setAudits] = useState<AuditLogRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [grns, setGrns] = useState<Grn[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  // UI Control states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerNotifications, setHeaderNotifications] = useState<any[]>([]);
  const [globalNotifTrigger, setGlobalNotifTrigger] = useState(0);

  // Sync header notification items
  useEffect(() => {
    const fetchHeaderNotifs = async () => {
      try {
        const token = localStorage.getItem('avon_session_token');
        if (!isLoggedIn || !token) {
          const local = localStorage.getItem('avon_notifications');
          if (local) {
            const list = JSON.parse(local).filter((n: any) => n.userId === activeUser.id);
            setHeaderNotifications(list);
          } else {
            setHeaderNotifications([]);
          }
          return;
        }

        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`
        };

        const res = await fetch('/api/notifications', { headers }).catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          // Filter to show only activeUser's notifications
          const list = json.data.notifications.filter((n: any) => n.userId === activeUser.id);
          setHeaderNotifications(list);
        } else {
          const local = localStorage.getItem('avon_notifications');
          if (local) {
            const list = JSON.parse(local).filter((n: any) => n.userId === activeUser.id);
            setHeaderNotifications(list);
          } else {
            setHeaderNotifications([]);
          }
        }
      } catch (e) {
        // Safe fallback
      }
    };
    fetchHeaderNotifs();
  }, [activeUser.id, globalNotifTrigger, activeTab, isLoggedIn]);

  // Load and initialize data
  useEffect(() => {
    initializeStorage();
    if (!localStorage.getItem('avon_installation_requests')) {
      localStorage.setItem('avon_installation_requests', JSON.stringify([]));
    }
    if (!localStorage.getItem('avon_installation_assignments')) {
      localStorage.setItem('avon_installation_assignments', JSON.stringify([]));
    }
    if (!localStorage.getItem('avon_installation_assignment_audit_logs')) {
      localStorage.setItem('avon_installation_assignment_audit_logs', JSON.stringify([]));
    }
    if (!localStorage.getItem('avon_local_installations_v2')) {
      localStorage.setItem('avon_local_installations_v2', JSON.stringify([]));
    }
    const data = getStoredData();
    if (data.jobs) {
      setJobs(data.jobs);
      setAssets(data.assets);
      setAudits(data.audits);
      setKpis(data.kpis);
      setCustomers(data.customers);
      setSuppliers(data.suppliers || []);
      setInventory(data.inventory || []);
      setStockMovements(data.stockMovements || []);
      setPurchaseOrders(data.purchaseOrders || []);
      setGrns(data.grns || []);
      
      const loadedUsers = data.users || MOCK_USERS;
      const initializedUsers = loadedUsers.map(u => {
        if (!u.kpis || u.kpis.length === 0) {
          let roleType: 'Engineer' | 'Technician' | 'Coordinating Officer' | 'Workshop Engineer' | 'Calibration Engineer' = 'Engineer';
          const lowercaseRole = u.role.toLowerCase();
          if (lowercaseRole.includes('manager') || lowercaseRole.includes('workshop')) {
            roleType = 'Workshop Engineer';
          } else if (lowercaseRole.includes('calibration')) {
            roleType = 'Calibration Engineer';
          } else if (lowercaseRole.includes('engineer') || lowercaseRole.includes('biomedical')) {
            roleType = 'Engineer';
          } else if (lowercaseRole.includes('technician') || lowercaseRole.includes('intern')) {
            roleType = 'Technician';
          } else {
            roleType = 'Coordinating Officer';
          }
          return {
            ...u,
            kpis: (data.kpis || []).filter(k => k.roleType === roleType)
          };
        }
        return u;
      });

      setUsers(initializedUsers);
      localStorage.setItem('avon_users', JSON.stringify(initializedUsers));

      if (data.activeUser) {
        const found = initializedUsers.find(iu => iu.id === data.activeUser.id);
        setActiveUser(found || data.activeUser);
      }
      setInitialized(true);
    }
  }, []);

  // Save users state helper
  const saveUsersState = (updatedUsers: UserProfile[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('avon_users', JSON.stringify(updatedUsers));
    
    // Auto sync activeUser details if modified
    const activeUserInList = updatedUsers.find(u => u.id === activeUser.id);
    if (activeUserInList) {
      setActiveUser(activeUserInList);
      localStorage.setItem('avon_active_user', JSON.stringify(activeUserInList));
    }
  };

  const handleLoginSuccess = (user: UserProfile, rememberMe: boolean) => {
    setActiveUser(user);
    localStorage.setItem('avon_active_user', JSON.stringify(user));
    localStorage.setItem('avon_remember_me', rememberMe ? 'true' : 'false');
    setIsLoggedIn(true);

    // Log audit action
    const loginAudit: AuditLogRecord = {
      id: `aud_login_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'LOGIN',
      newValue: 'Successful session established',
      remarks: `User ${user.name} logged in successfully with ${rememberMe ? 'remember-me flag' : 'one-time session'}.`
    };
    
    const currentAudits = JSON.parse(localStorage.getItem('avon_audits') || '[]');
    const updatedAudits = [loginAudit, ...currentAudits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));
  };

  const handleLogout = () => {
    localStorage.removeItem('avon_active_user');
    localStorage.removeItem('avon_remember_me');
    setIsLoggedIn(false);

    // Log audit action
    const logoutAudit: AuditLogRecord = {
      id: `aud_logout_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'LOGOUT',
      newValue: 'Session terminated',
      remarks: `User ${activeUser.name} signed out from workspace.`
    };
    
    const currentAudits = JSON.parse(localStorage.getItem('avon_audits') || '[]');
    const updatedAudits = [logoutAudit, ...currentAudits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));
  };

  // Save states helper
  const saveStateToStorage = (
    updatedJobs?: JobRecord[],
    updatedAssets?: InstrumentAsset[],
    updatedKpis?: KpiDefinition[],
    updatedCustomers?: CustomerProfile[],
    updatedSuppliers?: Supplier[],
    updatedInventory?: InventoryItem[],
    updatedStockMovements?: StockMovement[],
    updatedPurchaseOrders?: PurchaseOrder[],
    updatedGrns?: Grn[]
  ) => {
    if (updatedJobs) {
      setJobs(updatedJobs);
      localStorage.setItem('avon_jobs', JSON.stringify(updatedJobs));
    }
    if (updatedAssets) {
      setAssets(updatedAssets);
      localStorage.setItem('avon_assets', JSON.stringify(updatedAssets));
    }
    if (updatedKpis) {
      setKpis(updatedKpis);
      localStorage.setItem('avon_kpis', JSON.stringify(updatedKpis));
    }
    if (updatedCustomers) {
      setCustomers(updatedCustomers);
      localStorage.setItem('avon_customers', JSON.stringify(updatedCustomers));
    }
    if (updatedSuppliers) {
      setSuppliers(updatedSuppliers);
      localStorage.setItem('avon_suppliers', JSON.stringify(updatedSuppliers));
    }
    if (updatedInventory) {
      setInventory(updatedInventory);
      localStorage.setItem('avon_inventory', JSON.stringify(updatedInventory));
    }
    if (updatedStockMovements) {
      setStockMovements(updatedStockMovements);
      localStorage.setItem('avon_stock_movements', JSON.stringify(updatedStockMovements));
    }
    if (updatedPurchaseOrders) {
      setPurchaseOrders(updatedPurchaseOrders);
      localStorage.setItem('avon_purchase_orders', JSON.stringify(updatedPurchaseOrders));
    }
    if (updatedGrns) {
      setGrns(updatedGrns);
      localStorage.setItem('avon_grns', JSON.stringify(updatedGrns));
    }
  };

  // Change impersonation user
  const handleSwapUser = (newUser: UserProfile) => {
    setActiveUser(newUser);
    localStorage.setItem('avon_active_user', JSON.stringify(newUser));
    
    // Log audit action
    const currentAudits = JSON.parse(localStorage.getItem('avon_audits') || '[]');
    const newLog: AuditLogRecord = {
      id: `aud_swap_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: newUser.id,
      userName: newUser.name,
      userRole: newUser.role,
      action: 'USER_LOGIN',
      remarks: `Swapped role profile to ${newUser.role}. Gained personalized workspace access.`
    };
    const updatedAudits = [newLog, ...currentAudits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));
  };

  // Log general audit action
  const handleLogAudit = (action: string, previousValue?: string, newValue?: string, remarks?: string) => {
    const newLog: AuditLogRecord = {
      id: `aud_cfg_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: action as any,
      previousValue,
      newValue,
      remarks: remarks || `Modified system configuration.`
    };
    const updatedAudits = [newLog, ...audits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));
  };

  // Create a new job request
  const handleAddJob = (newJob: JobRecord) => {
    const updatedJobs = [newJob, ...jobs];
    
    // Generate audit trail entry
    const newLog: AuditLogRecord = {
      id: `aud_job_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'CREATE_JOB',
      newValue: newJob.id,
      remarks: `Created new ${newJob.jobType} ticket for customer ${newJob.customerName}. Priority: ${newJob.priority}.`
    };
    const updatedAudits = [newLog, ...audits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));

    saveStateToStorage(updatedJobs);
  };

  // Update workflow stages & details
  const handleUpdateJob = (updatedJob: JobRecord) => {
    const updatedJobs = jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
    
    // Check if the update is a Completion/Close event and increase revenue or service counter
    let updatedAssets = [...assets];
    let updatedCustomers = [...customers];

    if (updatedJob.status === 'Closed' && jobs.find(j => j.id === updatedJob.id)?.status !== 'Closed') {
      // Find asset
      const asset = updatedAssets.find(a => a.serialNumber === updatedJob.serialNumber);
      if (asset) {
        if (updatedJob.jobType === 'Installation') {
          asset.installationDate = updatedJob.installationData?.installationDate;
        }
        if (updatedJob.jobType === 'Warranty Service') {
          asset.serviceHistoryCount += 1;
        } else {
          asset.repairHistoryCount += 1;
        }

        // Add revenue from invoice (if any)
        const servicePrice = updatedJob.nonWarrantyData?.invoiceAmountService || updatedJob.calibrationData?.invoiceAmount || 0;
        const calPrice = updatedJob.nonWarrantyData?.invoiceAmountCalibration || 0;
        const total = servicePrice + calPrice;
        
        asset.totalRevenueGenerated += total;

        // Add to customer revenue too
        updatedCustomers = updatedCustomers.map(c => {
          if (c.name === updatedJob.customerName) {
            return {
              ...c,
              totalRevenue: c.totalRevenue + total
            };
          }
          return c;
        });
      }
    }

    // Generate audit trail log
    const lastTimelineStep = updatedJob.timeline[0];
    const newLog: AuditLogRecord = {
      id: `aud_upd_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'UPDATE_JOB_WORKFLOW',
      previousValue: jobs.find(j => j.id === updatedJob.id)?.status,
      newValue: updatedJob.status,
      remarks: `Updated ${updatedJob.id} to ${updatedJob.status}. Notes: ${lastTimelineStep?.remarks || ''}`
    };
    const updatedAudits = [newLog, ...audits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));

    saveStateToStorage(updatedJobs, updatedAssets, undefined, updatedCustomers);
    
    // Update active modal selected reference
    if (selectedJob && selectedJob.id === updatedJob.id) {
      setSelectedJob(updatedJob);
    }
  };

  // Register on-site feedback from Client QR Terminals
  const handleAddFeedback = (jobId: string, rating: number, nps: number, comments: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    const updatedJob: JobRecord = {
      ...targetJob,
      feedback: {
        rating,
        nps,
        comments,
        submittedAt: new Date().toISOString(),
        qrCodeTriggered: true
      }
    };

    // Recalculate customer NPS averages
    const updatedCustomers = customers.map(c => {
      if (c.name === targetJob.customerName) {
        // Average the NPS score
        const customerJobs = jobs.filter(j => j.customerName === c.name && j.feedback);
        const allNps = customerJobs.map(j => j.feedback!.nps);
        allNps.push(nps);
        const average = parseFloat((allNps.reduce((acc, val) => acc + val, 0) / allNps.length).toFixed(1));
        
        return {
          ...c,
          feedbackNpsAverage: average
        };
      }
      return c;
    });

    // Recalculate relevant engineer's KPI customer satisfaction rating
    let updatedKpis = [...kpis];
    if (targetJob.assignedEngineerId) {
      updatedKpis = kpis.map(k => {
        if (k.roleType === 'Engineer' && k.name.includes('Customer Satisfaction')) {
          // Boost or decrease rating based on feedback
          const ratingPercentage = Math.round((nps / 10) * 100);
          return {
            ...k,
            score: ratingPercentage,
            currentValue: `${ratingPercentage}% Satisfaction Rating`
          };
        }
        return k;
      });
    }

    // Generate Audit Trail entry
    const newLog: AuditLogRecord = {
      id: `aud_feed_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'CLIENT_SCAN',
      userName: 'Hospital Representative',
      userRole: 'Technician', // general placeholder
      action: 'LOG_CUSTOMER_FEEDBACK',
      newValue: jobId,
      remarks: `Client uploaded Likert rating: ${rating}/5, NPS recommendation: ${nps}/10. Comments: ${comments}`
    };
    const updatedAudits = [newLog, ...audits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));

    const updatedJobs = jobs.map(j => j.id === jobId ? updatedJob : j);
    saveStateToStorage(updatedJobs, undefined, updatedKpis, updatedCustomers);
  };

  // Manual Asset additions
  const handleAddAsset = (newAsset: InstrumentAsset) => {
    const updatedAssets = [newAsset, ...assets];
    
    const newLog: AuditLogRecord = {
      id: `aud_ast_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'ADD_ASSET',
      newValue: newAsset.id,
      remarks: `Registered new medical instrument asset to inventory registry. Serial: ${newAsset.serialNumber}`
    };
    const updatedAudits = [newLog, ...audits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));

    saveStateToStorage(undefined, updatedAssets);
  };

  // Installation Requests Handlers
  const handleAddInstallationRequest = (req: InstallationRequest) => {
    const updated = [req, ...installationRequests];
    setInstallationRequests(updated);
    localStorage.setItem('avon_installation_requests', JSON.stringify(updated));
    
    const newLog: AuditLogRecord = {
      id: `aud_ireq_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'ADD_INSTALLATION_REQUEST',
      newValue: req.id,
      remarks: `Created new installation request for invoice ${req.invoiceNumber}, Serial: ${req.serialNumber}`
    };
    const updatedAudits = [newLog, ...audits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));
  };

  const handleUpdateInstallationRequest = (req: InstallationRequest) => {
    const updated = installationRequests.map(r => r.id === req.id ? req : r);
    setInstallationRequests(updated);
    localStorage.setItem('avon_installation_requests', JSON.stringify(updated));
    
    const newLog: AuditLogRecord = {
      id: `aud_ireq_upd_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'UPDATE_INSTALLATION_REQUEST',
      newValue: req.id,
      remarks: `Updated installation request status to ${req.status} for Serial: ${req.serialNumber}`
    };
    const updatedAudits = [newLog, ...audits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));
  };

  const handleDeleteInstallationRequest = (id: string) => {
    const updated = installationRequests.filter(r => r.id !== id);
    setInstallationRequests(updated);
    localStorage.setItem('avon_installation_requests', JSON.stringify(updated));
    
    const newLog: AuditLogRecord = {
      id: `aud_ireq_del_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'DELETE_INSTALLATION_REQUEST',
      newValue: id,
      remarks: `Deleted installation request ID: ${id}`
    };
    const updatedAudits = [newLog, ...audits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));
  };

  // Installation Assignment & Workflow Handlers
  const handleAssignInstallation = (
    assignment: InstallationAssignment,
    updatedReq: InstallationRequest,
    log: InstallationAssignmentAuditLog
  ) => {
    // 1. Update assignments
    const existingAsgnIdx = installationAssignments.findIndex(a => a.id === assignment.id || a.requestId === assignment.requestId);
    let updatedAssignments = [...installationAssignments];
    if (existingAsgnIdx !== -1) {
      updatedAssignments[existingAsgnIdx] = assignment;
    } else {
      updatedAssignments = [assignment, ...updatedAssignments];
    }
    setInstallationAssignments(updatedAssignments);
    localStorage.setItem('avon_installation_assignments', JSON.stringify(updatedAssignments));

    // 2. Update requests
    const updatedRequests = installationRequests.map(r => r.id === updatedReq.id ? updatedReq : r);
    setInstallationRequests(updatedRequests);
    localStorage.setItem('avon_installation_requests', JSON.stringify(updatedRequests));

    // 3. Update audit logs
    const updatedLogs = [log, ...installationAssignmentAuditLogs];
    setInstallationAssignmentAuditLogs(updatedLogs);
    localStorage.setItem('avon_installation_assignment_audit_logs', JSON.stringify(updatedLogs));

    // 4. Create an Installation Job in jobs if it doesn't already exist!
    const existingJob = jobs.find(j => j.installationData?.invoiceNumber === updatedReq.invoiceNumber || j.serialNumber === updatedReq.serialNumber);
    if (!existingJob) {
      const newJob: JobRecord = {
        id: `job_inst_${Date.now().toString().slice(-6)}`,
        jobType: 'Installation',
        status: 'Assigned',
        priority: assignment.priority === 'Critical' ? 'Emergency' : assignment.priority === 'Urgent' ? 'Urgent' : 'Routine',
        customerName: updatedReq.customerName,
        serialNumber: updatedReq.serialNumber,
        brand: updatedReq.brand,
        model: updatedReq.model,
        assignedEngineerName: assignment.assignedEngineer,
        createdById: activeUser.id,
        createdByRole: activeUser.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          {
            status: 'Assigned',
            updatedAt: new Date().toISOString(),
            updatedBy: activeUser.name,
            remarks: `Automatically created from Installation Request & Assignment. Lead: ${assignment.assignedEngineer}`
          }
        ],
        installationData: {
          invoiceNumber: updatedReq.invoiceNumber,
          invoiceValue: updatedReq.invoiceValue,
          model: updatedReq.model,
          itemDescription: updatedReq.instrumentName,
          brand: updatedReq.brand,
          customerName: updatedReq.customerName,
          warrantyPeriodYears: updatedReq.warrantyUnit === 'Years' ? updatedReq.warrantyPeriod : 0,
          warrantyPeriodMonths: updatedReq.warrantyUnit === 'Months' ? updatedReq.warrantyPeriod : updatedReq.warrantyUnit === 'Years' ? updatedReq.warrantyPeriod * 12 : 12,
          workflowStatus: 'Assigned',
          assignedEngineer: assignment.assignedEngineer,
          assignedTechnicians: assignment.assignedTechnicians,
          targetInstallationDate: assignment.targetInstallationDate,
          priority: assignment.priority,
          slaDueDate: assignment.slaDueDate,
          installationTerritory: assignment.installationTerritory
        } as any
      };
      const nextJobs = [newJob, ...jobs];
      setJobs(nextJobs);
      localStorage.setItem('avon_jobs', JSON.stringify(nextJobs));
    } else {
      const nextJobs = jobs.map(j => {
        if (j.id === existingJob.id) {
          return {
            ...j,
            engineerName: assignment.assignedEngineer,
            priority: assignment.priority === 'Critical' ? 'Emergency' : assignment.priority === 'Urgent' ? 'Urgent' : 'Routine',
            installationData: {
              ...j.installationData,
              assignedEngineer: assignment.assignedEngineer,
              assignedTechnicians: assignment.assignedTechnicians,
              targetInstallationDate: assignment.targetInstallationDate,
              priority: assignment.priority,
              slaDueDate: assignment.slaDueDate,
              installationTerritory: assignment.installationTerritory
            } as any
          };
        }
        return j;
      });
      setJobs(nextJobs);
      localStorage.setItem('avon_jobs', JSON.stringify(nextJobs));
    }

    // 5. Create or Update active entry in installations state
    const existingInst = installations.find(i => i.serialNumber === updatedReq.serialNumber);
    if (!existingInst) {
      const newInst: Installation = {
        id: `inst-fit-${Date.now().toString().slice(-4)}`,
        installationNumber: `INS-2026-${Date.now().toString().slice(-3)}`,
        instrumentId: `inst-${Date.now().toString().slice(-3)}`,
        instrumentName: updatedReq.instrumentName,
        serialNumber: updatedReq.serialNumber,
        customerId: `cust-${Date.now().toString().slice(-3)}`,
        customerName: updatedReq.customerName,
        location: updatedReq.departmentName,
        status: 'Assigned',
        createdAt: new Date().toISOString(),
        slaDeadline: assignment.slaDueDate,
        createdById: activeUser.id,
        createdByName: activeUser.name,
        assignedStaffId: 'usr-sbe-1',
        assignedStaffName: assignment.assignedEngineer,
        assignedAt: new Date().toISOString(),
        assignedById: activeUser.id,
        assignedByName: activeUser.name,
        checklist: {
          unboxed: false,
          electricalSafetyChecked: false,
          calibrationVerified: false,
          userTrained: false
        },
        warrantyCardUpdated: false
      };
      const nextInstalls = [newInst, ...installations];
      setInstallations(nextInstalls);
      localStorage.setItem('avon_local_installations_v2', JSON.stringify(nextInstalls));
    } else {
      const nextInstalls = installations.map(i => {
        if (i.id === existingInst.id) {
          return {
            ...i,
            status: 'Assigned' as InstallationStatus,
            assignedStaffName: assignment.assignedEngineer,
            assignedAt: new Date().toISOString(),
            assignedByName: activeUser.name
          };
        }
        return i;
      });
      setInstallations(nextInstalls);
      localStorage.setItem('avon_local_installations_v2', JSON.stringify(nextInstalls));
    }

    const newLog: AuditLogRecord = {
      id: `aud_asg_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'ASSIGN_INSTALLATION',
      newValue: assignment.id,
      remarks: `Assigned Engineer ${assignment.assignedEngineer} to Installation Request ${updatedReq.invoiceNumber}`
    };
    const updatedAudits = [newLog, ...audits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));
  };

  const handleAdvanceInstallationStatus = (
    requestId: string,
    newStatus: InstallationRequestStatus,
    log: InstallationAssignmentAuditLog
  ) => {
    // 1. Update requests
    const updatedRequests = installationRequests.map(r => {
      if (r.id === requestId) {
        return { ...r, status: newStatus };
      }
      return r;
    });
    setInstallationRequests(updatedRequests);
    localStorage.setItem('avon_installation_requests', JSON.stringify(updatedRequests));

    // 2. Update audit logs
    const updatedLogs = [log, ...installationAssignmentAuditLogs];
    setInstallationAssignmentAuditLogs(updatedLogs);
    localStorage.setItem('avon_installation_assignment_audit_logs', JSON.stringify(updatedLogs));

    // 3. Update job status if matching
    const req = installationRequests.find(r => r.id === requestId);
    if (req) {
      const matchJob = jobs.find(j => j.installationData?.invoiceNumber === req.invoiceNumber || j.serialNumber === req.serialNumber);
      if (matchJob) {
        const nextJobs = jobs.map(j => {
          if (j.id === matchJob.id) {
            const nextWorkflowStatus = newStatus === 'Scheduled' ? 'Scheduled' : newStatus === 'Installed' ? 'Completed' : 'Assigned';
            const nextJobStatus = nextWorkflowStatus === 'Completed' ? 'Completed' : 'On Site';
            return {
              ...j,
              status: nextJobStatus as any,
              timeline: [
                {
                  status: nextWorkflowStatus as any,
                  updatedAt: new Date().toISOString(),
                  updatedBy: activeUser.name,
                  remarks: log.notes || `Advanced to ${newStatus}`
                },
                ...j.timeline
              ]
            };
          }
          return j;
        });
        setJobs(nextJobs);
        localStorage.setItem('avon_jobs', JSON.stringify(nextJobs));
      }

      // 4. Update installations status
      const matchInst = installations.find(i => i.serialNumber === req.serialNumber);
      if (matchInst) {
        const nextInstalls = installations.map(i => {
          if (i.id === matchInst.id) {
            let s: InstallationStatus = 'Pending';
            if (newStatus === 'Assigned') s = 'Assigned';
            else if (newStatus === 'Scheduled') s = 'In Progress';
            else if (newStatus === 'Installed') s = 'In Progress';
            else if (newStatus === 'Closed') s = 'Completed';
            return {
              ...i,
              status: s
            };
          }
          return i;
        });
        setInstallations(nextInstalls);
        localStorage.setItem('avon_local_installations_v2', JSON.stringify(nextInstalls));
      }
    }

    const newLog: AuditLogRecord = {
      id: `aud_adv_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'ADVANCE_INSTALLATION_STATUS',
      newValue: newStatus,
      remarks: `Advanced installation request ${requestId} to status ${newStatus}: ${log.notes}`
    };
    const updatedAudits = [newLog, ...audits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));
  };

  // Installation Completion Handler with warranty updating
  const handleUpdateInstallation = (updated: Installation) => {
    const nextInstalls = installations.map(i => i.id === updated.id ? updated : i);
    setInstallations(nextInstalls);
    localStorage.setItem('avon_local_installations_v2', JSON.stringify(nextInstalls));

    // If completed and warranty updated, update instruments!
    if (updated.status === 'Completed' && updated.warrantyCardUpdated && updated.warrantyStart && updated.warrantyExpiry) {
      // 1. Update instrument in registry
      const instIndex = instruments.findIndex(i => i.serialNumber === updated.serialNumber);
      if (instIndex !== -1) {
        const updatedInstruments = [...instruments];
        updatedInstruments[instIndex] = {
          ...updatedInstruments[instIndex],
          warrantyStart: updated.warrantyStart,
          warrantyExpiry: updated.warrantyExpiry,
          warrantyPeriod: updatedInstruments[instIndex].warrantyPeriod || 12
        };
        setInstruments(updatedInstruments);
        localStorage.setItem('avon_local_instruments_v2', JSON.stringify(updatedInstruments));
      } else {
        const newInst: Instrument = {
          id: updated.instrumentId || `inst-${Date.now()}`,
          serialNumber: updated.serialNumber,
          name: updated.instrumentName,
          model: updated.model || 'Sysmex Model',
          brand: updated.brand || 'Sysmex',
          department: updated.location || 'Gen Lab',
          customerId: updated.customerId,
          customerName: updated.customerName,
          warrantyStart: updated.warrantyStart,
          warrantyExpiry: updated.warrantyExpiry,
          warrantyPeriod: 12
        };
        const updatedInstruments = [newInst, ...instruments];
        setInstruments(updatedInstruments);
        localStorage.setItem('avon_local_instruments_v2', JSON.stringify(updatedInstruments));
      }

      // 2. Update asset in assets list
      const assetIndex = assets.findIndex(a => a.serialNumber === updated.serialNumber);
      if (assetIndex !== -1) {
        const updatedAssets = [...assets];
        updatedAssets[assetIndex] = {
          ...updatedAssets[assetIndex],
          installationDate: updated.warrantyStart,
          warrantyPeriodMonths: 12,
          warrantyCardNumber: updated.warrantyCardNumber || `W-${Date.now().toString().slice(-6)}`
        };
        setAssets(updatedAssets);
        localStorage.setItem('avon_assets', JSON.stringify(updatedAssets));
      }

      // 3. Update the matching job inside Jobs list to Completed/Closed!
      const matchJob = jobs.find(j => j.serialNumber === updated.serialNumber);
      if (matchJob) {
        const nextJobs = jobs.map(j => {
          if (j.id === matchJob.id) {
            return {
              ...j,
              status: 'Closed' as any,
              timeline: [
                {
                  status: 'Closed' as any,
                  updatedAt: new Date().toISOString(),
                  updatedBy: activeUser.name,
                  remarks: `Finalized warranty card and completed installation. Warranty Start: ${updated.warrantyStart}, Expiry: ${updated.warrantyExpiry}`
                },
                ...j.timeline
              ]
            };
          }
          return j;
        });
        setJobs(nextJobs);
        localStorage.setItem('avon_jobs', JSON.stringify(nextJobs));
      }

      // 4. Update the matching installation request to Closed or Installed!
      const matchReq = installationRequests.find(r => r.serialNumber === updated.serialNumber);
      if (matchReq) {
        const nextRequests = installationRequests.map(r => {
          if (r.id === matchReq.id) {
            return {
              ...r,
              status: 'Closed' as InstallationRequestStatus
            };
          }
          return r;
        });
        setInstallationRequests(nextRequests);
        localStorage.setItem('avon_installation_requests', JSON.stringify(nextRequests));
      }
    }

    const newLog: AuditLogRecord = {
      id: `aud_inst_upd_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action: 'UPDATE_INSTALLATION',
      newValue: updated.id,
      remarks: `Updated installation ${updated.installationNumber} status to ${updated.status}. Checklist completed: unboxed=${updated.checklist.unboxed}, electrical=${updated.checklist.electricalSafetyChecked}, calibration=${updated.checklist.calibrationVerified}, training=${updated.checklist.userTrained}`
    };
    const updatedAudits = [newLog, ...audits];
    setAudits(updatedAudits);
    localStorage.setItem('avon_audits', JSON.stringify(updatedAudits));
  };

  // Render Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            activeUser={activeUser} 
            jobs={jobs} 
            kpis={kpis} 
            onSelectJob={(job) => setSelectedJob(job)} 
            onNavigateToTab={(tab) => setActiveTab(tab)}
            assets={assets}
          />
        );
      case 'jobs':
        return (
          <JobsRegistry 
            activeUser={activeUser} 
            jobs={jobs} 
            onSelectJob={(job) => setSelectedJob(job)}
            onAddJob={handleAddJob}
            onUpdateJob={handleUpdateJob}
            users={users}
          />
        );
      case 'workshop':
        return (
          <WorkshopModule 
            activeUser={activeUser}
            jobs={jobs}
            onAddJob={handleAddJob}
            onUpdateJob={handleUpdateJob}
            customers={customers}
            users={users}
            onLogAudit={handleLogAudit}
          />
        );
      case 'assets':
        return (
          <InstrumentRegistry 
            instruments={instruments}
            customers={customers as any}
            onAddInstrument={(newInst) => {
              const updated = [newInst, ...instruments];
              setInstruments(updated);
              localStorage.setItem('avon_local_instruments_v2', JSON.stringify(updated));
              
              // Register audit trail log
              const newAudit: AuditLogRecord = {
                id: `audit-${Date.now()}`,
                userId: activeUser?.id || 'usr-anon',
                userName: activeUser?.name || 'Anonymous User',
                userRole: activeUser?.role || 'ENGINEER',
                action: 'REGISTER_INSTRUMENT',
                remarks: `Registered instrument ${newInst.brand} ${newInst.model} S/N: ${newInst.serialNumber}`,
                timestamp: new Date().toISOString()
              };
              setAudits(prev => {
                const next = [newAudit, ...prev];
                // Persist the audits list
                const saved = localStorage.getItem('avon_state');
                if (saved) {
                  try {
                    const parsed = JSON.parse(saved);
                    parsed.audits = next;
                    localStorage.setItem('avon_state', JSON.stringify(parsed));
                  } catch (e) {}
                }
                return next;
              });
            }}
            onDecommissionInstrument={(id) => {
              const updated = instruments.filter(i => i.id !== id);
              setInstruments(updated);
              localStorage.setItem('avon_local_instruments_v2', JSON.stringify(updated));
              
              // Register audit trail log
              const newAudit: AuditLogRecord = {
                id: `audit-${Date.now()}`,
                userId: activeUser?.id || 'usr-anon',
                userName: activeUser?.name || 'Anonymous User',
                userRole: activeUser?.role || 'ENGINEER',
                action: 'DECOMMISSION_INSTRUMENT',
                remarks: `Decommissioned instrument asset ID: ${id}`,
                timestamp: new Date().toISOString()
              };
              setAudits(prev => {
                const next = [newAudit, ...prev];
                const saved = localStorage.getItem('avon_state');
                if (saved) {
                  try {
                    const parsed = JSON.parse(saved);
                    parsed.audits = next;
                    localStorage.setItem('avon_state', JSON.stringify(parsed));
                  } catch (e) {}
                }
                return next;
              });
            }}
            currentUser={activeUser || { id: 'usr-anon', name: 'Anonymous User', role: 'ENGINEER', email: '', territoryId: 'terr-1' }}
          />
        );
      case 'pm-scheduler':
        return (
          <PmScheduler
            activeUser={activeUser}
            assets={assets}
            customers={customers}
            jobs={jobs}
            inventory={inventory}
            onUpdateAsset={(updatedAsset) => {
              const updatedAssets = assets.map(a => a.id === updatedAsset.id ? updatedAsset : a);
              saveStateToStorage(undefined, updatedAssets);
            }}
            onAddJob={handleAddJob}
            onUpdateJob={handleUpdateJob}
            onUpdateInventory={(updatedInv) => {
              saveStateToStorage(undefined, undefined, undefined, undefined, undefined, updatedInv);
            }}
          />
        );
      case 'customers':
        return (
          <CustomerDirectory
            customers={customers}
            jobs={jobs}
            assets={assets}
            activeUser={activeUser}
            onUpdateCustomers={(updatedCustomers) => saveStateToStorage(undefined, undefined, undefined, updatedCustomers)}
          />
        );
      case 'suppliers':
        return (
          <SupplierDirectory
            suppliers={suppliers}
            activeUser={activeUser}
            onUpdateSuppliers={(updatedSuppliers) => saveStateToStorage(undefined, undefined, undefined, undefined, updatedSuppliers)}
            onLogAudit={handleLogAudit}
          />
        );
      case 'inventory':
        return (
          <InventoryManagement
            inventory={inventory}
            stockMovements={stockMovements}
            suppliers={suppliers}
            activeUser={activeUser}
            onUpdateInventory={(updatedInventory) => saveStateToStorage(undefined, undefined, undefined, undefined, undefined, updatedInventory)}
            onUpdateStockMovements={(updatedMovements) => saveStateToStorage(undefined, undefined, undefined, undefined, undefined, undefined, updatedMovements)}
            onLogAudit={handleLogAudit}
          />
        );
      case 'purchasing':
        return (
          <PurchasingManagement
            inventory={inventory}
            stockMovements={stockMovements}
            suppliers={suppliers}
            activeUser={activeUser}
            onUpdateInventory={(updatedInventory) => saveStateToStorage(undefined, undefined, undefined, undefined, undefined, updatedInventory)}
            onUpdateStockMovements={(updatedMovements) => saveStateToStorage(undefined, undefined, undefined, undefined, undefined, undefined, updatedMovements)}
            onLogAudit={handleLogAudit}
            purchaseOrders={purchaseOrders}
            onUpdatePurchaseOrders={(updatedPOs) => saveStateToStorage(undefined, undefined, undefined, undefined, undefined, undefined, undefined, updatedPOs)}
            grns={grns}
            onUpdateGrns={(updatedGrns) => saveStateToStorage(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, updatedGrns)}
          />
        );
      case 'kpis':
        return (
          <KpiEngine 
            kpis={kpis} 
            activeUser={activeUser} 
            onUpdateKpis={(updatedKpis) => saveStateToStorage(undefined, undefined, updatedKpis)}
            users={users}
            onUpdateUsers={saveUsersState}
          />
        );
      case 'feedback':
        return (
          <FeedbackSimulator 
            jobs={jobs} 
            onSubmitFeedback={handleAddFeedback}
          />
        );
      case 'audits':
        return <AuditLogViewer audits={audits} />;
      case 'org-manager':
        return (
          <OrgManager
            users={users}
            onUpdateUsers={saveUsersState}
            kpis={kpis}
            onUpdateKpis={(updatedKpis) => saveStateToStorage(undefined, undefined, updatedKpis)}
            activeUser={activeUser}
          />
        );
      case 'config-settings':
        return (
          <ConfigManager
            activeUser={activeUser}
            onLogAudit={handleLogAudit}
          />
        );
      case 'installation_requests':
        return (
          <InstallationRequestMaster
            requests={installationRequests}
            onAddRequest={handleAddInstallationRequest}
            onUpdateRequest={handleUpdateInstallationRequest}
            onDeleteRequest={handleDeleteInstallationRequest}
          />
        );
      case 'installation_assignment':
        return (
          <InstallationAssignmentWorkflow
            requests={installationRequests}
            assignments={installationAssignments}
            auditLogs={installationAssignmentAuditLogs}
            onAssign={handleAssignInstallation}
            onAdvanceStatus={handleAdvanceInstallationStatus}
            currentUser={activeUser}
          />
        );
      case 'installation_management':
        return (
          <InstallationManagement
            installations={installations}
            customers={customers as any}
            instruments={instruments}
            onAddInstallation={(newInst) => {
              const updated = [newInst, ...installations];
              setInstallations(updated);
              localStorage.setItem('avon_local_installations_v2', JSON.stringify(updated));
            }}
            onUpdateInstallation={handleUpdateInstallation}
            currentUser={activeUser}
          />
        );
      case 'calibration':
        return (
          <CalibrationManagement
            calibrations={calibrations}
            instruments={instruments}
            onAddCalibration={(newCal) => {
              const updated = [newCal, ...calibrations];
              setCalibrations(updated);
              localStorage.setItem('avon_local_calibrations_v2', JSON.stringify(updated));
            }}
            currentUser={activeUser}
            jobs={jobs}
            onAddJob={handleAddJob}
            onUpdateJob={handleUpdateJob}
            onUpdateInstruments={(updatedInsts) => {
              setInstruments(updatedInsts);
              localStorage.setItem('avon_local_instruments_v2', JSON.stringify(updatedInsts));
            }}
          />
        );
      case 'amc-management':
        return (
          <AmcManagement
            customers={customers}
            onUpdateCustomers={(updatedCustomers) => saveStateToStorage(undefined, undefined, undefined, updatedCustomers)}
            instruments={instruments}
            activeUser={activeUser}
            onLogAudit={handleLogAudit}
          />
        );
      case 'documents':
        return (
          <DocumentStorageModule />
        );
      case 'reporting':
        return (
          <ReportingModule
            customers={customers}
            jobs={jobs}
            kpis={kpis}
            users={users}
            installations={installations}
            activeUser={activeUser}
            onLogAudit={handleLogAudit}
          />
        );
      case 'notifications':
        return (
          <NotificationQueueModule
            activeUser={activeUser}
            users={users}
            onLogAudit={handleLogAudit}
            onRefreshGlobalNotifications={() => setGlobalNotifTrigger(prev => prev + 1)}
          />
        );
      case 'user-management':
        return (
          <UserManagement
            currentUser={activeUser}
            users={users}
            onUpdateUsers={saveUsersState}
          />
        );
      default:
        return <div>Tab Panel Pending Integration</div>;
    }
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600 animate-pulse">Initializing AVON ServicePro...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginPanel 
        users={users} 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  // Active workload triggers for supervisor notifications
  const emergencyLogsCount = jobs.filter(j => j.priority === 'Emergency' && j.status !== 'Closed').length;
  const pendingAssignmentCount = jobs.filter(j => j.status === 'Pending Assignment').length;

  return (
    <div id="enterprise_scaffold" className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Upper Navigation Corporate Header */}
      <header className="bg-slate-900 text-white shrink-0 shadow-md border-b border-slate-800 sticky top-0 z-40">
        <div className="px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-slate-800 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5 text-slate-300" />
            </button>
            
            {/* AVON Corporate Brand Logo */}
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10 shrink-0" viewBox="10 5 50 90" fill="none">
                {/* Background-matching cutout for interlocking 3D effect */}
                <path d="M20 85 L20 55 L50 35 L50 15" stroke="url(#logo_grad_left)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 15 L20 45 L50 65 L50 85" stroke="#0f172a" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 15 L20 45 L50 65 L50 85" stroke="url(#logo_grad_right)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                
                <defs>
                  <linearGradient id="logo_grad_left" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fde047" /> {/* yellow-300 */}
                    <stop offset="100%" stopColor="#f97316" /> {/* orange-500 */}
                  </linearGradient>
                  <linearGradient id="logo_grad_right" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ea580c" /> {/* orange-600 */}
                    <stop offset="100%" stopColor="#ef4444" /> {/* red-500 */}
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col justify-center leading-none">
                <div className="flex items-baseline gap-0.5">
                  <span className="font-black text-lg tracking-tight text-white font-sans">AVON</span>
                  <span className="text-orange-500 font-black text-lg font-sans">:</span>
                </div>
                <span className="text-[9px] text-slate-300 font-extrabold uppercase tracking-[0.2em] font-sans">PHARMO CHEM</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Notification alert Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer border border-slate-700/50"
              >
                <Bell className="w-4 h-4" />
                {(emergencyLogsCount > 0 || pendingAssignmentCount > 0 || headerNotifications.some(n => n.status === 'UNREAD')) && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2">
                  <h4 className="px-4 pb-2 border-b font-extrabold text-sm text-slate-800 flex justify-between items-center">
                    <span>Notifications Feed</span>
                    <button 
                      onClick={() => { setActiveTab('notifications'); setShowNotifications(false); }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 focus:outline-none cursor-pointer"
                    >
                      Manage Queue
                    </button>
                  </h4>
                  <div className="max-h-64 overflow-y-auto text-xs mt-2 divide-y divide-slate-100">
                    {/* Real-time active alerts from DB/State */}
                    {headerNotifications.filter(n => n.status === 'UNREAD').map(notif => (
                      <div 
                        key={notif.id} 
                        className="p-3 bg-blue-50/30 hover:bg-blue-50 flex gap-2 items-start cursor-pointer" 
                        onClick={() => { setActiveTab('notifications'); setShowNotifications(false); }}
                      >
                        <Bell className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block leading-tight">{notif.title}</span>
                          <p className="text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                          <span className="text-[9px] font-mono text-gray-400 block mt-1">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}

                    {emergencyLogsCount > 0 && (
                      <div className="p-3 bg-red-50/50 hover:bg-red-50 flex gap-2 items-start cursor-pointer" onClick={() => { setActiveTab('dashboard'); setShowNotifications(false); }}>
                        <Zap className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-red-800">Critical Breakdown alert</span>
                          <p className="text-slate-500 mt-0.5">There are {emergencyLogsCount} emergency jobs awaiting dispatch.</p>
                        </div>
                      </div>
                    )}
                    {pendingAssignmentCount > 0 && (
                      <div className="p-3 hover:bg-slate-50 flex gap-2 items-start cursor-pointer" onClick={() => { setActiveTab('jobs'); setShowNotifications(false); }}>
                        <Wrench className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-700">Jobs pending allocation</span>
                          <p className="text-slate-500 mt-0.5">{pendingAssignmentCount} new installation or repair schedules need assignments.</p>
                        </div>
                      </div>
                    )}
                    {emergencyLogsCount === 0 && pendingAssignmentCount === 0 && headerNotifications.filter(n => n.status === 'UNREAD').length === 0 && (
                      <div className="p-4 text-center text-slate-400 italic">No warnings or scheduled tasks pending</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Widget */}
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-800 p-1.5 pr-3.5 rounded-xl border border-slate-700/50">
              <img 
                src={activeUser.avatarUrl} 
                alt={activeUser.name} 
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-lg object-cover" 
              />
              <div className="text-left">
                <span className="text-[11px] font-black block tracking-tight">{activeUser.name}</span>
                <span className="text-[9px] text-emerald-400 font-bold block">{activeUser.role}</span>
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={handleLogout}
              title="Sign Out Session"
              className="p-2 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline text-rose-300">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main layout container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigator Sidebar rail */}
        <aside className={`bg-slate-900 border-r border-slate-800 text-slate-300 w-64 flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-30 transform lg:translate-x-0 lg:static transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4 space-y-6 pt-20 lg:pt-6 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-800">
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-3">Enterprise Suite</span>
              
              <nav className="space-y-1 max-h-[70vh] lg:max-h-none overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {[
                  { id: 'dashboard', label: 'Overview Dashboard', icon: Compass },
                  { id: 'jobs', label: 'Jobs & Service Master', icon: Wrench },
                  { id: 'workshop', label: 'Workshop Operations', icon: Wrench },
                  { id: 'assets', label: 'Instrument Registry', icon: Layers },
                  { id: 'installation_requests', label: '📦 Installation Requests', icon: ClipboardList },
                  { id: 'installation_assignment', label: '🚀 Installation Assignment', icon: UserCheck },
                  { id: 'installation_management', label: '⚙️ Installation Management', icon: ShieldCheck },
                  { id: 'pm-scheduler', label: 'PM Planner & Scheduler', icon: Calendar },
                  { id: 'calibration', label: 'Metrology & Calibration', icon: Medal },
                  { id: 'amc-management', label: '📜 AMC & SLA Contracts', icon: FileText },
                  { id: 'documents', label: '📁 Document & File Center', icon: FolderOpen },
                  { id: 'reporting', label: '📊 Analytical Reports', icon: BarChart3 },
                  { id: 'notifications', label: '🔔 Notification Queue', icon: Bell },
                  { id: 'customers', label: 'Customer Directory', icon: Building2 },
                  { id: 'suppliers', label: 'Supplier Directory', icon: Truck },
                  { id: 'inventory', label: 'Inventory & Spare Parts', icon: Package },
                  { id: 'kpis', label: 'Employee KPI Matrix', icon: Award },
                  { id: 'org-manager', label: 'Org & KPI Master', icon: Settings },
                  { id: 'user-management', label: '🛡️ User Management', icon: Users },
                  { id: 'feedback', label: 'CSAT Feedback Hub', icon: Smile },
                  { id: 'audits', label: 'Security Audit Trail', icon: History },
                  { id: 'config-settings', label: 'System Configuration', icon: Settings }
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav_btn_${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                          : 'hover:bg-slate-850 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar footer credentials */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-500 space-y-1">
            <div>© 2026 AVON PHARMO CHEM</div>
            <div className="flex gap-1.5">
              <span className="text-emerald-400 font-bold">Quality Standard</span>
              <span>•</span>
              <span className="text-blue-400 font-bold">Calibration Certified</span>
            </div>
          </div>
        </aside>

        {/* Central Work Space panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Current selected view panel */}
          <div id="active_workspace_panel" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderTabContent()}
          </div>
        </main>

      </div>

      {/* Global Interactive Handshake timeline modal */}
      {selectedJob && (
        <JobWorkflowModal
          job={selectedJob}
          activeUser={activeUser}
          onClose={() => setSelectedJob(null)}
          onUpdateJob={handleUpdateJob}
        />
      )}

    </div>
  );
}
