const jestConfig = {
  testMatch: ['<rootDir>/test/?(*.)+(spec|test).ts'],
  transform: { '\\.[jt]s?$': ['ts-jest', { tsconfig: { allowJs: true } }] },  // allowJs is required for get-port
  //transformIgnorePatterns: ['node_modules/(?!get-port/.*)'],  // you might need to ignore some packages
  transformIgnorePatterns: [
    'node_modules/(?!(get-port|@planetscale/database)/.*)'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.[jt]s$': '$1',
  },
  // ...
}

module.exports = jestConfig