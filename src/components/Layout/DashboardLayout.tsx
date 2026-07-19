// ============================================================================
// File: src/components/Layout/DashboardLayout.tsx
// Production-Ready Responsive Enterprise Dashboard Layout for AVON ServicePro
// Stack: Next.js 16 App Router style, TypeScript, Shadcn UI patterns, Tailwind CSS
// Branding: AVON PHARMO CHEM (PVT) LTD SERVICE CENTRE (#0054A6)
// ============================================================================

import React, { useState } from 'react';
import { AppNotification, UserProfile } from '../../types';
import { 
  Building2, 
  Wrench, 
  Microscope, 
  FileSpreadsheet, 
  Award, 
  ShieldCheck, 
  FileText, 
  LayoutDashboard,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  HeartPulse,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Activity,
  Sliders,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

interface SubItem {
  id: string;
  label: string;
  targetTab: string;
  badge?: number;
}

interface NavSection {
  id: string;
  label: string;
  icon: React.ElementType;
  targetTab: string;
  subItems: SubItem[];
}

interface DashboardLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserProfile;
  onUserChange?: (user: UserProfile) => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({
  currentTab,
  onTabChange,
  currentUser,
  onUserChange,
  notifications,
  onMarkRead,
  onClearAll,
  onLogout,
  children
}: DashboardLayoutProps) {
  // Responsive sidebar states
  // Desktop: 'expanded' (w-64) or 'collapsed' (w-20 rail mode)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  // Mobile / Tablet (< lg): drawer overlay open state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Accordion expansion state for sidebar categories
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Dashboard': true,
    'Operations': true,
    'Customers': false,
    'Assets': false,
    'Commercial': true,
    'Performance': false,
    'Administration': true,
    'Reports': false
  });

  // Top bar dropdown states
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleSection = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNavClick = (targetTab: string) => {
    onTabChange(targetTab);
    if (isMobileDrawerOpen) {
      setIsMobileDrawerOpen(false);
    }
  };

  // Exact 8 Primary Navigation Sections requested
  const navSections: NavSection[] = [
    {
      id: 'sec-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      targetTab: 'dashboard',
      subItems: [
        { id: 'sub-dash-main', label: 'Executive Analytics', targetTab: 'dashboard' },
        { id: 'sub-dash-v4', label: '🌟 V4 Enterprise Hub', targetTab: 'v4_design_system' }
      ]
    },
    {
      id: 'sec-operations',
      label: 'Operations',
      icon: Wrench,
      targetTab: 'jobs',
      subItems: [
        { id: 'sub-ops-job', label: '⚡ Job Master Hub', targetTab: 'jobs' },
        { id: 'sub-ops-ins', label: 'Installations Fleet', targetTab: 'jobs' },
        { id: 'sub-ops-wsv', label: 'Warranty Services', targetTab: 'jobs', badge: unreadCount > 0 ? unreadCount : undefined },
        { id: 'sub-ops-srv', label: 'Non-Warranty Repairs', targetTab: 'jobs' },
        { id: 'sub-ops-cal', label: 'Calibration Jobs', targetTab: 'jobs' }
      ]
    },
    {
      id: 'sec-customers',
      label: 'Customers',
      icon: Building2,
      targetTab: 'customers',
      subItems: [
        { id: 'sub-cust-hub', label: '⚡ CRM Directory Hub', targetTab: 'customers' },
        { id: 'sub-cust-org', label: 'Organizations', targetTab: 'customers' },
        { id: 'sub-cust-dep', label: 'Laboratory Departments', targetTab: 'customers' },
        { id: 'sub-cust-usr', label: 'Clinical End Users', targetTab: 'customers' }
      ]
    },
    {
      id: 'sec-assets',
      label: 'Assets',
      icon: Microscope,
      targetTab: 'instruments',
      subItems: [
        { id: 'sub-ast-reg', label: 'Instrument Registry', targetTab: 'instruments' },
        { id: 'sub-ast-brd', label: 'Brands Fleet', targetTab: 'instruments' },
        { id: 'sub-ast-mod', label: 'Model Specifications', targetTab: 'instruments' }
      ]
    },
    {
      id: 'sec-commercial',
      label: 'Commercial',
      icon: FileSpreadsheet,
      targetTab: 'service',
      subItems: [
        { id: 'sub-com-quo', label: 'Service Quotations', targetTab: 'service' },
        { id: 'sub-com-po', label: 'Purchase Orders (PO)', targetTab: 'service' },
        { id: 'sub-com-inv', label: 'Tax Invoices', targetTab: 'service' }
      ]
    },
    {
      id: 'sec-performance',
      label: 'Performance',
      icon: Award,
      targetTab: 'feedback',
      subItems: [
        { id: 'sub-prf-csat', label: 'Customer Satisfaction', targetTab: 'feedback' },
        { id: 'sub-prf-kpi', label: 'KPI Metrics', targetTab: 'dashboard' },
        { id: 'sub-prf-res', label: 'SLA Benchmarks', targetTab: 'v3_architecture' }
      ]
    },
    {
      id: 'sec-administration',
      label: 'Administration',
      icon: ShieldCheck,
      targetTab: 'users',
      subItems: [
        { id: 'sub-adm-rbac', label: '⚡ Auth & User Hub', targetTab: 'users' },
        { id: 'sub-adm-ter', label: '📍 Territory Management', targetTab: 'territory' },
        { id: 'sub-adm-v3', label: 'V3 Enterprise Hub', targetTab: 'v3_architecture' },
        { id: 'sub-adm-v2', label: 'V2 Architect Hub', targetTab: 'architect' }
      ]
    },
    {
      id: 'sec-reports',
      label: 'Reports',
      icon: FileText,
      targetTab: 'v3_architecture',
      subItems: [
        { id: 'sub-rep-all', label: 'ISO 17025 Audit Logs', targetTab: 'v3_architecture' },
        { id: 'sub-rep-srv', label: 'Service Export Engine', targetTab: 'v3_architecture' }
      ]
    }
  ];

  // Quick Demo Profiles for Preview Testing
  const demoProfiles = [
    { name: 'Cherub W.', email: 'cherub.w@avonpharmochem.com', role: 'Senior Biomedical Engineer' },
    { name: 'Workshop Mgr', email: 'manager@avon.lk', role: 'Workshop Manager' },
    { name: 'Doc Officer', email: 'docs@avonpharmochem.com', role: 'Documentation Officer' }
  ];

  const handleDemoSwitch = (prof: typeof demoProfiles[0]) => {
    if (onUserChange) {
      onUserChange({
        ...currentUser,
        name: prof.name,
        email: prof.email,
        role: prof.role as any
      });
    }
    setIsUserMenuOpen(false);
  };

  // Render Sidebar Content (Shared between desktop and mobile drawer)
  const renderSidebarNavContent = (isCollapsedRail: boolean) => (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#001D3D] via-[#0054A6] to-[#312E81] text-white select-none overflow-hidden relative shadow-2xl">
      
      {/* Brand Header */}
      <div className={`p-4 sm:p-5 border-b border-cyan-500/20 bg-black/20 backdrop-blur-md flex items-center ${isCollapsedRail ? 'justify-center px-2' : 'justify-between'} transition-all shrink-0`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#00AEEF]/20 border border-[#00AEEF]/40 flex items-center justify-center text-[#00AEEF] shrink-0 shadow-md">
            <Building2 className="w-5 h-5 text-[#3399ff]" />
          </div>
          {!isCollapsedRail && (
            <div className="min-w-0">
              <h1 className="text-xs font-black tracking-wider uppercase text-white truncate font-sans">
                AVON PHARMO CHEM
              </h1>
              <p className="text-[10px] font-bold text-[#00AEEF] tracking-widest uppercase mt-0.5 truncate font-mono">
                SERVICE CENTRE V5.1
              </p>
            </div>
          )}
        </div>

        {!isCollapsedRail && (
          <span className="hidden xl:inline-block bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ml-1">
            ISO 17025
          </span>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-blue-800">
        {navSections.map(sec => {
          const IconComponent = sec.icon;
          const isExpanded = expandedSections[sec.label];
          const isSectionActive = currentTab === sec.targetTab || sec.subItems.some(sub => sub.targetTab === currentTab);

          if (isCollapsedRail) {
            // Rail Mode: Tooltip-style icon buttons
            return (
              <button
                key={sec.id}
                onClick={() => handleNavClick(sec.targetTab)}
                title={sec.label}
                className={`w-full p-3 rounded-xl flex items-center justify-center transition-all relative group cursor-pointer ${
                  isSectionActive 
                    ? 'bg-[#003B75] text-[#00AEEF] shadow-md border border-[#00AEEF]/30' 
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <IconComponent className="w-5 h-5 shrink-0" />
                {sec.subItems.some(s => s.badge) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0054A6]" />
                )}
                {/* Floating Rail Tooltip */}
                <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {sec.label}
                </span>
              </button>
            );
          }

          // Full Expanded Mode
          return (
            <div key={sec.id} className={`rounded-xl overflow-hidden border transition-all ${
              isSectionActive ? 'border-[#00AEEF]/40 bg-[#00478F]/60' : 'border-white/5 bg-[#00478F]/25 hover:bg-[#00478F]/40'
            }`}>
              <div className="flex items-center justify-between p-1">
                <button
                  onClick={() => handleNavClick(sec.targetTab)}
                  className={`flex-1 text-left py-2 px-2.5 flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    isSectionActive ? 'text-[#00AEEF]' : 'text-white hover:text-cyan-200'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isSectionActive ? 'text-[#00AEEF]' : 'text-blue-200'}`} />
                  <span className="truncate">{sec.label}</span>
                </button>

                <button
                  onClick={(e) => toggleSection(sec.label, e)}
                  className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer focus:outline-none"
                  aria-label={`Toggle ${sec.label} sub-items`}
                >
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Accordion Sub-Items */}
              {isExpanded && (
                <div className="p-1 pt-0 space-y-0.5 bg-[#003366]/50 border-t border-white/5 pl-3">
                  {sec.subItems.map(sub => {
                    const isSubActive = currentTab === sub.targetTab && (
                      (sub.targetTab !== 'service' && sub.targetTab !== 'v3_architecture' && sub.targetTab !== 'dashboard') ||
                      (currentTab === sub.targetTab && (sub.id.includes('main') || sub.id.includes('v4') || sub.id.includes('job') || sub.id.includes('hub') || sub.id.includes('csat') || sub.id.includes('rbac') || sub.id.includes('all')))
                    );

                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleNavClick(sub.targetTab)}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                          isSubActive 
                            ? 'bg-[#0077C8] text-white shadow-xs font-bold pl-3 border-l-2 border-[#00AEEF]' 
                            : 'text-blue-200 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate">{sub.label}</span>
                        {sub.badge ? (
                          <span className="bg-red-600 text-white h-4 min-w-4 flex items-center justify-center rounded-full text-[9px] font-mono font-bold leading-none px-1 shadow-sm">
                            {sub.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Footer Card */}
      <div className={`p-3.5 bg-[#003B75] border-t border-[#0077C8]/30 flex items-center ${isCollapsedRail ? 'justify-center' : 'gap-3'} shrink-0 relative`}>
        <div className="w-9 h-9 rounded-full bg-[#0077C8] border border-cyan-300 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0 shadow-md">
          {currentUser.avatar || currentUser.role.slice(0, 2)}
        </div>
        {!isCollapsedRail && (
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white text-xs truncate leading-snug">{currentUser.name}</p>
            <span className="text-[10px] font-mono text-[#00AEEF] block truncate leading-none mt-0.5">{currentUser.role}</span>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <div className="flex h-screen bg-[#F5F8FC] overflow-hidden font-sans select-none">
      
      {/* =====================================================================
          1. DESKTOP & TABLET LEFT SIDEBAR (md:flex)
          Responsive Sizing:
          - Tablet (md to lg): Fixed rail mode w-20
          - Desktop (lg+): Toggleable w-64 or w-20
      ====================================================================== */}
      <aside className={`hidden md:flex flex-col shrink-0 h-full z-20 transition-all duration-300 ease-in-out shadow-xl relative ${
        isDesktopCollapsed ? 'w-20' : 'w-20 lg:w-64'
      }`}>
        {renderSidebarNavContent(isDesktopCollapsed || (typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024))}
      </aside>

      {/* =====================================================================
          2. MOBILE NAVIGATION DRAWER OVERLAY (< md)
          Shadcn Sheet style off-canvas drawer
      ====================================================================== */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" 
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative w-72 sm:w-80 h-full bg-[#0054A6] z-10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="absolute top-4 right-4 p-2 text-blue-200 hover:text-white rounded-lg bg-[#003B75] border border-white/10 z-20 cursor-pointer"
              aria-label="Close menu drawer"
            >
              <X className="w-5 h-5" />
            </button>
            {renderSidebarNavContent(false)}
          </div>
        </div>
      )}

      {/* =====================================================================
          3. MAIN RIGHT CORE VIEWPORT (Top Bar + Main Body)
      ====================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-mesh-colorful">
        
        {/* TOP BAR TOOLBAR (Logo, Notifications, User Menu) */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-indigo-100 flex items-center justify-between px-4 sm:px-6 shrink-0 relative z-30 shadow-sm">
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00AEEF] via-[#6366F1] via-[#EC4899] to-[#F59E0B] opacity-80" />
          
          {/* Top Bar Left: Mobile Toggle + Desktop Rail Toggle + Brand Logo */}
          <div className="flex items-center gap-3 min-w-0">
            
            {/* Mobile Hamburger Button (< md) */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer focus:outline-none"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar Rail Collapse Toggle Button (lg+) */}
            <button
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              className="hidden lg:flex p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer focus:outline-none items-center justify-center"
              title={isDesktopCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse to Rail Mode"}
            >
              {isDesktopCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>

            {/* Top Bar Logo (Visible on mobile/tablet or when desktop sidebar collapsed) */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#0054A6] text-white flex items-center justify-center font-bold shadow-sm shrink-0 md:hidden">
                <Building2 className="w-4 h-4 text-[#00AEEF]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-extrabold tracking-tight text-[#0054A6] uppercase truncate font-sans">
                  AVON PHARMO CHEM <span className="text-slate-500 font-semibold hidden sm:inline">(PVT) LTD</span>
                </h2>
                <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider truncate">
                  SERVICE CENTRE PORTAL • COLOMBO
                </p>
              </div>
            </div>

          </div>

          {/* Top Bar Right: System Pulse + Notifications + User Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* System Pulse Indicator */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-emerald-800 tracking-wider">
                ISO 17025 ACTIVE
              </span>
            </div>

            {/* Notifications Bell Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (isUserMenuOpen) setIsUserMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl border relative transition-all cursor-pointer focus:outline-none flex items-center justify-center ${
                  isNotifOpen ? 'bg-slate-100 border-[#0054A6] text-[#0054A6]' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
                aria-label="View system notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[10px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full font-bold shadow-sm ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Card */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in duration-200">
                  <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#00AEEF]" />
                      <span className="text-xs font-bold uppercase tracking-wider">Metrology Alerts</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          onClearAll();
                          setIsNotifOpen(false);
                        }}
                        className="text-[11px] font-semibold text-[#00AEEF] hover:underline cursor-pointer"
                      >
                        Clear All ({unreadCount})
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-3.5 transition-colors ${notif.read ? 'bg-white opacity-75' : 'bg-blue-50/50'}`}>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            {notif.severity === 'ALERT' ? (
                              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-[#0054A6] shrink-0" />
                            )}
                            <span>{notif.title}</span>
                          </h4>
                          {!notif.read && (
                            <button
                              onClick={() => onMarkRead(notif.id)}
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-sans pl-3.5">{notif.message}</p>
                        <span className="text-[9px] font-mono text-slate-400 block pl-3.5 mt-1.5">
                          {new Date(notif.timestamp).toLocaleTimeString() || "JUST NOW"}
                        </span>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        No active service notifications.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  if (isNotifOpen) setIsNotifOpen(false);
                }}
                className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border transition-all cursor-pointer focus:outline-none ${
                  isUserMenuOpen ? 'bg-slate-100 border-[#0054A6]' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
                aria-label="User account menu"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0054A6] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {currentUser.avatar || currentUser.name.slice(0, 2)}
                </div>
                <div className="text-left hidden sm:block max-w-[120px] truncate">
                  <p className="text-xs font-bold text-slate-800 truncate leading-none">{currentUser.name}</p>
                  <span className="text-[10px] font-mono text-slate-500 truncate block mt-0.5">{currentUser.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Menu Dropdown Card */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in duration-200">
                  <div className="p-4 bg-[#0054A6] text-white">
                    <p className="text-xs font-bold truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-blue-200 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-blue-900/60 border border-blue-400/30 rounded text-[10px] font-mono text-cyan-200 font-semibold">
                      {currentUser.role}
                    </span>
                  </div>

                  {/* Role Switcher for Preview Testing */}
                  <div className="p-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-[#0054A6]" />
                      <span>Switch Demo Profile</span>
                    </p>
                    <div className="space-y-1">
                      {demoProfiles.map((prof) => (
                        <button
                          key={prof.email}
                          onClick={() => handleDemoSwitch(prof)}
                          className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            currentUser.email === prof.email ? 'bg-[#0054A6]/10 text-[#0054A6] font-bold' : 'text-slate-600 hover:bg-slate-200/60'
                          }`}
                        >
                          <span className="truncate">{prof.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 truncate ml-1">{prof.role.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Links */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        handleNavClick('users');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Account Credentials & RBAC</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    {onLogout && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out of Portal</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* MAIN PAGE VIEWPORT BODY */}
        <div className="flex-1 overflow-hidden relative flex flex-col min-w-0">
          {children}
        </div>

      </div>

    </div>
  );
}
