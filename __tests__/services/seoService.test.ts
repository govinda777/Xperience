import { SEOService } from '../../src/services/seoService';
import { ENV } from '../../src/config/env';

// Mock fetch
global.fetch = jest.fn();

describe('SEOService', () => {
  let service: SEOService;
  const originalEnv = { ...ENV };

  beforeEach(() => {
    service = SEOService.getInstance();
    jest.clearAllMocks();
    // Restore env
    Object.assign(ENV, originalEnv);
  });

  it('checkIndexationStatus should call API in production', async () => {
    // Mock production environment
    (ENV as any).VITE_ENVIRONMENT = 'production';
    (ENV as any).VITE_API_URL = 'https://api.example.com';
    (ENV as any).VITE_SITE_URL = 'https://site.example.com';

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        indexedPages: 5,
        totalPages: 10,
        errors: [],
        warnings: [],
        lastCrawl: '2023-10-27T00:00:00Z'
      }),
    });

    const result = await service.checkIndexationStatus();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/search-console?siteUrl=https%3A%2F%2Fsite.example.com'
    );
    expect(result).toEqual({
      indexedPages: 5,
      totalPages: 10,
      errors: [],
      warnings: [],
      lastCrawl: '2023-10-27T00:00:00Z'
    });
  });

  it('checkIndexationStatus should return mock data in development', async () => {
     (ENV as any).VITE_ENVIRONMENT = 'development';

     const result = await service.checkIndexationStatus();
     expect(result).not.toBeNull();
     expect(result.indexedPages).toBe(6);
     expect(global.fetch).not.toHaveBeenCalled();
  });
});
