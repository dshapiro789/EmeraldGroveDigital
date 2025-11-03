'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Client-Only Floating Particles Component
 * Fixes hydration errors by only rendering on client side
 */
export function FloatingParticles({ count = 10 }) {
  const [particles, setParticles] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Generate particles only on client side
    const newParticles = Array.from({ length: count }, (_, i) => {
      const particleType = Math.random() > 0.5 ? 'sparkle' : 'leaf';
      
      return {
        id: `particle-${i}`,
        type: particleType,
        // Random initial position
        left: Math.random() * 100,
        // Random size between 3-8px
        size: 3 + Math.random() * 5,
        // Random animation delay
        delay: Math.random() * 5,
        // Random duration between 10-20s
        duration: 10 + Math.random() * 10,
        // Random float amplitude
        floatDistance: 20 + Math.random() * 40,
        // Random horizontal drift
        driftX: (Math.random() - 0.5) * 50,
        // Random opacity
        opacity: 0.3 + Math.random() * 0.7
      };
    });
    
    setParticles(newParticles);
  }, [count]);

  // Don't render anything during SSR
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{
            left: `${particle.left}%`,
            bottom: -20,
            opacity: 0,
          }}
          animate={{
            bottom: ['0%', `${particle.floatDistance}%`, '0%'],
            x: [0, particle.driftX, 0],
            opacity: [0, particle.opacity, particle.opacity, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        >
          {particle.type === 'sparkle' ? (
            <Sparkle size={particle.size} opacity={particle.opacity} />
          ) : (
            <Leaf size={particle.size} opacity={particle.opacity} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Client-Only Mouse Trail Effect
 * Fixes hydration errors by only rendering on client side
 */
export function MouseTrailEffect() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setMousePos(newPos);
      
      // Add to trail with random properties
      setTrail(prev => [...prev.slice(-20), {
        id: Date.now() + Math.random(),
        x: newPos.x,
        y: newPos.y,
        size: 2 + Math.random() * 4,
        color: Math.random() > 0.5 ? 'emerald' : 'green',
      }]);
    };

    if (mounted) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mounted]);

  // Clean up old trail particles
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.slice(-10));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Custom cursor */}
      <div 
        className="fixed pointer-events-none z-[9999] mix-blend-screen"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50 w-6 h-6" />
          <div className="relative bg-emerald-300 rounded-full w-2 h-2" />
        </div>
      </div>

      {/* Trail particles */}
      {trail.map((particle, i) => (
        <motion.div
          key={particle.id}
          className={`fixed pointer-events-none rounded-full ${
            particle.color === 'emerald' ? 'bg-emerald-400' : 'bg-green-400'
          }`}
          initial={{
            left: particle.x,
            top: particle.y,
            scale: 1,
            opacity: 0.6,
          }}
          animate={{
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </>
  );
}

/**
 * Sparkle SVG Component
 */
function Sparkle({ size, opacity }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="text-emerald-400"
      style={{ opacity }}
    >
      <path
        d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
        fill="currentColor"
        className="animate-pulse"
      />
    </svg>
  );
}

/**
 * Leaf SVG Component
 */
function Leaf({ size, opacity }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="text-green-400"
      style={{ opacity }}
    >
      <path
        d="M12 2C8 2 2 8 2 12C2 16 5 19 8 20C9 20 10 20 11 19.5V22L13 20C17 18 22 14 22 8C22 4 18 2 12 2Z"
        fill="currentColor"
        className="animate-pulse"
      />
    </svg>
  );
}

/**
 * Dynamic import wrapper for Next.js
 * Use this in your page.jsx instead of direct import
 */
export function ClientOnlyEffects() {
  return (
    <>
      <FloatingParticles count={15} />
      <MouseTrailEffect />
    </>
  );
}

export default ClientOnlyEffects;
