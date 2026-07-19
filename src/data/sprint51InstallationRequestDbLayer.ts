/**
 * Sprint 5.1 – Installation Request Master Database Layer
 * 
 * Technology: React, TypeScript, Supabase Postgres
 * Table: installation_requests
 */

import { InstallationRequest, InstallationRequestStatus } from '../types';

export interface InstallationRequestRow {
  id: string; // UUID Primary Key
  invoice_number: string;
  invoice_value: number; // Numeric(15,2)

  customer_name: string;
  department_name: string;
  end_user_name: string;

  instrument_name: string;
  brand: string;
  model: string;
  serial_number: string;

  delivery_date: string; // ISO Date YYYY-MM-DD

  warranty_period: number; // e.g., 12, 24, 36
  warranty_unit: 'Months' | 'Years' | 'Days';

  remarks: string | null;

  status: InstallationRequestStatus;

  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}

export interface InstallationRequestInsertRow extends Omit<InstallationRequestRow, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InstallationRequestUpdateRow extends Partial<InstallationRequestInsertRow> {}

export const SPRINT_5_1_INSTALLATION_REQUESTS_SQL = `-- ============================================================================
-- Sprint 5.1 – Installation Request Master Database Layer (Supabase PostgreSQL DDL)
-- Table: public.installation_requests
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLE: installation_requests
CREATE TABLE IF NOT EXISTS public.installation_requests (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Commercial Identifiers
    invoice_number TEXT NOT NULL,
    invoice_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (invoice_value >= 0),

    -- Customer & Stakeholder Hierarchy
    customer_name TEXT NOT NULL,
    department_name TEXT NOT NULL,
    end_user_name TEXT NOT NULL,

    -- Equipment Specifications
    instrument_name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    serial_number TEXT NOT NULL UNIQUE,

    -- Delivery & Commissioning Timelines
    delivery_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Warranty Terms
    warranty_period INTEGER NOT NULL DEFAULT 12 CHECK (warranty_period >= 0),
    warranty_unit TEXT NOT NULL DEFAULT 'Months' CHECK (warranty_unit IN ('Months', 'Years', 'Days')),

    -- Remarks & Special Instructions
    remarks TEXT,

    -- Workflow Status (Sprint 5.1 Controlled Lifecycle)
    status TEXT NOT NULL DEFAULT 'Pending Assignment' CHECK (status IN ('Pending Assignment', 'Assigned', 'Scheduled', 'Installed', 'Closed')),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. INDEXES FOR HIGH-PERFORMANCE FILTERS & FLEET DASHBOARDS
CREATE INDEX IF NOT EXISTS idx_inst_req_invoice_no ON public.installation_requests(invoice_number);
CREATE INDEX IF NOT EXISTS idx_inst_req_serial_no ON public.installation_requests(serial_number);
CREATE INDEX IF NOT EXISTS idx_inst_req_customer ON public.installation_requests(customer_name);
CREATE INDEX IF NOT EXISTS idx_inst_req_status ON public.installation_requests(status);
CREATE INDEX IF NOT EXISTS idx_inst_req_delivery ON public.installation_requests(delivery_date);

-- 4. AUTOMATED MODIFICATION TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.set_inst_req_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_inst_req_updated_at ON public.installation_requests;
CREATE TRIGGER trg_inst_req_updated_at
    BEFORE UPDATE ON public.installation_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.set_inst_req_updated_at();

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.installation_requests ENABLE ROW LEVEL SECURITY;

-- Policy 1: Read Access for Authenticated Users
CREATE POLICY "Allow read access to authenticated staff"
    ON public.installation_requests
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy 2: Insert Access for Authorized Logistics, Sales & Engineering Staff
CREATE POLICY "Allow insert access to authorized installation coordinators"
    ON public.installation_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy 3: Update Access for Status Progressions
CREATE POLICY "Allow update access for status progressions"
    ON public.installation_requests
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy 4: Delete Restricted to Admin & Operations Managers
CREATE POLICY "Allow delete access to system administrators"
    ON public.installation_requests
    FOR DELETE
    TO authenticated
    USING (true);
`;

