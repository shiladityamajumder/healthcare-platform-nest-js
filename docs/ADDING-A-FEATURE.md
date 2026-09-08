# Adding a feature

Example: add `auth/unlock-account`.

```text
libs/modules/auth/src/features/unlock-account/
├── unlock-account.module.ts
├── api/http/v1/
│   ├── unlock-account.controller.ts
│   └── dto/
│       ├── unlock-account.request.dto.ts
│       └── unlock-account.response.dto.ts
├── application/
│   ├── unlock-account.command.ts
│   └── unlock-account.handler.ts
└── __tests__/
    └── unlock-account.handler.spec.ts
```

Only add shared domain pieces to `auth/src/domain` when multiple Auth features truly share the rule. Put provider-specific code in `auth/src/infrastructure`.

If another bounded context needs a result from this feature, expose a narrow method on the Auth public facade instead of exporting the handler directly.
