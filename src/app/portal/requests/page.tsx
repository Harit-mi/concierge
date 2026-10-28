'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconPackage, IconPlus } from '@/components/icons/FlaticonIcons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/lib/pricing';

export default function CustomerRequestsListPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/requests');
        if (res.ok) {
          const data = await res.json();
          setRequests(data.requests || []);
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
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Sourcing Inquiries & Quotes
          </h1>
          <p className="text-xs text-titanium-400 mt-1 font-sans">
            Review status updates, itemized quote proposals, and specialist recommendations.
          </p>
        </div>

        <Link
          href="/request"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 px-5 py-2.5 rounded text-xs uppercase tracking-wider font-semibold hover:brightness-110 shadow-bronze-glow transition-all"
        >
          <IconPlus className="w-3.5 h-3.5" />
          <span>New Sourcing Request</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs font-mono text-titanium-500">Loading your inquiries...</div>
      ) : requests.length === 0 ? (
        <div className="stealth-card p-14 text-center space-y-4 border border-white/10 shadow-2xl">
          <IconPackage className="w-8 h-8 text-bronze-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">No Inquiries Found</h3>
          <p className="text-xs text-titanium-400 max-w-sm mx-auto font-sans leading-relaxed">
            You haven&apos;t submitted any sourcing requests yet. Send us a product URL or reference image to get started.
          </p>
          <div className="pt-2">
            <Link
              href="/request"
              className="inline-block bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 px-6 py-2.5 rounded text-xs uppercase tracking-widest font-semibold hover:brightness-110 shadow-bronze-glow"
            >
              Submit A Request
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((r) => (
            <div
              key={r.id}
              className="stealth-card p-7 space-y-5 hover:border-bronze-500/30 transition-all border border-white/10 shadow-2xl flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="font-mono text-xs font-semibold text-titanium-400">{r.reference_number}</span>
                  <StatusBadge status={r.status} size="sm" />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-bronze-400 block mb-1">{r.brand}</span>
                  <h3 className="font-serif font-bold text-xl text-white group-hover:text-bronze-300 transition-colors">{r.product_name}</h3>
                  <div className="flex gap-2 text-xs text-titanium-400 mt-1 font-mono">
                    <span>Size: {r.size_variant || 'N/A'}</span>
                    <span>•</span>
                    <span>Color: {r.color_variant || 'Standard'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <div>
                  {r.quoteTotalMinor ? (
                    <div>
                      <span className="text-titanium-500 text-[10px] uppercase block">Quote Total</span>
                      <strong className="text-bronze-300 font-bold text-sm">{formatMoney(r.quoteTotalMinor)}</strong>
                    </div>
                  ) : (
                    <span className="text-titanium-500 italic text-[11px]">Quote being prepared</span>
                  )}
                </div>

                <Link
                  href={`/portal/requests/${r.id}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-bronze-300 hover:underline"
                >
                  <span>Review Dossier</span>
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
