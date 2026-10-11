import { sql } from '../api/_db.js';
import 'dotenv/config';

async function fix() {
  console.log('Wiping old social links...');
  await sql`DELETE FROM social_links`;
  
  console.log('Inserting new details...');
  await sql`
    INSERT INTO social_links (name, url, icon, is_published, sort_order)
    VALUES 
      ('Call', 'tel:+919035850754', 'call', true, 1),
      ('WhatsApp', 'https://wa.me/919035850754', 'whatsapp', true, 2),
      ('Email', 'mailto:shofar.x.in@gmail.com', 'mail', true, 3),
      ('Instagram', 'https://www.instagram.com/shofarx/', 'instagram', true, 4)
  `;
  
  console.log('Done!');
  process.exit(0);
}

fix().catch(console.error);
