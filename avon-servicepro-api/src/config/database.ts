import pg, { Pool as PgPool } from 'pg';
import { logger } from './logger';
import { config } from './environment';
import { validateSqlParameters } from '../utils/sqlValidator';
import fs from 'fs';
import path from 'path';

// Parse Postgres NUMERIC/DECIMAL as float, BIGINT as int
pg.types.setTypeParser(1700, (val: string) => parseFloat(val));
pg.types.setTypeParser(20, (val: string) => parseInt(val, 10));

export interface DatabasePool {
  getConnection(): Promise<any>;
  query(sql: string, params?: any[]): Promise<any>;
  end(): Promise<void>;
  testConnection(): Promise<boolean>;
}

const DB_FILE = path.join(process.cwd(), 'avon_database.json');

function saveMockTables() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(mockTables, null, 2), 'utf-8');
  } catch (err) {
    logger.error('Failed to save mock database file:', err);
  }
}

function loadMockTables() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      Object.assign(mockTables, parsed);
      logger.info('Database: Loaded mock database from avon_database.json successfully.');
    } else {
      logger.info('Database: No avon_database.json found, starting with initial seeds.');
    }

    if (!mockTables['users']) {
      mockTables['users'] = [];
    }

    if (mockTables['users'].length === 0) {
      logger.info('Database: Seeding default users...');
      mockTables['users'].push({
        id: 'usr_sys_admin',
        name: 'System Admin',
        email: 'administrator@avon.lk',
        role: 'System Admin',
        tags: '[]',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        territory: 'Colombo Headquarters'
      });
      mockTables['users'].push({
        id: 'usr_admin',
        name: 'Admin',
        email: 'admin@avon.lk',
        role: 'Admin',
        tags: '[]',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
        territory: 'Colombo Head Office'
      });
    }

    if (!mockTables['instrument_assets'] || mockTables['instrument_assets'].length === 0) {
      mockTables['instrument_assets'] = [
        {
          id: 'ast-1',
          assetNumber: 'AST-JOB-TEST-999',
          serialNumber: 'JOB-TEST-999',
          brand: 'SHIMADZU',
          model: 'Prominence LC-2030',
          description: 'Shimadzu Prominence Chromatograph',
          warrantyPeriodMonths: 12,
          customerName: 'Lanka Hospitals Lab',
          department: 'Biochemistry',
          serviceHistoryCount: 0,
          repairHistoryCount: 0,
          totalRevenueGenerated: 0
        }
      ];
    }

    saveMockTables();
  } catch (err) {
    logger.error('Failed to load mock database file:', err);
  }
}

