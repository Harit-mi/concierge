export type OrderStatus =
  | 'REQUEST_SUBMITTED'
  | 'UNDER_REVIEW'
  | 'MORE_INFORMATION_REQUIRED'
  | 'REVIEW_REQUIRED'
  | 'QUOTE_SENT'
  | 'QUOTE_ACCEPTED'
  | 'QUOTE_DECLINED'
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_CONFIRMED'
  | 'SOURCING_IN_PROGRESS'
  | 'PRODUCT_ACQUIRED'
  | 'QUALITY_CHECK'
  | 'PACKING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLATION_REQUESTED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'DISPUTED'
  | 'REJECTED';

export type UserRole = 'CUSTOMER' | 'CONCIERGE_OPERATOR' | 'ADMIN';

export type ProductCategory =
  | 'CLOTHING'
  | 'SNEAKERS_FOOTWEAR'
  | 'ACCESSORIES_NON_REGULATED';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  preferredCurrency: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  countryCode: string;
  deliveryInstructions?: string;
}

export interface ProductRequest {
  id: string;
  referenceNumber: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  productName: string;
  brand: string;
  productUrl?: string;
  category: ProductCategory;
  sizeVariant?: string;
  colorVariant?: string;
  preferredSeller?: string;
  quantity: number;
  maxBudgetMinor?: number; // Integer minor units (e.g. cents)
  currency: string;
  destinationPostalCode: string;
  desiredDeliveryTimeframe?: string;
  additionalNotes?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  status: OrderStatus;
  rejectionReason?: string;
  consentGivenAt: string;
  createdAt: string;
  updatedAt: string;
  images?: ProductRequestImage[];
  quote?: Quote;
  order?: Order;
}

export interface ProductRequestImage {
  id: string;
  requestId: string;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number;
  mimeType: string;
  createdAt: string;
}

export interface QuoteLineItem {
  id: string;
  quoteId: string;
  description: string;
  category: 'PRODUCT' | 'SERVICE_FEE' | 'SHIPPING' | 'TAX' | 'HANDLING' | 'DISCOUNT';
  amountMinor: number;
  createdAt: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  requestId: string;
  productPriceMinor: number;
  sourcingFeeMinor: number;
  shippingFeeMinor: number;
  applicableTaxesMinor: number;
  disclosedChargesMinor: number;
  discountMinor: number;
  totalPayableMinor: number;
  currency: string;
  expiresAt: string;
  expectedFulfilmentEstimate: string;
  notesAndAssumptions?: string;
  status: 'DRAFT' | 'QUOTE_SENT' | 'QUOTE_ACCEPTED' | 'QUOTE_DECLINED' | 'EXPIRED';
  customerActionAt?: string;
  createdByUserId: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  lineItems?: QuoteLineItem[];
}

export interface Order {
  id: string;
  orderNumber: string;
  requestId: string;
  quoteId: string;
  customerId: string;
  customerName?: string;
  assignedStaffId?: string;
  status: OrderStatus;
  totalPaidMinor: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  sourcingRecord?: SourcingRecord;
  shipment?: Shipment;
  deliveryConfirmation?: DeliveryConfirmation;
  payments?: Payment[];
}

export interface Supplier {
  id: string;
  name: string;
  contactEmail?: string;
  website?: string;
  reputationScore: number;
  isVerified: boolean;
  notes?: string;
}

export interface SourcingRecord {
  id: string;
  orderId: string;
  supplierId?: string;
  supplierName?: string;
  supplierOrderReference?: string;
  costPriceMinor: number;
  currency: string;
  acquisitionDate?: string;
  qualityCheckNotes?: string;
  qualityPassed?: boolean;
  createdByUserId: string;
  createdAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  carrierName: string;
  trackingNumber: string;
  trackingUrl?: string;
  labelUrl?: string;
  shippedAt?: string;
  estimatedDeliveryAt?: string;
  actualDeliveryAt?: string;
  status: string;
  createdAt: string;
}

export interface DeliveryConfirmation {
  id: string;
  orderId: string;
  confirmedByUserId: string;
  deliveredAt: string;
  recipientNotes?: string;
  satisfactionRating?: number;
  issueReported: boolean;
  issueDescription?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentReference: string;
  provider: string;
  amountMinor: number;
  currency: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  providerTransactionId?: string;
  idempotencyKey: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface Refund {
  id: string;
  orderId: string;
  paymentId?: string;
  amountMinor: number;
  currency: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED';
  processedAt?: string;
  authorizedByUserId?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  messageText: string;
  isInternalNote: boolean;
  readAt?: string;
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  requestId?: string;
  orderId?: string;
  uploadedByUserId: string;
  uploaderName?: string;
  documentType:
    | 'QUOTE_PDF'
    | 'ORDER_CONFIRMATION'
    | 'SUPPLIER_INVOICE'
    | 'CUSTOMER_RECEIPT'
    | 'SHIPPING_LABEL'
    | 'DELIVERY_PROOF'
    | 'COMPLIANCE_DOC';
  title: string;
  filePath: string;
  mimeType: string;
  isConfidentialOperatorOnly: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorUserId: string;
  actorName?: string;
  actorRole?: string;
  actionType: string;
  resourceType: string;
  resourceId: string;
  metadataJson?: string;
  createdAt: string;
}
