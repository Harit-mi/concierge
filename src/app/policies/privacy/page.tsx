import React from 'react';
import { IconAlert } from '@/components/icons/FlaticonIcons';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-titanium-200">
      <div className="bg-carbon-900 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300 flex items-center gap-2.5 font-mono shadow-stealth">
        <IconAlert className="w-4 h-4 shrink-0 text-amber-400" />
        <span>DRAFT LEGAL POLICY — Published for client review prior to formal counsel certification.</span>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 font-semibold block">
          Policy Document v1.0
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Privacy & Data Protection Policy
        </h1>
        <p className="text-xs text-titanium-500 font-mono">Effective Date: October 26, 2026</p>
      </div>

      <div className="stealth-card p-6 sm:p-10 border border-white/10 text-titanium-300 text-xs sm:text-sm leading-relaxed space-y-8 shadow-2xl">
        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            1. Information We Collect
          </h2>
          <p>
            We collect personal information necessary to deliver private concierge services, including: name, contact email address, telephone number, delivery addresses, sizing specifications, and product request references. We collect only what is strictly necessary to evaluate, procure, and ship your requested goods.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            2. Payment Security & Zero Card Storage
          </h2>
          <p>
            Veritas does <strong className="text-white">not</strong> collect or store raw payment card numbers, expiration dates, or security codes (CVV) on our application servers. Payment tokenization, authentication, and processing are handled exclusively through PCI-DSS Level 1 compliant gateway partners with bank-grade encryption.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            3. Private Document Vault & Confidentiality
          </h2>
          <p>
            Order documents (receipts, carrier labels, internal supplier bills) are stored in restricted private cloud vaults. Client access is strictly limited to authorized documents relating to their own orders. Internal supplier invoices containing trade wholesale pricing remain confidential to operators.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            4. Third-Party Sharing Restrictions
          </h2>
          <p>
            We never monetize, rent, or sell client data. Information is disclosed solely to verified suppliers and courier partners to the extent required to execute domestic parcel dispatch.
          </p>
        </section>
      </div>
    </div>
  );
}
