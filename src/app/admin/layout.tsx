import React from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-[#FAF8F5] text-[#141519]">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
