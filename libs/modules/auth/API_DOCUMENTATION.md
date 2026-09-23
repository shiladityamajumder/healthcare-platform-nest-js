# 🔐 Authentication API Documentation

> **Module:** libs/modules/auth  
> **API style:** REST/JSON  
> **Audience:** Web, Android, and iOS frontend developers  
> **Scope:** Customer/staff authentication, sessions, password management, and RBAC. Doctor appointments are outside this module.

This document describes every HTTP endpoint exposed by the authentication module, including when to use it, authorization requirements, request data, successful responses, and expected error cases.

## 📚 Contents

- [🚀 Quick start](#-quick-start)
- [📐 API conventions](#-api-conventions)
- [🔑 Authentication and token lifecycle](#-authentication-and-token-lifecycle)
- [📦 Response format](#-response-format)
- [⚠️ Error handling](#-error-handling)
- [🌐 Public discovery](#-public-discovery)
- [🧾 Registration and verification](#-registration-and-verification)
- [🔓 Login](#-login)
- [💾 Session management](#-session-management)
- [👤 Current user](#-current-user)
- [🔒 Password management](#-password-management)
- [🛡️ Administration and RBAC](#️-administration-and-rbac)
- [🧭 Recommended frontend flows](#-recommended-frontend-flows)

---

## 🚀 Quick start

### Base URL

The application uses the global /api prefix and URI version v1:

```text
{API_ORIGIN}/api/v1
```

Examples:

```text
POST https://api.example.com/api/v1/auth/login/password
GET  https://api.example.com/api/v1/users/me
```

### Minimal password-login request

```http
POST /api/v1/auth/login/password
Content-Type: application/json
X-Device-Id: web-browser-01
X-Device-Type: web
```

```json
{
  "channel": "email",
  "email": "user@example.com",
  "password": "SecurePass#123"
}
```

On success, store the returned access token and refresh token using secure platform storage. Use the access token for protected requests:

```http
Authorization: Bearer <access-token>
```

---

## 📐 API conventions

### HTTP and content rules

| Rule           | Description                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content type   | Send JSON requests with Content-Type: application/json.                                                                                              |
| IDs            | Resource IDs are UUID v4 values.                                                                                                                     |
| Dates          | Use ISO-8601 date-time strings, for example 2026-01-01T00:00:00.000Z.                                                                                |
| OTP            | OTP values are six numeric characters, for example 123456.                                                                                           |
| Email          | Email addresses are normalized by the API before lookup.                                                                                             |
| Phone          | Send country code and phone number separately; do not include the country code again in phoneNumber.                                                 |
| Password       | Passwords must satisfy the configured password policy. The capabilities endpoint exposes the active minimum length and character-class requirements. |
| Unknown fields | Send only documented fields.                                                                                                                         |

### Common request headers

| Header           |                 Required | Used for                               | Example                        |
| ---------------- | -----------------------: | -------------------------------------- | ------------------------------ |
| Authorization    | Protected endpoints only | Bearer access token                    | Bearer eyJhbGciOiJIUzI1NiIs... |
| Content-Type     |       JSON body requests | Request body format                    | application/json               |
| X-Request-ID     |                 Optional | Client-generated request/support ID    | checkout-auth-001              |
| X-Correlation-ID |                 Optional | Correlates related frontend operations | login-flow-2026-01             |
| X-Device-Id      |                 Optional | Stable device/session tracking ID      | android-pixel-8a-01            |
| X-Device-Type    |                 Optional | Session platform                       | android, ios, or web           |

X-Device-Id and X-Device-Type are most useful when creating or replacing a session. They do not replace the bearer token.

### Common response headers

Successful and error responses may include:

| Header           | Meaning                                                         |
| ---------------- | --------------------------------------------------------------- |
| X-Request-ID     | Request identifier for logs and customer support.               |
| X-Correlation-ID | Correlation identifier supplied or generated for the operation. |
| X-API-Version    | API version that processed the request, normally v1.            |

---

## 🔑 Authentication and token lifecycle

### Token types

| Token                | Use                                               |                      Send to API? | Storage guidance                                                        |
| -------------------- | ------------------------------------------------- | --------------------------------: | ----------------------------------------------------------------------- |
| Access token         | Authorizes protected API calls.                   | Yes, as Authorization: Bearer ... | Keep short-lived and protected from JavaScript exposure where possible. |
| Refresh token        | Obtains a replacement access/refresh pair.        |      In the refresh request body. | Store only in secure platform storage. Never log it.                    |
| Password reset token | Allows one password reset after OTP verification. |     Only to /auth/password/reset. | Keep transient; it is not an access token.                              |

### Refresh-token rotation

Every successful refresh rotates the refresh token. Replace the stored refresh token immediately. Reusing an already-rotated token may revoke the session and return AUTH_REFRESH_TOKEN_REUSE.

### Protected-request rule

Protected endpoints validate:

1. The bearer access-token signature and claims.
2. The server-side session represented by the token.

An access token can become invalid before its displayed expiry time if the session is logged out, revoked, or disabled by an administrator.

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

### Error response

```json
{
  "success": false,
  "message": "The verification code has expired.",
  "data": null,
  "error": {
    "code": "AUTH_OTP_EXPIRED",
    "details": null
  },
  "meta": {
    "requestId": "request-id",
    "correlationId": "correlation-id",
    "apiVersion": "v1",
    "timestamp": "2026-01-01T00:05:00.000Z"
  }
}
```

Use error.code for frontend decisions. Human-readable message text may change and must not be used as a stable programmatic identifier.

---

## ⚠️ Error handling

### Common HTTP statuses and codes

| HTTP status | Error codes                                                                                                                                                                              | Frontend action                                                                                    |
| ----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
|         400 | VALIDATION_ERROR, HTTP_ERROR                                                                                                                                                             | Show field-level correction guidance and do not retry unchanged input.                             |
|         401 | AUTHENTICATION_REQUIRED, AUTH_INVALID_CREDENTIALS, AUTH_OTP_INVALID, AUTH_OTP_EXPIRED, AUTH_OTP_ATTEMPTS_EXCEEDED, AUTH_OTP_ALREADY_USED, AUTH_SESSION_REVOKED, AUTH_REFRESH_TOKEN_REUSE | Re-authenticate, request a new OTP, or restart the relevant flow.                                  |
|         403 | PERMISSION_DENIED                                                                                                                                                                        | Hide/disable the staff action and show an access-denied state. Do not retry automatically.         |
|         404 | RESOURCE_NOT_FOUND                                                                                                                                                                       | Refresh the resource list or show that the selected resource no longer exists.                     |
|         409 | RESOURCE_CONFLICT                                                                                                                                                                        | Explain that the current state conflicts with the request, such as an already registered identity. |
|         408 | OPERATION_TIMEOUT                                                                                                                                                                        | Offer a retry after confirming the operation is safe to repeat.                                    |
|         500 | INTERNAL_SERVER_ERROR                                                                                                                                                                    | Show a generic failure state and provide the request ID to support.                                |
|         503 | DATABASE_ERROR, EXTERNAL_SERVICE_ERROR, EXTERNAL_SERVICE_TIMEOUT, INFRASTRUCTURE_ERROR, INFRASTRUCTURE_UNAVAILABLE                                                                       | Show temporary unavailability and retry with backoff.                                              |

### OTP-specific behavior

- OTPs are single-use and expire.
- Failed attempts are counted and challenges can become blocked.
- Resend and attempt limits are controlled by server configuration.
- OTP delivery is provider-neutral in the current implementation. The API builds SMS/email message payloads, but actual provider dispatch is not implemented yet.
- developmentOtp may be present only when OTP_DEV_EXPOSE_CODE=true; never build production UI around that field.

---

## 🌐 Public discovery

These endpoints do not require authentication and are safe to call before rendering login or registration screens.

### 1. Get authentication capabilities

```http
GET /api/v1/auth/capabilities
```

| Item          | Value                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| Why use it    | Determine which login, registration, verification, password, and platform options the frontend should display. |
| Authorization | ❌ Not required                                                                                                |
| Request body  | None                                                                                                           |
| Success       | 200 OK                                                                                                         |
| Errors        | 503 if discovery dependencies are unavailable.                                                                 |

#### Success data

```json
{
  "schema": "auth-capabilities",
  "registration": { "emailEnabled": true, "phoneEnabled": true },
  "login": { "passwordEnabled": true, "phoneOtpEnabled": true },
  "verification": { "emailRequired": true, "phoneRequired": true },
  "passwordPolicy": { "minimumLength": 8, "minimumCharacterClasses": 3 },
  "supportedPlatforms": ["android", "ios", "web"]
}
```

### 2. Get signing-key metadata

```http
GET /api/v1/auth/.well-known/jwks.json
```

| Item          | Value                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Discover public signing keys when a client or trusted integration needs to verify RS256-signed tokens.                                               |
| Authorization | ❌ Not required                                                                                                                                      |
| Request body  | None                                                                                                                                                 |
| Success       | 200 OK                                                                                                                                               |
| Errors        | 404 RESOURCE_NOT_FOUND when public JWKS is unavailable because the server is not configured with a public-key algorithm; 503 for dependency failure. |

#### Success data

```json
{
  "keys": [{ "kty": "RSA", "kid": "auth-key-1", "use": "sig", "alg": "RS256" }]
}
```

---

## 🧾 Registration and verification

### 3. Register with email

```http
POST /api/v1/auth/register/email
```

| Item          | Value                                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Create a customer account using an email address and password.                                                         |
| Authorization | ❌ Not required                                                                                                        |
| Success       | 201 Created                                                                                                            |
| Headers       | Optional client, correlation, and device headers.                                                                      |
| Errors        | 400 VALIDATION_ERROR; 409 RESOURCE_CONFLICT if the email is registered; 503 for database or registration-role failure. |

#### Request body

```json
{
  "email": "user@example.com",
  "password": "SecurePass#123",
  "firstName": "Aarav",
  "lastName": "Sharma",
  "preferredName": "Aarav",
  "preferredLocale": "en-IN",
  "timezone": "Asia/Kolkata",
  "termsVersion": "2026-01",
  "privacyVersion": "2026-01"
}
```

| Field                              | Required | Rules                                                                                    |
| ---------------------------------- | -------: | ---------------------------------------------------------------------------------------- |
| email                              |       ✅ | Valid email address.                                                                     |
| password                           |       ✅ | String, 1–128 characters at DTO level; must also satisfy the configured password policy. |
| firstName, lastName, preferredName |       ❌ | String, 1–100 characters.                                                                |
| preferredLocale                    |       ❌ | String, 2–16 characters.                                                                 |
| timezone                           |       ❌ | String, 3–64 characters; use an IANA timezone.                                           |
| termsVersion, privacyVersion       |       ❌ | String, maximum 32 characters.                                                           |

#### Success data

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "emailVerified": false
  },
  "verificationRequired": true,
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-01-01T00:05:00.000Z",
  "developmentOtp": null,
  "tokens": null
}
```

When verificationRequired is true, call email verification next. If it is false, tokens contains the initial session token pair.

### 4. Request phone-registration OTP

```http
POST /api/v1/auth/register/phone/request-otp
```

| Item          | Value                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| Why use it    | Start phone ownership verification before creating a phone-based account.                                     |
| Authorization | ❌ Not required                                                                                               |
| Success       | 201 Created                                                                                                   |
| Errors        | 400 VALIDATION_ERROR; 409 RESOURCE_CONFLICT if the phone is already registered; 503 for OTP/database failure. |

#### Request body

```json
{
  "phoneCountryCode": "+91",
  "phoneNumber": "9876543210"
}
```

#### Success data

```json
{
  "accepted": true,
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-01-01T00:05:00.000Z",
  "retryAfterSeconds": 60,
  "developmentOtp": null
}
```

Save challengeId. It is required by the next endpoint.

### 5. Complete phone registration

```http
POST /api/v1/auth/register/phone/verify-otp
```

| Item          | Value                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Verify the phone OTP, create the account, and issue the first session.                                                                          |
| Authorization | ❌ Not required                                                                                                                                 |
| Success       | 201 Created                                                                                                                                     |
| Headers       | Optional X-Device-Id, X-Device-Type, request, and correlation headers.                                                                          |
| Errors        | 400 VALIDATION_ERROR; 401 AUTH_OTP_INVALID, AUTH_OTP_EXPIRED, AUTH_OTP_ATTEMPTS_EXCEEDED, or AUTH_OTP_ALREADY_USED; 409 RESOURCE_CONFLICT; 503. |

#### Request body

```json
{
  "phoneCountryCode": "+91",
  "phoneNumber": "9876543210",
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "code": "123456",
  "password": "SecurePass#123",
  "firstName": "Aarav",
  "lastName": "Sharma",
  "preferredName": "Aarav",
  "preferredLocale": "en-IN",
  "timezone": "Asia/Kolkata",
  "termsVersion": "2026-01",
  "privacyVersion": "2026-01"
}
```

phoneCountryCode, phoneNumber, challengeId, and code are required. password and profile/policy fields are optional.

#### Success data

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "accessExpiresAt": "2026-01-01T01:00:00.000Z",
  "refreshExpiresAt": "2026-02-01T00:00:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phoneNumberMasked": "+91******10"
  }
}
```

### 6. Request email verification

```http
POST /api/v1/auth/email-verification/request
```

| Item          | Value                                                                   |
| ------------- | ----------------------------------------------------------------------- |
| Why use it    | Send or resend an email verification challenge for an existing account. |
| Authorization | ❌ Not required                                                         |
| Success       | 201 Created                                                             |
| Errors        | 400 VALIDATION_ERROR; 503 for OTP/database/provider failure.            |

#### Request body

```json
{ "email": "user@example.com" }
```

#### Success data

```json
{
  "accepted": true,
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-01-01T00:05:00.000Z",
  "retryAfterSeconds": 60,
  "developmentOtp": null
}
```

### 7. Verify email

```http
POST /api/v1/auth/email-verification/verify
```

| Item          | Value                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------- |
| Why use it    | Confirm email ownership, activate the account, and issue a session.                          |
| Authorization | ❌ Not required                                                                              |
| Success       | 201 Created                                                                                  |
| Headers       | Optional device, request, and correlation headers.                                           |
| Errors        | 400 VALIDATION_ERROR; 401 AUTHENTICATION_REQUIRED or OTP-specific authentication codes; 503. |

#### Request body

```json
{
  "email": "user@example.com",
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "code": "123456"
}
```

#### Success data

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "accessExpiresAt": "2026-01-01T01:00:00.000Z",
  "refreshExpiresAt": "2026-02-01T00:00:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "emailVerified": true
  }
}
```

---

## 🔓 Login

### 8. Login with password

```http
POST /api/v1/auth/login/password
```

| Item          | Value                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Why use it    | Authenticate an existing account using either email/password or phone/password.                                            |
| Authorization | ❌ Not required                                                                                                            |
| Success       | 201 Created                                                                                                                |
| Headers       | Optional device, request, and correlation headers.                                                                         |
| Errors        | 400 VALIDATION_ERROR; 401 AUTH_INVALID_CREDENTIALS or AUTHENTICATION_REQUIRED when the account is unavailable/locked; 503. |

#### Email login body

```json
{
  "channel": "email",
  "email": "user@example.com",
  "password": "SecurePass#123"
}
```

#### Phone login body

```json
{
  "channel": "phone",
  "phoneCountryCode": "+91",
  "phoneNumber": "9876543210",
  "password": "SecurePass#123"
}
```

channel is required. When it is email, email is required. When it is phone, both phone fields are required.

#### Success data

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "accessExpiresAt": "2026-01-01T01:00:00.000Z",
  "refreshExpiresAt": "2026-02-01T00:00:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

### 9. Request phone-login OTP

```http
POST /api/v1/auth/login/phone/request-otp
```

| Item          | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| Why use it    | Start passwordless phone login for an existing account.      |
| Authorization | ❌ Not required                                              |
| Success       | 201 Created                                                  |
| Errors        | 400 VALIDATION_ERROR; 503 for OTP/database/provider failure. |

#### Request body

```json
{
  "phoneCountryCode": "+91",
  "phoneNumber": "9876543210"
}
```

#### Success data

```json
{
  "accepted": true,
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-01-01T00:05:00.000Z",
  "retryAfterSeconds": 60,
  "developmentOtp": null
}
```

### 10. Verify phone-login OTP

```http
POST /api/v1/auth/login/phone/verify-otp
```

| Item          | Value                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------- |
| Why use it    | Verify the phone challenge and create a passwordless session.                                 |
| Authorization | ❌ Not required                                                                               |
| Success       | 201 Created                                                                                   |
| Headers       | Optional device, request, and correlation headers.                                            |
| Errors        | 400 VALIDATION_ERROR; 401 AUTH_INVALID_CREDENTIALS or OTP-specific authentication codes; 503. |

#### Request body

```json
{
  "phoneCountryCode": "+91",
  "phoneNumber": "9876543210",
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "code": "123456"
}
```

#### Success data

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "accessExpiresAt": "2026-01-01T01:00:00.000Z",
  "refreshExpiresAt": "2026-02-01T00:00:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phoneNumberMasked": "+91******10"
  }
}
```

---

## 💾 Session management

### 11. Refresh access and refresh tokens

```http
POST /api/v1/auth/token/refresh
```

| Item          | Value                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| Why use it    | Obtain a new access token when the current access token expires without showing the login screen again.    |
| Authorization | ❌ Bearer token not required; refresh token is required in the body.                                       |
| Success       | 201 Created                                                                                                |
| Headers       | Optional device, request, and correlation headers.                                                         |
| Errors        | 400 VALIDATION_ERROR; 401 AUTHENTICATION_REQUIRED, AUTH_SESSION_REVOKED, or AUTH_REFRESH_TOKEN_REUSE; 503. |

#### Request body

```json
{ "refreshToken": "eyJhbGciOiJIUzI1NiIs..." }
```

#### Success data

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "accessExpiresAt": "2026-01-01T01:00:00.000Z",
  "refreshExpiresAt": "2026-02-01T00:00:00.000Z",
  "user": { "id": "550e8400-e29b-41d4-a716-446655440000" }
}
```

### 12. Logout the current refresh session

```http
POST /api/v1/auth/logout
```

| Item          | Value                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Why use it    | Revoke the session represented by a refresh token, including when an access token is unavailable. |
| Authorization | ❌ Bearer token not required.                                                                     |
| Success       | 201 Created                                                                                       |
| Errors        | 400 VALIDATION_ERROR; 401 for an invalid refresh token; 503.                                      |

#### Request body

```json
{ "refreshToken": "eyJhbGciOiJIUzI1NiIs..." }
```

#### Success data

```json
{ "message": "The session has been logged out." }
```

### 13. Logout other sessions

```http
POST /api/v1/auth/logout/others
```

| Item          | Value                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------- |
| Why use it    | Sign out every active session except the session represented by the current access token. |
| Authorization | ✅ Required                                                                               |
| Request body  | None                                                                                      |
| Success       | 201 Created                                                                               |
| Errors        | 401 AUTHENTICATION_REQUIRED; 503.                                                         |

#### Success data

```json
{ "message": "All other sessions have been logged out." }
```

### 14. Logout all sessions

```http
POST /api/v1/auth/logout/all
```

| Item          | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| Why use it    | Sign out every active session for the authenticated account. |
| Authorization | ✅ Required                                                  |
| Request body  | None                                                         |
| Success       | 201 Created                                                  |
| Errors        | 401 AUTHENTICATION_REQUIRED; 503.                            |

#### Success data

```json
{ "message": "All sessions have been logged out." }
```

### 15. List active sessions

```http
GET /api/v1/auth/sessions
```

| Item          | Value                                                               |
| ------------- | ------------------------------------------------------------------- |
| Why use it    | Show the user's logged-in devices and identify the current session. |
| Authorization | ✅ Required                                                         |
| Request body  | None                                                                |
| Success       | 200 OK                                                              |
| Errors        | 401 AUTHENTICATION_REQUIRED; 503.                                   |

#### Success data

```json
{
  "sessions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "deviceId": "android-pixel-8a-01",
      "deviceType": "android",
      "ipAddress": "203.0.113.10",
      "userAgent": "Mobile App",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "lastSeenAt": "2026-01-01T00:01:00.000Z",
      "expiresAt": "2026-02-01T00:00:00.000Z",
      "current": true
    }
  ]
}
```

### 16. Revoke one session

```http
DELETE /api/v1/auth/sessions/{sessionId}
```

| Item           | Value                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------- |
| Why use it     | Revoke one selected device/session from the active-session list.                                   |
| Authorization  | ✅ Required                                                                                        |
| Path parameter | sessionId: UUID of a session belonging to the current user.                                        |
| Success        | 200 OK                                                                                             |
| Errors         | 400 VALIDATION_ERROR for malformed UUID; 401 AUTHENTICATION_REQUIRED; 404 RESOURCE_NOT_FOUND; 503. |

#### Success data

```json
{ "message": "The session has been revoked." }
```

---

## 👤 Current user

### 17. Get current user

```http
GET /api/v1/users/me
```

| Item          | Value                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Why use it    | Hydrate the signed-in user's profile and verification state after app startup or token refresh. |
| Authorization | ✅ Required                                                                                     |
| Request body  | None                                                                                            |
| Success       | 200 OK                                                                                          |
| Errors        | 401 AUTHENTICATION_REQUIRED; 503.                                                               |

#### Success data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "emailVerified": true,
  "phoneCountryCode": "+91",
  "phoneNumberMasked": "+91******10",
  "phoneVerified": true,
  "status": "active",
  "preferredLocale": "en-IN",
  "timezone": "Asia/Kolkata",
  "displayName": "Aarav Sharma",
  "profile": {
    "firstName": "Aarav",
    "lastName": "Sharma",
    "preferredName": "Aarav",
    "avatar": null
  }
}
```

### 18. Update current user

```http
PATCH /api/v1/users/me
```

| Item          | Value                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Why use it    | Update editable profile names, locale, timezone, or avatar reference. |
| Authorization | ✅ Required                                                           |
| Success       | 200 OK                                                                |
| Errors        | 400 VALIDATION_ERROR; 401 AUTHENTICATION_REQUIRED; 503.               |

#### Request body

All fields are optional, but send at least one field to make a meaningful update:

```json
{
  "preferredLocale": "en-IN",
  "timezone": "Asia/Kolkata",
  "firstName": "Aarav",
  "lastName": "Sharma",
  "preferredName": "Aarav",
  "avatarFileId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Email, phone number, verification state, roles, and permissions cannot be changed here.

#### Success data

Returns the updated current-user object in the same shape as GET /users/me.

### 19. Get current-user authorization

```http
GET /api/v1/auth/users/me/authorization
```

| Item          | Value                                                                        |
| ------------- | ---------------------------------------------------------------------------- |
| Why use it    | Decide which staff/admin UI actions can be displayed for the signed-in user. |
| Authorization | ✅ Required                                                                  |
| Request body  | None                                                                         |
| Success       | 200 OK                                                                       |
| Errors        | 401 AUTHENTICATION_REQUIRED; 503.                                            |

#### Success data

```json
{
  "roles": ["clinic_admin"],
  "permissions": ["user.read", "user.update"]
}
```

The frontend may use this for presentation, but the backend remains the final authorization authority.

---

## 🔒 Password management

### 20. Start password recovery

```http
POST /api/v1/auth/password/forgot
```

| Item              | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Why use it        | Start recovery through email or SMS when the user does not know the password.          |
| Authorization     | ❌ Not required                                                                        |
| Success           | 201 Created                                                                            |
| Security behavior | The response is intentionally neutral and should not reveal whether an account exists. |
| Errors            | 400 VALIDATION_ERROR; 503.                                                             |

#### Email request body

```json
{
  "channel": "email",
  "email": "user@example.com"
}
```

#### SMS request body

```json
{
  "channel": "sms",
  "phoneCountryCode": "+91",
  "phoneNumber": "9876543210"
}
```

#### Success data

```json
{
  "accepted": true,
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-01-01T00:05:00.000Z",
  "retryAfterSeconds": 60,
  "developmentOtp": null
}
```

### 21. Verify password-recovery OTP

```http
POST /api/v1/auth/password/reset/verify-otp
```

| Item          | Value                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Why use it    | Verify the recovery challenge before allowing a new password.                                                            |
| Authorization | ❌ Not required                                                                                                          |
| Success       | 201 Created                                                                                                              |
| Errors        | 400 VALIDATION_ERROR; 401 AUTH_OTP_INVALID, AUTH_OTP_EXPIRED, AUTH_OTP_ATTEMPTS_EXCEEDED, or AUTH_OTP_ALREADY_USED; 503. |

#### Email request body

```json
{
  "channel": "email",
  "email": "user@example.com",
  "challengeId": "550e8400-e29b-41d4-a716-446655440000",
  "code": "123456"
}
```

For SMS, replace email with phoneCountryCode and phoneNumber, and keep channel, challengeId, and code.

#### Success data

```json
{
  "resetToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2026-01-01T00:15:00.000Z"
}
```

### 22. Reset password

```http
POST /api/v1/auth/password/reset
```

| Item          | Value                                                                                 |
| ------------- | ------------------------------------------------------------------------------------- |
| Why use it    | Set a new password using the short-lived reset token returned after OTP verification. |
| Authorization | ❌ Bearer token not required; reset token is required in the body.                    |
| Success       | 201 Created                                                                           |
| Headers       | Optional device, request, and correlation headers.                                    |
| Errors        | 400 VALIDATION_ERROR; 401 for invalid/expired reset proof; 503.                       |

#### Request body

```json
{
  "resetToken": "eyJhbGciOiJIUzI1NiIs...",
  "newPassword": "NewSecurePass#123"
}
```

#### Success data

Returns a new access/refresh token pair. Existing sessions are revoked.

### 23. Change current password

```http
PUT /api/v1/auth/password
```

| Item          | Value                                                                               |
| ------------- | ----------------------------------------------------------------------------------- |
| Why use it    | Change the password while the user is already authenticated.                        |
| Authorization | ✅ Required                                                                         |
| Success       | 200 OK                                                                              |
| Headers       | Optional device, request, and correlation headers.                                  |
| Errors        | 400 VALIDATION_ERROR; 401 AUTHENTICATION_REQUIRED or AUTH_INVALID_CREDENTIALS; 503. |

#### Request body

```json
{
  "currentPassword": "CurrentPass#123",
  "newPassword": "NewSecurePass#123"
}
```

#### Success data

Returns a new access/refresh token pair. Other existing sessions are revoked, so replace the stored pair.

### 24. Set an initial password

```http
POST /api/v1/auth/password
```

| Item          | Value                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| Why use it    | Set a password for an authenticated account created without one, such as phone OTP registration.            |
| Authorization | ✅ Required                                                                                                 |
| Success       | 201 Created                                                                                                 |
| Errors        | 400 VALIDATION_ERROR; 401 AUTHENTICATION_REQUIRED; 409 RESOURCE_CONFLICT if a password already exists; 503. |

#### Request body

```json
{ "newPassword": "SecurePass#123" }
```

#### Success data

Returns a new access/refresh token pair. Existing sessions are revoked.

---

## 🛡️ Administration and RBAC

All administration endpoints require:

1. A valid bearer access token.
2. An active server-side session.
3. The specific permission listed below.

The standard admin error cases are 401 AUTHENTICATION_REQUIRED, 403 PERMISSION_DENIED, 404 RESOURCE_NOT_FOUND, 409 RESOURCE_CONFLICT, 400 VALIDATION_ERROR, 500 INTERNAL_SERVER_ERROR, and 503 dependency errors.

### User administration

#### 25. List users

```http
GET /api/v1/admin/users?limit=20&offset=0&search=user%40example.com&status=active
```

| Item                | Value                                                                    |
| ------------------- | ------------------------------------------------------------------------ |
| Why use it          | Populate an internal user-management screen with pagination and filters. |
| Authorization       | ✅ Required                                                              |
| Required permission | identity.users.read                                                      |
| Success             | 200 OK                                                                   |
| Errors              | 400 VALIDATION_ERROR; 401; 403 PERMISSION_DENIED; 503.                   |

#### Query parameters

| Parameter | Required | Rules                                          | Default |
| --------- | -------: | ---------------------------------------------- | ------: |
| limit     |       ❌ | Integer 1–100.                                 |      20 |
| offset    |       ❌ | Integer 0–100000.                              |       0 |
| search    |       ❌ | String 2–320 characters.                       |       — |
| status    |       ❌ | pending, active, locked, suspended, or closed. |       — |

#### Success data

```json
{
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "user@example.com",
        "status": "active",
        "roles": ["clinic_admin"],
        "permissions": ["user.read"]
      }
    ]
  },
  "pagination": {
    "totalCount": 1,
    "limit": 20,
    "offset": 0,
    "hasNext": false
  }
}
```

The current service returns data and pagination inside the endpoint result; the outer API response envelope still wraps this result under its own data property.

#### 26. Get one user

```http
GET /api/v1/admin/users/{userId}
```

| Item                | Value                                                               |
| ------------------- | ------------------------------------------------------------------- |
| Why use it          | View one user's identity, lifecycle status, roles, and permissions. |
| Authorization       | ✅ Required                                                         |
| Required permission | identity.users.read                                                 |
| Path parameter      | userId: UUID of the target user.                                    |
| Success             | 200 OK                                                              |
| Errors              | 400 malformed UUID; 401; 403; 404 RESOURCE_NOT_FOUND; 503.          |

#### Success data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "status": "active",
  "roles": ["clinic_admin"],
  "permissions": ["user.read"]
}
```

#### 27. Change user status

```http
PATCH /api/v1/admin/users/{userId}/status
```

| Item                | Value                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| Why use it          | Activate, lock, suspend, or close an account from an authorized administration screen.                   |
| Authorization       | ✅ Required                                                                                              |
| Required permission | identity.users.manage                                                                                    |
| Success             | 200 OK                                                                                                   |
| Errors              | 400; 401; 403; 404; 409 RESOURCE_CONFLICT when an administrator tries to disable their own account; 503. |

#### Request body

```json
{
  "status": "suspended",
  "reason": "Repeated failed login attempts.",
  "revokeSessions": true
}
```

| Field          | Required | Rules                                                    |
| -------------- | -------: | -------------------------------------------------------- |
| status         |       ✅ | pending, active, locked, suspended, or closed.           |
| reason         |       ✅ | String, 3–255 characters; retain as an auditable reason. |
| revokeSessions |       ❌ | Boolean; defaults to true.                               |

#### Success data

Returns the updated user with resolved roles and permissions.

#### 28. Log out a user everywhere

```http
POST /api/v1/admin/users/{userId}/logout-all
```

| Item                | Value                                                                        |
| ------------------- | ---------------------------------------------------------------------------- |
| Why use it          | Revoke all sessions for a target user during support or security operations. |
| Authorization       | ✅ Required                                                                  |
| Required permission | identity.users.manage                                                        |
| Path parameter      | userId: UUID.                                                                |
| Success             | 201 Created                                                                  |
| Errors              | 400; 401; 403; 404; 503.                                                     |

#### Request body

```json
{ "reason": "Security incident response" }
```

#### Success data

```json
{ "message": "All user sessions have been revoked." }
```

#### 29. List user role assignments

```http
GET /api/v1/admin/users/{userId}/roles
```

| Item                | Value                                                                         |
| ------------------- | ----------------------------------------------------------------------------- |
| Why use it          | Display role assignments before assigning, editing, or removing staff access. |
| Authorization       | ✅ Required                                                                   |
| Required permission | identity.user_roles.read                                                      |
| Path parameter      | userId: UUID.                                                                 |
| Success             | 200 OK                                                                        |
| Errors              | 400; 401; 403; 404; 503.                                                      |

#### Success data

```json
{
  "assignments": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "roleId": "550e8400-e29b-41d4-a716-446655440000",
      "scopeType": "clinic",
      "scopeId": "550e8400-e29b-41d4-a716-446655440000",
      "isActive": true
    }
  ]
}
```

#### 30. Assign a role to a user

```http
POST /api/v1/admin/users/{userId}/roles
```

| Item                | Value                                                                                |
| ------------------- | ------------------------------------------------------------------------------------ |
| Why use it          | Grant a role to a user, optionally limited to a clinic/resource and validity window. |
| Authorization       | ✅ Required                                                                          |
| Required permission | identity.user_roles.manage                                                           |
| Path parameter      | userId: UUID.                                                                        |
| Success             | 201 Created                                                                          |
| Errors              | 400; 401; 403; 404 for missing user/role; 409 for a conflicting assignment; 503.     |

#### Request body

```json
{
  "roleId": "550e8400-e29b-41d4-a716-446655440000",
  "scopeType": "clinic",
  "scopeId": "550e8400-e29b-41d4-a716-446655440000",
  "validFrom": "2026-01-01T00:00:00.000Z",
  "validUntil": "2026-12-31T23:59:59.000Z",
  "isActive": true
}
```

roleId is required. scopeType and scopeId must be supplied together. validUntil must be later than validFrom.

#### Success data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "roleId": "550e8400-e29b-41d4-a716-446655440000",
  "isActive": true
}
```

#### 31. Update a user-role assignment

```http
PATCH /api/v1/admin/users/{userId}/roles/{userRoleId}
```

| Item                | Value                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Why use it          | Change an assignment's scope, validity, or active state without replacing the role definition.             |
| Authorization       | ✅ Required                                                                                                |
| Required permission | identity.user_roles.manage                                                                                 |
| Path parameters     | userId and userRoleId, both UUIDs.                                                                         |
| Success             | 200 OK                                                                                                     |
| Errors              | 400 for malformed/invalid fields, missing paired scope fields, or invalid date window; 401; 403; 404; 503. |

#### Request body

```json
{
  "scopeType": "clinic",
  "scopeId": "550e8400-e29b-41d4-a716-446655440000",
  "validFrom": "2026-01-01T00:00:00.000Z",
  "validUntil": "2026-12-31T23:59:59.000Z",
  "isActive": false
}
```

Send at least one field. scopeType and scopeId must be supplied together.

#### 32. Remove a user-role assignment

```http
DELETE /api/v1/admin/users/{userId}/roles/{userRoleId}
```

| Item                | Value                                       |
| ------------------- | ------------------------------------------- |
| Why use it          | Withdraw one role assignment from one user. |
| Authorization       | ✅ Required                                 |
| Required permission | identity.user_roles.manage                  |
| Path parameters     | userId and userRoleId, both UUIDs.          |
| Success             | 200 OK                                      |
| Errors              | 400; 401; 403; 404; 503.                    |

#### Success data

```json
{ "message": "The role assignment has been removed." }
```

### Role administration

#### 33. List roles

```http
GET /api/v1/admin/roles
```

| Item                | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| Why use it          | Load the role catalogue for staff access-management screens. |
| Authorization       | ✅ Required                                                  |
| Required permission | identity.roles.read                                          |
| Success             | 200 OK                                                       |
| Errors              | 401; 403; 503.                                               |

#### Success data

```json
{
  "roles": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "clinic_admin",
      "name": "Clinic Administrator",
      "description": "Manages clinic users."
    }
  ]
}
```

#### 34. Create a role

```http
POST /api/v1/admin/roles
```

| Item                | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Why use it          | Add a role definition that can later be assigned to users.         |
| Authorization       | ✅ Required                                                        |
| Required permission | identity.roles.manage                                              |
| Success             | 201 Created                                                        |
| Errors              | 400; 401; 403; 409 RESOURCE_CONFLICT for duplicate role code; 503. |

#### Request body

```json
{
  "code": "clinic_manager",
  "name": "Clinic Manager",
  "description": "Manages clinic operations."
}
```

code must start with a lowercase letter and contain only lowercase letters, numbers, underscore, period, or hyphen; maximum 64 characters.

#### Success data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "clinic_manager",
  "name": "Clinic Manager"
}
```

