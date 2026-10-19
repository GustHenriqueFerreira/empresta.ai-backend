module.exports = {
  testEnvironment: 'node', testMatch: ['**/*.spec.ts'], cacheDirectory: '<rootDir>/.cache/jest',
  clearMocks: true, transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { experimentalDecorators: true, emitDecoratorMetadata: true, esModuleInterop: true } }] },
}
