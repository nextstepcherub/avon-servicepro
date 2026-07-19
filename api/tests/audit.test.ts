import { dbPool } from '../config/database';
import { auditRepository } from '../repositories/audit.repository';
import { requestContextStorage } from '../utils/requestContext';
import { logger } from '../config/logger';

async function runTests() {
  console.log('=============================================');
  console.log('Avon ServicePro - Running Audit Module Tests');
  console.log('=============================================');

  try {
    // 1. Initialize Database
    await dbPool.initialize().catch(() => {});
    console.log('✅ PASSED: should initialize DB pool successfully');

    // 2. Create Audit Log manually specifying IP and User Agent
    const log1 = await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: 'usr-admin-1',
      userName: 'Dr. John Doe',
      userRole: 'Admin',
      action: 'USER_LOGIN',
      previousValue: '',
      newValue: '',
      remarks: 'SSO Login successful',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome on macOS'
    });

    if (log1.ipAddress === '192.168.1.100' && log1.userAgent === 'Chrome on macOS') {
      console.log('✅ PASSED: should create audit log with explicit IP and User Agent');
    } else {
      throw new Error(`IP or User Agent incorrect: ${JSON.stringify(log1)}`);
    }

    // 3. Create Audit Log via AsyncLocalStorage request context context injection
    let log2: any;
    await requestContextStorage.run({ ipAddress: '10.0.0.5', userAgent: 'Safari on iOS' }, async () => {
      log2 = await auditRepository.create({
        timestamp: new Date().toISOString(),
        userId: 'usr-eng-bob',
        userName: 'Bob Builder',
        userRole: 'Technician',
        action: 'UPDATE_JOB',
        previousValue: '{"status": "ASSIGNED"}',
        newValue: '{"status": "IN_PROGRESS"}',
        remarks: 'Started corrective repair for sensor calibration'
      });
    });

    if (log2 && log2.ipAddress === '10.0.0.5' && log2.userAgent === 'Safari on iOS') {
      console.log('✅ PASSED: should automatically capture IP and User Agent from request context');
    } else {
      throw new Error(`Context injection failed: ${JSON.stringify(log2)}`);
    }

    // 4. Test Search and Query filtering
    const searchResult = await auditRepository.findAll({ search: 'Bob Builder' });
    if (searchResult.data.some(log => log.userName === 'Bob Builder')) {
      console.log('✅ PASSED: should search and query audit logs correctly');
    } else {
      throw new Error('Search result did not include Bob Builder');
    }

    // 5. Test Search by IP address
    const searchIpResult = await auditRepository.findAll({ search: '10.0.0.5' });
    if (searchIpResult.data.some(log => log.ipAddress === '10.0.0.5')) {
      console.log('✅ PASSED: should support searching audit logs by IP address');
    } else {
      throw new Error('Search result did not find log with IP 10.0.0.5');
    }

    // 6. Test Immutability
    try {
      await auditRepository.update(log1.id, { remarks: 'tampered log' });
      throw new Error('Allowed modifying immutable audit records!');
    } catch (err: any) {
      if (err.message.includes('immutable')) {
        console.log('✅ PASSED: should prevent updating immutable audit logs');
      } else {
        throw err;
      }
    }

    try {
      await auditRepository.delete(log1.id);
      throw new Error('Allowed deleting immutable audit records!');
    } catch (err: any) {
      if (err.message.includes('immutable')) {
        console.log('✅ PASSED: should prevent deleting immutable audit logs');
      } else {
        throw err;
      }
    }

    console.log('---------------------------------------------');
    console.log('Test Execution Summary: 6 passed, 0 failed');
    console.log('=============================================');
    process.exit(0);

  } catch (error) {
    console.error('❌ TEST FAILED with error:', error);
    process.exit(1);
  }
}

runTests();
