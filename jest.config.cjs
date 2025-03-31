module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
  },
  rootDir: './',
  testRegex: '.*\\.(test|spec|try)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
  collectCoverageFrom: ['**/*controller.ts', '**/*service.ts', '**/*processor.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};
