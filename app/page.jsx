'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const MatrixLandingPage = () => {
  const canvasRef = useRef(null);
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Track mouse position for custom cursor
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix rain configuration
    const chars = '01アイウエオカキクケコサシスセソタチツテト∴∵ΣΔΩ<>{}[]|/\\';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const emeraldColors = [
      'rgba(52, 211, 153, ',
      'rgba(110, 231, 183, ',
      'rgba(16, 185, 129, ',
    ];

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const colorIndex = Math.floor(Math.random() * emeraldColors.length);
        const alpha = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = emeraldColors[colorIndex] + alpha + ')';

        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // ⚙️ MATRIX SPEED ADJUSTMENT:
    // Change the interval value to adjust matrix rain speed
    // Lower = faster (e.g., 30), Higher = slower (e.g., 100)
    // Default was 50, now set to 80 for slower rain
    const interval = setInterval(drawMatrix, 80);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push('/main');
    }, 800);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black" style={{ cursor: 'none' }}>
      {/* Custom Cursor */}
      {!isMobile && (
        <motion.div
          className="fixed w-5 h-5 rounded-full pointer-events-none z-[9999]"
          style={{
            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.8), rgba(52, 211, 153, 0.2))',
            boxShadow: '0 0 20px rgba(52, 211, 153, 0.6)',
            mixBlendMode: 'screen',
          }}
          animate={{
            x: mousePos.x - 10,
            y: mousePos.y - 10,
          }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 400,
            mass: 0.5,
          }}
        />
      )}

      {/* Global styles for glitch effect */}
      <style jsx>{`
        /* ⚙️ GLITCH TEXT SPEED ADJUSTMENT:
           Change the animation duration to adjust glitch speed
           Lower = faster glitches (e.g., 1s), Higher = slower glitches (e.g., 6s)
           Default was 2s, now set to 4s for slower, more subtle glitching */
        .glitch-text::before {
          content: attr(data-text);
          position: absolute;
          left: 2px;
          text-shadow: -2px 0 #ff00de;
          top: 0;
          color: #34d399;
          overflow: hidden;
          animation: glitch 4s infinite;
        }

        @keyframes glitch {
          0% { clip-path: inset(40% 0 61% 0); }
          20% { clip-path: inset(92% 0 1% 0); }
          40% { clip-path: inset(43% 0 1% 0); }
          60% { clip-path: inset(25% 0 58% 0); }
          80% { clip-path: inset(54% 0 7% 0); }
          100% { clip-path: inset(58% 0 43% 0); }
        }
      `}</style>
      {/* Matrix Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
      />

      {/* Fabric Grid Overlay */}
      <motion.div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(52, 211, 153, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 211, 153, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Scanline Effect */}
      <motion.div
        className="fixed w-full h-[3px] z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(transparent, rgba(52, 211, 153, 0.8), transparent)',
          boxShadow: '0 0 20px rgba(52, 211, 153, 0.6)',
        }}
        animate={{
          top: ['0%', '100%'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 text-center"
        animate={isExiting ? {
          opacity: 0,
          scale: 0.98,
          x: -5,
        } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0)' }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12"
        >
          <motion.div
            className="w-[100px] h-[100px] mx-auto mb-6 relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Pulsing borders */}
            <motion.div
              className="absolute inset-0 border-2 border-emerald-400/50 rounded-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute inset-0 border-2 border-emerald-400/50 rounded-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />

            {/* Logo SVG */}
            <svg
              viewBox="0 0 100 100"
              className="relative z-[1] w-full h-full"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(52, 211, 153, 0.8))',
              }}
            >
              <path d="M50 10L20 25L50 40L80 25L50 10Z" stroke="#34d399" strokeWidth="2" fill="rgba(52, 211, 153, 0.1)" />
              <path d="M20 45L50 60L80 45" stroke="#34d399" strokeWidth="2" />
              <path d="M20 65L50 80L80 65" stroke="#34d399" strokeWidth="2" />
              <motion.circle
                cx="50"
                cy="25"
                r="3"
                fill="#34d399"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle
                cx="50"
                cy="60"
                r="3"
                fill="#fcd34d"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
          </motion.div>

          <motion.div
            className="text-2xl font-bold tracking-[0.2em] text-emerald-400"
            style={{
              textShadow: `
                0 0 10px rgba(52, 211, 153, 0.8),
                0 0 20px rgba(52, 211, 153, 0.5),
                0 0 30px rgba(52, 211, 153, 0.3)
              `,
            }}
            animate={{
              textShadow: [
                '0 0 10px rgba(52, 211, 153, 0.8), 0 0 20px rgba(52, 211, 153, 0.5), 0 0 30px rgba(52, 211, 153, 0.3)',
                '0 0 20px rgba(52, 211, 153, 1), 0 0 30px rgba(52, 211, 153, 0.8), 0 0 40px rgba(52, 211, 153, 0.6)',
                '0 0 10px rgba(52, 211, 153, 0.8), 0 0 20px rgba(52, 211, 153, 0.5), 0 0 30px rgba(52, 211, 153, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            EMERALD GROVE DIGITAL
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0)' }}
          transition={{ duration: 1, delay: 1 }}
          className="mb-8"
        >
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6 text-white relative glitch-text"
            data-text="INITIALIZING SYSTEM"
            style={{
              textShadow: '0 0 10px rgba(52, 211, 153, 0.5), 0 0 20px rgba(52, 211, 153, 0.3)',
            }}
          >
            INITIALIZING SYSTEM
          </h1>

          {/* Digital Line */}
          <div className="w-[200px] h-[2px] mx-auto my-8 relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, #34d399, transparent)',
              }}
            />
            <motion.div
              className="absolute w-[50px] h-full bg-white/80"
              animate={{
                left: ['-50px', '200px'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-emerald-400/90"
            style={{
              textShadow: '0 0 10px rgba(52, 211, 153, 0.3)',
            }}
          >
            Where artificial intelligence meets organic imagination. Enter to explore our digital grove of innovative solutions.
          </p>
        </motion.div>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0)' }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-12"
        >
          <motion.button
            onClick={handleEnter}
            className="relative px-16 py-6 text-xl font-bold bg-emerald-400 text-black uppercase tracking-wider overflow-hidden"
            style={{
              clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
              boxShadow: '0 0 20px rgba(52, 211, 153, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)',
            }}
            whileHover={{
              backgroundColor: '#6ee7b7',
              boxShadow: '0 0 40px rgba(52, 211, 153, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.3)',
              y: -3,
            }}
            whileTap={{ y: -1 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{
                x: '200%',
                transition: { duration: 1, ease: 'easeInOut' },
              }}
            />
            <span className="relative flex items-center gap-4">
              ACCESS GROVE
              <motion.span
                animate={{ x: [0, 5, 0], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ▸
              </motion.span>
            </span>
          </motion.button>
        </motion.div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0)' }}
          transition={{ duration: 1, delay: 2 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row gap-4 md:gap-8 font-mono text-sm text-emerald-400 z-[5]"
        >
          {['SYSTEM READY', 'CONNECTION SECURE', 'AI ONLINE'].map((status, i) => (
            <div key={status} className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-emerald-400 rounded-full"
                style={{
                  boxShadow: '0 0 10px #34d399',
                }}
                animate={{
                  opacity: [1, 0.3, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
              <span>{status}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MatrixLandingPage;