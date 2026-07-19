-- ================================================================================================================
-- AVON ServicePro Enterprise Database V1.0 - Clean Master Installation & Restoration Script
-- Company: AVON PHARMO CHEM (PVT) LTD SERVICE CENTRE
-- Scope: All Database Modules (Administration, Warranty Scheduler, Procurement Workflow, Goods Receiving)
-- Target Runtime: Supabase PostgreSQL (Production-Grade, Multi-tenant RLS enabled)
-- Designed by: Lead Enterprise Database Architect
-- ================================================================================================================

-- ================================================================================================================
-- PART 1: RESET EXISTING SYSTEM (DROP ALL TABLES & TYPES CASCADE)
-- ================================================================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trg_sync_user_profiles ON public.user_profiles;

DROP TABLE IF EXISTS public.goods_received_note_items CASCADE;
DROP TABLE IF EXISTS public.goods_received_notes CASCADE;
DROP TABLE IF EXISTS public.purchase_order_items CASCADE;
DROP TABLE IF EXISTS public.purchase_orders CASCADE;
DROP TABLE IF EXISTS public.warranty_service_tasks CASCADE;
DROP TABLE IF EXISTS public.user_engineer_tags CASCADE;
DROP TABLE IF EXISTS public.engineer_tags CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.rbac_role_permissions CASCADE;
DROP TABLE IF EXISTS public.rbac_permissions CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

DROP TYPE IF EXISTS public.avon_role CASCADE;
DROP TYPE IF EXISTS public.engineer_tag CASCADE;

-- ================================================================================================================
-- PART 2: SYSTEM INITIALIZATION & ENUMS
-- ================================================================================================================

-- Enable the UUID extension for generating high-entropy secure identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define custom enums
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

-- ================================================================================================================
-- PART 3: DDL DEFINITIONS - CORE TABLES WITH INLINE CONSTRAINTS
-- ================================================================================================================

-- 3.1 User Profiles Table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(150),
    role VARCHAR(100) DEFAULT 'Technician',
    tags TEXT DEFAULT '[]',
    "avatarUrl" TEXT,
    territory VARCHAR(100),
    "passwordHash" VARCHAR(255),
    full_name VARCHAR(150),
    role_v2 public.avon_role DEFAULT 'Technician'::public.avon_role,
    engineer_tags public.engineer_tag[] DEFAULT '{}'::public.engineer_tag[],
    phone_number VARCHAR(50),
    department VARCHAR(100) DEFAULT 'Field Technical Service',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

-- 3.2 Roles Table
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    level INTEGER DEFAULT 1,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

-- 3.3 Permissions Table
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

-- 3.4 Role Permissions Association Table
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_role_permissions UNIQUE (role_id, permission_id)
);

-- 3.5 User Roles Association Table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_user_roles UNIQUE (user_id, role_id)
);

-- 3.6 Engineer Tags Table
CREATE TABLE public.engineer_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

-- 3.7 User Engineer Tags Association Table
CREATE TABLE public.user_engineer_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.engineer_tags(id) ON DELETE CASCADE,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_user_engineer_tags UNIQUE (user_id, tag_id)
);

-- 3.8 Legacy RBAC Mirror Tables
CREATE TABLE public.rbac_permissions (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE public.rbac_role_permissions (
    roleName VARCHAR(100) NOT NULL,
    permissionId VARCHAR(36) NOT NULL,
    PRIMARY KEY (roleName, permissionId)
);

-- 3.9 Warranty Service Tasks Table
CREATE TABLE public.warranty_service_tasks (
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

-- 3.10 Purchase Orders Table
CREATE TABLE public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(64) UNIQUE NOT NULL,
    supplier_id VARCHAR(64) NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_code VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'Draft',
    sub_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    shipping_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    created_by_id VARCHAR(64) NOT NULL,
    created_by_name VARCHAR(255) NOT NULL,
    created_by_role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    approval_remarks TEXT,
    approved_by_id VARCHAR(64),
    approved_by_name VARCHAR(255),
    approved_at TIMESTAMP WITH TIME ZONE,
    remarks TEXT,
    shipping_terms VARCHAR(255),
    expected_delivery_date DATE,
    CONSTRAINT chk_po_status CHECK (status IN ('Draft', 'Pending Approval', 'Approved', 'Rejected', 'Ordered', 'Partially Received', 'Received', 'Cancelled'))
);

-- 3.11 Purchase Order Items Table
CREATE TABLE public.purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    item_id VARCHAR(64) NOT NULL,
    part_code VARCHAR(64) NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (unit_price >= 0.00),
    total_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (total_price >= 0.00)
);

