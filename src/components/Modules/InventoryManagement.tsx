import React, { useState } from 'react';
import { 
  InventoryItem, 
  StockMovement, 
  UserProfile, 
  Supplier, 
  InventoryCategory,
  StockMovementType
} from '../../types';
import { 
  Layers, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Truck, 
  Search, 
  Plus, 
  Filter, 
  History, 
  Edit, 
  ArrowLeftRight, 
  X, 
  PlusCircle, 
  MinusCircle, 
  FileText, 
  User, 
  Clock, 
  Check, 
  HelpCircle,
  Wrench,
  Building2,
  DollarSign,
  Star,
  Trash2,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryManagementProps {
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  suppliers: Supplier[];
  activeUser: UserProfile;
  onUpdateInventory: (updatedInventory: InventoryItem[]) => void;
  onUpdateStockMovements: (updatedMovements: StockMovement[]) => void;
  onLogAudit: (action: string, previousValue?: string, newValue?: string, remarks?: string) => void;
}

const ALLOWED_WRITE_ROLES = ['System Admin', 'Admin', 'Service Manager', 'Workshop Manager', 'Documentation Officer'];

export default function InventoryManagement({
  inventory,
  stockMovements,
  suppliers,
  activeUser,
  onUpdateInventory,
  onUpdateStockMovements,
  onLogAudit
}: InventoryManagementProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registry' | 'categories' | 'manufacturers' | 'compatibility' | 'movements'>('dashboard');
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All'); // All, Low Stock, Out of Stock, In Stock
  const [sortBy, setSortBy] = useState<string>('code-asc');
  
  // Movement Filter States
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>('All');
  const [movementSearchTerm, setMovementSearchTerm] = useState('');

  // Modals Control
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form States - Add/Edit Item
  const [formPartCode, setFormPartCode] = useState('');
  const [formPartName, setFormPartName] = useState('');
  const [formCategory, setFormCategory] = useState<InventoryCategory>('Consumables');
  const [formBrand, setFormBrand] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCompatibleModels, setFormCompatibleModels] = useState('');
  const [formSupplierId, setFormSupplierId] = useState('');
  const [formUnitPrice, setFormUnitPrice] = useState<number>(0);
  const [formReorderLevel, setFormReorderLevel] = useState<number>(5);
  const [formWarehouseLocation, setFormWarehouseLocation] = useState('');
  const [formInitialQty, setFormInitialQty] = useState<number>(0);

  // Form States - Transaction
  const [txType, setTxType] = useState<StockMovementType>('ADJUSTMENT');
  const [txQty, setTxQty] = useState<number>(1);
  const [txRefDoc, setTxRefDoc] = useState('');
  const [txRemarks, setTxRemarks] = useState('');

  // Categories Module States
  const [customCategories, setCustomCategories] = useState<{name: string; description: string; leadTimeDays: number}[]>(() => {
    const saved = localStorage.getItem('avon_custom_categories');
    return saved ? JSON.parse(saved) : [
      { name: 'Consumables', description: 'Filters, syringes, tubes, seals, and other fast-moving consumables.', leadTimeDays: 7 },
      { name: 'Electronics', description: 'Motherboards, power supplies, sensor boards, and laser modules.', leadTimeDays: 14 },
      { name: 'Mechanical', description: 'Gears, belts, valves, pump heads, syringes, and motor assemblies.', leadTimeDays: 10 },
      { name: 'Optical', description: 'Lenses, filters, mirrors, photodiodes, and lamp assemblies.', leadTimeDays: 21 },
      { name: 'Calibrator', description: 'Standard calibrators, calibration kits, and reference materials.', leadTimeDays: 3 },
      { name: 'Reagent', description: 'Diagnostic reagents, lysing solutions, diluents, and cleansers.', leadTimeDays: 5 },
      { name: 'Tools', description: 'Biomedical testing equipment, pipettes, multimeters, and toolkits.', leadTimeDays: 30 }
    ];
  });
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>('Consumables');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [categoryFormName, setCategoryFormName] = useState('');
  const [categoryFormDescription, setCategoryFormDescription] = useState('');
  const [categoryFormLeadTime, setCategoryFormLeadTime] = useState<number>(10);

  // Manufacturers Module States
  const [manufacturers, setManufacturers] = useState<{id: string; name: string; country: string; contactPerson: string; phone: string; email: string; rating: number}[]>(() => {
    const saved = localStorage.getItem('avon_manufacturers');
    return saved ? JSON.parse(saved) : [
      { id: 'm1', name: 'Sysmex', country: 'Japan', contactPerson: 'Hiroshi Tanaka', phone: '+81-3-1234-5678', email: 'support@sysmex.co.jp', rating: 5 },
      { id: 'm2', name: 'Roche', country: 'Switzerland', contactPerson: 'Claire Dubois', phone: '+41-61-688-1111', email: 'service@roche.com', rating: 5 },
      { id: 'm3', name: 'Shimadzu', country: 'Japan', contactPerson: 'Kenji Sato', phone: '+81-75-823-1111', email: 'parts@shimadzu.com', rating: 4 },
      { id: 'm4', name: 'Abbott', country: 'USA', contactPerson: 'John Smith', phone: '+1-800-222-6883', email: 'abbott.service@abbott.com', rating: 4 },
      { id: 'm5', name: 'Bio-Rad', country: 'USA', contactPerson: 'Sarah Jenkins', phone: '+1-510-741-1000', email: 'emea_support@bio-rad.com', rating: 4 }
    ];
  });
  const [manufacturerSearchTerm, setManufacturerSearchTerm] = useState('');
  const [showAddManufacturerModal, setShowAddManufacturerModal] = useState(false);
  const [editingManufacturerId, setEditingManufacturerId] = useState<string | null>(null);
  const [mfrFormName, setMfrFormName] = useState('');
  const [mfrFormCountry, setMfrFormCountry] = useState('');
  const [mfrFormContact, setMfrFormContact] = useState('');
  const [mfrFormPhone, setMfrFormPhone] = useState('');
  const [mfrFormEmail, setMfrFormEmail] = useState('');
  const [mfrFormRating, setMfrFormRating] = useState<number>(4);

  // Compatibility Module States
  // Dynamically extract unique compatibility models from inventory
  const dynamicCompatibilityModels = Array.from(
    new Set(inventory.flatMap(item => item.compatibleModels))
  ).sort();
  const [selectedCompatibilityModel, setSelectedCompatibilityModel] = useState<string>(
    dynamicCompatibilityModels[0] || 'XN-1000'
  );
  const [compatFormPartId, setCompatFormPartId] = useState('');
  const [compatFormModel, setCompatFormModel] = useState('');

  const CATEGORIES = customCategories.map(c => c.name);

  const hasWritePermission = ALLOWED_WRITE_ROLES.includes(activeUser.role);

  // Stats Calculations
  const totalUniqueParts = inventory.length;
  const totalStockOnHand = inventory.reduce((sum, item) => sum + item.onHandQty, 0);
  const totalInventoryValuation = inventory.reduce((sum, item) => sum + (item.onHandQty * item.unitPrice), 0);
  const lowStockItemsCount = inventory.filter(item => item.onHandQty <= item.reorderLevel && item.onHandQty > 0).length;
  const outOfStockItemsCount = inventory.filter(item => item.onHandQty === 0).length;
  const inTransitCount = inventory.reduce((sum, item) => sum + (item.inTransitQty || 0), 0);

  // Open Add Item Form
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormPartCode(`AV-PRT-2026-${String(inventory.length + 1).padStart(3, '0')}`);
    setFormPartName('');
    setFormCategory('Consumables');
    setFormBrand('');
    setFormDescription('');
    setFormCompatibleModels('');
    setFormSupplierId('');
    setFormUnitPrice(0);
    setFormReorderLevel(5);
    setFormWarehouseLocation('');
    setFormInitialQty(0);
    setShowAddEditModal(true);
  };

  // Open Edit Item Form
  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormPartCode(item.partCode);
    setFormPartName(item.partName);
    setFormCategory(item.category);
    setFormBrand(item.brand);
    setFormDescription(item.description);
    setFormCompatibleModels(item.compatibleModels.join(', '));
    setFormSupplierId(item.supplierId || '');
    setFormUnitPrice(item.unitPrice);
    setFormReorderLevel(item.reorderLevel);
    setFormWarehouseLocation(item.warehouseLocation);
    setFormInitialQty(item.onHandQty); // locked during edit, transaction modal used for changes
    setShowAddEditModal(true);
  };

  // Save Item (Add or Edit)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPartCode.trim() || !formPartName.trim()) return;

    const supplierName = suppliers.find(s => s.id === formSupplierId)?.name || '';
    const compModelsArray = formCompatibleModels
      ? formCompatibleModels.split(',').map(m => m.trim()).filter(Boolean)
      : [];

    if (editingItem) {
      // Edit existing
      const updated = inventory.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            partCode: formPartCode,
            partName: formPartName,
            category: formCategory,
            brand: formBrand,
            description: formDescription,
            compatibleModels: compModelsArray,
            supplierId: formSupplierId || undefined,
            supplierName: supplierName || undefined,
            unitPrice: formUnitPrice,
            reorderLevel: formReorderLevel,
            warehouseLocation: formWarehouseLocation,
            // Re-calculate available
            availableQty: item.onHandQty - item.allocatedQty
          };
        }
        return item;
      });

      onUpdateInventory(updated);
      onLogAudit(
        'INVENTORY_EDIT_ITEM',
        JSON.stringify(editingItem),
        JSON.stringify(updated.find(item => item.id === editingItem.id)),
        `Updated details for inventory item: ${formPartCode} - ${formPartName}`
      );
    } else {
      // Add new
      const newItem: InventoryItem = {
        id: `inv_item_${Date.now()}`,
        partCode: formPartCode,
        partName: formPartName,
        category: formCategory,
        brand: formBrand,
        description: formDescription,
        compatibleModels: compModelsArray,
        supplierId: formSupplierId || undefined,
        supplierName: supplierName || undefined,
        unitPrice: formUnitPrice,
        reorderLevel: formReorderLevel,
        warehouseLocation: formWarehouseLocation,
        onHandQty: formInitialQty,
        allocatedQty: 0,
        availableQty: formInitialQty,
        inTransitQty: 0
      };

      onUpdateInventory([newItem, ...inventory]);

      // Create automatic stock movement log for initial seeding
      if (formInitialQty > 0) {
        const initialMovement: StockMovement = {
          id: `mov_init_${Date.now()}`,
          itemId: newItem.id,
          partCode: newItem.partCode,
          partName: newItem.partName,
          type: 'ADJUSTMENT',
          quantity: formInitialQty,
          direction: 'IN',
          referenceDoc: 'INITIAL_SEED',
          userId: activeUser.id,
          userName: activeUser.name,
          userRole: activeUser.role,
          timestamp: new Date().toISOString(),
          remarks: 'Initial stock balance registered on item creation.'
        };
        onUpdateStockMovements([initialMovement, ...stockMovements]);
      }

      onLogAudit(
        'INVENTORY_ADD_ITEM',
        undefined,
        JSON.stringify(newItem),
        `Registered new inventory item: ${formPartCode} with initial stock of ${formInitialQty}`
      );
    }

    setShowAddEditModal(false);
  };

  // Open Transaction Modal
  const handleOpenTransaction = (item: InventoryItem, initialType: StockMovementType = 'ADJUSTMENT') => {
    setSelectedItem(item);
    setTxType(initialType);
    setTxQty(1);
    setTxRefDoc('');
    setTxRemarks('');
    setShowTransactionModal(true);
  };

  // Process Stock Transaction
  const handleProcessTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || txQty <= 0) return;

    let updatedOnHand = selectedItem.onHandQty;
    let updatedAllocated = selectedItem.allocatedQty;
    let updatedInTransit = selectedItem.inTransitQty || 0;
    let direction: 'IN' | 'OUT' = 'IN';

    // Business Logic for Stock Arithmetic
    switch (txType) {
      case 'PURCHASE':
        // Receiving physical parts from supplier
        updatedOnHand += txQty;
        // If they had in transit, deduct from in transit
        if (updatedInTransit >= txQty) {
          updatedInTransit -= txQty;
        } else {
          updatedInTransit = 0;
        }
        direction = 'IN';
        break;

      case 'CONSUMPTION':
        // Part installed on an instrument/job.
        if (selectedItem.allocatedQty >= txQty) {
          // If we had reserved stock, reduce the allocated balance
          updatedAllocated -= txQty;
        }
        updatedOnHand -= txQty;
        direction = 'OUT';
        break;

      case 'ALLOCATION':
        // Reserve stock for an upcoming job schedule
        updatedAllocated += txQty;
        direction = 'OUT'; // Allocation earmarks it (decreases available)
        break;

      case 'RETURN':
        // Returning unused allocated parts to standard stock OR receiving returned parts from customer
        if (selectedItem.allocatedQty >= txQty) {
          updatedAllocated -= txQty;
        } else {
          updatedOnHand += txQty; // Returned from customer back to general stock on hand
        }
        direction = 'IN';
        break;

      case 'ADJUSTMENT':
      default:
        // Manual stock count audit correction
        // User indicates the absolute change or relative adjust. We do relative adjustment here.
        // Let's ask: is it IN or OUT? By default, manual adjustment adds stock. Let's make it IN or OUT based on positive/negative
        direction = txRemarks.toLowerCase().includes('deduct') || txRemarks.toLowerCase().includes('shrinkage') || txRemarks.toLowerCase().includes('lost') ? 'OUT' : 'IN';
        if (direction === 'IN') {
          updatedOnHand += txQty;
        } else {
          updatedOnHand = Math.max(0, updatedOnHand - txQty);
        }
        break;
    }

    // Safety checks
    if (updatedOnHand < 0) updatedOnHand = 0;
    const updatedAvailable = updatedOnHand - updatedAllocated;

    // Create stock movement record
    const movement: StockMovement = {
      id: `mov_tx_${Date.now()}`,
      itemId: selectedItem.id,
      partCode: selectedItem.partCode,
      partName: selectedItem.partName,
      type: txType,
      quantity: txQty,
      direction,
      referenceDoc: txRefDoc.trim() || 'N/A',
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      timestamp: new Date().toISOString(),
      remarks: txRemarks.trim() || `Processed stock ${txType.toLowerCase()} transaction.`
    };

    // Update state
    const updatedInventory = inventory.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          onHandQty: updatedOnHand,
          allocatedQty: updatedAllocated,
          availableQty: updatedAvailable,
          inTransitQty: updatedInTransit
        };
      }
      return item;
    });

    onUpdateInventory(updatedInventory);
    onUpdateStockMovements([movement, ...stockMovements]);

    // Log security audit log
    onLogAudit(
      'STOCK_TRANSACTION',
      JSON.stringify(selectedItem),
      JSON.stringify(updatedInventory.find(item => item.id === selectedItem.id)),
      `Stock ${txType} performed on ${selectedItem.partCode}. Qty: ${txQty}, Reference: ${txRefDoc}`
    );

    setShowTransactionModal(false);
  };

  // Quick Purchase Trigger (creates virtual "In Transit" stock)
  const handleTriggerQuickPO = (item: InventoryItem) => {
    const purchaseQty = item.reorderLevel * 3; // Standard batch order size
    
    // Create PO Transaction Movement
    const movement: StockMovement = {
      id: `mov_po_${Date.now()}`,
      itemId: item.id,
      partCode: item.partCode,
      partName: item.partName,
      type: 'ADJUSTMENT', // Virtual ordering
      quantity: purchaseQty,
      direction: 'IN',
      referenceDoc: `PO-AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      timestamp: new Date().toISOString(),
      remarks: `Automated reorder triggered due to stock breaching reorder level of ${item.reorderLevel}. Ordered ${purchaseQty} units.`
    };

    const updatedInventory = inventory.map(i => {
      if (i.id === item.id) {
        return {
          ...i,
          inTransitQty: (i.inTransitQty || 0) + purchaseQty
        };
      }
      return i;
    });

    onUpdateInventory(updatedInventory);
    onUpdateStockMovements([movement, ...stockMovements]);

    onLogAudit(
      'STOCK_REORDER_TRIGGER',
      undefined,
      `Ordered ${purchaseQty} units of ${item.partCode}`,
      `Auto reorder initiated for ${item.partCode} - ${item.partName}. Total ordered: ${purchaseQty}`
    );

    alert(`Purchase Order triggered successfully for ${item.partName}. Ordered ${purchaseQty} units. Mark as received under "Stock Movements" tab when shipment arrives.`);
  };

  // CRUD - Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormName.trim()) return;

    const exists = customCategories.some(c => c.name.toLowerCase() === categoryFormName.trim().toLowerCase());
    if (exists) {
      alert("Category name already exists.");
      return;
    }

    const updated = [
      ...customCategories,
      {
        name: categoryFormName.trim(),
        description: categoryFormDescription.trim() || 'No description provided.',
        leadTimeDays: categoryFormLeadTime
      }
    ];

    setCustomCategories(updated);
    localStorage.setItem('avon_custom_categories', JSON.stringify(updated));
    onLogAudit('INVENTORY_ADD_CATEGORY', undefined, categoryFormName.trim(), `Added new inventory category: ${categoryFormName}`);

    // Reset Form
    setCategoryFormName('');
    setCategoryFormDescription('');
    setCategoryFormLeadTime(10);
    setShowAddCategoryModal(false);
  };

  // CRUD - Delete Category
  const handleDeleteCategory = (catName: string) => {
    const isStandard = ['Consumables', 'Electronics', 'Mechanical', 'Optical', 'Calibrator', 'Reagent', 'Tools'].includes(catName);
    if (isStandard) {
      alert("Standard categories cannot be deleted.");
      return;
    }

    const isUsed = inventory.some(item => item.category === catName);
    if (isUsed) {
      alert(`Cannot delete category "${catName}" because it has active spare parts associated with it. Reassign those parts first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete the category "${catName}"?`)) return;

    const updated = customCategories.filter(c => c.name !== catName);
    setCustomCategories(updated);
    localStorage.setItem('avon_custom_categories', JSON.stringify(updated));
    if (selectedCategoryName === catName) {
      setSelectedCategoryName(updated[0]?.name || null);
    }
    onLogAudit('INVENTORY_DELETE_CATEGORY', catName, undefined, `Deleted inventory category: ${catName}`);
  };

  // CRUD - Save Manufacturer
  const handleSaveManufacturer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfrFormName.trim()) return;

    let updated;
    if (editingManufacturerId) {
      // Edit
      updated = manufacturers.map(m => {
        if (m.id === editingManufacturerId) {
          return {
            ...m,
            name: mfrFormName.trim(),
            country: mfrFormCountry.trim() || 'N/A',
            contactPerson: mfrFormContact.trim() || 'N/A',
            phone: mfrFormPhone.trim() || 'N/A',
            email: mfrFormEmail.trim() || 'N/A',
            rating: mfrFormRating
          };
        }
        return m;
      });
      onLogAudit('INVENTORY_EDIT_MANUFACTURER', editingManufacturerId, mfrFormName, `Updated manufacturer: ${mfrFormName}`);
    } else {
      // Add
      updated = [
        ...manufacturers,
        {
          id: `mfr_${Date.now()}`,
          name: mfrFormName.trim(),
          country: mfrFormCountry.trim() || 'N/A',
          contactPerson: mfrFormContact.trim() || 'N/A',
          phone: mfrFormPhone.trim() || 'N/A',
          email: mfrFormEmail.trim() || 'N/A',
          rating: mfrFormRating
        }
      ];
      onLogAudit('INVENTORY_ADD_MANUFACTURER', undefined, mfrFormName, `Added new manufacturer: ${mfrFormName}`);
    }

    setManufacturers(updated);
    localStorage.setItem('avon_manufacturers', JSON.stringify(updated));

    // Reset Form
    setMfrFormName('');
    setMfrFormCountry('');
    setMfrFormContact('');
    setMfrFormPhone('');
    setMfrFormEmail('');
    setMfrFormRating(4);
    setEditingManufacturerId(null);
    setShowAddManufacturerModal(false);
  };

  // CRUD - Delete Manufacturer
  const handleDeleteManufacturer = (id: string, name: string) => {
    const isUsed = inventory.some(item => item.brand.toLowerCase() === name.toLowerCase());
    if (isUsed) {
      alert(`Cannot delete manufacturer "${name}" because there are registered spare parts associated with this brand.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete "${name}" from manufacturers?`)) return;

    const updated = manufacturers.filter(m => m.id !== id);
    setManufacturers(updated);
    localStorage.setItem('avon_manufacturers', JSON.stringify(updated));
    onLogAudit('INVENTORY_DELETE_MANUFACTURER', id, undefined, `Deleted manufacturer: ${name}`);
  };

  // Compatibility Mapping Handlers
  const handleToggleModelCompatibility = (itemId: string, model: string, action: 'ADD' | 'REMOVE') => {
    const updatedInventory = inventory.map(item => {
      if (item.id === itemId) {
        let models = [...item.compatibleModels];
        if (action === 'ADD' && !models.includes(model)) {
          models.push(model);
        } else if (action === 'REMOVE') {
          models = models.filter(m => m !== model);
        }
        return {
          ...item,
          compatibleModels: models
        };
      }
      return item;
    });

    onUpdateInventory(updatedInventory);
    onLogAudit(
      'INVENTORY_COMPATIBILITY_UPDATE',
      undefined,
      `${action} compatibility of model "${model}" to part ID: ${itemId}`,
      `Updated compatibility list for spare part: ${inventory.find(i => i.id === itemId)?.partName}`
    );
  };

  // Filter Registry Items
  const filteredInventory = inventory.filter(item => {
    // Search match
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.partCode.toLowerCase().includes(searchLower) ||
      item.partName.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.brand.toLowerCase().includes(searchLower) ||
      item.compatibleModels.some(model => model.toLowerCase().includes(searchLower));

    // Category match
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

    // Status match
    let matchesStatus = true;
    if (statusFilter === 'Low Stock') {
      matchesStatus = item.onHandQty <= item.reorderLevel && item.onHandQty > 0;
    } else if (statusFilter === 'Out of Stock') {
      matchesStatus = item.onHandQty === 0;
    } else if (statusFilter === 'In Stock') {
      matchesStatus = item.onHandQty > item.reorderLevel;
    } else if (statusFilter === 'In Transit') {
      matchesStatus = (item.inTransitQty || 0) > 0;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'code-asc':
        return a.partCode.localeCompare(b.partCode);
      case 'code-desc':
        return b.partCode.localeCompare(a.partCode);
      case 'name-asc':
        return a.partName.localeCompare(b.partName);
      case 'name-desc':
        return b.partName.localeCompare(a.partName);
      case 'price-asc':
        return a.unitPrice - b.unitPrice;
      case 'price-desc':
        return b.unitPrice - a.unitPrice;
      case 'qty-asc':
        return a.onHandQty - b.onHandQty;
      case 'qty-desc':
        return b.onHandQty - a.onHandQty;
      default:
        return 0;
    }
  });

  // Filter Movement Logs
  const filteredMovements = stockMovements.filter(mov => {
    const searchLower = movementSearchTerm.toLowerCase();
    const matchesSearch = 
      mov.partCode.toLowerCase().includes(searchLower) ||
      mov.partName.toLowerCase().includes(searchLower) ||
      mov.referenceDoc.toLowerCase().includes(searchLower) ||
      mov.userName.toLowerCase().includes(searchLower) ||
      mov.remarks.toLowerCase().includes(searchLower);

    const matchesType = movementTypeFilter === 'All' || mov.type === movementTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div id="inventory_management_module" className="space-y-6">
      
      {/* Module Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-blue-600" />
            Inventory & Spare Parts Suite
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Real-time tracking of biomedical parts, consumables, stock levels, warehouse locations, and transaction auditing.
          </p>
        </div>
        
        {hasWritePermission && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/15 flex items-center gap-1.5 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Register Spare Part
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto shrink-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 tracking-wide transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard'
              ? 'border-blue-600 text-blue-600 bg-blue-50/10'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          Stock Dashboard
        </button>
        <button
          onClick={() => setActiveTab('registry')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 tracking-wide transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'registry'
              ? 'border-blue-600 text-blue-600 bg-blue-50/10'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Spare Parts Registry ({filteredInventory.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 tracking-wide transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-600 bg-blue-50/10'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Filter className="w-4 h-4" />
          Categories ({customCategories.length})
        </button>
        <button
          onClick={() => setActiveTab('manufacturers')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 tracking-wide transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'manufacturers'
              ? 'border-blue-600 text-blue-600 bg-blue-50/10'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Manufacturers ({manufacturers.length})
        </button>
        <button
          onClick={() => setActiveTab('compatibility')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 tracking-wide transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'compatibility'
              ? 'border-blue-600 text-blue-600 bg-blue-50/10'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Compatibility Matrix ({dynamicCompatibilityModels.length})
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 tracking-wide transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'movements'
              ? 'border-blue-600 text-blue-600 bg-blue-50/10'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          Stock Movement Logs ({filteredMovements.length})
        </button>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Unique Spare Parts</span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{totalUniqueParts}</p>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Catalogued Items</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Stock On Hand</span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{totalStockOnHand}</p>
                  <span className="text-[10px] text-emerald-600 font-extrabold block mt-0.5">
                    {inventory.reduce((sum, i) => sum + i.availableQty, 0)} available
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Stock Valuation</span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    LKR {(totalInventoryValuation / 1000000).toFixed(2)}M
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                    LKR {totalInventoryValuation.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  lowStockItemsCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                }`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Critical Alerts</span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {lowStockItemsCount + outOfStockItemsCount}
                  </p>
                  <span className="text-[10px] text-rose-600 font-extrabold block mt-0.5">
                    {outOfStockItemsCount} Out of Stock • {lowStockItemsCount} Low Stock
                  </span>
                </div>
              </div>

            </div>

            {/* In Transit Stock & Low Stock Quick Purchase Alert Center */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Critical Low Stock Actions Panel */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    Critical Stock Action Required
                  </h3>
                  <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                    Reorder Breach
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
                  {inventory.filter(i => i.onHandQty <= i.reorderLevel).length === 0 ? (
                    <p className="text-slate-400 italic text-xs py-4 text-center">All spare parts are within safety stock limits.</p>
                  ) : (
                    inventory.filter(i => i.onHandQty <= i.reorderLevel).map(item => {
                      const isOutOfStock = item.onHandQty === 0;
                      return (
                        <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-slate-800">{item.partCode}</span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-bold">{item.brand}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-600">{item.partName}</p>
                            <p className="text-[10px] text-slate-400">
                              Current Stock: <span className={isOutOfStock ? 'text-red-600 font-extrabold' : 'text-amber-600 font-bold'}>{item.onHandQty}</span> / Reorder Level: {item.reorderLevel}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.inTransitQty > 0 ? (
                              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                <Truck className="w-3.5 h-3.5" />
                                {item.inTransitQty} In-Transit
                              </div>
                            ) : (
                              hasWritePermission && (
                                <button
                                  onClick={() => handleTriggerQuickPO(item)}
                                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Truck className="w-3 h-3" />
                                  Trigger PO
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Warehouse Locations & Fast Stats */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400" />
                  Supply Pipeline Overview
                </h3>

                <div className="space-y-4 pt-2">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Incoming Shipments</span>
                    <p className="text-2xl font-black text-white mt-1">{inTransitCount} Units</p>
                    <p className="text-[10px] text-slate-400 mt-1">Pending delivery to Colombo warehouse.</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Stock Distribution by Category</span>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
                      {CATEGORIES.map(category => {
                        const count = inventory.filter(i => i.category === category).length;
                        const qty = inventory.filter(i => i.category === category).reduce((sum, i) => sum + i.onHandQty, 0);
                        if (count === 0) return null;
                        return (
                          <div key={category} className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">{category} ({count} items)</span>
                            <span className="font-bold text-slate-200">{qty} units</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {activeTab === 'registry' && (
          <motion.div
            key="registry"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Filter controls row */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search code, name, model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filters block */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                
                {/* Category Filter */}
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
                >
                  <option value="All">All Stock Levels</option>
                  <option value="In Stock">In Stock (Normal)</option>
                  <option value="Low Stock">Low Stock Limits</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="In Transit">In Transit</option>
                </select>

                {/* Sort By Selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
                >
                  <option value="code-asc">Code: A to Z</option>
                  <option value="code-desc">Code: Z to A</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="qty-asc">Stock: Low to High</option>
                  <option value="qty-desc">Stock: High to Low</option>
                </select>

              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                      <th className="px-6 py-4">Part Information</th>
                      <th className="px-6 py-4">Attributes</th>
                      <th className="px-6 py-4">Location & Supplier</th>
                      <th className="px-6 py-4 text-right">Unit Price</th>
                      <th className="px-6 py-4 text-center">Stock Details (Units)</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredInventory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400 italic">No spare parts found matching the filter criteria.</td>
                      </tr>
                    ) : (
                      filteredInventory.map(item => {
                        const isLow = item.onHandQty <= item.reorderLevel && item.onHandQty > 0;
                        const isOut = item.onHandQty === 0;
                        const hasInTransit = (item.inTransitQty || 0) > 0;

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">{item.partCode}</span>
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                                  item.category === 'Consumables' ? 'bg-indigo-50 text-indigo-600' :
                                  item.category === 'Reagent' ? 'bg-amber-50 text-amber-600' :
                                  item.category === 'Mechanical' ? 'bg-teal-50 text-teal-600' :
                                  item.category === 'Optical' ? 'bg-purple-50 text-purple-600' :
                                  'bg-slate-100 text-slate-600'
                                }`}>
                                  {item.category}
                                </span>
                              </div>
                              <p className="font-extrabold text-slate-800">{item.partName}</p>
                              <p className="text-[10px] text-slate-400 font-medium max-w-[280px] line-clamp-1">{item.description}</p>
                            </td>
                            
                            <td className="px-6 py-4 space-y-1.5">
                              <div className="flex flex-wrap gap-1">
                                <span className="text-[10px] bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded text-slate-500 font-bold">{item.brand}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {item.compatibleModels.map(m => (
                                  <span key={m} className="text-[9px] bg-blue-50/50 text-blue-600 px-1.5 py-0.5 rounded font-bold">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="px-6 py-4 space-y-1">
                              <p className="font-bold text-slate-700 flex items-center gap-1">
                                <Package className="w-3.5 h-3.5 text-slate-400" />
                                {item.warehouseLocation}
                              </p>
                              {item.supplierName && (
                                <p className="text-[10px] text-slate-400 font-bold truncate max-w-[180px]">
                                  {item.supplierName}
                                </p>
                              )}
                            </td>

                            <td className="px-6 py-4 text-right font-black text-slate-900 font-mono">
                              LKR {item.unitPrice.toLocaleString()}
                            </td>

                            <td className="px-6 py-4 text-center">
                              <div className="inline-grid grid-cols-2 gap-x-4 gap-y-1 text-left">
                                <span className="text-slate-400 font-semibold">On Hand:</span>
                                <span className={`font-black text-right font-mono ${
                                  isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-800'
                                }`}>
                                  {item.onHandQty}
                                </span>
                                
                                <span className="text-slate-400 font-semibold">Allocated:</span>
                                <span className="font-bold text-slate-800 text-right font-mono">{item.allocatedQty}</span>
                                
                                <span className="text-slate-400 font-semibold">Available:</span>
                                <span className={`font-black text-right font-mono ${
                                  item.availableQty <= 0 ? 'text-red-500' : 'text-emerald-600'
                                }`}>
                                  {item.availableQty}
                                </span>

                                {hasInTransit && (
                                  <>
                                    <span className="text-blue-500 font-bold">In Transit:</span>
                                    <span className="font-black text-blue-600 text-right font-mono">+{item.inTransitQty}</span>
                                  </>
                                )}
                              </div>
                              
                              {/* Stock status indicator bar */}
                              <div className="w-32 h-1 bg-slate-100 rounded-full mt-2 mx-auto overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    isOut ? 'w-0 bg-red-600' : isLow ? 'w-1/4 bg-amber-500' : 'w-full bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min(100, (item.availableQty / (item.reorderLevel * 3)) * 100)}%` }}
                                />
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenTransaction(item, 'ADJUSTMENT')}
                                  title="Perform Stock Transaction"
                                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg cursor-pointer transition-all"
                                >
                                  <ArrowLeftRight className="w-4 h-4" />
                                </button>
                                {hasWritePermission && (
                                  <button
                                    onClick={() => handleOpenEdit(item)}
                                    title="Edit Item details"
                                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg cursor-pointer transition-all"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'movements' && (
          <motion.div
            key="movements"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Movement Filter Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search part, user, reference doc..."
                  value={movementSearchTerm}
                  onChange={(e) => setMovementSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <span className="text-xs text-slate-400 font-bold">Transaction Type:</span>
                <select
                  value={movementTypeFilter}
                  onChange={(e) => setMovementTypeFilter(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="PURCHASE">Supplier Purchase Receipt</option>
                  <option value="CONSUMPTION">Service Job Consumption</option>
                  <option value="ALLOCATION">Reserve Allocation</option>
                  <option value="RETURN">Return to Warehouse</option>
                  <option value="ADJUSTMENT">Physical Count Adjustment</option>
                </select>
              </div>
            </div>

            {/* Timeline log registry */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                      <th className="px-6 py-4">Timestamp & Performed By</th>
                      <th className="px-6 py-4">Spare Part Information</th>
                      <th className="px-6 py-4 text-center">Movement Type</th>
                      <th className="px-6 py-4 text-center">Change Qty</th>
                      <th className="px-6 py-4">Reference Doc</th>
                      <th className="px-6 py-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredMovements.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400 italic">No movement logs found matching the filter criteria.</td>
                      </tr>
                    ) : (
                      filteredMovements.map(mov => {
                        const isIN = mov.direction === 'IN';
                        return (
                          <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 space-y-1">
                              <p className="text-slate-400 text-[10px] flex items-center gap-1 font-semibold font-mono">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(mov.timestamp).toLocaleString()}
                              </p>
                              <p className="font-extrabold text-slate-800 flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {mov.userName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold">{mov.userRole}</p>
                            </td>

                            <td className="px-6 py-4">
                              <span className="font-mono text-[10px] font-black text-slate-900 bg-slate-100 px-1 py-0.5 rounded">{mov.partCode}</span>
                              <p className="font-bold text-slate-700 mt-1">{mov.partName}</p>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                mov.type === 'PURCHASE' ? 'bg-emerald-50 text-emerald-600' :
                                mov.type === 'CONSUMPTION' ? 'bg-red-50 text-red-600' :
                                mov.type === 'ALLOCATION' ? 'bg-blue-50 text-blue-600' :
                                mov.type === 'RETURN' ? 'bg-teal-50 text-teal-600' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {mov.type}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <span className={`font-black font-mono text-sm px-2 py-1 rounded-lg ${
                                isIN ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                                {isIN ? '+' : '-'}{mov.quantity}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              {mov.referenceDoc && mov.referenceDoc !== 'N/A' ? (
                                <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px]">
                                  {mov.referenceDoc}
                                </span>
                              ) : (
                                <span className="text-slate-400">N/A</span>
                              )}
                            </td>

                            <td className="px-6 py-4 text-slate-500 font-medium max-w-[220px]">
                              {mov.remarks}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Upper control bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Spare Parts Categories</h3>
                <p className="text-xs text-slate-400 font-medium">Manage categorization taxonomy and analyze inventory value per division.</p>
              </div>
              {hasWritePermission && (
                <button
                  onClick={() => {
                    setCategoryFormName('');
                    setCategoryFormDescription('');
                    setCategoryFormLeadTime(10);
                    setShowAddCategoryModal(true);
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Category
                </button>
              )}
            </div>

            {/* Categories cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customCategories.map(cat => {
                const partsInCategory = inventory.filter(item => item.category === cat.name);
                const uniquePartsCount = partsInCategory.length;
                const totalQty = partsInCategory.reduce((sum, item) => sum + item.onHandQty, 0);
                const totalValue = partsInCategory.reduce((sum, item) => sum + (item.onHandQty * item.unitPrice), 0);
                const isSelected = selectedCategoryName === cat.name;

                return (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCategoryName(cat.name)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/5 shadow-md shadow-blue-500/5 ring-1 ring-blue-600/35'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs uppercase text-slate-800 tracking-wider bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Filter className="w-3.5 h-3.5 text-blue-500" />
                          {cat.name}
                        </span>
                        
                        {!['Consumables', 'Electronics', 'Mechanical', 'Optical', 'Calibrator', 'Reagent', 'Tools'].includes(cat.name) && hasWritePermission && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(cat.name);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete custom category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 font-medium line-clamp-2 min-h-[2rem]">
                        {cat.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block">Parts</span>
                        <p className="text-sm font-black text-slate-800 mt-0.5">{uniquePartsCount}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block">Stock</span>
                        <p className="text-sm font-black text-slate-800 mt-0.5">{totalQty}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block">Value</span>
                        <p className="text-xs font-black text-blue-600 mt-1">LKR {totalValue.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-50/50 pt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Lead: {cat.leadTimeDays}d
                      </span>
                      {isSelected && (
                        <span className="text-blue-600 font-extrabold flex items-center gap-0.5">
                          Selected View <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Category Parts list */}
            {selectedCategoryName && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden space-y-4">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Spare Parts Under "{selectedCategoryName}"
                  </h4>
                  <span className="text-xs text-slate-400 font-bold">
                    {inventory.filter(item => item.category === selectedCategoryName).length} item(s) found
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                        <th className="px-6 py-3">Part Code</th>
                        <th className="px-6 py-3">Spare Part Name</th>
                        <th className="px-6 py-3">Brand/Manufacturer</th>
                        <th className="px-6 py-3">Warehouse Location</th>
                        <th className="px-6 py-3 text-center">Qty Available</th>
                        <th className="px-6 py-3 text-right">Unit Price</th>
                        <th className="px-6 py-3 text-right">Total Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {inventory.filter(item => item.category === selectedCategoryName).length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-400 italic">No parts catalogued under this category.</td>
                        </tr>
                      ) : (
                        inventory.filter(item => item.category === selectedCategoryName).map(item => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-3.5 font-mono text-[10px] font-black text-slate-900">{item.partCode}</td>
                            <td className="px-6 py-3.5 font-bold text-slate-800">{item.partName}</td>
                            <td className="px-6 py-3.5">{item.brand}</td>
                            <td className="px-6 py-3.5 font-semibold text-slate-500 font-mono text-[10px]">{item.warehouseLocation}</td>
                            <td className="px-6 py-3.5 text-center font-bold font-mono">
                              <span className={`px-2 py-0.5 rounded ${
                                item.onHandQty === 0 ? 'bg-rose-50 text-rose-600 font-black' :
                                item.onHandQty <= item.reorderLevel ? 'bg-amber-50 text-amber-600 font-black' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {item.onHandQty} / {item.reorderLevel} min
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-right font-bold">LKR {item.unitPrice.toLocaleString()}</td>
                            <td className="px-6 py-3.5 text-right font-black text-slate-900">LKR {(item.onHandQty * item.unitPrice).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'manufacturers' && (
          <motion.div
            key="manufacturers"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Control bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search manufacturer, country..."
                  value={manufacturerSearchTerm}
                  onChange={(e) => setManufacturerSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              {hasWritePermission && (
                <button
                  onClick={() => {
                    setEditingManufacturerId(null);
                    setMfrFormName('');
                    setMfrFormCountry('');
                    setMfrFormContact('');
                    setMfrFormPhone('');
                    setMfrFormEmail('');
                    setMfrFormRating(4);
                    setShowAddManufacturerModal(true);
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-end md:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Register Manufacturer
                </button>
              )}
            </div>

            {/* Grid of Manufacturer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {manufacturers
                .filter(m => 
                  m.name.toLowerCase().includes(manufacturerSearchTerm.toLowerCase()) ||
                  m.country.toLowerCase().includes(manufacturerSearchTerm.toLowerCase())
                )
                .map(m => {
                  const partsForMfr = inventory.filter(item => item.brand.toLowerCase() === m.name.toLowerCase());
                  const count = partsForMfr.length;
                  const value = partsForMfr.reduce((sum, item) => sum + (item.onHandQty * item.unitPrice), 0);

                  return (
                    <div key={m.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-all">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-black text-sm text-slate-800 tracking-tight">{m.name}</h4>
                            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mt-1">
                              <Globe className="w-3 h-3 text-slate-400" />
                              {m.country}
                            </span>
                          </div>

                          <div className="flex gap-1">
                            {hasWritePermission && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingManufacturerId(m.id);
                                    setMfrFormName(m.name);
                                    setMfrFormCountry(m.country);
                                    setMfrFormContact(m.contactPerson);
                                    setMfrFormPhone(m.phone);
                                    setMfrFormEmail(m.email);
                                    setMfrFormRating(m.rating);
                                    setShowAddManufacturerModal(true);
                                  }}
                                  className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-all cursor-pointer"
                                  title="Edit details"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteManufacturer(m.id, m.name)}
                                  className="p-1 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                                  title="Remove Manufacturer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Ratings display */}
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg w-max">
                          <span className="text-[10px] font-bold text-slate-400">Quality Rating:</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-3.5 h-3.5 ${
                                  idx < m.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="space-y-1.5 border-t border-slate-50 pt-3 text-[11px] text-slate-500 font-medium font-mono">
                          <p><strong className="text-slate-400 font-sans">Rep:</strong> {m.contactPerson}</p>
                          <p><strong className="text-slate-400 font-sans">Phone:</strong> {m.phone}</p>
                          <p><strong className="text-slate-400 font-sans">Email:</strong> {m.email}</p>
                        </div>
                      </div>

                      {/* Stats block */}
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Supplied Parts</span>
                          <p className="font-black text-slate-800 mt-0.5">{count} item(s)</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Asset Value</span>
                          <p className="font-black text-emerald-600 mt-0.5">LKR {value.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}

        {activeTab === 'compatibility' && (
          <motion.div
            key="compatibility"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Split layout: Models Left list, Parts Right compatibility list */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Models selection card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    Biomedical Models
                  </h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Select an instrument model to analyze its spare parts catalog.</p>
                </div>

                <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
                  {dynamicCompatibilityModels.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No instrument models catalogued yet.</p>
                  ) : (
                    dynamicCompatibilityModels.map(model => {
                      const isSelected = selectedCompatibilityModel === model;
                      const partsCount = inventory.filter(item => item.compatibleModels.includes(model)).length;

                      return (
                        <button
                          key={model}
                          onClick={() => setSelectedCompatibilityModel(model)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <span>{model}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-500'
                          }`}>
                            {partsCount}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>

                {hasWritePermission && (
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Quick Add Association</span>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!compatFormPartId || !compatFormModel.trim()) return;
                        handleToggleModelCompatibility(compatFormPartId, compatFormModel.trim(), 'ADD');
                        setCompatFormModel('');
                        alert(`Compatibility associated successfully!`);
                      }}
                      className="space-y-2.5"
                    >
                      <select
                        required
                        value={compatFormPartId}
                        onChange={(e) => setCompatFormPartId(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="">Select Spare Part...</option>
                        {inventory.map(i => (
                          <option key={i.id} value={i.id}>{i.partCode} - {i.partName}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alinity i-Series"
                        value={compatFormModel}
                        onChange={(e) => setCompatFormModel(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Create Mapping
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Compatible parts table listing */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden space-y-4">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-wider text-slate-800">
                      Compatible Components Directory
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Displaying active spare parts certified compatible with the <strong className="text-blue-600 font-extrabold">{selectedCompatibilityModel}</strong> biomedical system.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                        <th className="px-6 py-4">Part Code</th>
                        <th className="px-6 py-4">Spare Part Information</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Warehouse Location</th>
                        <th className="px-6 py-4 text-center">Available Stock</th>
                        <th className="px-6 py-4 text-right">Unit Price</th>
                        {hasWritePermission && <th className="px-6 py-4 text-center">Manage</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {inventory.filter(item => item.compatibleModels.includes(selectedCompatibilityModel)).length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-16 text-slate-400 italic">
                            No compatible parts found registered for "{selectedCompatibilityModel}". Use the form on the left to map one!
                          </td>
                        </tr>
                      ) : (
                        inventory
                          .filter(item => item.compatibleModels.includes(selectedCompatibilityModel))
                          .map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-mono font-black text-[10px] text-slate-900">{item.partCode}</td>
                              <td className="px-6 py-4 space-y-1">
                                <p className="font-extrabold text-slate-800">{item.partName}</p>
                                <p className="text-[10px] text-slate-400 line-clamp-1">{item.description || 'No detailed specifications entered.'}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[9px] uppercase tracking-wider">
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-mono text-[10px] font-semibold text-slate-500">{item.warehouseLocation}</td>
                              <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-1 rounded font-black font-mono text-sm ${
                                  item.onHandQty === 0 ? 'bg-rose-50 text-rose-700' :
                                  item.onHandQty <= item.reorderLevel ? 'bg-amber-50 text-amber-700' :
                                  'bg-emerald-50 text-emerald-700'
                                }`}>
                                  {item.onHandQty} available
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-black">LKR {item.unitPrice.toLocaleString()}</td>
                              {hasWritePermission && (
                                <td className="px-6 py-4 text-center">
                                  <button
                                    onClick={() => handleToggleModelCompatibility(item.id, selectedCompatibilityModel, 'REMOVE')}
                                    title={`Unmap compatibility with ${selectedCompatibilityModel}`}
                                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-all"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 1: Add/Edit Spare Part Details */}
      <AnimatePresence>
        {showAddEditModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">
                  {editingItem ? 'Edit Spare Part details' : 'Register New Spare Part'}
                </h3>
                <button onClick={() => setShowAddEditModal(false)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Part Code (Unique)</label>
                    <input
                      type="text"
                      required
                      value={formPartCode}
                      onChange={(e) => setFormPartCode(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                    >
                      {customCategories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Part Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Laser Diode Module XN"
                    value={formPartName}
                    onChange={(e) => setFormPartName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Brand / Manufacturer</label>
                    <input
                      type="text"
                      list="manufacturers-datalist"
                      placeholder="e.g. Sysmex, Roche"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    />
                    <datalist id="manufacturers-datalist">
                      {manufacturers.map(m => (
                        <option key={m.id} value={m.name}>{m.country}</option>
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Warehouse Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aisle 2, Bin 15"
                      value={formWarehouseLocation}
                      onChange={(e) => setFormWarehouseLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Description</label>
                  <textarea
                    placeholder="Detailed description, voltage parameters or specs..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Compatible Instrument Models (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. XN-1000, XN-2000, Cobas e411"
                    value={formCompatibleModels}
                    onChange={(e) => setFormCompatibleModels(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Unit Price (LKR)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formUnitPrice}
                      onChange={(e) => setFormUnitPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Reorder Level (Min)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formReorderLevel}
                      onChange={(e) => setFormReorderLevel(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Supplier</label>
                    <select
                      value={formSupplierId}
                      onChange={(e) => setFormSupplierId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="">No Linked Supplier</option>
                      {suppliers.map(sup => (
                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                      ))}
                    </select>
                  </div>

                  {!editingItem && (
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Initial Qty on Hand</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={formInitialQty}
                        onChange={(e) => setFormInitialQty(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                  >
                    Save Spare Part
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Record Stock Transaction */}
      <AnimatePresence>
        {showTransactionModal && selectedItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">
                  Process Stock Transaction
                </h3>
                <button onClick={() => setShowTransactionModal(false)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 bg-blue-50/50 border-b border-slate-100 text-xs text-slate-600 space-y-1">
                <p><strong className="text-slate-800">Part:</strong> {selectedItem.partCode} - {selectedItem.partName}</p>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-slate-700">
                  <div><strong>On Hand:</strong> {selectedItem.onHandQty}</div>
                  <div><strong>Allocated:</strong> {selectedItem.allocatedQty}</div>
                  <div><strong>Available:</strong> {selectedItem.availableQty}</div>
                </div>
              </div>

              <form onSubmit={handleProcessTransaction} className="p-6 space-y-4">
                
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Transaction Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as StockMovementType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="ADJUSTMENT">Adjustment (Manual Override)</option>
                    <option value="PURCHASE">Purchase (Receive Supplier Delivery)</option>
                    <option value="ALLOCATION">Allocation (Reserve for Job)</option>
                    <option value="CONSUMPTION">Consumption (Install on Instrument)</option>
                    <option value="RETURN">Return (Unused parts to Warehouse)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Quantity</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={txQty}
                      onChange={(e) => setTxQty(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Reference Document No.</label>
                    <input
                      type="text"
                      placeholder="e.g. JOB-1029 or PO-0042"
                      value={txRefDoc}
                      onChange={(e) => setTxRefDoc(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Remarks & Audit Notes</label>
                  <textarea
                    required
                    placeholder="Enter audit remarks justifying this inventory change..."
                    value={txRemarks}
                    onChange={(e) => setTxRemarks(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTransactionModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                  >
                    Submit Transaction
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Add Custom Category */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">
                  Create Parts Category
                </h3>
                <button onClick={() => setShowAddCategoryModal(false)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Category Name (Unique)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fluidics, Vacuum"
                    value={categoryFormName}
                    onChange={(e) => setCategoryFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Description / Taxonomy Scope</label>
                  <textarea
                    required
                    placeholder="Describe which parts, sensors, or tubing belong to this category..."
                    value={categoryFormDescription}
                    onChange={(e) => setCategoryFormDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Average Sourcing Lead Time (Days)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={categoryFormLeadTime}
                    onChange={(e) => setCategoryFormLeadTime(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Register Manufacturer */}
      <AnimatePresence>
        {showAddManufacturerModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">
                  {editingManufacturerId ? 'Edit Manufacturer details' : 'Register Manufacturer'}
                </h3>
                <button onClick={() => setShowAddManufacturerModal(false)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveManufacturer} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Manufacturer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abbott, Bio-Rad"
                      value={mfrFormName}
                      onChange={(e) => setMfrFormName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Country of Origin</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. USA, Germany, Japan"
                      value={mfrFormCountry}
                      onChange={(e) => setMfrFormCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Representative Contact Person</label>
                    <input
                      type="text"
                      placeholder="Name of Key Account Manager..."
                      value={mfrFormContact}
                      onChange={(e) => setMfrFormContact(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Quality Rating (1-5)</label>
                    <select
                      value={mfrFormRating}
                      onChange={(e) => setMfrFormRating(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                      <option value="4">⭐⭐⭐⭐ (Good)</option>
                      <option value="3">⭐⭐⭐ (Average)</option>
                      <option value="2">⭐⭐ (Needs Improvement)</option>
                      <option value="1">⭐ (Unsatisfactory)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +1-555-019-2834"
                      value={mfrFormPhone}
                      onChange={(e) => setMfrFormPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. orders@abbott.com"
                      value={mfrFormEmail}
                      onChange={(e) => setMfrFormEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddManufacturerModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                  >
                    {editingManufacturerId ? 'Save Changes' : 'Register Manufacturer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
