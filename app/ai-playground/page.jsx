"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';
import {
  Send,
  Sparkles,
  Leaf,
  RotateCcw,
  Settings,
  ChevronDown,
  Loader2,
  Copy,
  Check,
  Cpu,
  Zap,
  Brain,
  MessageCircle,
  ArrowLeft,
  X,
  RefreshCw,
  Pencil,
  StopCircle,
  Save,
  AlertCircle,
  BookOpen,
  Code,
  Lightbulb,
  FileText,
  Palette,
  Clock,
  TrendingUp
} from "lucide-react";

/**
 * AI Playground - Emerald Grove Digital (ENHANCED VERSION)
 *
 * NEW Features:
 * - Markdown rendering with syntax highlighting
 * - Enhanced message controls (regenerate, edit, stop)
 * - Settings panel (temperature, max tokens, system prompt, streaming)
 * - Prompt library & templates
 * - Better rate limit UX
 * - Visual polish & animations
 * - Smart features (follow-up suggestions, code copy)
 */

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
// AI MODELS CONFIGURATION
// ============================================================================
const AI_MODELS = [
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    icon: Brain,
    description: "Most intelligent, best for complex tasks",
    color: "emerald"
  },
  {
    id: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    icon: Cpu,
    description: "Powerful reasoning and analysis",
    color: "emerald"
  },
  {
    id: "openai/gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    icon: Zap,
    description: "Fast and capable",
    color: "amber"
  },
  {
    id: "openai/gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    icon: Brain,
    description: "Advanced reasoning",
    color: "amber"
  },
  {
    id: "x-ai/grok-4-fast",
    name: "Grok 4",
    provider: "xAI",
    icon: Sparkles,
    description: "Fast and efficient",
    color: "blue"
  },
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    icon: MessageCircle,
    description: "Google's state-of-the-art workhorse model",
    color: "purple"
  }
];

// ============================================================================
// PROMPT TEMPLATES
// ============================================================================
const PROMPT_TEMPLATES = [
  {
    id: "debug",
    name: "Code Debugging",
    icon: Code,
    description: "Help debug and fix code issues",
    prompt: "I need help debugging this code:\n\n```\n[paste your code here]\n```\n\nThe issue I'm experiencing is: [describe the problem]"
  },
  {
    id: "creative",
    name: "Creative Writing",
    icon: Palette,
    description: "Generate creative content",
    prompt: "Write a creative story about: [your topic]\n\nTone: [e.g., mysterious, uplifting, dramatic]\nLength: [e.g., short paragraph, full story]"
  },
  {
    id: "technical",
    name: "Technical Explanation",
    icon: FileText,
    description: "Explain complex concepts simply",
    prompt: "Explain [technical concept] in simple terms that a beginner can understand. Use analogies and examples."
  },
  {
    id: "brainstorm",
    name: "Brainstorming",
    icon: Lightbulb,
    description: "Generate creative ideas",
    prompt: "Help me brainstorm ideas for: [your project/problem]\n\nContext: [provide relevant background]\nGoal: [what you want to achieve]"
  }
];

