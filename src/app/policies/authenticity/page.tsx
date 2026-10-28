import React from 'react';
import { IconAlert, IconShield } from '@/components/icons/FlaticonIcons';

export default function AuthenticityPolicyPage() {
  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-titanium-200">
      <div className="bg-carbon-900 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300 flex items-center gap-2.5 font-mono shadow-stealth">
        <IconAlert className="w-4 h-4 shrink-0 text-amber-400" />
        <span>DRAFT OPERATING POLICY — Verified physical intake protocol.</span>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 font-semibold block">
          Provenance Protocol
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Authenticity & Sourcing Verification Protocol
        </h1>
        <p className="text-xs text-titanium-500 font-mono">Effective Date: October 26, 2026</p>
      </div>

      <div className="stealth-card p-6 sm:p-10 border border-white/10 text-titanium-300 text-xs sm:text-sm leading-relaxed space-y-6 shadow-2xl">
        <div className="bg-carbon-900 p-4 rounded-xl border border-white/10 flex items-start gap-3">
          <IconShield className="w-5 h-5 text-bronze-400 shrink-0 mt-0.5" />
          <p className="text-xs text-titanium-200 leading-relaxed font-sans font-medium">
            Core Philosophy: Veritas never certifies or promises that an item is authentic before physical inspection is completed at our intake hub. Availability claims remain conditional until hands-on inspection passes.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            1. Authorized Sourcing Channels
          </h2>
          <p>
            We acquire goods strictly from authorized brand boutiques, accredited department stores (e.g. Dover Street Market, SSENSE, Selfridges), and Tier-1 consignment houses with established provenance trails. We never purchase from anonymous individual sellers without institutional verification guarantees.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            2. Multi-Point Physical Inspection Criteria
          </h2>
          <p>
            Upon delivery to our Manhattan intake lounge, our verification specialists examine:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-titanium-400 font-sans">
            <li><strong className="text-white">Textile & Leather Consistency:</strong> Grain texture, edge paint, stitching density, and aroma profile.</li>
            <li><strong className="text-white">Hardware & Engravings:</strong> Zipper mechanisms (YKK, Riri, Lampo), laser hallmarks, fastener weight, and font typography.</li>
            <li><strong className="text-white">Internal Labels & Date Codes:</strong> Microprint security threads, wash tag barcodes, and season codes.</li>
            <li><strong className="text-white">Ultraviolet (UV) Forensics:</strong> Inspection of glue lines, internal foam, and hidden watermark stamps.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            3. The 100% Provenance Refund Pledge
          </h2>
          <p>
            If any sourced piece fails our verification standards, we refuse intake immediately, cancel the supplier transaction, and issue an immediate 100% full refund to the client including all service fees.
          </p>
        </section>
      </div>
    </div>
  );
}
