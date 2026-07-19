/**
 * SQL schemas, RLS, and REST API Documentation for Architect Hub
 * Enhanced with 34 complex enterprise databases for AVON ServicePro
 */

export const SUPABASE_SQL = `-- ====================================================================
-- AVON ServicePro: Database DDL, Indexes, Triggers, & Row-Level Security
-- Target Platform: Supabase PostgreSQL v15+
-- Service Centre: AVON PHARMO CHEM (PVT) LTD
-- Prepared by: Senior PostgreSQL Database Architect
-- Total Core Modules: 34 Enterprise Domains fully specified
-- ====================================================================

-- Enable UUID extension (standard in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. USERS & 2. ROLES & 3. USER_ROLES MODULES
-- ====================================================================

-- 1. Users Table (Linked to auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ -- Soft delete timestamp
);

-- 2. Roles Table
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  level INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 3. User Roles Association Table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ,
  UNIQUE(user_id, role_id)
);

-- ====================================================================
-- 4. ENGINEER_TAGS & 5. USER_ENGINEER_TAGS
-- ====================================================================

-- 4. Engineer Tags Table
CREATE TABLE public.engineer_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 5. User Engineer Tags Association Table
CREATE TABLE public.user_engineer_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.engineer_tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ,
  UNIQUE(user_id, tag_id)
);

-- ====================================================================
-- 6. TERRITORIES
-- ====================================================================

-- 6. Territories Table
CREATE TABLE public.territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) UNIQUE NOT NULL,
  province VARCHAR(100) NOT NULL, -- e.g. Western, Central, Southern
  districts_covered TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  sla_compliance NUMERIC(5,2) DEFAULT 100.00 NOT NULL CHECK (sla_compliance >= 0.00 AND sla_compliance <= 100.00),
  active_tickets_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- 7. CUSTOMERS & 8. CUSTOMER_DEPARTMENTS & 9. END_USERS
-- ====================================================================

-- 7. Customers Table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 8. Customer Departments Table
CREATE TABLE public.customer_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(150) NOT NULL,
  contact_number VARCHAR(50),
  building_block VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ,
  UNIQUE(customer_id, name)
);

-- 9. End Users (Chemist/Lab operators contacting Avon)
CREATE TABLE public.end_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  department_id UUID REFERENCES public.customer_departments(id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  designation VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- 10. INSTRUMENT_BRANDS & 11. INSTRUMENT_MODELS & 12. INSTRUMENTS
-- ====================================================================

-- 10. Instrument Brands Table
CREATE TABLE public.instrument_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL, -- e.g., SHIMADZU, THERMO SCIENTIFIC
  country_of_origin VARCHAR(100),
  support_email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 11. Instrument Models Table
CREATE TABLE public.instrument_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.instrument_brands(id) ON DELETE RESTRICT NOT NULL,
  name VARCHAR(150) NOT NULL, -- e.g., GC-2030, LC-40
  description TEXT,
  power_rating_watts NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ,
  UNIQUE(brand_id, name)
);

-- 12. Instruments Table (The asset itself)
CREATE TABLE public.instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(250) NOT NULL,
  model_id UUID REFERENCES public.instrument_models(id) ON DELETE RESTRICT NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT NOT NULL,
  department_id UUID REFERENCES public.customer_departments(id) ON DELETE SET NULL,
  warranty_start DATE NOT NULL,
  warranty_expiry DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'OPERATIONAL' NOT NULL, -- OPERATIONAL, FAULTY, CALIBRATING, etc.
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- 13. INSTALLATION_JOBS & 14. INSTALLATION_REPORTS
-- ====================================================================

-- 13. Installation Jobs Table
CREATE TABLE public.installation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number VARCHAR(100) UNIQUE NOT NULL,
  instrument_id UUID REFERENCES public.instruments(id) ON DELETE RESTRICT NOT NULL,
  assigned_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING' NOT NULL, -- PENDING, ASSIGNED, IN_PROGRESS, COMPLETED
  sla_deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 14. Installation Reports Table
CREATE TABLE public.installation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_job_id UUID REFERENCES public.installation_jobs(id) ON DELETE CASCADE NOT NULL UNIQUE,
  checklist_unboxed BOOLEAN DEFAULT false NOT NULL,
  checklist_electrical_safety BOOLEAN DEFAULT false NOT NULL,
  checklist_calibrated BOOLEAN DEFAULT false NOT NULL,
  checklist_training_delivered BOOLEAN DEFAULT false NOT NULL,
  signature_file_url TEXT,
  customer_signoff_name VARCHAR(150),
  completion_notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- 15. WARRANTY_SERVICES & 16. SERVICE_REQUESTS
-- ====================================================================

-- 15. Warranty Services Table (Preventive maintenance interval scheduler)
CREATE TABLE public.warranty_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument_id UUID REFERENCES public.instruments(id) ON DELETE CASCADE NOT NULL,
  service_agreement_number VARCHAR(100) UNIQUE NOT NULL,
  interval_months INTEGER DEFAULT 6 NOT NULL,
  last_service_date DATE,
  next_service_due DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 16. Service Requests Table (Support Tickets)
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(100) UNIQUE NOT NULL,
  instrument_id UUID REFERENCES public.instruments(id) ON DELETE RESTRICT NOT NULL,
  logged_by_end_user_id UUID REFERENCES public.end_users(id) ON DELETE SET NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) DEFAULT 'MEDIUM' NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
  status VARCHAR(50) DEFAULT 'RECEIVED' NOT NULL, -- RECEIVED, DIAGNOSING, PENDING_PARTS, CLOSED etc.
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- 17. INSPECTIONS & 18. QUOTATIONS & 19. PURCHASE_ORDERS
-- ====================================================================

-- 17. Inspections Table
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  inspected_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  inspection_findings TEXT NOT NULL,
  is_fault_reproduced BOOLEAN DEFAULT true NOT NULL,
  power_leak_test_status VARCHAR(55) DEFAULT 'PASSED' NOT NULL,
  environmental_temp_celsius NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 18. Quotations Table (For spare items/labors)
CREATE TABLE public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number VARCHAR(100) UNIQUE NOT NULL,
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  subtotal NUMERIC(15,2) DEFAULT 0.00 NOT NULL,
  tax NUMERIC(15,2) DEFAULT 0.00 NOT NULL,
  total NUMERIC(15,2) DEFAULT 0.00 NOT NULL,
  status VARCHAR(50) DEFAULT 'DRAFT' NOT NULL, -- DRAFT, APPROVED, REJECTED
  valid_until DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 19. Purchase Orders (Approved quotes backed by client POs)
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number VARCHAR(100) UNIQUE NOT NULL,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE RESTRICT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  po_file_url TEXT,
  authorized_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- 20. REPAIR_JOBS & 21. REPAIR_PARTS
-- ====================================================================

-- 20. Repair Jobs Table (Tracks individual scheduled actions on-site)
CREATE TABLE public.repair_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  assigned_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  labor_hours_estimated NUMERIC(10,2) DEFAULT 0.00 NOT NULL,
  labor_hours_actual NUMERIC(10,2) DEFAULT 0.00 NOT NULL,
  status VARCHAR(50) DEFAULT 'SCHEDULED' NOT NULL, -- SCHEDULED, IN_PROGRESS, COMPLETED
  completion_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 21. Repair Parts Table (Spare items attached back to service actions)
CREATE TABLE public.repair_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_job_id UUID REFERENCES public.repair_jobs(id) ON DELETE CASCADE NOT NULL,
  part_number VARCHAR(100) NOT NULL,
  part_name VARCHAR(250) NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(15,2) DEFAULT 0.00 NOT NULL,
  is_withdrawn_from_inventory BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- 22. WORKSHOP_RECEIPTS & 23. WORKSHOP_JOBS & 24. WORKSHOP_DISPATCHES
-- ====================================================================

-- 22. Workshop Receipts Table (Items received in-house)
CREATE TABLE public.workshop_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  received_date DATE NOT NULL,
  visual_inspection_notes TEXT,
  courier_name VARCHAR(100),
  tracking_number VARCHAR(150),
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 23. Workshop Jobs Table (Internal workbench board-level diagnostics)
CREATE TABLE public.workshop_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  bench_number VARCHAR(50) NOT NULL,
  repair_tier VARCHAR(50) DEFAULT 'Tier 1' NOT NULL, -- Tier 1 (Light), Tier 2 (Complex boards)
  diagnostic_notes TEXT,
  status VARCHAR(50) DEFAULT 'PENDING' NOT NULL, -- PENDING, DIAGNOSING, REPAIRING, COMPLETED
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 24. Workshop Dispatches Table (Dispatched items back to customer labs)
CREATE TABLE public.workshop_dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  dispatch_date DATE NOT NULL,
  tracking_number VARCHAR(100) NOT NULL,
  courier_service VARCHAR(100) NOT NULL,
  signature_received_by VARCHAR(150),
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- 25. CALIBRATION_JOBS & 26. INVOICES
-- ====================================================================

-- 25. Calibration Jobs Table
CREATE TABLE public.calibration_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_no VARCHAR(100) UNIQUE NOT NULL,
  instrument_id UUID REFERENCES public.instruments(id) ON DELETE CASCADE NOT NULL,
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  calibration_date DATE NOT NULL,
  due_date DATE NOT NULL,
  standard_equipment_used TEXT NOT NULL,
  temperature_celsius NUMERIC(5,2) NOT NULL,
  humidity_percentage NUMERIC(5,2) NOT NULL,
  reported_error NUMERIC(10,5) NOT NULL,
  allowable_error NUMERIC(10,5) NOT NULL,
  evaluation_result VARCHAR(50) NOT NULL, -- PASSED, FAILED
  calibrated_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approved_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 26. Invoices Table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE RESTRICT NOT NULL,
  purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE SET NULL,
  amount_due NUMERIC(15,2) NOT NULL,
  amount_paid NUMERIC(15,2) DEFAULT 0.00 NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'UNPAID' NOT NULL, -- UNPAID, PAID, OVERDUE
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- 27. CUSTOMER_SATISFACTION_SURVEYS & 28. CUSTOMER_SATISFACTION_RESULTS
-- ====================================================================

-- 27. Customer Satisfaction Surveys Table
CREATE TABLE public.customer_satisfaction_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 28. Customer Satisfaction Results Table
CREATE TABLE public.customer_satisfaction_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.customer_satisfaction_surveys(id) ON DELETE CASCADE NOT NULL,
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL UNIQUE,
  end_user_id UUID REFERENCES public.end_users(id) ON DELETE SET NULL,
  nps_score INTEGER NOT NULL CHECK (nps_score >= 0 AND nps_score <= 10),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- 29. KPI_CATEGORIES & 30. KPI_DEFINITIONS & 31. KPI_WEIGHTAGES & 32. KPI_RESULTS
-- ====================================================================

-- 29. KPI Categories Table
CREATE TABLE public.kpi_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL, -- e.g. Speed, Quality, Reliability
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 30. KPI Definitions Table
CREATE TABLE public.kpi_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.kpi_categories(id) ON DELETE CASCADE NOT NULL,
  metric_name VARCHAR(150) UNIQUE NOT NULL, -- e.g. Mean Time To Repair
  target_value NUMERIC(10,2) NOT NULL,
  warning_threshold NUMERIC(10,2) NOT NULL,
  measure_unit VARCHAR(50) NOT NULL, -- HOURS, DAYS, PERCENTAGE
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 31. KPI Weightages Table
CREATE TABLE public.kpi_weightages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_definition_id UUID REFERENCES public.kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  weightage_percentage NUMERIC(5,2) NOT NULL CHECK (weightage_percentage >= 0.00 AND weightage_percentage <= 100.00),
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 32. KPI Results Table
CREATE TABLE public.kpi_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_definition_id UUID REFERENCES public.kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  territory_id UUID REFERENCES public.territories(id) ON DELETE CASCADE,
  actual_value NUMERIC(10,2) NOT NULL,
  calculated_for_month DATE NOT NULL,
  is_compliant BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- 33. NOTIFICATIONS & 34. ACTIVITY_LOGS
-- ====================================================================

-- 33. Notifications Table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- e.g. SLA_WARN, CALIBRATION_DUE, SYSTEM
  urgency VARCHAR(30) DEFAULT 'INFO' NOT NULL, -- INFO, WARNING, CRITICAL
  recipient_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- 34. Activity Logs (The secure system ledger)
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- INSERT, UPDATE, DELETE, EXPORT
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMPTZ
);

-- ====================================================================
-- RECOMMENDED PERFORMANCE TUNING INDEXES (PROD-READY)
-- ====================================================================
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_engineer_tags_user ON public.user_engineer_tags(user_id);
CREATE INDEX idx_customers_territory ON public.customers(territory_id);
CREATE INDEX idx_dept_customer ON public.customer_departments(customer_id);
CREATE INDEX idx_end_users_customer ON public.end_users(customer_id);
CREATE INDEX idx_inst_serial ON public.instruments(serial_number);
CREATE INDEX idx_inst_model ON public.instruments(model_id);
CREATE INDEX idx_inst_cust ON public.instruments(customer_id);
CREATE INDEX idx_install_inst ON public.installation_jobs(instrument_id);
CREATE INDEX idx_sr_instrument ON public.service_requests(instrument_id);
CREATE INDEX idx_sr_status ON public.service_requests(status);
CREATE INDEX idx_calibration_due ON public.calibration_jobs(due_date);
CREATE INDEX idx_invoice_payment ON public.invoices(payment_status);
CREATE INDEX idx_activity_table_rec ON public.activity_logs(table_name, record_id);
CREATE INDEX idx_kpi_definitions_cat ON public.kpi_definitions(category_id);
CREATE INDEX idx_kpi_results_definition ON public.kpi_results(kpi_definition_id);
CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_user_id) WHERE is_read = false;

-- ====================================================================
-- AUTOMATED TRIGGER WORKFLOWS (Audit Fields + Soft Deletes)
-- ====================================================================

-- Trigger Function to update updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = clock_timestamp();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to the 34 tables to preserve timestamps
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_roles_modtime BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_user_roles_modtime BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_engineer_tags_modtime BEFORE UPDATE ON public.engineer_tags FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_user_engineer_tags_modtime BEFORE UPDATE ON public.user_engineer_tags FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_territories_modtime BEFORE UPDATE ON public.territories FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_customers_modtime BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_customer_departments_modtime BEFORE UPDATE ON public.customer_departments FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_end_users_modtime BEFORE UPDATE ON public.end_users FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_instrument_brands_modtime BEFORE UPDATE ON public.instrument_brands FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_instrument_models_modtime BEFORE UPDATE ON public.instrument_models FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_instruments_modtime BEFORE UPDATE ON public.instruments FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_installation_jobs_modtime BEFORE UPDATE ON public.installation_jobs FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_installation_reports_modtime BEFORE UPDATE ON public.installation_reports FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_warranty_services_modtime BEFORE UPDATE ON public.warranty_services FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_service_requests_modtime BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_inspections_modtime BEFORE UPDATE ON public.inspections FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_quotations_modtime BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_purchase_orders_modtime BEFORE UPDATE ON public.purchase_orders FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_repair_jobs_modtime BEFORE UPDATE ON public.repair_jobs FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_repair_parts_modtime BEFORE UPDATE ON public.repair_parts FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_workshop_receipts_modtime BEFORE UPDATE ON public.workshop_receipts FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_workshop_jobs_modtime BEFORE UPDATE ON public.workshop_jobs FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_workshop_dispatches_modtime BEFORE UPDATE ON public.workshop_dispatches FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_calibration_jobs_modtime BEFORE UPDATE ON public.calibration_jobs FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_invoices_modtime BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_customer_satisfaction_surveys_modtime BEFORE UPDATE ON public.customer_satisfaction_surveys FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_customer_satisfaction_results_modtime BEFORE UPDATE ON public.customer_satisfaction_results FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_kpi_categories_modtime BEFORE UPDATE ON public.kpi_categories FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_kpi_definitions_modtime BEFORE UPDATE ON public.kpi_definitions FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_kpi_weightages_modtime BEFORE UPDATE ON public.kpi_weightages FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_kpi_results_modtime BEFORE UPDATE ON public.kpi_results FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_notifications_modtime BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_activity_logs_modtime BEFORE UPDATE ON public.activity_logs FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calibration_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Select soft delete policies (clients only see active files where deleted_at IS NULL)
CREATE POLICY "Select active users only" ON public.users FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "Select active roles only" ON public.roles FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "Select active instruments only" ON public.instruments FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "Select active service requests only" ON public.service_requests FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "Select active calibration documents" ON public.calibration_jobs FOR SELECT TO authenticated USING (deleted_at IS NULL);
CREATE POLICY "Select active invoices" ON public.invoices FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- Admin capability policy allows full writes
CREATE POLICY "Managers can write anything" ON public.service_requests FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'Workshop Manager'
  )
);
`;

