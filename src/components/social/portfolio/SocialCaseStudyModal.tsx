'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram } from 'lucide-react';
import { SocialCaseStudy } from './types';
import { useLenis } from '../SocialLenis';

interface ModalProps {
  project: SocialCaseStudy | null;
  onClose: () => void;
}

export function SocialCaseStudyModal({ project, onClose }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      lenis?.stop();
      // iOS Safari specific fix
      const preventDefault = (e: TouchEvent) => e.preventDefault();
      document.addEventListener('touchmove', preventDefault, { passive: false });
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        lenis?.start();
        document.removeEventListener('touchmove', preventDefault);
      };
    }
  }, [project, lenis]);

  if (!mounted || !project) return null;

  return createPortal(
    <AnimatePresence>
      <div className="sx-modal-overlay" onClick={onClose}>
        <motion.button 
          className="sx-modal-close-fixed"
          onClick={onClose}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 99999,
            color: '#000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <X size={24} />
        </motion.button>

        <motion.div 
          className="sx-modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Hero */}
          <div className="sx-modal-hero">
            <h2 className="sx-modal-title" style={{ marginTop: '24px' }}>{project.title}</h2>
            <span className="sx-modal-category">Social Media</span>
          </div>

          <div className="sx-modal-body" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
            <div className="sx-sidebar-block" style={{ maxWidth: '400px' }}>
              <h4>Overview</h4>
              <p>{project.description}</p>
            </div>

            {project.project_link && (
              <div className="sx-sidebar-block">
                <h4>Social Links</h4>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                  <a href={project.project_link} target="_blank" rel="noreferrer" style={{ color: '#e1306c', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, textDecoration: 'none' }}>
                    <Instagram size={28} />
                    View Profile
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
