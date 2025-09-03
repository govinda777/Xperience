/**
 * Test setup script for Xperience application
 * This script sets up the testing environment and utilities
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create reports directory if it doesn't exist
const reportsDir = path.join(__dirname, "..", "reports");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
  console.log("📁 Created reports directory");
}

// Create test data directory if it doesn't exist
const testDataDir = path.join(__dirname, "..", "test-data");
if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir, { recursive: true });
  console.log("📁 Created test-data directory");
}

// Setup environment variables for testing
process.env.NODE_ENV = "test";
process.env.REACT_APP_API_URL = "http://localhost:3001";
process.env.REACT_APP_AUTH0_DOMAIN = "test.auth0.com";
process.env.REACT_APP_AUTH0_CLIENT_ID = "test-client-id";
process.env.MERCADOPAGO_ACCESS_TOKEN = "test-mp-token";

console.log("🔧 Test environment configured");

// Mock external services for testing
const mockServices = {
  auth0: {
    domain: "test.auth0.com",
    clientId: "test-client-id",
    audience: "test-audience",
  },
  mercadopago: {
    accessToken: "test-mp-token",
    publicKey: "test-mp-public-key",
  },
  coingecko: {
    baseUrl: "https://api.coingecko.com/api/v3",
  },
};

// Write mock configuration
const mockConfigPath = path.join(testDataDir, "mock-config.json");
fs.writeFileSync(mockConfigPath, JSON.stringify(mockServices, null, 2));
console.log("🎭 Mock services configuration created");

// Create test users data
const testUsers = [
  {
    id: "test-user-1",
    email: "test1@xperience.com",
    name: "Test User 1",
    sub: "auth0|test-user-1",
    wallet: {
      address: "test-wallet-address-1",
      smartAccountAddress: "test-smart-account-1",
      balance: "1.5",
    },
  },
  {
    id: "test-user-2",
    email: "test2@xperience.com",
    name: "Test User 2",
    sub: "auth0|test-user-2",
    wallet: {
      address: "test-wallet-address-2",
      smartAccountAddress: "test-smart-account-2",
      balance: "2.3",
    },
  },
];

const testUsersPath = path.join(testDataDir, "test-users.json");
fs.writeFileSync(testUsersPath, JSON.stringify(testUsers, null, 2));
console.log("👥 Test users data created");

// Create test plans data
const testPlans = [
  {
    id: "essential",
    name: "Essencial",
    price: 297.0,
    currency: "BRL",
    features: ["Acesso básico", "Suporte por email", "30 dias de garantia"],
  },
  {
    id: "expert",
    name: "Expert",
    price: 497.0,
    currency: "BRL",
    features: [
      "Acesso completo",
      "Suporte prioritário",
      "Mentoria 1:1",
      "60 dias de garantia",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 797.0,
    currency: "BRL",
    features: [
      "Acesso vitalício",
      "Suporte 24/7",
      "Mentoria ilimitada",
      "Garantia vitalícia",
    ],
  },
];

const testPlansPath = path.join(testDataDir, "test-plans.json");
fs.writeFileSync(testPlansPath, JSON.stringify(testPlans, null, 2));
console.log("📋 Test plans data created");

// Create test transactions data
const testTransactions = [
  {
    id: "tx-1",
    userId: "test-user-1",
    planId: "essential",
    amount: 297.0,
    currency: "BRL",
    provider: "pix",
    status: "completed",
    transactionId: "mp-123456",
    createdAt: "2023-01-01T10:00:00Z",
    completedAt: "2023-01-01T10:01:00Z",
  },
  {
    id: "tx-2",
    userId: "test-user-2",
    planId: "expert",
    amount: 0.0083,
    currency: "BTC",
    provider: "bitcoin",
    status: "pending",
    transactionId: "btc-789012",
    createdAt: "2023-01-02T14:30:00Z",
  },
];

const testTransactionsPath = path.join(testDataDir, "test-transactions.json");
fs.writeFileSync(
  testTransactionsPath,
  JSON.stringify(testTransactions, null, 2),
);
console.log("💳 Test transactions data created");

console.log("✅ Test setup completed successfully!");
console.log("");
console.log("Available test commands:");
console.log("  npm run test:unit        - Run unit tests");
console.log("  npm run test:bdd         - Run BDD tests");
console.log("  npm run test:coverage    - Run tests with coverage");
console.log("  npm run test:all         - Run all tests");
console.log("  npm run reports          - Generate all reports");
console.log("");
