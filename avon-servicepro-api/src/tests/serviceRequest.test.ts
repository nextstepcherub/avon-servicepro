import { dbPool } from '../config/database';
import { serviceRequestService } from '../services/serviceRequest.service';
import { serviceRequestRepository } from '../repositories/serviceRequest.repository';
import { serviceRequestAssignmentRepository } from '../repositories/serviceRequestAssignment.repository';
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

// Complete Service Request module lifecycle and job synchronization integration tests
it('should perform the complete service request workflow, assign engineers, track SLAs, update statuses, and sync jobs', async () => {
  const actorId = 'usr-admin-1';
  const actorName = 'Test Administrator';
  const actorRole = 'Admin';

  const serialNumber = 'SRQ-TEST-888';

  // Cleanup old test records from previous runs
  const oldReqs = await serviceRequestRepository.findBySerialNumber(serialNumber);
  for (const req of oldReqs) {
    await dbPool.query('DELETE FROM service_request_audit_logs WHERE requestId = ?', [req.id]);
    await dbPool.query('DELETE FROM service_request_assignments WHERE requestId = ?', [req.id]);
    await dbPool.query('DELETE FROM service_requests WHERE id = ?', [req.id]);
  }
  await dbPool.query("DELETE FROM service_jobs WHERE serialNumber = ? AND jobType != 'Installation'", [serialNumber]);

  // Step 1: Create a Service Request (Request Creation & SLA Initiation)
  const reqData = {
    instrumentId: 'inst-pcr-test',
    instrumentName: 'Polymerase Chain Reaction Cycler',
    brand: 'THERMO SCIENTIFIC',
    serialNumber: serialNumber,
    customerId: 'cust-test-1',
    customerName: 'Asiri Surgical Test Lab',
    subject: 'Optics calibration drift detected',
    description: 'The green laser fluorescence reading is showing a 15% drift off-calibration limits. System needs manual alignments.',
    priority: 'HIGH' // SLA for HIGH is 3 days
  };

  const request = await serviceRequestService.createRequest(reqData, actorId, actorName, actorRole);

  assert(request.id !== undefined, 'Request should be successfully created with a UUID');
  assert(request.ticketNumber.startsWith('AVN-SRQ-'), 'Ticket number should start with AVN-SRQ-');
  assert(request.status === 'RECEIVED', 'Initial status should be RECEIVED');
  assert(request.slaDaysSetting === 3, 'SLA days setting for HIGH priority should be 3 days');
  assert(request.slaStatus === 'IN_COMPLIANCE', 'Initial SLA status should be IN_COMPLIANCE');

  // Verify a corresponding job was automatically provisioned in service_jobs table to prevent duplicate tracking
  const allJobs = await jobRepository.findAll({ limit: 1000 });
  const associatedJob = allJobs.data.find(j => j.serialNumber === serialNumber);
  assert(associatedJob !== undefined, 'A corresponding job ticket should be auto-provisioned in service_jobs');
  assert(associatedJob?.status === 'Pending Assignment', 'Auto-provisioned job status should be Pending Assignment');
  assert(associatedJob?.priority === 'Urgent', 'HIGH priority maps to Urgent job priority');

  // Step 2: Assign Lead Engineer (Assignment Management)
  const targetDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const assignment = await serviceRequestService.assignRequest(
    request.id,
    {
      assignedEngineerId: 'usr-eng-alice',
      assignedEngineerName: 'Alice Devine',
      targetResolutionDate: targetDate,
      remarks: 'Alice is lead optics specialist, assigning her to handle drift.'
    },
    actorId,
    actorName,
    actorRole
  );

  assert(assignment.id !== undefined, 'Assignment record should be successfully persisted');
  assert(assignment.assignedEngineerName === 'Alice Devine', 'Lead engineer name should match Alice');

  // Verify request status advanced to 'DIAGNOSING' on engineer assignment
  const details = await serviceRequestService.getRequestDetails(request.id);
  assert(details.request.status === 'DIAGNOSING', 'Service request status should advance to DIAGNOSING');
  assert(details.assignment !== null, 'Assignment record should be returned in request details');
  assert(details.auditLogs.length > 0, 'Audit logs should contain assignment actions');

  // Verify corresponding job ticket status updated to DIAGNOSING and assigned toAlice Devine
  const reFetchedJob = await jobRepository.findById(associatedJob!.id);
  assert(reFetchedJob?.status === 'DIAGNOSING', 'Corresponding job status should sync to DIAGNOSING');
  assert(reFetchedJob?.assignedEngineerName === 'Alice Devine', 'Job ticket lead engineer should sync to Alice Devine');

  // Step 3: Transition Status (Workflow Progress & Status Transitions)
  const updatedReq = await serviceRequestService.updateStatus(
    request.id,
    'CLOSED',
    'Laser focal point realigned and optical block recalibrated to within +/- 1% tolerances.',
    actorId,
    actorName,
    actorRole
  );

  assert(updatedReq.status === 'CLOSED', 'Status should be successfully advanced to CLOSED');
  assert(updatedReq.resolvedAt !== null && updatedReq.resolvedAt !== undefined, 'resolvedAt timestamp should be set');
  assert(updatedReq.downTimeHours !== undefined && updatedReq.downTimeHours >= 0, 'Downtime hours should be calculated');
  assert(updatedReq.slaStatus === 'IN_COMPLIANCE', 'SLA status should be IN_COMPLIANCE as resolved within 3 days');

  // Verify service_jobs ticket was updated to CLOSED and timeline updated
  const finalJobState = await jobRepository.findById(associatedJob!.id);
  assert(finalJobState?.status === 'CLOSED', 'Service job ticket status should sync to CLOSED');

  // Step 4: Costings and Billing approvals
  const billedReq = await serviceRequestService.updateBilling(
    request.id,
    145000.00,
    true,
    actorId,
    actorName,
    actorRole
  );

  assert(billedReq.estimatedCost === 145000.00, 'Estimated cost should be 145,000.00');
  assert(billedReq.billingApproved === 1, 'Billing should be approved (1)');

  console.log('✅ Service Request Integration Workflow tests successfully completed.');
});

async function runTests() {
  console.log('--- Starting Service Request Module Integration Tests ---');
  let failures = 0;

  try {
    await dbPool.initialize();
  } catch (initErr: any) {
    console.error('Failed to initialize database pool for testing:', initErr.message);
    process.exit(1);
  }

  for (const test of tests) {
    try {
      console.log(`Running: ${test.name}`);
      await test.fn();
      console.log('👉 Success\n');
    } catch (err: any) {
      console.error(`❌ Failure: ${test.name}`);
      console.error(err.message || err);
      console.error(err.stack);
      failures++;
    }
  }

  // End connections
  await dbPool.end();

  if (failures > 0) {
    console.error(`--- Tests finished with ${failures} failure(s) ---`);
    process.exit(1);
  } else {
    console.log('--- All Integration Tests Completed successfully ---');
    process.exit(0);
  }
}

runTests();
