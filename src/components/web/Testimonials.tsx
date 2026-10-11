import { Reveal } from '../Reveal';

const TESTIMONIALS: any[] = []; // Pending real data from user

export function Testimonials() {
  return (
    <section id="testimonials" className="w-section w-testimonials" aria-label="Testimonials">
      <div className="w-section__inner">
        <Reveal>
          <p className="w-section__eyebrow">Client Feedback</p>
          <h2 className="w-section__heading">Testimonials</h2>
        </Reveal>
        
        {TESTIMONIALS.length === 0 ? (
          <Reveal delay={0.2}>
            <div className="w-empty-state">
              <p>Testimonials coming soon. Please provide real client reviews.</p>
            </div>
          </Reveal>
        ) : (
          <div className="w-testimonials__carousel">
             {/* Map over real testimonials when provided */}
          </div>
        )}
      </div>
    </section>
  );
}
