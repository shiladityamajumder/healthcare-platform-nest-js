# ADR 0001: Modular monolith before microservices

**Status:** Accepted

## Context

The healthcare platform contains many capabilities, but splitting them into network services early increases deployment, observability, contract, consistency and operational complexity.

## Decision

Use one Nest deployable with strongly isolated bounded contexts and explicit public contracts.

## Consequences

We gain simpler transactions and operations now while preserving later extraction paths. Architectural boundary checks are mandatory because process boundaries no longer enforce isolation for us.
