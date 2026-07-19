export interface AVONEmployeeV4 {
  id: string;
  email: string;
  full_name: string;
  role: AVONRoleV4;
  engineer_tags: AVONTagV4[];
  phone_number: string;
  department: string;
  is_active: boolean;
  created_at: string;
  last_sign_in?: string;
  avatar_url?: string;
}

export type AVONRoleV4 =
  | 'Workshop Manager'
  | 'Documentation Officer'
  | 'Senior Biomedical Engineer'
  | 'Biomedical Engineer'
  | 'Junior Biomedical Engineer'
  | 'Senior Service Engineer'
  | 'Service Engineer'
  | 'Junior Service Engineer'
  | 'Senior Workshop Engineer'
  | 'Workshop Engineer'
  | 'Junior Workshop Engineer'
  | 'Calibration Engineer'
  | 'Technician'
  | 'Trainee Technician'
  | 'Trainee Engineer'
  | 'Intern Technician';

export type AVONTagV4 =
  | 'Area Engineer'
  | 'Workshop Engineer'
  | 'Calibration Engineer';

export const ALL_AVON_ROLES_V4: AVONRoleV4[] = [
  'Workshop Manager',
  'Documentation Officer',
  'Senior Biomedical Engineer',
  'Biomedical Engineer',
  'Junior Biomedical Engineer'
].filter(Boolean) as AVONRoleV4[]; // We will list all 16 explicitly below

export const AVON_ROLES_LIST: AVONRoleV4[] = [
  'Workshop Manager',
  'Documentation Officer',
  'Senior Biomedical Engineer',
  'Biomedical Engineer',
  'Junior Biomedical Engineer',
  'Senior Service Engineer',
  'Service Engineer',
  'Junior Service Engineer',
  'Senior Workshop Engineer',
  'Workshop Engineer',
  'Junior Workshop Engineer',
  'Calibration Engineer',
  'Technician',
  'Trainee Technician',
  'Trainee Engineer',
  'Intern Technician'
];

export const AVON_TAGS_LIST: AVONTagV4[] = [
  'Area Engineer',
  'Workshop Engineer',
  'Calibration Engineer'
];

