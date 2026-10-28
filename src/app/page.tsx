'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  IconArrowRight,
  IconShield,
  IconReceipt,
  IconPackage,
  IconTruck,
  IconHanger,
  IconSneaker,
  IconCheckCircle,
  IconLock,
  IconShoppingBag,
} from '@/components/icons/FlaticonIcons';

export default function HomePage() {
  const categories = [
    {
      title: 'Collectible Footwear & Archive Runners',
      tag: 'Tier 1 Verified Deadstock',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
      caption: 'Specimen No. 01 — Jordan 1 Retro Low OG SP "Canary"',
      description: 'Discontinued collaborative drops, Japanese market releases, and deadstock silhouettes authenticated down to thread-tension tolerances.',
      examples: ['Travis Scott x Jordan', 'Nike SB Dunk Low Pro', 'Salomon Advanced XT-6', 'New Balance 990v6 Made in USA'],
      curatorNote: 'Acquired exclusively via vetted boutique consignors and authorized Japanese deadstock archives.',
    },
    {
      title: 'Runway Tailoring & Avant-Garde Apparel',
      tag: 'Curated Designer Garments',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=85',
      caption: 'Specimen No. 02 — Homme Plissé Issey Miyake Pleated Blazer',
      description: 'Sold-out seasonal garments, Paris & Milan runway samples, and archival knitwear sourced through authorized international retail distributors.',
      examples: ['Homme Plissé Issey Miyake', 'Maison Margiela Artisanal', 'Dries Van Noten', 'Bode New York'],
      curatorNote: 'Full provenance documentation, original boutique hangers, and archival dust protection guaranteed.',
    },
    {
      title: 'Non-Regulated Fine Leather Goods',
      tag: 'Eligible Luxury Accessories',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
      caption: 'Specimen No. 03 — Bottega Veneta Intrecciato Card Case',
      description: 'Handcrafted calfskin cardholders, silk twill scarves, and leather belts adhering strictly to non-regulated domestic compliance standards.',
      examples: ['Bottega Veneta Intrecciato', 'Goyard St. Sulpice', 'Lemaire Molded Leather', 'The Row Accessories'],
      curatorNote: 'High-risk items (watches, perfumes, cosmetics) strictly deactivated in compliance with our domestic pilot charter.',
    },
  ];

  const faqs = [
    {
      q: 'How does the private concierge sourcing service operate?',
      a: 'Veritas operates as an intimate procurement service rather than an open marketplace. When you submit an inquiry with a reference URL, photograph, or description, our sourcing specialists personally confirm availability across vetted boutique networks and private European or Japanese archives. We prepare an itemized quote, verify seller provenance, and coordinate physical intake, optical forensic inspection, and insured courier delivery.',
    },
    {
      q: 'Does submitting a sourcing request initiate a charge?',
      a: 'Never. Submitting a request creates a non-binding feasibility inquiry. You receive an itemized, confirmed quotation with 48 hours to review. No financial transaction or hold takes place until you explicitly approve the quotation.',
    },
    {
      q: 'What physical checks are conducted during intake forensics?',
      a: 'Every acquired specimen passes through our Manhattan intake hub before customer dispatch. Our specialists verify stitch-density ratios, UV adhesive luminescence, micro-hallmarks, packaging label typography, and box construction. Any piece failing verification is immediately rejected, and the client receives a 100% refund without deduction.',
    },
    {
      q: 'What product categories are supported during this phase?',
      a: 'We support authentic designer apparel, collectible deadstock footwear, and non-regulated fashion leather accessories for delivery within the mainland United States. High-risk or heavily regulated goods—such as luxury watches, perfumes, cosmetics, consumer electronics, and pharmaceuticals—are strictly deactivated in this domestic pilot phase.',
    },
    {
      q: 'How is the itemized quotation calculated?',
      a: 'Every quotation reflects complete financial transparency: the exact wholesale/retail acquisition cost from the supplier, our disclosed concierge fee (typically 12%), insured priority domestic courier with signature required, and estimated local sales taxes. There are no hidden surcharges or post-purchase currency conversion fees.',
    },
  ];

  return (
    <div className="text-[#111215] bg-[#FAF7F2] overflow-hidden">
      {/* 1. ASYMMETRIC LUXURY EDITORIAL HERO */}
      <section className="relative pt-10 sm:pt-16 pb-20 md:pb-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto border-b border-[#E3D8CB]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typographic Majesty (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Serial Header Tag */}
            <div className="flex items-center gap-3">
              <span className="ledger-stamp">
                VERITAS &bull; PRIVATE CLIENT DESK &bull; PILOT N° 2026
              </span>
              <span className="text-[10px] font-mono text-[#846337] uppercase tracking-widest hidden sm:inline-block">
                Domestic Mainland US
              </span>
            </div>

            {/* Editorial Cormorant Headline */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6rem] leading-[0.92] tracking-[-0.02em] text-[#111215] font-light">
              The art of acquiring <br />
              <span className="font-editorial-italic font-normal text-[#846337] tracking-normal">
                what cannot be found.
              </span>
            </h1>

            {/* Curated Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-[#575A6B] max-w-xl font-sans font-normal leading-relaxed">
              Veritas is a bespoke personal procurement house. Tell us the runway garment, archival sneaker, or leather piece you seek. We scout vetted global archives, present an itemized quotation, and conduct rigorous physical forensics before white-glove handover.
            </p>

            {/* Primary Action Suite */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/request"
                className="btn-obsidian px-8 py-4 text-xs shadow-luxury flex items-center justify-center gap-3 group"
              >
                <IconShoppingBag className="w-3.5 h-3.5 text-[#C4A575]" strokeWidth={2} />
                <span>Initiate Sourcing Request</span>
                <IconArrowRight className="w-3.5 h-3.5 text-[#C4A575] group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link
                href="/how-it-works"
                className="btn-luxury-outline px-8 py-4 text-xs text-center"
              >
                The Concierge Protocol
              </Link>
            </div>

            {/* High-Touch Assurances */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E3D8CB] font-sans text-[11px] text-[#575A6B]">
              <div className="space-y-1.5">
                <IconCheckCircle className="w-4 h-4 text-[#9E7A4A]" />
                <span className="block text-[#111215] font-semibold text-[11px] tracking-wide">Zero Blind Buys</span>
                <span className="text-[10px] text-[#846337] leading-snug block">No charge without quote sign-off</span>
              </div>
              <div className="space-y-1.5">
                <IconShield className="w-4 h-4 text-[#9E7A4A]" />
                <span className="block text-[#111215] font-semibold text-[11px] tracking-wide">Forensic Intake</span>
                <span className="text-[10px] text-[#846337] leading-snug block">Multi-point optical verification</span>
              </div>
              <div className="space-y-1.5">
                <IconTruck className="w-4 h-4 text-[#9E7A4A]" />
                <span className="block text-[#111215] font-semibold text-[11px] tracking-wide">Insured Handover</span>
                <span className="text-[10px] text-[#846337] leading-snug block">Direct adult signature required</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Hero Plate (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-[#E3D8CB] p-3 bg-white shadow-luxury rounded-[2px]">
              {/* Inner Framing */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F4EFEA]">
                <img
                  src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85"
                  alt="Archival Footwear Acquisition"
                  className="w-full h-full object-cover grayscale contrast-[1.08] hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Overlay Vignette & Badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111215]/80 via-transparent to-transparent" />
                
                {/* Floating Provenance Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-sm border border-[#E3D8CB] text-left space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#846337] uppercase tracking-wider">
                    <span>ACQUISITION SPECIMEN</span>
                    <span>AUTHENTICATED</span>
                  </div>
                  <div className="font-display text-lg font-bold text-[#111215] leading-tight">
                    Jordan 1 Retro Low OG SP &ldquo;Canary&rdquo;
                  </div>
                  <div className="text-[11px] font-mono text-[#575A6B] flex items-center justify-between pt-1 border-t border-[#E3D8CB]">
                    <span>Itemized Quote: $641.00 USD</span>
                    <span className="text-emerald-700 font-semibold">100% Authentic</span>
                  </div>
                </div>
              </div>

              {/* Archival Corner Seal */}
              <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-[#111215] text-[#C4A575] border-2 border-[#C4A575] flex items-center justify-center font-display text-xs font-bold tracking-widest shadow-md">
                VERITAS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE-STAGE CUSTODY PROTOCOL */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto border-b border-[#E3D8CB]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="ledger-stamp">THE CONCIERGE PROTOCOL</span>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-[#111215] leading-tight">
              A disciplined, three-stage journey of personal procurement.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#575A6B] font-mono max-w-md leading-relaxed">
            Unlike retail marketplaces where inventory is held, our team executes bespoke sourcing commissions under verified escrow principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E3D8CB] border border-[#E3D8CB]">
          {/* Stage I */}
          <div className="bg-[#FAF7F2] p-8 sm:p-10 space-y-6 flex flex-col justify-between hover:bg-white transition-colors">
            <div className="space-y-4">
              <span className="font-display text-3xl text-[#C4A575] block font-light">Stage I</span>
              <h3 className="font-display text-2xl font-bold text-[#111215]">
                Bespoke Sourcing Commission
              </h3>
              <p className="text-xs text-[#575A6B] font-sans leading-relaxed">
                Submit an inquiry via our 4-step intake desk with an image, SKU, or retailer link. Specify desired sizing, target budget, and delivery timeframe. This initiates private scouting without binding purchase commitments.
              </p>
            </div>
            <div className="pt-6 border-t border-[#E3D8CB] text-[11px] font-mono text-[#846337] flex items-center justify-between">
              <span>Non-Binding Inquiry</span>
              <span>4-Step Form</span>
            </div>
          </div>

          {/* Stage II */}
          <div className="bg-[#FAF7F2] p-8 sm:p-10 space-y-6 flex flex-col justify-between hover:bg-white transition-colors">
            <div className="space-y-4">
              <span className="font-display text-3xl text-[#C4A575] block font-light">Stage II</span>
              <h3 className="font-display text-2xl font-bold text-[#111215]">
                Itemized Transparent Quotation
              </h3>
              <p className="text-xs text-[#575A6B] font-sans leading-relaxed">
                Our specialists verify physical stock with authorized boutiques and private archives. We generate an itemized appraisal sheet detailing product price, 12% concierge fee, insured shipping, and tax with 48h rate protection.
              </p>
            </div>
            <div className="pt-6 border-t border-[#E3D8CB] text-[11px] font-mono text-[#846337] flex items-center justify-between">
              <span>Zero Markups</span>
              <span>48h Price Hold</span>
            </div>
          </div>

          {/* Stage III */}
          <div className="bg-[#FAF7F2] p-8 sm:p-10 space-y-6 flex flex-col justify-between hover:bg-white transition-colors">
            <div className="space-y-4">
              <span className="font-display text-3xl text-[#C4A575] block font-light">Stage III</span>
              <h3 className="font-display text-2xl font-bold text-[#111215]">
                Intake Forensics & Handover
              </h3>
              <p className="text-xs text-[#575A6B] font-sans leading-relaxed">
                Upon quotation approval, we acquire the piece. It is routed to our Manhattan intake lab for multi-point physical forensics, UV illumination, and packaging checks prior to insured priority courier transit.
              </p>
            </div>
            <div className="pt-6 border-t border-[#E3D8CB] text-[11px] font-mono text-[#846337] flex items-center justify-between">
              <span>100% Physical QA</span>
              <span>Adult Signature</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL ACQUISITIONS LOOKBOOK (PRODUCTS ROOM TO BREATHE) */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto border-b border-[#E3D8CB]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-3">
            <span className="ledger-stamp">CURATED CATEGORY DOSSIERS</span>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-[#111215]">
              Eligible product classifications.
            </h2>
          </div>
          <Link
            href="/policies"
            className="btn-editorial-text text-[11px]"
          >
            Review Domestic Pilot Boundaries &rarr;
          </Link>
        </div>

        <div className="space-y-20">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center p-6 sm:p-10 bg-white border border-[#E3D8CB] rounded-[2px] shadow-luxury ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Showcase (5 cols) */}
              <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#F4EFEA] border border-[#E3D8CB]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white/95 text-[10px] font-mono text-[#846337] tracking-wider uppercase border border-[#E3D8CB]">
                    {cat.caption}
                  </div>
                </div>
              </div>

              {/* Text & Specification Anatomy (7 cols) */}
              <div className={`lg:col-span-7 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#846337] font-semibold">
                      {cat.tag}
                    </span>
                    <span className="text-xs text-[#E3D8CB]">&bull;</span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none">
                      Active Pilot Category
                    </span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl font-light text-[#111215]">
                    {cat.title}
                  </h3>
                </div>

                <p className="text-sm text-[#575A6B] font-sans leading-relaxed">
                  {cat.description}
                </p>

                {/* Example Silhouettes */}
                <div className="space-y-2 pt-2 border-t border-[#E3D8CB]">
                  <span className="text-[10.5px] font-mono text-[#846337] uppercase tracking-wider block">
                    Frequently Commissioned Silhouettes & Houses:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cat.examples.map((ex, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono bg-[#FAF7F2] border border-[#E3D8CB] text-[#111215] px-3 py-1"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <p className="text-xs text-[#846337] italic font-display">
                    {cat.curatorNote}
                  </p>
                  <Link
                    href={`/request?category=${cat.title.toLowerCase().replace(/ /g, '-')}`}
                    className="btn-obsidian px-5 py-2.5 text-[10.5px] shrink-0"
                  >
                    Request Item &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRANSPARENT ITEMIZATION LEDGER DEMO */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto border-b border-[#E3D8CB]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="ledger-stamp">FORENSIC COST INTEGRITY</span>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-[#111215] leading-tight">
              Anatomy of a Veritas Quotation.
            </h2>
            <p className="text-sm text-[#575A6B] leading-relaxed font-sans">
              Unlike grey-market reselling with unpredictable markups, our quotes are actuarially itemized down to the single cent. Every customer quotation includes acquisition invoices, explicit service fees, and insured transit calculations.
            </p>
            <ul className="space-y-3 text-xs font-mono text-[#575A6B]">
              <li className="flex items-center gap-2">
                <IconCheckCircle className="w-4 h-4 text-[#846337]" /> Transparent 12-18% procurement commission
              </li>
              <li className="flex items-center gap-2">
                <IconCheckCircle className="w-4 h-4 text-[#846337]" /> True wholesale/boutique acquisition pass-through
              </li>
              <li className="flex items-center gap-2">
                <IconCheckCircle className="w-4 h-4 text-[#846337]" /> Zero hidden customs or border surprises
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="dossier-paper p-6 sm:p-10 shadow-luxury space-y-6">
              <div className="flex items-center justify-between border-b border-[#E3D8CB] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#846337] uppercase tracking-widest block">
                    SAMPLE CLIENT APPRAISAL SHEET
                  </span>
                  <div className="font-display text-xl font-bold text-[#111215]">
                    Ref: QTE-2026-8801 &bull; Travis Scott x Jordan 1 Low
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-white border border-[#C4A575] text-[#846337] px-2.5 py-1 uppercase tracking-wider">
                  Price Hold: 48 Hours
                </span>
              </div>

              {/* Itemized Table */}
              <div className="divide-y divide-[#E3D8CB] font-mono text-xs">
                <div className="py-2.5 flex items-center justify-between text-[#575A6B]">
                  <span>Direct Boutique Acquisition Price (Milan Authorized Archive)</span>
                  <span className="font-semibold text-[#111215]">$520.00 USD</span>
                </div>
                <div className="py-2.5 flex items-center justify-between text-[#575A6B]">
                  <span>Concierge Procurement Commission (12.0%)</span>
                  <span className="font-semibold text-[#111215]">$62.40 USD</span>
                </div>
                <div className="py-2.5 flex items-center justify-between text-[#575A6B]">
                  <span>Armored / Priority Insured Courier (Signature Direct)</span>
                  <span className="font-semibold text-[#111215]">$20.00 USD</span>
                </div>
                <div className="py-2.5 flex items-center justify-between text-[#575A6B]">
                  <span>Estimated State Sales Tax (Mainland US 8.875%)</span>
                  <span className="font-semibold text-[#111215]">$38.60 USD</span>
                </div>
                <div className="py-4 flex items-center justify-between text-base border-t-2 border-[#111215]">
                  <span className="font-display font-bold text-[#111215] uppercase tracking-wider">
                    Total Binding Amount Payable
                  </span>
                  <span className="font-display text-2xl font-bold text-[#846337]">
                    $641.00 USD
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E3D8CB] text-[11px] text-[#575A6B] font-mono flex items-center gap-2">
                <IconShield className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Protected by the Veritas 100% Intake Authenticity Warranty. Rejected items refunded in full.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <span className="ledger-stamp">CLIENT PRIVILEGES & INQUIRIES</span>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-[#111215]">
            Frequently Addressed Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#575A6B] font-mono">
            Clear terms and strict operational governance governing our domestic pilot.
          </p>
        </div>

        <div className="divide-y divide-[#E3D8CB] border-y border-[#E3D8CB]">
          {faqs.map((faq, index) => (
            <div key={index} className="py-8 space-y-3 text-left">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#111215]">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-[#575A6B] leading-relaxed font-sans">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 p-8 sm:p-12 bg-white border border-[#E3D8CB] text-center space-y-6 shadow-luxury rounded-[2px]">
          <span className="ledger-stamp">DESK ACTIVE &bull; DOMESTIC PILOT</span>
          <h3 className="font-display text-3xl sm:text-4xl font-light text-[#111215]">
            Seeking an authentic runway or deadstock piece?
          </h3>
          <p className="text-xs sm:text-sm text-[#575A6B] max-w-lg mx-auto font-sans">
            Our private personal shoppers review inquiries within 24 hours. Submit a photograph or reference URL to initiate a search.
          </p>
          <div className="pt-2">
            <Link
              href="/request"
              className="btn-obsidian inline-flex items-center gap-3 px-8 py-4 text-xs group"
            >
              <span>Submit Sourcing Inquiry</span>
              <IconArrowRight className="w-3.5 h-3.5 text-[#C4A575] group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}