# Database migrations

Keep schema changes owned by the bounded context that owns the table. If the migration runner requires a single ordered list, aggregate module migration paths here rather than moving all migration source files into a shared folder.

Never use `synchronize: true` outside throwaway local prototypes.