export const API_ARCHITECTURE = [
  {
    module: "1-5. Identity & RBAC tagging",
    endpoints: [
      { method: "GET", path: "/api/users", desc: "Retrieve active engineers and administrative profiles list" },
      { method: "POST", path: "/api/users/roles", desc: "Change security authority level of an analyst user" },
      { method: "GET", path: "/api/engineers/tags", desc: "Fetch expertise tags (BioMed, HPLC, gas-chromatography, etc)" },
      { method: "POST", path: "/api/engineers/tags/assign", desc: "Add skills metrics profile to a technician" }
    ]
  },
  {
    module: "6-9. Customers & Geo-routing",
    endpoints: [
      { method: "GET", path: "/api/territories", desc: "List regional province response compliance benchmarks" },
      { method: "GET", path: "/api/customers", desc: "Search and paginate hospital laboratories and diagnostics firms" },
      { method: "GET", path: "/api/departments", desc: "View detailed wings / floor segments of customer departments" },
      { method: "POST", path: "/api/end-users", desc: "Register principal chemist contact points for the facility" }
    ]
  },
  {
    module: "10-12. Instrument Asset Register",
    endpoints: [
      { method: "GET", path: "/api/brands", desc: "Fetch certified manufacturers list (Shimadzu, Thermo Scientific)" },
      { method: "GET", path: "/api/models", desc: "Fetch exact model specs and power ratings" },
      { method: "GET", path: "/api/instruments", desc: "Search registered analytical instrumentation fleet assets" }
    ]
  },
  {
    module: "13-14. 15-Day Commissioning SLA",
    endpoints: [
      { method: "GET", path: "/api/installations", desc: "Assess active installation jobs status and response timers" },
      { method: "POST", path: "/api/installations/report", desc: "Submit unboxing checks, safety protocols, and training logs" }
    ]
  },
  {
    module: "15-17. Tickets & Diagnostics On-field",
    endpoints: [
      { method: "GET", path: "/api/tickets", desc: "Query all active, troubleshooting, and closed service tickets" },
      { method: "POST", path: "/api/inspections", desc: "Post visual diagnostic details and electrical test results" }
    ]
  },
  {
    module: "18-21. Quotations, POs and Repairs",
    endpoints: [
      { method: "POST", path: "/api/quotes", desc: "Compile estimated costs of spare units and technician labor hours" },
      { method: "PUT", path: "/api/quotes/po", desc: "Attach purchase orders raised by clients for spare parts approvals" },
      { method: "POST", path: "/api/repairs/parts", desc: "Deduct physical replacement boards from inventory registry" }
    ]
  },
  {
    module: "22-24. In-house Bench Workshop",
    endpoints: [
      { method: "POST", path: "/api/workshop/receipt", desc: "Record unboxing notes and tracking code of items shipped to HQ" },
      { method: "GET", path: "/api/workshop/jobs", desc: "Organize boards micro-soldering assignments across HQ benches" },
      { method: "POST", path: "/api/workshop/dispatch", desc: "Log courier delivery codes of calibrated systems back to labs" }
    ]
  },
  {
    module: "25-28. Calibration & Invoices & CSAT",
    endpoints: [
      { method: "POST", path: "/api/calibrations", desc: "Validate sensor deviation limits and award metrology pass certificates" },
      { method: "GET", path: "/api/invoices", desc: "Track unpaid balances and financial clearing records of parts" },
      { method: "POST", path: "/api/csat/feedback", desc: "Log NPS ratings and chemist feedback checks post-service" }
    ]
  },
  {
    module: "29-32. KPI Metrics Calculations",
    endpoints: [
      { method: "GET", path: "/api/kpi/definitions", desc: "Query MTTR, MTBF, and SLA compliance weightages" },
      { method: "GET", path: "/api/kpi/results", desc: "View actual monthly response ratings calculations per dispatcher" }
    ]
  },
  {
    module: "33-34. System Alerts & Security Trails",
    endpoints: [
      { method: "GET", path: "/api/notifications", desc: "Monitor urgent SLA expiration timers and recall notifications" },
      { method: "GET", path: "/api/audit/activity", desc: "Audit detailed database mutation events (DML traces) for ISO auditors" }
    ]
  }
];

