import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile } from '../../types';
import { 
  Bell, 
  Send, 
  CheckSquare, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Layers, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Filter, 
  Search, 
  RefreshCw, 
  ExternalLink,
  Plus,
  Flame,
  AlertOctagon,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationQueueModuleProps {
  activeUser: UserProfile;
  users: UserProfile[];
  onLogAudit: (action: string, previousValue?: string, newValue?: string, remarks?: string) => void;
  onRefreshGlobalNotifications?: () => void;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  createdAt: string;
  readAt?: string;
  link?: string;
}

const DEFAULT_MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-eng-bob',
    title: 'ISO-9001 Calibration Due Warning',
    message: 'Analytical Spectrophotometer Cary 3500 (S/N: AGL-3500-8812) has passed its PM calibration threshold. Metrology team review required.',
    type: 'CALIBRATION',
    priority: 'HIGH',
    status: 'UNREAD',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    link: '#pm-scheduler'
  },
  {
    id: 'notif-2',
    userId: 'usr-eng-bob',
    title: 'Critical Breakdown Escalation',
    message: 'Emergency Repair requested at Lanka Hospitals Diagnostics: Optical sensor calibration error on startup of Real-Time PCR (S/N: QS5-994120-LK).',
    type: 'ALERT',
    priority: 'HIGH',
    status: 'UNREAD',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    link: '#jobs'
  },
  {
    id: 'notif-3',
    userId: 'usr-eng-bob',
    title: 'AMC SLA Contract Renewal Pending',
    message: 'Gold Tier AMC SLA with Asiri Surgical Hospital (Contract No: AVN-AMC-2026-902) expires in 14 days. Escalation check triggered.',
    type: 'AMC_EXPIRY',
    priority: 'MEDIUM',
    status: 'READ',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    readAt: new Date(Date.now() - 3600000 * 23).toISOString(),
    link: '#amc-management'
  },
  {
    id: 'notif-4',
    userId: 'usr-eng-bob',
    title: 'New Service Job Assignment',
    message: 'You have been assigned as lead engineer for Preventive Maintenance of Automated Chemistry Analyzer (S/N: AGL-3500-8812).',
    type: 'JOB_ASSIGNMENT',
    priority: 'MEDIUM',
    status: 'UNREAD',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    link: '#jobs'
  },
  {
    id: 'notif-5',
    userId: 'usr-dispatcher-alice',
    title: 'System Backup Complete',
    message: 'Automated database synchronization to primary secure cloud storage completed successfully. All MariaDB transaction logs flushed.',
    type: 'SYSTEM',
    priority: 'LOW',
    status: 'READ',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
    readAt: new Date(Date.now() - 3600000 * 71).toISOString()
  }
];