-- 3.12 Goods Received Notes Table
CREATE TABLE public.goods_received_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grn_number VARCHAR(64) UNIQUE NOT NULL,
    po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE RESTRICT,
    po_number VARCHAR(64) NOT NULL,
    supplier_id VARCHAR(64) NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    delivery_note_number VARCHAR(128),
    invoice_number VARCHAR(128),
    received_by_id VARCHAR(64) NOT NULL,
    received_by_name VARCHAR(255) NOT NULL,
    received_by_role VARCHAR(255) NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'Verified',
    inspection_passed BOOLEAN NOT NULL DEFAULT TRUE,
    remarks TEXT,
    CONSTRAINT chk_grn_status CHECK (status IN ('Draft', 'Submitted', 'Verified', 'Cancelled'))
);

-- 3.13 Goods Received Note Items Table
CREATE TABLE public.goods_received_note_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grn_id UUID NOT NULL REFERENCES public.goods_received_notes(id) ON DELETE CASCADE,
    item_id VARCHAR(64) NOT NULL,
    part_code VARCHAR(64) NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    ordered_qty INT NOT NULL CHECK (ordered_qty >= 0),
    received_qty INT NOT NULL CHECK (received_qty >= 0),
    accepted_qty INT NOT NULL CHECK (accepted_qty >= 0),
    rejected_qty INT NOT NULL CHECK (rejected_qty >= 0),
    remarks TEXT,
    CONSTRAINT chk_qty_acceptance CHECK (accepted_qty + rejected_qty = received_qty)
);

-- ================================================================================================================
-- PART 4: PERFORMANCE INDEXES
-- ================================================================================================================

-- Warranty Tasks Indexes
CREATE INDEX IF NOT EXISTS idx_wst_scheduled_date ON public.warranty_service_tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_wst_status ON public.warranty_service_tasks(status);
CREATE INDEX IF NOT EXISTS idx_wst_engineer ON public.warranty_service_tasks(assigned_area_engineer);
CREATE INDEX IF NOT EXISTS idx_wst_territory ON public.warranty_service_tasks(territory);
CREATE INDEX IF NOT EXISTS idx_wst_customer ON public.warranty_service_tasks(customer_name);

-- Purchase Orders Indexes
CREATE INDEX IF NOT EXISTS idx_po_number ON public.purchase_orders(po_number);
CREATE INDEX IF NOT EXISTS idx_po_status ON public.purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_po_supplier_id ON public.purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_created_at ON public.purchase_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_poi_po_id ON public.purchase_order_items(po_id);
CREATE INDEX IF NOT EXISTS idx_poi_item_id ON public.purchase_order_items(item_id);

-- Goods Received Notes Indexes
CREATE INDEX IF NOT EXISTS idx_grn_number ON public.goods_received_notes(grn_number);
CREATE INDEX IF NOT EXISTS idx_grn_po_id ON public.goods_received_notes(po_id);
CREATE INDEX IF NOT EXISTS idx_grn_po_number ON public.goods_received_notes(po_number);
CREATE INDEX IF NOT EXISTS idx_grn_status ON public.goods_received_notes(status);
CREATE INDEX IF NOT EXISTS idx_grn_received_at ON public.goods_received_notes(received_at);
CREATE INDEX IF NOT EXISTS idx_grni_grn_id ON public.goods_received_note_items(grn_id);
CREATE INDEX IF NOT EXISTS idx_grni_item_id ON public.goods_received_note_items(item_id);

