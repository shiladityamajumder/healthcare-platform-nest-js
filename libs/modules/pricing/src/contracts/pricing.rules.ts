// * Pricing module: Defines reusable business rules for effective dates, rates, and prices.
// * File: src/contracts/pricing.rules.ts
// ? Keep pure pricing validation separate from transport DTOs and repository operations.
// ! These rules must remain deterministic and free from database side effects.
import { PricingValidationError } from './pricing.errors';

/** Validates an inclusive or exclusive effective-date window. */
export function validateDateWindow(
  from: Date,
  until: Date | null | undefined,
  inclusiveEnd: boolean,
): void {
  if (until && (inclusiveEnd ? until < from : until <= from)) {
    throw new PricingValidationError(
      inclusiveEnd
        ? 'validUntil cannot be before validFrom.'
        : 'validUntil must be after validFrom.',
    );
  }
}

/** Validates that a tax rate is a finite percentage between zero and one hundred. */
export function validateRate(rate: string): void {
  const value = Number(rate);
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new PricingValidationError('rate must be between 0 and 100.');
  }
}

/** Validates MRP, selling price, and optional cost-price relationships. */
export function validateProductPrice(
  mrpValue: string,
  sellingPriceValue: string,
  costPriceValue?: string,
): void {
  const mrp = Number(mrpValue);
  const sellingPrice = Number(sellingPriceValue);
  const costPrice = costPriceValue == null ? null : Number(costPriceValue);
  if (
    ![mrp, sellingPrice, ...(costPrice == null ? [] : [costPrice])].every(
      (value) => Number.isFinite(value) && value >= 0,
    )
  ) {
    throw new PricingValidationError('Prices must be non-negative numbers.');
  }
  if (sellingPrice > mrp) {
    throw new PricingValidationError('sellingPrice cannot exceed mrp.');
  }
}
