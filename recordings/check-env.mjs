import fs from 'fs';

const t = fs.readFileSync('.env.local', 'utf8');

function status(name) {
  const m = t.match(new RegExp(`^${name}=(.*)`, 'm'));
  if (!m) return 'missing';
  const v = m[1].trim().replace(/^["']|["']$/g, '');
  if (!v) return 'empty';
  if (/your_|placeholder|changeme/i.test(v)) return 'placeholder';
  return 'set';
}

console.log('GEMINI_API_KEY', status('GEMINI_API_KEY'));
console.log('GROQ_API_KEY', status('GROQ_API_KEY'));
