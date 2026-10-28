import { OrderStatus, UserRole } from '@/types';
export type { OrderStatus };

export interface StatusMeta {
  label: string;
  category: 'request' | 'quote' | 'payment' | 'fulfilment' | 'delivery' | 'resolution' | 'terminal';
  customerDescription: string;
  adminDescription: string;
  colorClass: string;
  dotColor: string;
}

export const STATUS_METADATA: Record<OrderStatus, StatusMeta> = {
  REQUEST_SUBMITTED: {
    label: 'Request Submitted',
    category: 'request',
    customerDescription: 'Your request has been received. Our concierge team is verifying availability and authenticity.',
    adminDescription: 'New request pending initial feasibility review & eligibility check.',
    colorClass: 'bg-stone-100 text-stone-800 border-stone-200',
    dotColor: 'bg-stone-500',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    category: 'request',
    customerDescription: 'Our sourcing specialist is actively checking seller stock, condition, and logistics.',
    adminDescription: 'Assigned specialist is checking partner inventory and computing costs.',
    colorClass: 'bg-amber-50 text-amber-900 border-amber-200',
    dotColor: 'bg-amber-600',
  },
  MORE_INFORMATION_REQUIRED: {
    label: 'Clarification Needed',
    category: 'request',
    customerDescription: 'We need additional details (e.g., exact sizing or preferred retailer) to proceed.',
    adminDescription: 'Pending customer clarification on specifications or preferences.',
    colorClass: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    dotColor: 'bg-yellow-600',
  },
  REVIEW_REQUIRED: {
    label: 'Compliance Review',
    category: 'request',
    customerDescription: 'Your request is undergoing a secondary compliance review for policy compliance.',
    adminDescription: 'High-value or specialized item flagged for senior management inspection.',
    colorClass: 'bg-orange-50 text-orange-900 border-orange-200',
    dotColor: 'bg-orange-600',
  },
  QUOTE_SENT: {
    label: 'Quote Prepared',
    category: 'quote',
    customerDescription: 'Your customized quote is ready for review with itemized pricing and delivery timeline.',
    adminDescription: 'Quote dispatched to customer. Awaiting customer acceptance or decline.',
    colorClass: 'bg-blue-50 text-blue-900 border-blue-200 shadow-sm',
    dotColor: 'bg-blue-600',
  },
  QUOTE_ACCEPTED: {
    label: 'Quote Accepted',
    category: 'quote',
    customerDescription: 'You accepted the quote. Please complete payment to authorize acquisition.',
    adminDescription: 'Customer accepted terms. Order record generated; awaiting payment.',
    colorClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    dotColor: 'bg-emerald-600',
  },
  QUOTE_DECLINED: {
    label: 'Quote Declined',
    category: 'quote',
    customerDescription: 'You declined this quote. Our team can revise the parameters if you wish.',
    adminDescription: 'Customer declined current quote terms. Revision or closure required.',
    colorClass: 'bg-stone-100 text-stone-600 border-stone-200',
    dotColor: 'bg-stone-400',
  },
  AWAITING_PAYMENT: {
    label: 'Awaiting Payment',
    category: 'payment',
    customerDescription: 'Order confirmed pending payment authorization. Sourcing begins upon clearance.',
    adminDescription: 'Order created. Sourcing held until verified payment transaction occurs.',
    colorClass: 'bg-indigo-50 text-indigo-900 border-indigo-200 shadow-sm',
    dotColor: 'bg-indigo-600',
  },
  PAYMENT_CONFIRMED: {
    label: 'Payment Verified',
    category: 'payment',
    customerDescription: 'Payment confirmed securely. Our concierge team is now purchasing your item.',
    adminDescription: 'Verified payment on file. Sourcing team authorized to place supplier order.',
    colorClass: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold',
    dotColor: 'bg-emerald-600',
  },
  SOURCING_IN_PROGRESS: {
    label: 'Sourcing In Progress',
    category: 'fulfilment',
    customerDescription: 'Item successfully ordered from our verified source. En route to our inspection hub.',
    adminDescription: 'Supplier purchase executed. Awaiting dispatch to concierge processing facility.',
    colorClass: 'bg-sky-50 text-sky-900 border-sky-200',
    dotColor: 'bg-sky-600',
  },
  PRODUCT_ACQUIRED: {
    label: 'Product Acquired',
    category: 'fulfilment',
    customerDescription: 'Item has arrived at our facility and is queued for verification.',
    adminDescription: 'Physical product checked into intake hub. Assigned to QA inspector.',
    colorClass: 'bg-teal-50 text-teal-900 border-teal-200',
    dotColor: 'bg-teal-600',
  },
  QUALITY_CHECK: {
    label: 'Authentication & Forensics',
    category: 'fulfilment',
    customerDescription: 'Our specialists are inspecting stitching, hardware, tags, and authenticity criteria.',
    adminDescription: 'Authenticity authentication & condition inspection in progress.',
    colorClass: 'bg-purple-50 text-purple-900 border-purple-200',
    dotColor: 'bg-purple-600',
  },
  PACKING: {
    label: 'Archival Boxing',
    category: 'fulfilment',
    customerDescription: 'Item passed inspection and is being prepared in signature protective packaging.',
    adminDescription: 'QA passed. Packing into archival box with custom tamper-evident seals.',
    colorClass: 'bg-violet-50 text-violet-900 border-violet-200',
    dotColor: 'bg-violet-600',
  },
  SHIPPED: {
    label: 'In Courier Transit',
    category: 'fulfilment',
    customerDescription: 'Your package is on its way via tracked domestic courier.',
    adminDescription: 'Carrier manifest generated. Tracking number provided to customer.',
    colorClass: 'bg-cyan-50 text-cyan-900 border-cyan-200 shadow-sm',
    dotColor: 'bg-cyan-600',
  },
  OUT_FOR_DELIVERY: {
    label: 'Out For Delivery',
    category: 'delivery',
    customerDescription: 'Courier is delivering your package today.',
    adminDescription: 'Courier driver dispatched on final delivery leg.',
    colorClass: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    dotColor: 'bg-emerald-600',
  },
  DELIVERED: {
    label: 'Delivered',
    category: 'delivery',
    customerDescription: 'Delivered. Please confirm receipt and let us know your experience.',
    adminDescription: 'Carrier marked delivered. Awaiting customer confirmation or issue window close.',
    colorClass: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold',
    dotColor: 'bg-emerald-700',
  },
  CANCELLATION_REQUESTED: {
    label: 'Cancellation Requested',
    category: 'resolution',
    customerDescription: 'You requested a cancellation. Our team is assessing whether acquisition can be halted.',
    adminDescription: 'Customer cancellation request submitted. Reviewing supplier cancellation policy.',
    colorClass: 'bg-rose-50 text-rose-900 border-rose-200',
    dotColor: 'bg-rose-600',
  },
  CANCELLED: {
    label: 'Cancelled',
    category: 'terminal',
    customerDescription: 'This request or order has been cancelled in accordance with our policy.',
    adminDescription: 'Order terminated. Sourcing halted and inventory returned/cancelled.',
    colorClass: 'bg-stone-100 text-stone-600 border-stone-200',
    dotColor: 'bg-stone-400',
  },
  REFUND_PENDING: {
    label: 'Refund Processing',
    category: 'resolution',
    customerDescription: 'Your refund has been authorized and is being processed back to your original payment method.',
    adminDescription: 'Refund approved. Provider batch settlement pending reconciliation.',
    colorClass: 'bg-amber-50 text-amber-900 border-amber-200',
    dotColor: 'bg-amber-600',
  },
  REFUNDED: {
    label: 'Refunded',
    category: 'terminal',
    customerDescription: 'Refund completed. Please allow 3-5 business days for bank settlement.',
    adminDescription: 'Settlement confirmed by payment gateway. Transaction closed.',
    colorClass: 'bg-stone-100 text-stone-800 border-stone-300',
    dotColor: 'bg-stone-500',
  },
  DISPUTED: {
    label: 'Dispute / Exception',
    category: 'resolution',
    customerDescription: 'An issue report is open. A dedicated senior specialist has been assigned.',
    adminDescription: 'Customer report or delivery exception flagged. Resolution investigation required.',
    colorClass: 'bg-red-50 text-red-900 border-red-200 font-semibold',
    dotColor: 'bg-red-600',
  },
  REJECTED: {
    label: 'Request Declined',
    category: 'terminal',
    customerDescription: 'We could not accept this request due to sourcing restrictions, policy, or seller ineligibility.',
    adminDescription: 'Rejected after assessment. Reason documented in customer record.',
    colorClass: 'bg-rose-50 text-rose-800 border-rose-200',
    dotColor: 'bg-rose-600',
  },
};

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  REQUEST_SUBMITTED: ['UNDER_REVIEW', 'MORE_INFORMATION_REQUIRED', 'REJECTED'],
  UNDER_REVIEW: ['QUOTE_SENT', 'MORE_INFORMATION_REQUIRED', 'REVIEW_REQUIRED', 'REJECTED'],
  MORE_INFORMATION_REQUIRED: ['UNDER_REVIEW', 'REJECTED'],
  REVIEW_REQUIRED: ['UNDER_REVIEW', 'REJECTED'],
  QUOTE_SENT: ['QUOTE_ACCEPTED', 'QUOTE_DECLINED', 'REJECTED'],
  QUOTE_ACCEPTED: ['AWAITING_PAYMENT', 'CANCELLATION_REQUESTED'],
  QUOTE_DECLINED: ['UNDER_REVIEW', 'REJECTED'],
  AWAITING_PAYMENT: ['PAYMENT_CONFIRMED', 'CANCELLATION_REQUESTED', 'CANCELLED'],
  PAYMENT_CONFIRMED: ['SOURCING_IN_PROGRESS', 'CANCELLATION_REQUESTED', 'REFUND_PENDING'],
  SOURCING_IN_PROGRESS: ['PRODUCT_ACQUIRED', 'CANCELLATION_REQUESTED', 'REFUND_PENDING'],
  PRODUCT_ACQUIRED: ['QUALITY_CHECK', 'REFUND_PENDING'],
  QUALITY_CHECK: ['PACKING', 'REFUND_PENDING', 'DISPUTED'],
  PACKING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'DISPUTED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'DISPUTED'],
  DELIVERED: ['DISPUTED', 'CANCELLATION_REQUESTED'],
  CANCELLATION_REQUESTED: ['CANCELLED', 'REFUND_PENDING', 'PAYMENT_CONFIRMED'],
  CANCELLED: ['REFUND_PENDING', 'REFUNDED'],
  REFUND_PENDING: ['REFUNDED', 'DISPUTED'],
  REFUNDED: [],
  DISPUTED: ['UNDER_REVIEW', 'REFUND_PENDING'],
  REJECTED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus, role: UserRole): { allowed: boolean; reason?: string } {
  if (from === to) {
    return { allowed: false, reason: 'Status is already set to this state.' };
  }

  const allowedNext = VALID_TRANSITIONS[from] || [];
  if (!allowedNext.includes(to)) {
    return {
      allowed: false,
      reason: `Transition from ${from} to ${to} is invalid in the order state machine.`,
    };
  }

  if (role === 'CUSTOMER') {
    const customerAllowed = [
      'QUOTE_ACCEPTED',
      'QUOTE_DECLINED',
      'CANCELLATION_REQUESTED',
      'DELIVERED',
      'DISPUTED',
    ];
    if (!customerAllowed.includes(to)) {
      return { allowed: false, reason: 'Customers cannot trigger this status transition directly.' };
    }
  }

  return { allowed: true };
}
