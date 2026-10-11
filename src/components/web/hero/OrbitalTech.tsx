'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { heroConfig } from './heroConfig';

interface Props {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const ICONS = heroConfig.orbitalIcons;

export function OrbitalTech({ mouseX, mouseY }: Props) {
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
        <div className="wh-orbit-ring">
          {ICONS.map((IconData, index) => {
            // Calculate initial position on the circle (360 degrees / total icons)
            const angle = (index / ICONS.length) * 360;
            return (
              <div 
                key={index} 
                className="wh-orbit-icon-wrapper"
                style={{
                  transform: `rotate(${angle}deg) translateX(var(--orbit-radius, 350px)) rotate(-${angle}deg)`
                }}
              >
                <div className="wh-orbit-icon-inner">
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
