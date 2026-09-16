# Security platform library

<p><img src="https://img.shields.io/badge/Platform-Security%20Foundation-B91C1C?logo=owasp&logoColor=white" alt="Security platform foundation" /></p>

Reserved technical composition boundary for shared guards, cryptographic providers, and security policies. It must not import a business bounded context.

`SecurityModule` is currently an empty Nest module and is not imported by `AppModule`. The live auth context owns JWT/session behavior and Argon2 password hashing. HTTP validation, standard error mapping, request identifiers, and log redaction are implemented in their respective platform layers.

Do not move auth business rules into this library. Add only genuinely cross-context technical contracts such as reusable guards or cryptographic primitives, and expose them through the public index.
