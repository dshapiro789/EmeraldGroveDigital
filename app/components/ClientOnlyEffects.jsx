'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Detect touch once on mount */
function useIsTouch() {
  const [isTouch, setIsTouch] = useState(true); // optimistic to avoid flashes
  useEffect(() => {
    const t = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(t);
  }, []);
  return isTouch;
}

/** Floating Particles — lightweight, responsive to device capability */
export function FloatingParticles({ baseCount = 15 }) {
  const isTouch = useIsTouch();
  const reduce = useReducedMotion();

  // dial down count on touch / reduced motion
  const count = useMemo(() => {
    if (reduce) return Math.max(4, Math.floor(baseCount * 0.4));
    if (isTouch) return Math.max(6, Math.floor(baseCount * 0.6));
    return baseCount;
  }, [isTouch, reduce, baseCount]);

  const particles = useMemo(() => {
    // deterministic seed for SSR consistency not needed since client-only component
    return Array.from({ length: count }).map((_, i) => {
      // tighter travel on touch for less GPU load
      const travel = isTouch ? 40 : 90;
      const size = isTouch ? 6 : 10;
      const dur = reduce ? 16 : isTouch ? 22 : 28;
      return {
        id: i,
        x0: Math.random() * 100,
        y0: Math.random() * 100,
        dx: (Math.random() * 2 - 1) * travel,
        dy: (Math.random() * 2 - 1) * travel,
        size,
        dur,
        delay: Math.random() * 6
      };
    });
  }, [count, isTouch, reduce]);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, contain: 'layout paint', transform: 'translateZ(0)' }}
      aria-hidden
    >
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            top: `${p.y0}%`,
            left: `${p.x0}%`,
            width: p.size,
            height: p.size,
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(255,255,255,.1) 60%, rgba(255,255,255,0) 70%)',
            willChange: 'transform'
          }}
          initial={{ x: 0, y: 0, opacity: 0.85 }}
          animate={{
            x: [0, p.dx, -p.dx * 0.6, 0],
            y: [0, p.dy, -p.dy * 0.6, 0],
            opacity: [0.85, 0.9, 0.75, 0.85]
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay
          }}
        />
      ))}
    </div>
  );
}

/** Mouse trail — desktop only */
export function MouseTrailEffect() {
  const isTouch = useIsTouch();
  if (isTouch) return null;
  // Keep it feather-light: CSS only + small motion element
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 1 }}
      aria-hidden
    />
  );
}

/** Default export used by your dynamic() import in page.jsx */
export default function ClientOnlyEffects() {
  return (
    <>
      <FloatingParticles baseCount={15} />
      <MouseTrailEffect />
    </>
  );
}
