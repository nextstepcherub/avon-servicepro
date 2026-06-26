# Avon ServicePro

> **Professional Scientific Equipment Service, Maintenance & Calibration Management Platform**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite\&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase\&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

**Avon ServicePro** is a modern, enterprise-ready **Scientific Equipment Service, Maintenance & Calibration Management Platform** designed to streamline the complete lifecycle of scientific equipment and service operations.

The platform enables organizations to efficiently manage customers, scientific equipment, preventive maintenance, corrective maintenance, installations, calibration activities, service engineers, spare parts, inventory, documentation, and operational performance through an intuitive and centralized system.

Although initially developed for Avon Pharmo Chem (Pvt) Ltd., the platform has been designed to support a wide range of organizations involved in scientific equipment sales, maintenance, and calibration.

---

## Key Features

### Dashboard

* Executive dashboard
* Service performance overview
* Open service jobs
* Preventive maintenance summary
* Engineer workload
* Equipment status monitoring
* KPI visualization

---

### Customer Management

* Customer profiles
* Organization management
* Site management
* Contact persons
* Customer service history
* Equipment ownership

---

### Scientific Equipment Management

* Equipment registration
* Manufacturer management
* Model management
* Serial number tracking
* Installation records
* Warranty information
* Equipment lifecycle history
* Equipment status monitoring

---

### Service Job Management

Manage the complete service workflow including:

* Breakdown Services
* Preventive Maintenance
* Corrective Maintenance
* Installation
* Calibration
* Inspection
* Workshop Repairs
* Technical Visits

---

### Workflow Management

Visual Kanban-based workflow supporting:

* Created
* Assigned
* Accepted
* Travelling
* On Site
* Awaiting Parts
* Workshop
* Documentation Review
* Closed

---

### Preventive Maintenance

* PM Scheduling
* Maintenance Calendar
* Due Equipment Tracking
* Engineer Assignment
* PM Completion Monitoring
* Maintenance History

---

### Calibration Management *(Planned)*

* Calibration Scheduling
* Calibration Certificates
* Reference Standards
* Traceability Records
* Calibration History

---

### Spare Parts & Inventory

* Spare Parts Management
* Inventory Tracking
* Stock Monitoring
* Supplier Management
* Purchase Requests
* Parts Usage History

---

### User & Role Management

* Secure Authentication
* Role-Based Access Control (RBAC)
* Administrator Management
* Service Engineer Access
* Documentation Officer Access
* Workshop Staff Access

---

### Documentation

* Service Reports
* Installation Reports
* Preventive Maintenance Reports
* Calibration Reports
* Equipment History
* Customer History
* Technical Notes
* Document Attachments

---

### Reporting & Analytics

* Service Performance
* Engineer Productivity
* Preventive Maintenance Compliance
* Equipment Reliability
* Customer Service History
* Operational KPIs
* Executive Dashboard

---

## Target Industries

Avon ServicePro is designed for organizations involved in scientific equipment sales, service, and maintenance, including:

* Medical Laboratories
* Hospitals
* Research Institutes
* Government Research Organizations
* Universities
* Higher Education Institutions
* Pharmaceutical Manufacturers
* Food Testing Laboratories
* Environmental Laboratories
* Industrial Laboratories
* Calibration Laboratories
* Quality Assurance Laboratories
* Biotechnology Organizations
* Scientific Equipment Distributors
* Service & Calibration Companies

---

## Technology Stack

### Frontend

* React 19
* TypeScript
* Vite
* React Hook Form
* Zod
* Lucide React
* Modern Responsive UI

### Backend *(In Progress)*

* Supabase
* PostgreSQL
* Authentication
* Storage
* Row Level Security
* REST APIs

### Deployment

* Vercel

---

## Project Structure

```text
src/
│
├── components/        # Reusable UI components
├── pages/             # Application pages
├── hooks/             # Custom React hooks
├── lib/               # External service configuration
├── middleware/        # Route protection & authentication
├── db/                # Database schema & models
├── data/              # Static & mock data
├── services/          # Business logic & API services
├── types/             # TypeScript interfaces
├── utils/             # Utility functions
├── assets/            # Images & static resources
└── styles/            # Styling resources
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/nextstepcherub/avon-servicepro.git
```

Navigate to the project

```bash
cd avon-servicepro
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview the production build

```bash
npm run preview
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Development Status

| Module                            |   Status   |
| --------------------------------- | :--------: |
| Dashboard                         |      ✅     |
| Customer Management               |      ✅     |
| Scientific Equipment Management   |      ✅     |
| Workflow Dashboard                |      ✅     |
| Service Job Management            |      ✅     |
| Role-Based User Interface         |      ✅     |
| Database Design                   |      ✅     |
| Authentication Integration        |     🚧     |
| Supabase Integration              |     🚧     |
| Reporting Engine                  |     🚧     |
| Preventive Maintenance Automation |     🚧     |
| Calibration Module                | 📅 Planned |
| Inventory Management              | 📅 Planned |
| Notifications                     | 📅 Planned |
| Mobile Optimization               | 📅 Planned |
| QR Code Equipment Tracking        | 📅 Planned |

---

## Future Roadmap

### Phase 1

* Supabase Integration
* User Authentication
* Database Connectivity
* CRUD Operations
* File Uploads

### Phase 2

* Preventive Maintenance Automation
* Service Report Generation
* Email Notifications
* Dashboard Analytics
* Inventory Integration

### Phase 3

* Calibration Management
* QR Code Equipment Tracking
* Barcode Support
* Customer Portal
* Digital Signatures

### Phase 4

* Mobile Application
* Offline Synchronization
* Predictive Maintenance
* AI-Assisted Service Support
* Business Intelligence Dashboard

---

## Screenshots

*Screenshots and workflow demonstrations will be added in future releases.*

---

## Why Avon ServicePro?

✔ Modern Scientific Equipment Service Platform

✔ Designed for Scientific Equipment Organizations

✔ Workflow-Based Job Management

✔ Preventive Maintenance Management

✔ Calibration Ready

✔ Equipment Lifecycle Tracking

✔ Scalable Enterprise Architecture

✔ Modern React & TypeScript Stack

✔ PostgreSQL Ready

✔ Cloud Deployment Ready

---

## Contributing

Contributions, feature suggestions, and improvements are always welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a Pull Request.

Please open an issue before submitting significant changes.

---

## License

This project is licensed under the **MIT License**.

---

## Author

**Cherub Weeratunge**

Senior Biomedical Engineer

Avon Pharmo Chem (Pvt) Ltd.

Sri Lanka

---

## Vision

Our vision is to develop Avon ServicePro into a comprehensive platform for managing the complete lifecycle of scientific equipment—from installation and preventive maintenance to calibration, asset management, inventory control, and operational analytics—helping organizations improve equipment reliability, service quality, regulatory compliance, and customer satisfaction.

---

**Built with dedication for the Scientific Equipment Service Community.**
