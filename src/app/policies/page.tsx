'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  IconShield,
  IconAlert,
  IconReceipt,
  IconTruck,
  IconHistory,
  IconLock,
  IconCheckCircle,
  IconArrowRight,
} from '@/components/icons/FlaticonIcons';

function PoliciesContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'authenticity';
  const [activeTab, setActiveTab] = useState(initialTab);

  const sections = [
    { id: 'authenticity', label: 'Authenticity & Forensics', icon: IconShield },
    { id: 'domestic', label: 'Domestic Fulfilment Scope', icon: IconTruck },
    { id: 'pricing', label: 'Transparent Pricing Model', icon: IconReceipt },
    { id: 'refunds', label: 'Cancellation & Refund Terms', icon: IconHistory },
    { id: 'restricted', label: 'Deactivated & Prohibited Goods', icon: IconAlert },
    { id: 'privacy', label: 'Data Privacy & Card Security', icon: IconLock },
  ];

  return (
    <div className="py-16 md:py-28 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto space-y-12 text-[#111215]">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="ledger-stamp">GOVERNANCE & FIDUCIARY CHARTER</span>
        <h1 className="font-display text-4xl sm:text-6xl font-light tracking-tight text-[#111215]">
          Standards & Protocols
        </h1>
        <p className="text-xs sm:text-sm text-[#575A6B] font-mono leading-relaxed">
          Veritas operates as an intimate, managed personal procurement service. We enforce strict physical forensics, transparent fee structures, and domestic pilot boundaries.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E3D8CB] font-sans text-xs">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeTab === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`flex items-center gap-2 px-5 py-3 whitespace-nowrap transition-all uppercase tracking-[0.16em] text-[10.5px] border-b-2 -mb-[2px] ${
                isActive
                  ? 'border-[#9E7A4A] text-[#111215] bg-white font-bold shadow-xs'
                  : 'border-transparent text-[#575A6B] hover:text-[#111215]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#846337]' : 'text-[#8E91A1]'}`} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Card */}
      <div className="luxury-card p-8 sm:p-12 bg-white border border-[#E3D8CB] shadow-luxury space-y-8">
        {activeTab === 'authenticity' && (
          <div className="space-y-6 font-sans text-xs">
            <div className="border-b border-[#F2EDE4] pb-3">
              <h2 className="font-serif text-2xl font-bold text-[#141519]">
                Authenticity & Forensics Protocol
              </h2>
              <p className="text-[#5C5F6D] text-xs font-mono mt-0.5">
                Standard Operational Procedure &bull; SOP-AUTH-2026
              </p>
            </div>

            <p className="text-sm text-[#5C5F6D] leading-relaxed">
              Veritas never certifies an item as authentic prior to physical inspection at our Manhattan intake laboratory. Digital photographs or seller claims are insufficient for certification.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#FAF8F5] rounded-sm border border-[#E2DDD2] space-y-2">
                <span className="font-mono text-xs font-bold text-[#141519] uppercase block">
                  1. Provenance Lineage Vetting
                </span>
                <p className="text-[#5C5F6D] leading-relaxed">
                  Every retail source or consignment vault must possess documented business licenses, verifiable supply chains, and flawless authentication records.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-sm border border-[#E2DDD2] space-y-2">
                <span className="font-mono text-xs font-bold text-[#141519] uppercase block">
                  2. Microscopic Stitching Inspection
                </span>
                <p className="text-[#5C5F6D] leading-relaxed">
                  Optical loupes examine stitch angle, SPI (stitches per inch), thread tension, and backing reinforcement against factory spec sheets.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-sm border border-[#E2DDD2] space-y-2">
                <span className="font-mono text-xs font-bold text-[#141519] uppercase block">
                  3. 365nm UV Luminescence Sweep
                </span>
                <p className="text-[#5C5F6D] leading-relaxed">
                  Ultraviolet sweeps expose clandestine glue bleeding, factory inspection stamps, fabric optical brighteners, and counterfeit box label inks.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-sm border border-[#E2DDD2] space-y-2">
                <span className="font-mono text-xs font-bold text-[#141519] uppercase block">
                  4. Tamper-Evident Security Seal
                </span>
                <p className="text-[#5C5F6D] leading-relaxed">
                  Passing items receive a serialized barcode seal and signed physical Provenance Certificate before handover to insured courier.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'domestic' && (
          <div className="space-y-6 font-sans text-xs">
            <div className="border-b border-[#F2EDE4] pb-3">
              <h2 className="font-serif text-2xl font-bold text-[#141519]">
                Domestic Fulfilment Scope (Pilot Phase)
              </h2>
              <p className="text-[#5C5F6D] text-xs font-mono mt-0.5">
                Territorial Jurisdictions &bull; POL-TERR-US
              </p>
            </div>

            <p className="text-sm text-[#5C5F6D] leading-relaxed">
              Veritas currently operates in a controlled domestic pilot phase exclusively serving mainland United States delivery addresses.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-sm text-amber-950 space-y-1">
                <span className="font-mono font-bold uppercase text-[11px] block">
                  International & Traveler-Assisted Sourcing Strictly Disabled
                </span>
                <p className="leading-relaxed">
                  Cross-border grey market sourcing, undeclared customs importation, and traveler-assisted luggage transport are strictly prohibited under our compliance guidelines. International routes remain disabled until route-specific customs, carrier, and tax workflows have been legally certified.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-sm border border-[#E2DDD2] space-y-2">
                <span className="font-mono font-bold text-[#141519] uppercase text-xs block">
                  Insured Priority Courier Standards
                </span>
                <p className="text-[#5C5F6D] leading-relaxed">
                  All domestic shipments utilize UPS Next Day Air or FedEx Priority Overnight with mandatory direct adult signature delivery. Standard drop-offs at unmonitored doorsteps are never permitted.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6 font-sans text-xs">
            <div className="border-b border-[#F2EDE4] pb-3">
              <h2 className="font-serif text-2xl font-bold text-[#141519]">
                Transparent Four-Part Pricing Model
              </h2>
              <p className="text-[#5C5F6D] text-xs font-mono mt-0.5">
                Financial Disclosure &bull; POL-PRICE-2026
              </p>
            </div>

            <p className="text-sm text-[#5C5F6D] leading-relaxed">
              We never fabricate flat fee markups or hide shipping surcharges. Every quote is delivered with exact integer arithmetic in US cents.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2] flex justify-between items-center">
                <span>1. Verified Retail Acquisition Price</span>
                <span className="font-bold text-[#141519]">Direct pass-through cost</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2] flex justify-between items-center">
                <span>2. Concierge Sourcing & Forensics Fee</span>
                <span className="font-bold text-[#141519]">12% - 18% (Itemized prior to acceptance)</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2] flex justify-between items-center">
                <span>3. Insured Domestic Courier Shipping</span>
                <span className="font-bold text-[#141519]">Exact carrier tariff</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2] flex justify-between items-center">
                <span>4. Applicable State & Local Sales Tax</span>
                <span className="font-bold text-[#141519]">Statutory destination rate</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'refunds' && (
          <div className="space-y-6 font-sans text-xs">
            <div className="border-b border-[#F2EDE4] pb-3">
              <h2 className="font-serif text-2xl font-bold text-[#141519]">
                Cancellation, Returns & Refund Policy
              </h2>
              <p className="text-[#5C5F6D] text-xs font-mono mt-0.5">
                Client Protections &bull; POL-REFUND-2026
              </p>
            </div>

            <div className="space-y-4 text-[#5C5F6D] leading-relaxed">
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-sm text-emerald-950 space-y-1">
                <span className="font-mono font-bold text-xs uppercase block">
                  Intake Inspection Failure: 100% Automatic Refund
                </span>
                <p>
                  If an acquired piece fails our multi-point optical or UV authentication checks, or arrives from the supplier in unsatisfactory condition, the order is cancelled immediately and your payment is refunded in full to your original payment method.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#EAE4D9] rounded-sm space-y-1">
                <span className="font-mono font-bold text-xs text-[#141519] uppercase block">
                  Pre-Acquisition Cancellation
                </span>
                <p>
                  You may request a cancellation anytime before our sourcing specialist purchases the item from the partner boutique. Once acquired, cancellation is subject to the specific supplier&apos;s return policy.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#EAE4D9] rounded-sm space-y-1">
                <span className="font-mono font-bold text-xs text-[#141519] uppercase block">
                  48-Hour Post-Delivery Inspection Window
                </span>
                <p>
                  Upon carrier signature delivery, you have 48 hours to examine the piece. If an issue is reported, our senior dispute team investigates and coordinates return authorization.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'restricted' && (
          <div className="space-y-6 font-sans text-xs">
            <div className="border-b border-[#F2EDE4] pb-3">
              <h2 className="font-serif text-2xl font-bold text-[#141519]">
                Deactivated & Prohibited Categories
              </h2>
              <p className="text-[#5C5F6D] text-xs font-mono mt-0.5">
                Statutory Compliance &bull; POL-PROHIB-2026
              </p>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-950 rounded-sm space-y-1">
              <span className="font-mono font-bold uppercase text-xs block">
                Deactivated in Domestic Pilot Phase:
              </span>
              <p className="leading-relaxed">
                To maintain total regulatory compliance and insurance coverage, the following product categories are disabled by default. Sourcing requests for these goods will be automatically declined.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
                <span className="font-bold text-[#141519] block">Watches & Horology</span>
                <span className="text-[10px] text-[#717584]">Requires specialized third-party movement dismantling</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
                <span className="font-bold text-[#141519] block">Perfumes & Fragrances</span>
                <span className="text-[10px] text-[#717584]">Class 3 flammable liquid carrier restrictions</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
                <span className="font-bold text-[#141519] block">Cosmetics & Skincare</span>
                <span className="text-[10px] text-[#717584]">FDA tamper seals and batch stability requirements</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
                <span className="font-bold text-[#141519] block">Consumer Electronics</span>
                <span className="text-[10px] text-[#717584]">Lithium battery hazardous materials & warranty tracking</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
                <span className="font-bold text-[#141519] block">Pharmaceuticals</span>
                <span className="text-[10px] text-[#717584]">Regulated prescription items strictly prohibited</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
                <span className="font-bold text-[#141519] block">Precious Bullion / Coins</span>
                <span className="text-[10px] text-[#717584]">Cash equivalents and precious metals restricted</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6 font-sans text-xs">
            <div className="border-b border-[#F2EDE4] pb-3">
              <h2 className="font-serif text-2xl font-bold text-[#141519]">
                Data Privacy & Card Security Guarantee
              </h2>
              <p className="text-[#5C5F6D] text-xs font-mono mt-0.5">
                Client Confidentiality &bull; POL-PRIV-2026
              </p>
            </div>

            <div className="space-y-4 text-[#5C5F6D] leading-relaxed">
              <div className="p-4 bg-[#FAF8F5] border border-[#E2DDD2] rounded-sm space-y-1">
                <span className="font-mono font-bold text-xs text-[#141519] uppercase block">
                  Zero Storage of Sensitive Cardholder Data
                </span>
                <p>
                  Veritas never stores raw credit card Primary Account Numbers (PANs), CVVs, or security pins on our servers. All financial transactions are tokenized through accredited Level-1 PCI-DSS payment gateways.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#E2DDD2] rounded-sm space-y-1">
                <span className="font-mono font-bold text-xs text-[#141519] uppercase block">
                  Private Document Vault Links
                </span>
                <p>
                  Inspection certificates, customer invoices, and carrier manifests are hosted on private object storage with signed expiring URLs restricted exclusively to authenticated order owners and assigned staff.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PoliciesPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center font-mono text-xs text-[#717584]">Loading Policies Hub...</div>}>
      <PoliciesContent />
    </Suspense>
  );
}