export const MOCK_INITIAL_EMPLOYEES: AVONEmployeeV4[] = [
  {
    id: "usr-001-mgr",
    email: "cherub.w@avonservicepro.com",
    full_name: "Cherub Weeratunge",
    role: "Workshop Manager",
    engineer_tags: ["Workshop Engineer", "Calibration Engineer"],
    phone_number: "+94 77 123 4567",
    department: "Executive & Workshop Ops",
    is_active: true,
    created_at: "2024-01-15T08:30:00Z",
    last_sign_in: "2026-06-24T04:10:00Z",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "usr-002-doc",
    email: "dilani.perera@avonservicepro.com",
    full_name: "Dilani Perera",
    role: "Documentation Officer",
    engineer_tags: [],
    phone_number: "+94 71 234 5678",
    department: "ISO & Quality Assurance",
    is_active: true,
    created_at: "2024-02-01T09:00:00Z",
    last_sign_in: "2026-06-24T03:45:00Z",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "usr-003-sbe",
    email: "ruwan.jayasinghe@avonservicepro.com",
    full_name: "Ruwan Jayasinghe",
    role: "Senior Biomedical Engineer",
    engineer_tags: ["Area Engineer"],
    phone_number: "+94 77 345 6789",
    department: "Biomedical Service",
    is_active: true,
    created_at: "2024-01-20T10:15:00Z",
    last_sign_in: "2026-06-23T18:20:00Z",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "usr-004-bme",
    email: "samantha.silva@avonservicepro.com",
    full_name: "Samantha Silva",
    role: "Biomedical Engineer",
    engineer_tags: ["Area Engineer"],
    phone_number: "+94 76 456 7890",
    department: "Biomedical Service",
    is_active: true,
    created_at: "2024-03-10T11:00:00Z",
    last_sign_in: "2026-06-24T01:12:00Z"
  },
  {
    id: "usr-005-jbme",
    email: "kavindu.m@avonservicepro.com",
    full_name: "Kavindu Madushan",
    role: "Junior Biomedical Engineer",
    engineer_tags: ["Area Engineer"],
    phone_number: "+94 78 567 8901",
    department: "Biomedical Service",
    is_active: true,
    created_at: "2025-01-05T08:00:00Z",
    last_sign_in: "2026-06-22T09:30:00Z"
  },
  {
    id: "usr-006-sse",
    email: "chamara.bandara@avonservicepro.com",
    full_name: "Chamara Bandara",
    role: "Senior Service Engineer",
    engineer_tags: ["Area Engineer", "Workshop Engineer"],
    phone_number: "+94 77 678 9012",
    department: "Field Technical Service",
    is_active: true,
    created_at: "2024-01-18T08:45:00Z",
    last_sign_in: "2026-06-24T04:00:00Z"
  },
  {
    id: "usr-007-se",
    email: "kasun.fernando@avonservicepro.com",
    full_name: "Kasun Fernando",
    role: "Service Engineer",
    engineer_tags: ["Area Engineer"],
    phone_number: "+94 71 789 0123",
    department: "Field Technical Service",
    is_active: true,
    created_at: "2024-04-15T10:00:00Z",
    last_sign_in: "2026-06-23T14:15:00Z"
  },
  {
    id: "usr-008-jse",
    email: "asanka.d@avonservicepro.com",
    full_name: "Asanka Dissanayake",
    role: "Junior Service Engineer",
    engineer_tags: ["Area Engineer"],
    phone_number: "+94 75 890 1234",
    department: "Field Technical Service",
    is_active: false,
    created_at: "2024-08-01T09:00:00Z",
    last_sign_in: "2026-05-10T11:20:00Z"
  },
  {
    id: "usr-009-swe",
    email: "roshan.gunasekara@avonservicepro.com",
    full_name: "Roshan Gunasekara",
    role: "Senior Workshop Engineer",
    engineer_tags: ["Workshop Engineer"],
    phone_number: "+94 77 901 2345",
    department: "Workshop Repair Centre",
    is_active: true,
    created_at: "2024-01-12T08:00:00Z",
    last_sign_in: "2026-06-24T02:00:00Z"
  },
  {
    id: "usr-010-we",
    email: "thilina.r@avonservicepro.com",
    full_name: "Thilina Rathnayake",
    role: "Workshop Engineer",
    engineer_tags: ["Workshop Engineer"],
    phone_number: "+94 76 012 3456",
    department: "Workshop Repair Centre",
    is_active: true,
    created_at: "2024-05-10T08:30:00Z",
    last_sign_in: "2026-06-24T03:10:00Z"
  },
  {
    id: "usr-011-jwe",
    email: "lahiru.p@avonservicepro.com",
    full_name: "Lahiru Pathirana",
    role: "Junior Workshop Engineer",
    engineer_tags: ["Workshop Engineer"],
    phone_number: "+94 71 123 9876",
    department: "Workshop Repair Centre",
    is_active: true,
    created_at: "2025-02-15T09:00:00Z",
    last_sign_in: "2026-06-23T16:45:00Z"
  },
  {
    id: "usr-012-cal",
    email: "nuwan.pradeep@avonservicepro.com",
    full_name: "Nuwan Pradeep",
    role: "Calibration Engineer",
    engineer_tags: ["Calibration Engineer"],
    phone_number: "+94 77 234 8765",
    department: "ISO 17025 Calibration Lab",
    is_active: true,
    created_at: "2024-02-10T08:15:00Z",
    last_sign_in: "2026-06-24T03:55:00Z"
  },
  {
    id: "usr-013-tech",
    email: "suranga.k@avonservicepro.com",
    full_name: "Suranga Kumara",
    role: "Technician",
    engineer_tags: ["Workshop Engineer"],
    phone_number: "+94 78 345 7654",
    department: "General Technical Support",
    is_active: true,
    created_at: "2024-06-01T08:00:00Z",
    last_sign_in: "2026-06-24T04:05:00Z"
  },
  {
    id: "usr-014-ttch",
    email: "dineth.s@avonservicepro.com",
    full_name: "Dineth Samarasinghe",
    role: "Trainee Technician",
    engineer_tags: ["Workshop Engineer"],
    phone_number: "+94 75 456 6543",
    department: "General Technical Support",
    is_active: true,
    created_at: "2025-04-01T08:30:00Z",
    last_sign_in: "2026-06-24T01:30:00Z"
  },
  {
    id: "usr-015-teng",
    email: "ravindu.w@avonservicepro.com",
    full_name: "Ravindu Wijesinghe",
    role: "Trainee Engineer",
    engineer_tags: ["Area Engineer"],
    phone_number: "+94 76 567 5432",
    department: "Biomedical Service",
    is_active: true,
    created_at: "2025-05-15T09:00:00Z",
    last_sign_in: "2026-06-23T11:00:00Z"
  },
  {
    id: "usr-016-int",
    email: "pasindu.h@avonservicepro.com",
    full_name: "Pasindu Hettiarachchi",
    role: "Intern Technician",
    engineer_tags: ["Calibration Engineer"],
    phone_number: "+94 71 678 4321",
    department: "ISO 17025 Calibration Lab",
    is_active: false,
    created_at: "2025-06-01T08:00:00Z",
    last_sign_in: "2026-06-15T10:00:00Z"
  }
];

