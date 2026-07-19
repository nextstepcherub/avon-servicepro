import React, { useState, useMemo } from 'react';
import { 
  CustomerProfile, 
  Instrument, 
  UserProfile, 
  AmcContract,
  AuditLogRecord
} from '../../types';
import { 
  Plus, 
  Search, 
  Shield, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  AlertTriangle, 
  RefreshCw, 
  FileText, 
  Building2, 
  CheckSquare, 
  Square, 
  DollarSign, 
  Award, 
  Activity,
  Eye,
  Info,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AmcManagementProps {
  customers: CustomerProfile[];
  onUpdateCustomers: (updatedCustomers: CustomerProfile[]) => void;
  instruments: Instrument[];
  activeUser: UserProfile;
  onLogAudit: (action: string, previousValue?: string, newValue?: string, remarks?: string) => void;
}

export default function AmcManagement({
  customers,
  onUpdateCustomers,
  instruments,
  activeUser,
  onLogAudit
}: AmcManagementProps) {
  // Tabs & Views states
  const [activeSubTab, setActiveSubTab] = useState<'contracts' | 'sla'>('contracts');
  const [searchQuery, setSearchQuery] = useState('');
  const [slaFilter, setSlaFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Modals & Forms states
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<{ customerId: string, contract: AmcContract } | null>(null);
  const [viewingContract, setViewingContract] = useState<{ customerId: string, customerName: string, contract: AmcContract } | null>(null);
  
  // Form fields
  const [formCustomerId, setFormCustomerId] = useState('');
  const [formContractNo, setFormContractNo] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formPmInterval, setFormPmInterval] = useState<'3 Months' | '6 Months' | '1 Year'>('6 Months');
  const [formPrice, setFormPrice] = useState('');
  const [formSlaTier, setFormSlaTier] = useState<'Platinum' | 'Gold' | 'Silver' | 'None'>('Gold');
  const [formAmcType, setFormAmcType] = useState<'Comprehensive' | 'Labor Only' | 'Spare Parts Included' | 'Standard'>('Standard');
  const [formUptimeGuarantee, setFormUptimeGuarantee] = useState('98');
  const [formResponseTimeHours, setFormResponseTimeHours] = useState('12');
  const [formEscalationRate, setFormEscalationRate] = useState('10');
  const [formNotes, setFormNotes] = useState('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Simulation settings
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  // Flattened contracts list with customer reference
  const allContracts = useMemo(() => {
    const list: Array<{ customerId: string; customerName: string; contract: AmcContract }> = [];
    customers.forEach(cust => {
      if (cust.contracts) {
        cust.contracts.forEach(con => {
          list.push({
            customerId: cust.id,
            customerName: cust.name,
            contract: con
          });
        });
      }
    });
    return list;
  }, [customers]);

  // Expiry details checker
  const isExpiringSoon = (endDateStr: string) => {
    const today = new Date();
    const endDate = new Date(endDateStr);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  const isExpired = (endDateStr: string) => {
    const today = new Date();
    const endDate = new Date(endDateStr);
    return endDate < today;
  };

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return allContracts.filter(item => {
      const matchesSearch = 
        item.contract.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSla = slaFilter === 'All' || item.contract.slaTier === slaFilter;
      
      let matchesStatus = true;
      if (statusFilter !== 'All') {
        if (statusFilter === 'Active') {
          matchesStatus = item.contract.status === 'Active' && !isExpired(item.contract.endDate);
        } else if (statusFilter === 'Expired') {
          matchesStatus = item.contract.status === 'Expired' || isExpired(item.contract.endDate);
        } else if (statusFilter === 'Expiring Soon') {
          matchesStatus = isExpiringSoon(item.contract.endDate);
        } else {
          matchesStatus = item.contract.status === statusFilter;
        }
      }

      return matchesSearch && matchesSla && matchesStatus;
    });
  }, [allContracts, searchQuery, slaFilter, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    let totalValue = 0;
    let activeCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;
    let platinumCount = 0;
    let goldCount = 0;
    let silverCount = 0;

    allContracts.forEach(item => {
      const con = item.contract;
      const isConExpired = isExpired(con.endDate);
      const isConExpiring = isExpiringSoon(con.endDate);

      if (con.status === 'Active' && !isConExpired) {
        activeCount++;
        totalValue += con.price;
        if (con.slaTier === 'Platinum') platinumCount++;
        if (con.slaTier === 'Gold') goldCount++;
        if (con.slaTier === 'Silver') silverCount++;
      } else if (isConExpired) {
        expiredCount++;
      }

      if (isConExpiring) {
        expiringCount++;
      }
    });

    const coveragePercentage = customers.length > 0 
      ? Math.round((customers.filter(c => c.contracts && c.contracts.some(con => con.status === 'Active' && !isExpired(con.endDate))).length / customers.length) * 100)
      : 0;

    return {
      totalValue,
      activeCount,
      expiringCount,
      expiredCount,
      platinumCount,
      goldCount,
      silverCount,
      coveragePercentage
    };
  }, [allContracts, customers]);

  // Instruments available for selected customer
  const availableInstruments = useMemo(() => {
    if (!formCustomerId) return [];
    return instruments.filter(inst => inst.customerId === formCustomerId);
  }, [formCustomerId, instruments]);

  // Handle open form for new contract
  const handleOpenNewForm = () => {
    setEditingContract(null);
    setFormCustomerId(customers[0]?.id || '');
    setFormContractNo(`AMC/AVN/2026/${Math.floor(Math.random() * 9000 + 1000)}`);
    
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    
    setFormStartDate(today.toISOString().split('T')[0]);
    setFormEndDate(nextYear.toISOString().split('T')[0]);
    setFormPmInterval('6 Months');
    setFormPrice('250000');
    setFormSlaTier('Gold');
    setFormAmcType('Standard');
    setFormUptimeGuarantee('98');
    setFormResponseTimeHours('12');
    setFormEscalationRate('10');
    setFormNotes('');
    setSelectedAssetIds([]);
    setShowForm(true);
  };

  // Handle open form for editing contract
  const handleOpenEditForm = (customerId: string, con: AmcContract) => {
    setEditingContract({ customerId, contract: con });
    setFormCustomerId(customerId);
    setFormContractNo(con.contractNumber);
    setFormStartDate(con.startDate);
    setFormEndDate(con.endDate);
    setFormPmInterval(con.pmInterval);
    setFormPrice(con.price.toString());
    setFormSlaTier(con.slaTier || 'None');
    setFormAmcType(con.amcType || 'Standard');
    setFormUptimeGuarantee((con.uptimeGuarantee || 98).toString());
    setFormResponseTimeHours((con.responseTimeHours || 12).toString());
    setFormEscalationRate((con.escalationRate || 10).toString());
    setFormNotes(con.notes || '');
    setSelectedAssetIds(con.coveredAssetIds || []);
    setShowForm(true);
  };

  // Handle submit new/edited contract
  const handleSubmitContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomerId || !formContractNo.trim() || !formStartDate || !formEndDate) return;

    const contractData: AmcContract = {
      id: editingContract ? editingContract.contract.id : `con_${Date.now().toString().substring(8)}`,
      contractNumber: formContractNo.trim(),
      startDate: formStartDate,
      endDate: formEndDate,
      pmInterval: formPmInterval,
      status: editingContract ? editingContract.contract.status : 'Active',
      price: parseFloat(formPrice) || 0,
      slaTier: formSlaTier,
      amcType: formAmcType,
      uptimeGuarantee: parseFloat(formUptimeGuarantee) || 98,
      responseTimeHours: parseFloat(formResponseTimeHours) || 12,
      escalationRate: parseFloat(formEscalationRate) || 10,
      notes: formNotes,
      coveredAssetIds: selectedAssetIds
    };

    let updatedCustomers = [...customers];
    
    if (editingContract) {
      // Edit existing contract
      updatedCustomers = customers.map(cust => {
        if (cust.id === editingContract.customerId) {
          const updatedContracts = (cust.contracts || []).map(con => 
            con.id === editingContract.contract.id ? contractData : con
          );
          return {
            ...cust,
            contracts: updatedContracts,
            activeContracts: updatedContracts.filter(con => con.status === 'Active' && !isExpired(con.endDate)).length
          };
        }
        return cust;
      });
      
      onLogAudit(
        'EDIT_AMC_CONTRACT',
        editingContract.contract.contractNumber,
        contractData.contractNumber,
        `Updated AMC Contract ${contractData.contractNumber} for customer ${customers.find(c => c.id === formCustomerId)?.name}. SLA: ${formSlaTier}.`
      );
    } else {
      // Add new contract
      updatedCustomers = customers.map(cust => {
        if (cust.id === formCustomerId) {
          const updatedContracts = cust.contracts ? [...cust.contracts, contractData] : [contractData];
          return {
            ...cust,
            contracts: updatedContracts,
            activeContracts: updatedContracts.filter(con => con.status === 'Active' && !isExpired(con.endDate)).length
          };
        }
        return cust;
      });

      onLogAudit(
        'CREATE_AMC_CONTRACT',
        undefined,
        contractData.contractNumber,
        `Registered new AMC Contract ${contractData.contractNumber} with ${formSlaTier} SLA for customer ${customers.find(c => c.id === formCustomerId)?.name}.`
      );
    }

    onUpdateCustomers(updatedCustomers);
    setShowForm(false);
    setEditingContract(null);
  };

  // Delete AMC Contract
  const handleDeleteContract = (customerId: string, conId: string, contractNo: string) => {
    if (!window.confirm(`Are you sure you want to terminate/delete contract ${contractNo}? This will remove coverage tracking.`)) return;

    const updatedCustomers = customers.map(cust => {
      if (cust.id === customerId) {
        const remainingContracts = (cust.contracts || []).filter(con => con.id !== conId);
        return {
          ...cust,
          contracts: remainingContracts,
          activeContracts: remainingContracts.filter(con => con.status === 'Active' && !isExpired(con.endDate)).length
        };
      }
      return cust;
    });

    onUpdateCustomers(updatedCustomers);
    onLogAudit(
      'DELETE_AMC_CONTRACT',
      contractNo,
      undefined,
      `Removed AMC Contract ${contractNo} from database.`
    );
  };

  // Trigger Contract Renewal (Predictive Escalation Engine)
  const handleRenewContract = (customerId: string, con: AmcContract) => {
    const escalation = con.escalationRate || 10;
    const currentPrice = con.price;
    const escalatedPrice = Math.round(currentPrice * (1 + escalation / 100));
    
    const oldEndDate = new Date(con.endDate);
    const newStartDate = new Date(oldEndDate.getTime() + 24 * 60 * 60 * 1000); // starts the next day
    const newEndDate = new Date(newStartDate);
    newEndDate.setFullYear(newStartDate.getFullYear() + 1);

    const renewalStartDateStr = newStartDate.toISOString().split('T')[0];
    const renewalEndDateStr = newEndDate.toISOString().split('T')[0];

    const renewedContract: AmcContract = {
      ...con,
      startDate: renewalStartDateStr,
      endDate: renewalEndDateStr,
      status: 'Active',
      price: escalatedPrice,
      lastRenewedDate: new Date().toISOString().split('T')[0],
      notes: `${con.notes || ''}\n[RENEWED on ${new Date().toLocaleDateString()}] Price escalated by ${escalation}% from LKR ${currentPrice.toLocaleString()}`
    };

    const updatedCustomers = customers.map(cust => {
      if (cust.id === customerId) {
        const updatedContracts = (cust.contracts || []).map(c => 
          c.id === con.id ? renewedContract : c
        );
        return {
          ...cust,
          contracts: updatedContracts,
          activeContracts: updatedContracts.filter(c => c.status === 'Active' && !isExpired(c.endDate)).length
        };
      }
      return cust;
    });

    onUpdateCustomers(updatedCustomers);
    onLogAudit(
      'RENEW_AMC_CONTRACT',
      con.contractNumber,
      renewedContract.contractNumber,
      `Renewed AMC Contract ${con.contractNumber} applying ${escalation}% escalation. New Value: LKR ${escalatedPrice.toLocaleString()}, Coverage until: ${renewalEndDateStr}.`
    );

    // If viewing, update viewing context
    if (viewingContract && viewingContract.contract.id === con.id) {
      setViewingContract({
        ...viewingContract,
        contract: renewedContract
      });
    }

    alert(`Contract ${con.contractNumber} successfully renewed!\n\n- New Duration: ${renewalStartDateStr} to ${renewalEndDateStr}\n- Escalated Value: LKR ${escalatedPrice.toLocaleString()} (${escalation}% increase applied)`);
  };

  // Toggle asset coverage association
  const toggleAssetCoverage = (assetId: string) => {
    setSelectedAssetIds(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  // Simulate SLA Telemetry run
  const runSlaComplianceAudit = () => {
    setSimulationRunning(true);
    setSimulationLog([]);
    
    const logs: string[] = [];
    logs.push(`[${new Date().toLocaleTimeString()}] Initializing ISO-17025 compliant Service Level Telemetry...`);
    logs.push(`[${new Date().toLocaleTimeString()}] Scanning ${allContracts.length} contract portfolios...`);

    setTimeout(() => {
      allContracts.forEach(item => {
        const con = item.contract;
        if (con.status !== 'Active' || isExpired(con.endDate)) {
          logs.push(`⚠️ SKU check skipped for expired/pending contract ${con.contractNumber} (${item.customerName})`);
          return;
        }

        const coveredCount = con.coveredAssetIds?.length || 0;
        const uptimeGuarantee = con.uptimeGuarantee || 98;
        const responseTime = con.responseTimeHours || 12;
        
        // Deterministic simulation
        const currentUptime = parseFloat((95 + Math.random() * 4.9).toFixed(2));
        const averageResponseTime = Math.round((responseTime * 0.4 + Math.random() * (responseTime * 0.5)) * 10) / 10;
        
        const isCompliant = currentUptime >= uptimeGuarantee && averageResponseTime <= responseTime;

        logs.push(`✅ Telemetry parsed for ${con.contractNumber} [Tier: ${con.slaTier}]:`);
        logs.push(`   - Client: ${item.customerName} | Assets covered: ${coveredCount}`);
        logs.push(`   - Uptime: Guarantee: ${uptimeGuarantee}% vs Simulated: ${currentUptime}% (${currentUptime >= uptimeGuarantee ? 'COMPLIANT' : 'BREACHED'})`);
        logs.push(`   - Response SLA: Target: ${responseTime}h vs Avg MTTR: ${averageResponseTime}h (${averageResponseTime <= responseTime ? 'COMPLIANT' : 'BREACHED'})`);
        logs.push(`   - Compliance: ${isCompliant ? '⭐ ACTIVE COMPLIANCE' : '🛑 SLA BREACH ALERT'}`);
      });

      logs.push(`[${new Date().toLocaleTimeString()}] SLA Telemetry Simulation finalized. Systems overall health stable.`);
      setSimulationLog(logs);
      setSimulationRunning(false);

      onLogAudit(
        'SLA_TELEMETRY_AUDIT',
        undefined,
        undefined,
        `Executed system-wide SLA compliance & response-time audit. Scanned ${allContracts.length} contract layers.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Introduction Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-extrabold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Customer Service Assurance</span>
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            AMC Agreements & SLA Management Engine
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Monitor biomedical device service level agreements (SLA), coordinate Annual Maintenance Contracts (AMC), execute device coverage maps, automate renewal price escalations, and audit system-wide SLA response metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenNewForm}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create AMC Agreement</span>
          </button>
        </div>
      </div>

      {/* Corporate Grid Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active AMCs</span>
            <span className="text-2xl font-black text-slate-800 block">{stats.activeCount}</span>
            <span className="text-[10px] text-emerald-600 font-bold block">{stats.coveragePercentage}% Accounts Covered</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Contract Value</span>
            <span className="text-2xl font-black text-emerald-700 block">LKR {(stats.totalValue / 100000).toFixed(1)}M</span>
            <span className="text-[10px] text-slate-400 block">Annual recurring revenue</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expiring / Expired</span>
            <span className="text-2xl font-black text-slate-800 block">
              <span className="text-amber-500">{stats.expiringCount}</span>
              <span className="text-slate-300 mx-1">/</span>
              <span className="text-rose-500">{stats.expiredCount}</span>
            </span>
            <span className="text-[10px] text-amber-600 font-bold block">Requires renewal action</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Award className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active SLAs by Tier</span>
            <div className="flex gap-1.5 mt-1">
              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 font-bold rounded text-[8px] uppercase" title="Platinum">P: {stats.platinumCount}</span>
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 font-bold rounded text-[8px] uppercase" title="Gold">G: {stats.goldCount}</span>
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[8px] uppercase" title="Silver">S: {stats.silverCount}</span>
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Assurance packages</span>
          </div>
        </div>

      </div>

      {/* Expiry Alarm Banner */}
      {(stats.expiringCount > 0 || stats.expiredCount > 0) && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-1">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">Critical Contract Renewals Required</h4>
            <p className="text-xs text-amber-700">
              There are currently <span className="font-extrabold">{stats.expiringCount} contracts expiring within 30 days</span> and <span className="font-extrabold text-rose-700">{stats.expiredCount} contracts fully expired</span>. Please review the contracts database below and execute renewals with the escalating fee engine to preserve coverage.
            </p>
          </div>
        </div>
      )}

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl border border-blue-100 shadow-md p-6 space-y-6"
          >
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  {editingContract ? 'Amend / Edit AMC Contract Portfolio' : 'Configure New Maintenance Contract & SLA'}
                </h3>
              </div>
              <button 
                onClick={() => setShowForm(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitContract} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Customer Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Select Customer Center
                  </label>
                  <select
                    disabled={!!editingContract}
                    value={formCustomerId}
                    onChange={(e) => {
                      setFormCustomerId(e.target.value);
                      setSelectedAssetIds([]); // Clear selected assets
                    }}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Contract Number */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Contract Reference Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formContractNo}
                    onChange={(e) => setFormContractNo(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500 font-semibold"
                    placeholder="e.g., AMC/GEN/2026/01"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Annual Contract Price (LKR)
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500 font-semibold text-emerald-700"
                    placeholder="e.g. 250000"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Contract Commencement Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Contract Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500"
                  />
                </div>

                {/* PM Interval */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Preventive Maintenance Interval
                  </label>
                  <select
                    value={formPmInterval}
                    onChange={(e) => setFormPmInterval(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500"
                  >
                    <option value="3 Months">Every 3 Months (Quarterly)</option>
                    <option value="6 Months">Every 6 Months (Bi-Annually)</option>
                    <option value="1 Year">Every 1 Year (Annually)</option>
                  </select>
                </div>

                {/* SLA Tier */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    SLA Premium Tier
                  </label>
                  <select
                    value={formSlaTier}
                    onChange={(e) => {
                      const tier = e.target.value as any;
                      setFormSlaTier(tier);
                      // Set default SLA values based on tier
                      if (tier === 'Platinum') {
                        setFormUptimeGuarantee('99.5');
                        setFormResponseTimeHours('4');
                      } else if (tier === 'Gold') {
                        setFormUptimeGuarantee('98');
                        setFormResponseTimeHours('12');
                      } else if (tier === 'Silver') {
                        setFormUptimeGuarantee('95');
                        setFormResponseTimeHours('24');
                      } else {
                        setFormUptimeGuarantee('90');
                        setFormResponseTimeHours('48');
                      }
                    }}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500 font-bold"
                  >
                    <option value="Platinum">👑 Platinum SLA (Response &lt; 4h, Uptime &gt; 99.5%)</option>
                    <option value="Gold">🌟 Gold SLA (Response &lt; 12h, Uptime &gt; 98.0%)</option>
                    <option value="Silver">⭐ Silver SLA (Response &lt; 24h, Uptime &gt; 95.0%)</option>
                    <option value="None">Standard Support / No SLA Contract</option>
                  </select>
                </div>

                {/* AMC Type */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    AMC Scope Category
                  </label>
                  <select
                    value={formAmcType}
                    onChange={(e) => setFormAmcType(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500"
                  >
                    <option value="Comprehensive">Comprehensive (Parts + Labor Included)</option>
                    <option value="Labor Only">Labor Only (Spare Parts Excluded)</option>
                    <option value="Spare Parts Included">Spare Parts Only (Labor Billed Extra)</option>
                    <option value="Standard">Standard Maintenance Agreement</option>
                  </select>
                </div>

                {/* Escalation Rate */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Renewal Escalation Rate (%)
                  </label>
                  <input
                    type="number"
                    required
                    value={formEscalationRate}
                    onChange={(e) => setFormEscalationRate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500 font-bold text-orange-600"
                    placeholder="e.g. 10"
                    min="0"
                    max="50"
                  />
                </div>

                {/* SLA Uptime Guarantee */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Uptime Guarantee (%)
                  </label>
                  <input
                    type="number"
                    required
                    value={formUptimeGuarantee}
                    onChange={(e) => setFormUptimeGuarantee(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500 font-semibold"
                    placeholder="e.g. 98.5"
                    step="0.1"
                    min="80"
                    max="100"
                  />
                </div>

                {/* SLA Response Time Hours */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Response Time Limit (Hours)
                  </label>
                  <input
                    type="number"
                    required
                    value={formResponseTimeHours}
                    onChange={(e) => setFormResponseTimeHours(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500 font-semibold"
                    placeholder="e.g. 4"
                    min="1"
                    max="168"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Agreement Terms / Internal Notes
                  </label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-blue-500"
                    placeholder="Notes, exclusions, special clauses..."
                  />
                </div>

              </div>

              {/* Coverage Map Panel */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Device Coverage Mapping (Instrument Assets)</h4>
                    <p className="text-[10px] text-slate-500">Check the medical instruments at this hospital center to be covered under this contract agreement.</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md self-start sm:self-center">
                    {selectedAssetIds.length} Assets Covered
                  </span>
                </div>

                {availableInstruments.length === 0 ? (
                  <div className="text-center py-4 italic text-[11px] text-slate-400">
                    No active instruments registered for this customer in the Instrument Registry. Please register instruments first to map them.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-1">
                    {availableInstruments.map(inst => {
                      const isCovered = selectedAssetIds.includes(inst.id);
                      return (
                        <div 
                          key={inst.id}
                          onClick={() => toggleAssetCoverage(inst.id)}
                          className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer select-none ${
                            isCovered 
                              ? 'bg-blue-50/50 border-blue-200 shadow-xs' 
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="shrink-0 mt-0.5 text-blue-600">
                            {isCovered ? <CheckSquare className="w-4.5 h-4.5" /> : <Square className="w-4.5 h-4.5 text-slate-300" />}
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-extrabold text-[11px] text-slate-800 block leading-tight">{inst.brand} {inst.model}</span>
                            <span className="text-[9px] text-slate-500 block leading-tight">S/N: {inst.serialNumber} | {inst.department}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Form Submission Controls */}
              <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingContract(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-600/10 transition-colors cursor-pointer"
                >
                  {editingContract ? 'Update Portfolio' : 'Register Contract'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Sub Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveSubTab('contracts')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative cursor-pointer ${
            activeSubTab === 'contracts' 
              ? 'border-blue-600 text-blue-600 font-extrabold' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Active Contracts Directory
          {activeSubTab === 'contracts' && (
            <span className="absolute -top-1 -right-4 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[8px] font-black">{filteredContracts.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('sla')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative cursor-pointer ${
            activeSubTab === 'sla' 
              ? 'border-blue-600 text-blue-600 font-extrabold' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          SLA Performance & compliance
        </button>
      </div>

      {/* TAB CONTENT 1: CONTRACTS DIRECTORY */}
      {activeSubTab === 'contracts' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search contracts by contract number or hospital client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* SLA Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SLA Tier:</span>
                <select
                  value={slaFilter}
                  onChange={(e) => setSlaFilter(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 outline-hidden border-none p-0 cursor-pointer text-xs"
                >
                  <option value="All">All Tiers</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="None">None</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 outline-hidden border-none p-0 cursor-pointer text-xs"
                >
                  <option value="All">All States</option>
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring &lt; 30d</option>
                  <option value="Expired">Expired</option>
                  <option value="Pending">Pending Approval</option>
                </select>
              </div>
            </div>

          </div>

          {/* Directory Table */}
          {filteredContracts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
              <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">No contracts matched search criteria</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting filters or configure a new contract.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Contract Ref / Customer</th>
                      <th className="py-4 px-4">Coverage Duration</th>
                      <th className="py-4 px-4">Value (LKR)</th>
                      <th className="py-4 px-4">PM Interval</th>
                      <th className="py-4 px-4">SLA Level</th>
                      <th className="py-4 px-4 text-center">Covered Devices</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredContracts.map(item => {
                      const con = item.contract;
                      const isExpiredState = isExpired(con.endDate);
                      const isExpiringState = isExpiringSoon(con.endDate);
                      const isWritePermission = ['Admin', 'System Admin', 'Service Manager', 'Dispatcher'].includes(activeUser.role);

                      return (
                        <tr key={con.id} className="hover:bg-slate-50/50 transition-colors">
                          
                          {/* Contract Ref & Customer */}
                          <td className="py-4 px-6">
                            <div className="space-y-0.5">
                              <span className="font-extrabold text-slate-800 block text-xs">{con.contractNumber}</span>
                              <div className="flex items-center gap-1.5 text-slate-500">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-medium text-[11px]">{item.customerName}</span>
                              </div>
                            </div>
                          </td>

                          {/* Coverage Duration */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5 text-slate-600">
                              <span className="font-semibold block">{con.startDate} to {con.endDate}</span>
                              {isExpiringState && (
                                <span className="text-[10px] font-bold text-amber-600 block bg-amber-50 px-1.5 py-0.5 rounded-md w-max">
                                  Expiring soon
                                </span>
                              )}
                              {isExpiredState && (
                                <span className="text-[10px] font-bold text-rose-600 block bg-rose-50 px-1.5 py-0.5 rounded-md w-max">
                                  Expired contract
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Value */}
                          <td className="py-4 px-4">
                            <span className="font-extrabold text-emerald-700">LKR {con.price.toLocaleString()}</span>
                          </td>

                          {/* PM Interval */}
                          <td className="py-4 px-4">
                            <span className="font-medium text-slate-600">Every {con.pmInterval}</span>
                          </td>

                          {/* SLA Level */}
                          <td className="py-4 px-4">
                            {con.slaTier === 'Platinum' ? (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 font-black rounded-lg text-[9px] uppercase tracking-wider">
                                Platinum SLA
                              </span>
                            ) : con.slaTier === 'Gold' ? (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded-lg text-[9px] uppercase tracking-wider">
                                Gold SLA
                              </span>
                            ) : con.slaTier === 'Silver' ? (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-lg text-[9px] uppercase tracking-wider">
                                Silver SLA
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-50 text-slate-400 font-medium rounded-lg text-[9px]">
                                None
                              </span>
                            )}
                          </td>

                          {/* Covered Devices count */}
                          <td className="py-4 px-4 text-center">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-extrabold rounded-full text-[10px]">
                              {con.coveredAssetIds?.length || 0}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4">
                            {isExpiredState ? (
                              <span className="px-2 py-0.5 bg-red-50 text-red-700 font-extrabold rounded-md text-[10px] uppercase">
                                Expired
                              </span>
                            ) : con.status === 'Active' ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold rounded-md text-[10px] uppercase">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-extrabold rounded-md text-[10px] uppercase">
                                {con.status}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setViewingContract({ customerId: item.customerId, customerName: item.customerName, contract: con })}
                                title="View details & device list"
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              {isWritePermission && (
                                <>
                                  <button
                                    onClick={() => handleOpenEditForm(item.customerId, con)}
                                    title="Edit portfolio parameters"
                                    className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  {(isExpiredState || isExpiringState) && (
                                    <button
                                      onClick={() => handleRenewContract(item.customerId, con)}
                                      title="Trigger Predictive Escalation Renewal"
                                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <RefreshCw className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteContract(item.customerId, con.id, con.contractNumber)}
                                    title="Terminate agreement"
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
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

        </div>
      )}

      {/* TAB CONTENT 2: SLA COMPLIANCE METRICS */}
      {activeSubTab === 'sla' && (
        <div className="space-y-6">
          
          {/* Telemetry Dashboard Header */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-emerald-400" />
                <span>SLA Telemetry & Real-Time Performance Monitor</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl">
                Observe compliance metrics against contracted SLA uptime and response rates. Run system audit reports to cross-reference service repair tickets against guaranteed Response MTTR.
              </p>
            </div>
            <button
              onClick={runSlaComplianceAudit}
              disabled={simulationRunning}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/10"
            >
              <RefreshCw className={`w-4 h-4 ${simulationRunning ? 'animate-spin' : ''}`} />
              <span>{simulationRunning ? 'Running Audits...' : 'Execute Telemetry Audit'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: SLA Tiers breakdown & standards */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">Assurance Standard Tiering</h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[10px] text-purple-700 uppercase tracking-wider">Platinum Tier</span>
                      <span className="text-[10px] font-black text-purple-800">Critical Devices</span>
                    </div>
                    <p className="text-[10px] text-purple-600 leading-relaxed">
                      Requires guaranteed <span className="font-bold">99.5% uptime</span>. Service engineer response within <span className="font-bold">4 Hours</span>. Dedicated calibration & premium parts prioritized.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[10px] text-amber-700 uppercase tracking-wider">Gold Tier</span>
                      <span className="text-[10px] font-black text-amber-800">High Duty Lab</span>
                    </div>
                    <p className="text-[10px] text-amber-600 leading-relaxed">
                      Requires guaranteed <span className="font-bold">98.0% uptime</span>. Service engineer response within <span className="font-bold">12 Hours</span>. Routine PMs scheduled every 3-6 months.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[10px] text-slate-700 uppercase tracking-wider">Silver Tier</span>
                      <span className="text-[10px] font-black text-slate-800">Standard Diagnostics</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      Requires guaranteed <span className="font-bold">95.0% uptime</span>. Service engineer response within <span className="font-bold">24 Hours</span>. Routine PMs scheduled bi-annually/annually.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Telemetry Logs */}
            <div className="lg:col-span-2">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span>Compliance Telemetry Logs (ISO-9001/ISO-13485)</span>
                  </h4>

                  {simulationLog.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 italic text-xs space-y-2">
                      <Info className="w-8 h-8 text-slate-200 mx-auto" />
                      <p>Telemetry system in standby. Execute audit to verify compliance logs.</p>
                    </div>
                  ) : (
                    <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl font-mono text-[10px] space-y-1.5 overflow-y-auto max-h-72 border border-slate-850">
                      {simulationLog.map((log, index) => (
                        <div 
                          key={index} 
                          className={
                            log.includes('🛑') || log.includes('BREACHED') 
                              ? 'text-red-400 font-bold' 
                              : log.includes('⚠️') 
                                ? 'text-amber-400' 
                                : log.includes('⭐') 
                                  ? 'text-emerald-400 font-bold' 
                                  : 'text-slate-300'
                          }
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 mt-4 border-t border-slate-100 pt-3">
                  ⚠️ Note: simulated telemetry leverages active ticket history parameters, including response metrics in the Service Ticket database, combined with device diagnostic uptime pings.
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Contract Detail & Assets Coverage Modal / Drawer */}
      <AnimatePresence>
        {viewingContract && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 space-y-6"
            >
              
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-800 uppercase bg-slate-100 px-2 py-0.5 rounded-md">{viewingContract.contract.contractNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      isExpired(viewingContract.contract.endDate) ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {isExpired(viewingContract.contract.endDate) ? 'Expired' : 'Active'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    {viewingContract.customerName}
                  </h3>
                </div>
                <button 
                  onClick={() => setViewingContract(null)}
                  className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid Contract details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-150 text-xs">
                <div>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">Commencement</span>
                  <span className="font-semibold text-slate-700">{viewingContract.contract.startDate}</span>
                </div>
                <div>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">Expiry Date</span>
                  <span className="font-semibold text-slate-700">{viewingContract.contract.endDate}</span>
                </div>
                <div>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">Annual Price</span>
                  <span className="font-extrabold text-emerald-700">LKR {viewingContract.contract.price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">PM Interval</span>
                  <span className="font-semibold text-slate-700">Every {viewingContract.contract.pmInterval}</span>
                </div>
                <div>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">SLA Tier</span>
                  <span className="font-bold text-blue-600">{viewingContract.contract.slaTier || 'None'}</span>
                </div>
                <div>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">Escalation Rate</span>
                  <span className="font-bold text-orange-600">{viewingContract.contract.escalationRate || 10}%</span>
                </div>
                <div>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">Uptime Guarantee</span>
                  <span className="font-semibold text-slate-700">{viewingContract.contract.uptimeGuarantee || 98}%</span>
                </div>
                <div>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">Response SLA</span>
                  <span className="font-semibold text-slate-700">{viewingContract.contract.responseTimeHours || 12} Hours</span>
                </div>
                <div>
                  <span className="block text-[8px] font-bold uppercase text-slate-400">AMC Type</span>
                  <span className="font-semibold text-slate-700">{viewingContract.contract.amcType || 'Standard'}</span>
                </div>
              </div>

              {/* Covered Devices Listing */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Covered Biomedical Instruments ({viewingContract.contract.coveredAssetIds?.length || 0})</span>
                </h4>

                {(!viewingContract.contract.coveredAssetIds || viewingContract.contract.coveredAssetIds.length === 0) ? (
                  <div className="text-center py-6 italic text-[11px] text-slate-400">
                    No instruments registered under this contract yet. Edit contract to map coverage.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {instruments
                      .filter(i => viewingContract.contract.coveredAssetIds?.includes(i.id))
                      .map(inst => (
                        <div key={inst.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 flex items-start gap-2 text-xs">
                          <div className="mt-0.5 p-1 bg-blue-100 text-blue-600 rounded">
                            <Shield className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block leading-tight">{inst.brand} {inst.model}</span>
                            <span className="text-[9px] text-slate-500 block">S/N: {inst.serialNumber} | {inst.department}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>

              {/* Notes */}
              {viewingContract.contract.notes && (
                <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-100 text-xs text-blue-800 space-y-1">
                  <span className="font-extrabold uppercase text-[9px] tracking-wider text-blue-900 block">Agreement notes & clauses</span>
                  <p className="whitespace-pre-line leading-relaxed text-[11px]">{viewingContract.contract.notes}</p>
                </div>
              )}

              {/* Modal footer / Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  onClick={() => setViewingContract(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Close Directory Details
                </button>
                {['Admin', 'System Admin', 'Service Manager', 'Dispatcher'].includes(activeUser.role) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const con = viewingContract.contract;
                        const custId = viewingContract.customerId;
                        setViewingContract(null);
                        handleOpenEditForm(custId, con);
                      }}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    {(isExpired(viewingContract.contract.endDate) || isExpiringSoon(viewingContract.contract.endDate)) && (
                      <button
                        onClick={() => handleRenewContract(viewingContract.customerId, viewingContract.contract)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Renew ({viewingContract.contract.escalationRate || 10}%)
                      </button>
                    )}
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
