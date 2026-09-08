# Deployment model

The repository produces **one backend deployable**. All business modules run in the same Nest process initially.

Recommended production shape:

- multiple stateless API replicas behind a load balancer;
- PostgreSQL as system of record;
- Redis only for explicit cache/lock/rate-limit use cases;
- object storage for files;
- queue/broker only for workflows that genuinely need asynchronous durability;
- centralized secrets, logs, metrics and traces.

Scale the monolith horizontally first. Extract a module only when independent scaling, release cadence, team autonomy or fault isolation justifies the operational cost.
