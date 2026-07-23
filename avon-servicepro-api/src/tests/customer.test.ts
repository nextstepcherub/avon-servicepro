import { customerService } from '../services/customer.service';
import { dbPool } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/apiError';

const tests: { name: string; fn: () => void | Promise<void> }[] = [];

function it(name: string, fn: () => void | Promise<void>) {
  tests.push({ name, fn });
}

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

it('should initialize database for customer tests', async () => {
  await dbPool.initialize();
  assert(true, 'Database initialized successfully');
});

it('should create and retrieve customer profile', async () => {
  const customerName = `Test Hospital ${Date.now()}`;
  const created = await customerService.createCustomer(
    {
      name: customerName,
      departments: JSON.stringify(['Radiology', 'Laboratory', 'Cardiology']),
      endUsers: JSON.stringify(['Dr. John Smith', 'Nurse Mary']),
      activeContracts: 1,
      contracts: JSON.stringify(['Gold SLA 2026']),
    },
    'usr-admin-1',
    'Admin User',
    'System Admin'
  );

  assert(created.id !== undefined, 'Customer ID should be generated');
  assert(created.name === customerName, 'Customer name should match');
  assert(created.feedbackNpsAverage === 10.0, 'Baseline NPS should be 10.0');

  const fetched = await customerService.getCustomerProfile(created.id);
  assert(fetched.name === customerName, 'Fetched customer name should match');
});

it('should throw BadRequestError when creating duplicate customer name', async () => {
  const customerName = `Duplicate Hospital ${Date.now()}`;
  await customerService.createCustomer(
    {
      name: customerName,
      departments: JSON.stringify(['Emergency']),
      endUsers: JSON.stringify(['Dr. Jane Doe']),
      activeContracts: 0,
      contracts: JSON.stringify([]),
    },
    'usr-admin-1',
    'Admin User',
    'System Admin'
  );

  try {
    await customerService.createCustomer(
      {
        name: customerName,
        departments: JSON.stringify(['Emergency']),
        endUsers: JSON.stringify(['Dr. Jane Doe']),
        activeContracts: 0,
        contracts: JSON.stringify([]),
      },
      'usr-admin-1',
      'Admin User',
      'System Admin'
    );
    assert(false, 'Should have thrown error on duplicate customer name');
  } catch (err: any) {
    assert(err instanceof BadRequestError, 'Error should be an instance of BadRequestError');
  }
});

it('should throw NotFoundError for non-existent customer ID', async () => {
  try {
    await customerService.getCustomerProfile('non-existent-id-999');
    assert(false, 'Should have thrown NotFoundError');
  } catch (err: any) {
    assert(err instanceof NotFoundError, 'Error should be an instance of NotFoundError');
  }
});

async function runAllTests() {
  console.log('=============================================');
  console.log('Avon ServicePro - Running Customer Module Tests');
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

if (require.main === module) {
  runAllTests();
}

export { runAllTests };
