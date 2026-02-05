import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  // Use query param or environment variable for site URL
  const siteUrl = (request.query.siteUrl as string) || process.env.VITE_SITE_URL;

  if (!clientEmail || !privateKey) {
    console.error('GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY is missing');
    return response.status(500).json({ error: 'Server configuration error' });
  }

  if (!siteUrl) {
    return response.status(400).json({ error: 'siteUrl is required' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
      },
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.searchconsole({
      version: 'v1',
      auth,
    });

    // Fetch sitemaps to estimate indexed pages
    let indexedPages = 0;
    let totalPages = 0;

    try {
      const sitemapsRes = await searchconsole.sitemaps.list({
        siteUrl: siteUrl,
      });

      if (sitemapsRes.data.sitemap) {
        sitemapsRes.data.sitemap.forEach((sitemap) => {
          if (sitemap.contents) {
            sitemap.contents.forEach((content) => {
               // content.type is usually 'web', 'video', 'image', etc.
               if (content.type === 'web') {
                 totalPages += parseInt(content.submitted || '0', 10);
                 indexedPages += parseInt(content.indexed || '0', 10);
               }
            });
          }
        });
      }
    } catch (err) {
      console.warn('Failed to fetch sitemaps:', err);
      // Continue execution even if sitemaps fail
    }

    // Inspect the homepage to get crawl status
    let lastCrawl = null;
    let warnings: string[] = [];
    let errors: string[] = [];

    try {
      const inspectRes = await searchconsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: siteUrl,
          siteUrl: siteUrl,
        },
      });

      const inspectionResult = inspectRes.data.inspectionResult;

      if (inspectionResult) {
        if (inspectionResult.indexStatusResult) {
          lastCrawl = inspectionResult.indexStatusResult.lastCrawlTime || null;

          const verdict = inspectionResult.indexStatusResult.verdict;
          if (verdict && verdict !== 'PASS') {
             if (verdict === 'FAIL') {
               errors.push('Homepage indexing failed');
             } else if (verdict !== 'NEUTRAL') {
               warnings.push(`Homepage verdict: ${verdict}`);
             }
          }

          // Check for mobile usability issues if available
          if (inspectionResult.mobileUsabilityResult && inspectionResult.mobileUsabilityResult.verdict === 'FAIL') {
             warnings.push('Mobile usability issues detected');
          }
        }
      }
    } catch (err) {
      console.warn('Failed to inspect URL:', err);
      // Continue execution
    }

    return response.status(200).json({
      indexedPages,
      totalPages,
      errors,
      warnings,
      lastCrawl: lastCrawl || new Date().toISOString(),
    });

  } catch (error) {
    console.error('Google Search Console API Error:', error);
    return response.status(500).json({ error: 'Failed to fetch data from Google Search Console' });
  }
}
