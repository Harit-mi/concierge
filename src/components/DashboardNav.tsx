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
    { label: 'Desk Overview', href: '/dashboard', icon: IconLayoutDashboard },
    { label: 'Inquiry Dossiers', href: '/dashboard/requests', icon: IconFileText },
    { label: 'Concierge Parlor', href: '/messages', icon: IconChat },
    { label: 'Client Profile', href: '/account', icon: IconUser },
    { label: 'Forensic Policies', href: '/policies', icon: IconShield },
  ];

  return (
    <div className="bg-white border-b border-[#E3D8CB] sticky top-20 z-30 shadow-xs">
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
                    ? 'border-[#9E7A4A] text-[#111215] font-semibold'
                    : 'border-transparent text-[#575A6B] hover:text-[#111215]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#846337]' : 'text-[#8E91A1]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}