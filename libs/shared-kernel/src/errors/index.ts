// * Shared kernel: Defines the public export boundary for shared-kernel errors.
// * File: src/errors/index.ts
// ? Keep this primitive stable, domain-neutral, and independent of platform or business modules.
// ! Consumers should import the error contract through this barrel instead of the implementation path.
export * from './application-error';
