'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '../Reveal';
import '../../styles/case-studies-showcase.css';
import '../../styles/web-process.css';

const MILESTONES = [
  {
    num: '01',
    badge: '01 — Foundation',
    title: 'Discovery & Alignment',
    image: '/images/process/foundation-v3.png',
    bgIcon: '🔍',
    status: 'Initiated ⚡',
    desc: 'We dive deep into your brand, audience, and goals. We study competitors, define metrics, and map user journeys before a single pixel is designed.',
    deliverable: 'Complete Roadmap & Technical Spec Document',
  },
  {
    num: '02',
    badge: '02 — Blueprint',
    title: 'Architecture & Strategy',
    image: '/images/process/architecture-v3.png',
    bgIcon: '📐',
    status: 'Architected 📐',
    desc: 'We design the technical stack, user flows, and wireframes. Every decision documented — building a scalable foundation engineered for peak performance.',
    deliverable: 'Interactive Wireframes & Database Schema',
  },
  {
    num: '03',
    badge: '03 — Experience',
    title: 'UI/UX Design Systems',
    image: '/images/process/launch-v4.png',
    bgIcon: '🎨',
    status: 'Prototyped ✨',
    desc: 'Our designers craft pixel-perfect bespoke interfaces balancing stunning aesthetics with frictionless experiences. Every interaction is prototyped.',
    deliverable: 'High-Fidelity Figma Prototype & Design Tokens',
  },
  {
    num: '04',
    badge: '04 — Execution',
    title: 'Development & Engineering',
    image: '/images/process/development-v4.png',
    bgIcon: '💻',
    status: 'Engineered 🛠️',
    desc: 'We build with cutting-edge frameworks — lightning-fast load times, robust security, and seamless animations. Every line of code reviewed.',
    deliverable: 'Production-Ready Codebase & Automated QA Tests',
  },
  {
    num: '05',
    badge: '05 — Mastery',
    title: 'Launch & Infinite Scale',
    image: '/images/process/design-v4.png',
    bgIcon: '🚀',
    status: 'Live & Scaling 🌐',
    desc: 'After rigorous QA, we launch with a full go-live checklist. Ongoing optimization to maximize conversions and dominate rankings.',
    deliverable: 'Global Edge Deployment & Analytics Dashboard',
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

export function Process() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const activeMilestone = MILESTONES[currentIndex] || MILESTONES[0];

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el || MILESTONES.length <= 1) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= 0) {
        const scrolledDistance = -rect.top;
        const stepHeight = windowHeight * 1.5;
        const newIndex = Math.min(
          MILESTONES.length - 1,
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
  }, [MILESTONES.length]);

  return (
    <section
      id="process"
      className="w-section cs-showcase"
      ref={sectionRef}
      style={{ height: `${Math.max(1, MILESTONES.length) * 150}vh` }}
      aria-label="Our Process Milestones"
    >
      <div className="cs-showcase__pin">
        <div className="cs-showcase__inner" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-60px', left: '20px', zIndex: 10 }}>
            <Reveal>
              <p className="w-section__eyebrow">How We Work</p>
            </Reveal>
          </div>

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
              >
                <div className="cs-card__mac-dots">
                  <span className="mac-dot red"></span>
                  <span className="mac-dot yellow"></span>
                  <span className="mac-dot green"></span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(128,0,0,0.5)', marginLeft: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>How We Work</span>
                </div>
                
                <div className="cs-card__thumb" style={{ position: 'relative' }}>
                    <Image
                      src={activeMilestone.image}
                      alt={activeMilestone.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized={true}
                      className="cs-card__thumb-img"
                    />
                </div>

                <div className="cs-card__bg-icon">{activeMilestone.bgIcon}</div>

                <div className="cs-card__content">
                  <div className="cs-card__badge-row">
                    <span className="cs-card__category">{activeMilestone.badge}</span>
                    <span className="cs-card__counter">
                      {activeMilestone.num} / {String(MILESTONES.length).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="cs-card__title" style={{ marginTop: '10px' }}>{activeMilestone.title}</h3>
                  <p className="cs-card__desc">{activeMilestone.desc}</p>

                  <div className="cs-card__actions" style={{ marginTop: '20px' }}>
                    <span className="cs-card__btn" style={{ opacity: 0.9, cursor: 'default' }}>
                      {activeMilestone.status}
                    </span>
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
