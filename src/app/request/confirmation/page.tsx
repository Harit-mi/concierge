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
    <div className="py-16 md:py-28 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-10 text-[#121212]">
      {/* Top Header */}
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-[#121212] text-[#FAF9F5] flex items-center justify-center mx-auto shadow-sm">
          <IconShield className="w-6 h-6" />
        </div>
        <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
          Inquiry Logged &bull; Private Desk
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-[#121212]">
          Sourcing Request Received
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5852] font-sans max-w-md mx-auto leading-relaxed">
          Your procurement inquiry has been assigned to our Manhattan sourcing desk for stock availability and supplier verification.
        </p>
      </div>

      {/* Main Confirmation Card */}
      <div className="bg-white border border-[#E5E3DC] p-6 sm:p-10 space-y-8 shadow-sm rounded-[1px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E3DC] gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#5A5852]">
              Commission Reference
            </span>
            <div className="font-mono text-2xl font-medium text-[#121212] mt-1 tracking-wider">
              {refNumber}
            </div>
          </div>
          <span className="self-start sm:self-center bg-[#F3F2EC] text-[#121212] border border-[#E5E3DC] font-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1 font-medium">
            Status: Inquiry Under Review
          </span>
        </div>

        {/* Response SLA */}
        <div className="bg-[#F3F2EC] p-5 border border-[#E5E3DC] flex items-start gap-3.5 text-xs font-sans">
          <IconClock className="w-4 h-4 text-[#121212] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-medium text-[#121212] uppercase tracking-wider text-[11px] block">
              Scouting Response SLA: 24 Hours
            </span>
            <p className="text-[#5A5852] leading-relaxed text-xs">
              Our specialists are confirming physical condition with authorized boutique stockists, verifying provenance records, and calculating insured domestic courier transit.
            </p>
          </div>
        </div>

        {/* Non-Binding Notice */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs font-sans text-amber-950">
          <IconAlert className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-medium uppercase tracking-wider text-[11px] block text-amber-900">
              Non-Binding Inquiry (Zero Charge Commitment)
            </span>
            <p className="leading-relaxed text-xs text-amber-800">
              This submission initiates private research. It does not place a hold on your card or obligate you to purchase. An itemized quote will be sent to your client desk with 48 hours to approve or decline.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 text-xs">
          <Link
            href="/dashboard"
            className="btn-noir w-full py-4 flex items-center justify-center gap-2.5 group"
          >
            <span>View In Client Portal</span>
            <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/request"
            className="btn-outline w-full py-4 text-center"
          >
            Submit Another Request
          </Link>
        </div>
      </div>

      {/* Assurance Footer */}
      <div className="text-center text-xs font-sans text-[#5A5852] space-y-1">
        <p>Mainland US Domestic Pilot &bull; Manhattan Sourcing Desk</p>
        <p className="text-[#8A8880]">Inquiries reviewed Monday – Friday 09:00 – 19:00 EST</p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center font-mono text-xs text-[#5A5852]">Loading Inquiry Confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
