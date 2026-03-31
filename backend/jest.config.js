module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/config/initDb.js',
    '!src/config/seedDb.js',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
