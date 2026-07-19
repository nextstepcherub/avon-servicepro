/**
 * AVON ServicePro V2 Enterprise Database Architecture
 * Company: AVON PHARMO CHEM (PVT) LTD SERVICE CENTRE
 * Technology: Supabase PostgreSQL, Next.js 15, TypeScript, Tailwind CSS, Vercel
 * Designed by Principal Enterprise Software Architect and PostgreSQL Database Designer
 */

export const JOB_NUMBER_FORMATS = [
  { type: 'INSTALLATION', prefix: 'INS', sample: 'INS-2026-00001', desc: 'New clinical instrument commissioning & site qualification' },
  { type: 'WARRANTY_SERVICE', prefix: 'WSV', sample: 'WSV-2026-00001', desc: 'Preventive maintenance under active manufacturer warranty' },
  { type: 'NON_WARRANTY_SERVICE', prefix: 'SRV', sample: 'SRV-2026-00001', desc: 'Billable routine service or AMC contract inspection' },
  { type: 'WARRANTY_REPAIR', prefix: 'WRP', sample: 'WRP-2026-00001', desc: 'Emergency breakdown fix under active warranty guarantee' },
  { type: 'WORKSHOP_JOB', prefix: 'WSJ', sample: 'WSJ-2026-00001', desc: 'Offline bench diagnosis & deep hardware repair' },
  { type: 'CALIBRATION_JOB', prefix: 'CAL', sample: 'CAL-2026-00001', desc: 'ISO 17025 traceable optical, thermal & mass recalibration' }
];

export const ER_DIAGRAM_ASCII = `
================================================================================================================
                                AVON ServicePro V2 Enterprise ER Diagram (Core Master Hierarchy)
================================================================================================================

 +------------------------+         +------------------------+         +------------------------+
 |     customers          |         |      territories       |         |       instruments      |
 |------------------------|         |------------------------|         |------------------------|
 | PK id (UUID)           |<---+    | PK id (UUID)           |    +--->| PK id (UUID)           |
 |    name                |    |    |    name                |    |    |    serial_number       |
 |    email               |    |    |    province            |    |    |    invoice_number      |
 |    territory_id        |----+    +------------------------+    |    |    invoice_value       |
 +------------------------+                     ^                 |    |    territory_id        |
             ^                                  |                 |    |    status              |
             |                                  |                 |    +------------------------+
             |                                  |                 |                 ^
             |    +-----------------------------+                 |                 |
             |    |                             |                 |                 |
             |    |   +-------------------------+                 |                 |
             |    |   |                                           |                 |
 +-----------+----+---+---+                                       |                 |
 |  customer_departments  |                                       |                 |
 |------------------------|                                       |                 |
 | PK id (UUID)           |                                       |                 |
 | FK customer_id         |                                       |                 |
 |    name                |                                       |                 |
 +------------------------+                                       |                 |
             ^                                                    |                 |
             |                                                    |                 |
             |             +--------------------------------------+                 |
             |             |                                                        |
             |             |            +-------------------------------------------+
             |             |            |
 +-----------+-------------+------------+----------------------------------------------------------------------+
 |                                             public.jobs (MASTER ENGINE)                                     |
 |-------------------------------------------------------------------------------------------------------------|
 | PK id (UUID)                FK customer_id (UUID)           FK territory_id (UUID)                          |
 |    job_no (VARCHAR UNIQUE)  FK department_id (UUID)         FK area_engineer_id (UUID)                      |
 |    job_type (ENUM)          FK instrument_id (UUID)         FK workshop_engineer_id (UUID)                  |
 |    job_category (VARCHAR)   priority (ENUM)                 status_id (VARCHAR)                             |
 |    created_date (TIMESTAMPTZ) due_date (TIMESTAMPTZ)        completed_date (TIMESTAMPTZ)                    |
 |    sla_status (VARCHAR)     remarks (TEXT)                  active (BOOLEAN)                                |
 +-------------------------------------------------------------------------------------------------------------+
       ^              ^                    ^                    ^                     ^                  ^
       |              |                    |                    |                     |                  |
       |              |                    |                    |                     |                  |
 +-----+--------+  +--+--------------+  +--+---------------+  +-+------------------+  +--+------------+  +--+-----------------+
 |job_assignments| |workflow_transitions| | sla_tracking   |  |documentation_updates| | parts_orders  |  |customer_feedback |
 |--------------|  |------------------|  |----------------|  |--------------------|  |---------------|  |-----------------|
 |PK id         |  |PK id             |  |PK job_id       |  |PK id               |  |PK id          |  |PK id            |
 |FK job_id     |  |FK job_id         |  |FK job_id       |  |FK job_id           |  |FK job_id      |  |FK job_id        |
 |FK assigned_to|  |from_status       |  |start_date      |  |document_type (ENUM)|  |supplier       |  |engineer_rating  |
 |role_on_job   |  |to_status         |  |due_date        |  |document_number     |  |part_number    |  |overall_rating   |
 |active        |  |role_allowed      |  |sla_result      |  |updated_date        |  |status (ENUM)  |  |comments         |
 +--------------+  +------------------+  +----------------+  +--------------------+  +---------------+  +-----------------+
`;

