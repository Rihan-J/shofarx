import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function update() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // Unpublish complaintbox.orgs (14) and Vidhatribhavan (16)
  await sql`
    UPDATE web_projects 
    SET is_published = false 
    WHERE id IN (14, 16)
  `;
  
  console.log('Successfully unpublished the projects.');
}

update().catch(console.error);
