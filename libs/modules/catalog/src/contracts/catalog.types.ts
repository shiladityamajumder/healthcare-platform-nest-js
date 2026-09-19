export interface PageResult<T> {
  data: { items: T[] };
  pagination: {
    totalCount: number;
    limit: number;
    offset: number;
    hasNext: boolean;
  };
}

export type CatalogRecord = Record<string, unknown>;

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
