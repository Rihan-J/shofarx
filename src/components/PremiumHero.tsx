'use client';
import React, { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useMousePosition } from '../hooks/useMousePosition';
import { FloatingAnalyticsCard } from './FloatingAnalyticsCard';

// ── Cinematic Word Reveal ─────────────────────────
function WordReveal({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} className="hero-word" style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
          <motion.span
            className={`hero-word-inner ${className}`}
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      )).reduce<React.ReactNode[]>((acc, el, i) => {
        if (i > 0) acc.push('\u00A0'); // Non-breaking space
        acc.push(el);
        return acc;
      }, [])}
    </>
  );
}

// ── Handwriting Text Reveal ───────────────────────
function HandwritingText({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="hero-title-italic" style={{ position: 'relative', display: 'inline-block', color: 'var(--accent-primary)' }}>
      <WordReveal text={text} delay={delay} className="hero-title-italic" />
      {/* SVG Underline that draws from left to right */}
      <svg className="premium-underline" viewBox="0 0 300 20" preserveAspectRatio="none">
        <defs>
          <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="var(--accent-primary)" />
            <stop offset="80%" stopColor="var(--accent-primary)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <motion.path
          className="premium-underline-path"
          d="M 10,10 Q 150,15 290,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: delay + 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </span>
  );
}

// ── Animated Counter ──────────────────────────────
function AnimatedStat({ value, label, suffix = '', delay = 0 }: { value: number | null; label: string; suffix?: string; delay?: number }) {
  return (
    <motion.div 
      className="premium-stat-pill"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {value === null ? '-' : value}{value !== null ? suffix : ''}
      </span>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
    </motion.div>
  );
}

// ── Premium Hero ──────────────────────────────────
export interface PremiumHeroProps {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  tagline: string;
  subline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaLink: string;
  stats: { value: number | null; label: string; suffix: string }[];
  highlights?: React.ReactNode;
}

export function PremiumHero({
  badge,
  titleLine1,
  titleLine2,
  titleLine3,
  tagline,
  subline,
  primaryCtaText,
  secondaryCtaText,
  primaryCtaLink,
  secondaryCtaLink,
  stats,
  highlights
}: PremiumHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const mousePosition = useMousePosition();
  
  // Window dimensions for mouse calculations
  const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const winHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
  
  // Calculate normalized mouse positions (-1 to 1)
  const mouseX = mousePosition.x === 0 ? 0 : (mousePosition.x / winWidth) * 2 - 1;
  const mouseY = mousePosition.y === 0 ? 0 : (mousePosition.y / winHeight) * 2 - 1;

  // Parallax spring calculations based on mouse position
  const springConfig = { damping: 25, stiffness: 150 };
  const parallaxX_light = useSpring(mouseX * 15, springConfig);
  const parallaxY_light = useSpring(mouseY * 15, springConfig);
  const parallaxX_heavy = useSpring(mouseX * 30, springConfig);
  const parallaxY_heavy = useSpring(mouseY * 30, springConfig);
  // Tilt calculations removed since they are not used directly inside the component body yet.

  // Spotlight position
  const spotlightX = mousePosition.x;
  const spotlightY = mousePosition.y;

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="wh premium-hero-bg" ref={containerRef} aria-label="Hero" style={{ overflow: 'hidden', position: 'relative' }}>
      
      {/* ── Background Layers (Parallaxed) ── */}
      <div className="premium-hero-grain" />
      <motion.div 
        className="premium-hero-mesh" 
        style={{ x: parallaxX_light, y: parallaxY_light }}
      />
      
      {/* Mouse Spotlight */}
      <div 
        className="premium-hero-spotlight"
        style={{ 
          left: spotlightX, 
          top: spotlightY,
          opacity: mousePosition.x === 0 ? 0 : 1 // Hide until mouse moves
        }}
      />

      {/* ── Content Layers ── */}
      <div className="premium-hero-content">
        
        {/* Cinematic badge */}
        <motion.span
          className="wh__badge"
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.05)' }}
        >
          ✦ {badge}
        </motion.span>

        {/* Cinematic word-by-word title reveal */}
        <motion.h1 
          className="wh__title"
          style={{ x: parallaxX_heavy, y: parallaxY_heavy, perspective: '1000px' }}
        >
          <WordReveal text={titleLine1} delay={0.4} />
          <br />
          <WordReveal text={titleLine2} delay={0.6} />
          <br />
          <HandwritingText text={titleLine3} delay={0.8} />
        </motion.h1>

        <motion.p
          className="wh__tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          style={{ fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)' }}
        >
          {tagline.split(' · ').join('\u00A0\u00A0·\u00A0\u00A0')}
        </motion.p>

        <motion.p
          className="wh__sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
        >
          {subline}
        </motion.p>

        {highlights && (
          <motion.div
            className="sh__highlights"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px', marginBottom: '8px' }}
          >
            {highlights}
          </motion.div>
        )}

        <motion.div
          className="wh__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <button 
            className="wh__cta wh__cta--primary magnetic-btn magnetic-btn-premium" 
            onClick={() => handleScroll(primaryCtaLink)} 
            id="hero-primary-cta"
            style={{ boxShadow: '0 8px 24px rgba(128, 0, 0, 0.2)' }}
          >
            {primaryCtaText}
            <span className="wh__arrow" aria-hidden="true">↓</span>
          </button>
          <button 
            className="wh__cta wh__cta--ghost magnetic-btn" 
            onClick={() => handleScroll(secondaryCtaLink)} 
            id="hero-secondary-cta"
            style={{ border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}
          >
            {secondaryCtaText}
          </button>
        </motion.div>

        {/* Analytics Card (Desktop Only) */}
        <FloatingAnalyticsCard 
          parallaxX={parallaxX_light} 
          parallaxY={parallaxY_light} 
        />

        {/* Floating Stats Banner */}
        <div className="premium-stats-banner">
          {stats.map((stat, idx) => (
            <AnimatedStat 
              key={stat.label} 
              value={stat.value} 
              label={stat.label} 
              suffix={stat.suffix} 
              delay={2.1 + (idx * 0.15)} 
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="premium-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 2.8 }}
        >
          <span>Scroll</span>
          <div className="premium-scroll-arrow" />
        </motion.div>
        
      </div>
      
      {/* Animated Divider */}
      <div className="premium-divider-wrapper">
        <div className="premium-divider-dot" />
      </div>
    </section>
  );
}
