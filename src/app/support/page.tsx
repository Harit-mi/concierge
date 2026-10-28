'use client';

import React, { useState } from 'react';
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconClock,
  IconSend,
  IconCheckCircle,
} from '@/components/icons/FlaticonIcons';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    referenceNumber: '',
    inquiryType: 'ORDER_STATUS',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 text-titanium-200">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 font-semibold block">
          Client Assistance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Concierge Support Desk
        </h1>
        <p className="text-xs sm:text-sm text-titanium-400 leading-relaxed font-sans">
          Need assistance with an active sourcing inquiry, quote adjustment, or parcel tracking? Our specialists are on hand to support you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="stealth-card p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-carbon-800 border border-white/10 flex items-center justify-center text-bronze-400 shadow-inner">
              <IconMail className="w-4 h-4" />
            </div>
            <h4 className="font-serif font-bold text-sm text-white">Email Desk</h4>
            <p className="text-xs text-titanium-300 font-mono">concierge@veritas-sourcing.com</p>
            <p className="text-[10px] text-titanium-500 font-mono">Response within 2-4 business hours</p>
          </div>

          <div className="stealth-card p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-carbon-800 border border-white/10 flex items-center justify-center text-bronze-400 shadow-inner">
              <IconPhone className="w-4 h-4" />
            </div>
            <h4 className="font-serif font-bold text-sm text-white">Telephone Line</h4>
            <p className="text-xs text-titanium-300 font-mono">+1 (555) 019-8200</p>
            <p className="text-[10px] text-titanium-500 font-mono">Mon - Fri, 9am - 7pm EST</p>
          </div>

          <div className="stealth-card p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-carbon-800 border border-white/10 flex items-center justify-center text-bronze-400 shadow-inner">
              <IconMapPin className="w-4 h-4" />
            </div>
            <h4 className="font-serif font-bold text-sm text-white">Intake Hub</h4>
            <p className="text-xs text-titanium-300">SoHo Luxury District, Manhattan, NY 10012</p>
            <p className="text-[10px] text-titanium-500 font-mono">Physical intake & inspection lab</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 stealth-card p-6 sm:p-10 border border-white/10 shadow-2xl">
          {submitted ? (
            <div className="py-14 text-center space-y-5">
              <div className="w-14 h-14 bg-bronze-500/10 text-bronze-400 rounded-full flex items-center justify-center mx-auto border border-bronze-500/20 shadow-bronze-glow">
                <IconCheckCircle className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">Inquiry Dispatched</h3>
              <p className="text-xs sm:text-sm text-titanium-400 max-w-sm mx-auto leading-relaxed font-sans">
                Thank you for contacting the concierge desk. A senior representative has been assigned to your ticket and will follow up shortly via email.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-mono font-semibold text-bronze-300 underline underline-offset-4 hover:text-bronze-200"
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-serif font-bold text-lg text-white border-b border-white/5 pb-4">
                Send a Message to the Concierge
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="stealth-input w-full text-xs"
                    placeholder="Alexander Hayes"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="stealth-input w-full text-xs"
                    placeholder="alexander@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                    Reference / Order #
                  </label>
                  <input
                    type="text"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                    className="stealth-input w-full text-xs font-mono"
                    placeholder="e.g. REQ-2026-9041"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                    Inquiry Category
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="stealth-input w-full text-xs bg-carbon-900"
                  >
                    <option value="ORDER_STATUS">Order Sourcing Status</option>
                    <option value="QUOTE_QUESTION">Quote Adjustment or Question</option>
                    <option value="DELIVERY_ISSUE">Courier & Delivery Inspection</option>
                    <option value="POLICY_INQUIRY">Category Eligibility Question</option>
                    <option value="COMPLAINT">Formal Service Feedback</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Explain your inquiry in detail..."
                  className="stealth-input w-full text-xs p-3.5"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 py-3.5 rounded text-xs uppercase tracking-widest font-semibold hover:brightness-110 transition-all shadow-bronze-glow flex items-center justify-center gap-2"
              >
                <span>Dispatch Ticket</span>
                <IconSend className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
