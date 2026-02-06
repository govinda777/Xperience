import { describe, expect, it, jest } from '@jest/globals';
import { SEOService } from '../../src/services/seoService';

// Mock global fetch
global.fetch = jest.fn() as unknown as jest.Mock;

// Mock import.meta.env
// We need to do this before importing the service if possible,
// or use a different approach if the service reads it at top-level.
// Since we are in a node environment (Jest), import.meta is not natively supported as in browser.
// We mocked the module via jest.mock or we can use a workaround.

// Workaround for import.meta.env in Jest
jest.mock('../../src/config/env', () => ({
  ENV: {
    VITE_PAGESPEED_API_KEY: 'test-key',
    VITE_GOOGLE_SEARCH_CONSOLE_API_KEY: 'test-key'
  }
}));

describe('SEOService', () => {
  it('should be defined', () => {
    expect(SEOService).toBeDefined();
  });

  // Add more tests as needed
});
