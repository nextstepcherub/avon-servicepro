import React, { useState } from 'react';
import { CustomerProfile, JobRecord, InstrumentAsset, AmcContract, UserProfile, CustomerContact } from '../types';
import { 
  Building2, 
  Phone, 
  Compass, 
  ArrowUpRight, 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit3, 
  Clock, 
  Activity, 
  CheckCircle2, 
  Award, 
  DollarSign, 
  X, 
  ChevronRight, 
  Layers, 
  Calendar, 
  ShieldAlert, 
  MessageSquare, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Mail,
  UserCheck,
  Star,
  Check,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LANKA_PROVINCES = [
  'Western Province', 
  'Central Province', 
  'Southern Province', 
  'North Western Province', 
  'Sabaragamuwa Province', 
  'Eastern Province', 
  'Northern Province'
];

const LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 
  'Galle', 'Matara', 'Hambantota', 'Kurunegala', 'Puttalam', 
  'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Moneragala',
  'Ratnapura', 'Kegalle', 'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu',
  'Batticaloa', 'Ampara', 'Trincomalee'
];

interface CustomerDirectoryProps {
  customers: CustomerProfile[];
  jobs: JobRecord[];
  assets: InstrumentAsset[];
  activeUser: UserProfile;
  onUpdateCustomers: (updatedCustomers: CustomerProfile[]) => void;
}

