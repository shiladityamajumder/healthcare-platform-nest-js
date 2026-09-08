# ADR 0002: Feature slices inside bounded contexts

**Status:** Accepted

Large module-level controller/service files become merge-conflict and ownership hotspots. Therefore operations such as login, registration and password reset are independent feature folders/submodules with their own HTTP boundary, application handler and tests.
