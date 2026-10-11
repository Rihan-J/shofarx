import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from './_auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await requireAuth(req, res))) return;

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


