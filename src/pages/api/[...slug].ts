import type { NextApiRequest as VercelRequest, NextApiResponse as VercelResponse } from 'next';
import { sql } from './_db';
import { ContactSchema } from './_validate';
import { applyRateLimit, getContactRateLimit } from './_ratelimit';

/**
 * Consolidated public API handler.
 * Routes: /api/projects, /api/skills, /api/achievements, /api/social, /api/contact, /api/analytics
 */

function getRoute(req: VercelRequest): string {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  // Extract the second segment: /api/{route}
  const segments = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  // segments = ['api', 'projects'] → return 'projects'
  return segments[1] || '';
}

// ── Individual route handlers ───────────────────────────────────────────

async function handleProjects(_req: VercelRequest, res: VercelResponse) {
  try {
    // Step 2 & 3: Test connection
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing in the production environment");
    }
    await sql`SELECT 1 as test_connection`;
    console.log("DB Connection Success");

    const rows = await sql`
      SELECT id, name, description, tech_stack, live_url, github_url, image, sort_order
      FROM projects
      WHERE is_published = true AND is_deleted = false
      ORDER BY sort_order ASC, created_at DESC
    `;
    return res.status(200).json(rows);
  } catch (err) {
    console.error("DB Query Error:", err);
    throw err; // will be caught by the outer try-catch we added in handler
  }
}

async function handleSkills(_req: VercelRequest, res: VercelResponse) {
  try {
    const rows = await sql`
      SELECT id, name, icon, level, category, sort_order
      FROM skills
      WHERE is_published = true AND is_deleted = false
      ORDER BY sort_order ASC, name ASC
    `;
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch skills' });
  }
}

async function handleAchievements(_req: VercelRequest, res: VercelResponse) {
  try {
    const rows = await sql`
      SELECT id, emoji, title, description, year, sort_order
      FROM achievements
      WHERE is_published = true AND is_deleted = false
      ORDER BY sort_order ASC, created_at DESC
    `;
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch achievements' });
  }
}

async function handleSocial(_req: VercelRequest, res: VercelResponse) {
  try {
    const rows = await sql`
      SELECT id, name, url, icon, sort_order
      FROM social_links
      WHERE is_published = true AND is_deleted = false
      ORDER BY sort_order ASC
    `;
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch social links' });
  }
}

async function handleWebProjects(_req: VercelRequest, res: VercelResponse) {
  try {
    const rows = await sql`
      SELECT id, title, description, image_url, project_link, category, created_at
      FROM web_projects
      WHERE is_published = true AND (category = 'web' OR category IS NULL OR category = '')
      ORDER BY sort_order ASC, created_at DESC
    `;
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Web projects fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch web projects' });
  }
}

async function handleSocialProjects(_req: VercelRequest, res: VercelResponse) {
  try {
    const rows = await sql`
      SELECT id, title, description, image_url, project_link, category, created_at
      FROM web_projects
      WHERE is_published = true AND category LIKE 'social%'
      ORDER BY sort_order ASC, created_at DESC
    `;
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Social projects fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch social projects' });
  }
}

async function handleContact(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const limiter = getContactRateLimit();
  if (limiter) {
    const allowed = await applyRateLimit(limiter, req, res);
    if (!allowed) return;
  }

  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { name, email, message, service_type } = parsed.data;
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? null;

  try {
    await sql`
      INSERT INTO contact_messages (name, email, message, service_type, ip)
      VALUES (${name}, ${email}, ${message}, ${service_type}, ${ip})
    `;
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save message' });
  }
}

async function handleAnalytics(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { event, target_id } = req.body as { event: string; target_id?: string };
  if (!event || !['page_view', 'project_click'].includes(event)) {
    return res.status(400).json({ error: 'Invalid event type' });
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? null;
  const user_agent = req.headers['user-agent'] ?? null;

  try {
    await sql`
      INSERT INTO analytics (event, target_id, ip, user_agent)
      VALUES (${event}, ${target_id ?? null}, ${ip}, ${user_agent})
    `;
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to record event' });
  }
}

// ── Main dispatcher ─────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const route = getRoute(req);

    switch (route) {
      case 'projects':
        return await handleProjects(req, res);
      case 'web-projects':
        return await handleWebProjects(req, res);
      case 'social-projects':
        return await handleSocialProjects(req, res);
      case 'skills':
        return await handleSkills(req, res);
      case 'achievements':
        return await handleAchievements(req, res);
      case 'social':
        return await handleSocial(req, res);
      case 'contact':
        return await handleContact(req, res);
      case 'analytics':
        return await handleAnalytics(req, res);
      default:
        return res.status(404).json({ error: 'Not found' });
    }
  } catch (error: any) {
    console.error("API ERROR:", error);
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
