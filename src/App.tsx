/**
 * AVON ServicePro Enterprise Application Entry
 * Built for AVON PHARMO CHEM (PVT) LTD Service Centre
 * Target Client Stack: Diagnostics, HPLC, GC, Spec, Metrology
 */

import React, { useState } from 'react';
import { UserRole, UserProfile, Customer, Instrument, ServiceTicket, CalibrationRecord, CSATRecord, AppNotification, Installation, Territory, InstallationRequest, InstallationAssignment, InstallationAssignmentAuditLog, InstallationRequestStatus } from './types';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_INSTRUMENTS, 
  INITIAL_TICKETS, 
  INITIAL_CALIBRATIONS, 
  INITIAL_CSAT, 
  INITIAL_NOTIFICATIONS, 
  SYSTEM_KPIS,
  INITIAL_INSTALLATIONS,
  INITIAL_TERRITORIES
} from './data/initialState';

import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './components/Dashboard';

import UserManagement from './components/Modules/UserManagement';
import CustomerManagement from './components/Modules/CustomerManagement';
import InstrumentRegistry from './components/Modules/InstrumentRegistry';
import JobMasterManagement from './components/Modules/JobMasterManagement';
import ServiceRepairManagement from './components/Modules/ServiceRepairManagement';
import CalibrationManagement from './components/Modules/CalibrationManagement';
import FeedbackNPS from './components/Modules/FeedbackNPS';
import ArchitectHub from './components/Modules/ArchitectHub';
import RBACArchitectureV3 from './components/Modules/RBACArchitectureV3';
import InstallationManagement from './components/Modules/InstallationManagement';
import InstallationRequestMaster from './components/Modules/InstallationRequestMaster';
import { INITIAL_INSTALLATION_REQUESTS } from './data/sprint51InstallationRequestDbLayer';
import InstallationAssignmentWorkflow from './components/Modules/InstallationAssignmentWorkflow';
import { INITIAL_INSTALLATION_ASSIGNMENTS, INITIAL_ASSIGNMENT_AUDIT_LOGS } from './data/sprint52InstallationAssignmentDbLayer';
import TerritoryManagement from './components/Modules/TerritoryManagement';
import EnterpriseDesignSystemV4 from './components/Modules/EnterpriseDesignSystemV4';
import LoginPage from './components/Auth/LoginPage';
import { enterpriseLogout } from './lib/supabaseClient';
import { safeLocalStorage } from './lib/safeStorage';

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(safeLocalStorage.getItem('avon_auth_session'));
  });

  // Main states
  const [currentTab, setCurrentTab] = useState<string>('customers');
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "usr-cherub-w",
    name: "Cherub Weeratunge",
    email: "cherub.w@avonpharmochem.com",
    role: "Senior Biomedical Engineer",
    department: "Biomedical Engineering & Metrology Div",
    avatar: "CW",
    tags: ['Area Engineer', 'Calibration Engineer']
  });

  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [instruments, setInstruments] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [tickets, setTickets] = useState<ServiceTicket[]>(INITIAL_TICKETS);
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>(INITIAL_CALIBRATIONS);
  const [csatRecords, setCsatRecords] = useState<CSATRecord[]>(INITIAL_CSAT);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [kpis, setKpis] = useState(SYSTEM_KPIS);
  const [selectedTicketForReview, setSelectedTicketForReview] = useState<ServiceTicket | null>(null);
  const [installations, setInstallations] = useState<Installation[]>(INITIAL_INSTALLATIONS);
  const [territories, setTerritories] = useState<Territory[]>(INITIAL_TERRITORIES);
  const [installationRequests, setInstallationRequests] = useState<InstallationRequest[]>(INITIAL_INSTALLATION_REQUESTS);
  const [assignments, setAssignments] = useState<InstallationAssignment[]>(INITIAL_INSTALLATION_ASSIGNMENTS);
  const [assignmentAuditLogs, setAssignmentAuditLogs] = useState<InstallationAssignmentAuditLog[]>(INITIAL_ASSIGNMENT_AUDIT_LOGS);

  // Sprint 5.2 Assignment & Milestone Handlers
  const handleAssignInstallation = (newAssignment: InstallationAssignment, updatedReq: InstallationRequest, log: InstallationAssignmentAuditLog) => {
    setAssignments(prev => {
      const idx = prev.findIndex(a => a.requestId === newAssignment.requestId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newAssignment;
        return next;
      }
      return [newAssignment, ...prev];
    });
    setInstallationRequests(prev => prev.map(req => req.id === updatedReq.id ? updatedReq : req));
    setAssignmentAuditLogs(prev => [log, ...prev]);
  };

  const handleAdvanceInstallationStatus = (requestId: string, newStatus: InstallationRequestStatus, log: InstallationAssignmentAuditLog) => {
    setInstallationRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
    setAssignmentAuditLogs(prev => [log, ...prev]);
  };

  // Installation Request Handlers (Sprint 5.1)
  const handleAddInstallationRequest = (newReq: InstallationRequest) => {
    setInstallationRequests(prev => [newReq, ...prev]);
  };

  const handleUpdateInstallationRequest = (updatedReq: InstallationRequest) => {
    setInstallationRequests(prev => prev.map(req => req.id === updatedReq.id ? updatedReq : req));
  };

  const handleDeleteInstallationRequest = (id: string) => {
    setInstallationRequests(prev => prev.filter(req => req.id !== id));
  };

  // Installation Handlers
  const handleAddInstallation = (newInst: Installation) => {
    setInstallations([newInst, ...installations]);
    
    // Auto-generate notification alert for the team
    const newNotif: AppNotification = {
      id: `notif-inst-${Date.now()}`,
      title: "New Installation Order Scheduled",
      message: `${newInst.installationNumber} has been scheduled for ${newInst.instrumentName} at ${newInst.customerName}.`,
      type: 'TICKET_STATUS',
      severity: 'INFO',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleUpdateInstallation = (updatedInst: Installation) => {
    setInstallations(prev => prev.map(inst => inst.id === updatedInst.id ? updatedInst : inst));

    // Ensure status transitions affect instrument warranty and operational status
    if (updatedInst.status === 'Completed' && updatedInst.warrantyStart && updatedInst.warrantyExpiry) {
      setInstruments(prev => prev.map(inst => {
        if (inst.id === updatedInst.instrumentId || inst.serialNumber === updatedInst.serialNumber) {
          return {
            ...inst,
            installationStatus: 'COMPLETED',
            installationDate: updatedInst.completedAt?.split('T')[0] || updatedInst.warrantyStart || inst.installationDate,
            warrantyStart: updatedInst.warrantyStart || inst.warrantyStart,
            warrantyExpiry: updatedInst.warrantyExpiry || inst.warrantyExpiry,
            status: 'OPERATIONAL'
          };
        }
        return inst;
      }));

      // Fire a system notification
      const completeNotif: AppNotification = {
        id: `notif-inst-done-${Date.now()}`,
        title: "Installation Completed & Warranty Card Active",
        message: `${updatedInst.installationNumber} was successfully signed off. Warranty activated for serial ${updatedInst.serialNumber}.`,
        type: 'SYSTEM',
        severity: 'INFO',
        timestamp: new Date().toISOString(),
        read: false
      };
      setNotifications(prev => [completeNotif, ...prev]);
    }
  };

  // Core modification functions

  const handleRoleChange = (role: UserRole) => {
    let name = currentUser.name;
    let email = currentUser.email;
    let dept = currentUser.department || "AVON Service Centre";
    let avatar = currentUser.avatar;

    if (role === 'Workshop Manager') {
      name = "M. N. Jayawardene";
      email = "manager@avon.lk";
      dept = "Service Centre Administration";
      avatar = "MJ";
    } else if (role === 'Documentation Officer') {
      name = "Fathima Farhana";
      email = "farhana.f@avon.lk";
      dept = "Compliance & QA Office";
      avatar = "FF";
    } else if (role === 'Senior Biomedical Engineer' || role === 'Biomedical Engineer') {
      name = "Eng. Suresh Perera";
      email = "suresh@avon.lk";
      dept = "Advanced Chromatography Unit";
      avatar = "SP";
    } else if (role === 'Calibration Engineer') {
      name = "Eng. Nimani Senanayake";
      email = "nimani@avon.lk";
      dept = "Physical Metrology Labs";
      avatar = "NS";
    } else if (role === 'Intern Technician') {
      name = "Trainee Keshara de Silva";
      email = "keshara@avon.lk";
      dept = "Workshop Training Division";
      avatar = "KD";
    } else if (role === 'CUSTOMER') {
      name = "Dr. Rohitha Wijesekera";
      email = "lab.admin@lankahospitals.com";
      dept = "Lanka Hospitals Lab Services";
      avatar = "RW";
    } else if (role === 'DIRECTOR') {
      name = "Dr. Dilhan Jayasekara";
      email = "dilhan.j@avon.lk";
      dept = "AVON Executive Cabinet";
      avatar = "DJ";
    }

    setCurrentUser({ id: `usr-${role.toLowerCase().replace(/\s+/g, '-')}`, name, email, role, department: dept, avatar });
  };

  // 2. Customer Add
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers([newCustomer, ...customers]);
  };

  // 3. Instrument Add & Decommission
  const handleAddInstrument = (newInst: Instrument) => {
    setInstruments([newInst, ...instruments]);
  };

  const handleDecommissionInstrument = (id: string) => {
    setInstruments(instruments.filter(i => i.id !== id));
  };

  // 4. Repairs, PM + Workshop status logic
  const handleAddTicket = (newTicket: ServiceTicket) => {
    setTickets([newTicket, ...tickets]);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: ServiceTicket['status']) => {
    // Update Ticket State
    setTickets(prevTickets => prevTickets.map(t => {
      if (t.id === ticketId) {
        const isClosed = status === 'CLOSED';
        return { 
          ...t, 
          status, 
          resolvedAt: isClosed ? new Date().toISOString() : undefined 
        };
      }
      return t;
    }));

    // Find ticket and sync with instrument operational status cleanly
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setInstruments(prevInsts => prevInsts.map(inst => {
        if (inst.id === ticket.instrumentId) {
          let updatedStatus: Instrument['status'] = 'OPERATIONAL';
          if (status === 'DIAGNOSING' || status === 'REPAIRING') {
            updatedStatus = 'DOWN';
          } else if (status === 'PENDING_PARTS') {
            updatedStatus = 'WORKSHOP';
          } else if (status === 'CALIBRATING') {
            updatedStatus = 'CALIBRATING';
          } else if (status === 'QUALITY_CHECK' || status === 'READY_DELIVERY' || status === 'CLOSED') {
            updatedStatus = 'OPERATIONAL';
          }
          return { ...inst, status: updatedStatus };
        }
        return inst;
      }));
    }
  };

  const handleUpdateTicketPrice = (id: string, estimatedCost: number) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, estimatedCost };
      }
      return t;
    }));
  };

  const handleApproveTicketBilling = (id: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, billingApproved: true };
      }
      return t;
    }));
  };

  const handleAssignEngineer = (ticketId: string, engineerId: string, engineerName: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, assignedEngineerId: engineerId, assignedEngineerName: engineerName };
      }
      return t;
    }));
  };

  // 5. Calibration
  const handleAddCalibration = (newCal: CalibrationRecord) => {
    setCalibrations([newCal, ...calibrations]);
    
    // Changing instrument status to OPERATIONAL post calibration
    setInstruments(prev => prev.map(inst => {
      if (inst.id === newCal.instrumentId) {
        return { ...inst, status: 'OPERATIONAL' };
      }
      return inst;
    }));
  };

  // 6. CSAT
  const handleAddFeedback = (newCsat: CSATRecord) => {
    setCsatRecords([newCsat, ...csatRecords]);
  };

  // Territory Handlers
  const handleAddTerritory = (newTerr: Territory) => {
    setTerritories([newTerr, ...territories]);
  };

  const handleUpdateTerritory = (updatedTerr: Territory) => {
    setTerritories(prev => prev.map(t => t.id === updatedTerr.id ? updatedTerr : t));
  };

  const handleDeleteTerritory = (id: string) => {
    setTerritories(prev => prev.filter(t => t.id !== id));
  };

  // 7. Notifications helpers
  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, read: true };
      }
      return n;
    }));
  };

  const handleClearNotifs = () => {
    setNotifications([]);
  };

  const navigateToTab = (tab: string) => {
    setCurrentTab(tab);
    setSelectedTicketForReview(null);
  };

  const handleViewTicketFromDashboard = (ticket: ServiceTicket) => {
    setSelectedTicketForReview(ticket);
    setCurrentTab('service');
  };

  const handleLoginSuccess = (userEmail: string, role?: string) => {
    setCurrentUser(prev => ({
      ...prev,
      email: userEmail,
      name: userEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      role: (role as any) || prev.role
    }));
    setIsAuthenticated(true);
    setCurrentTab('dashboard');
  };

  const handleLogout = async () => {
    await enterpriseLogout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <DashboardLayout
      currentTab={currentTab}
      onTabChange={navigateToTab}
      currentUser={currentUser}
      onUserChange={setCurrentUser}
      notifications={notifications}
      onMarkRead={handleMarkRead}
      onClearAll={handleClearNotifs}
      onLogout={handleLogout}
    >
      <main className="flex-1 overflow-y-auto p-6 md:p-8 animate-fade-in scrollbar-thin">
          
          {currentTab === 'dashboard' && (
            <Dashboard 
              instruments={instruments}
              tickets={tickets}
              calibrations={calibrations}
              kpis={kpis}
              onNavigate={navigateToTab}
              onViewTicket={handleViewTicketFromDashboard}
              currentUser={currentUser}
              installationRequests={installationRequests}
            />
          )}

          {currentTab === 'users' && (
            <UserManagement 
              currentUser={currentUser}
              onRoleChange={handleRoleChange}
            />
          )}

          {currentTab === 'customers' && (
            <CustomerManagement 
              customers={customers}
              onAddCustomer={handleAddCustomer}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'instruments' && (
            <InstrumentRegistry 
              instruments={instruments}
              customers={customers}
              onAddInstrument={handleAddInstrument}
              onDecommissionInstrument={handleDecommissionInstrument}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'jobs' && (
            <JobMasterManagement currentUser={currentUser} />
          )}

          {currentTab === 'service' && (
            <ServiceRepairManagement 
              tickets={tickets}
              instruments={instruments}
              onAddTicket={handleAddTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onUpdateTicketPrice={handleUpdateTicketPrice}
              onApproveTicketBilling={handleApproveTicketBilling}
              onAssignEngineer={handleAssignEngineer}
              currentUser={currentUser}
              initialSelectedTicket={selectedTicketForReview}
            />
          )}

          {currentTab === 'calibration' && (
            <CalibrationManagement 
              calibrations={calibrations}
              instruments={instruments}
              onAddCalibration={handleAddCalibration}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'feedback' && (
            <FeedbackNPS 
              csatRecords={csatRecords}
              customers={customers}
              onAddFeedback={handleAddFeedback}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'v4_design_system' && (
            <EnterpriseDesignSystemV4 />
          )}

          {currentTab === 'architect' && (
            <ArchitectHub />
          )}

          {currentTab === 'v3_architecture' && (
            <RBACArchitectureV3 />
          )}

          {currentTab === 'installation' && (
            <InstallationManagement 
              installations={installations}
              customers={customers}
              instruments={instruments}
              onAddInstallation={handleAddInstallation}
              onUpdateInstallation={handleUpdateInstallation}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'installation_requests' && (
            <InstallationRequestMaster 
              requests={installationRequests}
              onAddRequest={handleAddInstallationRequest}
              onUpdateRequest={handleUpdateInstallationRequest}
              onDeleteRequest={handleDeleteInstallationRequest}
            />
          )}

          {currentTab === 'installation_assignment' && (
            <InstallationAssignmentWorkflow 
              requests={installationRequests}
              assignments={assignments}
              auditLogs={assignmentAuditLogs}
              onAssign={handleAssignInstallation}
              onAdvanceStatus={handleAdvanceInstallationStatus}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'territory' && (
            <TerritoryManagement 
              territories={territories}
              customers={customers}
              tickets={tickets}
              instruments={instruments}
              onAddTerritory={handleAddTerritory}
              onUpdateTerritory={handleUpdateTerritory}
              onDeleteTerritory={handleDeleteTerritory}
              currentUser={currentUser}
            />
          )}

      </main>
    </DashboardLayout>
  );
}
