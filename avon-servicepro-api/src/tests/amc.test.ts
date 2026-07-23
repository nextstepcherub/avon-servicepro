import { amcService } from '../services/amc.service';
import { amcRepository, AmcContract } from '../repositories/amc.repository';
import { dbPool } from '../config/database';

const tests: { name: string; fn: () => void | Promise<void> }[] = [];

function it(name: string, fn: () => void | Promise<void>) {
  tests.push({ name, fn });
}

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

it('should initialize database for tests', async () => {
  await dbPool.initialize();
  assert(true, 'Database initialized successfully');
});

it('should create and fetch an AMC Contract with covered assets', async () => {
  const contractInput: Omit<AmcContract, 'id'> = {
    contractNumber: 'AMC/TEST/2026/001',
    customerId: 'cust-1',
    customerName: 'Asiri Surgical Hospital',
    startDate: '2026-07-16',
    endDate: '2027-07-16',
    pmInterval: '6 Months',
    status: 'Active',
    price: 300000.00,
    slaTier: 'Gold',
    amcType: 'Standard',
    coveredAssetIds: ['ast-1', 'ast-2'],
    escalationRate: 12.0,
    uptimeGuarantee: 98.0,
    responseTimeHours: 12.0,
    notes: 'Initial test contract notes.'
  };

  const created = await amcService.createContract(
    contractInput,
    'usr-admin-1',
    'Admin User',
    'Admin'
  );

  assert(created.id !== undefined, 'Contract should have a generated UUID ID');
  assert(created.contractNumber === 'AMC/TEST/2026/001', 'Contract number should match');
  assert(created.price === 300000.00, 'Price should match');
  assert(created.coveredAssetIds?.length === 2, 'Should cover 2 assets');

  const fetched = await amcService.getContractById(created.id);
  assert(fetched !== null, 'Should be able to fetch the contract');
  assert(fetched.customerId === 'cust-1', 'Fetched customer ID should match');
});

it('should update an AMC Contract', async () => {
  const all = await amcService.getAllContracts();
  const target = all.data[0];

  assert(target !== undefined, 'Target contract must exist');

  const updated = await amcService.updateContract(
    target.id,
    { price: 350000.00, slaTier: 'Platinum' },
    'usr-admin-1',
    'Admin User',
    'Admin'
  );

  assert(updated.price === 350000.00, 'Price should be updated to 350000');
  assert(updated.slaTier === 'Platinum', 'SLA Tier should be updated to Platinum');
});

it('should renew an AMC Contract with escalation calculations', async () => {
  const all = await amcService.getAllContracts();
  const target = all.data[0];

  assert(target !== undefined, 'Target contract must exist');

  // Our test contract has escalationRate: 12.0 and price: 350000.00
  // Escalated price should be 350000 * 1.12 = 392000
  const renewed = await amcService.renewContract(
    target.id,
    'usr-admin-1',
    'Admin User',
    'Admin'
  );

  assert(renewed.price === 392000, `Expected price 392000, got ${renewed.price}`);
  assert(renewed.status === 'Active', 'Status should be active after renewal');
  assert(renewed.lastRenewedDate !== undefined, 'Renewal date should be recorded');
  assert(renewed.endDate === '2028-07-17', `Expected end date 2028-07-17, got ${renewed.endDate}`);
});

it('should calculate live SLA compliance telemetry', async () => {
  const telemetry = await amcService.getSlaComplianceStats();

  assert(telemetry.activeContractsCount > 0, 'Active contracts count should be > 0');
  assert(telemetry.overallComplianceRate !== undefined, 'Compliance rate should be calculated');
  assert(telemetry.breakdown.length > 0, 'Breakdown of contracts should be present');
});

it('should delete an AMC Contract', async () => {
  const all = await amcService.getAllContracts();
  const target = all.data[0];

  assert(target !== undefined, 'Target contract must exist');

  const success = await amcService.deleteContract(
    target.id,
    'usr-admin-1',
    'Admin User',
    'Admin'
  );

  assert(success === true, 'Deletion should return success true');

  const allAfter = await amcService.getAllContracts();
  assert(allAfter.total === 0, 'Contracts count should be 0 after deletion');
});

// Run all test cases
async function runAllTests() {
  console.log('=============================================');
  console.log('Avon ServicePro - Running AMC Module Tests');
  console.log('=============================================');

  let passedCount = 0;
  let failedCount = 0;

  for (const test of tests) {
    try {
      await test.fn();
      console.log(`✅ PASSED: ${test.name}`);
      passedCount++;
    } catch (error: any) {
      console.error(`❌ FAILED: ${test.name}`);
      console.error(`   Error: ${error.message}`);
      console.error(error.stack);
      failedCount++;
    }
  }

  console.log('---------------------------------------------');
  console.log(`Test Execution Summary: ${passedCount} passed, ${failedCount} failed`);
  console.log('=============================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

// Check if running directly
if (require.main === module) {
  runAllTests();
}

export { runAllTests };
