// ============================================================================
// File: src/data/nextjsInstrumentData.ts
// AVON ServicePro Enterprise Instrument Registry Module Reference Data
// Next.js 15 App Router, Server Actions, Shadcn UI Forms & Tables, Supabase SQL
// ============================================================================

export const NEXTJS_INSTRUMENT_PAGE_CODE = `// ============================================================================
// File: src/app/(dashboard)/instruments/page.tsx
// Next.js 15 App Router Server Component - Instrument Fleet Registry
// ============================================================================

import React, { Suspense } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Plus, Microscope, Search, SlidersHorizontal, ShieldCheck, Wrench } from 'lucide-react';
import InstrumentTableClient from '@/components/instruments/InstrumentTableClient';
import InstrumentMetricsBanner from '@/components/instruments/InstrumentMetricsBanner';

export const revalidate = 60; // SSR cache revalidation

export default async function InstrumentsRegistryPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; brand?: string; customer?: string; status?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  // Fetch Instruments with Customer, Department, Engineer relations
  let queryBuilder = supabase
    .from('instruments')
    .select('*, customers(name, code), customer_departments(name), end_users(name), service_history(count), repair_history(count), calibration_history(count)')
    .order('created_at', { ascending: false });

  if (params.query) {
    queryBuilder = queryBuilder.or(\`name.ilike.%\${params.query}%,serial_number.ilike.%\${params.query}%,invoice_number.ilike.%\${params.query}%,model.ilike.%\${params.query}%\`);
  }
  if (params.brand && params.brand !== 'ALL') {
    queryBuilder = queryBuilder.eq('brand', params.brand);
  }
  if (params.status && params.status !== 'ALL') {
    queryBuilder = queryBuilder.eq('status', params.status);
  }

  const { data: instrumentsList, error } = await queryBuilder;
  if (error) {
    console.error("Failed to fetch instrument registry:", error.message);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0054A6]/10 text-[#0054A6] text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Module 03
            </span>
            <span className="text-xs font-bold text-slate-400">/ Fleet Ledger</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Microscope className="w-8 h-8 text-[#0054A6]" /> Clinical Instrument Registry
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Comprehensive lifecycle ledger recording invoices, serial numbers, warranties, service intervals, and metrology logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/instruments/new"
            className="bg-[#0054A6] hover:bg-[#003B75] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> Provision Instrument
          </Link>
        </div>
      </div>

      {/* Fleet KPIs */}
      <Suspense fallback={<div className="h-28 bg-slate-100 animate-pulse rounded-2xl" />}>
        <InstrumentMetricsBanner instruments={instrumentsList || []} />
      </Suspense>

      {/* Client Table with Filters & Pagination */}
      <InstrumentTableClient initialInstruments={instrumentsList || []} />

    </div>
  );
}
`;

