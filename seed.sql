-- ================================================================================================================
-- AVON ServicePro Enterprise Database Seeding Script
-- Generated: 2026-07-17T08:06:44.481Z
-- Target Runtime: Supabase / PostgreSQL
-- Description: Seeds initial, clean, and complete enterprise reference and master records.
-- ================================================================================================================

-- 1. Disable all triggers and foreign key constraints temporarily to allow insertion in any order
SET session_replication_role = 'replica';

BEGIN;

-- 2. Clear existing records to avoid primary key/unique constraint violations
TRUNCATE TABLE 
  "activity_log",
  "amc_contracts",
  "amc_visits",
  "api_keys",
  "api_logs",
  "api_webhooks",
  "application_configuration",
  "application_integrations",
  "application_logs",
  "audit_logs",
  "background_jobs",
  "barcodes",
  "branches",
  "brands",
  "calibration_certificates",
  "calibration_execution",
  "calibration_measurements",
  "calibration_schedules",
  "checklist_template_items",
  "checklist_templates",
  "comments",
  "companies",
  "contract_instruments",
  "countries",
  "customer_complaints",
  "customer_contacts",
  "customer_departments",
  "customer_feedback",
  "customers",
  "dashboard_layouts",
  "dashboard_widgets",
  "database_migrations",
  "database_version",
  "deleted_records",
  "department_targets",
  "districts",
  "document_review_audit",
  "document_reviews",
  "email_attachments",
  "email_queue",
  "employee_kpi_assignments",
  "employee_performance_summary",
  "engineer_tags",
  "entity_checklist_items",
  "entity_checklists",
  "export_jobs",
  "favorites",
  "feature_flags",
  "file_storage",
  "file_versions",
  "financial_years",
  "goods_receipt_items",
  "goods_receipts",
  "holidays",
  "import_errors",
  "import_jobs",
  "instrument_categories",
  "instrument_documents",
  "instrument_history",
  "instrument_models",
  "instruments",
  "inventory_locations",
  "inventory_stock",
  "inventory_transactions",
  "job_attachments",
  "job_checklists",
  "job_measurements",
  "job_parts",
  "job_parts_consumption",
  "job_reports",
  "job_status_history",
  "job_visits",
  "kpi_evaluations",
  "kpi_master",
  "kpi_measurement_rules",
  "kpi_measurements",
  "label_templates",
  "license_management",
  "login_history",
  "manufacturers",
  "modules",
  "notification_templates",
  "notifications",
  "organizational_units",
  "permissions",
  "pm_execution",
  "pm_notifications",
  "pm_schedules",
  "provinces",
  "purchase_order_items",
  "purchase_orders",
  "qr_codes",
  "recent_activity",
  "report_execution_history",
  "role_permissions",
  "roles",
  "saved_filters",
  "saved_reports",
  "sequence_numbers",
  "service_contracts",
  "service_jobs",
  "service_requests",
  "spare_parts",
  "stock_adjustment_items",
  "stock_adjustments",
  "stock_take",
  "stock_take_items",
  "stock_transfer_items",
  "stock_transfers",
  "suppliers",
  "system_announcements",
  "system_backup_history",
  "system_health",
  "system_jobs",
  "system_preferences",
  "system_settings",
  "task_assignments",
  "task_attachments",
  "task_comments",
  "tasks",
  "territories",
  "territory_engineers",
  "user_engineer_tags",
  "user_preferences",
  "user_roles",
  "users",
  "vendor_performance",
  "vendors",
  "warranty_activations",
  "webhook_logs",
  "working_calendar",
  "workshop_jobs",
  "workshop_quality_checks",
  "workshop_repair_log"
RESTART IDENTITY CASCADE;


-- Seeding record block 1
INSERT INTO "activity_log" ("id", "activity_no", "company_id", "user_id", "module_code", "entity_type", "entity_id", "activity_type", "title", "description", "ip_address", "device_name", "browser", "operating_system", "session_id", "activity_time", "successful", "created_at") VALUES
('3e94c916-800e-11f1-aa6c-3cecef704050', 'ACT-2026-000001', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'AUTH', 'users', NULL, 'LOGIN', 'User Login', 'Administrator logged into Avon ServicePro.', '127.0.0.1', 'Desktop PC', 'Google Chrome', 'Windows 11', '3e94c934-800e-11f1-aa6c-3cecef704050', '2026-07-15 11:00:06', 1, '2026-07-15 05:30:06'),
('3e957ac2-800e-11f1-aa6c-3cecef704050', 'ACT-2026-000002', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'SERVICE', 'service_jobs', NULL, 'UPDATE', 'Service Job Updated', 'Updated service job details.', '127.0.0.1', 'Desktop PC', 'Google Chrome', 'Windows 11', '3e957ad7-800e-11f1-aa6c-3cecef704050', '2026-07-15 11:00:06', 1, '2026-07-15 05:30:06'),
('3e9610c3-800e-11f1-aa6c-3cecef704050', 'ACT-2026-000003', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'REPORTS', 'reports', NULL, 'EXPORT', 'Report Exported', 'Exported Service Job Summary Report.', '127.0.0.1', 'Desktop PC', 'Google Chrome', 'Windows 11', '3e9610e6-800e-11f1-aa6c-3cecef704050', '2026-07-15 11:00:06', 1, '2026-07-15 05:30:06');

-- Seeding record block 2
INSERT INTO "amc_contracts" ("id", "contract_no", "customer_id", "instrument_id", "contract_type", "start_date", "end_date", "duration_months", "visits_per_year", "response_time_hours", "contract_value", "currency", "assigned_engineer_id", "contract_status", "auto_renew", "signed_date", "remarks", "created_by", "created_at", "updated_at") VALUES
('15de6bc0-7fee-11f1-aa6c-3cecef704050', 'AMC-2026-000001', '08d2bede-7f76-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'AMC', '2026-07-15', '2027-07-15', 12, 4, 24, 250000.00, 'LKR', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'ACTIVE', 1, '2026-07-15', 'Annual Maintenance Contract', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 01:39:53', '2026-07-15 01:39:53');

-- Seeding record block 3
INSERT INTO "amc_visits" ("id", "amc_contract_id", "visit_no", "planned_date", "scheduled_date", "completed_date", "service_job_id", "engineer_id", "visit_type", "visit_status", "customer_contact", "customer_signature", "report_submitted", "remarks", "created_at", "updated_at") VALUES
('5a4e3486-7fee-11f1-aa6c-3cecef704050', '15de6bc0-7fee-11f1-aa6c-3cecef704050', 1, '2026-10-15', '2026-10-15', '2026-10-15', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'PREVENTIVE_MAINTENANCE', 'COMPLETED', 'Chief Medical Laboratory Technologist', 1, 1, 'Quarterly Preventive Maintenance Visit', '2026-07-15 01:41:48', '2026-07-15 01:41:48');

-- Seeding record block 4
INSERT INTO "api_keys" ("id", "api_key_code", "application_name", "api_key", "api_secret", "company_id", "owner_user_id", "environment", "permissions", "allowed_ips", "rate_limit_per_minute", "expires_at", "last_used_at", "active", "remarks", "created_at", "updated_at") VALUES
('be46ec5b-8009-11f1-aa6c-3cecef704050', 'API-000001', 'Avon ServicePro Web', '1ea0c56d5cc9f140ae3ee0bde34fc84b19d9c57f1f7b11f57b073d7bacc401a8', '09eb26afd5caa86b425acfd730e39f500611649cdd1c986202282ba25f1631d3abe900b8bf9b9afb3abcde278c4f1430f6651f3d4a8aee98d883ea0680b6f4e3', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'DEVELOPMENT', '["customers", "instruments", "service_jobs", "pm", "calibration", "inventory"]', '["127.0.0.1", "::1"]', 500, '2028-07-15 10:27:52', NULL, 1, 'Default Development API Key', '2026-07-15 04:57:52', '2026-07-15 04:57:52');

-- Seeding record block 5
INSERT INTO "api_logs" ("id", "log_no", "api_key_id", "user_id", "request_time", "response_time", "endpoint", "http_method", "request_headers", "request_body", "response_code", "response_body", "ip_address", "user_agent", "execution_time_ms", "request_size_bytes", "response_size_bytes", "success", "error_message", "created_at") VALUES
('3262bf6a-800a-11f1-aa6c-3cecef704050', 'API-LOG-000001', 'be46ec5b-8009-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:31:07', '2026-07-15 10:31:07', '/api/service-jobs', 'GET', '{"Content-Type": "application/json"}', '{}', 200, '{"status": "success"}', '127.0.0.1', 'Mozilla/5.0', 145, 512, 4096, 1, NULL, '2026-07-15 05:01:07'),
('3263826f-800a-11f1-aa6c-3cecef704050', 'API-LOG-000002', 'be46ec5b-8009-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:31:07', '2026-07-15 10:31:07', '/api/customers', 'POST', '{"Content-Type": "application/json"}', '{"customer": "ABC Laboratory"}', 201, '{"status": "created"}', '127.0.0.1', 'Mozilla/5.0', 238, 1024, 512, 1, NULL, '2026-07-15 05:01:07'),
('3263f75b-800a-11f1-aa6c-3cecef704050', 'API-LOG-000003', 'be46ec5b-8009-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:31:07', '2026-07-15 10:31:07', '/api/instruments', 'POST', '{"Content-Type": "application/json"}', '{}', 400, '{"status": "failed"}', '127.0.0.1', 'Mozilla/5.0', 112, 256, 256, 0, 'Validation failed.', '2026-07-15 05:01:07');

