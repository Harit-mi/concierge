export interface CreatePaymentSessionParams {
  orderId: string;
  orderNumber: string;
  amountMinor: number;
  currency: string;
  productName: string;
  customerEmail: string;
  customerId: string;
  idempotencyKey: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentSessionResult {
  sessionId: string;
  paymentUrl: string;
  provider: string;
  clientSecret?: string;
}

export interface WebhookEventPayload {
  eventId: string;
  eventType: 'payment_intent.succeeded' | 'checkout.session.completed' | 'payment_intent.payment_failed';
  orderId: string;
  amountMinor: number;
  currency: string;
  providerTransactionId: string;
  idempotencyKey?: string;
  rawPayload: any;
}

export interface PaymentProvider {
  name: string;
  createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult>;
  verifyAndParseWebhook(rawBody: string, signature: string): Promise<WebhookEventPayload | null>;
}
