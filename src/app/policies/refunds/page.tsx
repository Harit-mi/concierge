import React from 'react';
import { IconAlert } from '@/components/icons/FlaticonIcons';

export default function RefundsPolicyPage() {
  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-titanium-200">
      <div className="bg-carbon-900 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300 flex items-center gap-2.5 font-mono shadow-stealth">
        <IconAlert className="w-4 h-4 shrink-0 text-amber-400" />
        <span>DRAFT LEGAL POLICY — Configured operator cancellation and dispute rules.</span>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 font-semibold block">
          Policy Document v1.0
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs text-titanium-500 font-mono">Effective Date: October 26, 2026</p>
      </div>

      <div className="stealth-card p-6 sm:p-10 border border-white/10 text-titanium-300 text-xs sm:text-sm leading-relaxed space-y-8 shadow-2xl">
        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            1. Pre-Acquisition Cancellations
          </h2>
          <p>
            You may cancel your sourcing request freely at any stage prior to quote acceptance and payment authorization without incurring any fees. Once an order reaches <code className="text-bronze-300 font-mono text-xs bg-carbon-900 px-2 py-0.5 rounded border border-white/10">AWAITING_PAYMENT</code>, payment must be completed within 7 calendar days or the request automatically expires.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            2. Post-Payment Cancellations & Supplier Terms
          </h2>
          <p>
            Once an order is in <code className="text-bronze-300 font-mono text-xs bg-carbon-900 px-2 py-0.5 rounded border border-white/10">PAYMENT_CONFIRMED</code> or <code className="text-bronze-300 font-mono text-xs bg-carbon-900 px-2 py-0.5 rounded border border-white/10">SOURCING_IN_PROGRESS</code>, our team commits non-refundable funds to external suppliers. A cancellation request submitted after payment is subject to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-titanium-400 font-sans">
            <li>Whether the external boutique or supplier allows order cancellation before dispatch; and</li>
            <li>Any restocking fee charged by the merchant (passed through at exact cost without markup).</li>
          </ul>
          <p>
            If sourcing can be halted without merchant penalties, a full refund is returned to your original payment method. If the supplier does not allow cancellation, the purchase proceeds to completion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            3. Quality Inspection Failure
          </h2>
          <p>
            If an acquired item fails our hands-on physical authenticity or condition inspection during <code className="text-bronze-300 font-mono text-xs bg-carbon-900 px-2 py-0.5 rounded border border-white/10">QUALITY_CHECK</code>, you will receive an automatic 100% refund, including item cost, service fee, and shipping.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            4. Post-Delivery Inspection Window
          </h2>
          <p>
            Clients have 48 hours from the carrier delivery timestamp to inspect the parcel. If an item arrives damaged, materially defective, or differing from the confirmed quote specifications, clients can report an issue directly from the order page to initiate dispute investigation.
          </p>
        </section>
      </div>
    </div>
  );
}
