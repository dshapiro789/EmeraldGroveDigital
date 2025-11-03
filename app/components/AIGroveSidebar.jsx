/**
 * AI Grove Sidebar - Elegant Multi-Purpose Sidebar
 * WITH STREAMING SUPPORT
 * 
 * Use Cases:
 * 1. Quick AI Assistant (chat with AI without leaving page)
 * 2. Page Navigation (jump to sections smoothly)
 * 3. Settings/Preferences panel
 * 4. Help & Documentation
 * 5. User Profile/Account info
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles,
  Settings,
  HelpCircle,
  User,
  Menu,
  ArrowRight,
  Leaf,
  Book,
  Zap,
  Shield,
  Code
} from "lucide-react";

// ============================================================================
// SIDEBAR COMPONENT WITH TABS
// ============================================================================
export function AIGroveSidebar() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'nav', 'help', 'settings'

  return (
    <>
      {/* Floating Button - Bottom Right */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full px-5 py-3 bg-emerald-500 text-emerald-950 font-semibold shadow-lg hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Sparkles size={18} />
        <span className="hidden sm:inline">AI Assistant</span>
        <span className="sm:hidden">AI</span>
      </motion.button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Dark overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Sidebar Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gradient-to-b from-emerald-950 via-emerald-900 to-black border-l border-emerald-700/30 z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-emerald-700/30">
                <div className="flex items-center gap-2">
                  <Leaf className="text-emerald-400" size={20} />
                  <h2 className="font-semibold text-emerald-100">Emerald Grove</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-emerald-400/60 hover:text-emerald-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 p-3 border-b border-emerald-700/30">
                <TabButton 
                  active={activeTab === 'chat'} 
                  onClick={() => setActiveTab('chat')}
                  icon={MessageCircle}
                >
                  Chat
                </TabButton>
                <TabButton 
                  active={activeTab === 'nav'} 
                  onClick={() => setActiveTab('nav')}
                  icon={Menu}
                >
                  Navigate
                </TabButton>
                <TabButton 
                  active={activeTab === 'help'} 
                  onClick={() => setActiveTab('help')}
                  icon={HelpCircle}
                >
                  Help
                </TabButton>
                <TabButton 
                  active={activeTab === 'settings'} 
                  onClick={() => setActiveTab('settings')}
                  icon={Settings}
                >
                  Settings
                </TabButton>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'chat' && <ChatTab key="chat" />}
                  {activeTab === 'nav' && <NavigationTab key="nav" onClose={() => setOpen(false)} />}
                  {activeTab === 'help' && <HelpTab key="help" />}
                  {activeTab === 'settings' && <SettingsTab key="settings" />}
                </AnimatePresence>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// TAB BUTTON COMPONENT
