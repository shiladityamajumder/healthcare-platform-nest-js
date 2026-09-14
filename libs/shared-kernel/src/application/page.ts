// * Shared kernel: Defines framework-neutral pagination request and result contracts.
// * File: src/application/page.ts
// ? Keep this primitive stable, domain-neutral, and independent of platform or business modules.
// ! Pagination stays transport-agnostic so modules can reuse it across APIs and handlers.
// * Contract [PageRequest]: Defines a stable shared-kernel data shape.
export interface PageRequest {
  page: number;
  pageSize: number;
}
// * Contract [PageResult]: Carries paginated items together with the page metadata.
export interface PageResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
}
