import { PaymentProvider } from './types';
import { StripePaymentProvider } from './stripe';
import { MockPaymentProvider } from './mock';
import { getConfig } from '../config';

let activeProvider: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (activeProvider) {
    return activeProvider;
  }

  const config = getConfig();
  if (config.payment.provider === 'stripe') {
    activeProvider = new StripePaymentProvider();
  } else {
    activeProvider = new MockPaymentProvider();
  }

  return activeProvider;
}

export function setPaymentProviderForTesting(provider: PaymentProvider | null): void {
  activeProvider = provider;
}

export * from './types';
export * from './stripe';
export * from './mock';
