import React from 'react';
import { IconAlert } from '@/components/icons/FlaticonIcons';

export default function ShippingPolicyPage() {
  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-titanium-200">
      <div className="bg-carbon-900 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300 flex items-center gap-2.5 font-mono shadow-stealth">
        <IconAlert className="w-4 h-4 shrink-0 text-amber-400" />
        <span>DRAFT OPERATING POLICY — Mainland US domestic pilot guidelines.</span>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 font-semibold block">
          Logistics Protocol
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Domestic Delivery & Fulfilment Guidelines
        </h1>
        <p className="text-xs text-titanium-500 font-mono">Effective Date: October 26, 2026</p>
      </div>

      <div className="stealth-card p-6 sm:p-10 border border-white/10 text-titanium-300 text-xs sm:text-sm leading-relaxed space-y-8 shadow-2xl">
        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            1. Domestic Pilot Boundary
          </h2>
          <p>
            During this operating pilot phase, Veritas delivers strictly to verified physical residential or commercial addresses within the 48 contiguous United States. We do not ship to P.O. Boxes, APO/FPO military bases, or commercial freight forwarders. International cross-border delivery remains deactivated pending regulatory licensing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            2. Signature Delivery & Transit Insurance
          </h2>
          <p>
            Due to the luxury and collectible nature of sourced items, all domestic dispatches feature:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-titanium-400 font-sans">
            <li>Full declared-value carrier insurance covering loss or damage in transit;</li>
            <li>Tamper-evident archival exterior packaging with security seals;</li>
            <li>Direct adult signature requirement upon delivery by the courier (FedEx / UPS).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            3. Estimated Fulfilment Timeframes
          </h2>
          <p>
            Standard domestic concierge fulfillment spans 5 to 10 business days from the moment of payment clearance:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-titanium-400 font-sans">
            <li><strong className="text-white">Days 1-3:</strong> Merchant acquisition and transit to Manhattan inspection lounge.</li>
            <li><strong className="text-white">Days 4-5:</strong> Physical authenticity intake, condition check, and archival boxing.</li>
            <li><strong className="text-white">Days 6-8:</strong> Insured courier transit to client doorstep.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
