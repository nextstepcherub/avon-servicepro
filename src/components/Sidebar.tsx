import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Building2, 
  Database, 
  Microscope, 
  ShieldCheck, 
  HeartHandshake, 
  Users, 
  Wrench, 
  LayoutDashboard,
  Bell,
  Scale,
  ClipboardCheck,
  Compass,
  FileSpreadsheet,
  Award,
  FileText,
  ChevronDown,
  ChevronRight,
  Tag,
  Activity,
  Briefcase
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserProfile;
  unreadCount: number;
}

interface MenuItemSpec {
  id: string;
  label: string;
  targetTab: string;
  rolesAllowed: string[]; // ['ALL'] or list
}

interface MenuCategorySpec {
  category: string;
  icon: any;
  items: MenuItemSpec[];
}

export default function Sidebar({ currentTab, onTabChange, currentUser, unreadCount }: SidebarProps) {
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    'Dashboard': true,
    'Operations': true,
    'Customers': false,
    'Assets': false,
    'Commercial': true,
    'Performance': false,
    'Administration': true,
    'Reports': false
  });

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const menuCategories: MenuCategorySpec[] = [
    {
      category: 'Dashboard',
      icon: LayoutDashboard,
      items: [
        { id: 'dash-v4', label: '🌟 V4 Enterprise Hub', targetTab: 'v4_design_system', rolesAllowed: ['ALL'] },
        { id: 'dash-main', label: 'Executive Analytics', targetTab: 'dashboard', rolesAllowed: ['ALL'] }
      ]
    },
    {
      category: 'Operations',
      icon: Wrench,
      items: [
        { id: 'ops-inst-req', label: '📦 Installation Requests (Sprint 5.1)', targetTab: 'installation_requests', rolesAllowed: ['ALL'] },
        { id: 'ops-inst-asgn', label: '🚀 Installation Assignment (Sprint 5.2)', targetTab: 'installation_assignment', rolesAllowed: ['ALL'] },
        { id: 'ops-job', label: '⚡ Next.js Job Master Hub', targetTab: 'jobs', rolesAllowed: ['ALL'] },
        { id: 'ops-ins', label: 'Installations (Job Master)', targetTab: 'jobs', rolesAllowed: ['ALL'] },
        { id: 'ops-wsv', label: 'Warranty Services (Job Master)', targetTab: 'jobs', rolesAllowed: ['ALL'] },
        { id: 'ops-srv', label: 'Non Warranty Services (Job Master)', targetTab: 'jobs', rolesAllowed: ['ALL'] },
        { id: 'ops-wrp', label: 'Warranty Repairs (Job Master)', targetTab: 'jobs', rolesAllowed: ['ALL'] },
        { id: 'ops-wsj', label: 'Workshop Jobs (Job Master)', targetTab: 'jobs', rolesAllowed: ['ALL'] },
        { id: 'ops-cal', label: 'Calibration Jobs (Job Master)', targetTab: 'jobs', rolesAllowed: ['ALL'] }
      ]
    },
    {
      category: 'Customers',
      icon: Building2,
      items: [
        { id: 'cust-hub', label: '⚡ Next.js Customer Hub', targetTab: 'customers', rolesAllowed: ['ALL'] },
        { id: 'cust-org', label: 'Customer Organizations', targetTab: 'customers', rolesAllowed: ['ALL'] },
        { id: 'cust-dep', label: 'Laboratory Departments', targetTab: 'customers', rolesAllowed: ['ALL'] },
        { id: 'cust-usr', label: 'Clinical End Users', targetTab: 'customers', rolesAllowed: ['ALL'] }
      ]
    },
    {
      category: 'Assets',
      icon: Microscope,
      items: [
        { id: 'ast-reg', label: 'Instrument Registry', targetTab: 'instruments', rolesAllowed: ['ALL'] },
        { id: 'ast-brd', label: 'Brands Fleet', targetTab: 'instruments', rolesAllowed: ['ALL'] },
        { id: 'ast-mod', label: 'Model Specifications', targetTab: 'instruments', rolesAllowed: ['ALL'] }
      ]
    },
    {
      category: 'Commercial',
      icon: FileSpreadsheet,
      items: [
        { id: 'com-quo', label: 'Service Quotations', targetTab: 'service', rolesAllowed: ['Workshop Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'Senior Service Engineer', 'Senior Workshop Engineer', 'Biomedical Engineer', 'Service Engineer', 'Workshop Engineer'] },
        { id: 'com-po', label: 'Purchase Orders (PO)', targetTab: 'purchasing', rolesAllowed: ['ALL'] },
        { id: 'com-inv-mgmt', label: 'Spares & Inventory', targetTab: 'inventory', rolesAllowed: ['ALL'] },
        { id: 'com-inv', label: 'Tax Invoices', targetTab: 'service', rolesAllowed: ['Workshop Manager', 'Documentation Officer'] }
      ]
    },
    {
      category: 'Performance',
      icon: Award,
      items: [
        { id: 'prf-kpi', label: 'KPI Dashboard', targetTab: 'dashboard', rolesAllowed: ['ALL'] },
        { id: 'prf-res', label: 'KPI Results', targetTab: 'v3_architecture', rolesAllowed: ['ALL'] },
        { id: 'prf-csat', label: 'Customer Satisfaction', targetTab: 'feedback', rolesAllowed: ['ALL'] }
      ]
    },
    {
      category: 'Administration',
      icon: ShieldCheck,
      items: [
        { id: 'adm-rbac', label: '⚡ Next.js Auth & User Hub', targetTab: 'users', rolesAllowed: ['ALL'] },
        { id: 'adm-ter', label: '📍 Territory Management', targetTab: 'territory', rolesAllowed: ['ALL'] },
        { id: 'adm-wfl', label: 'Workflow Statuses', targetTab: 'v3_architecture', rolesAllowed: ['Workshop Manager', 'Senior Biomedical Engineer', 'Senior Service Engineer'] },
        { id: 'adm-sla', label: 'SLA Rules Engine', targetTab: 'v3_architecture', rolesAllowed: ['Workshop Manager', 'Senior Biomedical Engineer', 'Senior Service Engineer'] },
        { id: 'adm-not', label: 'Notification Rules', targetTab: 'v3_architecture', rolesAllowed: ['Workshop Manager', 'Documentation Officer'] },
        { id: 'adm-v4', label: '🌟 V4 Design System Hub', targetTab: 'v4_design_system', rolesAllowed: ['ALL'] },
        { id: 'adm-v3', label: 'V3 Enterprise Hub', targetTab: 'v3_architecture', rolesAllowed: ['ALL'] },
        { id: 'adm-v2', label: 'V2 Architect Hub', targetTab: 'architect', rolesAllowed: ['ALL'] }
      ]
    },
    {
      category: 'Reports',
      icon: FileText,
      items: [
        { id: 'rep-all', label: 'Service & ISO Reports', targetTab: 'v3_architecture', rolesAllowed: ['ALL'] }
      ]
    }
  ];

  const userRole = currentUser.role;

  return (
    <aside className="w-64 bg-[#0054A6] text-white flex flex-col justify-between shrink-0 select-none shadow-xl border-r border-[#0077C8]/25 h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Branding Title */}
        <div className="p-5 border-b border-[#0077C8]/20 bg-[#003B75] shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-[#00AEEF] font-mono text-[10px] uppercase font-bold tracking-widest block">AVON PHARMO CHEM</h2>
            <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
              V3 RBAC
            </span>
          </div>
          <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" /> ServicePro
          </h1>
          <span className="text-[9px] font-sans text-gray-300 block italic leading-tight mt-1">
            ENTERPRISE ARCHITECTURE V3
          </span>
        </div>

        {/* Categorized Navigation Accordions */}
        <nav className="p-3 space-y-1.5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-blue-800">
          {menuCategories.map(cat => {
            const CatIcon = cat.icon;
            const isExpanded = expandedCats[cat.category];

            // Filter items visible to active userRole
            const visibleItems = cat.items.filter(item => {
              if (item.rolesAllowed.includes('ALL')) return true;
              return item.rolesAllowed.includes(userRole) || userRole === 'Workshop Manager' || userRole === 'Senior Biomedical Engineer';
            });

            if (visibleItems.length === 0) return null;

            const hasActiveItem = visibleItems.some(i => i.targetTab === currentTab && (currentTab !== 'service' || i.id === 'ops-wsv' || i.id === 'com-quo'));

            return (
              <div key={cat.category} className="rounded-xl overflow-hidden border border-white/5 bg-[#00478F]/40 transition-all">
                <button
                  onClick={() => toggleCat(cat.category)}
                  className={`w-full text-left p-2.5 flex items-center justify-between text-xs font-bold font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    hasActiveItem ? 'bg-[#003B75] text-[#00AEEF]' : 'text-blue-100 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2 font-sans font-extrabold text-white">
                    <CatIcon className={`w-4 h-4 shrink-0 ${hasActiveItem ? 'text-[#00AEEF]' : 'text-cyan-200'}`} />
                    <span className="text-xs tracking-normal">{cat.category}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono bg-blue-950/60 text-blue-200 px-1.5 py-0.2 rounded">
                      {visibleItems.length}
                    </span>
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-blue-200" /> : <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                  </span>
                </button>

                {isExpanded && (
                  <div className="p-1 space-y-0.5 bg-[#003366]/60 border-t border-white/5 pl-3">
                    {visibleItems.map(item => {
                      const isActive = currentTab === item.targetTab && (
                        (item.targetTab !== 'service' && item.targetTab !== 'v3_architecture' && item.targetTab !== 'dashboard') ||
                        (currentTab === 'v3_architecture' && item.targetTab === 'v3_architecture') ||
                        (currentTab === 'dashboard' && item.targetTab === 'dashboard') ||
                        (currentTab === 'service' && item.targetTab === 'service')
                      );

                      return (
                        <button
                          key={item.id}
                          id={`sidebar-item-${item.id}`}
                          onClick={() => onTabChange(item.targetTab)}
                          className={`w-full text-left py-2 px-2.5 rounded-lg flex items-center justify-between text-xs font-bold font-sans transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-[#0077C8] text-white shadow-xs font-black pl-3' 
                              : 'text-blue-200 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {item.id === 'ops-wsv' && unreadCount > 0 && (
                            <span className="bg-[#DC2626] text-white h-4 min-w-4 flex items-center justify-center rounded-full text-[9px] font-mono leading-none border border-white px-1">
                              {unreadCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User Context Footer display */}
      <div className="p-3.5 bg-[#003B75] border-t border-[#0077C8]/25 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#0077C8] border border-cyan-300 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0 shadow-sm">
          {currentUser.avatar || currentUser.role.slice(0, 2)}
        </div>
        <div className="truncate text-xs flex-1">
          <p className="font-bold text-white truncate leading-snug">{currentUser.name}</p>
          <span className="text-[10px] font-mono text-[#00AEEF] block italic leading-none mt-0.5 truncate">{currentUser.role}</span>
        </div>
      </div>
    </aside>
  );
}
