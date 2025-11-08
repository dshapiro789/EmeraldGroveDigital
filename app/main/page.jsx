"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Send, Sparkles, Leaf, Menu, X, Settings, MessageCircle, Play, Shield, Braces, Cpu, LayoutPanelLeft } from "lucide-react";
import AIGroveSidebar from '../components/AIGroveSidebar';
import MeshGradientElegant from '../components/MeshGradientElegant';

/**
 * Emerald Grove Digital - FULL ELECTRIC EDITION ⚡
 * Features:
 * - Electric sound effects system
 * - Electric scroll progress bar with lightning
 * - Navigation electric underline
 * - Enhanced electric cursor trail with sparks
 * - Form input electric focus glow
 * - Section power-on transitions
 * - AI Playground super-charge effect
 * - Project link electric zap
 * - Mobile menu electric slide
 * - Logo electric heartbeat
 * - Electric particles mixed with existing particles
 * - Form success electric feedback
 * - Section active indicator
 * - Footer circuit pattern
 * - Cursor trail effect (with touch device detection!)
 * - Enhanced floating particles (emerald, amber, sparkle variations)
 * - Parallax scrolling
 * - Magnetic buttons
 * - 3D card tilt
 * - Typewriter effect
 * - Smooth scroll
 * - Scroll progress indicator
 * - Staggered animations
 * - Lightning arcs on hover
 * - Plasma borders
 * - Circuit board traces
 */

// ============================================================================
// ELECTRIC SOUND EFFECTS SYSTEM ⚡🔊
// ============================================================================
const useElectricSounds = () => {
  const audioContextRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        setSoundEnabled(true);
      }
    };

    // Enable on first interaction
    const enableAudio = () => {
      initAudio();
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };

    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };
  }, []);

  const playElectricSound = useCallback((type = 'zap', volume = 0.15) => {
    if (!audioContextRef.current || !soundEnabled) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    switch (type) {
      case 'zap': { // Quick electric zap with white noise burst
        // Create noise buffer for realistic electric crackle
        const bufferSize = ctx.sampleRate * 0.06;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          // Decaying white noise
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.Q.setValueAtTime(1, now);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseGain.gain.setValueAtTime(volume * 0.8, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

        noise.start(now);
        noise.stop(now + 0.06);
        break;
      }

      case 'spark': { // Tiny electric snap
        const bufferSize = ctx.sampleRate * 0.02;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3000, now);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseGain.gain.setValueAtTime(volume * 0.4, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);

        noise.start(now);
        noise.stop(now + 0.02);
        break;
      }

      case 'crackle': { // Electric crackle with harmonic distortion
        // Multiple oscillators for harmonic richness
        const fundamentalFreq = 150;
        const duration = 0.1;

        for (let harmonic = 1; harmonic <= 3; harmonic++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(fundamentalFreq * harmonic, now);
          osc.frequency.exponentialRampToValueAtTime(fundamentalFreq * harmonic * 0.5, now + duration);

          gain.gain.setValueAtTime(volume / harmonic, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + duration);
        }

        // Add noise layer for texture
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.3 * Math.exp(-i / (bufferSize * 0.4));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(volume * 0.3, now);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + duration);
        break;
      }

      case 'powerOn': { // Power surge
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(2500, now + 0.15);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);

        // Add click at start
        const clickGain = ctx.createGain();
        const clickOsc = ctx.createOscillator();
        clickOsc.frequency.setValueAtTime(2000, now);
        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickGain.gain.setValueAtTime(volume * 0.5, now);
        clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.01);
        clickOsc.start(now);
        clickOsc.stop(now + 0.01);
        break;
      }

      case 'charge': { // Charging up
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.2);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.linearRampToValueAtTime(1200, now + 0.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }

      case 'pulse': { // Electric hum
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);

        gain.gain.setValueAtTime(volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
    }
  }, [soundEnabled]);

  return { playSound: playElectricSound, soundEnabled };
};

