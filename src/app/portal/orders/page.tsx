'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconPackage, IconArrowRight } from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';

export default function CustomerOrdersListPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/requests');
        if (res.ok) {
          const data = await res.json();
          // Filter to only those with orders
          const withOrders = (data.requests || []).filter((r: any) => r.orderId);
          setRequests(withOrders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 text-titanium-200">
      <div className="border-b border-white/5 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">Active & Past Orders</h1>
          <p className="text-xs text-titanium-400 mt-1 font-sans">
            Follow physical sourcing milestones, tracking updates, and download official receipts.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs font-mono text-titanium-500">Loading orders...</div>
      ) : requests.length === 0 ? (
        <div className="stealth-card p-14 text-center space-y-4 border border-white/10 shadow-2xl">
          <IconPackage className="w-8 h-8 text-bronze-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">No Orders in Sourcing</h3>
          <p className="text-xs text-titanium-400 max-w-sm mx-auto font-sans leading-relaxed">
            Once you accept a quote, your order will appear here with live fulfilment tracking.
          </p>
          <div className="pt-2">
            <Link
              href="/portal"
              className="inline-block bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 px-6 py-2.5 rounded text-xs uppercase tracking-widest font-semibold hover:brightness-110 shadow-bronze-glow"
            >
              Review Inquiries
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((r) => (
            <div
              key={r.orderId}
              className="stealth-card p-7 space-y-5 hover:border-bronze-500/30 transition-all border border-white/10 shadow-2xl group"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-mono text-xs font-bold text-white">{r.orderNumber}</span>
                <StatusBadge status={r.status} size="sm" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-400 block mb-1">{r.brand}</span>
                <h3 className="font-serif font-bold text-xl text-white group-hover:text-bronze-300 transition-colors">{r.product_name}</h3>
                <span className="text-xs text-titanium-400 block mt-1 font-mono">
                  Destination ZIP: {r.destination_postal_code}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono">
                <span className="text-bronze-300 font-bold text-sm">
                  {r.quoteTotalMinor ? formatMoney(r.quoteTotalMinor) : 'Paid'}
                </span>
                <Link
                  href={`/portal/orders/${r.orderId}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-bronze-300 hover:underline"
                >
                  <span>Order Cockpit</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
