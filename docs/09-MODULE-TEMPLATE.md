# 📘 Bounded-context template

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="72" alt="NestJS logo" />
</p>

<p align="center">
  <img src="../assets/readme/healthcare-platform-banner.png" alt="Abstract healthcare platform backend architecture banner" width="100%" />
</p>

Use this shape for a new business context. Do not create every directory up front; add a directory when the context has a real responsibility for it.

This is the command/handler-oriented scaffold used by most unimplemented
contexts. The implemented auth context uses a flatter variant; see
`libs/modules/auth/README.md` for its controller/service/schema/repository shape.

```text
libs/modules/<context>/
├── README.md
└── src/
    ├── <context>.module.ts
    ├── public-api.ts
    ├── contracts/
    ├── domain/
    │   ├── entities/
    │   ├── value-objects/
    │   ├── services/
    │   ├── events/
    │   ├── errors/
    │   └── ports/
    ├── features/
    │   └── <feature>/
    │       ├── <feature>.module.ts
    │       ├── api/http/v1/
    │       │   ├── <feature>.controller.ts
    │       │   └── dto/
    │       ├── application/
    │       │   ├── <feature>.command.ts
    │       │   └── <feature>.handler.ts
    │       └── __tests__/
    ├── infrastructure/
    │   ├── persistence/postgres/
    │   │   ├── queries/
    │   │   └── repositories/
    │   └── providers/
    └── testing/
        ├── factories/
        └── fakes/
```

## 🔹 Rules for the template

- `public-api.ts` is the only cross-context import target.
- `contracts/` contains narrow facades or versioned integration contracts, not an export-everything barrel.
- `domain/` contains business rules, not NestJS controllers or persistence decorators where avoidable.
- `application/` coordinates a use case through ports.
- `infrastructure/` implements technical adapters and owns persistence details.
- Feature tests should prove behavior without requiring a running HTTP server.
- Add a context README with scope, owned data, public contracts, feature inventory, and known limitations.
