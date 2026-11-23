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
  IconCheckCircle,
  IconLock,
  IconShoppingBag,
} from '@/components/icons/FlaticonIcons';

export default function HomePage() {
  const categories = [
    {
      title: 'Archival Footwear & Deadstock Silhouettes',
      tag: 'Limited Allocations',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
      caption: 'Curated Sourcing — Jordan 1 Retro Low OG SP "Canary"',
      description: 'Discontinued collaborative drops, Tokyo market releases, and deadstock silhouettes authenticated in-person by our footwear specialists before dispatch.',
      examples: ['Travis Scott x Jordan', 'Nike SB Dunk Low Pro', 'Salomon Advanced XT-6', 'New Balance 990v6 Made in USA'],
      curatorNote: 'Acquired through vetted boutique relationships, authorized European stockists, and private Japanese archives.',
    },
    {
      title: 'Runway Tailoring & Ready-to-Wear',
      tag: 'Curated Designer Garments',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=85',
      caption: 'Curated Sourcing — Homme Plissé Pleated Architecture',
      description: 'Sold-out seasonal pieces, Paris and Milan runway coats, and archival knitwear tracked down directly from authorized international stockists.',
      examples: ['Homme Plissé Issey Miyake', 'Maison Margiela Artisanal', 'Dries Van Noten', 'Bode New York'],
      curatorNote: 'Complete provenance documentation, original boutique dust covers, and authentic tags guaranteed.',
    },
    {
      title: 'Fine Leather Goods & Accessories',
      tag: 'Luxury Leatherwear',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
      caption: 'Curated Sourcing — Bottega Veneta Intrecciato Weave',
      description: 'Handcrafted calfskin cardholders, molded pouches, silk twill scarves, and leather belts sourced with direct receipt provenance.',
      examples: ['Bottega Veneta Intrecciato', 'Goyard St. Sulpice', 'Lemaire Molded Leather', 'The Row Accessories'],
      curatorNote: 'High-risk categories (watches, cosmetics, perfumes) deactivated in strict adherence to our domestic pilot scope.',
    },
  ];

  const faqs = [
    {
      q: 'How does the Veritas private concierge work?',
      a: 'Veritas operates as an intimate procurement service rather than an open marketplace. Submit a reference image, product link, or model name. Our sourcing team scours our authorized boutique network and private international archives. Within 24–48 hours, we present an itemized quote detailing the exact boutique price, our transparent 12% fee, insured shipping, and sales tax. Once you approve, we acquire the piece, physically verify its authenticity in Manhattan, and ship it to your door.',
    },
    {
      q: 'Is there any fee or commitment to submit a request?',
      a: 'None. Submitting an inquiry is completely free and non-binding. You receive a confirmed, itemized quotation with 48 hours of price protection. No card hold or charge takes place until you review and explicitly authorize the quote.',
    },
    {
      q: 'How do you guarantee authenticity?',
      a: 'Every piece is physically routed to our Manhattan intake office before customer dispatch. Our specialists verify materials, stitch tension, factory hallmarks, interior labels, and packaging against reference archives. If any item fails our intake standards, the purchase is immediately cancelled and your payment is refunded in full.',
    },
    {
      q: 'What categories are supported during this pilot?',
      a: 'We specialize in authentic designer ready-to-wear, collectible deadstock footwear, and luxury leather accessories for delivery within the mainland United States. Regulated or high-risk items—such as watches, fine jewelry, fragrance, and electronics—are currently outside our pilot scope.',
    },
    {
      q: 'How is the itemized quote calculated?',
      a: 'We believe in absolute financial transparency. Every quotation itemizes the exact boutique acquisition cost, our 12% concierge procurement fee, insured courier shipping with adult signature required, and estimated local sales taxes. There are no hidden foreign exchange markups or surprise customs fees.',
    },
  ];

  return (
    <div className="text-[#121212] bg-[#FAF9F5] overflow-hidden">
      {/* 1. EDITORIAL QUIET LUXURY HERO */}
      <section className="relative pt-12 sm:pt-20 pb-20 md:pb-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto border-b border-[#E5E3DC]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typographic Prominence (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Header Badge */}
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
                Veritas &bull; Private Sourcing Desk &bull; New York
              </span>
              <span className="text-[10px] font-mono text-[#5A5852] uppercase tracking-widest hidden sm:inline-block">
                US Domestic Pilot
              </span>
            </div>

            {/* Couture Display Serif Headline */}
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-[5.25rem] xl:text-[5.75rem] leading-[0.94] tracking-[-0.025em] text-[#121212] font-light">
              Acquiring the pieces <br />
              <span className="italic font-normal font-serif text-[#5A5852]">
                everyone said were sold out.
              </span>
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-[#5A5852] max-w-xl font-sans font-normal leading-relaxed">
              Veritas is a bespoke personal shopping and procurement house. Tell us the runway garment, archival sneaker, or leather piece you seek. We scout vetted global archives, present an itemized quote, and physically verify authenticity before white-glove delivery.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/request"
                className="btn-noir px-8 py-4 text-xs flex items-center justify-center gap-3 group"
              >
                <span>Submit Sourcing Request</span>
                <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/how-it-works"
                className="btn-outline px-8 py-4 text-xs text-center"
              >
                The Sourcing Process
              </Link>
            </div>

            {/* Client Assurances */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[#E5E3DC] font-sans text-xs text-[#5A5852]">
              <div className="space-y-1.5">
                <span className="block text-[#121212] font-medium text-xs tracking-wide">Zero Blind Purchases</span>
                <span className="text-[11px] text-[#5A5852] leading-snug block">No charge without itemized quote sign-off</span>
              </div>
              <div className="space-y-1.5">
                <span className="block text-[#121212] font-medium text-xs tracking-wide">Physical Verification</span>
                <span className="text-[11px] text-[#5A5852] leading-snug block">Multi-point inspection in Manhattan</span>
              </div>
              <div className="space-y-1.5">
                <span className="block text-[#121212] font-medium text-xs tracking-wide">Insured Handover</span>
                <span className="text-[11px] text-[#5A5852] leading-snug block">Mandatory direct adult signature</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual Composition (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-[#E5E3DC] p-3 bg-white rounded-[1px] shadow-sm">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F3F2EC]">
                <img
                  src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85"
                  alt="Archival Sourcing Acquisition"
                  className="w-full h-full object-cover grayscale contrast-[1.04] hover:grayscale-0 transition-all duration-700"
                />

                {/* Floating Provenance Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-sm border border-[#E5E3DC] text-left space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#5A5852] uppercase tracking-wider">
                    <span>Recent Procurement</span>
                    <span className="text-emerald-700 font-medium">Physically Verified</span>
                  </div>
                  <div className="font-serif text-lg font-normal text-[#121212] leading-tight">
                    Jordan 1 Retro Low OG SP &ldquo;Canary&rdquo;
                  </div>
                  <div className="text-[11px] font-mono text-[#5A5852] flex items-center justify-between pt-1 border-t border-[#E5E3DC]">
                    <span>Itemized Quote: $641.00 USD</span>
                    <span>Direct Boutique Pass-Through</span>
                  </div>
                </div>
              </div>

              {/* Minimalist Seal */}
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-[#121212] text-[#FAF9F5] flex items-center justify-center font-serif text-[11px] tracking-widest border border-white shadow-sm">
                VER
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE-STAGE SOURCING PROTOCOL */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto border-b border-[#E5E3DC]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
              The Concierge Protocol
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#121212] leading-tight">
              A transparent, three-stage journey of personal procurement.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5A5852] font-sans max-w-md leading-relaxed">
            Unlike retail marketplaces that sell in-stock inventory, Veritas acts as your dedicated buying agent, accessing private stockists and private collections worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E5E3DC] border border-[#E5E3DC]">
          {/* Stage 01 */}
          <div className="bg-[#FAF9F5] p-8 sm:p-10 space-y-6 flex flex-col justify-between hover:bg-white transition-colors">
            <div className="space-y-4">
              <span className="font-serif text-2xl text-[#8A8880] block font-light">Stage 01</span>
              <h3 className="font-serif text-2xl font-normal text-[#121212]">
                Private Client Inquiry
              </h3>
              <p className="text-xs text-[#5A5852] font-sans leading-relaxed">
                Submit an inquiry with a reference image, SKU, or retailer link. Specify desired sizing, target budget, and delivery timeframe. This initiates private scouting without binding purchase commitments.
              </p>
            </div>
            <div className="pt-6 border-t border-[#E5E3DC] text-[11px] font-mono text-[#5A5852] flex items-center justify-between">
              <span>Non-Binding Inquiry</span>
              <span>4-Step Intake</span>
            </div>
          </div>

          {/* Stage 02 */}
          <div className="bg-[#FAF9F5] p-8 sm:p-10 space-y-6 flex flex-col justify-between hover:bg-white transition-colors">
            <div className="space-y-4">
              <span className="font-serif text-2xl text-[#8A8880] block font-light">Stage 02</span>
              <h3 className="font-serif text-2xl font-normal text-[#121212]">
                Itemized 48-Hour Quote
              </h3>
              <p className="text-xs text-[#5A5852] font-sans leading-relaxed">
                Our specialists verify stock with authorized stockists. We generate an itemized quote detailing the exact acquisition cost, our 12% concierge fee, insured courier shipping, and sales tax with 48 hours of price protection.
              </p>
            </div>
            <div className="pt-6 border-t border-[#E5E3DC] text-[11px] font-mono text-[#5A5852] flex items-center justify-between">
              <span>12% Transparent Fee</span>
              <span>48h Price Hold</span>
            </div>
          </div>

          {/* Stage 03 */}
          <div className="bg-[#FAF9F5] p-8 sm:p-10 space-y-6 flex flex-col justify-between hover:bg-white transition-colors">
            <div className="space-y-4">
              <span className="font-serif text-2xl text-[#8A8880] block font-light">Stage 03</span>
              <h3 className="font-serif text-2xl font-normal text-[#121212]">
                Physical Verification & Handover
              </h3>
              <p className="text-xs text-[#5A5852] font-sans leading-relaxed">
                Upon quote sign-off, we procure the piece. It is shipped to our Manhattan office for in-person physical authentication, label and stitching checks, and careful repackaging before insured courier transit with adult signature.
              </p>
            </div>
            <div className="pt-6 border-t border-[#E5E3DC] text-[11px] font-mono text-[#5A5852] flex items-center justify-between">
              <span>Manhattan Intake</span>
              <span>Direct Adult Signature</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED SOURCING CATEGORIES */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto border-b border-[#E5E3DC]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-3">
            <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
              Curated Classifications
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#121212]">
              Eligible product categories.
            </h2>
          </div>
          <Link
            href="/policies"
            className="btn-text-editorial text-xs"
          >
            Review Domestic Pilot Scope &rarr;
          </Link>
        </div>

        <div className="space-y-16">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center p-6 sm:p-10 bg-white border border-[#E5E3DC] rounded-[1px] shadow-sm ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Showcase (5 cols) */}
              <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#F3F2EC] border border-[#E5E3DC]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover grayscale contrast-[1.04] hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white/95 text-[10px] font-mono text-[#5A5852] tracking-wider uppercase border border-[#E5E3DC]">
                    {cat.caption}
                  </div>
                </div>
              </div>

              {/* Text & Specification (7 cols) */}
              <div className={`lg:col-span-7 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5A5852] font-semibold">
                      {cat.tag}
                    </span>
                    <span className="text-xs text-[#E5E3DC]">&bull;</span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                      Active Pilot Category
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#121212]">
                    {cat.title}
                  </h3>
                </div>

                <p className="text-sm text-[#5A5852] font-sans leading-relaxed">
                  {cat.description}
                </p>

                {/* Example Brands */}
                <div className="space-y-2 pt-2 border-t border-[#E5E3DC]">
                  <span className="text-[11px] font-mono text-[#5A5852] uppercase tracking-wider block">
                    Frequently Requested Brands & Silhouettes:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cat.examples.map((ex, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono bg-[#F3F2EC] border border-[#E5E3DC] text-[#121212] px-3 py-1"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs text-[#5A5852] italic font-serif">
                    {cat.curatorNote}
                  </p>
                  <Link
                    href={`/request?category=${cat.title.toLowerCase().replace(/ /g, '-')}`}
                    className="btn-noir px-5 py-2.5 text-xs shrink-0 self-start sm:self-auto"
                  >
                    Request Item &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRANSPARENT ITEMIZATION DEMO */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto border-b border-[#E5E3DC]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
              Cost Transparency
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#121212] leading-tight">
              Anatomy of a Veritas quotation.
            </h2>
            <p className="text-sm text-[#5A5852] leading-relaxed font-sans">
              Unlike secondary marketplaces that apply opaque algorithmic markups, our quotations are itemized to the cent. Every quotation includes the genuine boutique acquisition price, our disclosed 12% fee, insured courier shipping, and estimated local sales taxes.
            </p>
            <ul className="space-y-3 text-xs font-sans text-[#5A5852]">
              <li className="flex items-center gap-2">
                <IconCheckCircle className="w-4 h-4 text-[#121212]" /> Disclosed 12% concierge procurement fee
              </li>
              <li className="flex items-center gap-2">
                <IconCheckCircle className="w-4 h-4 text-[#121212]" /> Direct boutique acquisition price passed through without markup
              </li>
              <li className="flex items-center gap-2">
                <IconCheckCircle className="w-4 h-4 text-[#121212]" /> Insured domestic transit with adult signature delivery
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E5E3DC] p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#5A5852] uppercase tracking-widest block">
                    Sample Client Appraisal
                  </span>
                  <div className="font-serif text-xl font-normal text-[#121212]">
                    Ref: QTE-2026-8801 &bull; Travis Scott x Jordan 1 Low
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-[#F3F2EC] border border-[#E5E3DC] text-[#121212] px-2.5 py-1 uppercase tracking-wider">
                  48-Hour Rate Hold
                </span>
              </div>

              {/* Itemized Table */}
              <div className="divide-y divide-[#E5E3DC] font-mono text-xs">
                <div className="py-2.5 flex items-center justify-between text-[#5A5852]">
                  <span>Direct Boutique Acquisition (Authorized European Stockist)</span>
                  <span className="font-medium text-[#121212]">$520.00 USD</span>
                </div>
                <div className="py-2.5 flex items-center justify-between text-[#5A5852]">
                  <span>Concierge Procurement Commission (12.0%)</span>
                  <span className="font-medium text-[#121212]">$62.40 USD</span>
                </div>
                <div className="py-2.5 flex items-center justify-between text-[#5A5852]">
                  <span>Priority Insured Courier (Direct Adult Signature)</span>
                  <span className="font-medium text-[#121212]">$20.00 USD</span>
                </div>
                <div className="py-2.5 flex items-center justify-between text-[#5A5852]">
                  <span>Estimated State Sales Tax (Mainland US 8.875%)</span>
                  <span className="font-medium text-[#121212]">$38.60 USD</span>
                </div>
                <div className="py-4 flex items-center justify-between text-base border-t-2 border-[#121212]">
                  <span className="font-serif font-normal text-[#121212] uppercase tracking-wider">
                    Total Binding Quote
                  </span>
                  <span className="font-serif text-2xl font-light text-[#121212]">
                    $641.00 USD
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#F3F2EC] border border-[#E5E3DC] text-[11px] text-[#5A5852] font-mono flex items-center gap-2">
                <IconShield className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Protected by the Veritas 100% Authenticity Guarantee. Rejected items refunded in full.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
            Inquiries & Information
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#121212]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5852] font-sans">
            Transparent policies governing our US mainland domestic pilot.
          </p>
        </div>

        <div className="divide-y divide-[#E5E3DC] border-y border-[#E5E3DC]">
          {faqs.map((faq, index) => (
            <div key={index} className="py-8 space-y-3 text-left">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#121212]">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-[#5A5852] leading-relaxed font-sans">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 p-8 sm:p-12 bg-white border border-[#E5E3DC] text-center space-y-6 shadow-sm rounded-[1px]">
          <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212]">
            Private Desk Active &bull; US Domestic Pilot
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#121212]">
            Seeking an archival or sold-out runway piece?
          </h3>
          <p className="text-xs sm:text-sm text-[#5A5852] max-w-lg mx-auto font-sans leading-relaxed">
            Our personal shoppers review requests within 24 hours. Submit a photograph or reference link to initiate a search.
          </p>
          <div className="pt-2">
            <Link
              href="/request"
              className="btn-noir inline-flex items-center gap-3 px-8 py-4 text-xs group"
            >
              <span>Submit Sourcing Inquiry</span>
              <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
