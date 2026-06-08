require('dotenv').config({ path: '.env.local' });

const schema = require('fs').readFileSync(require('path').join(__dirname, 'schema.sql'), 'utf8');

console.log('\n📋 MIGRATION INSTRUCTIONS\n');
console.log('The schema cannot be run automatically — Supabase requires SQL to be executed via the dashboard.');
console.log('\nPlease follow these steps:\n');
console.log('1. Open: https://supabase.com/dashboard/project/othuffbfpbxznwvhlcyu/sql/new');
console.log('2. Paste the contents of lib/schema.sql into the editor');
console.log('3. Click "Run"\n');
console.log('After that, run: node lib/seed.js\n');
console.log('─────────────────────────────────────────');
console.log('Here is the SQL to paste:\n');
console.log(schema);
