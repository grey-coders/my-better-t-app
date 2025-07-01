module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
     "\\.[jt]sx?$": "babel-jest",
  },
  extensionsToTreatAsEsm: ['.ts']
};
  