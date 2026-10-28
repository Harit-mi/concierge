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
    <div className="min-h-screen bg-[#FAF7F2]">
      <DashboardNav />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-8">
        <div className="border-b border-[#E3D8CB] pb-4">
          <span className="ledger-stamp">DIRECT CONCIERGE CHANNEL</span>
          <h1 className="font-display text-3xl sm:text-4xl font-light text-[#111215] mt-1">
            Private Client Communications Parlor
          </h1>
          <p className="text-xs text-[#575A6B] font-mono mt-0.5">
            Encrypted real-time channel with your assigned procurement specialists and operations directors.
          </p>
        </div>

        {/* Split-pane Chat Interface */}
        <div className="luxury-card rounded-[2px] bg-white border border-[#E3D8CB] shadow-luxury overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
          {/* Left Pane: Conversations List */}
          <div className="md:col-span-4 border-r border-[#E3D8CB] flex flex-col bg-[#FAF7F2]">
            <div className="p-5 border-b border-[#E3D8CB] bg-white">
              <span className="text-xs font-mono font-bold text-[#111215] uppercase tracking-widest block mb-1">
                Active Inquiry Channels
              </span>
              <div className="text-[10.5px] text-[#575A6B] font-mono">
                Select a channel to review custody notes
              </div>
            </div>

            <div className="divide-y divide-[#E3D8CB] overflow-y-auto flex-1">
              {threads.map((t) => {
                const isSelected = activeThreadId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`w-full text-left p-5 transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-white border-l-4 border-l-[#9E7A4A] shadow-xs'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-[#846337]">{t.ref}</span>
                      <span className="text-[#8E91A1]">{t.time}</span>
                    </div>
                    <div className="font-display font-bold text-sm text-[#111215] line-clamp-1">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-[#575A6B] font-sans line-clamp-1">
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
            <div className="p-5 border-b border-[#E3D8CB] flex items-center justify-between bg-white">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#846337] uppercase font-semibold">
                  Channel &bull; {activeThread.ref}
                </span>
                <h3 className="font-display font-bold text-lg text-[#111215]">
                  {activeThread.title}
                </h3>
                <span className="text-[11px] font-mono text-[#575A6B] block">
                  Officer in Charge: {activeThread.officer}
                </span>
              </div>

              {activeThread.id.startsWith('req-') && (
                <Link
                  href={`/requests/${activeThread.id}`}
                  className="btn-luxury-outline px-4 py-2 text-[10px]"
                >
                  View Dossier &rarr;
                </Link>
              )}
            </div>

            {/* Message Bubble Flow */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#FAF7F2]/40">
              {currentMessages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-xl p-5 text-xs font-sans ${
                    m.isStaff
                      ? 'mr-auto bg-white border border-[#E3D8CB] text-[#111215] shadow-xs'
                      : 'ml-auto bg-[#F4EFEA] border border-[#C4A575] text-[#111215]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 font-mono text-[10px] mb-2 opacity-80 border-b border-[#E3D8CB] pb-1.5">
                    <span className="font-bold flex items-center gap-1.5">
                      {m.isStaff && <IconShield className="w-3.5 h-3.5 text-[#846337]" />}
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
            <form onSubmit={handleSend} className="p-4 border-t border-[#E3D8CB] bg-white flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Send note to ${activeThread.officer}...`}
                className="luxury-input flex-1 p-3 text-xs font-mono"
              />
              <button
                type="submit"
                disabled={sending}
                className="btn-obsidian px-6 py-3 text-xs flex items-center gap-2 shrink-0 shadow-luxury group"
              >
                <span>Send</span>
                <IconSend className="w-3.5 h-3.5 text-[#C4A575] group-hover:translate-x-1 transition-transform" />
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