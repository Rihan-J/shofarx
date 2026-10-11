import 'dotenv/config';
import { sql } from './src/pages/api/_db';

async function updateVideos() {
  try {
    // 1. Update 3rd video title
    const res1 = await sql`
      UPDATE web_projects
      SET title = 'Birthday Shoot'
      WHERE title = 'Event Coverage' AND category = 'social-video'
      RETURNING *;
    `;
    console.log("Updated title:", res1);

    // 2. Cut 5 seconds from the first video
    // The current URL is '/videos/social/lv_0_20260504184216.mp4#t=0,24'
    // I will change it to start at 5 seconds: '#t=5,24'
    const res2 = await sql`
      UPDATE web_projects
      SET image_url = '/videos/social/lv_0_20260504184216.mp4#t=5,24'
      WHERE title = 'Premium Videography' AND category = 'social-video'
      RETURNING *;
    `;
    console.log("Updated URL:", res2);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateVideos();
