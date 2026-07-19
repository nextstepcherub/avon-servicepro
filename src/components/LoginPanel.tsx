import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Lock, User, Check, Shield, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginPanelProps {
  users: UserProfile[];
  onLoginSuccess: (user: UserProfile, rememberMe: boolean) => void;
}

export default function LoginPanel({ users, onLoginSuccess }: LoginPanelProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Simulate slight network delay for a real-world enterprise feel
    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = password.trim();

      if (!trimmedUser || !trimmedPass) {
        setError('Please enter both username/email and password.');
        setIsSubmitting(false);
        return;
      }

      // Look up user by email, name, or id (case insensitive)
      const foundUser = users.find(u => 
        u.email.toLowerCase() === trimmedUser || 
        u.name.toLowerCase() === trimmedUser || 
        u.id.toLowerCase() === trimmedUser ||
        u.email.split('@')[0].toLowerCase() === trimmedUser
      );

      if (!foundUser) {
        setError('Invalid username or email. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      if (foundUser.disabled) {
        setError('Security Lockout: This account has been disabled. Please contact your system administrator.');
        setIsSubmitting(false);
        return;
      }

      // Check password (default to 'password123' if not explicitly defined)
      const correctPass = foundUser.password || 'password123';
      if (trimmedPass !== correctPass) {
        setError('Incorrect password. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Success! Pass details up
      setIsSubmitting(false);
      onLoginSuccess(foundUser, rememberMe);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Dynamic Background Gradients for Premium Touch */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[950px] bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl shadow-black/60 grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        {/* Left Branding Panel (5 Cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80 relative">
          <div className="space-y-6">
            {/* AVON Interlocking Logo */}
            <div className="flex items-center gap-3">
              <svg className="w-12 h-12 shrink-0" viewBox="10 5 50 90" fill="none">
                <path d="M20 85 L20 55 L50 35 L50 15" stroke="url(#login_grad_left)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 15 L20 45 L50 65 L50 85" stroke="#090d16" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 15 L20 45 L50 65 L50 85" stroke="url(#login_grad_right)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="login_grad_left" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                  <linearGradient id="login_grad_right" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col justify-center leading-none">
                <div className="flex items-baseline gap-0.5">
                  <span className="font-black text-xl tracking-tight text-white">AVON</span>
                  <span className="text-orange-500 font-black text-xl">:</span>
                </div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em]">PHARMO CHEM</span>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <h1 className="text-xl font-black text-white tracking-tight leading-snug">
                ServicePro Enterprise
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Avon Pharmo Chem's integrated biomedical engineering workflow, asset management, and KPI diagnostics engine.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Panel (7 Cols) */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">System Authentication</h2>
            <p className="text-xs text-slate-400">Provide your designated Avon engineer credentials to access the platform.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex gap-2.5 items-start text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            {/* Username / Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Username or Corporate Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="dilhan.p@avon.lk or Sanjeewa Silva"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs font-semibold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me and Security Note */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                  rememberMe 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-sm' 
                    : 'bg-slate-900 border-slate-800 group-hover:border-slate-700'
                }`}>
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[11px] font-bold text-slate-300 group-hover:text-slate-200 transition-colors">
                  Remember my session
                </span>
              </label>

              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span>256-bit TLS Secure</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 font-bold text-xs text-white uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating secure token...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center space-y-1.5 relative z-10">
        <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
          AVON PHARMO CHEM SERVICEPRO v3.2.0
        </p>
        <p className="text-[10px] text-slate-600">
          Authorized personnel access only. Actions logged under ISO 9001 quality audits.
        </p>
      </div>
    </div>
  );
}
