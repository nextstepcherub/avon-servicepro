// ============================================================================
// File: src/data/nextjsJobData.ts
// AVON ServicePro Enterprise Job Master Module Reference Data
// Next.js 15 App Router, Server Actions, Shadcn UI Views, Supabase SQL & RLS
// ============================================================================

export const NEXTJS_JOB_PAGE_CODE = `// ============================================================================
// File: src/app/(dashboard)/jobs/page.tsx
// Next.js 15 App Router Server Component - Enterprise Job Master Hub
// ============================================================================

import React, { Suspense } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Plus, Briefcase, Search, Filter, Calendar, Columns, Clock, ShieldAlert } from 'lucide-react';
import JobMasterViewsClient from '@/components/jobs/JobMasterViewsClient';
import JobMetricsHeader from '@/components/jobs/JobMetricsHeader';

export const revalidate = 30; // SSR cache revalidation

export default async function JobMasterRegistryPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; type?: string; status?: string; engineer?: string; query?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  // Fetch Jobs with related customer, department, instrument, engineer, and SLA records
  let queryBuilder = supabase
    .from('jobs')
    .select('*, customers(name, code), instruments(name, model, serial_number), assigned_engineer:user_profiles(name, email, avatar), territory(name), activity_logs:job_activity_logs(count)')
    .order('created_at', { ascending: false });

  if (params.query) {
    queryBuilder = queryBuilder.or(\`job_number.ilike.%\${params.query}%,title.ilike.%\${params.query}%,customer_name.ilike.%\${params.query}%\`);
  }
  if (params.type && params.type !== 'ALL') {
    queryBuilder = queryBuilder.eq('job_type', params.type);
  }
  if (params.status && params.status !== 'ALL') {
    queryBuilder = queryBuilder.eq('status', params.status);
  }
  if (params.engineer && params.engineer !== 'ALL') {
    queryBuilder = queryBuilder.eq('assigned_engineer_id', params.engineer);
  }

  const { data: jobsList, error } = await queryBuilder;
  if (error) {
    console.error("Error fetching jobs ledger:", error.message);
  }

  // Fetch supporting reference data for filters and assignment modals
  const [{ data: engineers }, { data: customers }, { data: instruments }] = await Promise.all([
    supabase.from('user_profiles').select('id, name, role, territory').eq('status', 'ACTIVE'),
    supabase.from('customers').select('id, name, code'),
    supabase.from('instruments').select('id, name, serial_number, customer_id')
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 animate-fade-in">
      
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0054A6]/10 text-[#0054A6] text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Module 04
            </span>
            <span className="text-xs font-bold text-slate-400">/ Operations Command</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-8 h-8 text-[#0054A6]" /> Enterprise Job Master Hub
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Central operational orchestrator for Installation, Warranty Service, Repairs, Workshop Bench, and Calibration dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/jobs/new"
            className="bg-[#0054A6] hover:bg-[#003B75] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Dispatch New Job
          </Link>
        </div>
      </div>

      {/* Operational SLA & Fleet Metrics */}
      <Suspense fallback={<div className="h-28 bg-slate-100 animate-pulse rounded-2xl" />}>
        <JobMetricsHeader jobs={jobsList || []} />
      </Suspense>

      {/* Multi-View Client Hub: Kanban Board, Calendar Grid, Timeline Gantt & Data Table */}
      <JobMasterViewsClient 
        initialJobs={jobsList || []}
        engineers={engineers || []}
        customers={customers || []}
        instruments={instruments || []}
        activeView={params.view || 'kanban'}
      />

    </div>
  );
}
`;

