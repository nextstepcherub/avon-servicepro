import { execSync } from 'child_process';
import path from 'path';

const testFiles = [
  'admin.test.ts',
  'amc.test.ts',
  'audit.test.ts',
  'config.test.ts',
  'dashboard.test.ts',
  'document.test.ts',
  'installation.test.ts',
  'org.test.ts',
  'report.test.ts',
  'serviceJob.test.ts',
  'serviceRequest.test.ts'
];

let failedCount = 0;

console.log('=============================================');
console.log('Avon ServicePro - Master Test Suite Execution');
console.log('=============================================');

for (const file of testFiles) {
  const filePath = path.join(__dirname, file);
  console.log(`\n🏃 Running: ${file}...`);
  try {
    execSync(`npx tsx ${filePath}`, { stdio: 'inherit' });
    console.log(`✅ Passed: ${file}`);
  } catch (error) {
    console.error(`❌ Failed: ${file}`);
    failedCount++;
  }
}

console.log('\n=============================================');
if (failedCount === 0) {
  console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error(`🚨 MASTER SUITE FAILED: ${failedCount} test file(s) failed.`);
  process.exit(1);
}
