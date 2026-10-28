// Separated API / Mock Data Adapter for Customer & Admin Portals
import { formatMoney } from './pricing';

export interface SourcingRequestItem {
  id: string;
  referenceNumber: string;
  productName: string;
  brand: string;
  category: string;
  sizeVariant: string;
  colorVariant?: string;
  quantity: number;
  maxBudgetMajor?: number;
  destinationPostalCode: string;
  status: string;
  createdAt: string;
  imageUrl?: string;
  productUrl?: string;
  quoteId?: string;
  quoteTotalMinor?: number;
  quoteExpiresAt?: string;
  orderId?: string;
  orderNumber?: string;
  carrierName?: string;
  trackingNumber?: string;
}

export const MOCK_REQUESTS: SourcingRequestItem[] = [
  {
    id: 'req-travis-01',
    referenceNumber: 'REQ-2026-9041',
    productName: 'Air Jordan 1 Retro Low OG SP "Canary"',
    brand: 'Jordan Brand x Travis Scott',
    category: 'SNEAKERS_FOOTWEAR',
    sizeVariant: 'US 10.5 / EU 44.5',
    colorVariant: 'Canary / Light Silver',
    quantity: 1,
    maxBudgetMajor: 700,
    destinationPostalCode: '10022',
    status: 'QUOTE_SENT',
    createdAt: '2026-10-25T14:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
    productUrl: 'https://www.nike.com/snkrs/travis-scott',
    quoteId: 'qte-travis-01',
    quoteTotalMinor: 64100,
    quoteExpiresAt: '2026-11-01T23:59:59Z',
    orderId: 'ord-travis-01',
    orderNumber: 'ORD-2026-4401',
  },
  {
    id: 'req-issey-02',
    referenceNumber: 'REQ-2026-8812',
    productName: 'Homme Plissé Basic Pleated Blazer',
    brand: 'Homme Plissé Issey Miyake',
    category: 'CLOTHING',
    sizeVariant: 'Size 3 (Medium/Large)',
    colorVariant: 'Black (Charcoal)',
    quantity: 1,
    maxBudgetMajor: 850,
    destinationPostalCode: '90210',
    status: 'SOURCING_IN_PROGRESS',
    createdAt: '2026-10-22T09:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    productUrl: 'https://www.ssense.com/homme-plisse',
    quoteId: 'qte-issey-02',
    quoteTotalMinor: 74500,
    orderId: 'ord-issey-02',
    orderNumber: 'ORD-2026-4319',
    carrierName: 'UPS Express',
    trackingNumber: '1Z9999999999999999',
  },
  {
    id: 'req-bottega-03',
    referenceNumber: 'REQ-2026-7734',
    productName: 'Intrecciato Calfskin Card Case',
    brand: 'Bottega Veneta',
    category: 'ACCESSORIES_NON_REGULATED',
    sizeVariant: 'One Size',
    colorVariant: 'Travertine Green',
    quantity: 1,
    maxBudgetMajor: 450,
    destinationPostalCode: '10001',
    status: 'DELIVERED',
    createdAt: '2026-10-18T11:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    quoteId: 'qte-bottega-03',
    quoteTotalMinor: 42000,
    orderId: 'ord-bottega-03',
    orderNumber: 'ORD-2026-4105',
    carrierName: 'FedEx Priority Overnight',
    trackingNumber: '789123456789',
  },
  {
    id: 'req-margiela-04',
    referenceNumber: 'REQ-2026-6209',
    productName: 'Tabi Vintage Leather Ankle Boots (60mm)',
    brand: 'Maison Margiela',
    category: 'SNEAKERS_FOOTWEAR',
    sizeVariant: 'EU 41 / US 8',
    colorVariant: 'Vintage Black',
    quantity: 1,
    maxBudgetMajor: 1200,
    destinationPostalCode: '60611',
    status: 'UNDER_REVIEW',
    createdAt: '2026-10-26T16:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
  },
];

export async function fetchRequestsAdapter(): Promise<SourcingRequestItem[]> {
  try {
    const res = await fetch('/api/requests');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.requests) && data.requests.length > 0) {
        return data.requests;
      }
    }
  } catch (err) {
    console.warn('Backend API unavailable, using separated mock-data adapter', err);
  }
  return MOCK_REQUESTS;
}

export async function fetchRequestByIdAdapter(idOrRef: string): Promise<any> {
  try {
    const res = await fetch(`/api/requests/${idOrRef}`);
    if (res.ok) {
      const data = await res.json();
      if (data.request) return data;
    }
  } catch (err) {
    console.warn('Backend API unavailable, using mock adapter', err);
  }
  const found = MOCK_REQUESTS.find((r) => r.id === idOrRef || r.referenceNumber === idOrRef) || MOCK_REQUESTS[0];
  return {
    request: found,
    quote: found.quoteId
      ? {
          id: found.quoteId,
          quoteNumber: `QUO-${found.referenceNumber.replace('REQ-', '')}`,
          productPriceMinor: (found.quoteTotalMinor || 60000) - 12000,
          sourcingFeeMinor: 6400,
          shippingFeeMinor: 2400,
          applicableTaxesMinor: 3200,
          totalPayableMinor: found.quoteTotalMinor || 64100,
          currency: 'USD',
          status: found.status === 'QUOTE_SENT' ? 'QUOTE_SENT' : 'QUOTE_ACCEPTED',
          expiresAt: found.quoteExpiresAt || '2026-11-01T23:59:59Z',
          expectedFulfilmentEstimate: '7-10 business days upon payment clearance',
          notesAndAssumptions: 'Item acquired directly from verified authorized retail partner in original factory packaging.',
        }
      : null,
    order: found.orderId
      ? {
          id: found.orderId,
          orderNumber: found.orderNumber,
          status: found.status,
          carrierName: found.carrierName,
          trackingNumber: found.trackingNumber,
        }
      : null,
  };
}
