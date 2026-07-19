import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ override: true });

async function main() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  if (!supabaseUrl) {
    console.error('❌ VITE_SUPABASE_URL is not set.');
    return;
  }

  // Parse project ref from supabaseUrl (e.g. https://abc.supabase.co -> abc)
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.(co|net)/);
  if (!match) {
    console.error(`❌ Could not parse project reference from Supabase URL: ${supabaseUrl}`);
    return;
  }
  const projectRef = match[1];
  console.log(`Parsed Supabase Project Ref: ${projectRef}`);

  const dbPassword = process.env.DB_PASSWORD || '';
  console.log(`Using password of length: ${dbPassword.length}`);

  // We will try several potential host/port configurations for Supabase
  const configurations = [
    {
      host: `db.${projectRef}.supabase.co`,
      port: 5432,
      user: 'postgres',
      database: 'postgres'
    },
    {
      host: `db.${projectRef}.supabase.co`,
      port: 6543, // Transaction pooler
      user: 'postgres',
      database: 'postgres'
    },
    {
      host: `db.${projectRef}.supabase.co`,
      port: 5432,
      user: `postgres.${projectRef}`,
      database: 'postgres'
    },
    {
      host: `aws-0-us-east-1.pooler.supabase.com`, // fallback default host format
      port: 6543,
      user: `postgres.${projectRef}`,
      database: 'postgres'
    }
  ];

  for (let i = 0; i < configurations.length; i++) {
    const config = configurations[i];
    console.log(`\n--- Attempt ${i + 1}: Connecting to ${config.host}:${config.port} as ${config.user} ---`);
    const client = new pg.Client({
      host: config.host,
      port: config.port,
      user: config.user,
      password: dbPassword,
      database: config.database,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000 // fail fast
    });

    try {
      await client.connect();
      console.log('✅ SUCCESS! Connected directly to Supabase Postgres!');
      const res = await client.query('SELECT version()');
      console.log(`Database Version: ${res.rows[0].version}`);
      
      const tablesRes = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `);
      console.log(`Found ${tablesRes.rowCount} tables in public schema.`);
      
      await client.end();
      return; // Stop on first success
    } catch (err: any) {
      console.error(`❌ Attempt failed: ${err.message}`);
    }
  }

  console.log('\n❌ All direct PostgreSQL connection attempts to Supabase failed.');
}

main();
