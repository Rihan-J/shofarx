'use client';

import React, { useEffect, useState } from 'react';
import { motion, MotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Home, Building2, Key, Store, Sparkles } from 'lucide-react';

interface Props {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const PROPERTY_TYPES = [
  { label: 'For Rent', icon: Key, color: '#3B82F6', tag: 'Residential', image: '/images/social/rent_property.png' },
  { label: 'For Sale', icon: Home, color: '#10B981', tag: '', image: '/images/social/sale_property.png' },
  { label: 'For Lease', icon: Building2, color: '#8B5CF6', tag: '', image: '/images/social/lease_property.png' },
  { label: 'Commercial', icon: Store, color: '#F59E0B', tag: 'Office Space', image: '/images/social/commercial_property.png' },
  { label: 'Any Property', icon: Sparkles, color: '#EC4899', tag: 'Real Estate', image: '/images/social/general_property.png' },
];

export function FloatingPropertyCard({ mouseX, mouseY }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const x = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const y = useTransform(mouseY, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROPERTY_TYPES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentProp = PROPERTY_TYPES[currentIndex];
  const ActiveIcon = currentProp.icon;
  const currentImage = currentProp.image;

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="wh-social-term"
      style={{
        width: '260px',
        height: '260px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
        position: 'absolute',
        top: 'calc(12% + 280px)',
        right: '6%',
        x, y
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={currentImage}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
          alt="Property"
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
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Property Promotions</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {PROPERTY_TYPES.map((_, i) => (
            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'background 0.3s ease' }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {currentProp.label}
                </div>
                {currentProp.tag && (
                  <div style={{ fontSize: '0.75rem', color: '#fff', marginTop: '2px', display: 'inline-block', padding: '2px 8px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', borderRadius: '12px', fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)' }}>
                    {currentProp.tag}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
