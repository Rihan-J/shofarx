'use client';

import React, { useEffect, useState } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { heroConfig } from './heroConfig';

const SHOWCASE_WEB_PROJECTS = [
  { id: 101, title: 'Goodsgaadi', image_url: '/showcase/goodsgaadi.webp', category: 'Logistics' },
  { id: 102, title: 'HHmart Billing', image_url: '/showcase/hhmart_billing.webp', category: 'POS / Billing' },
  { id: 103, title: 'HHmart Dashboard', image_url: '/showcase/hhmart_dashboard.webp', category: 'Dashboard' },
  { id: 104, title: 'No Due Cert Generator', image_url: '/showcase/No_Due_Certificate_Generator(PESIAMS).webp', category: 'Automation' },
  { id: 105, title: 'Personal Portfolio', image_url: '/showcase/Personal_Portfolio.webp', category: 'Portfolio' },
  { id: 106, title: 'Prizzo', image_url: '/showcase/prizzo.webp', category: 'E-Commerce' },
  { id: 107, title: 'Tetcyee Billing', image_url: '/showcase/tetcyee_billing.webp', category: 'POS / Billing' },
  { id: 108, title: 'Tetcyee Website', image_url: '/showcase/tetcyee_website.webp', category: 'Corporate' },
  { id: 109, title: 'Time Table PWA', image_url: '/showcase/Time_Table_PWA(PESIAMS).webp', category: 'PWA' }
];

interface Props {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export function FloatingBrowser({ mouseX, mouseY }: Props) {
  const projects = SHOWCASE_WEB_PROJECTS;
  const isLoading = false;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const x = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  const y = useTransform(mouseY, [-0.5, 0.5], [8, -8]);

  useEffect(() => {
    if (!projects || projects.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, heroConfig.browser.slideDurationMs);
    return () => clearInterval(interval);
  }, [projects]);

  return (
    <motion.div
      style={{ x, y }}
      initial={{ opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="wh-floating-browser"
    >
      <div className="wh-browser-header">
        <div className="wh-term-dots">
          <span className="wh-term-dot red" />
          <span className="wh-term-dot yellow" />
          <span className="wh-term-dot green" />
        </div>
        <div className="wh-browser-url">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', verticalAlign: 'middle'}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          {heroConfig.browser.domain}
        </div>
        <div className="wh-browser-actions">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
      </div>
      <div className="wh-browser-body">
        {isLoading || !projects.length ? (
          <div className="wh-browser-skeleton">
            <img src={placeholderSvg} alt="Loading..." style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div className="wh-shimmer" />
          </div>
        ) : (
          projects.map((project: any, idx: number) => {
            const hasError = failedImages[idx] || !project.image_url;
            return (
              <div
                key={project.id || idx}
                className={`wh-browser-slide ${idx === currentIndex ? 'active' : ''}`}
              >
                {!hasError && project.image_url && (
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => setFailedImages(p => ({ ...p, [idx]: true }))} 
                  />
                )}
                
                {hasError && (
                  <div className="wh-browser-fallback">
                    <div className="wh-browser-mockup-brand">Shofar-X</div>
                    <div className="wh-browser-mockup-title">{project.title || "Digital Solutions"}</div>
                    <div className="wh-browser-mockup-btn">{project.category || "View Project"}</div>
                    <div className="wh-browser-mockup-dots">
                      <span className="active"></span><span></span><span></span><span></span>
                    </div>
                  </div>
                )}
                
                {!hasError && (
                  <div className="wh-browser-overlay">
                    <div className="wh-browser-overlay-tag">{project.category}</div>
                    <div className="wh-browser-overlay-title">{project.title}</div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
