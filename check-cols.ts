import { dbPool } from './avon-servicepro-api/src/config/database';

async function checkAuditCols() {
  await dbPool.initialize();
  const res: any = await dbPool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'audit_logs'
  `);
  console.log('AUDIT LOGS COLUMNS:', res);
  process.exit(0);
}

checkAuditCols();
