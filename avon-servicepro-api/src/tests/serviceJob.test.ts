import { dbPool } from '../config/database';
import { jobService } from '../services/job.service';
import { jobRepository } from '../repositories/job.repository';
import { kpiService } from '../services/kpi.service';
import { kpiRepository } from '../repositories/kpi.repository';

const tests: { name: string; fn: () => void | Promise<void> }[] = [];

function it(name: string, fn: () => void | Promise<void>) {
  tests.push({ name, fn });
}

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

it('should perform the complete Service Job workflow, assign engineers, log reports, record measurements, and evaluate KPIs', async () => {
  const actorId = 'usr-admin-1';
  const actorName = 'Test Administrator';
  const actorRole = 'Admin';

  const serialNumber = 'JOB-TEST-999';
  const engineerId = 'usr-eng-bob';
  const engineerName = 'Bob Builder';
  const financialYearId = 'FY2026';

  console.log('1. Cleaning up existing test records...');
  // Clean up any existing records to ensure idempotent test runs
  await dbPool.query('DELETE FROM kpi_measurements WHERE kpiAssignmentId IN (SELECT id FROM employee_kpi_assignments WHERE employeeId = ?)', [engineerId]);
  await dbPool.query('DELETE FROM employee_kpi_assignments WHERE employeeId = ?', [engineerId]);
  await dbPool.query('DELETE FROM kpi_master WHERE name IN ("Service SLA Compliance", "Customer Satisfaction Index")');
  await dbPool.query('DELETE FROM service_jobs WHERE serialNumber = ?', [serialNumber]);

  console.log('2. Seeding KPI Master definition and Employee KPI Assignments...');
  // Seed Master KPI definitions
  const kpiSla = await kpiRepository.create({
    name: 'Service SLA Compliance',
    description: 'Optics and service completion SLA compliance rates',
    weight: 50,
    targetValue: '95%',
    roleType: 'Engineer'
  });

  const kpiFb = await kpiRepository.create({
    name: 'Customer Satisfaction Index',
    description: 'Feedback and Net Promoter Scores from clients',
    weight: 50,
    targetValue: '9.0/10',
    roleType: 'Engineer'
  });

  // Assign KPIs to Employee Bob
  await kpiRepository.assignKpiToEmployee({
    employeeId: engineerId,
    kpiId: kpiSla.id,
    financialYearId: financialYearId,
    currentValue: '0% SLA Met',
    score: 0,
    errorsCount: 0
  });

  await kpiRepository.assignKpiToEmployee({
    employeeId: engineerId,
    kpiId: kpiFb.id,
    financialYearId: financialYearId,
    currentValue: 'No client reviews yet',
    score: 0,
    errorsCount: 0
  });

  console.log('3. Creating a pending Service Job...');
  // Create a pending job
  const job = await jobService.createJob({
    jobType: 'Calibration',
    status: 'Pending Assignment',
    priority: 'Routine',
    customerName: 'Lanka Hospitals Lab',
    brand: 'SHIMADZU',
    model: 'Prominence LC-2030',
    serialNumber: serialNumber,
    createdById: actorId,
    createdByRole: actorRole
  }, actorId, actorName, actorRole);

  assert(job.id !== undefined, 'Job should be created successfully');
  assert(job.status === 'Pending Assignment', 'Initial status should be Pending Assignment');

  console.log('4. Assigning Service Job to Engineer Bob...');
  // Assign the engineer
  const assignedJob = await jobService.assignJob(
    job.id,
    engineerId,
    engineerName,
    'Bob has been assigned to do the annual calibration.',
    actorId,
    actorName,
    actorRole
  );

  assert(assignedJob.status === 'Assigned', 'Job status should change to Assigned');
  assert(assignedJob.assignedEngineerId === engineerId, 'Assigned engineer ID should match');
  assert(assignedJob.assignedEngineerName === engineerName, 'Assigned engineer name should match');

  console.log('5. Recording technical diagnostic measurements...');
  // Add measurements
  const measurementsData = {
    voltageLine: '230V',
    temperatureAccuracy: '99.8%',
    pressureOffset: '0.02 Bar'
  };

  const measuredJob = await jobService.addJobMeasurements(
    job.id,
    measurementsData,
    actorId,
    actorName,
    actorRole
  );

  assert(measuredJob.status === 'Tested', 'Status should advance to Tested after recording measurements');
  assert(measuredJob.calibrationData !== undefined, 'Calibration workflow data should exist');
  
  const parsedCal = JSON.parse(measuredJob.calibrationData!);
  assert(parsedCal.measurements !== undefined, 'Measurements structure must exist');
  assert(parsedCal.measurements.temperatureAccuracy === '99.8%', 'Measurements value should match');

  console.log('6. Submitting technical report / certificate...');
  // Add report / completion data
  const reportData = {
    calibrationDate: '2026-07-16',
    certificateNumber: 'CAL-CERT-999-BOB',
    invoiceAmount: 18500.00
  };

  const reportedJob = await jobService.addJobReport(
    job.id,
    'Calibration Certificate',
    reportData,
    actorId,
    actorName,
    actorRole
  );

  assert(reportedJob.status === 'Completed', 'Job status should transition to Completed after report logging');
  
  const reParsedCal = JSON.parse(reportedJob.calibrationData!);
  assert(reParsedCal.certificateNumber === 'CAL-CERT-999-BOB', 'Certificate number should match');

  console.log('7. Verifying dynamic KPI evaluation integration...');
  // Re-evaluate KPIs
  const performance = await kpiService.evaluateEmployeeKpis(engineerId, financialYearId);
  
  assert(performance.length === 2, 'Engineer should have 2 evaluated KPI assignments');
  
  const slaKpi = performance.find(p => p.name === 'Service SLA Compliance');
  assert(slaKpi !== undefined, 'SLA KPI must be present');
  assert(slaKpi.score === 100, 'Bob should have 100% SLA compliance as his job is completed successfully');
  assert(slaKpi.currentValue.includes('1/1 Jobs'), 'SLA value should reflect 1/1 Completed Jobs');

  console.log('✅ Service Job Integration tests completed successfully!');
});

