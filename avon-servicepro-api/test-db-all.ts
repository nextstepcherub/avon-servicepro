import mysql from 'mysql2/promise';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

async function testMySql() {
  console.log('\n--- Testing Local MySQL (3306) ---');
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'avon_servicepro_db',
      connectTimeout: 5000
    });
    console.log('✅ Local MySQL connected successfully!');
    const [rows] = await conn.query("SHOW TABLES");
    console.log('Tables found:', rows);
    await conn.end();
  } catch (err: any) {
    console.error('❌ Local MySQL failed:', err.message);
  }
}

async function testPg() {
  console.log('\n--- Testing Local PG (5432) ---');
  try {
    const client = new pg.Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: 'postgres',
      connectionTimeoutMillis: 3000
    });
    await client.connect();
    console.log('✅ Local PG connected successfully!');
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Tables found:', res.rows);
    await client.end();
  } catch (err: any) {
    console.error('❌ Local PG failed:', err.message);
  }
}

async function testSupabaseRest() {
  console.log('\n--- Testing Supabase API REST ---');
  const url = process.env.VITE_SUPABASE_URL || '';
  const key = process.env.VITE_SUPABASE_ANON_KEY || '';
  if (!url || !key) {
    console.log('❌ Supabase URL/Key missing.');
    return;
  }
  console.log('URL:', url);
  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('roles').select('*').limit(5);
    if (error) {
      console.error('❌ Supabase query failed:', error.message);
    } else {
      console.log('✅ Supabase roles query success!', data);
    }
  } catch (err: any) {
    console.error('❌ Supabase REST failed:', err.message);
  }
}

async function main() {
  console.log('Environment variables:');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);

  await testMySql();
  await testPg();
  await testSupabaseRest();
}

main();