export const JOB_NUMBER_PLPGSQL = `-- =================================================================================
-- AVON ServicePro V2: Atomic Job Number Auto-Generation Engine
-- Concurrency Safe: Uses Postgres Sequences & PL/pgSQL Atomic Transactions
-- Formats Supported: INS-YYYY-00001, WSV-YYYY-00001, SRV-YYYY-00001, WRP-YYYY-00001, WSJ-YYYY-00001, CAL-YYYY-00001
-- =================================================================================

-- Create individual atomic sequences per job type per year (dynamic or pooled)
CREATE SEQUENCE IF NOT EXISTS seq_job_ins_2026 START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS seq_job_wsv_2026 START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS seq_job_srv_2026 START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS seq_job_wrp_2026 START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS seq_job_wsj_2026 START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS seq_job_cal_2026 START 1 INCREMENT 1;

-- Master Auto-Generation Function
CREATE OR REPLACE FUNCTION public.generate_job_number(p_job_type VARCHAR)
RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_prefix VARCHAR(4);
    v_seq_val BIGINT;
    v_year VARCHAR(4);
    v_formatted_no VARCHAR(30);
BEGIN
    v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    CASE p_job_type
        WHEN 'INSTALLATION' THEN
            v_prefix := 'INS';
            v_seq_val := nextval('seq_job_ins_' || v_year);
        WHEN 'WARRANTY_SERVICE' THEN
            v_prefix := 'WSV';
            v_seq_val := nextval('seq_job_wsv_' || v_year);
        WHEN 'NON_WARRANTY_SERVICE' THEN
            v_prefix := 'SRV';
            v_seq_val := nextval('seq_job_srv_' || v_year);
        WHEN 'WARRANTY_REPAIR' THEN
            v_prefix := 'WRP';
            v_seq_val := nextval('seq_job_wrp_' || v_year);
        WHEN 'WORKSHOP_JOB' THEN
            v_prefix := 'WSJ';
            v_seq_val := nextval('seq_job_wsj_' || v_year);
        WHEN 'CALIBRATION_JOB' THEN
            v_prefix := 'CAL';
            v_seq_val := nextval('seq_job_cal_' || v_year);
        ELSE
            RAISE EXCEPTION 'Invalid AVON Job Type specification: %', p_job_type;
    END CASE;

    -- Format to 5 digit zero-padded string (e.g. INS-2026-00001)
    v_formatted_no := v_prefix || '-' || v_year || '-' || LPAD(v_seq_val::text, 5, '0');
    
    RETURN v_formatted_no;
END;
$$;

-- Trigger to auto-populate job_no on insertion into public.jobs if null
CREATE OR REPLACE FUNCTION public.trg_auto_set_job_no()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.job_no IS NULL OR NEW.job_no = '' THEN
        NEW.job_no := public.generate_job_number(NEW.job_type::text);
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_jobs_before_insert
BEFORE INSERT ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.trg_auto_set_job_no();
`;

