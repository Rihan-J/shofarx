import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shofar-X | World-Class Digital Agency',
    short_name: 'Shofar-X',
    description: 'Premier digital agency specializing in custom web applications, UI/UX architecture, and viral social media marketing.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080808',
    theme_color: '#8b0000',
    icons: [
      {
        src: '/shofarx-logo.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
      {
        src: '/shofarx-logo.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
  };
}