export const NEXTJS_INSTRUMENT_ACTIONS_CODE = `// ============================================================================
// File: src/actions/instruments.ts
// Next.js 15 App Router Server Actions ('use server') with Supabase SSR
// ============================================================================

'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Zod Schema covering all requested fields
const InstrumentRegistrySchema = z.object({
  invoice_number: z.string().min(3, "Invoice number required (e.g. INV-AV-10940)"),
  invoice_value: z.number().positive("Invoice value must be positive LKR"),
  customer_id: z.string().uuid("Customer selection required"),
  department_id: z.string().uuid("Department required"),
  end_user_id: z.string().uuid("Assigned clinical end user required"),
  brand: z.enum(['SHIMADZU', 'SYSMEX', 'THERMO_FISHER', 'AGILENT', 'BECKMAN_COULTER', 'ROCHE', 'ABBOTT', 'MINDRAY', 'HORIBA', 'OTHER']),
  model: z.string().min(2, "Model number required (e.g. LC-20AD Prominence)"),
  serial_number: z.string().min(3, "Unique manufacturer serial number required"),
  delivery_date: z.string(),
  installation_date: z.string(),
  warranty_period_months: z.number().int().min(0).max(120),
  service_interval_months: z.number().int().min(1).max(36),
  territory_id: z.string().uuid("Service territory routing required"),
  area_engineer_id: z.string().uuid("Assigned Area Biomedical Engineer required"),
  status: z.enum(['OPERATIONAL', 'MAINTENANCE_DUE', 'BREAKDOWN', 'CALIBRATION_EXPIRED', 'DECOMMISSIONED']),
  amc_type: z.enum(['Comprehensive AMC', 'Labor Only AMC', 'On-Call Warranty', 'None'])
});

const ServiceRecordSchema = z.object({
  instrument_id: z.string().uuid(),
  service_date: z.string(),
  engineer_id: z.string().uuid(),
  service_type: z.enum(['Preventive Maintenance (PM)', 'Emergency Breakdown', 'Installation & IQ/OQ']),
  findings: z.string().min(5),
  parts_replaced: z.string().optional(),
  next_service_due: z.string()
});

const RepairRecordSchema = z.object({
  instrument_id: z.string().uuid(),
  breakdown_date: z.string(),
  repair_date: z.string(),
  error_codes: z.string().optional(),
  root_cause: z.string().min(5),
  resolution_details: z.string().min(5),
  downtime_hours: z.number().min(0)
});

const CalibrationRecordSchema = z.object({
  instrument_id: z.string().uuid(),
  calibration_date: z.string(),
  certificate_number: z.string().min(3),
  optical_drift_percent: z.number(),
  status: z.enum(['PASS', 'FAIL', 'CONDITIONAL']),
  valid_until_date: z.string()
});

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
// SERVER ACTION: REGISTER OR UPDATE INSTRUMENT
// ----------------------------------------------------------------------------
export async function saveInstrumentAction(prevState: any, formData: FormData) {
  const supabase = await getSupabaseActionClient();
  const raw = Object.fromEntries(formData.entries());
  
  const parsed = InstrumentRegistrySchema.safeParse({
    ...raw,
    invoice_value: parseFloat(raw.invoice_value as string),
    warranty_period_months: parseInt(raw.warranty_period_months as string, 10),
    service_interval_months: parseInt(raw.service_interval_months as string, 10)
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const instId = formData.get('id') as string | null;

  if (instId) {
    const { error } = await supabase.from('instruments').update({ ...parsed.data, updated_at: new Date().toISOString() }).eq('id', instId);
    if (error) return { success: false, message: error.message };
  } else {
    const { error } = await supabase.from('instruments').insert([parsed.data]);
    if (error) return { success: false, message: error.message };
  }

  revalidatePath('/instruments');
  redirect('/instruments');
}

// ----------------------------------------------------------------------------
// SERVER ACTION: LOG PREVENTIVE SERVICE HISTORY
// ----------------------------------------------------------------------------
export async function logServiceAction(formData: FormData) {
  const supabase = await getSupabaseActionClient();
  const validated = ServiceRecordSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) return { success: false, error: validated.error.message };

  const { error } = await supabase.from('service_history').insert([validated.data]);
  if (error) return { success: false, error: error.message };

  revalidatePath(\`/instruments/\${validated.data.instrument_id}\`);
  return { success: true };
}

// ----------------------------------------------------------------------------
// SERVER ACTION: LOG REPAIR HISTORY
// ----------------------------------------------------------------------------
export async function logRepairAction(formData: FormData) {
  const supabase = await getSupabaseActionClient();
  const raw = Object.fromEntries(formData.entries());
  const validated = RepairRecordSchema.safeParse({
    ...raw,
    downtime_hours: parseFloat(raw.downtime_hours as string)
  });
  if (!validated.success) return { success: false, error: validated.error.message };

  const { error } = await supabase.from('repair_history').insert([validated.data]);
  if (error) return { success: false, error: error.message };

  revalidatePath(\`/instruments/\${validated.data.instrument_id}\`);
  return { success: true };
}

// ----------------------------------------------------------------------------
// SERVER ACTION: LOG CALIBRATION CERTIFICATE
// ----------------------------------------------------------------------------
export async function logCalibrationAction(formData: FormData) {
  const supabase = await getSupabaseActionClient();
  const raw = Object.fromEntries(formData.entries());
  const validated = CalibrationRecordSchema.safeParse({
    ...raw,
    optical_drift_percent: parseFloat(raw.optical_drift_percent as string)
  });
  if (!validated.success) return { success: false, error: validated.error.message };

  const { error } = await supabase.from('calibration_history').insert([validated.data]);
  if (error) return { success: false, error: error.message };

  revalidatePath(\`/instruments/\${validated.data.instrument_id}\`);
  return { success: true };
}

// ----------------------------------------------------------------------------
// SERVER ACTION: DECOMMISSION INSTRUMENT
// ----------------------------------------------------------------------------
export async function decommissionInstrumentAction(id: string) {
  const supabase = await getSupabaseActionClient();
  const { error } = await supabase.from('instruments').update({ status: 'DECOMMISSIONED' }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/instruments');
  return { success: true };
}
`;

