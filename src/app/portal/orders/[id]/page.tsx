'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  IconArrowLeft,
  IconTruck,
  IconCheckCircle,
  IconFileText,
  IconAlert,
  IconCreditCard,
  IconShield,
  IconPackage,
  IconChat,
  IconDownload,
  IconStar,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';

export default function CustomerOrderCockpitPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [satisfactionRating, setSatisfactionRating] = useState(5);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [issueReported, setIssueReported] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [message, setMessage] = useState('');

  const loadOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
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
    loadOrder();
  }, [orderId]);

  const handleConfirmDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/confirm-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          satisfactionRating,
          recipientNotes: deliveryNotes,
          issueReported,
          issueDescription,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed');
      setMessage(resData.message);
      setShowDeliveryModal(false);
      await loadOrder();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestCancellation = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed');
      setMessage(resData.message);
      setShowCancelModal(false);
      await loadOrder();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-xs font-mono text-titanium-500">Loading order dossier...</div>;
  }

  if (!data || !data.order) {
    return (
      <div className="p-16 text-center space-y-4">
        <p className="text-xs text-titanium-400 font-sans">Order not found.</p>
        <Link href="/portal/orders" className="text-xs font-mono text-bronze-300 underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const { order, shipment, documents, statusHistory, deliveryConfirmation } = data;

  // Milestone stages
  const milestones = [
    { key: 'AWAITING_PAYMENT', label: 'Payment' },
    { key: 'SOURCING_IN_PROGRESS', label: 'Merchant Sourcing' },
    { key: 'PRODUCT_ACQUIRED', label: 'Physical Intake' },
    { key: 'QUALITY_CHECK', label: 'Authentication' },
    { key: 'PACKING', label: 'Packaging' },
    { key: 'SHIPPED', label: 'Domestic Courier' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const stateOrder = [
    'AWAITING_PAYMENT',
    'PAYMENT_CONFIRMED',
    'SOURCING_IN_PROGRESS',
    'PRODUCT_ACQUIRED',
    'QUALITY_CHECK',
    'PACKING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];
  const currentIndex = stateOrder.indexOf(order.status);

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-titanium-200">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/portal/orders"
          className="inline-flex items-center gap-1.5 text-xs text-titanium-400 hover:text-white font-mono transition-colors"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-titanium-500">Order #{order.order_number}</span>
          <StatusBadge status={order.status} size="md" />
        </div>
      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-2.5">
          <IconCheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Visual Milestones Stepper */}
      <div className="stealth-card p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl">
        <h3 className="font-serif font-bold text-base text-white">
          Fulfilment Journey
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {milestones.map((m, idx) => {
            const milestoneIndex = stateOrder.indexOf(m.key);
            const isCompleted = currentIndex > milestoneIndex;
            const isCurrent = currentIndex === milestoneIndex || (m.key === 'SHIPPED' && order.status === 'OUT_FOR_DELIVERY');

            return (
              <div
                key={m.key}
                className={`p-3.5 rounded-xl border text-center space-y-1.5 transition-all font-mono ${
                  isCurrent
                    ? 'border-bronze-500/50 bg-carbon-800 text-bronze-300 shadow-bronze-glow'
                    : isCompleted
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/5 bg-carbon-900/60 text-titanium-500'
                }`}
              >
                <div className="flex items-center justify-center">
                  {isCompleted ? (
                    <IconCheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold">{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Action Callout (If Awaiting Payment or Delivery Pending) */}
      {order.status === 'AWAITING_PAYMENT' && (
        <div className="bg-carbon-900 border border-bronze-500/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-bronze-glow">
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-base text-white">
              Payment Authorization Required
            </h4>
            <p className="text-xs text-titanium-400 font-sans">
              Your quote was accepted. Please authorize payment to initiate sourcing and partner allocation.
            </p>
          </div>
          <Link
            href={`/portal/orders/${order.id}/pay`}
            className="bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 px-7 py-3.5 rounded-lg text-xs uppercase tracking-widest font-semibold hover:brightness-110 transition-all shadow-bronze-glow shrink-0 flex items-center gap-2"
          >
            <IconCreditCard className="w-4 h-4" />
            <span>Complete Payment ({formatMoney(order.total_payable_minor)})</span>
          </Link>
        </div>
      )}

      {['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) && !deliveryConfirmation && (
        <div className="bg-carbon-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-stealth">
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-base text-white">
              Package In Transit or Delivered
            </h4>
            <p className="text-xs text-titanium-400 font-sans">
              Please inspect your package upon receipt. Confirm delivery or report any discrepancies within 48 hours.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeliveryModal(true)}
            className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-6 py-3.5 rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-emerald-500/30 transition-all shadow-sm shrink-0 font-mono"
          >
            Confirm Receipt / Report Issue
          </button>
        </div>
      )}

      {/* Order Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Item & Financial Summary */}
          <div className="stealth-card p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl">
            <div className="border-b border-white/5 pb-4 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-400 font-semibold block mb-1">
                  Purchased Item
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  {order.product_name}
                </h3>
                <span className="text-xs text-titanium-400 font-mono">{order.brand} • {order.size_variant || 'Standard'}</span>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-titanium-500 block text-[10px] uppercase">Paid Total</span>
                <span className="font-bold text-base text-bronze-300">{formatMoney(order.total_payable_minor)}</span>
              </div>
            </div>

            {/* Carrier Shipment Info */}
            {shipment && (
              <div className="bg-carbon-900 rounded-xl p-5 border border-white/10 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-serif font-bold text-sm">
                    <IconTruck className="w-4 h-4 text-bronze-400" />
                    <span>Courier Dispatch Tracking</span>
                  </div>
                  <span className="text-[11px] bg-carbon-800 border border-white/10 px-2 py-0.5 rounded text-titanium-300">
                    {shipment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-titanium-500 text-[10px] uppercase block">Carrier</span>
                    <span className="font-semibold text-white">{shipment.carrier_name}</span>
                  </div>
                  <div>
                    <span className="text-titanium-500 text-[10px] uppercase block">Tracking Reference</span>
                    <span className="font-semibold text-white">{shipment.tracking_number}</span>
                  </div>
                </div>

                {shipment.tracking_url && (
                  <div className="pt-2">
                    <a
                      href={shipment.tracking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-bronze-300 underline underline-offset-4 hover:text-bronze-200"
                    >
                      Track on Carrier Website &rarr;
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Customer Documents Vault */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-base text-white">
                Official Order Documents
              </h4>
              {documents && documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-carbon-900/60 text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <IconFileText className="w-4 h-4 text-bronze-400" />
                        <div>
                          <strong className="text-white font-medium block">{doc.title}</strong>
                          <span className="text-[10px] text-titanium-500">{doc.document_type}</span>
                        </div>
                      </div>
                      <a
                        href={doc.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] bg-carbon-800 border border-white/10 text-titanium-200 px-3 py-1.5 rounded hover:border-bronze-500/40 hover:text-white transition-colors"
                      >
                        <IconDownload className="w-3 h-3 text-bronze-400" />
                        <span>View</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-titanium-500 font-mono italic">No public documents generated yet.</p>
              )}
            </div>

            {/* Status History */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <h4 className="font-serif font-bold text-base text-white">
                Status History Log
              </h4>
              <div className="space-y-3 text-xs font-mono divide-y divide-white/5">
                {statusHistory.map((h: any) => (
                  <div key={h.id} className="pt-2 first:pt-0 flex items-start justify-between gap-4">
                    <div>
                      <span className="font-semibold text-white block">{h.to_status.replace(/_/g, ' ')}</span>
                      <span className="text-titanium-400 font-sans text-[11px] block">{h.note}</span>
                    </div>
                    <span className="text-[10px] text-titanium-500 shrink-0">
                      {new Date(h.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="stealth-card p-6 space-y-4 border border-white/10 shadow-2xl">
            <h4 className="font-serif font-bold text-sm text-white border-b border-white/5 pb-3">
              Order Assistance
            </h4>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              Your personal sourcing officer oversees intake, authenticity inspections, and packaging.
            </p>

            <Link
              href={`/portal/messages?requestId=${order.request_id}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-carbon-800 hover:bg-carbon-750 text-titanium-200 border border-white/10 font-mono py-2.5 rounded text-xs transition-colors hover:text-white"
            >
              <IconChat className="w-3.5 h-3.5 text-bronze-400" />
              <span>Message Concierge</span>
            </Link>

            {/* Cancellation link */}
            {!['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status) && (
              <div className="pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono underline underline-offset-4"
                >
                  Request Order Cancellation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Confirmation & Dispute Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 bg-carbon-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-carbon-900 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-white/10 text-titanium-200">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-serif font-bold text-base text-white">
                Confirm Receipt or Report Issue
              </h3>
              <button
                type="button"
                onClick={() => setShowDeliveryModal(false)}
                className="text-titanium-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDelivery} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                  Experience Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSatisfactionRating(star)}
                      className={`p-2.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                        satisfactionRating >= star
                          ? 'bg-bronze-500/20 text-bronze-300 border-bronze-500/40'
                          : 'bg-carbon-800 text-titanium-500 border-white/5'
                      }`}
                    >
                      <IconStar className="w-3.5 h-3.5 fill-current" />
                      <span>{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                  Feedback or Notes
                </label>
                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Arrived in pristine condition. Packaging was excellent!"
                  className="stealth-input w-full text-xs p-3"
                />
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={issueReported}
                    onChange={(e) => setIssueReported(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-carbon-800 text-rose-500 focus:ring-rose-500/20"
                  />
                  <span className="text-xs font-semibold text-rose-400">
                    Report an Issue / Discrepancy (Opens Dispute)
                  </span>
                </label>

                {issueReported && (
                  <textarea
                    rows={3}
                    required
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Describe the discrepancy, box damage, or issue..."
                    className="stealth-input w-full text-xs p-3 border-rose-500/30 bg-rose-500/10 text-rose-200"
                  />
                )}
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 py-3 rounded text-xs uppercase tracking-wider font-semibold hover:brightness-110 shadow-bronze-glow"
                >
                  {actionLoading ? 'Recording...' : 'Submit Confirmation'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeliveryModal(false)}
                  className="px-4 py-3 rounded border border-white/10 text-xs text-titanium-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Request Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-carbon-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-carbon-900 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-white/10 text-titanium-200">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-serif font-bold text-base text-white">
                Request Order Cancellation
              </h3>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="text-titanium-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestCancellation} className="space-y-4">
              <p className="text-xs text-titanium-400 leading-relaxed font-sans">
                In accordance with our Cancellation Policy, our team will verify whether external merchant acquisition can be halted without non-refundable penalties.
              </p>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                  Reason for Cancellation *
                </label>
                <textarea
                  rows={3}
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Explain why you wish to cancel this order..."
                  className="stealth-input w-full text-xs p-3.5"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-rose-900/60 border border-rose-500/30 text-rose-300 py-3 rounded text-xs uppercase tracking-wider font-semibold hover:bg-rose-900 transition-colors"
                >
                  {actionLoading ? 'Submitting...' : 'Submit Cancellation Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-3 rounded border border-white/10 text-xs text-titanium-400 hover:text-white"
                >
                  Keep Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
