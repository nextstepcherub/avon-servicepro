import React, { useState } from 'react';
import { AppNotification, UserProfile } from '../types';
import { Bell, HeartPulse, ShieldAlert, Check, CheckSquare, LogOut } from 'lucide-react';

interface HeaderProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  currentUser: UserProfile;
  onLogout?: () => void;
}

export default function Header({ notifications, onMarkRead, onClearAll, currentUser, onLogout }: HeaderProps) {
  const [showNotifDropbox, setShowNotifDropbox] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 relative select-none">
      
      {/* Title block */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <div className="text-xs font-mono font-bold text-gray-500">
            SECURE SECTOR: <span className="text-[#0054A6]">AVON_SERVICE_CENTRAL_COLOMBO</span>
          </div>
        </div>

        {currentUser.tags && currentUser.tags.length > 0 && (
          <div className="hidden md:flex items-center gap-1.5 border-l pl-3 border-gray-200">
            <span className="text-[10px] font-mono text-gray-400">TAGS:</span>
            {currentUser.tags.map(t => (
              <span key={t} className="bg-[#0054A6]/10 text-[#0054A6] border border-[#0054A6]/20 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                🏷️ {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* User settings + notifications */}
      <div className="flex items-center gap-4">
        
        {/* Dynamic Alerts drop menu */}
        <div className="relative">
          <button
            id="notification-bell-btn"
            onClick={() => setShowNotifDropbox(!showNotifDropbox)}
            className="p-1 px-2 border rounded-full hover:bg-slate-50 relative flex items-center gap-1 text-gray-600 border-gray-150 cursor-pointer focus:outline-none"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[9px] w-4 h-4 flex items-center justify-center rounded-full leading-none scale-90">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropbox of alarms */}
          {showNotifDropbox && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-lg border border-gray-100 shadow-xl overflow-hidden z-50">
              
              <div className="p-3 bg-slate-50 border-b flex items-center justify-between text-xs font-bold leading-none">
                <span className="text-gray-700">Metrology & Service Alerts</span>
                {unreadCount > 0 && (
                  <button
                    id="clear-all-notifs"
                    onClick={() => {
                      onClearAll();
                      setShowNotifDropbox(false);
                    }}
                    className="text-[10px] text-[#0054A6] hover:underline"
                  >
                    Clear Alarms
                  </button>
                )}
              </div>

              <div className="divide-y max-h-72 overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-3 text-xs space-y-1.5 ${notif.read ? 'opacity-60 bg-white' : 'bg-blue-50/40'}`}>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-bold text-gray-800 leading-snug flex items-center gap-1">
                        {notif.severity === 'ALERT' ? (
                          <span className="text-red-650 font-bold font-mono">▲ {notif.title}</span>
                        ) : (
                          <span className="text-[#0077C8] font-mono">● {notif.title}</span>
                        )}
                      </h4>

                      {!notif.read && (
                        <button
                          id={`mark-read-${notif.id}`}
                          onClick={() => onMarkRead(notif.id)}
                          className="text-[9px] text-gray-400 hover:text-[#22C55E] flex items-center gap-0.5 focus:outline-none"
                          title="Mark verification as resolved"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-gray-500 text-[11px] leading-relaxed font-sans">{notif.message}</p>
                    <span className="text-[9px] font-mono text-gray-300 block">{new Date(notif.timestamp).toLocaleTimeString() || "JUST NOW"}</span>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="p-6 text-center text-gray-400 text-xs">
                    No active regulatory alerts. System healthy.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-l border-gray-200 h-6"></div>

        {/* Diagnostic Certified banner */}
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-150 rounded px-2.5 py-0.5 uppercase tracking-wide">
            ISO-9001 ACTIVE
          </span>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors text-xs font-semibold cursor-pointer ml-1"
            title="Secure Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}

      </div>
    </header>
  );
}
