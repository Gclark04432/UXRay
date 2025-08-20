// Test setup file for UXRay
// This file runs before each test file

// Set test timeout to 10 seconds for complex parsing operations
jest.setTimeout(10000);

// Global test utilities can be added here
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}; 