import { assetService } from '../services/asset.service';
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

it('should initialize database for asset tests', async () => {
  await dbPool.initialize();
  assert(true, 'Database initialized successfully');
});

it('should register and retrieve a new instrument asset', async () => {
  const serialNumber = `SN-TST-${Date.now()}`;
  const asset = await assetService.registerAsset(
    {
      assetNumber: `AST-${Date.now()}`,
      serialNumber,
      brand: 'Avon Tech',
      model: 'MRI Pro 3000',
      description: 'High resolution MRI scanner',
      warrantyPeriodMonths: 24,
      installationDate: '2026-01-15',
      customerName: 'Asiri Surgical Hospital',
      department: 'Radiology Dept',
      amcStatus: 'Covered',
    },
    'usr-admin-1',
    'Admin User',
    'System Admin'
  );

  assert(asset.id !== undefined, 'Asset ID should be defined');
  assert(asset.serialNumber === serialNumber, 'Serial number should match');

  const fetched = await assetService.getAsset(asset.id);
  assert(fetched.model === 'MRI Pro 3000', 'Fetched asset model should match');
});

it('should prevent duplicate serial number registration', async () => {
  const serialNumber = `SN-DUP-${Date.now()}`;
  await assetService.registerAsset(
    {
      assetNumber: `AST-DUP1-${Date.now()}`,
      serialNumber,
      brand: 'Avon Tech',
      model: 'CT Scanner v2',
      description: 'Medical CT Scanner',
      warrantyPeriodMonths: 12,
      installationDate: '2026-02-01',
      customerName: 'Asiri Surgical Hospital',
      department: 'Emergency',
      amcStatus: 'Covered',
    },
    'usr-admin-1',
    'Admin User',
    'System Admin'
  );

  try {
    await assetService.registerAsset(
      {
        assetNumber: `AST-DUP2-${Date.now()}`,
        serialNumber,
        brand: 'Avon Tech',
        model: 'CT Scanner v2',
        description: 'Medical CT Scanner',
        warrantyPeriodMonths: 12,
        installationDate: '2026-02-01',
        customerName: 'Asiri Surgical Hospital',
        department: 'Emergency',
        amcStatus: 'Covered',
      },
      'usr-admin-1',
      'Admin User',
      'System Admin'
    );
    assert(false, 'Should have thrown error on duplicate serial number');
  } catch (err: any) {
    assert(err instanceof BadRequestError, 'Error should be a BadRequestError');
  }
});

it('should update asset specifications', async () => {
  const serialNumber = `SN-UPD-${Date.now()}`;
  const asset = await assetService.registerAsset(
    {
      assetNumber: `AST-UPD-${Date.now()}`,
      serialNumber,
      brand: 'Avon Tech',
      model: 'Ultrasound HD',
      description: 'Portable Diagnostic Ultrasound',
      warrantyPeriodMonths: 12,
      installationDate: '2026-03-01',
      customerName: 'Asiri Surgical Hospital',
      department: 'OPD 2',
      amcStatus: 'Covered',
    },
    'usr-admin-1',
    'Admin User',
    'System Admin'
  );

  const updated = await assetService.updateAsset(
    asset.id,
    { description: 'Updated Portable Diagnostic Ultrasound System' },
    'usr-admin-1',
    'Admin User',
    'System Admin'
  );

  assert(updated.description === 'Updated Portable Diagnostic Ultrasound System', 'Description should be updated');
});

it('should throw NotFoundError for invalid asset ID', async () => {
  try {
    await assetService.getAsset('non-existent-asset-id');
    assert(false, 'Should throw NotFoundError');
  } catch (err: any) {
    assert(err instanceof NotFoundError, 'Should throw NotFoundError');
  }
});

async function runAllTests() {
  console.log('=============================================');
  console.log('Avon ServicePro - Running Asset Module Tests');
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
