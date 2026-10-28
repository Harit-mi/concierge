'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  IconArrowLeft,
  IconReceipt,
  IconCheckCircle,
  IconAlert,
  IconCalculator,
  IconShield,
} from '@/components/icons/FlaticonIcons';
import { formatMoney, calculateQuoteTotals } from '@/lib/pricing';

export default function AdminQuoteBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [productPriceMajor, setProductPriceMajor] = useState('500');
  const [sourcingFeeMajor, setSourcingFeeMajor] = useState('50');
  const [shippingFeeMajor, setShippingFeeMajor] = useState('25');
  const [taxMajor, setTaxMajor] = useState('45');
  const [chargesMajor, setChargesMajor] = useState('0');
  const [discountMajor, setDiscountMajor] = useState('0');
  const [daysValid, setDaysValid] = useState('7');
  const [fulfilmentEstimate, setFulfilmentEstimate] = useState('5-8 business days upon payment clearance');
  const [notesAndAssumptions, setNotesAndAssumptions] = useState('Deadstock verified Grade A from authorized boutique with manufacturer tags.');

  useEffect(() => {
    async function loadReq() {
      try {
        const res = await fetch(`/api/requests/${requestId}`);
        if (res.ok) {
          const json = await res.json();
          setRequest(json.request);

          // Pre-populate with budget if available
          if (json.request.max_budget_minor) {
            const major = (json.request.max_budget_minor / 100).toFixed(0);
            setProductPriceMajor(major);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReq();
  }, [requestId]);

  // Live total calculations
  const productPriceMinor = Math.round(parseFloat(productPriceMajor || '0') * 100);
  const sourcingFeeMinor = Math.round(parseFloat(sourcingFeeMajor || '0') * 100);
  const shippingFeeMinor = Math.round(parseFloat(shippingFeeMajor || '0') * 100);
  const applicableTaxesMinor = Math.round(parseFloat(taxMajor || '0') * 100);
  const disclosedChargesMinor = Math.round(parseFloat(chargesMajor || '0') * 100);
  const discountMinor = Math.round(parseFloat(discountMajor || '0') * 100);

  const calculated = calculateQuoteTotals({
    productPriceMinor,
    sourcingFeeMinor,
    shippingFeeMinor,
    applicableTaxesMinor,
    disclosedChargesMinor,
    discountMinor,
  });

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          productPriceMajor,
          sourcingFeeMajor,
          shippingFeeMajor,
          taxMajor,
          chargesMajor,
          discountMajor,
          daysValid: parseInt(daysValid, 10) || 7,
          fulfilmentEstimate,
          notesAndAssumptions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch quote.');

      router.push(`/admin/requests/${requestId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-xs font-mono text-titanium-500">Loading quote builder...</div>;
  }

  if (!request) {
    return (
      <div className="p-16 text-center space-y-4">
        <p className="text-xs text-titanium-400 font-sans">Request not found.</p>
        <Link href="/admin/requests" className="text-xs font-mono text-bronze-300 underline">Back to Inquiries</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-titanium-200">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <Link
          href={`/admin/requests/${requestId}`}
          className="inline-flex items-center gap-1.5 text-xs text-titanium-400 hover:text-white font-mono transition-colors"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Request Triage</span>
        </Link>
        <span className="font-mono text-xs text-titanium-500">Ref: {request.reference_number}</span>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-400 font-bold block mb-1">
          Pricing Calculation Engine
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Build Sourcing Quote for {request.product_name}
        </h1>
        <p className="text-xs text-titanium-400 font-sans">
          Enter itemized components. Totals are computed in integer minor currency units to ensure penny-perfect financial integrity.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs flex items-center gap-2.5">
          <IconAlert className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitQuote} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="md:col-span-2 stealth-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 shadow-2xl">
          <h3 className="font-serif font-bold text-base text-white border-b border-white/5 pb-3 flex items-center gap-2">
            <IconCalculator className="w-4 h-4 text-bronze-400" />
            <span>Itemized Line Item Inputs</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                1. Product Acquisition Price (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-titanium-500 font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={productPriceMajor}
                  onChange={(e) => setProductPriceMajor(e.target.value)}
                  className="stealth-input w-full text-xs pl-8 font-mono"
                />
              </div>
              <span className="text-[10px] text-titanium-500 font-mono block">Exact purchase price from merchant.</span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                2. Concierge Sourcing Fee (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-titanium-500 font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={sourcingFeeMajor}
                  onChange={(e) => setSourcingFeeMajor(e.target.value)}
                  className="stealth-input w-full text-xs pl-8 font-mono"
                />
              </div>
              <span className="text-[10px] text-titanium-500 font-mono block">Verification, sourcing & authentication fee.</span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                3. Insured Domestic Shipping (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-titanium-500 font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={shippingFeeMajor}
                  onChange={(e) => setShippingFeeMajor(e.target.value)}
                  className="stealth-input w-full text-xs pl-8 font-mono"
                />
              </div>
              <span className="text-[10px] text-titanium-500 font-mono block">Insured priority domestic courier with signature.</span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                4. Applicable Taxes (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-titanium-500 font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={taxMajor}
                  onChange={(e) => setTaxMajor(e.target.value)}
                  className="stealth-input w-full text-xs pl-8 font-mono"
                />
              </div>
              <span className="text-[10px] text-titanium-500 font-mono block">State/local sales tax for ZIP {request.destination_postal_code}.</span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Disclosed Other Charges (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-titanium-500 font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={chargesMajor}
                  onChange={(e) => setChargesMajor(e.target.value)}
                  className="stealth-input w-full text-xs pl-8 font-mono"
                />
              </div>
              <span className="text-[10px] text-titanium-500 font-mono block">Optional special packaging or rush fee.</span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Authorized Discount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-titanium-500 font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={discountMajor}
                  onChange={(e) => setDiscountMajor(e.target.value)}
                  className="stealth-input w-full text-xs pl-8 font-mono text-emerald-400"
                />
              </div>
              <span className="text-[10px] text-titanium-500 font-mono block">Loyalty or promotional concession.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Quote Validity Window (Days)
              </label>
              <select
                value={daysValid}
                onChange={(e) => setDaysValid(e.target.value)}
                className="stealth-input w-full text-xs bg-carbon-900"
              >
                <option value="3">3 Days (Fast-moving inventory)</option>
                <option value="7">7 Days (Standard binding quote)</option>
                <option value="14">14 Days (Extended hold)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Fulfilment Timeline Estimate
              </label>
              <input
                type="text"
                required
                value={fulfilmentEstimate}
                onChange={(e) => setFulfilmentEstimate(e.target.value)}
                className="stealth-input w-full text-xs"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
              Notes, Provenance & Sourcing Assumptions
            </label>
            <textarea
              rows={3}
              value={notesAndAssumptions}
              onChange={(e) => setNotesAndAssumptions(e.target.value)}
              className="stealth-input w-full text-xs p-3.5"
            />
          </div>
        </div>

        {/* Right: Live Customer Quote Preview */}
        <div className="space-y-6">
          <div className="stealth-card p-6 sm:p-7 rounded-2xl space-y-6 border border-bronze-500/40 shadow-bronze-glow">
            <div className="border-b border-white/5 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-400 block mb-1">
                Client Preview
              </span>
              <h4 className="font-serif font-bold text-lg text-white">
                Quote Breakdown
              </h4>
              <span className="text-xs text-titanium-400 font-mono truncate block">{request.product_name}</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between text-titanium-300">
                <span>Product Item:</span>
                <span className="text-white">{formatMoney(calculated.productPriceMinor)}</span>
              </div>
              <div className="flex justify-between text-titanium-300">
                <span>Concierge Fee:</span>
                <span className="text-white">{formatMoney(calculated.sourcingFeeMinor)}</span>
              </div>
              <div className="flex justify-between text-titanium-300">
                <span>Domestic Courier:</span>
                <span className="text-white">{formatMoney(calculated.shippingFeeMinor)}</span>
              </div>
              <div className="flex justify-between text-titanium-300">
                <span>Sales Tax:</span>
                <span className="text-white">{formatMoney(calculated.applicableTaxesMinor)}</span>
              </div>
              {calculated.disclosedChargesMinor > 0 && (
                <div className="flex justify-between text-titanium-300">
                  <span>Disclosed Surcharges:</span>
                  <span className="text-white">{formatMoney(calculated.disclosedChargesMinor)}</span>
                </div>
              )}
              {calculated.discountMinor > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span>-{formatMoney(calculated.discountMinor)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-white/5 text-base font-bold text-white font-serif">
                <span>Total Client Cost:</span>
                <span className="text-bronze-300 font-mono">{formatMoney(calculated.totalPayableMinor)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 font-bold py-4 rounded-lg text-xs uppercase tracking-widest hover:brightness-110 shadow-bronze-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <IconReceipt className="w-4 h-4" />
              <span>{submitting ? 'Generating...' : 'Dispatch Quote to Customer'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
