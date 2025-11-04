"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowLeft
} from "lucide-react";

/**
 * AI Playground - Emerald Grove Digital (STREAMING VERSION)
 * 
 * Features:
 * - Real-time streaming responses (word-by-word)
 * - OpenRouter integration with multiple models
 * - Beautiful Emerald Grove theme
 * - Mobile responsive
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
// MESSAGE COMPONENT
// ============================================================================
function Message({ message, isLast, isStreaming }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
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
          <div className={`inline-block px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-emerald-500/20 border border-emerald-400/30' 
              : 'bg-emerald-900/30 border border-emerald-300/10'
          }`}>
            <p className="text-emerald-100 whitespace-pre-wrap leading-relaxed">
              {message.content}
              {isStreaming && isLast && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-1 h-4 bg-emerald-400 ml-1 align-middle"
                />
              )}
            </p>
          </div>
          
          {/* Copy button for AI messages */}
          {!isUser && !isStreaming && (
            <button
              onClick={handleCopy}
              className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
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
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN AI PLAYGROUND COMPONENT (WITH STREAMING)
// ============================================================================
export default function AIPlayground() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);

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
          stream: true // Enable streaming
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

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

      setIsStreaming(false);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[assistantMessageIndex] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        };
        return newMessages;
      });
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
    }
  };

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
            {/* Row 2: Model selector and reset */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ModelSelector 
                  selectedModel={selectedModel}
                  onSelect={setSelectedModel}
                />
              </div>
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
              Choose your model and start a conversation. Watch as responses stream in real-time.
            </p>
            
            {/* Example prompts */}
            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
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
          </motion.div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <Message 
                key={index} 
                message={message} 
                isLast={index === messages.length - 1}
                isStreaming={isStreaming && index === messages.length - 1 && message.role === 'assistant'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#041712] via-[#041712] to-transparent pt-8 pb-6">
        <div className="container mx-auto max-w-4xl px-4">
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
            <p className="mt-3 text-xs text-center text-emerald-400/40">
              Shift + Enter for new line. Real-time streaming powered by OpenRouter
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
