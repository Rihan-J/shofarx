/**
 * Hash Password Utility
 * Usage: npx tsx scripts/hash-password.ts "your-password-here"
 */
import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npx tsx scripts/hash-password.ts "your-password"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log('\n✅ Bcrypt hash generated:\n');
console.log(hash);
console.log('\n📋 Add this to your .env.local:');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
