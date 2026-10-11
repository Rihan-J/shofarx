'use client';

import React, { useEffect, useState } from 'react';
import { motion, MotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { heroConfig } from './heroConfig';

interface Props {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export function FloatingKPICard({ mouseX, mouseY }: Props) {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  // Parallax constraints (move maximum 12px based on mouse value -0.5 to 0.5)
  const x = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const y = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % heroConfig.kpi.stats.length);
    }, heroConfig.kpi.intervalMs);
    return () => clearInterval(interval);
  }, []);

  const currentStat = heroConfig.kpi.stats[currentStatIndex];

  return (
    <motion.div
      style={{ x, y }}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="wh-floating-kpi"
    >
      <div className="wh-kpi-glow" />
      <div className="wh-kpi-content-wrap">
        <div className="wh-kpi-subtitle">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          {heroConfig.kpi.title}
        </div>
        <div className="wh-kpi-value">{heroConfig.kpi.value}</div>
      </div>
      
      <div className="wh-kpi-bottom-row">
        <div className="wh-kpi-stat">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStatIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div className="wh-kpi-stat-val">⚡ {currentStat.label}</div>
              <div className="wh-kpi-stat-lbl">{currentStat.value}</div>
            </motion.div>
          </AnimatePresence>
          <div className="wh-kpi-chart">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0,25 C20,25 30,15 50,15 C70,15 80,5 100,5 L100,30 L0,30 Z" fill="rgba(16, 185, 129, 0.1)" />
              <path d="M0,25 C20,25 30,15 50,15 C70,15 80,5 100,5" fill="none" stroke="#10B981" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
