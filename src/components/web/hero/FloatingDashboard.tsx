'use client';

import React, { useEffect, useState } from 'react';
import { motion, MotionValue, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { heroConfig } from './heroConfig';

interface Props {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export function FloatingDashboard({ mouseX, mouseY }: Props) {
  const x = useTransform(mouseX, [-0.5, 0.5], [8, -8]);
  const y = useTransform(mouseY, [-0.5, 0.5], [-10, 10]);
  
  const [seoScore, setSeoScore] = useState(0);
  const [perfScore, setPerfScore] = useState(0);
  const [accessScore, setAccessScore] = useState(0);

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const currentSet = heroConfig.dashboard.sets[currentSetIndex];

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setCurrentSetIndex(prev => (prev + 1) % heroConfig.dashboard.sets.length);
    }, heroConfig.dashboard.intervalMs);
    return () => clearInterval(interval);
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    let startPerf = perfScore;
    let startSeo = seoScore;
    let startAcc = accessScore;
    
    const { performance: targetPerf, seo: targetSeo, accessibility: targetAcc } = currentSet.metrics;
    const duration = heroConfig.dashboard.animationDurationMs;
    const frames = duration / 16;
    
    let timer: number;
    let frameCount = 0;

    const update = () => {
      frameCount++;
      const progress = frameCount / frames;
      
      if (progress < 1) {
        setPerfScore(Math.round(startPerf + (targetPerf - startPerf) * progress));
        setSeoScore(Math.round(startSeo + (targetSeo - startSeo) * progress));
        setAccessScore(Math.round(startAcc + (targetAcc - startAcc) * progress));
        timer = requestAnimationFrame(update);
      } else {
        setPerfScore(targetPerf);
        setSeoScore(targetSeo);
        setAccessScore(targetAcc);
      }
    };
    timer = requestAnimationFrame(update);
    return () => cancelAnimationFrame(timer);
  }, [currentSetIndex, isInView]);

  return (
    <motion.div
      style={{ x, y }}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="wh-floating-dash"
    >
      <div ref={ref} className="wh-dash-header-row">
        <span className="wh-dash-title">{heroConfig.dashboard.title}</span>
        <span className="wh-dash-dropdown">{heroConfig.dashboard.dropdownLabel}</span>
      </div>
      <div className="wh-dash-metrics">
        <div className="wh-dash-metric">
          <div className="wh-dash-circle">
            <svg viewBox="0 0 36 36">
              <path className="wh-dash-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="wh-dash-fill perf-red" strokeDasharray={`${perfScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="wh-dash-val">{perfScore}</div>
          </div>
          <div className="wh-dash-label">
            <AnimatePresence mode="wait">
              <motion.div key={currentSet.labels.performance} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>{currentSet.labels.performance}</motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="wh-dash-metric">
          <div className="wh-dash-circle">
            <svg viewBox="0 0 36 36">
              <path className="wh-dash-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="wh-dash-fill seo-green" strokeDasharray={`${seoScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="wh-dash-val">{seoScore}</div>
          </div>
          <div className="wh-dash-label">
            <AnimatePresence mode="wait">
              <motion.div key={currentSet.labels.seo} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>{currentSet.labels.seo}</motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="wh-dash-metric">
          <div className="wh-dash-circle">
            <svg viewBox="0 0 36 36">
              <path className="wh-dash-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="wh-dash-fill access-blue" strokeDasharray={`${accessScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="wh-dash-val">{accessScore}</div>
          </div>
          <div className="wh-dash-label">
            <AnimatePresence mode="wait">
              <motion.div key={currentSet.labels.accessibility} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>{currentSet.labels.accessibility}</motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="wh-dash-bottom">
        <div className="wh-dash-chart-red">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none">
            <path d="M0,25 L10,22 L20,24 L30,15 L40,18 L50,10 L60,15 L70,5 L80,10 L90,2 L100,5 L100,30 L0,30 Z" fill="var(--accent-primary-dim)" />
            <path d="M0,25 L10,22 L20,24 L30,15 L40,18 L50,10 L60,15 L70,5 L80,10 L90,2 L100,5" fill="none" stroke="var(--accent-primary)" strokeWidth="2" />
          </svg>
        </div>
        <div className="wh-dash-growth">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          <AnimatePresence mode="wait">
            <motion.div key={currentSet.growthVal} initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} className="wh-dash-growth-val">{currentSet.growthVal}</motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div key={currentSet.growthLbl} initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} className="wh-dash-growth-lbl">{currentSet.growthLbl}</motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
