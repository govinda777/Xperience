import { generateSitemap, generateSitemapFile, sitemapRoutes } from '../../utils/sitemap';

describe('Sitemap Utils', () => {
  describe('sitemapRoutes', () => {
    it('should contain all required routes', () => {
      const expectedPaths = ['/', '/solutions', '/plans', '/about', '/contact', '/community'];
      const actualPaths = sitemapRoutes.map(route => route.path);
      expect(actualPaths).toEqual(expectedPaths);
    });

    it('should have valid priorities for all routes', () => {
      sitemapRoutes.forEach(route => {
        const priority = parseFloat(route.priority);
        expect(priority).toBeGreaterThan(0);
        expect(priority).toBeLessThanOrEqual(1);
      });
    });

    it('should have valid changefreq values', () => {
      const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
      sitemapRoutes.forEach(route => {
        expect(validFreqs).toContain(route.changefreq);
      });
    });

    it('should have lastmod dates for all routes', () => {
      sitemapRoutes.forEach(route => {
        expect(route.lastmod).toBeDefined();
        expect(new Date(route.lastmod!).toString()).not.toBe('Invalid Date');
      });
    });
  });

  describe('generateSitemap', () => {
    it('should generate valid XML with default base URL', () => {
      const sitemap = generateSitemap();
      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(sitemap).toContain('</urlset>');
      
      // Check if all routes are included
      sitemapRoutes.forEach(route => {
        expect(sitemap).toContain(`<loc>https://xperience.com.br${route.path}</loc>`);
        expect(sitemap).toContain(`<priority>${route.priority}</priority>`);
        expect(sitemap).toContain(`<changefreq>${route.changefreq}</changefreq>`);
      });
    });

    it('should handle routes without lastmod', () => {
      const routeWithoutLastmod = {
        path: '/test',
        priority: '0.5',
        changefreq: 'weekly' as const
      };
      const sitemap = generateSitemap('https://test.com', [routeWithoutLastmod]);
      expect(sitemap).toContain(`<loc>https://test.com/test</loc>`);
      expect(sitemap).toContain(`<lastmod>`); // Should contain auto-generated lastmod
      expect(sitemap).toContain(`<changefreq>weekly</changefreq>`);
      expect(sitemap).toContain(`<priority>0.5</priority>`);
    });

    it('should use custom base URL when provided', () => {
      const customBaseUrl = 'https://custom.example.com';
      const sitemap = generateSitemap(customBaseUrl);
      sitemapRoutes.forEach(route => {
        expect(sitemap).toContain(`<loc>${customBaseUrl}${route.path}</loc>`);
      });
    });
  });

  describe('generateSitemapFile', () => {
    it('should resolve the promise', async () => {
      await expect(generateSitemapFile()).resolves.toBeUndefined();
    });
  });
});
