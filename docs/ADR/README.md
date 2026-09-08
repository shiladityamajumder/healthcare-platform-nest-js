# Architecture decision records

ADRs capture decisions that affect the shape, ownership, or operating model of the platform. They are intentionally short; implementation details belong in the relevant engineering guide.

| ADR                                        | Decision                                        | Status   |
| ------------------------------------------ | ----------------------------------------------- | -------- |
| [0001](0001-modular-monolith.md)           | Start as a modular monolith                     | Accepted |
| [0002](0002-feature-slices.md)             | Organize work as feature slices                 | Accepted |
| [0003](0003-module-owned-persistence.md)   | Keep persistence owned by each context          | Accepted |
| [0004](0004-cross-module-communication.md) | Communicate through public contracts and events | Accepted |

## When to add an ADR

Write an ADR when a change affects multiple contexts, public contracts, data ownership, consistency guarantees, deployment topology, security posture, or a decision that future contributors would otherwise have to rediscover.

Use the next sequential number and include context, decision, consequences, and status. Update the relevant handbook page when the decision changes day-to-day engineering rules.
