import { ENV } from "../config/env";
import * as testConfig from "../../test-data/test-config.json";

export interface SEOMetrics {
  organicSessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{
    page: string;
    views: number;
    bounceRate: number;
  }>;
  searchQueries: Array<{
    query: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
}

export interface PerformanceAudit {
  url: string;
  score: number;
  metrics: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    ttfb: number;
  };
  opportunities: string[];
  timestamp: string;
}

export class SEOService {
  private static instance: SEOService;
  private metricsCache: Map<string, any> = new Map();
  private cacheTimeout = 6 * 60 * 60 * 1000; // 6 horas

  static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  // Coleta métricas do Google Analytics
  async collectGA4Metrics(): Promise<SEOMetrics | null> {
    const cacheKey = "ga4_metrics";
    const cached = this.getCachedData(cacheKey);

    if (cached) return cached;

    try {
      // Em produção, isso faria uma chamada real para a API do GA4
      // Por enquanto, retornamos dados mock para desenvolvimento
      if (ENV.VITE_ENVIRONMENT !== "production") {
        const mockMetrics: SEOMetrics = {
          organicSessions: Math.floor(Math.random() * 1000) + 500,
          pageViews: Math.floor(Math.random() * 2000) + 1000,
          bounceRate: Math.floor(Math.random() * 30) + 40,
          avgSessionDuration: Math.floor(Math.random() * 180) + 120,
          topPages: [
            { page: "/", views: 450, bounceRate: 35 },
            { page: "/solutions", views: 280, bounceRate: 42 },
            { page: "/plans", views: 220, bounceRate: 38 },
            { page: "/about", views: 150, bounceRate: 45 },
            { page: "/contact", views: 120, bounceRate: 25 },
          ],
          searchQueries: [
            {
              query: "mentoria empresarial",
              impressions: 1200,
              clicks: 85,
              ctr: 7.1,
              position: 3.2,
            },
            {
              query: "consultoria para empreendedores",
              impressions: 980,
              clicks: 62,
              ctr: 6.3,
              position: 4.1,
            },
            {
              query: "IA do empreendedor",
              impressions: 750,
              clicks: 95,
              ctr: 12.7,
              position: 2.1,
            },
          ],
        };

        this.setCachedData(cacheKey, mockMetrics);
        return mockMetrics;
      }

      // TODO: Implementar integração real com GA4 API
      // const response = await fetch(`https://analyticsreporting.googleapis.com/v4/reports:batchGet`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     reportRequests: [{
      //       viewId: ENV.VITE_GA_VIEW_ID,
      //       dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      //       metrics: [
      //         { expression: 'ga:sessions' },
      //         { expression: 'ga:pageviews' },
      //         { expression: 'ga:bounceRate' },
      //         { expression: 'ga:avgSessionDuration' }
      //       ],
      //       dimensions: [{ name: 'ga:pagePath' }]
      //     }]
      //   })
      // });

      return null;
    } catch (error) {
      console.error("Erro ao coletar métricas GA4:", error);
      return null;
    }
  }

  // Auditoria de performance usando PageSpeed Insights API
  async auditPagePerformance(url: string): Promise<PerformanceAudit | null> {
    const cacheKey = `performance_${url}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) return cached;

    try {
      // Em desenvolvimento, retornar dados mock apenas se não houver chave de API configurada
      if (ENV.VITE_ENVIRONMENT !== "production" && !ENV.VITE_PAGESPEED_API_KEY) {
        const mockAudit: PerformanceAudit = {
          url,
          score: Math.floor(Math.random() * 30) + 70, // Score entre 70-100
          metrics: {
            lcp: Math.random() * 2000 + 1500, // 1.5s - 3.5s
            fid: Math.random() * 80 + 20, // 20ms - 100ms
            cls: Math.random() * 0.15, // 0 - 0.15
            fcp: Math.random() * 1500 + 1000, // 1s - 2.5s
            ttfb: Math.random() * 500 + 200, // 200ms - 700ms
          },
          opportunities: [
            "Otimizar imagens",
            "Minificar CSS e JavaScript",
            "Implementar cache do navegador",
            "Reduzir tempo de resposta do servidor",
          ],
          timestamp: new Date().toISOString(),
        };

        this.setCachedData(cacheKey, mockAudit);
        return mockAudit;
      }

      const apiKey = ENV.VITE_PAGESPEED_API_KEY;

      if (!apiKey) {
        console.warn("PageSpeed API Key missing.");
        return null;
      }

      const response = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&category=performance`
      );

