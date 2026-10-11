import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Megaphone, Share2, Mail, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import shofarxLogo from '../../assets/shofarx-logo.png';

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Home', end: true },
  { to: '/admin/projects', icon: <FolderKanban size={18} />, label: 'Projects' },
  { to: '/admin/smm', icon: <Megaphone size={18} />, label: 'SMM' },
  { to: '/admin/social', icon: <Share2 size={18} />, label: 'Social Media' },
  { to: '/admin/messages', icon: <Mail size={18} />, label: 'Inbox' },
  { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      <header className={`admin-navbar ${scrolled ? 'admin-navbar--scrolled' : ''}`}>
        <nav className="admin-navbar__inner">
          {/* Logo */}
          <NavLink to="/admin" end className="admin-navbar__logo">
            <img src={shofarxLogo} alt="Shofar-X Logo" className="admin-navbar__logo-image" />
            <span className="admin-navbar__brand">Admin</span>
          </NavLink>

          {/* Desktop Links */}
          <ul className="admin-navbar__links">
            {navItems.map((item) => {
              const isActive = item.end 
                ? location.pathname === item.to 
                : location.pathname.startsWith(item.to);

              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
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
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="admin-navbar__actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--icon" title="View Portfolio" style={{ border: 'none' }}>
              <ExternalLink size={20} />
            </a>
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

        {/* Mobile Overlay */}
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
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) => 
                        `admin-navbar__overlay-link ${isActive ? 'admin-navbar__overlay-link--active' : ''}`
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="admin-navbar__overlay-icon">{item.icon}</span>
                      {item.label}
                    </NavLink>
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
