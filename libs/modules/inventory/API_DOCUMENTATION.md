# 📦 Inventory API Documentation

> **Module:** `libs/modules/inventory`  
> **API style:** REST/JSON  
> **Audience:** Web, Android, iOS, fulfilment, warehouse, and operations frontend developers  
> **Scope:** Warehouses, inventory lots, stock balances, reservations, holds, transfers, adjustments, cycle counts, ledger history, and replenishment rules.  
> **Database ownership:** The database schema is externally managed. This module uses the existing tables and fields; it does not run migrations.

This document describes every HTTP endpoint currently mounted by the inventory module, including when to use it, request data, actor requirements, success responses, lifecycle behavior, and error cases.

## 📚 Contents

- [🚀 Quick start](#-quick-start)
- [📐 API conventions](#-api-conventions)
- [🔐 Authorization and actor context](#-authorization-and-actor-context)
- [📦 Response format](#-response-format)
- [⚠️ Error handling](#️-error-handling)
- [🏭 Warehouse management](#-warehouse-management)
- [📦 Inventory and lot management](#-inventory-and-lot-management)
- [🧾 Stock adjustments and ledger](#-stock-adjustments-and-ledger)
- [🛒 Reservations and holds](#-reservations-and-holds)
- [🔁 Stock transfers](#-stock-transfers)
- [📍 Locations and relocation](#-locations-and-relocation)
- [🔢 Cycle counts](#-cycle-counts)
- [📊 Replenishment rules](#-replenishment-rules)
- [🧭 Recommended frontend flows](#-recommended-frontend-flows)

---

## 🚀 Quick start

### Base URL

The application uses the global `/api` prefix and URI version `v1`:

```text
{API_ORIGIN}/api/v1
```

Examples:

```http
GET  https://api.example.com/api/v1/product-inventory
POST https://api.example.com/api/v1/product-inventory/reservations
GET  https://api.example.com/api/v1/warehouses
```

### Minimal inventory read

```http
GET /api/v1/product-inventory?warehouseId=550e8400-e29b-41d4-a716-446655440000&inStock=true
X-Request-ID: inventory-screen-001
X-Correlation-ID: order-flow-2026-001
```

### Minimal stock-changing request

Write operations pass the acting user through `X-User-ID`:

```http
POST /api/v1/product-inventory/adjustments
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
```

```json
{
  "warehouseId": "550e8400-e29b-41d4-a716-446655440000",
  "binId": "550e8400-e29b-41d4-a716-446655440009",
  "lotId": "550e8400-e29b-41d4-a716-446655440001",
  "quantityDelta": "5.000",
  "reasonCode": "cycle_count",
  "notes": "Five units found during physical count.",
  "idempotencyKey": "cycle-count-adjustment-2026-001"
}
```

`X-User-ID` is an audit actor header, not a replacement for authentication or authorization middleware. For adjustments, transfer workflows, and cycle-count completion, it must contain a valid UUID.

---

## 📐 API conventions

### HTTP and data rules

| Rule | Description |
| --- | --- |
| Content type | Send JSON bodies with `Content-Type: application/json`. |
| IDs | Resource IDs are UUID values. Path UUIDs are validated by the API. |
| Quantities | Send numeric quantities as decimal strings, for example `"25.000"`. This avoids frontend floating-point loss. |
| Dates | Send ISO-8601 date or date-time strings, for example `2026-01-15` or `2026-01-15T10:00:00.000Z`. |
| Pagination | List queries use one-based `page` and `pageSize`; default is page `1`, size `20`. |
| Sorting | Inventory sorting supports `productName`, `expiresAt`, `availableQty`, and `updatedAt`; warehouse sorting supports `name`, `code`, and `createdAt`. |
| Unknown fields | Send only documented fields. The global validation configuration may reject unknown fields. |
| Schema ownership | Do not expect this repository to create or migrate tables. The API matches the existing database contract. |

### Common request headers

| Header | Required | Used for | Example |
| --- | --- | --- | --- |
| `Content-Type` | JSON body requests | Request body format | `application/json` |
| `X-User-ID` | Required for selected stock mutations; optional for other writes | Audit actor and mutation attribution | `550e8400-e29b-41d4-a716-446655440099` |
| `X-Request-ID` | Optional | Client-generated support/request ID | `inventory-screen-001` |
| `X-Correlation-ID` | Optional | Correlates related frontend operations | `fulfilment-flow-2026-001` |

The API currently documents `X-User-ID` rather than a direct bearer guard on these controllers. Application-level authentication/authorization should be applied by the platform before exposing mutation endpoints.

### Common response headers

Successful and error responses may include:

| Header | Meaning |
| --- | --- |
| `X-Request-ID` | Request identifier for logs and support. |
| `X-Correlation-ID` | Correlation identifier supplied or generated for the operation. |
| `X-API-Version` | API version that processed the request, normally `v1`. |

---

## 🔐 Authorization and actor context

### Read operations

The current inventory controllers do not directly enforce bearer authentication. Read endpoints are intended for authenticated frontend screens and trusted internal consumers after platform authorization has been applied.

### Write operations

Write endpoints accept `X-User-ID`:

- Warehouse create/update/deactivate/reactivate
- Lot create/update
- Adjustments
- Reservations and reservation lifecycle changes
- Holds and hold release
- Relocation
- Transfers, dispatch, and receipt
- Cycle-count creation, updates, line entry, and completion
- Replenishment-rule upsert

The service records the actor in available audit columns. A valid UUID is specifically required when the existing database contract requires a non-null user column, such as adjustment and transfer headers.

### Frontend rule

Do not treat a successful `X-User-ID` header as proof of permission. The backend authorization layer remains responsible for deciding whether the actor may operate on the selected organization, warehouse, product, lot, or order.

---

## 📦 Response format

All normal HTTP responses use the platform response envelope.

### Successful response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "error": null,
  "meta": {
    "requestId": "request-id",
    "correlationId": "inventory-screen-001",
    "apiVersion": "v1",
    "timestamp": "2026-09-24T10:00:00.000Z"
  }
}
```

Read the endpoint result inside `data`. Do not read endpoint fields from the response top level.

### Paginated response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {
    "items": [{ "id": "550e8400-e29b-41d4-a716-446655440001" }]
  },
  "pagination": {
    "totalCount": 125,
    "limit": 20,
    "offset": 0,
    "hasNext": true
  },
  "error": null,
  "meta": {
    "requestId": "request-id",
    "correlationId": "inventory-screen-001",
    "apiVersion": "v1",
    "timestamp": "2026-09-24T10:00:00.000Z"
  }
}
```

Some non-paginated list endpoints return an array directly inside `data`, such as product locations and the warehouse location hierarchy.

### Error response

```json
{
  "success": false,
  "message": "There is not enough available stock to reserve.",
  "data": null,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "details": null
  },
  "meta": {
    "requestId": "request-id",
    "correlationId": "order-flow-2026-001",
    "apiVersion": "v1",
    "timestamp": "2026-09-24T10:01:00.000Z"
  }
}
```

Use `error.code` for frontend decisions. Human-readable `message` text is not a stable programmatic identifier.

---

## ⚠️ Error handling

### Common HTTP statuses and codes

| HTTP status | Typical error codes | Frontend action |
| ---: | --- | --- |
| `400` | `VALIDATION_ERROR`, `INVENTORY_VALIDATION_ERROR` | Highlight invalid fields, quantities, UUIDs, dates, or missing row versions. Do not retry unchanged input. |
| `404` | `WAREHOUSE_NOT_FOUND`, `LOCATION_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `BIN_NOT_FOUND`, `LOT_NOT_FOUND`, `BALANCE_NOT_FOUND`, `RESERVATION_NOT_FOUND`, `HOLD_NOT_FOUND`, `ADJUSTMENT_NOT_FOUND`, `TRANSFER_NOT_FOUND`, `TRANSFER_ITEM_NOT_FOUND`, `CYCLE_COUNT_NOT_FOUND`, `CYCLE_COUNT_ITEM_NOT_FOUND` | Refresh the relevant resource list or show that the selected resource no longer exists. |
| `409` | `INSUFFICIENT_STOCK`, `CONCURRENT_UPDATE`, `RESERVATION_ALREADY_EXISTS`, `INVALID_RESERVATION_STATE`, `INVALID_HOLD_STATE`, `TRANSFER_ALREADY_EXISTS`, `INVALID_TRANSFER_STATE`, `CYCLE_COUNT_ALREADY_COMPLETED`, `INVALID_COUNT_VARIANCE` | Refresh current server state, show the conflict, and require the user to confirm/retry with current data. |
| `500` | `INTERNAL_SERVER_ERROR` | Show a generic failure state and retain `meta.requestId` for support. |
| `503` | `DATABASE_ERROR`, `INFRASTRUCTURE_ERROR`, `INFRASTRUCTURE_UNAVAILABLE` | Show temporary unavailability and retry with backoff when the operation is safe to repeat. |

### Stock-safety behavior

- Available quantity is calculated as `onHandQty - reservedQty - damagedQty - quarantinedQty`.
- Reservations reduce available quantity but do not immediately reduce on-hand quantity.
- Committing a reservation reduces both reserved and on-hand quantity.
- Holds increase quarantined quantity and therefore remove stock from availability.
- Relocation writes an outbound and inbound ledger movement without changing warehouse ownership.
- Transfer dispatch deducts source stock; transfer receipt adds destination stock.
- Cycle-count completion posts recorded variances as stock-ledger movements.
- Idempotency keys must be stable for retries. Do not generate a new key when retrying the same logical operation.

---

## 🏭 Warehouse management

### 1. List warehouses

```http
GET /api/v1/warehouses?page=1&pageSize=20&status=active&supportsColdChain=true
```

| Item | Value |
| --- | --- |
| Why use it | Populate warehouse selectors, fulfilment routing screens, and warehouse administration lists. |
| Authorization | Platform authorization recommended; no direct bearer guard in the current controller. |
| Request body | None. |
| Success | `200 OK`, paginated. |
| Errors | `400` invalid query; `503` database/infrastructure failure. |

Query fields:

| Field | Required | Rules |
| --- | ---: | --- |
| `search` | ❌ | Searches warehouse name and code; maximum 200 characters. |
| `status` | ❌ | Warehouse lifecycle status, for example `active`. |
| `warehouseType` | ❌ | Warehouse classification, for example `central` or `fulfilment`. |
| `supportsColdChain` | ❌ | Boolean filter. |
| `supportsControlledDrugs` | ❌ | Boolean filter. |
| `includeDeleted` | ❌ | Boolean; defaults to `false`. |
| `sortBy` | ❌ | `name`, `code`, or `createdAt`; defaults to `name`. |
| `sortOrder` | ❌ | `asc` or `desc`; defaults to `asc`. |
| `page` | ❌ | One-based integer; defaults to `1`. |
| `pageSize` | ❌ | Integer 1–100; defaults to `20`. |

### 2. Create a warehouse

```http
POST /api/v1/warehouses
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "organizationId": "550e8400-e29b-41d4-a716-446655440020",
  "locationId": "550e8400-e29b-41d4-a716-446655440021",
  "code": "WH-KOL-01",
  "name": "Kolkata Central Warehouse",
  "warehouseType": "central",
  "status": "active",
  "supportsColdChain": true,
  "supportsControlledDrugs": false,
  "operatingHours": { "monday": { "open": "09:00", "close": "18:00" } }
}
```

| Field | Required | Rules |
| --- | ---: | --- |
| `organizationId` | ✅ | Organization UUID. |
| `locationId` | ✅ | Existing `organization.locations` UUID. |
| `code` | ✅ | Non-empty string, maximum 64 characters; should be unique for the organization. |
| `name` | ✅ | Non-empty string, maximum 150 characters. |
| `warehouseType` | ✅ | Non-empty string, maximum 32 characters. |
| `status` | ❌ | String, maximum 32 characters; defaults to `active`. |
| `supportsColdChain` | ❌ | Boolean; defaults to `false`. |
| `supportsControlledDrugs` | ❌ | Boolean; defaults to `false`. |
| `operatingHours` | ❌ | JSON object/array; defaults to `{}`. |

**Success:** `201 Created`.  
**Errors:** `400` invalid input; `404 LOCATION_NOT_FOUND`; `409` database uniqueness/state conflict; `503` database unavailable.

### 3. Get a warehouse

```http
GET /api/v1/warehouses/{warehouseId}?includeDeleted=false
```

| Item | Value |
| --- | --- |
| Why use it | Load warehouse detail, capabilities, row version, and location context. |
| Path | `warehouseId` is a warehouse UUID. |
| Query | `includeDeleted` is optional and defaults to `false`. |
| Authorization | Platform authorization recommended; no direct bearer guard in the current controller. |
| Success | `200 OK`. |
| Errors | `400` malformed UUID; `404 WAREHOUSE_NOT_FOUND`; `503` dependency failure. |

### 4. Update a warehouse

```http
PATCH /api/v1/warehouses/{warehouseId}
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "name": "Kolkata Fulfilment Warehouse",
  "supportsColdChain": true,
  "rowVersion": 1
}
```

At least one mutable field is required, together with the current `rowVersion`.

| Field | Required | Rules |
| --- | ---: | --- |
| `name` | ❌ | Replacement name, maximum 150 characters. |
| `warehouseType` | ❌ | Replacement type, maximum 32 characters. |
| `status` | ❌ | Replacement status, maximum 32 characters. |
| `supportsColdChain` | ❌ | Boolean. |
| `supportsControlledDrugs` | ❌ | Boolean. |
| `operatingHours` | ❌ | Replacement JSON object/array. |
| `rowVersion` | ✅ | Current integer version from the last warehouse response. |

**Success:** `200 OK`.  
**Errors:** `400` invalid body or missing row version; `404 WAREHOUSE_NOT_FOUND`; `409 CONCURRENT_UPDATE` if another operator changed the warehouse.

### 5. Deactivate a warehouse

```http
DELETE /api/v1/warehouses/{warehouseId}
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
```

Use this for administrative deactivation. It is a soft delete and preserves history.

**Success:** `200 OK` with `{ "message": "The warehouse has been deactivated." }`.  
**Errors:** `400` malformed UUID; `404 WAREHOUSE_NOT_FOUND` if missing or already inactive; `503` dependency failure.

### 6. Reactivate a warehouse

```http
POST /api/v1/warehouses/{warehouseId}/reactivate
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
```

**Success:** `200 OK` with the restored warehouse.  
**Errors:** `400` malformed UUID; `404 WAREHOUSE_NOT_FOUND` when no deleted warehouse exists; `409` if current state prevents reactivation.

### 7. List warehouse bins

```http
GET /api/v1/warehouses/{warehouseId}/bins
```

Returns active bins with zone, aisle, rack, bin code, type, status, and pick sequence.

**Success:** `200 OK` with an array inside `data`.  
**Errors:** `400` malformed UUID; `404 WAREHOUSE_NOT_FOUND`; `503` dependency failure.

---

## 📦 Inventory and lot management

### 8. List inventory balances

```http
GET /api/v1/product-inventory?productId=550e8400-e29b-41d4-a716-446655440008&inStock=true&page=1&pageSize=20
```

| Item | Value |
| --- | --- |
| Why use it | Display available stock for catalogue, product detail, fulfilment, and operations screens. |
| Authorization | Platform authorization recommended; no direct bearer guard in the current controller. |
| Success | `200 OK`, paginated. |
| Errors | `400` invalid filter; `503` dependency failure. |

Query fields:

| Field | Rules |
| --- | --- |
| `productId`, `variantId`, `warehouseId` | Optional UUID filters. |
| `qualityStatus` | Optional string, maximum 16 characters. |
| `inStock` | `true` for available quantity greater than zero; `false` for zero/negative availability. |
| `lowStock` | Returns balances at or below the active replenishment minimum. |
| `expiringSoon` | Returns lots expiring within `expiryDays`. |
| `expired` | Returns lots whose expiry date has passed. |
| `expiryDays` | Integer 1–730; defaults to `90`. |
| `search` | Searches product name, SKU, or batch number; maximum 200 characters. |
| `sortBy` | `productName`, `expiresAt`, `availableQty`, or `updatedAt`. |
| `sortOrder` | `asc` or `desc`. |
| `page`, `pageSize` | One-based page and size 1–100. |

### 9. List inventory lots

```http
GET /api/v1/product-inventory/lots?warehouseId=550e8400-e29b-41d4-a716-446655440000&expiringSoon=true
```

Returns lot-level data, including lots with no balance row yet. Use this for receiving, expiry, recall, and quality screens.

**Success:** `200 OK`, paginated.  
**Errors:** `400` invalid filters; `503` dependency failure.

### 10. Create an inventory lot

```http
POST /api/v1/product-inventory/lots
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "warehouseId": "550e8400-e29b-41d4-a716-446655440000",
  "productId": "550e8400-e29b-41d4-a716-446655440008",
  "variantId": "550e8400-e29b-41d4-a716-446655440011",
  "binId": "550e8400-e29b-41d4-a716-446655440009",
  "batchNumber": "BATCH-2026-001",
  "manufacturedAt": "2026-01-15",
  "expiresAt": "2028-01-15",
  "purchaseCost": "42.50",
  "mrp": "59.99",
  "qualityStatus": "pending",
  "recallStatus": "clear",
  "initialQuantity": "100.000",
  "idempotencyKey": "goods-receipt-2026-001"
}
```

If `initialQuantity` is greater than zero, the API creates the stock balance and a `receipt` ledger movement in the same transaction. If it is zero, the lot still exists and can be listed for later receiving.

**Success:** `201 Created`.  
**Errors:** `400` invalid dates, UUIDs, prices, or quantity; `404 WAREHOUSE_NOT_FOUND`, `PRODUCT_NOT_FOUND`, or `BIN_NOT_FOUND`; `409` duplicate/database conflict; `503` dependency failure.

### 11. Get an inventory lot

```http
GET /api/v1/product-inventory/lots/{lotId}
```

Returns lot metadata, commercial values, quality/recall state, timestamps, and `rowVersion`.

**Success:** `200 OK`.  
**Errors:** `400` malformed UUID; `404 LOT_NOT_FOUND`; `503` dependency failure.

### 12. Update an inventory lot

```http
PATCH /api/v1/product-inventory/lots/{lotId}
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "qualityStatus": "approved",
  "recallStatus": "clear",
  "rowVersion": 1
}
```

Mutable fields are `purchaseCost`, `mrp`, `qualityStatus`, and `recallStatus`. `rowVersion` is required.

**Success:** `200 OK`.  
**Errors:** `400` invalid body or missing row version; `404 LOT_NOT_FOUND`; `409 CONCURRENT_UPDATE`; `503` dependency failure.

---

## 🧾 Stock adjustments and ledger

### 13. Post an inventory adjustment

```http
POST /api/v1/product-inventory/adjustments
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

`quantityDelta` is signed:

- Positive value adds on-hand stock.
- Negative value removes on-hand stock.
- Zero is rejected.
- The resulting on-hand quantity cannot become negative.

The `idempotencyKey` prevents the same logical adjustment from being posted twice.

**Success:** `201 Created`.  
**Errors:** `400 INVENTORY_VALIDATION_ERROR`; `404 WAREHOUSE_NOT_FOUND`, `BIN_NOT_FOUND`, or `LOT_NOT_FOUND`; `409 INSUFFICIENT_STOCK`; `503` dependency failure.

### 14. List inventory adjustments

```http
GET /api/v1/product-inventory/adjustments?warehouseId=550e8400-e29b-41d4-a716-446655440000&reasonCode=cycle_count
```

Supports `warehouseId`, `status`, `reasonCode`, `page`, and `pageSize` filters.

**Success:** `200 OK`, paginated.  
**Errors:** `400` invalid query; `503` dependency failure.

### 15. Get an inventory adjustment

```http
GET /api/v1/product-inventory/adjustments/{adjustmentId}
```

Returns the adjustment header and adjustment line items.

**Success:** `200 OK`.  
**Errors:** `400` malformed UUID; `404 ADJUSTMENT_NOT_FOUND`; `503` dependency failure.

### 16. List stock-ledger movements

```http
GET /api/v1/product-inventory/ledger?warehouseId=550e8400-e29b-41d4-a716-446655440000&movementType=receipt&page=1&pageSize=20
```

Available filters:

| Field | Description |
| --- | --- |
| `warehouseId`, `lotId`, `referenceId` | UUID filters. |
| `movementType` | For example `receipt`, `adjustment`, `reservation`, `transfer_out`, `transfer_in`, or `relocation_in`. |
| `referenceType` | For example `inventory_lot`, `stock_reservation`, `stock_transfer`, or `cycle_count`. |
| `from` | Include movements at or after this ISO date-time. |
| `until` | Include movements before this ISO date-time. |
| `page`, `pageSize` | Pagination controls. |

Ledger rows are audit history. Frontends should not edit or delete them.

**Success:** `200 OK`, paginated.  
**Errors:** `400` invalid filter; `503` dependency failure.

---

## 🛒 Reservations and holds

### 17. Reserve stock for an order

```http
POST /api/v1/product-inventory/reservations
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "reservationNumber": "RES-2026-0001",
  "orderId": "550e8400-e29b-41d4-a716-446655440030",
  "orderItemId": "550e8400-e29b-41d4-a716-446655440031",
  "warehouseId": "550e8400-e29b-41d4-a716-446655440000",
  "binId": "550e8400-e29b-41d4-a716-446655440009",
  "lotId": "550e8400-e29b-41d4-a716-446655440001",
  "quantity": "2.000",
  "expiresAt": "2026-09-24T12:00:00.000Z"
}
```

The API locks the balance, checks available quantity, increases `reservedQty`, creates the reservation, and writes a ledger movement in one transaction.

**Success:** `201 Created`.  
**Errors:** `400` invalid/expired request; `404` missing warehouse, bin, or lot; `409 INSUFFICIENT_STOCK` or `RESERVATION_ALREADY_EXISTS`; `503` dependency failure.

### 18. List reservations

```http
GET /api/v1/product-inventory/reservations?orderId=550e8400-e29b-41d4-a716-446655440030&status=active
```

Supports `warehouseId`, `orderId`, `orderItemId`, `lotId`, `status`, `page`, and `pageSize`.

**Success:** `200 OK`, paginated.  
**Errors:** `400` invalid query; `503` dependency failure.

### 19. Get a reservation

```http
GET /api/v1/product-inventory/reservations/{reservationId}
```

**Success:** `200 OK`.  
**Errors:** `400` malformed UUID; `404 RESERVATION_NOT_FOUND`; `503` dependency failure.

### 20. Expire reservations

```http
POST /api/v1/product-inventory/reservations/expire
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{ "limit": 100 }
```

Use this from a scheduler or controlled operations job. It finds active reservations with `expiresAt <= now`, releases their reserved quantities, updates their status to `expired`, and writes release movements.

**Success:** `200 OK` with the processed reservation items and pagination metadata.  
**Errors:** `400` invalid limit; `503` dependency failure.

### 21. Release a reservation

```http
POST /api/v1/product-inventory/reservations/{reservationId}/release
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
```

Use when an order is cancelled or no longer needs its stock. It restores reserved quantity to availability but does not reduce on-hand quantity.

**Success:** `200 OK`.  
**Errors:** `400` malformed UUID; `404 RESERVATION_NOT_FOUND`; `409 INVALID_RESERVATION_STATE`; `503` dependency failure.

### 22. Commit a reservation

```http
POST /api/v1/product-inventory/reservations/{reservationId}/commit
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
```

Use when the order is committed to fulfilment or consumption. It decreases both reserved and on-hand quantity.

**Success:** `200 OK`.  
**Errors:** `400` malformed UUID; `404 RESERVATION_NOT_FOUND`; `409 INVALID_RESERVATION_STATE` or `INSUFFICIENT_STOCK`; `503` dependency failure.

### 23. Place an inventory hold

```http
POST /api/v1/product-inventory/holds
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "warehouseId": "550e8400-e29b-41d4-a716-446655440000",
  "binId": "550e8400-e29b-41d4-a716-446655440009",
  "lotId": "550e8400-e29b-41d4-a716-446655440001",
  "quantity": "1.000",
  "reasonCode": "quality_review"
}
```

The quantity moves into `quarantinedQty`, making it unavailable for allocation.

**Success:** `201 Created`.  
**Errors:** `400` invalid quantity or UUID; `404` missing warehouse, bin, or lot; `409 INSUFFICIENT_STOCK`; `503` dependency failure.

### 24. List holds

```http
GET /api/v1/product-inventory/holds?warehouseId=550e8400-e29b-41d4-a716-446655440000&status=active
```

Supports `warehouseId`, `lotId`, `status`, `page`, and `pageSize`.

**Success:** `200 OK`, paginated.  
**Errors:** `400` invalid query; `503` dependency failure.

### 25. Get a hold

```http
GET /api/v1/product-inventory/holds/{holdId}
```

**Success:** `200 OK`.  
**Errors:** `400` malformed UUID; `404 HOLD_NOT_FOUND`; `503` dependency failure.

### 26. Release a hold

```http
POST /api/v1/product-inventory/holds/{holdId}/release
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
```

Releases an active hold and decreases `quarantinedQty`.

**Success:** `200 OK`.  
**Errors:** `400` malformed UUID; `404 HOLD_NOT_FOUND`; `409 INVALID_HOLD_STATE`; `503` dependency failure.

---

## 🔁 Stock transfers

### 27. Create a stock transfer

```http
POST /api/v1/stock-transfers
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "transferNumber": "TRF-2026-0001",
  "sourceWarehouseId": "550e8400-e29b-41d4-a716-446655440000",
  "destinationWarehouseId": "550e8400-e29b-41d4-a716-446655440040",
  "items": [
    {
      "lotId": "550e8400-e29b-41d4-a716-446655440001",
      "requestedQuantity": "25.000"
    }
  ]
}
```

Rules:

- Source and destination warehouses must be different.
- `items` must contain 1–500 unique lot IDs.
- Each requested quantity must be greater than zero.
- The lot must belong to the source warehouse.
- The transfer starts in `requested` state; source stock is not deducted yet.

**Success:** `201 Created`.  
**Errors:** `400` invalid input; `404` missing warehouse or lot; `409 TRANSFER_ALREADY_EXISTS`; `503` dependency failure.

### 28. List stock transfers

```http
GET /api/v1/stock-transfers?sourceWarehouseId=550e8400-e29b-41d4-a716-446655440000&status=dispatched
```

Supports `sourceWarehouseId`, `destinationWarehouseId`, `status`, `page`, and `pageSize`.

**Success:** `200 OK`, paginated.  
**Errors:** `400` invalid query; `503` dependency failure.

### 29. Get a stock transfer

```http
GET /api/v1/stock-transfers/{transferId}
```

Returns the transfer header and items with `requestedQty`, `dispatchedQty`, and `receivedQty`.

**Success:** `200 OK`.  
**Errors:** `400` malformed UUID; `404 TRANSFER_NOT_FOUND`; `503` dependency failure.

### 30. Dispatch a stock transfer

```http
POST /api/v1/stock-transfers/{transferId}/dispatch
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
```

Dispatch allocates available source-bin quantities for each lot, decreases source on-hand quantities, creates `transfer_out` ledger entries, updates dispatched quantities, and changes the transfer to `dispatched`.

**Success:** `200 OK`.  
**Errors:** `400` malformed UUID; `404 TRANSFER_NOT_FOUND`; `409 INSUFFICIENT_STOCK` or `INVALID_TRANSFER_STATE`; `503` dependency failure.

### 31. Receive a stock transfer

```http
POST /api/v1/stock-transfers/{transferId}/receive
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "items": [
    {
      "transferItemId": "550e8400-e29b-41d4-a716-446655440041",
      "destinationBinId": "550e8400-e29b-41d4-a716-446655440042",
      "receivedQuantity": "25.000"
    }
  ],
  "idempotencyKey": "transfer-receive-2026-0001"
}
```

The API validates that received quantity does not exceed dispatched quantity. The transfer remains `in_transit` until all lines are fully received, then becomes `received`.

**Success:** `200 OK`.  
**Errors:** `400` invalid body or received quantity; `404 TRANSFER_NOT_FOUND`, `TRANSFER_ITEM_NOT_FOUND`, or `BIN_NOT_FOUND`; `409 INVALID_TRANSFER_STATE`; `503` dependency failure.

---

## 📍 Locations and relocation

### 32. List warehouse location hierarchy

```http
GET /api/v1/product-locations?warehouseId=550e8400-e29b-41d4-a716-446655440000
```

Returns active warehouse bins with zone, aisle, rack, warehouse code, and hierarchy labels. Use this to populate receiving, picking, and relocation selectors.

**Success:** `200 OK` with an array inside `data`.  
**Errors:** `400` invalid query; `503` dependency failure.

### 33. Relocate stock between bins

```http
POST /api/v1/product-locations/relocate
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "warehouseId": "550e8400-e29b-41d4-a716-446655440000",
  "lotId": "550e8400-e29b-41d4-a716-446655440001",
  "sourceBinId": "550e8400-e29b-41d4-a716-446655440009",
  "destinationBinId": "550e8400-e29b-41d4-a716-446655440042",
  "quantity": "10.000",
  "referenceId": "550e8400-e29b-41d4-a716-446655440043",
  "idempotencyKey": "bin-relocation-2026-0001"
}
```

Source and destination bins must be different and belong to the same warehouse. Only available quantity can be relocated. The operation writes `relocation_out` and `relocation_in` ledger movements.

**Success:** `200 OK`.  
**Errors:** `400` invalid body or same source/destination; `404` missing warehouse, bin, or lot; `409 INSUFFICIENT_STOCK`; `503` dependency failure.

### 34. List product locations

```http
GET /api/v1/products/{productId}/inventory?warehouseId=550e8400-e29b-41d4-a716-446655440000
```

Returns product stock grouped by warehouse, bin, and lot. `warehouseId` is optional.

**Success:** `200 OK` with an array inside `data`.  
**Errors:** `400` malformed UUID or query; `503` dependency failure.

### 35. List product warehouse availability

```http
GET /api/v1/products/{productId}/warehouses
```

Returns aggregated on-hand, reserved, and available quantities by warehouse for fulfilment routing.

**Success:** `200 OK` with an array inside `data`.  
**Errors:** `400` malformed product UUID; `503` dependency failure.

### 36. List warehouse inventory

```http
GET /api/v1/warehouses/{warehouseId}/inventory?inStock=true&page=1&pageSize=20
```

Uses the same filters as [List inventory balances](#8-list-inventory-balances), while forcing the selected warehouse.

**Success:** `200 OK`, paginated.  
**Errors:** `400` invalid path/query; `503` dependency failure.

### 37. List products stocked in a warehouse

```http
GET /api/v1/warehouses/{warehouseId}/products?search=paracetamol&page=1&pageSize=20
```

Returns product-level aggregates rather than one row per bin/lot.

**Success:** `200 OK`, paginated.  
**Errors:** `400` invalid path/query; `503` dependency failure.

---

## 🔢 Cycle counts

### 38. Create a cycle count

```http
POST /api/v1/cycle-counts
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "warehouseId": "550e8400-e29b-41d4-a716-446655440000",
  "binId": "550e8400-e29b-41d4-a716-446655440009",
  "scheduledAt": "2026-09-25T08:00:00.000Z",
  "assignedToUserId": "550e8400-e29b-41d4-a716-446655440099",
  "countMode": "full"
}
```

`binId` is optional. Without it, the session represents a warehouse-wide count.

**Success:** `201 Created`.  
**Errors:** `400` invalid input; `404 WAREHOUSE_NOT_FOUND` or `BIN_NOT_FOUND`; `503` dependency failure.

### 39. List cycle counts

```http
GET /api/v1/cycle-counts?warehouseId=550e8400-e29b-41d4-a716-446655440000&status=scheduled
```

Supports `warehouseId`, `status`, `assignedToUserId`, `page`, and `pageSize`.

**Success:** `200 OK`, paginated.  
**Errors:** `400` invalid query; `503` dependency failure.

### 40. Get a cycle count

```http
GET /api/v1/cycle-counts/{cycleCountId}
```

Returns the count session and all count lines.

**Success:** `200 OK`.  
**Errors:** `400` malformed UUID; `404 CYCLE_COUNT_NOT_FOUND`; `503` dependency failure.

### 41. Update a cycle count

```http
PATCH /api/v1/cycle-counts/{cycleCountId}
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "status": "completed",
  "completedAt": "2026-09-25T11:30:00.000Z",
  "rowVersion": 1
}
```

Mutable fields are `status`, `startedAt`, and `completedAt`; `rowVersion` is required. When `status` becomes `completed`, non-zero recorded variances are posted to balances and the stock ledger in the same transaction.

**Success:** `200 OK`.  
**Errors:** `400` invalid state/body or missing row version; `404 CYCLE_COUNT_NOT_FOUND`; `409 CONCURRENT_UPDATE`, `CYCLE_COUNT_ALREADY_COMPLETED`, or `INVALID_COUNT_VARIANCE`; `503` dependency failure.

### 42. Add a cycle-count line

```http
POST /api/v1/cycle-counts/{cycleCountId}/items
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "cycleCountId": "550e8400-e29b-41d4-a716-446655440006",
  "binId": "550e8400-e29b-41d4-a716-446655440009",
  "lotId": "550e8400-e29b-41d4-a716-446655440001",
  "reasonCode": "manual_review"
}
```

The API snapshots current system quantity into `systemQty`. The frontend should then ask the operator to enter the physical quantity.

**Success:** `201 Created`.  
**Errors:** `400` invalid input; `404 CYCLE_COUNT_NOT_FOUND`, `BIN_NOT_FOUND`, or `LOT_NOT_FOUND`; `503` dependency failure.

### 43. Record a cycle-count result

```http
PATCH /api/v1/cycle-counts/{cycleCountId}/items/{itemId}
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "cycleCountId": "550e8400-e29b-41d4-a716-446655440006",
  "itemId": "550e8400-e29b-41d4-a716-446655440007",
  "countedQty": "98.000",
  "reasonCode": "damaged_stock"
}
```

The API calculates `varianceQty = countedQty - systemQty`. The variance is not posted to stock until the parent cycle count is completed.

**Success:** `200 OK`.  
**Errors:** `400` invalid quantity; `404 CYCLE_COUNT_ITEM_NOT_FOUND`; `503` dependency failure.

---

## 📊 Replenishment rules

### 44. Create or update a replenishment rule

```http
POST /api/v1/replenishment-rules/upsert
X-User-ID: 550e8400-e29b-41d4-a716-446655440099
Content-Type: application/json
```

```json
{
  "warehouseId": "550e8400-e29b-41d4-a716-446655440000",
  "productId": "550e8400-e29b-41d4-a716-446655440008",
  "variantId": "550e8400-e29b-41d4-a716-446655440011",
  "minimumQuantity": "20.000",
  "maximumQuantity": "100.000",
  "reorderQuantity": "50.000",
  "preferredSupplierId": "550e8400-e29b-41d4-a716-446655440050",
  "isActive": true
}
```

Rules:

- `minimumQuantity >= 0`.
- `maximumQuantity >= minimumQuantity`.
- `reorderQuantity > 0`.
- The warehouse, product, and optional variant must exist.

**Success:** `200 OK`.  
**Errors:** `400` invalid quantities or UUIDs; `404 WAREHOUSE_NOT_FOUND` or `PRODUCT_NOT_FOUND`; `503` dependency failure.

### 45. List replenishment rules

```http
GET /api/v1/replenishment-rules?warehouseId=550e8400-e29b-41d4-a716-446655440000&page=1&pageSize=20
```

`warehouseId` is required by the application workflow even though the shared query DTO marks it optional at transport level. Always provide it.

**Success:** `200 OK`, paginated.  
**Errors:** `400` invalid query; `404 WAREHOUSE_NOT_FOUND`; `503` dependency failure.

---

## 🧭 Recommended frontend flows

### Product availability and checkout

1. Call `GET /products/{productId}/warehouses` or `GET /product-inventory` to show availability.
2. Select a fulfilment warehouse and lot according to the backend’s allocation rules.
3. Call `POST /product-inventory/reservations` with a stable reservation number and expiry.
4. On payment/order commitment, call the reservation commit endpoint through the order workflow.
5. On cancellation, call the reservation release endpoint.
6. Run reservation expiry from a backend scheduler, not from a customer device.

### Receiving stock

1. Create the lot with `POST /product-inventory/lots`.
2. Use a positive `initialQuantity` when the receipt is being posted immediately.
3. Reuse the same `idempotencyKey` when retrying a failed network request.
4. Update `qualityStatus` after inspection using the lot update endpoint.

### Warehouse relocation

1. Load valid bins with `GET /product-locations` or `GET /warehouses/{warehouseId}/bins`.
2. Confirm source and destination are in the same warehouse.
3. Call `POST /product-locations/relocate` with a stable idempotency key.
4. Refresh product locations and ledger history after success.

### Inter-warehouse transfer

1. Create a transfer in `requested` state.
2. Dispatch only after the source operator confirms stock.
3. Receive the physical quantity into destination bins.
4. Display `in_transit` until all requested dispatched quantities are received.
5. Retry receive with the same idempotency key when a response is lost.

### Cycle count

1. Create a count session.
2. Add bin/lot lines; the API captures `systemQty`.
3. Record each physical count and show `varianceQty` to the operator.
4. Complete the session with the current `rowVersion`.
5. Refresh balances and ledger after completion because variances are posted atomically.

### Concurrency and retry guidance

- Always use the latest `rowVersion` for warehouse, lot, and cycle-count updates.
- On `CONCURRENT_UPDATE`, reload the resource and ask the user to review the new values.
- On `INSUFFICIENT_STOCK`, reload inventory; do not blindly retry.
- On a network timeout for an idempotent operation, retry with the same idempotency key.
- Keep `meta.requestId` in frontend logs and support reports.