      if (!response.ok) {
        throw new Error(`PageSpeed API error: ${response.statusText}`);
      }

      const data = await response.json();
      const lighthouse = data.lighthouseResult;
      const audits = lighthouse.audits;

      const performanceAudit: PerformanceAudit = {
        url,
        score: (lighthouse.categories.performance.score || 0) * 100,
        metrics: {
          lcp: audits['largest-contentful-paint']?.numericValue || 0,
          fid: audits['max-potential-fid']?.numericValue || 0,
          cls: audits['cumulative-layout-shift']?.numericValue || 0,
          fcp: audits['first-contentful-paint']?.numericValue || 0,
          ttfb: audits['server-response-time']?.numericValue || 0,
        },
        opportunities: Object.values(audits)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((audit: any) => audit.details && audit.details.type === 'opportunity')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((audit: any) => audit.title),
        timestamp: new Date().toISOString(),
      };

      this.setCachedData(cacheKey, performanceAudit);
      return performanceAudit;
    } catch (error) {
      console.error("Erro na auditoria de performance:", error);
      return null;
    }
  }

  // Verificar status de indexação no Google Search Console
  async checkIndexationStatus(): Promise<any> {
    try {
      // Em desenvolvimento, retornar dados mock
      if (ENV.VITE_ENVIRONMENT !== "production") {
        return {
          indexedPages: 6,
          totalPages: 6,
          errors: [],
          warnings: [
            "Algumas páginas têm meta descriptions muito longas",
            "Faltam alt texts em algumas imagens",
          ],
          lastCrawl: new Date().toISOString(),
        };
      }

      const siteUrl = ENV.VITE_SITE_URL;
      const response = await fetch(`${ENV.VITE_API_URL}/search-console?siteUrl=${encodeURIComponent(siteUrl)}`);

      if (!response.ok) {
        // Fallback to null silently in case of error, logging it
        console.warn(`Failed to fetch search console data: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao verificar indexação:", error);
      return null;
    }
  }

  // Gerar sitemap dinamicamente
  generateSitemap(): string {
    const routes = [
      { path: "/", priority: "1.0", changefreq: "daily" },
      { path: "/solutions", priority: "0.9", changefreq: "weekly" },
      { path: "/plans", priority: "0.9", changefreq: "weekly" },
      { path: "/about", priority: "0.7", changefreq: "monthly" },
      { path: "/contact", priority: "0.8", changefreq: "monthly" },
      { path: "/community", priority: "0.8", changefreq: "weekly" },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${ENV.VITE_SITE_URL}${route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    return sitemap;
  }

  // Análise de palavras-chave
  async analyzeKeywords(content: string): Promise<any> {
    try {
      // Análise básica de densidade de palavras-chave
      const words = content
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 3);

      const wordCount: Record<string, number> = {};
      words.forEach((word) => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });

      const sortedWords = Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      return {
        totalWords: words.length,
        uniqueWords: Object.keys(wordCount).length,
        topKeywords: sortedWords.map(([word, count]) => ({
          word,
          count,
          density: ((count / words.length) * 100).toFixed(2),
        })),
      };
    } catch (error) {
      console.error("Erro na análise de palavras-chave:", error);
      return null;
    }
  }

  // Métodos auxiliares para cache
  private getCachedData(key: string): any {
    const cached = this.metricsCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.metricsCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Limpar cache
  clearCache(): void {
    this.metricsCache.clear();
  }
}

export default SEOService;
