'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { Heart, MessageCircle, Share2, Bookmark, Clapperboard, Smartphone } from 'lucide-react';

interface Props {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

// 10 Icons exactly as requested
const SMM_ICONS = [
  { icon: FaInstagram, size: 24, color: '#E1306C' },
  { icon: FaFacebookF, size: 24, color: '#1877F2' },
  { icon: FaWhatsapp, size: 24, color: '#25D366' },
  { icon: FaYoutube, size: 24, color: '#FF0000' },
  { icon: Heart, size: 24, color: '#FF3B30' },
  { icon: MessageCircle, size: 24, color: '#007AFF' },
  { icon: Share2, size: 24, color: '#34C759' },
  { icon: Bookmark, size: 24, color: '#FF9500' },
  { icon: Clapperboard, size: 24, color: '#AF52DE' },
  { icon: Smartphone, size: 24, color: '#5856D6' },
];

export function SocialOrbitalTech({ mouseX, mouseY }: Props) {
  // Ultra subtle parallax for the entire orbit ring
  const x = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const y = useTransform(mouseY, [-0.5, 0.5], [5, -5]);

  return (
    <div className="wh-orbital-container">
      <motion.div 
        className="wh-orbital-motion"
        style={{ x, y }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="wh-orbit-ring" style={{ animationDuration: '60s' }}>
          {SMM_ICONS.map((IconData, index) => {
            // Calculate initial position on the circle (360 degrees / total icons)
            const angle = (index / SMM_ICONS.length) * 360;
            return (
              <div 
                key={index} 
                className="wh-orbit-icon-wrapper"
                style={{
                  transform: `rotate(${angle}deg) translateX(var(--orbit-radius, 350px)) rotate(-${angle}deg)`
                }}
              >
                <div className="wh-orbit-icon-inner" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', width: '56px', height: '56px' }}>
                  <IconData.icon size={IconData.size} color={IconData.color} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
