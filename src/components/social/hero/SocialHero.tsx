'use client';

import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import '../../../styles/web-hero.css';
import { KarnatakaBackgroundSlider } from './KarnatakaBackgroundSlider';
import { AINetworkBackground } from '../../web/hero/AINetworkBackground';
import { SocialOrbitalTech } from './SocialOrbitalTech';
import { FloatingSmmStats } from './FloatingSmmStats';
import { FloatingServicesCard } from './FloatingServicesCard';
import { FloatingPhotosCard } from './FloatingPhotosCard';
import { FloatingPropertyCard } from './FloatingPropertyCard';

export function SocialHeroV2() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Parallax Engine (Normalized between -0.5 and 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for parallax so it doesn't instantly snap
  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Normalize coordinates: center of screen is 0, edges are -0.5 and 0.5
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  return (
    <div style={{ background: '#ffffff', position: 'relative' }}>
    <section id="home" className="wh-new" onMouseMove={handleMouseMove}>
      <KarnatakaBackgroundSlider />
      <AINetworkBackground />
      <div className="wh-new__bg-glow wh-new__bg-glow--1" />
      <div className="wh-new__bg-glow wh-new__bg-glow--2" />

      <div className="wh-new__container">
        <SocialOrbitalTech mouseX={springX} mouseY={springY} />
        
        {/* Centered Copy */}
        <motion.div 
          className="wh-new__copy social-hero-copy"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ paddingTop: '16px' }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
            @media (max-width: 768px) {
              .social-hero-copy {
                padding-top: 60px !important;
              }
            }
          `}</style>
          
          {/* Main Title Group (New Design + Old Content) */}
          <div style={{ textAlign: 'center', marginBottom: '0px' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0px' }}>
              {/* Sparkles / Accents SVG */}
              <svg style={{ position: 'absolute', top: '-10px', left: '-25px', width: '35px', height: '35px' }} viewBox="0 0 24 24" fill="none" stroke="#800020" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 12 l 6 -4" />
                <path d="M2 18 l 6 -2" />
                <path d="M10 4 l 2 6" />
              </svg>
              
              <h1 style={{ 
                fontFamily: '"Dancing Script", cursive', 
                color: '#800020', 
                fontSize: 'clamp(3.5rem, 9vw, 5rem)',
                lineHeight: 1,
                margin: 0,
                transform: 'rotate(-4deg)',
                paddingRight: '10px'
              }}>
                Shofar-X
              </h1>
              
              {/* Underline SVG */}
              <svg style={{ position: 'absolute', bottom: '-8px', left: '-5%', width: '110%', height: '20px', preserveAspectRatio: 'none' }} viewBox="0 0 100 20" fill="none" stroke="#800020" strokeWidth="3.5" strokeLinecap="round">
                <path d="M0 15 Q 50 0 100 8" />
              </svg>
            </div>
            
            <div style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 3.8rem)', 
              fontWeight: 800, 
              color: '#1a202c', 
              lineHeight: 1.1,
              marginTop: '4px',
              letterSpacing: '-1px'
            }}>
              Social Media
            </div>
            <div style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 3.8rem)', 
              fontWeight: 800, 
              color: '#800020', 
              lineHeight: 1.1,
              letterSpacing: '-1px'
            }}>
              Management
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '8px 0 8px' }}>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #800020)' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#800020' }} />
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #800020, transparent)' }} />
          </div>

          {/* Subtitles (Old Content) */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              fontSize: 'clamp(1rem, 3.2vw, 1.2rem)', 
              color: '#4a5568', 
              lineHeight: 1.3,
              maxWidth: '500px',
              margin: '0 auto',
              fontWeight: 500
            }}>
              boost your business with<br/>
              reels and promotions<br/>
              around <span className="wh-color-change" style={{ fontWeight: 700 }}>ಕರ್ನಾಟಕ</span>
            </p>
            <p className="wh-new__subtitle" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '4px auto 0' }}>
              Creative content, smart marketing, and real growth for your business.
            </p>
          </div>
          
          {/* Actions */}
          <div className="wh-new__actions" style={{ marginTop: '12px' }}>
            <button className="wh-new__cta wh-new__cta--primary" onClick={() => scrollToSection('projects')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              View Our Work
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </button>
            <button className="wh-new__cta wh-new__cta--primary" onClick={() => scrollToSection('contact')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Contact Us
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </button>
          </div>
        </motion.div>

        <div className="wh-new__floating-layer">
          {/* We omit FloatingTerminal to keep it uncluttered and match the new 3-element spec */}
          <FloatingSmmStats mouseX={springX} mouseY={springY} />
          <FloatingServicesCard mouseX={springX} mouseY={springY} />
          <FloatingPhotosCard mouseX={springX} mouseY={springY} />
          <FloatingPropertyCard mouseX={springX} mouseY={springY} />
        </div>

      </div>
    {/* Scroll Down Indicator moved INSIDE the hero section */}
    <motion.div 
      className="wh-scroll-indicator"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      onClick={() => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
    >
      <div className="wh-scroll-circle">
        <ArrowDown size={18} color="#fff" />
      </div>
      <span className="wh-scroll-text">SCROLL TO EXPLORE</span>
    </motion.div>
    
    </section>
    </div>
  );
}
