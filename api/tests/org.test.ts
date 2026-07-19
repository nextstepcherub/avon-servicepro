import { createOrgUnitSchema, updateOrgUnitSchema } from '../validators/org.validator';
import { orgService } from '../services/org.service';
import { orgRepository } from '../repositories/org.repository';
import { userRepository } from '../repositories/user.repository';

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
it('should validate org unit creation with valid COMPANY payload', async () => {
  const validPayload = {
    body: {
      name: 'Avon Global Headquarters',
      code: 'AVON_HQ',
      type: 'COMPANY',
    }
  };

  const parsed = await createOrgUnitSchema.parseAsync(validPayload);
  assert(parsed.body.name === 'Avon Global Headquarters', 'Name should match');
  assert(parsed.body.code === 'AVON_HQ', 'Code should match');
  assert(parsed.body.type === 'COMPANY', 'Type should match');
});

it('should validate and fail org unit creation if code has invalid characters', async () => {
  const invalidPayload = {
    body: {
      name: 'Avon Branch Singapore',
      code: 'AVON/SG!', // Invalid characters
      type: 'BRANCH',
    }
  };

  try {
    await createOrgUnitSchema.parseAsync(invalidPayload);
    assert(false, 'Should have failed on invalid characters in code');
  } catch (err: any) {
    assert(err.issues !== undefined, 'Zod should throw validation issues for bad code characters');
  }
});

it('should validate and fail org unit creation if type is invalid', async () => {
  const invalidPayload = {
    body: {
      name: 'Sales Department',
      code: 'SG_SALES',
      type: 'INVALID_TYPE', // Invalid enum value
    }
  };

  try {
    await createOrgUnitSchema.parseAsync(invalidPayload);
    assert(false, 'Should have failed on invalid enum type');
  } catch (err: any) {
    assert(err.issues !== undefined, 'Zod should reject non-enum values for type');
  }
});

// 2. Business Logic Unit Tests using Mocking
it('should enforce strict hierarchical validation rules using mock repositories', async () => {
  // Save original methods
  const originalFindById = orgRepository.findById;
  const originalFindByCode = orgRepository.findByCode;
  const originalHasChildren = orgRepository.hasChildren;
  const originalUserFindById = userRepository.findById;

  try {
    // Mock repositories to return controlled objects
    orgRepository.findById = async (id: string) => {
      if (id === 'parent_ Singapore_Branch') {
        return { id: 'parent_Singapore_Branch', name: 'Singapore Branch', code: 'SG_BRANCH', type: 'BRANCH' };
      }
      if (id === 'parent_Singapore_Company') {
        return { id: 'parent_Singapore_Company', name: 'Singapore Corporate', code: 'SG_CORP', type: 'COMPANY' };
      }
      return null;
    };

    orgRepository.findByCode = async () => null;

    // Test: A BRANCH parent unit must be of type COMPANY
    try {
      await orgService.createOrgUnit({
        name: 'SG Sub-Branch',
        code: 'SG_SUB_BRANCH',
        type: 'BRANCH',
        parentId: 'parent_ Singapore_Branch', // Parent is a BRANCH, which violates rule
      });
      assert(false, 'Should have failed since a branch cannot belong to another branch');
    } catch (error: any) {
      assert(error.message.includes('BRANCH parent unit must be of type COMPANY'), 'Expected specific hierarchy validation error');
    }

    // Test: A DEPARTMENT parent unit can be a COMPANY or BRANCH
    // This should pass structural validation (it will call repository create, which we can mock)
    let created: any = false;
    orgRepository.create = async (entity: any) => {
      created = true;
      return { id: 'new_dept_id', ...entity };
    };

    await orgService.createOrgUnit({
      name: 'Singapore IT Department',
      code: 'SG_IT_DEPT',
      type: 'DEPARTMENT',
      parentId: 'parent_ Singapore_Branch', // Parent is a BRANCH, which is valid for DEPARTMENT
    });

    assert(created === true, 'Should successfully validate and create department under branch');

  } finally {
    // Restore original methods
    orgRepository.findById = originalFindById;
    orgRepository.findByCode = originalFindByCode;
    orgRepository.hasChildren = originalHasChildren;
    userRepository.findById = originalUserFindById;
  }
});

it('should prevent circular reference in parent hierarchy chains', async () => {
  const originalFindById = orgRepository.findById;

  try {
    // Mock a hierarchy loop: unit1's parent is unit2, unit2's parent is unit1
    orgRepository.findById = async (id: string) => {
      if (id === 'unit1') {
        return { id: 'unit1', name: 'Singapore HQ', code: 'SG_HQ', type: 'DEPARTMENT', parentId: 'unit2' };
      }
      if (id === 'unit2') {
        return { id: 'unit2', name: 'Singapore Sub-unit', code: 'SG_SUB', type: 'DEPARTMENT', parentId: 'unit1' };
      }
      return null;
    };

    // Attempting to set parent of unit1 to unit2 should detect circular loop
    try {
      await orgService.updateOrgUnit('unit1', {
        parentId: 'unit2',
      });
      assert(false, 'Should have failed on circular reference validation');
    } catch (error: any) {
      assert(error.message.includes('Circular reference detected'), 'Expected circular reference validation error');
    }

  } finally {
    orgRepository.findById = originalFindById;
  }
});

it('should prevent deletion of organizational units that have child units', async () => {
  const originalFindById = orgRepository.findById;
  const originalHasChildren = orgRepository.hasChildren;

  try {
    orgRepository.findById = async (id: string) => {
      return { id, name: 'SG Main Branch', code: 'SG_MAIN', type: 'BRANCH' };
    };

    orgRepository.hasChildren = async (id: string) => {
      return id === 'sg_main_branch'; // true for sg_main_branch
    };

    try {
      await orgService.deleteOrgUnit('sg_main_branch');
      assert(false, 'Should have failed to delete branch with sub-units');
    } catch (error: any) {
      assert(error.message.includes('has dependent sub-units'), 'Expected dependent sub-units deletion error');
    }

  } finally {
    orgRepository.findById = originalFindById;
    orgRepository.hasChildren = originalHasChildren;
  }
});

// Run all test cases
async function runAllTests() {
  console.log('=============================================');
  console.log('Avon ServicePro - Running Org Module Tests  ');
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
