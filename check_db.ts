import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function check() {
  try {
    const res = await sql`
      INSERT INTO web_projects (title, description, image_url, project_link, category, sort_order, is_published)
      VALUES 
        ('Premium Videography', 'Cinematic video showcase highlighting the best moments and premium production quality.', '/videos/social/lv_0_20260504184216.mp4#t=0,24', '#', 'social-video', 1, true),
        ('Wedding Highlights', 'A beautiful glimpse into a premium wedding celebration, perfectly capturing the emotion and grandeur.', '/videos/social/lv_0_20260503183446.mp4', '#', 'social-video', 2, true),
        ('Event Coverage', 'Dynamic and engaging video coverage of a major event, tailored for maximum social media impact.', '/videos/social/lv_0_20260707181423.mp4', '#', 'social-video', 3, true)
      RETURNING *;
    `;
    console.log("Inserted Video Projects:", res);

    process.exit(0);
    console.log(JSON.stringify(res3, null, 2));

    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
check();
