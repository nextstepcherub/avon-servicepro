import React, { useState } from 'react';
import { 
  InventoryItem, 
  StockMovement, 
  UserProfile, 
  Supplier, 
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderStatus,
  StockMovementType,
  Grn,
  GrnItem
} from '../../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Truck, 
  DollarSign, 
  FileText, 
  ChevronRight, 
  X, 
  Trash2, 
  ArrowRight, 
  CornerDownRight, 
  User, 
  PackageCheck,
  Send,
  Download,
  Building2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PurchasingManagementProps {
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  suppliers: Supplier[];
  activeUser: UserProfile;
  onUpdateInventory: (updatedInventory: InventoryItem[]) => void;
  onUpdateStockMovements: (updatedMovements: StockMovement[]) => void;
  onLogAudit: (action: string, previousValue?: string, newValue?: string, remarks?: string) => void;
  purchaseOrders: PurchaseOrder[];
  onUpdatePurchaseOrders: (updatedPOs: PurchaseOrder[]) => void;
  grns: Grn[];
  onUpdateGrns: (updatedGrns: Grn[]) => void;
}

const PO_WORKFLOW_STEPS: { status: PurchaseOrderStatus; label: string; desc: string }[] = [
  { status: 'Draft', label: 'Draft', desc: 'PO created and undergoing local edits' },
  { status: 'Pending Approval', label: 'Review', desc: 'Awaiting supervisory review & sign-off' },
  { status: 'Approved', label: 'Approved', desc: 'Authorized and cleared for dispatch' },
  { status: 'Ordered', label: 'Ordered', desc: 'Sent to manufacturer; parts in-transit' },
  { status: 'Received', label: 'Received', desc: 'All components received and put-away' }
];