export const NEXTJS_INSTRUMENT_FORMS_CODE = `// ============================================================================
// File: src/components/instruments/InstrumentForm.tsx
// Shadcn UI + React Hook Form + Zod Instrument Fleet Provisioning Form
// ============================================================================

'use client';

import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { saveInstrumentAction } from '@/actions/instruments';
import { Microscope, Save, DollarSign, Calendar, MapPin, UserCheck, ShieldCheck } from 'lucide-react';

const formSchema = z.object({
  invoice_number: z.string().min(3, "Invoice number required"),
  invoice_value: z.string().min(1, "Invoice value required"),
  customer_id: z.string().min(1, "Customer required"),
  department_id: z.string().min(1, "Department required"),
  end_user_id: z.string().min(1, "Clinical end user required"),
  brand: z.string(),
  model: z.string().min(2, "Model required"),
  serial_number: z.string().min(3, "Serial number required"),
  delivery_date: z.string(),
  installation_date: z.string(),
  warranty_period_months: z.string(),
  service_interval_months: z.string(),
  territory_id: z.string(),
  area_engineer_id: z.string(),
  status: z.string(),
  amc_type: z.string()
});

export default function InstrumentProvisioningForm({ customers, engineers, territories }: any) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_number: 'INV-AV-10950',
      invoice_value: '3500000',
      customer_id: customers[0]?.id || '',
      department_id: '', end_user_id: '',
      brand: 'SHIMADZU', model: 'LC-20AD Prominence HPLC',
      serial_number: 'SN-SH-' + Math.floor(100000 + Math.random()*900000),
      delivery_date: new Date().toISOString().split('T')[0],
      installation_date: new Date().toISOString().split('T')[0],
      warranty_period_months: '12',
      service_interval_months: '6',
      territory_id: territories[0]?.id || '',
      area_engineer_id: engineers[0]?.id || '',
      status: 'OPERATIONAL', amc_type: 'Comprehensive AMC'
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, v));
      await saveInstrumentAction(null, formData);
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#0054A6]/10 text-[#0054A6]">
            <Microscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Instrument Master Specification</h2>
            <p className="text-xs text-slate-500">Record commercial invoices, metrology specs, and SLA territory routing.</p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-xs">
        
        {/* Commercial & Identity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Invoice Number *</label>
            <input {...form.register('invoice_number')} className="w-full border p-2.5 rounded-xl font-mono uppercase font-bold text-slate-800" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Invoice Value (LKR) *</label>
            <input {...form.register('invoice_value')} type="number" className="w-full border p-2.5 rounded-xl font-mono font-bold text-[#0054A6]" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Serial Number *</label>
            <input {...form.register('serial_number')} className="w-full border p-2.5 rounded-xl font-mono font-bold text-slate-800 bg-slate-50" />
          </div>
        </div>

        {/* Hardware Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Brand *</label>
            <select {...form.register('brand')} className="w-full border p-2.5 rounded-xl font-bold bg-white text-slate-800">
              {['SHIMADZU', 'SYSMEX', 'THERMO_FISHER', 'AGILENT', 'ROCHE', 'ABBOTT', 'MINDRAY'].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Model Specification *</label>
            <input {...form.register('model')} placeholder="e.g. Prominence HPLC" className="w-full border p-2.5 rounded-xl font-bold text-slate-800" />
          </div>
        </div>

        {/* Client Hierarchy */}
        <div className="bg-slate-50 p-4 rounded-xl border grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Customer Organization *</label>
            <select {...form.register('customer_id')} className="w-full border p-2 rounded-lg font-bold">
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Department *</label>
            <input {...form.register('department_id')} placeholder="Hematology / QC" className="w-full border p-2 rounded-lg font-bold" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">End User Name *</label>
            <input {...form.register('end_user_id')} placeholder="Dr. Keshara Wijewardene" className="w-full border p-2 rounded-lg font-bold" />
          </div>
        </div>

        {/* Lifecycle Dates & SLA Routing */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Delivery Date</label>
            <input {...form.register('delivery_date')} type="date" className="w-full border p-2 rounded-lg font-bold" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Installation Date</label>
            <input {...form.register('installation_date')} type="date" className="w-full border p-2 rounded-lg font-bold" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Warranty (Months)</label>
            <input {...form.register('warranty_period_months')} type="number" className="w-full border p-2 rounded-lg font-bold text-emerald-700 font-mono" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Service Interval (Mo)</label>
            <input {...form.register('service_interval_months')} type="number" className="w-full border p-2 rounded-lg font-bold text-[#0054A6] font-mono" />
          </div>
        </div>

        {/* Routing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Territory *</label>
            <select {...form.register('territory_id')} className="w-full border p-2 rounded-lg font-bold text-[#0054A6]">
              {territories.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Area Engineer *</label>
            <select {...form.register('area_engineer_id')} className="w-full border p-2 rounded-lg font-bold text-slate-800">
              {engineers.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" className="px-5 py-2.5 rounded-xl border font-bold text-slate-600">Cancel</button>
          <button type="submit" disabled={isPending} className="bg-[#0054A6] text-white px-7 py-2.5 rounded-xl font-extrabold shadow-md flex items-center gap-2 cursor-pointer">
            <Save className="w-4 h-4" /> {isPending ? "Registering..." : "Provision Fleet Asset"}
          </button>
        </div>
      </form>
    </div>
  );
}
`;

