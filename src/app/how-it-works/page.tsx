import React from 'react';
import Link from 'next/link';
import {
  IconFileText,
  IconSearch,
  IconReceipt,
  IconCreditCard,
  IconPackage,
  IconTruck,
  IconArrowRight,
  IconCheckCircle,
} from '@/components/icons/FlaticonIcons';

export default function HowItWorksPage() {
  const steps = [
    {
      roman: '01',
      title: 'Submit Sourcing Request',
      subtitle: 'Reference & Sizing Criteria',
      icon: IconFileText,
      description:
        'Submit a reference URL, photograph, or model name. Specify brand, exact sizing, preferred colorway, and budget ceiling. Submitting is purely an exploratory inquiry with zero financial commitment or credit hold.',
      rule: 'Domestic Scope: Sourcing and delivery addresses must be situated within the 48 contiguous United States.',
    },
    {
      roman: '02',
      title: 'Boutique & Archival Scouting',
      subtitle: 'Vetted Global Stockists',
      icon: IconSearch,
      description:
        'A dedicated sourcing specialist scours authorized boutique networks, Japanese deadstock vaults, and private consignors worldwide. We confirm genuine physical availability, condition grade, and domestic transit logistics.',
      rule: 'Integrity Rule: We deal exclusively with vetted stockists and authenticated archives.',
    },
    {
      roman: '03',
      title: 'Itemized 48-Hour Quotation',
      subtitle: 'Complete Cost Transparency',
      icon: IconReceipt,
      description:
        'You receive an exact, itemized appraisal detailing (1) direct boutique acquisition price, (2) disclosed 12% concierge procurement fee, (3) insured domestic courier shipping, and (4) applicable sales taxes. We never bill estimated costs—only confirmed quotes.',
      rule: 'Price Protection: Quotations remain guaranteed for 48 hours without retroactive adjustments.',
    },
    {
      roman: '04',
      title: 'Client Authorization & Acquisition',
      subtitle: 'Secure Escrow Commitment',
      icon: IconCreditCard,
      description:
        'Review the itemized quote in your private client portal. When you approve, authorize payment securely. Procurement commences immediately with funds held securely until physical verification is complete.',
      rule: 'Security Protocol: Secure 256-bit encrypted checkout via Stripe with immediate payment confirmation.',
    },
    {
      roman: '05',
      title: 'Manhattan Intake & Physical Inspection',
      subtitle: 'In-Person Quality Verification',
      icon: IconPackage,
      description:
        'The procured item is shipped directly to our Manhattan office. Specialists examine materials, hardware, stitching, tags, and box condition against authenticated reference standards before careful repackaging in archival dust protection.',
      rule: 'Authenticity Guarantee: If any item fails intake standards, the commission is cancelled and 100% refunded.',
    },
    {
      roman: '06',
      title: 'Insured White-Glove Handover',
      subtitle: 'Direct Adult Signature Delivery',
      icon: IconTruck,
      description:
        'Your piece is dispatched via insured priority domestic courier with live tracking in your dashboard. Mandatory direct adult signature ensures safe handover with a 48-hour client review period.',
      rule: 'Review Period: 48 hours upon receipt to inspect the piece and confirm complete satisfaction.',
    },
  ];

  return (
    <div className="py-16 md:py-28 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto space-y-20 text-[#121212]">
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
          The Sourcing Process
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-[#121212]">
          How The Concierge Operates
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5852] font-sans leading-relaxed">
          From initial reference inquiry to physical verification in Manhattan and white-glove handover, Veritas guarantees complete provenance and financial transparency.
        </p>
      </div>

      {/* 6-Step Roadmap */}
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#E5E3DC] p-6 sm:p-10 flex flex-col md:flex-row items-start gap-8 shadow-sm rounded-[1px]"
            >
              <div className="flex md:flex-col items-center justify-between w-full md:w-24 shrink-0 border-b md:border-b-0 md:border-r border-[#E5E3DC] pb-4 md:pb-0 md:pr-6">
                <span className="font-serif text-3xl font-light text-[#8A8880]">{step.roman}</span>
                <div className="w-10 h-10 bg-[#F3F2EC] text-[#121212] flex items-center justify-center border border-[#E5E3DC]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E5E3DC] pb-3">
                  <h3 className="font-serif text-2xl font-normal text-[#121212]">
                    {step.title}
                  </h3>
                  <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#5A5852] font-medium">
                    {step.subtitle}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5A5852] leading-relaxed font-sans">
                  {step.description}
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#121212] bg-[#F3F2EC] p-3 border border-[#E5E3DC] flex items-start gap-2.5">
                  <IconCheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{step.rule}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Policy Callout */}
      <div className="bg-[#F3F2EC] border border-[#E5E3DC] p-8 sm:p-10 space-y-3 shadow-sm rounded-[1px]">
        <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212]">
          Pricing & Governance Policy
        </span>
        <h3 className="font-serif text-2xl font-normal text-[#121212]">
          Target Budget Guidelines vs. Confirmed Binding Quotations
        </h3>
        <p className="text-xs sm:text-sm text-[#5A5852] font-sans leading-relaxed">
          Initial budget targets indicated during request submission serve solely as an eligibility guide for our sourcing team. We never charge based on estimates. You will always receive an explicit, binding, itemized quote showing the confirmed boutique price, disclosed 12% concierge fee, insured shipping, and sales tax before any payment transaction is authorized.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="text-center space-y-4 pt-8">
        <h3 className="font-serif text-3xl font-light text-[#121212]">
          Commission a specific runway or archival piece.
        </h3>
        <p className="text-xs sm:text-sm text-[#5A5852] font-sans max-w-md mx-auto leading-relaxed">
          Submit your product reference to receive an itemized quote and availability confirmation from our private desk.
        </p>
        <div className="pt-3">
          <Link
            href="/request"
            className="btn-noir text-xs px-8 py-4 inline-flex items-center gap-2.5 group"
          >
            <span>Start Sourcing Request</span>
            <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
