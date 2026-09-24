// * Pricing module: Verifies pure business rules for pricing values and effective dates.
// * File: src/contracts/pricing.rules.spec.ts
// ? Keep these tests focused on deterministic pricing validation behavior.
import { PricingValidationError } from './pricing.errors';
import { validateDateWindow, validateProductPrice, validateRate } from './pricing.rules';

/** Covers the pricing rule contract without requiring a database or Nest application. */
describe('pricing domain rules', () => {
  // * Test [selling price]: Rejects prices that exceed the declared MRP.
  it('rejects a selling price above MRP', () => {
    expect(() => validateProductPrice('100.00', '101.00')).toThrow(PricingValidationError);
  });

  // * Test [tax rate]: Rejects rates outside the supported percentage range.
  it('rejects rates outside the percentage range', () => {
    expect(() => validateRate('100.0001')).toThrow(PricingValidationError);
  });

  // * Test [date window]: Rejects an inverted effective-date range.
  it('rejects an inverted effective-date window', () => {
    expect(() =>
      validateDateWindow(
        new Date('2026-02-01T00:00:00.000Z'),
        new Date('2026-01-01T00:00:00.000Z'),
        false,
      ),
    ).toThrow(PricingValidationError);
  });
});