// ============================================================================
function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30' 
          : 'text-emerald-300/70 hover:text-emerald-100 hover:bg-emerald-800/30'
      }`}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

// ============================================================================
// CHAT TAB WITH STREAMING SUPPORT
// ============================================================================
function ChatTab() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI assistant. Ask me anything about Emerald Grove or get help navigating the site.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [rateLimit, setRateLimit] = useState({ remaining: 20, resetTime: null });
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStreamingContent('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          model: 'anthropic/claude-3.5-sonnet',
          stream: true  // Enable streaming!
        })
      });

      // Check rate limits
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const reset = response.headers.get('X-RateLimit-Reset');
      if (remaining) {
        setRateLimit({ 
          remaining: parseInt(remaining), 
          resetTime: reset 
        });
      }

      if (!response.ok) {
        if (response.status === 429) {
          const error = await response.json();
          throw new Error(`Rate limit exceeded. Try again in ${error.retryAfter} seconds.`);
        }
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                accumulatedContent += data.content;
                setStreamingContent(accumulatedContent);
              }
            } catch (e) {
              // Skip parsing errors - normal for incomplete chunks
            }
          }
        }
      }

      // Add the complete message to history
      if (accumulatedContent) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: accumulatedContent
        }]);
      }
      setStreamingContent('');

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error.message || 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full"
    >
      {/* Rate limit warning */}
      {rateLimit.remaining < 5 && rateLimit.remaining > 0 && (
        <div className="px-4 py-2 bg-amber-900/30 border-b border-amber-600/30">
          <p className="text-xs text-amber-400">
            ⚠️ {rateLimit.remaining} messages remaining
            {rateLimit.resetTime && (
              <span className="block text-amber-400/60">
                Resets at {new Date(rateLimit.resetTime).toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-emerald-600/20 ml-8 border border-emerald-600/30' 
                : 'bg-emerald-800/30 mr-8 border border-emerald-700/30'
            }`}
          >
            <div className="flex items-start gap-2">
              {msg.role === 'assistant' && (
                <Sparkles size={14} className="text-emerald-400 mt-1 flex-shrink-0" />
              )}
              <p className="text-sm text-emerald-100/90 whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        
        {/* Streaming content with animated cursor */}
        {streamingContent && (
          <div className="bg-emerald-800/30 mr-8 p-3 rounded-lg border border-emerald-700/30">
            <div className="flex items-start gap-2">
              <Sparkles size={14} className="text-emerald-400 mt-1 flex-shrink-0 animate-pulse" />
              <p className="text-sm text-emerald-100/90 whitespace-pre-wrap">
                {streamingContent}
                <span className="inline-block w-2 h-4 ml-0.5 bg-emerald-400 animate-pulse" />
              </p>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading && !streamingContent && (
          <div className="flex items-center gap-2 text-emerald-400/70 text-sm p-3">
            <Sparkles size={14} className="animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-emerald-700/30">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} 
              className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
            className="flex-1 px-3 py-2 bg-emerald-900/30 border border-emerald-600/30 rounded-lg text-sm text-emerald-100 placeholder-emerald-400/50 focus:outline-none focus:border-emerald-400/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-emerald-600 text-emerald-950 rounded-lg disabled:opacity-50 hover:bg-emerald-500 transition-colors flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// ============================================================================
// NAVIGATION TAB
// ============================================================================
function NavigationTab({ onClose }) {
  const sections = [
    { id: 'hero', label: 'Welcome', icon: Leaf },
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'models', label: 'AI Models', icon: Zap },
    { id: 'playground', label: 'Try It Now', icon: Code },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 space-y-2"
    >
      <p className="text-xs text-emerald-400/70 mb-4">Quick navigation to page sections</p>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-800/30 transition-colors text-left group"
        >
          <section.icon size={16} className="text-emerald-500" />
          <span className="text-sm text-emerald-100">{section.label}</span>
          <ArrowRight size={14} className="ml-auto text-emerald-600 group-hover:text-emerald-400 transition-colors" />
        </button>
      ))}
    </motion.div>
  );
}

// ============================================================================
// HELP TAB
// ============================================================================
function HelpTab() {
  const faqs = [
    { 
      q: "What is Emerald Grove?", 
      a: "Emerald Grove is an AI-powered platform where technology meets organic imagination."
    },
    { 
      q: "How do I use the AI Playground?", 
      a: "Simply type your message in the input field and press send. The AI will respond in real-time."
    },
    { 
      q: "What models are available?", 
      a: "We offer Claude 3.5 Sonnet, GPT-4, Gemini Pro, and more cutting-edge AI models."
    },
    { 
      q: "Is my data secure?", 
      a: "Yes! We use enterprise-grade encryption and never store your conversations."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-emerald-700/30 rounded-lg p-3">
            <h4 className="text-sm font-medium text-emerald-300 mb-2 flex items-center gap-2">
              <HelpCircle size={14} className="text-emerald-500" />
              {faq.q}
            </h4>
            <p className="text-xs text-emerald-100/70 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-emerald-800/20 rounded-lg border border-emerald-600/20">
        <p className="text-xs text-emerald-400/70">
          Need more help? Contact us at{' '}
          <a href="mailto:support@emeraldgrove.ai" className="text-emerald-400 hover:text-emerald-300">
            support@emeraldgrove.ai
          </a>
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// SETTINGS TAB
// ============================================================================
function SettingsTab() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    streamResponses: true,
    autoScroll: true
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-500" />
            <span className="text-sm text-emerald-100">Stream Responses</span>
          </div>
          <button
            onClick={() => setSettings(s => ({ ...s, streamResponses: !s.streamResponses }))}
            className={`w-10 h-5 rounded-full transition-colors ${
              settings.streamResponses ? 'bg-emerald-600' : 'bg-emerald-800'
            } relative`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
              settings.streamResponses ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book size={14} className="text-emerald-500" />
            <span className="text-sm text-emerald-100">Auto-scroll Chat</span>
          </div>
          <button
            onClick={() => setSettings(s => ({ ...s, autoScroll: !s.autoScroll }))}
            className={`w-10 h-5 rounded-full transition-colors ${
              settings.autoScroll ? 'bg-emerald-600' : 'bg-emerald-800'
            } relative`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
              settings.autoScroll ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default AIGroveSidebar;
