'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '../Reveal';
import '../../styles/case-studies-showcase.css';
import '../../styles/social-process.css';

const SOCIAL_MILESTONES = [
  {
    num: '01',
    badge: '01 — Audit',
    title: 'Strategy & Audience Audit',
    bgIcon: '🎯',
    status: 'Analyzed 🔍',
    desc: 'We dissect your brand, competitors, and target demographics. We build a bulletproof content strategy designed to capture attention and exploit platform algorithms.',
    deliverable: 'Comprehensive Social Strategy & Content Pillars',
  },
  {
    num: '02',
    badge: '02 — Creation',
    title: 'Viral Content Production',
    bgIcon: '🎬',
    status: 'Shooting 📸',
    desc: 'Our creative team scripts, shoots, and edits high-retention content. From short-form reels to high-end photography, we produce assets engineered for virality.',
    deliverable: 'Monthly Batch of Ready-to-Post Assets',
  },
  {
    num: '03',
    badge: '03 — Distribution',
    title: 'Omnichannel Publishing',
    bgIcon: '🚀',
    status: 'Live 🌐',
    desc: 'We manage your posting schedule across Instagram, TikTok, LinkedIn, and YouTube. Optimizing hashtags, posting times, and formats for maximum organic reach.',
    deliverable: 'Automated Content Calendar & Scheduling',
  },
  {
    num: '04',
    badge: '04 — Community',
    title: 'Engagement & Authority',
    bgIcon: '💬',
    status: 'Growing 🌱',
    desc: 'We actively engage with your followers, reply to comments, and network with creators. Building a loyal, hyper-engaged community around your brand identity.',
    deliverable: 'Daily Community Management & Outreach',
  },
  {
    num: '05',
    badge: '05 — Scale',
    title: 'Analytics & Paid Amplification',
    bgIcon: '📈',
    status: 'Scaling 💸',
    desc: 'We analyze the data to see what hits. We double down on winning content by putting ad spend behind it, turning viral moments into predictable revenue streams.',
    deliverable: 'Monthly Performance Reports & Ad Campaigns',
  },
];

const milestoneCardVariants: any = {
  enter: (dir: number) => ({
    x: dir > 0 ? 140 : -140,
    opacity: 0,
    rotateY: dir > 0 ? 12 : -12,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 65,
      damping: 18,
      mass: 1.4,
    },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 140 : -140,
    opacity: 0,
    rotateY: dir < 0 ? 12 : -12,
    scale: 0.92,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function SocialProcess() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const activeMilestone = SOCIAL_MILESTONES[currentIndex] || SOCIAL_MILESTONES[0];

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el || SOCIAL_MILESTONES.length <= 1) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= 0) {
        const scrolledDistance = -rect.top;
        const stepHeight = windowHeight * 1.5;
        const newIndex = Math.min(
          SOCIAL_MILESTONES.length - 1,
          Math.max(0, Math.floor((scrolledDistance + stepHeight * 0.35) / stepHeight))
        );

        setCurrentIndex((prevIndex) => {
          if (newIndex !== prevIndex) {
            setDirection(newIndex > prevIndex ? 1 : -1);
            return newIndex;
          }
          return prevIndex;
        });
      } else if (rect.top > 0) {
        setCurrentIndex((prevIndex) => {
          if (prevIndex !== 0) {
            setDirection(-1);
            return 0;
          }
          return prevIndex;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="process"
      className="w-section cs-showcase social-process-section"
      ref={sectionRef}
      style={{ height: `${Math.max(1, SOCIAL_MILESTONES.length) * 150}vh` }}
      aria-label="How We Work"
    >
      <div className="cs-showcase__pin">
        <div className="cs-showcase__inner">
          <Reveal>
            <p className="w-section__eyebrow">Our Process</p>
            <h2 className="w-section__heading">How We Go Viral</h2>
          </Reveal>

          <div className="cs-showcase__stage">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.article
                key={activeMilestone.num}
                custom={direction}
                variants={milestoneCardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="cs-card"
                id={`social-process-${activeMilestone.num}`}
              >
                <div className="cs-card__thumb">
                  <div className="cs-card__thumb-placeholder" style={{ background: 'linear-gradient(135deg, #e11d48 0%, #111 100%)' }}>
                    <span style={{ fontSize: '6rem' }}>{activeMilestone.bgIcon}</span>
                  </div>
                </div>

                <div className="cs-card__content">
                  <div className="cs-card__badge-row">
                    <span className="cs-card__category" style={{ color: 'var(--accent-primary)' }}>{activeMilestone.badge}</span>
                    <span className="cs-card__counter">
                      {String(currentIndex + 1).padStart(2, '0')} / {String(SOCIAL_MILESTONES.length).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="cs-card__title">{activeMilestone.title}</h3>
                  <p className="cs-card__desc">{activeMilestone.desc}</p>
                  
                  <div className="cs-card__actions" style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      <span style={{ color: 'var(--accent-primary)' }}>Deliverable:</span> {activeMilestone.deliverable}
                    </p>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
