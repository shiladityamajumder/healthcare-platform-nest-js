# 💰 Pricing API Documentation

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="72" alt="NestJS logo" />
</p>

<p align="center">
  <img src="../../../assets/readme/healthcare-platform-banner.png" alt="Abstract healthcare platform backend architecture banner" width="100%" />
</p>

> **Module:** `libs/modules/pricing`  
> **API style:** REST/JSON  
> **Audience:** Web, Android, iOS, admin, checkout, and operations frontend developers  
> **Scope:** Price books, product prices, tax rules, promotions, coupon codes, promotion redemptions, and pricing-evaluation audit records.  
> **Database rule:** This module uses the existing pricing tables and does not own migrations or database schema changes.

This document describes every HTTP endpoint currently exposed by the pricing module, including when to use it, authorization behavior, request data, successful responses, pagination, lifecycle rules, and expected error cases.

## 📚 Contents

- [✅ Contract status](#contract-status)
- [🚀 Quick start](#-quick-start)
- [📐 API conventions](#-api-conventions)
- [🔐 Authorization and audit context](#-authorization-and-audit-context)
- [📦 Response format](#-response-format)
- [⚠️ Error handling](#️-error-handling)
- [📚 Pricing concepts and lifecycle](#-pricing-concepts-and-lifecycle)
- [📒 Price books](#-price-books)
- [🏷️ Product prices](#️-product-prices)
- [🧾 Tax rules](#-tax-rules)
- [🎁 Promotions](#-promotions)
- [🎟️ Coupon codes](#️-coupon-codes)
- [🧮 Promotion redemptions](#-promotion-redemptions)
- [🔍 Pricing evaluations](#-pricing-evaluations)
- [🧭 Recommended frontend flows](#-recommended-frontend-flows)
- [🛡️ Frontend safety checklist](#️-frontend-safety-checklist)

---

<a id="contract-status"></a>

## ✅ Contract status

| Contract item | Source-aligned state |
| --- | --- |
| Runtime mount | `PricingModule` is imported by [`AppModule`](../../../apps/api/src/app.module.ts). |
| API address | URI version `v1`; every route resolves below `/api/v1`. |
| Route audit | **37 documented / 37 registered controller operations**. |
| Runtime specification | Swagger is generated at `/api/docs`; controller decorators are the code source of truth. |
| Authorization model | Pricing controllers do not apply a bearer guard; surrounding application authorization remains required for operational routes. |

### 🗺️ Route coverage

| Surface | Registered controller | Operations |
| --- | --- | ---: |
| Price books | `PriceBooksController` | 6 |
| Product prices | `ProductPricesController` | 3 |
| Tax rules | `TaxRulesController` | 6 |
| Promotions and versions | `PromotionsController` | 10 |
| Coupon codes | `CouponCodesController` | 6 |
| Promotion redemptions | `PromotionRedemptionsController` | 3 |
| Pricing evaluations | `PricingEvaluationsController` | 3 |
| **Total** | **7 controllers** | **37** |

---

## 🚀 Quick start

### Base URL

The application uses the global `/api` prefix and URI version `v1`:

```text
{API_ORIGIN}/api/v1
```

Examples:

```http
GET  https://api.example.com/api/v1/price-books
GET  https://api.example.com/api/v1/product-prices?productId=550e8400-e29b-41d4-a716-446655440002
POST https://api.example.com/api/v1/promotions
```

### Minimal product-price lookup

```http
GET /api/v1/product-prices?productId=550e8400-e29b-41d4-a716-446655440002&activeAt=2026-06-01T00:00:00.000Z
X-Request-ID: checkout-pricing-001
X-Correlation-ID: checkout-10001
```

The successful result is inside `data`. For list endpoints, pagination is inside `meta.pagination`:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "productId": "550e8400-e29b-41d4-a716-446655440002",
      "sellingPrice": "449.00",
      "currency": "INR",
      "rowVersion": 1
    }
  ],
  "error": null,
  "meta": {
    "requestId": "checkout-pricing-001",
    "correlationId": "checkout-10001",
    "apiVersion": "v1",
    "timestamp": "2026-06-01T00:00:00.000Z",
    "pagination": {
      "totalCount": 1,
      "limit": 20,
      "offset": 0,
      "hasNext": false
    }
  }
}
```

---

## 📐 API conventions

### HTTP and content rules

| Rule               | Description                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Content type       | Send JSON request bodies with `Content-Type: application/json`.                                                      |
| IDs                | Resource IDs are UUID values. Path and UUID body fields are validated by the API.                                    |
| Date-time          | Use ISO-8601 UTC date-time strings, for example `2026-01-01T00:00:00.000Z`.                                          |
| Date               | Tax-rule date fields use ISO date strings, for example `2026-01-01`.                                                 |
| Money              | Money and rates are sent as decimal strings, for example `449.00` or `18.00`, to preserve precision.                 |
| Page               | List pages are 1-based. `page` defaults to `1`.                                                                      |
| Page size          | `pageSize` defaults to `20` and cannot exceed `100`.                                                                 |
| Unknown fields     | Send only documented fields. The global validation pipe rejects non-whitelisted properties.                          |
| Date windows       | Open-ended records omit the end date. For pricing/promotions/coupons, `validUntil`/`endsAt` must be after the start. |
| Soft deletion      | DELETE endpoints deactivate records; they do not physically remove database rows.                                    |
| Optimistic locking | Update requests require the latest `rowVersion`. A stale version is rejected rather than overwritten.                |

### Common request headers

| Header             | Required                    | Used for                                                                  | Example                                |
| ------------------ | --------------------------- | ------------------------------------------------------------------------- | -------------------------------------- |
| `Authorization`    | Not consumed by this module | Bearer token may be supplied by the application’s broader security layer. | `Bearer eyJhbGciOiJIUzI1NiIs...`       |
| `Content-Type`     | JSON body requests          | Request body format.                                                      | `application/json`                     |
| `X-Request-ID`     | Optional                    | Client-generated request/support identifier.                              | `checkout-pricing-001`                 |
| `X-Correlation-ID` | Optional                    | Correlates related frontend operations.                                   | `checkout-10001`                       |
| `X-User-ID`        | Optional on write endpoints | UUID audit actor. It is not an authorization credential.                  | `550e8400-e29b-41d4-a716-446655440000` |

### Common response headers

Successful and error responses may include:

| Header             | Meaning                                                         |
| ------------------ | --------------------------------------------------------------- |
| `X-Request-ID`     | Request identifier for logs and support.                        |
| `X-Correlation-ID` | Correlation identifier supplied or generated for the operation. |
| `X-API-Version`    | API version that processed the request, normally `v1`.          |

---

## 🔐 Authorization and audit context

### Current pricing-module behavior

| Item                         | Current behavior                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| Bearer guard inside pricing  | ❌ Not enforced by the pricing controllers currently.                                                  |
| Public read routes           | Technically callable without a bearer token by this module.                                            |
| Write routes                 | Technically callable without a bearer token by this module.                                            |
| `X-User-ID`                  | Optional UUID used only as `createdBy`, `updatedBy`, or deletion audit context when valid.             |
| Authorization responsibility | The API application/security layer or calling backend must authorize staff/admin/checkout access.      |
| Frontend rule                | Never treat a successful pricing response as proof that the caller is authorized to administer prices. |

When sending `X-User-ID`, send the authenticated user UUID, not an email, username, or arbitrary client-generated value. Invalid values are normalized to no audit actor by the current implementation.

### Endpoint authorization legend

Each endpoint below includes an authorization row:

- **❌ Not required by pricing module:** No bearer guard is applied inside this module.
- **⚠️ Application authorization recommended:** The route changes pricing state or exposes operational/audit data and should be protected by the surrounding application/security layer.
- **🧾 Audit header optional:** The route accepts `X-User-ID` for audit attribution; it does not authenticate the request.

---

## 📦 Response format

All normal HTTP responses use the standard platform response envelope.

### Successful response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "error": null,
  "meta": {
    "requestId": "request-id",
    "correlationId": "correlation-id",
    "apiVersion": "v1",
    "timestamp": "2026-01-01T00:00:00.000Z"
  }
}
```

The endpoint-specific result is inside `data`. Do not read resource fields from the response top level.

### Paginated successful response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": [],
  "error": null,
  "meta": {
    "requestId": "request-id",
    "correlationId": "correlation-id",
    "apiVersion": "v1",
    "timestamp": "2026-01-01T00:00:00.000Z",
    "pagination": {
      "totalCount": 0,
      "limit": 20,
      "offset": 0,
      "hasNext": false
    }
  }
}
```

Pagination calculations:

```text
offset = (page - 1) * pageSize
hasNext = offset + returnedItemCount < totalCount
```

### Error response

```json
{
  "success": false,
  "message": "The product price was not found.",
  "data": null,
  "error": {
    "code": "PRODUCT_PRICE_NOT_FOUND",
    "details": null
  },
  "meta": {
    "requestId": "request-id",
    "correlationId": "correlation-id",
    "apiVersion": "v1",
    "timestamp": "2026-06-01T00:00:00.000Z"
  }
}
```

Use `error.code` for frontend decisions. Human-readable `message` text may change and must not be used as a stable programmatic identifier.

---

## ⚠️ Error handling

### Common HTTP statuses and pricing codes

| HTTP status | Typical error codes                                                                                                                                                                                                                                                                                  | Frontend action                                                                           |
| ----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
|       `400` | `VALIDATION_ERROR`, `BUSINESS_VALIDATION_ERROR`, `HTTP_ERROR`                                                                                                                                                                                                                                        | Show field-level correction guidance. Do not retry unchanged input.                       |
|       `404` | `PRICE_BOOK_NOT_FOUND`, `PRODUCT_PRICE_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `WAREHOUSE_NOT_FOUND`, `SELLER_NOT_FOUND`, `TAX_RULE_NOT_FOUND`, `PROMOTION_NOT_FOUND`, `PROMOTION_VERSION_NOT_FOUND`, `COUPON_CODE_NOT_FOUND`, `REDEMPTION_NOT_FOUND`, `PRICING_EVALUATION_NOT_FOUND`, `RESOURCE_NOT_FOUND` | Refresh the relevant list or show that the selected resource no longer exists.            |
|       `409` | `PRICE_BOOK_ALREADY_EXISTS`, `PRODUCT_PRICE_WINDOW_OVERLAP`, `TAX_RULE_WINDOW_OVERLAP`, `PROMOTION_ALREADY_EXISTS`, `PROMOTION_VERSION_ALREADY_EXISTS`, `COUPON_CODE_ALREADY_EXISTS`, `REDEMPTION_ALREADY_RECORDED`, `CONCURRENT_UPDATE`, `RESOURCE_CONFLICT`                                        | Refresh current state, explain the conflict, and ask the user to retry with current data. |
|       `500` | `INTERNAL_SERVER_ERROR`                                                                                                                                                                                                                                                                              | Show a generic failure state and provide `meta.requestId` to support.                     |
|       `503` | `DATABASE_ERROR`, `INFRASTRUCTURE_ERROR`, `INFRASTRUCTURE_UNAVAILABLE`                                                                                                                                                                                                                               | Show temporary unavailability and retry with backoff.                                     |

### Validation cases

The API rejects, among other cases:

- malformed UUID values;
- `page < 1`, `pageSize < 1`, or `pageSize > 100`;
- missing required request fields;
- unsupported lifecycle statuses;
- invalid ISO date/date-time values;
- an end date that is before or equal to a start date for exclusive pricing windows;
- negative prices, rates, budgets, limits, or discount amounts;
- a product selling price above its MRP;
- a per-user promotion limit greater than the total usage limit;
- an update that omits `rowVersion`;
- unknown JSON fields because the global validation pipe uses whitelist and forbid-non-whitelisted behavior.

### Concurrency behavior

For price books, promotions, coupon codes, and tax rules:

1. Read the current resource and its `rowVersion`.
2. Send that exact `rowVersion` in the update request.
3. If another operator updates the row first, the request returns a conflict.
4. Reload the resource and retry only after showing or reconciling the latest state.

Do not blindly retry a stale update payload.

---

## 📚 Pricing concepts and lifecycle

### Price book

A price book is a commercial pricing context such as web retail, mobile retail, seller-specific pricing, or warehouse-specific pricing. It has a validity window and can contain multiple product prices.

### Product price

A product price belongs to a price book and product, with an optional variant. It is effective-dated and cannot overlap another price for the same scope. Product prices are treated as historical pricing records; this module exposes list, create, and detail retrieval.

### Tax rule

A tax rule maps a tax code and geographic scope to an effective-dated rate. The same code/region scope cannot have conflicting active windows.

### Promotion and promotion version

A promotion is the lifecycle and commercial identity. Its versions contain the rule and benefit JSON consumed by the pricing engine. Create a new version when the rules or benefits change; do not rewrite a published version’s historical meaning.

### Coupon code

A coupon code belongs to a promotion and can optionally be assigned to one user, capped by redemption count, bounded by validity dates, and enabled/disabled.

### Promotion redemption

A redemption is an append-only record that records the promotion benefit applied to a user/order. Always provide a stable `idempotencyKey` for checkout or order workflows.

### Pricing evaluation

A pricing evaluation stores the pricing request and response snapshots along with the rule version. Use it for support, reconciliation, and pricing diagnostics—not as the source of truth for current product prices.

---

## 📒 Price books

### 1. List price books

```http
GET /api/v1/price-books?page=1&pageSize=20&search=Retail&status=active
```

| Item          | Value                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| Why use it    | Load price-book options for administration, seller/warehouse configuration, or pricing-context selection. |
| Authorization | ⚠️ Application authorization recommended; ❌ no bearer guard inside pricing.                              |
| Request body  | None.                                                                                                     |
| Query         | `page`, `pageSize`, optional `search`, optional `status`.                                                 |
| Success       | `200 OK`, paginated `data` array.                                                                         |
| Errors        | `400 VALIDATION_ERROR`; `503` for database/infrastructure failure.                                        |

#### Query fields

| Field      | Required | Rules                                           |
| ---------- | -------: | ----------------------------------------------- |
| `page`     |       ❌ | Integer ≥ 1; default `1`.                       |
| `pageSize` |       ❌ | Integer 1–100; default `20`.                    |
| `search`   |       ❌ | Price-book name search, maximum 100 characters. |
| `status`   |       ❌ | Lifecycle filter, maximum 32 characters.        |

#### Success data example

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Retail India Default",
    "currency": "INR",
    "channel": "web",
    "regionCode": "IN",
    "priority": 10,
    "status": "active",
    "rowVersion": 1
  }
]
```

### 2. Create a price book

```http
POST /api/v1/price-books
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

| Item          | Value                                                                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Create a commercial price context before adding product prices.                                                                                                 |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                                                                                    |
| Success       | `201 Created`.                                                                                                                                                  |
| Errors        | `400 VALIDATION_ERROR`/`BUSINESS_VALIDATION_ERROR`; `404 WAREHOUSE_NOT_FOUND` or `SELLER_NOT_FOUND`; `409 PRICE_BOOK_ALREADY_EXISTS`; `503` dependency failure. |

#### Request body

```json
{
  "name": "Retail India Default",
  "currency": "INR",
  "channel": "web",
  "regionCode": "IN",
  "sellerId": "550e8400-e29b-41d4-a716-446655440020",
  "warehouseId": "550e8400-e29b-41d4-a716-446655440021",
  "validFrom": "2026-01-01T00:00:00.000Z",
  "validUntil": "2026-12-31T23:59:59.000Z",
  "priority": 10,
  "status": "draft"
}
```

| Field         | Required | Rules                                                          |
| ------------- | -------: | -------------------------------------------------------------- |
| `name`        |       ✅ | String, 1–128 characters.                                      |
| `currency`    |       ❌ | Three-letter currency code; default `INR`.                     |
| `channel`     |       ✅ | String, 1–32 characters; normalized to lowercase.              |
| `regionCode`  |       ❌ | String, maximum 64 characters; normalized to uppercase.        |
| `sellerId`    |       ❌ | UUID; must reference an existing seller when supplied.         |
| `warehouseId` |       ❌ | UUID; must reference an existing warehouse when supplied.      |
| `validFrom`   |       ✅ | ISO date-time.                                                 |
| `validUntil`  |       ❌ | ISO date-time after `validFrom`. Omit for open-ended validity. |
| `priority`    |       ❌ | Integer; default `0`.                                          |
| `status`      |       ❌ | `draft`, `active`, `inactive`, or `archived`; default `draft`. |

#### Success data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Retail India Default",
  "currency": "INR",
  "channel": "web",
  "status": "draft",
  "rowVersion": 1
}
```

### 3. Get a price book

```http
GET /api/v1/price-books/550e8400-e29b-41d4-a716-446655440000?includeDeleted=false
```

| Item          | Value                                                                              |
| ------------- | ---------------------------------------------------------------------------------- |
| Why use it    | Load one price book for detail screens, edit forms, or pricing-context inspection. |
| Authorization | ⚠️ Application authorization recommended; ❌ no bearer guard inside pricing.       |
| Request body  | None.                                                                              |
| Query         | Optional `includeDeleted=true` to inspect a soft-deleted record.                   |
| Success       | `200 OK`.                                                                          |
| Errors        | `400 VALIDATION_ERROR`; `404 PRICE_BOOK_NOT_FOUND`; `503` dependency failure.      |

### 4. Update a price book

```http
PATCH /api/v1/price-books/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Request body

```json
{
  "name": "Retail India 2026",
  "priority": 20,
  "status": "active",
  "rowVersion": 1
}
```

| Field        | Required | Rules                                                        |
| ------------ | -------: | ------------------------------------------------------------ |
| `name`       |       ❌ | Replacement name, 1–128 characters.                          |
| `validFrom`  |       ❌ | Replacement ISO date-time.                                   |
| `validUntil` |       ❌ | Replacement ISO date-time, or `null` to remove the end date. |
| `priority`   |       ❌ | Replacement integer priority.                                |
| `status`     |       ❌ | `draft`, `active`, `inactive`, or `archived`.                |
| `rowVersion` |       ✅ | Current integer row version.                                 |

| Item          | Value                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Change price-book metadata or lifecycle state without overwriting a concurrent operator’s update.                                                                 |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                                                                                      |
| Success       | `200 OK`; returned `rowVersion` is incremented.                                                                                                                   |
| Errors        | `400 VALIDATION_ERROR`/`BUSINESS_VALIDATION_ERROR`; `404 PRICE_BOOK_NOT_FOUND`; `409 PRICE_BOOK_ALREADY_EXISTS` or `CONCURRENT_UPDATE`; `503` dependency failure. |

### 5. Deactivate a price book

```http
DELETE /api/v1/price-books/550e8400-e29b-41d4-a716-446655440000
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

| Item          | Value                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------- |
| Why use it    | Remove a price book from normal selection while preserving its records and audit history. |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.              |
| Request body  | None.                                                                                     |
| Success       | `200 OK`.                                                                                 |
| Errors        | `400 VALIDATION_ERROR`; `404 PRICE_BOOK_NOT_FOUND`; `503` dependency failure.             |

#### Success data

```json
{ "message": "The price book has been deactivated." }
```

### 6. Reactivate a price book

```http
POST /api/v1/price-books/550e8400-e29b-41d4-a716-446655440000/reactivate
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

| Item          | Value                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Restore a soft-deleted price book as inactive for review before using it again.                                                       |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                                                          |
| Request body  | None.                                                                                                                                 |
| Success       | `200 OK`; the record is restored as `inactive`.                                                                                       |
| Errors        | `400 VALIDATION_ERROR`; `404 PRICE_BOOK_NOT_FOUND`; `409 PRICE_BOOK_ALREADY_EXISTS` or `RESOURCE_CONFLICT`; `503` dependency failure. |

---

## 🏷️ Product prices

Product prices are effective-dated records. The module exposes creation and retrieval; it does not expose update/delete operations for product prices because historical price rows should remain auditable. Create a new effective-dated row when a price changes.

### 7. List product prices

```http
GET /api/v1/product-prices?productId=550e8400-e29b-41d4-a716-446655440002&priceBookId=550e8400-e29b-41d4-a716-446655440001&activeAt=2026-06-01T00:00:00.000Z&page=1&pageSize=20
```

| Item          | Value                                                                         |
| ------------- | ----------------------------------------------------------------------------- |
| Why use it    | Resolve prices for a product, variant scope, price book, or effective time.   |
| Authorization | ❌ Not required by pricing module; application authorization may still apply. |
| Request body  | None.                                                                         |
| Query         | Optional `productId`, `priceBookId`, `activeAt`, `page`, and `pageSize`.      |
| Success       | `200 OK`, paginated array.                                                    |
| Errors        | `400 VALIDATION_ERROR`; `503` dependency failure.                             |

#### Query fields

| Field              | Required | Rules                                                            |
| ------------------ | -------: | ---------------------------------------------------------------- |
| `productId`        |       ❌ | Product UUID.                                                    |
| `priceBookId`      |       ❌ | Price-book UUID.                                                 |
| `activeAt`         |       ❌ | ISO date-time at which the price must be effective.              |
| `page`, `pageSize` |       ❌ | Page defaults to `1`; page size defaults to `20`, maximum `100`. |

### 8. Create a product price

```http
POST /api/v1/product-prices
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Request body

```json
{
  "priceBookId": "550e8400-e29b-41d4-a716-446655440001",
  "productId": "550e8400-e29b-41d4-a716-446655440002",
  "variantId": "550e8400-e29b-41d4-a716-446655440003",
  "mrp": "499.00",
  "sellingPrice": "449.00",
  "costPrice": "300.00",
  "validFrom": "2026-01-01T00:00:00.000Z",
  "validUntil": "2026-12-31T23:59:59.000Z",
  "source": "manual"
}
```

| Field          | Required | Rules                                                               |
| -------------- | -------: | ------------------------------------------------------------------- |
| `priceBookId`  |       ✅ | Existing price-book UUID.                                           |
| `productId`    |       ✅ | Existing product UUID.                                              |
| `variantId`    |       ❌ | Variant UUID; must belong to `productId`.                           |
| `mrp`          |       ✅ | Non-negative decimal string.                                        |
| `sellingPrice` |       ✅ | Non-negative decimal string; cannot exceed `mrp`.                   |
| `costPrice`    |       ❌ | Non-negative decimal string.                                        |
| `validFrom`    |       ✅ | ISO date-time.                                                      |
| `validUntil`   |       ❌ | ISO date-time after `validFrom`; omit for open-ended validity.      |
| `source`       |       ❌ | String, 1–32 characters; default `manual`, normalized to lowercase. |

| Item          | Value                                                                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Add a new effective-dated product/variant price for a price book.                                                                                                                              |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                                                                                                                   |
| Success       | `201 Created`; returned data includes price-book context where available.                                                                                                                      |
| Errors        | `400 VALIDATION_ERROR`/`BUSINESS_VALIDATION_ERROR`; `404 PRICE_BOOK_NOT_FOUND`, `PRODUCT_NOT_FOUND`, or related reference error; `409 PRODUCT_PRICE_WINDOW_OVERLAP`; `503` dependency failure. |

### 9. Get a product price

```http
GET /api/v1/product-prices/550e8400-e29b-41d4-a716-446655440009
```

| Item          | Value                                                                            |
| ------------- | -------------------------------------------------------------------------------- |
| Why use it    | Load one product-price record for detail, audit, or support screens.             |
| Authorization | ❌ Not required by pricing module; application authorization may still apply.    |
| Request body  | None.                                                                            |
| Success       | `200 OK`.                                                                        |
| Errors        | `400 VALIDATION_ERROR`; `404 PRODUCT_PRICE_NOT_FOUND`; `503` dependency failure. |

---

## 🧾 Tax rules

### 10. List tax rules

```http
GET /api/v1/tax-rules?taxCode=GST18&countryCode=IN&page=1&pageSize=20
```

| Item          | Value                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------- |
| Why use it    | Load tax rules for checkout tax calculation, tax administration, or region-specific configuration. |
| Authorization | ❌ Not required by pricing module; application authorization may still apply.                      |
| Request body  | None.                                                                                              |
| Query         | Optional `taxCode`, `countryCode`, `page`, and `pageSize`.                                         |
| Success       | `200 OK`, paginated array.                                                                         |
| Errors        | `400 VALIDATION_ERROR`; `503` dependency failure.                                                  |

#### Query fields

| Field              | Required | Rules                                                            |
| ------------------ | -------: | ---------------------------------------------------------------- |
| `taxCode`          |       ❌ | String, maximum 64 characters.                                   |
| `countryCode`      |       ❌ | Two-letter country code, for example `IN`.                       |
| `page`, `pageSize` |       ❌ | Page defaults to `1`; page size defaults to `20`, maximum `100`. |

### 11. Create a tax rule

```http
POST /api/v1/tax-rules
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Request body

```json
{
  "taxCode": "GST18",
  "countryCode": "IN",
  "stateCode": "WB",
  "rate": "18.00",
  "validFrom": "2026-01-01",
  "validUntil": "2026-12-31",
  "reverseCharge": false,
  "metadataJson": { "category": "medicines" }
}
```

| Field           | Required | Rules                                                           |
| --------------- | -------: | --------------------------------------------------------------- |
| `taxCode`       |       ✅ | String, 1–64 characters.                                        |
| `countryCode`   |       ❌ | Two-letter country code; default `IN`.                          |
| `stateCode`     |       ❌ | State/province code, maximum 8 characters.                      |
| `rate`          |       ✅ | Decimal string from `0` through `100`.                          |
| `validFrom`     |       ✅ | ISO date.                                                       |
| `validUntil`    |       ❌ | ISO date on or after `validFrom`; omit for open-ended validity. |
| `reverseCharge` |       ❌ | Boolean; default `false`.                                       |
| `metadataJson`  |       ❌ | JSON object; default `{}`.                                      |

| Item          | Value                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| Why use it    | Add an effective-dated tax rate for a tax code and geographic scope.                                         |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                                 |
| Success       | `201 Created`.                                                                                               |
| Errors        | `400 VALIDATION_ERROR`/`BUSINESS_VALIDATION_ERROR`; `409 TAX_RULE_WINDOW_OVERLAP`; `503` dependency failure. |

### 12. Get a tax rule

```http
GET /api/v1/tax-rules/550e8400-e29b-41d4-a716-446655440010?includeDeleted=false
```

| Item          | Value                                                                        |
| ------------- | ---------------------------------------------------------------------------- |
| Why use it    | Load one tax rule for administration, edit forms, or support.                |
| Authorization | ⚠️ Application authorization recommended; ❌ no bearer guard inside pricing. |
| Request body  | None.                                                                        |
| Query         | Optional `includeDeleted=true` to inspect soft-deleted history.              |
| Success       | `200 OK`.                                                                    |
| Errors        | `400 VALIDATION_ERROR`; `404 TAX_RULE_NOT_FOUND`; `503` dependency failure.  |

### 13. Update a tax rule

```http
PATCH /api/v1/tax-rules/550e8400-e29b-41d4-a716-446655440010
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Request body

```json
{
  "rate": "12.00",
  "reverseCharge": true,
  "metadataJson": { "category": "medical-device" },
  "rowVersion": 1
}
```

| Field           | Required | Rules                                                   |
| --------------- | -------: | ------------------------------------------------------- |
| `rate`          |       ❌ | Decimal string from `0` through `100`.                  |
| `validFrom`     |       ❌ | Replacement ISO date.                                   |
| `validUntil`    |       ❌ | Replacement ISO date, or `null` to remove the end date. |
| `reverseCharge` |       ❌ | Boolean.                                                |
| `metadataJson`  |       ❌ | JSON object.                                            |
| `rowVersion`    |       ✅ | Current integer row version.                            |

| Item          | Value                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Change mutable tax-rule data without overwriting a concurrent update.                                                                                         |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                                                                                  |
| Success       | `200 OK`; returned `rowVersion` is incremented.                                                                                                               |
| Errors        | `400 VALIDATION_ERROR`/`BUSINESS_VALIDATION_ERROR`; `404 TAX_RULE_NOT_FOUND`; `409 TAX_RULE_WINDOW_OVERLAP` or `CONCURRENT_UPDATE`; `503` dependency failure. |

### 14. Deactivate a tax rule

```http
DELETE /api/v1/tax-rules/550e8400-e29b-41d4-a716-446655440010
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

| Item          | Value                                                                         |
| ------------- | ----------------------------------------------------------------------------- |
| Why use it    | Exclude a tax rule from normal tax resolution without deleting audit history. |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.  |
| Request body  | None.                                                                         |
| Success       | `200 OK`; `data.message` confirms deactivation.                               |
| Errors        | `400 VALIDATION_ERROR`; `404 TAX_RULE_NOT_FOUND`; `503` dependency failure.   |

### 15. Reactivate a tax rule

```http
POST /api/v1/tax-rules/550e8400-e29b-41d4-a716-446655440010/reactivate
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

| Item          | Value                                                                        |
| ------------- | ---------------------------------------------------------------------------- |
| Why use it    | Restore a soft-deleted tax rule for review and future use.                   |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit. |
| Request body  | None.                                                                        |
| Success       | `200 OK`.                                                                    |
| Errors        | `400 VALIDATION_ERROR`; `404 TAX_RULE_NOT_FOUND`; `503` dependency failure.  |

---

## 🎁 Promotions

Promotion creation and versioning are separate operations:

1. Create the promotion identity and lifecycle record.
2. Create a version with `rules` and `benefits` JSON objects.
3. Publish the version when it is ready for pricing evaluation.
4. Create a new version for future rule/benefit changes.

### 16. List promotions

```http
GET /api/v1/promotions?search=WELCOME&status=active&activeAt=2026-06-01T00:00:00.000Z&page=1&pageSize=20
```

| Item          | Value                                                                            |
| ------------- | -------------------------------------------------------------------------------- |
| Why use it    | Load promotions for administration or find active promotions at a specific time. |
| Authorization | ⚠️ Application authorization recommended; ❌ no bearer guard inside pricing.     |
| Request body  | None.                                                                            |
| Query         | Optional `search`, `status`, `activeAt`, `page`, and `pageSize`.                 |
| Success       | `200 OK`, paginated array.                                                       |
| Errors        | `400 VALIDATION_ERROR`; `503` dependency failure.                                |

### 17. Create a promotion

```http
POST /api/v1/promotions
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Request body

```json
{
  "code": "WELCOME10",
  "name": "Welcome discount",
  "promotionType": "percentage",
  "stackabilityGroup": "WELCOME",
  "priority": 10,
  "budgetAmount": "100000.00",
  "usageLimit": 1000,
  "perUserLimit": 1,
  "startsAt": "2026-01-01T00:00:00.000Z",
  "endsAt": "2026-12-31T23:59:59.000Z",
  "status": "draft",
  "exclusive": false
}
```

| Field               | Required | Rules                                                                                      |
| ------------------- | -------: | ------------------------------------------------------------------------------------------ |
| `code`              |       ✅ | String, 1–64 characters; stored in uppercase; must be unique among non-deleted promotions. |
| `name`              |       ✅ | String, 1–255 characters.                                                                  |
| `promotionType`     |       ✅ | String, 1–32 characters; interpretation belongs to the pricing engine.                     |
| `stackabilityGroup` |       ❌ | String, maximum 64 characters.                                                             |
| `priority`          |       ❌ | Non-negative integer; default `0`.                                                         |
| `budgetAmount`      |       ❌ | Non-negative decimal string.                                                               |
| `usageLimit`        |       ❌ | Non-negative integer.                                                                      |
| `perUserLimit`      |       ❌ | Non-negative integer; cannot exceed `usageLimit` when both are supplied.                   |
| `startsAt`          |       ✅ | ISO date-time.                                                                             |
| `endsAt`            |       ❌ | ISO date-time after `startsAt`; omit for open-ended promotion.                             |
| `status`            |       ❌ | `draft`, `active`, `inactive`, or `archived`; default `draft`.                             |
| `exclusive`         |       ❌ | Boolean; default `false`.                                                                  |

| Item          | Value                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| Why use it    | Create the lifecycle identity for a promotion before defining its versioned rules.                            |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                                  |
| Success       | `201 Created`.                                                                                                |
| Errors        | `400 VALIDATION_ERROR`/`BUSINESS_VALIDATION_ERROR`; `409 PROMOTION_ALREADY_EXISTS`; `503` dependency failure. |

### 18. Get a promotion

```http
GET /api/v1/promotions/550e8400-e29b-41d4-a716-446655440004?includeDeleted=false
```

| Item          | Value                                                                        |
| ------------- | ---------------------------------------------------------------------------- |
| Why use it    | Load one promotion for administration, editing, or version management.       |
| Authorization | ⚠️ Application authorization recommended; ❌ no bearer guard inside pricing. |
| Request body  | None.                                                                        |
| Query         | Optional `includeDeleted=true` to inspect soft-deleted history.              |
| Success       | `200 OK`.                                                                    |
| Errors        | `400 VALIDATION_ERROR`; `404 PROMOTION_NOT_FOUND`; `503` dependency failure. |

### 19. Update a promotion

```http
PATCH /api/v1/promotions/550e8400-e29b-41d4-a716-446655440004
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Request body

```json
{
  "name": "Welcome discount updated",
  "priority": 20,
  "status": "active",
  "rowVersion": 1
}
```

All fields except `rowVersion` are optional. The mutable fields are `code`, `name`, `promotionType`, `stackabilityGroup`, `priority`, `budgetAmount`, `usageLimit`, `perUserLimit`, `startsAt`, `endsAt`, `status`, and `exclusive`. Nullable fields accept `null` when the goal is to remove an existing value.

| Item          | Value                                                                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Change promotion metadata, limits, or lifecycle state while protecting against concurrent edits.                                                                |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                                                                                    |
| Success       | `200 OK`; returned `rowVersion` is incremented.                                                                                                                 |
| Errors        | `400 VALIDATION_ERROR`/`BUSINESS_VALIDATION_ERROR`; `404 PROMOTION_NOT_FOUND`; `409 PROMOTION_ALREADY_EXISTS` or `CONCURRENT_UPDATE`; `503` dependency failure. |

### 20. Deactivate a promotion

```http
DELETE /api/v1/promotions/550e8400-e29b-41d4-a716-446655440004
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

| Item          | Value                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------- |
| Why use it    | Remove a promotion from normal selection while preserving historical versions and audit data. |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                  |
| Success       | `200 OK`; `data.message` confirms deactivation.                                               |
| Errors        | `400 VALIDATION_ERROR`; `404 PROMOTION_NOT_FOUND`; `503` dependency failure.                  |

### 21. Reactivate a promotion

```http
POST /api/v1/promotions/550e8400-e29b-41d4-a716-446655440004/reactivate
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

| Item          | Value                                                                            |
| ------------- | -------------------------------------------------------------------------------- |
| Why use it    | Restore a deleted promotion as `inactive` for review before activating it again. |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.     |
| Success       | `200 OK`.                                                                        |
| Errors        | `400 VALIDATION_ERROR`; `404 PROMOTION_NOT_FOUND`; `503` dependency failure.     |

### 22. List promotion versions

```http
GET /api/v1/promotions/550e8400-e29b-41d4-a716-446655440004/versions?publishedOnly=true&page=1&pageSize=20
```

| Item          | Value                                                                        |
| ------------- | ---------------------------------------------------------------------------- |
| Why use it    | Show draft and published version history for a promotion.                    |
| Authorization | ⚠️ Application authorization recommended; ❌ no bearer guard inside pricing. |
| Request body  | None.                                                                        |
| Query         | Optional `publishedOnly`, `page`, and `pageSize`.                            |
| Success       | `200 OK`, paginated array.                                                   |
| Errors        | `400 VALIDATION_ERROR`; `404 PROMOTION_NOT_FOUND`; `503` dependency failure. |

### 23. Create a promotion version

```http
POST /api/v1/promotions/550e8400-e29b-41d4-a716-446655440004/versions
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Request body

```json
{
  "versionNo": 1,
  "rules": {
    "minimumOrderValue": "999.00",
    "categories": ["medicine"]
  },
  "benefits": {
    "discountPercent": 10,
    "maxDiscount": "200.00"
  },
  "publishedAt": null
}
```

| Field         | Required | Rules                                                       |
| ------------- | -------: | ----------------------------------------------------------- |
| `versionNo`   |       ✅ | Integer ≥ 1; unique within the promotion.                   |
| `rules`       |       ✅ | JSON object consumed by the pricing engine.                 |
| `benefits`    |       ✅ | JSON object produced when rules match.                      |
| `publishedAt` |       ❌ | ISO date-time; omit or use `null` for an unpublished draft. |

| Item          | Value                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Create an immutable versioned snapshot of promotion rules and benefits.                                              |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                                         |
| Success       | `201 Created`.                                                                                                       |
| Errors        | `400 VALIDATION_ERROR`; `404 PROMOTION_NOT_FOUND`; `409 PROMOTION_VERSION_ALREADY_EXISTS`; `503` dependency failure. |

### 24. Get a promotion version

```http
GET /api/v1/promotions/550e8400-e29b-41d4-a716-446655440004/versions/550e8400-e29b-41d4-a716-446655440007
```

| Item          | Value                                                                                |
| ------------- | ------------------------------------------------------------------------------------ |
| Why use it    | Inspect one rules-and-benefits snapshot for administration, audit, or support.       |
| Authorization | ⚠️ Application authorization recommended; ❌ no bearer guard inside pricing.         |
| Request body  | None.                                                                                |
| Success       | `200 OK`.                                                                            |
| Errors        | `400 VALIDATION_ERROR`; `404 PROMOTION_VERSION_NOT_FOUND`; `503` dependency failure. |

### 25. Publish a promotion version

```http
POST /api/v1/promotions/550e8400-e29b-41d4-a716-446655440004/versions/550e8400-e29b-41d4-a716-446655440007/publish
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

| Item          | Value                                                                                |
| ------------- | ------------------------------------------------------------------------------------ |
| Why use it    | Make a version available to the pricing engine by assigning its publish timestamp.   |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.         |
| Request body  | None.                                                                                |
| Success       | `200 OK`; publishing an already published version keeps its existing publish time.   |
| Errors        | `400 VALIDATION_ERROR`; `404 PROMOTION_VERSION_NOT_FOUND`; `503` dependency failure. |

---

## 🎟️ Coupon codes

### 26. List coupon codes

```http
GET /api/v1/coupon-codes?promotionId=550e8400-e29b-41d4-a716-446655440004&assignedUserId=550e8400-e29b-41d4-a716-446655440005&activeAt=2026-06-01T00:00:00.000Z&page=1&pageSize=20
```

| Item          | Value                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------- |
| Why use it    | Load coupons for promotion administration, assignment, validity checks, or customer-support lookup. |
| Authorization | ⚠️ Application authorization recommended; ❌ no bearer guard inside pricing.                        |
| Request body  | None.                                                                                               |
| Query         | Optional `promotionId`, `assignedUserId`, `search`, `activeAt`, `page`, and `pageSize`.             |
| Success       | `200 OK`, paginated array.                                                                          |
| Errors        | `400 VALIDATION_ERROR`; `503` dependency failure.                                                   |

### 27. Create a coupon code

```http
POST /api/v1/coupon-codes
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Request body

```json
{
  "promotionId": "550e8400-e29b-41d4-a716-446655440004",
  "code": "WELCOME2026",
  "maxRedemptions": 100,
  "assignedUserId": "550e8400-e29b-41d4-a716-446655440005",
  "validFrom": "2026-01-01T00:00:00.000Z",
  "validUntil": "2026-12-31T23:59:59.000Z",
  "isActive": true
}
```

| Field            | Required | Rules                                                                              |
| ---------------- | -------: | ---------------------------------------------------------------------------------- |
| `promotionId`    |       ✅ | Existing promotion UUID.                                                           |
| `code`           |       ✅ | String, 1–64 characters; stored in uppercase and unique among non-deleted coupons. |
| `maxRedemptions` |       ❌ | Non-negative integer.                                                              |
| `assignedUserId` |       ❌ | Optional user UUID.                                                                |
| `validFrom`      |       ❌ | ISO date-time.                                                                     |
| `validUntil`     |       ❌ | ISO date-time after `validFrom`.                                                   |
| `isActive`       |       ❌ | Boolean; default `true`.                                                           |

| Item          | Value                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Why use it    | Create a reusable or user-assigned coupon linked to a promotion.                                                                           |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                                                               |
| Success       | `201 Created`.                                                                                                                             |
| Errors        | `400 VALIDATION_ERROR`/`BUSINESS_VALIDATION_ERROR`; `404 PROMOTION_NOT_FOUND`; `409 COUPON_CODE_ALREADY_EXISTS`; `503` dependency failure. |

### 28. Get a coupon code

```http
GET /api/v1/coupon-codes/550e8400-e29b-41d4-a716-446655440008?includeDeleted=false
```

| Item          | Value                                                                          |
| ------------- | ------------------------------------------------------------------------------ |
| Why use it    | Load one coupon’s assignment, validity, active state, and version.             |
| Authorization | ⚠️ Application authorization recommended; ❌ no bearer guard inside pricing.   |
| Request body  | None.                                                                          |
| Query         | Optional `includeDeleted=true` to inspect soft-deleted history.                |
| Success       | `200 OK`.                                                                      |
| Errors        | `400 VALIDATION_ERROR`; `404 COUPON_CODE_NOT_FOUND`; `503` dependency failure. |

### 29. Update a coupon code

```http
PATCH /api/v1/coupon-codes/550e8400-e29b-41d4-a716-446655440008
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Request body

```json
{
  "maxRedemptions": 200,
  "isActive": false,
  "rowVersion": 1
}
```

Mutable fields are `code`, `maxRedemptions`, `assignedUserId`, `validFrom`, `validUntil`, and `isActive`. Nullable fields accept `null` to clear the value. `rowVersion` is always required.

| Item          | Value                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Change coupon eligibility or assignment without overwriting a concurrent update.                                                                                    |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                                                                                        |
| Success       | `200 OK`; returned `rowVersion` is incremented.                                                                                                                     |
| Errors        | `400 VALIDATION_ERROR`/`BUSINESS_VALIDATION_ERROR`; `404 COUPON_CODE_NOT_FOUND`; `409 COUPON_CODE_ALREADY_EXISTS` or `CONCURRENT_UPDATE`; `503` dependency failure. |

### 30. Deactivate a coupon code

```http
DELETE /api/v1/coupon-codes/550e8400-e29b-41d4-a716-446655440008
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

| Item          | Value                                                                                |
| ------------- | ------------------------------------------------------------------------------------ |
| Why use it    | Prevent future coupon redemption while preserving the coupon and redemption history. |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.         |
| Request body  | None.                                                                                |
| Success       | `200 OK`; `data.message` confirms deactivation.                                      |
| Errors        | `400 VALIDATION_ERROR`; `404 COUPON_CODE_NOT_FOUND`; `503` dependency failure.       |

### 31. Reactivate a coupon code

```http
POST /api/v1/coupon-codes/550e8400-e29b-41d4-a716-446655440008/reactivate
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

| Item          | Value                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| Why use it    | Restore a soft-deleted coupon as active. Check promotion validity before presenting it to customers. |
| Authorization | ⚠️ Application authorization recommended; 🧾 `X-User-ID` optional for audit.                         |
| Request body  | None.                                                                                                |
| Success       | `200 OK`.                                                                                            |
| Errors        | `400 VALIDATION_ERROR`; `404 COUPON_CODE_NOT_FOUND`; `503` dependency failure.                       |

---

## 🧮 Promotion redemptions

Redemption records are intended for checkout/order workflows and reconciliation. They are not a promotion-eligibility calculation endpoint. The caller should evaluate eligibility first, then record the applied benefit after the relevant order state is known.

### 32. List promotion redemptions

```http
GET /api/v1/promotion-redemptions?promotionId=550e8400-e29b-41d4-a716-446655440004&userId=550e8400-e29b-41d4-a716-446655440005&orderId=550e8400-e29b-41d4-a716-446655440006&page=1&pageSize=20
```

| Item          | Value                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------- |
| Why use it    | Show redemption history for an order, customer, promotion, reconciliation, or support case. |
| Authorization | ⚠️ Application authorization strongly recommended; ❌ no bearer guard inside pricing.       |
| Request body  | None.                                                                                       |
| Query         | Optional `promotionId`, `userId`, `orderId`, `page`, and `pageSize`.                        |
| Success       | `200 OK`, paginated array.                                                                  |
| Errors        | `400 VALIDATION_ERROR`; `503` dependency failure.                                           |

### 33. Record a promotion redemption

```http
POST /api/v1/promotion-redemptions
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Request body

```json
{
  "promotionId": "550e8400-e29b-41d4-a716-446655440004",
  "promotionVersionId": "550e8400-e29b-41d4-a716-446655440007",
  "couponCodeId": "550e8400-e29b-41d4-a716-446655440008",
  "userId": "550e8400-e29b-41d4-a716-446655440005",
  "orderId": "550e8400-e29b-41d4-a716-446655440006",
  "discountAmount": "100.00",
  "redeemedAt": "2026-06-01T12:00:00.000Z",
  "idempotencyKey": "checkout-order-10001-promo-WELCOME10"
}
```

| Field                | Required | Rules                                            |
| -------------------- | -------: | ------------------------------------------------ |
| `promotionId`        |       ✅ | Existing promotion UUID.                         |
| `promotionVersionId` |       ❌ | Promotion-version UUID used for the calculation. |
| `couponCodeId`       |       ❌ | Coupon-code UUID used for the calculation.       |
| `userId`             |       ✅ | User UUID receiving the benefit.                 |
| `orderId`            |       ❌ | Related order UUID.                              |
| `discountAmount`     |       ✅ | Non-negative decimal string.                     |
| `redeemedAt`         |       ❌ | ISO date-time; defaults to current server time.  |
| `idempotencyKey`     |       ✅ | String, 1–128 characters. Reuse is rejected.     |

| Item          | Value                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Persist the promotion benefit applied by checkout/order processing.                                                                         |
| Authorization | ⚠️ Application authorization strongly recommended; 🧾 `X-User-ID` optional for audit.                                                       |
| Success       | `201 Created`.                                                                                                                              |
| Errors        | `400 VALIDATION_ERROR`/`BUSINESS_VALIDATION_ERROR`; `404 PROMOTION_NOT_FOUND`; `409 REDEMPTION_ALREADY_RECORDED`; `503` dependency failure. |

#### Idempotency rule

Generate the key from a stable business operation, such as order ID plus promotion code. If the request times out, retry with the exact same key. Do not generate a new key for each network retry.

### 34. Get a promotion redemption

```http
GET /api/v1/promotion-redemptions/550e8400-e29b-41d4-a716-446655440011
```

| Item          | Value                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Why use it    | Confirm or inspect one recorded redemption during order completion, support, or reconciliation. |
| Authorization | ⚠️ Application authorization strongly recommended; ❌ no bearer guard inside pricing.           |
| Request body  | None.                                                                                           |
| Success       | `200 OK`.                                                                                       |
| Errors        | `400 VALIDATION_ERROR`; `404 REDEMPTION_NOT_FOUND`; `503` dependency failure.                   |

---

## 🔍 Pricing evaluations

Pricing evaluations are audit snapshots. They store the input and output used by a pricing engine, along with the rule version. They do not calculate prices themselves and should not be used as a replacement for current product-price lookup.

### 35. List pricing evaluations

```http
GET /api/v1/pricing-evaluations?referenceType=order&referenceId=550e8400-e29b-41d4-a716-446655440006&userId=550e8400-e29b-41d4-a716-446655440005&page=1&pageSize=20
```

| Item          | Value                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------- |
| Why use it    | Find pricing calculation snapshots for order support, audit, reconciliation, or diagnostics. |
| Authorization | ⚠️ Application authorization strongly recommended; ❌ no bearer guard inside pricing.        |
| Request body  | None.                                                                                        |
| Query         | Optional `referenceType`, `referenceId`, `userId`, `page`, and `pageSize`.                   |
| Success       | `200 OK`, paginated array.                                                                   |
| Errors        | `400 VALIDATION_ERROR`; `503` dependency failure.                                            |

### 36. Record a pricing evaluation

```http
POST /api/v1/pricing-evaluations
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

#### Request body

```json
{
  "referenceType": "order",
  "referenceId": "550e8400-e29b-41d4-a716-446655440006",
  "userId": "550e8400-e29b-41d4-a716-446655440005",
  "requestPayload": {
    "items": [
      {
        "productId": "550e8400-e29b-41d4-a716-446655440002",
        "quantity": 2
      }
    ],
    "subtotal": "998.00"
  },
  "responseSnapshot": {
    "subtotal": "998.00",
    "discount": "100.00",
    "total": "898.00"
  },
  "ruleVersion": "promotion-v3"
}
```

| Field              | Required | Rules                                                                                         |
| ------------------ | -------: | --------------------------------------------------------------------------------------------- |
| `referenceType`    |       ✅ | String, 1–32 characters, such as `order`, `cart`, or `quote`.                                 |
| `referenceId`      |       ✅ | Reference UUID.                                                                               |
| `userId`           |       ❌ | User UUID. When omitted, the valid `X-User-ID` audit actor may be stored as the user context. |
| `requestPayload`   |       ✅ | JSON object containing the pricing input snapshot.                                            |
| `responseSnapshot` |       ✅ | JSON object containing the pricing output snapshot.                                           |
| `ruleVersion`      |       ✅ | String, 1–64 characters.                                                                      |

| Item          | Value                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------- |
| Why use it    | Preserve the exact pricing request/response used for an order or other reference.                  |
| Authorization | ⚠️ Application authorization strongly recommended; 🧾 `X-User-ID` optional for audit/user context. |
| Success       | `201 Created`.                                                                                     |
| Errors        | `400 VALIDATION_ERROR`; `503` dependency failure.                                                  |

### 37. Get a pricing evaluation

```http
GET /api/v1/pricing-evaluations/550e8400-e29b-41d4-a716-446655440012
```

| Item          | Value                                                                                 |
| ------------- | ------------------------------------------------------------------------------------- |
| Why use it    | Load one pricing input/output snapshot for support or reconciliation.                 |
| Authorization | ⚠️ Application authorization strongly recommended; ❌ no bearer guard inside pricing. |
| Request body  | None.                                                                                 |
| Success       | `200 OK`.                                                                             |
| Errors        | `400 VALIDATION_ERROR`; `404 PRICING_EVALUATION_NOT_FOUND`; `503` dependency failure. |

---

## 🧭 Recommended frontend flows

### Checkout price-resolution flow

1. Resolve the relevant price-book context for the channel, seller, warehouse, and region.
2. Request product prices with `productId`, `priceBookId`, and `activeAt`.
3. Display decimal-string money values without converting them to binary floating-point for calculations.
4. Resolve applicable tax rules by tax code and country/region.
5. Evaluate promotions and coupon eligibility using the active promotion/version data available to the pricing engine.
6. Record a pricing evaluation with the request/response snapshots.
7. After the order is accepted, record each promotion redemption with a stable idempotency key.

### Price-book administration flow

1. `POST /price-books` to create a draft price book.
2. `POST /product-prices` to add non-overlapping effective-dated prices.
3. `PATCH /price-books/{priceBookId}` with the latest `rowVersion`.
4. Change the price-book status to `active` only after reviewing its price rows.
5. Use `DELETE` for deactivation and `/reactivate` for restoration; do not physically delete records from the frontend.

### Promotion administration flow

1. Create the promotion identity with `POST /promotions`.
2. Create a draft version with `POST /promotions/{promotionId}/versions`.
3. Review the rules and benefits JSON.
4. Publish the approved version with `/publish`.
5. Use `PATCH /promotions/{promotionId}` for lifecycle/metadata changes and create a new version when the actual pricing rules change.
6. Create coupon codes only after the parent promotion exists.

### Safe update flow

```text
GET resource
  -> read rowVersion
  -> display/edit
  -> PATCH with the same rowVersion
  -> on CONCURRENT_UPDATE, reload and reconcile
```

### Safe retry flow for redemptions

```text
create redemption with idempotencyKey
  -> timeout?
  -> retry exact same request and exact same key
  -> already recorded?
  -> reload or treat the original redemption as the successful result
```

---

## 🛡️ Frontend safety checklist

- Always read the result from `response.data`.
- Read pagination from `response.meta.pagination`.
- Branch on `response.error.code`, not on the human-readable message.
- Preserve and log `meta.requestId` for failed operations.
- Send ISO UTC date-time values for date-time fields.
- Send money, rate, budget, and discount values as decimal strings.
- Do not convert money to JavaScript `number` before performing business calculations.
- Do not update a price book, promotion, coupon, or tax rule without the latest `rowVersion`.
- Do not retry a stale update payload after `CONCURRENT_UPDATE`.
- Use the exact same idempotency key when retrying a promotion redemption.
- Treat DELETE as soft deactivation, not physical deletion.
- Do not assume a valid `X-User-ID` authenticates or authorizes a request.
- Hide operational promotion, redemption, and evaluation data from ordinary customer screens unless the application authorization layer permits it.
- Do not expose internal pricing request/response snapshots to customers without filtering sensitive fields.

---

## 🔗 Related documentation

- [Pricing module README](./README.md)
- [Authentication API documentation](../auth/API_DOCUMENTATION.md)
- [Catalog module API documentation](../catalog/API_DOCUMENTATION.md)
