import React from 'react';
import Link from 'next/link';
import { IconShield, IconLock, IconPackage } from '@/components/icons/FlaticonIcons';

export function Footer() {
  return (
    <footer className="bg-[#FAF9F5] text-[#5A5852] pt-20 pb-16 border-t border-[#E5E3DC] text-xs font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-16 border-b border-[#E5E3DC]">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#121212]">
              <IconShield className="w-4 h-4 text-[#121212]" />
              <span className="font-sans font-medium text-xs tracking-[0.16em] uppercase text-[#121212]">
                Guaranteed Authenticity
              </span>
            </div>
            <p className="text-[12px] text-[#5A5852] leading-relaxed">
              Every acquired piece is physically inspected by our specialists in Manhattan before client dispatch. 100% money-back authenticity guarantee.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#121212]">
              <IconLock className="w-4 h-4 text-[#121212]" />
              <span className="font-sans font-medium text-xs tracking-[0.16em] uppercase text-[#121212]">
                Disclosed 12% Fee
              </span>
            </div>
            <p className="text-[12px] text-[#5A5852] leading-relaxed">
              Zero opaque markups. Direct boutique acquisition price, disclosed 12% concierge commission, insured transit, and sales taxes are itemized prior to approval.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#121212]">
              <IconPackage className="w-4 h-4 text-[#121212]" />
              <span className="font-sans font-medium text-xs tracking-[0.16em] uppercase text-[#121212]">
                White-Glove Delivery
              </span>
            </div>
            <p className="text-[12px] text-[#5A5852] leading-relaxed">
              Dispatched via priority domestic courier in archival packaging with mandatory direct adult signature across all 48 contiguous United States.
            </p>
          </div>
        </div>

        {/* Navigation & Directory */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16 border-b border-[#E5E3DC]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg tracking-[0.25em] uppercase font-light text-[#121212]">
                VERITAS
              </span>
            </div>
            <p className="text-xs text-[#5A5852] leading-relaxed">
              Private personal shopping concierge for authentic designer apparel, archival footwear, and luxury leather goods.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono text-[#5A5852] bg-[#F3F2EC] border border-[#E5E3DC] px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>US Mainland Domestic Pilot</span>
              </span>
            </div>
          </div>

          <div>
            <h5 className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#121212] mb-4 font-semibold">
              Concierge Services
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/request" className="text-[#5A5852] hover:text-[#121212] transition-colors">
                  Submit Sourcing Request
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[#5A5852] hover:text-[#121212] transition-colors">
                  The Sourcing Process
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#5A5852] hover:text-[#121212] transition-colors">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link href="/messages" className="text-[#5A5852] hover:text-[#121212] transition-colors">
                  Private Desk Chat
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#121212] mb-4 font-semibold">
              Standards & Policies
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/policies" className="text-[#5A5852] hover:text-[#121212] transition-colors">
                  Authenticity Verification
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-[#5A5852] hover:text-[#121212] transition-colors">
                  Domestic US Boundaries
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-[#5A5852] hover:text-[#121212] transition-colors">
                  Transparent Pricing & Escrow
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-[#5A5852] hover:text-[#121212] transition-colors">
                  Eligible & Prohibited Goods
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#121212] mb-4 font-semibold">
              Private Desk
            </h5>
            <div className="space-y-2 text-xs font-mono text-[#5A5852]">
              <p>Monday – Friday: 09:00 – 19:00 EST</p>
              <p>Saturday: 10:00 – 16:00 EST</p>
              <p className="text-[11px] text-[#121212] pt-2">
                Manhattan Intake Hub • New York, NY
              </p>
              <p className="text-[11px] text-[#5A5852]">
                concierge@veritas-luxury.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Colophon */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8A8880] font-sans">
          <div>
            &copy; {new Date().getFullYear()} Veritas Luxury Concierge. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-center">
            <span>SECURE ESCROW</span>
            <span>&bull;</span>
            <span>100% PROVENANCE GUARANTEE</span>
            <span>&bull;</span>
            <span>CONCIERGE PILOT V2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
