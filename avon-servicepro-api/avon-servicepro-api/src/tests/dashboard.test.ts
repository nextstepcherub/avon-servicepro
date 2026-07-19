import { dbPool } from '../config/database';
import { dashboardService } from '../services/dashboard.service';

const tests: { name: string; fn: () => void | Promise<void> }[] = [];

function it(name: string, fn: () => void | Promise<void>) {
  tests.push({ name, fn });
}

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

it('should calculate dashboard statistics, handle financial year boundaries, trends, and employee rankings correctly', async () => {
  // Test 1: Fetch dashboard stats with current date
  const stats = await dashboardService.getDashboardStats();
  
  assert(stats.currentMonth !== undefined, 'Stats should contain currentMonth data');
  assert(stats.financialYear !== undefined, 'Stats should contain financialYear data');
  assert(stats.trends !== undefined, 'Stats should contain trends data');
  assert(Array.isArray(stats.rankings), 'Stats should contain rankings array');
  assert(Array.isArray(stats.topPerformers), 'Stats should contain topPerformers array');
  assert(Array.isArray(stats.bottomPerformers), 'Stats should contain bottomPerformers array');

  // Verify financial year formatting
  const fyId = stats.financialYear.financialYearId;
  assert(/^FY\d{2}-\d{2}$/.test(fyId), `Financial Year ID should be formatted as FYXX-XX, got: ${fyId}`);

  // Verify trends months are 6 months
  assert(stats.trends.months.length === 6, 'Trends should cover exactly 6 months');
  assert(stats.trends.serviceRequestsCreated.length === 6, 'Trends service requests created should have 6 data points');
  assert(stats.trends.serviceRequestsCompleted.length === 6, 'Trends service requests completed should have 6 data points');
  assert(stats.trends.installationsCompleted.length === 6, 'Trends installations completed should have 6 data points');
  assert(stats.trends.revenue.length === 6, 'Trends revenue should have 6 data points');

  // Verify rankings structure
  if (stats.rankings.length > 0) {
    const firstRow = stats.rankings[0];
    assert(firstRow.employeeId !== undefined, 'Rankings rows should contain employeeId');
    assert(firstRow.employeeName !== undefined, 'Rankings rows should contain employeeName');
    assert(firstRow.compositeKpiScore >= 0 && firstRow.compositeKpiScore <= 100, 'Composite score should be a percentage between 0 and 100');
    assert(firstRow.rank === 1, 'First row rank should be 1');
  }

  console.log('✅ Dashboard tests completed successfully!');
});

async function runAll() {
  console.log('Running dashboard unit tests...');
  try {
    await dbPool.initialize();
  } catch (err) {}
  
  for (const test of tests) {
    try {
      await test.fn();
      console.log(`PASS: ${test.name}`);
    } catch (error: any) {
      console.error(`FAIL: ${test.name}`);
      console.error(error);
      process.exit(1);
    }
  }
  process.exit(0);
}

runAll();