-- ================================================================================================================
-- PART 5: SYNCHRONIZATION TRIGGERS
-- ================================================================================================================

-- 5.1 Trigger to automatically keep V1 and V2 user_profile columns in absolute sync
CREATE OR REPLACE FUNCTION public.sync_user_profiles_columns()
RETURNS TRIGGER AS $$
DECLARE
    tag_item TEXT;
    tag_arr TEXT[] := '{}';
BEGIN
    -- Sync name and full_name
    IF NEW.name IS NULL AND NEW.full_name IS NOT NULL THEN
        NEW.name := NEW.full_name;
    ELSIF NEW.full_name IS NULL AND NEW.name IS NOT NULL THEN
        NEW.full_name := NEW.name;
    END IF;

    -- Sync avatarUrl and avatar_url
    IF NEW.avatarUrl IS NULL AND NEW.avatar_url IS NOT NULL THEN
        NEW.avatarUrl := NEW.avatar_url;
    ELSIF NEW.avatar_url IS NULL AND NEW.avatarUrl IS NOT NULL THEN
        NEW.avatar_url := NEW.avatarUrl;
    END IF;

    -- Sync role string to public.avon_role enum
    IF NEW.role IS NOT NULL THEN
        BEGIN
            NEW.role_v2 := NEW.role::public.avon_role;
        EXCEPTION WHEN OTHERS THEN
            NEW.role_v2 := 'Technician'::public.avon_role;
        END;
    ELSIF NEW.role_v2 IS NOT NULL THEN
        NEW.role := NEW.role_v2::TEXT;
    END IF;

    -- Sync is_active and active booleans
    IF NEW.is_active IS NOT NULL THEN
        NEW.active := NEW.is_active;
    ELSIF NEW.active IS NOT NULL THEN
        NEW.is_active := NEW.active;
    END IF;

    -- Sync tags JSON string and engineer_tags public.engineer_tag[] array
    IF NEW.tags IS NOT NULL AND NEW.tags != '[]' AND (NEW.engineer_tags IS NULL OR array_length(NEW.engineer_tags, 1) IS NULL) THEN
        BEGIN
            FOR tag_item IN SELECT json_array_elements_text(NEW.tags::json) LOOP
                tag_arr := array_append(tag_arr, tag_item::TEXT);
            END LOOP;
            NEW.engineer_tags := tag_arr::public.engineer_tag[];
        EXCEPTION WHEN OTHERS THEN
            -- Suppress JSON parsing errors and leave array empty
        END;
    ELSIF NEW.engineer_tags IS NOT NULL AND (NEW.tags IS NULL OR NEW.tags = '[]') THEN
        -- Parse enum array into JSON string
        NEW.tags := array_to_json(NEW.engineer_tags)::TEXT;
    END IF;

    -- Sync updated_at timestamp
    NEW.updated_at := NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach synchronization trigger
CREATE TRIGGER trg_sync_user_profiles
    BEFORE INSERT OR UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.sync_user_profiles_columns();


-- 5.2 Trigger to automatically create a public.user_profiles record when a user registers on Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_supabase_user()
RETURNS TRIGGER AS $$
DECLARE
    v_full_name TEXT;
    v_role TEXT;
    v_dept TEXT;
BEGIN
    v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'Technician');
    v_dept := COALESCE(NEW.raw_user_meta_data->>'department', 'Field Technical Service');

    INSERT INTO public.user_profiles (
        id, 
        email, 
        name, 
        full_name,
        role, 
        department,
        is_active,
        active
    ) VALUES (
        NEW.id,
        NEW.email,
        v_full_name,
        v_full_name,
        v_role,
        v_dept,
        true,
        true
    ) ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach user creation trigger to auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_supabase_user();


-- ================================================================================================================
-- PART 6: ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================================================================

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engineer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engineer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_service_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_received_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_received_note_items ENABLE ROW LEVEL SECURITY;

