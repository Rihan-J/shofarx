import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function fix() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log('DELETING ALL');
  await sql`DELETE FROM social_links`;
  
  console.log('INSERTING CLEAN DATA');
  await sql`
    INSERT INTO social_links (name, url, icon, is_published, sort_order)
    VALUES 
      ('Call', 'tel:+919035850754', 'call', true, 1),
      ('WhatsApp', 'https://wa.me/919035850754', 'whatsapp', true, 2),
      ('Email', 'mailto:shofar.x.in@gmail.com', 'mail', true, 3),
      ('Instagram', 'https://www.instagram.com/shofarx/', 'instagram', true, 4)
  `;
  
  const res = await sql`SELECT * FROM social_links`;
  console.log("Found rows:", res.length);
}

fix().catch(console.error);
