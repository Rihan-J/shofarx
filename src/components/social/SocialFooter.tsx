export function SocialFooter() {
  return (
    <footer className="sf">
      <div className="w-section__inner sf__inner">
        <span className="sf__brand">Shofar‑X</span>
        <span className="sf__copy">© {new Date().getFullYear()} Shofar‑X · Social Media Marketing</span>
        <div className="sf__divider" aria-hidden="true" />
      </div>
    </footer>
  );
}
