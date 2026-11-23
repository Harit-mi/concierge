'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IconUser, IconMenu, IconClose, IconChevronDown } from '@/components/icons/FlaticonIcons';
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
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Policies & Charter', href: '/policies' },
    { label: 'Client Desk', href: '/dashboard' },
    { label: 'Messages', href: '/messages' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E5E3DC] transition-all">
      {/* Editorial Announcement Banner */}
      <div className="bg-[#F3F2EC] border-b border-[#E5E3DC] text-[#5A5852] text-[10px] sm:text-[10.5px] py-2 px-4 text-center font-sans tracking-[0.16em] uppercase flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#121212] shrink-0" />
        <span>Bespoke Sourcing for Archival & Rare Luxury &bull; Mainland US Pilot &bull; Verified Authenticity Guaranteed</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex flex-col items-start">
              <span className="font-display tracking-[0.28em] text-2xl uppercase font-normal text-[#121212] block transition-opacity group-hover:opacity-75">
                VERITAS
              </span>
              <span className="text-[9px] uppercase tracking-[0.24em] text-[#706E68] font-sans block -mt-0.5">
                Private Client Concierge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-9">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] tracking-[0.16em] uppercase font-sans font-medium transition-colors py-1 relative ${
                    active ? 'text-[#121212] font-semibold' : 'text-[#5A5852] hover:text-[#121212]'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#121212]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Suite */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Demo Persona Switcher */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1.5 text-[10.5px] font-sans font-medium text-[#5A5852] bg-white hover:bg-[#F3F2EC] px-3.5 py-1.5 border border-[#E5E3DC] hover:border-[#121212] transition-colors"
                title="Switch demo persona"
              >
                <span className="tracking-[0.14em] uppercase text-[10px]">Switch Role</span>
                <IconChevronDown className="w-3 h-3 text-[#5A5852] opacity-70" />
              </button>
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 bg-white shadow-xl border border-[#E5E3DC] py-2 z-50 text-left text-xs divide-y divide-[#E5E3DC]">
                <div className="px-3.5 py-1.5 text-[9.5px] font-sans uppercase font-bold text-[#706E68] tracking-widest bg-[#FAF9F5]">
                  Development Roles
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleQuickSwitch('customer@example.com')}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#FAF9F5] flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium text-[#121212]">Alexander Hayes</div>
                      <div className="text-[10px] text-[#706E68]">Private Client</div>
                    </div>
                    <span className="text-[9px] font-sans uppercase bg-[#F3F2EC] text-[#121212] px-2 py-0.5 border border-[#E5E3DC]">Client</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('concierge@example.com')}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#FAF9F5] flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium text-[#121212]">Julian Thorne</div>
                      <div className="text-[10px] text-[#706E68]">Sourcing Specialist</div>
                    </div>
                    <span className="text-[9px] font-sans uppercase bg-[#F3F2EC] text-[#121212] px-2 py-0.5 border border-[#E5E3DC]">Operator</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('admin@example.com')}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#FAF9F5] flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-medium text-[#121212]">Eleanor Vance</div>
                      <div className="text-[10px] text-[#706E68]">Head of Operations</div>
                    </div>
                    <span className="text-[9px] font-sans uppercase bg-[#121212] text-white px-2 py-0.5">Admin</span>
                  </button>
                </div>
              </div>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/account"
                  className="text-xs uppercase font-sans tracking-widest text-[#5A5852] hover:text-[#121212] p-2 hover:bg-[#F3F2EC] transition-colors"
                  title="Account Settings"
                >
                  <IconUser className="w-4 h-4" />
                </Link>

                {currentUser.role === 'ADMIN' || currentUser.role === 'CONCIERGE_OPERATOR' ? (
                  <Link
                    href="/admin"
                    className="text-[11px] uppercase font-sans tracking-[0.16em] font-medium text-[#121212] px-3.5 py-2 border border-[#121212] bg-[#F3F2EC] hover:bg-[#EAE8E0] transition-colors"
                  >
                    Operations Desk
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="text-[11px] uppercase font-sans tracking-[0.16em] font-medium text-[#121212] px-3.5 py-2 border border-[#E5E3DC] bg-white hover:border-[#121212] transition-colors"
                  >
                    Client Desk
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[11px] font-sans font-medium text-[#706E68] hover:text-[#121212] tracking-widest uppercase px-2 py-1"
                >
                  Exit
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-[11px] uppercase font-sans tracking-[0.16em] font-medium text-[#5A5852] hover:text-[#121212] px-3 py-1.5"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/request"
              className="btn-noir px-6 py-2.5"
            >
              Request a Piece
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/request"
              className="btn-noir text-[10px] px-3.5 py-2"
            >
              Request
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#121212] hover:bg-[#F3F2EC] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <IconClose className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#FAF9F5] border-t border-[#E5E3DC] px-6 py-8 space-y-6">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-xs uppercase tracking-[0.18em] font-medium text-[#121212] py-2 border-b border-[#E5E3DC]/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 flex flex-col gap-3">
            {currentUser ? (
              <>
                <Link
                  href={currentUser.role === 'CUSTOMER' ? '/dashboard' : '/admin'}
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary w-full py-3 text-center"
                >
                  {currentUser.role === 'CUSTOMER' ? 'Client Desk' : 'Operations Desk'}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-xs tracking-widest uppercase text-[#706E68] text-center py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="btn-secondary w-full py-3 text-center"
              >
                Client Sign In
              </Link>
            )}

            <Link
              href="/request"
              onClick={() => setIsOpen(false)}
              className="btn-noir w-full py-3.5 text-center mt-2"
            >
              Request a Piece
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
