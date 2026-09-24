// * Linked with: ./pricing.module, ./contracts/pricing.facade.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
// ? Keep the package export surface limited to the pricing module and its stable integration seam.
// ! Do not export controllers, repositories, or transport implementation details from this file.
export * from './pricing.module';
// * Define the shared types or behavior used by the surrounding package.
export * from './contracts/pricing.facade';
