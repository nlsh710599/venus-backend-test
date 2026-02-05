const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/*.e2e.test.ts'],
};