export const NEXTJS_JOB_ACTIONS_CODE = `// ============================================================================
// File: src/actions/jobs.ts
// Next.js 15 App Router Server Actions ('use server') with Supabase SSR
// ============================================================================

'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Zod Validation Schema for Job Master
const JobMasterSchema = z.object({
  job_number: z.string().min(3, "Job number required (e.g. JOB-2026-8840)"),
  job_type: z.enum([
    'INSTALLATION',
    'WARRANTY_SERVICE',
    'NON_WARRANTY_SERVICE',
    'WARRANTY_REPAIR',
    'WORKSHOP_JOB',
    'CALIBRATION_JOB'
  ]),
  title: z.string().min(4, "Descriptive job subject required"),
  customer_id: z.string().uuid("Customer selection required"),
  department: z.string().min(1, "Department required"),
  instrument_id: z.string().uuid("Assigned instrument required"),
  assigned_engineer_id: z.string().uuid("Assigned Field or Bench Engineer required"),
  territory_id: z.string().uuid("Service territory required"),
  priority: z.enum(['CRITICAL_P1', 'HIGH_P2', 'MEDIUM_P3', 'LOW_P4']),
  status: z.enum([
    'PENDING',
    'SCHEDULED',
    'IN_PROGRESS',
    'PENDING_PARTS',
    'QA_CHECK',
    'COMPLETED',
    'CLOSED'
  ]),
  scheduled_start: z.string(),
  scheduled_end: z.string(),
  sla_target_hours: z.number().int().positive(),
  notes: z.string().optional()
});

const ReassignSchema = z.object({
  job_id: z.string().uuid(),
  new_engineer_id: z.string().uuid(),
  reason: z.string().min(5, "Reassignment justification required for SLA audit")
});

const StatusUpdateSchema = z.object({
  job_id: z.string().uuid(),
  new_status: z.enum(['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'PENDING_PARTS', 'QA_CHECK', 'COMPLETED', 'CLOSED']),
  comment: z.string().optional()
});

async function getSupabaseAdminClient() {
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
// SERVER ACTION: CREATE OR UPDATE JOB
// ----------------------------------------------------------------------------
export async function createOrUpdateJobAction(prevState: any, formData: FormData) {
  const supabase = await getSupabaseAdminClient();
  const raw = Object.fromEntries(formData.entries());

  const parsed = JobMasterSchema.safeParse({
    ...raw,
    sla_target_hours: parseInt(raw.sla_target_hours as string, 10)
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const jobId = formData.get('id') as string | null;
  const currentUserEmail = formData.get('current_user_email') as string || 'system@avonservice.com';

  if (jobId) {
    const { error } = await supabase.from('jobs').update({ ...parsed.data, updated_at: new Date().toISOString() }).eq('id', jobId);
    if (error) return { success: false, message: error.message };

    // Log activity
    await supabase.from('job_activity_logs').insert([{
      job_id: jobId,
      action: 'UPDATED',
      actor_email: currentUserEmail,
      details: \`Updated job specifications and SLA target (\${parsed.data.sla_target_hours} hrs).\`
    }]);
  } else {
    const { data: inserted, error } = await supabase.from('jobs').insert([parsed.data]).select().single();
    if (error) return { success: false, message: error.message };

    // Log creation
    await supabase.from('job_activity_logs').insert([{
      job_id: inserted.id,
      action: 'CREATED',
      actor_email: currentUserEmail,
      details: \`Dispatched new \${parsed.data.job_type} job: \${parsed.data.title}\`
    }]);

    // Trigger Notification
    await supabase.from('job_notifications').insert([{
      job_id: inserted.id,
      recipient_id: parsed.data.assigned_engineer_id,
      title: 'New Dispatch Assignment',
      message: \`You have been assigned to \${parsed.data.job_number} (\${parsed.data.job_type}) at \${parsed.data.department}.\`,
      type: 'ASSIGNMENT'
    }]);
  }

  revalidatePath('/jobs');
  redirect('/jobs');
}

// ----------------------------------------------------------------------------
// SERVER ACTION: ASSIGN / REASSIGN ENGINEER
// ----------------------------------------------------------------------------
export async function reassignJobAction(formData: FormData) {
  const supabase = await getSupabaseAdminClient();
  const validated = ReassignSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) return { success: false, error: validated.error.message };

  const { job_id, new_engineer_id, reason } = validated.data;
  const actor = formData.get('actor_email') as string || 'dispatcher@avonservice.com';

  // Fetch prior engineer for audit
  const { data: existing } = await supabase.from('jobs').select('assigned_engineer_id, job_number').eq('id', job_id).single();

  const { error } = await supabase.from('jobs').update({
    assigned_engineer_id: new_engineer_id,
    updated_at: new Date().toISOString()
  }).eq('id', job_id);

  if (error) return { success: false, error: error.message };

  // Log Reassignment Activity
  await supabase.from('job_activity_logs').insert([{
    job_id,
    action: 'REASSIGNED',
    actor_email: actor,
    details: \`Reassigned from Engineer #\${existing?.assigned_engineer_id?.slice(0,6)} to #\${new_engineer_id.slice(0,6)}. Reason: \${reason}\`
  }]);

  // Dispatch Notification to New Engineer
  await supabase.from('job_notifications').insert([{
    job_id,
    recipient_id: new_engineer_id,
    title: 'Job Reassignment Alert',
    message: \`Job \${existing?.job_number} has been transferred to your queue. Note: \${reason}\`,
    type: 'ALERT'
  }]);

  revalidatePath('/jobs');
  return { success: true };
}

// ----------------------------------------------------------------------------
// SERVER ACTION: UPDATE WORKFLOW STATUS (KANBAN DRAG OR MODAL)
// ----------------------------------------------------------------------------
export async function updateJobStatusAction(formData: FormData) {
  const supabase = await getSupabaseAdminClient();
  const validated = StatusUpdateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) return { success: false, error: validated.error.message };

  const { job_id, new_status, comment } = validated.data;
  const actor = formData.get('actor_email') as string || 'engineer@avonservice.com';

  const updates: any = { status: new_status, updated_at: new Date().toISOString() };
  if (new_status === 'IN_PROGRESS') updates.actual_start = new Date().toISOString();
  if (new_status === 'COMPLETED' || new_status === 'CLOSED') updates.actual_end = new Date().toISOString();

  const { error } = await supabase.from('jobs').update(updates).eq('id', job_id);
  if (error) return { success: false, error: error.message };

  // Audit trail
  await supabase.from('job_activity_logs').insert([{
    job_id,
    action: 'STATUS_CHANGE',
    actor_email: actor,
    details: \`Workflow status transitioned to \${new_status}. \${comment || ''}\`
  }]);

  revalidatePath('/jobs');
  return { success: true };
}
`;

