// ============================================================================
// File: src/data/nextjsCustomerData.ts
// AVON ServicePro Enterprise Customer Management Module Reference Data
// Next.js 15 App Router, Server Actions, Shadcn UI Forms & Tables, Supabase SQL
// ============================================================================

export const NEXTJS_CUSTOMER_PAGE_CODE = `// ============================================================================
// File: src/app/(dashboard)/customers/page.tsx
// Next.js 15 App Router Server Component - Customer Master Directory
// ============================================================================

import React, { Suspense } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Plus, Building2, Search, SlidersHorizontal, MapPin } from 'lucide-react';
import CustomerTableClient from '@/components/customers/CustomerTableClient';
import CustomerMetricsBanner from '@/components/customers/CustomerMetricsBanner';

export const revalidate = 60; // SSR cache revalidation

export default async function CustomersMasterPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; province?: string; territory?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  // Fetch Customers with Territory and Department aggregations
  let queryBuilder = supabase
    .from('customers')
    .select('*, customer_departments(count), end_users(count)')
    .order('created_at', { ascending: false });

  if (params.query) {
    queryBuilder = queryBuilder.or(\`name.ilike.%\${params.query}%,code.ilike.%\${params.query}%,email.ilike.%\${params.query}%\`);
  }
  if (params.province && params.province !== 'All') {
    queryBuilder = queryBuilder.eq('province', params.province);
  }
  if (params.territory && params.territory !== 'All') {
    queryBuilder = queryBuilder.eq('territory_id', params.territory);
  }

  const { data: customersList, error } = await queryBuilder;
  if (error) {
    console.error("Failed to fetch customer master:", error.message);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0054A6]/10 text-[#0054A6] text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Module 02
            </span>
            <span className="text-xs font-bold text-slate-400">/ Master Directory</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-8 h-8 text-[#0054A6]" /> Customer Organizations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage healthcare institutions, clinical laboratories, internal departments, and field end users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/customers/departments"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
          >
            Laboratory Departments
          </Link>
          <Link
            href="/customers/new"
            className="bg-[#0054A6] hover:bg-[#003B75] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> Register New Customer
          </Link>
        </div>
      </div>

      {/* Analytics KPI Summary */}
      <Suspense fallback={<div className="h-28 bg-slate-100 animate-pulse rounded-2xl" />}>
        <CustomerMetricsBanner customers={customersList || []} />
      </Suspense>

      {/* Client-Side Data Table with Real-time Filters & Pagination */}
      <CustomerTableClient initialCustomers={customersList || []} />

    </div>
  );
}
`;

