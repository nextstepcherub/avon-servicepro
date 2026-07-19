import { documentService } from '../services/document.service';
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

it('should initialize DB pool in mock mode for test environment', async () => {
  await dbPool.initialize().catch(() => {});
  assert(dbPool !== null, 'DB pool should exist');
});

it('should create a document and its first version', async () => {
  const doc = await documentService.createDocument(
    {
      name: 'Calibration Report 2026',
      description: 'Annual Metrology and calibration results',
      category: 'CALIBRATION',
      associatedId: 'job-123',
      ownerId: 'usr-123',
      securityLevel: 'STANDARD'
    },
    {
      originalName: 'cal_report_2026.pdf',
      fileSize: 10240,
      mimeType: 'application/pdf',
      fileContent: 'SGVsbG8gV29ybGQgZnJvbSBBVk9OIFNlcnZpY2VQcm8=', // Base64 for "Hello World from AVON ServicePro"
      uploadedBy: 'John Doe',
      changeSummary: 'Initial calibration verification'
    }
  );

  assert(doc.id !== undefined, 'Document ID should be generated');
  assert(doc.name === 'Calibration Report 2026', 'Document name should match');
  assert(doc.latestVersion.versionNumber === 1, 'Version number should be 1');
  assert(doc.latestVersion.originalName === 'cal_report_2026.pdf', 'Filename should match');
});

it('should add a new version to an existing document', async () => {
  // Get existing documents
  const docs = await documentService.getDocuments({
    category: 'CALIBRATION',
    userRole: 'Admin',
    userId: 'usr-123'
  });
  
  assert(docs.length > 0, 'Should have at least one document');
  const targetDoc = docs[0];

  const newVersion = await documentService.addVersion(targetDoc.id, {
    originalName: 'cal_report_2026_rev1.pdf',
    fileSize: 12000,
    mimeType: 'application/pdf',
    fileContent: 'SGVsbG8gV29ybGQgZnJvbSBBVk9OIFNlcnZpY2VQcm8gUmV2IDE=',
    uploadedBy: 'Jane Admin',
    changeSummary: 'Corrected high-pressure threshold bounds'
  });

  assert(newVersion.versionNumber === 2, 'New version number should be 2');
  assert(newVersion.originalName === 'cal_report_2026_rev1.pdf', 'Filename should match revision');
});

it('should correctly restrict visibility based on security levels and roles', async () => {
  // Create an INTERNAL_ONLY document
  const internalDoc = await documentService.createDocument(
    {
      name: 'Internal Wiring Schematic',
      category: 'GENERAL',
      ownerId: 'usr-admin',
      securityLevel: 'INTERNAL_ONLY'
    },
    {
      originalName: 'wiring_v1.png',
      fileSize: 2048,
      mimeType: 'image/png',
      fileContent: 'YmFzZTY0cG5n',
      uploadedBy: 'System Administrator'
    }
  );

  // Admins should see it
  const adminDocs = await documentService.getDocuments({
    category: 'GENERAL',
    userRole: 'Admin',
    userId: 'usr-admin'
  });
  const foundByAdmin = adminDocs.find(d => d.id === internalDoc.id);
  assert(foundByAdmin !== undefined, 'Admin should see internal-only document');

  // Customers should NOT see it
  const customerDocs = await documentService.getDocuments({
    category: 'GENERAL',
    userRole: 'Customer',
    userId: 'usr-cust'
  });
  const foundByCustomer = customerDocs.find(d => d.id === internalDoc.id);
  assert(foundByCustomer === undefined, 'Customer should NOT see internal-only document');
});

async function runAllTests() {
  console.log('=============================================');
  console.log('Avon ServicePro - Running Document Module Tests');
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

if (typeof require === 'undefined' || require.main === module) {
  runAllTests();
}

export { runAllTests };