#### 35. Get a role

```http
GET /api/v1/admin/roles/{roleId}
```

| Item                | Value                                                   |
| ------------------- | ------------------------------------------------------- |
| Why use it          | Load one role before editing or reviewing its metadata. |
| Authorization       | ✅ Required                                             |
| Required permission | identity.roles.read                                     |
| Path parameter      | roleId: UUID.                                           |
| Success             | 200 OK                                                  |
| Errors              | 400; 401; 403; 404; 503.                                |

#### Success data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "clinic_admin",
  "name": "Clinic Administrator",
  "description": "Manages clinic users."
}
```

#### 36. Update a role

```http
PATCH /api/v1/admin/roles/{roleId}
```

| Item                | Value                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| Why use it          | Update role name, code, or description. Permission membership is managed separately.                         |
| Authorization       | ✅ Required                                                                                                  |
| Required permission | identity.roles.manage                                                                                        |
| Path parameter      | roleId: UUID.                                                                                                |
| Success             | 200 OK                                                                                                       |
| Errors              | 400 when no field is supplied or fields are invalid; 401; 403; 404; 409 for duplicate/system role code; 503. |

#### Request body

```json
{
  "code": "clinic_manager",
  "name": "Clinic Manager",
  "description": "Manages clinic operations."
}
```

All fields are optional, but at least one field must be supplied.

#### 37. Delete a role

```http
DELETE /api/v1/admin/roles/{roleId}
```

| Item                | Value                                                |
| ------------------- | ---------------------------------------------------- |
| Why use it          | Remove a role definition that is no longer required. |
| Authorization       | ✅ Required                                          |
| Required permission | identity.roles.manage                                |
| Path parameter      | roleId: UUID.                                        |
| Success             | 200 OK                                               |
| Errors              | 400; 401; 403; 404 if missing/protected; 503.        |

#### Success data

```json
{ "message": "The role has been deleted." }
```

#### 38. List role permissions

```http
GET /api/v1/admin/roles/{roleId}/permissions
```

| Item                | Value                                                 |
| ------------------- | ----------------------------------------------------- |
| Why use it          | Display the permissions currently assigned to a role. |
| Authorization       | ✅ Required                                           |
| Required permission | identity.permissions.read                             |
| Path parameter      | roleId: UUID.                                         |
| Success             | 200 OK                                                |
| Errors              | 400; 401; 403; 404; 503.                              |

#### Success data

```json
{
  "roleId": "550e8400-e29b-41d4-a716-446655440000",
  "permissions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "user.read",
      "resource": "user",
      "action": "read"
    }
  ]
}
```

#### 39. Replace role permissions

```http
PUT /api/v1/admin/roles/{roleId}/permissions
```

| Item                | Value                                                                 |
| ------------------- | --------------------------------------------------------------------- |
| Why use it          | Replace the complete permission set for a role in one operation.      |
| Authorization       | ✅ Required                                                           |
| Required permission | identity.permissions.manage                                           |
| Path parameter      | roleId: UUID.                                                         |
| Success             | 200 OK                                                                |
| Errors              | 400 for duplicate/missing/deleted permission IDs; 401; 403; 404; 503. |

#### Request body

```json
{
  "permissionIds": ["550e8400-e29b-41d4-a716-446655440000"]
}
```

permissionIds may be an empty array to remove all permissions. IDs must be unique UUID v4 values.

#### Success data

```json
{
  "roleId": "550e8400-e29b-41d4-a716-446655440000",
  "permissions": [{ "id": "550e8400-e29b-41d4-a716-446655440000", "code": "user.read" }]
}
```

### Permission administration

#### 40. List permissions

```http
GET /api/v1/admin/permissions
```

| Item                | Value                                                   |
| ------------------- | ------------------------------------------------------- |
| Why use it          | Load available permissions for role-management screens. |
| Authorization       | ✅ Required                                             |
| Required permission | identity.permissions.read                               |
| Success             | 200 OK                                                  |
| Errors              | 401; 403; 503.                                          |

#### Success data

```json
{
  "permissions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "user.read",
      "resource": "user",
      "action": "read",
      "description": "View user details."
    }
  ]
}
```

#### 41. Create a permission

```http
POST /api/v1/admin/permissions
```

| Item                | Value                                                                    |
| ------------------- | ------------------------------------------------------------------------ |
| Why use it          | Add a permission that can be attached to one or more roles.              |
| Authorization       | ✅ Required                                                              |
| Required permission | identity.permissions.manage                                              |
| Success             | 201 Created                                                              |
| Errors              | 400; 401; 403; 409 RESOURCE_CONFLICT for duplicate permission code; 503. |

#### Request body

```json
{
  "code": "user.read",
  "resource": "user",
  "action": "read",
  "description": "View user details."
}
```

| Field       | Required | Rules                                                                                                              |
| ----------- | -------: | ------------------------------------------------------------------------------------------------------------------ |
| code        |       ✅ | Lowercase stable code; may contain letters, numbers, underscore, period, colon, or hyphen; maximum 128 characters. |
| resource    |       ✅ | Lowercase resource identifier; maximum 64 characters.                                                              |
| action      |       ✅ | Lowercase action identifier; maximum 64 characters.                                                                |
| description |       ❌ | String, maximum 2000 characters.                                                                                   |

#### Success data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "user.read",
  "resource": "user",
  "action": "read"
}
```