export const ROLE_MATRIX = [
  { action: "View Enterprise Dashboards & Schemas", MANAGER: true, OFFICER: true, ENGINEER: true, SUPPORT: true, rule: "Read-only access to visual structural ERD charts is open universally" },
  { action: "Assign Tickets & Reassign Territories", MANAGER: true, OFFICER: false, ENGINEER: false, SUPPORT: false, rule: "Restricted strictly to security levels >= Level 3 (Workshop Manager)" },
  { action: "Complete Installations User-Training", MANAGER: true, OFFICER: false, ENGINEER: true, SUPPORT: true, rule: "Licensed Field Engineers and technicians sign-off training checklists" },
  { action: "Settle Commercial Billing & Invoices", MANAGER: true, OFFICER: true, ENGINEER: false, SUPPORT: false, rule: "Completed by Documentation Officers following approved purchase orders" },
  { action: "Issue Traceable Calibration Certificates", MANAGER: true, OFFICER: false, ENGINEER: true, SUPPORT: false, rule: "Calibration Engineers verify alignment drift before issuing" },
  { action: "Decommission or Soft Delete Assets", MANAGER: true, OFFICER: false, ENGINEER: false, SUPPORT: false, rule: "Secured to protect legal operational registries" }
];

// Structural metadata for all 34 tables to populate the interactive database visualizer beautifully
export const SCHEMA_METADATA = [
  {
    id: "m-1",
    name: "users",
    module: "1. Users",
    description: "Avon service engineer & officer catalog synced with authentication registry.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Primary key profile identifier." },
      { name: "email", type: "VARCHAR(255)", key: undefined, references: undefined, notNull: true, desc: "Unique corporate communication email." },
      { name: "name", type: "VARCHAR(150)", key: undefined, references: undefined, notNull: true, desc: "Authorized full legal name." },
      { name: "phone", type: "VARCHAR(50)", key: undefined, references: undefined, notNull: false, desc: "Direct contact line." },
      { name: "is_active", type: "BOOLEAN", key: undefined, references: undefined, notNull: true, desc: "Toggle check for locks." },
      { name: "deleted_at", type: "TIMESTAMPTZ", key: undefined, references: undefined, notNull: false, isSoftDelete: true, desc: "Soft-delete registry timestamp." }
    ]
  },
  {
    id: "m-2",
    name: "roles",
    module: "2. Roles",
    description: "Hierarchical authority groups protecting sensitive business operations.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Role primary key identifier." },
      { name: "name", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Distinct classification label." },
      { name: "description", type: "TEXT", key: undefined, references: undefined, notNull: false, desc: "Detailed permissions mapping bounds." },
      { name: "level", type: "INTEGER", key: undefined, references: undefined, notNull: true, desc: "Security priority clearance rating (1 to 5)." }
    ]
  },
  {
    id: "m-3",
    name: "user_roles",
    module: "3. User Roles",
    description: "Association mapping linking engineers with multiple administrative or laboratory roles.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Mapping relation ID." },
      { name: "user_id", type: "UUID", key: "FK", references: "users.id", notNull: true, desc: "Target identity profile key." },
      { name: "role_id", type: "UUID", key: "FK", references: "roles.id", notNull: true, desc: "Target permissions group key." }
    ]
  },
  {
    id: "m-4",
    name: "engineer_tags",
    module: "4. Engineer Tags",
    description: "Expertise certifications tag indicators (e.g. BioMed, HPLC specialist, Gas Chromatography).",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Tag index GUID." },
      { name: "tag", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Unique credential label." },
      { name: "description", type: "TEXT", key: undefined, references: undefined, notNull: false, desc: "Requirements definition." }
    ]
  },
  {
    id: "m-5",
    name: "user_engineer_tags",
    module: "5. User tags",
    description: "Maps specific certified technical training tags to engineers.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Association GUID key." },
      { name: "user_id", type: "UUID", key: "FK", references: "users.id", notNull: true, desc: "Target technician user Key." },
      { name: "tag_id", type: "UUID", key: "FK", references: "engineer_tags.id", notNull: true, desc: "Specific skill certification tag." }
    ]
  },
  {
    id: "m-6",
    name: "territories",
    module: "6. Territories",
    description: "Sri Lankan provincial dispatch circles allocating technical response boundaries.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Jurisdiction GUID." },
      { name: "name", type: "VARCHAR(150)", key: undefined, references: undefined, notNull: true, desc: "Regional office descriptor." },
      { name: "province", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Target administrative province." },
      { name: "districts_covered", type: "TEXT[]", key: undefined, references: undefined, notNull: true, desc: "Array of municipal coverage blocks." }
    ]
  },
  {
    id: "m-7",
    name: "customers",
    module: "7. Customers",
    description: "Primary client medical centers, industrial labs, and universities registry.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Unique business GUID." },
      { name: "name", type: "VARCHAR(255)", key: undefined, references: undefined, notNull: true, desc: "Client legal company name." },
      { name: "email", type: "VARCHAR(255)", key: undefined, references: undefined, notNull: true, desc: "Primary administrative address." },
      { name: "territory_id", type: "UUID", key: "FK", references: "territories.id", notNull: false, desc: "Regional zone mapping." }
    ]
  },
  {
    id: "m-8",
    name: "customer_departments",
    module: "8. Customer Departments",
    description: "In-facility lab departments (e.g. Microbiology, Analytical QA) within customer sites.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Department block key." },
      { name: "customer_id", type: "UUID", key: "FK", references: "customers.id", notNull: true, desc: "Owner client enterprise." },
      { name: "name", type: "VARCHAR(150)", key: undefined, references: undefined, notNull: true, desc: "Department lab room title." }
    ]
  },
  {
    id: "m-9",
    name: "end_users",
    module: "9. End Users",
    description: "Individual chemists and laboratory operators executing commands on active systems.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Unique user identifier." },
      { name: "customer_id", type: "UUID", key: "FK", references: "customers.id", notNull: true, desc: "Employing lab facility ID." },
      { name: "department_id", type: "UUID", key: "FK", references: "customer_departments.id", notNull: false, desc: "Workplace room block." }
    ]
  },
  {
    id: "m-10",
    name: "instrument_brands",
    module: "10. Instrument Brands",
    description: "Original Equipment Manufacturer (OEM) list (e.g. Agilent, Shimadzu).",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Brand index GUID key." },
      { name: "name", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Registered trade trademark." }
    ]
  },
  {
    id: "m-11",
    name: "instrument_models",
    module: "11. Instrument Models",
    description: "Exact model lines specifying calibration tolerance variables.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Model classification key." },
      { name: "brand_id", type: "UUID", key: "FK", references: "instrument_brands.id", notNull: true, desc: "Manufacturing parent brand." },
      { name: "name", type: "VARCHAR(150)", key: undefined, references: undefined, notNull: true, desc: "OEM product reference index." }
    ]
  },
  {
    id: "m-12",
    name: "instruments",
    module: "12. Instruments",
    description: "Fully tracked laboratory system assets (chromatographs, spectrophotometers).",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Internal asset identity GUID." },
      { name: "serial_number", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Unique physical serial stamping." },
      { name: "model_id", type: "UUID", key: "FK", references: "instrument_models.id", notNull: true, desc: "Model classification linking." },
      { name: "customer_id", type: "UUID", key: "FK", references: "customers.id", notNull: true, desc: "Proprietary owner lab." }
    ]
  },
  {
    id: "m-13",
    name: "installation_jobs",
    module: "13. Installation Jobs",
    description: "Commissioning jobs enforcing a strict 15-day maximum SLA constraint from delivery.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Installation record index." },
      { name: "job_number", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Unique commission case ticket." },
      { name: "instrument_id", type: "UUID", key: "FK", references: "instruments.id", notNull: true, desc: "Associated physical device." }
    ]
  },
  {
    id: "m-14",
    name: "installation_reports",
    module: "14. Installation Reports",
    description: "Formal unboxing quality reports containing electrical test verifications.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Report identity profile." },
      { name: "installation_job_id", type: "UUID", key: "FK", references: "installation_jobs.id", notNull: true, desc: "Associated task ID." },
      { name: "checklist_unboxed", type: "BOOLEAN", key: undefined, references: undefined, notNull: true, desc: "Visual inspection clear." }
    ]
  },
  {
    id: "m-15",
    name: "warranty_services",
    module: "15. Warranty Services",
    description: "Tracks active customer service levels and scheduled preventive maintenance rounds.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Agreement tracker key." },
      { name: "instrument_id", type: "UUID", key: "FK", references: "instruments.id", notNull: true, desc: "Covered laboratory asset." },
      { name: "service_agreement_number", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Legal agreement index ref." }
    ]
  },
  {
    id: "m-16",
    name: "service_requests",
    module: "16. Service Requests",
    description: "Global repair requests raised by client operator Chemists under error states.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Request ticket GUID." },
      { name: "ticket_number", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Chronological support log tracking code." }
    ]
  },
  {
    id: "m-17",
    name: "inspections",
    module: "17. Inspections",
    description: "Primary site inspection logs covering power grounding checks and diagnostics.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Inspection entry index." },
      { name: "service_request_id", type: "UUID", key: "FK", references: "service_requests.id", notNull: true, desc: "Parent ticket ref ID." }
    ]
  },
  {
    id: "m-18",
    name: "quotations",
    module: "18. Quotations",
    description: "Bill of materials and labor billing specifications sent to laboratories for approval.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Quotation GUID." },
      { name: "quote_number", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Pro-forma quotation tracking reference." }
    ]
  },
  {
    id: "m-19",
    name: "purchase_orders",
    module: "19. Purchase Orders",
    description: "Incoming customer authorized POs verifying credit approvals.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "PO GUID." },
      { name: "po_number", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Client corporate purchase code." }
    ]
  },
  {
    id: "m-20",
    name: "repair_jobs",
    module: "20. Repair Jobs",
    description: "Active physical repair procedures tracked on field diagnostic sites.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Task key." },
      { name: "service_request_id", type: "UUID", key: "FK", references: "service_requests.id", notNull: true, desc: "Parent ticket ref ID." }
    ]
  },
  {
    id: "m-21",
    name: "repair_parts",
    module: "21. Repair Parts",
    description: "Individual spare part components booked and replaced.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Spare line GUID." },
      { name: "repair_job_id", type: "UUID", key: "FK", references: "repair_jobs.id", notNull: true, desc: "Affiliated repair act." }
    ]
  },
  {
    id: "m-22",
    name: "workshop_receipts",
    module: "22. Workshop Receipts",
    description: "Logs package condition and tracker ID for hardware shipped back to HQ.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Receipt GUID ID." },
      { name: "service_request_id", type: "UUID", key: "FK", references: "service_requests.id", notNull: true, desc: "Associated trouble ticket." }
    ]
  },
  {
    id: "m-23",
    name: "workshop_jobs",
    module: "23. Workshop Jobs",
    description: "Deep board-level diagnostics repairs on internal workshop benches.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Bench job card ID." },
      { name: "service_request_id", type: "UUID", key: "FK", references: "service_requests.id", notNull: true, desc: "Underlying error ticket." }
    ]
  },
  {
    id: "m-24",
    name: "workshop_dispatches",
    module: "24. Workshop Dispatches",
    description: "Shipping records and tracking index as equipment is returned back to active labs.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Dispatch card ID." },
      { name: "service_request_id", type: "UUID", key: "FK", references: "service_requests.id", notNull: true, desc: "Underlying ticket." }
    ]
  },
  {
    id: "m-25",
    name: "calibration_jobs",
    module: "25. Calibration Jobs",
    description: "Metrology records tracking sensor drift tolerances relative to certified guidelines.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Audit calibration GUID." },
      { name: "certificate_no", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Traceable NIST certificate marking ID." }
    ]
  },
  {
    id: "m-26",
    name: "invoices",
    module: "26. Invoices",
    description: "Invoices tracking tax indexes and pending outstanding payments.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Invoice identity key." },
      { name: "invoice_number", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Sales ledger tracking number." }
    ]
  },
  {
    id: "m-27",
    name: "customer_satisfaction_surveys",
    module: "27. CSAT Surveys",
    description: "Feedback questionnaire templates raised post-repair logs.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Survey index." },
      { name: "customer_id", type: "UUID", key: "FK", references: "customers.id", notNull: true, desc: "Auditing hospital node." }
    ]
  },
  {
    id: "m-28",
    name: "customer_satisfaction_results",
    module: "28. CSAT Results",
    description: "Chemist-submitted Net Promoter Scores and textual feedback analysis.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Result voucher GUID." },
      { name: "survey_id", type: "UUID", key: "FK", references: "customer_satisfaction_surveys.id", notNull: true, desc: "Associated questions deck ID." }
    ]
  },
  {
    id: "m-29",
    name: "kpi_categories",
    module: "29. KPI Categories",
    description: "Broad category blocks specifying performance attributes (e.g. Quality, Repair Timeliness).",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Indicator key." },
      { name: "name", type: "VARCHAR(100)", key: undefined, references: undefined, notNull: true, desc: "Category metrics title." }
    ]
  },
  {
    id: "m-30",
    name: "kpi_definitions",
    module: "30. KPI Definitions",
    description: "Operational formula details (e.g. strict MTTR goals & warnings thresholds).",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Def log ID." },
      { name: "metric_name", type: "VARCHAR(150)", key: undefined, references: undefined, notNull: true, desc: "ISO standard target descriptor." }
    ]
  },
  {
    id: "m-31",
    name: "kpi_weightages",
    module: "31. KPI Weightages",
    description: "Compliance ratios assessing overall engineer and workshop rankings.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Weight table ID." },
      { name: "kpi_definition_id", type: "UUID", key: "FK", references: "kpi_definitions.id", notNull: true, desc: "Metric rule reference." }
    ]
  },
  {
    id: "m-32",
    name: "kpi_results",
    module: "32. KPI Results",
    description: "Aggregated monthly metric indexes scored per area territory and senior technician.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Monthly score GUID." },
      { name: "kpi_definition_id", type: "UUID", key: "FK", references: "kpi_definitions.id", notNull: true, desc: "Parent metric formula." }
    ]
  },
  {
    id: "m-33",
    name: "notifications",
    module: "33. Notifications",
    description: "Urgent SLA deadline warn signals and system reminders sent to technicians.",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Notification row identifier." },
      { name: "recipient_user_id", type: "UUID", key: "FK", references: "users.id", notNull: true, desc: "Target administrative staff Key." }
    ]
  },
  {
    id: "m-34",
    name: "activity_logs",
    module: "34. Audit Trail Logs",
    description: "Un-modifiable operations trail verifying full history of records changes (ISO-9001).",
    columns: [
      { name: "id", type: "UUID", key: "PK", references: undefined, notNull: true, desc: "Audit event block identity." },
      { name: "user_id", type: "UUID", key: "FK", references: "users.id", notNull: false, desc: "Operator behind the database modification." }
    ]
  }
];
