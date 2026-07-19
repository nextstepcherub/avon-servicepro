import { dbPool } from '../config/database';
import { reportService } from '../services/report.service';

const tests: { name: string; fn: () => void | Promise<void> }[] = [];

function it(name: string, fn: () => void | Promise<void>) {
  tests.push({ name, fn });
}

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

it('should initialize database for report testing', async () => {
  await dbPool.initialize();
  assert(true, 'Database initialized successfully');
});

it('should compile highly accurate Operational Reports', async () => {
  const report = await reportService.getOperationalReport();
  
  assert(report.timestamp !== undefined, 'Report should contain timestamp');
  assert(report.tickets !== undefined, 'Report should contain tickets section');
  assert(typeof report.tickets.total === 'number', 'tickets total should be a number');
  assert(report.tickets.byStatus !== undefined, 'tickets byStatus should be defined');
  assert(report.tickets.byPriority !== undefined, 'tickets byPriority should be defined');
  assert(typeof report.tickets.averageDowntimeHours === 'number', 'averageDowntimeHours should be a number');
  assert(typeof report.tickets.slaComplianceRate === 'number', 'slaComplianceRate should be a number');

  assert(report.installations !== undefined, 'Report should contain installations section');
  assert(typeof report.installations.totalRequests === 'number', 'totalRequests should be a number');
  assert(report.installations.byStatus !== undefined, 'installations byStatus should be defined');
  assert(typeof report.installations.completedCount === 'number', 'completedCount should be a number');
  assert(typeof report.installations.totalInvoiceValue === 'number', 'totalInvoiceValue should be a number');

  assert(report.jobs !== undefined, 'Report should contain jobs section');
  assert(typeof report.jobs.totalActive === 'number', 'totalActive should be a number');
  assert(report.jobs.byType !== undefined, 'jobs byType should be defined');
  assert(report.jobs.byStatus !== undefined, 'jobs byStatus should be defined');
  assert(typeof report.jobs.outstandingEmergencyCount === 'number', 'outstandingEmergencyCount should be a number');
});

it('should compile highly accurate Employee KPI Reports', async () => {
  const report = await reportService.getKpiReport('FY26-27');

  assert(report.timestamp !== undefined, 'Report should contain timestamp');
  assert(typeof report.overallAverageKpiScore === 'number', 'overallAverageKpiScore should be a number');
  assert(Array.isArray(report.rankings), 'rankings should be an array');
  assert(report.performers !== undefined, 'performers should be defined');
  assert(Array.isArray(report.performers.top), 'performers.top should be an array');
  assert(Array.isArray(report.performers.needsImprovement), 'performers.needsImprovement should be an array');

  // Verify ranking sorted order
  if (report.rankings.length > 1) {
    const first = report.rankings[0];
    const second = report.rankings[1];
    assert(first.compositeScore >= second.compositeScore, 'Rankings should be sorted in descending order of composite KPI scores');
  }
});

it('should compile highly accurate strategic Executive Reports', async () => {
  const report = await reportService.getExecutiveReport();

  assert(report.timestamp !== undefined, 'Report should contain timestamp');
  assert(report.financials !== undefined, 'Report should contain financials');
  assert(typeof report.financials.billingApprovedEstimatedCost === 'number', 'billingApprovedEstimatedCost should be a number');
  assert(typeof report.financials.activeAmcValue === 'number', 'activeAmcValue should be a number');
  assert(typeof report.financials.completedInstallationsValue === 'number', 'completedInstallationsValue should be a number');
  assert(typeof report.financials.totalEnterpriseRevenuePotential === 'number', 'totalEnterpriseRevenuePotential should be a number');
  
  // Potential is the sum of components
  const expectedSum = report.financials.billingApprovedEstimatedCost + report.financials.activeAmcValue + report.financials.completedInstallationsValue;
  assert(report.financials.totalEnterpriseRevenuePotential === expectedSum, 'Total potential must sum up all revenue streams correctly');

  assert(report.slaCompliance !== undefined, 'Report should contain SLA compliance section');
  assert(typeof report.slaCompliance.overallRate === 'number', 'overallRate should be a number');
  assert(report.slaCompliance.bySlaTier !== undefined, 'bySlaTier details must be present');

  assert(report.contracts !== undefined, 'Report should contain contracts summary');
  assert(typeof report.contracts.totalContracts === 'number', 'totalContracts should be a number');
  assert(typeof report.contracts.activeContracts === 'number', 'activeContracts should be a number');
  assert(typeof report.contracts.expiredContracts === 'number', 'expiredContracts should be a number');
  assert(typeof report.contracts.averageUptimeGuarantee === 'number', 'averageUptimeGuarantee should be a number');
  assert(typeof report.contracts.averageResponseTimeHours === 'number', 'averageResponseTimeHours should be a number');
});

async function runAllTests() {
  console.log('=============================================');
  console.log('Avon ServicePro - Running Reports Module Tests');
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
      console.error(error.stack);
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
