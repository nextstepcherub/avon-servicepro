import React, { useState } from 'react';
import { ServiceTicket, Instrument, UserProfile } from '../../types';
import { Wrench, ShieldAlert, FileText, CheckCircle, ShieldCheck, DollarSign, UserCheck, Play, ArrowRight, PlusCircle } from 'lucide-react';
import { isManager, isFullEngineer, isSupportTech } from '../../utils/authHelpers';

interface ServiceRepairManagementProps {
  tickets: ServiceTicket[];
  instruments: Instrument[];
  onAddTicket: (ticket: ServiceTicket) => void;
  onUpdateTicketStatus: (id: string, status: any) => void;
  onUpdateTicketPrice: (id: string, cost: number) => void;
  onApproveTicketBilling: (id: string) => void;
  onAssignEngineer: (id: string, engineerId: string, engineerName: string) => void;
  currentUser: UserProfile;
  initialSelectedTicket?: ServiceTicket | null;
}

const WORKSHOP_STAGES = [
  'RECEIVED',
  'DIAGNOSING',
  'PENDING_PARTS',
  'REPAIRING',
  'CALIBRATING',
  'QUALITY_CHECK',
  'READY_DELIVERY',
  'CLOSED'
] as const;

function getInitials(name?: string): string {
  if (!name) return 'U';
  const cleanName = name.replace(/^(Eng\.|Dr\.|Mr\.|Ms\.)\s+/i, '');
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

function getShortName(name: string): string {
  const cleanName = name.replace(/^(Eng\.|Dr\.|Mr\.|Ms\.)\s+/i, '');
  return cleanName.split(/\s+/)[0] || name;
}

export default function ServiceRepairManagement({
  tickets,
  instruments,
  onAddTicket,
  onUpdateTicketStatus,
  onUpdateTicketPrice,
  onApproveTicketBilling,
  onAssignEngineer,
  currentUser,
  initialSelectedTicket
}: ServiceRepairManagementProps) {

  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(initialSelectedTicket || null);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [instrumentId, setInstrumentId] = useState('');
  const [ticketType, setTicketType] = useState<any>('WARRANTY_REPAIR');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<any>('MEDIUM');
  const [spareCost, setSpareCost] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState('');

  // Access checks
  const isEngineerOrManager = isManager(currentUser.role) || isFullEngineer(currentUser.role) || isSupportTech(currentUser.role);
  const isCustomer = currentUser.role === 'CUSTOMER';

  const ENGINEERS = [
    { id: "eng-1", name: "Eng. Suresh Perera" },
    { id: "eng-2", name: "Eng. Nimani Senanayake" }
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instrumentId || !subject || !description) return;

    const linkInst = instruments.find(i => i.id === instrumentId);
    if (!linkInst) return;

    const newTicket: ServiceTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `AVN-${ticketType === 'CALIBRATION' ? 'CAL' : 'RPR'}-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: ticketType,
      instrumentId: linkInst.id,
      instrumentName: linkInst.name,
      serialNumber: linkInst.serialNumber,
      customerId: linkInst.customerId,
      customerName: linkInst.customerName,
      subject,
      description,
      priority,
      status: 'RECEIVED',
      createdAt: new Date().toISOString()
    };

    onAddTicket(newTicket);
    setSubject('');
    setDescription('');
    setShowNewOrderForm(false);
    
    // Auto select the newly created ticket for diagnostic review
    setSelectedTicket(newTicket);

    setSuccessMsg("Support Ticket Logging Succeeded!");
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Alerts */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-xs font-sans flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Column 1: Active Tickets Log Drawer */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-50 mb-3">
              <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">Active Tickets Log</h3>
              <button
                id="file-new-ticket-btn"
                onClick={() => setShowNewOrderForm(!showNewOrderForm)}
                className="text-[11px] text-[#0054A6] hover:underline flex items-center gap-1 font-bold font-sans cursor-pointer focus:outline-none"
              >
                <PlusCircle className="w-3.5 h-3.5" /> File Ticket
              </button>
            </div>

            {/* Quick Tickets Stack */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {tickets.map(ticket => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <button
                    key={ticket.id}
                    id={`ticket-select-btn-${ticket.id}`}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowNewOrderForm(false);
                    }}
                    className={`w-full text-left p-3 rounded border transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-[#F5F8FC] border-[#0054A6] shadow-xs' 
                        : 'border-gray-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 w-full">
                      <span className="text-[10px] font-mono font-bold text-gray-400 block">{ticket.ticketNumber}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono ${
                        ticket.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-100' :
                        ticket.priority === 'HIGH' ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-gray-600'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-800 font-sans mt-1.5 leading-snug line-clamp-1">{ticket.instrumentName}</h4>
                    <p className="text-[10px] text-gray-405 font-sans mt-0.5 max-w-full truncate">{ticket.customerName}</p>

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50/50 w-full text-[9px] font-mono">
                      <span className="text-gray-400 uppercase">{ticket.type.replace('_', ' ')}</span>
                      <span className="font-bold text-[#0077C8]">{ticket.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Collapsible forms and ticket workspace */}
        <div className="xl:col-span-2 space-y-4">
          
          {/* New Ticket Form Overlay */}
          {showNewOrderForm && (
            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-md">
              <h3 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">AVON Metrology & Repair Order Form</h3>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">CHOOSE DEPLOYED CLIENT INSTRUMENT</label>
                    <select
                      id="form-ticket-instrument"
                      required
                      className="w-full bg-white border border-gray-200 rounded p-2 text-xs focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                      value={instrumentId}
                      onChange={(e) => setInstrumentId(e.target.value)}
                    >
                      <option value="">-- Choose Deployed Device --</option>
                      {instruments.map(inst => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name} (SN: {inst.serialNumber} - {inst.customerName.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">SERVICE COMPLIANCE SCHEME</label>
                    <select
                      id="form-ticket-type"
                      className="w-full bg-white border border-gray-200 rounded p-2 text-xs focus:ring-1 focus:ring-[#0054A6] focus:outline-none"
                      value={ticketType}
                      onChange={(e: any) => setTicketType(e.target.value)}
                    >
                      <option value="WARRANTY_REPAIR">WARRANTY REPAIR (Unscheduled breakdown)</option>
                      <option value="WARRANTY_SERVICE">WARRANTY SERVICE (PM Preventive Maintenance)</option>
                      <option value="NON_WARRANTY_SERVICE">NON-WARRANTY CONTRACT SERVICE (AMC/CAMC)</option>
                      <option value="CALIBRATION">MANDATORY CALIBRATION ROUTINE</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">URGENCY SLA PRIORITY</label>
                    <select
                      id="form-ticket-priority"
                      className="w-full bg-white border border-gray-200 rounded p-2 text-xs"
                      value={priority}
                      onChange={(e: any) => setPriority(e.target.value)}
                    >
                      <option value="LOW">LOW (Response next 48 hrs)</option>
                      <option value="MEDIUM">MEDIUM (SLA Standard)</option>
                      <option value="HIGH">HIGH (Urgent Diagnostics)</option>
                      <option value="CRITICAL">CRITICAL (System breakdown down-time alert)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">METROLOGICAL SUBJECT SUMMARY</label>
                    <input
                      id="form-ticket-subject"
                      type="text"
                      required
                      className="w-full bg-white border border-gray-200 rounded p-2 text-xs focus:ring-1 focus:ring-[#0054A6] placeholder-gray-300"
                      placeholder="e.g. Laser diode calibration error, mobile phase pump leak"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-gray-500 uppercase">FAULT RECONSTITUTE DETAILS</label>
                  <textarea
                    id="form-ticket-desc"
                    required
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded p-2 text-xs focus:ring-1 focus:ring-[#0054A6] placeholder-gray-300"
                    placeholder="Log fault indicators, error numbers, and operational impact..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                  <button
                    type="button"
                    id="cancel-ticket-btn"
                    onClick={() => setShowNewOrderForm(false)}
                    className="px-4 py-2 border border-gray-200 rounded text-xs text-gray-600 hover:bg-slate-50 font-sans font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="save-ticket-btn"
                    className="px-4 py-2 rounded text-xs text-white bg-[#0054A6] hover:bg-blue-800 font-sans font-bold cursor-pointer"
                  >
                    Index Support Order
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Core Interactive Diagnostic Workspace */}
          {selectedTicket ? (
            <div className="bg-white rounded-lg border border-gray-100 shadow-xs p-5 space-y-6">
              
              {/* Header card info */}
              <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-50 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-400 bg-slate-50 px-2 py-0.5 rounded border">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      selectedTicket.type === 'WARRANTY_REPAIR' ? 'bg-red-50 text-red-700' :
                      selectedTicket.type === 'CALIBRATION' ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-100 text-gray-600'
                    }`}>
                      {selectedTicket.type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-gray-800 mt-2 flex items-center gap-1.5 font-sans leading-snug">
                    <Wrench className="w-4 h-4 text-[#0054A6]" /> {selectedTicket.instrumentName}
                  </h3>
                  <div className="text-xs text-gray-500 font-sans mt-1">
                    CLIENT FACILITY: <span className="font-semibold text-gray-700">{selectedTicket.customerName}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    SN: <span className="font-mono font-semibold text-gray-600">{selectedTicket.serialNumber}</span>
                  </div>
                </div>

                {/* Priority Status indicator block */}
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-mono block mb-1 uppercase">TICKET STATUS</span>
                  <span className="px-3 py-1 font-mono font-bold bg-[#F5F8FC] border border-blue-150 text-[#0054A6] rounded text-xs">
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Technical Description Logs */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">Problem Statement log</h4>
                <div className="p-3.5 bg-slate-50 border border-gray-100 rounded text-xs leading-relaxed text-gray-600 font-sans">
                  <span className="font-bold text-gray-800 block mb-1">Subject: "{selectedTicket.subject}"</span>
                  {selectedTicket.description}
                </div>
              </div>

              {/* SECTION: Workshop Diagnostic Track (Module 8) */}
              <div className="space-y-3.5 pt-2">
                <h4 className="text-[10px] font-bold font-mono text-[#0054A6] uppercase tracking-widest flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" /> WORKSHOP FLOW STAGE REGULATION (ACTIVE TRACKER)
                </h4>
                
                {/* Visual Chevron/Stage Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1">
                  {WORKSHOP_STAGES.map((stg, sIdx) => {
                    const isCurrent = selectedTicket.status === stg;
                    const isPassed = WORKSHOP_STAGES.indexOf(selectedTicket.status) > sIdx;
                    return (
                      <button
                        key={stg}
                        id={`workshop-stage-${stg.toLowerCase()}`}
                        disabled={!isEngineerOrManager}
                        onClick={() => onUpdateTicketStatus(selectedTicket.id, stg)}
                        title={isEngineerOrManager ? `Manually trigger diagnostic state to ${stg}` : 'Authentication Lock'}
                        className={`text-[9px] font-mono p-1 px-1.5 border rounded text-center truncate select-none ${
                          isCurrent 
                            ? 'bg-[#0054A6] text-white font-extrabold border-[#0054A6] scale-102 shadow-xs' 
                            : isPassed 
                            ? 'bg-blue-50 text-[#0077C8] border-blue-150 font-semibold' 
                            : 'bg-white text-gray-400 border-gray-100 hover:bg-slate-50'
                        } ${isEngineerOrManager ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
                      >
                        {stg.replace('_', ' ')}
                      </button>
                    );
                  })}
                </div>

                {!isEngineerOrManager && (
                  <p className="text-[10px] text-gray-400 italic">
                    Note: Adjusting active workshop diagnostics phases is restricted to authorized Service Engineers or regional Managers. Switch user profile roles in the User Management tab to verify.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-50">
                
                {/* Block A: Engineer Assignment (Module 1) */}
                <div className="bg-slate-50/50 p-4 rounded-lg border border-gray-100 space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 uppercase font-mono tracking-wider mb-2">
                    <UserCheck className="w-4 h-4 text-[#0054A6]" /> Lead Certified Engineer
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0054A6] flex items-center justify-center font-bold font-mono text-sm">
                        {getInitials(selectedTicket.assignedEngineerName)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-800">
                          {selectedTicket.assignedEngineerName || 'No Engineer Appointed'}
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">
                          {selectedTicket.assignedEngineerName ? 'Certified Calibration Lead' : 'Awaiting Service Scheduler'}
                        </span>
                      </div>
                    </div>

                    {isEngineerOrManager && (
                      <div className="pt-2">
                        <label className="text-[10px] font-mono text-[#0077C8] font-bold block mb-1">REASSIGN CERTIFIED PERSONEL:</label>
                        <div className="flex gap-1">
                          {ENGINEERS.map(eng => (
                            <button
                              key={eng.id}
                              id={`assign-engineer-${eng.id}`}
                              onClick={() => onAssignEngineer(selectedTicket.id, eng.id, eng.name)}
                              className="text-[10px] bg-white border border-gray-100 hover:border-[#0054A6] hover:bg-[#F5F8FC] p-1.5 px-3 rounded font-sans font-bold cursor-pointer transition-all"
                            >
                              🚀 {getShortName(eng.name)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Block B: Parts & Billing Estimator (Module 6 & 7) */}
                <div className="bg-slate-50/50 p-4 rounded-lg border border-gray-100 space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 uppercase font-mono tracking-wider mb-2">
                    <DollarSign className="w-4 h-4 text-[#0054A6]" /> Costing Estimations & SLA Cover
                  </div>

                  <div className="space-y-3.5 text-xs font-sans text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>SLA CONTRACT BILLING COVER:</span>
                      <span className={`font-mono font-bold ${
                        selectedTicket.type === 'WARRANTY_REPAIR' || selectedTicket.type === 'WARRANTY_SERVICE' 
                          ? 'text-emerald-600' : 'text-orange-500'
                      }`}>
                        {selectedTicket.type === 'WARRANTY_REPAIR' || selectedTicket.type === 'WARRANTY_SERVICE' 
                          ? '100% UNDER WARRANTY' : ' AMC EXCLUDED BILLING'
                      }
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                      <span>STATED COST OF REPLACEMENT PARTS:</span>
                      <span className="font-mono font-bold text-gray-800">
                        {selectedTicket.estimatedCost ? `LKR ${selectedTicket.estimatedCost.toLocaleString()}` : 'LKR 0 (PM kit)'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>CLIENT BILLING RATIFICATION:</span>
                      <span className={`inline-flex items-center gap-1 font-bold font-mono text-[10px] ${
                        selectedTicket.billingApproved ? 'text-emerald-600' : 'text-orange-500'
                      }`}>
                        {selectedTicket.billingApproved ? (
                          <>
                            <ShieldCheck className="w-4 h-4" /> SECURED & SIGNED
                          </>
                        ) : 'PENDING SIGNATURE APPROVED'}
                      </span>
                    </div>

                    {/* Cost Inputs & Approval Buttons */}
                    <div className="pt-2 border-t border-gray-200 space-y-2">
                      {isEngineerOrManager && !selectedTicket.billingApproved && (
                        <div className="flex gap-1.5 items-center">
                          <input
                            id="parts-cost-input"
                            type="number"
                            className="bg-white border rounded p-1 text-[11px] font-mono w-24"
                            placeholder="Cost LKR"
                            value={spareCost === 0 ? '' : spareCost}
                            onChange={(e) => setSpareCost(Number(e.target.value))}
                          />
                          <button
                            id="issue-costing-btn"
                            disabled={spareCost <= 0}
                            onClick={() => {
                              onUpdateTicketPrice(selectedTicket.id, spareCost);
                              setSpareCost(0);
                            }}
                            className="text-[10px] text-white bg-[#0054A6] hover:bg-blue-800 font-sans font-bold p-1 px-2.5 rounded cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Update Estimate
                          </button>
                        </div>
                      )}

                      {/* Signoff trigger */}
                      {!selectedTicket.billingApproved && (isCustomer || isEngineerOrManager) && (
                        <button
                          id="approve-billing-btn"
                          onClick={() => onApproveTicketBilling(selectedTicket.id)}
                          className="w-full text-center text-xs text-white bg-[#22C55E] hover:bg-emerald-700 font-sans font-bold py-1.5 rounded cursor-pointer mt-1 flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Sign-off Cost & Proceed
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-[#F5F8FC] border border-gray-150 rounded-lg p-12 text-center text-gray-500 flex flex-col justify-center items-center h-[420px]">
              <Wrench className="w-12 h-12 text-gray-300 stroke-[1.5] mb-3" />
              <p className="font-sans text-sm">Please select an active ticket from the logging list</p>
              <p className="text-xs text-gray-400 font-sans mt-1">Or click 'File Ticket' above to schedule new diagnostic routines directly.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
