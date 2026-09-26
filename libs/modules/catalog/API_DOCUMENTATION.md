# 🛍️ Catalog API Documentation

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="72" alt="NestJS logo" />
</p>

<p align="center">
  <img src="../../../assets/readme/healthcare-platform-banner.png" alt="Abstract healthcare platform backend architecture banner" width="100%" />
</p>

> **Module:** libs/modules/catalog  
> **API style:** REST/JSON  
> **Audience:** Web, Android, and iOS frontend developers, catalogue administrators, pharmacy operations, and merchandising teams  
> **Scope:** Products, product details, catalogue search, product relationships, healthcare references, categories, and substitution groups  
> **Out of scope:** Inventory quantities, pricing, checkout, orders, payments, delivery, reviews, and doctor appointments

This document is the frontend-readable companion to the generated Swagger specification. It describes every HTTP endpoint currently exposed by the catalog module, when to use it, request data, response data, audit context, and expected errors.

## 📚 Contents

- [✅ Contract status](#contract-status)
- [🚀 Quick start](#-quick-start)
- [📐 API conventions](#-api-conventions)
- [🔐 Authorization and audit context](#-authorization-and-audit-context)
- [📦 Response format](#-response-format)
- [⚠️ Error handling](#️-error-handling)
- [🧴 Products](#-products)
- [🔗 Product relationships](#-product-relationships)
- [💊 Substitution groups](#-substitution-groups)
- [🏷️ Reference masters](#️-reference-masters)
- [🧭 Recommended frontend flows](#-recommended-frontend-flows)
- [🛠️ Implementation notes](#️-implementation-notes)

---

<a id="contract-status"></a>

## ✅ Contract status

| Contract item | Source-aligned state |
| --- | --- |
| Runtime mount | `CatalogModule` is imported by [`AppModule`](../../../apps/api/src/app.module.ts). |
| API address | URI version `v1`; every route resolves below `/api/v1`. |
| Route audit | **63 documented / 63 registered controller operations**. |
| Runtime specification | Swagger is generated at `/api/docs`; controller decorators are the code source of truth. |
| Authorization model | `X-User-ID` is accepted as audit attribution on supported writes; it is not an authorization credential. |

### 🗺️ Route coverage

| Surface | Registered controller | Operations |
| --- | --- | ---: |
| Products, details, and relationships | `ProductsController` | 16 |
| Substitution groups | `SubstitutionGroupsController` | 10 |
| Brands | `BrandsController` | 6 |
| Manufacturers | `ManufacturersController` | 6 |
| Categories and tree | `CategoriesController` | 7 |
| Salts | `SaltsController` | 6 |
| Dosage forms | `DosageFormsController` | 6 |
| Units of measure | `UnitsController` | 6 |
| **Total** | **8 controllers** | **63** |

---

## 🚀 Quick start

### Base URL

The application uses the global /api prefix and URI version v1:

```text
{API_ORIGIN}/api/v1
```

Examples:

```http
GET  https://api.example.com/api/v1/products
GET  https://api.example.com/api/v1/products/search?search=paracetamol
GET  https://api.example.com/api/v1/categories/tree
```

### Minimal product-list request

```http
GET /api/v1/products?page=1&pageSize=20&status=active
Accept: application/json
```

### Minimal product-create request

```http
POST /api/v1/products
Content-Type: application/json
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

```json
{
  "sku": "PARA-500",
  "name": "Paracetamol 500 mg",
  "productType": "medicine"
}
```

The DTO defaults optional child collections to empty arrays and product status to draft.

---

## 📐 API conventions

### HTTP and content rules

| Rule           | Description                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------- |
| Content type   | Send JSON request bodies with Content-Type: application/json.                                      |
| IDs            | Resource identifiers are UUID values.                                                              |
| Dates          | Use ISO-8601 date-time strings, for example 2026-01-01T00:00:00.000Z.                              |
| Numbers        | Quantities stored as numeric database values may be returned as strings. Preserve their precision. |
| Pagination     | page starts at 1; pageSize defaults to 20 and accepts 1–100.                                       |
| Search         | Product search requires at least 2 characters; product list search is limited to 1000 characters.  |
| Unknown fields | Send only documented fields.                                                                       |
| Soft deletion  | Delete endpoints deactivate records. They do not normally remove historical data.                  |
| Versioning     | Update DTOs that expose expectedRowVersion support optimistic concurrency.                         |

### Common request headers

| Header           |                                    Required | Used for                                                       | Example                              |
| ---------------- | ------------------------------------------: | -------------------------------------------------------------- | ------------------------------------ |
| Authorization    | Not enforced by current catalog controllers | Bearer authentication when an application-level guard is added | Bearer eyJhbGciOiJIUzI1NiIs...       |
| Content-Type     |                          JSON body requests | Request body format                                            | application/json                     |
| X-Request-ID     |                                    Optional | Client-generated request/support ID                            | catalog-product-screen-001           |
| X-Correlation-ID |                                    Optional | Correlates related frontend operations                         | catalog-import-2026-01               |
| X-User-ID        |                          Optional on writes | UUID used for createdBy, updatedBy, and deletedBy audit fields | 550e8400-e29b-41d4-a716-446655440000 |

X-User-ID is an audit-context header, not an authentication mechanism. Do not treat it as proof of identity. The current catalog controllers do not declare a bearer guard; protect write routes at the application/deployment authorization boundary before exposing them to untrusted clients.

### Common response headers

Successful and error responses may include:

| Header           | Meaning                                                         |
| ---------------- | --------------------------------------------------------------- |
| X-Request-ID     | Request identifier for logs and customer support.               |
| X-Correlation-ID | Correlation identifier supplied or generated for the operation. |
| X-API-Version    | API version that processed the request, normally v1.            |

---

## 🔐 Authorization and audit context

### Current implementation behavior

| Operation type           | Current catalog behavior                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Product/reference reads  | No bearer guard is declared in this module.                                                                                     |
| Product/reference writes | No bearer guard is declared; optional X-User-ID is converted to an audit actor only when it is a valid UUID.                    |
| Database authorization   | Must be enforced by the application boundary, reverse proxy, gateway policy, or a future auth guard before production exposure. |

Frontend developers should still design the UI around roles and permissions. A future authorization guard may return 401 or 403 without changing the endpoint purpose or request body.

### Audit header example

```http
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

Invalid or missing values become null for audit purposes. They do not authenticate the request.

---

## 📦 Response format

All normal HTTP responses use the standard response envelope.

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

The endpoint-specific result is inside data. Do not read endpoint fields from the top level.

### Paginated response

List endpoints return:

```json
{
  "data": {
    "items": [],
    "pagination": {
      "totalCount": 0,
      "limit": 20,
      "offset": 0,
      "hasNext": false
    }
  }
}
```

offset is calculated as (page - 1) × pageSize. Use hasNext for the next-page control.

### Error response

```json
{
  "success": false,
  "message": "The requested product was not found.",
  "data": null,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "details": null
  },
  "meta": {
    "requestId": "request-id",
    "correlationId": "correlation-id",
    "apiVersion": "v1",
    "timestamp": "2026-01-01T00:00:00.000Z"
  }
}
```

Use error.code for frontend decisions. Human-readable message text may change and must not be used as a stable programmatic identifier.

---

## ⚠️ Error handling

### Common HTTP statuses and catalog codes

| HTTP status | Typical codes                                                                                                                                                                                          | Frontend action                                                                           |
| ----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
|         400 | VALIDATION_ERROR, BUSINESS_VALIDATION_ERROR, SEARCH_TERM_TOO_LONG                                                                                                                                      | Show field-level correction guidance; do not retry unchanged input.                       |
|         401 | AUTHENTICATION_REQUIRED when an application-level guard is enabled                                                                                                                                     | Re-authenticate.                                                                          |
|         403 | PERMISSION_DENIED when an application-level guard is enabled                                                                                                                                           | Hide or disable the staff action; do not retry automatically.                             |
|         404 | PRODUCT_NOT_FOUND, RESOURCE_NOT_FOUND                                                                                                                                                                  | Refresh the list or show that the selected record no longer exists.                       |
|         409 | PRODUCT_ALREADY_EXISTS, PRODUCT_VERSION_CONFLICT, INVALID_PRODUCT_STATUS_TRANSITION, CATEGORY_ALREADY_EXISTS, CATEGORY_HAS_DESCENDANTS, CATEGORY_PARENT_INACTIVE, and resource-specific conflict codes | Refresh current state, explain the conflict, or ask the user to choose a different value. |
|         500 | INTERNAL_SERVER_ERROR                                                                                                                                                                                  | Show a generic failure state and retain the request ID for support.                       |
|         503 | DATABASE_ERROR, INFRASTRUCTURE_UNAVAILABLE                                                                                                                                                             | Show temporary unavailability and retry with backoff if the operation is safe.            |

### Optimistic-concurrency errors

When an update DTO supports expectedRowVersion, send the rowVersion returned by the last read:

```json
{
  "name": "Updated product name",
  "expectedRowVersion": 4
}
```

If another user changed the record first, the API returns a version conflict. Reload the record and let the user review the new state before retrying.

---

## 🧴 Products

Products are the main catalog aggregate. A product may contain variants, identifiers, salts, attributes, localized content, media, and regulatory data.

### Product lifecycle

Allowed product statuses are:

```text
draft, review, active, inactive, discontinued, recalled
```

The implementation supports these controlled transitions:

- draft → review, active, inactive
- review → draft, active, inactive
- active → inactive, discontinued, recalled
- inactive → draft, review, active
- discontinued → inactive
- recalled → inactive

Invalid transitions return 409 INVALID_PRODUCT_STATUS_TRANSITION.

### 1. List products

```http
GET /api/v1/products
```

| Item          | Value                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Browse product summaries for storefront/category pages, search results, administration, or product-selection forms. |
| Authorization | ❌ No bearer guard is declared by the current catalog controller.                                                   |
| Request body  | None.                                                                                                               |
| Success       | 200 OK with paginated product summaries.                                                                            |
| Errors        | 400 VALIDATION_ERROR; 503 for database/dependency failure.                                                          |

#### Query parameters

| Field                  | Required | Rules                                                                |
| ---------------------- | -------: | -------------------------------------------------------------------- |
| page                   |       ❌ | Integer ≥ 1. Default 1.                                              |
| pageSize               |       ❌ | Integer 1–100. Default 20.                                           |
| search                 |       ❌ | String, maximum 1000 characters.                                     |
| status                 |       ❌ | draft, review, active, inactive, discontinued, or recalled.          |
| productType            |       ❌ | medicine, otc, device, wellness, lab_test, or service.               |
| categoryId             |       ❌ | Category UUID.                                                       |
| brandId                |       ❌ | Brand UUID.                                                          |
| manufacturerId         |       ❌ | Manufacturer UUID.                                                   |
| dosageFormId           |       ❌ | Dosage-form UUID.                                                    |
| saltId                 |       ❌ | Salt UUID; returns products containing that salt.                    |
| prescriptionRequired   |       ❌ | Boolean.                                                             |
| includeInactive        |       ❌ | Boolean; defaults to false.                                          |
| includeDeleted         |       ❌ | Boolean; defaults to false. Intended for administration/audit views. |
| createdFrom, createdTo |       ❌ | ISO date-time range. createdFrom cannot be after createdTo.          |
| updatedFrom, updatedTo |       ❌ | ISO date-time range. updatedFrom cannot be after updatedTo.          |
| sortBy                 |       ❌ | createdAt, updatedAt, name, sku, status, or productType.             |
| sortOrder              |       ❌ | asc or desc. Default desc.                                           |

#### Example

```http
GET /api/v1/products?page=1&pageSize=20&productType=medicine&saltId=550e8400-e29b-41d4-a716-446655440000&status=active
```

#### Success data

```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "sku": "PARA-500",
      "name": "Paracetamol 500 mg",
      "displayName": "Paracetamol 500 mg Tablet",
      "slug": "paracetamol-500-mg",
      "productType": "medicine",
      "status": "active",
      "brandId": "550e8400-e29b-41d4-a716-446655440001",
      "brandName": "Acme Pharma",
      "manufacturerId": "550e8400-e29b-41d4-a716-446655440002",
      "manufacturerName": "Acme Labs",
      "categoryId": "550e8400-e29b-41d4-a716-446655440003",
      "categoryName": "Pain relief",
      "dosageFormId": "550e8400-e29b-41d4-a716-446655440004",
      "dosageFormName": "Tablet",
      "prescriptionRequired": false,
      "availableQuantity": "0",
      "rowVersion": 1
    }
  ],
  "pagination": { "totalCount": 1, "limit": 20, "offset": 0, "hasNext": false }
}
```

availableQuantity is currently returned as "0" because inventory is outside the catalog boundary.

### 2. Search products

```http
GET /api/v1/products/search?search=paracetamol&exactCodeMatch=false
```

| Item          | Value                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Searches product names, display names, SKU, slug, identifiers, salts, content, brands, manufacturers, and categories. |
| Authorization | ❌ No bearer guard is declared by the current catalog controller.                                                     |
| Request body  | None.                                                                                                                 |
| Success       | 200 OK with the same pagination shape as product listing.                                                             |
| Errors        | 400 VALIDATION_ERROR when search is shorter than 2 characters; 400 SEARCH_TERM_TOO_LONG; 503 for dependency failure.  |

Product search supports all product-list filters plus:

| Field          | Required | Rules                                                                                     |
| -------------- | -------: | ----------------------------------------------------------------------------------------- |
| search         |       ✅ | String with at least 2 characters.                                                        |
| exactCodeMatch |       ❌ | Boolean, default false. When true, checks SKU, slug, and identifier value as exact codes. |

### 3. Get a product by SKU or slug

```http
GET /api/v1/products/by-code/{value}
```

| Item           | Value                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------- |
| Why use it     | Loads the complete product aggregate when the frontend has a product SKU or public slug. |
| Authorization  | ❌ No bearer guard is declared by the current catalog controller.                        |
| Path parameter | value: product SKU or slug string.                                                       |
| Request body   | None.                                                                                    |
| Success        | 200 OK with product aggregate data.                                                      |
| Errors         | 404 PRODUCT_NOT_FOUND; 503 for dependency failure.                                       |

### 4. Create a product

```http
POST /api/v1/products
```

| Item          | Value                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| Why use it    | Creates a product master and optional child collections in one transaction.                              |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution when available.                     |
| Success       | 201 Created.                                                                                             |
| Errors        | 400 VALIDATION_ERROR or BUSINESS_VALIDATION_ERROR; 409 PRODUCT_ALREADY_EXISTS; 503 for database failure. |

#### Request body

```json
{
  "sku": "PARA-500",
  "name": "Paracetamol 500 mg",
  "displayName": "Paracetamol 500 mg Tablet",
  "slug": "paracetamol-500-mg",
  "brandId": "550e8400-e29b-41d4-a716-446655440001",
  "manufacturerId": "550e8400-e29b-41d4-a716-446655440002",
  "categoryId": "550e8400-e29b-41d4-a716-446655440003",
  "productType": "medicine",
  "dosageFormId": "550e8400-e29b-41d4-a716-446655440004",
  "strengthDisplay": "500 mg",
  "packSizeDisplay": "10 tablets",
  "prescriptionRequired": false,
  "isReturnable": true,
  "returnWindowDays": 7,
  "taxCode": "GST5",
  "hsnCode": "300490",
  "status": "draft",
  "searchKeywords": ["fever", "pain relief"],
  "variants": [
    {
      "variantSku": "PARA-500-10",
      "name": "Strip of 10 tablets",
      "strengthDisplay": "500 mg",
      "packQuantity": "10",
      "packUomId": "550e8400-e29b-41d4-a716-446655440005",
      "status": "draft",
      "isDefault": true
    }
  ],
  "identifiers": [
    {
      "identifierType": "gtin",
      "identifierValue": "08901234567890",
      "isPrimary": true
    }
  ],
  "salts": [
    {
      "saltId": "550e8400-e29b-41d4-a716-446655440006",
      "strength": "500 mg",
      "sequence": 1
    }
  ],
  "attributes": [
    {
      "attributeKey": "color",
      "attributeValue": { "value": "white" },
      "isFilterable": true
    }
  ],
  "content": [
    {
      "locale": "en-IN",
      "contentType": "description",
      "title": "About this medicine",
      "body": "Paracetamol tablets for temporary relief of pain and fever.",
      "structuredContent": {}
    }
  ],
  "media": [
    {
      "mediaType": "image",
      "fileObjectId": "550e8400-e29b-41d4-a716-446655440007",
      "altText": "Paracetamol 500 mg pack",
      "displayOrder": 0,
      "isPrimary": true
    }
  ],
  "regulatory": {
    "drugLicenseCategory": "OTC",
    "storageConditions": "Store below 25°C",
    "controlledSubstance": false,
    "requiresColdChain": false,
    "requiresAgeVerification": false,
    "narcoticRegisterRequired": false,
    "regulatoryMetadata": {}
  }
}
```

#### Main product fields

| Field                                             | Required | Rules                                                           |
| ------------------------------------------------- | -------: | --------------------------------------------------------------- |
| sku                                               |       ✅ | String, 1–64 characters; duplicate SKU is rejected.             |
| name                                              |       ✅ | String, 1–255 characters.                                       |
| displayName                                       |       ❌ | String, maximum 255 characters.                                 |
| slug                                              |       ❌ | String, maximum 255 characters; derived from name when omitted. |
| brandId, manufacturerId, categoryId, dosageFormId |       ❌ | UUIDs referencing active catalog records when supplied.         |
| productType                                       |       ✅ | medicine, otc, device, wellness, lab_test, or service.          |
| strengthDisplay, packSizeDisplay                  |       ❌ | Strings, maximum 128 characters.                                |
| prescriptionRequired                              |       ❌ | Boolean, default false.                                         |
| scheduleClass                                     |       ❌ | String, maximum 32 characters.                                  |
| isReturnable                                      |       ❌ | Boolean, default true.                                          |
| returnWindowDays                                  |       ❌ | Integer ≥ 0. Must be empty or 0 when isReturnable=false.        |
| taxCode                                           |       ❌ | String, maximum 64 characters.                                  |
| hsnCode                                           |       ❌ | String, maximum 32 characters.                                  |
| status                                            |       ❌ | Supported product status; default draft.                        |
| searchKeywords                                    |       ❌ | Array of strings, maximum 100 entries.                          |

Child collections have maximum sizes: variants 100, identifiers 50, salts 30, attributes 100, content 50, and media 50. Duplicate variant SKUs, identifier type/value pairs, salt/sequence pairs, attribute keys, or content locale/type pairs are rejected.

Variant-specific identifiers and media require persisted variant IDs and therefore must be added after product variants exist. Product creation accepts product-level identifiers and media.

### 5. Bulk update product status

```http
PATCH /api/v1/products/bulk-status
```

| Item          | Value                                                                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Applies the same valid lifecycle transition to multiple products from an administration screen.                                                       |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution.                                                                                 |
| Success       | 200 OK.                                                                                                                                               |
| Errors        | 400 for invalid status/UUID data; 404 PRODUCT_NOT_FOUND when any product is missing; 409 INVALID_PRODUCT_STATUS_TRANSITION; 503 for database failure. |

```json
{
  "productIds": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"],
  "status": "active"
}
```

productIds requires 1–500 unique UUIDs. The operation is transactional.

### 6. Get a product

```http
GET /api/v1/products/{productId}?includeDeleted=false
```

| Item            | Value                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------- |
| Why use it      | Loads a complete product aggregate for product detail pages, editing forms, or audit views. |
| Authorization   | ❌ No bearer guard is declared by the current catalog controller.                           |
| Path parameter  | productId: product UUID.                                                                    |
| Query parameter | includeDeleted: optional boolean, default false.                                            |
| Success         | 200 OK.                                                                                     |
| Errors          | 400 for malformed UUID; 404 PRODUCT_NOT_FOUND; 503 for dependency failure.                  |

#### Product aggregate shape

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "sku": "PARA-500",
  "name": "Paracetamol 500 mg",
  "productType": "medicine",
  "status": "active",
  "prescriptionRequired": false,
  "rowVersion": 1,
  "variants": [],
  "identifiers": [],
  "salts": [],
  "attributes": [],
  "content": [],
  "media": [],
  "regulatory": null
}
```

Each child item includes persisted IDs and child-specific fields. Identifier items may include variantId; media items may include variantId.

### 7. Update product master data

```http
PATCH /api/v1/products/{productId}
```

| Item          | Value                                                                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Changes product-level fields without replacing variants, identifiers, content, media, or other child collections.                                     |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution.                                                                                 |
| Success       | 200 OK with the complete product aggregate.                                                                                                           |
| Errors        | 400 for invalid data or no fields; 404 PRODUCT_NOT_FOUND; 409 PRODUCT_ALREADY_EXISTS, PRODUCT_VERSION_CONFLICT, or invalid lifecycle transition; 503. |

```json
{
  "displayName": "Paracetamol 500 mg Tablet",
  "prescriptionRequired": false,
  "status": "review",
  "searchKeywords": ["fever", "pain relief"],
  "expectedRowVersion": 1
}
```

All fields are optional, but at least one changeable field must be provided. Supported fields are the product master fields documented for creation, except sku, productType, and child collections.

### 8. Replace product details

```http
PUT /api/v1/products/{productId}/details
```

| Item          | Value                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Replaces one or more complete child collections without changing unrelated product master fields.                                 |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution.                                                             |
| Success       | 200 OK with the complete product aggregate.                                                                                       |
| Errors        | 400 for invalid collections or references; 404 PRODUCT_NOT_FOUND; 409 for duplicate identifiers/SKUs or ownership conflicts; 503. |

```json
{
  "variants": [
    {
      "variantSku": "PARA-500-10",
      "name": "Strip of 10 tablets",
      "packQuantity": "10",
      "status": "active",
      "isDefault": true
    }
  ],
  "identifiers": [
    {
      "variantId": "550e8400-e29b-41d4-a716-446655440010",
      "identifierType": "gtin",
      "identifierValue": "08901234567890",
      "isPrimary": true
    }
  ]
}
```

Only supplied collections are replaced. Omitted collections remain unchanged. Variant-specific identifiers and media must reference an existing variant belonging to this product.

### 9. Deactivate a product

```http
DELETE /api/v1/products/{productId}
```

| Item          | Value                                                                               |
| ------------- | ----------------------------------------------------------------------------------- |
| Why use it    | Removes a product from normal catalogue browsing while preserving database history. |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution.               |
| Success       | 200 OK.                                                                             |
| Errors        | 404 PRODUCT_NOT_FOUND; 503 for database failure.                                    |

```json
{ "message": "The product has been deactivated." }
```

### 10. Reactivate a product

```http
POST /api/v1/products/{productId}/reactivate
```

| Item          | Value                                                                               |
| ------------- | ----------------------------------------------------------------------------------- |
| Why use it    | Restores a soft-deleted product after checking that its SKU and slug remain unique. |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution.               |
| Success       | 200 OK with the product aggregate.                                                  |
| Errors        | 404 PRODUCT_NOT_FOUND; 409 PRODUCT_ALREADY_EXISTS if SKU/slug is now used; 503.     |

---

## 🔗 Product relationships

Relationships are directed links between products. They can represent alternatives, accessories, bundles, related products, or another frontend-defined relationship type up to 32 characters.

### 11. List product relationships

```http
GET /api/v1/products/{productId}/relationships?relationshipType=alternative
```

| Item            | Value                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| Why use it      | Loads related products for recommendation, cross-sell, accessory, or alternative-product components. |
| Authorization   | ❌ No bearer guard is declared by the current catalog controller.                                    |
| Path parameter  | productId: source product UUID.                                                                      |
| Query parameter | relationshipType: optional string, maximum 32 characters.                                            |
| Success         | 200 OK, data.items contains relationships.                                                           |
| Errors          | 404 PRODUCT_NOT_FOUND; 503.                                                                          |

```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "sourceProductId": "550e8400-e29b-41d4-a716-446655440000",
      "targetProductId": "550e8400-e29b-41d4-a716-446655440001",
      "targetSku": "PARA-650",
      "relationshipType": "alternative",
      "priority": 1,
      "metadataJson": {}
    }
  ]
}
```

### 12. Get a product relationship

```http
GET /api/v1/products/{productId}/relationships/{relationshipId}
```

| Item            | Value                                                                 |
| --------------- | --------------------------------------------------------------------- |
| Why use it      | Loads one relationship for an administration edit form or audit view. |
| Authorization   | ❌ No bearer guard is declared by the current catalog controller.     |
| Path parameters | productId: source product UUID; relationshipId: relationship UUID.    |
| Success         | 200 OK.                                                               |
| Errors          | 404 RESOURCE_NOT_FOUND; 503.                                          |

### 13. Create a product relationship

```http
POST /api/v1/products/{productId}/relationships
```

| Item          | Value                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| Why use it    | Creates a directed product link used by related-product experiences.                                         |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution.                                        |
| Success       | 201 Created.                                                                                                 |
| Errors        | 400 for invalid data or self-reference; 404 PRODUCT_NOT_FOUND; 409 PRODUCT_RELATIONSHIP_ALREADY_EXISTS; 503. |

```json
{
  "targetProductId": "550e8400-e29b-41d4-a716-446655440001",
  "relationshipType": "alternative",
  "priority": 1,
  "metadataJson": { "reason": "same active ingredient" }
}
```

targetProductId must be a different existing product. priority is an integer ≥ 0 and defaults to 0. metadataJson defaults to an empty object.

### 14. Update a product relationship

```http
PATCH /api/v1/products/{productId}/relationships/{relationshipId}
```

| Item          | Value                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Changes the target product, relationship type, priority, or metadata.                                               |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution.                                               |
| Success       | 200 OK.                                                                                                             |
| Errors        | 400; 404 RESOURCE_NOT_FOUND; 409 PRODUCT_RELATIONSHIP_ALREADY_EXISTS or PRODUCT_RELATIONSHIP_VERSION_CONFLICT; 503. |

```json
{
  "priority": 2,
  "metadataJson": { "reason": "updated merchandising rule" },
  "expectedRowVersion": 1
}
```

All fields are optional, but at least one changeable field must be supplied.

### 15. Delete a product relationship

```http
DELETE /api/v1/products/{productId}/relationships/{relationshipId}
```

| Item          | Value                                                                              |
| ------------- | ---------------------------------------------------------------------------------- |
| Why use it    | Removes a related-product link from recommendation and merchandising responses.    |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID when audit attribution is required. |
| Success       | 200 OK.                                                                            |
| Errors        | 404 RESOURCE_NOT_FOUND; 503.                                                       |

```json
{ "message": "The product relationship has been removed." }
```

---

## 💊 Substitution groups

Substitution groups connect products that share a configured salt signature, dosage form, and strength signature. They are intended for pharmacy alternative-product workflows and must be governed by the deployment's clinical or pharmacy policy.

### 16. List substitution groups

```http
GET /api/v1/substitution-groups
```

| Item          | Value                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Why use it    | Searches and paginates substitution-group signatures for administration or matching workflows. |
| Authorization | ❌ No bearer guard is declared by the current catalog controller.                              |
| Request body  | None.                                                                                          |
| Success       | 200 OK with pagination.                                                                        |
| Errors        | 400 VALIDATION_ERROR; 503.                                                                     |

Uses common pagination/reference filters plus dosageFormId. Search checks saltSignature and strengthSignature.

### 17. Create a substitution group

```http
POST /api/v1/substitution-groups
```

| Item          | Value                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Why use it    | Creates a unique substitution signature before products are added.    |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution. |
| Success       | 201 Created.                                                          |
| Errors        | 400; 409 SUBSTITUTION_GROUP_ALREADY_EXISTS; 503.                      |

```json
{
  "saltSignature": "paracetamol",
  "dosageFormId": "550e8400-e29b-41d4-a716-446655440004",
  "strengthSignature": "500mg",
  "isActive": true
}
```

saltSignature is required and limited to 512 characters. dosageFormId is optional and must reference an active dosage form. strengthSignature is optional and limited to 255 characters. isActive defaults to true.

### 18. Get a substitution group

```http
GET /api/v1/substitution-groups/{groupId}?includeDeleted=false
```

| Item            | Value                                                             |
| --------------- | ----------------------------------------------------------------- |
| Why use it      | Loads one substitution signature for administration or audit.     |
| Authorization   | ❌ No bearer guard is declared by the current catalog controller. |
| Path parameter  | groupId: substitution-group UUID.                                 |
| Query parameter | includeDeleted: optional boolean, default false.                  |
| Success         | 200 OK.                                                           |
| Errors          | 404 RESOURCE_NOT_FOUND; 503.                                      |

### 19. Update a substitution group

```http
PATCH /api/v1/substitution-groups/{groupId}
```

| Item          | Value                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| Why use it    | Changes a group signature or active state.                                                                      |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution.                                           |
| Success       | 200 OK.                                                                                                         |
| Errors        | 400; 404 RESOURCE_NOT_FOUND; 409 SUBSTITUTION_GROUP_ALREADY_EXISTS or SUBSTITUTION_GROUP_VERSION_CONFLICT; 503. |

```json
{
  "strengthSignature": "500 mg",
  "isActive": true,
  "expectedRowVersion": 1
}
```

All changeable fields are optional, but at least one must be supplied.

### 20. Deactivate a substitution group

```http
DELETE /api/v1/substitution-groups/{groupId}
```

Write operation with optional X-User-ID. Soft-deletes the group and returns:

```json
{ "message": "The substitution group has been deactivated." }
```

### 21. Reactivate a substitution group

```http
POST /api/v1/substitution-groups/{groupId}/reactivate
```

Write operation with optional X-User-ID. Restores a soft-deleted group. Errors are 404 RESOURCE_NOT_FOUND and 503 when applicable.

### 22. List products in a substitution group

```http
GET /api/v1/substitution-groups/{groupId}/products
```

| Item           | Value                                                                |
| -------------- | -------------------------------------------------------------------- |
| Why use it     | Displays or manages products available as alternatives in one group. |
| Authorization  | ❌ No bearer guard is declared by the current catalog controller.    |
| Path parameter | groupId: substitution-group UUID.                                    |
| Success        | 200 OK; data.items contains products ordered by priority.            |
| Errors         | 404 RESOURCE_NOT_FOUND; 503.                                         |

### 23. Add a product to a substitution group

```http
POST /api/v1/substitution-groups/{groupId}/products
```

| Item          | Value                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| Why use it    | Makes a product eligible for alternative-product lookup through the group.                            |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution.                                 |
| Success       | 201 Created.                                                                                          |
| Errors        | 400; 404 PRODUCT_NOT_FOUND or RESOURCE_NOT_FOUND; 409 SUBSTITUTION_GROUP_PRODUCT_ALREADY_EXISTS; 503. |

```json
{
  "productId": "550e8400-e29b-41d4-a716-446655440001",
  "priority": 1
}
```

priority is an integer ≥ 0 and defaults to 0.

### 24. Update substitution-group product priority

```http
PATCH /api/v1/substitution-groups/{groupId}/products/{productId}
```

| Item          | Value                                                                       |
| ------------- | --------------------------------------------------------------------------- |
| Why use it    | Changes the order in which a member product is presented as an alternative. |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution.       |
| Success       | 200 OK.                                                                     |
| Errors        | 400; 404 when membership is missing; 409 on row-version conflict; 503.      |

```json
{
  "priority": 2,
  "expectedRowVersion": 1
}
```

### 25. Remove a product from a substitution group

```http
DELETE /api/v1/substitution-groups/{groupId}/products/{productId}
```

| Item          | Value                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Why use it    | Removes one product membership without deleting the product itself.   |
| Authorization | ⚠️ No bearer guard is declared; send X-User-ID for audit attribution. |
| Success       | 200 OK.                                                               |
| Errors        | 404 when membership is missing; 503.                                  |

```json
{ "message": "The product has been removed from the substitution group." }
```

### 26. List substitution groups for a product

```http
GET /api/v1/products/{productId}/substitution-groups
```

| Item           | Value                                                                               |
| -------------- | ----------------------------------------------------------------------------------- |
| Why use it     | Loads alternative groups for a product detail page or substitute-product component. |
| Authorization  | ❌ No bearer guard is declared by the current catalog controller.                   |
| Path parameter | productId: product UUID.                                                            |
| Success        | 200 OK; data.items contains group signatures and membership priorities.             |
| Errors         | 404 PRODUCT_NOT_FOUND; 503.                                                         |

---

## 🏷️ Reference masters

Reference endpoints provide controlled values used by product forms, catalogue filters, and product detail displays. All six reference resources support the same lifecycle pattern:

```text
GET list → POST create → GET by UUID → PATCH update → DELETE deactivate → POST reactivate
```

### Common reference list query

| Field          | Required | Rules                                          |
| -------------- | -------: | ---------------------------------------------- |
| page           |       ❌ | Integer ≥ 1; default 1.                        |
| pageSize       |       ❌ | Integer 1–100; default 20.                     |
| search         |       ❌ | String, maximum 200 characters.                |
| isActive       |       ❌ | Boolean where the resource has an active flag. |
| includeDeleted |       ❌ | Boolean, default false.                        |
| sortBy         |       ❌ | Resource-supported sort field; default name.   |
| sortOrder      |       ❌ | asc or desc; default asc.                      |

### Brands

#### 27. List brands

```http
GET /api/v1/brands
```

Public read. Use the common reference list query. Returns brand records with id, name, slug, description, logoFileId, ownerOrganizationId, isActive, metadata, timestamps, and rowVersion where available.

#### 28. Create a brand

```http
POST /api/v1/brands
```

Write operation with optional X-User-ID; returns 201 Created.

```json
{
  "name": "Acme Pharma",
  "slug": "acme-pharma",
  "description": "Healthcare product brand",
  "logoFileId": "550e8400-e29b-41d4-a716-446655440000",
  "ownerOrganizationId": "550e8400-e29b-41d4-a716-446655440001",
  "isActive": true
}
```

name is required and limited to 255 characters. slug, logoFileId, and ownerOrganizationId are optional. Duplicate name/slug returns a 409 conflict.

#### 29. Get a brand

```http
GET /api/v1/brands/{entityId}?includeDeleted=false
```

Public read. entityId is the brand UUID. Missing records return 404 RESOURCE_NOT_FOUND.

#### 30. Update a brand

```http
PATCH /api/v1/brands/{entityId}
```

Write operation with optional X-User-ID. At least one editable field is required. Body fields are the optional brand fields from the create example. Returns 200 OK or 400, 404, 409, and 503 as applicable.

#### 31. Deactivate a brand

```http
DELETE /api/v1/brands/{entityId}
```

Write operation; returns:

```json
{ "message": "The brand has been deactivated." }
```

#### 32. Reactivate a brand

```http
POST /api/v1/brands/{entityId}/reactivate
```

Write operation; restores a deleted brand after duplicate checks. Returns 200 OK or 404, 409, and 503.

### Manufacturers

#### 33. List manufacturers

```http
GET /api/v1/manufacturers
```

Public read. Uses the common reference list query and returns manufacturer records.

#### 34. Create a manufacturer

```http
POST /api/v1/manufacturers
```

Write operation with optional X-User-ID; returns 201 Created.

```json
{
  "organizationId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Labs",
  "legalName": "Acme Laboratories Private Limited",
  "licenseNumber": "LIC-001",
  "countryCode": "IN",
  "isActive": true
}
```

name is required; countryCode defaults to IN and must be two letters. Duplicate license/name conflicts return 409.

#### 35. Get a manufacturer

```http
GET /api/v1/manufacturers/{entityId}?includeDeleted=false
```

Public read. entityId is the manufacturer UUID. Missing records return 404 RESOURCE_NOT_FOUND.

#### 36. Update a manufacturer

```http
PATCH /api/v1/manufacturers/{entityId}
```

Write operation with optional X-User-ID. Supports organizationId, name, legalName, licenseNumber, countryCode, and isActive.

#### 37. Deactivate a manufacturer

```http
DELETE /api/v1/manufacturers/{entityId}
```

Write operation; returns { "message": "The manufacturer has been deactivated." }.

#### 38. Reactivate a manufacturer

```http
POST /api/v1/manufacturers/{entityId}/reactivate
```

Write operation; restores a manufacturer after duplicate checks.

### Categories

#### 39. List categories

```http
GET /api/v1/categories
```

Public read. Uses the common reference list query and returns flat category records with hierarchy fields.

#### 40. Get the category tree

```http
GET /api/v1/categories/tree?includeInactive=false
```

| Item            | Value                                                      |
| --------------- | ---------------------------------------------------------- |
| Why use it      | Builds nested catalogue navigation and category selectors. |
| Authorization   | ❌ Not enforced by the current controller.                 |
| Query parameter | includeInactive, optional boolean, default false.          |
| Success         | 200 OK with data.items root nodes and nested children.     |
| Errors          | 503 for database failure.                                  |

```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Pain relief",
      "slug": "pain-relief",
      "path": "pain-relief",
      "level": 0,
      "displayOrder": 0,
      "isActive": true,
      "children": []
    }
  ]
}
```

#### 41. Create a category

```http
POST /api/v1/categories
```

Write operation with optional X-User-ID; returns 201 Created.

```json
{
  "parentId": null,
  "name": "Pain relief",
  "slug": "pain-relief",
  "displayOrder": 0,
  "isActive": true,
  "metadataJson": {}
}
```

name is required. parentId must reference an active category. The service derives path and level.

#### 42. Get a category

```http
GET /api/v1/categories/{entityId}?includeDeleted=false
```

Public read. entityId is the category UUID.

#### 43. Update a category

```http
PATCH /api/v1/categories/{entityId}
```

Write operation with optional X-User-ID. Supports parentId, name, slug, displayOrder, isActive, and metadataJson. The service updates descendant paths when a valid move is requested.

#### 44. Deactivate a category

```http
DELETE /api/v1/categories/{entityId}
```

Write operation. A category with active descendants cannot be deactivated and returns 409 CATEGORY_HAS_DESCENDANTS.

#### 45. Reactivate a category

```http
POST /api/v1/categories/{entityId}/reactivate
```

Write operation. Restoration checks slug uniqueness and requires an active parent when the category has a parent. Parent issues return 409 CATEGORY_PARENT_INACTIVE.

### Salts

#### 46. List salts

```http
GET /api/v1/salts
```

Public read. Uses pagination, search, deletion, and sorting filters. Salt records are used in product composition and substitution matching.

#### 47. Create a salt

```http
POST /api/v1/salts
```

Write operation with optional X-User-ID; returns 201 Created.

```json
{
  "name": "Paracetamol",
  "description": "Analgesic and antipyretic active ingredient",
  "standardCode": "PCM"
}
```

name is required and limited to 255 characters. standardCode is optional and limited to 64 characters.

#### 48. Get a salt

```http
GET /api/v1/salts/{entityId}?includeDeleted=false
```

Public read. entityId is the salt UUID.

#### 49. Update a salt

```http
PATCH /api/v1/salts/{entityId}
```

Write operation with optional X-User-ID. Supports name, description, and standardCode. At least one field is required.

#### 50. Deactivate a salt

```http
DELETE /api/v1/salts/{entityId}
```

Write operation; returns { "message": "The salt has been deactivated." }.

#### 51. Reactivate a salt

```http
POST /api/v1/salts/{entityId}/reactivate
```

Write operation; restores a salt reference.

### Dosage forms

#### 52. List dosage forms

```http
GET /api/v1/dosage-forms
```

Public read. Use isActive=true for active product-form selectors.

#### 53. Create a dosage form

```http
POST /api/v1/dosage-forms
```

Write operation with optional X-User-ID; returns 201 Created.

```json
{
  "code": "TAB",
  "name": "Tablet",
  "routeOfAdministration": "oral",
  "isActive": true
}
```

code and name are required. routeOfAdministration is optional and limited to 64 characters.

#### 54. Get a dosage form

```http
GET /api/v1/dosage-forms/{entityId}?includeDeleted=false
```

Public read. entityId is the dosage-form UUID.

#### 55. Update a dosage form

```http
PATCH /api/v1/dosage-forms/{entityId}
```

Write operation with optional X-User-ID. Supports code, name, routeOfAdministration, and isActive.

#### 56. Deactivate a dosage form

```http
DELETE /api/v1/dosage-forms/{entityId}
```

Write operation; returns { "message": "The dosage form has been deactivated." }.

#### 57. Reactivate a dosage form

```http
POST /api/v1/dosage-forms/{entityId}/reactivate
```

Write operation; restores a dosage-form reference.

### Units of measure

#### 58. List units

```http
GET /api/v1/units
```

Public read. Returns units used by product variant pack quantities.

#### 59. Create a unit

```http
POST /api/v1/units
```

Write operation with optional X-User-ID; returns 201 Created.

```json
{
  "code": "TAB",
  "name": "Tablet",
  "dimension": "count",
  "conversionToBase": "1"
}
```

code, name, and dimension are required. conversionToBase is a numeric string, defaults to "1", and must be greater than zero.

#### 60. Get a unit

```http
GET /api/v1/units/{entityId}?includeDeleted=false
```

Public read. entityId is the unit UUID.

#### 61. Update a unit

```http
PATCH /api/v1/units/{entityId}
```

Write operation with optional X-User-ID. Supports code, name, dimension, and conversionToBase.

#### 62. Deactivate a unit

```http
DELETE /api/v1/units/{entityId}
```

Write operation; returns { "message": "The unit has been deactivated." }.

#### 63. Reactivate a unit

```http
POST /api/v1/units/{entityId}/reactivate
```

Write operation; restores a unit reference.

---

## 🧭 Recommended frontend flows

### Storefront product browsing

1. Load GET /api/v1/categories/tree for navigation.
2. Load GET /api/v1/products with status=active and category/reference filters.
3. Use GET /api/v1/products/search for search-box results; require at least two characters before calling.
4. Use GET /api/v1/products/by-code/{value} or GET /api/v1/products/{productId} for product details.
5. Render product relationships from GET /api/v1/products/{productId}/relationships.
6. Render approved alternative groups from GET /api/v1/products/{productId}/substitution-groups.

### Product authoring

1. Load active brands, manufacturers, categories, salts, dosage forms, and units.
2. Submit POST /api/v1/products with the product master and product-level child collections.
3. Store the returned product ID and rowVersion.
4. Persist variants first when variant-specific identifiers or media are required.
5. Use PUT /api/v1/products/{productId}/details to replace detail collections.
6. Use PATCH /api/v1/products/{productId} for product master changes and send expectedRowVersion.

### Catalogue administration

1. Send X-User-ID with every write so audit fields can identify the acting user.
2. Use includeDeleted=true only for recovery/audit screens.
3. Use lifecycle endpoints for deactivation/reactivation rather than changing deletion fields from the frontend.
4. Handle 409 conflicts by reloading the record and showing the current state.
5. Treat product status transitions as controlled workflow actions, not arbitrary string changes.

### Alternative-product management

1. Create or find a substitution group using its salt, dosage-form, and strength signatures.
2. Add products with POST /api/v1/substitution-groups/{groupId}/products.
3. Set priorities with PATCH /api/v1/substitution-groups/{groupId}/products/{productId}.
4. Read a product's groups from GET /api/v1/products/{productId}/substitution-groups.
5. Do not present a substitution as clinically interchangeable unless the deployment's pharmacy/clinical policy permits it.

---

## 🛠️ Implementation notes

- Catalog is implemented as one NestJS module in the monolithic application. It has no API gateway and no microservice boundary.
- Controllers delegate to feature services, feature services extend the catalog application service, and persistence is behind CatalogRepositoryPort.
- The physical database schema is externally managed. This repository does not create, migrate, or synchronize catalog tables.
- Database row shapes under @platform/database describe the existing catalog schema and are not migration instructions.
- Product summaries intentionally return availableQuantity as "0" until an inventory boundary is connected.
- Pricing and checkout are separate concerns and are not represented by catalog endpoints.
- Deletes are soft-deactivation operations for products and reference masters. Product relationships and substitution-group membership links are removed from their association tables.
- Generated Swagger UI is available at /api/docs when the API application is running. This document is the frontend-readable companion to that generated specification.

> 🛡️ **Security reminder:** Never treat X-User-ID as authentication. Do not log access tokens, authorization headers, personal data, prescription data, or sensitive product-regulatory metadata.