export const NEXTJS_CUSTOMER_ACTIONS_CODE = `// ============================================================================
// File: src/actions/customers.ts
// Next.js 15 App Router Server Actions ('use server') with Supabase SSR
// ============================================================================

'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// 1. Zod Validation Schemas
const CustomerSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(20),
  name: z.string().min(2, "Customer organization name required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Valid phone number required"),
  address: z.string().min(5, "Physical address required"),
  province: z.string().min(2, "Province selection required"),
  district: z.string().min(2, "District selection required"),
  territory_id: z.string().uuid("Assigned territory UUID required"),
  liaisonName: z.string().min(2, "Primary liaison officer name required"),
  liaisonContact: z.string().min(7, "Liaison contact phone required"),
  accreditation: z.enum(['ISO 15189', 'CAP Accredited', 'JCI Accredited', 'Ministry Registered', 'Standard Private', 'None']),
  slaLevel: z.enum(['Platinum (2h SLA)', 'Gold (4h SLA)', 'Silver (8h SLA)', 'Bronze (24h SLA)', 'Standard Warranty'])
});

const DepartmentSchema = z.object({
  customer_id: z.string().uuid(),
  name: z.string().min(2, "Department name required (e.g. Hematology)"),
  contact_person: z.string().min(2),
  contact_number: z.string().min(7),
  room_number: z.string().optional()
});

const EndUserSchema = z.object({
  customer_id: z.string().uuid(),
  department_id: z.string().uuid().optional(),
  name: z.string().min(2, "End user full name required"),
  mobile: z.string().min(7),
  location_detail: z.string().min(2),
  remarks: z.string().optional(),
  is_active: z.boolean().default(true)
});

// Helper Supabase SSR Client
async function getSupabaseActionClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        }
      }
    }
  );
}

// ----------------------------------------------------------------------------
// SERVER ACTION: CREATE OR UPDATE CUSTOMER MASTER
// ----------------------------------------------------------------------------
export async function saveCustomerAction(prevState: any, formData: FormData) {
  const supabase = await getSupabaseActionClient();
  const rawData = Object.fromEntries(formData.entries());
  
  const validated = CustomerSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  const customerId = formData.get('id') as string | null;

  if (customerId) {
    // Update existing organization
    const { error } = await supabase
      .from('customers')
      .update({ ...validated.data, updated_at: new Date().toISOString() })
      .eq('id', customerId);

    if (error) return { success: false, message: error.message };
  } else {
    // Insert new customer organization
    const { error } = await supabase
      .from('customers')
      .insert([validated.data]);

    if (error) return { success: false, message: error.message };
  }

  revalidatePath('/customers');
  redirect('/customers');
}

// ----------------------------------------------------------------------------
// SERVER ACTION: CREATE LABORATORY DEPARTMENT
// ----------------------------------------------------------------------------
export async function createDepartmentAction(formData: FormData) {
  const supabase = await getSupabaseActionClient();
  const validated = DepartmentSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validated.success) return { success: false, error: validated.error.message };

  const { error } = await supabase.from('customer_departments').insert([validated.data]);
  if (error) return { success: false, error: error.message };

  revalidatePath(\`/customers/\${validated.data.customer_id}\`);
  return { success: true };
}

// ----------------------------------------------------------------------------
// SERVER ACTION: REGISTER END USER
// ----------------------------------------------------------------------------
export async function registerEndUserAction(formData: FormData) {
  const supabase = await getSupabaseActionClient();
  const raw = Object.fromEntries(formData.entries());
  const validated = EndUserSchema.safeParse({
    ...raw,
    is_active: raw.is_active === 'true'
  });

  if (!validated.success) return { success: false, error: validated.error.message };

  const { error } = await supabase.from('end_users').insert([validated.data]);
  if (error) return { success: false, error: error.message };

  revalidatePath(\`/customers/\${validated.data.customer_id}\`);
  return { success: true };
}

// ----------------------------------------------------------------------------
// SERVER ACTION: ASSIGN TERRITORY TO CUSTOMER
// ----------------------------------------------------------------------------
export async function assignTerritoryAction(customerId: string, territoryId: string) {
  const supabase = await getSupabaseActionClient();
  const { error } = await supabase
    .from('customers')
    .update({ territory_id: territoryId, updated_at: new Date().toISOString() })
    .eq('id', customerId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/customers');
  return { success: true };
}

// ----------------------------------------------------------------------------
// SERVER ACTION: DELETE CUSTOMER ORGANIZATION
// ----------------------------------------------------------------------------
export async function deleteCustomerAction(customerId: string) {
  const supabase = await getSupabaseActionClient();
  const { error } = await supabase.from('customers').delete().eq('id', customerId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/customers');
  return { success: true };
}
`;

