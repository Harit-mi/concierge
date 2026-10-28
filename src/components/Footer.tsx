import React from 'react';
import Link from 'next/link';
import { IconShield, IconLock, IconPackage, IconShoppingBag } from '@/components/icons/FlaticonIcons';

export function Footer() {
  return (
    <footer className="bg-[#FAF7F2] text-[#575A6B] pt-20 pb-16 border-t border-[#E3D8CB] text-xs font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-16 border-b border-[#E3D8CB]">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#846337]">
              <IconShield className="w-4 h-4" />
              <span className="font-display font-bold text-sm tracking-wider uppercase text-[#111215]">
                Forensic Verification
              </span>
            </div>
            <p className="text-[11.5px] text-[#575A6B] leading-relaxed font-sans">
              Every acquired garment, footwear silhouette, or leather piece passes physical optical verification, stitch-density scrutiny, and UV glue luminescence at our Manhattan intake hub.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#846337]">
              <IconLock className="w-4 h-4" />
              <span className="font-display font-bold text-sm tracking-wider uppercase text-[#111215]">
                Transparent Gilt Ledger
              </span>
            </div>
            <p className="text-[11.5px] text-[#575A6B] leading-relaxed font-sans">
              Zero opaque markups. Acquisition cost, transparent 12% concierge commission, insured priority transit, and local sales taxes are itemized prior to client authorization.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#846337]">
              <IconPackage className="w-4 h-4" />
              <span className="font-display font-bold text-sm tracking-wider uppercase text-[#111215]">
                White-Glove Handover
              </span>
            </div>
            <p className="text-[11.5px] text-[#575A6B] leading-relaxed font-sans">
              Direct hand-off to insured priority carriers with archival packaging and mandatory direct adult signature delivery across all 48 contiguous United States.
            </p>
          </div>
        </div>

        {/* Navigation & Policies */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16 border-b border-[#E3D8CB]">
          <div className="space-y-4 font-sans">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#111215] text-[#C4A575] font-display text-xs flex items-center justify-center font-bold">
                V
              </div>
              <span className="font-display tracking-[0.25em] uppercase font-medium text-[#111215] text-base">
                VERITAS
              </span>
            </div>
            <p className="text-xs text-[#575A6B] leading-relaxed">
              Private client personal shopping concierge for authentic designer apparel, collectible footwear, and non-regulated fashion leather goods.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono text-[#846337] bg-[#F4EFEA] border border-[#E3D8CB] px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#846337]" />
                <span>Domestic Pilot Phase (Mainland US Only)</span>
              </span>
            </div>
          </div>

          <div>
            <h5 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#846337] mb-4 font-semibold">
              Client Operations
            </h5>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/request" className="text-[#575A6B] hover:text-[#111215] transition-colors">
                  &rarr; Initiate Sourcing Commission
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[#575A6B] hover:text-[#111215] transition-colors">
                  &rarr; The Concierge Protocol
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#575A6B] hover:text-[#111215] transition-colors">
                  &rarr; Client Portfolio & Ledger
                </Link>
              </li>
              <li>
                <Link href="/messages" className="text-[#575A6B] hover:text-[#111215] transition-colors">
                  &rarr; Private Concierge Desk
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#846337] mb-4 font-semibold">
              Governance & Policies
            </h5>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/policies" className="text-[#575A6B] hover:text-[#111215] transition-colors">
                  &bull; Forensic Authenticity Standards
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-[#575A6B] hover:text-[#111215] transition-colors">
                  &bull; Domestic Mainland US Boundaries
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-[#575A6B] hover:text-[#111215] transition-colors">
                  &bull; Transparent Pricing & Escrow
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-[#575A6B] hover:text-[#111215] transition-colors">
                  &bull; Deactivated / Regulated Goods
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#846337] mb-4 font-semibold">
              Private Desk Hours
            </h5>
            <div className="space-y-2 text-xs font-mono text-[#575A6B]">
              <p>Monday &ndash; Friday: 09:00 &ndash; 19:00 EST</p>
              <p>Saturday: 10:00 &ndash; 16:00 EST</p>
              <p className="text-[11px] text-[#846337] pt-2">
                Manhattan Intake Hub &bull; New York, NY
              </p>
              <p className="text-[11px] text-[#846337]">
                concierge@veritas-luxury.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Colophon & Icon Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10.5px] text-[#575A6B] font-sans">
          <div>
            &copy; {new Date().getFullYear()} VERITAS LUXURY CONCIERGE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-center">
            <span>SECURE DOMESTIC ESCROW</span>
            <span>&bull;</span>
            <span>ZERO CARD PAN STORAGE</span>
            <span>&bull;</span>
            <span className="text-[#846337]">
              Iconography: Flaticon Luxury Line by Magnific & Freepik
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}