'use client';

import React, { useEffect, useState } from 'react';
import {
  IconUser,
  IconMapPin,
  IconCheckCircle,
  IconShield,
} from '@/components/icons/FlaticonIcons';

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<any>({
    name: 'Alexander Hayes',
    email: 'customer@example.com',
    phone: '+1 (555) 012-9842',
    shippingAddressLine1: '742 Evergreen Terrace, Apt 4B',
    city: 'New York',
    stateProvince: 'NY',
    postalCode: '10001',
    deliveryInstructions: 'Leave with 24/7 building concierge. Signature required for high-value parcels.',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-titanium-200">
      <div className="border-b border-white/5 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Client Profile & Delivery Destination
        </h1>
        <p className="text-xs text-titanium-400 mt-1 font-sans">
          Manage your verified contact details and default mainland US shipping coordinates.
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-2.5">
          <IconCheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Profile and delivery destination successfully updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="stealth-card p-6 sm:p-10 space-y-8 border border-white/10 shadow-2xl">
        <div className="space-y-5">
          <h3 className="font-serif font-bold text-base text-white border-b border-white/5 pb-3">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="stealth-input w-full text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="stealth-input w-full text-xs opacity-60 bg-carbon-900 cursor-not-allowed font-mono"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Direct Telephone
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="stealth-input w-full text-xs"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-serif font-bold text-base text-white">
              Default Domestic Delivery Address
            </h3>
            <span className="text-[10px] font-mono text-bronze-300 bg-carbon-800 border border-white/10 px-2.5 py-0.5 rounded">
              Domestic Pilot (US Only)
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Street Address & Suite / Apt
              </label>
              <input
                type="text"
                value={profile.shippingAddressLine1}
                onChange={(e) => setProfile({ ...profile, shippingAddressLine1: e.target.value })}
                className="stealth-input w-full text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                  City
                </label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="stealth-input w-full text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                  State
                </label>
                <input
                  type="text"
                  value={profile.stateProvince}
                  onChange={(e) => setProfile({ ...profile, stateProvince: e.target.value })}
                  className="stealth-input w-full text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={profile.postalCode}
                  onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                  className="stealth-input w-full text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-titanium-300 block">
                Special Delivery / Concierge Instructions
              </label>
              <textarea
                rows={2}
                value={profile.deliveryInstructions}
                onChange={(e) => setProfile({ ...profile, deliveryInstructions: e.target.value })}
                className="stealth-input w-full text-xs p-3.5"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-bronze-500 to-bronze-600 text-carbon-950 py-3.5 px-8 rounded-lg text-xs uppercase tracking-widest font-semibold hover:brightness-110 transition-all shadow-bronze-glow"
        >
          Save Profile & Preferences
        </button>
      </form>
    </div>
  );
}