#### 42. Get a permission

```http
GET /api/v1/admin/permissions/{permissionId}
```

| Item                | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| Why use it          | Load one permission for administration or audit display. |
| Authorization       | ✅ Required                                              |
| Required permission | identity.permissions.read                                |
| Path parameter      | permissionId: UUID.                                      |
| Success             | 200 OK                                                   |
| Errors              | 400; 401; 403; 404; 503.                                 |

#### Success data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "user.read",
  "resource": "user",
  "action": "read",
  "description": "View user details."
}
```

#### 43. Update a permission

```http
PATCH /api/v1/admin/permissions/{permissionId}
```

| Item                | Value                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Why use it          | Update permission metadata or its stable code. Code changes can affect authorization checks.     |
| Authorization       | ✅ Required                                                                                      |
| Required permission | identity.permissions.manage                                                                      |
| Path parameter      | permissionId: UUID.                                                                              |
| Success             | 200 OK                                                                                           |
| Errors              | 400 when no field is supplied or a field is invalid; 401; 403; 404; 409 for duplicate code; 503. |

#### Request body

```json
{
  "code": "user.update",
  "resource": "user",
  "action": "update",
  "description": "Update user details."
}
```

All fields are optional, but at least one field must be supplied.

#### 44. Delete a permission

```http
DELETE /api/v1/admin/permissions/{permissionId}
```

| Item                | Value                                                 |
| ------------------- | ----------------------------------------------------- |
| Why use it          | Remove a permission from the authorization catalogue. |
| Authorization       | ✅ Required                                           |
| Required permission | identity.permissions.manage                           |
| Path parameter      | permissionId: UUID.                                   |
| Success             | 200 OK                                                |
| Errors              | 400; 401; 403; 404; 503.                              |

#### Success data

```json
{ "message": "The permission has been deleted." }
```

---

## 🧭 Recommended frontend flows

### New customer with email

1. GET /auth/capabilities to decide whether email registration is enabled.
2. POST /auth/register/email.
3. If verificationRequired is true, show the verification screen.
4. POST /auth/email-verification/verify with the saved challengeId and OTP.
5. Store the returned token pair.
6. GET /users/me to hydrate the account state.

### New customer with phone OTP

1. POST /auth/register/phone/request-otp.
2. Save the returned challengeId in temporary client state.
3. POST /auth/register/phone/verify-otp.
4. Store the returned token pair.
5. If the user did not configure a password, optionally call POST /auth/password later while authenticated.

### Existing customer login

Choose one:

- Password: POST /auth/login/password.
- Phone OTP: POST /auth/login/phone/request-otp, then POST /auth/login/phone/verify-otp.

### Access-token expiry

1. Retry the protected request only after checking whether the access token is expired.
2. Call POST /auth/token/refresh once with the current refresh token.
3. Replace both stored tokens with the returned pair.
4. Retry the original request once.
5. If refresh returns an authentication error, clear local auth state and show login.

Use a single refresh queue in the frontend so multiple simultaneous 401 responses do not send concurrent refresh requests with the same rotating refresh token.

### Forgot password

1. POST /auth/password/forgot using email or SMS.
2. Show a neutral “If the account exists, a code was sent” message.
3. Save challengeId temporarily.
4. POST /auth/password/reset/verify-otp.
5. Save the short-lived resetToken only in memory.
6. POST /auth/password/reset with resetToken and newPassword.
7. Replace local tokens with the returned session pair.

### Admin/staff authorization

1. Call GET /auth/users/me/authorization after login and token refresh.
2. Use roles/permissions to control visible UI actions.
3. Still handle 403 PERMISSION_DENIED because permissions can change after the UI is loaded.
4. For a staff user-management screen, use the admin endpoints only with the exact required permission.

---

## 🛠️ Implementation notes

- Auth uses JWT access and refresh tokens plus server-side sessions.
- Passwords are hashed with Argon2.
- OTP values are stored as hashes, expire, track attempts, and are single-use.
- Registration assigns the configured default role; that role must exist in the identity data.
- Database-backed routes require the external PostgreSQL identity/RBAC schema and master data.
- The current module creates provider-neutral email/SMS notification payloads. Actual SMS/email provider dispatch remains a deployment/integration task.
- Generated Swagger UI is available at /api/docs when the API application is running. This document is the frontend-readable companion to that generated specification.

> 🔐 **Security reminder:** Never log passwords, OTPs, access tokens, refresh tokens, reset tokens, or authorization headers. Redact them from analytics, error reporting, and network debug logs.
