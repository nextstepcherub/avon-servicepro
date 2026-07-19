import React, { useState } from 'react';
import { UserProfile, KpiDefinition, EngineerTag } from '../types';
import { 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  UserCheck, 
  Sliders, 
  Briefcase, 
  ShieldAlert, 
  Compass, 
  Layers,
  Sparkles,
  Info,
  Lock,
  Shield
} from 'lucide-react';

interface OrgManagerProps {
  users: UserProfile[];
  onUpdateUsers: (users: UserProfile[]) => void;
  kpis: KpiDefinition[];
  onUpdateKpis: (kpis: KpiDefinition[]) => void;
  activeUser?: UserProfile;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
];

export const getRoleLevel = (role: string): number => {
  const r = role.toLowerCase();
  if (r.includes('system admin')) return 5;
  if (r === 'admin') return 4;
  if (r.includes('manager')) return 3;
  if (r.includes('trainee') || r.includes('intern')) return 1;
  if (r.includes('engineer') || r.includes('technician') || r.includes('officer') || r.includes('doc')) return 2;
  return 2; // Default to Level 2
};

export const getRoleLevelName = (level: number): string => {
  switch (level) {
    case 5: return 'System Admin';
    case 4: return 'Admin';
    case 3: return 'Manager';
    case 2: return 'Technician | Documentation Officer | Engineers';
    case 1: return 'Trainee';
    default: return 'Technician | Documentation Officer | Engineers';
  }
};

export const CANONICAL_ROLES = [
  { name: 'System Admin', level: 5, label: 'System Admin (Level 5)' },
  { name: 'Admin', level: 4, label: 'Admin (Level 4)' },
  { name: 'Service Manager', level: 3, label: 'Service Manager (Level 3 - Manager)' },
  { name: 'Workshop Manager', level: 3, label: 'Workshop Manager (Level 3 - Manager)' },
  { name: 'Biomedical Engineer', level: 2, label: 'Biomedical Engineer (Level 2 - Engineers)' },
  { name: 'Workshop Engineer', level: 2, label: 'Workshop Engineer (Level 2 - Engineers)' },
  { name: 'Calibration Engineer', level: 2, label: 'Calibration Engineer (Level 2 - Engineers)' },
  { name: 'Technician', level: 2, label: 'Technician (Level 2 - Technician)' },
  { name: 'Documentation Officer', level: 2, label: 'Documentation Officer (Level 2 - Documentation Officer)' },
  { name: 'Trainee Technician', level: 1, label: 'Trainee Technician (Level 1 - Trainee)' }
];

