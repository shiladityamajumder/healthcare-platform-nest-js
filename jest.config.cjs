// * Linked with: the surrounding package and its exported types.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
/** @type {import('jest').Config} */
module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/libs/shared-kernel/src/$1',
    '^@platform/(.*)$': '<rootDir>/libs/platform/$1/src/index',
    '^@modules/(.*)$': '<rootDir>/libs/modules/$1/src/public-api',
  },
};
