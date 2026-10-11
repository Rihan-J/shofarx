import type { NextApiRequest as VercelRequest, NextApiResponse as VercelResponse } from 'next';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { LoginSchema } from '../_validate';
import { applyRateLimit, getLoginRateLimit } from '../_ratelimit';

/**
 * Consolidated auth handler.
 * Routes: /api/auth/login, /api/auth/logout
 */

function getAuthRoute(req: VercelRequest): string {
  const slugQuery = req.query.slug;
  if (Array.isArray(slugQuery) && slugQuery.length > 0) {
    return slugQuery[0];
  }
  if (typeof slugQuery === 'string') {
    return slugQuery;
  }
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const segments = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  // /api/auth/login -> return 'login'
  return segments[segments.length - 1] || '';
}

// ── Login handler ───────────────────────────────────────────────────────

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit
  const limiter = getLoginRateLimit();
  if (limiter) {
    const allowed = await applyRateLimit(limiter, req, res);
    if (!allowed) return;
  }

  // Validate input
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@shofarx.com').trim();
  const rawHash = (process.env.ADMIN_PASSWORD_HASH || '').trim();
  const adminPasswordHash = rawHash.startsWith('$2')
    ? rawHash
    : '$2b$10$WechDRi43XT4cfGvNGMMO.iSfGrxIGPvLeTUqLhv2pLQLWqSrOZZi';
  const jwtSecret = (process.env.JWT_SECRET || 'shofarx_super_secret_jwt_key_2026_secure!').trim();
  const secret = new TextEncoder().encode(jwtSecret);

  // Check email matches
  if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Compare password against stored bcrypt hash
  const valid = await bcrypt.compare(password, adminPasswordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate signed JWT (expires in 24 hours)
  const token = await new SignJWT({ email: adminEmail, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('portfolio-admin')
    .setAudience('portfolio-api')
    .setExpirationTime('24h')
    .sign(secret);

  return res.status(200).json({ token });
}

// ── Logout handler ──────────────────────────────────────────────────────

function handleLogout(_req: VercelRequest, res: VercelResponse) {
  // Token is stored client-side; logout just confirms success
  return res.status(200).json({ message: 'Logged out' });
}

// ── Main dispatcher ─────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const route = getAuthRoute(req);

  switch (route) {
    case 'login':
      return handleLogin(req, res);
    case 'logout':
      return handleLogout(req, res);
    default:
      return res.status(404).json({ error: 'Not found' });
  }
}
