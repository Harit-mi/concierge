'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  IconSend,
  IconUserCheck,
  IconChat,
  IconClock,
  IconShield,
} from '@/components/icons/FlaticonIcons';

function CustomerMessagesContent() {
  const searchParams = useSearchParams();
  const requestIdParam = searchParams.get('requestId');

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const url = requestIdParam ? `/api/messages?requestId=${requestIdParam}` : '/api/messages';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setConversation(data.conversation);
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [requestIdParam]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation?.id,
          requestId: requestIdParam,
          messageText: newMessage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-titanium-200">
      <div className="border-b border-white/5 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Concierge Communications
        </h1>
        <p className="text-xs text-titanium-400 mt-1 font-sans">
          Direct private communications with your assigned sourcing specialists.
        </p>
      </div>

      <div className="stealth-card rounded-2xl border border-white/10 shadow-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-carbon-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-carbon-800 border border-white/10 text-bronze-300 flex items-center justify-center font-serif text-xs font-bold shadow-inner">
              V
            </div>
            <div>
              <strong className="text-xs font-semibold text-white block">
                Veritas Concierge Desk
              </strong>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Active Specialist Available
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-titanium-500 uppercase tracking-widest">
            Private Channel
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-titanium-500">
              Loading communication thread...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <IconChat className="w-8 h-8 text-bronze-400 mx-auto" />
              <p className="text-xs text-titanium-400 font-sans">
                No messages yet. Send a note to your personal concierge specialist below.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderRole === 'CUSTOMER';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-titanium-500 mb-1 px-1">
                    <span className="font-semibold text-titanium-300">{m.senderName}</span>
                    <span>• {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed font-sans shadow-md ${
                      isMe
                        ? 'bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 font-medium rounded-tr-xs'
                        : 'bg-carbon-800 text-titanium-100 rounded-tl-xs border border-white/5'
                    }`}
                  >
                    {m.message_text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-carbon-900 flex gap-2">
          <input
            type="text"
            required
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message to the concierge team..."
            className="stealth-input flex-1 text-xs"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold hover:brightness-110 shadow-bronze-glow disabled:opacity-50 flex items-center gap-1.5 shrink-0 transition-all"
          >
            <span>Send</span>
            <IconSend className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CustomerMessagesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-titanium-500">Loading messages...</div>}>
      <CustomerMessagesContent />
    </Suspense>
  );
}