export default function CustomerDirectory({ 
  customers, 
  jobs, 
  assets, 
  activeUser, 
  onUpdateCustomers 
}: CustomerDirectoryProps) {
  
  // Search and Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [npsFilter, setNpsFilter] = useState('All');
  const [contractFilter, setContractFilter] = useState('All');
  const [densityFilter, setDensityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');

  // Modal control states
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerProfile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<CustomerProfile | null>(null);
  const [historyTab, setHistoryTab] = useState<'assets' | 'jobs' | 'contracts' | 'feedback' | 'contacts'>('assets');

  // Form states for Create/Edit Customer
  const [formName, setFormName] = useState('');
  const [formProvince, setFormProvince] = useState('Western Province');
  const [formDistrict, setFormDistrict] = useState('Colombo');
  const [formLiaisonName, setFormLiaisonName] = useState('');
  const [formLiaisonContact, setFormLiaisonContact] = useState('');
  const [formDepartments, setFormDepartments] = useState<string[]>([]);
  const [newDeptInput, setNewDeptInput] = useState('');
  const [formContacts, setFormContacts] = useState<CustomerContact[]>([]);
  
  // State to add a new contact item inside Form
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactLocation, setContactLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactIsDefault, setContactIsDefault] = useState(false);

  // States for dedicated Contacts tab CRUD in History modal
  const [editingHistContact, setEditingHistContact] = useState<CustomerContact | null>(null);
  const [isAddingHistContact, setIsAddingHistContact] = useState(false);
  const [histContactSearch, setHistContactSearch] = useState('');

  // Form states for adding AMC contract to customer
  const [showAddContractForm, setShowAddContractForm] = useState(false);
  const [contractNo, setContractNo] = useState('');
  const [contractStart, setContractStart] = useState('');
  const [contractEnd, setContractEnd] = useState('');
  const [contractInterval, setContractInterval] = useState<'3 Months' | '6 Months' | '1 Year'>('6 Months');
  const [contractPrice, setContractPrice] = useState('');

  // Check role permission for customer edits
  const allowedRoles = ['System Admin', 'Admin', 'Service Manager', 'Workshop Manager', 'Documentation Officer'];
  const hasWritePermission = allowedRoles.includes(activeUser.role);

  // Helper: Open add customer
  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormProvince('Western Province');
    setFormDistrict('Colombo');
    setFormLiaisonName('');
    setFormLiaisonContact('');
    setFormDepartments([]);
    setFormContacts([]);
    setShowAddEditModal(true);
  };

  // Helper: Open edit customer
  const handleOpenEdit = (cust: CustomerProfile, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering details modal if clicked card
    setEditingCustomer(cust);
    setFormName(cust.name);
    setFormProvince(cust.province || 'Western Province');
    setFormDistrict(cust.district || 'Colombo');
    setFormLiaisonName(cust.liaisonName || '');
    setFormLiaisonContact(cust.liaisonContact || '');
    setFormDepartments([...cust.departments]);
    setFormContacts(cust.endUsers.map(u => ({ ...u })));
    setShowAddEditModal(true);
  };

  // Helper: Delete Customer
  const handleDeleteCustomer = (id: string) => {
    const updated = customers.filter(c => c.id !== id);
    onUpdateCustomers(updated);
    setShowDeleteConfirm(null);
    if (showHistoryModal?.id === id) {
      setShowHistoryModal(null);
    }
  };

  // Form logic: Add department tag
  const handleAddDept = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newDeptInput.trim()) {
      e.preventDefault();
      if (!formDepartments.includes(newDeptInput.trim())) {
        setFormDepartments([...formDepartments, newDeptInput.trim()]);
      }
      setNewDeptInput('');
    }
  };

  const handleAddDeptBtn = () => {
    if (newDeptInput.trim()) {
      if (!formDepartments.includes(newDeptInput.trim())) {
        setFormDepartments([...formDepartments, newDeptInput.trim()]);
      }
      setNewDeptInput('');
    }
  };

  const handleRemoveDept = (dept: string) => {
    setFormDepartments(formDepartments.filter(d => d !== dept));
  };

  // Form logic: Add contact item (customer_contacts)
  const handleAddContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) return;
    
    const newContactId = `con_${Date.now().toString().substring(8)}_${Math.random().toString(36).substring(2, 5)}`;
    
    let updatedContacts = [...formContacts];
    if (contactIsDefault) {
      updatedContacts = formContacts.map(c => ({ ...c, isDefault: false }));
    }
    
    const isFirstContact = formContacts.length === 0;

    setFormContacts([
      ...updatedContacts,
      {
        id: newContactId,
        name: contactName.trim(),
        contact: contactPhone.trim(),
        location: contactLocation.trim() || 'Main Wing',
        email: contactEmail.trim(),
        role: contactRole.trim() || 'Other',
        isDefault: contactIsDefault || isFirstContact
      }
    ]);
    
    setContactName('');
    setContactPhone('');
    setContactLocation('');
    setContactEmail('');
    setContactRole('');
    setContactIsDefault(false);
  };

  const handleRemoveContact = (index: number) => {
    setFormContacts(formContacts.filter((_, i) => i !== index));
  };

  // Form logic: Submit Customer
  const handleSubmitCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formProvince.trim() || !formDistrict.trim() || !formLiaisonName.trim() || !formLiaisonContact.trim()) {
      return;
    }

    if (editingCustomer) {
      // Update existing
      const updated = customers.map(c => {
        if (c.id === editingCustomer.id) {
          return {
            ...c,
            name: formName.trim(),
            province: formProvince.trim(),
            district: formDistrict.trim(),
            liaisonName: formLiaisonName.trim(),
            liaisonContact: formLiaisonContact.trim(),
            departments: formDepartments,
            endUsers: formContacts.map(fc => ({
              id: fc.id || `con_${Date.now().toString().substring(8)}_${Math.random().toString(36).substring(2, 5)}`,
              name: fc.name,
              contact: fc.contact,
              location: fc.location,
              email: fc.email || '',
              role: fc.role || 'Other',
              isDefault: !!fc.isDefault
            }))
          };
        }
        return c;
      });
      onUpdateCustomers(updated);
    } else {
      // Create new customer
      const newCust: CustomerProfile = {
        id: `cust_${Date.now().toString().substring(8)}`,
        name: formName.trim(),
        province: formProvince.trim(),
        district: formDistrict.trim(),
        liaisonName: formLiaisonName.trim(),
        liaisonContact: formLiaisonContact.trim(),
        departments: formDepartments,
        endUsers: formContacts.map(fc => ({
          id: fc.id || `con_${Date.now().toString().substring(8)}_${Math.random().toString(36).substring(2, 5)}`,
          name: fc.name,
          contact: fc.contact,
          location: fc.location,
          email: fc.email || '',
          role: fc.role || 'Other',
          isDefault: !!fc.isDefault
        })),
        installedEquipmentCount: 0,
        totalRevenue: 0,
        activeContracts: 0,
        feedbackNpsAverage: 10.0, // baseline
        contracts: []
      };
      onUpdateCustomers([newCust, ...customers]);
    }

    setShowAddEditModal(false);
  };

  // Add AMC Contract to specific customer history
  const handleAddContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showHistoryModal || !contractNo.trim() || !contractStart || !contractEnd) return;

    const newContract: AmcContract = {
      id: `con_${Date.now().toString().substring(8)}`,
      contractNumber: contractNo.trim(),
      startDate: contractStart,
      endDate: contractEnd,
      pmInterval: contractInterval,
      status: 'Active',
      price: parseFloat(contractPrice) || 0
    };

    const updated = customers.map(c => {
      if (c.id === showHistoryModal.id) {
        const contractsList = c.contracts ? [...c.contracts, newContract] : [newContract];
        return {
          ...c,
          contracts: contractsList,
          activeContracts: contractsList.filter(con => con.status === 'Active').length
        };
      }
      return c;
    });

    onUpdateCustomers(updated);
    
    // Update the history modal preview
    const updatedCust = updated.find(c => c.id === showHistoryModal.id);
    if (updatedCust) {
      setShowHistoryModal(updatedCust);
    }

    // Reset contract form
    setShowAddContractForm(false);
    setContractNo('');
    setContractStart('');
    setContractEnd('');
    setContractInterval('6 Months');
    setContractPrice('');
  };

  // Filter & Search Logic
  const filteredCustomers = customers.filter(cust => {
    // 1. Search text
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      cust.name.toLowerCase().includes(query) ||
      cust.departments.some(d => d.toLowerCase().includes(query)) ||
      cust.endUsers.some(u => 
        u.name.toLowerCase().includes(query) || 
        u.contact.includes(searchTerm) ||
        (u.email || '').toLowerCase().includes(query) ||
        (u.role || '').toLowerCase().includes(query)
      );

    // 2. NPS Filter
    let matchesNps = true;
    if (npsFilter === 'Excellent') matchesNps = cust.feedbackNpsAverage >= 9.0;
    else if (npsFilter === 'Good') matchesNps = cust.feedbackNpsAverage >= 8.0 && cust.feedbackNpsAverage < 9.0;
    else if (npsFilter === 'Critical') matchesNps = cust.feedbackNpsAverage < 8.0;

    // 3. Contract Filter
    let matchesContract = true;
    const hasActiveContract = cust.contracts && cust.contracts.some(c => c.status === 'Active');
    if (contractFilter === 'Active') matchesContract = !!hasActiveContract;
    else if (contractFilter === 'None') matchesContract = !hasActiveContract;

    // 4. Density Filter (Installed devices)
    let matchesDensity = true;
    const deviceCount = assets.filter(a => a.customerName.toLowerCase() === cust.name.toLowerCase()).length;
    if (densityFilter === 'High') matchesDensity = deviceCount >= 5;
    else if (densityFilter === 'Medium') matchesDensity = deviceCount >= 1 && deviceCount < 5;
    else if (densityFilter === 'None') matchesDensity = deviceCount === 0;

    return matchesSearch && matchesNps && matchesContract && matchesDensity;
  }).sort((a, b) => {
    // Sorting
    const aDevices = assets.filter(ast => ast.customerName.toLowerCase() === a.name.toLowerCase()).length;
    const bDevices = assets.filter(ast => ast.customerName.toLowerCase() === b.name.toLowerCase()).length;
    
    const aRevenue = jobs
      .filter(j => j.customerName.toLowerCase() === a.name.toLowerCase())
      .reduce((sum, j) => sum + (j.installationData?.invoiceValue || 0) + (j.nonWarrantyData?.quotationPrice || 0) + (j.workshopJobData?.pricingServiceRepair || 0), 0);
    const bRevenue = jobs
      .filter(j => j.customerName.toLowerCase() === b.name.toLowerCase())
      .reduce((sum, j) => sum + (j.installationData?.invoiceValue || 0) + (j.nonWarrantyData?.quotationPrice || 0) + (j.workshopJobData?.pricingServiceRepair || 0), 0);

    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    if (sortBy === 'nps-desc') return b.feedbackNpsAverage - a.feedbackNpsAverage;
    if (sortBy === 'devices-desc') return bDevices - aDevices;
    if (sortBy === 'revenue-desc') return bRevenue - aRevenue;
    return 0;
  });

  // Summary Metrics calculation
  const totalCustomersCount = customers.length;
  const activeContractsCount = customers.reduce((sum, c) => sum + (c.contracts?.filter(con => con.status === 'Active').length || 0), 0);
  const averageNpsScore = customers.length > 0 
    ? (customers.reduce((sum, c) => sum + c.feedbackNpsAverage, 0) / customers.length).toFixed(1) 
    : '10.0';

  const totalIndexedRevenueValue = jobs.reduce((sum, j) => {
    const value = (j.installationData?.invoiceValue || 0) + 
                  (j.nonWarrantyData?.quotationPrice || 0) + 
                  (j.workshopJobData?.pricingServiceRepair || 0) + 
                  (j.calibrationData?.invoiceAmount || 0);
    return sum + value;
  }, 0);

  return (
    <div id="customer_directory_container" className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Module</h1>
          <p className="text-sm text-slate-500">Manage client medical centers, clinical networks, dynamic handshakes, and check historical service logs</p>
        </div>
        
        {hasWritePermission ? (
          <button 
            id="btn_add_customer"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Customer Center
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 text-[11px] font-mono px-3 py-1.5 rounded-lg">
            <UserCheck className="w-4 h-4 text-slate-400" /> Read-Only Workspace Profile
          </div>
        )}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Client Centers</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-800">{totalCustomersCount}</span>
            <span className="text-[10px] text-slate-400 block mt-1">Hospitals & laboratories indexed</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active AMC Contracts</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-700">{activeContractsCount}</span>
            <span className="text-[10px] text-slate-400 block mt-1">Preventive maintenance covered</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Customer NPS</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-amber-700">{averageNpsScore} <span className="text-sm font-bold text-slate-400">/ 10</span></span>
            <span className="text-[10px] text-slate-400 block mt-1">Aggregated rating index</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Logged Revenue</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-800">LKR {(totalIndexedRevenueValue / 1000000).toFixed(2)}M</span>
            <span className="text-[10px] text-slate-400 block mt-1">Installations & service repair fees</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row gap-3">
          
          {/* Search text */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by center name, departments, or contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-xl outline-hidden transition-all text-slate-800"
            />
          </div>

          {/* Filtering Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            
            {/* NPS score filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 rounded-xl">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={npsFilter}
                onChange={(e) => setNpsFilter(e.target.value)}
                className="w-full bg-transparent border-none outline-hidden py-1.5 text-[11px] text-slate-700"
              >
                <option value="All">NPS: All Ratings</option>
                <option value="Excellent">Excellent (9.0+)</option>
                <option value="Good">Good (8.0 - 8.9)</option>
                <option value="Critical">Improvement Needed (&lt; 8.0)</option>
              </select>
            </div>

            {/* Contract status filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 rounded-xl">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={contractFilter}
                onChange={(e) => setContractFilter(e.target.value)}
                className="w-full bg-transparent border-none outline-hidden py-1.5 text-[11px] text-slate-700"
              >
                <option value="All">AMC Coverage: All</option>
                <option value="Active">Has Active AMC</option>
                <option value="None">No Active AMC</option>
              </select>
            </div>

            {/* Equipment density filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 rounded-xl">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={densityFilter}
                onChange={(e) => setDensityFilter(e.target.value)}
                className="w-full bg-transparent border-none outline-hidden py-1.5 text-[11px] text-slate-700"
              >
                <option value="All">Equipment Count: All</option>
                <option value="High">High Density (5+ Devices)</option>
                <option value="Medium">Medium Density (1-4 Devices)</option>
                <option value="None">Empty Installed (0 Devices)</option>
              </select>
            </div>

            {/* Sort options */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 rounded-xl">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent border-none outline-hidden py-1.5 text-[11px] text-slate-700"
              >
                <option value="name-asc">Sort: Name (A-Z)</option>
                <option value="name-desc">Sort: Name (Z-A)</option>
                <option value="nps-desc">Highest NPS Rating</option>
                <option value="devices-desc">Most Installed Equipment</option>
                <option value="revenue-desc">Highest Total Revenue</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Customer Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No Customers Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, sorting parameters, or filtration options to fetch corresponding medical centers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((cust) => {
            // Live calculated stats
            const customerAssets = assets.filter(a => a.customerName.toLowerCase() === cust.name.toLowerCase());
            const customerJobs = jobs.filter(j => j.customerName.toLowerCase() === cust.name.toLowerCase());
            
            // Calculate actual total billing recorded for customer
            const calculatedRevenue = customerJobs.reduce((sum, j) => {
              const value = (j.installationData?.invoiceValue || 0) + 
                            (j.nonWarrantyData?.quotationPrice || 0) + 
                            (j.workshopJobData?.pricingServiceRepair || 0) + 
                            (j.calibrationData?.invoiceAmount || 0);
              return sum + value;
            }, 0);

            const hasActiveAmc = cust.contracts && cust.contracts.some(con => con.status === 'Active');

            return (
              <motion.div 
                key={cust.id} 
                layoutId={`card_${cust.id}`}
                onClick={() => setShowHistoryModal(cust)}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-sm block">
                        {cust.id}
                      </span>
                      <span className={`text-[10px] font-bold block mt-1 ${
                        cust.feedbackNpsAverage >= 9.0 ? 'text-emerald-600' :
                        cust.feedbackNpsAverage >= 8.0 ? 'text-amber-600' : 'text-rose-500'
                      }`}>
                        ★ NPS Ave: {cust.feedbackNpsAverage.toFixed(1)}/10
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {cust.name}
                  </h3>

                  {/* Departments */}
                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Indexed Departments</span>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {cust.departments.length > 0 ? (
                          cust.departments.slice(0, 3).map((dept) => (
                            <span key={dept} className="bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded-md border border-slate-100">
                              {dept}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">No departments indexed</span>
                        )}
                        {cust.departments.length > 3 && (
                          <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-md font-bold">
                            +{cust.departments.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contacts list summary (customer_contacts) */}
                    <div className="border-t border-slate-50 pt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contacts / End-Users</span>
                      <div className="space-y-1.5 mt-2">
                        {cust.endUsers.length > 0 ? (
                          (() => {
                            // Sort default contact to the top of the card preview
                            const sortedContacts = [...cust.endUsers].sort((a, b) => {
                              const aDef = !!a.isDefault;
                              const bDef = !!b.isDefault;
                              if (aDef && !bDef) return -1;
                              if (!aDef && bDef) return 1;
                              return 0;
                            });

                            return sortedContacts.slice(0, 2).map((user, idx) => (
                              <div key={idx} className={`flex justify-between items-center p-2 rounded-lg text-[10px] border ${
                                user.isDefault 
                                  ? 'bg-amber-50/50 border-amber-100' 
                                  : 'bg-slate-50/75 border-transparent'
                              }`}>
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-700 block">{user.name}</span>
                                    {user.role && (
                                      <span className="bg-blue-50 text-blue-700 text-[7px] px-1 rounded-sm scale-90 font-semibold origin-left">
                                        {user.role}
                                      </span>
                                    )}
                                    {user.isDefault && (
                                      <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                    )}
                                  </div>
                                  <span className="text-slate-400 block text-[9px]">{user.location}</span>
                                </div>
                                <span className="text-slate-500 font-medium flex items-center gap-0.5">
                                  <Phone className="w-2.5 h-2.5 text-blue-500" /> {user.contact}
                                </span>
                              </div>
                            ));
                          })()
                        ) : (
                          <span className="text-slate-400 text-[10px] italic block">No registered contacts</span>
                        )}
                        {cust.endUsers.length > 2 && (
                          <span className="text-[9px] font-bold text-blue-500 block text-right">
                            +{cust.endUsers.length - 2} more primary handshakes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid stats & actions */}
                <div className="mt-5">
                  <div className="grid grid-cols-3 gap-2 text-center bg-slate-50/50 p-2 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase block">Installed</span>
                      <span className="text-xs font-black text-slate-800">{customerAssets.length} Assets</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase block">Worksheets</span>
                      <span className="text-xs font-black text-slate-800">{customerJobs.length} Jobs</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase block">AMC Status</span>
                      <span className={`text-[10px] font-black uppercase ${hasActiveAmc ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {hasActiveAmc ? 'Covered' : 'None'}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Buttons */}
                  <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setShowHistoryModal(cust)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      History <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    {hasWritePermission && (
                      <>
                        <button
                          onClick={(e) => handleOpenEdit(cust, e)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Edit Customer Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(cust.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Delete Customer Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE & EDIT CUSTOMER MODAL */}
      <AnimatePresence>
        {showAddEditModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl border border-slate-100 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                <div>
                  <h3 className="font-extrabold text-base">
                    {editingCustomer ? `Edit Profile: ${editingCustomer.name}` : 'Index New Medical Center'}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Define departments, regional nodes, and primary client contacts</p>
                </div>
                <button 
                  onClick={() => setShowAddEditModal(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitCustomer} className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Hospital / Clinic name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Medical Institution Name *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Asiri Surgical Hospital, ITI Analysis Lab"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-xl outline-hidden text-slate-800 font-semibold"
                  />
                </div>

                {/* Province & District dropdown validation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Province *
                    </label>
                    <select
                      required
                      value={formProvince}
                      onChange={(e) => setFormProvince(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-xl outline-hidden text-slate-800 font-semibold"
                    >
                      {LANKA_PROVINCES.map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      District *
                    </label>
                    <select
                      required
                      value={formDistrict}
                      onChange={(e) => setFormDistrict(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-xl outline-hidden text-slate-800 font-semibold"
                    >
                      {LANKA_DISTRICTS.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Primary Liaison Handshakes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Primary Liaison Name *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Dr. Priyantha Silva"
                      value={formLiaisonName}
                      onChange={(e) => setFormLiaisonName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-xl outline-hidden text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Primary Liaison Contact *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. +94 77 123 4567"
                      value={formLiaisonContact}
                      onChange={(e) => setFormLiaisonContact(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-xl outline-hidden text-slate-800 font-semibold font-mono"
                    />
                  </div>
                </div>

                {/* Departments manager */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Indexed Departments
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="e.g. Haematology, Clinical Pathology (Press Enter or Add)"
                      value={newDeptInput}
                      onChange={(e) => setNewDeptInput(e.target.value)}
                      onKeyDown={handleAddDept}
                      className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-xl outline-hidden text-slate-800"
                    />
                    <button 
                      type="button"
                      onClick={handleAddDeptBtn}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Department Tags list */}
                  <div className="flex gap-1.5 flex-wrap mt-2.5">
                    {formDepartments.map((dept) => (
                      <span 
                        key={dept} 
                        className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-blue-100"
                      >
                        {dept}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveDept(dept)}
                          className="text-blue-500 hover:text-blue-800 font-extrabold"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    {formDepartments.length === 0 && (
                      <span className="text-[10px] text-slate-400 italic">No departments specified. Enter above.</span>
                    )}
                  </div>
                </div>

                {/* Contacts creator (customer_contacts) */}
                <div className="border-t border-slate-100 pt-4">
                  <span className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                    Customer Contacts & Bio-Medical Handshakes (customer_contacts)
                  </span>

                  {/* Sub-form inputs to add a contact */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Contact Name *</label>
                      <input 
                        type="text"
                        placeholder="e.g. Dr. Priyantha Silva"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Contact Phone *</label>
                      <input 
                        type="text"
                        placeholder="e.g. +94771234567"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Contact Email</label>
                      <input 
                        type="email"
                        placeholder="e.g. priyantha@hospital.lk"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Contact Type / Role</label>
                      <select 
                        value={contactRole}
                        onChange={(e) => setContactRole(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden text-slate-800 text-slate-700 font-medium"
                      >
                        <option value="">Select Contact Type</option>
                        <option value="Biomedical Engineer">Biomedical Engineer</option>
                        <option value="Lab Technician">Lab Technician</option>
                        <option value="Doctor / Consultant">Doctor / Consultant</option>
                        <option value="Nurse In-charge">Nurse In-charge</option>
                        <option value="Procurement Officer">Procurement Officer</option>
                        <option value="Hospital Administrator">Hospital Administrator</option>
                        <option value="Laboratory Director">Laboratory Director</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Location / Lab Section</label>
                      <input 
                        type="text"
                        placeholder="e.g. Block B, 2nd Floor"
                        value={contactLocation}
                        onChange={(e) => setContactLocation(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden text-slate-800"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <input 
                        type="checkbox"
                        id="form_contact_default"
                        checked={contactIsDefault}
                        onChange={(e) => setContactIsDefault(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="form_contact_default" className="text-xs font-bold text-slate-600 flex items-center gap-1 cursor-pointer">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Set as Default/Main Contact
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex justify-end pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleAddContact}
                        disabled={!contactName.trim() || !contactPhone.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Append Contact
                      </button>
                    </div>
                  </div>

                  {/* Added list */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {formContacts.map((contact, index) => (
                      <div key={index} className={`flex justify-between items-center p-3 rounded-xl border ${
                        contact.isDefault 
                          ? 'bg-amber-50/50 border-amber-200' 
                          : 'bg-slate-50/70 border-slate-100'
                      }`}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-800">{contact.name}</span>
                            {contact.role && (
                              <span className="bg-blue-100 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 rounded-sm">
                                {contact.role}
                              </span>
                            )}
                            {contact.isDefault && (
                              <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Default
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400">
                            <span>Loc: {contact.location}</span>
                            {contact.email && <span>• Email: {contact.email}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-600 font-mono font-medium">{contact.contact}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveContact(index)}
                            className="text-rose-500 hover:text-rose-700 p-1.5 bg-white hover:bg-rose-50 border border-slate-100 rounded-md transition-all shadow-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {formContacts.length === 0 && (
                      <div className="text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">
                        <span className="text-[10px] text-slate-400 italic block">No contacts recorded. Fill inputs above to register a contact handshake.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase px-4 py-2.5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase px-6 py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    {editingCustomer ? 'Update Profile' : 'Save Customer Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-100 shadow-xl"
            >
              <div className="flex gap-3 items-start">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">Confirm Profile Deletion</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Are you sure you want to delete this customer center? This will sever all indexed relationships, contact phone lists, and active service contracts associated with this profile in this directory.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase px-4 py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCustomer(showDeleteConfirm)}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase px-5 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOMER HISTORY / DETAILS MODAL */}
      <AnimatePresence>
        {showHistoryModal && (() => {
          // Live calculation of history elements
          const customerAssets = assets.filter(a => a.customerName.toLowerCase() === showHistoryModal.name.toLowerCase());
          const customerJobs = jobs.filter(j => j.customerName.toLowerCase() === showHistoryModal.name.toLowerCase());
          
          // Total billing calculations
          const billingRevenue = customerJobs.reduce((sum, j) => {
            const value = (j.installationData?.invoiceValue || 0) + 
                          (j.nonWarrantyData?.quotationPrice || 0) + 
                          (j.workshopJobData?.pricingServiceRepair || 0) + 
                          (j.calibrationData?.invoiceAmount || 0);
            return sum + value;
          }, 0);

          return (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-5xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header Profile Info */}
                <div className="bg-slate-950 px-8 py-6 text-white relative">
                  <button 
                    onClick={() => setShowHistoryModal(null)}
                    className="absolute right-6 top-6 p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pr-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-2.5 py-0.5 rounded-md">
                          {showHistoryModal.id}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          showHistoryModal.feedbackNpsAverage >= 9.0 ? 'bg-emerald-500/20 text-emerald-300' :
                          showHistoryModal.feedbackNpsAverage >= 8.0 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          ★ Average NPS: {showHistoryModal.feedbackNpsAverage.toFixed(1)}/10
                        </span>
                      </div>
                      <h2 className="text-2xl font-black tracking-tight">{showHistoryModal.name}</h2>
                      
                      {/* Contacts list */}
                      <div className="flex gap-4 items-center flex-wrap pt-2 text-xs text-slate-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-slate-500" />
                          <span>Colombo Regional Handshakes</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-slate-500" />
                          <span>{showHistoryModal.endUsers.length} Key Contacts</span>
                        </div>
                      </div>
                    </div>

                    {/* Overall metrics inside details header */}
                    <div className="grid grid-cols-3 gap-4 text-center border border-slate-800 bg-slate-900/45 p-4 rounded-2xl w-full md:w-auto">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Assets</span>
                        <span className="text-sm font-black text-white">{customerAssets.length} Installed</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Worksheets</span>
                        <span className="text-sm font-black text-white">{customerJobs.length} Logs</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">LKR Billings</span>
                        <span className="text-sm font-black text-emerald-400">{(billingRevenue / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs for History segments */}
                <div className="bg-slate-50 border-b border-slate-100 px-6 flex gap-1">
                  {[
                    { id: 'assets', label: 'Installed Assets', icon: Layers, count: customerAssets.length },
                    { id: 'jobs', label: 'Service Jobs Log', icon: Activity, count: customerJobs.length },
                    { id: 'contracts', label: 'AMC PM Contracts', icon: Calendar, count: showHistoryModal.contracts?.length || 0 },
                    { id: 'feedback', label: 'CSAT & NPS History', icon: MessageSquare, count: customerJobs.filter(j => j.feedback).length },
                    { id: 'contacts', label: 'Contacts Directory', icon: UserCheck, count: showHistoryModal.endUsers.length }
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = historyTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setHistoryTab(tab.id as any)}
                        className={`inline-flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
                          isActive 
                            ? 'border-blue-600 text-blue-600 bg-white' 
                            : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Interactive Content Scroll Panel */}
                <div className="p-6 overflow-y-auto flex-1 max-h-[50vh] bg-slate-50/20">
                  
                  {/* TAB 1: ASSETS */}
                  {historyTab === 'assets' && (
                    <div className="space-y-4">
                      {customerAssets.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">No active laboratory assets are registered under this hospital.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white shadow-xs">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="px-4 py-3">Asset Code</th>
                                <th className="px-4 py-3">Instrument Model</th>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3">Warranty status</th>
                                <th className="px-4 py-3">AMC Status</th>
                                <th className="px-4 py-3">Calibration Due</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-xs">
                              {customerAssets.map(ast => (
                                <tr key={ast.id} className="hover:bg-slate-50/50">
                                  <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-slate-700">
                                    {ast.assetNumber}
                                  </td>
                                  <td className="px-4 py-3.5 font-semibold text-slate-800">
                                    {ast.brand} {ast.model}
                                  </td>
                                  <td className="px-4 py-3.5 text-slate-500">{ast.department}</td>
                                  <td className="px-4 py-3.5">
                                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-sm font-semibold">
                                      {ast.warrantyPeriodMonths} mos
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5">
                                    <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase ${
                                      ast.amcStatus === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                      {ast.amcStatus || 'None'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 font-mono text-slate-500">{ast.calibrationDue || 'N/A'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: JOBS LOG */}
                  {historyTab === 'jobs' && (
                    <div className="space-y-3">
                      {customerJobs.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                          <Activity className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">No previous service worksheets or calibration logs recorded.</p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {customerJobs.map(j => (
                            <div key={j.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex justify-between items-center">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded">
                                    {j.id}
                                  </span>
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                                    j.jobType === 'Installation' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                    j.jobType === 'Warranty Service' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                    j.jobType === 'Calibration' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                  }`}>
                                    {j.jobType}
                                  </span>
                                  <span className={`text-[9px] font-bold uppercase ${
                                    j.priority === 'Emergency' ? 'text-rose-600' : 'text-slate-400'
                                  }`}>
                                    ({j.priority})
                                  </span>
                                </div>
                                <h4 className="text-xs font-black text-slate-800 pt-0.5">
                                  {j.brand} {j.model} ({j.serialNumber})
                                </h4>
                                <span className="text-[10px] text-slate-400 block">
                                  Logged at {new Date(j.createdAt).toLocaleDateString()} by {j.assignedEngineerName || 'Unassigned'}
                                </span>
                              </div>

                              <div className="text-right">
                                <span className="text-xs font-bold text-slate-700 block bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                  {j.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: AMC CONTRACTS */}
                  {historyTab === 'contracts' && (
                    <div className="space-y-4">
                      
                      {/* Button to toggle add contract form */}
                      {hasWritePermission && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setShowAddContractForm(!showAddContractForm)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase bg-blue-600 text-white px-3.5 py-2 rounded-xl transition-all hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4" /> {showAddContractForm ? 'Collapse Form' : 'Register AMC Contract'}
                          </button>
                        </div>
                      )}

                      {/* AMC ADD FORM */}
                      <AnimatePresence>
                        {showAddContractForm && (
                          <motion.form 
                            onSubmit={handleAddContract}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm space-y-4 overflow-hidden"
                          >
                            <h4 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">Configure New Maintenance Coverage (AMC)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Contract Number</label>
                                <input 
                                  type="text"
                                  required
                                  placeholder="AMC/HOSP/2026/01"
                                  value={contractNo}
                                  onChange={(e) => setContractNo(e.target.value)}
                                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">PM Interval</label>
                                <select 
                                  value={contractInterval}
                                  onChange={(e) => setContractInterval(e.target.value as any)}
                                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800"
                                >
                                  <option value="3 Months">3 Months</option>
                                  <option value="6 Months">6 Months</option>
                                  <option value="1 Year">1 Year</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Price (LKR)</label>
                                <input 
                                  type="number"
                                  placeholder="e.g. 240000"
                                  value={contractPrice}
                                  onChange={(e) => setContractPrice(e.target.value)}
                                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Start Date</label>
                                <input 
                                  type="date"
                                  required
                                  value={contractStart}
                                  onChange={(e) => setContractStart(e.target.value)}
                                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">End Date</label>
                                <input 
                                  type="date"
                                  required
                                  value={contractEnd}
                                  onChange={(e) => setContractEnd(e.target.value)}
                                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800"
                                />
                              </div>
                              <div className="flex items-end">
                                <button
                                  type="submit"
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors shadow-xs"
                                >
                                  Confirm Registration
                                </button>
                              </div>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {/* List existing contracts */}
                      {!showHistoryModal.contracts || showHistoryModal.contracts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">No Annual Maintenance Contracts (AMC) indexed for this hospital center.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {showHistoryModal.contracts.map(con => (
                            <div key={con.id} className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800 text-xs">{con.contractNumber}</span>
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                  con.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {con.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500">
                                <div>
                                  <span className="block text-[8px] font-bold uppercase text-slate-400">Coverage Duration</span>
                                  <span>{con.startDate} - {con.endDate}</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] font-bold uppercase text-slate-400">PM Cycle</span>
                                  <span>Every {con.pmInterval}</span>
                                </div>
                              </div>
                              <div className="border-t border-slate-50 pt-2 flex justify-between items-center">
                                <span className="text-[10px] text-slate-400">Contract Value:</span>
                                <span className="text-xs font-extrabold text-emerald-700">LKR {con.price.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: FEEDBACK & NPS HISTORY */}
                  {historyTab === 'feedback' && (
                    <div className="space-y-4">
                      {customerJobs.filter(j => j.feedback).length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">No CSAT reviews or QR-triggered NPS feedback recorded for past jobs.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {customerJobs.filter(j => j.feedback).map(j => (
                            <div key={j.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                                    Job: {j.id} ({j.jobType})
                                  </span>
                                  <h4 className="text-xs font-extrabold text-slate-800 mt-1">{j.brand} {j.model}</h4>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-black text-amber-600 block">
                                    NPS: {j.feedback?.nps || 'N/A'}/10
                                  </span>
                                  <span className="text-[9px] text-slate-400">
                                    Rating: {j.feedback?.rating || 'N/A'}/5
                                  </span>
                                </div>
                              </div>
                              {j.feedback?.comments && (
                                <p className="text-xs italic bg-slate-50 p-2.5 rounded-lg text-slate-600 border border-slate-100">
                                  "{j.feedback.comments}"
                                </p>
                              )}
                              <div className="text-[9px] text-slate-400 text-right">
                                Submitted on {new Date(j.feedback?.submittedAt || '').toLocaleDateString()} 
                                {j.feedback?.qrCodeTriggered && ' via QR Likert Sheet'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: CONTACTS DIRECTORY (customer_contacts CRUD) */}
                  {historyTab === 'contacts' && (
                    <div className="space-y-4">
                      {/* Search & Actions Bar */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100">
                        <div className="relative flex-1 w-full">
                          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <input 
                            type="text"
                            placeholder="Search contacts by name, role, email, phone or location..."
                            value={histContactSearch}
                            onChange={(e) => setHistContactSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-xl outline-hidden text-slate-800"
                          />
                        </div>
                        {hasWritePermission && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingHistContact(null);
                              setIsAddingHistContact(!isAddingHistContact);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase bg-blue-600 text-white px-4 py-2.5 rounded-xl transition-all hover:bg-blue-700 w-full sm:w-auto justify-center"
                          >
                            <UserPlus className="w-4 h-4" /> {isAddingHistContact ? 'Close Form' : 'Add Contact'}
                          </button>
                        )}
                      </div>

                      {/* Add/Edit Contact Form */}
                      <AnimatePresence>
                        {(isAddingHistContact || editingHistContact) && (() => {
                          const isEdit = !!editingHistContact;
                          
                          // Form submission inside History Modal Tab
                          const handleHistContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const fd = new FormData(form);
                            const name = fd.get('cName') as string;
                            const phone = fd.get('cPhone') as string;
                            const email = fd.get('cEmail') as string;
                            const role = fd.get('cRole') as string;
                            const location = fd.get('cLocation') as string;
                            const isDefault = fd.get('cIsDefault') === 'on';

                            if (!name.trim() || !phone.trim()) return;

                            const targetId = isEdit ? editingHistContact.id : `con_${Date.now().toString().substring(8)}_${Math.random().toString(36).substring(2, 5)}`;

                            let updatedEndUsers = [...showHistoryModal.endUsers];

                            if (isEdit) {
                              // Editing existing
                              updatedEndUsers = updatedEndUsers.map(u => {
                                if (u.id === targetId || (!u.id && u.name === editingHistContact.name && u.contact === editingHistContact.contact)) {
                                  return {
                                    id: targetId,
                                    name: name.trim(),
                                    contact: phone.trim(),
                                    location: location.trim() || 'Main Wing',
                                    email: email.trim(),
                                    role: role || 'Other',
                                    isDefault
                                  };
                                }
                                return u;
                              });
                            } else {
                              // Adding new
                              updatedEndUsers.push({
                                id: targetId,
                                name: name.trim(),
                                contact: phone.trim(),
                                location: location.trim() || 'Main Wing',
                                email: email.trim(),
                                role: role || 'Other',
                                isDefault: isDefault || updatedEndUsers.length === 0
                              });
                            }

                            // If this contact is marked as default, unset other defaults
                            if (isDefault || updatedEndUsers.length === 1) {
                              updatedEndUsers = updatedEndUsers.map(u => ({
                                ...u,
                                isDefault: u.id === targetId || (isEdit && !u.id && u.name === name.trim() && u.contact === phone.trim())
                              }));
                            }

                            // Persist to parent customers state
                            const updatedCustomers = customers.map(cust => {
                              if (cust.id === showHistoryModal.id) {
                                return {
                                  ...cust,
                                  endUsers: updatedEndUsers
                                };
                              }
                              return cust;
                            });

                            onUpdateCustomers(updatedCustomers);
                            
                            // Update local history modal preview
                            const currentCust = updatedCustomers.find(cust => cust.id === showHistoryModal.id);
                            if (currentCust) {
                              setShowHistoryModal(currentCust);
                            }

                            // Reset form states
                            setIsAddingHistContact(false);
                            setEditingHistContact(null);
                          };

                          return (
                            <motion.form 
                              onSubmit={handleHistContactSubmit}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm space-y-4 overflow-hidden"
                            >
                              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <h4 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">
                                  {isEdit ? `Edit Contact: ${editingHistContact.name}` : 'Register New Customer Contact'}
                                </h4>
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    setIsAddingHistContact(false);
                                    setEditingHistContact(null);
                                  }}
                                  className="text-xs text-slate-400 hover:text-slate-600"
                                >
                                  Cancel
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Contact Name *</label>
                                  <input 
                                    name="cName"
                                    type="text"
                                    required
                                    placeholder="e.g. Dr. Priyantha Silva"
                                    defaultValue={isEdit ? editingHistContact.name : ''}
                                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800 font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Contact Phone *</label>
                                  <input 
                                    name="cPhone"
                                    type="text"
                                    required
                                    placeholder="e.g. +94771234567"
                                    defaultValue={isEdit ? editingHistContact.contact : ''}
                                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Contact Email</label>
                                  <input 
                                    name="cEmail"
                                    type="email"
                                    placeholder="e.g. priyantha@hospital.lk"
                                    defaultValue={isEdit ? editingHistContact.email || '' : ''}
                                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Contact Type / Role</label>
                                  <select 
                                    name="cRole"
                                    defaultValue={isEdit ? editingHistContact.role || 'Other' : 'Other'}
                                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800 font-semibold text-slate-700"
                                  >
                                    <option value="Biomedical Engineer">Biomedical Engineer</option>
                                    <option value="Lab Technician">Lab Technician</option>
                                    <option value="Doctor / Consultant">Doctor / Consultant</option>
                                    <option value="Nurse In-charge">Nurse In-charge</option>
                                    <option value="Procurement Officer">Procurement Officer</option>
                                    <option value="Hospital Administrator">Hospital Administrator</option>
                                    <option value="Laboratory Director">Laboratory Director</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Location / Lab Section</label>
                                  <input 
                                    name="cLocation"
                                    type="text"
                                    placeholder="e.g. Block B, 2nd Floor"
                                    defaultValue={isEdit ? editingHistContact.location : ''}
                                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800"
                                  />
                                </div>
                                <div className="flex items-center gap-2 pt-5">
                                  <input 
                                    name="cIsDefault"
                                    type="checkbox"
                                    id="hist_contact_default_chk"
                                    defaultChecked={isEdit ? !!editingHistContact.isDefault : false}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                  />
                                  <label htmlFor="hist_contact_default_chk" className="text-xs font-bold text-slate-600 flex items-center gap-1 cursor-pointer">
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Default / Primary Contact
                                  </label>
                                </div>
                              </div>
                              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAddingHistContact(false);
                                    setEditingHistContact(null);
                                  }}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase px-4 py-2 rounded-xl transition-all"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase px-5 py-2 rounded-xl shadow-xs transition-all"
                                >
                                  {isEdit ? 'Save Changes' : 'Add Contact'}
                                </button>
                              </div>
                            </motion.form>
                          );
                        })()}
                      </AnimatePresence>

                      {/* Contacts List Grid */}
                      {(() => {
                        // Filter contacts by search
                        const filtered = showHistoryModal.endUsers.filter(contact => {
                          const query = histContactSearch.toLowerCase();
                          return (
                            contact.name.toLowerCase().includes(query) ||
                            (contact.role || '').toLowerCase().includes(query) ||
                            (contact.email || '').toLowerCase().includes(query) ||
                            contact.contact.includes(query) ||
                            contact.location.toLowerCase().includes(query)
                          );
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                              <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                              <p className="text-xs text-slate-500">No matching contacts registered for this customer center.</p>
                            </div>
                          );
                        }

                        // Toggle default contact directly in the UI
                        const handleToggleDefault = (contactToToggle: CustomerContact) => {
                          if (!hasWritePermission) return;
                          
                          const targetId = contactToToggle.id;
                          const updatedEndUsers = showHistoryModal.endUsers.map(u => ({
                            ...u,
                            isDefault: u.id === targetId || (!u.id && u.name === contactToToggle.name && u.contact === contactToToggle.contact)
                          }));

                          const updatedCustomers = customers.map(cust => {
                            if (cust.id === showHistoryModal.id) {
                              return { ...cust, endUsers: updatedEndUsers };
                            }
                            return cust;
                          });

                          onUpdateCustomers(updatedCustomers);
                          const currentCust = updatedCustomers.find(cust => cust.id === showHistoryModal.id);
                          if (currentCust) {
                            setShowHistoryModal(currentCust);
                          }
                        };

                        // Delete contact handler
                        const handleHistContactDelete = (contactToDelete: CustomerContact) => {
                          if (!hasWritePermission) return;
                          
                          let updatedEndUsers = showHistoryModal.endUsers.filter(u => {
                            if (contactToDelete.id) {
                              return u.id !== contactToDelete.id;
                            }
                            return !(u.name === contactToDelete.name && u.contact === contactToDelete.contact);
                          });

                          // If the deleted contact was default, make the first remaining contact default
                          if (contactToDelete.isDefault && updatedEndUsers.length > 0) {
                            updatedEndUsers[0] = { ...updatedEndUsers[0], isDefault: true };
                          }

                          const updatedCustomers = customers.map(cust => {
                            if (cust.id === showHistoryModal.id) {
                              return { ...cust, endUsers: updatedEndUsers };
                            }
                            return cust;
                          });

                          onUpdateCustomers(updatedCustomers);
                          const currentCust = updatedCustomers.find(cust => cust.id === showHistoryModal.id);
                          if (currentCust) {
                            setShowHistoryModal(currentCust);
                          }
                        };

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filtered.map((contact, index) => {
                              // Color scheme for contact types
                              const getRoleBadgeStyle = (role?: string) => {
                                const r = (role || '').toLowerCase();
                                if (r.includes('biomedical')) return 'bg-blue-50 text-blue-700 border-blue-100';
                                if (r.includes('tech')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
                                if (r.includes('doc') || r.includes('consultant')) return 'bg-purple-50 text-purple-700 border-purple-100';
                                if (r.includes('nurse')) return 'bg-rose-50 text-rose-700 border-rose-100';
                                if (r.includes('procure') || r.includes('purchas')) return 'bg-amber-50 text-amber-700 border-amber-100';
                                if (r.includes('admin') || r.includes('direct')) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
                                return 'bg-slate-50 text-slate-700 border-slate-100';
                              };

                              return (
                                <div 
                                  key={contact.id || index} 
                                  className={`bg-white p-5 rounded-2xl border transition-all ${
                                    contact.isDefault 
                                      ? 'border-amber-200 shadow-xs ring-1 ring-amber-200/50' 
                                      : 'border-slate-100 hover:border-slate-200'
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1.5 flex-1 pr-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-extrabold text-slate-800 text-sm">{contact.name}</h4>
                                        <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-sm uppercase tracking-wider ${getRoleBadgeStyle(contact.role)}`}>
                                          {contact.role || 'Staff Contact'}
                                        </span>
                                        {contact.isDefault && (
                                          <span className="bg-amber-500 text-white text-[9px] font-black border border-amber-500 px-2 py-0.5 rounded-sm flex items-center gap-0.5 shadow-xs">
                                            <Star className="w-2.5 h-2.5 fill-white text-white" /> Primary
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                                        <div className="flex items-center gap-1.5 font-medium">
                                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                          <span>Location: {contact.location}</span>
                                        </div>
                                        {contact.email && (
                                          <div className="flex items-center gap-1.5 font-medium">
                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="hover:underline cursor-pointer">{contact.email}</span>
                                          </div>
                                        )}
                                        <div className="flex items-center gap-1.5 font-mono text-slate-700 font-semibold pt-1">
                                          <Phone className="w-3.5 h-3.5 text-blue-500" />
                                          <span>{contact.contact}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 items-end">
                                      {hasWritePermission && (
                                        <div className="flex gap-1.5">
                                          {/* Set Default Toggle */}
                                          {!contact.isDefault && (
                                            <button
                                              type="button"
                                              onClick={() => handleToggleDefault(contact)}
                                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-slate-100 transition-colors"
                                              title="Set as Default/Primary Contact"
                                            >
                                              <Star className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                          {/* Edit Contact */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIsAddingHistContact(false);
                                              setEditingHistContact(contact);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-100 transition-colors"
                                            title="Edit Contact"
                                          >
                                            <Edit3 className="w-3.5 h-3.5" />
                                          </button>
                                          {/* Delete Contact */}
                                          <button
                                            type="button"
                                            onClick={() => handleHistContactDelete(contact)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-100 transition-colors"
                                            title="Delete Contact"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      )}
                                      <a 
                                        href={`tel:${contact.contact}`}
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                                      >
                                        Call Dialpad
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                </div>

                <div className="bg-slate-50 px-8 py-4 border-t border-slate-150 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">AVON Service Center Database Records</span>
                  <button
                    onClick={() => setShowHistoryModal(null)}
                    className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-xl transition-colors hover:bg-slate-800"
                  >
                    Close Sheet
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
