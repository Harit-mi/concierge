import React from 'react';
import { IconAlert } from '@/components/icons/FlaticonIcons';

export default function ProhibitedProductsPolicyPage() {
  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-titanium-200">
      <div className="bg-carbon-900 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300 flex items-center gap-2.5 font-mono shadow-stealth">
        <IconAlert className="w-4 h-4 shrink-0 text-amber-400" />
        <span>COMPLIANCE POLICY — Regulated category exclusions and anti-evasion standards.</span>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 font-semibold block">
          Regulatory Compliance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Prohibited & Specially Regulated Goods Policy
        </h1>
        <p className="text-xs text-titanium-500 font-mono">Effective Date: October 26, 2026</p>
      </div>

      <div className="stealth-card p-6 sm:p-10 border border-white/10 text-titanium-300 text-xs sm:text-sm leading-relaxed space-y-8 shadow-2xl">
        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            1. Active vs. Prohibited Pilot Categories
          </h2>
          <p>
            Veritas Sourcing enforces strict regulatory and compliance gating. Only the following categories are currently eligible for sourcing:
          </p>
          <div className="bg-carbon-900 border border-white/10 p-5 rounded-xl text-xs space-y-2 text-titanium-300 font-sans shadow-inner">
            <p className="font-semibold text-bronze-300 font-mono text-[11px] uppercase tracking-wider">Authorized Active Domains:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Designer apparel and fashion clothing (shirts, knitwear, trousers, coats, dresses).</li>
              <li>Sneakers, athletic footwear, and luxury boots/shoes.</li>
              <li>Non-regulated fashion accessories (leather card cases, wallets, scarves, belts, hats).</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            2. Deactivated Categories (Strictly Prohibited)
          </h2>
          <p>
            Requests for items within the following categories will be rejected immediately upon review:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="border border-white/5 p-4 rounded-xl bg-carbon-900/60 space-y-1.5 hover:border-white/10 transition-colors">
              <strong className="text-white block font-semibold">Watches & Timepieces</strong>
              <p className="text-titanium-400 leading-relaxed">Rolex, Patek Philippe, Omega, Cartier. Excluded due to specialized high-value insurance and horological testing requirements.</p>
            </div>
            <div className="border border-white/5 p-4 rounded-xl bg-carbon-900/60 space-y-1.5 hover:border-white/10 transition-colors">
              <strong className="text-white block font-semibold">Fragrances & Perfumes</strong>
              <p className="text-titanium-400 leading-relaxed">Eau de Parfum, colognes. Excluded under hazardous materials (HAZMAT) flammability courier regulations.</p>
            </div>
            <div className="border border-white/5 p-4 rounded-xl bg-carbon-900/60 space-y-1.5 hover:border-white/10 transition-colors">
              <strong className="text-white block font-semibold">Cosmetics & Skincare</strong>
              <p className="text-titanium-400 leading-relaxed">Serums, creams, ingestibles. Excluded due to FDA health safety chain-of-custody requirements.</p>
            </div>
            <div className="border border-white/5 p-4 rounded-xl bg-carbon-900/60 space-y-1.5 hover:border-white/10 transition-colors">
              <strong className="text-white block font-semibold">Consumer Electronics</strong>
              <p className="text-titanium-400 leading-relaxed">Phones, laptops, tablets, gaming hardware. Excluded due to lithium battery transport and serial warranty provisions.</p>
            </div>
            <div className="border border-white/5 p-4 rounded-xl bg-carbon-900/60 space-y-1.5 sm:col-span-2 hover:border-white/10 transition-colors">
              <strong className="text-white block font-semibold">Pharmaceuticals, Supplements & Medical Devices</strong>
              <p className="text-titanium-400 leading-relaxed">Prescription medicines, dietary supplements, medical equipment. Completely prohibited.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            3. Absolute Anti-Evasion & Customs Integrity Standard
          </h2>
          <p>
            Veritas will not participate in or facilitate any mechanism designed to evade sales taxes, carrier requirements, or trade regulations. We will never:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-titanium-400 font-sans">
            <li>Mark commercial goods as &quot;personal gifts&quot; or provide falsified invoices;</li>
            <li>Under-declare actual purchase prices or falsify receipts; or</li>
            <li>Bypass carrier compliance guidelines.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
