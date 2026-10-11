import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  const sql = neon(process.env.DATABASE_URL);
  
  console.log('Seeding social_case_studies table...');

  // Case Study 1: Real Estate (Featured)
  await sql`
    INSERT INTO social_case_studies (
      client_name, client_logo, business_category, short_description, cover_image, 
      gallery_images, instagram_link, facebook_link, services_provided, campaign_statistics, 
      testimonial, is_featured, sort_order, is_published
    ) VALUES (
      'Lumina Residences', 
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      'Real Estate',
      'A luxury real estate project in downtown Bangalore. We transformed their digital presence, resulting in sold-out inventory within 3 months.',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]'::jsonb,
      'https://instagram.com',
      'https://facebook.com',
      '["Social Media Management", "Drone Videography", "Content Strategy", "Property Promotion"]'::jsonb,
      '[{"label": "Reach", "value": "1.2M+"}, {"label": "Leads", "value": "850+"}, {"label": "Engagement", "value": "18%"}]'::jsonb,
      '{"quote": "Shofar-X completely changed how buyers perceive our properties. The video tours they produced went viral locally.", "author": "Rahul M.", "role": "Marketing Director"}'::jsonb,
      true,
      1,
      true
    )
  `;

  // Case Study 2: Restaurant
  await sql`
    INSERT INTO social_case_studies (
      client_name, client_logo, business_category, short_description, cover_image, 
      gallery_images, instagram_link, facebook_link, services_provided, campaign_statistics, 
      testimonial, is_featured, sort_order, is_published
    ) VALUES (
      'Bistro Noir', 
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      'Restaurants',
      'An upscale dining experience that needed a visual identity to match its culinary excellence. We built a moody, high-end feed that packed the house.',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      '["https://images.unsplash.com/photo-1414235077428-338988a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]'::jsonb,
      'https://instagram.com',
      null,
      '["Food Photography", "Reel Creation", "Influencer Outreach"]'::jsonb,
      '[{"label": "Followers", "value": "15k+"}, {"label": "Profile Visits", "value": "45k+"}, {"label": "Reservations", "value": "Up 30%"}]'::jsonb,
      '{"quote": "Our weekends are fully booked weeks in advance now. The content is simply mouthwatering.", "author": "Chef David", "role": "Owner"}'::jsonb,
      false,
      2,
      true
    )
  `;

  // Case Study 3: Retail
  await sql`
    INSERT INTO social_case_studies (
      client_name, client_logo, business_category, short_description, cover_image, 
      gallery_images, instagram_link, facebook_link, services_provided, campaign_statistics, 
      testimonial, is_featured, sort_order, is_published
    ) VALUES (
      'Aura Fashion', 
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      'Fashion',
      'A sustainable clothing brand launching its summer collection. We drove massive online sales through hyper-targeted aesthetic campaigns.',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      '["https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]'::jsonb,
      'https://instagram.com',
      'https://facebook.com',
      '["Brand Identity", "Lookbook Photography", "Ad Creative", "Copywriting"]'::jsonb,
      '[{"label": "Views", "value": "2.5M"}, {"label": "Conversion", "value": "4.2%"}, {"label": "ROAS", "value": "6x"}]'::jsonb,
      null,
      false,
      3,
      true
    )
  `;

  console.log('Seeding completed successfully.');
}

seed().catch(console.error);
