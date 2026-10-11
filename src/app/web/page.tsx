import { Navbar } from '../../components/Navbar';
import { WebHero } from '../../components/web/WebHero';
import { Marquee } from '../../components/web/Marquee';
import { Services } from '../../components/web/Services';

import { Projects } from '../../components/web/Projects';

import { Contact } from '../../components/web/Contact';
import { Footer } from '../../components/web/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Website Development & Next.js Web Applications',
  description: 'Bespoke web development, Next.js web applications, e-commerce platforms, and blazing-fast digital experiences engineered to rank #1 and convert visitors into customers.',
  alternates: {
    canonical: 'https://shofarx.com/web',
  },
  openGraph: {
    title: 'Custom Website Development & Next.js Apps | Shofar-X',
    description: 'High-performance, scalable websites and custom web applications engineered to dominate search results and scale revenue.',
    url: 'https://shofarx.com/web',
    images: [{ url: '/shofarx-logo.webp', width: 1200, height: 630, alt: 'Shofar-X Web Development' }],
  },
};

const strengthsItems = [
  "Custom Builds", 
  "Fast Delivery", 
  "Mobile First", 
  "React", 
  "TypeScript", 
  "Next.js", 
  "Performance", 
  "SEO", 
  "UI/UX", 
  "Scalable"
];

const projectItems = [
  "E-Commerce Stores",
  "SaaS Platforms",
  "Corporate Websites",
  "Landing Pages",
  "Admin Dashboards",
  "Booking Systems",
  "Portfolios",
  "Marketplaces",
  "Web Applications",
  "Custom CMS"
];

export default function WebPage() {
  return (
    <div className="web-page-premium">
      <Navbar variant="web" />
      <WebHero />
      <div style={{ marginTop: '40px' }}></div>
      <Marquee items={strengthsItems} />
      <Services />
      <Marquee items={projectItems} direction="right" />

      <Projects />

      <Contact />
      <Footer />
    </div>
  );
}