// ============================================================================
// ENHANCED ELECTRIC CURSOR TRAIL WITH SPARKS ⚡✨
// ============================================================================
function CursorTrail() {
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const particleIdRef = useRef(0);
  const { playSound } = useElectricSounds();

  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);
    };
    checkTouchDevice();
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    let animationFrameId;
    let lastTime = Date.now();
    let lastSparkTime = Date.now();

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const currentTime = Date.now();

      // Create regular particles
      if (currentTime - lastTime > 50) {
        const id = particleIdRef.current++;
        // Mix of sparkles, leaves, and ELECTRIC SPARKS!
        const rand = Math.random();
        const particleType = rand > 0.7 ? 'spark' : (rand > 0.4 ? 'sparkle' : 'leaf');

        // Play spark sound occasionally
        if (particleType === 'spark' && currentTime - lastSparkTime > 300) {
          playSound('spark', 0.05);
          lastSparkTime = currentTime;
        }

        setParticles((prev) => [
          ...prev.slice(-20), // Keep more particles for richer effect
          {
            id,
            x: e.clientX,
            y: e.clientY,
            type: particleType,
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            velocity: {
              x: (Math.random() - 0.5) * (particleType === 'spark' ? 4 : 2),
              y: (Math.random() - 0.5) * (particleType === 'spark' ? 4 : 2),
            },
          },
        ]);
        lastTime = currentTime;
      }
    };

    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.velocity.x,
            y: p.y + p.velocity.y,
            rotation: p.rotation + (p.type === 'spark' ? 8 : 2),
            scale: p.scale * (p.type === 'spark' ? 0.92 : 0.97),
          }))
          .filter((p) => p.scale > 0.1)
      );
      animationFrameId = requestAnimationFrame(updateParticles);
    };

    window.addEventListener('mousemove', handleMouseMove);
    updateParticles();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouchDevice, playSound]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Enhanced electric cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(52, 211, 153, 0.6), rgba(52, 211, 153, 0.2))',
          boxShadow: '0 0 20px rgba(52, 211, 153, 0.8), 0 0 40px rgba(52, 211, 153, 0.4)',
        }}
        animate={{
          x: mousePos.x - 8,
          y: mousePos.y - 8,
          scale: [1, 1.2, 1],
        }}
        transition={{
          x: { type: 'spring', damping: 30, stiffness: 400, mass: 0.5 },
          y: { type: 'spring', damping: 30, stiffness: 400, mass: 0.5 },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Particles with electric sparks! */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `translate(-50%, -50%) rotate(${particle.rotation}deg) scale(${particle.scale})`,
            opacity: particle.scale,
          }}
        >
          {particle.type === 'spark' ? (
            // ELECTRIC SPARK! ⚡
            <div className="relative w-3 h-3">
              <div className="absolute inset-0 bg-white rounded-full" style={{
                boxShadow: '0 0 8px rgba(255, 255, 255, 1), 0 0 12px rgba(52, 211, 153, 0.8)'
              }} />
              <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-300 to-emerald-500 rounded-full animate-pulse" />
            </div>
          ) : particle.type === 'sparkle' ? (
            <Sparkles
              size={12}
              className="text-emerald-400"
              style={{ filter: 'drop-shadow(0 0 4px rgba(52, 211, 153, 0.8))' }}
            />
          ) : (
            <Leaf
              size={10}
              className="text-emerald-300"
              style={{ filter: 'drop-shadow(0 0 3px rgba(52, 211, 153, 0.6))' }}
            />
          )}
        </div>
      ))}
    </>
  );
}

