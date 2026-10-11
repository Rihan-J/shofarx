import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai', 'cohere-ai', 'OAI-SearchBot'],
        allow: ['/', '/web', '/social', '/llms.txt'],
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://shofarx.com/sitemap.xml',
    host: 'https://shofarx.com',
  };
}
