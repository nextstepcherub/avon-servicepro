import { dbPool } from '../config/database';
import { installationService } from '../services/installation.service';
import { installationRequestRepository } from '../repositories/installationRequest.repository';
import { installationAssignmentRepository } from '../repositories/installationAssignment.repository';
import { installationRepository } from '../repositories/installation.repository';
import { assetRepository } from '../repositories/asset.repository';
import { jobRepository } from '../repositories/job.repository';

const tests: { name: string; fn: () => void | Promise<void> }[] = [];

function it(name: string, fn: () => void | Promise<void>) {
  tests.push({ name, fn });
}

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 1. Core Service Integration Tests
it('should perform the complete installation workflow, assign engineers, advance state, and update warranties', async () => {
  const actorId = 'usr-admin-1';
  const actorName = 'Test Administrator';
  const actorRole = 'Admin';

  const serialNumber = 'QS5-TEST-999';

  // Cleanup any old records if they exist from previous test runs
  const oldReq = await installationRequestRepository.findBySerialNumber(serialNumber);
  if (oldReq) {
    await dbPool.query('DELETE FROM installation_assignment_audit_logs WHERE requestId = ?', [oldReq.id]);
    await dbPool.query('DELETE FROM installation_assignments WHERE requestId = ?', [oldReq.id]);
    await dbPool.query('DELETE FROM installation_requests WHERE id = ?', [oldReq.id]);
  }
  const oldInst = await installationRepository.findBySerialNumber(serialNumber);
  if (oldInst) {
    await dbPool.query('DELETE FROM installations WHERE id = ?', [oldInst.id]);
  }
  await dbPool.query('DELETE FROM instrument_assets WHERE serialNumber = ?', [serialNumber]);
  await dbPool.query('DELETE FROM service_jobs WHERE serialNumber = ? AND jobType = "Installation"', [serialNumber]);

  // Step A: Create an asset first in the asset database registry (since service job creation verifies asset existence!)
  const testAsset = await assetRepository.create({
    assetNumber: 'AST-TEST-999',
    serialNumber: serialNumber,
    brand: 'THERMO SCIENTIFIC',
    model: 'QuantStudio 5',
    description: 'Real-Time PCR Thermal Cycler',
    warrantyPeriodMonths: 12,
    customerName: 'Test Surgical Hospital',
    department: 'Test Molecular Diagnostics Lab',
    serviceHistoryCount: 0,
    repairHistoryCount: 0,
    totalRevenueGenerated: 0
  });
  assert(testAsset.id !== undefined, 'Asset should be successfully registered');

  // Step B: Create an installation request
  const request = await installationService.createRequest(
    {
      invoiceNumber: 'INV-TEST-8801',
      invoiceValue: 500000.00,
      customerName: 'Test Surgical Hospital',
      departmentName: 'Test Molecular Diagnostics Lab',
      endUserName: 'Dr. Test Head',
      instrumentName: 'Real-Time PCR Thermal Cycler',
      brand: 'THERMO SCIENTIFIC',
      model: 'QuantStudio 5',
      serialNumber: serialNumber,
      deliveryDate: '2026-07-01',
      warrantyPeriod: 24,
      warrantyUnit: 'Months',
      remarks: 'Test request'
    },
    actorId,
    actorName,
    actorRole
  );

  assert(request.id !== undefined, 'Request should be created with an ID');
  assert(request.status === 'Pending Assignment', 'Initial status should be Pending Assignment');

  // Step C: Assign engineer and technicians
  const assignment = await installationService.assignInstallation(
    request.id,
    {
      assignedEngineer: 'Lead Engineer Alice',
      assignedTechnicians: JSON.stringify(['Tech Bob', 'Tech Charlie']),
      assignmentDate: '2026-07-02',
      targetInstallationDate: '2026-07-15',
      priority: 'High',
      slaDaysSetting: 15,
      slaDueDate: '2026-07-17',
      installationTerritory: 'Western',
      remarks: 'Assigning team for PCR unboxing'
    },
    actorId,
    actorName,
    actorRole
  );

  assert(assignment.id !== undefined, 'Assignment should be successfully stored');
  assert(assignment.assignedEngineer === 'Lead Engineer Alice', 'Engineer name should match');

  // Verify request status advanced to 'Assigned'
  const reFetchedRequest = await installationService.getRequestDetails(request.id);
  assert(reFetchedRequest.status === 'Assigned', 'Status should advance to Assigned');

  // Verify that an active service job ticket of type 'Installation' was provisioned
  const allJobs = await jobRepository.findAll({ limit: 100 });
  const associatedJob = allJobs.data.find(j => j.serialNumber === serialNumber && j.jobType === 'Installation');
  assert(associatedJob !== undefined, 'An installation service job ticket should be automatically provisioned');
  assert(associatedJob?.status === 'Assigned', 'Provisioned job status should be Assigned');

  // Verify that an active Installation tracker record was provisioned
  const tracker = await installationRepository.findBySerialNumber(serialNumber);
  assert(tracker !== null, 'An installation tracking record should be automatically provisioned');
  assert(tracker?.status === 'Assigned', 'Tracker status should be Assigned');

  // Step D: Advance Status to Scheduled
  const scheduledRequest = await installationService.advanceStatus(
    request.id,
    'Scheduled',
    'Pre-site inspection passed. Scheduled for July 15.',
    actorId,
    actorName,
    actorRole
  );
  assert(scheduledRequest.status === 'Scheduled', 'Request status should be Scheduled');

  // Verify tracker transitioned to 'In Progress'
  const updatedTracker = await installationRepository.findBySerialNumber(serialNumber);
  assert(updatedTracker?.status === 'In Progress', 'Tracker status should transition to In Progress');

  // Step E: Complete Workflow & Update Warranty Dates
  assert(updatedTracker !== null, 'Tracker record must exist');
  const completedTracker = await installationService.updateInstallation(
    updatedTracker!.id,
    {
      status: 'Completed',
      warrantyCardUpdated: 1,
      warrantyCardNumber: 'W-CARD-PCR-999',
      warrantyStart: '2026-07-15',
      warrantyExpiry: '2028-07-15',
      reportNotes: 'PCR configured, tested, and training completed.'
    },
    actorId,
    actorName,
    actorRole
  );

  assert(completedTracker.status === 'Completed', 'Tracker status should be Completed');

  // Verify warranty dates propagated to instrument_assets
  const finalAsset = await assetRepository.findBySerialNumber(serialNumber);
  assert(finalAsset?.installationDate === '2026-07-15', 'Asset installation date should be updated');
  assert(finalAsset?.warrantyCardNumber === 'W-CARD-PCR-999', 'Asset warranty card number should be updated');

  // Verify request closed out
  const finalRequest = await installationService.getRequestDetails(request.id);
  assert(finalRequest.status === 'Closed', 'Installation request should be fully closed');

  // Verify service job closed out
  const finalJob = await jobRepository.findById(associatedJob!.id);
  assert(finalJob?.status === 'Closed', 'Service job should be fully Closed');

  console.log('🎉 Successfully completed complete end-to-end installation service flow test!');
});

// Run all test cases
async function runAllTests() {
  console.log('=============================================');
  console.log('Avon ServicePro - Running Installation Module Tests ');
  console.log('=============================================');

  // Init DB pool
  await dbPool.initialize();

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

  // Close DB pool
  await dbPool.end();

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
