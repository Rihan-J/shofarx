const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function check() {
  try {
    const res = await sql`SELECT id, title, category FROM web_projects WHERE title ILIKE '%complent%'`;
    console.log("Complent results:");
    console.log(JSON.stringify(res, null, 2));

    const res2 = await sql`SELECT id, title, category FROM web_projects`;
    console.log("All web_projects:");
    console.log(JSON.stringify(res2, null, 2));

    const res3 = await sql`SELECT id, name FROM projects`;
    console.log("All projects:");
    console.log(JSON.stringify(res3, null, 2));

    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
check();
