import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Trash2, 
  Edit, 
  X, 
  Check, 
  Award, 
  Info, 
  KeyRound,
  UserCheck,
  UserX,
  MapPin,
  Building2,
  LockKeyhole
} from 'lucide-react';

interface UserManagementProps {
  currentUser: UserProfile;
  users: UserProfile[];
  onUpdateUsers: (updatedUsers: UserProfile[]) => void;
}

// Hierarchical definition of corporate roles at AVON Metrology
const ROLE_TIERS: { [key: string]: { rank: number; label: string } } = {
  'System Admin': { rank: 1, label: 'Tier 1 - Root Administration' },
  'Admin': { rank: 2, label: 'Tier 2 - Operational Admin' },
  'Service Manager': { rank: 3, label: 'Tier 3 - Management & Planning' },
  'Workshop Manager': { rank: 3, label: 'Tier 3 - Management & Planning' },
  'Senior Biomedical Engineer': { rank: 4, label: 'Tier 4 - Senior Technical' },
  'Senior Service Engineer': { rank: 4, label: 'Tier 4 - Senior Technical' },
  'Senior Workshop Engineer': { rank: 4, label: 'Tier 4 - Senior Technical' },
  'Biomedical Engineer': { rank: 5, label: 'Tier 5 - Field Operations' },
  'Service Engineer': { rank: 5, label: 'Tier 5 - Field Operations' },
  'Calibration Engineer': { rank: 5, label: 'Tier 5 - Calibration Lab' },
  'Workshop Engineer': { rank: 5, label: 'Tier 5 - Lab Operations' },
  'Documentation Officer': { rank: 5, label: 'Tier 5 - Compliance & QA' },
  'Technician': { rank: 6, label: 'Tier 6 - Technical Support' },
  'Trainee Engineer': { rank: 6, label: 'Tier 6 - Technical Support' },
  'Trainee Technician': { rank: 7, label: 'Tier 7 - Trainees & Interns' },
  'Intern Technician': { rank: 7, label: 'Tier 7 - Trainees & Interns' }
};

const getRoleRank = (role: string): number => {
  const found = ROLE_TIERS[role];
  if (found) return found.rank;
  
  // Fuzzy fallback matching
  const r = role.toLowerCase();
  if (r.includes('system admin')) return 1;
  if (r.includes('admin')) return 2;
  if (r.includes('manager')) return 3;
  if (r.includes('senior')) return 4;
  if (r.includes('biomedical') || r.includes('service') || r.includes('calibration') || r.includes('documentation') || r.includes('officer')) return 5;
  if (r.includes('technician') || r.includes('engineer')) return 6;
  return 7;
};

const getTierLabel = (role: string): string => {
  const found = ROLE_TIERS[role];
  if (found) return found.label;
  const rank = getRoleRank(role);
  return `Tier ${rank} - Technical Staff`;
};

