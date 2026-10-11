import 'dotenv/config';
import { sql } from './src/pages/api/_db';

async function removeDuplicate() {
  try {
    // Find duplicates and delete the one with the lowest ID (or highest ID, just need to remove one)
    const res = await sql`
      DELETE FROM web_projects
      WHERE id IN (
        SELECT id
        FROM (
          SELECT id,
          ROW_NUMBER() OVER( PARTITION BY title ORDER BY id ) AS row_num
          FROM web_projects
          WHERE category = 'social-video'
        ) t
        WHERE t.row_num > 1
      )
      RETURNING *;
    `;
    console.log("Deleted duplicates:", res);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

removeDuplicate();
