'use client';

import React from 'react';
import '../../styles/marquee.css';

interface MarqueeProps {
  items: string[];
  direction?: 'left' | 'right';
  className?: string;
}

export function Marquee({ items, direction = 'left', className = '' }: MarqueeProps) {
  // Duplicate the items array so the CSS animation can seamlessly loop back to the start.
  // The CSS translates exactly -50%, meaning it scrolls exactly one full array length.
  const doubledItems = [...items, ...items];
  const trackClass = direction === 'right' ? 'wh-marquee-track reverse' : 'wh-marquee-track';

  return (
    <section className={`wh-marquee-section ${className}`} aria-label="Scrolling Text Marquee">
      <div className={trackClass}>
        {doubledItems.map((item, index) => (
          <div key={index} className="wh-marquee-item">
            <span className="wh-marquee-dot"></span>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