export default function UserManagement({ currentUser, users, onUpdateUsers }: UserManagementProps) {
  // Filters and UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Alerts and notices
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Modals / forms states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Form Field States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('Biomedical Engineer');
  const [formTerritory, setFormTerritory] = useState('Colombo Head Office');
  const [formDepartment, setFormDepartment] = useState('Field Technical Service');

  const triggerAlert = (type: 'success' | 'error' | 'info', msg: string) => {
    setAlert({ type, message: msg });
    setTimeout(() => setAlert(null), 5000);
  };

  const currentRank = getRoleRank(currentUser.role);

  // Helper check to determine if the active user can modify target user
  const canModify = (targetUser: UserProfile): boolean => {
    if (currentUser.id === targetUser.id) return true; // Can always manage own details
    const targetRank = getRoleRank(targetUser.role);
    return currentRank < targetRank; // Strictly higher level (smaller rank number)
  };

  // Create User
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPassword) {
      triggerAlert('error', 'All fields are required.');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === formEmail.toLowerCase().trim())) {
      triggerAlert('error', 'A user with this email already exists.');
      return;
    }

    // Role check - cannot create a user with a higher or equal role rank
    const targetRank = getRoleRank(formRole);
    if (targetRank <= currentRank) {
      triggerAlert('error', `You do not have permission to create users with the role: "${formRole}". Role must be lower than yours.`);
      return;
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: formName.trim(),
      email: formEmail.toLowerCase().trim(),
      password: formPassword,
      role: formRole,
      territory: formTerritory,
      department: formDepartment,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&q=80&w=120`,
      disabled: false,
      tags: []
    };

    onUpdateUsers([newUser, ...users]);
    triggerAlert('success', `User account for "${formName}" created successfully!`);
    setIsCreateOpen(false);
    resetForm();
  };

  // Edit User
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (!formName || !formEmail) {
      triggerAlert('error', 'Name and Email are required.');
      return;
    }

    // Double check permission
    if (!canModify(selectedUser)) {
      triggerAlert('error', 'Access Denied: You cannot modify this user.');
      return;
    }

    // Role escalation check
    const targetRank = getRoleRank(formRole);
    if (selectedUser.id !== currentUser.id && targetRank <= currentRank) {
      triggerAlert('error', 'Security Limit: You cannot assign a role equal to or higher than your own.');
      return;
    }

    const updatedUsers = users.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          name: formName.trim(),
          email: formEmail.toLowerCase().trim(),
          // Update password only if a new one was typed
          password: formPassword ? formPassword : u.password,
          // Only allow updating role if not editing self
          role: currentUser.id === u.id ? u.role : formRole,
          territory: formTerritory,
          department: formDepartment
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    triggerAlert('success', `User profiles for "${formName}" updated successfully.`);
    setIsEditOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('Biomedical Engineer');
    setFormTerritory('Colombo Head Office');
    setFormDepartment('Field Technical Service');
    setSelectedUser(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditModal = (user: UserProfile) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword(''); // blank password input by default for safety
    setFormRole(user.role);
    setFormTerritory(user.territory || 'Colombo Head Office');
    setFormDepartment(user.department || 'Field Technical Service');
    setIsEditOpen(true);
  };

  // Toggle user status (Activate / Disable)
  const handleToggleStatus = (user: UserProfile) => {
    if (user.id === currentUser.id) {
      triggerAlert('error', 'Self-Lockout Prevention: You cannot disable your own account.');
      return;
    }

    if (!canModify(user)) {
      triggerAlert('error', 'Access Denied: You cannot change status for this level of personnel.');
      return;
    }

    const nextStatus = !user.disabled;
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, disabled: nextStatus };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    triggerAlert('success', `Account for "${user.name}" has been ${nextStatus ? 'DISABLED' : 'ACTIVATED'}.`);
  };

  // Delete User
  const handleDeleteUser = (user: UserProfile) => {
    if (user.id === currentUser.id) {
      triggerAlert('error', 'Operation Blocked: You cannot delete your own account.');
      return;
    }

    if (!canModify(user)) {
      triggerAlert('error', 'Access Denied: You cannot remove this level of personnel.');
      return;
    }

    if (window.confirm(`SECURITY WARNING:\nAre you absolutely certain you want to permanently purge "${user.name}" from the system?\nThis action will revoke all security credentials.`)) {
      const updatedUsers = users.filter(u => u.id !== user.id);
      onUpdateUsers(updatedUsers);
      triggerAlert('success', `User account for "${user.name}" has been permanently purged.`);
    }
  };

  // Filter users list
  const filteredUsers = users.filter(user => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      user.name.toLowerCase().includes(q) || 
      user.email.toLowerCase().includes(q) || 
      (user.role && user.role.toLowerCase().includes(q)) ||
      (user.department && user.department.toLowerCase().includes(q));

    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'Active') matchesStatus = !user.disabled;
    if (statusFilter === 'Disabled') matchesStatus = !!user.disabled;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6" id="user_management_panel">
      {/* Upper Title and IAM Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-bold tracking-tight">Staff Directory & Identity Control</h1>
          </div>
          <p className="text-slate-400 text-xs">
            Manage corporate accounts, reset credentials, toggle access states, and review organizational hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700">
          <Award className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="text-xs">
            <p className="text-slate-400 font-medium">Logged in as:</p>
            <p className="font-bold text-white">{currentUser.name}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-amber-500/15 text-amber-400 font-mono text-[9px] rounded-md font-bold">
              {currentUser.role} ({getTierLabel(currentUser.role)})
            </span>
          </div>
        </div>
      </div>

      {/* Alert banner */}
      {alert && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1 ${
          alert.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
          alert.type === 'error' ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' :
          'bg-blue-500/10 border border-blue-500/20 text-blue-400'
        }`}>
          {alert.type === 'success' ? <ShieldCheck className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
          <span className="text-xs font-semibold">{alert.message}</span>
        </div>
      )}

      {/* Hierarchy Rule Policy Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3.5 items-start">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-slate-900">Corporate IAM Access Policy</h4>
          <p className="text-slate-600 leading-relaxed">
            The security structure prevents privilege escalation. Employees are permitted to change their <strong>own credentials</strong> (name and password) or those of staff belonging to <strong>strictly lower levels</strong>. You cannot create, modify, disable, or delete accounts of equal or higher tier ranks.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono text-slate-500">
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Tier 1: System Admin</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Tier 2: Admin</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Tier 3: Managers</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Tier 4-5: Engineers & QA</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Tier 6-7: Technicians & Interns</span>
          </div>
        </div>
      </div>

      {/* Toolbar / Search Filters */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff by name, email, role, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none transition-all placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="All">All Roles</option>
              {Array.from(new Set(users.map(u => u.role))).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Accounts</option>
              <option value="Disabled">Disabled Accounts</option>
            </select>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Staff Account</span>
        </button>
      </div>

      {/* Directory Staff List Grid */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/75 text-slate-500 border-b border-slate-200/60 text-[11px] font-black uppercase tracking-wider">
                <th className="py-4 px-6">Staff Member</th>
                <th className="py-4 px-6">Role & Tier</th>
                <th className="py-4 px-6">Branch & Department</th>
                <th className="py-4 px-6">Account Status</th>
                <th className="py-4 px-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => {
                  const editable = canModify(user);
                  const isSelf = user.id === currentUser.id;
                  const rankNum = getRoleRank(user.role);

                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${
                        user.disabled ? 'bg-slate-50/40 text-slate-400' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}
                            alt={user.name}
                            className={`w-9 h-9 rounded-xl object-cover border ${
                              user.disabled ? 'border-slate-300 opacity-60' : 'border-slate-200 shadow-sm'
                            }`}
                          />
                          <div>
                            <span className="font-bold text-slate-900 flex items-center gap-1">
                              {user.name}
                              {isSelf && (
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[8px] uppercase tracking-wide font-black rounded-md">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-slate-400 text-[10px] block font-mono">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <span className={`inline-block font-bold px-2 py-0.5 rounded-lg text-[10px] ${
                            rankNum <= 2 ? 'bg-indigo-50 text-indigo-700' :
                            rankNum <= 4 ? 'bg-amber-50 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {user.role}
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{getTierLabel(user.role)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 space-y-0.5">
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-700">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{user.department || 'Technical Services'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{user.territory || 'Colombo Metro'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {user.disabled ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 rounded-lg text-[10px] font-extrabold">
                            <UserX className="w-3 h-3" />
                            <span>Disabled</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-extrabold">
                            <UserCheck className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit details (name & password change allowed) */}
                          {editable ? (
                            <button
                              onClick={() => openEditModal(user)}
                              title="Modify Profile and Set Password"
                              className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-all cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              disabled
                              title="Insufficient security clearance to modify this profile"
                              className="p-2 text-slate-200 cursor-not-allowed"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}

                          {/* Toggle active / disabled status */}
                          {isSelf ? (
                            <button
                              disabled
                              title="Self-Lockout Prevention: Cannot disable or activate yourself"
                              className="p-2 text-slate-200 cursor-not-allowed"
                            >
                              <Unlock className="w-4 h-4" />
                            </button>
                          ) : editable ? (
                            <button
                              onClick={() => handleToggleStatus(user)}
                              title={user.disabled ? 'Activate Account' : 'Disable Account'}
                              className={`p-2 rounded-lg transition-all cursor-pointer ${
                                user.disabled 
                                  ? 'hover:bg-emerald-50 text-emerald-600' 
                                  : 'hover:bg-rose-50 text-rose-600'
                              }`}
                            >
                              {user.disabled ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>
                          ) : (
                            <button
                              disabled
                              title="Insufficient clearance to alter this account state"
                              className="p-2 text-slate-200 cursor-not-allowed"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}

                          {/* Remove User Action */}
                          {isSelf ? (
                            <button
                              disabled
                              title="Self deletion prohibited"
                              className="p-2 text-slate-200 cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : editable ? (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              title="Permanently Delete User"
                              className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              disabled
                              title="Insufficient clearance to delete"
                              className="p-2 text-slate-200 cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 px-6 text-center text-slate-400 italic">
                    No staff records found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW ACCOUNT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-sm tracking-tight">Register Staff Member</span>
              </div>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Ruwan Wickramasinghe"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. ruwan.w@avon.lk"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Set Password</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Provide secure password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Corporate Role</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none cursor-pointer"
                >
                  <option value="Biomedical Engineer">Biomedical Engineer</option>
                  <option value="Senior Biomedical Engineer">Senior Biomedical Engineer</option>
                  <option value="Calibration Engineer">Calibration Engineer</option>
                  <option value="Workshop Engineer">Workshop Engineer</option>
                  <option value="Documentation Officer">Documentation Officer</option>
                  <option value="Service Manager">Service Manager</option>
                  <option value="Workshop Manager">Workshop Manager</option>
                  <option value="Technician">Technician</option>
                  <option value="Trainee Technician">Trainee Technician</option>
                </select>
                <span className="text-[9px] text-slate-400 italic block mt-1">
                  * Selected tier: {getTierLabel(formRole)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Department</label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Operating Branch/Territory</label>
                  <input
                    type="text"
                    value={formTerritory}
                    onChange={(e) => setFormTerritory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-orange-600 text-white rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT & SET PASSWORD MODAL */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-sm tracking-tight">
                  Modify Account: {selectedUser.name}
                </span>
              </div>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Display Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-orange-500" />
                    <span>Change User Password</span>
                  </label>
                  <span className="text-[9px] text-slate-400 font-semibold italic">Optional</span>
                </div>
                <div className="relative mt-2">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Leave blank to keep existing password"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-orange-500 text-xs rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Only allow changing role if they are NOT editing themselves */}
              {currentUser.id !== selectedUser.id ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Corporate Role Assignment</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none cursor-pointer"
                  >
                    <option value="Biomedical Engineer">Biomedical Engineer</option>
                    <option value="Senior Biomedical Engineer">Senior Biomedical Engineer</option>
                    <option value="Calibration Engineer">Calibration Engineer</option>
                    <option value="Workshop Engineer">Workshop Engineer</option>
                    <option value="Documentation Officer">Documentation Officer</option>
                    <option value="Service Manager">Service Manager</option>
                    <option value="Workshop Manager">Workshop Manager</option>
                    <option value="Technician">Technician</option>
                    <option value="Trainee Technician">Trainee Technician</option>
                  </select>
                  <span className="text-[9px] text-slate-400 italic block mt-1">
                    * Tier rank assigned: {getTierLabel(formRole)}
                  </span>
                </div>
              ) : (
                <div className="space-y-1 p-3.5 bg-slate-50 rounded-xl text-xs">
                  <span className="font-bold text-slate-400 text-[10px] uppercase block tracking-wider">Corporate Role Assignment</span>
                  <p className="text-slate-600 font-semibold mt-1">
                    {selectedUser.role} <span className="text-[9px] text-slate-400 font-normal">({getTierLabel(selectedUser.role)})</span>
                  </p>
                  <p className="text-[9px] text-slate-400 italic mt-1">
                    * For safety, users cannot alter or downgrade their own corporate roles.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Department</label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Operating Branch/Territory</label>
                  <input
                    type="text"
                    value={formTerritory}
                    onChange={(e) => setFormTerritory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-orange-600 text-white rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
