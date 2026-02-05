export interface SitemapRoute {
  path: string;
  priority: string;
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  lastmod?: string;
}

export const sitemapRoutes: SitemapRoute[] = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "daily",
    lastmod: new Date().toISOString(),
  },
  {
    path: "/solutions",
    priority: "0.9",
    changefreq: "weekly",
    lastmod: new Date().toISOString(),
  },
  {
    path: "/plans",
    priority: "0.9",
    changefreq: "weekly",
    lastmod: new Date().toISOString(),
  },
  {
    path: "/about",
    priority: "0.7",
    changefreq: "monthly",
    lastmod: new Date().toISOString(),
  },
  {
    path: "/contact",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: new Date().toISOString(),
  },
  {
    path: "/community",
    priority: "0.8",
    changefreq: "weekly",
    lastmod: new Date().toISOString(),
  },
];

export const generateSitemap = (
  baseUrl: string = "https://xperience.com.br",
  routes: SitemapRoute[] = sitemapRoutes,
): string => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return sitemap;
};

export const generateSitemapFile = async (): Promise<void> => {
  return Promise.resolve();
};
