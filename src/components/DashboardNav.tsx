'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconFileText,
  IconChat,
  IconUser,
  IconShield,
} from '@/components/icons/FlaticonIcons';

export function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { label: 'Overview', href: '/dashboard', icon: IconLayoutDashboard },
    { label: 'Requests', href: '/dashboard/requests', icon: IconFileText },
    { label: 'Messages', href: '/messages', icon: IconChat },
    { label: 'Profile', href: '/account', icon: IconUser },
    { label: 'Policies', href: '/policies', icon: IconShield },
  ];

  return (
    <div className="bg-white border-b border-[#E5E3DC] sticky top-20 z-30 shadow-xs">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center space-x-8 overflow-x-auto py-3 text-[11px] font-sans font-medium">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 whitespace-nowrap py-1.5 tracking-kicker uppercase transition-colors border-b-2 -mb-3 pb-3 ${
                  active
                    ? 'border-[#121212] text-[#121212] font-semibold'
                    : 'border-transparent text-[#5A5852] hover:text-[#121212]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#121212]' : 'text-[#8A8880]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}