// ============================================================================
// ENHANCED FLOATING PARTICLES COMPONENT
// ============================================================================
function EnhancedParticles() {
  const [windowHeight, setWindowHeight] = useState(1000);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create multiple types of particles for visual variety
  const emeraldParticles = Array.from({ length: 15 }, (_, i) => ({
    id: `emerald-${i}`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 12 + Math.random() * 8,
    size: 3 + Math.random() * 3,
    opacity: 0.4 + Math.random() * 0.4,
  }));

  const amberParticles = Array.from({ length: 8 }, (_, i) => ({
    id: `amber-${i}`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
    size: 2 + Math.random() * 2,
    opacity: 0.3 + Math.random() * 0.3,
  }));

  const sparkleParticles = Array.from({ length: 10 }, (_, i) => ({
    id: `sparkle-${i}`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 8,
    size: 1.5 + Math.random() * 1.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* Emerald particles */}
      {emeraldParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            bottom: '-20px',
            background: `rgba(52, 211, 153, ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 2}px rgba(52, 211, 153, ${p.opacity * 0.8})`,
          }}
          animate={{
            y: [0, -(windowHeight + 100)],
            x: [0, Math.sin(p.id.length) * 80],
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Amber particles */}
      {amberParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            bottom: '-20px',
            background: `rgba(252, 211, 77, ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 3}px rgba(252, 211, 77, ${p.opacity * 0.6})`,
          }}
          animate={{
            y: [0, -(windowHeight + 100)],
            x: [0, Math.cos(p.id.length) * 60],
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Sparkle particles */}
      {sparkleParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            bottom: '-20px',
            background: 'rgba(110, 231, 183, 0.6)',
            boxShadow: '0 0 8px rgba(110, 231, 183, 0.8)',
          }}
          animate={{
            y: [0, -(windowHeight + 100)],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 0.8, 0.8, 0],
            scale: [1, 1.5, 0.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// SCROLL PROGRESS INDICATOR (Lightweight)
// ============================================================================
// ============================================================================
// ELECTRIC SCROLL PROGRESS BAR WITH LIGHTNING ⚡📊
// ============================================================================
function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showLightning, setShowLightning] = useState(false);
  const { playSound } = useElectricSounds();
  const lastMilestone = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Trigger lightning at milestones (25%, 50%, 75%, 100%)
      const currentMilestone = Math.floor(progress / 25);
      if (currentMilestone > lastMilestone.current && currentMilestone <= 4) {
        setShowLightning(true);
        playSound('zap', 0.1);
        setTimeout(() => setShowLightning(false), 300);
        lastMilestone.current = currentMilestone;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [playSound]);

  return (
    <>
      {/* Electrified progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none">
        <motion.div
          className="h-full origin-left relative"
          style={{
            transform: `scaleX(${scrollProgress / 100})`,
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {/* Main electric gradient bar with animated glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300"
            animate={{
              boxShadow: [
                '0 0 10px rgba(52, 211, 153, 0.8), 0 0 20px rgba(52, 211, 153, 0.5)',
                '0 0 15px rgba(52, 211, 153, 1), 0 0 30px rgba(52, 211, 153, 0.7)',
                '0 0 10px rgba(52, 211, 153, 0.8), 0 0 20px rgba(52, 211, 153, 0.5)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Animated electric shimmer traveling along the bar */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Electric crackle effect at the leading edge */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white to-emerald-200 opacity-60" />

          {/* Pulsing intensity at the edge */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-3"
            style={{
              background: 'linear-gradient(90deg, rgba(52, 211, 153, 0) 0%, rgba(255, 255, 255, 0.9) 100%)',
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Lightning flash at milestones */}
        {showLightning && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: '0 0 30px rgba(52, 211, 153, 1), 0 0 50px rgba(52, 211, 153, 0.6)'
            }}
          />
        )}
      </div>
    </>
  );
}

// ============================================================================
// 3D TILT CARD COMPONENT
// ============================================================================
function TiltCard({ icon: Icon, title, desc, children, delay = 0 }) {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { playSound } = useElectricSounds();

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playSound('crackle', 0.08);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      viewport={{ margin: "-50px", amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-2xl border border-emerald-300/10 bg-emerald-900/30 backdrop-blur-md p-6 md:p-8"
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {/* Lightning Arc Effect */}
      <LightningArc isActive={isHovered} />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute -inset-40 bg-gradient-to-br from-emerald-500/10 via-emerald-400/10 to-emerald-300/10 blur-2xl" />
      </div>
      {Icon && (
        <motion.div
          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 ring-1 ring-emerald-300/20"
          style={{ transform: "translateZ(20px)" }}
        >
          <Icon className="text-emerald-200" size={22} />
        </motion.div>
      )}
      <h3 className="text-xl md:text-2xl font-semibold text-emerald-50">{title}</h3>
      <p className="mt-2 text-emerald-100/80 leading-relaxed">{desc}</p>
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// ============================================================================
// TYPEWRITER EFFECT
// ============================================================================
function TypewriterText({ text, className = "", delay = 0 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 50 + Math.random() * 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, started]);

  return (
    <span className={className}>
      {displayedText}
      {started && currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-0.5 h-6 bg-emerald-400 ml-1 align-middle"
        />
      )}
    </span>
  );
}

// ============================================================================
// LIGHTNING ARC EFFECT
// ============================================================================
function LightningArc({ isActive = false }) {
  const [arcs, setArcs] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setArcs([]);
      return;
    }

    // Generate 3-5 random lightning arcs
    const numArcs = Math.floor(Math.random() * 3) + 3;
    const newArcs = Array.from({ length: numArcs }, (_, i) => {
      const startX = Math.random() * 100;
      const startY = i < 2 ? 0 : (i === 2 ? Math.random() * 50 : Math.random() * 100);
      const endX = Math.random() * 100;
      const endY = i < 2 ? 100 : (i === 2 ? Math.random() * 50 + 50 : Math.random() * 100);

      // Create branching lightning path
      const midX1 = startX + (endX - startX) * 0.3 + (Math.random() - 0.5) * 30;
      const midY1 = startY + (endY - startY) * 0.3 + (Math.random() - 0.5) * 20;
      const midX2 = startX + (endX - startX) * 0.6 + (Math.random() - 0.5) * 30;
      const midY2 = startY + (endY - startY) * 0.6 + (Math.random() - 0.5) * 20;

      return {
        id: i,
        path: `M ${startX} ${startY} Q ${midX1} ${midY1} ${(startX + endX) / 2} ${(startY + endY) / 2} Q ${midX2} ${midY2} ${endX} ${endY}`,
        delay: i * 0.05,
      };
    });
    setArcs(newArcs);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <filter id="lightningGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {arcs.map((arc) => (
          <motion.g key={arc.id}>
            {/* Outer glow */}
            <motion.path
              d={arc.path}
              stroke="#34d399"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
              transition={{
                duration: 0.3,
                delay: arc.delay,
                ease: "easeOut"
              }}
              filter="url(#lightningGlow)"
            />
            {/* Inner white core */}
            <motion.path
              d={arc.path}
              stroke="#ffffff"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{
                duration: 0.3,
                delay: arc.delay,
                ease: "easeOut"
              }}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

// ============================================================================
// PLASMA BORDER EFFECT
// ============================================================================
function PlasmaBorder({ children, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated plasma border */}
      <div className="absolute -inset-[2px] rounded-2xl overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #34d399 25%, #ffffff 50%, #34d399 75%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div
          className="absolute inset-[2px] rounded-2xl"
          style={{
            background: 'linear-gradient(to bottom, rgb(6, 78, 59), rgb(4, 47, 46))',
          }}
        />
      </div>
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl pointer-events-none"
        style={{
          boxShadow: '0 0 20px rgba(52, 211, 153, 0.4)',
        }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(52, 211, 153, 0.4)',
            '0 0 30px rgba(52, 211, 153, 0.6)',
            '0 0 20px rgba(52, 211, 153, 0.4)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// LIGHTNING BUTTON - Button with lightning arc effects
// ============================================================================
function LightningButton({ children, className = "", href, onClick, ...props }) {
  const [isHovered, setIsHovered] = useState(false);
  const { playSound } = useElectricSounds();

  const Component = href ? 'a' : 'button';

  const handleMouseEnter = () => {
    setIsHovered(true);
    playSound('zap', 0.1);
  };

  return (
    <Component
      href={href}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center gap-2 overflow-hidden ${className}`}
      {...props}
    >
      {/* Lightning Arc Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        {isHovered && <LightningArc isActive={true} />}
      </div>
      {children}
    </Component>
  );
}

// ============================================================================
// LOGO ELECTRIC HEARTBEAT 💚⚡
// ============================================================================
function LogoHeartbeat({ children }) {
  return (
    <motion.div
      className="relative"
      animate={{
        filter: [
          'drop-shadow(0 0 8px rgba(52, 211, 153, 0.4))',
          'drop-shadow(0 0 12px rgba(52, 211, 153, 0.6))',
          'drop-shadow(0 0 8px rgba(52, 211, 153, 0.4))',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// NAV ELECTRIC UNDERLINE ⚡
// ============================================================================
function NavLink({ children, href, onClick, className = "" }) {
  const [isHovered, setIsHovered] = useState(false);
  const { playSound } = useElectricSounds();

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
        playSound('spark', 0.06);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${className}`}
    >
      {children}
      {/* Electric underline */}
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-[2px]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isHovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          background: 'linear-gradient(90deg, transparent, #34d399, transparent)',
          boxShadow: '0 0 8px rgba(52, 211, 153, 0.8)',
        }}
      />
    </a>
  );
}

// ============================================================================
// FORM INPUT ELECTRIC GLOW ⚡✨
// ============================================================================
function ElectricInput({ className = "", ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const { playSound } = useElectricSounds();

  return (
    <motion.input
      {...props}
      onFocus={(e) => {
        setIsFocused(true);
        playSound('pulse', 0.08);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      className={className}
      animate={isFocused ? {
        boxShadow: [
          '0 0 0px rgba(52, 211, 153, 0)',
          '0 0 12px rgba(52, 211, 153, 0.6)',
          '0 0 8px rgba(52, 211, 153, 0.4)',
        ],
      } : {}}
      transition={{ duration: 0.5 }}
    />
  );
}

function ElectricTextarea({ className = "", ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const { playSound } = useElectricSounds();

  return (
    <motion.textarea
      {...props}
      onFocus={(e) => {
        setIsFocused(true);
        playSound('pulse', 0.08);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      className={className}
      animate={isFocused ? {
        boxShadow: [
          '0 0 0px rgba(52, 211, 153, 0)',
          '0 0 12px rgba(52, 211, 153, 0.6)',
          '0 0 8px rgba(52, 211, 153, 0.4)',
        ],
      } : {}}
      transition={{ duration: 0.5 }}
    />
  );
}

// ============================================================================
// SECTION POWER-ON TRANSITION ⚡🔌
// ============================================================================
function PowerOnSection({ children, id, eyebrow, title }) {
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const { playSound } = useElectricSounds();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPoweredOn) {
          setIsPoweredOn(true);
          playSound('powerOn', 0.12);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isPoweredOn, playSound]);

  return (
    <section ref={sectionRef} id={id} className="relative py-16 md:py-24">
      {/* Power-on circuit traces */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[2px]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isPoweredOn ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          background: 'linear-gradient(90deg, transparent, #34d399, transparent)',
          boxShadow: '0 0 10px rgba(52, 211, 153, 0.6)',
          transformOrigin: 'center',
        }}
      />

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isPoweredOn ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-2 text-sm text-emerald-400 tracking-wider uppercase font-semibold"
            style={{
              textShadow: '0 0 10px rgba(52, 211, 153, 0.5)',
            }}
          >
            {eyebrow}
          </motion.div>
        )}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isPoweredOn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 text-3xl md:text-4xl font-semibold text-emerald-50"
          >
            {title}
          </motion.h2>
        )}
        {children}
      </div>
    </section>
  );
}

