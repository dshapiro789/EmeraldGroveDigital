"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';
import EmojiPicker from 'emoji-picker-react';
import { nanoid } from 'nanoid';
import {
  Send, Sparkles, Leaf, RotateCcw, Settings, ChevronDown, Loader2, Copy, Check,
  Cpu, Zap, Brain, MessageCircle, ArrowLeft, X, RefreshCw, Pencil, StopCircle,
  Save, AlertCircle, BookOpen, Code, Lightbulb, FileText, Palette, Clock,
  TrendingUp, Image as ImageIcon, Camera, Upload, Link2, Share2, Smile,
  User, Plus, Trash2, Eye, Download, Grid, List
} from "lucide-react";

/**
 * AI Playground - Emerald Grove Digital (PREMIUM VERSION)
 *
 * Advanced Features:
 * - Image support with vision models
 * - Rich text input with slash commands
 * - Custom personas
 * - Share conversations
 * - Enhanced prompt library
 * - State-of-the-art formatting
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const AI_MODELS = [
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    icon: Brain,
    description: "Most intelligent, best for complex tasks",
    supportsVision: true,
    color: "emerald"
  },
  {
    id: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    icon: Cpu,
    description: "Powerful reasoning and analysis",
    supportsVision: true,
    color: "emerald"
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    icon: Zap,
    description: "Fast multimodal model",
    supportsVision: true,
    color: "amber"
  },
  {
    id: "openai/gpt-4-vision-preview",
    name: "GPT-4 Vision",
    provider: "OpenAI",
    icon: Eye,
    description: "Specialized vision model",
    supportsVision: true,
    color: "amber"
  },
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    icon: MessageCircle,
    description: "Fast multimodal understanding",
    supportsVision: true,
    color: "purple"
  },
  {
    id: "meta-llama/llama-3.2-90b-vision-instruct",
    name: "Llama 3.2 Vision",
    provider: "Meta",
    icon: Sparkles,
    description: "Open source vision model",
    supportsVision: true,
    color: "blue"
  }
];

const PROMPT_CATEGORIES = [
  {
    id: "coding",
    name: "Coding",
    icon: Code,
    templates: [
      {
        id: "debug",
        name: "Debug Code",
        prompt: "I need help debugging this code:\n\n```\n[paste your code here]\n```\n\nThe issue I'm experiencing is: [describe the problem]",
        slashCommand: "/debug"
      },
      {
        id: "explain-code",
        name: "Explain Code",
        prompt: "Please explain this code in detail:\n\n```\n[paste code]\n```",
        slashCommand: "/explain"
      },
      {
        id: "optimize",
        name: "Optimize Code",
        prompt: "Can you optimize this code for better performance?\n\n```\n[paste code]\n```",
        slashCommand: "/optimize"
      },
      {
        id: "review",
        name: "Code Review",
        prompt: "Please review this code and suggest improvements:\n\n```\n[paste code]\n```",
        slashCommand: "/review"
      }
    ]
  },
  {
    id: "writing",
    name: "Writing",
    icon: Palette,
    templates: [
      {
        id: "creative",
        name: "Creative Writing",
        prompt: "Write a creative story about: [your topic]\n\nTone: [e.g., mysterious, uplifting, dramatic]\nLength: [e.g., short paragraph, full story]",
        slashCommand: "/creative"
      },
      {
        id: "blog",
        name: "Blog Post",
        prompt: "Write a blog post about: [topic]\n\nTarget audience: [describe]\nTone: [professional/casual/technical]\nLength: [short/medium/long]",
        slashCommand: "/blog"
      },
      {
        id: "email",
        name: "Email Draft",
        prompt: "Help me write an email:\n\nTo: [recipient]\nPurpose: [what you want to achieve]\nTone: [formal/casual/friendly]",
        slashCommand: "/email"
      }
    ]
  },
  {
    id: "learning",
    name: "Learning",
    icon: FileText,
    templates: [
      {
        id: "technical",
        name: "Explain Concept",
        prompt: "Explain [technical concept] in simple terms that a beginner can understand. Use analogies and examples.",
        slashCommand: "/explain"
      },
      {
        id: "summarize",
        name: "Summarize",
        prompt: "Please summarize the following:\n\n[paste text or provide topic]",
        slashCommand: "/summarize"
      },
      {
        id: "eli5",
        name: "ELI5",
        prompt: "Explain like I'm 5: [complex topic]",
        slashCommand: "/eli5"
      }
    ]
  },
  {
    id: "business",
    name: "Business",
    icon: Lightbulb,
    templates: [
      {
        id: "brainstorm",
        name: "Brainstorming",
        prompt: "Help me brainstorm ideas for: [your project/problem]\n\nContext: [provide relevant background]\nGoal: [what you want to achieve]",
        slashCommand: "/brainstorm"
      },
      {
        id: "marketing",
        name: "Marketing Copy",
        prompt: "Create marketing copy for: [product/service]\n\nTarget audience: [describe]\nKey benefits: [list]\nTone: [describe]",
        slashCommand: "/marketing"
      },
      {
        id: "pitch",
        name: "Pitch Deck",
        prompt: "Help me create a pitch for: [business idea]\n\nProblem: [what problem does it solve]\nSolution: [your solution]\nTarget market: [who is it for]",
        slashCommand: "/pitch"
      }
    ]
  }
];

const DEFAULT_PERSONAS = [
  {
    id: "default",
    name: "Default Assistant",
    icon: "💬",
    description: "Balanced and helpful",
    systemPrompt: "",
    temperature: 0.7,
    maxTokens: 4000
  },
  {
    id: "coder",
    name: "Code Expert",
    icon: "👨‍💻",
    description: "Expert programmer and debugger",
    systemPrompt: "You are an expert software engineer with deep knowledge of programming languages, algorithms, and best practices. Provide clear, well-commented code examples and explain technical concepts thoroughly.",
    temperature: 0.3,
    maxTokens: 4000
  },
  {
    id: "creative",
    name: "Creative Writer",
    icon: "🎨",
    description: "Imaginative and expressive",
    systemPrompt: "You are a creative writer with a vivid imagination. Write engaging stories, generate creative ideas, and think outside the box. Use descriptive language and interesting metaphors.",
    temperature: 1.5,
    maxTokens: 4000
  },
  {
    id: "teacher",
    name: "Patient Teacher",
    icon: "📚",
    description: "Clear explanations with examples",
    systemPrompt: "You are a patient teacher who explains complex concepts in simple terms. Use analogies, examples, and step-by-step breakdowns. Always check if the student understands before moving forward.",
    temperature: 0.7,
    maxTokens: 4000
  },
  {
    id: "analyst",
    name: "Data Analyst",
    icon: "📊",
    description: "Analytical and data-driven",
    systemPrompt: "You are a data analyst who thinks critically and analytically. Provide structured, well-reasoned responses with evidence. Focus on facts, logic, and clear conclusions.",
    temperature: 0.4,
    maxTokens: 4000
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateShareableLink = (conversation) => {
  const encoded = btoa(JSON.stringify({
    messages: conversation.messages,
    model: conversation.model,
    timestamp: new Date().toISOString()
  }));
  return `${window.location.origin}/ai-playground?shared=${encoded}`;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// ============================================================================
// CURSOR TRAIL
// ============================================================================
function CursorTrail() {
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const particleIdRef = useRef(0);

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

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const currentTime = Date.now();
      if (currentTime - lastTime > 50) {
        const id = particleIdRef.current++;
        const particleType = Math.random() > 0.5 ? 'sparkle' : 'leaf';

        setParticles((prev) => [
          ...prev.slice(-15),
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
            scale: p.scale * 0.97,
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
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
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
// PERSONA MANAGER COMPONENT
// ============================================================================
function PersonaManager({ isOpen, onClose, personas, onPersonasChange, currentPersona, onSelectPersona }) {
  const [localPersonas, setLocalPersonas] = useState(personas);
  const [editingId, setEditingId] = useState(null);
  const [newPersona, setNewPersona] = useState({
    name: "",
    icon: "🤖",
    description: "",
    systemPrompt: "",
    temperature: 0.7,
    maxTokens: 4000
  });

  const handleAddPersona = () => {
    const persona = {
      id: nanoid(),
      ...newPersona,
      isCustom: true
    };
    setLocalPersonas([...localPersonas, persona]);
    setNewPersona({
      name: "",
      icon: "🤖",
      description: "",
      systemPrompt: "",
      temperature: 0.7,
      maxTokens: 4000
    });
  };

  const handleDeletePersona = (id) => {
    setLocalPersonas(localPersonas.filter(p => p.id !== id));
  };

  const handleSave = () => {
    onPersonasChange(localPersonas);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-emerald-950/95 backdrop-blur-xl border-l border-emerald-300/20 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-emerald-400" />
                  <h2 className="text-lg font-semibold">AI Personas</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-emerald-900/40 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-emerald-300/60">
                Personas are pre-configured AI personalities with custom behaviors and settings.
              </p>

              {/* Existing Personas */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-emerald-200">Your Personas</h3>
                {localPersonas.map((persona) => (
                  <div
                    key={persona.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      currentPersona?.id === persona.id
                        ? 'bg-emerald-500/20 border-emerald-400/30'
                        : 'bg-emerald-900/20 border-emerald-300/10 hover:border-emerald-300/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{persona.icon}</span>
                        <div>
                          <h4 className="font-medium">{persona.name}</h4>
                          <p className="text-xs text-emerald-300/60 mt-1">{persona.description}</p>
                          <div className="flex gap-3 mt-2 text-xs text-emerald-400/60">
                            <span>Temp: {persona.temperature}</span>
                            <span>Tokens: {persona.maxTokens}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onSelectPersona(persona)}
                          className="p-2 rounded-lg hover:bg-emerald-800/40 transition-colors"
                          title="Use this persona"
                        >
                          <Eye size={14} />
                        </button>
                        {persona.isCustom && (
                          <button
                            onClick={() => handleDeletePersona(persona.id)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Delete persona"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Persona */}
              <div className="space-y-4 pt-4 border-t border-emerald-300/10">
                <h3 className="text-sm font-medium text-emerald-200 flex items-center gap-2">
                  <Plus size={16} />
                  Create Custom Persona
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-emerald-300/80">Icon (emoji)</label>
                    <input
                      type="text"
                      value={newPersona.icon}
                      onChange={(e) => setNewPersona({ ...newPersona, icon: e.target.value })}
                      className="w-full px-3 py-2 bg-emerald-900/30 border border-emerald-300/20 rounded-lg focus:outline-none focus:border-emerald-400/40 text-sm mt-1"
                      placeholder="🤖"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-emerald-300/80">Name</label>
                    <input
                      type="text"
                      value={newPersona.name}
                      onChange={(e) => setNewPersona({ ...newPersona, name: e.target.value })}
                      className="w-full px-3 py-2 bg-emerald-900/30 border border-emerald-300/20 rounded-lg focus:outline-none focus:border-emerald-400/40 text-sm mt-1"
                      placeholder="My Custom Assistant"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-emerald-300/80">Description</label>
                    <input
                      type="text"
                      value={newPersona.description}
                      onChange={(e) => setNewPersona({ ...newPersona, description: e.target.value })}
                      className="w-full px-3 py-2 bg-emerald-900/30 border border-emerald-300/20 rounded-lg focus:outline-none focus:border-emerald-400/40 text-sm mt-1"
                      placeholder="Brief description"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-emerald-300/80">System Prompt</label>
                    <textarea
                      value={newPersona.systemPrompt}
                      onChange={(e) => setNewPersona({ ...newPersona, systemPrompt: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-emerald-900/30 border border-emerald-300/20 rounded-lg resize-none focus:outline-none focus:border-emerald-400/40 text-sm mt-1"
                      placeholder="You are a helpful assistant who..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-emerald-300/80 flex justify-between">
                        <span>Temperature</span>
                        <span className="text-emerald-400">{newPersona.temperature}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={newPersona.temperature}
                        onChange={(e) => setNewPersona({ ...newPersona, temperature: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-emerald-900/40 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-emerald-300/80 flex justify-between">
                        <span>Max Tokens</span>
                        <span className="text-emerald-400">{newPersona.maxTokens}</span>
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="4000"
                        step="100"
                        value={newPersona.maxTokens}
                        onChange={(e) => setNewPersona({ ...newPersona, maxTokens: parseInt(e.target.value) })}
                        className="w-full h-2 bg-emerald-900/40 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddPersona}
                    disabled={!newPersona.name || !newPersona.description}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-lg hover:bg-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add Persona
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-emerald-950 rounded-lg hover:bg-emerald-400 transition-colors font-medium"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// SETTINGS PANEL COMPONENT
// ============================================================================
function SettingsPanel({ isOpen, onClose, settings, onSettingsChange, onOpenPersonas }) {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-emerald-950/95 backdrop-blur-xl border-l border-emerald-300/20 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings size={20} className="text-emerald-400" />
                  <h2 className="text-lg font-semibold">Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-emerald-900/40 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Persona Manager Link */}
              <button
                onClick={() => {
                  onClose();
                  onOpenPersonas();
                }}
                className="w-full p-4 rounded-lg bg-emerald-500/10 border border-emerald-400/20 hover:bg-emerald-500/20 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <User size={20} className="text-emerald-400" />
                  <div>
                    <p className="font-medium">Manage Personas</p>
                    <p className="text-xs text-emerald-300/60 mt-0.5">Create and customize AI personalities</p>
                  </div>
                </div>
              </button>

              {/* Temperature */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm">
                  <span className="text-emerald-100">Temperature</span>
                  <span className="text-emerald-400 font-mono">{localSettings.temperature.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={localSettings.temperature}
                  onChange={(e) => setLocalSettings({ ...localSettings, temperature: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-emerald-900/40 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-xs text-emerald-300/60">
                  Lower = more focused, Higher = more creative
                </p>
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm">
                  <span className="text-emerald-100">Max Tokens</span>
                  <span className="text-emerald-400 font-mono">{localSettings.maxTokens}</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={localSettings.maxTokens}
                  onChange={(e) => setLocalSettings({ ...localSettings, maxTokens: parseInt(e.target.value) })}
                  className="w-full h-2 bg-emerald-900/40 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-xs text-emerald-300/60">
                  Maximum length of AI response
                </p>
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <label className="text-sm text-emerald-100">System Prompt</label>
                <textarea
                  value={localSettings.systemPrompt}
                  onChange={(e) => setLocalSettings({ ...localSettings, systemPrompt: e.target.value })}
                  placeholder="Optional: Set a custom system prompt to guide the AI's behavior..."
                  rows={4}
                  className="w-full px-3 py-2 bg-emerald-900/30 border border-emerald-300/20 rounded-lg resize-none focus:outline-none focus:border-emerald-400/40 text-sm"
                />
                <p className="text-xs text-emerald-300/60">
                  Customize AI behavior (e.g., "You are a helpful coding assistant")
                </p>
              </div>

              {/* Streaming Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-100">Streaming Responses</p>
                  <p className="text-xs text-emerald-300/60">Show responses word-by-word</p>
                </div>
                <button
                  onClick={() => setLocalSettings({ ...localSettings, streaming: !localSettings.streaming })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    localSettings.streaming ? 'bg-emerald-500' : 'bg-emerald-900/40'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      localSettings.streaming ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show Character Count Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-100">Character Counter</p>
                  <p className="text-xs text-emerald-300/60">Show character count in input</p>
                </div>
                <button
                  onClick={() => setLocalSettings({ ...localSettings, showCharCount: !localSettings.showCharCount })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    localSettings.showCharCount ? 'bg-emerald-500' : 'bg-emerald-900/40'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      localSettings.showCharCount ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-emerald-950 rounded-lg hover:bg-emerald-400 transition-colors font-medium"
              >
                <Save size={18} />
                Save Settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// PROMPT LIBRARY COMPONENT (ENHANCED)
// ============================================================================
function PromptLibrary({ isOpen, onClose, onSelectTemplate }) {
  const [selectedCategory, setSelectedCategory] = useState(PROMPT_CATEGORIES[0].id);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const currentCategory = PROMPT_CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl bg-emerald-950/95 backdrop-blur-xl border border-emerald-300/20 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-emerald-300/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} className="text-emerald-400" />
                  <h2 className="text-lg font-semibold">Prompt Library</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="p-2 rounded-lg hover:bg-emerald-900/40 transition-colors"
                    title={viewMode === 'grid' ? 'List view' : 'Grid view'}
                  >
                    {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-emerald-900/40 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {PROMPT_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-200'
                          : 'bg-emerald-900/20 border border-emerald-300/10 hover:border-emerald-300/20 text-emerald-300/70'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Templates */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 gap-3' : 'space-y-3'}>
                {currentCategory?.templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template.prompt);
                      onClose();
                    }}
                    className="p-4 text-left rounded-lg bg-emerald-900/30 border border-emerald-300/10 hover:bg-emerald-800/40 hover:border-emerald-300/20 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{template.name}</h3>
                      {template.slashCommand && (
                        <code className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
                          {template.slashCommand}
                        </code>
                      )}
                    </div>
                    <p className="text-xs text-emerald-300/60 line-clamp-2">{template.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// MODEL SELECTOR COMPONENT
// ============================================================================
function ModelSelector({ selectedModel, onSelect, hasImages }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentModel = AI_MODELS.find(m => m.id === selectedModel);
  const Icon = currentModel?.icon || Brain;

  // Filter models based on whether we have images
  const availableModels = hasImages
    ? AI_MODELS.filter(m => m.supportsVision)
    : AI_MODELS;

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-emerald-400" />
          <span className="text-sm font-medium">{currentModel?.name || "Select Model"}</span>
          {hasImages && <ImageIcon size={12} className="text-emerald-400" title="Vision mode" />}
        </div>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 left-0 right-0 sm:left-auto sm:right-0 sm:w-80 bg-emerald-950/95 backdrop-blur-xl border border-emerald-300/20 rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
                {hasImages && (
                  <div className="px-3 py-2 text-xs text-emerald-400/80 border-b border-emerald-300/10 mb-2">
                    <div className="flex items-center gap-1">
                      <ImageIcon size={12} />
                      <span>Vision-capable models only</span>
                    </div>
                  </div>
                )}
                {availableModels.map((model) => {
                  const ModelIcon = model.icon;
                  return (
                    <button
                      key={model.id}
                      onClick={() => {
                        onSelect(model.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                        model.id === selectedModel
                          ? 'bg-emerald-500/20 border border-emerald-400/30'
                          : 'hover:bg-emerald-900/40 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <ModelIcon size={18} className="text-emerald-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{model.name}</span>
                            {model.supportsVision && <ImageIcon size={10} className="text-emerald-400/60" />}
                            {model.id === selectedModel && (
                              <Check size={14} className="text-emerald-400" />
                            )}
                          </div>
                          <p className="text-xs text-emerald-300/60 mt-0.5">
                            {model.provider} · {model.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// CODE BLOCK WITH COPY BUTTON
// ============================================================================
function CodeBlock({ children, className, ...props }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  const language = className ? className.replace('language-', '') : '';

  const handleCopy = async () => {
    const code = codeRef.current?.textContent || '';
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 transition-colors opacity-0 group-hover:opacity-100 z-10"
        title="Copy code"
      >
        {copied ? (
          <Check size={14} className="text-emerald-400" />
        ) : (
          <Copy size={14} className="text-emerald-300" />
        )}
      </button>
      {language && (
        <div className="absolute top-2 left-3 text-xs text-emerald-400/60 font-mono uppercase">
          {language}
        </div>
      )}
      <pre className={className} {...props}>
        <code ref={codeRef} className={className}>
          {children}
        </code>
      </pre>
    </div>
  );
}

// ============================================================================
// MESSAGE COMPONENT
// ============================================================================
function Message({ message, isLast, isStreaming, onRegenerate, onEdit, followUpSuggestions }) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await copyToClipboard(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    onEdit(message, editedContent);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-3xl w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-emerald-900/40 border border-emerald-300/20'
        }`}>
          {isUser ? (
            <span className="text-xs font-semibold text-emerald-300">You</span>
          ) : (
            <Sparkles size={14} className="text-emerald-400" />
          )}
        </div>

        <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-4 py-3 bg-emerald-900/30 border border-emerald-300/20 rounded-lg resize-none focus:outline-none focus:border-emerald-400/40"
                rows={4}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-emerald-900/30 hover:bg-emerald-800/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1.5 text-sm rounded-lg bg-emerald-500 text-emerald-950 hover:bg-emerald-400 transition-colors"
                >
                  Save & Resend
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={`inline-block px-4 py-3 rounded-2xl ${
                isUser ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-emerald-900/30 border border-emerald-300/10'
              }`}>
                {/* Show images if present */}
                {message.images && message.images.length > 0 && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {message.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Upload ${idx + 1}`}
                        className="rounded-lg max-w-xs h-auto border border-emerald-300/20"
                      />
                    ))}
                  </div>
                )}

                {isUser ? (
                  <p className="text-emerald-100 whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                ) : (
                  <div className="prose prose-invert prose-emerald max-w-none prose-headings:text-emerald-200 prose-p:text-emerald-100 prose-p:leading-relaxed prose-strong:text-emerald-200 prose-code:text-emerald-300 prose-code:bg-emerald-900/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-emerald-950/50 prose-pre:border prose-pre:border-emerald-300/10 prose-pre:shadow-lg prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-emerald-400 prose-blockquote:text-emerald-200/80 prose-ul:text-emerald-100 prose-ol:text-emerald-100 prose-li:text-emerald-100">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      components={{
                        code: ({ node, inline, className, children, ...props }) => {
                          if (inline) {
                            return <code className={className} {...props}>{children}</code>;
                          }
                          return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                    {isStreaming && isLast && (
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="inline-block w-1 h-4 bg-emerald-400 ml-1 align-middle"
                      />
                    )}
                  </div>
                )}
              </div>

              <div className={`mt-2 flex gap-2 flex-wrap ${isUser ? 'justify-end' : 'justify-start'}`}>
                {isUser ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <Pencil size={12} />
                    <span>Edit</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={12} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    {isLast && !isStreaming && onRegenerate && (
                      <button
                        onClick={onRegenerate}
                        className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <RefreshCw size={12} />
                        <span>Regenerate</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Follow-up suggestions - NOW CLICKABLE */}
              {!isUser && isLast && !isStreaming && followUpSuggestions && followUpSuggestions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-emerald-400/60 flex items-center gap-1">
                    <Lightbulb size={12} />
                    Suggested follow-ups:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {followUpSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => onEdit({ role: 'user', content: '' }, suggestion)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-emerald-900/30 border border-emerald-300/10 hover:bg-emerald-800/40 hover:border-emerald-300/20 transition-colors cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// RATE LIMIT DISPLAY
// ============================================================================
function RateLimitDisplay({ current, max, resetTime }) {
  const percentage = (current / max) * 100;
  const remaining = max - current;
  const isWarning = percentage >= 80;
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimeLeft = () => {
      if (!resetTime) return;
      const now = new Date();
      const reset = new Date(resetTime);
      const diff = reset - now;

      if (diff <= 0) {
        setTimeLeft('Resetting...');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [resetTime]);

  return (
    <div className="px-4 py-3 bg-emerald-900/20 border border-emerald-300/10 rounded-lg space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className={isWarning ? 'text-amber-400' : 'text-emerald-400'} />
          <span className="text-emerald-100">
            {remaining} of {max} requests left
          </span>
        </div>
        {resetTime && (
          <div className="flex items-center gap-1 text-xs text-emerald-400/60">
            <Clock size={12} />
            <span>{timeLeft}</span>
          </div>
        )}
      </div>

      <div className="w-full h-2 bg-emerald-900/40 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full rounded-full ${isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
        />
      </div>

      {isWarning && (
        <div className="flex items-start gap-2 text-xs text-amber-400/80">
          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
          <p>You're approaching the rate limit. Requests will be blocked when you reach {max}/{max}.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SHARE MODAL
// ============================================================================
function ShareModal({ isOpen, onClose, messages, model }) {
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      const link = generateShareableLink({ messages, model });
      setShareLink(link);
    }
  }, [isOpen, messages, model]);

  const handleCopy = async () => {
    const success = await copyToClipboard(shareLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-emerald-950/95 backdrop-blur-xl border border-emerald-300/20 rounded-2xl shadow-2xl z-50 p-6 mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Share2 size={20} className="text-emerald-400" />
                <h2 className="text-lg font-semibold">Share Conversation</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-emerald-900/40 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-emerald-300/60 mb-4">
              Anyone with this link can view this conversation.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 bg-emerald-900/30 border border-emerald-300/20 rounded-lg text-sm focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-emerald-500 text-emerald-950 rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// IMAGE & FILE UPLOAD COMPONENT
// ============================================================================
function ImageUploadSection({ images, onImagesChange }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (files) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const base64Images = await Promise.all(
      imageFiles.map(file => convertImageToBase64(file))
    );
    onImagesChange([...images, ...base64Images]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <>
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2 px-5">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img}
                alt={`Upload ${idx + 1}`}
                className="h-20 w-20 object-cover rounded-lg border border-emerald-300/20"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`mx-5 mb-2 border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging
            ? 'border-emerald-400 bg-emerald-500/10'
            : 'border-emerald-300/20 hover:border-emerald-300/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <div className="flex items-center justify-center gap-2">
          <Upload size={16} className="text-emerald-400" />
          <span className="text-sm text-emerald-300/60">
            Drop images here or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              browse
            </button>
          </span>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// RICH TEXT INPUT WITH SLASH COMMANDS
// ============================================================================
function RichTextInput({
  value,
  onChange,
  onSubmit,
  disabled,
  showEmoji,
  onToggleEmoji,
  onEmojiSelect,
  images,
  onImagesChange,
  showImageUpload,
  setShowImageUpload
}) {
  const textareaRef = useRef(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashSearch, setSlashSearch] = useState('');
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  // Detect slash commands
  useEffect(() => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPos);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    if (lastSlashIndex !== -1 && lastSlashIndex === textBeforeCursor.length - 1) {
      setShowSlashMenu(true);
      setSlashSearch('');
      // Position menu below cursor
      if (textareaRef.current) {
        const rect = textareaRef.current.getBoundingClientRect();
        setSlashMenuPos({ top: rect.bottom + 5, left: rect.left });
      }
    } else if (lastSlashIndex !== -1) {
      const searchTerm = textBeforeCursor.slice(lastSlashIndex + 1);
      if (!searchTerm.includes(' ')) {
        setShowSlashMenu(true);
        setSlashSearch(searchTerm);
      } else {
        setShowSlashMenu(false);
      }
    } else {
      setShowSlashMenu(false);
    }
  }, [value]);

  // Get filtered slash commands
  const getSlashCommands = () => {
    const allCommands = PROMPT_CATEGORIES.flatMap(cat =>
      cat.templates.map(t => ({
        ...t,
        category: cat.name
      }))
    );

    if (!slashSearch) return allCommands.slice(0, 5);

    return allCommands.filter(cmd =>
      cmd.slashCommand?.toLowerCase().includes(slashSearch.toLowerCase()) ||
      cmd.name.toLowerCase().includes(slashSearch.toLowerCase())
    ).slice(0, 5);
  };

  const handleSlashCommand = (template) => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPos);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');
    const newText = value.slice(0, lastSlashIndex) + template.prompt;
    onChange({ target: { value: newText } });
    setShowSlashMenu(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !showSlashMenu) {
      e.preventDefault();
      onSubmit(e);
    }
    if (e.key === 'Escape' && showSlashMenu) {
      setShowSlashMenu(false);
    }
  };

  return (
    <div className="relative">
      {/* Image Upload Section */}
      {showImageUpload && (
        <ImageUploadSection images={images} onImagesChange={onImagesChange} />
      )}

      {/* Slash Command Menu */}
      {showSlashMenu && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowSlashMenu(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-5 mb-2 w-80 max-w-[calc(100%-2.5rem)] bg-emerald-950/95 backdrop-blur-xl border border-emerald-300/20 rounded-lg shadow-2xl z-40 overflow-hidden"
          >
            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
              <div className="px-3 py-2 text-xs text-emerald-400/60 border-b border-emerald-300/10">
                Slash Commands
              </div>
              {getSlashCommands().map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => handleSlashCommand(cmd)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-800/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{cmd.name}</span>
                    {cmd.slashCommand && (
                      <code className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        {cmd.slashCommand}
                      </code>
                    )}
                  </div>
                  <p className="text-xs text-emerald-300/60 line-clamp-1">{cmd.prompt}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmoji && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={onToggleEmoji}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-2 z-50"
            >
              <div className="bg-emerald-950/95 backdrop-blur-xl border border-emerald-300/20 rounded-lg shadow-2xl overflow-hidden">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    onEmojiSelect(emojiData.emoji);
                    onToggleEmoji();
                  }}
                  theme="dark"
                  width={300}
                  height={400}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Message AI... (type / for commands)"
        rows={1}
        className="w-full px-5 py-4 pr-36 bg-transparent resize-none focus:outline-none text-emerald-50 placeholder-emerald-400/40 max-h-40 overflow-y-auto"
        disabled={disabled}
      />

      {/* Action Buttons - Positioned to the left of the send button */}
      <div className="absolute right-16 bottom-3 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setShowImageUpload(!showImageUpload)}
          className={`p-2 rounded-lg transition-colors ${
            showImageUpload || images.length > 0
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'hover:bg-emerald-900/40 text-emerald-300'
          }`}
          title="Add images"
        >
          <ImageIcon size={18} />
        </button>
        <button
          type="button"
          onClick={onToggleEmoji}
          className="p-2 rounded-lg hover:bg-emerald-900/40 transition-colors"
          title="Add emoji"
        >
          <Smile size={18} className="text-emerald-300" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN AI PLAYGROUND COMPONENT
// ============================================================================
export default function AIPlayground() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [showSettings, setShowSettings] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showPersonas, setShowPersonas] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 4000,
    systemPrompt: '',
    streaming: true,
    showCharCount: false
  });
  const [personas, setPersonas] = useState(DEFAULT_PERSONAS);
  const [currentPersona, setCurrentPersona] = useState(DEFAULT_PERSONAS[0]);
  const [rateLimit, setRateLimit] = useState({ current: 0, max: 20, resetTime: null });
  const [followUpSuggestions, setFollowUpSuggestions] = useState([]);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Apply persona settings
  const handleSelectPersona = (persona) => {
    setCurrentPersona(persona);
    setSettings({
      ...settings,
      temperature: persona.temperature,
      maxTokens: persona.maxTokens,
      systemPrompt: persona.systemPrompt
    });
    setShowPersonas(false);
  };

  // Generate follow-up suggestions
  const generateFollowUpSuggestions = (lastResponse) => {
    const suggestions = [];
    if (lastResponse.toLowerCase().includes('code') || lastResponse.includes('```')) {
      suggestions.push('Can you explain this code in more detail?');
      suggestions.push('Are there any potential improvements?');
    }
    if (lastResponse.split('\n').length > 5) {
      suggestions.push('Can you summarize this?');
    }
    suggestions.push('Tell me more');
    return suggestions.slice(0, 3);
  };

  const handleSubmit = async (e, customInput = null) => {
    e?.preventDefault();
    const messageContent = customInput || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage = {
      role: 'user',
      content: messageContent, // Original content for display
      images: images.length > 0 ? images : undefined
    };

    // Auto-switch to vision model if images are uploaded and current model doesn't support vision
    if (images.length > 0) {
      const currentModel = AI_MODELS.find(m => m.id === selectedModel);
      if (!currentModel?.supportsVision) {
        // Switch to Claude 3.5 Sonnet (best vision model)
        setSelectedModel('anthropic/claude-3.5-sonnet');
      }
    }

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setImages([]);
    setShowImageUpload(false);
    setIsLoading(true);
    setIsStreaming(settings.streaming);
    setFollowUpSuggestions([]);

    abortControllerRef.current = new AbortController();
    const assistantMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      // Prepare messages for API - use OpenAI vision format for images
      const apiMessages = [...messages, userMessage].map(msg => {
        // If message has images, use vision format (OpenAI-compatible)
        if (msg.images && msg.images.length > 0) {
          const contentArray = [
            {
              type: "text",
              text: msg.content
            }
          ];

          // Add each image in the correct format
          msg.images.forEach(imageBase64 => {
            contentArray.push({
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            });
          });

          return {
            role: msg.role,
            content: contentArray
          };
        }

        // Regular text-only message
        return {
          role: msg.role,
          content: msg.content
        };
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModel,
          stream: settings.streaming,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
          system_prompt: settings.systemPrompt
        }),
        signal: abortControllerRef.current.signal
      });

      const rateLimitMax = parseInt(response.headers.get('X-RateLimit-Limit') || '20');
      const rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '20');
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');

      setRateLimit({
        current: rateLimitMax - rateLimitRemaining,
        max: rateLimitMax,
        resetTime: rateLimitReset
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('=== API Error Response ===');
        console.error('Status:', response.status);
        console.error('Error data:', errorData);
        const errorMessage = errorData.message || errorData.error || 'Failed to get response';
        const detailsMessage = errorData.details ? `\n\nDetails: ${JSON.stringify(errorData.details, null, 2)}` : '';
        throw new Error(errorMessage + detailsMessage);
      }

      if (settings.streaming) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulatedContent += parsed.content;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[assistantMessageIndex] = {
                      role: 'assistant',
                      content: accumulatedContent
                    };
                    return newMessages;
                  });
                }
              } catch (e) {
                console.error('Error parsing stream:', e);
              }
            }
          }
        }

        setFollowUpSuggestions(generateFollowUpSuggestions(accumulatedContent));
      } else {
        const data = await response.json();
        const content = data.message || 'No response generated';
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[assistantMessageIndex] = {
            role: 'assistant',
            content: content
          };
          return newMessages;
        });
        setFollowUpSuggestions(generateFollowUpSuggestions(content));
      }

      setIsStreaming(false);
    } catch (error) {
      if (error.name === 'AbortError') {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[assistantMessageIndex] = {
            role: 'assistant',
            content: newMessages[assistantMessageIndex].content + '\n\n[Response stopped by user]'
          };
          return newMessages;
        });
      } else {
        console.error('Error:', error);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[assistantMessageIndex] = {
            role: 'assistant',
            content: `Sorry, I encountered an error: ${error.message}`
          };
          return newMessages;
        });
      }
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleRegenerate = () => {
    if (messages.length < 2) return;
    const lastUserMessage = messages[messages.length - 2];
    setMessages(prev => prev.slice(0, -1));
    setTimeout(() => handleSubmit(null, lastUserMessage.content), 100);
  };

  const handleEditMessage = (message, newContent) => {
    if (!newContent.trim()) return;
    const messageIndex = messages.findIndex(m => m === message);
    if (messageIndex === -1) return;
    setMessages(prev => prev.slice(0, messageIndex));
    setTimeout(() => handleSubmit(null, newContent), 100);
  };

  const handleReset = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
      setFollowUpSuggestions([]);
      setImages([]);
    }
  };

  const handleTemplateSelect = (template) => {
    setInput(template);
  };

  const handleEmojiSelect = (emoji) => {
    setInput(prev => prev + emoji);
  };

  const charCount = input.length;
  const charLimit = 4000;
  const hasImages = images.length > 0 || messages.some(m => m.images);

  return (
    <div className="relative min-h-screen bg-[#041712] text-emerald-50">
      <CursorTrail />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[120vw] bg-gradient-to-b from-emerald-300/10 via-emerald-400/10 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <PersonaManager
        isOpen={showPersonas}
        onClose={() => setShowPersonas(false)}
        personas={personas}
        onPersonasChange={setPersonas}
        currentPersona={currentPersona}
        onSelectPersona={handleSelectPersona}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
        onOpenPersonas={() => setShowPersonas(true)}
      />

      <PromptLibrary
        isOpen={showPromptLibrary}
        onClose={() => setShowPromptLibrary(false)}
        onSelectTemplate={handleTemplateSelect}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        messages={messages}
        model={selectedModel}
      />

      <header className="sticky top-0 z-40 bg-emerald-950/30 backdrop-blur-xl border-b border-emerald-300/10">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-col gap-3 sm:hidden">
            <div className="flex items-center justify-between">
              <a href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back</span>
              </a>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-400" />
                <h1 className="text-base font-semibold">AI Playground</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ModelSelector selectedModel={selectedModel} onSelect={setSelectedModel} hasImages={hasImages} />
              </div>
              <button onClick={() => setShowPromptLibrary(true)} className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors" title="Templates">
                <BookOpen size={16} />
              </button>
              <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors" title="Settings">
                <Settings size={16} />
              </button>
              <button onClick={() => setShowShareModal(true)} disabled={messages.length === 0} className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors disabled:opacity-40" title="Share">
                <Share2 size={16} />
              </button>
              <button onClick={handleReset} className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors" title="Reset">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back to Grove</span>
              </a>
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-400" />
                <h1 className="text-lg font-semibold">AI Playground</h1>
                <span className="text-xs text-emerald-400/60">· {currentPersona.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ModelSelector selectedModel={selectedModel} onSelect={setSelectedModel} hasImages={hasImages} />
              <button onClick={() => setShowPromptLibrary(true)} className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors" title="Templates">
                <BookOpen size={16} />
              </button>
              <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors" title="Settings">
                <Settings size={16} />
              </button>
              <button onClick={() => setShowShareModal(true)} disabled={messages.length === 0} className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors disabled:opacity-40" title="Share">
                <Share2 size={16} />
              </button>
              <button onClick={handleReset} className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors" title="Reset">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        {rateLimit.current > 0 && (
          <div className="mb-6">
            <RateLimitDisplay current={rateLimit.current} max={rateLimit.max} resetTime={rateLimit.resetTime} />
          </div>
        )}

        {messages.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/20 mb-6">
              <span className="text-3xl">{currentPersona.icon}</span>
            </div>
            <h2 className="text-2xl font-semibold mb-3">Chat with {currentPersona.name}</h2>
            <p className="text-emerald-100/60 max-w-md mx-auto mb-8">
              {currentPersona.description}. Enhanced with vision, slash commands, and smart features.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-6">
              {["Explain quantum computing simply", "Write a creative short story", "Help me debug this code", "Brainstorm marketing ideas"].map((prompt, i) => (
                <button key={i} onClick={() => setInput(prompt)} className="px-4 py-3 text-left text-sm rounded-lg bg-emerald-900/30 border border-emerald-300/10 hover:bg-emerald-800/40 hover:border-emerald-300/20 transition-colors">
                  {prompt}
                </button>
              ))}
            </div>

            <button onClick={() => setShowPromptLibrary(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-emerald-500/20 border border-emerald-400/30 hover:bg-emerald-500/30 transition-colors">
              <BookOpen size={16} />
              Browse Templates
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <Message
                key={index}
                message={message}
                isLast={index === messages.length - 1}
                isStreaming={isStreaming && index === messages.length - 1 && message.role === 'assistant'}
                onRegenerate={index === messages.length - 1 && message.role === 'assistant' ? handleRegenerate : null}
                onEdit={handleEditMessage}
                followUpSuggestions={index === messages.length - 1 && message.role === 'assistant' ? followUpSuggestions : null}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#041712] via-[#041712] to-transparent pt-8 pb-6">
        <div className="container mx-auto max-w-4xl px-4">
          {isLoading && (
            <div className="mb-3 flex justify-center">
              <button onClick={handleStop} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-400 hover:bg-amber-500/30 transition-colors">
                <StopCircle size={16} />
                Stop Generating
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="relative bg-emerald-950/50 backdrop-blur-xl border border-emerald-300/20 rounded-2xl shadow-2xl overflow-visible">
              <RichTextInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onSubmit={handleSubmit}
                disabled={isLoading}
                showEmoji={showEmoji}
                onToggleEmoji={() => setShowEmoji(!showEmoji)}
                onEmojiSelect={handleEmojiSelect}
                images={images}
                onImagesChange={setImages}
                showImageUpload={showImageUpload}
                setShowImageUpload={setShowImageUpload}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 bottom-3 p-2.5 rounded-lg bg-emerald-500 text-emerald-950 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all z-10"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <p className="text-emerald-400/40">
                Shift + Enter for new line · Type / for commands
              </p>
              {settings.showCharCount && (
                <p className={`font-mono ${charCount > charLimit * 0.9 ? 'text-amber-400' : 'text-emerald-400/60'}`}>
                  {charCount} / {charLimit}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
