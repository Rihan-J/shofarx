'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPhoneAlt, FaBars, FaTimes } from 'react-icons/fa';

export const NAV_LINKS = [
  { label: 'Home',     id: 'home' },
  { label: 'Expertise',    id: 'services' },
  { label: 'Our Work', id: 'projects' },
  { label: 'Contact',  id: 'contact'  },
] as const;

export function scrollTo(id: string) {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = id;
    }
  }, 50);
}

export function Navbar({ variant = 'web' }: { variant?: 'web' | 'social' }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);




  const links = variant === 'web' ? NAV_LINKS : [
    { label: 'Home',        id: 'home' },
    { label: 'Expertise',       id: 'services' },
    { label: 'Case Studies', id: 'projects' },
    { label: 'Contact',     id: 'contact'  },
  ];

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 40);
      for (let i = links.length - 1; i >= 0; i--) {
        const el = document.getElementById(links[i].id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActive(links[i].id);
          return;
        }
      }
      setActive('');
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [links]);

  const prefix = variant === 'web' ? 'wn' : 'sn';

  return (
    <nav className={`${prefix}--pill ${scrolled ? `${prefix}--solid` : ''}`} aria-label="Page navigation">
      <div className={`${prefix}__logo-container`}>
        <a href="/" aria-label="Home" className={`${prefix}__logo-link`}>
          <Image src="/shofarx-logo.png" alt="Shofar-X Logo" width={120} height={28} className={`${prefix}__logo-img`} style={{ height: '28px', width: 'auto' }} priority />
        </a>
      </div>
      
      <ul className={`${prefix}__list ${mobileMenuOpen ? `${prefix}__list--open` : ''}`}>
        <button 
          className={`${prefix}__mobile-close-overlay`} 
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu overlay"
        />
        <div className={`${prefix}__list-inner`}>
        {links.map(({ label, id }) => (
          <li key={id}>
            <button
              className={`${prefix}__btn ${active === id ? `${prefix}__btn--on` : ''}`}
              onClick={() => { scrollTo(id); setMobileMenuOpen(false); }}
              id={`${variant}-nav-${id}`}
            >
              {label}
            </button>
          </li>
        ))}
        <li className={`${prefix}__mobile-cta`}>
          <button className={`${prefix}__cta-pill ${prefix}__cta-pill--mobile`} onClick={() => { scrollTo('contact'); setMobileMenuOpen(false); }}>
            <FaPhoneAlt size={11} />
            <span>Let's Talk</span>
          </button>
        </li>
        </div>
      </ul>
      
      <div className={`${prefix}__right-actions`}>
        <button className={`${prefix}__cta-pill`} onClick={() => scrollTo('contact')}>
          <FaPhoneAlt size={11} />
          <span>Let's Talk</span>
        </button>
        <button className={`${prefix}__hamburger`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
          {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>
    </nav>
  );
}
