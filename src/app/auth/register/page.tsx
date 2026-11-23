'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconArrowRight,
  IconAlert,
  IconShield,
} from '@/components/icons/FlaticonIcons';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-md mx-auto space-y-8 text-[#121212]">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 bg-[#121212] text-[#FAF9F5] flex items-center justify-center font-serif text-lg font-light mx-auto mb-3 shadow-xs">
          V
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-light text-[#121212] tracking-tight">
          Create Client Profile
        </h1>
        <p className="text-xs text-[#5A5852] font-sans">
          Join Veritas to track sourcing requests, review quotes, and monitor order progress.
        </p>
      </div>

      <div className="p-6 sm:p-8 bg-white border border-[#E5E3DC] shadow-sm space-y-6 rounded-[1px]">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 text-xs flex items-center gap-2">
            <IconAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#121212] font-medium block">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Clara Dupont"
              className="editorial-input w-full p-2.5 text-xs font-sans"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#121212] font-medium block">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="clara@example.com"
              className="editorial-input w-full p-2.5 text-xs font-sans"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#121212] font-medium block">
              Mobile Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 012-7890"
              className="editorial-input w-full p-2.5 text-xs font-sans"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#121212] font-medium block">
              Password (Min 8 Characters) *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••••••"
              className="editorial-input w-full p-2.5 text-xs font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-noir py-4 text-xs flex items-center justify-center gap-2 group"
          >
            <span>{loading ? 'Creating Profile...' : 'Create Account'}</span>
            <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#E5E3DC] text-center text-xs text-[#5A5852] font-sans">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-[#121212] underline underline-offset-4 hover:text-[#5A5852]">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