it('should perform the complete Workshop Job lifecycle covering Intake, Assignment, Diagnosis bench tests, Repair, QA and Release', async () => {
  const actorId = 'usr-admin-1';
  const actorName = 'Test Administrator';
  const actorRole = 'Admin';
  const serialNumber = 'WS-TEST-888';
  const engineerId = 'usr-eng-bob';
  const engineerName = 'Bob Builder';

  console.log('A. Cleaning up existing workshop test records...');
  await dbPool.query('DELETE FROM service_jobs WHERE serialNumber = ?', [serialNumber]);

  console.log('B. Creating a new Workshop Job Intake check-in...');
  const workshopJob = await jobService.createJob({
    jobType: 'Workshop Job',
    status: 'Pending Assignment',
    priority: 'Urgent',
    customerName: 'General Hospital Kandy',
    brand: 'SYSMEX',
    model: 'XN-1000 Hematology Analyzer',
    serialNumber: serialNumber,
    createdById: actorId,
    createdByRole: actorRole
  }, actorId, actorName, actorRole);

  assert(workshopJob.id !== undefined, 'Workshop job should be successfully created');
  assert(workshopJob.status === 'Pending Assignment', 'Workshop job initial status should be Pending Assignment');

  console.log('C. Assigning Workshop Job to specialist...');
  const assignedWSJob = await jobService.assignJob(
    workshopJob.id,
    engineerId,
    engineerName,
    'Bob builder assigned to workshop micro-soldering station #4',
    actorId,
    actorName,
    actorRole
  );

  assert(assignedWSJob.status === 'Assigned', 'Status must transition to Assigned');
  assert(assignedWSJob.assignedEngineerId === engineerId, 'Engineer assignment must match');

  console.log('D. Simulating bench diagnostic test measurements...');
  const measurementsData = {
    laserIntensity: '11.5 mW',
    inputVoltage: '230V AC',
    chamberPressure: '0.05 mbar'
  };

  const diagnosedWSJob = await jobService.addJobMeasurements(
    workshopJob.id,
    measurementsData,
    actorId,
    actorName,
    actorRole
  );

  assert(diagnosedWSJob.status === 'Repair Completed', 'Workshop job must advance status after diagnostic testing');

  console.log('E. Logging repair completion details...');
  const repairReport = {
    acceptanceDate: new Date().toISOString(),
    itemSerialNumber: serialNumber,
    institute: 'General Hospital Kandy',
    departmentSection: 'Workshop Bench #4',
    contactName: 'Dr. Samantha',
    contactNumber: '0771234567',
    warrantyStatus: 'Non-Warranty',
    partsReceivedWithItem: 'Main Unit, Cables',
    takenByDeliveryPerson: 'Courier services',
    repairSteps: ['Resoldered laser power IC block', 'Calibrated sensor gain offset'],
    testResult: 'Pass',
    testHours: 4
  };

  const repairedWSJob = await jobService.addJobReport(
    workshopJob.id,
    'Workshop Repair Report',
    repairReport,
    actorId,
    actorName,
    actorRole
  );

  assert(repairedWSJob.status === 'Completed', 'Status must change to Completed after report logging');

  console.log('F. Executing Release & Dispatch Gate to close ticket...');
  const closedWSJob = await jobService.updateJobWorkflow(
    workshopJob.id,
    { status: 'Closed' },
    'Item officially dispatched with release note AVN-DISP-88899.',
    actorId,
    actorName,
    actorRole
  );

  assert(closedWSJob.status === 'Closed', 'Workshop job must be Closed upon release');
  console.log('✅ Workshop Job lifecycle integration tests completed successfully!');
});

async function runTests() {
  console.log('--- Starting Service Jobs & KPI Integration Tests ---');
  let failures = 0;

  try {
    await dbPool.initialize();
  } catch (initErr: any) {
    console.error('Failed to initialize database pool for testing:', initErr.message);
    process.exit(1);
  }

  for (const test of tests) {
    try {
      console.log(`Running test: ${test.name}`);
      await test.fn();
      console.log('👉 Success\n');
    } catch (err: any) {
      console.error(`❌ Failure: ${test.name}`);
      console.error(err.message || err);
      console.error(err.stack);
      failures++;
    }
  }

  // Close connections
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