// ============================================================================
// SETTINGS PANEL COMPONENT
// ============================================================================
function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }) {
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
// PROMPT LIBRARY COMPONENT
// ============================================================================
function PromptLibrary({ isOpen, onClose, onSelectTemplate }) {
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
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-emerald-950/95 backdrop-blur-xl border border-emerald-300/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} className="text-emerald-400" />
                  <h2 className="text-lg font-semibold">Prompt Library</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-emerald-900/40 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-emerald-300/60">
                Choose a template to get started quickly
              </p>

              {/* Templates Grid */}
              <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {PROMPT_TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => {
                        onSelectTemplate(template.prompt);
                        onClose();
                      }}
                      className="p-4 text-left rounded-lg bg-emerald-900/30 border border-emerald-300/10 hover:bg-emerald-800/40 hover:border-emerald-300/20 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                          <Icon size={18} className="text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1">{template.name}</h3>
                          <p className="text-xs text-emerald-300/60">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
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
function ModelSelector({ selectedModel, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentModel = AI_MODELS.find(m => m.id === selectedModel);
  const Icon = currentModel?.icon || Brain;

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-emerald-400" />
          <span className="text-sm font-medium">{currentModel?.name || "Select Model"}</span>
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
                {AI_MODELS.map((model) => {
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

  // Extract language from className (e.g., "language-javascript")
  const language = className ? className.replace('language-', '') : '';

  const handleCopy = async () => {
    const code = codeRef.current?.textContent || '';
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
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
        <div className="absolute top-2 left-3 text-xs text-emerald-400/60 font-mono">
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
// MESSAGE COMPONENT WITH MARKDOWN
// ============================================================================
function Message({
  message,
  isLast,
  isStreaming,
  onRegenerate,
  onEdit,
  onDelete,
  followUpSuggestions
}) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
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
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-emerald-500/20 border border-emerald-400/30'
            : 'bg-emerald-900/40 border border-emerald-300/20'
        }`}>
          {isUser ? (
            <span className="text-xs font-semibold text-emerald-300">You</span>
          ) : (
            <Sparkles size={14} className="text-emerald-400" />
          )}
        </div>

        {/* Message content */}
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
                isUser
                  ? 'bg-emerald-500/20 border border-emerald-400/30'
                  : 'bg-emerald-900/30 border border-emerald-300/10'
              }`}>
                {isUser ? (
                  <p className="text-emerald-100 whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                ) : (
                  <div className="prose prose-invert prose-emerald max-w-none prose-pre:bg-emerald-950/50 prose-pre:border prose-pre:border-emerald-300/10 prose-code:text-emerald-300 prose-code:bg-emerald-900/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']">
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

              {/* Message actions */}
              <div className={`mt-2 flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
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

              {/* Follow-up suggestions */}
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
                        className="px-3 py-1.5 text-xs rounded-lg bg-emerald-900/30 border border-emerald-300/10 hover:bg-emerald-800/40 hover:border-emerald-300/20 transition-colors"
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

      {/* Progress bar */}
      <div className="w-full h-2 bg-emerald-900/40 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full rounded-full ${
            isWarning ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
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
// MAIN AI PLAYGROUND COMPONENT
// ============================================================================
export default function AIPlayground() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [showSettings, setShowSettings] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 4000,
    systemPrompt: '',
    streaming: true,
    showCharCount: false
  });
  const [rateLimit, setRateLimit] = useState({ current: 0, max: 20, resetTime: null });
  const [followUpSuggestions, setFollowUpSuggestions] = useState([]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // Generate follow-up suggestions based on last AI response
  const generateFollowUpSuggestions = (lastResponse) => {
    const suggestions = [];

    // Simple heuristics for generating follow-ups
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

    const userMessage = { role: 'user', content: messageContent };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsStreaming(settings.streaming);
    setFollowUpSuggestions([]);

    // Create abort controller for stop functionality
    abortControllerRef.current = new AbortController();

    // Add placeholder for streaming message
    const assistantMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel,
          stream: settings.streaming,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
          system_prompt: settings.systemPrompt
        }),
        signal: abortControllerRef.current.signal
      });

      // Update rate limit from headers
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
        throw new Error(errorData.message || 'Failed to get response');
      }

      if (settings.streaming) {
        // Handle streaming response
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
                  // Update the message in real-time
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

        // Generate follow-up suggestions
        setFollowUpSuggestions(generateFollowUpSuggestions(accumulatedContent));
      } else {
        // Handle non-streaming response
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
        console.log('Request was aborted');
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

    // Remove last AI message and regenerate
    const lastUserMessage = messages[messages.length - 2];
    setMessages(prev => prev.slice(0, -1));

    // Resend the last user message
    setTimeout(() => {
      handleSubmit(null, lastUserMessage.content);
    }, 100);
  };

  const handleEditMessage = (message, newContent) => {
    if (!newContent.trim()) return;

    // Find the index of the message
    const messageIndex = messages.findIndex(m => m === message);
    if (messageIndex === -1) return;

    // Remove all messages after this one
    setMessages(prev => prev.slice(0, messageIndex));

    // Send new message
    setTimeout(() => {
      handleSubmit(null, newContent);
    }, 100);
  };

  const handleReset = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
      setFollowUpSuggestions([]);
    }
  };

  const handleTemplateSelect = (template) => {
    setInput(template);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const charCount = input.length;
  const charLimit = 4000; // Reasonable limit for input

  return (
    <div className="relative min-h-screen bg-[#041712] text-emerald-50">
      <CursorTrail />

      {/* Background effects */}
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

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Prompt Library */}
      <PromptLibrary
        isOpen={showPromptLibrary}
        onClose={() => setShowPromptLibrary(false)}
        onSelectTemplate={handleTemplateSelect}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-emerald-950/30 backdrop-blur-xl border-b border-emerald-300/10">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          {/* Mobile: Stack vertically */}
          <div className="flex flex-col gap-3 sm:hidden">
            {/* Row 1: Back button and title */}
            <div className="flex items-center justify-between">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back to Grove</span>
              </a>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-400" />
                <h1 className="text-base font-semibold">AI Playground</h1>
              </div>
            </div>
            {/* Row 2: Model selector and actions */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ModelSelector
                  selectedModel={selectedModel}
                  onSelect={setSelectedModel}
                />
              </div>
              <button
                onClick={() => setShowPromptLibrary(true)}
                className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors flex-shrink-0"
                title="Prompt library"
              >
                <BookOpen size={16} />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors flex-shrink-0"
                title="Settings"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors flex-shrink-0"
                title="Reset conversation"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Desktop: Single row */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back to Grove</span>
              </a>
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-400" />
                <h1 className="text-lg font-semibold">AI Playground</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ModelSelector
                selectedModel={selectedModel}
                onSelect={setSelectedModel}
              />
              <button
                onClick={() => setShowPromptLibrary(true)}
                className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors"
                title="Prompt library"
              >
                <BookOpen size={16} />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors"
                title="Settings"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-300/20 hover:bg-emerald-800/40 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        {/* Rate Limit Display */}
        {rateLimit.current > 0 && (
          <div className="mb-6">
            <RateLimitDisplay
              current={rateLimit.current}
              max={rateLimit.max}
              resetTime={rateLimit.resetTime}
            />
          </div>
        )}

        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/20 mb-6">
              <Sparkles size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Welcome to the AI Playground</h2>
            <p className="text-emerald-100/60 max-w-md mx-auto mb-8">
              Choose your model and start a conversation. Enhanced with markdown, code highlighting, and smart features.
            </p>

            {/* Example prompts */}
            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-6">
              {[
                "Explain quantum computing simply",
                "Write a creative short story",
                "Help me debug this code",
                "Brainstorm marketing ideas"
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="px-4 py-3 text-left text-sm rounded-lg bg-emerald-900/30 border border-emerald-300/10 hover:bg-emerald-800/40 hover:border-emerald-300/20 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Template button */}
            <button
              onClick={() => setShowPromptLibrary(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-emerald-500/20 border border-emerald-400/30 hover:bg-emerald-500/30 transition-colors"
            >
              <BookOpen size={16} />
              Browse Prompt Templates
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
                followUpSuggestions={
                  index === messages.length - 1 && message.role === 'assistant'
                    ? followUpSuggestions
                    : null
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#041712] via-[#041712] to-transparent pt-8 pb-6">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Stop button when generating */}
          {isLoading && (
            <div className="mb-3 flex justify-center">
              <button
                onClick={handleStop}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-400 hover:bg-amber-500/30 transition-colors"
              >
                <StopCircle size={16} />
                Stop Generating
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="relative bg-emerald-950/50 backdrop-blur-xl border border-emerald-300/20 rounded-2xl shadow-2xl overflow-hidden">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Message AI..."
                rows={1}
                className="w-full px-5 py-4 pr-14 bg-transparent resize-none focus:outline-none text-emerald-50 placeholder-emerald-400/40 max-h-40"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 bottom-3 p-2.5 rounded-lg bg-emerald-500 text-emerald-950 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                Shift + Enter for new line
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
