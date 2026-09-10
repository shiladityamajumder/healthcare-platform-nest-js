// Linked with: ./suppliers, ./supplier_licenses, ./purchase_requisitions.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the procurement PostgreSQL schema. */
// Describe the database row shape consumed by repositories and transaction code.
export type { ProcurementSuppliersRow } from './suppliers';
export type { ProcurementSupplierLicensesRow } from './supplier_licenses';
export type { ProcurementPurchaseRequisitionsRow } from './purchase_requisitions';
export type { ProcurementPurchaseReturnsRow } from './purchase_returns';
export type { ProcurementPurchaseOrdersRow } from './purchase_orders';
export type { ProcurementSupplierProductsRow } from './supplier_products';
export type { ProcurementPurchaseRequisitionItemsRow } from './purchase_requisition_items';
export type { ProcurementSupplierInvoicesRow } from './supplier_invoices';
export type { ProcurementPurchaseOrderItemsRow } from './purchase_order_items';
export type { ProcurementGoodsReceiptsRow } from './goods_receipts';
export type { ProcurementGoodsReceiptItemsRow } from './goods_receipt_items';
export type { ProcurementGoodsReceiptQualityChecksRow } from './goods_receipt_quality_checks';
export type { ProcurementPurchaseReturnItemsRow } from './purchase_return_items';
