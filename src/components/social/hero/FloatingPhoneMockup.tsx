'use client';

import React, { useEffect, useState } from 'react';
import { motion, MotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useSocialProjects } from '../../../hooks/useApi';

interface Props {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export function FloatingPhoneMockup({ mouseX, mouseY }: Props) {
  const { data: projects = [], isLoading } = useSocialProjects();
  const [currentIndex, setCurrentIndex] = useState(0);

  const x = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  const y = useTransform(mouseY, [-0.5, 0.5], [8, -8]);

  const displayProjects = projects.filter(p => p.image_url);

  useEffect(() => {
    if (!displayProjects || displayProjects.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayProjects.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [displayProjects]);

  return (
    <motion.div
      initial={{ opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="wh-floating-browser" // Reusing the same grid slot class
      style={{
        width: '260px',
        height: '520px',
        borderRadius: '36px',
        border: '8px solid #111',
        boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
        background: '#fff',
        overflow: 'hidden',
        position: 'absolute',
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        x, y
      }}
    >
      {/* Phone Notch */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120px',
        height: '24px',
        background: '#111',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
        zIndex: 30
      }}></div>

      {/* Full Screen Image */}
      <div style={{ position: 'relative', width: '100%', height: '100%', background: '#f5f5f5', borderRadius: '28px', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#999' }}>Loading...</span>
          </div>
        ) : displayProjects.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            >
              <img
                src={displayProjects[currentIndex].image_url}
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                alt={displayProjects[currentIndex].title}
              />
              
              {/* Gradient overlay for text readability */}
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0, height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                pointerEvents: 'none'
              }} />

              {/* Text Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '32px',
                left: '20px',
                right: '20px',
                zIndex: 10
              }}>
                <div style={{ 
                  display: 'inline-block',
                  padding: '4px 8px',
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Case Study
                </div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.2 }}>
                  {displayProjects[currentIndex].title}
                </h3>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#999' }}>No visual posts</span>
          </div>
        )}
      </div>

      {/* Soft Glass Reflection */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-50%',
        width: '200%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 40%)',
        pointerEvents: 'none',
        zIndex: 20
      }}></div>

    </motion.div>
  );
}
