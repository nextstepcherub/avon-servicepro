import React, { useState } from 'react';
import { Supplier, SupplierContact, UserProfile, AuditLogRecord } from '../types';
import { 
  Building2, 
  Phone, 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit3, 
  X, 
  ChevronRight, 
  Globe, 
  MapPin, 
  Mail, 
  Star, 
  Check, 
  UserPlus,
  Briefcase,
  AlertTriangle,
  Heart,
  Tag,
  ThumbsUp,
  SlidersHorizontal,
  FolderLock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SupplierDirectoryProps {
  suppliers: Supplier[];
  activeUser: UserProfile;
  onUpdateSuppliers: (updatedSuppliers: Supplier[]) => void;
  onLogAudit: (action: string, previousValue?: string, newValue?: string, remarks?: string) => void;
}

const KNOWN_CATEGORIES = [
  'Medical Equipment',
  'Laboratory Reagents',
  'Calibration Instruments',
  'Spare Parts',
  'Consumables',
  'Imaging Systems',
  'Chemical Agents'
];

const ALLOWED_ROLES = ['System Admin', 'Admin', 'Service Manager', 'Workshop Manager', 'Documentation Officer'];

export default function SupplierDirectory({
  suppliers,
  activeUser,
  onUpdateSuppliers,
  onLogAudit
}: SupplierDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');

  // Modal control states
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<Supplier | null>(null);

  // Form states for Create/Edit Supplier
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategories, setFormCategories] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<Supplier['status']>('Active');
  const [formAddress, setFormAddress] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [formContacts, setFormContacts] = useState<SupplierContact[]>([]);

  // State to add/edit contact inside Form
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactIsDefault, setContactIsDefault] = useState(false);

  const hasWritePermission = ALLOWED_ROLES.includes(activeUser.role);

  // Open add supplier
  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormName('');
    const randomCode = `SUP-${Math.floor(100 + Math.random() * 900)}`;
    setFormCode(randomCode);
    setFormCategories([]);
    setFormStatus('Active');
    setFormAddress('');
    setFormCountry('');
    setFormWebsite('');
    setFormRating(5);
    setFormContacts([]);
    setIsAddingContact(false);
    setEditingContactIndex(null);
    setShowAddEditModal(true);
  };

  // Open edit supplier
  const handleOpenEdit = (sup: Supplier, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSupplier(sup);
    setFormName(sup.name);
    setFormCode(sup.code);
    setFormCategories([...sup.categories]);
    setFormStatus(sup.status);
    setFormAddress(sup.address);
    setFormCountry(sup.country);
    setFormWebsite(sup.website || '');
    setFormRating(sup.rating || 5);
    setFormContacts(sup.contacts.map(c => ({ ...c })));
    setIsAddingContact(false);
    setEditingContactIndex(null);
    setShowAddEditModal(true);
  };

  // Delete Supplier
  const handleDeleteSupplier = (id: string) => {
    const target = suppliers.find(s => s.id === id);
    const updated = suppliers.filter(s => s.id !== id);
    onUpdateSuppliers(updated);
    onLogAudit(
      'DELETE_SUPPLIER',
      target?.name,
      undefined,
      `Removed supplier ${target?.name} (${target?.code}) from directories.`
    );
    setShowDeleteConfirm(null);
    if (showDetailsModal?.id === id) {
      setShowDetailsModal(null);
    }
  };

  // Toggle Category inside form
  const handleToggleFormCategory = (cat: string) => {
    if (formCategories.includes(cat)) {
      setFormCategories(formCategories.filter(c => c !== cat));
    } else {
      setFormCategories([...formCategories, cat]);
    }
  };

  // Add/Update contact in memory list
  const handleSaveFormContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      return; // Validation simple
    }

    const contactData: SupplierContact = {
      id: editingContactIndex !== null && formContacts[editingContactIndex] 
        ? formContacts[editingContactIndex].id 
        : `sup_con_${Date.now()}`,
      name: contactName.trim(),
      phone: contactPhone.trim(),
      email: contactEmail.trim() || undefined,
      role: contactRole.trim() || 'Contact Representative',
      isDefault: contactIsDefault
    };

    let updatedContacts = [...formContacts];

    // If marked default, unset others
    if (contactIsDefault) {
      updatedContacts = updatedContacts.map(c => ({ ...c, isDefault: false }));
    }

    if (editingContactIndex !== null) {
      updatedContacts[editingContactIndex] = contactData;
    } else {
      // If first contact, make default
      if (updatedContacts.length === 0) {
        contactData.isDefault = true;
      }
      updatedContacts.push(contactData);
    }

    // Ensure at least one default if multiple exist
    const hasDefault = updatedContacts.some(c => c.isDefault);
    if (!hasDefault && updatedContacts.length > 0) {
      updatedContacts[0].isDefault = true;
    }

    setFormContacts(updatedContacts);
    resetContactForm();
  };

  const resetContactForm = () => {
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setContactRole('');
    setContactIsDefault(false);
    setIsAddingContact(false);
    setEditingContactIndex(null);
  };

  const handleEditContactInline = (idx: number) => {
    const target = formContacts[idx];
    setContactName(target.name);
    setContactPhone(target.phone);
    setContactEmail(target.email || '');
    setContactRole(target.role || '');
    setContactIsDefault(!!target.isDefault);
    setEditingContactIndex(idx);
    setIsAddingContact(true);
  };

  const handleRemoveContactInline = (idx: number) => {
    const isDefaultRemoved = formContacts[idx].isDefault;
    const updated = formContacts.filter((_, i) => i !== idx);
    if (isDefaultRemoved && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setFormContacts(updated);
  };

  // Form submit: save supplier
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    const supplierPayload: Supplier = {
      id: editingSupplier ? editingSupplier.id : `sup_${Date.now()}`,
      name: formName.trim(),
      code: formCode.trim(),
      categories: formCategories,
      status: formStatus,
      address: formAddress.trim(),
      country: formCountry.trim() || 'Sri Lanka',
      website: formWebsite.trim() || undefined,
      rating: formRating,
      contacts: formContacts
    };

    let updatedSuppliersList = [];
    if (editingSupplier) {
      updatedSuppliersList = suppliers.map(s => s.id === editingSupplier.id ? supplierPayload : s);
      onLogAudit(
        'EDIT_SUPPLIER',
        editingSupplier.name,
        supplierPayload.name,
        `Updated details for supplier ${supplierPayload.name} (${supplierPayload.code}).`
      );
    } else {
      updatedSuppliersList = [supplierPayload, ...suppliers];
      onLogAudit(
        'CREATE_SUPPLIER',
        undefined,
        supplierPayload.name,
        `Registered new supplier ${supplierPayload.name} with code ${supplierPayload.code}.`
      );
    }

    onUpdateSuppliers(updatedSuppliersList);
    setShowAddEditModal(false);
    setEditingSupplier(null);
  };

  // Filtering & Search
  const filteredSuppliers = suppliers.filter(sup => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      sup.name.toLowerCase().includes(query) ||
      sup.code.toLowerCase().includes(query) ||
      sup.country.toLowerCase().includes(query) ||
      sup.contacts.some(c => 
        c.name.toLowerCase().includes(query) || 
        c.phone.includes(searchTerm) || 
        (c.email || '').toLowerCase().includes(query)
      );

    const matchesCategory = categoryFilter === 'All' || sup.categories.includes(categoryFilter);
    const matchesStatus = statusFilter === 'All' || sup.status === statusFilter;
    const matchesRating = ratingFilter === 'All' || (sup.rating !== undefined && sup.rating >= parseInt(ratingFilter));

    return matchesSearch && matchesCategory && matchesStatus && matchesRating;
  });

  // Sorting
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'code-asc':
        return a.code.localeCompare(b.code);
      case 'rating-desc':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Title block with counts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Supplier Enterprise Directory</h1>
          </div>
          <p className="text-slate-400 text-xs">
            Manage global medical equipment vendors, technical support contacts, categories, and audit standing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasWritePermission ? (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Vendor
            </button>
          ) : (
            <div className="px-3 py-1.5 bg-slate-150 text-slate-500 rounded-lg text-[10px] flex items-center gap-1.5 font-bold">
              <FolderLock className="w-3.5 h-3.5 text-slate-400" /> Read-Only Directory
            </div>
          )}
        </div>
      </div>

      {/* Grid of quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Suppliers</span>
            <span className="text-lg font-extrabold text-slate-700">{suppliers.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Accounts</span>
            <span className="text-lg font-extrabold text-slate-700">
              {suppliers.filter(s => s.status === 'Active').length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Under Review</span>
            <span className="text-lg font-extrabold text-slate-700">
              {suppliers.filter(s => s.status === 'Under Review').length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Categories</span>
            <span className="text-lg font-extrabold text-slate-700">7 Subtypes</span>
          </div>
        </div>
      </div>

      {/* Advanced search, filtering and sorting drawer */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Main search bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by vendor name, code, country, or contact email/phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-xs transition-all text-slate-800"
            />
          </div>

          {/* Quick Clear Button */}
          {(searchTerm || categoryFilter !== 'All' || statusFilter !== 'All' || ratingFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setStatusFilter('All');
                setRatingFilter('All');
              }}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1 self-start lg:self-center"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Categories</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              {KNOWN_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Audit Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Under Review">Under Review</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Vendor Standing</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ & Up Good</option>
              <option value="3">⭐⭐⭐ & Up Fair</option>
              <option value="2">⭐⭐ & Below Needs Work</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sort Orders</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="name-asc">Name (A - Z)</option>
              <option value="name-desc">Name (Z - A)</option>
              <option value="code-asc">Vendor Code</option>
              <option value="rating-desc">Highest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSuppliers.map((sup) => {
          const defaultContact = sup.contacts.find(c => c.isDefault) || sup.contacts[0];

          return (
            <div
              key={sup.id}
              onClick={() => setShowDetailsModal(sup)}
              className="bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header card banner */}
                <div className="p-5 pb-3 border-b border-slate-50 flex justify-between items-start">
                  <div className="space-y-1 max-w-[80%]">
                    <span className="bg-slate-100 text-slate-600 text-[9px] font-extrabold px-2 py-0.5 rounded-md tracking-wider">
                      {sup.code}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {sup.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{sup.country}</span>
                    </div>
                  </div>

                  {/* Rating / Stars */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star 
                          key={idx} 
                          className={`w-3.5 h-3.5 ${
                            idx < (sup.rating || 0) 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-slate-200'
                          }`} 
                        />
                      ))}
                    </div>
                    {/* Status Badge */}
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                      sup.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : sup.status === 'Under Review'
                        ? 'bg-amber-50 text-amber-700'
                        : sup.status === 'Inactive'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {sup.status}
                    </span>
                  </div>
                </div>

                {/* Categories */}
                <div className="px-5 py-3 border-b border-slate-50 flex flex-wrap gap-1">
                  {sup.categories.map((cat, idx) => (
                    <span 
                      key={idx} 
                      className="bg-indigo-50/50 text-indigo-700 border border-indigo-100/30 text-[9px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      {cat}
                    </span>
                  ))}
                  {sup.categories.length === 0 && (
                    <span className="text-[10px] text-slate-400 italic">No category assigned</span>
                  )}
                </div>

                {/* Primary Contact Preview */}
                <div className="p-5 space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Primary Representative
                  </span>
                  {defaultContact ? (
                    <div className="bg-slate-50/80 p-2.5 rounded-xl space-y-1 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 text-xs block">{defaultContact.name}</span>
                        <span className="bg-indigo-100 text-indigo-800 text-[8px] px-1.5 rounded font-bold uppercase tracking-wide">
                          {defaultContact.role || 'Representative'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Phone className="w-3 h-3 text-indigo-500" />
                        <span>{defaultContact.phone}</span>
                      </div>

                      {defaultContact.email && (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Mail className="w-3 h-3 text-indigo-500" />
                          <span className="truncate">{defaultContact.email}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs italic block">No contacts listed</span>
                  )}
                </div>
              </div>

              {/* Bottom Card Utilities */}
              <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-[11px]">
                <span className="text-slate-400 text-[10px] font-semibold">
                  {sup.contacts.length} registered contacts
                </span>
                <div className="flex items-center gap-1">
                  {hasWritePermission && (
                    <>
                      <button
                        onClick={(e) => handleOpenEdit(sup, e)}
                        title="Edit Supplier"
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(sup.id);
                        }}
                        title="Delete Supplier"
                        className="p-1 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          );
        })}

        {sortedSuppliers.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-extrabold text-slate-700 text-sm">No suppliers match your queries</h4>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Try updating the search keyword or selecting a different Category / Audit Status combination.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="font-extrabold text-slate-800">Confirm Vendor Deletion</h3>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Are you absolutely sure you want to remove this supplier? This action will permanently delete all associated contact representatives from the directory.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteSupplier(showDeleteConfirm)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details / History Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 15, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
            >
              {/* Modal header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                <div className="space-y-1.5">
                  <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {showDetailsModal.code}
                  </span>
                  <h2 className="text-lg font-black text-slate-800">{showDetailsModal.name}</h2>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{showDetailsModal.address}, {showDetailsModal.country}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetailsModal(null)}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal content scroll */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
                
                {/* Meta details card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vendor Metadata</span>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rating Rating:</span>
                        <span className="font-bold text-slate-700">{showDetailsModal.rating || 'Unrated'} / 5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Website Address:</span>
                        {showDetailsModal.website ? (
                          <a 
                            href={showDetailsModal.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-indigo-600 hover:underline font-semibold flex items-center gap-0.5"
                          >
                            <Globe className="w-3 h-3" /> Visit Site
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scope of Supply</span>
                    <div className="flex flex-wrap gap-1.5">
                      {showDetailsModal.categories.map((cat, idx) => (
                        <span 
                          key={idx} 
                          className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-indigo-200"
                        >
                          {cat}
                        </span>
                      ))}
                      {showDetailsModal.categories.length === 0 && (
                        <span className="text-slate-400 text-xs italic">No categorizations defined.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contacts list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                      Registered Contacts ({showDetailsModal.contacts.length})
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {showDetailsModal.contacts.map((c) => (
                      <div 
                        key={c.id} 
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                          c.isDefault 
                            ? 'bg-amber-50/50 border-amber-200' 
                            : 'bg-white border-slate-100 shadow-xs'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700 text-sm">{c.name}</span>
                            {c.isDefault && (
                              <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> DEFAULT
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-xs block font-medium">
                            {c.role || 'Service Liaison'}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3.5 text-xs">
                          <div className="flex items-center gap-1 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{c.phone}</span>
                          </div>
                          {c.email && (
                            <div className="flex items-center gap-1 text-slate-500">
                              <Mail className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{c.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {showDetailsModal.contacts.length === 0 && (
                      <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-400 italic text-xs">
                        No contact representatives listed for this vendor.
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal footer */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
                {hasWritePermission && (
                  <button
                    onClick={(e) => {
                      setShowDetailsModal(null);
                      handleOpenEdit(showDetailsModal, e);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Edit Vendor Details
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Supplier Modal */}
      <AnimatePresence>
        {showAddEditModal && (
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Form header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="space-y-0.5">
                  <h2 className="text-base font-black text-slate-800">
                    {editingSupplier ? `Edit Supplier Profile: ${editingSupplier.name}` : 'Register New Enterprise Vendor'}
                  </h2>
                  <p className="text-[11px] text-slate-400">Fill out all organizational, categorization and contact records below.</p>
                </div>
                <button
                  onClick={() => setShowAddEditModal(false)}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleSaveSupplier} className="overflow-y-auto flex-1 p-6 space-y-6">
                
                {/* Section 1: Core Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-1">
                    1. Supplier Core Profile
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Vendor Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Sysmex Asia Pacific Pte Ltd"
                        className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Supplier Code <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={formCode}
                        onChange={(e) => setFormCode(e.target.value)}
                        placeholder="e.g. SUP-109"
                        className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white text-xs text-slate-800 outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Website Address</label>
                      <input
                        type="url"
                        value={formWebsite}
                        onChange={(e) => setFormWebsite(e.target.value)}
                        placeholder="e.g. https://www.sysmex-ap.com"
                        className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Country of Origin</label>
                      <input
                        type="text"
                        value={formCountry}
                        onChange={(e) => setFormCountry(e.target.value)}
                        placeholder="e.g. Japan"
                        className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600 block">Physical Address</label>
                      <textarea
                        rows={2}
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        placeholder="e.g. 9 Tampines Grande, #06-00, Singapore"
                        className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:bg-white text-xs text-slate-800 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Audit Status</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as Supplier['status'])}
                        className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none focus:border-indigo-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Vendor Rating ({formRating} Stars)</label>
                      <div className="flex gap-1.5 items-center pt-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setFormRating(idx + 1)}
                            className="p-0.5 rounded hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star 
                              className={`w-6 h-6 ${
                                idx < formRating 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-slate-200'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Categories */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-1">
                    2. Scope / Categories
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      Select all supply types that this vendor distributes:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {KNOWN_CATEGORIES.map(cat => {
                        const isSelected = formCategories.includes(cat);
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => handleToggleFormCategory(cat)}
                            className={`p-2 rounded-xl text-left border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100/50'
                            }`}
                          >
                            <span>{cat}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-indigo-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section 3: Contacts */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-1">
                    3. Vendor Representatives & Contacts
                  </h3>

                  {/* Inline list of contacts */}
                  <div className="space-y-2">
                    {formContacts.map((c, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex justify-between items-center text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-700">{c.name}</span>
                            {c.isDefault && (
                              <span className="bg-amber-100 text-amber-800 text-[7px] font-black px-1 rounded-sm">
                                PRIMARY
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-[10px] block font-medium">
                            {c.role} • {c.phone} {c.email ? `• ${c.email}` : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditContactInline(idx)}
                            className="p-1 hover:bg-slate-200 text-slate-500 rounded-md cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveContactInline(idx)}
                            className="p-1 hover:bg-red-50 text-red-500 rounded-md cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {formContacts.length === 0 && (
                      <p className="text-slate-400 italic text-[11px]">No contacts registered yet. Please add at least one representative below.</p>
                    )}
                  </div>

                  {/* Contact details mini-form */}
                  {!isAddingContact ? (
                    <button
                      type="button"
                      onClick={() => {
                        resetContactForm();
                        setIsAddingContact(true);
                      }}
                      className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <UserPlus className="w-4 h-4" /> Add Representative Contact
                    </button>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-700">
                        {editingContactIndex !== null ? 'Modify Contact Representative' : 'Add Contact Representative'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-500">Full Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full bg-white p-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-500">Designation / Role</label>
                          <input
                            type="text"
                            value={contactRole}
                            onChange={(e) => setContactRole(e.target.value)}
                            placeholder="e.g. Account Manager"
                            className="w-full bg-white p-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-500">Contact Number <span className="text-red-500">*</span></label>
                          <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="e.g. +65 9182 3121"
                            className="w-full bg-white p-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-500">Email Address</label>
                          <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="e.g. sarah.j@vendor.com"
                            className="w-full bg-white p-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-2 col-span-1 sm:col-span-2">
                          <input
                            type="checkbox"
                            id="contact_default_chk"
                            checked={contactIsDefault}
                            onChange={(e) => setContactIsDefault(e.target.checked)}
                            className="w-4.5 h-4.5 accent-indigo-600 cursor-pointer"
                          />
                          <label htmlFor="contact_default_chk" className="text-xs font-bold text-slate-600 select-none cursor-pointer">
                            Set as primary/default representative for this supplier
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-1.5 pt-1 text-xs">
                        <button
                          type="button"
                          onClick={resetContactForm}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg cursor-pointer"
                        >
                          Discard
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveFormContact}
                          disabled={!contactName.trim() || !contactPhone.trim()}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Keep Contact
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </form>

              {/* Form footer */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSupplier}
                  disabled={!formName.trim() || !formCode.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {editingSupplier ? 'Save Update' : 'Register Vendor'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
