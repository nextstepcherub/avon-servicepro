import {
  updateSystemSettingSchema,
  updateConfigurationSchema,
  createVersionEntrySchema,
  createLookupItemSchema,
} from '../validators/config.validator';
import { configService } from '../services/config.service';
import {
  systemSettingsRepository,
  configurationsRepository,
  versionControlRepository,
  lookupDataRepository,
} from '../repositories/config.repository';

const tests: { name: string; fn: () => void | Promise<void> }[] = [];

function it(name: string, fn: () => void | Promise<void>) {
  tests.push({ name, fn });
}

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 1. Validation Schema Tests
it('should validate system setting updates correctly', async () => {
  const payload = {
    body: {
      key: 'system_name',
      value: 'AVON ServicePro Extreme',
      category: 'General',
    },
  };
  const parsed = await updateSystemSettingSchema.parseAsync(payload);
  assert(parsed.body.key === 'system_name', 'Key should match');
  assert(parsed.body.value === 'AVON ServicePro Extreme', 'Value should match');
  assert(parsed.body.category === 'General', 'Category should match');
});

it('should validate and fail lookup data creation with invalid code format', async () => {
  const invalidPayload = {
    body: {
      type: 'priority',
      code: 'INVALID/CODE!', // invalid chars
      value: 'Invalid Option',
    },
  };
  try {
    await createLookupItemSchema.parseAsync(invalidPayload);
    assert(false, 'Should have failed on invalid characters in lookup code');
  } catch (err: any) {
    assert(err.issues !== undefined, 'Zod should reject bad lookup codes');
  }
});

// 2. Business Logic Unit Tests with Mock Repository
it('should enforce configuration type checks on number types', async () => {
  const originalUpsert = configurationsRepository.upsert;
  try {
    configurationsRepository.upsert = async () => {
      return { id: 'test', key: 'api_timeout_ms', value: '30000', type: 'number', isEncrypted: false, updatedAt: '' };
    };

    // Valid number value - should pass
    await configService.updateConfiguration('api_timeout_ms', '30000', 'number');

    // Invalid number value - should fail
    try {
      await configService.updateConfiguration('api_timeout_ms', 'not-a-number', 'number');
      assert(false, 'Should have thrown a BadRequestError for non-numeric value');
    } catch (e: any) {
      assert(e.message.includes('requires a valid numeric value'), 'Expected numeric validation error');
    }
  } finally {
    configurationsRepository.upsert = originalUpsert;
  }
});

it('should prevent creating duplicate lookup data items under the same group type', async () => {
  const originalFindByTypeAndCode = lookupDataRepository.findByTypeAndCode;
  try {
    lookupDataRepository.findByTypeAndCode = async (type: string, code: string) => {
      if (type === 'job_type' && code === 'INSTALLATION') {
        return { id: 'l1', type: 'job_type', code: 'INSTALLATION', value: 'Installation', isActive: true, sortOrder: 0, createdAt: '' };
      }
      return null;
    };

    try {
      await configService.createLookupItem({
        type: 'job_type',
        code: 'installation', // Will be trimmed and uppercased to INSTALLATION
        value: 'New Installation Option',
      });
      assert(false, 'Should have failed on duplicate lookup type & code');
    } catch (e: any) {
      assert(e.message.includes('already exists'), 'Expected duplicate code error');
    }
  } finally {
    lookupDataRepository.findByTypeAndCode = originalFindByTypeAndCode;
  }
});

// Run all test cases
async function runAllTests() {
  console.log('=============================================');
  console.log('Avon ServicePro - Running Config Module Tests');
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

// Check if running directly
if (typeof require === 'undefined' || require.main === module) {
  runAllTests();
}

export { runAllTests };
