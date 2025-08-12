module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: { module: 'commonjs', esModuleInterop: true, target: 'ES2020', moduleResolution: 'node', skipLibCheck: true, types: ['jest', 'node'] } }],
  },
};
