import fs from 'fs';
import path from 'path';

function findEnvFiles(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        findEnvFiles(fullPath);
      }
    } else {
      if (file.toLowerCase().includes('.env')) {
        console.log(`Found env file: ${fullPath}`);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.includes('DB_') || line.includes('PASSWORD') || line.includes('SUPABASE') || line.includes('DATABASE_URL')) {
            console.log(`  ${line}`);
          }
        }
      }
    }
  }
}

console.log('Searching for ENV files...');
findEnvFiles(process.cwd());
