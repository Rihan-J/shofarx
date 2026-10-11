import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copy">
          @2026 <strong>Rihan J</strong>
        </p>

        <div className="footer__socials">
          <a href="https://github.com/Rihan-J" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href="https://linkedin.com/in/rihan-j-19a2a53b0" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
          <a href="mailto:rihanj0427@gmail.com" aria-label="Email">
            <Mail size={18} />
          </a>
        </div>

        <button className="footer__top-btn" onClick={scrollToTop} aria-label="Back to top">
          <ArrowUp size={18} />
        </button>
      </div>
    </footer>
  );
}
