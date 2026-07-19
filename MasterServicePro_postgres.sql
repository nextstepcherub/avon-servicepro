-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 16, 2026 at 09:15 PM
-- Server version: 10.11.18-MariaDB
-- PHP Version: 8.4.22

-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- START TRANSACTION;
-- SET time_zone = "+00:00";

--
-- Database: "aromacey_avonServicePro"
--

-- --------------------------------------------------------

--
-- Table structure for table "activity_log"
--

CREATE TABLE "activity_log" (
  "id" UUID NOT NULL,
  "activity_no" varchar(50) NOT NULL,
  "company_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "module_code" varchar(50) NOT NULL,
  "entity_type" varchar(100) DEFAULT NULL,
  "entity_id" UUID DEFAULT NULL,
  "activity_type" VARCHAR(100) CHECK ("activity_type" IN ('LOGIN','LOGOUT','CREATE','UPDATE','DELETE','VIEW','SEARCH','EXPORT','IMPORT','DOWNLOAD','UPLOAD','PRINT','APPROVE','REJECT','ASSIGN','COMPLETE','OTHER')) NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text DEFAULT NULL,
  "ip_address" varchar(45) DEFAULT NULL,
  "device_name" varchar(255) DEFAULT NULL,
  "browser" varchar(150) DEFAULT NULL,
  "operating_system" varchar(150) DEFAULT NULL,
  "session_id" varchar(255) DEFAULT NULL,
  "activity_time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "successful" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "activity_log"
--

INSERT INTO "activity_log" ("id", "activity_no", "company_id", "user_id", "module_code", "entity_type", "entity_id", "activity_type", "title", "description", "ip_address", "device_name", "browser", "operating_system", "session_id", "activity_time", "successful", "created_at") VALUES
('3e94c916-800e-11f1-aa6c-3cecef704050', 'ACT-2026-000001', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'AUTH', 'users', NULL, 'LOGIN', 'User Login', 'Administrator logged into Avon ServicePro.', '127.0.0.1', 'Desktop PC', 'Google Chrome', 'Windows 11', '3e94c934-800e-11f1-aa6c-3cecef704050', '2026-07-15 11:00:06', 1, '2026-07-15 05:30:06'),
('3e957ac2-800e-11f1-aa6c-3cecef704050', 'ACT-2026-000002', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'SERVICE', 'service_jobs', NULL, 'UPDATE', 'Service Job Updated', 'Updated service job details.', '127.0.0.1', 'Desktop PC', 'Google Chrome', 'Windows 11', '3e957ad7-800e-11f1-aa6c-3cecef704050', '2026-07-15 11:00:06', 1, '2026-07-15 05:30:06'),
('3e9610c3-800e-11f1-aa6c-3cecef704050', 'ACT-2026-000003', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'REPORTS', 'reports', NULL, 'EXPORT', 'Report Exported', 'Exported Service Job Summary Report.', '127.0.0.1', 'Desktop PC', 'Google Chrome', 'Windows 11', '3e9610e6-800e-11f1-aa6c-3cecef704050', '2026-07-15 11:00:06', 1, '2026-07-15 05:30:06');

-- --------------------------------------------------------

--
-- Table structure for table "amc_contracts"
--

CREATE TABLE "amc_contracts" (
  "id" UUID NOT NULL,
  "contract_no" varchar(50) NOT NULL,
  "customer_id" UUID NOT NULL,
  "instrument_id" UUID NOT NULL,
  "contract_type" VARCHAR(100) CHECK ("contract_type" IN ('AMC','CMC','WARRANTY_EXTENSION','SERVICE_AGREEMENT')) NOT NULL DEFAULT 'AMC',
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "duration_months" integer NOT NULL,
  "visits_per_year" integer NOT NULL DEFAULT 2,
  "response_time_hours" integer DEFAULT 24,
  "contract_value" decimal(18,2) NOT NULL,
  "currency" varchar(10) DEFAULT 'LKR',
  "assigned_engineer_id" UUID DEFAULT NULL,
  "contract_status" VARCHAR(100) CHECK ("contract_status" IN ('DRAFT','ACTIVE','EXPIRED','TERMINATED','RENEWED')) NOT NULL DEFAULT 'ACTIVE',
  "auto_renew" smallint NOT NULL DEFAULT 0,
  "signed_date" date DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_by" UUID NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "amc_contracts"
--

INSERT INTO "amc_contracts" ("id", "contract_no", "customer_id", "instrument_id", "contract_type", "start_date", "end_date", "duration_months", "visits_per_year", "response_time_hours", "contract_value", "currency", "assigned_engineer_id", "contract_status", "auto_renew", "signed_date", "remarks", "created_by", "created_at", "updated_at") VALUES
('15de6bc0-7fee-11f1-aa6c-3cecef704050', 'AMC-2026-000001', '08d2bede-7f76-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'AMC', '2026-07-15', '2027-07-15', 12, 4, 24, 250000.00, 'LKR', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'ACTIVE', 1, '2026-07-15', 'Annual Maintenance Contract', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 01:39:53', '2026-07-15 01:39:53');

-- --------------------------------------------------------

--
-- Table structure for table "amc_visits"
--

CREATE TABLE "amc_visits" (
  "id" UUID NOT NULL,
  "amc_contract_id" UUID NOT NULL,
  "visit_no" integer NOT NULL,
  "planned_date" date NOT NULL,
  "scheduled_date" date DEFAULT NULL,
  "completed_date" date DEFAULT NULL,
  "service_job_id" UUID DEFAULT NULL,
  "engineer_id" UUID DEFAULT NULL,
  "visit_type" VARCHAR(100) CHECK ("visit_type" IN ('PREVENTIVE_MAINTENANCE','BREAKDOWN','INSPECTION','CALIBRATION','EMERGENCY','FOLLOW_UP')) NOT NULL DEFAULT 'PREVENTIVE_MAINTENANCE',
  "visit_status" VARCHAR(100) CHECK ("visit_status" IN ('PLANNED','SCHEDULED','IN_PROGRESS','COMPLETED','MISSED','CANCELLED')) NOT NULL DEFAULT 'PLANNED',
  "customer_contact" varchar(150) DEFAULT NULL,
  "customer_signature" smallint NOT NULL DEFAULT 0,
  "report_submitted" smallint NOT NULL DEFAULT 0,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "amc_visits"
--

INSERT INTO "amc_visits" ("id", "amc_contract_id", "visit_no", "planned_date", "scheduled_date", "completed_date", "service_job_id", "engineer_id", "visit_type", "visit_status", "customer_contact", "customer_signature", "report_submitted", "remarks", "created_at", "updated_at") VALUES
('5a4e3486-7fee-11f1-aa6c-3cecef704050', '15de6bc0-7fee-11f1-aa6c-3cecef704050', 1, '2026-10-15', '2026-10-15', '2026-10-15', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'PREVENTIVE_MAINTENANCE', 'COMPLETED', 'Chief Medical Laboratory Technologist', 1, 1, 'Quarterly Preventive Maintenance Visit', '2026-07-15 01:41:48', '2026-07-15 01:41:48');

-- --------------------------------------------------------

--
-- Table structure for table "api_keys"
--

CREATE TABLE "api_keys" (
  "id" UUID NOT NULL,
  "api_key_code" varchar(50) NOT NULL,
  "application_name" varchar(150) NOT NULL,
  "api_key" varchar(255) NOT NULL,
  "api_secret" varchar(255) DEFAULT NULL,
  "company_id" UUID NOT NULL,
  "owner_user_id" UUID NOT NULL,
  "environment" VARCHAR(100) CHECK ("environment" IN ('DEVELOPMENT','TEST','STAGING','PRODUCTION')) NOT NULL DEFAULT 'DEVELOPMENT',
  "permissions" jsonb DEFAULT NULL,
  "allowed_ips" jsonb DEFAULT NULL,
  "rate_limit_per_minute" integer NOT NULL DEFAULT 60,
  "expires_at" timestamp DEFAULT NULL,
  "last_used_at" timestamp DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "api_keys"
--

INSERT INTO "api_keys" ("id", "api_key_code", "application_name", "api_key", "api_secret", "company_id", "owner_user_id", "environment", "permissions", "allowed_ips", "rate_limit_per_minute", "expires_at", "last_used_at", "active", "remarks", "created_at", "updated_at") VALUES
('be46ec5b-8009-11f1-aa6c-3cecef704050', 'API-000001', 'Avon ServicePro Web', '1ea0c56d5cc9f140ae3ee0bde34fc84b19d9c57f1f7b11f57b073d7bacc401a8', '09eb26afd5caa86b425acfd730e39f500611649cdd1c986202282ba25f1631d3abe900b8bf9b9afb3abcde278c4f1430f6651f3d4a8aee98d883ea0680b6f4e3', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'DEVELOPMENT', '["customers", "instruments", "service_jobs", "pm", "calibration", "inventory"]', '["127.0.0.1", "::1"]', 500, '2028-07-15 10:27:52', NULL, 1, 'Default Development API Key', '2026-07-15 04:57:52', '2026-07-15 04:57:52');

-- --------------------------------------------------------

--
-- Table structure for table "api_logs"
--

CREATE TABLE "api_logs" (
  "id" UUID NOT NULL,
  "log_no" varchar(50) NOT NULL,
  "api_key_id" UUID NOT NULL,
  "user_id" UUID DEFAULT NULL,
  "request_time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "response_time" timestamp DEFAULT NULL,
  "endpoint" varchar(255) NOT NULL,
  "http_method" VARCHAR(100) CHECK ("http_method" IN ('GET','POST','PUT','PATCH','DELETE')) NOT NULL,
  "request_headers" jsonb DEFAULT NULL,
  "request_body" jsonb DEFAULT NULL,
  "response_code" SMALLINT NOT NULL,
  "response_body" jsonb DEFAULT NULL,
  "ip_address" varchar(45) DEFAULT NULL,
  "user_agent" varchar(500) DEFAULT NULL,
  "execution_time_ms" integer DEFAULT NULL,
  "request_size_bytes" integer DEFAULT NULL,
  "response_size_bytes" integer DEFAULT NULL,
  "success" smallint NOT NULL DEFAULT 1,
  "error_message" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "api_logs"
--

INSERT INTO "api_logs" ("id", "log_no", "api_key_id", "user_id", "request_time", "response_time", "endpoint", "http_method", "request_headers", "request_body", "response_code", "response_body", "ip_address", "user_agent", "execution_time_ms", "request_size_bytes", "response_size_bytes", "success", "error_message", "created_at") VALUES
('3262bf6a-800a-11f1-aa6c-3cecef704050', 'API-LOG-000001', 'be46ec5b-8009-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:31:07', '2026-07-15 10:31:07', '/api/service-jobs', 'GET', '{"Content-Type": "application/json"}', '{}', 200, '{"status": "success"}', '127.0.0.1', 'Mozilla/5.0', 145, 512, 4096, 1, NULL, '2026-07-15 05:01:07'),
('3263826f-800a-11f1-aa6c-3cecef704050', 'API-LOG-000002', 'be46ec5b-8009-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:31:07', '2026-07-15 10:31:07', '/api/customers', 'POST', '{"Content-Type": "application/json"}', '{"customer": "ABC Laboratory"}', 201, '{"status": "created"}', '127.0.0.1', 'Mozilla/5.0', 238, 1024, 512, 1, NULL, '2026-07-15 05:01:07'),
('3263f75b-800a-11f1-aa6c-3cecef704050', 'API-LOG-000003', 'be46ec5b-8009-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:31:07', '2026-07-15 10:31:07', '/api/instruments', 'POST', '{"Content-Type": "application/json"}', '{}', 400, '{"status": "failed"}', '127.0.0.1', 'Mozilla/5.0', 112, 256, 256, 0, 'Validation failed.', '2026-07-15 05:01:07');

-- --------------------------------------------------------

--
-- Table structure for table "api_webhooks"
--

CREATE TABLE "api_webhooks" (
  "id" UUID NOT NULL,
  "webhook_code" varchar(50) NOT NULL,
  "webhook_name" varchar(150) NOT NULL,
  "event_name" varchar(100) NOT NULL,
  "target_url" varchar(500) NOT NULL,
  "http_method" VARCHAR(100) CHECK ("http_method" IN ('POST','PUT','PATCH')) NOT NULL DEFAULT 'POST',
  "authentication_type" VARCHAR(100) CHECK ("authentication_type" IN ('NONE','API_KEY','BEARER','BASIC')) NOT NULL DEFAULT 'NONE',
  "secret_key" varchar(255) DEFAULT NULL,
  "request_headers" jsonb DEFAULT NULL,
  "payload_template" jsonb DEFAULT NULL,
  "retry_count" integer NOT NULL DEFAULT 3,
  "timeout_seconds" integer NOT NULL DEFAULT 30,
  "active" smallint NOT NULL DEFAULT 1,
  "created_by" UUID DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "api_webhooks"
--

INSERT INTO "api_webhooks" ("id", "webhook_code", "webhook_name", "event_name", "target_url", "http_method", "authentication_type", "secret_key", "request_headers", "payload_template", "retry_count", "timeout_seconds", "active", "created_by", "remarks", "created_at", "updated_at") VALUES
('1e85251e-801c-11f1-aa6c-3cecef704050', 'WEB001', 'Job Completed', 'SERVICE_JOB_COMPLETED', 'https://api.example.com/webhooks/service-job', 'POST', 'BEARER', NULL, NULL, NULL, 3, 30, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 07:09:25', '2026-07-15 07:09:25'),
('1e8595d9-801c-11f1-aa6c-3cecef704050', 'WEB002', 'PM Completed', 'PM_COMPLETED', 'https://api.example.com/webhooks/pm', 'POST', 'API_KEY', NULL, NULL, NULL, 3, 30, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 07:09:25', '2026-07-15 07:09:25');

-- --------------------------------------------------------

--
-- Table structure for table "application_configuration"
--

CREATE TABLE "application_configuration" (
  "id" UUID NOT NULL,
  "config_code" varchar(50) NOT NULL,
  "config_group" VARCHAR(100) CHECK ("config_group" IN ('APPLICATION','COMPANY','SMTP','STORAGE','SECURITY','JWT','API','BACKUP','BRANDING','UI','FEATURES','REPORTS')) NOT NULL,
  "config_key" varchar(100) NOT NULL,
  "config_name" varchar(200) NOT NULL,
  "config_value" text DEFAULT NULL,
  "value_type" VARCHAR(100) CHECK ("value_type" IN ('STRING','INTEGER','DECIMAL','BOOLEAN','JSON','PASSWORD')) NOT NULL DEFAULT 'STRING',
  "encrypted" smallint NOT NULL DEFAULT 0,
  "editable" smallint NOT NULL DEFAULT 1,
  "restart_required" smallint NOT NULL DEFAULT 0,
  "active" smallint NOT NULL DEFAULT 1,
  "updated_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "application_configuration"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "application_integrations"
--

CREATE TABLE "application_integrations" (
  "id" UUID NOT NULL,
  "integration_code" varchar(50) NOT NULL,
  "integration_name" varchar(150) NOT NULL,
  "integration_type" VARCHAR(100) CHECK ("integration_type" IN ('REST_API','GOOGLE_DRIVE','ONEDRIVE','DROPBOX','FTP','SFTP','SMTP','LDAP','AZURE_AD','CUSTOM')) NOT NULL,
  "base_url" varchar(500) DEFAULT NULL,
  "api_key" varchar(255) DEFAULT NULL,
  "api_secret" text DEFAULT NULL,
  "username" varchar(150) DEFAULT NULL,
  "password" text DEFAULT NULL,
  "authentication_type" VARCHAR(100) CHECK ("authentication_type" IN ('NONE','API_KEY','BASIC','BEARER','OAUTH2')) NOT NULL DEFAULT 'NONE',
  "timeout_seconds" integer NOT NULL DEFAULT 30,
  "active" smallint NOT NULL DEFAULT 1,
  "last_connected_at" timestamp DEFAULT NULL,
  "last_status" VARCHAR(100) CHECK ("last_status" IN ('CONNECTED','FAILED','DISCONNECTED','NEVER_CONNECTED')) NOT NULL DEFAULT 'NEVER_CONNECTED',
  "created_by" UUID DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "application_integrations"
--

INSERT INTO "application_integrations" ("id", "integration_code", "integration_name", "integration_type", "base_url", "api_key", "api_secret", "username", "password", "authentication_type", "timeout_seconds", "active", "last_connected_at", "last_status", "created_by", "remarks", "created_at", "updated_at") VALUES
('fb9abf19-801b-11f1-aa6c-3cecef704050', 'INT001', 'Google Drive', 'GOOGLE_DRIVE', 'https://www.googleapis.com', NULL, NULL, NULL, NULL, 'OAUTH2', 30, 1, NULL, 'NEVER_CONNECTED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 07:08:26', '2026-07-15 07:08:26'),
('fb9b1e64-801b-11f1-aa6c-3cecef704050', 'INT002', 'SMTP Mail', 'SMTP', 'mail.avonpclk.com', NULL, NULL, NULL, NULL, 'BASIC', 30, 1, NULL, 'NEVER_CONNECTED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 07:08:26', '2026-07-15 07:08:26');

-- --------------------------------------------------------

--
-- Table structure for table "application_logs"
--

CREATE TABLE "application_logs" (
  "id" UUID NOT NULL,
  "log_no" varchar(50) NOT NULL,
  "log_time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "environment" VARCHAR(100) CHECK ("environment" IN ('DEVELOPMENT','TEST','STAGING','PRODUCTION')) NOT NULL DEFAULT 'PRODUCTION',
  "log_level" VARCHAR(100) CHECK ("log_level" IN ('TRACE','DEBUG','INFO','WARNING','ERROR','CRITICAL','FATAL')) NOT NULL,
  "application_name" varchar(100) NOT NULL,
  "module_name" varchar(100) DEFAULT NULL,
  "class_name" varchar(255) DEFAULT NULL,
  "method_name" varchar(255) DEFAULT NULL,
  "exception_type" varchar(255) DEFAULT NULL,
  "error_code" varchar(100) DEFAULT NULL,
  "message" text NOT NULL,
  "stack_trace" text DEFAULT NULL,
  "request_url" varchar(500) DEFAULT NULL,
  "request_method" varchar(20) DEFAULT NULL,
  "request_body" text DEFAULT NULL,
  "response_code" SMALLINT DEFAULT NULL,
  "ip_address" varchar(45) DEFAULT NULL,
  "user_agent" varchar(500) DEFAULT NULL,
  "session_id" varchar(255) DEFAULT NULL,
  "user_id" UUID DEFAULT NULL,
  "company_id" UUID DEFAULT NULL,
  "resolved" smallint NOT NULL DEFAULT 0,
  "resolved_by" UUID DEFAULT NULL,
  "resolved_at" timestamp DEFAULT NULL,
  "resolution_notes" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "application_logs"
--

INSERT INTO "application_logs" ("id", "log_no", "log_time", "environment", "log_level", "application_name", "module_name", "class_name", "method_name", "exception_type", "error_code", "message", "stack_trace", "request_url", "request_method", "request_body", "response_code", "ip_address", "user_agent", "session_id", "user_id", "company_id", "resolved", "resolved_by", "resolved_at", "resolution_notes", "created_at") VALUES
('fdaeb831-8012-11f1-aa6c-3cecef704050', 'APPLOG-2026-000001', '2026-07-15 11:34:04', 'PRODUCTION', 'INFO', 'Avon ServicePro', 'Authentication', 'AuthController', 'login', NULL, NULL, 'User login successful.', NULL, NULL, NULL, NULL, 200, '127.0.0.1', 'Google Chrome', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 0, NULL, NULL, NULL, '2026-07-15 06:04:04'),
('fdaf85ec-8012-11f1-aa6c-3cecef704050', 'APPLOG-2026-000002', '2026-07-15 11:34:04', 'PRODUCTION', 'ERROR', 'Avon ServicePro', 'Inventory', 'InventoryService', 'updateStock', 'SQLException', 'INV-500', 'Inventory update failed.', 'Stack trace...', '/api/inventory', 'PUT', NULL, 500, '127.0.0.1', 'Google Chrome', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 0, NULL, NULL, NULL, '2026-07-15 06:04:04'),
('fdb0a83c-8012-11f1-aa6c-3cecef704050', 'APPLOG-2026-000003', '2026-07-15 11:34:04', 'PRODUCTION', 'WARNING', 'Avon ServicePro', 'Service', 'ServiceScheduler', 'assignEngineer', NULL, NULL, 'Engineer assignment delayed due to workload.', NULL, NULL, NULL, NULL, 200, '127.0.0.1', 'Google Chrome', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 11:34:04', 'Engineer manually assigned.', '2026-07-15 06:04:04');

-- --------------------------------------------------------

--
-- Table structure for table "audit_logs"
--

CREATE TABLE "audit_logs" (
  "id" UUID NOT NULL,
  "audit_no" varchar(50) NOT NULL,
  "event_time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "user_id" UUID DEFAULT NULL,
  "company_id" UUID DEFAULT NULL,
  "module" varchar(100) NOT NULL,
  "entity_name" varchar(100) NOT NULL,
  "entity_id" UUID DEFAULT NULL,
  "action" VARCHAR(100) CHECK ("action" IN ('LOGIN','LOGOUT','CREATE','UPDATE','DELETE','VIEW','PRINT','EXPORT','IMPORT','APPROVE','REJECT','UPLOAD','DOWNLOAD','RESET_PASSWORD','OTHER')) NOT NULL,
  "description" text DEFAULT NULL,
  "old_values" jsonb DEFAULT NULL,
  "new_values" jsonb DEFAULT NULL,
  "ip_address" varchar(45) DEFAULT NULL,
  "device_name" varchar(255) DEFAULT NULL,
  "browser" varchar(255) DEFAULT NULL,
  "operating_system" varchar(255) DEFAULT NULL,
  "session_id" varchar(255) DEFAULT NULL,
  "request_method" varchar(20) DEFAULT NULL,
  "request_url" varchar(500) DEFAULT NULL,
  "http_status" SMALLINT DEFAULT NULL,
  "execution_time_ms" integer DEFAULT NULL,
  "success" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "audit_logs"
--

INSERT INTO "audit_logs" ("id", "audit_no", "event_time", "user_id", "company_id", "module", "entity_name", "entity_id", "action", "description", "old_values", "new_values", "ip_address", "device_name", "browser", "operating_system", "session_id", "request_method", "request_url", "http_status", "execution_time_ms", "success", "remarks", "created_at") VALUES
('06652d7e-8005-11f1-aa6c-3cecef704050', 'AUD-2026-000001', '2026-07-15 09:54:06', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Authentication', 'users', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'LOGIN', 'Administrator logged into Avon ServicePro.', NULL, NULL, '127.0.0.1', 'Desktop PC', 'Google Chrome', 'Windows 11', '06652da1-8005-11f1-aa6c-3cecef704050', 'POST', '/api/auth/login', 200, 185, 1, NULL, '2026-07-15 04:24:06'),
('0665ea5a-8005-11f1-aa6c-3cecef704050', 'AUD-2026-000002', '2026-07-15 09:54:06', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Instrument Registry', 'instruments', NULL, 'UPDATE', 'Instrument information updated.', NULL, NULL, '127.0.0.1', NULL, 'Google Chrome', 'Windows 11', NULL, 'PUT', '/api/instruments', 200, 92, 1, NULL, '2026-07-15 04:24:06'),
('06665d74-8005-11f1-aa6c-3cecef704050', 'AUD-2026-000003', '2026-07-15 09:54:06', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Reports', 'reports', NULL, 'EXPORT', 'Service Report exported as PDF.', NULL, NULL, '127.0.0.1', NULL, 'Google Chrome', 'Windows 11', NULL, 'GET', '/api/reports/export', 200, 315, 1, NULL, '2026-07-15 04:24:06');

-- --------------------------------------------------------

--
-- Table structure for table "background_jobs"
--

CREATE TABLE "background_jobs" (
  "id" UUID NOT NULL,
  "job_no" varchar(50) NOT NULL,
  "job_name" varchar(200) NOT NULL,
  "job_type" VARCHAR(100) CHECK ("job_type" IN ('EMAIL','SMS','WHATSAPP','NOTIFICATION','REPORT','BACKUP','SYNC','IMPORT','EXPORT','PM_GENERATION','CALIBRATION_GENERATION','DATA_CLEANUP','OTHER')) NOT NULL,
  "queue_name" varchar(50) NOT NULL DEFAULT 'default',
  "priority" VARCHAR(100) CHECK ("priority" IN ('LOW','NORMAL','HIGH','CRITICAL')) NOT NULL DEFAULT 'NORMAL',
  "payload" jsonb DEFAULT NULL,
  "scheduled_at" timestamp DEFAULT NULL,
  "started_at" timestamp DEFAULT NULL,
  "completed_at" timestamp DEFAULT NULL,
  "attempts" integer NOT NULL DEFAULT 0,
  "max_attempts" integer NOT NULL DEFAULT 3,
  "status" VARCHAR(100) CHECK ("status" IN ('QUEUED','RUNNING','COMPLETED','FAILED','CANCELLED')) NOT NULL DEFAULT 'QUEUED',
  "progress_percent" decimal(5,2) DEFAULT 0.00,
  "execution_time_ms" integer DEFAULT NULL,
  "worker_name" varchar(100) DEFAULT NULL,
  "error_message" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "background_jobs"
--

INSERT INTO "background_jobs" ("id", "job_no", "job_name", "job_type", "queue_name", "priority", "payload", "scheduled_at", "started_at", "completed_at", "attempts", "max_attempts", "status", "progress_percent", "execution_time_ms", "worker_name", "error_message", "created_by", "created_at", "updated_at") VALUES
('8f037117-800a-11f1-aa6c-3cecef704050', 'BG-2026-000001', 'Daily Database Backup', 'BACKUP', 'system', 'CRITICAL', '{"backup": "database"}', '2026-07-15 11:33:43', NULL, NULL, 0, 3, 'QUEUED', 0.00, NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:03:43', '2026-07-15 05:03:43'),
('8f045a7c-800a-11f1-aa6c-3cecef704050', 'BG-2026-000002', 'Generate PM Schedules', 'PM_GENERATION', 'scheduler', 'HIGH', '{"months": 6}', '2026-07-15 10:33:43', NULL, NULL, 0, 3, 'QUEUED', 0.00, NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:03:43', '2026-07-15 05:03:43'),
('8f04b875-800a-11f1-aa6c-3cecef704050', 'BG-2026-000003', 'Calibration Schedule Generator', 'CALIBRATION_GENERATION', 'scheduler', 'HIGH', '{"months": 12}', '2026-07-15 10:33:43', NULL, NULL, 0, 3, 'QUEUED', 0.00, NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:03:43', '2026-07-15 05:03:43'),
('8f05112a-800a-11f1-aa6c-3cecef704050', 'BG-2026-000004', 'Notification Queue', 'NOTIFICATION', 'notifications', 'NORMAL', '{"channel": "EMAIL"}', '2026-07-15 10:33:43', NULL, NULL, 0, 3, 'QUEUED', 0.00, NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:03:43', '2026-07-15 05:03:43');

-- --------------------------------------------------------

--
-- Table structure for table "barcodes"
--

CREATE TABLE "barcodes" (
  "id" UUID NOT NULL,
  "barcode_no" varchar(50) NOT NULL,
  "entity_type" VARCHAR(100) CHECK ("entity_type" IN ('INSTRUMENT','SPARE_PART','CUSTOMER')) NOT NULL,
  "entity_id" UUID NOT NULL,
  "barcode_type" VARCHAR(100) CHECK ("barcode_type" IN ('CODE39','CODE128','EAN13','QR')) NOT NULL DEFAULT 'CODE128',
  "barcode_value" varchar(255) NOT NULL,
  "active" smallint DEFAULT 1,
  "generated_by" UUID DEFAULT NULL,
  "generated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "barcodes"
--

INSERT INTO "barcodes" ("id", "barcode_no", "entity_type", "entity_id", "barcode_type", "barcode_value", "active", "generated_by", "generated_at", "remarks", "created_at", "updated_at") VALUES
('1d049e5f-8023-11f1-aa6c-3cecef704050', 'BAR-000001', 'INSTRUMENT', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'CODE128', 'AST000001', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 13:29:29', NULL, '2026-07-15 07:59:29', '2026-07-15 07:59:29');

-- --------------------------------------------------------

--
-- Table structure for table "branches"
--

CREATE TABLE "branches" (
  "id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "branch_code" varchar(20) NOT NULL,
  "branch_name" varchar(150) NOT NULL,
  "address" varchar(255) DEFAULT NULL,
  "city" varchar(100) DEFAULT NULL,
  "phone" varchar(30) DEFAULT NULL,
  "email" varchar(150) DEFAULT NULL,
  "manager_name" varchar(150) DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "branches"
--

INSERT INTO "branches" ("id", "company_id", "branch_code", "branch_name", "address", "city", "phone", "email", "manager_name", "active", "created_at", "updated_at") VALUES
('73252b02-7f5e-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'HO', 'Head Office', NULL, 'Colombo', NULL, NULL, 'Cherub Weeratunge', 1, '2026-07-14 08:31:43', '2026-07-14 08:31:43');

-- --------------------------------------------------------

--
-- Table structure for table "brands"
--

CREATE TABLE "brands" (
  "id" UUID NOT NULL,
  "manufacturer_id" UUID NOT NULL,
  "brand_code" varchar(30) NOT NULL,
  "brand_name" varchar(150) NOT NULL,
  "website" varchar(255) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "brands"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "calibration_certificates"
--

CREATE TABLE "calibration_certificates" (
  "id" UUID NOT NULL,
  "calibration_execution_id" UUID NOT NULL,
  "certificate_no" varchar(100) NOT NULL,
  "certificate_type" VARCHAR(100) CHECK ("certificate_type" IN ('INTERNAL','ISO17025','FACTORY')) NOT NULL,
  "issue_date" date NOT NULL,
  "valid_from" date NOT NULL,
  "valid_until" date NOT NULL,
  "accreditation_body" varchar(150) DEFAULT NULL,
  "laboratory_name" varchar(255) DEFAULT NULL,
  "certificate_file" varchar(500) DEFAULT NULL,
  "qr_code" varchar(500) DEFAULT NULL,
  "verification_code" varchar(100) DEFAULT NULL,
  "issued_by" UUID NOT NULL,
  "approved_by" UUID DEFAULT NULL,
  "approval_date" timestamp DEFAULT NULL,
  "certificate_status" VARCHAR(100) CHECK ("certificate_status" IN ('DRAFT','ISSUED','SUPERSEDED','CANCELLED')) NOT NULL DEFAULT 'ISSUED',
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "calibration_certificates"
--

INSERT INTO "calibration_certificates" ("id", "calibration_execution_id", "certificate_no", "certificate_type", "issue_date", "valid_from", "valid_until", "accreditation_body", "laboratory_name", "certificate_file", "qr_code", "verification_code", "issued_by", "approved_by", "approval_date", "certificate_status", "remarks", "created_at", "updated_at") VALUES
('cd394d64-7f80-11f1-aa6c-3cecef704050', '938ef26c-7f80-11f1-aa6c-3cecef704050', 'CALCERT-2026-000001', 'ISO17025', '2026-07-14', '2026-07-14', '2027-07-14', 'SLAB', 'AVON PHARMO CHEM Calibration Laboratory', NULL, NULL, 'cd394dbd-7f80-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'ISSUED', NULL, '2026-07-14 12:37:37', '2026-07-14 12:37:37');

-- --------------------------------------------------------

--
-- Table structure for table "calibration_execution"
--

CREATE TABLE "calibration_execution" (
  "id" UUID NOT NULL,
  "calibration_schedule_id" UUID NOT NULL,
  "job_id" UUID DEFAULT NULL,
  "engineer_id" UUID NOT NULL,
  "execution_date" date NOT NULL,
  "start_time" timestamp DEFAULT NULL,
  "end_time" timestamp DEFAULT NULL,
  "calibration_method" varchar(255) DEFAULT NULL,
  "calibration_standard" varchar(255) DEFAULT NULL,
  "reference_equipment" varchar(255) DEFAULT NULL,
  "reference_equipment_serial" varchar(100) DEFAULT NULL,
  "certificate_no" varchar(100) DEFAULT NULL,
  "result" VARCHAR(100) CHECK ("result" IN ('PASS','FAIL','ADJUSTED','LIMITED_USE')) NOT NULL,
  "uncertainty" varchar(100) DEFAULT NULL,
  "environmental_conditions" text DEFAULT NULL,
  "observations" text DEFAULT NULL,
  "corrective_action" text DEFAULT NULL,
  "next_calibration_date" date DEFAULT NULL,
  "execution_status" VARCHAR(100) CHECK ("execution_status" IN ('DRAFT','COMPLETED','VERIFIED')) NOT NULL DEFAULT 'DRAFT',
  "verified_by" UUID DEFAULT NULL,
  "verified_at" timestamp DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "calibration_execution"
--

INSERT INTO "calibration_execution" ("id", "calibration_schedule_id", "job_id", "engineer_id", "execution_date", "start_time", "end_time", "calibration_method", "calibration_standard", "reference_equipment", "reference_equipment_serial", "certificate_no", "result", "uncertainty", "environmental_conditions", "observations", "corrective_action", "next_calibration_date", "execution_status", "verified_by", "verified_at", "remarks", "created_at", "updated_at") VALUES
('938ef26c-7f80-11f1-aa6c-3cecef704050', '596568e1-7f80-11f1-aa6c-3cecef704050', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14', '2026-07-14 18:06:00', '2026-07-14 20:06:00', 'Manufacturer Procedure', 'ISO/IEC 17025', 'Fluke 5522A Multi-Product Calibrator', 'FLK5522A-00001', 'CALCERT-2026-000001', 'PASS', '±0.25%', 'Temperature 23°C, RH 50%', 'Instrument calibrated successfully within tolerance.', 'No adjustment required.', '2028-07-14', 'COMPLETED', NULL, NULL, NULL, '2026-07-14 12:36:00', '2026-07-14 12:36:00');

-- --------------------------------------------------------

--
-- Table structure for table "calibration_measurements"
--

CREATE TABLE "calibration_measurements" (
  "id" UUID NOT NULL,
  "calibration_execution_id" UUID NOT NULL,
  "measurement_no" integer NOT NULL,
  "parameter_name" varchar(150) NOT NULL,
  "parameter_code" varchar(50) DEFAULT NULL,
  "test_point" varchar(100) DEFAULT NULL,
  "reference_value" decimal(18,6) DEFAULT NULL,
  "measured_value" decimal(18,6) DEFAULT NULL,
  "correction_value" decimal(18,6) DEFAULT NULL,
  "uncertainty" decimal(18,6) DEFAULT NULL,
  "tolerance" decimal(18,6) DEFAULT NULL,
  "unit" varchar(30) DEFAULT NULL,
  "result" VARCHAR(100) CHECK ("result" IN ('PASS','FAIL')) NOT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "calibration_measurements"
--

INSERT INTO "calibration_measurements" ("id", "calibration_execution_id", "measurement_no", "parameter_name", "parameter_code", "test_point", "reference_value", "measured_value", "correction_value", "uncertainty", "tolerance", "unit", "result", "remarks", "created_at", "updated_at") VALUES
('03b1169f-7f81-11f1-aa6c-3cecef704050', '938ef26c-7f80-11f1-aa6c-3cecef704050', 1, 'Temperature', 'TEMP', '37 °C', 37.000000, 37.020000, 0.020000, 0.050000, 0.100000, '°C', 'PASS', 'Within tolerance', '2026-07-14 12:39:09', '2026-07-14 12:39:09'),
('03b1ce9f-7f81-11f1-aa6c-3cecef704050', '938ef26c-7f80-11f1-aa6c-3cecef704050', 2, 'Voltage', 'VOLT', '230 VAC', 230.000000, 229.850000, -0.150000, 0.100000, 1.000000, 'VAC', 'PASS', 'Within tolerance', '2026-07-14 12:39:09', '2026-07-14 12:39:09'),
('03b245a1-7f81-11f1-aa6c-3cecef704050', '938ef26c-7f80-11f1-aa6c-3cecef704050', 3, 'RPM', 'RPM', '3000', 3000.000000, 2998.500000, -1.500000, 1.000000, 5.000000, 'RPM', 'PASS', 'Within tolerance', '2026-07-14 12:39:09', '2026-07-14 12:39:09');

-- --------------------------------------------------------

--
-- Table structure for table "calibration_schedules"
--

CREATE TABLE "calibration_schedules" (
  "id" UUID NOT NULL,
  "instrument_id" UUID NOT NULL,
  "schedule_no" varchar(50) NOT NULL,
  "calibration_no" integer NOT NULL,
  "planned_date" date NOT NULL,
  "due_date" date NOT NULL,
  "scheduled_date" date DEFAULT NULL,
  "completed_date" date DEFAULT NULL,
  "assigned_engineer_id" UUID DEFAULT NULL,
  "job_id" UUID DEFAULT NULL,
  "calibration_interval_months" integer NOT NULL,
  "calibration_type" VARCHAR(100) CHECK ("calibration_type" IN ('INTERNAL','EXTERNAL','ACCREDITED','FACTORY')) NOT NULL DEFAULT 'INTERNAL',
  "schedule_status" VARCHAR(100) CHECK ("schedule_status" IN ('PENDING','SCHEDULED','IN_PROGRESS','COMPLETED','OVERDUE','CANCELLED')) NOT NULL DEFAULT 'PENDING',
  "generated_automatically" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "calibration_schedules"
--

INSERT INTO "calibration_schedules" ("id", "instrument_id", "schedule_no", "calibration_no", "planned_date", "due_date", "scheduled_date", "completed_date", "assigned_engineer_id", "job_id", "calibration_interval_months", "calibration_type", "schedule_status", "generated_automatically", "remarks", "created_at", "updated_at") VALUES
('596568e1-7f80-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'CAL-2026-000001', 1, '2027-07-14', '2027-07-14', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, 12, 'ACCREDITED', 'PENDING', 1, NULL, '2026-07-14 12:34:23', '2026-07-14 12:34:23');

-- --------------------------------------------------------

--
-- Table structure for table "checklist_templates"
--

CREATE TABLE "checklist_templates" (
  "id" UUID NOT NULL,
  "template_code" varchar(50) NOT NULL,
  "template_name" varchar(200) NOT NULL,
  "module_name" VARCHAR(100) CHECK ("module_name" IN ('INSTALLATION','SERVICE','PM','CALIBRATION','WORKSHOP','QA')) NOT NULL,
  "equipment_category_id" UUID DEFAULT NULL,
  "description" text DEFAULT NULL,
  "revision_no" varchar(20) DEFAULT '1.0',
  "effective_date" date DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_by" UUID NOT NULL,
  "approved_by" UUID DEFAULT NULL,
  "approved_at" timestamp DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "checklist_templates"
--

INSERT INTO "checklist_templates" ("id", "template_code", "template_name", "module_name", "equipment_category_id", "description", "revision_no", "effective_date", "active", "created_by", "approved_by", "approved_at", "created_at", "updated_at") VALUES
('0294a23e-801f-11f1-aa6c-3cecef704050', 'PM-GENERAL', 'General Preventive Maintenance', 'PM', NULL, 'Standard PM checklist.', '1.0', '2026-07-15', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, '2026-07-15 07:30:06', '2026-07-15 07:30:06');

-- --------------------------------------------------------

--
-- Table structure for table "checklist_template_items"
--

CREATE TABLE "checklist_template_items" (
  "id" UUID NOT NULL,
  "template_id" UUID NOT NULL,
  "line_no" integer NOT NULL,
  "item_description" varchar(500) NOT NULL,
  "item_type" VARCHAR(100) CHECK ("item_type" IN ('CHECKBOX','YES_NO','NUMERIC','TEXT','PASS_FAIL')) NOT NULL DEFAULT 'CHECKBOX',
  "mandatory" smallint NOT NULL DEFAULT 1,
  "expected_value" varchar(255) DEFAULT NULL,
  "tolerance_min" decimal(18,4) DEFAULT NULL,
  "tolerance_max" decimal(18,4) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "checklist_template_items"
--

INSERT INTO "checklist_template_items" ("id", "template_id", "line_no", "item_description", "item_type", "mandatory", "expected_value", "tolerance_min", "tolerance_max", "remarks", "created_at", "updated_at") VALUES
('0296fee6-801f-11f1-aa6c-3cecef704050', '0294a23e-801f-11f1-aa6c-3cecef704050', 1, 'Clean instrument exterior', 'CHECKBOX', 1, NULL, NULL, NULL, NULL, '2026-07-15 07:30:06', '2026-07-15 07:30:06'),
('0297530b-801f-11f1-aa6c-3cecef704050', '0294a23e-801f-11f1-aa6c-3cecef704050', 2, 'Check power supply voltage', 'NUMERIC', 1, NULL, NULL, NULL, NULL, '2026-07-15 07:30:06', '2026-07-15 07:30:06');

-- --------------------------------------------------------

--
-- Table structure for table "comments"
--

CREATE TABLE "comments" (
  "id" UUID NOT NULL,
  "comment_no" varchar(50) NOT NULL,
  "entity_type" varchar(100) NOT NULL,
  "entity_id" UUID NOT NULL,
  "parent_comment_id" UUID DEFAULT NULL,
  "comment_text" text NOT NULL,
  "is_internal" smallint NOT NULL DEFAULT 1,
  "created_by" UUID NOT NULL,
  "edited" smallint NOT NULL DEFAULT 0,
  "edited_at" timestamp DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "comments"
--

INSERT INTO "comments" ("id", "comment_no", "entity_type", "entity_id", "parent_comment_id", "comment_text", "is_internal", "created_by", "edited", "edited_at", "created_at", "updated_at") VALUES
('5faf2001-801e-11f1-aa6c-3cecef704050', 'CMT-000001', 'SERVICE_JOB', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'Initial service inspection completed.', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 0, NULL, '2026-07-15 07:25:33', '2026-07-15 07:25:33');

-- --------------------------------------------------------

--
-- Table structure for table "companies"
--

CREATE TABLE "companies" (
  "id" UUID NOT NULL,
  "company_code" varchar(20) NOT NULL,
  "company_name" varchar(200) NOT NULL,
  "registration_no" varchar(100) DEFAULT NULL,
  "tax_no" varchar(100) DEFAULT NULL,
  "phone" varchar(30) DEFAULT NULL,
  "email" varchar(150) DEFAULT NULL,
  "website" varchar(255) DEFAULT NULL,
  "logo" varchar(255) DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "companies"
--

INSERT INTO "companies" ("id", "company_code", "company_name", "registration_no", "tax_no", "phone", "email", "website", "logo", "active", "created_at", "updated_at") VALUES
('d2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'AVON', 'AVON PHARMO CHEM (PVT) LTD', '', NULL, '', '', 'https://www.avonpclk.com', NULL, 1, '2026-07-14 08:27:14', '2026-07-14 08:27:14');

-- --------------------------------------------------------

--
-- Table structure for table "contract_instruments"
--

CREATE TABLE "contract_instruments" (
  "id" UUID NOT NULL,
  "contract_id" UUID NOT NULL,
  "instrument_id" UUID NOT NULL,
  "coverage_type" VARCHAR(100) CHECK ("coverage_type" IN ('FULL','LABOUR_ONLY','PARTS_ONLY','PM_ONLY','CALIBRATION_ONLY')) NOT NULL DEFAULT 'FULL',
  "remarks" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "contract_instruments"
--

INSERT INTO "contract_instruments" ("id", "contract_id", "instrument_id", "coverage_type", "remarks", "active", "created_at") VALUES
('764f5714-7f7b-11f1-aa6c-3cecef704050', '49b2ddcb-7f7b-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'FULL', NULL, 1, '2026-07-14 11:59:24');

-- --------------------------------------------------------

--
-- Table structure for table "countries"
--

CREATE TABLE "countries" (
  "id" UUID NOT NULL,
  "country_code" char(2) NOT NULL,
  "country_name" varchar(100) NOT NULL,
  "iso3_code" char(3) DEFAULT NULL,
  "phone_code" varchar(10) DEFAULT NULL,
  "currency_code" varchar(10) DEFAULT NULL,
  "currency_name" varchar(50) DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "countries"
--

INSERT INTO "countries" ("id", "country_code", "country_name", "iso3_code", "phone_code", "currency_code", "currency_name", "active", "created_at", "updated_at") VALUES
('d3f5c6bb-7f73-11f1-aa6c-3cecef704050', 'LK', 'Sri Lanka', 'LKA', '+94', 'LKR', 'Sri Lankan Rupee', 1, '2026-07-14 11:04:45', '2026-07-14 11:04:45');

-- --------------------------------------------------------

--
-- Table structure for table "customers"
--

CREATE TABLE "customers" (
  "id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "territory_id" UUID NOT NULL,
  "customer_code" varchar(30) NOT NULL,
  "customer_name" varchar(200) NOT NULL,
  "customer_type" VARCHAR(100) CHECK ("customer_type" IN ('HOSPITAL','LABORATORY','UNIVERSITY','PRIVATE_CLINIC','GOVERNMENT','DEALER','OTHER')) NOT NULL,
  "registration_no" varchar(100) DEFAULT NULL,
  "tax_no" varchar(100) DEFAULT NULL,
  "address_line1" varchar(255) DEFAULT NULL,
  "address_line2" varchar(255) DEFAULT NULL,
  "city" varchar(100) DEFAULT NULL,
  "postal_code" varchar(20) DEFAULT NULL,
  "phone" varchar(30) DEFAULT NULL,
  "mobile" varchar(30) DEFAULT NULL,
  "email" varchar(150) DEFAULT NULL,
  "website" varchar(255) DEFAULT NULL,
  "contact_person" varchar(150) DEFAULT NULL,
  "designation" varchar(100) DEFAULT NULL,
  "latitude" decimal(10,7) DEFAULT NULL,
  "longitude" decimal(10,7) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "customers"
--

INSERT INTO "customers" ("id", "company_id", "territory_id", "customer_code", "customer_name", "customer_type", "registration_no", "tax_no", "address_line1", "address_line2", "city", "postal_code", "phone", "mobile", "email", "website", "contact_person", "designation", "latitude", "longitude", "remarks", "active", "created_at", "updated_at") VALUES
('08d2bede-7f76-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'CUS000001', 'National Hospital of Sri Lanka', 'HOSPITAL', NULL, NULL, NULL, NULL, 'Colombo', NULL, '0112691111', NULL, 'info@nhsl.health.gov.lk', NULL, 'Chief Medical Laboratory Technologist', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:20:33', '2026-07-14 11:20:33'),
('08d39343-7f76-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'CUS000002', 'Asiri Central Hospital', 'HOSPITAL', NULL, NULL, NULL, NULL, 'Colombo', NULL, '0114523300', NULL, 'info@asiri.lk', NULL, 'Laboratory Manager', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:20:33', '2026-07-14 11:20:33'),
('08d43dec-7f76-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'CUS000003', 'Lanka Hospitals PLC', 'HOSPITAL', NULL, NULL, NULL, NULL, 'Colombo', NULL, '0115430000', NULL, 'info@lankahospitals.com', NULL, 'Biomedical Department', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:20:33', '2026-07-14 11:20:33');

-- --------------------------------------------------------

--
-- Table structure for table "customer_complaints"
--

CREATE TABLE "customer_complaints" (
  "id" UUID NOT NULL,
  "complaint_no" varchar(50) NOT NULL,
  "customer_id" UUID NOT NULL,
  "instrument_id" UUID DEFAULT NULL,
  "service_job_id" UUID DEFAULT NULL,
  "complaint_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "complaint_source" VARCHAR(100) CHECK ("complaint_source" IN ('PHONE','EMAIL','WHATSAPP','WEB','VISIT','OTHER')) NOT NULL DEFAULT 'PHONE',
  "contact_person" varchar(150) NOT NULL,
  "contact_number" varchar(30) DEFAULT NULL,
  "email" varchar(150) DEFAULT NULL,
  "complaint_category" VARCHAR(100) CHECK ("complaint_category" IN ('BREAKDOWN','INSTALLATION','CALIBRATION','PM','AMC','PARTS','BILLING','SERVICE_QUALITY','OTHER')) NOT NULL,
  "priority" VARCHAR(100) CHECK ("priority" IN ('LOW','MEDIUM','HIGH','URGENT','CRITICAL')) NOT NULL DEFAULT 'MEDIUM',
  "complaint_description" text NOT NULL,
  "root_cause" text DEFAULT NULL,
  "corrective_action" text DEFAULT NULL,
  "resolution" text DEFAULT NULL,
  "status" VARCHAR(100) CHECK ("status" IN ('OPEN','ASSIGNED','IN_PROGRESS','RESOLVED','CLOSED','REJECTED')) NOT NULL DEFAULT 'OPEN',
  "assigned_to" UUID DEFAULT NULL,
  "resolved_date" timestamp DEFAULT NULL,
  "closed_date" timestamp DEFAULT NULL,
  "customer_satisfaction" integer DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "customer_complaints"
--

INSERT INTO "customer_complaints" ("id", "complaint_no", "customer_id", "instrument_id", "service_job_id", "complaint_date", "complaint_source", "contact_person", "contact_number", "email", "complaint_category", "priority", "complaint_description", "root_cause", "corrective_action", "resolution", "status", "assigned_to", "resolved_date", "closed_date", "customer_satisfaction", "remarks", "created_at", "updated_at") VALUES
('9eb499cc-7fee-11f1-aa6c-3cecef704050', 'CMP-2026-000001', '08d2bede-7f76-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', '2026-07-15 07:13:43', 'PHONE', 'Chief Medical Laboratory Technologist', '0771234567', NULL, 'BREAKDOWN', 'HIGH', 'Instrument displays temperature alarm during operation.', NULL, NULL, NULL, 'IN_PROGRESS', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, NULL, '2026-07-15 01:43:43', '2026-07-15 01:43:43');

-- --------------------------------------------------------

--
-- Table structure for table "customer_contacts"
--

CREATE TABLE "customer_contacts" (
  "id" UUID NOT NULL,
  "customer_id" UUID NOT NULL,
  "department_id" UUID DEFAULT NULL,
  "contact_code" varchar(30) NOT NULL,
  "title" varchar(20) DEFAULT NULL,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) DEFAULT NULL,
  "designation" varchar(150) DEFAULT NULL,
  "mobile" varchar(30) DEFAULT NULL,
  "phone" varchar(30) DEFAULT NULL,
  "extension" varchar(20) DEFAULT NULL,
  "email" varchar(150) DEFAULT NULL,
  "preferred_contact" VARCHAR(100) CHECK ("preferred_contact" IN ('PHONE','MOBILE','EMAIL')) DEFAULT 'MOBILE',
  "is_primary" smallint NOT NULL DEFAULT 0,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "customer_contacts"
--

INSERT INTO "customer_contacts" ("id", "customer_id", "department_id", "contact_code", "title", "first_name", "last_name", "designation", "mobile", "phone", "extension", "email", "preferred_contact", "is_primary", "active", "created_at", "updated_at") VALUES
('c7a6b23f-7f76-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '784ad52d-7f76-11f1-aa6c-3cecef704050', 'CON001', NULL, 'Nimal', 'Perera', 'Chief Medical Laboratory Technologist', '0777000001', NULL, NULL, 'nimal.perera@nhsl.health.gov.lk', 'MOBILE', 1, 1, '2026-07-14 11:25:53', '2026-07-14 11:25:53'),
('c7a77812-7f76-11f1-aa6c-3cecef704050', '08d39343-7f76-11f1-aa6c-3cecef704050', '784bebec-7f76-11f1-aa6c-3cecef704050', 'CON001', NULL, 'Kasun', 'Fernando', 'Laboratory Manager', '0777000002', NULL, NULL, 'kasun.fernando@asiri.lk', 'MOBILE', 1, 1, '2026-07-14 11:25:53', '2026-07-14 11:25:53'),
('c7a7ebaf-7f76-11f1-aa6c-3cecef704050', '08d43dec-7f76-11f1-aa6c-3cecef704050', '784cf9ed-7f76-11f1-aa6c-3cecef704050', 'CON001', NULL, 'Saman', 'Jayasinghe', 'Biomedical Engineer', '0777000003', NULL, NULL, 'saman.j@lankahospitals.com', 'MOBILE', 1, 1, '2026-07-14 11:25:53', '2026-07-14 11:25:53');

-- --------------------------------------------------------

--
-- Table structure for table "customer_departments"
--

CREATE TABLE "customer_departments" (
  "id" UUID NOT NULL,
  "customer_id" UUID NOT NULL,
  "department_code" varchar(30) NOT NULL,
  "department_name" varchar(150) NOT NULL,
  "location" varchar(150) DEFAULT NULL,
  "phone" varchar(30) DEFAULT NULL,
  "email" varchar(150) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "customer_departments"
--

INSERT INTO "customer_departments" ("id", "customer_id", "department_code", "department_name", "location", "phone", "email", "remarks", "active", "created_at", "updated_at") VALUES
('784ad52d-7f76-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', 'LAB', 'Central Laboratory', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40'),
('784b880f-7f76-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', 'BIO', 'Biomedical Engineering Department', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40'),
('784bebec-7f76-11f1-aa6c-3cecef704050', '08d39343-7f76-11f1-aa6c-3cecef704050', 'LAB', 'Clinical Laboratory', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40'),
('784c4389-7f76-11f1-aa6c-3cecef704050', '08d39343-7f76-11f1-aa6c-3cecef704050', 'BIO', 'Biomedical Engineering Department', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40'),
('784c9e7c-7f76-11f1-aa6c-3cecef704050', '08d43dec-7f76-11f1-aa6c-3cecef704050', 'LAB', 'Laboratory', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40'),
('784cf9ed-7f76-11f1-aa6c-3cecef704050', '08d43dec-7f76-11f1-aa6c-3cecef704050', 'BIO', 'Biomedical Engineering Department', NULL, NULL, NULL, NULL, 1, '2026-07-14 11:23:40', '2026-07-14 11:23:40');

-- --------------------------------------------------------

--
-- Table structure for table "customer_feedback"
--

CREATE TABLE "customer_feedback" (
  "id" UUID NOT NULL,
  "feedback_no" varchar(50) NOT NULL,
  "customer_id" UUID NOT NULL,
  "instrument_id" UUID DEFAULT NULL,
  "service_job_id" UUID DEFAULT NULL,
  "complaint_id" UUID DEFAULT NULL,
  "feedback_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "feedback_type" VARCHAR(100) CHECK ("feedback_type" IN ('SERVICE','INSTALLATION','CALIBRATION','PM','AMC','TRAINING','GENERAL')) NOT NULL,
  "overall_rating" smallint NOT NULL,
  "engineer_rating" smallint DEFAULT NULL,
  "response_time_rating" smallint DEFAULT NULL,
  "technical_quality_rating" smallint DEFAULT NULL,
  "communication_rating" smallint DEFAULT NULL,
  "professionalism_rating" smallint DEFAULT NULL,
  "recommend_avon" smallint DEFAULT 1,
  "comments" text DEFAULT NULL,
  "follow_up_required" smallint DEFAULT 0,
  "follow_up_completed" smallint DEFAULT 0,
  "reviewed_by" UUID DEFAULT NULL,
  "reviewed_date" timestamp DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "customer_feedback"
--

INSERT INTO "customer_feedback" ("id", "feedback_no", "customer_id", "instrument_id", "service_job_id", "complaint_id", "feedback_date", "feedback_type", "overall_rating", "engineer_rating", "response_time_rating", "technical_quality_rating", "communication_rating", "professionalism_rating", "recommend_avon", "comments", "follow_up_required", "follow_up_completed", "reviewed_by", "reviewed_date", "created_at", "updated_at") VALUES
('ef4252e2-7fee-11f1-aa6c-3cecef704050', 'FDB-2026-000001', '08d2bede-7f76-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', '9eb499cc-7fee-11f1-aa6c-3cecef704050', '2026-07-15 07:15:58', 'SERVICE', 5, 5, 5, 5, 5, 5, 1, 'Excellent service. Problem resolved quickly.', 0, 0, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:15:58', '2026-07-15 01:45:58', '2026-07-15 01:45:58');

-- --------------------------------------------------------

--
-- Table structure for table "dashboard_layouts"
--

CREATE TABLE "dashboard_layouts" (
  "id" UUID NOT NULL,
  "layout_code" varchar(50) NOT NULL,
  "user_id" UUID NOT NULL,
  "layout_name" varchar(150) NOT NULL,
  "layout_json" jsonb NOT NULL,
  "is_default" smallint DEFAULT 1,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "dashboard_layouts"
--

INSERT INTO "dashboard_layouts" ("id", "layout_code", "user_id", "layout_name", "layout_json", "is_default", "created_at", "updated_at") VALUES
('d2719e78-801d-11f1-aa6c-3cecef704050', 'LAYOUT001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Default Dashboard', '{"cards": ["TOTAL_ASSETS", "OPEN_JOBS", "PM_DUE", "CAL_DUE"]}', 1, '2026-07-15 07:21:36', '2026-07-15 07:21:36');

-- --------------------------------------------------------

--
-- Table structure for table "dashboard_widgets"
--

CREATE TABLE "dashboard_widgets" (
  "id" UUID NOT NULL,
  "widget_code" varchar(50) NOT NULL,
  "widget_name" varchar(150) NOT NULL,
  "module_id" UUID DEFAULT NULL,
  "widget_type" VARCHAR(100) CHECK ("widget_type" IN ('CARD','CHART','TABLE','LIST','GAUGE','CALENDAR','KANBAN','MAP')) NOT NULL,
  "icon" varchar(100) DEFAULT NULL,
  "color" varchar(30) DEFAULT NULL,
  "display_order" integer NOT NULL DEFAULT 1,
  "width" VARCHAR(100) CHECK ("width" IN ('SMALL','MEDIUM','LARGE','FULL')) NOT NULL DEFAULT 'MEDIUM',
  "refresh_interval_seconds" integer DEFAULT 300,
  "sql_view" varchar(150) DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "dashboard_widgets"
--

INSERT INTO "dashboard_widgets" ("id", "widget_code", "widget_name", "module_id", "widget_type", "icon", "color", "display_order", "width", "refresh_interval_seconds", "sql_view", "active", "created_by", "created_at", "updated_at") VALUES
('236effbf-8006-11f1-aa6c-3cecef704050', 'TOTAL_ASSETS', 'Total Assets', '46410e15-7f60-11f1-aa6c-3cecef704050', 'CARD', 'Package', 'blue', 1, 'SMALL', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('236fbef2-8006-11f1-aa6c-3cecef704050', 'PM_DUE', 'PM Due', '46410ef4-7f60-11f1-aa6c-3cecef704050', 'CARD', 'CalendarClock', 'orange', 2, 'SMALL', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('23702814-8006-11f1-aa6c-3cecef704050', 'CAL_DUE', 'Calibration Due', '46410ec0-7f60-11f1-aa6c-3cecef704050', 'CARD', 'FlaskConical', 'purple', 3, 'SMALL', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('23709220-8006-11f1-aa6c-3cecef704050', 'OPEN_JOBS', 'Open Service Jobs', '46410e53-7f60-11f1-aa6c-3cecef704050', 'CARD', 'Wrench', 'green', 4, 'SMALL', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('2370f437-8006-11f1-aa6c-3cecef704050', 'JOB_STATUS', 'Job Status', '46410e53-7f60-11f1-aa6c-3cecef704050', 'CHART', 'BarChart3', 'indigo', 5, 'LARGE', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('23715ba9-8006-11f1-aa6c-3cecef704050', 'LOW_STOCK', 'Low Stock Items', '46410f10-7f60-11f1-aa6c-3cecef704050', 'TABLE', 'Boxes', 'red', 6, 'LARGE', 300, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04'),
('2371c0e1-8006-11f1-aa6c-3cecef704050', 'REVENUE', 'Monthly Revenue', '46410f29-7f60-11f1-aa6c-3cecef704050', 'CHART', 'TrendingUp', 'emerald', 7, 'FULL', 600, NULL, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:32:04', '2026-07-15 04:32:04');

-- --------------------------------------------------------

--
-- Table structure for table "database_migrations"
--

CREATE TABLE "database_migrations" (
  "id" UUID NOT NULL,
  "migration_no" integer NOT NULL,
  "migration_file" varchar(255) NOT NULL,
  "migration_name" varchar(255) NOT NULL,
  "batch_no" integer NOT NULL DEFAULT 1,
  "executed_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "execution_time_ms" integer DEFAULT NULL,
  "execution_status" VARCHAR(100) CHECK ("execution_status" IN ('SUCCESS','FAILED','ROLLED_BACK')) NOT NULL DEFAULT 'SUCCESS',
  "checksum_sha256" varchar(64) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "database_migrations"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "database_version"
--

CREATE TABLE "database_version" (
  "id" UUID NOT NULL,
  "version_no" varchar(30) NOT NULL,
  "release_name" varchar(100) NOT NULL,
  "schema_version" integer NOT NULL,
  "application_version" varchar(30) NOT NULL,
  "release_date" date NOT NULL,
  "installed_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "installed_by" UUID DEFAULT NULL,
  "migration_count" integer NOT NULL DEFAULT 0,
  "status" VARCHAR(100) CHECK ("status" IN ('CURRENT','SUPERSEDED','FAILED')) NOT NULL DEFAULT 'CURRENT',
  "checksum_sha256" varchar(64) DEFAULT NULL,
  "release_notes" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "database_version"
--

INSERT INTO "database_version" ("id", "version_no", "release_name", "schema_version", "application_version", "release_date", "installed_at", "installed_by", "migration_count", "status", "checksum_sha256", "release_notes", "created_at", "updated_at") VALUES
('468d58b2-801a-11f1-aa6c-3cecef704050', '1.0.0', 'Genesis', 112, '1.0.0', '2026-07-15', '2026-07-15 12:26:13', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 112, 'CURRENT', '370ad4eb6a0f1e144da5cb69ae76e786b071709fa4f699b8972c33150b8688ce', 'Initial production release of Avon ServicePro.', '2026-07-15 06:56:13', '2026-07-15 06:56:13');

-- --------------------------------------------------------

--
-- Table structure for table "deleted_records"
--

CREATE TABLE "deleted_records" (
  "id" UUID NOT NULL,
  "delete_no" varchar(50) NOT NULL,
  "company_id" UUID DEFAULT NULL,
  "branch_id" UUID DEFAULT NULL,
  "entity_type" varchar(100) NOT NULL,
  "entity_id" UUID NOT NULL,
  "document_no" varchar(100) DEFAULT NULL,
  "record_json" text NOT NULL,
  "deleted_reason" varchar(500) DEFAULT NULL,
  "deleted_by" UUID NOT NULL,
  "deleted_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "restored" smallint NOT NULL DEFAULT 0,
  "restored_by" UUID DEFAULT NULL,
  "restored_at" timestamp DEFAULT NULL,
  "restore_notes" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "deleted_records"
--

INSERT INTO "deleted_records" ("id", "delete_no", "company_id", "branch_id", "entity_type", "entity_id", "document_no", "record_json", "deleted_reason", "deleted_by", "deleted_at", "restored", "restored_by", "restored_at", "restore_notes", "created_at", "updated_at") VALUES
('5f3f234f-8025-11f1-aa6c-3cecef704050', 'DEL-000001', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'CUSTOMER', '08d2bede-7f76-11f1-aa6c-3cecef704050', 'CUS000001', '{"id": "08d2bede-7f76-11f1-aa6c-3cecef704050", "customer_code": "CUS000001", "customer_name": "National Hospital of Sri Lanka"}', 'Duplicate customer merged.', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 13:45:39', 0, NULL, NULL, NULL, '2026-07-15 08:15:39', '2026-07-15 08:15:39');

-- --------------------------------------------------------

--
-- Table structure for table "department_targets"
--

CREATE TABLE "department_targets" (
  "id" UUID NOT NULL,
  "target_no" varchar(50) NOT NULL,
  "organizational_unit_id" UUID NOT NULL,
  "financial_year_id" UUID NOT NULL,
  "kpi_id" UUID NOT NULL,
  "target_name" varchar(200) NOT NULL,
  "target_value" decimal(18,4) NOT NULL,
  "minimum_value" decimal(18,4) DEFAULT NULL,
  "maximum_value" decimal(18,4) DEFAULT NULL,
  "target_weight" decimal(6,2) NOT NULL DEFAULT 100.00,
  "achievement_value" decimal(18,4) DEFAULT 0.0000,
  "achievement_percentage" decimal(8,2) DEFAULT 0.00,
  "evaluation_frequency" VARCHAR(100) CHECK ("evaluation_frequency" IN ('MONTHLY','QUARTERLY','HALF_YEARLY','YEARLY')) NOT NULL DEFAULT 'YEARLY',
  "responsible_user_id" UUID DEFAULT NULL,
  "status" VARCHAR(100) CHECK ("status" IN ('PLANNED','IN_PROGRESS','ACHIEVED','NOT_ACHIEVED','CANCELLED')) NOT NULL DEFAULT 'PLANNED',
  "remarks" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "approved_by" UUID DEFAULT NULL,
  "approved_at" timestamp DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "department_targets"
--

INSERT INTO "department_targets" ("id", "target_no", "organizational_unit_id", "financial_year_id", "kpi_id", "target_name", "target_value", "minimum_value", "maximum_value", "target_weight", "achievement_value", "achievement_percentage", "evaluation_frequency", "responsible_user_id", "status", "remarks", "created_by", "approved_by", "approved_at", "created_at", "updated_at") VALUES
('c60c6002-8035-11f1-aa6c-3cecef704050', 'DT-000001', '79495228-802c-11f1-aa6c-3cecef704050', 'a38dff65-8030-11f1-aa6c-3cecef704050', '968b5c60-8033-11f1-aa6c-3cecef704050', 'Service Installation Completion', 100.0000, 95.0000, 100.0000, 100.00, 0.0000, 0.00, 'YEARLY', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'PLANNED', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, '2026-07-15 10:13:03', '2026-07-15 10:13:03'),
('c60cffcc-8035-11f1-aa6c-3cecef704050', 'DT-000002', '7949c816-802c-11f1-aa6c-3cecef704050', 'a38dff65-8030-11f1-aa6c-3cecef704050', '968b6052-8033-11f1-aa6c-3cecef704050', 'Workshop Completion Rate', 95.0000, 90.0000, 100.0000, 100.00, 0.0000, 0.00, 'YEARLY', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'PLANNED', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, '2026-07-15 10:13:03', '2026-07-15 10:13:03');

-- --------------------------------------------------------

--
-- Table structure for table "districts"
--

CREATE TABLE "districts" (
  "id" UUID NOT NULL,
  "province_id" UUID NOT NULL,
  "district_code" varchar(10) NOT NULL,
  "district_name" varchar(100) NOT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "districts"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "document_reviews"
--

CREATE TABLE "document_reviews" (
  "id" UUID NOT NULL,
  "job_report_id" UUID NOT NULL,
  "documentation_officer_id" UUID NOT NULL,
  "installation_date" date DEFAULT NULL,
  "job_sheet_no" varchar(50) DEFAULT NULL,
  "warranty_card_no" varchar(100) DEFAULT NULL,
  "warranty_start_date" date DEFAULT NULL,
  "warranty_end_date" date DEFAULT NULL,
  "warranty_period_months" integer NOT NULL DEFAULT 12,
  "service_interval_months" integer NOT NULL DEFAULT 12,
  "review_status" VARCHAR(100) CHECK ("review_status" IN ('DRAFT','RETURNED','REJECTED','APPROVED','RELEASED')) NOT NULL DEFAULT 'DRAFT',
  "decision_remarks" text DEFAULT NULL,
  "returned_reason" text DEFAULT NULL,
  "reviewed_at" timestamp DEFAULT NULL,
  "approved_at" timestamp DEFAULT NULL,
  "released_at" timestamp DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "document_reviews"
--

INSERT INTO "document_reviews" ("id", "job_report_id", "documentation_officer_id", "installation_date", "job_sheet_no", "warranty_card_no", "warranty_start_date", "warranty_end_date", "warranty_period_months", "service_interval_months", "review_status", "decision_remarks", "returned_reason", "reviewed_at", "approved_at", "released_at", "created_at", "updated_at") VALUES
('9ddda42d-7f7e-11f1-aa6c-3cecef704050', '605168ec-7f7e-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14', 'JS-2026-000001', 'WC-2026-000001', '2026-07-14', '2027-07-14', 12, 12, 'DRAFT', 'Awaiting Documentation Review', NULL, '2026-07-14 17:51:59', NULL, NULL, '2026-07-14 12:21:59', '2026-07-14 12:21:59');

-- --------------------------------------------------------

--
-- Table structure for table "document_review_audit"
--

CREATE TABLE "document_review_audit" (
  "id" UUID NOT NULL,
  "document_review_id" UUID NOT NULL,
  "action" VARCHAR(100) CHECK ("action" IN ('CREATED','UPDATED','RETURNED','REJECTED','APPROVED','RELEASED')) NOT NULL,
  "previous_status" VARCHAR(100) CHECK ("previous_status" IN ('DRAFT','RETURNED','REJECTED','APPROVED','RELEASED')) DEFAULT NULL,
  "new_status" VARCHAR(100) CHECK ("new_status" IN ('DRAFT','RETURNED','REJECTED','APPROVED','RELEASED')) NOT NULL,
  "performed_by" UUID NOT NULL,
  "action_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "remarks" text DEFAULT NULL,
  "ip_address" varchar(45) DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "document_review_audit"
--

INSERT INTO "document_review_audit" ("id", "document_review_id", "action", "previous_status", "new_status", "performed_by", "action_date", "remarks", "ip_address", "created_at") VALUES
('d36ad960-7f7e-11f1-aa6c-3cecef704050', '9ddda42d-7f7e-11f1-aa6c-3cecef704050', 'CREATED', NULL, 'DRAFT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:53:29', 'Documentation review record created.', NULL, '2026-07-14 12:23:29'),
('d36b8487-7f7e-11f1-aa6c-3cecef704050', '9ddda42d-7f7e-11f1-aa6c-3cecef704050', 'UPDATED', 'DRAFT', 'DRAFT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:53:29', 'Initial documentation details entered.', NULL, '2026-07-14 12:23:29');

-- --------------------------------------------------------

--
-- Table structure for table "email_attachments"
--

CREATE TABLE "email_attachments" (
  "id" UUID NOT NULL,
  "email_queue_id" UUID NOT NULL,
  "attachment_no" integer NOT NULL,
  "file_name" varchar(255) NOT NULL,
  "original_file_name" varchar(255) NOT NULL,
  "file_path" varchar(500) NOT NULL,
  "file_type" varchar(100) DEFAULT NULL,
  "file_extension" varchar(20) DEFAULT NULL,
  "file_size_bytes" bigint DEFAULT NULL,
  "mime_type" varchar(100) DEFAULT NULL,
  "checksum_sha256" varchar(64) DEFAULT NULL,
  "uploaded_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "uploaded_by" UUID DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "email_attachments"
--

INSERT INTO "email_attachments" ("id", "email_queue_id", "attachment_no", "file_name", "original_file_name", "file_path", "file_type", "file_extension", "file_size_bytes", "mime_type", "checksum_sha256", "uploaded_at", "uploaded_by", "remarks", "created_at", "updated_at") VALUES
('6ac0eb58-800c-11f1-aa6c-3cecef704050', '1164df21-800c-11f1-aa6c-3cecef704050', 1, 'Service_Report_JOB-2026-000001.pdf', 'Service_Report.pdf', '/uploads/email/service_reports/Service_Report_JOB-2026-000001.pdf', 'REPORT', 'pdf', 425632, 'application/pdf', '66825029e3a0fa22ae12fd04c93326ce036b95a31fb25b9874b982d70ecf3808', '2026-07-15 10:47:01', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Attached Service Report', '2026-07-15 05:17:01', '2026-07-15 05:17:01'),
('6ac1b6bf-800c-11f1-aa6c-3cecef704050', '1165b12c-800c-11f1-aa6c-3cecef704050', 1, 'PM_Due_Report.pdf', 'PM_Due_Report.pdf', '/uploads/email/pm/PM_Due_Report.pdf', 'REPORT', 'pdf', 285944, 'application/pdf', '1d5c8499761c04503748efdb8c906aca00e42da5f2e7b0704f257e4d49361e93', '2026-07-15 10:47:01', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Attached PM Due Report', '2026-07-15 05:17:01', '2026-07-15 05:17:01'),
('6ac23602-800c-11f1-aa6c-3cecef704050', '11662243-800c-11f1-aa6c-3cecef704050', 1, 'Low_Stock_Report.xlsx', 'Low_Stock_Report.xlsx', '/uploads/email/inventory/Low_Stock_Report.xlsx', 'REPORT', 'xlsx', 194281, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '491e9d83653dd2daf93bb39fbdac5943a17a293e58f0a561bd0f64e1f1494c3f', '2026-07-15 10:47:01', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Attached Inventory Report', '2026-07-15 05:17:01', '2026-07-15 05:17:01');

-- --------------------------------------------------------

--
-- Table structure for table "email_queue"
--

CREATE TABLE "email_queue" (
  "id" UUID NOT NULL,
  "email_no" varchar(50) NOT NULL,
  "recipient_name" varchar(200) DEFAULT NULL,
  "recipient_email" varchar(255) NOT NULL,
  "cc_email" text DEFAULT NULL,
  "bcc_email" text DEFAULT NULL,
  "subject" varchar(255) NOT NULL,
  "body" text NOT NULL,
  "template_id" UUID DEFAULT NULL,
  "attachment_count" integer NOT NULL DEFAULT 0,
  "priority" VARCHAR(100) CHECK ("priority" IN ('LOW','NORMAL','HIGH','URGENT')) NOT NULL DEFAULT 'NORMAL',
  "scheduled_at" timestamp DEFAULT NULL,
  "queued_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "sent_at" timestamp DEFAULT NULL,
  "retry_count" integer NOT NULL DEFAULT 0,
  "max_retry_count" integer NOT NULL DEFAULT 3,
  "status" VARCHAR(100) CHECK ("status" IN ('QUEUED','SENDING','SENT','FAILED','CANCELLED')) NOT NULL DEFAULT 'QUEUED',
  "smtp_response" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "email_queue"
--

INSERT INTO "email_queue" ("id", "email_no", "recipient_name", "recipient_email", "cc_email", "bcc_email", "subject", "body", "template_id", "attachment_count", "priority", "scheduled_at", "queued_at", "sent_at", "retry_count", "max_retry_count", "status", "smtp_response", "created_by", "remarks", "created_at", "updated_at") VALUES
('1164df21-800c-11f1-aa6c-3cecef704050', 'EML-2026-000001', 'Cherub Weeratunge', 'admin@avonpclk.com', NULL, NULL, 'New Service Job Assigned', 'Your new service job has been assigned successfully.', 'b5599b8b-8004-11f1-aa6c-3cecef704050', 0, 'HIGH', '2026-07-15 10:44:31', '2026-07-15 10:44:31', NULL, 0, 3, 'QUEUED', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 05:14:31', '2026-07-15 05:14:31'),
('1165b12c-800c-11f1-aa6c-3cecef704050', 'EML-2026-000002', 'Cherub Weeratunge', 'admin@avonpclk.com', NULL, NULL, 'Preventive Maintenance Reminder', 'The following PM schedules are due within 7 days.', 'b55a7b76-8004-11f1-aa6c-3cecef704050', 0, 'NORMAL', '2026-07-15 11:44:31', '2026-07-15 10:44:31', NULL, 0, 3, 'QUEUED', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 05:14:31', '2026-07-15 05:14:31'),
('11662243-800c-11f1-aa6c-3cecef704050', 'EML-2026-000003', 'Cherub Weeratunge', 'admin@avonpclk.com', NULL, NULL, 'Low Stock Alert', 'Temperature Sensor stock has reached the reorder level.', 'b55b8a1d-8004-11f1-aa6c-3cecef704050', 0, 'URGENT', '2026-07-15 10:44:31', '2026-07-15 10:44:31', NULL, 0, 3, 'QUEUED', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 05:14:31', '2026-07-15 05:14:31');

-- --------------------------------------------------------

--
-- Table structure for table "employee_kpi_assignments"
--

CREATE TABLE "employee_kpi_assignments" (
  "id" UUID NOT NULL,
  "assignment_no" varchar(50) NOT NULL,
  "employee_id" UUID NOT NULL,
  "kpi_id" UUID NOT NULL,
  "financial_year_id" UUID NOT NULL,
  "organizational_unit_id" UUID DEFAULT NULL,
  "weight" decimal(6,2) NOT NULL,
  "target_value" decimal(18,4) DEFAULT NULL,
  "minimum_value" decimal(18,4) DEFAULT NULL,
  "maximum_value" decimal(18,4) DEFAULT NULL,
  "effective_from" date NOT NULL,
  "effective_to" date DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "assigned_by" UUID NOT NULL,
  "assigned_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "employee_kpi_assignments"
--

INSERT INTO "employee_kpi_assignments" ("id", "assignment_no", "employee_id", "kpi_id", "financial_year_id", "organizational_unit_id", "weight", "target_value", "minimum_value", "maximum_value", "effective_from", "effective_to", "active", "remarks", "assigned_by", "assigned_at", "created_at", "updated_at") VALUES
('b611a57d-8033-11f1-aa6c-3cecef704050', 'KPI-000001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '968b5c60-8033-11f1-aa6c-3cecef704050', 'a38dff65-8030-11f1-aa6c-3cecef704050', '79495228-802c-11f1-aa6c-3cecef704050', 20.00, 100.0000, NULL, NULL, '2026-04-01', NULL, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 15:28:17', '2026-07-15 09:58:17', '2026-07-15 09:58:17');

-- --------------------------------------------------------

--
-- Table structure for table "employee_performance_summary"
--

CREATE TABLE "employee_performance_summary" (
  "id" UUID NOT NULL,
  "summary_no" varchar(50) NOT NULL,
  "employee_id" UUID NOT NULL,
  "financial_year_id" UUID NOT NULL,
  "organizational_unit_id" UUID DEFAULT NULL,
  "evaluation_period" VARCHAR(100) CHECK ("evaluation_period" IN ('MONTHLY','QUARTERLY','HALF_YEARLY','YEARLY')) NOT NULL,
  "period_year" SMALLINT NOT NULL,
  "period_month" smallint DEFAULT NULL,
  "total_kpis" integer NOT NULL DEFAULT 0,
  "completed_kpis" integer NOT NULL DEFAULT 0,
  "pending_kpis" integer NOT NULL DEFAULT 0,
  "total_weight" decimal(8,2) NOT NULL DEFAULT 0.00,
  "weighted_score" decimal(8,2) NOT NULL DEFAULT 0.00,
  "performance_percentage" decimal(8,2) NOT NULL DEFAULT 0.00,
  "performance_grade" VARCHAR(100) CHECK ("performance_grade" IN ('A+','A','B+','B','C','D','F')) DEFAULT NULL,
  "performance_rating" VARCHAR(100) CHECK ("performance_rating" IN ('OUTSTANDING','EXCEEDS_EXPECTATION','MEETS_EXPECTATION','NEEDS_IMPROVEMENT','UNSATISFACTORY')) DEFAULT NULL,
  "department_rank" integer DEFAULT NULL,
  "company_rank" integer DEFAULT NULL,
  "promotion_recommended" smallint NOT NULL DEFAULT 0,
  "increment_recommended" smallint NOT NULL DEFAULT 0,
  "bonus_recommended" smallint NOT NULL DEFAULT 0,
  "appraisal_completed" smallint NOT NULL DEFAULT 0,
  "appraisal_date" date DEFAULT NULL,
  "evaluated_by" UUID DEFAULT NULL,
  "approved_by" UUID DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "employee_performance_summary"
--

INSERT INTO "employee_performance_summary" ("id", "summary_no", "employee_id", "financial_year_id", "organizational_unit_id", "evaluation_period", "period_year", "period_month", "total_kpis", "completed_kpis", "pending_kpis", "total_weight", "weighted_score", "performance_percentage", "performance_grade", "performance_rating", "department_rank", "company_rank", "promotion_recommended", "increment_recommended", "bonus_recommended", "appraisal_completed", "appraisal_date", "evaluated_by", "approved_by", "remarks", "created_at", "updated_at") VALUES
('4b43dd44-8036-11f1-aa6c-3cecef704050', 'EPS-000001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'a38dff65-8030-11f1-aa6c-3cecef704050', '79495228-802c-11f1-aa6c-3cecef704050', 'MONTHLY', 2026, 7, 10, 10, 0, 100.00, 92.50, 92.50, 'A', 'EXCEEDS_EXPECTATION', 1, 3, 1, 1, 1, 1, '2026-07-15', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 10:16:47', '2026-07-15 10:16:47');

-- --------------------------------------------------------

--
-- Table structure for table "engineer_tags"
--

CREATE TABLE "engineer_tags" (
  "id" UUID NOT NULL,
  "tag_code" varchar(30) NOT NULL,
  "tag_name" varchar(100) NOT NULL,
  "description" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "engineer_tags"
--

INSERT INTO "engineer_tags" ("id", "tag_code", "tag_name", "description", "active", "created_at", "updated_at") VALUES
('6d8550ec-7f62-11f1-aa6c-3cecef704050', 'AREA', 'Area Engineer', 'Field Service Engineer', 1, '2026-07-14 09:00:12', '2026-07-14 09:00:12'),
('6d855266-7f62-11f1-aa6c-3cecef704050', 'WORKSHOP', 'Workshop Engineer', 'Workshop Repair Engineer', 1, '2026-07-14 09:00:12', '2026-07-14 09:00:12'),
('6d8552e3-7f62-11f1-aa6c-3cecef704050', 'CALIBRATION', 'Calibration Engineer', 'Calibration & Validation Engineer', 1, '2026-07-14 09:00:12', '2026-07-14 09:00:12');

-- --------------------------------------------------------

--
-- Table structure for table "entity_checklists"
--

CREATE TABLE "entity_checklists" (
  "id" UUID NOT NULL,
  "checklist_no" varchar(50) NOT NULL,
  "template_id" UUID NOT NULL,
  "entity_type" VARCHAR(100) CHECK ("entity_type" IN ('INSTALLATION','SERVICE_JOB','PM_EXECUTION','CALIBRATION','WORKSHOP_JOB')) NOT NULL,
  "entity_id" UUID NOT NULL,
  "assigned_to" UUID DEFAULT NULL,
  "started_at" timestamp DEFAULT NULL,
  "completed_at" timestamp DEFAULT NULL,
  "status" VARCHAR(100) CHECK ("status" IN ('PENDING','IN_PROGRESS','COMPLETED','CANCELLED')) NOT NULL DEFAULT 'PENDING',
  "completion_percentage" decimal(5,2) DEFAULT 0.00,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "entity_checklists"
--

INSERT INTO "entity_checklists" ("id", "checklist_no", "template_id", "entity_type", "entity_id", "assigned_to", "started_at", "completed_at", "status", "completion_percentage", "created_at") VALUES
('0299f762-801f-11f1-aa6c-3cecef704050', 'CHK-000001', '0294a23e-801f-11f1-aa6c-3cecef704050', 'PM_EXECUTION', 'de122bb4-7f7f-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'PENDING', 0.00, '2026-07-15 07:30:06');

-- --------------------------------------------------------

--
-- Table structure for table "entity_checklist_items"
--

CREATE TABLE "entity_checklist_items" (
  "id" UUID NOT NULL,
  "checklist_id" UUID NOT NULL,
  "template_item_id" UUID NOT NULL,
  "result_text" text DEFAULT NULL,
  "numeric_result" decimal(18,4) DEFAULT NULL,
  "pass" smallint DEFAULT NULL,
  "completed" smallint NOT NULL DEFAULT 0,
  "completed_by" UUID DEFAULT NULL,
  "completed_at" timestamp DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "entity_checklist_items"
--

INSERT INTO "entity_checklist_items" ("id", "checklist_id", "template_item_id", "result_text", "numeric_result", "pass", "completed", "completed_by", "completed_at", "remarks", "created_at") VALUES
('029c5858-801f-11f1-aa6c-3cecef704050', '0299f762-801f-11f1-aa6c-3cecef704050', '0296fee6-801f-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-07-15 07:30:06'),
('029c595b-801f-11f1-aa6c-3cecef704050', '0299f762-801f-11f1-aa6c-3cecef704050', '0297530b-801f-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-07-15 07:30:06');

-- --------------------------------------------------------

--
-- Table structure for table "export_jobs"
--

CREATE TABLE "export_jobs" (
  "id" UUID NOT NULL,
  "export_no" varchar(50) NOT NULL,
  "export_type" VARCHAR(100) CHECK ("export_type" IN ('PDF','EXCEL','CSV','WORD','JSON')) NOT NULL,
  "module_name" varchar(100) NOT NULL,
  "report_name" varchar(200) DEFAULT NULL,
  "total_records" integer NOT NULL DEFAULT 0,
  "exported_file_name" varchar(255) DEFAULT NULL,
  "file_storage_id" UUID DEFAULT NULL,
  "exported_by" UUID NOT NULL,
  "started_at" timestamp DEFAULT NULL,
  "completed_at" timestamp DEFAULT NULL,
  "status" VARCHAR(100) CHECK ("status" IN ('PROCESSING','COMPLETED','FAILED')) NOT NULL DEFAULT 'PROCESSING',
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "export_jobs"
--

INSERT INTO "export_jobs" ("id", "export_no", "export_type", "module_name", "report_name", "total_records", "exported_file_name", "file_storage_id", "exported_by", "started_at", "completed_at", "status", "remarks", "created_at", "updated_at") VALUES
('1eae9f5e-8024-11f1-aa6c-3cecef704050', 'EXP-000001', 'PDF', 'SERVICE', 'Service Job Summary', 145, 'service_jobs.pdf', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 13:36:41', '2026-07-15 13:36:41', 'COMPLETED', NULL, '2026-07-15 08:06:41', '2026-07-15 08:06:41');

-- --------------------------------------------------------

--
-- Table structure for table "favorites"
--

CREATE TABLE "favorites" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "entity_type" VARCHAR(100) CHECK ("entity_type" IN ('CUSTOMER','INSTRUMENT','SERVICE_JOB','REPORT','PART')) NOT NULL,
  "entity_id" UUID NOT NULL,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "favorites"
--

INSERT INTO "favorites" ("id", "user_id", "entity_type", "entity_id", "created_at") VALUES
('d273dcbc-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'CUSTOMER', '08d2bede-7f76-11f1-aa6c-3cecef704050', '2026-07-15 07:21:36');

-- --------------------------------------------------------

--
-- Table structure for table "feature_flags"
--

CREATE TABLE "feature_flags" (
  "id" UUID NOT NULL,
  "feature_code" varchar(50) NOT NULL,
  "feature_name" varchar(150) NOT NULL,
  "description" text DEFAULT NULL,
  "enabled" smallint NOT NULL DEFAULT 0,
  "rollout_percentage" decimal(5,2) NOT NULL DEFAULT 100.00,
  "minimum_version" varchar(30) DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "feature_flags"
--

INSERT INTO "feature_flags" ("id", "feature_code", "feature_name", "description", "enabled", "rollout_percentage", "minimum_version", "created_by", "created_at", "updated_at") VALUES
('220ba884-801d-11f1-aa6c-3cecef704050', 'AI_ASSISTANT', 'AI Assistant', 'Enable AI assistant.', 1, 100.00, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:16:40', '2026-07-15 07:16:40'),
('220c0820-801d-11f1-aa6c-3cecef704050', 'MOBILE_APP', 'Mobile Application', 'Enable mobile features.', 0, 100.00, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:16:40', '2026-07-15 07:16:40'),
('220c62d3-801d-11f1-aa6c-3cecef704050', 'API_ACCESS', 'Public API', 'Enable external API access.', 1, 100.00, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:16:40', '2026-07-15 07:16:40');

-- --------------------------------------------------------

--
-- Table structure for table "file_storage"
--

CREATE TABLE "file_storage" (
  "id" UUID NOT NULL,
  "file_no" varchar(50) NOT NULL,
  "company_id" UUID NOT NULL,
  "uploaded_by" UUID NOT NULL,
  "module_name" VARCHAR(100) CHECK ("module_name" IN ('CUSTOMERS','INSTRUMENTS','INSTALLATIONS','SERVICE','WORKSHOP','PM','CALIBRATION','PARTS','PURCHASE','AMC','USERS','GENERAL')) NOT NULL,
  "entity_name" varchar(100) DEFAULT NULL,
  "entity_id" UUID DEFAULT NULL,
  "document_type" VARCHAR(100) CHECK ("document_type" IN ('IMAGE','PDF','WORD','EXCEL','POWERPOINT','TEXT','CSV','ZIP','VIDEO','AUDIO','CERTIFICATE','REPORT','MANUAL','SOP','OTHER')) NOT NULL,
  "category" varchar(100) DEFAULT NULL,
  "original_file_name" varchar(255) NOT NULL,
  "stored_file_name" varchar(255) NOT NULL,
  "file_extension" varchar(20) DEFAULT NULL,
  "mime_type" varchar(100) DEFAULT NULL,
  "file_size" bigint DEFAULT NULL,
  "storage_path" varchar(500) NOT NULL,
  "checksum_sha256" varchar(64) DEFAULT NULL,
  "version_no" integer NOT NULL DEFAULT 1,
  "is_latest" smallint NOT NULL DEFAULT 1,
  "access_level" VARCHAR(100) CHECK ("access_level" IN ('PUBLIC','INTERNAL','CONFIDENTIAL','RESTRICTED')) NOT NULL DEFAULT 'INTERNAL',
  "download_count" integer NOT NULL DEFAULT 0,
  "active" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "file_storage"
--

INSERT INTO "file_storage" ("id", "file_no", "company_id", "uploaded_by", "module_name", "entity_name", "entity_id", "document_type", "category", "original_file_name", "stored_file_name", "file_extension", "mime_type", "file_size", "storage_path", "checksum_sha256", "version_no", "is_latest", "access_level", "download_count", "active", "remarks", "created_at", "updated_at") VALUES
('e5e42cba-800c-11f1-aa6c-3cecef704050', 'FILE-2026-000001', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'SERVICE', 'service_jobs', NULL, 'REPORT', 'Service Report', 'Service_Report.pdf', 'e5e42cec-800c-11f1-aa6c-3cecef704050', 'pdf', 'application/pdf', 425684, '/uploads/service/', '778504aa48460874efefeb3cb56d2c85a570661f14f2017e67bcc27093a3abf9', 1, 1, 'INTERNAL', 0, 1, 'Generated Service Report', '2026-07-15 05:20:27', '2026-07-15 05:20:27'),
('e5e5943b-800c-11f1-aa6c-3cecef704050', 'FILE-2026-000002', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'CALIBRATION', 'calibration_certificates', NULL, 'CERTIFICATE', 'Calibration Certificate', 'Calibration_Certificate.pdf', 'e5e5945c-800c-11f1-aa6c-3cecef704050', 'pdf', 'application/pdf', 312845, '/uploads/calibration/', '1b61b04602fd5c0c04def93ba9acd1f7a62ce900ece14217758f95995c9f66e8', 1, 1, 'CONFIDENTIAL', 0, 1, NULL, '2026-07-15 05:20:27', '2026-07-15 05:20:27'),
('e5e615dc-800c-11f1-aa6c-3cecef704050', 'FILE-2026-000003', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'INSTRUMENTS', 'instruments', NULL, 'IMAGE', 'Equipment Photo', 'Instrument.jpg', 'e5e615f1-800c-11f1-aa6c-3cecef704050', 'jpg', 'image/jpeg', 854321, '/uploads/instruments/', 'f9f519ea45fb821a018b6a0e05c2494d1b9e927ca144021ab88c7e2c6473b315', 1, 1, 'INTERNAL', 0, 1, NULL, '2026-07-15 05:20:27', '2026-07-15 05:20:27');

-- --------------------------------------------------------

--
-- Table structure for table "file_versions"
--

CREATE TABLE "file_versions" (
  "id" UUID NOT NULL,
  "file_storage_id" UUID NOT NULL,
  "version_no" integer NOT NULL,
  "original_file_name" varchar(255) NOT NULL,
  "stored_file_name" varchar(255) NOT NULL,
  "storage_path" varchar(500) NOT NULL,
  "file_extension" varchar(20) DEFAULT NULL,
  "mime_type" varchar(100) DEFAULT NULL,
  "file_size" bigint DEFAULT NULL,
  "checksum_sha256" varchar(64) DEFAULT NULL,
  "change_summary" varchar(500) DEFAULT NULL,
  "approved" smallint NOT NULL DEFAULT 0,
  "approved_by" UUID DEFAULT NULL,
  "approved_at" timestamp DEFAULT NULL,
  "uploaded_by" UUID NOT NULL,
  "uploaded_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "file_versions"
--

INSERT INTO "file_versions" ("id", "file_storage_id", "version_no", "original_file_name", "stored_file_name", "storage_path", "file_extension", "mime_type", "file_size", "checksum_sha256", "change_summary", "approved", "approved_by", "approved_at", "uploaded_by", "uploaded_at", "created_at", "updated_at") VALUES
('28ab5c79-800d-11f1-aa6c-3cecef704050', 'e5e42cba-800c-11f1-aa6c-3cecef704050', 1, 'Service_Report.pdf', 'e5e42cec-800c-11f1-aa6c-3cecef704050', '/uploads/service/', 'pdf', 'application/pdf', 425684, '778504aa48460874efefeb3cb56d2c85a570661f14f2017e67bcc27093a3abf9', 'Initial document upload.', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', '2026-07-15 05:22:19', '2026-07-15 05:22:19'),
('28ac16af-800d-11f1-aa6c-3cecef704050', 'e5e5943b-800c-11f1-aa6c-3cecef704050', 1, 'Calibration_Certificate.pdf', 'e5e5945c-800c-11f1-aa6c-3cecef704050', '/uploads/calibration/', 'pdf', 'application/pdf', 312845, '1b61b04602fd5c0c04def93ba9acd1f7a62ce900ece14217758f95995c9f66e8', 'Original calibration certificate.', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', '2026-07-15 05:22:19', '2026-07-15 05:22:19'),
('28ac93b3-800d-11f1-aa6c-3cecef704050', 'e5e615dc-800c-11f1-aa6c-3cecef704050', 1, 'Instrument.jpg', 'e5e615f1-800c-11f1-aa6c-3cecef704050', '/uploads/instruments/', 'jpg', 'image/jpeg', 854321, 'f9f519ea45fb821a018b6a0e05c2494d1b9e927ca144021ab88c7e2c6473b315', 'Equipment image uploaded.', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:52:19', '2026-07-15 05:22:19', '2026-07-15 05:22:19');

-- --------------------------------------------------------

--
-- Table structure for table "financial_years"
--

CREATE TABLE "financial_years" (
  "id" UUID NOT NULL,
  "financial_year_code" varchar(30) NOT NULL,
  "financial_year_name" varchar(100) NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "status" VARCHAR(100) CHECK ("status" IN ('PLANNING','ACTIVE','CLOSED')) NOT NULL DEFAULT 'PLANNING',
  "is_default" smallint NOT NULL DEFAULT 0,
  "description" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
) ;

--
-- Dumping data for table "financial_years"
--

INSERT INTO "financial_years" ("id", "financial_year_code", "financial_year_name", "start_date", "end_date", "status", "is_default", "description", "created_by", "created_at", "updated_at") VALUES
('a38dff65-8030-11f1-aa6c-3cecef704050', 'FY2026-2027', 'Financial Year 2026/2027', '2026-04-01', '2027-03-31', 'ACTIVE', 1, 'Default financial year.', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:36:18', '2026-07-15 09:36:18'),
('a38edf40-8030-11f1-aa6c-3cecef704050', 'FY2027-2028', 'Financial Year 2027/2028', '2027-04-01', '2028-03-31', 'PLANNING', 0, 'Next financial year.', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:36:18', '2026-07-15 09:36:18');

-- --------------------------------------------------------

--
-- Table structure for table "goods_receipts"
--

CREATE TABLE "goods_receipts" (
  "id" UUID NOT NULL,
  "purchase_order_id" UUID NOT NULL,
  "supplier_id" UUID NOT NULL,
  "location_id" UUID NOT NULL,
  "grn_no" varchar(50) NOT NULL,
  "supplier_invoice_no" varchar(100) DEFAULT NULL,
  "supplier_delivery_note" varchar(100) DEFAULT NULL,
  "received_date" date NOT NULL,
  "received_by" UUID NOT NULL,
  "inspected_by" UUID DEFAULT NULL,
  "receipt_status" VARCHAR(100) CHECK ("receipt_status" IN ('PENDING_INSPECTION','PARTIALLY_RECEIVED','RECEIVED','REJECTED')) NOT NULL DEFAULT 'RECEIVED',
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "goods_receipts"
--

INSERT INTO "goods_receipts" ("id", "purchase_order_id", "supplier_id", "location_id", "grn_no", "supplier_invoice_no", "supplier_delivery_note", "received_date", "received_by", "inspected_by", "receipt_status", "remarks", "created_at", "updated_at") VALUES
('19a8e572-7fe1-11f1-aa6c-3cecef704050', '5dbdd081-7fe0-11f1-aa6c-3cecef704050', 'fd7c87de-7fdf-11f1-aa6c-3cecef704050', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', 'GRN-2026-000001', 'INV-2026-000145', 'DN-2026-000089', '2026-07-15', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'RECEIVED', 'Complete shipment received.', '2026-07-15 00:06:56', '2026-07-15 00:06:56');

-- --------------------------------------------------------

--
-- Table structure for table "goods_receipt_items"
--

CREATE TABLE "goods_receipt_items" (
  "id" UUID NOT NULL,
  "goods_receipt_id" UUID NOT NULL,
  "purchase_order_item_id" UUID NOT NULL,
  "part_id" UUID NOT NULL,
  "quantity_received" decimal(12,2) NOT NULL,
  "quantity_accepted" decimal(12,2) NOT NULL,
  "quantity_rejected" decimal(12,2) NOT NULL DEFAULT 0.00,
  "unit_cost" decimal(18,2) NOT NULL,
  "batch_no" varchar(100) DEFAULT NULL,
  "serial_no" varchar(100) DEFAULT NULL,
  "expiry_date" date DEFAULT NULL,
  "inspection_status" VARCHAR(100) CHECK ("inspection_status" IN ('PENDING','ACCEPTED','REJECTED')) NOT NULL DEFAULT 'ACCEPTED',
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "goods_receipt_items"
--

INSERT INTO "goods_receipt_items" ("id", "goods_receipt_id", "purchase_order_item_id", "part_id", "quantity_received", "quantity_accepted", "quantity_rejected", "unit_cost", "batch_no", "serial_no", "expiry_date", "inspection_status", "remarks", "created_at", "updated_at") VALUES
('36593263-7fe1-11f1-aa6c-3cecef704050', '19a8e572-7fe1-11f1-aa6c-3cecef704050', 'b768a770-7fe0-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', 10.00, 10.00, 0.00, 18500.00, NULL, NULL, NULL, 'ACCEPTED', NULL, '2026-07-15 00:07:44', '2026-07-15 00:07:44'),
('36593a67-7fe1-11f1-aa6c-3cecef704050', '19a8e572-7fe1-11f1-aa6c-3cecef704050', 'b769767c-7fe0-11f1-aa6c-3cecef704050', '521e20eb-7fde-11f1-aa6c-3cecef704050', 20.00, 20.00, 0.00, 350.00, NULL, NULL, NULL, 'ACCEPTED', NULL, '2026-07-15 00:07:44', '2026-07-15 00:07:44'),
('36593b04-7fe1-11f1-aa6c-3cecef704050', '19a8e572-7fe1-11f1-aa6c-3cecef704050', 'b769fa4d-7fe0-11f1-aa6c-3cecef704050', '521e8ab5-7fde-11f1-aa6c-3cecef704050', 5.00, 5.00, 0.00, 4200.00, NULL, NULL, NULL, 'ACCEPTED', NULL, '2026-07-15 00:07:44', '2026-07-15 00:07:44');

-- --------------------------------------------------------

--
-- Table structure for table "holidays"
--

CREATE TABLE "holidays" (
  "id" UUID NOT NULL,
  "holiday_code" varchar(50) NOT NULL,
  "company_id" UUID DEFAULT NULL,
  "branch_id" UUID DEFAULT NULL,
  "holiday_name" varchar(200) NOT NULL,
  "holiday_date" date NOT NULL,
  "holiday_type" VARCHAR(100) CHECK ("holiday_type" IN ('PUBLIC','COMPANY','RELIGIOUS','SPECIAL')) NOT NULL DEFAULT 'PUBLIC',
  "recurring" smallint NOT NULL DEFAULT 1,
  "active" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "holidays"
--

INSERT INTO "holidays" ("id", "holiday_code", "company_id", "branch_id", "holiday_name", "holiday_date", "holiday_type", "recurring", "active", "remarks", "created_by", "created_at", "updated_at") VALUES
('aeebfe1c-8026-11f1-aa6c-3cecef704050', 'HOL-NEWYEAR', NULL, NULL, 'New Year''s Day', '2026-01-01', 'PUBLIC', 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aeec5afa-8026-11f1-aa6c-3cecef704050', 'HOL-INDEPENDENCE', NULL, NULL, 'Independence Day', '2026-02-04', 'PUBLIC', 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aeecc131-8026-11f1-aa6c-3cecef704050', 'HOL-MAYDAY', NULL, NULL, 'May Day', '2026-05-01', 'PUBLIC', 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02');

-- --------------------------------------------------------

--
-- Table structure for table "import_errors"
--

CREATE TABLE "import_errors" (
  "id" UUID NOT NULL,
  "import_job_id" UUID NOT NULL,
  "import_row" integer NOT NULL,
  "field_name" varchar(100) DEFAULT NULL,
  "field_data" text DEFAULT NULL,
  "error_type" VARCHAR(100) CHECK ("error_type" IN ('VALIDATION','DUPLICATE','FORMAT','REFERENCE','SYSTEM')) NOT NULL,
  "error_message" text NOT NULL,
  "corrected" smallint NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "import_errors"
--

INSERT INTO "import_errors" ("id", "import_job_id", "import_row", "field_name", "field_data", "error_type", "error_message", "corrected", "created_at") VALUES
('e337de0e-8024-11f1-aa6c-3cecef704050', 'fd102148-8023-11f1-aa6c-3cecef704050', 15, 'Serial Number', '', 'VALIDATION', 'Serial Number cannot be empty.', 0, '2026-07-15 08:12:11');

-- --------------------------------------------------------

--
-- Table structure for table "import_jobs"
--

CREATE TABLE "import_jobs" (
  "id" UUID NOT NULL,
  "import_no" varchar(50) NOT NULL,
  "import_type" VARCHAR(100) CHECK ("import_type" IN ('CUSTOMERS','INSTRUMENTS','SPARE_PARTS','SUPPLIERS','ENGINEERS','PM','CALIBRATION','OTHER')) NOT NULL,
  "original_file_name" varchar(255) NOT NULL,
  "stored_file_name" varchar(255) DEFAULT NULL,
  "file_storage_id" UUID DEFAULT NULL,
  "total_rows" integer NOT NULL DEFAULT 0,
  "successful_rows" integer NOT NULL DEFAULT 0,
  "failed_rows" integer NOT NULL DEFAULT 0,
  "duplicate_rows" integer NOT NULL DEFAULT 0,
  "skipped_rows" integer NOT NULL DEFAULT 0,
  "status" VARCHAR(100) CHECK ("status" IN ('UPLOADED','PROCESSING','COMPLETED','FAILED','CANCELLED')) NOT NULL DEFAULT 'UPLOADED',
  "started_at" timestamp DEFAULT NULL,
  "completed_at" timestamp DEFAULT NULL,
  "imported_by" UUID NOT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "import_jobs"
--

INSERT INTO "import_jobs" ("id", "import_no", "import_type", "original_file_name", "stored_file_name", "file_storage_id", "total_rows", "successful_rows", "failed_rows", "duplicate_rows", "skipped_rows", "status", "started_at", "completed_at", "imported_by", "remarks", "created_at", "updated_at") VALUES
('fd102148-8023-11f1-aa6c-3cecef704050', 'IMP-000001', 'INSTRUMENTS', 'instruments.xlsx', NULL, NULL, 250, 248, 2, 0, 0, 'COMPLETED', '2026-07-15 13:35:45', '2026-07-15 13:35:45', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 08:05:45', '2026-07-15 08:05:45');

-- --------------------------------------------------------

--
-- Table structure for table "instruments"
--

CREATE TABLE "instruments" (
  "id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "customer_id" UUID NOT NULL,
  "department_id" UUID DEFAULT NULL,
  "territory_id" UUID NOT NULL,
  "model_id" UUID NOT NULL,
  "assigned_engineer_id" UUID DEFAULT NULL,
  "asset_no" varchar(50) NOT NULL,
  "serial_no" varchar(100) NOT NULL,
  "inventory_no" varchar(100) DEFAULT NULL,
  "customer_asset_no" varchar(100) DEFAULT NULL,
  "instrument_name" varchar(200) NOT NULL,
  "installation_date" date DEFAULT NULL,
  "delivery_date" date DEFAULT NULL,
  "commissioning_date" date DEFAULT NULL,
  "warranty_start" date DEFAULT NULL,
  "warranty_end" date DEFAULT NULL,
  "service_interval_months" integer NOT NULL DEFAULT 12,
  "calibration_interval_months" integer NOT NULL DEFAULT 12,
  "last_pm_date" date DEFAULT NULL,
  "next_pm_date" date DEFAULT NULL,
  "last_calibration_date" date DEFAULT NULL,
  "next_calibration_date" date DEFAULT NULL,
  "lifecycle_status" VARCHAR(100) CHECK ("lifecycle_status" IN ('PENDING_INSTALLATION','INSTALLED','ACTIVE','UNDER_REPAIR','WORKSHOP','OUT_OF_SERVICE','SCRAPPED')) NOT NULL DEFAULT 'PENDING_INSTALLATION',
  "warranty_status" VARCHAR(100) CHECK ("warranty_status" IN ('UNDER_WARRANTY','OUT_OF_WARRANTY','AMC','CAMC')) DEFAULT 'UNDER_WARRANTY',
  "remarks" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "instruments"
--

INSERT INTO "instruments" ("id", "company_id", "customer_id", "department_id", "territory_id", "model_id", "assigned_engineer_id", "asset_no", "serial_no", "inventory_no", "customer_asset_no", "instrument_name", "installation_date", "delivery_date", "commissioning_date", "warranty_start", "warranty_end", "service_interval_months", "calibration_interval_months", "last_pm_date", "next_pm_date", "last_calibration_date", "next_calibration_date", "lifecycle_status", "warranty_status", "remarks", "active", "created_at", "updated_at") VALUES
('658854ed-7f7a-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '784ad52d-7f76-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', '24dded3b-7f79-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'AST000001', 'SN-ARCH-000001', NULL, NULL, 'Abbott ARCHITECT c4000', '2026-07-14', '2026-07-14', '2026-07-14', '2026-07-14', '2027-07-14', 12, 12, NULL, '2027-07-14', NULL, '2027-07-14', 'INSTALLED', 'UNDER_WARRANTY', NULL, 1, '2026-07-14 11:51:46', '2026-07-14 11:51:46');

-- --------------------------------------------------------

--
-- Table structure for table "instrument_categories"
--

CREATE TABLE "instrument_categories" (
  "id" UUID NOT NULL,
  "category_code" varchar(30) NOT NULL,
  "category_name" varchar(150) NOT NULL,
  "parent_category_id" UUID DEFAULT NULL,
  "description" text DEFAULT NULL,
  "calibration_required" smallint NOT NULL DEFAULT 0,
  "pm_required" smallint NOT NULL DEFAULT 1,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "instrument_categories"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "instrument_documents"
--

CREATE TABLE "instrument_documents" (
  "id" UUID NOT NULL,
  "instrument_id" UUID NOT NULL,
  "document_type" VARCHAR(100) CHECK ("document_type" IN ('USER_MANUAL','SERVICE_MANUAL','INSTALLATION_MANUAL','CALIBRATION_CERTIFICATE','IQ','OQ','PQ','WARRANTY_CARD','PURCHASE_ORDER','DELIVERY_NOTE','INVOICE','SERVICE_REPORT','PM_REPORT','CALIBRATION_REPORT','PHOTO','OTHER')) NOT NULL,
  "document_title" varchar(255) NOT NULL,
  "original_file_name" varchar(255) NOT NULL,
  "stored_file_name" varchar(255) NOT NULL,
  "file_path" varchar(500) NOT NULL,
  "file_extension" varchar(20) DEFAULT NULL,
  "mime_type" varchar(100) DEFAULT NULL,
  "file_size" bigint DEFAULT NULL,
  "version_no" varchar(20) DEFAULT '1.0',
  "uploaded_by" UUID DEFAULT NULL,
  "upload_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "remarks" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "instrument_documents"
--

INSERT INTO "instrument_documents" ("id", "instrument_id", "document_type", "document_title", "original_file_name", "stored_file_name", "file_path", "file_extension", "mime_type", "file_size", "version_no", "uploaded_by", "upload_date", "remarks", "active", "created_at", "updated_at") VALUES
('9fd32a58-7f7a-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'USER_MANUAL', 'Abbott ARCHITECT c4000 User Manual', 'Architect_c4000_User_Manual.pdf', '9fd32a73-7f7a-11f1-aa6c-3cecef704050', '/uploads/instruments/manuals/', 'pdf', 'application/pdf', NULL, '1.0', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:23:24', NULL, 1, '2026-07-14 11:53:24', '2026-07-14 11:53:24');

-- --------------------------------------------------------

--
-- Table structure for table "instrument_history"
--

CREATE TABLE "instrument_history" (
  "id" UUID NOT NULL,
  "instrument_id" UUID NOT NULL,
  "event_type" VARCHAR(100) CHECK ("event_type" IN ('REGISTERED','INSTALLED','COMMISSIONED','TRANSFERRED','PM_COMPLETED','CALIBRATED','SERVICE_VISIT','BREAKDOWN','WORKSHOP_IN','WORKSHOP_OUT','PART_REPLACED','SOFTWARE_UPDATED','WARRANTY_STARTED','WARRANTY_EXPIRED','AMC_STARTED','AMC_RENEWED','DECOMMISSIONED','SCRAPPED','OTHER')) NOT NULL,
  "event_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reference_type" VARCHAR(100) CHECK ("reference_type" IN ('INSTALLATION','SERVICE','PM','CALIBRATION','WORKSHOP','WARRANTY','AMC','MANUAL')) NOT NULL DEFAULT 'MANUAL',
  "reference_id" UUID DEFAULT NULL,
  "description" text NOT NULL,
  "previous_status" varchar(100) DEFAULT NULL,
  "new_status" varchar(100) DEFAULT NULL,
  "performed_by" UUID DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "instrument_history"
--

INSERT INTO "instrument_history" ("id", "instrument_id", "event_type", "event_date", "reference_type", "reference_id", "description", "previous_status", "new_status", "performed_by", "remarks", "created_at") VALUES
('efd0a9fc-7f7a-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'REGISTERED', '2026-07-14 17:25:38', 'MANUAL', NULL, 'Instrument registered in AVON ServicePro', NULL, 'INSTALLED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-14 11:55:38'),
('efd181be-7f7a-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'INSTALLED', '2026-07-14 17:25:38', 'INSTALLATION', NULL, 'Initial installation completed', 'PENDING_INSTALLATION', 'INSTALLED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-14 11:55:38');

-- --------------------------------------------------------

--
-- Table structure for table "instrument_models"
--

CREATE TABLE "instrument_models" (
  "id" UUID NOT NULL,
  "brand_id" UUID NOT NULL,
  "category_id" UUID NOT NULL,
  "model_code" varchar(50) NOT NULL,
  "model_name" varchar(150) NOT NULL,
  "manufacturer_model_no" varchar(100) DEFAULT NULL,
  "description" text DEFAULT NULL,
  "service_interval_months" integer NOT NULL DEFAULT 12,
  "warranty_months" integer NOT NULL DEFAULT 12,
  "calibration_required" smallint NOT NULL DEFAULT 0,
  "pm_required" smallint NOT NULL DEFAULT 1,
  "power_requirement" varchar(100) DEFAULT NULL,
  "dimensions" varchar(150) DEFAULT NULL,
  "weight_kg" decimal(8,2) DEFAULT NULL,
  "discontinued" smallint NOT NULL DEFAULT 0,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "instrument_models"
--

INSERT INTO "instrument_models" ("id", "brand_id", "category_id", "model_code", "model_name", "manufacturer_model_no", "description", "service_interval_months", "warranty_months", "calibration_required", "pm_required", "power_requirement", "dimensions", "weight_kg", "discontinued", "active", "created_at", "updated_at") VALUES
('24dded3b-7f79-11f1-aa6c-3cecef704050', '860f5119-7f77-11f1-aa6c-3cecef704050', 'c9dd1ba9-7f78-11f1-aa6c-3cecef704050', 'ARCHITECT_C4000', 'ARCHITECT c4000', 'ARCHITECT c4000', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48'),
('24deacbd-7f79-11f1-aa6c-3cecef704050', '861008ae-7f77-11f1-aa6c-3cecef704050', 'c9dd20f5-7f78-11f1-aa6c-3cecef704050', 'GELDOC_GO', 'GelDoc Go Imaging System', 'GelDoc Go', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48'),
('24df1144-7f79-11f1-aa6c-3cecef704050', '86125ece-7f77-11f1-aa6c-3cecef704050', 'c9dd2092-7f78-11f1-aa6c-3cecef704050', 'SYNERGY_H1', 'Synergy H1 Multimode Reader', 'Synergy H1', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48'),
('24dfbb8f-7f79-11f1-aa6c-3cecef704050', '86132d49-7f77-11f1-aa6c-3cecef704050', 'c9dd1e51-7f78-11f1-aa6c-3cecef704050', 'QTOWER3G', 'qTOWER³ G', 'qTOWER³ G', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48'),
('24e021c8-7f79-11f1-aa6c-3cecef704050', '86138c43-7f77-11f1-aa6c-3cecef704050', 'c9dd1e7d-7f78-11f1-aa6c-3cecef704050', 'B500', 'B-500 Research Microscope', 'B-500', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48'),
('24e0816c-7f79-11f1-aa6c-3cecef704050', '8612c556-7f77-11f1-aa6c-3cecef704050', 'c9dd1ec7-7f78-11f1-aa6c-3cecef704050', 'CENT5702', 'Centrifuge 5702', '5702', NULL, 12, 12, 1, 1, NULL, NULL, NULL, 0, 1, '2026-07-14 11:42:48', '2026-07-14 11:42:48');

-- --------------------------------------------------------

--
-- Table structure for table "inventory_locations"
--

CREATE TABLE "inventory_locations" (
  "id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "location_code" varchar(30) NOT NULL,
  "location_name" varchar(200) NOT NULL,
  "location_type" VARCHAR(100) CHECK ("location_type" IN ('MAIN_STORE','SERVICE_CENTER','WAREHOUSE','BRANCH_STORE','ENGINEER_VEHICLE','CUSTOMER_SITE')) NOT NULL,
  "address_line1" varchar(255) DEFAULT NULL,
  "address_line2" varchar(255) DEFAULT NULL,
  "city" varchar(100) DEFAULT NULL,
  "contact_person" varchar(150) DEFAULT NULL,
  "phone" varchar(30) DEFAULT NULL,
  "email" varchar(150) DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "inventory_locations"
--

INSERT INTO "inventory_locations" ("id", "company_id", "location_code", "location_name", "location_type", "address_line1", "address_line2", "city", "contact_person", "phone", "email", "active", "created_at", "updated_at") VALUES
('ef84ae2e-7fde-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'SC-NAV', 'Service Centre - Navinna', 'SERVICE_CENTER', 'Navinna', NULL, 'Maharagama', NULL, NULL, NULL, 1, '2026-07-14 23:51:27', '2026-07-14 23:51:27'),
('ef8565d2-7fde-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'GS-HOM', 'General Stores - Homagama', 'MAIN_STORE', 'Homagama', NULL, 'Homagama', NULL, NULL, NULL, 1, '2026-07-14 23:51:27', '2026-07-14 23:51:27');

-- --------------------------------------------------------

--
-- Table structure for table "inventory_stock"
--

CREATE TABLE "inventory_stock" (
  "id" UUID NOT NULL,
  "location_id" UUID NOT NULL,
  "part_id" UUID NOT NULL,
  "quantity_on_hand" decimal(12,2) NOT NULL DEFAULT 0.00,
  "quantity_reserved" decimal(12,2) NOT NULL DEFAULT 0.00,
  "quantity_available" decimal(12,2) GENERATED ALWAYS AS ("quantity_on_hand" - "quantity_reserved") STORED,
  "average_cost" decimal(18,2) NOT NULL DEFAULT 0.00,
  "last_purchase_cost" decimal(18,2) DEFAULT NULL,
  "last_updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "inventory_stock"
--

INSERT INTO "inventory_stock" ("id", "location_id", "part_id", "quantity_on_hand", "quantity_reserved", "average_cost", "last_purchase_cost", "last_updated", "remarks", "created_at", "updated_at") VALUES
('405a4984-7fdf-11f1-aa6c-3cecef704050', 'ef84ae2e-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', 5.00, 1.00, 18500.00, 18500.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42'),
('405afd7d-7fdf-11f1-aa6c-3cecef704050', 'ef84ae2e-7fde-11f1-aa6c-3cecef704050', '521e20eb-7fde-11f1-aa6c-3cecef704050', 20.00, 2.00, 350.00, 350.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42'),
('405b6138-7fdf-11f1-aa6c-3cecef704050', 'ef84ae2e-7fde-11f1-aa6c-3cecef704050', '521e8ab5-7fde-11f1-aa6c-3cecef704050', 3.00, 0.00, 4200.00, 4200.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42'),
('405bc236-7fdf-11f1-aa6c-3cecef704050', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', 25.00, 0.00, 18500.00, 18500.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42'),
('405c20a8-7fdf-11f1-aa6c-3cecef704050', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521e20eb-7fde-11f1-aa6c-3cecef704050', 100.00, 5.00, 350.00, 350.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42'),
('405c802f-7fdf-11f1-aa6c-3cecef704050', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521e8ab5-7fde-11f1-aa6c-3cecef704050', 12.00, 1.00, 4200.00, 4200.00, '2026-07-15 05:23:42', NULL, '2026-07-14 23:53:42', '2026-07-14 23:53:42');

-- --------------------------------------------------------

--
-- Table structure for table "inventory_transactions"
--

CREATE TABLE "inventory_transactions" (
  "id" UUID NOT NULL,
  "transaction_no" varchar(50) NOT NULL,
  "location_id" UUID NOT NULL,
  "part_id" UUID NOT NULL,
  "job_id" UUID DEFAULT NULL,
  "workshop_job_id" UUID DEFAULT NULL,
  "transaction_type" VARCHAR(100) CHECK ("transaction_type" IN ('OPENING','PURCHASE_RECEIPT','GOODS_RECEIPT','ISSUE_TO_JOB','RETURN_FROM_JOB','TRANSFER_OUT','TRANSFER_IN','ADJUSTMENT_IN','ADJUSTMENT_OUT','SCRAP','STOCK_TAKE')) NOT NULL,
  "reference_no" varchar(100) DEFAULT NULL,
  "quantity" decimal(12,2) NOT NULL,
  "unit_cost" decimal(18,2) NOT NULL,
  "total_cost" decimal(18,2) GENERATED ALWAYS AS ("quantity" * "unit_cost") STORED,
  "balance_after" decimal(12,2) DEFAULT NULL,
  "transaction_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "performed_by" UUID NOT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "inventory_transactions"
--

INSERT INTO "inventory_transactions" ("id", "transaction_no", "location_id", "part_id", "job_id", "workshop_job_id", "transaction_type", "reference_no", "quantity", "unit_cost", "balance_after", "transaction_date", "performed_by", "remarks", "created_at") VALUES
('a1735887-7fdf-11f1-aa6c-3cecef704050', 'IT-2026-000001', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', NULL, NULL, 'OPENING', 'OPENING-STOCK', 25.00, 18500.00, 25.00, '2026-07-15 05:26:25', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Opening Stock Balance', '2026-07-14 23:56:25'),
('a17427c0-7fdf-11f1-aa6c-3cecef704050', 'IT-2026-000002', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'ISSUE_TO_JOB', 'JOB-2026-000001', 1.00, 18500.00, 24.00, '2026-07-15 05:26:25', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Issued for Breakdown Repair', '2026-07-14 23:56:25'),
('a174a1f9-7fdf-11f1-aa6c-3cecef704050', 'IT-2026-000003', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', NULL, NULL, 'TRANSFER_OUT', 'TRF-2026-000001', 5.00, 18500.00, 19.00, '2026-07-15 05:26:25', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Transferred to Service Centre - Navinna', '2026-07-14 23:56:25'),
('a175162a-7fdf-11f1-aa6c-3cecef704050', 'IT-2026-000004', 'ef84ae2e-7fde-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', NULL, NULL, 'TRANSFER_IN', 'TRF-2026-000001', 5.00, 18500.00, 10.00, '2026-07-15 05:26:25', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Received from General Stores', '2026-07-14 23:56:25');

-- --------------------------------------------------------

--
-- Table structure for table "job_attachments"
--

CREATE TABLE "job_attachments" (
  "id" UUID NOT NULL,
  "job_id" UUID NOT NULL,
  "attachment_type" VARCHAR(100) CHECK ("attachment_type" IN ('PHOTO','VIDEO','SERVICE_REPORT','INSTALLATION_REPORT','PM_REPORT','CALIBRATION_REPORT','CUSTOMER_SIGNATURE','QUOTATION','INVOICE','PURCHASE_ORDER','PARTS_RECEIPT','WARRANTY_CARD','MANUAL','OTHER')) NOT NULL,
  "document_title" varchar(255) NOT NULL,
  "original_file_name" varchar(255) NOT NULL,
  "stored_file_name" varchar(255) NOT NULL,
  "file_path" varchar(500) NOT NULL,
  "file_extension" varchar(20) DEFAULT NULL,
  "mime_type" varchar(100) DEFAULT NULL,
  "file_size" bigint DEFAULT NULL,
  "uploaded_by" UUID DEFAULT NULL,
  "uploaded_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "remarks" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "job_attachments"
--

INSERT INTO "job_attachments" ("id", "job_id", "attachment_type", "document_title", "original_file_name", "stored_file_name", "file_path", "file_extension", "mime_type", "file_size", "uploaded_by", "uploaded_at", "remarks", "active", "created_at", "updated_at") VALUES
('6145f8b9-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'PHOTO', 'Before Repair Image', 'before_repair.jpg', '6145f8d8-7f7d-11f1-aa6c-3cecef704050.jpg', '/uploads/jobs/photos/', 'jpg', 'image/jpeg', 248563, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:43:08', NULL, 1, '2026-07-14 12:13:08', '2026-07-14 12:13:08'),
('6146e42d-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE_REPORT', 'Service Report', 'service_report.pdf', '6146e453-7f7d-11f1-aa6c-3cecef704050.pdf', '/uploads/jobs/reports/', 'pdf', 'application/pdf', 785412, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:43:08', NULL, 1, '2026-07-14 12:13:08', '2026-07-14 12:13:08');

-- --------------------------------------------------------

--
-- Table structure for table "job_checklists"
--

CREATE TABLE "job_checklists" (
  "id" UUID NOT NULL,
  "job_id" UUID NOT NULL,
  "checklist_type" VARCHAR(100) CHECK ("checklist_type" IN ('INSTALLATION','SERVICE','PM','CALIBRATION','WORKSHOP','QA')) NOT NULL,
  "section_name" varchar(150) NOT NULL,
  "item_no" integer NOT NULL,
  "checklist_item" varchar(255) NOT NULL,
  "result" VARCHAR(100) CHECK ("result" IN ('PASS','FAIL','NOT_APPLICABLE')) DEFAULT 'NOT_APPLICABLE',
  "measured_value" varchar(100) DEFAULT NULL,
  "specification" varchar(100) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "completed_by" UUID DEFAULT NULL,
  "completed_at" timestamp DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "job_checklists"
--

INSERT INTO "job_checklists" ("id", "job_id", "checklist_type", "section_name", "item_no", "checklist_item", "result", "measured_value", "specification", "remarks", "completed_by", "completed_at", "created_at", "updated_at") VALUES
('aaa5af6f-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE', 'General Inspection', 1, 'Instrument powers ON successfully', 'PASS', NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:45:11', '2026-07-14 12:15:11', '2026-07-14 12:15:11'),
('aaa68435-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE', 'General Inspection', 2, 'Self-test completed', 'PASS', NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:45:11', '2026-07-14 12:15:11', '2026-07-14 12:15:11'),
('aaa7070e-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE', 'Performance', 3, 'Performance verification completed', 'PASS', NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:45:11', '2026-07-14 12:15:11', '2026-07-14 12:15:11'),
('aaa781a0-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE', 'Documentation', 4, 'Customer informed', 'PASS', NULL, NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:45:11', '2026-07-14 12:15:11', '2026-07-14 12:15:11');

-- --------------------------------------------------------

--
-- Table structure for table "job_measurements"
--

CREATE TABLE "job_measurements" (
  "id" UUID NOT NULL,
  "job_id" UUID NOT NULL,
  "checklist_id" UUID DEFAULT NULL,
  "measurement_group" varchar(100) DEFAULT NULL,
  "parameter_name" varchar(150) NOT NULL,
  "parameter_code" varchar(50) DEFAULT NULL,
  "measured_value" decimal(18,6) DEFAULT NULL,
  "measured_text" varchar(255) DEFAULT NULL,
  "unit" varchar(30) DEFAULT NULL,
  "minimum_value" decimal(18,6) DEFAULT NULL,
  "maximum_value" decimal(18,6) DEFAULT NULL,
  "nominal_value" decimal(18,6) DEFAULT NULL,
  "tolerance" decimal(18,6) DEFAULT NULL,
  "result" VARCHAR(100) CHECK ("result" IN ('PASS','FAIL','NOT_APPLICABLE')) NOT NULL DEFAULT 'NOT_APPLICABLE',
  "measuring_device" varchar(150) DEFAULT NULL,
  "measuring_device_serial" varchar(100) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "measured_by" UUID DEFAULT NULL,
  "measured_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "job_measurements"
--

INSERT INTO "job_measurements" ("id", "job_id", "checklist_id", "measurement_group", "parameter_name", "parameter_code", "measured_value", "measured_text", "unit", "minimum_value", "maximum_value", "nominal_value", "tolerance", "result", "measuring_device", "measuring_device_serial", "remarks", "measured_by", "measured_at", "created_at", "updated_at") VALUES
('e898123e-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'Temperature', 'Internal Temperature', 'TEMP', 37.200000, NULL, '°C', 36.500000, 37.500000, NULL, NULL, 'PASS', 'Digital Thermometer', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:46:55', '2026-07-14 12:16:55', '2026-07-14 12:16:55'),
('e898df37-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'Electrical', 'Input Voltage', 'VIN', 230.500000, NULL, 'VAC', 220.000000, 240.000000, NULL, NULL, 'PASS', 'Fluke 87V', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:46:55', '2026-07-14 12:16:55', '2026-07-14 12:16:55'),
('e8998a52-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'Mechanical', 'Rotor Speed', 'RPM', 3000.000000, NULL, 'RPM', 2950.000000, 3050.000000, NULL, NULL, 'PASS', 'Tachometer', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:46:55', '2026-07-14 12:16:55', '2026-07-14 12:16:55');

-- --------------------------------------------------------

--
-- Table structure for table "job_parts"
--

CREATE TABLE "job_parts" (
  "id" UUID NOT NULL,
  "job_id" UUID NOT NULL,
  "part_number" varchar(100) NOT NULL,
  "part_name" varchar(255) NOT NULL,
  "manufacturer" varchar(150) DEFAULT NULL,
  "quantity_requested" decimal(10,2) NOT NULL DEFAULT 1.00,
  "quantity_received" decimal(10,2) DEFAULT 0.00,
  "quantity_used" decimal(10,2) DEFAULT 0.00,
  "unit_price" decimal(18,2) DEFAULT 0.00,
  "supplier_name" varchar(200) DEFAULT NULL,
  "purchase_order_no" varchar(100) DEFAULT NULL,
  "ordered_date" date DEFAULT NULL,
  "expected_date" date DEFAULT NULL,
  "received_date" date DEFAULT NULL,
  "installed_date" date DEFAULT NULL,
  "status" VARCHAR(100) CHECK ("status" IN ('REQUESTED','ORDERED','PARTIALLY_RECEIVED','RECEIVED','INSTALLED','RETURNED','CANCELLED')) NOT NULL DEFAULT 'REQUESTED',
  "tracking_no" varchar(100) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "job_parts"
--

INSERT INTO "job_parts" ("id", "job_id", "part_number", "part_name", "manufacturer", "quantity_requested", "quantity_received", "quantity_used", "unit_price", "supplier_name", "purchase_order_no", "ordered_date", "expected_date", "received_date", "installed_date", "status", "tracking_no", "remarks", "created_by", "created_at", "updated_at") VALUES
('2d86ba18-7f7d-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'TEMP-SENSOR-001', 'Temperature Sensor', 'Abbott', 1.00, 0.00, 0.00, 18500.00, 'AVON Stores', 'PO-2026-000001', '2026-07-14', '2026-07-21', NULL, NULL, 'ORDERED', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 12:11:41', '2026-07-14 12:11:41');

-- --------------------------------------------------------

--
-- Table structure for table "job_parts_consumption"
--

CREATE TABLE "job_parts_consumption" (
  "id" UUID NOT NULL,
  "job_id" UUID NOT NULL,
  "job_part_id" UUID DEFAULT NULL,
  "instrument_id" UUID NOT NULL,
  "part_number" varchar(100) NOT NULL,
  "part_name" varchar(255) NOT NULL,
  "serial_no" varchar(100) DEFAULT NULL,
  "batch_no" varchar(100) DEFAULT NULL,
  "quantity_used" decimal(10,2) NOT NULL DEFAULT 1.00,
  "unit_cost" decimal(18,2) NOT NULL DEFAULT 0.00,
  "total_cost" decimal(18,2) GENERATED ALWAYS AS ("quantity_used" * "unit_cost") STORED,
  "replaced_component" varchar(255) DEFAULT NULL,
  "replacement_reason" varchar(255) DEFAULT NULL,
  "installed_by" UUID DEFAULT NULL,
  "installed_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "job_parts_consumption"
--

INSERT INTO "job_parts_consumption" ("id", "job_id", "job_part_id", "instrument_id", "part_number", "part_name", "serial_no", "batch_no", "quantity_used", "unit_cost", "replaced_component", "replacement_reason", "installed_by", "installed_date", "remarks", "created_at", "updated_at") VALUES
('279d013a-7f7e-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', '2d86ba18-7f7d-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'TEMP-SENSOR-001', 'Temperature Sensor', NULL, NULL, 1.00, 18500.00, 'Temperature Sensor', 'Sensor Failure', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:48:40', NULL, '2026-07-14 12:18:40', '2026-07-14 12:18:40');

-- --------------------------------------------------------

--
-- Table structure for table "job_reports"
--

CREATE TABLE "job_reports" (
  "id" UUID NOT NULL,
  "job_id" UUID NOT NULL,
  "report_type" VARCHAR(100) CHECK ("report_type" IN ('SERVICE','INSTALLATION','PM','CALIBRATION','WORKSHOP','INSPECTION')) NOT NULL,
  "report_no" varchar(50) NOT NULL,
  "engineer_summary" text DEFAULT NULL,
  "customer_complaint" text DEFAULT NULL,
  "root_cause" text DEFAULT NULL,
  "corrective_action" text DEFAULT NULL,
  "preventive_action" text DEFAULT NULL,
  "recommendations" text DEFAULT NULL,
  "customer_feedback" text DEFAULT NULL,
  "customer_signature_name" varchar(150) DEFAULT NULL,
  "customer_signed" smallint NOT NULL DEFAULT 0,
  "signed_date" timestamp DEFAULT NULL,
  "engineer_id" UUID NOT NULL,
  "report_status" VARCHAR(100) CHECK ("report_status" IN ('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED')) NOT NULL DEFAULT 'DRAFT',
  "submitted_at" timestamp DEFAULT NULL,
  "approved_by" UUID DEFAULT NULL,
  "approved_at" timestamp DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "job_reports"
--

INSERT INTO "job_reports" ("id", "job_id", "report_type", "report_no", "engineer_summary", "customer_complaint", "root_cause", "corrective_action", "preventive_action", "recommendations", "customer_feedback", "customer_signature_name", "customer_signed", "signed_date", "engineer_id", "report_status", "submitted_at", "approved_by", "approved_at", "remarks", "created_at", "updated_at") VALUES
('605168ec-7f7e-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'SERVICE', 'SRPT-2026-000001', 'Instrument restored to normal operating condition.', 'Temperature alarm displayed during startup.', 'Temperature sensor failure.', 'Temperature sensor replaced and system recalibrated.', NULL, 'Perform preventive maintenance every 6 months.', 'Equipment working satisfactorily.', 'Chief Medical Laboratory Technologist', 1, '2026-07-14 17:50:15', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'SUBMITTED', '2026-07-14 17:50:15', NULL, NULL, NULL, '2026-07-14 12:20:15', '2026-07-14 12:20:15');

-- --------------------------------------------------------

--
-- Table structure for table "job_status_history"
--

CREATE TABLE "job_status_history" (
  "id" UUID NOT NULL,
  "job_id" UUID NOT NULL,
  "previous_status" VARCHAR(100) CHECK ("previous_status" IN ('PENDING_ASSIGNMENT','ASSIGNED','SCHEDULED','TRAVELLING','ON_SITE','WORKSHOP_REQUIRED','PARTS_ORDERED','PARTS_RECEIVED','QA_CHECK','COMPLETED','CLOSED','CANCELLED')) DEFAULT NULL,
  "new_status" VARCHAR(100) CHECK ("new_status" IN ('PENDING_ASSIGNMENT','ASSIGNED','SCHEDULED','TRAVELLING','ON_SITE','WORKSHOP_REQUIRED','PARTS_ORDERED','PARTS_RECEIVED','QA_CHECK','COMPLETED','CLOSED','CANCELLED')) NOT NULL,
  "changed_by" UUID DEFAULT NULL,
  "changed_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reason" varchar(255) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "latitude" decimal(10,7) DEFAULT NULL,
  "longitude" decimal(10,7) DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "job_status_history"
--

INSERT INTO "job_status_history" ("id", "job_id", "previous_status", "new_status", "changed_by", "changed_at", "reason", "remarks", "latitude", "longitude", "created_at") VALUES
('b50a6efa-7f7c-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', NULL, 'ASSIGNED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:38:19', 'Initial Assignment', 'Job assigned to engineer.', NULL, NULL, '2026-07-14 12:08:19'),
('b50b2569-7f7c-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'ASSIGNED', 'SCHEDULED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 17:38:19', 'Visit Scheduled', 'Customer visit scheduled.', NULL, NULL, '2026-07-14 12:08:19');

-- --------------------------------------------------------

--
-- Table structure for table "job_visits"
--

CREATE TABLE "job_visits" (
  "id" UUID NOT NULL,
  "job_id" UUID NOT NULL,
  "visit_no" integer NOT NULL,
  "engineer_id" UUID NOT NULL,
  "visit_type" VARCHAR(100) CHECK ("visit_type" IN ('ONSITE','REMOTE','WORKSHOP','FOLLOW_UP','DELIVERY','INSTALLATION')) NOT NULL DEFAULT 'ONSITE',
  "visit_date" date NOT NULL,
  "check_in" timestamp DEFAULT NULL,
  "check_out" timestamp DEFAULT NULL,
  "travel_start" timestamp DEFAULT NULL,
  "travel_end" timestamp DEFAULT NULL,
  "travel_distance_km" decimal(8,2) DEFAULT 0.00,
  "labour_hours" decimal(8,2) DEFAULT 0.00,
  "latitude_in" decimal(10,7) DEFAULT NULL,
  "longitude_in" decimal(10,7) DEFAULT NULL,
  "latitude_out" decimal(10,7) DEFAULT NULL,
  "longitude_out" decimal(10,7) DEFAULT NULL,
  "customer_contact" varchar(150) DEFAULT NULL,
  "customer_signature" smallint DEFAULT 0,
  "work_performed" text DEFAULT NULL,
  "findings" text DEFAULT NULL,
  "recommendations" text DEFAULT NULL,
  "next_action" text DEFAULT NULL,
  "visit_status" VARCHAR(100) CHECK ("visit_status" IN ('IN_PROGRESS','COMPLETED','CANCELLED')) NOT NULL DEFAULT 'COMPLETED',
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "job_visits"
--

INSERT INTO "job_visits" ("id", "job_id", "visit_no", "engineer_id", "visit_type", "visit_date", "check_in", "check_out", "travel_start", "travel_end", "travel_distance_km", "labour_hours", "latitude_in", "longitude_in", "latitude_out", "longitude_out", "customer_contact", "customer_signature", "work_performed", "findings", "recommendations", "next_action", "visit_status", "created_at", "updated_at") VALUES
('f917dc9b-7f7c-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'ONSITE', '2026-07-14', '2026-07-14 17:40:13', '2026-07-14 19:40:13', NULL, NULL, 32.50, 2.00, NULL, NULL, NULL, NULL, 'Chief Medical Laboratory Technologist', 1, 'Performed diagnostic inspection and corrective maintenance.', 'Temperature sensor calibration drift detected.', 'Replace temperature sensor and perform full calibration.', NULL, 'COMPLETED', '2026-07-14 12:10:13', '2026-07-14 12:10:13');

-- --------------------------------------------------------

--
-- Table structure for table "kpi_evaluations"
--

CREATE TABLE "kpi_evaluations" (
  "id" UUID NOT NULL,
  "evaluation_no" varchar(50) NOT NULL,
  "employee_id" UUID NOT NULL,
  "financial_year_id" UUID NOT NULL,
  "evaluation_period" VARCHAR(100) CHECK ("evaluation_period" IN ('MONTHLY','QUARTERLY','HALF_YEARLY','YEARLY')) NOT NULL,
  "period_year" SMALLINT NOT NULL,
  "period_month" smallint DEFAULT NULL,
  "evaluation_start" date NOT NULL,
  "evaluation_end" date NOT NULL,
  "total_weight" decimal(8,2) NOT NULL DEFAULT 0.00,
  "weighted_score" decimal(8,2) NOT NULL DEFAULT 0.00,
  "performance_percentage" decimal(8,2) NOT NULL DEFAULT 0.00,
  "performance_grade" VARCHAR(100) CHECK ("performance_grade" IN ('A+','A','B+','B','C','D','F')) DEFAULT NULL,
  "performance_rating" VARCHAR(100) CHECK ("performance_rating" IN ('OUTSTANDING','EXCEEDS_EXPECTATION','MEETS_EXPECTATION','NEEDS_IMPROVEMENT','UNSATISFACTORY')) DEFAULT NULL,
  "strengths" text DEFAULT NULL,
  "improvements" text DEFAULT NULL,
  "employee_comments" text DEFAULT NULL,
  "evaluator_comments" text DEFAULT NULL,
  "evaluation_status" VARCHAR(100) CHECK ("evaluation_status" IN ('DRAFT','SUBMITTED','REVIEWED','APPROVED','REJECTED')) NOT NULL DEFAULT 'DRAFT',
  "evaluated_by" UUID NOT NULL,
  "approved_by" UUID DEFAULT NULL,
  "evaluated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "approved_at" timestamp DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "kpi_evaluations"
--

INSERT INTO "kpi_evaluations" ("id", "evaluation_no", "employee_id", "financial_year_id", "evaluation_period", "period_year", "period_month", "evaluation_start", "evaluation_end", "total_weight", "weighted_score", "performance_percentage", "performance_grade", "performance_rating", "strengths", "improvements", "employee_comments", "evaluator_comments", "evaluation_status", "evaluated_by", "approved_by", "evaluated_at", "approved_at", "created_at", "updated_at") VALUES
('1f18208c-8035-11f1-aa6c-3cecef704050', 'EVAL-000001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'a38dff65-8030-11f1-aa6c-3cecef704050', 'MONTHLY', 2026, 7, '2026-07-01', '2026-07-31', 100.00, 92.50, 92.50, 'A', 'EXCEEDS_EXPECTATION', NULL, NULL, NULL, NULL, 'APPROVED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, '2026-07-15 15:38:23', NULL, '2026-07-15 10:08:23', '2026-07-15 10:08:23');

-- --------------------------------------------------------

--
-- Table structure for table "kpi_master"
--

CREATE TABLE "kpi_master" (
  "id" UUID NOT NULL,
  "kpi_code" varchar(50) NOT NULL,
  "kpi_name" varchar(255) NOT NULL,
  "kpi_category" VARCHAR(100) CHECK ("kpi_category" IN ('SERVICE','WORKSHOP','CALIBRATION','QUALITY','SAFETY','CUSTOMER','FINANCIAL','ADMINISTRATION','INVENTORY','HR','MARKETING','GENERAL')) NOT NULL,
  "description" text DEFAULT NULL,
  "measurement_type" VARCHAR(100) CHECK ("measurement_type" IN ('PERCENTAGE','NUMBER','CURRENCY','DAYS','HOURS','COUNT','BOOLEAN','MANUAL')) NOT NULL,
  "scoring_method" VARCHAR(100) CHECK ("scoring_method" IN ('TARGET_ACHIEVEMENT','HIGHER_IS_BETTER','LOWER_IS_BETTER','PASS_FAIL','DEDUCTION_PER_ERROR','DEDUCTION_PER_INCIDENT','MANUAL_SCORE')) NOT NULL,
  "target_value" decimal(18,4) DEFAULT NULL,
  "minimum_value" decimal(18,4) DEFAULT NULL,
  "maximum_value" decimal(18,4) DEFAULT NULL,
  "base_score" decimal(8,2) NOT NULL DEFAULT 100.00,
  "maximum_score" decimal(8,2) NOT NULL DEFAULT 100.00,
  "minimum_score" decimal(8,2) NOT NULL DEFAULT 0.00,
  "deduction_per_error" decimal(8,2) DEFAULT 0.00,
  "deduction_per_incident" decimal(8,2) DEFAULT 0.00,
  "comparison_operator" VARCHAR(100) CHECK ("comparison_operator" IN ('>','>=','=','<=','<')) DEFAULT '>=',
  "evaluation_frequency" VARCHAR(100) CHECK ("evaluation_frequency" IN ('DAILY','WEEKLY','MONTHLY','QUARTERLY','YEARLY')) NOT NULL DEFAULT 'YEARLY',
  "calculation_method" VARCHAR(100) CHECK ("calculation_method" IN ('AUTOMATIC','MANUAL','HYBRID')) NOT NULL DEFAULT 'AUTOMATIC',
  "allow_manual_override" smallint NOT NULL DEFAULT 0,
  "display_order" integer NOT NULL DEFAULT 1,
  "active" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "kpi_master"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "kpi_measurements"
--

CREATE TABLE "kpi_measurements" (
  "id" UUID NOT NULL,
  "measurement_no" varchar(50) NOT NULL,
  "assignment_id" UUID NOT NULL,
  "measurement_period" VARCHAR(100) CHECK ("measurement_period" IN ('DAILY','WEEKLY','MONTHLY','QUARTERLY','YEARLY')) NOT NULL,
  "measurement_year" SMALLINT NOT NULL,
  "measurement_month" smallint DEFAULT NULL,
  "measurement_date" date NOT NULL,
  "target_value" decimal(18,4) DEFAULT NULL,
  "actual_value" decimal(18,4) DEFAULT NULL,
  "achievement_percentage" decimal(8,2) DEFAULT NULL,
  "raw_score" decimal(8,2) DEFAULT NULL,
  "deduction_count" integer NOT NULL DEFAULT 0,
  "deduction_marks" decimal(8,2) NOT NULL DEFAULT 0.00,
  "final_score" decimal(8,2) DEFAULT NULL,
  "measurement_status" VARCHAR(100) CHECK ("measurement_status" IN ('DRAFT','SUBMITTED','APPROVED','REJECTED')) NOT NULL DEFAULT 'DRAFT',
  "measured_by" UUID NOT NULL,
  "approved_by" UUID DEFAULT NULL,
  "approved_at" timestamp DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "kpi_measurements"
--

INSERT INTO "kpi_measurements" ("id", "measurement_no", "assignment_id", "measurement_period", "measurement_year", "measurement_month", "measurement_date", "target_value", "actual_value", "achievement_percentage", "raw_score", "deduction_count", "deduction_marks", "final_score", "measurement_status", "measured_by", "approved_by", "approved_at", "remarks", "created_at", "updated_at") VALUES
('481c78d3-8034-11f1-aa6c-3cecef704050', 'KPIM-000001', 'b611a57d-8033-11f1-aa6c-3cecef704050', 'MONTHLY', 2026, 7, '2026-07-15', 100.0000, 100.0000, 100.00, 100.00, 0, 0.00, 100.00, 'APPROVED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, '2026-07-15 10:02:22', '2026-07-15 10:02:22');

-- --------------------------------------------------------

--
-- Table structure for table "kpi_measurement_rules"
--

CREATE TABLE "kpi_measurement_rules" (
  "id" UUID NOT NULL,
  "rule_code" varchar(50) NOT NULL,
  "kpi_id" UUID NOT NULL,
  "rule_name" varchar(200) NOT NULL,
  "calculation_type" VARCHAR(100) CHECK ("calculation_type" IN ('AUTOMATIC','MANUAL','HYBRID')) NOT NULL DEFAULT 'AUTOMATIC',
  "calculation_method" VARCHAR(100) CHECK ("calculation_method" IN ('PERCENTAGE','AVERAGE','SUM','COUNT','FORMULA','DEDUCTION','PASS_FAIL')) NOT NULL,
  "source_module" VARCHAR(100) CHECK ("source_module" IN ('SERVICE','INSTALLATION','PM','CALIBRATION','WORKSHOP','CUSTOMER_FEEDBACK','INVENTORY','PURCHASING','FINANCE','HR','MANUAL')) NOT NULL,
  "source_table" varchar(100) DEFAULT NULL,
  "numerator_field" varchar(100) DEFAULT NULL,
  "denominator_field" varchar(100) DEFAULT NULL,
  "value_field" varchar(100) DEFAULT NULL,
  "filter_condition" text DEFAULT NULL,
  "formula_expression" text DEFAULT NULL,
  "target_days" integer DEFAULT NULL,
  "deduction_per_error" decimal(8,2) DEFAULT 0.00,
  "deduction_per_incident" decimal(8,2) DEFAULT 0.00,
  "maximum_score" decimal(8,2) DEFAULT 100.00,
  "minimum_score" decimal(8,2) DEFAULT 0.00,
  "auto_calculate" smallint NOT NULL DEFAULT 1,
  "verification_required" smallint NOT NULL DEFAULT 0,
  "active" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "kpi_measurement_rules"
--

INSERT INTO "kpi_measurement_rules" ("id", "rule_code", "kpi_id", "rule_name", "calculation_type", "calculation_method", "source_module", "source_table", "numerator_field", "denominator_field", "value_field", "filter_condition", "formula_expression", "target_days", "deduction_per_error", "deduction_per_incident", "maximum_score", "minimum_score", "auto_calculate", "verification_required", "active", "remarks", "created_by", "created_at", "updated_at") VALUES
('c73e4492-8036-11f1-aa6c-3cecef704050', 'RULE001', '968b5c60-8033-11f1-aa6c-3cecef704050', 'Installation completed within 15 days', 'AUTOMATIC', 'PERCENTAGE', 'INSTALLATION', 'installations', 'completed_within_target', 'total_installations', NULL, NULL, NULL, 15, 0.00, 0.00, 100.00, 0.00, 1, 0, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:20:15', '2026-07-15 10:20:15'),
('c73ece72-8036-11f1-aa6c-3cecef704050', 'RULE002', '968b5fe4-8033-11f1-aa6c-3cecef704050', 'Customer Satisfaction Average', 'AUTOMATIC', 'AVERAGE', 'CUSTOMER_FEEDBACK', 'customer_feedback', NULL, NULL, 'rating', NULL, NULL, NULL, 0.00, 0.00, 100.00, 0.00, 1, 0, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:20:15', '2026-07-15 10:20:15'),
('c73f4373-8036-11f1-aa6c-3cecef704050', 'RULE003', '968b6557-8033-11f1-aa6c-3cecef704050', 'Documentation Accuracy', 'HYBRID', 'DEDUCTION', 'MANUAL', 'document_review_audit', NULL, NULL, 'error_count', NULL, NULL, NULL, 10.00, 0.00, 100.00, 0.00, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:20:15', '2026-07-15 10:20:15'),
('c73fbab1-8036-11f1-aa6c-3cecef704050', 'RULE004', '968b683c-8033-11f1-aa6c-3cecef704050', 'Inventory Accuracy', 'HYBRID', 'DEDUCTION', 'INVENTORY', 'inventory_transactions', NULL, NULL, 'incident_count', NULL, NULL, NULL, 0.00, 25.00, 100.00, 0.00, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:20:15', '2026-07-15 10:20:15');

-- --------------------------------------------------------

--
-- Table structure for table "kpi_role_mapping"
--

CREATE TABLE "kpi_role_mapping" (
  "id" UUID NOT NULL,
  "kpi_id" UUID NOT NULL,
  "role_id" UUID NOT NULL,
  "organizational_unit_id" UUID DEFAULT NULL,
  "default_weight" decimal(6,2) NOT NULL DEFAULT 10.00,
  "mandatory" smallint NOT NULL DEFAULT 1,
  "active" smallint NOT NULL DEFAULT 1,
  "effective_from" date DEFAULT NULL,
  "effective_to" date DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "label_templates"
--

CREATE TABLE "label_templates" (
  "id" UUID NOT NULL,
  "template_code" varchar(50) NOT NULL,
  "template_name" varchar(150) NOT NULL,
  "label_width_mm" decimal(8,2) NOT NULL,
  "label_height_mm" decimal(8,2) NOT NULL,
  "printer_dpi" integer DEFAULT 300,
  "template_json" text NOT NULL,
  "active" smallint DEFAULT 1,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "label_templates"
--

INSERT INTO "label_templates" ("id", "template_code", "template_name", "label_width_mm", "label_height_mm", "printer_dpi", "template_json", "active", "created_by", "created_at", "updated_at") VALUES
('1d07b85e-8023-11f1-aa6c-3cecef704050', 'AST_LABEL_A', 'Standard Instrument Asset Label', 50.00, 25.00, 300, '{"company": "AVON", "show_logo": true, "show_asset_no": true, "show_serial_no": true, "show_model": true, "show_qr": true, "show_barcode": true}', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:59:29', '2026-07-15 07:59:29');

-- --------------------------------------------------------

--
-- Table structure for table "license_management"
--

CREATE TABLE "license_management" (
  "id" UUID NOT NULL,
  "license_no" varchar(50) NOT NULL,
  "license_name" varchar(200) NOT NULL,
  "license_type" VARCHAR(100) CHECK ("license_type" IN ('APPLICATION','OPERATING_SYSTEM','DATABASE','ANTIVIRUS','OFFICE','DEVICE','CALIBRATION','OTHER')) NOT NULL,
  "vendor_name" varchar(200) DEFAULT NULL,
  "product_name" varchar(200) DEFAULT NULL,
  "version" varchar(50) DEFAULT NULL,
  "license_key" varchar(500) DEFAULT NULL,
  "company_id" UUID NOT NULL,
  "assigned_user_id" UUID DEFAULT NULL,
  "assigned_device" varchar(200) DEFAULT NULL,
  "seats_purchased" integer DEFAULT 1,
  "seats_used" integer DEFAULT 0,
  "purchase_date" date DEFAULT NULL,
  "activation_date" date DEFAULT NULL,
  "expiry_date" date DEFAULT NULL,
  "maintenance_expiry" date DEFAULT NULL,
  "purchase_cost" decimal(18,2) DEFAULT NULL,
  "renewal_cost" decimal(18,2) DEFAULT NULL,
  "currency" varchar(10) DEFAULT 'LKR',
  "status" VARCHAR(100) CHECK ("status" IN ('ACTIVE','EXPIRED','SUSPENDED','REVOKED')) NOT NULL DEFAULT 'ACTIVE',
  "auto_renew" smallint NOT NULL DEFAULT 0,
  "reminder_days" integer DEFAULT 30,
  "remarks" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "license_management"
--

INSERT INTO "license_management" ("id", "license_no", "license_name", "license_type", "vendor_name", "product_name", "version", "license_key", "company_id", "assigned_user_id", "assigned_device", "seats_purchased", "seats_used", "purchase_date", "activation_date", "expiry_date", "maintenance_expiry", "purchase_cost", "renewal_cost", "currency", "status", "auto_renew", "reminder_days", "remarks", "created_by", "created_at", "updated_at") VALUES
('b87b4155-800b-11f1-aa6c-3cecef704050', 'LIC-2026-000001', 'Avon ServicePro Production License', 'APPLICATION', 'AVON PHARMO CHEM (PVT) LTD', 'Avon ServicePro', '1.0.0', NULL, 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Production Server', 10, 1, '2026-07-15', '2026-07-15', '2027-07-15', '2027-07-15', 0.00, 0.00, 'LKR', 'ACTIVE', 1, 30, 'Primary production license.', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:12:02', '2026-07-15 05:12:02'),
('b87c1044-800b-11f1-aa6c-3cecef704050', 'LIC-2026-000002', 'Microsoft Office 365', 'OFFICE', 'Microsoft', 'Microsoft 365 Business', '2026', NULL, 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', NULL, NULL, 1, 0, '2026-07-15', NULL, '2027-07-15', NULL, 180000.00, NULL, 'LKR', 'ACTIVE', 0, 30, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:12:02', '2026-07-15 05:12:02'),
('b87c947d-800b-11f1-aa6c-3cecef704050', 'LIC-2026-000003', 'Windows Server License', 'OPERATING_SYSTEM', 'Microsoft', 'Windows Server 2025', '2025', NULL, 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', NULL, NULL, 1, 0, '2026-07-15', NULL, '2029-07-15', NULL, 450000.00, NULL, 'LKR', 'ACTIVE', 0, 30, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:12:02', '2026-07-15 05:12:02');

-- --------------------------------------------------------

--
-- Table structure for table "login_history"
--

CREATE TABLE "login_history" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "login_time" timestamp NOT NULL,
  "logout_time" timestamp DEFAULT NULL,
  "ip_address" varchar(45) DEFAULT NULL,
  "user_agent" text DEFAULT NULL,
  "login_status" VARCHAR(100) CHECK ("login_status" IN ('SUCCESS','FAILED','LOCKED')) NOT NULL,
  "session_token" varchar(255) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "login_history"
--

INSERT INTO "login_history" ("id", "user_id", "login_time", "logout_time", "ip_address", "user_agent", "login_status", "session_token", "remarks", "created_at") VALUES
('afc8d111-7f72-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14 16:26:35', NULL, NULL, NULL, 'SUCCESS', NULL, 'Initial administrator login', '2026-07-14 10:56:35');

-- --------------------------------------------------------

--
-- Table structure for table "manufacturers"
--

CREATE TABLE "manufacturers" (
  "id" UUID NOT NULL,
  "manufacturer_code" varchar(30) NOT NULL,
  "manufacturer_name" varchar(200) NOT NULL,
  "country_id" UUID DEFAULT NULL,
  "website" varchar(255) DEFAULT NULL,
  "email" varchar(150) DEFAULT NULL,
  "phone" varchar(30) DEFAULT NULL,
  "support_email" varchar(150) DEFAULT NULL,
  "support_phone" varchar(30) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "manufacturers"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "modules"
--

CREATE TABLE "modules" (
  "id" UUID NOT NULL,
  "module_code" varchar(50) NOT NULL,
  "module_name" varchar(150) NOT NULL,
  "description" text DEFAULT NULL,
  "display_order" integer NOT NULL DEFAULT 0,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "modules"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "notifications"
--

CREATE TABLE "notifications" (
  "id" UUID NOT NULL,
  "notification_no" varchar(50) NOT NULL,
  "recipient_user_id" UUID DEFAULT NULL,
  "customer_id" UUID DEFAULT NULL,
  "service_job_id" UUID DEFAULT NULL,
  "notification_type" VARCHAR(100) CHECK ("notification_type" IN ('SYSTEM','SERVICE_REQUEST','JOB_ASSIGNED','JOB_COMPLETED','PM_DUE','CALIBRATION_DUE','WARRANTY_EXPIRING','AMC_EXPIRING','PARTS_RECEIVED','PURCHASE_ORDER','STOCK_ALERT','CUSTOMER_FEEDBACK','LOGIN','SECURITY','OTHER')) NOT NULL,
  "channel" VARCHAR(100) CHECK ("channel" IN ('IN_APP','EMAIL','SMS','WHATSAPP','PUSH')) NOT NULL DEFAULT 'IN_APP',
  "priority" VARCHAR(100) CHECK ("priority" IN ('LOW','NORMAL','HIGH','URGENT')) NOT NULL DEFAULT 'NORMAL',
  "subject" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "scheduled_at" timestamp DEFAULT NULL,
  "sent_at" timestamp DEFAULT NULL,
  "read_at" timestamp DEFAULT NULL,
  "delivery_status" VARCHAR(100) CHECK ("delivery_status" IN ('PENDING','QUEUED','SENT','DELIVERED','READ','FAILED')) NOT NULL DEFAULT 'PENDING',
  "retry_count" integer NOT NULL DEFAULT 0,
  "error_message" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "notifications"
--

INSERT INTO "notifications" ("id", "notification_no", "recipient_user_id", "customer_id", "service_job_id", "notification_type", "channel", "priority", "subject", "message", "scheduled_at", "sent_at", "read_at", "delivery_status", "retry_count", "error_message", "created_at", "updated_at") VALUES
('3dd1d150-8004-11f1-aa6c-3cecef704050', 'NOT-2026-000001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'JOB_ASSIGNED', 'IN_APP', 'HIGH', 'New Service Job Assigned', 'Service Job JOB-2026-000001 has been assigned to you.', '2026-07-15 09:48:29', NULL, NULL, 'SENT', 0, NULL, '2026-07-15 04:18:29', '2026-07-15 04:18:29'),
('3dd2b2ce-8004-11f1-aa6c-3cecef704050', 'NOT-2026-000002', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'PM_DUE', 'EMAIL', 'NORMAL', 'Preventive Maintenance Reminder', 'Preventive Maintenance is due within the next 7 days.', '2026-07-15 09:48:29', NULL, NULL, 'PENDING', 0, NULL, '2026-07-15 04:18:29', '2026-07-15 04:18:29'),
('3dd30e8b-8004-11f1-aa6c-3cecef704050', 'NOT-2026-000003', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'STOCK_ALERT', 'IN_APP', 'URGENT', 'Low Stock Alert', 'Temperature Sensor stock has reached the reorder level.', '2026-07-15 09:48:29', NULL, NULL, 'PENDING', 0, NULL, '2026-07-15 04:18:29', '2026-07-15 04:18:29');

-- --------------------------------------------------------

--
-- Table structure for table "notification_templates"
--

CREATE TABLE "notification_templates" (
  "id" UUID NOT NULL,
  "template_code" varchar(50) NOT NULL,
  "template_name" varchar(150) NOT NULL,
  "notification_type" VARCHAR(100) CHECK ("notification_type" IN ('SYSTEM','SERVICE_REQUEST','JOB_ASSIGNED','JOB_COMPLETED','PM_DUE','CALIBRATION_DUE','WARRANTY_EXPIRING','AMC_EXPIRING','PARTS_RECEIVED','PURCHASE_ORDER','STOCK_ALERT','CUSTOMER_FEEDBACK','LOGIN','SECURITY','OTHER')) NOT NULL,
  "channel" VARCHAR(100) CHECK ("channel" IN ('IN_APP','EMAIL','SMS','WHATSAPP','PUSH')) NOT NULL,
  "subject" varchar(255) NOT NULL,
  "message_template" text NOT NULL,
  "variables" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "notification_templates"
--

INSERT INTO "notification_templates" ("id", "template_code", "template_name", "notification_type", "channel", "subject", "message_template", "variables", "active", "created_by", "created_at", "updated_at") VALUES
('b5599b8b-8004-11f1-aa6c-3cecef704050', 'TMP_JOB_ASSIGNED', 'Job Assignment', 'JOB_ASSIGNED', 'EMAIL', 'New Service Job Assigned', 'Dear {{ENGINEER_NAME}}, Service Job {{JOB_NO}} has been assigned for {{CUSTOMER_NAME}}.', 'ENGINEER_NAME,JOB_NO,CUSTOMER_NAME', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:21:50', '2026-07-15 04:21:50'),
('b55a7b76-8004-11f1-aa6c-3cecef704050', 'TMP_PM_DUE', 'PM Reminder', 'PM_DUE', 'EMAIL', 'Preventive Maintenance Due', 'Instrument {{ASSET_NO}} is due for Preventive Maintenance on {{DUE_DATE}}.', 'ASSET_NO,DUE_DATE', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:21:50', '2026-07-15 04:21:50'),
('b55afea0-8004-11f1-aa6c-3cecef704050', 'TMP_WARRANTY', 'Warranty Expiry', 'WARRANTY_EXPIRING', 'EMAIL', 'Warranty Expiry Notice', 'Warranty for {{ASSET_NO}} will expire on {{EXPIRY_DATE}}.', 'ASSET_NO,EXPIRY_DATE', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:21:50', '2026-07-15 04:21:50'),
('b55b8a1d-8004-11f1-aa6c-3cecef704050', 'TMP_STOCK_ALERT', 'Stock Alert', 'STOCK_ALERT', 'IN_APP', 'Low Stock Alert', '{{PART_NAME}} has reached the reorder level. Current Stock: {{CURRENT_STOCK}}', 'PART_NAME,CURRENT_STOCK', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:21:50', '2026-07-15 04:21:50');

-- --------------------------------------------------------

--
-- Table structure for table "organizational_units"
--

CREATE TABLE "organizational_units" (
  "id" UUID NOT NULL,
  "unit_code" varchar(30) NOT NULL,
  "company_id" UUID NOT NULL,
  "branch_id" UUID DEFAULT NULL,
  "parent_unit_id" UUID DEFAULT NULL,
  "unit_name" varchar(150) NOT NULL,
  "short_name" varchar(50) DEFAULT NULL,
  "unit_type" VARCHAR(100) CHECK ("unit_type" IN ('COMPANY','DIVISION','DEPARTMENT','SECTION','TEAM','UNIT')) NOT NULL DEFAULT 'DEPARTMENT',
  "manager_user_id" UUID DEFAULT NULL,
  "email" varchar(150) DEFAULT NULL,
  "telephone" varchar(30) DEFAULT NULL,
  "location" varchar(200) DEFAULT NULL,
  "display_order" integer NOT NULL DEFAULT 1,
  "active" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "organizational_units"
--

INSERT INTO "organizational_units" ("id", "unit_code", "company_id", "branch_id", "parent_unit_id", "unit_name", "short_name", "unit_type", "manager_user_id", "email", "telephone", "location", "display_order", "active", "remarks", "created_by", "created_at", "updated_at") VALUES
('79495228-802c-11f1-aa6c-3cecef704050', 'SRV', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Service Department', 'Service', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29'),
('7949c816-802c-11f1-aa6c-3cecef704050', 'WRK', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Workshop Department', 'Workshop', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 2, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29'),
('794a3467-802c-11f1-aa6c-3cecef704050', 'CAL', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Calibration Department', 'Calibration', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 3, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29'),
('794a9be1-802c-11f1-aa6c-3cecef704050', 'ADM', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Administration', 'Admin', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 4, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29'),
('794afcc1-802c-11f1-aa6c-3cecef704050', 'RND', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Research & Development', 'R&D', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 5, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29'),
('794b64fa-802c-11f1-aa6c-3cecef704050', 'MKT', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', NULL, 'Marketing Support', 'Marketing', 'DEPARTMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 6, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 09:06:29', '2026-07-15 09:06:29');

-- --------------------------------------------------------

--
-- Table structure for table "permissions"
--

CREATE TABLE "permissions" (
  "id" UUID NOT NULL,
  "module_id" UUID NOT NULL,
  "permission_code" varchar(100) NOT NULL,
  "permission_name" varchar(150) NOT NULL,
  "action_name" VARCHAR(100) CHECK ("action_name" IN ('VIEW','CREATE','EDIT','DELETE','APPROVE','EXPORT','IMPORT','PRINT','ASSIGN')) NOT NULL,
  "description" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "permissions"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "pm_execution"
--

CREATE TABLE "pm_execution" (
  "id" UUID NOT NULL,
  "pm_schedule_id" UUID NOT NULL,
  "job_id" UUID DEFAULT NULL,
  "engineer_id" UUID NOT NULL,
  "execution_date" date NOT NULL,
  "start_time" timestamp DEFAULT NULL,
  "end_time" timestamp DEFAULT NULL,
  "customer_contact" varchar(150) DEFAULT NULL,
  "customer_signature" smallint NOT NULL DEFAULT 0,
  "instrument_condition" VARCHAR(100) CHECK ("instrument_condition" IN ('EXCELLENT','GOOD','FAIR','POOR','FAILED')) NOT NULL DEFAULT 'GOOD',
  "work_performed" text DEFAULT NULL,
  "observations" text DEFAULT NULL,
  "recommendations" text DEFAULT NULL,
  "next_pm_due" date DEFAULT NULL,
  "execution_status" VARCHAR(100) CHECK ("execution_status" IN ('DRAFT','COMPLETED','VERIFIED')) NOT NULL DEFAULT 'DRAFT',
  "verified_by" UUID DEFAULT NULL,
  "verified_at" timestamp DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "pm_execution"
--

INSERT INTO "pm_execution" ("id", "pm_schedule_id", "job_id", "engineer_id", "execution_date", "start_time", "end_time", "customer_contact", "customer_signature", "instrument_condition", "work_performed", "observations", "recommendations", "next_pm_due", "execution_status", "verified_by", "verified_at", "remarks", "created_at", "updated_at") VALUES
('de122bb4-7f7f-11f1-aa6c-3cecef704050', 'abac377a-7f7f-11f1-aa6c-3cecef704050', NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14', '2026-07-14 18:00:56', '2026-07-14 19:30:56', 'Chief Medical Laboratory Technologist', 1, 'GOOD', 'Completed preventive maintenance according to manufacturer checklist.', 'Instrument operating within specification.', 'Continue routine preventive maintenance.', '2028-07-14', 'COMPLETED', NULL, NULL, NULL, '2026-07-14 12:30:56', '2026-07-14 12:30:56');

-- --------------------------------------------------------

--
-- Table structure for table "pm_notifications"
--

CREATE TABLE "pm_notifications" (
  "id" UUID NOT NULL,
  "pm_schedule_id" UUID NOT NULL,
  "recipient_user_id" UUID NOT NULL,
  "notification_type" VARCHAR(100) CHECK ("notification_type" IN ('PM_CREATED','PM_REMINDER','PM_DUE','PM_OVERDUE','PM_COMPLETED','PM_CANCELLED')) NOT NULL,
  "notification_channel" VARCHAR(100) CHECK ("notification_channel" IN ('SYSTEM','EMAIL','SMS','WHATSAPP')) NOT NULL DEFAULT 'SYSTEM',
  "subject" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "scheduled_send" timestamp NOT NULL,
  "sent_at" timestamp DEFAULT NULL,
  "read_at" timestamp DEFAULT NULL,
  "status" VARCHAR(100) CHECK ("status" IN ('PENDING','SENT','DELIVERED','READ','FAILED')) NOT NULL DEFAULT 'PENDING',
  "retry_count" integer NOT NULL DEFAULT 0,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "pm_notifications"
--

INSERT INTO "pm_notifications" ("id", "pm_schedule_id", "recipient_user_id", "notification_type", "notification_channel", "subject", "message", "scheduled_send", "sent_at", "read_at", "status", "retry_count", "remarks", "created_at", "updated_at") VALUES
('1c5d627f-7f80-11f1-aa6c-3cecef704050', 'abac377a-7f7f-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'PM_CREATED', 'SYSTEM', 'Preventive Maintenance Scheduled', 'PM Schedule PM-2026-000001 has been assigned.', '2026-07-14 18:02:40', NULL, NULL, 'PENDING', 0, NULL, '2026-07-14 12:32:40', '2026-07-14 12:32:40');

-- --------------------------------------------------------

--
-- Table structure for table "pm_schedules"
--

CREATE TABLE "pm_schedules" (
  "id" UUID NOT NULL,
  "instrument_id" UUID NOT NULL,
  "warranty_activation_id" UUID DEFAULT NULL,
  "schedule_no" varchar(50) NOT NULL,
  "pm_no" integer NOT NULL,
  "planned_date" date NOT NULL,
  "due_date" date NOT NULL,
  "scheduled_date" date DEFAULT NULL,
  "completed_date" date DEFAULT NULL,
  "assigned_engineer_id" UUID DEFAULT NULL,
  "job_id" UUID DEFAULT NULL,
  "service_interval_months" integer NOT NULL,
  "schedule_status" VARCHAR(100) CHECK ("schedule_status" IN ('PENDING','SCHEDULED','IN_PROGRESS','COMPLETED','OVERDUE','CANCELLED')) NOT NULL DEFAULT 'PENDING',
  "generated_automatically" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "pm_schedules"
--

INSERT INTO "pm_schedules" ("id", "instrument_id", "warranty_activation_id", "schedule_no", "pm_no", "planned_date", "due_date", "scheduled_date", "completed_date", "assigned_engineer_id", "job_id", "service_interval_months", "schedule_status", "generated_automatically", "remarks", "created_at", "updated_at") VALUES
('abac377a-7f7f-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '68943ef6-7f7f-11f1-aa6c-3cecef704050', 'PM-2026-000001', 1, '2027-07-14', '2027-07-14', NULL, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, 12, 'PENDING', 1, NULL, '2026-07-14 12:29:31', '2026-07-14 12:29:31');

-- --------------------------------------------------------

--
-- Table structure for table "provinces"
--

CREATE TABLE "provinces" (
  "id" UUID NOT NULL,
  "country_id" UUID NOT NULL,
  "province_code" varchar(10) NOT NULL,
  "province_name" varchar(100) NOT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "provinces"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "purchase_orders"
--

CREATE TABLE "purchase_orders" (
  "id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "supplier_id" UUID NOT NULL,
  "location_id" UUID NOT NULL,
  "po_no" varchar(50) NOT NULL,
  "po_date" date NOT NULL,
  "expected_delivery_date" date DEFAULT NULL,
  "currency" varchar(10) NOT NULL DEFAULT 'LKR',
  "subtotal" decimal(18,2) NOT NULL DEFAULT 0.00,
  "discount_amount" decimal(18,2) NOT NULL DEFAULT 0.00,
  "tax_amount" decimal(18,2) NOT NULL DEFAULT 0.00,
  "total_amount" decimal(18,2) NOT NULL DEFAULT 0.00,
  "status" VARCHAR(100) CHECK ("status" IN ('DRAFT','PENDING_APPROVAL','APPROVED','ORDERED','PARTIALLY_RECEIVED','RECEIVED','CANCELLED')) NOT NULL DEFAULT 'DRAFT',
  "ordered_by" UUID NOT NULL,
  "approved_by" UUID DEFAULT NULL,
  "approved_date" timestamp DEFAULT NULL,
  "supplier_reference" varchar(100) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "purchase_orders"
--

INSERT INTO "purchase_orders" ("id", "company_id", "supplier_id", "location_id", "po_no", "po_date", "expected_delivery_date", "currency", "subtotal", "discount_amount", "tax_amount", "total_amount", "status", "ordered_by", "approved_by", "approved_date", "supplier_reference", "remarks", "created_at", "updated_at") VALUES
('5dbdd081-7fe0-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'fd7c87de-7fdf-11f1-aa6c-3cecef704050', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', 'PO-2026-000001', '2026-07-15', '2026-07-29', 'LKR', 18500.00, 0.00, 0.00, 18500.00, 'ORDERED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:31:41', NULL, 'Temperature Sensor Purchase', '2026-07-15 00:01:41', '2026-07-15 00:01:41');

-- --------------------------------------------------------

--
-- Table structure for table "purchase_order_items"
--

CREATE TABLE "purchase_order_items" (
  "id" UUID NOT NULL,
  "purchase_order_id" UUID NOT NULL,
  "part_id" UUID NOT NULL,
  "line_no" integer NOT NULL,
  "quantity_ordered" decimal(12,2) NOT NULL,
  "quantity_received" decimal(12,2) NOT NULL DEFAULT 0.00,
  "unit_price" decimal(18,2) NOT NULL,
  "discount_percent" decimal(6,2) NOT NULL DEFAULT 0.00,
  "tax_percent" decimal(6,2) NOT NULL DEFAULT 0.00,
  "line_total" decimal(18,2) GENERATED ALWAYS AS (round("quantity_ordered" * "unit_price" - "quantity_ordered" * "unit_price" * "discount_percent" / 100 + ("quantity_ordered" * "unit_price" - "quantity_ordered" * "unit_price" * "discount_percent" / 100) * "tax_percent" / 100,2)) STORED,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "purchase_order_items"
--

INSERT INTO "purchase_order_items" ("id", "purchase_order_id", "part_id", "line_no", "quantity_ordered", "quantity_received", "unit_price", "discount_percent", "tax_percent", "remarks", "created_at", "updated_at") VALUES
('b768a770-7fe0-11f1-aa6c-3cecef704050', '5dbdd081-7fe0-11f1-aa6c-3cecef704050', '521d76c4-7fde-11f1-aa6c-3cecef704050', 1, 10.00, 0.00, 18500.00, 0.00, 0.00, 'Temperature Sensors', '2026-07-15 00:04:11', '2026-07-15 00:04:11'),
('b769767c-7fe0-11f1-aa6c-3cecef704050', '5dbdd081-7fe0-11f1-aa6c-3cecef704050', '521e20eb-7fde-11f1-aa6c-3cecef704050', 2, 20.00, 0.00, 350.00, 0.00, 0.00, 'Glass Fuses', '2026-07-15 00:04:11', '2026-07-15 00:04:11'),
('b769fa4d-7fe0-11f1-aa6c-3cecef704050', '5dbdd081-7fe0-11f1-aa6c-3cecef704050', '521e8ab5-7fde-11f1-aa6c-3cecef704050', 3, 5.00, 0.00, 4200.00, 0.00, 0.00, 'Cooling Fans', '2026-07-15 00:04:11', '2026-07-15 00:04:11');

-- --------------------------------------------------------

--
-- Table structure for table "qr_codes"
--

CREATE TABLE "qr_codes" (
  "id" UUID NOT NULL,
  "qr_code_no" varchar(50) NOT NULL,
  "entity_type" VARCHAR(100) CHECK ("entity_type" IN ('INSTRUMENT','CUSTOMER','SERVICE_JOB','PM','CALIBRATION','WORKSHOP','SPARE_PART')) NOT NULL,
  "entity_id" UUID NOT NULL,
  "qr_value" varchar(1000) NOT NULL,
  "qr_version" SMALLINT DEFAULT 5,
  "error_correction" VARCHAR(100) CHECK ("error_correction" IN ('L','M','Q','H')) DEFAULT 'M',
  "active" smallint NOT NULL DEFAULT 1,
  "generated_by" UUID DEFAULT NULL,
  "generated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "qr_codes"
--

INSERT INTO "qr_codes" ("id", "qr_code_no", "entity_type", "entity_id", "qr_value", "qr_version", "error_correction", "active", "generated_by", "generated_at", "remarks", "created_at", "updated_at") VALUES
('1d012087-8023-11f1-aa6c-3cecef704050', 'QR-000001', 'INSTRUMENT', '658854ed-7f7a-11f1-aa6c-3cecef704050', 'AST:AST000001', 5, 'M', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 13:29:29', NULL, '2026-07-15 07:59:29', '2026-07-15 07:59:29');

-- --------------------------------------------------------

--
-- Table structure for table "recent_activity"
--

CREATE TABLE "recent_activity" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "entity_type" VARCHAR(100) CHECK ("entity_type" IN ('CUSTOMER','INSTRUMENT','SERVICE_JOB','REPORT','PART')) NOT NULL,
  "entity_id" UUID NOT NULL,
  "activity" VARCHAR(100) CHECK ("activity" IN ('VIEW','EDIT','CREATE','DOWNLOAD')) NOT NULL,
  "activity_time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "recent_activity"
--

INSERT INTO "recent_activity" ("id", "user_id", "entity_type", "entity_id", "activity", "activity_time") VALUES
('d2761f37-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'CUSTOMER', '08d2bede-7f76-11f1-aa6c-3cecef704050', 'VIEW', '2026-07-15 12:51:36');

-- --------------------------------------------------------

--
-- Table structure for table "report_execution_history"
--

CREATE TABLE "report_execution_history" (
  "id" UUID NOT NULL,
  "execution_no" varchar(50) NOT NULL,
  "report_id" UUID NOT NULL,
  "executed_by" UUID NOT NULL,
  "execution_time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "execution_status" VARCHAR(100) CHECK ("execution_status" IN ('SUCCESS','FAILED','CANCELLED')) NOT NULL DEFAULT 'SUCCESS',
  "export_format" VARCHAR(100) CHECK ("export_format" IN ('PDF','EXCEL','CSV','SCREEN')) NOT NULL DEFAULT 'SCREEN',
  "records_returned" integer DEFAULT 0,
  "execution_duration_ms" integer DEFAULT NULL,
  "file_name" varchar(255) DEFAULT NULL,
  "file_size_kb" decimal(12,2) DEFAULT NULL,
  "filter_values" jsonb DEFAULT NULL,
  "error_message" text DEFAULT NULL,
  "ip_address" varchar(45) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "report_execution_history"
--

INSERT INTO "report_execution_history" ("id", "execution_no", "report_id", "executed_by", "execution_time", "execution_status", "export_format", "records_returned", "execution_duration_ms", "file_name", "file_size_kb", "filter_values", "error_message", "ip_address", "remarks", "created_at") VALUES
('6761427d-8009-11f1-aa6c-3cecef704050', 'RPTRUN-2026-000001', 'ad142bbc-8006-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:25:27', 'SUCCESS', 'PDF', 125, 542, 'Service_Job_Summary.pdf', 865.40, NULL, NULL, '127.0.0.1', NULL, '2026-07-15 04:55:27'),
('6761fe15-8009-11f1-aa6c-3cecef704050', 'RPTRUN-2026-000002', 'ad14de17-8006-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:25:27', 'SUCCESS', 'EXCEL', 52, 318, 'Inventory_Report.xlsx', 420.75, NULL, NULL, '127.0.0.1', NULL, '2026-07-15 04:55:27'),
('67626a8d-8009-11f1-aa6c-3cecef704050', 'RPTRUN-2026-000003', 'ad15435b-8006-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 10:25:27', 'SUCCESS', 'PDF', 18, 274, 'PM_Due_Report.pdf', 210.30, NULL, NULL, '127.0.0.1', NULL, '2026-07-15 04:55:27');

-- --------------------------------------------------------

--
-- Table structure for table "roles"
--

CREATE TABLE "roles" (
  "id" UUID NOT NULL,
  "role_code" varchar(50) NOT NULL,
  "role_name" varchar(150) NOT NULL,
  "description" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "roles"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "role_permissions"
--

CREATE TABLE "role_permissions" (
  "id" UUID NOT NULL,
  "role_id" UUID NOT NULL,
  "permission_id" UUID NOT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "role_permissions"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "saved_filters"
--

CREATE TABLE "saved_filters" (
  "id" UUID NOT NULL,
  "filter_code" varchar(50) NOT NULL,
  "user_id" UUID NOT NULL,
  "module_name" varchar(100) NOT NULL,
  "filter_name" varchar(150) NOT NULL,
  "filter_definition" jsonb NOT NULL,
  "is_default" smallint NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "saved_filters"
--

INSERT INTO "saved_filters" ("id", "filter_code", "user_id", "module_name", "filter_name", "filter_definition", "is_default", "created_at", "updated_at") VALUES
('d26f1a97-801d-11f1-aa6c-3cecef704050', 'SF-001', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'SERVICE', 'My Open Jobs', '{"status": "OPEN"}', 1, '2026-07-15 07:21:36', '2026-07-15 07:21:36');

-- --------------------------------------------------------

--
-- Table structure for table "saved_reports"
--

CREATE TABLE "saved_reports" (
  "id" UUID NOT NULL,
  "report_code" varchar(50) NOT NULL,
  "report_name" varchar(200) NOT NULL,
  "report_category" VARCHAR(100) CHECK ("report_category" IN ('SERVICE','INSTALLATION','CUSTOMER','INSTRUMENT','PM','CALIBRATION','PARTS','INVENTORY','PURCHASE','AMC','FINANCE','MANAGEMENT','CUSTOM')) NOT NULL,
  "report_type" VARCHAR(100) CHECK ("report_type" IN ('TABLE','SUMMARY','CHART','DASHBOARD')) NOT NULL DEFAULT 'TABLE',
  "description" text DEFAULT NULL,
  "sql_query" text DEFAULT NULL,
  "filter_definition" jsonb DEFAULT NULL,
  "chart_definition" jsonb DEFAULT NULL,
  "default_export" VARCHAR(100) CHECK ("default_export" IN ('PDF','EXCEL','CSV')) DEFAULT 'PDF',
  "is_system_report" smallint NOT NULL DEFAULT 0,
  "active" smallint NOT NULL DEFAULT 1,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "saved_reports"
--

INSERT INTO "saved_reports" ("id", "report_code", "report_name", "report_category", "report_type", "description", "sql_query", "filter_definition", "chart_definition", "default_export", "is_system_report", "active", "created_by", "created_at", "updated_at") VALUES
('ad142bbc-8006-11f1-aa6c-3cecef704050', 'SRV001', 'Service Job Summary', 'SERVICE', 'TABLE', 'Summary of all service jobs.', NULL, NULL, NULL, 'PDF', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:35:55', '2026-07-15 04:35:55'),
('ad14de17-8006-11f1-aa6c-3cecef704050', 'INV001', 'Inventory Stock Report', 'INVENTORY', 'TABLE', 'Current inventory balances.', NULL, NULL, NULL, 'EXCEL', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:35:55', '2026-07-15 04:35:55'),
('ad15435b-8006-11f1-aa6c-3cecef704050', 'PM001', 'Preventive Maintenance Due', 'PM', 'TABLE', 'Upcoming preventive maintenance schedules.', NULL, NULL, NULL, 'PDF', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:35:55', '2026-07-15 04:35:55'),
('ad15a325-8006-11f1-aa6c-3cecef704050', 'CAL001', 'Calibration Due Report', 'CALIBRATION', 'TABLE', 'Upcoming calibration schedules.', NULL, NULL, NULL, 'PDF', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:35:55', '2026-07-15 04:35:55'),
('ad1606f3-8006-11f1-aa6c-3cecef704050', 'MGT001', 'Management Dashboard', 'MANAGEMENT', 'DASHBOARD', 'Executive KPI dashboard.', NULL, NULL, NULL, 'PDF', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 04:35:55', '2026-07-15 04:35:55');

-- --------------------------------------------------------

--
-- Table structure for table "sequence_numbers"
--

CREATE TABLE "sequence_numbers" (
  "id" UUID NOT NULL,
  "sequence_code" varchar(50) NOT NULL,
  "document_name" varchar(150) NOT NULL,
  "company_id" UUID DEFAULT NULL,
  "branch_id" UUID DEFAULT NULL,
  "prefix" varchar(20) NOT NULL,
  "suffix" varchar(20) DEFAULT NULL,
  "include_year" smallint NOT NULL DEFAULT 1,
  "include_month" smallint NOT NULL DEFAULT 0,
  "number_separator" varchar(5) NOT NULL DEFAULT '-',
  "number_length" integer NOT NULL DEFAULT 6,
  "current_number" bigint NOT NULL DEFAULT 0,
  "increment_by" integer NOT NULL DEFAULT 1,
  "reset_rule" VARCHAR(100) CHECK ("reset_rule" IN ('NEVER','YEARLY','MONTHLY','DAILY')) NOT NULL DEFAULT 'YEARLY',
  "last_reset_date" date DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "sequence_numbers"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "service_contracts"
--

CREATE TABLE "service_contracts" (
  "id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "customer_id" UUID NOT NULL,
  "contract_no" varchar(50) NOT NULL,
  "contract_type" VARCHAR(100) CHECK ("contract_type" IN ('AMC','CAMC','WARRANTY','PM_ONLY','CALIBRATION','COMPREHENSIVE')) NOT NULL,
  "contract_title" varchar(255) NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "contract_value" decimal(18,2) DEFAULT 0.00,
  "currency" varchar(10) DEFAULT 'LKR',
  "response_time_hours" integer DEFAULT 24,
  "preventive_visits_per_year" integer DEFAULT 2,
  "calibration_visits_per_year" integer DEFAULT 1,
  "status" VARCHAR(100) CHECK ("status" IN ('DRAFT','ACTIVE','EXPIRED','TERMINATED')) NOT NULL DEFAULT 'ACTIVE',
  "remarks" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "service_contracts"
--

INSERT INTO "service_contracts" ("id", "company_id", "customer_id", "contract_no", "contract_type", "contract_title", "start_date", "end_date", "contract_value", "currency", "response_time_hours", "preventive_visits_per_year", "calibration_visits_per_year", "status", "remarks", "active", "created_at", "updated_at") VALUES
('49b2ddcb-7f7b-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', 'AMC-2026-0001', 'AMC', 'Annual Maintenance Contract', '2026-07-14', '2027-07-14', 350000.00, 'LKR', 24, 2, 1, 'ACTIVE', NULL, 1, '2026-07-14 11:58:09', '2026-07-14 11:58:09');

-- --------------------------------------------------------

--
-- Table structure for table "service_jobs"
--

CREATE TABLE "service_jobs" (
  "id" UUID NOT NULL,
  "service_request_id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "customer_id" UUID NOT NULL,
  "instrument_id" UUID NOT NULL,
  "territory_id" UUID NOT NULL,
  "assigned_engineer_id" UUID DEFAULT NULL,
  "job_no" varchar(50) NOT NULL,
  "job_type" VARCHAR(100) CHECK ("job_type" IN ('BREAKDOWN','PM','CALIBRATION','INSTALLATION','INSPECTION','TRAINING','DEMO','WARRANTY','AMC','OTHER')) NOT NULL,
  "priority" VARCHAR(100) CHECK ("priority" IN ('LOW','MEDIUM','HIGH','URGENT','CRITICAL')) NOT NULL DEFAULT 'MEDIUM',
  "status" VARCHAR(100) CHECK ("status" IN ('PENDING_ASSIGNMENT','ASSIGNED','SCHEDULED','TRAVELLING','ON_SITE','WORKSHOP_REQUIRED','PARTS_ORDERED','PARTS_RECEIVED','QA_CHECK','COMPLETED','CLOSED','CANCELLED')) NOT NULL DEFAULT 'PENDING_ASSIGNMENT',
  "scheduled_date" timestamp DEFAULT NULL,
  "travel_start" timestamp DEFAULT NULL,
  "onsite_start" timestamp DEFAULT NULL,
  "onsite_finish" timestamp DEFAULT NULL,
  "workshop_in" timestamp DEFAULT NULL,
  "workshop_out" timestamp DEFAULT NULL,
  "completed_date" timestamp DEFAULT NULL,
  "closed_date" timestamp DEFAULT NULL,
  "labour_hours" decimal(6,2) DEFAULT 0.00,
  "travel_distance_km" decimal(8,2) DEFAULT 0.00,
  "customer_signature" smallint DEFAULT 0,
  "engineer_notes" text DEFAULT NULL,
  "internal_notes" text DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "service_jobs"
--

INSERT INTO "service_jobs" ("id", "service_request_id", "company_id", "customer_id", "instrument_id", "territory_id", "assigned_engineer_id", "job_no", "job_type", "priority", "status", "scheduled_date", "travel_start", "onsite_start", "onsite_finish", "workshop_in", "workshop_out", "completed_date", "closed_date", "labour_hours", "travel_distance_km", "customer_signature", "engineer_notes", "internal_notes", "created_at", "updated_at") VALUES
('6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'b3abec83-7f7b-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'JOB-2026-000001', 'BREAKDOWN', 'HIGH', 'ASSIGNED', '2026-07-14 17:36:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0, NULL, NULL, '2026-07-14 12:06:22', '2026-07-14 12:06:22');

-- --------------------------------------------------------

--
-- Table structure for table "service_requests"
--

CREATE TABLE "service_requests" (
  "id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "customer_id" UUID NOT NULL,
  "department_id" UUID DEFAULT NULL,
  "contact_id" UUID DEFAULT NULL,
  "instrument_id" UUID DEFAULT NULL,
  "territory_id" UUID NOT NULL,
  "request_no" varchar(50) NOT NULL,
  "request_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "request_type" VARCHAR(100) CHECK ("request_type" IN ('BREAKDOWN','PREVENTIVE_MAINTENANCE','CALIBRATION','INSTALLATION','TRAINING','DEMONSTRATION','INSPECTION','WARRANTY','AMC','OTHER')) NOT NULL,
  "priority" VARCHAR(100) CHECK ("priority" IN ('LOW','MEDIUM','HIGH','URGENT','CRITICAL')) NOT NULL DEFAULT 'MEDIUM',
  "request_source" VARCHAR(100) CHECK ("request_source" IN ('PHONE','EMAIL','WEB','WHATSAPP','ENGINEER','VISIT','OTHER')) NOT NULL DEFAULT 'PHONE',
  "problem_description" text NOT NULL,
  "requested_by" varchar(150) DEFAULT NULL,
  "contact_number" varchar(30) DEFAULT NULL,
  "status" VARCHAR(100) CHECK ("status" IN ('NEW','ASSIGNED','SCHEDULED','IN_PROGRESS','PENDING_PARTS','COMPLETED','CANCELLED')) NOT NULL DEFAULT 'NEW',
  "assigned_engineer_id" UUID DEFAULT NULL,
  "scheduled_date" timestamp DEFAULT NULL,
  "completed_date" timestamp DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "service_requests"
--

INSERT INTO "service_requests" ("id", "company_id", "customer_id", "department_id", "contact_id", "instrument_id", "territory_id", "request_no", "request_date", "request_type", "priority", "request_source", "problem_description", "requested_by", "contact_number", "status", "assigned_engineer_id", "scheduled_date", "completed_date", "remarks", "active", "created_at", "updated_at") VALUES
('b3abec83-7f7b-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '784ad52d-7f76-11f1-aa6c-3cecef704050', 'c7a6b23f-7f76-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'SR-2026-000001', '2026-07-14 17:31:07', 'BREAKDOWN', 'HIGH', 'PHONE', 'Instrument displays temperature error during startup.', 'Nimal Perera', '0777000001', 'NEW', 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, NULL, 1, '2026-07-14 12:01:07', '2026-07-14 12:01:07');

-- --------------------------------------------------------

--
-- Table structure for table "spare_parts"
--

CREATE TABLE "spare_parts" (
  "id" UUID NOT NULL,
  "part_number" varchar(100) NOT NULL,
  "manufacturer_part_no" varchar(100) DEFAULT NULL,
  "part_name" varchar(255) NOT NULL,
  "description" text DEFAULT NULL,
  "manufacturer_id" UUID DEFAULT NULL,
  "brand_id" UUID DEFAULT NULL,
  "category" VARCHAR(100) CHECK ("category" IN ('ELECTRONIC','MECHANICAL','OPTICAL','ELECTRICAL','CONSUMABLE','ACCESSORY','SOFTWARE','OTHER')) NOT NULL DEFAULT 'OTHER',
  "unit_of_measure" varchar(20) NOT NULL DEFAULT 'PCS',
  "minimum_stock" decimal(10,2) DEFAULT 0.00,
  "reorder_level" decimal(10,2) DEFAULT 0.00,
  "maximum_stock" decimal(10,2) DEFAULT 0.00,
  "standard_cost" decimal(18,2) DEFAULT 0.00,
  "selling_price" decimal(18,2) DEFAULT 0.00,
  "lead_time_days" integer DEFAULT 30,
  "shelf_life_months" integer DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "spare_parts"
--

INSERT INTO "spare_parts" ("id", "part_number", "manufacturer_part_no", "part_name", "description", "manufacturer_id", "brand_id", "category", "unit_of_measure", "minimum_stock", "reorder_level", "maximum_stock", "standard_cost", "selling_price", "lead_time_days", "shelf_life_months", "active", "created_at", "updated_at") VALUES
('521d76c4-7fde-11f1-aa6c-3cecef704050', 'TEMP-SENSOR-001', 'TS-1001', 'Temperature Sensor', NULL, '04a5db33-7f77-11f1-aa6c-3cecef704050', '860f5119-7f77-11f1-aa6c-3cecef704050', 'ELECTRONIC', 'PCS', 2.00, 5.00, 20.00, 18500.00, 24000.00, 30, NULL, 1, '2026-07-14 23:47:03', '2026-07-14 23:47:03'),
('521e20eb-7fde-11f1-aa6c-3cecef704050', 'FUSE-250V-5A', 'F250V5A', 'Glass Fuse 250V 5A', NULL, '04a5db33-7f77-11f1-aa6c-3cecef704050', '860f5119-7f77-11f1-aa6c-3cecef704050', 'ELECTRICAL', 'PCS', 10.00, 20.00, 100.00, 350.00, 600.00, 30, NULL, 1, '2026-07-14 23:47:03', '2026-07-14 23:47:03'),
('521e8ab5-7fde-11f1-aa6c-3cecef704050', 'FAN-24V-001', 'FAN24V', 'Cooling Fan 24V DC', NULL, '04a5db33-7f77-11f1-aa6c-3cecef704050', '860f5119-7f77-11f1-aa6c-3cecef704050', 'MECHANICAL', 'PCS', 2.00, 5.00, 15.00, 4200.00, 6500.00, 30, NULL, 1, '2026-07-14 23:47:03', '2026-07-14 23:47:03');

-- --------------------------------------------------------

--
-- Table structure for table "stock_adjustments"
--

CREATE TABLE "stock_adjustments" (
  "id" UUID NOT NULL,
  "adjustment_no" varchar(50) NOT NULL,
  "location_id" UUID NOT NULL,
  "adjustment_type" VARCHAR(100) CHECK ("adjustment_type" IN ('STOCK_TAKE','DAMAGE','LOSS','EXPIRED','FOUND','SYSTEM_CORRECTION','RETURN','OTHER')) NOT NULL,
  "adjustment_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "approved_by" UUID DEFAULT NULL,
  "created_by" UUID NOT NULL,
  "status" VARCHAR(100) CHECK ("status" IN ('DRAFT','APPROVED','POSTED','CANCELLED')) NOT NULL DEFAULT 'DRAFT',
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "stock_adjustments"
--

INSERT INTO "stock_adjustments" ("id", "adjustment_no", "location_id", "adjustment_type", "adjustment_date", "approved_by", "created_by", "status", "remarks", "created_at", "updated_at") VALUES
('362d4f5e-7fe2-11f1-aa6c-3cecef704050', 'SA-2026-000001', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', 'STOCK_TAKE', '2026-07-15 05:44:54', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'POSTED', 'Annual stock verification.', '2026-07-15 00:14:54', '2026-07-15 00:14:54');

-- --------------------------------------------------------

--
-- Table structure for table "stock_adjustment_items"
--

CREATE TABLE "stock_adjustment_items" (
  "id" UUID NOT NULL,
  "adjustment_id" UUID NOT NULL,
  "line_no" integer NOT NULL,
  "part_id" UUID NOT NULL,
  "system_quantity" decimal(12,2) NOT NULL,
  "physical_quantity" decimal(12,2) NOT NULL,
  "adjustment_quantity" decimal(12,2) NOT NULL,
  "unit_cost" decimal(18,2) NOT NULL,
  "adjustment_value" decimal(18,2) GENERATED ALWAYS AS ("adjustment_quantity" * "unit_cost") STORED,
  "reason" varchar(255) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "stock_adjustment_items"
--

INSERT INTO "stock_adjustment_items" ("id", "adjustment_id", "line_no", "part_id", "system_quantity", "physical_quantity", "adjustment_quantity", "unit_cost", "reason", "remarks", "created_at", "updated_at") VALUES
('421a48f0-7fe2-11f1-aa6c-3cecef704050', '362d4f5e-7fe2-11f1-aa6c-3cecef704050', 1, '521d76c4-7fde-11f1-aa6c-3cecef704050', 25.00, 24.00, -1.00, 18500.00, 'One sensor missing during stock count.', NULL, '2026-07-15 00:15:14', '2026-07-15 00:15:14'),
('421b01b0-7fe2-11f1-aa6c-3cecef704050', '362d4f5e-7fe2-11f1-aa6c-3cecef704050', 2, '521e20eb-7fde-11f1-aa6c-3cecef704050', 100.00, 102.00, 2.00, 350.00, 'Additional stock found during verification.', NULL, '2026-07-15 00:15:14', '2026-07-15 00:15:14');

-- --------------------------------------------------------

--
-- Table structure for table "stock_take"
--

CREATE TABLE "stock_take" (
  "id" UUID NOT NULL,
  "stock_take_no" varchar(50) NOT NULL,
  "location_id" UUID NOT NULL,
  "stock_take_date" date NOT NULL,
  "status" VARCHAR(100) CHECK ("status" IN ('PLANNED','IN_PROGRESS','COMPLETED','APPROVED','CANCELLED')) NOT NULL DEFAULT 'PLANNED',
  "started_at" timestamp DEFAULT NULL,
  "completed_at" timestamp DEFAULT NULL,
  "counted_by" UUID NOT NULL,
  "verified_by" UUID DEFAULT NULL,
  "approved_by" UUID DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "stock_take"
--

INSERT INTO "stock_take" ("id", "stock_take_no", "location_id", "stock_take_date", "status", "started_at", "completed_at", "counted_by", "verified_by", "approved_by", "remarks", "created_at", "updated_at") VALUES
('6baee732-7fe4-11f1-aa6c-3cecef704050', 'STK-2026-000001', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', '2026-07-15', 'COMPLETED', '2026-07-15 06:00:42', '2026-07-15 06:00:42', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Annual stock verification.', '2026-07-15 00:30:42', '2026-07-15 00:30:42');

-- --------------------------------------------------------

--
-- Table structure for table "stock_take_items"
--

CREATE TABLE "stock_take_items" (
  "id" UUID NOT NULL,
  "stock_take_id" UUID NOT NULL,
  "line_no" integer NOT NULL,
  "part_id" UUID NOT NULL,
  "system_quantity" decimal(12,2) NOT NULL,
  "counted_quantity" decimal(12,2) NOT NULL,
  "variance_quantity" decimal(12,2) GENERATED ALWAYS AS ("counted_quantity" - "system_quantity") STORED,
  "variance_value" decimal(18,2) DEFAULT NULL,
  "counted_by" UUID NOT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "stock_take_items"
--

INSERT INTO "stock_take_items" ("id", "stock_take_id", "line_no", "part_id", "system_quantity", "counted_quantity", "variance_value", "counted_by", "remarks", "created_at", "updated_at") VALUES
('6bafc9db-7fe4-11f1-aa6c-3cecef704050', '6baee732-7fe4-11f1-aa6c-3cecef704050', 1, '521d76c4-7fde-11f1-aa6c-3cecef704050', 25.00, 24.00, -18500.00, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'One item missing.', '2026-07-15 00:30:42', '2026-07-15 00:30:42'),
('6bb0481d-7fe4-11f1-aa6c-3cecef704050', '6baee732-7fe4-11f1-aa6c-3cecef704050', 2, '521e20eb-7fde-11f1-aa6c-3cecef704050', 100.00, 102.00, 700.00, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Additional stock found.', '2026-07-15 00:30:42', '2026-07-15 00:30:42');

-- --------------------------------------------------------

--
-- Table structure for table "stock_transfers"
--

CREATE TABLE "stock_transfers" (
  "id" UUID NOT NULL,
  "transfer_no" varchar(50) NOT NULL,
  "from_location_id" UUID NOT NULL,
  "to_location_id" UUID NOT NULL,
  "requested_by" UUID NOT NULL,
  "approved_by" UUID DEFAULT NULL,
  "dispatched_by" UUID DEFAULT NULL,
  "received_by" UUID DEFAULT NULL,
  "request_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "approval_date" timestamp DEFAULT NULL,
  "dispatch_date" timestamp DEFAULT NULL,
  "received_date" timestamp DEFAULT NULL,
  "status" VARCHAR(100) CHECK ("status" IN ('REQUESTED','APPROVED','DISPATCHED','IN_TRANSIT','RECEIVED','CANCELLED')) NOT NULL DEFAULT 'REQUESTED',
  "courier_name" varchar(100) DEFAULT NULL,
  "tracking_no" varchar(100) DEFAULT NULL,
  "vehicle_no" varchar(50) DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "stock_transfers"
--

INSERT INTO "stock_transfers" ("id", "transfer_no", "from_location_id", "to_location_id", "requested_by", "approved_by", "dispatched_by", "received_by", "request_date", "approval_date", "dispatch_date", "received_date", "status", "courier_name", "tracking_no", "vehicle_no", "remarks", "created_at", "updated_at") VALUES
('8ad8cd0b-7fe1-11f1-aa6c-3cecef704050', 'TRF-2026-000001', 'ef8565d2-7fde-11f1-aa6c-3cecef704050', 'ef84ae2e-7fde-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:40:06', '2026-07-15 05:40:06', '2026-07-15 05:40:06', '2026-07-15 05:40:06', 'RECEIVED', NULL, NULL, NULL, 'Stock transfer from General Stores to Service Centre.', '2026-07-15 00:10:06', '2026-07-15 00:10:06');

-- --------------------------------------------------------

--
-- Table structure for table "stock_transfer_items"
--

CREATE TABLE "stock_transfer_items" (
  "id" UUID NOT NULL,
  "transfer_id" UUID NOT NULL,
  "line_no" integer NOT NULL,
  "part_id" UUID NOT NULL,
  "quantity_requested" decimal(12,2) NOT NULL,
  "quantity_dispatched" decimal(12,2) DEFAULT 0.00,
  "quantity_received" decimal(12,2) DEFAULT 0.00,
  "unit_cost" decimal(18,2) NOT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "stock_transfer_items"
--

INSERT INTO "stock_transfer_items" ("id", "transfer_id", "line_no", "part_id", "quantity_requested", "quantity_dispatched", "quantity_received", "unit_cost", "remarks", "created_at", "updated_at") VALUES
('a0f0bf15-7fe1-11f1-aa6c-3cecef704050', '8ad8cd0b-7fe1-11f1-aa6c-3cecef704050', 1, '521d76c4-7fde-11f1-aa6c-3cecef704050', 5.00, 5.00, 5.00, 18500.00, NULL, '2026-07-15 00:10:43', '2026-07-15 00:10:43'),
('a0f17bdf-7fe1-11f1-aa6c-3cecef704050', '8ad8cd0b-7fe1-11f1-aa6c-3cecef704050', 2, '521e20eb-7fde-11f1-aa6c-3cecef704050', 20.00, 20.00, 20.00, 350.00, NULL, '2026-07-15 00:10:43', '2026-07-15 00:10:43'),
('a0f1db3f-7fe1-11f1-aa6c-3cecef704050', '8ad8cd0b-7fe1-11f1-aa6c-3cecef704050', 3, '521e8ab5-7fde-11f1-aa6c-3cecef704050', 2.00, 2.00, 2.00, 4200.00, NULL, '2026-07-15 00:10:43', '2026-07-15 00:10:43');

-- --------------------------------------------------------

--
-- Table structure for table "suppliers"
--

CREATE TABLE "suppliers" (
  "id" UUID NOT NULL,
  "supplier_code" varchar(30) NOT NULL,
  "supplier_name" varchar(255) NOT NULL,
  "supplier_type" VARCHAR(100) CHECK ("supplier_type" IN ('LOCAL','FOREIGN','MANUFACTURER','DISTRIBUTOR')) NOT NULL DEFAULT 'LOCAL',
  "registration_no" varchar(100) DEFAULT NULL,
  "tax_no" varchar(100) DEFAULT NULL,
  "address_line1" varchar(255) DEFAULT NULL,
  "address_line2" varchar(255) DEFAULT NULL,
  "city" varchar(100) DEFAULT NULL,
  "country_id" UUID DEFAULT NULL,
  "contact_person" varchar(150) DEFAULT NULL,
  "designation" varchar(100) DEFAULT NULL,
  "phone" varchar(30) DEFAULT NULL,
  "mobile" varchar(30) DEFAULT NULL,
  "email" varchar(150) DEFAULT NULL,
  "website" varchar(255) DEFAULT NULL,
  "payment_terms" varchar(100) DEFAULT NULL,
  "credit_limit" decimal(18,2) DEFAULT 0.00,
  "active" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "suppliers"
--

INSERT INTO "suppliers" ("id", "supplier_code", "supplier_name", "supplier_type", "registration_no", "tax_no", "address_line1", "address_line2", "city", "country_id", "contact_person", "designation", "phone", "mobile", "email", "website", "payment_terms", "credit_limit", "active", "remarks", "created_at", "updated_at") VALUES
('fd7c87de-7fdf-11f1-aa6c-3cecef704050', 'SUP0001', 'AVON PHARMO CHEM (PVT) LTD', 'DISTRIBUTOR', NULL, NULL, NULL, NULL, 'Colombo', NULL, 'Stores Department', NULL, '0112696911', NULL, 'stores@avonpclk.com', 'https://www.avonpclk.com', NULL, 0.00, 1, NULL, '2026-07-14 23:59:00', '2026-07-14 23:59:00'),
('fd7d28fe-7fdf-11f1-aa6c-3cecef704050', 'SUP0002', 'Abbott Laboratories', 'MANUFACTURER', NULL, NULL, NULL, NULL, 'Illinois', NULL, 'International Sales', NULL, NULL, NULL, NULL, 'https://www.abbott.com', NULL, 0.00, 1, NULL, '2026-07-14 23:59:00', '2026-07-14 23:59:00'),
('fd7d8e82-7fdf-11f1-aa6c-3cecef704050', 'SUP0003', 'Bio-Rad Laboratories', 'MANUFACTURER', NULL, NULL, NULL, NULL, 'California', NULL, NULL, NULL, NULL, NULL, NULL, 'https://www.bio-rad.com', NULL, 0.00, 1, NULL, '2026-07-14 23:59:00', '2026-07-14 23:59:00'),
('fd7dea2b-7fdf-11f1-aa6c-3cecef704050', 'SUP0004', 'Thermo Fisher Scientific', 'MANUFACTURER', NULL, NULL, NULL, NULL, 'Massachusetts', NULL, NULL, NULL, NULL, NULL, NULL, 'https://www.thermofisher.com', NULL, 0.00, 1, NULL, '2026-07-14 23:59:00', '2026-07-14 23:59:00'),
('fd7e51ba-7fdf-11f1-aa6c-3cecef704050', 'SUP0005', 'Eppendorf SE', 'MANUFACTURER', NULL, NULL, NULL, NULL, 'Hamburg', NULL, NULL, NULL, NULL, NULL, NULL, 'https://www.eppendorf.com', NULL, 0.00, 1, NULL, '2026-07-14 23:59:00', '2026-07-14 23:59:00');

-- --------------------------------------------------------

--
-- Table structure for table "system_announcements"
--

CREATE TABLE "system_announcements" (
  "id" UUID NOT NULL,
  "announcement_no" varchar(50) NOT NULL,
  "company_id" UUID NOT NULL,
  "title" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "announcement_type" VARCHAR(100) CHECK ("announcement_type" IN ('GENERAL','MAINTENANCE','SYSTEM','SECURITY','UPDATE','TRAINING','HOLIDAY','URGENT')) NOT NULL DEFAULT 'GENERAL',
  "priority" VARCHAR(100) CHECK ("priority" IN ('LOW','NORMAL','HIGH','CRITICAL')) NOT NULL DEFAULT 'NORMAL',
  "audience" VARCHAR(100) CHECK ("audience" IN ('ALL_USERS','ENGINEERS','TECHNICIANS','WORKSHOP','CALIBRATION','MANAGEMENT','ADMINISTRATORS')) NOT NULL DEFAULT 'ALL_USERS',
  "start_datetime" timestamp NOT NULL,
  "end_datetime" timestamp DEFAULT NULL,
  "dismissible" smallint NOT NULL DEFAULT 1,
  "popup_on_login" smallint NOT NULL DEFAULT 0,
  "active" smallint NOT NULL DEFAULT 1,
  "created_by" UUID NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "system_announcements"
--

INSERT INTO "system_announcements" ("id", "announcement_no", "company_id", "title", "message", "announcement_type", "priority", "audience", "start_datetime", "end_datetime", "dismissible", "popup_on_login", "active", "created_by", "created_at", "updated_at") VALUES
('5ef02973-8013-11f1-aa6c-3cecef704050', 'ANN-2026-000001', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Welcome to Avon ServicePro', 'Welcome to the Avon ServicePro Scientific Equipment Management System.', 'GENERAL', 'NORMAL', 'ALL_USERS', '2026-07-15 11:36:47', '2026-08-14 11:36:47', 1, 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:06:47', '2026-07-15 06:06:47'),
('5ef0e3f7-8013-11f1-aa6c-3cecef704050', 'ANN-2026-000002', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Scheduled Server Maintenance', 'System maintenance is scheduled this Sunday from 10:00 PM to 11:00 PM.', 'MAINTENANCE', 'HIGH', 'ALL_USERS', '2026-07-15 11:36:47', '2026-07-22 11:36:47', 0, 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:06:47', '2026-07-15 06:06:47'),
('5ef15831-8013-11f1-aa6c-3cecef704050', 'ANN-2026-000003', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Calibration Department', 'Calibration module is now available for all Calibration Engineers.', 'UPDATE', 'NORMAL', 'CALIBRATION', '2026-07-15 11:36:47', NULL, 1, 0, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:06:47', '2026-07-15 06:06:47');

-- --------------------------------------------------------

--
-- Table structure for table "system_backup_history"
--

CREATE TABLE "system_backup_history" (
  "id" UUID NOT NULL,
  "backup_no" varchar(50) NOT NULL,
  "backup_type" VARCHAR(100) CHECK ("backup_type" IN ('FULL_DATABASE','SCHEMA_ONLY','DATA_ONLY','FILES','DOCUMENTS','SYSTEM')) NOT NULL,
  "backup_name" varchar(255) NOT NULL,
  "backup_file" varchar(500) DEFAULT NULL,
  "storage_location" varchar(255) DEFAULT NULL,
  "file_size_mb" decimal(18,2) DEFAULT NULL,
  "started_at" timestamp NOT NULL,
  "completed_at" timestamp DEFAULT NULL,
  "duration_seconds" integer DEFAULT NULL,
  "compression" VARCHAR(100) CHECK ("compression" IN ('NONE','ZIP','GZIP','7ZIP')) NOT NULL DEFAULT 'GZIP',
  "checksum_sha256" varchar(64) DEFAULT NULL,
  "backup_status" VARCHAR(100) CHECK ("backup_status" IN ('RUNNING','COMPLETED','FAILED','RESTORED')) NOT NULL DEFAULT 'RUNNING',
  "verified" smallint NOT NULL DEFAULT 0,
  "restore_tested" smallint NOT NULL DEFAULT 0,
  "retention_days" integer DEFAULT 30,
  "created_by" UUID DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "system_backup_history"
--

INSERT INTO "system_backup_history" ("id", "backup_no", "backup_type", "backup_name", "backup_file", "storage_location", "file_size_mb", "started_at", "completed_at", "duration_seconds", "compression", "checksum_sha256", "backup_status", "verified", "restore_tested", "retention_days", "created_by", "remarks", "created_at", "updated_at") VALUES
('fc022481-800a-11f1-aa6c-3cecef704050', 'BKP-2026-000001', 'FULL_DATABASE', 'Daily Database Backup', 'avonservicepro_20260715.sql.gz', '/backups/database/', 128.45, '2026-07-15 10:26:45', '2026-07-15 10:36:45', 600, 'GZIP', '9f12b4e739ea191650a242f6a621f4e48f93518d093b552ec54d3a59f6a96433', 'COMPLETED', 1, 0, 30, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Automatic scheduled backup.', '2026-07-15 05:06:45', '2026-07-15 05:06:45'),
('fc02d054-800a-11f1-aa6c-3cecef704050', 'BKP-2026-000002', 'FILES', 'Document Repository Backup', 'documents_20260715.zip', '/backups/files/', 512.80, '2026-07-15 10:06:45', '2026-07-15 10:16:45', 600, 'ZIP', '84ce47f24d2c592e44861f24bd2ed409282d8bfc9ffc607a8e1a7b377c56a91e', 'COMPLETED', 1, 1, 90, 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Weekly document backup.', '2026-07-15 05:06:45', '2026-07-15 05:06:45');

-- --------------------------------------------------------

--
-- Table structure for table "system_health"
--

CREATE TABLE "system_health" (
  "id" UUID NOT NULL,
  "health_no" varchar(50) NOT NULL,
  "check_time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "server_name" varchar(100) DEFAULT NULL,
  "application_version" varchar(50) DEFAULT NULL,
  "database_version" varchar(50) DEFAULT NULL,
  "cpu_usage_percent" decimal(5,2) DEFAULT NULL,
  "memory_usage_percent" decimal(5,2) DEFAULT NULL,
  "disk_usage_percent" decimal(5,2) DEFAULT NULL,
  "database_size_mb" decimal(18,2) DEFAULT NULL,
  "active_users" integer DEFAULT 0,
  "active_sessions" integer DEFAULT 0,
  "api_requests_per_minute" integer DEFAULT 0,
  "average_response_time_ms" integer DEFAULT NULL,
  "uptime_seconds" bigint DEFAULT NULL,
  "overall_status" VARCHAR(100) CHECK ("overall_status" IN ('HEALTHY','WARNING','CRITICAL','OFFLINE')) NOT NULL DEFAULT 'HEALTHY',
  "database_status" VARCHAR(100) CHECK ("database_status" IN ('ONLINE','OFFLINE','SLOW')) NOT NULL DEFAULT 'ONLINE',
  "storage_status" VARCHAR(100) CHECK ("storage_status" IN ('NORMAL','LOW_SPACE','FULL')) NOT NULL DEFAULT 'NORMAL',
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "system_health"
--

INSERT INTO "system_health" ("id", "health_no", "check_time", "server_name", "application_version", "database_version", "cpu_usage_percent", "memory_usage_percent", "disk_usage_percent", "database_size_mb", "active_users", "active_sessions", "api_requests_per_minute", "average_response_time_ms", "uptime_seconds", "overall_status", "database_status", "storage_status", "remarks", "created_at") VALUES
('51bf0453-800b-11f1-aa6c-3cecef704050', 'HLT-2026-000001', '2026-07-15 10:39:09', 'AVON-PROD-01', '1.0.0', '10.11.18-MariaDB', 18.50, 42.30, 61.80, 185.40, 8, 11, 54, 128, 864000, 'HEALTHY', 'ONLINE', 'NORMAL', 'All services operating normally.', '2026-07-15 05:09:09');

-- --------------------------------------------------------

--
-- Table structure for table "system_jobs"
--

CREATE TABLE "system_jobs" (
  "id" UUID NOT NULL,
  "job_code" varchar(50) NOT NULL,
  "job_name" varchar(200) NOT NULL,
  "description" text DEFAULT NULL,
  "job_type" VARCHAR(100) CHECK ("job_type" IN ('CRON','SCHEDULED','BACKGROUND','MAINTENANCE','SYSTEM')) NOT NULL DEFAULT 'SCHEDULED',
  "schedule_expression" varchar(100) NOT NULL,
  "execution_command" varchar(500) NOT NULL,
  "enabled" smallint NOT NULL DEFAULT 1,
  "run_as_user" UUID DEFAULT NULL,
  "last_started_at" timestamp DEFAULT NULL,
  "last_completed_at" timestamp DEFAULT NULL,
  "last_status" VARCHAR(100) CHECK ("last_status" IN ('SUCCESS','FAILED','RUNNING','NEVER_RUN')) NOT NULL DEFAULT 'NEVER_RUN',
  "last_duration_seconds" integer DEFAULT NULL,
  "next_run_at" timestamp DEFAULT NULL,
  "timeout_seconds" integer NOT NULL DEFAULT 3600,
  "max_retry_count" integer NOT NULL DEFAULT 3,
  "retry_count" integer NOT NULL DEFAULT 0,
  "log_output" smallint NOT NULL DEFAULT 1,
  "notify_on_failure" smallint NOT NULL DEFAULT 1,
  "active" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "system_jobs"
--

INSERT INTO "system_jobs" ("id", "job_code", "job_name", "description", "job_type", "schedule_expression", "execution_command", "enabled", "run_as_user", "last_started_at", "last_completed_at", "last_status", "last_duration_seconds", "next_run_at", "timeout_seconds", "max_retry_count", "retry_count", "log_output", "notify_on_failure", "active", "remarks", "created_by", "created_at", "updated_at") VALUES
('30603317-8015-11f1-aa6c-3cecef704050', 'JOB_BACKUP', 'Daily Database Backup', 'Automatic daily database backup.', 'SCHEDULED', '0 2 * * *', 'backup_database', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'NEVER_RUN', NULL, '2026-07-16 11:49:48', 3600, 3, 0, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:19:48', '2026-07-15 06:19:48'),
('3060e92b-8015-11f1-aa6c-3cecef704050', 'JOB_PM_GENERATOR', 'PM Schedule Generator', 'Generate Preventive Maintenance schedules.', 'SCHEDULED', '0 0 * * *', 'generate_pm_schedules', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'NEVER_RUN', NULL, '2026-07-16 11:49:48', 3600, 3, 0, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:19:48', '2026-07-15 06:19:48'),
('30615578-8015-11f1-aa6c-3cecef704050', 'JOB_CAL_GENERATOR', 'Calibration Schedule Generator', 'Generate Calibration schedules.', 'SCHEDULED', '15 0 * * *', 'generate_calibration_schedules', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'NEVER_RUN', NULL, '2026-07-16 11:49:48', 3600, 3, 0, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:19:48', '2026-07-15 06:19:48'),
('3061c3b7-8015-11f1-aa6c-3cecef704050', 'JOB_EMAIL_QUEUE', 'Email Queue Processor', 'Processes queued emails.', 'BACKGROUND', '*/5 * * * *', 'process_email_queue', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'NEVER_RUN', NULL, '2026-07-15 11:54:48', 3600, 3, 0, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:19:48', '2026-07-15 06:19:48'),
('30622de5-8015-11f1-aa6c-3cecef704050', 'JOB_CLEANUP', 'System Cleanup', 'Deletes temporary files and expired sessions.', 'MAINTENANCE', '0 3 * * 0', 'system_cleanup', 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', NULL, NULL, 'NEVER_RUN', NULL, '2026-07-22 11:49:48', 3600, 3, 0, 1, 1, 1, NULL, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:19:48', '2026-07-15 06:19:48');

-- --------------------------------------------------------

--
-- Table structure for table "system_preferences"
--

CREATE TABLE "system_preferences" (
  "id" UUID NOT NULL,
  "preference_code" varchar(50) NOT NULL,
  "category" varchar(100) NOT NULL,
  "preference_name" varchar(200) NOT NULL,
  "preference_key" varchar(100) NOT NULL,
  "preference_value" text DEFAULT NULL,
  "data_type" VARCHAR(100) CHECK ("data_type" IN ('STRING','INTEGER','DECIMAL','BOOLEAN','JSON','DATE','TIME')) NOT NULL DEFAULT 'STRING',
  "description" text DEFAULT NULL,
  "editable" smallint NOT NULL DEFAULT 1,
  "active" smallint NOT NULL DEFAULT 1,
  "updated_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "system_preferences"
--

INSERT INTO "system_preferences" ("id", "preference_code", "category", "preference_name", "preference_key", "preference_value", "data_type", "description", "editable", "active", "updated_by", "created_at", "updated_at") VALUES
('d27e68cd-8019-11f1-aa6c-3cecef704050', 'PREF-001', 'GENERAL', 'Application Theme', 'APP_THEME', 'LIGHT', 'STRING', 'Default application theme.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58'),
('d27f0e2d-8019-11f1-aa6c-3cecef704050', 'PREF-002', 'GENERAL', 'Default Language', 'DEFAULT_LANGUAGE', 'EN', 'STRING', 'Default system language.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58'),
('d27f63c9-8019-11f1-aa6c-3cecef704050', 'PREF-003', 'SERVICE', 'Default Job Priority', 'DEFAULT_JOB_PRIORITY', 'HIGH', 'STRING', 'Default service request priority.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58'),
('d27fbd48-8019-11f1-aa6c-3cecef704050', 'PREF-004', 'INVENTORY', 'Reorder Alert Days', 'REORDER_ALERT_DAYS', '30', 'INTEGER', 'Notify before stock reaches reorder level.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58'),
('d280180e-8019-11f1-aa6c-3cecef704050', 'PREF-005', 'SECURITY', 'Session Timeout', 'SESSION_TIMEOUT_MINUTES', '60', 'INTEGER', 'Automatic session timeout in minutes.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58'),
('d280717b-8019-11f1-aa6c-3cecef704050', 'PREF-006', 'NOTIFICATIONS', 'Email Notifications', 'EMAIL_ENABLED', 'true', 'BOOLEAN', 'Enable email notifications.', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 06:52:58', '2026-07-15 06:52:58');

-- --------------------------------------------------------

--
-- Table structure for table "system_settings"
--

CREATE TABLE "system_settings" (
  "id" UUID NOT NULL,
  "setting_group" varchar(100) NOT NULL,
  "setting_key" varchar(100) NOT NULL,
  "setting_name" varchar(200) NOT NULL,
  "setting_value" text DEFAULT NULL,
  "value_type" VARCHAR(100) CHECK ("value_type" IN ('STRING','INTEGER','DECIMAL','BOOLEAN','DATE','TIME','JSON')) NOT NULL DEFAULT 'STRING',
  "description" text DEFAULT NULL,
  "editable" smallint NOT NULL DEFAULT 1,
  "system_setting" smallint NOT NULL DEFAULT 0,
  "updated_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "system_settings"
--

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

-- --------------------------------------------------------

--
-- Table structure for table "tasks"
--

CREATE TABLE "tasks" (
  "id" UUID NOT NULL,
  "task_no" varchar(50) NOT NULL,
  "entity_type" varchar(100) DEFAULT NULL,
  "entity_id" UUID DEFAULT NULL,
  "title" varchar(255) NOT NULL,
  "description" text DEFAULT NULL,
  "priority" VARCHAR(100) CHECK ("priority" IN ('LOW','NORMAL','HIGH','URGENT')) DEFAULT 'NORMAL',
  "status" VARCHAR(100) CHECK ("status" IN ('OPEN','IN_PROGRESS','ON_HOLD','COMPLETED','CANCELLED')) DEFAULT 'OPEN',
  "start_date" date DEFAULT NULL,
  "due_date" date DEFAULT NULL,
  "completed_date" date DEFAULT NULL,
  "completion_percent" decimal(5,2) DEFAULT 0.00,
  "created_by" UUID NOT NULL,
  "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "tasks"
--

INSERT INTO "tasks" ("id", "task_no", "entity_type", "entity_id", "title", "description", "priority", "status", "start_date", "due_date", "completed_date", "completion_percent", "created_by", "created_at", "updated_at") VALUES
('5fb1f7fe-801e-11f1-aa6c-3cecef704050', 'TASK-000001', 'SERVICE_JOB', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'Order Spare Parts', 'Order replacement PCB.', 'HIGH', 'OPEN', NULL, '2026-07-18', NULL, 0.00, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 07:25:33', '2026-07-15 07:25:33');

-- --------------------------------------------------------

--
-- Table structure for table "task_assignments"
--

CREATE TABLE "task_assignments" (
  "id" UUID NOT NULL,
  "task_id" UUID NOT NULL,
  "assigned_to" UUID NOT NULL,
  "assigned_by" UUID NOT NULL,
  "assigned_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "accepted" smallint DEFAULT 0,
  "accepted_at" timestamp DEFAULT NULL,
  "completed" smallint DEFAULT 0,
  "completed_at" timestamp DEFAULT NULL,
  "remarks" text DEFAULT NULL
);

--
-- Dumping data for table "task_assignments"
--

INSERT INTO "task_assignments" ("id", "task_id", "assigned_to", "assigned_by", "assigned_at", "accepted", "accepted_at", "completed", "completed_at", "remarks") VALUES
('5fb4660d-801e-11f1-aa6c-3cecef704050', '5fb1f7fe-801e-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 12:55:33', 0, NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table "task_attachments"
--

CREATE TABLE "task_attachments" (
  "id" UUID NOT NULL,
  "task_id" UUID NOT NULL,
  "file_storage_id" UUID NOT NULL,
  "uploaded_by" UUID NOT NULL,
  "uploaded_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "remarks" text DEFAULT NULL
);

--
-- Dumping data for table "task_attachments"
--

INSERT INTO "task_attachments" ("id", "task_id", "file_storage_id", "uploaded_by", "uploaded_at", "remarks") VALUES
('5fb90c9d-801e-11f1-aa6c-3cecef704050', '5fb1f7fe-801e-11f1-aa6c-3cecef704050', 'e5e42cba-800c-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 12:55:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table "task_comments"
--

CREATE TABLE "task_comments" (
  "id" UUID NOT NULL,
  "task_id" UUID NOT NULL,
  "comment" text NOT NULL,
  "commented_by" UUID NOT NULL,
  "commented_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "edited" smallint DEFAULT 0,
  "edited_at" timestamp DEFAULT NULL
);

--
-- Dumping data for table "task_comments"
--

INSERT INTO "task_comments" ("id", "task_id", "comment", "commented_by", "commented_at", "edited", "edited_at") VALUES
('5fb69a7c-801e-11f1-aa6c-3cecef704050', '5fb1f7fe-801e-11f1-aa6c-3cecef704050', 'Waiting for supplier quotation.', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 12:55:33', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table "territories"
--

CREATE TABLE "territories" (
  "id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "branch_id" UUID NOT NULL,
  "district_id" UUID NOT NULL,
  "territory_code" varchar(20) NOT NULL,
  "territory_name" varchar(150) NOT NULL,
  "description" text DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "territories"
--

INSERT INTO "territories" ("id", "company_id", "branch_id", "district_id", "territory_code", "territory_name", "description", "active", "created_at", "updated_at") VALUES
('063e53a6-7f75-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', '9aab2897-7f74-11f1-aa6c-3cecef704050', 'TER-COL', 'Colombo Territory', NULL, 1, '2026-07-14 11:13:19', '2026-07-14 11:13:19'),
('063f3566-7f75-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', '9aabfb4b-7f74-11f1-aa6c-3cecef704050', 'TER-GAM', 'Gampaha Territory', NULL, 1, '2026-07-14 11:13:19', '2026-07-14 11:13:19'),
('063fc14f-7f75-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', '9aac6bde-7f74-11f1-aa6c-3cecef704050', 'TER-KAL', 'Kalutara Territory', NULL, 1, '2026-07-14 11:13:19', '2026-07-14 11:13:19');

-- --------------------------------------------------------

--
-- Table structure for table "territory_engineers"
--

CREATE TABLE "territory_engineers" (
  "id" UUID NOT NULL,
  "territory_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "assignment_type" VARCHAR(100) CHECK ("assignment_type" IN ('PRIMARY','SECONDARY','BACKUP')) NOT NULL DEFAULT 'PRIMARY',
  "start_date" date NOT NULL,
  "end_date" date DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "territory_engineers"
--

INSERT INTO "territory_engineers" ("id", "territory_id", "user_id", "assignment_type", "start_date", "end_date", "active", "created_at", "updated_at") VALUES
('493a9893-7f75-11f1-aa6c-3cecef704050', '063e53a6-7f75-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'PRIMARY', '2026-07-14', NULL, 1, '2026-07-14 11:15:11', '2026-07-14 11:15:11');

-- --------------------------------------------------------

--
-- Table structure for table "users"
--

CREATE TABLE "users" (
  "id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "branch_id" UUID NOT NULL,
  "employee_no" varchar(30) NOT NULL,
  "username" varchar(100) NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "email" varchar(150) DEFAULT NULL,
  "mobile" varchar(30) DEFAULT NULL,
  "designation" varchar(150) DEFAULT NULL,
  "employment_status" VARCHAR(100) CHECK ("employment_status" IN ('ACTIVE','ON_LEAVE','SUSPENDED','RESIGNED','RETIRED')) NOT NULL DEFAULT 'ACTIVE',
  "last_login" timestamp DEFAULT NULL,
  "active" smallint NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "users"
--

INSERT INTO "users" ("id", "company_id", "branch_id", "employee_no", "username", "password_hash", "first_name", "last_name", "email", "mobile", "designation", "employment_status", "last_login", "active", "created_at", "updated_at") VALUES
('c32ad035-7f61-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'EMP001', 'admin', '$2y$10$7h3pX6wXx2qH9A0bN5lQ6e5V7Q0xvYd8i0o4L1QwD8gN7uY8PzF3C', 'Cherub', 'Weeratunge', 'admin@avonservicepro.com', '0770000000', 'Senior Biomedical Engineer', 'ACTIVE', NULL, 1, '2026-07-14 08:55:26', '2026-07-14 08:55:26');

-- --------------------------------------------------------

--
-- Table structure for table "user_engineer_tags"
--

CREATE TABLE "user_engineer_tags" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "engineer_tag_id" UUID NOT NULL,
  "assigned_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "active" smallint NOT NULL DEFAULT 1
);

--
-- Dumping data for table "user_engineer_tags"
--

INSERT INTO "user_engineer_tags" ("id", "user_id", "engineer_tag_id", "assigned_at", "active") VALUES
('9a9dc2f4-7f62-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '6d8550ec-7f62-11f1-aa6c-3cecef704050', '2026-07-14 09:01:27', 1);

-- --------------------------------------------------------

--
-- Table structure for table "user_preferences"
--

CREATE TABLE "user_preferences" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "preference_key" varchar(100) NOT NULL,
  "preference_value" text DEFAULT NULL,
  "value_type" VARCHAR(100) CHECK ("value_type" IN ('STRING','INTEGER','BOOLEAN','JSON')) NOT NULL DEFAULT 'STRING',
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "user_preferences"
--

INSERT INTO "user_preferences" ("id", "user_id", "preference_key", "preference_value", "value_type", "created_at", "updated_at") VALUES
('22113f19-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'THEME', 'LIGHT', 'STRING', '2026-07-15 07:16:40', '2026-07-15 07:16:40'),
('22119298-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'LANGUAGE', 'EN', 'STRING', '2026-07-15 07:16:40', '2026-07-15 07:16:40'),
('2211eb83-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'DASHBOARD_LAYOUT', 'DEFAULT', 'STRING', '2026-07-15 07:16:40', '2026-07-15 07:16:40'),
('2212457e-801d-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'ROWS_PER_PAGE', '25', 'INTEGER', '2026-07-15 07:16:40', '2026-07-15 07:16:40');

-- --------------------------------------------------------

--
-- Table structure for table "user_roles"
--

CREATE TABLE "user_roles" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "role_id" UUID NOT NULL,
  "assigned_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "active" smallint NOT NULL DEFAULT 1
);

--
-- Dumping data for table "user_roles"
--

INSERT INTO "user_roles" ("id", "user_id", "role_id", "assigned_at", "active") VALUES
('15142d80-7f62-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '06785408-7f5f-11f1-aa6c-3cecef704050', '2026-07-14 08:57:43', 1);

-- --------------------------------------------------------

--
-- Table structure for table "vendors"
--

CREATE TABLE "vendors" (
  "id" UUID NOT NULL,
  "vendor_code" varchar(30) NOT NULL,
  "supplier_id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "vendor_name" varchar(255) NOT NULL,
  "vendor_type" VARCHAR(100) CHECK ("vendor_type" IN ('LOCAL','FOREIGN','AUTHORIZED','MANUFACTURER','SERVICE_PROVIDER')) NOT NULL DEFAULT 'LOCAL',
  "registration_no" varchar(100) DEFAULT NULL,
  "tax_no" varchar(100) DEFAULT NULL,
  "contact_person" varchar(150) DEFAULT NULL,
  "designation" varchar(100) DEFAULT NULL,
  "phone" varchar(30) DEFAULT NULL,
  "mobile" varchar(30) DEFAULT NULL,
  "email" varchar(150) DEFAULT NULL,
  "website" varchar(255) DEFAULT NULL,
  "payment_terms" varchar(100) DEFAULT NULL,
  "currency" varchar(10) DEFAULT 'LKR',
  "credit_limit" decimal(18,2) DEFAULT 0.00,
  "lead_time_days" integer DEFAULT 30,
  "performance_rating" decimal(4,2) DEFAULT 0.00,
  "active" smallint NOT NULL DEFAULT 1,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "vendors"
--

INSERT INTO "vendors" ("id", "vendor_code", "supplier_id", "company_id", "vendor_name", "vendor_type", "registration_no", "tax_no", "contact_person", "designation", "phone", "mobile", "email", "website", "payment_terms", "currency", "credit_limit", "lead_time_days", "performance_rating", "active", "remarks", "created_at", "updated_at") VALUES
('0583552e-7fe5-11f1-aa6c-3cecef704050', 'VEN0001', 'fd7c87de-7fdf-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'AVON PHARMO CHEM (PVT) LTD', 'AUTHORIZED', NULL, NULL, 'Stores Department', NULL, '0112696911', NULL, 'stores@avonpclk.com', 'https://www.avonpclk.com', '30 DAYS', 'LKR', 0.00, 30, 4.80, 1, NULL, '2026-07-15 00:35:00', '2026-07-15 00:35:00'),
('058429ab-7fe5-11f1-aa6c-3cecef704050', 'VEN0002', 'fd7d28fe-7fdf-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Abbott Laboratories', 'MANUFACTURER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'https://www.abbott.com', NULL, 'USD', 0.00, 90, 4.95, 1, NULL, '2026-07-15 00:35:00', '2026-07-15 00:35:00'),
('0584b4ac-7fe5-11f1-aa6c-3cecef704050', 'VEN0003', 'fd7e51ba-7fdf-11f1-aa6c-3cecef704050', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', 'Eppendorf SE', 'MANUFACTURER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'https://www.eppendorf.com', NULL, 'EUR', 0.00, 60, 4.90, 1, NULL, '2026-07-15 00:35:00', '2026-07-15 00:35:00');

-- --------------------------------------------------------

--
-- Table structure for table "vendor_performance"
--

CREATE TABLE "vendor_performance" (
  "id" UUID NOT NULL,
  "vendor_id" UUID NOT NULL,
  "evaluation_period_from" date NOT NULL,
  "evaluation_period_to" date NOT NULL,
  "purchase_orders" integer NOT NULL DEFAULT 0,
  "total_purchase_value" decimal(18,2) DEFAULT 0.00,
  "on_time_delivery_percent" decimal(5,2) DEFAULT 0.00,
  "quality_score" decimal(5,2) DEFAULT 0.00,
  "price_score" decimal(5,2) DEFAULT 0.00,
  "service_score" decimal(5,2) DEFAULT 0.00,
  "communication_score" decimal(5,2) DEFAULT 0.00,
  "documentation_score" decimal(5,2) DEFAULT 0.00,
  "overall_score" decimal(5,2) DEFAULT 0.00,
  "rating" VARCHAR(100) CHECK ("rating" IN ('EXCELLENT','VERY_GOOD','GOOD','SATISFACTORY','POOR')) NOT NULL,
  "evaluated_by" UUID NOT NULL,
  "evaluation_date" date NOT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "vendor_performance"
--

INSERT INTO "vendor_performance" ("id", "vendor_id", "evaluation_period_from", "evaluation_period_to", "purchase_orders", "total_purchase_value", "on_time_delivery_percent", "quality_score", "price_score", "service_score", "communication_score", "documentation_score", "overall_score", "rating", "evaluated_by", "evaluation_date", "remarks", "created_at", "updated_at") VALUES
('868dceaf-7fe5-11f1-aa6c-3cecef704050', '0583552e-7fe5-11f1-aa6c-3cecef704050', '2026-01-01', '2026-06-30', 12, 1250000.00, 98.00, 96.00, 92.00, 95.00, 97.00, 94.00, 95.33, 'EXCELLENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15', 'Excellent supplier performance.', '2026-07-15 00:38:37', '2026-07-15 00:38:37'),
('868e9e62-7fe5-11f1-aa6c-3cecef704050', '058429ab-7fe5-11f1-aa6c-3cecef704050', '2026-01-01', '2026-06-30', 8, 2850000.00, 95.00, 98.00, 90.00, 94.00, 95.00, 96.00, 94.67, 'VERY_GOOD', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15', 'Consistently high quality products.', '2026-07-15 00:38:37', '2026-07-15 00:38:37');

-- --------------------------------------------------------

--
-- Table structure for table "warranty_activations"
--

CREATE TABLE "warranty_activations" (
  "id" UUID NOT NULL,
  "instrument_id" UUID NOT NULL,
  "document_review_id" UUID NOT NULL,
  "activated_by" UUID NOT NULL,
  "warranty_start_date" date NOT NULL,
  "warranty_end_date" date NOT NULL,
  "warranty_period_months" integer NOT NULL,
  "service_interval_months" integer NOT NULL,
  "activation_status" VARCHAR(100) CHECK ("activation_status" IN ('PENDING','ACTIVATED','CANCELLED')) NOT NULL DEFAULT 'PENDING',
  "activation_date" timestamp DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "warranty_activations"
--

INSERT INTO "warranty_activations" ("id", "instrument_id", "document_review_id", "activated_by", "warranty_start_date", "warranty_end_date", "warranty_period_months", "service_interval_months", "activation_status", "activation_date", "remarks", "created_at", "updated_at") VALUES
('68943ef6-7f7f-11f1-aa6c-3cecef704050', '658854ed-7f7a-11f1-aa6c-3cecef704050', '9ddda42d-7f7e-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-14', '2027-07-14', 12, 12, 'ACTIVATED', '2026-07-14 17:57:39', 'Warranty activated after documentation approval.', '2026-07-14 12:27:39', '2026-07-14 12:27:39');

-- --------------------------------------------------------

--
-- Table structure for table "webhook_logs"
--

CREATE TABLE "webhook_logs" (
  "id" UUID NOT NULL,
  "webhook_id" UUID NOT NULL,
  "execution_no" varchar(50) NOT NULL,
  "event_name" varchar(100) NOT NULL,
  "request_url" varchar(500) NOT NULL,
  "http_method" VARCHAR(100) CHECK ("http_method" IN ('POST','PUT','PATCH')) NOT NULL,
  "request_headers" jsonb DEFAULT NULL,
  "request_body" jsonb DEFAULT NULL,
  "response_code" integer DEFAULT NULL,
  "response_body" text DEFAULT NULL,
  "execution_time_ms" integer DEFAULT NULL,
  "retry_attempt" integer NOT NULL DEFAULT 0,
  "status" VARCHAR(100) CHECK ("status" IN ('SUCCESS','FAILED','TIMEOUT')) NOT NULL,
  "error_message" text DEFAULT NULL,
  "executed_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table "webhook_logs"
--

INSERT INTO "webhook_logs" ("id", "webhook_id", "execution_no", "event_name", "request_url", "http_method", "request_headers", "request_body", "response_code", "response_body", "execution_time_ms", "retry_attempt", "status", "error_message", "executed_at", "created_at") VALUES
('f14e015a-801c-11f1-aa6c-3cecef704050', '1e85251e-801c-11f1-aa6c-3cecef704050', 'WHLOG-000001', 'SERVICE_JOB_COMPLETED', 'https://api.example.com/webhooks/service-job', 'POST', NULL, NULL, 200, NULL, 154, 0, 'SUCCESS', NULL, '2026-07-15 12:45:18', '2026-07-15 07:15:18'),
('f14e795c-801c-11f1-aa6c-3cecef704050', '1e8595d9-801c-11f1-aa6c-3cecef704050', 'WHLOG-000002', 'PM_COMPLETED', 'https://api.example.com/webhooks/pm', 'POST', NULL, NULL, 500, NULL, 502, 0, 'FAILED', 'Remote server unavailable.', '2026-07-15 12:45:18', '2026-07-15 07:15:18');

-- --------------------------------------------------------

--
-- Table structure for table "working_calendar"
--

CREATE TABLE "working_calendar" (
  "id" UUID NOT NULL,
  "calendar_code" varchar(50) NOT NULL,
  "company_id" UUID DEFAULT NULL,
  "branch_id" UUID DEFAULT NULL,
  "calendar_name" varchar(150) NOT NULL,
  "weekday" VARCHAR(100) CHECK ("weekday" IN ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY')) NOT NULL,
  "working_day" smallint NOT NULL DEFAULT 1,
  "start_time" time DEFAULT NULL,
  "end_time" time DEFAULT NULL,
  "lunch_start" time DEFAULT NULL,
  "lunch_end" time DEFAULT NULL,
  "overtime_allowed" smallint DEFAULT 1,
  "active" smallint DEFAULT 1,
  "created_by" UUID DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "working_calendar"
--

INSERT INTO "working_calendar" ("id", "calendar_code", "company_id", "branch_id", "calendar_name", "weekday", "working_day", "start_time", "end_time", "lunch_start", "lunch_end", "overtime_allowed", "active", "created_by", "created_at", "updated_at") VALUES
('aef018ad-8026-11f1-aa6c-3cecef704050', 'CAL-Monday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'MONDAY', 1, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef01bb0-8026-11f1-aa6c-3cecef704050', 'CAL-Tuesday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'TUESDAY', 1, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef01ce3-8026-11f1-aa6c-3cecef704050', 'CAL-Wednesday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'WEDNESDAY', 1, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef01de1-8026-11f1-aa6c-3cecef704050', 'CAL-Thursday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'THURSDAY', 1, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef01f6f-8026-11f1-aa6c-3cecef704050', 'CAL-Friday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'FRIDAY', 1, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef0209a-8026-11f1-aa6c-3cecef704050', 'CAL-Saturday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'SATURDAY', 0, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02'),
('aef02159-8026-11f1-aa6c-3cecef704050', 'CAL-Sunday', 'd2ef44a1-7f5d-11f1-aa6c-3cecef704050', '73252b02-7f5e-11f1-aa6c-3cecef704050', 'Standard Working Hours', 'SUNDAY', 0, '08:30:00', '17:00:00', '12:30:00', '13:00:00', 1, 1, 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 08:25:02', '2026-07-15 08:25:02');

-- --------------------------------------------------------

--
-- Table structure for table "workshop_jobs"
--

CREATE TABLE "workshop_jobs" (
  "id" UUID NOT NULL,
  "service_job_id" UUID NOT NULL,
  "workshop_job_no" varchar(50) NOT NULL,
  "instrument_id" UUID NOT NULL,
  "customer_id" UUID NOT NULL,
  "received_date" timestamp NOT NULL,
  "received_by" UUID NOT NULL,
  "received_condition" text DEFAULT NULL,
  "fault_description" text DEFAULT NULL,
  "diagnosis" text DEFAULT NULL,
  "repair_required" smallint NOT NULL DEFAULT 1,
  "repair_status" VARCHAR(100) CHECK ("repair_status" IN ('RECEIVED','DIAGNOSIS','WAITING_PARTS','UNDER_REPAIR','CALIBRATION','QA_TEST','READY_FOR_DISPATCH','DELIVERED','CLOSED')) NOT NULL DEFAULT 'RECEIVED',
  "priority" VARCHAR(100) CHECK ("priority" IN ('LOW','MEDIUM','HIGH','URGENT','CRITICAL')) NOT NULL DEFAULT 'MEDIUM',
  "estimated_completion_date" date DEFAULT NULL,
  "actual_completion_date" date DEFAULT NULL,
  "dispatched_date" timestamp DEFAULT NULL,
  "delivered_date" timestamp DEFAULT NULL,
  "workshop_notes" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "workshop_jobs"
--

INSERT INTO "workshop_jobs" ("id", "service_job_id", "workshop_job_no", "instrument_id", "customer_id", "received_date", "received_by", "received_condition", "fault_description", "diagnosis", "repair_required", "repair_status", "priority", "estimated_completion_date", "actual_completion_date", "dispatched_date", "delivered_date", "workshop_notes", "created_at", "updated_at") VALUES
('5949bb48-7f81-11f1-aa6c-3cecef704050', '6f77d0f9-7f7c-11f1-aa6c-3cecef704050', 'WS-2026-000001', '658854ed-7f7a-11f1-aa6c-3cecef704050', '08d2bede-7f76-11f1-aa6c-3cecef704050', '2026-07-14 18:11:32', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Instrument received with minor physical scratches.', 'Temperature sensor failure.', NULL, 1, 'RECEIVED', 'HIGH', NULL, NULL, NULL, NULL, NULL, '2026-07-14 12:41:32', '2026-07-14 12:41:32');

-- --------------------------------------------------------

--
-- Table structure for table "workshop_quality_checks"
--

CREATE TABLE "workshop_quality_checks" (
  "id" UUID NOT NULL,
  "workshop_job_id" UUID NOT NULL,
  "qa_engineer_id" UUID NOT NULL,
  "inspection_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "functional_test" smallint NOT NULL DEFAULT 0,
  "safety_test" smallint NOT NULL DEFAULT 0,
  "calibration_verified" smallint NOT NULL DEFAULT 0,
  "cosmetic_check" smallint NOT NULL DEFAULT 0,
  "accessories_verified" smallint NOT NULL DEFAULT 0,
  "documentation_verified" smallint NOT NULL DEFAULT 0,
  "customer_data_verified" smallint NOT NULL DEFAULT 0,
  "overall_result" VARCHAR(100) CHECK ("overall_result" IN ('PASS','FAIL','REWORK_REQUIRED')) NOT NULL,
  "failure_reason" text DEFAULT NULL,
  "corrective_action" text DEFAULT NULL,
  "approved_for_release" smallint NOT NULL DEFAULT 0,
  "approval_date" timestamp DEFAULT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "workshop_quality_checks"
--

INSERT INTO "workshop_quality_checks" ("id", "workshop_job_id", "qa_engineer_id", "inspection_date", "functional_test", "safety_test", "calibration_verified", "cosmetic_check", "accessories_verified", "documentation_verified", "customer_data_verified", "overall_result", "failure_reason", "corrective_action", "approved_for_release", "approval_date", "remarks", "created_at", "updated_at") VALUES
('fd3fd345-7fdd-11f1-aa6c-3cecef704050', '5949bb48-7f81-11f1-aa6c-3cecef704050', 'c32ad035-7f61-11f1-aa6c-3cecef704050', '2026-07-15 05:14:40', 1, 1, 1, 1, 1, 1, 1, 'PASS', NULL, NULL, 1, '2026-07-15 05:14:40', 'Workshop quality inspection completed successfully.', '2026-07-14 23:44:40', '2026-07-14 23:44:40');

-- --------------------------------------------------------

--
-- Table structure for table "workshop_repair_log"
--

CREATE TABLE "workshop_repair_log" (
  "id" UUID NOT NULL,
  "workshop_job_id" UUID NOT NULL,
  "activity_no" integer NOT NULL,
  "activity_date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "activity_type" VARCHAR(100) CHECK ("activity_type" IN ('RECEIVED','INSPECTION','DIAGNOSIS','DISASSEMBLY','PART_REPLACEMENT','SOFTWARE_UPDATE','CALIBRATION','ASSEMBLY','TESTING','QA','READY_FOR_DISPATCH','DELIVERED','OTHER')) NOT NULL,
  "performed_by" UUID NOT NULL,
  "work_description" text NOT NULL,
  "parts_used" smallint NOT NULL DEFAULT 0,
  "labour_hours" decimal(8,2) DEFAULT 0.00,
  "status_after_activity" VARCHAR(100) CHECK ("status_after_activity" IN ('RECEIVED','DIAGNOSIS','WAITING_PARTS','UNDER_REPAIR','CALIBRATION','QA_TEST','READY_FOR_DISPATCH','DELIVERED','CLOSED')) NOT NULL,
  "remarks" text DEFAULT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--
-- Dumping data for table "workshop_repair_log"
--

INSERT INTO "workshop_repair_log" ("id", "workshop_job_id", "activity_no", "activity_date", "activity_type", "performed_by", "work_description", "parts_used", "labour_hours", "status_after_activity", "remarks", "created_at", "updated_at") VALUES
('8dd8819a-7f81-11f1-aa6c-3cecef704050', '5949bb48-7f81-11f1-aa6c-3cecef704050', 1, '2026-07-14 18:13:00', 'RECEIVED', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Instrument received and booked into workshop.', 0, 0.25, 'RECEIVED', NULL, '2026-07-14 12:43:00', '2026-07-14 12:43:00'),
('8dd955dc-7f81-11f1-aa6c-3cecef704050', '5949bb48-7f81-11f1-aa6c-3cecef704050', 2, '2026-07-14 18:13:00', 'DIAGNOSIS', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Temperature sensor diagnosed as faulty.', 0, 1.50, 'WAITING_PARTS', NULL, '2026-07-14 12:43:00', '2026-07-14 12:43:00'),
('8dd9d2cd-7f81-11f1-aa6c-3cecef704050', '5949bb48-7f81-11f1-aa6c-3cecef704050', 3, '2026-07-14 18:13:00', 'PART_REPLACEMENT', 'c32ad035-7f61-11f1-aa6c-3cecef704050', 'Temperature sensor replaced.', 1, 1.25, 'UNDER_REPAIR', NULL, '2026-07-14 12:43:00', '2026-07-14 12:43:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table "activity_log"
--
ALTER TABLE "activity_log"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "activity_no" UNIQUE ("activity_no");

--
-- Indexes for table "amc_contracts"
--
ALTER TABLE "amc_contracts"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_amc_contracts_contract_no" UNIQUE ("contract_no");

--
-- Indexes for table "amc_visits"
--
ALTER TABLE "amc_visits"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_amcvisit_contract_visit" UNIQUE ("amc_contract_id","visit_no");

--
-- Indexes for table "api_keys"
--
ALTER TABLE "api_keys"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "api_key_code" UNIQUE ("api_key_code"),
  ADD CONSTRAINT "api_key" UNIQUE ("api_key");

--
-- Indexes for table "api_logs"
--
ALTER TABLE "api_logs"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_api_logs_log_no" UNIQUE ("log_no");

--
-- Indexes for table "api_webhooks"
--
ALTER TABLE "api_webhooks"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "webhook_code" UNIQUE ("webhook_code");

--
-- Indexes for table "application_configuration"
--
ALTER TABLE "application_configuration"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "config_code" UNIQUE ("config_code"),
  ADD CONSTRAINT "uk_appconfig_key" UNIQUE ("config_group","config_key");

--
-- Indexes for table "application_integrations"
--
ALTER TABLE "application_integrations"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "integration_code" UNIQUE ("integration_code");

--
-- Indexes for table "application_logs"
--
ALTER TABLE "application_logs"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_application_logs_log_no" UNIQUE ("log_no");

--
-- Indexes for table "audit_logs"
--
ALTER TABLE "audit_logs"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "audit_no" UNIQUE ("audit_no");

--
-- Indexes for table "background_jobs"
--
ALTER TABLE "background_jobs"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_background_jobs_job_no" UNIQUE ("job_no");

--
-- Indexes for table "barcodes"
--
ALTER TABLE "barcodes"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "barcode_no" UNIQUE ("barcode_no"),
  ADD CONSTRAINT "uk_barcodes_entity_type" UNIQUE ("entity_type","entity_id");

--
-- Indexes for table "branches"
--
ALTER TABLE "branches"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_company_branch" UNIQUE ("company_id","branch_code");

--
-- Indexes for table "brands"
--
ALTER TABLE "brands"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "brand_code" UNIQUE ("brand_code");

--
-- Indexes for table "calibration_certificates"
--
ALTER TABLE "calibration_certificates"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "calibration_execution_id" UNIQUE ("calibration_execution_id"),
  ADD CONSTRAINT "certificate_no" UNIQUE ("certificate_no");

--
-- Indexes for table "calibration_execution"
--
ALTER TABLE "calibration_execution"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "calibration_schedule_id" UNIQUE ("calibration_schedule_id");

--
-- Indexes for table "calibration_measurements"
--
ALTER TABLE "calibration_measurements"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_calibration_measurement" UNIQUE ("calibration_execution_id","measurement_no");

--
-- Indexes for table "calibration_schedules"
--
ALTER TABLE "calibration_schedules"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_calibration_schedules_schedule_no" UNIQUE ("schedule_no");

--
-- Indexes for table "checklist_templates"
--
ALTER TABLE "checklist_templates"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_checklist_templates_template_code" UNIQUE ("template_code");

--
-- Indexes for table "checklist_template_items"
--
ALTER TABLE "checklist_template_items"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "template_id" UNIQUE ("template_id","line_no");

--
-- Indexes for table "comments"
--
ALTER TABLE "comments"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "comment_no" UNIQUE ("comment_no");

--
-- Indexes for table "companies"
--
ALTER TABLE "companies"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "company_code" UNIQUE ("company_code");

--
-- Indexes for table "contract_instruments"
--
ALTER TABLE "contract_instruments"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_contract_instrument" UNIQUE ("contract_id","instrument_id");

--
-- Indexes for table "countries"
--
ALTER TABLE "countries"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "country_code" UNIQUE ("country_code"),
  ADD CONSTRAINT "country_name" UNIQUE ("country_name");

--
-- Indexes for table "customers"
--
ALTER TABLE "customers"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "customer_code" UNIQUE ("customer_code");

--
-- Indexes for table "customer_complaints"
--
ALTER TABLE "customer_complaints"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "complaint_no" UNIQUE ("complaint_no");

--
-- Indexes for table "customer_contacts"
--
ALTER TABLE "customer_contacts"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_customer_contact" UNIQUE ("customer_id","contact_code");

--
-- Indexes for table "customer_departments"
--
ALTER TABLE "customer_departments"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_customer_department" UNIQUE ("customer_id","department_code");

--
-- Indexes for table "customer_feedback"
--
ALTER TABLE "customer_feedback"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "feedback_no" UNIQUE ("feedback_no");

--
-- Indexes for table "dashboard_layouts"
--
ALTER TABLE "dashboard_layouts"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "layout_code" UNIQUE ("layout_code");

--
-- Indexes for table "dashboard_widgets"
--
ALTER TABLE "dashboard_widgets"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "widget_code" UNIQUE ("widget_code");

--
-- Indexes for table "database_migrations"
--
ALTER TABLE "database_migrations"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "migration_file" UNIQUE ("migration_file");

--
-- Indexes for table "database_version"
--
ALTER TABLE "database_version"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "version_no" UNIQUE ("version_no");

--
-- Indexes for table "deleted_records"
--
ALTER TABLE "deleted_records"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "delete_no" UNIQUE ("delete_no");

--
-- Indexes for table "department_targets"
--
ALTER TABLE "department_targets"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "target_no" UNIQUE ("target_no"),
  ADD CONSTRAINT "uk_department_target" UNIQUE ("organizational_unit_id","financial_year_id","kpi_id");

--
-- Indexes for table "districts"
--
ALTER TABLE "districts"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "district_code" UNIQUE ("district_code");

--
-- Indexes for table "document_reviews"
--
ALTER TABLE "document_reviews"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "job_report_id" UNIQUE ("job_report_id");

--
-- Indexes for table "document_review_audit"
--
ALTER TABLE "document_review_audit"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "email_attachments"
--
ALTER TABLE "email_attachments"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_emailattachment" UNIQUE ("email_queue_id","attachment_no");

--
-- Indexes for table "email_queue"
--
ALTER TABLE "email_queue"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "email_no" UNIQUE ("email_no");

--
-- Indexes for table "employee_kpi_assignments"
--
ALTER TABLE "employee_kpi_assignments"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "assignment_no" UNIQUE ("assignment_no"),
  ADD CONSTRAINT "uk_employee_kpi" UNIQUE ("employee_id","kpi_id","financial_year_id");

--
-- Indexes for table "employee_performance_summary"
--
ALTER TABLE "employee_performance_summary"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "summary_no" UNIQUE ("summary_no"),
  ADD CONSTRAINT "uk_employee_summary" UNIQUE ("employee_id","financial_year_id","evaluation_period","period_year","period_month");

--
-- Indexes for table "engineer_tags"
--
ALTER TABLE "engineer_tags"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "tag_code" UNIQUE ("tag_code");

--
-- Indexes for table "entity_checklists"
--
ALTER TABLE "entity_checklists"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "checklist_no" UNIQUE ("checklist_no");

--
-- Indexes for table "entity_checklist_items"
--
ALTER TABLE "entity_checklist_items"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "checklist_id" UNIQUE ("checklist_id","template_item_id");

--
-- Indexes for table "export_jobs"
--
ALTER TABLE "export_jobs"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "export_no" UNIQUE ("export_no");

--
-- Indexes for table "favorites"
--
ALTER TABLE "favorites"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "feature_flags"
--
ALTER TABLE "feature_flags"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "feature_code" UNIQUE ("feature_code");

--
-- Indexes for table "file_storage"
--
ALTER TABLE "file_storage"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "file_no" UNIQUE ("file_no");

--
-- Indexes for table "file_versions"
--
ALTER TABLE "file_versions"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_fileversion" UNIQUE ("file_storage_id","version_no");

--
-- Indexes for table "financial_years"
--
ALTER TABLE "financial_years"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "financial_year_code" UNIQUE ("financial_year_code");

--
-- Indexes for table "goods_receipts"
--
ALTER TABLE "goods_receipts"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "grn_no" UNIQUE ("grn_no");

--
-- Indexes for table "goods_receipt_items"
--
ALTER TABLE "goods_receipt_items"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "holidays"
--
ALTER TABLE "holidays"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "holiday_code" UNIQUE ("holiday_code");

--
-- Indexes for table "import_errors"
--
ALTER TABLE "import_errors"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "import_jobs"
--
ALTER TABLE "import_jobs"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "import_no" UNIQUE ("import_no");

--
-- Indexes for table "instruments"
--
ALTER TABLE "instruments"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "asset_no" UNIQUE ("asset_no"),
  ADD CONSTRAINT "serial_no" UNIQUE ("serial_no");

--
-- Indexes for table "instrument_categories"
--
ALTER TABLE "instrument_categories"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "category_code" UNIQUE ("category_code");

--
-- Indexes for table "instrument_documents"
--
ALTER TABLE "instrument_documents"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "instrument_history"
--
ALTER TABLE "instrument_history"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "instrument_models"
--
ALTER TABLE "instrument_models"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_brand_model" UNIQUE ("brand_id","model_code");

--
-- Indexes for table "inventory_locations"
--
ALTER TABLE "inventory_locations"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "location_code" UNIQUE ("location_code");

--
-- Indexes for table "inventory_stock"
--
ALTER TABLE "inventory_stock"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_location_part" UNIQUE ("location_id","part_id");

--
-- Indexes for table "inventory_transactions"
--
ALTER TABLE "inventory_transactions"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "transaction_no" UNIQUE ("transaction_no");

--
-- Indexes for table "job_attachments"
--
ALTER TABLE "job_attachments"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "job_checklists"
--
ALTER TABLE "job_checklists"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "job_measurements"
--
ALTER TABLE "job_measurements"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "job_parts"
--
ALTER TABLE "job_parts"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "job_parts_consumption"
--
ALTER TABLE "job_parts_consumption"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "job_reports"
--
ALTER TABLE "job_reports"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "job_id" UNIQUE ("job_id"),
  ADD CONSTRAINT "report_no" UNIQUE ("report_no");

--
-- Indexes for table "job_status_history"
--
ALTER TABLE "job_status_history"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "job_visits"
--
ALTER TABLE "job_visits"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_job_visit" UNIQUE ("job_id","visit_no");

--
-- Indexes for table "kpi_evaluations"
--
ALTER TABLE "kpi_evaluations"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "evaluation_no" UNIQUE ("evaluation_no"),
  ADD CONSTRAINT "uk_employee_evaluation" UNIQUE ("employee_id","financial_year_id","evaluation_period","period_year","period_month");

--
-- Indexes for table "kpi_master"
--
ALTER TABLE "kpi_master"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "kpi_code" UNIQUE ("kpi_code");

--
-- Indexes for table "kpi_measurements"
--
ALTER TABLE "kpi_measurements"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "measurement_no" UNIQUE ("measurement_no"),
  ADD CONSTRAINT "uk_kpi_measurement" UNIQUE ("assignment_id","measurement_period","measurement_year","measurement_month");

--
-- Indexes for table "kpi_measurement_rules"
--
ALTER TABLE "kpi_measurement_rules"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "rule_code" UNIQUE ("rule_code");

--
-- Indexes for table "kpi_role_mapping"
--
ALTER TABLE "kpi_role_mapping"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_kpi_role" UNIQUE ("kpi_id","role_id");

--
-- Indexes for table "label_templates"
--
ALTER TABLE "label_templates"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_label_templates_template_code" UNIQUE ("template_code");

--
-- Indexes for table "license_management"
--
ALTER TABLE "license_management"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "license_no" UNIQUE ("license_no");

--
-- Indexes for table "login_history"
--
ALTER TABLE "login_history"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "manufacturers"
--
ALTER TABLE "manufacturers"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "manufacturer_code" UNIQUE ("manufacturer_code");

--
-- Indexes for table "modules"
--
ALTER TABLE "modules"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "module_code" UNIQUE ("module_code");

--
-- Indexes for table "notifications"
--
ALTER TABLE "notifications"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "notification_no" UNIQUE ("notification_no");

--
-- Indexes for table "notification_templates"
--
ALTER TABLE "notification_templates"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_notification_templates_template_code" UNIQUE ("template_code");

--
-- Indexes for table "organizational_units"
--
ALTER TABLE "organizational_units"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "unit_code" UNIQUE ("unit_code");

--
-- Indexes for table "permissions"
--
ALTER TABLE "permissions"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "permission_code" UNIQUE ("permission_code");

--
-- Indexes for table "pm_execution"
--
ALTER TABLE "pm_execution"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "pm_schedule_id" UNIQUE ("pm_schedule_id");

--
-- Indexes for table "pm_notifications"
--
ALTER TABLE "pm_notifications"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "pm_schedules"
--
ALTER TABLE "pm_schedules"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_pm_schedules_schedule_no" UNIQUE ("schedule_no");

--
-- Indexes for table "provinces"
--
ALTER TABLE "provinces"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "province_code" UNIQUE ("province_code");

--
-- Indexes for table "purchase_orders"
--
ALTER TABLE "purchase_orders"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "po_no" UNIQUE ("po_no");

--
-- Indexes for table "purchase_order_items"
--
ALTER TABLE "purchase_order_items"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_po_line" UNIQUE ("purchase_order_id","line_no");

--
-- Indexes for table "qr_codes"
--
ALTER TABLE "qr_codes"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "qr_code_no" UNIQUE ("qr_code_no"),
  ADD CONSTRAINT "uk_qr_codes_entity_type" UNIQUE ("entity_type","entity_id");

--
-- Indexes for table "recent_activity"
--
ALTER TABLE "recent_activity"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "report_execution_history"
--
ALTER TABLE "report_execution_history"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_report_execution_history_execution_no" UNIQUE ("execution_no");

--
-- Indexes for table "roles"
--
ALTER TABLE "roles"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "role_code" UNIQUE ("role_code");

--
-- Indexes for table "role_permissions"
--
ALTER TABLE "role_permissions"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_role_permission" UNIQUE ("role_id","permission_id");

--
-- Indexes for table "saved_filters"
--
ALTER TABLE "saved_filters"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "filter_code" UNIQUE ("filter_code");

--
-- Indexes for table "saved_reports"
--
ALTER TABLE "saved_reports"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "report_code" UNIQUE ("report_code");

--
-- Indexes for table "sequence_numbers"
--
ALTER TABLE "sequence_numbers"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "sequence_code" UNIQUE ("sequence_code");

--
-- Indexes for table "service_contracts"
--
ALTER TABLE "service_contracts"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_service_contracts_contract_no" UNIQUE ("contract_no");

--
-- Indexes for table "service_jobs"
--
ALTER TABLE "service_jobs"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_service_jobs_job_no" UNIQUE ("job_no");

--
-- Indexes for table "service_requests"
--
ALTER TABLE "service_requests"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "request_no" UNIQUE ("request_no");

--
-- Indexes for table "spare_parts"
--
ALTER TABLE "spare_parts"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "part_number" UNIQUE ("part_number");

--
-- Indexes for table "stock_adjustments"
--
ALTER TABLE "stock_adjustments"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "adjustment_no" UNIQUE ("adjustment_no");

--
-- Indexes for table "stock_adjustment_items"
--
ALTER TABLE "stock_adjustment_items"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_adjustment_line" UNIQUE ("adjustment_id","line_no");

--
-- Indexes for table "stock_take"
--
ALTER TABLE "stock_take"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "stock_take_no" UNIQUE ("stock_take_no");

--
-- Indexes for table "stock_take_items"
--
ALTER TABLE "stock_take_items"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_stocktakeitem_line" UNIQUE ("stock_take_id","line_no");

--
-- Indexes for table "stock_transfers"
--
ALTER TABLE "stock_transfers"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "transfer_no" UNIQUE ("transfer_no");

--
-- Indexes for table "stock_transfer_items"
--
ALTER TABLE "stock_transfer_items"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_transfer_line" UNIQUE ("transfer_id","line_no");

--
-- Indexes for table "suppliers"
--
ALTER TABLE "suppliers"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "supplier_code" UNIQUE ("supplier_code");

--
-- Indexes for table "system_announcements"
--
ALTER TABLE "system_announcements"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "announcement_no" UNIQUE ("announcement_no");

--
-- Indexes for table "system_backup_history"
--
ALTER TABLE "system_backup_history"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "backup_no" UNIQUE ("backup_no");

--
-- Indexes for table "system_health"
--
ALTER TABLE "system_health"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "health_no" UNIQUE ("health_no");

--
-- Indexes for table "system_jobs"
--
ALTER TABLE "system_jobs"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "job_code" UNIQUE ("job_code");

--
-- Indexes for table "system_preferences"
--
ALTER TABLE "system_preferences"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "preference_code" UNIQUE ("preference_code"),
  ADD CONSTRAINT "uk_syspref_key" UNIQUE ("category","preference_key");

--
-- Indexes for table "system_settings"
--
ALTER TABLE "system_settings"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_systemsetting_key" UNIQUE ("setting_group","setting_key");

--
-- Indexes for table "tasks"
--
ALTER TABLE "tasks"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "task_no" UNIQUE ("task_no");

--
-- Indexes for table "task_assignments"
--
ALTER TABLE "task_assignments"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_task_assignments_task_id" UNIQUE ("task_id","assigned_to");

--
-- Indexes for table "task_attachments"
--
ALTER TABLE "task_attachments"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_task_attachments_task_id" UNIQUE ("task_id","file_storage_id");

--
-- Indexes for table "task_comments"
--
ALTER TABLE "task_comments"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "territories"
--
ALTER TABLE "territories"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "territory_code" UNIQUE ("territory_code");

--
-- Indexes for table "territory_engineers"
--
ALTER TABLE "territory_engineers"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_territory_user" UNIQUE ("territory_id","user_id");

--
-- Indexes for table "users"
--
ALTER TABLE "users"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "employee_no" UNIQUE ("employee_no"),
  ADD CONSTRAINT "username" UNIQUE ("username"),
  ADD CONSTRAINT "email" UNIQUE ("email");

--
-- Indexes for table "user_engineer_tags"
--
ALTER TABLE "user_engineer_tags"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_user_engineer_tag" UNIQUE ("user_id","engineer_tag_id");

--
-- Indexes for table "user_preferences"
--
ALTER TABLE "user_preferences"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_userpreference" UNIQUE ("user_id","preference_key");

--
-- Indexes for table "user_roles"
--
ALTER TABLE "user_roles"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_user_role" UNIQUE ("user_id","role_id");

--
-- Indexes for table "vendors"
--
ALTER TABLE "vendors"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "vendor_code" UNIQUE ("vendor_code");

--
-- Indexes for table "vendor_performance"
--
ALTER TABLE "vendor_performance"
  ADD PRIMARY KEY ("id");

--
-- Indexes for table "warranty_activations"
--
ALTER TABLE "warranty_activations"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "instrument_id" UNIQUE ("instrument_id"),
  ADD CONSTRAINT "document_review_id" UNIQUE ("document_review_id");

--
-- Indexes for table "webhook_logs"
--
ALTER TABLE "webhook_logs"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_webhook_logs_execution_no" UNIQUE ("execution_no");

--
-- Indexes for table "working_calendar"
--
ALTER TABLE "working_calendar"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "calendar_code" UNIQUE ("calendar_code"),
  ADD CONSTRAINT "company_id" UNIQUE ("company_id","branch_id","weekday");

--
-- Indexes for table "workshop_jobs"
--
ALTER TABLE "workshop_jobs"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "service_job_id" UNIQUE ("service_job_id"),
  ADD CONSTRAINT "workshop_job_no" UNIQUE ("workshop_job_no");

--
-- Indexes for table "workshop_quality_checks"
--
ALTER TABLE "workshop_quality_checks"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "workshop_job_id" UNIQUE ("workshop_job_id");

--
-- Indexes for table "workshop_repair_log"
--
ALTER TABLE "workshop_repair_log"
  ADD PRIMARY KEY ("id"),
  ADD CONSTRAINT "uk_workshop_activity" UNIQUE ("workshop_job_id","activity_no");

--
-- Constraints for dumped tables
--

--
-- Constraints for table "activity_log"
--
ALTER TABLE "activity_log"
  ADD CONSTRAINT "fk_activitylog_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_activitylog_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "amc_contracts"
--
ALTER TABLE "amc_contracts"
  ADD CONSTRAINT "fk_amc_createdby" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_amc_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_amc_engineer" FOREIGN KEY ("assigned_engineer_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_amc_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "amc_visits"
--
ALTER TABLE "amc_visits"
  ADD CONSTRAINT "fk_amcvisit_contract" FOREIGN KEY ("amc_contract_id") REFERENCES "amc_contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_amcvisit_engineer" FOREIGN KEY ("engineer_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_amcvisit_job" FOREIGN KEY ("service_job_id") REFERENCES "service_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "api_keys"
--
ALTER TABLE "api_keys"
  ADD CONSTRAINT "fk_apikey_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_apikey_owner" FOREIGN KEY ("owner_user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "api_logs"
--
ALTER TABLE "api_logs"
  ADD CONSTRAINT "fk_apilog_apikey" FOREIGN KEY ("api_key_id") REFERENCES "api_keys" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_apilog_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "api_webhooks"
--
ALTER TABLE "api_webhooks"
  ADD CONSTRAINT "fk_apiwebhook_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "application_configuration"
--
ALTER TABLE "application_configuration"
  ADD CONSTRAINT "fk_appconfig_user" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "application_integrations"
--
ALTER TABLE "application_integrations"
  ADD CONSTRAINT "fk_appintegration_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "application_logs"
--
ALTER TABLE "application_logs"
  ADD CONSTRAINT "fk_applog_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_applog_resolvedby" FOREIGN KEY ("resolved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_applog_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "audit_logs"
--
ALTER TABLE "audit_logs"
  ADD CONSTRAINT "fk_auditlog_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_auditlog_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "background_jobs"
--
ALTER TABLE "background_jobs"
  ADD CONSTRAINT "fk_backgroundjob_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "barcodes"
--
ALTER TABLE "barcodes"
  ADD CONSTRAINT "fk_barcode_user" FOREIGN KEY ("generated_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "branches"
--
ALTER TABLE "branches"
  ADD CONSTRAINT "fk_branch_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "brands"
--
ALTER TABLE "brands"
  ADD CONSTRAINT "fk_brand_manufacturer" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturers" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "calibration_certificates"
--
ALTER TABLE "calibration_certificates"
  ADD CONSTRAINT "fk_cc_approved_by" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_cc_execution" FOREIGN KEY ("calibration_execution_id") REFERENCES "calibration_execution" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_cc_issued_by" FOREIGN KEY ("issued_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "calibration_execution"
--
ALTER TABLE "calibration_execution"
  ADD CONSTRAINT "fk_ce_engineer" FOREIGN KEY ("engineer_id") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_ce_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_ce_schedule" FOREIGN KEY ("calibration_schedule_id") REFERENCES "calibration_schedules" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_ce_verified" FOREIGN KEY ("verified_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "calibration_measurements"
--
ALTER TABLE "calibration_measurements"
  ADD CONSTRAINT "fk_cm_execution" FOREIGN KEY ("calibration_execution_id") REFERENCES "calibration_execution" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "calibration_schedules"
--
ALTER TABLE "calibration_schedules"
  ADD CONSTRAINT "fk_cs_engineer" FOREIGN KEY ("assigned_engineer_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_cs_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_cs_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "checklist_templates"
--
ALTER TABLE "checklist_templates"
  ADD CONSTRAINT "fk_checklisttemplate_approver" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_checklisttemplate_category" FOREIGN KEY ("equipment_category_id") REFERENCES "instrument_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_checklisttemplate_creator" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "checklist_template_items"
--
ALTER TABLE "checklist_template_items"
  ADD CONSTRAINT "fk_cti_template" FOREIGN KEY ("template_id") REFERENCES "checklist_templates" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "comments"
--
ALTER TABLE "comments"
  ADD CONSTRAINT "fk_comment_parent" FOREIGN KEY ("parent_comment_id") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_comment_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "contract_instruments"
--
ALTER TABLE "contract_instruments"
  ADD CONSTRAINT "fk_ci_contract" FOREIGN KEY ("contract_id") REFERENCES "service_contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_ci_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "customers"
--
ALTER TABLE "customers"
  ADD CONSTRAINT "fk_customer_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_customer_territory" FOREIGN KEY ("territory_id") REFERENCES "territories" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "customer_complaints"
--
ALTER TABLE "customer_complaints"
  ADD CONSTRAINT "fk_customercomplaint_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_customercomplaint_engineer" FOREIGN KEY ("assigned_to") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_customercomplaint_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_customercomplaint_job" FOREIGN KEY ("service_job_id") REFERENCES "service_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "customer_contacts"
--
ALTER TABLE "customer_contacts"
  ADD CONSTRAINT "fk_contact_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_contact_department" FOREIGN KEY ("department_id") REFERENCES "customer_departments" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "customer_departments"
--
ALTER TABLE "customer_departments"
  ADD CONSTRAINT "fk_customer_department_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "customer_feedback"
--
ALTER TABLE "customer_feedback"
  ADD CONSTRAINT "fk_customerfeedback_complaint" FOREIGN KEY ("complaint_id") REFERENCES "customer_complaints" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_customerfeedback_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_customerfeedback_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_customerfeedback_job" FOREIGN KEY ("service_job_id") REFERENCES "service_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_customerfeedback_user" FOREIGN KEY ("reviewed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "dashboard_layouts"
--
ALTER TABLE "dashboard_layouts"
  ADD CONSTRAINT "fk_dashboardlayout_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "dashboard_widgets"
--
ALTER TABLE "dashboard_widgets"
  ADD CONSTRAINT "fk_dashboardwidget_module" FOREIGN KEY ("module_id") REFERENCES "modules" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_dashboardwidget_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "database_version"
--
ALTER TABLE "database_version"
  ADD CONSTRAINT "fk_dbversion_user" FOREIGN KEY ("installed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "deleted_records"
--
ALTER TABLE "deleted_records"
  ADD CONSTRAINT "fk_deleted_branch" FOREIGN KEY ("branch_id") REFERENCES "branches" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_deleted_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_deleted_user" FOREIGN KEY ("deleted_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_restored_user" FOREIGN KEY ("restored_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "department_targets"
--
ALTER TABLE "department_targets"
  ADD CONSTRAINT "fk_depttarget_approvedby" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_depttarget_createdby" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_depttarget_finyear" FOREIGN KEY ("financial_year_id") REFERENCES "financial_years" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_depttarget_kpi" FOREIGN KEY ("kpi_id") REFERENCES "kpi_master" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_depttarget_orgunit" FOREIGN KEY ("organizational_unit_id") REFERENCES "organizational_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_depttarget_responsible" FOREIGN KEY ("responsible_user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "districts"
--
ALTER TABLE "districts"
  ADD CONSTRAINT "fk_district_province" FOREIGN KEY ("province_id") REFERENCES "provinces" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "document_reviews"
--
ALTER TABLE "document_reviews"
  ADD CONSTRAINT "fk_doc_review_report" FOREIGN KEY ("job_report_id") REFERENCES "job_reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_doc_review_user" FOREIGN KEY ("documentation_officer_id") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "document_review_audit"
--
ALTER TABLE "document_review_audit"
  ADD CONSTRAINT "fk_dra_review" FOREIGN KEY ("document_review_id") REFERENCES "document_reviews" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_dra_user" FOREIGN KEY ("performed_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "email_attachments"
--
ALTER TABLE "email_attachments"
  ADD CONSTRAINT "fk_emailattachment_email" FOREIGN KEY ("email_queue_id") REFERENCES "email_queue" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_emailattachment_user" FOREIGN KEY ("uploaded_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "email_queue"
--
ALTER TABLE "email_queue"
  ADD CONSTRAINT "fk_emailqueue_template" FOREIGN KEY ("template_id") REFERENCES "notification_templates" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_emailqueue_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "employee_kpi_assignments"
--
ALTER TABLE "employee_kpi_assignments"
  ADD CONSTRAINT "fk_empkpi_assignedby" FOREIGN KEY ("assigned_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_empkpi_employee" FOREIGN KEY ("employee_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_empkpi_finyear" FOREIGN KEY ("financial_year_id") REFERENCES "financial_years" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_empkpi_kpi" FOREIGN KEY ("kpi_id") REFERENCES "kpi_master" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_empkpi_orgunit" FOREIGN KEY ("organizational_unit_id") REFERENCES "organizational_units" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "employee_performance_summary"
--
ALTER TABLE "employee_performance_summary"
  ADD CONSTRAINT "fk_eps_approver" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_eps_employee" FOREIGN KEY ("employee_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_eps_evaluator" FOREIGN KEY ("evaluated_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_eps_finyear" FOREIGN KEY ("financial_year_id") REFERENCES "financial_years" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_eps_orgunit" FOREIGN KEY ("organizational_unit_id") REFERENCES "organizational_units" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "entity_checklists"
--
ALTER TABLE "entity_checklists"
  ADD CONSTRAINT "fk_entitychecklist_template" FOREIGN KEY ("template_id") REFERENCES "checklist_templates" ("id"),
  ADD CONSTRAINT "fk_entitychecklist_user" FOREIGN KEY ("assigned_to") REFERENCES "users" ("id");

--
-- Constraints for table "entity_checklist_items"
--
ALTER TABLE "entity_checklist_items"
  ADD CONSTRAINT "fk_eci_checklist" FOREIGN KEY ("checklist_id") REFERENCES "entity_checklists" ("id") ON DELETE CASCADE,
  ADD CONSTRAINT "fk_eci_templateitem" FOREIGN KEY ("template_item_id") REFERENCES "checklist_template_items" ("id"),
  ADD CONSTRAINT "fk_eci_user" FOREIGN KEY ("completed_by") REFERENCES "users" ("id") ON DELETE SET NULL;

--
-- Constraints for table "export_jobs"
--
ALTER TABLE "export_jobs"
  ADD CONSTRAINT "fk_export_file" FOREIGN KEY ("file_storage_id") REFERENCES "file_storage" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_export_user" FOREIGN KEY ("exported_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "favorites"
--
ALTER TABLE "favorites"
  ADD CONSTRAINT "fk_favorite_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "feature_flags"
--
ALTER TABLE "feature_flags"
  ADD CONSTRAINT "fk_featureflag_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "file_storage"
--
ALTER TABLE "file_storage"
  ADD CONSTRAINT "fk_filestorage_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_filestorage_user" FOREIGN KEY ("uploaded_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "file_versions"
--
ALTER TABLE "file_versions"
  ADD CONSTRAINT "fk_fileversion_approvedby" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_fileversion_file" FOREIGN KEY ("file_storage_id") REFERENCES "file_storage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_fileversion_uploadedby" FOREIGN KEY ("uploaded_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "financial_years"
--
ALTER TABLE "financial_years"
  ADD CONSTRAINT "fk_finyear_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "goods_receipts"
--
ALTER TABLE "goods_receipts"
  ADD CONSTRAINT "fk_grn_inspected_by" FOREIGN KEY ("inspected_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_grn_location" FOREIGN KEY ("location_id") REFERENCES "inventory_locations" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_grn_po" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_grn_received_by" FOREIGN KEY ("received_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_grn_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "goods_receipt_items"
--
ALTER TABLE "goods_receipt_items"
  ADD CONSTRAINT "fk_gri_grn" FOREIGN KEY ("goods_receipt_id") REFERENCES "goods_receipts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_gri_part" FOREIGN KEY ("part_id") REFERENCES "spare_parts" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_gri_po_item" FOREIGN KEY ("purchase_order_item_id") REFERENCES "purchase_order_items" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "holidays"
--
ALTER TABLE "holidays"
  ADD CONSTRAINT "fk_holiday_branch" FOREIGN KEY ("branch_id") REFERENCES "branches" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_holiday_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_holiday_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "import_errors"
--
ALTER TABLE "import_errors"
  ADD CONSTRAINT "fk_importerror_job" FOREIGN KEY ("import_job_id") REFERENCES "import_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "import_jobs"
--
ALTER TABLE "import_jobs"
  ADD CONSTRAINT "fk_importjob_file" FOREIGN KEY ("file_storage_id") REFERENCES "file_storage" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_importjob_user" FOREIGN KEY ("imported_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "instruments"
--
ALTER TABLE "instruments"
  ADD CONSTRAINT "fk_instrument_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_instrument_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_instrument_department" FOREIGN KEY ("department_id") REFERENCES "customer_departments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_instrument_engineer" FOREIGN KEY ("assigned_engineer_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_instrument_model" FOREIGN KEY ("model_id") REFERENCES "instrument_models" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_instrument_territory" FOREIGN KEY ("territory_id") REFERENCES "territories" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "instrument_categories"
--
ALTER TABLE "instrument_categories"
  ADD CONSTRAINT "fk_category_parent" FOREIGN KEY ("parent_category_id") REFERENCES "instrument_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "instrument_documents"
--
ALTER TABLE "instrument_documents"
  ADD CONSTRAINT "fk_doc_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_doc_uploaded_by" FOREIGN KEY ("uploaded_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "instrument_history"
--
ALTER TABLE "instrument_history"
  ADD CONSTRAINT "fk_history_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_history_user" FOREIGN KEY ("performed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "instrument_models"
--
ALTER TABLE "instrument_models"
  ADD CONSTRAINT "fk_model_brand" FOREIGN KEY ("brand_id") REFERENCES "brands" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_model_category" FOREIGN KEY ("category_id") REFERENCES "instrument_categories" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "inventory_locations"
--
ALTER TABLE "inventory_locations"
  ADD CONSTRAINT "fk_inventory_location_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "inventory_stock"
--
ALTER TABLE "inventory_stock"
  ADD CONSTRAINT "fk_inventory_stock_location" FOREIGN KEY ("location_id") REFERENCES "inventory_locations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_inventory_stock_part" FOREIGN KEY ("part_id") REFERENCES "spare_parts" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "inventory_transactions"
--
ALTER TABLE "inventory_transactions"
  ADD CONSTRAINT "fk_it_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_it_location" FOREIGN KEY ("location_id") REFERENCES "inventory_locations" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_it_part" FOREIGN KEY ("part_id") REFERENCES "spare_parts" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_it_user" FOREIGN KEY ("performed_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_it_workshop" FOREIGN KEY ("workshop_job_id") REFERENCES "workshop_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "job_attachments"
--
ALTER TABLE "job_attachments"
  ADD CONSTRAINT "fk_job_attachment_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_job_attachment_user" FOREIGN KEY ("uploaded_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "job_checklists"
--
ALTER TABLE "job_checklists"
  ADD CONSTRAINT "fk_job_checklist_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_job_checklist_user" FOREIGN KEY ("completed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "job_measurements"
--
ALTER TABLE "job_measurements"
  ADD CONSTRAINT "fk_measurement_checklist" FOREIGN KEY ("checklist_id") REFERENCES "job_checklists" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_measurement_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_measurement_user" FOREIGN KEY ("measured_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "job_parts"
--
ALTER TABLE "job_parts"
  ADD CONSTRAINT "fk_job_parts_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_job_parts_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "job_parts_consumption"
--
ALTER TABLE "job_parts_consumption"
  ADD CONSTRAINT "fk_jpc_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_jpc_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_jpc_job_part" FOREIGN KEY ("job_part_id") REFERENCES "job_parts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_jpc_user" FOREIGN KEY ("installed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "job_reports"
--
ALTER TABLE "job_reports"
  ADD CONSTRAINT "fk_job_report_approver" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_job_report_engineer" FOREIGN KEY ("engineer_id") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_job_report_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "job_status_history"
--
ALTER TABLE "job_status_history"
  ADD CONSTRAINT "fk_jsh_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_jsh_user" FOREIGN KEY ("changed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "job_visits"
--
ALTER TABLE "job_visits"
  ADD CONSTRAINT "fk_job_visit_engineer" FOREIGN KEY ("engineer_id") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_job_visit_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "kpi_evaluations"
--
ALTER TABLE "kpi_evaluations"
  ADD CONSTRAINT "fk_kpieval_approver" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_kpieval_employee" FOREIGN KEY ("employee_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_kpieval_evaluator" FOREIGN KEY ("evaluated_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_kpieval_finyear" FOREIGN KEY ("financial_year_id") REFERENCES "financial_years" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "kpi_master"
--
ALTER TABLE "kpi_master"
  ADD CONSTRAINT "fk_kpi_master_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "kpi_measurements"
--
ALTER TABLE "kpi_measurements"
  ADD CONSTRAINT "fk_kpimeasure_approvedby" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_kpimeasure_assignment" FOREIGN KEY ("assignment_id") REFERENCES "employee_kpi_assignments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_kpimeasure_measuredby" FOREIGN KEY ("measured_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "kpi_measurement_rules"
--
ALTER TABLE "kpi_measurement_rules"
  ADD CONSTRAINT "fk_kpirule_kpi" FOREIGN KEY ("kpi_id") REFERENCES "kpi_master" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_kpirule_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "kpi_role_mapping"
--
ALTER TABLE "kpi_role_mapping"
  ADD CONSTRAINT "fk_kpirole_kpi" FOREIGN KEY ("kpi_id") REFERENCES "kpi_master" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_kpirole_orgunit" FOREIGN KEY ("organizational_unit_id") REFERENCES "organizational_units" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_kpirole_role" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_kpirole_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "label_templates"
--
ALTER TABLE "label_templates"
  ADD CONSTRAINT "fk_labeltemplate_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "license_management"
--
ALTER TABLE "license_management"
  ADD CONSTRAINT "fk_license_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_license_createdby" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_license_user" FOREIGN KEY ("assigned_user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "login_history"
--
ALTER TABLE "login_history"
  ADD CONSTRAINT "fk_login_history_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "manufacturers"
--
ALTER TABLE "manufacturers"
  ADD CONSTRAINT "fk_manufacturer_country" FOREIGN KEY ("country_id") REFERENCES "countries" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "notifications"
--
ALTER TABLE "notifications"
  ADD CONSTRAINT "fk_notification_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_notification_job" FOREIGN KEY ("service_job_id") REFERENCES "service_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_notification_user" FOREIGN KEY ("recipient_user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "notification_templates"
--
ALTER TABLE "notification_templates"
  ADD CONSTRAINT "fk_notificationtemplate_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "organizational_units"
--
ALTER TABLE "organizational_units"
  ADD CONSTRAINT "fk_org_branch" FOREIGN KEY ("branch_id") REFERENCES "branches" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_org_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_org_createdby" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_org_manager" FOREIGN KEY ("manager_user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_org_parent" FOREIGN KEY ("parent_unit_id") REFERENCES "organizational_units" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "permissions"
--
ALTER TABLE "permissions"
  ADD CONSTRAINT "fk_permissions_module" FOREIGN KEY ("module_id") REFERENCES "modules" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "pm_execution"
--
ALTER TABLE "pm_execution"
  ADD CONSTRAINT "fk_pm_exec_engineer" FOREIGN KEY ("engineer_id") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_pm_exec_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_pm_exec_schedule" FOREIGN KEY ("pm_schedule_id") REFERENCES "pm_schedules" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_pm_exec_verified" FOREIGN KEY ("verified_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "pm_notifications"
--
ALTER TABLE "pm_notifications"
  ADD CONSTRAINT "fk_pm_notification_schedule" FOREIGN KEY ("pm_schedule_id") REFERENCES "pm_schedules" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_pm_notification_user" FOREIGN KEY ("recipient_user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "pm_schedules"
--
ALTER TABLE "pm_schedules"
  ADD CONSTRAINT "fk_pm_activation" FOREIGN KEY ("warranty_activation_id") REFERENCES "warranty_activations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_pm_engineer" FOREIGN KEY ("assigned_engineer_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_pm_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_pm_job" FOREIGN KEY ("job_id") REFERENCES "service_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "provinces"
--
ALTER TABLE "provinces"
  ADD CONSTRAINT "fk_province_country" FOREIGN KEY ("country_id") REFERENCES "countries" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "purchase_orders"
--
ALTER TABLE "purchase_orders"
  ADD CONSTRAINT "fk_po_approved_by" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_po_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_po_location" FOREIGN KEY ("location_id") REFERENCES "inventory_locations" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_po_ordered_by" FOREIGN KEY ("ordered_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_po_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "purchase_order_items"
--
ALTER TABLE "purchase_order_items"
  ADD CONSTRAINT "fk_poi_part" FOREIGN KEY ("part_id") REFERENCES "spare_parts" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_poi_po" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "qr_codes"
--
ALTER TABLE "qr_codes"
  ADD CONSTRAINT "fk_qrcode_user" FOREIGN KEY ("generated_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "recent_activity"
--
ALTER TABLE "recent_activity"
  ADD CONSTRAINT "fk_recentactivity_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "report_execution_history"
--
ALTER TABLE "report_execution_history"
  ADD CONSTRAINT "fk_reportexecution_report" FOREIGN KEY ("report_id") REFERENCES "saved_reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_reportexecution_user" FOREIGN KEY ("executed_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "role_permissions"
--
ALTER TABLE "role_permissions"
  ADD CONSTRAINT "fk_role_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_role_permissions_role" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "saved_filters"
--
ALTER TABLE "saved_filters"
  ADD CONSTRAINT "fk_savedfilter_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "saved_reports"
--
ALTER TABLE "saved_reports"
  ADD CONSTRAINT "fk_savedreport_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "sequence_numbers"
--
ALTER TABLE "sequence_numbers"
  ADD CONSTRAINT "fk_sequence_branch" FOREIGN KEY ("branch_id") REFERENCES "branches" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sequence_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sequence_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "service_contracts"
--
ALTER TABLE "service_contracts"
  ADD CONSTRAINT "fk_contract_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_contract_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "service_jobs"
--
ALTER TABLE "service_jobs"
  ADD CONSTRAINT "fk_job_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_job_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_job_engineer" FOREIGN KEY ("assigned_engineer_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_job_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_job_request" FOREIGN KEY ("service_request_id") REFERENCES "service_requests" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_job_territory" FOREIGN KEY ("territory_id") REFERENCES "territories" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "service_requests"
--
ALTER TABLE "service_requests"
  ADD CONSTRAINT "fk_sr_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sr_contact" FOREIGN KEY ("contact_id") REFERENCES "customer_contacts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sr_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sr_department" FOREIGN KEY ("department_id") REFERENCES "customer_departments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sr_engineer" FOREIGN KEY ("assigned_engineer_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sr_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sr_territory" FOREIGN KEY ("territory_id") REFERENCES "territories" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "spare_parts"
--
ALTER TABLE "spare_parts"
  ADD CONSTRAINT "fk_sp_brand" FOREIGN KEY ("brand_id") REFERENCES "brands" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sp_manufacturer" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturers" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "stock_adjustments"
--
ALTER TABLE "stock_adjustments"
  ADD CONSTRAINT "fk_sa_approved_by" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sa_created_by" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sa_location" FOREIGN KEY ("location_id") REFERENCES "inventory_locations" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "stock_adjustment_items"
--
ALTER TABLE "stock_adjustment_items"
  ADD CONSTRAINT "fk_sai_adjustment" FOREIGN KEY ("adjustment_id") REFERENCES "stock_adjustments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sai_part" FOREIGN KEY ("part_id") REFERENCES "spare_parts" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "stock_take"
--
ALTER TABLE "stock_take"
  ADD CONSTRAINT "fk_stocktake_approver" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_stocktake_counter" FOREIGN KEY ("counted_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_stocktake_location" FOREIGN KEY ("location_id") REFERENCES "inventory_locations" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_stocktake_verifier" FOREIGN KEY ("verified_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "stock_take_items"
--
ALTER TABLE "stock_take_items"
  ADD CONSTRAINT "fk_stocktakeitem_counter" FOREIGN KEY ("counted_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_stocktakeitem_part" FOREIGN KEY ("part_id") REFERENCES "spare_parts" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_stocktakeitem_stocktake" FOREIGN KEY ("stock_take_id") REFERENCES "stock_take" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "stock_transfers"
--
ALTER TABLE "stock_transfers"
  ADD CONSTRAINT "fk_st_approved_by" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_st_dispatched_by" FOREIGN KEY ("dispatched_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_st_from_location" FOREIGN KEY ("from_location_id") REFERENCES "inventory_locations" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_st_received_by" FOREIGN KEY ("received_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_st_requested_by" FOREIGN KEY ("requested_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_st_to_location" FOREIGN KEY ("to_location_id") REFERENCES "inventory_locations" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "stock_transfer_items"
--
ALTER TABLE "stock_transfer_items"
  ADD CONSTRAINT "fk_sti_part" FOREIGN KEY ("part_id") REFERENCES "spare_parts" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_sti_transfer" FOREIGN KEY ("transfer_id") REFERENCES "stock_transfers" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "suppliers"
--
ALTER TABLE "suppliers"
  ADD CONSTRAINT "fk_supplier_country" FOREIGN KEY ("country_id") REFERENCES "countries" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "system_announcements"
--
ALTER TABLE "system_announcements"
  ADD CONSTRAINT "fk_announcement_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_announcement_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "system_backup_history"
--
ALTER TABLE "system_backup_history"
  ADD CONSTRAINT "fk_backuphistory_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "system_jobs"
--
ALTER TABLE "system_jobs"
  ADD CONSTRAINT "fk_systemjob_createdby" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_systemjob_user" FOREIGN KEY ("run_as_user") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "system_preferences"
--
ALTER TABLE "system_preferences"
  ADD CONSTRAINT "fk_syspref_updatedby" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "system_settings"
--
ALTER TABLE "system_settings"
  ADD CONSTRAINT "fk_systemsetting_user" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "tasks"
--
ALTER TABLE "tasks"
  ADD CONSTRAINT "fk_task_creator" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "task_assignments"
--
ALTER TABLE "task_assignments"
  ADD CONSTRAINT "fk_taskassign_assigner" FOREIGN KEY ("assigned_by") REFERENCES "users" ("id"),
  ADD CONSTRAINT "fk_taskassign_task" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON DELETE CASCADE,
  ADD CONSTRAINT "fk_taskassign_user" FOREIGN KEY ("assigned_to") REFERENCES "users" ("id");

--
-- Constraints for table "task_attachments"
--
ALTER TABLE "task_attachments"
  ADD CONSTRAINT "fk_taskattachment_file" FOREIGN KEY ("file_storage_id") REFERENCES "file_storage" ("id") ON DELETE CASCADE,
  ADD CONSTRAINT "fk_taskattachment_task" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON DELETE CASCADE,
  ADD CONSTRAINT "fk_taskattachment_user" FOREIGN KEY ("uploaded_by") REFERENCES "users" ("id");

--
-- Constraints for table "task_comments"
--
ALTER TABLE "task_comments"
  ADD CONSTRAINT "fk_taskcomment_task" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON DELETE CASCADE,
  ADD CONSTRAINT "fk_taskcomment_user" FOREIGN KEY ("commented_by") REFERENCES "users" ("id");

--
-- Constraints for table "territories"
--
ALTER TABLE "territories"
  ADD CONSTRAINT "fk_territories_branch" FOREIGN KEY ("branch_id") REFERENCES "branches" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_territories_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_territories_district" FOREIGN KEY ("district_id") REFERENCES "districts" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "territory_engineers"
--
ALTER TABLE "territory_engineers"
  ADD CONSTRAINT "fk_te_territory" FOREIGN KEY ("territory_id") REFERENCES "territories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_te_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "users"
--
ALTER TABLE "users"
  ADD CONSTRAINT "fk_users_branch" FOREIGN KEY ("branch_id") REFERENCES "branches" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_users_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "user_engineer_tags"
--
ALTER TABLE "user_engineer_tags"
  ADD CONSTRAINT "fk_uet_tag" FOREIGN KEY ("engineer_tag_id") REFERENCES "engineer_tags" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_uet_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "user_preferences"
--
ALTER TABLE "user_preferences"
  ADD CONSTRAINT "fk_userpreference_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "user_roles"
--
ALTER TABLE "user_roles"
  ADD CONSTRAINT "fk_user_roles_role" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_user_roles_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "vendors"
--
ALTER TABLE "vendors"
  ADD CONSTRAINT "fk_vendor_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_vendor_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "vendor_performance"
--
ALTER TABLE "vendor_performance"
  ADD CONSTRAINT "fk_vendorperformance_user" FOREIGN KEY ("evaluated_by") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_vendorperformance_vendor" FOREIGN KEY ("vendor_id") REFERENCES "vendors" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "warranty_activations"
--
ALTER TABLE "warranty_activations"
  ADD CONSTRAINT "fk_wa_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_wa_review" FOREIGN KEY ("document_review_id") REFERENCES "document_reviews" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_wa_user" FOREIGN KEY ("activated_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "webhook_logs"
--
ALTER TABLE "webhook_logs"
  ADD CONSTRAINT "fk_webhooklog_webhook" FOREIGN KEY ("webhook_id") REFERENCES "api_webhooks" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "working_calendar"
--
ALTER TABLE "working_calendar"
  ADD CONSTRAINT "fk_calendar_branch" FOREIGN KEY ("branch_id") REFERENCES "branches" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_calendar_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_calendar_user" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table "workshop_jobs"
--
ALTER TABLE "workshop_jobs"
  ADD CONSTRAINT "fk_ws_customer" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_ws_instrument" FOREIGN KEY ("instrument_id") REFERENCES "instruments" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_ws_job" FOREIGN KEY ("service_job_id") REFERENCES "service_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_ws_received_by" FOREIGN KEY ("received_by") REFERENCES "users" ("id") ON UPDATE CASCADE;

--
-- Constraints for table "workshop_quality_checks"
--
ALTER TABLE "workshop_quality_checks"
  ADD CONSTRAINT "fk_wqc_engineer" FOREIGN KEY ("qa_engineer_id") REFERENCES "users" ("id") ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_wqc_workshop" FOREIGN KEY ("workshop_job_id") REFERENCES "workshop_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "workshop_repair_log"
--
ALTER TABLE "workshop_repair_log"
  ADD CONSTRAINT "fk_wrl_job" FOREIGN KEY ("workshop_job_id") REFERENCES "workshop_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_wrl_user" FOREIGN KEY ("performed_by") REFERENCES "users" ("id") ON UPDATE CASCADE;
-- COMMIT;



-- ==========================================================
-- ADDITIONAL INDEXES
-- ==========================================================
CREATE INDEX "idx_activitylog_user" ON "activity_log" ("user_id");
CREATE INDEX "idx_activitylog_company" ON "activity_log" ("company_id");
CREATE INDEX "idx_activitylog_module" ON "activity_log" ("module_code");
CREATE INDEX "idx_activitylog_type" ON "activity_log" ("activity_type");
CREATE INDEX "idx_activitylog_time" ON "activity_log" ("activity_time");
CREATE INDEX "fk_amc_engineer" ON "amc_contracts" ("assigned_engineer_id");
CREATE INDEX "fk_amc_createdby" ON "amc_contracts" ("created_by");
CREATE INDEX "idx_amc_contract" ON "amc_contracts" ("contract_no");
CREATE INDEX "idx_amc_customer" ON "amc_contracts" ("customer_id");
CREATE INDEX "idx_amc_instrument" ON "amc_contracts" ("instrument_id");
CREATE INDEX "idx_amc_status" ON "amc_contracts" ("contract_status");
CREATE INDEX "fk_amcvisit_job" ON "amc_visits" ("service_job_id");
CREATE INDEX "fk_amcvisit_engineer" ON "amc_visits" ("engineer_id");
CREATE INDEX "idx_amcvisit_contract" ON "amc_visits" ("amc_contract_id");
CREATE INDEX "idx_amcvisit_date" ON "amc_visits" ("planned_date");
CREATE INDEX "idx_amcvisit_status" ON "amc_visits" ("visit_status");
CREATE INDEX "idx_apikey_company" ON "api_keys" ("company_id");
CREATE INDEX "idx_apikey_owner" ON "api_keys" ("owner_user_id");
CREATE INDEX "idx_apikey_environment" ON "api_keys" ("environment");
CREATE INDEX "idx_apikey_active" ON "api_keys" ("active");
CREATE INDEX "idx_apilog_key" ON "api_logs" ("api_key_id");
CREATE INDEX "idx_apilog_user" ON "api_logs" ("user_id");
CREATE INDEX "idx_apilog_time" ON "api_logs" ("request_time");
CREATE INDEX "idx_apilog_endpoint" ON "api_logs" ("endpoint");
CREATE INDEX "idx_apilog_response" ON "api_logs" ("response_code");
CREATE INDEX "fk_apiwebhook_user" ON "api_webhooks" ("created_by");
CREATE INDEX "idx_apiwebhook_event" ON "api_webhooks" ("event_name");
CREATE INDEX "idx_apiwebhook_active" ON "api_webhooks" ("active");
CREATE INDEX "fk_appconfig_user" ON "application_configuration" ("updated_by");
CREATE INDEX "idx_appconfig_group" ON "application_configuration" ("config_group");
CREATE INDEX "idx_appconfig_active" ON "application_configuration" ("active");
CREATE INDEX "fk_appintegration_user" ON "application_integrations" ("created_by");
CREATE INDEX "idx_appintegration_type" ON "application_integrations" ("integration_type");
CREATE INDEX "idx_appintegration_status" ON "application_integrations" ("last_status");
CREATE INDEX "idx_appintegration_active" ON "application_integrations" ("active");
CREATE INDEX "fk_applog_user" ON "application_logs" ("user_id");
CREATE INDEX "fk_applog_company" ON "application_logs" ("company_id");
CREATE INDEX "fk_applog_resolvedby" ON "application_logs" ("resolved_by");
CREATE INDEX "idx_applog_time" ON "application_logs" ("log_time");
CREATE INDEX "idx_applog_level" ON "application_logs" ("log_level");
CREATE INDEX "idx_applog_module" ON "application_logs" ("module_name");
CREATE INDEX "idx_applog_resolved" ON "application_logs" ("resolved");
CREATE INDEX "fk_auditlog_company" ON "audit_logs" ("company_id");
CREATE INDEX "idx_audit_time" ON "audit_logs" ("event_time");
CREATE INDEX "idx_audit_user" ON "audit_logs" ("user_id");
CREATE INDEX "idx_audit_module" ON "audit_logs" ("module");
CREATE INDEX "idx_audit_action" ON "audit_logs" ("action");
CREATE INDEX "idx_audit_entity" ON "audit_logs" ("entity_name");
CREATE INDEX "fk_backgroundjob_user" ON "background_jobs" ("created_by");
CREATE INDEX "idx_backgroundjob_status" ON "background_jobs" ("status");
CREATE INDEX "idx_backgroundjob_type" ON "background_jobs" ("job_type");
CREATE INDEX "idx_backgroundjob_queue" ON "background_jobs" ("queue_name");
CREATE INDEX "idx_backgroundjob_schedule" ON "background_jobs" ("scheduled_at");
CREATE INDEX "fk_barcode_user" ON "barcodes" ("generated_by");
CREATE INDEX "idx_barcode_value" ON "barcodes" ("barcode_value");
CREATE INDEX "fk_brand_manufacturer" ON "brands" ("manufacturer_id");
CREATE INDEX "fk_cc_issued_by" ON "calibration_certificates" ("issued_by");
CREATE INDEX "fk_cc_approved_by" ON "calibration_certificates" ("approved_by");
CREATE INDEX "idx_certificate_no" ON "calibration_certificates" ("certificate_no");
CREATE INDEX "idx_calibration_certificates_status" ON "calibration_certificates" ("certificate_status");
CREATE INDEX "fk_ce_job" ON "calibration_execution" ("job_id");
CREATE INDEX "fk_ce_verified" ON "calibration_execution" ("verified_by");
CREATE INDEX "idx_calibration_execution_schedule" ON "calibration_execution" ("calibration_schedule_id");
CREATE INDEX "idx_calibration_execution_engineer" ON "calibration_execution" ("engineer_id");
CREATE INDEX "idx_calibration_execution_result" ON "calibration_execution" ("result");
CREATE INDEX "idx_execution" ON "calibration_measurements" ("calibration_execution_id");
CREATE INDEX "idx_calibration_measurements_parameter" ON "calibration_measurements" ("parameter_name");
CREATE INDEX "fk_cs_engineer" ON "calibration_schedules" ("assigned_engineer_id");
CREATE INDEX "fk_cs_job" ON "calibration_schedules" ("job_id");
CREATE INDEX "idx_calibration_schedules_instrument" ON "calibration_schedules" ("instrument_id");
CREATE INDEX "idx_calibration_schedules_due_date" ON "calibration_schedules" ("due_date");
CREATE INDEX "idx_calibration_schedules_status" ON "calibration_schedules" ("schedule_status");
CREATE INDEX "fk_checklisttemplate_category" ON "checklist_templates" ("equipment_category_id");
CREATE INDEX "fk_checklisttemplate_creator" ON "checklist_templates" ("created_by");
CREATE INDEX "fk_checklisttemplate_approver" ON "checklist_templates" ("approved_by");
CREATE INDEX "idx_ct_module" ON "checklist_templates" ("module_name");
CREATE INDEX "idx_ct_active" ON "checklist_templates" ("active");
CREATE INDEX "idx_cti_template" ON "checklist_template_items" ("template_id");
CREATE INDEX "fk_comment_parent" ON "comments" ("parent_comment_id");
CREATE INDEX "idx_comment_entity" ON "comments" ("entity_type","entity_id");
CREATE INDEX "idx_comment_user" ON "comments" ("created_by");
CREATE INDEX "idx_comment_date" ON "comments" ("created_at");
CREATE INDEX "fk_ci_instrument" ON "contract_instruments" ("instrument_id");
CREATE INDEX "fk_customer_company" ON "customers" ("company_id");
CREATE INDEX "fk_customer_territory" ON "customers" ("territory_id");
CREATE INDEX "fk_customercomplaint_instrument" ON "customer_complaints" ("instrument_id");
CREATE INDEX "fk_customercomplaint_job" ON "customer_complaints" ("service_job_id");
CREATE INDEX "fk_customercomplaint_engineer" ON "customer_complaints" ("assigned_to");
CREATE INDEX "idx_customercomplaint_no" ON "customer_complaints" ("complaint_no");
CREATE INDEX "idx_customercomplaint_customer" ON "customer_complaints" ("customer_id");
CREATE INDEX "idx_customercomplaint_status" ON "customer_complaints" ("status");
CREATE INDEX "idx_customercomplaint_priority" ON "customer_complaints" ("priority");
CREATE INDEX "fk_contact_department" ON "customer_contacts" ("department_id");
CREATE INDEX "fk_customerfeedback_instrument" ON "customer_feedback" ("instrument_id");
CREATE INDEX "fk_customerfeedback_job" ON "customer_feedback" ("service_job_id");
CREATE INDEX "fk_customerfeedback_complaint" ON "customer_feedback" ("complaint_id");
CREATE INDEX "fk_customerfeedback_user" ON "customer_feedback" ("reviewed_by");
CREATE INDEX "idx_customerfeedback_no" ON "customer_feedback" ("feedback_no");
CREATE INDEX "idx_customerfeedback_customer" ON "customer_feedback" ("customer_id");
CREATE INDEX "idx_customerfeedback_date" ON "customer_feedback" ("feedback_date");
CREATE INDEX "idx_dashboardlayout_user" ON "dashboard_layouts" ("user_id");
CREATE INDEX "fk_dashboardwidget_user" ON "dashboard_widgets" ("created_by");
CREATE INDEX "idx_dashboardwidget_module" ON "dashboard_widgets" ("module_id");
CREATE INDEX "idx_dashboardwidget_order" ON "dashboard_widgets" ("display_order");
CREATE INDEX "idx_migration_no" ON "database_migrations" ("migration_no");
CREATE INDEX "idx_migration_batch" ON "database_migrations" ("batch_no");
CREATE INDEX "idx_migration_status" ON "database_migrations" ("execution_status");
CREATE INDEX "fk_dbversion_user" ON "database_version" ("installed_by");
CREATE INDEX "idx_dbversion_schema" ON "database_version" ("schema_version");
CREATE INDEX "idx_dbversion_status" ON "database_version" ("status");
CREATE INDEX "fk_deleted_branch" ON "deleted_records" ("branch_id");
CREATE INDEX "fk_restored_user" ON "deleted_records" ("restored_by");
CREATE INDEX "idx_deleted_entity" ON "deleted_records" ("entity_type","entity_id");
CREATE INDEX "idx_deleted_company" ON "deleted_records" ("company_id");
CREATE INDEX "idx_deleted_deletedby" ON "deleted_records" ("deleted_by");
CREATE INDEX "idx_deleted_restored" ON "deleted_records" ("restored");
CREATE INDEX "fk_depttarget_createdby" ON "department_targets" ("created_by");
CREATE INDEX "fk_depttarget_approvedby" ON "department_targets" ("approved_by");
CREATE INDEX "idx_depttarget_orgunit" ON "department_targets" ("organizational_unit_id");
CREATE INDEX "idx_depttarget_finyear" ON "department_targets" ("financial_year_id");
CREATE INDEX "idx_depttarget_kpi" ON "department_targets" ("kpi_id");
CREATE INDEX "idx_depttarget_status" ON "department_targets" ("status");
CREATE INDEX "idx_depttarget_responsible" ON "department_targets" ("responsible_user_id");
CREATE INDEX "fk_district_province" ON "districts" ("province_id");
CREATE INDEX "fk_doc_review_user" ON "document_reviews" ("documentation_officer_id");
CREATE INDEX "fk_dra_user" ON "document_review_audit" ("performed_by");
CREATE INDEX "idx_review" ON "document_review_audit" ("document_review_id");
CREATE INDEX "idx_action" ON "document_review_audit" ("action");
CREATE INDEX "idx_document_review_audit_date" ON "document_review_audit" ("action_date");
CREATE INDEX "fk_emailattachment_user" ON "email_attachments" ("uploaded_by");
CREATE INDEX "idx_emailattachment_email" ON "email_attachments" ("email_queue_id");
CREATE INDEX "idx_emailattachment_filename" ON "email_attachments" ("file_name");
CREATE INDEX "fk_emailqueue_template" ON "email_queue" ("template_id");
CREATE INDEX "fk_emailqueue_user" ON "email_queue" ("created_by");
CREATE INDEX "idx_emailqueue_status" ON "email_queue" ("status");
CREATE INDEX "idx_emailqueue_scheduled" ON "email_queue" ("scheduled_at");
CREATE INDEX "idx_emailqueue_recipient" ON "email_queue" ("recipient_email");
CREATE INDEX "fk_empkpi_assignedby" ON "employee_kpi_assignments" ("assigned_by");
CREATE INDEX "idx_empkpi_employee" ON "employee_kpi_assignments" ("employee_id");
CREATE INDEX "idx_empkpi_kpi" ON "employee_kpi_assignments" ("kpi_id");
CREATE INDEX "idx_empkpi_finyear" ON "employee_kpi_assignments" ("financial_year_id");
CREATE INDEX "idx_empkpi_orgunit" ON "employee_kpi_assignments" ("organizational_unit_id");
CREATE INDEX "idx_empkpi_active" ON "employee_kpi_assignments" ("active");
CREATE INDEX "fk_eps_evaluator" ON "employee_performance_summary" ("evaluated_by");
CREATE INDEX "fk_eps_approver" ON "employee_performance_summary" ("approved_by");
CREATE INDEX "idx_eps_employee" ON "employee_performance_summary" ("employee_id");
CREATE INDEX "idx_eps_finyear" ON "employee_performance_summary" ("financial_year_id");
CREATE INDEX "idx_eps_orgunit" ON "employee_performance_summary" ("organizational_unit_id");
CREATE INDEX "idx_eps_grade" ON "employee_performance_summary" ("performance_grade");
CREATE INDEX "idx_eps_rating" ON "employee_performance_summary" ("performance_rating");
CREATE INDEX "fk_entitychecklist_template" ON "entity_checklists" ("template_id");
CREATE INDEX "fk_entitychecklist_user" ON "entity_checklists" ("assigned_to");
CREATE INDEX "idx_entitychecklist_entity" ON "entity_checklists" ("entity_type","entity_id");
CREATE INDEX "fk_eci_templateitem" ON "entity_checklist_items" ("template_item_id");
CREATE INDEX "fk_eci_user" ON "entity_checklist_items" ("completed_by");
CREATE INDEX "idx_eci_checklist" ON "entity_checklist_items" ("checklist_id");
CREATE INDEX "fk_export_file" ON "export_jobs" ("file_storage_id");
CREATE INDEX "fk_export_user" ON "export_jobs" ("exported_by");
CREATE INDEX "idx_export_module" ON "export_jobs" ("module_name");
CREATE INDEX "idx_export_type" ON "export_jobs" ("export_type");
CREATE INDEX "idx_export_status" ON "export_jobs" ("status");
CREATE INDEX "idx_favorite_user" ON "favorites" ("user_id");
CREATE INDEX "idx_favorite_entity" ON "favorites" ("entity_type","entity_id");
CREATE INDEX "fk_featureflag_user" ON "feature_flags" ("created_by");
CREATE INDEX "idx_featureflag_enabled" ON "feature_flags" ("enabled");
CREATE INDEX "fk_filestorage_company" ON "file_storage" ("company_id");
CREATE INDEX "fk_filestorage_user" ON "file_storage" ("uploaded_by");
CREATE INDEX "idx_filestorage_module" ON "file_storage" ("module_name");
CREATE INDEX "idx_filestorage_entity" ON "file_storage" ("entity_name","entity_id");
CREATE INDEX "idx_filestorage_document" ON "file_storage" ("document_type");
CREATE INDEX "idx_filestorage_category" ON "file_storage" ("category");
CREATE INDEX "fk_fileversion_uploadedby" ON "file_versions" ("uploaded_by");
CREATE INDEX "fk_fileversion_approvedby" ON "file_versions" ("approved_by");
CREATE INDEX "idx_fileversion_file" ON "file_versions" ("file_storage_id");
CREATE INDEX "idx_fileversion_version" ON "file_versions" ("version_no");
CREATE INDEX "fk_finyear_user" ON "financial_years" ("created_by");
CREATE INDEX "idx_finyear_status" ON "financial_years" ("status");
CREATE INDEX "idx_finyear_default" ON "financial_years" ("is_default");
CREATE INDEX "fk_grn_supplier" ON "goods_receipts" ("supplier_id");
CREATE INDEX "fk_grn_location" ON "goods_receipts" ("location_id");
CREATE INDEX "fk_grn_received_by" ON "goods_receipts" ("received_by");
CREATE INDEX "fk_grn_inspected_by" ON "goods_receipts" ("inspected_by");
CREATE INDEX "idx_grn_no" ON "goods_receipts" ("grn_no");
CREATE INDEX "idx_goods_receipts_po" ON "goods_receipts" ("purchase_order_id");
CREATE INDEX "idx_goods_receipts_received" ON "goods_receipts" ("received_date");
CREATE INDEX "fk_gri_po_item" ON "goods_receipt_items" ("purchase_order_item_id");
CREATE INDEX "idx_grn" ON "goods_receipt_items" ("goods_receipt_id");
CREATE INDEX "idx_goods_receipt_items_part" ON "goods_receipt_items" ("part_id");
CREATE INDEX "fk_holiday_company" ON "holidays" ("company_id");
CREATE INDEX "fk_holiday_branch" ON "holidays" ("branch_id");
CREATE INDEX "fk_holiday_user" ON "holidays" ("created_by");
CREATE INDEX "idx_holiday_date" ON "holidays" ("holiday_date");
CREATE INDEX "idx_importerror_job" ON "import_errors" ("import_job_id");
CREATE INDEX "idx_importerror_type" ON "import_errors" ("error_type");
CREATE INDEX "fk_importjob_file" ON "import_jobs" ("file_storage_id");
CREATE INDEX "idx_import_type" ON "import_jobs" ("import_type");
CREATE INDEX "idx_import_status" ON "import_jobs" ("status");
CREATE INDEX "idx_import_user" ON "import_jobs" ("imported_by");
CREATE INDEX "fk_instrument_company" ON "instruments" ("company_id");
CREATE INDEX "fk_instrument_customer" ON "instruments" ("customer_id");
CREATE INDEX "fk_instrument_department" ON "instruments" ("department_id");
CREATE INDEX "fk_instrument_territory" ON "instruments" ("territory_id");
CREATE INDEX "fk_instrument_model" ON "instruments" ("model_id");
CREATE INDEX "fk_instrument_engineer" ON "instruments" ("assigned_engineer_id");
CREATE INDEX "fk_category_parent" ON "instrument_categories" ("parent_category_id");
CREATE INDEX "fk_doc_instrument" ON "instrument_documents" ("instrument_id");
CREATE INDEX "fk_doc_uploaded_by" ON "instrument_documents" ("uploaded_by");
CREATE INDEX "fk_history_instrument" ON "instrument_history" ("instrument_id");
CREATE INDEX "fk_history_user" ON "instrument_history" ("performed_by");
CREATE INDEX "fk_model_category" ON "instrument_models" ("category_id");
CREATE INDEX "fk_inventory_location_company" ON "inventory_locations" ("company_id");
CREATE INDEX "idx_location_code" ON "inventory_locations" ("location_code");
CREATE INDEX "idx_location_type" ON "inventory_locations" ("location_type");
CREATE INDEX "idx_inventory_stock_location" ON "inventory_stock" ("location_id");
CREATE INDEX "idx_inventory_stock_part" ON "inventory_stock" ("part_id");
CREATE INDEX "fk_it_workshop" ON "inventory_transactions" ("workshop_job_id");
CREATE INDEX "fk_it_user" ON "inventory_transactions" ("performed_by");
CREATE INDEX "idx_transaction_no" ON "inventory_transactions" ("transaction_no");
CREATE INDEX "idx_inventory_transactions_location" ON "inventory_transactions" ("location_id");
CREATE INDEX "idx_inventory_transactions_part" ON "inventory_transactions" ("part_id");
CREATE INDEX "idx_inventory_transactions_job" ON "inventory_transactions" ("job_id");
CREATE INDEX "idx_inventory_transactions_date" ON "inventory_transactions" ("transaction_date");
CREATE INDEX "idx_inventory_transactions_type" ON "inventory_transactions" ("transaction_type");
CREATE INDEX "fk_job_attachment_job" ON "job_attachments" ("job_id");
CREATE INDEX "fk_job_attachment_user" ON "job_attachments" ("uploaded_by");
CREATE INDEX "fk_job_checklist_user" ON "job_checklists" ("completed_by");
CREATE INDEX "idx_job_checklists_job" ON "job_checklists" ("job_id");
CREATE INDEX "idx_job_checklists_type" ON "job_checklists" ("checklist_type");
CREATE INDEX "fk_measurement_user" ON "job_measurements" ("measured_by");
CREATE INDEX "idx_job_measurements_job" ON "job_measurements" ("job_id");
CREATE INDEX "idx_checklist" ON "job_measurements" ("checklist_id");
CREATE INDEX "idx_job_measurements_parameter" ON "job_measurements" ("parameter_name");
CREATE INDEX "fk_job_parts_job" ON "job_parts" ("job_id");
CREATE INDEX "fk_job_parts_user" ON "job_parts" ("created_by");
CREATE INDEX "fk_jpc_job_part" ON "job_parts_consumption" ("job_part_id");
CREATE INDEX "fk_jpc_user" ON "job_parts_consumption" ("installed_by");
CREATE INDEX "idx_job_parts_consumption_job" ON "job_parts_consumption" ("job_id");
CREATE INDEX "idx_job_parts_consumption_instrument" ON "job_parts_consumption" ("instrument_id");
CREATE INDEX "idx_part_number" ON "job_parts_consumption" ("part_number");
CREATE INDEX "fk_job_report_engineer" ON "job_reports" ("engineer_id");
CREATE INDEX "fk_job_report_approver" ON "job_reports" ("approved_by");
CREATE INDEX "fk_jsh_job" ON "job_status_history" ("job_id");
CREATE INDEX "fk_jsh_user" ON "job_status_history" ("changed_by");
CREATE INDEX "fk_job_visit_engineer" ON "job_visits" ("engineer_id");
CREATE INDEX "fk_kpieval_evaluator" ON "kpi_evaluations" ("evaluated_by");
CREATE INDEX "fk_kpieval_approver" ON "kpi_evaluations" ("approved_by");
CREATE INDEX "idx_eval_employee" ON "kpi_evaluations" ("employee_id");
CREATE INDEX "idx_eval_finyear" ON "kpi_evaluations" ("financial_year_id");
CREATE INDEX "idx_eval_status" ON "kpi_evaluations" ("evaluation_status");
CREATE INDEX "idx_eval_rating" ON "kpi_evaluations" ("performance_rating");
CREATE INDEX "idx_eval_grade" ON "kpi_evaluations" ("performance_grade");
CREATE INDEX "fk_kpi_master_user" ON "kpi_master" ("created_by");
CREATE INDEX "idx_kpi_category" ON "kpi_master" ("kpi_category");
CREATE INDEX "idx_kpi_measurement" ON "kpi_master" ("measurement_type");
CREATE INDEX "idx_kpi_scoring" ON "kpi_master" ("scoring_method");
CREATE INDEX "idx_kpi_frequency" ON "kpi_master" ("evaluation_frequency");
CREATE INDEX "idx_kpi_active" ON "kpi_master" ("active");
CREATE INDEX "fk_kpimeasure_measuredby" ON "kpi_measurements" ("measured_by");
CREATE INDEX "fk_kpimeasure_approvedby" ON "kpi_measurements" ("approved_by");
CREATE INDEX "idx_measure_assignment" ON "kpi_measurements" ("assignment_id");
CREATE INDEX "idx_measure_status" ON "kpi_measurements" ("measurement_status");
CREATE INDEX "idx_measure_date" ON "kpi_measurements" ("measurement_date");
CREATE INDEX "idx_measure_period" ON "kpi_measurements" ("measurement_period");
CREATE INDEX "fk_kpirule_user" ON "kpi_measurement_rules" ("created_by");
CREATE INDEX "idx_rule_kpi" ON "kpi_measurement_rules" ("kpi_id");
CREATE INDEX "idx_rule_module" ON "kpi_measurement_rules" ("source_module");
CREATE INDEX "idx_rule_active" ON "kpi_measurement_rules" ("active");
CREATE INDEX "fk_kpirole_user" ON "kpi_role_mapping" ("created_by");
CREATE INDEX "idx_kpirole_kpi" ON "kpi_role_mapping" ("kpi_id");
CREATE INDEX "idx_kpirole_role" ON "kpi_role_mapping" ("role_id");
CREATE INDEX "idx_kpirole_unit" ON "kpi_role_mapping" ("organizational_unit_id");
CREATE INDEX "idx_kpirole_active" ON "kpi_role_mapping" ("active");
CREATE INDEX "fk_labeltemplate_user" ON "label_templates" ("created_by");
CREATE INDEX "idx_labeltemplate_active" ON "label_templates" ("active");
CREATE INDEX "fk_license_company" ON "license_management" ("company_id");
CREATE INDEX "fk_license_user" ON "license_management" ("assigned_user_id");
CREATE INDEX "fk_license_createdby" ON "license_management" ("created_by");
CREATE INDEX "idx_license_no" ON "license_management" ("license_no");
CREATE INDEX "idx_license_expiry" ON "license_management" ("expiry_date");
CREATE INDEX "idx_license_status" ON "license_management" ("status");
CREATE INDEX "fk_login_history_user" ON "login_history" ("user_id");
CREATE INDEX "fk_manufacturer_country" ON "manufacturers" ("country_id");
CREATE INDEX "fk_notification_job" ON "notifications" ("service_job_id");
CREATE INDEX "idx_notification_user" ON "notifications" ("recipient_user_id");
CREATE INDEX "idx_notification_customer" ON "notifications" ("customer_id");
CREATE INDEX "idx_notification_status" ON "notifications" ("delivery_status");
CREATE INDEX "idx_notification_type" ON "notifications" ("notification_type");
CREATE INDEX "idx_notification_channel" ON "notifications" ("channel");
CREATE INDEX "fk_notificationtemplate_user" ON "notification_templates" ("created_by");
CREATE INDEX "idx_notificationtemplate_type" ON "notification_templates" ("notification_type");
CREATE INDEX "idx_notificationtemplate_channel" ON "notification_templates" ("channel");
CREATE INDEX "fk_org_manager" ON "organizational_units" ("manager_user_id");
CREATE INDEX "fk_org_createdby" ON "organizational_units" ("created_by");
CREATE INDEX "idx_org_company" ON "organizational_units" ("company_id");
CREATE INDEX "idx_org_branch" ON "organizational_units" ("branch_id");
CREATE INDEX "idx_org_parent" ON "organizational_units" ("parent_unit_id");
CREATE INDEX "idx_org_type" ON "organizational_units" ("unit_type");
CREATE INDEX "idx_org_active" ON "organizational_units" ("active");
CREATE INDEX "fk_permissions_module" ON "permissions" ("module_id");
CREATE INDEX "fk_pm_exec_verified" ON "pm_execution" ("verified_by");
CREATE INDEX "idx_pm_execution_schedule" ON "pm_execution" ("pm_schedule_id");
CREATE INDEX "idx_pm_execution_job" ON "pm_execution" ("job_id");
CREATE INDEX "idx_pm_execution_engineer" ON "pm_execution" ("engineer_id");
CREATE INDEX "idx_pm_notifications_schedule" ON "pm_notifications" ("pm_schedule_id");
CREATE INDEX "idx_user" ON "pm_notifications" ("recipient_user_id");
CREATE INDEX "idx_pm_notifications_status" ON "pm_notifications" ("status");
CREATE INDEX "idx_send_time" ON "pm_notifications" ("scheduled_send");
CREATE INDEX "fk_pm_activation" ON "pm_schedules" ("warranty_activation_id");
CREATE INDEX "fk_pm_engineer" ON "pm_schedules" ("assigned_engineer_id");
CREATE INDEX "fk_pm_job" ON "pm_schedules" ("job_id");
CREATE INDEX "idx_pm_schedules_instrument" ON "pm_schedules" ("instrument_id");
CREATE INDEX "idx_pm_schedules_due_date" ON "pm_schedules" ("due_date");
CREATE INDEX "idx_pm_schedules_status" ON "pm_schedules" ("schedule_status");
CREATE INDEX "fk_province_country" ON "provinces" ("country_id");
CREATE INDEX "fk_po_company" ON "purchase_orders" ("company_id");
CREATE INDEX "fk_po_location" ON "purchase_orders" ("location_id");
CREATE INDEX "fk_po_ordered_by" ON "purchase_orders" ("ordered_by");
CREATE INDEX "fk_po_approved_by" ON "purchase_orders" ("approved_by");
CREATE INDEX "idx_po_no" ON "purchase_orders" ("po_no");
CREATE INDEX "idx_supplier" ON "purchase_orders" ("supplier_id");
CREATE INDEX "idx_purchase_orders_status" ON "purchase_orders" ("status");
CREATE INDEX "idx_purchase_orders_date" ON "purchase_orders" ("po_date");
CREATE INDEX "idx_purchase_order_items_po" ON "purchase_order_items" ("purchase_order_id");
CREATE INDEX "idx_purchase_order_items_part" ON "purchase_order_items" ("part_id");
CREATE INDEX "fk_qrcode_user" ON "qr_codes" ("generated_by");
CREATE INDEX "idx_qr_entity" ON "qr_codes" ("entity_type","entity_id");
CREATE INDEX "idx_recentactivity_user" ON "recent_activity" ("user_id");
CREATE INDEX "idx_recentactivity_time" ON "recent_activity" ("activity_time");
CREATE INDEX "idx_reportexecution_report" ON "report_execution_history" ("report_id");
CREATE INDEX "idx_reportexecution_user" ON "report_execution_history" ("executed_by");
CREATE INDEX "idx_reportexecution_date" ON "report_execution_history" ("execution_time");
CREATE INDEX "fk_role_permissions_permission" ON "role_permissions" ("permission_id");
CREATE INDEX "idx_savedfilter_user" ON "saved_filters" ("user_id");
CREATE INDEX "idx_savedfilter_module" ON "saved_filters" ("module_name");
CREATE INDEX "fk_savedreport_user" ON "saved_reports" ("created_by");
CREATE INDEX "idx_savedreport_category" ON "saved_reports" ("report_category");
CREATE INDEX "idx_savedreport_name" ON "saved_reports" ("report_name");
CREATE INDEX "fk_sequence_user" ON "sequence_numbers" ("created_by");
CREATE INDEX "idx_sequence_company" ON "sequence_numbers" ("company_id");
CREATE INDEX "idx_sequence_branch" ON "sequence_numbers" ("branch_id");
CREATE INDEX "idx_sequence_code" ON "sequence_numbers" ("sequence_code");
CREATE INDEX "idx_sequence_active" ON "sequence_numbers" ("active");
CREATE INDEX "fk_contract_company" ON "service_contracts" ("company_id");
CREATE INDEX "fk_contract_customer" ON "service_contracts" ("customer_id");
CREATE INDEX "fk_job_request" ON "service_jobs" ("service_request_id");
CREATE INDEX "fk_job_company" ON "service_jobs" ("company_id");
CREATE INDEX "fk_job_customer" ON "service_jobs" ("customer_id");
CREATE INDEX "fk_job_instrument" ON "service_jobs" ("instrument_id");
CREATE INDEX "fk_job_territory" ON "service_jobs" ("territory_id");
CREATE INDEX "fk_job_engineer" ON "service_jobs" ("assigned_engineer_id");
CREATE INDEX "fk_sr_company" ON "service_requests" ("company_id");
CREATE INDEX "fk_sr_customer" ON "service_requests" ("customer_id");
CREATE INDEX "fk_sr_department" ON "service_requests" ("department_id");
CREATE INDEX "fk_sr_contact" ON "service_requests" ("contact_id");
CREATE INDEX "fk_sr_instrument" ON "service_requests" ("instrument_id");
CREATE INDEX "fk_sr_territory" ON "service_requests" ("territory_id");
CREATE INDEX "fk_sr_engineer" ON "service_requests" ("assigned_engineer_id");
CREATE INDEX "fk_sp_manufacturer" ON "spare_parts" ("manufacturer_id");
CREATE INDEX "fk_sp_brand" ON "spare_parts" ("brand_id");
CREATE INDEX "idx_part_name" ON "spare_parts" ("part_name");
CREATE INDEX "idx_category" ON "spare_parts" ("category");
CREATE INDEX "fk_sa_created_by" ON "stock_adjustments" ("created_by");
CREATE INDEX "fk_sa_approved_by" ON "stock_adjustments" ("approved_by");
CREATE INDEX "idx_adjustment_no" ON "stock_adjustments" ("adjustment_no");
CREATE INDEX "idx_stock_adjustments_location" ON "stock_adjustments" ("location_id");
CREATE INDEX "idx_stock_adjustments_status" ON "stock_adjustments" ("status");
CREATE INDEX "fk_sai_part" ON "stock_adjustment_items" ("part_id");
CREATE INDEX "fk_stocktake_location" ON "stock_take" ("location_id");
CREATE INDEX "fk_stocktake_counter" ON "stock_take" ("counted_by");
CREATE INDEX "fk_stocktake_verifier" ON "stock_take" ("verified_by");
CREATE INDEX "fk_stocktake_approver" ON "stock_take" ("approved_by");
CREATE INDEX "fk_stocktakeitem_counter" ON "stock_take_items" ("counted_by");
CREATE INDEX "idx_stocktakeitem_stocktake" ON "stock_take_items" ("stock_take_id");
CREATE INDEX "idx_stocktakeitem_part" ON "stock_take_items" ("part_id");
CREATE INDEX "fk_st_from_location" ON "stock_transfers" ("from_location_id");
CREATE INDEX "fk_st_to_location" ON "stock_transfers" ("to_location_id");
CREATE INDEX "fk_st_requested_by" ON "stock_transfers" ("requested_by");
CREATE INDEX "fk_st_approved_by" ON "stock_transfers" ("approved_by");
CREATE INDEX "fk_st_dispatched_by" ON "stock_transfers" ("dispatched_by");
CREATE INDEX "fk_st_received_by" ON "stock_transfers" ("received_by");
CREATE INDEX "idx_transfer_no" ON "stock_transfers" ("transfer_no");
CREATE INDEX "idx_stock_transfers_status" ON "stock_transfers" ("status");
CREATE INDEX "fk_sti_part" ON "stock_transfer_items" ("part_id");
CREATE INDEX "fk_supplier_country" ON "suppliers" ("country_id");
CREATE INDEX "idx_supplier_name" ON "suppliers" ("supplier_name");
CREATE INDEX "fk_announcement_company" ON "system_announcements" ("company_id");
CREATE INDEX "fk_announcement_user" ON "system_announcements" ("created_by");
CREATE INDEX "idx_announcement_active" ON "system_announcements" ("active");
CREATE INDEX "idx_announcement_priority" ON "system_announcements" ("priority");
CREATE INDEX "idx_announcement_dates" ON "system_announcements" ("start_datetime","end_datetime");
CREATE INDEX "fk_backuphistory_user" ON "system_backup_history" ("created_by");
CREATE INDEX "idx_backup_no" ON "system_backup_history" ("backup_no");
CREATE INDEX "idx_backup_type" ON "system_backup_history" ("backup_type");
CREATE INDEX "idx_backup_status" ON "system_backup_history" ("backup_status");
CREATE INDEX "idx_backup_started" ON "system_backup_history" ("started_at");
CREATE INDEX "idx_systemhealth_time" ON "system_health" ("check_time");
CREATE INDEX "idx_systemhealth_status" ON "system_health" ("overall_status");
CREATE INDEX "fk_systemjob_user" ON "system_jobs" ("run_as_user");
CREATE INDEX "fk_systemjob_createdby" ON "system_jobs" ("created_by");
CREATE INDEX "idx_systemjob_code" ON "system_jobs" ("job_code");
CREATE INDEX "idx_systemjob_enabled" ON "system_jobs" ("enabled");
CREATE INDEX "idx_systemjob_next_run" ON "system_jobs" ("next_run_at");
CREATE INDEX "idx_systemjob_status" ON "system_jobs" ("last_status");
CREATE INDEX "fk_syspref_updatedby" ON "system_preferences" ("updated_by");
CREATE INDEX "idx_syspref_category" ON "system_preferences" ("category");
CREATE INDEX "idx_syspref_active" ON "system_preferences" ("active");
CREATE INDEX "fk_systemsetting_user" ON "system_settings" ("updated_by");
CREATE INDEX "idx_systemsetting_group" ON "system_settings" ("setting_group");
CREATE INDEX "idx_systemsetting_key" ON "system_settings" ("setting_key");
CREATE INDEX "fk_task_creator" ON "tasks" ("created_by");
CREATE INDEX "idx_task_status" ON "tasks" ("status");
CREATE INDEX "idx_task_due" ON "tasks" ("due_date");
CREATE INDEX "idx_task_entity" ON "tasks" ("entity_type","entity_id");
CREATE INDEX "fk_taskassign_assigner" ON "task_assignments" ("assigned_by");
CREATE INDEX "idx_assignment_user" ON "task_assignments" ("assigned_to");
CREATE INDEX "fk_taskattachment_file" ON "task_attachments" ("file_storage_id");
CREATE INDEX "fk_taskattachment_user" ON "task_attachments" ("uploaded_by");
CREATE INDEX "idx_taskattachment_task" ON "task_attachments" ("task_id");
CREATE INDEX "fk_taskcomment_user" ON "task_comments" ("commented_by");
CREATE INDEX "idx_taskcomment_task" ON "task_comments" ("task_id");
CREATE INDEX "fk_territories_company" ON "territories" ("company_id");
CREATE INDEX "fk_territories_branch" ON "territories" ("branch_id");
CREATE INDEX "fk_territories_district" ON "territories" ("district_id");
CREATE INDEX "fk_te_user" ON "territory_engineers" ("user_id");
CREATE INDEX "fk_users_company" ON "users" ("company_id");
CREATE INDEX "fk_users_branch" ON "users" ("branch_id");
CREATE INDEX "fk_uet_tag" ON "user_engineer_tags" ("engineer_tag_id");
CREATE INDEX "idx_userpreference_user" ON "user_preferences" ("user_id");
CREATE INDEX "fk_user_roles_role" ON "user_roles" ("role_id");
CREATE INDEX "fk_vendor_supplier" ON "vendors" ("supplier_id");
CREATE INDEX "fk_vendor_company" ON "vendors" ("company_id");
CREATE INDEX "idx_vendor_code" ON "vendors" ("vendor_code");
CREATE INDEX "idx_vendor_name" ON "vendors" ("vendor_name");
CREATE INDEX "fk_vendorperformance_user" ON "vendor_performance" ("evaluated_by");
CREATE INDEX "idx_vendorperformance_vendor" ON "vendor_performance" ("vendor_id");
CREATE INDEX "idx_vendorperformance_date" ON "vendor_performance" ("evaluation_date");
CREATE INDEX "fk_wa_user" ON "warranty_activations" ("activated_by");
CREATE INDEX "idx_webhooklog_webhook" ON "webhook_logs" ("webhook_id");
CREATE INDEX "idx_webhooklog_status" ON "webhook_logs" ("status");
CREATE INDEX "idx_webhooklog_date" ON "webhook_logs" ("executed_at");
CREATE INDEX "fk_calendar_branch" ON "working_calendar" ("branch_id");
CREATE INDEX "fk_calendar_user" ON "working_calendar" ("created_by");
CREATE INDEX "idx_calendar_day" ON "working_calendar" ("weekday");
CREATE INDEX "fk_ws_instrument" ON "workshop_jobs" ("instrument_id");
CREATE INDEX "fk_ws_customer" ON "workshop_jobs" ("customer_id");
CREATE INDEX "fk_ws_received_by" ON "workshop_jobs" ("received_by");
CREATE INDEX "idx_workshop_jobs_status" ON "workshop_jobs" ("repair_status");
CREATE INDEX "idx_workshop_jobs_received" ON "workshop_jobs" ("received_date");
CREATE INDEX "fk_wqc_engineer" ON "workshop_quality_checks" ("qa_engineer_id");
CREATE INDEX "idx_workshop_quality_checks_result" ON "workshop_quality_checks" ("overall_result");
CREATE INDEX "fk_wrl_user" ON "workshop_repair_log" ("performed_by");
CREATE INDEX "idx_workshop_job" ON "workshop_repair_log" ("workshop_job_id");
CREATE INDEX "idx_activity_date" ON "workshop_repair_log" ("activity_date");