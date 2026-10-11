'use client';

import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import '../../styles/web-hero.css';
import { AINetworkBackground } from './hero/AINetworkBackground';
import { FloatingKPICard } from './hero/FloatingKPICard';
import { FloatingTerminal } from './hero/FloatingTerminal';
import { FloatingBrowser } from './hero/FloatingBrowser';
import { FloatingDashboard } from './hero/FloatingDashboard';
import { OrbitalTech } from './hero/OrbitalTech';

export function WebHero() {
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
    <>
    <section id="home" className="wh-new" onMouseMove={handleMouseMove}>
      <AINetworkBackground />
      <div className="wh-new__bg-glow wh-new__bg-glow--1" />
      <div className="wh-new__bg-glow wh-new__bg-glow--2" />

      <div className="wh-new__container">
        <OrbitalTech mouseX={springX} mouseY={springY} />
        
        {/* Centered Copy */}
        <motion.div 
          className="wh-new__copy"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="wh-new__title">
            <span className="wh-color-change">Shofar-X</span> builds<br/>
            Websites that <br/>
            grow your<br/>
            <span className="wh-color-change">business.</span>
          </h1>
          <p className="wh-new__subtitle">
            We craft fast, beautiful, and high-converting websites that turn your ideas into real results.
          </p>
          
          <div className="wh-new__actions">
            <button className="wh-new__cta wh-new__cta--primary" onClick={() => scrollToSection('projects')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              View Our Work
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </button>
            <button className="wh-new__cta wh-new__cta--accent" onClick={() => scrollToSection('contact')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Contact Us
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </button>
          </div>
        </motion.div>

        <div className="wh-new__floating-layer">
          <FloatingBrowser mouseX={springX} mouseY={springY} />
          <FloatingKPICard mouseX={springX} mouseY={springY} />
          <FloatingDashboard mouseX={springX} mouseY={springY} />
          <FloatingTerminal mouseX={springX} mouseY={springY} />
        </div>

      </div>
    </section>
    
    {/* Scroll Down Indicator placed after the hero section */}
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
    </>
  );
}
