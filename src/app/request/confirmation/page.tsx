'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  IconCheckCircle,
  IconClock,
  IconArrowRight,
  IconShield,
  IconAlert,
} from '@/components/icons/FlaticonIcons';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const refNumber = searchParams.get('ref') || 'REQ-2026-9041';
  const requestId = searchParams.get('id') || 'req-travis-01';

  return (
    <div className="py-16 md:py-28 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-10 text-[#111215]">
      {/* Top Beacon Badge */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-[#111215] border-2 border-[#C4A575] text-[#C4A575] flex items-center justify-center mx-auto shadow-luxury">
          <IconShield className="w-8 h-8" />
        </div>
        <span className="ledger-stamp">COMMISSION LOGGED IN REPOSITORY</span>
        <h1 className="font-display text-4xl sm:text-5xl font-light tracking-tight text-[#111215]">
          Sourcing Inquiry Received
        </h1>
        <p className="text-xs sm:text-sm text-[#575A6B] font-mono max-w-md mx-auto leading-relaxed">
          Your procurement inquiry has been assigned to our Manhattan intake desk for feasibility scouting and supplier vetting.
        </p>
      </div>

      {/* Main Confirmation Dossier Card */}
      <div className="luxury-card p-6 sm:p-10 space-y-8 bg-white border border-[#E3D8CB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E3D8CB] gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#846337]">
              COMMISSION REFERENCE
            </span>
            <div className="font-mono text-2xl font-bold text-[#111215] mt-1 tracking-wider">
              {refNumber}
            </div>
          </div>
          <span className="self-start sm:self-center bg-[#F4EFEA] text-[#846337] border border-[#C4A575] font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-1 font-semibold">
            Status: Inquiry Logged
          </span>
        </div>

        {/* Expected Response SLA */}
        <div className="dossier-paper p-5 border border-[#E3D8CB] flex items-start gap-3.5 text-xs font-mono">
          <IconClock className="w-4 h-4 text-[#846337] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#111215] uppercase tracking-wider block">
              Feasibility Scouting SLA: 24 Hours
            </span>
            <p className="text-[#575A6B] leading-relaxed text-[11.5px] font-sans">
              Our officers are currently verifying physical stock condition across vetted boutique consignors, screening seller provenance, and calculating exact insured domestic courier charges.
            </p>
          </div>
        </div>

        {/* Explicit Warning: Not a Purchase */}
        <div className="p-4 bg-amber-50/60 border border-amber-200/80 flex items-start gap-3 text-xs font-mono text-amber-950">
          <IconAlert className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-[10.5px] block">
              Inquiry Is Non-Binding (Zero Purchase Commitment)
            </span>
            <p className="leading-relaxed text-[11px] font-sans text-amber-900">
              This submission initiates private research. It does not place a hold on your card or obligate you to purchase. An itemized appraisal quotation will be published to your client desk. You have 48 hours to approve or decline.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 text-xs">
          <Link
            href="/dashboard"
            className="btn-obsidian w-full py-4 flex items-center justify-center gap-2.5 shadow-luxury group"
          >
            <span>View In Client Desk</span>
            <IconArrowRight className="w-3.5 h-3.5 text-[#C4A575] group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <Link
            href="/request"
            className="btn-luxury-outline w-full py-4 text-center"
          >
            Commission Another Search
          </Link>
        </div>
      </div>

      {/* Assurance Footer */}
      <div className="text-center text-[11px] font-mono text-[#575A6B] space-y-1">
        <p>Mainland US Domestic Pilot Charter &bull; Manhattan Intake Facility</p>
        <p className="text-[#846337]">Inquiries are monitored 09:00 &ndash; 19:00 EST</p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center font-mono text-xs text-[#846337]">Loading Inquiry Dossier...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}