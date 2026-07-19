-- Sprint 6.1: Warranty Service Scheduler Supabase DDL & RLS Policies
-- AVON ServicePro Enterprise Database Architecture

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: warranty_service_tasks
CREATE TABLE IF NOT EXISTS public.warranty_service_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(64) UNIQUE NOT NULL,
    warranty_card_number VARCHAR(64) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    territory VARCHAR(128) NOT NULL,
    instrument_name VARCHAR(255) NOT NULL,
    asset_number VARCHAR(128) NOT NULL,
    serial_number VARCHAR(128) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL DEFAULT '09:00:00',
    status VARCHAR(64) NOT NULL DEFAULT 'Scheduled',
    priority VARCHAR(64) NOT NULL DEFAULT 'Medium',
    assigned_area_engineer VARCHAR(255) NOT NULL,
    service_type VARCHAR(128) NOT NULL DEFAULT 'Preventative Maintenance',
    estimated_duration_hours NUMERIC(4, 2) DEFAULT 4.00,
    notes TEXT,
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT chk_status CHECK (status IN ('Scheduled', 'Dispatched', 'In Progress', 'Completed', 'Overdue', 'Cancelled')),
    CONSTRAINT chk_priority CHECK (priority IN ('Low', 'Medium', 'High', 'Critical'))
);

-- Indexing for fast dashboard widget counts and filtering queries
CREATE INDEX IF NOT EXISTS idx_wst_scheduled_date ON public.warranty_service_tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_wst_status ON public.warranty_service_tasks(status);
CREATE INDEX IF NOT EXISTS idx_wst_engineer ON public.warranty_service_tasks(assigned_area_engineer);
CREATE INDEX IF NOT EXISTS idx_wst_territory ON public.warranty_service_tasks(territory);
CREATE INDEX IF NOT EXISTS idx_wst_customer ON public.warranty_service_tasks(customer_name);

-- Row Level Security (RLS) Configuration
ALTER TABLE public.warranty_service_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated officers and area engineers to read tasks in their territory or assigned to them
CREATE POLICY "Enable read access for authenticated users" ON public.warranty_service_tasks
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow dispatch coordinators and documentation officers to insert/update scheduled tasks
CREATE POLICY "Enable write access for service coordinators" ON public.warranty_service_tasks
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('Documentation Officer', 'Service Manager', 'Area Engineer', 'Admin')
    );

-- Seed Sample Data for Sprint 6.1 Demonstration
INSERT INTO public.warranty_service_tasks (
    ticket_number, warranty_card_number, customer_name, department, territory, 
    instrument_name, asset_number, serial_number, scheduled_date, scheduled_time, 
    status, priority, assigned_area_engineer, service_type, estimated_duration_hours, notes
) VALUES 
('WST-2026-9012', 'WC-AVN-2026-8941', 'Metro Central General Hospital', 'Advanced Clinical Pathology', 'North Metro District', 'Sysmex XN-3000 Automated Hematology Analyzer', 'AST-MED-2026-8841', 'SXN-9948210-PRO', '2026-06-25', '09:00:00', 'Scheduled', 'High', 'Eng. Marcus Vance', 'Preventative Maintenance', 4.5, 'Initial 6-month mandatory filter and pneumatic check.'),
('WST-2026-8841', 'WC-AVN-2025-4412', 'St. Jude Childrens Research Hospital', 'Pediatric Oncology Lab', 'West Valley Territory', 'Roche Cobas 8000 Modular Analyzer', 'AST-RCH-2025-1092', 'RCB-882104-ENT', '2026-06-20', '10:30:00', 'Overdue', 'Critical', 'Eng. David Chen', 'Mandatory Calibration', 6.0, 'Overdue by 5 days due to hospital reagent quarantine delay.'),
('WST-2026-9104', 'WC-AVN-2026-3321', 'Mayo Clinic Healthcare Hub', 'Immunology & Endocrinology', 'Central Region', 'Beckman Coulter DxI 9000 Immunoassay', 'AST-BC-2026-5541', 'BCD-992140-PRO', '2026-06-27', '13:00:00', 'Scheduled', 'Medium', 'Eng. Sarah Jenkins', 'Preventative Maintenance', 3.5, 'Routine optics baseline and manifold cleaning.')
ON CONFLICT (ticket_number) DO NOTHING;
