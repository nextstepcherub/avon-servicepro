-- Sprint 6.2: Purchase Orders & Workflow Approval Engine DDL & RLS Policies
-- AVON ServicePro Enterprise Database Architecture

-- Enable UUID extension if not already enabled (Supabase / PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: purchase_orders
CREATE TABLE IF NOT EXISTS public.purchase_orders (
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

-- Table: purchase_order_items
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    item_id VARCHAR(64) NOT NULL,
    part_code VARCHAR(64) NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (unit_price >= 0.00),
    total_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (total_price >= 0.00)
);

-- Indexing for rapid queries, workflow monitoring, and reports
CREATE INDEX IF NOT EXISTS idx_po_number ON public.purchase_orders(po_number);
CREATE INDEX IF NOT EXISTS idx_po_status ON public.purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_po_supplier_id ON public.purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_created_at ON public.purchase_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_poi_po_id ON public.purchase_order_items(po_id);
CREATE INDEX IF NOT EXISTS idx_poi_item_id ON public.purchase_order_items(item_id);

-- Row Level Security (RLS) Configuration (Supabase / Postgres compatibility)
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

-- Policies: Read access to purchase orders for all authenticated officers
CREATE POLICY "Enable read access for authenticated users to PO" ON public.purchase_orders
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users to PO items" ON public.purchase_order_items
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policies: Write access for authorized procurement roles (Workshop Manager, Documentation Officer, Senior Biomedical Engineer, etc.)
CREATE POLICY "Enable write access to PO for authorized personnel" ON public.purchase_orders
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('Workshop Manager', 'Service Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'System Admin', 'Admin')
    );

CREATE POLICY "Enable write access to PO items for authorized personnel" ON public.purchase_order_items
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('Workshop Manager', 'Service Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'System Admin', 'Admin')
    );

-- Seed Sample Purchase Orders for demonstration
INSERT INTO public.purchase_orders (
    id, po_number, supplier_id, supplier_name, supplier_code, status, 
    sub_total, tax_amount, shipping_cost, total_cost, 
    created_by_id, created_by_name, created_by_role, remarks, shipping_terms, expected_delivery_date
) VALUES 
('a3b1c2d3-1111-2222-3333-44445555aaaa', 'PO-2026-00001', 'sup_sysmex', 'Sysmex Asia Pacific Pte Ltd', 'SUP-SYSMEX', 'Received', 450000.00, 36000.00, 15000.00, 501000.00, 'usr_doc', 'Nuwani Upeksha', 'Documentation Officer', 'Urgent hematology spare parts procurement.', 'CIF Colombo Port', '2026-07-01'),
('b4c2d3e4-2222-3333-4444-55556666bbbb', 'PO-2026-00002', 'sup_roche', 'Roche Diagnostics Sri Lanka', 'SUP-ROCHE', 'Pending Approval', 820000.00, 65600.00, 20000.00, 905600.00, 'usr_workshop_eng', 'Roshan Silva', 'Workshop Engineer', 'Vacuum pump and optical block replacements.', 'FOB Tokyo', '2026-08-15'),
('c5d3e4f5-3333-4444-5555-66667777cccc', 'PO-2026-00003', 'sup_abbott', 'Abbott Laboratories Lanka', 'SUP-ABBOTT', 'Draft', 120000.00, 9600.00, 5000.00, 134600.00, 'usr_doc', 'Nuwani Upeksha', 'Documentation Officer', 'Regular consumable reagent probe restocking.', 'DDP Colombo', '2026-09-01')
ON CONFLICT (po_number) DO NOTHING;

INSERT INTO public.purchase_order_items (
    po_id, item_id, part_code, part_name, quantity, unit_price, total_price
) VALUES 
('a3b1c2d3-1111-2222-3333-44445555aaaa', 'inv_part_001', 'AV-PRT-2026-001', 'Pneumatic Sampling Valve Assembly', 2, 150000.00, 300000.00),
('a3b1c2d3-1111-2222-3333-44445555aaaa', 'inv_part_002', 'AV-PRT-2026-002', 'Hematology Diluent Sensor v3', 3, 50000.00, 150000.00),
('b4c2d3e4-2222-3333-4444-55556666bbbb', 'inv_part_003', 'AV-PRT-2026-003', 'High-Vacuum Diaphragm Pump 24V', 1, 820000.00, 820000.00),
('c5d3e4f5-3333-4444-5555-66667777cccc', 'inv_part_004', 'AV-PRT-2026-004', 'Reagent Aspiration Micro-Probe', 2, 60000.00, 120000.00)
ON CONFLICT DO NOTHING;