-- 6.1 Security helper functions
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS public.avon_role AS $$
    SELECT COALESCE(role_v2, 'Technician'::public.avon_role) FROM public.user_profiles 
    WHERE id = auth.uid() AND active = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_workshop_manager()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND active = true AND role_v2 = 'Workshop Manager'::public.avon_role
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin_officer()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND active = true 
        AND role_v2 IN ('Workshop Manager'::public.avon_role, 'Documentation Officer'::public.avon_role)
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- 6.2 RLS Policies: user_profiles
DROP POLICY IF EXISTS "Allow authenticated users to view active profiles" ON public.user_profiles;
CREATE POLICY "Allow authenticated users to view active profiles"
    ON public.user_profiles FOR SELECT TO authenticated
    USING (active = true OR public.is_workshop_manager());

DROP POLICY IF EXISTS "Allow Workshop Manager to insert profiles" ON public.user_profiles;
CREATE POLICY "Allow Workshop Manager to insert profiles"
    ON public.user_profiles FOR INSERT TO authenticated
    WITH CHECK (public.is_workshop_manager());

DROP POLICY IF EXISTS "Allow profile owners or Workshop Managers to update" ON public.user_profiles;
CREATE POLICY "Allow profile owners or Workshop Managers to update"
    ON public.user_profiles FOR UPDATE TO authenticated
    USING (auth.uid() = id OR public.is_workshop_manager())
    WITH CHECK (auth.uid() = id OR public.is_workshop_manager());

DROP POLICY IF EXISTS "Allow Workshop Manager to delete profiles" ON public.user_profiles;
CREATE POLICY "Allow Workshop Manager to delete profiles"
    ON public.user_profiles FOR DELETE TO authenticated
    USING (public.is_workshop_manager());


-- 6.3 RLS Policies: roles
DROP POLICY IF EXISTS "Allow select for roles" ON public.roles;
CREATE POLICY "Allow select for roles" ON public.roles FOR SELECT TO authenticated USING (active = true);

DROP POLICY IF EXISTS "Allow change for managers on roles" ON public.roles;
CREATE POLICY "Allow change for managers on roles" ON public.roles FOR ALL TO authenticated USING (public.is_workshop_manager());


-- 6.4 RLS Policies: permissions & role_permissions
DROP POLICY IF EXISTS "Allow select for permissions" ON public.permissions;
CREATE POLICY "Allow select for permissions" ON public.permissions FOR SELECT TO authenticated USING (active = true);

DROP POLICY IF EXISTS "Allow change for managers on permissions" ON public.permissions;
CREATE POLICY "Allow change for managers on permissions" ON public.permissions FOR ALL TO authenticated USING (public.is_workshop_manager());

DROP POLICY IF EXISTS "Allow select for role_permissions" ON public.role_permissions;
CREATE POLICY "Allow select for role_permissions" ON public.role_permissions FOR SELECT TO authenticated USING (active = true);

DROP POLICY IF EXISTS "Allow change for managers on role_permissions" ON public.role_permissions;
CREATE POLICY "Allow change for managers on role_permissions" ON public.role_permissions FOR ALL TO authenticated USING (public.is_workshop_manager());


-- 6.5 RLS Policies: user_roles
DROP POLICY IF EXISTS "Allow select for user_roles" ON public.user_roles;
CREATE POLICY "Allow select for user_roles" ON public.user_roles FOR SELECT TO authenticated USING (active = true);

DROP POLICY IF EXISTS "Allow change for managers on user_roles" ON public.user_roles;
CREATE POLICY "Allow change for managers on user_roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_workshop_manager());


-- 6.6 RLS Policies: engineer_tags & user_engineer_tags
DROP POLICY IF EXISTS "Allow select for engineer_tags" ON public.engineer_tags;
CREATE POLICY "Allow select for engineer_tags" ON public.engineer_tags FOR SELECT TO authenticated USING (active = true);

DROP POLICY IF EXISTS "Allow change for managers on engineer_tags" ON public.engineer_tags;
CREATE POLICY "Allow change for managers on engineer_tags" ON public.engineer_tags FOR ALL TO authenticated USING (public.is_workshop_manager());

