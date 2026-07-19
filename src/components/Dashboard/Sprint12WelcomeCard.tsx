// ============================================================================
// File: src/components/Dashboard/Sprint12WelcomeCard.tsx
// Sprint 1.2 Dashboard Banner displaying: Welcome User, Employee Number, Roles, Engineer Tags
// ============================================================================

import React from 'react';
import { LoadedUserSession } from '../../types/authSchema';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  Award, 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  KeyRound,
  IdCard,
  Briefcase
} from 'lucide-react';

interface Sprint12WelcomeCardProps {
  session: LoadedUserSession | null;
}

export default function Sprint12WelcomeCard({ session }: Sprint12WelcomeCardProps) {
  if (!session || !session.profile) {
    return null;
  }

  const { profile, roles, engineerTags, sessionExpiresAt } = session;
  const primaryRole = roles[0] || { role_name: 'Biomedical Service Engineer', role_code: 'ENG' };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001D3D] via-[#0054A6] via-[#4F46E5] to-[#00AEEF] p-6 text-white shadow-xl border border-cyan-400/40 mb-6 animate-in fade-in slide-in-from-top duration-300 animate-aurora">
      
      {/* Background Colorful Decorative Glow Blobs */}
      <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-pink-500/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute left-1/3 -bottom-10 w-72 h-72 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-cyan-400/25 blur-3xl pointer-events-none" />
      <div className="absolute right-12 top-0 opacity-15 pointer-events-none mix-blend-overlay">
        <Building2 className="w-56 h-56 text-white" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left: Avatar + Welcome User + Employee Number */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-[#00AEEF] backdrop-blur-md flex items-center justify-center text-xl font-black text-white uppercase shadow-inner shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                profile.full_name.slice(0, 2)
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#003B75] flex items-center justify-center" title="Session Verified & Active">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00AEEF]/30 text-cyan-200 uppercase tracking-widest border border-[#00AEEF]/40">
                SPRINT 1.2 VERIFIED
              </span>
              <span className="text-xs font-mono text-blue-200 flex items-center gap-1 hidden sm:flex">
                <Clock className="w-3 h-3 text-cyan-300" />
                <span>Expires {new Date(sessionExpiresAt).toLocaleTimeString()}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 flex items-center gap-2">
              <span>Welcome, {profile.full_name}</span>
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse hidden md:inline" />
            </h2>

            {/* Employee Number & Department */}
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-blue-100 font-sans">
              <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-white/10 font-mono font-bold text-amber-300">
                <IdCard className="w-3.5 h-3.5 text-amber-300" />
                <span>EMP NO: {profile.employee_number}</span>
              </span>
              <span className="flex items-center gap-1.5 text-blue-200">
                <Briefcase className="w-3.5 h-3.5 text-cyan-300" />
                <span>{profile.department}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Roles & Engineer Tags Badges */}
        <div className="flex flex-col gap-3 bg-black/20 p-4 rounded-xl border border-white/10 backdrop-blur-md lg:max-w-md shrink-0">
          
          {/* Assigned Roles List */}
          <div>
            <p className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#00AEEF]" />
              <span>Assigned RBAC Roles ({roles.length})</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {roles.map(r => (
                <span 
                  key={r.id} 
                  className="px-2.5 py-1 rounded-lg bg-[#0054A6] text-white text-xs font-bold border border-cyan-400/40 shadow-xs flex items-center gap-1"
                  title={r.description}
                >
                  <ShieldCheck className="w-3 h-3 text-cyan-300" />
                  <span>{r.role_name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Assigned Engineer Tags */}
          <div className="border-t border-white/10 pt-2.5">
            <p className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Engineer Metrology Tags ({engineerTags.length})</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {engineerTags.map(t => (
                <span 
                  key={t.id} 
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border shadow-2xs ${t.color_code}`}
                  title={t.description || t.category}
                >
                  {t.tag_name}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
