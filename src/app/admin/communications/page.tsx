'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  IconChat,
  IconSend,
  IconUser,
  IconLock,
  IconClock,
} from '@/components/icons/FlaticonIcons';

function CommunicationsContent() {
  const searchParams = useSearchParams();
  const requestIdParam = searchParams.get('requestId');

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        if (data.conversations?.length > 0) {
          const match = requestIdParam
            ? data.conversations.find((c: any) => c.request_id === requestIdParam)
            : data.conversations[0];
          setSelectedConv(match || data.conversations[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [requestIdParam]);

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv.id);
    }
  }, [selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConv) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConv.id,
          messageText: replyText.trim(),
          isInternalNote: isInternal,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setReplyText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 text-titanium-200">
      <div className="border-b border-white/5 pb-5">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Communications & Client Messaging Desk
        </h1>
        <p className="text-xs text-titanium-400 mt-1 font-sans">
          Provide direct personal shopping updates and record internal operator notes.
        </p>
      </div>

      <div className="stealth-card rounded-2xl border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-3 h-[650px] overflow-hidden">
        {/* Left Conversations List */}
        <div className="border-r border-white/5 flex flex-col h-full bg-carbon-900/60 font-mono">
          <div className="p-4 border-b border-white/5 text-[11px] uppercase tracking-wider text-titanium-400 font-semibold">
            Inquiry Threads ({conversations.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedConv(c)}
                className={`w-full text-left p-4 hover:bg-carbon-800/40 transition-colors ${
                  selectedConv?.id === c.id ? 'bg-carbon-800/80 font-medium border-l-2 border-bronze-400' : ''
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-titanium-500 mb-1">
                  <span>{c.reference_number}</span>
                  <span>{new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="font-serif font-bold text-sm text-white truncate">
                  {c.product_name}
                </div>
                <div className="text-[11px] text-titanium-400 mt-0.5 font-sans">
                  Client: {c.customerName}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Chat Pane */}
        <div className="md:col-span-2 flex flex-col h-full bg-carbon-950">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-carbon-900/90 font-mono">
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">
                    {selectedConv.product_name} ({selectedConv.reference_number})
                  </h4>
                  <span className="text-[11px] text-titanium-400 font-sans">
                    Client: {selectedConv.customerName}
                  </span>
                </div>
                <Link
                  href={`/admin/requests/${selectedConv.request_id}`}
                  className="text-xs font-semibold text-bronze-300 underline underline-offset-4 hover:text-bronze-200"
                >
                  View Request Dossier &rarr;
                </Link>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m) => {
                  const isStaff = m.senderRole !== 'CUSTOMER';
                  const isInternalNote = m.is_internal_note === 1;

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-titanium-500 mb-1 px-1">
                        <span className="font-semibold text-titanium-300">{m.senderName} ({m.senderRole})</span>
                        {isInternalNote && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                            INTERNAL NOTE
                          </span>
                        )}
                        <span>• {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed font-sans shadow-md ${
                          isInternalNote
                            ? 'bg-amber-500/10 text-amber-200 border border-amber-500/30'
                            : isStaff
                            ? 'bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 font-medium rounded-tr-xs'
                            : 'bg-carbon-800 text-titanium-100 rounded-tl-xs border border-white/5'
                        }`}
                      >
                        {m.message_text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-white/5 bg-carbon-900 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-titanium-300 font-mono text-[11px]">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-white/20 bg-carbon-800 text-bronze-500 focus:ring-bronze-500/20 h-3.5 w-3.5"
                    />
                    <span>Post as Confidential Internal Staff Note (Invisible to Client)</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={isInternal ? 'Type internal operator remark...' : 'Type message to send to client...'}
                    className="stealth-input flex-1 text-xs"
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold hover:brightness-110 shadow-bronze-glow disabled:opacity-50 flex items-center gap-1.5 shrink-0 transition-all"
                  >
                    <span>Reply</span>
                    <IconSend className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-xs font-mono text-titanium-500">
              Select an inquiry thread from the left to view messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCommunicationsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-titanium-500">Loading communications...</div>}>
      <CommunicationsContent />
    </Suspense>
  );
}