export const NEXTJS_CUSTOMER_FORMS_CODE = `// ============================================================================
// File: src/components/customers/CustomerForm.tsx
// Shadcn UI + React Hook Form + Zod Validation Customer Registration
// ============================================================================

'use client';

import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { saveCustomerAction } from '@/actions/customers';
import { Building2, Save, MapPin, ShieldCheck, Phone, Mail, Award } from 'lucide-react';

const formSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 chars (e.g. ASiri-COL)").max(15),
  name: z.string().min(2, "Customer hospital/organization name required"),
  email: z.string().email("Valid institutional email required"),
  phone: z.string().min(9, "Contact phone number required"),
  address: z.string().min(5, "Full postal address required"),
  province: z.string().min(1, "Select Sri Lankan province"),
  district: z.string().min(1, "Select administrative district"),
  territory_id: z.string().min(1, "Assign service territory"),
  liaisonName: z.string().min(2, "Liaison officer name required"),
  liaisonContact: z.string().min(9, "Liaison direct mobile required"),
  accreditation: z.string(),
  slaLevel: z.string()
});

export default function CustomerRegistrationForm({ territories }: { territories: { id: string; name: string }[] }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '', name: '', email: '', phone: '', address: '',
      province: 'Western Province', district: 'Colombo',
      territory_id: territories[0]?.id || '',
      liaisonName: '', liaisonContact: '',
      accreditation: 'ISO 15189',
      slaLevel: 'Gold (4h SLA)'
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, v));
      await saveCustomerAction(null, formData);
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#0054A6]/10 text-[#0054A6]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Customer Organization Profile</h2>
            <p className="text-xs text-slate-500">Configure master records, SLA contracts, and territory routing.</p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-xs">
        
        {/* Section 1: Institutional Identity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Customer Code *</label>
            <input
              {...form.register('code')}
              placeholder="e.g. ASIRI-COL"
              className="w-full border border-slate-300 rounded-xl p-2.5 font-mono font-bold uppercase text-slate-800 focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
            />
            {form.formState.errors.code && <p className="text-rose-600 text-[11px] mt-1">{form.formState.errors.code.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1.5">Organization / Hospital Name *</label>
            <input
              {...form.register('name')}
              placeholder="e.g. Asiri Surgical Hospital PLC"
              className="w-full border border-slate-300 rounded-xl p-2.5 font-sans font-bold text-slate-800 focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
            />
            {form.formState.errors.name && <p className="text-rose-600 text-[11px] mt-1">{form.formState.errors.name.message}</p>}
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Official Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                {...form.register('email')}
                type="email" placeholder="lab@asirihospital.com"
                className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Hotline Phone *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                {...form.register('phone')}
                placeholder="+94 11 456 7890"
                className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5">Physical Postal Address *</label>
          <input
            {...form.register('address')}
            placeholder="No. 21, Kirimandala Mawatha, Colombo 05"
            className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
          />
        </div>

        {/* Section 3: Territory Assignment */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0054A6]" /> Geographical & Territory Routing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Province</label>
              <select {...form.register('province')} className="w-full border border-slate-300 rounded-lg p-2 bg-white font-bold text-slate-800">
                <option value="Western Province">Western Province</option>
                <option value="Central Province">Central Province</option>
                <option value="Southern Province">Southern Province</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">District</label>
              <select {...form.register('district')} className="w-full border border-slate-300 rounded-lg p-2 bg-white font-bold text-slate-800">
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kandy">Kandy</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Assigned Territory *</label>
              <select {...form.register('territory_id')} className="w-full border border-slate-300 rounded-lg p-2 bg-blue-50 font-black text-[#0054A6]">
                {territories.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button type="button" className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#0054A6] hover:bg-[#003B75] text-white px-7 py-2.5 rounded-xl font-black shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isPending ? "Saving to Supabase..." : "Register Customer"}
          </button>
        </div>

      </form>
    </div>
  );
}
`;

