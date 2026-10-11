import { Navbar } from '../../components/Navbar';
import { SocialHeroV2 } from '../../components/social/hero/SocialHero';
import { Marquee } from '../../components/web/Marquee';
import { SocialPricing } from '../../components/social/SocialPricing';
import { SocialPortfolioSection } from '../../components/social/portfolio/SocialPortfolioSection';
import { SocialCreativeServices } from '../../components/social/SocialCreativeServices';
import { SocialContact } from '../../components/social/SocialContact';
import { SocialFooter } from '../../components/social/SocialFooter';
import { SocialLenis } from '../../components/social/SocialLenis';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Marketing | Shofar-X',
  description: 'Content, campaigns, and strategy engineered to turn everyday scroll attention into loyal paying customers.',
};

export default function SocialPage() {
  const marqueeItems = [
    'REELS', 'PROMOTIONS', 'GROWTH', 'CONTENT', 'CAMPAIGNS', 'ENGAGEMENT', 'STRATEGY', 'BRANDING', 'CONVERSIONS'
  ];

  return (
    <SocialLenis>
      <div className="sx-page">
        <Navbar variant="social" />
        <SocialHeroV2
          badge="Shofar-X Social Media"
          titleLine1="Grow Your Brand."
          titleLine2=""
          titleLine3="Scale Your Reach."
          tagline="CONTENT · CAMPAIGNS · CONVERSIONS"
          subline="Content, campaigns, and strategy designed to turn attention into revenue."
          primaryCtaText="Explore Our Work"
          secondaryCtaText="Free Strategy Call"
          primaryCtaLink="projects"
          secondaryCtaLink="contact"
        />
        <Marquee items={marqueeItems} direction="left" />
        <SocialPricing />
        <SocialPortfolioSection />
        {/* Phase 2+ sections will be added here */}
        {/* Other sections have been removed per request */}
        <SocialCreativeServices />
        <SocialContact />
        <SocialFooter />
      </div>
    </SocialLenis>
  );
}
