'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IconShield, IconUser, IconMenu, IconClose, IconChevronDown, IconArrowRight, IconUserCheck } from '@/components/icons/FlaticonIcons';
import { User as UserType } from '@/types';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const handleQuickSwitch = async (email: string) => {
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' }),
      });
      await fetchSession();
      if (email.includes('admin') || email.includes('concierge')) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err) {
      console.error('Quick switch failed', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { label: 'Protocol', href: '/how-it-works' },
    { label: 'Policies', href: '/policies' },
    { label: 'Client Desk', href: '/dashboard' },
    { label: 'Messages', href: '/messages' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E3D8CB] transition-all">
      {/* Domestic Pilot Status Beacon */}
      <div className="bg-[#F4EFEA] border-b border-[#E3D8CB] text-[#846337] text-[9.5px] sm:text-[10px] md:text-[10.5px] py-1.5 px-3 sm:px-4 text-center font-mono tracking-wider sm:tracking-widest uppercase flex items-center justify-center gap-2 max-w-full overflow-hidden">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse shrink-0" />
        <span className="truncate sm:whitespace-normal">
          DOMESTIC CONCIERGE PILOT &bull; MAINLAND US DESTINATIONS ONLY &bull; ZERO BLIND PURCHASES
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-3.5">
              <div className="w-9 h-9 bg-[#111215] border border-[#C4A575]/60 flex items-center justify-center text-[#C4A575] font-display font-light text-lg tracking-widest shadow-sm group-hover:border-[#C4A575] transition-all">
                V
              </div>
              <div>
                <span className="font-display tracking-[0.25em] text-lg uppercase font-medium text-[#111215] block group-hover:text-[#846337] transition-colors">
                  VERITAS
                </span>
                <span className="text-[8.5px] uppercase tracking-[0.28em] text-[#846337] font-sans block -mt-1 font-medium">
                  Private Procurement Concierge
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation (Visible on lg >= 1024px) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] tracking-kicker uppercase font-sans font-medium transition-all py-1 relative ${
                    active
                      ? 'text-[#846337] font-semibold'
                      : 'text-[#575A6B] hover:text-[#111215]'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#846337]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Suite (Visible on lg >= 1024px) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Quick Demo Switcher */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1.5 text-[10.5px] font-sans font-medium text-[#575A6B] bg-white hover:bg-[#F4EFEA] px-3.5 py-1.5 border border-[#E3D8CB] hover:border-[#C4A575] transition-all shadow-xs"
                title="Switch demo persona"
              >
                <IconUserCheck className="w-3.5 h-3.5 text-[#846337]" />
                <span className="tracking-widest uppercase text-[10px]">Role Switcher</span>
                <IconChevronDown className="w-3 h-3 text-[#575A6B] opacity-60" />
              </button>
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 bg-white shadow-xl border border-[#E3D8CB] py-2 z-50 text-left text-xs divide-y divide-[#E3D8CB]">
                <div className="px-3.5 py-1.5 text-[9.5px] font-mono uppercase font-bold text-[#846337] tracking-widest bg-[#FAF7F2]">
                  Demo Persona Switcher
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleQuickSwitch('customer@example.com')}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#FAF7F2] flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium text-[#111215]">Alexander Hayes</div>
                      <div className="text-[10px] text-[#575A6B] font-mono">Private Client</div>
                    </div>
                    <span className="text-[9px] font-mono bg-[#F4EFEA] text-[#846337] px-2 py-0.5 border border-[#E3D8CB]">Client</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('concierge@example.com')}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#FAF7F2] flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium text-[#111215]">Julian Thorne</div>
                      <div className="text-[10px] text-[#575A6B] font-mono">Sourcing Officer</div>
                    </div>
                    <span className="text-[9px] font-mono bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5">Operator</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('admin@example.com')}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#FAF7F2] flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium text-[#111215]">Eleanor Vance</div>
                      <div className="text-[10px] text-[#575A6B] font-mono">Director of Operations</div>
                    </div>
                    <span className="text-[9px] font-mono bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5">Admin</span>
                  </button>
                </div>
              </div>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/account"
                  className="text-xs uppercase font-sans tracking-widest text-[#575A6B] hover:text-[#111215] p-2 hover:bg-[#F4EFEA] transition-all"
                  title="Account Settings"
                >
                  <IconUser className="w-4 h-4" />
                </Link>

                {currentUser.role === 'ADMIN' || currentUser.role === 'CONCIERGE_OPERATOR' ? (
                  <Link
                    href="/admin"
                    className="text-[11px] uppercase font-sans tracking-kicker font-medium text-[#846337] hover:text-[#575A6B] px-3.5 py-2 border border-[#C4A575] bg-[#F4EFEA] hover:bg-[#EFE8E0] transition-all flex items-center gap-1.5"
                  >
                    <IconShield className="w-3.5 h-3.5" />
                    <span>Operations Radar</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="text-[11px] uppercase font-sans tracking-kicker font-medium text-[#111215] hover:text-[#846337] px-3.5 py-2 border border-[#E3D8CB] bg-white hover:border-[#C4A575] transition-all shadow-xs"
                  >
                    Client Desk
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[11px] font-sans font-medium text-[#575A6B] hover:text-[#111215] tracking-widest uppercase px-2 py-1"
                >
                  Exit
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-[11px] uppercase font-sans tracking-kicker font-medium text-[#575A6B] hover:text-[#111215] px-3 py-1.5"
              >
                Client Sign In
              </Link>
            )}

            <Link
              href="/request"
              className="btn-obsidian px-5 py-2.5"
            >
              Request Piece
            </Link>
          </div>

          {/* Mobile & Tablet menu button (Visible on < lg) */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/request"
              className="btn-obsidian text-[10px] px-3.5 py-1.5"
            >
              Request
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#111215] hover:text-[#846337] hover:bg-[#F4EFEA] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-[#E3D8CB] bg-[#FAF7F2] px-6 pt-4 pb-8 space-y-5 shadow-2xl">
          <nav className="space-y-3 font-sans text-xs uppercase tracking-kicker font-medium border-b border-[#E3D8CB] pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-[#575A6B] hover:text-[#111215]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-[#575A6B] hover:text-[#111215]"
            >
              Client Account
            </Link>
          </nav>

          {/* Mobile Role Switcher */}
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-sans uppercase tracking-kicker text-[#846337] font-semibold">
              Select Demo Persona:
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10.5px] font-sans font-medium uppercase tracking-wider">
              <button
                onClick={() => {
                  handleQuickSwitch('customer@example.com');
                  setIsOpen(false);
                }}
                className="p-2 border border-[#E3D8CB] bg-white text-center hover:border-[#846337]"
              >
                Client
              </button>
              <button
                onClick={() => {
                  handleQuickSwitch('concierge@example.com');
                  setIsOpen(false);
                }}
                className="p-2 border border-[#E3D8CB] bg-white text-center hover:border-[#846337]"
              >
                Operator
              </button>
              <button
                onClick={() => {
                  handleQuickSwitch('admin@example.com');
                  setIsOpen(false);
                }}
                className="p-2 border border-[#E3D8CB] bg-white text-center hover:border-[#846337]"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/request"
              onClick={() => setIsOpen(false)}
              className="btn-obsidian block w-full text-center py-3.5 text-xs"
            >
              Initiate Sourcing Request &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}