const path = require('node:path')
module.exports = {
  rootDir: __dirname, roots: ['<rootDir>/tests'], testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'], cache: false, clearMocks: true,
  transform: { '^.+\\.tsx?$': [path.resolve(__dirname, '../../../node_modules/ts-jest'), { tsconfig: path.resolve(__dirname, 'tsconfig.json') }] },
}