DROP POLICY IF EXISTS "Allow select for user_engineer_tags" ON public.user_engineer_tags;
CREATE POLICY "Allow select for user_engineer_tags" ON public.user_engineer_tags FOR SELECT TO authenticated USING (active = true);

DROP POLICY IF EXISTS "Allow change for managers on user_engineer_tags" ON public.user_engineer_tags;
CREATE POLICY "Allow change for managers on user_engineer_tags" ON public.user_engineer_tags FOR ALL TO authenticated USING (public.is_workshop_manager());


-- 6.7 RLS Policies: warranty_service_tasks
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.warranty_service_tasks;
CREATE POLICY "Enable read access for authenticated users" ON public.warranty_service_tasks
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable write access for service coordinators" ON public.warranty_service_tasks;
CREATE POLICY "Enable write access for service coordinators" ON public.warranty_service_tasks
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('Documentation Officer', 'Service Manager', 'Area Engineer', 'Admin')
    );


-- 6.8 RLS Policies: purchase_orders & purchase_order_items
DROP POLICY IF EXISTS "Enable read access for authenticated users to PO" ON public.purchase_orders;
CREATE POLICY "Enable read access for authenticated users to PO" ON public.purchase_orders
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for authenticated users to PO items" ON public.purchase_order_items;
CREATE POLICY "Enable read access for authenticated users to PO items" ON public.purchase_order_items
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable write access to PO for authorized personnel" ON public.purchase_orders;
CREATE POLICY "Enable write access to PO for authorized personnel" ON public.purchase_orders
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('Workshop Manager', 'Service Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'System Admin', 'Admin')
    );

DROP POLICY IF EXISTS "Enable write access to PO items for authorized personnel" ON public.purchase_order_items;
CREATE POLICY "Enable write access to PO items for authorized personnel" ON public.purchase_order_items
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('Workshop Manager', 'Service Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'System Admin', 'Admin')
    );


-- 6.9 RLS Policies: goods_received_notes & goods_received_note_items
DROP POLICY IF EXISTS "Enable read access for authenticated users to GRN" ON public.goods_received_notes;
CREATE POLICY "Enable read access for authenticated users to GRN" ON public.goods_received_notes
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for authenticated users to GRN items" ON public.goods_received_note_items;
CREATE POLICY "Enable read access for authenticated users to GRN items" ON public.goods_received_note_items
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable write access to GRN for authorized personnel" ON public.goods_received_notes;
CREATE POLICY "Enable write access to GRN for authorized personnel" ON public.goods_received_notes
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('Workshop Manager', 'Service Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'System Admin', 'Admin')
    );

DROP POLICY IF EXISTS "Enable write access to GRN items for authorized personnel" ON public.goods_received_note_items;
CREATE POLICY "Enable write access to GRN items for authorized personnel" ON public.goods_received_note_items
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('Workshop Manager', 'Service Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'System Admin', 'Admin')
    );

-- ================================================================================================================
-- PART 7: ROBUST SEED DATA
-- ================================================================================================================

-- 7.1 Seed Roles (Enterprise System Hierarchy)
INSERT INTO public.roles (name, description, level) VALUES
('Workshop Manager', 'Operational Administrator with full system control', 10),
('Documentation Officer', 'Responsible for ISO certifications and QA reviews', 8),
('Senior Biomedical Engineer', 'Lead field engineer managing local territories', 7),
('Biomedical Engineer', 'Field specialist servicing analytical instruments', 6),
('Junior Biomedical Engineer', 'Support field specialist', 5),
('Senior Service Engineer', 'Lead industrial service engineer', 7),
('Service Engineer', 'Field engineer', 6),
('Junior Service Engineer', 'Support service engineer', 5),
('Senior Workshop Engineer', 'Bench specialist repair supervisor', 7),
('Workshop Engineer', 'Bench specialist diagnostics technician', 6),
('Junior Workshop Engineer', 'Support bench technician', 5),
('Calibration Engineer', 'ISO 17025 metrological calibration manager', 8),
('Technician', 'Primary technical support operator', 4),
('Trainee Technician', 'Entry technical helper', 2),
('Trainee Engineer', 'Graduate helper', 3),
('Intern Technician', 'Temporary support helper', 1);

