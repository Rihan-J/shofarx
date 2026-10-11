import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function verify() {
  const sql = neon(process.env.DATABASE_URL!);
  const res = await sql`SELECT * FROM social_links`;
  console.log(JSON.stringify(res, null, 2));
}

verify().catch(console.error);
