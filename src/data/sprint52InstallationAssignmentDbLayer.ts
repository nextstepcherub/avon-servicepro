import { InstallationAssignment, InstallationAssignmentAuditLog, InstallationRequestStatus, InstallationPriority } from '../types';

export const SUPABASE_SPRINT52_ASSIGNMENT_SQL = `-- ==============================================================================
-- SPRINT 5.2 : INSTALLATION ASSIGNMENT & WORKFLOW TRACKING ENGINE
-- SUPABASE POSTGRESQL DDL & RLS POLICIES
-- ==============================================================================

-- 1. Create Enums for Priority and Workflow Statuses
DO $$ BEGIN
    CREATE TYPE installation_priority_enum AS ENUM ('Normal', 'Urgent', 'Critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE installation_workflow_status_enum AS ENUM (
        'Pending Request',
        'Pending Assignment',
        'Assigned',
        'Scheduled',
        'Travelling',
        'On Site',
        'Installation Completed',
        'Report Pending',
        'Documentation Review',
        'Closed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Table: installation_assignments
CREATE TABLE IF NOT EXISTS public.installation_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.installation_requests(id) ON DELETE CASCADE,
    assigned_engineer TEXT NOT NULL,
    assigned_technicians TEXT[] DEFAULT '{}',
    assigned_by TEXT NOT NULL,
    assignment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    target_installation_date DATE NOT NULL,
    priority installation_priority_enum NOT NULL DEFAULT 'Normal',
    sla_days_setting INTEGER NOT NULL DEFAULT 15,
    sla_due_date DATE NOT NULL,
    installation_territory TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_request_assignment UNIQUE(request_id)
);

-- 3. Table: installation_assignment_audit_logs
CREATE TABLE IF NOT EXISTS public.installation_assignment_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.installation_requests(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.installation_assignments(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    from_status TEXT,
    to_status TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    performed_by_role TEXT NOT NULL,
    notes TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.installation_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installation_assignment_audit_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Area Engineers & Workshop Managers have full DML access to assignments
CREATE POLICY "Allow assignment management for authorized roles"
    ON public.installation_assignments
    FOR ALL
    USING (
        auth.jwt() ->> 'role' IN ('Area Engineer', 'Workshop Manager', 'SUPER_ADMIN')
    );

-- All authenticated service roles can read assignments and audit logs
CREATE POLICY "Allow read access for authenticated staff"
    ON public.installation_assignments
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow audit log read access"
    ON public.installation_assignment_audit_logs
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow audit log insertion on workflow progression"
    ON public.installation_assignment_audit_logs
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 6. Indexes for SLA & Status Monitoring
CREATE INDEX IF NOT EXISTS idx_inst_assign_req_id ON public.installation_assignments(request_id);
CREATE INDEX IF NOT EXISTS idx_inst_assign_sla_due ON public.installation_assignments(sla_due_date);
CREATE INDEX IF NOT EXISTS idx_inst_audit_req_id ON public.installation_assignment_audit_logs(request_id);
`;

export const INITIAL_INSTALLATION_ASSIGNMENTS: InstallationAssignment[] = [
  {
    id: 'asgn-1001',
    requestId: 'req-501', // Hospital St. Jude
    assignedEngineer: 'Eng. Marcus Thorne (Lead BioMed)',
    assignedTechnicians: ['Tech. Sarah Jenkins (Optics Specialist)', 'Tech. Dave Miller'],
    assignedBy: 'Workshop Manager (Alex Vance)',
    assignmentDate: '2026-06-20T09:30:00Z',
    targetInstallationDate: '2026-06-26',
    priority: 'Critical',
    slaDaysSetting: 15,
    slaDueDate: '2026-07-03',
    installationTerritory: 'North-East Metro Health District',
    remarks: 'Requires sterile cleanroom entry clearance prior to unboxing.',
    createdAt: '2026-06-20T09:30:00Z',
    updatedAt: '2026-06-22T14:15:00Z'
  },
  {
    id: 'asgn-1002',
    requestId: 'req-502', // Apex Diagnostic Labs
    assignedEngineer: 'Eng. David K. (Field Automation)',
    assignedTechnicians: ['Tech. Robert Chang'],
    assignedBy: 'Area Engineer (Elena Rostova)',
    assignmentDate: '2026-06-21T11:00:00Z',
    targetInstallationDate: '2026-06-28',
    priority: 'Urgent',
    slaDaysSetting: 15,
    slaDueDate: '2026-07-05',
    installationTerritory: 'Central Clinical Corridor',
    remarks: 'Coordinate with Apex Facility IT for HL7 LIS firewall port opening.',
    createdAt: '2026-06-21T11:00:00Z',
    updatedAt: '2026-06-21T11:00:00Z'
  }
];

