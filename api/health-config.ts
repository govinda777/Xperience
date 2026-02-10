import type { VercelRequest, VercelResponse } from '@vercel/node';
import { HEALTH_CONFIG, toggleService, updateThresholds } from './lib/health-config.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authentication
  const authHeader = req.headers.authorization;
  const configuredToken = process.env.HEALTH_CHECK_TOKEN;

  if (!configuredToken || !authHeader || authHeader !== `Bearer ${configuredToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET: Return current configuration
  if (req.method === 'GET') {
    return res.status(200).json(HEALTH_CONFIG);
  }

  // POST: Update configuration
  if (req.method === 'POST') {
    const { service, enabled, thresholds } = req.body;

    if (!service || !HEALTH_CONFIG[service]) {
      return res.status(400).json({ error: 'Service not found' });
    }

    if (typeof enabled === 'boolean') {
      toggleService(service, enabled);
    }

    if (thresholds) {
      if (typeof thresholds.healthy === 'number' && typeof thresholds.degraded === 'number') {
          updateThresholds(service, thresholds);
      } else {
          return res.status(400).json({ error: 'Invalid thresholds format' });
      }
    }

    return res.status(200).json({
      message: 'Configuration updated',
      config: HEALTH_CONFIG[service],
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
