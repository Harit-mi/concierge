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
    <div className="space-y-12 text-[#111215]">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 luxury-card p-8 sm:p-10 bg-white border border-[#E3D8CB]">
        <div className="space-y-2">
          <span className="ledger-stamp">
            PORTFOLIO REPOSITORY &bull; PRIVATE CLIENT DESK
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-light text-[#111215] tracking-tight">
            Client Sourcing Desk
          </h1>
          <p className="text-xs text-[#575A6B] font-mono">
            Manage your active commissions, inspect binding quotations, and monitor white-glove custody transit.
          </p>
        </div>

        <Link
          href="/request"
          className="btn-obsidian text-xs px-7 py-4 shrink-0 flex items-center justify-center gap-2.5 shadow-luxury group"
        >
          <span>Commission New Piece</span>
          <IconArrowRight className="w-3.5 h-3.5 text-[#C4A575] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Ledger Metrics Strip (Editorial Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E3D8CB] border border-[#E3D8CB]">
        <div className="bg-white p-6 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#575A6B] block">
            Total Commissions
          </span>
          <div className="text-3xl font-display font-light text-[#111215]">{requests.length}</div>
          <div className="text-[10.5px] text-[#575A6B] font-mono">Domestic repository</div>
        </div>

        <div className="bg-[#FAF7F2] p-6 space-y-1 border-t-2 md:border-t-0 md:border-l-2 border-[#9E7A4A]">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#846337] block font-semibold">
            Pending Appraisals
          </span>
          <div className="text-3xl font-display font-light text-[#846337]">{pendingQuotes.length}</div>
          <div className="text-[10.5px] text-[#846337] font-mono">Action required (48h hold)</div>
        </div>

        <div className="bg-white p-6 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#575A6B] block">
            Custody & Fulfillment
          </span>
          <div className="text-3xl font-display font-light text-[#111215]">{activeOrders.length}</div>
          <div className="text-[10.5px] text-[#575A6B] font-mono">Intake Lab / Transit</div>
        </div>

        <div className="bg-white p-6 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#575A6B] block">
            Archival Deliveries
          </span>
          <div className="text-3xl font-display font-light text-emerald-900">{pastOrders.length}</div>
          <div className="text-[10.5px] text-emerald-700 font-mono">Verified & handed over</div>
        </div>
      </div>

      {/* QUOTES AWAITING APPROVAL (High Priority Action) */}
      {pendingQuotes.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E3D8CB] pb-3">
            <div className="flex items-center gap-3">
              <span className="ledger-stamp">ACTION REQUIRED</span>
              <h2 className="font-display text-2xl font-light text-[#111215]">
                Quotations Awaiting Client Authorization
              </h2>
            </div>
            <span className="text-[10.5px] font-mono text-[#846337] bg-[#F4EFEA] border border-[#C4A575] px-3 py-1 font-semibold">
              48-Hour Rate Hold Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingQuotes.map((q, idx) => (
              <div
                key={q.id}
                className="luxury-card p-6 bg-white border border-[#C4A575] shadow-luxury flex flex-col sm:flex-row gap-6 hover:border-[#846337] transition-all"
              >
                <div className="w-28 h-28 bg-[#FAF7F2] border border-[#E3D8CB] overflow-hidden shrink-0 self-start">
                  {q.imageUrl ? (
                    <img src={q.imageUrl} alt={q.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#8E91A1]">
                      Specimen
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E3D8CB] pb-2">
                    <span className="text-[10px] font-mono text-[#846337] uppercase tracking-widest font-semibold">
                      LOT N° 0{idx + 1} &bull; {q.referenceNumber}
                    </span>
                    <span className="bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-mono px-2 py-0.5 font-semibold">
                      Appraisal Ready
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#111215] leading-snug">
                    {q.productName}
                  </h3>
                  <div className="text-xs text-[#575A6B] font-mono">
                    Specifications: {q.sizeVariant} &bull; {q.brand}
                  </div>

                  <div className="pt-3 border-t border-[#E3D8CB] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#575A6B] block">Total Binding Payable:</span>
                      <span className="font-display text-xl font-bold text-[#846337]">
                        {q.quoteTotalMinor ? formatMoney(q.quoteTotalMinor) : '$641.00 USD'}
                      </span>
                    </div>

                    <Link
                      href={`/quotes/${q.quoteId || 'qte-travis-01'}`}
                      className="btn-obsidian px-5 py-2.5 text-[10.5px] shadow-sm flex items-center gap-1.5 group"
                    >
                      <span>Inspect Quote</span>
                      <IconArrowRight className="w-3 h-3 text-[#C4A575] group-hover:translate-x-1 transition-transform" />
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
          <div className="flex items-center justify-between border-b border-[#E3D8CB] pb-3">
            <div className="flex items-center gap-3">
              <span className="ledger-stamp">CUSTODY PIPELINE</span>
              <h2 className="font-display text-2xl font-light text-[#111215]">
                Active Sourcing & Laboratory Orders
              </h2>
            </div>
            <Link
              href="/dashboard/requests"
              className="text-xs font-mono text-[#846337] hover:text-[#111215] uppercase tracking-wider underline underline-offset-4"
            >
              All Commission Dossiers &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeOrders.map((ord) => (
              <div
                key={ord.id}
                className="luxury-card p-6 bg-white border border-[#E3D8CB] flex flex-col sm:flex-row gap-6 hover:border-[#C4A575] transition-all"
              >
                <div className="w-28 h-28 bg-[#FAF7F2] border border-[#E3D8CB] overflow-hidden shrink-0 self-start">
                  {ord.imageUrl ? (
                    <img src={ord.imageUrl} alt={ord.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#8E91A1]">
                      Lot
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E3D8CB] pb-2">
                    <span className="text-[10px] font-mono text-[#575A6B] uppercase tracking-wider">
                      {ord.orderNumber || 'ORD-ACTIVE'}
                    </span>
                    <StatusBadge status={ord.status as any} size="sm" />
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#111215] leading-snug">
                    {ord.productName}
                  </h3>

                  {ord.trackingNumber && (
                    <div className="text-[11px] font-mono text-[#846337] flex items-center gap-1.5">
                      <IconTruck className="w-3.5 h-3.5" />
                      <span>{ord.carrierName}: {ord.trackingNumber}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#E3D8CB] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#575A6B] block">Disclosed Value:</span>
                      <span className="font-display text-lg font-bold text-[#111215]">
                        {ord.quoteTotalMinor ? formatMoney(ord.quoteTotalMinor) : '$745.00 USD'}
                      </span>
                    </div>
                    <Link
                      href={`/orders/${ord.orderId || 'ord-issey-02'}`}
                      className="btn-luxury-outline px-4 py-2 text-[10.5px]"
                    >
                      <span>Track Custody &rarr;</span>
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
        <div className="flex items-center justify-between border-b border-[#E3D8CB] pb-3">
          <div className="flex items-center gap-3">
            <span className="ledger-stamp">FULL DOSSIER REPOSITORY</span>
            <h2 className="font-display text-2xl font-light text-[#111215]">
              Commission Inquiry Ledger
            </h2>
          </div>
          <Link
            href="/dashboard/requests"
            className="text-xs font-mono text-[#846337] hover:text-[#111215] uppercase tracking-wider underline underline-offset-4"
          >
            Filter By Status &rarr;
          </Link>
        </div>

        <div className="luxury-card overflow-hidden bg-white border border-[#E3D8CB]">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs divide-y divide-[#E3D8CB]">
              <thead className="bg-[#FAF7F2] text-[#846337] text-[10px] uppercase tracking-[0.2em]">
                <tr>
                  <th className="py-3.5 px-6">Reference N°</th>
                  <th className="py-3.5 px-6">Specimen Title</th>
                  <th className="py-3.5 px-6">Specification</th>
                  <th className="py-3.5 px-6">Budget Ceiling</th>
                  <th className="py-3.5 px-6">Current Status</th>
                  <th className="py-3.5 px-6 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3D8CB] text-[#111215]">
                {requests.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#846337]">{r.referenceNumber}</td>
                    <td className="py-4 px-6 font-sans font-medium">{r.productName}</td>
                    <td className="py-4 px-6 text-[#575A6B]">{r.sizeVariant || 'Standard'}</td>
                    <td className="py-4 px-6 font-semibold">
                      {r.maxBudgetMajor ? `$${r.maxBudgetMajor} USD` : 'Market rate'}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={r.status as any} size="sm" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/requests/${r.id}`}
                        className="text-[10.5px] font-mono text-[#846337] hover:text-[#111215] underline underline-offset-2"
                      >
                        Open File &rarr;
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