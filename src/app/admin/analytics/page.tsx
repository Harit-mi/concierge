'use client';

import React, { useEffect, useState } from 'react';
import { formatMoney } from '@/lib/pricing';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="p-16 text-center text-xs font-mono text-titanium-500">Computing analytics aggregates...</div>;
  }

  const { metrics, requestStatusCounts, orderStatusCounts } = data || {};

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-titanium-200">
      <div className="border-b border-white/5 pb-5">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Database-Verified Business Metrics
        </h1>
        <p className="text-xs text-titanium-400 mt-1 font-sans">
          Audited conversion rates, fee generation, and operational turnaround calculated from live transaction events.
        </p>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="stealth-card p-6 space-y-1.5 border border-white/5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-titanium-400 block">
            Gross Merchandising Value
          </span>
          <div className="text-2xl font-serif font-bold text-white">
            {formatMoney(metrics?.totalVolumeMinor || 0)}
          </div>
          <span className="text-[10px] text-titanium-500 font-mono block">
            {metrics?.totalTransactions || 0} verified customer payments
          </span>
        </div>

        <div className="stealth-card p-6 space-y-1.5 border-bronze-500/20">
          <span className="text-[11px] font-mono uppercase tracking-wider text-bronze-300 font-bold block">
            Net Sourcing Fee Revenue
          </span>
          <div className="text-2xl font-serif font-bold text-bronze-300">
            {formatMoney(metrics?.totalServiceFeesMinor || 0)}
          </div>
          <span className="text-[10px] text-titanium-500 font-mono block">
            Gross margin from concierge fee
          </span>
        </div>

        <div className="stealth-card p-6 space-y-1.5 border border-white/5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-titanium-400 block">
            Quote Acceptance Conversion
          </span>
          <div className="text-2xl font-serif font-bold text-white">
            {metrics?.quoteAcceptanceRatePercent || '0.0'}%
          </div>
          <span className="text-[10px] text-titanium-500 font-mono block">
            {metrics?.acceptedQuotes || 0} of {metrics?.totalQuotes || 0} quotes accepted
          </span>
        </div>

        <div className="stealth-card p-6 space-y-1.5 border border-rose-500/20">
          <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 block">
            Request Rejection Rate
          </span>
          <div className="text-2xl font-serif font-bold text-rose-300">
            {metrics?.rejectionRatePercent || '0.0'}%
          </div>
          <span className="text-[10px] text-titanium-500 font-mono block">
            {metrics?.rejectedRequests || 0} of {metrics?.totalRequests || 0} flagged or declined
          </span>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Request Distribution */}
        <div className="stealth-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4 shadow-2xl">
          <h3 className="font-serif font-bold text-base text-white border-b border-white/5 pb-3">
            Inbound Sourcing Status Breakdown
          </h3>
          <div className="space-y-2.5 text-xs font-mono">
            {requestStatusCounts?.map((s: any) => (
              <div key={s.status} className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-titanium-300">{s.status.replace(/_/g, ' ')}</span>
                <span className="font-bold text-white">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Distribution */}
        <div className="stealth-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4 shadow-2xl">
          <h3 className="font-serif font-bold text-base text-white border-b border-white/5 pb-3">
            Active Order Pipeline Breakdown
          </h3>
          <div className="space-y-2.5 text-xs font-mono">
            {orderStatusCounts?.map((s: any) => (
              <div key={s.status} className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-titanium-300">{s.status.replace(/_/g, ' ')}</span>
                <span className="font-bold text-white">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
