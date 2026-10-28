'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IconFileText,
  IconSearch,
  IconFilter,
  IconArrowRight,
  IconExternalLink,
  IconReceipt,
  IconPackage,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';
import { fetchRequestsAdapter, SourcingRequestItem } from '@/lib/api-adapter';

export default function DashboardRequestsPage() {
  const [requests, setRequests] = useState<SourcingRequestItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'REVIEW' | 'QUOTED' | 'FULFILMENT' | 'DELIVERED'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchRequestsAdapter();
      setRequests(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const sTerm = searchTerm.toLowerCase();
    const pName = (r.productName || (r as any).product_name || '').toLowerCase();
    const pBrand = (r.brand || '').toLowerCase();
    const pRef = (r.referenceNumber || (r as any).reference_number || '').toLowerCase();

    const matchesSearch =
      !sTerm ||
      pName.includes(sTerm) ||
      pBrand.includes(sTerm) ||
      pRef.includes(sTerm);

    if (!matchesSearch) return false;

    if (selectedTab === 'REVIEW') {
      return ['REQUEST_SUBMITTED', 'UNDER_REVIEW', 'MORE_INFORMATION_REQUIRED', 'REVIEW_REQUIRED'].includes(r.status);
    }
    if (selectedTab === 'QUOTED') {
      return ['QUOTE_SENT', 'QUOTE_ACCEPTED', 'QUOTE_DECLINED', 'AWAITING_PAYMENT'].includes(r.status);
    }
    if (selectedTab === 'FULFILMENT') {
      return ['PAYMENT_CONFIRMED', 'SOURCING_IN_PROGRESS', 'PRODUCT_ACQUIRED', 'QUALITY_CHECK', 'PACKING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(r.status);
    }
    if (selectedTab === 'DELIVERED') {
      return ['DELIVERED', 'REFUNDED', 'CANCELLED', 'REJECTED'].includes(r.status);
    }
    return true;
  });

  return (
    <div className="space-y-8 text-[#141519]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE4D9] pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#7A603D] font-semibold block mb-1">
            Inquiry Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141519]">
            My Sourcing Requests
          </h1>
          <p className="text-xs text-[#5C5F6D] mt-1 font-sans">
            Review status history, inspect submitted specifications, and access prepared quotes.
          </p>
        </div>

        <Link
          href="/request"
          className="btn-obsidian text-xs px-6 py-3.5 flex items-center gap-2 self-start sm:self-center group"
        >
          <span>Submit New Request</span>
          <IconArrowRight className="w-3.5 h-3.5 text-[#C4A575] group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tab pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 font-mono text-xs">
          {[
            { id: 'ALL', label: `All (${requests.length})` },
            { id: 'REVIEW', label: 'Under Review' },
            { id: 'QUOTED', label: 'Quoted' },
            { id: 'FULFILMENT', label: 'In Fulfilment' },
            { id: 'DELIVERED', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xs tracking-wider transition-all uppercase text-[11px] font-semibold whitespace-nowrap border ${
                selectedTab === tab.id
                  ? 'bg-[#141519] text-white border-[#141519]'
                  : 'bg-white text-[#5C5F6D] border-[#E2DDD2] hover:border-[#A38054]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <IconSearch className="w-4 h-4 text-[#8C8F9D] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search brand, item, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ivory-input w-full pl-9 pr-3 py-2 text-xs rounded-sm"
          />
        </div>
      </div>

      {/* Requests Card List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="ivory-card p-12 text-center space-y-3 bg-white border border-[#EAE4D9]">
            <IconFileText className="w-8 h-8 text-[#8C8F9D] mx-auto" />
            <h3 className="font-serif font-bold text-base text-[#141519]">No Requests Found</h3>
            <p className="text-xs text-[#5C5F6D] font-sans max-w-sm mx-auto">
              There are no sourcing requests matching your active filter criteria.
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="ivory-card p-6 rounded-sm bg-white border border-[#EAE4D9] hover:border-[#D8C3A4] transition-all space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F2EDE4] gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#141519]">
                    {req.referenceNumber}
                  </span>
                  <span className="text-[11px] font-mono text-[#717584]">
                    Submitted: {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <StatusBadge status={req.status as any} size="sm" />
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xs bg-[#FAF8F5] border border-[#E2DDD2] overflow-hidden shrink-0">
                  {req.imageUrl ? (
                    <img src={req.imageUrl} alt={req.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-[#8C8F9D]">
                      Photo
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A603D] font-semibold">
                    {req.brand}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#141519]">
                    {req.productName}
                  </h3>
                  <div className="text-xs text-[#5C5F6D] font-mono flex flex-wrap gap-x-4 gap-y-1">
                    <span>Sizing: <strong className="text-[#141519]">{req.sizeVariant}</strong></span>
                    {req.colorVariant && <span>Colour: {req.colorVariant}</span>}
                    <span>Qty: {req.quantity}</span>
                    <span>Destination: ZIP {req.destinationPostalCode}</span>
                  </div>
                </div>

                {/* Financial Summary & Actions */}
                <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F2EDE4] gap-3 shrink-0">
                  <div className="sm:text-right">
                    <span className="text-[10px] font-mono text-[#717584] block">Quote Total</span>
                    <span className="font-serif font-bold text-base text-[#141519]">
                      {req.quoteTotalMinor ? formatMoney(req.quoteTotalMinor) : (req.maxBudgetMajor ? `Budget: $${req.maxBudgetMajor}` : 'Calculating')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/requests/${req.id}`}
                      className="btn-luxury-outline px-3.5 py-1.5 text-[11px]"
                    >
                      Dossier
                    </Link>
                    {req.quoteId && (
                      <Link
                        href={`/quotes/${req.quoteId}`}
                        className="btn-gilt px-3.5 py-1.5 text-[11px] shadow-sm"
                      >
                        Quote
                      </Link>
                    )}
                    {req.orderId && (
                      <Link
                        href={`/orders/${req.orderId}`}
                        className="btn-obsidian px-3.5 py-1.5 text-[11px]"
                      >
                        Order
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
