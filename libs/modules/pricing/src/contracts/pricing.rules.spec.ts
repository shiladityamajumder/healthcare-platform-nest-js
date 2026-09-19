import { PricingValidationError } from './pricing.errors';
import { validateDateWindow, validateProductPrice, validateRate } from './pricing.rules';

describe('pricing domain rules', () => {
  it('rejects a selling price above MRP', () => {
    expect(() => validateProductPrice('100.00', '101.00')).toThrow(PricingValidationError);
  });

  it('rejects rates outside the percentage range', () => {
    expect(() => validateRate('100.0001')).toThrow(PricingValidationError);
  });

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
