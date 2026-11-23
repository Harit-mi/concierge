/**
 * VERITAS Platform Environment & Runtime Configuration
 * Validates required configuration at startup and forbids insecure fallbacks in production.
 */

export interface AppConfig {
  nodeEnv: 'development' | 'production' | 'test';
  isProduction: boolean;
  isTest: boolean;
  port: number;
  appUrl: string;
  jwtSecret: string;
  targetMarket: 'US' | 'IN';
  enableDemoSeed: boolean;
  databasePath: string;
  payment: {
    provider: 'stripe' | 'mock_test';
    stripeSecretKey?: string;
    stripeWebhookSecret?: string;
    stripePublishableKey?: string;
  };
}

let cachedConfig: AppConfig | null = null;

export function validateAndLoadConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
  const isProduction = nodeEnv === 'production';
  const isTest = nodeEnv === 'test';

  const jwtSecret = process.env.JWT_SECRET;
  if (isProduction) {
    if (!jwtSecret || jwtSecret.trim().length < 32) {
      throw new Error(
        'FATAL STARTUP ERROR: JWT_SECRET environment variable is missing or less than 32 characters in production.'
      );
    }
  }

  const effectiveJwtSecret =
    jwtSecret && jwtSecret.trim().length > 0
      ? jwtSecret.trim()
      : isProduction
      ? ''
      : 'veritas_dev_secret_only_for_local_testing_min32chars!';

  const targetMarket = (process.env.TARGET_MARKET || 'US').toUpperCase() as 'US' | 'IN';
  if (targetMarket !== 'US' && targetMarket !== 'IN') {
    throw new Error(`Invalid TARGET_MARKET: "${process.env.TARGET_MARKET}". Must be either US or IN.`);
  }

  const enableDemoSeed =
    process.env.ENABLE_DEMO_SEED !== undefined
      ? process.env.ENABLE_DEMO_SEED === 'true'
      : !isProduction;

  const paymentProvider = (process.env.PAYMENT_PROVIDER || (isProduction ? 'stripe' : 'mock_test')) as
    | 'stripe'
    | 'mock_test';

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (isProduction && paymentProvider === 'stripe') {
    if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
      throw new Error(
        'FATAL STARTUP ERROR: STRIPE_SECRET_KEY must be a valid Stripe secret key in production.'
      );
    }
    if (!stripeWebhookSecret || !stripeWebhookSecret.startsWith('whsec_')) {
      throw new Error(
        'FATAL STARTUP ERROR: STRIPE_WEBHOOK_SECRET must be configured for verified webhooks in production.'
      );
    }
  }

  cachedConfig = {
    nodeEnv,
    isProduction,
    isTest,
    port: parseInt(process.env.PORT || '3044', 10),
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3044',
    jwtSecret: effectiveJwtSecret,
    targetMarket,
    enableDemoSeed,
    databasePath: process.env.DATABASE_PATH || 'data/concierge.db',
    payment: {
      provider: paymentProvider,
      stripeSecretKey,
      stripeWebhookSecret,
      stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
  };

  return cachedConfig;
}

export function getConfig(): AppConfig {
  if (!cachedConfig) {
    return validateAndLoadConfig();
  }
  return cachedConfig;
}

// Reset cache for testing
export function _resetConfigForTesting(): void {
  cachedConfig = null;
}
