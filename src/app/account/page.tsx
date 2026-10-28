'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IconUser,
  IconMapPin,
  IconBell,
  IconShield,
  IconSave,
  IconCheckCircle,
  IconLock,
  IconArrowLeft,
} from '@/components/icons/FlaticonIcons';
import { DashboardNav } from '@/components/DashboardNav';

export default function AccountPage() {
  const [profile, setProfile] = useState({
    name: 'Alexander Hayes',
    email: 'customer@example.com',
    phone: '+1 (555) 019-2834',
    addressLine1: '575 Madison Avenue',
    addressLine2: 'Apt 14B',
    city: 'New York',
    state: 'NY',
    postalCode: '10022',
    deliveryInstructions: 'Doorman building. Leave with front desk if signature service permits or call cell upon arrival.',
    notifyEmailQuote: true,
    notifySmsDispatch: true,
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProfile((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <DashboardNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#141519]">
        {/* Header */}
        <div className="border-b border-[#EAE4D9] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#7A603D] font-semibold block mb-1">
              Private Client Credentials
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141519]">
              Account & Delivery Coordinates
            </h1>
            <p className="text-xs text-[#5C5F6D] mt-0.5 font-sans">
              Manage your verified mainland US shipping address, contact channels, and concierge alert preferences.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F5EFE4] text-[#7A603D] border border-[#D8C3A4] px-3 py-1.5 rounded-xs font-mono text-xs font-semibold self-start sm:self-center">
            <IconShield className="w-4 h-4 text-[#A38054]" />
            <span>Tier-1 Verified Private Client</span>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-sm text-xs font-mono flex items-center gap-3">
            <IconCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Account coordinates and delivery profile updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Contact Details */}
          <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] space-y-5">
            <div className="border-b border-[#F2EDE4] pb-3 flex items-center gap-2">
              <IconUser className="w-4 h-4 text-[#A38054]" />
              <h3 className="font-serif font-bold text-base text-[#141519]">
                Personal Identity & Channels
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="ivory-input w-full p-3 rounded-sm text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="ivory-input w-full p-3 rounded-sm text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Mobile Phone (SMS Carrier Updates)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="ivory-input w-full p-3 rounded-sm text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Delivery Coordinates */}
          <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] space-y-5">
            <div className="border-b border-[#F2EDE4] pb-3 flex items-center gap-2">
              <IconMapPin className="w-4 h-4 text-[#A38054]" />
              <h3 className="font-serif font-bold text-base text-[#141519]">
                Default Mainland US Delivery Address
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Street Address
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={profile.addressLine1}
                  onChange={handleChange}
                  className="ivory-input w-full p-3 rounded-sm text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Apartment, Suite, Unit
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={profile.addressLine2}
                  onChange={handleChange}
                  className="ivory-input w-full p-3 rounded-sm text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  className="ivory-input w-full p-3 rounded-sm text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  className="ivory-input w-full p-3 rounded-sm text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={profile.postalCode}
                  onChange={handleChange}
                  className="ivory-input w-full p-3 rounded-sm text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                Courier Delivery Instructions
              </label>
              <textarea
                rows={2}
                name="deliveryInstructions"
                value={profile.deliveryInstructions}
                onChange={handleChange}
                className="ivory-input w-full p-3 rounded-sm text-xs font-mono"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="ivory-card p-6 sm:p-8 rounded-sm bg-white border border-[#EAE4D9] space-y-4">
            <div className="border-b border-[#F2EDE4] pb-3 flex items-center gap-2">
              <IconBell className="w-4 h-4 text-[#A38054]" />
              <h3 className="font-serif font-bold text-base text-[#141519]">
                Notification Preferences
              </h3>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyEmailQuote"
                  checked={profile.notifyEmailQuote}
                  onChange={handleChange}
                  className="rounded border-[#E2DDD2] text-[#A38054] focus:ring-[#A38054]"
                />
                <span className="text-[#5C5F6D]">
                  Receive immediate email notification when an itemized quote is issued or revised.
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifySmsDispatch"
                  checked={profile.notifySmsDispatch}
                  onChange={handleChange}
                  className="rounded border-[#E2DDD2] text-[#A38054] focus:ring-[#A38054]"
                />
                <span className="text-[#5C5F6D]">
                  Receive real-time SMS text dispatch and tracking link updates when order departs intake lab.
                </span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-obsidian px-8 py-3.5 text-xs flex items-center gap-2 shadow-luxury group"
            >
              <IconSave className="w-4 h-4 text-[#C4A575]" />
              <span>{saving ? 'Updating...' : 'Save Profile Coordinates'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
