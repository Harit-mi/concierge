import React from 'react';
import Link from 'next/link';
import { IconAlert } from '@/components/icons/FlaticonIcons';

export default function TermsPolicyPage() {
  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-titanium-200">
      <div className="bg-carbon-900 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300 flex items-center gap-2.5 font-mono shadow-stealth">
        <IconAlert className="w-4 h-4 shrink-0 text-amber-400" />
        <span>DRAFT LEGAL POLICY — Published for client review prior to formal counsel certification.</span>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 font-semibold block">
          Policy Document v1.0 (Domestic Pilot)
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Terms of Service & Concierge Agreement
        </h1>
        <p className="text-xs text-titanium-500 font-mono">Effective Date: October 26, 2026</p>
      </div>

      <div className="stealth-card p-6 sm:p-10 border border-white/10 text-titanium-300 text-xs sm:text-sm leading-relaxed space-y-8 shadow-2xl">
        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            1. Nature of the Managed Concierge Service
          </h2>
          <p>
            Veritas Sourcing LLC (&quot;Veritas&quot;, &quot;we&quot;, &quot;us&quot;) operates a managed private concierge shopping service. Veritas is not an open peer-to-peer marketplace or direct manufacturer. We act as an authorized purchasing and verification agent on behalf of the customer (&quot;Client&quot;, &quot;you&quot;) to locate, acquire, authenticate, and fulfill eligible personal fashion goods.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            2. Request Submission vs. Order Formation
          </h2>
          <p>
            Submitting a sourcing request via our platform does not form a binding sales agreement or guarantee that the requested merchandise is obtainable. A contract is formed only when:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-titanium-400 font-sans">
            <li>We issue an official, itemized Quote with an identified total payable amount and expiration date;</li>
            <li>You affirmatively click to accept the Quote via your authenticated dashboard; and</li>
            <li>You authorize payment in full through our verified payment processor.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            3. Price Quotes & Financial Accuracy
          </h2>
          <p>
            All monetary figures are calculated in integer minor currency units (US Cents). Every Quote discloses: direct item acquisition cost, concierge service fee, insured domestic courier fee, and estimated sales taxes. Quotes remain binding for 7 calendar days from issuance. If market prices change or inventory sells out prior to client acceptance, Veritas will issue a revised quote for client re-approval.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            4. Geographic Restriction & Prohibited Categories
          </h2>
          <p>
            During our Domestic Pilot Phase, service is exclusively available for destinations within the mainland United States. International forwarding addresses or freight forwarders are prohibited. Watches, perfumes, cosmetics, consumer electronics, and pharmaceuticals are deactivated and ineligible for sourcing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white border-b border-white/5 pb-2">
            5. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted under applicable law, Veritas&apos;s total aggregate liability arising out of any order shall not exceed the total fees paid by the client for that specific order.
          </p>
        </section>
      </div>
    </div>
  );
}
