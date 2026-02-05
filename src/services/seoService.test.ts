import { SEOService } from './seoService';
import { ENV } from '../config/env';

// Mock the environment config
jest.mock('../config/env', () => ({
  ENV: {
    VITE_ENVIRONMENT: 'test',
    VITE_PAGESPEED_API_KEY: '',
    VITE_SITE_URL: 'https://test.com',
  },
}));

// Mock fetch global
global.fetch = jest.fn();

describe('SEOService', () => {
  let seoService: SEOService;

  beforeEach(() => {
    seoService = SEOService.getInstance();
    seoService.clearCache();
    jest.clearAllMocks();
    (ENV as any).VITE_ENVIRONMENT = 'test';
    (ENV as any).VITE_PAGESPEED_API_KEY = '';
  });

  describe('auditPagePerformance', () => {
    it('should return mock data when not in production and no API key', async () => {
      (ENV as any).VITE_ENVIRONMENT = 'development';
      (ENV as any).VITE_PAGESPEED_API_KEY = '';

      const result = await seoService.auditPagePerformance('https://example.com');

      expect(result).toBeDefined();
      expect(result?.metrics).toBeDefined();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should call PageSpeed API when API key is present', async () => {
      (ENV as any).VITE_PAGESPEED_API_KEY = 'valid-api-key';

      const mockApiResponse = {
        lighthouseResult: {
          categories: {
            performance: { score: 0.95 }
          },
          audits: {
            'largest-contentful-paint': { numericValue: 1200 },
            'max-potential-fid': { numericValue: 50 },
            'cumulative-layout-shift': { numericValue: 0.05 },
            'first-contentful-paint': { numericValue: 800 },
            'server-response-time': { numericValue: 100 },
            'unused-javascript': {
              details: { type: 'opportunity' },
              title: 'Remove unused JS'
            }
          }
        }
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await seoService.auditPagePerformance('https://example.com');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('key=valid-api-key')
      );
      expect(result).toEqual({
        url: 'https://example.com',
        score: 95,
        metrics: {
          lcp: 1200,
          fid: 50,
          cls: 0.05,
          fcp: 800,
          ttfb: 100,
        },
        opportunities: ['Remove unused JS'],
        timestamp: expect.any(String),
      });
    });

    it('should return cached data if available', async () => {
       (ENV as any).VITE_PAGESPEED_API_KEY = 'valid-api-key';

       const mockApiResponse = {
        lighthouseResult: {
          categories: { performance: { score: 0.9 } },
          audits: {}
        }
      };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      // First call
      await seoService.auditPagePerformance('https://example.com');

      // Second call
      const result = await seoService.auditPagePerformance('https://example.com');

      // Fetch should be called only once
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });

    it('should return null on API failure', async () => {
      (ENV as any).VITE_PAGESPEED_API_KEY = 'valid-api-key';

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
      });

      const result = await seoService.auditPagePerformance('https://example.com');

      expect(result).toBeNull();
    });

     it('should return null if API key is missing in production', async () => {
      (ENV as any).VITE_ENVIRONMENT = 'production';
      (ENV as any).VITE_PAGESPEED_API_KEY = '';

      const result = await seoService.auditPagePerformance('https://example.com');

      expect(result).toBeNull();
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