export const NEXTJS_INSTRUMENT_TABLES_CODE = `// ============================================================================
// File: src/components/instruments/InstrumentTableClient.tsx
// Shadcn UI Interactive Data Table with Brand, Customer, Status Filters
// ============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Microscope, Eye, Wrench, ShieldAlert, BadgeCheck } from 'lucide-react';
import { decommissionInstrumentAction } from '@/actions/instruments';

export default function InstrumentTableClient({ initialInstruments }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = initialInstruments.filter((inst: any) => {
    const matchSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inst.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inst.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBrand = brandFilter === 'ALL' || inst.brand === brandFilter;
    const matchStatus = statusFilter === 'ALL' || inst.status === statusFilter;
    return matchSearch && matchBrand && matchStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      
      {/* Filters Toolbar */}
      <div className="p-5 border-b bg-slate-50/80 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Search serial SN, invoice, model..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full border pl-10 pr-4 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0054A6]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Brand:</span>
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="border p-1.5 px-3 rounded-lg text-xs font-bold">
            <option value="ALL">All Brands</option>
            {['SHIMADZU', 'SYSMEX', 'THERMO_FISHER', 'ROCHE', 'ABBOTT'].map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <span className="text-xs font-bold text-slate-500 ml-2">Status:</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border p-1.5 px-3 rounded-lg text-xs font-bold">
            <option value="ALL">All Statuses</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="MAINTENANCE_DUE">Maintenance Due</option>
            <option value="BREAKDOWN">Breakdown</option>
          </select>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-[11px] font-black uppercase tracking-wider border-b">
              <th className="py-3.5 px-5">Instrument Fleet & Serial SN</th>
              <th className="py-3.5 px-4">Customer Org / Dept</th>
              <th className="py-3.5 px-4">Commercial Invoice</th>
              <th className="py-3.5 px-4">Area Engineer & Territory</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs">
            {filtered.map((inst: any) => (
              <tr key={inst.id} className="hover:bg-blue-50/40 transition-colors">
                
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0054A6]/10 text-[#0054A6] flex items-center justify-center font-bold shrink-0">
                      <Microscope className="w-5 h-5" />
                    </div>
                    <div>
                      <Link href={\`/instruments/\${inst.id}\`} className="font-black text-slate-900 hover:text-[#0054A6] text-sm block">
                        {inst.brand} {inst.model}
                      </Link>
                      <span className="text-[11px] font-mono font-bold text-slate-500 block mt-0.5">SN: {inst.serial_number}</span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="font-extrabold text-slate-800">{inst.customer_name || "Asiri Surgical Hospital"}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Dept: {inst.department || "Biochemistry"}</div>
                  <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">User: {inst.end_user || "Dr. Keshara"}</div>
                </td>

                <td className="py-4 px-4 font-mono">
                  <div className="font-bold text-slate-800">{inst.invoice_number || "INV-AV-10940"}</div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-0.5">LKR {(inst.invoice_value || 2500000).toLocaleString()}</div>
                </td>

                <td className="py-4 px-4">
                  <div className="font-bold text-slate-800">{inst.assigned_engineer || "Eng. Suresh Perera"}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Territory: {inst.territory || "Colombo Metro"}</div>
                </td>

                <td className="py-4 px-4 text-center">
                  <span className={\`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider \${
                    inst.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-800' :
                    inst.status === 'BREAKDOWN' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                    'bg-amber-100 text-amber-800'
                  }\`}>
                    ● {inst.status}
                  </span>
                </td>

                <td className="py-4 px-5 text-right">
                  <Link href={\`/instruments/\${inst.id}\`} className="p-2 text-slate-600 hover:text-[#0054A6] rounded-lg inline-block">
                    <Eye className="w-4 h-4" />
                  </Link>
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

export const SUPABASE_INSTRUMENT_SQL_CODE = `-- ============================================================================
-- AVON SERVICEPRO NEXT.JS 15 + SUPABASE INSTRUMENT REGISTRY DDL
-- Tables: instruments, service_history, repair_history, calibration_history
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTRUMENTS MASTER TABLE
CREATE TABLE IF NOT EXISTS public.instruments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL,
  invoice_value NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  end_user TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT NOT NULL UNIQUE,
  delivery_date DATE NOT NULL DEFAULT CURRENT_DATE,
  installation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  warranty_period_months INTEGER NOT NULL DEFAULT 12,
  service_interval_months INTEGER NOT NULL DEFAULT 6,
  territory TEXT NOT NULL,
  area_engineer TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPERATIONAL',
  amc_type TEXT DEFAULT 'Comprehensive AMC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SERVICE HISTORY LEDGER (PREVENTIVE PM CHECKS)
