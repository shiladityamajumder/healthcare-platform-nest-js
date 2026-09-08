# Complete generated tree

```text
healthcare-nest-modular-monolith/
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── apps/
│   └── api/
│       ├── src/
│       │   ├── bootstrap/
│       │   │   └── configure-application.ts
│       │   ├── health/
│       │   │   ├── health.controller.ts
│       │   │   └── health.module.ts
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── test/
│       │   ├── e2e/
│       │   │   └── app.e2e-spec.ts
│       │   └── jest-e2e.json
│       └── tsconfig.app.json
├── docs/
│   ├── ADR/
│   │   ├── 0001-modular-monolith.md
│   │   ├── 0002-feature-slices.md
│   │   ├── 0003-module-owned-persistence.md
│   │   └── 0004-cross-module-communication.md
│   ├── ADDING-A-FEATURE.md
│   ├── API-CONVENTIONS.md
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── MODULE-BOUNDARIES.md
│   ├── MODULE-TEMPLATE.md
│   ├── OBSERVABILITY.md
│   ├── SECURITY.md
│   └── TESTING.md
├── libs/
│   ├── modules/
│   │   ├── appointments/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── appointments.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── availability/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── availability.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── availability.request.dto.ts
│   │   │   │   │   │   │           │   └── availability.response.dto.ts
│   │   │   │   │   │   │           └── availability.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── availability.command.ts
│   │   │   │   │   │   │   └── availability.handler.ts
│   │   │   │   │   │   └── availability.module.ts
│   │   │   │   │   ├── book-appointment/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── book-appointment.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── book-appointment.request.dto.ts
│   │   │   │   │   │   │           │   └── book-appointment.response.dto.ts
│   │   │   │   │   │   │           └── book-appointment.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── book-appointment.command.ts
│   │   │   │   │   │   │   └── book-appointment.handler.ts
│   │   │   │   │   │   └── book-appointment.module.ts
│   │   │   │   │   ├── cancel-appointment/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── cancel-appointment.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── cancel-appointment.request.dto.ts
│   │   │   │   │   │   │           │   └── cancel-appointment.response.dto.ts
│   │   │   │   │   │   │           └── cancel-appointment.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── cancel-appointment.command.ts
│   │   │   │   │   │   │   └── cancel-appointment.handler.ts
│   │   │   │   │   │   └── cancel-appointment.module.ts
│   │   │   │   │   └── reschedule-appointment/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── reschedule-appointment.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── reschedule-appointment.request.dto.ts
│   │   │   │   │       │           │   └── reschedule-appointment.response.dto.ts
│   │   │   │   │       │           └── reschedule-appointment.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── reschedule-appointment.command.ts
│   │   │   │   │       │   └── reschedule-appointment.handler.ts
│   │   │   │   │       └── reschedule-appointment.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── appointments.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── audit/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── audit.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── get-audit-entry/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── get-audit-entry.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── get-audit-entry.request.dto.ts
│   │   │   │   │   │   │           │   └── get-audit-entry.response.dto.ts
│   │   │   │   │   │   │           └── get-audit-entry.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── get-audit-entry.command.ts
│   │   │   │   │   │   │   └── get-audit-entry.handler.ts
│   │   │   │   │   │   └── get-audit-entry.module.ts
│   │   │   │   │   └── search-audit-log/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── search-audit-log.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── search-audit-log.request.dto.ts
│   │   │   │   │       │           │   └── search-audit-log.response.dto.ts
│   │   │   │   │       │           └── search-audit-log.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── search-audit-log.command.ts
│   │   │   │   │       │   └── search-audit-log.handler.ts
│   │   │   │   │       └── search-audit-log.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── audit.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── auth/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── auth.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── change-password/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── change-password.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── change-password.request.dto.ts
│   │   │   │   │   │   │           │   └── change-password.response.dto.ts
│   │   │   │   │   │   │           └── change-password.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── change-password.command.ts
│   │   │   │   │   │   │   └── change-password.handler.ts
│   │   │   │   │   │   └── change-password.module.ts
│   │   │   │   │   ├── forgot-password/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── forgot-password.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── forgot-password.request.dto.ts
│   │   │   │   │   │   │           │   └── forgot-password.response.dto.ts
│   │   │   │   │   │   │           └── forgot-password.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── forgot-password.command.ts
│   │   │   │   │   │   │   └── forgot-password.handler.ts
│   │   │   │   │   │   └── forgot-password.module.ts
│   │   │   │   │   ├── login/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── login.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── login.request.dto.ts
│   │   │   │   │   │   │           │   └── login.response.dto.ts
│   │   │   │   │   │   │           └── login.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── login.command.ts
│   │   │   │   │   │   │   └── login.handler.ts
│   │   │   │   │   │   └── login.module.ts
│   │   │   │   │   ├── logout/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── logout.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── logout.request.dto.ts
│   │   │   │   │   │   │           │   └── logout.response.dto.ts
│   │   │   │   │   │   │           └── logout.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── logout.command.ts
│   │   │   │   │   │   │   └── logout.handler.ts
│   │   │   │   │   │   └── logout.module.ts
│   │   │   │   │   ├── mfa/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── mfa.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── mfa.request.dto.ts
│   │   │   │   │   │   │           │   └── mfa.response.dto.ts
│   │   │   │   │   │   │           └── mfa.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── mfa.command.ts
│   │   │   │   │   │   │   └── mfa.handler.ts
│   │   │   │   │   │   └── mfa.module.ts
│   │   │   │   │   ├── refresh-token/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── refresh-token.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── refresh-token.request.dto.ts
│   │   │   │   │   │   │           │   └── refresh-token.response.dto.ts
│   │   │   │   │   │   │           └── refresh-token.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── refresh-token.command.ts
│   │   │   │   │   │   │   └── refresh-token.handler.ts
│   │   │   │   │   │   └── refresh-token.module.ts
│   │   │   │   │   ├── registration/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── registration.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── registration.request.dto.ts
│   │   │   │   │   │   │           │   └── registration.response.dto.ts
│   │   │   │   │   │   │           └── registration.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── registration.command.ts
│   │   │   │   │   │   │   └── registration.handler.ts
│   │   │   │   │   │   └── registration.module.ts
│   │   │   │   │   ├── reset-password/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── reset-password.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── reset-password.request.dto.ts
│   │   │   │   │   │   │           │   └── reset-password.response.dto.ts
│   │   │   │   │   │   │           └── reset-password.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── reset-password.command.ts
│   │   │   │   │   │   │   └── reset-password.handler.ts
│   │   │   │   │   │   └── reset-password.module.ts
│   │   │   │   │   └── verify-email/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── verify-email.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── verify-email.request.dto.ts
│   │   │   │   │       │           │   └── verify-email.response.dto.ts
│   │   │   │   │       │           └── verify-email.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── verify-email.command.ts
│   │   │   │   │       │   └── verify-email.handler.ts
│   │   │   │   │       └── verify-email.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── catalog/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── catalog.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── brands/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── brands.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── brands.request.dto.ts
│   │   │   │   │   │   │           │   └── brands.response.dto.ts
│   │   │   │   │   │   │           └── brands.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── brands.command.ts
│   │   │   │   │   │   │   └── brands.handler.ts
│   │   │   │   │   │   └── brands.module.ts
│   │   │   │   │   ├── categories/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── categories.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── categories.request.dto.ts
│   │   │   │   │   │   │           │   └── categories.response.dto.ts
│   │   │   │   │   │   │           └── categories.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── categories.command.ts
│   │   │   │   │   │   │   └── categories.handler.ts
│   │   │   │   │   │   └── categories.module.ts
│   │   │   │   │   ├── create-product/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── create-product.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── create-product.request.dto.ts
│   │   │   │   │   │   │           │   └── create-product.response.dto.ts
│   │   │   │   │   │   │           └── create-product.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── create-product.command.ts
│   │   │   │   │   │   │   └── create-product.handler.ts
│   │   │   │   │   │   └── create-product.module.ts
│   │   │   │   │   ├── get-product/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── get-product.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── get-product.request.dto.ts
│   │   │   │   │   │   │           │   └── get-product.response.dto.ts
│   │   │   │   │   │   │           └── get-product.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── get-product.command.ts
│   │   │   │   │   │   │   └── get-product.handler.ts
│   │   │   │   │   │   └── get-product.module.ts
│   │   │   │   │   ├── list-products/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── list-products.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── list-products.request.dto.ts
│   │   │   │   │   │   │           │   └── list-products.response.dto.ts
│   │   │   │   │   │   │           └── list-products.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── list-products.command.ts
│   │   │   │   │   │   │   └── list-products.handler.ts
│   │   │   │   │   │   └── list-products.module.ts
│   │   │   │   │   └── update-product/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── update-product.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── update-product.request.dto.ts
│   │   │   │   │       │           │   └── update-product.response.dto.ts
│   │   │   │   │       │           └── update-product.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── update-product.command.ts
│   │   │   │   │       │   └── update-product.handler.ts
│   │   │   │   │       └── update-product.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── catalog.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── file-management/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── file-management.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── complete-upload/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── complete-upload.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── complete-upload.request.dto.ts
│   │   │   │   │   │   │           │   └── complete-upload.response.dto.ts
│   │   │   │   │   │   │           └── complete-upload.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── complete-upload.command.ts
│   │   │   │   │   │   │   └── complete-upload.handler.ts
│   │   │   │   │   │   └── complete-upload.module.ts
│   │   │   │   │   ├── delete-file/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── delete-file.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── delete-file.request.dto.ts
│   │   │   │   │   │   │           │   └── delete-file.response.dto.ts
│   │   │   │   │   │   │           └── delete-file.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── delete-file.command.ts
│   │   │   │   │   │   │   └── delete-file.handler.ts
│   │   │   │   │   │   └── delete-file.module.ts
│   │   │   │   │   ├── generate-download-url/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── generate-download-url.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── generate-download-url.request.dto.ts
│   │   │   │   │   │   │           │   └── generate-download-url.response.dto.ts
│   │   │   │   │   │   │           └── generate-download-url.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── generate-download-url.command.ts
│   │   │   │   │   │   │   └── generate-download-url.handler.ts
│   │   │   │   │   │   └── generate-download-url.module.ts
│   │   │   │   │   ├── get-file/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── get-file.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── get-file.request.dto.ts
│   │   │   │   │   │   │           │   └── get-file.response.dto.ts
│   │   │   │   │   │   │           └── get-file.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── get-file.command.ts
│   │   │   │   │   │   │   └── get-file.handler.ts
│   │   │   │   │   │   └── get-file.module.ts
│   │   │   │   │   └── initiate-upload/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── initiate-upload.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── initiate-upload.request.dto.ts
│   │   │   │   │       │           │   └── initiate-upload.response.dto.ts
│   │   │   │   │       │           └── initiate-upload.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── initiate-upload.command.ts
│   │   │   │   │       │   └── initiate-upload.handler.ts
│   │   │   │   │       └── initiate-upload.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── file-management.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── inventory/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── inventory.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── adjust-stock/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── adjust-stock.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── adjust-stock.request.dto.ts
│   │   │   │   │   │   │           │   └── adjust-stock.response.dto.ts
│   │   │   │   │   │   │           └── adjust-stock.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── adjust-stock.command.ts
│   │   │   │   │   │   │   └── adjust-stock.handler.ts
│   │   │   │   │   │   └── adjust-stock.module.ts
│   │   │   │   │   ├── get-stock/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── get-stock.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── get-stock.request.dto.ts
│   │   │   │   │   │   │           │   └── get-stock.response.dto.ts
│   │   │   │   │   │   │           └── get-stock.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── get-stock.command.ts
│   │   │   │   │   │   │   └── get-stock.handler.ts
│   │   │   │   │   │   └── get-stock.module.ts
│   │   │   │   │   ├── release-reservation/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── release-reservation.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── release-reservation.request.dto.ts
│   │   │   │   │   │   │           │   └── release-reservation.response.dto.ts
│   │   │   │   │   │   │           └── release-reservation.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── release-reservation.command.ts
│   │   │   │   │   │   │   └── release-reservation.handler.ts
│   │   │   │   │   │   └── release-reservation.module.ts
│   │   │   │   │   ├── reserve-stock/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── reserve-stock.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── reserve-stock.request.dto.ts
│   │   │   │   │   │   │           │   └── reserve-stock.response.dto.ts
│   │   │   │   │   │   │           └── reserve-stock.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── reserve-stock.command.ts
│   │   │   │   │   │   │   └── reserve-stock.handler.ts
│   │   │   │   │   │   └── reserve-stock.module.ts
│   │   │   │   │   ├── transfer-stock/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── transfer-stock.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── transfer-stock.request.dto.ts
│   │   │   │   │   │   │           │   └── transfer-stock.response.dto.ts
│   │   │   │   │   │   │           └── transfer-stock.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── transfer-stock.command.ts
│   │   │   │   │   │   │   └── transfer-stock.handler.ts
│   │   │   │   │   │   └── transfer-stock.module.ts
│   │   │   │   │   └── warehouses/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── warehouses.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── warehouses.request.dto.ts
│   │   │   │   │       │           │   └── warehouses.response.dto.ts
│   │   │   │   │       │           └── warehouses.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── warehouses.command.ts
│   │   │   │   │       │   └── warehouses.handler.ts
│   │   │   │   │       └── warehouses.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── inventory.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── notifications/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── notifications.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── delivery-status/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── delivery-status.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── delivery-status.request.dto.ts
│   │   │   │   │   │   │           │   └── delivery-status.response.dto.ts
│   │   │   │   │   │   │           └── delivery-status.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── delivery-status.command.ts
│   │   │   │   │   │   │   └── delivery-status.handler.ts
│   │   │   │   │   │   └── delivery-status.module.ts
│   │   │   │   │   ├── preferences/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── preferences.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── preferences.request.dto.ts
│   │   │   │   │   │   │           │   └── preferences.response.dto.ts
│   │   │   │   │   │   │           └── preferences.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── preferences.command.ts
│   │   │   │   │   │   │   └── preferences.handler.ts
│   │   │   │   │   │   └── preferences.module.ts
│   │   │   │   │   ├── send-notification/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── send-notification.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── send-notification.request.dto.ts
│   │   │   │   │   │   │           │   └── send-notification.response.dto.ts
│   │   │   │   │   │   │           └── send-notification.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── send-notification.command.ts
│   │   │   │   │   │   │   └── send-notification.handler.ts
│   │   │   │   │   │   └── send-notification.module.ts
│   │   │   │   │   └── templates/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── templates.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── templates.request.dto.ts
│   │   │   │   │       │           │   └── templates.response.dto.ts
│   │   │   │   │       │           └── templates.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── templates.command.ts
│   │   │   │   │       │   └── templates.handler.ts
│   │   │   │   │       └── templates.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── notifications.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── orders/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── orders.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── cancel-order/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── cancel-order.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── cancel-order.request.dto.ts
│   │   │   │   │   │   │           │   └── cancel-order.response.dto.ts
│   │   │   │   │   │   │           └── cancel-order.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── cancel-order.command.ts
│   │   │   │   │   │   │   └── cancel-order.handler.ts
│   │   │   │   │   │   └── cancel-order.module.ts
│   │   │   │   │   ├── create-order/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── create-order.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── create-order.request.dto.ts
│   │   │   │   │   │   │           │   └── create-order.response.dto.ts
│   │   │   │   │   │   │           └── create-order.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── create-order.command.ts
│   │   │   │   │   │   │   └── create-order.handler.ts
│   │   │   │   │   │   └── create-order.module.ts
│   │   │   │   │   ├── get-order/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── get-order.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── get-order.request.dto.ts
│   │   │   │   │   │   │           │   └── get-order.response.dto.ts
│   │   │   │   │   │   │           └── get-order.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── get-order.command.ts
│   │   │   │   │   │   │   └── get-order.handler.ts
│   │   │   │   │   │   └── get-order.module.ts
│   │   │   │   │   ├── list-orders/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── list-orders.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── list-orders.request.dto.ts
│   │   │   │   │   │   │           │   └── list-orders.response.dto.ts
│   │   │   │   │   │   │           └── list-orders.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── list-orders.command.ts
│   │   │   │   │   │   │   └── list-orders.handler.ts
│   │   │   │   │   │   └── list-orders.module.ts
│   │   │   │   │   ├── returns/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── returns.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── returns.request.dto.ts
│   │   │   │   │   │   │           │   └── returns.response.dto.ts
│   │   │   │   │   │   │           └── returns.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── returns.command.ts
│   │   │   │   │   │   │   └── returns.handler.ts
│   │   │   │   │   │   └── returns.module.ts
│   │   │   │   │   └── update-status/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── update-status.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── update-status.request.dto.ts
│   │   │   │   │       │           │   └── update-status.response.dto.ts
│   │   │   │   │       │           └── update-status.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── update-status.command.ts
│   │   │   │   │       │   └── update-status.handler.ts
│   │   │   │   │       └── update-status.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── orders.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── organizations/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── organizations.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── create-organization/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── create-organization.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── create-organization.request.dto.ts
│   │   │   │   │   │   │           │   └── create-organization.response.dto.ts
│   │   │   │   │   │   │           └── create-organization.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── create-organization.command.ts
│   │   │   │   │   │   │   └── create-organization.handler.ts
│   │   │   │   │   │   └── create-organization.module.ts
│   │   │   │   │   ├── facilities/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── facilities.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── facilities.request.dto.ts
│   │   │   │   │   │   │           │   └── facilities.response.dto.ts
│   │   │   │   │   │   │           └── facilities.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── facilities.command.ts
│   │   │   │   │   │   │   └── facilities.handler.ts
│   │   │   │   │   │   └── facilities.module.ts
│   │   │   │   │   ├── get-organization/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── get-organization.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── get-organization.request.dto.ts
│   │   │   │   │   │   │           │   └── get-organization.response.dto.ts
│   │   │   │   │   │   │           └── get-organization.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── get-organization.command.ts
│   │   │   │   │   │   │   └── get-organization.handler.ts
│   │   │   │   │   │   └── get-organization.module.ts
│   │   │   │   │   └── update-organization/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── update-organization.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── update-organization.request.dto.ts
│   │   │   │   │       │           │   └── update-organization.response.dto.ts
│   │   │   │   │       │           └── update-organization.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── update-organization.command.ts
│   │   │   │   │       │   └── update-organization.handler.ts
│   │   │   │   │       └── update-organization.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── organizations.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── patients/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── patients.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── addresses/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── addresses.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── addresses.request.dto.ts
│   │   │   │   │   │   │           │   └── addresses.response.dto.ts
│   │   │   │   │   │   │           └── addresses.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── addresses.command.ts
│   │   │   │   │   │   │   └── addresses.handler.ts
│   │   │   │   │   │   └── addresses.module.ts
│   │   │   │   │   ├── consents/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── consents.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── consents.request.dto.ts
│   │   │   │   │   │   │           │   └── consents.response.dto.ts
│   │   │   │   │   │   │           └── consents.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── consents.command.ts
│   │   │   │   │   │   │   └── consents.handler.ts
│   │   │   │   │   │   └── consents.module.ts
│   │   │   │   │   ├── create-profile/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── create-profile.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── create-profile.request.dto.ts
│   │   │   │   │   │   │           │   └── create-profile.response.dto.ts
│   │   │   │   │   │   │           └── create-profile.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── create-profile.command.ts
│   │   │   │   │   │   │   └── create-profile.handler.ts
│   │   │   │   │   │   └── create-profile.module.ts
│   │   │   │   │   ├── get-profile/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── get-profile.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── get-profile.request.dto.ts
│   │   │   │   │   │   │           │   └── get-profile.response.dto.ts
│   │   │   │   │   │   │           └── get-profile.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── get-profile.command.ts
│   │   │   │   │   │   │   └── get-profile.handler.ts
│   │   │   │   │   │   └── get-profile.module.ts
│   │   │   │   │   └── update-profile/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── update-profile.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── update-profile.request.dto.ts
│   │   │   │   │       │           │   └── update-profile.response.dto.ts
│   │   │   │   │       │           └── update-profile.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── update-profile.command.ts
│   │   │   │   │       │   └── update-profile.handler.ts
│   │   │   │   │       └── update-profile.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── patients.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── payments/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── payments.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── capture-payment/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── capture-payment.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── capture-payment.request.dto.ts
│   │   │   │   │   │   │           │   └── capture-payment.response.dto.ts
│   │   │   │   │   │   │           └── capture-payment.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── capture-payment.command.ts
│   │   │   │   │   │   │   └── capture-payment.handler.ts
│   │   │   │   │   │   └── capture-payment.module.ts
│   │   │   │   │   ├── create-payment/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── create-payment.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── create-payment.request.dto.ts
│   │   │   │   │   │   │           │   └── create-payment.response.dto.ts
│   │   │   │   │   │   │           └── create-payment.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── create-payment.command.ts
│   │   │   │   │   │   │   └── create-payment.handler.ts
│   │   │   │   │   │   └── create-payment.module.ts
│   │   │   │   │   ├── refund-payment/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── refund-payment.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── refund-payment.request.dto.ts
│   │   │   │   │   │   │           │   └── refund-payment.response.dto.ts
│   │   │   │   │   │   │           └── refund-payment.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── refund-payment.command.ts
│   │   │   │   │   │   │   └── refund-payment.handler.ts
│   │   │   │   │   │   └── refund-payment.module.ts
│   │   │   │   │   └── webhook/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── webhook.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── webhook.request.dto.ts
│   │   │   │   │       │           │   └── webhook.response.dto.ts
│   │   │   │   │       │           └── webhook.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── webhook.command.ts
│   │   │   │   │       │   └── webhook.handler.ts
│   │   │   │   │       └── webhook.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── payments.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── practitioners/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── practitioners.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── create-profile/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── create-profile.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── create-profile.request.dto.ts
│   │   │   │   │   │   │           │   └── create-profile.response.dto.ts
│   │   │   │   │   │   │           └── create-profile.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── create-profile.command.ts
│   │   │   │   │   │   │   └── create-profile.handler.ts
│   │   │   │   │   │   └── create-profile.module.ts
│   │   │   │   │   ├── get-profile/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── get-profile.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── get-profile.request.dto.ts
│   │   │   │   │   │   │           │   └── get-profile.response.dto.ts
│   │   │   │   │   │   │           └── get-profile.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── get-profile.command.ts
│   │   │   │   │   │   │   └── get-profile.handler.ts
│   │   │   │   │   │   └── get-profile.module.ts
│   │   │   │   │   ├── licenses/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── licenses.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── licenses.request.dto.ts
│   │   │   │   │   │   │           │   └── licenses.response.dto.ts
│   │   │   │   │   │   │           └── licenses.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── licenses.command.ts
│   │   │   │   │   │   │   └── licenses.handler.ts
│   │   │   │   │   │   └── licenses.module.ts
│   │   │   │   │   └── update-profile/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── update-profile.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── update-profile.request.dto.ts
│   │   │   │   │       │           │   └── update-profile.response.dto.ts
│   │   │   │   │       │           └── update-profile.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── update-profile.command.ts
│   │   │   │   │       │   └── update-profile.handler.ts
│   │   │   │   │       └── update-profile.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── practitioners.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── prescriptions/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── prescriptions.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── attach-document/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── attach-document.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── attach-document.request.dto.ts
│   │   │   │   │   │   │           │   └── attach-document.response.dto.ts
│   │   │   │   │   │   │           └── attach-document.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── attach-document.command.ts
│   │   │   │   │   │   │   └── attach-document.handler.ts
│   │   │   │   │   │   └── attach-document.module.ts
│   │   │   │   │   ├── create-prescription/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── create-prescription.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── create-prescription.request.dto.ts
│   │   │   │   │   │   │           │   └── create-prescription.response.dto.ts
│   │   │   │   │   │   │           └── create-prescription.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── create-prescription.command.ts
│   │   │   │   │   │   │   └── create-prescription.handler.ts
│   │   │   │   │   │   └── create-prescription.module.ts
│   │   │   │   │   ├── get-prescription/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── get-prescription.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── get-prescription.request.dto.ts
│   │   │   │   │   │   │           │   └── get-prescription.response.dto.ts
│   │   │   │   │   │   │           └── get-prescription.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── get-prescription.command.ts
│   │   │   │   │   │   │   └── get-prescription.handler.ts
│   │   │   │   │   │   └── get-prescription.module.ts
│   │   │   │   │   └── review-prescription/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── review-prescription.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── review-prescription.request.dto.ts
│   │   │   │   │       │           │   └── review-prescription.response.dto.ts
│   │   │   │   │       │           └── review-prescription.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── review-prescription.command.ts
│   │   │   │   │       │   └── review-prescription.handler.ts
│   │   │   │   │       └── review-prescription.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── prescriptions.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   ├── pricing/
│   │   │   ├── src/
│   │   │   │   ├── contracts/
│   │   │   │   │   └── pricing.facade.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── errors/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── events/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── ports/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── value-objects/
│   │   │   │   │       └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── get-effective-price/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── get-effective-price.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── get-effective-price.request.dto.ts
│   │   │   │   │   │   │           │   └── get-effective-price.response.dto.ts
│   │   │   │   │   │   │           └── get-effective-price.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── get-effective-price.command.ts
│   │   │   │   │   │   │   └── get-effective-price.handler.ts
│   │   │   │   │   │   └── get-effective-price.module.ts
│   │   │   │   │   ├── price-books/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── price-books.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── price-books.request.dto.ts
│   │   │   │   │   │   │           │   └── price-books.response.dto.ts
│   │   │   │   │   │   │           └── price-books.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── price-books.command.ts
│   │   │   │   │   │   │   └── price-books.handler.ts
│   │   │   │   │   │   └── price-books.module.ts
│   │   │   │   │   ├── set-price/
│   │   │   │   │   │   ├── __tests__/
│   │   │   │   │   │   │   └── set-price.handler.spec.ts
│   │   │   │   │   │   ├── api/
│   │   │   │   │   │   │   └── http/
│   │   │   │   │   │   │       └── v1/
│   │   │   │   │   │   │           ├── dto/
│   │   │   │   │   │   │           │   ├── set-price.request.dto.ts
│   │   │   │   │   │   │           │   └── set-price.response.dto.ts
│   │   │   │   │   │   │           └── set-price.controller.ts
│   │   │   │   │   │   ├── application/
│   │   │   │   │   │   │   ├── set-price.command.ts
│   │   │   │   │   │   │   └── set-price.handler.ts
│   │   │   │   │   │   └── set-price.module.ts
│   │   │   │   │   └── tax-rules/
│   │   │   │   │       ├── __tests__/
│   │   │   │   │       │   └── tax-rules.handler.spec.ts
│   │   │   │   │       ├── api/
│   │   │   │   │       │   └── http/
│   │   │   │   │       │       └── v1/
│   │   │   │   │       │           ├── dto/
│   │   │   │   │       │           │   ├── tax-rules.request.dto.ts
│   │   │   │   │       │           │   └── tax-rules.response.dto.ts
│   │   │   │   │       │           └── tax-rules.controller.ts
│   │   │   │   │       ├── application/
│   │   │   │   │       │   ├── tax-rules.command.ts
│   │   │   │   │       │   └── tax-rules.handler.ts
│   │   │   │   │       └── tax-rules.module.ts
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── typeorm/
│   │   │   │   │   │       ├── entities/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       ├── migrations/
│   │   │   │   │   │       │   └── README.md
│   │   │   │   │   │       └── repositories/
│   │   │   │   │   │           └── README.md
│   │   │   │   │   └── providers/
│   │   │   │   │       └── README.md
│   │   │   │   ├── testing/
│   │   │   │   │   ├── factories/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── fakes/
│   │   │   │   │       └── README.md
│   │   │   │   ├── pricing.module.ts
│   │   │   │   └── public-api.ts
│   │   │   └── README.md
│   │   └── user-management/
│   │       ├── src/
│   │       │   ├── contracts/
│   │       │   │   └── user-management.facade.ts
│   │       │   ├── domain/
│   │       │   │   ├── entities/
│   │       │   │   │   └── README.md
│   │       │   │   ├── errors/
│   │       │   │   │   └── README.md
│   │       │   │   ├── events/
│   │       │   │   │   └── README.md
│   │       │   │   ├── ports/
│   │       │   │   │   └── README.md
│   │       │   │   ├── services/
│   │       │   │   │   └── README.md
│   │       │   │   └── value-objects/
│   │       │   │       └── README.md
│   │       │   ├── features/
│   │       │   │   ├── activate-user/
│   │       │   │   │   ├── __tests__/
│   │       │   │   │   │   └── activate-user.handler.spec.ts
│   │       │   │   │   ├── api/
│   │       │   │   │   │   └── http/
│   │       │   │   │   │       └── v1/
│   │       │   │   │   │           ├── dto/
│   │       │   │   │   │           │   ├── activate-user.request.dto.ts
│   │       │   │   │   │           │   └── activate-user.response.dto.ts
│   │       │   │   │   │           └── activate-user.controller.ts
│   │       │   │   │   ├── application/
│   │       │   │   │   │   ├── activate-user.command.ts
│   │       │   │   │   │   └── activate-user.handler.ts
│   │       │   │   │   └── activate-user.module.ts
│   │       │   │   ├── create-user/
│   │       │   │   │   ├── __tests__/
│   │       │   │   │   │   └── create-user.handler.spec.ts
│   │       │   │   │   ├── api/
│   │       │   │   │   │   └── http/
│   │       │   │   │   │       └── v1/
│   │       │   │   │   │           ├── dto/
│   │       │   │   │   │           │   ├── create-user.request.dto.ts
│   │       │   │   │   │           │   └── create-user.response.dto.ts
│   │       │   │   │   │           └── create-user.controller.ts
│   │       │   │   │   ├── application/
│   │       │   │   │   │   ├── create-user.command.ts
│   │       │   │   │   │   └── create-user.handler.ts
│   │       │   │   │   └── create-user.module.ts
│   │       │   │   ├── get-user/
│   │       │   │   │   ├── __tests__/
│   │       │   │   │   │   └── get-user.handler.spec.ts
│   │       │   │   │   ├── api/
│   │       │   │   │   │   └── http/
│   │       │   │   │   │       └── v1/
│   │       │   │   │   │           ├── dto/
│   │       │   │   │   │           │   ├── get-user.request.dto.ts
│   │       │   │   │   │           │   └── get-user.response.dto.ts
│   │       │   │   │   │           └── get-user.controller.ts
│   │       │   │   │   ├── application/
│   │       │   │   │   │   ├── get-user.command.ts
│   │       │   │   │   │   └── get-user.handler.ts
│   │       │   │   │   └── get-user.module.ts
│   │       │   │   ├── list-users/
│   │       │   │   │   ├── __tests__/
│   │       │   │   │   │   └── list-users.handler.spec.ts
│   │       │   │   │   ├── api/
│   │       │   │   │   │   └── http/
│   │       │   │   │   │       └── v1/
│   │       │   │   │   │           ├── dto/
│   │       │   │   │   │           │   ├── list-users.request.dto.ts
│   │       │   │   │   │           │   └── list-users.response.dto.ts
│   │       │   │   │   │           └── list-users.controller.ts
│   │       │   │   │   ├── application/
│   │       │   │   │   │   ├── list-users.command.ts
│   │       │   │   │   │   └── list-users.handler.ts
│   │       │   │   │   └── list-users.module.ts
│   │       │   │   ├── roles/
│   │       │   │   │   ├── __tests__/
│   │       │   │   │   │   └── roles.handler.spec.ts
│   │       │   │   │   ├── api/
│   │       │   │   │   │   └── http/
│   │       │   │   │   │       └── v1/
│   │       │   │   │   │           ├── dto/
│   │       │   │   │   │           │   ├── roles.request.dto.ts
│   │       │   │   │   │           │   └── roles.response.dto.ts
│   │       │   │   │   │           └── roles.controller.ts
│   │       │   │   │   ├── application/
│   │       │   │   │   │   ├── roles.command.ts
│   │       │   │   │   │   └── roles.handler.ts
│   │       │   │   │   └── roles.module.ts
│   │       │   │   └── update-user/
│   │       │   │       ├── __tests__/
│   │       │   │       │   └── update-user.handler.spec.ts
│   │       │   │       ├── api/
│   │       │   │       │   └── http/
│   │       │   │       │       └── v1/
│   │       │   │       │           ├── dto/
│   │       │   │       │           │   ├── update-user.request.dto.ts
│   │       │   │       │           │   └── update-user.response.dto.ts
│   │       │   │       │           └── update-user.controller.ts
│   │       │   │       ├── application/
│   │       │   │       │   ├── update-user.command.ts
│   │       │   │       │   └── update-user.handler.ts
│   │       │   │       └── update-user.module.ts
│   │       │   ├── infrastructure/
│   │       │   │   ├── persistence/
│   │       │   │   │   └── typeorm/
│   │       │   │   │       ├── entities/
│   │       │   │   │       │   └── README.md
│   │       │   │   │       ├── migrations/
│   │       │   │   │       │   └── README.md
│   │       │   │   │       └── repositories/
│   │       │   │   │           └── README.md
│   │       │   │   └── providers/
│   │       │   │       └── README.md
│   │       │   ├── testing/
│   │       │   │   ├── factories/
│   │       │   │   │   └── README.md
│   │       │   │   └── fakes/
│   │       │   │       └── README.md
│   │       │   ├── public-api.ts
│   │       │   └── user-management.module.ts
│   │       └── README.md
│   ├── platform/
│   │   ├── cache/
│   │   │   ├── src/
│   │   │   │   ├── cache.module.ts
│   │   │   │   └── index.ts
│   │   │   └── README.md
│   │   ├── config/
│   │   │   └── src/
│   │   │       ├── index.ts
│   │   │       └── platform-config.module.ts
│   │   ├── database/
│   │   │   └── src/
│   │   │       ├── migrations/
│   │   │       │   └── README.md
│   │   │       ├── transaction/
│   │   │       │   ├── transaction-manager.ts
│   │   │       │   └── typeorm-transaction-manager.ts
│   │   │       ├── database.module.ts
│   │   │       └── index.ts
│   │   ├── http/
│   │   │   └── src/
│   │   │       ├── context/
│   │   │       │   └── README.md
│   │   │       ├── errors/
│   │   │       │   ├── api-exception.filter.ts
│   │   │       │   └── application-error.ts
│   │   │       ├── response/
│   │   │       │   ├── api-response.interceptor.ts
│   │   │       │   └── api-response.ts
│   │   │       ├── http-kernel.module.ts
│   │   │       └── index.ts
│   │   ├── logging/
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   └── logging.module.ts
│   │   │   └── README.md
│   │   ├── messaging/
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   └── messaging.module.ts
│   │   │   └── README.md
│   │   ├── observability/
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   └── observability.module.ts
│   │   │   └── README.md
│   │   └── security/
│   │       ├── src/
│   │       │   ├── index.ts
│   │       │   └── security.module.ts
│   │       └── README.md
│   └── shared-kernel/
│       ├── src/
│       │   ├── application/
│       │   │   └── page.ts
│       │   ├── contracts/
│       │   │   └── integration-event.ts
│       │   └── domain/
│       │       ├── domain-event.ts
│       │       └── entity.ts
│       └── README.md
├── tools/
│   └── architecture/
│       └── check-boundaries.mjs
├── .dockerignore
├── .env.example
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── pnpm-workspace.yaml
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```
