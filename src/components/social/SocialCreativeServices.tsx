'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Home, Play, ArrowRight, X, Instagram, Globe } from 'lucide-react';
import { useSocialProjects } from '../../hooks/useApi';
import type { WebProject } from '../../types';
import '../../styles/social-creative.css';

import { createPortal } from 'react-dom';
import { useLenis } from './SocialLenis';

interface GalleryModalProps {
  isOpen: boolean;
  title: string;
  projects: WebProject[];
  fallbackImage: string;
  onClose: () => void;
}

function VideoGalleryItem({ item, i }: { item: WebProject, i: number }) {
  const [duration, setDuration] = React.useState<string | null>(null);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.target as HTMLVideoElement;
    if (video.duration && !isNaN(video.duration) && video.duration !== Infinity) {
      const minutes = Math.floor(video.duration / 60);
      const seconds = Math.floor(video.duration % 60);
      setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
  };

  return (
    <motion.div 
      className="sx-video-modal-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.1 }}
    >
      <video 
        src={item.image_url} 
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay
        loop
        muted
        playsInline 
      />
      
      <div className="sx-video-modal-overlay">

        {duration && (
          <div className="sx-video-duration-badge">{duration}</div>
        )}
      </div>
    </motion.div>
  );
}

function GalleryModal({ isOpen, title, projects, fallbackImage, onClose }: GalleryModalProps) {
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    setMounted(true);
  }, []);

  // If no projects, provide a dummy array to show the premium empty state
  const displayItems = projects.length > 0 ? projects : [];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      lenis?.start();
    };
  }, [isOpen, lenis]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="sx-creative-modal"
          data-lenis-prevent="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button className="sx-creative-modal-close" onClick={onClose} aria-label="Close Gallery">
            <X size={24} />
          </button>
          
          <div className="sx-creative-modal-grid">
            {displayItems.length === 0 ? (
              <div className="sx-creative-empty-state">
                <div className="sx-creative-empty-icon">
                  <Video size={48} />
                </div>
                <h3>No Media Available</h3>
                <p>Upload new videos or photos from the admin panel to showcase your creative work.</p>
              </div>
            ) : (
              displayItems.map((item, i) => {
                if ((item.image_url || '').includes('.mp4')) {
                  return <VideoGalleryItem key={item.id} item={item} i={i} />;
                }
                return (
                  <motion.div 
                    key={item.id}
                    className="sx-creative-modal-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <img src={item.image_url || fallbackImage} alt={item.title} />
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function SocialCreativeServices() {
  const { data: projects = [] } = useSocialProjects();
  
  const [activeModal, setActiveModal] = useState<'Photography' | 'Videography' | 'Property Promotions' | null>(null);

  // Group projects by category
  const photographyProjects = projects.filter(p => p.category?.toLowerCase().includes('photo'));
  const videographyProjects = projects.filter(p => p.category?.toLowerCase().includes('video'));
  const propertyProjects = projects.filter(p => p.category?.toLowerCase().includes('prop') || p.category?.toLowerCase().includes('real'));

  const handleCardClick = (category: 'Photography' | 'Videography' | 'Property Promotions') => {
    setActiveModal(category);
  };

  return (
    <section className="sx-creative-section">
      <div className="sx-creative-bg-shape sx-creative-bg-shape-1" />
      <div className="sx-creative-bg-shape sx-creative-bg-shape-2" />

      <div className="sx-creative-container">
        {/* Header */}
        <motion.div 
          className="sx-creative-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="sx-creative-badge">Creative Services</div>
          <h2 className="sx-creative-title">
            <span>Capture Attention.</span>
            <span>Create Impact.</span>
          </h2>
          <p className="sx-creative-subtitle">
            Professional photography, cinematic videography, and high-converting property promotions designed to help your brand stand out.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="sx-creative-grid">
          
          {/* Card 1: Photography */}
          <motion.div 
            className="sx-creative-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onClick={() => handleCardClick('Photography')}
          >
            <div className="sx-creative-card-bg">
              <img 
                src={photographyProjects[0]?.image_url || "/images/social/photography.png"} 
                alt="Photography" 
              />
            </div>
            <div className="sx-creative-overlay" />
            <div className="sx-creative-glass" />
            
            <div className="sx-creative-content">
              
              <h3 className="sx-creative-card-title">Photography</h3>
              <div className="sx-creative-hover-cta">
                View Gallery <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Videography */}
          <motion.div 
            className="sx-creative-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => handleCardClick('Videography')}
          >
            <div className="sx-creative-card-bg">
              {(videographyProjects[0]?.image_url || "/images/social/videography.png").includes('.mp4') ? (
                <video 
                  src={videographyProjects[0]?.image_url || "/images/social/videography.png"} 
                  autoPlay loop muted playsInline 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <img 
                  src={videographyProjects[0]?.image_url || "/images/social/videography.png"} 
                  alt="Videography" 
                />
              )}
            </div>
            <div className="sx-sweep" />
            <div className="sx-play-btn">
              <Play size={32} fill="currentColor" />
            </div>
            <div className="sx-creative-overlay" />
            
            <div className="sx-creative-content">
              
              <h3 className="sx-creative-card-title">Videography</h3>
              <div className="sx-creative-hover-cta">
                View Gallery <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Property Promotions */}
          <motion.div 
            className="sx-creative-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="sx-creative-card-bg">
              <img 
                src={propertyProjects[0]?.image_url || "/images/social/general_property.png"} 
                alt="Property Promotions" 
              />
            </div>
            <div className="sx-creative-overlay" />
            <div className="sx-creative-glass" />
            
            <div className="sx-creative-content">
              
              <h3 className="sx-creative-card-title">Property Promotions</h3>
              <div className="sx-creative-links" style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', marginTop: '24px' }}>
                <a href="https://www.instagram.com/propertiesforrents?igsh=MWUxNHI3NG93emVzcw==" target="_blank" rel="noreferrer" className="sx-creative-link-btn insta">
                  <Instagram size={16} /> Instagram
                </a>
                <a href="https://www.propertiesforrents.com/" target="_blank" rel="noreferrer" className="sx-creative-link-btn web">
                  <Globe size={16} /> Website
                </a>
              </div>
            </div>
          </motion.div>
      </div>
      </div>

      <GalleryModal 
        isOpen={activeModal === 'Photography'} 
        title="Photography" 
        projects={photographyProjects} 
        fallbackImage="/images/social/photography.png"
        onClose={() => setActiveModal(null)} 
      />
      
      <GalleryModal 
        isOpen={activeModal === 'Videography'} 
        title="Videography" 
        projects={videographyProjects} 
        fallbackImage="/images/social/videography.png"
        onClose={() => setActiveModal(null)} 
      />
    </section>
  );
}
