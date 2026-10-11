export function Footer() {
  return (
    <footer className="wf">
      <div className="w-section__inner wf__inner">
        <span className="wf__brand">Shofar‑X</span>
        <span className="wf__copy">© {new Date().getFullYear()} Shofar‑X · Website Development</span>
        <div className="wf__divider" aria-hidden="true" />
      </div>
    </footer>
  );
}