export default function PurchasingManagement({
  inventory,
  stockMovements,
  suppliers,
  activeUser,
  onUpdateInventory,
  onUpdateStockMovements,
  onLogAudit,
  purchaseOrders,
  onUpdatePurchaseOrders,
  grns,
  onUpdateGrns
}: PurchasingManagementProps) {
  // UI Tabs & States
  const [activeTab, setActiveTab] = useState<'po-list' | 'po-create' | 'grn-list'>('po-list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  // GRN Ledger States
  const [grnSearchQuery, setGrnSearchQuery] = useState('');
  const [selectedGrn, setSelectedGrn] = useState<Grn | null>(null);

  // Goods Received Note Wizard States
  const [showGrnWizard, setShowGrnWizard] = useState(false);
  const [wizardPO, setWizardPO] = useState<PurchaseOrder | null>(null);
  const [grnNumberInput, setGrnNumberInput] = useState('');
  const [deliveryNoteInput, setDeliveryNoteInput] = useState('');
  const [invoiceInput, setInvoiceInput] = useState('');
  const [inspectionPassedInput, setInspectionPassedInput] = useState(true);
  const [grnRemarksInput, setGrnRemarksInput] = useState('');
  const [wizardItems, setWizardItems] = useState<{
    itemId: string;
    partCode: string;
    partName: string;
    orderedQty: number;
    previouslyReceivedQty: number;
    receivedQty: number;
    acceptedQty: number;
    rejectedQty: number;
    remarks: string;
  }[]>([]);

  // Database Transaction Simulator States
  const [isCommittingGrn, setIsCommittingGrn] = useState(false);
  const [commitLogs, setCommitLogs] = useState<string[]>([]);
  const [commitStep, setCommitStep] = useState(0);

  // Form States for PO Creation
  const [formSupplierId, setFormSupplierId] = useState('');
  const [formShippingTerms, setFormShippingTerms] = useState('CIF Colombo Port');
  const [formExpectedDelivery, setFormExpectedDelivery] = useState('');
  const [formRemarks, setFormRemarks] = useState('');
  const [formItems, setFormItems] = useState<{ itemId: string; quantity: number; unitPrice: number }[]>([
    { itemId: '', quantity: 1, unitPrice: 0 }
  ]);

  // Approval remarks in detail view
  const [approvalRemarksInput, setApprovalRemarksInput] = useState('');
  
  // Quick error/success banner states
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Permission checks
  const isSupervisor = ['System Admin', 'Admin', 'Service Manager', 'Workshop Manager'].includes(activeUser.role);

  // Show status banner helper
  const triggerFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  // -------------------------------------------------------------
  // CALCULATIONS & METRICS
  // -------------------------------------------------------------
  const metrics = {
    totalSpendLKR: purchaseOrders
      .filter(po => po.status !== 'Cancelled' && po.status !== 'Rejected')
      .reduce((sum, po) => sum + po.totalCost, 0),
    pendingApprovalCount: purchaseOrders.filter(po => po.status === 'Pending Approval').length,
    activeOrderedCount: purchaseOrders.filter(po => po.status === 'Ordered' || po.status === 'Partially Received').length,
    completedPoCount: purchaseOrders.filter(po => po.status === 'Received').length,
  };

  // -------------------------------------------------------------
  // PO GENERATION
  // -------------------------------------------------------------
  const handleAddFormItem = () => {
    setFormItems([...formItems, { itemId: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveFormItem = (index: number) => {
    if (formItems.length === 1) return;
    const updated = [...formItems];
    updated.splice(index, 1);
    setFormItems(updated);
  };

  const handleFormItemChange = (index: number, field: 'itemId' | 'quantity' | 'unitPrice', value: any) => {
    const updated = [...formItems];
    if (field === 'itemId') {
      const selectedPart = inventory.find(part => part.id === value);
      updated[index] = {
        itemId: value,
        quantity: updated[index].quantity,
        unitPrice: selectedPart ? selectedPart.unitPrice : 0
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
    }
    setFormItems(updated);
  };

  const calculateFormTotals = () => {
    const subTotal = formItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    const taxAmount = parseFloat((subTotal * 0.08).toFixed(2)); // Standard 8% VAT
    const shippingCost = subTotal > 0 ? 15000 : 0; // Default flat-rate freight
    const totalCost = subTotal + taxAmount + shippingCost;
    return { subTotal, taxAmount, shippingCost, totalCost };
  };

  const handleCreatePO = (e: React.FormEvent, submitDirectlyForApproval: boolean) => {
    e.preventDefault();

    if (!formSupplierId) {
      triggerFeedback('error', 'Please select a valid Manufacturer / Supplier.');
      return;
    }

    // Validate items
    const invalidItems = formItems.some(item => !item.itemId || item.quantity <= 0 || item.unitPrice < 0);
    if (invalidItems) {
      triggerFeedback('error', 'Please ensure all PO items are selected with valid positive quantities.');
      return;
    }

    const selectedSupplier = suppliers.find(sup => sup.id === formSupplierId);
    if (!selectedSupplier) {
      triggerFeedback('error', 'Supplier details could not be resolved.');
      return;
    }

    const { subTotal, taxAmount, shippingCost, totalCost } = calculateFormTotals();

    // Create item objects
    const items: PurchaseOrderItem[] = formItems.map((formItem, index) => {
      const part = inventory.find(p => p.id === formItem.itemId)!;
      return {
        id: `poi_${Date.now()}_${index}`,
        itemId: formItem.itemId,
        partCode: part.partCode,
        partName: part.partName,
        quantity: Number(formItem.quantity),
        unitPrice: Number(formItem.unitPrice),
        totalPrice: formItem.quantity * formItem.unitPrice
      };
    });

    const year = new Date().getFullYear();
    const currentSeq = purchaseOrders.length + 1;
    const paddedSeq = String(currentSeq).padStart(5, '0');
    const poNumber = `PO-${year}-${paddedSeq}`;

    const newPO: PurchaseOrder = {
      id: `po_${Date.now()}`,
      poNumber,
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      supplierCode: selectedSupplier.code || 'SUP-AVN',
      items,
      status: submitDirectlyForApproval ? 'Pending Approval' : 'Draft',
      subTotal,
      taxAmount,
      shippingCost,
      totalCost,
      createdById: activeUser.id,
      createdByName: activeUser.name,
      createdByRole: activeUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      remarks: formRemarks,
      shippingTerms: formShippingTerms,
      expectedDeliveryDate: formExpectedDelivery || undefined
    };

    const updatedPOs = [newPO, ...purchaseOrders];
    onUpdatePurchaseOrders(updatedPOs);

    // Update in-transit quantities in inventory if submitted/approved directly?
    // In-transit usually increments when PO changes to 'Ordered'. We handle it there!

    // Log Audit Action
    const actionDesc = submitDirectlyForApproval ? 'SUBMIT_PO_FOR_APPROVAL' : 'CREATE_PO_DRAFT';
    onLogAudit(
      actionDesc,
      undefined,
      poNumber,
      `Created Purchase Order ${poNumber} for ${selectedSupplier.name}. Total LKR ${totalCost.toLocaleString('en-US')}.`
    );

    // Reset Form
    setFormSupplierId('');
    setFormShippingTerms('CIF Colombo Port');
    setFormExpectedDelivery('');
    setFormRemarks('');
    setFormItems([{ itemId: '', quantity: 1, unitPrice: 0 }]);
    setActiveTab('po-list');
    setSelectedPO(newPO); // Open detail view directly

    triggerFeedback('success', `Successfully created ${poNumber} in ${newPO.status} state.`);
  };

  // -------------------------------------------------------------
  // WORKFLOW TRANSITIONS
  // -------------------------------------------------------------
  const handleTransitionStatus = (po: PurchaseOrder, targetStatus: PurchaseOrderStatus, remarksText: string = '') => {
    let updatedPO = { ...po, updatedAt: new Date().toISOString() };
    const prevStatus = po.status;

    if (targetStatus === 'Approved') {
      if (!isSupervisor) {
        triggerFeedback('error', 'Unauthorized. Only managers or admins can approve Purchase Orders.');
        return;
      }
      updatedPO.status = 'Approved';
      updatedPO.approvedById = activeUser.id;
      updatedPO.approvedByName = activeUser.name;
      updatedPO.approvedAt = new Date().toISOString();
      updatedPO.approvalRemarks = remarksText || 'Approved under standard operating procedure.';
    } else if (targetStatus === 'Rejected') {
      if (!isSupervisor) {
        triggerFeedback('error', 'Unauthorized. Only managers or admins can reject Purchase Orders.');
        return;
      }
      updatedPO.status = 'Rejected';
      updatedPO.approvedById = activeUser.id;
      updatedPO.approvedByName = activeUser.name;
      updatedPO.approvedAt = new Date().toISOString();
      updatedPO.approvalRemarks = remarksText || 'Rejected following supervisor review.';
    } else if (targetStatus === 'Ordered') {
      updatedPO.status = 'Ordered';
      updatedPO.remarks = po.remarks ? `${po.remarks}\n[Ordered on ${new Date().toLocaleDateString()}]` : `Ordered on ${new Date().toLocaleDateString()}`;
      
      // Real Stock Integration: Increment inTransitQty for parts in inventory!
      const updatedInventory = inventory.map(part => {
        const poItem = po.items.find(item => item.itemId === part.id);
        if (poItem) {
          return {
            ...part,
            inTransitQty: part.inTransitQty + poItem.quantity
          };
        }
        return part;
      });
      onUpdateInventory(updatedInventory);
    } else if (targetStatus === 'Pending Approval') {
      updatedPO.status = 'Pending Approval';
    } else if (targetStatus === 'Cancelled') {
      updatedPO.status = 'Cancelled';
      
      // If was previously 'Ordered', remove inTransitQty from inventory
      if (prevStatus === 'Ordered' || prevStatus === 'Partially Received') {
        const updatedInventory = inventory.map(part => {
          const poItem = po.items.find(item => item.itemId === part.id);
          if (poItem) {
            return {
              ...part,
              inTransitQty: Math.max(0, part.inTransitQty - poItem.quantity)
            };
          }
          return part;
        });
        onUpdateInventory(updatedInventory);
      }
    }

    const updatedPOs = purchaseOrders.map(p => p.id === po.id ? updatedPO : p);
    onUpdatePurchaseOrders(updatedPOs);
    setSelectedPO(updatedPO);

    onLogAudit(
      'UPDATE_PO_STATUS',
      prevStatus,
      targetStatus,
      `Transitioned ${po.poNumber} status from ${prevStatus} to ${targetStatus}.`
    );

    triggerFeedback('success', `Purchase Order ${po.poNumber} is now ${targetStatus}.`);
    setApprovalRemarksInput('');
  };

  // -------------------------------------------------------------
  // RECEIVING GOODS INTAKE
  // -------------------------------------------------------------
  const [receivingQuantities, setReceivingQuantities] = useState<Record<string, number>>({});

  const handleReceivePOItem = (po: PurchaseOrder, itemId: string, qtyToReceive: number) => {
    if (qtyToReceive <= 0) {
      triggerFeedback('error', 'Please enter a positive quantity to receive.');
      return;
    }

    const poItem = po.items.find(item => item.itemId === itemId);
    if (!poItem) return;

    if (qtyToReceive > poItem.quantity) {
      triggerFeedback('error', `Cannot receive more than the ordered quantity (${poItem.quantity}).`);
      return;
    }

    // Update PO Status
    let updatedPO = { ...po, updatedAt: new Date().toISOString() };
    
    // For local storage mock simplicity, we will mark the whole PO as Received or Partially Received
    // when user clicks "Receive Full Order" or receives individual items.
    // Let's implement an elegant fully integrated receiving flow:
    
    // 1. Update the inventory quantities
    const updatedInventory = inventory.map(part => {
      if (part.id === itemId) {
        const newOnHand = part.onHandQty + qtyToReceive;
        // Reduce in-transit
        const newInTransit = Math.max(0, part.inTransitQty - qtyToReceive);
        return {
          ...part,
          onHandQty: newOnHand,
          availableQty: newOnHand - part.allocatedQty,
          inTransitQty: newInTransit
        };
      }
      return part;
    });
    onUpdateInventory(updatedInventory);

    // 2. Append a stock movement record of type PURCHASE
    const partDetails = inventory.find(p => p.id === itemId)!;
    const newMovement: StockMovement = {
      id: `mov_purchase_${Date.now()}`,
      itemId,
      partCode: partDetails.partCode,
      partName: partDetails.partName,
      type: 'PURCHASE',
      quantity: qtyToReceive,
      direction: 'IN',
      referenceDoc: po.poNumber,
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      timestamp: new Date().toISOString(),
      remarks: `Goods receipt from Purchase Order ${po.poNumber}.`
    };
    onUpdateStockMovements([newMovement, ...stockMovements]);

    // 3. Update PO status to Received
    updatedPO.status = 'Received';
    
    const updatedPOs = purchaseOrders.map(p => p.id === po.id ? updatedPO : p);
    onUpdatePurchaseOrders(updatedPOs);
    setSelectedPO(updatedPO);

    onLogAudit(
      'RECEIVE_PO_GOODS',
      po.status,
      'Received',
      `Received ${qtyToReceive} units of ${partDetails.partCode} (${partDetails.partName}) from PO ${po.poNumber}. Stock levels updated.`
    );

    triggerFeedback('success', `Successfully processed goods receipt for ${partDetails.partCode}. Inventory updated.`);
  };

  const handleReceiveFullPO = (po: PurchaseOrder) => {
    // 1. Update all parts in inventory
    const updatedInventory = inventory.map(part => {
      const poItem = po.items.find(item => item.itemId === part.id);
      if (poItem) {
        const newOnHand = part.onHandQty + poItem.quantity;
        const newInTransit = Math.max(0, part.inTransitQty - poItem.quantity);
        return {
          ...part,
          onHandQty: newOnHand,
          availableQty: newOnHand - part.allocatedQty,
          inTransitQty: newInTransit
        };
      }
      return part;
    });
    onUpdateInventory(updatedInventory);

    // 2. Create stock movements for each item
    const newMovements: StockMovement[] = po.items.map((item, index) => ({
      id: `mov_bulk_po_${Date.now()}_${index}`,
      itemId: item.itemId,
      partCode: item.partCode,
      partName: item.partName,
      type: 'PURCHASE',
      quantity: item.quantity,
      direction: 'IN',
      referenceDoc: po.poNumber,
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      timestamp: new Date().toISOString(),
      remarks: `Full bulk goods receipt against Purchase Order ${po.poNumber}.`
    }));
    onUpdateStockMovements([...newMovements, ...stockMovements]);

    // 3. Mark PO as Received
    const updatedPO: PurchaseOrder = {
      ...po,
      status: 'Received',
      updatedAt: new Date().toISOString()
    };
    const updatedPOs = purchaseOrders.map(p => p.id === po.id ? updatedPO : p);
    onUpdatePurchaseOrders(updatedPOs);
    setSelectedPO(updatedPO);

    onLogAudit(
      'RECEIVE_FULL_PO',
      po.status,
      'Received',
      `Full quantity delivery received for Purchase Order ${po.poNumber}. Added ${po.items.length} item lines to active warehouse stock.`
    );

    triggerFeedback('success', `All parts received from ${po.poNumber}. Main spares registry and stock cards updated!`);
  };

  // -------------------------------------------------------------
  // ADVANCED GOODS RECEIVING (GRN) LIFECYCLE & TRANSACTION SAFETY
  // -------------------------------------------------------------
  const handleOpenGrnWizard = (po: PurchaseOrder) => {
    setWizardPO(po);
    const year = new Date().getFullYear();
    const seq = grns.length + 1;
    const padded = String(seq).padStart(5, '0');
    setGrnNumberInput(`GRN-${year}-${padded}`);
    setDeliveryNoteInput('');
    setInvoiceInput('');
    setInspectionPassedInput(true);
    setGrnRemarksInput('');
    
    // Build GRN line items from the PO items
    const items = po.items.map(item => {
      const previouslyReceived = item.receivedQty || 0;
      const outstanding = Math.max(0, item.quantity - previouslyReceived);
      return {
        itemId: item.itemId,
        partCode: item.partCode,
        partName: item.partName,
        orderedQty: item.quantity,
        previouslyReceivedQty: previouslyReceived,
        receivedQty: outstanding, // default to receiving everything outstanding
        acceptedQty: outstanding, // default to accepting everything received
        rejectedQty: 0,
        remarks: ''
      };
    });
    setWizardItems(items);
    setShowGrnWizard(true);
  };

  const handleCommitGrnTransaction = () => {
    if (!wizardPO) return;
    
    // Perform basic validation before starting transaction
    const hasInvalidQuantities = wizardItems.some(item => {
      const outstanding = item.orderedQty - item.previouslyReceivedQty;
      return item.receivedQty < 0 || item.receivedQty > outstanding ||
             item.acceptedQty < 0 || item.acceptedQty > item.receivedQty;
    });
    
    if (hasInvalidQuantities) {
      triggerFeedback('error', 'Please enter valid quantities. Received cannot exceed outstanding, and accepted cannot exceed received.');
      return;
    }

    const hasNoReceivedQty = wizardItems.every(item => item.receivedQty === 0);
    if (hasNoReceivedQty) {
      triggerFeedback('error', 'Please enter at least one item with a received quantity greater than 0.');
      return;
    }

    setIsCommittingGrn(true);
    setCommitStep(0);
    setCommitLogs([]);

    const logs: string[] = [];
    const addLog = (text: string) => {
      logs.push(`[${new Date().toLocaleTimeString()}] ${text}`);
      setCommitLogs([...logs]);
    };

    // Staggered log outputs to show full MariaDB ACID transaction safety steps!
    const runStep = (stepIndex: number) => {
      setCommitStep(stepIndex);
      switch (stepIndex) {
        case 0:
          addLog("Establishing connection to enterprise MariaDB cluster pool (Primary node)...");
          setTimeout(() => runStep(1), 350);
          break;
        case 1:
          addLog("DML Execution Initialized: BEGIN TRANSACTION (isolation level: SERIALIZABLE);");
          addLog("Selecting current stock cards and acquiring active Row-Level write locks: SELECT * FROM public.inventory WHERE id IN (...) FOR UPDATE;");
          setTimeout(() => runStep(2), 450);
          break;
        case 2:
          addLog(`Preparing Goods Received Note header record with unique constraints checked: GRN ID = grn_${Date.now()}`);
          addLog(`INSERT INTO public.goods_received_notes (id, grn_number, po_id, po_number, supplier_id, status, inspection_passed, received_by_id) VALUES ('grn_${Date.now()}', '${grnNumberInput}', '${wizardPO.id}', '${wizardPO.poNumber}', '${wizardPO.supplierId}', 'Verified', ${inspectionPassedInput ? 'TRUE' : 'FALSE'}, '${activeUser.id}');`);
          setTimeout(() => runStep(3), 450);
          break;
        case 3:
          addLog("Writing child GRN line item records into database (goods_received_note_items):");
          wizardItems.forEach(item => {
            if (item.receivedQty > 0) {
              addLog(`  -> INSERT INTO goods_received_note_items (grn_id, item_id, part_code, ordered_qty, received_qty, accepted_qty, rejected_qty) VALUES ('grn_${Date.now()}', '${item.itemId}', '${item.partCode}', ${item.orderedQty}, ${item.receivedQty}, ${item.acceptedQty}, ${item.rejectedQty});`);
            }
          });
          setTimeout(() => runStep(4), 500);
          break;
        case 4:
          addLog("Updating active warehouse inventory levels. Incrementing on-hand stock and decrementing in-transit amounts:");
          wizardItems.forEach(item => {
            if (item.receivedQty > 0) {
              const part = inventory.find(p => p.id === item.itemId);
              if (part) {
                const updatedOnHand = part.onHandQty + item.acceptedQty;
                const updatedInTransit = Math.max(0, part.inTransitQty - item.receivedQty);
                addLog(`  -> Part ${item.partCode}: UPDATE public.inventory SET on_hand_qty = ${updatedOnHand}, in_transit_qty = ${updatedInTransit}, available_qty = ${updatedOnHand - part.allocatedQty} WHERE id = '${item.itemId}';`);
              }
            }
          });
          setTimeout(() => runStep(5), 550);
          break;
        case 5:
          addLog("Registering stock movement transactions for audit traceability:");
          wizardItems.forEach(item => {
            if (item.receivedQty > 0) {
              addLog(`  -> INSERT INTO public.stock_movements (id, item_id, part_code, type, quantity, direction, reference_doc) VALUES ('mov_${Date.now()}', '${item.itemId}', '${item.partCode}', 'PURCHASE', ${item.acceptedQty}, 'IN', '${grnNumberInput}');`);
            }
          });
          setTimeout(() => runStep(6), 500);
          break;
        case 6:
          addLog("Updating Purchase Order items. Setting accumulated received quantities:");
          wizardItems.forEach(item => {
            if (item.receivedQty > 0) {
              const previousTotal = item.previouslyReceivedQty;
              addLog(`  -> PO ${wizardPO.poNumber} Item ${item.partCode}: SET received_qty = ${previousTotal + item.receivedQty} (Previous: ${previousTotal});`);
            }
          });
          setTimeout(() => runStep(7), 450);
          break;
        case 7:
          // Check PO status
          let isFullyReceived = true;
          wizardPO.items.forEach(poItem => {
            const grnItem = wizardItems.find(wi => wi.itemId === poItem.itemId);
            const currentTotal = (poItem.receivedQty || 0) + (grnItem ? grnItem.receivedQty : 0);
            if (currentTotal < poItem.quantity) {
              isFullyReceived = false;
            }
          });
          const targetPOStatus = isFullyReceived ? 'Received' : 'Partially Received';
          addLog(`Adjusting Purchase Order Status to reflect receiving state:`);
          addLog(`  -> UPDATE public.purchase_orders SET status = '${targetPOStatus}', updated_at = NOW() WHERE id = '${wizardPO.id}';`);
          setTimeout(() => runStep(8), 400);
          break;
        case 8:
          addLog("Checking SQL constraints and foreign keys... All OK. Executing final transaction COMMIT;");
          setTimeout(() => runStep(9), 350);
          break;
        case 9:
          addLog(`COMMIT SUCCESSFUL. Changes persisted into MariaDB!`);
          setTimeout(() => {
            finalizeActualGrnCommit();
          }, 300);
          break;
      }
    };

    runStep(0);
  };

  const finalizeActualGrnCommit = () => {
    if (!wizardPO) return;

    const grnId = `grn_${Date.now()}`;
    const newGrnItems: GrnItem[] = wizardItems
      .filter(item => item.receivedQty > 0)
      .map((item, index) => ({
        id: `grni_${Date.now()}_${index}`,
        itemId: item.itemId,
        partCode: item.partCode,
        partName: item.partName,
        orderedQty: item.orderedQty,
        receivedQty: item.receivedQty,
        acceptedQty: item.acceptedQty,
        rejectedQty: item.rejectedQty,
        remarks: item.remarks || undefined
      }));

    const newGrn: Grn = {
      id: grnId,
      grnNumber: grnNumberInput,
      poId: wizardPO.id,
      poNumber: wizardPO.poNumber,
      supplierId: wizardPO.supplierId,
      supplierName: wizardPO.supplierName,
      deliveryNoteNumber: deliveryNoteInput || undefined,
      invoiceNumber: invoiceInput || undefined,
      receivedById: activeUser.id,
      receivedByName: activeUser.name,
      receivedByRole: activeUser.role,
      receivedAt: new Date().toISOString(),
      items: newGrnItems,
      remarks: grnRemarksInput || undefined,
      status: 'Verified',
      inspectionPassed: inspectionPassedInput
    };

    // 1. Update Inventory
    const updatedInventory = inventory.map(part => {
      const grnItem = wizardItems.find(wi => wi.itemId === part.id);
      if (grnItem && grnItem.receivedQty > 0) {
        const newOnHand = part.onHandQty + grnItem.acceptedQty;
        const newInTransit = Math.max(0, part.inTransitQty - grnItem.receivedQty);
        return {
          ...part,
          onHandQty: newOnHand,
          availableQty: newOnHand - part.allocatedQty,
          inTransitQty: newInTransit
        };
      }
      return part;
    });

    // 2. Update Stock Movements
    const newMovements: StockMovement[] = wizardItems
      .filter(item => item.receivedQty > 0)
      .map((item, index) => ({
        id: `mov_grn_${Date.now()}_${index}`,
        itemId: item.itemId,
        partCode: item.partCode,
        partName: item.partName,
        type: 'PURCHASE',
        quantity: item.acceptedQty,
        direction: 'IN',
        referenceDoc: grnNumberInput,
        userId: activeUser.id,
        userName: activeUser.name,
        userRole: activeUser.role,
        timestamp: new Date().toISOString(),
        remarks: `Received via ${grnNumberInput} for PO ${wizardPO.poNumber}. Passed inspection: ${inspectionPassedInput ? 'YES' : 'NO'}`
      }));

    // 3. Update PO lines receivedQty
    const updatedPoItems = wizardPO.items.map(poItem => {
      const grnItem = wizardItems.find(wi => wi.itemId === poItem.itemId);
      if (grnItem) {
        return {
          ...poItem,
          receivedQty: (poItem.receivedQty || 0) + grnItem.receivedQty
        };
      }
      return poItem;
    });

    // Determine final status
    let isFullyReceived = true;
    updatedPoItems.forEach(item => {
      if ((item.receivedQty || 0) < item.quantity) {
        isFullyReceived = false;
      }
    });

    const finalPOStatus: PurchaseOrderStatus = isFullyReceived ? 'Received' : 'Partially Received';

    const updatedPO: PurchaseOrder = {
      ...wizardPO,
      items: updatedPoItems,
      status: finalPOStatus,
      updatedAt: new Date().toISOString()
    };

    const updatedPurchaseOrders = purchaseOrders.map(p => p.id === wizardPO.id ? updatedPO : p);
    const updatedGrns = [newGrn, ...grns];

    // Push state updates
    onUpdateInventory(updatedInventory);
    onUpdateStockMovements([...newMovements, ...stockMovements]);
    onUpdatePurchaseOrders(updatedPurchaseOrders);
    onUpdateGrns(updatedGrns);

    // Audit Log
    onLogAudit(
      'CREATE_GRN',
      undefined,
      grnNumberInput,
      `Verified and Committed Goods Received Note ${grnNumberInput} linked to PO ${wizardPO.poNumber}. Stock cards updated.`
    );

    // Close and Reset Wizard States
    setShowGrnWizard(false);
    setIsCommittingGrn(false);
    setWizardPO(null);
    setSelectedPO(updatedPO); // Refresh the active details panel
    triggerFeedback('success', `Transaction committed. Goods Received Note ${grnNumberInput} successfully created.`);
  };

  // -------------------------------------------------------------
  // RENDERING & FILTERING
  // -------------------------------------------------------------
  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = 
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.items.some(item => item.partName.toLowerCase().includes(searchQuery.toLowerCase()) || item.partCode.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Upper Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
            Procurement & Goods Receiving
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Manage manufacturer pricing agreements, request spare parts, and verify QA status upon intake.
          </p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('po-list');
              setSelectedPO(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'po-list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> PO Ledger
          </button>
          
          <button
            onClick={() => {
              setActiveTab('po-create');
              setSelectedPO(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'po-create' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Raise PO
          </button>

          <button
            onClick={() => {
              setActiveTab('grn-list');
              setSelectedGrn(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grn-list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" /> GRN Registry
          </button>
        </div>
      </div>

      {/* Analytics Bento Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Total Commitments</span>
            <span className="text-lg font-black text-slate-800 font-mono">
              LKR {metrics.totalSpendLKR.toLocaleString('en-US')}
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Pending Approvals</span>
            <span className="text-lg font-black text-slate-800 font-mono flex items-center gap-1.5">
              {metrics.pendingApprovalCount}
              {metrics.pendingApprovalCount > 0 && (
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              )}
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Active In-Transit</span>
            <span className="text-lg font-black text-slate-800 font-mono">
              {metrics.activeOrderedCount} POs
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Completed Receipts</span>
            <span className="text-lg font-black text-slate-800 font-mono">
              {metrics.completedPoCount} Orders
            </span>
          </div>
        </div>

      </div>

      {/* Feedback messaging banner */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl text-xs font-bold border flex items-center gap-3 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div>{feedbackMsg.text}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TWO COLUMN MASTER DETAIL OR CREATION SHEET */}
      {activeTab === 'po-list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT: PO LEDGER & SEARCH (Col-Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search PO#, supplier or part..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end">
                {['ALL', 'Draft', 'Pending Approval', 'Approved', 'Ordered', 'Received', 'Cancelled'].map(status => {
                  const isActive = statusFilter === status;
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-850 text-white shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50'
                      }`}
                    >
                      {status === 'ALL' ? 'Show All' : status}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* PO Cards/List Grid */}
            <div className="space-y-3">
              {filteredPOs.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-150 shadow-sm text-slate-400 italic">
                  No Purchase Orders match the search query or status criteria.
                </div>
              ) : (
                filteredPOs.map(po => {
                  const isSelected = selectedPO?.id === po.id;
                  const totalItemsQty = po.items.reduce((acc, i) => acc + i.quantity, 0);

                  // Status Badge Styling helper
                  const getStatusBadge = (status: PurchaseOrderStatus) => {
                    switch (status) {
                      case 'Draft':
                        return 'bg-slate-100 text-slate-700 border-slate-200';
                      case 'Pending Approval':
                        return 'bg-amber-50 text-amber-700 border-amber-200/60 animate-pulse';
                      case 'Approved':
                        return 'bg-blue-50 text-blue-700 border-blue-200/60';
                      case 'Rejected':
                        return 'bg-rose-50 text-rose-700 border-rose-200/60';
                      case 'Ordered':
                        return 'bg-purple-50 text-purple-700 border-purple-200/60';
                      case 'Received':
                        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
                      case 'Cancelled':
                        return 'bg-slate-100 text-slate-400 border-slate-200/50 line-through';
                    }
                  };

                  return (
                    <div
                      key={po.id}
                      onClick={() => setSelectedPO(po)}
                      className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isSelected ? 'border-blue-600 ring-2 ring-blue-600/5' : 'border-slate-150'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-black text-sm text-slate-800 tracking-tight">
                            {po.poNumber}
                          </span>
                          <span className={`px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold uppercase tracking-wider ${getStatusBadge(po.status)}`}>
                            {po.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-500">
                          <span className="text-slate-700 font-bold flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" /> {po.supplierName}
                          </span>
                          <span>•</span>
                          <span>{totalItemsQty} items</span>
                          <span>•</span>
                          <span className="font-mono text-slate-600">Expected: {po.expectedDeliveryDate || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50">
                        <div className="text-left md:text-right">
                          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">PO Value</span>
                          <span className="text-sm font-extrabold font-mono text-blue-600">
                            LKR {po.totalCost.toLocaleString('en-US')}
                          </span>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isSelected ? 'translate-x-1 text-blue-600' : ''}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT: PO WORKFLOW DETAIL VIEW PANEL (Col-Span 1) */}
          <div className="bg-white rounded-2xl border border-slate-150 shadow-md p-6 sticky top-24">
            {selectedPO ? (
              <div className="space-y-6">
                
                {/* Panel Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Active Workspace PO</span>
                    <h3 className="font-mono font-black text-lg text-slate-800 tracking-tight">{selectedPO.poNumber}</h3>
                    <p className="text-[11px] font-bold text-slate-500 mt-1">{selectedPO.supplierName}</p>
                  </div>
                  <button onClick={() => setSelectedPO(null)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* VISUAL WORKFLOW PROGRESS STEPPER */}
                <div className="py-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-3">PO Workflow State</span>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-2 right-2 h-0.5 bg-slate-100 top-4 -z-10" />
                    {PO_WORKFLOW_STEPS.map((step, idx) => {
                      const getStepStatus = () => {
                        const currentIdx = PO_WORKFLOW_STEPS.findIndex(s => s.status === selectedPO.status);
                        if (selectedPO.status === 'Cancelled' || selectedPO.status === 'Rejected') {
                          return 'cancelled';
                        }
                        if (idx < currentIdx) return 'completed';
                        if (idx === currentIdx) return 'active';
                        return 'pending';
                      };

                      const status = getStepStatus();

                      return (
                        <div key={step.status} className="flex flex-col items-center flex-1 text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black uppercase border-2 transition-all ${
                            status === 'completed'
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : status === 'active'
                              ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/10'
                              : status === 'cancelled'
                              ? 'bg-rose-50 border-rose-300 text-rose-600'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`text-[9px] font-extrabold mt-1.5 tracking-wider uppercase block ${
                            status === 'active' ? 'text-blue-600 font-black' : 'text-slate-400'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* workflow remarks banner if rejected or cancelled */}
                {(selectedPO.status === 'Rejected' || selectedPO.status === 'Cancelled') && (
                  <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl flex gap-2.5 text-xs text-rose-800">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold uppercase text-[10px] block text-rose-600">PO workflow terminated</span>
                      <p className="mt-0.5 font-medium">{selectedPO.approvalRemarks || 'Cancelled by coordinator.'}</p>
                    </div>
                  </div>
                )}

                {/* LINE ITEMS */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Requested Items</span>
                  <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                    {selectedPO.items.map(item => (
                      <div key={item.id} className="py-2.5 flex justify-between gap-4 text-xs font-semibold">
                        <div className="space-y-0.5">
                          <span className="text-slate-800 font-bold block">{item.partName}</span>
                          <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">Code: {item.partCode}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-slate-600 block">{item.quantity} units @ LKR {item.unitPrice.toLocaleString('en-US')}</span>
                          <span className="text-[11px] font-mono text-slate-400 block">Total: LKR {item.totalPrice.toLocaleString('en-US')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FINANCES BREAKDOWN */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs font-semibold space-y-2 font-mono">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>LKR {selectedPO.subTotal.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>VAT (8%):</span>
                    <span>LKR {selectedPO.taxAmount.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Flat-rate Ocean Freight:</span>
                    <span>LKR {selectedPO.shippingCost.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-black border-t border-slate-200 pt-2 text-sm">
                    <span>Total Cost (LKR):</span>
                    <span>LKR {selectedPO.totalCost.toLocaleString('en-US')}</span>
                  </div>
                </div>

                {/* AUDIT DETAILS */}
                <div className="space-y-2.5 text-[11px] font-semibold text-slate-500 bg-slate-50/50 p-3.5 border border-slate-100 rounded-xl">
                  <div className="flex justify-between">
                    <span>Requested By:</span>
                    <span className="text-slate-700">{selectedPO.createdByName} ({selectedPO.createdByRole})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created Date:</span>
                    <span className="text-slate-700">{new Date(selectedPO.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selectedPO.approvedByName && (
                    <>
                      <div className="flex justify-between">
                        <span>Supervisor Reviewer:</span>
                        <span className="text-slate-700">{selectedPO.approvedByName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reviewed Date:</span>
                        <span className="text-slate-700">{new Date(selectedPO.approvedAt!).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                  {selectedPO.shippingTerms && (
                    <div className="flex justify-between">
                      <span>Incoterms:</span>
                      <span className="text-slate-700">{selectedPO.shippingTerms}</span>
                    </div>
                  )}
                </div>

                {/* ACTION TRIGGER BUTTONS */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  
                  {/* WORKFLOW 1: DRAFT CONTROLS */}
                  {selectedPO.status === 'Draft' && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleTransitionStatus(selectedPO, 'Cancelled')}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel PO
                      </button>
                      <button
                        onClick={() => handleTransitionStatus(selectedPO, 'Pending Approval')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit PO
                      </button>
                    </div>
                  )}

                  {/* WORKFLOW 2: APPROVAL CONTROLS (PENDING APPROVAL) */}
                  {selectedPO.status === 'Pending Approval' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Supervisor Review Remarks</label>
                        <textarea
                          placeholder="Provide approval verification notes or rejection reasons..."
                          value={approvalRemarksInput}
                          onChange={(e) => setApprovalRemarksInput(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                        />
                      </div>

                      {isSupervisor ? (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleTransitionStatus(selectedPO, 'Rejected', approvalRemarksInput)}
                            className="px-4 py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" /> Reject PO
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTransitionStatus(selectedPO, 'Approved', approvalRemarksInput)}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Approve PO
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 border border-amber-200/50 rounded-xl text-[11px] font-bold text-amber-800 text-center animate-pulse">
                          Awaiting supervisory approval. Your current role does not have authorization to approve POs.
                        </div>
                      )}
                    </div>
                  )}

                  {/* WORKFLOW 3: APPROVED CONTROLS */}
                  {selectedPO.status === 'Approved' && (
                    <button
                      onClick={() => handleTransitionStatus(selectedPO, 'Ordered')}
                      className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/10 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Truck className="w-4 h-4" /> Place Order with Manufacturer
                    </button>
                  )}

                  {/* WORKFLOW 4: ORDERED CONTROLS (RECEIVING GOODS) */}
                  {(selectedPO.status === 'Ordered' || selectedPO.status === 'Partially Received') && (
                    <div className="p-4 bg-blue-50 border border-blue-150 rounded-xl space-y-3">
                      <div className="flex items-center gap-2">
                        <PackageCheck className="w-5 h-5 text-blue-600 font-bold" />
                        <div>
                          <span className="text-[10px] font-black uppercase text-blue-600 block tracking-wider">Goods Receipt Terminal</span>
                          <span className="text-xs font-bold text-slate-700">Receive & Inspect incoming delivery</span>
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                        Verify and log arriving spare parts against **{selectedPO.poNumber}**. Create a verified Goods Received Note (GRN) to update inventory levels securely.
                      </p>

                      <button
                        onClick={() => handleOpenGrnWizard(selectedPO)}
                        className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4" /> Generate Goods Received Note (GRN)
                      </button>
                    </div>
                  )}

                  {/* WORKFLOW 5: COMPLETED STATE */}
                  {selectedPO.status === 'Received' && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-2.5 text-xs text-emerald-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold uppercase text-[10px] block text-emerald-600">Goods Fully Intake Cleared</span>
                        <p className="mt-0.5 font-medium">All spare parts are put away in designated warehouse aisles. Stock cards and audit trails are finalized.</p>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="p-4 bg-slate-50 text-slate-400 rounded-full border border-slate-200/50">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">No PO Selected</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Select a Purchase Order from the ledger to view the workflow history, approval remarks, and goods receipt controls.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      ) : activeTab === 'grn-list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Panel: GRN ledger & search */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search GRN#, PO# or supplier..."
                  value={grnSearchQuery}
                  onChange={(e) => setGrnSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>
              <div className="text-xs font-bold text-slate-450">
                Logged Records: {grns.length} entries active
              </div>
            </div>

            <div className="space-y-3">
              {grns.filter(grn => 
                grn.grnNumber.toLowerCase().includes(grnSearchQuery.toLowerCase()) ||
                grn.poNumber.toLowerCase().includes(grnSearchQuery.toLowerCase()) ||
                grn.supplierName.toLowerCase().includes(grnSearchQuery.toLowerCase())
              ).length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-150 shadow-sm text-slate-400 italic">
                  No Goods Received Notes match the search criteria.
                </div>
              ) : (
                grns.filter(grn => 
                  grn.grnNumber.toLowerCase().includes(grnSearchQuery.toLowerCase()) ||
                  grn.poNumber.toLowerCase().includes(grnSearchQuery.toLowerCase()) ||
                  grn.supplierName.toLowerCase().includes(grnSearchQuery.toLowerCase())
                ).map(grn => {
                  const isSelected = selectedGrn?.id === grn.id;
                  const totalReceived = grn.items.reduce((sum, item) => sum + item.receivedQty, 0);
                  const totalRejected = grn.items.reduce((sum, item) => sum + item.rejectedQty, 0);
                  
                  return (
                    <div
                      key={grn.id}
                      onClick={() => setSelectedGrn(grn)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-white ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-600/10 shadow-md'
                          : 'border-slate-150 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800 font-mono">{grn.grnNumber}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 font-mono">
                            Linked {grn.poNumber}
                          </span>
                          {grn.inspectionPassed ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> QA Approved
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-650" /> QA Warning
                            </span>
                          )}
                        </div>
                        
                        <div className="text-xs font-bold text-slate-800">{grn.supplierName}</div>
                        
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Received by {grn.receivedByName}</span>
                          <span>Date: {new Date(grn.receivedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Receipt Intake</span>
                        <div className="text-xs font-bold text-slate-750">
                          {totalReceived} Units Intake
                        </div>
                        {totalRejected > 0 && (
                          <div className="text-[10px] font-bold text-rose-650 mt-0.5">
                            {totalRejected} Units Rejected
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Selected GRN details */}
          <div className="bg-white rounded-2xl border border-slate-150 shadow-md p-5 space-y-5">
            {selectedGrn ? (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase font-mono">{selectedGrn.grnNumber} Details</h3>
                    <h4 className="text-sm font-black text-slate-850 mt-0.5">Goods Receipt Record</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    Verified
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Source PO Number:</span>
                    <span className="text-slate-800 font-mono font-bold">{selectedGrn.poNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supplier Name:</span>
                    <span className="text-slate-800 font-bold">{selectedGrn.supplierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Note Code:</span>
                    <span className="text-slate-800 font-mono font-bold">{selectedGrn.deliveryNoteNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commercial Invoice:</span>
                    <span className="text-slate-800 font-mono font-bold">{selectedGrn.invoiceNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspection Clearance:</span>
                    <span className={selectedGrn.inspectionPassed ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                      {selectedGrn.inspectionPassed ? 'Passed QA Clearance' : 'Flagged with Warnings'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Received By:</span>
                    <span className="text-slate-800">{selectedGrn.receivedByName} ({selectedGrn.receivedByRole})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Receipt Date/Time:</span>
                    <span className="text-slate-800">{new Date(selectedGrn.receivedAt).toLocaleString()}</span>
                  </div>
                </div>

                {selectedGrn.remarks && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium">
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Qualitative Notes</span>
                    {selectedGrn.remarks}
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Intake Line Items</span>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {selectedGrn.items.map(item => (
                      <div key={item.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-800">{item.partName}</span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">{item.partCode}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1.5 text-center text-[10px] font-extrabold text-slate-500 border-t border-slate-200/50">
                          <div>
                            <span className="block text-slate-400 text-[8px] uppercase">Received</span>
                            <span className="font-mono text-slate-700">{item.receivedQty} units</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 text-[8px] uppercase">Accepted</span>
                            <span className="font-mono text-emerald-600">{item.acceptedQty} units</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 text-[8px] uppercase">Rejected</span>
                            <span className="font-mono text-rose-600">{item.rejectedQty} units</span>
                          </div>
                        </div>
                        {item.remarks && (
                          <div className="text-[9px] text-slate-400 italic pt-1 border-t border-slate-100">
                            Remarks: {item.remarks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="p-4 bg-slate-50 text-slate-400 rounded-full border border-slate-200/50">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">No GRN Selected</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Select a Goods Received Note from the active logbook to view the QA inspection clearance results and line item audit history.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ============================================================= */
        /* PO CREATION TAB */
        /* ============================================================= */
        <div className="bg-white rounded-2xl border border-slate-150 shadow-md p-6 max-w-4xl mx-auto">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Raise Corporate Purchase Order</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Select an authorized supplier and specify the quantities of spare parts to procure. Live calculations include standard 8% VAT.
            </p>
          </div>

          <form onSubmit={(e) => handleCreatePO(e, false)} className="space-y-6">
            
            {/* Core Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">Supplier / Manufacturer</label>
                <select
                  value={formSupplierId}
                  onChange={(e) => setFormSupplierId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">-- Select Manufacturer --</option>
                  {suppliers.map(sup => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name} ({sup.country})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">Shipping & Freight Terms</label>
                <select
                  value={formShippingTerms}
                  onChange={(e) => setFormShippingTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="CIF Colombo Port">CIF Colombo Port (Sea Freight)</option>
                  <option value="CIP Colombo Airport">CIP Colombo Airport (Air Freight)</option>
                  <option value="FOB Origin">FOB Origin (Ex-Works Manufacturer)</option>
                  <option value="DDP Destination">DDP Destination (Delivered Duty Paid)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">Expected Delivery Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={formExpectedDelivery}
                    onChange={(e) => setFormExpectedDelivery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

            </div>

            {/* DYNAMIC LINE ITEMS GRID */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Requested Spares & Parts List</span>
                <button
                  type="button"
                  onClick={handleAddFormItem}
                  className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-slate-900 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Item Line
                </button>
              </div>

              <div className="space-y-3">
                {formItems.map((formItem, idx) => {
                  return (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-slate-50/50 p-3 border border-slate-150 rounded-xl">
                      
                      {/* Part Selection */}
                      <div className="md:col-span-6">
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Select Spare Part Item</label>
                        <select
                          value={formItem.itemId}
                          onChange={(e) => handleFormItemChange(idx, 'itemId', e.target.value)}
                          required
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                        >
                          <option value="">-- Choose Spare Part --</option>
                          {inventory.map(part => (
                            <option key={part.id} value={part.id}>
                              {part.partCode} - {part.partName} (Price: LKR {part.unitPrice.toLocaleString()})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Qty */}
                      <div className="md:col-span-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Quantity</label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={formItem.quantity}
                          onChange={(e) => handleFormItemChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                        />
                      </div>

                      {/* Unit Price (Locked/Auto-filled by default but editable) */}
                      <div className="md:col-span-3">
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Unit Price (LKR)</label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={formItem.unitPrice}
                          onChange={(e) => handleFormItemChange(idx, 'unitPrice', Number(e.target.value))}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white font-mono"
                        />
                      </div>

                      {/* Delete Action */}
                      <div className="md:col-span-1 flex justify-center pb-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveFormItem(idx)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">Purchase Requisition Justification & Remarks</label>
              <textarea
                placeholder="State the clinical reasons or PM scheduling requirements that justify this parts replenishment order..."
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>

            {/* LIVE PRICE SUMMARY CARD */}
            <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-850 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Aggregate Estimates</span>
                <div className="text-xl font-black font-mono text-emerald-400">
                  LKR {calculateFormTotals().totalCost.toLocaleString('en-US')}
                </div>
                <span className="text-[10px] text-slate-400 block">Includes 8% VAT + flat-rate ocean freight</span>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  type="submit"
                  className="flex-1 md:flex-initial px-5 py-2.5 border border-slate-750 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCreatePO(e, true)}
                  className="flex-1 md:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit for Approval
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* ============================================================= */}
      {/* ENTERPRISE GOODS RECEIVED NOTE (GRN) WIZARD MODAL & TRANSACTION TERMINAL */}
      {/* ============================================================= */}
      <AnimatePresence>
        {showGrnWizard && wizardPO && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-55 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-150 shadow-2xl max-w-4xl w-full overflow-hidden relative"
            >
              
              {/* Header */}
              <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider bg-blue-950 px-2.5 py-1 rounded-md border border-blue-900/50">
                      QA Intake Control
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      PO Reference: {wizardPO.poNumber}
                    </span>
                  </div>
                  <h3 className="text-lg font-black mt-2">Acknowledge Spares Receipt & Inspection</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Create a legally binding Goods Received Note (GRN) to verify incoming medical spare parts quality, allocate locations, and update active stock levels.
                  </p>
                </div>
                {!isCommittingGrn && (
                  <button
                    onClick={() => setShowGrnWizard(false)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                
                {/* Meta Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Generated GRN Number</label>
                    <input
                      type="text"
                      disabled
                      value={grnNumberInput}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold bg-slate-50 text-slate-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Delivery Note (DN) Number</label>
                    <input
                      type="text"
                      placeholder="e.g. DN-94827"
                      value={deliveryNoteInput}
                      onChange={(e) => setDeliveryNoteInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Supplier Commercial Invoice</label>
                    <input
                      type="text"
                      placeholder="e.g. INV-2026-1029"
                      value={invoiceInput}
                      onChange={(e) => setInvoiceInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Verification Officer</label>
                    <input
                      type="text"
                      disabled
                      value={`${activeUser.name} (${activeUser.role})`}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Checklist & QA Toggle */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-slate-850 block uppercase">Mandatory Physical QA Clearance</span>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Verify that packaging seals are intact, component lot identifiers match the supplier invoice, and there is zero physical damage to electrical parts.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={inspectionPassedInput}
                      onChange={(e) => setInspectionPassedInput(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-xs font-bold text-slate-700">
                      {inspectionPassedInput ? 'PASSED INSPECTION' : 'FLAGGED WARNING'}
                    </span>
                  </label>
                </div>

                {/* Line Items Receiving Table */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Quantity Allocation & QA Remarks</span>
                  
                  <div className="border border-slate-150 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                          <th className="p-3">Spare Component</th>
                          <th className="p-3 text-center">Ordered</th>
                          <th className="p-3 text-center">Previously Recv.</th>
                          <th className="p-3 text-center bg-blue-50/30 text-blue-850">Recv. Qty</th>
                          <th className="p-3 text-center bg-emerald-50/30 text-emerald-850">Accepted (Good)</th>
                          <th className="p-3 text-center bg-rose-50/30 text-rose-850">Rejected (Damaged)</th>
                          <th className="p-3">Component QA Comment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 font-semibold text-slate-750">
                        {wizardItems.map((item, index) => {
                          const outstanding = item.orderedQty - item.previouslyReceivedQty;
                          
                          return (
                            <tr key={item.itemId} className="hover:bg-slate-50/50">
                              <td className="p-3">
                                <span className="font-bold text-slate-800 block">{item.partName}</span>
                                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{item.partCode}</span>
                              </td>
                              <td className="p-3 text-center font-mono">{item.orderedQty}</td>
                              <td className="p-3 text-center font-mono text-slate-450">{item.previouslyReceivedQty}</td>
                              
                              {/* Received Input */}
                              <td className="p-3 text-center bg-blue-50/20">
                                <input
                                  type="number"
                                  min={0}
                                  max={outstanding}
                                  value={item.receivedQty}
                                  onChange={(e) => {
                                    const val = Math.min(outstanding, Math.max(0, Number(e.target.value)));
                                    const updated = [...wizardItems];
                                    updated[index].receivedQty = val;
                                    // Keep accepted in sync unless explicitly modified
                                    updated[index].acceptedQty = Math.min(val, updated[index].acceptedQty);
                                    updated[index].rejectedQty = val - updated[index].acceptedQty;
                                    setWizardItems(updated);
                                  }}
                                  className="w-16 px-1.5 py-1 border border-blue-200 rounded text-center text-xs font-bold text-blue-700 font-mono bg-white focus:outline-none focus:border-blue-500"
                                />
                              </td>

                              {/* Accepted Input */}
                              <td className="p-3 text-center bg-emerald-50/20">
                                <input
                                  type="number"
                                  min={0}
                                  max={item.receivedQty}
                                  value={item.acceptedQty}
                                  onChange={(e) => {
                                    const val = Math.min(item.receivedQty, Math.max(0, Number(e.target.value)));
                                    const updated = [...wizardItems];
                                    updated[index].acceptedQty = val;
                                    updated[index].rejectedQty = item.receivedQty - val;
                                    setWizardItems(updated);
                                  }}
                                  className="w-16 px-1.5 py-1 border border-emerald-200 rounded text-center text-xs font-bold text-emerald-700 font-mono bg-white focus:outline-none focus:border-emerald-500"
                                />
                              </td>

                              {/* Rejected Qty Display */}
                              <td className="p-3 text-center bg-rose-50/20 font-mono font-bold text-rose-600">
                                {item.rejectedQty}
                              </td>

                              {/* Comments Input */}
                              <td className="p-3">
                                <input
                                  type="text"
                                  placeholder="e.g. Lot #9281A"
                                  value={item.remarks}
                                  onChange={(e) => {
                                    const updated = [...wizardItems];
                                    updated[index].remarks = e.target.value;
                                    setWizardItems(updated);
                                  }}
                                  className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* General Remarks */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">General Receipt Observations / Packaging Checklist Remarks</label>
                  <textarea
                    placeholder="Provide details of any physical damage, supplier deviations, shipping container seal codes, or specific temperature-controlled readings..."
                    value={grnRemarksInput}
                    onChange={(e) => setGrnRemarksInput(e.target.value)}
                    rows={2.5}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>

              </div>

              {/* Action Footer */}
              <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-150">
                <span className="text-[11px] font-bold text-slate-500 font-sans">
                  Ready to update {wizardItems.filter(i => i.receivedQty > 0).length} spare part stock cards.
                </span>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGrnWizard(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancel Receipt
                  </button>
                  <button
                    onClick={handleCommitGrnTransaction}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/15 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save & Commit Goods Note
                  </button>
                </div>
              </div>

              {/* DATABASE TRANSACTION SIMULATOR OVERLAY */}
              {isCommittingGrn && (
                <div className="absolute inset-0 bg-slate-950/95 flex flex-col justify-between p-8 z-50 text-slate-200 font-mono">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping shrink-0" />
                      <div>
                        <h4 className="text-sm font-black tracking-tight text-white uppercase font-sans">
                          Enterprise Transaction Coordinator (ACID Safe)
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold font-sans mt-0.5">
                          Enforcing atomic state transitions on relational MariaDB cluster.
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block uppercase">Isolation Level</span>
                      <span className="text-xs font-bold text-blue-400">SERIALIZABLE</span>
                    </div>
                  </div>

                  {/* Terminal Console Logs */}
                  <div className="flex-1 my-6 bg-slate-900 border border-slate-800/80 rounded-2xl p-5 overflow-y-auto max-h-[360px] text-left text-[11px] leading-relaxed space-y-1.5 custom-scrollbar">
                    {commitLogs.map((log, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="text-slate-600 select-none">{String(index + 1).padStart(3, '0')}</span>
                        <span className={
                          log.includes('BEGIN') || log.includes('COMMIT')
                            ? 'text-yellow-400 font-bold'
                            : log.includes('SUCCESSFUL') || log.includes('Verified')
                              ? 'text-emerald-400 font-bold'
                              : log.includes('INSERT') || log.includes('UPDATE')
                                ? 'text-blue-300 font-medium'
                                : 'text-slate-300'
                        }>
                          {log}
                        </span>
                      </div>
                    ))}
                    <div className="animate-pulse inline-block w-1.5 h-4 bg-slate-300 ml-1 mt-1" />
                  </div>

                  {/* Transaction Progress / Controls */}
                  <div className="border-t border-slate-800 pt-5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3.5 w-full md:w-auto">
                      {commitStep < 9 ? (
                        <div className="w-6 h-6 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-xs font-black text-white block uppercase">
                          {commitStep < 9 ? 'Emulating Transaction commit phase...' : 'COMMIT TRANSACTION SUCCESS'}
                        </span>
                        <p className="text-[10px] text-slate-500 font-semibold font-sans mt-0.5">
                          {commitStep < 9 ? 'Simulating locking, updating, inserting and consistency checks' : 'Active database connections flushed. State fully synchronized.'}
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-64 shrink-0 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${(commitStep / 9) * 100}%` }}
                      />
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
