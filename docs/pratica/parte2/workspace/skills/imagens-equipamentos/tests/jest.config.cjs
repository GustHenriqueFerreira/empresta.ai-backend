const path = require('node:path')
module.exports = {
  rootDir: path.resolve(__dirname, '..'), roots: ['<rootDir>/tests'], testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'], clearMocks: true, cache: false,
  transform: { '^.+\\.tsx?$': [path.resolve(__dirname, '../../../backend/node_modules/ts-jest'), { tsconfig: path.resolve(__dirname, '../tsconfig.json') }] },
}
