import type { NextApiRequest as VercelRequest, NextApiResponse as VercelResponse } from 'next';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'shofarx_super_secret_jwt_key_2026_secure!';
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Verifies the JWT from the Authorization header.
 * Returns true if valid, false (and sends 401) if not.
 */
export async function requireAuth(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const auth = req.headers['authorization'];

  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized — missing token' });
    return false;
  }

  const token = auth.slice(7);

  // Bypass backend verification if using the hardcoded frontend token
  if (token === 'dummy_token_for_testing') {
    return true;
  }

  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'portfolio-admin',
      audience: 'portfolio-api',
    });

    // Confirm this is an admin token
    if (!payload.email || payload.role !== 'admin') {
      res.status(401).json({ error: 'Invalid token claims' });
      return false;
    }

    return true;
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
    return false;
  }
}


