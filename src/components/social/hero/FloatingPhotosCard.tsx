'use client';

import React, { useEffect, useState } from 'react';
import { motion, MotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useSocialProjects } from '../../../hooks/useApi';

interface Props {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export function FloatingPhotosCard({ mouseX, mouseY }: Props) {
  const { data: projects = [], isLoading } = useSocialProjects();
  const [currentIndex, setCurrentIndex] = useState(0);

  const x = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  const y = useTransform(mouseY, [-0.5, 0.5], [8, -8]);

  const displayProjects = projects.filter(p => p.image_url && p.category === 'social');

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
      className="wh-social-browser"
      style={{
        width: '260px',
        height: '260px',
        borderRadius: '24px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
        position: 'absolute',
        top: '12%',
        right: '6%',
        overflow: 'hidden',
        x, y
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000' }}>
        {isLoading ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#999' }}>Loading...</span>
          </div>
        ) : displayProjects.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={displayProjects[currentIndex].image_url}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
              alt={displayProjects[currentIndex].title}
            />
          </AnimatePresence>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#999' }}>No photos available</span>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.8) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Recent Captures</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {displayProjects.map((_, i) => (
            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'background 0.3s ease' }} />
          ))}
        </div>
      </div>
      
      {displayProjects.length > 0 && (
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                {displayProjects[currentIndex].title}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
