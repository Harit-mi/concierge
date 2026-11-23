import crypto from 'crypto';
import { PaymentProvider, CreatePaymentSessionParams, PaymentSessionResult, WebhookEventPayload } from './types';
import { getConfig } from '../config';

export class StripePaymentProvider implements PaymentProvider {
  name = 'stripe';

  private getSecretKey(): string {
    const config = getConfig();
    if (!config.payment.stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured.');
    }
    return config.payment.stripeSecretKey;
  }

  private getWebhookSecret(): string {
    const config = getConfig();
    if (!config.payment.stripeWebhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured.');
    }
    return config.payment.stripeWebhookSecret;
  }

  async createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    const secretKey = this.getSecretKey();

    // Form-encoded body for Stripe Checkout Session creation API
    const bodyParams = new URLSearchParams();
    bodyParams.append('payment_method_types[0]', 'card');
    bodyParams.append('mode', 'payment');
    bodyParams.append('client_reference_id', params.orderId);
    bodyParams.append('customer_email', params.customerEmail);
    bodyParams.append('success_url', params.successUrl);
    bodyParams.append('cancel_url', params.cancelUrl);
    bodyParams.append('metadata[order_id]', params.orderId);
    bodyParams.append('metadata[order_number]', params.orderNumber);
    bodyParams.append('metadata[customer_id]', params.customerId);
    bodyParams.append('metadata[idempotency_key]', params.idempotencyKey);

    // Line items
    bodyParams.append('line_items[0][price_data][currency]', params.currency.toLowerCase());
    bodyParams.append('line_items[0][price_data][unit_amount]', params.amountMinor.toString());
    bodyParams.append('line_items[0][price_data][product_data][name]', `VERITAS Concierge: ${params.productName}`);
    bodyParams.append('line_items[0][price_data][product_data][description]', `Order #${params.orderNumber} Sourcing Authorization`);
    bodyParams.append('line_items[0][quantity]', '1');

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': params.idempotencyKey,
      },
      body: bodyParams.toString(),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'Failed to create Stripe Checkout session');
    }

    return {
      sessionId: data.id,
      paymentUrl: data.url,
      provider: 'stripe',
      clientSecret: data.client_secret,
    };
  }

  async verifyAndParseWebhook(rawBody: string, signatureHeader: string): Promise<WebhookEventPayload | null> {
    const webhookSecret = this.getWebhookSecret();
    if (!signatureHeader) {
      throw new Error('Missing Stripe-Signature header');
    }

    // Parse Stripe signature: t=...,v1=...,v0=...
    const sigMap: Record<string, string[]> = {};
    for (const item of signatureHeader.split(',')) {
      const [key, val] = item.split('=');
      if (key && val) {
        if (!sigMap[key.trim()]) sigMap[key.trim()] = [];
        sigMap[key.trim()].push(val.trim());
      }
    }

    const timestamp = sigMap['t']?.[0];
    const signatures = sigMap['v1'] || [];

    if (!timestamp || signatures.length === 0) {
      throw new Error('Invalid Stripe-Signature format');
    }

    // Verify timestamp within 5-minute tolerance to prevent replay attacks
    const toleranceSec = 300;
    const nowSec = Math.floor(Date.now() / 1000);
    const eventTimeSec = parseInt(timestamp, 10);
    if (Math.abs(nowSec - eventTimeSec) > toleranceSec) {
      throw new Error('Stripe-Signature timestamp outside tolerance window');
    }

    // Verify HMAC-SHA256 signature
    const signedPayload = `${timestamp}.${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    const signatureMatch = signatures.some((sig) => {
      try {
        return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSignature, 'hex'));
      } catch {
        return false;
      }
    });

    if (!signatureMatch) {
      throw new Error('Cryptographic signature verification failed');
    }

    const event = JSON.parse(rawBody);
    const eventType = event.type;
    const dataObj = event.data?.object || {};

    let orderId = dataObj.metadata?.order_id || dataObj.client_reference_id;
    let amountMinor = dataObj.amount_total || dataObj.amount || 0;
    let currency = (dataObj.currency || 'USD').toUpperCase();
    let providerTxnId = dataObj.payment_intent || dataObj.id;
    let idempotencyKey = dataObj.metadata?.idempotency_key;

    if (!orderId && dataObj.payment_intent && typeof dataObj.payment_intent === 'object') {
      orderId = dataObj.payment_intent.metadata?.order_id;
    }

    return {
      eventId: event.id,
      eventType,
      orderId: orderId || '',
      amountMinor,
      currency,
      providerTransactionId: providerTxnId,
      idempotencyKey,
      rawPayload: event,
    };
  }
}