export const SUPABASE_SQL_DDL_CODE = `-- ============================================================================
-- AVON SERVICEPRO NEXT.JS 15 + SUPABASE AUTH & USER MANAGEMENT DDL
-- Database Schema, Enums, Profiles Table, Triggers, and RLS Security Policies
-- ============================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE CUSTOM ENUMS
CREATE TYPE public.avon_role AS ENUM (
  'Workshop Manager',
  'Documentation Officer',
  'Senior Biomedical Engineer',
  'Biomedical Engineer',
  'Junior Biomedical Engineer',
  'Senior Service Engineer',
  'Service Engineer',
  'Junior Service Engineer',
  'Senior Workshop Engineer',
  'Workshop Engineer',
  'Junior Workshop Engineer',
  'Calibration Engineer',
  'Technician',
  'Trainee Technician',
  'Trainee Engineer',
  'Intern Technician'
);

CREATE TYPE public.engineer_tag AS ENUM (
  'Area Engineer',
  'Workshop Engineer',
  'Calibration Engineer'
);

-- 3. CREATE USERS PROFILE TABLE (LINKED TO SUPABASE AUTH.USERS)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role public.avon_role NOT NULL DEFAULT 'Technician'::public.avon_role,
  engineer_tags public.engineer_tag[] DEFAULT '{}'::public.engineer_tag[],
  phone_number TEXT,
  department TEXT DEFAULT 'Technical Operations',
  is_active BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. HELPER FUNCTIONS FOR SECURITY RULES
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS public.avon_role AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid() AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_workshop_manager()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_active = true AND role = 'Workshop Manager'::public.avon_role
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin_officer()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_active = true AND role IN ('Workshop Manager'::public.avon_role, 'Documentation Officer'::public.avon_role)
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 6. SUPABASE RLS POLICIES FOR USER_PROFILES

-- Policy A: All authenticated active users can view employee directory
CREATE POLICY "Allow authenticated users to view profiles"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (is_active = true OR public.is_workshop_manager());

-- Policy B: Only Workshop Manager can insert new employee profiles
CREATE POLICY "Allow Workshop Manager to insert profiles"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workshop_manager());

-- Policy C: Users can update their own phone/avatar, OR Workshop Manager can update role/tags/status
CREATE POLICY "Allow profile updates"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_workshop_manager())
  WITH CHECK (auth.uid() = id OR public.is_workshop_manager());

-- Policy D: Only Workshop Manager can delete employee profiles
CREATE POLICY "Allow Workshop Manager to delete profiles"
  ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING (public.is_workshop_manager());

-- 7. TRIGGER TO AUTO-CREATE PROFILE ON SUPABASE AUTH REGISTER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role, department)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.avon_role, 'Technician'::public.avon_role),
    COALESCE(NEW.raw_user_meta_data->>'department', 'Field Technical Service')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;

export const NEXTJS_SERVER_ACTIONS_CODE = `// ============================================================================
// File: src/actions/auth.ts & src/actions/users.ts
// Next.js 15 App Router Server Actions with Supabase SSR
// ============================================================================

