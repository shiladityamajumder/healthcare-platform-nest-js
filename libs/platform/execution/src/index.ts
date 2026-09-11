// * Linked with: ./execution.module, ./execution.service, ./non-transactional.decorator.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
export * from './execution.module';
// * Define the shared types or behavior used by the surrounding package.
export * from './execution.service';
export * from './non-transactional.decorator';
export * from './operation-execution.interceptor';
