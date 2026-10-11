'use client';

import React, { useEffect, useRef } from 'react';

export function AINetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    
    // Support prefers-reduced-motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    // Node configuration
    const NODE_COUNT = window.innerWidth < 1024 ? 30 : 70;
    const MAX_DISTANCE = 150;
    
    let nodes = Array.from({ length: NODE_COUNT }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      pulseDelay: Math.random() * 200,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    let frame = 0;
    const draw = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update & Draw Nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges smoothly
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Occasional pulse logic
        let currentRadius = node.radius;
        if (frame % 300 === Math.floor(node.pulseDelay)) {
           currentRadius = node.radius * 2;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(128, 0, 0, 0.15)`; 
        ctx.fill();
        
        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < MAX_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            
            const opacity = (1 - dist / MAX_DISTANCE) * 0.05;
            ctx.strokeStyle = `rgba(128, 0, 0, ${opacity})`;
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    });
    observer.observe(canvas);

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.8
      }}
    />
  );
}
