# Request context

<p><img src="https://img.shields.io/badge/Platform-HTTP%20Context-000000?logo=fastify&logoColor=white" alt="HTTP request context platform" /></p>

The HTTP platform stores request metadata in `AsyncLocalStorage` so services, repositories, logs, and response builders do not depend on Fastify request objects.

`RequestContext` currently carries `requestId`, `correlationId`, optional W3C `traceId`, optional `taskId`, and normalized `apiVersion`. `RequestContextMiddleware` accepts valid `X-Request-ID`, `X-Correlation-ID`, and `traceparent` headers or generates safe defaults, returns request/correlation/API-version response headers, and emits structured completion logs with route, status, duration, and a hashed client IP.

Use `getRequestContext()`, `getRequestId()`, `getCorrelationId()`, `getTraceId()`, `getTaskId()`, and `getApiVersion()` through the HTTP public boundary. Do not store request or tenant state in module singletons; authenticated actor and organization context can be added to this technical context when the corresponding application contract is implemented.
