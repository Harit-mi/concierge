'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IconPackage,
  IconSearch,
  IconFilter,
  IconArrowRight,
  IconTruck,
  IconShield,
} from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';
import { fetchRequestsAdapter, SourcingRequestItem } from '@/lib/api-adapter';

export default function AdminOrdersPage() {
  const [requests, setRequests] = useState<SourcingRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      const data = await fetchRequestsAdapter();
      // Filter to records with an associated order or in fulfillment
      const orderList = data.filter((r) => r.orderId || ['QUOTE_ACCEPTED', 'AWAITING_PAYMENT', 'PAYMENT_CONFIRMED', 'SOURCING_IN_PROGRESS', 'PRODUCT_ACQUIRED', 'QUALITY_CHECK', 'PACKING', 'SHIPPED', 'DELIVERED'].includes(r.status));
      setRequests(orderList);
      setLoading(false);
    }
    load();
  }, []);

  const filteredOrders = requests.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-8 text-[#141519]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE4D9] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A603D] font-bold block mb-1">
            Fulfilment Controller
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141519]">
            Order Fulfilment Pipeline
          </h1>
          <p className="text-xs text-[#5C5F6D] mt-1 font-sans">
            Manage merchant procurement, physical intake authenticity inspections, and insured courier dispatch across all 22 states.
          </p>
        </div>

        <Link
          href="/admin/quotes"
          className="btn-softblack text-xs uppercase font-mono tracking-wider font-semibold px-5 py-3 rounded-sm flex items-center gap-2 self-start sm:self-center shadow-xs"
        >
          <span>Quote Builder Queue</span>
          <IconArrowRight className="w-3.5 h-3.5 text-[#DFCCA8]" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="ivory-card p-3.5 rounded-sm bg-white border border-[#EAE4D9] flex items-center gap-2 overflow-x-auto text-xs font-mono shadow-xs">
        {[
          { id: 'ALL', label: 'All Orders' },
          { id: 'AWAITING_PAYMENT', label: 'Awaiting Payment' },
          { id: 'PAYMENT_CONFIRMED', label: 'Payment Verified' },
          { id: 'SOURCING_IN_PROGRESS', label: 'Sourcing In Progress' },
          { id: 'PRODUCT_ACQUIRED', label: 'Product Acquired' },
          { id: 'QUALITY_CHECK', label: 'Authentication Lab' },
          { id: 'PACKING', label: 'Packing' },
          { id: 'SHIPPED', label: 'In Transit' },
          { id: 'DELIVERED', label: 'Delivered' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xs transition-all uppercase text-[10.5px] font-semibold whitespace-nowrap border ${
              statusFilter === tab.id
                ? 'bg-[#141519] text-white border-[#141519]'
                : 'bg-white text-[#5C5F6D] border-[#E2DDD2] hover:border-[#A38054]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table Rows */}
      <div className="ivory-card rounded-sm overflow-hidden bg-white border border-[#EAE4D9] shadow-xs">
        <div className="divide-y divide-[#F2EDE4]">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-[#717584]">
              No orders found matching the selected filter state.
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-xs bg-[#FAF8F5] border border-[#E2DDD2] overflow-hidden shrink-0">
                    {ord.imageUrl ? (
                      <img src={ord.imageUrl} alt={ord.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-[#8C8F9D]">
                        Box
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#141519]">
                        {ord.orderNumber || 'ORD-ACTIVE'}
                      </span>
                      <span className="text-[10px] font-mono text-[#717584]">
                        Ref: {ord.referenceNumber}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-[#141519]">
                      {ord.productName}
                    </h3>
                    <div className="text-xs text-[#5C5F6D] font-mono flex flex-wrap gap-x-4 gap-y-1">
                      <span>Brand: {ord.brand}</span>
                      <span>Size: <strong className="text-[#141519]">{ord.sizeVariant}</strong></span>
                      <span>Qty: {ord.quantity}</span>
                      {ord.carrierName && (
                        <span className="text-[#7A603D] font-semibold">
                          {ord.carrierName}: {ord.trackingNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#F2EDE4]">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] font-mono text-[#717584] block">Authorized Sourcing Total</span>
                    <span className="font-serif font-bold text-base text-[#141519]">
                      {ord.quoteTotalMinor ? formatMoney(ord.quoteTotalMinor) : '$641.00 USD'}
                    </span>
                  </div>

                  <StatusBadge status={ord.status as any} size="sm" />

                  <Link
                    href={`/admin/orders/${ord.orderId || 'ord-travis-01'}`}
                    className="btn-softblack px-4 py-2 rounded-xs text-xs font-mono uppercase tracking-wider font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <span>Manage Cockpit</span>
                    <IconArrowRight className="w-3.5 h-3.5 text-[#DFCCA8]" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
