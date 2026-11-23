import crypto from 'crypto';
import { PaymentProvider, CreatePaymentSessionParams, PaymentSessionResult, WebhookEventPayload } from './types';

export class MockPaymentProvider implements PaymentProvider {
  name = 'mock_test';
  private testSecret = 'mock_whsec_test_secret_for_local_testing_key_12345';

  getMockWebhookSecret(): string {
    return this.testSecret;
  }

  generateMockSignature(rawBody: string, timestamp?: number): string {
    const ts = timestamp || Math.floor(Date.now() / 1000);
    const signedPayload = `${ts}.${rawBody}`;
    const sig = crypto.createHmac('sha256', this.testSecret).update(signedPayload, 'utf8').digest('hex');
    return `t=${ts},v1=${sig}`;
  }

  async createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    const sessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      sessionId,
      paymentUrl: `/portal/orders/${params.orderId}/pay?session_id=${sessionId}`,
      provider: 'mock_test',
      clientSecret: `cs_secret_${Date.now()}`,
    };
  }

  async verifyAndParseWebhook(rawBody: string, signatureHeader: string): Promise<WebhookEventPayload | null> {
    if (!signatureHeader) {
      throw new Error('Missing mock signature header');
    }

    const sigMap: Record<string, string> = {};
    for (const item of signatureHeader.split(',')) {
      const [key, val] = item.split('=');
      if (key && val) sigMap[key.trim()] = val.trim();
    }

    const timestamp = sigMap['t'];
    const signature = sigMap['v1'];

    if (!timestamp || !signature) {
      throw new Error('Invalid signature format');
    }

    const expectedSig = crypto
      .createHmac('sha256', this.testSecret)
      .update(`${timestamp}.${rawBody}`, 'utf8')
      .digest('hex');

    if (expectedSig !== signature) {
      throw new Error('Cryptographic signature verification failed');
    }

    const event = JSON.parse(rawBody);
    const dataObj = event.data?.object || {};

    return {
      eventId: event.id,
      eventType: event.type,
      orderId: dataObj.metadata?.order_id || dataObj.client_reference_id || '',
      amountMinor: dataObj.amount_total || dataObj.amount || 0,
      currency: (dataObj.currency || 'USD').toUpperCase(),
      providerTransactionId: dataObj.payment_intent || dataObj.id || `pi_${Date.now()}`,
      idempotencyKey: dataObj.metadata?.idempotency_key,
      rawPayload: event,
    };
  }
}