-- 7.2 Seed Permissions
INSERT INTO public.permissions (code, description) VALUES
('jobs:create', 'Create clinical instrument service jobs'),
('jobs:read', 'View clinical instrument service jobs'),
('jobs:update', 'Update clinical instrument service jobs and progress'),
('jobs:delete', 'Soft-delete clinical instrument service jobs'),
('users:create', 'Create and register new employee logins'),
('users:read', 'View employee directories and profiles'),
('users:update', 'Modify employee profile metadata and settings'),
('users:delete', 'Soft-delete or suspend employee profiles'),
('assets:create', 'Register new hospital customer instruments'),
('assets:read', 'View clinical instruments registry'),
('assets:update', 'Update instrument maintenance intervals'),
('assets:delete', 'Decommission or retire clinical instruments'),
('customers:create', 'Add new customer hospital accounts'),
('customers:read', 'View customer hospital accounts and departments'),
('customers:update', 'Modify customer hospital details'),
('customers:delete', 'Archive customer hospital accounts'),
('reports:signoff', 'Approve calibration and service certificates'),
('procurement:approve', 'Approve purchase orders for parts');

-- 7.3 Associate Role Permissions
DO $$
DECLARE
    v_manager_role_id UUID;
    v_doc_role_id UUID;
    v_bme_role_id UUID;
    v_tech_role_id UUID;
    v_perm_record RECORD;
BEGIN
    SELECT id INTO v_manager_role_id FROM public.roles WHERE name = 'Workshop Manager';
    SELECT id INTO v_doc_role_id FROM public.roles WHERE name = 'Documentation Officer';
    SELECT id INTO v_bme_role_id FROM public.roles WHERE name = 'Biomedical Engineer';
    SELECT id INTO v_tech_role_id FROM public.roles WHERE name = 'Technician';

    -- Seed ALL permissions to the Workshop Manager
    FOR v_perm_record IN SELECT id FROM public.permissions LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (v_manager_role_id, v_perm_record.id);
    END LOOP;

    -- Seed Standard Documentation Officer permissions
    FOR v_perm_record IN SELECT id FROM public.permissions WHERE code IN ('jobs:read', 'jobs:update', 'users:read', 'assets:read', 'customers:read', 'reports:signoff') LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (v_doc_role_id, v_perm_record.id);
    END LOOP;

    -- Seed Biomedical Engineer permissions
    FOR v_perm_record IN SELECT id FROM public.permissions WHERE code IN ('jobs:read', 'jobs:update', 'assets:read', 'customers:read') LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (v_bme_role_id, v_perm_record.id);
    END LOOP;

    -- Seed Technician permissions
    FOR v_perm_record IN SELECT id FROM public.permissions WHERE code IN ('jobs:read', 'jobs:update') LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (v_tech_role_id, v_perm_record.id);
    END LOOP;
END $$;

-- 7.4 Seed Engineer Tags
INSERT INTO public.engineer_tags (tag, description) VALUES
('Area Engineer', 'Biomedical field specialists assigned to hospital territories'),
('Workshop Engineer', 'Bench specialists operating in central workshop lab'),
('Calibration Engineer', 'Specialists operating ISO 17025 metrology calibration tasks');

-- 7.5 Seed Legacy RBAC Mirror Tables
INSERT INTO public.rbac_permissions (id, code, description)
SELECT id::text, code, description FROM public.permissions;

INSERT INTO public.rbac_role_permissions (roleName, permissionId)
SELECT r.name, p.id::text
FROM public.role_permissions rp
JOIN public.roles r ON rp.role_id = r.id
JOIN public.permissions p ON rp.permission_id = p.id;

