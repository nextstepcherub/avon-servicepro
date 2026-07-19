import React from 'react';
import { MOCK_USERS } from '../data/mockData';
import { UserProfile } from '../types';
import { UserCheck, Shield } from 'lucide-react';

interface RoleSelectorProps {
  activeUser: UserProfile;
  onChangeUser: (user: UserProfile) => void;
  users?: UserProfile[];
}

export default function RoleSelector({ activeUser, onChangeUser, users }: RoleSelectorProps) {
  return (
    <div id="role_selector_card" className="bg-slate-900 text-white rounded-2xl shadow-xl p-5 border border-slate-800 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
            <Shield className="w-5 h-5" id="shield_icon" />
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-tight text-slate-100">Enterprise Impersonation Console</h4>
            <p className="text-xs text-slate-400">Quickly swap user roles to test specific workflow rules</p>
          </div>
        </div>
        <span className="text-xs font-mono px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
          Developer Mode
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {(users || MOCK_USERS).map((user) => {
          const isActive = user.id === activeUser.id;
          return (
            <button
              key={user.id}
              id={`impersonate_${user.id}`}
              onClick={() => onChangeUser(user)}
              className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer group ${
                isActive
                  ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/10 text-white'
                  : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover mb-2 border-2 border-slate-700 group-hover:border-slate-500 transition-all"
              />
              <span className="text-xs font-medium truncate w-full">{user.name}</span>
              <span className={`text-[10px] mt-1 px-1.5 py-0.5 rounded ${
                isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
              } truncate w-full`}>
                {user.role}
              </span>
              
              {user.tags.length > 0 && (
                <div className="flex gap-1 mt-1.5 flex-wrap justify-center w-full">
                  {user.tags.map(t => (
                    <span key={t} className={`text-[8px] font-mono px-1 rounded-sm ${
                      isActive ? 'bg-blue-800 text-blue-200' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {t.split(' ')[0]}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
