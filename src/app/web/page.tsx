import { Navbar } from '../../components/Navbar';
import { WebHero } from '../../components/web/WebHero';
import { Marquee } from '../../components/web/Marquee';
import { Services } from '../../components/web/Services';

import { Projects } from '../../components/web/Projects';

import { Contact } from '../../components/web/Contact';
import { Footer } from '../../components/web/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Website Development | Shofar-X',
  description: 'High-performance, scalable websites that drive results and elevate your brand online.',
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
