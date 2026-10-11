'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import '../styles/landing.css';

export default function LandingPage() {
  const [hoveredPanel, setHoveredPanel] = useState<'left' | 'right' | null>(null);
  const router = useRouter();

  return (
    <div className="landing-root">
      {/* Brand Header */}
      <header className="landing-brand">
        <Link href="/" className="brand-logo" aria-label="Shofar-X Home">
          <Image 
            src="/shofarx-logo.png" 
            alt="Shofar-X Logo" 
            width={120} 
            height={28} 
            style={{ height: '28px', width: 'auto' }} 
            priority 
          />
        </Link>
        <div className="brand-tagline">
          Digital Agency
        </div>
      </header>

      {/* Left Panel: Website Development */}
      <section 
        className={`landing-panel landing-panel--left ${
          hoveredPanel === 'left' ? 'is-hovered' : hoveredPanel === 'right' ? 'is-shrunk' : ''
        }`}
        onMouseEnter={() => setHoveredPanel('left')}
        onMouseLeave={() => setHoveredPanel(null)}
        onClick={() => router.push('/web')}
      >
        <div className="panel-bg-accent" />
        <span className="panel-number">01</span>

        <div className="panel-content">
          <div className="panel-label">Agency Division · 01</div>
          <h1 className="panel-title">
            Website<br />Development
          </h1>
          <p className="panel-subtitle">
            From high-converting landing pages to full-scale custom web applications — engineered to dominate your digital niche.
          </p>
          <Link href="/web" className="panel-cta" onClick={(e) => e.stopPropagation()}>
            <span>Explore Web Agency</span>
            <ArrowRight size={16} className="panel-cta-arrow" />
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="landing-divider" />

      {/* Right Panel: Social Media Marketing */}
      <section 
        className={`landing-panel landing-panel--right ${
          hoveredPanel === 'right' ? 'is-hovered' : hoveredPanel === 'left' ? 'is-shrunk' : ''
        }`}
        onMouseEnter={() => setHoveredPanel('right')}
        onMouseLeave={() => setHoveredPanel(null)}
        onClick={() => router.push('/social')}
      >
        <div className="panel-bg-accent" />
        <span className="panel-number">02</span>

        <div className="panel-content">
          <div className="panel-label">Agency Division · 02</div>
          <h2 className="panel-title">
            Social Media<br />Marketing
          </h2>
          <p className="panel-subtitle">
            Viral reels, content strategy, brand storytelling, and paid campaigns designed to turn scroll attention into paying customers.
          </p>
          <Link href="/social" className="panel-cta" onClick={(e) => e.stopPropagation()}>
            <span>Explore Social Agency</span>
            <ArrowRight size={16} className="panel-cta-arrow" />
          </Link>
        </div>
      </section>

      {/* Scroll / Navigation Hint on Desktop */}
      <div className="landing-scroll-hint">
        <span className="scroll-hint-text">Choose Division</span>
        <div className="scroll-hint-line" />
      </div>
    </div>
  );
}
