'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface Props {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function FloatingEngagementCardV2({ containerRef }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Animated counter
    const target = { val: 0 };
    const counterTween = gsap.to(target, {
      val: 124500,
      duration: prefersReducedMotion ? 0 : 2.5,
      delay: 1,
      ease: 'power3.out',
      onUpdate: () => {
        const num = Math.floor(target.val);
        if (num >= 1000) {
          setDisplayValue((num / 1000).toFixed(1) + 'k');
        } else {
          setDisplayValue(String(num));
        }
      },
    });

    // Mouse parallax via quickTo
    const qx = gsap.quickTo(card, 'x', { duration: 0.5, ease: 'power3' });
    const qy = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      qx((relX - 0.5) * -40);
      qy((relY - 0.5) * 20);
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Entrance
    gsap.from(card, {
      opacity: 0,
      scale: 0.8,
      y: 20,
      duration: prefersReducedMotion ? 0 : 0.7,
      delay: 0.7,
      ease: 'power2.out',
    });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      counterTween.kill();
    };
  }, [containerRef]);

  return (
    <div ref={cardRef} className="sx-engagement" aria-label="Engagement metric: 124.5K new likes">
      <div className="sx-engagement__icon" aria-hidden="true">♥</div>
      <div>
        <span ref={valueRef} className="sx-engagement__value">{displayValue}</span>
        <div className="sx-engagement__label">New Likes</div>
      </div>
    </div>
  );
}
