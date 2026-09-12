/**
 * Public export boundary for the auth bounded context.
 * Used backward by AppModule and external modules; connects forward only to AuthModule and AuthFacade.
 */
export * from './auth.module';
export * from './contracts/auth.facade';
