import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables with override enabled
dotenv.config({ override: true });

async function seed() {
  console.log('🚀 Starting AVON ServicePro Database Seeder...');

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
  const dbUser = process.env.DB_USER || 'postgres';
  const dbName = process.env.DB_NAME || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || '';

  if (!dbHost || !dbUser) {
    console.error('❌ Missing DB_HOST or DB_USER in environment variables.');
    return;
  }

  console.log(`Connecting to database at ${dbHost}:${dbPort} as ${dbUser}...`);
  console.log(`Database Name: ${dbName}`);
  console.log(`Using password of length: ${dbPassword.length}`);

  const client = new pg.Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    ssl: dbHost.includes('supabase') || dbHost.includes('neon') ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 10000
  });

  try {
    await client.connect();
    console.log('✅ Connected to the database successfully.');

    // Locate seed.sql
    const seedPath = path.join(process.cwd(), 'seed.sql');
    if (!fs.existsSync(seedPath)) {
      throw new Error(`seed.sql file not found at: ${seedPath}`);
    }

    console.log('Reading seed.sql file...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    // Dynamically clear existing data from the tables to prevent primary key conflicts
    console.log('Detecting existing tables in the database schema...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);
    const existingTables = new Set(tablesResult.rows.map((row: any) => row.table_name));

    // Extract table names from seedSql
    const tableRegex = /insert\s+into\s+"([^"]+)"/gi;
    let match;
    const seedTables = new Set<string>();
    while ((match = tableRegex.exec(seedSql)) !== null) {
      seedTables.add(match[1]);
    }

    const tablesToTruncate = Array.from(seedTables).filter(t => existingTables.has(t));

    if (tablesToTruncate.length > 0) {
      console.log(`🧹 Truncating ${tablesToTruncate.length} tables to ensure a clean, duplicate-free seed...`);
      // Temporarily disable replication role triggers during truncate to prevent key check delays/blocks
      await client.query("SET session_replication_role = 'replica';");
      
      // Batch tables to avoid massive query strings, though a single query is fine for 136 tables
      const quotedTables = tablesToTruncate.map(t => `"${t}"`).join(', ');
      await client.query(`TRUNCATE TABLE ${quotedTables} RESTART IDENTITY CASCADE;`);
      
      await client.query("SET session_replication_role = 'origin';");
      console.log('✅ All matching tables successfully truncated and identity sequences reset.');
    } else {
      console.log('No matching tables found to truncate.');
    }

    console.log('Executing seeding statements... (This may take a moment)');
    const start = Date.now();
    await client.query(seedSql);
    const duration = ((Date.now() - start) / 1000).toFixed(2);

    console.log(`\n======================================================`);
    console.log(`🎉 SUCCESS! Database seeded successfully in ${duration}s!`);
    console.log(`======================================================`);

  } catch (error: any) {
    console.error('\n❌ Seeding failed with error:');
    console.error(error.message);
    if (error.detail) console.error(`Detail: ${error.detail}`);
    if (error.hint) console.error(`Hint: ${error.hint}`);
  } finally {
    await client.end();
    console.log('\nDisconnected from the database.');
  }
}

seed();
