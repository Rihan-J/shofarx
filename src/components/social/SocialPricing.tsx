'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info, ArrowRight } from 'lucide-react';
import '../../styles/social-pricing.css';

const FEATURES = [
  'Complete Social Media Setup',
  'Instagram & Facebook Setup',
  '15 Professional Reels',
  'Creative Post Designs',
  'Content Planning',
  'Caption & Hashtag Strategy',
  '2 Stories on Our Main Page',
  'Monthly Performance Report'
];

export function SocialPricing() {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="sx-pricing-section">
      <div className="sx-pricing__blob sx-pricing__blob--1" />
      <div className="sx-pricing__blob sx-pricing__blob--2" />
      
      <div className="sx-pricing-container">
        {/* Header */}
        <motion.div 
          className="sx-pricing-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="sx-pricing-badge">Affordable Pricing</span>
          <h2 className="sx-pricing-title">Everything You Need to Grow on Social Media</h2>
          <p className="sx-pricing-subtitle">
            A complete monthly social media management package designed for startups, local businesses, creators, restaurants, real estate, and growing brands.
          </p>
        </motion.div>

        {/* Layout */}
        <div className="sx-pricing-content">
          {/* Left: Pricing Card */}
          <motion.div 
            className="sx-pricing-card-wrapper"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="sx-pricing-card-glow" />
            
            <motion.div 
              className="sx-pricing-card"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="sx-pc-offer">Limited Time Launch Offer</span>
              <h3 className="sx-pc-title">Starter Growth Pack</h3>
              <p className="sx-pc-desc">Everything you need to build your business online.</p>
              
              <div className="sx-pc-price-area">
                <span className="sx-pc-original">₹16,000</span>
                <div className="sx-pc-current">
                  ₹6,999 <span className="sx-pc-period">/ Month</span>
                </div>
              </div>

              <button className="sx-pc-cta" onClick={scrollToContact}>
                Get Started
                <ArrowRight size={20} />
              </button>

              <p className="sx-pc-footer">
                Need a custom package? <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToContact(); }}>Contact us today.</a>
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Features */}
          <motion.div 
            className="sx-pricing-features-wrap"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="sx-features-list">
              {FEATURES.map((feature, i) => (
                <motion.div 
                  key={i}
                  className="sx-feature-item"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.4 }}
                >
                  <div className="sx-feature-icon">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="sx-pricing-note"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <Info size={20} className="sx-pricing-note-icon" />
              <p>Website Development is available as a separate service and is not included in this package.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
