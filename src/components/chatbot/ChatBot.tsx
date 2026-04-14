'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_CONTEXT = `You are SkillSwap Assistant, a helpful AI chatbot for the SkillSwap platform — a peer-to-peer skill exchange platform for developers and learners. 

You help users:
- Understand how SkillSwap works (skill-for-skill exchange, no subscriptions)
- Find the right skills and mentors
- Book and manage 1-on-1 sessions
- Navigate the platform features

Keep answers concise, friendly, and helpful. If unsure, guide users to explore the platform or contact support.`;

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "👋 Hi! I'm the SkillSwap Assistant. Ask me anything about finding mentors, booking sessions, or how skill exchange works!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API key not configured.');

      // Build conversation history for Gemini
      const history = messages
        .filter((m) => m.id !== '0') // skip the initial greeting
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
            contents: [
              ...history,
              { role: 'user', parts: [{ text: trimmed }] },
            ],
            generationConfig: {
              maxOutputTokens: 300,
              temperature: 0.7,
            },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || 'API error');
      }

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response. Please try again.";

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ ${errorMessage}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-5 z-50 w-[360px] max-w-[calc(100vw-2.5rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: '#13131F',
            border: '1px solid #2A2A3D',
            height: '480px',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: '#1A1A2E', borderBottom: '1px solid #2A2A3D' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
              >
                <Bot size={16} style={{ color: '#a78bfa' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#E8E8EE', fontFamily: 'var(--font-syne)' }}>
                  SkillSwap AI
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-xs" style={{ color: '#6B7280' }}>Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: '#6B7280' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#303045 transparent' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5"
                    style={{ background: 'rgba(139,92,246,0.15)' }}
                  >
                    <Sparkles size={12} style={{ color: '#a78bfa' }} />
                  </div>
                )}
                <div
                  className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? {
                          background: '#7C3AED',
                          color: '#fff',
                          borderBottomRightRadius: '6px',
                          fontFamily: 'var(--font-dm-sans)',
                        }
                      : {
                          background: '#1E1E2D',
                          color: '#D1D5DB',
                          borderBottomLeftRadius: '6px',
                          border: '1px solid #2A2A3D',
                          fontFamily: 'var(--font-dm-sans)',
                        }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5"
                  style={{ background: 'rgba(139,92,246,0.15)' }}
                >
                  <Sparkles size={12} style={{ color: '#a78bfa' }} />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl"
                  style={{ background: '#1E1E2D', border: '1px solid #2A2A3D', borderBottomLeftRadius: '6px' }}
                >
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3" style={{ borderTop: '1px solid #2A2A3D', background: '#13131F' }}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: '#1E1E2D', border: '1px solid #2A2A3D' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-600 disabled:opacity-50"
                style={{ color: '#E8E8EE', fontFamily: 'var(--font-dm-sans)' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                style={{ background: '#7C3AED' }}
              >
                {isLoading ? (
                  <Loader2 size={13} className="animate-spin text-white" />
                ) : (
                  <Send size={13} className="text-white" />
                )}
              </button>
            </div>
            {/* <p className="text-center mt-2 text-xs" style={{ color: '#3D3D52' }}>
              Powered by Gemini AI
            </p> */}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 group flex items-center gap-0 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
        style={{
          background: isOpen ? '#5B21B6' : '#7C3AED',
          borderRadius: '50px',
          height: '52px',
          padding: '0 18px',
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label="Toggle chat"
      >
        <div className="flex items-center gap-2.5 text-white">
          {isOpen ? (
            <X size={20} />
          ) : (
            <>
              <MessageCircle size={20} />
              <span
                className="text-sm font-semibold whitespace-nowrap"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                Ask AI
              </span>
            </>
          )}
        </div>

        {/* Ping dot for new users */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
          </span>
        )}
      </button>
    </>
  );
}
