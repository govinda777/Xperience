module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(svg|png|jpg|jpeg|gif)$": "identity-obj-proxy",
    "^nationfun/AgentDashboard$": "<rootDir>/src/__mocks__/nationfun/AgentDashboard.ts",
    "^nationfun/AgentList$": "<rootDir>/src/__mocks__/nationfun/AgentList.ts",
    '^@/config/env$': '<rootDir>/src/__mocks__/env.ts',
    '^@/config/payment$': '<rootDir>/src/__mocks__/payment.ts',
    '^@/services/providers/pixPaymentProvider$': '<rootDir>/src/__mocks__/services/providers/pixPaymentProvider.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-router|react-router-dom|@privy-io|jose|@tanstack|lucide-react)/)",
  ],
  globals: {
    "import.meta": {
      env: {
        VITE_MERCADO_PAGO_PUBLIC_KEY: "test-key",
        VITE_RPC_URL: "http://localhost:8545",
        VITE_GA_MEASUREMENT_ID: "G-TEST123",
        VITE_PRIVY_APP_ID: "test-app-id",
      },
      url: "file://test",
    },
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/__tests__/**",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.stories.{ts,tsx}",
    "!src/**/index.{ts,tsx}",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json-summary"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
    "./src/components/": {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    "./src/services/": {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    "./src/hooks/": {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    "./src/utils/": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    "./src/components/payments/": {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    "./src/services/providers/": {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx}",
    "<rootDir>/__tests__/**/*.{ts,tsx}",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  verbose: true,
};
