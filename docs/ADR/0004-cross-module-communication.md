# ADR 0004: Cross-module communication through public contracts/events

**Status:** Accepted

Modules must not import another module's implementation internals. Immediate decisions use narrow public facades; decoupled reactions use versioned events. External side effects that require durability should use an outbox pattern.
