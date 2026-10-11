import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function check() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT * FROM web_projects WHERE category='social'`;
  console.log(rows);
}
check();