export const SUPABASE_SQL_V2 = `-- ================================================================================================================
-- AVON ServicePro V2 Enterprise Database Architecture Upgrade
-- Target Runtime: Supabase PostgreSQL (Production Grade, Multi-tenant RLS enabled)
-- Company: AVON PHARMO CHEM (PVT) LTD SERVICE CENTRE
-- Optimized for: 10+ years enterprise growth, Foreign Key Cascades, Compound Geo Indexes
-- ================================================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================================================================
-- PART 0: GLOBAL ENUMS & REFERENCE MASTER
-- ================================================================================================================

CREATE TYPE public.v2_job_type_enum AS ENUM (
    'INSTALLATION', 'WARRANTY_SERVICE', 'NON_WARRANTY_SERVICE', 'WARRANTY_REPAIR', 'WORKSHOP_JOB', 'CALIBRATION_JOB'
);

CREATE TYPE public.v2_job_priority_enum AS ENUM (
    'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
);

CREATE TYPE public.v2_sla_status_enum AS ENUM (
    'COMPLIANT', 'WARNING', 'BREACHED'
);

CREATE TYPE public.v2_assignee_role_enum AS ENUM (
    'Area Engineer', 'Workshop Engineer', 'Calibration Engineer', 'Technician', 'Trainee', 'Intern'
);

CREATE TYPE public.v2_parts_order_status_enum AS ENUM (
    'Requested', 'Ordered', 'Partially Received', 'Received', 'Cancelled'
);

CREATE TYPE public.v2_instrument_status_enum AS ENUM (
    'Pending Installation', 'Installed', 'Warranty', 'Out Of Warranty', 'Service Contract', 'Retired'
);

-- ================================================================================================================
-- PART 3: TERRITORY MANAGEMENT ENGINE
-- ================================================================================================================

CREATE TABLE public.territories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    territory_code VARCHAR(50) UNIQUE NOT NULL,
    territory_name VARCHAR(150) NOT NULL,
    province VARCHAR(100) NOT NULL,
    districts_covered TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.territory_engineers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    territory_id UUID NOT NULL REFERENCES public.territories(id) ON DELETE CASCADE,
    primary_engineer UUID NOT NULL, -- references auth.users
    primary_engineer_name VARCHAR(150) NOT NULL,
    backup_engineer UUID,
    backup_engineer_name VARCHAR(150),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    active BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX idx_terr_eng_active ON public.territory_engineers(territory_id, active);

-- ================================================================================================================
-- PART 11: INSTRUMENT REGISTRY ENHANCEMENT (UPGRADED FLEET MASTER)
-- ================================================================================================================

CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.customer_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    contact_number VARCHAR(50),
    UNIQUE(customer_id, name)
);

CREATE TABLE public.end_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.customer_departments(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL
);

CREATE TABLE public.instruments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_number VARCHAR(120) UNIQUE NOT NULL,
    instrument_name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL DEFAULT 'SHIMADZU',
    model VARCHAR(150) NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    department_id UUID REFERENCES public.customer_departments(id) ON DELETE SET NULL,
    end_user_id UUID REFERENCES public.end_users(id) ON DELETE SET NULL,
    territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
    area_engineer_id UUID, -- Inherited from territory primary engineer
    area_engineer_name VARCHAR(150),
    invoice_number VARCHAR(100),
    invoice_value NUMERIC(15,2) DEFAULT 0.00 CHECK (invoice_value >= 0),
    delivery_date DATE,
    installation_date DATE,
    warranty_start DATE,
    warranty_expiry DATE,
    warranty_period_months INT NOT NULL DEFAULT 12,
    service_interval INT NOT NULL DEFAULT 6, -- in months
    status public.v2_instrument_status_enum NOT NULL DEFAULT 'Pending Installation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_inst_customer_serial ON public.instruments(customer_id, serial_number);
CREATE INDEX idx_inst_territory_status ON public.instruments(territory_id, status);

-- ================================================================================================================
-- PART 4: WORKFLOW ENGINE
-- ================================================================================================================

CREATE TABLE public.workflow_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name VARCHAR(50) NOT NULL CHECK (module_name IN ('INSTALLATION', 'SERVICE', 'WORKSHOP', 'CALIBRATION')),
    status_name VARCHAR(100) NOT NULL,
    status_color VARCHAR(30) NOT NULL DEFAULT '#0054A6',
    sort_order INT NOT NULL DEFAULT 10,
    active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(module_name, status_name)
);

CREATE TABLE public.workflow_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name VARCHAR(50) NOT NULL,
    from_status VARCHAR(100) NOT NULL,
    to_status VARCHAR(100) NOT NULL,
    role_allowed VARCHAR[] NOT NULL DEFAULT '{"Workshop Manager", "Service Engineer"}'
);

-- Seed Workflow Statuses
INSERT INTO public.workflow_statuses (module_name, status_name, status_color, sort_order) VALUES
('INSTALLATION', 'Pending Assignment', '#F59E0B', 10),
('INSTALLATION', 'Assigned', '#3B82F6', 20),
('INSTALLATION', 'Scheduled', '#6366F1', 30),
('INSTALLATION', 'On Site', '#8B5CF6', 40),
('INSTALLATION', 'Completed', '#10B981', 50),
('INSTALLATION', 'Overdue', '#EF4444', 60),
('INSTALLATION', 'Cancelled', '#6B7280', 70),

('SERVICE', 'New', '#3B82F6', 10),
('SERVICE', 'Inspection Pending', '#F59E0B', 20),
('SERVICE', 'Inspection Done', '#8B5CF6', 30),
('SERVICE', 'Quotation Pending', '#6366F1', 40),
('SERVICE', 'Quotation Sent', '#06B6D4', 50),
('SERVICE', 'PO Received', '#10B981', 60),
('SERVICE', 'In Progress', '#4F46E5', 70),
('SERVICE', 'Waiting Parts', '#EC4899', 80),
('SERVICE', 'Completed', '#059669', 90),
('SERVICE', 'Closed', '#374151', 100),

('WORKSHOP', 'Received', '#3B82F6', 10),
('WORKSHOP', 'Assigned', '#6366F1', 20),
('WORKSHOP', 'Diagnosing', '#F59E0B', 30),
('WORKSHOP', 'Repairing', '#8B5CF6', 40),
('WORKSHOP', 'Testing', '#06B6D4', 50),
('WORKSHOP', 'Ready For Delivery', '#10B981', 60),
('WORKSHOP', 'Delivered', '#059669', 70),
('WORKSHOP', 'Closed', '#374151', 80);

-- ================================================================================================================
-- PART 1: JOB MASTER ENGINE (CENTRAL DISPATCH LEDGER)
-- ================================================================================================================

CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_no VARCHAR(50) UNIQUE NOT NULL, -- e.g. INS-2026-00001
    job_type public.v2_job_type_enum NOT NULL,
    job_category VARCHAR(100) NOT NULL DEFAULT 'Routine Maintenance',
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    department_id UUID REFERENCES public.customer_departments(id) ON DELETE SET NULL,
    instrument_id UUID REFERENCES public.instruments(id) ON DELETE SET NULL,
    territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
    area_engineer_id UUID, -- primary field engineer assigned
    workshop_engineer_id UUID, -- secondary bench specialist
    priority public.v2_job_priority_enum NOT NULL DEFAULT 'MEDIUM',
    status_id VARCHAR(100) NOT NULL DEFAULT 'New',
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL,
    completed_date TIMESTAMPTZ,
    sla_status public.v2_sla_status_enum NOT NULL DEFAULT 'COMPLIANT',
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_type_status ON public.jobs(job_type, status_id);
CREATE INDEX idx_jobs_customer_inst ON public.jobs(customer_id, instrument_id);
CREATE INDEX idx_jobs_due_sla ON public.jobs(due_date, sla_status);

-- ================================================================================================================
-- PART 2: JOB ASSIGNMENT ENGINE
-- ================================================================================================================

CREATE TABLE public.job_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL, -- engineer user UUID
    assigned_to_name VARCHAR(150) NOT NULL,
    assigned_by UUID NOT NULL, -- manager user UUID
    assigned_by_name VARCHAR(150) NOT NULL,
    assigned_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_date TIMESTAMPTZ,
    completed_date TIMESTAMPTZ,
    role_on_job public.v2_assignee_role_enum NOT NULL DEFAULT 'Area Engineer',
    active BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX idx_job_assign_job ON public.job_assignments(job_id, active);
CREATE INDEX idx_job_assign_eng ON public.job_assignments(assigned_to, active);

-- ================================================================================================================
-- PART 5: SLA ENGINE
-- ================================================================================================================

CREATE TABLE public.sla_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name VARCHAR(50) NOT NULL,
    job_type public.v2_job_type_enum NOT NULL,
    target_days INT NOT NULL DEFAULT 5,
    working_days_only BOOLEAN NOT NULL DEFAULT true,
    warning_days INT NOT NULL DEFAULT 2,
    active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(module_name, job_type)
);

INSERT INTO public.sla_rules (module_name, job_type, target_days, working_days_only, warning_days) VALUES
('INSTALLATION', 'INSTALLATION', 15, false, 3),
('SERVICE', 'NON_WARRANTY_SERVICE', 7, true, 2),
('REPAIR', 'WARRANTY_REPAIR', 5, true, 1),
('WORKSHOP', 'WORKSHOP_JOB', 10, true, 3),
('CALIBRATION', 'CALIBRATION_JOB', 7, true, 2);

CREATE TABLE public.sla_tracking (
    job_id UUID PRIMARY KEY REFERENCES public.jobs(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL,
    warning_date TIMESTAMPTZ NOT NULL,
    completed_date TIMESTAMPTZ,
    sla_result VARCHAR(30) NOT NULL DEFAULT 'ON_TRACK'
);

-- ================================================================================================================
-- PART 6: DOCUMENTATION OFFICER ENGINE
-- ================================================================================================================

CREATE TABLE public.documentation_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    document_type VARCHAR(60) NOT NULL CHECK (document_type IN (
        'Installation Report', 'Service Report', 'Inspection Report', 'Quotation', 
        'PO', 'Memo', 'Invoice', 'Calibration Certificate', 'Workshop Delivery Note'
    )),
    document_number VARCHAR(100) NOT NULL,
    document_date DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_by UUID NOT NULL,
    updated_by_name VARCHAR(150) NOT NULL,
    updated_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    remarks TEXT
);
CREATE INDEX idx_doc_job ON public.documentation_updates(job_id, document_type);

-- ================================================================================================================
-- PART 7: PARTS PROCUREMENT ENGINE
-- ================================================================================================================

CREATE TABLE public.parts_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    supplier VARCHAR(150) NOT NULL DEFAULT 'Shimadzu Asia Pacific Pte Ltd',
    part_number VARCHAR(100) NOT NULL,
    part_description TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expected_date TIMESTAMPTZ NOT NULL,
    received_date TIMESTAMPTZ,
    status public.v2_parts_order_status_enum NOT NULL DEFAULT 'Requested'
);
CREATE INDEX idx_parts_job_status ON public.parts_orders(job_id, status);

-- Trigger: Repair SLA countdown begins strictly after parts received_date
CREATE OR REPLACE FUNCTION public.trg_start_sla_on_parts_received()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Received' AND OLD.status != 'Received' THEN
        NEW.received_date := NOW();
        -- Shift job status automatically to In Progress / Repairing
        UPDATE public.jobs 
        SET status_id = 'In Progress', 
            due_date = NOW() + INTERVAL '5 working days',
            sla_status = 'COMPLIANT'
        WHERE id = NEW.job_id AND status_id = 'Waiting Parts';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_parts_received_sla
BEFORE UPDATE ON public.parts_orders
FOR EACH ROW EXECUTE FUNCTION public.trg_start_sla_on_parts_received();

-- ================================================================================================================
-- PART 8: CUSTOMER FEEDBACK ENGINE (QR CODE SURVEY INTEL)
-- ================================================================================================================

CREATE TABLE public.customer_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    end_user_id UUID REFERENCES public.end_users(id) ON DELETE SET NULL,
    engineer_rating INT NOT NULL CHECK (engineer_rating BETWEEN 1 AND 5),
    communication_rating INT NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
    technical_skill_rating INT NOT NULL CHECK (technical_skill_rating BETWEEN 1 AND 5),
    response_time_rating INT NOT NULL CHECK (response_time_rating BETWEEN 1 AND 5),
    overall_rating NUMERIC(3,2) GENERATED ALWAYS AS (
        (engineer_rating + communication_rating + technical_skill_rating + response_time_rating) / 4.0
    ) STORED,
    comments TEXT,
    submitted_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_feedback_job_rating ON public.customer_feedback(job_id, overall_rating);

-- ================================================================================================================
-- PART 9: KPI ENGINE (MULTI-ROLE WEIGHTED MATRIX)
-- ================================================================================================================

CREATE TABLE public.kpi_roles (
    role_name VARCHAR(100) PRIMARY KEY,
    desc_text TEXT
);

INSERT INTO public.kpi_roles (role_name, desc_text) VALUES
('Service Engineer', 'Field resolution SLAs, first time fix rate, customer satisfaction'),
('Workshop Engineer', 'Bench turnaround time, component repair success, calibration accuracy'),
('Biomedical Engineer', 'Regulatory commissioning audits, IQ/OQ/PQ sign-off compliance'),
('Calibration Engineer', 'ISO 17025 certificate issuance speed, zero drift error rate'),
('Technician', 'Assisted maintenance tasks completion, workshop bench cleanliness'),
('Documentation Officer', 'Quotation speed, PO archiving SLAs, report verification'),
('Workshop Manager', 'Overall regional fleet uptime, revenue billing achievement, staff utilization');

CREATE TABLE public.kpi_role_weightages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(100) NOT NULL REFERENCES public.kpi_roles(role_name) ON DELETE CASCADE,
    metric_name VARCHAR(150) NOT NULL,
    weightage_percent NUMERIC(5,2) NOT NULL CHECK (weightage_percent BETWEEN 0 AND 100),
    target_value NUMERIC(10,2) NOT NULL,
    UNIQUE(role_name, metric_name)
);

CREATE TABLE public.kpi_monthly_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engineer_id UUID NOT NULL,
    engineer_name VARCHAR(150) NOT NULL,
    role_name VARCHAR(100) NOT NULL REFERENCES public.kpi_roles(role_name),
    calc_month VARCHAR(7) NOT NULL, -- YYYY-MM
    achieved_score NUMERIC(5,2) NOT NULL, -- e.g. 94.50
    payout_bonus NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(engineer_id, calc_month)
);

-- ================================================================================================================
-- PART 10: NOTIFICATION RULE ENGINE
-- ================================================================================================================

CREATE TABLE public.notification_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(100) UNIQUE NOT NULL,
    days_before INT DEFAULT 0,
    days_after INT DEFAULT 0,
    recipient_role VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO public.notification_rules (event_name, days_before, days_after, recipient_role) VALUES
('Warranty Due', 30, 0, 'Documentation Officer'),
('Installation Overdue', 0, 1, 'Workshop Manager'),
('Repair Overdue', 0, 1, 'Workshop Manager'),
('Calibration Due', 14, 0, 'Calibration Engineer'),
('PO Received', 0, 0, 'Service Engineer'),
('Parts Received', 0, 0, 'Workshop Engineer'),
('Customer Feedback Pending', 0, 3, 'Documentation Officer'),
('KPI Below Target', 0, 0, 'Workshop Manager');

-- ================================================================================================================
-- PART 12: WORKSHOP RECEIVING MODULE (ENHANCED BENCH INTAKE)
-- ================================================================================================================

CREATE TABLE public.workshop_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_no VARCHAR(50) UNIQUE NOT NULL, -- e.g. WSR-2026-00001
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    item_model VARCHAR(150) NOT NULL,
    serial_number VARCHAR(120) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    warranty_status VARCHAR(50) NOT NULL CHECK (warranty_status IN ('In Warranty', 'Out Of Warranty', 'Service Contract')),
    received_parts TEXT[] NOT NULL DEFAULT '{}',
    delivery_person_name VARCHAR(150) NOT NULL,
    delivery_person_nic VARCHAR(30) NOT NULL,
    receive_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    item_condition TEXT NOT NULL DEFAULT 'Intact casing, power cable included',
    photos TEXT[] NOT NULL DEFAULT '{}',
    remarks TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ws_receipt_serial ON public.workshop_receipts(serial_number);

-- ================================================================================================================
-- ROW LEVEL SECURITY (SUPABASE RLS POLICIES)
-- ================================================================================================================

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts_orders ENABLE ROW LEVEL SECURITY;

-- 1. All Authenticated Engineers can select operational ledger
CREATE POLICY "Engineers read open jobs" ON public.jobs FOR SELECT TO authenticated USING (true);

-- 2. Only Workshop Managers or Documentation Officers can insert/update jobs
CREATE POLICY "Managers manage jobs" ON public.jobs FOR ALL TO authenticated
USING (
    current_setting('request.jwt.claims', true)::jsonb->>'role' IN ('Workshop Manager', 'Documentation Officer', 'DIRECTOR')
);

-- 3. Assigned Engineers can update their specific job assignments
CREATE POLICY "Assignees update own job assignments" ON public.job_assignments FOR UPDATE TO authenticated
USING (assigned_to = auth.uid());

-- 4. Open read for workshop intake receipts
CREATE POLICY "Open read workshop receipts" ON public.workshop_receipts FOR SELECT TO authenticated USING (true);
`;