export const NEXTJS_JOB_FORMS_CODE = `// ============================================================================
// File: src/components/jobs/JobProvisioningForm.tsx
// Shadcn UI + React Hook Form + Zod Enterprise Job Dispatch Form
// ============================================================================

'use client';

import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createOrUpdateJobAction } from '@/actions/jobs';
import { Briefcase, Save, Clock, MapPin, UserCheck, ShieldAlert, Calendar } from 'lucide-react';

const formSchema = z.object({
  job_number: z.string().min(3),
  job_type: z.string(),
  title: z.string().min(4),
  customer_id: z.string().min(1),
  department: z.string().min(1),
  instrument_id: z.string().min(1),
  assigned_engineer_id: z.string().min(1),
  territory_id: z.string().min(1),
  priority: z.string(),
  status: z.string(),
  scheduled_start: z.string(),
  scheduled_end: z.string(),
  sla_target_hours: z.string(),
  notes: z.string().optional()
});

export default function JobProvisioningForm({ customers, instruments, engineers, territories }: any) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_number: 'JOB-2026-' + Math.floor(1000 + Math.random()*9000),
      job_type: 'WARRANTY_SERVICE',
      title: 'Preventive Maintenance & Optical Alignment Check',
      customer_id: customers[0]?.id || '',
      department: 'Biochemistry Lab',
      instrument_id: instruments[0]?.id || '',
      assigned_engineer_id: engineers[0]?.id || '',
      territory_id: territories[0]?.id || '',
      priority: 'HIGH_P2',
      status: 'SCHEDULED',
      scheduled_start: new Date().toISOString().slice(0, 16),
      scheduled_end: new Date(Date.now() + 3600000*4).toISOString().slice(0, 16),
      sla_target_hours: '8',
      notes: 'Ensure clean room gowning protocol before entering lab.'
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, v || ''));
      formData.append('current_user_email', 'dispatcher@avonservice.com');
      await createOrUpdateJobAction(null, formData);
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#0054A6]/10 text-[#0054A6]">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Dispatch Job Master Order</h2>
            <p className="text-xs text-slate-500">Orchestrate field service dispatches, SLA countdown timers, and technician routing.</p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-xs">
        
        {/* Classification & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Job Number *</label>
            <input {...form.register('job_number')} className="w-full border p-2 rounded-lg font-mono font-extrabold bg-white" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Job Type *</label>
            <select {...form.register('job_type')} className="w-full border p-2 rounded-lg font-bold text-[#0054A6]">
              <option value="INSTALLATION">INSTALLATION</option>
              <option value="WARRANTY_SERVICE">WARRANTY_SERVICE</option>
              <option value="NON_WARRANTY_SERVICE">NON_WARRANTY_SERVICE</option>
              <option value="WARRANTY_REPAIR">WARRANTY_REPAIR</option>
              <option value="WORKSHOP_JOB">WORKSHOP_JOB</option>
              <option value="CALIBRATION_JOB">CALIBRATION_JOB</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">SLA Priority *</label>
            <select {...form.register('priority')} className="w-full border p-2 rounded-lg font-bold text-rose-700">
              <option value="CRITICAL_P1">CRITICAL P1 (2h response)</option>
              <option value="HIGH_P2">HIGH P2 (4h response)</option>
              <option value="MEDIUM_P3">MEDIUM P3 (8h response)</option>
              <option value="LOW_P4">LOW P4 (24h response)</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target SLA (Hours) *</label>
            <input {...form.register('sla_target_hours')} type="number" className="w-full border p-2 rounded-lg font-mono font-bold text-emerald-700" />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Job Title / Subject *</label>
          <input {...form.register('title')} placeholder="e.g. Annual Preventive Maintenance & Photometer Calibration" className="w-full border p-2.5 rounded-xl font-bold text-sm text-slate-800" />
        </div>

        {/* Target Asset & Client */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Customer Organization *</label>
            <select {...form.register('customer_id')} className="w-full border p-2.5 rounded-xl font-bold">
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Department *</label>
            <input {...form.register('department')} placeholder="Hematology Lab" className="w-full border p-2.5 rounded-xl font-bold" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Instrument SN *</label>
            <select {...form.register('instrument_id')} className="w-full border p-2.5 rounded-xl font-bold text-[#0054A6]">
              {instruments.map((i: any) => <option key={i.id} value={i.id}>{i.name} (SN: {i.serial_number})</option>)}
            </select>
          </div>
        </div>

        {/* Scheduling & Routing */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Engineer *</label>
            <select {...form.register('assigned_engineer_id')} className="w-full border p-2 rounded-lg font-bold text-slate-800">
              {engineers.map((e: any) => <option key={e.id} value={e.id}>{e.name} ({e.role})</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Service Territory *</label>
            <select {...form.register('territory_id')} className="w-full border p-2 rounded-lg font-bold">
              {territories.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Scheduled Start *</label>
            <input {...form.register('scheduled_start')} type="datetime-local" className="w-full border p-2 rounded-lg font-bold" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Scheduled End *</label>
            <input {...form.register('scheduled_end')} type="datetime-local" className="w-full border p-2 rounded-lg font-bold" />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Special Dispatch Instructions</label>
          <textarea {...form.register('notes')} rows={3} placeholder="Provide access pass instructions, calibration standards requirements..." className="w-full border p-2.5 rounded-xl font-medium" />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" className="px-5 py-2.5 rounded-xl border font-bold text-slate-600">Cancel</button>
          <button type="submit" disabled={isPending} className="bg-[#0054A6] text-white px-7 py-2.5 rounded-xl font-extrabold shadow-md flex items-center gap-2 cursor-pointer">
            <Save className="w-4 h-4" /> {isPending ? "Dispatching..." : "Provision & Notify Engineer"}
          </button>
        </div>
      </form>
    </div>
  );
}
`;

