console.log('Keys in process.env:');
for (const key of Object.keys(process.env)) {
  if (key.includes('SUPABASE') || key.includes('DB') || key.includes('PASSWORD') || key.includes('SECRET') || key.includes('POSTGRES')) {
    console.log(`${key}: ${process.env[key] ? 'SET (length: ' + process.env[key]!.length + ')' : 'EMPTY'}`);
    if (key.toLowerCase().includes('password') || key.toLowerCase().includes('key') || key.toLowerCase().includes('url')) {
      console.log(`  First 3 chars: ${process.env[key]?.substring(0, 3)}...`);
    }
  }
}
