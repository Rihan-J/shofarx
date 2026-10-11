'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '../Reveal';
import { useSocialProjects } from '../../hooks/useApi';
import '../../styles/case-studies-showcase.css';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  project_link: string | null;
  category: string;
  created_at: string;
}

const FALLBACK_SOCIAL_PROJECTS: Project[] = [
  {
    id: 201,
    title: 'Verve Energy Drink Launch Campaign',
    description: 'Orchestrated a viral TikTok and Instagram Reels campaign generating 14M+ organic views and a 320% surge in D2C sales in just 14 days.',
    image_url: null,
    project_link: 'https://example.com/verve',
    category: 'Viral Growth Campaign',
    created_at: new Date().toISOString(),
  },
  {
    id: 202,
    title: 'Luxe Athletics Influencer Ecosystem',
    description: 'Recruited and managed 150+ micro and macro fitness creators, driving $1.2M in attributed revenue through custom gamified referral loops.',
    image_url: null,
    project_link: 'https://example.com/luxe',
    category: 'Influencer Marketing',
    created_at: new Date().toISOString(),
  },
  {
    id: 203,
    title: 'Zeno Tech B2B LinkedIn Dominance',
    description: 'Transformed founder personal branding and corporate content pipeline, resulting in a 450% increase in inbound enterprise demo requests.',
    image_url: null,
    project_link: 'https://example.com/zeno',
    category: 'B2B Brand Authority',
    created_at: new Date().toISOString(),
  },
];

const cardVariants: any = {
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

export function SocialProjects() {
  const { data: fetchedProjects = [], isLoading } = useSocialProjects();
  const projects = fetchedProjects.length > 0 ? fetchedProjects : FALLBACK_SOCIAL_PROJECTS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const activeProject = projects[currentIndex] || projects[0];

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el || projects.length <= 1) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When sticky container pins at top: 0, rect.top goes from 0 to -(projects.length - 1) * stepHeight
      if (rect.top <= 0) {
        const scrolledDistance = -rect.top;
        const stepHeight = windowHeight * 0.70;
        const newIndex = Math.min(
          projects.length - 1,
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
  }, [projects.length]);

  return (
    <section
      id="projects"
      className="w-section cs-showcase"
      ref={sectionRef}
      style={{ height: `${Math.max(1, projects.length) * 70}vh` }}
      aria-label="Case Studies"
    >
      <div className="cs-showcase__pin">
        <div className="cs-showcase__inner">
          <Reveal>
            <p className="w-section__eyebrow">Portfolio</p>
            <h2 className="w-section__heading">Our Work</h2>
          </Reveal>

          {isLoading && (
            <div className="wpr__state" role="status">
              <div className="wpr__spinner" aria-hidden="true" />
              <p>Loading case studies…</p>
            </div>
          )}

          {!isLoading && projects.length > 0 && (
            <div className="cs-showcase__stage">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.article
                  key={activeProject.id}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="cs-card cs-card--social"
                  id={`social-project-${activeProject.id}`}
                >
                  <div className="cs-card__thumb">
                    {activeProject.image_url ? (
                      <Image
                        src={activeProject.image_url}
                        alt={activeProject.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="cs-card__thumb-img"
                      />
                    ) : (
                      <div className="cs-card__thumb-placeholder" aria-hidden="true">
                        <span>📱</span>
                      </div>
                    )}
                  </div>

                  <div className="cs-card__content">
                    <div className="cs-card__badge-row">
                      <span className="cs-card__category">{activeProject.category || 'Viral Campaign'}</span>
                      <span className="cs-card__counter">
                        {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="cs-card__title">{activeProject.title}</h3>
                    <p className="cs-card__desc">{activeProject.description}</p>

                    <div className="cs-card__actions">
                      {activeProject.project_link && activeProject.project_link.trim() !== '' ? (
                        <a
                          href={activeProject.project_link.startsWith('http') ? activeProject.project_link : `https://${activeProject.project_link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cs-card__btn"
                        >
                          View Case Study ↗
                        </a>
                      ) : (
                        <span className="cs-card__btn" style={{ opacity: 0.85, cursor: 'default' }}>
                          Campaign Preview ✨
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

