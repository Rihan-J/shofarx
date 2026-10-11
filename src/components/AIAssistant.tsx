'use client';
import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import './AIAssistant.css';

/** Strip common markdown formatting so text displays cleanly */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')   // **bold**
    .replace(/\*(.*?)\*/g, '$1')       // *italic*
    .replace(/#{1,6}\s?/g, '')         // ## headers
    .replace(/`([^`]+)`/g, '$1');      // `code`
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export default function AIAssistant() {
  const pathname = usePathname() || '';
  const context = pathname.includes('/social') ? 'social' : 'web';

  const [isOpen, setIsOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set initial message depending on route
  useEffect(() => {
    setMessages([
      { 
        id: `init-${context}`, 
        role: 'assistant', 
        content: context === 'web' 
          ? "Hi! I'm Shofar-X AI Assistant. You can ask me anything about our website development services and projects!" 
          : "Hi! I'm Shofar-X AI Assistant. You can ask me anything about our social media strategies and case studies!"
      }
    ]);
  }, [context]);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Focus input when window opens
  useEffect(() => {
    if (isOpen && !isLoading) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isLoading]);

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput(''); // Clear input eagerly
    
    // Add user message to UI
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempId, role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context })
      });

      const data = await res.json();
      console.log('[AI Client] Response:', data);

      if (!res.ok) {
        // Backend now strictly formats errors inside data.reply per PRD
        const extractedError = data.reply ? data.reply.replace(/^Error:\s*/, '') : 'Unknown API Error';
        throw new Error(extractedError);
      }
      
      if (data.reply && data.reply.startsWith("Error:")) {
         throw new Error(data.reply.replace(/^Error:\s*/, ''));
      }
      
      // Add AI response to UI
      setMessages(prev => [
        ...prev, 
        { id: Date.now().toString() + 'bot', role: 'assistant', content: data.reply }
      ]);
    } catch (err: any) {
      console.error('[AI Client] Chat Error:', err);
      // Expose the EXACT error message as requested
      const actualErrorMessage = err instanceof Error ? err.message : String(err);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString() + 'err', 
          role: 'error', 
          content: "Error: " + actualErrorMessage 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (location.pathname === '/' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const PHONE_NUMBER = '+919876543210';
  const WHATSAPP_NUMBER = '919876543210';

  return (
    <div className="ai-widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-window"
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="ai-header">
              <div className="ai-header-icon"><Bot size={20} /></div>
              <h3>AI Assistant</h3>
              <button 
                className="ai-close-btn" 
                onClick={() => setIsOpen(false)}
                aria-label="Close Assistant"
              >
                <X size={20} />
              </button>
            </div>

            <div className="ai-messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`ai-msg ai-msg--${msg.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="ai-msg-content">{stripMarkdown(msg.content)}</div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  className="ai-msg ai-msg--assistant"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="ai-typing">
                    <span></span><span></span><span></span>
                  </div>
                </motion.div>
              )}
              {/* Invisible anchor for scrolling */}
              <div ref={messagesEndRef} style={{ height: 1 }} />
            </div>

            <form className="ai-input-area" onSubmit={handleSend}>
              <input
                ref={inputRef}
                type="text"
                className="ai-input"
                placeholder={context === 'web' ? "Ask about website services..." : "Ask about social media marketing..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
              />
              <button 
                type="submit" 
                className="ai-send-btn" 
                disabled={!input.trim() || isLoading}
                aria-label="Send Message"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call popup */}
      <AnimatePresence>
        {isCallOpen && (
          <motion.div
            className="ai-call-popup"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Shofar-X%2C%20I%27m%20interested%20in%20your%20services!`}
              target="_blank"
              rel="noopener noreferrer"
              className="ai-call-option ai-call-option--whatsapp"
              onClick={() => setIsCallOpen(false)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="ai-call-option ai-call-option--phone"
              onClick={() => setIsCallOpen(false)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>Call</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Buttons Container */}
      <div className="ai-fab-group">
        {/* Call FAB */}
        <motion.button
          className="ai-fab ai-fab--call"
          onClick={() => { setIsCallOpen(!isCallOpen); setIsOpen(false); }}
          aria-label={isCallOpen ? "Close call options" : "Open call options"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isCallOpen ? (
              <motion.div
                key="close-call"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="phone"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* AI Agent FAB */}
        <motion.button
          className="ai-fab ai-fab--agent"
          onClick={() => { setIsOpen(!isOpen); setIsCallOpen(false); }}
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="agent"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ai-fab-sparkle"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
