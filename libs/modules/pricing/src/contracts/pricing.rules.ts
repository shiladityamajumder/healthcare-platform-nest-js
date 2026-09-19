import { PricingValidationError } from './pricing.errors';

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

export function validateRate(rate: string): void {
  const value = Number(rate);
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new PricingValidationError('rate must be between 0 and 100.');
  }
}

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
