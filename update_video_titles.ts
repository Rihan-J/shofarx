import 'dotenv/config';
import { sql } from './src/pages/api/_db';

async function updateVideoTitles() {
  try {
    // 1. Premium Videography -> Promotional Videos
    await sql`
      UPDATE web_projects
      SET title = 'Promotional Videos'
      WHERE title = 'Premium Videography' AND category = 'social-video';
    `;

    // 2. Wedding Highlights -> Brand Stories
    await sql`
      UPDATE web_projects
      SET title = 'Brand Stories'
      WHERE title = 'Wedding Highlights' AND category = 'social-video';
    `;

    // 3. Birthday Shoot -> Instagram Reels Car Delivery
    await sql`
      UPDATE web_projects
      SET title = 'Instagram Reels Car Delivery'
      WHERE title = 'Birthday Shoot' AND category = 'social-video';
    `;

    console.log("Titles updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateVideoTitles();
