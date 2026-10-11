import type { NextApiRequest as VercelRequest, NextApiResponse as VercelResponse } from 'next';
import { sql } from '../_db';
import { requireAuth } from '../_auth';
import { ProjectSchema, SkillSchema, AchievementSchema, SocialSchema, WebProjectSchema } from '../_validate';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Consolidated admin API handler.
 * All routes require authentication via requireAuth().
 *
 * URL pattern: /api/admin/{resource}[/{id}[/publish]]
 *
 * Supported resources: projects, skills, achievements, social, messages, password, stats
 */

interface ParsedRoute {
  resource: string;
  id: string | null;
  action: string | null;
}

function parseAdminRoute(req: VercelRequest): ParsedRoute {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const segments = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  // segments = ['api', 'admin', 'projects', '{id}', 'publish']
  return {
    resource: segments[2] || '',
    id: segments[3] || null,
    action: segments[4] || null,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// PROJECTS
// ══════════════════════════════════════════════════════════════════════════

async function handleProjects(req: VercelRequest, res: VercelResponse, route: ParsedRoute) {
  // PUT /api/admin/projects/{id}/publish
  if (route.id && route.action === 'publish') {
    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const rows = await sql`
        UPDATE projects SET is_published = NOT is_published WHERE id=${route.id} AND is_deleted=false RETURNING id, is_published
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to toggle publish' });
    }
  }

  // PUT /api/admin/projects/{id}
  if (route.id && req.method === 'PUT') {
    const parsed = ProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { name, description, tech_stack, live_url, github_url, image, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        UPDATE projects SET name=${name}, description=${description}, tech_stack=${tech_stack},
        live_url=${live_url}, github_url=${github_url || null}, image=${image || null},
        sort_order=${sort_order}, is_published=${is_published}
        WHERE id=${route.id} AND is_deleted=false RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update project' });
    }
  }

  // DELETE /api/admin/projects/{id}
  if (route.id && req.method === 'DELETE') {
    try {
      await sql`UPDATE projects SET is_deleted=true WHERE id=${route.id}`;
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete project' });
    }
  }

  // GET /api/admin/projects
  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT id, name, description, tech_stack, live_url, github_url, image, is_published, is_deleted, sort_order, created_at, updated_at
        FROM projects
        WHERE is_deleted = false
        ORDER BY sort_order ASC, created_at DESC
      `;
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  // POST /api/admin/projects
  if (req.method === 'POST') {
    const parsed = ProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { name, description, tech_stack, live_url, github_url, image, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        INSERT INTO projects (name, description, tech_stack, live_url, github_url, image, sort_order, is_published)
        VALUES (${name}, ${description}, ${tech_stack}, ${live_url}, ${github_url || null}, ${image || null}, ${sort_order}, ${is_published})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create project' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// ══════════════════════════════════════════════════════════════════════════
// WEB PROJECTS
// ══════════════════════════════════════════════════════════════════════════

async function handleWebProjects(req: VercelRequest, res: VercelResponse, route: ParsedRoute) {
  // PUT /api/admin/web-projects/{id}/publish
  if (route.id && route.action === 'publish') {
    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const rows = await sql`
        UPDATE web_projects SET is_published = NOT is_published WHERE id=${route.id} RETURNING id, is_published
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to toggle publish' });
    }
  }

  // PUT /api/admin/web-projects/{id}
  if (route.id && req.method === 'PUT') {
    const parsed = WebProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { title, description, image_url, project_link, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        UPDATE web_projects SET title=${title}, description=${description},
        image_url=${image_url || null}, project_link=${project_link || null},
        sort_order=${sort_order}, is_published=${is_published}
        WHERE id=${route.id} RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update web project' });
    }
  }

  // DELETE /api/admin/web-projects/{id}
  if (route.id && req.method === 'DELETE') {
    try {
      await sql`DELETE FROM web_projects WHERE id=${route.id}`;
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete web project' });
    }
  }

  // GET /api/admin/web-projects
  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT * FROM web_projects ORDER BY sort_order ASC, created_at DESC
      `;
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch web projects' });
    }
  }

  // POST /api/admin/web-projects
  if (req.method === 'POST') {
    const parsed = WebProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { title, description, image_url, project_link, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        INSERT INTO web_projects (title, description, image_url, project_link, category, sort_order, is_published)
        VALUES (${title}, ${description}, ${image_url || null}, ${project_link || null}, 'web', ${sort_order}, ${is_published})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create web project' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// ══════════════════════════════════════════════════════════════════════════
// SMM PROJECTS (Social Media Marketing — same table, category='social')
// ══════════════════════════════════════════════════════════════════════════

async function handleSmmProjects(req: VercelRequest, res: VercelResponse, route: ParsedRoute) {
  // PUT /api/admin/smm-projects/{id}/publish
  if (route.id && route.action === 'publish') {
    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const rows = await sql`
        UPDATE web_projects SET is_published = NOT is_published WHERE id=${route.id} AND category='social' RETURNING id, is_published
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to toggle publish' });
    }
  }

  // PUT /api/admin/smm-projects/{id}
  if (route.id && req.method === 'PUT') {
    const parsed = WebProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { title, description, image_url, project_link, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        UPDATE web_projects SET title=${title}, description=${description},
        image_url=${image_url || null}, project_link=${project_link || null},
        sort_order=${sort_order}, is_published=${is_published}
        WHERE id=${route.id} AND category='social' RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update SMM project' });
    }
  }

  // DELETE /api/admin/smm-projects/{id}
  if (route.id && req.method === 'DELETE') {
    try {
      await sql`DELETE FROM web_projects WHERE id=${route.id} AND category='social'`;
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete SMM project' });
    }
  }

  // GET /api/admin/smm-projects
  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT * FROM web_projects WHERE category='social' ORDER BY sort_order ASC, created_at DESC
      `;
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch SMM projects' });
    }
  }

  // POST /api/admin/smm-projects
  if (req.method === 'POST') {
    const parsed = WebProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { title, description, image_url, project_link, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        INSERT INTO web_projects (title, description, image_url, project_link, category, sort_order, is_published)
        VALUES (${title}, ${description}, ${image_url || null}, ${project_link || null}, 'social', ${sort_order}, ${is_published})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create SMM project' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// ══════════════════════════════════════════════════════════════════════════
// SKILLS
// ══════════════════════════════════════════════════════════════════════════

async function handleSkills(req: VercelRequest, res: VercelResponse, route: ParsedRoute) {
  // PUT /api/admin/skills/{id}/publish
  if (route.id && route.action === 'publish') {
    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const rows = await sql`
        UPDATE skills SET is_published = NOT is_published WHERE id=${route.id} AND is_deleted=false RETURNING id, is_published
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to toggle publish' });
    }
  }

  // PUT /api/admin/skills/{id}
  if (route.id && req.method === 'PUT') {
    const parsed = SkillSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { name, icon, level, category, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        UPDATE skills SET name=${name}, icon=${icon}, level=${level}, category=${category},
        sort_order=${sort_order}, is_published=${is_published}
        WHERE id=${route.id} AND is_deleted=false RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update skill' });
    }
  }

  // DELETE /api/admin/skills/{id}
  if (route.id && req.method === 'DELETE') {
    try {
      await sql`UPDATE skills SET is_deleted=true WHERE id=${route.id}`;
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete' });
    }
  }

  // GET /api/admin/skills
  if (req.method === 'GET') {
    try {
      const rows = await sql`SELECT * FROM skills WHERE is_deleted=false ORDER BY sort_order ASC, name ASC`;
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch skills' });
    }
  }

  // POST /api/admin/skills
  if (req.method === 'POST') {
    const parsed = SkillSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { name, icon, level, category, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        INSERT INTO skills (name, icon, level, category, sort_order, is_published)
        VALUES (${name}, ${icon}, ${level}, ${category}, ${sort_order}, ${is_published}) RETURNING *
      `;
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create skill' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// ══════════════════════════════════════════════════════════════════════════
// ACHIEVEMENTS
// ══════════════════════════════════════════════════════════════════════════

async function handleAchievements(req: VercelRequest, res: VercelResponse, route: ParsedRoute) {
  // PUT /api/admin/achievements/{id}/publish
  if (route.id && route.action === 'publish') {
    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const rows = await sql`
        UPDATE achievements SET is_published = NOT is_published WHERE id=${route.id} AND is_deleted=false RETURNING id, is_published
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to toggle publish' });
    }
  }

  // PUT /api/admin/achievements/{id}
  if (route.id && req.method === 'PUT') {
    const parsed = AchievementSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { emoji, title, description, year, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        UPDATE achievements SET emoji=${emoji}, title=${title}, description=${description},
        year=${year}, sort_order=${sort_order}, is_published=${is_published}
        WHERE id=${route.id} AND is_deleted=false RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update achievement' });
    }
  }

  // DELETE /api/admin/achievements/{id}
  if (route.id && req.method === 'DELETE') {
    try {
      await sql`UPDATE achievements SET is_deleted=true WHERE id=${route.id}`;
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete' });
    }
  }

  // GET /api/admin/achievements
  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT * FROM achievements WHERE is_deleted=false ORDER BY sort_order ASC, created_at DESC
      `;
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch achievements' });
    }
  }

  // POST /api/admin/achievements
  if (req.method === 'POST') {
    const parsed = AchievementSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { emoji, title, description, year, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        INSERT INTO achievements (emoji, title, description, year, sort_order, is_published)
        VALUES (${emoji}, ${title}, ${description}, ${year}, ${sort_order}, ${is_published})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create achievement' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// ══════════════════════════════════════════════════════════════════════════
// SOCIAL
// ══════════════════════════════════════════════════════════════════════════

async function handleSocial(req: VercelRequest, res: VercelResponse, route: ParsedRoute) {
  // PUT /api/admin/social/{id}/publish
  if (route.id && route.action === 'publish') {
    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const rows = await sql`
        UPDATE social_links SET is_published = NOT is_published WHERE id=${route.id} AND is_deleted=false RETURNING id, is_published
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to toggle publish' });
    }
  }

  // PUT /api/admin/social/{id}
  if (route.id && req.method === 'PUT') {
    const parsed = SocialSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { name, url, icon, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        UPDATE social_links SET name=${name}, url=${url}, icon=${icon},
        sort_order=${sort_order}, is_published=${is_published}
        WHERE id=${route.id} AND is_deleted=false RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update' });
    }
  }

  // DELETE /api/admin/social/{id}
  if (route.id && req.method === 'DELETE') {
    try {
      await sql`UPDATE social_links SET is_deleted=true WHERE id=${route.id}`;
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete' });
    }
  }

  // GET /api/admin/social
  if (req.method === 'GET') {
    try {
      const rows = await sql`SELECT * FROM social_links WHERE is_deleted=false ORDER BY sort_order ASC`;
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch social links' });
    }
  }

  // POST /api/admin/social
  if (req.method === 'POST') {
    const parsed = SocialSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { name, url, icon, sort_order, is_published } = parsed.data;
    try {
      const rows = await sql`
        INSERT INTO social_links (name, url, icon, sort_order, is_published)
        VALUES (${name}, ${url}, ${icon}, ${sort_order}, ${is_published}) RETURNING *
      `;
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create social link' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// ══════════════════════════════════════════════════════════════════════════
// MESSAGES
// ══════════════════════════════════════════════════════════════════════════

async function handleMessages(req: VercelRequest, res: VercelResponse, route: ParsedRoute) {
  // DELETE /api/admin/messages/{id}
  if (route.id && req.method === 'DELETE') {
    try {
      await sql`DELETE FROM contact_messages WHERE id=${route.id}`;
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete message' });
    }
  }

  // PUT /api/admin/messages/{id} — mark as read/unread
  if (route.id && req.method === 'PUT') {
    const is_read = req.body?.is_read ?? true;
    try {
      const rows = await sql`UPDATE contact_messages SET is_read=${is_read} WHERE id=${route.id} RETURNING id, is_read`;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update message' });
    }
  }

  // GET /api/admin/messages
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const rows = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

// ══════════════════════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════════════════════

async function handleStats(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const [projects, messages, views] = await Promise.all([
      sql`SELECT count(*) as total, count(*) FILTER (WHERE is_published=true) as published FROM web_projects`,
      sql`SELECT count(*) as total, count(*) FILTER (WHERE is_read=false) as unread FROM contact_messages`,
      sql`SELECT count(*) as total FROM analytics WHERE event='page_view'`,
    ]);

    return res.status(200).json({
      projects: { total: Number(projects[0].total), published: Number(projects[0].published) },
      messages: { total: Number(messages[0].total), unread: Number(messages[0].unread) },
      pageViews: Number(views[0].total),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

// ══════════════════════════════════════════════════════════════════════════
// PASSWORD
// ══════════════════════════════════════════════════════════════════════════

function handlePassword(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  return res.status(200).json({
    message: 'Password is managed via environment variables. Update ADMIN_PASSWORD_HASH in your .env.local and Vercel dashboard, then redeploy.',
  });
}

// ══════════════════════════════════════════════════════════════════════════
// UPLOAD (merged into admin handler since it requires auth)
// ══════════════════════════════════════════════════════════════════════════

async function handleUpload(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { data, filename } = req.body as { data: string; filename?: string };
  if (!data) return res.status(400).json({ error: 'Image data required' });

  try {
    const result = await cloudinary.uploader.upload(data, {
      folder: 'portfolio/projects',
      public_id: filename,
      overwrite: true,
      transformation: [{ width: 1200, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'auto' }],
    });
    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN DISPATCHER
// ══════════════════════════════════════════════════════════════════════════

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // All admin routes require authentication
  if (!(await requireAuth(req, res))) return;

  const route = parseAdminRoute(req);

  switch (route.resource) {
    case 'projects':
      return handleProjects(req, res, route);
    case 'web-projects':
      return handleWebProjects(req, res, route);
    case 'smm-projects':
      return handleSmmProjects(req, res, route);
    case 'skills':
      return handleSkills(req, res, route);
    case 'achievements':
      return handleAchievements(req, res, route);
    case 'social':
      return handleSocial(req, res, route);
    case 'messages':
      return handleMessages(req, res, route);
    case 'stats':
      return handleStats(req, res);
    case 'password':
      return handlePassword(req, res);
    case 'upload':
      return handleUpload(req, res);
    default:
      return res.status(404).json({ error: 'Not found' });
  }
}
