import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function setup() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  const sql = neon(process.env.DATABASE_URL);

  console.log('Creating social_case_studies table...');

  await sql`
    CREATE TABLE IF NOT EXISTS social_case_studies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_name VARCHAR(255) NOT NULL,
      client_logo TEXT NOT NULL,
      business_category VARCHAR(100) NOT NULL,
      short_description TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      gallery_images JSONB DEFAULT '[]'::jsonb,
      instagram_link TEXT,
      facebook_link TEXT,
      services_provided JSONB DEFAULT '[]'::jsonb,
      campaign_statistics JSONB DEFAULT '[]'::jsonb,
      testimonial JSONB,
      is_featured BOOLEAN DEFAULT false,
      sort_order INTEGER DEFAULT 0,
      is_published BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('Table social_case_studies created successfully.');
}

setup().catch(console.error);
