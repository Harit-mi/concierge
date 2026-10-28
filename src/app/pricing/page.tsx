import React from 'react';
import Link from 'next/link';

export default function PricingPoliciesPage() {
  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 text-titanium-200">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 font-semibold block">
          Transparent Cost Model
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          How Veritas Quotes Are Calculated
        </h1>
        <p className="text-sm sm:text-base text-titanium-400 leading-relaxed font-sans">
          Zero arbitrary markups or hidden fees. We believe in absolute transparency: you see exactly what the merchant charges, what our sourcing fee is, and what carrier delivery costs before you commit a single dollar.
        </p>
      </div>

      {/* Quote Structure Breakdown */}
      <div className="stealth-card p-8 sm:p-12 space-y-10 border border-white/10 shadow-2xl">
        <div className="border-b border-white/5 pb-5">
          <h2 className="font-serif text-2xl font-bold text-white">
            The 4-Part Itemized Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-titanium-400 font-mono mt-1">
            Every quote provided by our concierge desk is composed of four clear line items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-carbon-800 border border-white/10 text-bronze-400 text-xs font-mono font-bold flex items-center justify-center shadow-inner">
                1
              </span>
              <h3 className="font-serif font-bold text-base text-white">
                Direct Product Acquisition Cost
              </h3>
            </div>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              The exact price charged by the authorized boutique, retailer, or verified consignment vault for the physical merchandise. We retain the original supplier invoice in our secure records.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-carbon-800 border border-white/10 text-bronze-400 text-xs font-mono font-bold flex items-center justify-center shadow-inner">
                2
              </span>
              <h3 className="font-serif font-bold text-base text-white">
                Personal Concierge Sourcing Fee
              </h3>
            </div>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              Our fee for locating the piece, negotiating terms, conducting physical multi-point authenticity inspection, and overseeing end-to-end protective fulfillment. Configured transparently by the operator based on item rarity.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-carbon-800 border border-white/10 text-bronze-400 text-xs font-mono font-bold flex items-center justify-center shadow-inner">
                3
              </span>
              <h3 className="font-serif font-bold text-base text-white">
                Insured Domestic Courier Shipping
              </h3>
            </div>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              All parcels travel with full declared transit insurance and mandatory signature confirmation via premium carriers (FedEx Priority, UPS Air). Never sent via uninsurable or untracked standard mail.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-carbon-800 border border-white/10 text-bronze-400 text-xs font-mono font-bold flex items-center justify-center shadow-inner">
                4
              </span>
              <h3 className="font-serif font-bold text-base text-white">
                Applicable State & Local Sales Tax
              </h3>
            </div>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              Calculated based on your verified delivery ZIP code. No surprise levies or post-order tax adjustments.
            </p>
          </div>
        </div>

        {/* Live Example Quote Card */}
        <div className="bg-carbon-900 border border-white/10 rounded-xl p-6 sm:p-8 space-y-5 shadow-inner">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-titanium-500">Sample Quote Document</span>
              <h4 className="font-serif font-bold text-white text-base">Air Jordan 1 Low OG SP (Canary)</h4>
            </div>
            <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
              Verified Breakdown
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between text-titanium-300">
              <span>Item Acquisition (Deadstock US 10.5):</span>
              <span className="text-white">$520.00</span>
            </div>
            <div className="flex justify-between text-titanium-300">
              <span>Concierge Sourcing & Physical Authenticity Check:</span>
              <span className="text-white">$50.00</span>
            </div>
            <div className="flex justify-between text-titanium-300">
              <span>Insured Domestic Priority Courier:</span>
              <span className="text-white">$25.00</span>
            </div>
            <div className="flex justify-between text-titanium-300">
              <span>Estimated Domestic Sales Tax:</span>
              <span className="text-white">$46.00</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-white/5 font-bold text-sm">
              <span className="text-white">Total Payable Before Sourcing:</span>
              <span className="text-bronze-300 text-base">$641.00 USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Policies Directory */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Platform Policies & Governance
          </h2>
          <p className="text-xs text-titanium-400 font-mono mt-1">
            Standard operating procedures governing our domestic concierge service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <Link
            href="/policies/terms"
            className="stealth-card p-6 hover:border-bronze-500/30 transition-all block space-y-2 group"
          >
            <h4 className="font-serif font-bold text-sm text-white group-hover:text-bronze-300 transition-colors">Terms of Service</h4>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              Client responsibilities, quote acceptance mechanics, and binding service terms.
            </p>
          </Link>

          <Link
            href="/policies/privacy"
            className="stealth-card p-6 hover:border-bronze-500/30 transition-all block space-y-2 group"
          >
            <h4 className="font-serif font-bold text-sm text-white group-hover:text-bronze-300 transition-colors">Privacy & Data Handling</h4>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              How we collect, securely handle, and retain client specifications and addresses.
            </p>
          </Link>

          <Link
            href="/policies/authenticity"
            className="stealth-card p-6 hover:border-bronze-500/30 transition-all block space-y-2 group"
          >
            <h4 className="font-serif font-bold text-sm text-white group-hover:text-bronze-300 transition-colors">Authenticity Protocol</h4>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              Physical multi-point inspection rules and 100% money-back verification pledge.
            </p>
          </Link>

          <Link
            href="/policies/refunds"
            className="stealth-card p-6 hover:border-bronze-500/30 transition-all block space-y-2 group"
          >
            <h4 className="font-serif font-bold text-sm text-white group-hover:text-bronze-300 transition-colors">Cancellations & Refunds</h4>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              Pre-acquisition cancellations, supplier return conditions, and refund procedures.
            </p>
          </Link>

          <Link
            href="/policies/shipping"
            className="stealth-card p-6 hover:border-bronze-500/30 transition-all block space-y-2 group"
          >
            <h4 className="font-serif font-bold text-sm text-white group-hover:text-bronze-300 transition-colors">Domestic Delivery Policy</h4>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              Mainland US pilot radius, transit insurance, and signature receipt protocol.
            </p>
          </Link>

          <Link
            href="/policies/prohibited"
            className="stealth-card p-6 hover:border-bronze-500/30 transition-all block space-y-2 group"
          >
            <h4 className="font-serif font-bold text-sm text-white group-hover:text-bronze-300 transition-colors">Prohibited & Restricted Items</h4>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              Deactivated categories: watches, perfumes, electronics, and cosmetics.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
