"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Send, Sparkles, Leaf, Menu, X, Settings, MessageCircle, Play, Shield, Braces, Cpu, LayoutPanelLeft } from "lucide-react";

/**
 * Emerald Grove Digital — Enhanced Premium Version
 * Features:
 * - Cursor trail effect (NEW!)
 * - Floating particle effect
 * - Parallax scrolling
 * - Magnetic buttons
 * - 3D card tilt
 * - Typewriter effect
 * - Smooth scroll
 * - Scroll progress indicator
 * - Staggered animations
 */

// ============================================================================
// CURSOR TRAIL COMPONENT (NEW!)
// ============================================================================
function CursorTrail() {
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particleIdRef = useRef(0);

  useEffect(() => {
    let animationFrameId;
    let lastTime = Date.now();

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const currentTime = Date.now();
      // Create particles less frequently for better performance
      if (currentTime - lastTime > 50) {
        const id = particleIdRef.current++;
        const particleType = Math.random() > 0.5 ? 'sparkle' : 'leaf';
        
        setParticles((prev) => [
          ...prev.slice(-15), // Keep only last 15 particles
          {
            id,
            x: e.clientX,
            y: e.clientY,
            type: particleType,
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            velocity: {
              x: (Math.random() - 0.5) * 2,
              y: (Math.random() - 0.5) * 2,
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
            rotation: p.rotation + 2,
            scale: p.scale * 0.97, // Fade out by scaling down
          }))
          .filter((p) => p.scale > 0.1) // Remove tiny particles
      );
      animationFrameId = requestAnimationFrame(updateParticles);
    };

    window.addEventListener('mousemove', handleMouseMove);
    updateParticles();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Custom cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.8), rgba(52, 211, 153, 0.2))',
          boxShadow: '0 0 20px rgba(52, 211, 153, 0.6)',
        }}
        animate={{
          x: mousePos.x - 8,
          y: mousePos.y - 8,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 400,
          mass: 0.5,
        }}
      />

      {/* Particles */}
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
          {particle.type === 'sparkle' ? (
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
// FLOATING PARTICLES COMPONENT
// ============================================================================
function FloatingParticles() {
  const [windowHeight, setWindowHeight] = useState(1000);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-emerald-300/20"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            bottom: "-20px",
          }}
          animate={{
            y: [0, -(windowHeight + 100)],
            x: [0, Math.sin(p.id) * 50],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// SCROLL PROGRESS INDICATOR
// ============================================================================
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300 origin-left z-50"
      style={{ scaleX }}
    />
  );
}

// Magnetic button component removed - using standard buttons instead

// ============================================================================
// 3D TILT CARD COMPONENT
// ============================================================================
function TiltCard({ icon: Icon, title, desc, children, delay = 0 }) {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

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

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
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
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-2xl border border-emerald-300/10 bg-emerald-900/30 backdrop-blur-md p-6 md:p-8"
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
      {children}
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
// SECTION COMPONENT
// ============================================================================
const Section = ({ id, title, eyebrow, children }) => (
  <section id={id} className="relative py-24 md:py-32">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-emerald-900/0" />
    </div>
    <div className="container mx-auto max-w-6xl px-4">
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

// ============================================================================
// OPENROUTER API INTEGRATION
// ============================================================================
async function callOpenRouter({ apiKey, model = "openrouter/auto", messages, temperature = 0.6, useProxy = false, siteUrl, siteName }) {
  const endpoint = useProxy ? "/api/openrouter" : "https://openrouter.ai/api/v1/chat/completions";
  const headers = useProxy
    ? { "Content-Type": "application/json" }
    : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": siteUrl || "https://emeraldgrove.digital/local-prototype",
        "X-Title": siteName || "Emerald Grove Digital Prototype",
      };

  const body = { model, messages, temperature };

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "(no content)";
}

// ============================================================================
// AI GROVE CHAT COMPONENT
// ============================================================================
function AIGrove() {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState("openrouter/auto");
  const [temperature, setTemperature] = useState(0.6);
  const [apiKey, setApiKey] = useState("");
  const [useProxy, setUseProxy] = useState(true);
  const [system, setSystem] = useState(
    "You are the Emerald Grove AI — a strategic, design-forward assistant who blends nature-inspired clarity with state-of-the-art engineering. Be concise, insightful, and practical."
  );
  const [messages, setMessages] = useState([{ role: "system", content: "You are the Emerald Grove AI." }]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const newMsgs = [
      { role: "system", content: system },
      ...messages.filter((m) => m.role !== "system"),
      { role: "user", content: userInput.trim() },
    ];
    setMessages(newMsgs);
    setUserInput("");
    setLoading(true);
    try {
      const content = await callOpenRouter({
        apiKey,
        model,
        messages: newMsgs,
        temperature,
        useProxy,
        siteUrl: typeof window !== "undefined" ? window.location.origin : undefined,
        siteName: "Emerald Grove Digital",
      });
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const saveKey = () => {
    if (apiKey) localStorage.setItem("eg_openrouter_key", apiKey);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full px-5 py-3 bg-emerald-500 text-emerald-950 font-semibold shadow-lg hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      >
        <MessageCircle size={18} /> AI Grove
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: 480, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 480, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-emerald-900/90 backdrop-blur-xl border-l border-emerald-300/10 z-50 flex flex-col"
            role="dialog"
            aria-label="AI Grove Chat"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-300/10">
              <div className="flex items-center gap-2 text-emerald-100">
                <Sparkles size={18} className="text-emerald-300" />
                <span className="font-semibold">Emerald Grove AI</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-emerald-800/50">
                <X size={18} />
              </button>
            </div>

            <details className="px-4 py-2 border-b border-emerald-300/10">
              <summary className="cursor-pointer text-emerald-200/90 flex items-center gap-2">
                <Settings size={16} /> Settings
              </summary>
              <div className="mt-3 space-y-3">
                <label className="block">
                  <span className="text-xs text-emerald-200/70">OpenRouter API Key (for local testing)</span>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2 text-emerald-100"
                    placeholder="or-xxxxxxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-emerald-200/70">Model (e.g., openrouter/auto)</span>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2 text-emerald-100"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-emerald-200/70">Temperature: {temperature.toFixed(1)}</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    className="mt-1 w-full"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  />
                </label>
                <label className="flex items-center gap-2 text-emerald-200/70 text-xs">
                  <input
                    type="checkbox"
                    checked={useProxy}
                    onChange={(e) => setUseProxy(e.target.checked)}
                    className="rounded bg-emerald-950/50 border-emerald-300/10"
                  />
                  Use Proxy (if /api/openrouter exists)
                </label>
                <label className="block">
                  <span className="text-xs text-emerald-200/70">System Prompt</span>
                  <textarea
                    rows={3}
                    className="mt-1 w-full rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2 text-emerald-100"
                    value={system}
                    onChange={(e) => setSystem(e.target.value)}
                  />
                </label>
                <button
                  onClick={saveKey}
                  className="text-xs text-emerald-200/70 hover:text-emerald-200"
                >
                  Save key to localStorage
                </button>
              </div>
            </details>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.filter((m) => m.role !== "system").map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={`inline-block max-w-[85%] rounded-lg px-4 py-2 ${
                      m.role === "user"
                        ? "bg-emerald-500 text-emerald-950"
                        : "bg-emerald-950/70 text-emerald-100 border border-emerald-300/10"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-left">
                  <div className="inline-block bg-emerald-950/70 border border-emerald-300/10 text-emerald-100 px-4 py-2 rounded-lg">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Thinking...
                    </motion.div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-emerald-300/10 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  className="flex-1 rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2 text-emerald-100"
                  placeholder="Ask anything..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading || !userInput.trim()}
                  className="p-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-emerald-950 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function Page() {
  const [navOpen, setNavOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax values
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    
    // On mobile, scroll first, then close menu after a brief delay
    smoothScrollTo(targetId);
    
    // Delay closing the menu so scroll can initiate properly
    setTimeout(() => {
      setNavOpen(false);
    }, 100);
  };

  return (
    <div className="relative min-h-screen text-emerald-100">
      <ScrollProgress />
      <FloatingParticles />
      <CursorTrail />

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-emerald-950/80 border-b border-emerald-300/10">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="text-emerald-300" size={20} />
            <span className="font-semibold tracking-wide">Emerald Grove Digital</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" onClick={(e) => handleNavClick(e, "about")} className="hover:text-emerald-200">
              About
            </a>
            <a href="#services" onClick={(e) => handleNavClick(e, "services")} className="hover:text-emerald-200">
              Services
            </a>
            <a href="#work" onClick={(e) => handleNavClick(e, "work")} className="hover:text-emerald-200">
              Work
            </a>
            <a href="#contact" onClick={(e) => handleNavClick(e, "contact")} className="hover:text-emerald-200">
              Contact
            </a>
            <a
              href="#ai"
              onClick={(e) => handleNavClick(e, "ai")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500 text-emerald-950 font-semibold hover:bg-emerald-400"
            >
              <Sparkles size={14} /> Try AI
            </a>
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
              className="md:hidden border-t border-emerald-300/10"
            >
              <div className="px-4 py-3 space-y-2">
                <a href="#about" onClick={(e) => handleNavClick(e, "about")} className="block py-2">
                  About
                </a>
                <a href="#services" onClick={(e) => handleNavClick(e, "services")} className="block py-2">
                  Services
                </a>
                <a href="#work" onClick={(e) => handleNavClick(e, "work")} className="block py-2">
                  Work
                </a>
                <a href="#contact" onClick={(e) => handleNavClick(e, "contact")} className="block py-2">
                  Contact
                </a>
                <a href="#ai" onClick={(e) => handleNavClick(e, "ai")} className="block py-2">
                  Try AI
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION WITH PARALLAX */}
      <section className="relative overflow-hidden">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[120vw] bg-gradient-to-b from-emerald-300/10 via-emerald-400/10 to-transparent blur-3xl" />
          <div className="absolute -inset-20 bg-[radial-gradient(40%_40%_at_70%_10%,rgba(193,162,74,0.12),transparent)]" />
        </motion.div>
        <div className="container mx-auto max-w-6xl px-4 py-24 md:py-36 relative">
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
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 bg-emerald-500 text-emerald-950 font-semibold shadow hover:bg-emerald-400"
            >
              Start a project <ArrowRight size={16} />
            </a>
            <a
              href="#work"
              onClick={(e) => handleNavClick(e, "work")}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 border border-emerald-300/20 hover:bg-emerald-800/30"
            >
              View work <Play size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <Section id="about" eyebrow="Philosophy" title="Design like nature: clear, adaptive, enduring.">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <TiltCard
            icon={Cpu}
            title="Systems that grow"
            desc="From seed idea to living product — thoughtful architectures that scale with you."
            delay={0}
          >
            <ul className="mt-4 space-y-2 text-emerald-100/80 list-disc list-inside">
              <li>Research → Strategy → Prototyping → Launch</li>
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
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
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
          {[1, 2, 3].map((i) => (
            <TiltCard
              key={i}
              title={`Project ${i}`}
              desc="A short note about the problem, the approach, and the measurable impact."
              delay={i * 0.1}
            />
          ))}
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
              <li>4–8 week Build Cycles</li>
              <li>Ongoing Care & Improvement</li>
            </ul>
          </motion.div>
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            viewport={{ margin: "-100px", amount: 0.3 }}
            transition={{ duration: 0.7 }}
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks — we'll be in touch.");
            }}
            className="bg-emerald-900/40 backdrop-blur rounded-xl border border-emerald-300/10 p-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <label className="col-span-2">
                <span className="text-sm">Your name</span>
                <input className="mt-1 w-full rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2" required />
              </label>
              <label className="col-span-2 md:col-span-1">
                <span className="text-sm">Email</span>
                <input
                  type="email"
                  className="mt-1 w-full rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2"
                  required
                />
              </label>
              <label className="col-span-2 md:col-span-1">
                <span className="text-sm">Company</span>
                <input className="mt-1 w-full rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2" />
              </label>
              <label className="col-span-2">
                <span className="text-sm">What are you building?</span>
                <textarea rows={4} className="mt-1 w-full rounded-md bg-emerald-950/50 border border-emerald-300/10 px-3 py-2" />
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold px-4 py-2"
            >
              Send <ArrowRight size={16} />
            </button>
          </motion.form>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-emerald-300/10 py-10">
        <div className="container mx-auto max-w-6xl px-4 text-sm text-emerald-300/70 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Emerald Grove Digital</span>
          <a id="ai" href="#" className="hover:text-emerald-200">
            Terms · Privacy
          </a>
        </div>
      </footer>

      {/* AI CHAT */}
      <AIGrove />
    </div>
  );
}
