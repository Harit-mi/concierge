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
      roman: 'I',
      title: 'Commission Sourcing Request',
      subtitle: 'Specimen Specification & Criteria',
      icon: IconFileText,
      description:
        'Submit a reference URL, photograph, or model title. Specify brand, exact international sizing, colorway, and budget ceiling. Submitting is purely an exploratory inquiry with zero financial commitment or credit hold.',
      rule: 'Domestic Charter: Sourcing addresses must be situated within the 48 contiguous United States.',
    },
    {
      roman: 'II',
      title: 'Boutique & Archival Vetting',
      subtitle: 'Vetted Global Consignors',
      icon: IconSearch,
      description:
        'A dedicated sourcing specialist scours authorized boutique networks, Japanese deadstock vaults, and private consignors. We assess seller repute, physical condition grade, and domestic transit feasibility.',
      rule: 'Integrity Rule: We reject unauthorized grey-market sellers and undocumented lots.',
    },
    {
      roman: 'III',
      title: 'Itemized Transparent Quotation',
      subtitle: 'Absolute Financial Clarity',
      icon: IconReceipt,
      description:
        'You receive an exact, numbered appraisal sheet detailing (1) direct acquisition price, (2) 12% concierge procurement fee, (3) insured domestic courier, and (4) applicable sales taxes. We never bill estimated costs—only confirmed quotes.',
      rule: 'Rate Protection: Quotations remain guaranteed for 48 hours without retroactive surcharges.',
    },
    {
      roman: 'IV',
      title: 'Escrow Sign-Off & Acquisition',
      subtitle: 'Client Authorization & Escrow Lock',
      icon: IconCreditCard,
      description:
        'Review the appraisal in your private client desk. If acceptable, approve with 1-click and authorize payment securely. Sourcing commences immediately with escrow funds held until physical authentication is verified.',
      rule: 'Security Protocol: Zero storage of raw card PANs or CVVs; tokenized 256-bit AES encryption.',
    },
    {
      roman: 'V',
      title: 'Manhattan Intake Lab & Optical Forensics',
      subtitle: 'Multi-Point Physical Scrutiny',
      icon: IconPackage,
      description:
        'The acquired piece arrives at our Manhattan laboratory. Specialists scrutinize stitch tension, laser hallmarks, packaging barcodes, and UV glue luminescence before vacuum sealing in archival museum packaging.',
      rule: 'Authenticity Guarantee: If an item fails intake inspection, your order is refunded 100% without deduction.',
    },
    {
      roman: 'VI',
      title: 'White-Glove Signature Handover',
      subtitle: 'Insured Tracked Delivery',
      icon: IconTruck,
      description:
        'Your piece is dispatched via insured priority domestic courier with live satellite tracking in your dashboard. Mandatory direct adult signature ensures safe delivery to your door with a 48h physical review window.',
      rule: 'Inspection Privileges: 48 hours to inspect upon receipt and confirm satisfaction or report discrepancy.',
    },
  ];

  return (
    <div className="py-16 md:py-28 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto space-y-20 text-[#111215]">
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="ledger-stamp">OPERATIONAL PROTOCOL</span>
        <h1 className="font-display text-4xl sm:text-6xl font-light tracking-tight text-[#111215]">
          How The Concierge Operates
        </h1>
        <p className="text-xs sm:text-sm text-[#575A6B] font-mono leading-relaxed">
          From exploratory inquiry to physical forensic verification and white-glove handover, Veritas guarantees complete provenance and cost transparency.
        </p>
      </div>

      {/* 6 Step Interactive Roadmap */}
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="luxury-card p-6 sm:p-10 flex flex-col md:flex-row items-start gap-8"
            >
              <div className="flex md:flex-col items-center justify-between w-full md:w-24 shrink-0 border-b md:border-b-0 md:border-r border-[#E3D8CB] pb-4 md:pb-0 md:pr-6">
                <span className="font-display text-3xl font-light text-[#C4A575]">{step.roman}</span>
                <div className="w-10 h-10 bg-[#FAF7F2] text-[#846337] flex items-center justify-center border border-[#E3D8CB]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E3D8CB] pb-3">
                  <h3 className="font-display text-2xl font-bold text-[#111215]">
                    {step.title}
                  </h3>
                  <span className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-[#846337] font-semibold">
                    {step.subtitle}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#575A6B] leading-relaxed font-sans">
                  {step.description}
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#111215] bg-[#FAF7F2] p-3 border border-[#E3D8CB] flex items-start gap-2.5">
                  <IconCheckCircle className="w-4 h-4 text-[#846337] shrink-0 mt-0.5" />
                  <span>{step.rule}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimated vs Confirmed Costs Callout */}
      <div className="dossier-paper p-8 sm:p-10 border-l-4 border-l-[#9E7A4A] space-y-3 shadow-luxury">
        <span className="ledger-stamp">GOVERNANCE & FIDUCIARY POLICY</span>
        <h3 className="font-display text-2xl font-bold text-[#111215]">
          Estimated Budget Targets vs. Confirmed Binding Quotations
        </h3>
        <p className="text-xs sm:text-sm text-[#575A6B] font-sans leading-relaxed">
          Initial budget targets indicated during request submission serve solely as an eligibility guide for our scouting officers. We never charge based on estimates. You will always receive an explicit, binding, itemized quote showing the confirmed supplier price, disclosed concierge fee, shipping, and tax before any payment transaction is authorized.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="text-center space-y-4 pt-8">
        <h3 className="font-display text-3xl font-light text-[#111215]">
          Commission a specific runway or archival piece.
        </h3>
        <p className="text-xs sm:text-sm text-[#575A6B] font-sans max-w-md mx-auto">
          Submit your product reference to receive an appraisal and availability confirmation from our private desk.
        </p>
        <div className="pt-3">
          <Link
            href="/request"
            className="btn-obsidian text-xs px-8 py-4 shadow-luxury inline-flex items-center gap-2.5 group"
          >
            <span>Start Sourcing Request</span>
            <IconArrowRight className="w-3.5 h-3.5 text-[#C4A575] group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}