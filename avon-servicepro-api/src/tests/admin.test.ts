import { createUserSchema, updateUserSchema, createPermissionSchema, rolePermissionSchema } from '../validators/admin.validator';
import { adminService } from '../services/admin.service';

// Simple lightweight test runner structure
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
it('should validate user creation payloads correctly with createUserSchema', async () => {
  const validPayload = {
    body: {
      email: 'test.user@avon-servicepro.com',
      name: 'Test Administrator',
      role: 'System Admin',
      passwordPlain: 'supersecretpassword123',
      tags: ['Admin', 'HQ'],
    }
  };

  const parsed = await createUserSchema.parseAsync(validPayload);
  assert(parsed.body.email === 'test.user@avon-servicepro.com', 'Valid email should be parsed');
  assert(parsed.body.passwordPlain === 'supersecretpassword123', 'Valid password should be parsed');

  // Test invalid payload (short password)
  const invalidPayload = {
    body: {
      email: 'test.user@avon-servicepro.com',
      name: 'Test Administrator',
      role: 'System Admin',
      passwordPlain: 'short', // invalid < 6 characters
    }
  };

  try {
    await createUserSchema.parseAsync(invalidPayload);
    assert(false, 'Should have failed on short password');
  } catch (err: any) {
    assert(err.issues !== undefined, 'Should throw a ZodError with issues');
  }
});

it('should validate user update payloads correctly with updateUserSchema', async () => {
  const partialPayload = {
    body: {
      role: 'Service Manager',
      territory: 'APAC Region',
    }
  };

  const parsed = await updateUserSchema.parseAsync(partialPayload);
  assert(parsed.body.role === 'Service Manager', 'Partial role update should be valid');
  assert(parsed.body.territory === 'APAC Region', 'Partial territory update should be valid');
});

it('should validate permission codes with createPermissionSchema', async () => {
  const validPermission = {
    body: {
      code: 'jobs:approve-workflow',
      description: 'Ability to approve service job workflows'
    }
  };

  const parsed = await createPermissionSchema.parseAsync(validPermission);
  assert(parsed.body.code === 'jobs:approve-workflow', 'Alphanumeric and colon permission code should pass');

  const invalidPermission = {
    body: {
      code: 'jobs/approve/workflow!', // forbidden symbols
    }
  };

  try {
    await createPermissionSchema.parseAsync(invalidPermission);
    assert(false, 'Should have failed on forbidden symbols in code');
  } catch (err: any) {
    assert(err.issues !== undefined, 'Zod should reject special characters in permission code');
  }
});

it('should validate role-permission mappings with rolePermissionSchema', async () => {
  const mapping = {
    body: {
      roleName: 'Documentation Officer',
      permissionCode: 'customers:create'
    }
  };

  const parsed = await rolePermissionSchema.parseAsync(mapping);
  assert(parsed.body.roleName === 'Documentation Officer', 'Role mapping roleName should parse');
  assert(parsed.body.permissionCode === 'customers:create', 'Role mapping permissionCode should parse');
});

// 2. Business Logic Unit Tests
// (Removed legacy legacy local bcrypt tests)

// Run all test cases
async function runAllTests() {
  console.log('=============================================');
  console.log('Avon ServicePro - Running Admin Backend Tests');
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
if (require.main === module) {
  runAllTests();
}

export { runAllTests };
