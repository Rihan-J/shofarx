'use client';

import React, { useState, useEffect } from 'react';
import { motion, MotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Camera, Video } from 'lucide-react';

interface Props {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const SERVICES = [
  { id: 1, title: 'Photography', icon: Camera, color: '#E1306C', image: 'photography.png' },
  { id: 2, title: 'Videography', icon: Video, color: '#1877F2', image: 'videography.png' },
];

export function FloatingServicesCard({ mouseX, mouseY }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SERVICES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const x = useTransform(mouseX, [-0.5, 0.5], [8, -8]);
  const y = useTransform(mouseY, [-0.5, 0.5], [-10, 10]);

  const activeService = SERVICES[activeIndex];
  const ActiveIcon = activeService.icon;

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="wh-social-dash"
      style={{
        width: '260px',
        height: '260px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
        position: 'absolute',
        top: 'calc(15% + 260px)',
        left: '6%',
        x, y
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={activeService.id}
          src={`/images/social/${activeService.image}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
          alt={activeService.title}
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.8) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Core Services</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {SERVICES.map((_, i) => (
            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'background 0.3s ease' }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`overlay-${activeService.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {activeService.title}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
