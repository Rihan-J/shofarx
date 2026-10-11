const { execSync } = require('child_process');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
env.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const idx = line.indexOf('=');
    if (idx !== -1) {
      const key = line.slice(0, idx);
      const val = line.slice(idx + 1).replace(/^"|"$/g, '');
      console.log(`Pushing ${key}...`);
      try {
        execSync(`npx vercel env add ${key} production`, { input: val });
        console.log(`Success: ${key}`);
      } catch(err) {
        console.error(`Failed to push ${key}:`, err.message);
      }
    }
  }
});
