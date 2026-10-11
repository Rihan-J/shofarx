'use client';
import { motion } from 'framer-motion';

interface FloatingAnalyticsCardProps {
  parallaxY: any;
  parallaxX: any;
}

export function FloatingAnalyticsCard({ parallaxY, parallaxX }: FloatingAnalyticsCardProps) {
  return (
    <motion.div 
      className="premium-analytics-card"
      style={{
        y: parallaxY,
        x: parallaxX,
        rotateX: parallaxY,
        rotateY: parallaxX
      }}
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pac-header">
        <span className="pac-title">Monthly Reach</span>
        <span className="pac-badge">↑ 248%</span>
      </div>
      
      <div className="pac-value">18.2M <span style={{fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500}}>Views</span></div>
      
      <svg className="pac-chart" viewBox="0 0 200 40" preserveAspectRatio="none">
        <motion.path 
          className="pac-chart-path"
          d="M0,35 Q20,25 40,30 T80,20 T120,10 T160,15 T200,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 2.5, ease: "easeOut" }}
        />
        {/* Soft fill gradient below line */}
        <path 
          d="M0,35 Q20,25 40,30 T80,20 T120,10 T160,15 T200,5 L200,40 L0,40 Z"
          fill="url(#chart-fill)"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(128,0,0,0.1)" />
            <stop offset="100%" stopColor="rgba(128,0,0,0)" />
          </linearGradient>
        </defs>
      </svg>
      
      <div style={{fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px'}}>
        <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block', animation: 'pulse-glow 2s infinite'}} />
        Live Growth • +642 Leads
      </div>
    </motion.div>
  );
}
