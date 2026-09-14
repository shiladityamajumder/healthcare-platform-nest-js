// * Auth module: Defines the public export boundary for the authentication bounded context.
// * File: src/public-api.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Public export boundary for the auth bounded context.
 * Used backward by AppModule and external modules; connects forward only to AuthModule and AuthFacade.
 */
export * from './auth.module';
export * from './contracts/auth.facade';
