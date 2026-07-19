const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'api/routes');
const testsDir = path.join(__dirname, 'api/tests');

const controllers = {};
const middlewares = {};
const validators = {};
const services = {};
const repositories = {};

function scanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find multiline or single line imports from '../controllers/...' etc
  // e.g. import { ... } from '../controllers/auth.controller';
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+'\.\.\/(controllers|middleware|validators|services|repositories)\/([^']+)'/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const itemsText = match[1];
    const type = match[2]; // e.g. controllers
    const file = match[3]; // e.g. auth.controller
    
    const items = itemsText.split(',')
      .map(x => x.trim())
      .filter(x => x && !x.startsWith('type ')); // omit type imports
      
    const registry = type === 'controllers' ? controllers :
                     type === 'middleware' ? middlewares :
                     type === 'validators' ? validators :
                     type === 'services' ? services : repositories;
                     
    if (!registry[file]) registry[file] = new Set();
    items.forEach(item => registry[file].add(item));
  }
}

// Read routes
fs.readdirSync(routesDir).forEach(f => {
  if (f.endsWith('.ts')) scanFile(path.join(routesDir, f));
});

// Read tests
fs.readdirSync(testsDir).forEach(f => {
  if (f.endsWith('.ts')) scanFile(path.join(testsDir, f));
});

console.log('CONTROLLERS:');
for (const [f, items] of Object.entries(controllers)) {
  console.log(`- ${f}: [${Array.from(items).join(', ')}]`);
}
console.log('\nMIDDLEWARES:');
for (const [f, items] of Object.entries(middlewares)) {
  console.log(`- ${f}: [${Array.from(items).join(', ')}]`);
}
console.log('\nVALIDATORS:');
for (const [f, items] of Object.entries(validators)) {
  console.log(`- ${f}: [${Array.from(items).join(', ')}]`);
}
console.log('\nSERVICES:');
for (const [f, items] of Object.entries(services)) {
  console.log(`- ${f}: [${Array.from(items).join(', ')}]`);
}
console.log('\nREPOSITORIES:');
for (const [f, items] of Object.entries(repositories)) {
  console.log(`- ${f}: [${Array.from(items).join(', ')}]`);
}
