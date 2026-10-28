'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  IconReceipt,
  IconCalculator,
  IconEye,
  IconSend,
  IconCheckCircle,
  IconAlert,
  IconClock,
  IconShield,
  IconArrowLeft,
} from '@/components/icons/FlaticonIcons';
import { formatMoney } from '@/lib/pricing';
import { fetchRequestsAdapter, SourcingRequestItem } from '@/lib/api-adapter';

function AdminQuotesContent() {
  const searchParams = useSearchParams();
  const preselectedRequestId = searchParams.get('requestId') || 'req-travis-01';

  const [requests, setRequests] = useState<SourcingRequestItem[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState(preselectedRequestId);

  // Quote Builder State (Exact integer calculations in minor units)
  const [productPriceMajor, setProductPriceMajor] = useState('520.00');
  const [sourcingFeeMajor, setSourcingFeeMajor] = useState('62.40');
  const [shippingFeeMajor, setShippingFeeMajor] = useState('24.00');
  const [taxMajor, setTaxMajor] = useState('34.60');
  const [disclosedChargesMajor, setDisclosedChargesMajor] = useState('0.00');
  const [discountMajor, setDiscountMajor] = useState('0.00');
  const [expiryDays, setExpiryDays] = useState('2');
  const [assumptions, setAssumptions] = useState(
    'Acquired directly from authorized Tokyo partner in pristine deadstock condition with factory box and extra laces.'
  );

  const [transmitting, setTransmitting] = useState(false);
  const [transmittedSuccess, setTransmittedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchRequestsAdapter();
      setRequests(data);
    }
    load();
  }, []);

  const activeRequest = requests.find((r) => r.id === selectedRequestId) || requests[0] || {
    id: 'req-travis-01',
    referenceNumber: 'REQ-2026-9041',
    productName: 'Air Jordan 1 Retro Low OG SP "Canary"',
    brand: 'Jordan Brand x Travis Scott',
    sizeVariant: 'US 10.5',
    destinationPostalCode: '10022',
  };

  // Live Auto Calculations (penny-exact)
  const prodMinor = Math.round((parseFloat(productPriceMajor) || 0) * 100);
  const feeMinor = Math.round((parseFloat(sourcingFeeMajor) || 0) * 100);
  const shipMinor = Math.round((parseFloat(shippingFeeMajor) || 0) * 100);
  const taxMinor = Math.round((parseFloat(taxMajor) || 0) * 100);
  const chargesMinor = Math.round((parseFloat(disclosedChargesMajor) || 0) * 100);
  const discMinor = Math.round((parseFloat(discountMajor) || 0) * 100);

  const totalMinor = prodMinor + feeMinor + shipMinor + taxMinor + chargesMinor - discMinor;

  // Auto-calculate 12% concierge fee recommendation
  const handleAutoFee = () => {
    const calculatedFee = (parseFloat(productPriceMajor) || 0) * 0.12;
    setSourcingFeeMajor(calculatedFee.toFixed(2));
  };

  // Auto-calculate estimated state tax (approx 8.875% NY)
  const handleAutoTax = () => {
    const subtotal = (parseFloat(productPriceMajor) || 0) + (parseFloat(sourcingFeeMajor) || 0);
    const calculatedTax = subtotal * 0.08875;
    setTaxMajor(calculatedTax.toFixed(2));
  };

  const handleTransmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setTransmitting(true);
    setTimeout(() => {
      setTransmitting(false);
      setTransmittedSuccess(true);
      setTimeout(() => setTransmittedSuccess(false), 4000);
    }, 800);
  };

  return (
    <div className="space-y-8 text-[#141519]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE4D9] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A603D] font-bold block mb-1">
            Pricing Operations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141519]">
            Interactive Quote Builder & Queue
          </h1>
          <p className="text-xs text-[#5C5F6D] mt-1 font-sans">
            Prepare legally binding itemized quotes with exact minor-unit calculations and live client preview.
          </p>
        </div>

        <Link
          href="/admin/requests"
          className="btn-luxury-outline text-xs px-4 py-2.5 flex items-center gap-1.5 self-start sm:self-center"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>Inquiries Queue</span>
        </Link>
      </div>

      {transmittedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-sm text-xs font-mono flex items-center gap-3">
          <IconCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Quote successfully compiled, timestamped, and transmitted to client console with 48 hours validity.
          </span>
        </div>
      )}

      {/* Main Grid: Form Builder (Left) vs Live Client Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Operator Quote Inputs */}
        <div className="lg:col-span-7 ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] space-y-6 shadow-xs">
          <div className="border-b border-[#F2EDE4] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconCalculator className="w-4 h-4 text-[#A38054]" />
              <h3 className="font-serif font-bold text-base text-[#141519]">
                Quote Parameters
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#717584]">Exact USD Cents</span>
          </div>

          <form onSubmit={handleTransmitQuote} className="space-y-4 font-mono text-xs">
            {/* Select Target Request */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#141519] uppercase tracking-wider block">
                Target Sourcing Inquiry *
              </label>
              <select
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                className="ivory-input w-full p-2.5 rounded-sm text-xs"
              >
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.referenceNumber} &bull; {r.productName} ({r.brand})
                  </option>
                ))}
              </select>
            </div>

            {/* Product Retail Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#111215] uppercase tracking-wider block">
                  1. Retail Acquisition Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="650.00"
                  value={productPriceMajor}
                  onChange={(e) => setProductPriceMajor(e.target.value)}
                  className="luxury-input w-full p-2.5 rounded-[2px] text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-[#141519] uppercase tracking-wider block">
                    2. Sourcing Fee ($) *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoFee}
                    className="text-[10px] text-[#A38054] underline hover:text-[#141519]"
                  >
                    12% Default
                  </button>
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={sourcingFeeMajor}
                  onChange={(e) => setSourcingFeeMajor(e.target.value)}
                  className="ivory-input w-full p-2.5 rounded-sm text-xs"
                />
              </div>
            </div>

            {/* Courier & Taxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#141519] uppercase tracking-wider block">
                  3. Domestic Insured Courier ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={shippingFeeMajor}
                  onChange={(e) => setShippingFeeMajor(e.target.value)}
                  className="ivory-input w-full p-2.5 rounded-sm text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-[#141519] uppercase tracking-wider block">
                    4. Applicable State Sales Tax ($) *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoTax}
                    className="text-[10px] text-[#A38054] underline hover:text-[#141519]"
                  >
                    Est. Tax
                  </button>
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={taxMajor}
                  onChange={(e) => setTaxMajor(e.target.value)}
                  className="ivory-input w-full p-2.5 rounded-sm text-xs"
                />
              </div>
            </div>

            {/* Sourcing Assumptions */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-semibold text-[#141519] uppercase tracking-wider block">
                Fulfilment Assumptions & Condition Standards
              </label>
              <textarea
                rows={3}
                value={assumptions}
                onChange={(e) => setAssumptions(e.target.value)}
                className="ivory-input w-full p-2.5 rounded-sm text-xs font-sans"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#F2EDE4]">
              <div>
                <span className="text-[10px] text-[#717584] block">Computed Total:</span>
                <span className="font-serif font-bold text-xl text-[#A38054]">
                  {formatMoney(totalMinor)} USD
                </span>
              </div>

              <button
                type="submit"
                disabled={transmitting}
                className="btn-obsidian px-7 py-3 text-xs flex items-center gap-2 shadow-luxury group"
              >
                <IconSend className="w-3.5 h-3.5 text-[#C4A575] group-hover:translate-x-1 transition-transform" />
                <span>{transmitting ? 'Compiling...' : 'Transmit Quote to Client'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview: Live Client View */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7A603D] uppercase tracking-wider">
            <IconEye className="w-4 h-4 text-[#A38054]" />
            <span>Synchronized Customer Dashboard Preview</span>
          </div>

          <div className="ivory-card p-6 rounded-sm bg-white border border-[#D8C3A4] shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-3">
              <div>
                <span className="font-serif font-bold text-sm text-[#141519] block">
                  {activeRequest.productName}
                </span>
                <span className="text-[10px] font-mono text-[#717584]">
                  {activeRequest.brand} &bull; Sizing: {activeRequest.sizeVariant}
                </span>
              </div>
              <span className="bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-mono px-2 py-0.5 rounded-xs font-semibold">
                Valid 48h
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#5C5F6D]">Product Acquisition:</span>
                <span className="font-semibold text-[#141519]">{formatMoney(prodMinor)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C5F6D]">Concierge Sourcing Fee:</span>
                <span className="font-semibold text-[#141519]">{formatMoney(feeMinor)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C5F6D]">Insured Domestic Courier:</span>
                <span className="font-semibold text-[#141519]">{formatMoney(shipMinor)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C5F6D]">State Sales Tax:</span>
                <span className="font-semibold text-[#141519]">{formatMoney(taxMinor)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE4D9] flex justify-between items-center">
              <div>
                <span className="font-serif font-bold text-sm text-[#141519] block">
                  Total Confirmed Payable
                </span>
                <span className="text-[10px] font-mono text-[#717584]">All inclusive USD</span>
              </div>
              <span className="font-serif font-bold text-xl text-[#A38054]">
                {formatMoney(totalMinor)} USD
              </span>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2] text-[11px] font-sans text-[#5C5F6D] leading-relaxed">
              <strong className="text-[#141519] block font-mono text-[10px] uppercase mb-0.5">
                Covenant Notes:
              </strong>
              {assumptions}
            </div>

            <div className="text-[10.5px] text-[#717584] font-mono text-center">
              Client can accept or decline with 1-click in their portal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminQuotesPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center font-mono text-xs text-[#717584]">Loading Quote Builder...</div>}>
      <AdminQuotesContent />
    </Suspense>
  );
}
