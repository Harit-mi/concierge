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
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-[#111215]">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#E3D8CB] pb-3">
        <Link
          href={`/requests/${request.id}`}
          className="text-xs font-mono uppercase tracking-[0.16em] text-[#575A6B] hover:text-[#111215] flex items-center gap-2"
        >
          <IconArrowLeft className="w-3.5 h-3.5 text-[#846337]" />
          <span>Return to Specimen Dossier</span>
        </Link>
        <span className="text-[10px] font-mono text-[#846337] uppercase tracking-widest">
          Appraisal Ref: {quoteData.quoteNumber}
        </span>
      </div>

      {/* Main Quote Card */}
      <div className="luxury-card p-8 sm:p-12 bg-white border border-[#C4A575] shadow-luxury space-y-10">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-[#E3D8CB] gap-4">
          <div className="space-y-2">
            <span className="ledger-stamp">CONFIRMED APPRAISAL SHEET</span>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-[#111215]">
              {request.productName}
            </h1>
            <p className="text-xs font-mono text-[#575A6B]">
              Fashion House: <strong className="text-[#111215] font-semibold">{request.brand}</strong> &bull; Size: <strong className="text-[#111215] font-semibold">{request.sizeVariant}</strong> &bull; Qty: {request.quantity}
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#575A6B] block">
              Rate Protection
            </span>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-900 bg-blue-50 px-3 py-1 border border-blue-200 mt-1">
              <IconClock className="w-3.5 h-3.5 text-blue-700" />
              <span>Valid 48 Hours</span>
            </div>
          </div>
        </div>

        {/* Itemized Financial Breakdown Table */}
        <div className="space-y-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#846337] font-bold">
            Itemized Actuarial Ledger (USD):
          </div>

          <div className="dossier-paper p-6 border border-[#E3D8CB] divide-y divide-[#E3D8CB] text-xs font-mono">
            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="text-[#111215] font-semibold block">1. Wholesale/Retail Acquisition Cost</span>
                <span className="text-[11px] text-[#575A6B]">Direct verified supplier price without markup</span>
              </div>
              <span className="text-sm font-semibold text-[#111215]">
                {formatMoney(quoteData.productPriceMinor)}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="text-[#111215] font-semibold block">2. Veritas Concierge Procurement Commission</span>
                <span className="text-[11px] text-[#575A6B]">Partner scouting, staff coordination & Manhattan optical forensics</span>
              </div>
              <span className="text-sm font-semibold text-[#111215]">
                {formatMoney(quoteData.sourcingFeeMinor)}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="text-[#111215] font-semibold block">3. Insured Domestic Priority Courier</span>
                <span className="text-[11px] text-[#575A6B]">Full declared-value transit insurance & mandatory adult signature</span>
              </div>
              <span className="text-sm font-semibold text-[#111215]">
                {formatMoney(quoteData.shippingFeeMinor)}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="text-[#111215] font-semibold block">4. Statutory State & Local Taxes</span>
                <span className="text-[11px] text-[#575A6B]">Estimated jurisdiction destination tax (ZIP {request.destinationPostalCode})</span>
              </div>
              <span className="text-sm font-semibold text-[#111215]">
                {formatMoney(quoteData.applicableTaxesMinor)}
              </span>
            </div>

            {/* Total Row */}
            <div className="pt-6 flex justify-between items-center">
              <div>
                <span className="font-display text-xl font-bold text-[#111215] block uppercase tracking-wider">
                  Total Confirmed Binding Amount
                </span>
                <span className="text-[10px] text-[#575A6B] uppercase font-mono tracking-widest">
                  United States Dollar (USD) &bull; Zero Retroactive Duties
                </span>
              </div>
              <span className="font-display text-3xl font-bold text-[#846337]">
                {formatMoney(quoteData.totalPayableMinor)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Sourcing & Fulfilment Assumptions */}
        <div className="p-5 bg-[#FAF7F2] border border-[#E3D8CB] space-y-2 text-xs font-sans text-[#575A6B]">
          <h4 className="font-mono text-xs font-bold text-[#111215] uppercase tracking-wider flex items-center gap-1.5">
            <IconShield className="w-4 h-4 text-[#846337]" />
            <span>Condition Assumptions & Authenticity Warranty:</span>
          </h4>
          <p className="leading-relaxed">
            {quoteData.notesAndAssumptions}
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-[10.5px] font-mono text-[#846337] border-t border-[#E3D8CB]">
            <span>&bull; Fulfillment Window: {quoteData.expectedFulfilmentEstimate}</span>
            <span>&bull; Domestic Scope: Mainland US Destination Only</span>
          </div>
        </div>

        {/* Success Alert if accepted */}
        {acceptedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 text-xs font-sans flex items-center gap-3">
            <IconCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold font-mono uppercase">Quote Accepted Successfully!</span>
              <p>Transferring to secure white-glove fulfillment cockpit...</p>
            </div>
          </div>
        )}

        {/* Action Buttons: Accept / Decline */}
        {!acceptedSuccess && (
          <div className="pt-6 border-t border-[#E3D8CB] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <button
              type="button"
              onClick={() => setShowDeclineModal(true)}
              className="text-[#575A6B] hover:text-rose-700 underline underline-offset-4 tracking-[0.16em] uppercase text-[11px] order-2 sm:order-1"
            >
              Decline This Quote
            </button>

            <button
              type="button"
              onClick={() => setShowAcceptModal(true)}
              className="btn-obsidian w-full sm:w-auto px-9 py-4 shadow-luxury flex items-center justify-center gap-2.5 order-1 sm:order-2 group"
            >
              <span>Accept & Proceed to Order</span>
              <IconArrowRight className="w-4 h-4 text-[#C4A575] group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* CONFIRMATION MODAL BEFORE ACCEPTING */}
      {showAcceptModal && (
        <div className="fixed inset-0 z-50 bg-[#111215]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="luxury-card bg-white max-w-lg w-full p-8 sm:p-10 space-y-6 shadow-2xl border border-[#C4A575]">
            <div className="space-y-3 text-center">
              <div className="w-14 h-14 bg-[#111215] text-[#C4A575] border-2 border-[#C4A575] flex items-center justify-center mx-auto shadow-md">
                <IconShield className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#111215]">
                Confirm Quote Acceptance
              </h3>
              <p className="text-xs text-[#575A6B] font-mono">
                You are about to authorize the bespoke acquisition of:
              </p>
            </div>

            <div className="p-5 dossier-paper border border-[#E3D8CB] font-mono text-xs space-y-2 text-center">
              <div className="font-bold text-[#111215] text-sm">{request.productName}</div>
              <div className="text-[11px] text-[#575A6B]">Sizing: {request.sizeVariant} &bull; Quantity: {request.quantity}</div>
              <div className="font-display font-bold text-2xl text-[#846337] pt-1">
                {formatMoney(quoteData.totalPayableMinor)} USD
              </div>
            </div>

            <p className="text-[11px] text-[#575A6B] font-mono leading-relaxed text-center">
              Accepting locks the 48-hour quote rate and instructs our procurement officers to secure the piece from verified archives.
            </p>

            <div className="flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => setShowAcceptModal(false)}
                className="btn-luxury-outline flex-1 py-3.5"
              >
                Review Again
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={handleConfirmAccept}
                className="btn-gilt flex-1 py-3.5 shadow-luxury"
              >
                {processing ? 'Confirming...' : 'Yes, Accept Quote'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DECLINE REASON MODAL */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 bg-[#111215]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="luxury-card bg-white max-w-lg w-full p-8 sm:p-10 space-y-6 shadow-2xl border border-[#E3D8CB]">
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-[#111215]">
                Decline Quote
              </h3>
              <p className="text-xs text-[#575A6B] font-mono">
                Kindly notify us of your consideration so our sourcing officers can re-negotiate or archive the inquiry.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10.5px] font-mono uppercase text-[#111215] font-semibold block">
                Reason for Declining (Optional)
              </label>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Price exceeds current budget, acquired elsewhere, or sizing needs revision..."
                className="luxury-input w-full p-3 text-xs font-mono"
              />
            </div>

            <div className="flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => setShowDeclineModal(false)}
                className="btn-luxury-outline flex-1 py-3"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={handleConfirmDecline}
                className="bg-rose-900 text-white hover:bg-rose-950 flex-1 py-3 font-sans uppercase tracking-kicker font-medium rounded-[2px] transition-all"
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