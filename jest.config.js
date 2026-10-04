module.exports = {
  preset: "jest-expo",
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/e2e/", "<rootDir>/dist/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
