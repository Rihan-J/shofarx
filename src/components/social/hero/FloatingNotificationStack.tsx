'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface Props {
  containerRef: React.RefObject<HTMLElement | null>;
}

const NOTIFICATIONS = [
  { id: 1, icon: '👤', text: 'New follower started following you' },
  { id: 2, icon: '💬', text: 'Alex commented: "This is amazing!"' },
  { id: 3, icon: '🔥', text: 'Your reel is trending in tech' },
];

export function FloatingNotificationStackV2({ containerRef }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const notifRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set all notifs hidden initially
    notifRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, x: 50, scale: 0.9 });
    });

    // Build repeating timeline
    let tl: gsap.core.Timeline | undefined;
    if (!prefersReducedMotion) {
      tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

      NOTIFICATIONS.forEach((_, i) => {
        const el = notifRefs.current[i];
        if (!el) return;

        // Show this notification
        tl!.to(el, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        }, i === 0 ? '+=2' : '+=2.5');

        // Hide it after a pause
        tl!.to(el, {
          opacity: 0,
          x: 50,
          scale: 0.9,
          duration: 0.35,
          ease: 'power2.in',
        }, `>+2`);
      });
    } else {
      // Reduced motion — show first notification statically
      const first = notifRefs.current[0];
      if (first) gsap.set(first, { opacity: 1, x: 0, scale: 1 });
    }

    // Mouse parallax
    const qx = gsap.quickTo(wrapper, 'x', { duration: 0.6, ease: 'power3' });
    const qy = gsap.quickTo(wrapper, 'y', { duration: 0.6, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      qx((relX - 0.5) * 30);
      qy((relY - 0.5) * -15);
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      tl?.kill();
    };
  }, [containerRef]);

  return (
    <div ref={wrapperRef} className="sx-notifs" aria-live="polite" aria-label="Live notifications">
      {NOTIFICATIONS.map((notif, i) => (
        <div
          key={notif.id}
          ref={(el) => { notifRefs.current[i] = el; }}
          className="sx-notif"
        >
          <span className="sx-notif__icon" aria-hidden="true">{notif.icon}</span>
          <span className="sx-notif__text">{notif.text}</span>
        </div>
      ))}
    </div>
  );
}
