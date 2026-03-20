import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getHealthConfig, updateServiceConfig, ServiceConfig } from '../lib/health-config.js';

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

  // GET: Return current configuration
  if (req.method === 'GET') {
    const config = await getHealthConfig();
    return res.status(200).json(config);
  }

  // POST: Update configuration
  if (req.method === 'POST') {
    // Check for authorization only on POST
    const authHeader = req.headers.authorization;
    const configuredToken = process.env.HEALTH_CHECK_TOKEN;

    if (!configuredToken || !authHeader || authHeader !== `Bearer ${configuredToken}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { service, enabled, thresholds } = req.body;

    if (!service) {
      return res.status(400).json({ error: 'Service name required' });
    }

    const updates: Partial<ServiceConfig> = {};

    if (typeof enabled === 'boolean') {
      updates.enabled = enabled;
    }

    if (thresholds) {
      if (typeof thresholds.healthy === 'number' && typeof thresholds.degraded === 'number') {
          updates.thresholds = thresholds;
      } else {
          return res.status(400).json({ error: 'Invalid thresholds format' });
      }
    }

    try {
        const updatedConfig = await updateServiceConfig(service, updates);

        if (!updatedConfig) {
             return res.status(400).json({ error: 'Service not found' });
        }

        return res.status(200).json({
          message: 'Configuration updated',
          config: updatedConfig,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update configuration' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