const mockTables: { [table: string]: any[] } = {
  documents: [],
  document_versions: [],
  notifications: [],
  refresh_tokens: [],
  rbac_permissions: [
    { id: 'p1', code: 'jobs:create', description: 'Create service jobs' },
    { id: 'p2', code: 'jobs:read', description: 'Read service jobs' },
    { id: 'p3', code: 'jobs:update', description: 'Update service jobs' },
    { id: 'p4', code: 'jobs:delete', description: 'Delete service jobs' },
    { id: 'p5', code: 'users:create', description: 'Create users' },
    { id: 'p6', code: 'users:read', description: 'Read users' },
    { id: 'p7', code: 'users:update', description: 'Update users' },
    { id: 'p8', code: 'users:delete', description: 'Delete users' },
    { id: 'p9', code: 'assets:create', description: 'Create assets' },
    { id: 'p10', code: 'assets:read', description: 'Read assets' },
    { id: 'p11', code: 'assets:update', description: 'Update assets' },
    { id: 'p12', code: 'assets:delete', description: 'Delete assets' },
    { id: 'p13', code: 'customers:create', description: 'Create customers' },
    { id: 'p14', code: 'customers:read', description: 'Read customers' },
    { id: 'p15', code: 'customers:update', description: 'Update customers' },
    { id: 'p16', code: 'customers:delete', description: 'Delete customers' }
  ],
  rbac_role_permissions: [
    ...['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16'].flatMap(pid => [
      { roleName: 'Admin', permissionId: pid },
      { roleName: 'System Admin', permissionId: pid }
    ]),
    ...['p1', 'p2', 'p3', 'p10', 'p13', 'p14', 'p15'].map(pid => ({ roleName: 'Dispatcher', permissionId: pid })),
    ...['p2', 'p3', 'p10', 'p14'].map(pid => ({ roleName: 'Technician', permissionId: pid }))
  ],
  system_settings: [
    { id: 'ss1', key: 'system_name', value: 'AVON ServicePro Enterprise', category: 'General', updatedAt: new Date().toISOString() },
    { id: 'ss2', key: 'contact_email', value: 'support@avon.lk', category: 'General', updatedAt: new Date().toISOString() },
    { id: 'ss3', key: 'maintenance_mode', value: 'false', category: 'Maintenance', updatedAt: new Date().toISOString() },
    { id: 'ss4', key: 'timezone', value: 'Asia/Colombo', category: 'General', updatedAt: new Date().toISOString() },
    { id: 'ss5', key: 'global_grace_period_days', value: '14', category: 'Service', updatedAt: new Date().toISOString() }
  ],
  configurations: [
    { id: 'cfg1', key: 'smtp_host', value: 'mail.avon.lk', type: 'string', description: 'Outgoing SMTP server host', isEncrypted: 0, updatedAt: new Date().toISOString() },
    { id: 'cfg2', key: 'smtp_port', value: '587', type: 'number', description: 'SMTP SSL/TLS Port', isEncrypted: 0, updatedAt: new Date().toISOString() },
    { id: 'cfg3', key: 'api_timeout_ms', value: '30000', type: 'number', description: 'Maximum HTTP API request timeout in milliseconds', isEncrypted: 0, updatedAt: new Date().toISOString() },
    { id: 'cfg4', key: 'log_level', value: 'info', type: 'string', description: 'Server logs verbose level', isEncrypted: 0, updatedAt: new Date().toISOString() }
  ],
  version_control: [
    { id: 'v1', appVersion: '1.0.0', apiVersion: 'v1', releaseDate: '2026-06-01', status: 'ACTIVE', changelog: 'Initial stable enterprise release of AVON ServicePro.', createdAt: new Date().toISOString() },
    { id: 'v2', appVersion: '1.1.0', apiVersion: 'v1', releaseDate: '2026-07-15', status: 'ACTIVE', changelog: 'Added Organization Hierarchy Module and Department Structure management.', createdAt: new Date().toISOString() }
  ],
  lookup_data: [
    { id: 'l1', type: 'job_type', code: 'INSTALLATION', value: 'Installation', sortOrder: 1, isActive: 1 },
    { id: 'l2', type: 'job_type', code: 'PREVENTIVE_MAINTENANCE', value: 'Preventive Maintenance', sortOrder: 2, isActive: 1 },
    { id: 'l3', type: 'job_type', code: 'CORRECTIVE_REPAIR', value: 'Corrective Repair', sortOrder: 3, isActive: 1 },
    { id: 'l4', type: 'job_type', code: 'CALIBRATION', value: 'Calibration', sortOrder: 4, isActive: 1 },
    { id: 'l5', type: 'priority', code: 'LOW', value: 'Low', sortOrder: 1, isActive: 1 },
    { id: 'l6', type: 'priority', code: 'MEDIUM', value: 'Medium', sortOrder: 2, isActive: 1 },
    { id: 'l7', type: 'priority', code: 'HIGH', value: 'High', sortOrder: 3, isActive: 1 },
    { id: 'l8', type: 'priority', code: 'EMERGENCY', value: 'Emergency / Critical', sortOrder: 4, isActive: 1 },
    { id: 'l9', type: 'repair_status', code: 'PENDING', value: 'Pending Assignment', sortOrder: 1, isActive: 1 },
    { id: 'l10', type: 'repair_status', code: 'ASSIGNED', value: 'Assigned / In-Progress', sortOrder: 2, isActive: 1 },
    { id: 'l11', type: 'repair_status', code: 'WORKSHOP_REPAIR', value: 'Transferred to Workshop', sortOrder: 3, isActive: 1 },
    { id: 'l12', type: 'repair_status', code: 'COMPLETED', value: 'Completed', sortOrder: 4, isActive: 1 },
    { id: 'l13', type: 'repair_status', code: 'CLOSED', value: 'Closed', sortOrder: 5, isActive: 1 }
  ],
  installation_requests: [
    {
      id: 'ireq-1',
      invoiceNumber: 'INV-2026-8801',
      invoiceValue: 4500000.00,
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
      invoiceValue: 12800000.00,
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
      invoiceValue: 8900000.00,
      customerName: 'Durdans Hospital',
      departmentName: 'Hematology & Coagulation',
      endUserName: 'Dr. Nilmini Weerasinghe',
      instrumentName: 'High-Performance Liquid Chromatograph',
      brand: 'SHIMADZU',
      model: 'Prominence-i LC-2030C',
      serialNumber: 'SHM-2030C-4419',
      deliveryDate: '2026-06-15',
      warrantyPeriod: 12,
      warrantyUnit: 'Months',
      remarks: 'Pre-site inspection completed. Argon gas cylinders ready.',
      status: 'Assigned',
      createdAt: '2026-06-15T11:40:00Z',
      updatedAt: '2026-06-15T11:40:00Z'
    }
  ],
  service_requests: [
    {
      id: 'sreq-1',
      ticketNumber: 'AVN-RPR-2026-101',
      instrumentId: 'inst-pcr-1',
      instrumentName: 'Real-Time PCR Thermal Cycler',
      serialNumber: 'QS5-994120-LK',
      customerId: 'cust-1',
      customerName: 'Asiri Surgical Hospital',
      subject: 'Optical sensor calibration error on startup',
      description: 'The instrument displays error code ERR-OPT-402 during initial optical diagnostic self-test. High noise floor detected.',
      priority: 'HIGH',
      status: 'RECEIVED',
      createdAt: '2026-07-10T09:00:00Z',
      updatedAt: '2026-07-10T09:00:00Z',
      slaDueDate: '2026-07-13T09:00:00Z',
      slaDaysSetting: 3,
      slaStatus: 'IN_COMPLIANCE'
    },
    {
      id: 'sreq-2',
      ticketNumber: 'AVN-CAL-2026-202',
      instrumentId: 'inst-chem-1',
      instrumentName: 'Automated Chemistry Analyzer',
      serialNumber: 'AGL-3500-8812',
      customerId: 'cust-2',
      customerName: 'Lanka Hospitals Diagnostics',
      subject: 'Routine Metrology Calibration requested',
      description: 'Annual ISO 17025 certified calibration is due for the UV-Vis optics path and temperature block.',
      priority: 'MEDIUM',
      status: 'RECEIVED',
      createdAt: '2026-07-12T11:30:00Z',
      updatedAt: '2026-07-12T11:30:00Z',
      slaDueDate: '2026-07-19T11:30:00Z',
      slaDaysSetting: 7,
      slaStatus: 'IN_COMPLIANCE'
    }
  ],
  installation_assignments: [],
  installation_assignment_audit_logs: [],
  installations: [],
  service_request_assignments: [],
  service_request_audit_logs: [],
  audit_logs: [
    {
      id: 'aud-init-1',
      timestamp: '2026-07-15T09:30:00Z',
      userId: 'usr-admin-1',
      userName: 'Dr. John Doe',
      userRole: 'Admin',
      action: 'USER_LOGIN',
      previousValue: '',
      newValue: '',
      remarks: 'User successfully authenticated via SSO',
      ipAddress: '192.168.1.50',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    {
      id: 'aud-init-2',
      timestamp: '2026-07-15T10:15:00Z',
      userId: 'usr-eng-bob',
      userName: 'Bob Builder',
      userRole: 'Technician',
      action: 'UPDATE_JOB',
      previousValue: '{"status": "ASSIGNED"}',
      newValue: '{"status": "WORKSHOP_REPAIR"}',
      remarks: 'Transferred instrument Cary 3500 to Workshop due to intensive optical sensor misalignment',
      ipAddress: '192.168.1.112',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
    },
    {
      id: 'aud-init-3',
      timestamp: '2026-07-15T11:00:00Z',
      userId: 'usr-admin-1',
      userName: 'Dr. John Doe',
      userRole: 'Admin',
      action: 'CONFIG_CHANGE',
      previousValue: '{"global_grace_period_days": "10"}',
      newValue: '{"global_grace_period_days": "14"}',
      remarks: 'Adjusted global grace period for preventive maintenance to account for public holidays',
      ipAddress: '192.168.1.50',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  ],
  service_jobs: [],
  kpi_master: [],
  employee_kpi_assignments: [],
  kpi_measurements: [],
  amc_contracts: [],
  amc_renewals: [],
  instrument_assets: [
    {
      id: 'ast-1',
      assetNumber: 'AST-JOB-TEST-999',
      serialNumber: 'JOB-TEST-999',
      brand: 'SHIMADZU',
      model: 'Prominence LC-2030',
      description: 'Shimadzu Prominence Chromatograph',
      warrantyPeriodMonths: 12,
      customerName: 'Lanka Hospitals Lab',
      department: 'Biochemistry',
      serviceHistoryCount: 0,
      repairHistoryCount: 0,
      totalRevenueGenerated: 0
    },
    {
      id: 'ast-2',
      assetNumber: 'AST-WS-TEST-888',
      serialNumber: 'WS-TEST-888',
      brand: 'THERMO SCIENTIFIC',
      model: 'QuantStudio 5',
      description: 'Thermo PCR Thermocycler',
      warrantyPeriodMonths: 24,
      customerName: 'Asiri Surgical Lab',
      department: 'Molecular',
      serviceHistoryCount: 0,
      repairHistoryCount: 0,
      totalRevenueGenerated: 0
    }
  ]
};

function executeMockQuery(sql: string, params: any[] = []): any {
  const cleanSql = sql.replace(/\s+/g, ' ').trim().toLowerCase();

  // Custom JOIN emulators for KPI & Dashboard queries in fallback mode
  if (cleanSql.includes('join kpi_master')) {
    const assignments = mockTables['employee_kpi_assignments'] || [];
    const masters = mockTables['kpi_master'] || [];
    const joined = assignments.map(eka => {
      const km = masters.find(m => m.id === eka.kpiId);
      return {
        ...eka,
        assignmentId: eka.id,
        name: km?.name,
        description: km?.description,
        weight: km?.weight,
        targetValue: km?.targetValue,
        roleType: km?.roleType
      };
    });
    
    // Check if filtering by employeeId
    const whereMatch = sql.match(/(?:eka\.employeeId|employeeId)\s*=\s*\?/i);
    if (whereMatch && params.length > 0) {
      const empId = params[0];
      return joined.filter(row => row.employeeId === empId);
    }
    return joined;
  }

  if (cleanSql.includes('join installation_requests')) {
    const installations = mockTables['installations'] || [];
    const requests = mockTables['installation_requests'] || [];
    const joined = installations.map(i => {
      const ir = requests.find(r => r.serialNumber === i.serialNumber);
      return {
        ...i,
        invoiceValue: ir?.invoiceValue || 0
      };
    });
    return joined;
  }

  if (cleanSql.includes('sum(eka.score * km.weight)')) {
    const users = mockTables['users'] || [
      { id: 'usr-eng-bob', name: 'Bob Builder', email: 'bob@avon.lk', role: 'Engineer' }
    ];
    const assignments = mockTables['employee_kpi_assignments'] || [];
    const masters = mockTables['kpi_master'] || [];
    
    const results = users.map(user => {
      const userAssignments = assignments.filter(a => a.employeeId === user.id);
      if (userAssignments.length === 0) return null;
      
      let weightedSum = 0;
      let totalWeight = 0;
      let errorsCount = 0;
      
      for (const eka of userAssignments) {
        const km = masters.find(m => m.id === eka.kpiId);
        if (km) {
          weightedSum += (eka.score || 0) * (km.weight || 0);
          totalWeight += (km.weight || 0);
        }
        errorsCount += (eka.errorsCount || 0);
      }
      
      return {
        employeeId: user.id,
        employeeName: user.name,
        employeeEmail: user.email,
        employeeRole: user.role,
        avatarUrl: user.avatarUrl,
        rawCompositeScore: totalWeight > 0 ? (weightedSum / totalWeight) : 0,
        totalErrors: errorsCount,
        assignedKpiCount: userAssignments.length
      };
    }).filter(Boolean);
    
    return results;
  }

  let tableName = '';
  const tableMatches = sql.match(/(?:from|into|update|join|delete\s+from)\s+\`?([\w.]+)\`?/i);
  if (tableMatches && tableMatches[1]) {
    tableName = tableMatches[1];
  } else {
    const tblMatch = sql.match(/(?:update|delete\s+from)\s+\`?([\w.]+)\`?/i);
    if (tblMatch && tblMatch[1]) tableName = tblMatch[1];
  }
  
  if (tableName === 'users' || tableName === 'public.users' || tableName === 'public' || tableName === 'user_profiles') {
    tableName = 'users';
  }
  
  if (!mockTables[tableName]) {
    mockTables[tableName] = [];
  }
  const tableData = mockTables[tableName];

  if (cleanSql.startsWith('select') && tableName === 'documents') {
    let filtered = tableData.filter(row => row.status !== 'DELETED');
    let paramIdx = 0;
    
    if (cleanSql.includes('category = ?')) {
      const catVal = params[paramIdx++];
      if (catVal && catVal !== 'ALL') {
        filtered = filtered.filter(row => String(row.category).toLowerCase() === String(catVal).toLowerCase());
      }
    }
    
    if (cleanSql.includes('associatedid = ?')) {
      const assocVal = params[paramIdx++];
      filtered = filtered.filter(row => String(row.associatedId).toLowerCase() === String(assocVal).toLowerCase());
    }
    
    if (cleanSql.includes('name like ?')) {
      const searchVal = params[paramIdx++];
      if (searchVal) {
        const cleanTerm = String(searchVal).replace(/%/g, '').toLowerCase();
        filtered = filtered.filter(row => 
          String(row.name).toLowerCase().includes(cleanTerm) || 
          String(row.description || '').toLowerCase().includes(cleanTerm)
        );
        paramIdx++; // skip duplicate search param for description
      }
    }
    
    // Role security filtering
    if (cleanSql.includes("securitylevel = 'standard'")) {
      filtered = filtered.filter(row => row.securityLevel === 'STANDARD');
    } else if (cleanSql.includes("securitylevel in ('standard', 'internal_only')")) {
      filtered = filtered.filter(row => row.securityLevel === 'STANDARD' || row.securityLevel === 'INTERNAL_ONLY');
    }
    
    return filtered;
  }

  if (cleanSql.startsWith('select count')) {
    return [{ count: tableData.length }];
  }
  
  if (cleanSql.startsWith('select')) {
    const whereMatch = sql.match(/where\s+(.+)$/i);
    if (whereMatch) {
      const conditionStr = whereMatch[1];
      const conditionParts = conditionStr.split(/\s+and\s+/i);
      let filtered = [...tableData];
      
      let paramIdx = 0;
      for (const part of conditionParts) {
        const eqMatch = part.match(/\`?(\w+)\`?\s*=\s*\?/i);
        if (eqMatch) {
          const colName = eqMatch[1];
          const val = params[paramIdx++];
          filtered = filtered.filter(row => String(row[colName]).toLowerCase() === String(val).toLowerCase());
        }
      }
      return filtered;
    }
    return [...tableData];
  }
  
  if (cleanSql.startsWith('insert into')) {
    const colsMatch = sql.match(/insert\s+into\s+\`?(\w+)\`?\s*\(([^)]+)\)\s*values/i);
    if (colsMatch) {
      const cols = colsMatch[2].split(',').map(c => c.trim().replace(/\`/g, ''));
      const newRow: any = {};
      for (let i = 0; i < cols.length; i++) {
        newRow[cols[i]] = params[i];
      }
      tableData.push(newRow);
      saveMockTables();
      return { affectedRows: 1, insertId: newRow.id || Math.floor(Math.random() * 100000) };
    }
    return { affectedRows: 1 };
  }
  
  if (cleanSql.startsWith('update')) {
    const whereMatch = sql.match(/where\s+(\w+)\s*=\s*\?/i);
    if (whereMatch && params.length > 0) {
      const keyCol = whereMatch[1]; // e.g. 'id'
      const keyVal = params[params.length - 1];
      
      const setMatch = sql.match(/set\s+(.+)\s+where/i);
      if (setMatch) {
        const setParts = setMatch[1].split(',');
        const rowToUpdate = tableData.find((row: any) => String(row[keyCol]).toLowerCase() === String(keyVal).toLowerCase());
        if (rowToUpdate) {
          let paramIdx = 0;
          for (const part of setParts) {
            const colPlaceholderMatch = part.match(/\`?(\w+)\`?\s*=\s*\?/i);
            if (colPlaceholderMatch) {
              const colName = colPlaceholderMatch[1];
              rowToUpdate[colName] = params[paramIdx++];
            } else {
              const colLiteralMatch = part.match(/\`?(\w+)\`?\s*=\s*['"]([^'"]+)['"]/i);
              if (colLiteralMatch) {
                const colName = colLiteralMatch[1];
                rowToUpdate[colName] = colLiteralMatch[2];
              }
            }
          }
          saveMockTables();
        }
      }
    }
    return { affectedRows: 1 };
  }
  
  if (cleanSql.startsWith('delete')) {
    const whereMatch = sql.match(/where\s+(\w+)\s*=\s*\?/i);
    if (whereMatch && params.length > 0) {
      const keyCol = whereMatch[1];
      const keyVal = params[0];
      const index = tableData.findIndex((row: any) => String(row[keyCol]).toLowerCase() === String(keyVal).toLowerCase());
      if (index !== -1) {
        tableData.splice(index, 1);
        saveMockTables();
      }
    }
    return { affectedRows: 1 };
  }
  
  return [];
}

function cleanSqlForPostgres(sql: string): string {
  let cleaned = sql;

  // 1. Remove ENGINE=InnoDB or variations, and DEFAULT CHARSET/COLLATE
  cleaned = cleaned.replace(/ENGINE\s*=\s*InnoDB/gi, '');
  cleaned = cleaned.replace(/DEFAULT\s+CHARSET\s*=\s*[a-zA-Z0-9_]+/gi, '');
  cleaned = cleaned.replace(/COLLATE\s*=\s*[a-zA-Z0-9_]+/gi, '');

  // 2. Remove MySQL-specific column prefix index declarations like (token(191)) -> (token)
  cleaned = cleaned.replace(/\((\w+)\(\d+\)\)/g, '($1)');

  // 3. Remove inline INDEX lines entirely
  const lines = cleaned.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim().toUpperCase();
    if (trimmed.startsWith('INDEX ')) {
      return false; // Skip inline INDEX declarations
    }
    return true;
  });

  cleaned = filteredLines.join('\n');

  // 4. Remove any trailing commas before the closing parenthesis ')' which happen because index lines were stripped
  cleaned = cleaned.replace(/,\s*\)/g, '\n)');

  // 5. Replace MySQL UNIQUE KEY/INDEX inline declarations with standard PostgreSQL syntax
  cleaned = cleaned.replace(/UNIQUE KEY\s+\w+\s+\(([^)]+)\)/gi, 'UNIQUE ($1)');
  cleaned = cleaned.replace(/UNIQUE INDEX\s+\w+\s+\(([^)]+)\)/gi, 'UNIQUE ($1)');

  // 6. Replace backticks with double-quotes for reserved words and identifier escaping in PostgreSQL
  cleaned = cleaned.replace(/`([^`]+)`/g, '"$1"');

  // 7. Map MySQL-specific data types to standard PostgreSQL types
  cleaned = cleaned.replace(/TINYINT\s*\(\s*1\s*\)/gi, 'SMALLINT');
  cleaned = cleaned.replace(/LONGTEXT/gi, 'TEXT');
  cleaned = cleaned.replace(/MEDIUMTEXT/gi, 'TEXT');

  return cleaned;
}

const COLUMN_CASE_MAP: Record<string, string> = {
  contractnumber: 'contractNumber',
  customerid: 'customerId',
  customername: 'customerName',
  startdate: 'startDate',
  enddate: 'endDate',
  pminterval: 'pmInterval',
  slatier: 'slaTier',
  amctype: 'amcType',
  coveredassetids: 'coveredAssetIds',
  escalationrate: 'escalationRate',
  uptimeguarantee: 'uptimeGuarantee',
  responsetimehours: 'responseTimeHours',
  lastreneweddate: 'lastRenewedDate',
  createdat: 'createdAt',
  updatedat: 'updatedAt',
  invoicenumber: 'invoiceNumber',
  invoicevalue: 'invoiceValue',
  departmentname: 'departmentName',
  endusername: 'endUserName',
  instrumentname: 'instrumentName',
  deliverydate: 'deliveryDate',
  warrantyperiod: 'warrantyPeriod',
  warrantyunit: 'warrantyUnit',
  requestid: 'requestId',
  assignedengineer: 'assignedEngineer',
  assignedtechnicians: 'assignedTechnicians',
  assignedby: 'assignedBy',
  assignmentdate: 'assignmentDate',
  targetinstallationdate: 'targetInstallationDate',
  sladayssetting: 'slaDaysSetting',
  sladuedate: 'slaDueDate',
  installationterritory: 'installationTerritory',
  performedby: 'performedBy',
  performedbyrole: 'performedByRole',
  fromstatus: 'fromStatus',
  tostatus: 'toStatus',
  installationnumber: 'installationNumber',
  instrumentid: 'instrumentId',
  serialnumber: 'serialNumber',
  warrantyexpirydate: 'warrantyExpiryDate',
  installationstatus: 'installationStatus',
  commissioningsignoffby: 'commissioningSignOffBy',
  customersignoffby: 'customerSignOffBy',
  checklistdata: 'checklistData',
  ticketnumber: 'ticketNumber',
  slastatus: 'slaStatus',
  targetresolutiondate: 'targetResolutionDate',
  assignmentid: 'assignmentId',
  jobcardnumber: 'jobCardNumber',
  jobtype: 'jobType',
  resolutionsummary: 'resolutionSummary',
  partsreplaced: 'partsReplaced',
  laborhours: 'laborHours',
  costamount: 'costAmount',
  customerfeedback: 'customerFeedback',
  signoffby: 'signOffBy',
  startedat: 'startedAt',
  completedat: 'completedAt',
  targetvalue: 'targetValue',
  roletype: 'roleType',
  employeeid: 'employeeId',
  kpiid: 'kpiId',
  financialyearid: 'financialYearId',
  currentvalue: 'currentValue',
  errorscount: 'errorsCount',
  kpiassignmentid: 'kpiAssignmentId',
  measuredvalue: 'measuredValue',
  scorecalculated: 'scoreCalculated',
  recordedat: 'recordedAt',
  evaluatedby: 'evaluatedBy',
  evaluatedat: 'evaluatedAt',
  overallscore: 'overallScore',
  contractid: 'contractId',
  previousenddate: 'previousEndDate',
  newenddate: 'newEndDate',
  previousprice: 'previousPrice',
  newprice: 'newPrice',
  escalationapplied: 'escalationApplied',
  renewedby: 'renewedBy',
  renewedat: 'renewedAt',
  userid: 'userId',
  readat: 'readAt',
  associatedid: 'associatedId',
  mimetype: 'mimeType',
  sizebytes: 'sizeBytes',
  storagepath: 'storagePath',
  versionnumber: 'versionNumber',
  securitylevel: 'securityLevel',
  uploadedby: 'uploadedBy',
  documentid: 'documentId',
  changesummary: 'changeSummary',
  username: 'userName',
  userrole: 'userRole',
  previousvalue: 'previousValue',
  newvalue: 'newValue',
  ipaddress: 'ipAddress',
  useragent: 'userAgent',
  assetnumber: 'assetNumber',
  warrantyperiodmonths: 'warrantyPeriodMonths',
  servicehistorycount: 'serviceHistoryCount',
  repairhistorycount: 'repairHistoryCount',
  totalrevenuegenerated: 'totalRevenueGenerated',
  avatarurl: 'avatarUrl',
  expiresat: 'expiresAt',
  permissionid: 'permissionId',
  rolename: 'roleName',
  isencrypted: 'isEncrypted',
  appversion: 'appVersion',
  apiversion: 'apiVersion',
  releasedate: 'releaseDate',
  isactive: 'isActive',
  sortorder: 'sortOrder'
};

const NUMERIC_KEYS = new Set([
  'price', 'previousPrice', 'newPrice', 'invoiceValue', 'costAmount',
  'escalationRate', 'uptimeGuarantee', 'responseTimeHours', 'escalationApplied',
  'score', 'errorsCount', 'scoreCalculated', 'overallScore', 'weight',
  'warrantyPeriod', 'slaDaysSetting', 'laborHours', 'sortOrder', 'isEncrypted',
  'isActive', 'revoked', 'versionNumber', 'sizeBytes', 'serviceHistoryCount',
  'repairHistoryCount', 'totalRevenueGenerated', 'warrantyPeriodMonths'
]);

function normalizeRowKeys(row: any): any {
  if (!row || typeof row !== 'object') return row;
  if (Array.isArray(row)) return row.map(normalizeRowKeys);
  const normalized: any = {};
  for (const key of Object.keys(row)) {
    const lowerKey = key.toLowerCase();
    const targetKey = COLUMN_CASE_MAP[lowerKey] || key;
    let val = row[key];
    if (typeof val === 'string' && NUMERIC_KEYS.has(targetKey) && val.trim() !== '') {
      const parsed = Number(val);
      if (!isNaN(parsed)) {
        val = parsed;
      }
    }
    normalized[targetKey] = val;
  }
  return normalized;
}

class UnifiedDatabasePool implements DatabasePool {
  private pool: any = null;
  private isConnected = false;
  private isMock = false;
  private isPostgres = false;

  private translateQuery(sql: string, params: any[] = []): { sql: string; params: any[] } {
    if (!this.isPostgres) {
      return { sql, params };
    }

    let cleanedSql = sql;

    // 1. DDL Specific Translation
    const isDDL = sql.toLowerCase().includes('create table');
    if (isDDL) {
      cleanedSql = cleanSqlForPostgres(sql);
    } else {
      // 2. DML Specific Translation
      // Replace MySQL backticks with double quotes (essential for Postgres identifiers)
      cleanedSql = cleanedSql.replace(/`([^`]+)`/g, '"$1"');
    }

    // Replace ? with $1, $2, etc.
    let index = 1;
    cleanedSql = cleanedSql.replace(/\?/g, () => `$${index++}`);

    return { sql: cleanedSql, params };
  }

  async initialize(): Promise<void> {
    try {
      this.isPostgres = true;

      if (process.env.SUPABASE_DB_URL) {
        logger.info(`Connecting to PostgreSQL/Supabase instance using SUPABASE_DB_URL...`);
      } else {
        logger.info(`Connecting to PostgreSQL/Supabase instance at ${config.db.host}:${config.db.port}...`);
        logger.info(`Database Name: ${config.db.name}`);
      }

      if (!process.env.SUPABASE_DB_URL && (!config.db.host || !config.db.user)) {
        logger.warn('Database connection parameters are missing. Falling back to in-memory database mock.');
        this.isConnected = true;
        this.isMock = true;
        loadMockTables();
        return;
      }

      const isLocalHost = !process.env.SUPABASE_DB_URL && (config.db.host === 'localhost' || config.db.host === '127.0.0.1' || !process.env.DB_HOST);
      const retries = isLocalHost ? 1 : 2;
      let delay = 100;
      const connTimeout = isLocalHost ? 1500 : 3000;

      for (let i = 0; i < retries; i++) {
        try {
          const poolConfig: any = process.env.SUPABASE_DB_URL 
            ? {
                connectionString: process.env.SUPABASE_DB_URL,
                max: config.db.connectionLimit,
                connectionTimeoutMillis: connTimeout,
                idleTimeoutMillis: 30000,
              }
            : {
                host: config.db.host,
                port: config.db.port,
                user: config.db.user,
                password: config.db.pass,
                database: config.db.name,
                max: config.db.connectionLimit,
                connectionTimeoutMillis: connTimeout,
                idleTimeoutMillis: 30000,
              };

          // Always enable SSL for remote cloud databases like Supabase, Neon
          if (config.db.ssl || 
              (process.env.SUPABASE_DB_URL && (process.env.SUPABASE_DB_URL.includes('supabase') || process.env.SUPABASE_DB_URL.includes('neon'))) ||
              (config.db.host && (config.db.host.includes('supabase') || config.db.host.includes('neon')))) {
            poolConfig.ssl = {
              rejectUnauthorized: config.db.sslRejectUnauthorized || false,
            };
            if (config.db.sslCa) {
              poolConfig.ssl.ca = config.db.sslCa;
            }
          }

          const pgPool = new PgPool(poolConfig);

          // Wrap pgPool to behave like database pool interface
          this.pool = {
            query: async (sql: string, params?: any[]) => {
              const { sql: cleanSql, params: pgParams } = this.translateQuery(sql, params);
              const res = await pgPool.query(cleanSql, pgParams);
              const rows = Array.isArray(res.rows) ? res.rows.map(normalizeRowKeys) : res.rows;
              return [rows, null];
            },
            getConnection: async () => {
              const client = await pgPool.connect();
              return {
                query: async (sql: string, params?: any[]) => {
                  const { sql: cleanSql, params: pgParams } = this.translateQuery(sql, params);
                  const res = await client.query(cleanSql, pgParams);
                  const rows = Array.isArray(res.rows) ? res.rows.map(normalizeRowKeys) : res.rows;
                  return [rows, null];
                },
                beginTransaction: async () => {
                  await client.query('BEGIN');
                },
                commit: async () => {
                  await client.query('COMMIT');
                },
                rollback: async () => {
                  await client.query('ROLLBACK');
                },
                release: () => {
                  client.release();
                },
              };
            },
            end: async () => {
              await pgPool.end();
            },
          };

          // Test the connection
          await this.validateConnection();
          
          // Ensure schemas exist
          await this.ensureSchema();
          
          this.isConnected = true;
          logger.info('Database: Connection pool initialized successfully with Supabase/PostgreSQL.');
          return;
        } catch (error) {
          logger.warn(`Database: Connection attempt ${i + 1} of ${retries} failed. Error: ${(error as Error).message}`);
          if (this.pool) {
            await this.pool.end().catch(() => {});
            this.pool = null;
          }
          
          if (i < retries - 1) {
            logger.info(`Database: Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      logger.warn('Database: All connection attempts failed.');
      logger.warn('Database: FALLING BACK TO IN-MEMORY DATABASE MOCK.');
      this.isConnected = true;
      this.isMock = true;
      loadMockTables();
    } catch (fatalErr) {
      logger.warn(`Database initialization fatal exception: ${(fatalErr as Error).message}. Falling back to mock database.`);
      this.isConnected = true;
      this.isMock = true;
      loadMockTables();
    }
  }

  private async validateConnection(): Promise<void> {
    if (!this.pool) {
      throw new Error('Database pool is not created.');
    }
    const connection = await this.pool.getConnection();
    try {
      await connection.query('SELECT 1');
      logger.info('Database: Connection validation check passed successfully.');
    } finally {
      connection.release();
    }
  }

  private async ensureSchema(): Promise<void> {
    if (!this.pool) return;
    try {
      logger.info('Database: Ensuring refresh_tokens schema table exists...');
      const sql = `
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id VARCHAR(36) PRIMARY KEY,
          token VARCHAR(500) NOT NULL,
          userId VARCHAR(36) NOT NULL,
          expiresAt VARCHAR(50) NOT NULL,
          createdAt VARCHAR(50) NOT NULL,
          revoked TINYINT(1) DEFAULT 0,
          INDEX idx_token (token(191)),
          INDEX idx_userId (userId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(sql);
      logger.info('Database: refresh_tokens table verified/created successfully.');

      logger.info('Database: Ensuring rbac_permissions schema table exists...');
      const rbacPermissionsSql = `
        CREATE TABLE IF NOT EXISTS rbac_permissions (
          id VARCHAR(36) PRIMARY KEY,
          code VARCHAR(100) UNIQUE NOT NULL,
          description VARCHAR(255)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(rbacPermissionsSql);

      logger.info('Database: Ensuring rbac_role_permissions schema table exists...');
      const rbacRolePermissionsSql = `
        CREATE TABLE IF NOT EXISTS rbac_role_permissions (
          roleName VARCHAR(100) NOT NULL,
          permissionId VARCHAR(36) NOT NULL,
          PRIMARY KEY (roleName, permissionId),
          FOREIGN KEY (permissionId) REFERENCES rbac_permissions(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(rbacRolePermissionsSql);

      // Check if permissions already exist, otherwise seed defaults
      const [permRows]: any = await this.pool.query('SELECT COUNT(*) as count FROM rbac_permissions');
      if (permRows && permRows[0] && permRows[0].count === 0) {
        logger.info('Database: Seeding default RBAC permissions and roles...');
        const perms = [
          { id: 'p1', code: 'jobs:create', description: 'Create service jobs' },
          { id: 'p2', code: 'jobs:read', description: 'Read service jobs' },
          { id: 'p3', code: 'jobs:update', description: 'Update service jobs' },
          { id: 'p4', code: 'jobs:delete', description: 'Delete service jobs' },
          { id: 'p5', code: 'users:create', description: 'Create users' },
          { id: 'p6', code: 'users:read', description: 'Read users' },
          { id: 'p7', code: 'users:update', description: 'Update users' },
          { id: 'p8', code: 'users:delete', description: 'Delete users' },
          { id: 'p9', code: 'assets:create', description: 'Create assets' },
          { id: 'p10', code: 'assets:read', description: 'Read assets' },
          { id: 'p11', code: 'assets:update', description: 'Update assets' },
          { id: 'p12', code: 'assets:delete', description: 'Delete assets' },
          { id: 'p13', code: 'customers:create', description: 'Create customers' },
          { id: 'p14', code: 'customers:read', description: 'Read customers' },
          { id: 'p15', code: 'customers:update', description: 'Update customers' },
          { id: 'p16', code: 'customers:delete', description: 'Delete customers' },
        ];

        for (const p of perms) {
          await this.pool.query(
            'INSERT INTO rbac_permissions (id, code, description) VALUES (?, ?, ?)',
            [p.id, p.code, p.description]
          );
        }

        // Seed Admin and System Admin role permissions
        const adminPerms = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16'];
        for (const pid of adminPerms) {
          await this.pool.query(
            'INSERT INTO rbac_role_permissions (roleName, permissionId) VALUES (?, ?)',
            ['Admin', pid]
          );
          await this.pool.query(
            'INSERT INTO rbac_role_permissions (roleName, permissionId) VALUES (?, ?)',
            ['System Admin', pid]
          );
        }

        // Seed Dispatcher role permissions
        const dispatcherPerms = ['p1', 'p2', 'p3', 'p10', 'p13', 'p14', 'p15'];
        for (const pid of dispatcherPerms) {
          await this.pool.query(
            'INSERT INTO rbac_role_permissions (roleName, permissionId) VALUES (?, ?)',
            ['Dispatcher', pid]
          );
        }

        // Seed Technician role permissions
        const technicianPerms = ['p2', 'p3', 'p10', 'p14'];
        for (const pid of technicianPerms) {
          await this.pool.query(
            'INSERT INTO rbac_role_permissions (roleName, permissionId) VALUES (?, ?)',
            ['Technician', pid]
          );
        }
        logger.info('Database: Default RBAC permissions and role-permissions seeded successfully.');
      }

      // Ensure system_settings schema exists
      logger.info('Database: Ensuring system_settings table exists...');
      const systemSettingsSql = `
        CREATE TABLE IF NOT EXISTS system_settings (
          id VARCHAR(36) PRIMARY KEY,
          \`key\` VARCHAR(100) UNIQUE NOT NULL,
          value TEXT,
          category VARCHAR(50) NOT NULL,
          updatedAt VARCHAR(50) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(systemSettingsSql);

      // Seed system_settings if empty
      const [settingRows]: any = await this.pool.query('SELECT COUNT(*) as count FROM system_settings');
      if (settingRows && settingRows[0] && settingRows[0].count === 0) {
        logger.info('Database: Seeding default system settings...');
        const nowStr = new Date().toISOString();
        const settings = [
          { id: 'ss1', key: 'system_name', value: 'AVON ServicePro Enterprise', category: 'General' },
          { id: 'ss2', key: 'contact_email', value: 'support@avon.lk', category: 'General' },
          { id: 'ss3', key: 'maintenance_mode', value: 'false', category: 'Maintenance' },
          { id: 'ss4', key: 'timezone', value: 'Asia/Colombo', category: 'General' },
          { id: 'ss5', key: 'global_grace_period_days', value: '14', category: 'Service' }
        ];
        for (const s of settings) {
          await this.pool.query(
            'INSERT INTO system_settings (id, `key`, value, category, updatedAt) VALUES (?, ?, ?, ?, ?)',
            [s.id, s.key, s.value, s.category, nowStr]
          );
        }
      }

      // Ensure configurations schema exists
      logger.info('Database: Ensuring configurations table exists...');
      const configurationsSql = `
        CREATE TABLE IF NOT EXISTS configurations (
          id VARCHAR(36) PRIMARY KEY,
          \`key\` VARCHAR(100) UNIQUE NOT NULL,
          value TEXT,
          type VARCHAR(50) NOT NULL,
          description VARCHAR(255),
          isEncrypted TINYINT(1) DEFAULT 0,
          updatedAt VARCHAR(50) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(configurationsSql);

      // Seed configurations if empty
      const [configRows]: any = await this.pool.query('SELECT COUNT(*) as count FROM configurations');
      if (configRows && configRows[0] && configRows[0].count === 0) {
        logger.info('Database: Seeding default configurations...');
        const nowStr = new Date().toISOString();
        const configs = [
          { id: 'cfg1', key: 'smtp_host', value: 'mail.avon.lk', type: 'string', description: 'Outgoing SMTP server host', isEncrypted: 0 },
          { id: 'cfg2', key: 'smtp_port', value: '587', type: 'number', description: 'SMTP SSL/TLS Port', isEncrypted: 0 },
          { id: 'cfg3', key: 'api_timeout_ms', value: '30000', type: 'number', description: 'Maximum HTTP API request timeout in milliseconds', isEncrypted: 0 },
          { id: 'cfg4', key: 'log_level', value: 'info', type: 'string', description: 'Server logs verbose level', isEncrypted: 0 }
        ];
        for (const c of configs) {
          await this.pool.query(
            'INSERT INTO configurations (id, `key`, value, type, description, isEncrypted, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [c.id, c.key, c.value, c.type, c.description, c.isEncrypted, nowStr]
          );
        }
      }

      // Ensure version_control schema exists
      logger.info('Database: Ensuring version_control table exists...');
      const versionControlSql = `
        CREATE TABLE IF NOT EXISTS version_control (
          id VARCHAR(36) PRIMARY KEY,
          appVersion VARCHAR(50) NOT NULL,
          apiVersion VARCHAR(50) NOT NULL,
          releaseDate VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          changelog TEXT,
          createdAt VARCHAR(50) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(versionControlSql);

      // Seed version_control if empty
      const [versionRows]: any = await this.pool.query('SELECT COUNT(*) as count FROM version_control');
      if (versionRows && versionRows[0] && versionRows[0].count === 0) {
        logger.info('Database: Seeding default version control entries...');
        const nowStr = new Date().toISOString();
        const versions = [
          { id: 'v1', appVersion: '1.0.0', apiVersion: 'v1', releaseDate: '2026-06-01', status: 'ACTIVE', changelog: 'Initial stable enterprise release of AVON ServicePro.' },
          { id: 'v2', appVersion: '1.1.0', apiVersion: 'v1', releaseDate: '2026-07-15', status: 'ACTIVE', changelog: 'Added Organization Hierarchy Module and Department Structure management.' }
        ];
        for (const v of versions) {
          await this.pool.query(
            'INSERT INTO version_control (id, appVersion, apiVersion, releaseDate, status, changelog, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [v.id, v.appVersion, v.apiVersion, v.releaseDate, v.status, v.changelog, nowStr]
          );
        }
      }

      // Ensure lookup_data schema exists
      logger.info('Database: Ensuring lookup_data table exists...');
      const lookupDataSql = `
        CREATE TABLE IF NOT EXISTS lookup_data (
          id VARCHAR(36) PRIMARY KEY,
          type VARCHAR(100) NOT NULL,
          code VARCHAR(100) NOT NULL,
          value VARCHAR(255) NOT NULL,
          isActive TINYINT(1) DEFAULT 1,
          sortOrder INT DEFAULT 0,
          createdAt VARCHAR(50) NOT NULL,
          UNIQUE KEY idx_type_code (type, code)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(lookupDataSql);

      // Ensure installation module tables exist (MariaDB camelCase mapped schema)
      logger.info('Database: Ensuring installation module tables exist...');
      const instRequestsSql = `
        CREATE TABLE IF NOT EXISTS installation_requests (
          id VARCHAR(36) PRIMARY KEY,
          invoiceNumber VARCHAR(100) NOT NULL,
          invoiceValue DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
          customerName VARCHAR(255) NOT NULL,
          departmentName VARCHAR(255) NOT NULL,
          endUserName VARCHAR(255) NOT NULL,
          instrumentName VARCHAR(255) NOT NULL,
          brand VARCHAR(100) NOT NULL,
          model VARCHAR(100) NOT NULL,
          serialNumber VARCHAR(100) NOT NULL UNIQUE,
          deliveryDate VARCHAR(50) NOT NULL,
          warrantyPeriod INT NOT NULL DEFAULT 12,
          warrantyUnit VARCHAR(50) NOT NULL DEFAULT 'Months',
          remarks TEXT,
          status VARCHAR(100) NOT NULL DEFAULT 'Pending Assignment',
          createdAt VARCHAR(50) NOT NULL,
          updatedAt VARCHAR(50) NOT NULL,
          INDEX idx_inst_req_invoice (invoiceNumber),
          INDEX idx_inst_req_serial (serialNumber),
          INDEX idx_inst_req_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(instRequestsSql);

      const instAssignmentsSql = `
        CREATE TABLE IF NOT EXISTS installation_assignments (
          id VARCHAR(36) PRIMARY KEY,
          requestId VARCHAR(36) NOT NULL UNIQUE,
          assignedEngineer VARCHAR(255) NOT NULL,
          assignedTechnicians TEXT,
          assignedBy VARCHAR(255) NOT NULL,
          assignmentDate VARCHAR(50) NOT NULL,
          targetInstallationDate VARCHAR(50) NOT NULL,
          priority VARCHAR(50) NOT NULL DEFAULT 'Normal',
          slaDaysSetting INT NOT NULL DEFAULT 15,
          slaDueDate VARCHAR(50) NOT NULL,
          installationTerritory VARCHAR(100) NOT NULL,
          remarks TEXT,
          createdAt VARCHAR(50) NOT NULL,
          updatedAt VARCHAR(50) NOT NULL,
          INDEX idx_asgn_req_id (requestId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(instAssignmentsSql);

      const instAuditLogsSql = `
        CREATE TABLE IF NOT EXISTS installation_assignment_audit_logs (
          id VARCHAR(36) PRIMARY KEY,
          requestId VARCHAR(36) NOT NULL,
          assignmentId VARCHAR(36),
          action VARCHAR(255) NOT NULL,
          fromStatus VARCHAR(100),
          toStatus VARCHAR(100) NOT NULL,
          performedBy VARCHAR(255) NOT NULL,
          performedByRole VARCHAR(255) NOT NULL,
          notes TEXT,
          timestamp VARCHAR(50) NOT NULL,
          INDEX idx_audit_req_id (requestId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(instAuditLogsSql);

      const installationsSql = `
        CREATE TABLE IF NOT EXISTS installations (
          id VARCHAR(36) PRIMARY KEY,
          installationNumber VARCHAR(100) NOT NULL UNIQUE,
          instrumentId VARCHAR(50) NOT NULL,
          instrumentName VARCHAR(255) NOT NULL,
          serialNumber VARCHAR(100) NOT NULL UNIQUE,
          customerId VARCHAR(50) NOT NULL,
          customerName VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          status VARCHAR(100) NOT NULL DEFAULT 'Pending',
          createdAt VARCHAR(50) NOT NULL,
          slaDeadline VARCHAR(50) NOT NULL,
          createdById VARCHAR(36) NOT NULL,
          createdByName VARCHAR(255) NOT NULL,
          assignedStaffId VARCHAR(36),
          assignedStaffName VARCHAR(255),
          assignedAt VARCHAR(50),
          assignedById VARCHAR(36),
          assignedByName VARCHAR(255),
          completedAt VARCHAR(50),
          completedById VARCHAR(36),
          completedByName VARCHAR(255),
          reportNotes TEXT,
          checklist TEXT,
          warrantyCardUpdated TINYINT(1) DEFAULT 0,
          warrantyCardUpdatedBy VARCHAR(255),
          warrantyCardUpdatedById VARCHAR(36),
          warrantyCardUpdatedAt VARCHAR(50),
          warrantyStart VARCHAR(50),
          warrantyExpiry VARCHAR(50),
          brand VARCHAR(100),
          model VARCHAR(100),
          warrantyCardNumber VARCHAR(100),
          warrantyPeriodMonths INT,
          warrantyPeriodYears INT,
          INDEX idx_inst_serial (serialNumber),
          INDEX idx_inst_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(installationsSql);

      // Ensure Service Request module tables exist
      logger.info('Database: Ensuring service request module tables exist...');
      const srvRequestsSql = `
        CREATE TABLE IF NOT EXISTS service_requests (
          id VARCHAR(36) PRIMARY KEY,
          ticketNumber VARCHAR(100) NOT NULL UNIQUE,
          instrumentId VARCHAR(50) NOT NULL,
          instrumentName VARCHAR(255) NOT NULL,
          serialNumber VARCHAR(100) NOT NULL,
          customerId VARCHAR(50) NOT NULL,
          customerName VARCHAR(255) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
          status VARCHAR(100) NOT NULL DEFAULT 'RECEIVED',
          createdAt VARCHAR(50) NOT NULL,
          updatedAt VARCHAR(50) NOT NULL,
          resolvedAt VARCHAR(50),
          downTimeHours DECIMAL(10, 2) DEFAULT 0.00,
          workshopBench VARCHAR(100),
          estimatedCost DECIMAL(15, 2) DEFAULT 0.00,
          billingApproved TINYINT(1) DEFAULT 0,
          slaDueDate VARCHAR(50) NOT NULL,
          slaDaysSetting INT NOT NULL DEFAULT 7,
          slaStatus VARCHAR(50) DEFAULT 'IN_COMPLIANCE',
          INDEX idx_srv_req_ticket (ticketNumber),
          INDEX idx_srv_req_serial (serialNumber),
          INDEX idx_srv_req_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(srvRequestsSql);

      const srvAssignmentsSql = `
        CREATE TABLE IF NOT EXISTS service_request_assignments (
          id VARCHAR(36) PRIMARY KEY,
          requestId VARCHAR(36) NOT NULL UNIQUE,
          assignedEngineerId VARCHAR(36) NOT NULL,
          assignedEngineerName VARCHAR(255) NOT NULL,
          assignedBy VARCHAR(255) NOT NULL,
          assignmentDate VARCHAR(50) NOT NULL,
          targetResolutionDate VARCHAR(50),
          remarks TEXT,
          createdAt VARCHAR(50) NOT NULL,
          updatedAt VARCHAR(50) NOT NULL,
          INDEX idx_srv_asgn_req_id (requestId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(srvAssignmentsSql);

      const srvAuditLogsSql = `
        CREATE TABLE IF NOT EXISTS service_request_audit_logs (
          id VARCHAR(36) PRIMARY KEY,
          requestId VARCHAR(36) NOT NULL,
          action VARCHAR(255) NOT NULL,
          fromStatus VARCHAR(100),
          toStatus VARCHAR(100) NOT NULL,
          performedBy VARCHAR(255) NOT NULL,
          performedByRole VARCHAR(255) NOT NULL,
          notes TEXT,
          timestamp VARCHAR(50) NOT NULL,
          INDEX idx_srv_audit_req_id (requestId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(srvAuditLogsSql);

      // Ensure service_jobs table exists
      logger.info('Database: Ensuring service_jobs table exists...');
      const srvJobsSql = `
        CREATE TABLE IF NOT EXISTS service_jobs (
          id VARCHAR(36) PRIMARY KEY,
          jobType VARCHAR(100) NOT NULL,
          status VARCHAR(100) NOT NULL,
          priority VARCHAR(100) NOT NULL,
          customerName VARCHAR(255) NOT NULL,
          brand VARCHAR(255) NOT NULL,
          model VARCHAR(255) NOT NULL,
          serialNumber VARCHAR(100) NOT NULL,
          assignedEngineerId VARCHAR(36),
          assignedEngineerName VARCHAR(255),
          createdById VARCHAR(36) NOT NULL,
          createdByRole VARCHAR(100) NOT NULL,
          createdAt VARCHAR(50) NOT NULL,
          updatedAt VARCHAR(50) NOT NULL,
          timeline TEXT NOT NULL,
          feedback TEXT,
          partsReceiving TEXT,
          installationData TEXT,
          warrantyServiceData TEXT,
          nonWarrantyData TEXT,
          warrantyRepairData TEXT,
          workshopJobData TEXT,
          calibrationData TEXT,
          INDEX idx_job_serial (serialNumber),
          INDEX idx_job_status (status),
          INDEX idx_job_engineer (assignedEngineerId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(srvJobsSql);

      // Ensure KPI master tables exist
      logger.info('Database: Ensuring KPI master and assignments tables exist...');
      const kpiMasterSql = `
        CREATE TABLE IF NOT EXISTS kpi_master (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          weight INT NOT NULL,
          targetValue VARCHAR(255) NOT NULL,
          roleType VARCHAR(100) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(kpiMasterSql);

      const kpiAssignmentsSql = `
        CREATE TABLE IF NOT EXISTS employee_kpi_assignments (
          id VARCHAR(36) PRIMARY KEY,
          employeeId VARCHAR(36) NOT NULL,
          kpiId VARCHAR(36) NOT NULL,
          financialYearId VARCHAR(100) NOT NULL,
          currentValue VARCHAR(255),
          score INT DEFAULT 0,
          errorsCount INT DEFAULT 0,
          INDEX idx_eka_employee (employeeId),
          INDEX idx_eka_kpi (kpiId),
          FOREIGN KEY (kpiId) REFERENCES kpi_master(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(kpiAssignmentsSql);

      const kpiMeasurementsSql = `
        CREATE TABLE IF NOT EXISTS kpi_measurements (
          id VARCHAR(36) PRIMARY KEY,
          kpiAssignmentId VARCHAR(36) NOT NULL,
          measuredValue VARCHAR(255) NOT NULL,
          scoreCalculated INT NOT NULL,
          recordedAt VARCHAR(50) NOT NULL,
          remarks TEXT,
          INDEX idx_km_assignment (kpiAssignmentId),
          FOREIGN KEY (kpiAssignmentId) REFERENCES employee_kpi_assignments(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(kpiMeasurementsSql);

      const kpiEvaluationsSql = `
        CREATE TABLE IF NOT EXISTS kpi_evaluations (
          id VARCHAR(36) PRIMARY KEY,
          employeeId VARCHAR(36) NOT NULL,
          financialYearId VARCHAR(100) NOT NULL,
          overallScore INT NOT NULL,
          evaluatedBy VARCHAR(36) NOT NULL,
          evaluatedAt VARCHAR(50) NOT NULL,
          status VARCHAR(50) DEFAULT 'Draft',
          comments TEXT,
          INDEX idx_ke_employee (employeeId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(kpiEvaluationsSql);

      // Ensure AMC contracts table exists
      logger.info('Database: Ensuring amc_contracts table exists...');
      const amcContractsSql = `
        CREATE TABLE IF NOT EXISTS amc_contracts (
          id VARCHAR(36) PRIMARY KEY,
          contractNumber VARCHAR(100) NOT NULL UNIQUE,
          customerId VARCHAR(50) NOT NULL,
          customerName VARCHAR(255) NOT NULL,
          startDate VARCHAR(50) NOT NULL,
          endDate VARCHAR(50) NOT NULL,
          pmInterval VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'Active',
          price DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
          slaTier VARCHAR(50) DEFAULT 'Gold',
          amcType VARCHAR(100) DEFAULT 'Standard',
          coveredAssetIds TEXT,
          escalationRate DECIMAL(5, 2) DEFAULT 10.0,
          uptimeGuarantee DECIMAL(5, 2) DEFAULT 98.0,
          responseTimeHours DECIMAL(5, 2) DEFAULT 12.0,
          lastRenewedDate VARCHAR(50),
          notes TEXT,
          createdAt VARCHAR(50) NOT NULL,
          updatedAt VARCHAR(50) NOT NULL,
          INDEX idx_amc_cust (customerId),
          INDEX idx_amc_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(amcContractsSql);

      // Ensure notifications table exists
      logger.info('Database: Ensuring notifications table exists...');
      const notificationsSql = `
        CREATE TABLE IF NOT EXISTS notifications (
          id VARCHAR(36) PRIMARY KEY,
          userId VARCHAR(36) NOT NULL,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
          priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
          status VARCHAR(20) NOT NULL DEFAULT 'UNREAD',
          createdAt VARCHAR(50) NOT NULL,
          readAt VARCHAR(50),
          link VARCHAR(255),
          INDEX idx_notif_user (userId),
          INDEX idx_notif_status (status),
          INDEX idx_notif_created (createdAt)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(notificationsSql);

      // Ensure documents and document_versions tables exist
      logger.info('Database: Ensuring documents and document_versions tables exist...');
      const documentsSql = `
        CREATE TABLE IF NOT EXISTS documents (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(50) NOT NULL,
          associatedId VARCHAR(50),
          ownerId VARCHAR(36) NOT NULL,
          securityLevel VARCHAR(20) DEFAULT 'STANDARD',
          status VARCHAR(20) DEFAULT 'ACTIVE',
          createdAt VARCHAR(50) NOT NULL,
          updatedAt VARCHAR(50) NOT NULL,
          INDEX idx_doc_category (category),
          INDEX idx_doc_assoc (associatedId),
          INDEX idx_doc_owner (ownerId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(documentsSql);

      const documentVersionsSql = `
        CREATE TABLE IF NOT EXISTS document_versions (
          id VARCHAR(36) PRIMARY KEY,
          documentId VARCHAR(36) NOT NULL,
          versionNumber INT NOT NULL,
          originalName VARCHAR(255) NOT NULL,
          fileSize INT NOT NULL,
          mimeType VARCHAR(100) NOT NULL,
          fileContent LONGTEXT NOT NULL,
          uploadedBy VARCHAR(36) NOT NULL,
          uploadedAt VARCHAR(50) NOT NULL,
          changeSummary TEXT,
          INDEX idx_doc_ver_doc (documentId),
          FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(documentVersionsSql);

      // Ensure audit_logs table exists
      logger.info('Database: Ensuring audit_logs table exists...');
      const auditLogsSql = `
        CREATE TABLE IF NOT EXISTS audit_logs (
          id VARCHAR(36) PRIMARY KEY,
          timestamp VARCHAR(50) NOT NULL,
          userId VARCHAR(36) NOT NULL,
          userName VARCHAR(255) NOT NULL,
          userRole VARCHAR(50) NOT NULL,
          action VARCHAR(100) NOT NULL,
          previousValue TEXT,
          newValue TEXT,
          remarks TEXT,
          ipAddress VARCHAR(45),
          userAgent VARCHAR(255),
          INDEX idx_audit_user (userId),
          INDEX idx_audit_timestamp (timestamp),
          INDEX idx_audit_action (action),
          INDEX idx_audit_ip (ipAddress)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await this.pool.query(auditLogsSql);

      // Seed initial service requests if empty
      const [srvReqRows]: any = await this.pool.query('SELECT COUNT(*) as count FROM service_requests');
      if (srvReqRows && srvReqRows[0] && srvReqRows[0].count === 0) {
        logger.info('Database: Seeding default service requests...');
        const initSrvReqs = [
          {
            id: 'sreq-1',
            ticketNumber: 'AVN-RPR-2026-101',
            instrumentId: 'inst-pcr-1',
            instrumentName: 'Real-Time PCR Thermal Cycler',
            serialNumber: 'QS5-994120-LK',
            customerId: 'cust-1',
            customerName: 'Asiri Surgical Hospital',
            subject: 'Optical sensor calibration error on startup',
            description: 'The instrument displays error code ERR-OPT-402 during initial optical diagnostic self-test. High noise floor detected.',
            priority: 'HIGH',
            status: 'RECEIVED',
            createdAt: '2026-07-10T09:00:00Z',
            updatedAt: '2026-07-10T09:00:00Z',
            slaDueDate: '2026-07-13T09:00:00Z',
            slaDaysSetting: 3,
            slaStatus: 'IN_COMPLIANCE'
          },
          {
            id: 'sreq-2',
            ticketNumber: 'AVN-CAL-2026-202',
            instrumentId: 'inst-chem-1',
            instrumentName: 'Automated Chemistry Analyzer',
            serialNumber: 'AGL-3500-8812',
            customerId: 'cust-2',
            customerName: 'Lanka Hospitals Diagnostics',
            subject: 'Routine Metrology Calibration requested',
            description: 'Annual ISO 17025 certified calibration is due for the UV-Vis optics path and temperature block.',
            priority: 'MEDIUM',
            status: 'RECEIVED',
            createdAt: '2026-07-12T11:30:00Z',
            updatedAt: '2026-07-12T11:30:00Z',
            slaDueDate: '2026-07-19T11:30:00Z',
            slaDaysSetting: 7,
            slaStatus: 'IN_COMPLIANCE'
          }
        ];

        for (const req of initSrvReqs) {
          await this.pool.query(
            `INSERT INTO service_requests (
              id, ticketNumber, instrumentId, instrumentName, serialNumber, customerId, customerName,
              subject, description, priority, status, createdAt, updatedAt, slaDueDate, slaDaysSetting, slaStatus
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              req.id, req.ticketNumber, req.instrumentId, req.instrumentName, req.serialNumber, req.customerId, req.customerName,
              req.subject, req.description, req.priority, req.status, req.createdAt, req.updatedAt, req.slaDueDate, req.slaDaysSetting, req.slaStatus
            ]
          );
        }
      }

      // Seed initial installation requests if empty
      const [reqRows]: any = await this.pool.query('SELECT COUNT(*) as count FROM installation_requests');
      if (reqRows && reqRows[0] && reqRows[0].count === 0) {
        logger.info('Database: Seeding default installation requests...');
        const initReqs = [
          {
            id: 'ireq-1',
            invoiceNumber: 'INV-2026-8801',
            invoiceValue: 4500000.00,
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
            invoiceValue: 12800000.00,
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
            invoiceValue: 8900000.00,
            customerName: 'Durdans Hospital',
            departmentName: 'Hematology & Coagulation',
            endUserName: 'Dr. Nilmini Weerasinghe',
            instrumentName: 'High-Performance Liquid Chromatograph',
            brand: 'SHIMADZU',
            model: 'Prominence-i LC-2030C',
            serialNumber: 'SHM-2030C-4419',
            deliveryDate: '2026-06-15',
            warrantyPeriod: 12,
            warrantyUnit: 'Months',
            remarks: 'Pre-site inspection completed. Argon gas cylinders ready.',
            status: 'Assigned',
            createdAt: '2026-06-15T11:40:00Z',
            updatedAt: '2026-06-15T11:40:00Z'
          }
        ];

        for (const req of initReqs) {
          await this.pool.query(
            `INSERT INTO installation_requests (
              id, invoiceNumber, invoiceValue, customerName, departmentName, endUserName,
              instrumentName, brand, model, serialNumber, deliveryDate, warrantyPeriod,
              warrantyUnit, remarks, status, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              req.id, req.invoiceNumber, req.invoiceValue, req.customerName, req.departmentName, req.endUserName,
              req.instrumentName, req.brand, req.model, req.serialNumber, req.deliveryDate, req.warrantyPeriod,
              req.warrantyUnit, req.remarks, req.status, req.createdAt, req.updatedAt
            ]
          );
        }
      }

      // Seed lookup_data if empty
      const [lookupRows]: any = await this.pool.query('SELECT COUNT(*) as count FROM lookup_data');
      if (lookupRows && lookupRows[0] && lookupRows[0].count === 0) {
        logger.info('Database: Seeding default lookup data...');
        const nowStr = new Date().toISOString();
        const lookups = [
          // job_type
          { id: 'l1', type: 'job_type', code: 'INSTALLATION', value: 'Installation', sortOrder: 1 },
          { id: 'l2', type: 'job_type', code: 'PREVENTIVE_MAINTENANCE', value: 'Preventive Maintenance', sortOrder: 2 },
          { id: 'l3', type: 'job_type', code: 'CORRECTIVE_REPAIR', value: 'Corrective Repair', sortOrder: 3 },
          { id: 'l4', type: 'job_type', code: 'CALIBRATION', value: 'Calibration', sortOrder: 4 },
          // priority
          { id: 'l5', type: 'priority', code: 'LOW', value: 'Low', sortOrder: 1 },
          { id: 'l6', type: 'priority', code: 'MEDIUM', value: 'Medium', sortOrder: 2 },
          { id: 'l7', type: 'priority', code: 'HIGH', value: 'High', sortOrder: 3 },
          { id: 'l8', type: 'priority', code: 'EMERGENCY', value: 'Emergency / Critical', sortOrder: 4 },
          // repair_status
          { id: 'l9', type: 'repair_status', code: 'PENDING', value: 'Pending Assignment', sortOrder: 1 },
          { id: 'l10', type: 'repair_status', code: 'ASSIGNED', value: 'Assigned / In-Progress', sortOrder: 2 },
          { id: 'l11', type: 'repair_status', code: 'WORKSHOP_REPAIR', value: 'Transferred to Workshop', sortOrder: 3 },
          { id: 'l12', type: 'repair_status', code: 'COMPLETED', value: 'Completed', sortOrder: 4 },
          { id: 'l13', type: 'repair_status', code: 'CLOSED', value: 'Closed', sortOrder: 5 }
        ];
        for (const l of lookups) {
          await this.pool.query(
            'INSERT INTO lookup_data (id, type, code, value, isActive, sortOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [l.id, l.type, l.code, l.value, 1, l.sortOrder, nowStr]
          );
        }
      }
    } catch (error) {
      logger.error(`Database: Failed to ensure refresh_tokens/RBAC schema. Error: ${(error as Error).message}`);
    }
  }

  async getConnection(): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Database pool has not been initialized or connection is inactive.');
    }
    
    if (this.isMock) {
      return {
        query: async (sql: string, params?: any[]) => {
          return executeMockQuery(sql, params);
        },
        beginTransaction: async () => {},
        commit: async () => {},
        rollback: async () => {},
        release: () => {},
      };
    }

    const connection = await this.pool!.getConnection();
    
    // Return wrapped connection interface mapped to what the app expects
    return {
      query: async (sql: string, params?: any[]) => {
        validateSqlParameters(sql, params);
        const [rows] = await connection.query(sql, params);
        return rows;
      },
      beginTransaction: async () => {
        await connection.beginTransaction();
      },
      commit: async () => {
        await connection.commit();
      },
      rollback: async () => {
        await connection.rollback();
      },
      release: () => {
        connection.release();
      },
    };
  }

  async query(sql: string, params?: any[]): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Database pool has not been initialized or connection is inactive.');
    }
    validateSqlParameters(sql, params);
    if (this.isMock) {
      return executeMockQuery(sql, params);
    }
    const [rows] = await this.pool!.query(sql, params);
    return rows;
  }

  async testConnection(): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }
    if (this.isMock) {
      return true;
    }
    try {
      await this.validateConnection();
      return true;
    } catch (error) {
      logger.error(`Database connection test failed: ${(error as Error).message}`);
      return false;
    }
  }

  async end(): Promise<void> {
    if (this.pool) {
      logger.info('Database: Terminating connection pool...');
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
      logger.info('Database: Connection pool terminated successfully.');
    } else {
      this.isConnected = false;
    }
  }
}

export const dbPool = new UnifiedDatabasePool();
export default dbPool;
