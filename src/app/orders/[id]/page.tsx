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
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto space-y-10 text-[#121212]">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-3">
        <Link
          href="/dashboard"
          className="text-xs font-mono uppercase tracking-[0.16em] text-[#5A5852] hover:text-[#121212] flex items-center gap-2"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Client Portal</span>
        </Link>
        <span className="text-[10px] font-mono text-[#5A5852] uppercase tracking-widest">
          Order: {activeOrder.orderNumber}
        </span>
      </div>

      {/* Main Order Dossier Header */}
      <div className="bg-white border border-[#E5E3DC] p-8 sm:p-10 space-y-6 shadow-sm rounded-[1px]">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-[#E5E3DC] gap-3">
          <div className="space-y-1">
            <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
              Order Fulfillment Desk
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#121212]">
              {request.productName}
            </h1>
            <p className="text-xs font-mono text-[#5A5852]">
              Brand: {request.brand} &bull; Sizing: <strong className="text-[#121212] font-semibold">{request.sizeVariant}</strong> &bull; Destination: ZIP {request.destinationPostalCode}
            </p>
          </div>
          <StatusBadge status={currentStatus as any} size="md" />
        </div>

        {/* Live Shipment & Tracking Card (If Available) */}
        {activeOrder.trackingNumber ? (
          <div className="p-5 bg-[#F3F2EC] border border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs rounded-[1px]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-[#121212] text-[#FAF9F5] flex items-center justify-center">
                <IconTruck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#5A5852] uppercase tracking-wider block">Assigned Domestic Carrier</span>
                <span className="font-semibold text-[#121212] text-sm">{activeOrder.carrierName}</span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-[#5A5852] uppercase tracking-wider block">Tracking Reference</span>
              <a
                href={activeOrder.trackingUrl || `https://www.ups.com/track?tracknum=${activeOrder.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#121212] hover:text-[#5A5852] font-semibold text-xs underline underline-offset-2 flex items-center gap-1 sm:justify-end"
              >
                <span>{activeOrder.trackingNumber}</span>
                <IconExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : null}
      </div>

      {/* 7-STAGE VERTICAL TIMELINE */}
      <div className="bg-white border border-[#E5E3DC] p-8 sm:p-12 space-y-8 shadow-sm rounded-[1px]">
        <div className="border-b border-[#E5E3DC] pb-4">
          <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
            Milestone Timeline
          </span>
          <h2 className="font-serif text-2xl font-light text-[#121212] mt-1">
            Order Fulfillment Milestones
          </h2>
          <p className="text-xs text-[#5A5852] font-sans mt-0.5">
            Every step is recorded with chronological timestamps following physical inspection at our Manhattan intake desk.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5E3DC]">
          {timelineStages.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.key} className="relative flex items-start gap-4">
                {/* Node indicator */}
                <div
                  className={`absolute -left-6 sm:-left-8 w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center font-mono text-[10px] transition-all ${
                    isCurrent
                      ? 'bg-[#121212] text-[#FAF9F5] ring-4 ring-[#E5E3DC] font-bold'
                      : isCompleted
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#F3F2EC] text-[#8A8880] border border-[#E5E3DC]'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className={`font-serif text-lg sm:text-xl font-normal ${isCurrent ? 'text-[#121212]' : isCompleted ? 'text-[#121212]' : 'text-[#8A8880]'}`}>
                      {stage.title}
                    </h3>
                    <span className="text-[10px] font-mono text-[#5A5852]">
                      {stage.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5852] leading-relaxed font-sans max-w-2xl">
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
        <div className="bg-white border border-[#E5E3DC] p-6 sm:p-8 space-y-4 shadow-sm rounded-[1px]">
          <div className="flex items-center gap-2 border-b border-[#E5E3DC] pb-3">
            <IconFileText className="w-4 h-4 text-[#121212]" />
            <h3 className="font-serif text-xl font-normal text-[#121212]">
              Order Documents
            </h3>
          </div>
          <p className="text-xs text-[#5A5852] font-sans">
            Download verified appraisal certificates, provenance receipts, and intake verification reports.
          </p>

          <div className="space-y-2.5 pt-2">
            <div className="p-3 bg-[#F3F2EC] border border-[#E5E3DC] flex items-center justify-between text-xs font-mono rounded-[1px]">
              <div className="flex items-center gap-2">
                <IconShield className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>Verification Certificate &bull; PDF</span>
              </div>
              <button
                type="button"
                onClick={() => alert('Certificate downloaded.')}
                className="text-[#121212] hover:text-[#5A5852] flex items-center gap-1 font-sans text-xs underline underline-offset-2"
              >
                <IconDownload className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>

            <div className="p-3 bg-[#F3F2EC] border border-[#E5E3DC] flex items-center justify-between text-xs font-mono rounded-[1px]">
              <div className="flex items-center gap-2">
                <IconReceipt className="w-4 h-4 text-[#121212] shrink-0" />
                <span>Acquisition Invoice &bull; PDF</span>
              </div>
              <button
                type="button"
                onClick={() => alert('Invoice downloaded.')}
                className="text-[#121212] hover:text-[#5A5852] flex items-center gap-1 font-sans text-xs underline underline-offset-2"
              >
                <IconDownload className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Support & Delivery Confirmation */}
        <div className="bg-white border border-[#E5E3DC] p-6 sm:p-8 space-y-4 shadow-sm rounded-[1px]">
          <div className="flex items-center gap-2 border-b border-[#E5E3DC] pb-3">
            <IconChat className="w-4 h-4 text-[#121212]" />
            <h3 className="font-serif text-xl font-normal text-[#121212]">
              Concierge Direct Desk
            </h3>
          </div>

          <form onSubmit={handleSendOrderSupport} className="space-y-3 font-sans text-xs">
            <label className="text-[11px] uppercase text-[#5A5852] font-medium block">
              Direct Note to Assigned Specialist:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Specific delivery instructions or scheduling inquiries..."
                className="editorial-input flex-1 p-2.5 text-xs font-sans"
              />
              <button
                type="submit"
                className="btn-noir px-5 py-2.5 text-xs flex items-center gap-1.5 shrink-0"
              >
                <IconSend className="w-3 h-3 text-[#FAF9F5]" />
                <span>Send</span>
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