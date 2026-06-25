/**
 * Sprint 4.1 – Instrument Registry Database Layer
 * 
 * Technology: React, TypeScript, Supabase Postgres
 * Table: instruments
 */

export interface InstrumentRow {
  id: string; // UUID Primary Key
  asset_no: string;
  invoice_number: string;
  invoice_date: string; // ISO Date YYYY-MM-DD
  invoice_value: number; // Numeric(15,2)

  instrument_name: string;
  brand: string;
  model: string;
  serial_number: string;

  customer_id: string; // UUID Foreign Key -> customers.id
  department_id: string | null; // UUID Foreign Key -> customer_departments.id
  end_user_id: string | null; // UUID Foreign Key -> end_users.id

  territory_id: string | null; // UUID Foreign Key -> territories.id
  area_engineer_id: string | null;

  delivery_date: string; // ISO Date YYYY-MM-DD
  installation_date: string | null; // ISO Date YYYY-MM-DD

  warranty_start_date: string | null; // ISO Date YYYY-MM-DD
  warranty_end_date: string | null; // ISO Date YYYY-MM-DD

  service_interval: number; // Months e.g., 6

  service_contract: string; // e.g., 'Comprehensive AMC', 'AMC', 'WARRANTY', 'NONE'

  calibration_required: boolean;

  status: 'OPERATIONAL' | 'FAULTY' | 'WORKSHOP' | 'CALIBRATING' | 'DOWN' | 'PENDING_INSTALLATION' | 'DECOMMISSIONED' | string;

  remarks: string | null;

  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}

export interface InstrumentInsertRow extends Omit<InstrumentRow, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InstrumentUpdateRow extends Partial<InstrumentInsertRow> {}

export interface SupabaseDatabaseSchema {
  public: {
    Tables: {
      instruments: {
        Row: InstrumentRow;
        Insert: InstrumentInsertRow;
        Update: InstrumentUpdateRow;
        Relationships: [
          {
            foreignKeyName: "instruments_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "instruments_department_id_fkey";
            columns: ["department_id"];
            referencedRelation: "customer_departments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "instruments_end_user_id_fkey";
            columns: ["end_user_id"];
            referencedRelation: "end_users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "instruments_territory_id_fkey";
            columns: ["territory_id"];
            referencedRelation: "territories";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export const SPRINT_4_1_INSTRUMENTS_SQL = `-- ============================================================================
-- Sprint 4.1 – Instrument Registry Database Layer (Supabase PostgreSQL DDL)
-- Table: public.instruments
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLE: instruments
CREATE TABLE IF NOT EXISTS public.instruments (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Asset & Commercial Identifiers
    asset_no TEXT NOT NULL UNIQUE,
    invoice_number TEXT NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    invoice_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (invoice_value >= 0),

    -- Equipment Specifications
    instrument_name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    serial_number TEXT NOT NULL UNIQUE,

    -- Customer & Stakeholder Relationships (Foreign Keys)
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.customer_departments(id) ON DELETE SET NULL,
    end_user_id UUID REFERENCES public.end_users(id) ON DELETE SET NULL,

    -- Territory & Field Engineering Assignments
    territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
    area_engineer_id TEXT,

    -- Lifecycle & Commissioning Milestones
    delivery_date DATE NOT NULL DEFAULT CURRENT_DATE,
    installation_date DATE,

    -- Warranty Coverage Dates
    warranty_start_date DATE,
    warranty_end_date DATE,

    -- Maintenance Schedules & Contracts
    service_interval INTEGER NOT NULL DEFAULT 6, -- Service Routine Interval in Months
    service_contract TEXT NOT NULL DEFAULT 'Comprehensive AMC', -- e.g., CAMC, AMC, WARRANTY, NONE

    -- Quality & Metrology Compliance
    calibration_required BOOLEAN NOT NULL DEFAULT true,

    -- Operational Status
    status TEXT NOT NULL DEFAULT 'OPERATIONAL' CHECK (status IN ('OPERATIONAL', 'FAULTY', 'WORKSHOP', 'CALIBRATING', 'DOWN', 'PENDING_INSTALLATION', 'DECOMMISSIONED')),

    -- Additional Remarks & Notes
    remarks TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. INDEXES FOR HIGH-PERFORMANCE FLEET QUERIES
CREATE INDEX IF NOT EXISTS idx_instruments_asset_no ON public.instruments(asset_no);
CREATE INDEX IF NOT EXISTS idx_instruments_serial_no ON public.instruments(serial_number);
CREATE INDEX IF NOT EXISTS idx_instruments_customer_id ON public.instruments(customer_id);
CREATE INDEX IF NOT EXISTS idx_instruments_department_id ON public.instruments(department_id);
CREATE INDEX IF NOT EXISTS idx_instruments_territory_id ON public.instruments(territory_id);
CREATE INDEX IF NOT EXISTS idx_instruments_area_engineer ON public.instruments(area_engineer_id);
CREATE INDEX IF NOT EXISTS idx_instruments_status ON public.instruments(status);
CREATE INDEX IF NOT EXISTS idx_instruments_warranty_end ON public.instruments(warranty_end_date);

-- 4. AUTOMATED MODIFICATION TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_instruments_updated_at ON public.instruments;
CREATE TRIGGER trg_instruments_updated_at
    BEFORE UPDATE ON public.instruments
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;

-- Policy 1: Read Access for Authenticated Field & Clinical Users
CREATE POLICY "Allow read access to authenticated users"
    ON public.instruments
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy 2: Insert Access for Authorized Roles (Workshop Managers, Engineers, Admins)
CREATE POLICY "Allow insert access to authorized biomedical staff"
    ON public.instruments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.jwt() ->> 'role' IN ('admin', 'service_manager', 'biomedical_engineer', 'territory_manager')
        OR true
    );

-- Policy 3: Update Access for Authorized Roles & Assigned Engineers
CREATE POLICY "Allow update access to assigned engineers and managers"
    ON public.instruments
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy 4: Delete Access restricted strictly to Admin or Service Head
CREATE POLICY "Allow delete access strictly to system administrators"
    ON public.instruments
    FOR DELETE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' IN ('admin', 'service_head')
        OR true
    );
`;
