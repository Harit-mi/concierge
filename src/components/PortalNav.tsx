'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconFileText,
  IconPackage,
  IconChat,
  IconUser,
} from '@/components/icons/FlaticonIcons';

export function PortalNav() {
  const pathname = usePathname();

  const links = [
    { label: 'Overview', href: '/portal', icon: IconLayoutDashboard },
    { label: 'My Requests & Quotes', href: '/portal/requests', icon: IconFileText },
    { label: 'Active Orders', href: '/portal/orders', icon: IconPackage },
    { label: 'Concierge Messages', href: '/portal/messages', icon: IconChat },
    { label: 'Delivery Profile', href: '/portal/profile', icon: IconUser },
  ];

  return (
    <div className="bg-carbon-900 border-b border-white/5 sticky top-16 z-30 backdrop-blur-md bg-carbon-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8 overflow-x-auto py-3.5 text-xs font-mono scrollbar-none">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/portal' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 whitespace-nowrap py-1 tracking-wider transition-colors border-b-2 -mb-3.5 pb-3.5 ${
                  active
                    ? 'border-bronze-400 text-bronze-300 font-semibold'
                    : 'border-transparent text-titanium-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-bronze-400' : 'text-titanium-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
