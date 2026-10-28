'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconLock,
  IconArrowRight,
  IconAlert,
  IconShield,
  IconUser,
} from '@/components/icons/FlaticonIcons';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      if (data.user.role === 'ADMIN' || data.user.role === 'CONCIERGE_OPERATOR') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-md mx-auto space-y-8 text-[#141519]">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-sm bg-[#141519] border border-[#A38054] text-[#DFCCA8] flex items-center justify-center font-serif text-lg font-bold mx-auto mb-3 shadow-xs">
          V
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#141519] tracking-tight">
          Client & Staff Access
        </h1>
        <p className="text-xs text-[#5C5F6D] font-sans">
          Access your private sourcing dashboard or operations radar console.
        </p>
      </div>

      {/* Quick Demo Switcher Card */}
      <div className="ivory-card p-4 rounded-sm bg-white border border-[#D8C3A4] space-y-3 text-xs shadow-xs">
        <div className="flex items-center justify-between text-[#141519] font-semibold font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <IconUser className="w-3.5 h-3.5 text-[#A38054]" />
            <span>1-Click Demo Personas:</span>
          </span>
          <span className="text-[10px] text-[#717584] font-mono">Pass: password123</span>
        </div>
        <div className="grid grid-cols-3 gap-2 font-mono">
          <button
            type="button"
            onClick={() => handleQuickDemo('customer@example.com')}
            className="p-2.5 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2] hover:border-[#A38054] text-[#141519] text-[11px] font-medium text-center transition-all"
          >
            Client <br />
            <span className="text-[9.5px] text-[#7A603D]">Alexander</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('concierge@example.com')}
            className="p-2.5 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2] hover:border-blue-500 text-[#141519] text-[11px] font-medium text-center transition-all"
          >
            Concierge <br />
            <span className="text-[9.5px] text-blue-700">Julian</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('admin@example.com')}
            className="p-2.5 bg-[#FAF8F5] rounded-xs border border-[#E2DDD2] hover:border-purple-500 text-[#141519] text-[11px] font-medium text-center transition-all"
          >
            Director <br />
            <span className="text-[9.5px] text-purple-700">Eleanor</span>
          </button>
        </div>
      </div>

      <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] shadow-sm space-y-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xs text-xs flex items-center gap-2">
            <IconAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#141519] block font-semibold">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="ivory-input w-full p-2.5 rounded-sm text-xs font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#141519] block font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="ivory-input w-full p-2.5 rounded-sm text-xs font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-obsidian py-4 text-xs shadow-luxury flex items-center justify-center gap-2 group"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
            <IconArrowRight className="w-3.5 h-3.5 text-[#C4A575] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#F2EDE4] text-center text-xs text-[#5C5F6D] font-sans">
          Do not have an account yet?{' '}
          <Link href="/auth/register" className="font-semibold text-[#A38054] underline underline-offset-4 hover:text-[#141519]">
            Create Client Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