export const NEXTJS_JOB_VIEWS_CODE = `// ============================================================================
// File: src/components/jobs/JobMasterViewsClient.tsx
// Multi-View Hub: Kanban Board, Calendar View, Timeline Gantt & Data Table
// ============================================================================

'use client';

import React, { useState } from 'react';
import { Columns, Calendar, Clock, Table, Search, Filter, CheckCircle2, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';
import { updateJobStatusAction } from '@/actions/jobs';

const WORKFLOW_COLUMNS = [
  { id: 'PENDING', label: 'Queue / Pending', color: 'bg-slate-100 border-slate-300 text-slate-700' },
  { id: 'SCHEDULED', label: 'Scheduled Dispatch', color: 'bg-blue-50 border-blue-300 text-blue-800' },
  { id: 'IN_PROGRESS', label: 'Active Field/Bench', color: 'bg-amber-50 border-amber-300 text-amber-800' },
  { id: 'PENDING_PARTS', label: 'Awaiting Spare Parts', color: 'bg-purple-50 border-purple-300 text-purple-800' },
  { id: 'QA_CHECK', label: 'QA / Metrology Check', color: 'bg-indigo-50 border-indigo-300 text-indigo-800' },
  { id: 'COMPLETED', label: 'Completed & Signoff', color: 'bg-emerald-50 border-emerald-300 text-emerald-800' }
];

export default function JobMasterViewsClient({ initialJobs, engineers }: any) {
  const [activeView, setActiveView] = useState<'kanban' | 'calendar' | 'timeline' | 'table'>('kanban');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredJobs = initialJobs.filter((job: any) => {
    const matchType = typeFilter === 'ALL' || job.job_type === typeFilter;
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) || job.job_number.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* View Switcher & Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full lg:w-auto">
          <button onClick={() => setActiveView('kanban')} className={\`flex-1 lg:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 \${activeView === 'kanban' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600'}\`}>
            <Columns className="w-3.5 h-3.5" /> Kanban Board
          </button>
          <button onClick={() => setActiveView('calendar')} className={\`flex-1 lg:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 \${activeView === 'calendar' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600'}\`}>
            <Calendar className="w-3.5 h-3.5" /> Calendar View
          </button>
          <button onClick={() => setActiveView('timeline')} className={\`flex-1 lg:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 \${activeView === 'timeline' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600'}\`}>
            <Clock className="w-3.5 h-3.5" /> Timeline View
          </button>
          <button onClick={() => setActiveView('table')} className={\`flex-1 lg:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 \${activeView === 'table' ? 'bg-[#0054A6] text-white shadow' : 'text-slate-600'}\`}>
            <Table className="w-3.5 h-3.5" /> Data Ledger
          </button>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border p-2 rounded-xl text-xs font-bold bg-slate-50">
            <option value="ALL">All Job Types</option>
            <option value="INSTALLATION">INSTALLATION</option>
            <option value="WARRANTY_SERVICE">WARRANTY_SERVICE</option>
            <option value="NON_WARRANTY_SERVICE">NON_WARRANTY_SERVICE</option>
            <option value="WARRANTY_REPAIR">WARRANTY_REPAIR</option>
            <option value="WORKSHOP_JOB">WORKSHOP_JOB</option>
            <option value="CALIBRATION_JOB">CALIBRATION_JOB</option>
          </select>

          <input type="text" placeholder="Search job # or title..." value={search} onChange={e => setSearch(e.target.value)} className="border p-2 px-3 rounded-xl text-xs font-bold w-full lg:w-64" />
        </div>
      </div>

      {/* VIEW 1: KANBAN WORKFLOW BOARD */}
      {activeView === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-start overflow-x-auto pb-6">
          {WORKFLOW_COLUMNS.map(col => {
            const colJobs = filteredJobs.filter((j: any) => j.status === col.id);
            return (
              <div key={col.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-3 min-w-[240px] shadow-xs">
                <div className={\`p-2.5 rounded-xl border font-black text-xs flex justify-between items-center mb-3 \${col.color}\`}>
                  <span>{col.label}</span>
                  <span className="bg-white px-2 py-0.5 rounded-full text-[10px] shadow-2xs">{colJobs.length}</span>
                </div>

                <div className="space-y-3 max-h-[640px] overflow-y-auto scrollbar-thin pr-1">
                  {colJobs.map((job: any) => (
                    <div key={job.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-xs space-y-2">
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-mono font-extrabold text-[#0054A6]">{job.job_number}</span>
                        <span className={\`text-[9px] font-black px-1.5 py-0.5 rounded uppercase \${job.priority === 'CRITICAL_P1' ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-slate-100 text-slate-700'}\`}>
                          {job.priority?.split('_')[1] || 'P2'}
                        </span>
                      </div>

                      <div className="font-bold text-slate-800 leading-snug line-clamp-2">{job.title}</div>
                      
                      <div className="bg-slate-50 p-1.5 rounded text-[11px] text-slate-600 font-medium">
                        🏢 {job.customer_name}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-bold">👷 {job.engineer_name || 'Eng. Suresh'}</span>
                        <span className="font-mono text-amber-700 font-bold">⏱️ {job.sla_target_hours}h SLA</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: CALENDAR VIEW */}
      {activeView === 'calendar' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">📅 June 2026 Operational Dispatch Calendar Grid</h3>
          <div className="grid grid-cols-7 gap-3 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <div key={day} className="font-black text-xs text-slate-400 py-2 uppercase bg-slate-50 rounded-lg">{day}</div>)}
            {Array.from({ length: 35 }).map((_, idx) => {
              const dateNum = (idx % 30) + 1;
              const dayJobs = filteredJobs.filter((_, i) => i % 30 === idx % 30);
              return (
                <div key={idx} className="border border-slate-100 p-2 rounded-xl min-h-[100px] text-left relative bg-slate-50/30 hover:bg-white transition-all">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{dateNum}</span>
                  <div className="mt-1 space-y-1">
                    {dayJobs.slice(0, 2).map((job: any, jIdx) => (
                      <div key={jIdx} className="p-1 rounded bg-[#0054A6]/10 text-[#0054A6] text-[10px] font-bold truncate">
                        {job.job_number}: {job.job_type.slice(0, 8)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: TIMELINE VIEW */}
      {activeView === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">⏱️ Chronological Job Execution & SLA Milestones Timeline</h3>
          <div className="space-y-3">
            {filteredJobs.map((job: any) => (
              <div key={job.id} className="flex items-center gap-4 p-3 rounded-xl border bg-slate-50/50">
                <div className="w-48 shrink-0">
                  <span className="font-mono font-extrabold text-xs text-[#0054A6] block">{job.job_number}</span>
                  <span className="text-[11px] font-bold text-slate-700 truncate block">{job.title}</span>
                </div>
                
                {/* Horizontal Gantt Bar */}
                <div className="flex-1 bg-slate-200 h-6 rounded-full relative overflow-hidden flex items-center">
                  <div className={\`h-full rounded-full flex items-center px-3 text-[10px] font-black text-white \${
                    job.status === 'COMPLETED' ? 'bg-emerald-500 w-full' :
                    job.status === 'IN_PROGRESS' ? 'bg-amber-500 w-3/5 animate-pulse' : 'bg-blue-600 w-1/3'
                  }\`}>
                    {job.status} ({job.sla_target_hours}h SLA Target)
                  </div>
                </div>

                <div className="w-36 shrink-0 text-right text-[11px] font-bold text-slate-500">
                  👷 {job.engineer_name || 'Eng. Suresh'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: DATA TABLE LEDGER */}
      {activeView === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 text-[11px] font-black uppercase tracking-wider border-b">
              <tr>
                <th className="p-4">Job Order #</th>
                <th className="p-4">Job Type</th>
                <th className="p-4">Subject & Customer</th>
                <th className="p-4">Assigned Engineer</th>
                <th className="p-4 text-center">Workflow Status</th>
                <th className="p-4 text-right">SLA Target</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredJobs.map((job: any) => (
                <tr key={job.id} className="hover:bg-blue-50/30">
                  <td className="p-4 font-mono font-black text-[#0054A6]">{job.job_number}</td>
                  <td className="p-4 font-bold text-slate-700">{job.job_type}</td>
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900">{job.title}</div>
                    <div className="text-[11px] text-slate-500">🏢 {job.customer_name} ({job.department})</div>
                  </td>
                  <td className="p-4 font-bold text-slate-800">👷 {job.engineer_name || 'Eng. Suresh Perera'}</td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">{job.status}</span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-amber-700">{job.sla_target_hours} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
`;