-- 7.6 Seed Warranty Tasks
INSERT INTO public.warranty_service_tasks (
    ticket_number, warranty_card_number, customer_name, department, territory, 
    instrument_name, asset_number, serial_number, scheduled_date, scheduled_time, 
    status, priority, assigned_area_engineer, service_type, estimated_duration_hours, notes
) VALUES 
('WST-2026-9012', 'WC-AVN-2026-8941', 'Metro Central General Hospital', 'Advanced Clinical Pathology', 'North Metro District', 'Sysmex XN-3000 Automated Hematology Analyzer', 'AST-MED-2026-8841', 'SXN-9948210-PRO', '2026-06-25', '09:00:00', 'Scheduled', 'High', 'Eng. Marcus Vance', 'Preventative Maintenance', 4.5, 'Initial 6-month mandatory filter and pneumatic check.'),
('WST-2026-8841', 'WC-AVN-2025-4412', 'St. Jude Childrens Research Hospital', 'Pediatric Oncology Lab', 'West Valley Territory', 'Roche Cobas 8000 Modular Analyzer', 'AST-RCH-2025-1092', 'RCB-882104-ENT', '2026-06-20', '10:30:00', 'Overdue', 'Critical', 'Eng. David Chen', 'Mandatory Calibration', 6.0, 'Overdue by 5 days due to hospital reagent quarantine delay.'),
('WST-2026-9104', 'WC-AVN-2026-3321', 'Mayo Clinic Healthcare Hub', 'Immunology & Endocrinology', 'Central Region', 'Beckman Coulter DxI 9000 Immunoassay', 'AST-BC-2026-5541', 'BCD-992140-PRO', '2026-06-27', '13:00:00', 'Scheduled', 'Medium', 'Eng. Sarah Jenkins', 'Preventative Maintenance', 3.5, 'Routine optics baseline and manifold cleaning.');

-- 7.7 Seed Purchase Orders & Items
INSERT INTO public.purchase_orders (
    id, po_number, supplier_id, supplier_name, supplier_code, status, 
    sub_total, tax_amount, shipping_cost, total_cost, 
    created_by_id, created_by_name, created_by_role, remarks, shipping_terms, expected_delivery_date
) VALUES 
('a3b1c2d3-1111-2222-3333-44445555aaaa', 'PO-2026-00001', 'sup_sysmex', 'Sysmex Asia Pacific Pte Ltd', 'SUP-SYSMEX', 'Received', 450000.00, 36000.00, 15000.00, 501000.00, 'usr_doc', 'Nuwani Upeksha', 'Documentation Officer', 'Urgent hematology spare parts procurement.', 'CIF Colombo Port', '2026-07-01'),
('b4c2d3e4-2222-3333-4444-55556666bbbb', 'PO-2026-00002', 'sup_roche', 'Roche Diagnostics Sri Lanka', 'SUP-ROCHE', 'Pending Approval', 820000.00, 65600.00, 20000.00, 905600.00, 'usr_workshop_eng', 'Roshan Silva', 'Workshop Engineer', 'Vacuum pump and optical block replacements.', 'FOB Tokyo', '2026-08-15'),
('c5d3e4f5-3333-4444-5555-66667777cccc', 'PO-2026-00003', 'sup_abbott', 'Abbott Laboratories Lanka', 'SUP-ABBOTT', 'Draft', 120000.00, 9600.00, 5000.00, 134600.00, 'usr_doc', 'Nuwani Upeksha', 'Documentation Officer', 'Regular consumable reagent probe restocking.', 'DDP Colombo', '2026-09-01');

INSERT INTO public.purchase_order_items (
    po_id, item_id, part_code, part_name, quantity, unit_price, total_price
) VALUES 
('a3b1c2d3-1111-2222-3333-44445555aaaa', 'inv_part_001', 'AV-PRT-2026-001', 'Pneumatic Sampling Valve Assembly', 2, 150000.00, 300000.00),
('a3b1c2d3-1111-2222-3333-44445555aaaa', 'inv_part_002', 'AV-PRT-2026-002', 'Hematology Diluent Sensor v3', 3, 50000.00, 150000.00),
('b4c2d3e4-2222-3333-4444-55556666bbbb', 'inv_part_003', 'AV-PRT-2026-003', 'High-Vacuum Diaphragm Pump 24V', 1, 820000.00, 820000.00),
('c5d3e4f5-3333-4444-5555-66667777cccc', 'inv_part_004', 'AV-PRT-2026-004', 'Reagent Aspiration Micro-Probe', 2, 60000.00, 120000.00);

