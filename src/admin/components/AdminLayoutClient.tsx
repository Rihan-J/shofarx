'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Megaphone, Share2, Mail, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Home', end: true },
  { to: '/admin/projects', icon: <FolderKanban size={18} />, label: 'Projects' },
  { to: '/admin/smm', icon: <Megaphone size={18} />, label: 'SMM' },
  { to: '/admin/social', icon: <Share2 size={18} />, label: 'Social Media' },
  { to: '/admin/messages', icon: <Mail size={18} />, label: 'Inbox' },
  { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Exclude login page from rendering this layout frame
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="admin-layout">
      <header className={`admin-navbar ${scrolled ? 'admin-navbar--scrolled' : ''}`}>
        <nav className="admin-navbar__inner">
          <Link href="/admin/dashboard" className="admin-navbar__logo">
            <Image src="/shofarx-logo.png" alt="Shofar-X Logo" width={100} height={24} className="admin-navbar__logo-image" style={{ width: 'auto', height: '24px' }} />
            <span className="admin-navbar__brand">Admin</span>
          </Link>

          <ul className="admin-navbar__links">
            {navItems.map((item) => {
              const isActive = item.end 
                ? pathname === item.to 
                : pathname.startsWith(item.to);

              return (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    className={`admin-navbar__link ${isActive ? 'admin-navbar__link--active' : ''}`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        className="admin-navbar__link-indicator"
                        layoutId="adminNavIndicator"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="admin-navbar__actions">
            <Link href="/" target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--icon" title="View Portfolio" style={{ border: 'none' }}>
              <ExternalLink size={20} />
            </Link>
            <button className="btn btn--primary admin-navbar__logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>LOGOUT</span>
            </button>
            <button
              className="admin-navbar__menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="admin-navbar__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.ul className="admin-navbar__overlay-links">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      href={item.to}
                      className={`admin-navbar__overlay-link ${pathname === item.to ? 'admin-navbar__overlay-link--active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="admin-navbar__overlay-icon">{item.icon}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05, duration: 0.2 }}
                  className="admin-navbar__overlay-footer"
                >
                  <button className="btn btn--danger" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>LOGOUT</span>
                  </button>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
