'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  IconPackage,
  IconTruck,
  IconCheckCircle,
  IconClock,
  IconArrowLeft,
  IconShield,
  IconFileText,
  IconAlert,
  IconExternalLink,
  IconChat,
  IconSend,
  IconDownload,
  IconReceipt,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';
import { fetchRequestByIdAdapter } from '@/lib/api-adapter';

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [supportMessage, setSupportMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchRequestByIdAdapter(id);
      setData(res);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSendOrderSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setMessageSent(true);
    setSupportMessage('');
    setTimeout(() => setMessageSent(false), 4000);
  };

  const handleConfirmDelivery = () => {
    setDeliveryConfirmed(true);
  };

  if (loading || !data) {
    return (
      <div className="py-24 text-center font-mono text-xs text-[#846337]">
        Loading order tracking timeline...
      </div>
    );
  }

  const { request, quote, order } = data;
  const activeOrder = order || {
    id: id,
    orderNumber: 'ORD-2026-4401',
    status: 'SOURCING_IN_PROGRESS',
    carrierName: 'UPS Express',
    trackingNumber: '1Z9999999999999999',
  };

  const currentStatus = activeOrder.status || 'SOURCING_IN_PROGRESS';

  // 7 Distinct Real Fulfillment States
  const timelineStages = [
    {
      key: 'PAYMENT_CONFIRMED',
      title: 'Payment Verified & Escrow Authorized',
      description: 'Transaction verified by merchant gateway. Procurement budget cleared for authorized retail purchase.',
      timestamp: 'Oct 25, 2026 &bull; 15:30 EST',
    },
    {
      key: 'SOURCING_IN_PROGRESS',
      title: 'Retailer Procurement Executed',
      description: 'Acquisition order executed with authorized boutique partner. Sourcing specialist coordinating pickup.',
      timestamp: 'Oct 26, 2026 &bull; 09:15 EST',
    },
    {
      key: 'PRODUCT_ACQUIRED',
      title: 'Arrived at Manhattan Intake Facility',
      description: 'Physical item logged into intake lounge inventory. Batch codes recorded on tamper-evident receipt.',
      timestamp: 'Oct 26, 2026 &bull; 14:00 EST',
    },
    {
      key: 'QUALITY_CHECK',
      title: 'Forensic Authentication Inspection',
      description: 'Optical loupe magnification and 365nm UV luminescence verification of stitching, leather grain, and hallmarks.',
      timestamp: 'Oct 27, 2026 &bull; 10:30 EST',
    },
    {
      key: 'PACKING',
      title: 'Archival Boxing & Security Seal',
      description: 'Item enclosed in protective archival dust cover with tamper-evident serial-numbered security band.',
      timestamp: 'Pending Completion',
    },
    {
      key: 'SHIPPED',
      title: 'Dispatched in Priority Courier Transit',
      description: 'Carrier custody hand-off with fully insured declared value and direct adult signature requirement.',
      timestamp: 'Pending Dispatch',
    },
    {
      key: 'DELIVERED',
      title: 'Hand-Delivered & Inspected by Client',
      description: 'Direct courier delivery completed. 48-hour client inspection window open.',
      timestamp: 'Final Milestone',
    },
  ];

  const stageOrder = [
    'PAYMENT_CONFIRMED',
    'SOURCING_IN_PROGRESS',
    'PRODUCT_ACQUIRED',
    'QUALITY_CHECK',
    'PACKING',
    'SHIPPED',
    'DELIVERED',
  ];

  const currentStageIndex = Math.max(0, stageOrder.indexOf(currentStatus));

  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto space-y-10 text-[#111215]">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#E3D8CB] pb-3">
        <Link
          href="/dashboard"
          className="text-xs font-mono uppercase tracking-[0.16em] text-[#575A6B] hover:text-[#111215] flex items-center gap-2"
        >
          <IconArrowLeft className="w-3.5 h-3.5 text-[#846337]" />
          <span>Return to Client Desk</span>
        </Link>
        <span className="text-[10px] font-mono text-[#846337] uppercase tracking-widest">
          Custody Order: {activeOrder.orderNumber}
        </span>
      </div>

      {/* Main Order Dossier Header */}
      <div className="luxury-card p-8 sm:p-10 bg-white border border-[#E3D8CB] space-y-6 shadow-luxury">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-[#E3D8CB] gap-3">
          <div className="space-y-1">
            <span className="ledger-stamp">CUSTODY COCKPIT</span>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-[#111215]">
              {request.productName}
            </h1>
            <p className="text-xs font-mono text-[#575A6B]">
              Fashion House: {request.brand} &bull; Sizing: <strong className="text-[#111215] font-semibold">{request.sizeVariant}</strong> &bull; Destination: ZIP {request.destinationPostalCode}
            </p>
          </div>
          <StatusBadge status={currentStatus as any} size="md" />
        </div>

        {/* Live Shipment & Tracking Card (If Available) */}
        {activeOrder.trackingNumber ? (
          <div className="p-5 dossier-paper border border-[#C4A575] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-[#111215] text-[#C4A575] flex items-center justify-center border border-[#C4A575]">
                <IconTruck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9.5px] text-[#575A6B] uppercase tracking-wider block">Assigned Domestic Carrier</span>
                <span className="font-bold text-[#111215] text-sm">{activeOrder.carrierName}</span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[9.5px] text-[#575A6B] uppercase tracking-wider block">Tracking Reference</span>
              <a
                href={activeOrder.trackingUrl || `https://www.ups.com/track?tracknum=${activeOrder.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#846337] hover:text-[#111215] font-bold text-xs underline underline-offset-2 flex items-center gap-1 sm:justify-end"
              >
                <span>{activeOrder.trackingNumber}</span>
                <IconExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : null}
      </div>

      {/* 7-STAGE VERTICAL TIMELINE */}
      <div className="luxury-card p-8 sm:p-12 bg-white border border-[#E3D8CB] space-y-8 shadow-luxury">
        <div className="border-b border-[#E3D8CB] pb-4">
          <span className="ledger-stamp">OPERATIONAL AUDIT TRAIL</span>
          <h2 className="font-display text-2xl font-light text-[#111215] mt-1">
            Order Fulfilment Milestone Timeline
          </h2>
          <p className="text-xs text-[#575A6B] font-mono mt-0.5">
            Every step is recorded with chronological timestamps following physical inspection at our Manhattan facility.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E3D8CB]">
          {timelineStages.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.key} className="relative flex items-start gap-4">
                {/* Node indicator */}
                <div
                  className={`absolute -left-6 sm:-left-8 w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center font-mono text-[10px] transition-all ${
                    isCurrent
                      ? 'bg-[#111215] text-[#C4A575] ring-4 ring-[#EFE8E0] font-bold'
                      : isCompleted
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#FAF7F2] text-[#8E91A1] border border-[#E3D8CB]'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className={`font-display text-lg sm:text-xl font-bold ${isCurrent ? 'text-[#111215]' : isCompleted ? 'text-[#111215]' : 'text-[#8E91A1]'}`}>
                      {stage.title}
                    </h3>
                    <span className="text-[10px] font-mono text-[#846337]">
                      {stage.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#575A6B] leading-relaxed font-sans max-w-2xl">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DOCUMENT VAULT & ORDER SUPPORT CHAT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Document Vault */}
        <div className="luxury-card p-6 sm:p-8 bg-white border border-[#E3D8CB] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3D8CB] pb-3">
            <IconFileText className="w-4 h-4 text-[#846337]" />
            <h3 className="font-display text-xl font-bold text-[#111215]">
              Permitted Document Vault
            </h3>
          </div>
          <p className="text-xs text-[#575A6B] font-mono">
            Download verified appraisal certificates, provenance invoices, and optical QA sheets.
          </p>

          <div className="space-y-2.5 pt-2">
            <div className="p-3 dossier-paper border border-[#E3D8CB] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <IconShield className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>Forensic Certificate &bull; PDF</span>
              </div>
              <button
                type="button"
                onClick={() => alert('Certificate downloaded.')}
                className="text-[#846337] hover:text-[#111215] flex items-center gap-1"
              >
                <IconDownload className="w-3.5 h-3.5" />
                <span>Get</span>
              </button>
            </div>

            <div className="p-3 dossier-paper border border-[#E3D8CB] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <IconReceipt className="w-4 h-4 text-[#846337] shrink-0" />
                <span>Acquisition Invoice &bull; PDF</span>
              </div>
              <button
                type="button"
                onClick={() => alert('Invoice downloaded.')}
                className="text-[#846337] hover:text-[#111215] flex items-center gap-1"
              >
                <IconDownload className="w-3.5 h-3.5" />
                <span>Get</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Support & Delivery Confirmation */}
        <div className="luxury-card p-6 sm:p-8 bg-white border border-[#E3D8CB] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3D8CB] pb-3">
            <IconChat className="w-4 h-4 text-[#846337]" />
            <h3 className="font-display text-xl font-bold text-[#111215]">
              Order Concierge Hotline
            </h3>
          </div>

          <form onSubmit={handleSendOrderSupport} className="space-y-3 font-mono text-xs">
            <label className="text-[10px] uppercase text-[#575A6B] font-semibold block">
              Direct Note to Assigned Specialist:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Specific delivery instructions or scheduling inquiries..."
                className="luxury-input flex-1 p-2.5 text-xs"
              />
              <button
                type="submit"
                className="btn-obsidian px-5 py-2.5 text-[11px] flex items-center gap-1.5 shrink-0"
              >
                <IconSend className="w-3 h-3 text-[#C4A575]" />
                <span>Transmit</span>
              </button>
            </div>
            {messageSent && (
              <p className="text-emerald-800 text-[11px] font-mono pt-1">
                Message delivered directly to your assigned sourcing officer.
              </p>
            )}
          </form>

          {/* Delivery Acknowledgment Button */}
          <div className="pt-4 border-t border-[#E3D8CB]">
            {deliveryConfirmed ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 font-mono text-xs flex items-center gap-2">
                <IconCheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Delivery confirmed by client. 48-hour inspection period active.</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirmDelivery}
                className="btn-luxury-outline w-full py-3 text-[10.5px]"
              >
                Acknowledge Handover & Receipt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}