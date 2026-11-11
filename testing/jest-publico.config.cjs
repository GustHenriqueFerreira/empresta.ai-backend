// Execução explicitamente separada. Somente GET público; sem .env, conta ou escrita remota.
module.exports = { rootDir: '..', roots: ['<rootDir>/testing'],
  testMatch: ['**/publicadas.spec.cjs'], testEnvironment: 'node', cache: false }
