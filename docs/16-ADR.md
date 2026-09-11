# Architecture decision records

ADRs capture decisions that affect the shape, ownership, or operating model of the platform. They are intentionally short; implementation details belong in the relevant engineering guide.

## Index

| ADR | Decision | Status |
| --- | --- | --- |
| 0001 | Start as a modular monolith | Accepted |
| 0002 | Organize work as feature slices | Accepted |
| 0003 | Keep persistence owned by each context | Accepted |
| 0004 | Communicate through public contracts and events | Accepted |

## ADR 0001: Modular monolith before microservices

**Status:** Accepted

### Context

The healthcare platform contains many capabilities, but splitting them into network services early increases deployment, observability, contract, consistency and operational complexity.

### Decision

Use one Nest deployable with strongly isolated bounded contexts and explicit public contracts.

### Consequences

We gain simpler transactions and operations now while preserving later extraction paths. Architectural boundary checks are mandatory because process boundaries no longer enforce isolation for us.

## ADR 0002: Feature slices inside bounded contexts

**Status:** Accepted

Large module-level controller/service files become merge-conflict and ownership hotspots. Therefore operations such as login, registration and password reset are independent feature folders/submodules with their own HTTP boundary, application handler and tests.

## ADR 0003: Module-owned persistence

**Status:** Accepted

The DB connection/pool is shared, but SQL repositories and query files remain private to their owning bounded context. This prevents a central model folder from becoming a coupling and merge-conflict hotspot.

## ADR 0004: Cross-module communication through public contracts/events

**Status:** Accepted

Modules must not import another module's implementation internals. Immediate decisions use narrow public facades; decoupled reactions use versioned events. External side effects that require durability should use an outbox pattern.

## When to add an ADR

Write an ADR when a change affects multiple contexts, public contracts, data ownership, consistency guarantees, deployment topology, security posture, or a decision that future contributors would otherwise have to rediscover.

Use the next sequential number and include context, decision, consequences, and status. Update the relevant handbook page when the decision changes day-to-day engineering rules.
