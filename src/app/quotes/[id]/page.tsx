'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  IconReceipt,
  IconClock,
  IconCheckCircle,
  IconAlert,
  IconArrowRight,
  IconArrowLeft,
  IconShield,
  IconPackage,
  IconTruck,
  IconClose,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';
import { fetchRequestByIdAdapter } from '@/lib/api-adapter';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [acceptedSuccess, setAcceptedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchRequestByIdAdapter(id);
      setData(res);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleConfirmAccept = async () => {
    setProcessing(true);
    try {
      await fetch(`/api/quotes/${id}/accept`, { method: 'POST' }).catch(() => {});
      setAcceptedSuccess(true);
      setShowAcceptModal(false);
      setTimeout(() => {
        router.push(`/orders/${data?.order?.id || 'ord-travis-01'}`);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmDecline = async () => {
    setProcessing(true);
    try {
      await fetch(`/api/quotes/${id}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: declineReason }),
      }).catch(() => {});
      setShowDeclineModal(false);
      router.push('/dashboard/requests');
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="py-24 text-center font-mono text-xs text-[#846337]">
        Loading appraisal quotation...
      </div>
    );
  }

  const { request, quote, order } = data;
  const quoteData = quote || {
    id: id,
    quoteNumber: 'QTE-2026-9041',
    productPriceMinor: 52000,
    sourcingFeeMinor: 6240,
    shippingFeeMinor: 2000,
    applicableTaxesMinor: 3860,
    disclosedChargesMinor: 0,
    discountMinor: 0,
    totalPayableMinor: 64100,
    currency: 'USD',
    status: 'QUOTE_SENT',
    expiresAt: '2026-11-01T23:59:59Z',
    expectedFulfilmentEstimate: '5-8 business days following payment clearance',
    notesAndAssumptions:
      'Verified deadstock condition acquired from authorized retail network in original factory packaging with provenance tag.',
  };

  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-[#121212]">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-3">
        <Link
          href={`/requests/${request.id}`}
          className="text-xs font-mono uppercase tracking-[0.16em] text-[#5A5852] hover:text-[#121212] flex items-center gap-2"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Request</span>
        </Link>
        <span className="text-[10px] font-mono text-[#5A5852] uppercase tracking-widest">
          Quote Ref: {quoteData.quoteNumber}
        </span>
      </div>

      {/* Main Quote Card */}
      <div className="bg-white border border-[#E5E3DC] p-8 sm:p-12 shadow-sm space-y-10 rounded-[1px]">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-[#E5E3DC] gap-4">
          <div className="space-y-2">
            <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
              Confirmed Quotation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#121212]">
              {request.productName}
            </h1>
            <p className="text-xs font-mono text-[#5A5852]">
              Brand: <strong className="text-[#121212] font-semibold">{request.brand}</strong> &bull; Sizing: <strong className="text-[#121212] font-semibold">{request.sizeVariant}</strong> &bull; Qty: {request.quantity}
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5A5852] block">
              Rate Protection
            </span>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-blue-900 bg-blue-50 px-3 py-1 border border-blue-200 mt-1">
              <IconClock className="w-3.5 h-3.5 text-blue-700" />
              <span>Valid 48 Hours</span>
            </div>
          </div>
        </div>

        {/* Itemized Financial Breakdown Table */}
        <div className="space-y-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5A5852] font-medium">
            Itemized Actuarial Ledger (USD):
          </div>

          <div className="bg-[#F3F2EC] p-6 border border-[#E5E3DC] divide-y divide-[#E5E3DC] text-xs font-mono rounded-[1px]">
            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="text-[#121212] font-semibold block">1. Direct Boutique Acquisition Cost</span>
                <span className="text-[11px] text-[#5A5852]">Direct verified supplier price without markup</span>
              </div>
              <span className="text-sm font-semibold text-[#121212]">
                {formatMoney(quoteData.productPriceMinor)}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="text-[#121212] font-semibold block">2. Veritas Concierge Procurement Commission (12%)</span>
                <span className="text-[11px] text-[#5A5852]">Stockist scouting, provenance verification & Manhattan intake inspection</span>
              </div>
              <span className="text-sm font-semibold text-[#121212]">
                {formatMoney(quoteData.sourcingFeeMinor)}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="text-[#121212] font-semibold block">3. Insured Priority Courier Transit</span>
                <span className="text-[11px] text-[#5A5852]">Declared-value transit insurance & mandatory direct adult signature</span>
              </div>
              <span className="text-sm font-semibold text-[#121212]">
                {formatMoney(quoteData.shippingFeeMinor)}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="text-[#121212] font-semibold block">4. Statutory State & Local Taxes</span>
                <span className="text-[11px] text-[#5A5852]">Estimated jurisdiction destination sales tax (ZIP {request.destinationPostalCode})</span>
              </div>
              <span className="text-sm font-semibold text-[#121212]">
                {formatMoney(quoteData.applicableTaxesMinor)}
              </span>
            </div>

            {/* Total Row */}
            <div className="pt-6 flex justify-between items-center">
              <div>
                <span className="font-serif text-xl font-normal text-[#121212] block uppercase tracking-wider">
                  Total Confirmed Amount
                </span>
                <span className="text-[10px] text-[#5A5852] uppercase font-mono tracking-widest">
                  United States Dollar (USD) &bull; Zero Hidden Fees
                </span>
              </div>
              <span className="font-serif text-3xl font-light text-[#121212]">
                {formatMoney(quoteData.totalPayableMinor)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Sourcing & Fulfilment Assumptions */}
        <div className="p-5 bg-[#F3F2EC] border border-[#E5E3DC] space-y-2 text-xs font-sans text-[#5A5852] rounded-[1px]">
          <h4 className="font-mono text-xs font-medium text-[#121212] uppercase tracking-wider flex items-center gap-1.5">
            <IconShield className="w-4 h-4 text-emerald-700" />
            <span>Condition Assumptions & Authenticity Guarantee:</span>
          </h4>
          <p className="leading-relaxed">
            {quoteData.notesAndAssumptions}
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-[10.5px] font-mono text-[#5A5852] border-t border-[#E5E3DC]">
            <span>&bull; Fulfillment Window: {quoteData.expectedFulfilmentEstimate}</span>
            <span>&bull; Domestic Scope: Mainland US Destination Only</span>
          </div>
        </div>

        {/* Success Alert if accepted */}
        {acceptedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 text-xs font-sans flex items-center gap-3">
            <IconCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold font-mono uppercase">Quote Accepted Successfully</span>
              <p>Transferring to secure fulfillment...</p>
            </div>
          </div>
        )}

        {/* Action Buttons: Accept / Decline */}
        {!acceptedSuccess && (
          <div className="pt-6 border-t border-[#E5E3DC] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <button
              type="button"
              onClick={() => setShowDeclineModal(true)}
              className="text-[#5A5852] hover:text-rose-700 underline underline-offset-4 tracking-[0.16em] uppercase text-[11px] order-2 sm:order-1"
            >
              Decline This Quote
            </button>

            <button
              type="button"
              onClick={() => setShowAcceptModal(true)}
              className="btn-noir w-full sm:w-auto px-9 py-4 flex items-center justify-center gap-2.5 order-1 sm:order-2 group"
            >
              <span>Accept & Proceed to Order</span>
              <IconArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* CONFIRMATION MODAL BEFORE ACCEPTING */}
      {showAcceptModal && (
        <div className="fixed inset-0 z-50 bg-[#121212]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-8 sm:p-10 space-y-6 shadow-xl border border-[#E5E3DC] rounded-[1px]">
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 bg-[#121212] text-[#FAF9F5] flex items-center justify-center mx-auto shadow-sm">
                <IconShield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#121212]">
                Confirm Quote Acceptance
              </h3>
              <p className="text-xs text-[#5A5852] font-sans">
                You are about to authorize the bespoke acquisition of:
              </p>
            </div>

            <div className="p-5 bg-[#F3F2EC] border border-[#E5E3DC] font-mono text-xs space-y-2 text-center rounded-[1px]">
              <div className="font-medium text-[#121212] text-sm">{request.productName}</div>
              <div className="text-[11px] text-[#5A5852]">Sizing: {request.sizeVariant} &bull; Quantity: {request.quantity}</div>
              <div className="font-serif text-2xl text-[#121212] pt-1">
                {formatMoney(quoteData.totalPayableMinor)} USD
              </div>
            </div>

            <p className="text-xs text-[#5A5852] font-sans leading-relaxed text-center">
              Accepting locks the 48-hour quote rate and instructs our procurement team to secure the piece from verified stockists.
            </p>

            <div className="flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => setShowAcceptModal(false)}
                className="btn-outline flex-1 py-3.5"
              >
                Review Again
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={handleConfirmAccept}
                className="btn-noir flex-1 py-3.5"
              >
                {processing ? 'Confirming...' : 'Yes, Accept Quote'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DECLINE REASON MODAL */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 bg-[#121212]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-8 sm:p-10 space-y-6 shadow-xl border border-[#E5E3DC] rounded-[1px]">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-normal text-[#121212]">
                Decline Quote
              </h3>
              <p className="text-xs text-[#5A5852] font-sans">
                Kindly notify us of your feedback so our sourcing team can explore alternative options or close the inquiry.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-[#121212] font-medium block">
                Reason for Declining (Optional)
              </label>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Budget adjustment, acquired elsewhere, or sizing revision..."
                className="editorial-input w-full p-3 text-xs font-sans"
              />
            </div>

            <div className="flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => setShowDeclineModal(false)}
                className="btn-outline flex-1 py-3"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={handleConfirmDecline}
                className="bg-rose-900 text-white hover:bg-rose-950 flex-1 py-3 font-sans text-xs tracking-wider uppercase transition-all rounded-[1px]"
              >
                {processing ? 'Processing...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}