import type { Metadata } from 'next';
import { Inter, Lora, Outfit } from 'next/font/google';
import { Providers } from './providers';
import '../styles/globals.css';
import '../styles/web.css';
import '../styles/social.css';
import '../styles/social-v2.css';

// Initialize fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Shofar-X | World-Class Digital Agency',
  description: 'From blazing-fast interactive landing pages to full-scale custom web applications — we build digital machines that dominate your industry.',
  icons: {
    icon: [
      { url: '/shofarx-logo.webp', type: 'image/webp' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/shofarx-logo.webp',
    apple: '/shofarx-logo.webp',
  },
  openGraph: {
    title: 'Shofar-X | World-Class Digital Agency',
    description: 'Content, campaigns, and strategy engineered to turn everyday scroll attention into loyal paying customers.',
    url: 'https://shofarx.com',
    siteName: 'Shofar-X',
    images: [
      {
        url: '/shofarx-logo.webp',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/shofarx-logo.webp" type="image/webp" />
        <link rel="shortcut icon" href="/shofarx-logo.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/shofarx-logo.webp" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
