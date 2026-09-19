import { ConflictError, NotFoundError, ValidationError } from '@shared/errors';
export const PRODUCT_STATUSES = [
  'draft',
  'review',
  'active',
  'inactive',
  'discontinued',
  'recalled',
] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PRODUCT_TYPES = [
  'medicine',
  'otc',
  'device',
  'wellness',
  'lab_test',
  'service',
] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export class ProductNotFoundError extends NotFoundError {
  public override readonly code = 'PRODUCT_NOT_FOUND';
  public constructor(details?: unknown) {
    super('The product was not found.', details);
  }
}

export class CatalogConflictError extends ConflictError {
  public constructor(
    public override readonly code: string,
    message: string,
    details?: unknown,
  ) {
    super(message, details);
  }
}

export class CatalogValidationError extends ValidationError {
  public constructor(
    message: string,
    details?: unknown,
    public override readonly code = 'BUSINESS_VALIDATION_ERROR',
  ) {
    super(message, details);
  }
}

export const slugify = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 255);

export const normalizeName = (value: string): string =>
  value.trim().replace(/\s+/g, ' ').toLowerCase();

const TRANSITIONS: Record<ProductStatus, readonly ProductStatus[]> = {
  draft: ['review', 'active', 'inactive'],
  review: ['draft', 'active', 'inactive'],
  active: ['inactive', 'discontinued', 'recalled'],
  inactive: ['draft', 'review', 'active'],
  discontinued: ['inactive'],
  recalled: ['inactive'],
};

export function validateStatusTransition(current: ProductStatus, next: ProductStatus): void {
  if (current === next) return;
  if (!TRANSITIONS[current].includes(next)) {
    throw new CatalogConflictError(
      'INVALID_PRODUCT_STATUS_TRANSITION',
      `A product cannot move from ${current} to ${next}.`,
      { currentStatus: current, requestedStatus: next },
    );
  }
}
