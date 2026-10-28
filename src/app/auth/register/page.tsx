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
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-md mx-auto space-y-8 text-[#141519]">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-sm bg-[#141519] border border-[#A38054] text-[#DFCCA8] flex items-center justify-center font-serif text-lg font-bold mx-auto mb-3 shadow-xs">
          V
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#141519] tracking-tight">
          Create Client Profile
        </h1>
        <p className="text-xs text-[#5C5F6D] font-sans">
          Join Veritas to track sourcing requests, review quotes, and monitor order progress.
        </p>
      </div>

      <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] shadow-sm space-y-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xs text-xs flex items-center gap-2">
            <IconAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#141519] font-semibold block">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Clara Dupont"
              className="ivory-input w-full p-2.5 rounded-sm text-xs font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#141519] font-semibold block">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="clara@example.com"
              className="ivory-input w-full p-2.5 rounded-sm text-xs font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#141519] font-semibold block">
              Mobile Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 012-7890"
              className="ivory-input w-full p-2.5 rounded-sm text-xs font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#141519] font-semibold block">
              Password (Min 8 Characters) *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••••••"
              className="ivory-input w-full p-2.5 rounded-sm text-xs font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-obsidian py-4 text-xs shadow-luxury flex items-center justify-center gap-2 group"
          >
            <span>{loading ? 'Creating Profile...' : 'Create Account'}</span>
            <IconArrowRight className="w-3.5 h-3.5 text-[#C4A575] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#F2EDE4] text-center text-xs text-[#5C5F6D] font-sans">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-[#A38054] underline underline-offset-4 hover:text-[#141519]">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