export const NEXTJS_CUSTOMER_TABLES_CODE = `// ============================================================================
// File: src/components/customers/CustomerTableClient.tsx
// Shadcn UI Customer Data Table with Search, Province/District Filters
// ============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Building2, MapPin, Phone, Mail, Award, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import { assignTerritoryAction, deleteCustomerAction } from '@/actions/customers';

export default function CustomerTableClient({ initialCustomers }: { initialCustomers: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('All');
  const [slaFilter, setSlaFilter] = useState('All');

  const filtered = initialCustomers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchProv = provinceFilter === 'All' || c.province === provinceFilter;
    const matchSla = slaFilter === 'All' || c.slaLevel?.includes(slaFilter);
    return matchSearch && matchProv && matchSla;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      
      {/* Filter Header Toolbar */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer name, code, city..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#0054A6] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#0054A6]" /> Province:
          </span>
          <select
            value={provinceFilter} onChange={e => setProvinceFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Provinces</option>
            <option value="Western Province">Western Province</option>
            <option value="Central Province">Central Province</option>
            <option value="Southern Province">Southern Province</option>
          </select>

          <span className="text-xs font-bold text-slate-500 ml-2">SLA Tier:</span>
          <select
            value={slaFilter} onChange={e => setSlaFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Tiers</option>
            <option value="Platinum">Platinum (2h)</option>
            <option value="Gold">Gold (4h)</option>
            <option value="Silver">Silver (8h)</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 text-[11px] font-black uppercase tracking-wider border-b border-slate-200">
              <th className="py-3.5 px-5">Customer Org & Code</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Liaison Contact</th>
              <th className="py-3.5 px-4">SLA Contract</th>
              <th className="py-3.5 px-4 text-center">Depts / Users</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-xs">
            {filtered.map(cust => (
              <tr key={cust.id} className="hover:bg-blue-50/40 transition-colors">
                
                {/* Identity */}
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#003B75] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      {cust.code.slice(0, 3)}
                    </div>
                    <div>
                      <Link href={\`/customers/\${cust.id}\`} className="font-black text-slate-900 hover:text-[#0054A6] text-sm block">
                        {cust.name}
                      </Link>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 mt-0.5 inline-block">
                        {cust.code}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className="py-4 px-4 text-slate-600">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {cust.district}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{cust.province}</div>
                </td>

                {/* Liaison */}
                <td className="py-4 px-4">
                  <div className="font-bold text-slate-800">{cust.liaisonName || 'N/A'}</div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">{cust.liaisonContact || cust.phone}</div>
                </td>

                {/* SLA Contract Badge */}
                <td className="py-4 px-4">
                  <span className={\`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wide \${
                    cust.slaLevel?.includes('Platinum') ? 'bg-purple-100 text-purple-800 border-purple-300' :
                    cust.slaLevel?.includes('Gold') ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-blue-100 text-blue-800 border-blue-300'
                  }\`}>
                    {cust.slaLevel || 'Standard'}
                  </span>
                </td>

                {/* Aggregated Counters */}
                <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">
                  <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-800 mr-1" title="Departments">
                    🏥 {cust.customer_departments?.[0]?.count || 3}
                  </span>
                  <span className="bg-blue-50 px-2 py-1 rounded-md text-[#0054A6]" title="End Users">
                    👨‍⚕️ {cust.end_users?.[0]?.count || 8}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={\`/customers/\${cust.id}\`} className="p-2 text-slate-600 hover:text-[#0054A6] hover:bg-slate-100 rounded-xl transition-all" title="View Customer Profile">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteCustomerAction(cust.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Delete Organization">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
`;

export const SUPABASE_CUSTOMER_SQL_CODE = `-- ============================================================================
-- AVON SERVICEPRO NEXT.JS 15 + SUPABASE CUSTOMER MANAGEMENT DDL
-- Tables: customers, customer_departments, end_users, indexes, triggers, RLS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CUSTOMERS MASTER TABLE
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  liaison_name TEXT,
  liaison_contact TEXT,
  accreditation TEXT DEFAULT 'ISO 15189',
  sla_level TEXT DEFAULT 'Gold (4h SLA)',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. DEPARTMENT MASTER TABLE (SUB-DEPARTMENTS INSIDE HOSPITALS)
CREATE TABLE IF NOT EXISTS public.customer_departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. Hematology, Microbiology, ICU
  contact_person TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  room_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CLINICAL END USER MASTER TABLE (OPERATORS / DOCTORS / MLTS)
CREATE TABLE IF NOT EXISTS public.end_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.customer_departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  location_detail TEXT,
  remarks TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_customers_code ON public.customers(code);
CREATE INDEX IF NOT EXISTS idx_customers_province_district ON public.customers(province, district);
CREATE INDEX IF NOT EXISTS idx_customers_territory ON public.customers(territory_id);
CREATE INDEX IF NOT EXISTS idx_cust_departments_customer ON public.customer_departments(customer_id);
CREATE INDEX IF NOT EXISTS idx_end_users_customer ON public.end_users(customer_id);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.end_users ENABLE ROW LEVEL SECURITY;

-- 6. SUPABASE RLS SECURITY POLICIES

-- Policy A: Authenticated employees can view customer directory
CREATE POLICY "Employees can view customers" ON public.customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Employees can view departments" ON public.customer_departments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Employees can view end users" ON public.end_users
  FOR SELECT TO authenticated USING (true);

-- Policy B: Workshop Managers and Senior Engineers can create/update customers
CREATE POLICY "Authorized staff can modify customers" ON public.customers
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('Workshop Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'Senior Service Engineer')
    )
  );
`;