export const V2_ENGINE_BREAKDOWN = [
  {
    part: "PART 1",
    title: "Job Master Engine",
    table: "public.jobs",
    desc: "Centralized operational master ledger connecting all service, repair, calibration, and workshop domains into atomic job records.",
    keyFields: ["id", "job_no (INS/WSV/SRV)", "job_type", "customer_id", "instrument_id", "territory_id", "area_engineer_id", "priority", "sla_status"]
  },
  {
    part: "PART 2",
    title: "Job Assignment Engine",
    table: "public.job_assignments",
    desc: "Enables multiple collaborative assignees per job supporting role hierarchies (Area Engineer, Bench Specialist, Calibration Engineer, Trainee, Intern).",
    keyFields: ["id", "job_id", "assigned_to", "assigned_by", "assigned_date", "accepted_date", "role_on_job", "active"]
  },
  {
    part: "PART 3",
    title: "Territory Management Engine",
    table: "public.territory_engineers",
    desc: "Maps geographical administrative divisions to dedicated Primary and Backup Area Engineers. Downstream customers inherit territorial bounds.",
    keyFields: ["territory_id", "primary_engineer", "backup_engineer", "start_date", "end_date", "active"]
  },
  {
    part: "PART 4",
    title: "Workflow Engine",
    table: "public.workflow_statuses",
    desc: "Strict deterministic state machines governing lifecycle transitions for Installation, Service, Workshop, and Calibration workflows.",
    keyFields: ["module_name", "status_name", "status_color", "sort_order", "role_allowed"]
  },
  {
    part: "PART 5",
    title: "SLA Engine",
    table: "public.sla_rules & sla_tracking",
    desc: "Automated business working days tracking engine calculating warning thresholds and breach metrics (e.g. Installation = 15 days, Repairs = 5 working days).",
    keyFields: ["job_type", "target_days", "working_days_only", "warning_days", "sla_result"]
  },
  {
    part: "PART 6",
    title: "Documentation Officer Engine",
    table: "public.documentation_updates",
    desc: "Tracks compliance milestones across 9 document types (Reports, Quotations, POs, Invoices, Certificates, Delivery Notes) tied to master jobs.",
    keyFields: ["job_id", "document_type", "document_number", "document_date", "updated_by", "remarks"]
  },
  {
    part: "PART 7",
    title: "Parts Procurement Engine",
    table: "public.parts_orders",
    desc: "Manages spare parts requisitions. Features automated PL/pgSQL trigger that pauses repair SLA countdowns until parts reach 'Received' state.",
    keyFields: ["job_id", "supplier", "part_number", "quantity", "expected_date", "received_date", "status"]
  },
  {
    part: "PART 8",
    title: "Customer Feedback Engine",
    table: "public.customer_feedback",
    desc: "Captures 1-to-5 Likert ratings across 4 core competencies (Engineer skill, Communication, Response time) with instant QR code survey generation.",
    keyFields: ["job_id", "customer_id", "end_user_id", "engineer_rating", "communication_rating", "overall_rating"]
  },
  {
    part: "PART 9",
    title: "KPI Engine",
    table: "public.kpi_roles & kpi_monthly_results",
    desc: "Differentiates performance matrices per job title (Service Eng, Workshop Eng, Biomed Eng, Documentation Officer) with automatic monthly calculation.",
    keyFields: ["role_name", "metric_name", "weightage_percent", "target_value", "achieved_score", "payout_bonus"]
  },
  {
    part: "PART 10",
    title: "Notification Rule Engine",
    table: "public.notification_rules",
    desc: "Event-driven dispatcher monitoring 8 operational events (Warranty Due, Overdue Installations, PO Receipt, KPI Below Target).",
    keyFields: ["event_name", "days_before", "days_after", "recipient_role", "active"]
  },
  {
    part: "PART 11",
    title: "Instrument Registry Enhancement",
    table: "public.instruments",
    desc: "Upgraded asset ledger storing capital invoice valuation, delivery date, warranty period, service intervals, and 6 upgraded operational statuses.",
    keyFields: ["serial_number", "invoice_number", "invoice_value", "warranty_period_months", "service_interval", "status"]
  },
  {
    part: "PART 12",
    title: "Workshop Receiving Intake Module",
    table: "public.workshop_receipts",
    desc: "Comprehensive gatekeeper intake form logging unboxed machinery condition, brought-in accessories, delivery NIC credentials, and intake photos.",
    keyFields: ["receipt_no", "item_name", "serial_number", "warranty_status", "received_parts", "delivery_person_nic", "photos"]
  }
];
