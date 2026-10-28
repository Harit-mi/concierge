'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconPackage,
  IconReceipt,
  IconChat,
  IconFileText,
  IconChart,
  IconHistory,
  IconAlert,
} from '@/components/icons/FlaticonIcons';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Ops Dashboard', href: '/admin', icon: IconLayoutDashboard },
    { label: 'Sourcing Requests', href: '/admin/requests', icon: IconPackage },
    { label: 'Quote Builder & Queue', href: '/admin/quotes', icon: IconReceipt },
    { label: 'Order Fulfilment', href: '/admin/orders', icon: IconPackage },
    { label: 'Communications Desk', href: '/admin/communications', icon: IconChat },
    { label: 'Document Vault', href: '/admin/documents', icon: IconFileText },
    { label: 'Business Analytics', href: '/admin/analytics', icon: IconChart },
    { label: 'Audit Ledger', href: '/admin/audit', icon: IconHistory },
  ];

  return (
    <aside className="w-64 bg-white text-[#141519] flex flex-col shrink-0 border-r border-[#EAE4D9] min-h-[calc(100vh-5rem)] shadow-xs">
      <div className="p-6 border-b border-[#EAE4D9] bg-[#FAF8F5]">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7A603D] block mb-1 font-bold">
          Veritas Executive Console
        </span>
        <div className="font-serif font-bold text-[#141519] text-base">
          Operations & Sourcing
        </div>
      </div>

      <nav className="flex-1 p-3.5 space-y-1 text-xs font-mono">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm transition-all ${
                active
                  ? 'bg-[#141519] text-white font-semibold shadow-xs'
                  : 'text-[#5C5F6D] hover:text-[#141519] hover:bg-[#FAF8F5]'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-[#DFCCA8]' : 'text-[#8C8F9D]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Compliance Box */}
      <div className="p-5 border-t border-[#EAE4D9] text-[11px] text-[#717584] space-y-2 bg-[#FAF8F5] font-sans">
        <div className="flex items-center gap-2 text-[#7A603D] font-semibold uppercase tracking-wider text-[10px] font-mono">
          <IconAlert className="w-3.5 h-3.5 text-[#A38054]" />
          <span>Domestic Pilot Scope</span>
        </div>
        <p className="leading-relaxed">
          Mainland US delivery only. Cross-border freight, watches, cosmetics, and unverified traveler sourcing remain strictly deactivated.
        </p>
      </div>
    </aside>
  );
}
