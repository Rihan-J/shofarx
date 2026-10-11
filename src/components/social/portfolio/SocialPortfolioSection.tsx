'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';
import { SocialCaseStudy } from './types';
import { SocialCaseStudyModal } from './SocialCaseStudyModal';
import '../../../styles/social-portfolio.css';

const DEFAULT_CASE_STUDIES: SocialCaseStudy[] = [
  {
    id: 14,
    title: 'complaintbox.orgs',
    description: 'ComplaintBox is a promotional social media platform that highlights local businesses, public issues, and community voices. It is managed to create engaging content, increase visibility, and connect audiences with brands through targeted promotions and collaborations.',
    image_url: 'https://res.cloudinary.com/dzjhoaoxv/image/upload/v1775395162/Screenshot_2026-04-05_184610_svpy4a.png',
    project_link: 'https://www.instagram.com/complaintbox.orgs/',
    category: 'social',
    sort_order: 1,
    is_published: true,
  },
  {
    id: 15,
    title: 'GOODSGAADI',
    description: 'GoodsGaadi is a digital platform for buying and selling commercial goods vehicles. It showcases verified listings, connects buyers and sellers, and promotes vehicles through engaging content for easy and reliable transactions.',
    image_url: 'https://res.cloudinary.com/dzjhoaoxv/image/upload/v1775396782/Screenshot_2026-04-05_191440_nxcsh7.png',
    project_link: 'https://www.instagram.com/goodsgaadi/',
    category: 'social',
    sort_order: 2,
    is_published: true,
  },
  {
    id: 23,
    title: 'Royal Collection',
    description: 'Royal Collection is a premium fashion wearshop offering trendy and high-quality clothing. Discover the latest collections and elevate your style with our exclusive apparel.',
    image_url: '/images/social/royal_collection.png',
    project_link: 'https://www.instagram.com/royal_collection_officialsmg/?hl=en',
    category: 'social',
    sort_order: 3,
    is_published: true,
  }
];

export function SocialPortfolioSection() {
  const [projects, setProjects] = useState<SocialCaseStudy[]>(DEFAULT_CASE_STUDIES);
  const [selectedProject, setSelectedProject] = useState<SocialCaseStudy | null>(null);

  useEffect(() => {
    fetch('/api/social-case-studies')
      .then((res) => res.json())
      .then((data: SocialCaseStudy[]) => {
        if (!Array.isArray(data)) return;
        const filteredData = data.filter(p => 
          p.title.toLowerCase().includes('complaintbox') || 
          p.title.toLowerCase().includes('goodsgaadi') ||
          p.title.toLowerCase().includes('royal')
        );
        if (filteredData.length > 0) {
          setProjects(filteredData);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch social projects:', err);
      });
  }, []);



  return (
    <section className="sx-portfolio-section" id="portfolio">
      <div className="sx-portfolio-bg-blob sx-portfolio-bg-blob--1" />
      <div className="sx-portfolio-bg-blob sx-portfolio-bg-blob--2" />
      
      <div className="sx-portfolio-container">
        {/* Header */}
        <motion.div 
          className="sx-portfolio-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="sx-portfolio-badge">Our Work</span>
          <h2 className="sx-portfolio-title">Real Businesses. Real Results.</h2>
          <p className="sx-portfolio-subtitle">
            Showcase how Shofar-X helps businesses grow through creative social media management, engaging content, professional branding, and high-quality visual storytelling.
          </p>
        </motion.div>

        <div className="sx-portfolio-layout" style={{ display: 'block' }}>
          {/* Portfolio Grid */}
          <div className="sx-portfolio-grid">
            {projects.map((project, i) => (
              <motion.div 
                key={project.id}
                className="sx-portfolio-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="sx-card-img-wrap">
                  <img src={project.image_url} alt={project.title} className="sx-card-img" loading="lazy" />
                  <div className="sx-card-overlay">
                    <div className="sx-card-category">Social Media</div>
                    <h4 className="sx-card-title">{project.title}</h4>
                    <p className="sx-card-desc">{project.description}</p>
                    <div className="sx-card-footer">
                      <div className="sx-card-btn">
                        View Details <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {selectedProject && (
        <SocialCaseStudyModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
}
