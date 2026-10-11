'use client';

import React, { useEffect, useState } from 'react';
import { motion, MotionValue, useTransform, AnimatePresence } from 'framer-motion';

interface Props {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const STATS = [
  { label: 'Total Reach', value: '14.2M+' },
  { label: 'Engagement Rate', value: '8.4%' },
  { label: 'New Followers', value: '124K' },
  { label: 'Qualified Leads', value: '3,200+' },
  { label: 'Video Views', value: '45M+' }
];

export function FloatingSmmStats({ mouseX, mouseY }: Props) {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  const x = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const y = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % STATS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentStat = STATS[currentStatIndex];

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="wh-floating-kpi"
      style={{
        width: '240px',
        padding: '24px',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        top: '15%',
        position: 'absolute',
        x, y
      }}
    >
      <div className="wh-kpi-glow" style={{ background: 'var(--accent-primary)', opacity: 0.1 }} />
      <div className="wh-kpi-content-wrap" style={{ alignItems: 'center', textAlign: 'center' }}>
        <div className="wh-kpi-subtitle" style={{ color: 'var(--accent-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
          SMM Performance
        </div>
        <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStatIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="wh-kpi-value"
            >
              {currentStat.value}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="wh-kpi-bottom-row" style={{ marginTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px', justifyContent: 'center' }}>
        <div className="wh-kpi-stat" style={{ textAlign: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStatIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ color: '#666', fontSize: '0.85rem', fontWeight: 500 }}
            >
              {currentStat.label}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