-- Seeding record block 6
INSERT INTO "api_webhooks" ("id", "webhook_code", "webhook_name", "event_name", "target_url", "http_method", "authentication_type", "secret_key", "request_headers", "payload_template", "retry_count", "timeout_seconds", "active", "created_by", "remarks", "created_at", "updated_at") VALUES
('1e85251e-801c-11f1-aa6c-3cecef704050', 'WEB001', 'Job Completed', 'SERVICE_JOB_COMPLETED', 'https://api.example.com/webhooks/service-job', 'POST', 'BEARER', NULL, NULL, NULL, 3, 30, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 07:09:25', '2026-07-15 07:09:25'),
('1e8595d9-801c-11f1-aa6c-3cecef704050', 'WEB002', 'PM Completed', 'PM_COMPLETED', 'https://api.example.com/webhooks/pm', 'POST', 'API_KEY', NULL, NULL, NULL, 3, 30, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 07:09:25', '2026-07-15 07:09:25');

-- Seeding record block 7
INSERT INTO "application_configuration" ("id", "config_code", "config_group", "config_key", "config_name", "config_value", "value_type", "encrypted", "editable", "restart_required", "active", "updated_by", "created_at", "updated_at") VALUES
('dfce8a34-801a-11f1-aa6c-3cecef704050', 'CFG001', 'APPLICATION', 'APP_NAME', 'Application Name', 'Avon ServicePro', 'STRING', 0, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30'),
('dfcf2d13-801a-11f1-aa6c-3cecef704050', 'CFG002', 'COMPANY', 'COMPANY_NAME', 'Company Name', 'AVON PHARMO CHEM (PVT) LTD', 'STRING', 0, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30'),
('dfcf8115-801a-11f1-aa6c-3cecef704050', 'CFG003', 'SMTP', 'SMTP_HOST', 'SMTP Host', 'mail.avonpclk.com', 'STRING', 0, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30'),
('dfcfcc73-801a-11f1-aa6c-3cecef704050', 'CFG004', 'SMTP', 'SMTP_PORT', 'SMTP Port', '587', 'INTEGER', 0, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30'),
('dfd019fc-801a-11f1-aa6c-3cecef704050', 'CFG005', 'SMTP', 'SMTP_USERNAME', 'SMTP Username', 'service@avonpclk.com', 'STRING', 0, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30'),
('dfd06db1-801a-11f1-aa6c-3cecef704050', 'CFG006', 'SMTP', 'SMTP_PASSWORD', 'SMTP Password', '', 'PASSWORD', 1, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30'),
('dfd0c7d3-801a-11f1-aa6c-3cecef704050', 'CFG007', 'STORAGE', 'UPLOAD_PATH', 'Upload Path', '/uploads', 'STRING', 0, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30'),
('dfd11ca4-801a-11f1-aa6c-3cecef704050', 'CFG008', 'JWT', 'JWT_EXPIRY', 'JWT Expiry (Minutes)', '480', 'INTEGER', 0, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30'),
('dfd1717f-801a-11f1-aa6c-3cecef704050', 'CFG009', 'BACKUP', 'BACKUP_RETENTION_DAYS', 'Backup Retention', '30', 'INTEGER', 0, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30'),
('dfd1cd69-801a-11f1-aa6c-3cecef704050', 'CFG010', 'FEATURES', 'ENABLE_AI', 'Enable AI Assistant', 'true', 'BOOLEAN', 0, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30'),
('dfd22566-801a-11f1-aa6c-3cecef704050', 'CFG011', 'UI', 'DEFAULT_THEME', 'Default Theme', 'LIGHT', 'STRING', 0, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30'),
('dfd285ec-801a-11f1-aa6c-3cecef704050', 'CFG012', 'REPORTS', 'DEFAULT_EXPORT', 'Default Report Export', 'PDF', 'STRING', 0, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:00:30', '2026-07-15 07:00:30');

-- Seeding record block 8
INSERT INTO "application_integrations" ("id", "integration_code", "integration_name", "integration_type", "base_url", "api_key", "api_secret", "username", "password", "authentication_type", "timeout_seconds", "active", "last_connected_at", "last_status", "created_by", "remarks", "created_at", "updated_at") VALUES
('fb9abf19-801b-11f1-aa6c-3cecef704050', 'INT001', 'Google Drive', 'GOOGLE_DRIVE', 'https://www.googleapis.com', NULL, NULL, NULL, NULL, 'OAUTH2', 30, 1, NULL, 'NEVER_CONNECTED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 07:08:26', '2026-07-15 07:08:26'),
('fb9b1e64-801b-11f1-aa6c-3cecef704050', 'INT002', 'SMTP Mail', 'SMTP', 'mail.avonpclk.com', NULL, NULL, NULL, NULL, 'BASIC', 30, 1, NULL, 'NEVER_CONNECTED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 07:08:26', '2026-07-15 07:08:26');

-- Seeding record block 9
INSERT INTO "application_logs" ("id", "log_no", "log_time", "environment", "log_level", "application_name", "module_name", "class_name", "method_name", "exception_type", "error_code", "message", "stack_trace", "request_url", "request_method", "request_body", "response_code", "ip_address", "user_agent", "session_id", "user_id", "company_id", "resolved", "resolved_by", "resolved_at", "resolution_notes", "created_at") VALUES
('fdaeb831-8012-11f1-aa6c-3cecef704050', 'APPLOG-2026-000001', '2026-07-15 11:34:04', 'PRODUCTION', 'INFO', 'Avon ServicePro', 'Authentication', 'AuthController', 'login', NULL, NULL, 'User login successful.', NULL, NULL, NULL, NULL, 200, '127.0.0.1', 'Google Chrome', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 0, NULL, NULL, NULL, '2026-07-15 06:04:04'),
('fdaf85ec-8012-11f1-aa6c-3cecef704050', 'APPLOG-2026-000002', '2026-07-15 11:34:04', 'PRODUCTION', 'ERROR', 'Avon ServicePro', 'Inventory', 'InventoryService', 'updateStock', 'SQLException', 'INV-500', 'Inventory update failed.', 'Stack trace...', '/api/inventory', 'PUT', NULL, 500, '127.0.0.1', 'Google Chrome', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 0, NULL, NULL, NULL, '2026-07-15 06:04:04'),
('fdb0a83c-8012-11f1-aa6c-3cecef704050', 'APPLOG-2026-000003', '2026-07-15 11:34:04', 'PRODUCTION', 'WARNING', 'Avon ServicePro', 'Service', 'ServiceScheduler', 'assignEngineer', NULL, NULL, 'Engineer assignment delayed due to workload.', NULL, NULL, NULL, NULL, 200, '127.0.0.1', 'Google Chrome', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 11:34:04', 'Engineer manually assigned.', '2026-07-15 06:04:04');

-- Seeding record block 10
INSERT INTO "audit_logs" ("id", "audit_no", "event_time", "user_id", "company_id", "module", "entity_name", "entity_id", "action", "description", "old_values", "new_values", "ip_address", "device_name", "browser", "operating_system", "session_id", "request_method", "request_url", "http_status", "execution_time_ms", "success", "remarks", "created_at") VALUES
('06652d7e-8005-11f1-aa6c-3cecef704050', 'AUD-2026-000001', '2026-07-15 09:54:06', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Authentication', 'users', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'LOGIN', 'Administrator logged into Avon ServicePro.', NULL, NULL, '127.0.0.1', 'Desktop PC', 'Google Chrome', 'Windows 11', '06652da1-8005-11f1-aa6c-3cecef704050', 'POST', '/api/auth/login', 200, 185, 1, NULL, '2026-07-15 04:24:06'),
('0665ea5a-8005-11f1-aa6c-3cecef704050', 'AUD-2026-000002', '2026-07-15 09:54:06', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Instrument Registry', 'instruments', NULL, 'UPDATE', 'Instrument information updated.', NULL, NULL, '127.0.0.1', NULL, 'Google Chrome', 'Windows 11', NULL, 'PUT', '/api/instruments', 200, 92, 1, NULL, '2026-07-15 04:24:06'),
('06665d74-8005-11f1-aa6c-3cecef704050', 'AUD-2026-000003', '2026-07-15 09:54:06', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Reports', 'reports', NULL, 'EXPORT', 'Service Report exported as PDF.', NULL, NULL, '127.0.0.1', NULL, 'Google Chrome', 'Windows 11', NULL, 'GET', '/api/reports/export', 200, 315, 1, NULL, '2026-07-15 04:24:06');

-- Seeding record block 11
INSERT INTO "background_jobs" ("id", "job_no", "job_name", "job_type", "queue_name", "priority", "payload", "scheduled_at", "started_at", "completed_at", "attempts", "max_attempts", "status", "progress_percent", "execution_time_ms", "worker_name", "error_message", "created_by", "created_at", "updated_at") VALUES
('8f037117-800a-11f1-aa6c-3cecef704050', 'BG-2026-000001', 'Daily Database Backup', 'BACKUP', 'system', 'CRITICAL', '{"backup": "database"}', '2026-07-15 11:33:43', NULL, NULL, 0, 3, 'QUEUED', 0.00, NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:03:43', '2026-07-15 05:03:43'),
('8f045a7c-800a-11f1-aa6c-3cecef704050', 'BG-2026-000002', 'Generate PM Schedules', 'PM_GENERATION', 'scheduler', 'HIGH', '{"months": 6}', '2026-07-15 10:33:43', NULL, NULL, 0, 3, 'QUEUED', 0.00, NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:03:43', '2026-07-15 05:03:43'),
('8f04b875-800a-11f1-aa6c-3cecef704050', 'BG-2026-000003', 'Calibration Schedule Generator', 'CALIBRATION_GENERATION', 'scheduler', 'HIGH', '{"months": 12}', '2026-07-15 10:33:43', NULL, NULL, 0, 3, 'QUEUED', 0.00, NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:03:43', '2026-07-15 05:03:43'),
('8f05112a-800a-11f1-aa6c-3cecef704050', 'BG-2026-000004', 'Notification Queue', 'NOTIFICATION', 'notifications', 'NORMAL', '{"channel": "EMAIL"}', '2026-07-15 10:33:43', NULL, NULL, 0, 3, 'QUEUED', 0.00, NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:03:43', '2026-07-15 05:03:43');

-- Seeding record block 12
INSERT INTO "barcodes" ("id", "barcode_no", "entity_type", "entity_id", "barcode_type", "barcode_value", "active", "generated_by", "generated_at", "remarks", "created_at", "updated_at") VALUES
('1d049e5f-8023-11f1-aa6c-3cecef704050', 'BAR-000001', 'INSTRUMENT', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'CODE128', 'AST000001', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 13:29:29', NULL, '2026-07-15 07:59:29', '2026-07-15 07:59:29');

-- Seeding record block 13
INSERT INTO "branches" ("id", "company_id", "branch_code", "branch_name", "address", "city", "phone", "email", "manager_name", "active", "created_at", "updated_at") VALUES
('73252b02-7f5e-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'HO', 'Head Office', NULL, 'Colombo', NULL, NULL, 'Cherub Weeratunge', 1, '2026-07-14 08:31:43', '2026-07-14 08:31:43');

-- Seeding record block 14
INSERT INTO "brands" ("id", "manufacturer_id", "brand_code", "brand_name", "website", "remarks", "active", "created_at", "updated_at") VALUES
('860f5119-7f77-11f1-aa6c-3cecef704050', '04a5db33-7f77-11f1-aa6c-3cecef704050', 'ABBOTT', 'Abbott', NULL, NULL, 1, '2026-07-14 11:31:12', '2026-07-14 11:31:12'),
('861008ae-7f77-11f1-aa6c-3cecef704050', '04a69327-7f77-11f1-aa6c-3cecef704050', 'BIORAD', 'Bio-Rad', NULL, NULL, 1, '2026-07-14 11:31:12', '2026-07-14 11:31:12'),
('86106cc8-7f77-11f1-aa6c-3cecef704050', '04a694a8-7f77-11f1-aa6c-3cecef704050', 'THERMO', 'Thermo Fisher', NULL, NULL, 1, '2026-07-14 11:31:12', '2026-07-14 11:31:12'),
('8610cddd-7f77-11f1-aa6c-3cecef704050', '04a694e3-7f77-11f1-aa6c-3cecef704050', 'BECKMAN', 'Beckman Coulter', NULL, NULL, 1, '2026-07-14 11:31:12', '2026-07-14 11:31:12'),
('86113384-7f77-11f1-aa6c-3cecef704050', '04a6950e-7f77-11f1-aa6c-3cecef704050', 'SIEMENS', 'Siemens Healthineers', NULL, NULL, 1, '2026-07-14 11:31:12', '2026-07-14 11:31:12'),
('8611914a-7f77-11f1-aa6c-3cecef704050', '04a69539-7f77-11f1-aa6c-3cecef704050', 'ROCHE', 'Roche Diagnostics', NULL, NULL, 1, '2026-07-14 11:31:12', '2026-07-14 11:31:12'),
('8611f8f7-7f77-11f1-aa6c-3cecef704050', '04a6955f-7f77-11f1-aa6c-3cecef704050', 'MINDRAY', 'Mindray', NULL, NULL, 1, '2026-07-14 11:31:12', '2026-07-14 11:31:12'),
('86125ece-7f77-11f1-aa6c-3cecef704050', '04a69584-7f77-11f1-aa6c-3cecef704050', 'BIOTEK', 'BioTek', NULL, NULL, 1, '2026-07-14 11:31:12', '2026-07-14 11:31:12'),
('8612c556-7f77-11f1-aa6c-3cecef704050', '04a695ad-7f77-11f1-aa6c-3cecef704050', 'EPPENDORF', 'Eppendorf', NULL, NULL, 1, '2026-07-14 11:31:12', '2026-07-14 11:31:12'),
('86132d49-7f77-11f1-aa6c-3cecef704050', '04a695d0-7f77-11f1-aa6c-3cecef704050', 'ANALYTIKJENA', 'Analytik Jena', NULL, NULL, 1, '2026-07-14 11:31:12', '2026-07-14 11:31:12'),
('86138c43-7f77-11f1-aa6c-3cecef704050', '04a695f0-7f77-11f1-aa6c-3cecef704050', 'OPTIKA', 'Optika', NULL, NULL, 1, '2026-07-14 11:31:12', '2026-07-14 11:31:12');

-- Seeding record block 15
INSERT INTO "calibration_certificates" ("id", "calibration_execution_id", "certificate_no", "certificate_type", "issue_date", "valid_from", "valid_until", "accreditation_body", "laboratory_name", "certificate_file", "qr_code", "verification_code", "issued_by", "approved_by", "approval_date", "certificate_status", "remarks", "created_at", "updated_at") VALUES
('cd394d64-7f80-11f1-aa6c-3cecef704050', '938ef26c-7f80-11f1-aa6c-3cecef704050', 'CALCERT-2026-000001', 'ISO17025', '2026-07-14', '2026-07-14', '2027-07-14', 'SLAB', 'AVON PHARMO CHEM Calibration Laboratory', NULL, NULL, 'cd394dbd-7f80-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'ISSUED', NULL, '2026-07-14 12:37:37', '2026-07-14 12:37:37');

-- Seeding record block 16
INSERT INTO "calibration_execution" ("id", "calibration_schedule_id", "job_id", "engineer_id", "execution_date", "start_time", "end_time", "calibration_method", "calibration_standard", "reference_equipment", "reference_equipment_serial", "certificate_no", "result", "uncertainty", "environmental_conditions", "observations", "corrective_action", "next_calibration_date", "execution_status", "verified_by", "verified_at", "remarks", "created_at", "updated_at") VALUES
('938ef26c-7f80-11f1-aa6c-3cecef704050', '596568e1-7f80-11f1-aa6c-3cecef704050', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14', '2026-07-14 18:06:00', '2026-07-14 20:06:00', 'Manufacturer Procedure', 'ISO/IEC 17025', 'Fluke 5522A Multi-Product Calibrator', 'FLK5522A-00001', 'CALCERT-2026-000001', 'PASS', '±0.25%', 'Temperature 23°C, RH 50%', 'Instrument calibrated successfully within tolerance.', 'No adjustment required.', '2028-07-14', 'COMPLETED', NULL, NULL, NULL, '2026-07-14 12:36:00', '2026-07-14 12:36:00');

-- Seeding record block 17
INSERT INTO "calibration_measurements" ("id", "calibration_execution_id", "measurement_no", "parameter_name", "parameter_code", "test_point", "reference_value", "measured_value", "correction_value", "uncertainty", "tolerance", "unit", "result", "remarks", "created_at", "updated_at") VALUES
('03b1169f-7f81-11f1-aa6c-3cecef704050', '938ef26c-7f80-11f1-aa6c-3cecef704050', 1, 'Temperature', 'TEMP', '37 °C', 37.000000, 37.020000, 0.020000, 0.050000, 0.100000, '°C', 'PASS', 'Within tolerance', '2026-07-14 12:39:09', '2026-07-14 12:39:09'),
('03b1ce9f-7f81-11f1-aa6c-3cecef704050', '938ef26c-7f80-11f1-aa6c-3cecef704050', 2, 'Voltage', 'VOLT', '230 VAC', 230.000000, 229.850000, -0.150000, 0.100000, 1.000000, 'VAC', 'PASS', 'Within tolerance', '2026-07-14 12:39:09', '2026-07-14 12:39:09'),
('03b245a1-7f81-11f1-aa6c-3cecef704050', '938ef26c-7f80-11f1-aa6c-3cecef704050', 3, 'RPM', 'RPM', '3000', 3000.000000, 2998.500000, -1.500000, 1.000000, 5.000000, 'RPM', 'PASS', 'Within tolerance', '2026-07-14 12:39:09', '2026-07-14 12:39:09');

-- Seeding record block 18
INSERT INTO "calibration_schedules" ("id", "instrument_id", "schedule_no", "calibration_no", "planned_date", "due_date", "scheduled_date", "completed_date", "assigned_engineer_id", "job_id", "calibration_interval_months", "calibration_type", "schedule_status", "generated_automatically", "remarks", "created_at", "updated_at") VALUES
('596568e1-7f80-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'CAL-2026-000001', 1, '2027-07-14', '2027-07-14', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, 12, 'ACCREDITED', 'PENDING', 1, NULL, '2026-07-14 12:34:23', '2026-07-14 12:34:23');

-- Seeding record block 19
INSERT INTO "checklist_templates" ("id", "template_code", "template_name", "module_name", "equipment_category_id", "description", "revision_no", "effective_date", "active", "created_by", "approved_by", "approved_at", "created_at", "updated_at") VALUES
('0294a23e-801f-11f1-aa6c-3cecef704050', 'PM-GENERAL', 'General Preventive Maintenance', 'PM', NULL, 'Standard PM checklist.', '1.0', '2026-07-15', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, '2026-07-15 07:30:06', '2026-07-15 07:30:06');

-- Seeding record block 20
INSERT INTO "checklist_template_items" ("id", "template_id", "line_no", "item_description", "item_type", "mandatory", "expected_value", "tolerance_min", "tolerance_max", "remarks", "created_at", "updated_at") VALUES
('0296fee6-801f-11f1-aa6c-3cecef704050', '0294a23e-801f-11f1-aa6c-3cecef704050', 1, 'Clean instrument exterior', 'CHECKBOX', 1, NULL, NULL, NULL, NULL, '2026-07-15 07:30:06', '2026-07-15 07:30:06'),
('0297530b-801f-11f1-aa6c-3cecef704050', '0294a23e-801f-11f1-aa6c-3cecef704050', 2, 'Check power supply voltage', 'NUMERIC', 1, NULL, NULL, NULL, NULL, '2026-07-15 07:30:06', '2026-07-15 07:30:06');

-- Seeding record block 21
INSERT INTO "comments" ("id", "comment_no", "entity_type", "entity_id", "parent_comment_id", "comment_text", "is_internal", "created_by", "edited", "edited_at", "created_at", "updated_at") VALUES
('5faf2001-801e-11f1-aa6c-3cecef704050', 'CMT-000001', 'SERVICE_JOB', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'Initial service inspection completed.', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 0, NULL, '2026-07-15 07:25:33', '2026-07-15 07:25:33');

-- Seeding record block 22
INSERT INTO "companies" ("id", "company_code", "company_name", "registration_no", "tax_no", "phone", "email", "website", "logo", "active", "created_at", "updated_at") VALUES
('d2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'AVON', 'AVON PHARMO CHEM (PVT) LTD', '', NULL, '', '', 'https://www.avonpclk.com', NULL, 1, '2026-07-14 08:27:14', '2026-07-14 08:27:14');

-- Seeding record block 23
INSERT INTO "contract_instruments" ("id", "contract_id", "instrument_id", "coverage_type", "remarks", "active", "created_at") VALUES
('764f5714-7f7b-11f1-aa6c-3cecef704050', '49b2ddcb-7f7b-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'FULL', NULL, 1, '2026-07-14 11:59:24');

-- Seeding record block 24
INSERT INTO "countries" ("id", "country_code", "country_name", "iso3_code", "phone_code", "currency_code", "currency_name", "active", "created_at", "updated_at") VALUES
('d3f5c6bb-7f73-11f1-aa6c-3cecef704050', 'LK', 'Sri Lanka', 'LKA', '+94', 'LKR', 'Sri Lankan Rupee', 1, '2026-07-14 11:04:45', '2026-07-14 11:04:45');

-- Seeding record block 25
INSERT INTO "customers" ("id", "company_id", "territory_id", "customer_code", "customer_name", "customer_type", "registration_no", "tax_no", "address_line1", "address_line2", "city", "postal_code", "phone", "mobile", "email", "website", "contact_person", "designation", "latitude", "longitude", "remarks", "active", "created_at", "updated_at") VALUES
('08d2bede-7f76-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'CUS000001', 'National Hospital of Sri Lanka', 'HOSPITAL', NULL, NULL, NULL, NULL, 'Colombo', NULL, '0112691111', NULL, 'info@nhsl.health.gov.lk', NULL, 'Chief Medical Laboratory Technologist', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:20:33', '2026-07-14 11:20:33'),
('08d39343-7f76-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'CUS000002', 'Asiri Central Hospital', 'HOSPITAL', NULL, NULL, NULL, NULL, 'Colombo', NULL, '0114523300', NULL, 'info@asiri.lk', NULL, 'Laboratory Manager', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:20:33', '2026-07-14 11:20:33'),
('08d43dec-7f76-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'CUS000003', 'Lanka Hospitals PLC', 'HOSPITAL', NULL, NULL, NULL, NULL, 'Colombo', NULL, '0115430000', NULL, 'info@lankahospitals.com', NULL, 'Biomedical Department', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:20:33', '2026-07-14 11:20:33');

-- Seeding record block 26
INSERT INTO "customer_complaints" ("id", "complaint_no", "customer_id", "instrument_id", "service_job_id", "complaint_date", "complaint_source", "contact_person", "contact_number", "email", "complaint_category", "priority", "complaint_description", "root_cause", "corrective_action", "resolution", "status", "assigned_to", "resolved_date", "closed_date", "customer_satisfaction", "remarks", "created_at", "updated_at") VALUES
('9eb499cc-7fee-11f1-aa6c-3cecef704050', 'CMP-2026-000001', '08d2bede-7f76-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', '2026-07-15 07:13:43', 'PHONE', 'Chief Medical Laboratory Technologist', '0771234567', NULL, 'BREAKDOWN', 'HIGH', 'Instrument displays temperature alarm during operation.', NULL, NULL, NULL, 'IN_PROGRESS', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, NULL, '2026-07-15 01:43:43', '2026-07-15 01:43:43');

-- Seeding record block 27
INSERT INTO "customer_contacts" ("id", "customer_id", "department_id", "contact_code", "title", "first_name", "last_name", "designation", "mobile", "phone", "extension", "email", "preferred_contact", "is_primary", "active", "created_at", "updated_at") VALUES
('c7a6b23f-7f76-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '784ad52d-7f76-11f1-aa6c-3cecef704050', 'CON001', NULL, 'Nimal', 'Perera', 'Chief Medical Laboratory Technologist', '0777000001', NULL, NULL, 'nimal.perera@nhsl.health.gov.lk', 'MOBILE', 1, 1, '2026-07-14 11:25:53', '2026-07-14 11:25:53'),
('c7a77812-7f76-11f1-aa6c-3cecef704050', '08d39343-7f76-11f1-aa6c-3cecef704050', '784bebec-7f76-11f1-aa6c-3cecef704050', 'CON001', NULL, 'Kasun', 'Fernando', 'Laboratory Manager', '0777000002', NULL, NULL, 'kasun.fernando@asiri.lk', 'MOBILE', 1, 1, '2026-07-14 11:25:53', '2026-07-14 11:25:53'),
('c7a7ebaf-7f76-11f1-aa6c-3cecef704050', '08d43dec-7f76-11f1-aa6c-3cecef704050', '784cf9ed-7f76-11f1-aa6c-3cecef704050', 'CON001', NULL, 'Saman', 'Jayasinghe', 'Biomedical Engineer', '0777000003', NULL, NULL, 'saman.j@lankahospitals.com', 'MOBILE', 1, 1, '2026-07-14 11:25:53', '2026-07-14 11:25:53');

-- Seeding record block 28
INSERT INTO "customer_departments" ("id", "customer_id", "department_code", "department_name", "location", "phone", "email", "remarks", "active", "created_at", "updated_at") VALUES
('784ad52d-7f76-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', 'LAB', 'Central Laboratory', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40'),
('784b880f-7f76-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', 'BIO', 'Biomedical Engineering Department', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40'),
('784bebec-7f76-11f1-aa6c-3cecef704050', '08d39343-7f76-11f1-aa6c-3cecef704050', 'LAB', 'Clinical Laboratory', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40'),
('784c4389-7f76-11f1-aa6c-3cecef704050', '08d39343-7f76-11f1-aa6c-3cecef704050', 'BIO', 'Biomedical Engineering Department', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40'),
('784c9e7c-7f76-11f1-aa6c-3cecef704050', '08d43dec-7f76-11f1-aa6c-3cecef704050', 'LAB', 'Laboratory', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40'),
('784cf9ed-7f76-11f1-aa6c-3cecef704050', '08d43dec-7f76-11f1-aa6c-3cecef704050', 'BIO', 'Biomedical Engineering Department', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40');

-- Seeding record block 29
INSERT INTO "customer_feedback" ("id", "feedback_no", "customer_id", "instrument_id", "service_job_id", "complaint_id", "feedback_date", "feedback_type", "overall_rating", "engineer_rating", "response_time_rating", "technical_quality_rating", "communication_rating", "professionalism_rating", "recommend_avon", "comments", "follow_up_required", "follow_up_completed", "reviewed_by", "reviewed_date", "created_at", "updated_at") VALUES
('ef4252e2-7fee-11f1-aa6c-3cecef704050', 'FDB-2026-000001', '08d2bede-7f76-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', '9eb499cc-7fee-11f1-aa6c-3cecef704050', '2026-07-15 07:15:58', 'SERVICE', 5, 5, 5, 5, 5, 5, 1, 'Excellent service. Problem resolved quickly.', 0, 0, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:15:58', '2026-07-15 01:45:58', '2026-07-15 01:45:58');

-- Seeding record block 30
INSERT INTO "dashboard_layouts" ("id", "layout_code", "user_id", "layout_name", "layout_json", "is_default", "created_at", "updated_at") VALUES
('d2719e78-801d-11f1-aa6c-3cecef704050', 'LAYOUT001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Default Dashboard', '{"cards": ["TOTAL_ASSETS", "OPEN_JOBS", "PM_DUE", "CAL_DUE"]}', 1, '2026-07-15 07:21:36', '2026-07-15 07:21:36');

-- Seeding record block 31
INSERT INTO "dashboard_widgets" ("id", "widget_code", "widget_name", "module_id", "widget_type", "icon", "color", "display_order", "width", "refresh_interval_seconds", "sql_view", "active", "created_by", "created_at", "updated_at") VALUES
('236effbf-8006-11f1-aa6c-3cecef704050', 'TOTAL_ASSETS', 'Total Assets', '46410e15-7f60-11f1-aa6c-3cecef704050', 'CARD', 'Package', 'blue', 1, 'SMALL', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('236fbef2-8006-11f1-aa6c-3cecef704050', 'PM_DUE', 'PM Due', '46410ef4-7f60-11f1-aa6c-3cecef704050', 'CARD', 'CalendarClock', 'orange', 2, 'SMALL', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('23702814-8006-11f1-aa6c-3cecef704050', 'CAL_DUE', 'Calibration Due', '46410ec0-7f60-11f1-aa6c-3cecef704050', 'CARD', 'FlaskConical', 'purple', 3, 'SMALL', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('23709220-8006-11f1-aa6c-3cecef704050', 'OPEN_JOBS', 'Open Service Jobs', '46410e53-7f60-11f1-aa6c-3cecef704050', 'CARD', 'Wrench', 'green', 4, 'SMALL', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('2370f437-8006-11f1-aa6c-3cecef704050', 'JOB_STATUS', 'Job Status', '46410e53-7f60-11f1-aa6c-3cecef704050', 'CHART', 'BarChart3', 'indigo', 5, 'LARGE', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('23715ba9-8006-11f1-aa6c-3cecef704050', 'LOW_STOCK', 'Low Stock Items', '46410f10-7f60-11f1-aa6c-3cecef704050', 'TABLE', 'Boxes', 'red', 6, 'LARGE', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('2371c0e1-8006-11f1-aa6c-3cecef704050', 'REVENUE', 'Monthly Revenue', '46410f29-7f60-11f1-aa6c-3cecef704050', 'CHART', 'TrendingUp', 'emerald', 7, 'FULL', 600, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04');

-- Seeding record block 32
INSERT INTO "database_migrations" ("id", "migration_no", "migration_file", "migration_name", "batch_no", "executed_at", "execution_time_ms", "execution_status", "checksum_sha256", "remarks", "created_at") VALUES
('468e2602-801a-11f1-aa6c-3cecef704050', 1, '001_create_companies.sql', 'Create Companies', 1, '2026-07-15 12:26:13', 35, 'SUCCESS', 'd099452ac1d8480683de7dfe60c790edb6c557ffffe5a1d09e7547e300ae4af4', NULL, '2026-07-15 06:56:13'),
('468e26ee-801a-11f1-aa6c-3cecef704050', 2, '002_create_branches.sql', 'Create Branches', 1, '2026-07-15 12:26:13', 28, 'SUCCESS', '7fc1b2484b0866273b72674c1919d5e96301d84db254d0f7617138f264b0adeb', NULL, '2026-07-15 06:56:13'),
('468e275d-801a-11f1-aa6c-3cecef704050', 3, '003_create_roles.sql', 'Create Roles', 1, '2026-07-15 12:26:13', 41, 'SUCCESS', '3e3d642a8ab1795e1f02306a2dce951e17f24555eb9a93cc186d37bdc6088b0e', NULL, '2026-07-15 06:56:13'),
('468e279c-801a-11f1-aa6c-3cecef704050', 4, '004_create_modules.sql', 'Create Modules', 1, '2026-07-15 12:26:13', 18, 'SUCCESS', '1490bbc790e89a3491919cd619d822947b823d1108cd5f0b53353e88e85a7971', NULL, '2026-07-15 06:56:13'),
('468e27d5-801a-11f1-aa6c-3cecef704050', 5, '005_create_permissions.sql', 'Create Permissions', 1, '2026-07-15 12:26:13', 63, 'SUCCESS', 'b22af94d36a3ae9752d3070878bfaf76db67c6c03aaacbd0eb4c558c352795df', NULL, '2026-07-15 06:56:13'),
('468e2812-801a-11f1-aa6c-3cecef704050', 108, '108_create_application_logs.sql', 'Application Logs', 1, '2026-07-15 12:26:13', 22, 'SUCCESS', '738ee4902926955b863219a080c52a9dd33a2ffdb3f64b2e7b9b3c0feba053c9', NULL, '2026-07-15 06:56:13'),
('468e2845-801a-11f1-aa6c-3cecef704050', 109, '109_create_system_announcements.sql', 'System Announcements', 1, '2026-07-15 12:26:13', 17, 'SUCCESS', '3a2703b2e7aedf7762a381e73aff9f6f6341a090cae270108e9b2b5a149d0d3d', NULL, '2026-07-15 06:56:13'),
('468e2879-801a-11f1-aa6c-3cecef704050', 110, '110_create_system_jobs.sql', 'System Jobs', 1, '2026-07-15 12:26:13', 19, 'SUCCESS', '5ada8d53eacc12b1e23be376ebcfc210d21bf9e4fc9a9fc9cb391c341d1c8dd2', NULL, '2026-07-15 06:56:13'),
('468e28ac-801a-11f1-aa6c-3cecef704050', 111, '111_create_system_preferences.sql', 'System Preferences', 1, '2026-07-15 12:26:13', 14, 'SUCCESS', '34e5292f1d3f0dbbb0c63a2fbe58149e59b77e80acd6347f228ac17aa35e3406', NULL, '2026-07-15 06:56:13'),
('468e28dc-801a-11f1-aa6c-3cecef704050', 112, '112_create_database_version.sql', 'Database Version', 1, '2026-07-15 12:26:13', 15, 'SUCCESS', '24a20047b6247610c2a68b33d343c64abfd0267b462caa0addb69e9e5a66d2a2', NULL, '2026-07-15 06:56:13');

-- Seeding record block 33
INSERT INTO "database_version" ("id", "version_no", "release_name", "schema_version", "application_version", "release_date", "installed_at", "installed_by", "migration_count", "status", "checksum_sha256", "release_notes", "created_at", "updated_at") VALUES
('468d58b2-801a-11f1-aa6c-3cecef704050', '1.0.0', 'Genesis', 112, '1.0.0', '2026-07-15', '2026-07-15 12:26:13', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 112, 'CURRENT', '370ad4eb6a0f1e144da5cb69ae76e786b071709fa4f699b8972c33150b8688ce', 'Initial production release of Avon ServicePro.', '2026-07-15 06:56:13', '2026-07-15 06:56:13');

-- Seeding record block 34
INSERT INTO "deleted_records" ("id", "delete_no", "company_id", "branch_id", "entity_type", "entity_id", "document_no", "record_json", "deleted_reason", "deleted_by", "deleted_at", "restored", "restored_by", "restored_at", "restore_notes", "created_at", "updated_at") VALUES
('5f3f234f-8025-11f1-aa6c-3cecef704050', 'DEL-000001', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'CUSTOMER', '08d2bede-7f76-11f1-aa6c-3cecef704050', 'CUS000001', '{"id": "08d2bede-7f76-11f1-aa6c-3cecef704050", "customer_code": "CUS000001", "customer_name": "National Hospital of Sri Lanka"}', 'Duplicate customer merged.', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 13:45:39', 0, NULL, NULL, NULL, '2026-07-15 08:15:39', '2026-07-15 08:15:39');

-- Seeding record block 35
INSERT INTO "department_targets" ("id", "target_no", "organizational_unit_id", "financial_year_id", "kpi_id", "target_name", "target_value", "minimum_value", "maximum_value", "target_weight", "achievement_value", "achievement_percentage", "evaluation_frequency", "responsible_user_id", "status", "remarks", "created_by", "approved_by", "approved_at", "created_at", "updated_at") VALUES
('c60c6002-8035-11f1-aa6c-3cecef704050', 'DT-000001', '79495228-802c-11f1-aa6c-3cecef704050', 'a38dff65-8030-11f1-aa6c-3cecef704050', '968b5c60-8033-11f1-aa6c-3cecef704050', 'Service Installation Completion', 100.0000, 95.0000, 100.0000, 100.00, 0.0000, 0.00, 'YEARLY', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'PLANNED', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, '2026-07-15 10:13:03', '2026-07-15 10:13:03'),
('c60cffcc-8035-11f1-aa6c-3cecef704050', 'DT-000002', '7949c816-802c-11f1-aa6c-3cecef704050', 'a38dff65-8030-11f1-aa6c-3cecef704050', '968b6052-8033-11f1-aa6c-3cecef704050', 'Workshop Completion Rate', 95.0000, 90.0000, 100.0000, 100.00, 0.0000, 0.00, 'YEARLY', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'PLANNED', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, '2026-07-15 10:13:03', '2026-07-15 10:13:03');

-- Seeding record block 36
INSERT INTO "districts" ("id", "province_id", "district_code", "district_name", "active", "created_at", "updated_at") VALUES
('9aab2897-7f74-11f1-aa6c-3cecef704050', 'fc858f81-7f73-11f1-aa6c-3cecef704050', 'COL', 'Colombo', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9aabfb4b-7f74-11f1-aa6c-3cecef704050', 'fc858f81-7f73-11f1-aa6c-3cecef704050', 'GAM', 'Gampaha', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9aac6bde-7f74-11f1-aa6c-3cecef704050', 'fc858f81-7f73-11f1-aa6c-3cecef704050', 'KAL', 'Kalutara', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9aacd017-7f74-11f1-aa6c-3cecef704050', 'fc86571b-7f73-11f1-aa6c-3cecef704050', 'KAN', 'Kandy', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9aad3f4e-7f74-11f1-aa6c-3cecef704050', 'fc86571b-7f73-11f1-aa6c-3cecef704050', 'MAT', 'Matale', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9aad9d75-7f74-11f1-aa6c-3cecef704050', 'fc86571b-7f73-11f1-aa6c-3cecef704050', 'NUW', 'Nuwara Eliya', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9aae050e-7f74-11f1-aa6c-3cecef704050', 'fc86b436-7f73-11f1-aa6c-3cecef704050', 'GAL', 'Galle', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9aae6204-7f74-11f1-aa6c-3cecef704050', 'fc86b436-7f73-11f1-aa6c-3cecef704050', 'HAM', 'Hambantota', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9aaebf68-7f74-11f1-aa6c-3cecef704050', 'fc86b436-7f73-11f1-aa6c-3cecef704050', 'MATR', 'Matara', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9aaf243e-7f74-11f1-aa6c-3cecef704050', 'fc870fea-7f73-11f1-aa6c-3cecef704050', 'JAF', 'Jaffna', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9aaf9b39-7f74-11f1-aa6c-3cecef704050', 'fc870fea-7f73-11f1-aa6c-3cecef704050', 'KIL', 'Kilinochchi', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab00cf5-7f74-11f1-aa6c-3cecef704050', 'fc870fea-7f73-11f1-aa6c-3cecef704050', 'MAN', 'Mannar', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab06f2b-7f74-11f1-aa6c-3cecef704050', 'fc870fea-7f73-11f1-aa6c-3cecef704050', 'MUL', 'Mullaitivu', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab0c614-7f74-11f1-aa6c-3cecef704050', 'fc870fea-7f73-11f1-aa6c-3cecef704050', 'VAV', 'Vavuniya', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab116a6-7f74-11f1-aa6c-3cecef704050', 'fc87780a-7f73-11f1-aa6c-3cecef704050', 'AMP', 'Ampara', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab16e13-7f74-11f1-aa6c-3cecef704050', 'fc87780a-7f73-11f1-aa6c-3cecef704050', 'BAT', 'Batticaloa', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab1c31f-7f74-11f1-aa6c-3cecef704050', 'fc87780a-7f73-11f1-aa6c-3cecef704050', 'TRI', 'Trincomalee', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab227c1-7f74-11f1-aa6c-3cecef704050', 'fc87d041-7f73-11f1-aa6c-3cecef704050', 'KUR', 'Kurunegala', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab2858a-7f74-11f1-aa6c-3cecef704050', 'fc87d041-7f73-11f1-aa6c-3cecef704050', 'PUT', 'Puttalam', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab2de3c-7f74-11f1-aa6c-3cecef704050', 'fc88328a-7f73-11f1-aa6c-3cecef704050', 'ANU', 'Anuradhapura', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab33ec7-7f74-11f1-aa6c-3cecef704050', 'fc88328a-7f73-11f1-aa6c-3cecef704050', 'POL', 'Polonnaruwa', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab3abfa-7f74-11f1-aa6c-3cecef704050', 'fc888c62-7f73-11f1-aa6c-3cecef704050', 'BAD', 'Badulla', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab4269e-7f74-11f1-aa6c-3cecef704050', 'fc888c62-7f73-11f1-aa6c-3cecef704050', 'MON', 'Monaragala', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab4a57b-7f74-11f1-aa6c-3cecef704050', 'fc88ebad-7f73-11f1-aa6c-3cecef704050', 'KEG', 'Kegalle', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18'),
('9ab52484-7f74-11f1-aa6c-3cecef704050', 'fc88ebad-7f73-11f1-aa6c-3cecef704050', 'RAT', 'Ratnapura', 1, '2026-07-14 11:10:18', '2026-07-14 11:10:18');

-- Seeding record block 37
INSERT INTO "document_reviews" ("id", "job_report_id", "documentation_officer_id", "installation_date", "job_sheet_no", "warranty_card_no", "warranty_start_date", "warranty_end_date", "warranty_period_months", "service_interval_months", "review_status", "decision_remarks", "returned_reason", "reviewed_at", "approved_at", "released_at", "created_at", "updated_at") VALUES
('9ddda42d-7f7e-11f1-aa6c-3cecef704050', '605168ec-7f7e-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14', 'JS-2026-000001', 'WC-2026-000001', '2026-07-14', '2027-07-14', 12, 12, 'DRAFT', 'Awaiting Documentation Review', NULL, '2026-07-14 17:51:59', NULL, NULL, '2026-07-14 12:21:59', '2026-07-14 12:21:59');

-- Seeding record block 38
INSERT INTO "document_review_audit" ("id", "document_review_id", "action", "previous_status", "new_status", "performed_by", "action_date", "remarks", "ip_address", "created_at") VALUES
('d36ad960-7f7e-11f1-aa6c-3cecef704050', '9ddda42d-7f7e-11f1-aa6c-3cecef704050', 'CREATED', NULL, 'DRAFT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:53:29', 'Documentation review record created.', NULL, '2026-07-14 12:23:29'),
('d36b8487-7f7e-11f1-aa6c-3cecef704050', '9ddda42d-7f7e-11f1-aa6c-3cecef704050', 'UPDATED', 'DRAFT', 'DRAFT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:53:29', 'Initial documentation details entered.', NULL, '2026-07-14 12:23:29');

-- Seeding record block 39
INSERT INTO "email_attachments" ("id", "email_queue_id", "attachment_no", "file_name", "original_file_name", "file_path", "file_type", "file_extension", "file_size_bytes", "mime_type", "checksum_sha256", "uploaded_at", "uploaded_by", "remarks", "created_at", "updated_at") VALUES
('6ac0eb58-800c-11f1-aa6c-3cecef704050', '1164df21-800c-11f1-aa6c-3cecef704050', 1, 'Service_Report_JOB-2026-000001.pdf', 'Service_Report.pdf', '/uploads/email/service_reports/Service_Report_JOB-2026-000001.pdf', 'REPORT', 'pdf', 425632, 'application/pdf', '66825029e3a0fa22ae12fd04c93326ce036b95a31fb25b9874b982d70ecf3808', '2026-07-15 10:47:01', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Attached Service Report', '2026-07-15 05:17:01', '2026-07-15 05:17:01'),
('6ac1b6bf-800c-11f1-aa6c-3cecef704050', '1165b12c-800c-11f1-aa6c-3cecef704050', 1, 'PM_Due_Report.pdf', 'PM_Due_Report.pdf', '/uploads/email/pm/PM_Due_Report.pdf', 'REPORT', 'pdf', 285944, 'application/pdf', '1d5c8499761c04503748efdb8c906aca00e42da5f2e7b0704f257e4d49361e93', '2026-07-15 10:47:01', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Attached PM Due Report', '2026-07-15 05:17:01', '2026-07-15 05:17:01'),
('6ac23602-800c-11f1-aa6c-3cecef704050', '11662243-800c-11f1-aa6c-3cecef704050', 1, 'Low_Stock_Report.xlsx', 'Low_Stock_Report.xlsx', '/uploads/email/inventory/Low_Stock_Report.xlsx', 'REPORT', 'xlsx', 194281, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '491e9d83653dd2daf93bb39fbdac5943a17a293e58f0a561bd0f64e1f1494c3f', '2026-07-15 10:47:01', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Attached Inventory Report', '2026-07-15 05:17:01', '2026-07-15 05:17:01');

-- Seeding record block 40
INSERT INTO "email_queue" ("id", "email_no", "recipient_name", "recipient_email", "cc_email", "bcc_email", "subject", "body", "template_id", "attachment_count", "priority", "scheduled_at", "queued_at", "sent_at", "retry_count", "max_retry_count", "status", "smtp_response", "created_by", "remarks", "created_at", "updated_at") VALUES
('1164df21-800c-11f1-aa6c-3cecef704050', 'EML-2026-000001', 'Cherub Weeratunge', 'admin@avonpclk.com', NULL, NULL, 'New Service Job Assigned', 'Your new service job has been assigned successfully.', 'b5599b8b-8004-11f1-aa6c-3cecef704050', 0, 'HIGH', '2026-07-15 10:44:31', '2026-07-15 10:44:31', NULL, 0, 3, 'QUEUED', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 05:14:31', '2026-07-15 05:14:31'),
('1165b12c-800c-11f1-aa6c-3cecef704050', 'EML-2026-000002', 'Cherub Weeratunge', 'admin@avonpclk.com', NULL, NULL, 'Preventive Maintenance Reminder', 'The following PM schedules are due within 7 days.', 'b55a7b76-8004-11f1-aa6c-3cecef704050', 0, 'NORMAL', '2026-07-15 11:44:31', '2026-07-15 10:44:31', NULL, 0, 3, 'QUEUED', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 05:14:31', '2026-07-15 05:14:31'),
('11662243-800c-11f1-aa6c-3cecef704050', 'EML-2026-000003', 'Cherub Weeratunge', 'admin@avonpclk.com', NULL, NULL, 'Low Stock Alert', 'Temperature Sensor stock has reached the reorder level.', 'b55b8a1d-8004-11f1-aa6c-3cecef704050', 0, 'URGENT', '2026-07-15 10:44:31', '2026-07-15 10:44:31', NULL, 0, 3, 'QUEUED', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 05:14:31', '2026-07-15 05:14:31');

-- Seeding record block 41
INSERT INTO "employee_kpi_assignments" ("id", "assignment_no", "employee_id", "kpi_id", "financial_year_id", "organizational_unit_id", "weight", "target_value", "minimum_value", "maximum_value", "effective_from", "effective_to", "active", "remarks", "assigned_by", "assigned_at", "created_at", "updated_at") VALUES
('b611a57d-8033-11f1-aa6c-3cecef704050', 'KPI-000001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '968b5c60-8033-11f1-aa6c-3cecef704050', 'a38dff65-8030-11f1-aa6c-3cecef704050', '79495228-802c-11f1-aa6c-3cecef704050', 20.00, 100.0000, NULL, NULL, '2026-04-01', NULL, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 15:28:17', '2026-07-15 09:58:17', '2026-07-15 09:58:17');

-- Seeding record block 42
INSERT INTO "employee_performance_summary" ("id", "summary_no", "employee_id", "financial_year_id", "organizational_unit_id", "evaluation_period", "period_year", "period_month", "total_kpis", "completed_kpis", "pending_kpis", "total_weight", "weighted_score", "performance_percentage", "performance_grade", "performance_rating", "department_rank", "company_rank", "promotion_recommended", "increment_recommended", "bonus_recommended", "appraisal_completed", "appraisal_date", "evaluated_by", "approved_by", "remarks", "created_at", "updated_at") VALUES
('4b43dd44-8036-11f1-aa6c-3cecef704050', 'EPS-000001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'a38dff65-8030-11f1-aa6c-3cecef704050', '79495228-802c-11f1-aa6c-3cecef704050', 'MONTHLY', 2026, 7, 10, 10, 0, 100.00, 92.50, 92.50, 'A', 'EXCEEDS_EXPECTATION', 1, 3, 1, 1, 1, 1, '2026-07-15', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 10:16:47', '2026-07-15 10:16:47');

-- Seeding record block 43
INSERT INTO "engineer_tags" ("id", "tag_code", "tag_name", "description", "active", "created_at", "updated_at") VALUES
('6d8550ec-7f62-11f1-aa6c-3cecef704050', 'AREA', 'Area Engineer', 'Field Service Engineer', 1, '2026-07-14 09:00:12', '2026-07-14 09:00:12'),
('6d855266-7f62-11f1-aa6c-3cecef704050', 'WORKSHOP', 'Workshop Engineer', 'Workshop Repair Engineer', 1, '2026-07-14 09:00:12', '2026-07-14 09:00:12'),
('6d8552e3-7f62-11f1-aa6c-3cecef704050', 'CALIBRATION', 'Calibration Engineer', 'Calibration & Validation Engineer', 1, '2026-07-14 09:00:12', '2026-07-14 09:00:12');

-- Seeding record block 44
INSERT INTO "entity_checklists" ("id", "checklist_no", "template_id", "entity_type", "entity_id", "assigned_to", "started_at", "completed_at", "status", "completion_percentage", "created_at") VALUES
('0299f762-801f-11f1-aa6c-3cecef704050', 'CHK-000001', '0294a23e-801f-11f1-aa6c-3cecef704050', 'PM_EXECUTION', 'de122bb4-7f7f-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'PENDING', 0.00, '2026-07-15 07:30:06');

-- Seeding record block 45
INSERT INTO "entity_checklist_items" ("id", "checklist_id", "template_item_id", "result_text", "numeric_result", "pass", "completed", "completed_by", "completed_at", "remarks", "created_at") VALUES
('029c5858-801f-11f1-aa6c-3cecef704050', '0299f762-801f-11f1-aa6c-3cecef704050', '0296fee6-801f-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-07-15 07:30:06'),
('029c595b-801f-11f1-aa6c-3cecef704050', '0299f762-801f-11f1-aa6c-3cecef704050', '0297530b-801f-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-07-15 07:30:06');

-- Seeding record block 46
INSERT INTO "export_jobs" ("id", "export_no", "export_type", "module_name", "report_name", "total_records", "exported_file_name", "file_storage_id", "exported_by", "started_at", "completed_at", "status", "remarks", "created_at", "updated_at") VALUES
('1eae9f5e-8024-11f1-aa6c-3cecef704050', 'EXP-000001', 'PDF', 'SERVICE', 'Service Job Summary', 145, 'service_jobs.pdf', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 13:36:41', '2026-07-15 13:36:41', 'COMPLETED', NULL, '2026-07-15 08:06:41', '2026-07-15 08:06:41');

-- Seeding record block 47
INSERT INTO "favorites" ("id", "user_id", "entity_type", "entity_id", "created_at") VALUES
('d273dcbc-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'CUSTOMER', '08d2bede-7f76-11f1-aa6c-3cecef704050', '2026-07-15 07:21:36');

-- Seeding record block 48
INSERT INTO "feature_flags" ("id", "feature_code", "feature_name", "description", "enabled", "rollout_percentage", "minimum_version", "created_by", "created_at", "updated_at") VALUES
('220ba884-801d-11f1-aa6c-3cecef704050', 'AI_ASSISTANT', 'AI Assistant', 'Enable AI assistant.', 1, 100.00, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:16:40', '2026-07-15 07:16:40'),
('220c0820-801d-11f1-aa6c-3cecef704050', 'MOBILE_APP', 'Mobile Application', 'Enable mobile features.', 0, 100.00, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:16:40', '2026-07-15 07:16:40'),
('220c62d3-801d-11f1-aa6c-3cecef704050', 'API_ACCESS', 'Public API', 'Enable external API access.', 1, 100.00, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:16:40', '2026-07-15 07:16:40');

-- Seeding record block 49
INSERT INTO "file_storage" ("id", "file_no", "company_id", "uploaded_by", "module_name", "entity_name", "entity_id", "document_type", "category", "original_file_name", "stored_file_name", "file_extension", "mime_type", "file_size", "storage_path", "checksum_sha256", "version_no", "is_latest", "access_level", "download_count", "active", "remarks", "created_at", "updated_at") VALUES
('e5e42cba-800c-11f1-aa6c-3cecef704050', 'FILE-2026-000001', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'SERVICE', 'service_jobs', NULL, 'REPORT', 'Service Report', 'Service_Report.pdf', 'e5e42cec-800c-11f1-aa6c-3cecef704050', 'pdf', 'application/pdf', 425684, '/uploads/service/', '778504aa48460874efefeb3cb56d2c85a570661f14f2017e67bcc27093a3abf9', 1, 1, 'INTERNAL', 0, 1, 'Generated Service Report', '2026-07-15 05:20:27', '2026-07-15 05:20:27'),
('e5e5943b-800c-11f1-aa6c-3cecef704050', 'FILE-2026-000002', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'CALIBRATION', 'calibration_certificates', NULL, 'CERTIFICATE', 'Calibration Certificate', 'Calibration_Certificate.pdf', 'e5e5945c-800c-11f1-aa6c-3cecef704050', 'pdf', 'application/pdf', 312845, '/uploads/calibration/', '1b61b04602fd5c0c04def93ba9acd1f7a62ce900ece14217758f95995c9f66e8', 1, 1, 'CONFIDENTIAL', 0, 1, NULL, '2026-07-15 05:20:27', '2026-07-15 05:20:27'),
('e5e615dc-800c-11f1-aa6c-3cecef704050', 'FILE-2026-000003', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'INSTRUMENTS', 'instruments', NULL, 'IMAGE', 'Equipment Photo', 'Instrument.jpg', 'e5e615f1-800c-11f1-aa6c-3cecef704050', 'jpg', 'image/jpeg', 854321, '/uploads/instruments/', 'f9f519ea45fb821a018b6a0e05c2494d1b9e927ca144021ab88c7e2c6473b315', 1, 1, 'INTERNAL', 0, 1, NULL, '2026-07-15 05:20:27', '2026-07-15 05:20:27');

-- Seeding record block 50
INSERT INTO "file_versions" ("id", "file_storage_id", "version_no", "original_file_name", "stored_file_name", "storage_path", "file_extension", "mime_type", "file_size", "checksum_sha256", "change_summary", "approved", "approved_by", "approved_at", "uploaded_by", "uploaded_at", "created_at", "updated_at") VALUES
('28ab5c79-800d-11f1-aa6c-3cecef704050', 'e5e42cba-800c-11f1-aa6c-3cecef704050', 1, 'Service_Report.pdf', 'e5e42cec-800c-11f1-aa6c-3cecef704050', '/uploads/service/', 'pdf', 'application/pdf', 425684, '778504aa48460874efefeb3cb56d2c85a570661f14f2017e67bcc27093a3abf9', 'Initial document upload.', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', '2026-07-15 05:22:19', '2026-07-15 05:22:19'),
('28ac16af-800d-11f1-aa6c-3cecef704050', 'e5e5943b-800c-11f1-aa6c-3cecef704050', 1, 'Calibration_Certificate.pdf', 'e5e5945c-800c-11f1-aa6c-3cecef704050', '/uploads/calibration/', 'pdf', 'application/pdf', 312845, '1b61b04602fd5c0c04def93ba9acd1f7a62ce900ece14217758f95995c9f66e8', 'Original calibration certificate.', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', '2026-07-15 05:22:19', '2026-07-15 05:22:19'),
('28ac93b3-800d-11f1-aa6c-3cecef704050', 'e5e615dc-800c-11f1-aa6c-3cecef704050', 1, 'Instrument.jpg', 'e5e615f1-800c-11f1-aa6c-3cecef704050', '/uploads/instruments/', 'jpg', 'image/jpeg', 854321, 'f9f519ea45fb821a018b6a0e05c2494d1b9e927ca144021ab88c7e2c6473b315', 'Equipment image uploaded.', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', '2026-07-15 05:22:19', '2026-07-15 05:22:19');

-- Seeding record block 51
INSERT INTO "financial_years" ("id", "financial_year_code", "financial_year_name", "start_date", "end_date", "status", "is_default", "description", "created_by", "created_at", "updated_at") VALUES
('a38dff65-8030-11f1-aa6c-3cecef704050', 'FY2026-2027', 'Financial Year 2026/2027', '2026-04-01', '2027-03-31', 'ACTIVE', 1, 'Default financial year.', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:36:18', '2026-07-15 09:36:18'),
('a38edf40-8030-11f1-aa6c-3cecef704050', 'FY2027-2028', 'Financial Year 2027/2028', '2027-04-01', '2028-03-31', 'PLANNING', 0, 'Next financial year.', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:36:18', '2026-07-15 09:36:18');

-- Seeding record block 52
INSERT INTO "goods_receipts" ("id", "purchase_order_id", "supplier_id", "location_id", "grn_no", "supplier_invoice_no", "supplier_delivery_note", "received_date", "received_by", "inspected_by", "receipt_status", "remarks", "created_at", "updated_at") VALUES
('19a8e572-7fe1-11f1-aa6c-3cecef704050', '5dbdd081-7fe0-11f1-aa6c-3cecef704050', 'fd7c87de-7fdf-11f1-aa6c-3cecef704050', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', 'GRN-2026-000001', 'INV-2026-000145', 'DN-2026-000089', '2026-07-15', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'RECEIVED', 'Complete shipment received.', '2026-07-15 00:06:56', '2026-07-15 00:06:56');

-- Seeding record block 53
INSERT INTO "goods_receipt_items" ("id", "goods_receipt_id", "purchase_order_item_id", "part_id", "quantity_received", "quantity_accepted", "quantity_rejected", "unit_cost", "batch_no", "serial_no", "expiry_date", "inspection_status", "remarks", "created_at", "updated_at") VALUES
('36593263-7fe1-11f1-aa6c-3cecef704050', '19a8e572-7fe1-11f1-aa6c-3cecef704050', 'b768a770-7fe0-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', 10.00, 10.00, 0.00, 18500.00, NULL, NULL, NULL, 'ACCEPTED', NULL, '2026-07-15 00:07:44', '2026-07-15 00:07:44'),
('36593a67-7fe1-11f1-aa6c-3cecef704050', '19a8e572-7fe1-11f1-aa6c-3cecef704050', 'b769767c-7fe0-11f1-aa6c-3cecef704050', '521e20eb-7fde-11f1-aa6c-3cecef704050', 20.00, 20.00, 0.00, 350.00, NULL, NULL, NULL, 'ACCEPTED', NULL, '2026-07-15 00:07:44', '2026-07-15 00:07:44'),
('36593b04-7fe1-11f1-aa6c-3cecef704050', '19a8e572-7fe1-11f1-aa6c-3cecef704050', 'b769fa4d-7fe0-11f1-aa6c-3cecef704050', '521e8ab5-7fde-11f1-aa6c-3cecef704050', 5.00, 5.00, 0.00, 4200.00, NULL, NULL, NULL, 'ACCEPTED', NULL, '2026-07-15 00:07:44', '2026-07-15 00:07:44');

-- Seeding record block 54
INSERT INTO "holidays" ("id", "holiday_code", "company_id", "branch_id", "holiday_name", "holiday_date", "holiday_type", "recurring", "active", "remarks", "created_by", "created_at", "updated_at") VALUES
('aeebfe1c-8026-11f1-aa6c-3cecef704050', 'HOL-NEWYEAR', NULL, NULL, 'New Year''s Day', '2026-01-01', 'PUBLIC', 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aeec5afa-8026-11f1-aa6c-3cecef704050', 'HOL-INDEPENDENCE', NULL, NULL, 'Independence Day', '2026-02-04', 'PUBLIC', 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aeecc131-8026-11f1-aa6c-3cecef704050', 'HOL-MAYDAY', NULL, NULL, 'May Day', '2026-05-01', 'PUBLIC', 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02');

-- Seeding record block 55
INSERT INTO "import_errors" ("id", "import_job_id", "import_row", "field_name", "field_data", "error_type", "error_message", "corrected", "created_at") VALUES
('e337de0e-8024-11f1-aa6c-3cecef704050', 'fd102148-8023-11f1-aa6c-3cecef704050', 15, 'Serial Number', '', 'VALIDATION', 'Serial Number cannot be empty.', 0, '2026-07-15 08:12:11');

-- Seeding record block 56
INSERT INTO "import_jobs" ("id", "import_no", "import_type", "original_file_name", "stored_file_name", "file_storage_id", "total_rows", "successful_rows", "failed_rows", "duplicate_rows", "skipped_rows", "status", "started_at", "completed_at", "imported_by", "remarks", "created_at", "updated_at") VALUES
('fd102148-8023-11f1-aa6c-3cecef704050', 'IMP-000001', 'INSTRUMENTS', 'instruments.xlsx', NULL, NULL, 250, 248, 2, 0, 0, 'COMPLETED', '2026-07-15 13:35:45', '2026-07-15 13:35:45', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 08:05:45', '2026-07-15 08:05:45');

-- Seeding record block 57
INSERT INTO "instruments" ("id", "company_id", "customer_id", "department_id", "territory_id", "model_id", "assigned_engineer_id", "asset_no", "serial_no", "inventory_no", "customer_asset_no", "instrument_name", "installation_date", "delivery_date", "commissioning_date", "warranty_start", "warranty_end", "service_interval_months", "calibration_interval_months", "last_pm_date", "next_pm_date", "last_calibration_date", "next_calibration_date", "lifecycle_status", "warranty_status", "remarks", "active", "created_at", "updated_at") VALUES
('658854ed-7f7a-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '784ad52d-7f76-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', '24dded3b-7f79-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'AST000001', 'SN-ARCH-000001', NULL, NULL, 'Abbott ARCHITECT c4000', '2026-07-14', '2026-07-14', '2026-07-14', '2026-07-14', '2027-07-14', 12, 12, NULL, '2027-07-14', NULL, '2027-07-14', 'INSTALLED', 'UNDER_WARRANTY', NULL, 1, '2026-07-14 11:51:46', '2026-07-14 11:51:46');

-- Seeding record block 58
INSERT INTO "instrument_categories" ("id", "category_code", "category_name", "parent_category_id", "description", "calibration_required", "pm_required", "active", "created_at", "updated_at") VALUES
('c9dd1ba9-7f78-11f1-aa6c-3cecef704050', 'CHEMISTRY', 'Clinical Chemistry Analyzer', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd1d3c-7f78-11f1-aa6c-3cecef704050', 'HEMATOLOGY', 'Hematology Analyzer', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd1e18-7f78-11f1-aa6c-3cecef704050', 'IMMUNOASSAY', 'Immunoassay Analyzer', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd1e51-7f78-11f1-aa6c-3cecef704050', 'PCR', 'PCR / Real-Time PCR', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd1e7d-7f78-11f1-aa6c-3cecef704050', 'MICROSCOPE', 'Microscope', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd1ec7-7f78-11f1-aa6c-3cecef704050', 'CENTRIFUGE', 'Centrifuge', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd1efc-7f78-11f1-aa6c-3cecef704050', 'INCUBATOR', 'Incubator', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd1f2d-7f78-11f1-aa6c-3cecef704050', 'AUTOCLAVE', 'Autoclave', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd1f63-7f78-11f1-aa6c-3cecef704050', 'BSC', 'Biosafety Cabinet', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd202b-7f78-11f1-aa6c-3cecef704050', 'LAMINAR', 'Laminar Flow Cabinet', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd2060-7f78-11f1-aa6c-3cecef704050', 'BALANCE', 'Laboratory Balance', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd2092-7f78-11f1-aa6c-3cecef704050', 'SPECTRO', 'Spectrophotometer', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd20c3-7f78-11f1-aa6c-3cecef704050', 'ELECTROPHORESIS', 'Electrophoresis System', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd20f5-7f78-11f1-aa6c-3cecef704050', 'GELDOC', 'Gel Documentation System', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd2127-7f78-11f1-aa6c-3cecef704050', 'NGS', 'Next Generation Sequencer', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd2160-7f78-11f1-aa6c-3cecef704050', 'REFRIGERATOR', 'Laboratory Refrigerator', NULL, NULL, 0, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd219a-7f78-11f1-aa6c-3cecef704050', 'FREEZER', 'Laboratory Freezer', NULL, NULL, 0, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd21d6-7f78-11f1-aa6c-3cecef704050', 'ULTRASOUND', 'Ultrasound Scanner', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd22a2-7f78-11f1-aa6c-3cecef704050', 'PATIENT_MONITOR', 'Patient Monitor', NULL, NULL, 1, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16'),
('c9dd22d7-7f78-11f1-aa6c-3cecef704050', 'OTHER', 'Other Scientific Equipment', NULL, NULL, 0, 1, 1, '2026-07-14 11:40:16', '2026-07-14 11:40:16');

-- Seeding record block 59
INSERT INTO "instrument_documents" ("id", "instrument_id", "document_type", "document_title", "original_file_name", "stored_file_name", "file_path", "file_extension", "mime_type", "file_size", "version_no", "uploaded_by", "upload_date", "remarks", "active", "created_at", "updated_at") VALUES
('9fd32a58-7f7a-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'USER_MANUAL', 'Abbott ARCHITECT c4000 User Manual', 'Architect_c4000_User_Manual.pdf', '9fd32a73-7f7a-11f1-aa6c-3cecef704050', '/uploads/instruments/manuals/', 'pdf', 'application/pdf', NULL, '1.0', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:23:24', NULL, 1, '2026-07-14 11:53:24', '2026-07-14 11:53:24');

-- Seeding record block 60
INSERT INTO "instrument_history" ("id", "instrument_id", "event_type", "event_date", "reference_type", "reference_id", "description", "previous_status", "new_status", "performed_by", "remarks", "created_at") VALUES
('efd0a9fc-7f7a-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'REGISTERED', '2026-07-14 17:25:38', 'MANUAL', NULL, 'Instrument registered in AVON ServicePro', NULL, 'INSTALLED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-14 11:55:38'),
('efd181be-7f7a-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'INSTALLED', '2026-07-14 17:25:38', 'INSTALLATION', NULL, 'Initial installation completed', 'PENDING_INSTALLATION', 'INSTALLED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-14 11:55:38');

-- Seeding record block 61
INSERT INTO "instrument_models" ("id", "brand_id", "category_id", "model_code", "model_name", "manufacturer_model_no", "description", "service_interval_months", "warranty_months", "calibration_required", "pm_required", "power_requirement", "dimensions", "weight_kg", "discontinued", "active", "created_at", "updated_at") VALUES
('24dded3b-7f79-11f1-aa6c-3cecef704050', '860f5119-7f77-11f1-aa6c-3cecef704050', 'c9dd1ba9-7f78-11f1-aa6c-3cecef704050', 'ARCHITECT_C4000', 'ARCHITECT c4000', 'ARCHITECT c4000', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48'),
('24deacbd-7f79-11f1-aa6c-3cecef704050', '861008ae-7f77-11f1-aa6c-3cecef704050', 'c9dd20f5-7f78-11f1-aa6c-3cecef704050', 'GELDOC_GO', 'GelDoc Go Imaging System', 'GelDoc Go', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48'),
('24df1144-7f79-11f1-aa6c-3cecef704050', '86125ece-7f77-11f1-aa6c-3cecef704050', 'c9dd2092-7f78-11f1-aa6c-3cecef704050', 'SYNERGY_H1', 'Synergy H1 Multimode Reader', 'Synergy H1', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48'),
('24dfbb8f-7f79-11f1-aa6c-3cecef704050', '86132d49-7f77-11f1-aa6c-3cecef704050', 'c9dd1e51-7f78-11f1-aa6c-3cecef704050', 'QTOWER3G', 'qTOWER³ G', 'qTOWER³ G', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48'),
('24e021c8-7f79-11f1-aa6c-3cecef704050', '86138c43-7f77-11f1-aa6c-3cecef704050', 'c9dd1e7d-7f78-11f1-aa6c-3cecef704050', 'B500', 'B-500 Research Microscope', 'B-500', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48'),
('24e0816c-7f79-11f1-aa6c-3cecef704050', '8612c556-7f77-11f1-aa6c-3cecef704050', 'c9dd1ec7-7f78-11f1-aa6c-3cecef704050', 'CENT5702', 'Centrifuge 5702', '5702', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48');

-- Seeding record block 62
INSERT INTO "inventory_locations" ("id", "company_id", "location_code", "location_name", "location_type", "address_line1", "address_line2", "city", "contact_person", "phone", "email", "active", "created_at", "updated_at") VALUES
('ef84ae2e-7fde-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'SC-NAV', 'Service Centre - Navinna', 'SERVICE_CENTER', 'Navinna', NULL, 'Maharagama', NULL, NULL, NULL, 1, '2026-07-14 23:51:27', '2026-07-14 23:51:27'),
('ef8565d2-7fde-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'GS-HOM', 'General Stores - Homagama', 'MAIN_STORE', 'Homagama', NULL, 'Homagama', NULL, NULL, NULL, 1, '2026-07-14 23:51:27', '2026-07-14 23:51:27');

-- Seeding record block 63
INSERT INTO "inventory_stock" ("id", "location_id", "part_id", "quantity_on_hand", "quantity_reserved", "average_cost", "last_purchase_cost", "last_updated", "remarks", "created_at", "updated_at") VALUES
('405a4984-7fdf-11f1-aa6c-3cecef704050', 'ef84ae2e-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', 5.00, 1.00, 18500.00, 18500.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42'),
('405afd7d-7fdf-11f1-aa6c-3cecef704050', 'ef84ae2e-7fde-11f1-aa6c-3cecef704050', '521e20eb-7fde-11f1-aa6c-3cecef704050', 20.00, 2.00, 350.00, 350.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42'),
('405b6138-7fdf-11f1-aa6c-3cecef704050', 'ef84ae2e-7fde-11f1-aa6c-3cecef704050', '521e8ab5-7fde-11f1-aa6c-3cecef704050', 3.00, 0.00, 4200.00, 4200.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42'),
('405bc236-7fdf-11f1-aa6c-3cecef704050', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', 25.00, 0.00, 18500.00, 18500.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42'),
('405c20a8-7fdf-11f1-aa6c-3cecef704050', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521e20eb-7fde-11f1-aa6c-3cecef704050', 100.00, 5.00, 350.00, 350.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42'),
('405c802f-7fdf-11f1-aa6c-3cecef704050', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521e8ab5-7fde-11f1-aa6c-3cecef704050', 12.00, 1.00, 4200.00, 4200.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42');

-- Seeding record block 64
INSERT INTO "inventory_transactions" ("id", "transaction_no", "location_id", "part_id", "job_id", "workshop_job_id", "transaction_type", "reference_no", "quantity", "unit_cost", "balance_after", "transaction_date", "performed_by", "remarks", "created_at") VALUES
('a1735887-7fdf-11f1-aa6c-3cecef704050', 'IT-2026-000001', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', NULL, NULL, 'OPENING', 'OPENING-STOCK', 25.00, 18500.00, 25.00, '2026-07-15 05:26:25', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Opening Stock Balance', '2026-07-14 23:56:25'),
('a17427c0-7fdf-11f1-aa6c-3cecef704050', 'IT-2026-000002', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'ISSUE_TO_JOB', 'JOB-2026-000001', 1.00, 18500.00, 24.00, '2026-07-15 05:26:25', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Issued for Breakdown Repair', '2026-07-14 23:56:25'),
('a174a1f9-7fdf-11f1-aa6c-3cecef704050', 'IT-2026-000003', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', NULL, NULL, 'TRANSFER_OUT', 'TRF-2026-000001', 5.00, 18500.00, 19.00, '2026-07-15 05:26:25', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Transferred to Service Centre - Navinna', '2026-07-14 23:56:25'),
('a175162a-7fdf-11f1-aa6c-3cecef704050', 'IT-2026-000004', 'ef84ae2e-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', NULL, NULL, 'TRANSFER_IN', 'TRF-2026-000001', 5.00, 18500.00, 10.00, '2026-07-15 05:26:25', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Received from General Stores', '2026-07-14 23:56:25');

-- Seeding record block 65
INSERT INTO "job_attachments" ("id", "job_id", "attachment_type", "document_title", "original_file_name", "stored_file_name", "file_path", "file_extension", "mime_type", "file_size", "uploaded_by", "uploaded_at", "remarks", "active", "created_at", "updated_at") VALUES
('6145f8b9-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'PHOTO', 'Before Repair Image', 'before_repair.jpg', '6145f8d8-7f7d-11f1-aa6c-3cecef704050.jpg', '/uploads/jobs/photos/', 'jpg', 'image/jpeg', 248563, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:43:08', NULL, 1, '2026-07-14 12:13:08', '2026-07-14 12:13:08'),
('6146e42d-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE_REPORT', 'Service Report', 'service_report.pdf', '6146e453-7f7d-11f1-aa6c-3cecef704050.pdf', '/uploads/jobs/reports/', 'pdf', 'application/pdf', 785412, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:43:08', NULL, 1, '2026-07-14 12:13:08', '2026-07-14 12:13:08');

-- Seeding record block 66
INSERT INTO "job_checklists" ("id", "job_id", "checklist_type", "section_name", "item_no", "checklist_item", "result", "measured_value", "specification", "remarks", "completed_by", "completed_at", "created_at", "updated_at") VALUES
('aaa5af6f-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE', 'General Inspection', 1, 'Instrument powers ON successfully', 'PASS', NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:45:11', '2026-07-14 12:15:11', '2026-07-14 12:15:11'),
('aaa68435-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE', 'General Inspection', 2, 'Self-test completed', 'PASS', NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:45:11', '2026-07-14 12:15:11', '2026-07-14 12:15:11'),
('aaa7070e-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE', 'Performance', 3, 'Performance verification completed', 'PASS', NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:45:11', '2026-07-14 12:15:11', '2026-07-14 12:15:11'),
('aaa781a0-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE', 'Documentation', 4, 'Customer informed', 'PASS', NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:45:11', '2026-07-14 12:15:11', '2026-07-14 12:15:11');

-- Seeding record block 67
INSERT INTO "job_measurements" ("id", "job_id", "checklist_id", "measurement_group", "parameter_name", "parameter_code", "measured_value", "measured_text", "unit", "minimum_value", "maximum_value", "nominal_value", "tolerance", "result", "measuring_device", "measuring_device_serial", "remarks", "measured_by", "measured_at", "created_at", "updated_at") VALUES
('e898123e-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'Temperature', 'Internal Temperature', 'TEMP', 37.200000, NULL, '°C', 36.500000, 37.500000, NULL, NULL, 'PASS', 'Digital Thermometer', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:46:55', '2026-07-14 12:16:55', '2026-07-14 12:16:55'),
('e898df37-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'Electrical', 'Input Voltage', 'VIN', 230.500000, NULL, 'VAC', 220.000000, 240.000000, NULL, NULL, 'PASS', 'Fluke 87V', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:46:55', '2026-07-14 12:16:55', '2026-07-14 12:16:55'),
('e8998a52-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'Mechanical', 'Rotor Speed', 'RPM', 3000.000000, NULL, 'RPM', 2950.000000, 3050.000000, NULL, NULL, 'PASS', 'Tachometer', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:46:55', '2026-07-14 12:16:55', '2026-07-14 12:16:55');

-- Seeding record block 68
INSERT INTO "job_parts" ("id", "job_id", "part_number", "part_name", "manufacturer", "quantity_requested", "quantity_received", "quantity_used", "unit_price", "supplier_name", "purchase_order_no", "ordered_date", "expected_date", "received_date", "installed_date", "status", "tracking_no", "remarks", "created_by", "created_at", "updated_at") VALUES
('2d86ba18-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'TEMP-SENSOR-001', 'Temperature Sensor', 'Abbott', 1.00, 0.00, 0.00, 18500.00, 'AVON Stores', 'PO-2026-000001', '2026-07-14', '2026-07-21', NULL, NULL, 'ORDERED', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 12:11:41', '2026-07-14 12:11:41');

-- Seeding record block 69
INSERT INTO "job_parts_consumption" ("id", "job_id", "job_part_id", "instrument_id", "part_number", "part_name", "serial_no", "batch_no", "quantity_used", "unit_cost", "replaced_component", "replacement_reason", "installed_by", "installed_date", "remarks", "created_at", "updated_at") VALUES
('279d013a-7f7e-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', '2d86ba18-7f7d-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'TEMP-SENSOR-001', 'Temperature Sensor', NULL, NULL, 1.00, 18500.00, 'Temperature Sensor', 'Sensor Failure', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:48:40', NULL, '2026-07-14 12:18:40', '2026-07-14 12:18:40');

-- Seeding record block 70
INSERT INTO "job_reports" ("id", "job_id", "report_type", "report_no", "engineer_summary", "customer_complaint", "root_cause", "corrective_action", "preventive_action", "recommendations", "customer_feedback", "customer_signature_name", "customer_signed", "signed_date", "engineer_id", "report_status", "submitted_at", "approved_by", "approved_at", "remarks", "created_at", "updated_at") VALUES
('605168ec-7f7e-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE', 'SRPT-2026-000001', 'Instrument restored to normal operating condition.', 'Temperature alarm displayed during startup.', 'Temperature sensor failure.', 'Temperature sensor replaced and system recalibrated.', NULL, 'Perform preventive maintenance every 6 months.', 'Equipment working satisfactorily.', 'Chief Medical Laboratory Technologist', 1, '2026-07-14 17:50:15', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'SUBMITTED', '2026-07-14 17:50:15', NULL, NULL, NULL, '2026-07-14 12:20:15', '2026-07-14 12:20:15');

-- Seeding record block 71
INSERT INTO "job_status_history" ("id", "job_id", "previous_status", "new_status", "changed_by", "changed_at", "reason", "remarks", "latitude", "longitude", "created_at") VALUES
('b50a6efa-7f7c-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'ASSIGNED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:38:19', 'Initial Assignment', 'Job assigned to engineer.', NULL, NULL, '2026-07-14 12:08:19'),
('b50b2569-7f7c-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'ASSIGNED', 'SCHEDULED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:38:19', 'Visit Scheduled', 'Customer visit scheduled.', NULL, NULL, '2026-07-14 12:08:19');

-- Seeding record block 72
INSERT INTO "job_visits" ("id", "job_id", "visit_no", "engineer_id", "visit_type", "visit_date", "check_in", "check_out", "travel_start", "travel_end", "travel_distance_km", "labour_hours", "latitude_in", "longitude_in", "latitude_out", "longitude_out", "customer_contact", "customer_signature", "work_performed", "findings", "recommendations", "next_action", "visit_status", "created_at", "updated_at") VALUES
('f917dc9b-7f7c-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'ONSITE', '2026-07-14', '2026-07-14 17:40:13', '2026-07-14 19:40:13', NULL, NULL, 32.50, 2.00, NULL, NULL, NULL, NULL, 'Chief Medical Laboratory Technologist', 1, 'Performed diagnostic inspection and corrective maintenance.', 'Temperature sensor calibration drift detected.', 'Replace temperature sensor and perform full calibration.', NULL, 'COMPLETED', '2026-07-14 12:10:13', '2026-07-14 12:10:13');

-- Seeding record block 73
INSERT INTO "kpi_evaluations" ("id", "evaluation_no", "employee_id", "financial_year_id", "evaluation_period", "period_year", "period_month", "evaluation_start", "evaluation_end", "total_weight", "weighted_score", "performance_percentage", "performance_grade", "performance_rating", "strengths", "improvements", "employee_comments", "evaluator_comments", "evaluation_status", "evaluated_by", "approved_by", "evaluated_at", "approved_at", "created_at", "updated_at") VALUES
('1f18208c-8035-11f1-aa6c-3cecef704050', 'EVAL-000001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'a38dff65-8030-11f1-aa6c-3cecef704050', 'MONTHLY', 2026, 7, '2026-07-01', '2026-07-31', 100.00, 92.50, 92.50, 'A', 'EXCEEDS_EXPECTATION', NULL, NULL, NULL, NULL, 'APPROVED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 15:38:23', NULL, '2026-07-15 10:08:23', '2026-07-15 10:08:23');

-- Seeding record block 74
INSERT INTO "kpi_master" ("id", "kpi_code", "kpi_name", "kpi_category", "description", "measurement_type", "scoring_method", "target_value", "minimum_value", "maximum_value", "base_score", "maximum_score", "minimum_score", "deduction_per_error", "deduction_per_incident", "comparison_operator", "evaluation_frequency", "calculation_method", "allow_manual_override", "display_order", "active", "remarks", "created_by", "created_at", "updated_at") VALUES
('968afdf5-8033-11f1-aa6c-3cecef704050', 'SERVICE_MEETING_ATTENDANCE', 'Meeting Attendance', 'SERVICE', 'Participation of Service & HOD meetings', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b5c60-8033-11f1-aa6c-3cecef704050', 'SERVICE_INSTALLATION', 'Installation Completion within 15 Days', 'SERVICE', 'Complete installation within 15 days', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 2, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b5d4e-8033-11f1-aa6c-3cecef704050', 'SERVICE_WARRANTY', 'Warranty Service Completion', 'SERVICE', 'Warranty jobs completed within assigned time', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 3, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b5e65-8033-11f1-aa6c-3cecef704050', 'SERVICE_DEPARTMENT_TARGET', 'Department Revenue Target', 'FINANCIAL', 'Department target achievement', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 4, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b5ee2-8033-11f1-aa6c-3cecef704050', 'SERVICE_NON_WARRANTY_TARGET', 'Non Warranty Target', 'FINANCIAL', 'Area target achievement', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 5, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b5f62-8033-11f1-aa6c-3cecef704050', 'PETTY_CASH_ACCURACY', 'Petty Cash Accuracy', 'ADMINISTRATION', 'Deduct 20 marks per error', 'COUNT', 'DEDUCTION_PER_ERROR', 0.0000, NULL, NULL, 100.00, 100.00, 0.00, 20.00, 0.00, '<=', 'YEARLY', 'HYBRID', 1, 6, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b5fe4-8033-11f1-aa6c-3cecef704050', 'CUSTOMER_SATISFACTION', 'Customer Satisfaction', 'CUSTOMER', 'Customer Satisfaction >85%', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 85.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 7, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b6052-8033-11f1-aa6c-3cecef704050', 'WORKSHOP_COMPLETION', 'Workshop Job Completion', 'WORKSHOP', 'Workshop completion >95%', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 95.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 8, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b60c7-8033-11f1-aa6c-3cecef704050', 'ONSITE_VISIT_COMPLETION', 'Onsite Visit Completion', 'SERVICE', '100% onsite visit completion', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 9, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b6132-8033-11f1-aa6c-3cecef704050', 'SAFETY_COMPLIANCE', 'Safety Compliance', 'SAFETY', 'Zero safety violations', 'COUNT', 'LOWER_IS_BETTER', 0.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '<=', 'YEARLY', 'HYBRID', 1, 10, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b6198-8033-11f1-aa6c-3cecef704050', 'TOOLS_MANAGEMENT', 'Tool Management', 'INVENTORY', 'Tool inventory management', 'COUNT', 'DEDUCTION_PER_INCIDENT', 0.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 5.00, '<=', 'YEARLY', 'HYBRID', 1, 11, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b6202-8033-11f1-aa6c-3cecef704050', 'CALIBRATION_COMPLETION', 'Calibration Completion', 'CALIBRATION', '100% calibration completion', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 12, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b62ae-8033-11f1-aa6c-3cecef704050', 'RND_SUPPORT', 'R&D and Marketing Support', 'MARKETING', 'Attend all assigned activities', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 13, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b63de-8033-11f1-aa6c-3cecef704050', 'QUOTATION_ACCURACY', 'Quotation Accuracy', 'ADMINISTRATION', 'Deduct 10 marks per quotation error', 'COUNT', 'DEDUCTION_PER_ERROR', 0.0000, NULL, NULL, 100.00, 100.00, 0.00, 10.00, 0.00, '<=', 'YEARLY', 'HYBRID', 1, 14, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b6557-8033-11f1-aa6c-3cecef704050', 'DOCUMENTATION_ACCURACY', 'Documentation Accuracy', 'ADMINISTRATION', 'Deduct 10 marks per documentation error', 'COUNT', 'DEDUCTION_PER_ERROR', 0.0000, NULL, NULL, 100.00, 100.00, 0.00, 10.00, 0.00, '<=', 'YEARLY', 'HYBRID', 1, 15, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b65bf-8033-11f1-aa6c-3cecef704050', 'DELIVERY_ACCURACY', 'Delivery Accuracy', 'ADMINISTRATION', 'Deduct 10 marks per delivery error', 'COUNT', 'DEDUCTION_PER_ERROR', 0.0000, NULL, NULL, 100.00, 100.00, 0.00, 10.00, 0.00, '<=', 'YEARLY', 'HYBRID', 1, 16, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b662a-8033-11f1-aa6c-3cecef704050', 'INSTALLATION_UPDATE_ACCURACY', 'Installation Update Accuracy', 'ADMINISTRATION', 'Deduct 10 marks per update error', 'COUNT', 'DEDUCTION_PER_ERROR', 0.0000, NULL, NULL, 100.00, 100.00, 0.00, 10.00, 0.00, '<=', 'YEARLY', 'HYBRID', 1, 17, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b6694-8033-11f1-aa6c-3cecef704050', 'MEETING_ACTIONS', 'Meeting Action Completion', 'ADMINISTRATION', 'Meeting actions completed on time', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 18, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b66fc-8033-11f1-aa6c-3cecef704050', 'WORKSHOP_INSPECTION_REPORT', 'Inspection Report within 7 Days', 'WORKSHOP', 'Inspection report issued within 7 working days', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 19, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b6766-8033-11f1-aa6c-3cecef704050', 'WORKSHOP_REPAIR_COMPLETION', 'Workshop Repair Completion', 'WORKSHOP', 'Repair completion within 7 working days', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 20, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b67d1-8033-11f1-aa6c-3cecef704050', 'FINAL_INSPECTION_ACCURACY', 'Final Inspection Accuracy', 'QUALITY', 'Deduct according to customer complaint', 'COUNT', 'DEDUCTION_PER_ERROR', 0.0000, NULL, NULL, 100.00, 100.00, 0.00, 10.00, 0.00, '<=', 'YEARLY', 'HYBRID', 1, 21, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b683c-8033-11f1-aa6c-3cecef704050', 'INVENTORY_ACCURACY', 'Inventory Accuracy', 'INVENTORY', 'Deduct 25 marks per incident', 'COUNT', 'DEDUCTION_PER_INCIDENT', 0.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 25.00, '<=', 'YEARLY', 'HYBRID', 1, 22, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b68a5-8033-11f1-aa6c-3cecef704050', 'SERVICE_AGREEMENT_TARGET', 'Service Agreement Target', 'FINANCIAL', 'Service agreement achievement', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 23, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b69a7-8033-11f1-aa6c-3cecef704050', 'CALIBRATION_TARGET', 'Calibration Revenue Target', 'CALIBRATION', 'Calibration target achievement', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 24, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b6a15-8033-11f1-aa6c-3cecef704050', 'PREORDER_INSPECTION', 'Pre-order Inspection Accuracy', 'CALIBRATION', 'Deduct 10 marks per error', 'COUNT', 'DEDUCTION_PER_ERROR', 0.0000, NULL, NULL, 100.00, 100.00, 0.00, 10.00, 0.00, '<=', 'YEARLY', 'HYBRID', 1, 25, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b6a88-8033-11f1-aa6c-3cecef704050', 'ACCREDITATION_TIMELINE', 'Accreditation Timeline', 'CALIBRATION', 'Accreditation milestones', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 26, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b6b70-8033-11f1-aa6c-3cecef704050', 'STAFF_TRAINING', 'Staff Training', 'HR', 'Training provided to staff', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 27, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25'),
('968b6bdb-8033-11f1-aa6c-3cecef704050', 'ISO_COMPLIANCE', 'ISO Compliance', 'QUALITY', 'Maintain ISO compliance', 'PERCENTAGE', 'TARGET_ACHIEVEMENT', 100.0000, NULL, NULL, 100.00, 100.00, 0.00, 0.00, 0.00, '>=', 'YEARLY', 'HYBRID', 1, 28, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:57:25', '2026-07-15 09:57:25');

-- Seeding record block 75
INSERT INTO "kpi_measurements" ("id", "measurement_no", "assignment_id", "measurement_period", "measurement_year", "measurement_month", "measurement_date", "target_value", "actual_value", "achievement_percentage", "raw_score", "deduction_count", "deduction_marks", "final_score", "measurement_status", "measured_by", "approved_by", "approved_at", "remarks", "created_at", "updated_at") VALUES
('481c78d3-8034-11f1-aa6c-3cecef704050', 'KPIM-000001', 'b611a57d-8033-11f1-aa6c-3cecef704050', 'MONTHLY', 2026, 7, '2026-07-15', 100.0000, 100.0000, 100.00, 100.00, 0, 0.00, 100.00, 'APPROVED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, '2026-07-15 10:02:22', '2026-07-15 10:02:22');

-- Seeding record block 76
INSERT INTO "kpi_measurement_rules" ("id", "rule_code", "kpi_id", "rule_name", "calculation_type", "calculation_method", "source_module", "source_table", "numerator_field", "denominator_field", "value_field", "filter_condition", "formula_expression", "target_days", "deduction_per_error", "deduction_per_incident", "maximum_score", "minimum_score", "auto_calculate", "verification_required", "active", "remarks", "created_by", "created_at", "updated_at") VALUES
('c73e4492-8036-11f1-aa6c-3cecef704050', 'RULE001', '968b5c60-8033-11f1-aa6c-3cecef704050', 'Installation completed within 15 days', 'AUTOMATIC', 'PERCENTAGE', 'INSTALLATION', 'installations', 'completed_within_target', 'total_installations', NULL, NULL, NULL, 15, 0.00, 0.00, 100.00, 0.00, 1, 0, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:20:15', '2026-07-15 10:20:15'),
('c73ece72-8036-11f1-aa6c-3cecef704050', 'RULE002', '968b5fe4-8033-11f1-aa6c-3cecef704050', 'Customer Satisfaction Average', 'AUTOMATIC', 'AVERAGE', 'CUSTOMER_FEEDBACK', 'customer_feedback', NULL, NULL, 'rating', NULL, NULL, NULL, 0.00, 0.00, 100.00, 0.00, 1, 0, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:20:15', '2026-07-15 10:20:15'),
('c73f4373-8036-11f1-aa6c-3cecef704050', 'RULE003', '968b6557-8033-11f1-aa6c-3cecef704050', 'Documentation Accuracy', 'HYBRID', 'DEDUCTION', 'MANUAL', 'document_review_audit', NULL, NULL, 'error_count', NULL, NULL, NULL, 10.00, 0.00, 100.00, 0.00, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:20:15', '2026-07-15 10:20:15'),
('c73fbab1-8036-11f1-aa6c-3cecef704050', 'RULE004', '968b683c-8033-11f1-aa6c-3cecef704050', 'Inventory Accuracy', 'HYBRID', 'DEDUCTION', 'INVENTORY', 'inventory_transactions', NULL, NULL, 'incident_count', NULL, NULL, NULL, 0.00, 25.00, 100.00, 0.00, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:20:15', '2026-07-15 10:20:15');

-- Seeding record block 77
INSERT INTO "label_templates" ("id", "template_code", "template_name", "label_width_mm", "label_height_mm", "printer_dpi", "template_json", "active", "created_by", "created_at", "updated_at") VALUES
('1d07b85e-8023-11f1-aa6c-3cecef704050', 'AST_LABEL_A', 'Standard Instrument Asset Label', 50.00, 25.00, 300, '{"company": "AVON", "show_logo": true, "show_asset_no": true, "show_serial_no": true, "show_model": true, "show_qr": true, "show_barcode": true}', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:59:29', '2026-07-15 07:59:29');

-- Seeding record block 78
INSERT INTO "license_management" ("id", "license_no", "license_name", "license_type", "vendor_name", "product_name", "version", "license_key", "company_id", "assigned_user_id", "assigned_device", "seats_purchased", "seats_used", "purchase_date", "activation_date", "expiry_date", "maintenance_expiry", "purchase_cost", "renewal_cost", "currency", "status", "auto_renew", "reminder_days", "remarks", "created_by", "created_at", "updated_at") VALUES
('b87b4155-800b-11f1-aa6c-3cecef704050', 'LIC-2026-000001', 'Avon ServicePro Production License', 'APPLICATION', 'AVON PHARMO CHEM (PVT) LTD', 'Avon ServicePro', '1.0.0', NULL, 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Production Server', 10, 1, '2026-07-15', '2026-07-15', '2027-07-15', '2027-07-15', 0.00, 0.00, 'LKR', 'ACTIVE', 1, 30, 'Primary production license.', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:12:02', '2026-07-15 05:12:02'),
('b87c1044-800b-11f1-aa6c-3cecef704050', 'LIC-2026-000002', 'Microsoft Office 365', 'OFFICE', 'Microsoft', 'Microsoft 365 Business', '2026', NULL, 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', NULL, NULL, 1, 0, '2026-07-15', NULL, '2027-07-15', NULL, 180000.00, NULL, 'LKR', 'ACTIVE', 0, 30, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:12:02', '2026-07-15 05:12:02'),
('b87c947d-800b-11f1-aa6c-3cecef704050', 'LIC-2026-000003', 'Windows Server License', 'OPERATING_SYSTEM', 'Microsoft', 'Windows Server 2025', '2025', NULL, 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', NULL, NULL, 1, 0, '2026-07-15', NULL, '2029-07-15', NULL, 450000.00, NULL, 'LKR', 'ACTIVE', 0, 30, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:12:02', '2026-07-15 05:12:02');

-- Seeding record block 79
INSERT INTO "login_history" ("id", "user_id", "login_time", "logout_time", "ip_address", "user_agent", "login_status", "session_token", "remarks", "created_at") VALUES
('afc8d111-7f72-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 16:26:35', NULL, NULL, NULL, 'SUCCESS', NULL, 'Initial administrator login', '2026-07-14 10:56:35');

-- Seeding record block 80
INSERT INTO "manufacturers" ("id", "manufacturer_code", "manufacturer_name", "country_id", "website", "email", "phone", "support_email", "support_phone", "remarks", "active", "created_at", "updated_at") VALUES
('04a5db33-7f77-11f1-aa6c-3cecef704050', 'ABBOTT', 'Abbott Laboratories', NULL, 'https://www.abbott.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-07-14 11:27:35', '2026-07-14 11:28:23'),
('04a69327-7f77-11f1-aa6c-3cecef704050', 'BIORAD', 'Bio-Rad Laboratories', NULL, 'https://www.bio-rad.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-07-14 11:27:35', '2026-07-14 11:27:35'),
('04a694a8-7f77-11f1-aa6c-3cecef704050', 'THERMO', 'Thermo Fisher Scientific', NULL, 'https://www.thermofisher.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-07-14 11:27:35', '2026-07-14 11:27:35'),
('04a694e3-7f77-11f1-aa6c-3cecef704050', 'BECKMAN', 'Beckman Coulter', NULL, 'https://www.beckmancoulter.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-07-14 11:27:35', '2026-07-14 11:27:35'),
('04a6950e-7f77-11f1-aa6c-3cecef704050', 'SIEMENS', 'Siemens Healthineers', NULL, 'https://www.siemens-healthineers.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-07-14 11:27:35', '2026-07-14 11:27:35'),
('04a69539-7f77-11f1-aa6c-3cecef704050', 'ROCHE', 'Roche Diagnostics', NULL, 'https://diagnostics.roche.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-07-14 11:27:35', '2026-07-14 11:27:35'),
('04a6955f-7f77-11f1-aa6c-3cecef704050', 'MINDRAY', 'Mindray', NULL, 'https://www.mindray.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-07-14 11:27:35', '2026-07-14 11:27:35'),
('04a69584-7f77-11f1-aa6c-3cecef704050', 'BIOTEK', 'BioTek Instruments', NULL, 'https://www.agilent.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-07-14 11:27:35', '2026-07-14 11:27:35'),
('04a695ad-7f77-11f1-aa6c-3cecef704050', 'EPPENDORF', 'Eppendorf', NULL, 'https://www.eppendorf.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-07-14 11:27:35', '2026-07-14 11:27:35'),
('04a695d0-7f77-11f1-aa6c-3cecef704050', 'ANALYTIKJENA', 'Analytik Jena', NULL, 'https://www.analytik-jena.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-07-14 11:27:35', '2026-07-14 11:27:35'),
('04a695f0-7f77-11f1-aa6c-3cecef704050', 'OPTIKA', 'Optika', NULL, 'https://www.optikamicroscopes.com', NULL, NULL, NULL, NULL, NULL, 1, '2026-07-14 11:27:35', '2026-07-14 11:27:35');

-- Seeding record block 81
INSERT INTO "modules" ("id", "module_code", "module_name", "description", "display_order", "active", "created_at", "updated_at") VALUES
('46410b7c-7f60-11f1-aa6c-3cecef704050', 'DASHBOARD', 'Dashboard', NULL, 1, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410d29-7f60-11f1-aa6c-3cecef704050', 'USERS', 'User Management', NULL, 2, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410d8e-7f60-11f1-aa6c-3cecef704050', 'CUSTOMERS', 'Customer Management', NULL, 3, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410dcb-7f60-11f1-aa6c-3cecef704050', 'TERRITORIES', 'Territory Management', NULL, 4, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410e15-7f60-11f1-aa6c-3cecef704050', 'INSTRUMENTS', 'Instrument Registry', NULL, 5, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410e3a-7f60-11f1-aa6c-3cecef704050', 'INSTALLATIONS', 'Installation Management', NULL, 6, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410e53-7f60-11f1-aa6c-3cecef704050', 'SERVICE', 'Service Management', NULL, 7, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410e81-7f60-11f1-aa6c-3cecef704050', 'WORKSHOP', 'Workshop Management', NULL, 8, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410ec0-7f60-11f1-aa6c-3cecef704050', 'CALIBRATION', 'Calibration Management', NULL, 9, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410edb-7f60-11f1-aa6c-3cecef704050', 'WARRANTY', 'Warranty Management', NULL, 10, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410ef4-7f60-11f1-aa6c-3cecef704050', 'PM', 'Preventive Maintenance', NULL, 11, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410f10-7f60-11f1-aa6c-3cecef704050', 'PARTS', 'Parts Management', NULL, 12, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410f29-7f60-11f1-aa6c-3cecef704050', 'REPORTS', 'Reports', NULL, 13, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47'),
('46410f43-7f60-11f1-aa6c-3cecef704050', 'SETTINGS', 'System Settings', NULL, 14, 1, '2026-07-14 08:44:47', '2026-07-14 08:44:47');

-- Seeding record block 82
INSERT INTO "notifications" ("id", "notification_no", "recipient_user_id", "customer_id", "service_job_id", "notification_type", "channel", "priority", "subject", "message", "scheduled_at", "sent_at", "read_at", "delivery_status", "retry_count", "error_message", "created_at", "updated_at") VALUES
('3dd1d150-8004-11f1-aa6c-3cecef704050', 'NOT-2026-000001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'JOB_ASSIGNED', 'IN_APP', 'HIGH', 'New Service Job Assigned', 'Service Job JOB-2026-000001 has been assigned to you.', '2026-07-15 09:48:29', NULL, NULL, 'SENT', 0, NULL, '2026-07-15 04:18:29', '2026-07-15 04:18:29'),
('3dd2b2ce-8004-11f1-aa6c-3cecef704050', 'NOT-2026-000002', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'PM_DUE', 'EMAIL', 'NORMAL', 'Preventive Maintenance Reminder', 'Preventive Maintenance is due within the next 7 days.', '2026-07-15 09:48:29', NULL, NULL, 'PENDING', 0, NULL, '2026-07-15 04:18:29', '2026-07-15 04:18:29'),
('3dd30e8b-8004-11f1-aa6c-3cecef704050', 'NOT-2026-000003', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'STOCK_ALERT', 'IN_APP', 'URGENT', 'Low Stock Alert', 'Temperature Sensor stock has reached the reorder level.', '2026-07-15 09:48:29', NULL, NULL, 'PENDING', 0, NULL, '2026-07-15 04:18:29', '2026-07-15 04:18:29');

-- Seeding record block 83
INSERT INTO "notification_templates" ("id", "template_code", "template_name", "notification_type", "channel", "subject", "message_template", "variables", "active", "created_by", "created_at", "updated_at") VALUES
('b5599b8b-8004-11f1-aa6c-3cecef704050', 'TMP_JOB_ASSIGNED', 'Job Assignment', 'JOB_ASSIGNED', 'EMAIL', 'New Service Job Assigned', 'Dear {{ENGINEER_NAME}}, Service Job {{JOB_NO}} has been assigned for {{CUSTOMER_NAME}}.', 'ENGINEER_NAME,JOB_NO,CUSTOMER_NAME', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:21:50', '2026-07-15 04:21:50'),
('b55a7b76-8004-11f1-aa6c-3cecef704050', 'TMP_PM_DUE', 'PM Reminder', 'PM_DUE', 'EMAIL', 'Preventive Maintenance Due', 'Instrument {{ASSET_NO}} is due for Preventive Maintenance on {{DUE_DATE}}.', 'ASSET_NO,DUE_DATE', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:21:50', '2026-07-15 04:21:50'),
('b55afea0-8004-11f1-aa6c-3cecef704050', 'TMP_WARRANTY', 'Warranty Expiry', 'WARRANTY_EXPIRING', 'EMAIL', 'Warranty Expiry Notice', 'Warranty for {{ASSET_NO}} will expire on {{EXPIRY_DATE}}.', 'ASSET_NO,EXPIRY_DATE', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:21:50', '2026-07-15 04:21:50'),
('b55b8a1d-8004-11f1-aa6c-3cecef704050', 'TMP_STOCK_ALERT', 'Stock Alert', 'STOCK_ALERT', 'IN_APP', 'Low Stock Alert', '{{PART_NAME}} has reached the reorder level. Current Stock: {{CURRENT_STOCK}}', 'PART_NAME,CURRENT_STOCK', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:21:50', '2026-07-15 04:21:50');

-- Seeding record block 84
INSERT INTO "organizational_units" ("id", "unit_code", "company_id", "branch_id", "parent_unit_id", "unit_name", "short_name", "unit_type", "manager_user_id", "email", "telephone", "location", "display_order", "active", "remarks", "created_by", "created_at", "updated_at") VALUES
('79495228-802c-11f1-aa6c-3cecef704050', 'SRV', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Service Department', 'Service', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29'),
('7949c816-802c-11f1-aa6c-3cecef704050', 'WRK', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Workshop Department', 'Workshop', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 2, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29'),
('794a3467-802c-11f1-aa6c-3cecef704050', 'CAL', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Calibration Department', 'Calibration', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 3, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29'),
('794a9be1-802c-11f1-aa6c-3cecef704050', 'ADM', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Administration', 'Admin', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 4, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29'),
('794afcc1-802c-11f1-aa6c-3cecef704050', 'RND', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Research & Development', 'R&D', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 5, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29'),
('794b64fa-802c-11f1-aa6c-3cecef704050', 'MKT', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Marketing Support', 'Marketing', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 6, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29');

-- Seeding record block 85
INSERT INTO "permissions" ("id", "module_id", "permission_code", "permission_name", "action_name", "description", "active", "created_at", "updated_at") VALUES
('a8ade0ca-7f60-11f1-aa6c-3cecef704050', '46410b7c-7f60-11f1-aa6c-3cecef704050', 'DASHBOARD_VIEW', 'Dashboard - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade2a9-7f60-11f1-aa6c-3cecef704050', '46410d29-7f60-11f1-aa6c-3cecef704050', 'USERS_VIEW', 'User Management - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade327-7f60-11f1-aa6c-3cecef704050', '46410d8e-7f60-11f1-aa6c-3cecef704050', 'CUSTOMERS_VIEW', 'Customer Management - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade368-7f60-11f1-aa6c-3cecef704050', '46410dcb-7f60-11f1-aa6c-3cecef704050', 'TERRITORIES_VIEW', 'Territory Management - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade3a4-7f60-11f1-aa6c-3cecef704050', '46410e15-7f60-11f1-aa6c-3cecef704050', 'INSTRUMENTS_VIEW', 'Instrument Registry - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade3dd-7f60-11f1-aa6c-3cecef704050', '46410e3a-7f60-11f1-aa6c-3cecef704050', 'INSTALLATIONS_VIEW', 'Installation Management - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade415-7f60-11f1-aa6c-3cecef704050', '46410e53-7f60-11f1-aa6c-3cecef704050', 'SERVICE_VIEW', 'Service Management - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade44b-7f60-11f1-aa6c-3cecef704050', '46410e81-7f60-11f1-aa6c-3cecef704050', 'WORKSHOP_VIEW', 'Workshop Management - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade484-7f60-11f1-aa6c-3cecef704050', '46410ec0-7f60-11f1-aa6c-3cecef704050', 'CALIBRATION_VIEW', 'Calibration Management - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade4b6-7f60-11f1-aa6c-3cecef704050', '46410edb-7f60-11f1-aa6c-3cecef704050', 'WARRANTY_VIEW', 'Warranty Management - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade514-7f60-11f1-aa6c-3cecef704050', '46410ef4-7f60-11f1-aa6c-3cecef704050', 'PM_VIEW', 'Preventive Maintenance - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade551-7f60-11f1-aa6c-3cecef704050', '46410f10-7f60-11f1-aa6c-3cecef704050', 'PARTS_VIEW', 'Parts Management - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade588-7f60-11f1-aa6c-3cecef704050', '46410f29-7f60-11f1-aa6c-3cecef704050', 'REPORTS_VIEW', 'Reports - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ade5be-7f60-11f1-aa6c-3cecef704050', '46410f43-7f60-11f1-aa6c-3cecef704050', 'SETTINGS_VIEW', 'System Settings - View', 'VIEW', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8943-7f60-11f1-aa6c-3cecef704050', '46410b7c-7f60-11f1-aa6c-3cecef704050', 'DASHBOARD_CREATE', 'Dashboard - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8ad2-7f60-11f1-aa6c-3cecef704050', '46410d29-7f60-11f1-aa6c-3cecef704050', 'USERS_CREATE', 'User Management - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8b31-7f60-11f1-aa6c-3cecef704050', '46410d8e-7f60-11f1-aa6c-3cecef704050', 'CUSTOMERS_CREATE', 'Customer Management - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8b95-7f60-11f1-aa6c-3cecef704050', '46410dcb-7f60-11f1-aa6c-3cecef704050', 'TERRITORIES_CREATE', 'Territory Management - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8bd6-7f60-11f1-aa6c-3cecef704050', '46410e15-7f60-11f1-aa6c-3cecef704050', 'INSTRUMENTS_CREATE', 'Instrument Registry - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8c13-7f60-11f1-aa6c-3cecef704050', '46410e3a-7f60-11f1-aa6c-3cecef704050', 'INSTALLATIONS_CREATE', 'Installation Management - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8c55-7f60-11f1-aa6c-3cecef704050', '46410e53-7f60-11f1-aa6c-3cecef704050', 'SERVICE_CREATE', 'Service Management - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8c97-7f60-11f1-aa6c-3cecef704050', '46410e81-7f60-11f1-aa6c-3cecef704050', 'WORKSHOP_CREATE', 'Workshop Management - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8cd5-7f60-11f1-aa6c-3cecef704050', '46410ec0-7f60-11f1-aa6c-3cecef704050', 'CALIBRATION_CREATE', 'Calibration Management - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8d0f-7f60-11f1-aa6c-3cecef704050', '46410edb-7f60-11f1-aa6c-3cecef704050', 'WARRANTY_CREATE', 'Warranty Management - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8d49-7f60-11f1-aa6c-3cecef704050', '46410ef4-7f60-11f1-aa6c-3cecef704050', 'PM_CREATE', 'Preventive Maintenance - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8d88-7f60-11f1-aa6c-3cecef704050', '46410f10-7f60-11f1-aa6c-3cecef704050', 'PARTS_CREATE', 'Parts Management - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8dc4-7f60-11f1-aa6c-3cecef704050', '46410f29-7f60-11f1-aa6c-3cecef704050', 'REPORTS_CREATE', 'Reports - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8ae8e05-7f60-11f1-aa6c-3cecef704050', '46410f43-7f60-11f1-aa6c-3cecef704050', 'SETTINGS_CREATE', 'System Settings - Create', 'CREATE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aee7fb-7f60-11f1-aa6c-3cecef704050', '46410b7c-7f60-11f1-aa6c-3cecef704050', 'DASHBOARD_EDIT', 'Dashboard - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aee965-7f60-11f1-aa6c-3cecef704050', '46410d29-7f60-11f1-aa6c-3cecef704050', 'USERS_EDIT', 'User Management - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aee9c0-7f60-11f1-aa6c-3cecef704050', '46410d8e-7f60-11f1-aa6c-3cecef704050', 'CUSTOMERS_EDIT', 'Customer Management - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aeea07-7f60-11f1-aa6c-3cecef704050', '46410dcb-7f60-11f1-aa6c-3cecef704050', 'TERRITORIES_EDIT', 'Territory Management - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aeea4e-7f60-11f1-aa6c-3cecef704050', '46410e15-7f60-11f1-aa6c-3cecef704050', 'INSTRUMENTS_EDIT', 'Instrument Registry - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aeea93-7f60-11f1-aa6c-3cecef704050', '46410e3a-7f60-11f1-aa6c-3cecef704050', 'INSTALLATIONS_EDIT', 'Installation Management - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aeead5-7f60-11f1-aa6c-3cecef704050', '46410e53-7f60-11f1-aa6c-3cecef704050', 'SERVICE_EDIT', 'Service Management - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aeeb19-7f60-11f1-aa6c-3cecef704050', '46410e81-7f60-11f1-aa6c-3cecef704050', 'WORKSHOP_EDIT', 'Workshop Management - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aeeb5d-7f60-11f1-aa6c-3cecef704050', '46410ec0-7f60-11f1-aa6c-3cecef704050', 'CALIBRATION_EDIT', 'Calibration Management - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aeeb9b-7f60-11f1-aa6c-3cecef704050', '46410edb-7f60-11f1-aa6c-3cecef704050', 'WARRANTY_EDIT', 'Warranty Management - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aeebdf-7f60-11f1-aa6c-3cecef704050', '46410ef4-7f60-11f1-aa6c-3cecef704050', 'PM_EDIT', 'Preventive Maintenance - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aeec21-7f60-11f1-aa6c-3cecef704050', '46410f10-7f60-11f1-aa6c-3cecef704050', 'PARTS_EDIT', 'Parts Management - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aeec65-7f60-11f1-aa6c-3cecef704050', '46410f29-7f60-11f1-aa6c-3cecef704050', 'REPORTS_EDIT', 'Reports - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8aeeca8-7f60-11f1-aa6c-3cecef704050', '46410f43-7f60-11f1-aa6c-3cecef704050', 'SETTINGS_EDIT', 'System Settings - Edit', 'EDIT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af4529-7f60-11f1-aa6c-3cecef704050', '46410b7c-7f60-11f1-aa6c-3cecef704050', 'DASHBOARD_DELETE', 'Dashboard - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af473f-7f60-11f1-aa6c-3cecef704050', '46410d29-7f60-11f1-aa6c-3cecef704050', 'USERS_DELETE', 'User Management - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af4805-7f60-11f1-aa6c-3cecef704050', '46410d8e-7f60-11f1-aa6c-3cecef704050', 'CUSTOMERS_DELETE', 'Customer Management - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af48c4-7f60-11f1-aa6c-3cecef704050', '46410dcb-7f60-11f1-aa6c-3cecef704050', 'TERRITORIES_DELETE', 'Territory Management - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af497e-7f60-11f1-aa6c-3cecef704050', '46410e15-7f60-11f1-aa6c-3cecef704050', 'INSTRUMENTS_DELETE', 'Instrument Registry - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af4a23-7f60-11f1-aa6c-3cecef704050', '46410e3a-7f60-11f1-aa6c-3cecef704050', 'INSTALLATIONS_DELETE', 'Installation Management - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af4ac4-7f60-11f1-aa6c-3cecef704050', '46410e53-7f60-11f1-aa6c-3cecef704050', 'SERVICE_DELETE', 'Service Management - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af4b78-7f60-11f1-aa6c-3cecef704050', '46410e81-7f60-11f1-aa6c-3cecef704050', 'WORKSHOP_DELETE', 'Workshop Management - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af4c23-7f60-11f1-aa6c-3cecef704050', '46410ec0-7f60-11f1-aa6c-3cecef704050', 'CALIBRATION_DELETE', 'Calibration Management - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af4cd7-7f60-11f1-aa6c-3cecef704050', '46410edb-7f60-11f1-aa6c-3cecef704050', 'WARRANTY_DELETE', 'Warranty Management - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af4d83-7f60-11f1-aa6c-3cecef704050', '46410ef4-7f60-11f1-aa6c-3cecef704050', 'PM_DELETE', 'Preventive Maintenance - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af4e34-7f60-11f1-aa6c-3cecef704050', '46410f10-7f60-11f1-aa6c-3cecef704050', 'PARTS_DELETE', 'Parts Management - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af4ee1-7f60-11f1-aa6c-3cecef704050', '46410f29-7f60-11f1-aa6c-3cecef704050', 'REPORTS_DELETE', 'Reports - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8af4f89-7f60-11f1-aa6c-3cecef704050', '46410f43-7f60-11f1-aa6c-3cecef704050', 'SETTINGS_DELETE', 'System Settings - Delete', 'DELETE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afb738-7f60-11f1-aa6c-3cecef704050', '46410b7c-7f60-11f1-aa6c-3cecef704050', 'DASHBOARD_APPROVE', 'Dashboard - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afb8a8-7f60-11f1-aa6c-3cecef704050', '46410d29-7f60-11f1-aa6c-3cecef704050', 'USERS_APPROVE', 'User Management - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afb90f-7f60-11f1-aa6c-3cecef704050', '46410d8e-7f60-11f1-aa6c-3cecef704050', 'CUSTOMERS_APPROVE', 'Customer Management - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afb95e-7f60-11f1-aa6c-3cecef704050', '46410dcb-7f60-11f1-aa6c-3cecef704050', 'TERRITORIES_APPROVE', 'Territory Management - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afb9ab-7f60-11f1-aa6c-3cecef704050', '46410e15-7f60-11f1-aa6c-3cecef704050', 'INSTRUMENTS_APPROVE', 'Instrument Registry - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afb9f1-7f60-11f1-aa6c-3cecef704050', '46410e3a-7f60-11f1-aa6c-3cecef704050', 'INSTALLATIONS_APPROVE', 'Installation Management - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afba37-7f60-11f1-aa6c-3cecef704050', '46410e53-7f60-11f1-aa6c-3cecef704050', 'SERVICE_APPROVE', 'Service Management - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afba87-7f60-11f1-aa6c-3cecef704050', '46410e81-7f60-11f1-aa6c-3cecef704050', 'WORKSHOP_APPROVE', 'Workshop Management - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afbad0-7f60-11f1-aa6c-3cecef704050', '46410ec0-7f60-11f1-aa6c-3cecef704050', 'CALIBRATION_APPROVE', 'Calibration Management - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afbb15-7f60-11f1-aa6c-3cecef704050', '46410edb-7f60-11f1-aa6c-3cecef704050', 'WARRANTY_APPROVE', 'Warranty Management - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afbb5c-7f60-11f1-aa6c-3cecef704050', '46410ef4-7f60-11f1-aa6c-3cecef704050', 'PM_APPROVE', 'Preventive Maintenance - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afbbaa-7f60-11f1-aa6c-3cecef704050', '46410f10-7f60-11f1-aa6c-3cecef704050', 'PARTS_APPROVE', 'Parts Management - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afbbf2-7f60-11f1-aa6c-3cecef704050', '46410f29-7f60-11f1-aa6c-3cecef704050', 'REPORTS_APPROVE', 'Reports - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8afbc38-7f60-11f1-aa6c-3cecef704050', '46410f43-7f60-11f1-aa6c-3cecef704050', 'SETTINGS_APPROVE', 'System Settings - Approve', 'APPROVE', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b01dbb-7f60-11f1-aa6c-3cecef704050', '46410b7c-7f60-11f1-aa6c-3cecef704050', 'DASHBOARD_EXPORT', 'Dashboard - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b01ef4-7f60-11f1-aa6c-3cecef704050', '46410d29-7f60-11f1-aa6c-3cecef704050', 'USERS_EXPORT', 'User Management - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b01f51-7f60-11f1-aa6c-3cecef704050', '46410d8e-7f60-11f1-aa6c-3cecef704050', 'CUSTOMERS_EXPORT', 'Customer Management - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b01fa4-7f60-11f1-aa6c-3cecef704050', '46410dcb-7f60-11f1-aa6c-3cecef704050', 'TERRITORIES_EXPORT', 'Territory Management - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b01ff3-7f60-11f1-aa6c-3cecef704050', '46410e15-7f60-11f1-aa6c-3cecef704050', 'INSTRUMENTS_EXPORT', 'Instrument Registry - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0203e-7f60-11f1-aa6c-3cecef704050', '46410e3a-7f60-11f1-aa6c-3cecef704050', 'INSTALLATIONS_EXPORT', 'Installation Management - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0208b-7f60-11f1-aa6c-3cecef704050', '46410e53-7f60-11f1-aa6c-3cecef704050', 'SERVICE_EXPORT', 'Service Management - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b020d9-7f60-11f1-aa6c-3cecef704050', '46410e81-7f60-11f1-aa6c-3cecef704050', 'WORKSHOP_EXPORT', 'Workshop Management - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0211c-7f60-11f1-aa6c-3cecef704050', '46410ec0-7f60-11f1-aa6c-3cecef704050', 'CALIBRATION_EXPORT', 'Calibration Management - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b02165-7f60-11f1-aa6c-3cecef704050', '46410edb-7f60-11f1-aa6c-3cecef704050', 'WARRANTY_EXPORT', 'Warranty Management - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b021a2-7f60-11f1-aa6c-3cecef704050', '46410ef4-7f60-11f1-aa6c-3cecef704050', 'PM_EXPORT', 'Preventive Maintenance - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b021ee-7f60-11f1-aa6c-3cecef704050', '46410f10-7f60-11f1-aa6c-3cecef704050', 'PARTS_EXPORT', 'Parts Management - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0223a-7f60-11f1-aa6c-3cecef704050', '46410f29-7f60-11f1-aa6c-3cecef704050', 'REPORTS_EXPORT', 'Reports - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b02282-7f60-11f1-aa6c-3cecef704050', '46410f43-7f60-11f1-aa6c-3cecef704050', 'SETTINGS_EXPORT', 'System Settings - Export', 'EXPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0849e-7f60-11f1-aa6c-3cecef704050', '46410b7c-7f60-11f1-aa6c-3cecef704050', 'DASHBOARD_IMPORT', 'Dashboard - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b085ff-7f60-11f1-aa6c-3cecef704050', '46410d29-7f60-11f1-aa6c-3cecef704050', 'USERS_IMPORT', 'User Management - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b08666-7f60-11f1-aa6c-3cecef704050', '46410d8e-7f60-11f1-aa6c-3cecef704050', 'CUSTOMERS_IMPORT', 'Customer Management - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b086bb-7f60-11f1-aa6c-3cecef704050', '46410dcb-7f60-11f1-aa6c-3cecef704050', 'TERRITORIES_IMPORT', 'Territory Management - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0870f-7f60-11f1-aa6c-3cecef704050', '46410e15-7f60-11f1-aa6c-3cecef704050', 'INSTRUMENTS_IMPORT', 'Instrument Registry - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0875c-7f60-11f1-aa6c-3cecef704050', '46410e3a-7f60-11f1-aa6c-3cecef704050', 'INSTALLATIONS_IMPORT', 'Installation Management - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b087a7-7f60-11f1-aa6c-3cecef704050', '46410e53-7f60-11f1-aa6c-3cecef704050', 'SERVICE_IMPORT', 'Service Management - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b087f8-7f60-11f1-aa6c-3cecef704050', '46410e81-7f60-11f1-aa6c-3cecef704050', 'WORKSHOP_IMPORT', 'Workshop Management - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0883e-7f60-11f1-aa6c-3cecef704050', '46410ec0-7f60-11f1-aa6c-3cecef704050', 'CALIBRATION_IMPORT', 'Calibration Management - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b08887-7f60-11f1-aa6c-3cecef704050', '46410edb-7f60-11f1-aa6c-3cecef704050', 'WARRANTY_IMPORT', 'Warranty Management - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b088c7-7f60-11f1-aa6c-3cecef704050', '46410ef4-7f60-11f1-aa6c-3cecef704050', 'PM_IMPORT', 'Preventive Maintenance - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b08911-7f60-11f1-aa6c-3cecef704050', '46410f10-7f60-11f1-aa6c-3cecef704050', 'PARTS_IMPORT', 'Parts Management - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b08960-7f60-11f1-aa6c-3cecef704050', '46410f29-7f60-11f1-aa6c-3cecef704050', 'REPORTS_IMPORT', 'Reports - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b089b3-7f60-11f1-aa6c-3cecef704050', '46410f43-7f60-11f1-aa6c-3cecef704050', 'SETTINGS_IMPORT', 'System Settings - Import', 'IMPORT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0e3ba-7f60-11f1-aa6c-3cecef704050', '46410b7c-7f60-11f1-aa6c-3cecef704050', 'DASHBOARD_PRINT', 'Dashboard - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0e568-7f60-11f1-aa6c-3cecef704050', '46410d29-7f60-11f1-aa6c-3cecef704050', 'USERS_PRINT', 'User Management - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0e5cf-7f60-11f1-aa6c-3cecef704050', '46410d8e-7f60-11f1-aa6c-3cecef704050', 'CUSTOMERS_PRINT', 'Customer Management - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0e623-7f60-11f1-aa6c-3cecef704050', '46410dcb-7f60-11f1-aa6c-3cecef704050', 'TERRITORIES_PRINT', 'Territory Management - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0e67a-7f60-11f1-aa6c-3cecef704050', '46410e15-7f60-11f1-aa6c-3cecef704050', 'INSTRUMENTS_PRINT', 'Instrument Registry - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0e6cd-7f60-11f1-aa6c-3cecef704050', '46410e3a-7f60-11f1-aa6c-3cecef704050', 'INSTALLATIONS_PRINT', 'Installation Management - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b0e720-7f60-11f1-aa6c-3cecef704050', '46410e53-7f60-11f1-aa6c-3cecef704050', 'SERVICE_PRINT', 'Service Management - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b10b40-7f60-11f1-aa6c-3cecef704050', '46410e81-7f60-11f1-aa6c-3cecef704050', 'WORKSHOP_PRINT', 'Workshop Management - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b10bb0-7f60-11f1-aa6c-3cecef704050', '46410ec0-7f60-11f1-aa6c-3cecef704050', 'CALIBRATION_PRINT', 'Calibration Management - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b10c0c-7f60-11f1-aa6c-3cecef704050', '46410edb-7f60-11f1-aa6c-3cecef704050', 'WARRANTY_PRINT', 'Warranty Management - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b10c5d-7f60-11f1-aa6c-3cecef704050', '46410ef4-7f60-11f1-aa6c-3cecef704050', 'PM_PRINT', 'Preventive Maintenance - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b10cbc-7f60-11f1-aa6c-3cecef704050', '46410f10-7f60-11f1-aa6c-3cecef704050', 'PARTS_PRINT', 'Parts Management - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b10d17-7f60-11f1-aa6c-3cecef704050', '46410f29-7f60-11f1-aa6c-3cecef704050', 'REPORTS_PRINT', 'Reports - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b10d6b-7f60-11f1-aa6c-3cecef704050', '46410f43-7f60-11f1-aa6c-3cecef704050', 'SETTINGS_PRINT', 'System Settings - Print', 'PRINT', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b183e8-7f60-11f1-aa6c-3cecef704050', '46410b7c-7f60-11f1-aa6c-3cecef704050', 'DASHBOARD_ASSIGN', 'Dashboard - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b185bb-7f60-11f1-aa6c-3cecef704050', '46410d29-7f60-11f1-aa6c-3cecef704050', 'USERS_ASSIGN', 'User Management - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b18626-7f60-11f1-aa6c-3cecef704050', '46410d8e-7f60-11f1-aa6c-3cecef704050', 'CUSTOMERS_ASSIGN', 'Customer Management - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b186d9-7f60-11f1-aa6c-3cecef704050', '46410dcb-7f60-11f1-aa6c-3cecef704050', 'TERRITORIES_ASSIGN', 'Territory Management - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b18735-7f60-11f1-aa6c-3cecef704050', '46410e15-7f60-11f1-aa6c-3cecef704050', 'INSTRUMENTS_ASSIGN', 'Instrument Registry - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b1878d-7f60-11f1-aa6c-3cecef704050', '46410e3a-7f60-11f1-aa6c-3cecef704050', 'INSTALLATIONS_ASSIGN', 'Installation Management - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b187e7-7f60-11f1-aa6c-3cecef704050', '46410e53-7f60-11f1-aa6c-3cecef704050', 'SERVICE_ASSIGN', 'Service Management - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b18841-7f60-11f1-aa6c-3cecef704050', '46410e81-7f60-11f1-aa6c-3cecef704050', 'WORKSHOP_ASSIGN', 'Workshop Management - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b18895-7f60-11f1-aa6c-3cecef704050', '46410ec0-7f60-11f1-aa6c-3cecef704050', 'CALIBRATION_ASSIGN', 'Calibration Management - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b188e8-7f60-11f1-aa6c-3cecef704050', '46410edb-7f60-11f1-aa6c-3cecef704050', 'WARRANTY_ASSIGN', 'Warranty Management - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b18934-7f60-11f1-aa6c-3cecef704050', '46410ef4-7f60-11f1-aa6c-3cecef704050', 'PM_ASSIGN', 'Preventive Maintenance - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b1898f-7f60-11f1-aa6c-3cecef704050', '46410f10-7f60-11f1-aa6c-3cecef704050', 'PARTS_ASSIGN', 'Parts Management - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b189de-7f60-11f1-aa6c-3cecef704050', '46410f29-7f60-11f1-aa6c-3cecef704050', 'REPORTS_ASSIGN', 'Reports - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32'),
('a8b18a36-7f60-11f1-aa6c-3cecef704050', '46410f43-7f60-11f1-aa6c-3cecef704050', 'SETTINGS_ASSIGN', 'System Settings - Assign', 'ASSIGN', NULL, 1, '2026-07-14 08:47:32', '2026-07-14 08:47:32');

-- Seeding record block 86
INSERT INTO "pm_execution" ("id", "pm_schedule_id", "job_id", "engineer_id", "execution_date", "start_time", "end_time", "customer_contact", "customer_signature", "instrument_condition", "work_performed", "observations", "recommendations", "next_pm_due", "execution_status", "verified_by", "verified_at", "remarks", "created_at", "updated_at") VALUES
('de122bb4-7f7f-11f1-aa6c-3cecef704050', 'abac377a-7f7f-11f1-aa6c-3cecef704050', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14', '2026-07-14 18:00:56', '2026-07-14 19:30:56', 'Chief Medical Laboratory Technologist', 1, 'GOOD', 'Completed preventive maintenance according to manufacturer checklist.', 'Instrument operating within specification.', 'Continue routine preventive maintenance.', '2028-07-14', 'COMPLETED', NULL, NULL, NULL, '2026-07-14 12:30:56', '2026-07-14 12:30:56');

-- Seeding record block 87
INSERT INTO "pm_notifications" ("id", "pm_schedule_id", "recipient_user_id", "notification_type", "notification_channel", "subject", "message", "scheduled_send", "sent_at", "read_at", "status", "retry_count", "remarks", "created_at", "updated_at") VALUES
('1c5d627f-7f80-11f1-aa6c-3cecef704050', 'abac377a-7f7f-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'PM_CREATED', 'SYSTEM', 'Preventive Maintenance Scheduled', 'PM Schedule PM-2026-000001 has been assigned.', '2026-07-14 18:02:40', NULL, NULL, 'PENDING', 0, NULL, '2026-07-14 12:32:40', '2026-07-14 12:32:40');

-- Seeding record block 88
INSERT INTO "pm_schedules" ("id", "instrument_id", "warranty_activation_id", "schedule_no", "pm_no", "planned_date", "due_date", "scheduled_date", "completed_date", "assigned_engineer_id", "job_id", "service_interval_months", "schedule_status", "generated_automatically", "remarks", "created_at", "updated_at") VALUES
('abac377a-7f7f-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '68943ef6-7f7f-11f1-aa6c-3cecef704050', 'PM-2026-000001', 1, '2027-07-14', '2027-07-14', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, 12, 'PENDING', 1, NULL, '2026-07-14 12:29:31', '2026-07-14 12:29:31');

-- Seeding record block 89
INSERT INTO "provinces" ("id", "country_id", "province_code", "province_name", "active", "created_at", "updated_at") VALUES
('fc858f81-7f73-11f1-aa6c-3cecef704050', 'd3f5c6bb-7f73-11f1-aa6c-3cecef704050', 'WP', 'Western Province', 1, '2026-07-14 11:05:53', '2026-07-14 11:05:53'),
('fc86571b-7f73-11f1-aa6c-3cecef704050', 'd3f5c6bb-7f73-11f1-aa6c-3cecef704050', 'CP', 'Central Province', 1, '2026-07-14 11:05:53', '2026-07-14 11:05:53'),
('fc86b436-7f73-11f1-aa6c-3cecef704050', 'd3f5c6bb-7f73-11f1-aa6c-3cecef704050', 'SP', 'Southern Province', 1, '2026-07-14 11:05:53', '2026-07-14 11:05:53'),
('fc870fea-7f73-11f1-aa6c-3cecef704050', 'd3f5c6bb-7f73-11f1-aa6c-3cecef704050', 'NP', 'Northern Province', 1, '2026-07-14 11:05:53', '2026-07-14 11:05:53'),
('fc87780a-7f73-11f1-aa6c-3cecef704050', 'd3f5c6bb-7f73-11f1-aa6c-3cecef704050', 'EP', 'Eastern Province', 1, '2026-07-14 11:05:53', '2026-07-14 11:05:53'),
('fc87d041-7f73-11f1-aa6c-3cecef704050', 'd3f5c6bb-7f73-11f1-aa6c-3cecef704050', 'NWP', 'North Western Province', 1, '2026-07-14 11:05:53', '2026-07-14 11:05:53'),
('fc88328a-7f73-11f1-aa6c-3cecef704050', 'd3f5c6bb-7f73-11f1-aa6c-3cecef704050', 'NCP', 'North Central Province', 1, '2026-07-14 11:05:53', '2026-07-14 11:05:53'),
('fc888c62-7f73-11f1-aa6c-3cecef704050', 'd3f5c6bb-7f73-11f1-aa6c-3cecef704050', 'UP', 'Uva Province', 1, '2026-07-14 11:05:53', '2026-07-14 11:05:53'),
('fc88ebad-7f73-11f1-aa6c-3cecef704050', 'd3f5c6bb-7f73-11f1-aa6c-3cecef704050', 'SGP', 'Sabaragamuwa Province', 1, '2026-07-14 11:05:53', '2026-07-14 11:05:53');

-- Seeding record block 90
INSERT INTO "purchase_orders" ("id", "company_id", "supplier_id", "location_id", "po_no", "po_date", "expected_delivery_date", "currency", "subtotal", "discount_amount", "tax_amount", "total_amount", "status", "ordered_by", "approved_by", "approved_date", "supplier_reference", "remarks", "created_at", "updated_at") VALUES
('5dbdd081-7fe0-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'fd7c87de-7fdf-11f1-aa6c-3cecef704050', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', 'PO-2026-000001', '2026-07-15', '2026-07-29', 'LKR', 18500.00, 0.00, 0.00, 18500.00, 'ORDERED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:31:41', NULL, 'Temperature Sensor Purchase', '2026-07-15 00:01:41', '2026-07-15 00:01:41');

-- Seeding record block 91
INSERT INTO "purchase_order_items" ("id", "purchase_order_id", "part_id", "line_no", "quantity_ordered", "quantity_received", "unit_price", "discount_percent", "tax_percent", "remarks", "created_at", "updated_at") VALUES
('b768a770-7fe0-11f1-aa6c-3cecef704050', '5dbdd081-7fe0-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', 1, 10.00, 0.00, 18500.00, 0.00, 0.00, 'Temperature Sensors', '2026-07-15 00:04:11', '2026-07-15 00:04:11'),
('b769767c-7fe0-11f1-aa6c-3cecef704050', '5dbdd081-7fe0-11f1-aa6c-3cecef704050', '521e20eb-7fde-11f1-aa6c-3cecef704050', 2, 20.00, 0.00, 350.00, 0.00, 0.00, 'Glass Fuses', '2026-07-15 00:04:11', '2026-07-15 00:04:11'),
('b769fa4d-7fe0-11f1-aa6c-3cecef704050', '5dbdd081-7fe0-11f1-aa6c-3cecef704050', '521e8ab5-7fde-11f1-aa6c-3cecef704050', 3, 5.00, 0.00, 4200.00, 0.00, 0.00, 'Cooling Fans', '2026-07-15 00:04:11', '2026-07-15 00:04:11');

-- Seeding record block 92
INSERT INTO "qr_codes" ("id", "qr_code_no", "entity_type", "entity_id", "qr_value", "qr_version", "error_correction", "active", "generated_by", "generated_at", "remarks", "created_at", "updated_at") VALUES
('1d012087-8023-11f1-aa6c-3cecef704050', 'QR-000001', 'INSTRUMENT', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'AST:AST000001', 5, 'M', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 13:29:29', NULL, '2026-07-15 07:59:29', '2026-07-15 07:59:29');

-- Seeding record block 93
INSERT INTO "recent_activity" ("id", "user_id", "entity_type", "entity_id", "activity", "activity_time") VALUES
('d2761f37-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'CUSTOMER', '08d2bede-7f76-11f1-aa6c-3cecef704050', 'VIEW', '2026-07-15 12:51:36');

-- Seeding record block 94
INSERT INTO "report_execution_history" ("id", "execution_no", "report_id", "executed_by", "execution_time", "execution_status", "export_format", "records_returned", "execution_duration_ms", "file_name", "file_size_kb", "filter_values", "error_message", "ip_address", "remarks", "created_at") VALUES
('6761427d-8009-11f1-aa6c-3cecef704050', 'RPTRUN-2026-000001', 'ad142bbc-8006-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:25:27', 'SUCCESS', 'PDF', 125, 542, 'Service_Job_Summary.pdf', 865.40, NULL, NULL, '127.0.0.1', NULL, '2026-07-15 04:55:27'),
('6761fe15-8009-11f1-aa6c-3cecef704050', 'RPTRUN-2026-000002', 'ad14de17-8006-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:25:27', 'SUCCESS', 'EXCEL', 52, 318, 'Inventory_Report.xlsx', 420.75, NULL, NULL, '127.0.0.1', NULL, '2026-07-15 04:55:27'),
('67626a8d-8009-11f1-aa6c-3cecef704050', 'RPTRUN-2026-000003', 'ad15435b-8006-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:25:27', 'SUCCESS', 'PDF', 18, 274, 'PM_Due_Report.pdf', 210.30, NULL, NULL, '127.0.0.1', NULL, '2026-07-15 04:55:27');

-- Seeding record block 95
INSERT INTO "roles" ("id", "role_code", "role_name", "description", "active", "created_at", "updated_at") VALUES
('06785408-7f5f-11f1-aa6c-3cecef704050', 'SYSTEM_ADMIN', 'System Administrator', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('06785558-7f5f-11f1-aa6c-3cecef704050', 'WORKSHOP_MANAGER', 'Workshop Manager', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('067855b9-7f5f-11f1-aa6c-3cecef704050', 'DOCUMENTATION_OFFICER', 'Documentation Officer', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('067855d9-7f5f-11f1-aa6c-3cecef704050', 'SENIOR_BIOMEDICAL_ENGINEER', 'Senior Biomedical Engineer', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('067855f5-7f5f-11f1-aa6c-3cecef704050', 'BIOMEDICAL_ENGINEER', 'Biomedical Engineer', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('06785612-7f5f-11f1-aa6c-3cecef704050', 'SENIOR_SERVICE_ENGINEER', 'Senior Service Engineer', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('06785631-7f5f-11f1-aa6c-3cecef704050', 'SERVICE_ENGINEER', 'Service Engineer', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('0678564d-7f5f-11f1-aa6c-3cecef704050', 'JUNIOR_SERVICE_ENGINEER', 'Junior Service Engineer', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('06785669-7f5f-11f1-aa6c-3cecef704050', 'WORKSHOP_ENGINEER', 'Workshop Engineer', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('06785681-7f5f-11f1-aa6c-3cecef704050', 'CALIBRATION_ENGINEER', 'Calibration Engineer', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('06785698-7f5f-11f1-aa6c-3cecef704050', 'SENIOR_TECHNICIAN', 'Senior Technician', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('067856b1-7f5f-11f1-aa6c-3cecef704050', 'TECHNICIAN', 'Technician', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('067856cc-7f5f-11f1-aa6c-3cecef704050', 'TRAINEE_ENGINEER', 'Trainee Engineer', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50'),
('067856e6-7f5f-11f1-aa6c-3cecef704050', 'TRAINEE_TECHNICIAN', 'Trainee Technician', NULL, 1, '2026-07-14 08:35:50', '2026-07-14 08:35:50');

-- Seeding record block 96
INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "active", "created_at") VALUES
('161223c7-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16124010-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16124092-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161240dd-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af4529-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16124129-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afb738-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16124d83-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b01dbb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16124dcb-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0849e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16124e89-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0e3ba-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16124eca-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b183e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16124f9c-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade2a9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16124fe6-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8ad2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612502e-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aee965-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125075-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af473f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161250b7-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afb8a8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161251c9-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b01ef4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161252db-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b085ff-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612532c-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0e568-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125384-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b185bb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161253dd-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161254a3-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161254ea-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125531-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af4805-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125573-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afb90f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161255b9-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b01f51-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125602-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b08666-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612564d-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0e5cf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161256a4-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b18626-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125700-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade368-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125749-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b95-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612578e-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aeea07-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161257d7-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af48c4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612581c-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afb95e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125865-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b01fa4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161258ae-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b086bb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161258ff-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0e623-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161259e4-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b186d9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125a40-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125a8a-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125ad4-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125b1e-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af497e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125bed-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afb9ab-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125c34-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b01ff3-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125c7e-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0870f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125cc7-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0e67a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125d19-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b18735-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125d7b-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade3dd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125dca-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c13-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125e0d-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aeea93-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125e57-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af4a23-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125e9a-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afb9f1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125ee3-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0203e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125f2c-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0875c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125f77-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0e6cd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16125fc4-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b1878d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612601d-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade415-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612606d-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c55-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161260b2-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aeead5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161260fa-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af4ac4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612613e-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afba37-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126187-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0208b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161261d0-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b087a7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612621d-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0e720-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126268-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b187e7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161262c8-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade44b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161263bf-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c97-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126405-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb19-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126454-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af4b78-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612649a-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afba87-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161264e8-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b020d9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126536-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b087f8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126588-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b10b40-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161265d7-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b18841-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612663d-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade484-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612670b-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8cd5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161267d8-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126824-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af4c23-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612686c-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afbad0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161268b7-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0211c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126903-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0883e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126954-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b10bb0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161269a5-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b18895-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126a0d-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade4b6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126a5b-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d0f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126aa6-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb9b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126af8-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af4cd7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126b45-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afbb15-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126b95-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b02165-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126be0-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b08887-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126c30-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b10c0c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126c84-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b188e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126ce6-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade514-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126d3a-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d49-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126d8e-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aeebdf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126dd9-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af4d83-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126e30-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afbb5c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126f01-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b021a2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126f4e-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b088c7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126f9f-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b10c5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16126fec-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b18934-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612704f-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade551-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161270a6-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d88-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161270f6-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aeec21-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16127140-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af4e34-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16127190-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afbbaa-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161271dc-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b021ee-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612722b-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b08911-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612727b-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b10cbc-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161272ca-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b1898f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16127333-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16127417-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16127461-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161274af-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af4ee1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161274fc-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afbbf2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16127547-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b0223a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16128716-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b08960-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161287a6-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b10d17-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16128890-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b189de-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('1612890b-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ade5be-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('161289ef-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8ae8e05-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16128a46-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8aeeca8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16128a9d-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8af4f89-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16128b72-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8afbc38-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16128bc8-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b02282-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16128c1a-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b089b3-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16128c68-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b10d6b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('16128cc0-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', 'a8b18a36-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:35'),
('21372c26-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21372dc0-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21372e37-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21372e96-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8af4805-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21372ef3-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8afb90f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21372f51-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b01f51-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21372fa0-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b08666-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21372fef-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b0e5cf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('2137303a-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b18626-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('213730b4-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('2137310e-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21373162-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('213731bc-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8af4529-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('2137320c-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8afb738-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375a45-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b01dbb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375add-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b0849e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375b66-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b0e3ba-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375bcf-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b183e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375c7e-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375cda-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375d2f-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375d85-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8af497e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375dde-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8afb9ab-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375e38-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b01ff3-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375e95-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b0870f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375eee-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b0e67a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375f53-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b18735-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21375fe1-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ade551-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('2137603f-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d88-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21376095-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8aeec21-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('213760ec-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8af4e34-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('2137613f-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8afbbaa-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21376194-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b021ee-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('213764ee-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b08911-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21376566-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b10cbc-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('213765ca-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b1898f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21376662-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('213766bf-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21376717-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('2137676d-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8af4ee1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('213767c5-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8afbbf2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21376861-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b0223a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('213768f6-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b08960-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('213769df-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b10d17-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377893-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b189de-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('2137797c-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ade415-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('213779e7-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c55-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377a42-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8aeead5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377a9e-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8af4ac4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377af5-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8afba37-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377b4d-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b0208b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377ba7-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b087a7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377c05-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b0e720-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377c63-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b187e7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377cf2-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ade44b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377d51-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c97-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377dab-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb19-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377e04-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8af4b78-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377e9e-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8afba87-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377f13-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b020d9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('21377f6b-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b087f8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('2137804b-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b10b40-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('213780a4-7f61-11f1-aa6c-3cecef704050', '06785558-7f5f-11f1-aa6c-3cecef704050', 'a8b18841-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:50:54'),
('2ae76e2d-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7707e-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7717b-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7724a-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8af4805-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7730e-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8afb90f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae773d3-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b01f51-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae77471-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b08666-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae77509-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b0e5cf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae775ae-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b18626-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae776a7-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7777b-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae77839-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae778e7-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8af4529-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae77994-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8afb738-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae77a44-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b01dbb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae77aef-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b0849e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7aaf9-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b0e3ba-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7ac1e-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b183e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7ad71-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ade3dd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7ae3c-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c13-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7bef8-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8aeea93-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7bfe8-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8af4a23-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c0c8-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8afb9f1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c1d5-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b0203e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c2a7-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b0875c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c38e-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b0e6cd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c460-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b1878d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c57f-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ade514-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c648-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d49-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c6fb-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8aeebdf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c7a9-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8af4d83-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c85a-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8afbb5c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c910-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b021a2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7c9be-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b088c7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7ca72-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b10c5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7cb51-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b18934-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7cc77-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7cd3b-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7cdeb-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7ce8f-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8af4ee1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7cf45-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8afbbf2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7cfe7-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b0223a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d0a1-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b08960-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d168-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b10d17-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d231-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b189de-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d37c-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ade4b6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d433-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d0f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d4dc-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb9b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d58c-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8af4cd7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d632-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8afbb15-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d6db-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b02165-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d79b-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b08887-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d84d-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b10c0c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('2ae7d914-7f61-11f1-aa6c-3cecef704050', '067855b9-7f5f-11f1-aa6c-3cecef704050', 'a8b188e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:10'),
('3b5a8f7e-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9134-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a91b2-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a921d-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8af4805-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9278-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8afb90f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a92ea-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b01f51-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9346-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b08666-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a93a4-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0e5cf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a93f6-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b18626-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a946b-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a94c4-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a951f-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9573-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8af4805-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a95c3-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8afb90f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a961c-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b01f51-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a966b-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b08666-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a96c3-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0e5cf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9719-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b18626-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9788-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a97e9-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a984b-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a98ac-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8af4805-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a990d-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8afb90f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a997d-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b01f51-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a99d1-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b08666-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9a2f-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0e5cf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9a84-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b18626-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9af4-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9b59-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9be0-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9c48-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8af4805-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9caf-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8afb90f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9d21-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b01f51-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9d79-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b08666-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5a9dd9-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0e5cf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ab619-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b18626-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ab6ef-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ab767-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ab7da-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ab850-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8af4805-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ad572-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8afb90f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ad749-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b01f51-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ad8d6-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b08666-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ad952-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0e5cf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ad9c5-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b18626-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ada7e-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5adaef-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aea92-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aeb1f-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8af4529-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aeb80-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8afb738-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aebe3-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b01dbb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aec3b-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0849e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aec99-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0e3ba-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aecf4-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b183e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aed70-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aedd2-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aee3e-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aee9b-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8af4529-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aeef6-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8afb738-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aef57-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b01dbb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aefb2-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0849e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af01a-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0e3ba-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af087-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b183e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af10e-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af172-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af1d9-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af23b-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8af4529-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af298-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8afb738-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af2fb-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b01dbb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af359-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0849e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af3bf-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0e3ba-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af423-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b183e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af49e-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af502-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af582-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af68d-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8af4529-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af6f3-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8afb738-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af75b-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b01dbb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af7bf-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0849e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af8af-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0e3ba-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af917-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b183e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af98f-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5af9fc-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5afa6e-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5afada-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8af4529-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5afb43-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8afb738-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5afbac-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b01dbb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5afc12-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0849e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5afc74-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0e3ba-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5afcd2-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b183e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5afd71-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ade3dd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5afdd5-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c13-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5afe36-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8aeea93-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5afe94-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8af4a23-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aff1e-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8afb9f1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5aff81-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0203e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5affdc-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0875c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0039-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0e6cd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38');

-- Seeding record block 97
INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "active", "created_at") VALUES
('3b5b0096-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b1878d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0106-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ade3dd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b016d-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c13-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b01ce-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8aeea93-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b022e-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8af4a23-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b028e-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8afb9f1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b02f1-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0203e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0352-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0875c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b03b6-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0e6cd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0424-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b1878d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b04ac-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ade3dd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0513-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c13-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b057c-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8aeea93-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b05e4-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8af4a23-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0647-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8afb9f1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b06b1-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0203e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0717-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0875c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0781-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0e6cd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b07f6-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b1878d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0884-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ade3dd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b08f0-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c13-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0959-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8aeea93-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b09c2-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8af4a23-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0a27-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8afb9f1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0a91-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0203e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0af8-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0875c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0b63-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0e6cd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0bcc-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b1878d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0c50-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ade3dd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0cb8-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c13-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0d1e-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8aeea93-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0d84-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8af4a23-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0dde-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8afb9f1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0e41-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0203e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0e9f-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0875c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0f03-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0e6cd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0f64-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b1878d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b0fef-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b1051-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b10b4-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b110c-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8af497e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b116e-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8afb9ab-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b11c8-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b01ff3-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b122c-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0870f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b1287-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0e67a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b12ec-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b18735-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b135b-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b13bd-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b141e-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b1478-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8af497e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b14da-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8afb9ab-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b153d-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b01ff3-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b15a2-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0870f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b1605-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0e67a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b166d-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b18735-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b21c0-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b2e5b-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b2f0c-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b39d9-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8af497e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3a77-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8afb9ab-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3ae9-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b01ff3-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3b59-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0870f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3bc2-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0e67a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3c2e-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b18735-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3cc2-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3d36-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3da6-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3e0d-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8af497e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3e74-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8afb9ab-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3edb-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b01ff3-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3f47-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0870f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b3faf-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0e67a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b4b24-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b18735-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b4bf2-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b4c75-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b4ce9-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b4d92-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8af497e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b4e01-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8afb9ab-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b4e6b-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b01ff3-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b4ed7-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0870f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b4f44-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0e67a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b4fb2-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b18735-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5054-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ade514-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b50b9-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d49-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5119-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8aeebdf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5178-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8af4d83-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b51d8-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8afbb5c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5239-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b021a2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b529c-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b088c7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b52ff-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b10c5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5364-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b18934-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b53e1-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ade514-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b544a-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d49-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b54ad-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8aeebdf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b550f-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8af4d83-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5573-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8afbb5c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b55d8-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b021a2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b563f-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b088c7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b56a9-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b10c5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5718-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b18934-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b57ac-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ade514-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5814-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d49-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b587b-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8aeebdf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b58e0-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8af4d83-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5949-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8afbb5c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b59ae-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b021a2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5a14-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b088c7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5a7d-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b10c5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5ae6-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b18934-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5b70-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ade514-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5bd3-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d49-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5c34-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8aeebdf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5c9d-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8af4d83-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5d05-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8afbb5c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5d6d-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b021a2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5dd5-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b088c7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5e41-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b10c5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5eaa-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b18934-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5f25-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ade514-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5f93-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d49-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b5ff9-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8aeebdf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6068-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8af4d83-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b60d5-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8afbb5c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6137-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b021a2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b61a3-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b088c7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6213-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b10c5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6281-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b18934-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b631a-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b637e-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b63e0-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b643a-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8af4ee1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6495-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8afbbf2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b64f4-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0223a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6557-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b08960-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b65bc-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b10d17-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b661d-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b189de-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b66a7-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b670c-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6774-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b67d0-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8af4ee1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6830-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8afbbf2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6892-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0223a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b68fd-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b08960-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6965-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b10d17-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b69c8-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b189de-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6a55-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6ac0-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6b29-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6b88-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8af4ee1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6beb-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8afbbf2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6c4e-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0223a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6cba-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b08960-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6d24-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b10d17-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6d8f-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b189de-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6e20-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6e8a-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6efa-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6f5e-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8af4ee1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b6fc4-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8afbbf2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b702b-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0223a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b709d-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b08960-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b710b-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b10d17-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b7173-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b189de-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b71f9-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b7269-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b72cc-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b7336-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8af4ee1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b739e-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8afbbf2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8184-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0223a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b821c-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b08960-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b829a-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b10d17-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b830d-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b189de-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b83c8-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ade415-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8430-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c55-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b848e-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8aeead5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b84ec-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8af4ac4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8546-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8afba37-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b85aa-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0208b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b860c-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b087a7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8670-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0e720-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b86cd-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b187e7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8753-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ade415-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b87b9-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c55-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8818-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8aeead5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8878-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8af4ac4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b88d7-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8afba37-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b893c-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0208b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b89a5-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b087a7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8a09-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0e720-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8a6b-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b187e7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8af6-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ade415-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8b5b-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c55-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8bbb-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8aeead5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8c1d-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8af4ac4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8c7f-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8afba37-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8ce9-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0208b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8d54-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b087a7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8dbb-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0e720-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8e1e-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b187e7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8ea8-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ade415-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8f11-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c55-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8f75-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8aeead5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b8fe0-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8af4ac4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b9046-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8afba37-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b90af-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0208b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b9113-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b087a7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b9c05-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0e720-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b9ca4-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b187e7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b9d45-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ade415-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b9dbe-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c55-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b9e2a-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8aeead5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b9e99-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8af4ac4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b9f04-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8afba37-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b9f73-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0208b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5b9fdf-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b087a7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba04e-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0e720-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba0b9-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b187e7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba16e-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ade368-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba1cf-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b95-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba230-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8aeea07-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba28e-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8af48c4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba2eb-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8afb95e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba348-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b01fa4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba3a5-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b086bb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba406-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b0e623-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba466-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b186d9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba4da-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ade368-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba53a-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b95-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba59e-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8aeea07-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba600-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8af48c4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba661-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8afb95e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba6c5-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b01fa4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba728-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b086bb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba790-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b0e623-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba7f9-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b186d9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba87b-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ade368-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba8e2-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b95-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba944-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8aeea07-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5ba9a3-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8af48c4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5baa04-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8afb95e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5baa66-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b01fa4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5baaca-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b086bb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bab31-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b0e623-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bab98-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b186d9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bac15-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ade368-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bac80-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b95-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bace6-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8aeea07-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bad4e-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8af48c4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5badd9-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8afb95e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bae42-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b01fa4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5baea7-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b086bb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5baf14-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b0e623-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5baf7e-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b186d9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5baffb-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ade368-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb066-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b95-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb0d0-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8aeea07-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb13b-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8af48c4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb1a7-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8afb95e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb214-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b01fa4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb280-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b086bb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb2eb-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b0e623-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb35d-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b186d9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb3f7-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ade4b6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb457-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d0f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb4b6-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb9b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb513-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8af4cd7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb571-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8afbb15-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb5d5-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b02165-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb635-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b08887-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb692-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b10c0c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb6f6-7f61-11f1-aa6c-3cecef704050', '067855f5-7f5f-11f1-aa6c-3cecef704050', 'a8b188e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb76b-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ade4b6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb7d3-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d0f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb835-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb9b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb898-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8af4cd7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb8fb-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8afbb15-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb965-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b02165-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bb9cb-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b08887-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bba31-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b10c0c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bba9f-7f61-11f1-aa6c-3cecef704050', '0678564d-7f5f-11f1-aa6c-3cecef704050', 'a8b188e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bbb32-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ade4b6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc4b1-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d0f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc52c-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb9b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc597-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8af4cd7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc601-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8afbb15-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc66f-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b02165-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc6d7-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b08887-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc73d-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b10c0c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc7a7-7f61-11f1-aa6c-3cecef704050', '067855d9-7f5f-11f1-aa6c-3cecef704050', 'a8b188e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc843-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ade4b6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc8ae-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d0f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc91a-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb9b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc984-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8af4cd7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bc9ec-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8afbb15-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bca56-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b02165-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bcac1-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b08887-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bcb2a-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b10c0c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bcb98-7f61-11f1-aa6c-3cecef704050', '06785612-7f5f-11f1-aa6c-3cecef704050', 'a8b188e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bcc23-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ade4b6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bcc94-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d0f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bcd03-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb9b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bcd71-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8af4cd7-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bcde0-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8afbb15-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bce4b-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b02165-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bceba-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b08887-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bcf29-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b10c0c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('3b5bcf99-7f61-11f1-aa6c-3cecef704050', '06785631-7f5f-11f1-aa6c-3cecef704050', 'a8b188e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:51:38'),
('52d340d1-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d3429b-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d3432d-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d343a1-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8af4529-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34414-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8afb738-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34486-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b01dbb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d344ef-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b0849e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34553-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b0e3ba-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d345b5-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b183e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34644-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d346b2-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d3471e-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34790-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8af497e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34802-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8afb9ab-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34876-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b01ff3-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d348f1-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b0870f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34967-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b0e67a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d349e7-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b18735-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34a82-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8ade551-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34ae2-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d88-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34b4b-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8aeec21-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34bad-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8af4e34-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34c54-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8afbbaa-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34cc1-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b021ee-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34d2a-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b08911-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34d8c-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b10cbc-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d34f83-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b1898f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d35019-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d35085-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d350ed-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d3514c-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8af4ee1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d351ab-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8afbbf2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d3520c-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b0223a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d3527a-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b08960-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17');

-- Seeding record block 98
INSERT INTO "role_permissions" ("id", "role_id", "permission_id", "active", "created_at") VALUES
('52d35bda-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b10d17-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d35c67-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b189de-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d35d15-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8ade44b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d35d7b-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c97-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d35ddc-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb19-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d35e41-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8af4b78-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d35ea1-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8afba87-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d35f02-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b020d9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d35f5f-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b087f8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d35fc3-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b10b40-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('52d3602a-7f61-11f1-aa6c-3cecef704050', '06785669-7f5f-11f1-aa6c-3cecef704050', 'a8b18841-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:17'),
('5eca5e2f-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8ade484-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca5ff6-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8ae8cd5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca6125-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca622b-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8af4c23-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca62a5-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8afbad0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca631f-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b0211c-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca6389-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b0883e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca63e8-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b10bb0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca6444-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b18895-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca64ca-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca653e-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca65a7-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca6610-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8af4805-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca6679-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8afb90f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca67cf-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b01f51-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca683c-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b08666-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca68b6-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b0e5cf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca69b0-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b18626-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca6a43-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca6ab1-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca6b26-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca6b8f-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8af4529-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca6bf5-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8afb738-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5eca6c55-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b01dbb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecaddb2-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b0849e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecade9e-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b0e3ba-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecadf25-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b183e8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae00e-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae08b-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae12c-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae1ad-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8af497e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae229-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8afb9ab-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae2bb-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b01ff3-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae37b-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b0870f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae432-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b0e67a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae517-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b18735-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae664-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae73a-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae80c-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae8c5-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8af4ee1-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecae98b-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8afbbf2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecaea58-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b0223a-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecafb19-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b08960-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecafc16-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b10d17-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('5ecafd10-7f61-11f1-aa6c-3cecef704050', '06785681-7f5f-11f1-aa6c-3cecef704050', 'a8b189de-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:37'),
('6ae21a93-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae21c73-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae21d09-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae21d7a-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade0ca-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae21e20-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade2a9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae21e80-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade2a9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae21eda-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade2a9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae21f3a-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade2a9-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae21fa1-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2200d-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2207f-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae22117-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade327-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae22190-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade368-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae221f3-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade368-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae22257-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade368-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae222bd-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade368-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae22330-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae223c7-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2243c-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae224a7-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade3a4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2251f-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade3dd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae22596-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade3dd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae23dd4-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade3dd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae23e72-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade3dd-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae23efc-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade415-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae23f72-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade415-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae23fe7-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade415-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2405a-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade415-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae240db-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade44b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae24141-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade44b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae241b6-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade44b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae24226-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade44b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae242a4-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade484-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae24311-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade484-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae24379-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade484-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae243ee-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade484-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2446e-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade4b6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae244e4-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade4b6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae24553-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade4b6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae245d3-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade4b6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae24652-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade514-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae246c5-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade514-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae24739-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade514-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae247ac-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade514-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2482e-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade551-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae24891-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade551-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae24902-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade551-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae24972-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade551-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae255fd-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25676-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae256df-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2574d-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade588-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae257d4-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ade5be-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25841-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ade5be-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae258ac-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ade5be-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25918-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ade5be-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25994-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25a08-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25a79-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25b2a-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8943-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25c68-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8ad2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25cdf-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8ad2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25dd6-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8ad2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25e4a-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8ad2-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25ec8-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25f46-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae25fc3-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26045-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b31-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae260d2-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b95-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26141-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b95-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae261af-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b95-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26220-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8b95-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2629e-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26311-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26386-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26400-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8bd6-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26485-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c13-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae264f8-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c13-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2656c-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c13-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae265e6-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c13-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2666a-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c55-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae266df-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c55-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26755-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c55-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae267ce-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c55-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26879-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c97-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae268f1-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c97-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26964-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c97-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae269d6-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8c97-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26a58-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8cd5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26ac9-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8cd5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26b3b-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8cd5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26bb0-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8cd5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26c30-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d0f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26ca0-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d0f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae26d12-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d0f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae28185-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d0f-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae283c6-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d49-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2844b-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d49-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae284cb-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d49-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae28551-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d49-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae285e1-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d88-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae28649-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d88-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae286b7-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d88-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae28727-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8d88-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae287a2-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae28814-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2888b-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2899d-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8dc4-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae28a29-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8ae8e05-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae28b1e-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8ae8e05-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae29862-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8ae8e05-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae298ec-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8ae8e05-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae29978-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae299fb-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae29a7c-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae29afe-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aee7fb-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae29b82-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aee965-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2a6e9-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aee965-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2a760-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aee965-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2a7c7-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aee965-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2a854-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2a9c0-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2aa40-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2ab49-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aee9c0-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2abe5-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aeea07-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2ac6c-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aeea07-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2ace6-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aeea07-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2ad61-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aeea07-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2aded-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2ae77-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2aef1-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2af71-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aeea4e-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2b005-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aeea93-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2b083-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aeea93-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2b0ff-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aeea93-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2b180-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aeea93-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2b212-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aeead5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2b270-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aeead5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2b2e2-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aeead5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c0ea-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aeead5-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c19c-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb19-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c1fe-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb19-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c274-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb19-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c2e9-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb19-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c36f-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c3c5-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c434-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c4a5-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb5d-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c526-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb9b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c585-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb9b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c602-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb9b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c680-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aeeb9b-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c70f-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aeebdf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c965-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aeebdf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2c9ce-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aeebdf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2ca3f-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aeebdf-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2cad0-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aeec21-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2cb2a-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aeec21-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2cb99-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aeec21-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2cc0d-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aeec21-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2cc8d-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2ccee-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2cd68-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2cde6-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aeec65-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2ce72-7f61-11f1-aa6c-3cecef704050', '06785698-7f5f-11f1-aa6c-3cecef704050', 'a8aeeca8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2cec8-7f61-11f1-aa6c-3cecef704050', '067856b1-7f5f-11f1-aa6c-3cecef704050', 'a8aeeca8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2cf3c-7f61-11f1-aa6c-3cecef704050', '067856cc-7f5f-11f1-aa6c-3cecef704050', 'a8aeeca8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58'),
('6ae2cfb2-7f61-11f1-aa6c-3cecef704050', '067856e6-7f5f-11f1-aa6c-3cecef704050', 'a8aeeca8-7f60-11f1-aa6c-3cecef704050', 1, '2026-07-14 08:52:58');

-- Seeding record block 99
INSERT INTO "saved_filters" ("id", "filter_code", "user_id", "module_name", "filter_name", "filter_definition", "is_default", "created_at", "updated_at") VALUES
('d26f1a97-801d-11f1-aa6c-3cecef704050', 'SF-001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'SERVICE', 'My Open Jobs', '{"status": "OPEN"}', 1, '2026-07-15 07:21:36', '2026-07-15 07:21:36');

-- Seeding record block 100
INSERT INTO "saved_reports" ("id", "report_code", "report_name", "report_category", "report_type", "description", "sql_query", "filter_definition", "chart_definition", "default_export", "is_system_report", "active", "created_by", "created_at", "updated_at") VALUES
('ad142bbc-8006-11f1-aa6c-3cecef704050', 'SRV001', 'Service Job Summary', 'SERVICE', 'TABLE', 'Summary of all service jobs.', NULL, NULL, NULL, 'PDF', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:35:55', '2026-07-15 04:35:55'),
('ad14de17-8006-11f1-aa6c-3cecef704050', 'INV001', 'Inventory Stock Report', 'INVENTORY', 'TABLE', 'Current inventory balances.', NULL, NULL, NULL, 'EXCEL', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:35:55', '2026-07-15 04:35:55'),
('ad15435b-8006-11f1-aa6c-3cecef704050', 'PM001', 'Preventive Maintenance Due', 'PM', 'TABLE', 'Upcoming preventive maintenance schedules.', NULL, NULL, NULL, 'PDF', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:35:55', '2026-07-15 04:35:55'),
('ad15a325-8006-11f1-aa6c-3cecef704050', 'CAL001', 'Calibration Due Report', 'CALIBRATION', 'TABLE', 'Upcoming calibration schedules.', NULL, NULL, NULL, 'PDF', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:35:55', '2026-07-15 04:35:55'),
('ad1606f3-8006-11f1-aa6c-3cecef704050', 'MGT001', 'Management Dashboard', 'MANAGEMENT', 'DASHBOARD', 'Executive KPI dashboard.', NULL, NULL, NULL, 'PDF', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:35:55', '2026-07-15 04:35:55');

-- Seeding record block 101
INSERT INTO "sequence_numbers" ("id", "sequence_code", "document_name", "company_id", "branch_id", "prefix", "suffix", "include_year", "include_month", "number_separator", "number_length", "current_number", "increment_by", "reset_rule", "last_reset_date", "active", "remarks", "created_by", "created_at", "updated_at") VALUES
('835de0db-8022-11f1-aa6c-3cecef704050', 'CUSTOMER', 'Customer', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'CUS', NULL, 1, 0, '-', 6, 0, 1, 'YEARLY', '2026-07-15', 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:55:11', '2026-07-15 07:55:11'),
('835ea2b7-8022-11f1-aa6c-3cecef704050', 'INSTRUMENT', 'Instrument', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'INS', NULL, 1, 0, '-', 6, 0, 1, 'YEARLY', '2026-07-15', 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:55:11', '2026-07-15 07:55:11'),
('835f1660-8022-11f1-aa6c-3cecef704050', 'SERVICE_REQUEST', 'Service Request', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'REQ', NULL, 1, 0, '-', 6, 0, 1, 'YEARLY', '2026-07-15', 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:55:11', '2026-07-15 07:55:11'),
('835f84c5-8022-11f1-aa6c-3cecef704050', 'SERVICE_JOB', 'Service Job', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'JOB', NULL, 1, 0, '-', 6, 0, 1, 'YEARLY', '2026-07-15', 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:55:11', '2026-07-15 07:55:11'),
('835ff32a-8022-11f1-aa6c-3cecef704050', 'INSTALLATION', 'Installation', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'INSL', NULL, 1, 0, '-', 6, 0, 1, 'YEARLY', '2026-07-15', 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:55:11', '2026-07-15 07:55:11'),
('83606091-8022-11f1-aa6c-3cecef704050', 'PM', 'Preventive Maintenance', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'PM', NULL, 1, 0, '-', 6, 0, 1, 'YEARLY', '2026-07-15', 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:55:11', '2026-07-15 07:55:11'),
('8360ccff-8022-11f1-aa6c-3cecef704050', 'CALIBRATION', 'Calibration', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'CAL', NULL, 1, 0, '-', 6, 0, 1, 'YEARLY', '2026-07-15', 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:55:11', '2026-07-15 07:55:11'),
('83613aac-8022-11f1-aa6c-3cecef704050', 'PURCHASE_ORDER', 'Purchase Order', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'PO', NULL, 1, 0, '-', 6, 0, 1, 'YEARLY', '2026-07-15', 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:55:11', '2026-07-15 07:55:11'),
('8361ae6a-8022-11f1-aa6c-3cecef704050', 'GOODS_RECEIPT', 'Goods Receipt', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'GRN', NULL, 1, 0, '-', 6, 0, 1, 'YEARLY', '2026-07-15', 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:55:11', '2026-07-15 07:55:11'),
('83621f2e-8022-11f1-aa6c-3cecef704050', 'SUPPLIER', 'Supplier', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'SUP', NULL, 1, 0, '-', 6, 0, 1, 'YEARLY', '2026-07-15', 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:55:11', '2026-07-15 07:55:11');

-- Seeding record block 102
INSERT INTO "service_contracts" ("id", "company_id", "customer_id", "contract_no", "contract_type", "contract_title", "start_date", "end_date", "contract_value", "currency", "response_time_hours", "preventive_visits_per_year", "calibration_visits_per_year", "status", "remarks", "active", "created_at", "updated_at") VALUES
('49b2ddcb-7f7b-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', 'AMC-2026-0001', 'AMC', 'Annual Maintenance Contract', '2026-07-14', '2027-07-14', 350000.00, 'LKR', 24, 2, 1, 'ACTIVE', NULL, 1, '2026-07-14 11:58:09', '2026-07-14 11:58:09');

-- Seeding record block 103
INSERT INTO "service_jobs" ("id", "service_request_id", "company_id", "customer_id", "instrument_id", "territory_id", "assigned_engineer_id", "job_no", "job_type", "priority", "status", "scheduled_date", "travel_start", "onsite_start", "onsite_finish", "workshop_in", "workshop_out", "completed_date", "closed_date", "labour_hours", "travel_distance_km", "customer_signature", "engineer_notes", "internal_notes", "created_at", "updated_at") VALUES
('6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'b3abec83-7f7b-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'JOB-2026-000001', 'BREAKDOWN', 'HIGH', 'ASSIGNED', '2026-07-14 17:36:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0, NULL, NULL, '2026-07-14 12:06:22', '2026-07-14 12:06:22');

-- Seeding record block 104
INSERT INTO "service_requests" ("id", "company_id", "customer_id", "department_id", "contact_id", "instrument_id", "territory_id", "request_no", "request_date", "request_type", "priority", "request_source", "problem_description", "requested_by", "contact_number", "status", "assigned_engineer_id", "scheduled_date", "completed_date", "remarks", "active", "created_at", "updated_at") VALUES
('b3abec83-7f7b-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '784ad52d-7f76-11f1-aa6c-3cecef704050', 'c7a6b23f-7f76-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'SR-2026-000001', '2026-07-14 17:31:07', 'BREAKDOWN', 'HIGH', 'PHONE', 'Instrument displays temperature error during startup.', 'Nimal Perera', '0777000001', 'NEW', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 1, '2026-07-14 12:01:07', '2026-07-14 12:01:07');

-- Seeding record block 105
INSERT INTO "spare_parts" ("id", "part_number", "manufacturer_part_no", "part_name", "description", "manufacturer_id", "brand_id", "category", "unit_of_measure", "minimum_stock", "reorder_level", "maximum_stock", "standard_cost", "selling_price", "lead_time_days", "shelf_life_months", "active", "created_at", "updated_at") VALUES
('521d76c4-7fde-11f1-aa6c-3cecef704050', 'TEMP-SENSOR-001', 'TS-1001', 'Temperature Sensor', NULL, '04a5db33-7f77-11f1-aa6c-3cecef704050', '860f5119-7f77-11f1-aa6c-3cecef704050', 'ELECTRONIC', 'PCS', 2.00, 5.00, 20.00, 18500.00, 24000.00, 30, NULL, 1, '2026-07-14 23:47:03', '2026-07-14 23:47:03'),
('521e20eb-7fde-11f1-aa6c-3cecef704050', 'FUSE-250V-5A', 'F250V5A', 'Glass Fuse 250V 5A', NULL, '04a5db33-7f77-11f1-aa6c-3cecef704050', '860f5119-7f77-11f1-aa6c-3cecef704050', 'ELECTRICAL', 'PCS', 10.00, 20.00, 100.00, 350.00, 600.00, 30, NULL, 1, '2026-07-14 23:47:03', '2026-07-14 23:47:03'),
('521e8ab5-7fde-11f1-aa6c-3cecef704050', 'FAN-24V-001', 'FAN24V', 'Cooling Fan 24V DC', NULL, '04a5db33-7f77-11f1-aa6c-3cecef704050', '860f5119-7f77-11f1-aa6c-3cecef704050', 'MECHANICAL', 'PCS', 2.00, 5.00, 15.00, 4200.00, 6500.00, 30, NULL, 1, '2026-07-14 23:47:03', '2026-07-14 23:47:03');

-- Seeding record block 106
INSERT INTO "stock_adjustments" ("id", "adjustment_no", "location_id", "adjustment_type", "adjustment_date", "approved_by", "created_by", "status", "remarks", "created_at", "updated_at") VALUES
('362d4f5e-7fe2-11f1-aa6c-3cecef704050', 'SA-2026-000001', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', 'STOCK_TAKE', '2026-07-15 05:44:54', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'POSTED', 'Annual stock verification.', '2026-07-15 00:14:54', '2026-07-15 00:14:54');

-- Seeding record block 107
INSERT INTO "stock_adjustment_items" ("id", "adjustment_id", "line_no", "part_id", "system_quantity", "physical_quantity", "adjustment_quantity", "unit_cost", "reason", "remarks", "created_at", "updated_at") VALUES
('421a48f0-7fe2-11f1-aa6c-3cecef704050', '362d4f5e-7fe2-11f1-aa6c-3cecef704050', 1, '521d76c4-7fde-11f1-aa6c-3cecef704050', 25.00, 24.00, -1.00, 18500.00, 'One sensor missing during stock count.', NULL, '2026-07-15 00:15:14', '2026-07-15 00:15:14'),
('421b01b0-7fe2-11f1-aa6c-3cecef704050', '362d4f5e-7fe2-11f1-aa6c-3cecef704050', 2, '521e20eb-7fde-11f1-aa6c-3cecef704050', 100.00, 102.00, 2.00, 350.00, 'Additional stock found during verification.', NULL, '2026-07-15 00:15:14', '2026-07-15 00:15:14');

-- Seeding record block 108
INSERT INTO "stock_take" ("id", "stock_take_no", "location_id", "stock_take_date", "status", "started_at", "completed_at", "counted_by", "verified_by", "approved_by", "remarks", "created_at", "updated_at") VALUES
('6baee732-7fe4-11f1-aa6c-3cecef704050', 'STK-2026-000001', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '2026-07-15', 'COMPLETED', '2026-07-15 06:00:42', '2026-07-15 06:00:42', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Annual stock verification.', '2026-07-15 00:30:42', '2026-07-15 00:30:42');

-- Seeding record block 109
INSERT INTO "stock_take_items" ("id", "stock_take_id", "line_no", "part_id", "system_quantity", "counted_quantity", "variance_value", "counted_by", "remarks", "created_at", "updated_at") VALUES
('6bafc9db-7fe4-11f1-aa6c-3cecef704050', '6baee732-7fe4-11f1-aa6c-3cecef704050', 1, '521d76c4-7fde-11f1-aa6c-3cecef704050', 25.00, 24.00, -18500.00, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'One item missing.', '2026-07-15 00:30:42', '2026-07-15 00:30:42'),
('6bb0481d-7fe4-11f1-aa6c-3cecef704050', '6baee732-7fe4-11f1-aa6c-3cecef704050', 2, '521e20eb-7fde-11f1-aa6c-3cecef704050', 100.00, 102.00, 700.00, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Additional stock found.', '2026-07-15 00:30:42', '2026-07-15 00:30:42');

-- Seeding record block 110
INSERT INTO "stock_transfers" ("id", "transfer_no", "from_location_id", "to_location_id", "requested_by", "approved_by", "dispatched_by", "received_by", "request_date", "approval_date", "dispatch_date", "received_date", "status", "courier_name", "tracking_no", "vehicle_no", "remarks", "created_at", "updated_at") VALUES
('8ad8cd0b-7fe1-11f1-aa6c-3cecef704050', 'TRF-2026-000001', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', 'ef84ae2e-7fde-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:40:06', '2026-07-15 05:40:06', '2026-07-15 05:40:06', '2026-07-15 05:40:06', 'RECEIVED', NULL, NULL, NULL, 'Stock transfer from General Stores to Service Centre.', '2026-07-15 00:10:06', '2026-07-15 00:10:06');

-- Seeding record block 111
INSERT INTO "stock_transfer_items" ("id", "transfer_id", "line_no", "part_id", "quantity_requested", "quantity_dispatched", "quantity_received", "unit_cost", "remarks", "created_at", "updated_at") VALUES
('a0f0bf15-7fe1-11f1-aa6c-3cecef704050', '8ad8cd0b-7fe1-11f1-aa6c-3cecef704050', 1, '521d76c4-7fde-11f1-aa6c-3cecef704050', 5.00, 5.00, 5.00, 18500.00, NULL, '2026-07-15 00:10:43', '2026-07-15 00:10:43'),
('a0f17bdf-7fe1-11f1-aa6c-3cecef704050', '8ad8cd0b-7fe1-11f1-aa6c-3cecef704050', 2, '521e20eb-7fde-11f1-aa6c-3cecef704050', 20.00, 20.00, 20.00, 350.00, NULL, '2026-07-15 00:10:43', '2026-07-15 00:10:43'),
('a0f1db3f-7fe1-11f1-aa6c-3cecef704050', '8ad8cd0b-7fe1-11f1-aa6c-3cecef704050', 3, '521e8ab5-7fde-11f1-aa6c-3cecef704050', 2.00, 2.00, 2.00, 4200.00, NULL, '2026-07-15 00:10:43', '2026-07-15 00:10:43');

-- Seeding record block 112
INSERT INTO "suppliers" ("id", "supplier_code", "supplier_name", "supplier_type", "registration_no", "tax_no", "address_line1", "address_line2", "city", "country_id", "contact_person", "designation", "phone", "mobile", "email", "website", "payment_terms", "credit_limit", "active", "remarks", "created_at", "updated_at") VALUES
('fd7c87de-7fdf-11f1-aa6c-3cecef704050', 'SUP0001', 'AVON PHARMO CHEM (PVT) LTD', 'DISTRIBUTOR', NULL, NULL, NULL, NULL, 'Colombo', NULL, 'Stores Department', NULL, '0112696911', NULL, 'stores@avonpclk.com', 'https://www.avonpclk.com', NULL, 0.00, 1, NULL, '2026-07-14 23:59:00', '2026-07-14 23:59:00'),
('fd7d28fe-7fdf-11f1-aa6c-3cecef704050', 'SUP0002', 'Abbott Laboratories', 'MANUFACTURER', NULL, NULL, NULL, NULL, 'Illinois', NULL, 'International Sales', NULL, NULL, NULL, NULL, 'https://www.abbott.com', NULL, 0.00, 1, NULL, '2026-07-14 23:59:00', '2026-07-14 23:59:00'),
('fd7d8e82-7fdf-11f1-aa6c-3cecef704050', 'SUP0003', 'Bio-Rad Laboratories', 'MANUFACTURER', NULL, NULL, NULL, NULL, 'California', NULL, NULL, NULL, NULL, NULL, NULL, 'https://www.bio-rad.com', NULL, 0.00, 1, NULL, '2026-07-14 23:59:00', '2026-07-14 23:59:00'),
('fd7dea2b-7fdf-11f1-aa6c-3cecef704050', 'SUP0004', 'Thermo Fisher Scientific', 'MANUFACTURER', NULL, NULL, NULL, NULL, 'Massachusetts', NULL, NULL, NULL, NULL, NULL, NULL, 'https://www.thermofisher.com', NULL, 0.00, 1, NULL, '2026-07-14 23:59:00', '2026-07-14 23:59:00'),
('fd7e51ba-7fdf-11f1-aa6c-3cecef704050', 'SUP0005', 'Eppendorf SE', 'MANUFACTURER', NULL, NULL, NULL, NULL, 'Hamburg', NULL, NULL, NULL, NULL, NULL, NULL, 'https://www.eppendorf.com', NULL, 0.00, 1, NULL, '2026-07-14 23:59:00', '2026-07-14 23:59:00');

-- Seeding record block 113
INSERT INTO "system_announcements" ("id", "announcement_no", "company_id", "title", "message", "announcement_type", "priority", "audience", "start_datetime", "end_datetime", "dismissible", "popup_on_login", "active", "created_by", "created_at", "updated_at") VALUES
('5ef02973-8013-11f1-aa6c-3cecef704050', 'ANN-2026-000001', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Welcome to Avon ServicePro', 'Welcome to the Avon ServicePro Scientific Equipment Management System.', 'GENERAL', 'NORMAL', 'ALL_USERS', '2026-07-15 11:36:47', '2026-08-14 11:36:47', 1, 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:06:47', '2026-07-15 06:06:47'),
('5ef0e3f7-8013-11f1-aa6c-3cecef704050', 'ANN-2026-000002', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Scheduled Server Maintenance', 'System maintenance is scheduled this Sunday from 10:00 PM to 11:00 PM.', 'MAINTENANCE', 'HIGH', 'ALL_USERS', '2026-07-15 11:36:47', '2026-07-22 11:36:47', 0, 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:06:47', '2026-07-15 06:06:47'),
('5ef15831-8013-11f1-aa6c-3cecef704050', 'ANN-2026-000003', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Calibration Department', 'Calibration module is now available for all Calibration Engineers.', 'UPDATE', 'NORMAL', 'CALIBRATION', '2026-07-15 11:36:47', NULL, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:06:47', '2026-07-15 06:06:47');

-- Seeding record block 114
INSERT INTO "system_backup_history" ("id", "backup_no", "backup_type", "backup_name", "backup_file", "storage_location", "file_size_mb", "started_at", "completed_at", "duration_seconds", "compression", "checksum_sha256", "backup_status", "verified", "restore_tested", "retention_days", "created_by", "remarks", "created_at", "updated_at") VALUES
('fc022481-800a-11f1-aa6c-3cecef704050', 'BKP-2026-000001', 'FULL_DATABASE', 'Daily Database Backup', 'avonservicepro_20260715.sql.gz', '/backups/database/', 128.45, '2026-07-15 10:26:45', '2026-07-15 10:36:45', 600, 'GZIP', '9f12b4e739ea191650a242f6a621f4e48f93518d093b552ec54d3a59f6a96433', 'COMPLETED', 1, 0, 30, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Automatic scheduled backup.', '2026-07-15 05:06:45', '2026-07-15 05:06:45'),
('fc02d054-800a-11f1-aa6c-3cecef704050', 'BKP-2026-000002', 'FILES', 'Document Repository Backup', 'documents_20260715.zip', '/backups/files/', 512.80, '2026-07-15 10:06:45', '2026-07-15 10:16:45', 600, 'ZIP', '84ce47f24d2c592e44861f24bd2ed409282d8bfc9ffc607a8e1a7b377c56a91e', 'COMPLETED', 1, 1, 90, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Weekly document backup.', '2026-07-15 05:06:45', '2026-07-15 05:06:45');

-- Seeding record block 115
INSERT INTO "system_health" ("id", "health_no", "check_time", "server_name", "application_version", "database_version", "cpu_usage_percent", "memory_usage_percent", "disk_usage_percent", "database_size_mb", "active_users", "active_sessions", "api_requests_per_minute", "average_response_time_ms", "uptime_seconds", "overall_status", "database_status", "storage_status", "remarks", "created_at") VALUES
('51bf0453-800b-11f1-aa6c-3cecef704050', 'HLT-2026-000001', '2026-07-15 10:39:09', 'AVON-PROD-01', '1.0.0', '10.11.18-MariaDB', 18.50, 42.30, 61.80, 185.40, 8, 11, 54, 128, 864000, 'HEALTHY', 'ONLINE', 'NORMAL', 'All services operating normally.', '2026-07-15 05:09:09');

-- Seeding record block 116
INSERT INTO "system_jobs" ("id", "job_code", "job_name", "description", "job_type", "schedule_expression", "execution_command", "enabled", "run_as_user", "last_started_at", "last_completed_at", "last_status", "last_duration_seconds", "next_run_at", "timeout_seconds", "max_retry_count", "retry_count", "log_output", "notify_on_failure", "active", "remarks", "created_by", "created_at", "updated_at") VALUES
('30603317-8015-11f1-aa6c-3cecef704050', 'JOB_BACKUP', 'Daily Database Backup', 'Automatic daily database backup.', 'SCHEDULED', '0 2 * * *', 'backup_database', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'NEVER_RUN', NULL, '2026-07-16 11:49:48', 3600, 3, 0, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:19:48', '2026-07-15 06:19:48'),
('3060e92b-8015-11f1-aa6c-3cecef704050', 'JOB_PM_GENERATOR', 'PM Schedule Generator', 'Generate Preventive Maintenance schedules.', 'SCHEDULED', '0 0 * * *', 'generate_pm_schedules', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'NEVER_RUN', NULL, '2026-07-16 11:49:48', 3600, 3, 0, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:19:48', '2026-07-15 06:19:48'),
('30615578-8015-11f1-aa6c-3cecef704050', 'JOB_CAL_GENERATOR', 'Calibration Schedule Generator', 'Generate Calibration schedules.', 'SCHEDULED', '15 0 * * *', 'generate_calibration_schedules', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'NEVER_RUN', NULL, '2026-07-16 11:49:48', 3600, 3, 0, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:19:48', '2026-07-15 06:19:48'),
('3061c3b7-8015-11f1-aa6c-3cecef704050', 'JOB_EMAIL_QUEUE', 'Email Queue Processor', 'Processes queued emails.', 'BACKGROUND', '*/5 * * * *', 'process_email_queue', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'NEVER_RUN', NULL, '2026-07-15 11:54:48', 3600, 3, 0, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:19:48', '2026-07-15 06:19:48'),
('30622de5-8015-11f1-aa6c-3cecef704050', 'JOB_CLEANUP', 'System Cleanup', 'Deletes temporary files and expired sessions.', 'MAINTENANCE', '0 3 * * 0', 'system_cleanup', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'NEVER_RUN', NULL, '2026-07-22 11:49:48', 3600, 3, 0, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:19:48', '2026-07-15 06:19:48');

-- Seeding record block 117
INSERT INTO "system_preferences" ("id", "preference_code", "category", "preference_name", "preference_key", "preference_value", "data_type", "description", "editable", "active", "updated_by", "created_at", "updated_at") VALUES
('d27e68cd-8019-11f1-aa6c-3cecef704050', 'PREF-001', 'GENERAL', 'Application Theme', 'APP_THEME', 'LIGHT', 'STRING', 'Default application theme.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58'),
('d27f0e2d-8019-11f1-aa6c-3cecef704050', 'PREF-002', 'GENERAL', 'Default Language', 'DEFAULT_LANGUAGE', 'EN', 'STRING', 'Default system language.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58'),
('d27f63c9-8019-11f1-aa6c-3cecef704050', 'PREF-003', 'SERVICE', 'Default Job Priority', 'DEFAULT_JOB_PRIORITY', 'HIGH', 'STRING', 'Default service request priority.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58'),
('d27fbd48-8019-11f1-aa6c-3cecef704050', 'PREF-004', 'INVENTORY', 'Reorder Alert Days', 'REORDER_ALERT_DAYS', '30', 'INTEGER', 'Notify before stock reaches reorder level.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58'),
('d280180e-8019-11f1-aa6c-3cecef704050', 'PREF-005', 'SECURITY', 'Session Timeout', 'SESSION_TIMEOUT_MINUTES', '60', 'INTEGER', 'Automatic session timeout in minutes.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58'),
('d280717b-8019-11f1-aa6c-3cecef704050', 'PREF-006', 'NOTIFICATIONS', 'Email Notifications', 'EMAIL_ENABLED', 'true', 'BOOLEAN', 'Enable email notifications.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58');

-- Seeding record block 118
INSERT INTO "system_settings" ("id", "setting_group", "setting_key", "setting_name", "setting_value", "value_type", "description", "editable", "system_setting", "updated_by", "created_at", "updated_at") VALUES
('6e2e49e0-8005-11f1-aa6c-3cecef704050', 'COMPANY', 'COMPANY_NAME', 'Company Name', 'AVON PHARMO CHEM (PVT) LTD', 'STRING', 'Company Name', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:27:00', '2026-07-15 04:27:00'),
('6e2f0c5e-8005-11f1-aa6c-3cecef704050', 'GENERAL', 'DEFAULT_CURRENCY', 'Default Currency', 'LKR', 'STRING', 'System Default Currency', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:27:00', '2026-07-15 04:27:00'),
('6e2f6b36-8005-11f1-aa6c-3cecef704050', 'GENERAL', 'TIMEZONE', 'System Timezone', 'Asia/Colombo', 'STRING', 'Application Timezone', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:27:00', '2026-07-15 04:27:00'),
('6e2fe183-8005-11f1-aa6c-3cecef704050', 'SERVICE', 'DEFAULT_RESPONSE_HOURS', 'Default Response Time', '24', 'INTEGER', 'Default SLA Response Time', 1, 0, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:27:00', '2026-07-15 04:27:00'),
('6e303f72-8005-11f1-aa6c-3cecef704050', 'SERVICE', 'DEFAULT_PM_INTERVAL', 'Default PM Interval (Months)', '6', 'INTEGER', 'Default Preventive Maintenance Interval', 1, 0, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:27:00', '2026-07-15 04:27:00'),
('6e30c1e6-8005-11f1-aa6c-3cecef704050', 'CALIBRATION', 'DEFAULT_CAL_INTERVAL', 'Default Calibration Interval (Months)', '12', 'INTEGER', 'Default Calibration Interval', 1, 0, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:27:00', '2026-07-15 04:27:00'),
('6e31214d-8005-11f1-aa6c-3cecef704050', 'EMAIL', 'SMTP_ENABLED', 'SMTP Enabled', 'false', 'BOOLEAN', 'Enable Email Notifications', 1, 0, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:27:00', '2026-07-15 04:27:00'),
('6e318205-8005-11f1-aa6c-3cecef704050', 'SECURITY', 'PASSWORD_EXPIRY_DAYS', 'Password Expiry Days', '90', 'INTEGER', 'Password Expiry Policy', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:27:00', '2026-07-15 04:27:00'),
('6e31dfe1-8005-11f1-aa6c-3cecef704050', 'BACKUP', 'AUTO_BACKUP', 'Automatic Backup', 'true', 'BOOLEAN', 'Enable Automatic Database Backup', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:27:00', '2026-07-15 04:27:00');

-- Seeding record block 119
INSERT INTO "tasks" ("id", "task_no", "entity_type", "entity_id", "title", "description", "priority", "status", "start_date", "due_date", "completed_date", "completion_percent", "created_by", "created_at", "updated_at") VALUES
('5fb1f7fe-801e-11f1-aa6c-3cecef704050', 'TASK-000001', 'SERVICE_JOB', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'Order Spare Parts', 'Order replacement PCB.', 'HIGH', 'OPEN', NULL, '2026-07-18', NULL, 0.00, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:25:33', '2026-07-15 07:25:33');

-- Seeding record block 120
INSERT INTO "task_assignments" ("id", "task_id", "assigned_to", "assigned_by", "assigned_at", "accepted", "accepted_at", "completed", "completed_at", "remarks") VALUES
('5fb4660d-801e-11f1-aa6c-3cecef704050', '5fb1f7fe-801e-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 12:55:33', 0, NULL, 0, NULL, NULL);

-- Seeding record block 121
INSERT INTO "task_attachments" ("id", "task_id", "file_storage_id", "uploaded_by", "uploaded_at", "remarks") VALUES
('5fb90c9d-801e-11f1-aa6c-3cecef704050', '5fb1f7fe-801e-11f1-aa6c-3cecef704050', 'e5e42cba-800c-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 12:55:33', NULL);

-- Seeding record block 122
INSERT INTO "task_comments" ("id", "task_id", "comment", "commented_by", "commented_at", "edited", "edited_at") VALUES
('5fb69a7c-801e-11f1-aa6c-3cecef704050', '5fb1f7fe-801e-11f1-aa6c-3cecef704050', 'Waiting for supplier quotation.', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 12:55:33', 0, NULL);

-- Seeding record block 123
INSERT INTO "territories" ("id", "company_id", "branch_id", "district_id", "territory_code", "territory_name", "description", "active", "created_at", "updated_at") VALUES
('063e53a6-7f75-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', '9aab2897-7f74-11f1-aa6c-3cecef704050', 'TER-COL', 'Colombo Territory', NULL, 1, '2026-07-14 11:13:19', '2026-07-14 11:13:19'),
('063f3566-7f75-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', '9aabfb4b-7f74-11f1-aa6c-3cecef704050', 'TER-GAM', 'Gampaha Territory', NULL, 1, '2026-07-14 11:13:19', '2026-07-14 11:13:19'),
('063fc14f-7f75-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', '9aac6bde-7f74-11f1-aa6c-3cecef704050', 'TER-KAL', 'Kalutara Territory', NULL, 1, '2026-07-14 11:13:19', '2026-07-14 11:13:19');

-- Seeding record block 124
INSERT INTO "territory_engineers" ("id", "territory_id", "user_id", "assignment_type", "start_date", "end_date", "active", "created_at", "updated_at") VALUES
('493a9893-7f75-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'PRIMARY', '2026-07-14', NULL, 1, '2026-07-14 11:15:11', '2026-07-14 11:15:11');

-- Seeding record block 125
INSERT INTO "users" ("id", "company_id", "branch_id", "employee_no", "username", "password_hash", "first_name", "last_name", "email", "mobile", "designation", "employment_status", "last_login", "active", "created_at", "updated_at") VALUES
('c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'EMP001', 'admin', '$2y$10$7h3pX6wXx2qH9A0bN5lQ6e5V7Q0xvYd8i0o4L1QwD8gN7uY8PzF3C', 'Cherub', 'Weeratunge', 'admin@avonservicepro.com', '0770000000', 'Senior Biomedical Engineer', 'ACTIVE', NULL, 1, '2026-07-14 08:55:26', '2026-07-14 08:55:26');

-- Seeding record block 126
INSERT INTO "user_engineer_tags" ("id", "user_id", "engineer_tag_id", "assigned_at", "active") VALUES
('9a9dc2f4-7f62-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '6d8550ec-7f62-11f1-aa6c-3cecef704050', '2026-07-14 09:01:27', 1);

-- Seeding record block 127
INSERT INTO "user_preferences" ("id", "user_id", "preference_key", "preference_value", "value_type", "created_at", "updated_at") VALUES
('22113f19-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'THEME', 'LIGHT', 'STRING', '2026-07-15 07:16:40', '2026-07-15 07:16:40'),
('22119298-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'LANGUAGE', 'EN', 'STRING', '2026-07-15 07:16:40', '2026-07-15 07:16:40'),
('2211eb83-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'DASHBOARD_LAYOUT', 'DEFAULT', 'STRING', '2026-07-15 07:16:40', '2026-07-15 07:16:40'),
('2212457e-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'ROWS_PER_PAGE', '25', 'INTEGER', '2026-07-15 07:16:40', '2026-07-15 07:16:40');

-- Seeding record block 128
INSERT INTO "user_roles" ("id", "user_id", "role_id", "assigned_at", "active") VALUES
('15142d80-7f62-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', '2026-07-14 08:57:43', 1);

-- Seeding record block 129
INSERT INTO "vendors" ("id", "vendor_code", "supplier_id", "company_id", "vendor_name", "vendor_type", "registration_no", "tax_no", "contact_person", "designation", "phone", "mobile", "email", "website", "payment_terms", "currency", "credit_limit", "lead_time_days", "performance_rating", "active", "remarks", "created_at", "updated_at") VALUES
('0583552e-7fe5-11f1-aa6c-3cecef704050', 'VEN0001', 'fd7c87de-7fdf-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'AVON PHARMO CHEM (PVT) LTD', 'AUTHORIZED', NULL, NULL, 'Stores Department', NULL, '0112696911', NULL, 'stores@avonpclk.com', 'https://www.avonpclk.com', '30 DAYS', 'LKR', 0.00, 30, 4.80, 1, NULL, '2026-07-15 00:35:00', '2026-07-15 00:35:00'),
('058429ab-7fe5-11f1-aa6c-3cecef704050', 'VEN0002', 'fd7d28fe-7fdf-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Abbott Laboratories', 'MANUFACTURER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'https://www.abbott.com', NULL, 'USD', 0.00, 90, 4.95, 1, NULL, '2026-07-15 00:35:00', '2026-07-15 00:35:00'),
('0584b4ac-7fe5-11f1-aa6c-3cecef704050', 'VEN0003', 'fd7e51ba-7fdf-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Eppendorf SE', 'MANUFACTURER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'https://www.eppendorf.com', NULL, 'EUR', 0.00, 60, 4.90, 1, NULL, '2026-07-15 00:35:00', '2026-07-15 00:35:00');

-- Seeding record block 130
INSERT INTO "vendor_performance" ("id", "vendor_id", "evaluation_period_from", "evaluation_period_to", "purchase_orders", "total_purchase_value", "on_time_delivery_percent", "quality_score", "price_score", "service_score", "communication_score", "documentation_score", "overall_score", "rating", "evaluated_by", "evaluation_date", "remarks", "created_at", "updated_at") VALUES
('868dceaf-7fe5-11f1-aa6c-3cecef704050', '0583552e-7fe5-11f1-aa6c-3cecef704050', '2026-01-01', '2026-06-30', 12, 1250000.00, 98.00, 96.00, 92.00, 95.00, 97.00, 94.00, 95.33, 'EXCELLENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15', 'Excellent supplier performance.', '2026-07-15 00:38:37', '2026-07-15 00:38:37'),
('868e9e62-7fe5-11f1-aa6c-3cecef704050', '058429ab-7fe5-11f1-aa6c-3cecef704050', '2026-01-01', '2026-06-30', 8, 2850000.00, 95.00, 98.00, 90.00, 94.00, 95.00, 96.00, 94.67, 'VERY_GOOD', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15', 'Consistently high quality products.', '2026-07-15 00:38:37', '2026-07-15 00:38:37');

-- Seeding record block 131
INSERT INTO "warranty_activations" ("id", "instrument_id", "document_review_id", "activated_by", "warranty_start_date", "warranty_end_date", "warranty_period_months", "service_interval_months", "activation_status", "activation_date", "remarks", "created_at", "updated_at") VALUES
('68943ef6-7f7f-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '9ddda42d-7f7e-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14', '2027-07-14', 12, 12, 'ACTIVATED', '2026-07-14 17:57:39', 'Warranty activated after documentation approval.', '2026-07-14 12:27:39', '2026-07-14 12:27:39');

-- Seeding record block 132
INSERT INTO "webhook_logs" ("id", "webhook_id", "execution_no", "event_name", "request_url", "http_method", "request_headers", "request_body", "response_code", "response_body", "execution_time_ms", "retry_attempt", "status", "error_message", "executed_at", "created_at") VALUES
('f14e015a-801c-11f1-aa6c-3cecef704050', '1e85251e-801c-11f1-aa6c-3cecef704050', 'WHLOG-000001', 'SERVICE_JOB_COMPLETED', 'https://api.example.com/webhooks/service-job', 'POST', NULL, NULL, 200, NULL, 154, 0, 'SUCCESS', NULL, '2026-07-15 12:45:18', '2026-07-15 07:15:18'),
('f14e795c-801c-11f1-aa6c-3cecef704050', '1e8595d9-801c-11f1-aa6c-3cecef704050', 'WHLOG-000002', 'PM_COMPLETED', 'https://api.example.com/webhooks/pm', 'POST', NULL, NULL, 500, NULL, 502, 0, 'FAILED', 'Remote server unavailable.', '2026-07-15 12:45:18', '2026-07-15 07:15:18');

-- Seeding record block 133
INSERT INTO "working_calendar" ("id", "calendar_code", "company_id", "branch_id", "calendar_name", "weekday", "working_day", "start_time", "end_time", "lunch_start", "lunch_end", "overtime_allowed", "active", "created_by", "created_at", "updated_at") VALUES
('aef018ad-8026-11f1-aa6c-3cecef704050', 'CAL-Monday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'MONDAY', 1, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef01bb0-8026-11f1-aa6c-3cecef704050', 'CAL-Tuesday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'TUESDAY', 1, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef01ce3-8026-11f1-aa6c-3cecef704050', 'CAL-Wednesday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'WEDNESDAY', 1, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef01de1-8026-11f1-aa6c-3cecef704050', 'CAL-Thursday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'THURSDAY', 1, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef01f6f-8026-11f1-aa6c-3cecef704050', 'CAL-Friday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'FRIDAY', 1, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef0209a-8026-11f1-aa6c-3cecef704050', 'CAL-Saturday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'SATURDAY', 0, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef02159-8026-11f1-aa6c-3cecef704050', 'CAL-Sunday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'SUNDAY', 0, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02');

-- Seeding record block 134
INSERT INTO "workshop_jobs" ("id", "service_job_id", "workshop_job_no", "instrument_id", "customer_id", "received_date", "received_by", "received_condition", "fault_description", "diagnosis", "repair_required", "repair_status", "priority", "estimated_completion_date", "actual_completion_date", "dispatched_date", "delivered_date", "workshop_notes", "created_at", "updated_at") VALUES
('5949bb48-7f81-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'WS-2026-000001', '658854ed-7f7a-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '2026-07-14 18:11:32', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Instrument received with minor physical scratches.', 'Temperature sensor failure.', NULL, 1, 'RECEIVED', 'HIGH', NULL, NULL, NULL, NULL, NULL, '2026-07-14 12:41:32', '2026-07-14 12:41:32');

-- Seeding record block 135
INSERT INTO "workshop_quality_checks" ("id", "workshop_job_id", "qa_engineer_id", "inspection_date", "functional_test", "safety_test", "calibration_verified", "cosmetic_check", "accessories_verified", "documentation_verified", "customer_data_verified", "overall_result", "failure_reason", "corrective_action", "approved_for_release", "approval_date", "remarks", "created_at", "updated_at") VALUES
('fd3fd345-7fdd-11f1-aa6c-3cecef704050', '5949bb48-7f81-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:14:40', 1, 1, 1, 1, 1, 1, 1, 'PASS', NULL, NULL, 1, '2026-07-15 05:14:40', 'Workshop quality inspection completed successfully.', '2026-07-14 23:44:40', '2026-07-14 23:44:40');

-- Seeding record block 136
INSERT INTO "workshop_repair_log" ("id", "workshop_job_id", "activity_no", "activity_date", "activity_type", "performed_by", "work_description", "parts_used", "labour_hours", "status_after_activity", "remarks", "created_at", "updated_at") VALUES
('8dd8819a-7f81-11f1-aa6c-3cecef704050', '5949bb48-7f81-11f1-aa6c-3cecef704050', 1, '2026-07-14 18:13:00', 'RECEIVED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Instrument received and booked into workshop.', 0, 0.25, 'RECEIVED', NULL, '2026-07-14 12:43:00', '2026-07-14 12:43:00'),
('8dd955dc-7f81-11f1-aa6c-3cecef704050', '5949bb48-7f81-11f1-aa6c-3cecef704050', 2, '2026-07-14 18:13:00', 'DIAGNOSIS', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Temperature sensor diagnosed as faulty.', 0, 1.50, 'WAITING_PARTS', NULL, '2026-07-14 12:43:00', '2026-07-14 12:43:00'),
('8dd9d2cd-7f81-11f1-aa6c-3cecef704050', '5949bb48-7f81-11f1-aa6c-3cecef704050', 3, '2026-07-14 18:13:00', 'PART_REPLACEMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Temperature sensor replaced.', 1, 1.25, 'UNDER_REPAIR', NULL, '2026-07-14 12:43:00', '2026-07-14 12:43:00');

COMMIT;

-- 2. Re-enable all triggers and foreign key constraints
SET session_replication_role = 'origin';
