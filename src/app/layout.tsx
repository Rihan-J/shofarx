import type { Metadata, Viewport } from 'next';
import { Inter, Lora, Outfit } from 'next/font/google';
import Script from 'next/script';
import { Providers } from './providers';
import '../styles/globals.css';
import '../styles/web.css';
import '../styles/social.css';
import '../styles/social-v2.css';

// Initialize fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://shofarx.com'),
  title: {
    default: 'Shofar-X | World-Class Digital Agency | Web Development & Social Media Marketing',
    template: '%s | Shofar-X',
  },
  description: 'Shofar-X is a premier digital agency engineering high-performance Next.js websites, custom web applications, viral social media marketing (SMM), and commercial creative production designed to dominate your market.',
  applicationName: 'Shofar-X',
  keywords: [
    'Shofar-X',
    'ShofarX',
    'Shofar X',
    'shofarx.com',
    'Digital Agency',
    'Website Development Agency',
    'Next.js Web Development',
    'React Web Design',
    'Social Media Marketing Agency',
    'SMM Agency Karnataka',
    'Digital Marketing Agency India',
    'UI UX Design Agency',
    'Commercial Photography Bangalore',
    'Videography Production',
    'E-commerce Website Development',
    'Performance Marketing Agency',
    'Web Development Karnataka',
    'Best Digital Agency 2026',
  ],
  authors: [{ name: 'Shofar-X Team', url: 'https://shofarx.com' }],
  creator: 'Shofar-X',
  publisher: 'Shofar-X',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://shofarx.com',
  },
  icons: {
    icon: [
      { url: '/shofarx-logo.webp', type: 'image/webp' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/shofarx-logo.webp',
    apple: '/shofarx-logo.webp',
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Shofar-X | World-Class Digital Agency',
    description: 'Bespoke web applications, high-converting digital storefronts, and viral social media marketing strategies that scale your revenue.',
    url: 'https://shofarx.com',
    siteName: 'Shofar-X',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/shofarx-logo.webp',
        width: 1200,
        height: 630,
        alt: 'Shofar-X Digital Agency Logo & Brand',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shofar-X | World-Class Digital Agency',
    description: 'Bespoke web applications and viral social media marketing engineered to turn attention into revenue.',
    images: ['/shofarx-logo.webp'],
    creator: '@shofarx',
  },
  category: 'technology',
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Shofar-X',
  alternateName: ['ShofarX', 'Shofar X', 'Shofar-X Digital Agency'],
  url: 'https://shofarx.com',
  logo: 'https://shofarx.com/shofarx-logo.webp',
  image: 'https://shofarx.com/shofarx-logo.webp',
  description: 'Shofar-X is a premier digital engineering and social media marketing agency specializing in high-performance web development, custom Next.js web applications, UI/UX architecture, performance marketing, viral reels, and commercial media production.',
  email: 'contact@shofarx.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'State', name: 'Karnataka' },
    { '@type': 'City', name: 'Bengaluru' },
    { '@type': 'AdministrativeArea', name: 'Worldwide' },
  ],
  sameAs: [
    'https://www.instagram.com/shofarx.media',
    'https://github.com/Rihan-J/shofarx',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Shofar-X Core Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Web Development & Next.js Applications',
          description: 'High-speed, SEO-optimized web applications, e-commerce storefronts, and bespoke landing pages built with React and Next.js.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Social Media Marketing & Brand Scaling',
          description: 'Performance-driven social media management, organic reel production, influencer campaigns, and paid customer acquisition.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Commercial Photography & 4K Videography',
          description: 'High-end commercial product shoots, fashion lookbooks, interior visual showcases, and branded corporate videography.',
        },
      },
    ],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Shofar-X?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shofar-X is an elite digital agency providing cutting-edge website development, custom Next.js web application engineering, and viral social media marketing solutions designed to scale modern businesses.',
      },
    },
    {
      '@type': 'Question',
      name: 'What services does Shofar-X offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shofar-X specializes in two primary divisions: Website Engineering (custom web applications, e-commerce stores, responsive landing pages, UI/UX design) and Social Media Marketing (growth strategies, short-form reels, paid ad campaigns, commercial photography, and 4K videography).',
      },
    },
    {
      '@type': 'Question',
      name: 'Why choose Shofar-X for website development?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shofar-X builds digital machines with modern technologies like React, Next.js, and TypeScript, delivering 95+ PageSpeed scores, built-in SEO and AEO optimization, fluid micro-interactions, and secure database architectures.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where does Shofar-X operate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shofar-X operates primarily from Karnataka, India, serving clients across Bengaluru, Karnataka, India, and internationally with modern remote workflows.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I start a project with Shofar-X?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can easily start by selecting either Web Development or Social Media Marketing on shofarx.com, exploring our case studies, and submitting a quick consultation request through our interactive contact forms.',
      },
    },
  ],
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
        {/* Schema.org Structured Data for SEO, GEO & AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
