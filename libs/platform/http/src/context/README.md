# Request context

Put request-id, correlation-id, authenticated actor, tenant/organization, locale, and trace identifiers here. Implement with AsyncLocalStorage so application/domain code does not depend on HTTP request objects.
