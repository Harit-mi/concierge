import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import { signToken, verifyToken } from '../src/lib/auth';
import { validateAndLoadConfig, _resetConfigForTesting } from '../src/lib/config';

describe('Authentication & Configuration Hardening', () => {
  beforeEach(() => {
    _resetConfigForTesting();
    delete process.env.JWT_SECRET;
    delete (process.env as any).NODE_ENV;
    delete process.env.PAYMENT_PROVIDER;
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  it('signs and verifies a valid session token', () => {
    (process.env as any).NODE_ENV = 'development';
    process.env.JWT_SECRET = 'a_very_secure_secret_with_more_than_32_characters_for_testing';
    _resetConfigForTesting();

    const payload = {
      userId: 'usr-cust-test',
      email: 'alex@veritas.private',
      role: 'CUSTOMER' as const,
      name: 'Alexander Hayes',
    };

    const token = signToken(payload);
    assert.ok(typeof token === 'string' && token.length > 20);

    const decoded = verifyToken(token);
    assert.ok(decoded);
    assert.strictEqual(decoded.userId, payload.userId);
    assert.strictEqual(decoded.email, payload.email);
    assert.strictEqual(decoded.role, payload.role);
  });

  it('rejects an expired token', () => {
    (process.env as any).NODE_ENV = 'development';
    process.env.JWT_SECRET = 'a_very_secure_secret_with_more_than_32_characters_for_testing';
    _resetConfigForTesting();

    // Sign a token that expired 1 hour ago
    const expiredToken = jwt.sign(
      { userId: 'usr-test', email: 'test@example.com', role: 'CUSTOMER', name: 'Test' },
      'a_very_secure_secret_with_more_than_32_characters_for_testing',
      { expiresIn: '-1h' }
    );

    const verified = verifyToken(expiredToken);
    assert.strictEqual(verified, null, 'Expired token should fail verification');
  });

  it('rejects a tampered token with invalid signature', () => {
    (process.env as any).NODE_ENV = 'development';
    process.env.JWT_SECRET = 'a_very_secure_secret_with_more_than_32_characters_for_testing';
    _resetConfigForTesting();

    // Sign with a malicious secret
    const attackerToken = jwt.sign(
      { userId: 'usr-admin-1', email: 'admin@example.com', role: 'ADMIN', name: 'Attacker' },
      'wrong_unauthorized_attacker_secret_key'
    );

    const verified = verifyToken(attackerToken);
    assert.strictEqual(verified, null, 'Token signed with wrong key should fail verification');
  });

  it('fails startup in production when JWT_SECRET is missing', () => {
    (process.env as any).NODE_ENV = 'production';
    delete process.env.JWT_SECRET;
    _resetConfigForTesting();

    assert.throws(
      () => {
        validateAndLoadConfig();
      },
      (err: any) => {
        return (
          err instanceof Error &&
          err.message.includes('FATAL STARTUP ERROR: JWT_SECRET environment variable is missing')
        );
      }
    );
  });

  it('fails startup in production when JWT_SECRET is too short (< 32 chars)', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.JWT_SECRET = 'short_insecure_secret';
    _resetConfigForTesting();

    assert.throws(
      () => {
        validateAndLoadConfig();
      },
      (err: any) => {
        return (
          err instanceof Error &&
          err.message.includes('less than 32 characters in production')
        );
      }
    );
  });

  it('fails startup in production when Stripe credentials are not configured', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.JWT_SECRET = 'production_super_secure_random_key_with_at_least_32_chars_12345';
    process.env.PAYMENT_PROVIDER = 'stripe';
    delete process.env.STRIPE_SECRET_KEY;
    _resetConfigForTesting();

    assert.throws(
      () => {
        validateAndLoadConfig();
      },
      (err: any) => {
        return (
          err instanceof Error &&
          err.message.includes('STRIPE_SECRET_KEY must be a valid Stripe secret key')
        );
      }
    );
  });

  it('succeeds in production when all security configuration is valid', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.JWT_SECRET = 'production_super_secure_random_key_with_at_least_32_chars_12345';
    process.env.PAYMENT_PROVIDER = 'stripe';
    process.env.STRIPE_SECRET_KEY = 'sk_live_test_valid_key_1234567890';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_valid_secret_1234567890';
    _resetConfigForTesting();

    const config = validateAndLoadConfig();
    assert.strictEqual(config.isProduction, true);
    assert.strictEqual(config.enableDemoSeed, false, 'Demo seed must be disabled by default in production');
    assert.strictEqual(config.targetMarket, 'US');
  });
});
