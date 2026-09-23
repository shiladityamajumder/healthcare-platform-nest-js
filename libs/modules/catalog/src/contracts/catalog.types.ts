// * Catalog module: Defines application response and aggregate result types.
// * File: src/contracts/catalog.types.ts
// ? Keep response shapes independent from database row and HTTP controller details.

/** Standard paginated result returned by catalog list use cases. */
export interface PageResult<T> {
  data: { items: T[] };
  pagination: {
    totalCount: number;
    limit: number;
    offset: number;
    hasNext: boolean;
  };
}

/** Flexible mapped record used for reference and association responses. */
export type CatalogRecord = Record<string, unknown>;

/** Complete product aggregate returned by product detail endpoints. */
export interface ProductDetails extends CatalogRecord {
  id: string;
  sku: string;
  status: string;
  rowVersion: number;
  variants: CatalogRecord[];
  identifiers: CatalogRecord[];
  salts: CatalogRecord[];
  attributes: CatalogRecord[];
  content: CatalogRecord[];
  media: CatalogRecord[];
  regulatory: CatalogRecord | null;
}
