import type { NextApiRequest as VercelRequest, NextApiResponse as VercelResponse } from 'next';
import { sql } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rows = await sql`
      SELECT * FROM web_projects 
      WHERE category LIKE 'social%' AND is_published = true 
      ORDER BY sort_order ASC, created_at DESC
    `;
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Failed to fetch social case studies:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
