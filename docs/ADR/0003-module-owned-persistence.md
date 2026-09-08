# ADR 0003: Module-owned persistence

**Status:** Accepted

The DB connection/pool is shared, but ORM entities and repositories remain private to their owning bounded context. This prevents a central model folder from becoming a coupling and merge-conflict hotspot.
