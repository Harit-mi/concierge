'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  IconUpload,
  IconAlert,
  IconCheckCircle,
  IconLock,
  IconArrowRight,
  IconArrowLeft,
  IconInfo,
  IconSave,
  IconTrash,
  IconFileText,
  IconShield,
  IconSneaker,
  IconHanger,
  IconPackage,
} from '@/components/icons/FlaticonIcons';

export default function RequestProductPage() {
  const router = useRouter();

  // 4-Step Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Step 1: Product Reference
    productUrl: '',
    productName: '',
    productDescription: '',
    // Step 2: Specifications
    brand: '',
    model: '',
    category: 'SNEAKERS_FOOTWEAR',
    sizeVariant: '',
    colorVariant: '',
    preferredSeller: '',
    quantity: '1',
    // Step 3: Budget & Delivery
    maxBudgetMajor: '',
    currency: 'USD',
    destinationPostalCode: '',
    destinationAddress: '',
    desiredDeliveryTimeframe: 'Standard (5-10 business days)',
    additionalNotes: '',
    // Step 4: Contact & Consent
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    consentTerms: false,
    consentPrivacy: false,
  });

  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<{ name: string; url: string; size: number; type: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');

  // Restore Draft from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('veritas_sourcing_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) {
          setFormData(parsed.formData);
          if (parsed.images) setImages(parsed.images);
          setDraftSavedTime(parsed.savedAt || 'Earlier');
        }
      }
    } catch {
      // LocalStorage error recovery
    }
  }, []);

  // Save draft helper
  const handleSaveDraft = () => {
    try {
      const payload = {
        formData,
        images,
        savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      localStorage.setItem('veritas_sourcing_draft', JSON.stringify(payload));
      setDraftSavedTime(payload.savedAt);
    } catch {
      // Ignore storage quota error
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem('veritas_sourcing_draft');
    setDraftSavedTime(null);
    setFormData({
      productUrl: '',
      productName: '',
      productDescription: '',
      brand: '',
      model: '',
      category: 'SNEAKERS_FOOTWEAR',
      sizeVariant: '',
      colorVariant: '',
      preferredSeller: '',
      quantity: '1',
      maxBudgetMajor: '',
      currency: 'USD',
      destinationPostalCode: '',
      destinationAddress: '',
      desiredDeliveryTimeframe: 'Standard (5-10 business days)',
      additionalNotes: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      consentTerms: false,
      consentPrivacy: false,
    });
    setImages([]);
    setCurrentStep(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear inline error on edit
    if (stepErrors[name]) {
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedMime.includes(file.type)) {
      alert('Please upload a standard image file (JPEG, PNG, or WebP). Executables are prohibited.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setImages((prev) => [
        ...prev,
        {
          name: file.name,
          url: result,
          size: file.size,
          type: file.type,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      alert('Please enter a valid image URL starting with http:// or https://');
      return;
    }
    setImages((prev) => [
      ...prev,
      {
        name: 'web-reference.jpg',
        url: imageUrl.trim(),
        size: 1024 * 100,
        type: 'image/jpeg',
      },
    ]);
    setImageUrl('');
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Step Validation
  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.productName.trim()) {
        errors.productName = 'Product name or title is required.';
      }
      if (!formData.productUrl.trim() && !formData.productDescription.trim()) {
        errors.productUrl = 'Please provide either a product URL or a detailed description.';
      }
    } else if (stepNumber === 2) {
      if (!formData.brand.trim()) {
        errors.brand = 'Brand or fashion house is required.';
      }
      if (!formData.sizeVariant.trim()) {
        errors.sizeVariant = 'Exact size specification is required (e.g. US 10.5, Medium, 48).';
      }
      const qty = parseInt(formData.quantity);
      if (isNaN(qty) || qty < 1) {
        errors.quantity = 'Quantity must be at least 1.';
      }
    } else if (stepNumber === 3) {
      if (!formData.destinationPostalCode.trim()) {
        errors.destinationPostalCode = 'Destination ZIP or postal code is required.';
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.destinationPostalCode.trim())) {
        errors.destinationPostalCode = 'Please enter a valid 5-digit US ZIP code.';
      }
      if (formData.maxBudgetMajor) {
        const budget = parseFloat(formData.maxBudgetMajor);
        if (isNaN(budget) || budget <= 0) {
          errors.maxBudgetMajor = 'Budget must be a positive number.';
        }
      }
    } else if (stepNumber === 4) {
      if (!formData.customerName.trim()) {
        errors.customerName = 'Your full name is required.';
      }
      if (!formData.customerEmail.trim() || !formData.customerEmail.includes('@')) {
        errors.customerEmail = 'A valid email address is required for quote delivery.';
      }
      if (!formData.consentTerms || !formData.consentPrivacy) {
        errors.consent = 'You must acknowledge the terms and pilot sourcing policies.';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      handleSaveDraft();
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Check or auto-login customer
      let customerId = 'usr-customer-1';
      try {
        const sessionRes = await fetch('/api/auth/me');
        const sessionData = await sessionRes.json();
        if (sessionData.user) {
          customerId = sessionData.user.id;
        }
      } catch {
        // Fallback demo user
      }

      const payload = {
        customerId,
        productName: formData.productName,
        brand: formData.brand,
        productUrl: formData.productUrl || undefined,
        category: formData.category,
        sizeVariant: formData.sizeVariant || undefined,
        colorVariant: formData.colorVariant || undefined,
        preferredSeller: formData.preferredSeller || undefined,
        quantity: parseInt(formData.quantity) || 1,
        maxBudgetMajor: formData.maxBudgetMajor ? parseFloat(formData.maxBudgetMajor) : undefined,
        destinationPostalCode: formData.destinationPostalCode,
        desiredDeliveryTimeframe: formData.desiredDeliveryTimeframe || undefined,
        additionalNotes: [
          formData.productDescription ? `Description: ${formData.productDescription}` : null,
          formData.destinationAddress ? `Delivery Address: ${formData.destinationAddress}` : null,
          formData.additionalNotes ? `Notes: ${formData.additionalNotes}` : null,
        ].filter(Boolean).join(' | '),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || undefined,
        consentGiven: formData.consentTerms && formData.consentPrivacy,
        consentTerms: formData.consentTerms,
        consentPrivacy: formData.consentPrivacy,
        images: images.map((img) => ({
          fileName: img.name,
          fileUrl: img.url,
          fileSizeBytes: img.size,
          mimeType: img.type,
        })),
      };

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request.');
      }

      // Clear draft on successful submission
      localStorage.removeItem('veritas_sourcing_draft');

      // Route to confirmation page
      const refCode = data.referenceNumber || data.request?.referenceNumber || 'REQ-PENDING';
      const reqId = data.requestId || data.request?.id || '';
      router.push(`/request/confirmation?ref=${refCode}&id=${reqId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed. Please check network connection.');
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 text-[#121212]">
      {/* Title & Process Indicator */}
      <div className="text-center space-y-4">
        <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#121212] border-l-2 border-[#121212] pl-3">
          Sourcing Request &bull; Private Desk
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#121212]">
          Commission a Sourcing Search
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5852] font-sans max-w-xl mx-auto leading-relaxed">
          Stage {currentStep} of IV &bull; Reviewed by our Manhattan procurement specialists before an itemized quote is issued.
        </p>

        {/* Draft Saving Status Bar */}
        <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#5A5852] pt-2">
          {draftSavedTime ? (
            <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10.5px]">
              <IconSave className="w-3.5 h-3.5" />
              <span>Draft auto-saved at {draftSavedTime}</span>
            </span>
          ) : (
            <span className="text-[10.5px] text-[#8A8880]">Auto-saves to browser memory as you type</span>
          )}
          <button
            type="button"
            onClick={handleClearDraft}
            className="text-[10.5px] text-[#5A5852] hover:text-[#121212] underline underline-offset-4 flex items-center gap-1"
          >
            <IconTrash className="w-3 h-3" /> Reset Form
          </button>
        </div>
      </div>

      {/* 4-Step Progress Ribbon */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2 font-mono text-xs border-b border-[#E5E3DC] pb-3 overflow-hidden">
        {[
          { step: 1, full: 'I. Reference & Media', short: 'I. Media' },
          { step: 2, full: 'II. Specifications', short: 'II. Specs' },
          { step: 3, full: 'III. Budget & Delivery', short: 'III. Budget' },
          { step: 4, full: 'IV. Authorization', short: 'IV. Review' },
        ].map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => {
              if (item.step < currentStep || validateStep(currentStep)) {
                setCurrentStep(item.step);
              }
            }}
            className={`p-1.5 sm:p-3 text-center border-b-2 text-[9px] sm:text-[10.5px] font-mono tracking-wider uppercase transition-all truncate ${
              currentStep === item.step
                ? 'border-[#121212] text-[#121212] font-semibold bg-white'
                : currentStep > item.step
                ? 'border-emerald-700 text-emerald-900 bg-[#F3F2EC]'
                : 'border-transparent text-[#8A8880] opacity-60'
            }`}
          >
            <span className="hidden sm:inline">{item.full}</span>
            <span className="sm:hidden">{item.short}</span>
          </button>
        ))}
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 text-xs flex items-center gap-3">
          <IconAlert className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Non-binding purchase reminder */}
      <div className="bg-[#F3F2EC] border border-[#E5E3DC] p-4 flex items-start gap-3 text-xs text-[#5A5852] font-sans">
        <IconInfo className="w-4 h-4 text-[#121212] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#121212] font-medium">Non-Binding Inquiry: </strong>
          Submitting this inquiry creates a preliminary feasibility check. It is not an order confirmation, purchase charge, or guarantee of product availability.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E5E3DC] p-6 sm:p-12 space-y-10 shadow-sm rounded-[1px]">
        {/* STEP 1: PRODUCT IDENTIFIER & MEDIA */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-[#F2EDE4] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#141519]">
                Step 1: Product Identifier & Reference Media
              </h3>
              <p className="text-xs text-[#5C5F6D] font-sans">
                Provide a product link, name, and optional reference photos so our team can identify the exact model.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                Product Name or Title *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g. Air Jordan 1 Retro Low OG SP 'Canary' or Homme Plissé Pleated Jacket"
                className="editorial-input w-full p-3 rounded-sm text-xs"
              />
              {stepErrors.productName && (
                <p className="text-xs text-rose-600 font-mono">{stepErrors.productName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                Product Link / Retailer Reference URL
              </label>
              <input
                type="url"
                name="productUrl"
                value={formData.productUrl}
                onChange={handleChange}
                placeholder="https://www.nike.com/... or https://kith.com/..."
                className="editorial-input w-full p-3 rounded-sm text-xs"
              />
              <p className="text-[11px] text-[#717584]">
                A URL helps our team identify exact batch codes, retailers, and style numbers.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                Detailed Product Description (If no URL)
              </label>
              <textarea
                rows={3}
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                placeholder="Describe color scheme, specific collaboration year, archival season, or distinguishing features..."
                className="editorial-input w-full p-3 rounded-sm text-xs"
              />
              {stepErrors.productUrl && (
                <p className="text-xs text-rose-600 font-mono">{stepErrors.productUrl}</p>
              )}
            </div>

            {/* Optional Media Upload */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                Optional Reference Image (Upload or Paste Link)
              </label>
              <div className="border-2 border-dashed border-[#E2DDD2] p-6 rounded-sm text-center bg-[#FAF8F5] space-y-3">
                <IconUpload className="w-6 h-6 text-[#A38054] mx-auto" />
                <div className="text-xs text-[#5C5F6D]">
                  <label className="text-[#A38054] hover:underline cursor-pointer font-semibold">
                    <span>Click to browse standard image files</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-[#717584] mt-1">JPEG, PNG, WebP up to 5MB (strictly no executables)</p>
                </div>

                <div className="pt-2 flex gap-2 max-w-md mx-auto">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste external image URL..."
                    className="editorial-input flex-1 p-2 rounded-sm text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="btn-outline px-4 py-2 text-[10.5px]"
                  >
                    Attach
                  </button>
                </div>
              </div>

              {/* Uploaded Images Preview Gallery */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative rounded-sm border border-[#E2DDD2] overflow-hidden group h-24 bg-white">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-[#141519]/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <IconTrash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: BRAND, CATEGORY & SPECIFICATIONS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-[#F2EDE4] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#141519]">
                Step 2: Brand & Exact Specifications
              </h3>
              <p className="text-xs text-[#5C5F6D] font-sans">
                Tell us the brand, sizing, colorway, and quantity so we source the precise specification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Brand / Fashion House *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Maison Margiela, Nike, Bottega Veneta"
                  className="editorial-input w-full p-3 rounded-sm text-xs"
                />
                {stepErrors.brand && (
                  <p className="text-xs text-rose-600 font-mono">{stepErrors.brand}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="editorial-input w-full p-3 rounded-sm text-xs"
                >
                  <option value="SNEAKERS_FOOTWEAR">Sneakers & Footwear (Verified Deadstock)</option>
                  <option value="CLOTHING">Designer Clothing (Apparel & Outerwear)</option>
                  <option value="ACCESSORIES_NON_REGULATED">Fashion Accessories (Eligible Leather Goods)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Exact Sizing *
                </label>
                <input
                  type="text"
                  name="sizeVariant"
                  value={formData.sizeVariant}
                  onChange={handleChange}
                  placeholder="e.g. US 10.5 / EU 44.5 / Medium"
                  className="editorial-input w-full p-3 rounded-sm text-xs"
                />
                {stepErrors.sizeVariant && (
                  <p className="text-xs text-rose-600 font-mono">{stepErrors.sizeVariant}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Colourway / Variant
                </label>
                <input
                  type="text"
                  name="colorVariant"
                  value={formData.colorVariant}
                  onChange={handleChange}
                  placeholder="e.g. Canary Yellow / Light Silver / Chalk"
                  className="editorial-input w-full p-3 rounded-sm text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Preferred Seller / Retailer (Optional)
                </label>
                <input
                  type="text"
                  name="preferredSeller"
                  value={formData.preferredSeller}
                  onChange={handleChange}
                  placeholder="e.g. Kith Soho, SSENSE, Dover Street Market"
                  className="editorial-input w-full p-3 rounded-sm text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  max="5"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="editorial-input w-full p-3 rounded-sm text-xs"
                />
                {stepErrors.quantity && (
                  <p className="text-xs text-rose-600 font-mono">{stepErrors.quantity}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BUDGET, CURRENCY & DESTINATION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-[#F2EDE4] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#141519]">
                Step 3: Target Budget & Domestic Destination
              </h3>
              <p className="text-xs text-[#5C5F6D] font-sans">
                Set a budget ceiling to guide our sourcing team and confirm domestic delivery coordinates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Maximum Budget Ceiling (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-xs font-mono text-[#717584]">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="maxBudgetMajor"
                    value={formData.maxBudgetMajor}
                    onChange={handleChange}
                    placeholder="e.g. 750.00"
                    className="editorial-input w-full pl-7 pr-3 py-3 rounded-sm text-xs"
                  />
                </div>
                <p className="text-[11px] text-[#717584]">
                  Optional guideline. If market price exceeds your budget, we consult you before preparing a quote.
                </p>
                {stepErrors.maxBudgetMajor && (
                  <p className="text-xs text-rose-600 font-mono">{stepErrors.maxBudgetMajor}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Currency
                </label>
                <input
                  type="text"
                  value="USD ($ - United States Dollar)"
                  disabled
                  className="editorial-input w-full p-3 rounded-sm text-xs bg-[#FAF8F5] text-[#717584]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Destination US Postal / ZIP Code *
                </label>
                <input
                  type="text"
                  name="destinationPostalCode"
                  value={formData.destinationPostalCode}
                  onChange={handleChange}
                  placeholder="e.g. 10022 or 90210"
                  className="editorial-input w-full p-3 rounded-sm text-xs"
                />
                {stepErrors.destinationPostalCode && (
                  <p className="text-xs text-rose-600 font-mono">{stepErrors.destinationPostalCode}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Desired Delivery Timeframe
                </label>
                <select
                  name="desiredDeliveryTimeframe"
                  value={formData.desiredDeliveryTimeframe}
                  onChange={handleChange}
                  className="editorial-input w-full p-3 rounded-sm text-xs"
                >
                  <option value="Standard (5-10 business days)">Standard (5-10 business days)</option>
                  <option value="Priority Expedited (3-5 business days)">Priority Expedited (3-5 business days)</option>
                  <option value="Archival Search (Flexible up to 30 days)">Archival Search (Flexible up to 30 days)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                Destination Street Address (Optional at Inquiry Stage)
              </label>
              <input
                type="text"
                name="destinationAddress"
                value={formData.destinationAddress}
                onChange={handleChange}
                placeholder="e.g. 575 Madison Ave, Apt 14B, New York, NY"
                className="editorial-input w-full p-3 rounded-sm text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                Additional Instructions or Conditioning Demands
              </label>
              <textarea
                rows={2}
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="e.g. Must include original box with intact lid; OG laces required; gift packaging requested..."
                className="editorial-input w-full p-3 rounded-sm text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT, CONSENT & REVIEW SUMMARY */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-[#F2EDE4] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#141519]">
                Step 4: Contact Information & Request Summary
              </h3>
              <p className="text-xs text-[#5C5F6D] font-sans">
                Review your request details before submitting to our concierge intake desk.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Alexander Hayes"
                  className="editorial-input w-full p-3 rounded-sm text-xs"
                />
                {stepErrors.customerName && (
                  <p className="text-xs text-rose-600 font-mono">{stepErrors.customerName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="alexander@example.com"
                  className="editorial-input w-full p-3 rounded-sm text-xs"
                />
                {stepErrors.customerEmail && (
                  <p className="text-xs text-rose-600 font-mono">{stepErrors.customerEmail}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#141519] font-semibold block">
                  Mobile Phone (SMS updates)
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2834"
                  className="editorial-input w-full p-3 rounded-sm text-xs"
                />
              </div>
            </div>

            {/* REVIEW SUMMARY CARD */}
            <div className="bg-[#FAF8F5] p-5 rounded-sm border border-[#EAE4D9] space-y-3 font-mono text-xs">
              <div className="font-serif font-bold text-sm text-[#141519] border-b border-[#EAE4D9] pb-2 flex items-center justify-between">
                <span>Inquiry Summary</span>
                <span className="text-[10px] text-[#7A603D] uppercase tracking-wider">Feasibility Review</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <span className="text-[#717584]">Product: </span>
                  <span className="text-[#141519] font-semibold">{formData.productName || '—'}</span>
                </div>
                <div>
                  <span className="text-[#717584]">Brand: </span>
                  <span className="text-[#141519] font-semibold">{formData.brand || '—'}</span>
                </div>
                <div>
                  <span className="text-[#717584]">Sizing: </span>
                  <span className="text-[#141519] font-semibold">{formData.sizeVariant || '—'}</span>
                </div>
                <div>
                  <span className="text-[#717584]">Quantity: </span>
                  <span className="text-[#141519] font-semibold">{formData.quantity}</span>
                </div>
                <div>
                  <span className="text-[#717584]">Target Budget: </span>
                  <span className="text-[#141519] font-semibold">
                    {formData.maxBudgetMajor ? `$${formData.maxBudgetMajor} USD` : 'Market rate'}
                  </span>
                </div>
                <div>
                  <span className="text-[#717584]">Destination: </span>
                  <span className="text-[#141519] font-semibold">ZIP {formData.destinationPostalCode || '—'}</span>
                </div>
              </div>
              {images.length > 0 && (
                <div className="pt-2 text-[11px] text-[#717584]">
                  Attached Reference Images: {images.length} file(s)
                </div>
              )}
            </div>

            {/* REQUIRED CONSENT CHECKBOXES */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs font-sans text-[#5C5F6D]">
                <input
                  type="checkbox"
                  name="consentTerms"
                  checked={formData.consentTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-[#E2DDD2] text-[#A38054] focus:ring-[#A38054]"
                />
                <span>
                  I understand that submitting this request is an inquiry. Veritas will verify seller legitimacy and prepare a binding itemized quote before any purchase commitment is made.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs font-sans text-[#5C5F6D]">
                <input
                  type="checkbox"
                  name="consentPrivacy"
                  checked={formData.consentPrivacy}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-[#E2DDD2] text-[#A38054] focus:ring-[#A38054]"
                />
                <span>
                  I acknowledge that Veritas operates within mainland US domestic pilot guidelines and agree to the Terms of Service and Privacy Policy.
                </span>
              </label>

              {stepErrors.consent && (
                <p className="text-xs text-rose-600 font-mono">{stepErrors.consent}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP CONTROLS & NAVIGATION */}
        <div className="pt-6 border-t border-[#E5E3DC] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="btn-outline px-6 py-3.5 text-xs flex items-center gap-2"
            >
              <IconArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-noir px-8 py-3.5 text-xs flex items-center gap-2 group"
            >
              <span>Continue</span>
              <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="btn-noir px-9 py-4 text-xs flex items-center gap-2 disabled:opacity-50 group"
            >
              <span>{submitting ? 'Transmitting Request...' : 'Submit Sourcing Request'}</span>
              <IconArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
