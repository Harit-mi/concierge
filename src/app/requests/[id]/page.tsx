'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  IconFileText,
  IconClock,
  IconCheckCircle,
  IconPackage,
  IconArrowRight,
  IconArrowLeft,
  IconAlert,
  IconReceipt,
  IconExternalLink,
  IconChat,
  IconShield,
  IconSend,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';
import { fetchRequestByIdAdapter } from '@/lib/api-adapter';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'm1',
      senderRole: 'CONCIERGE_OPERATOR',
      senderName: 'Julian Thorne (Concierge)',
      content: 'Your sourcing request has been cataloged. We have verified seller legitimacy with authorized retail partners and prepared your itemized quote.',
      createdAt: '2026-10-25T15:00:00Z',
    },
  ]);

  useEffect(() => {
    async function load() {
      const res = await fetchRequestByIdAdapter(id);
      setData(res);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        senderRole: 'CUSTOMER',
        senderName: 'Alexander Hayes (You)',
        content: messageText.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setMessageText('');
  };

  if (loading || !data) {
    return (
      <div className="py-24 text-center font-mono text-xs text-[#717584]">
        Loading request dossier...
      </div>
    );
  }

  const { request, quote, order } = data;

  return (
    <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-[#141519]">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/requests"
          className="text-xs font-mono uppercase tracking-wider text-[#717584] hover:text-[#141519] flex items-center gap-1.5"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Requests</span>
        </Link>
        <span className="text-[10.5px] font-mono text-[#717584]">
          Ref: {request.referenceNumber}
        </span>
      </div>

      {/* Header Dossier */}
      <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F2EDE4] gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A603D] font-semibold block">
              Sourcing Specification Dossier
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141519]">
              {request.productName}
            </h1>
            <div className="text-xs font-mono text-[#717584] mt-0.5">
              Brand: <strong className="text-[#141519]">{request.brand}</strong> &bull; Category: {request.category}
            </div>
          </div>
          <StatusBadge status={request.status as any} size="md" />
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-2">
          <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
            <span className="text-[10px] text-[#717584] block">Requested Sizing</span>
            <span className="font-bold text-[#141519]">{request.sizeVariant || 'Not Specified'}</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
            <span className="text-[10px] text-[#717584] block">Colorway</span>
            <span className="font-bold text-[#141519]">{request.colorVariant || 'Standard'}</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
            <span className="text-[10px] text-[#717584] block">Quantity</span>
            <span className="font-bold text-[#141519]">{request.quantity} Unit(s)</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2]">
            <span className="text-[10px] text-[#717584] block">Target Budget</span>
            <span className="font-bold text-[#141519]">
              {request.maxBudgetMajor ? `$${request.maxBudgetMajor} USD` : 'Market Rate'}
            </span>
          </div>
        </div>

        {/* Product Media & URL */}
        <div className="pt-2 flex flex-col sm:flex-row gap-5 items-start">
          {request.imageUrl && (
            <div className="w-36 h-36 rounded-xs bg-[#FAF8F5] border border-[#E2DDD2] overflow-hidden shrink-0">
              <img src={request.imageUrl} alt={request.productName} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-2 text-xs font-sans flex-1">
            <h4 className="font-mono text-xs font-bold text-[#141519] uppercase tracking-wider">
              Procurement Coordinates:
            </h4>
            <p className="text-[#5C5F6D]">
              Destination PIN: <strong>{request.destinationPostalCode} (Mainland United States)</strong>
            </p>
            {request.productUrl && (
              <p className="text-[#7A603D] font-mono break-all flex items-center gap-1">
                <span>Reference URL: </span>
                <a href={request.productUrl} target="_blank" rel="noreferrer" className="underline hover:text-[#141519] flex items-center gap-1">
                  <span>{request.productUrl}</span>
                  <IconExternalLink className="w-3 h-3" />
                </a>
              </p>
            )}
            <p className="text-[11px] text-[#717584] font-mono pt-1">
              Logged on {new Date(request.createdAt).toLocaleString()} &bull; Assigned to Senior Sourcing Desk
            </p>
          </div>
        </div>
      </div>

      {/* LINKED QUOTE CALLOUT (If Quote Exists) */}
      {quote && (
        <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#D8C3A4] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F2EDE4] gap-2">
            <div className="flex items-center gap-2">
              <IconReceipt className="w-4 h-4 text-[#A38054]" />
              <h3 className="font-serif font-bold text-lg text-[#141519]">
                Itemized Quote Prepared: {quote.quoteNumber}
              </h3>
            </div>
            <span className="text-xs font-mono text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-xs font-semibold">
              Status: {quote.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div>
              <span className="text-[#717584] block text-[10px]">Product Price</span>
              <span className="font-semibold text-[#141519]">{formatMoney(quote.productPriceMinor)}</span>
            </div>
            <div>
              <span className="text-[#717584] block text-[10px]">Concierge Fee</span>
              <span className="font-semibold text-[#141519]">{formatMoney(quote.sourcingFeeMinor)}</span>
            </div>
            <div>
              <span className="text-[#717584] block text-[10px]">Insured Courier</span>
              <span className="font-semibold text-[#141519]">{formatMoney(quote.shippingFeeMinor)}</span>
            </div>
            <div>
              <span className="text-[#717584] block text-[10px]">Sales Tax</span>
              <span className="font-semibold text-[#141519]">{formatMoney(quote.applicableTaxesMinor)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F2EDE4] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-[#717584] block">Total Payable:</span>
              <span className="font-serif font-bold text-xl text-[#A38054]">
                {formatMoney(quote.totalPayableMinor)} USD
              </span>
            </div>
            <Link
              href={`/quotes/${quote.id}`}
              className="btn-bronze w-full sm:w-auto px-6 py-2.5 rounded-xs text-xs font-mono uppercase tracking-wider font-semibold shadow-xs flex items-center justify-center gap-2"
            >
              <span>Inspect & Approve Quote</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* LINKED ORDER CALLOUT (If Order Created) */}
      {order && (
        <div className="ivory-card p-6 rounded-sm bg-white border border-[#EAE4D9] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconPackage className="w-5 h-5 text-[#A38054]" />
            <div>
              <span className="text-[10px] font-mono text-[#717584] uppercase">Fulfilment Order Linked:</span>
              <h4 className="font-serif font-bold text-base text-[#141519]">{order.orderNumber}</h4>
            </div>
          </div>
          <Link
            href={`/orders/${order.id}`}
            className="btn-softblack px-4 py-2 rounded-xs text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5"
          >
            <span>Open Order Timeline</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* REQUEST-LINKED CONVERSATION THREAD */}
      <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] space-y-6">
        <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-3">
          <div className="flex items-center gap-2">
            <IconChat className="w-4 h-4 text-[#A38054]" />
            <h3 className="font-serif font-bold text-base text-[#141519]">
              Inquiry Communications Log
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#717584]">Encrypted Client Channel</span>
        </div>

        {/* Message bubbles */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {messages.map((m) => {
            const isCustomer = m.senderRole === 'CUSTOMER';
            return (
              <div
                key={m.id}
                className={`p-4 rounded-sm text-xs font-sans max-w-xl ${
                  isCustomer
                    ? 'ml-auto bg-[#F5EFE4] text-[#141519] border border-[#D8C3A4]'
                    : 'mr-auto bg-[#FAF8F5] text-[#141519] border border-[#E2DDD2]'
                }`}
              >
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] mb-1.5 opacity-70">
                  <span className="font-bold">{m.senderName}</span>
                  <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="leading-relaxed">{m.content}</p>
              </div>
            );
          })}
        </div>

        {/* Message Input form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#F2EDE4]">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type note or question for your sourcing specialist..."
            className="ivory-input flex-1 p-3 rounded-sm text-xs"
          />
          <button
            type="submit"
            className="btn-softblack px-5 py-3 rounded-sm text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 shrink-0"
          >
            <span>Send</span>
            <IconSend className="w-3.5 h-3.5 text-[#DFCCA8]" />
          </button>
        </form>
      </div>
    </div>
  );
}
