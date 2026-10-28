'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  IconCheckCircle,
  IconClock,
  IconArrowRight,
  IconShield,
  IconFileText,
  IconAlert,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';

export default function RequestSubmittedPage() {
  const params = useParams();
  const refNumber = params.ref as string;
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/requests/${refNumber}`);
        if (res.ok) {
          const data = await res.json();
          setRequestData(data.request);
        }
      } catch (err) {
        console.error('Failed to load request summary', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [refNumber]);

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 text-[#141519]">
      <div className="ivory-card p-8 sm:p-14 text-center space-y-7 border border-[#EAE4D9] bg-white shadow-md">
        <div className="w-16 h-16 bg-[#F5EFE4] text-[#A38054] rounded-full flex items-center justify-center mx-auto border border-[#D8C3A4]">
          <IconCheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#7A603D] font-semibold block">
            Inquiry Registered
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#141519]">
            Sourcing Request Received
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5F6D] font-sans max-w-md mx-auto leading-relaxed">
            Your inquiry has been cataloged in our intake ledger and assigned to a sourcing officer.
          </p>
        </div>

        {/* Reference ID Pill */}
        <div className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#E2DDD2] px-4 py-2 rounded-sm text-xs font-mono">
          <span className="text-[#717584]">Reference ID:</span>
          <span className="text-[#141519] font-bold tracking-wider">{refNumber}</span>
        </div>

        {/* Request Data Summary if loaded */}
        {requestData && (
          <div className="max-w-md mx-auto bg-[#FAF8F5] p-5 rounded-sm border border-[#EAE4D9] text-left space-y-2.5 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-[#EAE4D9] pb-2">
              <span className="text-[#717584]">Item:</span>
              <span className="font-semibold text-[#141519] text-right truncate max-w-[200px]">
                {requestData.productName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#717584]">Brand:</span>
              <span className="text-[#141519] font-semibold">{requestData.brand}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#717584]">Current Status:</span>
              <StatusBadge status={requestData.status} size="sm" />
            </div>
          </div>
        )}

        {/* SLA Notice */}
        <div className="max-w-lg mx-auto bg-amber-50/70 border border-amber-200/80 p-4 rounded-sm text-xs font-sans text-amber-950 flex items-start gap-3 text-left">
          <IconClock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold font-mono uppercase tracking-wider text-[11px]">
              Expected Review SLA: Within 24 Hours
            </span>
            <p className="text-[11.5px] leading-relaxed">
              Our specialists confirm item authenticity, batch codes, and availability. We then generate an itemized quote with all costs disclosed before you commit.
            </p>
          </div>
        </div>

        {/* CTA Controls */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
          <Link
            href="/dashboard"
            className="btn-softblack w-full sm:w-auto px-7 py-3.5 rounded-sm uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
          >
            <span>Go to Customer Dashboard</span>
            <IconArrowRight className="w-4 h-4 text-[#DFCCA8]" />
          </Link>
          <Link
            href="/request"
            className="btn-ivory-outline w-full sm:w-auto px-6 py-3.5 rounded-sm uppercase tracking-wider font-semibold text-center"
          >
            Submit Another Request
          </Link>
        </div>
      </div>
    </div>
  );
}