-- 7.8 Seed Goods Received Notes & Items
INSERT INTO public.goods_received_notes (
    id, grn_number, po_id, po_number, supplier_id, supplier_name, 
    delivery_note_number, invoice_number, received_by_id, received_by_name, received_by_role, 
    received_at, status, inspection_passed, remarks
) VALUES (
    'e6f4a3b1-1234-5678-9101-1121314151aa',
    'GRN-2026-00001',
    'a3b1c2d3-1111-2222-3333-44445555aaaa',
    'PO-2026-00001',
    'sup_sysmex',
    'Sysmex Asia Pacific Pte Ltd',
    'DN-94827',
    'INV-2026-1029',
    'usr_doc',
    'Nuwani Upeksha',
    'Documentation Officer',
    '2026-07-01 15:30:00+00',
    'Verified',
    TRUE,
    'Goods received in perfect condition. Packaging intact. Passed initial physical and quantitative inspection.'
);

INSERT INTO public.goods_received_note_items (
    grn_id, item_id, part_code, part_name, ordered_qty, received_qty, accepted_qty, rejected_qty, remarks
) VALUES 
('e6f4a3b1-1234-5678-9101-1121314151aa', 'inv_part_001', 'AV-PRT-2026-001', 'Pneumatic Sampling Valve Assembly', 2, 2, 2, 0, 'Passed physical dimension inspection.'),
('e6f4a3b1-1234-5678-9101-1121314151aa', 'inv_part_002', 'AV-PRT-2026-002', 'Hematology Diluent Sensor v3', 3, 3, 3, 0, 'Lot and expiry verified (Exp: 2028-06).');

-- ================================================================================================================
-- PART 8: METRIC & INTEGRITY VERIFICATION SQL QUERIES
-- ================================================================================================================

-- Query 1: Display schema count stats to ensure all tables exist with accurate record volumes
SELECT 'user_profiles' AS table_name, COUNT(*) FROM public.user_profiles
UNION ALL
SELECT 'roles', COUNT(*) FROM public.roles
UNION ALL
SELECT 'permissions', COUNT(*) FROM public.permissions
UNION ALL
SELECT 'role_permissions', COUNT(*) FROM public.role_permissions
UNION ALL
SELECT 'user_roles', COUNT(*) FROM public.user_roles
UNION ALL
SELECT 'engineer_tags', COUNT(*) FROM public.engineer_tags
UNION ALL
SELECT 'user_engineer_tags', COUNT(*) FROM public.user_engineer_tags
UNION ALL
SELECT 'rbac_permissions', COUNT(*) FROM public.rbac_permissions
UNION ALL
SELECT 'rbac_role_permissions', COUNT(*) FROM public.rbac_role_permissions
UNION ALL
SELECT 'warranty_service_tasks', COUNT(*) FROM public.warranty_service_tasks
UNION ALL
SELECT 'purchase_orders', COUNT(*) FROM public.purchase_orders
UNION ALL
SELECT 'purchase_order_items', COUNT(*) FROM public.purchase_order_items
UNION ALL
SELECT 'goods_received_notes', COUNT(*) FROM public.goods_received_notes
UNION ALL
SELECT 'goods_received_note_items', COUNT(*) FROM public.goods_received_note_items;

-- Query 2: RBAC Matrix verification
SELECT r.name AS role_name, r.level AS role_level, p.code AS permission_code, p.description AS permission_desc
FROM public.role_permissions rp
JOIN public.roles r ON rp.role_id = r.id
JOIN public.permissions p ON rp.permission_id = p.id
ORDER BY r.level DESC, p.code ASC;

