'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MeshGradientElegant = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect based on scroll
  const parallaxOffset = scrollY * 0.3;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Deep emerald base with gradient */}
      <div className="absolute inset-0 bg-[#041712]" />
      
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(52, 211, 153, 0.15), transparent),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(5, 150, 105, 0.12), transparent),
            radial-gradient(ellipse 60% 60% at 80% 60%, rgba(193, 162, 74, 0.08), transparent)
          `,
        }}
        animate={{
          opacity: [0.7, 0.85, 0.7],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Animated orbs - subtle floating effect */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{
          top: '10%',
          left: '15%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
          transform: `translateY(${parallaxOffset * 0.5}px)`,
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{
          top: '40%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(110, 231, 183, 0.18) 0%, transparent 70%)',
          transform: `translateY(${parallaxOffset * 0.7}px)`,
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full blur-[90px]"
        style={{
          bottom: '15%',
          left: '50%',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)',
          transform: `translateY(${parallaxOffset * 0.4}px)`,
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -35, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />
      
      {/* Amber accent - subtle */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[110px]"
        style={{
          top: '60%',
          left: '25%',
          background: 'radial-gradient(circle, rgba(252, 211, 77, 0.08) 0%, transparent 70%)',
          transform: `translateY(${parallaxOffset * 0.6}px)`,
        }}
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 6,
        }}
      />
      
      {/* Mesh grid overlay - very subtle */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(52, 211, 153, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 211, 153, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
      
      {/* Grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Subtle radial vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(4, 23, 18, 0.6) 100%)',
        }}
      />
      
      {/* Top gradient accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-96"
        style={{
          background: 'linear-gradient(to bottom, rgba(52, 211, 153, 0.08) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default MeshGradientElegant;