export const SUPABASE_JOB_SQL_CODE = `-- ============================================================================
-- AVON SERVICEPRO NEXT.JS 15 + SUPABASE JOB MASTER MODULE DDL
-- Tables: jobs, job_assignments, job_activity_logs, job_notifications
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS FOR JOB MASTER
DO $$ BEGIN
  CREATE TYPE job_type_enum AS ENUM (
    'INSTALLATION',
    'WARRANTY_SERVICE',
    'NON_WARRANTY_SERVICE',
    'WARRANTY_REPAIR',
    'WORKSHOP_JOB',
    'CALIBRATION_JOB'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE job_workflow_status AS ENUM (
    'PENDING',
    'SCHEDULED',
    'IN_PROGRESS',
    'PENDING_PARTS',
    'QA_CHECK',
    'COMPLETED',
    'CLOSED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. JOBS MASTER LEDGER
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_number TEXT NOT NULL UNIQUE,
  job_type job_type_enum NOT NULL,
  title TEXT NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  department TEXT NOT NULL,
  instrument_id UUID REFERENCES public.instruments(id) ON DELETE SET NULL,
  instrument_name TEXT,
  serial_number TEXT,
  assigned_engineer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  engineer_name TEXT,
  territory_id UUID,
  territory_name TEXT,
  priority TEXT NOT NULL DEFAULT 'HIGH_P2', -- CRITICAL_P1, HIGH_P2, MEDIUM_P3, LOW_P4
  status job_workflow_status NOT NULL DEFAULT 'PENDING',
  scheduled_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_end TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '4 hours',
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  sla_target_hours INTEGER NOT NULL DEFAULT 8,
  sla_breached BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. JOB ASSIGNMENTS & REASSIGNMENTS AUDIT LOG
CREATE TABLE IF NOT EXISTS public.job_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  engineer_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  assigned_by_email TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reassignment_reason TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 4. JOB ACTIVITY LOGS (TIMELINE & AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS public.job_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- CREATED, ASSIGNED, REASSIGNED, STATUS_CHANGE, COMMENTED, SLA_BREACH
  actor_email TEXT NOT NULL,
  details TEXT NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. JOB DISPATCH NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.job_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- ASSIGNMENT, ALERT, SLA_BREACH, QA_READY
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_jobs_job_number ON public.jobs(job_number);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON public.jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_engineer ON public.jobs(assigned_engineer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON public.jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_job_activity_job ON public.job_activity_logs(job_id);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_notifications ENABLE ROW LEVEL SECURITY;

-- 8. RLS SECURITY POLICIES
CREATE POLICY "Authenticated users can view jobs" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Dispatchers can insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Engineers can update assigned jobs" ON public.jobs FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can view activity logs" ON public.job_activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can log activities" ON public.job_activity_logs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Recipients view their notifications" ON public.job_notifications FOR SELECT TO authenticated USING (auth.uid() = recipient_id OR true);
`;
