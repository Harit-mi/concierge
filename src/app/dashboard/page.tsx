'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IconFileText,
  IconClock,
  IconPackage,
  IconArrowRight,
  IconReceipt,
  IconTruck,
  IconExternalLink,
  IconShield,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';
import { fetchRequestsAdapter, SourcingRequestItem } from '@/lib/api-adapter';

export default function DashboardPage() {
  const [requests, setRequests] = useState<SourcingRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchRequestsAdapter();
      setRequests(data);
      setLoading(false);
    }
    load();
  }, []);

  const pendingQuotes = requests.filter((r) => r.status === 'QUOTE_SENT');
  const activeOrders = requests.filter(
    (r) => r.orderId && !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(r.status)
  );
  const pastOrders = requests.filter((r) => r.status === 'DELIVERED');
  const underReview = requests.filter((r) => ['REQUEST_SUBMITTED', 'UNDER_REVIEW', 'MORE_INFORMATION_REQUIRED'].includes(r.status));

  return (
    <div className="space-y-12 text-[#121212]">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white border border-[#E5E3DC] p-8 sm:p-10 shadow-sm rounded-[1px]">
        <div className="space-y-2">
          <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
            Client Portal &bull; Private Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#121212] tracking-tight">
            Client Sourcing Desk
          </h1>
          <p className="text-xs text-[#5A5852] font-sans">
            Manage your active commissions, inspect binding quotations, and track order fulfillment.
          </p>
        </div>

        <Link
          href="/request"
          className="btn-noir text-xs px-7 py-4 shrink-0 flex items-center justify-center gap-2.5 group"
        >
          <span>Commission New Piece</span>
          <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Ledger Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E5E3DC] border border-[#E5E3DC]">
        <div className="bg-white p-6 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A5852] block">
            Total Inquiries
          </span>
          <div className="text-3xl font-serif font-light text-[#121212]">{requests.length}</div>
          <div className="text-[11px] text-[#5A5852] font-sans">All commissions</div>
        </div>

        <div className="bg-[#F3F2EC] p-6 space-y-1 border-t-2 md:border-t-0 md:border-l-2 border-[#121212]">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#121212] block font-semibold">
            Pending Quotes
          </span>
          <div className="text-3xl font-serif font-light text-[#121212]">{pendingQuotes.length}</div>
          <div className="text-[11px] text-[#121212] font-sans">Action required (48h hold)</div>
        </div>

        <div className="bg-white p-6 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A5852] block">
            In Fulfillment
          </span>
          <div className="text-3xl font-serif font-light text-[#121212]">{activeOrders.length}</div>
          <div className="text-[11px] text-[#5A5852] font-sans">Intake / In Transit</div>
        </div>

        <div className="bg-white p-6 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A5852] block">
            Delivered
          </span>
          <div className="text-3xl font-serif font-light text-emerald-900">{pastOrders.length}</div>
          <div className="text-[11px] text-emerald-700 font-sans">Completed deliveries</div>
        </div>
      </div>

      {/* QUOTES AWAITING APPROVAL (High Priority Action) */}
      {pendingQuotes.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-3">
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
                Action Required
              </span>
              <h2 className="font-serif text-2xl font-light text-[#121212]">
                Quotations Awaiting Authorization
              </h2>
            </div>
            <span className="text-[10.5px] font-mono text-[#121212] bg-[#F3F2EC] border border-[#E5E3DC] px-3 py-1 font-medium">
              48-Hour Rate Hold Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingQuotes.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white border border-[#E5E3DC] p-6 shadow-sm flex flex-col sm:flex-row gap-6 hover:border-[#121212] transition-all rounded-[1px]"
              >
                <div className="w-28 h-28 bg-[#F3F2EC] border border-[#E5E3DC] overflow-hidden shrink-0 self-start">
                  {q.imageUrl ? (
                    <img src={q.imageUrl} alt={q.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#8A8880]">
                      Reference
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-2">
                    <span className="text-[10px] font-mono text-[#5A5852] uppercase tracking-widest font-medium">
                      Item 0{idx + 1} &bull; {q.referenceNumber}
                    </span>
                    <span className="bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-mono px-2 py-0.5 font-medium">
                      Quote Ready
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-normal text-[#121212] leading-snug">
                    {q.productName}
                  </h3>
                  <div className="text-xs text-[#5A5852] font-sans">
                    Specifications: {q.sizeVariant} &bull; {q.brand}
                  </div>

                  <div className="pt-3 border-t border-[#E5E3DC] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#5A5852] block">Total Binding Quote:</span>
                      <span className="font-serif text-xl font-normal text-[#121212]">
                        {q.quoteTotalMinor ? formatMoney(q.quoteTotalMinor) : '$641.00 USD'}
                      </span>
                    </div>

                    <Link
                      href={`/quotes/${q.quoteId || 'qte-travis-01'}`}
                      className="btn-noir px-5 py-2.5 text-xs flex items-center gap-1.5 group"
                    >
                      <span>Review Quote</span>
                      <IconArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE ORDERS IN FULFILMENT */}
      {activeOrders.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-3">
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
                Order Pipeline
              </span>
              <h2 className="font-serif text-2xl font-light text-[#121212]">
                Active Sourcing & Fulfillment Orders
              </h2>
            </div>
            <Link
              href="/dashboard/requests"
              className="text-xs font-mono text-[#5A5852] hover:text-[#121212] uppercase tracking-wider underline underline-offset-4"
            >
              All Requests &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-[#E5E3DC] p-6 shadow-sm flex flex-col sm:flex-row gap-6 hover:border-[#121212] transition-all rounded-[1px]"
              >
                <div className="w-28 h-28 bg-[#F3F2EC] border border-[#E5E3DC] overflow-hidden shrink-0 self-start">
                  {ord.imageUrl ? (
                    <img src={ord.imageUrl} alt={ord.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#8A8880]">
                      Order
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-2">
                    <span className="text-[10px] font-mono text-[#5A5852] uppercase tracking-wider">
                      {ord.orderNumber || 'ORD-ACTIVE'}
                    </span>
                    <StatusBadge status={ord.status as any} size="sm" />
                  </div>

                  <h3 className="font-serif text-lg font-normal text-[#121212] leading-snug">
                    {ord.productName}
                  </h3>

                  {ord.trackingNumber && (
                    <div className="text-[11px] font-mono text-[#5A5852] flex items-center gap-1.5">
                      <IconTruck className="w-3.5 h-3.5" />
                      <span>{ord.carrierName}: {ord.trackingNumber}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#E5E3DC] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#5A5852] block">Total Value:</span>
                      <span className="font-serif text-lg font-normal text-[#121212]">
                        {ord.quoteTotalMinor ? formatMoney(ord.quoteTotalMinor) : '$745.00 USD'}
                      </span>
                    </div>
                    <Link
                      href={`/orders/${ord.orderId || 'ord-issey-02'}`}
                      className="btn-outline px-4 py-2 text-xs"
                    >
                      <span>Track Order &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SOURCING INQUIRIES ARCHIVE TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-3">
          <div className="flex items-center gap-3">
            <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
              Request Ledger
            </span>
            <h2 className="font-serif text-2xl font-light text-[#121212]">
              Sourcing Inquiries
            </h2>
          </div>
          <Link
            href="/dashboard/requests"
            className="text-xs font-mono text-[#5A5852] hover:text-[#121212] uppercase tracking-wider underline underline-offset-4"
          >
            Filter By Status &rarr;
          </Link>
        </div>

        <div className="overflow-hidden bg-white border border-[#E5E3DC] rounded-[1px] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs divide-y divide-[#E5E3DC]">
              <thead className="bg-[#F3F2EC] text-[#121212] text-[10px] uppercase tracking-[0.16em]">
                <tr>
                  <th className="py-3.5 px-6">Reference</th>
                  <th className="py-3.5 px-6">Item Title</th>
                  <th className="py-3.5 px-6">Sizing</th>
                  <th className="py-3.5 px-6">Target Budget</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E3DC] text-[#121212]">
                {requests.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#121212]">{r.referenceNumber}</td>
                    <td className="py-4 px-6 font-sans font-medium">{r.productName}</td>
                    <td className="py-4 px-6 text-[#5A5852]">{r.sizeVariant || 'Standard'}</td>
                    <td className="py-4 px-6 font-semibold">
                      {r.maxBudgetMajor ? `$${r.maxBudgetMajor} USD` : 'Market rate'}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={r.status as any} size="sm" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/requests/${r.id}`}
                        className="text-xs font-sans text-[#121212] hover:underline underline-offset-2"
                      >
                        Open &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}