export default function NotificationQueueModule({
  activeUser,
  users,
  onLogAudit,
  onRefreshGlobalNotifications
}: NotificationQueueModuleProps) {
  // Database States
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiMode, setApiMode] = useState<'live' | 'fallback'>('fallback');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [userFilter, setUserFilter] = useState<string>('ALL');

  // Interactive Sending Panel Form
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState('SYSTEM');
  const [notifPriority, setNotifPriority] = useState('MEDIUM');
  const [notifLink, setNotifLink] = useState('');

  // Toast / Status Message
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Set default target user on load
  useEffect(() => {
    if (users && users.length > 0) {
      setTargetUserId(users[0].id);
    }
  }, [users]);

  // Load notifications from Server (with LocalStorage fallback)
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('avon_session_token');
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/notifications', { headers }).catch(() => null);
        if (response && response.ok) {
          const json = await response.json();
          setNotifications(json.data.notifications);
          setApiMode('live');
        } else {
          // Fallback to local storage
          setApiMode('fallback');
          const local = localStorage.getItem('avon_notifications');
          if (local) {
            setNotifications(JSON.parse(local));
          } else {
            localStorage.setItem('avon_notifications', JSON.stringify(DEFAULT_MOCK_NOTIFICATIONS));
            setNotifications(DEFAULT_MOCK_NOTIFICATIONS);
          }
        }
      } catch (err) {
        setApiMode('fallback');
        const local = localStorage.getItem('avon_notifications');
        if (local) {
          setNotifications(JSON.parse(local));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [refreshTrigger]);

  // Trigger sync of local state to server (or localStorage)
  const saveState = async (updated: NotificationItem[]) => {
    setNotifications(updated);
    if (apiMode === 'fallback') {
      localStorage.setItem('avon_notifications', JSON.stringify(updated));
    }
    if (onRefreshGlobalNotifications) {
      onRefreshGlobalNotifications();
    }
  };

  // Mark notification as Read
  const handleMarkAsRead = async (id: string) => {
    try {
      if (apiMode === 'live') {
        const token = localStorage.getItem('avon_session_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/notifications/${id}/read`, {
          method: 'PATCH',
          headers
        });
        if (res.ok) {
          triggerToast('Notification resolved and marked as read', 'success');
          setRefreshTrigger(prev => prev + 1);
          return;
        }
      }

      // Fallback/Mock mode
      const updated = notifications.map(n => n.id === id ? { ...n, status: 'READ' as const, readAt: new Date().toISOString() } : n);
      await saveState(updated);
      triggerToast('Notification marked as read (Offline Fallback active)', 'info');
      onLogAudit('MARK_NOTIFICATION_READ', id, 'READ', `Marked notification ${id} as read`);
    } catch (e) {
      triggerToast('Failed to update notification status', 'error');
    }
  };

  // Mark all notifications as read for active user
  const handleMarkAllAsRead = async () => {
    try {
      if (apiMode === 'live') {
        const token = localStorage.getItem('avon_session_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/notifications/mark-all-read', {
          method: 'POST',
          headers,
          body: JSON.stringify({ userId: activeUser.id })
        });
        if (res.ok) {
          triggerToast('All notifications resolved successfully', 'success');
          setRefreshTrigger(prev => prev + 1);
          return;
        }
      }

      // Fallback/Mock mode
      const updated = notifications.map(n => n.userId === activeUser.id ? { ...n, status: 'READ' as const, readAt: new Date().toISOString() } : n);
      await saveState(updated);
      triggerToast('All user notifications marked as read', 'success');
      onLogAudit('MARK_ALL_NOTIFICATIONS_READ', activeUser.id, 'ALL_READ', 'Cleared notification workspace stack');
    } catch (e) {
      triggerToast('Failed to mark all as read', 'error');
    }
  };

  // Delete notification
  const handleDeleteNotif = async (id: string) => {
    try {
      if (apiMode === 'live') {
        const token = localStorage.getItem('avon_session_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/notifications/${id}`, {
          method: 'DELETE',
          headers
        });
        if (res.ok) {
          triggerToast('Notification removed from queue', 'success');
          setRefreshTrigger(prev => prev + 1);
          return;
        }
      }

      // Fallback/Mock mode
      const updated = notifications.filter(n => n.id !== id);
      await saveState(updated);
      triggerToast('Notification purged from queue', 'success');
      onLogAudit('DELETE_NOTIFICATION', id, 'PURGED', `Purged notification record ${id}`);
    } catch (e) {
      triggerToast('Failed to delete notification', 'error');
    }
  };

  // Submit dynamic manual notification dispatch
  const handleDispatchNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) {
      triggerToast('Title and Message fields are strictly required', 'error');
      return;
    }

    try {
      const payload = {
        userId: targetUserId,
        title: notifTitle,
        message: notifMessage,
        type: notifType,
        priority: notifPriority,
        link: notifLink || undefined
      };

      if (apiMode === 'live') {
        const token = localStorage.getItem('avon_session_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/notifications', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          triggerToast(`Notification dispatched successfully to ${users.find(u => u.id === targetUserId)?.name}`, 'success');
          setNotifTitle('');
          setNotifMessage('');
          setNotifLink('');
          setRefreshTrigger(prev => prev + 1);
          return;
        }
      }

      // Fallback/Mock mode
      const mockNotif: NotificationItem = {
        id: `notif-manual-${Date.now()}`,
        userId: targetUserId,
        title: notifTitle,
        message: notifMessage,
        type: notifType,
        priority: notifPriority,
        status: 'UNREAD',
        createdAt: new Date().toISOString(),
        link: notifLink || undefined
      };

      const updated = [mockNotif, ...notifications];
      await saveState(updated);
      triggerToast(`Notification successfully dispatched (Offline local database synced)`, 'success');
      
      onLogAudit('DISPATCH_NOTIFICATION', 'SYSTEM_QUEUE', mockNotif.id, `Dispatched manual alert to user ${targetUserId}`);

      setNotifTitle('');
      setNotifMessage('');
      setNotifLink('');
    } catch (err) {
      triggerToast('Failed to dispatch notification', 'error');
    }
  };

  // Seed standard medical alert bundle
  const handleTriggerMockBundle = async () => {
    const freshMockBundle: NotificationItem[] = [
      {
        id: `notif-auto-1-${Date.now()}`,
        userId: activeUser.id,
        title: 'Emergency: Critical Temp Block Fault',
        message: 'Bio-Chamber Incubator 400X (S/N: SYX-TEMP-808) has logged sensor out-of-range (+15.2C). SLA deadline limit 4 hours remaining.',
        type: 'ALERT',
        priority: 'HIGH',
        status: 'UNREAD',
        createdAt: new Date().toISOString(),
        link: '#jobs'
      },
      {
        id: `notif-auto-2-${Date.now()}`,
        userId: activeUser.id,
        title: 'Calibration Success Registered',
        message: 'ISO-17025 certified Metrology validation registered for Automated Chemistry Analyzer (S/N: AGL-3500-8812). Quality audit passed.',
        type: 'CALIBRATION',
        priority: 'MEDIUM',
        status: 'UNREAD',
        createdAt: new Date().toISOString()
      },
      {
        id: `notif-auto-3-${Date.now()}`,
        userId: activeUser.id,
        title: 'SLA Grace Period Extension',
        message: 'A grace period extension of 14 days was approved by system administrator for AMC SLA contract AVN-AMC-2026-101.',
        type: 'SYSTEM',
        priority: 'LOW',
        status: 'UNREAD',
        createdAt: new Date().toISOString(),
        link: '#amc-management'
      }
    ];

    const updated = [...freshMockBundle, ...notifications];
    await saveState(updated);
    triggerToast('Seeded automated medical alerts bundle into local queue', 'success');
  };

  // Query filtering list calculations
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // 1. Search Query on Title / Message
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!notif.title.toLowerCase().includes(q) && !notif.message.toLowerCase().includes(q)) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL' && notif.status !== statusFilter) {
        return false;
      }

      // 3. Type Filter
      if (typeFilter !== 'ALL' && notif.type !== typeFilter) {
        return false;
      }

      // 4. Priority Filter
      if (priorityFilter !== 'ALL' && notif.priority !== priorityFilter) {
        return false;
      }

      // 5. User Filter
      if (userFilter !== 'ALL' && notif.userId !== userFilter) {
        return false;
      }

      return true;
    });
  }, [notifications, searchQuery, statusFilter, typeFilter, priorityFilter, userFilter]);

  // Priority metadata mapper helper
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Type Icon mapper helper
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ALERT':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'CALIBRATION':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'JOB_ASSIGNMENT':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'AMC_EXPIRY':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-indigo-600" />;
    }
  };

  // KPI summary metrics
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => n.status === 'UNREAD').length;
    const high = notifications.filter(n => n.priority === 'HIGH').length;
    const resolvedRate = total > 0 ? Math.round(((total - unread) / total) * 100) : 100;
    return { total, unread, high, resolvedRate };
  }, [notifications]);

  return (
    <div className="space-y-6">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 ${
              toast.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 
              toast.type === 'info' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {toast.type === 'error' ? <AlertOctagon className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Board Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0054A6]/10 text-[#0054A6] rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Notification & Metrology Queue</h1>
              <p className="text-xs text-gray-500 font-mono">AVON REAL-TIME INTEGRITY LOGS</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Action */}
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync Logs
          </button>

          {/* Seed Alert Bundle */}
          <button
            onClick={handleTriggerMockBundle}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-orange-50 border border-orange-100 hover:bg-orange-100 rounded-xl text-orange-800 transition-colors cursor-pointer"
            title="Seed medical alerts, calibrations & contracts"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            Trigger Alerts
          </button>

          {/* Mark All read */}
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-50 border border-emerald-150 hover:bg-emerald-100 rounded-xl text-emerald-800 transition-colors cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Clear Active Screen
          </button>

          {/* Server / API mode indicator badge */}
          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
            apiMode === 'live' 
              ? 'bg-emerald-100/40 text-emerald-700 border-emerald-200' 
              : 'bg-amber-100/40 text-amber-700 border-amber-200'
          }`}>
            ● {apiMode === 'live' ? 'DB_LIVE' : 'LOCAL_SQL'}
          </span>
        </div>
      </div>

      {/* Analytical KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Queue Capacity</span>
            <span className="text-2xl font-extrabold text-gray-900 font-mono">{stats.total}</span>
          </div>
          <div className="p-3 bg-blue-50 text-[#0054A6] rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Active Alarms</span>
            <span className="text-2xl font-extrabold text-red-650 font-mono">{stats.unread}</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Escalations Logged</span>
            <span className="text-2xl font-extrabold text-amber-700 font-mono">{stats.high}</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">Resolution Efficiency</span>
            <span className="text-2xl font-extrabold text-emerald-750 font-mono">{stats.resolvedRate}%</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Filter panel & Notification list */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Advanced Query & Search Filters */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-3 border-slate-50">
              <Filter className="w-4 h-4 text-gray-500" />
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Query Filters & Search</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alert keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-xs border border-gray-200 hover:border-gray-300 focus:border-blue-500 rounded-xl transition-all outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 hover:bg-slate-100/50 py-2 px-3 border text-xs border-gray-200 hover:border-gray-300 rounded-xl transition-all outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="UNREAD">Unread Alarms</option>
                  <option value="READ">Resolved Logs</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-slate-50 hover:bg-slate-100/50 py-2 px-3 border text-xs border-gray-200 hover:border-gray-300 rounded-xl transition-all outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="HIGH">High Escalations</option>
                  <option value="MEDIUM">Medium Alerts</option>
                  <option value="LOW">Low Logs</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/50 py-2 px-3 border text-xs border-gray-200 hover:border-gray-300 rounded-xl transition-all outline-none"
              >
                <option value="ALL">All Alarm Categories</option>
                <option value="CALIBRATION">Calibration Alerts</option>
                <option value="ALERT">Repair & Breakdown Warnings</option>
                <option value="JOB_ASSIGNMENT">Schedules & Job Allocations</option>
                <option value="AMC_EXPIRY">AMC Contracts Expiry</option>
                <option value="SYSTEM">System Broadcast Logs</option>
              </select>

              {/* Target User filter */}
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/50 py-2 px-3 border text-xs border-gray-200 hover:border-gray-300 rounded-xl transition-all outline-none"
              >
                <option value="ALL">All Recipient User Profiles</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>Filter for: {u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Queue List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between bg-slate-50/40">
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Operational Logs Queue ({filteredNotifications.length})</h2>
              <span className="text-[10px] font-mono text-gray-400">ORDERED BY TIMESTAMP DESC</span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[580px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {filteredNotifications.map(notif => {
                  const recipient = users.find(u => u.id === notif.userId);
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 hover:bg-slate-50/40 transition-colors space-y-2.5 relative ${
                        notif.status === 'UNREAD' ? 'bg-blue-50/20' : 'opacity-70 bg-white'
                      }`}
                    >
                      {/* Priority Tag & category */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(notif.type)}
                          <span className="text-xs font-bold text-gray-800 leading-none">{notif.title}</span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded ${getPriorityStyle(notif.priority)}`}>
                            {notif.priority}
                          </span>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex items-center gap-1.5">
                          {notif.link && (
                            <a
                              href={notif.link}
                              className="p-1 text-gray-400 hover:text-[#0054A6] rounded hover:bg-gray-100 transition-colors"
                              title="Navigate to referenced section"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {notif.status === 'UNREAD' && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="p-1 text-gray-400 hover:text-[#22C55E] rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
                              title="Mark log as resolved"
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteNotif(notif.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
                            title="Delete log permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Msg */}
                      <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">{notif.message}</p>

                      {/* Recipient User and Timestamp block */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1 flex-wrap gap-2 border-t border-slate-50">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-sans">
                            Recipient: <span className="font-semibold">{recipient ? recipient.name : notif.userId}</span>
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-sans">
                            Role: <span className="font-semibold">{recipient ? recipient.role : 'Staff'}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span>Dispatch: {new Date(notif.createdAt).toLocaleString()}</span>
                          {notif.readAt && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-emerald-600">Resolved: {new Date(notif.readAt).toLocaleTimeString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {filteredNotifications.length === 0 && (
                  <div className="p-12 text-center text-gray-400 space-y-2">
                    <Bell className="w-8 h-8 mx-auto text-gray-300 stroke-1" />
                    <p className="text-xs font-semibold">All logs clear</p>
                    <p className="text-[10px] text-gray-400">Try loosening your search or filtering queries.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Dispatch Testing Simulator Form Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b pb-3 border-slate-50">
              <Send className="w-4 h-4 text-[#0054A6]" />
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Test Notification Dispatcher</h2>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Use this simulation control panel to dispatch manual notifications to any user in the organigram, validating queue state logic and routing.
            </p>

            <form onSubmit={handleDispatchNotification} className="space-y-4">
              {/* Recipient selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Recipient User Profile</label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/50 py-2 px-3 border text-xs border-gray-200 hover:border-gray-300 rounded-xl transition-all outline-none"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Alert Title</label>
                <input
                  type="text"
                  placeholder="e.g., ISO Calibration Failed"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-xs border border-gray-200 hover:border-gray-300 focus:border-blue-500 rounded-xl transition-all outline-none"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Log Message</label>
                <textarea
                  placeholder="Enter deep breakdown description..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-xs border border-gray-200 hover:border-gray-300 focus:border-blue-500 rounded-xl transition-all outline-none resize-none"
                />
              </div>

              {/* Category & priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Alarm Type</label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 py-2 px-3 border text-xs border-gray-200 hover:border-gray-300 rounded-xl transition-all outline-none"
                  >
                    <option value="SYSTEM">SYSTEM</option>
                    <option value="CALIBRATION">CALIBRATION</option>
                    <option value="ALERT">ALERT/FAULT</option>
                    <option value="JOB_ASSIGNMENT">JOB_ASSIGNMENT</option>
                    <option value="AMC_EXPIRY">AMC_EXPIRY</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Priority</label>
                  <select
                    value={notifPriority}
                    onChange={(e) => setNotifPriority(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 py-2 px-3 border text-xs border-gray-200 hover:border-gray-300 rounded-xl transition-all outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              {/* Navigation link */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Routing Redirection Link (Optional)</label>
                <select
                  value={notifLink}
                  onChange={(e) => setNotifLink(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/50 py-2 px-3 border text-xs border-gray-200 hover:border-gray-300 rounded-xl transition-all outline-none"
                >
                  <option value="">No redirect link</option>
                  <option value="#jobs">Jobs Master (#jobs)</option>
                  <option value="#pm-scheduler">PM Planner (#pm-scheduler)</option>
                  <option value="#amc-management">AMC SLA Contracts (#amc-management)</option>
                  <option value="#reporting">Analytical Reports (#reporting)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold bg-[#0054A6] hover:bg-[#003B75] text-white rounded-xl shadow-md transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Dispatch Notification
              </button>
            </form>
          </div>

          {/* Quick SLA Help Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-6 rounded-2xl border border-slate-800 text-white space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">Metrology SLA Compliance</h3>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Regulatory alerts, PM targets, and calibration cycles are linked to active SLA response windows under ISO standard frameworks. Clear high alerts immediately upon device certification checks.
            </p>
            <div className="border-t border-slate-800 pt-3 flex justify-between text-[10px] font-mono text-slate-400">
              <span>ISO 9001:2015</span>
              <span className="text-emerald-400 font-bold">MONITOR ACTIVE</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
