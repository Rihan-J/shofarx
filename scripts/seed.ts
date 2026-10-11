import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables from .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Please check .env.local');
}

const sql = neon(process.env.DATABASE_URL);

// --- STATIC DATA IMPORTS ---
// In a real scenario we'd import the TS files if configured, but here we can just define the data
// or read it directly. Since it's a seed script running via tsx, we can import them.
import { projects } from '../src/data/projects.ts';
import { achievements } from '../src/data/achievements.ts';
import { skills } from '../src/data/skills.ts';
import { socialLinks } from '../src/data/social.ts';

async function seed() {
  console.log('Seeding database...');

  // 1. Create tables
  console.log('Creating tables...');
  await sql`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      tech_stack TEXT[] NOT NULL,
      live_url TEXT NOT NULL,
      github_url TEXT,
      image TEXT,
      is_published BOOLEAN DEFAULT FALSE,
      is_deleted BOOLEAN DEFAULT FALSE,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS achievements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      emoji TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      year TEXT NOT NULL,
      is_published BOOLEAN DEFAULT FALSE,
      is_deleted BOOLEAN DEFAULT FALSE,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      level TEXT NOT NULL,
      category TEXT NOT NULL,
      is_published BOOLEAN DEFAULT FALSE,
      is_deleted BOOLEAN DEFAULT FALSE,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS social_links (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT NOT NULL,
      is_published BOOLEAN DEFAULT FALSE,
      is_deleted BOOLEAN DEFAULT FALSE,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      service_type TEXT DEFAULT 'portfolio',
      ip TEXT,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

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

  await sql`
    CREATE TABLE IF NOT EXISTS analytics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event TEXT NOT NULL,
      target_id UUID,
      ip TEXT,
      user_agent TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Provide the update timestamp trigger function
  await sql`
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
    $$ LANGUAGE plpgsql;
  `;

  // Apply triggers
  try { await sql`CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_timestamp();`; } catch(e) {}
  try { await sql`CREATE TRIGGER set_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_timestamp();`; } catch(e) {}
  try { await sql`CREATE TRIGGER set_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_timestamp();`; } catch(e) {}
  try { await sql`CREATE TRIGGER set_updated_at BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION update_timestamp();`; } catch(e) {}

  console.log('Tables created.');

  // 2. Insert admin user
  console.log('Seeding admin user...');
  const username = 'admin';
  const plainPassword = 'Rihanuuu@2707';
  const hash = await bcrypt.hash(plainPassword, 10);
  
  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${username}, ${hash})
    ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;
  `;

  // 3. Insert initial data if tables are empty
  const projCount = await sql`SELECT count(*) FROM projects`;
  if (projCount[0].count === '0') {
    console.log('Seeding projects...');
    for (let i = 0; i < projects.length; i++) {
        const p = projects[i];
        await sql`
          INSERT INTO projects (name, description, tech_stack, live_url, github_url, image, sort_order, is_published)
          VALUES (${p.name}, ${p.description}, ${p.techStack}, ${p.liveUrl}, ${p.githubUrl || null}, ${p.image || null}, ${i}, true)
        `;
    }
  }

  const achCount = await sql`SELECT count(*) FROM achievements`;
  if (achCount[0].count === '0') {
    console.log('Seeding achievements...');
    for (let i = 0; i < achievements.length; i++) {
        const a = achievements[i];
        await sql`
          INSERT INTO achievements (emoji, title, description, year, sort_order, is_published)
          VALUES (${a.emoji}, ${a.title}, ${a.description}, ${a.year}, ${i}, true)
        `;
    }
  }

  const skillsCount = await sql`SELECT count(*) FROM skills`;
  if (skillsCount[0].count === '0') {
    console.log('Seeding skills...');
    for (let i = 0; i < skills.length; i++) {
        const s = skills[i];
        await sql`
          INSERT INTO skills (name, icon, level, category, sort_order, is_published)
          VALUES (${s.name}, ${s.icon}, ${s.level}, ${s.category}, ${i}, true)
        `;
    }
  }

  const socialCount = await sql`SELECT count(*) FROM social_links`;
  if (socialCount[0].count === '0') {
    console.log('Seeding social links...');
    for (let i = 0; i < socialLinks.length; i++) {
        const s = socialLinks[i];
        await sql`
          INSERT INTO social_links (name, url, icon, sort_order, is_published)
          VALUES (${s.name}, ${s.url}, ${s.icon}, ${i}, true)
        `;
    }
  }

  console.log('Seeding complete! Admin logic created: username "admin", password "adminpassword123".');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
