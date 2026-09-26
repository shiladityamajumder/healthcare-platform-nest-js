# 📘 Adding a feature

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="72" alt="NestJS logo" />
</p>

<p align="center">
  <img src="../assets/readme/healthcare-platform-banner.png" alt="Abstract healthcare platform backend architecture banner" width="100%" />
</p>

Use a vertical feature slice for a new workflow. The goal is to keep the transport contract, orchestration, tests, and module wiring close enough that ownership is obvious.

## 🔹 Workflow

1. Identify the owning bounded context. If ownership is unclear, resolve that before creating a folder.
2. Check the context's `README.md`, `public-api.ts`, and existing feature patterns.
3. Create a feature directory under `libs/modules/<context>/src/features/<feature>`.
4. Add the HTTP controller and schemas/DTOs only if the workflow is externally exposed.
5. Add the application service, or the command/query and handler used by the context's established pattern.
6. Depend on ports or contracts from the application layer; keep SQL/provider code in infrastructure.
7. Register the feature module in the bounded-context module.
8. Add focused unit tests, then integration or e2e coverage when the workflow crosses real boundaries.
9. Update the context README, API documentation, and an ADR when the change alters a durable architectural decision.
10. Run the full verification commands before review.

## 🔹 Expected scaffold shape

```text
libs/modules/<context>/src/features/<feature>/
├── <feature>.module.ts
├── api/http/v1/
│   ├── <feature>.controller.ts
│   └── dto/
│       ├── <feature>.request.dto.ts
│       └── <feature>.response.dto.ts
├── application/
│   ├── <feature>.command.ts
│   └── <feature>.handler.ts
└── __tests__/
    └── <feature>.handler.spec.ts
```

Add domain objects under the context's `domain` directory only when a rule is shared by multiple features or deserves an explicit domain model. Keep provider-specific code under `infrastructure`.

For auth, keep the feature flat and colocated:

```text
libs/modules/auth/src/features/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.schema.ts
├── <feature>.service.ts
└── <feature>.repository.ts   # when the feature owns persistence
```

Use `libs/modules/auth/README.md` as the source of truth for auth feature
ownership and its application/infrastructure collaborators.

## 🔹 Cross-context needs

If another bounded context needs a result immediately, add the smallest useful operation to the owning context's public facade. If it only needs to react, publish a versioned integration event. Never export a handler or import another context's private implementation.

## 🔹 Definition of done

- Input is validated and output follows the context's public response contract.
- Business rules are covered independently of NestJS and PostgreSQL where practical.
- Authorization, idempotency, audit, and sensitive-data handling are explicit where relevant.
- Database changes are coordinated with the external schema owner and retain constraints for race-sensitive invariants.
- Public contract and operational impact are documented.
- `pnpm check` passes.
