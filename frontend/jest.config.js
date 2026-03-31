module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js?(x)', '**/__tests__/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  // Transform ES modules from expo packages if needed
  transformIgnorePatterns: [
    'node_modules/(?!(expo|@expo|react-native|@react-native|@react-navigation|@testing-library)/)',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
  },
  collectCoverageFrom: ['src/**/*.js', 'src/**/*.jsx'],
  verbose: true,
};
