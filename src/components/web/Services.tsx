'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Reveal } from '../Reveal';
import '../../styles/web-services.css';

const SERVICES = [
  {
    title: 'Custom Web Design',
    desc: 'Beautiful, bespoke designs tailored to your brand identity that wow your users. We focus on modern aesthetics and flawless usability to ensure a lasting first impression.',
    icon: '✨',
    bgIcon: '🎨'
  },
  {
    title: 'E-Commerce Solutions',
    desc: 'Scalable and secure online stores built to maximize conversions and sales. From seamless inventory management to friction-free checkouts, we handle the entire retail flow.',
    icon: '🛍️',
    bgIcon: '🛒'
  },
  {
    title: 'Web App Development',
    desc: 'Complex, data-driven web apps with seamless user experiences. We build robust, custom architectures designed to handle high traffic and scale alongside your business.',
    icon: '💻',
    bgIcon: '⚙️'
  },
  {
    title: 'SEO & Optimization',
    desc: 'Lightning-fast load times and advanced SEO to dominate search rankings. We optimize every image and script so your site ranks high on Google and responds instantly.',
    icon: '🚀',
    bgIcon: '📈'
  }
];

const ServiceCard3D = ({ service, index }: { service: any, index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(smoothY, [-1, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [-1, 1], [-15, 15]);

  useEffect(() => {
    // We no longer bypass mobile, so we don't strictly need isTouch to block functionality
  }, []);

  const updatePosition = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Light source tracking
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    ref.current?.style.setProperty('--mouse-x', `${px}px`);
    ref.current?.style.setProperty('--mouse-y', `${py}px`);
    
    // 3D tilt tracking
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updatePosition(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Reveal delay={0.1 * index}>
      <motion.div
        ref={ref}
        className="w-service-card-wrapper"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseEnter={() => setIsHovered(true)}
        onTouchStart={(e) => {
          setIsHovered(true);
          handleTouchMove(e);
        }}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
      >
        <motion.div 
          className="w-service-card"
          whileInView={{
            rotateX: [0, 6, -5, 0],
            rotateY: [0, -6, 6, 0],
            y: [0, -6, 0]
          }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="w-service-card__mac-dots">
            <span className="mac-dot red"></span>
            <span className="mac-dot yellow"></span>
            <span className="mac-dot green"></span>
          </div>
          
          <motion.div 
            className="w-service-card__bg-icon"
            whileInView={{ 
              opacity: [0.3, 0.7, 0.4],
              scale: [0.9, 1.15, 0.95],
              rotate: [-15, 10, -10]
            }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          >
            {service.bgIcon}
          </motion.div>
          
          <div className="w-service-card__content">
            <div className="w-service-card__content-inner">
              <h3 className="w-service-card__title">{service.title}</h3>
              <p className="w-service-card__text">{service.desc}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Reveal>
  );
};

export function Services() {
  return (
    <section id="services" className="w-services" aria-label="Services">
      <div className="w-services__inner">
        <Reveal>
          <p className="w-services__eyebrow">Our Expertise</p>
          <p className="w-services__desc">
            We create extremely fast, responsive, and SEO-friendly custom websites precisely designed to convert visitors into loyal customers.
          </p>
        </Reveal>
        
        <div className="w-services__grid">
          {SERVICES.map((s, i) => (
            <ServiceCard3D key={i} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
