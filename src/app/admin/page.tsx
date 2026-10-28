'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IconPackage,
  IconClock,
  IconReceipt,
  IconCreditCard,
  IconTruck,
  IconCheckCircle,
  IconAlert,
  IconArrowRight,
  IconShield,
  IconHistory,
} from '@/components/icons/FlaticonIcons';
import { formatMoney } from '@/lib/pricing';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const pipelineStages = [
    {
      title: 'New Inquiries',
      count: 2,
      desc: 'Pending feasibility review & seller vetting',
      href: '/admin/requests',
      icon: IconPackage,
      badge: 'Triage Queue',
      color: 'border-l-[#9E7A4A]',
    },
    {
      title: 'Under Review',
      count: 1,
      desc: 'Specialist verifying boutique stock & condition',
      href: '/admin/requests',
      icon: IconClock,
      badge: 'Sourcing Check',
      color: 'border-l-amber-600',
    },
    {
      title: 'Quotes Sent',
      count: 2,
      desc: 'Itemized pricing delivered to client',
      href: '/admin/quotes',
      icon: IconReceipt,
      badge: 'Awaiting Client',
      color: 'border-l-blue-600',
    },
    {
      title: 'Awaiting Payment',
      count: 1,
      desc: 'Terms accepted; pending card clearance',
      href: '/admin/orders',
      icon: IconCreditCard,
      badge: 'Escrow Pending',
      color: 'border-l-indigo-600',
    },
    {
      title: 'Paid / Sourcing',
      count: 1,
      desc: 'Payment cleared; purchase executed',
      href: '/admin/orders',
      icon: IconPackage,
      badge: 'Procurement',
      color: 'border-l-teal-600',
    },
    {
      title: 'Intake QA / Forensics',
      count: 1,
      desc: 'Physical item undergoing UV & optical check',
      href: '/admin/orders',
      icon: IconShield,
      badge: 'Manhattan Lab',
      color: 'border-l-purple-600',
    },
    {
      title: 'Courier In Transit',
      count: 1,
      desc: 'Insured priority signature delivery en route',
      href: '/admin/orders',
      icon: IconTruck,
      badge: 'UPS / FedEx',
      color: 'border-l-cyan-600',
    },
    {
      title: 'Delivered Archives',
      count: 4,
      desc: 'Inspected and confirmed by client',
      href: '/admin/orders',
      icon: IconCheckCircle,
      badge: 'Completed',
      color: 'border-l-emerald-600',
    },
  ];

  return (
    <div className="space-y-10 text-[#111215]">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 luxury-card p-8 sm:p-10 bg-white border border-[#E3D8CB]">
        <div className="space-y-2">
          <span className="ledger-stamp">
            OPERATIONS RADAR &bull; MAISON COMMAND CONSOLE
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-light text-[#111215]">
            Concierge Operations Radar
          </h1>
          <p className="text-xs text-[#575A6B] font-mono">
            Real-time pipeline monitoring, quote generation, and forensic authentication logs across the domestic pilot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/requests"
            className="btn-obsidian text-xs px-5 py-3 shadow-luxury flex items-center gap-2 group"
          >
            <span>Triage Inquiries</span>
            <IconArrowRight className="w-3.5 h-3.5 text-[#C4A575] group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/admin/quotes"
            className="btn-luxury-outline text-xs px-5 py-3 flex items-center gap-2"
          >
            <span>Quote Builder</span>
            <IconReceipt className="w-3.5 h-3.5 text-[#846337]" />
          </Link>
        </div>
      </div>

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E3D8CB] border border-[#E3D8CB]">
        <div className="bg-white p-6 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#575A6B] block">
            Procured Volume
          </span>
          <div className="text-2xl font-display font-bold text-[#111215] mt-1">$4,860.00 USD</div>
          <div className="text-[10px] text-[#575A6B] font-mono">Recorded domestic GMV</div>
        </div>

        <div className="bg-[#FAF7F2] p-6 space-y-1 border-t-2 md:border-t-0 md:border-l-2 border-[#9E7A4A]">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#846337] block font-semibold">
            Concierge Retainers
          </span>
          <div className="text-2xl font-display font-bold text-[#846337] mt-1">$583.20 USD</div>
          <div className="text-[10px] text-[#846337] font-mono">Net 12% realized commission</div>
        </div>

        <div className="bg-white p-6 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#575A6B] block">
            Active Commissions
          </span>
          <div className="text-2xl font-display font-bold text-[#111215] mt-1">4 Pieces</div>
          <div className="text-[10px] text-[#575A6B] font-mono">Across scouting & intake</div>
        </div>

        <div className="bg-white p-6 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#575A6B] block">
            Forensic QA Rate
          </span>
          <div className="text-2xl font-display font-bold text-emerald-900 mt-1">100.0%</div>
          <div className="text-[10px] text-emerald-700 font-mono">Zero counterfeits permitted</div>
        </div>
      </div>

      {/* 8-Stage Operations Pipeline Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E3D8CB] pb-3">
          <span className="ledger-stamp">22-STATE MACHINE RADAR</span>
          <span className="text-xs font-mono text-[#575A6B]">Domestic Pilot Queue</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <Link
                key={idx}
                href={stage.href}
                className={`luxury-card p-5 bg-white border border-[#E3D8CB] ${stage.color} border-l-4 hover:shadow-luxury hover:border-[#C4A575] transition-all flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#846337] font-semibold">
                      {stage.badge}
                    </span>
                    <Icon className="w-4 h-4 text-[#846337]" />
                  </div>
                  <div>
                    <div className="text-3xl font-display font-bold text-[#111215]">
                      {stage.count}
                    </div>
                    <div className="font-display font-bold text-base text-[#111215] mt-0.5">
                      {stage.title}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#575A6B] font-mono leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E3D8CB] flex items-center justify-between text-[10.5px] font-mono text-[#846337] font-semibold">
                  <span>Open Queue</span>
                  <IconArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Cryptographic Audit Trail */}
      <div className="luxury-card p-6 sm:p-8 bg-white border border-[#E3D8CB] space-y-4 shadow-luxury">
        <div className="flex items-center justify-between border-b border-[#E3D8CB] pb-3">
          <div className="flex items-center gap-2">
            <IconHistory className="w-4 h-4 text-[#846337]" />
            <h3 className="font-display text-xl font-bold text-[#111215]">
              Real-Time Cryptographic Audit Trail
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5">
            Immutable SHA-256 Ledger
          </span>
        </div>

        <div className="divide-y divide-[#E3D8CB] font-mono text-xs text-[#575A6B]">
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="font-semibold text-[#111215]">QUOTE_ISSUED</span>
              <span>&bull; Ref: QTE-2026-8801 ($641.00 USD)</span>
            </div>
            <span className="text-[10px] text-[#8E91A1]">Oct 25, 2026 &bull; 15:30 EST</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="font-semibold text-[#111215]">INTAKE_QA_PASSED</span>
              <span>&bull; Specimen No. 02 &bull; Homme Plissé Blazer (SPI 14 verified)</span>
            </div>
            <span className="text-[10px] text-[#8E91A1]">Oct 26, 2026 &bull; 14:15 EST</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span className="font-semibold text-[#111215]">COMMISSION_LOGGED</span>
              <span>&bull; Ref: REQ-2026-6209 &bull; Maison Margiela Replica Paint Splatter</span>
            </div>
            <span className="text-[10px] text-[#8E91A1]">Oct 27, 2026 &bull; 10:45 EST</span>
          </div>
        </div>
      </div>
    </div>
  );
}