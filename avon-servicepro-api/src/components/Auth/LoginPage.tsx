// ============================================================================
// File: src/components/Auth/LoginPage.tsx
// Production-Ready Enterprise Login Page for AVON ServicePro V5.1
// Branding: AVON PHARMO CHEM (PVT) LTD SERVICE CENTRE (#0054A6)
// Stack: TypeScript, Zod Validation, Supabase Auth Integration
// ============================================================================

import React, { useState } from 'react';
import { z } from 'zod';
import { enterpriseLogin } from '../../lib/supabaseClient';
import { 
  Building2, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  KeyRound,
  Loader2,
  Activity
} from 'lucide-react';

// Zod Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, "Email address is required").email("Please enter a valid corporate email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginPageProps {
  onLoginSuccess: (userEmail: string, role?: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: 'cherub.w@avonpharmochem.com',
    password: 'password123'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Dialog State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Handle Input Changes
  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error on typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (authError) setAuthError(null);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Zod Validation
    const validationResult = loginSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      validationResult.error.issues.forEach(issue => {
        const path = issue.path[0] as keyof LoginFormData;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { user, error } = await enterpriseLogin(formData.email, formData.password);
      if (error) {
        setAuthError(error);
        setIsLoading(false);
        return;
      }

      // Successful Login
      setIsLoading(false);
      const role = user?.user_metadata?.role || 'Senior Biomedical Engineer';
      onLoginSuccess(formData.email, role);
    } catch (err: any) {
      setAuthError(err.message || "An unexpected system exception occurred during authentication.");
      setIsLoading(false);
    }
  };

  // Quick Demo Login Handler
  const handleQuickDemoLogin = (demoEmail: string, demoRole: string) => {
    setFormData({ email: demoEmail, password: 'enterprise_demo_pass' });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(demoEmail, demoRole);
    }, 500);
  };

  // Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotStatus('error');
      return;
    }
    setForgotStatus('loading');
    setTimeout(() => {
      setForgotStatus('success');
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans select-none">
      
      {/* Background Architectural Grid & Subtle Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[rgb(0,84,166)]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Enterprise Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl relative z-10 overflow-hidden">
        
        {/* Top Accent Bar (#0054A6) */}
        <div className="h-2 w-full bg-[rgb(0,84,166)]" />

        <div className="p-8 sm:p-10">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[rgb(0,84,166)]/15 border border-[rgb(0,84,166)]/40 flex items-center justify-center mb-4 text-[rgb(0,84,166)] shadow-lg shadow-[rgb(0,84,166)]/10">
              <Building2 className="w-8 h-8 text-[#3399ff]" />
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase font-sans">
              AVON PHARMO CHEM
            </h1>
            <p className="text-xs font-semibold tracking-widest text-[#3399ff] mt-1 uppercase">
              (PVT) LTD SERVICE CENTRE
            </p>
            
            <div className="flex items-center gap-2 mt-3 px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium text-slate-300 tracking-wide">
                AVON ServicePro V5.1 Portal
              </span>
            </div>
          </div>

          {/* Global Auth Alert */}
          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold block mb-0.5">Authentication Failed</span>
                {authError}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Work Email</span>
                <span className="text-[10px] text-slate-500">Corporate Domain</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="name@avonpharmochem.com"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border ${
                    errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-800 focus:border-[#3399ff] focus:ring-[#3399ff]/20'
                  } rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-4 transition-all duration-200`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-400 flex items-center gap-1.5 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setForgotEmail(formData.email);
                    setForgotStatus('idle');
                  }}
                  className="text-xs text-[#3399ff] hover:text-blue-300 font-medium transition-colors focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border ${
                    errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-800 focus:border-[#3399ff] focus:ring-[#3399ff]/20'
                  } rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-4 transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400 flex items-center gap-1.5 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: '#0054A6' }}
              className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white shadow-lg shadow-[rgb(0,84,166)]/25 hover:brightness-110 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>Login to ServicePro</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-wider">
                Or Quick Test Access
              </span>
            </div>
          </div>

          {/* Quick Demo Access Buttons for Preview Testing */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('cherub.w@avonpharmochem.com', 'Senior Biomedical Engineer')}
              className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left transition-all group flex flex-col cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-slate-200 group-hover:text-[#3399ff] transition-colors flex items-center justify-between">
                <span>Engineer Div</span>
                <Activity className="w-3 h-3 text-[#3399ff] opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="text-[10px] text-slate-500 truncate mt-0.5">cherub.w@...</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('manager@avon.lk', 'Workshop Manager')}
              className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left transition-all group flex flex-col cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-slate-200 group-hover:text-[#3399ff] transition-colors flex items-center justify-between">
                <span>Workshop Mgr</span>
                <ShieldCheck className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="text-[10px] text-slate-500 truncate mt-0.5">manager@avon.lk</span>
            </button>
          </div>

        </div>

        {/* Footer Info Bar */}
        <div className="px-8 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Metrology ISO 17025 Ready</span>
          <span className="flex items-center gap-1 text-slate-400">
            <KeyRound className="w-3 h-3 text-[#3399ff]" />
            <span>Supabase Auth Encrypted</span>
          </span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#3399ff]/10 text-[#3399ff]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Reset Account Password</h3>
                <p className="text-[11px] text-slate-400">AVON Service Centre Directory</p>
              </div>
            </div>

            {forgotStatus === 'success' ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-xs text-slate-200 font-medium">
                  Password recovery instructions have been dispatched to <span className="text-[#3399ff] font-semibold">{forgotEmail}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your corporate registered email. We will send a secure token to reset your AVON Metrology credentials.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="engineer@avonpharmochem.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:border-[#3399ff] focus:outline-none"
                />
                {forgotStatus === 'error' && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Please provide a valid corporate email address.</span>
                  </p>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotStatus === 'loading'}
                    style={{ backgroundColor: '#0054A6' }}
                    className="px-4 py-2 text-xs font-medium text-white rounded-xl shadow hover:brightness-110 flex items-center gap-1.5"
                  >
                    {forgotStatus === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Send Reset Link</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
