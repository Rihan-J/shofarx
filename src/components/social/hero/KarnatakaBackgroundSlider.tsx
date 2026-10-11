'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/images/karnataka/hampi.png',
  '/images/karnataka/mysore.png',
  '/images/karnataka/coorg.png',
  '/images/karnataka/jogfalls.png',
  '/images/karnataka/gokarna.png',
  '/images/karnataka/vidhanasoudha.png',
  '/images/karnataka/western_ghats.png',
];

export function KarnatakaBackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden'
    }}>
      <style>{`
        .bg-mobile-uplift {
          object-position: center center;
        }
        @media (max-width: 768px) {
          .bg-mobile-uplift {
            /* Uplift the background image on mobile by shifting its position up */
            object-position: center 100% !important;
          }
        }
      `}</style>
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="bg-mobile-uplift"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          alt="Karnataka Background"
        />
      </AnimatePresence>
      
      {/* 80% Light Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1
      }} />
    </div>
  );
}
