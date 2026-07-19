-- Sprint 6.3: Goods Receiving Notes (GRN), Stock Update & Inventory Transactions
-- AVON ServicePro Enterprise Database Architecture

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: goods_received_notes
CREATE TABLE IF NOT EXISTS public.goods_received_notes (
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

-- Table: goods_received_note_items
CREATE TABLE IF NOT EXISTS public.goods_received_note_items (
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

-- Indexing for rapid audit, lookup, and inventory reconciliation
CREATE INDEX IF NOT EXISTS idx_grn_number ON public.goods_received_notes(grn_number);
CREATE INDEX IF NOT EXISTS idx_grn_po_id ON public.goods_received_notes(po_id);
CREATE INDEX IF NOT EXISTS idx_grn_po_number ON public.goods_received_notes(po_number);
CREATE INDEX IF NOT EXISTS idx_grn_status ON public.goods_received_notes(status);
CREATE INDEX IF NOT EXISTS idx_grn_received_at ON public.goods_received_notes(received_at);
CREATE INDEX IF NOT EXISTS idx_grni_grn_id ON public.goods_received_note_items(grn_id);
CREATE INDEX IF NOT EXISTS idx_grni_item_id ON public.goods_received_note_items(item_id);

-- Row Level Security (RLS) Configuration
ALTER TABLE public.goods_received_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_received_note_items ENABLE ROW LEVEL SECURITY;

-- Policies: Read access to GRNs for all authenticated staff
CREATE POLICY "Enable read access for authenticated users to GRN" ON public.goods_received_notes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users to GRN items" ON public.goods_received_note_items
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policies: Write access for authorized procurement/warehouse roles (Workshop Manager, Documentation Officer, Storekeeper, etc.)
CREATE POLICY "Enable write access to GRN for authorized personnel" ON public.goods_received_notes
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('Workshop Manager', 'Service Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'System Admin', 'Admin')
    );

CREATE POLICY "Enable write access to GRN items for authorized personnel" ON public.goods_received_note_items
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('Workshop Manager', 'Service Manager', 'Documentation Officer', 'Senior Biomedical Engineer', 'System Admin', 'Admin')
    );

-- Seed Sample Goods Received Note linked to PO-2026-00001
INSERT INTO public.goods_received_notes (
    id, grn_number, po_id, po_number, supplier_id, supplier_name, 
    delivery_note_number, invoice_number, received_by_id, received_by_name, received_by_role, 
    received_at, status, inspection_passed, remarks
) VALUES (
    'e6f4a3b1-1234-5678-9101-1121314151aa',
    'GRN-2026-00001',
    'a3b1c2d3-1111-2222-3333-44445555aaaa', -- Linked PO-2026-00001
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
) ON CONFLICT (grn_number) DO NOTHING;

INSERT INTO public.goods_received_note_items (
    grn_id, item_id, part_code, part_name, ordered_qty, received_qty, accepted_qty, rejected_qty, remarks
) VALUES 
('e6f4a3b1-1234-5678-9101-1121314151aa', 'inv_part_001', 'AV-PRT-2026-001', 'Pneumatic Sampling Valve Assembly', 2, 2, 2, 0, 'Passed physical dimension inspection.'),
('e6f4a3b1-1234-5678-9101-1121314151aa', 'inv_part_002', 'AV-PRT-2026-002', 'Hematology Diluent Sensor v3', 3, 3, 3, 0, 'Lot and expiry verified (Exp: 2028-06).')
ON CONFLICT DO NOTHING;