'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { AVONRoleV4, AVONTagV4 } from '@/types/user';

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Or ANON_KEY for standard requests
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component read-only cookie handling
          }
        },
      },
    }
  );
}

// ----------------------------------------------------------------------------
// AUTHENTICATION SERVER ACTIONS
// ----------------------------------------------------------------------------

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await getSupabase();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}

export async function logoutAction() {
  const supabase = await getSupabase();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function forgotPasswordAction(email: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: \`\${process.env.NEXT_PUBLIC_APP_URL}/reset-password\`,
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function changePasswordAction(newPassword: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ----------------------------------------------------------------------------
// USER MANAGEMENT CRUD SERVER ACTIONS
// ----------------------------------------------------------------------------

export async function createUserAction(formData: {
  email: string;
  full_name: string;
  role: AVONRoleV4;
  engineer_tags: AVONTagV4[];
  phone_number: string;
  department: string;
}) {
  const supabase = await getSupabase();

  // 1. Check current user permissions
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  // 2. Create user in Supabase Auth (using admin auth client)
  const tempPassword = "AVON_" + Math.random().toString(36).slice(-8) + "!";
  const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      full_name: formData.full_name,
      role: formData.role,
      department: formData.department
    }
  });

  if (authErr) return { success: false, error: authErr.message };

  // 3. Update tags and phone in user_profiles table
  const { error: dbErr } = await supabase
    .from('user_profiles')
    .update({
      engineer_tags: formData.engineer_tags,
      phone_number: formData.phone_number
    })
    .eq('id', authUser.user.id);

  if (dbErr) return { success: false, error: dbErr.message };

  revalidatePath('/dashboard/users');
  return { success: true, tempPassword };
}

export async function updateUserRoleAction(userId: string, newRole: AVONRoleV4) {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('user_profiles')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function updateEngineerTagsAction(userId: string, tags: AVONTagV4[]) {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('user_profiles')
    .update({ engineer_tags: tags, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function toggleUserActiveStatusAction(userId: string, currentStatus: boolean) {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('user_profiles')
    .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function deleteUserAction(userId: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/dashboard/users');
  return { success: true };
}
`;

export const NEXTJS_REACT_COMPONENTS_CODE = `// ============================================================================
// File: src/app/(dashboard)/layout.tsx & src/components/users/UserTable.tsx
// Next.js 15 Dashboard Layout & Shadcn UI User Management Components
// ============================================================================

import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UserTableClient from '@/components/users/UserTableClient';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <aside className="w-64 bg-[#003B75] text-white flex flex-col p-4">
        <div className="text-xl font-black mb-8 px-2">AVON ServicePro</div>
        <nav className="space-y-1 flex-1">
          <a href="/dashboard" className="block px-3 py-2 rounded-xl hover:bg-white/10">Dashboard</a>
          <a href="/dashboard/jobs" className="block px-3 py-2 rounded-xl hover:bg-white/10">Jobs</a>
          {profile?.role === 'Workshop Manager' && (
            <a href="/dashboard/users" className="block px-3 py-2 rounded-xl bg-white/15 font-bold">User Directory</a>
          )}
        </nav>
        <div className="border-t border-white/20 pt-4 px-2">
          <div className="text-sm font-bold">{profile?.full_name}</div>
          <div className="text-xs text-blue-200">{profile?.role}</div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

// User Directory Page Component (Server Component fetching initial data)
export async function UsersPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(/* ... */);
  
  const { data: employees } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm">Manage AVON employees, roles, and engineer tags.</p>
        </div>
        <button className="bg-[#0054A6] hover:bg-[#003B75] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md">
          + Add New Employee
        </button>
      </div>
      <UserTableClient initialData={employees || []} />
    </div>
  );
}
`;