CREATE TABLE IF NOT EXISTS public.service_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,
  engineer_name TEXT NOT NULL,
  service_type TEXT NOT NULL, -- e.g. PM Service, Emergency IQ/OQ
  findings TEXT NOT NULL,
  parts_replaced TEXT,
  next_service_due DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. REPAIR HISTORY LEDGER (BREAKDOWNS & RESOLUTIONS)
CREATE TABLE IF NOT EXISTS public.repair_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  breakdown_date TIMESTAMPTZ NOT NULL,
  repair_date TIMESTAMPTZ NOT NULL,
  error_codes TEXT,
  root_cause TEXT NOT NULL,
  resolution_details TEXT NOT NULL,
  downtime_hours NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CALIBRATION HISTORY LEDGER (METROLOGY & OPTICAL DRIFT)
CREATE TABLE IF NOT EXISTS public.calibration_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  calibration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  certificate_number TEXT NOT NULL UNIQUE,
  optical_drift_percent NUMERIC(5, 3) NOT NULL DEFAULT 0.020,
  status TEXT NOT NULL DEFAULT 'PASS', -- PASS, FAIL, CONDITIONAL
  valid_until DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. INDEXES & PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_instruments_serial ON public.instruments(serial_number);
CREATE INDEX IF NOT EXISTS idx_instruments_customer ON public.instruments(customer_id);
CREATE INDEX IF NOT EXISTS idx_instruments_status ON public.instruments(status);
CREATE INDEX IF NOT EXISTS idx_service_hist_inst ON public.service_history(instrument_id);
CREATE INDEX IF NOT EXISTS idx_repair_hist_inst ON public.repair_history(instrument_id);
CREATE INDEX IF NOT EXISTS idx_calib_hist_inst ON public.calibration_history(instrument_id);

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calibration_history ENABLE ROW LEVEL SECURITY;

-- 7. SECURITY POLICIES
CREATE POLICY "Employees can view instrument fleet" ON public.instruments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Employees can view service logs" ON public.service_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Employees can view repair logs" ON public.repair_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Employees can view calibration logs" ON public.calibration_history FOR SELECT TO authenticated USING (true);

CREATE POLICY "Engineers can log service visits" ON public.service_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Engineers can log repair visits" ON public.repair_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Metrology staff can log calibrations" ON public.calibration_history FOR INSERT TO authenticated WITH CHECK (true);
`;
