'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  IconSend,
  IconChat,
  IconClock,
  IconShield,
  IconUser,
  IconArrowLeft,
  IconArrowRight,
  IconSearch,
} from '@/components/icons/FlaticonIcons';
import { DashboardNav } from '@/components/DashboardNav';

function MessagesContent() {
  const searchParams = useSearchParams();
  const requestIdParam = searchParams.get('requestId') || 'req-travis-01';

  const [activeThreadId, setActiveThreadId] = useState(requestIdParam);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const threads = [
    {
      id: 'req-travis-01',
      ref: 'REQ-2026-9041',
      title: 'Air Jordan 1 Retro Low OG SP "Canary"',
      officer: 'Julian Thorne (Senior Sourcing)',
      lastMsg: 'Quote prepared with verified retailer provenance.',
      time: '15:30',
      unread: true,
    },
    {
      id: 'req-issey-02',
      ref: 'REQ-2026-8812',
      title: 'Homme Plissé Basic Pleated Blazer',
      officer: 'Julian Thorne (Senior Sourcing)',
      lastMsg: 'Item acquired in Milan, en route to Manhattan intake.',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: 'req-bottega-03',
      ref: 'REQ-2026-7734',
      title: 'Intrecciato Calfskin Card Case',
      officer: 'Julian Thorne (Senior Sourcing)',
      lastMsg: 'Delivered via FedEx Priority with adult signature.',
      time: 'Oct 18',
      unread: false,
    },
    {
      id: 'general-support',
      ref: 'GEN-DESK',
      title: 'General Concierge Sourcing Desk',
      officer: 'Veritas Client Services',
      lastMsg: 'How may we assist your upcoming procurement?',
      time: 'Oct 15',
      unread: false,
    },
  ];

  const [threadMessages, setThreadMessages] = useState<Record<string, any[]>>({
    'req-travis-01': [
      {
        id: '1',
        senderName: 'Julian Thorne (Concierge)',
        isStaff: true,
        text: 'Hello Alexander, we have verified availability of the Jordan 1 Retro Low Canary in US 10.5 from an authorized boutique partner in Tokyo. The quote has been issued to your dashboard with 48 hours validity.',
        time: 'Oct 25 &bull; 14:45 EST',
      },
      {
        id: '2',
        senderName: 'Alexander Hayes (You)',
        isStaff: false,
        text: 'Thank you Julian. Does this include the original undamaged box and both sets of extra laces?',
        time: 'Oct 25 &bull; 15:10 EST',
      },
      {
        id: '3',
        senderName: 'Julian Thorne (Concierge)',
        isStaff: true,
        text: 'Yes, absolutely. All accessories, intact shoe box lid, extra red and black laces, and factory tissue are certified in the acquisition covenant.',
        time: 'Oct 25 &bull; 15:30 EST',
      },
    ],
    'req-issey-02': [
      {
        id: '1',
        senderName: 'Julian Thorne (Concierge)',
        isStaff: true,
        text: 'The Issey Miyake Pleated Blazer in Size 3 has been picked up from our Milan partner. Transit to JFK is logged.',
        time: 'Oct 26 &bull; 10:00 EST',
      },
    ],
    'req-bottega-03': [
      {
        id: '1',
        senderName: 'Julian Thorne (Concierge)',
        isStaff: true,
        text: 'Bottega Veneta Card Case delivered and signed. Provenance certificate archived in your vault.',
        time: 'Oct 18 &bull; 12:15 EST',
      },
    ],
    'general-support': [
      {
        id: '1',
        senderName: 'Veritas Intake Desk',
        isStaff: true,
        text: 'Welcome to the Veritas Private Client Desk. You can initiate inquiries, request sizing cross-checks, or ask questions here.',
        time: 'Oct 15 &bull; 09:00 EST',
      },
    ],
  });

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const currentMessages = threadMessages[activeThread.id] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    const newMsgObj = {
      id: String(Date.now()),
      senderName: 'Alexander Hayes (You)',
      isStaff: false,
      text: newMessage.trim(),
      time: 'Just now',
    };

    setThreadMessages((prev) => ({
      ...prev,
      [activeThread.id]: [...(prev[activeThread.id] || []), newMsgObj],
    }));

    setNewMessage('');
    setSending(false);

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <DashboardNav />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-8">
        <div className="border-b border-[#E5E3DC] pb-4">
          <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
            Private Channel &bull; Client Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#121212] mt-1">
            Concierge Communications
          </h1>
          <p className="text-xs text-[#5A5852] font-sans mt-0.5">
            Real-time secure channel with your assigned personal shopper and intake directors.
          </p>
        </div>

        {/* Split-pane Chat Interface */}
        <div className="bg-white border border-[#E5E3DC] rounded-[1px] shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
          {/* Left Pane: Conversations List */}
          <div className="md:col-span-4 border-r border-[#E5E3DC] flex flex-col bg-[#F3F2EC]">
            <div className="p-5 border-b border-[#E5E3DC] bg-white">
              <span className="text-xs font-mono font-medium text-[#121212] uppercase tracking-wider block mb-1">
                Active Sourcing Channels
              </span>
              <div className="text-[11px] text-[#5A5852] font-sans">
                Select a channel to review specialist notes
              </div>
            </div>

            <div className="divide-y divide-[#E5E3DC] overflow-y-auto flex-1">
              {threads.map((t) => {
                const isSelected = activeThreadId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`w-full text-left p-5 transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-white border-l-4 border-l-[#121212] shadow-xs'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-semibold text-[#121212]">{t.ref}</span>
                      <span className="text-[#8A8880]">{t.time}</span>
                    </div>
                    <div className="font-serif font-normal text-sm text-[#121212] line-clamp-1">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-[#5A5852] font-sans line-clamp-1">
                      {t.lastMsg}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Pane: Active Thread */}
          <div className="md:col-span-8 flex flex-col bg-white">
            {/* Header */}
            <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between bg-white">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#5A5852] uppercase font-medium">
                  Channel &bull; {activeThread.ref}
                </span>
                <h3 className="font-serif font-normal text-lg text-[#121212]">
                  {activeThread.title}
                </h3>
                <span className="text-[11px] font-mono text-[#5A5852] block">
                  Assigned Specialist: {activeThread.officer}
                </span>
              </div>

              {activeThread.id.startsWith('req-') && (
                <Link
                  href={`/requests/${activeThread.id}`}
                  className="btn-outline px-4 py-2 text-[10.5px]"
                >
                  View Request &rarr;
                </Link>
              )}
            </div>

            {/* Message Bubble Flow */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#FAF9F5]">
              {currentMessages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-xl p-5 text-xs font-sans rounded-[1px] ${
                    m.isStaff
                      ? 'mr-auto bg-white border border-[#E5E3DC] text-[#121212] shadow-xs'
                      : 'ml-auto bg-[#121212] text-[#FAF9F5]'
                  }`}
                >
                  <div className={`flex items-center justify-between gap-4 font-mono text-[10px] mb-2 pb-1.5 border-b ${m.isStaff ? 'border-[#E5E3DC] opacity-80' : 'border-[#333333] opacity-80'}`}>
                    <span className="font-medium flex items-center gap-1.5">
                      {m.isStaff && <IconShield className="w-3.5 h-3.5 text-emerald-700" />}
                      {m.senderName}
                    </span>
                    <span>{m.time}</span>
                  </div>
                  <p className="leading-relaxed text-[12px]">{m.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with exact placeholder required by test */}
            <form onSubmit={handleSend} className="p-4 border-t border-[#E5E3DC] bg-white flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Send note to ${activeThread.officer}...`}
                className="editorial-input flex-1 p-3 text-xs font-sans"
              />
              <button
                type="submit"
                disabled={sending}
                className="btn-noir px-6 py-3 text-xs flex items-center gap-2 shrink-0 group"
              >
                <span>Send</span>
                <IconSend className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center font-mono text-xs text-[#846337]">Loading Concierge Messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}