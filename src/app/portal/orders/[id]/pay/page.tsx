'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  IconLock,
  IconShield,
  IconCreditCard,
  IconCheckCircle,
  IconAlert,
  IconArrowRight,
  IconArrowLeft,
  IconReceipt,
} from '@/components/icons/FlaticonIcons';
import { formatMoney } from '@/lib/pricing';

export default function OrderPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');

  // Payment Form state (Simulated secure tokenized fields)
  const [cardHolder, setCardHolder] = useState('Alexander Hayes');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('•••');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const json = await res.json();
          setOrderData(json.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Generate client-side idempotency key for payment event
      const idempotencyKey = `idemp_txn_${orderId}_${Date.now()}`;

      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          cardHolderName: cardHolder,
          lastFour: '4242',
          paymentMethod: 'VERITAS_SECURE_VAULT_TOKEN',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment transaction rejected by gateway.');
      }

      setPaymentRef(data.paymentReference);
      setPaymentSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-xs font-mono text-titanium-500">Loading payment gateway...</div>;
  }

  if (!orderData) {
    return (
      <div className="p-16 text-center space-y-4">
        <p className="text-xs text-titanium-400 font-sans">Order not found.</p>
        <Link href="/portal" className="text-xs font-mono text-bronze-300 underline">Return to Portal</Link>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="py-16 md:py-24 px-4 max-w-lg mx-auto text-center space-y-7 text-titanium-200">
        <div className="w-16 h-16 bg-bronze-500/10 text-bronze-400 rounded-full flex items-center justify-center mx-auto border border-bronze-500/20 shadow-bronze-glow">
          <IconCheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-bronze-400 font-bold block">
            Payment Cleared & Sourcing Authorized
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Transaction Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-titanium-400 max-w-sm mx-auto leading-relaxed font-sans">
            Your payment authorization has been settled. Our concierge specialists have been notified and physical partner acquisition has begun.
          </p>
        </div>

        <div className="bg-carbon-900 border border-white/10 rounded-xl p-5 font-mono text-xs space-y-2 text-titanium-300 shadow-inner">
          <div className="flex justify-between">
            <span className="text-titanium-500">Payment Ref:</span>
            <span className="font-semibold text-white">{paymentRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-titanium-500">Amount Paid:</span>
            <span className="font-semibold text-bronze-300">{formatMoney(orderData.total_payable_minor)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-titanium-500">Status:</span>
            <span className="text-emerald-400 font-semibold">VERIFIED & ARCHIVED</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            href={`/portal/orders/${orderId}`}
            className="bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 px-8 py-3.5 rounded text-xs uppercase tracking-widest font-semibold hover:brightness-110 shadow-bronze-glow transition-all"
          >
            Go to Order Cockpit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 text-titanium-200">
      <Link
        href={`/portal/orders/${orderId}`}
        className="inline-flex items-center gap-1.5 text-xs text-titanium-400 hover:text-white font-mono transition-colors"
      >
        <IconArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Order</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Itemized Checkout Invoice */}
        <div className="stealth-card p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl">
          <div className="border-b border-white/5 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-400 font-semibold block mb-1">
              Authorization Summary
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              {orderData.product_name}
            </h2>
            <span className="text-xs text-titanium-400 font-mono">{orderData.brand} • {orderData.size_variant || 'Standard'}</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between text-titanium-300">
              <span>Item Acquisition Cost:</span>
              <span className="text-white">{formatMoney(orderData.product_price_minor)}</span>
            </div>
            <div className="flex justify-between text-titanium-300">
              <span>Personal Concierge Sourcing:</span>
              <span className="text-white">{formatMoney(orderData.sourcing_fee_minor)}</span>
            </div>
            <div className="flex justify-between text-titanium-300">
              <span>Insured Domestic Courier:</span>
              <span className="text-white">{formatMoney(orderData.shipping_fee_minor)}</span>
            </div>
            <div className="flex justify-between text-titanium-300">
              <span>Estimated Sales Tax:</span>
              <span className="text-white">{formatMoney(orderData.applicable_taxes_minor)}</span>
            </div>
            {orderData.discount_minor > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promotional Discount:</span>
                <span>-{formatMoney(orderData.discount_minor)}</span>
              </div>
            )}
            <div className="flex justify-between pt-4 border-t border-white/5 text-base font-bold text-white font-serif">
              <span>Total Payable Now:</span>
              <span className="font-mono text-lg text-bronze-300">{formatMoney(orderData.total_payable_minor)} USD</span>
            </div>
          </div>

          <div className="bg-carbon-900/80 p-4 rounded-xl border border-white/5 text-xs text-titanium-300 space-y-1.5 font-sans leading-relaxed">
            <div className="flex items-center gap-2 font-semibold text-white font-mono text-[11px] uppercase tracking-wider">
              <IconShield className="w-4 h-4 text-bronze-400" />
              <span>Inspection Escrow Protection</span>
            </div>
            <p className="text-[11px] text-titanium-400 leading-relaxed">
              Funds are held under our authenticity pledge. Sourcing will only be finalized if the piece successfully clears all multi-point verification checks at our Manhattan intake facility.
            </p>
          </div>
        </div>

        {/* Right: Payment Card Authorization */}
        <div className="stealth-card p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-serif font-bold text-lg text-white">
              Payment Method
            </h3>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <IconLock className="w-3 h-3" />
              <span>256-bit Encrypted</span>
            </span>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <IconAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePay} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Cardholder Name
              </label>
              <input
                type="text"
                required
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="stealth-input w-full text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="stealth-input w-full text-xs font-mono"
                />
                <IconCreditCard className="w-4 h-4 text-titanium-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                  Expiration
                </label>
                <input
                  type="text"
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="stealth-input w-full text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                  Security Code (CVV)
                </label>
                <input
                  type="password"
                  required
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="stealth-input w-full text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 py-4 rounded-lg text-xs uppercase tracking-widest font-semibold hover:brightness-110 transition-all shadow-bronze-glow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <IconLock className="w-3.5 h-3.5" />
                <span>{submitting ? 'Verifying Gateway Transaction...' : `Authorize Payment (${formatMoney(orderData.total_payable_minor)})`}</span>
              </button>
            </div>

            <p className="text-center text-[10px] text-titanium-500 font-mono leading-relaxed pt-1">
              By authorizing payment, you confirm your acceptance of the itemized quote and Veritas domestic fulfillment terms. Raw card details are not stored on our server.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