export default function OrgManager({ 
  users, 
  onUpdateUsers, 
  kpis, 
  onUpdateKpis,
  activeUser
}: OrgManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<'personnel' | 'templates'>('personnel');
  
  // Personnel state
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Form states for user
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('Biomedical Engineer');
  const [userTerritory, setUserTerritory] = useState('Colombo Lab');
  const [userAvatar, setUserAvatar] = useState(PRESET_AVATARS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [userKpis, setUserKpis] = useState<KpiDefinition[]>([]);

  const actorLevel = activeUser ? getRoleLevel(activeUser.role) : 5;
  const selectableRoles = CANONICAL_ROLES.filter(r => r.level < actorLevel);

  React.useEffect(() => {
    if (selectableRoles.length > 0 && !selectableRoles.some(r => r.name === userRole)) {
      setUserRole(selectableRoles[0].name);
    }
  }, [activeUser, userRole]);

  // Initialize default KPIs in Add Mode
  React.useEffect(() => {
    if (!editingUserId && userKpis.length === 0) {
      const initialKpisForUser = kpis.filter(k => k.roleType === 'Engineer');
      setUserKpis(initialKpisForUser);
    }
  }, [editingUserId, kpis]);

  // Template states
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [tplName, setTplName] = useState('');
  const [tplDesc, setTplDesc] = useState('');
  const [tplRoleType, setTplRoleType] = useState<'Engineer' | 'Technician' | 'Coordinating Officer' | 'Workshop Engineer' | 'Calibration Engineer'>('Engineer');
  const [tplWeight, setTplWeight] = useState(25);
  const [tplTarget, setTplTarget] = useState('100% Success');

  // Tag helper toggles
  const handleToggleTag = (tag: string) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(nextTags);

    const getRoleTypeForTag = (t: string): string => {
      if (t === 'Area Engineer') return 'Engineer';
      if (t === 'Workshop Engineer' || t === 'Workshop Manager' || t === 'Service Manager') return 'Workshop Engineer';
      if (t === 'Calibration Engineer') return 'Calibration Engineer';
      if (t === 'Documentation') return 'Coordinating Officer';
      if (t === 'Technician' || t === 'Trainee' || t === 'Intern Trainee') return 'Technician';
      return '';
    };

    // Determine which role types are relevant based on the updated tags
    const activeRoleTypes = new Set<string>();
    nextTags.forEach(t => {
      const rt = getRoleTypeForTag(t);
      if (rt) activeRoleTypes.add(rt);
    });

    // Fallback: if no tags are selected, use the base role type of the user's role
    if (activeRoleTypes.size === 0) {
      const lowercaseRole = userRole.toLowerCase();
      let baseRoleType = 'Engineer';
      if (lowercaseRole.includes('manager') || lowercaseRole.includes('workshop')) {
        baseRoleType = 'Workshop Engineer';
      } else if (lowercaseRole.includes('calibration')) {
        baseRoleType = 'Calibration Engineer';
      } else if (lowercaseRole.includes('engineer') || lowercaseRole.includes('biomedical')) {
        baseRoleType = 'Engineer';
      } else if (lowercaseRole.includes('technician') || lowercaseRole.includes('intern')) {
        baseRoleType = 'Technician';
      } else {
        baseRoleType = 'Coordinating Officer';
      }
      activeRoleTypes.add(baseRoleType);
    }

    setUserKpis(prev => {
      // Set non-relevant KPIs' weights to 0, and then filter them out (remove them)
      const mapped = prev.map(k => {
        if (!activeRoleTypes.has(k.roleType)) {
          return { ...k, weight: 0 };
        }
        return k;
      });

      const filtered = mapped.filter(k => activeRoleTypes.has(k.roleType));

      // Add missing KPIs for the active role types
      const existingNames = new Set(filtered.map(pk => pk.name.toLowerCase()));
      const newKpisToAdd: KpiDefinition[] = [];

      activeRoleTypes.forEach(rt => {
        const templates = kpis.filter(k => k.roleType === rt);
        templates.forEach(tk => {
          if (!existingNames.has(tk.name.toLowerCase())) {
            newKpisToAdd.push({
              ...tk,
              id: `kpi_assigned_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
            });
          }
        });
      });

      return [...filtered, ...newKpisToAdd];
    });
  };

  // Submit User
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    const actorLevel = activeUser ? getRoleLevel(activeUser.role) : 5;
    const newRoleLevel = getRoleLevel(userRole);

    if (newRoleLevel >= actorLevel) {
      alert(`Access Denied: As a ${activeUser?.role || 'Trainee'} (Level {actorLevel}), you can only assign roles up to Level ${actorLevel - 1}.`);
      return;
    }

    if (editingUserId) {
      // Edit Mode
      const targetUser = users.find(u => u.id === editingUserId);
      if (targetUser) {
        const targetUserLevel = getRoleLevel(targetUser.role);
        if (targetUserLevel >= actorLevel) {
          alert(`Access Denied: You cannot modify a member of equal or higher hierarchy level (${targetUser.role} - Level ${targetUserLevel}).`);
          return;
        }
      }

      const updated = users.map(u => u.id === editingUserId ? {
        ...u,
        name: userName.trim(),
        email: userEmail.trim(),
        role: userRole,
        territory: userTerritory.trim(),
        avatarUrl: userAvatar,
        tags: selectedTags as EngineerTag[],
        kpis: userKpis
      } : u);
      onUpdateUsers(updated);
      setEditingUserId(null);
    } else {
      // Add Mode
      let finalKpis = userKpis;
      if (finalKpis.length === 0) {
        let roleType: 'Engineer' | 'Technician' | 'Coordinating Officer' | 'Workshop Engineer' | 'Calibration Engineer' = 'Engineer';
        const lowercaseRole = userRole.toLowerCase();
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
        finalKpis = kpis.filter(k => k.roleType === roleType);
      }

      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: userName.trim(),
        email: userEmail.trim(),
        role: userRole,
        territory: userTerritory.trim(),
        avatarUrl: userAvatar,
        tags: selectedTags as EngineerTag[],
        kpis: finalKpis
      };
      onUpdateUsers([newUser, ...users]);
    }

    // Reset Form
    setUserName('');
    setUserEmail('');
    setUserRole('Biomedical Engineer');
    setUserTerritory('Colombo Lab');
    setUserAvatar(PRESET_AVATARS[0]);
    setSelectedTags([]);
    setUserKpis([]);
  };

  // Edit action triggers
  const handleTriggerEditUser = (user: UserProfile) => {
    const actorLevel = activeUser ? getRoleLevel(activeUser.role) : 5;
    const targetUserLevel = getRoleLevel(user.role);
    if (targetUserLevel >= actorLevel) {
      alert(`Access Denied: Your level (${actorLevel}) must be strictly higher than this member's level (${targetUserLevel}) to make modifications.`);
      return;
    }
    setEditingUserId(user.id);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setUserTerritory(user.territory || '');
    setUserAvatar(user.avatarUrl || PRESET_AVATARS[0]);
    setSelectedTags(user.tags || []);
    setUserKpis(user.kpis || []);
  };

  // Delete action triggers
  const handleDeleteUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    const actorLevel = activeUser ? getRoleLevel(activeUser.role) : 5;
    const targetUserLevel = getRoleLevel(targetUser.role);
    if (targetUserLevel >= actorLevel) {
      alert(`Access Denied: Your level (${actorLevel}) must be strictly higher than this member's level (${targetUserLevel}) to remove them.`);
      return;
    }
    if (confirm('Are you sure you want to remove this staff profile? This cannot be undone.')) {
      onUpdateUsers(users.filter(u => u.id !== userId));
    }
  };

  // Global KPI Templates Handler
  const handleSaveKpiTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplName.trim() || !tplDesc.trim()) return;

    if (editingTemplateId) {
      const updated = kpis.map(k => k.id === editingTemplateId ? {
        ...k,
        name: tplName.trim(),
        description: tplDesc.trim(),
        roleType: tplRoleType,
        weight: tplWeight,
        targetValue: tplTarget.trim()
      } : k);
      onUpdateKpis(updated);
      setEditingTemplateId(null);
    } else {
      const newTpl: KpiDefinition = {
        id: `kpi_tpl_${Date.now()}`,
        name: tplName.trim(),
        roleType: tplRoleType,
        description: tplDesc.trim(),
        weight: tplWeight,
        targetValue: tplTarget.trim(),
        currentValue: 'Pending',
        score: 100,
        errorsCount: 0
      };
      onUpdateKpis([...kpis, newTpl]);
    }

    // Reset Form
    setTplName('');
    setTplDesc('');
    setTplRoleType('Engineer');
    setTplWeight(25);
    setTplTarget('100% Success');
  };

  // Edit KPI Template triggers
  const handleTriggerEditTemplate = (tpl: KpiDefinition) => {
    setEditingTemplateId(tpl.id);
    setTplName(tpl.name);
    setTplDesc(tpl.description);
    setTplRoleType(tpl.roleType);
    setTplWeight(tpl.weight);
    setTplTarget(tpl.targetValue);
  };

  // Delete KPI Template triggers
  const handleDeleteTemplate = (tplId: string) => {
    if (confirm('Are you sure you want to delete this global KPI template?')) {
      onUpdateKpis(kpis.filter(k => k.id !== tplId));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.territory && u.territory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div id="org_manager_workspace" className="space-y-6">
      
      {/* Tab Selector */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('personnel')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
            activeSubTab === 'personnel' 
              ? 'border-indigo-600 text-indigo-700 font-extrabold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Corporate Personnel Roster
        </button>
        <button
          onClick={() => setActiveSubTab('templates')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
            activeSubTab === 'templates' 
              ? 'border-indigo-600 text-indigo-700 font-extrabold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Master KPI Template Library
        </button>
      </div>

      {activeSubTab === 'personnel' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form left/top: Add/Edit Personnel */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b pb-3">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {editingUserId ? 'Modify Personnel Profile' : 'Register Corporate Staff member'}
                </h3>
              </div>

              {/* Active User Level indicator */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex gap-2.5 items-start">
                <Shield className="w-4 h-4 shrink-0 text-indigo-600 mt-0.5 animate-pulse" />
                <div className="space-y-0.5">
                  <p className="font-extrabold text-[11px] text-indigo-900">
                    Hierarchy Authorized: {activeUser?.name || 'System Admin'}
                  </p>
                  <p className="text-[10px] leading-relaxed text-indigo-750">
                    Role: <b className="text-indigo-850 font-bold">{activeUser?.role || 'System Admin'}</b> (Level {actorLevel}).
                    You can manage profiles and assign roles strictly below yours (<b>up to Level {actorLevel - 1}</b>).
                  </p>
                </div>
              </div>

              {selectableRoles.length === 0 && (
                <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl flex gap-2.5 items-start">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-[11px] text-rose-900">
                      Hierarchy Restricted
                    </p>
                    <p className="text-[10px] leading-relaxed text-rose-700">
                      As a {activeUser?.role || 'Trainee'} (Level 1), you do not have administrative privileges to add, edit, or delete staff members.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveUser} className={`space-y-4 text-xs ${selectableRoles.length === 0 ? 'opacity-55 pointer-events-none' : ''}`}>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Full Name</label>
                  <input
                    type="text"
                    required
                    disabled={selectableRoles.length === 0}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Dinesh Rodrigo"
                    className="w-full bg-slate-50 border p-2 rounded-lg font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Corporate Email</label>
                  <input
                    type="email"
                    required
                    disabled={selectableRoles.length === 0}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. dinesh.r@avon.lk"
                    className="w-full bg-slate-50 border p-2 rounded-lg font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Primary Role</label>
                    <select
                      value={userRole}
                      disabled={selectableRoles.length === 0}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setUserRole(newRole);
                        if (!editingUserId) {
                          let roleType: 'Engineer' | 'Technician' | 'Coordinating Officer' | 'Workshop Engineer' | 'Calibration Engineer' = 'Engineer';
                          const lowercaseRole = newRole.toLowerCase();
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
                          setUserKpis(initialKpisForUser);
                        }
                      }}
                      className="w-full bg-slate-50 border p-2 rounded-lg font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500 disabled:cursor-not-allowed"
                    >
                      {selectableRoles.map((r) => (
                        <option key={r.name} value={r.name}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Regional Territory</label>
                    <input
                      type="text"
                      required
                      disabled={selectableRoles.length === 0}
                      value={userTerritory}
                      onChange={(e) => setUserTerritory(e.target.value)}
                      placeholder="e.g. Galle & Southern"
                      className="w-full bg-slate-50 border p-2 rounded-lg font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Avatar selection preview */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-600 block">Profile Picture Preset</label>
                  <div className="flex gap-2">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setUserAvatar(url)}
                        className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          userAvatar === url ? 'border-indigo-600 scale-105' : 'border-slate-200'
                        }`}
                      >
                        <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags multi-selector */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-600 block">Operations Skill Tags</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Area Engineer', 
                      'Workshop Engineer', 
                      'Calibration Engineer',
                      'Service Manager',
                      'Workshop Manager',
                      'Documentation',
                      'Technician',
                      'Trainee',
                      'Intern Trainee'
                    ].map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-slate-900 border-slate-900 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned KPIs & Weightages Configurator */}
                <div className="space-y-3 border-t pt-4 border-slate-100 bg-slate-50/50 p-3 rounded-xl border border-slate-150">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-indigo-600" />
                      Modify KPI Weightages
                    </label>
                    <span className="text-[10px] font-mono font-bold bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 rounded">
                      Total: {userKpis.reduce((sum, k) => sum + k.weight, 0)}%
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Set weight to <b className="text-slate-700 font-bold">0%</b> if the KPI is not measured for the member. Adding Skill Tags automatically appends relevant KPIs to this list.
                  </p>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {userKpis.length === 0 ? (
                      <p className="text-center py-4 text-slate-400 italic text-[10px]">No KPIs assigned. Add skill tags to map standard metrics.</p>
                    ) : (
                      userKpis.map((kpi, idx) => (
                        <div key={kpi.id || idx} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5 shadow-2xs">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <span className="font-bold text-slate-800 text-[11px] leading-snug block truncate" title={kpi.name}>
                                {kpi.name}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono block truncate">
                                {kpi.roleType} Template
                              </span>
                            </div>
                            <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0 border ${
                              kpi.weight === 0 
                                ? 'bg-rose-50 text-rose-600 border-rose-150' 
                                : 'bg-emerald-50 text-emerald-700 border-emerald-150'
                            }`}>
                              {kpi.weight === 0 ? 'Not Measured' : `Weight: ${kpi.weight}%`}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={kpi.weight}
                              onChange={(e) => {
                                const newWeight = parseInt(e.target.value) || 0;
                                setUserKpis(prev => prev.map((k, i) => i === idx ? { ...k, weight: newWeight } : k));
                              }}
                              className="flex-1 accent-indigo-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                            />
                            <div className="flex items-center gap-1 shrink-0">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={kpi.weight}
                                onChange={(e) => {
                                  const newWeight = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                  setUserKpis(prev => prev.map((k, i) => i === idx ? { ...k, weight: newWeight } : k));
                                }}
                                className="w-10 text-center bg-slate-50 border py-0.5 rounded text-[10px] font-bold font-mono text-slate-800"
                              />
                              <span className="text-[9px] text-slate-400 font-bold font-mono">%</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
                  >
                    {editingUserId ? 'Apply Updates' : 'Add New Staff Profile'}
                  </button>
                  {editingUserId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUserId(null);
                        setUserName('');
                        setUserEmail('');
                        setUserRole('Biomedical Engineer');
                        setUserTerritory('Colombo Lab');
                        setUserAvatar(PRESET_AVATARS[0]);
                        setSelectedTags([]);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Directory right: Staff search and roster table */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                <h3 className="font-extrabold text-slate-800 text-sm">Personnel Registry Directory</h3>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by name, role or region..."
                  className="bg-slate-50 border px-3 py-1.5 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-indigo-500 max-w-xs"
                />
              </div>

              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredUsers.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 italic text-xs">No records found matching search filters.</p>
                ) : (
                  filteredUsers.map(user => {
                    const targetUserLevel = getRoleLevel(user.role);
                    const canManage = targetUserLevel < actorLevel;
                    return (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={user.avatarUrl || PRESET_AVATARS[0]} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-extrabold text-xs text-slate-850 truncate">{user.name}</h4>
                              <span className="text-[9px] font-bold bg-white border border-slate-150 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                                {user.role}
                              </span>
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border font-mono ${
                                targetUserLevel === 5 ? 'bg-red-50 text-red-700 border-red-200' :
                                targetUserLevel === 4 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                targetUserLevel === 3 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                targetUserLevel === 2 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                Level {targetUserLevel}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                              {user.email} • Region: {user.territory || 'Colombo Headquarters'}
                            </p>
                            {user.tags && user.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {user.tags.map(t => (
                                  <span key={t} className="bg-indigo-50 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-indigo-100">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 pl-3">
                          {canManage ? (
                            <>
                              <button
                                onClick={() => handleTriggerEditUser(user)}
                                title="Edit Profile"
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-150 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                title="Remove Profile"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-slate-150 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-1 text-[9px] font-extrabold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200" title="Profile locked: Target level is equal or higher than your hierarchy level.">
                              <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span>Locked</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: Add/Edit Global Templates */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b pb-3">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {editingTemplateId ? 'Edit Master Template KPI' : 'Declare New Master KPI Template'}
                </h3>
              </div>

              <form onSubmit={handleSaveKpiTemplate} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Metric Target Label</label>
                  <input
                    type="text"
                    required
                    value={tplName}
                    onChange={(e) => setTplName(e.target.value)}
                    placeholder="e.g. Critical Parts Delivery SLA"
                    className="w-full bg-slate-50 border p-2 rounded-lg font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Target Benchmark Value</label>
                  <input
                    type="text"
                    required
                    value={tplTarget}
                    onChange={(e) => setTplTarget(e.target.value)}
                    placeholder="e.g. 100% within 48 Hours"
                    className="w-full bg-slate-50 border p-2 rounded-lg font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Target Role Segment</label>
                    <select
                      value={tplRoleType}
                      onChange={(e) => setTplRoleType(e.target.value as any)}
                      className="w-full bg-slate-50 border p-2 rounded-lg font-bold text-slate-800 focus:bg-white focus:outline-indigo-500 text-xs"
                    >
                      <option value="Engineer">Engineer</option>
                      <option value="Technician">Technician</option>
                      <option value="Coordinating Officer">Coordinating Officer</option>
                      <option value="Workshop Engineer">Workshop Engineer</option>
                      <option value="Calibration Engineer">Calibration Engineer</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Standard Baseline Weight (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={tplWeight}
                      onChange={(e) => setTplWeight(parseInt(e.target.value) || 20)}
                      className="w-full bg-slate-50 border p-2 rounded-lg font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 font-sans">Strategic Description</label>
                  <textarea
                    required
                    value={tplDesc}
                    onChange={(e) => setTplDesc(e.target.value)}
                    placeholder="Detail the metrics, penalties, and audit processes for this KPI..."
                    rows={3}
                    className="w-full bg-slate-50 border p-2 rounded-lg font-semibold text-slate-800 focus:bg-white focus:outline-indigo-500"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
                  >
                    {editingTemplateId ? 'Apply Template Changes' : 'Register Template KPI'}
                  </button>
                  {editingTemplateId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTemplateId(null);
                        setTplName('');
                        setTplDesc('');
                        setTplRoleType('Engineer');
                        setTplWeight(25);
                        setTplTarget('100% Success');
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right List: Global KPI Templates Repository */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-extrabold text-slate-800 text-sm">Global Master Templates Library ({kpis.length})</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">These define standard baseline configurations that can be quick-checked for individual employees.</p>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {kpis.map(tpl => (
                  <div 
                    key={tpl.id} 
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 space-y-2"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-xs text-slate-800">{tpl.name}</h4>
                          <span className="text-[9px] font-bold bg-white text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded">
                            {tpl.roleType} standard
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">{tpl.description}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleTriggerEditTemplate(tpl)}
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-150 rounded-lg cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(tpl.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-slate-150 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100/50">
                      <span>Baseline Target: <b className="text-slate-600 font-bold">{tpl.targetValue}</b></span>
                      <span>Weight: <b className="text-slate-600 font-bold">{tpl.weight}%</b></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
