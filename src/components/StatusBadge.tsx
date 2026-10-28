'use client';

import React from 'react';
import { OrderStatus } from '@/types';
import { STATUS_METADATA } from '@/lib/state-machine';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showCategory?: boolean;
}

export function StatusBadge({ status, size = 'md', showCategory = false }: StatusBadgeProps) {
  const meta = STATUS_METADATA[status] || {
    label: status,
    category: 'request',
    colorClass: 'bg-carbon-800 text-titanium-300 border-white/10',
    dotColor: 'bg-titanium-400',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-0.5 tracking-wider',
    md: 'text-xs px-3 py-1 tracking-wider',
    lg: 'text-sm px-4 py-1.5 tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono uppercase font-semibold rounded-full border backdrop-blur-xs transition-all ${meta.colorClass} ${sizeClasses[size]}`}
      title={meta.customerDescription}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor} animate-pulse shadow-[0_0_8px_currentColor]`} />
      <span>{meta.label}</span>
      {showCategory && (
        <span className="opacity-50 text-[9px] uppercase tracking-widest font-normal">
          [{meta.category}]
        </span>
      )}
    </span>
  );
}