export const INITIAL_ASSIGNMENT_AUDIT_LOGS: InstallationAssignmentAuditLog[] = [
  {
    id: 'aud-2001',
    requestId: 'req-501',
    assignmentId: 'asgn-1001',
    action: 'Installation Assigned',
    fromStatus: 'Pending Assignment',
    toStatus: 'Assigned',
    performedBy: 'Alex Vance',
    performedByRole: 'Workshop Manager',
    timestamp: '2026-06-20T09:30:00Z',
    notes: 'Assigned Marcus Thorne as lead engineer with 2 field technicians.'
  },
  {
    id: 'aud-2002',
    requestId: 'req-501',
    assignmentId: 'asgn-1001',
    action: 'Status Advanced',
    fromStatus: 'Assigned',
    toStatus: 'Scheduled',
    performedBy: 'Marcus Thorne',
    performedByRole: 'Field Service Engineer',
    timestamp: '2026-06-22T14:15:00Z',
    notes: 'Confirmed appointment window with Hospital St. Jude BioMed director.'
  },
  {
    id: 'aud-2003',
    requestId: 'req-502',
    assignmentId: 'asgn-1002',
    action: 'Installation Assigned',
    fromStatus: 'Pending Assignment',
    toStatus: 'Assigned',
    performedBy: 'Elena Rostova',
    performedByRole: 'Area Engineer',
    timestamp: '2026-06-21T11:00:00Z',
    notes: 'Assigned David K. to handle Chemistry Analyzer setup.'
  }
];

export const AVAILABLE_ENGINEERS = [
  'Eng. Marcus Thorne (Lead BioMed)',
  'Eng. David K. (Field Automation)',
  'Eng. Elena Rostova (Senior Systems)',
  'Eng. Jonathan Crane (Spectroscopy)',
  'Eng. Priya Nair (Molecular Diagnostics)'
];

export const AVAILABLE_TECHNICIANS = [
  'Tech. Sarah Jenkins (Optics Specialist)',
  'Tech. Dave Miller',
  'Tech. Robert Chang',
  "Tech. Liam O'Connor",
  'Tech. Chloe Bennett',
  'Tech. Carlos Gomez'
];

export const WORKFLOW_STATUS_PIPELINE: InstallationRequestStatus[] = [
  'Pending Request',
  'Pending Assignment',
  'Assigned',
  'Scheduled',
  'Travelling',
  'On Site',
  'Installation Completed',
  'Report Pending',
  'Documentation Review',
  'Closed'
];

/**
 * Calculates SLA due date based on Delivery Date + configurable SLA Days
 */
export function calculateSlaDueDate(deliveryDateStr: string, slaDays: number): string {
  if (!deliveryDateStr) return new Date(Date.now() + slaDays * 86400000).toISOString().split('T')[0];
  const d = new Date(deliveryDateStr);
  if (isNaN(d.getTime())) return new Date(Date.now() + slaDays * 86400000).toISOString().split('T')[0];
  d.setDate(d.getDate() + slaDays);
  return d.toISOString().split('T')[0];
}
