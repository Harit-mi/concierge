'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IconSearch,
  IconFilter,
  IconPackage,
  IconArrowRight,
  IconUserCheck,
  IconReceipt,
  IconExternalLink,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';
import { fetchRequestsAdapter, SourcingRequestItem } from '@/lib/api-adapter';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<SourcingRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      const data = await fetchRequestsAdapter();
      setRequests(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const sTerm = searchQuery.toLowerCase();
    const pName = (r.productName || (r as any).product_name || '').toLowerCase();
    const pBrand = (r.brand || '').toLowerCase();
    const pRef = (r.referenceNumber || (r as any).reference_number || '').toLowerCase();

    const matchesSearch =
      !sTerm ||
      pName.includes(sTerm) ||
      pBrand.includes(sTerm) ||
      pRef.includes(sTerm);

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 text-[#141519]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE4D9] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A603D] font-bold block mb-1">
            Intake Operations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141519]">
            Sourcing Inquiries Triage Queue
          </h1>
          <p className="text-xs text-[#5C5F6D] mt-1 font-sans">
            Evaluate client inquiries, verify retailer stock and authenticity, and prepare itemized quotes.
          </p>
        </div>

        <Link
          href="/admin/quotes"
          className="btn-bronze text-xs uppercase font-mono tracking-wider font-semibold px-5 py-3 rounded-sm flex items-center gap-2 self-start sm:self-center shadow-xs"
        >
          <IconReceipt className="w-3.5 h-3.5" />
          <span>Launch Quote Builder</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="ivory-card p-4 rounded-sm bg-white border border-[#EAE4D9] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs font-mono">
          {[
            { id: 'ALL', label: 'All Inquiries' },
            { id: 'REQUEST_SUBMITTED', label: 'New Submitted' },
            { id: 'UNDER_REVIEW', label: 'Under Review' },
            { id: 'QUOTE_SENT', label: 'Quoted' },
            { id: 'QUOTE_ACCEPTED', label: 'Accepted' },
            { id: 'REJECTED', label: 'Declined' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xs transition-all uppercase text-[10.5px] font-semibold whitespace-nowrap border ${
                statusFilter === st.id
                  ? 'bg-[#141519] text-white border-[#141519]'
                  : 'bg-white text-[#5C5F6D] border-[#E2DDD2] hover:border-[#A38054]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <IconSearch className="w-4 h-4 text-[#8C8F9D] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ref, item, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ivory-input w-full pl-9 pr-3 py-2 text-xs rounded-sm"
          />
        </div>
      </div>

      {/* Triage Table / Queue Rows */}
      <div className="ivory-card rounded-sm overflow-hidden bg-white border border-[#EAE4D9] shadow-xs">
        <div className="divide-y divide-[#F2EDE4]">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
            >
              {/* Product Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 rounded-xs bg-[#FAF8F5] border border-[#E2DDD2] overflow-hidden shrink-0">
                  {req.imageUrl ? (
                    <img src={req.imageUrl} alt={req.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-[#8C8F9D]">
                      Item
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#141519]">
                      {req.referenceNumber}
                    </span>
                    <span className="text-[10px] font-mono text-[#7A603D] uppercase font-semibold">
                      {req.brand}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#141519]">
                    {req.productName}
                  </h3>
                  <div className="text-xs text-[#5C5F6D] font-mono flex flex-wrap gap-x-4 gap-y-1">
                    <span>Size: <strong className="text-[#141519]">{req.sizeVariant}</strong></span>
                    <span>Qty: {req.quantity}</span>
                    <span>Destination: ZIP {req.destinationPostalCode}</span>
                    <span>Budget: {req.maxBudgetMajor ? `$${req.maxBudgetMajor} USD` : 'Market rate'}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-4 justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#F2EDE4]">
                <StatusBadge status={req.status as any} size="sm" />

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/requests/${req.id}`}
                    className="btn-ivory-outline px-3.5 py-1.5 rounded-xs text-xs font-mono uppercase tracking-wider font-semibold hover:border-[#A38054]"
                  >
                    Dossier
                  </Link>

                  <Link
                    href={`/admin/quotes?requestId=${req.id}`}
                    className="btn-bronze px-3.5 py-1.5 rounded-xs text-xs font-mono uppercase tracking-wider font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <IconReceipt className="w-3 h-3" />
                    <span>{req.quoteId ? 'Revise Quote' : 'Create Quote'}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
