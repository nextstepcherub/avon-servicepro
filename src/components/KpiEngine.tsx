import React, { useState } from 'react';
import { KpiDefinition, UserProfile } from '../types';
import { getRoleLevel, CANONICAL_ROLES } from './OrgManager';
import { 
  Award, 
  Trophy, 
  AlertTriangle, 
  Plus, 
  Users, 
  Scale, 
  SlidersHorizontal,
  Info,
  Sparkles,
  UserPlus,
  Briefcase,
  CheckCircle,
  FolderPlus,
  Check,
  Compass
} from 'lucide-react';

interface KpiEngineProps {
  kpis: KpiDefinition[]; // Master template KPIs
  activeUser: UserProfile;
  onUpdateKpis: (kpis: KpiDefinition[]) => void;
  users?: UserProfile[];
  onUpdateUsers?: (users: UserProfile[]) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
];

export default function KpiEngine({ 
  kpis, 
  activeUser, 
  onUpdateKpis, 
  users = [], 
  onUpdateUsers 
}: KpiEngineProps) {
  const actorLevel = getRoleLevel(activeUser.role);
  const allowedRoles = CANONICAL_ROLES.filter(r => r.level < actorLevel);

  // Local state fallback for users
  const [localUsers, setLocalUsers] = useState<UserProfile[]>(users.length > 0 ? users : []);
  const actualUsers = users.length > 0 ? users : localUsers;

  const updateUsers = (updated: UserProfile[]) => {
    if (onUpdateUsers) {
      onUpdateUsers(updated);
    } else {
      setLocalUsers(updated);
      localStorage.setItem('avon_users', JSON.stringify(updated));
    }
  };

  // State for available roles
  const [availableRoles, setAvailableRoles] = useState<string[]>(() => {
    const rolesFromUsers = actualUsers.map(u => u.role);
    const standard = [
      'Service Manager',
      'Workshop Manager',
      'Documentation Officer',
      'Senior Biomedical Engineer',
      'Biomedical Engineer',
      'Workshop Engineer',
      'Calibration Engineer',
      'Technician'
    ];
    return Array.from(new Set([...standard, ...rolesFromUsers]));
  });

  // State for adding a Person
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonEmail, setNewPersonEmail] = useState('');
  const [newPersonRole, setNewPersonRole] = useState(() => {
    const actorLvl = getRoleLevel(activeUser.role);
    const allowed = CANONICAL_ROLES.filter(r => r.level < actorLvl);
    return allowed[0]?.name || 'Biomedical Engineer';
  });
  const [newPersonTerritory, setNewPersonTerritory] = useState('Colombo Lab');
  const [newPersonAvatar, setNewPersonAvatar] = useState(PRESET_AVATARS[0]);
  const [personSuccessMessage, setPersonSuccessMessage] = useState('');

  React.useEffect(() => {
    if (allowedRoles.length > 0 && !allowedRoles.some(r => r.name === newPersonRole)) {
      setNewPersonRole(allowedRoles[0].name);
    }
  }, [activeUser, allowedRoles, newPersonRole]);

  // State for adding a Role
  const [newRoleName, setNewRoleName] = useState('');
  const [roleSuccessMessage, setRoleSuccessMessage] = useState('');

  // Selected employee ID state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    actualUsers.find(u => u.id === activeUser.id)?.id || actualUsers[0]?.id || ''
  );

  const selectedEmployee = actualUsers.find(u => u.id === selectedEmployeeId) || actualUsers[0];
  const targetLvl = selectedEmployee ? getRoleLevel(selectedEmployee.role) : 1;
  const isKpiManageLocked = targetLvl >= actorLevel;

  // Selected employee's assigned KPIs (safeguarded)
  const employeeKpis = selectedEmployee?.kpis || [];
  
  // Total weight check for selected employee
  const totalWeight = employeeKpis.reduce((acc, k) => acc + k.weight, 0);
  const isBalanced = totalWeight === 100;

  // Weighted score calculation for selected employee
  const weightedScoreSum = employeeKpis.reduce((acc, k) => acc + (k.score * k.weight), 0);
  const overallEmployeeRating = totalWeight > 0 ? Math.round(weightedScoreSum / totalWeight) : 0;

  // Handler to add a new Person
  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim() || !newPersonEmail.trim()) return;

    const actorLvl = getRoleLevel(activeUser.role);
    const assignedRoleLevel = getRoleLevel(newPersonRole);
    if (assignedRoleLevel >= actorLvl) {
      alert(`Access Denied: As a ${activeUser.role} (Level ${actorLvl}), you can only assign roles up to Level ${actorLvl - 1}.`);
      return;
    }

    // Seed initial KPIs based on role type
    let roleType: 'Engineer' | 'Technician' | 'Coordinating Officer' | 'Workshop Engineer' | 'Calibration Engineer' = 'Engineer';
    const lowercaseRole = newPersonRole.toLowerCase();
    if (lowercaseRole.includes('manager') || lowercaseRole.includes('workshop')) {
      roleType = 'Workshop Engineer';
    } else if (lowercaseRole.includes('calibration')) {
      roleType = 'Calibration Engineer';
    } else if (lowercaseRole.includes('engineer') || lowercaseRole.includes('biomedical')) {
      roleType = 'Engineer';
    } else if (lowercaseRole.includes('technician') || lowercaseRole.includes('intern')) {
      roleType = 'Technician';
    } else {
      roleType = 'Coordinating Officer';
    }
    const initialKpisForUser = kpis.filter(k => k.roleType === roleType);

    const newPerson: UserProfile = {
      id: `usr_${Date.now()}`,
      name: newPersonName.trim(),
      email: newPersonEmail.trim(),
      role: newPersonRole,
      territory: newPersonTerritory.trim(),
      avatarUrl: newPersonAvatar,
      tags: [],
      kpis: initialKpisForUser
    };

    const updatedUsers = [newPerson, ...actualUsers];
    updateUsers(updatedUsers);
    setSelectedEmployeeId(newPerson.id); // focus on newly added person

    // Clear and notify
    setNewPersonName('');
    setNewPersonEmail('');
    setPersonSuccessMessage(`Registered ${newPerson.name} successfully!`);
    setTimeout(() => setPersonSuccessMessage(''), 4000);
  };

  // Handler to add a new Role
  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const trimmedRole = newRoleName.trim();
    if (availableRoles.includes(trimmedRole)) {
      alert('This role already exists!');
      return;
    }

    setAvailableRoles([...availableRoles, trimmedRole]);
    setNewPersonRole(trimmedRole); // set default selected role for convenience
    setNewRoleName('');
    setRoleSuccessMessage(`Role "${trimmedRole}" added successfully!`);
    setTimeout(() => setRoleSuccessMessage(''), 4000);
  };

  // Multi-checkbox toggling handler
  const handleToggleKpiCheckbox = (templateKpi: KpiDefinition) => {
    if (!selectedEmployee) return;

    const targetLvl = getRoleLevel(selectedEmployee.role);
    if (targetLvl >= actorLevel) {
      alert(`Access Denied: As a ${activeUser.role} (Level ${actorLevel}), you do not have permission to modify KPIs for a ${selectedEmployee.role} (Level ${targetLvl}).`);
      return;
    }

    const isAssigned = employeeKpis.some(ek => ek.name.toLowerCase() === templateKpi.name.toLowerCase());
    
    let updatedKpis: KpiDefinition[];
    if (isAssigned) {
      // Remove the KPI
      updatedKpis = employeeKpis.filter(ek => ek.name.toLowerCase() !== templateKpi.name.toLowerCase());
    } else {
      // Add the KPI
      const newKpi: KpiDefinition = {
        id: `kpi_assigned_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: templateKpi.name,
        roleType: templateKpi.roleType,
        description: templateKpi.description,
        weight: templateKpi.weight || 20,
        targetValue: templateKpi.targetValue || '100% SLA',
        currentValue: 'Pending',
        score: 100,
        errorsCount: 0
      };
      updatedKpis = [...employeeKpis, newKpi];
    }

    const updatedUsers = actualUsers.map(u => {
      if (u.id === selectedEmployee.id) {
        return { ...u, kpis: updatedKpis };
      }
      return u;
    });
    updateUsers(updatedUsers);
  };

  // Real-time KPI parameter updater (Targets, weights, scores, errors)
  const handleUpdateKpiField = (kpiName: string, field: keyof KpiDefinition, value: any) => {
    if (!selectedEmployee) return;

    const targetLvl = getRoleLevel(selectedEmployee.role);
    if (targetLvl >= actorLevel) {
      alert(`Access Denied: As a ${activeUser.role} (Level ${actorLevel}), you do not have permission to modify KPIs for a ${selectedEmployee.role} (Level ${targetLvl}).`);
      return;
    }

    const updatedKpis = employeeKpis.map(ek => {
      if (ek.name.toLowerCase() === kpiName.toLowerCase()) {
        const updated = { ...ek, [field]: value };

        // Handle automatic SLA penalty overlays if the user changed errorsCount
        if (field === 'errorsCount') {
          const tempErrors = value as number;
          let newScore = ek.score;
          const kName = ek.name.toLowerCase();

          if (kName.includes('quotation') || kName.includes('documentation') || kName.includes('delivery') || kName.includes('installation updates')) {
            newScore = Math.max(0, 100 - (tempErrors * 10));
          } else if (kName.includes('petty cash')) {
            newScore = Math.max(0, 100 - (tempErrors * 20));
          } else if (kName.includes('tool')) {
            newScore = Math.max(0, 100 - (tempErrors * 5));
          } else if (kName.includes('inventory')) {
            newScore = Math.max(0, 100 - (tempErrors * 25));
          }
          updated.score = newScore;
          if (tempErrors > 0 && (kName.includes('error') || kName.includes('item') || kName.includes('incident') || kName.includes('tool') || kName.includes('inventory'))) {
            updated.currentValue = `${tempErrors} Incidents`;
          }
        }
        return updated;
      }
      return ek;
    });

    const updatedUsers = actualUsers.map(u => {
      if (u.id === selectedEmployee.id) {
        return { ...u, kpis: updatedKpis };
      }
      return u;
    });
    updateUsers(updatedUsers);
  };

  // Compile company leaderboard based on weighted scores
  const liveLeaderboard = actualUsers.map(user => {
    const userKpis = user.kpis || [];
    const totalW = userKpis.reduce((sum, k) => sum + k.weight, 0);
    const weightedSum = userKpis.reduce((sum, k) => sum + (k.score * k.weight), 0);
    const overallScore = totalW > 0 ? Math.round(weightedSum / totalW) : 0;
    
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      score: overallScore,
      avatar: user.avatarUrl || PRESET_AVATARS[0],
      isBalanced: totalW === 100,
      totalWeight: totalW
    };
  }).sort((a, b) => b.score - a.score);

  // Group master templates by Category for checklisting
  const kpisByCategory = kpis.reduce((acc, kpi) => {
    const cat = kpi.roleType;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(kpi);
    return acc;
  }, {} as Record<string, KpiDefinition[]>);

  return (
    <div id="kpi_engine_workspace" className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-7 h-7 text-indigo-600" />
            Performance Management Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Register personnel, declare business roles, and map tailored metrics with individual targets and proportional weightings.
          </p>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (4 Cols): Directory, Add Person, Add Role */}
        <div className="lg:col-span-4 space-y-6">

          {/* Quick Action: Register New Corporate Role */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <FolderPlus className="w-4 h-4 text-emerald-600" />
              Add Corporate Role
            </h3>
            
            <form onSubmit={handleAddRole} className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Role Designation Title</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    required
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g. Lead Quality Officer"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
              {roleSuccessMessage && (
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {roleSuccessMessage}
                </p>
              )}
            </form>
          </div>

          {/* Quick Action: Register Staff Member (Add Person) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              Add Person (Register Staff)
            </h3>

            {/* Active User Level Info */}
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
              <p className="font-extrabold text-[10px] text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                <span>Authorized Level {actorLevel}</span>
              </p>
              <p className="text-[10px] text-indigo-700 leading-snug">
                As a {activeUser.role}, you can register staff members with roles below Level {actorLevel} (up to Level {actorLevel - 1}).
              </p>
            </div>

            {allowedRoles.length === 0 && (
              <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl space-y-1">
                <p className="font-extrabold text-[10px] text-rose-900 uppercase tracking-wider">
                  Registration Locked
                </p>
                <p className="text-[10px] text-rose-700 leading-snug">
                  Trainees (Level 1) have no administrative permissions to add other staff members.
                </p>
              </div>
            )}

            <form onSubmit={handleAddPerson} className={`space-y-3.5 ${allowedRoles.length === 0 ? 'opacity-55 pointer-events-none' : ''}`}>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  disabled={allowedRoles.length === 0}
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  placeholder="e.g. Priyantha Jayasuriya"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Corporate Email</label>
                <input
                  type="email"
                  required
                  disabled={allowedRoles.length === 0}
                  value={newPersonEmail}
                  onChange={(e) => setNewPersonEmail(e.target.value)}
                  placeholder="e.g. p.jayasuriya@avon.lk"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500 disabled:cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Assigned Role</label>
                  <select
                    value={newPersonRole}
                    disabled={allowedRoles.length === 0}
                    onChange={(e) => setNewPersonRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-indigo-500 disabled:cursor-not-allowed"
                  >
                    {allowedRoles.map(r => (
                      <option key={r.name} value={r.name}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Region / Lab</label>
                  <input
                    type="text"
                    required
                    value={newPersonTerritory}
                    onChange={(e) => setNewPersonTerritory(e.target.value)}
                    placeholder="e.g. Colombo Central"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500"
                  />
                </div>
              </div>

              {/* Avatar Preset Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Profile Avatar Preset</label>
                <div className="flex items-center gap-2 pt-0.5">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewPersonAvatar(url)}
                      className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        newPersonAvatar === url ? 'border-indigo-600 scale-110 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                      {newPersonAvatar === url && (
                        <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
              >
                Register & Initialize Staff Member
              </button>

              {personSuccessMessage && (
                <p className="text-[11px] font-bold text-indigo-650 flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-600" /> {personSuccessMessage}
                </p>
              )}
            </form>
          </div>

          {/* Directory Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Staff Directory ({actualUsers.length})
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Click to Select</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {actualUsers.map(user => {
                const userKpis = user.kpis || [];
                const totalW = userKpis.reduce((sum, k) => sum + k.weight, 0);
                const weightedSum = userKpis.reduce((sum, k) => sum + (k.score * k.weight), 0);
                const overallScore = totalW > 0 ? Math.round(weightedSum / totalW) : 0;
                const isSelected = user.id === selectedEmployeeId;
                const isUserBalanced = totalW === 100;

                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      setSelectedEmployeeId(user.id);
                    }}
                    className={`w-full text-left flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatarUrl || PRESET_AVATARS[0]}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <h4 className={`font-black text-xs truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {user.name}
                        </h4>
                        <span className={`text-[10px] block truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        {overallScore}%
                      </span>
                      <span className={`text-[8px] font-bold mt-1 ${
                        isUserBalanced 
                          ? (isSelected ? 'text-emerald-300' : 'text-emerald-600') 
                          : (isSelected ? 'text-amber-300' : 'text-amber-600')
                      }`}>
                        {isUserBalanced ? '✓ Balanced' : `⚠ ${totalW}%`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Performance Leaderboard
            </h3>

            <div className="space-y-2">
              {liveLeaderboard.slice(0, 4).map((leader, idx) => (
                <div 
                  key={leader.id} 
                  className={`flex items-center justify-between p-2.5 rounded-xl border border-slate-100 ${
                    leader.id === selectedEmployeeId ? 'bg-indigo-50/40 border-indigo-100' : 'bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-black text-slate-400 w-4 text-center text-xs">#{idx + 1}</span>
                    <img src={leader.avatar} alt={leader.name} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 truncate">{leader.name}</h4>
                      <span className="text-[9px] text-slate-400 block truncate">{leader.role}</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-[11px] text-slate-800 bg-white border px-2 py-0.5 rounded-md shrink-0">
                    {leader.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (8 Cols): Select Person Name, Checkbox list for KPI Manage, target value, weights */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
            
            {/* Title & Core Selection */}
            <div className="border-b pb-5 border-slate-100 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                    Manage Employee KPIs & Target Metrics
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select any staff member, individually toggle checkboxes to assign template metrics, and adjust weights or target values on the fly.
                  </p>
                </div>
              </div>

              {/* REQUIREMENT: Select Person Name */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Select Person Name
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => {
                    setSelectedEmployeeId(e.target.value);
                  }}
                  className="w-full bg-white border border-slate-200 text-slate-850 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
                >
                  {actualUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedEmployee ? (
              <div className="space-y-6">
                
                {/* Selected Employee Info summary */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <img
                    src={selectedEmployee.avatarUrl || PRESET_AVATARS[0]}
                    alt={selectedEmployee.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 shadow-sm shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-black text-slate-900 leading-tight">{selectedEmployee.name}</h3>
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                        {selectedEmployee.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedEmployee.email} • Territory: <span className="font-bold text-slate-600">{selectedEmployee.territory || 'Colombo Headquarters'}</span>
                    </p>
                  </div>
                  <div className="text-right bg-white border px-3.5 py-2 rounded-xl shrink-0">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block font-mono">Overall Score</span>
                    <span className="text-xl font-black text-indigo-600 font-mono leading-none mt-0.5">{overallEmployeeRating}%</span>
                  </div>
                </div>

                {isKpiManageLocked && (
                  <div className="p-4 bg-rose-50 border border-rose-150 rounded-xl flex gap-3 items-start animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-rose-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-extrabold text-[12px] text-rose-900">
                        KPI Modification Restricted
                      </p>
                      <p className="text-[11px] leading-relaxed text-rose-700">
                        This employee is a <b className="font-bold text-rose-950">{selectedEmployee.role}</b> (Level {targetLvl}). Because you are authenticated as a <b className="font-bold text-rose-950">{activeUser.role}</b> (Level {actorLevel}), you do not have administrative clearance to assign template metrics, adjust weights, or change scores for this level.
                      </p>
                    </div>
                  </div>
                )}

                {/* Individual Weight Allocation Audit */}
                <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isBalanced 
                    ? 'bg-emerald-50 border-emerald-100' 
                    : 'bg-amber-50 border-amber-100'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Scale className={`w-5 h-5 ${isBalanced ? 'text-emerald-600' : 'text-amber-600'}`} />
                      <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                        Cumulative Weight Allocation Audit
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-md">
                      Each employee's cumulative metric weights must sum to exactly <b className="font-bold text-slate-800">100%</b> to enable proportional scoring.
                    </p>
                  </div>

                  <div className="text-left md:text-right min-w-[160px] space-y-1.5 shrink-0">
                    <div className="flex justify-between text-xs font-bold text-slate-700 font-mono">
                      <span>Assigned Weight:</span>
                      <span className={isBalanced ? 'text-emerald-700' : 'text-amber-700'}>{totalWeight}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isBalanced ? 'bg-emerald-500' : totalWeight > 100 ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, totalWeight)}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold block ${isBalanced ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {isBalanced ? '✓ Proportions Balanced' : `⚠ Adjust weights (${totalWeight < 100 ? `+${100-totalWeight}% needed` : `-${totalWeight-100}% excessive`})`}
                    </span>
                  </div>
                </div>

                {/* REQUIREMENT: Individually Select Each KPI from check boxes */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                      <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                      Assign & Configure Metrics Checksheet
                    </h3>
                    <span className="text-[10px] font-bold text-indigo-650 uppercase bg-indigo-50 px-2 py-1 rounded">
                      Active Metrics: {employeeKpis.length}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(kpisByCategory).map(([category, items]) => (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2 bg-slate-100/65 px-3 py-1.5 rounded-lg border border-slate-150">
                          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                          <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider">
                            {category} Standard Templates
                          </h4>
                        </div>

                        <div className="space-y-3">
                          {items.map(templateKpi => {
                            // Determine if this KPI is assigned to the selected person
                            const assignedInstance = employeeKpis.find(ek => ek.name.toLowerCase() === templateKpi.name.toLowerCase());
                            const isSelected = !!assignedInstance;

                            return (
                              <div 
                                key={templateKpi.id} 
                                className={`p-4 rounded-xl border transition-all ${
                                  isSelected 
                                    ? 'bg-indigo-50/20 border-indigo-200 shadow-2xs' 
                                    : 'bg-white hover:bg-slate-50/50 border-slate-200'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {/* Checkbox */}
                                  <div className="flex items-center h-5 pt-0.5">
                                    <input
                                      id={`chk_${templateKpi.id}`}
                                      type="checkbox"
                                      checked={isSelected}
                                      disabled={isKpiManageLocked}
                                      onChange={() => handleToggleKpiCheckbox(templateKpi)}
                                      className="w-4.5 h-4.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600 disabled:opacity-45 disabled:cursor-not-allowed"
                                    />
                                  </div>

                                  {/* Metric Label & Description */}
                                  <div className="flex-1">
                                    <label 
                                      htmlFor={`chk_${templateKpi.id}`}
                                      className="text-xs font-extrabold text-slate-800 cursor-pointer block select-none"
                                    >
                                      {templateKpi.name}
                                    </label>
                                    <span className="text-[11px] text-slate-500 mt-1 block leading-normal select-none">
                                      {templateKpi.description}
                                    </span>
                                  </div>
                                </div>

                                {/* If checked, display inline inputs for Target Value, Weightage, and current status */}
                                {isSelected && assignedInstance && (
                                  <div className="mt-4 ml-7 p-4 bg-white rounded-xl border border-slate-150 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200 text-xs">
                                    
                                    {/* Target Value Input */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-black uppercase text-slate-500 block">
                                        Target Value Threshold
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        disabled={isKpiManageLocked}
                                        value={assignedInstance.targetValue}
                                        onChange={(e) => handleUpdateKpiField(templateKpi.name, 'targetValue', e.target.value)}
                                        placeholder="e.g. 100% Success"
                                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                      />
                                    </div>

                                    {/* Weightage Input */}
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-black uppercase text-slate-500 block flex justify-between">
                                        <span>Weightage (%)</span>
                                        {assignedInstance.weight === 0 ? (
                                          <span className="font-mono text-rose-500 font-bold">Not Measured (0%)</span>
                                        ) : (
                                          <span className="font-mono text-indigo-600 font-bold">{assignedInstance.weight}%</span>
                                        )}
                                      </label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="range"
                                          min="0"
                                          max="100"
                                          disabled={isKpiManageLocked}
                                          value={assignedInstance.weight}
                                          onChange={(e) => handleUpdateKpiField(templateKpi.name, 'weight', parseInt(e.target.value) || 0)}
                                          className="flex-1 accent-indigo-600 h-1 bg-slate-200 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                                        />
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          disabled={isKpiManageLocked}
                                          value={assignedInstance.weight}
                                          onChange={(e) => handleUpdateKpiField(templateKpi.name, 'weight', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                          className="w-12 text-center bg-slate-50 border border-slate-200 py-1 rounded text-xs font-bold font-mono text-slate-800 disabled:cursor-not-allowed"
                                        />
                                      </div>
                                    </div>

                                    {/* Divider for evaluation parameters */}
                                    <div className="md:col-span-2 border-t pt-3 mt-1 border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                      
                                      {/* Current Actual Status */}
                                      <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 block">
                                          Actual Status Value
                                        </label>
                                        <input
                                          type="text"
                                          disabled={isKpiManageLocked}
                                          value={assignedInstance.currentValue}
                                          onChange={(e) => handleUpdateKpiField(templateKpi.name, 'currentValue', e.target.value)}
                                          placeholder="e.g. 98.4% Completed"
                                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                        />
                                      </div>

                                      {/* Current Score */}
                                      <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 block flex justify-between">
                                          <span>Performance Score (0-100)</span>
                                          <span className="font-mono text-indigo-600 font-bold">{assignedInstance.score}/100</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            disabled={isKpiManageLocked}
                                            value={assignedInstance.score}
                                            onChange={(e) => handleUpdateKpiField(templateKpi.name, 'score', parseInt(e.target.value) || 0)}
                                            className="flex-1 accent-indigo-600 h-1 bg-slate-200 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                                          />
                                          <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            disabled={isKpiManageLocked}
                                            value={assignedInstance.score}
                                            onChange={(e) => handleUpdateKpiField(templateKpi.name, 'score', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                            className="w-12 text-center bg-slate-50 border border-slate-200 py-1 rounded text-xs font-bold font-mono text-slate-800 disabled:cursor-not-allowed"
                                          />
                                        </div>
                                      </div>

                                    </div>

                                    {/* Automatic SLA Penalties triggers */}
                                    {(templateKpi.name.toLowerCase().includes('quotation') ||
                                      templateKpi.name.toLowerCase().includes('documentation') ||
                                      templateKpi.name.toLowerCase().includes('delivery') ||
                                      templateKpi.name.toLowerCase().includes('tool') ||
                                      templateKpi.name.toLowerCase().includes('inventory') ||
                                      templateKpi.name.toLowerCase().includes('petty cash')) && (
                                      <div className="md:col-span-2 bg-amber-50/50 border border-amber-100 p-3 rounded-lg flex items-center justify-between gap-4 mt-1">
                                        <div className="flex items-center gap-2">
                                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                                          <span className="text-[11px] font-semibold text-amber-800">
                                            SLA Quality Incidents (Deductive Penalties apply to score)
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-bold text-slate-500">Errors Count:</span>
                                          <input
                                            type="number"
                                            min="0"
                                            disabled={isKpiManageLocked}
                                            value={assignedInstance.errorsCount || 0}
                                            onChange={(e) => handleUpdateKpiField(templateKpi.name, 'errorsCount', Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-14 text-center bg-white border border-amber-200 py-1 rounded text-xs font-bold font-mono text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                          />
                                        </div>
                                      </div>
                                    )}

                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-slate-50 p-12 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
                <Compass className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                <p className="font-extrabold text-sm text-slate-600">No Person Selected</p>
                <p className="text-xs text-slate-400 mt-1">
                  Select a staff member from the dropdown or sidebar directory to inspect and assign their target metrics.
                </p>
              </div>
            )}

          </div>

          {/* Departmental Operational Penalty Protocols Guide */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md space-y-3.5 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 text-white/5 pointer-events-none">
              <Award className="w-40 h-40" />
            </div>
            
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
              Departmental Quality Audit Protocols
            </h4>
            <p className="text-xs text-indigo-100 leading-relaxed max-w-2xl">
              Quality engines automatically apply incident deductions to raw performance scores when errors are logged:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-mono font-bold text-slate-300">
              <div className="bg-white/5 p-3 rounded-lg space-y-1">
                <span className="text-amber-300 block font-sans">Coordinating & Admin errors</span>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Quotation prep mistakes: <b className="text-rose-400">-10 pts</b></li>
                  <li>Doc update oversight: <b className="text-rose-400">-10 pts</b></li>
                  <li>Petty Cash audit leaks: <b className="text-rose-400">-20 pts</b></li>
                </ul>
              </div>

              <div className="bg-white/5 p-3 rounded-lg space-y-1">
                <span className="text-indigo-300 block font-sans">Engineering & Technician defects</span>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Missing toolkit elements: <b className="text-rose-400">-5 pts / item</b></li>
                  <li>Workshop inventory oversight: <b className="text-rose-400">-25 pts / case</b></li>
                  <li>Calibration pre-inspection fails: <b className="text-rose-400">-10 pts</b></li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
