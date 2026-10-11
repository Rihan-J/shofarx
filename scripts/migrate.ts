import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Please check .env');
}

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('Running migrations...');

  // 1. Add web_projects table if it doesn't exist
  console.log('  → Ensuring web_projects table...');
  await sql`
    CREATE TABLE IF NOT EXISTS web_projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      project_link TEXT,
      category TEXT DEFAULT 'web',
      is_published BOOLEAN DEFAULT FALSE,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // 2. Add service_type column to contact_messages if missing
  console.log('  → Ensuring service_type column on contact_messages...');
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'contact_messages' AND column_name = 'service_type'
      ) THEN
        ALTER TABLE contact_messages ADD COLUMN service_type TEXT DEFAULT 'portfolio';
      END IF;
    END $$;
  `;

  // 3. Add update trigger for web_projects
  console.log('  → Ensuring update trigger for web_projects...');
  try {
    await sql`
      CREATE TRIGGER set_updated_at BEFORE UPDATE ON web_projects
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    `;
  } catch (e) {
    // Trigger already exists — that's fine
  }

  console.log('Migrations complete!');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
