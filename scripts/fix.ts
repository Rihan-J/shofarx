import { sql } from '../api/_db.js';
import 'dotenv/config';

async function fix() {
  console.log('Wiping old social links...');
  await sql`DELETE FROM social_links`;
  
  console.log('Inserting new details...');
  await sql`
    INSERT INTO social_links (name, url, icon, is_published, sort_order)
    VALUES 
      ('WhatsApp', 'https://wa.me/919035850754', 'whatsapp', true, 1),
      ('Call', 'tel:+919035850754', 'call', true, 2),
      ('Email', 'mailto:shofar.x.in@gmail.com', 'mail', true, 3)
  `;
  
  console.log('Done!');
  process.exit(0);
}

fix().catch(console.error);
