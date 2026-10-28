'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  IconArrowLeft,
  IconCheckCircle,
  IconClose,
  IconReceipt,
  IconClock,
  IconShield,
  IconChat,
  IconAlert,
  IconCreditCard,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';

export default function CustomerRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineBox, setShowDeclineBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch(`/api/requests/${requestId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [requestId]);

  const handleAcceptQuote = async () => {
    if (!data?.quote) return;
    setActionLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/quotes/${data.quote.id}/accept`, {
        method: 'POST',
      });
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Failed to accept quote.');
      }

      // Redirect directly to payment authorization screen
      router.push(`/portal/orders/${resData.orderId}/pay`);
    } catch (err: any) {
      setErrorMessage(err.message);
      setActionLoading(false);
    }
  };

  const handleDeclineQuote = async () => {
    if (!data?.quote) return;
    setActionLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/quotes/${data.quote.id}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: declineReason }),
      });
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Failed to decline quote.');
      }

      await loadData();
      setShowDeclineBox(false);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-xs font-mono text-titanium-500">Loading inquiry dossier...</div>;
  }

  if (!data || !data.request) {
    return (
      <div className="p-16 text-center space-y-4">
        <p className="text-xs text-titanium-400 font-sans">Inquiry record not found.</p>
        <Link href="/portal" className="text-xs font-mono text-bronze-300 underline">
          Back to Portal
        </Link>
      </div>
    );
  }

  const { request, quote, order, images, statusHistory } = data;
  const isQuoteExpired = quote && new Date(quote.expires_at).getTime() < Date.now();

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-titanium-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1.5 text-xs text-titanium-400 hover:text-white font-mono transition-colors"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Inquiries</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-titanium-500">Ref: {request.reference_number}</span>
          <StatusBadge status={request.status} size="md" />
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs flex items-center gap-2.5">
          <IconAlert className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quote Review Action Box (If Quote Sent) */}
      {quote && quote.status === 'QUOTE_SENT' && (
        <div className="stealth-card p-6 sm:p-10 space-y-7 border border-bronze-500/40 shadow-bronze-glow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-400 font-bold block mb-1">
                Official Concierge Quote
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Itemized Sourcing Quote #{quote.quote_number}
              </h2>
            </div>
            <div className="text-left sm:text-right font-mono text-xs">
              <span className="text-titanium-500 block text-[10px] uppercase">Valid Until:</span>
              <strong className={isQuoteExpired ? 'text-rose-400' : 'text-bronze-300'}>
                {new Date(quote.expires_at).toLocaleDateString()} {isQuoteExpired && '(Expired)'}
              </strong>
            </div>
          </div>

          {/* Line items table */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-titanium-400 font-semibold">
              Itemized Pricing
            </h4>
            <div className="bg-carbon-900 rounded-xl p-6 border border-white/10 divide-y divide-white/5 text-xs font-mono shadow-inner">
              <div className="flex justify-between py-2.5 text-titanium-300">
                <span>Product Acquisition Cost ({request.product_name}):</span>
                <span className="font-medium text-white">{formatMoney(quote.product_price_minor)}</span>
              </div>
              <div className="flex justify-between py-2.5 text-titanium-300">
                <span>Personal Concierge Sourcing & Multi-Point Authentication:</span>
                <span className="font-medium text-white">{formatMoney(quote.sourcing_fee_minor)}</span>
              </div>
              <div className="flex justify-between py-2.5 text-titanium-300">
                <span>Insured Domestic Courier Shipping:</span>
                <span className="font-medium text-white">{formatMoney(quote.shipping_fee_minor)}</span>
              </div>
              <div className="flex justify-between py-2.5 text-titanium-300">
                <span>Estimated Domestic Sales Tax:</span>
                <span className="font-medium text-white">{formatMoney(quote.applicable_taxes_minor)}</span>
              </div>
              {quote.discount_minor > 0 && (
                <div className="flex justify-between py-2.5 text-emerald-400">
                  <span>Authorized Discount:</span>
                  <span>-{formatMoney(quote.discount_minor)}</span>
                </div>
              )}
              <div className="flex justify-between pt-4 text-base font-bold text-white font-serif">
                <span>Total Amount Payable:</span>
                <span className="font-mono text-lg text-bronze-300">{formatMoney(quote.total_payable_minor)} USD</span>
              </div>
            </div>
          </div>

          {/* Sourcing Assumptions */}
          <div className="text-xs text-titanium-300 bg-carbon-900/80 p-5 rounded-xl border border-white/5 space-y-1.5 font-sans leading-relaxed">
            <strong className="text-bronze-300 block font-semibold font-mono text-[11px] uppercase tracking-wider">Concierge Sourcing Notes:</strong>
            <p>{quote.notes_and_assumptions || 'Sourced through certified partner network with direct physical intake.'}</p>
            <p className="text-[11px] text-titanium-400 pt-1 font-mono">
              Estimated Delivery: <strong className="text-white">{quote.expected_fulfilment_estimate}</strong>
            </p>
          </div>

          {/* Acceptance Controls */}
          {!isQuoteExpired ? (
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleAcceptQuote}
                disabled={actionLoading}
                className="flex-1 bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 py-4 px-6 rounded-lg text-xs uppercase tracking-widest font-semibold hover:brightness-110 transition-all shadow-bronze-glow flex items-center justify-center gap-2"
              >
                <IconCreditCard className="w-4 h-4" />
                <span>{actionLoading ? 'Creating Order...' : 'Accept Quote & Authorize Payment'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeclineBox(!showDeclineBox)}
                disabled={actionLoading}
                className="px-6 py-4 rounded-lg border border-white/10 bg-carbon-800 text-xs uppercase tracking-wider font-medium text-titanium-300 hover:border-bronze-500/40 hover:text-white transition-all"
              >
                Decline Quote
              </button>
            </div>
          ) : (
            <div className="text-xs text-rose-300 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 font-mono">
              This quote expired on {new Date(quote.expires_at).toLocaleDateString()}. Please message your concierge specialist below to request a refreshed quote based on updated market stock.
            </div>
          )}

          {/* Decline Reason Sub-Form */}
          {showDeclineBox && (
            <div className="pt-4 border-t border-white/5 space-y-3">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Reason for Declining (Optional - Helps Us Revise Parameters):
              </label>
              <textarea
                rows={2}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Price is higher than anticipated, or timeline is too long."
                className="stealth-input w-full text-xs p-3.5"
              />
              <button
                type="button"
                onClick={handleDeclineQuote}
                disabled={actionLoading}
                className="bg-rose-900/60 border border-rose-500/30 text-rose-300 px-4 py-2.5 rounded text-xs uppercase tracking-wider font-semibold hover:bg-rose-900 transition-colors"
              >
                Confirm Declination
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Request Specification Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="stealth-card p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl">
            <div className="border-b border-white/5 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 font-semibold block">
                Requested Item
              </span>
              <h2 className="font-serif text-2xl font-bold text-white mt-1">
                {request.product_name}
              </h2>
              <div className="text-xs text-titanium-400 mt-0.5">{request.brand}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="border border-white/5 p-3.5 rounded-xl bg-carbon-900/60">
                <span className="text-titanium-500 block text-[10px] uppercase">Category</span>
                <span className="font-semibold text-white">{request.category.replace('_', ' ')}</span>
              </div>
              <div className="border border-white/5 p-3.5 rounded-xl bg-carbon-900/60">
                <span className="text-titanium-500 block text-[10px] uppercase">Size Variant</span>
                <span className="font-semibold text-white">{request.size_variant || 'Unspecified'}</span>
              </div>
              <div className="border border-white/5 p-3.5 rounded-xl bg-carbon-900/60">
                <span className="text-titanium-500 block text-[10px] uppercase">Colorway</span>
                <span className="font-semibold text-white">{request.color_variant || 'Standard'}</span>
              </div>
              <div className="border border-white/5 p-3.5 rounded-xl bg-carbon-900/60">
                <span className="text-titanium-500 block text-[10px] uppercase">Destination ZIP</span>
                <span className="font-semibold text-white">{request.destination_postal_code} (US)</span>
              </div>
              <div className="border border-white/5 p-3.5 rounded-xl bg-carbon-900/60">
                <span className="text-titanium-500 block text-[10px] uppercase">Max Budget Guide</span>
                <span className="font-semibold text-bronze-300">
                  {request.max_budget_minor ? formatMoney(request.max_budget_minor) : 'Flexible'}
                </span>
              </div>
              <div className="border border-white/5 p-3.5 rounded-xl bg-carbon-900/60">
                <span className="text-titanium-500 block text-[10px] uppercase">Preferred Seller</span>
                <span className="font-semibold text-white">{request.preferred_seller || 'Any verified boutique'}</span>
              </div>
            </div>

            {request.product_url && (
              <div className="text-xs font-mono">
                <span className="text-titanium-500 block text-[10px] uppercase mb-1">Reference URL:</span>
                <a
                  href={request.product_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-bronze-300 underline truncate block hover:text-bronze-200"
                >
                  {request.product_url}
                </a>
              </div>
            )}

            {request.additional_notes && (
              <div className="text-xs bg-carbon-900/80 p-4 rounded-xl border border-white/5 space-y-1 font-sans">
                <span className="text-titanium-500 block text-[10px] uppercase font-mono">Handling Instructions:</span>
                <p className="text-titanium-300 leading-relaxed">{request.additional_notes}</p>
              </div>
            )}

            {/* Images */}
            {images && images.length > 0 && (
              <div className="space-y-2">
                <span className="text-titanium-500 block text-[10px] uppercase font-mono">Attached References:</span>
                <div className="flex flex-wrap gap-3">
                  {images.map((img: any) => (
                    <a key={img.id} href={img.file_url} target="_blank" rel="noreferrer" className="block border border-white/10 rounded-lg overflow-hidden w-24 h-24 hover:opacity-90">
                      <img src={img.file_url} alt="Reference" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lifecycle Status Timeline */}
          <div className="stealth-card p-6 space-y-4 border border-white/10 shadow-2xl">
            <h3 className="font-serif font-bold text-base text-white">
              Audit & Status History
            </h3>
            <div className="space-y-4 text-xs font-mono divide-y divide-white/5">
              {statusHistory.map((h: any) => (
                <div key={h.id} className="pt-3 first:pt-0 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">{h.to_status.replace(/_/g, ' ')}</span>
                    <span className="text-titanium-400 font-sans text-[11px] block">{h.note || 'Status transitioned'}</span>
                  </div>
                  <span className="text-[10px] text-titanium-500 shrink-0">
                    {new Date(h.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Assigned Concierge Specialist & Direct Messaging */}
        <div className="space-y-6">
          <div className="stealth-card p-6 space-y-4 border border-white/10 shadow-2xl">
            <h4 className="font-serif font-bold text-sm text-white border-b border-white/5 pb-3">
              Your Concierge Specialist
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-carbon-800 border border-white/10 text-bronze-300 font-serif font-bold flex items-center justify-center text-sm shadow-inner">
                {request.assignedStaffName ? request.assignedStaffName[0] : 'V'}
              </div>
              <div>
                <strong className="font-serif font-semibold text-white text-xs block">
                  {request.assignedStaffName || 'Julian Thorne'}
                </strong>
                <span className="text-[11px] text-titanium-400 font-mono">Senior Sourcing Officer</span>
              </div>
            </div>

            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              Have questions regarding sizing nuance, condition checks, or alternate colorways? Send a direct note to your dedicated concierge.
            </p>

            <Link
              href={`/portal/messages?requestId=${request.id}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-carbon-800 hover:bg-carbon-750 text-titanium-200 border border-white/10 font-mono py-2.5 rounded text-xs transition-colors hover:text-white"
            >
              <IconChat className="w-3.5 h-3.5 text-bronze-400" />
              <span>Open Chat Thread</span>
            </Link>
          </div>

          {order && (
            <div className="stealth-card p-6 space-y-3 border border-emerald-500/30">
              <h4 className="font-serif font-bold text-sm text-emerald-400">
                Order Generated
              </h4>
              <p className="text-xs text-titanium-300 leading-relaxed font-sans">
                An active order #{order.order_number} has been created for this quote.
              </p>
              <Link
                href={`/portal/orders/${order.id}`}
                className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold font-mono hover:bg-emerald-500/20"
              >
                Go to Order Cockpit &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
