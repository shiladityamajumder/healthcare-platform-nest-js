# Execution platform

<p><img src="https://img.shields.io/badge/Platform-Transactions%20%26%20Operations-7C3AED?logo=nestjs&logoColor=white" alt="Execution and transaction platform" /></p>

`ExecutionService` is the application-operation boundary for logging, error classification, deadlines, and PostgreSQL transaction ownership.

## HTTP behavior

`OperationExecutionInterceptor` wraps every HTTP handler in one execution operation. Unless the handler/class has `@NonTransactional()`, it opens one PostgreSQL transaction and passes the work through the shared database transaction context. The operation logs start, completion, expected application rejection, timeout, or unexpected failure. Errors are rethrown for the HTTP exception filter.

Health and metadata endpoints, plus auth capabilities/JWKS discovery, use `@NonTransactional()` because they must remain useful when PostgreSQL is unavailable. All other current API handlers are transactional by default.

## Non-HTTP behavior

Use `ExecutionService.execute()` for workers and application workflows that need the same boundary:

```ts
return this.execution.execute({ operation: 'organizations.create', transactional: true }, (sql) =>
  repository.insert(sql, input),
);
```

Repositories should use the supplied executor or `PostgresDatabase.query()`. Do not create pools, transactions, or logger lifecycles inside feature repositories.

## Timeouts

`timeoutMs` rejects the execution call with `OPERATION_TIMEOUT` and records a timeout event. The current promise wrapper cannot forcibly cancel arbitrary JavaScript work; use timeouts only with operations whose underlying driver/workflow has a coordinated cancellation strategy, and ensure the database operation cannot continue mutating state after the caller has timed out.
