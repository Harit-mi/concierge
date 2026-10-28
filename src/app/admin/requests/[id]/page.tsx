'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  IconArrowLeft,
  IconReceipt,
  IconUserCheck,
  IconCheckCircle,
  IconClose,
  IconAlert,
  IconChat,
  IconFileText,
  IconClock,
  IconShield,
  IconExternalLink,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';
import { fetchRequestByIdAdapter } from '@/lib/api-adapter';

export default function AdminRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newAdminNote, setNewAdminNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetchRequestByIdAdapter(requestId);
      setData(res);
      setLoading(false);
    }
    load();
  }, [requestId]);

  const handleUpdateStatus = async (newStatus: string, reason?: string) => {
    setUpdating(true);
    setStatusMessage('');
    try {
      await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          rejectionReason: reason,
          note: newAdminNote || undefined,
        }),
      }).catch(() => {});

      setStatusMessage(`Status transitioned to ${newStatus}.`);
      setShowRejectBox(false);
    } catch (err: any) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="py-24 text-center font-mono text-xs text-[#717584]">
        Loading inquiry dossier...
      </div>
    );
  }

  const { request, quote, order } = data;

  return (
    <div className="space-y-8 text-[#141519]">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/requests"
          className="text-xs font-mono uppercase tracking-wider text-[#717584] hover:text-[#141519] flex items-center gap-1.5"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Inquiries Queue</span>
        </Link>
        <span className="text-[10.5px] font-mono text-[#717584]">
          Ref: {request.referenceNumber}
        </span>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-sm text-xs font-mono flex items-center gap-2">
          <IconCheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Dossier Header */}
      <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F2EDE4] gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A603D] font-bold block mb-1">
              Sourcing Feasibility Dossier
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141519]">
              {request.productName}
            </h1>
            <p className="text-xs font-mono text-[#5C5F6D] mt-0.5">
              Brand: <strong className="text-[#141519]">{request.brand}</strong> &bull; Category: {request.category}
            </p>
          </div>
          <StatusBadge status={request.status as any} size="md" />
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-2">
          <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
            <span className="text-[10px] text-[#717584] block">Requested Sizing</span>
            <span className="font-bold text-[#141519]">{request.sizeVariant}</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
            <span className="text-[10px] text-[#717584] block">Colorway</span>
            <span className="font-bold text-[#141519]">{request.colorVariant || 'Standard'}</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
            <span className="text-[10px] text-[#717584] block">Quantity</span>
            <span className="font-bold text-[#141519]">{request.quantity} Unit(s)</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
            <span className="text-[10px] text-[#717584] block">Client Target Budget</span>
            <span className="font-bold text-[#141519]">
              {request.maxBudgetMajor ? `$${request.maxBudgetMajor} USD` : 'Market rate'}
            </span>
          </div>
        </div>

        {/* Product Media & Reference */}
        <div className="pt-2 flex flex-col sm:flex-row gap-5 items-start">
          {request.imageUrl && (
            <div className="w-32 h-32 rounded-xs bg-[#FAF8F5] border border-[#E2DDD2] overflow-hidden shrink-0">
              <img src={request.imageUrl} alt={request.productName} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-2 text-xs font-sans flex-1">
            <h4 className="font-mono text-xs font-bold text-[#141519] uppercase tracking-wider">
              Destination Coordinates:
            </h4>
            <p className="text-[#5C5F6D]">
              Domestic US Postal Code: <strong>{request.destinationPostalCode} (Mainland Pilot Verified)</strong>
            </p>
            {request.productUrl && (
              <p className="text-[#7A603D] font-mono break-all flex items-center gap-1">
                <span>Reference URL: </span>
                <a href={request.productUrl} target="_blank" rel="noreferrer" className="underline hover:text-[#141519] flex items-center gap-1">
                  <span>{request.productUrl}</span>
                  <IconExternalLink className="w-3 h-3" />
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Operator Actions Ribbon */}
      <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#D8C3A4] space-y-5 shadow-xs">
        <div className="border-b border-[#F2EDE4] pb-3 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#141519]">
            Inquiry Eligibility & State Decision
          </h3>
          <span className="text-[10px] font-mono text-[#7A603D] uppercase font-bold">
            Assigned Officer: Julian Thorne
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <Link
            href={`/admin/quotes?requestId=${request.id}`}
            className="btn-bronze px-5 py-2.5 rounded-sm uppercase tracking-wider font-semibold shadow-xs flex items-center gap-2"
          >
            <IconReceipt className="w-4 h-4" />
            <span>Launch Quote Builder</span>
          </Link>

          <button
            type="button"
            onClick={() => handleUpdateStatus('UNDER_REVIEW')}
            className="btn-softblack px-4 py-2.5 rounded-sm uppercase tracking-wider font-semibold"
          >
            Mark Under Review
          </button>

          <button
            type="button"
            onClick={() => setShowRejectBox(true)}
            className="btn-ivory-outline px-4 py-2.5 rounded-sm uppercase tracking-wider font-semibold text-rose-800 hover:border-rose-400"
          >
            Decline / Reject Inquiry
          </button>
        </div>

        {showRejectBox && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-sm space-y-3 font-mono text-xs">
            <span className="font-bold text-rose-950 uppercase block">Record Reason for Declining:</span>
            <input
              type="text"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Sourcing discontinued, seller grading counterfeit risk, or out of stock..."
              className="ivory-input w-full p-2.5 rounded-sm text-xs"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowRejectBox(false)}
                className="btn-ivory-outline px-3 py-1.5 rounded-xs text-[11px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('REJECTED', rejectionReason)}
                className="bg-rose-900 text-white px-4 py-1.5 rounded-xs text-[11px] font-semibold uppercase"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
