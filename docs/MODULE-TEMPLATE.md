# Bounded-context template

```text
libs/modules/<context>/
├── README.md
└── src/
    ├── <context>.module.ts             # composition only
    ├── public-api.ts                   # ONLY cross-context import target
    ├── contracts/                      # narrow facade/events exposed externally
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
    │       │   ├── <feature>.command|query.ts
    │       │   └── <feature>.handler.ts
    │       └── __tests__/
    ├── infrastructure/
    │   ├── persistence/typeorm/
    │   │   ├── entities/
    │   │   ├── repositories/
    │   │   └── migrations/
    │   └── providers/
    └── testing/
        ├── factories/
        └── fakes/
```
