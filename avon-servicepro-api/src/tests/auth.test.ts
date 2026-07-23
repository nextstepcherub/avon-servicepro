import { loginSchema, updateProfileSchema } from '../validators/auth.validator';
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

it('should validate login payloads correctly with loginSchema', async () => {
  const validPayload = {
    body: {
      email: 'engineer@avon-servicepro.com',
      password: 'password123',
    },
  };

  const parsed = await loginSchema.parseAsync(validPayload);
  assert(parsed.body.email === 'engineer@avon-servicepro.com', 'Valid email should pass schema');
  assert(parsed.body.password === 'password123', 'Password should pass schema');

  const invalidEmailPayload = {
    body: {
      email: 'not-an-email',
      password: 'password123',
    },
  };

  try {
    await loginSchema.parseAsync(invalidEmailPayload);
    assert(false, 'Should have failed on invalid email format');
  } catch (err: any) {
    assert(err.issues !== undefined, 'ZodError expected for invalid email');
  }
});

it('should validate profile update payloads with updateProfileSchema', async () => {
  const validPayload = {
    body: {
      name: 'Senior Field Specialist',
      territory: 'Central Region',
    },
  };

  const parsed = await updateProfileSchema.parseAsync(validPayload);
  assert(parsed.body.name === 'Senior Field Specialist', 'Name should be parsed');
  assert(parsed.body.territory === 'Central Region', 'Territory should be parsed');
});

async function runAllTests() {
  console.log('=============================================');
  console.log('Avon ServicePro - Running Auth Module Tests');
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