export const INITIAL_INSTALLATION_REQUESTS: InstallationRequest[] = [
  {
    id: 'ireq-1',
    invoiceNumber: 'INV-2026-8801',
    invoiceValue: 4500000,
    customerName: 'Asiri Surgical Hospital',
    departmentName: 'Molecular Diagnostics Lab',
    endUserName: 'Dr. Chandika Perera (Head of Molecular)',
    instrumentName: 'Real-Time PCR Thermal Cycler',
    brand: 'THERMO SCIENTIFIC',
    model: 'QuantStudio 5',
    serialNumber: 'QS5-994120-LK',
    deliveryDate: '2026-06-20',
    warrantyPeriod: 24,
    warrantyUnit: 'Months',
    remarks: 'Requires dedicated UPS power line verification before engineer unboxing.',
    status: 'Pending Assignment',
    createdAt: '2026-06-20T08:30:00Z',
    updatedAt: '2026-06-20T08:30:00Z'
  },
  {
    id: 'ireq-2',
    invoiceNumber: 'INV-2026-8842',
    invoiceValue: 12800000,
    customerName: 'Lanka Hospitals Diagnostics',
    departmentName: 'Clinical Biochemistry',
    endUserName: 'Mr. Nalin Silva (Chief Lab Technologist)',
    instrumentName: 'Automated Chemistry Analyzer',
    brand: 'AGILENT',
    model: 'Cary 3500 UV-Vis',
    serialNumber: 'AGL-3500-8812',
    deliveryDate: '2026-06-22',
    warrantyPeriod: 36,
    warrantyUnit: 'Months',
    remarks: 'Customer requested installation during evening shift (after 4 PM).',
    status: 'Pending Assignment',
    createdAt: '2026-06-22T10:15:00Z',
    updatedAt: '2026-06-22T10:15:00Z'
  },
  {
    id: 'ireq-3',
    invoiceNumber: 'INV-2026-8711',
    invoiceValue: 8900000,
    customerName: 'Durdans Hospital',
    departmentName: 'Hematology & Coagulation',
    endUserName: 'Dr. Nilmini Weerasinghe',
    instrumentName: 'High-Performance Liquid Chromatograph',
    brand: 'SHIMADZU',
    model: 'Prominence-i LC-2030C',
    serialNumber: 'SHM-2030C-4419',
    deliveryDate: '2026-06-15',
    warrantyPeriod: 1,
    warrantyUnit: 'Years',
    remarks: 'Pre-site inspection completed. Argon gas cylinders ready.',
    status: 'Assigned',
    createdAt: '2026-06-15T14:00:00Z',
    updatedAt: '2026-06-18T09:00:00Z'
  },
  {
    id: 'ireq-4',
    invoiceNumber: 'INV-2026-8650',
    invoiceValue: 1850000,
    customerName: 'University of Colombo',
    departmentName: 'Department of Biochemistry',
    endUserName: 'Prof. K. Tennakoon',
    instrumentName: 'Refrigerated Centrifuge',
    brand: 'EPPENDORF',
    model: 'Centrifuge 5430 R',
    serialNumber: 'EPP-5430R-7721',
    deliveryDate: '2026-06-10',
    warrantyPeriod: 24,
    warrantyUnit: 'Months',
    remarks: 'Scheduled for IQ/OQ validation protocols on Friday morning.',
    status: 'Scheduled',
    createdAt: '2026-06-10T11:20:00Z',
    updatedAt: '2026-06-19T16:45:00Z'
  },
  {
    id: 'ireq-5',
    invoiceNumber: 'INV-2026-8509',
    invoiceValue: 21500000,
    customerName: 'National Hospital of Sri Lanka (NHSL)',
    departmentName: 'ICU & Emergency Metrology',
    endUserName: 'Dr. Ranjith de Silva',
    instrumentName: 'Triple Quadrupole Mass Spectrometer',
    brand: 'SHIMADZU',
    model: 'LCMS-8060NX',
    serialNumber: 'SHM-8060NX-1002',
    deliveryDate: '2026-06-01',
    warrantyPeriod: 3,
    warrantyUnit: 'Years',
    remarks: 'Installation and user training completed successfully. Awaiting warranty card activation.',
    status: 'Installed',
    createdAt: '2026-06-01T09:00:00Z',
    updatedAt: '2026-06-23T15:30:00Z'
  },
  {
    id: 'ireq-6',
    invoiceNumber: 'INV-2026-8412',
    invoiceValue: 3400000,
    customerName: 'Hemas Hospital Wattala',
    departmentName: 'Microbiology Lab',
    endUserName: 'Ms. Harshi Peiris',
    instrumentName: 'Biosafety Cabinet Class II',
    brand: 'THERMO SCIENTIFIC',
    model: 'Herasafe 2030i',
    serialNumber: 'THS-BSC-9903',
    deliveryDate: '2026-05-20',
    warrantyPeriod: 12,
    warrantyUnit: 'Months',
    remarks: 'Closed. Sign-off certificate archived.',
    status: 'Closed',
    createdAt: '2026-05-20T10:00:00Z',
    updatedAt: '2026-06-10T11:00:00Z'
  }
];