// ============================================================================
// CIRCUIT BOARD TRACES - Connects service cards
// ============================================================================
function CircuitBoardTraces() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 1 }}>
        <defs>
          {/* Gradient for the pulse */}
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0"/>
            <stop offset="50%" stopColor="#34d399" stopOpacity="1"/>
            <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
          </linearGradient>
          {/* Glow filter */}
          <filter id="circuitGlow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Desktop: Horizontal connections between 3 cards */}
        <g className="hidden md:block">
          {/* Connection 1 -> 2 */}
          <motion.path
            d="M 33 50 L 66 50"
            stroke="#34d399"
            strokeWidth="0.3"
            fill="none"
            strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            filter="url(#circuitGlow)"
          />
          {/* Pulse traveling on connection 1 -> 2 */}
          <motion.circle
            r="0.8"
            fill="url(#pulseGradient)"
            initial={{ opacity: 0 }}
            animate={isVisible ? {
              opacity: [0, 1, 1, 0],
            } : {}}
            transition={{
              duration: 2,
              delay: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          >
            <animateMotion dur="2s" repeatCount="indefinite" begin="2s">
              <mpath href="#trace1to2" />
            </animateMotion>
          </motion.circle>
          <path id="trace1to2" d="M 33 50 L 66 50" fill="none" />

          {/* Connection 2 -> 3 */}
          <motion.path
            d="M 66 50 L 83 50"
            stroke="#34d399"
            strokeWidth="0.3"
            fill="none"
            strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
            filter="url(#circuitGlow)"
          />
          {/* Pulse traveling on connection 2 -> 3 */}
          <motion.circle
            r="0.8"
            fill="#34d399"
            initial={{ opacity: 0 }}
            animate={isVisible ? {
              opacity: [0, 1, 1, 0],
            } : {}}
            transition={{
              duration: 2,
              delay: 2.5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          >
            <animateMotion dur="2s" repeatCount="indefinite" begin="2.5s">
              <mpath href="#trace2to3" />
            </animateMotion>
          </motion.circle>
          <path id="trace2to3" d="M 66 50 L 83 50" fill="none" />

          {/* Circuit nodes (dots at connection points) */}
          <motion.circle
            cx="33" cy="50" r="0.6"
            fill="#34d399"
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: [0, 1.5, 1] } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            filter="url(#circuitGlow)"
          />
          <motion.circle
            cx="66" cy="50" r="0.6"
            fill="#34d399"
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: [0, 1.5, 1] } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            filter="url(#circuitGlow)"
          />
        </g>

        {/* Mobile: Vertical connections */}
        <g className="block md:hidden">
          {/* Connection 1 -> 2 */}
          <motion.path
            d="M 50 33 L 50 50"
            stroke="#34d399"
            strokeWidth="0.3"
            fill="none"
            strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
            filter="url(#circuitGlow)"
          />
          {/* Connection 2 -> 3 */}
          <motion.path
            d="M 50 50 L 50 66"
            stroke="#34d399"
            strokeWidth="0.3"
            fill="none"
            strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
            filter="url(#circuitGlow)"
          />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// SMOOTH SCROLL UTILITY
// ============================================================================
const smoothScrollTo = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

// ============================================================================
// SECTION COMPONENT WITH STATIC BACKGROUNDS
// ============================================================================
const Section = ({ id, title, eyebrow, children }) => {
  // Different background patterns for variety
  const backgrounds = {
    about: {
      color1: 'rgba(52, 211, 153, 0.08)',
      color2: 'rgba(16, 185, 129, 0.06)',
      position1: 'top-20 -left-20',
      position2: 'bottom-40 -right-20',
      position3: 'top-1/2 left-1/4',
    },
    services: {
      color1: 'rgba(193, 162, 74, 0.08)',
      color2: 'rgba(217, 179, 92, 0.06)',
      position1: 'top-40 -right-20',
      position2: 'bottom-20 -left-20',
      position3: 'top-1/3 right-1/4',
    },
    work: {
      color1: 'rgba(16, 185, 129, 0.08)',
      color2: 'rgba(5, 150, 105, 0.06)',
      position1: 'top-1/4 -left-20',
      position2: 'bottom-1/3 -right-20',
      position3: 'top-2/3 left-1/3',
    },
    contact: {
      color1: 'rgba(52, 211, 153, 0.08)',
      color2: 'rgba(193, 162, 74, 0.06)',
      position1: 'top-20 -right-20',
      position2: 'bottom-20 -left-20',
      position3: 'top-1/2 right-1/3',
    },
  };
  
  const bg = backgrounds[id] || backgrounds.about;
  
  return (
    <section id={id} className="relative py-24 md:py-32 overflow-hidden">
      {/* Static background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute ${bg.position1} w-96 h-96 rounded-full blur-[120px] opacity-40`}
          style={{
            background: `radial-gradient(circle, ${bg.color1}, transparent 70%)`,
          }}
        />
        <div
          className={`absolute ${bg.position2} w-80 h-80 rounded-full blur-[100px] opacity-30`}
          style={{
            background: `radial-gradient(circle, ${bg.color2}, transparent 70%)`,
          }}
        />
        <div
          className={`absolute ${bg.position3} w-64 h-64 rounded-full blur-[80px] opacity-25`}
          style={{
            background: `radial-gradient(circle, ${bg.color1}, transparent 70%)`,
          }}
        />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/5 to-transparent" />
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            viewport={{ margin: "-100px", amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="mb-3 inline-flex items-center gap-2 text-sm tracking-wider uppercase text-emerald-300"
          >
            <Leaf size={16} /> {eyebrow}
          </motion.div>
        )}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            viewport={{ margin: "-100px", amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-5xl font-semibold text-emerald-50 drop-shadow-sm"
          >
            {title}
          </motion.h2>
        )}
        <div className="mt-8 md:mt-10">{children}</div>
      </div>
    </section>
  );
};

// ============================================================================
// CONTACT FORM COMPONENT
// ============================================================================
function ContactForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Transmission complete: Connection taking root - We\'ll be in touch shortly!' });
        setFormState({ name: '', email: '', company: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      viewport={{ margin: "-100px", amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      <PlasmaBorder>
        <form
          onSubmit={handleSubmit}
          className="bg-emerald-900/40 backdrop-blur rounded-xl p-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <label className="col-span-2">
              <span className="text-sm">Your name</span>
              <ElectricInput
                name="name"
                value={formState.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2"
                required
                disabled={isSubmitting}
              />
            </label>
            <label className="col-span-2 md:col-span-1">
              <span className="text-sm">Email</span>
              <ElectricInput
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2"
                required
                disabled={isSubmitting}
              />
            </label>
            <label className="col-span-2 md:col-span-1">
              <span className="text-sm">Company</span>
              <ElectricInput
                name="company"
                value={formState.company}
                onChange={handleChange}
                className="mt-1 w-full rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2"
                disabled={isSubmitting}
              />
            </label>
            <label className="col-span-2">
              <span className="text-sm">What are you building?</span>
              <ElectricTextarea
                name="message"
                value={formState.message}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2"
                disabled={isSubmitting}
              />
            </label>
          </div>

          {submitStatus && (
            <div className={`mt-4 p-3 rounded-md ${
              submitStatus.type === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-200'
                : 'bg-red-500/20 border border-red-500/30 text-red-200'
            }`}>
              {submitStatus.message}
            </div>
          )}

          <LightningButton
            type="submit"
            disabled={isSubmitting}
            className="mt-4 rounded-md bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            {isSubmitting ? 'Sending...' : 'Send'} <ArrowRight size={16} />
          </LightningButton>
        </form>
      </PlasmaBorder>
    </motion.div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function Page() {
  const [navOpen, setNavOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Scroll to top when page loads (especially important for mobile navigation from matrix page)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    
    // Set scrolling state
    setIsScrolling(true);
    
    // Close menu with animation on mobile
    setNavOpen(false);
    
    // Wait for menu close animation (400ms) before scrolling
    setTimeout(() => {
      smoothScrollTo(targetId);
      // Reset scrolling state after scroll completes
      setTimeout(() => setIsScrolling(false), 800);
    }, 400);
  };

  return (
    <div className="relative min-h-screen text-emerald-100">
      <ScrollProgress />
      
      {/* Mesh Gradient Background */}
      <MeshGradientElegant />

      {/* Enhanced floating particles effect with emerald, amber, and sparkle variations */}
      <EnhancedParticles />

      <CursorTrail />

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-emerald-950/80 border-b border-emerald-300/10">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoHeartbeat>
              <img
                src="/logo.png"
                alt="Emerald Grove Digital Logo"
                className="w-[50px] h-[50px] object-contain"
              />
            </LogoHeartbeat>
            <span className="font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-300"
                  style={{
                    textShadow: '0 0 20px rgba(52, 211, 153, 0.3)',
                    filter: 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.2))',
                  }}>
              Emerald Grove Digital
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink href="#about" onClick={(e) => handleNavClick(e, "about")} className="hover:text-emerald-200">
              About
            </NavLink>
            <NavLink href="#services" onClick={(e) => handleNavClick(e, "services")} className="hover:text-emerald-200">
              Services
            </NavLink>
            <NavLink href="#work" onClick={(e) => handleNavClick(e, "work")} className="hover:text-emerald-200">
              Work
            </NavLink>
            <NavLink href="#contact" onClick={(e) => handleNavClick(e, "contact")} className="hover:text-emerald-200">
              Contact
            </NavLink>
            <LightningButton
              href="/ai-playground"
              className="px-3 py-1.5 rounded-full bg-emerald-500 text-emerald-950 font-semibold hover:bg-emerald-400 relative"
            >
              <motion.div
                className="absolute inset-0 bg-emerald-400 rounded-full"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="relative flex items-center gap-2">
                <Sparkles size={14} /> Playground
              </span>
            </LightningButton>
          </nav>
          <button className="md:hidden p-2" onClick={() => setNavOpen((s) => !s)}>
            {navOpen ? <X /> : <Menu />}
          </button>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-emerald-300/10 overflow-hidden"
            >
              <motion.div 
                className="px-4 py-3 space-y-2"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <a href="#about" onClick={(e) => handleNavClick(e, "about")} className="block py-2 hover:text-emerald-200 transition-colors">
                  About
                </a>
                <a href="#services" onClick={(e) => handleNavClick(e, "services")} className="block py-2 hover:text-emerald-200 transition-colors">
                  Services
                </a>
                <a href="#work" onClick={(e) => handleNavClick(e, "work")} className="block py-2 hover:text-emerald-200 transition-colors">
                  Work
                </a>
                <a href="#contact" onClick={(e) => handleNavClick(e, "contact")} className="block py-2 hover:text-emerald-200 transition-colors">
                  Contact
                </a>
                <a href="/ai-playground" className="block py-2 hover:text-emerald-200 transition-colors">
                  Playground
                </a>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Background layer - static */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[120vw] bg-gradient-to-b from-emerald-300/10 via-emerald-400/10 to-transparent blur-3xl" />
          <div className="absolute -inset-20 bg-[radial-gradient(40%_40%_at_70%_10%,rgba(193,162,74,0.12),transparent)]" />
        </div>

        {/* Floating accent shapes - static */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-400/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-6xl px-4 py-24 md:py-36 relative">
          {/* Plasma Border around hero content */}
          <PlasmaBorder className="p-8 md:p-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-semibold tracking-tight text-emerald-50"
            >
              Where{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-100">
                AI
              </span>{" "}
              meets
              <br />
              <TypewriterText
                text="organic imagination"
                className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-300 to-emerald-100"
                delay={800}
              />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-5 max-w-2xl text-emerald-100/80 leading-relaxed"
            >
              We cultivate intelligent products, lucid interfaces, and durable systems. Creativity, simplicity, and
              function in perfect balance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <LightningButton
                href="#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="rounded-full px-5 py-3 bg-emerald-500 text-emerald-950 font-semibold shadow hover:bg-emerald-400 z-10"
              >
                Start a project <ArrowRight size={16} />
              </LightningButton>
              <LightningButton
                href="#work"
                onClick={(e) => handleNavClick(e, "work")}
                className="rounded-full px-5 py-3 border border-emerald-300/20 hover:bg-emerald-800/30 z-10"
              >
                View work <Play size={16} />
              </LightningButton>
            </motion.div>
          </PlasmaBorder>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <Section id="about" eyebrow="Philosophy" title="Design like nature: clear, adaptive, enduring.">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <TiltCard
            icon={Cpu}
            title="Systems that grow"
            desc="From seed idea to living product - thoughtful architectures that scale with you."
            delay={0}
          >
            <ul className="mt-4 space-y-2 text-emerald-100/80 list-disc list-inside">
              <li>Research - Strategy - Prototyping - Launch</li>
              <li>AI copilots, RAG search, automations</li>
              <li>Design systems & accessibility by default</li>
            </ul>
          </TiltCard>
          <TiltCard
            icon={LayoutPanelLeft}
            title="Clarity over clutter"
            desc="Minimal interfaces with expressive detail and purposeful motion."
            delay={0.1}
          >
            <ul className="mt-4 space-y-2 text-emerald-100/80 list-disc list-inside">
              <li>Readable type, balanced rhythm, elegant whitespace</li>
              <li>Motion that informs, not distracts</li>
              <li>Performance and SEO tuned</li>
            </ul>
          </TiltCard>
        </div>
      </Section>

      {/* SERVICES SECTION */}
      <Section id="services" eyebrow="Services" title="What we cultivate">
        <div className="relative grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Electric Circuit Board Traces */}
          <CircuitBoardTraces />

          <TiltCard
            icon={Sparkles}
            title="AI Product Design"
            desc="Custom tools, assistants, and data systems that actually move the needle."
            delay={0}
          />
          <TiltCard
            icon={Braces}
            title="Web Architecture"
            desc="Next.js apps, headless CMS, robust APIs, and clean CI/CD pipelines."
            delay={0.1}
          />
          <TiltCard
            icon={Shield}
            title="Advisory & Enablement"
            desc="Strategy sprints, audits, and playbooks to align teams and accelerate."
            delay={0.2}
          />
        </div>
      </Section>

      {/* WORK SECTION */}
      <Section id="work" eyebrow="Work" title="Selected outcomes">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <TiltCard
            title="Bonsai Web Design"
            desc="Crafting timeless design and meaningful content for modern brands."
            delay={0}
          >
            <a 
              href="https://bonsaiwebdesign.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors group/link cursor-pointer relative z-20"
            >
              <span className="group-hover/link:underline">Visit site</span> <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </TiltCard>
          
          <TiltCard
            title="AI Bitcoin Tutor"
            desc="Master Bitcoin with AI-Powered Learning"
            delay={0.1}
          >
            <a 
              href="https://aibitcointutor.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors group/link cursor-pointer relative z-20"
            >
              <span className="group-hover/link:underline">Visit site</span> <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </TiltCard>
          
          <TiltCard
            title="Crypto Apparel"
            desc="Unchain Your Style"
            delay={0.2}
          >
            <a 
              href="https://cryptoapparel.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors group/link cursor-pointer relative z-20"
            >
              <span className="group-hover/link:underline">Visit site</span> <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </TiltCard>
        </div>
      </Section>

      {/* CONTACT SECTION */}
      <Section id="contact" eyebrow="Collaborate" title="Step into the Grove">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            viewport={{ margin: "-100px", amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-emerald-100/80 leading-relaxed">
              Tell us about your vision, constraints, and goals. We'll shape a path that honors clarity, momentum, and
              craft.
            </p>
            <ul className="mt-6 space-y-2 text-emerald-100/80 list-disc list-inside">
              <li>2-week Discovery & Strategy</li>
              <li>4-8 week Build Cycles</li>
              <li>Ongoing Care & Improvement</li>
            </ul>
          </motion.div>
          <ContactForm />
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="relative border-t border-emerald-300/20 py-10 z-50 bg-emerald-950/60 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-4 text-sm text-emerald-100 flex items-center justify-between">
          <span className="font-medium">© {new Date().getFullYear()} Emerald Grove Digital</span>
          <a id="ai" href="#" className="hover:text-emerald-50 transition-colors font-medium">
            Terms · Privacy
          </a>
        </div>
      </footer>

      {/* Your AI sidebar */}
      <AIGroveSidebar />
    </div>
  );
}