export function formatMoney(minorUnits: number = 0, currency: string = 'USD'): string {
  const majorUnits = (minorUnits / 100);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(majorUnits);
}

export function parseMoneyToMinor(majorStr: string | number): number {
  if (typeof majorStr === 'number') {
    return Math.round(majorStr * 100);
  }
  const clean = majorStr.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(clean);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export interface QuoteCalculationInputs {
  productPriceMinor: number;
  sourcingFeeMinor: number;
  shippingFeeMinor: number;
  applicableTaxesMinor: number;
  disclosedChargesMinor?: number;
  discountMinor?: number;
}

export interface QuoteCalculationResult {
  productPriceMinor: number;
  sourcingFeeMinor: number;
  shippingFeeMinor: number;
  applicableTaxesMinor: number;
  disclosedChargesMinor: number;
  discountMinor: number;
  subtotalMinor: number;
  totalPayableMinor: number;
}

export function calculateQuoteTotals(inputs: QuoteCalculationInputs): QuoteCalculationResult {
  const productPrice = Math.max(0, Math.round(inputs.productPriceMinor));
  const sourcingFee = Math.max(0, Math.round(inputs.sourcingFeeMinor));
  const shippingFee = Math.max(0, Math.round(inputs.shippingFeeMinor));
  const taxes = Math.max(0, Math.round(inputs.applicableTaxesMinor));
  const charges = Math.max(0, Math.round(inputs.disclosedChargesMinor || 0));
  const discount = Math.max(0, Math.round(inputs.discountMinor || 0));

  const subtotalMinor = productPrice + sourcingFee + shippingFee + charges;
  const taxableAndDiscounted = subtotalMinor + taxes - discount;
  const totalPayableMinor = Math.max(0, taxableAndDiscounted);

  return {
    productPriceMinor: productPrice,
    sourcingFeeMinor: sourcingFee,
    shippingFeeMinor: shippingFee,
    applicableTaxesMinor: taxes,
    disclosedChargesMinor: charges,
    discountMinor: discount,
    subtotalMinor,
    totalPayableMinor,
  };
}
