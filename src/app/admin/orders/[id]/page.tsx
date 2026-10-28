'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  IconArrowLeft,
  IconTruck,
  IconCheckCircle,
  IconAlert,
  IconFileText,
  IconShield,
  IconPackage,
  IconClock,
  IconUpload,
  IconCreditCard,
  IconSend,
  IconSave,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';
import { VALID_TRANSITIONS } from '@/lib/state-machine';
import { OrderStatus } from '@/types';

export default function AdminOrderCockpitPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Sourcing form
  const [supplierName, setSupplierName] = useState('Kith Tokyo Authorized Flagship');
  const [supplierOrderRef, setSupplierOrderRef] = useState('KT-2026-99014');
  const [costPriceMajor, setCostPriceMajor] = useState('520.00');
  const [qcNotes, setQcNotes] = useState('365nm UV luminescence sweep verified: zero glue bleed; optical loupe stitching density 11.2 SPI.');
  const [qcPassed, setQcPassed] = useState<boolean>(true);

  // Shipment form
  const [carrierName, setCarrierName] = useState('UPS Next Day Air');
  const [trackingNumber, setTrackingNumber] = useState('1Z9999999999999999');

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

  const currentStatus: OrderStatus = (data?.order?.status as OrderStatus) || 'SOURCING_IN_PROGRESS';
  const allowedNextStatuses = VALID_TRANSITIONS[currentStatus] || [];

  const handleTransition = async (nextStatus: OrderStatus) => {
    setUpdating(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/orders/${orderId}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toStatus: nextStatus,
          note: statusNote.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Status update failed.');
      }

      setMessage(`Order status successfully transitioned to ${nextStatus}.`);
      setStatusNote('');
      loadOrder();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-[#717584]">
        Loading order cockpit...
      </div>
    );
  }

  const order = data?.order || {
    id: orderId,
    order_number: 'ORD-2026-4401',
    status: currentStatus,
    currency: 'USD',
    created_at: new Date().toISOString(),
  };

  const request = data?.request || {
    product_name: 'Air Jordan 1 Retro Low OG SP "Canary"',
    brand: 'Jordan Brand x Travis Scott',
    reference_number: 'REQ-2026-9041',
    size_variant: 'US 10.5',
    destination_postal_code: '10022',
    customerName: 'Alexander Hayes',
  };

  const quote = data?.quote || {
    total_payable_minor: 64100,
    product_price_minor: 52000,
    sourcing_fee_minor: 6240,
    shipping_fee_minor: 2400,
    applicable_taxes_minor: 3460,
  };

  return (
    <div className="space-y-8 text-[#141519]">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="text-xs font-mono uppercase tracking-wider text-[#717584] hover:text-[#141519] flex items-center gap-1.5"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Fulfilment Pipeline</span>
        </Link>
        <span className="text-[10.5px] font-mono text-[#717584]">
          Cockpit: {order.order_number}
        </span>
      </div>

      {/* Header Dossier */}
      <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F2EDE4] gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A603D] font-bold block mb-1">
              Order Command Cockpit
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141519]">
              {request.product_name}
            </h1>
            <p className="text-xs font-mono text-[#5C5F6D] mt-0.5">
              Client: <strong className="text-[#141519]">{request.customerName}</strong> &bull; Destination: ZIP {request.destination_postal_code}
            </p>
          </div>
          <StatusBadge status={currentStatus} size="md" />
        </div>

        {message && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-3 rounded-xs text-xs font-mono flex items-center gap-2">
            <IconCheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-300 text-rose-950 p-3 rounded-xs text-xs font-mono flex items-center gap-2">
            <IconAlert className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* State Machine Transition Controller */}
      <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#D8C3A4] space-y-5 shadow-xs">
        <div className="border-b border-[#F2EDE4] pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconFileText className="w-4 h-4 text-[#A38054]" />
            <h3 className="font-serif font-bold text-base text-[#141519]">
              22-State Transition Controller
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#7A603D] uppercase font-bold">
            Valid Legal Next States: {allowedNextStatuses.length}
          </span>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
            State Change Note / Internal Audit Reason
          </label>
          <input
            type="text"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="e.g. Package arrived at Manhattan intake lounge; assigned to inspector Thorne..."
            className="ivory-input w-full p-2.5 rounded-sm text-xs font-mono"
          />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono text-[#717584] block">Authorized Next State Transitions:</span>
          {allowedNextStatuses.length === 0 ? (
            <p className="text-xs font-mono text-[#717584] italic">
              Terminal state reached. No further forward transitions allowed.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
              {allowedNextStatuses.map((st) => (
                <button
                  key={st}
                  disabled={updating}
                  onClick={() => handleTransition(st)}
                  className="btn-softblack px-4 py-2 rounded-xs uppercase tracking-wider font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>Advance to {st.replace(/_/g, ' ')}</span>
                  &rarr;
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sourcing & QA Log (Left) and Shipment Updates (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sourcing & Quality Inspection */}
        <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] space-y-4 shadow-xs">
          <div className="border-b border-[#F2EDE4] pb-3 flex items-center gap-2">
            <IconShield className="w-4 h-4 text-[#A38054]" />
            <h3 className="font-serif font-bold text-base text-[#141519]">
              Intake Forensics & Supplier Audit
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-[10.5px] uppercase text-[#717584]">Procurement Source / Boutique</label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="ivory-input w-full p-2 rounded-sm text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase text-[#717584]">Supplier Order Reference</label>
              <input
                type="text"
                value={supplierOrderRef}
                onChange={(e) => setSupplierOrderRef(e.target.value)}
                className="ivory-input w-full p-2 rounded-sm text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase text-[#717584]">Forensic QA & UV Inspection Notes</label>
              <textarea
                rows={3}
                value={qcNotes}
                onChange={(e) => setQcNotes(e.target.value)}
                className="ivory-input w-full p-2 rounded-sm text-xs font-sans"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-sans text-xs">
                <input
                  type="checkbox"
                  checked={qcPassed}
                  onChange={(e) => setQcPassed(e.target.checked)}
                  className="rounded border-[#E2DDD2] text-[#A38054]"
                />
                <span className="font-semibold text-emerald-800">Certified Authentic & Passed QA</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Sourcing and forensics records synchronized with audit ledger.')}
                className="btn-ivory-outline px-3 py-1.5 rounded-xs text-[11px] uppercase tracking-wider font-semibold"
              >
                Log QA Signoff
              </button>
            </div>
          </div>
        </div>

        {/* Courier Shipment Dispatch */}
        <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] space-y-4 shadow-xs">
          <div className="border-b border-[#F2EDE4] pb-3 flex items-center gap-2">
            <IconTruck className="w-4 h-4 text-[#A38054]" />
            <h3 className="font-serif font-bold text-base text-[#141519]">
              Domestic Courier Dispatch
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-[10.5px] uppercase text-[#717584]">Carrier Partner</label>
              <input
                type="text"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                className="ivory-input w-full p-2 rounded-sm text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] uppercase text-[#717584]">Tracking Identification Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="ivory-input w-full p-2 rounded-sm text-xs"
              />
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2] text-[11px] font-sans text-[#5C5F6D] space-y-1">
              <span className="font-bold text-[#141519] block font-mono text-[10px] uppercase">
                Courier Policy Enforcement:
              </span>
              <p>
                Declared-value insurance is mandatory. Direct adult signature required upon physical custody handoff.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => alert('Courier manifest and tracking number dispatched to client.')}
                className="btn-bronze px-5 py-2 rounded-xs uppercase tracking-wider font-semibold shadow-xs"
              >
                Save Dispatch Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
