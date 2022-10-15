module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.+(ts|tsx)", "**/tests/*.+(ts|tsx)"],
  testPathIgnorePatterns: ["node_modules/", "/dist/"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "@exmpl/(.*)": "<rootDir>/src/$1",
  },
  testTimeout: 30000,
};
