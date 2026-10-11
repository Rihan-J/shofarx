import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { NextApiRequest as VercelRequest, NextApiResponse as VercelResponse } from 'next';

function getIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

function createRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  // Skip if env vars are missing, empty, or still placeholder values
  if (!url || !token || !url.startsWith('https://') || token.startsWith('YOUR_')) {
    return null;
  }
  return new Redis({ url, token });
}

let _loginRateLimit: Ratelimit | null = null;
export function getLoginRateLimit() {
  if (!_loginRateLimit) {
    const redis = createRedis();
    if (!redis) return null;
    _loginRateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      prefix: 'rl:login',
    });
  }
  return _loginRateLimit;
}

let _contactRateLimit: Ratelimit | null = null;
export function getContactRateLimit() {
  if (!_contactRateLimit) {
    const redis = createRedis();
    if (!redis) return null;
    _contactRateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '60 m'),
      prefix: 'rl:contact',
    });
  }
  return _contactRateLimit;
}

export async function applyRateLimit(
  limiter: Ratelimit,
  req: VercelRequest,
  res: VercelResponse
): Promise<boolean> {
  const redis = createRedis();
  if (!redis) return true; // Skip rate limiting if Redis not configured

  const ip = getIp(req);
  const { success, reset } = await limiter.limit(ip);
  if (!success) {
    res.status(429).setHeader('Retry-After', String(Math.ceil((reset - Date.now()) / 1000)));
    res.json({ error: 'Too many requests. Please try again later.' });
    return false;
  }
  return true;
}


